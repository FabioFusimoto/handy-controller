import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import ScheduleIcon from '@material-ui/icons/Schedule';
import Security from '@material-ui/icons/Security';
import LanguageIcon from '@material-ui/icons/Language';
import ImageIcon from '@material-ui/icons/ImageTwoTone';
import MusicIcon from '@material-ui/icons/MusicNoteOutlined';
import SettingsPower from '@material-ui/icons/SettingsPower';

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

const Menu = ({ frame, neutralPosition, setNeutralPosition, tutorial, tutorialMoveToStep }) => {
  // Helper function to refer to previous state
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  // Button controls
  const buttonRefs = useRef([]);

  // Hand positioning
  const [fingersUp, setFingersUp] = useState(null);
  const [palmPosition, setPalmPosition] = useState([null, null, null]);

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

  // Navigate back to videos
  const [palmRotation, setPalmRotation] = useState(null);
  const [palmVelocity, setPalmVelocity] = useState(null);
  const [palmRotationVelocity, setPalmRotationVelocity] = useState(null);

  const velocityThreshold = 400; // In milimeters per second
  const rotationVelocityThreshold = 0.002; // In radians per second

  const history = useHistory();
  const previousRotation = usePrevious(palmRotation);

  const [renderedAt, setRenderedAt] = useState(null);

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

      // Linear palm velocity
      setPalmVelocity(frame.hands[0].palmVelocity[0]);

      // Angular velocity
      const newRotation = frame.hands[0].palmNormal[0];
      const newRotationSpeed = (previousRotation === null || newRotation === null) ? null : (newRotation - previousRotation) / frame.currentFrameRate;
      setPalmRotation(newRotation);
      setPalmRotationVelocity(newRotationSpeed);

      if (renderedAt === null) {
        const now = new Date();
        setRenderedAt(now.getTime());
      }
    } else {
      // Palm position
      setPalmPosition([null, null, null]);

      // Neutral position
      setNeutralPosition([null, null, null]);

      // Fingers up
      setFingersUp(null);

      // Index finger speed
      setIndexSpeed(null);

      // Linear palm velocity
      setPalmVelocity(null);

      // Angular palm velocity
      setPalmRotationVelocity(null);
    }
  }, [frame, previousRotation, renderedAt]);

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

  // Go to display after swipe gesture
  useEffect(() => {
    if (palmVelocity !== null && palmVelocity > velocityThreshold &&
        palmRotationVelocity !== null && palmRotationVelocity > rotationVelocityThreshold &&
        fingersUp !== null && fingersUp > 0) {
      const now = new Date();
      if (now.getTime() - renderedAt >= 500) {
        if (tutorial) {
          tutorialMoveToStep(1);
        } else {
          history.push('/menu');
        }
      }
    }
  }, [fingersUp, history, palmVelocity, palmRotationVelocity, renderedAt]);

  // Go to ImageSettings after button click
  const goToImageSettings = () => history.push('/image-settings');

  // Advance tutorial
  const advanceTutorial = () => tutorialMoveToStep(3);

  // Button Click => log id to console
  const handleButtonClick = (id) => {
    console.log('Button Clicked! Id = ' + id);
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
          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'magenta' }}
                id='button_0'
                fullWidth
                onClick={() => handleButtonClick(0)}
                ref={(button) => { buttonRefs.current[0] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <SettingsPower style={{ fontSize: '10em' }} />
                  Power
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'orange' }}
                id='button_1'
                fullWidth
                onClick={() => handleButtonClick(1)}
                ref={(button) => { buttonRefs.current[1] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <Security style={{ fontSize: '10em' }} />
                  Security
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'default' }}
                id='button_2'
                fullWidth
                onClick={() => handleButtonClick(2)}
                ref={(button) => { buttonRefs.current[2] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <ScheduleIcon style={{ fontSize: '10em' }} />
                  Time
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'purple' }}
                id='button_3'
                fullWidth
                onClick={() => handleButtonClick(3)}
                ref={(button) => { buttonRefs.current[3] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <LanguageIcon style={{ fontSize: '10em' }} />
                  Language
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'green' }}
                id='button_4'
                fullWidth
                onClick={tutorial ? advanceTutorial : goToImageSettings}
                ref={(button) => { buttonRefs.current[4] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <ImageIcon style={{ fontSize: '10em' }} />
                  Image
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'blue' }}
                id='button_5'
                fullWidth
                onClick={() => handleButtonClick(5)}
                ref={(button) => { buttonRefs.current[5] = button; }}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <MusicIcon style={{ fontSize: '10em' }} />
                  Audio
                </Box>
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Menu;
