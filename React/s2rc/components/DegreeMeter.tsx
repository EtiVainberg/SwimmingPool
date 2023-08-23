// import React from 'react';
// import { Typography } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme: any) => ({
//     container: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     thermometer: {
//         width: '20px',
//         height: '120px',
//         backgroundColor: '#f5f5f5',
//         position: 'relative',
//         borderRadius: '10px',
//         overflow: 'hidden',
//         marginBottom: theme.spacing(1),
//     },
//     mercury: {
//         width: '100%',
//         height: '0',
//         position: 'absolute',
//         bottom: '0',
//         backgroundColor: theme.palette.primary.main,
//         transition: 'height 0.3s',
//     },
//     degreeLabels: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         marginTop: theme.spacing(2),
//     },
//     degreeLabel: {
//         fontSize: '0.8rem',
//         marginBottom: theme.spacing(1),
//     },
// }));

// interface DegreeMeterProps {
//     temperature: number;
//     minTemperature: number;
//     maxTemperature: number;
// }

// const DegreeMeter: React.FC<DegreeMeterProps> = ({ temperature, minTemperature, maxTemperature }) => {
//     const classes = useStyles();
//     const mercuryHeight = ((temperature - minTemperature) / (maxTemperature - minTemperature)) * 100;

//     return (
//         <div className={classes.container}>
//             <div className={classes.thermometer}>
//                 <div className={classes.mercury} style={{ height: `${mercuryHeight}%`, fontSize: "150px" }}></div>
//             </div>
//             <div className={classes.degreeLabels}>
//                 <Typography variant="caption" className={classes.degreeLabel}>
//                     {maxTemperature}°C
//                 </Typography>
//                 <Typography variant="caption" className={classes.degreeLabel}>
//                     {temperature}°C
//                 </Typography>
//                 <Typography variant="caption" className={classes.degreeLabel}>
//                     {minTemperature}°C
//                 </Typography>
//             </div>
//         </div>
//     );
// };

// export default DegreeMeter;
