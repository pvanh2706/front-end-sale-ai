import { del, get, post } from '@/services/api'
import type { ApiResponse } from '@/types/common'
import type { ChatContextPayload, ChatContextResponse, LibraryNode, LibraryRootType } from '@/types/library'
import type { RecentDocumentItem } from '@/types/chatDashboard'

const LIBRARY_TREE_ENDPOINT = '/v1/library/tree'
const LIBRARY_FOLDER_ENDPOINT = '/v1/library/folders'
const LIBRARY_DOCUMENT_ENDPOINT = '/v1/library/documents'
const LIBRARY_RECENT_DOCUMENTS_ENDPOINT = '/v1/library/documents'

export function fetchLibraryTree(params?: {
  include_counts?: boolean
  parent_id?: string
  root_type?: LibraryRootType
}): Promise<ApiResponse<LibraryNode[]>> {
  return get<LibraryNode[]>(LIBRARY_TREE_ENDPOINT, params)
}

export function getRecentDocuments(limit = 5): Promise<ApiResponse<{ items: RecentDocumentItem[] }>> {
  return get<{ items: RecentDocumentItem[] }>(LIBRARY_RECENT_DOCUMENTS_ENDPOINT, {
    sort: 'created_desc',
    limit,
  })
}

export function createLibraryFolder(payload: {
  name: string
  parent_id?: string | null
  root_type?: LibraryRootType
}): Promise<ApiResponse<LibraryNode>> {
  return post<LibraryNode>(LIBRARY_FOLDER_ENDPOINT, payload)
}

export function deleteLibraryNode(nodeId: string): Promise<ApiResponse<{ ok: true; id: string }>> {
  return del<{ ok: true; id: string }>(`/v1/library/nodes/${nodeId}`)
}

export async function createLibraryDocument(payload: {
  title: string
  file?: File | null
  parent_id?: string | null
  root_type?: LibraryRootType
}): Promise<ApiResponse<LibraryNode>> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'
  const token = localStorage.getItem('token')
  const formData = new FormData()

  formData.append('title', payload.title)
  if (payload.file) {
    formData.append('file', payload.file)
  }
  if (payload.parent_id) {
    formData.append('parent_id', payload.parent_id)
  }
  if (payload.root_type) {
    formData.append('root_type', payload.root_type)
  }

  try {
    const response = await fetch(`${apiBase}${LIBRARY_DOCUMENT_ENDPOINT}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })

    const data = (await response.json()) as LibraryNode & { message?: string }
    if (!response.ok) {
      return {
        isSuccess: false,
        error: data.message ?? 'Khong the tao tai lieu',
      }
    }

    return { isSuccess: true, data }
  } catch {
    return {
      isSuccess: false,
      error: 'Khong the tao tai lieu',
    }
  }
}

export function setChatContext(
  chatId: string,
  payload: ChatContextPayload,
): Promise<ApiResponse<ChatContextResponse>> {
  return post<ChatContextResponse>(`/v1/chats/${chatId}/context`, payload)
}

export const libraryService = {
  getRecentDocuments,
}
