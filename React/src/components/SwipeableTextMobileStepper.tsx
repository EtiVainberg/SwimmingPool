import React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import f from '../assets/SwimmingPool/shutterstock_254911351_utgelp.jpg'
import f1 from '../assets/SwimmingPool/DreamShaper_v7_A_swimming_pool_without_swimmers_with_a_lot_of_1.jpg'
import f2 from '../assets/SwimmingPool/DreamShaper_v7_Background_of_blue_water_with_bubbles_1.jpg'
import f3 from '../assets/SwimmingPool/water-top-1.jpg'

const images = [
    f, f1, f2, f3
];

function SwipeableTextMobileStepper() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = images.length;

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
        }, 10000);

        return () => clearInterval(interval);
    }, [maxSteps]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) =>
            prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1
        );
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                animation: 'slowMove 10s infinite',
                backgroundImage: `url(${images[activeStep]})`,
                backgroundSize: 'cover',
            }}
        >

            <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={maxSteps === 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button
                        size="small"
                        onClick={handleBack}
                        disabled={maxSteps === 1}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
            {/* <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr', // Single column
                gridTemplateRows: '1fr',
            }}> */}
            {/* <Grid container>
                    <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start' }}> */}
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',

                // position: 'fixed',
                // top: '50 %',
                // left: 0,
                // transform: 'translateX(-50 %)',
            }}>
            </div>
            {/* </Grid>
                </Grid> */}
            {/* </div> */}

        </Box >
    );
}

export default SwipeableTextMobileStepper;
