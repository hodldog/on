/**
 * Domain fallback configuration
 * Rotates between trusted domains for resilience
 */

export interface DomainConfig {
  name: string;
  url: string;
  priority: number;
  type: 'primary' | 'secondary' | 'fallback';
  suspicionScore: number;
  ssl: boolean;
}

// Production domains - update these after deployment
export const DOMAIN_CONFIG: DomainConfig[] = [
  {
    name: 'GitHub Pages',
    url: 'https://yourname.github.io/stealthguard-rescue',
    priority: 1,
    type: 'primary',
    suspicionScore: 10,
    ssl: true,
  },
  {
    name: 'Cloudflare Pages',
    url: 'https://stealthguard-rescue.pages.dev',
    priority: 2,
    type: 'secondary',
    suspicionScore: 15,
    ssl: true,
  },
  {
    name: 'IP Fallback',
    url: 'http://194.60.133.152:8888/test-rescue.html',
    priority: 99,
    type: 'fallback',
    suspicionScore: 80,
    ssl: false,
  },
];

export function getBestDomain(): DomainConfig {
  return DOMAIN_CONFIG.find((d) => d.type !== 'fallback') || DOMAIN_CONFIG[0];
}

export function getDomainsByPriority(): DomainConfig[] {
  return [...DOMAIN_CONFIG].sort((a, b) => a.priority - b.priority);
}

export async function checkDomainHealth(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors',
    });
    
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export function updateDomainConfig(domains: DomainConfig[]) {
  localStorage.setItem('sg_domain_config', JSON.stringify(domains));
}

export function loadDomainConfig(): DomainConfig[] {
  const saved = localStorage.getItem('sg_domain_config');
  return saved ? JSON.parse(saved) : DOMAIN_CONFIG;
}
