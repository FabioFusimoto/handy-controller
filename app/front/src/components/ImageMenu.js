import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const namesAndValues = [['Contraste', 20], ['Saturação', 45], ['Temperatura', 50], ['Luz de Fundo', 35], ['Nitidez', 45]];

// Hands position ==> Slider mapping
const horizontalRange = 20; // In milimeters
const pinchThreshold = 0.7;
const step = 5;

const ImageMenu = ({ frame }) => {
  // Menu state
  const [sliderValues, setSliderValues] = useState(namesAndValues.map(nameAndVal => nameAndVal[1]));

  // Hand controls
  const [palmPosition, setPalmPosition] = useState([null, null, null]);
  const [pinchStrength, setPinchStrength] = useState(null);
  const [pinchStartedAt, setPinchStartedAt] = useState(null);

  // Track hand position
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      /* Right hand has priority over left hand */
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1);

      setPalmPosition(frame.hands[0].palmPosition);
      setPinchStrength(frame.hands[0].pinchStrength);
    } else {
      setPalmPosition([null, null, null]);
      setPinchStrength(null);
    }
  }, [frame]);

  // Track pinch position
  useEffect(() => {
    if (pinchStrength > pinchThreshold && palmPosition !== [null, null, null]) {
      if (pinchStartedAt === null) {
        setPinchStartedAt(palmPosition[0]);
      } else {
        const horizontalDisplacement = -(pinchStartedAt - palmPosition[0]);
        if (horizontalDisplacement > horizontalRange) {
          const currentValues = sliderValues.slice();
          currentValues[0] += step;
          setPinchStartedAt(palmPosition[0]);
          setSliderValues(currentValues);
        } else if (horizontalDisplacement < (-horizontalRange)) {
          const currentValues = sliderValues.slice();
          currentValues[0] -= step;
          setPinchStartedAt(palmPosition[0]);
          setSliderValues(currentValues);
        }
      }
    } else {
      setPinchStartedAt(null);
    }
  }, [palmPosition, pinchStrength]);

  // Slider changes
  const handleSliderChange = (event, newValue) => {
    const currentValues = sliderValues.slice();
    currentValues[event.target.id] = newValue;
    setSliderValues(currentValues);
  };

  const MenuSlider = (id, name, defaultValue) =>
    <>
      <Typography>
        {name}
      </Typography>
      <Slider
        defaultValue={defaultValue}
        getAriaValueText={(text) => text}
        id={id}
        onChange={handleSliderChange}
        step={step}
        value={sliderValues[id]}
        valueLabelDisplay='on'
      />
    </>;

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
