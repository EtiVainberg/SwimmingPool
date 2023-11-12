declare namespace FullCalendar {
    class Calendar {
      constructor(el: HTMLElement, options: any);
    }
  }
  
  interface Window {
    FullCalendar: typeof FullCalendar;
  }
  