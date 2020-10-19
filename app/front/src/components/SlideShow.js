import React from 'react';

import './slideshow.css'

const SlideShow = ({channel, images}) => {
    // const onClickPrevious = () => {
    //     if (channel === 0) {
    //         setChannel(images.length - 1)
    //     } else {
    //         setChannel(channel - 1)
    //     }
    // }

    // const onClickNext = () => {
    //     if (channel === images.length - 1) {
    //         setChannel(0)
    //     } else {
    //         setChannel(channel + 1)
    //     }
    // }

    return (
        <div>
            <h1>Canais</h1>
            <img className={'channel'} src={images[channel]} alt={'Pictures of some very cute dogs'} />
            {/* <div>
                <button onClick={onClickPrevious}> Anterior </button>
                <button onClick={onClickNext}> Próximo </button>
            </div> */}
        </div>
    )
}

export default SlideShow;