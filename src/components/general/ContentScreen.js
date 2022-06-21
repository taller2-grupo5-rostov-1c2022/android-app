import { useCallback, useState } from "react";
import { View } from "react-native";
import { getAuth } from "firebase/auth";
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
  const uid = getAuth()?.currentUser?.uid;
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

  const customData = useCallback(
    (data) => {
      if (!data) return null;

      let favoritesFilted = favorites ?? [];
      if (queries) {
        const ids = getFavoritesIds(data);
        favoritesFilted = favoritesFilted.filter((item) =>
          ids?.includes(item.id)
        );
      }
      return favoritesFilted?.concat(
        data.filter(
          (item) => !getFavoritesIds(favoritesFilted)?.includes(item?.id)
        )
      );
    },
    [favorites, queries]
  );

  const onLike = useCallback(
    (data) => {
      if (getFavoritesIds(favorites)?.includes(data?.id)) {
        deleteFavorite(uid, data, type);
      } else {
        saveFavorite(uid, data, type);
      }
    },
    [favorites]
  );

  const item = useCallback(
    ({ data }) => {
      const ItemComponent = itemComponent;
      return (
        <ItemComponent
          onLike={() => onLike(data)}
          data={data}
          liked={getFavoritesIds(favorites)?.includes(data?.id)}
        />
      );
    },
    [onLike, itemComponent]
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

function getFavoritesIds(favorites) {
  return favorites?.map(function (favorite) {
    return favorite.id;
  });
}

ContentScreen.propTypes = {
  withSearchBar: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  itemComponent: PropTypes.any.isRequired,
};
