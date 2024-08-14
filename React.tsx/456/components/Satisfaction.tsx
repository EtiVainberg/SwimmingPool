import React, { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from 'recharts'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import { addSatisfaction, checkSatisfaction, getSatisfaction } from '../api/api'
import { Alert, TextField, Typography } from '@mui/material'
import { Button } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';

export default function Satisfaction() {
    const [addToday, setAddToday] = useState<number | undefined>(0);
    const [scatterChartData, setScatterChartData] = useState<any[] | undefined>(undefined);
    const [chartData, setChartData] = useState<any[] | undefined>(undefined);
    const [sent, setSent] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const handleResponse = (response: number | undefined) => {
        console.log(response + " resp");

        switch (response) {
            case 201:
                setOpen(true);
                setSent("Thank you about your feedback!")//enable to add satisfaction
                break;
            case 409:
                setAddToday(409);
                break;
            case undefined:
                setAddToday(undefined);
                break;
            case 401:
                setAddToday(401);
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        if (sent === null) {
            const fetchSatisfactionData = async () => {
                const res = await checkSatisfaction();
                handleResponse(res == 200 ? 0 : res);

                const response = await getSatisfaction();
                // handleResponse(response);

                const averages = calculateAverage(response);
                setChartData([
                    { name: 'Service', value: averages.Service },
                    { name: 'Availability', value: averages.Availability },
                    { name: 'Cleanly', value: averages.Cleanly },
                    { name: 'lessons', value: averages.lessons },
                    { name: 'Staff', value: averages.Staff },
                ]);
                setScatterChartData([
                    { x: 'Availability', y: averages.Availability },
                    { x: 'Cleanly', y: averages.Cleanly },
                    { x: 'Service', y: averages.Service },
                    { x: 'Staff', y: averages.Staff },
                    { x: 'lessons', y: averages.lessons },
                ]);
            }

            fetchSatisfactionData();
        }
    }, []);

    const calculateAverage = (data: any[]) => {
        const averages: any = {};
        const paramKeys = ['Service', 'Availability', 'Cleanly', 'lessons', 'Staff'];

        paramKeys.forEach((param) => {
            const sum = data.reduce((acc, item) => acc + item[param], 0);
            averages[param] = sum / data.length;
        });

        return averages;
    };





    const getRandomColor = () => {
        const letters = '0123456789ABCDEF'
        let color = '#'
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)]
        }
        return color
    }

    const getChartComponent = (data: any[] | undefined, type: string) => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart width={600} height={400} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {data?.map((_entry: any, index: any) => (
                                <Cell key={`cell-${index}`} fill={getRandomColor()} />
                            ))}
                        </Bar>
                    </BarChart>
                )
            case 'line':
                return (
                    <LineChart width={600} height={400} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line dataKey="value" stroke={getRandomColor()} />
                    </LineChart>
                )
            case 'scatter':
                return (
                    <div>
                        <ScatterChart width={600} height={400}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" />
                            <YAxis dataKey="y" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter data={scatterChartData} fill={getRandomColor()} />
                        </ScatterChart>
                    </div>
                );

            default:
                return null
        }
    }

    const [chartType, setChartType] = useState('bar')
    const [satisfaction, setSatisfaction] = useState({
        Service: 0,
        Availability: 0,
        Cleanly: 0,
        lessons: 0,
        Staff: 0,
    });

    const handleChartType = (
        _event: any,
        newChartType: React.SetStateAction<string> | null,
    ) => {
        if (newChartType !== null) {
            setChartType(newChartType)
        }
    }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setSatisfaction((prevSatisfaction) => ({
            ...prevSatisfaction,
            [name as number]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await addSatisfaction(
            satisfaction.Service,
            satisfaction.Availability,
            satisfaction.Cleanly,
            satisfaction.lessons,
            satisfaction.Staff
        );
        const averages = calculateAverage(response[0]); // Calculate new averages
        setChartData([
            { name: 'Service', value: averages.Service },
            { name: 'Availability', value: averages.Availability },
            { name: 'Cleanly', value: averages.Cleanly },
            { name: 'lessons', value: averages.lessons },
            { name: 'Staff', value: averages.Staff },
        ]);
        handleResponse(response[1]);
    }

    return (
        <>
            <div style={{ width: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',marginLeft:'10vw' }}>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={handleChartType}
                    aria-label="chart type"
                    fullWidth
                >
                    {['bar', 'line', 'scatter'].map((type) => (
                        <ToggleButton key={type} value={type} aria-label="left aligned">
                            {type}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                {getChartComponent(
                    chartType === 'bar'
                        ? chartData // Use chartData instead of barChartData
                        : chartType === 'line'
                            ? chartData // Use chartData instead of lineChartData
                            : chartData, // Use chartData instead of scatterChartData
                    chartType
                )}
            </div>
            {addToday === 0 && sent === null ? (<><br /><Typography component="h1" variant="h5">
                You can share us your satisfaction
            </Typography>
                <form onSubmit={handleSubmit}>
                    <div id="satisfaction" style={{ display: 'flex' }}>

                        <TextField
                            type="number"
                            label="Service"
                            name="Service"
                            value={satisfaction.Service}
                            onChange={handleChange}
                            autoFocus
                            fullWidth
                            required
                            inputProps={{
                                min: 1,
                                max: 100
                            }} />

                        <TextField
                            type="number"
                            label="Availability"
                            name="Availability"
                            value={satisfaction.Availability}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 1,
                                max: 100
                            }} />

                        <TextField
                            type="number"
                            label="Cleanly"
                            name="Cleanly"
                            value={satisfaction.Cleanly}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 1,
                                max: 100
                            }} />

                        <TextField
                            type="number"
                            label="lessons"
                            name="lessons"
                            value={satisfaction.lessons}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 1,
                                max: 100
                            }} />

                        <TextField
                            type="number"
                            label="Staff"
                            name="Staff"
                            value={satisfaction.Staff}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 1,
                                max: 100
                            }} />
                        <Button type="submit" variant="contained">
                            submit
                        </Button>
                    </div>
                </form>
            </>) : addToday === 409 ?
                <Alert severity="warning">   🌟 🌟Share a feedback Once a day  🌟 🌟</Alert> :
                addToday === 401 ? < Alert severity="info">To send feedback go <a href="/sign-in" style={{ textDecoration: 'underline', color: 'blue ' }}>SignIn🔒</a></Alert > :
                    addToday === undefined ? <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert> : null}
            <div />
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity={'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {sent}
                </Alert>
            </Snackbar>
        </>
    )
}
