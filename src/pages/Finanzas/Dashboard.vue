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
        <div class="mb-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
          <h1 class="text-3xl font-bold">Dashboard Financiero</h1>
          <p class="mt-2 opacity-90">Control y seguimiento de gastos, viáticos y presupuestos</p>
          <p class="mt-4 text-sm bg-white bg-opacity-20 inline-block px-3 py-1 rounded-full text-black">
            Última actualización: {{ lastUpdated }}
          </p>
        </div>

        <!-- Tarjetas de resumen -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <!-- Total Solicitudes -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div class="p-5">
              <div class="flex items-center">
                <div class="rounded-full bg-green-100 p-3 mr-4">
                  <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Total Solicitudes</p>
                  <p class="text-2xl font-bold text-gray-800">{{ totalSolicitudes }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center text-sm">
                <span class="text-gray-500">Este mes</span>
                <span class="font-medium text-green-600">+{{ solicitudesMes }} nuevas</span>
              </div>
            </div>
          </div>

          <!-- Solicitudes Pendientes -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div class="p-5">
              <div class="flex items-center">
                <div class="rounded-full bg-yellow-100 p-3 mr-4">
                  <svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Pendientes de Aprobación</p>
                  <p class="text-2xl font-bold text-gray-800">{{ solicitudesPendientes }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center text-sm">
                <span class="text-gray-500">Tiempo promedio</span>
                <span class="font-medium text-yellow-600">{{ tiempoPromedio }} días</span>
              </div>
            </div>
          </div>

          <!-- Presupuesto Disponible -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div class="p-5">
              <div class="flex items-center">
                <div class="rounded-full bg-blue-100 p-3 mr-4">
                  <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Presupuesto Disponible</p>
                  <p class="text-2xl font-bold text-gray-800">${{ formatNumber(presupuestoDisponible) }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center text-sm">
                <span class="text-gray-500">Utilizado</span>
                <span class="font-medium text-blue-600">{{ porcentajeUtilizado }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos y Estadísticas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Gráfico de Gastos por Categoría -->
          <div class="bg-white p-5 rounded-xl shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Gastos por Categoría</h2>
            <div class="h-64">
              <canvas ref="gastosPorCategoriaChart"></canvas>
            </div>
          </div>

          <!-- Gráfico de Tendencia de Gastos -->
          <div class="bg-white p-5 rounded-xl shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Tendencia de Gastos</h2>
            <div class="h-64">
              <canvas ref="tendenciaGastosChart"></canvas>
            </div>
          </div>
          
          <!-- Gráfico de Gastos por Departamento -->
          <div class="bg-white p-5 rounded-xl shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Gastos por Departamento</h2>
            <div class="h-64">
              <canvas ref="gastosPorDepartamentoChart"></canvas>
            </div>
          </div>
          
          <!-- Gráfico de Solicitudes por Estado -->
          <div class="bg-white p-5 rounded-xl shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Solicitudes por Estado</h2>
            <div class="h-64">
              <canvas ref="solicitudesPorEstadoChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Solicitudes Recientes -->
        <div class="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Solicitudes Recientes</h2>
            <router-link to="/finanzas/solicitudes" class="text-green-600 hover:text-green-800 text-sm font-medium">
              Ver todas
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="solicitud in solicitudesRecientes" :key="solicitud.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ solicitud.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ solicitud.solicitante && solicitud.solicitante.nombre ? solicitud.solicitante.nombre : 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ solicitud.concepto }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ formatNumber(solicitud.monto) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(solicitud.estado)">
                      {{ solicitud.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(solicitud.fecha) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import { ref, onMounted, computed } from 'vue';
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
} from 'chart.js';

// Registrar componentes de Chart.js
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
);

// Importar API
import { getAllSolicitudes } from '@/api/solicitud';
//import { getPresupuesto } from '@/api/presupuesto'; // Asumiendo que existe este endpoint

export default {
  components: { Sidebar },
  setup() {
    const sidebarExpanded = ref(false);
    const gastosPorCategoriaChart = ref(null);
    const tendenciaGastosChart = ref(null);
    const gastosPorDepartamentoChart = ref(null);  // New chart reference
    const solicitudesPorEstadoChart = ref(null);   // New chart reference
    const lastUpdated = ref(new Date().toLocaleString('es-ES'));
    
    // Datos reales desde API
    const solicitudes = ref([]);
    const presupuesto = ref({
      total: 0,
      utilizado: 0,
      disponible: 0
    });
    
    // Estadísticas calculadas
    const totalSolicitudes = computed(() => solicitudes.value.length);
    
    const solicitudesPendientes = computed(() => 
      solicitudes.value.filter(s => s.estado === 'Pendiente').length
    );
    
    // Calcular solicitudes del mes actual
    const solicitudesMes = computed(() => {
      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      return solicitudes.value.filter(s => new Date(s.fecha) >= inicioMes).length;
    });
    
    // Calcular tiempo promedio de aprobación
    const tiempoPromedio = computed(() => {
      const solicitudesAprobadas = solicitudes.value.filter(s => s.estado === 'Aprobado' && s.fechaAprobacion);
      if (solicitudesAprobadas.length === 0) return 0;
      
      const tiempoTotal = solicitudesAprobadas.reduce((total, s) => {
        const fechaSolicitud = new Date(s.fecha);
        const fechaAprobacion = new Date(s.fechaAprobacion);
        const diffTime = Math.abs(fechaAprobacion - fechaSolicitud);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return total + diffDays;
      }, 0);
      
      return (tiempoTotal / solicitudesAprobadas.length).toFixed(1);
    });
    
    const presupuestoDisponible = computed(() => presupuesto.value.disponible);
    
    const porcentajeUtilizado = computed(() => {
      if (presupuesto.value.total === 0) return 0;
      return Math.round((presupuesto.value.utilizado / presupuesto.value.total) * 100);
    });
    
    // Solicitudes recientes (últimas 5)
    const solicitudesRecientes = computed(() => {
      return [...solicitudes.value]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);
    });
    
    // Formatear números con separadores de miles
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    
    // Formatear fechas
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };
    
    // Obtener clase CSS según el estado
    const getStatusClass = (estado) => {
      switch (estado) {
        case 'Aprobado': return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
        case 'Pendiente': return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
        case 'Rechazado': return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
        case 'Pagado': return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800';
        default: return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
      }
    };
    
    // Cargar datos desde la API
    const loadData = async () => {
      try {
        // Cargar solicitudes
        const resSolicitudes = await getAllSolicitudes();
        solicitudes.value = resSolicitudes.data;
        
        // Cargar datos de presupuesto (si existe el endpoint)
        /*try {
          const resPresupuesto = await getPresupuesto();
          presupuesto.value = resPresupuesto.data;
        } catch (error) {
          console.warn('No se pudo cargar el presupuesto:', error);
          // Calcular presupuesto basado en solicitudes aprobadas como alternativa
          const totalGastado = solicitudes.value
            .filter(s => s.estado === 'Aprobado' || s.estado === 'Pagado')
            .reduce((sum, s) => sum + (parseFloat(s.monto) || 0), 0);
          
          presupuesto.value = {
            total: 500000, // Valor predeterminado
            utilizado: totalGastado,
            disponible: 500000 - totalGastado
          };
        }*/
        
        // Actualizar fecha de última actualización
        lastUpdated.value = new Date().toLocaleString('es-ES');
        
        // Inicializar gráficos con datos reales
        initCharts();
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };
    
    // Inicializar gráficos con datos reales
    const initCharts = () => {
      // Calcular datos para el gráfico de gastos por categoría
      const categorias = {};
      solicitudes.value.forEach(s => {
        if (s.estado === 'Aprobado' || s.estado === 'Pagado') {
          categorias[s.tipo] = (categorias[s.tipo] || 0) + parseFloat(s.monto || 0);
        }
      });
      
      const tiposGasto = Object.keys(categorias);
      const valoresGasto = tiposGasto.map(tipo => categorias[tipo]);
      
      // Colores para el gráfico
      const colores = [
        '#10B981', // verde
        '#3B82F6', // azul
        '#F59E0B', // amarillo
        '#8B5CF6', // morado
        '#EC4899', // rosa
        '#6B7280', // gris
        '#EF4444'  // rojo
      ];
      
      // Gráfico de Gastos por Categoría (Doughnut)
      if (gastosPorCategoriaChart.value) {
        new Chart(gastosPorCategoriaChart.value, {
          type: 'doughnut',
          data: {
            labels: tiposGasto,
            datasets: [{
              data: valoresGasto,
              backgroundColor: colores.slice(0, tiposGasto.length),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              }
            }
          }
        });
      }
      
      // Calcular datos para el gráfico de tendencia de gastos
      const gastosPorMes = Array(12).fill(0);
      const gastosPorMesAñoAnterior = Array(12).fill(0);
      const añoActual = new Date().getFullYear();
      const añoAnterior = añoActual - 1;
      
      solicitudes.value.forEach(s => {
        if ((s.estado === 'Aprobado' || s.estado === 'Pagado') && s.fecha) {
          const fecha = new Date(s.fecha);
          const año = fecha.getFullYear();
          const mes = fecha.getMonth();
          const monto = parseFloat(s.monto || 0);
          
          if (año === añoActual) {
            gastosPorMes[mes] += monto;
          } else if (año === añoAnterior) {
            gastosPorMesAñoAnterior[mes] += monto;
          }
        }
      });
      
      // Gráfico de Tendencia de Gastos (Line)
      if (tendenciaGastosChart.value) {
        new Chart(tendenciaGastosChart.value, {
          type: 'line',
          data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                label: `Gastos ${añoActual}`,
                data: gastosPorMes,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: `Gastos ${añoAnterior}`,
                data: gastosPorMesAñoAnterior,
                borderColor: '#6B7280',
                backgroundColor: 'rgba(107, 114, 128, 0)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return `${label}: $${value.toLocaleString('es-MX')}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
      
      // Gráfico de Gastos por Departamento (Bar)
      if (gastosPorDepartamentoChart.value) {
        // Calcular datos para el gráfico de gastos por departamento
        const departamentos = {};
        solicitudes.value.forEach(s => {
          if ((s.estado === 'Aprobado' || s.estado === 'Pagado') && s.departamento) {
            departamentos[s.departamento] = (departamentos[s.departamento] || 0) + parseFloat(s.monto || 0);
          }
        });
        
        // Ordenar departamentos por monto (de mayor a menor)
        const departamentosOrdenados = Object.entries(departamentos)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8); // Mostrar solo los 8 departamentos con más gastos
        
        const nombresDepartamentos = departamentosOrdenados.map(d => d[0]);
        const valoresDepartamentos = departamentosOrdenados.map(d => d[1]);
        
        // Colores para el gráfico (gradiente de azul a verde)
        const coloresDepartamentos = nombresDepartamentos.map((_, index) => {
          // Crear un gradiente de colores desde azul hasta verde
          const ratio = index / Math.max(nombresDepartamentos.length - 1, 1);
          const r = Math.round(16 + ratio * (16 - 16));
          const g = Math.round(130 + ratio * (185 - 130));
          const b = Math.round(246 + ratio * (129 - 246));
          return `rgba(${r}, ${g}, ${b}, 0.8)`;
        });
        
        // Destruir gráfico anterior si existe
        if (window.gastosPorDepartamentoChartInstance) {
          window.gastosPorDepartamentoChartInstance.destroy();
        }
        
        // Crear nuevo gráfico
        window.gastosPorDepartamentoChartInstance = new Chart(gastosPorDepartamentoChart.value, {
          type: 'bar',
          data: {
            labels: nombresDepartamentos,
            datasets: [{
              label: 'Gastos por Departamento',
              data: valoresDepartamentos,
              backgroundColor: coloresDepartamentos,
              borderColor: coloresDepartamentos.map(color => color.replace('0.8', '1')),
              borderWidth: 1,
              borderRadius: 4,
              maxBarThickness: 50
            }]
          },
          options: {
            indexAxis: 'y', // Barras horizontales para mejor visualización
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw;
                    const total = valoresDepartamentos.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return [
                      `Monto: $${value.toLocaleString('es-MX')}`,
                      `Porcentaje: ${percentage}% del total`
                    ];
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  display: true,
                  drawBorder: false,
                },
                ticks: {
                  callback: function(value) {
                    if (value >= 1000000) {
                      return '$' + (value / 1000000).toFixed(1) + 'M';
                    } else if (value >= 1000) {
                      return '$' + (value / 1000).toFixed(1) + 'K';
                    }
                    return '$' + value.toLocaleString();
                  }
                }
              },
              y: {
                grid: {
                  display: false,
                  drawBorder: false,
                }
              }
            }
          }
        });
        
        // Si no hay datos, mostrar mensaje
        if (nombresDepartamentos.length === 0) {
          const ctx = gastosPorDepartamentoChart.value.getContext('2d');
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#6B7280';
          ctx.fillText('No hay datos disponibles', gastosPorDepartamentoChart.value.width / 2, gastosPorDepartamentoChart.value.height / 2);
        }
      }
      
      // Gráfico de Solicitudes por Estado (Pie)
      if (solicitudesPorEstadoChart.value) {
        // Contar solicitudes por estado
        const conteoEstados = {
          'Pendiente': 0,
          'Aprobado': 0,
          'Rechazado': 0,
          'Pagado': 0
        };
        
        // Asegurarnos de contar todas las solicitudes
        solicitudes.value.forEach(s => {
          // Si el estado existe en nuestro objeto, incrementar el contador
          if (s.estado && conteoEstados.hasOwnProperty(s.estado)) {
            conteoEstados[s.estado]++;
          } else if (s.estado) {
            // Si es un estado que no teníamos contemplado, agregarlo
            conteoEstados[s.estado] = 1;
          }
        });
        
        // Verificar si hay datos para mostrar
        const hayDatos = Object.values(conteoEstados).some(value => value > 0);
        
        if (!hayDatos) {
          // Si no hay datos, agregar un placeholder
          conteoEstados['Sin datos'] = 1;
        }
        
        const estados = Object.keys(conteoEstados);
        const valoresEstados = estados.map(estado => conteoEstados[estado]);
        
        // Colores para cada estado
        const coloresEstados = {
          'Pendiente': '#F59E0B', // Amarillo
          'Aprobado': '#10B981',  // Verde
          'Rechazado': '#EF4444', // Rojo
          'Pagado': '#3B82F6',    // Azul
          'Sin datos': '#9CA3AF'  // Gris para placeholder
        };
        
        // Asignar colores, con fallback a gris para estados no contemplados
        const colores = estados.map(estado => 
          coloresEstados[estado] || '#9CA3AF'
        );
        
        // Destruir gráfico anterior si existe
        if (window.solicitudesPorEstadoChartInstance) {
          window.solicitudesPorEstadoChartInstance.destroy();
        }
        
        // Crear nuevo gráfico
        window.solicitudesPorEstadoChartInstance = new Chart(solicitudesPorEstadoChart.value, {
          type: 'doughnut',
          data: {
            labels: estados,
            datasets: [{
              data: valoresEstados,
              backgroundColor: colores,
              borderWidth: 1
            }]
          },
          options: {
            cutout: 0, // Esto lo hace lucir como un gráfico de pie
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
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
        
        console.log('Conteo de Estados:', conteoEstados);
        console.log('Estados:', estados);
        console.log('Valores:', valoresEstados);
      }
    };
    
    // Inicialización
    onMounted(() => {
      loadData();
    });
    
    return {
      sidebarExpanded,
      gastosPorCategoriaChart,
      tendenciaGastosChart,
      gastosPorDepartamentoChart,  // Add new chart refs to return
      solicitudesPorEstadoChart,   // Add new chart refs to return
      lastUpdated,
      totalSolicitudes,
      solicitudesPendientes,
      solicitudesMes,
      tiempoPromedio,
      presupuestoDisponible,
      porcentajeUtilizado,
      solicitudesRecientes,
      formatNumber,
      formatDate,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
}

/* Animaciones para las tarjetas */
.bg-white {
  transition: all 0.3s ease;
}

/* Estilos para scrollbar personalizado */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>