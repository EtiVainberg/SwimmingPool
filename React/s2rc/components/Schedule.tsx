import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getCoursesType, getSchedule } from '../api/api';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { CustomButtonInput } from '@fullcalendar/core/index.js';
import { grey } from '@mui/material/colors';
import { Alert, Grid } from '@mui/material';
import ScheduleDetailCard from './ScheduleDetailCard';

export default function ColumnSpanningDerived() {
  const [schedule, setSchedule] = useState([]);
  const [courseTypes, setCourseTypes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEventColor = (courseType: string) => {
    const index = courseTypes.indexOf(courseType);
    const colors = ['yellow', 'red', 'blue', 'green', 'pink', 'purple', 'turquoise', 'orange'];

    if (index !== -1) {
      return colors[index];
    } else {
      return 'gray';
    }
  };

  const fetchSchedule = async (date: Date) => {
    try {
      const res = await getSchedule(date);

      if (res === undefined) {
        setError("Ooops... Fail to connect server, try later...");
      }
      setSchedule(res);
    }
    catch (error) {
      setError("Ooops... Fail to connect server, try later...");
    }

  };

  useEffect(() => {

    const fetchCourseTypes = async () => {
      const types = await getCoursesType();
      setCourseTypes(types);
    };

    fetchCourseTypes();
    if (calendarRef.current) {
      const currentDate = calendarRef.current.getApi().getDate();
      fetchSchedule(currentDate);
    }
    const currentDate = new Date(); const currentDate2 = new Date(currentDate); console.log(currentDate.toString() === currentDate2.toString());

    handleDateClick(currentDate)
  }, []);


  const handlePrevMonthClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      const currentDate = calendarApi.getDate();
      fetchSchedule(currentDate);
    }
  };

  const handleNextMonthClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      const currentDate = calendarApi.getDate();
      fetchSchedule(currentDate);
    }
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      const currentDate = calendarApi.getDate();
      fetchSchedule(currentDate);
    }
  };

  // const handleEventClick = (arg: any) => {
  //   const clickedEvent = arg.event;
  //   console.log('Clicked Event:', clickedEvent);

  //   const clickedSchedule = schedule.find((course: any) => {
  //     const timeBegin = new Date(course.TimeBegin);
  //     const eventTitle = course.CoursesType + ' ' + timeBegin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  //     return eventTitle === clickedEvent.title;
  //   });

  //   if (clickedSchedule) {
  //     console.log('Schedule:', clickedSchedule);
  //   }
  // };
  const [clickedDateEvents, setClickedDateEvents] = useState<any[]>([]);

  const handleDateClick = (arg: Date | any) => {
    const d = new Date(arg);
    let clickedDate: Date;
    if (arg.toString() === d.toString()) {
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      d.setMilliseconds(0);
      clickedDate = d;
    }
    else
      clickedDate = arg.date;
    console.log('Clicked Date:', clickedDate);

    setSelectedDate(clickedDate);

    // Filter the schedule to get events for the clicked date
    const clickedDateEvents = schedule.filter((course: any) => {
      const timeBegin = new Date(course.TimeBegin);
      const eventYear = timeBegin.getFullYear();
      const eventMonth = timeBegin.getMonth();
      const eventDay = timeBegin.getDate();

      const clickedYear = clickedDate.getFullYear();
      const clickedMonth = clickedDate.getMonth();
      const clickedDay = clickedDate.getDate();

      return eventYear === clickedYear && eventMonth === clickedMonth && eventDay === clickedDay;
    });

    // Set the filtered events for the clicked date
    setClickedDateEvents(clickedDateEvents);
    console.log(clickedDateEvents, "hjk");

  };
  const customButtons: { [name: string]: CustomButtonInput } = {
    prev: {
      text: '<',
      click: handlePrevMonthClick,
    },
    next: {
      text: '>',
      click: handleNextMonthClick,
    },
    today: {
      text: 'Today',
      click: handleTodayClick,
    },
  };

  const today = new Date();
  const todayEvents = schedule
    ? schedule.filter((course: any) => {
      const timeBegin = new Date(course.TimeBegin);
      const eventYear = timeBegin.getFullYear();
      const eventMonth = timeBegin.getMonth();
      const eventDay = timeBegin.getDate();

      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();

      return eventYear === todayYear && eventMonth === todayMonth && eventDay === todayDay;
    }) : [];




  const events = schedule
    ? schedule.map((course: any) => {
      const timeBegin = new Date(course.TimeBegin);
      const courseType = course.Course ? course.Course.CoursesType : 'N/A';
      const eventColor = getEventColor(courseType);

      return {
        title: courseType + ' ' + timeBegin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: eventColor,
        date: timeBegin.toISOString().substring(0, 10),
      };
    }) : [];

  // const clickedDateEvents = selectedDate
  //   ? schedule.filter((course: any) => {
  //     const timeBegin = new Date(course.TimeBegin);
  //     const eventYear = timeBegin.getFullYear();
  //     const eventMonth = timeBegin.getMonth();
  //     const eventDay = timeBegin.getDate();

  //     const clickedYear = selectedDate.getFullYear();
  //     const clickedMonth = selectedDate.getMonth();
  //     const clickedDay = selectedDate.getDate();

  //     return eventYear === clickedYear && eventMonth === clickedMonth && eventDay === clickedDay;
  //   })
  //   : [];
  return (
    // <Grid container spacing={2}>
    <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '25% 75%' }}>
      {error && (
        <Alert severity="warning">
          Ooops... Fail to connect server, try later...
        </Alert>
      )}
      <div>
        {!error && selectedDate && (
          <div style={{ backgroundColor: grey[100], height: '100%', padding: '16px', overflowY: 'auto' }}>
            <h2>{selectedDate.toDateString()}</h2>
            {clickedDateEvents.length > 0 && clickedDateEvents.map((event: any, index: number) => (
              <ScheduleDetailCard key={index} props={event} />
            ))}

          </div>
        )}
      </div>
      <div>
        {!error && (
          <div style={{ height: '90vh', width: '60vw', marginTop: 20, padding: 0 }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              dateClick={handleDateClick}
              weekends={true}
              events={!error ? events : undefined}
              customButtons={customButtons}
            />
          </div>
        )}
      </div>
    </div>


  );
}