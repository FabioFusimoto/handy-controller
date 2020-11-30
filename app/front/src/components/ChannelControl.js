import React from 'react';

import Box from '@material-ui/core/Box';
import TvIcon from '@material-ui/icons/Tv';

import './channelcontrol.css';

export default function ChannelControl ({ channel }) {
  return (
    <Box className='channel-container' alignItems='center' display='flex' flexDirection='column'>
      <TvIcon fontSize='large' />
      <p>{channel + 1}</p>
    </Box>
  );
}
