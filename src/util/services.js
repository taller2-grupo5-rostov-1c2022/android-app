export { default as useSWR } from "swr";
import { getAuth } from "firebase/auth";

export const webApi = "https://rostov-gateway.herokuapp.com";

export const json_fetcher = async (url) =>
  fetch(url).then(async (res) => res.json());

export const text_fetcher = async (url) =>
  fetch(url).then(async (res) => res.text());

export async function fetch(url, request) {
  const auth = getAuth();

  if (auth) {
    const idToken = await auth.currentUser.getIdToken(true);
    const headers = { ...request?.headers, Authorization: `Bearer ${idToken}` };
    request = request ? { ...request, headers } : { headers };
  }

  return globalThis.fetch(url, request);
}
