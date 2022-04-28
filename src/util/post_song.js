import axios from "axios";
import { webApi } from "./services";
const FormData = global.FormData;

const axiosInstance = axios.create({
  baseURL: webApi,
  timeout: 30000,
});

async function getBlob(uri) {
  let req = await fetch(uri);
  return await req.blob();
}

async function saveRequest(songKey, formData) {
  let { file, ...rest } = formData;
  const method = songKey ? "PUT" : "POST";
  const url = songKey ?? "";

  let body = new FormData();
  Object.entries(rest).forEach(([key, value]) => body.append(key, value));

  if (method === "POST") body.append("creator", "SJRPTQKlGqfEhHUnkGfpuA4Cses1");

  if (file) body.append("file", await getBlob(file.uri), file.name);

  const config = {
    method,
    url: "/songs/" + url,
    responseType: "json",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: () => body,
    data: body,
  };

  return axiosInstance.request(config);
}

export default saveRequest;
