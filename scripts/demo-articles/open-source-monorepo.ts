export const openSourceMonorepo = {
  slug: 'lessons-from-a-large-open-source-monorepo',
  cover: '/images/Projects/ever-teams/01.jpg',
  tags: ['Open Source', 'Monorepo', 'Next.js', 'React Native', 'Career'],
  daysAgo: 41,
  title: {
    en: 'What working on a large open-source monorepo taught me',
    fr: "Ce que m'a appris le travail sur un grand monorepo open source",
  },
  excerpt: {
    en: 'Web, desktop, mobile and server in one repository, contributors in several time zones. Notes from working on Ever Teams and Ever Gauzy.',
    fr: 'Web, desktop, mobile et serveur dans un seul dépôt, des contributeurs sur plusieurs fuseaux horaires. Notes tirées de mon travail sur Ever Teams et Ever Gauzy.',
  },
  content: {
    en: `Since late 2023 I have been working on **Ever Teams** and **Ever Gauzy**, two open-source platforms built by Ever Technologies: work and time tracking on one side, a full business-management suite (ERP, CRM, HRM…) on the other. Both live in large monorepos with web, desktop, mobile and server apps side by side.

Here is what that environment taught me, beyond any single framework.

## Read the boundaries before the code

In a monorepo, the folder structure *is* the architecture. Before touching a feature I now look for:

- **apps/** — what actually ships (web, mobile, desktop, server);
- **packages/** — what is shared (UI kit, types, API clients, config);
- the **dependency direction** — apps depend on packages, never the other way round.

Breaking that direction ("just import this from the web app") is how a monorepo slowly becomes one big ball of code.

## Shared types are the real API contract

When the web app, the mobile app and the server share one TypeScript package of types, a change to a DTO breaks the build *everywhere it matters*, before review. It's the cheapest integration test you will ever get. The flip side: a "small" change in a shared package needs the same care as a public API change.

## Small pull requests travel faster across time zones

With reviewers in other countries, a PR waits hours between rounds. What helped me most:

1. **One concern per PR.** A refactor and a feature in the same PR doubles the review time.
2. **Say what you tested** — the platform, the steps, a screenshot or a short recording.
3. **Leave the codebase a bit cleaner**, but in a separate commit so reviewers can skip it.

## Respect the build graph

Monorepo tools (Turbo, Nx…) cache builds by dependency graph. If you understand that graph, you can run *only* what your change affects instead of the whole repository — on your machine and in CI. Learning those commands early saved me more time than any editor shortcut.

## Open source changes how you write

Code in a public repository will be read by strangers, sometimes years later. I write more explicit names, fewer clever tricks, and comments that explain *why*. That habit followed me into private client projects — and they're better for it.

## For developers in Africa

Contributing to open source is one of the most direct ways to show your work to the world: the code, the reviews and the discussions are public. You don't need permission to start — pick an issue labelled *good first issue*, read the contribution guide, and open a small, well-described PR.`,
    fr: `Depuis fin 2023, je travaille sur **Ever Teams** et **Ever Gauzy**, deux plateformes open source construites par Ever Technologies : suivi du travail et du temps d'un côté, suite complète de gestion d'entreprise (ERP, CRM, RH…) de l'autre. Les deux vivent dans de grands monorepos où cohabitent applications web, desktop, mobile et serveur.

Voici ce que cet environnement m'a appris, au-delà de tel ou tel framework.

## Lire les frontières avant le code

Dans un monorepo, l'arborescence *est* l'architecture. Avant de toucher une fonctionnalité, je regarde maintenant :

- **apps/** — ce qui est réellement livré (web, mobile, desktop, serveur) ;
- **packages/** — ce qui est partagé (kit UI, types, clients d'API, configuration) ;
- le **sens des dépendances** — les apps dépendent des packages, jamais l'inverse.

Casser ce sens (« j'importe juste ça depuis l'app web ») est la manière dont un monorepo devient lentement une grosse boule de code.

## Les types partagés sont le vrai contrat d'API

Quand l'app web, l'app mobile et le serveur partagent un même package TypeScript de types, modifier un DTO casse la compilation *partout où cela compte*, avant même la revue. C'est le test d'intégration le moins cher qui existe. Le revers : un « petit » changement dans un package partagé demande le même soin qu'un changement d'API publique.

## Les petites pull requests voyagent plus vite entre fuseaux horaires

Avec des relecteurs dans d'autres pays, une PR attend des heures entre deux échanges. Ce qui m'a le plus aidé :

1. **Un seul sujet par PR.** Un refactoring et une fonctionnalité dans la même PR doublent le temps de revue.
2. **Dire ce qu'on a testé** — la plateforme, les étapes, une capture ou un court enregistrement.
3. **Laisser le code un peu plus propre**, mais dans un commit séparé pour que les relecteurs puissent le passer.

## Respecter le graphe de build

Les outils de monorepo (Turbo, Nx…) mettent en cache les builds selon le graphe de dépendances. Si on comprend ce graphe, on peut lancer *uniquement* ce que son changement affecte, au lieu de tout le dépôt — en local comme en CI. Apprendre ces commandes tôt m'a fait gagner plus de temps que n'importe quel raccourci d'éditeur.

## L'open source change la façon d'écrire

Du code dans un dépôt public sera lu par des inconnus, parfois des années plus tard. J'écris des noms plus explicites, moins d'astuces, et des commentaires qui expliquent le *pourquoi*. Cette habitude m'a suivi dans les projets clients privés — et ils s'en portent mieux.

## Pour les développeurs en Afrique

Contribuer à l'open source est l'une des façons les plus directes de montrer son travail au monde : le code, les revues et les discussions sont publics. Pas besoin de permission pour commencer — choisissez un ticket *good first issue*, lisez le guide de contribution, et ouvrez une petite PR bien décrite.`,
  },
};
