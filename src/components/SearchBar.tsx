import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addFavorite } from '../redux/favoritesSlice';

const API_KEY = '21cc6155622e440d9df35753250111';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dispatch = useDispatch();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(value);
    if (value.length >= 2) { // Lower threshold to 2 chars
      try {
        const res = await axios.get(
          `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${value}`
        );
        console.log('API Response:', res.data); // Debug in console
        if (res.data && res.data.length > 0) {
          setSuggestions(res.data.map((item: any) => `${item.name}, ${item.region || item.country}`));
        } else {
          setSuggestions([]); // No results
        }
      } catch (err: any) {
        console.error('Search API Error:', err.response?.data || err.message);
        setSuggestions([]); // Handle error silently
        if (err.response?.status === 400) {
          console.log('Invalid query – try a full city name');
        }
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (city: string) => {
    const name = city.split(',')[0].trim();
    if (name) {
      dispatch(addFavorite(name));
      setQuery('');
      setSuggestions([]);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search city (e.g., London, hyd for Hyderabad)..."
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((city, i) => (
            <li
              key={i}
              onClick={() => handleSelect(city)}
              style={{ cursor: 'pointer' }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {query.length >= 2 && suggestions.length === 0 && (
        <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '5px' }}>
          No cities found – try a different spelling
        </p>
      )}
    </div>
  );
};

export default SearchBar;