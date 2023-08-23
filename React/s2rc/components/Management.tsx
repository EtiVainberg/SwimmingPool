// import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import image from "../assets/SwimmingPool/DreamShaper_v7_A_swimming_pool_without_swimmers_with_a_lot_of_1.jpg"
import image2 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_1.jpg"
import image3 from "../assets/SwimmingPool/water-droplets-blue-water-drops-splashes-drop-water-close-up-blue-water-drop-macro-1024x596.jpg"
// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';




// interface ExpandMoreProps extends IconButtonProps {
//     expand: boolean;
// }

// const ExpandMore = styled((props: ExpandMoreProps) => {
//     const { expand, ...other } = props;
//     return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//     transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//         duration: theme.transitions.duration.shortest,
//     }),
// }));

export default function Management() {
    const nav = useNavigate();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const cards = [
        { Avatar: "U", color: blue[100], tytle: "See All Users", image: image, navigate: "/users" },
        { Avatar: "M", color: blue[400], tytle: "Manage Courses", image: image2, navigate: "/manageCourses" },
        { Avatar: "C", color: blue[900], tytle: "Comments", image: image3, navigate: "/comments" },


    ]

    // const [expanded, setExpanded] = useState(false);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: '25px', cursor: 'pointer',marginTop:'5%' }}>
            {cards.map((card) => (
                <Card sx={{ maxWidth: 345, marginBottom: '16px' }} onClick={() => { nav(card.navigate) }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: card.color }} aria-label="recipe">
                                {card.Avatar}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={card.tytle}
                        subheader={formattedDate}
                    />
                    <CardMedia
                        component="img"
                        height="450"
                        image={card.image}
                    //alt="Paella dish"
                    />
                    {/* <CardContent>
                    
                </CardContent> */}
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>
                    </CardActions>
                </Card>
            ))}
        </div>

    );
}