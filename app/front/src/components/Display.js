import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Player } from 'video-react';

import Box from '@material-ui/core/Box';

import ChannelControl from './ChannelControl';
import VolumeControl from './VolumeControl';

import { PlayerCSSLink } from './PlayerCSSLink';
import { RadialMenu } from './RadialMenu';

// Helper function to check previous state
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Display = ({ frame, neutralPosition, setNeutralPosition }) => {
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  // Channel control
  const [channel, setChannel] = useState(0);

  // Video player props
  const videos = [
    'http://media.w3.org/2010/05/sintel/trailer.mp4',
    'http://media.w3.org/2010/05/bunny/trailer.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
  ];

  // Hand control
  const distanceThreshold = 70; /* In milimeters */
  const defaultDuration = 800; /* In miliseconds */
  const minimumDuration = 100; /* In miliseconds */
  const [requiredDuration, setRequiredDuration] = useState(defaultDuration);
  const previousDuration = usePrevious(requiredDuration);

  const halveRequiredDuration = () => {
    if (requiredDuration > minimumDuration) {
      setRequiredDuration(previousDuration / 2);
    }
  };

  const resetDuration = () => {
    setRequiredDuration(defaultDuration);
  };

  const playerRef = useRef();

  const channelDown = () => {
    if (channel === 0) {
      setChannel(videos.length - 1);
    } else {
      setChannel(channel - 1);
    }
    playerRef.current.load();
  };

  const channelUp = () => {
    if (channel === videos.length - 1) {
      setChannel(0);
    } else {
      setChannel(channel + 1);
    }
    playerRef.current.load();
  };

  // Volume control
  const [volume, setVolume] = useState(1);

  const volumeDown = () => {
    if (playerRef.current.volume >= 0.005) {
      playerRef.current.volume -= 0.2;
      setVolume(playerRef.current.volume);
    }
  };

  const volumeUp = () => {
    if (playerRef.current.volume <= 0.995) {
      playerRef.current.volume += 0.2;
      setVolume(playerRef.current.volume);
    }
  };

  const [palmPosition, setPalmPosition] = useState([null, null, null]);
  const [fingersUp, setFingersUp] = useState(null);
  const [palmRotation, setPalmRotation] = useState(null);
  const previousRotation = usePrevious(palmRotation);
  const [palmVelocity, setPalmVelocity] = useState(null);
  const velocityThreshold = 400; // In milimeters per second
  const [palmRotationVelocity, setPalmRotationVelocity] = useState(null);
  const rotationVelocityThreshold = 0.002; // In radians per second
  const history = useHistory();

  const [command, setCommand] = useState(null);
  const [commandStartedAt, setCommandStartedAt] = useState(undefined);
  const previousCommand = usePrevious(command);

  // Update positions from frame
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1); /* Right hand has priority over left hand */
      setPalmPosition(frame.hands[0].palmPosition);

      const newFingersUp = frame.hands[0].fingers.filter(f => f.extended).length;
      setFingersUp(newFingersUp);
      if (newFingersUp === 0) {
        setNeutralPosition(frame.hands[0].palmPosition);
        setPalmRotation(null);
      }
      // Linear and angular velocity handler
      const newRotation = frame.hands[0].palmNormal[0];
      const newRotationSpeed = (previousRotation === null || newRotation === null) ? null : (newRotation - previousRotation) / frame.currentFrameRate;
      setPalmRotation(newRotation);
      setPalmRotationVelocity(newRotationSpeed);
      setPalmVelocity(frame.hands[0].palmVelocity[0]);
      setShowRadialMenu(true);
    } else {
      setPalmPosition([null, null, null]);
      setPalmRotation(null);
      setPalmRotationVelocity(null);
      setPalmVelocity(null);
      setCommand(null);
      setShowRadialMenu(false);
    }
  }, [frame, previousRotation]);

  // Open menu depending on linear and angular palm velocity
  useEffect(() => {
    if (palmVelocity !== null && palmVelocity < (-velocityThreshold) &&
        palmRotationVelocity !== null && palmRotationVelocity < (-rotationVelocityThreshold) &&
        fingersUp !== null && fingersUp > 0) {
      history.push('/menu');
    }
  }, [fingersUp, history, palmVelocity, palmRotationVelocity]);

  // Select the corresponding channel/volume
  useEffect(() => {
    const palmX = palmPosition[0];
    const palmZ = palmPosition[2];

    const neutralX = neutralPosition[0];
    const neutralZ = neutralPosition[2];

    if (palmZ < (neutralZ - distanceThreshold)) { // Channel up
      setCommand('channelUp');
    } else if (palmZ < (neutralZ - distanceThreshold / 2)) { // Channel up intention
      setCommand('channelUpIntention');
    } else if (palmZ > (neutralZ + distanceThreshold)) { // Channel down
      setCommand('channelDown');
    } else if (palmZ > (neutralZ + distanceThreshold / 2)) { // Channel down intention
      setCommand('channelDownIntention');
    } else if (palmX > (neutralX + distanceThreshold)) { // Volume up
      setCommand('volumeUp');
    } else if (palmX > (neutralX + distanceThreshold / 2)) { // Volume up intention
      setCommand('volumeUpIntention');
    } else if (palmX < (neutralX - distanceThreshold)) { // Volume down
      setCommand('volumeDown');
    } else if (palmX < (neutralX - distanceThreshold / 2)) { // Volume down intention
      setCommand('volumeDownIntention');
    } else {
      setCommand(null);
      resetDuration();
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
        switch (command) {
          case 'volumeUp':
            volumeUp();
            halveRequiredDuration();
            break;
          case 'volumeDown':
            volumeDown();
            halveRequiredDuration();
            break;
          case 'channelUp':
            channelUp();
            halveRequiredDuration();
            break;
          case 'channelDown':
            channelDown();
            halveRequiredDuration();
            break;
          default:
            return;
        }
        setCommandStartedAt(undefined);
        setCommand(null);
      }
    }
  }, [frame, command, commandStartedAt]);

  // Get the screen size, making the video full screen
  const screenHeight = window.screen.height - 140
  const screenWidth = window.screen.width
  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      justifyContent='center'
    >
      <>
        <PlayerCSSLink />
        <Player
          autoPlay
          fluid={false}
          width={screenWidth}
          height={screenHeight}
          src={videos[channel]}
          ref={playerRef}
        />
      </>
      <Box display='flex'>
        {(command === 'volumeUp' || command === 'volumeDown' ||
          command === 'volumeUpIntention' || command === 'volumeDownIntention') &&
            <Box mx={4}>
              <VolumeControl volume={volume * 100 || 0} />
            </Box>}
        {(command === 'channelUp' || command === 'channelDown' ||
          command === 'channelUpIntention' || command === 'channelDownIntention') &&
            <Box mx={4}>
              <ChannelControl channel={channel || 0} />
            </Box>}
      </Box>
      {command && <RadialMenu command={command || 'menu'} />}
    </Box>
  );
};

export default Display;
