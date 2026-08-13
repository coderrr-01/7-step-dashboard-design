// Maps the dynamic Zoho room payload (/jrny/v1/rooms) onto the shape the
// room-search UI consumes. Zoho room records do not expose lat/lng, so map
// pins are placed from the neighborhood embedded in the room/building name.
// Keep this layer isolated — components never read raw Zoho fields directly.

const NEIGHBORHOOD_COORDS = [
  { key: 'long island city', city: 'New York', lat: 40.7447, lng: -73.9485 },
  { key: 'brooklyn heights', city: 'New York', lat: 40.6958, lng: -73.9936 },
  { key: 'upper east side', city: 'New York', lat: 40.7736, lng: -73.9566 },
  { key: 'chelsea', city: 'New York', lat: 40.7450, lng: -74.0010 },
  { key: 'manhattan', city: 'New York', lat: 40.7580, lng: -73.9855 },
];

function deriveArea(room) {
  const text = `${room?.name || ''} ${room?.building_name || ''}`.toLowerCase();
  return NEIGHBORHOOD_COORDS.find((n) => text.includes(n.key)) || null;
}

function deriveTier(roomType, name) {
  const t = `${roomType || ''} ${name || ''}`.toLowerCase();
  if (t.includes('studio')) return 'Studio';
  if (t.includes('suite')) return 'Executive Suites';
  return 'Single Room';
}

export function normalizeRoom(raw) {
  const area = deriveArea(raw);
  const images = Array.isArray(raw?.images) ? raw.images.filter(Boolean) : [];
  const monthlyRent = raw?.monthly_rent != null ? Number(raw.monthly_rent) : NaN;
  const securityDeposit = raw?.security_deposit != null ? Number(raw.security_deposit) : NaN;

  return {
    ...raw,
    roomNumber: raw?.unit_number || raw?.roomNumber || '',
    location: raw?.building_name || 'New York',
    city: area ? area.city : 'New York',
    lat: area ? area.lat : null,
    lng: area ? area.lng : null,
    price: Number.isFinite(monthlyRent) ? monthlyRent : (raw?.price || 0),
    monthly_rent: Number.isFinite(monthlyRent) ? monthlyRent : undefined,
    security_deposit: Number.isFinite(securityDeposit) ? securityDeposit : undefined,
    tier: deriveTier(raw?.room_type, raw?.name),
    desc: raw?.description || raw?.features || '',
    img: images[0] || raw?.img || '',
    availableFrom: raw?.availableFrom || '',
  };
}

export function normalizeRooms(rooms) {
  return (rooms || []).map(normalizeRoom).filter((room) => room.id);
}
