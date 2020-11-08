import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const namesAndValues = [['Contraste', 20], ['Saturação', 45], ['Temperatura', 50], ['Luz de Fundo', 35], ['Nitidez', 45]];

// Hands position ==> Slider mapping
const horizontalRange = 20; // In milimeters
const pinchThreshold = 0.7;
const step = 5;

const verticalLowerLimit = -100;
const verticalUpperLimit = +100;
const totalVerticalMovement = verticalUpperLimit - verticalLowerLimit;
const sliderCount = namesAndValues.length;
const verticalThresholds = [];
[...Array(sliderCount - 1).keys()].forEach((i) => {
  verticalThresholds.push(verticalLowerLimit + (i + 1) * totalVerticalMovement / sliderCount);
});

const ImageMenu = ({ frame }) => {
  // Menu state
  const [sliderValues, setSliderValues] = useState(namesAndValues.map(nameAndVal => nameAndVal[1]));

  // Hand controls
  const [palmPosition, setPalmPosition] = useState([null, null, null]);
  const [neutralPosition, setNeutralPosition] = useState([null, null, null]);
  const [fingersUp, setFingersUp] = useState(null);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [pinchStrength, setPinchStrength] = useState(null);
  const [pinchStartedAt, setPinchStartedAt] = useState(null);

  // Track hand position
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      /* Right hand has priority over left hand */
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1);

      // Palm position
      setPalmPosition(frame.hands[0].palmPosition);

      // Fingers up
      const newFingersUp = frame.hands[0].fingers.filter((f) => (f.extended)).length;
      setFingersUp(newFingersUp);

      // Neutral Position
      if (newFingersUp === 0) {
        setNeutralPosition(frame.hands[0].palmPosition);
      }

      // Pinch Strength
      setPinchStrength(frame.hands[0].pinchStrength);
    } else {
      // Palm position
      setPalmPosition([null, null, null]);

      // Fingers up
      setFingersUp(null);

      // Neutral Position
      setNeutralPosition([null, null, null]);

      // Pinch Strength
      setPinchStrength(null);
    }
  }, [frame]);

  // Slider selection (vertical)
  useEffect(() => {
    if (palmPosition.every(p => p !== null) &&
        neutralPosition.every(p => p !== null) &&
        fingersUp > 0) {
      if (pinchStrength < pinchThreshold) {
        const palmZ = palmPosition[2];
        const neutralZ = neutralPosition[2];
        const verticalDisplacement = (palmZ - neutralZ);

        setSelectedSlider(verticalThresholds.length);
        for (let i = 0; i < verticalThresholds.length; i++) {
          if (verticalDisplacement < verticalThresholds[i]) {
            setSelectedSlider(i);
            break;
          }
        }
      }
    } else {
      setSelectedSlider(null);
    }
  }, [fingersUp, neutralPosition, palmPosition, pinchStrength]);

  // Track pinch position
  useEffect(() => {
    if (pinchStrength > pinchThreshold && palmPosition !== [null, null, null]) {
      if (pinchStartedAt === null) {
        setPinchStartedAt(palmPosition[0]);
      } else {
        const horizontalDisplacement = -(pinchStartedAt - palmPosition[0]);
        if (horizontalDisplacement > horizontalRange) {
          const currentValues = sliderValues.slice();
          currentValues[selectedSlider] += step;
          setPinchStartedAt(palmPosition[0]);
          setSliderValues(currentValues);
        } else if (horizontalDisplacement < (-horizontalRange)) {
          const currentValues = sliderValues.slice();
          currentValues[selectedSlider] -= step;
          setPinchStartedAt(palmPosition[0]);
          setSliderValues(currentValues);
        }
      }
    } else {
      setPinchStartedAt(null);
    }
  }, [palmPosition, pinchStartedAt, pinchStrength, selectedSlider, sliderValues]);

  // Slider changes
  const handleSliderChange = (event, newValue) => {
    const currentValues = sliderValues.slice();
    currentValues[event.target.id] = newValue;
    setSliderValues(currentValues);
  };

  const MenuSlider = (id, name, defaultValue) =>
    <Box
      my={2}
      p={2}
      border={selectedSlider !== null && selectedSlider === id ? 1 : 0}
      borderColor='primary.main'
      borderRadius={16}
      disabled={!(selectedSlider !== null && selectedSlider === id)}
    >
      <Typography
        color={selectedSlider !== null && selectedSlider === id ? 'primary' : 'textSecondary'}
      >
        {name}
      </Typography>
      <Slider
        defaultValue={defaultValue}
        getAriaValueText={(text) => text}
        id={id}
        onChange={handleSliderChange}
        step={step}
        value={sliderValues[id]}
        valueLabelDisplay={selectedSlider !== null && selectedSlider === id ? 'on' : 'off'}
      />
    </Box>;

  return (
    <>
      <Box m={4}>
        {namesAndValues.map((x, i) => MenuSlider(i, x[0], x[1]))}
      </Box>
      <Box mx={4} my={1}>
        Pinch Strength: {Number(pinchStrength).toFixed(2)}
      </Box>
      <Box mx={4} my={1}>
        Pinch Started At: {Number(pinchStartedAt).toFixed(2)}
      </Box>
    </>
  );
};

export default ImageMenu;
