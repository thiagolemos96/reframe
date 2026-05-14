import { useState, useEffect, useRef } from 'react';

export const useWeather = (shouldFetch) => {
  const [weather, setWeather] = useState({ temp: '--', city: 'Loading...' });
  const coordsRef = useRef({ lat: -23.5505, lon: -46.6333 });

  const fetchWeather = async (lat, lon) => {
    try {
      const cityRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const cityData = await cityRes.json();
      const city = cityData.address.city || cityData.address.town || cityData.address.suburb || "Local";

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const weatherData = await weatherRes.json();

      setWeather({
        temp: Math.round(weatherData.current_weather.temperature),
        city: city
      });
    } catch (e) {
      console.error("Error or Offline", e);
      setWeather({ temp: '--', city: 'Offline Mode' });
    }
  };

  useEffect(() => {
    if (!shouldFetch) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coordsRef.current = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          fetchWeather(coordsRef.current.lat, coordsRef.current.lon);
        },
        () => fetchWeather(coordsRef.current.lat, coordsRef.current.lon)
      );
    } else {
      fetchWeather(coordsRef.current.lat, coordsRef.current.lon);
    }

    const timer = setInterval(
      () => fetchWeather(coordsRef.current.lat, coordsRef.current.lon),
      3600000
    );
    return () => clearInterval(timer);
  }, [shouldFetch]);

  return weather;
};
