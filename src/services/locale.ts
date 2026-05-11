import { get, patch } from '@/services/api'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  region: string
}

export interface LocaleSettings {
  userId: string
  language: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  firstDayOfWeek: 'Mon' | 'Sun'
  numberFormat: string
  currency: string
  updatedAt: string
  supportedLanguages: Language[]
}

export type UpdateLocaleInput = Partial<
  Pick<
    LocaleSettings,
    'language' | 'timezone' | 'dateFormat' | 'timeFormat' | 'firstDayOfWeek' | 'numberFormat' | 'currency'
  >
>

export async function fetchLocale() {
  return get<LocaleSettings>('/v1/locale')
}

export async function updateLocale(input: UpdateLocaleInput) {
  return patch<LocaleSettings>('/v1/locale', input)
}
