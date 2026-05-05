export type LibraryNodeType = 'folder' | 'document'
export type LibraryNodeStatus = 'approved' | 'draft' | 'pending'
export type LibraryRootType = 'company' | 'personal'

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
