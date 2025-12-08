import { useEffect, useState } from 'react';
import { Minimize, Square, Maximize2, X } from 'lucide-react';
import nexusIcon from '@/assets/nexus_icon.png';

interface WindowAPI {
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
}

declare global {
  interface Window {
    windowAPI: WindowAPI;
  }
}

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      if (window.windowAPI) {
        const maximized = await window.windowAPI.isMaximized();
        setIsMaximized(maximized);
      }
    };

    checkMaximized();

    // Check maximize state periodically in case it changes via other means
    const interval = setInterval(checkMaximized, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMinimize = async () => {
    if (window.windowAPI) {
      try {
        await window.windowAPI.minimizeWindow();
      } catch (error) {
        // Error handling for minimize operation
      }
    }
  };

  const handleMaximize = async () => {
    if (window.windowAPI) {
      try {
        await window.windowAPI.maximizeWindow();
        // Update state after maximize operation
        const maximized = await window.windowAPI.isMaximized();
        setIsMaximized(maximized);
      } catch (error) {
        // Error handling for maximize operation
      }
    }
  };

  const handleClose = async () => {
    if (window.windowAPI) {
      try {
        await window.windowAPI.closeWindow();
      } catch (error) {
        // Error handling for close operation
      }
    }
  };

  return (
    <div
      className="bg-onyx h-8 flex items-center px-4 select-none"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Left: Nexus Icon */}
      <img
        src={nexusIcon}
        alt="Nexus Launcher"
        className="w-4 h-4"
        style={{ WebkitAppRegion: 'no-drag' }}
      />

      {/* Center: Title */}
      <div className="flex-1 text-center">
        <span className="text-pure-white text-sm font-inter">Nexus Launcher</span>
      </div>

      {/* Right: Window Controls */}
      <div
        className="flex gap-1"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        {/* Minimize Button */}
        <button
          onClick={handleMinimize}
          className="hover:bg-carbon-black p-1 rounded transition-colors duration-150"
          title="Minimize"
        >
          <Minimize size={14} className="text-pure-white" />
        </button>

        {/* Maximize/Restore Button */}
        <button
          onClick={handleMaximize}
          className="hover:bg-carbon-black p-1 rounded transition-colors duration-150"
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            <Maximize2 size={14} className="text-pure-white" />
          ) : (
            <Square size={14} className="text-pure-white" />
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="hover:bg-red-600 p-1 rounded transition-colors duration-150"
          title="Close"
        >
          <X size={14} className="text-pure-white" />
        </button>
      </div>
    </div>
  );
}