import { useContext } from "react";
import SharedContext from "./SharedContext";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

import dayjs from "dayjs";


export default function Review(res: any) {
  const startDate = dayjs(res.res.StartDate).format('DD-MM-YYYY HH:mm');
  const endDate = dayjs(res.res.EndDate).format('DD-MM-YYYY HH:mm');

  const contextValue = useContext(SharedContext);

  if (!contextValue) {
    throw new Error('SharedContext value is null');
  }

  const {
    cardNumber,
    useStorageCreditDetails,
    totalSum,
    storageCreditDetails,
    duration
  } = contextValue;


  return (<>
    <Card sx={{ minWidth: 275, textAlign: 'left' }}>
      <CardContent>
        <Typography sx={{ fontSize: 20, textAlign: 'center' }} style={{ color: '#1976d2' }} gutterBottom>
          Type of Your Subscription: {duration}
        </Typography>
        <Typography sx={{ fontSize: 20 }} style={{ color: '#356576' }} gutterBottom>
          <HourglassTopIcon /> <b>Start Date:</b> {startDate}
        </Typography>
        <Typography sx={{ fontSize: 20 }} style={{ color: '#356576' }} gutterBottom>
          <HourglassBottomIcon /> <b>End Date:</b> {endDate}
        </Typography>
        <Typography sx={{ fontSize: 20, textAlign: 'center', color: '#1976d2' }}>
          Pay Details:
        </Typography>
        <Typography color='#356576' sx={{ fontSize: 20 }}>
          <PaymentIcon /><b>  CardNumber </b>(end with digits): {!useStorageCreditDetails ? cardNumber.substring(cardNumber.length - 4) : "*".repeat(12) + storageCreditDetails}
        </Typography>
        <Typography sx={{ fontSize: 20 }} color='#356576'>
          <MonetizationOnIcon />  <b>TotalSum:</b> {totalSum}
        </Typography>
      </CardContent>
    </Card ></>
  );
}
