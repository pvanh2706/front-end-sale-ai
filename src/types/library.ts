export type LibraryNodeType = 'folder' | 'document'
export type LibraryNodeStatus = 'approved' | 'draft' | 'pending'
export type LibraryRootType = 'company' | 'personal' | 'shared'

export interface LibraryNode {
  id: string
  name: string
  type: LibraryNodeType
  parent_id: string | null
  children: LibraryNode[]
  documents_count: number
  status: LibraryNodeStatus
  has_content: boolean
  updated_at: string
  has_more_children?: boolean
  total_children?: number
  /** System root folders (company / personal) — cannot be renamed, moved or deleted */
  is_system?: boolean
  /** Which workspace root this node belongs to */
  root_type?: LibraryRootType
  /** External file URL after uploading via codeonlabs API */
  file_url?: string | null
  /** External file ID from codeonlabs API */
  file_id?: string | null
  /** MIME type of the uploaded file */
  file_mime?: string | null
  /** Mô tả / hướng dẫn sử dụng tài liệu */
  description?: string | null
}

export interface ChatContextPayload {
  node_id: string
  node_type: LibraryNodeType
}

export interface ChatContextResponse {
  chat_id: string
  node_id: string
  node_type: LibraryNodeType
  node_name: string
  org_id: string
  updated_at: string
}
