# UML — Sales.AI (CodeOn POS)

> Stack: Vue 3 + TypeScript + Pinia + Vue Router + Axios + Socket.io + Tailwind CSS v4

---

## 1. Kiến trúc tổng thể (System Architecture)

```mermaid
graph TB
    subgraph Browser["Trình duyệt (Browser)"]
        direction TB
        subgraph App["App.vue (Root)"]
            SidebarProvider["SidebarProvider\n(Context: useSidebar)"]
            Sonner["Sonner (Toast)"]
            ThemeProvider["ThemeProvider"]
        end

        subgraph Layout["Layout System"]
            AdminLayout["AdminLayout\n(authenticated pages)"]
            FullScreenLayout["FullScreenLayout\n(Auth pages)"]
            AppSidebar["AppSidebar"]
            AppHeader["AppHeader"]
            Backdrop
        end

        subgraph Views["Views / Pages"]
            Auth["Auth\n(Login, Register)"]
            Chat["Chat Module\n(Dashboard, Chat, Analytics)"]
            CRM["CRM\n(Work, Kanban, DealDetail)"]
            Library["DocLibrary"]
            Settings["Settings\n(9 sub-pages)"]
        end

        subgraph State["State (Pinia)"]
            AuthStore["useAuthStore"]
            CrmStore["useCrmStore"]
            DealFieldStore["useDealFieldConfigStore"]
            ThemeStore["useThemeStore"]
            LibraryStore["useLibraryStore"]
        end

        subgraph Composables["Composables"]
            useSidebar
            useChatDashboard
        end
    end

    subgraph External["Backend / External"]
        REST["REST API\n/v1/..."]
        WS["WebSocket\n(Socket.io)"]
        SSE["SSE Stream\n(Chat AI)"]
        FileProxy["Proxy Upload\n/proxy/files/upload"]
    end

    Views --> State
    Views --> Composables
    State --> REST
    State --> WS
    Views --> SSE
    Views --> FileProxy
    Layout --> Composables
    App --> Layout
    App --> Views
```

---

## 2. Cây component (Component Tree)

```mermaid
graph TD
    AppVue["App.vue"]
    AppVue --> ThemeProvider
    AppVue --> SidebarProvider
    AppVue --> Sonner
    AppVue --> RouterView

    RouterView --> AdminLayout
    RouterView --> FullScreenLayout

    AdminLayout --> AppSidebar
    AdminLayout --> AppHeader
    AdminLayout --> Backdrop
    AdminLayout --> PageSlot["&lt;slot&gt; (page content)"]

    AppHeader --> BrandLogo
    AppHeader --> ThemeToggler
    AppHeader --> UserMenu["User Menu"]
    AppHeader --> NotifMenu["Notification Menu"]

    FullScreenLayout --> AuthPages["LoginView\nRegisterView"]

    PageSlot --> CrmWorkView
    PageSlot --> CrmDealsKanbanView
    PageSlot --> CrmDealDetailView
    PageSlot --> CrmDuplicateCheckView
    PageSlot --> ChatModuleView
    PageSlot --> DocLibraryView
    PageSlot --> SettingsView

    CrmDealsKanbanView --> DealFieldConfigModal
    CrmDealsKanbanView --> EmailConflictDialog
    DocLibraryView --> LibraryTree
    LibraryTree --> LibraryTree

    ChatModuleView --> ChatDashboardView
    ChatModuleView --> ChatView
    ChatModuleView --> ChatAnalyticsView

    SettingsView --> AppearanceSettings
    SettingsView --> ProfileSettings
    SettingsView --> NotificationSettings
    SettingsView --> LanguageSettings
    SettingsView --> SecuritySettings
    SettingsView --> ApiIntegrationSettings
    SettingsView --> WebhookLogsView
    SettingsView --> PermissionGroupsSettings
    SettingsView --> DocumentPermissionsView
```

---

## 3. Sơ đồ lớp — Pinia Stores (Class Diagram)

```mermaid
classDiagram
    class useAuthStore {
        +token: string | null
        +user: UserProfile | null
        +isAuthenticated: boolean
        +login(email, password) boolean
        +logout() void
    }

    class useCrmStore {
        +kpis: CrmKpiMetric[]
        +pipeline: CrmPipelineStage[]
        +tasks: CrmTaskItem[]
        +loading: boolean
        +error: string | null
        +totalTasksToday: number
        +fetchDashboard(force?) Promise~void~
        +setTaskDone(taskId, done) Promise~void~
    }

    class useDealFieldConfigStore {
        +fieldConfig: Record~string, FieldConfig~
        +visibleSections: DealSectionDef[]
        +totalVisible: number
        +totalFields: number
        +setFieldVisible(fieldId, visible) void
        +setFieldPermission(fieldId, permission) void
        +applyConfig(draft) void
        +saveConfig() void
        +resetToDefault() void
        +applyPreset(preset) void
        +isVisible(fieldId) boolean
        +visibleCountInSection(sectionId) number
    }

    class useThemeStore {
        +currentTheme: ThemeId
        +colorMode: ColorMode
        +isDarkMode: boolean
        +themeOption: ThemeOption
        +setTheme(id) void
        +setColorMode(mode) void
        +toggleColorMode() void
        +applyTheme() void
        +applyColorMode() void
    }

    class useLibraryStore {
        +tree: LibraryNode[]
        +loading: boolean
        +error: string | null
        +connectionStatus: string
        +lastFetchedAt: number
        +orgId: string
        +cacheKey: string
        +fetchTree(options?) Promise~void~
        +fetchChildren(parentId) Promise~void~
        +createFolder(name, parentId?) Promise~LibraryNode~
        +createDocument(title, parentId?, fileUrl?, fileMime?) Promise~LibraryNode~
        +removeNode(nodeId) Promise~void~
        +applyChatContext(chatId, nodeId, nodeType) Promise
        +initRealtime() void
        +releaseRealtime() void
    }

    useAuthStore ..> UserProfile : uses
    useCrmStore ..> CrmKpiMetric : uses
    useCrmStore ..> CrmPipelineStage : uses
    useCrmStore ..> CrmTaskItem : uses
    useLibraryStore ..> LibraryNode : uses
    useDealFieldConfigStore ..> FieldConfig : uses
```

---

## 4. Sơ đồ lớp — Types & Interfaces

```mermaid
classDiagram
    class ApiResponse~T~ {
        <<discriminated union>>
        isSuccess: true | false
        data: T
        error: string
    }

    class UserProfile {
        +id: string
        +name: string
        +email: string
        +avatar?: string
        +role?: string
    }

    class Deal {
        +id: string
        +title: string
        +stage: DealStage
        +value: number
        +probability: number
        +assigneeId: string
        +company: string
        +source: string
        +aiScore: number
        +closeDate: string
        +createdAt: string
        +updatedAt: string
    }

    class DealCard {
        +id: string
        +title: string
        +company: string
        +value: number
        +source: string
        +aiScore: number
    }

    class KanbanColumn {
        +id: DealStage
        +name: string
        +color: string
        +total: number
        +cards: DealCard[]
    }

    class CrmKpiMetric {
        +id: string
        +label: string
        +value: string
        +trend: number
        +changeText: string
        +tone: string
    }

    class CrmPipelineStage {
        +id: string
        +name: string
        +count: number
        +percent: number
        +value: number
        +tone: string
    }

    class CrmTaskItem {
        +id: string
        +title: string
        +meta: string
        +done: boolean
    }

    class ChatMessage {
        +id: string
        +role: string
        +content: string
        +createdAt: string
        +sources?: ChatSource[]
    }

    class ChatConversation {
        +id: string
        +title: string
        +updatedAt: string
        +pinned?: boolean
    }

    class LibraryNode {
        +id: string
        +name: string
        +type: folder | document
        +children?: LibraryNode[]
        +file_url?: string
        +file_id?: string
        +file_mime?: string
        +metadata?: object
    }

    class FieldConfig {
        +visible: boolean
        +permission: string
    }

    class DealSectionDef {
        +sectionId: string
        +label: string
        +fields: DealFieldDef[]
    }

    KanbanColumn "1" --> "*" DealCard : contains
    Deal --|> DealCard : extends
    ChatConversation "1" --> "*" ChatMessage : has
    LibraryNode --> LibraryNode : recursive children
    DealSectionDef "1" --> "*" FieldConfig : configures
```

---

## 5. Sơ đồ lớp — API Services

```mermaid
classDiagram
    class ApiService {
        <<module api.ts>>
        +axiosInstance: AxiosInstance
        +get~T~(url, params?) Promise~ApiResponse~T~~
        +post~T~(url, body?) Promise~ApiResponse~T~~
        +put~T~(url, body?) Promise~ApiResponse~T~~
        +patch~T~(url, body?) Promise~ApiResponse~T~~
        +del~T~(url) Promise~ApiResponse~T~~
    }

    class CrmService {
        <<module crm.ts>>
        +getCrmDashboard() Promise~ApiResponse~CrmDashboardPayload~~
        +updateCrmTaskStatus(taskId, done) Promise
        +getCrmDealsKanban() Promise
        +createCrmDeal(payload) Promise
    }

    class DealsService {
        <<module deals.ts>>
        +listDealsKanban() Promise~ApiResponse~DealsKanbanPayload~~
        +createDeal(input) Promise~ApiResponse~Deal~~
        +getDealById(dealId) Promise~ApiResponse~Deal~~
        +updateDeal(dealId, patch) Promise~ApiResponse~Deal~~
        +updateDealStage(dealId, stage) Promise~ApiResponse~Deal~~
        +deleteDeal(dealId) Promise~ApiResponse~void~~
        -VITE_DEALS_USE_MOCK: boolean
    }

    class ChatService {
        <<module chat.ts>>
        +fetchChatConversations() Promise
        +getDashboardStats() Promise
        +getRecentSessions(limit?) Promise
        +getAiSuggestions() Promise
        +getPopularQuestions(limit?) Promise
        +pinSession(sessionId) Promise
        +deleteSession(sessionId) Promise
        +fetchConversationMessages(conversationId) Promise
        +sendChatMessage(payload) Promise
        +streamChatMessage(payload, handlers, signal?) Promise~void~
        +pickAssistantText(data) string | null
    }

    class LibraryService {
        <<module library.ts>>
        +fetchLibraryTree(params?) Promise
        +getRecentDocuments(limit?) Promise
        +createLibraryFolder(payload) Promise~ApiResponse~LibraryNode~~
        +createLibraryDocument(payload) Promise~ApiResponse~LibraryNode~~
        +deleteLibraryNode(nodeId) Promise
        +setChatContext(chatId, payload) Promise
        +uploadFileExternal(file, onProgress?) Promise
    }

    class ProfileService {
        <<module profile.ts>>
        +getProfile() Promise~ApiResponse~UserProfile~~
        +updateProfile(payload) Promise~ApiResponse~UserProfile~~
        +changeAvatar(file) Promise
    }

    class SecurityService {
        <<module security.ts>>
        +changePassword(payload) Promise
        +getActiveSessions() Promise
        +revokeSession(sessionId) Promise
    }

    ApiService <|-- CrmService : uses
    ApiService <|-- DealsService : uses
    ApiService <|-- ChatService : uses
    ApiService <|-- LibraryService : uses
    ApiService <|-- ProfileService : uses
    ApiService <|-- SecurityService : uses
```

---

## 6. Bản đồ Routes (Navigation Map)

```mermaid
graph LR
    Root["/"] --> Login["/login\nLoginView"]
    Root --> Register["/register\nRegisterView"]
    Root --> CrmWork["/crm-work\nCrmWorkView"]
    Root --> CrmDeals["/crm-deals\nCrmDealsKanbanView"]
    CrmDeals --> DealDetail["/crm-deals/:dealId\nCrmDealDetailView"]
    Root --> DupCheck["/crm-duplicate-check\nCrmDuplicateCheckView"]
    Root --> ChatModule["/chat-tai-lieu\nChatModuleView"]
    ChatModule --> ChatDash["(index)\nChatDashboardView"]
    ChatModule --> ChatMain["/chat\nChatView"]
    ChatModule --> DocLib["/library\nDocLibraryView"]
    ChatModule --> Analytics["/analytics\nChatAnalyticsView"]
    ChatModule --> Perms["/permissions/:nodeId\nDocumentPermissionsView"]
    Root --> Settings["/settings\nSettingsView"]
    Settings --> Appearance["/appearance\nAppearanceSettings"]
    Settings --> Profile["/profile\nProfileSettings"]
    Settings --> Notifs["/notifications\nNotificationSettings"]
    Settings --> Lang["/language\nLanguageSettings"]
    Settings --> Sec["/security\nSecuritySettings"]
    Settings --> ApiKeys["/api-integration\nApiIntegrationSettings"]
    Settings --> Webhooks["/webhook-logs\nWebhookLogsView"]
    Settings --> PermGroups["/permission-groups\nPermissionGroupsSettings"]

    style Login fill:#fef3f2,stroke:#f04438
    style Register fill:#fef3f2,stroke:#f04438
    style CrmWork fill:#ecf3ff,stroke:#465fff
    style CrmDeals fill:#ecf3ff,stroke:#465fff
    style DealDetail fill:#ecf3ff,stroke:#465fff
    style ChatModule fill:#ecfdf3,stroke:#12b76a
    style Settings fill:#fffaeb,stroke:#f79009
```

---

## 7. Sequence Diagram — Đăng nhập (Login Flow)

```mermaid
sequenceDiagram
    actor User
    participant LoginView
    participant useAuthStore
    participant ApiService
    participant Router

    User->>LoginView: Nhập email + password
    LoginView->>LoginView: VeeValidate kiểm tra form
    LoginView->>useAuthStore: login(email, password)
    useAuthStore->>ApiService: post("/v1/auth/login", {email, password})
    ApiService->>ApiService: axios.post (Bearer token auto-added)
    ApiService-->>useAuthStore: ApiResponse<{token, user}>
    alt isSuccess = true
        useAuthStore->>useAuthStore: token = data.token
        useAuthStore->>useAuthStore: user = data.user
        useAuthStore->>useAuthStore: localStorage.setItem(token)
        useAuthStore-->>LoginView: return true
        LoginView->>Router: router.push("/crm-work")
    else isSuccess = false
        useAuthStore-->>LoginView: return false
        LoginView->>LoginView: toast.error("Đăng nhập thất bại")
    end
```

---

## 8. Sequence Diagram — CRM Kanban (Deal Move Flow)

```mermaid
sequenceDiagram
    actor User
    participant KanbanView as CrmDealsKanbanView
    participant DealsService
    participant Socket as Socket.io
    participant OtherClients

    User->>KanbanView: Kéo card sang cột mới
    KanbanView->>KanbanView: Optimistic update (UI ngay lập tức)
    KanbanView->>DealsService: updateDealStage(dealId, newStage)
    DealsService->>DealsService: VITE_DEALS_USE_MOCK?
    alt Mock = true
        DealsService->>DealsService: mockUpdateDeal(dealId, patch)
        DealsService-->>KanbanView: ApiResponse<Deal>
    else Mock = false
        DealsService->>DealsService: put("/v1/deals/:id/stage", {stage})
        DealsService-->>KanbanView: ApiResponse<Deal>
    end
    alt Thành công
        KanbanView->>KanbanView: Giữ UI, toast.success
        Socket->>OtherClients: emit("deal.updated", deal)
        OtherClients->>OtherClients: Refetch kanban
    else Thất bại
        KanbanView->>KanbanView: Rollback UI về vị trí cũ
        KanbanView->>KanbanView: toast.error
    end
```

---

## 9. Sequence Diagram — Chat AI (Streaming Flow)

```mermaid
sequenceDiagram
    actor User
    participant ChatView
    participant ChatService
    participant Backend as Backend (SSE)

    User->>ChatView: Gửi tin nhắn
    ChatView->>ChatView: Hiển thị message ngay (optimistic)
    ChatView->>ChatView: Hiển thị typing indicator
    ChatView->>ChatService: streamChatMessage({conversationId, message}, handlers)
    ChatService->>Backend: POST /v1/chat/stream (SSE)
    loop Mỗi chunk SSE
        Backend-->>ChatService: data: {"delta": "..."}
        ChatService->>ChatService: pickAssistantText(chunk)
        ChatService->>ChatView: handlers.onDelta(text)
        ChatView->>ChatView: Append text vào message bubble
    end
    Backend-->>ChatService: data: [DONE]
    ChatService->>ChatView: handlers.onDone()
    ChatView->>ChatView: Ẩn typing indicator
    ChatView->>ChatView: Lưu message hoàn chỉnh vào state
```

---

## 10. Sequence Diagram — Document Library (Real-time Sync)

```mermaid
sequenceDiagram
    participant DocLibView as DocLibraryView
    participant LibStore as useLibraryStore
    participant LocalStorage
    participant LibService as LibraryService
    participant Socket as Socket.io Server

    DocLibView->>LibStore: fetchTree()
    LibStore->>LocalStorage: Kiểm tra cache (TTL 5 phút)
    alt Cache còn hạn
        LocalStorage-->>LibStore: tree data
        LibStore-->>DocLibView: Render ngay từ cache
        LibStore->>LibService: fetchLibraryTree() (background)
        LibService-->>LibStore: Fresh data
        LibStore->>LocalStorage: Cập nhật cache
        LibStore-->>DocLibView: Re-render nếu có thay đổi
    else Cache hết hạn
        LibStore->>LibService: fetchLibraryTree()
        LibService-->>LibStore: tree data
        LibStore->>LocalStorage: Lưu cache
        LibStore-->>DocLibView: Render
    end
    LibStore->>Socket: initRealtime() — connect
    loop Real-time events
        Socket-->>LibStore: "library.updated" event
        LibStore->>LibService: fetchTree({background: true})
        LibStore-->>DocLibView: Re-render tree
    end
    DocLibView->>LibStore: releaseRealtime() (on unmount)
```

---

## 11. Sequence Diagram — Upload File (Library)

```mermaid
sequenceDiagram
    actor User
    participant DocLibView
    participant LibStore as useLibraryStore
    participant LibService as LibraryService
    participant Proxy as /proxy/files/upload

    User->>DocLibView: Chọn file, nhấn Upload
    DocLibView->>LibStore: createDocument(title, parentId, null, null)
    LibStore->>LibService: uploadFileExternal(file, onProgress)
    LibService->>Proxy: XHR POST (multipart/form-data)
    loop Upload progress
        Proxy-->>LibService: progress event
        LibService->>DocLibView: onProgress(percent)
        DocLibView->>DocLibView: Cập nhật progress bar
    end
    Proxy-->>LibService: {file_url, file_id, mime}
    LibService-->>LibStore: ExternalFileUploadResult
    LibStore->>LibService: createLibraryDocument({title, parentId, file_url, file_mime})
    LibService-->>LibStore: ApiResponse<LibraryNode>
    LibStore->>LibStore: tree.push(newNode)
    LibStore-->>DocLibView: Re-render tree
    DocLibView->>DocLibView: toast.success("Tải lên thành công")
```

---

## 12. Sơ đồ luồng dữ liệu (Data Flow Diagram)

```mermaid
flowchart LR
    subgraph UI["UI Layer (Vue Components)"]
        V[Views]
        C[Common Components]
        UI_Comp[UI Components\nshadcn-vue]
    end

    subgraph Logic["Logic Layer"]
        Stores[Pinia Stores]
        Composables[Composables]
        Router[Vue Router]
    end

    subgraph Data["Data Layer"]
        Services[API Services\naxios]
        Socket[Socket.io Client]
        Cache[LocalStorage Cache]
    end

    subgraph Backend["Backend"]
        REST_API[REST API\n/v1/...]
        WS_Server[WebSocket Server]
        SSE_Server[SSE Stream]
        FileStore[File Storage\nProxy]
    end

    V --> Stores
    V --> Composables
    V --> Router
    C --> Stores
    Stores --> Services
    Stores --> Socket
    Stores --> Cache
    Cache --> Stores
    Services --> REST_API
    Socket --> WS_Server
    WS_Server --> Socket
    REST_API --> Services
    SSE_Server --> V
    V --> FileStore
    FileStore --> V
```

---

## 13. Sơ đồ Sidebar & Theme System

```mermaid
flowchart TD
    SidebarProvider["SidebarProvider\n(provide: SidebarContext)"]
    useSidebar["useSidebar()\n(inject: SidebarContext)"]

    SidebarProvider --> AppSidebar
    SidebarProvider --> AppHeader
    SidebarProvider --> Backdrop
    SidebarProvider --> AdminLayout

    AppSidebar -->|inject| useSidebar
    AppHeader -->|inject| useSidebar
    Backdrop -->|inject| useSidebar

    useSidebar --- State["State:\nisExpanded: Ref~boolean~\nisMobileOpen: Ref~boolean~\nisHovered: Ref~boolean~\nopenSubmenu: Ref~string|null~"]
    useSidebar --- Actions["Actions:\ntoggleSidebar()\ntoggleMobileSidebar()\nsetIsHovered(v)\ntoggleSubmenu(item)"]

    ThemeStore["useThemeStore"]
    ThemeStore --> ThemeProvider
    ThemeProvider -->|applyTheme| HtmlRoot["&lt;html&gt; data-theme attr"]
    ThemeStore --- Themes["Themes:\nocean | indigo | emerald\nsunset | rose | graphite"]
    ThemeStore --- Modes["Modes:\nlight | dark | system"]
```

---

## 14. Deal Field Config System (158 fields)

```mermaid
flowchart TD
    useDealFieldConfigStore --> visibleSections
    useDealFieldConfigStore --> fieldConfig

    visibleSections --> Sections["15 Sections:\ngeneral, hotel, product,\nmarketing, lead_sdr,\nassessment, meeting,\ncontract, payment,\ninvoice, commission,\nvoucher, upsale, lost, system"]

    fieldConfig -->|per field| FieldConfig["FieldConfig:\nvisible: boolean\npermission: 'view'|'edit'|'none'"]

    DealFieldConfigModal -->|reads| useDealFieldConfigStore
    DealFieldConfigModal -->|calls| setFieldVisible
    DealFieldConfigModal -->|calls| setFieldPermission
    DealFieldConfigModal -->|calls| applyPreset
    DealFieldConfigModal -->|calls| saveConfig

    applyPreset --> Presets["Presets:\ndefault | minimal | full"]
    saveConfig -->|persist| LocalStorage2["LocalStorage\n'deal-field-config'"]

    CrmDealDetailView -->|reads| visibleSections
    CrmDealDetailView -->|filters| isVisible["isVisible(fieldId)"]
```

---

## 15. Tóm tắt mối quan hệ module

```mermaid
graph TB
    Router["Vue Router\nindex.ts"] -->|loads| Views

    Views -->|uses| Stores
    Views -->|uses| Services
    Views -->|uses| Composables
    Views -->|uses| UIComponents["UI Components\nshadcn-vue"]

    Stores -->|calls| Services
    Stores -->|listens| Socket["Socket.io\nlib/socket.ts"]

    Services -->|wraps| AxiosInstance["Axios Instance\napi.ts"]
    Services -->|auth header| AuthStore["useAuthStore"]

    Composables -->|may use| Services
    Composables -->|may use| Stores

    UIComponents -->|uses| Types["Types\ntypes/*.ts"]
    Stores -->|uses| Types
    Services -->|uses| Types
    Views -->|uses| Types
```
