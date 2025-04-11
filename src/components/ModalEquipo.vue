<template>
    <div v-if="visible" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-container">
            <!-- Header -->
            <div class="modal-header">
                <h2 class="modal-title">
                    {{ modo === 'crear' ? 'Agregar Equipo' : 'Editar Equipo' }}
                </h2>
                <button @click="closeModal" class="close-button">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Selección de tipo (solo para crear y cuando aún no se ha definido) -->
            <div v-if="modo === 'crear' && showSelection" class="type-selection">
                <h3 class="selection-title">Seleccione el tipo de equipo</h3>
                <div class="selection-cards">
                    <div @click="seleccionarTipo('Equipo')" class="selection-card">
                        <i class="fas fa-desktop selection-icon equipment-icon"></i>
                        <div class="selection-label">Equipo</div>
                    </div>
                    <div @click="seleccionarTipo('Celular')" class="selection-card">
                        <i class="fas fa-mobile-alt selection-icon mobile-icon"></i>
                        <div class="selection-label">Celular</div>
                    </div>
                    <div @click="seleccionarTipo('Monitor')" class="selection-card">
                        <i class="fas fa-tv selection-icon monitor-icon"></i>
                        <div class="selection-label">Monitor</div>
                    </div>
                    <div @click="seleccionarTipo('Impresora')" class="selection-card">
                        <i class="fas fa-print selection-icon printer-icon"></i>
                        <div class="selection-label">Impresora</div>
                    </div>
                    <div @click="seleccionarTipo('Otro')" class="selection-card">
                        <i class="fas fa-microchip selection-icon other-icon"></i>
                        <div class="selection-label">Otro</div>
                    </div>
                </div>
            </div>

            <!-- Formulario por pasos -->
            <div v-else class="form-container">
                <!-- Stepper -->
                <div class="stepper">
                    <div v-for="step in totalSteps" :key="step" class="step-item" 
                         :class="getStepClass(step)">
                        <div class="step-circle">
                            <i :class="getStepIcon(step)"></i>
                        </div>
                        <div class="step-label">{{ stepTitle(step) }}</div>
                        <div v-if="step < totalSteps" class="step-connector"></div>
                    </div>
                </div>

                <!-- Formulario por pasos -->
                <form @submit.prevent="handleSubmit" class="form-steps">
                    <!-- Paso 1: Datos de Equipo -->
                    <div v-if="currentStep === 1" class="step-content">
                        <h3 class="step-title">Información del Equipo</h3>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Nombre <span class="required">*</span></label>
                                <input v-model="localEquipo.nombre" type="text" required />
                            </div>
                            <div class="form-group">
                                <label>Tipo <span class="required">*</span></label>
                                <input v-model="localEquipo.tipo" type="text" required :disabled="modo === 'crear'" />
                            </div>
                            <div class="form-group">
                                <label>Marca</label>
                                <input v-model="localEquipo.marca" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Modelo</label>
                                <input v-model="localEquipo.modelo" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Serie</label>
                                <input v-model="localEquipo.serie" type="text" />
                            </div>
                            
                            <!-- Campos condicionales según tipo de equipo -->
                            <template v-if="localEquipo.tipo === 'Celular' || localEquipo.tipo === 'Equipo'">
                                <div class="form-group">
                                    <label>Procesador</label>
                                    <input v-model="localEquipo.procesador" type="text" />
                                </div>
                                <div class="form-group">
                                    <label>RAM</label>
                                    <input v-model="localEquipo.ram" type="text" />
                                </div>
                                <div class="form-group">
                                    <label>Almacenamiento</label>
                                    <input v-model="localEquipo.almacenamiento" type="text" />
                                </div>
                                <div class="form-group">
                                    <label>Sistema Operativo</label>
                                    <input v-model="localEquipo.sistemaOperativo" type="text" />
                                </div>
                            </template>
                            
                            <template v-if="localEquipo.tipo === 'Equipo'">
                                <div class="form-group">
                                    <label>IP Asignada</label>
                                    <input v-model="localEquipo.ipAsignada" type="text" />
                                </div>
                                <div class="form-group">
                                    <label>MAC Address</label>
                                    <input v-model="localEquipo.macAddress" type="text" />
                                </div>
                            </template>
                            
                            <template v-if="localEquipo.tipo === 'Celular'">
                                <div class="form-group">
                                    <label>Número Asignado</label>
                                    <input v-model="localEquipo.numeroAsignado" type="text" />
                                </div>
                                <div class="form-group">
                                    <label>IMEI</label>
                                    <input v-model="localEquipo.IMEI" type="text" />
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Paso 2: Datos de Facturación -->
                    <div v-if="currentStep === 2" class="step-content">
                        <h3 class="step-title">Información de Facturación y Compra</h3>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Número Factura</label>
                                <input v-model="localEquipo.numeroFactura" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Proveedor</label>
                                <input v-model="localEquipo.proveedor" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Fecha Compra</label>
                                <input v-model="localEquipo.fechaCompra" type="date" />
                            </div>
                            <div class="form-group">
                                <label>Precio</label>
                                <div class="input-with-icon">
                                    <span class="input-icon">$</span>
                                    <input v-model="localEquipo.precio" type="number" step="0.01" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Garantía</label>
                                <input v-model="localEquipo.garantia" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Fin Garantía</label>
                                <input v-model="localEquipo.finGarantia" type="date" />
                            </div>
                            <div class="form-group col-span-2">
                                <label>Ubicación</label>
                                <input v-model="localEquipo.ubicacion" type="text" />
                            </div>
                        </div>
                    </div>

                    <!-- Paso 3: Personal Asignado -->
                    <div v-if="currentStep === 3" class="step-content">
                        <h3 class="step-title">Asignación y Estado</h3>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Departamento</label>
                                <select v-model="localEquipo.departamento">
                                    <option value="">Seleccionar departamento</option>
                                    <option v-for="dept in departamentos" :key="dept" :value="dept">{{ dept }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Puesto</label>
                                <input v-model="localEquipo.puesto" type="text" />
                            </div>
                            <div class="form-group">
                                <label>Responsable</label>
                                <select v-model="localEquipo.responsableId">
                                    <option value="">Sin responsable</option>
                                    <option v-for="resp in responsables" :key="resp.id" :value="resp.id">
                                        {{ resp.nombre }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Estado <span class="required">*</span></label>
                                <select v-model="localEquipo.estado" required>
                                    <option value="No asignado">No asignado</option>
                                    <option value="Asignado">Asignado</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                </select>
                            </div>
                            <div class="form-group col-span-2">
                                <label>Notas</label>
                                <textarea v-model="localEquipo.notas" rows="3"></textarea>
                            </div>
                            
                            <div class="form-group col-span-2">
                                <label>Documento de Responsiva</label>
                                <div class="file-upload">
                                    <input type="file" id="responsiva" @change="handleFileChange" accept=".pdf" />
                                    <label for="responsiva" class="file-upload-label">
                                        <i class="fas fa-upload"></i>
                                        {{ localEquipo.PATH ? 'Cambiar archivo' : 'Subir archivo' }}
                                    </label>
                                    <span v-if="localEquipo.PATH" class="file-name">{{ getFileName(localEquipo.PATH) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Navegación de pasos -->
                    <div class="form-navigation">
                        <button type="button" @click="prevStep" :disabled="currentStep === 1" class="btn-secondary">
                            <i class="fas fa-arrow-left"></i> Anterior
                        </button>
                        <div class="step-indicator">
                            {{ currentStep }} de {{ totalSteps }}
                        </div>
                        <template v-if="currentStep < totalSteps">
                            <button type="button" @click="nextStep" class="btn-primary">
                                Siguiente <i class="fas fa-arrow-right"></i>
                            </button>
                        </template>
                        <template v-else>
                            <button type="submit" class="btn-primary">
                                {{ modo === 'crear' ? 'Guardar' : 'Actualizar' }} <i class="fas fa-save"></i>
                            </button>
                        </template>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { getUsuarios } from "@/api/usuarios.js";

export default {
    name: "ModalEquipo",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        modo: {
            type: String,
            default: "crear"
        },
        equipo: {
            type: Object,
            default: () => ({
                nombre: "",
                tipo: "",
                marca: "",
                modelo: "",
                serie: "",
                procesador: "",
                ram: "",
                almacenamiento: "",
                sistemaOperativo: "",
                ipAsignada: "",
                macAddress: "",
                ubicacion: "",
                estado: "",
                fechaCompra: "",
                numeroFactura: "",
                proveedor: "",
                garantia: "",
                finGarantia: "",
                responsableId: "",
                notas: "",
                precio: "",
                departamento: "",
                puesto: "",
                numeroAsignado: "",
                IMEI: "",
                PATH: null,
            })
        }
    },
    data() {
        return {
            showSelection: this.modo === "crear" && !this.equipo.tipo,
            currentStep: 1,
            totalSteps: 3,
            localEquipo: { ...this.equipo },
            archivoPDF: null,
            responsables: [],
            // Datos de ejemplo para los selects
            departamentos: [
                "TI", "Recursos Humanos", "Finanzas", "Ventas", "Marketing", 
                "Operaciones", "Administración", "Dirección", "Producción"
            ],
            // Para validación
            errors: {},
            // Para animación
            isAnimating: false
        };
    },
    watch: {
        equipo(newVal) {
            this.localEquipo = { ...newVal };
        },
        visible(newVal) {
            if (newVal) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    },
    mounted() {
        this.fetchResponsables();
    },
    methods: {
        fetchResponsables() {
            getUsuarios()
                .then(data => {
                    this.responsables = data;
                })
                .catch(error => {
                    console.error("Error al obtener responsables:", error);
                });
        },
        stepTitle(step) {
            switch (step) {
                case 1: return "Equipo";
                case 2: return "Facturación";
                case 3: return "Asignación";
                default: return "";
            }
        },
        getStepIcon(step) {
            switch (step) {
                case 1: return "fas fa-desktop";
                case 2: return "fas fa-file-invoice-dollar";
                case 3: return "fas fa-user-tag";
                default: return "fas fa-circle";
            }
        },
        getStepClass(step) {
            return {
                'step-completed': step < this.currentStep,
                'step-active': step === this.currentStep,
                'step-pending': step > this.currentStep
            };
        },
        seleccionarTipo(tipo) {
            this.localEquipo.tipo = tipo;
            this.showSelection = false;
            this.isAnimating = true;
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        },
        nextStep() {
            if (this.validateCurrentStep() && this.currentStep < this.totalSteps) {
                this.currentStep++;
            }
        },
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        },
        validateCurrentStep() {
            this.errors = {};
            if (this.currentStep === 1) {
                if (!this.localEquipo.nombre) {
                    this.errors.nombre = "El nombre es requerido";
                }
                if (!this.localEquipo.tipo) {
                    this.errors.tipo = "El tipo es requerido";
                }
            }
            if (this.currentStep === 3) {
                if (!this.localEquipo.estado) {
                    this.errors.estado = "El estado es requerido";
                }
            }
            return Object.keys(this.errors).length === 0;
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.archivoPDF = file;
                this.localEquipo.PATH = file.name;
                console.log("Archivo PDF seleccionado:", file);
            } else {
                console.warn("No se seleccionó un archivo PDF válido");
            }
        },
        async handleSubmit() {
            if (!this.validateCurrentStep()) {
                console.error("Errores de validación", this.errors);
                return;
            }
            const formData = new FormData();
            Object.keys(this.localEquipo).forEach((key) => {
                formData.append(key, this.localEquipo[key]);
            });
            if (this.archivoPDF) {
                formData.append('PATH', this.archivoPDF);
                console.log("Archivo PDF incluido en el FormData:", this.archivoPDF);
            } else {
                console.log("No se encontró archivo PDF para enviar.");
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            const equipoData = {};
            for (let pair of formData.entries()) {
                equipoData[pair[0]] = pair[1];
            }
            console.log("Datos que se enviarán:", equipoData);
            this.$emit("submit", equipoData);
        },
        closeModal() {
            if (this.hasChanges() && !confirm("¿Estás seguro de cerrar? Los cambios no guardados se perderán.")) {
                return;
            }
            this.$emit("close");
        },
        hasChanges() {
            const original = JSON.stringify(this.equipo);
            const current = JSON.stringify(this.localEquipo);
            return original !== current;
        },
        getFileName(path) {
            if (!path) return "";
            return path.split('\\').pop().split('/').pop();
        }
    }
};
</script>

<style scoped>
/* Modal base styles */
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

.modal-container {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;
    display: flex;
    flex-direction: column;
}

/* Modal header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #6b7280;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    transition: all 0.2s;
}

.close-button:hover {
    background-color: #f3f4f6;
    color: #ef4444;
}

/* Type selection */
.type-selection {
    padding: 2rem;
    text-align: center;
}

.selection-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: #374151;
}

.selection-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
}

.selection-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    border-radius: 12px;
    background-color: #f9fafb;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    width: 140px;
}

.selection-card:hover {
    background-color: #f3f4f6;
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.selection-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.equipment-icon { color: #3b82f6; }
.mobile-icon { color: #10b981; }
.monitor-icon { color: #8b5cf6; }
.printer-icon { color: #f59e0b; }
.other-icon { color: #6b7280; }

.selection-label {
    font-weight: 600;
    font-size: 1.125rem;
}

/* Form container */
.form-container {
    padding: 1.5rem;
}

/* Stepper */
.stepper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    position: relative;
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    position: relative;
}

.step-circle {
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    z-index: 10;
    transition: all 0.3s;
}

.step-label {
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.3s;
}

.step-connector {
    position: absolute;
    top: 1.5rem;
    left: 50%;
    right: -50%;
    height: 2px;
    z-index: 0;
}

.step-completed .step-circle {
    background-color: #10b981;
    color: white;
}

.step-completed .step-connector {
    background-color: #10b981;
}

.step-active .step-circle {
    background-color: #3b82f6;
    color: white;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.step-active .step-label {
    color: #3b82f6;
    font-weight: 600;
}

.step-active .step-connector {
    background-color: #e5e7eb;
}

.step-pending .step-circle {
    background-color: #e5e7eb;
    color: #9ca3af;
}

.step-pending .step-connector {
    background-color: #e5e7eb;
}

/* Form steps */
.form-steps {
    display: flex;
    flex-direction: column;
}

.step-content {
    animation: fadeIn 0.3s;
}

.step-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.col-span-2 {
    grid-column: span 2;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #4b5563;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-group input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
}

.required {
    color: #ef4444;
}

/* Input with icon */
.input-with-icon {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 0.75rem;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    color: #6b7280;
}

.input-with-icon input {
    padding-left: 2rem;
}

/* File upload */
.file-upload {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.file-upload input[type="file"] {
    display: none;
}

.file-upload-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.file-upload-label:hover {
    background-color: #e5e7eb;
}

.file-name {
    font-size: 0.875rem;
    color: #4b5563;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Form navigation */
.form-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
}

.step-indicator {
    font-size: 0.875rem;
    color: #6b7280;
}

.btn-primary, .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background-color: #2563eb;
}

.btn-secondary {
    background-color: #f3f4f6;
    color: #4b5563;
}

.btn-secondary:hover {
    background-color: #e5e7eb;
}

.btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .form-group.col-span-2 {
        grid-column: auto;
    }
    
    .selection-cards {
        gap: 1rem;
    }
    
    .selection-card {
        width: 120px;
        padding: 1rem;
    }
    
    .step-label {
        display: none;
    }
}
</style>