import React, { useState } from 'react';
import { Ruler, AlertCircle, CheckCircle } from 'lucide-react';
import { useCalibration } from '../contexts/CalibrationContext';

const MeasurementDisplay = () => {
  const { activeCalibration, isCalibrationActive, convertPixelsToUnits } = useCalibration();
  const [pixelInput, setPixelInput] = useState('');
  const [convertedValue, setConvertedValue] = useState(null);

  const handlePixelInput = (e) => {
    const pixels = parseFloat(e.target.value);
    setPixelInput(e.target.value);
    
    if (pixels && isCalibrationActive()) {
      const xValue = convertPixelsToUnits(pixels, 'x');
      const yValue = convertPixelsToUnits(pixels, 'y');
      setConvertedValue({ x: xValue, y: yValue });
    } else {
      setConvertedValue(null);
    }
  };

  if (!isCalibrationActive()) {
    return (
      <div className="card bg-warning-50 border-warning-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-warning-500" />
          <div>
            <h3 className="font-semibold text-warning-800">No Active Calibration</h3>
            <p className="text-sm text-warning-600">
              Please set an active calibration in the Calibration page to enable measurements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-success-50 border-success-200">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="h-6 w-6 text-success-500" />
        <div>
          <h3 className="font-semibold text-success-800">Active Calibration: {activeCalibration.magnification}</h3>
          <p className="text-sm text-success-600">
            Ready for precise measurements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-success-700">X-axis Ratio:</span>
          <p className="text-lg font-bold text-success-800">{activeCalibration.xAxis} {activeCalibration.unit}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-success-700">Y-axis Ratio:</span>
          <p className="text-lg font-bold text-success-800">{activeCalibration.yAxis} {activeCalibration.unit}</p>
        </div>
      </div>

      <div className="border-t border-success-200 pt-4">
        <h4 className="font-medium text-success-800 mb-3">Quick Measurement Converter</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-success-700 mb-1">
              Pixels
            </label>
            <input
              type="number"
              value={pixelInput}
              onChange={handlePixelInput}
              placeholder="Enter pixel value"
              className="w-full px-3 py-2 border border-success-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-success-700 mb-1">
              Converted Value
            </label>
            <div className="px-3 py-2 bg-white border border-success-300 rounded-lg">
              {convertedValue ? (
                <div className="text-sm">
                  <div>X: {convertedValue.x.toFixed(4)} {activeCalibration.unit}</div>
                  <div>Y: {convertedValue.y.toFixed(4)} {activeCalibration.unit}</div>
                </div>
              ) : (
                <span className="text-secondary-400">Enter pixels to convert</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementDisplay;
