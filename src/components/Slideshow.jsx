import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Slideshow = () => {
  const { images, config } = useAppContext();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, config.time * 1000);

    return () => clearInterval(interval);
  }, [images, config.time]);

  if (!images || images.length === 0) return null;

  const safeIndex = index >= images.length ? 0 : index;
  const currentSrc = images[safeIndex];

  const getObjectFit = () => {
    if (config.fitMode === 'contain') return 'contain';
    if (config.fitMode === '100% 100%') return 'fill';
    return 'cover';
  };

  let animClass = "slide-img";
  if (config.effect === 'zoom') animClass += " effect-zoom";

  return (
    <div className="slideshow-container">
      <img
        key={currentSrc}
        src={currentSrc}
        alt="Slideshow"
        className={animClass}
        style={{ objectFit: getObjectFit() }}
      />
    </div>
  );
};

export default Slideshow;