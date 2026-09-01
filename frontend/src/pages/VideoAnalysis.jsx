import React, { useState } from 'react';
import { Camera, Link, Upload, Video } from 'lucide-react';

export default function VideoAnalysis() {
  const [activeTab, setActiveTab] = useState('camera');
  const [url, setUrl] = useState('');
  const [streamSource, setStreamSource] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = React.useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('Uploading video...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/video/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadStatus('');
      setStreamSource(`http://localhost:8000/video/stream_file?filename=${encodeURIComponent(data.filename)}`);
    } catch (error) {
      console.error(error);
      setUploadStatus('Error uploading video.');
    }
  };

  const startCamera = () => {
    setStreamSource('http://localhost:8000/video/stream_camera');
  };

  const startUrlStream = () => {
    if (url) {
      setStreamSource(`http://localhost:8000/video/stream_url?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Live Video & Camera Analysis</h2>
      <p className="text-gray-600 mb-8">
        Detect road damage in real-time using live feeds, camera streams, or uploaded videos. The AI model will process frames to highlight damages instantly.
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button 
          onClick={() => { setActiveTab('camera'); setStreamSource(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'camera' ? 'bg-mac-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Camera className="w-4 h-4" /> Live Camera
        </button>
        <button 
          onClick={() => { setActiveTab('url'); setStreamSource(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'url' ? 'bg-mac-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Link className="w-4 h-4" /> Web Stream URL
        </button>
        <button 
          onClick={() => { setActiveTab('upload'); setStreamSource(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'upload' ? 'bg-mac-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Upload className="w-4 h-4" /> Upload MP4
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[400px]">
        
        {/* Camera Tab */}
        {activeTab === 'camera' && (
          <div className="text-center w-full">
            {!streamSource ? (
              <button onClick={startCamera} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 mx-auto">
                <Video className="w-5 h-5" /> Turn On Camera & Detect
              </button>
            ) : (
              <div className="rounded-lg overflow-hidden border-2 border-gray-300 w-full max-w-3xl mx-auto shadow-md bg-black">
                <img src={streamSource} alt="Live Camera Feed" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="w-full max-w-2xl text-center">
            {!streamSource ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter video URL (e.g. RTSP or HTTP stream)" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-mac-blue"
                />
                <button onClick={startUrlStream} className="bg-mac-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Analyze URL
                </button>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border-2 border-gray-300 w-full shadow-md bg-black mt-4">
                <img src={streamSource} alt="Live URL Feed" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="w-full text-center">
            {!streamSource ? (
              <div className="text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Select a video file to process it through the AI model.</p>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Browse Files
                </button>
                {uploadStatus && (
                  <div className="mt-6 p-4 rounded-lg bg-blue-50 text-blue-800 font-medium border border-blue-200 inline-block">
                    {uploadStatus}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border-2 border-gray-300 w-full max-w-3xl mx-auto shadow-md bg-black">
                <img src={streamSource} alt="Processed Video Stream" className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
