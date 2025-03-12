import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

const CameraComponent: React.FC = () => {
  const { setImageData } = useImageContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      setImageData(imageData); // Just set the image data, don't process yet
      stopCamera();
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        id="camera-input" 
        className="hidden" 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result as string;
              if (result) {
                setImageData(result); // Just set the image data, don't process yet
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      
      {showCamera ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
            <button 
              onClick={captureImage}
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full border-2 border-gray-300"></div>
            </button>
            
            <button 
              onClick={stopCamera}
              className="absolute right-4 top-4 bg-black/50 text-white p-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CameraComponent;
