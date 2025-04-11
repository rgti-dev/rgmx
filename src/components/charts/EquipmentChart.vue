<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
    </div>
    <div v-else>
      <div v-if="Object.keys(equipmentByDepartment).length > 0">
        <div
          v-for="(count, dept) in equipmentByDepartment"
          :key="dept"
          class="mb-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div class="flex justify-between items-center">
            <h4 class="font-medium text-gray-800 truncate">{{ dept }}</h4>
            <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
              {{ count }}
            </span>
          </div>
          <div class="mt-2 bg-gray-200 rounded-full h-2">
            <div class="bg-indigo-500 h-2 rounded-full" 
              :style="{width: `${(count / totalEquipment) * 100}%`}"></div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-12 text-gray-500">
        <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        No hay equipos registrados
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'EquipmentChart',
  props: {
    equipment: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const totalEquipment = computed(() => props.equipment.length)
    
    const equipmentByDepartment = computed(() => {
      const counts = {}
      props.equipment.forEach(e => {
        const dept = e.departamento || 'Sin departamento'
        counts[dept] = (counts[dept] || 0) + 1
      })
      
      // Sort by count (descending)
      return Object.fromEntries(
        Object.entries(counts).sort((a, b) => b[1] - a[1])
      )
    })

    return {
      totalEquipment,
      equipmentByDepartment
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 250px;
}
</style>