export const codeToBusiness = {
  slug: 'from-code-to-business',
  cover: '/images/Projects/hela/02.jpg',
  tags: ['Career', 'Business', 'SaaS', 'Freelance', 'Entrepreneurship'],
  daysAgo: 0,
  title: {
    en: 'From Code to Business: Turning Programming Skills into Profitable Ventures',
    fr: 'Du code au business : transformer ses compétences en programmation en activités rentables',
    es: 'Del código al negocio: convertir las habilidades de programación en proyectos rentables',
  },
  excerpt: {
    en: 'I started coding for the love of it, with apps nobody ever used. Then I learned that the same passion could pay, that real problems beat cool ideas, and that reputation has to be earned inside companies before you can sell on your own. The whole path, step by step.',
    fr: 'J’ai commencé à coder par passion, avec des applications que personne n’utilisait. Puis j’ai appris que cette passion pouvait payer, que les vrais problèmes valent mieux que les belles idées, et que la notoriété se gagne d’abord en entreprise avant de vendre seul. Tout le parcours, étape par étape.',
    es: 'Empecé a programar por pasión, con aplicaciones que nadie usaba. Luego aprendí que esa misma pasión podía pagar, que los problemas reales valen más que las ideas bonitas, y que la reputación se gana dentro de las empresas antes de poder vender por cuenta propia. Todo el camino, paso a paso.',
  },
  content: {
    en: `I did not start programming to make money. I started because making a computer do what I had imagined felt like magic, and I wanted more of that feeling. My first programs had exactly one user: me. Most of them never left my laptop.

Today I build and sell management software to shops, schools, clinics and transport companies, while working as a full-stack engineer on open-source business platforms. Between those two points there is no shortcut, only a sequence of lessons. This article is that sequence, in the order I learned it.

## 1. Code for the love of it

The passion phase is not wasted time. It is where the fundamentals come from.

When nobody is paying you, you can afford to be curious. I rebuilt things that already existed just to understand them. I tried languages I would never use at work. I spent evenings on side projects with no deadline and no specification. That freedom taught me how to learn, which is the only skill that has never gone out of date.

But there is a trap in that phase, and I fell into it for a while: the apps stayed on my computer. They were exercises, not products. They solved my curiosity, not anyone’s problem.

## 2. The day I learned that passion could pay

The turning point was not a business plan. It was my first paid work, in December 2018, for **Buku My Class**, an application that let secondary school students read their class notes from anywhere.

For the first time, code I wrote was used by people I would never meet, and someone paid for it. That changed how I saw the craft. Programming was not only something I loved. It was something other people needed and were willing to pay for.

That realisation led to a simple decision: I would stop building apps that stayed on my laptop, and start thinking about the real problems of real people.

## 3. Real problems, not cool ideas

So I built apps for other people. Tools to manage small things, prototypes for ideas I believed in, early versions of products I still work on today.

They were better than my passion projects, because they started from a problem rather than from a technology. But they hit a wall I had not anticipated: **nobody knew me**.

A good application built by an unknown developer is still an application nobody downloads. Businesses do not hand their sales data, their student records or their invoices to someone with no track record, however clean the code is. I had the skills. I did not have the reputation, the trust, or the distribution.

## 4. Working inside companies that already solved problems

I made a pragmatic choice. Instead of fighting for notoriety alone, I went to work for companies that could already do what I could not: reach users, earn their trust, and solve their problems at scale. They needed expertise. I needed to learn how a real solution gets delivered and paid for. It was a fair exchange.

Each company taught me a different domain and a different part of the business of software:

- **Buku My Class** (2018 to 2021): education. How students actually use a product, and how far a good idea is from a finished one.
- **One Stop Center** (2021 to 2022): parcel tracking shared across the agencies of a transport company, in Angular. My first contact with logistics and with multi-branch operations.
- **Attendacy at KADEA Academy** (2022): student attendance for a coding school. Small scope, real users, daily feedback.
- **CRES** (2022 to 2023): a start-up and research centre building business management tools and AI solutions, in Nest.js and Next.js. Where I learned to structure a backend that several products depend on.
- **AdminAtete** (2023): document archiving for a Belgian tech start-up. Compliance, search, and the value of boring, reliable features.
- **Cobiz at Upperz** (2023): lead backend developer on a sales, stock, customer and invoicing management application. The closest thing to running a business I had seen from inside the code.
- **Ever Technologies** (since November 2023): Ever Gauzy, an open-source ERP, CRM and HRM platform, and Ever Teams, an open-source work and project management platform. Large codebases, open collaboration, and clients all over the world.

![Ever Gauzy, the open-source ERP and CRM platform I work on at Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Look at that list as a curriculum rather than a résumé. Education, logistics, attendance, archiving, sales and stock, invoicing, ERP, CRM. These companies paid me for my expertise, and in return I learned how businesses really work: how they onboard a client, how they handle support, how they bill, what happens when the system is down for an hour.

That is the knowledge I was missing when my apps stayed on my laptop. No tutorial teaches it. You get it by shipping for people who pay.

## 5. Doing what those companies did, on my own

Once I understood how those companies solved problems, I could do the same thing myself. Not by copying their products, but by applying their method to problems I kept meeting: start from a real need, build only what is needed, deliver it with support, and charge for the value.

Almost every product I run today descends directly from something I learned inside a company:

Cobiz, AdminAtete and Ever Gauzy taught me how companies sell, track stock, follow up customers, invoice and pay staff. That became **Hela**: one place to run several businesses at once, whether a shop, a restaurant, a bar or a hotel.

![Cobiz: sales, stock, customers and invoices in one app](/images/Projects/cobiz.jpg)

![Hela: one dashboard to run several businesses at once](/images/Projects/hela/01.jpg)

One Stop Center taught me how transport agencies share information between branches. That became **Safirisha**, an all-in-one platform for inter-city transport companies: parcels, trips, fleets and drivers, and **Twende Kivu**, an online ticketing platform.

![Safirisha: parcels, trips, fleets and drivers for inter-city transport companies](/images/Projects/safirisha/01.jpg)

Buku and Attendacy taught me how schools work day to day. That became **Masomo**, school software designed to keep working when the network stops, because the schools I serve cannot depend on a stable connection.

![Masomo: school software that keeps working when the network stops](/images/Projects/masomo-cd/01.jpg)

The same pattern produced **Afia**, a medical record platform for patients and healthcare providers, and **HIÜRD**, a local services marketplace with secure payments.

None of these started as a brilliant idea. Each one started as a problem I had already seen solved, badly or well, from inside a company.

## 6. What changed in how I build

Working for businesses changed my habits as a developer. The ones that matter most:

**Sell the outcome, not the stack.** Nobody buys “Next.js, Nest.js and PostgreSQL”. A shop owner buys *“I know what I sold today, in dollars and in local currency, even when the internet was down.”* The two features clients ask about first are a dual-currency till and an offline mode. Neither is glamorous. Both decide whether someone trusts the software with their money. I now write the landing page before the code; if I cannot explain the result in one sentence to a cashier, I do not have a product yet.

**Price like a business.** My first contracts were hourly, and I undercharged. Now it is a project price for the initial build, then a monthly subscription for hosting, support and updates. Recurring revenue is predictable, and it forces me to keep the product alive instead of moving on after delivery. Because Hela, Safirisha and Masomo are multi-tenant, a new client costs almost nothing extra to serve: one codebase, many companies, one monthly invoice each. Architecture decisions are pricing decisions.

**Do the boring work.** Code is maybe forty percent of the job. The rest is contracts and invoices, backups and monitoring, a support group per client, onboarding documents, training sessions for cashiers and secretaries, and saying no to features only one client wants. I automate deployments, monitoring and backups. I never automate the first week with a new client. That week is where trust is built, and trust is what gets renewed every month.

## 7. Reputation, finally

Remember the wall from step three: nobody knew me. Working on Ever Gauzy and Ever Teams, two large public monorepos, solved that in a way I had not planned.

![Ever Teams, the open-source work and project management platform](/images/Projects/ever-teams/01.jpg)

- **Credibility.** A prospect does not have to take my word for it. They can read my commits.
- **Reusable architecture.** Multi-tenancy, time tracking, invoicing, role-based access: patterns I had already built once, in production, with code review.
- **A network.** Clients on freelance platforms and elsewhere found me because they could see real work, not a résumé.

Open source gave me the notoriety I could not buy at the start. It is the cheapest marketing a developer can do, paid in commits.

## 8. The loop

I still ship code every day at Ever Technologies. The job pays the bills while the products grow, and the products keep me close to real users, which makes me a better engineer at work. Passion gave me the skills, companies gave me the expertise and the reputation, and the products give me back the passion. The loop closes.

Many developers quit too early, build in isolation for a year, and run out of money before they run out of ideas. Let the products ask you to leave. Until they do, keep your job and keep your evenings.

## What I would tell the developer I was

1. Code for the love of it, but notice when your apps stay on your laptop. That is the signal to change.
2. The first time someone pays for your code, pay attention. It means the problem was real.
3. Chase real problems, not cool ideas.
4. If nobody knows you, go where the users already are. Let companies pay for your expertise while you learn how they deliver.
5. Then do what they did, on your own, on the problems you keep meeting.
6. Sell outcomes, charge monthly, do the boring work, build in public.

The gap between code and business is not a diploma or a round of funding. It is the patience to turn a passion into expertise, expertise into reputation, and reputation into solutions that people are glad to pay for, month after month.`,
    fr: `Je n’ai pas commencé à programmer pour gagner de l’argent. J’ai commencé parce que faire exécuter à un ordinateur ce que j’avais imaginé ressemblait à de la magie, et que je voulais revivre cette sensation. Mes premiers programmes avaient exactement un utilisateur : moi. La plupart n’ont jamais quitté mon ordinateur.

Aujourd’hui, je conçois et vends des logiciels de gestion à des commerces, des écoles, des cliniques et des entreprises de transport, tout en travaillant comme ingénieur full-stack sur des plateformes de gestion open source. Entre ces deux points, il n’y a pas de raccourci, seulement une suite de leçons. Cet article, c’est cette suite, dans l’ordre où je l’ai apprise.

## 1. Coder par passion

La phase passion n’est pas du temps perdu. C’est là que viennent les fondamentaux.

Quand personne ne vous paie, vous pouvez vous permettre d’être curieux. J’ai reconstruit des choses qui existaient déjà, juste pour les comprendre. J’ai essayé des langages que je n’utiliserais jamais au travail. J’ai passé des soirées sur des projets sans délai et sans cahier des charges. Cette liberté m’a appris à apprendre, la seule compétence qui n’a jamais pris une ride.

Mais il y a un piège dans cette phase, et j’y suis resté un moment : les applications restaient dans mon ordinateur. C’étaient des exercices, pas des produits. Elles répondaient à ma curiosité, pas au problème de quelqu’un.

## 2. Le jour où j’ai appris que la passion pouvait payer

Le déclic n’a pas été un business plan. C’est mon premier travail rémunéré, en décembre 2018, pour **Buku My Class**, une application qui permettait aux élèves du secondaire de lire leurs notes de cours depuis n’importe où.

Pour la première fois, du code que j’avais écrit était utilisé par des gens que je ne rencontrerais jamais, et quelqu’un payait pour ça. Ça a changé ma façon de voir le métier. Programmer n’était pas seulement quelque chose que j’aimais. C’était quelque chose dont d’autres avaient besoin et pour lequel ils étaient prêts à payer.

Cette prise de conscience a mené à une décision simple : arrêter de construire des applications qui restaient dans mon ordinateur, et commencer à penser aux vrais problèmes des vraies personnes.

## 3. Les vrais problèmes, pas les belles idées

Alors j’ai développé des applications pour les autres. Des outils pour gérer de petites choses, des prototypes d’idées auxquelles je croyais, les premières versions de produits sur lesquels je travaille encore aujourd’hui.

Elles étaient meilleures que mes projets passion, parce qu’elles partaient d’un problème et non d’une technologie. Mais elles ont heurté un mur que je n’avais pas anticipé : **personne ne me connaissait**.

Une bonne application développée par un inconnu reste une application que personne ne télécharge. Les entreprises ne confient pas leurs données de vente, leurs dossiers d’élèves ou leurs factures à quelqu’un sans références, aussi propre que soit le code. J’avais les compétences. Je n’avais ni la notoriété, ni la confiance, ni la distribution.

## 4. Travailler dans des entreprises qui résolvaient déjà des problèmes

J’ai fait un choix pragmatique. Plutôt que de me battre seul pour la notoriété, je suis allé travailler pour des entreprises qui savaient déjà faire ce que je ne savais pas faire : atteindre des utilisateurs, gagner leur confiance et résoudre leurs problèmes à grande échelle. Elles avaient besoin d’expertise. J’avais besoin d’apprendre comment une vraie solution se livre et se fait payer. C’était un échange équitable.

Chaque entreprise m’a appris un métier différent et une partie différente du business du logiciel :

- **Buku My Class** (2018 à 2021) : l’éducation. Comment les élèves utilisent vraiment un produit, et la distance entre une bonne idée et un produit fini.
- **One Stop Center** (2021 à 2022) : le suivi des colis partagé entre les agences d’une entreprise de transport, en Angular. Mon premier contact avec la logistique et les opérations multi-agences.
- **Attendacy à KADEA Academy** (2022) : la gestion des présences d’une école de code. Petit périmètre, vrais utilisateurs, retours quotidiens.
- **CRES** (2022 à 2023) : une start-up et un centre de recherche qui construit des outils de gestion d’entreprise et des solutions d’IA, en Nest.js et Next.js. Là où j’ai appris à structurer un backend dont plusieurs produits dépendent.
- **AdminAtete** (2023) : l’archivage de documents pour une start-up technologique belge. La conformité, la recherche, et la valeur des fonctionnalités ennuyeuses mais fiables.
- **Cobiz chez Upperz** (2023) : développeur backend principal d’une application de gestion des ventes, du stock, des clients et des factures. Ce qui ressemble le plus à la gestion d’une entreprise, vue depuis le code.
- **Ever Technologies** (depuis novembre 2023) : Ever Gauzy, une plateforme open source d’ERP, CRM et GRH, et Ever Teams, une plateforme open source de gestion du travail et des projets. De grandes bases de code, une collaboration ouverte, et des clients dans le monde entier.

![Ever Gauzy, la plateforme open source d’ERP et de CRM sur laquelle je travaille chez Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Regardez cette liste comme un programme de formation plutôt qu’un CV. Éducation, logistique, présences, archivage, ventes et stock, facturation, ERP, CRM. Ces entreprises m’ont payé pour mon expertise, et en retour j’ai appris comment les entreprises fonctionnent vraiment : comment elles accueillent un client, comment elles gèrent le support, comment elles facturent, ce qui se passe quand le système est en panne pendant une heure.

C’est la connaissance qui me manquait quand mes applications restaient dans mon ordinateur. Aucun tutoriel ne l’enseigne. On l’acquiert en livrant pour des gens qui paient.

## 5. Faire ce que ces entreprises faisaient, par moi-même

Une fois que j’ai compris comment ces entreprises résolvaient des problèmes, j’ai pu faire la même chose moi-même. Pas en copiant leurs produits, mais en appliquant leur méthode aux problèmes que je rencontrais sans cesse : partir d’un vrai besoin, construire seulement ce qui est nécessaire, livrer avec du support, et facturer la valeur.

Presque tous les produits que je fais tourner aujourd’hui descendent directement de quelque chose appris en entreprise :

Cobiz, AdminAtete et Ever Gauzy m’ont appris comment les entreprises vendent, suivent leur stock, suivent leurs clients, facturent et paient leur personnel. C’est devenu **Hela** : un seul endroit pour gérer plusieurs commerces à la fois, qu’il s’agisse d’une boutique, d’un restaurant, d’un bar ou d’un hôtel.

![Cobiz : ventes, stock, clients et factures dans une seule application](/images/Projects/cobiz.jpg)

![Hela : un seul tableau de bord pour gérer plusieurs commerces à la fois](/images/Projects/hela/01.jpg)

One Stop Center m’a appris comment les agences de transport partagent l’information entre leurs antennes. C’est devenu **Safirisha**, une plateforme tout-en-un pour les entreprises de transport inter-villes : colis, voyages, flottes et chauffeurs, et **Twende Kivu**, une plateforme de billetterie en ligne.

![Safirisha : colis, voyages, flottes et chauffeurs pour les entreprises de transport inter-villes](/images/Projects/safirisha/01.jpg)

Buku et Attendacy m’ont appris comment une école fonctionne au quotidien. C’est devenu **Masomo**, un logiciel scolaire conçu pour continuer à fonctionner quand le réseau s’arrête, parce que les écoles que je sers ne peuvent pas compter sur une connexion stable.

![Masomo : le logiciel scolaire qui continue de fonctionner quand le réseau s’arrête](/images/Projects/masomo-cd/01.jpg)

Le même schéma a produit **Afia**, une plateforme de dossiers médicaux pour les patients et les professionnels de santé, et **HIÜRD**, une place de marché de services locaux avec paiements sécurisés.

Aucun de ces produits n’a commencé comme une idée brillante. Chacun a commencé comme un problème que j’avais déjà vu résolu, bien ou mal, de l’intérieur d’une entreprise.

## 6. Ce qui a changé dans ma façon de construire

Travailler pour des entreprises a changé mes habitudes de développeur. Celles qui comptent le plus :

**Vendre le résultat, pas la stack.** Personne n’achète « Next.js, Nest.js et PostgreSQL ». Un commerçant achète : *« Je sais ce que j’ai vendu aujourd’hui, en dollars et en monnaie locale, même quand l’internet était coupé. »* Les deux fonctionnalités que les clients demandent en premier sont une caisse à deux devises et un mode hors ligne. Aucune n’est prestigieuse. Les deux décident si quelqu’un confie son argent au logiciel. J’écris maintenant la page de présentation avant le code ; si je n’arrive pas à expliquer le résultat en une phrase à une caissière, je n’ai pas encore de produit.

**Fixer ses prix comme une entreprise.** Mes premiers contrats étaient à l’heure, et je me sous-facturais. Aujourd’hui, c’est un prix de projet pour la construction initiale, puis un abonnement mensuel pour l’hébergement, le support et les mises à jour. Le revenu récurrent est prévisible, et il m’oblige à garder le produit vivant au lieu de passer à autre chose après la livraison. Parce que Hela, Safirisha et Masomo sont multi-tenant, un nouveau client ne coûte presque rien de plus à servir : une seule base de code, plusieurs entreprises, une facture mensuelle chacune. Les décisions d’architecture sont des décisions de prix.

**Faire le travail ennuyeux.** Le code représente peut-être quarante pour cent du travail. Le reste, ce sont les contrats et les factures, les sauvegardes et la supervision, un groupe de support par client, les documents d’accueil, les formations pour les caissiers et les secrétaires, et dire non aux fonctionnalités qu’un seul client réclame. J’automatise les déploiements, la supervision et les sauvegardes. Je n’automatise jamais la première semaine avec un nouveau client. C’est là que la confiance se construit, et c’est la confiance qui se renouvelle chaque mois.

## 7. La notoriété, enfin

Souvenez-vous du mur de l’étape trois : personne ne me connaissait. Travailler sur Ever Gauzy et Ever Teams, deux grands monorepos publics, a réglé ce problème d’une façon que je n’avais pas planifiée.

![Ever Teams, la plateforme open source de gestion du travail et des projets](/images/Projects/ever-teams/01.jpg)

- **De la crédibilité.** Un prospect n’a pas à me croire sur parole. Il peut lire mes commits.
- **Une architecture réutilisable.** Multi-tenant, suivi du temps, facturation, gestion des rôles : des patterns que j’avais déjà construits une fois, en production, avec revue de code.
- **Un réseau.** Des clients sur les plateformes freelance et ailleurs m’ont trouvé parce qu’ils pouvaient voir du vrai travail, pas un CV.

L’open source m’a donné la notoriété que je ne pouvais pas acheter au départ. C’est le marketing le moins cher qu’un développeur puisse faire, payé en commits.

## 8. La boucle

Je livre encore du code tous les jours chez Ever Technologies. L’emploi paie les factures pendant que les produits grandissent, et les produits me gardent près de vrais utilisateurs, ce qui fait de moi un meilleur ingénieur au travail. La passion m’a donné les compétences, les entreprises m’ont donné l’expertise et la notoriété, et les produits me rendent la passion. La boucle se referme.

Beaucoup de développeurs démissionnent trop tôt, construisent seuls pendant un an, et se retrouvent à court d’argent avant d’être à court d’idées. Laissez les produits vous demander de partir. En attendant, gardez votre emploi et gardez vos soirées.

## Ce que je dirais au développeur que j’étais

1. Codez par passion, mais remarquez le moment où vos applications restent dans votre ordinateur. C’est le signal qu’il faut changer.
2. La première fois que quelqu’un paie pour votre code, faites attention. Ça veut dire que le problème était réel.
3. Poursuivez les vrais problèmes, pas les belles idées.
4. Si personne ne vous connaît, allez là où les utilisateurs sont déjà. Laissez les entreprises payer pour votre expertise pendant que vous apprenez comment elles livrent.
5. Ensuite, faites ce qu’elles faisaient, par vous-même, sur les problèmes que vous rencontrez sans cesse.
6. Vendez des résultats, facturez au mois, faites le travail ennuyeux, construisez en public.

L’écart entre le code et le business, ce n’est ni un diplôme ni une levée de fonds. C’est la patience de transformer une passion en expertise, l’expertise en notoriété, et la notoriété en solutions que les gens sont contents de payer, mois après mois.`,
    es: `No empecé a programar para ganar dinero. Empecé porque hacer que un ordenador ejecutara lo que yo había imaginado parecía magia, y quería más de esa sensación. Mis primeros programas tenían exactamente un usuario: yo. La mayoría nunca salió de mi portátil.

Hoy construyo y vendo software de gestión a comercios, escuelas, clínicas y empresas de transporte, mientras trabajo como ingeniero full-stack en plataformas de gestión open source. Entre esos dos puntos no hay atajo, solo una secuencia de lecciones. Este artículo es esa secuencia, en el orden en que la aprendí.

## 1. Programar por amor al arte

La fase de la pasión no es tiempo perdido. De ahí vienen los fundamentos.

Cuando nadie te paga, puedes permitirte ser curioso. Reconstruí cosas que ya existían solo para entenderlas. Probé lenguajes que nunca usaría en el trabajo. Pasé noches en proyectos paralelos sin plazo ni especificación. Esa libertad me enseñó a aprender, la única habilidad que nunca ha pasado de moda.

Pero hay una trampa en esa fase, y caí en ella durante un tiempo: las aplicaciones se quedaban en mi ordenador. Eran ejercicios, no productos. Resolvían mi curiosidad, no el problema de nadie.

## 2. El día que aprendí que la pasión podía pagar

El punto de inflexión no fue un plan de negocio. Fue mi primer trabajo pagado, en diciembre de 2018, para **Buku My Class**, una aplicación que permitía a los estudiantes de secundaria leer sus apuntes de clase desde cualquier lugar.

Por primera vez, código que yo había escrito lo usaban personas a las que nunca conocería, y alguien pagaba por ello. Eso cambió mi forma de ver el oficio. Programar no era solo algo que me gustaba. Era algo que otras personas necesitaban y por lo que estaban dispuestas a pagar.

Esa constatación llevó a una decisión sencilla: dejaría de construir aplicaciones que se quedaban en mi portátil, y empezaría a pensar en los problemas reales de personas reales.

## 3. Problemas reales, no ideas bonitas

Así que construí aplicaciones para otras personas. Herramientas para gestionar cosas pequeñas, prototipos de ideas en las que creía, primeras versiones de productos en los que todavía trabajo hoy.

Eran mejores que mis proyectos por pasión, porque partían de un problema y no de una tecnología. Pero chocaron contra un muro que no había previsto: **nadie me conocía**.

Una buena aplicación construida por un desarrollador desconocido sigue siendo una aplicación que nadie descarga. Las empresas no entregan sus datos de ventas, sus expedientes de alumnos o sus facturas a alguien sin trayectoria, por limpio que sea el código. Tenía las habilidades. No tenía la reputación, la confianza ni la distribución.

## 4. Trabajar dentro de empresas que ya resolvían problemas

Tomé una decisión pragmática. En lugar de pelear solo por la notoriedad, fui a trabajar para empresas que ya sabían hacer lo que yo no podía: llegar a los usuarios, ganarse su confianza y resolver sus problemas a escala. Ellas necesitaban experiencia técnica. Yo necesitaba aprender cómo se entrega y se cobra una solución real. Era un intercambio justo.

Cada empresa me enseñó un sector distinto y una parte distinta del negocio del software:

- **Buku My Class** (2018 a 2021): educación. Cómo usan realmente los estudiantes un producto, y lo lejos que está una buena idea de un producto terminado.
- **One Stop Center** (2021 a 2022): seguimiento de paquetes compartido entre las agencias de una empresa de transporte, en Angular. Mi primer contacto con la logística y las operaciones multisede.
- **Attendacy en KADEA Academy** (2022): control de asistencia para una escuela de programación. Alcance pequeño, usuarios reales, feedback diario.
- **CRES** (2022 a 2023): una start-up y centro de investigación que construye herramientas de gestión empresarial y soluciones de IA, con Nest.js y Next.js. Donde aprendí a estructurar un backend del que dependen varios productos.
- **AdminAtete** (2023): archivo de documentos para una start-up tecnológica belga. Cumplimiento normativo, búsqueda y el valor de las funciones aburridas pero fiables.
- **Cobiz en Upperz** (2023): desarrollador backend principal de una aplicación de gestión de ventas, inventario, clientes y facturación. Lo más parecido a dirigir un negocio que había visto desde dentro del código.
- **Ever Technologies** (desde noviembre de 2023): Ever Gauzy, una plataforma open source de ERP, CRM y RR. HH., y Ever Teams, una plataforma open source de gestión del trabajo y de proyectos. Bases de código grandes, colaboración abierta y clientes en todo el mundo.

![Ever Gauzy, la plataforma open source de ERP y CRM en la que trabajo en Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Mire esa lista como un plan de estudios y no como un currículum. Educación, logística, asistencia, archivo, ventas e inventario, facturación, ERP, CRM. Esas empresas me pagaron por mi experiencia, y a cambio aprendí cómo funcionan realmente los negocios: cómo incorporan a un cliente, cómo gestionan el soporte, cómo facturan, qué pasa cuando el sistema se cae durante una hora.

Ese es el conocimiento que me faltaba cuando mis aplicaciones se quedaban en mi portátil. Ningún tutorial lo enseña. Se consigue entregando para gente que paga.

## 5. Hacer lo que hacían esas empresas, por mi cuenta

Una vez que entendí cómo esas empresas resolvían problemas, pude hacer lo mismo por mi cuenta. No copiando sus productos, sino aplicando su método a los problemas con los que me seguía encontrando: partir de una necesidad real, construir solo lo necesario, entregarlo con soporte y cobrar por el valor.

Casi todos los productos que gestiono hoy descienden directamente de algo que aprendí dentro de una empresa:

Cobiz, AdminAtete y Ever Gauzy me enseñaron cómo las empresas venden, controlan el inventario, hacen seguimiento de sus clientes, facturan y pagan al personal. Eso se convirtió en **Hela**: un solo lugar para gestionar varios negocios a la vez, ya sea una tienda, un restaurante, un bar o un hotel.

![Cobiz: ventas, inventario, clientes y facturas en una sola aplicación](/images/Projects/cobiz.jpg)

![Hela: un solo panel para gestionar varios negocios a la vez](/images/Projects/hela/01.jpg)

One Stop Center me enseñó cómo las agencias de transporte comparten información entre sedes. Eso se convirtió en **Safirisha**, una plataforma todo en uno para empresas de transporte interurbano: paquetes, viajes, flotas y conductores, y en **Twende Kivu**, una plataforma de venta de billetes en línea.

![Safirisha: paquetes, viajes, flotas y conductores para empresas de transporte interurbano](/images/Projects/safirisha/01.jpg)

Buku y Attendacy me enseñaron cómo funciona una escuela día a día. Eso se convirtió en **Masomo**, un software escolar diseñado para seguir funcionando cuando la red se cae, porque las escuelas a las que sirvo no pueden depender de una conexión estable.

![Masomo: software escolar que sigue funcionando cuando la red se cae](/images/Projects/masomo-cd/01.jpg)

El mismo patrón produjo **Afia**, una plataforma de historiales médicos para pacientes y profesionales sanitarios, y **HIÜRD**, un mercado de servicios locales con pagos seguros.

Ninguno de estos productos empezó como una idea brillante. Cada uno empezó como un problema que ya había visto resuelto, bien o mal, desde dentro de una empresa.

## 6. Lo que cambió en mi forma de construir

Trabajar para empresas cambió mis hábitos como desarrollador. Los que más importan:

**Vender el resultado, no la tecnología.** Nadie compra “Next.js, Nest.js y PostgreSQL”. Un comerciante compra: *“Sé lo que vendí hoy, en dólares y en moneda local, incluso cuando no había internet.”* Las dos funciones por las que los clientes preguntan primero son una caja con dos monedas y un modo sin conexión. Ninguna es glamurosa. Las dos deciden si alguien confía su dinero al software. Ahora escribo la página de presentación antes que el código; si no puedo explicar el resultado en una frase a una cajera, todavía no tengo un producto.

**Poner precios como una empresa.** Mis primeros contratos eran por horas, y cobraba de menos. Ahora es un precio de proyecto para la construcción inicial, y después una suscripción mensual por el alojamiento, el soporte y las actualizaciones. Los ingresos recurrentes son previsibles, y me obligan a mantener el producto vivo en lugar de pasar a otra cosa después de la entrega. Como Hela, Safirisha y Masomo son multi-tenant, atender a un nuevo cliente casi no cuesta nada extra: una sola base de código, muchas empresas, una factura mensual para cada una. Las decisiones de arquitectura son decisiones de precio.

**Hacer el trabajo aburrido.** El código es quizá el cuarenta por ciento del trabajo. El resto son contratos y facturas, copias de seguridad y monitorización, un grupo de soporte por cliente, documentos de bienvenida, formación para cajeros y secretarias, y decir que no a las funciones que solo quiere un cliente. Automatizo los despliegues, la monitorización y las copias de seguridad. Nunca automatizo la primera semana con un cliente nuevo. Esa semana es donde se construye la confianza, y la confianza es lo que se renueva cada mes.

## 7. La reputación, por fin

Recuerde el muro del paso tres: nadie me conocía. Trabajar en Ever Gauzy y Ever Teams, dos grandes monorepos públicos, resolvió eso de una forma que no había planeado.

![Ever Teams, la plataforma open source de gestión del trabajo y de proyectos](/images/Projects/ever-teams/01.jpg)

- **Credibilidad.** Un posible cliente no tiene que fiarse de mi palabra. Puede leer mis commits.
- **Arquitectura reutilizable.** Multi-tenant, control de tiempo, facturación, acceso por roles: patrones que ya había construido una vez, en producción, con revisión de código.
- **Una red.** Clientes en plataformas freelance y en otros sitios me encontraron porque podían ver trabajo real, no un currículum.

El open source me dio la notoriedad que no podía comprar al principio. Es el marketing más barato que un desarrollador puede hacer, pagado en commits.

## 8. El ciclo

Sigo entregando código todos los días en Ever Technologies. El empleo paga las facturas mientras los productos crecen, y los productos me mantienen cerca de usuarios reales, lo que me hace mejor ingeniero en el trabajo. La pasión me dio las habilidades, las empresas me dieron la experiencia y la reputación, y los productos me devuelven la pasión. El ciclo se cierra.

Muchos desarrolladores renuncian demasiado pronto, construyen aislados durante un año y se quedan sin dinero antes de quedarse sin ideas. Deje que los productos le pidan irse. Hasta entonces, conserve su empleo y conserve sus noches.

## Lo que le diría al desarrollador que era

1. Programe por pasión, pero fíjese en el momento en que sus aplicaciones se quedan en su portátil. Esa es la señal para cambiar.
2. La primera vez que alguien pague por su código, preste atención. Significa que el problema era real.
3. Persiga problemas reales, no ideas bonitas.
4. Si nadie le conoce, vaya adonde ya están los usuarios. Deje que las empresas paguen por su experiencia mientras aprende cómo entregan.
5. Después, haga lo que ellas hacían, por su cuenta, con los problemas que sigue encontrando.
6. Venda resultados, cobre mensualmente, haga el trabajo aburrido, construya en público.

La distancia entre el código y el negocio no es un diploma ni una ronda de financiación. Es la paciencia de convertir una pasión en experiencia, la experiencia en reputación, y la reputación en soluciones que la gente paga con gusto, mes tras mes.`,
  },
};
