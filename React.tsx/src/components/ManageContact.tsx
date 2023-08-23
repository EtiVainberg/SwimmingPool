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
import { getComments, updateComment } from '../api/api';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
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
}
export default function ManageContact() {
    const [error, setError] = useState(false);
    const [comment, setComment] = useState<Comment[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            const res = await getComments();
            switch (res[0]) {
                case 200:
                    // Assuming res[1] is an array of comments
                    // Set the showNewChip property to true for all comments initially
                    const initialComments = res[1].map((c: Comment) => ({ ...c, showNewChip: true }));
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
            case 204:
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

                                <ListItemAvatar>
                                    <Avatar sx={{ m: 1, bgcolor: 'paleturquoise' }}>{value.user.firstName[0]}</Avatar>
                                </ListItemAvatar>

                                {value.showNewChip ? (
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                        <Chip label="new" color="error" />
                                    </Stack>):
                                    <Stack direction="row" spacing={1} sx={{ marginLeft: '10px' }}>
                                    <Chip label="read" color="default" />
                                </Stack>
                                }

                                <div onClick={() => handleStatus(value._id)} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                    <Divider variant="inset" component="li" />
                                    <ListItemText
                                        primary={value.date}
                                        secondary={
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

                                <IconButton edge="end" aria-label="comments" sx={{ marginLeft: 'auto' }}>
                                    <CommentIcon />
                                </IconButton>

                            </ListItem>
                        </>
                    );
                })}
            </List>

        </Fragment >
    );
}
