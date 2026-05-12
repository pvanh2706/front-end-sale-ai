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
  file_url?: string | null
  file_mime?: string | null
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
  if (payload.file_url) {
    formData.append('file_url', payload.file_url)
  }
  if (payload.file_mime) {
    formData.append('file_mime', payload.file_mime)
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
        error: data.message ?? 'Không thể tạo tài liệu',
      }
    }

    return { isSuccess: true, data }
  } catch {
    return {
      isSuccess: false,
      error: 'Không thể tạo tài liệu',
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

// ─── External File Upload API ─────────────────────────────────────────────────

export interface ExternalFileUploadResult {
  fileId?: string
  file_id?: string
  fileName?: string
  file_name?: string
  fileUrl?: string
  file_url?: string
  downloadUrl?: string
  url?: string
  link?: string
  fileLink?: string
  mimeType?: string
  mime_type?: string
  size?: number
  data?: Record<string, unknown>
  [key: string]: unknown
}

export async function uploadFileExternal(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<ApiResponse<ExternalFileUploadResult>> {
  // Gọi qua proxy backend (localhost:4000) — credentials ẩn ở server, tránh CORS & lộ key
  const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

  const formData = new FormData()
  formData.append('file', file)
  // Không gửi credentials từ frontend — backend tự đọc từ env

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.responseText) as ExternalFileUploadResult & { message?: string }
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('[FileUpload] API response:', data)
          resolve({ isSuccess: true, data })
        } else {
          resolve({
            isSuccess: false,
            error: (data.message as string | undefined) ?? `Lỗi ${xhr.status}`,
          })
        }
      } catch {
        resolve({ isSuccess: false, error: 'Phản hồi không hợp lệ từ máy chủ' })
      }
    })

    xhr.addEventListener('error', () => {
      resolve({ isSuccess: false, error: 'Lỗi kết nối đến máy chủ lưu trữ tệp' })
    })

    xhr.addEventListener('timeout', () => {
      resolve({ isSuccess: false, error: 'Hết thời gian chờ (timeout)' })
    })

    xhr.timeout = 120_000
    xhr.open('POST', `${apiBase}/proxy/files/upload`)
    xhr.send(formData)
  })
}

/** Normalise the varying field names the external API might return */
export function extractExternalFileUrl(result: ExternalFileUploadResult): string | null {
  // Ezfolio CDN trả về: { statusCode, data: { fileURL, fileName } }
  const nested = result.data as Record<string, unknown> | undefined
  if (nested && typeof nested === 'object') {
    const fromNested =
      (nested.fileURL as string | undefined) ??
      (nested.fileUrl as string | undefined) ??
      (nested.file_url as string | undefined) ??
      (nested.url as string | undefined) ??
      (nested.Url as string | undefined) ??
      (nested.downloadUrl as string | undefined) ??
      null
    if (fromNested) return fromNested
  }

  // Top-level fallback
  return (
    (result.fileURL as string | undefined) ??
    (result.fileUrl as string | undefined) ??
    (result.file_url as string | undefined) ??
    (result.url as string | undefined) ??
    (result.Url as string | undefined) ??
    (result.downloadUrl as string | undefined) ??
    (result.link as string | undefined) ??
    null
  )
}

export function extractExternalFileId(result: ExternalFileUploadResult): string | null {
  return (result.fileId ?? result.file_id ?? null) as string | null
}
