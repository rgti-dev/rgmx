<template>
  <div class="mantenimientos-container flex w-full">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido del Dashboard -->
    <div class="content flex-1 ml-16 w-full">
      <!-- Navbar -->
      <Navbar />

      <div class="p-8 mt-10">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold">Gestión de Mantenimientos</h1>
          <button @click="abrirModal" class="bg-blue-500 text-white px-4 py-2 rounded">Programar Mantenimiento</button>
        </div>
        
        <!-- Calendario -->
        <FullCalendar ref="calendar" :options="calendarOptions" />
      </div>
    </div>
  </div>

  <!-- Modal para programar mantenimiento -->
  <Modal v-if="mostrarModal" @close="cerrarModal">
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Programar Mantenimiento</h2>
      <label class="block mb-2">Fecha Seleccionada:</label>
      <input type="date" v-model="fechaSeleccionada" class="border p-2 w-full" />
      <button @click="guardarMantenimiento" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Guardar</button>
    </div>
  </Modal>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Modal from '@/components/Modal.vue'
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    Navbar,
    Sidebar,
    Modal,
    FullCalendar
  },
  data() {
    return {
      mostrarModal: false,
      fechaSeleccionada: '',
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
          
        },
        
        dateClick: this.handleDateClick
      }
    };
  },
  methods: {
    abrirModal() {
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    handleDateClick(info) {
      this.fechaSeleccionada = info.dateStr;
      this.abrirModal();
    },
    guardarMantenimiento() {
      if (this.fechaSeleccionada) {
        alert(`Mantenimiento programado para: ${this.fechaSeleccionada}`);
        this.cerrarModal();
      }
    }
  }
}
</script>

<style scoped>
.mantenimientos-container {
  display: flex;
  min-height: 50vh;
}
.content {
  padding: 20px;
}
</style>
