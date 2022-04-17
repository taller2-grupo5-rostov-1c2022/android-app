export { default as useSWR } from "swr";

export const webApi = "https://rostov-gateway.herokuapp.com";

export const json_fetcher = async (url) =>
  fetch(url).then(async (res) => res.json());

export const text_fetcher = async (url) =>
  fetch(url).then(async (res) => res.text());
