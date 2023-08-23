import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addComment, getDetails } from '../api/api';
import { useEffect, useState } from 'react';
import { Alert, DialogContentText } from '@mui/material';

const defaultTheme = createTheme();

export default function Contact() {
    const [status, setStatus] = useState(0);
    const [details, setDetails] = useState({
        firstName: '',
        address: '',
        email: '',
    });

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getDetails();
            // console.log(res);
            
            setDetails({
                firstName: res.firstName || '',
                address: res.address || '',
                email: res.email || '',
            });
        };

        fetchDetails();
    }, []);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setDetails((prev) => ({
            ...prev,
            [name as string]: value,
        }));
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const firstName = data.get('firstName') || '';
        const address = data.get('address') || '';
        const email = data.get('email') || '';
        const content = data.get('Content') || '';

        const res = await addComment({ firstName, email, address, content });
        console.log(res);
        setStatus(res);

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                {status === 201 ? ( // If status is 201, show the SuccessComponent
                    <DialogContentText />
                )
                    : <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Contact
                        </Typography>
                        {(status ===undefined) &&<Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Grid container >
                                <Grid item xs={12}>
                                    <TextField
                                        autoComplete="given-name"
                                        margin="normal"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        value={details.firstName}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="address"
                                        label="Address"
                                        name="address"
                                        value={details.address}
                                        onChange={handleChange}
                                        autoComplete="address"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        value={details.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        multiline
                                        rows={3}
                                        id="Content"
                                        label="Content"
                                        name="Content"
                                        autoFocus
                                    />
                                </Grid>
                            </Grid>

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Send
                            </Button>
                        </Box>
                    </Box>}
            </Container>
        </ThemeProvider>
    );
}
