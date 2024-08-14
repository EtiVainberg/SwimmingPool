import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Dispatch, useEffect, useState } from 'react';
import { getUsers, getAllUserDetails, deleteUser, getEnrollment, checkIsManager } from '../api/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PieValueType } from '@mui/x-charts/models/seriesType';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DialogUpdateDetails from './DialogUpdateDetails';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button } from '@mui/material';

function createData(
  id: string,
  firstName: string,
  lastName: string,
  address: string,
  email: string,
  phone: string,
  role: string,
) {
  return {
    id,
    firstName,
    lastName,
    address,
    email,
    phone,
    role,
  };
}
function Row(props: { row: ReturnType<typeof createData>, setDelete: Dispatch<React.SetStateAction<boolean>>, setOpenDeleted: Dispatch<React.SetStateAction<boolean>>, setSuccessDelete: Dispatch<React.SetStateAction<string>> }) {
  const { setDelete, setOpenDeleted, setSuccessDelete } = props;
  const [row, setRow] = useState(props.row);
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [subscription, setSubscription] = useState<string | null>("");
  const [data, setData] = useState<MakeOptional<PieValueType, "id">[]>([]);
  const [edit, setEdit] = useState(false);
  const [update, setUpdate] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);


  const action = (

    <React.Fragment>
      <Button color="secondary" size="small" onClick={() => { handleDeleteClick() }}>
        delete permanently
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => { setOpenDelete(false) }} // Close the Snackbar when clicked on the close icon
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  const fetchUserDetails = async (email: string) => {
    const details = await getAllUserDetails(email);
    setUserDetails(details);
  };

  useEffect(() => {
    if (userDetails) {
      setSubscription(userDetails.subscription?.SubscriptionType || null);
    }

    const satisfaction = {
      Service: 0, Availability: 0,
      Cleanly: 0,
      lessons: 0,
      Staff: 0,
    };

    if (userDetails?.satisfaction?.length > 0) {
      userDetails.satisfaction.forEach((c: any) => {
        satisfaction.Service += parseInt(c?.Service);
        satisfaction.Cleanly += parseInt(c?.Cleanly);
        satisfaction.lessons += parseInt(c?.lessons);
        satisfaction.Staff += parseInt(c?.Staff);
        satisfaction.Availability += parseInt(c?.Availability);
      });

      const amount = userDetails?.satisfaction.length;
      const data =
        [
          { id: 0, value: satisfaction.Service / amount, label: 'Service', color: 'red' },
          { id: 1, value: satisfaction.Cleanly / amount, label: 'Cleanliness', color: 'green' },
          { id: 2, value: satisfaction.lessons / amount, label: 'Lessons', color: 'blue' },
          { id: 3, value: satisfaction.Availability / amount, label: 'Availability', color: 'orange' },
          { id: 4, value: satisfaction.Staff / amount, label: 'Staff', color: 'purple' },
        ]
        ;
      setData(data);

    }



  }, [userDetails]);



  const handleRowClick = async () => {
    if (!open) {
      await fetchUserDetails(row.email);
    }
    setOpen(!open);
  };

  const handleEditClick = () => {
    setEdit(!edit);
  };

  const handleDeleteClick = async () => {
    const res = await deleteUser(row.id);
    console.log(res);
    setOpenDeleted(true);
    if (res == 200) {
      setSuccessDelete("The user was deleted successfully!");
      setDelete(true);

    } else {

      setSuccessDelete("Deletion failed. Please try again later.");
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' }, width: "90%" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleRowClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.firstName} {row.lastName}
        </TableCell>
        <TableCell align="right">{row.address}</TableCell>
        <TableCell align="right">{row.email}</TableCell>
        <TableCell align="right">{row.role == "admin" ? 'Admin' : 'User'}</TableCell>
        <TableCell>
          <IconButton
            onClick={handleEditClick}
            color="inherit"
          >
            {<EditIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton
            onClick={() => { setOpenDelete(true); }}
            color="inherit"
          >{<DeleteIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: 'white' }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="user-details">
                <TableHead>
                  <TableRow>
                    <TableCell>Subscription</TableCell>
                    <TableCell >Satisfaction</TableCell>
                    <TableCell align="left">Course</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{ alignItems: 'right' }}>
                    <TableCell>
                      {subscription ? (
                        <Chip
                          label={subscription}
                          color={
                            subscription === "Monthly"
                              ? "warning"
                              : subscription === "Yearly"
                                ? "info"
                                : "success"
                          }
                          title={userDetails?.subscription?.EndDate}
                        />
                      ) : <Chip
                        label="No Active!"
                        color="error"
                      />
                      }
                    </TableCell>
                    <TableCell style={{ alignItems: 'right' }}>
                      {data.length > 0 ? <PieChart
                        series={[
                          {
                            data,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30 },
                          },
                        ]}
                        sx={{
                          [`& .${pieArcClasses.faded}`]: {
                            fill: 'gray',
                          },
                        }}
                        height={200}
                      /> : <Chip
                        label="No Satisfaction"
                        color="error"
                      />}
                    </TableCell>
                    <TableCell sx={{ width: '40%' }}>
                      {userDetails?.adaptedCourses?.length > 0 ? <List component="nav" aria-label="courses list">
                        <ListItem>
                          <ListItemText primary='Course Type' />
                          <ListItemText primary='Teacher' />
                          <ListItemText primary="Status" />
                        </ListItem>
                        <Divider />
                        {userDetails?.adaptedCourses?.length > 0 && userDetails?.adaptedCourses.map((course: any, index: any) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText secondary={course.CoursesType} />
                              <ListItemText secondary={course.TeacherName} />
                              <ListItemText secondary={new Date(course.EndDate) > (new Date()) ? "✔" : "✖"} />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        ))}
                      </List> :
                        <Chip
                          label="No Courses!"
                          color="error"
                        />}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {edit && <DialogUpdateDetails details={row} setDetails={setRow} update={update} setUpdate={setUpdate} showModal={edit} setShowModal={setEdit} />}
      <Snackbar
        open={openDelete}
        autoHideDuration={6000}
        onClose={() => setOpenDelete(false)}
        message="Warning!"
        action={action}
      />

    </React.Fragment>
  );
}


export default function ManageUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const [deleteIt, setDelete] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const [openDeleted, setOpenDeleted] = useState(false);
  const [successDelete, setSuccessDelete] = useState("Try Later...:(");

  useEffect(() => {

    const fetchIsManager = async () => {
      const res = await checkIsManager();
      if (res != 200)
        nav('/sign-in');
    };
    fetchIsManager();

    const checkAdminStatus = async () => {
      let res = location.pathname == '/manageUsers' ? await getUsers() : await getEnrollment("0");
      switch (res) {
        case 403:
          nav('/');
          break;
        case 401:
          nav('/sign-in');
          break;
        default:
          if (location.pathname == '/manageCourses/viewRegisters') {
            res = res.map((u: any) => u.user);
          }
          if (Array.isArray(res)) {
            const usersData: ReturnType<typeof createData>[] = res.map(
              (row: any) =>
                createData(
                  row._id,
                  row.firstName,
                  row.lastName,
                  row.address,
                  row.email,
                  row.phone,
                  row.role
                )
            );
            setRows(usersData);
          } else {
            nav('/sign-in');
          }
          break;
      }
    };
    checkAdminStatus();
  }, [deleteIt]);

  return (
    <>
      {location.pathname == '/manageCourses/viewRegisters' && <Button><Link to={'/manageCourses'}>Back To Courses</Link></Button>}
      {openDeleted && <Collapse in={openDeleted} sx={{ width: '100vh', marginTop: '15px', zIndex: 100, alignItems: 'center' }}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenDeleted(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {successDelete}
        </Alert>
      </Collapse>}
      <TableContainer component={Paper} sx={{ width: '150vh', marginTop: '10px' }}>
        <Table aria-label="user-table" sx={{ backgroundColor: 'rgb(238 236 236)' }}>
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Address</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell>Edit </TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {rows.map((user) => (
              <Row key={user.email} row={user} setDelete={setDelete} setOpenDeleted={setOpenDeleted} setSuccessDelete={setSuccessDelete} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>


    </>


  );
}