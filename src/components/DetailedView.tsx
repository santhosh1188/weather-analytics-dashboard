import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Unit } from '../types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const DetailedView: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.weather.data[city!]);
  const unit = useSelector((state: RootState) => state.units.unit);

  if (!data) {
    return <div className="detailed-view">Loading weather data for {city}...</div>;
  }

  const convertTemp = (temp: number): number => unit === 'C' ? temp : (temp * 9 / 5) + 32;
  const tempUnit = unit === 'C' ? '°C' : '°F';

  const forecastData = data.forecast.map(f => ({
    date: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
    temp: Math.round(convertTemp(f.temp)),
    precip: f.precip,
    wind: f.windSpeed.toFixed(1),
  }));

  const hourlyData = data.hourly.map(h => ({
    time: h.time,
    temp: Math.round(convertTemp(h.temp)),
  }));

  const radarData = [
    { metric: 'Temp', value: Math.round(convertTemp(data.temp)) },
    { metric: 'Humidity', value: data.humidity },
    { metric: 'Wind', value: Math.round(data.windSpeed * 10) / 10 },
    { metric: 'Pressure', value: Math.round(data.pressure / 10) },
    { metric: 'UV', value: Math.round(data.uvIndex) },
    { metric: 'Dew Point', value: Math.round(convertTemp(data.dewPoint)) },
  ];

  return (
    <div className="detailed-view">
      <button onClick={() => navigate('/')} className="back-btn">
        Back to Dashboard
      </button>

      <div className="header">
        <h1>{data.city}</h1>
        <img src={data.icon} alt={data.condition} className="main-icon" />
        <p className="main-temp">{Math.round(convertTemp(data.temp))}{tempUnit}</p>
        <p className="condition">{data.condition}</p>
      </div>

      <div className="stats">
        <p><strong>Humidity:</strong> {data.humidity}%</p>
        <p><strong>Wind:</strong> {data.windSpeed.toFixed(1)} m/s</p>
        <p><strong>Pressure:</strong> {data.pressure} mb</p>
        <p><strong>Dew Point:</strong> {Math.round(convertTemp(data.dewPoint))}{tempUnit}</p>
        <p><strong>UV Index:</strong> {data.uvIndex}</p>
      </div>

      <h3>7-Day Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(v: any) => v === forecastData[0].precip ? `${v} mm` : `${v}${tempUnit}`} />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" name={`Temp (${tempUnit})`} strokeWidth={2} />
          <Line type="monotone" dataKey="precip" stroke="#82ca9d" name="Precip (mm)" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Next 12 Hours</h3>
      {hourlyData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(v: any) => `${v}${tempUnit}`} />
            <Bar dataKey="temp" fill="#ff7300" name={`Temp (${tempUnit})`} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No hourly data available.</p>
      )}

      <h3>Weather Radar</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar name={data.city} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="footer-note">
        Real-time data • Updates every 60 seconds
      </div>
    </div>
  );
};

export default DetailedView;