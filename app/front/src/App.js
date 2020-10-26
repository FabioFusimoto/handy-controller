import React from 'react';
import { withLeapContainer } from 'react-leap'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import './App.css';

import Display from './components/Display';
import LeapDebug from './components/LeapDebug';
import Menu from './components/Menu';

const App = ({frame}) => {
  return (
    <Router>
      <Switch>
        <div>
          <Route exact path="/">
            <div className="App">
              <Display frame={frame}/>
            </div>
          </Route>
          <Route path="/leap-debug">
            <div className="LeapDebug">
              <LeapDebug frame={frame} />
            </div>
          </Route>
          <Route path="/menu">
            <div className="Menu">
              <Menu />
            </div>
          </Route>
        </div>
      </Switch>
    </Router>
  );
}

export default withLeapContainer(App);
