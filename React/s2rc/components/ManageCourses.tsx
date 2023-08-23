import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { FormControl, InputLabel, TextField, Select, MenuItem, Button, Grid, Typography, Alert } from '@mui/material';
import { addCourse, getCoursesType } from '../api/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);

const defaultTheme = createTheme();

export default function ManageCourses() {
    const nav = useNavigate();
    const [fail, setFail] = useState(false);
    const [CoursesType, setCoursesType] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState({
        startDate: false,
        endDate: false
    });

    useEffect(() => {
        const checkAdminStatus = async () => {
            const res = await getCoursesType();
            switch (res) {
                case 403:
                    nav('/');
                    break;
                case 401:
                    nav('signin');
                    break;
                default:
                    setCoursesType(res);
                    break;
            }
        };
        checkAdminStatus();
    }, []);

    const [course, setCourse] = useState({
        CourseName: '',
        TeacherName: '',
        NumberOfMeeting: 1,
        CoursesType: '',
        Gender: 'Male',
        StartDate: null as Dayjs | null,
        EndDate: null as Dayjs | null,
        duration: 1,
        price: 1,
        capacity: 1,
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Perform form submission validation
        if (!course.StartDate) {
            setFormErrors((prevErrors) => ({ ...prevErrors, startDate: true }));
        } else if (!course.EndDate || course.EndDate.isBefore(course.StartDate)) {
            setFormErrors((prevErrors) => ({ ...prevErrors, endDate: true }));
        } else {
            const startDate = course.StartDate ? course.StartDate.toISOString() : new Date().toISOString();
            const endDate = course.EndDate ? course.EndDate.toISOString() : new Date().toISOString();
            console.log(new Date(startDate), new Date(endDate));

            const res = await addCourse(course.TeacherName, course.NumberOfMeeting, course.CoursesType, course.Gender, new Date(startDate), new Date(endDate), course.duration, course.price, course.capacity);
            console.log(res,"rfg");

            setFormErrors({ startDate: false, endDate: false });
            let [newCourse, schedule] = [, ''];
            if (res != false) {
                setFail(false);
                [newCourse, schedule] = res;
                nav('/courseSchedule', { state: { res } });
            }
            else {
                setFail(true);
                setFormErrors({ startDate: true, endDate: true });
            }

        }
    };


    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name as string]: value,
        }));
    };

    const handleDateTimeChange = (date: Dayjs | null, name: string) => {
        const updatedCourse = { ...course };

        switch (name) {
            case 'StartDate':
                updatedCourse.StartDate = date;
                setFormErrors((prevErrors) => ({ ...prevErrors, startDate: !date }));
                break;
            case 'EndDate':
                updatedCourse.EndDate = date;
                setFormErrors((prevErrors) => ({
                    ...prevErrors,
                    endDate: date ? (updatedCourse.StartDate ? date.isBefore(updatedCourse.StartDate) : false) : false,
                }));
                break;
            default:
                break;
        }

        setCourse(updatedCourse);
    };



    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {fail && formErrors.startDate && formErrors.endDate && (<Alert variant="filled" severity="error">
                        It is not possible to add the course at this time!!!
                    </Alert>)}
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Teacher Name"
                                    name="TeacherName"
                                    value={course.TeacherName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="course-label">Course Type</InputLabel>
                                    <Select
                                        label="course-label"
                                        id="course"
                                        name="CoursesType"
                                        value={course.CoursesType || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        {CoursesType.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        id='gender'
                                        name="Gender"
                                        value={course.Gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Start Date"
                                                value={course.StartDate}
                                                onChange={(date) => handleDateTimeChange(date, 'StartDate')}
                                                disablePast
                                                format="DD/MM/YYYY hh:mm A"
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item>
                                        {formErrors.startDate && !fail && (
                                            <Typography variant="caption" color="error">
                                                Start Date is required
                                            </Typography>
                                        )}
                                        {formErrors.startDate && formErrors.endDate && fail && (
                                            <Typography variant="caption" color="error">
                                                Change date
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="End Date"
                                                value={course.EndDate}
                                                onChange={(date) => handleDateTimeChange(date, 'EndDate')}
                                                disablePast
                                                minDateTime={course.StartDate}
                                                format="DD/MM/YYYY"
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item>
                                        {formErrors.endDate && !fail && (
                                            <Typography variant="caption" color="error">
                                                End Date is required
                                            </Typography>
                                        )}
                                        {formErrors.startDate && formErrors.endDate && fail && (
                                            <Typography variant="caption" color="error">
                                                Change Date
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Duration (hours)"
                                    type="number"
                                    name="duration"
                                    value={course.duration}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1,
                                        max: 10
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Capacity"
                                    type="number"
                                    name="capacity"
                                    value={course.capacity}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1,
                                        max: 250
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Price"
                                    type="number"
                                    name="price"
                                    value={course.price}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Add Course
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </ThemeProvider >
    );
}
