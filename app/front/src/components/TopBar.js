import React, { useState, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const TopBar = ({ frame, gesturesEnabled, toggleGesturesEnabled }) => {
  const directionThreshold = 0.8;
  const timeThreshold = 3000; // In miliseconds

  const [thumbDirection, setThumbDirection] = useState(null);
  const [thumbsUpStartedAt, setThumbsUpStartedAt] = useState(null);
  const [thumbsDownStartedAt, setThumbsDownStartedAt] = useState(null);

  // Check Thumb Orientation
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1); /* Right hand has priority over left hand */

      // Check if thumb is the only one extended
      const fingersUp = frame.hands[0].fingers.filter((f) => (f.extended));
      if (fingersUp.length === 1 && fingersUp[0].type === 0) { // Type 0 is the thumb
        setThumbDirection(frame.hands[0].thumb.direction[2]);
      }
    } else {
      setThumbDirection(null);
    }
  }, [frame]);

  // Check Thumbs up / down gesture based on Orientation
  useEffect(() => {
    if (thumbDirection !== null) {
      if (thumbDirection < (-directionThreshold)) { // Thumbs up
        setThumbsDownStartedAt(null);
        if (thumbsUpStartedAt === null) {
          const now = new Date();
          setThumbsUpStartedAt(now.getTime());
        }
      } else if (thumbDirection > directionThreshold) { // Thumbs down
        setThumbsUpStartedAt(null);
        if (thumbsDownStartedAt === null) {
          const now = new Date();
          setThumbsDownStartedAt(now.getTime());
        }
      }
    } else {
      setThumbsUpStartedAt(null);
      setThumbsDownStartedAt(null);
    }
  }, [directionThreshold, thumbDirection, thumbsDownStartedAt, thumbsUpStartedAt]);

  // Trigger commands based on timeout
  useEffect(() => {
    if (thumbsUpStartedAt !== null || thumbsDownStartedAt !== null) {
      const now = new Date();
      if (thumbsUpStartedAt && (now.getTime() - thumbsUpStartedAt) > timeThreshold) {
        toggleGesturesEnabled(true);
      } else if (thumbsDownStartedAt && (now.getTime() - thumbsDownStartedAt) > timeThreshold) {
        toggleGesturesEnabled(false);
      }
    }
  }, [frame, timeThreshold, thumbsUpStartedAt, thumbsDownStartedAt, toggleGesturesEnabled]);

  return (
    <AppBar position='static'>
      <Toolbar>
        <Box
          alignItems='center'
          display='flex'
          width='100vw'
          justifyContent='space-between'
        >
          <Typography>
            Handy-Controller
          </Typography>
          <Box
            alignItems='center'
            display='flex'
          >
            <Box mx={4}>
              <Typography>
                Controles por gestos: {gesturesEnabled ? 'Ativado' : 'Desativado'}
              </Typography>
            </Box>
            <Button
              color='secondary'
              onClick={() => toggleGesturesEnabled(!gesturesEnabled)}
              style={{ backgroundColor: '#FFFFFF' }}
              variant='outlined'
            >
              Ativar/desativar
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
