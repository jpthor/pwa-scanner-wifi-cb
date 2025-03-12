import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import OcrResult from '../components/OcrResult';
import LoadingOverlay from '../components/LoadingOverlay';
import { useImageContext } from '../context/ImageContext';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { imageData } = useImageContext();

  // Redirect to home if no image data is available
  React.useEffect(() => {
    if (!imageData) {
      navigate('/');
    }
  }, [imageData, navigate]);

  return (
    <div className="max-w-md mx-auto">
      <LoadingOverlay />
      
      <button 
        onClick={() => navigate('/')}
        className="back-button"
      >
        <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        <span>Back to camera</span>
      </button>
      
      <OcrResult />
    </div>
  );
};

export default ResultPage;
