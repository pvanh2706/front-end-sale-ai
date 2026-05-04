export interface ChatSource {
  id?: string
  label: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  sources?: ChatSource[]
}

export interface ChatConversation {
  id: string
  title: string
  updatedAt: string
  pinned?: boolean
}

export interface SendChatMessagePayload {
  conversationId: string
  message: string
}

export interface SendChatMessageResponse {
  conversationId?: string
  message?: ChatMessage
  assistantMessage?: ChatMessage
  content?: string
  reply?: string
}

export interface StreamChatMessagePayload {
  conversationId: string
  message: string
}
