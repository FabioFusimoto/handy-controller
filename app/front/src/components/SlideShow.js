import React from 'react';

import './slideshow.css';

const SlideShow = ({ channel, images }) => {
  return (
    <div>
      <h1>Canais</h1>
      <img className='channel' src={images[channel]} alt='Pictures of some very cute dogs' />
    </div>
  );
};

export default SlideShow;
