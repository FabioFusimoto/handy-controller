import React, {useEffect, useRef, useState} from 'react';
import SlideShow from './SlideShow';
import VolumeControl from './VolumeControl';

import dog1 from '../img/dog1.jpg'
import dog2 from '../img/dog2.jpeg'
import dog3 from '../img/dog3.jpg'

const Display = ({frame}) => {
    // Channel control
    const [channel, setChannel] = useState(0);
    const images = [dog1, dog2, dog3]

    const channelDown = () => {
        if (channel === 0) {
            setChannel(images.length - 1)
        } else {
            setChannel(channel - 1)
        }
    }

    const channelUp = () => {
        if (channel === images.length - 1) {
            setChannel(0)
        } else {
            setChannel(channel + 1)
        }
    }

    // Volume control
    const [volume, setVolume] = useState(50)

    const volumeDown = () => {
        if (volume === 0) {
            return
        } else {
            setVolume(volume - 5)
        }
    }

    const volumeUp = () => {
        if (volume === 100) {
            return
        } else {
            setVolume(volume + 5)
        }
    }

    // Hand control
    const distanceThreshold = 100; /* In milimeters */
    const requiredDuration = 500; /* In miliseconds */

    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    };

    const [palmPosition, setPalmPosition] = useState([]);
    const [neutralPosition, setNeutralPosition] = useState([]);

    const [command, setCommand] = useState(null);
    const [commandStartedAt, setCommandStartedAt] = useState(undefined);
    const previousCommand = usePrevious(command);

    /* Update hands position from frame */
    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            if (frame.hands[0].confidence > 0.7) {
                setPalmPosition(frame.hands[0].palmPosition);
            } else {
                setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
            }
        } else {
            setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
            setCommand(null)
        }
    }, [frame]);

    /* Update neutral position */
    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            const rightHand = frame.hands[0]
            if (rightHand.fingers.every((f) => f.extended)) {
                if (neutralPosition.length === 0) {
                    setNeutralPosition(rightHand.palmPosition);
                }                
            } else if (rightHand.fingers.every((f) => !f.extended)) {
                setNeutralPosition([]);
            }
        }
    }, [frame, neutralPosition]);

    /* Select the corresponding command */
    useEffect(() => {
        const palmX = palmPosition[0];
        const palmZ = palmPosition[2];

        const neutralX = neutralPosition[0];
        const neutralZ = neutralPosition[2];

        if (palmZ < (neutralZ - distanceThreshold)) {
            setCommand('channelUp');
        } else if (palmZ > (neutralZ + distanceThreshold)) {
            setCommand('channelDown');
        } else if (palmX > (neutralX + distanceThreshold)) {
            setCommand('volumeUp');
        } else if (palmX < (neutralX - distanceThreshold)) {
            setCommand('volumeDown');
        } else {
            setCommand(null);
        }

        const now = new Date();

        if (command === null) {
            setCommandStartedAt(undefined);
        } else if (command !== previousCommand) {
            setCommandStartedAt(now);
        }        
    }, [palmPosition, neutralPosition, command, commandStartedAt, previousCommand]);

    /* Trigger command */
    useEffect(() => {
        if (command !== null && commandStartedAt !== undefined) {
            const now = new Date();
            const commandTimeElapsed = now.getTime() - commandStartedAt.getTime();

            if (commandTimeElapsed > requiredDuration) {
                switch(command){
                    case 'volumeUp':
                        volumeUp();
                        break;
                    case 'volumeDown':
                        volumeDown();
                        break;
                    case 'channelUp':
                        channelUp();
                        break;
                    case 'channelDown':
                        channelDown();
                        break;
                    default:
                        void(0);
                }
                setCommandStartedAt(undefined);
                setCommand(null);
            }
        }
    }, [frame, command, commandStartedAt])

    return(
        <React.Fragment>
            <SlideShow channel={channel} images={images}/>
            <VolumeControl volume={volume}/>
        </React.Fragment>
    )
}

export default Display;