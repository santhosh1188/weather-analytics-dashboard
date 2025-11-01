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
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      try {
        const res = await axios.get(
          `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${value}`
        );
        setSuggestions(res.data.map((item: any) => `${item.name}, ${item.country}`));
      } catch (err) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
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
      <input type="text" value={query} onChange={handleChange} placeholder="Search city..." />
      {suggestions.length > 0 && (
        <ul className="suggestions">
  {suggestions.map((city, i) => (
    <li
      key={i}
      onClick={() => handleSelect(city)}
      style={{ cursor: 'pointer', padding: '10px 15px' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
    >
      {city}
    </li>
  ))}
</ul>
      )}
    </div>
  );
};

export default SearchBar;