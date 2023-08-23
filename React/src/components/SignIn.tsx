import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { useState } from 'react';


const defaultTheme = createTheme();

export default function SignIn() {
    const navigate = useNavigate();
    const [res, setRes] = useState<boolean | undefined>(true);
    let response;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const getValueOrDefault = (value: FormDataEntryValue | null, defaultValue: string) => {
            if (value instanceof File) {
                return defaultValue;
            }
            return value || '';
        };

        const email = getValueOrDefault(data.get('email'), 'DefaultEmail');
        const password = getValueOrDefault(data.get('password'), 'DefaultPassword');
        response = await loginUser(email, password);
        console.log(response);

        switch (response) {
            case true:
                navigate('/?success=false');
                break;
            case false:
                navigate('/?success=true');
                setRes(false);
                break;
            case 401:
                setRes(false);
                navigate("/sign-in");
                break;
            case 404:
                setRes(false);
                navigate("/sign-in");
                break;
            default:
                break;
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {res === false && <Alert severity="error">Email address or password not found!</Alert>}
            {res === undefined && <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOpenIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            {/* <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid> */}
                            <Grid item>
                                <Link href="/sign-up" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
