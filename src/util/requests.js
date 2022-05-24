import { useSWRConfig } from "swr";

import { ALBUMS_URL, fetch, PLAYLISTS_URL, SONGS_URL } from "./services";
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

// coment: {text, score} -> atleast one of them is required
export async function saveComment(albumId, comment, edit) {
  const route = ALBUMS_URL + albumId + "/comments/";
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
export async function deleteComment(albumId) {
  const route = ALBUMS_URL + albumId + "/comments/";
  return fetch(route, {
    method: "DELETE",
  });
}

export const useComments = () => {
  const { mutate } = useSWRConfig();

  const _saveComment = async (albumId, comment, edit) => {
    saveComment(albumId, comment, edit).then((res) => {
      mutate(ALBUMS_URL + albumId + "/comments/");
      return res;
    });
  };
  const _deleteComment = async (albumId) => {
    deleteComment(albumId).then((res) => {
      mutate(ALBUMS_URL + albumId + "/comments/");
      return res;
    });
  };

  return {
    saveComment: _saveComment,
    deleteComment: _deleteComment,
  };
};
