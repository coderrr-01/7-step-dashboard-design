// Geocoding service helper.
// Provider: OpenStreetMap Nominatim (no API key required).
// Coordinates are always resolved dynamically — no hardcoded lat/lng for user locations.
// If a keyed provider (Mapbox/Google) is chosen later, add its env vars here without touching components.

const NOMINATIM_ENDPOINT =
  import.meta.env.VITE_NOMINATIM_ENDPOINT ||
  "https://nominatim.openstreetmap.org/search";

// Optional env override for providers that require an API key (used only if set).
const API_TOKEN = import.meta.env.VITE_GEOCODE_API_KEY || null;

const headers = {
  "Content-Type": "application/json",
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
};

/**
 * Search places matching the query.
 * @returns {Promise<Array<{name:string, displayName:string, lat:number, lon:number}>>}
 * @throws {Error} with a stable message in case of failure.
 */
export async function searchLocations(query) {
  if (!query || !query.trim()) return [];

  const params = new URLSearchParams({
    format: "jsonv2",
    q: query.trim(),
    limit: "7",
    "accept-language": "en",
    addressdetails: "1",
  });

  let res;
  try {
    res = await fetch(`${NOMINATIM_ENDPOINT}?${params.toString()}`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    throw new Error("Unable to load location. Please try again.");
  }

  if (!res.ok) {
    throw new Error("Unable to load location. Please try again.");
  }

  const data = await res.json();

  return (data || [])
    .filter((item) => item && item.lat && item.lon)
    .map((item) => ({
      id: item.place_id,
      name: item.name || item.display_name,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      boundingBox: item.boundingbox,
      type: item.type,
    }));
}
