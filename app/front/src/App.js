import React from 'react';
import { withLeapContainer } from 'react-leap'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import './App.css';

import Display from './components/Display'
import LeapDebug from './components/LeapDebug';

const App = ({frame}) => {
  return (
    <Router>
      <Switch>
        <div>
          <Route exact path="/">
            <div className="App">
              <Display />
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
