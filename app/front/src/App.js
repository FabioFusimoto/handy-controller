import React from 'react';
import './App.css';

import SlideShow from './components/SlideShow'
import VolumeControl from './components/VolumeControl'

function App() {

  return (
    <div className="App">
      <SlideShow />
      <VolumeControl />
    </div>
  );
}

export default App;
