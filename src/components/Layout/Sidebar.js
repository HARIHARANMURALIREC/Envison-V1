import React from 'react';
import { 
  Home, 
  Camera, 
  Image, 
  Microscope, 
  Layers, 
  BarChart3, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPath, onNavigate }) => {
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Overview and recent analyses'
    },
    {
      name: 'Camera Capture',
      path: '/camera',
      icon: Camera,
      description: 'Real-time microscopy capture'
    },
    {
      name: 'Image Processing',
      path: '/image-processing',
      icon: Image,
      description: 'Advanced image enhancement'
    },
    {
      name: 'Metallurgical Analysis',
      path: '/metallurgical-analysis',
      icon: Microscope,
      description: 'Porosity and phase analysis'
    },
    {
      name: 'Graphite Analysis',
      path: '/graphite-analysis',
      icon: Layers,
      description: 'Nodularity and flake analysis'
    },
    {
      name: 'Structural Analysis',
      path: '/structural-analysis',
      icon: BarChart3,
      description: 'Dendritic and particle analysis'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'System configuration'
    },
    {
      name: 'Help',
      path: '/help',
      icon: HelpCircle,
      description: 'Documentation and support'
    }
  ];

  const handleNavigation = (path) => {
    onNavigate(path);
    onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0`}>
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-secondary-200">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-500">
              <h1 className="text-xl font-bold text-white">ENVISION</h1>
            </div>
            
            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => handleNavigation(item.path)}
                        className={`sidebar-item w-full text-left ${
                          isActive ? 'active' : ''
                        }`}
                        title={item.description}
                      >
                        <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">M</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-700">Materials Science</p>
                  <p className="text-xs text-secondary-500">Advanced Analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white border-r border-secondary-200">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-primary-500">
            <h1 className="text-xl font-bold text-white">ENVISION</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-100 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`sidebar-item w-full text-left ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
