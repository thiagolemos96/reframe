import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const StartScreen = () => {
  const { addPhotos } = useAppContext();
  const fileInputRef = useRef(null);

  return (
    <div className="start-screen">
      <div className="welcome-box">
        <div className="welcome-icon">🖼</div>
        <h1>ReFrame</h1>
        <p className="welcome-subtitle">Turn your screen into<br />a personal photo frame</p>
        <button className="btn btn-accent-full" onClick={() => fileInputRef.current.click()}>
          Select Photos
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => addPhotos(e.target.files)}
        />
      </div>
    </div>
  );
};

export default StartScreen;
