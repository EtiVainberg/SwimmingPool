// AccountMenu.js

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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Fragment, MouseEvent } from 'react';
import { RemoveCookie, getDetails, updateUserDetails } from '../api/api';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    prevPassword: string;
    password: string;
}

export default function AccountMenu({ showAccountMenu, setShowAccountMenu, setIsManager }: any) {
    const nav = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [update, setUpdate] = useState(0);
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
    };

    const handleNavigation = () => {
        nav('sign-up');
    };

    const handleLogOut = () => {
        setShowAccountMenu(false);
        setIsManager(false);
        RemoveCookie(); // Commented for now, as it's not provided in the code
        nav('/');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await updateUserDetails(details);
        console.log("666", res);

        setUpdate(res);

    }

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getDetails();
            console.log(res);

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
    }, []);

    return (
        <Fragment>
            {showAccountMenu && (
                <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32, backgroundColor: "blue" }}>{details.firstName[0]}</Avatar>
                        </IconButton>
                    </Tooltip>
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
                <MenuItem disabled>
                    <Avatar /> {details.firstName}
                </MenuItem>
                <MenuItem disabled>
                    <AlternateEmailIcon /> {details.email}
                </MenuItem>
                <Divider />
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
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                        <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
                {(update === 0 || update === 400) &&
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', paddingRight: '8px', color: 'blue' }}>
                            Change User Details
                            <IconButton className="close-button" onClick={() => setShowModal(false)}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            autoComplete="given-name"
                                            name="firstName"
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            value={details.firstName}
                                            autoFocus
                                            onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                                            inputProps={{
                                                pattern: "[A-Za-zא-ת]+",
                                                title: "Please enter only letters", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            value={details.lastName}
                                            autoComplete="family-name"
                                            onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                                            inputProps={{
                                                pattern: "[A-Za-zא-ת]+",
                                                title: "Only letters", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            value={details.email}
                                            autoComplete="email"
                                            onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                            inputProps={{
                                                pattern: "^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$", // Only accept letters (no numbers or special characters)
                                                title: "Adjust to this pattern  john@example.com", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="phone"
                                            label="Phone"
                                            name="phone"
                                            value={details.phone}
                                            autoComplete="phone"
                                            onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                                            inputProps={{
                                                pattern: "[0-9]{9,10}",
                                                title: "9 or 10 digits", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="address"
                                            label="Address"
                                            name="address"
                                            value={details.address}
                                            autoComplete="address"
                                            onChange={(e) => setDetails({ ...details, address: e.target.value })}
                                            inputProps={{
                                                pattern: "[a-zA-Z ]+[0-9]+",
                                                title: "Adjust to this pattern: Your address XXX(number of building)", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="prevPassword"
                                            label="Prev Password"
                                            type="password"
                                            id="prevPassword"
                                            value={details.prevPassword}
                                            autoComplete="new-password"
                                            onChange={(e) => setDetails({ ...details, prevPassword: e.target.value })}
                                            inputProps={{
                                                pattern: "^.{6,8}$",
                                                title: "Lengthed 6-8 chars", // Error message to display when pattern doesn't match
                                            }} />

                                    </Grid>
                                    <Grid item>
                                        {update == 400 && (
                                            <Typography variant="caption" color="error">
                                                Error Password!!
                                            </Typography>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="New Password"
                                            type="password"
                                            id="password"
                                            value={details.password}
                                            autoComplete="new-password"
                                            onChange={(e) => setDetails({ ...details, password: e.target.value })}
                                            inputProps={{
                                                pattern: "^.{6,8}$",
                                                title: "Lengthed 6-8 chars", // Error message to display when pattern doesn't match
                                            }} />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Apply Settings
                                </Button>
                            </Box>
                        </DialogContent></>}
                <DialogContent dividers>
                    {update == 200 &&
                        <><DialogTitle sx={{ display: 'flex', justifyContent: 'right', paddingRight: '8px', color: 'blue' }}>
                            <IconButton className="close-button" onClick={() => setShowModal(false)}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle><Typography variant="h3" gutterBottom color={'red'}>
                                Success!!!
                            </Typography></>

                    } </DialogContent>
            </Dialog>


        </Fragment>
    );
}
