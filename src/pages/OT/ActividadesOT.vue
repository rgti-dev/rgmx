<template>
  <div class="actividades-container flex w-full min-hscreen bg-gray-500">
    <!-- Sidebar -->
    <Sidebar v-model:isExpanded="sidebarExpanded" />

    <!-- Contenido principal -->
    <div class="content flex-1 w-full relative transition-all duration-300"
      :style="{ marginLeft: sidebarExpanded ? '16rem' : '5rem' }">

      <div class="p-1 md:p-1 ml-2">

        <!-- Sección de búsqueda y controles -->
        <div class="mb-4 flex flex-col md:flex-row gap-2 md:space-x-4 items-center bg-white p-3 rounded-lg shadow-sm">
          <!-- Search input with improved styling and filter button inside -->
          <div class="relative flex-grow max-w-md">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <span class="material-icons text-gray-400">search</span>
            </span>
            <input v-model="searchQuery" type="text" placeholder="Buscar celula - proyecto..."
              class="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-gray-50 hover:bg-white" />
            <!-- Filter button inside search bar -->
            <button @click="toggleFilterPanel"
              class="absolute inset-y-0 right-0 px-3 text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <span class="material-icons text-blue-500">filter_list</span>
              <span v-if="isFilterActive" class="ml-1 w-2 h-2 rounded-full bg-blue-500"></span>
            </button>
            <!-- Filter panel positioned justo debajo -->
            <div v-if="showFilters"
              class="absolute z-30 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 right-4 top-16 w-64">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold text-gray-700">Filtros</h3>
                <button @click="toggleFilterPanel" class="text-gray-400 hover:text-gray-600">
                  <span class="material-icons">close</span>
                </button>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Usuario
                  </label>
                  <select v-model="selectedUser"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                    <option value="all">Todos</option>
                    <option v-for="user in filterUsers" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Célula
                  </label>
                  <select v-model="selectedCelula"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                    <option value="all">Todas</option>
                    <option v-for="celula in filterCelulas" :key="celula" :value="celula">
                      {{ celula }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Marca
                  </label>
                  <select v-model="selectedMarca"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                    <option value="all">Todas</option>
                    <option v-for="marca in filterMarcas" :key="marca" :value="marca">
                      {{ marca }}
                    </option>
                  </select>
                </div>

                <div class="pt-2 flex justify-end">
                  <button @click="clearFilters" class="px-3 py-1.5 text-gray-600 hover:text-gray-800 mr-2">
                    Limpiar
                  </button>
                  <button @click="applyFilters" class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Month/Year display with improved styling and notification bell on the left -->
          <div class="flex-grow md:text-right flex items-center justify-end">
            <NotificationBell class="mr-3" />
            <div class="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg shadow-sm">
              <p
                class="text-lg font-medium uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                {{ currentMonthYear.month }} {{ currentMonthYear.year }}
              </p>
            </div>
          </div>
          <!-- Filter panel with improved styling -->

        </div>
        <!-- Fin de la sección de búsqueda y controles -->

        <!-- Diagrama Gantt -->
        <div class="gantt-container bg-white rounded-lg shadow-md p-2 md:p-4 w-full h-full">
          <div class="overflow-x-auto pb-4">
            <div class="inline-block min-w-full">
              <!-- Cabecera de semanas -->
              <div class="border border-gray-200 rounded-t-lg shadow-sm grid grid-cols-5 bg-white overflow-hidden">
                <div
                  class="col-span-1 sticky left-0 bg-white z-20 border-r border-gray-200 flex items-center justify-between p-3">
                  <div class="flex space-x-2">
                    <div class="flex rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <button @click="prevWeek"
                        class="px-2 py-1.5 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center">
                        <span class="material-icons text-sm" title="Semana Anterior">arrow_back</span>
                      </button>
                      <button @click="goToCurrentWeek"
                        class="px-2 py-1.5 bg-white text-teal-600 hover:bg-teal-50 active:bg-teal-100 transition-colors flex items-center justify-center border-l border-r border-gray-200">
                        <span class="material-icons text-sm" title="Semana Actual">today</span>
                      </button>
                      <button @click="nextWeek"
                        class="px-2 py-1.5 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center">
                        <span class="material-icons text-sm" title="Semana Siguiente">arrow_forward</span>
                      </button>
                    </div>

                    <button @click="refreshData"
                      class="px-3 py-1.5 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 active:bg-indigo-100 transition-colors border border-indigo-200 flex items-center justify-center shadow-sm">
                      <span class="material-icons text-sm animate-spin-slow" title="Actualizar">sync</span>
                    </button>

                    <!-- Botón de Nuevo Proyecto con diseño mejorado -->
                    <button @click="openNewTaskModal"
                      class="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md flex items-center justify-center group">
                      <span
                        class="material-icons text-sm mr-1 group-hover:scale-110 transition-transform duration-300">add</span>
                      <span class="text-sm font-medium">Nuevo</span>
                    </button>
                  </div>
                </div>

                <div class="col-span-4 grid grid-cols-4">
                  <div v-for="i in weeksToShow" :key="i"
                    class="text-center py-2 bg-gradient-to-b from-blue-50 to-blue-100 font-medium text-blue-900 border-l border-blue-200 flex flex-col justify-center transition-all hover:from-blue-100 hover:to-blue-200">
                    <span class="text-sm font-semibold">Semana {{ getWeekLabel(i - 1) }}</span>
                    <span class="text-xs text-blue-700 mt-1">{{ getWeekDateRange(i - 1) }}</span>
                  </div>
                </div>
              </div>
              <!-- Cabecera de días -->
              <div class="border-b bg-white shadow-sm grid grid-cols-5" ref="daysGrid">
                <!-- Columna para Proyectos (igual a la de Cronograma) -->
                <div
                  class="font-semibold sticky left-0 bg-white z-20 border-r border-gray-300 px-2 py-1.5 flex items-center project-col">
                  <span class="material-icons mr-2 text-gray-600 text-sm">folder_open</span>
                  <span class="text-sm">Proyectos</span>
                </div>
                <!-- 4 columnas para los días agrupados en semanas -->
                <div class="col-span-4 grid grid-cols-4">
                  <div v-for="weekIndex in weeksToShow" :key="weekIndex" class="flex">
                    <div v-for="n in 7" :key="n" :style="{ width: dayWidth + 'px' }" :class="[
                      'text-center text-sm font-medium border-l border-gray-200 rounded shadow-sm transition-all duration-200',
                      isWeekend(getDayDate(weekIndex, n)) ? 'bg-indigo-100' : 'bg-white',
                      isToday(getDayDate(weekIndex, n)) ? 'bg-teal-500 text-white shadow-md transform scale-105' : ''
                    ]">
                      <div class="text-xs font-semibold py-1" :class="[
                        isWeekend(getDayDate(weekIndex, n)) ? 'text-indigo-700' : 'text-gray-500',
                        isToday(getDayDate(weekIndex, n)) ? 'text-white bg-teal-500' : ''
                      ]">
                        {{ formatWeekday(getDayDate(weekIndex, n)) }}
                      </div>
                      <div class="relative">
                        <div class="text-xs font-medium pb-1" :class="[
                          isWeekend(getDayDate(weekIndex, n)) ? 'text-indigo-800' : 'text-gray-800',
                          isToday(getDayDate(weekIndex, n)) ? 'text-white font-bold bg-teal-500' : ''
                        ]">
                          {{ formatDate(getDayDate(weekIndex, n)) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Envoltura de listado de tareas -->
              <div class="relative overflow-x-auto">
                <!-- Línea del día actual con diseño mejorado -->
                <div v-if="currentDayLeft >= 0 && currentDayLeft <= (weeksToShow * 7 * dayWidth)"
                  class="current-day-line" :style="{ left: (currentDayLeft + 'px') }">
                  <div class="current-day-indicator"></div>
                </div>
                <!-- Lista de tareas del diagrama Gantt -->
                <div v-for="task in displayTasks" :key="task.id + '-' + updateCounter"
                  class="inline-block min-w-full gantt-grid" :style="{ '--day-width': dayWidth + 'px' }">
                  <GanttTaskOT :task="task" @startDragging="startDragging" @startResizing="startResizing"
                    :viewStart="dateRange" :viewDays="weeksToShow * 7" :dayWidth="dayWidth"
                    :projectColumnWidth="projectColumnWidth" :depth="calculatedDepth"
                    @editTask="(task, parent) => openEditTaskModal(task, parent)" class="gantt-task" />
                </div>
              </div>
              <!-- Fin listado de tareas -->
            </div>
          </div>
        </div>
        <!-- Fin Diagrama Gantt -->
      </div>
    </div>
    <div>
      <!-- Replace the modal with the TaskModal component -->
      <TaskModal :show="showTaskModal" :mode="taskModalMode" :task="newTask" @close="closeModal" @submit="submitTask" />
    </div>

  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Swal from "sweetalert2";
import { getTasks, createTask, updateTask } from "@/api/taskOT.js";
import { formatLocalDate, calculateEndDate, generateDates } from "@/utils/dateHelper.js";
import { createComment } from '@/api/comments';
import SubtaskEditor from "@/components/SubtaskEditor.vue";
import GanttTaskOT from "@/components/GanttTaskOT.vue";
import cloneDeep from "lodash.clonedeep";
import TaskModal from "@/components/TaskModal.vue"; // Add this import


export default {
  components: {
    Navbar, Sidebar, SubtaskEditor, GanttTaskOT, TaskModal // Add TaskModal to components
  },
  data() {
    return {
      sidebarExpanded: false,
      dayWidth: 56,
      projectColumnWidth: 200, // valor por defecto
      weeksToShow: 4,
      tasks: [],
      dates: [],
      dateRange: formatLocalDate(), // Fecha de inicio de la vista
      showTaskModal: false,
      taskModalMode: "new",
      newTask: {},
      selectedTask: null,
      selectedTaskParent: null,
      draggingTask: null,
      dragStartX: 0,
      initialTaskStart: null,
      resizingTask: null,
      showFilters: false,
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
      searchQuery: "",
      newComment: "",
      showComments: false,  // Nueva propiedad para controlar la visibilidad de los comentarios
      showProjectInfo: true, // Nueva propiedad para controlar la visibilidad de la información del proyecto (abierto por defecto)
      showSubtasks: false,    // Nueva propiedad para controlar la visibilidad de las subtareas
      updateCounter: 0,
      gridOffset: 0,
      selectedUser: "all", // Nuevo: filtro por usuario ("all" muestra todos)
      selectedCelula: "all",  // nuevo filtro
      selectedMarca: "all",   // nuevo filtro
      // Add these new properties
      filterBackup: {
        user: "all",
        celula: "all",
        marca: "all"
      },
      calculatedDepth: 1
    };
  },
  mounted() {
    this.newTask = this.getDefaultTask();

    // Inicializar con la semana actual (comenzando en lunes)
    const today = new Date();
    const monday = this.adjustToMonday(today);
    this.dateRange = this.getLocalDate(monday);

    this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    this.fetchTasks();

    // Actualización automática cada 2 minutos (120000 ms)
    setInterval(() => {
      this.fetchTasks();
    }, 120000);

    this.updateGridOffset();
    window.addEventListener('resize', this.updateGridOffset);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateGridOffset);
  },
  computed: {
    isFilterActive() {
      return this.selectedUser !== "all" ||
        this.selectedCelula !== "all" ||
        this.selectedMarca !== "all";
    },
    currentMonthYear() {
      const [year, month] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1);
      const monthName = currentDate.toLocaleDateString("es-ES", { month: "long" });
      return { month: monthName, year: currentDate.getFullYear() };
    },
    currentDayLeft() {
      // Get today's date
      const today = new Date();

      // Format both dates to YYYY-MM-DD to eliminate time component issues
      const todayFormatted = this.getLocalDate(today);
      const [tyear, tmonth, tday] = todayFormatted.split("-").map(Number);

      // Get the view start date
      const viewStart = new Date(this.dateRange);
      const viewStartFormatted = this.dateRange;
      const [vyear, vmonth, vday] = viewStartFormatted.split("-").map(Number);

      // Create date objects with the same time (00:00:00)
      const todayDate = new Date(tyear, tmonth - 1, tday, 0, 0, 0);
      const viewStartDate = new Date(vyear, vmonth - 1, vday, 0, 0, 0);

      // Calculate the difference in days
      const diffTime = todayDate.getTime() - viewStartDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Return the position in pixels
      const extraOffset = 372; // Offset for the project column

      return (diffDays * this.dayWidth) + this.gridOffset + extraOffset;
    },

    // Nueva propiedad para formatear la fecha actual para tooltip
    formattedTodayDate() {
      const today = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return today.toLocaleDateString('es-ES', options);
    },

    /*filteredTasks() {
      if (!this.searchQuery) return this.tasks;
      const query = this.searchQuery.toLowerCase();
      return this.tasks.filter(task =>
        task.name.toLowerCase().includes(query) ||
        (task.celula.toLowerCase().includes(query))
      );
    },*/
    sortedTasks() {
      const priorityMap = {
        alta: 3,
        media: 2,
        baja: 1
      };
      return this.tasks.slice().sort((a, b) => {
        const aVal = priorityMap[(a.priority || '').toLowerCase()] || 0;
        const bVal = priorityMap[(b.priority || '').toLowerCase()] || 0;
        return bVal - aVal;
      });
    },
    displayTasks() {
      let tasks = this.tasks;

      // Obtener info del usuario actual (suponiendo que currentUser tiene 'id' y 'role')
      const currentUserStr = localStorage.getItem("currentUser");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      // Filtrado por usuario solo para usuarios que no sean admin
      if (currentUser && currentUser.role !== "admin") {
        tasks = tasks.filter(task => task.createdById === currentUser.id);
      }
      // Si se está filtrando por usuario (para admin) y se ha seleccionado un valor distinto a "all"
      if (this.selectedUser && this.selectedUser !== "all") {
        tasks = tasks.filter(task => String(task.createdById) === String(this.selectedUser));
      }

      // Filtrado por celula
      if (this.selectedCelula && this.selectedCelula !== "all") {
        tasks = tasks.filter(task =>
          task.celula && task.celula.toLowerCase() === this.selectedCelula.toLowerCase()
        );
      }
      // Filtrado por marca
      if (this.selectedMarca && this.selectedMarca !== "all") {
        tasks = tasks.filter(task =>
          task.marca && task.marca.toLowerCase() === this.selectedMarca.toLowerCase()
        );
      }

      // Filtro búsqueda
      if (this.searchQuery) {
        tasks = tasks.filter(task =>
          task.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (task.celula && task.celula.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }
      const priorityMap = { alta: 3, media: 2, baja: 1 };
      return tasks.slice().sort((a, b) => {
        const aVal = priorityMap[(a.priority || '').toLowerCase()] || 0;
        const bVal = priorityMap[(b.priority || '').toLowerCase()] || 0;
        return bVal - aVal;
      });
    },
    // Opcional: lista dinámica de usuarios basados en tareas (para el filtro)
    filterUsers() {
      console.log("Tasks al filtrar usuarios:", this.tasks);
      const userMap = {};
      this.tasks.forEach(task => {
        const userId = task.createdById;
        console.log("task.createdBy para task", task.id, task.createdBy);
        // Verificar si createdBy tiene la propiedad `name` o `nombre`
        const displayName =
          task.createdBy &&
            (task.createdBy.name || task.createdBy.nombre)
            ? task.createdBy.name || task.createdBy.nombre
            : `Usuario ${userId}`;
        userMap[userId] = displayName;
      });
      const users = Object.entries(userMap).map(([id, name]) => ({ id, name }));
      console.log("Usuarios filtrados:", users);
      return users;
    },
    // Computed para opciones únicas de celula
    filterCelulas() {
      const celulas = new Set();
      this.tasks.forEach(task => {
        if (task.celula) celulas.add(task.celula);
      });
      return Array.from(celulas);
    },
    // Computed para opciones únicas de marca
    filterMarcas() {
      const marcas = new Set();
      this.tasks.forEach(task => {
        if (task.marca) marcas.add(task.marca);
      });
      return Array.from(marcas);
    },
  },
  methods: {
    // Add these new methods
    clearFilters() {
      this.selectedUser = "all";
      this.selectedCelula = "all";
      this.selectedMarca = "all";
    },

    applyFilters() {
      // Save current filter state
      this.filterBackup = {
        user: this.selectedUser,
        celula: this.selectedCelula,
        marca: this.selectedMarca
      };

      // Close the filter panel
      this.showFilters = false;

      // Refresh data with new filters
      this.refreshData();
    },

    toggleFilterPanel() {
      this.showFilters = !this.showFilters;

      // If opening the panel, restore previous filter state
      if (this.showFilters) {
        this.selectedUser = this.filterBackup.user;
        this.selectedCelula = this.filterBackup.celula;
        this.selectedMarca = this.filterBackup.marca;
      }
    },
    getCurrentUserId() {
      const currentUserStr = localStorage.getItem("currentUser");
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      return currentUser ? currentUser.id : null;
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
    adjustToMonday(date) {
      // Si es domingo (0) se toma como 7 para el cálculo
      const day = date.getDay();
      const adjustedDay = day === 0 ? 7 : day;
      const diff = 1 - adjustedDay;
      const monday = new Date(date);
      monday.setDate(monday.getDate() + diff);
      return monday;
    },
    getLocalDate(date = new Date()) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const d = date.getDate().toString().padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    generateDates() {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const startDate = new Date(year, month - 1, day);

      this.dates = [];
      for (let i = 0; i < this.weeksToShow * 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        this.dates.push(date);
      }
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
      if (!task) {
        console.error("No task provided to edit");
        return;
      }
      this.taskModalMode = "edit";
      this.selectedTask = task;
      this.selectedTaskParent = parent;
      this.newTask = cloneDeep(task) || this.getDefaultTask();
      if (!this.newTask.subtasks) {
        this.newTask.subtasks = [];
      }
      this.showTaskModal = true;
    },
    getDefaultTask() {
      const today = this.getLocalDate();
      const userId = this.getCurrentUserId();
      return {
        name: "",
        description: "",
        startDate: today,
        endDate: today,
        progress: 0,
        status: "pendiente",
        priority: "media",
        color: "#3B82F6",
        milestone: false,
        completedAt: null, // Nueva propiedad
        subtasks: [
          { name: "ENTREGA DE LISTAS DE MATERIALES", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "ORDEN DE PRODUCCIÓN PARA FABRICACIÓN", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "ENTREGA DE HOJAS DE RUTA, DXF Y PLANOS", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "KICK OFF", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: true, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "ENTREGA DE MATERIALES", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "PRODUCCIÓN", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#FF5733", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "ENTREGA CARPETA OBRA Y/O PACKING LIST Y BAUL", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "C1", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "C2", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "C3", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "DESCARGA", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "MONTAJE", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "APERTURA", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } },
          { name: "CIERRE PROYECTO INDICADORES (Presupuestos)", startDate: new Date(`${today}T00:00:00`).toISOString(), duration: 1, color: "#3B82F6", progress: 0, status: "pendiente", priority: "media", milestone: false, endDate: new Date(`${today}T00:00:00`).toISOString(), createdBy: { connect: { id: userId } } }
        ],
        createdById: userId,
        updatedById: userId
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
        return Promise.resolve(); // Retornar una promesa resuelta para encadenar
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return Promise.reject(error); // Retornar una promesa rechazada para manejar errores
      }
    },
    calculateDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Se añade +1 para incluir el día de inicio en la duración
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    },
    parseISODate(dateStr) {
      if (!dateStr) return "";
      // Si ya contiene "T", se asume que ya está en formato ISO
      if (dateStr.includes("T")) {
        return dateStr;
      }
      // Asegurar que la fecha tenga el formato ISO completo con zona horaria
      return new Date(`${dateStr}T06:00:00.000Z`).toISOString();
    },
    async submitTask(payload) {
      // Validar fechas...
      console.log("Subtasks antes de transformar:", payload.subtasks); // Verifica que existan

      const startDateCandidate = new Date(`${payload.startDate}T06:00:00.000Z`);
      const endDateCandidate = new Date(`${payload.endDate}T06:00:00.000Z`);


      if (isNaN(startDateCandidate.getTime()) || isNaN(endDateCandidate.getTime())) {
        console.error("Formato de fecha incorrecto en payload.startDate o payload.endDate.");
        return;
      }
      const startDateIso = startDateCandidate.toISOString();
      const endDateIso = endDateCandidate.toISOString();
      const [sy, sm, sd] = payload.startDate.split("-").map(Number);
      const startDateObj = new Date(sy, sm - 1, sd);
      const [ey, em, ed] = payload.endDate.split("-").map(Number);
      const endDateObj = new Date(ey, em - 1, ed);
      const duration = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

      payload = {
        ...payload,
        duration: duration > 0 ? duration : this.calculateDuration(payload.startDate, payload.endDate),
        startDate: startDateIso,
        endDate: endDateIso
      };

      // Asignar completedAt según el status de la tarea
      if (payload.status === "completada") {
        // Si la tarea se marca como completada y aún no tiene completedAt, se guarda la fecha actual
        if (!payload.completedAt) {
          payload.completedAt = new Date().toISOString();
        }
      } else {
        // Si no está completada, nos aseguramos que completedAt quede nulo
        payload.completedAt = null;
      }

      // Transformar subtasks, forzando el ISO en startDate y endDate
      if (payload.subtasks && payload.subtasks.create && payload.subtasks.create.length > 0) {
        // Arrays para almacenar operaciones de creación y actualización
        const createOps = [];
        const updateOps = [];

        // Iteramos cada subtarea en payload.subtasks.create (y no en payload.subtasks)
        for (const subtask of payload.subtasks.create) {
          // Creamos un objeto nuevo con las propiedades requeridas
          const newSubtask = {
            name: subtask.name, // Nombre de la subtarea
            description: subtask.description || "", // Descripción (por defecto cadena vacía)
            duration: this.calculateDuration(subtask.startDate, subtask.endDate), // Duración en días
            progress: subtask.progress, // Progreso de la subtarea
            status: subtask.status, // Estado (por ejemplo, "pendiente")
            priority: subtask.priority, // Prioridad
            color: subtask.color, // Se usa el valor de subtask.color sin comillas
            milestone: subtask.milestone, // Bandera de hito
            // Se transforma startDate a formato ISO forzando la hora 06:00:00.000Z
            startDate: new Date(`${subtask.startDate}T06:00:00.000Z`).toISOString(),
            // Se transforma endDate a formato ISO forzando la hora 06:00:00.000Z
            endDate: new Date(`${subtask.endDate}T06:00:00.000Z`).toISOString(),
            // Asignar completedAt para la subtarea si aplica:
            completedAt: subtask.status === "completada" ? (subtask.completedAt || new Date().toISOString()) : null,
            // Se establece la relación con el creador (usando el ID 1)
            createdBy: { connect: { id: this.getCurrentUserId() } }
          };

          console.log("Subtarea a enviar:", newSubtask);

          // Si la subtarea tiene ID, se considera una actualización
          if (subtask.id) {
            updateOps.push({
              where: { id: subtask.id },
              data: newSubtask
            });
          } else {
            // En caso contrario, se agrega a las operaciones de creación
            createOps.push(newSubtask);
          }
        }

        // Reemplazamos la propiedad subtasks en el payload con un objeto que contenga las operaciones
        payload.subtasks = {};
        if (createOps.length) payload.subtasks.create = createOps;
        if (updateOps.length) payload.subtasks.update = updateOps;
      }

      const userId = this.getCurrentUserId();
      try {
        if (this.taskModalMode === "new") {
          payload.createdById = userId; // Asigna el id del usuario actual
          await createTask(payload);
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "El proyecto se ha creado correctamente."
          });
        } else {
          payload.updatedById = userId;
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
        console.log("Payload:", error.config.data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar la tarea. Verifica la consola para más detalles."
        });
      }
    },
    openOutlookEmail(payload) {
      // Construir el subject y body del correo
      const subject = encodeURIComponent("Nuevo proyecto: " + payload.name);
      const body = encodeURIComponent(
        "Proyecto: " + payload.name + "\n" +
        "Fecha de inicio: " + payload.startDate + "\n" +
        "Fecha de fin: " + payload.endDate
      );
      // Abre el cliente de correo (Outlook o el predeterminado) mediante mailto
      window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
    },
    closeModal() {
      this.showTaskModal = false;
      this.newTask = this.getDefaultTask();
    },
    nextWeek() {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1, day);
      currentDate.setDate(currentDate.getDate() + 7);
      // Aseguramos que sea lunes
      const monday = this.adjustToMonday(currentDate);
      this.dateRange = this.getLocalDate(monday);
      this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    },
    prevWeek() {
      const [year, month, day] = this.dateRange.split("-").map(Number);
      const currentDate = new Date(year, month - 1, day);
      currentDate.setDate(currentDate.getDate() - 7);
      // Aseguramos que sea lunes
      const monday = this.adjustToMonday(currentDate);
      this.dateRange = this.getLocalDate(monday);
      this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    },
    goToCurrentWeek() {
      const today = new Date();
      // Aseguramos que sea lunes
      const monday = this.adjustToMonday(today);
      this.dateRange = this.getLocalDate(monday);
      this.dates = generateDates(this.dateRange, this.weeksToShow * 7);
    },
    adjustToMonday(date) {
      const day = date.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
      // Si no es lunes, ajustamos al lunes de la semana actual
      if (day !== 1) {
        const diff = day === 0 ? -6 : 1 - day; // Si es domingo, retrocedemos 6 días
        date.setDate(date.getDate() + diff);
      }
      return date;
    },
    getWeekLabel(offset) {
      // Partimos de la fecha base (que se ha ajustado a lunes)
      const baseDate = new Date(this.dateRange);
      baseDate.setDate(baseDate.getDate() + offset * 7);
      return this.getISOWeekNumber(baseDate);
    },
    getISOWeekNumber(date) {
      // Implementación correcta del cálculo de número de semana ISO
      const target = new Date(date);
      const dayNum = target.getUTCDay() || 7;
      target.setUTCDate(target.getUTCDate() + 4 - dayNum);
      const firstDayOfYear = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
      const weekNum = Math.ceil((((target - firstDayOfYear) / 86400000) + 1) / 7);
      return weekNum;
    },
    getWeekDateRange(weekOffset) {
      // Obtener la fecha de inicio de la semana (lunes)
      const startDate = new Date(this.dateRange);
      startDate.setDate(startDate.getDate() + (weekOffset * 7));

      // Obtener la fecha de fin de la semana (domingo)
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      // Formatear las fechas en formato corto
      const startFormatted = (startDate.getDate() + 1) + '/' + (startDate.getMonth() + 1);
      const endFormatted = (endDate.getDate() + 1) + '/' + (endDate.getMonth() + 1);

      this.weekDateRange = `${startFormatted} - ${endFormatted}`;
      return this.weekDateRange;
    },
    isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6; // 0 es domingo, 6 es sábado
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
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
      if (!this.newComment.trim()) {
        return;
      }
      try {
        // Obtener el usuario actual del localStorage
        const currentUserStr = localStorage.getItem("currentUser");
        let userId = 1; // Valor por defecto en caso de no encontrarlo
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          userId = currentUser.id;
        }

        // Suponiendo que newTask.id contiene el ID de la tarea actual
        const payload = {
          content: this.newComment,
          taskId: this.newTask.id,
          createdBy: userId  // Se envía el ID del usuario en sesión
        };
        const response = await createComment(payload);
        // Agregar el nuevo comentario a la lista
        if (!this.newTask.comments) {
          this.newTask.comments = [];
        }
        this.newTask.comments.push(response);

        console.log("Comentario enviado:", response);
        console.log("Comentarios actuales:", this.newTask.comments);
        this.newComment = "";
      } catch (error) {
        console.error("Error al enviar comentario:", error);
      }
    },
    // Nuevo método para refrescar los datos manualmente
    refreshData() {
      this.fetchTasks()
        .then(() => {
          // Incrementa el contador para forzar el re-renderizado de las barras
          this.updateCounter++;
          this.showToast('Datos actualizados correctamente', 'success');
        })
        .catch(error => {
          this.showToast('Error al actualizar datos', 'error');
          console.error("Error al actualizar datos:", error);
        });
    },

    // Método para mostrar toast
    showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md text-white z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
      toast.textContent = message;
      document.body.appendChild(toast);

      // Animación de entrada
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = 'all 0.3s ease';

      setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      }, 10);

      // Eliminar después de 3 segundos
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';

        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    },
    updateDependentSubtasks(parentTask) {
      // Implementa la lógica según tus requerimientos.
      // Por ahora, se deja vacío para evitar el error.
    },
    updateGridOffset() {
      if (this.$refs.daysGrid) {
        // Actualizamos el offset y obtenemos el contenedor de las 4 columnas de días
        const daysContainer = this.$refs.daysGrid.querySelector('.grid-cols-4');
        if (daysContainer) {
          const containerWidth = daysContainer.getBoundingClientRect().width;
          // Se distribuye el ancho entre todas las celdas de días (weeksToShow * 7)
          this.dayWidth = containerWidth / (this.weeksToShow * 7);
        }
        // También obtenemos el ancho de la columna de "Cronograma/Proyectos" (la celda sticky)
        const projectCol = this.$refs.daysGrid.querySelector('.project-col');
        if (projectCol) {
          this.projectColumnWidth = projectCol.getBoundingClientRect().width;
        }
      }
    },
    getDayDate(weekIndex, dayInWeek) {
      const index = (weekIndex - 1) * 7 + (dayInWeek - 1);
      // Retorna la fecha si existe, o la fecha de inicio por defecto si no
      return this.dates[index] || new Date(this.dateRange);
    },
    toggleFilterPanel() {
      // Por ejemplo, podrías usar una propiedad booleana `showFilters`
      this.showFilters = !this.showFilters;
    }
  }
};
</script>

<style scoped>
.gantt-container {
  width: 99%;
  margin: 0 auto;
  height: 100vh;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.gantt-grid {
  position: relative;
  background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px);
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

/* Estilos adicionales para el nuevo diseño del modal */
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
  padding: 1px;
  margin-left: 1rem;
  flex: 1;
  border-radius: 8px;
}

.current-day-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(236, 72, 153, 1), rgba(236, 72, 153, 0.6));
  z-index: 25;
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.5);
}

.current-day-indicator {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background-color: #ec4899;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.8);
  z-index: 26;
}


/* Add this new animation for the refresh button */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow:hover {
  animation: spin-slow 1.5s linear infinite;
}

.current-day-line::before {
  content: " ";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
  background-color: #ff3333;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.current-day-line::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: #ff3333;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
  z-index: 16;
}

/* Add these new styles */
.filter-panel-enter-active,
.filter-panel-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.filter-panel-enter-from,
.filter-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Improved button hover effects */
button:hover .material-icons {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
