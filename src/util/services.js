export { default as useSWR } from "swr";
export { default as useSWRImmutable } from "swr/immutable";
export { default as useSWRInfinite } from "swr/infinite";
import { useSWRConfig } from "swr";
import { getAuth } from "firebase/auth";

const GATEWAY_URL = "https://rostov-gateway.herokuapp.com";
const SONGS_SV_URL = `${GATEWAY_URL}/devsongs`;
const MESSAGES_SV_URL = `${GATEWAY_URL}/messages`;
const NOTIFICATIONS_SV_URL = `${GATEWAY_URL}/notifications`;

export const SONGS_URL = `${SONGS_SV_URL}/songs/`;
export const MY_SONGS_URL = `${SONGS_SV_URL}/my_songs/`;

export const ALBUMS_URL = `${SONGS_SV_URL}/albums/`;
export const MY_ALBUMS_URL = `${SONGS_SV_URL}/my_albums/`;

export const PLAYLISTS_URL = `${SONGS_SV_URL}/playlists/`;
export const MY_PLAYLISTS_URL = `${SONGS_SV_URL}/my_playlists/`;

export const USERS_URL = `${SONGS_SV_URL}/users/`;
export const MY_USER_URL = `${SONGS_SV_URL}/my_user/`;

export const SUBSCRIPTIONS_URL = `${SONGS_SV_URL}/subscriptions/`;

export const STREAMINGS_URL = `${SONGS_SV_URL}/streamings/`;

export const MESSAGES_URL = `${MESSAGES_SV_URL}/messages/`;
export const BALANCE_URL = `${GATEWAY_URL}/payments/balances/`;

export const NOTIFICATIONS_TOKEN_URL = `${NOTIFICATIONS_SV_URL}/tokens/`;
export const NOTIFICATIONS_URL = `${NOTIFICATIONS_SV_URL}/notifications/`;

export const TRIGGER_METRICS_URL =
  "https://4ukt2at75fozsu5fjdzmjgy2yy0qfzch.lambda-url.us-east-2.on.aws/";

export const HTTP_NOT_FOUND = 404;

export const PAGE_SIZE = 10;

export function getUrl(baseUrl, page, other_params) {
  return `${baseUrl}?page=${page}&size=${PAGE_SIZE}${
    other_params ? `&${other_params.join("&")}` : ""
  }`;
}

export function keyExtractor(item) {
  return item.id;
}

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

  if (!res?.ok) throw new FetchError(res, await res.text());

  const json = await res.json();
  return json;
}

function FetchError(response, body) {
  this.message = `Failed to fetch: ${response.status} ${response?.statusText}`;
  this.status = response.status;
  this.statusText = response.statusText;
  this.name = "FetchError";
  this.body = body;
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
