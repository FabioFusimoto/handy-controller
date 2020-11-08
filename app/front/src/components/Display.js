import React, { useEffect, useRef, useState } from 'react';
import { Player } from 'video-react';

import ChannelControl from './ChannelControl';
import VolumeControl from './VolumeControl';

import { PlayerCSSLink } from './PlayerCSSLink';

const Display = ({ frame }) => {
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

  const [palmPosition, setPalmPosition] = useState([]);
  const [neutralPosition, setNeutralPosition] = useState([]);
  const [fingersUp, setFingersUp] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(null);

  const [command, setCommand] = useState(null);
  const [commandStartedAt, setCommandStartedAt] = useState(undefined);
  const previousCommand = usePrevious(command);

  const [palmNormal, setPalmNormal] = useState([null, null, null]);

  /* Update hands position from frame */
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1); /* Right hand has priority over left hand */
      if (frame.hands[0].confidence > 0.7) {
        setPalmPosition(frame.hands[0].palmPosition);
        setPalmNormal(frame.hands[0].palmNormal);
      } else {
        setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
      }
    } else {
      setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
      setPalmNormal([null, null, null]);
      setCommand(null);
    }
  }, [frame]);

  /* Update neutral position */
  useEffect(() => {
    if (frame && frame.hands && frame.hands.length > 0) {
      frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1); /* Right hand has priority over left hand */
      const rightHand = frame.hands[0];
      const newFingersUp = rightHand.fingers.filter(f => f.extended).length;

      setFingersUp(newFingersUp);

      if (newFingersUp === 0) {
        if (neutralPosition.length === 0) {
          setNeutralPosition(rightHand.palmPosition);
        }
      }
    } else {
      setNeutralPosition([null, null, null]);
      setFingersUp(null);
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
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <PlayerCSSLink />
      <Player
        autoPlay
        fluid={false}
        width={720}
        height={480}
        src={videos[channel]}
        ref={playerRef}
      />
      <VolumeControl volume={volume || 0} />
      <ChannelControl channel={channel} />
      <div>
        Palm Normal X: {Number(palmNormal[0]).toFixed(3)} | Y = {Number(palmNormal[1]).toFixed(3)} | Z = {Number(palmNormal[2]).toFixed(3)}
      </div>
    </div>
  );
};

export default Display;
