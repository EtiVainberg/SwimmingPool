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
import { useEffect, useState } from 'react';
import { getUsers, getAllUserDetails } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { PieChart, pieArcClasses } from '@mui/x-charts/PieChart';
import { MakeOptional } from '@mui/x-date-pickers/internals';
import { PieValueType } from '@mui/x-charts/models/seriesType';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';



function createData(
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  email: string,
  isAdmin: boolean,
) {
  return {
    id,
    firstName,
    lastName,
    address,
    email,
    isAdmin,
  };
}
function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [subscription, setSubscription] = useState<string | null>("");
  const [data, setData] = useState<MakeOptional<PieValueType, "id">[]>([]);
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

    if (userDetails?.satisfaction.length > 0) {
      userDetails.satisfaction.forEach((c: any) => {
        satisfaction.Service += parseInt(c?.Service);
        satisfaction.Cleanly += parseInt(c?.Cleanly);
        satisfaction.lessons += parseInt(c?.lessons);
        satisfaction.Staff += parseInt(c?.Staff);
        satisfaction.Availability += parseInt(c?.Availability);
      });

      const data =
        [
          { id: 0, value: satisfaction.Service, label: 'Service', color: 'red' },
          { id: 1, value: satisfaction.Cleanly, label: 'Cleanliness', color: 'green' },
          { id: 2, value: satisfaction.lessons, label: 'Lessons', color: 'blue' },
          { id: 3, value: satisfaction.Availability, label: 'Availability', color: 'orange' },
          { id: 4, value: satisfaction.Staff, label: 'Staff', color: 'purple' },
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
        <TableCell align="right">{row.isAdmin ? 'Yes' : 'No'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, background: 'white' }} colSpan={5}>
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
                  <TableRow>
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
                    <TableCell align="right">
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
                    <TableCell>
                      {userDetails?.adaptedCourses.length > 0 ? <List component="nav" aria-label="courses list">
                        <ListItem>
                          <ListItemText primary='Course Type' />
                          <ListItemText primary='Teacher' />
                          <ListItemText primary="Status" />
                        </ListItem>
                        <Divider />
                        {userDetails.adaptedCourses.map((course: any, index: any) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText secondary={course.CoursesType} />
                              <ListItemText secondary={course.TeacherName} />
                              <ListItemText secondary={new Date(course.EndDate) > (new Date()) ? "✔️" : "✖️"} />
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
    </React.Fragment>
  );
}


export default function ManageUsers() {
  const [rows, setRows] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const res = await getUsers();
      switch (res) {
        case 403:
          nav('/');
          break;
        case 401:
          nav('/sign-in');
          break;
        default:
          if (Array.isArray(res)) {
            const usersData: ReturnType<typeof createData>[] = res.map(
              (row: any, index: number) =>
                createData(
                  index + 1,
                  row.firstName,
                  row.lastName,
                  row.address,
                  row.email,
                  row.role === 'admin'
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
  }, []);

  return (
    <TableContainer component={Paper} sx={{ width: '120vh', marginTop: '10px' }}>
      <Table aria-label="user-table" sx={{ backgroundColor: 'rgb(238 236 236)' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Admin</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {rows.map((user) => (
            <Row key={user.email} row={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
