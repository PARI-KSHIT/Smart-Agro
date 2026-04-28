import { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Search,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Thermometer,
  Cloud,
  Loader2,
  Navigation,
  Sprout,
  Droplet,
  CalendarDays,
} from 'lucide-react';

// ⚠️  Replace with your own free OpenWeatherMap API key from https://openweathermap.org/api
const API_KEY = 'a406ecbae33271ee688840efc601d3f0'; // placeholder – replace this

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  main: { temp: number; feels_like: number; humidity: number; temp_min: number; temp_max: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  wind: { speed: number };
  dt: number;
}

interface ForecastItem {
  dt: number;
  main: { temp_min: number; temp_max: number };
  weather: { main: string; description: string; icon: string }[];
}

interface DailyForecast {
  date: string;
  dayName: string;
  icon: string;
  description: string;
  min: number;
  max: number;
}

const WMO_BG: Record<string, string> = {
  Clear: 'from-amber-400 via-orange-300 to-yellow-200',
  Clouds: 'from-slate-400 via-gray-300 to-slate-200',
  Rain: 'from-blue-600 via-blue-400 to-cyan-300',
  Drizzle: 'from-blue-400 via-cyan-300 to-teal-200',
  Thunderstorm: 'from-gray-800 via-slate-600 to-gray-400',
  Snow: 'from-blue-100 via-white to-slate-100',
  Mist: 'from-gray-400 via-slate-300 to-gray-200',
  Fog: 'from-gray-400 via-slate-300 to-gray-200',
  Haze: 'from-yellow-300 via-amber-200 to-orange-100',
};

function getBg(condition: string) {
  return WMO_BG[condition] ?? 'from-emerald-500 via-teal-400 to-green-300';
}

function formatTime(unix: number) {
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getWeatherEmoji(main: string) {
  const map: Record<string, string> = {
    Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️',
    Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️', Haze: '🌤️',
  };
  return map[main] ?? '🌡️';
}

export default function Weather() {
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  const fetchWeather = useCallback(async (lat?: number, lon?: number, cityName?: string) => {
    setLoading(true);
    setError('');
    try {
      const locParam = lat !== undefined
        ? `lat=${lat}&lon=${lon}`
        : `q=${encodeURIComponent(cityName ?? '')}`;

      const [wRes, fRes] = await Promise.all([
        fetch(`${BASE_URL}/weather?${locParam}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?${locParam}&appid=${API_KEY}&units=metric`),
      ]);

      if (!wRes.ok) {
        const err = await wRes.json();
        throw new Error(err.message ?? 'City not found');
      }

      const wData: WeatherData = await wRes.json();
      const fData = await fRes.json();

      setWeather(wData);

      // Group 3-hour intervals into daily forecasts
      const dailyMap: Record<string, ForecastItem[]> = {};
      (fData.list as ForecastItem[]).forEach((item) => {
        const dateKey = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!dailyMap[dateKey]) dailyMap[dateKey] = [];
        dailyMap[dateKey].push(item);
      });

      const daily = Object.entries(dailyMap).slice(0, 7).map(([date, items]) => {
        const mins = items.map(i => i.main.temp_min);
        const maxs = items.map(i => i.main.temp_max);
        const noon = items[Math.floor(items.length / 2)];
        const dateObj = new Date(items[0].dt * 1000);
        return {
          date,
          dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
          icon: noon.weather[0].icon,
          description: noon.weather[0].main,
          min: Math.round(Math.min(...mins)),
          max: Math.round(Math.max(...maxs)),
        };
      });

      setForecast(daily);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) fetchWeather(undefined, undefined, query.trim());
  };

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeather(coords.latitude, coords.longitude);
        setGeoLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enter a city manually.');
        setGeoLoading(false);
      }
    );
  };

  // Load default city on mount
  useEffect(() => {
    fetchWeather(undefined, undefined, 'New Delhi');
  }, [fetchWeather]);

  const bg = weather ? getBg(weather.weather[0].main) : 'from-emerald-600 via-teal-500 to-green-400';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero Banner ── */}
      <div className={`bg-gradient-to-br ${bg} transition-all duration-700 pt-10 pb-16 px-4`}>
        <div className="max-w-5xl mx-auto">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <form onSubmit={handleSearch} className="flex flex-1 gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Enter city name…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur text-gray-800 placeholder-gray-400 shadow-md outline-none focus:ring-2 focus:ring-emerald-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-md transition disabled:opacity-60"
              >
                Search
              </button>
            </form>
            <button
              type="button"
              onClick={handleGeoLocate}
              disabled={geoLoading || loading}
              className="flex items-center gap-2 px-5 py-3 bg-white/90 hover:bg-white text-emerald-800 rounded-xl font-semibold shadow-md transition disabled:opacity-60 backdrop-blur"
            >
              {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
              {geoLoading ? 'Detecting…' : 'Use My Location'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-300 text-red-700 rounded-xl px-5 py-3 text-center font-medium">
              {error}
            </div>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          {/* Current Weather Card */}
          {!loading && weather && (
            <div className="bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-white flex flex-col md:flex-row items-center gap-8">
              {/* Left: Temp + condition */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <MapPin className="w-5 h-5 opacity-80" />
                  <span className="text-xl font-semibold opacity-90">
                    {weather.name}, {weather.sys.country}
                  </span>
                </div>
                <div className="text-8xl font-extrabold tracking-tighter leading-none mb-3">
                  {Math.round(weather.main.temp)}°
                </div>
                <div className="text-2xl capitalize font-medium opacity-90 mb-1">
                  {weather.weather[0].description}
                </div>
                <div className="text-sm opacity-75">
                  Feels like {Math.round(weather.main.feels_like)}° · H:{Math.round(weather.main.temp_max)}° L:{Math.round(weather.main.temp_min)}°
                </div>
              </div>

              {/* Right: Big emoji + current time */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-9xl select-none drop-shadow-lg">
                  {getWeatherEmoji(weather.weather[0].main)}
                </div>
                <div className="text-sm opacity-75 font-medium">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Cards ── */}
      {!loading && weather && (
        <div className="max-w-5xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Droplets className="w-6 h-6 text-blue-500" />, label: 'Humidity', value: `${weather.main.humidity}%` },
              { icon: <Wind className="w-6 h-6 text-teal-500" />, label: 'Wind', value: `${Math.round(weather.wind.speed * 3.6)} km/h` },
              { icon: <Sunrise className="w-6 h-6 text-amber-500" />, label: 'Sunrise', value: formatTime(weather.sys.sunrise) },
              { icon: <Sunset className="w-6 h-6 text-orange-500" />, label: 'Sunset', value: formatTime(weather.sys.sunset) },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition">
                <div className="bg-gray-50 rounded-xl p-3">{card.icon}</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
                  <p className="text-xl font-bold text-gray-800">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── 7-Day Forecast ── */}
          {forecast.length > 0 && (
            <div className="mt-8 bg-white rounded-3xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-5">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-800">7-Day Forecast</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-gray-50 hover:bg-emerald-50 rounded-2xl p-4 transition cursor-default"
                  >
                    <span className="text-xs font-semibold text-gray-500 uppercase mb-2">{day.dayName}</span>
                    <span className="text-3xl mb-2">{getWeatherEmoji(day.description)}</span>
                    <span className="text-xs text-gray-500 mb-3 capitalize">{day.description}</span>
                    <div className="flex gap-1 text-sm font-bold">
                      <span className="text-emerald-700">{day.max}°</span>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-500">{day.min}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Farmer Benefit Section ── */}
          <div className="mt-8 mb-12 bg-gradient-to-br from-emerald-700 to-teal-600 rounded-3xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">🌾 How Weather Helps Farmers</h2>
            <p className="text-emerald-100 mb-6 text-sm">
              Real-time weather information is critical for smart agricultural decisions.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Sprout className="w-7 h-7 text-emerald-300" />,
                  title: 'Crop Planning',
                  desc: 'Know the best time to sow and harvest based on upcoming rainfall and temperature trends.',
                },
                {
                  icon: <Droplet className="w-7 h-7 text-blue-300" />,
                  title: 'Irrigation Management',
                  desc: 'Save water by skipping irrigation on rainy days and optimizing scheduling during dry spells.',
                },
                {
                  icon: <Thermometer className="w-7 h-7 text-orange-300" />,
                  title: 'Frost & Heat Alerts',
                  desc: 'Protect sensitive crops from extreme cold or heat events before they cause damage.',
                },
                {
                  icon: <Wind className="w-7 h-7 text-teal-300" />,
                  title: 'Pesticide Spraying',
                  desc: 'Choose calm, dry days for optimal pesticide application and prevent chemical runoff.',
                },
                {
                  icon: <Cloud className="w-7 h-7 text-gray-300" />,
                  title: 'Disease Prevention',
                  desc: 'High humidity and rain forecasts signal increased risk of fungal diseases — act early.',
                },
                {
                  icon: <CalendarDays className="w-7 h-7 text-yellow-300" />,
                  title: 'Weekly Planning',
                  desc: 'Use the 7-day forecast to plan field operations, logistics, and market trips in advance.',
                },
              ].map(item => (
                <div key={item.title} className="flex gap-4 items-start bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="shrink-0 bg-white/10 rounded-xl p-2">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-emerald-100 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
