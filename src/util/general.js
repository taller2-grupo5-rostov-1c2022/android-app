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
