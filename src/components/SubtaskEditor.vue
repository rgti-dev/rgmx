<template>
  <div :style="{ marginLeft: depth * 1.5 + 'rem' }">
    <div class="flex items-center gap-2 mt-2">
      <input
        type="text"
        v-model="localSubtask.name"
        placeholder="Nombre de la subtarea"
        class="border border-gray-300 rounded-md p-2 flex-1"
      />
      <input
        type="date"
        v-model="localSubtask.start"
        class="border border-gray-300 rounded-md p-2"
      />
      <input
        type="number"
        v-model.number="localSubtask.duration"
        min="1"
        class="border border-gray-300 rounded-md p-2 w-24"
      />
      <button type="button" @click="$emit('remove')" class="text-red-500 hover:text-red-700">
        <span class="material-icons">delete</span>
      </button>
    </div>
    <div class="ml-6">
      <div
        v-for="(child, index) in localSubtask.subtasks"
        :key="index"
        class="mt-2"
      >
        <!-- Se utiliza v-model para que los cambios se sincronicen hacia arriba -->
        <SubtaskEditor
          v-model:subtask="localSubtask.subtasks[index]"
          :depth="depth + 1"
          @remove="removeChild(index)"
        />
      </div>
      <button
        type="button"
        @click="addChild"
        class="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        <span class="material-icons">add</span>
      </button>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
export default {
  name: "SubtaskEditor",
  props: {
    subtask: {
      type: Object,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // Creamos una copia local de la prop para evitar mutaciones directas
      localSubtask: cloneDeep(this.subtask)
    };
  },
  watch: {
    // Si la prop cambia desde el exterior, actualizamos la copia local
    subtask: {
      handler(newVal) {
        this.localSubtask = cloneDeep(newVal);
      },
      deep: true,
      immediate: true
    },
    // Cada vez que la copia local cambie, emitimos el cambio al padre
    localSubtask: {
      handler(newVal) {
        this.$emit("update:subtask", newVal);
      },
      deep: true
    }
  },
  methods: {
    addChild() {
      if (!this.localSubtask.subtasks) {
        this.$set(this.localSubtask, "subtasks", []);
      }
      // Si no hay fecha definida, se asigna la fecha actual en formato YYYY-MM-DD
      const childStart = this.localSubtask.start || new Date().toISOString().substr(0, 10);
      this.localSubtask.subtasks.push({
        name: "",
        start: childStart,
        duration: this.localSubtask.duration, // utiliza el valor definido en el editor o creador
        color: this.localSubtask.color || "#3B82F6",
        progress: 0,
        status: "pendiente",
        priority: "media",
        milestone: false,
        subtasks: [],
      });
    },
    removeChild(index) {
      this.localSubtask.subtasks.splice(index, 1);
    }
  },
  components: {
    // Importación perezosa para evitar referencias circulares
    SubtaskEditor: () => import("./SubtaskEditor.vue")
  }
};
</script>

<style scoped>
/* Puedes incluir aquí tus estilos personalizados si los tienes */
</style>
