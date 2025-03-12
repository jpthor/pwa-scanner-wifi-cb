import React from 'react';
import { useImageContext } from '../context/ImageContext';

const LoadingOverlay: React.FC = () => {
  try {
    const { isLoading } = useImageContext();

    if (!isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Processing image...</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in LoadingOverlay:", error);
    return null;
  }
};

export default LoadingOverlay;
