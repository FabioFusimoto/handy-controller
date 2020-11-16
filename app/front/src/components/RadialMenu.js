import React from 'react'
import './RadialMenu.css'

export function RadialMenu({command}) {

    return (
        <>
            <p className={command === 'channelUp' ? 'selected' : null}>CH +</p>
            <div className={"channel-inline"}>
                <p className={command === 'volumeDown' ? 'selected' : null}>Vol -</p>
                <p>Menu</p>
                <p className={command === 'volumeUp' ? 'selected' : null}>Vol +</p>
            </div>
            <p className={command === 'channelDown' ? 'selected' : null}>CH -</p>
        </>
    )
}