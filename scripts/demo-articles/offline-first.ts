export const offlineFirst = {
  slug: 'offline-first-school-software-drc',
  cover: '/images/Projects/masomo-cd/01.jpg',
  tags: ['Offline-first', 'Next.js', 'PWA', 'EdTech', 'Architecture'],
  daysAgo: 6,
  title: {
    en: 'Offline-first: building school software that keeps working when the network stops',
    fr: "Offline-first : un logiciel scolaire qui continue de fonctionner quand le réseau s'arrête",
  },
  excerpt: {
    en: 'In many Congolese schools the connection drops several times a day. Here is how I designed Masomo so attendance, grades and the cash desk never wait for the network.',
    fr: "Dans beaucoup d'écoles congolaises, la connexion tombe plusieurs fois par jour. Voici comment j'ai conçu Masomo pour que l'appel, les notes et la caisse n'attendent jamais le réseau.",
  },
  content: {
    en: `When I started working on **Masomo**, a school-management platform for the DRC, the first real constraint wasn't a feature. It was the network.

A teacher takes attendance at 7:30. The secretary collects fees at the gate. The prefect prints report cards at the end of the period. If any of these actions shows a spinner because the connection dropped, people go back to paper — and they don't come back.

So the rule became simple: **the network is an optimisation, not a requirement.**

## Treat the server as a sync target, not the source of truth for the UI

The classic web app reads from the API and renders. Offline-first flips it:

1. The UI reads and writes a **local store** (IndexedDB in the browser).
2. Every write is also appended to an **outbox** of pending operations.
3. A background **sync loop** pushes the outbox when the connection comes back, then pulls what changed on the server.

\`\`\`ts
type Op = {
  id: string;          // client-generated UUID → idempotent on the server
  entity: 'attendance' | 'payment' | 'grade';
  action: 'create' | 'update';
  payload: unknown;
  createdAt: number;   // device clock, for ordering only
};
\`\`\`

The client-generated \`id\` matters more than it looks: if the sync request times out *after* the server saved it, the retry must not create a duplicate payment.

## Design the data so conflicts are rare

Most "conflict resolution" problems are really data-modelling problems.

- **Append, don't overwrite.** A payment is an immutable event. Corrections are new events (a refund, an adjustment), never an edit of the original.
- **Own the record.** Attendance for a class on a given day belongs to that class's teacher. Two devices rarely edit the same thing.
- **Last-write-wins only where it's harmless**, like a student's phone number.

With that, the sync loop stays boring — which is exactly what you want.

## Money needs a frozen context

Schools in Congo charge in francs **and** dollars. If a parent pays in francs on Monday and the receipt is printed on Wednesday with Wednesday's rate, the numbers no longer match what the parent saw.

So each payment stores the **rate used at the moment of payment**, and the receipt is generated from that snapshot — online or not. (I wrote more about this in a separate article on handling two currencies.)

## Show the sync state, honestly

People trust offline apps when they can see what is happening:

- a small badge: *synced*, *3 pending*, *offline*;
- the time of the last successful sync;
- pending items marked in lists, never hidden.

> If users can't tell whether their work is saved, they will assume it isn't.

## What I'd tell my past self

- Start offline-first on day one. Retrofitting it onto an online app is a rewrite.
- Make every write idempotent before writing a single sync line.
- Test on a real cheap Android phone on a bad 3G connection, not on your laptop with DevTools throttling.

Offline-first is more work up front. But in a context where the network is unreliable, it is the difference between software people *try* and software people *use*.`,
    fr: `Quand j'ai commencé à travailler sur **Masomo**, une plateforme de gestion scolaire pour la RDC, la première vraie contrainte n'était pas une fonctionnalité. C'était le réseau.

Un enseignant fait l'appel à 7h30. Le secrétaire encaisse les frais au portail. Le préfet imprime les bulletins en fin de période. Si l'une de ces actions affiche un spinner parce que la connexion est tombée, les gens reviennent au papier — et ils ne reviennent plus.

La règle est donc devenue simple : **le réseau est une optimisation, pas une condition.**

## Le serveur est une cible de synchronisation, pas la source de vérité de l'interface

L'application web classique lit l'API puis affiche. L'offline-first inverse cela :

1. L'interface lit et écrit dans un **stockage local** (IndexedDB dans le navigateur).
2. Chaque écriture est aussi ajoutée à une **file d'attente** d'opérations.
3. Une **boucle de synchronisation** envoie la file quand la connexion revient, puis récupère ce qui a changé côté serveur.

\`\`\`ts
type Op = {
  id: string;          // UUID généré côté client → idempotent côté serveur
  entity: 'attendance' | 'payment' | 'grade';
  action: 'create' | 'update';
  payload: unknown;
  createdAt: number;   // horloge de l'appareil, uniquement pour l'ordre
};
\`\`\`

L'\`id\` généré côté client compte plus qu'il n'y paraît : si la requête expire *après* que le serveur a enregistré le paiement, le nouvel essai ne doit pas créer de doublon.

## Modéliser les données pour que les conflits soient rares

La plupart des problèmes de « résolution de conflits » sont en réalité des problèmes de modèle de données.

- **Ajouter, ne pas écraser.** Un paiement est un événement immuable. Les corrections sont de nouveaux événements (remboursement, ajustement), jamais une modification de l'original.
- **Chaque donnée a un propriétaire.** L'appel d'une classe pour un jour donné appartient à l'enseignant de cette classe. Deux appareils modifient rarement la même chose.
- **« La dernière écriture gagne » seulement quand c'est sans risque**, comme le numéro de téléphone d'un élève.

Avec ça, la boucle de synchronisation reste ennuyeuse — et c'est exactement ce qu'on veut.

## L'argent a besoin d'un contexte figé

Les écoles congolaises facturent en francs **et** en dollars. Si un parent paie en francs le lundi et que le reçu est imprimé le mercredi au taux du mercredi, les montants ne correspondent plus à ce que le parent a vu.

Chaque paiement enregistre donc **le taux utilisé au moment du paiement**, et le reçu est généré à partir de cet instantané — en ligne ou non. (J'en parle plus en détail dans un article sur la gestion de deux devises.)

## Montrer l'état de synchronisation, honnêtement

Les gens font confiance à une application hors ligne quand ils voient ce qui se passe :

- un petit badge : *synchronisé*, *3 en attente*, *hors ligne* ;
- l'heure de la dernière synchronisation réussie ;
- les éléments en attente marqués dans les listes, jamais cachés.

> Si l'utilisateur ne sait pas si son travail est enregistré, il supposera que non.

## Ce que je dirais à moi-même au début

- Commencer en offline-first dès le premier jour. L'ajouter à une application en ligne, c'est une réécriture.
- Rendre chaque écriture idempotente avant d'écrire la moindre ligne de synchronisation.
- Tester sur un vrai téléphone Android d'entrée de gamme avec une mauvaise 3G, pas sur un laptop avec la limitation de DevTools.

L'offline-first demande plus de travail au départ. Mais là où le réseau n'est pas fiable, c'est la différence entre un logiciel qu'on *essaie* et un logiciel qu'on *utilise*.`,
  },
};
