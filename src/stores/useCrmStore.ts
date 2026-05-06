import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getCrmDashboard, updateCrmTaskStatus } from '@/services/crm'
import { isSuccess } from '@/types/common'
import type { CrmKpiMetric, CrmPipelineStage, CrmTaskItem } from '@/types/crm'

export const useCrmStore = defineStore('crm', () => {
  const kpis = ref<CrmKpiMetric[]>([])
  const pipeline = ref<CrmPipelineStage[]>([])
  const tasks = ref<CrmTaskItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalTasksToday = computed(() => tasks.value.length)

  async function fetchDashboard(force = false): Promise<void> {
    if (!force && (kpis.value.length > 0 || pipeline.value.length > 0 || tasks.value.length > 0)) {
      return
    }

    loading.value = true
    error.value = null

    const result = await getCrmDashboard()
    if (!isSuccess(result)) {
      error.value = result.error
      loading.value = false
      return
    }

    kpis.value = result.data.kpis
    pipeline.value = result.data.pipeline
    tasks.value = result.data.tasks
    loading.value = false
  }

  async function setTaskDone(taskId: string, done: boolean): Promise<void> {
    const currentTask = tasks.value.find((task) => task.id === taskId)
    if (!currentTask) {
      return
    }

    const previousValue = currentTask.done
    currentTask.done = done

    const result = await updateCrmTaskStatus(taskId, done)
    if (!isSuccess(result)) {
      currentTask.done = previousValue
      error.value = result.error
      return
    }

    const index = tasks.value.findIndex((task) => task.id === taskId)
    if (index >= 0) {
      tasks.value[index] = result.data
    }
  }

  return {
    kpis,
    pipeline,
    tasks,
    loading,
    error,
    totalTasksToday,
    fetchDashboard,
    setTaskDone,
  }
})
