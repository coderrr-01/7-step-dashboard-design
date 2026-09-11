// Shared room-status helpers used by RoomSearch, ViewRoom and SecureBooking.
// A room is "available" when its status contains "available"; anything else
// (empty, "occupied", "booked", "leased", ...) is treated as occupied.

export function isRoomAvailable(room) {
  return String(room?.status || "").toLowerCase().includes("available");
}

export function isRoomOccupied(room) {
  return !isRoomAvailable(room);
}