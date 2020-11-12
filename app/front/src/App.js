import { createBrowserHistory } from 'history';
import React from 'react';
import { withLeapContainer } from 'react-leap';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { AnimatedRoute } from 'react-router-transition';

import './App.css';

import Display from './components/Display';
import ImageSettings from './components/ImageSettings';
import LeapDebug from './components/LeapDebug';
import Menu from './components/Menu';
import Settings from './components/Settings';

const App = ({ frame }) => {
  const history = createBrowserHistory();

  const DisplayWithFrame = () => <Display frame={frame} />;
  const MenuWithFrame = () => <Menu frame={frame} />;
  const SettingsWithFrame = () => <Settings frame={frame} />;
  const ImageSettingsWithFrame = () => <ImageSettings frame={frame} />;

  return (
    <Router histoy={history}>
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
      </Switch>
    </Router>
  );
};

export default withLeapContainer(App);
