import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        marginTop: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
}));

export default function About() {
    const classes = useStyles();

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Paper elevation={3} className={classes.root}>
                    <Typography variant="h5" component="h2" className={classes.title}>
                        About Swimming Pool Website
                    </Typography>
                    <Typography variant="body1">
                        Welcome to our swimming pool website! We are dedicated to providing
                        high-quality swimming facilities for all ages and skill levels. Whether
                        you're a beginner or an experienced swimmer, our pools are designed to
                        meet your needs.
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '16px' }}>
                        Our website allows you to easily book swimming sessions, provide
                        information about our trainers and classes, and stay updated with the
                        latest news and events. We also offer various amenities such as
                        locker rooms, showers, and a cafe for your convenience.
                    </Typography>
                </Paper>
                <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d846.5605970089201!2d35.0423207304116!3d31.927175998376903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDU1JzM3LjgiTiAzNcKwMDInMzAuMCJF!5e0!3m2!1siw!2sil!4v1688312649883!5m2!1siw!2sil" width={500} height={500} style={{ "border": 0 }} allowFullScreen loading="lazy" referrerPolicy={"no-referrer-when-downgrade"}></iframe>
            </div>
        </>
    );
}