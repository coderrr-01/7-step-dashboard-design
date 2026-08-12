import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropertyMarker from "./PropertyMarker";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  ROOM_MARKER_JITTER,
} from "./roomsData";
import { FaRotateLeft, FaSpinner } from "react-icons/fa6";

// Maps to city-level view when no precise bounding box is available.
const CITY_ZOOM = 12;

function PropertyMap({ location, rooms, onReset, loadingRooms }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const didInitialFit = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined;

    const map = L.map(containerRef.current, {
      center: [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      zoom: DEFAULT_MAP_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(map);

    mapRef.current = map;
    setMapReady(true);

    const t = setTimeout(() => map.invalidateSize(), 200);

    // Page transitions animate a transform on an ancestor — recalc map size once it settles.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      clearTimeout(t);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
      didInitialFit.current = false;
    };
  }, []);

  // Auto centre + zoom when a location is selected.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location || location.lat == null || location.lon == null) return;

    if (location.bounds) {
      const bounds = L.latLngBounds(location.bounds);
      map.flyToBounds(bounds, {
        duration: 1.1,
        padding: [40, 40],
      });
    } else {
      map.flyTo([location.lat, location.lon], CITY_ZOOM, {
        duration: 1.1,
      });
    }
  }, [location]);

  // Initial view: fit to all room markers so the map is useful on load.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || didInitialFit.current) return;
    if (rooms.length === 0) return;

    const latLngs = rooms.map((r) => [r.lat, r.lng]);
    if (latLngs.length === 1) {
      map.setView(latLngs[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
    didInitialFit.current = true;
  }, [mapReady, rooms]);

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo(
      [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng],
      DEFAULT_MAP_ZOOM,
      { duration: 1 }
    );
    if (onReset) onReset();
  };

  return (
    <div className="property-map-wrap">
      <div ref={containerRef} className="property-map"></div>

      <button className="rs-reset-btn" onClick={handleReset} type="button">
        <FaRotateLeft /> Reset Map
      </button>

      {loadingRooms && (
        <div className="rs-map-loading">
          <FaSpinner className="spin" /> Loading rooms…
        </div>
      )}

      {mapReady && location && location.lat != null && location.lon != null && (
        <PropertyMarker
          map={mapRef.current}
          kind="location"
          position={{ lat: location.lat, lon: location.lon }}
          payload={location}
        />
      )}

      {mapReady &&
        rooms.map((room, i) => (
          <PropertyMarker
            key={room.id}
            map={mapRef.current}
            kind="room"
            position={{
              lat: room.lat + (i % 2 === 0 ? ROOM_MARKER_JITTER : -ROOM_MARKER_JITTER),
              lon: room.lng,
            }}
            payload={room}
          />
        ))}
    </div>
  );
}

export default PropertyMap;
