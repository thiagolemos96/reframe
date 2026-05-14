import { useAppContext } from '../context/AppContext';
import { useTime } from '../hooks/useTime';
import { useWeather } from '../hooks/useWeather';

const InfoOverlay = () => {
  const { config, isStarted } = useAppContext();
  const timeData = useTime();
  const weatherData = useWeather(isStarted);

  if (config.showInfo === 'no') return null;

  return (
    <div className="info-container">
      <div id="clock">{timeData.clock}</div>
      <div className="info-meta">
        <span className="info-date">{timeData.date}</span>
        <span className="info-sep">·</span>
        <span className="info-weather">{weatherData.temp}°C · {weatherData.city}</span>
      </div>
    </div>
  );
};

export default InfoOverlay;
