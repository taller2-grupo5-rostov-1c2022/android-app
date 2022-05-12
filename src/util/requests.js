import { webApi, fetch } from "./services";
const FormData = global.FormData;

function getUrl(songKey) {
  return webApi + "/songs/songs/" + (songKey ?? "");
}

export async function saveSong(songKey, formData) {
  let { file, artists, ...rest } = formData;
  const method = songKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  if (file) body.append("file", file, "song");
  if (artists) body.append("artists", JSON.stringify(artists));

  return fetch(getUrl(songKey), {
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
  return fetch(getUrl(songKey), {
    method: "DELETE",
  });
}

export async function saveAlbum(albumKey, formData) {
  return async () => {
    null;
  };
}

export async function deleteAlbum(albumKey, formData) {
  return async () => {
    null;
  };
}
