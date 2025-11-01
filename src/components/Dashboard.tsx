import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { getWeather } from '../redux/weatherSlice';
import CityCard from './CityCard';
import SearchBar from './SearchBar';
import Settings from './Settings';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.cities);
  const weatherData = useSelector((state: RootState) => state.weather.data);
  const unit = useSelector((state: RootState) => state.units.unit);

  useEffect(() => {
    favorites.forEach(city => dispatch(getWeather(city)));
    const interval = setInterval(() => {
      favorites.forEach(city => dispatch(getWeather(city)));
    }, 60000);
    return () => clearInterval(interval);
  }, [favorites, dispatch]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert('Signed in!');
    } catch (err) {
      console.error(err);
    }
  };

  const convert = (temp: number) => unit === 'C' ? temp : (temp * 9/5) + 32;

  return (
    <div className="dashboard">
      <header>
        <h1>Weather Analytics</h1>
        <button onClick={handleGoogleSignIn} className="google-btn">Sign in with Google</button>
      </header>
      <SearchBar />
      <Settings />
      <div className="city-cards">
        {favorites.map(city => {
          const data = weatherData[city];
          if (!data) return null;
          return (
            <CityCard
              key={city}
              city={city}
              temp={convert(data.temp)}
              condition={data.condition}
              icon={data.icon}
              humidity={data.humidity}
              windSpeed={data.windSpeed}
              unit={unit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;