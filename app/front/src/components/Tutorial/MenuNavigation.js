import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Menu from '../Menu';

const MenuNavigation = ({ frame, neutralPosition, setCurrentStep, setNeutralPosition }) => {
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
        A navegação pelos menus também é em relação à posição neutra. Experimente deixar apenas
        o indicador levantado e tocar na opção 'Settings'.
      </Typography>
      <Menu
        frame={frame}
        neutralPosition={neutralPosition}
        setNeutralPosition={setNeutralPosition}
        tutorial
        tutorialMoveToStep={setCurrentStep}
      />
    </Box>
  );
};

export default MenuNavigation;
