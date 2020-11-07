import React from 'react';

import channelIcon from '../img/channel.png'

import './channelcontrol.css'

export default function ChannelControl({channel}) {
    return (
        <div>
            <img className={'channel-icon'} src={channelIcon} alt={'A world (?) icon to represent channel'}/>
            <p>{channel + 1}</p>
        </div>
    )
}