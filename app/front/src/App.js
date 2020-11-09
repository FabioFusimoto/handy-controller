import React from 'react';
import { withLeapContainer } from 'react-leap';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import './App.css';

import ClickSimulation from './components/ClickSimulation';
import Display from './components/Display';
import ImageMenu from './components/ImageMenu';
import LeapDebug from './components/LeapDebug';
import Menu from './components/Menu';
import MenuSettings from './components/MenuSettings';

const App = ({ frame }) => {
  return (
    <Router>
      <Switch>
        <div>
          <Route exact path='/'>
            <div className='App'>
              <Display frame={frame} />
            </div>
          </Route>
          <Route exact path='/click-simulation'>
            <div className='ClickSimulation'>
              <ClickSimulation frame={frame} />
            </div>
          </Route>
          <Route exact path='/image-menu'>
            <div className='ImageMenu'>
              <ImageMenu frame={frame} />
            </div>
          </Route>
          <Route path='/leap-debug'>
            <div className='LeapDebug'>
              <LeapDebug frame={frame} />
            </div>
          </Route>
          <Route path='/menu'>
            <div className='Menu'>
              <Menu />
            </div>
          </Route>
          <Route path="/menu-settings">
            <div className="MenuSettings">
              <MenuSettings />
            </div>
          </Route>
        </div>
      </Switch>
    </Router>
  );
};

export default withLeapContainer(App);
