import { useState, useEffect } from 'react';

interface OnChainConfig {
  backendUrl: string;
  permitKey: string;
  rescueRouter?: string;
  success: boolean;
}

export function useOnChainConfig() {
  const [config, setConfig] = useState<OnChainConfig>({
    backendUrl: '',
    permitKey: '',
    success: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage cache first
    const cached = localStorage.getItem('sg_config_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 300000) { // 5 min cache
          setConfig(parsed.config);
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Default config (fallback)
    const defaultConfig: OnChainConfig = {
      backendUrl: '',
      permitKey: '',
      rescueRouter: '0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127',
      success: true,
    };

    setConfig(defaultConfig);
    setLoading(false);
  }, []);

  return { config, loading };
}
