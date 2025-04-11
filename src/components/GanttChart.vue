<template>
  <div class="gantt-container bg-white rounded-lg shadow-lg p-2 md:p-3">
    <div class="overflow-x-auto pb-4">
      <div class="inline-block min-w-full">
        <!-- Cabecera de semanas -->
        <div class="flex border-b border-gray-300 rounded-t-lg">
          <div class="w-80 sticky left-0 bg-white z-20 border-r border-gray-300"></div>
          <div class="flex w-full">
            <div
              v-for="i in weeksToShow"
              :key="i"
              :style="{ width: (dayWidth * 7) + 'px' }"
              class="text-center py-2 bg-blue-100 font-semibold text-blue-900 border-l border-gray-50"
            >
              Semana {{ computeWeekLabel(i - 1) }}
            </div>
          </div>
        </div>
        <!-- Cabecera de días -->
        <div class="flex border-b bg-white pl-2 shadow-sm">
          <div class="w-64 font-semibold sticky left-0 bg-white z-20 border-r border-gray-300 px-2 py-2">
            Proyectos
          </div>
          <div class="flex">
            <div
              v-for="(date, index) in dates"
              :key="index"
              :style="{ width: dayWidth + 'px' }"
              :class="[
                index === 0
                  ? 'text-center py-2 text-sm font-medium text-gray-800'
                  : 'text-center py-2 text-sm font-medium text-gray-800 border-l border-gray-300'
              ]"
            >
              <div class="text-xs text-gray-500">{{ formatWeekday(date) }}</div>
              <div class="text-sm">{{ formatDate(date) }}</div>
            </div>
          </div>
        </div>
        <!-- Lista de tareas del diagrama Gantt -->
        <div
          v-for="task in tasks"
          :key="task.id"
          class="inline-block min-w-full gantt-grid"
          :style="{ '--day-width': dayWidth + 'px' }"
        >
          <GanttTask
            :task="task"
            :depth="0"
            :viewStart="dateRange"
            :viewDays="weeksToShow * 7"
            :dayWidth="dayWidth"
            @startDragging="$emit('startDragging', $event)"
            @startResizing="$emit('startResizing', $event)"
            @editTask="$emit('editTask', $event)"
          />
        </div>
        <!-- Fin listado de tareas -->
      </div>
    </div>
  </div>
</template>

<script>
import GanttTask from "@/components/GanttTask.vue";

export default {
  name: "GanttChart",
  components: { GanttTask },
  props: {
    tasks: {
      type: Array,
      default: () => []
    },
    dates: {
      type: Array,
      default: () => []
    },
    dateRange: {
      type: String,
      default: ""
    },
    weeksToShow: {
      type: Number,
      default: 4
    },
    dayWidth: {
      type: Number,
      default: 49
    }
  },
  methods: {
    formatDate(date) {
      return date.getDate();
    },
    formatWeekday(date) {
      return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
    },
    getWeekLabel(offset) {
      const baseDate = new Date(this.dateRange);
      baseDate.setDate(baseDate.getDate() + offset * 7);
      return this.getISOWeek(baseDate);
    },
    getISOWeek(date) {
      // Cálculo simple para obtener el número de la semana ISO.
      const tempDate = new Date(date.valueOf());
      const dayNumber = (date.getDay() + 6) % 7;
      tempDate.setDate(tempDate.getDate() - dayNumber + 3);
      const firstThursday = tempDate.valueOf();
      tempDate.setMonth(0, 1);
      if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
      }
      const weekNumber = 1 + Math.ceil((firstThursday - tempDate) / 604800000);
      return weekNumber;
    },
    computeWeekLabel(offset) {
      // Calcula la fecha base sumando el offset (en semanas)
      const baseDate = new Date(this.dateRange);
      baseDate.setDate(baseDate.getDate() + offset * 7);
      // Cálculo del número ISO de semana:
      const tempDate = new Date(baseDate.valueOf());
      const dayNumber = (baseDate.getDay() + 6) % 7;
      tempDate.setDate(tempDate.getDate() - dayNumber + 3);
      const firstThursday = tempDate.valueOf();
      tempDate.setMonth(0, 1);
      if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
      }
      const weekNumber = 1 + Math.ceil((firstThursday - tempDate) / 604800000);
      return weekNumber;
    }
  }
};
</script>

<style scoped>
.gantt-container {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.gantt-grid {
  position: relative;
  background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px);
  background-size: calc(var(--day-width, 56px)) 100%;
}
</style>