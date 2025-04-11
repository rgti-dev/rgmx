import weekNumber from "@/utils/weekNumber.js";

/**
 * Convierte una fecha a formato "YYYY-MM-DD"
 */
export function formatLocalDate(date = new Date()) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Genera una lista de fechas a partir de una fecha de inicio (string "YYYY-MM-DD")
 * y el número total de días.
 */
export function generateDates(startDateStr, numberOfDays) {
  const startDate = new Date(startDateStr);
  const dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * Ajusta una fecha para que sea lunes (considera domingo como último día de la semana).
 */
export function adjustToMonday(date) {
  const day = date.getDay();
  const adjustedDay = day === 0 ? 7 : day;
  const diff = 1 - adjustedDay;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
}

/**
 * Calcula la fecha final a partir de la fecha de inicio y la duración (en días)
 */
export function calculateEndDate(startDateStr, duration) {
  const startDate = new Date(startDateStr);
  // Sumar duration-1 días para obtener la fecha final
  startDate.setDate(startDate.getDate() + duration - 1);
  return formatLocalDate(startDate);
}

/**
 * Cambia la semana de una fecha sumando offset (en semanas)
 */
export function changeWeek(date, offset) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset * 7);
  return newDate;
}

/**
 * Obtiene el número de la semana (usando el módulo weekNumber) a partir de una fecha,
 * aplicando un offset en semanas.
 */
export function getWeekLabel(dateStr, offset = 0) {
  const baseDate = new Date(dateStr);
  baseDate.setDate(baseDate.getDate() + offset * 7);
  return weekNumber.getWeekNumber(baseDate);
}