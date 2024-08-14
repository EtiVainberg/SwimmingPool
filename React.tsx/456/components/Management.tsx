import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import image from "../assets/SwimmingPool/DreamShaper_v7_A_swimming_pool_without_swimmers_with_a_lot_of_1.jpg"
import image2 from "../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_1.jpg"
import image3 from "../assets/SwimmingPool/water-droplets-blue-water-drops-splashes-drop-water-close-up-blue-water-drop-macro-1024x596.jpg"
import { useEffect } from 'react';
import { checkIsManager } from '../api/api';
const images = [
    {
        url: image,
        title: 'Users',
        width: '33.3333%',
        navigateTo: "/manageUsers",
    },
    {
        url: image2,
        title: 'Courses',
        width: '33.3333%',
        navigateTo: "/manageCourses",
    },
    {
        url: image3,
        title: 'Contact',
        width: '33.3333%',
        navigateTo: "/manageContact",
    },
];

const ImageButton = styled(ButtonBase)(({ }) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));

export default function Management() {
    const nav = useNavigate();

    const handleImageClick = (navigateTo: string) => {
        nav(navigateTo);
    };

    useEffect(() => {
        const fetchIsManager = async () => {
            const res = await checkIsManager();
            if (res != 200)
                nav('/sign-in');
        };
        fetchIsManager();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '90vw', height: '90vh', overflow: 'hidden' }}>
            {images.map((image) => (
                <ImageButton
                    focusRipple
                    key={image.title}
                    style={{
                        width: image.width,
                    }}
                    onClick={() => handleImageClick(image.navigateTo)}
                >
                    <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                    <ImageBackdrop className="MuiImageBackdrop-root" />
                    <Image>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="inherit"
                            sx={{
                                fontFamily: 'revert', fontSize: 'larger',
                                position: 'relative',
                                p: 6,
                                pt: 4,
                                pb: (theme) => `calc(${theme.spacing(1)} + 15px)`,
                            }}
                        >
                            {image.title}
                            <ImageMarked className="MuiImageMarked-root" />
                        </Typography>
                    </Image>
                </ImageButton>
            ))}
        </Box>
    );
}
