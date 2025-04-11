<template>
  <div v-if="show" class="modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="closeModal">
    <div
      class="modal-content bg-white rounded-lg shadow-xl w-full max-w-5xl transform transition-all duration-300 overflow-hidden flex flex-col">
      <!-- Botón de cerrar -->
      <button @click="closeModal" class="absolute top-4 right-4 text-red-400 z-10 bg-white rounded-lg px-2 py-1 hover:shadow-lg hover:bg-red-400 hover:text-white">
        <span class="material-icons">close</span>
      </button>
      <!-- Encabezado -->
      <div class="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-center">
          {{ mode === 'new' ? 'Nuevo Proyecto' : 'Editar Proyecto' }}
        </h2>
        <!-- El checkbox "Ok proceder" se muestra para todos, pero se habilita solo si el usuario es admin -->
        <div class="flex items-center bg-white rounded-md px-4 py-2 ml-4 shadow-sm mr-15">
          <input
            type="checkbox"
            v-model="proceedOk"
            id="ok-proceder"
            class="mr-2"
            :disabled="!isCurrentUserAdmin"
          />
          <label for="ok-proceder" class="text-sm text-black">Ok proceder</label>
        </div>
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
                      <input type="text" v-model="subtask.name" placeholder="Nombre de la subtarea" disabled
                        class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400 text-sm" />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio:</label>
                      <input type="date" v-model="subtask.startDate" :disabled="subtask.status === 'completada' || subtask.status === 'Completada'"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm" />
                    </div>
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin:</label>
                      <input type="date" v-model="subtask.endDate" :disabled="subtask.status === 'completada' || subtask.status === 'Completada'"
                        class="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm" />
                    </div>
                    <div class="col-span-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">Completada</label>
                      <input type="checkbox" v-model="subtask.completed" @change="handleSubtaskSuccessChange(subtask)"
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

export default {
  name: 'TaskModal',
  props: {
    show: { type: Boolean, required: true },
    mode: { type: String, required: true, validator: value => ['new', 'edit'].includes(value) },
    task: { type: Object, default: () => ({}) },
    isAdmin: { type: Boolean, default: false }
  },
  data() {
    return {
      taskData: {},
      showComments: false,
      showProjectInfo: true,
      showSubtasks: false,
      newComment: '',
      colorOptions: ["#1E3A8A", "#5B21B6", "#0E7490", "#1F2937"],
      pastelColorOptions: ["#BFDBFE", "#DDD6FE", "#A5F3FC", "#D1D5DB"],
      proceedOk: false,
      // Lista de usuarios (simulada, reemplaza según tus necesidades)
      users: [
        { id: 1, nombre: 'Juan Perez', role: 'user' },
        { id: 2, nombre: 'María Díaz', role: 'user' },
        { id: 3, nombre: 'Carlos López', role: 'admin' } // Este no se mostrará
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => user.role === 'user');
    },
    isCurrentUserAdmin() {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        return currentUser.role === 'admin';
      }
      return false;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        // Clonar la task para editar sin afectar la original
        this.taskData = JSON.parse(JSON.stringify(this.task));
        
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
            // Sincronizamos el check con el status
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
      // Validar que las fechas de las subtareas estén dentro del rango del proyecto
      const projectStart = new Date(this.taskData.start);
      const projectEnd = new Date(this.taskData.end);
      for (const [index, subtask] of this.taskData.subtasks.entries()) {
        const subtaskName = subtask.name || `Subtarea ${index + 1}`;
        if (subtask.startDate) {
          const subStart = new Date(subtask.startDate);
          if (subStart < projectStart) {
            Swal.fire(
              'Error',
              `La fecha de inicio de "${subtaskName}" no puede ser anterior a la fecha de inicio del proyecto.`,
              'error'
            );
            return;
          }
        }
        if (subtask.endDate) {
          const subEnd = new Date(subtask.endDate);
          if (subEnd > projectEnd) {
            Swal.fire(
              'Error',
              `La fecha de fin de "${subtaskName}" no puede ser posterior a la fecha de fin del proyecto.`,
              'error'
            );
            return;
          }
        }
      }
      
      // Lógica para asignar color según la celula
      let celulaColor = "";
      if (this.taskData.celula === "RETAIL") {
        celulaColor = "#156082";
      } else if (this.taskData.celula === "LUJO") {
        celulaColor = "#000000";
      } else if (this.taskData.celula === "ARQ") {
        celulaColor = "#12501a";
      } else {
        celulaColor = this.taskData.color;
      }
      
      this.taskData.color = celulaColor;
      
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
        subtasks: { create: this.taskData.subtasks }
      };
      this.$emit('submit', payload);
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