import axios from "axios";
const FormData = global.FormData;

export const webApi = "https://rostov-gateway.herokuapp.com";
export const trueApi = "";

const axiosInstance = axios.create({
  baseURL: webApi, // use with scheme
  timeout: 30000,
  // headers: {
  //   api_key: "key",
  // },
});

async function getBlob(uri) {
  let req = await fetch(uri);
  return await req.blob();
}

// send post request and get response
const postSong = async (data) => {
  console.log("postSong data: ", data);

  const formData = new FormData();
  formData.append("name", "fdelu");
  formData.append("description", "a song");
  formData.append("creator", "SJRPTQKlGqfEhHUnkGfpuA4Cses1");
  formData.append("artists", "rostovFC");
  formData.append("file", await getBlob(data.file.uri), data.file.name);

  const config = {
    method: "post",
    url: "/songs/",
    responseType: "json",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: () => formData,
    data: formData,
  };

  const res = await axiosInstance.request(config);
  console.log("res", res);
};

export default postSong;
