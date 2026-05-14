import React, { useRef, useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import CustomSelect from './CustomSelect';

const EFFECT_OPTIONS = [
  { value: 'fade', label: 'Fade' },
  { value: 'zoom', label: 'Slow Zoom' },
  { value: 'none', label: 'None' },
];
const FIT_OPTIONS = [
  { value: 'cover', label: 'Fill Screen' },
  { value: 'contain', label: 'Show Full Photo' },
];
const CLOCK_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const PRESET_COLORS = ['#6366f1', '#0a84ff', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const SettingsModal = ({ onClose }) => {
  const { config, setConfig, images, addPhotos, removePhoto, resetApp } = useAppContext();
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 350);
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all photos and settings.')) {
      resetApp();
    }
  };

  return (
    <div className="sheet-backdrop" onClick={handleClose}>
      <div className={`settings-sheet${isOpen ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-content">
          <div className="sheet-col">
            <div className="sheet-label">
              {images.length === 0 ? 'No photos' : `Gallery · ${images.length} photos`}
            </div>
            <div className="thumb-grid">
              {images.map((img, i) => (
                <div key={i} className="thumb-item" onClick={() => {
                  if (confirm('Remove this photo?')) removePhoto(i);
                }}>
                  <img src={img.url} alt="" />
                </div>
              ))}
              <div className="thumb-add" onClick={() => fileInputRef.current.click()}>+</div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => addPhotos(e.target.files)}
            />
          </div>

          <div className="sheet-col">
            <div className="sheet-label">Display</div>

            <div className="sheet-row-2">
              <div className="field-group">
                <label className="field-label">Effect</label>
                <CustomSelect value={config.effect} onChange={(v) => handleChange('effect', v)} options={EFFECT_OPTIONS} />
              </div>
              <div className="field-group">
                <label className="field-label">Interval</label>
                <input type="number" min="3" value={config.time} onChange={(e) => handleChange('time', Number(e.target.value))} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Photo Mode</label>
              <CustomSelect value={config.fitMode} onChange={(v) => handleChange('fitMode', v)} options={FIT_OPTIONS} />
            </div>

            <div className="field-group">
              <label className="field-label">Show Clock</label>
              <CustomSelect value={config.showInfo} onChange={(v) => handleChange('showInfo', v)} options={CLOCK_OPTIONS} />
            </div>

            <div className="field-group">
              <label className="field-label">Accent Color</label>
              <div className="color-swatches">
                {PRESET_COLORS.map(color => (
                  <div
                    key={color}
                    className={`color-swatch${config.accentColor === color ? ' active' : ''}`}
                    style={{ background: color }}
                    onClick={() => handleChange('accentColor', color)}
                  />
                ))}
                <div
                  className="color-swatch color-swatch-custom"
                  onClick={() => colorInputRef.current.click()}
                />
                <input
                  type="color"
                  ref={colorInputRef}
                  style={{ display: 'none' }}
                  value={config.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sheet-footer">
          <button className="btn btn-accent" onClick={handleClose}>Save and Return</button>
          <button className="btn btn-danger" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
