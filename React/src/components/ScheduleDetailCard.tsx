import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Courses from './Courses';
import { useState, useEffect } from 'react';
import { getCoursesType } from '../api/api';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Boy';


// interface ScheduleDetailCardProps {
//   courseType: string;
// }

export default function ScheduleDetailCard(props: any) {
    const [courseTypes, setCourseTypes] = useState<string[]>([]);

    const getEventColor = (courseType: string) => {
        const index = courseTypes.indexOf(courseType);
        const colors = ['yellow', 'red', 'blue', 'green', 'pink', 'purple', 'turquoise','orange'];

        if (index !== -1) {
            return colors[index];
        } else {
            return 'gray';
        }
    };
    useEffect(() => {

        const fetchCourseTypes = async () => {
            const types = await getCoursesType();
            setCourseTypes(types);
        };

        fetchCourseTypes();
    }, []);
    // const { courseType } = props;
    //console.log(props.props.Course.CoursesType);
    const course = props.props.Course;
    const schedule = props.props;
    // console.log(courseType); // Now it should log the correct courseType

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 16 }} style={{ backgroundColor: getEventColor(course.CoursesType) }} gutterBottom>
                    {course.CoursesType}
                </Typography>
                <Typography  color='brown'>
                    <AccessTimeFilledIcon />  {new Date(schedule.TimeBegin).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })} - {new Date(schedule.TimeEnd).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Typography>
                <Typography color="orangered">
                    <SchoolIcon /> Teacher : {course.TeacherName}
                </Typography>
                <Typography color='blueviolet'>
                    {course.Gender === 'Male' ? <BoyIcon /> : <GirlIcon />}
                    Gender : {course.Gender}
                </Typography>
            </CardContent>
        </Card >
    );
}
