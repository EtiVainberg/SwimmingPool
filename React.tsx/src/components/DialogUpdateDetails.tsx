import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { updateUserDetails } from '../api/api';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import updateGif from '../assets/SwimmingPool/404-error-dribbble-800x600.gif'
import Checkbox from '@mui/material/Checkbox';

export default function DialogUpdateDetails(props: any) {

    const { details, setDetails, update, setUpdate, showModal, setShowModal } = props;


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await updateUserDetails(details);
        setUpdate(res);

    }

    const handleClose = () => {
        setShowModal(false);
        setUpdate(400);
    };


    return (
        <Dialog open={showModal} onClose={handleClose} maxWidth="xs" fullWidth>
            {update == 200 ? <DialogContent dividers>

                <><DialogTitle sx={{ display: 'flex', justifyContent: 'right', paddingRight: '8px', color: 'blue' }}>
                    <IconButton className="close-button" onClick={() => setShowModal(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                    <Typography variant="h3" gutterBottom color={'blue'} align={'center'}>
                        <img src={updateGif} width={400} />
                        updated!
                    </Typography></>


            </DialogContent>
                :
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
                                            pattern: "[A-Za-z׳-׳×]+",
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
                                            pattern: "[A-Za-z׳-׳×]+",
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
                                {location.pathname.includes('manageUsers') && <Grid item xs={12} sx={{ display: 'flex' }}>
                                    <Checkbox
                                        checked={details.role === 'admin'}
                                        onChange={(e) => setDetails({ ...details, role: e.target.checked ? 'admin' : 'user' })}
                                    />
                                    <Typography variant="body1">Admin</Typography>
                                </Grid>}
                                {!location.pathname.includes('manageUsers') && (
                                    <><Grid item xs={12}>
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
                                            {(update == 400 || update == 421) && (
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
                                    </>)}
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
                    </DialogContent></>
            }
        </Dialog>
    )
}
