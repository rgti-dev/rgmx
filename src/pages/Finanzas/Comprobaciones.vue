<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />
    
    <!-- Contenido principal -->
    <div class="flex-1 p-6 ml-20" :class="{ 'ml-64': sidebarExpanded }">
      <div class="max-w-7xl mx-auto">
        <!-- Encabezado -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Comprobación de Gastos</h1>
          <p class="text-gray-600">Gestiona y registra los comprobantes de gastos realizados</p>
        </div>
        
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-blue-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-blue-100 mr-3">
                <i class="fas fa-file-invoice text-blue-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Comprobantes</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.total }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-yellow-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-yellow-100 mr-3">
                <i class="fas fa-clock text-yellow-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Pendientes</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.pendientes }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-green-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-green-100 mr-3">
                <i class="fas fa-check text-green-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Aprobados</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.aprobados }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-3 border-l-4 border-red-500">
            <div class="flex items-center">
              <div class="p-2 rounded-full bg-red-100 mr-3">
                <i class="fas fa-times text-red-500 text-lg"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Rechazados</p>
                <p class="text-xl font-bold text-gray-800">{{ estadisticas.rechazados }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tabs de navegación -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button @click="activeTab = 'registrar'" 
                class="py-3 px-4 border-b-2 font-medium text-sm focus:outline-none"
                :class="activeTab === 'registrar' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                <i class="fas fa-plus-circle mr-2"></i>Registrar Comprobante
              </button>
              <button @click="activeTab = 'pendientes'" 
                class="py-3 px-4 border-b-2 font-medium text-sm focus:outline-none"
                :class="activeTab === 'pendientes' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                <i class="fas fa-clock mr-2"></i>Pendientes
              </button>
              <button @click="activeTab = 'historial'" 
                class="py-3 px-4 border-b-2 font-medium text-sm focus:outline-none"
                :class="activeTab === 'historial' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'">
                <i class="fas fa-history mr-2"></i>Historial
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Contenido de las tabs -->
        <div>
          <!-- Tab: Registrar Comprobante -->
          <div v-if="activeTab === 'registrar'" class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Registrar Nuevo Comprobante</h2>
            
            <form @submit.prevent="registrarComprobante">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Solicitud Relacionada</label>
                  <select v-model="nuevoComprobante.solicitudId" required
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="" disabled selected>Seleccione una solicitud</option>
                    <option v-for="solicitud in solicitudesAprobadas" :key="solicitud.id" :value="solicitud.id">
                      #{{ solicitud.id }} - {{ solicitud.concepto }} (${{ formatNumber(solicitud.monto) }})
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha del Gasto</label>
                  <input type="date" v-model="nuevoComprobante.fecha" required
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500">$</span>
                    </div>
                    <input type="number" v-model="nuevoComprobante.monto" step="0.01" min="0" required
                      class="pl-8 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Comprobante</label>
                  <select v-model="nuevoComprobante.tipo" required
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="" disabled selected>Seleccione un tipo</option>
                    <option value="Factura">Factura</option>
                    <option value="Recibo">Recibo</option>
                    <option value="Ticket">Ticket</option>
                    <option value="Nota">Nota de venta</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea v-model="nuevoComprobante.descripcion" rows="3" required
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Describa el gasto realizado..."></textarea>
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Comprobante Digital</label>
                <div class="flex items-center justify-center w-full">
                  <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div class="flex flex-col items-center justify-center pt-7" v-if="!previewImage">
                      <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                      <p class="text-sm text-gray-500">
                        <span class="font-medium text-green-600">Haga clic para cargar</span> o arrastre y suelte
                      </p>
                      <p class="text-xs text-gray-500 mt-1">PNG, JPG, PDF hasta 10MB</p>
                    </div>
                    <div class="flex flex-col items-center justify-center pt-7" v-else>
                      <img v-if="previewImage.type.includes('image')" :src="previewImage.url" class="h-20 object-contain" />
                      <div v-else class="flex items-center">
                        <i class="fas fa-file-pdf text-red-500 text-3xl mr-2"></i>
                        <span class="text-sm text-gray-700">{{ previewImage.name }}</span>
                      </div>
                      <button @click.prevent="removeFile" class="text-xs text-red-500 mt-2 hover:underline">
                        Eliminar archivo
                      </button>
                    </div>
                    <input type="file" class="hidden" @change="handleFileUpload" accept=".jpg,.jpeg,.png,.pdf" />
                  </label>
                </div>
              </div>
              
              <div class="flex justify-end">
                <button type="button" @click="resetForm" class="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Cancelar
                </button>
                <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  Registrar Comprobante
                </button>
              </div>
            </form>
          </div>
          
          <!-- Tab: Pendientes -->
          <div v-if="activeTab === 'pendientes'" class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Filtros -->
            <div class="p-4 border-b border-gray-200">
              <div class="flex flex-wrap gap-3">
                <div class="flex-1 min-w-[180px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input type="text" v-model="filtros.busqueda" placeholder="Buscar por descripción..."
                      class="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[150px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select v-model="filtros.tipo"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="">Todos los tipos</option>
                    <option value="Factura">Factura</option>
                    <option value="Recibo">Recibo</option>
                    <option value="Ticket">Ticket</option>
                    <option value="Nota">Nota de venta</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[120px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                  <input type="date" v-model="filtros.fechaDesde"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[120px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                  <input type="date" v-model="filtros.fechaHasta"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            </div>
            
            <!-- Tabla de comprobantes pendientes -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 table-fixed">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                      ID
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                      Solicitud
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Fecha
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Monto
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Tipo
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
                      Descripción
                    </th>
                    <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="comprobante in comprobantesPendientesFiltrados" :key="comprobante.id" class="hover:bg-gray-50">
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ comprobante.id }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 truncate">
                      #{{ comprobante.solicitudId }} - {{ getSolicitudConcepto(comprobante.solicitudId) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(comprobante.fecha) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      ${{ formatNumber(comprobante.monto) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getTipoClass(comprobante.tipo)">
                        {{ comprobante.tipo }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-500 truncate">
                      {{ comprobante.descripcion }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-2">
                        <button @click="verComprobante(comprobante)" class="text-blue-600 hover:text-blue-900 p-1">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button @click="editarComprobante(comprobante)" class="text-yellow-600 hover:text-yellow-900 p-1">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="eliminarComprobante(comprobante.id)" class="text-red-600 hover:text-red-900 p-1">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="comprobantesPendientesFiltrados.length === 0">
                    <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">
                      No hay comprobantes pendientes
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Paginación -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando <span class="font-medium">{{ comprobantesPendientesFiltrados.length }}</span> de <span class="font-medium">{{ estadisticas.pendientes }}</span> comprobantes
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{ 'opacity-50 cursor-not-allowed': paginaActual === 1 }">
                      <span class="sr-only">Anterior</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button v-for="pagina in totalPaginas" :key="pagina" @click="cambiarPagina(pagina)"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                      :class="{ 'bg-green-50 text-green-600 border-green-500': paginaActual === pagina, 'text-gray-700': paginaActual !== pagina }">
                      {{ pagina }}
                    </button>
                    
                    <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{ 'opacity-50 cursor-not-allowed': paginaActual === totalPaginas }">
                      <span class="sr-only">Siguiente</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Tab: Historial -->
          <div v-if="activeTab === 'historial'" class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Filtros para historial -->
            <div class="p-4 border-b border-gray-200">
              <div class="flex flex-wrap gap-3">
                <div class="flex-1 min-w-[180px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fas fa-search text-gray-400"></i>
                    </div>
                    <input type="text" v-model="filtrosHistorial.busqueda" placeholder="Buscar por descripción..."
                      class="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[150px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select v-model="filtrosHistorial.estado"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <option value="">Todos los estados</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[120px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                  <input type="date" v-model="filtrosHistorial.fechaDesde"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                
                <div class="w-full sm:w-auto flex-1 min-w-[120px]">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                  <input type="date" v-model="filtrosHistorial.fechaHasta"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            </div>
            
            <!-- Tabla de historial -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 table-fixed">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]">
                      ID
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                      Solicitud
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Fecha
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Monto
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                      Estado
                    </th>
                    <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">
                      Descripción
                    </th>
                    <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="comprobante in comprobantesHistorialFiltrados" :key="comprobante.id" class="hover:bg-gray-50">
                    <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ comprobante.id }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 truncate">
                      #{{ comprobante.solicitudId }} - {{ getSolicitudConcepto(comprobante.solicitudId) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(comprobante.fecha) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      ${{ formatNumber(comprobante.monto) }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getEstadoClass(comprobante.estado)">
                        {{ comprobante.estado }}
                      </span>
                    </td>
                    <td class="px-3 py-2 text-sm text-gray-500 truncate">
                      {{ comprobante.descripcion }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end space-x-2">
                        <button @click="verComprobante(comprobante)" class="text-blue-600 hover:text-blue-900 p-1">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button @click="descargarComprobante(comprobante)" class="text-green-600 hover:text-green-900 p-1">
                          <i class="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="comprobantesHistorialFiltrados.length === 0">
                    <td colspan="7" class="px-3 py-4 text-center text-sm text-gray-500">
                      No hay comprobantes en el historial
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Paginación para historial -->
            <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Mostrando <span class="font-medium">{{ comprobantesHistorialFiltrados.length }}</span> comprobantes
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button @click="cambiarPaginaHistorial(paginaActualHistorial - 1)" :disabled="paginaActualHistorial === 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{ 'opacity-50 cursor-not-allowed': paginaActualHistorial === 1 }">
                      <span class="sr-only">Anterior</span>
                      <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <button v-for="pagina in totalPaginasHistorial" :key="pagina" @click="cambiarPaginaHistorial(pagina)"
                      class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                      :class="{ 'bg-green-50 text-green-600 border-green-500': paginaActualHistorial === pagina, 'text-gray-700': paginaActualHistorial !== pagina }">
                      {{ pagina }}
                    </button>
                    
                    <button @click="cambiarPaginaHistorial(paginaActualHistorial + 1)" :disabled="paginaActualHistorial === totalPaginasHistorial"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      :class="{ 'opacity-50 cursor-not-allowed': paginaActualHistorial === totalPaginasHistorial }">
                      <span class="sr-only">Siguiente</span>
                      <i class="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal para ver detalles del comprobante -->
    <div v-if="mostrarDetalles" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div class="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            Detalles del Comprobante #{{ comprobanteDetalle.id }}
          </h3>
          <button @click="cerrarDetalles" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm font-medium text-gray-500">Solicitud Relacionada</p>
              <p class="mt-1 text-sm text-gray-900">
                #{{ comprobanteDetalle.solicitudId }} - {{ getSolicitudConcepto(comprobanteDetalle.solicitudId) }}
              </p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Fecha del Gasto</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(comprobanteDetalle.fecha) }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Monto</p>
              <p class="mt-1 text-sm text-gray-900">${{ formatNumber(comprobanteDetalle.monto) }}</p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Tipo de Comprobante</p>
              <p class="mt-1 text-sm text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTipoClass(comprobanteDetalle.tipo)">
                  {{ comprobanteDetalle.tipo }}
                </span>
              </p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Estado</p>
              <p class="mt-1 text-sm text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getEstadoClass(comprobanteDetalle.estado || 'Pendiente')">
                  {{ comprobanteDetalle.estado || 'Pendiente' }}
                </span>
              </p>
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-500">Fecha de Registro</p>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(comprobanteDetalle.fechaRegistro) }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <p class="text-sm font-medium text-gray-500">Descripción</p>
            <p class="mt-1 text-sm text-gray-900">{{ comprobanteDetalle.descripcion }}</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-500 mb-2">Comprobante Digital</p>
            <div class="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
              <div v-if="comprobanteDetalle.archivo">
                <img v-if="comprobanteDetalle.archivo.type?.includes('image')" 
                  :src="comprobanteDetalle.archivo.url" 
                  class="max-h-64 object-contain mb-2" />
                <div v-else-if="comprobanteDetalle.archivo.type?.includes('pdf')" class="flex flex-col items-center">
                  <i class="fas fa-file-pdf text-red-500 text-5xl mb-2"></i>
                  <span class="text-sm text-gray-700">{{ comprobanteDetalle.archivo.name }}</span>
                </div>
                <button @click="descargarComprobante(comprobanteDetalle)" 
                  class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <i class="fas fa-download mr-2"></i> Descargar
                </button>
              </div>
              <div v-else class="text-center py-4">
                <i class="fas fa-file-excel text-gray-400 text-4xl mb-2"></i>
                <p class="text-sm text-gray-500">No hay archivo adjunto</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button @click="cerrarDetalles" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Cerrar
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal para editar comprobante -->
    <div v-if="mostrarEdicion" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div class="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 class="text-lg font-medium text-gray-900">
            Editar Comprobante #{{ comprobanteEdicion.id }}
          </h3>
          <button @click="cerrarEdicion" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form @submit.prevent="guardarEdicion">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Solicitud Relacionada</label>
                <select v-model="comprobanteEdicion.solicitudId" required
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option v-for="solicitud in solicitudesAprobadas" :key="solicitud.id" :value="solicitud.id">
                    #{{ solicitud.id }} - {{ solicitud.concepto }} (${{ formatNumber(solicitud.monto) }})
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Fecha del Gasto</label>
                <input type="date" v-model="comprobanteEdicion.fecha" required
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500">$</span>
                  </div>
                  <input type="number" v-model="comprobanteEdicion.monto" step="0.01" min="0" required
                    class="pl-8 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Comprobante</label>
                <select v-model="comprobanteEdicion.tipo" required
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                  <option value="Factura">Factura</option>
                  <option value="Recibo">Recibo</option>
                  <option value="Ticket">Ticket</option>
                  <option value="Nota">Nota de venta</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea v-model="comprobanteEdicion.descripcion" rows="3" required
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Describa el gasto realizado..."></textarea>
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Comprobante Digital</label>
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div class="flex flex-col items-center justify-center pt-7" v-if="!comprobanteEdicion.archivo">
                    <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                    <p class="text-sm text-gray-500">
                      <span class="font-medium text-green-600">Haga clic para cargar</span> o arrastre y suelte
                    </p>
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG, PDF hasta 10MB</p>
                  </div>
                  <div class="flex flex-col items-center justify-center pt-7" v-else>
                    <img v-if="comprobanteEdicion.archivo.type?.includes('image')" :src="comprobanteEdicion.archivo.url" class="h-20 object-contain" />
                    <div v-else class="flex items-center">
                      <i class="fas fa-file-pdf text-red-500 text-3xl mr-2"></i>
                      <span class="text-sm text-gray-700">{{ comprobanteEdicion.archivo.name }}</span>
                    </div>
                    <button @click.prevent="removeFileEdicion" class="text-xs text-red-500 mt-2 hover:underline">
                      Eliminar archivo
                    </button>
                  </div>
                  <input type="file" class="hidden" @change="handleFileUploadEdicion" accept=".jpg,.jpeg,.png,.pdf" />
                </label>
              </div>
            </div>
            
            <div class="flex justify-end">
              <button type="button" @click="cerrarEdicion" class="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Cancelar
              </button>
              <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import Swal from 'sweetalert2';
import { getAllSolicitudes, getSolicitudById, createSolicitud, updateSolicitud, deleteSolicitud, getSolicitudesAprobadoNivel1 } from '@/api/solicitud.js';

export default {
  name: 'Comprobaciones',
  components: {
    Sidebar
  },
  setup() {
    // Estado de la barra lateral
    const sidebarExpanded = ref(true);
    
    // Tab activa
    const activeTab = ref('registrar');
    
    // Datos de comprobantes
    const comprobantes = ref([]);
    
    // Datos de solicitudes aprobadas
    const solicitudesAprobadas = ref([]);
    
    // Estado de carga
    const loading = ref(false);
    const loadingComprobantes = ref(false);
    const loadingSolicitudes = ref(false);
    
    // Nuevo comprobante
    const nuevoComprobante = ref({
      solicitudId: '',
      fecha: '',
      monto: '',
      tipo: '',
      descripcion: '',
      archivo: null
    });
    
    // Filtros para pendientes
    const filtros = ref({
      busqueda: '',
      tipo: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    
    // Filtros para historial
    const filtrosHistorial = ref({
      busqueda: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    
    // Paginación para pendientes
    const paginaActual = ref(1);
    const comprobantesPorPagina = ref(5);
    
    // Paginación para historial
    const paginaActualHistorial = ref(1);
    const comprobantesPorPaginaHistorial = ref(5);
    
    // Estado para modales
    const mostrarDetalles = ref(false);
    const comprobanteDetalle = ref({});
    const mostrarEdicion = ref(false);
    const comprobanteEdicion = ref({});
    
    // Preview de imagen
    const previewImage = ref(null);
    
    // Cargar datos de solicitudes aprobadas
    const cargarSolicitudesAprobadas = async () => {
      try {
        loadingSolicitudes.value = true;
        const response = await getSolicitudesAprobadoNivel1();
        console.log('Respuesta de solicitudes aprobadas:', response);
        solicitudesAprobadas.value = response.data || [];
        console.log('Solicitudes aprobadas cargadas:', solicitudesAprobadas.value);
      } catch (error) {
        console.error('Error al cargar solicitudes aprobadas:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las solicitudes aprobadas'
        });
      } finally {
        loadingSolicitudes.value = false;
      }
    };
    
    // Reemplaza la función cargarComprobantes por una versión dummy
    const cargarComprobantes = async () => {
      try {
        loadingComprobantes.value = true;
        // Por el momento, asignamos un arreglo vacío o datos de prueba
        comprobantes.value = []; // o datos de ejemplo
        console.log('Comprobantes dummy cargados');
      } catch (error) {
        console.error('Error al cargar comprobantes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los comprobantes'
        });
      } finally {
        loadingComprobantes.value = false;
      }
    };
    
    // Estadísticas
    const estadisticas = computed(() => {
      return {
        total: solicitudesAprobadas.value.length,
        pendientes: solicitudesAprobadas.value.filter(c => c.estado === null || c.estado === 'Pendiente').length,
        aprobados: solicitudesAprobadas.value.filter(c => c.estado === 'Aprobado').length,
        rechazados: solicitudesAprobadas.value.filter(c => c.estado === 'Rechazado').length
      };
    });
    
    // Comprobantes pendientes filtrados
    const comprobantesPendientesFiltrados = computed(() => {
      const pendientes = comprobantes.value.filter(c => c.estado === null || c.estado === 'Pendiente').filter(c => {
        // Filtro de búsqueda
        const matchBusqueda = filtros.value.busqueda === '' || 
          c.descripcion.toLowerCase().includes(filtros.value.busqueda.toLowerCase());
        
        // Filtro de tipo
        const matchTipo = filtros.value.tipo === '' || c.tipo === filtros.value.tipo;
        
        // Filtro de fecha desde
        const matchFechaDesde = filtros.value.fechaDesde === '' || 
          new Date(c.fecha) >= new Date(filtros.value.fechaDesde);
        
        // Filtro de fecha hasta
        const matchFechaHasta = filtros.value.fechaHasta === '' || 
          new Date(c.fecha) <= new Date(filtros.value.fechaHasta);
        
        return matchBusqueda && matchTipo && matchFechaDesde && matchFechaHasta;
      });
      
      // Aplicar paginación
      const inicio = (paginaActual.value - 1) * comprobantesPorPagina.value;
      return pendientes.slice(inicio, inicio + comprobantesPorPagina.value);
    });
    
    // Total de páginas para pendientes
    const totalPaginas = computed(() => {
      const pendientesFiltrados = comprobantes.value.filter(c => c.estado === null || c.estado === 'Pendiente').filter(c => {
        const matchBusqueda = filtros.value.busqueda === '' || 
          c.descripcion.toLowerCase().includes(filtros.value.busqueda.toLowerCase());
        const matchTipo = filtros.value.tipo === '' || c.tipo === filtros.value.tipo;
        const matchFechaDesde = filtros.value.fechaDesde === '' || 
          new Date(c.fecha) >= new Date(filtros.value.fechaDesde);
        const matchFechaHasta = filtros.value.fechaHasta === '' || 
          new Date(c.fecha) <= new Date(filtros.value.fechaHasta);
        
        return matchBusqueda && matchTipo && matchFechaDesde && matchFechaHasta;
      });
      
      return Math.ceil(pendientesFiltrados.length / comprobantesPorPagina.value);
    });
    
    // Comprobantes historial filtrados
    const comprobantesHistorialFiltrados = computed(() => {
      const historial = comprobantes.value.filter(c => c.estado !== null && c.estado !== 'Pendiente').filter(c => {
        // Filtro de búsqueda
        const matchBusqueda = filtrosHistorial.value.busqueda === '' || 
          c.descripcion.toLowerCase().includes(filtrosHistorial.value.busqueda.toLowerCase());
        
        // Filtro de estado
        const matchEstado = filtrosHistorial.value.estado === '' || c.estado === filtrosHistorial.value.estado;
        
        // Filtro de fecha desde
        const matchFechaDesde = filtrosHistorial.value.fechaDesde === '' || 
          new Date(c.fecha) >= new Date(filtrosHistorial.value.fechaDesde);
        
        // Filtro de fecha hasta
        const matchFechaHasta = filtrosHistorial.value.fechaHasta === '' || 
          new Date(c.fecha) <= new Date(filtrosHistorial.value.fechaHasta);
        
        return matchBusqueda && matchEstado && matchFechaDesde && matchFechaHasta;
      });
      
      // Aplicar paginación
      const inicio = (paginaActualHistorial.value - 1) * comprobantesPorPaginaHistorial.value;
      return historial.slice(inicio, inicio + comprobantesPorPaginaHistorial.value);
    });
    
    // Total de páginas para historial
    const totalPaginasHistorial = computed(() => {
      const historialFiltrado = comprobantes.value.filter(c => c.estado !== null && c.estado !== 'Pendiente').filter(c => {
        const matchBusqueda = filtrosHistorial.value.busqueda === '' || 
          c.descripcion.toLowerCase().includes(filtrosHistorial.value.busqueda.toLowerCase());
        const matchEstado = filtrosHistorial.value.estado === '' || c.estado === filtrosHistorial.value.estado;
        const matchFechaDesde = filtrosHistorial.value.fechaDesde === '' || 
          new Date(c.fecha) >= new Date(filtrosHistorial.value.fechaDesde);
        const matchFechaHasta = filtrosHistorial.value.fechaHasta === '' || 
          new Date(c.fecha) <= new Date(filtrosHistorial.value.fechaHasta);
        
        return matchBusqueda && matchEstado && matchFechaDesde && matchFechaHasta;
      });
      
      return Math.ceil(historialFiltrado.length / comprobantesPorPaginaHistorial.value);
    });
    
    // Métodos
    const getSolicitudConcepto = (id) => {
      const solicitud = solicitudesAprobadas.value.find(s => s.id === id);
      return solicitud ? solicitud.concepto : 'Desconocido';
    };
    
    const getTipoClass = (tipo) => {
      const clases = {
        'Factura': 'bg-blue-100 text-blue-800',
        'Recibo': 'bg-green-100 text-green-800',
        'Ticket': 'bg-yellow-100 text-yellow-800',
        'Nota': 'bg-purple-100 text-purple-800',
        'Otro': 'bg-gray-100 text-gray-800'
      };
      
      return clases[tipo] || 'bg-gray-100 text-gray-800';
    };
    
    const getEstadoClass = (estado) => {
      const clases = {
        'Pendiente': 'bg-yellow-100 text-yellow-800',
        'Aprobado': 'bg-green-100 text-green-800',
        'Rechazado': 'bg-red-100 text-red-800'
      };
      
      return clases[estado] || 'bg-gray-100 text-gray-800';
    };
    
    const formatNumber = (num) => {
      return Number(num).toLocaleString('es-MX');
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('es-MX', options);
    };
    
    const cambiarPagina = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginas.value) {
        paginaActual.value = pagina;
      }
    };
    
    const cambiarPaginaHistorial = (pagina) => {
      if (pagina >= 1 && pagina <= totalPaginasHistorial.value) {
        paginaActualHistorial.value = pagina;
      }
    };
    
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'El archivo no debe exceder los 10MB'
        });
        return;
      }
      
      // Crear URL para preview
      const url = URL.createObjectURL(file);
      previewImage.value = {
        file,
        name: file.name,
        type: file.type,
        url
      };
      
      // Asignar al nuevo comprobante
      nuevoComprobante.value.archivo = previewImage.value;
    };
    
    const handleFileUploadEdicion = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validar tamaño (10MB máximo)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'El archivo no debe exceder los 10MB'
        });
        return;
      }
      
      // Crear URL para preview
      const url = URL.createObjectURL(file);
      comprobanteEdicion.value.archivo = {
        file,
        name: file.name,
        type: file.type,
        url
      };
    };
    
    const removeFile = () => {
      previewImage.value = null;
      nuevoComprobante.value.archivo = null;
    };
    
    const removeFileEdicion = () => {
      comprobanteEdicion.value.archivo = null;
    };
    
    const resetForm = () => {
      nuevoComprobante.value = {
        solicitudId: '',
        fecha: new Date().toISOString().split('T')[0],
        monto: '',
        tipo: '',
        descripcion: '',
        archivo: null
      };
      previewImage.value = null;
    };
    
    const registrarComprobante = async () => {
      // Validar que haya seleccionado una solicitud
      if (!nuevoComprobante.value.solicitudId) {
        Swal.fire({
          icon: 'warning',
          title: 'Seleccione una solicitud',
          text: 'Debe seleccionar una solicitud relacionada'
        });
        return;
      }
      
      try {
        loading.value = true;
        
        // Preparar datos para enviar
        const formData = new FormData();
        formData.append('solicitudId', nuevoComprobante.value.solicitudId);
        formData.append('fecha', nuevoComprobante.value.fecha);
        formData.append('monto', nuevoComprobante.value.monto);
        formData.append('tipo', nuevoComprobante.value.tipo);
        formData.append('descripcion', nuevoComprobante.value.descripcion);
        
        if (nuevoComprobante.value.archivo && nuevoComprobante.value.archivo.file) {
          formData.append('archivo', nuevoComprobante.value.archivo.file);
        }
        
        // Enviar a la API
        const response = await solicitudAPI.registrarComprobante(formData);
        
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Comprobante registrado',
          text: `El comprobante ha sido registrado correctamente`
        });
        
        // Recargar comprobantes
        await cargarComprobantes();
        
        // Resetear formulario
        resetForm();
      } catch (error) {
        console.error('Error al registrar comprobante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo registrar el comprobante'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const verComprobante = (comprobante) => {
      comprobanteDetalle.value = { ...comprobante };
      mostrarDetalles.value = true;
    };
    
    const cerrarDetalles = () => {
      mostrarDetalles.value = false;
      comprobanteDetalle.value = {};
    };
    
    const editarComprobante = (comprobante) => {
      comprobanteEdicion.value = { ...comprobante };
      mostrarEdicion.value = true;
    };
    
    const cerrarEdicion = () => {
      mostrarEdicion.value = false;
      comprobanteEdicion.value = {};
    };
    
    const guardarEdicion = async () => {
      try {
        loading.value = true;
        
        // Preparar datos para enviar
        const formData = new FormData();
        formData.append('id', comprobanteEdicion.value.id);
        formData.append('solicitudId', comprobanteEdicion.value.solicitudId);
        formData.append('fecha', comprobanteEdicion.value.fecha);
        formData.append('monto', comprobanteEdicion.value.monto);
        formData.append('tipo', comprobanteEdicion.value.tipo);
        formData.append('descripcion', comprobanteEdicion.value.descripcion);
        
        if (comprobanteEdicion.value.archivo && comprobanteEdicion.value.archivo.file) {
          formData.append('archivo', comprobanteEdicion.value.archivo.file);
        }
        
        // Enviar a la API
        const response = await solicitudAPI.actualizarComprobante(formData);
        
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Comprobante actualizado',
          text: `El comprobante #${comprobanteEdicion.value.id} ha sido actualizado correctamente`
        });
        
        // Recargar comprobantes
        await cargarComprobantes();
        
        // Cerrar modal
        cerrarEdicion();
      } catch (error) {
        console.error('Error al actualizar comprobante:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo actualizar el comprobante'
        });
      } finally {
        loading.value = false;
      }
    };
    
    const eliminarComprobante = async (id) => {
      // Confirmar eliminación
      Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea eliminar el comprobante #${id}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            loading.value = true;
            
            // Enviar a la API
            await solicitudAPI.eliminarComprobante(id);
            
            // Mostrar mensaje de éxito
            Swal.fire({
              icon: 'success',
              title: 'Comprobante eliminado',
              text: `El comprobante #${id} ha sido eliminado correctamente`
            });
            
            // Recargar comprobantes
            await cargarComprobantes();
          } catch (error) {
            console.error('Error al eliminar comprobante:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response?.data?.message || 'No se pudo eliminar el comprobante'
            });
          } finally {
            loading.value = false;
          }
        }
      });
    };
    
    const descargarComprobante = async (comprobante) => {
      if (!comprobante.archivo) {
        Swal.fire({
          icon: 'warning',
          title: 'Sin archivo',
          text: 'Este comprobante no tiene un archivo adjunto'
        });
        return;
      }
      
      try {
        loading.value = true;
        
        // Obtener archivo de la API
        const response = await solicitudAPI.descargarArchivoComprobante(comprobante.id);
        
        // Crear blob y descargar
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = comprobante.archivo.name || `comprobante_${comprobante.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        Swal.fire({
          icon: 'success',
          title: 'Descarga iniciada',
          text: `Descargando ${a.download}`,
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al descargar archivo:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo descargar el archivo'
        });
      } finally {
        loading.value = false;
      }
    };
    
    // Inicializar fecha actual para el formulario y cargar datos
    onMounted(async () => {
      const hoy = new Date().toISOString().split('T')[0];
      nuevoComprobante.value.fecha = hoy;
      
      // Cargar datos iniciales
      await Promise.all([
        cargarSolicitudesAprobadas(),
        cargarComprobantes()
      ]);
    });
    
    return {
      sidebarExpanded,
      activeTab,
      comprobantes,
      solicitudesAprobadas,
      nuevoComprobante,
      filtros,
      filtrosHistorial,
      paginaActual,
      paginaActualHistorial,
      mostrarDetalles,
      comprobanteDetalle,
      mostrarEdicion,
      comprobanteEdicion,
      previewImage,
      estadisticas,
      comprobantesPendientesFiltrados,
      totalPaginas,
      comprobantesHistorialFiltrados,
      totalPaginasHistorial,
      loading,
      loadingComprobantes,
      loadingSolicitudes,
      getSolicitudConcepto,
      getTipoClass,
      getEstadoClass,
      formatNumber,
      formatDate,
      cambiarPagina,
      cambiarPaginaHistorial,
      handleFileUpload,
      handleFileUploadEdicion,
      removeFile,
      removeFileEdicion,
      resetForm,
      registrarComprobante,
      verComprobante,
      cerrarDetalles,
      editarComprobante,
      cerrarEdicion,
      guardarEdicion,
      eliminarComprobante,
      descargarComprobante
    };
  }
};
</script>

<style scoped>
.tab-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition-property: color, background-color;
  transition-duration: 150ms;
}

.tab-button.active {
  background-color: #16a34a;
  color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.tab-button:not(.active) {
  color: #374151;
  background-color: white;
}

.tab-button:not(.active):hover {
  background-color: #f9fafb;
}

.card-stats {
  transition-property: all;
  transition-duration: 200ms;
}

.card-stats:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.form-input:focus, 
.form-select:focus, 
.form-textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.25);
}

.pagination-button {
  transition-property: color, background-color;
  transition-duration: 150ms;
}

.pagination-button.active {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #16a34a;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-factura {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-recibo {
  background-color: #dcfce7;
  color: #166534;
}

.badge-ticket {
  background-color: #fef9c3;
  color: #854d0e;
}

.badge-nota {
  background-color: #f3e8ff;
  color: #6b21a8;
}

.badge-pendiente {
  background-color: #fef9c3;
  color: #854d0e;
}

.badge-aprobado {
  background-color: #dcfce7;
  color: #166534;
}

.badge-rechazado {
  background-color: #fee2e2;
  color: #b91c1c;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: 150ms;
}

.file-upload-area:hover {
  background-color: #f9fafb;
}

.action-button {
  transition-property: color;
  transition-duration: 150ms;
}

.action-button-view {
  color: #2563eb;
}

.action-button-view:hover {
  color: #1e3a8a;
}

.action-button-edit {
  color: #ca8a04;
}

.action-button-edit:hover {
  color: #854d0e;
}

.action-button-delete {
  color: #dc2626;
}

.action-button-delete:hover {
  color: #7f1d1d;
}

.action-button-download {
  color: #16a34a;
}

.action-button-download:hover {
  color: #166534;
}

.table-row:hover {
  background-color: #f9fafb;
  transition-property: background-color;
  transition-duration: 150ms;
}

.truncate-description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>