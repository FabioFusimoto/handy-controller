import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// import icons from material.io
import HomeIcon from '@material-ui/icons/Home';
import ScheduleIcon from '@material-ui/icons/Schedule';
import BrightIcon from '@material-ui/icons/Brightness5';
import LanguageIcon from '@material-ui/icons/Language';
import ImageIcon from '@material-ui/icons/ImageTwoTone';
import MusicIcon from '@material-ui/icons/MusicNoteOutlined';

const MenuSettings = () => {
  const buttonColums = 3;
  const buttonRows = 2;
  const buttonIdArray = [...Array(buttonColums * buttonRows).keys()];

  // Button Click => log id to console
  const handleButtonClick = () => {
    console.log('Button Clicked!');
  };

  return (
    <Box>
      <Box
        display='flex'
        height='80vh'
        mx={4}
        my={5}
      >
        <Grid container spacing={3}>
          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                color='default'
                            // id={'button_' + id}
                fullWidth
                onClick={() => handleButtonClick()}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <HomeIcon style={{ fontSize: '10em' }} />
                  Home
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'orange' }}
                            // id={'button_' + id}
                fullWidth
                            // onClick={() => handleButtonClick(id)}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <BrightIcon style={{ fontSize: '10em' }} />
                  Brightness
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                color='default'
                            // id={'button_' + id}
                fullWidth
                            // onClick={() => handleButtonClick(id)}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <ScheduleIcon style={{ fontSize: '10em' }} />
                  Time
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'purple' }}
                            // id={'button_' + id}
                fullWidth
                            // onClick={() => handleButtonClick(id)}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <LanguageIcon style={{ fontSize: '10em' }} />
                  Language
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                color='default'
                            // id={'button_' + id}
                fullWidth
                            // onClick={() => handleButtonClick(id)}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <ImageIcon style={{ fontSize: '10em' }} />
                  Picture
                </Box>
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12 / buttonColums}>
            <Box display='flex' height='100%'>
              <Button
                style={{ color: 'blue' }}
                            // id={'button_' + id}
                fullWidth
                            // onClick={() => handleButtonClick(id)}
                            // ref={button => buttonRefs.current[id] = button}
                variant='outlined'
              >
                <Box display='flex' flexDirection='column'>
                  <MusicIcon style={{ fontSize: '10em' }} />
                  Audio
                </Box>
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default MenuSettings;
