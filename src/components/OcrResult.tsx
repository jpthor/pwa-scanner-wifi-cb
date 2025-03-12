import React, { useState, useEffect, useRef } from 'react';
import { Copy, Wifi, ExternalLink, Download, Save } from 'lucide-react';
import { useImageContext } from '../context/ImageContext';
import QRCode from 'react-qr-code';
import * as qrcode from 'qrcode';

const OcrResult: React.FC = () => {
  const [joinStatus, setJoinStatus] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [editedCredentials, setEditedCredentials] = useState<{
    ssid: string;
    password: string;
  }>({
    ssid: '',
    password: ''
  });
  
  const { imageData, ocrText, wifiCredentials } = useImageContext();

  // Initialize edited credentials when wifiCredentials change
  useEffect(() => {
    if (wifiCredentials) {
      setEditedCredentials({
        ssid: wifiCredentials.ssid || '',
        password: wifiCredentials.password || ''
      });
    }
  }, [wifiCredentials]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const joinWifiNetwork = () => {
    if (!editedCredentials.ssid) {
      setJoinStatus('No network name found');
      return;
    }
    
    // Create a WiFi URL scheme
    const ssid = encodeURIComponent(editedCredentials.ssid);
    const password = editedCredentials.password ? encodeURIComponent(editedCredentials.password) : '';
    
    // Create URL for different platforms
    // iOS/MacOS format
    const iosUrl = `wifi:ssid=${ssid};password=${password};`;
    
    try {
      // Try to open the URL
      window.location.href = iosUrl;
      setJoinStatus('Attempting to join network...');
      
      // Fallback for browsers that don't support the wifi scheme
      setTimeout(() => {
        setJoinStatus('If connection didn\'t start automatically, you may need to join manually');
      }, 3000);
    } catch (error) {
      console.error('Error joining WiFi:', error);
      setJoinStatus('Failed to join network automatically. Please join manually.');
    }
  };

  const generateQrCode = async () => {
    if (!editedCredentials.ssid) {
      alert('Network name is required to generate a QR code');
      return;
    }

    // Create WiFi QR code content in standard format
    // Format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
    const qrContent = `WIFI:S:${editedCredentials.ssid};T:WPA;P:${editedCredentials.password || ''};;`;
    
    try {
      // Generate QR code as data URL
      const dataUrl = await qrcode.toDataURL(qrContent, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(dataUrl);
      setShowQrCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const downloadQrCode = () => {
    if (!qrCodeUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `wifi-${editedCredentials.ssid || 'network'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeQrCode = () => {
    setShowQrCode(false);
    setQrCodeUrl(null);
  };

  const handleSave = () => {
    setIsEditing(false);
    setJoinStatus(null);
  };

  if (!imageData || !ocrText) {
    return <div className="text-center p-4">No image processed</div>;
  }

  return (
    <div className="card p-6">
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-2 gradient-text">Extracted Text</h2>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto text-gray-800">
            {ocrText || 'No text detected'}
          </pre>
          {ocrText && (
            <button
              onClick={() => copyToClipboard(ocrText)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2 gradient-text">WiFi Credentials</h2>
        
        <div className="wifi-credentials bg-gray-50 p-4 rounded-lg">
          <h3 className="flex items-center text-lg font-medium mb-4 text-gray-800">
            <Wifi className="w-5 h-5 mr-2 text-pink-500" strokeWidth={1.5} />
            WiFi Details
          </h3>
          
          <div className="mb-4">
            <label htmlFor="network-name" className="block text-sm font-medium text-gray-700 mb-1">
              Network
            </label>
            <input
              id="network-name"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              value={editedCredentials.ssid}
              onChange={(e) => setEditedCredentials({...editedCredentials, ssid: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="network-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="network-password"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              value={editedCredentials.password}
              onChange={(e) => setEditedCredentials({...editedCredentials, password: e.target.value})}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition"
              >
                <Save className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Save
              </button>
            ) : (
              <>
                <button
                  onClick={joinWifiNetwork}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition"
                >
                  <ExternalLink className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Join Network
                </button>
                
                <button
                  onClick={generateQrCode}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  Export QR
                </button>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-2 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          
          {joinStatus && (
            <p className="mt-3 text-sm text-pink-600">{joinStatus}</p>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrCode && qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-medium mb-4 text-center">WiFi QR Code</h3>
            
            <div className="flex justify-center mb-4" ref={qrCodeRef}>
              <img src={qrCodeUrl} alt="WiFi QR Code" className="w-64 h-64" />
            </div>
            
            <p className="text-sm text-center mb-4 text-gray-600">
              Scan this QR code to connect to "{editedCredentials.ssid}"
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={downloadQrCode}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" strokeWidth={1.5} />
                Save to Photos
              </button>
              
              <button
                onClick={closeQrCode}
                className="flex-1 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OcrResult;
