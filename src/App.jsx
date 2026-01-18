import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Slideshow from './components/Slideshow';
import InfoOverlay from './components/InfoOverlay';
import SettingsModal from './components/SettingsModal';
import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';
import { IoSettingsSharp } from "react-icons/io5";
import './App.css';

const MainLayout = () => {
  const { isStarted, isLoading } = useAppContext();
  const [showSettings, setShowSettings] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-container">
      <Slideshow />
      <InfoOverlay />

      <div className="settings-btn" onClick={() => setShowSettings(true)}>
        <IoSettingsSharp />
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {!isStarted && !showSettings && <StartScreen />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;