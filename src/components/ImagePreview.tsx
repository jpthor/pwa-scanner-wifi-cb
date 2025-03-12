import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';

const ImagePreview: React.FC = () => {
  const navigate = useNavigate();
  
  try {
    const { imageData, setImageData, processImage, isLoading } = useImageContext();

    const handleCancel = () => {
      setImageData(null);
    };

    const handleProcess = async () => {
      if (!imageData) return;
      
      try {
        // We'll use the processImage function from context which already handles loading state
        await processImage(imageData);
      } catch (error) {
        console.error('OCR processing error:', error);
        alert('Failed to process the image. Please try again.');
      }
    };

    if (!imageData) return null;

    return (
      <div className="card p-6 mt-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-medium mb-4 gradient-text">Review Image</h2>
        
        <div className="mb-4">
          <img 
            src={imageData} 
            alt="Preview" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleProcess}
            className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition flex items-center"
            disabled={isLoading}
          >
            <span>Extract Text</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ImagePreview:", error);
    return (
      <div className="card p-6 mt-6 w-full max-w-md mx-auto">
        <h2 className="text-xl font-medium mb-4 text-red-500">Error</h2>
        <p>There was an error loading the image preview. Please go back and try again.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }
};

export default ImagePreview;
