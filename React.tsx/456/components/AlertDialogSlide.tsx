import InsetDividers from './InsetDividers ';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import PaymentForm from './PaymentForm';
import SharedContext from './SharedContext';
import { useNavigate } from 'react-router-dom';
import { GetCookie, addPaymentDetails, checkEnrollment, checkIsManager, deleteCourse, registerToCourse } from '../api/api';
import Alert from '@mui/material/Alert';
import BootstrapDialogTitle from './BootstrapDialogTitle';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props: any) {
  const [showPayment, setShowPayment] = useState(false);
  const [totalSum, setTotalSum] = useState(props.prop.price);
  const [nameCard, setNameCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState(new Date());
  const [cvv, setCvv] = useState('');
  const [rememberDetails, setRememberDetails] = useState(false);
  const [duration, setDuration] = useState('');
  const [useStorageCreditDetails, setUseStorageCreditDetails] = useState(false);
  const [storageCreditDetails, setStorageCreditDetails] = useState(0);
  const [enrollment, setEnrollment] = useState('');
  const [openDeleted, setOpenDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [successDelete, setSuccessDelete] = useState("Try Later...:(");
  const [isManager, setIsManager] = useState(false);
  const [canRegistration, serCanRegistration] = useState("FOR REGISTTRATION");
  const nav = useNavigate();

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    props.onClose();
  };

  const handlePayment = async () => {
    if (rememberDetails) {
      const resStatus = await addPaymentDetails(nameCard, cardNumber, expDate, cvv);
      switch (resStatus) {
        case 201:
          break;
        case 401:
          nav('/sign-in');
          break;
        case 409:
          break;
        default:
          break;
      }
    }
    const res = await registerToCourse(props.prop._id);
    switch (res) {
      case 201:
        setEnrollment('success')
        break;
      case 409:
        setEnrollment('conflict');
        break;
      case 400:
        setEnrollment('full');
        break;
      case 404:
        setEnrollment('not found');
        break;
      default:
        break;
    }
  };


  const handleRegister = async () => {
    const res = await checkEnrollment(props.prop._id);
    if (res == 200)
      setShowPayment(true);
    else
      serCanRegistration("You are registered...")
  };

  const handleDelete = async (id: any) => {
    const res = await deleteCourse(id);

    setOpen(false);
    setOpenDeleted(true);
    if (res == 200) {
      setSuccessDelete("The course deleted Successfully!");
      setTimeout(() => {
        props.setDeleted(props.deleted + 1);
        props.setOpenDialog(false);
      }, 5000);
    }
  }

  useEffect(() => {
    const fetchIsManager = async () => {
      const res = await checkIsManager();
      if (res == 200)
        setIsManager(true);
    };
    fetchIsManager();
  }, [])

  const action = (

    <React.Fragment>
      <Button color="secondary" size="small" onClick={() => handleDelete(props.prop._id)}>
        delete permanently
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose} // Close the Snackbar when clicked on the close icon
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{props.prop.courseType}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {enrollment === '' ? (
              !showPayment ? (
                <InsetDividers data={props.prop} />
              ) : (
                <SharedContext.Provider
                  value={{
                    totalSum,
                    setTotalSum,
                    nameCard,
                    setNameCard,
                    cardNumber,
                    setCardNumber,
                    expDate,
                    setExpDate,
                    cvv,
                    setCvv,
                    rememberDetails,
                    setRememberDetails,
                    duration,
                    setDuration,
                    useStorageCreditDetails,
                    setUseStorageCreditDetails,
                    storageCreditDetails,
                    setStorageCreditDetails,
                  }}
                >
                  <PaymentForm />
                </SharedContext.Provider>
              )
            ) : enrollment === 'success' ? (
              <Alert severity="success">You register to the course succesfully!</Alert>
            ) : enrollment === 'conflict' ? (
              <Alert severity="warning">You have already register to this course!</Alert>
            ) : enrollment === 'full' ? (
              <Alert severity="info">The course is full! please try again!</Alert>
            ) : (
              <Alert severity="error">Failed</Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {(new Date(props.prop.StartDate) > new Date() && isManager) && (
            <Button onClick={handleClick}>Delete</Button>
          )}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => setOpen(false)}
            message="Warning!"
            action={action}
          />

          <Snackbar open={openDeleted} autoHideDuration={6000} onClose={() => setOpenDeleted(false)}>
            <Alert
              onClose={() => setOpenDeleted(false)}
              severity={successDelete === 'Try Later...:(' ? "warning" : 'success'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {successDelete}
            </Alert>
          </Snackbar>


          {showPayment && enrollment === '' ? (
            <Button
              onClick={handlePayment}
              disabled={
                (!useStorageCreditDetails) &&
                (nameCard === '' || cardNumber.length < 16 || expDate === new Date() || cvv.length < 3)
              }
            >
              Pay
            </Button>
          ) : enrollment === '' ? (
            GetCookie() ? props.show === true && <Button onClick={handleRegister} disabled={canRegistration == "You are registered..."}>{canRegistration}</Button> : (
              <BootstrapDialogTitle />
            )
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
