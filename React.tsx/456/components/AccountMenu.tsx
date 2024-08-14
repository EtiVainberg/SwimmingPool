import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Fragment, MouseEvent } from 'react';
import { GetCookie, RemoveCookie, getAmountNewReply, getDetails } from '../api/api';
import { useNavigate } from 'react-router-dom';
import MailIcon from '@mui/icons-material/Mail';
import { Badge, styled } from '@mui/material';
import DialogUpdateDetails from './DialogUpdateDetails';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    prevPassword: string;
    password: string;
}

interface TempUserDetails {
    firstName: string;
    email: string;
}
const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export default function AccountMenu({ userChanger, showAccountMenu, setShowAccountMenu, setIsManager }: any) {
    const nav = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [update, setUpdate] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [newReply, setNewReply] = useState(0);
    const [tempDetail, setTempDetail] = useState<TempUserDetails>({
        firstName: '',
        email: ''
    });
    const [details, setDetails] = useState<UserDetails>({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        prevPassword: '',
        password: ''
    });

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setUpdate(0);
    };

    const handleNavigation = () => {
        nav('sign-up');
    };

    const handleNavigationMessages = () => {
        nav('contact');
    };

    const handleLogOut = () => {
        setShowAccountMenu(false);
        setIsManager(false);
        RemoveCookie(); // Commented for now, as it's not provided in the code
        nav('/');
    };


    useEffect(() => {
        if (!GetCookie)
            setShowAccountMenu(false);
        const fetchDetails = async () => {
            const res = await getDetails();
            const resAmountNewReply = await getAmountNewReply();

            setNewReply(resAmountNewReply);
            setTempDetail({
                firstName: res.firstName || '',
                email: res.email || ''
            });
            setDetails({
                firstName: res.firstName || '',
                lastName: res.lastName || '',
                email: res.email || '',
                address: res.address || '',
                phone: res.phone || '',
                prevPassword: '',
                password: '',
            });
        };

        fetchDetails();

        const interval = setInterval(fetchDetails, 5 * 60 * 100);

        return () => {
            clearInterval(interval); // Clear interval on component unmount
        };

    }, [userChanger]);

    return (
        <Fragment>
            {showAccountMenu && (
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    {(newReply > 0) ?
                        <Tooltip title="Account settings">
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                onClick={handleClick}
                            >
                                <Avatar sx={{ width: 32, height: 32, backgroundColor: "blue" }} >{tempDetail.firstName[0]}</Avatar>
                            </StyledBadge>
                        </Tooltip>
                        :
                        <Tooltip title="Account settings">
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar sx={{ width: 32, height: 32, backgroundColor: "blue" }}>{tempDetail.firstName[0]}</Avatar>
                            </IconButton>
                        </Tooltip>
                    }
                </Box>
            )}
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem>
                    <Avatar /> {tempDetail.firstName}
                </MenuItem>
                <MenuItem>
                    <AlternateEmailIcon /> {tempDetail.email}
                </MenuItem>
                <Divider />
                {
                    newReply > 0 && <MenuItem onClick={handleNavigationMessages}>
                        <ListItemIcon>
                            <Badge color="success" badgeContent={newReply} max={9}>
                                <MailIcon />
                            </Badge>
                        </ListItemIcon>
                        New messages
                    </MenuItem>
                }
                <MenuItem onClick={handleNavigation}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem onClick={() => setShowModal(true)}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Edit Details
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            {showModal && <DialogUpdateDetails details={details} setDetails={setDetails} update={update} setUpdate={setUpdate} showModal={showModal} setShowModal={setShowModal} />}

        </Fragment>
    );
}
