<template>
    <div class="controls-panel mb-4 flex flex-col md:flex-row gap-1 md:space-x-4 items-center">
      <input v-model="localSearch" @input="emitSearch" type="text" placeholder="Buscar tarea..."
             class="px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400" />
      <button @click="$emit('open-new-task')" class="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
        <span class="material-icons" title="Nueva Tarea">add</span>
      </button>
      <button @click="$emit('prev-week')" class="px-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
        <span class="material-icons" title="Semana Anterior">arrow_back</span>
      </button>
      <button @click="$emit('next-week')" class="px-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
        <span class="material-icons" title="Semana Siguiente">arrow_forward</span>
      </button>
      <button @click="$emit('current-week')" class="px-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
        <span class="material-icons" title="Semana Actual">today</span>
      </button>
      <p class="text-lg font-medium uppercase text-end flex-1">
        {{ currentMonthYear.month }} {{ currentMonthYear.year }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ControlsPanel',
    props: {
      searchQuery: { type: String, default: '' },
      currentMonthYear: { type: Object, required: true }
    },
    data() {
      return {
        localSearch: this.searchQuery
      };
    },
    methods: {
      emitSearch() {
        this.$emit('search-change', this.localSearch);
      }
    }
  };
  </script>
  