import React from 'react';

import Box from '@material-ui/core/Box';

import channelIcon from '../img/channel.png';
import './channelcontrol.css';

export default function ChannelControl ({ channel }) {
  return (
    <Box alignItems='center' display='flex' flexDirection='column'>
      <img className='channel-icon' src={channelIcon} alt='A world (?) icon to represent channel' />
      <p>{channel + 1}</p>
    </Box>
  );
}
