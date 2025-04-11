<template>
  <div>
    <!-- Cabecera de semanas -->
    <div class="flex border-b border-gray-300 rounded-t-lg">
      <div class="w-80 sticky left-0 bg-white z-20 border-r border-gray-300 flex items-center justify-center">
        <h3 class="font-semibold text-gray-700">Cronograma</h3>
      </div>
      <div class="flex w-full">
        <div
          v-for="i in weeksToShow" :key="i"
          :style="{ width: (dayWidth * 7) + 'px' }"
          class="text-center py-2 bg-blue-100 font-semibold text-blue-900 border-l border-gray-50 flex flex-col justify-center">
          <span>Semana {{ getWeekLabel(i - 1) }}</span>
          <span class="text-xs text-blue-700">{{ getWeekDateRange(i - 1) }}</span>
        </div>
      </div>
    </div>
    <!-- Cabecera de días -->
    <div class="flex border-b bg-white pl-2 shadow-sm" ref="daysGrid">
      <div class="w-64 font-semibold sticky left-0 bg-white z-20 border-r border-gray-300 px-2 py-2 flex items-center">
        <span class="material-icons mr-2 text-gray-600">folder_open</span>
        Proyectos
      </div>
      <div class="flex">
        <div
          v-for="(date, index) in dates" :key="index"
          :style="{ width: dayWidth + 'px' }"
          :class="[
            'text-center py-2 text-sm font-medium border-l border-gray-300',
            isWeekend(date) ? 'bg-gray-100 text-gray-500' : 'text-gray-800',
            isToday(date) ? 'bg-blue-50 font-bold' : ''
          ]">
          <div class="text-xs" :class="isWeekend(date) ? 'text-gray-400' : 'text-gray-500'">
            {{ formatWeekday(date) }}
          </div>
          <div class="relative">
            <div class="text-sm" :class="isToday(date) ? 'text-blue-600' : ''">
              {{ formatDate(date) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GanttHeader",
  props: {
    weeksToShow: {
      type: Number,
      required: true
    },
    dayWidth: {
      type: Number,
      required: true
    },
    dates: {
      type: Array,
      required: true
    },
    viewStart: {
      type: String,
      required: true
    }
  },
  methods: {
    getWeekLabel(weekOffset) {
      const baseDate = new Date(this.viewStart);
      baseDate.setDate(baseDate.getDate() + weekOffset * 7);
      return this.getISOWeekNumber(baseDate);
    },
    getWeekDateRange(weekOffset) {
      const startDate = new Date(this.viewStart);
      startDate.setDate(startDate.getDate() + weekOffset * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const startFormatted = startDate.getDate() + '/' + (startDate.getMonth() + 1);
      const endFormatted = endDate.getDate() + '/' + (endDate.getMonth() + 1);
      return `${startFormatted} - ${endFormatted}`;
    },
    getISOWeekNumber(date) {
      const target = new Date(date);
      const dayNum = target.getUTCDay() || 7;
      target.setUTCDate(target.getUTCDate() + 4 - dayNum);
      const firstDayOfYear = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
      return Math.ceil((((target - firstDayOfYear) / 86400000) + 1) / 7);
    },
    isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
    },
    formatWeekday(date) {
      return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
    },
    formatDate(date) {
      return date.getDate();
    }
  }
};
</script>

<style scoped>
/* Opcional: agrega estilos propios si es necesario */
</style>