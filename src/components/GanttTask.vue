<template>
  <!-- Contenedor principal -->
  <div>
    <!-- Tarea principal -->
    <div class="task-container flex h-12 items-center relative hover:bg-gray-50 transition-colors duration-200 group"
      style="border-bottom: 1px solid #e5e7eb;">
      <Tooltip :content="task.name">
        <div
          class="task-name-card w-64 font-medium text-gray-800 cursor-pointer sticky left-0 bg-white z-20 px-3 py-2 rounded flex items-center"
          @click="$emit('editTask', task, parentTask)">
          <!-- Wrapper para aplicar indentado solo al texto -->
          <span :style="{ marginLeft: depth > 0 ? (depth * 10) + 'px' : '0px' }" class="flex items-center">
            <!-- Botón toggle para subtareas -->
            <span v-if="task.subtasks && task.subtasks.length" @click.stop="toggleSubtasks"
              class="material-icons mr-1 cursor-pointer transition-transform duration-200"
              :class="{ 'transform rotate-90': !showSubtasks }">
              {{ showSubtasks ? 'keyboard_arrow_down' : 'chevron_right' }}
            </span>
            <span v-if="depth > 0" class="text-gray-500 mr-1">[↳]</span>
            {{ task.name }}
            <!-- Ícono de éxito adjunto al nombre -->
            <span v-if="isCompleted(task)" class="material-icons ml-2 text-green-500 animate-pulse-slow" style="font-size:16px;">
              check_circle
            </span>
          </span>
        </div>
      </Tooltip>
      <!-- Contenedor de barras sin indentado -->
      <div class="flex-1 h-full relative" :style="{ marginLeft: depth > 0 ? `-${depth * 10}px` : '0px' }">
        <Tooltip content="Hito" v-if="task.milestone">
          <div class="milestone transform hover:scale-110 transition-transform duration-200" :style="milestoneStyle(task)"></div>
        </Tooltip>
        <Tooltip :content="barTooltip(task)" v-else>
          <div class="gantt-bar-wrapper absolute" :style="barStyle(task)">
            <div class="resize-handle left" @mousedown.stop="startResizing(task, 'start', $event)"></div>
            <div class="draggable-area" @mousedown="startDragging(task, $event)"
              @dblclick="$emit('editTask', task, parentTask)">
              <!-- Barra principal: se pinta según el estado -->
              <div class="bar-full absolute inset-0 rounded-lg shadow-md transition-all duration-200 group-hover:shadow-lg"
                :style="{ backgroundColor: mainBarColor(task) }"></div>
              <!-- Barra de progreso -->
              <div class="bar-progress absolute top-0 left-0 bottom-0 rounded-lg transition-all duration-300" :style="{
                width: progressWidth(task),
                backgroundColor: progressBarColor(task)
              }">
                <!-- Texto del porcentaje en la barra -->
                <div
                  class="progress-text absolute inset-0 flex items-center justify-center text-white text-sm font-bold drop-shadow-sm">
                  {{ task.progress ? task.progress + '%' : '0%' }}
                </div>
              </div>
              <!-- Ícono de éxito en la barra -->
              <span v-if="isCompleted(task)" class="material-icons check-icon animate-bounce-slow" :style="{
                left: 'calc(' + progressWidth(task) + ' + 8px)'
              }">check_circle</span>
              
              <!-- Indicador de prioridad alta -->
              <div v-if="task.priority === 'alta'" class="priority-indicator"></div>
            </div>
            <div class="resize-handle right" @mousedown.stop="startResizing(task, 'end', $event)"></div>
          </div>
        </Tooltip>
        <!-- Barra roja de días retrasados -->
        <div v-if="!isCompleted(task)" class="bar-delayed" :style="delayedBarStyle(task)">
          <span class="delay-counter">{{ calculateDelayDays(task) }} d</span>
        </div>
      </div>
    </div>
    <!-- Renderización recursiva de subtareas -->
    <div v-if="showSubtasks && task.subtasks && task.subtasks.length" class="subtasks-container">
      <component 
        :is="$options.name"
        v-for="(child, idx) in task.subtasks" 
        :key="idx" 
        :task="child" 
        :depth="depth + 1" 
        :parentTask="task"
        :viewStart="viewStart" 
        :viewDays="viewDays" 
        :dayWidth="dayWidth"
        :projectColWidth="projectColWidth"
        @editTask="(childTask, parent) => $emit('editTask', childTask, parent)"
        @startResizing="(task, edge, event) => $emit('startResizing', task, edge, event)"
        @startDragging="(task, event) => $emit('startDragging', task, event)"
      />
    </div>
  </div>
</template>

<script>
import Tooltip from './Tooltip.vue';

export default {
  name: "GanttTask",
  components: {
    Tooltip
  },
  props: {
    task: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    parentTask: Object,
    viewStart: { type: String, required: true },
    viewDays: { type: Number, default: 7 },
    dayWidth: { type: Number, default: 56 },
    projectColWidth: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      showSubtasks: true
    };
  },
  methods: {
    toggleSubtasks() {
      this.showSubtasks = !this.showSubtasks;
    },
    // Aseguramos que el ancho de las barras se ajuste perfectamente a los días
    barStyle(task) {
      // Se asume que viewStart es el lunes de inicio
      const [sy, sm, sd] = this.viewStart.split("-").map(Number);
      const calendarStart = new Date(sy, sm - 1, sd);
      
      // La fecha en la que inicia la tarea (en formato "YYYY-MM-DD")
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      
      // Cantidad de días de diferencia entre el inicio del calendario y la tarea
      const taskBarStart = Math.floor((taskStart - calendarStart) / (1000 * 60 * 60 * 24));
      
      // Nos aseguramos de obtener un offset no negativo
      const visibleBarStart = Math.max(taskBarStart, 0);
      
      // Total de días disponibles en la grilla
      const visibleBarEnd = Math.min(taskBarStart + task.duration, this.viewDays);
      const visibleDays = visibleBarEnd - visibleBarStart;
      
      if (visibleDays <= 0) return { display: "none" };
      
      // Usamos projectColWidth para alinear correctamente
      return {
        left: `${this.projectColWidth + visibleBarStart * this.dayWidth}px`,
        width: `${visibleDays * this.dayWidth}px`,
        height: "70%",
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
    progressWidth(task) {
      const calendarStart = new Date(this.viewStart);
      const calendarEnd = new Date(calendarStart);
      calendarEnd.setDate(calendarEnd.getDate() + this.viewDays);
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const progressDays = Math.round(task.duration * (task.progress || 0) / 100);
      const progressDate = new Date(taskStart);
      progressDate.setDate(progressDate.getDate() + progressDays);
      const visibleStart = taskStart < calendarStart ? calendarStart : taskStart;
      const effectiveProgressDate = progressDate > calendarEnd ? calendarEnd : progressDate;
      let visibleProgressDays = (effectiveProgressDate - visibleStart) / (1000 * 60 * 60 * 24);
      visibleProgressDays = visibleProgressDays < 0 ? 0 : visibleProgressDays;
      return `${visibleProgressDays * this.dayWidth}px`;
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
    progressBarColor(task) {
      if (task.status === "En Progreso" || task.status === "en-progreso") {
        return this.lightenColor(task.color, 30);
      }
      return this.mainBarColor(task);
    },
    isCompleted(task) {
      return task.status && task.status.toLowerCase().includes("complet");
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
    countSubtasks(task) {
      let total = 0, completed = 0;
      if (task.subtasks && task.subtasks.length) {
        total += task.subtasks.length;
        task.subtasks.forEach(sub => {
          if (this.isCompleted(sub)) {
            completed++;
          }
          const childCounts = this.countSubtasks(sub);
          total += childCounts.total;
          completed += childCounts.completed;
        });
      }
      return { total, completed };
    },
    generateSubtasksTree(task, indent = "") {
      let tree = "";
      if (task.subtasks && task.subtasks.length) {
        task.subtasks.forEach(child => {
          tree += "\n" + indent + "- " + child.name + (this.isCompleted(child) ? " ✔" : " (pendiente)");
          tree += this.generateSubtasksTree(child, indent + "  ");
        });
      }
      return tree;
    },
    barTooltip(task) {
      let tooltip = `Tarea: ${task.name}\nEstado: ${task.status}`;
      if (task.subtasks && task.subtasks.length) {
        tooltip += "\nSubtareas:" + this.generateSubtasksTree(task);
      }
      if (task.priority) {
        tooltip += `\nPrioridad: ${task.priority}`;
      }
      if (task.comments && task.comments.length) {
        const lastComment = task.comments[task.comments.length - 1].content;
        tooltip += `\nÚltimo comentario: ${lastComment}`;
      }
      return tooltip;
    },
    startResizing(task, edge, event) {
      this.$emit('startResizing', task, edge, event);
    },
    startDragging(task, event) {
      this.$emit('startDragging', task, event);
    },
    delayedBarStyle(task) {
      const today = new Date();
      const calendarStart = new Date(this.viewStart);
      const calendarEnd = new Date(calendarStart);
      calendarEnd.setDate(calendarEnd.getDate() + this.viewDays);
      
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const finish = new Date(taskStart);
      finish.setDate(finish.getDate() + task.duration);
      
      // Si la tarea aún no venció, no se muestra la barra de desfase
      if (today <= finish) {
        return { display: "none" };
      }
      
      // Determinar la porción visible del desfase:
      // La barra comienza en el mayor entre finish y calendarStart
      const visibleStart = finish < calendarStart ? calendarStart : finish;
      // Y termina en el menor entre today y calendarEnd
      const visibleEnd = today > calendarEnd ? calendarEnd : today;
      
      // Si no hay intersección entre la barra y el calendario, no se muestra nada
      if (visibleEnd <= visibleStart) {
        return { display: "none" };
      }
      
      // Calcular los días visibles de desfase
      const delayDays = Math.ceil((visibleEnd - visibleStart) / (1000 * 60 * 60 * 24));
      const leftDays = Math.floor((visibleStart - calendarStart) / (1000 * 60 * 60 * 24));
      
      return {
        left: `${leftDays * this.dayWidth}px`,
        width: `${delayDays * this.dayWidth}px`,
        height: "70%",
        top: "15%",
        backgroundColor: "rgba(220,38,38,0.3)",
        position: "absolute"
      };
    },
    calculateDelayDays(task) {
      const today = new Date();
      const calendarStart = new Date(this.viewStart);
      const calendarEnd = new Date(calendarStart);
      calendarEnd.setDate(calendarEnd.getDate() + this.viewDays);
      
      const [ty, tm, td] = task.start.split("-").map(Number);
      const taskStart = new Date(ty, tm - 1, td);
      const finish = new Date(taskStart);
      finish.setDate(finish.getDate() + task.duration);
      
      if (today <= finish) {
        return 0;
      }
      
      const effectiveDelayEnd = today > calendarEnd ? calendarEnd : today;
      const delayDays = Math.ceil((effectiveDelayEnd - finish) / (1000 * 60 * 60 * 24));
      return delayDays;
    }
  }
};
</script>

<style scoped>
.task-container:hover {
  background-color: rgba(243, 244, 246, 0.7);
}

.gantt-bar-wrapper {
  transition: transform 0.2s ease;
}

.gantt-bar-wrapper:hover {
  transform: translateY(-2px);
}

.bar-full {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.bar-progress {
  background-image: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.15) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.15) 50%, 
    rgba(255, 255, 255, 0.15) 75%, 
    transparent 75%, 
    transparent);
  background-size: 1rem 1rem;
}

.milestone {
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.milestone:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

.resize-handle {
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.gantt-bar-wrapper:hover .resize-handle {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.2);
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
}

.priority-indicator {
  position: absolute;
  top: -8px;
  right: 10px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid #ef4444;
  animation: pulse 2s infinite;
}

.subtasks-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animaciones personalizadas */
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce-slow {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-5%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
