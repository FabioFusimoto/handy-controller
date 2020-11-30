import React from 'react';

import Box from '@material-ui/core/Box';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import './volumecontrol.css';

export default function VolumeControl ({ volume }) {
  return (
    <Box className='volume-container' alignItems='center' display='flex' flexDirection='column'>
      {volume === 0 ? <VolumeOffIcon fontSize='large' /> : (volume < 50 ? <VolumeDownIcon fontSize='large' /> : <VolumeUpIcon fontSize='large' />)}
      <progress value={volume} max={100} />
      <>{Number(volume).toFixed(0)}</>
    </Box>
  );
}
