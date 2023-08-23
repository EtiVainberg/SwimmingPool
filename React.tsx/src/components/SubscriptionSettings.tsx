import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup } from '@mui/material';
import { Fragment, useState, useContext } from 'react';
import SharedContext from './SharedContext';


export default function SubscriptionSettings() {
  const contextValue = useContext(SharedContext);
  if (!contextValue) {
    throw new Error('SharedContext value is null');
  }

  const {
    setDuration
  } = contextValue;

  
  const [selectedButton, setSelectedButton] = useState('');

  const handleDurationButtonClick = (value: string, duration: string) => {
    setSelectedButton(value);
    setDuration(duration);
  };

  return (
    <Fragment>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Subscription Settings
        </Typography>
        <ButtonGroup>
          <Button
            autoFocus
            variant={selectedButton === 'button1' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleDurationButtonClick('button1', 'Weekly')}
          >
            weekly
          </Button>
          <Button
            variant={selectedButton === 'button2' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleDurationButtonClick('button2', 'Monthly')}
          >
            monthly
          </Button>
          <Button
            variant={selectedButton === 'button3' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleDurationButtonClick('button3', 'Yearly')}
          >
            yearly
          </Button>
        </ButtonGroup>
      </Grid>
    </Fragment>
  );
}
