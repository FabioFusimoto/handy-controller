import React from 'react';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './slideshow.css';

function SlideShow() {
    const images = [
        '../img/dog1.jpg',
        '../img/dog2.jpeg',
        '../img/dog3.jpg'
    ]
    
    const properties = {
        transitionDuration: 500,
        infinite: true,
        indicators: true,
        arrows: true
    }

    return (
        <Slide {...properties}>
            <div className="each-slide">
                <div style={{'backgroundImage': `url(${images[0]})`}}>
                    <span>Slide 1</span>
                </div>
            </div>
            <div className="each-slide">
                <div style={{'backgroundImage': `url(${images[1]})`}}>
                    <span>Slide 2</span>
                </div>
            </div>
            <div className="each-slide">
                <div style={{'backgroundImage': `url(${images[2]})`}}>
                    <span>Slide 3</span>
                </div>
            </div>
        </Slide>
    )
}

export default SlideShow;