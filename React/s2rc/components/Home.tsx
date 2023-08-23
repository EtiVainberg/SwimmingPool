import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Outlet, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PoolIcon from '@mui/icons-material/Pool';
import SwipeableTextMobileStepper from './SwipeableTextMobileStepper';
import logo from '../assets/SwimmingPool/logo.png';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/system';
import '../css/Home.css';
import CloseIcon from '@mui/icons-material/Close';
import WeatherWidget from './WeatherWidget';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { GetCookie, checkIsManager } from '../api/api';
import AccountMenu from './AccountMenu';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';


function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [isManager, setIsManager] = useState<boolean>(false);
    const [showAccountMenu, setShowAccountMenu] = useState(true);


    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const CustomIconButton = styled(IconButton)({
        color: '#1976d2',
    });

    const handleNavigation2 = () => {
        navigate('/');
    };

    const showInHome = location.pathname === '/';

    const fetchIsManager = async () => {

        const res = await checkIsManager();
        if (res == 200)
            setIsManager(true);
        else {
            setIsManager(false);
        }
    };

    useEffect(() => {

        fetchIsManager();
        // Show the modal after 20 seconds
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 20000); // 20 seconds

        // Close the modal after 10 seconds
        const closeTimer = setTimeout(() => {
            setShowModal(false);
        }, 10000); // 10 seconds

        return () => {
            clearTimeout(timer); // Clean up the timer on unmount
            clearTimeout(closeTimer); // Clean up the close timer on unmount
        };

    }, []);

    useEffect(() => {
        // Check if the user has just signed in successfully
        const queryParams = new URLSearchParams(location.search);
        const isSignInSuccess = queryParams.get('success');

        if (isSignInSuccess === 'true') {
            // Update the isManager state when the user signs in successfully
            setIsManager(true);
            navigate('/management');
        }
        setShowAccountMenu(true);
        fetchIsManager();
    }, [location.search]);

    return (
        <Fragment>
            {showInHome && <SwipeableTextMobileStepper />}

            <BottomNavigation
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 999,
                    backgroundColor: '#ffffff',
                }}
                showLabels
            >
                <CustomIconButton onClick={handleNavigation2}>
                    <img src={logo} width={55} alt="Logo" />
                </CustomIconButton>
                <BottomNavigationAction
                    label="Sign-In"
                    icon={<LockOutlinedIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/sign-in')}
                />
                <BottomNavigationAction
                    label="Subscription"
                    icon={<FavoriteIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/check-out')}
                />
                <BottomNavigationAction
                    label="Courses"
                    icon={<PoolIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/courses')}
                />
                <BottomNavigationAction
                    label="Contact"
                    icon={<ContactSupportIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/contact')}
                />
                <BottomNavigationAction
                    label="Schedule"
                    icon={<CalendarMonthIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/schedule')}
                />
                <BottomNavigationAction
                    label="Satisfaction"
                    icon={<EqualizerIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/satisfaction')}
                />
                <BottomNavigationAction
                    label="About"
                    icon={<InfoIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/about')}
                />
                {isManager && <BottomNavigationAction
                    label="Management"
                    icon={<InfoIcon />}
                    style={{ color: '#1976d2' }}
                    onClick={() => handleNavigation('/management')}
                />}
                {GetCookie() && <AccountMenu showAccountMenu={showAccountMenu} setShowAccountMenu={setShowAccountMenu} setIsManager={setIsManager} />}
            </BottomNavigation>
            <Outlet />
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '8px' }}>
                    <IconButton className="close-button" onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <ThermostatIcon className="weather-icon" sx={{ fontSize: 50 }} />
                    <WeatherWidget />
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default Home;
