import * as React from 'react';
import { Appbar } from 'react-native-paper';
import styles from "./styles.js";

const Player = () => {
    const [paused, setPaused] = React.useState(true);

    const togglePaused = () => setPaused(prev => !prev);

    const icon = paused ? "play" : "pause";

    return (
 <Appbar style={styles.bottom}>
        <Appbar.Content  title="Title" subtitle={'Subtitle'} />
        <Appbar.Action icon="heart-outline" onPress={() => console.log('Pressed heart')} />
        <Appbar.Action icon={icon} onPress={togglePaused} />
        <Appbar.Action icon="skip-next" onPress={() => console.log('Pressed skip')} />
  </Appbar>
    )
    };

export default Player
