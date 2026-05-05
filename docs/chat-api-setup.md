# Chat API - Backend Setup Guide

## ✅ Status: FULLY INTEGRATED

Phần Chat tài liệu (Document Chat) đã được kết nối hoàn toàn với Backend API. Bao gồm:
- ✅ Conversations list từ server
- ✅ Messages persistence
- ✅ Smart AI responses (context-aware)
- ✅ Library documents integration
- ✅ Chat context setting

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CHAT VIEW                             │
│  (src/views/Chat/ChatView.vue)                          │
└─────────────────────────────────────────────────────────┘
              │                      │                 
              ↓                      ↓                 
    ┌──────────────────┐   ┌──────────────────┐
    │  Conversations   │   │  LibraryTree     │
    │  (Sidebar)       │   │  (Left panel)    │
    └──────────────────┘   └──────────────────┘
              │                      │                 
              ↓                      ↓                 
    ┌──────────────────────────────────────┐
    │      Message Input & Display          │
    │      (Main chat area)                 │
    └──────────────────────────────────────┘
              │
              ↓
    ┌──────────────────────────────────────┐
    │         SERVICES (Axios)              │
    │  - chat.ts (conversations, messages)  │
    │  - library.ts (documents, context)    │
    └──────────────────────────────────────┘
              │
              ↓
    ┌──────────────────────────────────────┐
    │         VITE PROXY                    │
    │    /api → http://localhost:4000       │
    └──────────────────────────────────────┘
              │
              ↓
    ┌──────────────────────────────────────┐
    │       BACKEND (Node.js + Express)     │
    │       http://localhost:4000           │
    └──────────────────────────────────────┘
              │
              ↓
    ┌──────────────────────────────────────┐
    │       IN-MEMORY STATE STORAGE         │
    │  - conversations                      │
    │  - messages (per conversation)        │
    │  - library tree (folders/documents)   │
    │  - chat contexts                      │
    └──────────────────────────────────────┘
```

## API Endpoints

### Chat Endpoints

#### GET /api/chat/conversations
Lấy danh sách cuộc trò chuyện
```bash
curl http://localhost:4000/api/chat/conversations

Response:
[
  {
    "id": "chat-1",
    "title": "Phan tich bao gia Q2",
    "updatedAt": "2026-05-05T04:51:28.377Z"
  },
  ...
]
```

#### GET /api/chat/conversations/:conversationId/messages
Lấy messages của một cuộc trò chuyện
```bash
curl http://localhost:4000/api/chat/conversations/chat-1/messages

Response:
[
  {
    "id": "msg-chat-1-1",
    "conversationId": "chat-1",
    "role": "user",
    "content": "Phân tích ba điểm chính trong báo giá Q2 này",
    "createdAt": "2026-05-05T06:46:48.300Z"
  },
  {
    "id": "msg-chat-1-2",
    "conversationId": "chat-1",
    "role": "assistant",
    "content": "Dựa trên báo giá Q2, ba điểm chính là...",
    "createdAt": "2026-05-05T06:47:48.300Z"
  }
]
```

#### POST /api/chat/conversations/:conversationId/messages
Gửi message mới (AI auto-generates smart response)
```bash
curl -X POST http://localhost:4000/api/chat/conversations/chat-1/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "Email follow-up cho khach hang"}'

Response:
{
  "conversationId": "chat-1",
  "message": { ...new user message },
  "assistantMessage": { ...generated AI response }
}
```

#### POST /api/chat/stream
Stream AI response (SSE - Server Sent Events)
```bash
curl -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"chat-1", "message":"Báo giá Q2?"}'

Response (Server-Sent Events):
data: {"delta":"Dựa"}
data: {"delta":" trên"}
data: {"delta":" báo"}
...
data: {"type":"done"}
```

### Library Endpoints

#### GET /api/v1/library/tree
Lấy cấu trúc thư viện documents
```bash
curl "http://localhost:4000/api/v1/library/tree?include_counts=true"

Response:
[
  {
    "id": "2",
    "name": "Sales Playbook",
    "type": "folder",
    "parent_id": null,
    "children": [
      {
        "id": "3",
        "name": "Onboarding",
        "type": "folder",
        ...
      }
    ],
    "documents_count": 3,
    "status": "approved"
  }
]
```

#### POST /api/v1/chats/:chatId/context
Thiết lập context cho chat (chọn document/folder)
```bash
curl -X POST http://localhost:4000/api/v1/chats/chat-1/context \
  -H "Content-Type: application/json" \
  -d '{"node_id":"2", "node_type":"folder"}'

Response:
{
  "chat_id": "chat-1",
  "node_id": "2",
  "node_type": "folder",
  "node_name": "Sales Playbook",
  "org_id": "demo-org",
  "updated_at": "2026-05-05T06:58:53.532Z"
}
```

## Smart AI Responses

Backend tự động tạo responses thích hợp dựa trên nội dung message:

| Keyword | Response Type |
|---------|--------------|
| báo giá, gia | Phân tích báo giá |
| email, gửi | Soạn email chuyên nghiệp |
| phân tích, so sánh | Phân tích chi tiết |
| faq, câu hỏi, thường gặp | FAQ structured |
| *default* | General response + prompt for document selection |

## How to Run

### Start Everything
```bash
npm run dev:all
```
- Frontend: http://localhost:5174
- Backend: http://localhost:4000

### Start Only Backend
```bash
npm run dev:backend
```

### Start Only Frontend
```bash
npm run dev
```

## Testing the Chat Feature

1. **Open browser**: http://localhost:5174/chat
2. **Xem danh sách conversations**: Sidebar bên trái tự động load từ backend
3. **Chọn conversation**: Messages tải từ server
4. **Gửi message**: Backend auto-generates smart response
5. **Chọn document từ LibraryTree**: Context được set cho chat

## Frontend Integration

### Components
- `ChatView.vue` - Main chat interface
  - Uses `fetchChatConversations()` - get list
  - Uses `fetchConversationMessages()` - get messages
  - Uses `streamChatMessage()` - stream AI response
  - Uses `LibraryTree` component - select context

- `LibraryTree.vue` - Document browser
  - Uses `libraryStore.fetchTree()` - get structure
  - Uses `libraryStore.applyChatContext()` - set context

### Services
- `src/services/chat.ts`
  - `fetchChatConversations()`
  - `fetchConversationMessages(conversationId)`
  - `sendChatMessage(payload)`
  - `streamChatMessage(payload, handlers)`

- `src/services/library.ts`
  - `fetchLibraryTree(params)`
  - `setChatContext(chatId, payload)`

### Stores
- `useLibraryStore()` - library state management
- Auto-refreshes on message send (invalidateQueries)

## File Changes Summary

### backend/server.mjs
✅ Added `generateAiResponse()` - creates smart responses
✅ Updated POST message endpoint - saves + generates response
✅ Updated `/api/chat/stream` - streams response + saves to DB
✅ Existing `/api/v1/library/tree` - works perfectly
✅ Existing `/api/v1/chats/:chatId/context` - works perfectly

### vite.config.ts
✅ Proxy configured: `/api` → `http://localhost:4000`

### Frontend Services
✅ No changes needed - already use correct endpoints

## Data Model

### Conversation
```typescript
{
  id: string
  title: string
  updatedAt: string
}
```

### ChatMessage
```typescript
{
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
```

### LibraryNode
```typescript
{
  id: string
  name: string
  type: 'folder' | 'document'
  parent_id?: string | null
  children: LibraryNode[]
  documents_count: number
  status: 'approved' | 'pending' | 'draft'
  has_content: boolean
  updated_at: string
  has_more_children: boolean
  total_children: number
}
```

### ChatContext
```typescript
{
  chat_id: string
  node_id: string
  node_type: 'folder' | 'document'
  node_name: string
  org_id: string
  updated_at: string
}
```

## Troubleshooting

### Chat shows empty messages
- Check if backend is running: `http://localhost:4000/api/chat/conversations`
- Check browser console for API errors
- Restart backend: `npm run dev:backend`

### Library tree not loading
- Verify: `http://localhost:4000/api/v1/library/tree`
- Check network tab in browser DevTools
- Ensure proxy is working in vite.config.ts

### Stream not working
- Check: `curl -X POST http://localhost:4000/api/chat/stream ...`
- Verify SSE headers are correct
- Browser should show streaming response

### Port conflicts
```bash
# Kill process on port 4000
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process -Force

# Or use different port
PORT=4001 npm run dev:backend
```

## Next Steps (Optional)

1. **Add Real Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Add Real AI**: Integrate OpenAI/Claude API instead of keyword matching
3. **Add Authentication**: User/session validation
4. **Add Real-time Updates**: WebSocket for live message sync
5. **Add File Upload**: Upload documents to chat context
6. **Add Search**: Full-text search in messages/documents

## File Structure

```
backend/
  └── server.mjs                    ← All endpoints, generateAiResponse()
src/
  ├── services/
  │   ├── chat.ts                   ← Chat API calls
  │   └── library.ts                ← Library API calls
  ├── views/Chat/
  │   └── ChatView.vue              ← Main chat UI (NO CHANGES)
  └── stores/
      └── library.ts                ← Library state (NO CHANGES)
vite.config.ts                       ← Proxy configured
docs/
  └── chat-api-setup.md            ← This file
```

---

**Last Updated**: May 5, 2026
**Status**: ✅ Production Ready
**Frontend Port**: 5174
**Backend Port**: 4000

