import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import image1 from "../assets/SwimmingPool/water-top-1.jpg";
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AlertDialogSlide from './AlertDialogSlide';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';

export default function CourseCard(props: any) {
  const [openDialog, setOpenDialog] = useState(false);
  const isRegistrationFull = props.prop.capacity === props.prop.register;

  const handleDialogToggle = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <Card sx={{ maxWidth: 500 }} >
      <CardMedia sx={{ height: 300, width: 300 }} image={image1} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <SupervisedUserCircleIcon /> {props.prop.CoursesType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.prop.Gender === 'Male' ? <BoyIcon /> : <GirlIcon />}Gender: {props.prop.Gender}
        </Typography>
      </CardContent>
      <CardActions>
        {isRegistrationFull ? <Button size="small" onClick={handleDialogToggle} disabled={isRegistrationFull} style={{color:'revert-layer'}} >
          Registration is complete
        </Button> :
          <Button size="small" onClick={handleDialogToggle}>
            More Details
          </Button>}
      </CardActions>
      {openDialog && <AlertDialogSlide prop={props.prop} onClose={handleDialogToggle} />}
    </Card>
  );
}
