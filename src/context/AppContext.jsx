import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveImagesToDB, loadImagesFromDB, deleteImageFromDB, clearDB } from '../utils/db';

const AppContext = createContext();

const DEFAULT_CONFIG = {
  time: 10,
  effect: 'zoom',
  showInfo: 'yes',
  fitMode: 'cover',
  infoColor: '#ffffff',
  infoBg: 'glass',
  infoShadow: 'normal'
};

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('reFrameConfig');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch (e) { return DEFAULT_CONFIG; }
  });

  const [images, setImages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const cachedImages = await loadImagesFromDB();
        if (cachedImages && cachedImages.length > 0) {
          setImages(cachedImages);
          setIsStarted(true);
        }
      } catch (error) {
        console.error("Erro no cache:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    localStorage.setItem('reFrameConfig', JSON.stringify(config));
  }, [config]);

  const addPhotos = (fileList) => {
    if (fileList && fileList.length > 0) {
      const filesArray = Array.from(fileList);
      const newLocalUrls = filesArray.map(file => URL.createObjectURL(file));

      setImages(prev => [...prev, ...newLocalUrls]);
      setIsStarted(true);

      saveImagesToDB(fileList)
        .then(() => console.log("Salvo."))
        .catch(err => console.error(err));
    }
  };

  const removePhoto = (index) => {
    const imageToRemove = images[index];
    const newImageList = images.filter((_, i) => i !== index);
    setImages(newImageList);

    if (newImageList.length === 0) setIsStarted(false);

    if (typeof imageToRemove === 'string' && imageToRemove.startsWith('data:')) {
      deleteImageFromDB(imageToRemove);
    }
  };

  const resetApp = async () => {
    setImages([]);
    setIsStarted(false);
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem('reFrameConfig');
    await clearDB();
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{ config, setConfig, images, addPhotos, removePhoto, isStarted, resetApp, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);