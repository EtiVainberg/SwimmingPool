import { useEffect, useState } from "react";
import { getCourses } from "../api/api";
import CourseCard from "./CourseCard";
import { Alert } from "@mui/material";

export default function Courses() {
    const [courses, setCourses] = useState<[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await getCourses();
            setCourses(res);
        };
        fetchCourses();
    }, []);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap',justifyContent:'center',marginTop:'5%', gap: '20px' }}>

            {courses === undefined ? (
                <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>
            ) : courses.length === 0 ? <Alert severity="info">
                No Course Was Found!! <a href="/" style={{ color: 'blue' }}>〰️〰️🌊Go Home〰️〰️</a>
            </Alert> : courses.length > 0 && courses.map((course) => (
                <CourseCard key={1} prop={course} />
            ))}

        </div>
    );
}
