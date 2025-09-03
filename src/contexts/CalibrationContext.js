import React, { createContext, useContext, useState } from 'react';

const CalibrationContext = createContext();

export const useCalibration = () => {
  const context = useContext(CalibrationContext);
  if (!context) {
    throw new Error('useCalibration must be used within a CalibrationProvider');
  }
  return context;
};

export const CalibrationProvider = ({ children }) => {
  const [activeCalibration, setActiveCalibration] = useState(null);
  const [calibrations, setCalibrations] = useState([
    {
      id: 1,
      magnification: '100X',
      xAxis: 0.5,
      yAxis: 0.5,
      unit: 'µm/pixel',
      date: '2024-01-15',
      isActive: false
    },
    {
      id: 2,
      magnification: '200X',
      xAxis: 0.25,
      yAxis: 0.25,
      unit: 'µm/pixel',
      date: '2024-01-14',
      isActive: false
    }
  ]);

  const setActiveCalibrationById = (id) => {
    const updatedCalibrations = calibrations.map(cal => ({
      ...cal,
      isActive: cal.id === id
    }));
    setCalibrations(updatedCalibrations);
    
    const activeCal = updatedCalibrations.find(cal => cal.id === id);
    setActiveCalibration(activeCal);
  };

  const addCalibration = (calibration) => {
    const newCalibration = {
      ...calibration,
      id: Date.now(),
      isActive: false
    };
    setCalibrations(prev => [newCalibration, ...prev.slice(0, 1)]);
  };

  const deleteCalibration = (id) => {
    const updatedCalibrations = calibrations.filter(cal => cal.id !== id);
    setCalibrations(updatedCalibrations);
    
    // If the deleted calibration was active, clear active calibration
    if (activeCalibration && activeCalibration.id === id) {
      setActiveCalibration(null);
    }
  };

  const getActiveCalibration = () => activeCalibration;

  const isCalibrationActive = () => !!activeCalibration;

  const getCalibrationRatio = () => {
    if (activeCalibration) {
      return {
        x: activeCalibration.xAxis,
        y: activeCalibration.yAxis,
        unit: activeCalibration.unit
      };
    }
    return null;
  };

  const convertPixelsToUnits = (pixels, axis = 'x') => {
    if (activeCalibration) {
      const ratio = axis === 'x' ? activeCalibration.xAxis : activeCalibration.yAxis;
      return pixels * ratio;
    }
    return null;
  };

  const convertUnitsToPixels = (units, axis = 'x') => {
    if (activeCalibration) {
      const ratio = axis === 'x' ? activeCalibration.xAxis : activeCalibration.yAxis;
      return units / ratio;
    }
    return null;
  };

  const value = {
    activeCalibration,
    calibrations,
    setActiveCalibrationById,
    addCalibration,
    deleteCalibration,
    getActiveCalibration,
    isCalibrationActive,
    getCalibrationRatio,
    convertPixelsToUnits,
    convertUnitsToPixels
  };

  return (
    <CalibrationContext.Provider value={value}>
      {children}
    </CalibrationContext.Provider>
  );
};
