
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AlertDialogSlide from './AlertDialogSlide';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import image1 from "../assets/SwimmingPool/water-top-1.jpg";
import image2 from "../assets/SwimmingPool/water-droplets-blue-water-drops-splashes-drop-water-close-up-blue-water-drop-macro-1024x596.jpg";
import image3 from "../assets/SwimmingPool/shutterstock_254911351_utgelp.jpg";
import image4 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_2.jpg";
import image5 from "../assets/SwimmingPool/DreamShaper_v7_Swimming_pool_without_swimmers_with_grass_aroun_2.jpg";
import image6 from "../assets/SwimmingPool/DreamShaper_v7_A_swimming_pool_without_swimmers_with_a_lot_of_2.jpg";
import image7 from "../assets/SwimmingPool/DreamShaper_v7_A_swimming_pool_without_swimmers_with_a_view_in_2.jpg";
import image8 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_1.jpg";
import image9 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_3.jpg";
import image10 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_shifts_and_bubble_1.jpg";

const images = [image1, image2, image3, image3, image4, image5, image6, image7, image8, image9, image10];

export default function CourseCard(props: any) {

  const [openDialog, setOpenDialog] = useState(false);
  const isRegistrationFull = props.prop.capacity <= props.prop.register;
  const show = props.prop.CoursesType != 'SwimmingForSubscribers' && props.prop.CoursesType != 'Free swimming';


  const handleDialogToggle = () => {
    setOpenDialog(!openDialog);
  };

  const randomImageIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomImageIndex];

  return (
    <Card sx={{ maxWidth: 500 }}>
      <CardMedia sx={{ height: 300, width: 300 }} image={randomImage} />
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography gutterBottom variant="h6" component="div">
          <SupervisedUserCircleIcon /> {props.prop.CoursesType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.prop.Gender === 'Male' ? <BoyIcon /> : <GirlIcon />}Gender: {props.prop.Gender}
        </Typography>
      </CardContent>
      <CardActions>
        {isRegistrationFull ? <Button size="small" onClick={handleDialogToggle} disabled={isRegistrationFull} style={{ color: 'red' }} >
          Registration is complete
        </Button> :
          <Button size="small" onClick={handleDialogToggle} >
            More Details
          </Button>}
      </CardActions>
      {openDialog && <AlertDialogSlide prop={props.prop} show={show} onClose={handleDialogToggle} />}
    </Card>
  );
}
