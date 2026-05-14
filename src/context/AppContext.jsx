import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveImagesToDB, loadImagesFromDB, deleteImageFromDB, clearDB, fileToBase64 } from '../utils/db';

const AppContext = createContext();

const applyAccent = (hex) => {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const d = (c) => Math.round(c * 0.78);
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-dark', `rgb(${d(r)},${d(g)},${d(b)})`);
  root.style.setProperty('--accent-light', `rgba(${r},${g},${b},0.85)`);
  root.style.setProperty('--accent-bg', `rgba(${r},${g},${b},0.15)`);
  root.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.35)`);
};

const DEFAULT_CONFIG = {
  time: 10,
  effect: 'zoom',
  showInfo: 'yes',
  fitMode: 'cover',
  accentColor: '#6366f1'
};

export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('reFrameConfig');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch { return DEFAULT_CONFIG; }
  });

  const [images, setImages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const cachedImages = await loadImagesFromDB();
        if (cachedImages && cachedImages.length > 0) {
          setImages(cachedImages.map(item => ({ url: item.data, dbId: item.id })));
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
    applyAccent(config.accentColor);
  }, [config]);

  const addPhotos = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const base64List = await Promise.all(filesArray.map(file => fileToBase64(file)));
    const newItems = base64List.map(url => ({ url, dbId: null }));

    setImages(prev => [...prev, ...newItems]);
    setIsStarted(true);

    saveImagesToDB(fileList)
      .then(ids => {
        setImages(prev => {
          const updated = [...prev];
          const startIndex = updated.length - ids.length;
          ids.forEach((id, i) => {
            if (updated[startIndex + i]) {
              updated[startIndex + i] = { url: updated[startIndex + i].url, dbId: id };
            }
          });
          return updated;
        });
      })
      .catch(err => console.error(err));
  };

  const removePhoto = (index) => {
    const imageToRemove = images[index];
    const newImageList = images.filter((_, i) => i !== index);
    setImages(newImageList);

    if (newImageList.length === 0) setIsStarted(false);

    if (imageToRemove.dbId !== null) {
      deleteImageFromDB(imageToRemove.dbId);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
