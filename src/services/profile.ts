import { del, get, patch, post } from '@/services/api'

export interface UserProfile {
  userId: string
  fullName: string
  email: string
  phone: string
  jobTitle: string
  department: string
  bio: string
  timezone: string
  language: string
  avatarUrl: string
  updatedAt: string
}

export type UpdateProfileInput = Partial<
  Pick<UserProfile, 'fullName' | 'phone' | 'jobTitle' | 'department' | 'bio' | 'timezone' | 'language'>
>

export async function fetchProfile() {
  return get<UserProfile>('/v1/profile')
}

export async function updateProfile(input: UpdateProfileInput) {
  return patch<UserProfile>('/v1/profile', input)
}

export async function uploadAvatar(file: File) {
  const formData = new FormData()
  formData.append('avatar', file)
  // Use axios directly so we can send FormData with correct Content-Type
  const { default: axios } = await import('axios')
  const token = localStorage.getItem('token')
  const response = await axios.post<{ success: boolean; data: { avatarUrl: string } }>(
    '/api/v1/profile/avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  )
  return response.data
}

export async function deleteAvatar() {
  return del<void>('/v1/profile/avatar')
}
