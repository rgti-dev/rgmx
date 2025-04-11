<template>
  <div style="position: relative;">
    <!-- Se remueve la línea roja; ahora se renderiza desde ActividadesOt.vue -->

    <!-- Tarea principal -->
    <!-- Tarea principal -->
    <div class="task-container flex h-12 items-center relative hover:bg-gray-50 transition-colors duration-200 group"
      style="border-bottom: 1px solid #e5e7eb;">
      <!-- Nombre de la tarea sin tooltip -->
      <div
        class="task-name-card text-sm text-gray-800 cursor-pointer sticky left-0 bg-white z-20 px-20 py-2 rounded items-center shadow-2xl"
        @click="$emit('editTask', task, parentTask)"
        :style="{ width: projectColumnWidth + 'px', marginLeft: depth > 0 ? (depth * 5) + 'px' : '0px' }"
        :title="task.name">
        <!-- Toggle button para mostrar/ocultar subtareas -->
        <span v-if="task.subtasks && task.subtasks.length" class="toggle-subtasks-btn material-icons mr-2"
          @click.stop="toggleSubtasks" :class="{ 'rotated': showSubtasksExpanded }">
          expand_more
        </span>

        <!-- indicadores de estado con animaciones mejoradas -->
        <span v-if="isCompleted(task)" class="material-icons mr-2 text-green-500 animate-bounce-subtle"
          style="font-size:16px;">
          check_circle
        </span>
        <span v-else-if="isInProgress(task)" class="material-icons mr-2 text-blue-500 " style="font-size:16px;">
          pending
        </span>
        <span v-else-if="isOnPending(task)" class="material-icons mr-2 text-orange-500 " style="font-size:16px;">
          info
        </span>
        <span v-else-if="isDelayed(task)" class="material-icons mr-2 text-red-500 " style="font-size:16px;">
          warning
        </span>

        <span v-if="task.celula" class="text-xs text-gray-700 mr-1 font-bold">
          {{ task.celula + ' - ' }}
        </span>
        {{ task.name }}
      </div>
      <!-- Contenedor de barras sin indentado -->
      <div class="flex-1 h-full relative" :style="{ marginLeft: depth > 0 ? `-${depth * 10}px` : '0px' }">
        <div v-if="task.milestone" class="milestone transform hover:scale-110 transition-transform duration-200"
          :style="milestoneStyle(task)">
          <div class="milestone-label absolute whitespace-nowrap text-xs font-medium"
            :style="{ top: '20px', left: '15px', color: task.color }">
            {{ task.name }}
          </div>
        </div>
        <!-- Barra principal sin tooltip y sin barra de progreso -->
        <div v-else class="gantt-bar-wrapper absolute" :class="{ 'task-in-progress': isInProgress(task) }"
          :style="barStyle(task)">
          <div class="resize-handle left" @mousedown.stop="startResizing(task, 'start', $event)"></div>
          <div class="draggable-area" @mousedown="startDragging(task, $event)"
            @dblclick="$emit('editTask', task, parentTask)">
            <div
              class="bar-full absolute inset-0 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg"
              :style="{ backgroundColor: mainBarColor(task) }">
              <div v-if="task.progress !== undefined" class="progress-bar">
                <div class="progress-fill" :style="{ width: `${task.progress}%` }"></div>

              </div>
              <div class="absolute top-0 right-2 text-xs font-medium text-white"
                style="text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                {{ task.duration }}d
              </div>
            </div>
            <!-- Renderizado de subtareas - Ahora usando sortedSubtasks -->
            <template v-if="task.subtasks && task.subtasks.length && task.status !== 'pendiente'">
              <div v-for="sub in sortedSubtasks" :key="sub.id">
                <!-- Si la subtask es "KICK OFF", la mostramos como milestone -->
                <div v-if="sub.name.toUpperCase() === 'KICK OFF'"
                  class="milestone transform hover:scale-110 transition-transform duration-200"
                  :style="getMilestoneStyle(sub, task)" @mouseenter="showTooltip(sub, $event)"
                  @mouseleave="hideTooltip">
                  <div class="absolute right-1 bottom-1 text-xs font-medium hidden">
                    <span v-if="isCompleted(sub) && !isDelayed(sub)" class="material-icons text-green-700"
                      style="font-size:14px;">check_circle</span>
                    <span v-else-if="isCompleted(sub) && isDelayed(sub)" class="material-icons text-orange-400"
                      style="font-size:14px;">info</span>
                    <span v-else-if="isInProgress(sub)" class="material-icons text-blue-400"
                      style="font-size:14px;">pending</span>
                    <span v-else-if="isDelayed(sub)" class="material-icons text-red-700"
                      style="font-size:14px;">warning</span>
                  </div>
                </div>
                <!-- Caso contrario, se renderizan como subtasks normales -->
                <div v-else class="subtask-segment absolute cursor-pointer"
                  :class="{ 'subtask-in-progress': isInProgress(sub) }" :style="getSubtaskStyle(sub, task)"
                  @mouseenter="showTooltip(sub, $event)" @mouseleave="hideTooltip">
                  <span v-if="getSubtaskAbbreviation(sub.name)" class="subtask-abbreviation">{{
                    getSubtaskAbbreviation(sub.name) }}</span>
                  <span class="hidden" style="font-size: 7px;">{{ sub.name }}</span>
                  <div class="subtask-indicator" :style="{ backgroundColor: getStatusColor(sub) }"></div>
                  <div class="absolute right-1 bottom-1 text-xs font-medium status-icon-container">
                    <span v-if="isCompleted(sub) && !isDelayed(sub)" class="material-icons text-green-700"
                      style="font-size:14px;">check_circle</span>
                    <span v-else-if="isCompleted(sub) && isDelayed(sub)" class="material-icons text-orange-400"
                      style="font-size:14px;">info</span>
                    <span v-else-if="isInProgress(sub)" class="material-icons text-blue-400"
                      style="font-size:14px;">pending</span>
                    <span v-else-if="isDelayed(sub)" class="material-icons text-red-700"
                      style="font-size:14px;">warning</span>
                  </div>
                  <div v-if="isDelayed(sub)" class="subtask-delay-indicator">
                    <div class="delay-arrow"></div>
                    <div class="delay-days-badge">{{ calculateDelayDays(sub) }}d</div>
                  </div>
                </div>
              </div>
            </template>
          </div> <!-- Cierre del draggable-area -->
          <div class="resize-handle right" @mousedown.stop="startResizing(task, 'end', $event)"></div>
        </div> <!-- Cierre del gantt-bar-wrapper -->
        <div v-if="activeTooltip" class="subtask-tooltip" :style="tooltipStyle">
          <div class="tooltip-title">{{ activeTooltip.name }}</div>
          <div class="tooltip-info">
            <div>
              <span class="tooltip-label">Estado:</span>
              {{ activeTooltip.status === 'en-progreso' ? 'En Progreso' : activeTooltip.status === 'completada' ?
                'Completado' :
                'Pendiente' }}
            </div>
            <div>
              <span class="tooltip-label">Duración:</span> {{ activeTooltip.duration }} días
            </div>
            <!-- Nuevo apartado: Duración real -->
            <div v-if="calculateRealDuration(activeTooltip) !== null">
              <span class="tooltip-label">Duración real:</span>
              <span :style="getRealDurationStyle(activeTooltip)">
                {{ calculateRealDuration(activeTooltip) }} días
              </span>
            </div>
            <div v-if="isDelayed(activeTooltip)" class="tooltip-delay">
              <span class="tooltip-label">Retraso:</span> {{ calculateDelayDays(activeTooltip) }} días
            </div>
            <div v-if="activeTooltip.progress !== undefined" class="hidden">
              <span class="tooltip-label">Progreso:</span> {{ activeTooltip.progress }}%
            </div>
          </div>
        </div>
      </div>
      <div v-if="isDelayed(task)" class="bar-delayed" :style="delayedBarStyle(task)">
        <span class="delay-counter">{{ calculateDelayDays(task) }} d</span>
      </div>
    </div>

    <!-- Subtareas expandidas -->
    <div v-if="showSubtasksExpanded && task.subtasks && task.subtasks.length" class="expanded-subtasks">
      <div v-for="(subtask, index) in sortedSubtasks" :key="subtask.id" class="subtask-row">
        <div class="subtask-name-card text-xs text-gray-700 sticky left-0 bg-white z-20 px-20 py-2 rounded"
          :style="{ width: projectColumnWidth + 'px', marginLeft: (depth + 1) * 5 + 'px', marginTop: '2px' }">
          <!-- Indicadores de estado para subtareas -->
          <span v-if="isCompleted(subtask)" class="material-icons mr-1 text-green-500" style="font-size:14px;">
            check_circle
          </span>
          <span v-else-if="isInProgress(subtask)" class="material-icons mr-1 text-blue-500" style="font-size:14px;">
            pending
          </span>
          <span v-else-if="isDelayed(subtask)" class="material-icons mr-1 text-red-500" style="font-size:14px;">
            warning
          </span>
          {{ subtask.name }}
        </div>

        <div class="flex-1 h-full relative">
          <template v-if="subtask.name.toUpperCase() === 'KICK OFF'">
            <!-- Renderizamos el KICK OFF como hito fijo en el expanded -->
            <div class="milestone expanded-kickoff" :style="getExpandedKickoffStyle(subtask, task)"
              @mouseenter="showTooltip(subtask, $event)" @mouseleave="hideTooltip">
              <div class="milestone-label absolute whitespace-nowrap text-xs font-medium"
                :style="{ top: '20px', left: '15px', color: subtask.color || task.color }"></div>
            </div>
          </template>
          <template v-else>
            <!-- Barra de Gantt para la subtarea con nombre abreviado -->
            <div class="subtask-expanded-bar absolute" :style="getSubtaskExpandedStyle(subtask, task)">
              <div class="subtask-expanded-fill" :style="{ backgroundColor: getStatusColor(subtask) }"
                @mouseenter="showTooltip(subtask, $event)" @mouseleave="hideTooltip"></div>
              <!-- Mostrar el nombre abreviado -->
              <span class="subtask-abbreviation-expanded">
                {{ getSubtaskAbbreviation(subtask.name) }}
              </span>

              <div class="subtask-duration">{{ subtask.duration }}d</div>
              <div v-if="isDelayed(subtask)" class="subtask-expanded-delay">
                <span class="delay-days">+{{ calculateDelayDays(subtask) }}d</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GanttTaskOT",
  props: {
    task: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    parentTask: Object,
    viewStart: { type: String, required: true },
    viewDays: { type: Number, default: 7 },
    dayWidth: { type: Number, default: 56 },
    projectColumnWidth: { type: Number, default: 202 }
  },
  data() {
    return {
      activeTooltip: null,
      tooltipStyle: {
        top: '0px',
        left: '0px'
      },
      showSubtasksExpanded: false,
      // Orden predefinido para las subtareas
      subtaskOrder: [
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
      ]
    };
  },
  computed: {
    currentDayLeft() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [sy, sm, sd] = this.viewStart.split("-").map(Number);
      const startDate = new Date(sy, sm - 1, sd);
      startDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

      console.log('currentDayLeft', diffDays * this.dayWidth);
      return diffDays * this.dayWidth;
    },

    // Nueva propiedad computada para ordenar las subtareas
    sortedSubtasks() {
      if (!this.task.subtasks || !this.task.subtasks.length) {
        return [];
      }

      return [...this.task.subtasks].sort((a, b) => {
        const indexA = this.subtaskOrder.indexOf(a.name.toUpperCase());
        const indexB = this.subtaskOrder.indexOf(b.name.toUpperCase());

        // Si ambas tareas están en la lista de orden, ordenar según la lista
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // Si solo una está en la lista, esa va primero
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Si ninguna está en la lista, mantener el orden original
        return 0;
      });
    }
  },
  methods: {
    showTooltip(subtask, event) {
      event.stopPropagation();
      this.activeTooltip = subtask;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const tooltipWidth = 250;
      const tooltipHeight = 120;
      let left = event.clientX + 15;
      let top = event.clientY - 10;
      if (left + tooltipWidth > viewportWidth) {
        left = event.clientX - tooltipWidth - 10;
      }
      if (top + tooltipHeight > viewportHeight) {
        top = event.clientY - tooltipHeight - 10;
      }
      this.tooltipStyle = {
        position: 'fixed',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10000,
        pointerEvents: 'none'
      };
      this.$nextTick(() => {
        const tooltipElement = document.querySelector('.subtask-tooltip');
        if (tooltipElement) {
          tooltipElement.style.display = 'block';
        }
      });
    },
    hideTooltip() {
      setTimeout(() => {
        this.activeTooltip = null;
      }, 100);
    },
    barStyle(task) {
      const [sy, sm, sd] = this.viewStart.split("-").map(Number);
      const calendarStart = new Date(sy, sm - 1, sd);
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const taskBarStart = Math.floor((taskStart - calendarStart) / (1000 * 60 * 60 * 24));
      const visibleBarStart = Math.max(taskBarStart, 0);
      const visibleBarEnd = Math.min(taskBarStart + task.duration, this.viewDays);
      const visibleDays = visibleBarEnd - visibleBarStart;
      if (visibleDays <= 0) return { display: "none" };
      return {
        left: `${visibleBarStart * this.dayWidth}px`,
        width: `${visibleDays * this.dayWidth}px`,
        height: "75%",
        top: "15%"
      };
    },
    milestoneStyle(task) {
      return {
        left: "0px",
        top: "15%",
        width: "20px",
        height: "20px",
        backgroundColor: task.color,
        transform: "rotate(45deg)"
      };
    },
    mainBarColor(task) {
      if (task.status === "pendiente") {
        return "#dc2626";
      } else if (task.status && task.status.toLowerCase().includes("complet")) {
        return "#16a34a";
      } else if (task.status === "En Progreso" || task.status === "en-progreso") {
        return task.color;
      }
      return task.color;
    },
    isCompleted(task) {
      return task.status && task.status.toLowerCase().includes("complet");
    },
    startResizing(task, edge, event) {
      this.$emit('startResizing', task, edge, event);
    },
    startDragging(task, event) {
      this.$emit('startDragging', task, event);
    },
    delayedBarStyle(task) {
      const effectiveDate = (this.isCompleted(task) && task.completedAt)
        ? new Date(task.completedAt)
        : new Date();
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const plannedFinish = new Date(taskStart);
      plannedFinish.setDate(plannedFinish.getDate() + task.duration);
      if (effectiveDate <= plannedFinish) return { display: "none" };
      const delayDays = Math.ceil((effectiveDate - plannedFinish) / (1000 * 60 * 60 * 24));
      return {
        left: "0px",
        width: `${delayDays * this.dayWidth}px`,
        height: "70%",
        top: "15%",
        backgroundColor: "rgba(220,38,38,0.3)",
        position: "absolute"
      };
    },
    calculateDelayDays(task) {
      const effectiveDate = (this.isCompleted(task) && task.completedAt)
        ? new Date(task.completedAt)
        : new Date();
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const plannedFinish = new Date(taskStart);
      plannedFinish.setDate(plannedFinish.getDate() + task.duration);
      if (effectiveDate <= plannedFinish) return 0;
      return Math.ceil((effectiveDate - plannedFinish) / (1000 * 60 * 60 * 24));
    },
    isInProgress(task) {
      return task.status === "En Progreso" || task.status === "en-progreso";
    },
    isOnPending(task) {
      return task.status === "Pendiente" || task.status === "pendiente";
    },
    isDelayed(task) {
      if (this.isCompleted(task)) {
        if (!task.completedAt) return false;
        const completedDate = new Date(task.completedAt);
        const [ty, tm, td] = task.start.split("-").map(Number);
        const taskStart = new Date(ty, tm - 1, td);
        const plannedFinish = new Date(taskStart);
        plannedFinish.setDate(plannedFinish.getDate() + task.duration);
        return completedDate > plannedFinish;
      }
      const today = new Date();
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const finish = new Date(taskStart);
      finish.setDate(finish.getDate() + task.duration);
      return today > finish;
    },
    getSubtaskStyle(subtask, parentTask) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const calendarStart = new Date(this.viewStart);
      const parentStart = new Date(parentTask.start);
      const parentTaskBarStart = Math.floor((parentStart - calendarStart) / MS_PER_DAY);
      const parentVisibleStart = Math.max(parentTaskBarStart, 0);
      const subtaskStart = new Date(subtask.start);
      const subtaskCalendarOffset = Math.floor((subtaskStart - calendarStart) / MS_PER_DAY);
      const subtaskEndOffset = subtaskCalendarOffset + subtask.duration;

      const visibleSubLeft = Math.max(subtaskCalendarOffset, parentVisibleStart);
      const visibleSubRight = Math.min(subtaskEndOffset, this.viewDays);
      if (visibleSubRight <= visibleSubLeft) {
        return { display: "none" };
      }
      const relativeLeft = visibleSubLeft - parentVisibleStart;
      const visibleDays = visibleSubRight - visibleSubLeft;
      const baseColor = this.lightenColor(subtask.color || parentTask.color, 10);
      const borderColor = this.getStatusColor(subtask);
      const isDelayedCompletion = this.isCompleted(subtask) && this.isDelayed(subtask);
      const borderStyle = `3px solid ${borderColor}`;
      return {
        left: `${relativeLeft * this.dayWidth}px`,
        width: `${visibleDays * this.dayWidth}px`,
        top: "15%",
        height: "70%",
        backgroundColor: baseColor,
        opacity: "0.9",
      };
    },
    getStatusColor(task) {
      if (this.isCompleted(task)) {
        return '#16a34a';
      } else if (this.isDelayed(task)) {
        return '#dc2626';
      } else if (this.isInProgress(task)) {
        return '#3b82f6';
      }
      return '#9ca3af';
    },
    getTextColor(task) {
      const baseColor = task.color || '#6b7280';
      const r = parseInt(baseColor.slice(1, 3), 16);
      const g = parseInt(baseColor.slice(3, 5), 16);
      const b = parseInt(baseColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125 ? '#000000' : '#ffffff';
    },
    lightenColor(color, percent) {
      let hex = color.replace(/^#/, '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const num = parseInt(hex, 16);
      const amt = Math.round(2.55 * percent);
      let R = (num >> 16) + amt;
      let G = (num >> 8 & 0x00FF) + amt;
      let B = (num & 0x0000FF) + amt;
      R = R < 255 ? (R < 0 ? 0 : R) : 255;
      G = G < 255 ? (G < 0 ? 0 : G) : 255;
      B = B < 255 ? (B < 0 ? 0 : B) : 255;
      return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    },
    calculateRealDuration(task) {
      if (!task.completedAt) return null;
      const start = new Date(task.start);
      const completed = new Date(task.completedAt);
      const diffTime = completed - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    getRealDurationStyle(task) {
      const real = this.calculateRealDuration(task);
      if (real === null) return {};
      if (real > task.duration) return { color: 'red' };
      else if (real < task.duration) return { color: 'green' };
      else return {}; // Sin cambio
    },
    // Función actualizada para calcular el estilo de un hito en una subtarea (por ejemplo, "KICK OFF")
    getMilestoneStyle(task, parentTask) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const calendarStart = new Date(this.viewStart);
      const parentStart = new Date(parentTask.start);
      // Offset en días del inicio del proyecto (padre)
      const parentTaskBarStart = Math.floor((parentStart - calendarStart) / MS_PER_DAY);
      const parentVisibleStart = Math.max(parentTaskBarStart, 0);
      // Calcula el offset en días de la fecha del hito
      const milestoneDate = new Date(task.start);
      const milestoneCalendarOffset = Math.floor((milestoneDate - calendarStart) / MS_PER_DAY);
      // Consideramos que el hito ocupa 1 día
      const milestoneEndOffset = milestoneCalendarOffset + 1;

      // Calcula el rango visible para el hito
      //const visibleMilestoneLeft = Math.max(milestoneCalendarOffset, parentVisibleStart);
      //const visibleMilestoneRight = Math.min(milestoneEndOffset, parentVisibleStart + this.viewDays);


      const visibleMilestoneLeft = Math.max(milestoneCalendarOffset, parentVisibleStart);
      const visibleMilestoneRight = Math.min(milestoneEndOffset, this.viewDays);
      // Si el rango es 0 o negativo, se oculta el hito
      if (visibleMilestoneRight <= visibleMilestoneLeft) {
        return { display: "none" };
      }

      const relativeLeft = visibleMilestoneLeft - parentVisibleStart;
      const leftPosition = relativeLeft * this.dayWidth;

      return {
        left: `${leftPosition + 10}px`,
        width: "25px",
        height: "25px",
        top: "15%",
        backgroundColor: task.color || parentTask.color,
        transform: "rotate(45deg)",
        position: "absolute"
      };
    },
    getSubtaskAbbreviation(name) {
      const abbreviations = {
        "ENTREGA DE LISTAS DE MATERIALES": "LM",
        "ORDEN DE PRODUCCIÓN PARA FABRICACIÓN": "OP",
        "ENTREGA DE HOJAS DE RUTA, DXF Y PLANOS": "HR/DP",
        "ENTREGA DE MATERIALES": "EM",
        "PRODUCCIÓN": "PRODUCCIÓN",
        "ENTREGA CARPETA OBRA Y/O PACKING LIST Y BAUL": "CO/PL",
        "C1": "C1",
        "C2": "C2",
        "C3": "C3",
        "DESCARGA": "DESCARGA",
        "MONTAJE": "MONTAJE",
        "APERTURA": "APERTURA",
        "CIERRE PROYECTO INDICADORES (Presupuestos)": "PI"
      };
      return abbreviations[name] || name;
    },
    // Add new method to toggle subtasks visibility
    toggleSubtasks(event) {
      event.stopPropagation();
      this.showSubtasksExpanded = !this.showSubtasksExpanded;
    },

    // New method for expanded subtask bar style
    getSubtaskExpandedStyle(subtask, parentTask) {
      const MS_PER_DAY = 1000 * 60 * 60 * 24;
      const calendarStart = new Date(this.viewStart);
      const subtaskStart = new Date(subtask.start);
      const subtaskCalendarOffset = Math.floor((subtaskStart - calendarStart) / MS_PER_DAY);
      const subtaskEndOffset = subtaskCalendarOffset + subtask.duration;

      const visibleSubLeft = Math.max(subtaskCalendarOffset, 0);
      const visibleSubRight = Math.min(subtaskEndOffset, this.viewDays);

      if (visibleSubRight <= visibleSubLeft) {
        return { display: "none" };
      }

      const visibleDays = visibleSubRight - visibleSubLeft;

      return {
        left: `${visibleSubLeft * this.dayWidth - 12}px`,
        width: `${visibleDays * this.dayWidth}px`,
        height: "70%",
        top: "15%",
      };
    },

    getExpandedKickoffStyle(subtask, task) {
      // Obtén el estilo original del hito (según el cálculo actual)
      const baseStyle = this.getMilestoneStyle(subtask, task);
      // Obtén el offset de la barra principal (la ubicación calculada)
      const parentBarStyle = this.barStyle(task);
      // Si la barra del padre tiene un left calculado, súmale ese valor
      const parentOffset = parseFloat(parentBarStyle.left) || 0;
      // Ajusta el left del hito en el expanded para que sume el offset del padre
      baseStyle.left = `${parseFloat(baseStyle.left) + parentOffset}px`;
      return baseStyle;
    }
  }
};
</script>

<style scoped>
/* Estilos base para el componente */
.task-container {
  height: 5vh;
  position: relative;
  transition: background-color 0.2s ease;
}

.task-container:hover {
  background-color: rgba(243, 244, 246, 0.7);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.gantt-bar-wrapper {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gantt-bar-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bar-full {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding-left: 10px;
  /* Added 'px' to the padding value */
  transition: all 0.3s ease;
}

.milestone {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.milestone:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  transform: rotate(45deg) scale(1.1);
}

.resize-handle {
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
  width: 8px;
  height: 100%;
  position: absolute;
  top: 0;
  cursor: ew-resize;
}

.resize-handle.left {
  left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.resize-handle.right {
  right: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.gantt-bar-wrapper:hover .resize-handle {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.2);
}

.gantt-bar-wrapper:hover .resize-handle:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

.check-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #16a34a;
  font-size: 16px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.bar-delayed {
  position: absolute;
  height: 4px;
  background-color: #ef4444;
  bottom: 15%;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.3);
}

.delay-counter {
  background-color: #ef4444;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 4px;
  position: absolute;
  right: -20px;
  top: -14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: bold;
}

.subtask-segment {
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 2;
  background-size: 10px 10px;
  /* Añadir estos estilos para mejorar la interacción */
  pointer-events: auto;
  position: absolute;
}

.gantt-bar-wrapper:hover .subtask-segment {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Indicador de retraso para subtareas */
.subtask-delay-indicator {
  position: absolute;
  width: 2px;
  background-color: #ef4444;
  top: -5px;
  bottom: -5px;
  right: 0;
  box-shadow: 0 0 3px rgba(239, 68, 68, 0.5);
  z-index: 3;
}

/* Flecha que indica de qué subtarea viene el retraso */
.delay-arrow {
  position: absolute;
  width: 0;
  height: 0;
  right: -3px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 4px solid #ef4444;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));
}

/* Badge para mostrar los días de retraso */
.delay-days-badge {
  position: absolute;
  background-color: #ef4444;
  color: white;
  font-size: 8px;
  padding: 1px 3px;
  border-radius: 3px;
  right: -18px;
  top: -10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  font-weight: bold;
}

.subtask-indicator {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  left: 2px;
  top: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

/* Borde brillante para subtareas */
.subtask-segment::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

/* Animación para subtareas en progreso */
@keyframes subtaskProgress {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 20px 0;
  }
}

.subtask-in-progress {
  animation: subtaskProgress 10s linear infinite;
}

/* Estilo para la barra de progreso */
/*.progress-bar {
  position: absolute;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  bottom: 4px;
  left: 4px;
  right: 4px;
  border-radius: 2px;
  overflow: hidden;
}*/

.progress-fill {
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  transition: width 0.3s ease;
}

/* Estilos mejorados para el tooltip de subtareas */
.subtask-tooltip {
  position: absolute;
  /* Cambiado de fixed a absolute */
  background-color: white;
  color: rgba(0, 0, 0, 0.9);
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10000;
  /* Valor muy alto para asegurar que esté por encima de todo */
  pointer-events: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 250px;
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: opacity 0.15s ease;
  opacity: 1;
  /* Asegurar que el tooltip sea visible */
  display: block !important;
}

.tooltip-title {
  font-weight: bold;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-info {
  font-size: 11px;
  line-height: 1.4;
}

.tooltip-label {
  font-weight: bold;
  color: rgba(135, 129, 129, 0.8);
}

.tooltip-delay {
  color: #ef4444;
}

/* Estilos para el contenedor de iconos de estado */
.status-icon-container {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: rgba(255, 255, 255, 0.975);
  border-radius: 2px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.status-icon-container-milestone {
  background-color: rgba(255, 255, 255, 0.875);
  border-radius: 2px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-45deg);
  width: 13px;
  height: 13px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.status-icon-container .material-icons {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  transition: filter 0.3s ease;
  /* Añadir transición para el filtro */
}

.current-day-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: red;
  z-index: 15;
}

/* Pseudo-elemento para la flecha que apunta al día actual */
.current-day-line::after {
  content: "";
  position: absolute;
  top: 0;
  /* Ajusta según donde desees la flecha */
  left: 50%;
  transform: translate(-50%, -100%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid red;
  z-index: 16;
}

.task-name-card {

  padding: 10px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* Limita a dos líneas */
  line-clamp: 2;
  /* Standard property for compatibility */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.subtask-abbreviation {
  border-radius: 3px;
  padding: 0px 4px;
  font-size: 10px;
  font-weight: bold;
  margin-top: 10px;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;          /* Se ajusta al contenido */
  max-width: 100%;
  position: absolute;
}

.subtask-abbreviation-expanded {
  border-radius: 3px;
  padding: 0px 4px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  margin-top: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;          /* Se ajusta al contenido */
  max-width: 100%;
  position: absolute;
}

/* Estilos para el botón de toggle */
.toggle-subtasks-btn {
  cursor: pointer;
  transition: transform 0.3s ease;
  color: #6b7280;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toggle-subtasks-btn:hover {
  color: #4b5563;
}

.toggle-subtasks-btn.rotated {
  transform: rotate(-90deg);
}

/* Estilos para las subtareas expandidas */
.expanded-subtasks {
  width: 100%;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.subtask-row {
  display: flex;
  height: 32px;
  align-items: center;
  position: relative;
  border-bottom: 1px dashed #e5e7eb;
  background-color: rgba(249, 250, 251, 0.7);
}

.subtask-name-card {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.subtask-expanded-bar {
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: visible;
  position: relative;
}

.subtask-expanded-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.8;
}

.subtask-duration {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.subtask-expanded-delay {
  position: absolute;
  height: 100%;
  top: 0;
  right: -2px;
  border-right: 2px solid #ef4444;
}

.delay-days {
  position: absolute;
  top: -8px;
  right: -14px;
  background-color: #ef4444;
  color: white;
  font-size: 9px;
  padding: 1px 3px;
  border-radius: 2px;
  font-weight: bold;
}
</style>
