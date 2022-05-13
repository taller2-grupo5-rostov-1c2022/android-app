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
