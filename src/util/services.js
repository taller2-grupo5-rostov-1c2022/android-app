export { default as useSWR, useSWRConfig } from "swr";
export { default as useSWRImmutable } from "swr/immutable";
import { getAuth } from "firebase/auth";

export const webApi = "https://rostov-gateway.herokuapp.com";

export const fetcher = async (url) => {
  const request = await fetch(url);
  if (request.status != "200")
    throw new Error(`Failed to fetch: ${request.status} ${request.statusText}`);
  return request;
};

export const json_fetcher = async (url) => {
  return await (await fetcher(url)).json();
};

export const text_fetcher = async (url) => {
  return await (await fetcher(url)).text();
};

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
