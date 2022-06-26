import { useContext, useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { getAuth } from "firebase/auth";
import { SessionContext } from "../components/session/SessionProvider";

import {
  fetch,
  json_fetcher,
  USERS_URL,
  SONGS_URL,
  ALBUMS_URL,
  PLAYLISTS_URL,
  SUBSCRIPTIONS_URL,
  TRIGGER_METRICS_URL,
} from "./services";

const FormData = global.FormData;

const commonHeaders = {
  Accept: "application/json",
  // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
  // "Content-Type": "multipart/form-data",
};

function getSongUrl(songKey) {
  return `${SONGS_URL}${songKey ?? ""}`;
}

export async function saveSong(songKey, formData) {
  let { file, artists, ...rest } = formData;
  const method = songKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  if (file) body.append("file", file, "song");
  if (artists) body.append("artists", JSON.stringify(artists));

  return fetch(getSongUrl(songKey), {
    method,
    headers: commonHeaders,
    body,
  });
}

export async function deleteSong(songKey) {
  return fetch(getSongUrl(songKey), {
    method: "DELETE",
  });
}

function getAlbumUrl(albumKey) {
  return `${ALBUMS_URL}${albumKey ?? ""}`;
}

export async function saveAlbum(albumKey, formData) {
  let { cover, songs_ids, ...rest } = formData;
  const method = albumKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  if (cover) body.append("cover", cover, "cover");
  if (songs_ids) body.append("songs_ids", JSON.stringify(songs_ids));

  return fetch(getAlbumUrl(albumKey), {
    method,
    headers: commonHeaders,
    body,
  });
}

export async function deleteAlbum(albumKey) {
  return fetch(getAlbumUrl(albumKey), {
    method: "DELETE",
  });
}

function getPlaylistUrl(playlistKey) {
  return `${PLAYLISTS_URL}${playlistKey ?? ""}`;
}

// formData: { name *, description *, songs_ids, cover }
export async function savePlaylist(playlistKey, formData) {
  let { songs_ids, colabs_ids, ...rest } = formData;
  const method = playlistKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  if (songs_ids) body.append("songs_ids", JSON.stringify(songs_ids));
  if (colabs_ids) body.append("colabs_ids", JSON.stringify(colabs_ids));

  return fetch(getPlaylistUrl(playlistKey), {
    method,
    headers: commonHeaders,
    body,
  });
}

export async function deletePlaylist(playlistKey) {
  return fetch(getPlaylistUrl(playlistKey), {
    method: "DELETE",
  });
}

//moose
export async function addSongToPlaylist(playlistKey, song_id) {
  let body = new FormData();
  body.append("song_id", song_id);

  return fetch(getPlaylistUrl(playlistKey) + "/songs/", {
    method: "POST",
    headers: commonHeaders,
    body,
  });
}

export async function removeSongFromPlaylist(playlistKey, song_id) {
  return fetch(getPlaylistUrl(playlistKey) + "/songs/" + song_id, {
    method: "DELETE",
  });
}

export async function addColabToPlaylist(playlistKey, colab_id) {
  let body = new FormData();
  body.append("colab_id", colab_id);

  return fetch(getPlaylistUrl(playlistKey) + "/colabs/", {
    method: "POST",
    headers: commonHeaders,
    body,
  });
}

// review: {text, score} -> atleast one of them is required
export async function saveReview(albumId, comment, edit) {
  const route = ALBUMS_URL + albumId + "/reviews/";
  const method = edit ? "PUT" : "POST";
  const body = JSON.stringify(comment);
  return fetch(route, {
    method,
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body,
  });
}
export async function deleteReview(albumId) {
  const route = ALBUMS_URL + albumId + "/reviews/";
  return fetch(route, {
    method: "DELETE",
  });
}

export const useReview = () => {
  const { mutate } = useSWRConfig();

  const _saveReview = async (albumId, comment, edit) => {
    saveReview(albumId, comment, edit).then((res) => {
      mutate(ALBUMS_URL + albumId + "/reviews/");
      return res;
    });
  };
  const _deleteReview = async (albumId) => {
    deleteReview(albumId).then((res) => {
      mutate(ALBUMS_URL + albumId + "/reviews/");
      return res;
    });
  };

  return {
    saveReview: _saveReview,
    deleteReview: _deleteReview,
  };
};

// coment: {text}
export async function saveComment(albumId, comment) {
  const route = ALBUMS_URL + albumId + "/comments/";
  const method = "POST";
  const body = JSON.stringify(comment);
  return fetch(route, {
    method,
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body,
  });
}

export async function editComment(commentId, comment) {
  const route = ALBUMS_URL + "comments/" + commentId + "/";
  const method = "PUT";
  const body = JSON.stringify(comment);
  return fetch(route, {
    method,
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    body,
  });
}

export async function deleteComment(commentId) {
  const route = ALBUMS_URL + "/comments/" + commentId + "/";
  return fetch(route, {
    method: "DELETE",
  });
}

export const useComments = () => {
  const { mutate } = useSWRConfig();

  const _saveComment = async (albumId, comment) => {
    saveComment(albumId, comment).then((res) => {
      mutate(ALBUMS_URL + albumId + "/comments/");
      return res;
    });
  };

  const _deleteComment = async (albumId, commentId) => {
    deleteComment(commentId).then((res) => {
      mutate(ALBUMS_URL + albumId + "/comments/");
      return res;
    });
  };

  const _editComment = async (albumId, commentId, comment) => {
    editComment(commentId, comment).then((res) => {
      mutate(ALBUMS_URL + albumId + "/comments/");
      return res;
    });
  };

  return {
    saveComment: _saveComment,
    editComment: _editComment,
    deleteComment: _deleteComment,
  };
};

export const useSubLevels = () => {
  const { data } = useSWR(SUBSCRIPTIONS_URL, json_fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // these should rarely change
  const defaultSubscriptions = [
    {
      level: 0,
      name: "Free",
      price: "0",
    },
    {
      level: 1,
      name: "Premium",
      price: "0.0000001",
    },
    {
      level: 2,
      name: "Pro",
      price: "0.0000005",
    },
    {
      level: 3,
      name: "God",
      price: "1000",
    },
  ];

  return data ?? defaultSubscriptions;
};

export const useMakeArtist = () => {
  const { updateRole } = useContext(SessionContext);

  return () =>
    fetch(USERS_URL + "/make_artist/", {
      method: "POST",
      headers: commonHeaders,
    }).then(() => updateRole());
};

export const subscribe = async (sub_level) =>
  fetch(SUBSCRIPTIONS_URL, {
    method: "POST",
    headers: { ...commonHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ sub_level }),
  });
export async function saveFavorite(uid, id, type) {
  const route = USERS_URL + uid + "/favorites" + type;
  const method = "POST";
  let idType = "song_id";
  if (type == "/albums/") {
    idType = "album_id";
  } else if (type == "/playlists/") {
    idType = "playlist_id";
  }
  return fetch(route + "?" + idType + "=" + id, {
    method,
    headers: commonHeaders,
  });
}

export async function deleteFavorite(uid, id, type) {
  const route = USERS_URL + uid + "/favorites" + type;
  let idType = "song_id";
  if (type == "/albums/") {
    idType = "album_id";
  } else if (type == "/playlists/") {
    idType = "playlist_id";
  }
  return fetch(route + "?" + idType + "=" + id, {
    method: "DELETE",
    headers: commonHeaders,
  });
}

function compareFavorites(data1, data2) {
  return (
    new Set(data1?.items.map((i) => i.id)) ==
    new Set(data2?.items.map((i) => i.id))
  );
}

function sortCmpFavorites(fav1, fav2) {
  return fav1.id > fav2.id;
}

export const useFavorites = (type) => {
  const uid = getAuth()?.currentUser?.uid;
  const response = useSWR(`${USERS_URL}${uid}/favorites${type}`, json_fetcher, {
    compare: compareFavorites,
  });

  useEffect(() => {
    if (!response.error) return;
    toast.show("Error fetching favorites");
    console.error(response.error);
  }, [response.error]);

  const _saveFavorite = async (data) => {
    let optimistic = response.data ?? { items: [] };
    optimistic.items.push(data);
    optimistic.items = optimistic.items.sort(sortCmpFavorites);
    saveFavorite(uid, data.id, type).then((res) => {
      response.mutate(response.mutate, { optimisticData: optimistic });
      return res;
    });
  };

  const _deleteFavorite = async (data) => {
    let optimistic = response.data ?? { items: [] };
    optimistic.items = optimistic.items.filter((item) => item.id != data.id);
    optimistic.items = optimistic.items.sort(sortCmpFavorites);
    deleteFavorite(uid, data.id, type).then((res) => {
      response.mutate(response.mutate, { optimisticData: optimistic });
      return res;
    });
  };

  return {
    saveFavorite: _saveFavorite,
    deleteFavorite: _deleteFavorite,
    response,
  };
};

export const triggerMetric = async (metric) =>
  fetch(TRIGGER_METRICS_URL, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "Content-Type": "application/json",
    },
    mode: "no-cors",
    body: JSON.stringify(metric),
  });
