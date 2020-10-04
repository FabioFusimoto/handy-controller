import React from 'react';

import dog1 from '../img/dog1.jpg'
import dog2 from '../img/dog2.jpeg'
import dog3 from '../img/dog3.jpg'

import './slideshow.css'

class SlideShow extends React.Component {
    state = {
        images: [dog1, dog2, dog3],
        channel: 0
    }

    onClickPrevious = () => {
        if (this.state.channel === 0) {
            this.setState({channel: this.state.images.length - 1})
        } else {
        this.setState({channel: this.state.channel - 1})
        }
    }

    onClickNext = () => {
        if (this.state.channel === this.state.images.length - 1) {
            this.setState({channel: 0})
        } else {
        this.setState({channel: this.state.channel + 1})
        }
    }

    render() {
        return (
            <div>
                <h1>Canais</h1>
                <img className={'channel'} src={this.state.images[this.state.channel]} alt={'Pictures of some very cute dogs'} />
                <div>
                    <button onClick={this.onClickPrevious}> Anterior </button>
                    <button onClick={this.onClickNext}> Próximo </button>
                </div>
            </div>
        )
    }
}

export default SlideShow;