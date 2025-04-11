<template>
  <div class="tooltip-container" 
       @mouseenter="handleMouseEnter" 
       @mousemove="updatePosition" 
       @mouseleave="handleMouseLeave">
    <slot></slot>
    <div class="tooltip-content" :style="tooltipStyle" :class="{ 'visible': isTooltipVisible }">
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: {
    content: { type: String, required: true },
    // Permiten estandarizar la configuración del tooltip
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    transitionDuration: { type: Number, default: 100 } // duración en milisegundos
  },
  data() {
    return {
      tooltipX: 0,
      tooltipY: 0,
      tooltipPosition: 'top',
      isTooltipVisible: false
    }
  },
  computed: {
    tooltipStyle() {
      return {
        left: (this.tooltipX + this.offsetX) + 'px',
        position: 'absolute',
        visibility: this.isTooltipVisible ? 'visible' : 'hidden',
        opacity: this.isTooltipVisible ? 1 : 0,
        transition: `opacity ${this.transitionDuration}ms, top ${this.transitionDuration}ms, transform ${this.transitionDuration}ms`
      };
    }
  },
  methods: {
    updatePosition(event) {
      this.tooltipX = event.clientX;
      this.tooltipY = event.clientY;
    },
    handleMouseEnter(event) {
      this.isTooltipVisible = true;
      this.updatePosition(event);
    },
    handleMouseLeave() {
      this.isTooltipVisible = false;
    }
  }
};
</script>

<style scoped>
.tooltip-container {
  display: contents;
  position: relative;
  cursor: help;
  user-select: none;
}

.tooltip-content {
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: pre;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 250px;
  word-wrap: break-word;
  transform: translateY(10px) scale(0.95);
  pointer-events: none;
  border-left: 3px solid #3B82F6;
}

.tooltip-content.visible {
  transform: translateY(0) scale(1);
}

/* Animación de entrada y salida */
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes tooltipFadeOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}

/* Estilos para diferentes tipos de tooltips (puedes añadir clases adicionales según necesites) */
.tooltip-content.info {
  border-left-color: #3B82F6;
  background-color: rgba(239, 246, 255, 0.95);
}

.tooltip-content.warning {
  border-left-color: #F59E0B;
  background-color: rgba(255, 251, 235, 0.95);
}

.tooltip-content.error {
  border-left-color: #EF4444;
  background-color: rgba(254, 242, 242, 0.95);
}

.tooltip-content.success {
  border-left-color: #10B981;
  background-color: rgba(236, 253, 245, 0.95);
}
</style>