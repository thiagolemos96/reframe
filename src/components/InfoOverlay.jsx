import { useAppContext } from '../context/AppContext';
import { useTime } from '../hooks/useTime';
import { useWeather } from '../hooks/useWeather';

const InfoOverlay = () => {
  const { config, isStarted } = useAppContext();
  const timeData = useTime();
  const weatherData = useWeather(isStarted);

  if (config.showInfo === 'no') return null;

  const getBackgroundStyle = () => {
    switch (config.infoBg) {
      case 'dark':
        return {
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'none',
          border: '1px solid rgba(255,255,255,0.1)'
        };
      default:
        return {};
    }
  };

  const getShadowStyle = () => {
    switch (config.infoShadow) {
      case 'strong': return '0 0 4px #000, 0 0 8px #000';
      case 'none': return 'none';
      default: return '0 2px 10px rgba(0,0,0,0.5)';
    }
  };

  const dynamicStyle = {
    color: config.infoColor,
    textShadow: getShadowStyle(),
    borderRadius: '24px',
    padding: config.infoBg === 'none' ? '0' : '20px 30px',

    ...getBackgroundStyle()
  };

  return (
    <div className="info-container" style={dynamicStyle}>
      <div id="clock">{timeData.clock}</div>
      <div id="date">{timeData.date}</div>
      <div id="weather">{weatherData.temp}°C - {weatherData.city}</div>
    </div>
  );
};

export default InfoOverlay;