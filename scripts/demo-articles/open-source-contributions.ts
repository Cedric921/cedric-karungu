export const openSourceContributions = {
  slug: 'open-source-contributions-2026',
  cover: '/images/Projects/ever-gauzy-platform/01.jpg',
  tags: ['Open Source', 'TypeScript', 'React Native', 'NestJS', 'Python', 'Security'],
  daysAgo: 0,
  title: {
    en: '126 pull requests in five open-source projects: what I fixed, and how',
    fr: '126 pull requests dans cinq projets open source : ce que j’ai corrigé, et comment',
  },
  excerpt: {
    en: 'Ever Gauzy, SurfSense, Memnox, Expo and React Native, Shinobi Open Source Academy. For each project: what it is, then the parts of the code I worked on, in detail — 94 merged, the rest still in review.',
    fr: 'Ever Gauzy, SurfSense, Memnox, Expo et React Native, Shinobi Open Source Academy. Pour chaque projet : ce qu’il fait, puis les parties du code sur lesquelles j’ai travaillé, en détail — 94 PR mergées, les autres encore en revue.',
  },
  content: {
    en: `Over the last few weeks I spent a lot of time inside other people's codebases. Not to collect green squares, but because reading and fixing production code written by strangers is the fastest way I know to get better.

This article goes project by project. For each one: what the project is, then what I actually changed — the bug, the root cause, the fix. I also say clearly what is merged and what is still waiting for review.

| Project | What it is | My PRs | Merged |
|---|---|---|---|
| [Ever Gauzy](https://github.com/ever-co/ever-gauzy) | Open business management platform (ERP/CRM/HRM) | 53 | 53 |
| [SurfSense](https://github.com/MODSetter/SurfSense) | Private, local NotebookLM alternative | 28 | 25 |
| [Memnox](https://github.com/Memnox/memnox) | Runtime that rules on every tool call of AI coding agents | 13 | 11 |
| [Expo](https://github.com/expo/expo) and [React Native](https://github.com/react/react-native) | The React Native framework and its SDK | 18 | 4 |
| [SOS Academy](https://github.com/Shinobi-Open-Source-Academy/sos-academy-platform) | Mentoring platform for open-source learners | 14 | 1 |

## 1. Ever Gauzy — making two ORMs tell the same truth

**The project.** Ever Gauzy is an open-source business management platform: ERP, CRM, HRM, applicant tracking, project management, time and activity tracking with a desktop timer, invoicing, expenses, time off and more. It's a large Nx monorepo (8,000+ stars, AGPL-3.0): a NestJS API, an Angular web app, Electron desktop apps, around 80 plugins. One particularity shapes everything: the API runs on **either TypeORM or MikroORM**, so most services have two code paths — and they drift.

I've had 53 PRs merged there (+5.9k / −1.1k lines), one in 2023 and 52 recently. Almost all come with Jest specs that pin the ORM branch they fix.

### A systematic parity audit between TypeORM and MikroORM

About twenty PRs come from the same exercise: take a feature, read both branches, and find where the MikroORM one says something different.

- **Unknown operators matched everything.** When translating TypeORM find operators to MikroORM, \`LessThan\`, \`LessThanOrEqual\`, \`Like\` and \`ILike\` fell through to \`{}\` — which MikroORM reads as *no condition*. A "maximum amount" invoice filter returned every invoice. I added the missing translations (\`$lt\`, \`$lte\`, \`$like\`, \`$ilike\`).
- **\`ILIKE\` doesn't exist on MySQL or SQLite.** MikroORM emits \`$ilike\` verbatim. I added \`isMikroOrmPostgres()\` (the existing \`getDBType()\` read the TypeORM config and always answered "postgres") and two helpers, \`mikroOrmContains\` / \`mikroOrmILike\`, used across task, tag, employee and candidate search.
- **Soft-deleted data leaking through raw Knex.** Raw Knex bypasses MikroORM's soft-delete filter. The public \`/stats/global\` counted deleted invoices, budget reports counted deleted time, timesheets didn't shrink when a log was deleted. Each read now has its \`whereNull('deletedAt')\`, with a spec recording the Knex calls.
- **Team scoping.** In the MikroORM branch of \`findTeamTasks\`, an employee got every team's tasks in the organization; it now applies the same \`CHANGE_SELECTED_EMPLOYEE\` rule as TypeORM, then the advanced filters on top.

### Permissions in a multi-tenant app

The most important fix is [#10495](https://github.com/ever-co/ever-gauzy/pull/10495). The tenant-aware base service automatically adds \`employeeId = <caller>\` for users without the right permission — but notifications use \`receiverEmployeeId\`, so the filter never applied and **any employee could read the whole tenant's notifications**. I added a receiver scope applied to \`findAll\`, \`paginate\`, \`countBy\` and \`findOne\`, including every branch of an \`OR\` condition, and a caller without an employee record now matches nothing. In the same area, mentions are now delivered to the mentioned person (they were stored with a \`NULL\` receiver), and a manager removing a team member actually deletes the row instead of returning 200 after deleting zero rows.

### Numbers that were simply wrong

- **Worked hours multiplied by slots.** Joining time slots made a log count once per slot: a 1-hour log split into six 10-minute slots counted as 6 hours.
- **Tag usage inflated by join fan-out.** Twenty-five \`LEFT JOIN\`s multiplied each counter by the others. A tag on 2 employees and 3 tasks showed 12 uses instead of 5. Fixed with \`COUNT(DISTINCT …)\` driven by one table of counters.
- **The 12-hour clock trap.** \`'YYYY-MM-DD hh:mm:ss'\` without AM/PM shifted times by 12 hours in three different places: monthly expense bounds ran noon to noon, and afternoon appointments were drawn at 2 a.m.
- **Recurring expenses** that didn't show in every month they applied to, a December deletion that restarted the expense in the wrong year, invoice PDFs ignoring the organization's currency position.

### Sorting and search, safely

Several tables showed sortable headers while the services ignored the order. I introduced \`parseSortOrder(order, sortableColumns)\`, an allowlist that keeps only known columns and \`ASC\`/\`DESC\`, applied in both ORM branches. Searching \`"John "\` (trailing space) produced \`LIKE '%%'\` and returned every row; \`splitKeywords()\` now drops empty terms at eight call sites. And a DTO helper was turning the search text \`"2024"\` into \`true\`.

### Desktop timer: multi-monitor screenshots

In the Electron timer, the active monitor was found by comparing only the cursor's **x** coordinate, so vertically stacked screens always resolved to the first one; on some Linux setups the active-only mode captured nothing at all. It now uses \`screen.getDisplayNearestPoint(cursor)\` and a strict rule: trust the filter only when it matched, otherwise capture exactly one display — never none, never all. I followed up with a setting to choose which display shows the screenshot notification.

## 2. SurfSense — privacy and reliability in a local AI app

**The project.** SurfSense (16k+ stars) is "the air-gapped, open-source NotebookLM alternative": a desktop app that answers questions over your documents with citations, edits Office and PDF files, and generates podcasts, mind maps or quizzes — **all on your machine**. Under the hood: Electron supervising a FastAPI API, Huey worker queues, llama.cpp, stable-diffusion.cpp, a single SQLite file with FTS5 and sqlite-vec. Network egress is off by default. The team works from architecture docs and ADRs; a PR that closes a documented gap deletes its line.

28 PRs, 25 merged (+5.3k / −0.7k lines), across the Python backend, the React frontend and the license portal.

### Model-written code out of \`exec()\`

[#2184](https://github.com/MODSetter/SurfSense/pull/2184) is the one I'm proudest of. Studio's PowerPoint and Excel generator ran Python **written by an LLM that had just read the user's untrusted documents** with \`exec()\`, inside the worker, with the worker's privileges — and its timeout couldn't stop a runaway thread. I routed it through the script runner Word and PDF already used: its own process, an empty folder, a single output path, an environment rebuilt without secrets, and on timeout or cancel the whole process tree is killed (job object on Windows, process group elsewhere). Tests start real child processes to prove a fake secret is invisible to the script and that an infinite loop dies at a 1-second limit. The maintainer's verdict: "it makes things strictly safer".

### Egress consent, even for hosts you didn't pick

A remote image endpoint can answer with a URL on some CDN, and SurfSense downloaded it — sending the user's IP to a host they never allowed. In [#2072](https://github.com/MODSetter/SurfSense/pull/2072) the image provider takes a **required** \`allow_url_host\` callback, awaited before any download, so no future call site can forget it. A refused host is recorded so it appears in *Settings › Network*, and the refusal is a 403 in the UI but a non-retryable error in the worker (retrying would pay the image again for the same refusal).

### A race between the worker and the user

While reviewing my own feature (notes and renames in the sources panel), I found that renaming a file during its ingestion silently reverted the name: the worker held an old copy of the row and wrote it all back. The fix ([#2148](https://github.com/MODSetter/SurfSense/pull/2148)) writes **only the columns the job produced**:

\`\`\`python
update(Document)
  .where(Document.id == doc_id, Document.status != CANCELLED)
  .values(status=..., error_message=..., **produced)
\`\`\`

The integration test commits an edit from a second session while the worker parses.

### Testing what couldn't be tested

The in-process ASGI transport can't simulate a client hanging up. I added a fixture serving the app on a real socket plus a stub model server that stalls — and it revealed a real bug: on disconnect, Starlette cancels the task that was saving the partial reply. I filed it, pinned it with a strict \`xfail\` and confirmed the cause with a shielded cancel scope; it was fixed the next day.

Also: sampling parameters from each model's publisher (Qwen3 at 0.6 when thinking), Anthropic with just an API key, revoking ChatGPT refresh tokens on sign-out (RFC 7009), Stripe refunds that suspended *every* licence of a customer, a screen-reader announcement when a reply finishes, and moving Studio state to TanStack Query so open viewers refresh too.

## 3. Memnox — guarding AI agents, one tool call at a time

**The project.** Memnox sits between AI coding agents (Claude Code, Codex, Cursor, Gemini CLI, Windsurf) and your machine, and rules on **every tool call before it runs**: allow, ask or deny — locally and deterministically, "no model ever decides". It installs agent hooks, an MCP proxy, PATH interceptors for git, docker, kubectl and friends, an egress proxy, and keeps an audit ledger and recovery milestones. TypeScript monorepo, 8,000+ tests, strict house rules (no \`any\`, 500-line file cap).

13 PRs, 11 merged. When your project's job is security, every bug is a bypass:

- **A line break slipped past deny rules.** Wildcards compiled to \`.*\` without the \`s\` flag, and \`.\` doesn't match \`\\n\` in JavaScript — so a multi-line shell command escaped a deny pattern. A one-flag fix; I treated it as a vulnerability and disclosed it privately first.
- **JSON-RPC batches bypassed the MCP firewall** ([#89](https://github.com/Memnox/memnox/pull/89)). An array has no \`method\`, so a \`tools/call\` inside a batch was forwarded with no verdict and no ledger row. Batches are now split and every call is ruled on, in order, so approval prompts reach you in the order they were sent. Review found that \`[[…]]\` nested batches still slipped through; a type guard now answers \`-32600 Invalid Request\`.
- **Requests from the server mistaken for results.** Client and server number their ids independently, and messages were matched by \`id\` alone — a server-initiated request could retire an open call and wipe the tool list. A response is now only a message with no \`method\` and a \`result\` or \`error\`.
- **Secrets.** Quoted passwords were masked only up to the first space, and session transcripts stored agent output in clear text. The transcript stream now goes through a redacting \`Transform\` — line by line (chunk boundaries split tokens), with one mask per stream (sharing one leaked part of a password in review).
- **A crash any local process could trigger** in the egress proxy (an unhandled rejection on \`%zz\` or an IPv6 authority), and \`shred\`, \`truncate\` or \`git stash drop\` that ran without a recovery milestone.

## 4. Expo and React Native — native bugs, one platform at a time

**The projects.** React Native (126k stars) renders native views from React; Expo (52k stars) is the framework and SDK built on it — native modules in Swift and Kotlin, the CLI, Router, EAS. Contributions go through maintainers and, at Expo, an automated bot that reproduces the bug and verifies the fix on emulators or real Windows VMs.

18 PRs; **4 merged in Expo**, the others in review. I'm keeping this distinction clear: none of my React Native PRs is merged yet.

- **expo-audio (Android).** \`prepareToRecordAsync()\` could hang forever: the binding timeout existed but was never started. The fix also had to make the continuation resume exactly once across two threads; the maintainer pointed out a remaining check-then-act race, and the final version takes and clears the continuation atomically.
- **expo-camera (web).** \`onCameraReady\` fired before the video element had a frame, so \`takePicture\` threw. It now waits for the stream to be attached and for real data — 25/25 passes on Chromium, Firefox and WebKit, versus 25/25 failures before.
- **expo-widgets.** An endless resolver loop (stack overflow) on Windows, because a Windows absolute path wasn't recognized as a file — confirmed on a Windows VM by the bot.
- **expo-cellular.** A crash when the SIM operator is an empty string: \`?.\` guards \`null\`, not \`""\`.
- **In review:** a 7200×7200 image crashing \`expo-image\`, SVG decoders reading whole videos into memory, iOS task-manager races; and in React Native a one-word iOS fix — \`unsignedIntValue\` truncating \`UIDataDetectorTypeAll\` to 32 bits — plus \`Symbol.toStringTag\` on \`Blob\` and \`File\` so libraries like axios recognize them.

## 5. SOS Academy — building features for a community

**The project.** Shinobi Open Source Academy connects aspiring developers with mentors and real open-source issues. Its platform is a NestJS + MongoDB API with Next.js apps (website, admin, blog, a portal for learners). Two milestones are in progress: **squads** pairing mentors with mentees, and a **hack platform** where learners claim real GitHub issues.

14 PRs; the Squad model is merged, the rest is open — two of them already approved. These are full features rather than bug fixes:

- **Squads.** Capacity is checked *inside* the update, so three concurrent joins to a squad of one produce exactly one success; "one active squad per mentee" is enforced by a partial unique index.
- **An issue lifecycle as a state machine.** One transition table, and each change is a compare-and-set:

\`\`\`ts
findOneAndUpdate(
  { _id: id, status: current },
  { $set: { status: next }, $push: { statusHistory: entry } },
)
\`\`\`

Five people claiming the same issue at once → exactly one wins. A sync job then follows each issue's linked pull request on GitHub and walks the graph (breadth-first) so even big jumps go through legal, recorded steps.
- **Auth.** \`/auth/refresh\` always failed (no cookie parser), and once fixed it revealed something subtle: bcrypt reads only the first 72 bytes, and a user's refresh tokens share their first 72 bytes — old tokens would have been accepted. Tokens are now hashed with SHA-256. User-management routes, including \`DELETE /users/:id\`, were open; they now require an admin or the user themselves.
- **Dependencies.** \`pnpm audit\` went from 232 advisories (5 critical) to 5 moderate, and the CI audit can now actually fail a build.

## What I took from it

- **Prove the bug first.** Almost every PR has a test that fails on \`main\` and passes with the fix. Maintainers merge faster when they don't have to trust you.
- **Say what you didn't do.** My PRs end with a "limits" section: untested on a device, out of scope, a case the fix doesn't cover. It saves a review round.
- **The interesting bugs live between two systems**: two ORMs, client and server ids, a worker and a user, a JS \`number\` and a 64-bit native flag.
- **Review is the job, not the obstacle.** Several of the best details above came from a maintainer's question.

If you're starting: pick a project you actually use, read its architecture docs and open issues, and send one small, well-tested PR. Then another.`,
    fr: `Ces dernières semaines, j'ai passé beaucoup de temps dans le code des autres. Pas pour colorier mon profil GitHub, mais parce que lire et corriger du code de production écrit par des inconnus est la façon la plus rapide que je connaisse de progresser.

Cet article avance projet par projet. Pour chacun : ce qu'est le projet, puis ce que j'ai réellement changé — le bug, sa cause, la correction. Et je dis clairement ce qui est mergé et ce qui attend encore une revue.

| Projet | Ce que c'est | Mes PR | Mergées |
|---|---|---|---|
| [Ever Gauzy](https://github.com/ever-co/ever-gauzy) | Plateforme open source de gestion d'entreprise (ERP/CRM/RH) | 53 | 53 |
| [SurfSense](https://github.com/MODSetter/SurfSense) | Alternative privée et locale à NotebookLM | 28 | 25 |
| [Memnox](https://github.com/Memnox/memnox) | Runtime qui statue sur chaque action des agents IA de code | 13 | 11 |
| [Expo](https://github.com/expo/expo) et [React Native](https://github.com/react/react-native) | Le framework React Native et son SDK | 18 | 4 |
| [SOS Academy](https://github.com/Shinobi-Open-Source-Academy/sos-academy-platform) | Plateforme de mentorat pour apprendre l'open source | 14 | 1 |

## 1. Ever Gauzy — faire dire la même vérité à deux ORM

**Le projet.** Ever Gauzy est une plateforme open source de gestion d'entreprise : ERP, CRM, RH, recrutement, gestion de projet, suivi du temps et de l'activité avec un timer desktop, facturation, dépenses, congés… C'est un grand monorepo Nx (8 000+ étoiles, AGPL-3.0) : une API NestJS, une app web Angular, des apps desktop Electron, environ 80 plugins. Une particularité conditionne tout : l'API tourne **soit sur TypeORM, soit sur MikroORM**, donc la plupart des services ont deux chemins de code — qui divergent.

J'y ai 53 PR mergées (+5,9k / −1,1k lignes), une en 2023 et 52 récemment. Presque toutes avec des specs Jest qui ciblent la branche ORM corrigée.

### Un audit systématique de parité TypeORM / MikroORM

Une vingtaine de PR viennent du même exercice : prendre une fonctionnalité, lire les deux branches, et trouver où celle de MikroORM dit autre chose.

- **Les opérateurs inconnus matchaient tout.** Lors de la traduction des opérateurs TypeORM vers MikroORM, \`LessThan\`, \`LessThanOrEqual\`, \`Like\` et \`ILike\` tombaient sur \`{}\` — ce que MikroORM lit comme *aucune condition*. Un filtre « montant maximum » sur les factures renvoyait toutes les factures. J'ai ajouté les traductions manquantes (\`$lt\`, \`$lte\`, \`$like\`, \`$ilike\`).
- **\`ILIKE\` n'existe ni sur MySQL ni sur SQLite.** MikroORM émet \`$ilike\` tel quel. J'ai ajouté \`isMikroOrmPostgres()\` (le \`getDBType()\` existant lisait la config TypeORM et répondait toujours « postgres ») et deux helpers, \`mikroOrmContains\` / \`mikroOrmILike\`, utilisés dans la recherche des tâches, tags, employés et candidats.
- **Des données supprimées qui fuyaient par Knex.** Knex brut contourne le filtre de suppression logique de MikroORM. Le \`/stats/global\` public comptait des factures supprimées, les rapports de budget du temps supprimé, et les feuilles de temps ne diminuaient pas quand on supprimait une entrée. Chaque lecture a maintenant son \`whereNull('deletedAt')\`, avec une spec qui enregistre les appels Knex.
- **Le périmètre des équipes.** Dans la branche MikroORM de \`findTeamTasks\`, un employé recevait les tâches de toutes les équipes de l'organisation ; elle applique désormais la même règle \`CHANGE_SELECTED_EMPLOYEE\` que TypeORM, puis les filtres avancés.

### Les permissions dans une application multi-tenant

La correction la plus importante est [#10495](https://github.com/ever-co/ever-gauzy/pull/10495). Le service de base ajoute automatiquement \`employeeId = <appelant>\` pour les utilisateurs sans la bonne permission — mais les notifications utilisent \`receiverEmployeeId\`, donc le filtre ne s'appliquait jamais et **n'importe quel employé pouvait lire toutes les notifications du tenant**. J'ai ajouté un périmètre « destinataire » appliqué à \`findAll\`, \`paginate\`, \`countBy\` et \`findOne\`, y compris dans chaque branche d'une condition \`OR\` ; un appelant sans fiche employé ne voit plus rien. Dans la même zone : les mentions arrivent enfin à la personne mentionnée (elles étaient enregistrées avec un destinataire \`NULL\`), et un manager qui retire un membre d'équipe le retire vraiment, au lieu de renvoyer 200 après avoir supprimé zéro ligne.

### Des chiffres tout simplement faux

- **Les heures travaillées multipliées par les créneaux.** La jointure avec les créneaux comptait une entrée une fois par créneau : une heure découpée en six créneaux de 10 minutes comptait pour 6 heures.
- **L'usage des tags gonflé par les jointures.** Vingt-cinq \`LEFT JOIN\` multipliaient chaque compteur par les autres : un tag posé sur 2 employés et 3 tâches affichait 12 usages au lieu de 5. Corrigé avec \`COUNT(DISTINCT …)\`, piloté par une seule table de compteurs.
- **Le piège de l'horloge 12 heures.** \`'YYYY-MM-DD hh:mm:ss'\` sans AM/PM décalait les heures de 12 h à trois endroits : les bornes mensuelles des dépenses allaient de midi à midi, et les rendez-vous de l'après-midi s'affichaient à 2 h du matin.
- **Les dépenses récurrentes** absentes de certains mois, une suppression en décembre qui relançait la dépense la mauvaise année, des PDF de facture qui ignoraient la position de la devise.

### Tri et recherche, en sécurité

Plusieurs tableaux affichaient des colonnes triables alors que les services ignoraient l'ordre demandé. J'ai introduit \`parseSortOrder(order, sortableColumns)\`, une liste blanche qui ne garde que les colonnes connues et \`ASC\`/\`DESC\`, appliquée dans les deux branches ORM. Chercher \`"John "\` (avec un espace) produisait \`LIKE '%%'\` et renvoyait toutes les lignes ; \`splitKeywords()\` ignore maintenant les termes vides à huit endroits. Et un helper de DTO transformait le texte recherché \`"2024"\` en \`true\`.

### Timer desktop : captures sur plusieurs écrans

Dans le timer Electron, l'écran actif était trouvé en comparant seulement la coordonnée **x** du curseur : des écrans empilés verticalement donnaient toujours le premier ; sur certaines configs Linux, le mode « écran actif » ne capturait rien du tout. Il utilise maintenant \`screen.getDisplayNearestPoint(cursor)\` et une règle stricte : ne faire confiance au filtre que s'il a trouvé quelque chose, sinon capturer exactement un écran — jamais aucun, jamais tous. J'ai ensuite ajouté un réglage pour choisir l'écran qui affiche la notification de capture.

## 2. SurfSense — confidentialité et fiabilité dans une app d'IA locale

**Le projet.** SurfSense (16k+ étoiles) se présente comme « l'alternative open source et hors ligne à NotebookLM » : une app desktop qui répond aux questions sur vos documents avec des citations, édite des fichiers Office et PDF, génère podcasts, cartes mentales ou quiz — **le tout sur votre machine**. Sous le capot : Electron qui supervise une API FastAPI, des files de jobs Huey, llama.cpp, stable-diffusion.cpp, un seul fichier SQLite avec FTS5 et sqlite-vec. Le trafic réseau sortant est coupé par défaut. L'équipe travaille à partir de docs d'architecture et d'ADR ; une PR qui comble un manque documenté supprime sa ligne.

28 PR, 25 mergées (+5,3k / −0,7k lignes), sur le backend Python, le frontend React et le portail de licences.

### Le code écrit par le modèle sort de \`exec()\`

[#2184](https://github.com/MODSetter/SurfSense/pull/2184) est celle dont je suis le plus fier. Le générateur PowerPoint et Excel de Studio exécutait avec \`exec()\` du Python **écrit par un LLM qui venait de lire les documents non fiables de l'utilisateur**, dans le worker, avec ses privilèges — et son timeout ne pouvait pas arrêter un thread emballé. Je l'ai fait passer par le lanceur de scripts que Word et PDF utilisaient déjà : son propre processus, un dossier vide, un seul chemin de sortie, un environnement reconstruit sans secrets, et en cas de timeout ou d'annulation, tout l'arbre de processus est tué (job object sous Windows, groupe de processus ailleurs). Les tests lancent de vrais processus enfants pour prouver qu'un faux secret est invisible pour le script et qu'une boucle infinie meurt à une limite d'une seconde. Le verdict du mainteneur : « c'est strictement plus sûr ».

### Le consentement réseau, même pour des hôtes qu'on n'a pas choisis

Un service d'images distant peut répondre avec une URL sur un CDN quelconque, et SurfSense la téléchargeait — envoyant l'IP de l'utilisateur vers un hôte qu'il n'avait jamais autorisé. Dans [#2072](https://github.com/MODSetter/SurfSense/pull/2072), le fournisseur d'images prend un callback \`allow_url_host\` **obligatoire**, attendu avant tout téléchargement : aucun futur appel ne peut l'oublier. Un hôte refusé est enregistré pour apparaître dans *Réglages › Réseau*, et le refus devient un 403 dans l'interface mais une erreur non rejouable dans le worker (rejouer paierait de nouveau l'image pour le même refus).

### Une course entre le worker et l'utilisateur

En relisant ma propre fonctionnalité (notes et renommage dans le panneau des sources), j'ai découvert que renommer un fichier pendant son import annulait silencieusement le nouveau nom : le worker gardait une vieille copie de la ligne et réécrivait tout. La correction ([#2148](https://github.com/MODSetter/SurfSense/pull/2148)) n'écrit **que les colonnes produites par le job** :

\`\`\`python
update(Document)
  .where(Document.id == doc_id, Document.status != CANCELLED)
  .values(status=..., error_message=..., **produced)
\`\`\`

Le test d'intégration valide une modification depuis une deuxième session pendant que le worker analyse le fichier.

### Tester ce qui ne pouvait pas l'être

Le transport ASGI en mémoire ne sait pas simuler un client qui raccroche. J'ai ajouté une fixture qui sert l'app sur un vrai socket, plus un faux serveur de modèle qui se bloque — et elle a révélé un vrai bug : à la déconnexion, Starlette annule la tâche qui enregistrait la réponse partielle. Je l'ai signalé, épinglé avec un \`xfail\` strict et confirmé la cause avec un « cancel scope » protégé ; il a été corrigé le lendemain.

Aussi : les paramètres d'échantillonnage recommandés par l'éditeur de chaque modèle (Qwen3 à 0,6 en mode réflexion), Anthropic avec une simple clé d'API, la révocation des tokens ChatGPT à la déconnexion (RFC 7009), des remboursements Stripe qui suspendaient *toutes* les licences d'un client, une annonce pour lecteur d'écran quand une réponse se termine, et l'état de Studio déplacé dans TanStack Query pour que les vues ouvertes se rafraîchissent aussi.

## 3. Memnox — surveiller les agents IA, une action à la fois

**Le projet.** Memnox se place entre les agents IA de code (Claude Code, Codex, Cursor, Gemini CLI, Windsurf) et votre machine, et statue sur **chaque appel d'outil avant qu'il s'exécute** : autoriser, demander ou refuser — localement et de façon déterministe, « aucun modèle ne décide ». Il installe des hooks dans les agents, un proxy MCP, des intercepteurs pour git, docker, kubectl et compagnie, un proxy réseau, et tient un journal d'audit et des points de restauration. Monorepo TypeScript, plus de 8 000 tests, des règles strictes (pas de \`any\`, 500 lignes maximum par fichier).

13 PR, 11 mergées. Quand le rôle d'un projet est la sécurité, chaque bug est un contournement :

- **Un saut de ligne passait sous les règles de refus.** Les jokers étaient compilés en \`.*\` sans le drapeau \`s\`, et en JavaScript \`.\` ne correspond pas à \`\\n\` — une commande shell sur plusieurs lignes échappait à une règle de refus. Une correction d'un caractère ; je l'ai traitée comme une vulnérabilité et signalée en privé d'abord.
- **Les lots JSON-RPC contournaient le pare-feu MCP** ([#89](https://github.com/Memnox/memnox/pull/89)). Un tableau n'a pas de \`method\`, donc un \`tools/call\` dans un lot passait sans verdict et sans trace dans le journal. Les lots sont maintenant découpés et chaque appel est jugé, dans l'ordre, pour que les demandes d'approbation arrivent dans l'ordre d'envoi. La revue a montré que des lots imbriqués \`[[…]]\` passaient encore ; une vérification de type répond désormais \`-32600 Invalid Request\`.
- **Des requêtes du serveur prises pour des résultats.** Client et serveur numérotent leurs ids indépendamment, et les messages étaient associés par \`id\` seulement — une requête lancée par le serveur pouvait clôturer un appel ouvert et effacer la liste des outils. Une réponse est maintenant uniquement un message sans \`method\` avec un \`result\` ou une \`error\`.
- **Les secrets.** Les mots de passe entre guillemets n'étaient masqués que jusqu'au premier espace, et les transcriptions de session stockaient la sortie de l'agent en clair. Le flux passe maintenant par un \`Transform\` qui masque — ligne par ligne (les découpages de chunks coupent les tokens), avec un masque par flux (en partager un seul laissait fuir un morceau de mot de passe, découvert en revue).
- **Un crash déclenchable par n'importe quel processus local** dans le proxy réseau (un rejet non géré sur \`%zz\` ou une adresse IPv6), et \`shred\`, \`truncate\` ou \`git stash drop\` qui s'exécutaient sans point de restauration.

## 4. Expo et React Native — des bugs natifs, plateforme par plateforme

**Les projets.** React Native (126k étoiles) affiche des vues natives à partir de React ; Expo (52k étoiles) est le framework et le SDK construits dessus — modules natifs en Swift et Kotlin, CLI, Router, EAS. Les contributions passent par les mainteneurs et, chez Expo, par un bot qui reproduit le bug et vérifie la correction sur émulateurs ou sur de vraies machines Windows.

18 PR ; **4 mergées dans Expo**, les autres en revue. Je tiens à cette nuance : aucune de mes PR React Native n'est encore mergée.

- **expo-audio (Android).** \`prepareToRecordAsync()\` pouvait attendre indéfiniment : le timeout de connexion au service existait mais n'était jamais lancé. Il fallait aussi que la continuation reprenne une seule fois entre deux threads ; le mainteneur a pointé une course « vérifier puis agir » restante, et la version finale prend et vide la continuation de façon atomique.
- **expo-camera (web).** \`onCameraReady\` se déclenchait avant que la vidéo ait une image, donc \`takePicture\` échouait. Il attend maintenant que le flux soit attaché et que des données arrivent — 25/25 réussites sur Chromium, Firefox et WebKit, contre 25/25 échecs avant.
- **expo-widgets.** Une boucle infinie du résolveur (dépassement de pile) sous Windows, parce qu'un chemin absolu Windows n'était pas reconnu comme un fichier — confirmé par le bot sur une VM Windows.
- **expo-cellular.** Un crash quand l'opérateur de la SIM est une chaîne vide : \`?.\` protège de \`null\`, pas de \`""\`.
- **En revue :** une image 7200×7200 qui fait planter \`expo-image\`, des décodeurs SVG qui chargeaient des vidéos entières en mémoire, des courses dans le task-manager iOS ; et dans React Native une correction iOS d'un seul mot — \`unsignedIntValue\` tronquait \`UIDataDetectorTypeAll\` à 32 bits — ainsi que \`Symbol.toStringTag\` sur \`Blob\` et \`File\` pour que des librairies comme axios les reconnaissent.

## 5. SOS Academy — construire des fonctionnalités pour une communauté

**Le projet.** Shinobi Open Source Academy met en relation des développeurs qui débutent avec des mentors et de vrais tickets open source. Sa plateforme : une API NestJS + MongoDB et des apps Next.js (site, admin, blog, portail des apprenants). Deux chantiers sont en cours : les **squads**, qui associent mentors et apprenants, et une **plateforme de hack** où les apprenants prennent en charge de vrais tickets GitHub.

14 PR ; le modèle Squad est mergé, le reste est ouvert — dont deux déjà approuvées. Ici ce sont des fonctionnalités complètes plutôt que des correctifs :

- **Squads.** La capacité est vérifiée *dans* la mise à jour elle-même : trois inscriptions simultanées dans une squad d'une place donnent exactement un succès ; « une seule squad active par apprenant » est garanti par un index unique partiel.
- **Le cycle de vie d'un ticket en machine à états.** Une seule table de transitions, et chaque changement est un compare-and-set :

\`\`\`ts
findOneAndUpdate(
  { _id: id, status: current },
  { $set: { status: next }, $push: { statusHistory: entry } },
)
\`\`\`

Cinq personnes qui prennent le même ticket au même moment → une seule gagne. Un job de synchronisation suit ensuite la pull request liée à chaque ticket sur GitHub et parcourt le graphe (en largeur) pour que même les grands sauts passent par des étapes légales et enregistrées.
- **Authentification.** \`/auth/refresh\` échouait toujours (pas de parseur de cookies) ; une fois corrigé, il a révélé un problème subtil : bcrypt ne lit que les 72 premiers octets, et les tokens de rafraîchissement d'un même utilisateur partagent leurs 72 premiers octets — d'anciens tokens auraient été acceptés. Ils sont maintenant hachés en SHA-256. Les routes de gestion des utilisateurs, dont \`DELETE /users/:id\`, étaient ouvertes ; elles exigent maintenant un admin ou l'utilisateur lui-même.
- **Dépendances.** \`pnpm audit\` est passé de 232 alertes (dont 5 critiques) à 5 modérées, et l'audit en CI peut désormais vraiment bloquer un build.

## Ce que j'en retiens

- **Prouver le bug d'abord.** Presque chaque PR contient un test qui échoue sur \`main\` et passe avec la correction. Les mainteneurs mergent plus vite quand ils n'ont pas à vous croire sur parole.
- **Dire ce qu'on n'a pas fait.** Mes PR finissent par une section « limites » : pas testé sur un appareil, hors périmètre, un cas que la correction ne couvre pas. Ça économise un tour de revue.
- **Les bugs intéressants vivent entre deux systèmes** : deux ORM, les ids du client et du serveur, un worker et un utilisateur, un \`number\` JavaScript et un drapeau natif 64 bits.
- **La revue fait partie du travail, ce n'est pas un obstacle.** Plusieurs des meilleurs détails ci-dessus sont venus d'une question d'un mainteneur.

Si vous débutez : choisissez un projet que vous utilisez vraiment, lisez sa documentation d'architecture et ses tickets ouverts, et envoyez une petite PR bien testée. Puis une autre.`,
  },
};
