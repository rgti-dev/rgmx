<template>
  <div v-if="show" class="modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="closeModal">
    <div
      class="modal-content bg-white rounded-lg shadow-xl w-full max-w-5xl transform transition-all duration-300 overflow-hidden flex flex-col">
      <!-- Botón de cerrar -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
        <span class="material-icons">close</span>
      </button>
      <!-- Encabezado -->
      <div class="bg-blue-600 text-white px-6 py-4">
        <h2 class="text-2xl font-bold text-center">
          {{ mode === 'new' ? 'Nuevo Proyecto' : 'Editar Proyecto' }}
        </h2>
      </div>

      <!-- Contenido Principal del Modal -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Contenido principal (formulario) -->
        <div class="flex-1 overflow-y-auto">
          <form @submit.prevent="submitTask" class="px-6 py-6 space-y-6">
            <!-- Información del Proyecto -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 flex items-center justify-between cursor-pointer"
                @click="toggleProjectInfo">
                <div class="flex items-center">
                  <span class="material-icons mr-2 text-blue-600">description</span>
                  Información del Proyecto {{ taskData.name ? `(${taskData.name})` : '' }}
                </div>
                <span class="material-icons">{{ showProjectInfo ? 'expand_less' : 'expand_more' }}</span>
              </h3>
              <div v-if="showProjectInfo" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                  <input type="text" v-model="taskData.name" placeholder="Nombre del proyecto"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                  <textarea v-model="taskData.description" placeholder="Ingrese la descripción" rows="2"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio:</label>
                  <input type="date" v-model="taskData.start"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin:</label>
                  <input type="date" v-model="taskData.end"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                  <select v-model="taskData.status"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2">
                    <option value="pendiente">Pendiente</option>
                    <option value="en-progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad:</label>
                  <select v-model="taskData.priority"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2">
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div class="hidden">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Color:</label>
                  <div class="flex gap-2 flex-wrap">
                    <div v-for="(color, index) in colorOptions" :key="index"
                      class="w-8 h-8 rounded-full cursor-pointer border-2"
                      :class="taskData.color === color ? 'border-black' : 'border-gray-300'"
                      :style="{ backgroundColor: color }" @click="taskData.color = color"></div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Celula:</label>
                  <select v-model="taskData.celula" class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 required">
                    <option value="">Seleccione una opción</option>
                    <option value="RETAIL">RETAIL</option>
                    <option value="LUJO">LUJO</option>
                    <option value="ARQ">ARQ</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Marca:</label>
                  <input type="text" v-model="taskData.marca" placeholder="Ingrese la marca"
                    class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2" />
                </div>
                <div class="hidden">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Responsable:</label>
                  <select v-model="taskData.responsable" class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2">
                    <option value="">Seleccione un responsable</option>
                    <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
                      {{ user.nombre }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Sección de Subtareas -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 class="text-lg font-semibold mb-4 flex items-center justify-between cursor-pointer"
                @click="toggleSubtasks">
                <div class="flex items-center">
                  <span class="material-icons mr-2 text-green-600">assignment</span>
                  Subtareas
                </div>
                <span class="material-icons">{{ showSubtasks ? 'expand_less' : 'expand_more' }}</span>
              </h3>

              <div v-if="showSubtasks" class="space-y-4">
                <!-- Lista de subtareas -->
                <div v-for="(subtask, index) in taskData.subtasks" :key="index"
                  class="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                  <div class="flex justify-between items-center">
                    <h4 class="font-medium  items-center hidden">
                      <span class="material-icons text-sm mr-1 text-green-500">task_alt</span>
                      {{ subtask.name || 'Nueva subtarea ' + (index + 1) }}
                    </h4>
                    <div class="flex space-x-2">
                      <button type="button" @click.stop="toggleSubtaskDetails(index)"
                        class="text-gray-500 hover:text-gray-700 hidden">
                        <span class="material-icons text-sm">{{ subtask.showDetails ? 'expand_less' : 'expand_more'
                          }}</span>
                      </button>
                      <button type="button" @click="removeSubtask(index)"
                        class="text-red-500 hover:text-red-700 hidden">
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  <!-- Campos siempre visibles -->
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-3 mt-2">
                    <button type="button" @click.stop="toggleSubtaskDetails(index)"
                      class="text-gray-500 hover:text-gray-700 col-span-1 hidden">
                      <span class="material-icons text-sm">{{ subtask.showDetails ? 'expand_less' : 'expand_more'
                        }}</span>
                    </button>
                    <div class="col-span-7">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                      <input type="text" v-model="subtask.name" placeholder="Nombre de la subtarea"
                      disabled
                        class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 text-sm" />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio:</label>
                      <input type="date" v-model="subtask.startDate"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm" />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin:</label>
                      <input type="date" v-model="subtask.endDate"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm" />
                    </div>
                    <div class="col-span-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Completada</label>
                      <input type="checkbox" v-model="subtask.completed"
                        @change="handleSubtaskSuccessChange(subtask)"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                    </div>
                  </div>

                  <!-- Campos ocultos que se muestran con el toggle -->
                  <div v-if="subtask.showDetails"
                    class=" grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100 hidden">
                    <div class="hidden">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Duración (días):</label>
                      <input type="number" v-model.number="subtask.duration" placeholder="Días" min="1"
                        class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 text-sm" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                      <select v-model="subtask.status" @change="updateSubtaskChain" class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm">
                        <option value="pendiente">Pendiente</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="completada">Completada</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad:</label>
                      <select v-model="subtask.priority"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm">
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Color:</label>
                      <div class="flex gap-2">
                        <div v-for="(color, idx) in pastelColorOptions" :key="idx"
                          class="w-6 h-6 rounded-full cursor-pointer border-2"
                          :class="subtask.color === color ? 'border-black' : 'border-gray-300'"
                          :style="{ backgroundColor: color }" @click="subtask.color = color">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Botón para agregar nueva subtarea -->
                <button @click="addSubtask"
                  class="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors hidden items-center justify-center">
                  <span class="material-icons mr-1 hidden">add</span> Agregar subtarea
                </button>
              </div>
            </div>

            <!-- Sección de Configuración de Alertas -->
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6">
              <h3 class="text-lg font-semibold mb-4 flex items-center justify-between cursor-pointer"
                @click="toggleAlerts">
                <div class="flex items-center">
                  <span class="material-icons mr-2 text-orange-500">notifications_active</span>
                  Configuración de Alertas
                </div>
                <span class="material-icons">{{ showAlerts ? 'expand_less' : 'expand_more' }}</span>
              </h3>

              <div v-if="showAlerts" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                    <label class=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span class="material-icons text-orange-500 mr-1 text-sm">toggle_on</span>
                      Activar alertas para este proyecto:
                    </label>
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" v-model="taskData.alertsEnabled"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                      <span class="text-sm text-gray-600">Habilitar notificaciones</span>
                    </div>
                  </div>
                  
                  <div v-if="taskData.alertsEnabled" class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                    <label class=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span class="material-icons text-blue-500 mr-1 text-sm">schedule</span>
                      Días de anticipación:
                    </label>
                    <div class="flex items-center">
                      <input type="number" v-model.number="taskData.alertDays" min="1" max="30"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2" />
                      <button type="button" @click="addAlertTime" 
                        class="ml-2 p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" 
                        title="Añadir otro tiempo de alerta">
                        <span class="material-icons text-sm">add_circle</span>
                      </button>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">Días antes de la fecha límite para enviar la alerta</p>
                    
                    <!-- Tiempos de alerta adicionales -->
                    <div v-if="taskData.additionalAlertTimes && taskData.additionalAlertTimes.length > 0" 
                      class="mt-2 border-t border-gray-100 pt-2">
                      <p class="text-xs font-medium text-gray-700">Alertas adicionales:</p>
                      <div v-for="(time, index) in taskData.additionalAlertTimes" :key="index" 
                        class="flex items-center mt-1">
                        <input type="number" v-model.number="taskData.additionalAlertTimes[index]" min="1" max="30"
                          class="w-20 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-2 py-1 text-sm" />
                        <span class="text-xs text-gray-600 ml-1">días antes</span>
                        <button @click="removeAlertTime(index)" 
                          class="ml-2 text-red-500 hover:text-red-700">
                          <span class="material-icons text-sm">remove_circle</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="taskData.alertsEnabled" class="border-t border-gray-200 pt-4">
                  <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                    <span class="material-icons text-green-600 mr-1 text-sm">people</span>
                    Destinatarios de alertas:
                  </h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                      <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                          <input type="checkbox" v-model="taskData.alertToCreator"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                          <span class="text-sm flex items-center">
                            <span class="material-icons text-blue-500 mr-1 text-sm">person</span>
                            Creador del proyecto
                          </span>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                          <input type="checkbox" v-model="taskData.alertToResponsible"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                          <span class="text-sm flex items-center">
                            <span class="material-icons text-purple-500 mr-1 text-sm">assignment_ind</span>
                            Responsable del proyecto
                          </span>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                          <input type="checkbox" v-model="taskData.alertToAll"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                          <span class="text-sm flex items-center">
                            <span class="material-icons text-green-500 mr-1 text-sm">groups</span>
                            Todos los involucrados
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                      <label class=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <span class="material-icons text-blue-500 mr-1 text-sm">email</span>
                        Destinatarios adicionales:
                      </label>
                      <div class="flex items-center">
                        <select v-model="selectedUser" 
                          class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm">
                          <option value="">Seleccionar usuario</option>
                          <option v-for="user in filteredUsers" :key="user.id" :value="user.id">
                            {{ user.nombre }}
                          </option>
                        </select>
                        <button type="button" @click="addAdditionalRecipient" 
                          class="ml-2 p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" 
                          title="Añadir destinatario">
                          <span class="material-icons text-sm">add_circle</span>
                        </button>
                      </div>
                      
                      <!-- Lista de destinatarios adicionales -->
                      <div v-if="taskData.additionalRecipients && taskData.additionalRecipients.length > 0" 
                        class="mt-2 max-h-20 overflow-y-auto">
                        <div v-for="(recipient, index) in taskData.additionalRecipients" :key="index" 
                          class="flex items-center justify-between text-sm bg-gray-50 p-1 rounded mt-1">
                          <span>{{ getUserName(recipient) }}</span>
                          <button @click="removeAdditionalRecipient(index)" 
                            class="text-red-500 hover:text-red-700">
                            <span class="material-icons text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                    <label class=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <span class="material-icons text-orange-500 mr-1 text-sm">message</span>
                      Mensaje personalizado:
                    </label>
                    <textarea v-model="taskData.alertMessage" rows="2" placeholder="Mensaje opcional para incluir en la alerta"
                      class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2"></textarea>
                    
                    <!-- Vista previa del mensaje -->
                    <div v-if="taskData.alertMessage" class="mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                      <p class="text-xs font-medium text-gray-700">Vista previa:</p>
                      <p class="text-sm text-gray-600 mt-1">{{ getAlertPreview() }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="taskData.alertsEnabled" class="border-t border-gray-200 pt-4">
                  <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                    <span class="material-icons text-purple-600 mr-1 text-sm">assignment</span>
                    Configuración para subtareas:
                  </h4>
                  
                  <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                    <div class="flex items-center space-x-2">
                      <input type="checkbox" v-model="taskData.alertForSubtasks"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                      <span class="text-sm flex items-center">
                        <span class="material-icons text-green-500 mr-1 text-sm">task_alt</span>
                        Activar alertas para subtareas
                      </span>
                    </div>
                    
                    <div v-if="taskData.alertForSubtasks" class="pl-6 pt-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Subtareas a monitorear:</label>
                      <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                        <div v-for="(subtask, index) in taskData.subtasks" :key="index" 
                          class="flex items-center space-x-2 py-1 hover:bg-gray-50 rounded px-2">
                          <input type="checkbox" v-model="subtask.alertEnabled"
                            class="rounded border-gray-300 text-blue-600 focus:ring-blue-400" />
                          <span class="text-sm">{{ subtask.name }}</span>
                          <span v-if="subtask.alertEnabled" 
                            class="ml-auto text-xs px-2 py-0.5 rounded-full"
                            :class="getSubtaskPriorityClass(subtask)">
                            {{ subtask.priority || 'media' }}
                          </span>
                        </div>
                      </div>
                      
                      <!-- Resumen de alertas de subtareas -->
                      <div v-if="getEnabledSubtasksCount() > 0" class="mt-2 text-xs text-gray-600">
                        {{ getEnabledSubtasksCount() }} subtarea(s) con alertas activadas
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Historial de alertas enviadas -->
                <div v-if="taskData.alertsEnabled && taskData.sentAlerts && taskData.sentAlerts.length > 0" 
                  class="border-t border-gray-200 pt-4">
                  <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                    <span class="material-icons text-blue-600 mr-1 text-sm">history</span>
                    Historial de alertas enviadas:
                  </h4>
                  
                  <div class="bg-white p-3 rounded-md border border-gray-200 shadow-sm max-h-40 overflow-y-auto">
                    <div v-for="(alert, index) in taskData.sentAlerts" :key="index" 
                      class="text-sm border-b border-gray-100 last:border-b-0 py-1">
                      <div class="flex items-center">
                        <span class="material-icons text-green-500 mr-1 text-sm">check_circle</span>
                        <span class="font-medium">{{ alert.type }}</span>
                        <span class="ml-auto text-xs text-gray-500">
                          {{ formatAlertDate(alert.sentAt) }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 ml-5">{{ alert.message }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notificaciones -->
            <div v-if="taskData.notifications && taskData.notifications.length" class="mt-4 bg-gray-100 p-4 rounded">
              <h4 class="font-medium text-gray-700 mb-2 flex items-center">
                    <span class="material-icons text-blue-600 mr-1 text-sm">history</span>
                    Historial de alertas enviadas:
                  </h4>
              <ul>
                <li v-for="notif in taskData.notifications" :key="notif.id" class="mb-1">
                  <span class="font-bold">{{ notif.alertType }}</span> - {{ notif.message }} 
                  <small class="text-gray-500">
                    {{ new Date(notif.scheduledAt).toLocaleString() }}
                  </small>
                </li>
              </ul>
            </div>

            <!-- Botones de Cancelar/Guardar -->
            <div class="flex justify-end space-x-4 pt-4 border-t">
              <button type="button" @click="toggleComments"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center">
                <span class="material-icons mr-1">{{ showComments ? 'comment' : 'comment' }}</span>
                {{ showComments ? 'Ocultar Comentarios' : 'Ver Comentarios' }}
              </button>
              <button type="button" @click="closeModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button type="submit"
                class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                {{ mode === 'new' ? 'Crear' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Panel lateral de comentarios -->
        <div v-if="showComments"
          class="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto transition-all duration-300">
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <span class="material-icons mr-2 text-blue-600">chat</span>
              Comentarios
            </h3>

            <!-- Lista de comentarios -->
            <div class="h-64 border rounded-md p-3 overflow-y-auto bg-white mb-3">
              <div v-if="taskData.comments && taskData.comments.length">
                <div v-for="comment in taskData.comments" :key="comment.id" class="mb-3 border-b pb-2">
                  <p class="font-bold text-xs text-gray-600">
                    Por: {{ comment.usuario ? comment.usuario.nombre : 'Usuario actual' }}
                  </p>
                  <p class="text-gray-700 text-sm">{{ comment.content }}</p>
                  <small class="text-gray-500 text-xs">
                    {{ new Date(comment.createdAt).toLocaleString() }}
                  </small>
                </div>
              </div>
              <div v-else class="text-gray-500 text-sm flex items-center justify-center h-full">
                No hay comentarios aún.
              </div>
            </div>

            <!-- Formulario para nuevo comentario -->
            <div>
              <textarea v-model="newComment" placeholder="Escribe un comentario..."
                class="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-400" rows="3"></textarea>
              <button type="button" @click="submitComment"
                class="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
                <span class="material-icons mr-1">send</span> Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createComment } from '@/api/comments';
import Swal from 'sweetalert2';
import { updateSubtaskStatus } from '@/api/taskOT';
import { createNotification } from '@/api/notification'; // <-- Importa la función de notificación
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

export default {
  name: 'TaskModal',
  props: {
    show: { type: Boolean, required: true },
    mode: { type: String, required: true, validator: value => ['new', 'edit'].includes(value) },
    task: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      taskData: {},
      showComments: false,
      showProjectInfo: true,
      selectedUser: '',
      showSubtasks: false,
      showAlerts: false,
      newComment: '',
      colorOptions: ["#1E3A8A", "#5B21B6", "#0E7490", "#1F2937"],
      pastelColorOptions: ["#BFDBFE", "#DDD6FE", "#A5F3FC", "#D1D5DB"],
      // Lista de usuarios (simulada, reemplaza según tus necesidades)
      users: [
        { id: 1, nombre: 'Juan Perez', role: 'user' },
        { id: 2, nombre: 'María Díaz', role: 'user' },
        { id: 3, nombre: 'Carlos López', role: 'admin' }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.role === 'user');
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Clonar la task para editar sin afectar la original
        this.taskData = JSON.parse(JSON.stringify(this.task));
        
        // Validar que existan las alertas en la tarea y asignar valores por defecto si es necesario
        if (this.taskData.alertsEnabled === undefined) {
          console.warn("alertsEnabled no definido, asignando false");
          this.taskData.alertsEnabled = false;
        }
        if (this.taskData.alertDays === undefined) {
          console.warn("alertDays no definido, asignando 3");
          this.taskData.alertDays = 3;
        }
        if (this.taskData.alertToCreator === undefined) {
          console.warn("alertToCreator no definido, asignando true");
          this.taskData.alertToCreator = true;
        }
        if (this.taskData.alertToResponsible === undefined) {
          console.warn("alertToResponsible no definido, asignando false");
          this.taskData.alertToResponsible = false;
        }
        if (this.taskData.alertToAll === undefined) {
          console.warn("alertToAll no definido, asignando false");
          this.taskData.alertToAll = false;
        }
        if (this.taskData.alertMessage === undefined) {
          console.warn("alertMessage no definido, asignando cadena vacía");
          this.taskData.alertMessage = '';
        }
        if (this.taskData.alertForSubtasks === undefined) {
          console.warn("alertForSubtasks no definido, asignando false");
          this.taskData.alertForSubtasks = false;
        }
        
        if (!this.taskData.notifications) {
          console.warn("No se encontraron notificaciones en taskData");
          this.taskData.notifications = [];
        }
        
        // Depurar la taskData completa para ayudar a identificar campos faltantes
        console.log("Datos de task cargados:", this.taskData);
        
        // Procesar subtareas (ya existente)
        if (this.taskData.subtasks) {
          // Normalize y ordenar las subtareas según orderList
          this.taskData.subtasks = this.taskData.subtasks.map(subtask => ({
            ...subtask,
            startDate: subtask.startDate || subtask.start || '',
            endDate: subtask.endDate || subtask.end || '',
            showDetails: subtask.showDetails !== undefined ? subtask.showDetails : false
          })).map(subtask => ({
            ...subtask,
            startDate: subtask.startDate ? new Date(subtask.startDate).toISOString().substr(0, 10) : '',
            endDate: subtask.endDate ? new Date(subtask.endDate).toISOString().substr(0, 10) : '',
            completed: subtask.status === 'completada'
          }));
        
          const orderList = [
            "ENTREGA DE LISTAS DE MATERIALES",
            "ORDEN DE PRODUCCIÓN PARA FABRICACIÓN",
            "ENTREGA DE HOJAS DE RUTA, DXF Y PLANOS",
            "KICK OFF",
            "ENTREGA DE MATERIALES",
            "PRODUCCIÓN",
            "ENTREGA CARPETA OBRA Y/O PACKING LIST Y BAUL",
            "C1",
            "C2",
            "C3",
            "DESCARGA",
            "MONTAJE",
            "APERTURA",
            "CIERRE PROYECTO INDICADORES (Presupuestos)"
          ];
          this.taskData.subtasks.sort((a, b) => {
            let indexA = orderList.indexOf(a.name ? a.name.toUpperCase() : "");
            let indexB = orderList.indexOf(b.name ? b.name.toUpperCase() : "");
            if (indexA === -1) indexA = Number.MAX_VALUE;
            if (indexB === -1) indexB = Number.MAX_VALUE;
            return indexA - indexB;
          });
        
          this.taskData.subtasks.forEach(subtask => {
            if (subtask.alertEnabled === undefined) {
              console.warn(`Subtarea "${subtask.name}" no tiene alertEnabled definido, asignando false`);
              subtask.alertEnabled = false;
            }
          });
        } else {
          this.taskData.subtasks = [];
        }
        
        // Actualiza las subtareas según el status del padre
        if (this.taskData.status === 'pendiente') {
          this.taskData.subtasks.forEach(sub => {
            sub.status = 'pendiente';
            sub.completed = false;
          });
        }
        if (this.mode === 'new') {
          this.initializeSubtaskDefaults();
        }
        if (this.taskData.status === 'en-progreso' && this.taskData.subtasks.length) {
          this.updateSubtaskChain();
        }
        if (this.taskData.status === 'completada') {
          this.taskData.subtasks.forEach(sub => {
            sub.status = 'completada';
            sub.completed = true;
          });
        }
      }
    },
    // Cuando se cambie el status del padre, actualizar las subtareas
    'taskData.status'(newStatus) {
      if (newStatus === 'pendiente') {
        this.taskData.subtasks.forEach(sub => {
          sub.status = 'pendiente';
          sub.completed = false;
        });
      } else if (newStatus === 'en-progreso') {
        this.updateSubtaskChain();
      } else if(newStatus === 'completada'){
        this.taskData.subtasks.forEach(sub => {
          sub.status = 'completada';
          sub.completed = true;
        });
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    toggleComments() {
      this.showComments = !this.showComments;
    },
    toggleProjectInfo() {
      this.showProjectInfo = !this.showProjectInfo;
    },
    toggleSubtasks() {
      this.showSubtasks = !this.showSubtasks;
    },
    toggleAlerts() {
      this.showAlerts = !this.showAlerts;
    },
    addSubtask() {
      if (!this.taskData.subtasks) {
        this.taskData.subtasks = [];
      }
      this.taskData.subtasks.push({
        name: '',
        duration: 1,
        status: 'pendiente',
        priority: 'media',
        startDate: '',
        endDate: '',
        showDetails: false,
        completed: false
      });
      if (this.mode === 'new') {
        this.initializeSubtaskDefaults();
      }
    },
    toggleSubtaskDetails(index) {
      this.taskData.subtasks[index].showDetails = !this.taskData.subtasks[index].showDetails;
    },
    removeSubtask(index) {
      this.taskData.subtasks.splice(index, 1);
      this.updateSubtaskChain();
      if (this.mode === 'new') {
        this.initializeSubtaskDefaults();
      }
    },
    updateSubtaskChain() {
      if (this.taskData.subtasks && this.taskData.subtasks.length > 0) {
        for (let i = 0; i < this.taskData.subtasks.length; i++) {
          if (this.taskData.subtasks[i].status !== 'completada') {
            if (i === 0 || this.taskData.subtasks[i - 1].status === 'completada') {
              this.taskData.subtasks[i].status = 'en-progreso';
              for (let j = i + 1; j < this.taskData.subtasks.length; j++) {
                if (this.taskData.subtasks[j].status !== 'completada') {
                  this.taskData.subtasks[j].status = 'pendiente';
                }
              }
              break;
            }
          }
        }
      }
    },
    initializeSubtaskDefaults() {
      if (this.taskData.start && this.taskData.end && this.taskData.subtasks.length > 0) {
        const projectStart = new Date(this.taskData.start);
        const projectEnd = new Date(this.taskData.end);
        const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24)) + 1;
        const subtaskCount = this.taskData.subtasks.length;
        const defaultDuration = Math.floor(totalDays / subtaskCount);
        const extraDays = totalDays - (defaultDuration * subtaskCount);

        this.taskData.subtasks.forEach((sub, index) => {
          const offset = index * defaultDuration + (index < extraDays ? index : extraDays);
          const subStart = new Date(projectStart);
          subStart.setDate(subStart.getDate() + offset);
          sub.startDate = subStart.toISOString().substr(0, 10);

          const subDuration = defaultDuration + (index < extraDays ? 1 : 0);
          sub.duration = subDuration;

          const subEnd = new Date(subStart);
          subEnd.setDate(subEnd.getDate() + subDuration - 1);
          sub.endDate = subEnd.toISOString().substr(0,10);
        });
      }
    },
    async handleSubtaskSuccessChange(subtask) {
      // Asigna 'completada' si el checkbox está marcado; de lo contrario, 'pendiente'
      subtask.status = subtask.completed ? 'completada' : 'pendiente';
      try {
        await updateSubtaskStatus({ id: subtask.id, status: subtask.status });
        // Si se marcó como completada, actualizamos la siguiente subtarea
        if(subtask.completed) {
          this.updateNextSubtask(subtask);
        }
      } catch (error) {
        console.error("Error al actualizar el estatus de la subtarea:", error);
      }
    },
    updateNextSubtask(subtask) {
      // Encuentra la subtarea actual en el arreglo
      const index = this.taskData.subtasks.findIndex(s => s.id === subtask.id);
      if(index !== -1 && index < this.taskData.subtasks.length - 1) {
        const nextSubtask = this.taskData.subtasks[index + 1];
        // Solo actualiza si la siguiente no está completada
        if(nextSubtask.status !== 'completada') {
          nextSubtask.status = 'en-progreso';
          // Opcional: Actualizar este cambio en la BD
          updateSubtaskStatus({ id: nextSubtask.id, status: 'en-progreso' })
            .catch(error => {
              console.error("Error al actualizar el estatus de la siguiente subtarea:", error);
            });
        }
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        const currentUserStr = localStorage.getItem("currentUser");
        let userId = 1;
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          userId = currentUser.id;
        }
        const payload = {
          content: this.newComment,
          taskId: this.taskData.id,
          createdBy: userId
        };
        const response = await createComment(payload);
        if (!this.taskData.comments) {
          this.taskData.comments = [];
        }
        this.taskData.comments.push(response);
        this.newComment = "";
      } catch (error) {
        console.error("Error al enviar comentario:", error);
      }
    },
    submitTask() {
      let celulaColor = "";
      if (this.taskData.celula === "RETAIL") {
        celulaColor = "#156082";
      } else if (this.taskData.celula === "LUJO") {
        celulaColor = "#000000";
      } else if (this.taskData.celula === "ARQ") {
        celulaColor = "#12501a";
      } else {
        // Opcional: se deja el color actual si no coincide
        celulaColor = this.taskData.color;
      }
      
      // Ahora asigna el color calculado a taskData.color o directamente en el payload
      this.taskData.color = celulaColor;
      
      // Preparar la información de alertas para las subtareas
      if (this.taskData.subtasks && this.taskData.subtasks.length > 0) {
        this.taskData.subtasks = this.taskData.subtasks.map(subtask => {
          // Solo incluir la propiedad alertEnabled si alertForSubtasks está activado
          if (!this.taskData.alertForSubtasks) {
            delete subtask.alertEnabled;
          }
          return subtask;
        });
      }
      
      const payload = {
        name: this.taskData.name,
        description: this.taskData.description,
        startDate: this.taskData.start,
        endDate: this.taskData.end,
        status: this.taskData.status,
        priority: this.taskData.priority,
        color: this.taskData.color,
        milestone: this.taskData.milestone,
        progress: this.taskData.progress,
        completedAt: this.taskData.status === 'completada'
          ? (this.taskData.completedAt || new Date().toISOString())
          : null,
        celula: this.taskData.celula,
        marca: this.taskData.marca,
        responsable: this.taskData.responsable,
        // Información de alertas
        alertsEnabled: this.taskData.alertsEnabled,
        alertDays: this.taskData.alertDays,
        alertToCreator: this.taskData.alertToCreator,
        alertToResponsible: this.taskData.alertToResponsible,
        alertToAll: this.taskData.alertToAll,
        alertMessage: this.taskData.alertMessage,
        alertForSubtasks: this.taskData.alertForSubtasks,
        subtasks: { create: this.taskData.subtasks }
      };
      this.$emit('submit', payload);
      
      // Llamamos al método para disparar notificaciones si la configuración está activa
      if(this.taskData.alertsEnabled) {
        this.triggerAlerts();
      }
    },
    addAlertTime() {
      if (!this.taskData.additionalAlertTimes) {
        this.taskData.additionalAlertTimes = [];
      }
      this.taskData.additionalAlertTimes.push(7); // Valor predeterminado de 7 días
    },
    
    removeAlertTime(index) {
      this.taskData.additionalAlertTimes.splice(index, 1);
    },
    
    addAdditionalRecipient() {
      if (!this.selectedUser) return;
      
      if (!this.taskData.additionalRecipients) {
        this.taskData.additionalRecipients = [];
      }
      
      // Evitar duplicados
      if (!this.taskData.additionalRecipients.includes(this.selectedUser)) {
        this.taskData.additionalRecipients.push(this.selectedUser);
      }
      
      this.selectedUser = ''; // Limpiar selección
    },
    
    removeAdditionalRecipient(index) {
      this.taskData.additionalRecipients.splice(index, 1);
    },
    
    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? user.nombre : 'Usuario desconocido';
    },
    
    getAlertPreview() {
      let preview = this.taskData.alertMessage || '';
      if (!preview) {
        preview = `Recordatorio: El proyecto "${this.taskData.name}" tiene una fecha límite próxima.`;
      }
      return preview;
    },
    
    getSubtaskPriorityClass(subtask) {
      const priorityClasses = {
        'baja': 'bg-green-100 text-green-800',
        'media': 'bg-blue-100 text-blue-800',
        'alta': 'bg-red-100 text-red-800'
      };
      return priorityClasses[subtask.priority] || priorityClasses.media;
    },
    
    getEnabledSubtasksCount() {
      if (!this.taskData.subtasks) return 0;
      return this.taskData.subtasks.filter(s => s.alertEnabled).length;
    },
    
    formatAlertDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString();
    },
    
    async triggerAlerts() {
      // Zona horaria de Ciudad de México
      const tz = "America/Mexico_City";

      // Obtener usuario actual
      let currentUser = { id: 1 };
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        currentUser = JSON.parse(currentUserStr);
      }

      let notifications = [];
      const alertDays = Number(this.taskData.alertDays);

      // Para la tarea principal:
      let projectEnd = dayjs.tz(this.taskData.end, tz);
      let scheduledForProject = projectEnd.subtract(alertDays, 'day');

      // Validar que la fecha de alerta no sea en el pasado
      const now = dayjs();
      if (scheduledForProject.isBefore(now)) {
        console.warn("La fecha de alerta está en el pasado, ajustando a mañana");
        scheduledForProject = now.add(1, 'day');
      }

      console.log("Project End:", projectEnd.format());
      console.log("Scheduled For Alert:", scheduledForProject.format());

      // Añadir destinatarios principales
      let recipients = [];
      
      if (this.taskData.alertToCreator) {
        recipients.push(currentUser.id);
      }
      
      if (this.taskData.alertToResponsible && this.taskData.responsable) {
        recipients.push(this.taskData.responsable);
      }
      
      // Añadir destinatarios adicionales
      if (this.taskData.additionalRecipients && this.taskData.additionalRecipients.length) {
        recipients = [...recipients, ...this.taskData.additionalRecipients];
      }
      
      // Eliminar duplicados
      recipients = [...new Set(recipients)];
      
      // Crear notificaciones para cada destinatario
      for (let userId of recipients) {
        notifications.push({
          userId: userId,
          taskOTId: this.taskData.id || null,
          alertType: "project",
          message: this.taskData.alertMessage || `Recordatorio: El proyecto "${this.taskData.name}" tiene una fecha límite próxima.`,
          scheduledAt: scheduledForProject.format()
        });
      }

      // Procesar alertas adicionales si existen
      if (this.taskData.additionalAlertTimes && this.taskData.additionalAlertTimes.length) {
        for (let additionalDays of this.taskData.additionalAlertTimes) {
          let additionalScheduled = projectEnd.subtract(additionalDays, 'day');
          
          // Validar que la fecha no sea en el pasado
          if (additionalScheduled.isBefore(now)) {
            continue; // Saltamos esta alerta si está en el pasado
          }
          
          for (let userId of recipients) {
            notifications.push({
              userId: userId,
              taskOTId: this.taskData.id || null,
              alertType: "project_additional",
              message: `Recordatorio adicional (${additionalDays} días): El proyecto "${this.taskData.name}" tiene una fecha límite próxima.`,
              scheduledAt: additionalScheduled.format()
            });
          }
        }
      }

      // Para cada subtarea: se utiliza su propia fecha fin en la zona de México
      if (this.taskData.alertForSubtasks && this.taskData.subtasks) {
        this.taskData.subtasks.forEach(subtask => {
          if (subtask.alertEnabled) {
            let subEnd = subtask.endDate
              ? dayjs.tz(subtask.endDate, tz)
              : dayjs.tz(this.taskData.end, tz);
            let scheduledForSub = subEnd.subtract(alertDays, 'day');
            
            /*
            if (scheduledForSub.isBefore(now)) {
              scheduledForSub = now.add(1, 'day');
            }
            */
            
            for (let userId of recipients) {
              notifications.push({
                userId: userId,
                taskOTId: this.taskData.id || null,
                subtaskId: subtask.id || null,
                alertType: "subtask",
                message: `Recordatorio: la subtarea "${subtask.name}" está pendiente en el proyecto ${this.taskData.name}.`,
                scheduledAt: scheduledForSub.format()
              });
            }
          }
        });
      }

      console.log("Alertas generadas:", notifications);

      // Enviar cada notificación usando tu endpoint
      for (let notif of notifications) {
        try {
          const res = await createNotification(notif);
          console.log("Notificación creada:", res.data);
          
          // Guardar historial de alertas enviadas
          if (!this.taskData.sentAlerts) {
            this.taskData.sentAlerts = [];
          }
          
          this.taskData.sentAlerts.push({
            type: notif.alertType,
            message: notif.message,
            sentAt: new Date().toISOString(),
            userId: notif.userId
          });
          
        } catch (error) {
          console.error("Error al crear notificación:", error.response?.data || error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  max-height: 95vh;
  overflow-y: auto;
  width: 95%;
}

.comments-panel {
  transition: all 0.3s ease;
  transform-origin: right;
}

.comments-panel.hidden {
  transform: translateX(100%);
  width: 0;
}

.subtask-item {
  transition: background-color 0.2s ease;
}

.subtask-item:hover {
  background-color: #f9fafb;
}
</style>