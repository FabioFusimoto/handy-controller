import React, {useState} from 'react';
import SlideShow from './SlideShow';
import VolumeControl from './VolumeControl';

import dog1 from '../img/dog1.jpg'
import dog2 from '../img/dog2.jpeg'
import dog3 from '../img/dog3.jpg'

const Display = () => {
    // Channel control
    const [channel, setChannel] = useState(0);
    const images = [dog1, dog2, dog3]

    // Volume control
    const [volume, setVolume] = useState(50)

    return(
        <React.Fragment>
            <SlideShow channel={channel} images={images}/>
            <VolumeControl volume={volume}/>
        </React.Fragment>
    )
}

export default Display;