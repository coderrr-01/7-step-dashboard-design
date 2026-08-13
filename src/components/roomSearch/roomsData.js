// Sample property/room catalogue.
// Room markers use each room's lat/lng. In production this payload comes from a backend API.
// IMPORTANT: only room data uses coordinates — the user's Preferred Location is always geocoded dynamically.

export const roomsData = [
  {
    id: "wc-402",
    name: "Windsor Court",
    roomNumber: "Room 118-402",
    location: "Belgravia Square, London",
    city: "London",
    tier: "Single Room",
    price: 1850,
    availableFrom: "Aug 2026",
    status: "Available",
    lat: 51.4977,
    lng: -0.1544,
    desc: "Ground-floor access to private gardens with floor-to-ceiling windows and bespoke oak...",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFyO66RgErN232FeilZH2elxl6dUKQzQCwz7kMPI25_B_zqHFPxheAh0NU2zRQgEl2agv64IuP7e9GFU7EbewFG0nviJ3nvhBS3cRTGChnfyts4qrq10rk-4YCLcWY1ZhG2Wxi4qMLov3ndhcbNDE0J2voRmmlNw44nP--b7ZQyPIobJZ6wjKWuIMepszpR3IESV4umSDhlJxKAvK1kdMfxiIJdp13gF-cRzpQb_TVAByVp7xbHqQ7XBKPY184WURbvHgIlM1FyCe3",
  },
];

export const DEFAULT_MAP_CENTER = { lat: 51.5074, lng: -0.1278 }; // London
export const DEFAULT_MAP_ZOOM = 5;

export const ROOM_MARKER_JITTER = 0.006;
