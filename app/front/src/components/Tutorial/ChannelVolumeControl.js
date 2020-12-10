import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ChannelControl from '../ChannelControl';
import VolumeControl from '../VolumeControl';

import { RadialMenu } from '../RadialMenu';

const ChannelVolumeControl = ({ fingersUp, neutralPosition, onFinish, palmPosition, usePrevious }) => {
  // Calibration constants
  const distanceThreshold = 70; /* In miliseconds */
  const defaultDuration = 800; /* In miliseconds */

  // Commands management
  const [command, setCommand] = useState(null);
  const [commandStartedAt, setCommandStartedAt] = useState(null);
  const previousCommand = usePrevious(command);

  const [volume, setVolume] = useState(0.5);
  const [channel, setChannel] = useState(0);

  // Progress state variables
  // progress --> 0: resetNeutralPosition; 1: issueCommands
  const [progress, setProgress] = useState(0);
  const previousProgress = usePrevious(progress);
  const [fingersUpWasZero, setFingersUpWasZero] = useState(false);

  // Manage Progress
  useEffect(() => {
    if (previousProgress === 0 && fingersUpWasZero) {
      setProgress(1);
    } else if (previousProgress === 1 && fingersUp > 0) {
      setProgress(2);
      onFinish(1);
    }
  }, [fingersUp, fingersUpWasZero, onFinish, previousProgress]);

  // Messages
  const subtitleMessages = [
    `O disparo dos comandos depende da posição neutra. Para estabelecer uma posição
    neutra, feche todos os dedos. A última posição em que os dedos permaneceram fechados
    será considerada a neutra`,
    'Agora abra os dedos',
    `Com os dedos abertos, os comandos podem ser dados baseando-se na posição da mão
    aberta em relação à neutra. Experimente mexer a mão vertical e horizontalmente para
    ver os comandos correspondentes (eles são disparados depois de certo tempo em que a
    mão está distante da posição neutra)`
  ];

  // Check if the user reset the neutralPosition
  useEffect(() => {
    if (fingersUp === 0) {
      setFingersUpWasZero(true);
    }
  }, [fingersUp]);

  // Manage commands
  useEffect(() => {
    if (palmPosition && palmPosition[0] !== null) {
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
      }

      const now = new Date();

      if (command === null) {
        setCommandStartedAt(null);
      } else if (command !== previousCommand) {
        setCommandStartedAt(now);
      }
    }
  }, [palmPosition, neutralPosition, command, commandStartedAt, previousCommand]);

  const channelDown = () => {
    if (channel > 0) {
      setChannel(channel - 1);
    }
  };

  const channelUp = () => {
    if (channel < 100) {
      setChannel(channel + 1);
    }
  };

  const volumeDown = () => {
    if (volume >= 0.005) {
      setVolume(volume - 0.01);
    }
  };

  const volumeUp = () => {
    if (volume <= 0.995) {
      setVolume(volume + 0.01);
    }
  };

  /* Trigger command */
  useEffect(() => {
    if (command !== null && commandStartedAt !== null) {
      const now = new Date();
      const commandTimeElapsed = now.getTime() - commandStartedAt.getTime();

      if (commandTimeElapsed > defaultDuration) {
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
            return;
        }
        setCommandStartedAt(null);
        setCommand(null);
      }
    }
  }, [palmPosition, command, commandStartedAt]);

  const ControlsDisplay = () =>
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
    >
      <>
        <Box
          display='flex'
          flexDirection='row'
        >
          <Box mx={4}>
            <VolumeControl volume={volume * 100 || 0} />
          </Box>
          <Box mx={4}>
            <ChannelControl channel={channel || 0} />
          </Box>
        </Box>
      </>
      <RadialMenu command={command || 'menu'} />
      <Box my={4}>
        <Typography
          align='center'
          justifyContent='center'
          variant='h4'
        >
          Para avançar para a próxima etapa, realize um movimento de swipe da direita para a esquerda. A movimentação
          entre menu e o display de vídeo é comandada por estes movimentos: Display para Menu = Direita para Esquerda &
          Menu para Display = Esquerda para Direita
        </Typography>
      </Box>
    </Box>;

  return (
    <Box mx='20vh' my='5vh'>
      <Box my={6}>
        <Typography
          color='primary'
          align='center'
          justifyContent='center'
          variant='h3'
        >
          Esta parte do tutorial ensinará comandos básicos para controle de volume e canal
        </Typography>
      </Box>
      <Typography
        align='center'
        justifyContent='center'
        variant='h4'
      >
        {subtitleMessages[progress]}
      </Typography>
      {(progress < 2) ? null : <ControlsDisplay />}
    </Box>
  );
};

export default ChannelVolumeControl;
