// filepath: d:\dev\rgmx\src\utils\dateHelper.js
import { format, addDays, parseISO, startOfWeek, addWeeks } from "date-fns";

export function formatLocalDate(date = new Date()) {
    return format(date, "yyyy-MM-dd");
}

export function calculateEndDate(start, duration) {
    // Se asume que start es una cadena en formato "yyyy-MM-dd"
    const startDate = parseISO(start);
    // duration en días
    return format(addDays(startDate, duration - 1), "yyyy-MM-dd");
}

export function generateDates(start, totalDays) {
    const dates = [];
    const startDate = parseISO(start);
    for (let i = 0; i < totalDays; i++) {
        dates.push(addDays(startDate, i));
    }
    return dates;
}

// Ajusta una fecha al lunes de la semana correspondiente
export function adjustToMonday(date = new Date()) {
    return startOfWeek(date, { weekStartsOn: 1 }); // La semana comienza el lunes
}

// Cambia la semana de una fecha dada (offset puede ser positivo o negativo)
export function changeWeek(date, offset) {
    const adjustedDate = adjustToMonday(date);
    return addWeeks(adjustedDate, offset);
}