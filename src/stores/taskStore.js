import { defineStore } from 'pinia';
import { getTasks, createTask, updateTask } from '@/api/taskOT.js';
import { formatLocalDate, generateDates, calculateEndDate } from '@/utils/dateHelper.js';
import cloneDeep from 'lodash.clonedeep';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    selectedTask: null,
    dateRange: formatLocalDate(), // Fecha de inicio de la vista
  }),
  actions: {
    async fetchTasks() {
      try {
        const tasksFromAPI = await getTasks();
        // Transformamos cada tarea para incluir 'start' y 'end'
        const transformTask = (task) => ({
          ...task,
          start: formatLocalDate(new Date(task.startDate)),
          end: formatLocalDate(new Date(task.endDate)),
          subtasks: task.subtasks ? task.subtasks.map(t => transformTask(t)) : []
        });
        this.tasks = tasksFromAPI.map(task => transformTask(task));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },
    async submitTask(payload, mode) {
      // Realiza la validación y transformación de fechas
      const startCandidate = new Date(`${payload.startDate}T06:00:00.000Z`);
      const endCandidate = new Date(`${payload.endDate}T06:00:00.000Z`);
      if (isNaN(startCandidate.getTime()) || isNaN(endCandidate.getTime())) {
        console.error("Formato de fecha incorrecto en payload");
        return;
      }
      const startDateIso = startCandidate.toISOString();
      const endDateIso = endCandidate.toISOString();
      const [sy, sm, sd] = payload.startDate.split("-").map(Number);
      const [ey, em, ed] = payload.endDate.split("-").map(Number);
      const startObj = new Date(sy, sm - 1, sd);
      const endObj = new Date(ey, em - 1, ed);
      const duration = Math.ceil((endObj - startObj) / (1000 * 60 * 60 * 24)) + 1;
      
      payload = {
        ...payload,
        duration: duration > 0 ? duration : calculateEndDate(payload.startDate, payload.endDate),
        startDate: startDateIso,
        endDate: endDateIso,
        completedAt:
          payload.status === "completada" && !payload.completedAt
            ? new Date().toISOString()
            : (payload.status !== "completada" ? null : payload.completedAt)
      };
      
      // Transformar subtasks
      if (payload.subtasks && payload.subtasks.create && payload.subtasks.create.length > 0) {
        const createOps = [];
        const updateOps = [];
        for (const subtask of payload.subtasks.create) {
          const newSubtask = {
            name: subtask.name,
            description: subtask.description || "",
            duration: calculateEndDate(subtask.startDate, subtask.endDate),
            progress: subtask.progress,
            status: subtask.status,
            priority: subtask.priority,
            color: subtask.color,
            milestone: subtask.milestone,
            startDate: new Date(`${subtask.startDate}T06:00:00.000Z`).toISOString(),
            endDate: new Date(`${subtask.endDate}T06:00:00.000Z`).toISOString(),
            completedAt: subtask.status === "completada" ? (subtask.completedAt || new Date().toISOString()) : null,
            createdBy: { connect: { id: 1 } }
          };
          if (subtask.id) {
            updateOps.push({
              where: { id: subtask.id },
              data: newSubtask
            });
          } else {
            createOps.push(newSubtask);
          }
        }
        payload.subtasks = {};
        if (createOps.length) payload.subtasks.create = createOps;
        if (updateOps.length) payload.subtasks.update = updateOps;
      }
      
      try {
        if (mode === "new") {
          payload.createdById = 1;
          await createTask(payload);
        } else {
          payload.updatedById = 1;
          await updateTask(this.selectedTask.id, payload);
        }
        await this.fetchTasks();
      } catch (error) {
        console.error("Error submitting task:", error);
      }
    },
    setDateRange(newRange) {
      this.dateRange = newRange;
    },
    setSelectedTask(task) {
      this.selectedTask = cloneDeep(task);
    },
    resetSelectedTask() {
      this.selectedTask = null;
    }
  }
});