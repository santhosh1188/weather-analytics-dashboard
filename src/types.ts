export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  dewPoint: number;
  uvIndex: number;
  forecast: ForecastItem[];
  hourly: HourlyItem[];
}

export interface ForecastItem {
  date: string;
  temp: number;
  condition: string;
  icon: string;
  precip: number;
  windSpeed: number;
  windDir: string;
}

export interface HourlyItem {
  time: string;
  temp: number;
  condition: string;
  icon: string;
}

export type Unit = 'C' | 'F';