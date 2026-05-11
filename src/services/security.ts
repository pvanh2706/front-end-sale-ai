import { del, get, patch, post } from '@/services/api'

export interface DeviceSession {
  id: string
  device: string
  browser: string
  os: string
  ip: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface SecuritySettings {
  userId: string
  twoFactorEnabled: boolean
  twoFactorMethod: 'app' | 'sms' | 'email'
  loginNotifications: boolean
  sessionTimeout: number
  updatedAt: string
  sessions: DeviceSession[]
}

export type UpdateSecurityInput = Partial<
  Pick<SecuritySettings, 'twoFactorEnabled' | 'twoFactorMethod' | 'loginNotifications' | 'sessionTimeout'>
>

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export async function fetchSecurity() {
  return get<SecuritySettings>('/v1/security')
}

export async function updateSecurity(input: UpdateSecurityInput) {
  return patch<SecuritySettings>('/v1/security', input)
}

export async function changePassword(input: ChangePasswordInput) {
  return post<{ message: string }>('/v1/security/change-password', input)
}

export async function revokeSession(sessionId: string) {
  return del<void>(`/v1/security/sessions/${sessionId}`)
}

export async function revokeAllSessions() {
  return del<void>('/v1/security/sessions')
}
