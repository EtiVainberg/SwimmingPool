
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
import { getCommentAndReply, updateReplyStatusOfComment } from '../api/api';
import React from 'react';

// Define the type for a comment item
interface Comment {
  content: string;
  date: string;
  statusReply: string;
  // Add other properties here as needed
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

  const [open, setOpen] = useState(false);

  const handleIconClick = async () => {
    
      setOpen(!open);
      const resStatus = await updateReplyStatusOfComment(row._id);
      console.log(resStatus);

      switch (resStatus) {
        case 200:
          row.statusReply = "old";
          break;

        default:
          break;
      }
  };

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {row.status==='old'&&<IconButton
            aria-label="expand row"
            size="small"
            title='reply'
            onClick={handleIconClick}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.content}
        </TableCell>
        <TableCell align="right">{formatDate(row.date)}</TableCell>
        <TableCell align="right">
          {row.statusReply === "new" && (
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
              <Chip
                avatar={<Avatar alt="Natacha" src="/src/assets/SwimmingPool/logo2.png" />}
                label="ParadisePool"
                variant="outlined"
                sx={{ color: '#0c88de' }}
              />
              {row.reply}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default function CollapsibleTable() {
  const [list, setList] = useState<Comment[]>([]); // Specify the type of 'list'
  const [skip, setSkip] = useState<number>(0); // Number of comments to skip
  const [error, setError] = useState<string | null>(null);

  const limit = 20; // Number of comments to fetch at a time
  const tableRef = React.createRef<HTMLDivElement>(); // Ref for the table container

  useEffect(() => {
    // Initialize the list as an empty array when the component mounts
    fetchComments();
  }, [skip]);

  const fetchComments = async () => {
    try {
      const res = await getCommentAndReply(skip);
      if (res[0] === 200) {
        setList((prevList) => [...prevList, ...res[1]]);
      }
    } catch (error) {
      setError("Failed to fetch comments.");
    }
  };


  useEffect(() => {
    // Attach the scroll event listener when the component mounts
    if (tableRef.current) {
      tableRef.current.addEventListener('scroll', handleScroll);
    }

    // Remove the scroll event listener when the component unmounts
    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    if (
      tableRef.current &&
      tableRef.current.scrollTop + tableRef.current.clientHeight >= tableRef.current.scrollHeight - 200
    ) {
      // User has scrolled to the bottom, load more comments
      loadMoreComments();
    }
  };


  // Function to load more comments
  const loadMoreComments = () => {
    // Increase 'skip' by 'limit' to get the next set of comments
    setSkip(skip + limit);
  };

  useEffect(() => {
    // Attach the scroll event listener when the component mounts
    if (tableRef.current) {
      tableRef.current.addEventListener('scroll', handleScroll);
    }

    // Remove the scroll event listener when the component unmounts
    return () => {
      if (tableRef.current) {
        tableRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
