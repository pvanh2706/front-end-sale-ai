export interface ChatDashboardStats {
  documentsCount: number
  newDocumentsThisWeek: number
  sessionsThisMonth: number
  sessionsPercentChange: number
  questionsAnswered: number
  avgResponseTime: number
  storageUsed: number
  storageLimit: number
}

export interface RecentChatItem {
  id: string
  title: string
  lastQuestion: string
  messageCount: number
  updatedAt: string
}

export interface RecentDocumentItem {
  id: string
  name: string
  format: string
  sizeBytes: number
  uploadedBy: string
  uploadedByName: string
  createdAt: string
}

export interface DashboardSuggestion {
  type: 'new_docs' | 'deadline' | 'trending' | 'reminder'
  title: string
  description: string
  actionUrl: string
}
