<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Comentarios</h3>
    <div class="h-64 border border-gray-300 rounded-md p-3 overflow-y-auto mb-4">
      <div v-if="comments && comments.length">
        <div v-for="comment in comments" :key="comment.id" class="mb-2 border-b pb-2">
          <p class="text-sm text-gray-700">{{ comment.content }}</p>
          <small class="text-xs text-gray-500">
            Por: {{ comment.createdBy.nombre }}
            · {{ new Date(comment.createdAt).toLocaleString() }}
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
      @click="sendComment"
    >
      Enviar
    </button>
  </div>
</template>

<script>
import { createComment } from "@/api/comments";
export default {
  name: "CommentsSection",
  props: {
    taskId: {
      type: [String, Number],
      required: true
    },
    comments: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      newComment: ""
    };
  },
  methods: {
    async sendComment() {
      if (!this.newComment.trim()) return;
      try {
        const payload = {
          content: this.newComment,
          taskId: this.taskId,
          createdBy: 1 // Reemplaza con el ID real del usuario
        };
        const response = await createComment(payload);
        this.$emit("comment-added", response);
        this.newComment = "";
      } catch (error) {
        console.error("Error al enviar comentario:", error);
      }
    }
  }
};
</script>