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
import { registerUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Alert from '@mui/material/Alert';

// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [res, setRes] = useState<boolean | undefined | number>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const getValueOrDefault = (value: FormDataEntryValue | null, defaultValue: string) => {
        if (value instanceof File) {
          return defaultValue;
        }
        return value || '';
      };

      const firstName = getValueOrDefault(data.get('firstName'), 'DefaultFirstName');
      const lastName = getValueOrDefault(data.get('lastName'), 'DefaultLastName');
      const email = getValueOrDefault(data.get('email'), 'DefaultEmail');
      const phone = getValueOrDefault(data.get('phone'), 'DefaultPhone');
      const address = getValueOrDefault(data.get('address'), 'DefaultAddress');
      const password = getValueOrDefault(data.get('password'), 'DefaultPassword');

      const res = await registerUser(firstName, lastName, email, phone, address, password);
      switch (res) {
        case true:
          navigate('/?success=false');
          break;
        case false:
          setRes(false);
          navigate('/?success=true');
          break;
        case 409:
          setRes(409);
          //navigate('/?success=false');
          break;
        default:
          // setRes(undefined);
          // navigate("/sign-up");
          break;

      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > {res===true && <Alert severity="error">User already exist!!</Alert>}
          {res === undefined && <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}
          {res === 409 && <Alert severity="error">Change email or password</Alert>}

          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOpenIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  inputProps={{
                    pattern: "[A-Za-zא-ת]+", // Only accept letters (no numbers or special characters)
                    title: "Please enter only letters", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  inputProps={{
                    pattern: "[A-Za-zא-ת]+", // Only accept letters (no numbers or special characters)
                    title: "Only letters", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
              <Grid item xs={12} >
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputProps={{
                    pattern: "^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$", // Only accept letters (no numbers or special characters)
                    title: "Adjust to this pattern  john@example.com", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone"
                  name="phone"
                  autoComplete="phone"
                  inputProps={{
                    pattern: "[0-9]{9,10}", // Only accept letters (no numbers or special characters)
                    title: "9 or 10 digits", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  autoComplete="address"
                  inputProps={{
                    pattern: "^[a-zA-Z ]+[0-9]$",
                    title: "Adjust to this pattern: Your address XXX(number of building)", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputProps={{
                    pattern: "^.{6,8}$",
                    title: "Lengthed 6-8 chars", // Error message to display when pattern doesn't match
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

