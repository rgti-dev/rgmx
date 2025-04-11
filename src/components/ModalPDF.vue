<template>
    <div v-if="visible" class="modal-backdrop">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-lg font-medium">Responsiva de Equipo</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="flex-1 overflow-hidden p-4">
                <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full border-0" title="PDF Viewer"></iframe>
                <div v-else class="flex items-center justify-center h-full">
                    <p class="text-gray-500">No se pudo cargar el PDF</p>
                </div>
            </div>

            <div class="flex justify-end p-4 border-t">
                <button @click="downloadPdf"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mr-2">
                    <i class="fas fa-download mr-2"></i>Descargar
                </button>
                <button @click="$emit('close')"
                    class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        pdfUrl: {
            type: String,
            required: true
        }
    },
    methods: {
        downloadPdf() {
            // Crear un enlace temporal para descargar el PDF
            const link = document.createElement('a');
            link.href = this.pdfUrl;
            link.download = `responsiva_equipo_${new Date().getTime()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    backdrop-filter: blur(3px);
    animation: fadeIn 0.2s ease-out;
}
</style>