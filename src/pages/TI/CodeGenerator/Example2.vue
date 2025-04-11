<template>
  <div class="actividades-container flex w-full min-h-screen bg-white">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido principal -->
    <div
      class="content flex-1 w-full relative transition-all duration-300"
      :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }"
    >
      <!-- Navbar -->
      <Navbar />

      <div class="p-1 md:p-1 mt-10">
        <!-- Título o encabezado -->
        <h1 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          <!-- Agrega aquí el título de la sección -->
        </h1>

        <!-- Sección de búsqueda y controles -->
        <div class="mb-4 flex flex-col md:flex-row gap-1 md:space-x-4 items-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar tarea..."
            class="px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            @click="openNewTaskModal"
            class="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span class="material-icons" title="Nueva Tarea">add</span>
          </button>
          <button
            @click="prevWeek"
            class="px-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <span class="material-icons" title="Semana Anterior">arrow_back</span>
          </button>
          <button
            @click="nextWeek"
            class="px-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <span class="material-icons" title="Semana Siguiente">arrow_forward</span>
          </button>
          <button
            @click="goToCurrentWeek"
            class="px-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <span class="material-icons" title="Semana Actual">today</span>
          </button>
          <p class="text-lg font-medium uppercase text-end flex-1">
            {{ currentMonthYear.month }} {{ currentMonthYear.year }}
          </p>
        </div>

        <!-- Diagrama Gantt -->
        <div class="gantt-container bg-white rounded-lg shadow-lg p-2 md:p-3">
          <div class="overflow-x-auto pb-4">
            <div class="inline-block min-w-full">
              <!-- Cabecera de semanas -->
              <div class="flex border-b">
                <div class="w-48 sticky left-0 bg-white z-20"></div>
                <div class="flex w-full">
                  <div
                    v-for="i in weeksToShow"
                    :key="i"
                    :style="{ width: (dayWidth * 7) + 'px' }"
                    :class="[i === 1 ? 'text-center py-2 bg-gray-200 font-semibold text-gray-700' : 'text-center py-2 bg-gray-200 font-semibold text-gray-700 border-l']"
                  >
                    Semana {{ getWeekLabel(i - 1) }}
                  </div>
                </div>
              </div>
              <!-- Cabecera de días -->
              <div class="flex border-b">
                <div class="w-48 font-semibold sticky left-0 bg-white z-20">
                  Proyectos
                </div>
                <div class="flex">
                  <div
                    v-for="(date, index) in dates"
                    :key="index"
                    :style="{ width: dayWidth + 'px' }"
                    :class="[index === 0 ? 'text-center py-2 text-sm font-medium text-gray-600' : 'text-center py-2 text-sm font-medium text-gray-600 border-l']"
                  >
                    <div class="text-xs text-gray-500">{{ formatWeekday(date) }}</div>
                    <div class="text-sm">{{ formatDate(date) }}</div>
                  </div>
                </div>
              </div>
              <!-- Envolvemos el listado en un div con la clase "gantt-grid" para las líneas verticales -->
              <div class="inline-block min-w-full gantt-grid">
                <!-- Listado de tareas y subtareas filtradas -->
                <div v-for="(task, index) in filteredTasks" :key="index" class="mb-4">
                  <!-- Tarea padre o hito (quitamos la clase "border") -->
                  <div class="rounded-lg">
                    <div
                      class="flex h-12 items-center relative hover:bg-gray-50 group"
                      style="border-bottom: 1px solid #e5e7eb;"
                    >
                      <div
                        class="w-48 pr-4 font-medium truncate text-gray-700 cursor-pointer sticky left-0 bg-white z-20 pl-4"
                        @click="openEditTaskModal(task)"
                      >
                        {{ task.name }}
                      </div>
                      <div class="flex-1 h-full relative">
                        <div
                          v-if="task.milestone"
                          class="milestone"
                          :style="milestoneStyle(task)"
                          title="Hito"
                        ></div>
                        <div v-else class="gantt-bar-wrapper absolute" :style="barStyle(task)">
                          <div
                            class="resize-handle left"
                            @mousedown.stop="startResizing(task, 'start', $event)"
                          ></div>
                          <div
                            class="draggable-area"
                            @mousedown="startDragging(task, $event)"
                            @dblclick="openEditTaskModal(task)"
                          >
                            <div
                              class="bar-full absolute inset-0 rounded-lg shadow-sm"
                              :style="{ backgroundColor: task.color }"
                            ></div>
                            <div
                              class="bar-progress absolute top-0 left-0 bottom-0 rounded-lg"
                              :style="{
                                width: progressWidth(task),
                                backgroundColor: pastelColor(task.color),
                                borderRight: '2px solid #dc2626'
                              }"
                            ></div>
                          </div>
                          <div
                            class="resize-handle right"
                            @mousedown.stop="startResizing(task, 'end', $event)"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <!-- Subtareas -->
                    <div v-if="task.subtasks && task.subtasks.length">
                      <div
                        v-for="(subtask, sIndex) in task.subtasks"
                        :key="sIndex"
                        class="flex h-8 items-center relative hover:bg-gray-50 group"
                        style="border-bottom: 1px solid #e5e7eb; margin-left: 2rem;"
                      >
                        <div
                          class="w-48 pr-4 font-medium truncate text-gray-700 cursor-pointer sticky left-0 bg-white z-20 pl-2"
                          @click="openEditTaskModal(subtask, task)"
                        >
                          {{ subtask.name }}
                        </div>
                        <div class="flex-1 h-full relative">
                          <div class="gantt-bar-wrapper absolute" :style="barStyle(subtask)">
                            <div
                              class="resize-handle left"
                              @mousedown.stop="startResizing(subtask, 'start', $event)"
                            ></div>
                            <div
                              class="draggable-area"
                              @mousedown="startDragging(subtask, $event)"
                              @dblclick="openEditTaskModal(subtask, task)"
                            >
                              <div
                                class="bar-full absolute inset-0 rounded-lg shadow-sm"
                                :style="{ backgroundColor: subtask.color }"
                              ></div>
                              <div
                                class="bar-progress absolute top-0 left-0 bottom-0 rounded-lg"
                                :style="{
                                  width: progressWidth(subtask),
                                  backgroundColor: pastelColor(subtask.color),
                                  borderRight: '2px solid #dc2626'
                                }"
                              ></div>
                            </div>
                            <div
                              class="resize-handle right"
                              @mousedown.stop="startResizing(subtask, 'end', $event)"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fin listado de tareas -->
            </div>
          </div>
        </div>
        <!-- Fin Diagrama Gantt -->
      </div>
    </div>

    <!-- Modal para crear/editar tarea -->
    <div
      v-if="showTaskModal"
      class="modal-container fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click="closeModal"
    >
      <div
        class="modal-content bg-white rounded-lg shadow-xl m-4 max-w-full md:max-w-4xl transition-all duration-300 overflow-hidden"
        @click.stop
      >
        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <span class="material-icons">close</span>
        </button>
        <h2 class="text-xl md:text-3xl font-bold mb-6 text-center">
          {{ taskModalMode === 'new' ? 'Nueva Proyecto' : 'Editar Proyecto' }}
        </h2>
        <form @submit.prevent="submitTask" class="px-6 pb-6">
          <!-- Sección superior: Información de proyecto y Comentarios -->
          <div class="flex flex-col md:flex-row">
            <!-- Columna Izquierda: Información del Proyecto -->
            <div class="w-full md:w-1/2 pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
              <h3 class="text-lg font-semibold mb-4">Información del Proyecto</h3>
              <!-- Campo Nombre -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre:</label>
                <input
                  type="text"
                  v-model="newTask.name"
                  placeholder="Ingresa el nombre de la actividad"
                  class="form-input w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <!-- Campo Descripción -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                <textarea
                  v-model="newTask.description"
                  placeholder="Ingrese la descripción del proyecto"
                  rows="4"
                  class="form-textarea w-full px-3 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                ></textarea>
              </div>
              <!-- Fechas -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio:</label>
                  <input
                    type="date"
                    v-model="newTask.start"
                    class="form-input w-full px-3 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin:</label>
                  <input
                    type="date"
                    v-model="newTask.end"
                    class="form-input w-full px-3 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <!-- Progreso y Color -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Progreso (%):</label>
                  <input
                    type="range"
                    v-model.number="newTask.progress"
                    min="0"
                    max="100"
                    class="w-full"
                  />
                  <p class="text-sm text-gray-600 mt-1">{{ newTask.progress }}%</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Color:</label>
                  <div class="flex gap-2">
                    <div
                      v-for="(color, index) in colorOptions"
                      :key="index"
                      class="w-10 h-10 rounded-full cursor-pointer border-2"
                      :class="newTask.color === color ? 'border-black' : 'border-gray-300'"
                      :style="{ backgroundColor: color }"
                      @click="newTask.color = color"
                    ></div>
                  </div>
                </div>
              </div>
              <!-- Estado y Prioridad -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                  <select
                    v-model="newTask.status"
                    class="form-select w-full px-3 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en-progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Prioridad:</label>
                  <select
                    v-model="newTask.priority"
                    class="form-select w-full px-3 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
              </div>
              <!-- Marcar como Hito -->
              <div class="mt-4">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="newTask.milestone"
                    class="form-checkbox rounded text-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-gray-700 font-medium">Marcar como Hito</span>
                </label>
              </div>
            </div>
            <!-- Columna Derecha: Sección de Comentarios -->
            <div class="w-full md:w-1/2 pl-0 md:pl-4 mt-4 md:mt-0">
              <h3 class="text-lg font-semibold mb-4">Comentarios</h3>
              <div class="h-64 border border-gray-300 rounded-md p-3 overflow-y-auto mb-4">
                <div v-if="newTask.comments && newTask.comments.length">
                  <div
                    v-for="comment in newTask.comments"
                    :key="comment.id"
                    class="mb-2 border-b pb-2"
                  >
                    <p class="text-sm text-gray-700">{{ comment.content }}</p>
                    <small class="text-xs text-gray-500">
                      Por: {{ comment.createdBy.nombre }} · {{ new Date(comment.createdAt).toLocaleString() }}
                    </small>
                  </div>
                </div>
                <div v-else>
                  <p class="text-sm text-gray-500">No hay comentarios aún.</p>
                </div>
              </div>
              <textarea
                v-model="newComment"
                placeholder="Escriba un comentario"
                class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400"
                rows="4"
              ></textarea>
              <button
                type="button"
                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                @click="submitComment"
              >
                Enviar
              </button>
            </div>
          </div>
          <!-- Línea divisoria -->
          <hr class="my-4 border-gray-300">
          <!-- Sección inferior: Subtareas -->
          <div class="w-full">
            <h3 class="text-lg font-medium mb-2">Subtareas</h3>
            <div v-for="(subtask, index) in newTask.subtasks" :key="index" class="flex items-center gap-2 mt-2">
              <input
                type="text"
                v-model="subtask.name"
                placeholder="Nombre de la subtarea"
                class="border border-gray-300 rounded-md p-2 flex-1"
              />
              <input
                type="date"
                v-model="subtask.start"
                class="border border-gray-300 rounded-md p-2"
              />
              <input
                type="number"
                v-model.number="subtask.duration"
                min="1"
                class="border border-gray-300 rounded-md p-2 w-24"
              />
              <button
                type="button"
                @click="removeSubtask(index)"
                class="text-red-500 hover:text-red-700"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
            <button
              type="button"
              @click="addSubtask"
              class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              :disabled="selectedTaskParent !== null"
            >
              Agregar Subtarea
            </button>
          </div>
          <!-- Botones Cancelar/Guardar -->
          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {{ taskModalMode === 'new' ? 'Crear' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Fin Modal -->
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Swal from "sweetalert2";
import { getTasks, createTask, updateTask } from "@/api/task.js";
import { formatLocalDate, calculateEndDate, generateDates } from "@/utils/dateHelper.js";
// Asegúrate de importar tu endpoint de comentarios, por ejemplo:
import { createComment } from '@/api/comments'

export default {
  components: { Navbar, Sidebar },
  data() {
    return {
      sidebarExpanded: false,
      dayWidth: 56,
      weeksToShow: 4,
      tasks: [],
      dates: [],
      dateRange: formatLocalDate(), // Se usa para generar el rango de fechas
      showTaskModal: false,
      taskModalMode: "new",
      newTask: {},
      selectedTask: null,
      selectedTaskParent: null,
      draggingTask: null,
      dragStartX: 0,
      initialTaskStart: null,
      resizingTask: null,
      resizingEdge: null,
      resizingStartX: 0,
      initialTaskStartDate: null,
      initialTaskDuration: 0,
      colorOptions: [
        "#1E3A8A",
        "#4B5563",
        "#D97706",
        "#9333EA",
        "#3B82F6",
        "#6366F1",
        "#8B5CF6",
        "#EC4899"
      ],
      searchQuery: ""
    };
  },
  mounted() {
    this.newTask = this.getDefaultTask();
    this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    this.fetchTasks();
  },
  computed: {
    currentMonthYear() {
      const [year, month] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1);
      const monthName = currentDate.toLocaleDateString("es-ES", { month: "long" });
      return { month: monthName, year: currentDate.getFullYear() };
    },
    filteredTasks() {
      if (!this.searchQuery) return this.tasks;
      return this.tasks.filter(task =>
        task.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    getLocalDate(date = new Date()) {
      return formatLocalDate(date);
    },
    generateDates() {
      this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    },
    formatDate(date) {
      return date.getDate();
    },
    formatWeekday(date) {
      return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
    },
    barStyle(task) {
      const [sy, sm, sd] = this.dateRange.split("-").map(Number);
      const calendarStart = new Date(sy, sm - 1, sd);
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const taskBarStart = Math.floor((taskStart - calendarStart) / (1000 * 60 * 60 * 24));
      const visibleBarStart = Math.max(taskBarStart, 0);
      const visibleBarEnd = Math.min(taskBarStart + task.duration, this.weeksToShow * 7);
      const visibleDays = visibleBarEnd - visibleBarStart;
      if (visibleDays <= 0) return { display: "none" };
      return {
        left: `${visibleBarStart * this.dayWidth}px`,
        width: `${visibleDays * this.dayWidth}px`,
        height: "70%",
        top: "15%"
      };
    },
    progressWidth(task) {
      return `${task.progress}%`;
    },
    pastelColor(color) {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${Math.min(r + 120, 255)}, ${Math.min(g + 120, 255)}, ${Math.min(b + 120, 255)}, 0.4)`;
    },
    milestoneStyle(task) {
      const [sy, sm, sd] = this.dateRange.split("-").map(Number);
      const calendarStart = new Date(sy, sm - 1, sd);
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const offsetDays = Math.floor((taskStart - calendarStart) / (1000 * 60 * 60 * 24));
      const size = 20;
      return {
        position: "absolute",
        left: `${offsetDays * this.dayWidth - size / 2}px`,
        top: "15%",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: task.color,
        transform: "rotate(45deg)"
      };
    },
    openNewTaskModal() {
      this.taskModalMode = "new";
      this.selectedTaskParent = null;
      this.newTask = this.getDefaultTask();
      this.showTaskModal = true;
    },
    openEditTaskModal(task, parent = null) {
      this.taskModalMode = "edit";
      this.selectedTask = task;
      this.selectedTaskParent = parent;
      // Realizar una copia profunda de la tarea para editar (se preservan los id de las subtareas)
      this.newTask = JSON.parse(JSON.stringify(task));
      // Garantizar que exista el arreglo de subtareas
      if (!this.newTask.subtasks) {
        this.newTask.subtasks = [];
      }
      this.showTaskModal = true;
    },
    getDefaultTask() {
      const today = this.getLocalDate();
      return {
        name: "",
        description: "",
        start: today,
        end: today,
        progress: 0,
        status: "pendiente",
        priority: "media",
        color: "#3B82F6",
        milestone: false,
        subtasks: [],
        createdById: null,
        updatedById: null
      };
    },
    calculateEndDate(start, duration) {
      return calculateEndDate(start, duration);
    },
    async fetchTasks() {
      try {
        const tasksFromAPI = await getTasks();
        // Transformar cada tarea (y sus subtasks) para incluir 'start' y 'end'
        const transformTask = (task) => ({
          ...task,
          start: this.getLocalDate(new Date(task.startDate)),
          end: this.getLocalDate(new Date(task.endDate)),
          subtasks: task.subtasks ? task.subtasks.map(t => transformTask(t)) : []
        });
        this.tasks = tasksFromAPI.map(task => transformTask(task));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    async submitTask() {
      if (this.selectedTaskParent) {
        if (new Date(this.newTask.start) < new Date(this.selectedTaskParent.start)) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La fecha de inicio de la subtarea no puede ser menor que la fecha de inicio del padre."
          });
          return;
        }
        if (this.newTask.subtasks && this.newTask.subtasks.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Los hijos no pueden tener subhijos."
          });
          return;
        }
      }

      // Convertir las fechas agregando "T00:00:00" para evitar desfases de zona horaria
      const startDateIso = new Date(`${this.newTask.start}T00:00:00`).toISOString();
      const endDateIso = new Date(`${this.newTask.end}T00:00:00`).toISOString();

      const [sy, sm, sd] = this.newTask.start.split("-").map(Number);
      const startDateObj = new Date(sy, sm - 1, sd);
      const [ey, em, ed] = this.newTask.end.split("-").map(Number);
      const endDateObj = new Date(ey, em - 1, ed);
      const duration = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

      let payload = {
        ...this.newTask,
        duration: duration > 0 ? duration : 1,
        startDate: startDateIso,
        endDate: endDateIso
      };
      delete payload.start;
      delete payload.end;

      // Preparar payload de las subtareas: crear las que son nuevas y actualizar las existentes
      if (payload.subtasks && payload.subtasks.length > 0) {
        const createOps = [];
        const updateOps = [];
        for (const subtask of payload.subtasks) {
          const subtaskPayload = {
            name: subtask.name,
            description: subtask.description || "",
            duration: subtask.duration,
            progress: subtask.progress,
            status: subtask.status,
            priority: subtask.priority,
            color: subtask.color,
            milestone: subtask.milestone,
            startDate: new Date(`${subtask.start}T00:00:00`).toISOString(),
            endDate: new Date(`${this.calculateEndDate(subtask.start, subtask.duration)}T00:00:00`).toISOString(),
            createdById: 1 // Reemplaza con el ID real del usuario
          };
          if (subtask.id) {
            updateOps.push({
              where: { id: subtask.id },
              data: subtaskPayload
            });
          } else {
            createOps.push(subtaskPayload);
          }
        }
        payload.subtasks = {};
        if (createOps.length) payload.subtasks.create = createOps;
        if (updateOps.length) payload.subtasks.update = updateOps;
      }

      console.log("Payload a enviar:", payload);

      try {
        if (this.taskModalMode === "new") {
          payload.createdById = 1; // Reemplaza con el ID real del usuario
          await createTask(payload);
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "El proyecto se ha creado correctamente."
          });
        } else {
          payload.updatedById = 1;
          await updateTask(this.selectedTask.id, payload);
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "El proyecto se ha actualizado correctamente."
          });
        }
        await this.fetchTasks();
        this.generateDates();
        this.closeModal();
      } catch (error) {
        console.error("Error submitting task:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar la tarea. Verifica la consola para más detalles."
        });
      }
    },
    closeModal() {
      this.showTaskModal = false;
      this.newTask = this.getDefaultTask();
    },
    nextWeek() {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1, day);
      currentDate.setDate(currentDate.getDate() + 7);
      this.dateRange = this.getLocalDate(currentDate);
      this.generateDates();
    },
    prevWeek() {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1, day);
      currentDate.setDate(currentDate.getDate() - 7);
      this.dateRange = this.getLocalDate(currentDate);
      this.generateDates();
    },
    goToCurrentWeek() {
      const today = new Date();
      this.dateRange = this.getLocalDate(today);
      this.generateDates();
    },
    getWeekLabel(offset) {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const startDate = new Date(year, month - 1, day);
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + offset * 7);
      const firstJan = new Date(weekDate.getFullYear(), 0, 1);
      return Math.ceil(((weekDate - firstJan) / 86400000 + firstJan.getDay() + 1) / 7);
    },
    startDragging(task, event) {
      this.draggingTask = task;
      this.dragStartX = event.clientX;
      const [year, month, day] = task.start.split("-").map(Number);
      this.initialTaskStart = new Date(year, month - 1, day);
      document.addEventListener("mousemove", this.onDragging);
      document.addEventListener("mouseup", this.stopDragging);
    },
    onDragging(event) {
      if (!this.draggingTask) return;
    },
    startDragging(task, event) {
      this.draggingTask = task;
      this.dragStartX = event.clientX;
      const [year, month, day] = task.start.split("-").map(Number);
      this.initialTaskStart = new Date(year, month - 1, day);
      document.addEventListener("mousemove", this.onDragging);
      document.addEventListener("mouseup", this.stopDragging);
    },
    onDragging(event) {
      if (!this.draggingTask) return;
      const deltaX = event.clientX - this.dragStartX;
      const daysOffset = Math.round(deltaX / this.dayWidth);
      if (daysOffset === 0) return;
      const newDate = new Date(this.initialTaskStart);
      newDate.setDate(newDate.getDate() + daysOffset);
      this.draggingTask.start = this.getLocalDate(newDate);
    },
    stopDragging() {
      if (this.draggingTask) {
        this.draggingTask = null;
        document.removeEventListener("mousemove", this.onDragging);
        document.removeEventListener("mouseup", this.stopDragging);
      }
    },
    startResizing(task, edge, event) {
      event.stopPropagation();
      this.resizingTask = task;
      this.resizingEdge = edge;
      this.resizingStartX = event.clientX;
      const [year, month, day] = task.start.split("-").map(Number);
      this.initialTaskStartDate = new Date(year, month - 1, day);
      this.initialTaskDuration = task.duration;
      document.addEventListener("mousemove", this.onResizing);
      document.addEventListener("mouseup", this.stopResizing);
    },
    onResizing(event) {
      if (!this.resizingTask) return;
      const deltaX = event.clientX - this.resizingStartX;
      const daysOffset = Math.round(deltaX / this.dayWidth);
      if (this.resizingEdge === "start") {
        const newDuration = this.initialTaskDuration - daysOffset;
        if (newDuration < 1) return;
        const newStart = new Date(this.initialTaskStartDate);
        newStart.setDate(newStart.getDate() + daysOffset);
        this.resizingTask.start = this.getLocalDate(newStart);
        this.resizingTask.duration = newDuration;
      } else if (this.resizingEdge === "end") {
        const newDuration = this.initialTaskDuration + daysOffset;
        if (newDuration < 1) return;
        this.resizingTask.duration = newDuration;
      }
    },
    stopResizing() {
      if (this.resizingTask) {
        this.resizingTask = null;
        document.removeEventListener("mousemove", this.onResizing);
        document.removeEventListener("mouseup", this.stopResizing);
      }
    },
    addSubtask() {
      if (this.selectedTaskParent) {
        alert("Los hijos no pueden tener subhijos.");
        return;
      }
      if (!this.newTask.subtasks) {
        this.newTask.subtasks = [];
      }
      const defaultSubtask = {
        name: "",
        start: this.newTask.start,
        duration: 1,
        color: this.newTask.color,
        progress: 0,
        status: "pendiente",
        priority: "media",
        milestone: false,
        subtasks: []
      };
      this.newTask.subtasks.push(defaultSubtask);
    },
    removeSubtask(index) {
      this.newTask.subtasks.splice(index, 1);
    },
    async submitComment() {
      if(!this.newComment.trim()){
        return;
      }
      try {
        // Suponiendo que newTask.id contiene el ID de la tarea actual
        const payload = {
          content: this.newComment,
          taskId: this.newTask.id,
          createdBy: 1 // O el ID del usuario actual
        };
        const response = await createComment(payload);
        // Agregar el nuevo comentario a la lista
        if (!this.newTask.comments) {
          this.newTask.comments = [];
        }
        this.newTask.comments.push(response);
        this.newComment = "";
      } catch(error) {
        console.error("Error al enviar comentario:", error);
      }
    }
  }
};
</script>

<style scoped>
.gantt-container {
  max-width: 95%;
  margin: 0 auto;
  margin-left: 0;
  margin-right: auto;
  max-height: 80vh;
  overflow: hidden;
}

.gantt-grid {
  background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px);
  position: relative;
  /* Replicar líneas verticales cada día (asumiendo que this.dayWidth es el ancho de un día) */
  background-image: linear-gradient(
    to right,
    #e5e7eb 1px,
    transparent 1px
  );
  background-size: calc(var(--day-width, 56px)) 100%;
}

.gantt-bar-wrapper {
  transition: all 0.2s ease;
  z-index: 1;
  display: flex;
  align-items: center;
}

.draggable-area {
  flex: 1;
  height: 100%;
  position: relative;
  cursor: grab;
}

.draggable-area:active {
  cursor: grabbing;
}

.resize-handle {
  width: 8px;
  height: 100%;
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.1);
  cursor: ew-resize;
  z-index: 2;
}

.resize-handle.left {
  left: 0;
}

.resize-handle.right {
  right: 0;
}

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

@media (max-height: 720px) {
  .gantt-container {
    max-height: 70vh;
    padding: 0.5rem;
  }
}

@media (min-height: 1080px) {
  .gantt-container {
    max-height: 85vh;
  }
}

.actividades-container {
  display: flex;
  min-height: 100vh;
}

.content {
  padding: 20px;
  margin-left: 1rem;
  flex: 1;
  background-color: #f9fafb;
  border-radius: 8px;
}
</style>
