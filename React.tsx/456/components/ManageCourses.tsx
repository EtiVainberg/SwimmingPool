import { useEffect, useState } from 'react'
import { checkIsManager, getManageCourses } from '../api/api'
import { Box } from '@mui/material'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CourseCardAdmin from './CourseCardAdmin'

export interface Course {
    CoursesType: string
    EndDate: Date
    Gender: string
    NumberOfMeeting: number
    StartDate: Date
    TeacherName: string
    __v: number
    _id: string
    capacity: number
    duration: number
    price: number
    register: number
}

export default function ManageCourses() {

    const [courses, setCourses] = useState<Array<Course> | []>();
    const [deleted, setDeleted] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchIsManager = async () => {
            const res = await checkIsManager();
            if (res != 200)
                navigate('/sign-in');
        };
        fetchIsManager();

        const fetchCourses = async () => {
            const res = await getManageCourses();
            setCourses(res);
        }
        fetchCourses();
    }, [,deleted])

    const handleSubmit = () => {
        navigate('/AddCourse')
    }

    return (
        <>
            <Box>
                <br />
                <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    style={{ marginTop: '1rem', marginBottom: '1rem' }}
                    onClick={handleSubmit}
                >
                    Add Courses
                </Button>

                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginTop: '5%',
                        gap: '20px',
                    }}
                >
                    {courses?.sort((a: Course, b: Course) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime()).map((cardData: any, index: number) => (
                        <CourseCardAdmin key={index} prop={cardData} deleted={deleted} setDeleted={ setDeleted} />
                    ))}
                </div>
            </Box>
        </>
    )
}
