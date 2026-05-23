import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'salio_action_settings'

export interface PresetAction {
  id: string
  name: string
  emoji: string
  score: number        // điểm KPI
  durationMin: number  // thời gian thực hiện (phút)
}

export type ActionModule = 'lead' | 'deal' | 'deploy'

interface StoredData {
  lead: PresetAction[]
  deal: PresetAction[]
  deploy: PresetAction[]
}

const DEFAULT_ACTIONS: StoredData = {
  lead: [
    { id: 'l1', name: 'Gọi điện',      emoji: '📞', score: 5,  durationMin: 10 },
    { id: 'l2', name: 'Gửi Email',     emoji: '📧', score: 3,  durationMin: 5  },
    { id: 'l3', name: 'Nhắn Zalo',     emoji: '💬', score: 3,  durationMin: 3  },
    { id: 'l4', name: 'Gặp mặt',       emoji: '🤝', score: 15, durationMin: 60 },
    { id: 'l5', name: 'Demo sản phẩm', emoji: '📊', score: 20, durationMin: 90 },
    { id: 'l6', name: 'Ghi chú',       emoji: '📝', score: 1,  durationMin: 2  },
  ],
  deal: [
    { id: 'd1', name: 'Gọi điện',       emoji: '📞', score: 5,  durationMin: 10 },
    { id: 'd2', name: 'Email báo giá',  emoji: '📧', score: 8,  durationMin: 15 },
    { id: 'd3', name: 'Gặp mặt',        emoji: '🤝', score: 15, durationMin: 60 },
    { id: 'd4', name: 'Demo sản phẩm',  emoji: '📊', score: 25, durationMin: 90 },
    { id: 'd5', name: 'Ký hợp đồng',   emoji: '✍️', score: 50, durationMin: 30 },
    { id: 'd6', name: 'Follow-up',      emoji: '🔁', score: 5,  durationMin: 10 },
  ],
  deploy: [
    { id: 'dp1', name: 'Cài đặt hệ thống',  emoji: '🔧', score: 20, durationMin: 120 },
    { id: 'dp2', name: 'Đào tạo nhân viên', emoji: '🎓', score: 15, durationMin: 90  },
    { id: 'dp3', name: 'Hỗ trợ kỹ thuật',  emoji: '🛠️', score: 10, durationMin: 60  },
    { id: 'dp4', name: 'Kiểm tra hệ thống', emoji: '✅', score: 10, durationMin: 30  },
    { id: 'dp5', name: 'Họp tiến độ',       emoji: '📋', score: 8,  durationMin: 60  },
    { id: 'dp6', name: 'Báo cáo tiến độ',   emoji: '📑', score: 5,  durationMin: 30  },
  ],
}

function load(): StoredData {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      const parsed = JSON.parse(s) as Partial<StoredData>
      return {
        lead:   parsed.lead?.length   ? parsed.lead   : [...DEFAULT_ACTIONS.lead],
        deal:   parsed.deal?.length   ? parsed.deal   : [...DEFAULT_ACTIONS.deal],
        deploy: parsed.deploy?.length ? parsed.deploy : [...DEFAULT_ACTIONS.deploy],
      }
    }
  } catch { /* ignore */ }
  return {
    lead:   [...DEFAULT_ACTIONS.lead],
    deal:   [...DEFAULT_ACTIONS.deal],
    deploy: [...DEFAULT_ACTIONS.deploy],
  }
}

export const useActionSettingsStore = defineStore('actionSettings', () => {
  const data = load()
  const lead   = ref<PresetAction[]>(data.lead)
  const deal   = ref<PresetAction[]>(data.deal)
  const deploy = ref<PresetAction[]>(data.deploy)

  function save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      lead: lead.value, deal: deal.value, deploy: deploy.value,
    }))
  }

  function getActions(module: ActionModule): PresetAction[] {
    if (module === 'lead') return lead.value
    if (module === 'deal') return deal.value
    return deploy.value
  }

  function addAction(module: ActionModule, newData: Omit<PresetAction, 'id'>): void {
    const action: PresetAction = { id: `${module}_${Date.now()}`, ...newData }
    getActions(module).push(action)
    save()
  }

  function updateAction(module: ActionModule, id: string, updates: Partial<Omit<PresetAction, 'id'>>): void {
    const action = getActions(module).find(a => a.id === id)
    if (!action) return
    if (updates.name      !== undefined) action.name      = updates.name
    if (updates.emoji     !== undefined) action.emoji     = updates.emoji
    if (updates.score     !== undefined) action.score     = updates.score
    if (updates.durationMin !== undefined) action.durationMin = updates.durationMin
    save()
  }

  function deleteAction(module: ActionModule, id: string): void {
    if (module === 'lead')   lead.value   = lead.value.filter(a => a.id !== id)
    else if (module === 'deal')  deal.value   = deal.value.filter(a => a.id !== id)
    else                         deploy.value = deploy.value.filter(a => a.id !== id)
    save()
  }

  return { lead, deal, deploy, getActions, addAction, updateAction, deleteAction }
})
