# Chat Document - Flow & Integration

## Complete Flow: User Sends Message

### Step 1: User Types & Sends Message
```
┌─────────────────────────────────────────────┐
│  User types: "Email follow-up cho khách"    │
│  Presses Enter or clicks Send button        │
└─────────────────────────────────────────────┘
```

### Step 2: Frontend (ChatView.vue) Processing
```
1. Validate message:
   - Check if not empty
   - Check if not already sending
   
2. Show optimistic UI:
   - Add user message to displayMessages[]
   - Add loading AI message (empty content, pending=true)
   - Clear input field
   
3. Try to stream response:
   - Call streamChatMessage(conversationId, message)
   - Listen to onChunk updates
   - Update pending message content incrementally
   
4. If stream fails:
   - Fallback to sendChatMessage()
   - Get full response at once
   - Update pending message
   
5. After message sent:
   - invalidateQueries() to refetch conversations & messages
   - Backend state now has persisted data
```

### Step 3: Backend (server.mjs) Processing

#### Route: POST /api/chat/conversations/:conversationId/messages

```javascript
// Receive message
const messageText = "Email follow-up cho khách"

// 1. Get or create conversation messages state
const messages = getOrCreateConversationMessages("chat-1")

// 2. Create user message object
const userMessage = {
  id: "msg-chat-1-1777964313975-user",
  conversationId: "chat-1",
  role: "user",
  content: "Email follow-up cho khách",
  createdAt: "2026-05-05T06:58:33.975Z"
}

// 3. Save user message to state
messages.push(userMessage)

// 4. Generate AI response based on keywords
const aiResponse = generateAiResponse(messageText)
// Result: "Tôi sẽ giúp bạn soạn email chuyên nghiệp:..."

// 5. Create assistant message object
const assistantMessage = {
  id: "msg-chat-1-1777964313975-ai",
  conversationId: "chat-1",
  role: "assistant",
  content: aiResponse,
  createdAt: "2026-05-05T06:58:33.975Z"
}

// 6. Save AI message to state
messages.push(assistantMessage)

// 7. Return to frontend
return {
  conversationId: "chat-1",
  message: assistantMessage,
  assistantMessage
}
```

### Step 4: Frontend Receives Response

Frontend receives the response from step 3 and either:
- **Streaming**: Updates UI incrementally (char by char)
- **Fallback**: Updates entire message at once

### Step 5: Data Persistence

When invalidateQueries() is called:
```
GET /api/chat/conversations/chat-1/messages

Response includes:
[
  {...4 original seed messages...},
  {id: "...user", role: "user", content: "Email follow-up cho khách", ...},
  {id: "...ai", role: "assistant", content: "Tôi sẽ giúp...", ...}
]
```

---

## Feature: Select Document Context

### User Clicks on Document in LibraryTree

```
┌──────────────────────────────────┐
│  LibraryTree (Left Panel)        │
│  ├── Sales Playbook (folder)     │
│  │   ├── Onboarding (folder)     │
│  │   ├── Call Scripts (folder)   │
│  │   └── [PDF] Company Overview  │
│  └── Policy (folder)             │
│      └── [PDF] Security Policy   │
└──────────────────────────────────┘
         │ User clicks
         ↓
    Node Selected Event
```

### Flow in ChatView.vue

```typescript
async function setChatContext(node: LibraryNode) {
  // 1. Get current conversation ID
  const conversationId = resolveConversationId()
  
  // 2. Call library store to set context
  const result = await libraryStore.applyChatContext(
    conversationId,      // "chat-1"
    node.id,             // "2"
    node.type            // "folder"
  )
  
  // 3. Update selected context display
  selectedContextNode.value = node
}
```

### Backend: POST /api/v1/chats/:chatId/context

```javascript
const payload = {
  node_id: "2",
  node_type: "folder"
}

// 1. Find the node in library
const node = library.nodes.find(
  item => item.id === nodeId && item.type === nodeType
)
// Result: {id: "2", name: "Sales Playbook", type: "folder", ...}

// 2. Create context object
const context = {
  chat_id: "chat-1",
  node_id: "2",
  node_type: "folder",
  node_name: "Sales Playbook",
  org_id: "demo-org",
  updated_at: "2026-05-05T06:58:53.532Z"
}

// 3. Save context
chatContexts.set("chat-1", context)

// 4. Return context to frontend
return context
```

### Frontend Display

```
┌────────────────────────────────────────────────────┐
│  After selecting document:                         │
│  ┌────────────────────────────────────────────┐  │
│  │ 📄 Đang chat với: Sales Playbook   [Đổi]  │  │
│  └────────────────────────────────────────────┘  │
│                                                    │
│  Questions will now be answered based on this     │
│  document context (using AI with document context)│
└────────────────────────────────────────────────────┘
```

---

## Data Flow: Library Tree Loading

### Initial Load (ChatView.vue mounted)

```typescript
onMounted(() => {
  // 1. Fetch library tree from backend
  void libraryStore.fetchTree()
  
  // 2. Setup WebSocket for real-time updates
  libraryStore.initRealtime()
})
```

### Library Store Action: fetchTree()

```typescript
async function fetchTree() {
  // 1. Check cache (localStorage)
  // 2. If cache is fresh (TTL < 5 min), return cache
  // 3. Otherwise, call backend API
  const result = await fetchLibraryTree({ include_counts: true })
  
  // 4. Store in state
  tree.value = result.data
  lastFetchedAt.value = Date.now()
  
  // 5. Write to localStorage cache
  writeCache({ tree: result.data, fetchedAt: Date.now() })
}
```

### Backend Response: GET /api/v1/library/tree

```javascript
// 1. Check user auth/permissions
const auth = getAuthContext(req)

// 2. Get library state
const library = getOrCreateLibraryState(auth.orgId)

// 3. Build children index for recursive tree building
const childrenMap = buildChildrenIndex(library.nodes)

// 4. Convert to tree format with permission checks
const tree = toTreeNodes(
  library.nodes,
  childrenMap,
  auth.role,
  includeCounts,
  parentId
)

// 5. Return tree structure
return tree
```

### Resulting Tree Structure

```javascript
[
  {
    id: "2",
    name: "Sales Playbook",
    type: "folder",
    parent_id: null,
    children: [
      {
        id: "3",
        name: "Onboarding",
        type: "folder",
        children: [...],
        total_children: 1
      },
      {
        id: "7",
        name: "Company Overview.pdf",
        type: "document",
        children: []
      }
    ],
    documents_count: 3
  },
  {
    id: "5",
    name: "Policy",
    type: "folder",
    children: [...],
    documents_count: 1
  }
]
```

### Frontend Display

```
LibraryTree Component renders:
├─ Sales Playbook (folder icon)
│  ├─ Onboarding (folder icon)
│  ├─ Call Scripts (folder icon)
│  └─ Company Overview.pdf (document icon)
└─ Policy (folder icon)
   └─ Security Policy.pdf (document icon)

User can:
- Click folder/document to select as context
- Click folder to expand/collapse children
- See document count for each folder
```

---

## Smart AI Response Generation

### Function: generateAiResponse(userMessage)

```javascript
function generateAiResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase()
  
  // Keyword-based response selection
  if (lowerMessage.includes('báo giá') || lowerMessage.includes('gia')) {
    return "Dựa trên báo giá của bạn..."
  }
  
  if (lowerMessage.includes('email') || lowerMessage.includes('gửi')) {
    return "Tôi sẽ giúp bạn soạn email chuyên nghiệp..."
  }
  
  if (lowerMessage.includes('phân tích') || lowerMessage.includes('so sánh')) {
    return "Tôi sẽ phân tích chi tiết cho bạn..."
  }
  
  if (lowerMessage.includes('faq') || lowerMessage.includes('câu hỏi')) {
    return "Dưới đây là 5 câu hỏi thường gặp..."
  }
  
  // Default response
  return "Cảm ơn bạn đã gửi câu hỏi..."
}
```

### Response Examples

| User Input | System detects | AI Response |
|-----------|-----------------|------------|
| "Báo giá Q2?" | keyword: báo giá | Detailed pricing analysis |
| "Gửi email cho khách" | keyword: email | Professional email template |
| "So sánh 2 hợp đồng" | keyword: so sánh | Detailed comparison |
| "Tạo FAQ" | keyword: faq | 5-point FAQ list |
| "Xin chào" | no match | General greeting + prompt for document |

---

## State Management

### In-Memory Storage (backend/server.mjs)

```javascript
// Global state maps
const conversationMessagesState = new Map()
// Key: conversationId
// Value: Array<ChatMessage>

const chatContexts = new Map()
// Key: chatId
// Value: ChatContext

const orgLibraryState = new Map()
// Key: orgId
// Value: {nodes: LibraryNode[]}

const dashboardChatState = new Map()
// Key: orgId
// Value: Array<Conversation>
```

### Example: After User Sends 2 Messages

```javascript
conversationMessagesState = {
  "chat-1": [
    // Original seed messages
    {id: "msg-chat-1-1", role: "user", content: "Phân tích ba điểm..."},
    {id: "msg-chat-1-2", role: "assistant", content: "Dựa trên báo giá Q2..."},
    {id: "msg-chat-1-3", role: "user", content: "Hãy tạo một email..."},
    {id: "msg-chat-1-4", role: "assistant", content: "Kính gửi..."},
    
    // New messages from user
    {id: "msg-chat-1-1777964313975-user", role: "user", content: "Email follow-up cho khách"},
    {id: "msg-chat-1-1777964313975-ai", role: "assistant", content: "Tôi sẽ giúp..."},
  ]
}
```

---

## WebSocket: Real-time Library Updates

### LibraryTree Change Detection

When library is modified (add/delete folder/document):
```
Backend broadcasts to all connected clients:
  - event: "folder.created" / "document.created" / "*.deleted"
  - payload: {id, name, parent_id, ...}

Frontend receives & auto-refreshes:
  - Invalidates query cache
  - Refetches tree
  - UI updates instantly
```

### Usage in ChatView.vue

```typescript
onMounted(() => {
  libraryStore.initRealtime()  // Start WebSocket listener
})

onUnmounted(() => {
  libraryStore.releaseRealtime()  // Cleanup
})
```

---

## Error Handling

### Network Error → Fallback Response

```
┌─────────────────────────────────────┐
│  User sends message                 │
└─────────────────────────────────────┘
         │ Network Error!
         ↓
Try streaming response failed
         │
         ↓ Fallback to POST
Try POST endpoint
         ├─ Success: Use response
         └─ Failure: Show error toast
```

### Message Validation

```
POST /api/chat/conversations/:chatId/messages
├─ Check: messageText not empty
├─ Check: conversationId exists
└─ Result: Error or new message saved
```

---

## Performance Optimizations

1. **Caching**: Library tree cached in localStorage (TTL: 5 min)
2. **Pagination**: Large folders use lazy loading
3. **Streaming**: AI responses streamed character-by-character
4. **Query Deduplication**: tanstack-query prevents duplicate requests
5. **WebSocket**: Real-time updates without polling

---

## Sequence Diagram: Complete Message Flow

```
USER              FRONTEND            VITE PROXY        BACKEND
 │                  │                     │                │
 │ Type message     │                     │                │
 ├─────────────────→│                     │                │
 │                  │                     │                │
 │                  │ Show optimistic UI  │                │
 │                  │ (temp user message) │                │
 │                  │                     │                │
 │                  │ streamChatMessage() │                │
 │                  ├────────────────────→│ POST /chat/    │
 │                  │                     │   stream       │
 │                  │                     ├───────────────→│
 │                  │                     │                │
 │                  │                     │  Save user msg │
 │                  │                     │  Gen AI resp   │
 │                  │                     │                │
 │                  │                     │  Stream response
 │                  │←────────────────────┤                │
 │                  │   data: {delta:"A"} │                │
 │                  │  (char by char)     │                │
 │                  │←────────────────────┤                │
 │                  │   data: {delta:"I"} │                │
 │                  │                     │                │
 │ See streaming    │                     │                │
 │ response         │ Update display      │                │
 │←─────────────────┤ incrementally       │                │
 │                  │                     │                │
 │                  │ invalidateQueries() │                │
 │                  │ Refetch messages    │                │
 │                  ├────────────────────→│ GET /chat/     │
 │                  │                     │   messages     │
 │                  │                     ├───────────────→│
 │                  │                     │ Return all     │
 │                  │                     │ messages with  │
 │                  │                     │ new one        │
 │                  │←────────────────────┤                │
 │                  │   Updated data      │                │
 │                  │                     │                │
 │ See final data   │                     │                │
 │←─────────────────┤                     │                │
 │                  │                     │                │
```

---

## Troubleshooting Checklist

- ✅ Backend running on port 4000?
- ✅ Frontend running on port 5174?
- ✅ Proxy configured in vite.config.ts?
- ✅ No network errors in console?
- ✅ Messages saved to backend?
- ✅ LibraryTree loading?
- ✅ Context can be selected?

Check: [Troubleshooting Guide](./chat-api-setup.md#troubleshooting)
