import React, { useContext, ChangeEvent, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SharedContext from './SharedContext';
import { checkCreditDetails } from '../api/api';

export default function PaymentForm() {
  const contextValue = useContext(SharedContext);

  if (!contextValue) {
    throw new Error('SharedContext value is null');
  }

  const {
    totalSum,
    nameCard,
    setNameCard,
    setCardNumber,
    setExpDate,
    cvv,
    setCvv,
    rememberDetails,
    setRememberDetails,
    useStorageCreditDetails, setUseStorageCreditDetails,
    storageCreditDetails,setStorageCreditDetails
  } = contextValue;
  const [displayCardNumber, setDisplayCardNumber] = useState('');
  const [displayExpDate, setDisplayExpDate] = useState('');
  useEffect(() => {
    if (displayExpDate.length === 5) {
      const dateString = displayExpDate;
      const currentYear = new Date().getFullYear();

      const [month, year] = dateString.split("/");

      const formattedYear = currentYear - (currentYear % 100) + parseInt(year);
      const formattedDate = `20${formattedYear}-${month}-01`;

      const date = new Date(formattedDate);
      const lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const d = new Date(formattedYear, parseInt(month) - 1, lastDayInMonth);
      setExpDate(d);
    }
  }, [displayExpDate]);

  useEffect(() => {
    const fetchCreditDetails = async () => {
      const res = await checkCreditDetails();

      if (res.toString().length === 4) {
        setStorageCreditDetails(res);
      }
    };

    fetchCreditDetails();
  }, []);

  const handleNameChange = (value: string) => {
    const input = value.replace(/[^a-zA-Zא-ת]/g, ''); // Remove non-letter characters
    setNameCard(input);
  };

  const handleCvvChange = (value: string) => {
    const input = value.replace(/\D/g, ''); // Remove non-digit characters
    if (/^\d{0,3}$/.test(input)) {
      setCvv(input);
    }
  };

  const handleExpDate = (value: string) => {
    const input = value.replace(/[^0-9/]/g, '').substring(0, 5);
    let formattedInput = '';
    for (let i = 0; i < input.length; i++) {
      if (input.length === 3 && i === 2 && !input.includes("/")) {
        formattedInput += '/';
      }
      formattedInput += input.charAt(i);
    }
    if ((formattedInput.length === 2 && parseInt(formattedInput) > 12) || (formattedInput.length === 5 && new Date().getFullYear() >= ((Math.floor(new Date().getFullYear() / 100)) * 100) + parseInt(formattedInput.slice(3, 5)))) {
      setDisplayExpDate('');
      setExpDate(new Date()); // Reset expDate when displayExpDate is not valid
    } else {
      setDisplayExpDate(formattedInput);
    }
  };

  const handleCardNumberChange = (value: string) => {
    const input = value.replace(/[^0-9]/g, '');
    let formattedInput = '';

    for (let i = 0; i < input.length; i++) {
      if (i === 4 || i === 8 || i === 12) {
        formattedInput += ' ';
      }
      formattedInput += input.charAt(i);
    }

    if (formattedInput.length <= 19) {
      setCardNumber(formattedInput.trim());
      setDisplayCardNumber(formattedInput);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case 'nameCard':
        handleNameChange(value);
        break;
      case 'cardNumber':
        handleCardNumberChange(value);
        break;
      case 'expDate':
        handleExpDate(value);
        break;
      case 'cvv':
        handleCvvChange(value);
        break;
      case 'rememberDetails':
        setRememberDetails(event.target.checked);
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Total payment: {totalSum}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="nameCard"
            name="nameCard"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            value={nameCard}
            onChange={handleInputChange}
            variant="standard"
            disabled={useStorageCreditDetails}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cardNumber"
            name="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            value={displayCardNumber}
            onChange={handleInputChange}
            variant="standard"
            disabled={useStorageCreditDetails}
          />
        </Grid>
        <Grid item xs={0} md={6}>
          <TextField
            required
            id="expDate"
            name="expDate"
            label="Expiry date"
            fullWidth
            value={displayExpDate}
            onChange={handleInputChange}
            variant="standard"
            disabled={useStorageCreditDetails}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="cvv"
            name="cvv"
            label="CVV"
            helperText="Last three digits on signature strip"
            fullWidth
            autoComplete="cc-csc"
            value={cvv}
            onChange={handleInputChange}
            variant="standard"
            disabled={useStorageCreditDetails}
          />
        </Grid>
        <Grid item xs={12}>
          {storageCreditDetails > 0 ? (
            <div>
              <h3 style={{ color: 'blue' }}>OR:</h3>
              <FormControlLabel
                control={
                  <Checkbox color="secondary" name="useStorageCreditDetails" value={useStorageCreditDetails} onChange={() => { setUseStorageCreditDetails(!useStorageCreditDetails) }} />
                }
                label={`Use the credit information saved in system: ${"*".repeat(12)}${storageCreditDetails}`}
              />
            </div>
          ) : (
            <FormControlLabel
              control={<Checkbox color="secondary" name="rememberDetails" value={rememberDetails} onChange={handleInputChange} />}
              label="Remember credit card details for next time"
            />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
