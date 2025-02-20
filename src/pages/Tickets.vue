<template>

  <div class="tickets-container flex  w-full">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido del Dashboard -->
    <div class="content flex-1 ml-64 w-full">
      <!-- Navbar -->
      <Navbar />

      <div class="p-8">
        <h1 class="text-3xl font-bold">Gestion Tickets</h1>

      </div>
    </div>
  </div>
</template>

<script>

import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: {
    Navbar,
    Sidebar
  }
}

</script>
<style scoped>
.tickets-container {
  display: flex;
  min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura */
}

.content {
  padding: 20px;
  margin-left: 16rem; /* Asegura que el contenido se desplace a la derecha del sidebar */
  flex: 1; /* Hace que el contenido ocupe el espacio restante */
}
</style>