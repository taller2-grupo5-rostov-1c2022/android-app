import React, { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import { AudioContext } from "../general/AudioProvider";
import { fetch, SONGS_URL } from "../../util/services";
import SongItem from "./SongItem";
import { ActivityIndicator } from "react-native-paper";
import { SessionContext } from "../session/SessionProvider";
import { errStr } from "../../util/general";
import styles from "../styles";
import SubIcon from "../general/SubIcon";

export default function PlayableSongItem({ data, right }) {
  const { setSong, setPaused, song } = useContext(AudioContext);
  const { user } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);
  const onPress = useCallback(
    loading
      ? undefined
      : async () => {
          let song = { ...data };
          setLoading(true);
          try {
            let res = await fetch(SONGS_URL + song.id);
            song.url = res.file;
            setSong(song);
            setPaused(false);
          } catch (e) {
            const detail = errStr(e);
            toast.show(`Could not play song ${song?.name}\n${detail}`);
          } finally {
            setLoading(false);
          }
        },
    [data]
  );

  return (
    <SongItem
      data={data}
      right={right}
      onPress={onPress}
      playing={song?.id === data?.id}
      left={useCallback(
        (props) => (
          <View style={[styles.containerCenter, styles.row]}>
            <SubIcon
              subLevel={data?.sub_level}
              {...props}
              style={{ marginRight: 3 }}
            />
            {loading ? (
              <ActivityIndicator color="gray" animating={loading} />
            ) : null}
          </View>
        ),
        [loading, data?.sub_level]
      )}
      style={[{ paddingHorizontal: 0 }].concat(
        data?.sub_level > user?.sub_level ? styles.disabled : []
      )}
    />
  );
}

PlayableSongItem.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired
    ),
    id: PropTypes.number,
    sub_level: PropTypes.number,
  }),
  right: PropTypes.func,
};
