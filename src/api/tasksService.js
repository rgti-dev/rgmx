import { formatLocalDate, calculateEndDate } from "@/composables/useCalendar.js";
import cloneDeep from "lodash.clonedeep";

/**
 * Transforma una tarea recibida de la API,
 * convirtiendo startDate/endDate a "YYYY-MM-DD"
 * y procesando de forma recursiva los subtasks.
 */
export function transformTask(task) {
  return {
    ...task,
    start: formatLocalDate(new Date(task.startDate)),
    end: formatLocalDate(new Date(task.endDate)),
    subtasks: task.subtasks ? task.subtasks.map(t => transformTask(t)) : []
  };
}

/**
 * Prepara el payload para enviar a la API,
 * convirtiendo las fechas al formato ISO con "T00:00:00", 
 * calculando la duración y procesando las subtareas.
 */
export function prepareTaskPayload(task) {
  // Clona la tarea para no modificarla directamente
  const payload = cloneDeep(task);
  
  // Convertir las fechas a formato ISO
  const startDateIso = new Date(`${payload.start}T00:00:00`).toISOString();
  const endDateIso = new Date(`${payload.end}T00:00:00`).toISOString();

  // Calcular duración a partir de start y end (en días)
  const [sy, sm, sd] = payload.start.split("-").map(Number);
  const startDateObj = new Date(sy, sm - 1, sd);
  const [ey, em, ed] = payload.end.split("-").map(Number);
  const endDateObj = new Date(ey, em - 1, ed);
  const duration = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

  payload.duration = duration > 0 ? duration : 1;
  payload.startDate = startDateIso;
  payload.endDate = endDateIso;
  
  // Eliminamos propiedades que no enviamos directamente
  delete payload.start;
  delete payload.end;
  
  // Procesar la transformación de subtareas
  if (payload.subtasks && payload.subtasks.length > 0) {
    const createOps = [];
    const updateOps = [];
    for (const subtask of payload.subtasks) {
      const subtaskPayload = {
        name: subtask.name,
        description: subtask.description || "",
        duration: subtask.duration,
        progress: subtask.progress,
        status: subtask.status,
        priority: subtask.priority,
        color: subtask.color,
        milestone: subtask.milestone,
        startDate: new Date(`${subtask.start}T00:00:00`).toISOString(),
        endDate: new Date(`${calculateEndDate(subtask.start, subtask.duration)}T00:00:00`).toISOString(),
        createdById: 1 // Reemplaza con el ID real del usuario
      };
      if (subtask.id) {
        updateOps.push({
          where: { id: subtask.id },
          data: subtaskPayload
        });
      } else {
        createOps.push(subtaskPayload);
      }
    }
    payload.subtasks = {};
    if (createOps.length) payload.subtasks.create = createOps;
    if (updateOps.length) payload.subtasks.update = updateOps;
  }
  
  return payload;
}