import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import InsetDividers from './InsetDividers '; // Import the InsetDividers component
import DoneIcon from '@mui/icons-material/Done';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: '50%',
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  width: 'fit-content',
}));

const StyledDoneIcon = styled(DoneIcon)(({ }) => ({
  fontSize: '4rem',
}));

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 130 },
  {
    field: 'TimeBegin',
    headerName: 'Time Begin',
    width: 200,
    valueFormatter: (params) => {
      const timeBegin = dayjs(params.value as string).format('HH:mm');
      return timeBegin;
    },
  },
  {
    field: 'TimeEnd',
    headerName: 'Time End',
    width: 200,
    valueFormatter: (params) => {
      const timeEnd = dayjs(params.value as string).format('HH:mm');
      return timeEnd;
    },
  },
  {
    field: 'Date',
    headerName: 'Date',
    width: 200,
    valueGetter: (params) => {
      const date = dayjs(params.row.TimeBegin).format('DD-MM-YYYY');
      return date;
    },
  },
];

export default function CourseSchedule() {
  const location = useLocation();
  const { res } = location.state;
  console.log(res);

  const resSchedule = res[1]; // Get the data from res[1]
  const rowsWithId = resSchedule.map((row: any, index: any) => ({ ...row, id: index + 1 }));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div>
          <StyledContainer>
            <StyledDoneIcon />
          </StyledContainer>
        </div>
        <div>
          <p style={{ color: 'blue', textAlign: 'center', marginTop: '10px' }}>Course Details:</p>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <InsetDividers data={res[0]} /> {/* Add the InsetDividers component */}
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={rowsWithId} columns={columns} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
