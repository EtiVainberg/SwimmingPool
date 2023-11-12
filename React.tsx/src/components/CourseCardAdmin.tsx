import { useEffect, useState } from 'react';
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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';import HowToRegIcon from '@mui/icons-material/HowToReg';
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


export default function CourseCardAdmin(props: any) {
  // console.log("prop",props);
  const date=new Date();
  const EndDate=new Date(props.prop.EndDate);
  const [openDialog, setOpenDialog] = useState(false);
  const isRegistrationFull = props.prop.capacity <= props.prop.register;
  const [capacity,setCapacity]=useState(props.prop.capacity);
  const [dateOver,setDateOver]= useState<boolean>(EndDate<date);
  const handleDialogToggle = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(()=>{
    setCapacity(capacity);
  },[capacity]);

  const randomImageIndex = Math.floor(Math.random() * images.length);
  const randomImage = images[randomImageIndex];

  return (
    <Card sx={{ maxWidth: 500 }} >
      <CardMedia sx={{ height: 300, width: 300 }} image={randomImage} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <SupervisedUserCircleIcon /> {props.prop.CoursesType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.prop.Gender === 'Male' ? <BoyIcon /> : <GirlIcon />}Gender: {props.prop.Gender}
        </Typography>
        <Typography variant="body2" color="text.secondary" ><PeopleAltIcon /> Capacity: {props.prop.capacity}</Typography>
       <Typography variant="body2" color="text.secondary"><HowToRegIcon /> Register: {props.prop.register}</Typography>

      </CardContent>
      <CardActions>
        {EndDate<date?<Button size="small" onClick={handleDialogToggle}  style={{color:'orange'}} >
          The Course finished
        </Button>
        :isRegistrationFull ? <Button size="small" onClick={handleDialogToggle}  style={{color:'red'}} >
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
