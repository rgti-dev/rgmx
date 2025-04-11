class WeekNumber {
    constructor(timezone = "America/Mexico_City") {
        this.timezone = timezone;
    }

    async getNetworkDate() {
        try {
            const response = await fetch(`https://worldtimeapi.org/api/timezone/${this.timezone}`);
            const data = await response.json();
            return new Date(data.utc_datetime);
        } catch (error) {
            console.error("Error al obtener la fecha de la red:", error);
            return new Date();
        }
    }

    // Método sincrónico para obtener el número de semana dado una fecha
    getWeekNumber(date) {
        const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = tempDate.getUTCDay() || 7; // si es domingo (0), se toma como 7
        tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
        const weekNumber = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
        return weekNumber;
    }
}

export default new WeekNumber();