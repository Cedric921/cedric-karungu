export const twoCurrencies = {
  slug: 'two-currencies-without-losing-a-franc',
  seoTitle: {"en": "Handling USD and CDF in one till without losing a cent", "fr": "Gérer USD et CDF dans une même caisse sans perdre un centime"},
  seoDescription: {"en": "A practical model for two currencies at the till: integer money, a rate stored with every payment, one rounding rule and mixed payments.", "fr": "Un modèle concret pour deux devises en caisse : montants en entiers, taux enregistré à chaque paiement, une seule règle d'arrondi, paiements mixtes."},
  cover: '/images/Projects/hela/01.jpg',
  tags: ['Fintech', 'Multi-currency', 'PostgreSQL', 'TypeScript', 'Architecture'],
  daysAgo: 16,
  title: {
    en: 'Francs and dollars in the same till: handling two currencies without losing a cent',
    fr: 'Francs et dollars dans la même caisse : gérer deux devises sans perdre un centime',
  },
  excerpt: {
    en: 'In Goma, a customer can pay half in CDF and half in USD. Floats, rounding and moving exchange rates will quietly break your books. Here is the model I use.',
    fr: 'À Goma, un client peut payer moitié en CDF, moitié en USD. Les flottants, les arrondis et les taux qui bougent cassent la comptabilité en silence. Voici le modèle que j’utilise.',
  },
  content: {
    en: `In most tutorials, money is a \`number\` and a currency symbol. In eastern Congo that model breaks on the first day: prices are quoted in dollars, change is given in francs, and the rate moves during the week.

Building tills and treasuries for products like **Hela** and **Nunua**, I ended up with a few rules that I now apply everywhere.

## 1. Never store money as a float

\`0.1 + 0.2\` is not \`0.3\` in JavaScript, and that error compounds across thousands of sales. Store **integers in the smallest unit**:

\`\`\`ts
type Money = {
  amount: bigint | number; // minor units: cents for USD, francs for CDF
  currency: 'USD' | 'CDF';
};
\`\`\`

In PostgreSQL that's a \`bigint\` (or \`numeric\` if you truly need it), never \`real\`.

## 2. A conversion is an event with its own rate

The mistake I see most often: storing a payment in USD and *recomputing* the CDF value later with today's rate. Six months later, your reports no longer match the receipts customers hold.

Instead, every conversion records the rate that was used:

\`\`\`ts
type Payment = {
  id: string;
  paid: Money;          // what the customer actually handed over
  settles: Money;       // what it counts for on the invoice
  rate: string;         // e.g. "2850" CDF per USD, stored as a decimal string
  rateSource: 'manual' | 'daily';
  at: Date;
};
\`\`\`

Reports then sum \`settles\` — no conversion at read time, no drift.

## 3. Decide who absorbs the rounding

Converting 10 USD at 2 850 gives exactly 28 500 CDF. Converting 7.35 USD gives 20 947.5 — and francs have no half. Someone wins or loses that half franc.

Pick a rule, write it down, apply it in **one** function:

- round in the customer's favour at the till;
- keep the difference in an explicit *rounding* line, so the books still balance.

## 4. Mixed payments are just several payments

"Half in dollars, the rest in francs" sounds complicated, but it is two \`Payment\` rows against the same invoice. The invoice is settled when the sum of \`settles\` reaches the total. Change (*la monnaie*) is a negative payment in the currency you give back.

## 5. Show both, always

Cashiers think in both currencies. Every total on screen shows the invoice currency **and** its equivalent at the current rate, with the rate visible. It removes a whole category of disputes at the counter.

## Checklist

- [x] Integers in minor units, typed with their currency
- [x] Rate stored on every conversion, never recomputed
- [x] One rounding function, with an explicit rounding line
- [x] Mixed payments = multiple payment rows
- [x] Both currencies and the rate visible on screen

None of this is exotic. But skipping any of these rules works fine in the demo — and fails the first time an accountant reconciles a month of real sales.`,
    fr: `Dans la plupart des tutoriels, l'argent est un \`number\` avec un symbole. Dans l'Est du Congo, ce modèle casse dès le premier jour : les prix sont annoncés en dollars, la monnaie est rendue en francs, et le taux bouge pendant la semaine.

En construisant des caisses et des trésoreries pour des produits comme **Hela** et **Nunua**, j'ai fini par adopter quelques règles que j'applique désormais partout.

## 1. Ne jamais stocker l'argent en flottant

\`0.1 + 0.2\` ne vaut pas \`0.3\` en JavaScript, et cette erreur s'accumule sur des milliers de ventes. On stocke des **entiers dans la plus petite unité** :

\`\`\`ts
type Money = {
  amount: bigint | number; // unités mineures : cents pour l'USD, francs pour le CDF
  currency: 'USD' | 'CDF';
};
\`\`\`

En PostgreSQL, c'est un \`bigint\` (ou \`numeric\` si vraiment nécessaire), jamais un \`real\`.

## 2. Une conversion est un événement avec son propre taux

L'erreur la plus fréquente : enregistrer un paiement en USD et *recalculer* sa valeur en CDF plus tard avec le taux du jour. Six mois après, les rapports ne correspondent plus aux reçus que les clients ont en main.

À la place, chaque conversion enregistre le taux utilisé :

\`\`\`ts
type Payment = {
  id: string;
  paid: Money;          // ce que le client a réellement donné
  settles: Money;       // ce que cela règle sur la facture
  rate: string;         // ex. "2850" CDF pour 1 USD, stocké en chaîne décimale
  rateSource: 'manual' | 'daily';
  at: Date;
};
\`\`\`

Les rapports additionnent \`settles\` — aucune conversion à la lecture, aucune dérive.

## 3. Décider qui absorbe l'arrondi

10 USD à 2 850 donnent exactement 28 500 CDF. 7,35 USD donnent 20 947,5 — et le franc n'a pas de demi. Quelqu'un gagne ou perd ce demi-franc.

Choisissez une règle, écrivez-la, appliquez-la dans **une seule** fonction :

- arrondir en faveur du client à la caisse ;
- garder la différence dans une ligne *arrondi* explicite, pour que les comptes restent équilibrés.

## 4. Un paiement mixte, ce sont plusieurs paiements

« La moitié en dollars, le reste en francs » paraît compliqué, mais ce sont deux lignes \`Payment\` sur la même facture. La facture est réglée quand la somme des \`settles\` atteint le total. La monnaie rendue est un paiement négatif dans la devise rendue.

## 5. Toujours afficher les deux

Les caissiers pensent dans les deux devises. Chaque total à l'écran affiche la devise de la facture **et** son équivalent au taux actuel, avec le taux visible. Cela supprime toute une catégorie de litiges au comptoir.

## Check-list

- [x] Entiers en unités mineures, typés avec leur devise
- [x] Taux enregistré à chaque conversion, jamais recalculé
- [x] Une seule fonction d'arrondi, avec une ligne d'arrondi explicite
- [x] Paiement mixte = plusieurs lignes de paiement
- [x] Les deux devises et le taux visibles à l'écran

Rien de tout cela n'est exotique. Mais sauter une de ces règles passe très bien en démo — et échoue la première fois qu'un comptable rapproche un mois de ventes réelles.`,
  },
};
