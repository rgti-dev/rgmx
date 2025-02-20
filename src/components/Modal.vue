<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal">
      <header class="modal-header">
        <slot name="header"></slot>
        <button @click="close">X</button>
      </header>
      <main class="modal-body">
        <slot name="body"></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  emits: ['close'],
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  max-width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 20px;
}
</style>
