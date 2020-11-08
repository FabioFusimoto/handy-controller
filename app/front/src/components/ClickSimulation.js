import React, { useEffect, useRef, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// Hands position ==> Button mapping
const horizontalLowerLimit = -100;
const horizontalUpperLimit = +100;
const totalHorizontalMovement = horizontalUpperLimit - horizontalLowerLimit;
const buttonColums = 3;

const horizontalThresholds = [];
[...Array(buttonColums - 1).keys()].forEach((i) => {
  horizontalThresholds.push(horizontalLowerLimit + (i + 1) * totalHorizontalMovement / buttonColums);
});

const verticalLowerLimit = -50;
const verticalUpperLimit = +50;
const totalVerticalMovement = verticalUpperLimit - verticalLowerLimit;
const buttonRows = 2;

const verticalThresholds = [];
[...Array(buttonRows - 1).keys()].forEach((i) => {
  verticalThresholds.push(verticalLowerLimit + (i + 1) * totalVerticalMovement / buttonRows);
});

const buttonIdArray = [...Array(buttonColums * buttonRows).keys()];

const ClickSimulation = ({ frame }) => {
  // Button controls
  const buttonRefs = useRef([]);

  // Hand positioning
  const [fingersUp, setFingersUp] = useState(null);
  const [palmPosition, setPalmPosition] = useState([null, null, null]);
  const [neutralPosition, setNeutralPosition] = useState([null, null, null]);

  // Click control
  const [indexSpeed, setIndexSpeed] = useState(null);
  const [clickingEnabled, setClickingEnabled] = useState(true);
  const indexSpeedThreshold = 600; // In milimeters per second
  const indexBackSpeedThreshold = 250; // In milimeters per second
  const [lastClickedAt, setLastClickedAt] = useState(null);
  const minimalTimeBetweenClicks = 200; // In miliseconds

  // Hand positioning => Button Id Equivalence
  const [updateSelection, setUpdateSelection] = useState(false);
  const [horizontalButtonSelection, setHorizontalButtonSelection] = useState(null);
  const [verticalButtonSelection, setVerticalButtonSelection] = useState(null);

  // Button controls
  const focusButton = (id) => {
    buttonRefs.current[id].focus();
  };
  const blurButton = (id) => {
    buttonRefs.current[id].blur();
  };

  const clickButton = (id) => {
    buttonRefs.current[id].click();
  };

  // Track hand position
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1); /* Right hand has priority over left hand */

      // Palm position
      setPalmPosition(frame.hands[0].palmPosition);

      const newFingersUp = frame.hands[0].fingers.filter((f) => (f.extended)).length;

      // Neutral position is updated when the hand is closed
      if (newFingersUp === 0) {
        setNeutralPosition(frame.hands[0].palmPosition);
        buttonIdArray.forEach(id => blurButton(id));
        setUpdateSelection(false);
      } else {
        setUpdateSelection(true);
      }

      // Finger up count
      setFingersUp(newFingersUp);

      // Index finger speed towards the LEAP Motion
      const indexFingertipSpeed = -frame.hands[0].indexFinger.tipVelocity[1]; // +y axis is perpendicular to LEAP, pointing out of the surface
      setIndexSpeed(indexFingertipSpeed);
    } else {
      // Palm position
      setPalmPosition([null, null, null]);

      // Neutral position
      setNeutralPosition([null, null, null]);

      // Fingers up
      setFingersUp(null);

      // Index finger speed
      setIndexSpeed(null);
    }
  }, [frame]);

  // Set button selection according to horizontal and vertical displacements
  useEffect(() => {
    if (palmPosition.every(p => p !== null) && neutralPosition.every(p => p !== null) && updateSelection) {
      const palmX = palmPosition[0];
      const neutralX = neutralPosition[0];
      const horizontalDisplacement = palmX - neutralX;

      setHorizontalButtonSelection(horizontalThresholds.length);
      for (let i = 0; i < horizontalThresholds.length; i++) {
        if (horizontalDisplacement < horizontalThresholds[i]) {
          setHorizontalButtonSelection(i);
          break;
        }
      }

      const palmZ = palmPosition[2];
      const neutralZ = neutralPosition[2];
      const verticalDisplacement = (palmZ - neutralZ);

      setVerticalButtonSelection(verticalThresholds.length);
      for (let i = 0; i < verticalThresholds.length; i++) {
        if (verticalDisplacement < verticalThresholds[i]) {
          setVerticalButtonSelection(i);
          break;
        }
      }
    } else {
      setHorizontalButtonSelection(null);
      setVerticalButtonSelection(null);
    }
  }, [neutralPosition, palmPosition, updateSelection]);

  // Focus on button based on selection
  useEffect(() => {
    if (horizontalButtonSelection !== null && verticalButtonSelection !== null) {
      const buttonToFocus = verticalButtonSelection * buttonColums + horizontalButtonSelection;

      buttonIdArray.forEach((i) => {
        if (i === buttonToFocus) {
          focusButton(i);
        } else {
          blurButton(i);
        }
      });
    } else {
      buttonIdArray.forEach(i => blurButton(i));
    }
  }, [horizontalButtonSelection, verticalButtonSelection]);

  // Click the corresponding button
  useEffect(() => {
    if (fingersUp === 1 &&
            horizontalButtonSelection !== null &&
            verticalButtonSelection !== null &&
            indexSpeed !== null) {
      const now = new Date();
      const timeSinceLastClick = (lastClickedAt === null)
        ? minimalTimeBetweenClicks
        : (now.getTime() - lastClickedAt.getTime());
      if (indexSpeed >= indexSpeedThreshold &&
                    clickingEnabled &&
                    timeSinceLastClick >= minimalTimeBetweenClicks) {
        const buttonId = verticalButtonSelection * buttonColums + horizontalButtonSelection;
        clickButton(buttonId);
        setClickingEnabled(false);
        setLastClickedAt(now);
      } else if (indexSpeed <= (-indexBackSpeedThreshold) && (timeSinceLastClick >= minimalTimeBetweenClicks)) {
        setClickingEnabled(true);
      }
    }
  }, [fingersUp, horizontalButtonSelection, verticalButtonSelection, indexSpeed, clickingEnabled, lastClickedAt]);

  // Button Click => log id to console
  const handleButtonClick = (id) => {
    console.log('Button Clicked! Id = ' + id);
  };

  const ContainedButton = (id) => {
    return (
      <Grid item xs={12 / buttonColums}>
        <Box display='flex' height='100%'>
          <Button
            color='primary'
            id={'button_' + id}
            fullWidth
            onClick={() => handleButtonClick(id)}
            ref={(button) => (buttonRefs.current[id] = button)}
            variant='outlined'
          >
            Click Me! {id}
          </Button>
        </Box>
      </Grid>
    );
  };

  return (
    <Box>
      <Box
        display='flex'
        height='80vh'
        mx={4}
        my={5}
      >
        <Grid container spacing={3}>
          {buttonIdArray.map(id => ContainedButton(id))}
        </Grid>
      </Box>
      <div>
        Palm position: {palmPosition} | Neutral position: {neutralPosition}
      </div>
      <div>
        Horizontal Thresholds: {horizontalThresholds} | Vertical Thresholds: {verticalThresholds}
      </div>
      <div>
        Horizontal Displacement: {Number(palmPosition[0] - neutralPosition[0]).toFixed(1)} | Vertical Displacement: {Number(palmPosition[2] - neutralPosition[2]).toFixed(1)}
      </div>
      <div>
        Horizontal Button Selection: {horizontalButtonSelection} | Vertical Button Selection: {verticalButtonSelection} | ID: {verticalButtonSelection * buttonColums + horizontalButtonSelection}
      </div>
    </Box>
  );
};

export default ClickSimulation;
