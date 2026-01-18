import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const StartScreen = () => {
  const { addPhotos } = useAppContext();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    addPhotos(e.target.files);
  };

  return (
    <div className="start-screen">
      <div className="welcome-box">
        <h1>ReFrame</h1>

        <button className="btn btn-blue" onClick={() => fileInputRef.current.click()}>
          Select Photos
        </button>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default StartScreen;