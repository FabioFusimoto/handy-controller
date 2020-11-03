import React, { useEffect, useRef, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const ClickSimulation = ({frame}) => {
    const nullRef = useRef(null);
    const buttonRef = useRef();

    const [fingersUp, setFingersUp] = useState(0);
    const [palmPosition, setPalmPosition] = useState([null, null, null]);
    const [neutralPosition, setNeutralPosition] = useState([null, null, null]);

    // useEffect(() => {
    //     if (frame && frame.hands && frame.hands.length > 0) {
    //         frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            
    //         // Fingers Up
    //         const newFingersUp = frame.hands[0].fingers.filter((f) => (f.extended)).length;
    
    //         if (newFingersUp !== fingersUp) {
    //             if (newFingersUp > fingersUp) {
    //                 buttonRef.current.click();
    //             }
    //             setFingersUp(newFingersUp);
    //         }

    //         // Palm position
    //         setPalmPosition(frame.hands[0].palmPosition);

    //         // Neutral position
    //         if (newFingersUp === 0) {
    //             setNeutralPosition(frame.hands[0].palmPosition)
    //         }
    //     } else {
    //         // Palm position
    //         setPalmPosition([null, null, null]);

    //         // Neutral position
    //         setNeutralPosition([null, null, null]);
    //     }
    // }, [fingersUp, frame]);

    const handleButtonClick = (x, y) => {
        console.log('Button Clicked! X = ' + x + ' Y = ' + y);
    }

    // Key Press --> simulate mouse over
    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            if(event.key == 'f') {
                buttonRef.current.focus();
            }
        });
      }, []);

    const ContainedButton = (x, y, shouldUseRef) => {
        return (
            <Grid item xs={4}>
                <Box display='flex' height='100%'>
                    <Button
                      color='primary'
                      id={'button_' + x + '_' + y}
                      fullWidth
                      onClick={() => handleButtonClick(x, y)}
                      ref={shouldUseRef ? buttonRef : nullRef}
                      variant='outlined'
                    >
                        Click Me! [{x},{y}]
                    </Button>
                </Box>
            </Grid>
        )
    }

    return (
        <Box 
          display='flex'
          height='90vh'
          mx={4}
          my={5}
        >
            <Grid container spacing={3}>
                {ContainedButton(0, 0, true)}
                {ContainedButton(0, 1, false)}
                {ContainedButton(0, 2, false)}
                {ContainedButton(1, 0, false)}
                {ContainedButton(1, 1, false)}
                {ContainedButton(1, 2, false)}
            </Grid>
        </Box>
    )
}

export default ClickSimulation;

{/* <div style={{ width: '100%',  height: '900px' }}>
    <Box 
        display='flex'
        height='100%'
        mx={4} 
        my={5}
    >
        <Button 
            onClick={handleButtonClick} 
            ref={buttonRef}
            style={{ minWidth: '20%', maxWidth: '20%', minHeight: '45%', maxHeight: '45%' }}
        >
            Click Me!
        </Button>
    </Box>
</div> */}