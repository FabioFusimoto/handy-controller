import React from 'react';
import { withLeapContainer } from 'react-leap'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import './App.css';

import SlideShow from './components/SlideShow'
import VolumeControl from './components/VolumeControl'
import LeapDebug from './components/LeapDebug';

const App = ({frame}) => {
  return (
    <Router>
      <Switch>
        <div>
          <Route exact path="/">
            <div className="App">
              <SlideShow />
              <VolumeControl />
            </div>
          </Route>
          <Route path="/leap-debug">
            <div className="LeapDebug">
              <LeapDebug frame={frame} />
            </div>
          </Route>
        </div>
      </Switch>
    </Router>
  );
}

export default withLeapContainer(App);
