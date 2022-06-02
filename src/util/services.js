export { default as useSWR } from "swr";
export { default as useSWRImmutable } from "swr/immutable";
import { useSWRConfig } from "swr";
import { getAuth } from "firebase/auth";

export const API_URL = "https://rostov-gateway.herokuapp.com";

export const SONGS_URL = `${API_URL}/songs/songs/`;
export const MY_SONGS_URL = `${API_URL}/songs/my_songs/`;

export const ALBUMS_URL = `${API_URL}/songs/albums/`;
export const MY_ALBUMS_URL = `${API_URL}/songs/my_albums/`;

export const PLAYLISTS_URL = `${API_URL}/songs/playlists/`;
export const MY_PLAYLISTS_URL = `${API_URL}/songs/my_playlists/`;

export const USERS_URL = `${API_URL}/songs/users/`;
export const MY_USER_URL = `${API_URL}/songs/my_user/`;

export const MESSAGES_URL = `${API_URL}/messages/messages/`;

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
