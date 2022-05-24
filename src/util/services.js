export { default as useSWR } from "swr";
export { default as useSWRImmutable } from "swr/immutable";
import { useSWRConfig } from "swr";
import { getAuth } from "firebase/auth";

export const webApi = "https://rostov-gateway.herokuapp.com";

export const json_fetcher = async (url) => {
  return await fetch(url);
};

async function getAuthHeaders() {
  const auth = await getAuth();
  if (!auth?.currentUser) return null;
  return {
    authorization: `Bearer ${await getAuth()?.currentUser?.getIdToken(false)}`,
  };
}

export async function fetch(url, request) {
  const { headers, ...rest } = request ?? {};
  const res = await globalThis.fetch(url, {
    headers: {
      ...headers,
      ...(await getAuthHeaders()),
    },
    ...rest,
  });

  if (!res?.ok) throw new FetchError(res);

  const json = await res.json();

  return json;
}

function FetchError(response) {
  this.message = `Failed to fetch: ${response.status} ${response?.statusText}`;
  this.status = response.status;
  this.statusText = response.statusText;
  this.name = "FetchError";
}

export function useMatchMutate() {
  const { cache, mutate } = useSWRConfig();
  return (matcher, ...args) => {
    if (!(cache instanceof Map)) {
      throw new Error(
        "matchMutate requires the cache provider to be a Map instance"
      );
    }

    const keys = [];

    for (const key of cache.keys()) {
      if (matcher(key)) keys.push(key);
    }

    const mutations = keys.map((key) => mutate(key, ...args));
    return Promise.all(mutations);
  };
}
