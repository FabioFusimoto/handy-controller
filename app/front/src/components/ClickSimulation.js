import React, { useEffect, useRef, useState } from 'react';

import Box from '@material-ui/core/Box';

const ClickSimulation = ({frame}) => {
    const buttonRef = useRef();

    const [fingersUp, setFingersUp] = useState(0);

    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            const newFingersUp = frame.hands[0].fingers.filter((f) => (f.extended)).length;
    
            if (newFingersUp !== fingersUp) {
                if (newFingersUp > fingersUp) {
                    buttonRef.current.click();
                }
                setFingersUp(newFingersUp);
            }
        }        
    }, [fingersUp, frame]);

    const handleButtonClick = () => {
        console.log('Fingers up count increased!');
    }

    return (
        <React.Fragment>
            <Box display="flex" mx={4} my={5}>
                <button ref={buttonRef} onClick={handleButtonClick}>
                    Click Me!
                </button>
            </Box>
        </React.Fragment>
    )
}

export default ClickSimulation;