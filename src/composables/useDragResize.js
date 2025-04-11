import { ref } from "vue";

export function useDragResize(getLocalDate, dayWidth) {
  const draggingTask = ref(null);
  const dragStartX = ref(0);
  const initialTaskStart = ref(null);

  const resizingTask = ref(null);
  const resizingEdge = ref("");
  const resizingStartX = ref(0);
  const initialTaskStartDate = ref(null);
  const initialTaskDuration = ref(0);

  const startDragging = (task, event) => {
    draggingTask.value = task;
    dragStartX.value = event.clientX;
    const [year, month, day] = task.start.split("-").map(Number);
    initialTaskStart.value = new Date(year, month - 1, day);
    document.addEventListener("mousemove", onDragging);
    document.addEventListener("mouseup", stopDragging);
  };

  const onDragging = (event) => {
    if (!draggingTask.value) return;
    const deltaX = event.clientX - dragStartX.value;
    const daysOffset = Math.round(deltaX / dayWidth);
    if (daysOffset === 0) return;
    const newDate = new Date(initialTaskStart.value);
    newDate.setDate(newDate.getDate() + daysOffset);
    draggingTask.value.start = getLocalDate(newDate);
  };

  const stopDragging = () => {
    if (draggingTask.value) {
      draggingTask.value = null;
      document.removeEventListener("mousemove", onDragging);
      document.removeEventListener("mouseup", stopDragging);
    }
  };

  const startResizing = (task, edge, event) => {
    event.stopPropagation();
    resizingTask.value = task;
    resizingEdge.value = edge;
    resizingStartX.value = event.clientX;
    const [year, month, day] = task.start.split("-").map(Number);
    initialTaskStartDate.value = new Date(year, month - 1, day);
    initialTaskDuration.value = task.duration;
    document.addEventListener("mousemove", onResizing);
    document.addEventListener("mouseup", stopResizing);
  };

  const onResizing = (event) => {
    if (!resizingTask.value) return;
    const deltaX = event.clientX - resizingStartX.value;
    const daysOffset = Math.round(deltaX / dayWidth);
    if (resizingEdge.value === "start") {
      const newDuration = initialTaskDuration.value - daysOffset;
      if (newDuration < 1) return;
      const newStart = new Date(initialTaskStartDate.value);
      newStart.setDate(newStart.getDate() + daysOffset);
      resizingTask.value.start = getLocalDate(newStart);
      resizingTask.value.duration = newDuration;
    } else if (resizingEdge.value === "end") {
      const newDuration = initialTaskDuration.value + daysOffset;
      if (newDuration < 1) return;
      resizingTask.value.duration = newDuration;
    }
  };

  const stopResizing = () => {
    if (resizingTask.value) {
      resizingTask.value = null;
      document.removeEventListener("mousemove", onResizing);
      document.removeEventListener("mouseup", stopResizing);
    }
  };

  return {
    startDragging,
    stopDragging,
    startResizing,
    stopResizing
  };
}