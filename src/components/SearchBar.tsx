import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addFavorite } from '../redux/favoritesSlice';

const API_KEY = '21cc6155622e440d9df35753250111';
const BASE_URL = 'https://api.weatherapi.com/v1'; // HTTPS ONLY

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(value);
    setSuggestions([]);

    if (value.length < 2) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/search.json`, {
        params: { key: API_KEY, q: value },
        timeout: 5000,
      });

      if (res.data && Array.isArray(res.data)) {
        setSuggestions(res.data.map((item: any) => `${item.name}, ${item.region || item.country}`));
      }
    } catch (err: any) {
      console.error('Search failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (city: string) => {
    const name = city.split(',')[0].trim();
    dispatch(addFavorite(name));
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search city..."
        disabled={loading}
      />
      {loading && <p style={{ fontSize: '0.9rem', color: '#007bff' }}>Searching...</p>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((city, i) => (
            <li key={i} onClick={() => handleSelect(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;