import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    // Mocking API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        damageType: 'Pothole',
        confidence: 94.2,
        severity: 'High',
      });
    }, 2000);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Analyze Image</h1>
      
      {!result ? (
        <div className="mac-card p-8">
          <div 
            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-mac-blue bg-mac-blue/5' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <div className="mt-6 flex gap-3">
                  <button onClick={clearFile} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                  <button onClick={handleAnalyze} className="mac-button flex items-center gap-2" disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing...
                      </span>
                    ) : 'Analyze Image'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-mac-bg rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8 text-mac-gray" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Upload road image</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6 text-center">Drag and drop your image here, or click to browse files.</p>
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="mac-button cursor-pointer">
                  Browse Files
                </label>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Analysis Complete</h2>
            <button onClick={clearFile} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mac-card p-4 h-80 flex items-center justify-center bg-gray-100">
              {/* Mock Image Display */}
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
                 <img src={URL.createObjectURL(file)} alt="Uploaded road" className="w-full h-full object-cover" />
                 {/* Mock Bounding Box */}
                 <div className="absolute top-[30%] left-[20%] w-[40%] h-[30%] border-2 border-red-500 bg-red-500/20 rounded">
                    <span className="absolute -top-6 left-[-2px] bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-t">Pothole 94%</span>
                 </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="mac-card p-5 border-l-4 border-red-500 flex items-start gap-4">
                 <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                 <div>
                    <h3 className="font-medium text-gray-900">Critical Damage Found</h3>
                    <p className="text-sm text-gray-600 mt-1">The system detected a severe pothole requiring immediate attention.</p>
                 </div>
              </div>
              
              <div className="mac-card p-6 divide-y divide-gray-100">
                 <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Damage Type</span>
                    <span className="text-sm font-medium text-gray-900">{result.damageType}</span>
                 </div>
                 <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Confidence</span>
                    <span className="text-sm font-medium text-gray-900">{result.confidence}%</span>
                 </div>
                 <div className="py-3 flex justify-between">
                    <span className="text-sm text-gray-500">Severity Level</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{result.severity}</span>
                 </div>
              </div>
              
              <button className="w-full mac-button flex items-center justify-center gap-2">
                 Save to Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
