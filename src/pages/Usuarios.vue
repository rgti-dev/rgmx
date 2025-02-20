<template>

    <div class="usuarios-container flex  w-full">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Contenido del Dashboard -->
      <div class="content flex-1 ml-64 w-full">
        <!-- Navbar -->
        <Navbar />
  
        <div class="p-8">
          <h1 class="text-3xl font-bold">Gestion Usuarios</h1>

          <!-- Tabla de Usuarios -->
        <table class="min-w-full table-auto mt-6">
          <thead>
            <tr class="bg-sooty text-white">
              <th class="px-4 py-2">ID</th>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuarios in usuarios" :key="usuarios.id">
              <td class="px-4 py-2">{{ usuarios.id }}</td>
              <td class="px-4 py-2">{{ usuarios.nombre }}</td>
              <td class="px-4 py-2">{{ usuarios.descripcion }}</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  
  import Navbar from '@/components/Navbar.vue'
  import Sidebar from '@/components/Sidebar.vue'
  import { getUsuarios } from '@/api/usuarios.js'
  
  export default {
    components: {
      Navbar,
      Sidebar
    },
    data() {
      return {
        usuarios: [], // Aquí almacenaremos los usuarios obtenidos
      };
    },
    async created() {
      try {
        // Obtenemos los usuarios al crear el componente
        this.usuarios = await getUsuarios();
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    }
  }
  
  </script>
  <style scoped>
  .usuarios-container {
    display: flex;
    min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura */
  }
  
  .content {
    padding: 20px;
    margin-left: 16rem; /* Asegura que el contenido se desplace a la derecha del sidebar */
    flex: 1; /* Hace que el contenido ocupe el espacio restante */
  }
  </style>