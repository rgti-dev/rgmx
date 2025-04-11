<template>
    <div class="actividades-container flex w-full min-h-screen bg-white">
      <Sidebar v-model:isExpanded="sidebarExpanded" />
      <div class="content flex-1 w-full relative transition-all duration-300"
        :style="{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }">
        <Navbar />
        <div class="p-1 md:p-1 mt-10">
          <!-- Controles: búsqueda y navegación -->
          <ControlsPanel :searchQuery="searchQuery" :currentMonthYear="currentMonthYear"
            @search-change="updateSearchQuery" @prev-week="prevWeek" @next-week="nextWeek" @current-week="goToCurrentWeek"
            @open-new-task="openNewTaskModal" />
  
          <!-- Diagrama Gantt -->
          <GanttDiagram :tasks="filteredTasks" :dates="dates" :dayWidth="dayWidth" :weeksToShow="weeksToShow"
            @edit-task="openEditTaskModal" @start-drag="startDragging" @stop-drag="stopDragging"
            @start-resize="startResizing" @stop-resize="stopResizing" />
        </div>
      </div>
  
      <!-- Modal de Tarea -->
      <TaskModal v-if="showTaskModal" :task="taskModalMode === 'new' ? newTask : editedTask" :mode="taskModalMode"
        @submit="submitTask" @close="closeModal" />
    </div>
  </template>
  
  <script>
  import Sidebar from '@/components/Sidebar.vue';
  import Navbar from '@/components/Navbar.vue';
  import ControlsPanel from '@/components/ControlsPanel.vue';
  import GanttDiagram from '@/components/GanttDiagram.vue';
  import TaskModal from '@/components/TaskModal.vue';
  import { getTasks, createTask, updateTask } from '@/api/task.js';
  
  export default {
    components: { Sidebar, Navbar, ControlsPanel, GanttDiagram, TaskModal },
    data() {
      return {
        sidebarExpanded: false,
        dayWidth: 56,
        weeksToShow: 4,
        tasks: [],
        dates: [],
        dateRange: this.getLocalDate(),
        searchQuery: '',
        showTaskModal: false,
        taskModalMode: 'new',
        newTask: {},
        editedTask: null,
      };
    },
    computed: {
      currentMonthYear() {
        const [year, month] = this.dateRange.split("-").map(Number);
        const currentDate = new Date(year, month - 1);
        return {
          month: currentDate.toLocaleDateString("es-ES", { month: "long" }),
          year: currentDate.getFullYear()
        };
      },
      filteredTasks() {
        const query = this.searchQuery.toLowerCase().trim();
        return query ? this.tasks.filter(task => task.name.toLowerCase().includes(query)) : this.tasks;
      }
    },
    methods: {
      startDragging(task, event) {
        console.log("startDragging", task);
        // Aquí implementa la lógica para iniciar el drag, o déjalo vacío si aún no lo necesitas
      },
      stopDragging(task, event) {
        console.log("stopDragging", task);
        // Implementa la lógica para detener el drag
      },
      // Funciones de resize (cambiar tamaño)
      startResizing(task, edge, event) {
        console.log("startResizing", task, edge);
        // Implementa la lógica para iniciar el resize, o déjalo vacío
      },
      stopResizing(task, event) {
        console.log("stopResizing", task);
        // Lógica para finalizar el resize
      },
      getLocalDate(date = new Date()) {
        return date.toISOString().split('T')[0];
      },
      generateDates() {
        const startDate = new Date(...this.dateRange.split("-").map(Number));
        this.dates = Array.from({ length: this.weeksToShow * 7 }, (_, i) => {
          const newDate = new Date(startDate);
          newDate.setDate(startDate.getDate() + i);
          return newDate;
        });
      },
      async fetchTasks() {
        try {
          this.tasks = await getTasks();
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      },
      prevWeek() {
        const currentDate = new Date(this.dateRange);
        currentDate.setDate(currentDate.getDate() - 7);
        this.dateRange = this.getLocalDate(currentDate);
        this.generateDates();
      },
      nextWeek() {
        const currentDate = new Date(this.dateRange);
        currentDate.setDate(currentDate.getDate() + 7);
        this.dateRange = this.getLocalDate(currentDate);
        this.generateDates();
      },
      goToCurrentWeek() {
        this.dateRange = this.getLocalDate();
        this.generateDates();
      },
      updateSearchQuery(value) {
        this.searchQuery = value;
      },
      openNewTaskModal() {
        this.taskModalMode = 'new';
        this.newTask = { name: '', startDate: '', endDate: '' };
        this.showTaskModal = true;
      },
      openEditTaskModal(task) {
        this.taskModalMode = 'edit';
        this.editedTask = { ...task };
        this.showTaskModal = true;
      },
      closeModal() {
        this.showTaskModal = false;
        this.newTask = {};
        this.editedTask = null;
      },
      async submitTask(taskData) {
        try {
          console.log("Datos enviados:", taskData); // ✅ Verifica los datos antes de enviarlos
  
          if (this.taskModalMode === 'new') {
            const response = await createTask(taskData);
            console.log("Respuesta de la API (crear):", response);
          } else {
            const response = await updateTask(this.editedTask.id, taskData);
            console.log("Respuesta de la API (editar):", response);
          }
  
          await this.fetchTasks(); // ✅ Verifica si se actualizan las tareas
          this.generateDates();
          this.closeModal();
        } catch (error) {
          console.error("Error al enviar la tarea:", error);
        }
      }
      ,
    },
    mounted() {
      this.fetchTasks();
      this.generateDates();
    }
  };
  </script>
  
  <style scoped>
  .actividades-container {
    display: flex;
    min-height: 100vh;
  }
  
  .content {
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
  }
  </style>
  