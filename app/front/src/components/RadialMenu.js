import React from 'react';
import './RadialMenu.css';

export function RadialMenu ({ command }) {
  return (
    <div className='container'>
      <div className='columns'>
        <p className={command === 'channelUp' ? 'selected' : 'not-selected'}>CH +</p>
        <div className='volume-inline'>
          <p className={command === 'volumeDown' ? 'selected' : 'not-selected'}>Vol -</p>
          <p className={command === 'menu' ? 'selected' : 'not-selected'}>Menu</p>
          <p className={command === 'volumeUp' ? 'selected' : 'not-selected'}>Vol +</p>
        </div>
        <p className={command === 'channelDown' ? 'selected' : 'not-selected'}>CH -</p>
      </div>
    </div>
  );
}
