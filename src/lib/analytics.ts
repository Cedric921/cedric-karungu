/** Social platforms counted as "social_click", matched on the link's host. */
export const SOCIAL_PLATFORMS: { key: string; label: string; hosts: RegExp }[] = [
  { key: 'linkedin', label: 'LinkedIn', hosts: /(^|\.)linkedin\.com$|^lnkd\.in$/ },
  { key: 'github', label: 'GitHub', hosts: /^github\.com$/ },
  { key: 'x', label: 'X / Twitter', hosts: /(^|\.)(twitter|x)\.com$/ },
  { key: 'upwork', label: 'Upwork', hosts: /(^|\.)upwork\.com$/ },
  { key: 'instagram', label: 'Instagram', hosts: /(^|\.)instagram\.com$/ },
  { key: 'facebook', label: 'Facebook', hosts: /(^|\.)(facebook\.com|fb\.com)$/ },
  { key: 'youtube', label: 'YouTube', hosts: /(^|\.)(youtube\.com|youtu\.be)$/ },
  { key: 'medium', label: 'Medium', hosts: /(^|\.)medium\.com$/ },
  { key: 'devto', label: 'dev.to', hosts: /^dev\.to$/ },
  { key: 'whatsapp', label: 'WhatsApp', hosts: /(^|\.)(whatsapp\.com|wa\.me)$/ },
];

export function socialPlatformOf(href: string): string | null {
  if (href.startsWith('mailto:')) return 'email';
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    return SOCIAL_PLATFORMS.find((p) => p.hosts.test(host))?.key ?? null;
  } catch {
    return null;
  }
}

export function platformLabel(key: string): string {
  if (key === 'email') return 'Email';
  return SOCIAL_PLATFORMS.find((p) => p.key === key)?.label ?? key;
}
