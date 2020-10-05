import React, { useEffect, useRef, useState } from 'react';

import './LeapDebug.css'; 

const LeapDebug = ({frame}) => {
    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    };

    const [palmPosition, setPalmPosition] = useState([]);
    const [neutralPosition, setNeutralPosition] = useState([]);
    const [confidence, setConfidence] = useState(0.0);

    const [command, setCommand] = useState('Nenhum');
    const [commandStartedAt, setCommandStartedAt] = useState(undefined);
    const previousCommand = usePrevious(command);

    const distanceThreshold = 100; /* In milimeters */
    const requiredDuration = 1000; /* In miliseconds */

    /* Atualizar a posição das mãos */
    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            if (frame.hands[0].confidence > 0.7) {
                setPalmPosition(frame.hands[0].palmPosition);
            } else {
                setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
            }
            setConfidence(frame.hands[0].confidence);
        } else {
            setPalmPosition(['Nenhuma mão encontrada', 'Nenhuma mão encontrada', 'Nenhuma mão encontrada']);
            setCommand('Nenhum')
        }
    }, [frame]);

    /* Atualizar a posição neutra */
    useEffect(() => {
        if (frame && frame.hands && frame.hands.length > 0) {
            frame.hands.sort((a, b) => (a.type > b.type) ? 0 : 1) /* Right hand has priority over left hand */
            const rightHand = frame.hands[0]
            if (rightHand.fingers.every((f) => f.extended)) {
                if (neutralPosition.length === 0) {
                    setNeutralPosition(rightHand.palmPosition);
                }                
            } else if (rightHand.fingers.every((f) => !f.extended)) {
                setNeutralPosition([]);
            }
        }
    }, [frame, neutralPosition]);

    /* Computar o comando */
    useEffect(() => {
        const palmX = palmPosition[0];
        const palmZ = palmPosition[2];

        const neutralX = neutralPosition[0];
        const neutralZ = neutralPosition[2];

        if (palmZ < (neutralZ - distanceThreshold)) { /* Aumento de canal */
            setCommand('Aumentar o canal');
        } else if (palmZ > (neutralZ + distanceThreshold)) { /* Diminuição de canal */
            setCommand('Diminuir o canal');
        } else if (palmX > (neutralX + distanceThreshold)) { /* Aumento de volume */
            setCommand('Aumentar volume');
        } else if (palmX < (neutralX - distanceThreshold)) { /* Diminuição de volume */
            setCommand('Diminuir volume');
        } else {
            setCommand('Nenhum');
        }

        const now = new Date();

        if (command === 'Nenhum') {
            setCommandStartedAt(undefined);
        } else if (command !== previousCommand) {
            setCommandStartedAt(now);
        }        
    }, [palmPosition, neutralPosition, command, commandStartedAt, previousCommand]);

    /* Disparo do comando */
    useEffect(() => {
        if (command !== 'Nenhum' && commandStartedAt !== undefined) {
            const now = new Date()
            const commandTimeElapsed = now.getTime() - commandStartedAt.getTime();

            if (commandTimeElapsed > requiredDuration) {
                console.log('Command triggered: ' + command);
                setCommandStartedAt(undefined);
                setCommand('Nenhum')
            }
        }
    }, [frame, command, commandStartedAt])

    const logFrameToConsole = () => console.log(frame);

    return (
        <div>
            <div className={'log-to-console-button'}>
                <button onClick={logFrameToConsole}> Frame to console </button>
            </div>            
            <div className={'debug-container'}>
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
            <div className={'debug-container'}>
                <div>
                    Nível de confiança: {Number(confidence).toFixed(2)}
                </div>
            </div>
            <div className={'debug-container'}>
                <div>
                    Posição neutra - X: {Number(neutralPosition[0]).toFixed(1)}
                </div>
                <div>
                    Posição neutra - Y: {Number(neutralPosition[1]).toFixed(1)}
                </div>
                <div>
                    Posição neutra - Z: {Number(neutralPosition[2]).toFixed(1)}
                </div>
            </div>            
            <div className={'debug-container'}>
                <div>
                    Comando: {command}
                </div>
            </div>            
        </div>
    )
}

export default LeapDebug;