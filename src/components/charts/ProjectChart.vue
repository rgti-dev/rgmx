<template>
  <div class="chart-wrapper">
    <div v-if="loading" class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
    <div v-else>
      <div class="chart-container" style="position: relative; height: 250px; width: 100%">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { 
  Chart, 
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
} from 'chart.js'

Chart.register(
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
)

export default {
  name: 'ProjectChart',
  props: {
    chartType: {
      type: String,
      default: 'doughnut',
      validator: (value) => ['doughnut', 'bar', 'line'].includes(value)
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
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
      
      const ctx = chartCanvas.value.getContext('2d')
      
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: props.chartType === 'doughnut' ? 'right' : 'top',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        }
      }
      
      chartInstance = new Chart(ctx, {
        type: props.chartType,
        data: props.chartData,
        options: { ...defaultOptions, ...props.chartOptions }
      })
    }

    watch(() => props.chartData, () => {
      createChart()
    }, { deep: true })
    
    watch(() => props.chartType, () => {
      createChart()
    })

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
  min-height: 250px;
}
</style>