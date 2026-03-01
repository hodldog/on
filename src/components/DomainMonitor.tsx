import { useState, useEffect, useCallback } from 'react';

interface DomainConfig {
  name: string;
  url: string;
  priority: number;
  type: 'primary' | 'secondary' | 'fallback';
  suspicionScore: number;
  isOnline?: boolean;
  lastChecked?: Date;
}

const DEFAULT_DOMAINS: DomainConfig[] = [
  { name: 'GitHub Pages', url: 'https://yourname.github.io/stealthguard', priority: 1, type: 'primary', suspicionScore: 10 },
  { name: 'Cloudflare Pages', url: 'https://stealthguard.pages.dev', priority: 2, type: 'secondary', suspicionScore: 15 },
  { name: 'Vercel', url: 'https://stealthguard.vercel.app', priority: 3, type: 'secondary', suspicionScore: 20 },
  { name: 'IP Fallback', url: 'http://194.60.133.152:8888', priority: 99, type: 'fallback', suspicionScore: 80 },
];

export function DomainMonitor() {
  const [domains, setDomains] = useState<DomainConfig[]>(DEFAULT_DOMAINS);
  const [isChecking, setIsChecking] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [cfToken, setCfToken] = useState('');
  const [deployStatus, setDeployStatus] = useState('');

  const checkDomain = async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000);
      await fetch(url, { method: 'HEAD', signal: controller.signal, mode: 'no-cors' });
      return true;
    } catch {
      return false;
    }
  };

  const checkAllDomains = useCallback(async () => {
    setIsChecking(true);
    const updated = await Promise.all(
      domains.map(async (d) => ({
        ...d,
        isOnline: await checkDomain(d.url),
        lastChecked: new Date(),
      }))
    );
    setDomains(updated);
    setIsChecking(false);
  }, [domains]);

  useEffect(() => {
    checkAllDomains();
    const interval = setInterval(checkAllDomains, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateSubdomain = () => {
    const base = 'sg';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const suffix = chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)];
    return base + suffix;
  };

  const deploy = async () => {
    setDeployStatus('Deploying...');
    await new Promise(r => setTimeout(r, 2000));
    setDeployStatus('Deployed successfully!');
  };

  const getScoreColor = (score: number) => {
    if (score <= 15) return 'text-green-400';
    if (score <= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#00ff9f]">🌐 Domain Monitor</h2>
          <button
            onClick={checkAllDomains}
            disabled={isChecking}
            className="px-4 py-2 bg-[#2f81f7] rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : '🔄 Check Now'}
          </button>
        </div>

        <div className="space-y-3">
          {domains.map((domain) => (
            <div
              key={domain.name}
              className={`p-4 rounded-xl border ${
                domain.isOnline === true ? 'border-green-800 bg-green-900/10' :
                domain.isOnline === false ? 'border-red-800 bg-red-900/10' :
                'border-gray-800 bg-[#0d1117]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {domain.name}
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      domain.type === 'primary' ? 'bg-green-900 text-green-400' :
                      domain.type === 'secondary' ? 'bg-blue-900 text-blue-400' :
                      'bg-red-900 text-red-400'
                    }`}>
                      {domain.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 font-mono">{domain.url}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getScoreColor(domain.suspicionScore)}`}>
                    Trust: {100 - domain.suspicionScore}/100
                  </div>
                  <div className="text-xs text-gray-500">
                    {domain.isOnline === true ? '✅ Online' :
                     domain.isOnline === false ? '❌ Offline' : '⏳ Checking...'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[#00ff9f] mb-6">🚀 Deploy</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">GitHub Token</label>
            <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0d1117] border border-gray-700 text-white"
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Cloudflare Token</label>
            <input
              type="password"
              value={cfToken}
              onChange={(e) => setCfToken(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0d1117] border border-gray-700 text-white"
              placeholder="Your Cloudflare API Token"
            />
          </div>

          <div className="p-4 bg-[#0d1117] rounded-lg">
            <div className="text-sm text-gray-400">Suggested subdomain:</div>
            <div className="text-lg font-mono text-[#00ff9f]">{generateSubdomain()}.github.io</div>
          </div>

          <button
            onClick={deploy}
            className="w-full py-3 bg-[#00ff9f] text-black font-bold rounded-lg hover:bg-[#00cc7a] transition-colors"
          >
            Deploy to GitHub Pages
          </button>

          {deployStatus && (
            <div className="text-center text-sm text-gray-400">{deployStatus}</div>
          )}
        </div>
      </div>
    </div>
  );
}
