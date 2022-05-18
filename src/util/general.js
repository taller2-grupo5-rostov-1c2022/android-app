import { webApi, fetch } from "./services";

export const VALID_GENRES = [
  "Rock",
  "Pop",
  "Classic",
  "Indie",
  "Electronic",
  "Disco",
  "Jazz",
  "Hip-Hop",
  "Blues",
].sort();

export const VALID_SUB_LEVELS = [
  { value: 0, label: "Free" },
  { value: 1, label: "Premium" },
  { value: 2, label: "Pro" },
];

export const emailRegex = /^\S+@\S+\.\w+$/;

export function inputValidator(msg) {
  return (v) => !!v?.trim() || msg;
}

export function getArtistsAsString(artists) {
  return `by ${artists?.map((artist) => artist.name).join(", ")}`;
}

export async function playSongList(songs, context, setLoading) {
  setLoading && setLoading(true);
  try {
    let songsWithUrl = await Promise.all(
      songs.map((song) => fetch(webApi + "/songs/songs/" + song.id))
    );
    let queue = songsWithUrl.map((song) => {
      song.url = song.file;
      return song;
    });
    context.setQueue(queue);
    context.setNext(true);
    context.setPaused(false);
  } catch (e) {
    console.error(e);
    toast.show("Could not play album :(", {
      duration: 3000,
    });
  } finally {
    setLoading && setLoading(false);
  }
}
