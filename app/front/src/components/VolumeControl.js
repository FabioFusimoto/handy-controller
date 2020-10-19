import React from 'react';

import volumeIcon from '../img/volume.png'

import './volumecontrol.css'

export default function VolumeControl({volume}) {
    return (
        <div>
            <img className={'volume-icon'} src={volumeIcon} alt={'A speaker icon to represent volume'}/>
            <p>{volume}</p>
        </div>
    )
}