import { get, post } from '@/services/api'
import type { ApiResponse } from '@/types/common'
import type {
  ChatConversation,
  ChatMessage,
  SendChatMessagePayload,
  SendChatMessageResponse,
  StreamChatMessagePayload,
} from '@/types/chat'

const CHAT_CONVERSATIONS_ENDPOINT = '/chat/conversations'
const CHAT_STREAM_ENDPOINT = '/chat/stream'

export function fetchChatConversations(): Promise<ApiResponse<ChatConversation[]>> {
  return get<ChatConversation[]>(CHAT_CONVERSATIONS_ENDPOINT)
}

export function fetchConversationMessages(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
  return get<ChatMessage[]>(`${CHAT_CONVERSATIONS_ENDPOINT}/${conversationId}/messages`)
}

export function sendChatMessage(
  payload: SendChatMessagePayload,
): Promise<ApiResponse<SendChatMessageResponse>> {
  return post<SendChatMessageResponse>(
    `${CHAT_CONVERSATIONS_ENDPOINT}/${payload.conversationId}/messages`,
    { message: payload.message },
  )
}

export interface StreamHandlers {
  onChunk: (chunk: string) => void
  onDone?: () => void
}

export async function streamChatMessage(
  payload: StreamChatMessagePayload,
  handlers: StreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const token = localStorage.getItem('token')
  const response = await fetch(getStreamUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/x-ndjson, application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Unable to stream chat response: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const rawLine of lines) {
      parseStreamLine(rawLine, handlers)
    }
  }

  if (buffer.trim()) {
    parseStreamLine(buffer, handlers)
  }

  handlers.onDone?.()
}

export function pickAssistantText(data: SendChatMessageResponse): string | null {
  if (data.assistantMessage?.content) {
    return data.assistantMessage.content
  }

  if (data.message?.role === 'assistant' && data.message.content) {
    return data.message.content
  }

  if (typeof data.reply === 'string' && data.reply.trim()) {
    return data.reply
  }

  if (typeof data.content === 'string' && data.content.trim()) {
    return data.content
  }

  return null
}

function parseStreamLine(rawLine: string, handlers: StreamHandlers): void {
  const line = rawLine.trim()
  if (!line) {
    return
  }

  const payload = line.startsWith('data:') ? line.slice(5).trim() : line
  if (!payload || payload === '[DONE]') {
    return
  }

  try {
    const parsed = JSON.parse(payload) as {
      delta?: string
      content?: string
      type?: string
      message?: { content?: string }
    }

    if (parsed.type === 'done') {
      handlers.onDone?.()
      return
    }

    if (typeof parsed.delta === 'string') {
      handlers.onChunk(parsed.delta)
      return
    }

    if (typeof parsed.content === 'string') {
      handlers.onChunk(parsed.content)
      return
    }

    if (typeof parsed.message?.content === 'string') {
      handlers.onChunk(parsed.message.content)
    }
  } catch {
    handlers.onChunk(payload)
  }
}

function getStreamUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  return `${baseUrl}${CHAT_STREAM_ENDPOINT}`
}
