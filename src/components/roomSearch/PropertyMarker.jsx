import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locationIcon = () =>
  L.divIcon({
    className: "rs-marker-wrap",
    html: `<div class="rs-location-pin"><span class="rs-pin-dot"></span></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 44],
    popupAnchor: [0, -44],
  });

const roomIcon = (isOpen) =>
  L.divIcon({
    className: "rs-marker-wrap",
    html: `<div class="rs-room-pin ${isOpen ? "is-open" : ""}"><span>🏠</span><span class="rs-room-price"></span></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });

const roomPopupHtml = (room) => `
  <div class="rs-room-popup">
    <div class="rs-room-popup-img" style="background-image:url('${room.img}')"></div>
    <div class="rs-room-popup-body">
      <div class="rs-room-popup-title">${room.name}</div>
      <div class="rs-room-popup-meta"><span class="rs-popup-loc">${room.location}</span></div>
      <div class="rs-room-popup-price">$${room.price.toLocaleString()} <em>/mo</em></div>
      <div class="rs-room-popup-avail">${room.availableFrom ? `Available from ${room.availableFrom}` : 'Available'}</div>
      <a href="/view-room" class="rs-room-popup-btn">View Details</a>
    </div>
  </div>
`;

function PropertyMarker({ map, position, kind = "room", payload, active }) {
  useEffect(() => {
    if (!map || !position) return undefined;

    const lat = Number(position.lat);
    const lng = Number(position.lng ?? position.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return undefined;

    let marker;

    if (kind === "location") {
      marker = L.marker([lat, lng], {
        icon: locationIcon(),
        riseOnHover: true,
        zIndexOffset: 2000,
      });
      if (payload?.name) {
        marker.bindPopup(
          `<div class="rs-location-popup"><span class="rs-location-popup-icon">📍</span> ${payload.name}</div>`,
          { closeButton: false, offset: L.point(0, -4) }
        );
        marker.openPopup();
      }
    } else {
      marker = L.marker([lat, lng], {
        icon: roomIcon(active),
        riseOnHover: true,
        zIndexOffset: 1000,
      });
      if (payload) marker.bindPopup(roomPopupHtml(payload), { minWidth: 260, maxWidth: 300 });
    }

    marker.addTo(map);
    return () => {
      if (marker) {
        marker.remove();
      }
    };
  }, [map, position, kind, payload, active]);

  return null;
}

export default PropertyMarker;
