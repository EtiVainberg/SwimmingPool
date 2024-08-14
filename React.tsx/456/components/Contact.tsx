import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { addComment, getDetails } from '../api/api';
import { useEffect, useState } from 'react';
import { Alert} from '@mui/material';
import CollapsibleTable from './CollapsibleTable';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import contact from '../assets/SwimmingPool/contact.gif'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState(0);
  const [details, setDetails] = useState({
    firstName: '',
    address: '',
    email: '',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getDetails();

      setDetails({
        firstName: res.firstName || '',
        address: res.address || '',
        email: res.email || '',
      });
    };

    fetchDetails();
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setDetails((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get('firstName') || '';
    const address = data.get('address') || '';
    const email = data.get('email') || '';
    const content = data.get('Content') || '';

    const res = await addComment({ firstName, email, address, content });
    setStatus(res);
  };

  const handleChange2 = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '70vw', height: '70vh' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange2}
          aria-label="basic tabs example"        >
          <Tab label="Messages" icon={<MarkUnreadChatAltIcon />} {...a11yProps(0)} />
          <Tab label="New Message" icon={<AnnouncementIcon />} {...a11yProps(1)} />
        
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <CollapsibleTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Container component="main" maxWidth="xs">
          {status == 201 ? (
            <Box sx={{ pt: 0.2 }}>
              <Typography variant="h4" gutterBottom color={'#1976d2'}>
                Your request has been successfully received...
              </Typography>
              <img src={contact} width='400vw'/>
            </Box>
          ) : (
            <Box>
              {status === undefined && (
                <Alert severity="warning">
                  Ooops... Fail to connect server, try later...
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      margin="normal"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      value={details.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      value={details.address}
                      onChange={handleChange}
                      autoComplete="address"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      value={details.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      multiline
                      rows={3}
                      id="Content"
                      label="Content"
                      name="Content"
                      autoFocus
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </CustomTabPanel>
    </Box>
  );
}