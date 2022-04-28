import * as React from 'react';
import { Appbar } from 'react-native-paper';
import styles from "./styles.js";
import appContext from './appContext.js';

const Player = () => {
    const [paused, setPaused] = React.useState(true);
    const [active, setActive] = React.useState(true);
    const playerContext = React.createContext();
    const togglePaused = () => setPaused(prev => !prev);
    const context = React.useContext(appContext);
    const playIcon = paused ? "play" : "pause";
    
    return (
        <Appbar style={styles.bottom}>
            <Appbar.Content  title={context.name} subtitle={context.artist} />
            <Appbar.Action icon="heart-outline" onPress={() => console.log('Pressed heart')} />
            <Appbar.Action icon={playIcon} onPress={togglePaused} />
            <Appbar.Action icon="skip-next" onPress={() => console.log('Pressed skip')} />
        </Appbar>
    )
};


export default Player;
