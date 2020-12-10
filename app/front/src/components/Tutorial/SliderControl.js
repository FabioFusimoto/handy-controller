import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import ImageSettings from '../ImageSettings';

const SliderControl = ({ frame, neutralPosition, setCurrentStep, setNeutralPosition }) => {
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
        Para voltar ao Menu anterior, realize um movimento de swipe da direita para a esquerda.
        Para controlar os Sliders, faça um movimento de pinça com o dedão e o indicador e
        experimente arrastar para os dois lados. Esta é a última etapa do tutorial.
      </Typography>
      <ImageSettings
        frame={frame}
        neutralPosition={neutralPosition}
        setNeutralPosition={setNeutralPosition}
        tutorial
        tutorialMoveToStep={setCurrentStep}
      />
    </Box>
  );
};

export default SliderControl;
