import axios from 'axios';
import { WeatherData, ForecastItem, HourlyItem } from '../types';

const API_KEY = '21cc6155622e440d9df35753250111';
const BASE_URL = 'https://api.weatherapi.com/v1';

const cache: { [key: string]: { data: WeatherData; timestamp: number } } = {};
const CACHE_DURATION = 60000;

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  const cacheKey = `weather_${city}`;
  const cached = cache[cacheKey];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`),
      axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`)
    ]);

    const current = currentRes.data.current;
    const location = currentRes.data.location;
    const forecastDays = forecastRes.data.forecast.forecastday;

    const data: WeatherData = {
      city: location.name,
      temp: current.temp_c,
      condition: current.condition.text,
      icon: current.condition.icon.replace('//', 'https://'),
      humidity: current.humidity,
      windSpeed: current.wind_kph / 3.6,
      pressure: current.pressure_mb,
      dewPoint: current.dewpoint_c,
      uvIndex: current.uv,
      forecast: forecastDays.map((day: any) => ({
        date: day.date,
        temp: day.day.avgtemp_c,
        condition: day.day.condition.text,
        icon: day.day.condition.icon.replace('//', 'https://'),
        precip: day.day.totalprecip_mm,
        windSpeed: day.day.maxwind_kph / 3.6,
        windDir: degreesToCompass(day.day.avgwind_kph, day.day.wind_degree || 0),
      })) as ForecastItem[],
      hourly: forecastDays[0].hour
        .filter((_: any, i: number) => i % 2 === 0)
        .slice(0, 12)
        .map((h: any) => ({
          time: h.time.split(' ')[1].slice(0, 5),
          temp: h.temp_c,
          condition: h.condition.text,
          icon: h.condition.icon.replace('//', 'https://'),
        })) as HourlyItem[],
    };

    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw new Error(`Failed to fetch weather for ${city}`);
  }
};

function degreesToCompass(speed: number, deg: number): string {
  if (speed === 0) return 'Calm';
  const val = Math.floor((deg / 22.5) + 0.5);
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[val % 16];
}