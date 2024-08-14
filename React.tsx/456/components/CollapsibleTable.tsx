import { useEffect, useState, Fragment } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { GetCookie, getCommentAndReply, getDetails, replyComment, updateComment, updateReplyStatusOfComment } from '../api/api';
import React from 'react';
import Alert from '@mui/material/Alert';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CommentIcon from '@mui/icons-material/Comment';
import { Button, Grid, TextField } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import PersonIcon from '@mui/icons-material/Person';
import Link from '@mui/material/Link';

// Define the type for a comment item
interface Comment {
  content: string;
  date: string;
  statusReply: string;
}

// Function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are 0-indexed
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

function Row(props: any) {
  const { row } = props;
  const [replyContent, setReplyContent] = useState(''); // Add replyContent state
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(undefined);

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplyContent(event.target.value);
  };
  const handleIconClick = async () => {

    setOpen(!open);
    const resStatus = await updateReplyStatusOfComment(row._id);

    switch (resStatus) {
      case 200:
        row.statusReply = "old";
        break;

      default:
        break;
    }
  };

  async function handleStatus(): Promise<void> {
    const resStatus = await updateComment(row._id);
    switch (resStatus) {
      case 200:
        row.status = "old";
        // const updatedComments = comment?.map((c: Comment) =>
        //     c._id === row. ? { ...c, showNewChip: false } : c
        // );
        // setComment(updatedComments);
        break;

      default:
        break;
    }
  }
  const handleSubmit = async (commentId: string) => {
    // Update initialComments array based on the reply content
    if (replyContent) {
      const resStatus = await replyComment(replyContent, commentId);

      if (resStatus === 200) {
        // setComment(updatedComments);
        row.reply = replyContent;
        setOpen(false);
        setReplyContent(''); // Clear replyContent after submission;
      }
    };
  }

  useEffect(() => { }, [row.status]);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await getDetails();
      setUserDetails(res?.firstName);
    };

    fetchDetails();
  }, [])

  return (
    <Fragment >
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {(row.reply && !row.to) &&
            <IconButton
              aria-label="expand row"
              size="small"
              title='reply'
              onClick={handleIconClick}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          }
          {
            row.to &&
            <IconButton
              edge="end"
              aria-label="comments"
              sx={{ marginLeft: 'auto' }}
              onClick={() => {
                (!row.reply) && row.status == 'new' &&
                  handleStatus();
                setOpen(!open);
              }}>
              {(!(row.reply)) ? <CommentIcon /> : <TaskAltIcon />}
            </IconButton>
          }
        </TableCell>
        <TableCell component="th" scope="row" onClick={() => row.to && handleStatus()}>
          {row.content}
        </TableCell>
        <TableCell align="right">{formatDate(row.date)}</TableCell>
        <TableCell align="right">
          {((row.statusReply == "new" && (!row.to)) || (row.status === "new" && row.to)) && (
            <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
              <Chip label="new" color="error" />
            </Stack>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, display: 'flex', flexDirection: 'row', gap: '20px', color: '#0c88de' }}>
              {(row.to && !row.reply) ?
                <Grid container alignItems="center" justifyContent="flex-end">
                  <Grid item xs={11}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      multiline
                      rows={1}
                      id="REPLY"
                      label="REPLY"
                      name="REPLY"
                      autoFocus
                      value={replyContent}
                      onChange={handleReplyChange} // Add this
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button
                      type="submit"
                      onClick={() => handleSubmit(row._id)}
                      variant="contained"
                      sx={{ mt: 0.5, mb: 0, height: '55px' }}
                    >
                      <ReplyIcon />
                    </Button>
                  </Grid>
                </Grid>
                : (
                  <>
                    <Chip
                      avatar={row.to ? <PersonIcon /> : <Avatar alt="Natacha" src="/src/assets/SwimmingPool/logo2.png" />}
                      label={!row.to ? "ParadisePool" : userDetails}
                      variant="outlined"
                      sx={{ color: '#0c88de' }} />{row.reply}
                  </>
                )
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment >
  );
}

export default function CollapsibleTable() {
  const [list, setList] = useState<Comment[]>([]); // Specify the type of 'list'
  const [error, setError] = useState<string | null>(null);
  const tableRef = React.createRef<HTMLDivElement>(); // Ref for the table container

  useEffect(() => {

    const fetchComments = async () => {
      try {
        const res = await getCommentAndReply();
        if (res[0] === 200) {
          setList(res[1]);
        }
      } catch (error) {

        setError("Failed to fetch comments.");

      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      {list.length > 0 ?
        <div ref={tableRef} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Content</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((row, index) => (
                  <Row key={index} row={row} />
                ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </div> : !GetCookie() ? <Button href="/sign-in" sx={{ fontSize: '100%' }}>sign-in to see messages.</Button> : error ? <Alert severity="error">{error}</Alert> :
          <Alert severity="info">The Messages tab is empty.
            Responses to your messages will appear here... </Alert>
      }
    </div>
  );
}
