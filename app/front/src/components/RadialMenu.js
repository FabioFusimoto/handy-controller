import React, { useState, useEffect } from 'react';
import './RadialMenu.css';

export function RadialMenu ({ command }) {
  const [volumeUpClass, setVolumeUpClass] = useState('not-selected');
  const [volumeDownClass, setVolumeDownClass] = useState('not-selected');
  const [channelUpClass, setChannelUpClass] = useState('not-selected');
  const [channelDownClass, setChannelDownClass] = useState('not-selected');
  const [menuClass, setMenuClass] = useState('not-selected');

  useEffect(() => {
    switch (command) {
      case 'volumeUp':
        setVolumeUpClass('selected')
        setMenuClass('not-selected')
        break;
      case 'volumeDown':
        setVolumeDownClass('selected')
        setMenuClass('not-selected')
        break;
      case 'channelUp':
        setChannelUpClass('selected')
        setMenuClass('not-selected')
        break;
      case 'channelDown':
        setChannelDownClass('selected')
        setMenuClass('not-selected')
        break;
      case 'volumeUpIntention':
        setVolumeUpClass('intention-selected')
        setMenuClass('not-selected')
        break;
      case 'volumeDownIntention':
        setVolumeDownClass('intention-selected')
        setMenuClass('not-selected')
        break;
      case 'channelUpIntention':
        setChannelUpClass('intention-selected')
        break;
      case 'channelDownIntention':
        setChannelDownClass('intention-selected')
        setMenuClass('not-selected')
        break;
      default:
        setMenuClass('selected')
        setVolumeUpClass('not-selected')
        setVolumeDownClass('not-selected')
        setChannelUpClass('not-selected')
        setChannelDownClass('not-selected')
        return;
    }
  }, [command])

  return (
    <div className='container'>
      <div className='columns'>
        <p className={channelUpClass}>CH +</p>
        <div className='volume-inline'>
          <p className={volumeDownClass}>Vol -</p>
          <p className={menuClass}>Menu</p>
          <p className={volumeUpClass}>Vol +</p>
        </div>
        <p className={channelDownClass}>CH -</p>
      </div>
    </div>
  );
}

