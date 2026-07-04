import React, { useState, useRef } from 'react';
import { X, Download } from 'lucide-react';
import CustomQRCode from './CustomQRCode';

export default function QRDownloadModal({ isOpen, onClose, url, shortCode }) {
  const [colorType, setColorType] = useState('bw');
  const [solidColor, setSolidColor] = useState('#000000');
  const [gradientStart, setGradientStart] = useState('#BE9337');
  const [gradientEnd, setGradientEnd] = useState('#0D233B');
  
  const qrCodeRef = useRef(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.download({ name: `qrcode-${shortCode}`, extension: "png" });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '400px', width: '90%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Customize QR Code</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem', background: '#fff', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
          <CustomQRCode 
            data={url}
            size={250}
            resolution={1000}
            colorType={colorType}
            solidColor={solidColor}
            gradientColors={[gradientStart, gradientEnd]}
            onInit={(qr) => qrCodeRef.current = qr}
          />
        </div>

        <div className="form-group">
          <label>Color Style</label>
          <select 
            className="input" 
            value={colorType} 
            onChange={(e) => setColorType(e.target.value)}
          >
            <option value="bw">Black & White</option>
            <option value="solid">Solid Color</option>
            <option value="gradient">Gradient (Combination)</option>
          </select>
        </div>

        {colorType === 'solid' && (
          <div className="form-group">
            <label>Choose Color</label>
            <input 
              type="color" 
              className="input" 
              style={{ padding: '0.2rem', height: '40px' }}
              value={solidColor} 
              onChange={(e) => setSolidColor(e.target.value)}
            />
          </div>
        )}

        {colorType === 'gradient' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Color 1</label>
              <input 
                type="color" 
                className="input" 
                style={{ padding: '0.2rem', height: '40px' }}
                value={gradientStart} 
                onChange={(e) => setGradientStart(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Color 2</label>
              <input 
                type="color" 
                className="input" 
                style={{ padding: '0.2rem', height: '40px' }}
                value={gradientEnd} 
                onChange={(e) => setGradientEnd(e.target.value)}
              />
            </div>
          </div>
        )}

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          onClick={handleDownload}
        >
          <Download size={18} style={{ marginRight: '0.5rem' }} /> Download QR Code
        </button>
      </div>
    </div>
  );
}
