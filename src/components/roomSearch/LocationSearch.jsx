import { useEffect, useRef, useState } from "react";
import { FaLocationDot, FaMagnifyingGlass, FaSpinner } from "react-icons/fa6";
import { searchLocations } from "./geocode";

const POPULAR_LOCATIONS = [
  "London",
  "Manchester",
  "Birmingham",
  "New York",
  "Los Angeles",
];

function LocationSearch({ onSelect, selected, onClear }) {
  const [value, setValue] = useState(selected?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [popular, setPopular] = useState(POPULAR_LOCATIONS);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setValue(selected?.name || "");
  }, [selected]);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const runSearch = (query) => {
    const q = (query || "").trim();
    if (q.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setError("");
      setPopular(POPULAR_LOCATIONS);
      return;
    }

    setLoading(true);
    setError("");

    searchLocations(q)
      .then((results) => {
        if (results.length === 0) {
          setSuggestions([]);
          setPopular([]);
          setError("Location not found. Please try another location.");
        } else {
          setSuggestions(results);
          setPopular([]);
          setError("");
        }
      })
      .catch((err) => {
        setSuggestions([]);
        setPopular([]);
        setError(
          err.message || "Unable to load location. Please try again."
        );
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setActiveIndex(-1);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(v), 350);
  };

  const handleSelect = async (item) => {
    setLoading(true);
    setError("");

    try {
      let result = item;

      // Popular locations have no coordinates yet — geocode them dynamically.
      if (result.lat == null) {
        const matches = await searchLocations(result.name);
        if (matches.length === 0) {
          setError("Location not found. Please try another location.");
          setLoading(false);
          return;
        }
        result = { ...result, ...matches[0] };
      }

      const selection = {
        name: result.name,
        displayName: result.displayName || result.name,
        lat: result.lat,
        lon: result.lon,
        bounds: result.boundingBox
          ? [
              [parseFloat(result.boundingBox[0]), parseFloat(result.boundingBox[2])],
              [parseFloat(result.boundingBox[1]), parseFloat(result.boundingBox[3])],
            ]
          : null,
      };
      setValue(result.name);
      setSuggestions([]);
      setPopular([]);
      setOpen(false);
      setError("");
      onSelect(selection);
    } catch (e) {
      setError(e.message || "Unable to load location. Please try again.");
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValue("");
    setSuggestions([]);
    setOpen(false);
    setError("");
    setPopular(POPULAR_LOCATIONS);
    onClear && onClear();
  };

  const handleKeyDown = (e) => {
    const list = open ? (suggestions.length ? suggestions : popular.map((p) => ({ name: p, displayName: p }))) : [];
    if (!list.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = list[activeIndex] || list[0];
      if (item) handleSelect(item);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="location-search" ref={wrapRef}>
      <div className={`location-search-box ${open && value ? "is-open" : ""}`}>
        <span className="location-search-icon">
          <FaMagnifyingGlass />
        </span>
        <input
          type="text"
          className="location-search-input"
          placeholder="Search location, e.g. London, Camden…"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          aria-label="Preferred Location"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="location-clear"
            onClick={handleClear}
            aria-label="Reset location"
          >
            <span className="location-clear-x">×</span>
          </button>
        )}
      </div>

      {open && (
        <div className="location-suggestions">
          {loading && (
            <div className="location-status">
              <FaSpinner className="spin" /> Searching location…
            </div>
          )}

          {!loading && error && (
            <div className="location-status is-error">{error}</div>
          )}

          {!loading && !error && suggestions.length > 0 && (
            <ul className="location-list">
              {suggestions.map((item, i) => (
                <li
                  key={item.id || `${item.displayName}-${i}`}
                  className={i === activeIndex ? "active" : ""}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(item)}
                >
                  <span className="location-list-icon">
                    <FaLocationDot />
                  </span>
                  <span className="location-list-text">
                    <strong>{item.name}</strong>
                    <small>{item.displayName}</small>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && value.trim().length < 2 && popular.length > 0 && (
            <>
              <div className="location-popular-label">Popular locations</div>
              <ul className="location-list">
                {popular.map((p, i) => (
                  <li
                    key={p}
                    className={i === activeIndex ? "active" : ""}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => handleSelect({ name: p, displayName: p })}
                  >
                    <span className="location-list-icon">
                      <FaLocationDot />
                    </span>
                    <span className="location-list-text">
                      <strong>{p}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;
