import React, { useState, useEffect } from 'react';
import { 
  Ruler, 
  Upload, 
  Target, 
  CheckCircle, 
  Trash2, 
  Save,
  ZoomIn,
  MousePointer,
  ArrowRight,
  X,
  Play
} from 'lucide-react';
import { useCalibration } from '../contexts/CalibrationContext';

const Calibration = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const { 
    calibrations, 
    setActiveCalibrationById, 
    addCalibration, 
    deleteCalibration: deleteCalibrationFromContext
  } = useCalibration();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [magnification, setMagnification] = useState('');
  const [unit, setUnit] = useState('µm');
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [pixelDistance, setPixelDistance] = useState(0);
  const [realLength, setRealLength] = useState('');
  const [calibrationRatio, setCalibrationRatio] = useState(0);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    setUploadedImages([...uploadedImages, ...newImages]);
  };

  const calculatePixelDistance = () => {
    if (startPoint && endPoint) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      setPixelDistance(Math.round(distance));
    }
  };

  const calculateCalibrationRatio = () => {
    if (pixelDistance > 0 && realLength > 0) {
      const ratio = parseFloat(realLength) / pixelDistance;
      setCalibrationRatio(ratio);
    }
  };

  const handleSaveCalibration = () => {
    if (calibrationRatio > 0) {
      const newCalibration = {
        magnification: magnification + 'X',
        xAxis: calibrationRatio,
        yAxis: calibrationRatio,
        unit: unit + '/pixel',
        date: new Date().toISOString().split('T')[0]
      };
      addCalibration(newCalibration);
      setActiveTab('existing');
      resetWizard();
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setUploadedImages([]);
    setSelectedImage(null);
    setMagnification('');
    setUnit('µm');
    setStartPoint(null);
    setEndPoint(null);
    setPixelDistance(0);
    setRealLength('');
    setCalibrationRatio(0);
  };

  const deleteCalibration = (id) => {
    deleteCalibrationFromContext(id);
  };

  const activateCalibration = (id) => {
    setActiveCalibrationById(id);
  };



  useEffect(() => {
    calculatePixelDistance();
  }, [startPoint, endPoint]);

  useEffect(() => {
    calculateCalibrationRatio();
  }, [pixelDistance, realLength]);

  const renderExistingCalibrations = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary-900">Existing Calibrations</h2>
        <button
          onClick={() => setActiveTab('new')}
          className="btn-primary flex items-center gap-2"
        >
          <Ruler className="h-5 w-5" />
          New Calibration
        </button>
      </div>

             {/* Active Calibration Summary */}
       {calibrations.find(cal => cal.isActive) && (
         <div className="card mb-6 bg-success-50 border-success-200">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
               <h3 className="text-lg font-semibold text-success-800">Active Calibration</h3>
             </div>
             <span className="text-sm text-success-600 font-medium">
               Ready for measurements
             </span>
           </div>
           <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4">
             {(() => {
               const activeCal = calibrations.find(cal => cal.isActive);
               return (
                 <>
                   <div>
                     <span className="text-sm text-success-700 font-medium">Magnification:</span>
                     <p className="text-lg font-bold text-success-800">{activeCal.magnification}</p>
                   </div>
                   <div>
                     <span className="text-sm text-success-700 font-medium">X-axis:</span>
                     <p className="text-lg font-bold text-success-800">{activeCal.xAxis} {activeCal.unit}</p>
                   </div>
                   <div>
                     <span className="text-sm text-success-700 font-medium">Y-axis:</span>
                     <p className="text-lg font-bold text-success-800">{activeCal.yAxis} {activeCal.unit}</p>
                   </div>
                   <div>
                     <span className="text-sm text-success-700 font-medium">Date:</span>
                     <p className="text-lg font-bold text-success-800">{activeCal.date}</p>
                   </div>
                 </>
               );
             })()}
           </div>
         </div>
       )}

       <div className="card">
         <div className="overflow-x-auto">
          <table className="w-full">
                         <thead>
               <tr className="border-b border-secondary-200">
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Status</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Magnification</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">X-axis</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Y-axis</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Unit</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Date</th>
                 <th className="text-left py-3 px-4 font-semibold text-secondary-700">Actions</th>
               </tr>
             </thead>
            <tbody>
                             {calibrations.map((cal) => (
                 <tr key={cal.id} className={`border-b border-secondary-100 hover:bg-secondary-50 ${
                   cal.isActive ? 'bg-success-50 border-success-200' : ''
                 }`}>
                   <td className="py-3 px-4">
                     <div className="flex items-center gap-2">
                       {cal.isActive ? (
                         <div className="flex items-center gap-2">
                           <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                           <span className="text-sm font-medium text-success-600">Active</span>
                         </div>
                       ) : (
                         <span className="text-sm text-secondary-500">Inactive</span>
                       )}
                     </div>
                   </td>
                   <td className="py-3 px-4 text-secondary-900 font-medium">{cal.magnification}</td>
                   <td className="py-3 px-4 text-secondary-700">{cal.xAxis}</td>
                   <td className="py-3 px-4 text-secondary-700">{cal.yAxis}</td>
                   <td className="py-3 px-4 text-secondary-700">{cal.unit}</td>
                   <td className="py-3 px-4 text-secondary-700">{cal.date}</td>
                                     <td className="py-3 px-4">
                     <div className="flex gap-2">
                                               <button
                          onClick={() => activateCalibration(cal.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            cal.isActive 
                              ? 'bg-success-100 text-success-600 border border-success-300' 
                              : 'text-success-500 hover:bg-success-50'
                          }`}
                          title={cal.isActive ? 'Currently Active' : 'Use This Calibration'}
                        >
                          <Play className="h-4 w-4" />
                        </button>
                       <button
                         onClick={() => deleteCalibration(cal.id)}
                         className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                         title="Delete"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                       <button
                         className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                         title="Save"
                       >
                         <Save className="h-4 w-4" />
                       </button>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNewCalibrationWizard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary-900">New Calibration Wizard</h2>
        <button
          onClick={() => setActiveTab('existing')}
          className="btn-secondary flex items-center gap-2"
        >
          <X className="h-5 w-5" />
          Cancel
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step 
                ? 'bg-primary-500 text-white' 
                : 'bg-secondary-200 text-secondary-600'
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-primary-500' : 'bg-secondary-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Image Upload */}
      {currentStep === 1 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Step 1: Upload Scale Images</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-600 mb-2">Upload scale images for different magnifications</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="btn-primary cursor-pointer">
                  Select Images
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-secondary-700">Uploaded Images</h4>
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedImage?.id === image.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover rounded"
                  />
                  <p className="text-sm text-secondary-600 mt-2 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={uploadedImages.length === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Magnification Selection */}
      {currentStep === 2 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Step 2: Set Magnification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Magnification Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={magnification}
                  onChange={(e) => setMagnification(e.target.value)}
                  placeholder="100"
                  className="input-field pr-12"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 font-medium">
                  X
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="input-field"
              >
                <option value="µm">Microns (µm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="in">Inches (in)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!magnification}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Point Selection */}
      {currentStep === 3 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Step 3: Select Calibration Points</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="border border-secondary-300 rounded-lg p-4 bg-secondary-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-secondary-700">Image Viewer</h4>
                  <div className="flex gap-2">
                    <button className="tool-button" title="Zoom">
                      <ZoomIn className="h-4 w-4" />
                    </button>
                    <button className="tool-button" title="Point Selection">
                      <MousePointer className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage.url}
                      alt="Calibration"
                      className="w-full h-96 object-contain cursor-crosshair"
                      onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        if (!startPoint) {
                          setStartPoint({ x, y });
                        } else if (!endPoint) {
                          setEndPoint({ x, y });
                        }
                      }}
                    />
                    {startPoint && (
                      <div
                        className="absolute w-4 h-4 bg-primary-500 rounded-full border-2 border-white"
                        style={{
                          left: startPoint.x - 8,
                          top: startPoint.y - 8
                        }}
                      />
                    )}
                    {endPoint && (
                      <div
                        className="absolute w-4 h-4 bg-error-500 rounded-full border-2 border-white"
                        style={{
                          left: endPoint.x - 8,
                          top: endPoint.y - 8
                        }}
                      />
                    )}
                    {startPoint && endPoint && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <line
                          x1={startPoint.x}
                          y1={startPoint.y}
                          x2={endPoint.x}
                          y2={endPoint.y}
                          stroke="#6a1b9a"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center text-secondary-500">
                    Please select an image from the right panel
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-secondary-50 rounded-lg">
                <h4 className="font-medium text-secondary-700 mb-3">Point Selection</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      {startPoint ? `Start: (${Math.round(startPoint.x)}, ${Math.round(startPoint.y)})` : 'Click to set start point'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                    <span className="text-sm text-secondary-600">
                      {endPoint ? `End: (${Math.round(endPoint.x)}, ${Math.round(endPoint.y)})` : 'Click to set end point'}
                    </span>
                  </div>
                </div>
                {pixelDistance > 0 && (
                  <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-700">
                      <strong>Pixel Distance:</strong> {pixelDistance} pixels
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              disabled={!startPoint || !endPoint}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Real Length Input */}
      {currentStep === 4 && (
        <div className="card">
          <h3 className="text-xl font-semibold text-secondary-900 mb-4">Step 4: Enter Real Length</h3>
          <div className="max-w-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Actual Length Between Points
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={realLength}
                  onChange={(e) => setRealLength(e.target.value)}
                  placeholder="400"
                  className="input-field pr-16"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 font-medium">
                  {unit}
                </span>
              </div>
            </div>

            {calibrationRatio > 0 && (
              <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success-500" />
                  <span className="font-medium text-success-700">Calibration Complete!</span>
                </div>
                <p className="text-sm text-success-600">
                  <strong>Calibration Ratio:</strong> {calibrationRatio.toFixed(4)} {unit}/pixel
                </p>
                <p className="text-sm text-success-600">
                  <strong>Magnification:</strong> {magnification}X
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="btn-secondary"
              >
                Previous
              </button>
              <button
                onClick={handleSaveCalibration}
                disabled={calibrationRatio <= 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Ruler className="h-8 w-8 text-primary-500" />
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Calibration</h1>
          <p className="text-secondary-600">Manage microscope calibration settings and create new calibrations</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('existing')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'existing'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            Existing Calibrations
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'new'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            }`}
          >
            New Calibration
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'existing' ? renderExistingCalibrations() : renderNewCalibrationWizard()}
    </div>
  );
};

export default Calibration;
