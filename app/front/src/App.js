import React from 'react';
import { withLeapContainer } from 'react-leap';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';

import './App.css';

import ClickSimulation from './components/ClickSimulation';
import Display from './components/Display';
import ImageMenu from './components/ImageMenu';
import LeapDebug from './components/LeapDebug';
import Menu from './components/Menu';
import MenuSettings from './components/MenuSettings';

const App = ({ frame }) => {
  const DisplayWithFrame = () => <Display frame={frame} />;
  const ClickSimulationWithFrame = () => <ClickSimulation frame={frame} />;

  return (
    <Router>
      <Switch>
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
            path='/click-simulation'
            render={ClickSimulationWithFrame}
            atEnter={{ offset: 100 }}
            atLeave={{ offset: 100 }}
            atActive={{ offset: 0 }}
            mapStyles={(styles) => ({
              transform: `translateX(${styles.offset}%)`
            })}
          />
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
