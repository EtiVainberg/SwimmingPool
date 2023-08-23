declare namespace FullCalendar {
    class Calendar {
      constructor(el: HTMLElement, options: any);
      // Add other properties and methods as needed
    }
  }
  
  interface Window {
    FullCalendar: typeof FullCalendar;
  }
  