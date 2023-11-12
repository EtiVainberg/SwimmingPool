import { useEffect, useState } from 'react'
import { getManageCourses, getCourses } from '../api/api'
import CourseCard from './CourseCard'
import { Box, Grid, createTheme } from '@mui/material'
import { Button, Container, ThemeProvider } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import CourseCardAdmin from './CourseCardAdmin'

const defaultTheme = createTheme();


export default function ManageCourses() {
  const [courses, setCourses] = useState<[]>([])
  const navigate = useNavigate();
  useEffect(() => {

    const fetchCourses = async () => {
      const res = await getManageCourses()

      setCourses(res)
      console.log(courses);
      
    }
    fetchCourses()
  }, [])

  const handleSubmit = () => {
    navigate('/AddCourse')
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '5%',
          gap: '20px',
        }}
      >
        {courses.map((cardData: any, index: number) => (
          <CourseCardAdmin key={index} prop={cardData} />
        ))}
      </div>
      <ThemeProvider theme={defaultTheme}>
      <Container >
      <Box>
        <Button
          color="primary"
          type="submit"
          // variant="contained"
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
          onClick={handleSubmit}
        >
          Add Courses
        </Button>
        </Box>
            </Container>
        </ThemeProvider>
    </>
  )
}
