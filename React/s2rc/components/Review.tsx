import { useContext } from "react";
import SharedContext from "./SharedContext";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { format } from 'date-fns';
import dayjs from "dayjs";


export default function Review(res: any) {
  console.log(res, res.EndDate);
  const startDate = dayjs(res.StartDate).format('DD-MM-YYYY HH:MM');
  const endDate = dayjs(res.EndDate).format('DD-MM-YYYY HH:MM');
  console.log(endDate,startDate,res.StartDate,res.EndDate);
  
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
          <HourglassEmptyIcon /> Start Date: {startDate}
        </Typography>
        <Typography sx={{ fontSize: 20 }} style={{ color: '#356576' }} gutterBottom>
          <HourglassEmptyIcon /> End Date: {endDate}
        </Typography>
        <Typography  sx={{ fontSize: 20, textAlign: 'center',color: '#1976d2' }}>
           Pay Details:
        </Typography>
        <Typography sx={{ fontSize: 20 }} color="#356576">
        <PaymentIcon /> {useStorageCreditDetails && `CardNumber: ${"*".repeat(12)}${storageCreditDetails}`}
        </Typography>
        {!useStorageCreditDetails &&<>
         <PaymentIcon />  <Typography color='#356576' sx={{ fontSize: 20 }}>
            cardNumber : {cardNumber.substring(cardNumber.length - 4)}
          </Typography></>
        }
        <Typography sx={{ fontSize: 20 }}  color='#356576'>
          <MonetizationOnIcon />  TotalSum: {totalSum}
        </Typography>
      </CardContent>
    </Card ></>
  );
}
