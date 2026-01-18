'use client';

import { useState, useEffect } from 'react';
import { getCacheStats } from '@/lib/cache';
import { isDebugEnabled } from '@/config/debug';

export default function CacheDebug() {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Не показываем компонент если debug отключен
  if (!isDebugEnabled('showCacheDebug')) {
    return null;
  }

  useEffect(() => {
    const updateStats = () => {
      setStats(getCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Cache Debug {isVisible ? '▼' : '▲'}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-gray-900 border border-gray-700 rounded-lg p-4 min-w-80 text-sm">
          <h3 className="text-white font-bold mb-2">Cache Statistics</h3>
          
          <div className="mb-3">
            <h4 className="text-green-400 font-semibold">Memory Cache:</h4>
            <p className="text-gray-300">Size: {stats.memoryCache.size} items</p>
            {stats.memoryCache.items.length > 0 && (
              <div className="mt-1">
                <p className="text-gray-400 text-xs">Keys:</p>
                <ul className="text-gray-500 text-xs max-h-20 overflow-y-auto">
                  {stats.memoryCache.items.map((key: string, index: number) => (
                    <li key={index} className="truncate">{key}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-blue-400 font-semibold">Persistent Cache (localStorage):</h4>
            <p className="text-gray-300">Size: {stats.localStorage.size} items</p>
            {stats.localStorage.items.length > 0 && (
              <div className="mt-1">
                <p className="text-gray-400 text-xs">Keys:</p>
                <ul className="text-gray-500 text-xs max-h-20 overflow-y-auto">
                  {stats.localStorage.items.map((key: string, index: number) => (
                    <li key={index} className="truncate">{key.replace('runcode_cache_', '')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}