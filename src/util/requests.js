import { webApi, fetch } from "./services";
const FormData = global.FormData;

function getSongUrl(songKey) {
  return webApi + "/songs/songs/" + (songKey ?? "");
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
    headers: {
      Accept: "application/json",
      // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      // "Content-Type": "multipart/form-data",
    },
    body,
  });
}

export async function deleteSong(songKey) {
  return fetch(getSongUrl(songKey), {
    method: "DELETE",
  });
}

function getAlbumUrl(albumKey) {
  return webApi + "/songs/albums/" + (albumKey ?? "");
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
    headers: {
      Accept: "application/json",
      // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      // "Content-Type": "multipart/form-data",
    },
    body,
  });
}

export async function deleteAlbum(albumKey) {
  return fetch(getAlbumUrl(albumKey), {
    method: "DELETE",
  });
}

function getPlaylistUrl(playlistKey) {
  return webApi + "/songs/playlists/" + (playlistKey ?? "");
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
    headers: {
      Accept: "application/json",
      // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      // "Content-Type": "multipart/form-data",
    },
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
    headers: {
      Accept: "application/json",
      // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      // "Content-Type": "multipart/form-data",
    },
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
    headers: {
      Accept: "application/json",
      // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      // "Content-Type": "multipart/form-data",
    },
    body,
  });
}
