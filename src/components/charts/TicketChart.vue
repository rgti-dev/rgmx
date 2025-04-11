<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    <div v-else>
      <div class="chart-container" style="position: relative; height: 300px; width: 100%">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { 
  Chart, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Legend, 
  Title, 
  Tooltip
} from 'chart.js'

Chart.register(
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Legend, 
  Title, 
  Tooltip
)

export default {
  name: 'TicketChart',
  props: {
    tickets: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const chartCanvas = ref(null)
    let chartInstance = null

    const createChart = () => {
      if (!chartCanvas.value) return
      
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      const statusCounts = {
        nuevo: 0,
        pendiente: 0,
        en_proceso: 0,
        en_espera: 0,
        resuelto: 0,
        cerrado: 0
      }
      
      props.tickets.forEach(ticket => {
        if (statusCounts.hasOwnProperty(ticket.estado)) {
          statusCounts[ticket.estado]++
        }
      })
      
      const ctx = chartCanvas.value.getContext('2d')
      
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Nuevo', 'Pendiente', 'En Proceso', 'En Espera', 'Resuelto', 'Cerrado'],
          datasets: [{
            label: 'Tickets por Estado',
            data: [
              statusCounts.nuevo,
              statusCounts.pendiente,
              statusCounts.en_proceso,
              statusCounts.en_espera,
              statusCounts.resuelto,
              statusCounts.cerrado,
            ],
            backgroundColor: [
              '#4F46E5',
              '#F59E0B',
              '#0EA5E9',
              '#8B5CF6',
              '#10B981',
              '#6B7280'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Tickets: ${context.raw}`
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      })
    }

    watch(() => props.tickets, () => {
      createChart()
    }, { deep: true })

    onMounted(() => {
      createChart()
      window.addEventListener('resize', () => {
        if (chartInstance) chartInstance.resize()
      })
    })

    onUnmounted(() => {
      if (chartInstance) chartInstance.destroy()
      window.removeEventListener('resize', () => {
        if (chartInstance) chartInstance.resize()
      })
    })

    return {
      chartCanvas
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>