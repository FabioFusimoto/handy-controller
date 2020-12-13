import React, { useEffect, useRef, useState } from 'react';

import ChannelVolumeControl from './ChannelVolumeControl';
import MenuNavigation from './MenuNavigation';
import MoreMenuNavigation from './MoreMenuNavigation';
import SliderControl from './SliderControl';

import './Tutorial.css';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Tutorial = ({ frame }) => {
  // Progress
  const [stepsFinished, setStepsFinished] = useState(0);
  const incrementStepsFinished = (i) => setStepsFinished(i);

  // Data read from frame
  const [palmPosition, setPalmPosition] = useState(null);
  const [fingersUp, setFingersUp] = useState(null);
  const [neutralPosition, setNeutralPosition] = useState(null);
  const [palmVelocity, setPalmVelocity] = useState(null);
  const velocityThreshold = 400; // In milimeters per second
  const [palmRotation, setPalmRotation] = useState(null);
  const previousRotation = usePrevious(palmRotation);
  const [palmRotationVelocity, setPalmRotationVelocity] = useState(null);
  const rotationVelocityThreshold = 0.002; // In radians per second

  // Time related state variables
  const [renderedAt, setRenderedAt] = useState(null);

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
      }

      // Finger up count
      setFingersUp(newFingersUp);

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

      // Linear palm velocity
      setPalmVelocity(null);

      // Angular palm velocity
      setPalmRotationVelocity(null);
    }
  }, [frame, previousRotation, renderedAt]);

  const [currentStep, setCurrentStep] = useState(0);

  // Move to next step if the previous has been stepsFinished
  useEffect(() => {
    if (palmVelocity !== null && palmVelocity < (-velocityThreshold) &&
        palmRotationVelocity !== null && palmRotationVelocity < (-rotationVelocityThreshold) &&
        fingersUp !== null && fingersUp > 0 &&
        stepsFinished > currentStep) {
      setCurrentStep(1);
    }
  }, [currentStep, fingersUp, palmVelocity, palmRotationVelocity, stepsFinished]);

  const stepComponentsToRender = [
    <ChannelVolumeControl
      fingersUp={fingersUp}
      key={0}
      neutralPosition={neutralPosition}
      onFinish={incrementStepsFinished}
      palmPosition={palmPosition}
      usePrevious={usePrevious}
    />,
    <MenuNavigation
      key={1}
      frame={frame}
      neutralPosition={neutralPosition}
      setCurrentStep={setCurrentStep}
      setNeutralPosition={setNeutralPosition}
    />,
    <MoreMenuNavigation
      key={2}
      frame={frame}
      neutralPosition={neutralPosition}
      setCurrentStep={setCurrentStep}
      setNeutralPosition={setNeutralPosition}
    />,
    <SliderControl
      key={3}
      frame={frame}
      neutralPosition={neutralPosition}
      setCurrentStep={setCurrentStep}
      setNeutralPosition={setNeutralPosition}
    />
  ];

  return (stepComponentsToRender[currentStep]);
};

export default Tutorial;
