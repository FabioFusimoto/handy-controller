import React from 'react';

import Box from '@material-ui/core/Box';

import volumeIcon from '../img/volume.png';
import './volumecontrol.css';

export default function VolumeControl ({ volume }) {
  return (
    <Box alignItems='center' display='flex' flexDirection='column'>
      <img className='volume-icon' src={volumeIcon} alt='A speaker icon to represent volume' />
      <p>{Number(volume).toFixed(0)}</p>
    </Box>
  );
}
