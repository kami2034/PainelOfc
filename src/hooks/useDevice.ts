import { useState, useEffect } from 'react';

export type ViewMode = 'auto' | 'desktop' | 'mobile';

export function useDevice() {
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewMode === 'mobile' || (viewMode === 'auto' && windowWidth < 1024);

  return {
    isMobile,
    viewMode,
    setViewMode,
  };
}
