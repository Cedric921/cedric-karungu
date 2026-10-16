import type { Locale } from './models/shared';

export const GITHUB_USER = 'Cedric921';

type Lz = Record<Locale, string>;

/** Open-source projects shown on the site, in display order. */
export const OSS_PROJECTS: {
  repo: string;
  name: string;
  homepage?: string;
  blogSlug?: string;
  description: Lz;
}[] = [
  {
    repo: 'ever-co/ever-gauzy',
    name: 'Ever Gauzy',
    homepage: 'https://gauzy.co',
    blogSlug: 'open-source-ever-gauzy',
    description: {
      en: 'Free software that runs a whole company — HR, clients, projects, hours and invoices — in one place.',
      fr: 'Un logiciel gratuit qui gère toute une entreprise — RH, clients, projets, heures et factures — au même endroit.',
      es: 'Un software gratuito que gestiona toda una empresa — RR. HH., clientes, proyectos, horas y facturas — en un solo lugar.',
    },
  },
  {
    repo: 'rtk-ai/rtk',
    name: 'RTK',
    homepage: 'https://www.rtk-ai.app',
    description: {
      en: 'A command-line tool that makes AI coding assistants use far fewer tokens on everyday developer commands.',
      fr: 'Un outil en ligne de commande qui fait consommer beaucoup moins de tokens aux assistants IA sur les commandes de dev courantes.',
      es: 'Una herramienta de línea de comandos que hace que los asistentes de IA gasten muchos menos tokens en los comandos de desarrollo habituales.',
    },
  },
  {
    repo: 'MODSetter/SurfSense',
    name: 'SurfSense',
    homepage: 'https://surfsense.com',
    blogSlug: 'open-source-surfsense',
    description: {
      en: 'Ask questions to your documents and get sourced answers — without anything leaving your computer.',
      fr: 'Posez des questions à vos documents et obtenez des réponses sourcées — sans que rien ne quitte votre ordinateur.',
      es: 'Haz preguntas a tus documentos y obtén respuestas con fuentes — sin que nada salga de tu ordenador.',
    },
  },
  {
    repo: 'Memnox/memnox',
    name: 'Memnox',
    homepage: 'https://memnox.com',
    blogSlug: 'open-source-memnox',
    description: {
      en: 'A security guard that decides what AI coding assistants are allowed to run on your machine.',
      fr: 'Un garde du corps qui décide ce que les assistants IA de code ont le droit d’exécuter sur votre machine.',
      es: 'Un guardaespaldas que decide qué pueden ejecutar los asistentes de IA de código en tu máquina.',
    },
  },
  {
    repo: 'expo/expo',
    name: 'Expo',
    homepage: 'https://expo.dev',
    blogSlug: 'open-source-expo-react-native',
    description: {
      en: 'The toolkit to build, test and ship iPhone and Android apps from one React codebase.',
      fr: 'La boîte à outils pour créer, tester et publier des apps iPhone et Android à partir d’un seul code React.',
      es: 'La caja de herramientas para crear, probar y publicar apps de iPhone y Android con un solo código React.',
    },
  },
  {
    repo: 'react/react-native',
    name: 'React Native',
    homepage: 'https://reactnative.dev',
    blogSlug: 'open-source-expo-react-native',
    description: {
      en: 'Meta’s framework for building truly native mobile apps with React.',
      fr: 'Le framework de Meta pour créer de vraies apps mobiles natives avec React.',
      es: 'El framework de Meta para crear apps móviles realmente nativas con React.',
    },
  },
  {
    repo: 'Shinobi-Open-Source-Academy/sos-academy-platform',
    name: 'SOS Academy',
    blogSlug: 'open-source-sos-academy',
    description: {
      en: 'A free community where beginners learn on real open-source projects, with a mentor.',
      fr: 'Une communauté gratuite où les débutants apprennent sur de vrais projets open source, avec un mentor.',
      es: 'Una comunidad gratuita donde los principiantes aprenden en proyectos open source reales, con un mentor.',
    },
  },
];

export type OssPr = {
  number: number;
  title: string;
  url: string;
  state: 'merged' | 'open';
  createdAt: string;
  mergedAt: string | null;
};

export type OssRepo = {
  repo: string;
  stars: number;
  avatar: string;
  prs: OssPr[]; // merged + open, newest first (closed-unmerged are left out)
};

export type OssData = { updatedAt: string; repos: OssRepo[] };

type SearchItem = {
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  pull_request?: { merged_at: string | null };
};

class GitHubError extends Error {
  constructor(public status: number, path: string) {
    super(`GitHub ${status} on ${path}`);
  }
}

async function gh<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new GitHubError(res.status, path);
  return res.json() as Promise<T>;
}

const toPr = (p: { number: number; title: string; html_url: string; state: string; created_at: string; merged_at: string | null }): OssPr | null => {
  const state = p.merged_at ? 'merged' : p.state === 'open' ? 'open' : null;
  return state ? { number: p.number, title: p.title, url: p.html_url, state, createdAt: p.created_at, mergedAt: p.merged_at } : null;
};

/** The user's PRs in a repo: the search API first, the repo's PR list when search refuses it (422). */
async function prsOf(repo: string, token?: string): Promise<OssPr[]> {
  const q = encodeURIComponent(`repo:${repo} is:pr author:${GITHUB_USER}`);
  try {
    const items: SearchItem[] = [];
    for (let page = 1; page <= 3; page++) {
      const r = await gh<{ total_count: number; items: SearchItem[] }>(`/search/issues?q=${q}&sort=created&order=desc&per_page=100&page=${page}`, token);
      items.push(...r.items);
      if (items.length >= r.total_count || r.items.length < 100) break;
    }
    return items
      .map((i) => toPr({ ...i, merged_at: i.pull_request?.merged_at ?? null }))
      .filter((p): p is OssPr => p !== null);
  } catch (err) {
    if (!(err instanceof GitHubError) || err.status !== 422) throw err;
    const pulls: { number: number; title: string; html_url: string; state: string; created_at: string; merged_at: string | null; user: { login: string } }[] = [];
    for (let page = 1; page <= 5; page++) {
      const batch = await gh<typeof pulls>(`/repos/${repo}/pulls?state=all&per_page=100&page=${page}`, token);
      pulls.push(...batch);
      if (batch.length < 100) break;
    }
    return pulls
      .filter((p) => p.user.login.toLowerCase() === GITHUB_USER.toLowerCase())
      .map(toPr)
      .filter((p): p is OssPr => p !== null);
  }
}

/** Live PRs and stars for every project (merged and open PRs only, newest first). */
export async function fetchOssData(token = process.env.GITHUB_TOKEN): Promise<OssData> {
  const repos = await Promise.all(
    OSS_PROJECTS.map(async ({ repo }) => {
      const [meta, prs] = await Promise.all([
        gh<{ stargazers_count: number; owner: { avatar_url: string } }>(`/repos/${repo}`, token),
        prsOf(repo, token),
      ]);
      prs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return { repo, stars: meta.stargazers_count, avatar: meta.owner.avatar_url, prs };
    }),
  );
  return { updatedAt: new Date().toISOString(), repos };
}
