import React, {useState} from 'react';

import volumeIcon from '../img/volume.png'

import './volumecontrol.css'

export default function VolumeControl() {
    const [volume, setVolume] = useState(50)

    const lowerVolume = () => {
        if (volume === 0) {
            return
        } else {
            setVolume(volume - 5)
        }
    }

    const raiseVolume = () => {
        if (volume === 100) {
            return
        } else {
            setVolume(volume + 5)
        }
    }

    return (
        <div>
            <img className={'volume-icon'} src={volumeIcon} alt={'A speaker icon to represent volume'}/>
            <p>{volume}</p>
            <div>
                <button onClick={lowerVolume}> - </button>
                <button onClick={raiseVolume}> + </button>
            </div>
        </div>
    )
}