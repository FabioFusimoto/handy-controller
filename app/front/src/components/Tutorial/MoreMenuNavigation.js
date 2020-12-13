import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Settings from '../Settings';

const MoreMenuNavigation = ({ frame, neutralPosition, setCurrentStep, setNeutralPosition }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      mt={4}
    >
      <Typography
        align='center'
        color='tutorial'
        justifyContent='center'
        variant='h4'
      >
        Para voltar ao Menu anterior, realize um movimento de swipe da esquerda para a direita.
        Para continuar o tutorial, clique no item 'Image' do menu.
      </Typography>
      <Settings
        frame={frame}
        neutralPosition={neutralPosition}
        setNeutralPosition={setNeutralPosition}
        tutorial
        tutorialMoveToStep={setCurrentStep}
      />
    </Box>
  );
};

export default MoreMenuNavigation;
