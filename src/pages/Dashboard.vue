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
        <div class="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <h1 class="text-3xl font-bold">Bienvenido, {{ currentUser.name || 'Usuario' }}</h1>
          <p v-if="isAdmin" class="mt-2 opacity-90">Panel de control y estadísticas del sistema</p>
          <p class="mt-4 text-sm text-black bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full">
            Última actualización: {{ lastUpdated }}
          </p>
        </div>

        <!-- SECCIÓN 1: PROYECTOS Y ACTIVIDADES (PRIORIDAD ALTA) -->
        <div v-if="isAdmin" class="mb-10">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Proyectos y Actividades
          </h2>
          
          <!-- Tarjetas de resumen de proyectos -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div v-for="(count, status) in projectsByStatus" :key="status"
              class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full p-3 mr-4" :class="getProjectStatusBgClass(status)">
                    <svg class="w-6 h-6" :class="getProjectStatusTextClass(status)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">{{ status }}</p>
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
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Estado de Proyectos
              </h3>
              <div class="chart-container" style="position: relative; height:250px; width:100%">
                <canvas ref="projectStatusChart"></canvas>
              </div>
            </div>
            
            <!-- Proyectos por Categoría -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Proyectos por Categoría
              </h3>
              <div class="chart-container" style="position: relative; height:250px; width:100%">
                <canvas ref="projectCategoryChart"></canvas>
              </div>
            </div>
            
            <!-- Tendencia de Actividades -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Tendencia de Actividades
              </h3>
              <div class="chart-container" style="position: relative; height:250px; width:100%">
                <canvas ref="activityTrendChart"></canvas>
              </div>
            </div>
          </div>
          
          <!-- Proyectos Recientes -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Proyectos Recientes
            </h3>
            <div v-if="recentProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="project in recentProjects" :key="project.id" 
                class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-800">{{ project.name }}</h4>
                  <span class="px-2 py-1 text-xs rounded-full" :class="getProjectStatusClass(project.status)">
                    {{ project.status }} {{ console.log(project) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ project.description }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>{{ formatDate(project.startDate) }}</span>
                  <span>{{ project.department }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No hay proyectos recientes
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: TICKETS (PRIORIDAD MEDIA) -->
        <div v-if="isAdmin" class="mb-10">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tickets y Soporte
          </h2>
          
          <!-- Tarjetas de resumen de tickets -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <!-- Total Tickets -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-blue-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Total Tickets</p>
                    <p class="text-2xl font-bold text-gray-800">{{ totalTickets }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-blue-500 h-1"></div>
            </div>

            <!-- Pendientes -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-amber-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Pendientes</p>
                    <p class="text-2xl font-bold text-gray-800">{{ pendingTickets }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-amber-500 h-1"></div>
            </div>

            <!-- Resueltos -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-green-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Resueltos</p>
                    <p class="text-2xl font-bold text-gray-800">{{ resolvedTickets }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-green-500 h-1"></div>
            </div>
          </div>
          
          <!-- Gráfico y tickets recientes -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Gráfico de tickets -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Tickets por Estado
              </h3>
              <div class="chart-container" style="position: relative; height:300px; width:100%">
                <canvas id="ticketsChart" ref="chartCanvas"></canvas>
              </div>
            </div>

            <!-- Tickets Recientes -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tickets Recientes
              </h3>
              <div v-if="recentTickets.length > 0">
                <div v-for="ticket in recentTickets" :key="ticket.id" 
                  class="mb-4 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-800 truncate">{{ ticket.titulo }}</h4>
                      <p class="text-sm text-gray-500">{{ formatDate(ticket.createdAt) }}</p>
                    </div>
                    <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(ticket.estado)">
                      {{ getStatusText(ticket.estado) }}
                    </span>
                  </div>
                </div>
                <div class="mt-4 text-center">
                  <router-link to="/tickets" 
                    class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                    <span>Ver todos los tickets</span>
                    <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </router-link>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                No hay tickets recientes
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 3: EQUIPOS (PRIORIDAD BAJA) -->
        <div v-if="isAdmin" class="mb-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg class="w-6 h-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            Inventario de Equipos
          </h2>
          
          <!-- Tarjetas de resumen de equipos -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <!-- Total Equipos -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-gray-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Total Equipos</p>
                    <p class="text-2xl font-bold text-gray-800">{{ totalEquipos }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-gray-600 h-1"></div>
            </div>
            
            <!-- Equipos Asignados -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-indigo-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">Asignados</p>
                    <p class="text-2xl font-bold text-gray-800">{{ totalEquiposAsignados }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-indigo-600 h-1"></div>
            </div>
            
            <!-- Equipos No Asignados -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="rounded-full bg-purple-100 p-3 mr-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-500">No Asignados</p>
                    <p class="text-2xl font-bold text-gray-800">{{ totalEquiposNoAsignados }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-purple-600 h-1"></div>
            </div>
          </div>
          
          <!-- Equipos por Departamento -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Equipos por Departamento
            </h3>
            <div v-if="Object.keys(equiposPorDepartamento).length > 0">
              <div
                v-for="(count, dept) in equiposPorDepartamento"
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
                    :style="{width: `${(count / totalEquipos) * 100}%`}"></div>
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
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { getTickets } from '@/api/tickets.js'
import { getEquipos } from '@/api/equipos.js'
import { getTasks } from '@/api/task.js'
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
    const chartCanvas = ref(null)
    const projectStatusChart = ref(null)
    const projectCategoryChart = ref(null)
    const activityTrendChart = ref(null)
    
    const tickets = ref([])
    const equipos = ref([])
    const projects = ref([])
    const lastUpdated = ref(new Date().toLocaleString('es-ES'))
    
    // Estadísticas de tickets
    const totalTickets = computed(() => tickets.value.length)
    const pendingTickets = computed(() => 
      tickets.value.filter(t => ['nuevo', 'pendiente', 'en_proceso', 'en_espera'].includes(t.estado)).length
    )
    const resolvedTickets = computed(() => 
      tickets.value.filter(t => ['resuelto', 'cerrado'].includes(t.estado)).length
    )
    
    // Total de equipos
    const totalEquipos = computed(() => equipos.value.length)
    const totalEquiposAsignados = computed(() => 
      equipos.value.filter(e => e.estado && e.estado.toLowerCase() === 'asignado').length
    )
    const totalEquiposNoAsignados = computed(() => 
      equipos.value.filter(e => !e.estado || e.estado.toLowerCase() !== 'asignado').length
    )

    // Computed para agrupar equipos por departamento
    const equiposPorDepartamento = computed(() => {
      const counts = {}
      equipos.value.forEach(e => {
        const dept = e.departamento || 'Sin departamento'
        counts[dept] = (counts[dept] || 0) + 1
      })
      return counts
    })
    
    // Tickets recientes (últimos 5)
    const recentTickets = computed(() => {
      return [...tickets.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    })

    const loadData = async () => {
      try {
        tickets.value = await getTickets()
        equipos.value = await getEquipos()
        
        // Cargar proyectos/actividades
        const tasksResponse = await getTasks()
        projects.value = tasksResponse || []
        
        lastUpdated.value = new Date().toLocaleString('es-ES')
        loadChart()
        loadProjectCharts()
      } 
      catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    // Declarar instancias de gráficos
    let chartInstance = null;
    let projectStatusChartInstance = null;
    let projectCategoryChartInstance = null;
    let activityTrendChartInstance = null;

    const loadChart = () => {
      if (!chartCanvas.value) return
      
      const statusCounts = {
        nuevo: 0,
        pendiente: 0,
        en_proceso: 0,
        en_espera: 0,
        resuelto: 0,
        cerrado: 0
      }
      
      tickets.value.forEach(ticket => {
        if (statusCounts.hasOwnProperty(ticket.estado)) {
          statusCounts[ticket.estado]++
        }
      })

      const ctx = chartCanvas.value.getContext('2d')
      if (chartInstance) {
        chartInstance.destroy()
      }
      
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

    const getStatusClass = (status) => {
      const classes = {
        nuevo: 'bg-blue-100 text-blue-800',
        pendiente: 'bg-amber-100 text-amber-800',
        en_proceso: 'bg-amber-100 text-amber-800',
        en_espera: 'bg-purple-100 text-purple-800',
        resuelto: 'bg-green-100 text-green-800',
        cerrado: 'bg-gray-100 text-gray-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        nuevo: 'Nuevo',
        pendiente: 'Pendiente',
        
        'en-progreso': 'En Progreso',
        en_espera: 'En Espera',
        resuelto: 'Resuelto',
        cerrado: 'Cerrado'
      }
      return texts[status] || status
    }

    // Nuevas propiedades para proyectos
    const projectsByStatus = computed(() => {
      const counts = {
        'en-progreso': 0,
        'pendiente': 0,
        'completada': 0,
        'cancelada': 0
      }
      projects.value.forEach(p => {
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
    
    const projectsByCategory = computed(() => {
      const counts = {}
      projects.value.forEach(p => {
        const category = p.Category || 'Sin Categoría'
        counts[category] = (counts[category] || 0) + 1
      })
      return counts
    })
    
    const recentProjects = computed(() => {
      return [...projects.value]
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 6)
    })
    
    const loadProjectCharts = () => {
      // Gráfico de Estado de Proyectos (Doughnut)
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
      
      // Gráfico de Proyectos por Categoría (Bar)
      if (projectCategoryChart.value) {
        const catData = projectsByCategory.value
        
        // Ordenar por cantidad (mayor a menor) y limitar a los 6 principales
        const sortedCats = Object.entries(catData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
        
        const catLabels = sortedCats.map(d => d[0])
        const catValues = sortedCats.map(d => d[1])
        
        if (projectCategoryChartInstance) {
          projectCategoryChartInstance.destroy()
        }
        
        projectCategoryChartInstance = new Chart(projectCategoryChart.value, {
          type: 'bar',
          data: {
            labels: catLabels,
            datasets: [{
              label: 'Proyectos',
              data: catValues,
              backgroundColor: '#8B5CF6',
              borderColor: '#7C3AED',
              borderWidth: 1,
              borderRadius: 4,
              maxBarThickness: 35
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              },
              y: {
                grid: {
                  display: false
                }
              }
            }
          }
        })
      }
      
      // Gráfico de Tendencia de Actividades (Line)
      if (activityTrendChart.value) {
        // Agrupar actividades por mes
        const activityByMonth = Array(12).fill(0)
        const currentYear = new Date().getFullYear()
        
        projects.value.forEach(p => {
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
            plugins: {
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            }
          }
        })
      }
    }
    
    // Función para obtener clase CSS según el estado del proyecto (para tarjetas)
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
    
    onMounted(() => {
      loadData()
      window.addEventListener('resize', () => {
        if (chartInstance) chartInstance.resize()
        if (projectStatusChartInstance) projectStatusChartInstance.resize()
        if (projectCategoryChartInstance) projectCategoryChartInstance.resize()
        if (activityTrendChartInstance) activityTrendChartInstance.resize()
      })
    })
    
    onUnmounted(() => {
      if (chartInstance) chartInstance.destroy()
      if (projectStatusChartInstance) projectStatusChartInstance.destroy()
      if (projectCategoryChartInstance) projectCategoryChartInstance.destroy()
      if (activityTrendChartInstance) activityTrendChartInstance.destroy()
      
      window.removeEventListener('resize', () => {
        if (chartInstance) chartInstance.resize()
        if (projectStatusChartInstance) projectStatusChartInstance.resize()
        if (projectCategoryChartInstance) projectCategoryChartInstance.resize()
        if (activityTrendChartInstance) activityTrendChartInstance.resize()
      })
    })
    
    return {
      sidebarExpanded,
      chartCanvas,
      projectStatusChart,
      projectCategoryChart,
      activityTrendChart,
      isAdmin,
      currentUser,
      tickets,
      equipos,
      projects,
      totalTickets,
      pendingTickets,
      resolvedTickets,
      totalEquipos,
      totalEquiposAsignados,
      totalEquiposNoAsignados,
      equiposPorDepartamento,
      recentTickets,
      recentProjects,
      lastUpdated,
      formatDate,
      getStatusClass,
      getStatusText,
      getProjectStatusBgClass,
      getProjectStatusTextClass,
      getProjectStatusBarClass,
      getProjectStatusClass,
      projectsByStatus,
      projectsByCategory
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

/* Animaciones para las tarj
/* Efecto de gradiente para el header */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
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
</style>