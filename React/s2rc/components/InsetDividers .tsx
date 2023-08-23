import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import dayjs from 'dayjs';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/material/styles';

interface ResData {
  TeacherName: string;
  NumberOfMeeting: number;
  CoursesType: string;
  Gender: string;
  StartDate: string;
  EndDate: string;
  price: number;
  duration: number;
}

interface InsetDividersProps {
  data: ResData;
}

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&.MuiListItem-root': {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiTypography-secondary': {
    color: theme.palette.text.secondary,
  },
}));

const InsetDividers: React.FC<InsetDividersProps> = ({ data }) => {
  const startDate = dayjs(data.StartDate);
  const endDate = dayjs(data.EndDate);

  const formattedDate = startDate.format('DD-MM-YYYY') + (endDate ? " - " + endDate.format('DD-MM-YYYY') : '');
  const formattedTime = startDate.format('HH:mm') + (data.duration ? " Duration: " + data.duration : '');

  return (
    <StyledList>
      <StyledListItem>
        <ListItemAvatar>
          <StyledAvatar>
            <SchoolIcon />
          </StyledAvatar>
        </ListItemAvatar>
        <StyledListItemText primary={`Teacher Name: ${data.TeacherName}`} secondary={`Number of Meetings: ${data.NumberOfMeeting}` + (data.price ? `<br/> price: ${data.price}`:'')} />
      </StyledListItem>
      <Divider variant="inset" component="li" />
      <StyledListItem>
        <ListItemAvatar>
          <StyledAvatar>
            <SupervisedUserCircleIcon />
          </StyledAvatar>
        </ListItemAvatar>
        <StyledListItemText primary={`Course Type: ${data.CoursesType}`} secondary={`Gender: ${data.Gender}`} />
      </StyledListItem>
      <Divider variant="inset" component="li" />
      <StyledListItem>
        <ListItemAvatar>
          <StyledAvatar>
            <TodayIcon />
          </StyledAvatar>
        </ListItemAvatar>
        <StyledListItemText primary="Date" secondary={formattedDate} />
      </StyledListItem>
      <Divider variant="inset" component="li" />
      <StyledListItem>
        <ListItemAvatar>
          <StyledAvatar>
            <ScheduleIcon />
          </StyledAvatar>
        </ListItemAvatar>
        <StyledListItemText primary="Time" secondary={formattedTime} />
      </StyledListItem>
    </StyledList>
  );
};

export default InsetDividers;
