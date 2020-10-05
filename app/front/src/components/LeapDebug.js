import React, { useEffect, useState } from 'react';

import './LeapDebug.css';

const LeapDebug = ({frame}) => {
    const [palmPosition, setPalmPosition] = useState([]);

    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            setPalmPosition(frame.hands[0].palmPosition);
        } else {
            setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
        }
    }, [frame]);

    const logFrameToConsole = () => console.log(frame);

    return (
        <div>
            <div className={'log-to-console-button'}>
                <button onClick={logFrameToConsole}> Frame to console </button>
            </div>
            <div>
                Palma da mão - X: {Number(palmPosition[0]).toFixed(1)}
            </div>
            <div>
                Palma da mão - Y: {Number(palmPosition[1]).toFixed(1)}
            </div>
            <div>
                Palma da mão - Z: {Number(palmPosition[2]).toFixed(1)}
            </div>           
        </div>
    )
}

export default LeapDebug;