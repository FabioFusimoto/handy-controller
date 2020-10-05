import React, {useState} from 'react';

import dog1 from '../img/dog1.jpg'
import dog2 from '../img/dog2.jpeg'
import dog3 from '../img/dog3.jpg'

import './slideshow.css'

export default function SlideShow() {
    const [images, setImages] = useState([dog1, dog2, dog3])
    const [channel, setChannel] = useState(0)

    const onClickPrevious = () => {
        if (channel === 0) {
            setChannel(images.length - 1)
        } else {
            setChannel(channel - 1)
        }
    }

    const onClickNext = () => {
        if (channel === images.length - 1) {
            setChannel(0)
        } else {
            setChannel(channel + 1)
        }
    }

    return (
        <div>
            <h1>Canais</h1>
            <img className={'channel'} src={images[channel]} alt={'Pictures of some very cute dogs'} />
            <div>
                <button onClick={onClickPrevious}> Anterior </button>
                <button onClick={onClickNext}> Próximo </button>
            </div>
        </div>
    )
}