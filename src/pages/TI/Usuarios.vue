<template>
  <div class="usuarios-container flex w-full bg-gray-50">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido del Dashboard -->
    <div class="content flex-1 w-full relative transition-all duration-300"
    :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">

      <div class="p-4 md:p-8">
        <!-- Header mejorado -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
            <p class="text-gray-600 mt-1">Administra los usuarios y sus permisos en el sistema</p>
          </div>
          
          <div class="mt-4 md:mt-0 flex flex-col sm:flex-row items-center gap-3">
            <!-- Toggle para cambiar entre vista de tarjetas y tabla -->
            <div class="flex bg-gray-100 p-1 rounded-lg self-end mb-2 sm:mb-0 sm:mr-2">
              <button 
                @click="viewMode = 'cards'" 
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                :class="viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              >
                <svg class="w-5 h-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Tarjetas
              </button>
              <button 
                @click="viewMode = 'table'" 
                class="px-3 py-1 rounded-md text-sm font-medium transition-colors"
                :class="viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
              >
                <svg class="w-5 h-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Tabla
              </button>
            </div>
            
            <div class="relative w-full sm:w-auto">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Buscar usuario..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <button
              @click="openNewUsuarioModal"
              class="w-full sm:w-auto flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow"
            >
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar Usuario
            </button>
          </div>
        </div>

        <!-- Contador de resultados -->
        <div class="mb-4 text-sm text-gray-600">
          Mostrando {{ filteredUsuarios.length }} usuarios
          <span v-if="searchQuery"> para la búsqueda "{{ searchQuery }}"</span>
        </div>
        
        <!-- Tarjetas de usuarios en lugar de tabla -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="usuario in filteredUsuarios" 
               :key="usuario.id" 
               class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="avatar-circle" :style="{ backgroundColor: getAvatarColor(usuario.nombre) }">
                    {{ getInitials(usuario.nombre) }}
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-800">{{ usuario.nombre }}</h3>
                    <p class="text-sm text-gray-600">{{ usuario.email }}</p>
                  </div>
                </div>
                <span 
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="usuario.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
                >
                  {{ usuario.rol === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </div>
              
              <div class="border-t border-gray-100 pt-4">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm text-gray-700">ID: {{ usuario.id }}</span>
                </div>
                
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <span class="text-sm text-gray-700">
                    {{ usuario.equipos ? usuario.equipos.length : 0 }} equipos asignados
                  </span>
                </div>
              </div>
              
              <div class="mt-6 flex justify-between">
                <button
                  @click="openEquiposModal(usuario)"
                  class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver equipos
                </button>
                
                <div class="flex space-x-3">
                  <button
                    @click="openEditUsuarioModal(usuario)"
                    class="text-amber-600 hover:text-amber-800 transition-colors"
                    title="Editar usuario"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(usuario)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar usuario"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Mensaje cuando no hay resultados -->
          <div v-if="filteredUsuarios.length === 0" class="col-span-full p-10 text-center text-gray-500 bg-white rounded-xl shadow-md">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium">No se encontraron usuarios que coincidan con la búsqueda.</p>
            <p class="mt-2">Intenta con otros términos o <button @click="searchQuery = ''" class="text-blue-600 hover:underline">ver todos los usuarios</button>.</p>
          </div>
        </div>

        <!-- Vista de tabla para usuarios -->
        <div v-else-if="viewMode === 'table'" class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipos
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="usuario in filteredUsuarios" :key="usuario.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="avatar-circle-sm" :style="{ backgroundColor: getAvatarColor(usuario.nombre) }">
                        {{ getInitials(usuario.nombre) }}
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ usuario.nombre }}</div>
                        <div class="text-sm text-gray-500">ID: {{ usuario.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ usuario.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="usuario.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'"
                    >
                      {{ usuario.rol === 'admin' ? 'Administrador' : 'Usuario' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      @click="openEquiposModal(usuario)"
                      class="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span class="mr-2">{{ usuario.equipos ? usuario.equipos.length : 0 }}</span>
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-3">
                      <button
                        @click="openEditUsuarioModal(usuario)"
                        class="text-amber-600 hover:text-amber-800 transition-colors"
                        title="Editar usuario"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(usuario)"
                        class="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar usuario"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                
                <!-- Mensaje cuando no hay resultados -->
                <tr v-if="filteredUsuarios.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-gray-500">
                    <svg class="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-lg font-medium">No se encontraron usuarios que coincidan con la búsqueda.</p>
                    <p class="mt-2">Intenta con otros términos o <button @click="searchQuery = ''" class="text-blue-600 hover:underline">ver todos los usuarios</button>.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <EquiposModal 
        :show="showEquiposModal" 
        :usuario="selectedUsuario" 
        @close="closeEquiposModal" 
      />
        
      </div>
    </div>

    <!-- Modal mejorado para Agregar/Editar Usuario -->
    <transition name="modal-fade">
      <div
        v-if="showModal"
        class="modal-fadeo"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all" 
             :class="{ 'scale-100 opacity-100': showModal, 'scale-95 opacity-0': !showModal }">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ modalMode === 'new' ? 'Agregar Usuario' : 'Editar Usuario' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitUsuario" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                v-model="newUsuario.nombre"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre completo"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                v-model="newUsuario.email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
            
            <!-- Mostrar el campo contraseña solo al crear -->
            <div v-if="modalMode === 'new'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="newUsuario.password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contraseña segura"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">Mínimo 8 caracteres, incluya números y símbolos</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <div class="relative">
                <select
                  v-model="newUsuario.rol"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="user">Usuario</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input
                type="text"
                v-model="newUsuario.departamento"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Departamento asignado"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
              <input
                type="text"
                v-model="newUsuario.puesto"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Puesto asignado"
              />
              {{ console.log(newUsuario) }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Célula</label>
              <input
                type="text"
                v-model="newUsuario.celula"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Célula (opcional)"
              />
            </div>

            <!-- Nuevo campo: Nivel de Aprobación -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nivel de Aprobación</label>
              <select
                v-model="newUsuario.niv_apr_gas"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option :value="0">Sin aprobación</option>
                <option :value="1">Nivel 1</option>
                <option :value="2">Nivel 2</option>
                <option :value="3">Nivel 3</option>
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {{ modalMode === 'new' ? 'Crear Usuario' : 'Actualizar Usuario' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal de confirmación para eliminar -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-fadeo">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">¿Eliminar usuario?</h3>
            <p class="mt-2 text-sm text-gray-500">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </p>
          </div>
          <div class="mt-6 flex justify-center space-x-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              @click="executeDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import EquiposModal from "@/components/TI/EquiposModal.vue";

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "@/api/usuarios.js";
import { ref, computed } from 'vue';

export default {
  name: "Usuarios",
  components: {
    EquiposModal,
    Sidebar
  },
  setup() {
    const usuarios = ref([]);
    const sidebarExpanded = ref(false);
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const modalMode = ref("new");
    const newUsuario = ref({
      nombre: "",
      email: "",
      password: "",
      rol: "user",
      departamento: "",
      puesto: "",
      celula: "",
      niv_apr_gas: 0  // Nuevo campo, valor por defecto: Sin aprobación (0)
    });
    const selectedUsuarioId = ref(null);
    const searchQuery = ref('');
    const showPassword = ref(false);
    const userToDelete = ref(null);
    const showEquiposModal = ref(false);
    const selectedUsuario = ref({});
    const openAccordions = ref([]);
    const viewMode = ref('cards'); // Estado para el modo de vista

    // Filtrar usuarios según la búsqueda
    const filteredUsuarios = computed(() => {
      if (!searchQuery.value) return usuarios.value;
      
      const query = searchQuery.value.toLowerCase();
      return usuarios.value.filter(usuario =>
        usuario.nombre.toLowerCase().includes(query) ||
        usuario.email.toLowerCase().includes(query) ||
        usuario.rol.toLowerCase().includes(query) ||
        usuario.id.toString().includes(query)
      );
    });

    

    const fetchUsuarios = async () => {
      try {
        usuarios.value = await getUsuarios();
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    const openNewUsuarioModal = () => {
      modalMode.value = "new";
      newUsuario.value = {
        nombre: "",
        email: "",
        password: "",
        rol: "user",
        departamento: "",
        puesto: "",
        celula: "",
        niv_apr_gas: 0
      };
      selectedUsuarioId.value = null;
      showModal.value = true;
    };

    const openEditUsuarioModal = (usuario) => {
      modalMode.value = "edit";
      newUsuario.value = {
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        departamento: usuario.departamento || "",
        puesto: usuario.puesto || "",
        celula: usuario.celula || "",
        niv_apr_gas: usuario.niv_apr_gas || 0
      };
      delete newUsuario.value.password;
      selectedUsuarioId.value = usuario.id;
      showModal.value = true;
    };

    const openEquiposModal = (usuario) => {
      selectedUsuario.value = usuario;
      showEquiposModal.value = true;
      // Resetear acordeones abiertos
      openAccordions.value = [];
    };

    const closeEquiposModal = () => {
      showEquiposModal.value = false;
    };

    const submitUsuario = async () => {
      try {
        // Forzar que niv_apr_gas sea numérico
        newUsuario.value.niv_apr_gas = Number(newUsuario.value.niv_apr_gas);
        if (modalMode.value === "new") {
          await createUsuario(newUsuario.value);
        } else {
          await updateUsuario(selectedUsuarioId.value, newUsuario.value);
        }
        await fetchUsuarios();
        closeModal();
      } catch (error) {
        console.error("Error al enviar el usuario:", error);
      }
    };

    const confirmDelete = (usuario) => {
      userToDelete.value = usuario;
      showDeleteModal.value = true;
    };

    const executeDelete = async () => {
      if (userToDelete.value) {
        try {
          await deleteUsuario(userToDelete.value.id);
          await fetchUsuarios();
          showDeleteModal.value = false;
        } catch (error) {
          console.error("Error al eliminar el usuario:", error);
        }
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    // Métodos para el avatar
    const getInitials = (name) => {
      if (!name) return '';
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };

    const getAvatarColor = (name) => {
      if (!name) return '#6B7280'; // Default gray
      
      // Lista de colores para avatares
      const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // amber
        '#8B5CF6', // purple
        '#EC4899', // pink
        '#EF4444', // red
        '#06B6D4', // cyan
        '#6366F1', // indigo
      ];
      
      // Usar el nombre para generar un índice consistente
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      // Convertir a índice positivo dentro del rango de colores
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    };

    // Métodos para los equipos
    const getEquipmentIcon = (tipo) => {
      switch (tipo?.toLowerCase()) {
        case 'celular':
          return 'fas fa-mobile-alt';
        case 'equipo':
          return 'fas fa-desktop';
        case 'monitor':
          return 'fas fa-tv';
        case 'impresora':
          return 'fas fa-print';
        default:
          return 'fas fa-microchip';
      }
    };

    const getStatusClass = (estado) => {
      switch (estado?.toLowerCase()) {
        case 'asignado':
          return 'status-assigned';
        case 'no asignado':
          return 'status-unassigned';
        case 'mantenimiento':
          return 'status-maintenance';
        default:
          return 'status-default';
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Fecha inválida';
      }
    };

    const toggleAccordion = (equipoId) => {
      const index = openAccordions.value.indexOf(equipoId);
      if (index === -1) {
        openAccordions.value.push(equipoId);
      } else {
        openAccordions.value.splice(index, 1);
      }
    };

    // Cargar usuarios al iniciar
    fetchUsuarios();

    return {
      usuarios,
      sidebarExpanded,
      showModal,
      showDeleteModal,
      modalMode,
      newUsuario,
      selectedUsuarioId,
      searchQuery,
      showPassword,
      userToDelete,
      filteredUsuarios,
      fetchUsuarios,
      openNewUsuarioModal,
      openEditUsuarioModal,
      submitUsuario,
      confirmDelete,
      executeDelete,
      closeModal,
      showEquiposModal,
      selectedUsuario,
      openEquiposModal,
      closeEquiposModal,
      getInitials,
      getAvatarColor,
      getEquipmentIcon,
      getStatusClass,
      formatDate,
      toggleAccordion,
      openAccordions,
      viewMode
    };
  }
};
</script>

<style scoped>
/* Base layout */
.usuarios-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.content {
  transition: margin-left 0.3s ease;
}

/* Avatar styling */
.avatar-circle {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
  color: white;
  flex-shrink: 0;
}

/* Smaller avatar for table view */
.avatar-circle-sm {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
}

/* Equipment icon styling */
.equipment-icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  flex-shrink: 0;
}

.equipment-icon {
  font-size: 1.5rem;
}

.fas.fa-mobile-alt {
  color: #10b981; /* green */
}

.fas.fa-desktop {
  color: #3b82f6; /* blue */
}

.fas.fa-tv {
  color: #8b5cf6; /* purple */
}

.fas.fa-print {
  color: #f59e0b; /* amber */
}

.fas.fa-microchip {
  color: #6b7280; /* gray */
}

/* Status badges */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-assigned {
  background-color: #dcfce7;
  color: #166534;
}

.status-unassigned {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-maintenance {
  background-color: #fff7ed;
  color: #c2410c;
}

.status-default {
  background-color: #e0f2fe;
  color: #0369a1;
}

/* Info items in equipment cards */
.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.125rem;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
}

.info-item.col-span-2 {
  grid-column: span 2;
}

/* Accordion styling */
.accordion {
  border-radius: 0.5rem;
  overflow: hidden;
}

.accordion-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  transition: color 0.2s;
}

.accordion-button:hover {
  color: #1f2937;
}

.accordion-content {
  padding-top: 0.5rem;
  animation: slideDown 0.3s ease-out;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Fix for the typo in the template */
/* Note: There's a typo in line 8 "el n" that should be removed */

/* Responsive adjustments */
@media (max-width: 768px) {
  .content {
    margin-left: 0 !important;
    padding: 1rem;
  }
  
  .avatar-circle {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
  
  .equipment-icon-container {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .equipment-icon {
    font-size: 1.25rem;
  }
}
.modal-fadeo {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(3px);
  animation: fadeIn 0.2s ease-out;
}
</style>