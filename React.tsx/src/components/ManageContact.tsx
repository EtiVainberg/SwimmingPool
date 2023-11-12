import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CommentIcon from '@mui/icons-material/Comment';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Fragment, useEffect, useState } from 'react';
import { getComments, replyComment, updateComment } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Button, Grid, TextField } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


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
    showNewChip: boolean;
    reply: string;
    isSubmit: boolean;
}
export default function ManageContact() {
    const [error, setError] = useState(false);
    const [comment, setComment] = useState<Comment[]>([]);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null); // Track the selected comment
    const nav = useNavigate();
    const [replyContent, setReplyContent] = useState(''); // Add replyContent state
    const [submit, setSubmit] = useState(false);
    const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReplyContent(event.target.value);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getComments();
            switch (res[0]) {
                case 200:
                    // Assuming res[1] is an array of comments
                    // Set the showNewChip property to true for all comments initially
                    const initialComments = res[1].map((c: Comment) => ({ ...c, showNewChip: c.status == 'new' }));
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
    }, []);


    async function handleStatus(commentId: string): Promise<void> {
        console.log(commentId);
        const resStatus = await updateComment(commentId);
        console.log(resStatus);

        switch (resStatus) {
            case 200:
                const updatedComments = comment?.map((c: Comment) =>
                    c._id === commentId ? { ...c, showNewChip: false } : c
                );
                setComment(updatedComments);
                console.log(comment);

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
                // setSubmit(true);
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
            // Add more colors as needed
        ];

        // Use the character code of the first letter to get an index for the color array
        const index = letter.charCodeAt(0) % colors.length;

        return colors[index];
    }



    return (
        <Fragment>
            {error && <Alert severity="warning">Ooops... Fail to connect server, try later...</Alert>}
            {comment?.length == 0 && <Alert severity="success">Yaooo!! The contactList is empty....<a href="/management" style={{ color: 'blue' }}>🧑‍💼Go Management</a></Alert>}
            <List sx={{ width: '60vw', height: '50vh', bgcolor: 'background.paper' }}>
                {comment?.map((value: Comment) => {
                    return (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="center" key={0} disablePadding>

                                <ListItemAvatar >
                                    <Chip sx={{
                                        m: 1,
                                        width: '150px', // Adjust the width value according to your preference
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: mapFirstLetterToColor(value.user.firstName[0]),
                                    }}
                                        avatar={<Avatar>{value.user.firstName[0]}</Avatar>}
                                        label={value.user.firstName + ' ' + value.user.lastName}
                                    />
                                    {/* <Avatar sx={{ m: 1, bgcolor: 'paleturquoise' }}>{value.user.firstName[0]}</Avatar> */}
                                </ListItemAvatar>

                                {value.showNewChip ? (
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                        <Chip label="new" color="error" />
                                    </Stack>) :
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                        <Chip label="read" color="default" />
                                    </Stack>
                                }

                                <div onClick={() => handleStatus(value._id)} style={{ cursor: 'pointer', marginLeft: '10px', display: 'grid' }}>
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
                                {
                                    (!(value.isSubmit) && (!(value.reply))) ?
                                        <IconButton
                                            edge="end"
                                            aria-label="comments"
                                            sx={{ marginLeft: 'auto' }}
                                            onClick={() => handleCommentIconClick(value._id)}>
                                            <CommentIcon />
                                        </IconButton> :
                                        <IconButton
                                            edge="end"
                                            aria-label="comments"
                                            sx={{ marginLeft: 'auto' }}
                                        >
                                            <TaskAltIcon />
                                        </IconButton>
                                }



                            </ListItem>

                            {!value.reply && selectedCommentId === value._id && (
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
                            )}
                        </>
                    );
                })}
            </List>



        </Fragment >
    );
}
