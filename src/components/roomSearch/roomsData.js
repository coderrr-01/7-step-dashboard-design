// Sample property/room catalogue.
// Room markers use each room's lat/lng. In production this payload comes from a backend API.
// IMPORTANT: only room data uses coordinates — the user's Preferred Location is always geocoded dynamically.

export const roomsData = [
  {
    id: "Loading",
  },
];

export const DEFAULT_MAP_CENTER = { lat: 51.5074, lng: -0.1278 }; // London
export const DEFAULT_MAP_ZOOM = 5;

export const ROOM_MARKER_JITTER = 0.006;
