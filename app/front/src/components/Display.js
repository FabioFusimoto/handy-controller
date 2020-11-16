import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Player } from 'video-react';

import Box from '@material-ui/core/Box';

import ChannelControl from './ChannelControl';
import VolumeControl from './VolumeControl';

import { PlayerCSSLink } from './PlayerCSSLink';
import { RadialMenu } from './RadialMenu'

const Display = ({ frame }) => {
  const [showRadialMenu, setShowRadialMenu] = useState(true)
  const [commandMenu, setCommandMenu] = useState('')
  // Channel control
  const [channel, setChannel] = useState(0);

  // Video player props
  const videos = [
    'http://media.w3.org/2010/05/sintel/trailer.mp4',
    'http://media.w3.org/2010/05/bunny/trailer.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
  ];

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
    console.log('Volume from player: ' + playerRef.current.volume);
    if (playerRef.current.volume >= 0.005) {
      playerRef.current.volume -= 0.2;
      setVolume(playerRef.current.volume);
    }
  };

  const volumeUp = () => {
    console.log('Volume from player: ' + playerRef.current.volume);
    if (playerRef.current.volume <= 0.995) {
      playerRef.current.volume += 0.2;
      setVolume(playerRef.current.volume);
    }
  };

  // Hand control
  const distanceThreshold = 70; /* In milimeters */
  const requiredDuration = 750; /* In miliseconds */

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const [palmPosition, setPalmPosition] = useState([null, null, null]);
  const [neutralPosition, setNeutralPosition] = useState([null, null, null]);
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
    } else {
      setPalmPosition([null, null, null]);
      setPalmRotation(null);
      setPalmRotationVelocity(null);
      setPalmVelocity(null);
      setCommand(null);
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

    if (palmZ < (neutralZ - distanceThreshold)) {
      setCommand('channelUp');
      setCommandMenu('channelUp');
    } else if (palmZ > (neutralZ + distanceThreshold)) {
      setCommand('channelDown');
      setCommandMenu('channelDown');
    } else if (palmX > (neutralX + distanceThreshold)) {
      setCommand('volumeUp');
      setCommandMenu('volumeUp');
    } else if (palmX < (neutralX - distanceThreshold)) {
      setCommand('volumeDown');
      setCommandMenu('volumeDown');
    } else {
      setCommand(null);
      setCommandMenu('menu')
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
            undefined();
        }
        setCommandStartedAt(undefined);
        setCommand(null);
      }
    }
  }, [frame, command, commandStartedAt]);

  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      mx='20vh'
      my='10vh'
    >
      <>
        <PlayerCSSLink />
        <Player
          // autoPlay
          fluid={false}
          width={720}
          height={480}
          src={videos[channel]}
          ref={playerRef}
        />
      </>
      <Box display='flex'>
        <Box mx={4}>
          <VolumeControl volume={volume * 100 || 0} />
        </Box>
        <Box mx={4}>
          <ChannelControl channel={channel || 0} />
        </Box>
      </Box>
      <>
        Palm Rotation: {Number(palmRotation).toFixed(3)} | Palm Velocity: {Number(palmVelocity).toFixed(3)} | Palm Rotation Velocity: {Number(palmRotationVelocity).toFixed(3)} | Current framerate: {Number(frame ? frame.currentFrameRate : 0).toFixed(0)}
      </>
      {showRadialMenu && <RadialMenu command={commandMenu} />}
    </Box>
  );
};

export default Display;
