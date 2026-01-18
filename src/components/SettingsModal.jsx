import React, { useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const SettingsModal = ({ onClose }) => {
  const { config, setConfig, images, addPhotos, removePhoto, resetApp } = useAppContext();
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileAdd = (e) => {
    addPhotos(e.target.files);
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all photos and settings.")) {
      resetApp();
    }
  };

  return (
    <div className="settings-modal" onClick={onClose}>
      <div className="settings-box" onClick={(e) => e.stopPropagation()}>

        <h2>Settings</h2>

        <div className="scroll-content">

          <div className="thumbnails-title">
            {images.length === 0 ? "No photos" : `Gallery (${images.length} photos)`}
          </div>

          <div className="thumb-grid">
            {images.map((src, index) => (
              <div key={index} className="thumb-item" onClick={() => {
                if (confirm('Remove this photo?')) removePhoto(index);
              }}>
                <img src={src} alt={`Photo ${index}`} />
              </div>
            ))}
          </div>

          <button className="btn btn-orange" onClick={() => fileInputRef.current.click()}>
            + Add Photos
          </button>
          <input type="file" multiple accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileAdd} />

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

          <div className="setting-group">
            <div className="setting-column">
              <label style={{ color: '#0a84ff', marginBottom: '15px' }}>Preview</label>
              <div>
                <label>Photo Mode</label>
                <select value={config.fitMode} onChange={(e) => handleChange('fitMode', e.target.value)}>
                  <option value="cover">Fill Screen</option>
                  <option value="contain">Show Full Photo</option>
                </select>
              </div>
              <div>
                <label>Time (seconds)</label>
                <input type="number" min="3" value={config.time} onChange={(e) => handleChange('time', e.target.value)} />
              </div>
              <div>
                <label>Effect</label>
                <select value={config.effect} onChange={(e) => handleChange('effect', e.target.value)}>
                  <option value="fade">Smooth (Fade)</option>
                  <option value="zoom">Slow Zoom</option>
                  <option value="none">None</option>
                </select>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '20px 0' }} />
            </div>
            <div className="setting-column">
              <label style={{ color: '#0a84ff', marginBottom: '15px' }}>Clock and Text</label>
              <div>
                <label>Show Info</label>
                <select value={config.showInfo} onChange={(e) => handleChange('showInfo', e.target.value)}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {config.showInfo === 'yes' && (
                <>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label>Colour</label>
                      <input type="color" value={config.infoColor} onChange={(e) => handleChange('infoColor', e.target.value)} style={{ padding: '5px', height: '45px' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label>Shadow</label>
                      <select value={config.infoShadow} onChange={(e) => handleChange('infoShadow', e.target.value)}>
                        <option value="normal">Soft</option>
                        <option value="strong">Strong</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label>Background</label>
                    <select value={config.infoBg} onChange={(e) => handleChange('infoBg', e.target.value)}>
                      <option value="glass">Glass</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          <button className="btn btn-green" onClick={onClose}>
            Save and Return
          </button>

          <button className="btn btn-red" onClick={handleReset}>
            Clear Cache and Reset App
          </button>

        </div>
      </div>
    </div>
  );
};

export default SettingsModal;