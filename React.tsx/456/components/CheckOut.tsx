import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './SubscriptionSettings';
import PaymentForm from './PaymentForm';
import Review from './Review';
import { Fragment } from 'react';
import SharedContext from './SharedContext';
import { GetCookie, addPaymentDetails, addSubscribe, checkIsSubscribe, getPrice } from '../api/api';
import { useNavigate } from 'react-router-dom';
import BootstrapDialogTitle from './BootstrapDialogTitle';
import { Alert } from '@mui/material';
import baloons from '../assets/SwimmingPool/baloons.gif'
const steps = ['SubscriptionSettings', 'Payment details', 'Review your subscription'];

function getStepContent(step: number, res: any) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review res={res} />;
    default:
      throw new Error('Unknown step');
  }
}

const defaultTheme = createTheme();

export default function Checkout() {
  const [res, setRes] = useState<any>(null); // Define the "res" state
  const navigate = useNavigate();
  const [totalSum, setTotalSum] = useState(0);
  const [nameCard, setNameCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState(new Date());
  const [cvv, setCvv] = useState('');
  const [rememberDetails, setRememberDetails] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [duration, setDuration] = useState('');
  const [useStorageCreditDetails, setUseStorageCreditDetails] = useState(false);
  const [storageCreditDetails, setStorageCreditDetails] = useState(0);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [error, setError] = useState<boolean | string>(false);

  useEffect(() => {
    const fetchIsSubscribe = async () => {
      const isSubscribe = await checkIsSubscribe();
      switch (isSubscribe) {
        case true:
          setIsSubscribe(true);
          setError(false);
          break;
        case false:
          setIsSubscribe(false);
          setError(false);
          break;
        case 401:
          setError(false)
          setIsSubscribe(false);
          break;
        case undefined:
          setError(true)
          setIsSubscribe(false);
          break;
        default:
          break;
      }
    }
    fetchIsSubscribe();
  }, []);


  const handleNext = async () => {
    if (activeStep === 0) {
      const price = await getPrice(duration);
      setError(price === undefined ? true : false)
      setTotalSum(price);
    }
    if (activeStep === 1) {
      const response = await addSubscribe(duration);
      setError(response === undefined ? true : false)
      setRes(response);

      if (rememberDetails) {
        const resStatus = await addPaymentDetails(nameCard, cardNumber, expDate, cvv);
        switch (resStatus) {
          case 201:
            setActiveStep(activeStep + 1);
            break;
          case 401:
            navigate('/sign-in');
            break;
          default:
            setError(true);
            break;
        }
      }
      setActiveStep(activeStep + 1);

    } else {
      setActiveStep(activeStep + 1);

    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      {isSubscribe && <Alert severity="error">You Already have an active subscription!!</Alert>}
      {error && <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}

      <CssBaseline />
      <AppBar position="absolute" color="default" elevation={0} sx={{ position: 'relative', borderBottom: (t) => `1px solid ${t.palette.divider}` }} />
      {activeStep === steps.length ? (
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="h3" gutterBottom color={'red'}>
            We wish you a lot of fun!!
          </Typography>
          <img src={baloons} />
        </Box>
      ) :
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              Subscription Create
            </Typography>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <SharedContext.Provider
              value={{
                totalSum,
                setTotalSum,
                nameCard,
                setNameCard,
                cardNumber,
                setCardNumber,
                expDate,
                setExpDate,
                cvv,
                setCvv,
                rememberDetails,
                setRememberDetails,
                duration,
                setDuration,
                useStorageCreditDetails,
                setUseStorageCreditDetails,
                storageCreditDetails,
                setStorageCreditDetails
              }}
            >

              <Fragment>
                {getStepContent(activeStep, res)}
                {activeStep === 0 && !GetCookie() && <BootstrapDialogTitle />}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }} disabled={error === true || activeStep === 2}>
                      Back
                    </Button>
                  )}
                  <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }} disabled={(error === true) || (activeStep === 0 && isSubscribe) || (activeStep === 1 && ((!useStorageCreditDetails) && (nameCard === '' || cardNumber.length < 16 || expDate === new Date() || cvv.length < 3)))}>
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Box>
              </Fragment>

            </SharedContext.Provider>
          </Paper>
        </Container>}
    </ThemeProvider>
  );
}