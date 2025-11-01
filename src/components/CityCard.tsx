import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFavorite } from '../redux/favoritesSlice';
import { useNavigate } from 'react-router-dom';

interface CityCardProps {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  unit: 'C' | 'F';
}

const CityCard: React.FC<CityCardProps> = ({ city, temp, condition, icon, humidity, windSpeed, unit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="city-card" onClick={() => navigate(`/details/${city}`)}>
      <button
        className="remove-btn"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(removeFavorite(city));
        }}
        title="Remove from favorites"
      >
        Remove
      </button>
      <h3>{city}</h3>
      <img src={icon} alt={condition} />
      <p className="temp">{Math.round(temp)}°{unit}</p>
      <p>{condition}</p>
      <p>Humidity: {humidity}%</p>
      <p>Wind: {windSpeed.toFixed(1)} m/s</p>
    </div>
  );
};

export default CityCard;