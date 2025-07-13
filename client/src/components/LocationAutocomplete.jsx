import { useState } from "react";
import "../App.css";

const NominatimURL = "https://nominatim.openstreetmap.org/search";

const LocationAutocomplete = ({ value, onChange }) => {
  const [query, setQuery] = useState(value?.short_label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (input) => {
    setQuery(input);
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: input,
        format: "json",
        addressdetails: 1,
        limit: 5,
      });

      const res = await fetch(`${NominatimURL}?${params.toString()}`);
      const data = await res.json();

      setSuggestions(
        data.map((place) => {
          const address = place.address || {};
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            "";
          const state = address.state || "";
          const country = address.country || "";
          const shortLabel = [city, state, country].filter(Boolean).join(", ");

          return {
            place_id: place.place_id,
            short_label: shortLabel,
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
          };
        })
      );
    } catch (error) {
      alert("Error fetching Locations!");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    onChange({
      short_label: place.short_label,
      latitude: place.lat,
      longitude: place.lon,
    });
    setQuery(place.short_label);
    setSuggestions([]);
  };

  return (
    <div className="location-autocomplete">
      <input
        type="text"
        placeholder="Start typing your location..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="location-input"
      />
      {loading && <div className="loading">Searching...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="suggestion-item"
            >
              {place.short_label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
