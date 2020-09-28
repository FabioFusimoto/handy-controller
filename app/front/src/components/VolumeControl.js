import React from 'react';

import volumeIcon from '../img/volume.png'

import './volumecontrol.css'

class VolumeControl extends React.Component {
    state = {
        volume: 50
    }

    lowerVolume = () => {
        if (this.state.volume === 0) {
            return
        } else {
        this.setState({volume: this.state.volume - 5})
        }
    }

    raiseVolume = () => {
        if (this.state.volume === 100) {
            return
        } else {
        this.setState({volume: this.state.volume + 5})
        }
    }

    render() {
        return (
            <div>
                <img className={'volume-icon'} src={volumeIcon} />
                <p>{this.state.volume}</p>
                <div>
                    <button onClick={this.lowerVolume}> - </button>
                    <button onClick={this.raiseVolume}> + </button>
                </div>
            </div>
        )
    }
}

export default VolumeControl;