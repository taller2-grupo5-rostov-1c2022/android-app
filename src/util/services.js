export { default as useSWR } from "swr";
import { getAuth } from "firebase/auth";

export const webApi = "https://rostov-gateway.herokuapp.com";

export const json_fetcher = async (url) =>
  fetch(url).then(async (res) => res.json());

export const text_fetcher = async (url) =>
  fetch(url).then(async (res) => res.text());

async function getAuthHeaders() {
  const auth = await getAuth();
  if (!auth?.currentUser) return null;
  return {
    authorization: `Bearer ${await getAuth()?.currentUser?.getIdToken()}`,
  };
}

export async function fetch(url, request) {
  const { headers, ...rest } = request ?? {};

  return globalThis.fetch(url, {
    headers: {
      ...headers,
      ...(await getAuthHeaders()),
    },
    ...rest,
  });
}
