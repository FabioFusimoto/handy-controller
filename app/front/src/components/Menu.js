import React from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// import icons from material.io
import TvIcon from '@material-ui/icons/Tv';
import BtIcon from '@material-ui/icons/Bluetooth'
import SettingsIcon from '@material-ui/icons/Settings'
import WifiIcon from '@material-ui/icons/Wifi'
import SettInputIcon from '@material-ui/icons/SettingsInputHdmi'
import YoutubeIcon from '@material-ui/icons/YouTube'

const Menu = () => {

    const buttonColums = 3;
    const buttonRows = 2;
    const buttonIdArray = [...Array(buttonColums * buttonRows).keys()];

    // Button Click => log id to console
    const handleButtonClick = () => {
        console.log('Button Clicked!');
    }
    
    return (
        <Box>
            <Box 
              display='flex'
              height='80vh'
              mx={4}
              my={5}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            color='primary'
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <BtIcon style={{ fontSize: '10em' }}/>
                                    Bluetooth
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            color='action'
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <TvIcon style={{ fontSize: '10em' }}/>
                                    TV
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            style={{ color: 'gray'}}
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <SettingsIcon style={{ fontSize: '10em' }}/>
                                    Settings
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            color='primary'
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <WifiIcon style={{ fontSize: "10em" }}/>
                                    Wifi
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            color='default'
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <SettInputIcon style={{ fontSize: '10em' }}/>
                                    Input
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12/buttonColums}>
                        <Box display='flex' height='100%'>
                            <Button
                            style={{ color: 'red'}}
                            // id={'button_' + id}
                            fullWidth
                            onClick={() => handleButtonClick()}
                            //ref={button => buttonRefs.current[id] = button}
                            variant='outlined'
                            >
                                <Box display='flex' flexDirection='column'>
                                    <YoutubeIcon style={{ fontSize: '10em' }}/>
                                    Youtube
                                </Box>
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    )
}

export default Menu;
