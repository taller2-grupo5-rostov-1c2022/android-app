import { useCallback, useEffect, useState, useRef } from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import styles from "../styles.js";
import Player from "../Player";
import FetchedList from "../general/FetchedList";
import SearchBar from "../general/SearchBar";
import { useFavorites } from "../../util/requests";
import { getUrl } from "../../util/services";
import {
  useSWRInfinite,
  json_fetcher,
  keyExtractor,
} from "../../util/services";

export default function ContentScreen({
  withSearchBar,
  url,
  type,
  itemComponent,
}) {
  const [queries, setQueries] = useState(null);
  const {
    saveFavorite,
    deleteFavorite,
    response: { data: favorites },
  } = useFavorites(type);
  const response = useSWRInfinite(
    (index) => getUrl(url, index, queries),
    json_fetcher
  );
  const onLike = useRef(null);

  useEffect(() => {
    if (!favorites) return;

    const favoritesIds = new Set(favorites.map((i) => i.id));
    onLike.current = (item) =>
      favoritesIds.has(item.id) ? deleteFavorite(item) : saveFavorite(item);
  }, [favorites]);

  const customData = useCallback(
    (data) => {
      if (!data) return null;

      let favoritesFilted = favorites ?? [];
      const dataIds = new Set(data.map((i) => i.id));
      if (queries) {
        favoritesFilted = favoritesFilted.filter((item) =>
          dataIds.has(item.id)
        );
      }
      const favoritesIds = new Set(favoritesFilted.map((i) => i.id));

      const addLikeInfo = (item) => ({
        ...item,
        liked: favoritesIds.has(item.id),
        onLike: () => onLike.current && onLike.current(item),
      });

      return favoritesFilted
        .concat(data.filter((item) => !favoritesIds.has(item.id)))
        .map(addLikeInfo);
    },
    [favorites, queries, type]
  );

  const item = useCallback(
    ({ data }) => {
      const ItemComponent = itemComponent;
      const { onLike, liked, ...rest } = data;
      return <ItemComponent onLike={onLike} data={rest} liked={liked} />;
    },
    [itemComponent]
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container]}>
        {withSearchBar ? <SearchBar setQueries={setQueries} /> : undefined}
        <FetchedList
          {...response}
          customData={customData}
          itemComponent={item}
          emptyMessage={
            queries || !withSearchBar
              ? "No results"
              : "There is nothing here..."
          }
          style={styles.listScreen}
          keyExtractor={keyExtractor}
        />
      </View>
      <Player />
    </View>
  );
}

ContentScreen.propTypes = {
  withSearchBar: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  itemComponent: PropTypes.any.isRequired,
};
