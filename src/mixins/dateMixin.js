export default {
    methods: {
      getLocalDate(date = new Date()) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      },
  
      generateDates() {
        const [year, month, day] = this.dateRange.split("-").map(Number);
        const startDate = new Date(year, month - 1, day);
        this.dates = Array.from({ length: this.weeksToShow * 7 }, (_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          return date;
        });
      },
  
      formatDate(date) {
        return date.getDate();
      },
  
      formatWeekday(date) {
        return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
      }
    }
  }