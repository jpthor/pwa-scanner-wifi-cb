import React from 'react';
import { Camera, Image } from 'lucide-react';
import CameraComponent from '../components/Camera';
import ImagePreview from '../components/ImagePreview';
import LoadingOverlay from '../components/LoadingOverlay';
import { useImageContext } from '../context/ImageContext';

const HomePage: React.FC = () => {
  // Wrap the context usage in a try-catch to provide better error handling
  try {
    const { imageData, handleFileUpload, isLoading } = useImageContext();

    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <LoadingOverlay />
        
        {!imageData ? (
          <div className="card p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light mb-2 gradient-text">WiFi Scanner</h2>
              <p className="text-gray-600 text-sm">Capture an image with WiFi details</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <button 
                className="icon-button" 
                onClick={() => document.getElementById('camera-input')?.click()}
                disabled={isLoading}
              >
                <svg width="0" height="0" className="absolute">
                  <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </svg>
                <Camera className="gradient-icon" strokeWidth={1.5} />
                <span className="gradient-text">Camera</span>
              </button>
              
              <label 
                htmlFor="file-input" 
                className={`icon-button cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Image className="gradient-icon" strokeWidth={1.5} />
                <span className="gradient-text">Gallery</span>
                <input 
                  id="file-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        ) : (
          <ImagePreview />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
    // Fallback UI when context is not available
    return (
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light mb-2 text-red-500">Error Loading App</h2>
            <p className="text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      </div>
    );
  }
};

export default HomePage;
