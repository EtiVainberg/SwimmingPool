import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CommentIcon from '@mui/icons-material/Comment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Fragment, useEffect, useState } from 'react';
import { addCommentFromManger, checkIsManager, getComments, replyComment, updateComment, updateReplyStatusOfComment } from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Button, Grid, TextField } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


interface Comment {
    _id: string;
    content: string;
    date: string;
    status: string;
    user: {
        address: string;
        email: string;
        firstName: string;
        lastName: string;
        password: string;
        phone: string;
        role: string;
    };
    to: string,
    showNewChip: boolean;
    reply: string;
    isSubmit: boolean;
    statusReply: string;
}
export default function ManageContact() {
    const [error, setError] = useState(false);
    const [comment, setComment] = useState<Comment[]>([]);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null); // Track the selected comment
    const [replyContent, setReplyContent] = useState(''); // Add replyContent state
    const [showForm, setShowForm] = useState(false);
    const nav = useNavigate();
    const [Sent, setSent] = useState("Try Later...:(");
    const [open, setOpen] = useState(false);


    const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplyContent(event.target.value);
    };

    useEffect(() => {

        const fetchIsManager = async () => {
            const res = await checkIsManager();
            if (res != 200)
                nav('/sign-in');
        };
        fetchIsManager();

        const fetchDetails = async () => {
            const res = await getComments();
            switch (res[0]) {
                case 200:
                    console.log(res[1]);
                    const initialComments = res[1].map((c: Comment) => ({ ...c, showNewChip: (!c.to && c.status == 'new') || (c.statusReply == 'new' && c.to) }));
                    setComment(initialComments);
                    break;
                case 401:
                    nav("/");
                    break;
                case undefined:
                    setError(true);
                    break;
                default:
                    break;
            }
        };

        fetchDetails();
    }, [Sent, selectedCommentId,]);

    const handleSubmit2 = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') || '';
        const content = data.get('Content') || '';

        const res = await addCommentFromManger({ email, content });
        console.log('res', res);
        if (res == 201) {
            setOpen(true);
            setSent("The message sent...");
            setShowForm(false);
        }

        // setStatus(res);
    };


    async function handleStatus(commentId: string): Promise<void> {
        const resStatus = await updateComment(commentId);

        switch (resStatus) {
            case 200:
                const updatedComments = comment?.map((c: Comment) =>
                    c._id === commentId ? { ...c, showNewChip: false } : c
                );
                setComment(updatedComments);
                break;

            default:
                break;
        }
    }

    function selectComment(commentId: string) {
        setSelectedCommentId(prevId => (prevId === commentId ? null : commentId));
    }

    async function handleStatusReply(commentId: string): Promise<void> {
        const resStatus = await updateReplyStatusOfComment(commentId);
        switch (resStatus) {
            case 200:
                const updatedComments = comment?.map((c: Comment) =>
                    c._id === commentId ? { ...c, status: "read" } : c
                );
                setComment(updatedComments);
                break;
            default:
                break;
        }
    }
    const handleCommentIconClick = (commentId: string) => {
        setSelectedCommentId(prevId => (prevId === commentId ? null : commentId));
    };


    const handleSubmit = async (commentId: string) => {
        // Update initialComments array based on the reply content
        if (replyContent) {
            // Update initialComments array based on the reply content
            const updatedComments = comment.map((c: Comment) => {
                if (c._id === commentId) {
                    return {
                        ...c,
                        showNewChip: false,
                        content: `${c.content}\nReply: ${replyContent}`,
                        isSubmit: true,
                    };
                }
                return c;
            });

            // Call the replyComment API function
            const resStatus = await replyComment(replyContent, updatedComments.find(c => c._id === commentId)?._id);

            if (resStatus === 200) {
                setComment(updatedComments);
                setSelectedCommentId(null);
                setReplyContent(''); // Clear replyContent after submission;
            }
        };
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are 0-indexed
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    function mapFirstLetterToColor(letter: any) {
        const colors = [
            'paleturquoise',
            'apple',
            'lightcoral',
            'red',
            'brown',
            'lightyellow',
            'purple',
            'pink',
            'bedge',
            'lightblue'
        ];

        // Use the character code of the first letter to get an index for the color array
        const index = letter.charCodeAt(0) % colors.length;

        return colors[index];
    }



    return (
        <Fragment>
            {error && <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}
            {comment?.length == 0 && <Alert severity="success">Yaooo!! The contactList is empty....<a href="/management" style={{ color: 'blue' }}>🧑‍💼Go Management</a></Alert>}
            <Link onClick={() => { setShowForm(!showForm); }} to={''} style={{ marginTop: '10px' }}>new comment</Link>
            {showForm &&
                <Box component="form" onSubmit={handleSubmit2} sx={{ mt: 1, padding: 2, border: 'solid', borderRadius: 5, borderColor: 'blue' }}>
                    <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Send
                            </Button>
                        </Grid>
                        <Grid item xs={6}>

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: 'red' }}
                                onClick={() => setShowForm(false)}
                            >
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Box>}

            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity={Sent === 'Try Later...:(' ? "warning" : 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {Sent}
                </Alert>
            </Snackbar>
            <List sx={{ width: '60vw', height: '50vh', bgcolor: 'background.paper' }}>
                {comment?.map((value: any) => {
                    return (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="center" key={0} disablePadding>

                                <ListItemAvatar sx={{ visibility: value.to ? 'hidden' : 'visible' }}>
                                    <Chip sx={{
                                        m: 1,
                                        width: '150px', // Adjust the width value according to your preference
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: mapFirstLetterToColor(value.user ? value.user.firstName[0] : value.firstName),
                                    }}
                                        avatar={<Avatar>{value.user ? value.user.firstName[0] : value.firstName[0]}</Avatar>}
                                        label={(value.user ? value.user.firstName : value.user) + ' ' + (value.user ? value.user.lastName : '')}
                                    />
                                </ListItemAvatar>

                                {value.showNewChip ? (
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                        <Chip label="new" color="error" />
                                    </Stack>) :
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                        <Chip label="read" color="default" />
                                    </Stack>
                                }

                                <div onClick={() => (!value.to) && handleStatus(value._id)} style={{ cursor: 'pointer', marginLeft: '10px', display: 'grid' }}>
                                    <Divider variant="middle" component="li" />
                                    <ListItemText
                                        primary={
                                            <Fragment>
                                                <EventNoteIcon sx={{ marginRight: '5px', fontSize: '1rem' }} />
                                                {formatDate(value.date)}
                                            </Fragment>
                                        }
                                    />
                                    <ListItemText
                                        primary={
                                            <Fragment>

                                                <Typography
                                                    sx={{ display: 'inline', marginLeft: '100px' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {/* Insert any additional content here if needed */}
                                                </Typography>
                                                {value.content}
                                            </Fragment>

                                        }

                                    />
                                </div>
                                {!value.to ?
                                    <IconButton
                                        edge="end"
                                        aria-label="comments"
                                        sx={{ marginLeft: 'auto' }}
                                        onClick={() => (!(value.isSubmit) && (!(value.reply)))
                                            ? handleCommentIconClick(value._id) : selectComment(value._id)}>
                                        {(!value.isSubmit && !value.reply) ? <CommentIcon />
                                            : <TaskAltIcon />
                                        }
                                    </IconButton>
                                    :
                                    <button style={{ marginLeft: 'auto', marginRight: 0, display: 'flex' }}
                                        onClick={() => {
                                            value.reply && value.statusReply == 'new' && handleStatusReply(value._id);
                                            value.reply && selectComment(value._id)
                                        }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ForwardToInboxIcon />
                                            <ListItemAvatar sx={{ marginRight: 0 }}>
                                                <Chip sx={{
                                                    m: 1,
                                                    width: '150px', // Adjust the width value according to your preference
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    bgcolor: mapFirstLetterToColor(value.to.firstName[0]),
                                                }}
                                                    avatar={<Avatar>{value.to.firstName[0]}</Avatar>}
                                                    label={(value.to.firstName) + ' ' + (value.to.lastName)} />
                                            </ListItemAvatar>
                                        </div>

                                    </button>
                                }
                            </ListItem >

                            {!value.reply && selectedCommentId === value._id && !value.to ? (
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
                                            onClick={() => handleSubmit(value._id)}
                                            variant="contained"
                                            sx={{ mt: 0.5, mb: 0, height: '55px' }}
                                        >
                                            <ReplyIcon />
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : selectedCommentId === value._id ?
                                <div style={{ textAlign: 'left', padding: '5px', backgroundColor: '#e8e4e4' }}>
                                    <Chip
                                        avatar={value.to != undefined ? <Avatar alt="Natacha" src="" /> : <ManageAccountsIcon />}
                                        label={value.to != undefined ? value.to.firstName : "Administor"}
                                        variant="outlined"
                                        sx={{ color: '#0c88de', marginRight: '20px' }} />
                                    {value.reply}
                                </div> : ""
                            }
                        </>
                    );
                })}
            </List>



        </Fragment >
    );
}
