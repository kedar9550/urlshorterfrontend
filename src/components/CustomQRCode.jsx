import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import logo from '../assets/Circle_logo.svg';

export default function CustomQRCode({ 
  data, 
  size = 300, 
  colorType = 'solid', // 'bw', 'solid', 'gradient'
  solidColor = '#000000',
  gradientColors = ['#BE9337', '#0D233B'],
  resolution = null,
  onInit
}) {
  const ref = useRef(null);

  useEffect(() => {
    let dotsOptions = { 
      type: 'rounded',
      color: '#000000'
    };
    
    if (colorType === 'solid') {
      dotsOptions.color = solidColor;
    } else if (colorType === 'gradient') {
      dotsOptions.color = undefined;
      dotsOptions.gradient = {
        type: 'linear',
        rotation: Math.PI / 4,
        colorStops: [
          { offset: 0, color: gradientColors[0] },
          { offset: 1, color: gradientColors[1] }
        ]
      };
    }

    const qrCode = new QRCodeStyling({
      width: resolution || size,
      height: resolution || size,
      data: data,
      image: logo,
      dotsOptions: dotsOptions,
      cornersSquareOptions: {
        type: 'extra-rounded',
        color: colorType === 'bw' ? '#000000' : (colorType === 'solid' ? solidColor : gradientColors[0])
      },
      cornersDotOptions: {
        type: 'dot',
        color: colorType === 'bw' ? '#000000' : (colorType === 'solid' ? solidColor : gradientColors[1] || gradientColors[0])
      },
      backgroundOptions: { color: "#ffffff" },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5
      }
    });

    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
      
      const canvas = ref.current.firstChild;
      if (canvas) {
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
      }
    }
    
    if (onInit) {
      onInit(qrCode);
    }
  }, [data, size, colorType, solidColor, gradientColors, resolution, onInit]);

  return <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }} />;
}
