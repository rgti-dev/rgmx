<template>
    <transition name="modal-fade">
        <div
            v-if="show"  class="modal-fadeo"
            @click.self="handleClose"
        >
            <div
                class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all"
                :class="{ 'scale-100 opacity-100': show, 'scale-95 opacity-0': !show }"
            >
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">
                        {{ modalMode === 'new' ? 'Agregar Usuario' : 'Editar Usuario' }}
                    </h2>
                    <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            v-model="localUsuario.nombre"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nombre completo"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            v-model="localUsuario.email"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div v-if="modalMode === 'new'">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div class="relative">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="localUsuario.password"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Contraseña segura"
                            />
                            <button 
                                type="button" 
                                @click="togglePassword"
                                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    />
                                </svg>
                                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">Mínimo 8 caracteres, incluya números y símbolos</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <div class="relative">
                            <select
                                v-model="localUsuario.rol"
                                required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="admin">Administrador</option>
                                <option value="user">Usuario</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            @click="handleClose"
                            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {{ modalMode === 'new' ? 'Crear Usuario' : 'Actualizar Usuario' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script>
import { ref, watch, toRefs } from 'vue';

export default {
    name: 'UsuarioModal',
    props: {
        show: { type: Boolean, required: true },
        modalMode: { type: String, required: true },
        usuario: {
            type: Object,
            default: () => ({ nombre: '', email: '', password: '', rol: 'user' })
        }
    },
    emits: ['close', 'submit'],
    setup(props, { emit }) {
        const { usuario } = toRefs(props);
        const localUsuario = ref({ ...usuario.value });
        const showPassword = ref(false);

        watch(usuario, (newVal) => {
            localUsuario.value = { ...newVal };
        });

        const togglePassword = () => {
            showPassword.value = !showPassword.value;
        };

        const handleClose = () => {
            emit('close');
        };

        const handleSubmit = () => {
            emit('submit', { ...localUsuario.value });
        };

        return {
            localUsuario,
            showPassword,
            togglePassword,
            handleClose,
            handleSubmit
        };
    }
};
</script>

<style scoped>
.modal-fadeo {
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
/* Puedes mover aquí estilos específicos para el modal o usar los existentes */
</style>