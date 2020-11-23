import React, { useState } from 'react';
import { withLeapContainer } from 'react-leap';
import {
  BrowserRouter as Router,
  Route,
  Switch as RouterSwitch
} from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import './App.css';

import Display from './components/Display';
import ImageSettings from './components/ImageSettings';
import LeapDebug from './components/LeapDebug';
import Menu from './components/Menu';
import Settings from './components/Settings';
import TopBar from './components/TopBar';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5E2B97',
      light: '#8F58C8',
      dark: '#2D0068'
    },
    secondary: {
      main: '#EDE15B',
      light: '#FFFF8D',
      dark: '#B8AF27'
    }
  }
});

const App = ({ frame }) => {
  const [gesturesEnabled, setGesturesEnabled] = useState(true);

  const toggleGesturesEnabled = (newToggle) => {
    setGesturesEnabled(newToggle);
  };

  const [neutralPosition, setNeutralPosition] = useState([null, null, null]);

  const DisplayWithFrame = () =>
    <Display
      frame={gesturesEnabled ? frame : null}
      neutralPosition={neutralPosition}
      setNeutralPosition={setNeutralPosition}
    />;

  const MenuWithFrame = () =>
    <Menu
      frame={gesturesEnabled ? frame : null}
      neutralPosition={neutralPosition}
      setNeutralPosition={setNeutralPosition}
    />;

  const SettingsWithFrame = () =>
    <Settings
      frame={gesturesEnabled ? frame : null}
      neutralPosition={neutralPosition}
      setNeutralPosition={setNeutralPosition}
    />;

  const ImageSettingsWithFrame = () =>
    <ImageSettings
      frame={gesturesEnabled ? frame : null}
      neutralPosition={neutralPosition}
      setNeutralPosition={setNeutralPosition}
    />;

  return (
    <MuiThemeProvider theme={theme}>
      <TopBar
        frame={frame}
        gesturesEnabled={gesturesEnabled}
        toggleGesturesEnabled={toggleGesturesEnabled}
      />
      <Router>
        <RouterSwitch>
          <div>
            <AnimatedRoute
              exact
              path='/'
              render={DisplayWithFrame}
              atEnter={{ offset: -100 }}
              atLeave={{ offset: -100 }}
              atActive={{ offset: 0 }}
              mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`
              })}
            />
            <AnimatedRoute
              exact
              path='/menu'
              render={MenuWithFrame}
              atEnter={{ offset: -100 }}
              atLeave={{ offset: -100 }}
              atActive={{ offset: 0 }}
              mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`
              })}
              onLeave={() => console.log('Leaving menu')}
            />
            <AnimatedRoute
              exact
              path='/image-settings'
              render={ImageSettingsWithFrame}
              atEnter={{ offset: 100 }}
              atLeave={{ offset: 100 }}
              atActive={{ offset: 0 }}
              mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`
              })}
            />
            <Route exact path='/leap-debug'>
              <div className='LeapDebug'>
                <LeapDebug frame={frame} />
              </div>
            </Route>
            <AnimatedRoute
              exact
              path='/settings'
              render={SettingsWithFrame}
              atEnter={{ offset: -100 }}
              atLeave={{ offset: -100 }}
              atActive={{ offset: 0 }}
              mapStyles={(styles) => ({
                transform: `translateX(${styles.offset}%)`
              })}
            />
          </div>
        </RouterSwitch>
      </Router>
    </MuiThemeProvider>
  );
};

export default withLeapContainer(App);
