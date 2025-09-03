import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Camera, 
  Save,
  RotateCcw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Load saved configurations on component mount
  React.useEffect(() => {
    const savedSystemConfig = localStorage.getItem('envision-system-config');
    const savedCameraConfig = localStorage.getItem('envision-camera-config');
    const isActivated = localStorage.getItem('envision-activated');
    
    if (savedSystemConfig) {
      try {
        setSystemConfig(JSON.parse(savedSystemConfig));
      } catch (error) {
        console.error('Error loading system config:', error);
      }
    }
    
    if (savedCameraConfig) {
      try {
        setCameraConfig(JSON.parse(savedCameraConfig));
      } catch (error) {
        console.error('Error loading camera config:', error);
      }
    }

    if (isActivated) {
      setIsActivated(true);
    }
  }, []);
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      theme: 'light',
      autoSave: true,
      notifications: true
    },
    camera: {
      defaultResolution: '1920x1080',
      frameRate: 30,
      autoExposure: true,
      autoGain: true,
      whiteBalance: 'auto'
    },
    analysis: {
      defaultMagnification: 100,
      pixelSize: 0.1,
      autoCalibration: true,
      batchProcessing: false
    },
    database: {
      autoBackup: true,
      backupInterval: 24,
      maxStorage: 10,
      compression: true
    }
  });

  const [systemConfig, setSystemConfig] = useState({
    general: {
      companyName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      companyLogo: null,
      measureUnit: 'microns',
      numberOfImagesDisplayed: 0,
      imageResolution: 96,
      decimalPoints: 2,
      imageFormat: 'jpg',
      reportFormat: 'Excel',
      reportLocation: '',
      scaleLength: 100,
      customStandardReport: 'Standard',
      displayFontSize: 12,
      reportHeader: true,
      imageInReport: 'Both',
      darkFeatureRangeFrom: 0,
      darkFeatureRangeTo: 128,
      lightFeatureRangeFrom: 129,
      lightFeatureRangeTo: 255,
      minPixelsForFeature: 10,
      circularityCutoff: 0.5,
      minLengthForNodularity: 10
    },
    flakeConfiguration: {
      // Flake Type Detection Order
      flakeTypeOrder: ['A', 'B', 'C', 'D', 'E'],
      flakeTypeSelected: [true, true, true, true, true],
      
      // Flake Configuration Parameters
      flakeAngleGrouping: 30,
      flakeDefectDepthRatioCutoff: 0.25,
      typeAMinSize: 7,
      typeAMaxSize: 3,
      typeAMaxWidth: 3,
      typeBMinSize: 5,
      typeBMaxSize: 8,
      maxTypeBFlakeDistance: 15,
      maxTypeBFlakeCount: 15,
      maxRosetteEnclosingCircleDia: 50,
      minTypeBNearestFlakeCount: 2,
      minTypeBFlakeClusterCircularity: 0.75,
      minTypeBStarWidth: 10,
      minTypeBStarElongation: 0.6,
      minStdDevToAvgRatioForFlakeDistance: 0.5,
      maxTypeBFlakesAreaToImageAreaRatio: 1,
      minTypeBStarArmCount: 8,
      typeCMaxSize: 5,
      typeCMinWidth: 3,
      typeDMinSize: 7,
      typeDMaxSize: 8,
      typeDMaxWidth: 8,
      typeDMinCount: 50,
      typeEMinSize: 7,
      typeEMaxSize: 8,
      typeEMaxWidth: 8,
      
      // Rosette Configuration
      rosetteFlakeRadiusFactor: 0.3,
      rosetteDensityFactor: 0.8,
      minRosetteFlakeCount: 15,
      minRosetteStarFlakeCount: 5,
      minAreaPercentForStar: 0.8,
      typeDFlakeRatio: 0.8,
      flakeAngleWindowSize: 15,
      flakeUniformAlignRatio: 0.66,
      maxFlakeAngleToRosetteCenter: 15,
      rosetteFlakeRatio: 0.5,
      flakeRosetteInclusionRatio: 0.75,
      flakeCompactness: 0.5,
      flakeClusterPercentage: 75
    },
    performance: {
      localThresholdingWidth: 5,
      minPixelLengthForFeature: 5,
      minPixelAreaForFeature: 10,
      maxProcessRunningTime: 120,
      edgeCorrectionValue: 0,
      elongationCutoff: 0.2,
      thresholding: 'Local',
      includeGlobalThresholdInLocal: 'Yes',
      sweepAngleForGrainBoundaryGapFill: 120,
      minGrainBoundaryWidth: 3
    },
    chemicalProperties: {
      maxElements: 8,
      maxPhases: 5,
      elements: [],
      phases: []
    }
  });

  const [cameraConfig, setCameraConfig] = useState({
    resolution: '800x600',
    cameraWindowWidth: 800,
    cameraWindowHeight: 600,
    previewMode: 'No',
    camera: 'D300-B',
    cameraType: 'Default'
  });

  const [activationCode, setActivationCode] = useState(['', '', '', '']);
  const [isActivated, setIsActivated] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    company: false,
    measurement: false,
    analysis: false,
    flakeTypeOrder: false,
    flakeParameters: false,
    rosetteConfiguration: false,
    performance: false,
    chemicalProperties: false,
    resolution: false,
    preview: false,
    cameraType: false
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'system', name: 'System Configuration', icon: SettingsIcon },
    { id: 'camera', name: 'Camera Configuration', icon: Camera },
    { id: 'activate', name: 'Activate', icon: SettingsIcon }
  ];

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateSystemConfig = (category, key, value) => {
    setSystemConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const updateCameraConfig = (key, value) => {
    setCameraConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateSystemConfig('general', 'companyLogo', file);
      toast.success('Company logo uploaded successfully');
    }
  };

  const handleReportLocationSelect = () => {
    const path = prompt('Enter report location path:');
    if (path) {
      updateSystemConfig('general', 'reportLocation', path);
    }
  };

  const handleResolutionChange = (resolution) => {
    const [width, height] = resolution.split('x').map(Number);
    setCameraConfig(prev => ({
      ...prev,
      resolution,
      cameraWindowWidth: width,
      cameraWindowHeight: height
    }));
  };

  const handleActivationCodeChange = (index, value) => {
    const newCode = [...activationCode];
    newCode[index] = value;
    setActivationCode(newCode);
    
    // Auto-focus to next input field
    if (value && index < 3) {
      const nextInput = document.getElementById(`activation-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

     const handleActivation = () => {
     const code = activationCode.join('');
     if (code.length === 4) { // 4-digit activation code
       // Here you would typically validate with your backend
       setIsActivated(true);
       toast.success('Software activated successfully!');
       localStorage.setItem('envision-activated', 'true');
     } else {
       toast.error('Please enter a valid 4-digit activation code');
     }
   };

  const handleCancelActivation = () => {
    setActivationCode(['', '', '', '']);
    setIsActivated(false);
    localStorage.removeItem('envision-activated');
    toast.info('Activation cancelled');
  };

  const saveSettings = () => {
    // In real implementation, this would save to backend/localStorage
    localStorage.setItem('envision-settings', JSON.stringify(settings));
    localStorage.setItem('envision-system-config', JSON.stringify(systemConfig));
    localStorage.setItem('envision-camera-config', JSON.stringify(cameraConfig));
    toast.success('All settings saved successfully');
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      setSettings({
        general: {
          language: 'en',
          theme: 'light',
          autoSave: true,
          notifications: true
        },
        camera: {
          defaultResolution: '1920x1080',
          frameRate: 30,
          autoExposure: true,
          autoGain: true,
          whiteBalance: 'auto'
        },
        analysis: {
          defaultMagnification: 100,
          pixelSize: 0.1,
          autoCalibration: true,
          batchProcessing: false
        },
        database: {
          autoBackup: true,
          backupInterval: 24,
          maxStorage: 10,
          compression: true
        }
      });

      // Reset system configuration to default
      setSystemConfig({
        general: {
          companyName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: '',
          companyLogo: null,
          measureUnit: 'microns',
          numberOfImagesDisplayed: 0,
          imageResolution: 96,
          decimalPoints: 2,
          imageFormat: 'jpg',
          reportFormat: 'Excel',
          reportLocation: '',
          scaleLength: 100,
          customStandardReport: 'Standard',
          displayFontSize: 12,
          reportHeader: true,
          imageInReport: 'Both',
          darkFeatureRangeFrom: 0,
          darkFeatureRangeTo: 128,
          lightFeatureRangeFrom: 129,
          lightFeatureRangeTo: 255,
          minPixelsForFeature: 10,
          circularityCutoff: 0.5,
          minLengthForNodularity: 10
        },
        flakeConfiguration: {
          // Flake Type Detection Order
          flakeTypeOrder: ['A', 'B', 'C', 'D', 'E'],
          flakeTypeSelected: [true, true, true, true, true],
          
          // Flake Configuration Parameters
          flakeAngleGrouping: 30,
          flakeDefectDepthRatioCutoff: 0.25,
          typeAMinSize: 7,
          typeAMaxSize: 3,
          typeAMaxWidth: 3,
          typeBMinSize: 5,
          typeBMaxSize: 8,
          maxTypeBFlakeDistance: 15,
          maxTypeBFlakeCount: 15,
          maxRosetteEnclosingCircleDia: 50,
          minTypeBNearestFlakeCount: 2,
          minTypeBFlakeClusterCircularity: 0.75,
          minTypeBStarWidth: 10,
          minTypeBStarElongation: 0.6,
          minStdDevToAvgRatioForFlakeDistance: 0.5,
          maxTypeBFlakesAreaToImageAreaRatio: 1,
          minTypeBStarArmCount: 8,
          typeCMaxSize: 5,
          typeCMinWidth: 3,
          typeDMinSize: 7,
          typeDMaxSize: 8,
          typeDMaxWidth: 8,
          typeDMinCount: 50,
          typeEMinSize: 7,
          typeEMaxSize: 8,
          typeEMaxWidth: 8,
          
          // Rosette Configuration
          rosetteFlakeRadiusFactor: 0.3,
          rosetteDensityFactor: 0.8,
          minRosetteFlakeCount: 15,
          minRosetteStarFlakeCount: 5,
          minAreaPercentForStar: 0.8,
          typeDFlakeRatio: 0.8,
          flakeAngleWindowSize: 15,
          flakeUniformAlignRatio: 0.66,
          maxFlakeAngleToRosetteCenter: 15,
          rosetteFlakeRatio: 0.5,
          flakeRosetteInclusionRatio: 0.75,
          flakeCompactness: 0.5,
          flakeClusterPercentage: 75
        },
        performance: {
          localThresholdingWidth: 5,
          minPixelLengthForFeature: 5,
          minPixelAreaForFeature: 10,
          maxProcessRunningTime: 120,
          edgeCorrectionValue: 0,
          elongationCutoff: 0.2,
          thresholding: 'Local',
          includeGlobalThresholdInLocal: 'Yes',
          sweepAngleForGrainBoundaryGapFill: 120,
          minGrainBoundaryWidth: 3
        },
        chemicalProperties: {
          maxElements: 8,
          maxPhases: 5,
          elements: [],
          phases: []
        }
      });

      // Reset camera configuration to default
      setCameraConfig({
        resolution: '800x600',
        cameraWindowWidth: 800,
        cameraWindowHeight: 600,
        previewMode: 'No',
        camera: 'D300-B',
        cameraType: 'Default'
      });

      // Reset expanded sections
      setExpandedSections({
        company: false,
        measurement: false,
        analysis: false,
        flakeTypeOrder: false,
        flakeParameters: false,
        rosetteConfiguration: false,
        performance: false,
        chemicalProperties: false,
        resolution: false,
        preview: false,
        cameraType: false
      });

      toast.success('All settings reset to default');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600">Configure system preferences and analysis parameters</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={resetSettings} className="btn-secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
          <button onClick={saveSettings} className="btn-primary">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side - Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="input-field"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.general.theme}
                      onChange={(e) => updateSetting('general', 'theme', e.target.value)}
                      className="input-field"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="autoSave"
                      checked={settings.general.autoSave}
                      onChange={(e) => updateSetting('general', 'autoSave', e.target.checked)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="autoSave" className="text-sm font-medium text-secondary-700">
                      Auto-save analysis results
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      checked={settings.general.notifications}
                      onChange={(e) => updateSetting('general', 'notifications', e.target.checked)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="notifications" className="text-sm font-medium text-secondary-700">
                      Enable notifications
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">System Configuration</h3>
                <p className="text-secondary-600">
                  Configure company information, measurement units, analysis parameters, flake configuration, and performance settings.
                </p>
                
                {/* Company Information Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('company')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Company Information</span>
                    {expandedSections.company ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.company && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Company Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.companyName}
                            onChange={(e) => updateSystemConfig('general', 'companyName', e.target.value)}
                            className="input-field"
                            placeholder="Company Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.addressLine1}
                            onChange={(e) => updateSystemConfig('general', 'addressLine1', e.target.value)}
                            className="input-field"
                            placeholder="Enter address line 1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.addressLine2}
                            onChange={(e) => updateSystemConfig('general', 'addressLine2', e.target.value)}
                            className="input-field"
                            placeholder="Enter address line 2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.city}
                            onChange={(e) => updateSystemConfig('general', 'city', e.target.value)}
                            className="input-field"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.state}
                            onChange={(e) => updateSystemConfig('general', 'state', e.target.value)}
                            className="input-field"
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={systemConfig.general.country}
                            onChange={(e) => updateSystemConfig('general', 'country', e.target.value)}
                            className="input-field"
                            placeholder="Enter country"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Measurement Settings Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('measurement')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Measurement & Display Settings</span>
                    {expandedSections.measurement ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.measurement && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Measure Unit
                          </label>
                          <select
                            value={systemConfig.general.measureUnit}
                            onChange={(e) => updateSystemConfig('general', 'measureUnit', e.target.value)}
                            className="input-field"
                          >
                            <option value="mm">mm</option>
                            <option value="microns">microns</option>
                            <option value="cm">cm</option>
                            <option value="inch">inch</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Number of Images Displayed
                          </label>
                          <input
                            type="number"
                            value={systemConfig.general.numberOfImagesDisplayed}
                            onChange={(e) => updateSystemConfig('general', 'numberOfImagesDisplayed', parseInt(e.target.value))}
                            className="input-field"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Image Resolution
                          </label>
                          <input
                            type="number"
                            value={systemConfig.general.imageResolution}
                            onChange={(e) => updateSystemConfig('general', 'imageResolution', parseInt(e.target.value))}
                            className="input-field"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Decimal Points <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={systemConfig.general.decimalPoints}
                            onChange={(e) => updateSystemConfig('general', 'decimalPoints', parseInt(e.target.value))}
                            className="input-field"
                            min="0"
                            max="10"
                          />
                          <p className="text-xs text-secondary-500 mt-1">Number of decimal places in the result</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Image Format
                          </label>
                          <select
                            value={systemConfig.general.imageFormat}
                            onChange={(e) => updateSystemConfig('general', 'imageFormat', e.target.value)}
                            className="input-field"
                          >
                            <option value="jpg">JPG</option>
                            <option value="bmp">BMP</option>
                            <option value="gif">GIF</option>
                            <option value="tiff">TIFF</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Report Format
                          </label>
                          <select
                            value={systemConfig.general.reportFormat}
                            onChange={(e) => updateSystemConfig('general', 'reportFormat', e.target.value)}
                            className="input-field"
                          >
                            <option value="PDF">PDF</option>
                            <option value="Excel">Excel</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Scale Length
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={systemConfig.general.scaleLength}
                              onChange={(e) => updateSystemConfig('general', 'scaleLength', parseInt(e.target.value))}
                              className="input-field"
                              min="1"
                            />
                            <span className="text-sm text-secondary-600 self-center">microns</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Parameters Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('analysis')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Analysis Parameters</span>
                    {expandedSections.analysis ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.analysis && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Custom/Standard Report
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="reportType"
                                value="Standard"
                                checked={systemConfig.general.customStandardReport === 'Standard'}
                                onChange={(e) => updateSystemConfig('general', 'customStandardReport', e.target.value)}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Standard</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="reportType"
                                value="Custom"
                                checked={systemConfig.general.customStandardReport === 'Custom'}
                                onChange={(e) => updateSystemConfig('general', 'customStandardReport', e.target.value)}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Custom</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Display Font Size
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={systemConfig.general.displayFontSize}
                              onChange={(e) => updateSystemConfig('general', 'displayFontSize', parseInt(e.target.value))}
                              className="input-field"
                              min="8"
                              max="24"
                            />
                            <span className="text-sm text-secondary-600 self-center">Pixels</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Report Header?
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={systemConfig.general.reportHeader}
                                onChange={(e) => updateSystemConfig('general', 'reportHeader', e.target.checked)}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={!systemConfig.general.reportHeader}
                                onChange={(e) => updateSystemConfig('general', 'reportHeader', !e.target.checked)}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">No</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Image in Report
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={systemConfig.general.imageInReport === 'Original'}
                                onChange={(e) => updateSystemConfig('general', 'imageInReport', e.target.checked ? 'Original' : '')}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Original</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={systemConfig.general.imageInReport === 'Processed'}
                                onChange={(e) => updateSystemConfig('general', 'imageInReport', e.target.checked ? 'Processed' : '')}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Processed</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={systemConfig.general.imageInReport === 'Both'}
                                onChange={(e) => updateSystemConfig('general', 'imageInReport', e.target.checked ? 'Both' : '')}
                                className="text-primary-600 focus:ring-primary-500"
                              />
                              <span className="ml-2 text-sm text-secondary-700">Both</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Dark Feature Range
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={systemConfig.general.darkFeatureRangeFrom}
                              onChange={(e) => updateSystemConfig('general', 'darkFeatureRangeFrom', parseInt(e.target.value))}
                              className="input-field"
                              min="0"
                              max="255"
                            />
                            <span className="text-sm text-secondary-600">To</span>
                            <input
                              type="number"
                              value={systemConfig.general.darkFeatureRangeTo}
                              onChange={(e) => updateSystemConfig('general', 'darkFeatureRangeTo', parseInt(e.target.value))}
                              className="input-field"
                              min="0"
                              max="255"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Light Feature Range
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={systemConfig.general.lightFeatureRangeFrom}
                              onChange={(e) => updateSystemConfig('general', 'lightFeatureRangeFrom', parseInt(e.target.value))}
                              className="input-field"
                              min="0"
                              max="255"
                            />
                            <span className="text-sm text-secondary-600">To</span>
                            <input
                              type="number"
                              value={systemConfig.general.lightFeatureRangeTo}
                              onChange={(e) => updateSystemConfig('general', 'lightFeatureRangeTo', parseInt(e.target.value))}
                              className="input-field"
                              min="0"
                              max="255"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Min Pixels for Feature/Porosity/Nodularity
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={systemConfig.general.minPixelsForFeature}
                              onChange={(e) => updateSystemConfig('general', 'minPixelsForFeature', parseInt(e.target.value))}
                              className="input-field"
                              min="1"
                            />
                            <span className="text-sm text-secondary-600 self-center">Pixels</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Circularity Cutoff
                          </label>
                          <input
                            type="number"
                            value={systemConfig.general.circularityCutoff}
                            onChange={(e) => updateSystemConfig('general', 'circularityCutoff', parseFloat(e.target.value))}
                            className="input-field"
                            step="0.01"
                            min="0"
                            max="1"
                          />
                          <p className="text-xs text-secondary-500 mt-1">(&gt;0 and &lt;1)</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Min Length for Nodularity
                          </label>
                          <input
                            type="number"
                            value={systemConfig.general.minLengthForNodularity}
                            onChange={(e) => updateSystemConfig('general', 'minLengthForNodularity', parseInt(e.target.value))}
                            className="input-field"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flake Type Detection Order Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('flakeTypeOrder')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Flake Type Detection Order</span>
                    {expandedSections.flakeTypeOrder ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.flakeTypeOrder && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Order No</label>
                          <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((order) => (
                              <div key={order} className="text-sm text-secondary-600">{order}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Element</label>
                          <div className="space-y-2">
                            {systemConfig.flakeConfiguration.flakeTypeOrder.map((element, index) => (
                              <div key={index} className="text-sm text-secondary-600">{element}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">Select?</label>
                          <div className="space-y-2">
                            {systemConfig.flakeConfiguration.flakeTypeSelected.map((selected, index) => (
                              <label key={index} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => {
                                    const newSelected = [...systemConfig.flakeConfiguration.flakeTypeSelected];
                                    newSelected[index] = e.target.checked;
                                    updateSystemConfig('flakeConfiguration', 'flakeTypeSelected', newSelected);
                                  }}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm">Up</button>
                        <button className="btn-secondary text-sm">Down</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Performance Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('performance')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Performance</span>
                    {expandedSections.performance ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.performance && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 font-medium">
                          PLEASE DO NOT CHANGE THE VALUES IN THIS TAB WITHOUT CONSULTING TECHNICAL SUPPORT
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Local Thresholding Width
                          </label>
                          <input
                            type="number"
                            value={systemConfig.performance.localThresholdingWidth}
                            onChange={(e) => updateSystemConfig('performance', 'localThresholdingWidth', parseInt(e.target.value))}
                            className="input-field"
                            min="1"
                          />
                          <p className="text-xs text-secondary-500 mt-1">This value determines the width of the window that will be used for local thresholding</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Min Pixel Length for Feature
                          </label>
                          <input
                            type="number"
                            value={systemConfig.performance.minPixelLengthForFeature}
                            onChange={(e) => updateSystemConfig('performance', 'minPixelLengthForFeature', parseInt(e.target.value))}
                            className="input-field"
                            min="1"
                          />
                          <p className="text-xs text-secondary-500 mt-1">Minimum length in terms of pixels for a feature</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Min Pixel Area for Feature
                          </label>
                          <input
                            type="number"
                            value={systemConfig.performance.minPixelAreaForFeature}
                            onChange={(e) => updateSystemConfig('performance', 'minPixelAreaForFeature', parseInt(e.target.value))}
                            className="input-field"
                            min="1"
                          />
                          <p className="text-xs text-secondary-500 mt-1">Minimum area in terms of pixels for a feature</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Max Process Running Time
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={systemConfig.performance.maxProcessRunningTime}
                              onChange={(e) => updateSystemConfig('performance', 'maxProcessRunningTime', parseInt(e.target.value))}
                              className="input-field"
                              min="1"
                            />
                            <span className="text-sm text-secondary-600 self-center">seconds</span>
                          </div>
                          <p className="text-xs text-secondary-500 mt-1">Maximum process running time in seconds after which the process will be aborted</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Thresholding (Local/Global)
                          </label>
                          <div className="space-y-2">
                            {['Local', 'Global', 'Binary', 'Adaptive'].map((type) => (
                              <label key={type} className="flex items-center">
                                <input
                                  type="radio"
                                  name="thresholding"
                                  value={type}
                                  checked={systemConfig.performance.thresholding === type}
                                  onChange={(e) => updateSystemConfig('performance', 'thresholding', e.target.value)}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-secondary-700">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Include Global Threshold in Local?
                          </label>
                          <div className="space-y-2">
                            {['Yes', 'No'].map((option) => (
                              <label key={option} className="flex items-center">
                                <input
                                  type="radio"
                                  name="includeGlobal"
                                  value={option}
                                  checked={systemConfig.performance.includeGlobalThresholdInLocal === option}
                                  onChange={(e) => updateSystemConfig('performance', 'includeGlobalThresholdInLocal', e.target.value)}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-secondary-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-secondary-900">Camera Configuration</h3>
                <p className="text-secondary-600">
                  Configure camera resolution, preview mode, and camera type settings.
                </p>
                
                {/* Resolution Settings Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('resolution')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Resolution Settings</span>
                    {expandedSections.resolution ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.resolution && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Resolution
                          </label>
                          <select
                            value={cameraConfig.resolution}
                            onChange={(e) => handleResolutionChange(e.target.value)}
                            className="input-field"
                          >
                            <option value="2048x1536">2048x1536</option>
                            <option value="1024x768">1024x768</option>
                            <option value="1280x1024">1280x1024</option>
                            <option value="800x600">800x600</option>
                            <option value="640x480">640x480</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Camera Window Width
                          </label>
                          <input
                            type="number"
                            value={cameraConfig.cameraWindowWidth}
                            onChange={(e) => updateCameraConfig('cameraWindowWidth', parseInt(e.target.value))}
                            className="input-field"
                            min="100"
                            max="4096"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Camera Window Height
                          </label>
                          <input
                            type="number"
                            value={cameraConfig.cameraWindowHeight}
                            onChange={(e) => updateCameraConfig('cameraWindowHeight', parseInt(e.target.value))}
                            className="input-field"
                            min="100"
                            max="4096"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Mode Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('preview')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Preview Mode</span>
                    {expandedSections.preview ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.preview && (
                    <div className="px-4 pb-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Preview Mode
                        </label>
                        <select
                          value={cameraConfig.previewMode}
                          onChange={(e) => updateCameraConfig('previewMode', e.target.value)}
                          className="input-field"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <p className="text-sm text-secondary-600 mt-2">
                          <strong>Yes</strong> - Shows a preview window of captured image<br />
                          <strong>No</strong> - No preview window (Default)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Type Section */}
                <div className="border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('cameraType')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                  >
                    <span className="font-medium text-secondary-900">Camera Type</span>
                    {expandedSections.cameraType ? (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  
                  {expandedSections.cameraType && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Camera
                          </label>
                          <input
                            type="text"
                            value={cameraConfig.camera}
                            className="input-field bg-secondary-100"
                            disabled
                          />
                          <p className="text-xs text-secondary-500 mt-1">Current camera: D300-B</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Camera Type
                          </label>
                          <div className="space-y-3">
                            {['Default', 'Others', 'Twain'].map(type => (
                              <div key={type} className="flex items-center">
                                <input
                                  type="radio"
                                  id={`camera-${type}`}
                                  name="cameraType"
                                  value={type}
                                  checked={cameraConfig.cameraType === type}
                                  onChange={(e) => updateCameraConfig('cameraType', e.target.value)}
                                  className="text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor={`camera-${type}`} className="ml-2 text-sm text-secondary-700">
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                 </div>
               </div>
             )}

             {activeTab === 'activate' && (
               <div className="space-y-6">
                 <h3 className="text-lg font-semibold text-secondary-900">Software Activation</h3>
                 <p className="text-secondary-600">
                   Enter the activation code provided to you to activate the software.
                 </p>
                 
                 {!isActivated ? (
                   <div className="space-y-6">
                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                       <h4 className="text-red-800 font-medium text-lg mb-2">
                         Enter the activation code provided to you
                       </h4>
                     </div>
                     
                                           <div className="flex justify-center">
                        <div className="flex items-center space-x-4">
                          {activationCode.map((digit, index) => (
                            <div key={index} className="flex flex-col items-center">
                                                             <input
                                 id={`activation-${index}`}
                                 type="text"
                                 value={digit}
                                 onChange={(e) => handleActivationCodeChange(index, e.target.value)}
                                 className="w-20 h-20 text-center text-3xl font-mono border-2 border-secondary-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                                 maxLength={1}
                                 placeholder="0"
                               />
                              {index < 3 && (
                                <span className="text-red-500 text-2xl font-bold mt-2">-</span>
                              )}
                              {index === 3 && (
                                <span className="text-transparent text-2xl font-bold mt-2">-</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                     
                     <div className="flex justify-center space-x-4">
                       <button
                         onClick={handleActivation}
                         className="btn-primary px-8 py-3"
                       >
                         OK
                       </button>
                       <button
                         onClick={handleCancelActivation}
                         className="btn-secondary px-8 py-3"
                       >
                         Cancel
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                     <div className="text-green-600 text-6xl mb-4">✓</div>
                     <h4 className="text-green-800 font-medium text-xl mb-2">
                       Software Activated Successfully!
                     </h4>
                     <p className="text-green-700">
                       Your software is now fully activated and ready to use.
                     </p>
                     <button
                       onClick={handleCancelActivation}
                       className="btn-secondary mt-4"
                     >
                       Deactivate
                     </button>
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>
       </div>
     </div>
   );
 };

export default Settings;
