import { webApi, fetch } from "./services";
const FormData = global.FormData;

async function addFile(body, file) {
  if (!file) return;

  if (file.uri.startsWith("file:/")) {
    body.append("file", file);
    return;
  }

  let req = await fetch(file.uri);
  body.append("file", await req.blob(), file.name);
}

function getUrl(songKey) {
  return webApi + "/songs/" + (songKey ?? "");
}

export async function saveRequest(songKey, formData) {
  let { file, ...rest } = formData;
  const method = songKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));
  await addFile(body, file);

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

export async function deleteRequest(songKey) {
  return fetch(getUrl(songKey), {
    method: "DELETE",
  });
}
