<template>
    <div class="dashboard-container flex w-full bg-gray-50">
      <!-- Sidebar -->
      <Sidebar v-model:isExpanded="sidebarExpanded" />
  
      <!-- Contenido del Dashboard -->
      <div 
        class="content flex-1 w-full relative transition-all duration-300"
        :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">
        <div class="p-4 md:p-8">
          <!-- Header con información de bienvenida -->
          <div class="mb-8 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div class="absolute inset-0 bg-pattern opacity-10"></div>
            <div class="relative z-10">
              <h1 class="text-3xl font-bold">Bienvenido, {{ currentUser.name || 'Usuario' }}</h1>
              <p v-if="isAdmin" class="mt-2 opacity-90">Panel de control y estadísticas del sistema</p>
              <p class="mt-4 text-sm bg-white text-black bg-opacity-20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                Última actualización: {{ lastUpdated }}
              </p>
            </div>
            <div class="absolute right-6 bottom-6 opacity-20">
              <svg class="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
  
          <!-- SECCIÓN: PROYECTOS Y ACTIVIDADES -->
          <div class="mb-10">
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span v-if="isAdmin" class="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                <!-- Icono para admin -->
              </span>
              <span v-else class="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                <!-- Icono distinto para usuario -->
              </span>
              Proyectos y Actividades
            </h2>
            <!-- Tarjetas de resumen de proyectos -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div v-for="(count, status) in projectsByStatus" :key="status"
                class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="rounded-full p-3 mr-4" :class="getProjectStatusBgClass(status)">
                      <svg class="w-6 h-6" :class="getProjectStatusTextClass(status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500 capitalize">{{ status }}</p>
                      <p class="text-2xl font-bold text-gray-800">{{ count }}</p>
                    </div>
                  </div>
                </div>
                <div class="h-1" :class="getProjectStatusBarClass(status)"></div>
              </div>
            </div>
            
            <!-- Gráficos de proyectos -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <!-- Estado de Proyectos -->
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span class="text-indigo-600 mr-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </span>
                  Estado de Proyectos
                </h3>
                <div class="chart-container" style="position: relative; height:250px; width:100%">
                  <canvas ref="projectStatusChart"></canvas>
                </div>
              </div>
              
              <!-- Proyectos por Marca -->
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span class="text-green-600 mr-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5" />
                    </svg>
                  </span>
                  Proyectos por Marca
                </h3>
                <div class="chart-container" style="position: relative; height:250px; width:100%">
                  <canvas ref="projectBrandChart"></canvas>
                </div>
              </div>
              
              <!-- Proyectos por Célula -->
              <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span class="text-orange-600 mr-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                    </svg>
                  </span>
                  Proyectos por Célula
                </h3>
                <div class="chart-container" style="position: relative; height:250px; width:100%">
                  <canvas ref="projectCelulaChart"></canvas>
                </div>
              </div>
            </div>
            
            <!-- Proyectos Recientes -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 mb-8 border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-indigo-600 mr-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Proyectos Recientes
                </div>
                <button class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                  Ver todos
                  <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </h3>
              <div v-if="recentProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="project in recentProjects" :key="project.id" 
                  class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors hover:shadow-sm">
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="font-medium text-gray-800">{{ project.name }}</h4>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getProjectStatusClass(project.status)">
                      {{ project.status }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ project.description }}</p>
                  <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatDate(project.startDate) }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ project.department }}
                    </span>
                  </div>
                  <!-- Nueva sección para la información de subtareas -->
                  <div v-if="project.subtasks && project.subtasks.length" class="mt-2 bg-gray-50 p-2 rounded-md">
                    <div class="text-xs font-medium text-gray-700 mb-1">Progreso de subtareas</div>
                    <div class="flex items-center mb-1">
                      <div class="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                        <div class="bg-green-500 h-1.5 rounded-full" 
                          :style="{width: `${(project.subtasks.filter(s => s.status.toLowerCase() === 'completada').length / project.subtasks.length) * 100}%`}">
                        </div>
                      </div>
                      <span class="text-xs text-gray-500">
                        {{ project.subtasks.filter(s => s.status.toLowerCase() === 'completada').length }}/{{ project.subtasks.length }}
                      </span>
                    </div>
                    <div v-if="project.subtasks.filter(s => s.status.toLowerCase() === 'en-progreso' || s.status.toLowerCase() === 'en-proceso').length" 
                      class="text-xs text-gray-600 flex items-center">
                      <span class="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                      En progreso: 
                      {{ project.subtasks.find(s => s.status.toLowerCase() === 'en-progreso' || s.status.toLowerCase() === 'en-proceso').name }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                No hay proyectos recientes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
  import Sidebar from '@/components/Sidebar.vue'
  import { getTasks } from '@/api/taskOT.js'
  import { 
    Chart, 
    BarController, 
    BarElement, 
    CategoryScale, 
    LinearScale, 
    Legend, 
    Title, 
    Tooltip,
    DoughnutController,
    ArcElement,
    LineController,
    LineElement,
    PointElement
  } from 'chart.js'
  
  Chart.register(
    BarController, 
    BarElement, 
    CategoryScale, 
    LinearScale, 
    Legend, 
    Title, 
    Tooltip,
    DoughnutController,
    ArcElement,
    LineController,
    LineElement,
    PointElement
  )
  
  export default {
    components: { Sidebar },
    props: {
      isExpanded: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      toggleSidebar() {
        this.$emit('update:isExpanded', !this.isExpanded)
      }
    },
    setup() {
      const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || {})
      const isAdmin = computed(() => currentUser.value.role && currentUser.value.role.toLowerCase() === 'admin')
      
      const sidebarExpanded = ref(false)
      const projectStatusChart = ref(null)
      const projectBrandChart = ref(null)
      const projectCelulaChart = ref(null)
      const activityTrendChart = ref(null)
      
      // Proyectos obtenidos de la API
      const projects = ref([])
      const lastUpdated = ref(new Date().toLocaleString('es-ES'))
      
      // Si el usuario no es admin, filtramos los proyectos para que solo vea los suyos.
      const filteredProjects = computed(() => {
        console.log('currentUser:', currentUser.value);
        console.log('Total projects:', projects.value.length);
        if (isAdmin.value) {
          console.log('El usuario es admin, se muestran todos los proyectos.');
          return projects.value;
        }
        const filtered = projects.value.filter(p => {
          console.log('Comparando project.createdById:', p.createdById, 'con currentUser.id:', currentUser.value.id);
          return p.createdById === currentUser.value.id;
        });
        console.log('Proyectos filtrados:', filtered);
        return filtered;
      });
      
      // Watch para forzar evaluación de filteredProjects
      watch(filteredProjects, (newVal) => {
        console.log('Watch - Proyectos filtrados cambiaron:', newVal);
      }, { immediate: true });
      
      const projectsByStatus = computed(() => {
        const counts = {
          'en-progreso': 0,
          'pendiente': 0,
          'completada': 0,
          'cancelada': 0
        }
        filteredProjects.value.forEach(p => {
          let normalized = p.status ? p.status.toLowerCase() : 'pendiente'
          if(normalized === 'en-proceso') {
            normalized = 'en-progreso'
          }
          if(['en-progreso', 'pendiente', 'completada'].includes(normalized)) {
            counts[normalized]++
          } else {
            counts['cancelada']++
          }
        })
        return counts
      })
      
      const projectsByBrand = computed(() => {
        const counts = {}
        filteredProjects.value.forEach(p => {
          const brand = p.marca || 'Sin Marca'
          counts[brand] = (counts[brand] || 0) + 1
        })
        return counts
      })
      
      const projectsByCelula = computed(() => {
        const counts = {}
        filteredProjects.value.forEach(p => {
          const celula = p.celula || 'Sin Célula'
          counts[celula] = (counts[celula] || 0) + 1
        })
        return counts
      })
      
      const recentProjects = computed(() => {
        return [...filteredProjects.value]
          .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
          .slice(0, 6)
      })
      
      const loadData = async () => {
        try {
          const tasksResponse = await getTasks()
          projects.value = tasksResponse || []
          lastUpdated.value = new Date().toLocaleString('es-ES')
          loadProjectCharts()
        } 
        catch (error) {
          console.error('Error loading dashboard data:', error)
        }
      }
  
      let projectStatusChartInstance = null;
      let projectBrandChartInstance = null;
      let projectCelulaChartInstance = null;
      let activityTrendChartInstance = null;
  
      const loadProjectCharts = () => {
        if (projectStatusChart.value) {
          const statusData = projectsByStatus.value;
          const labels = Object.keys(statusData);
          const data = Object.values(statusData);
          
          if (projectStatusChartInstance) {
            projectStatusChartInstance.destroy();
          }
          
          projectStatusChartInstance = new Chart(projectStatusChart.value, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: labels.map(label => {
                  const statusColors = {
                    'en-progreso': '#3B82F6',
                    'pendiente': '#F59E0B',
                    'completada': '#10B981'
                  };
                  return statusColors[label] || '#9CA3AF';
                }),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 12,
                    padding: 15
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }
          });
        }
        
        if (projectBrandChart.value) {
          const brandData = projectsByBrand.value;
          
          const sortedBrands = Object.entries(brandData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
          
          const brandLabels = sortedBrands.map(d => d[0])
          const brandValues = sortedBrands.map(d => d[1])
          
          if (projectBrandChartInstance) {
            projectBrandChartInstance.destroy()
          }
          
          projectBrandChartInstance = new Chart(projectBrandChart.value, {
            type: 'bar',
            data: {
              labels: brandLabels,
              datasets: [{
                label: 'Proyectos por Marca',
                data: brandValues,
                backgroundColor: '#34D399',
                borderColor: '#10B981',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 35
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: { precision: 0 }
                },
                y: { grid: { display: false } }
              }
            }
          })
        }
        
        if (projectCelulaChart.value) {
          const celulaData = projectsByCelula.value;
          
          const sortedCelulas = Object.entries(celulaData)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
          
          const celulaLabels = sortedCelulas.map(d => d[0])
          const celulaValues = sortedCelulas.map(d => d[1])
          
          if (projectCelulaChartInstance) {
            projectCelulaChartInstance.destroy()
          }
          
          projectCelulaChartInstance = new Chart(projectCelulaChart.value, {
            type: 'bar',
            data: {
              labels: celulaLabels,
              datasets: [{
                label: 'Proyectos por Célula',
                data: celulaValues,
                backgroundColor: '#F97316',
                borderColor: '#EA580C',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 35
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: { precision: 0 }
                },
                y: { grid: { display: false } }
              }
            }
          })
        }
        
        if (activityTrendChart.value) {
          const activityByMonth = Array(12).fill(0)
          const currentYear = new Date().getFullYear()
          
          filteredProjects.value.forEach(p => {
            if (p.startDate) {
              const date = new Date(p.startDate)
              if (date.getFullYear() === currentYear) {
                const month = date.getMonth()
                activityByMonth[month]++
              }
            }
          })
          
          if (activityTrendChartInstance) {
            activityTrendChartInstance.destroy()
          }
          
          activityTrendChartInstance = new Chart(activityTrendChart.value, {
            type: 'line',
            data: {
              labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
              datasets: [{
                label: `Actividades ${currentYear}`,
                data: activityByMonth,
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: true, position: 'top' } },
              scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
              }
            }
          })
        }
      }
      
      const getProjectStatusBgClass = (status) => {
        const classes = {
          'en-progreso': 'bg-blue-100',
          'pendiente': 'bg-amber-100',
          'completada': 'bg-green-100',
          'cancelada': 'bg-gray-100'
        }
        return classes[status] || 'bg-gray-100'
      }
      
      const getProjectStatusTextClass = (status) => {
        const classes = {
          'en-progreso': 'text-blue-600',
          'pendiente': 'text-amber-600',
          'completada': 'text-green-600',
          'cancelada': 'text-gray-600'
        }
        return classes[status] || 'text-gray-600'
      }
      
      const getProjectStatusBarClass = (status) => {
        const classes = {
          'en-progreso': 'bg-blue-500',
          'pendiente': 'bg-amber-500',
          'completada': 'bg-green-500',
          'cancelada': 'bg-gray-500'
        }
        return classes[status] || 'bg-gray-500'
      }
  
      const getProjectStatusClass = (status) => {
        let normalized = status ? status.toLowerCase() : 'pendiente'
        if(normalized === 'en-proceso') normalized = 'en-progreso'
        if(['en-progreso', 'pendiente', 'completada'].indexOf(normalized) !== -1) {
          if(normalized === 'en-progreso') return 'bg-blue-100 text-blue-600'
          if(normalized === 'pendiente') return 'bg-amber-100 text-amber-600'
          if(normalized === 'completada') return 'bg-green-100 text-green-600'
        }
        return 'bg-gray-100 text-gray-600'
      }
      
      const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      
      onMounted(() => {
        loadData()
        window.addEventListener('resize', () => {
          if (projectStatusChartInstance) projectStatusChartInstance.resize()
          if (projectBrandChartInstance) projectBrandChartInstance.resize()
          if (projectCelulaChartInstance) projectCelulaChartInstance.resize()
          if (activityTrendChartInstance) activityTrendChartInstance.resize()
        })
      })
      
      onUnmounted(() => {
        if (projectStatusChartInstance) projectStatusChartInstance.destroy()
        if (projectBrandChartInstance) projectBrandChartInstance.destroy()
        if (projectCelulaChartInstance) projectCelulaChartInstance.destroy()
        if (activityTrendChartInstance) activityTrendChartInstance.destroy()
        
        window.removeEventListener('resize', () => {
          if (projectStatusChartInstance) projectStatusChartInstance.resize()
          if (projectBrandChartInstance) projectBrandChartInstance.resize()
          if (projectCelulaChartInstance) projectCelulaChartInstance.resize()
          if (activityTrendChartInstance) activityTrendChartInstance.resize()
        })
      })
      
      return {
        sidebarExpanded,
        projectStatusChart,
        projectBrandChart,
        projectCelulaChart,
        activityTrendChart,
        isAdmin,
        currentUser,
        projects,
        lastUpdated,
        formatDate,
        getProjectStatusBgClass,
        getProjectStatusTextClass,
        getProjectStatusBarClass,
        getProjectStatusClass,
        projectsByStatus,
        projectsByBrand,
        projectsByCelula,
        recentProjects,
        filteredProjects
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
  }
  
  .content {
    flex: 1;
  }
  
  .chart-container {
    transition: all 0.3s ease;
    position: relative;
  }
  
  /* Efecto de gradiente para el header */
  .bg-gradient-to-r {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
  }
  
  /* Patrón de fondo para el header */
  .bg-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  /* Estilos adicionales para mejorar la interfaz */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Mejoras para tarjetas de proyectos */
  .border-gray-100 {
    transition: all 0.2s ease;
  }
  
  .border-gray-100:hover {
    border-color: #e5e7eb;
    background-color: #f9fafb;
  }
  
  /* Estilos para gráficos responsivos */
  @media (max-width: 768px) {
    .chart-container {
      height: 220px !important;
    }
  }
  
  /* Mejoras para botones y elementos interactivos */
  button, a {
    transition: all 0.2s ease;
  }
  
  /* Animación para cargas y transiciones */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease forwards;
  }
  
  /* Mejoras para la legibilidad en dispositivos móviles */
  @media (max-width: 640px) {
    .text-3xl {
      font-size: 1.5rem;
    }
    
    .p-6 {
      padding: 1rem;
    }
  }
  
  /* Estilos para tooltips personalizados */
  .custom-tooltip {
    position: relative;
  }
  
  .custom-tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
  }
  
  /* Mejoras para accesibilidad - focus visible */
  :focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  /* Nuevos estilos modernos */
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  
  /* Efecto de elevación para tarjetas */
  .hover\:shadow-md:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
  
  /* Estilo para barra de progreso */
  .rounded-full {
    border-radius: 9999px;
  }
  
  /* Animación para elementos al cargar */
  .dashboard-container {
    animation: fadeIn 0.5s ease-out;
  }
  
  /* Estilo para las tarjetas de proyectos */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Efecto de hover para botones */
  button:hover {
    transform: translateY(-1px);
  }
  </style>