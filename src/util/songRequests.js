import { webApi } from "./services";
const FormData = global.FormData;

async function getBlob(uri) {
  let req = await fetch(uri);
  return await req.blob();
}

function getUrl(songKey) {
  return webApi + "/songs/" + (songKey ?? "");
}

export async function saveRequest(songKey, formData) {
  let { file, ...rest } = formData;
  const method = songKey ? "PUT" : "POST";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));

  if (method === "POST") body.append("creator", "SJRPTQKlGqfEhHUnkGfpuA4Cses1");

  if (file) body.append("file", await getBlob(file.uri), file.name);

  const headers = new global.Headers();
  // https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
  // headers.append("Content-Type", "multipart/form-data");
  headers.append("Accept", "application/json");

  return fetch(getUrl(songKey), {
    method,
    headers,
    body,
  });
}

export async function deleteRequest(songKey) {
  return fetch(getUrl(songKey), {
    method: "DELETE",
  });
}
