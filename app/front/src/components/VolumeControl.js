import React, {useState} from 'react';

import volumeIcon from '../img/volume.png'

import './volumecontrol.css'

export default function VolumeControl({volume}) {
    // const lowerVolume = () => {
    //     if (volume === 0) {
    //         return
    //     } else {
    //         setVolume(volume - 5)
    //     }
    // }

    // const raiseVolume = () => {
    //     if (volume === 100) {
    //         return
    //     } else {
    //         setVolume(volume + 5)
    //     }
    // }

    return (
        <div>
            <img className={'volume-icon'} src={volumeIcon} alt={'A speaker icon to represent volume'}/>
            <p>{volume}</p>
            <div>
                <button> - </button>
                <button> + </button>
            </div>
        </div>
    )
}