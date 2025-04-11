<template>
  <section class="subtasks-section mt-4">
    <h3 class="text-lg font-medium mb-2">Subtareas</h3>
    <div class="subtasks-container max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
      <div
        v-for="(subtask, index) in subtasks"
        :key="index"
        class="subtask-item flex flex-wrap items-center p-2 mb-2 bg-gray-50 rounded"
      >
        <input
          type="text"
          v-model="subtask.name"
          placeholder="Nombre de subtarea..."
          class="flex-1 border rounded p-1 mr-2 mb-2"
        />
        <input
          type="number"
          v-model.number="subtask.duration"
          placeholder="Duración (días)"
          min="1"
          class="w-32 border rounded p-1 mr-2 mb-2"
        />
        <button
          type="button"
          @click="removeSubtask(index)"
          class="text-red-500 hover:text-red-700 mr-2 mb-2"
        >
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
    <button
      type="button"
      @click="addSubtask"
      class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
    >
      <span class="material-icons mr-1">add</span> Agregar Subtarea
    </button>
  </section>
</template>

<script>
export default {
  name: "SubtasksEditor",
  props: {
    subtasks: {
      type: Array,
      default: () => []
    },
    defaultStart: {
      type: String,
      default: ""
    },
    defaultColor: {
      type: String,
      default: "#3B82F6"
    }
  },
  methods: {
    addSubtask() {
      const newSubtask = {
        name: "",
        start: this.defaultStart,
        duration: 1,
        color: this.defaultColor,
        progress: 0,
        status: "pendiente",
        priority: "media",
        milestone: false,
        subtasks: []
      };
      this.$emit("add-subtask", newSubtask);
    },
    removeSubtask(index) {
      this.$emit("remove-subtask", index);
    }
  }
};
</script>