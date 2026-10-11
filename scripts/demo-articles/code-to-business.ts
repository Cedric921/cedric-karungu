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
    en: 'I started by writing React components for other people’s apps in Goma. Today I build and sell business software to shops, schools and transport agencies. Here is what actually moved the needle, and what I would skip.',
    fr: 'J’ai commencé en écrivant des composants React pour les applications des autres, à Goma. Aujourd’hui je conçois et vends des logiciels de gestion à des commerces, des écoles et des agences de transport. Voici ce qui a vraiment compté, et ce que j’éviterais.',
    es: 'Empecé escribiendo componentes React para las aplicaciones de otros, en Goma. Hoy construyo y vendo software de gestión a comercios, escuelas y agencias de transporte. Esto es lo que de verdad marcó la diferencia, y lo que me saltaría.',
  },
  content: {
    en: `In December 2018 I wrote my first paid lines of code for **Buku My Class**, an app that let secondary school students read their class notes from anywhere. I was paid to ship React components. I was not thinking about customers, margins or contracts.

Seven years later I spend as much time talking to shop owners, school directors and transport agency managers as I do in my editor. This is not an overnight-success story. It is the list of decisions that turned a skill into an income, written for the developer I was in Goma.

## 1. Get paid for code first, build products later

My path was not a straight line to entrepreneurship. It was a sequence of jobs, each one in a different domain:

- **Buku My Class** (2018 to 2021): education, React and Node.
- **One Stop Center** (2021 to 2022): parcel tracking shared across a company’s agencies, in Angular.
- **Attendacy at KADEA Academy** (2022): student attendance for a coding school, Express and React.
- **CRES** (2022 to 2023): a start-up and research centre in Goma building business management tools and AI solutions, Nest.js and Next.js.
- **AdminAtete** (2023): document archiving for a Belgian tech start-up.
- **Cobiz at Upperz** (2023): lead backend developer on a sales, stock, customer and invoicing management app for businesses, with Adonis.js.
- **Ever Technologies** (since November 2023): Ever Gauzy, an open-source ERP, CRM and HRM platform, and Ever Teams, a work and project management platform.

![Ever Gauzy, the open-source ERP and CRM platform I work on at Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Look at that list again. Parcels, attendance, archiving, sales and stock, ERP, CRM. Those are not frameworks. They are **domains**, and they are exactly the domains I sell software in today.

The lesson: do not quit your job to “build a start-up” with no domain knowledge. Let clients and employers pay you to learn how a business actually works. Every invoice you send as a developer is also tuition.

## 2. A product is a problem you have seen more than once

Almost every product I run today started as a problem I had already solved for someone else.

At One Stop Center, agencies needed to share parcel information. Years later, that became **Safirisha**, an all-in-one platform for inter-city transport agencies: parcels, trips, fleets and drivers, and **Twende Kivu**, an online ticketing platform.

![Safirisha: parcels, trips, fleets and drivers for inter-city transport agencies](/images/Projects/safirisha/01.jpg)

Buku and Attendacy were both about schools. That experience became **Masomo**, school software designed to keep working when the network stops, because in many Congolese schools the connection drops several times a day.

![Masomo: school software that keeps working when the network stops](/images/Projects/masomo-cd/01.jpg)

AdminAtete, Cobiz and Ever Gauzy taught me how companies archive documents, invoice, track stock, follow up customers and pay staff. Cobiz in particular, where I designed the backend for sales, stock, customers and invoices at Upperz, is the direct ancestor of **Hela**: one place to run several businesses at once, whether a shop, a restaurant, a bar or a hotel.

![Cobiz: sales, stock, customers and invoices in one app](/images/Projects/cobiz.jpg)

![Hela: one dashboard to run several businesses at once](/images/Projects/hela/01.jpg)

The lesson: keep a problem log. Write down every problem you solve for an employer or a client. When the same problem shows up a third time with a different company, you are not looking at a project any more. You are looking at a product.

## 3. Sell the outcome, not the stack

Nobody in Goma or Kigali buys “Next.js, Nest.js and PostgreSQL”. They buy: *“I know what I sold today, in dollars and in francs, even when the internet was down.”*

The two features clients ask about first are a **dual-currency till** and an **offline mode**. Neither is technically glamorous. Both decide whether a shop owner trusts the software with their money.

So I now write the landing page before the code. If I cannot explain the result in one sentence to a cashier, I do not have a product yet. I have a hobby.

## 4. Open source is a business asset

Working on Ever Gauzy and Ever Teams meant working in a large, public monorepo. At first I saw it as a job. Then I noticed what it was doing for me:

- **Credibility.** A prospect does not have to take my word for it. They can read my commits.
- **Reusable architecture.** Multi-tenancy, time tracking, invoicing, role-based access: patterns I had already built once, in production, with code review.
- **A network.** Clients on Upwork and elsewhere found me because they could see real work, not a résumé.

![Ever Teams, the open-source work and project management platform](/images/Projects/ever-teams/01.jpg)

The lesson: contribute where companies actually use the code. Open source is not charity. It is the cheapest marketing a developer can buy, paid in commits.

## 5. Price like a business, not like a freelancer

My first contracts were hourly, and I undercharged. Hourly pricing punishes you for getting faster and ties your income to your calendar.

What works for me now: a project price for the initial build, then a **monthly subscription** for hosting, support and updates. Recurring revenue changed everything. It is predictable, and it forces me to keep the product alive instead of moving on after delivery.

The technical side matters here. Because Hela, Safirisha and Masomo are multi-tenant, a new client costs me almost nothing extra to serve: one codebase, many companies, one monthly invoice each. Architecture decisions are pricing decisions.

## 6. The boring things are the business

If I am honest, code is maybe forty percent of the job. The rest is:

- contracts and invoices, in two currencies;
- backups and monitoring, because a till that loses a day of sales is a lost client;
- a WhatsApp group per client for support;
- onboarding documents and training sessions for cashiers and secretaries;
- saying no to features that only one client wants.

I automate what can be automated: deployments, monitoring, backups. I never automate the first week with a new client. That week is where trust is built, and trust is what gets renewed every month.

## 7. Stay a developer

I still ship code every day at Ever Technologies. The job pays the bills while the products grow, and the products keep me close to real users, which makes me a better engineer at work. The two feed each other.

Many developers quit too early, build in isolation for a year, and run out of money before they run out of ideas. Let the products ask you to leave. Until they do, keep your job and keep your evenings.

## What I would tell my 2018 self

1. Ship for clients first. Products come from the problems they pay you to solve.
2. Keep the problem log. The third occurrence is the product.
3. Sell outcomes, in the customer’s words, in the customer’s currency.
4. Charge monthly. Design the architecture so that the next client is almost free.
5. Build in public. Your commits are your sales deck.
6. Do the boring work yourself at first. That is where the business actually lives.

If you are a developer in Goma, Bukavu, Kigali or anywhere else reading this: the gap between code and business is not a diploma or a round of funding. It is noticing which problems keep coming back, and having the patience to solve the same one properly, for money, several times.`,
    fr: `En décembre 2018, j’ai écrit mes premières lignes de code payées pour **Buku My Class**, une application qui permettait aux élèves du secondaire de lire leurs notes de cours depuis n’importe où. On me payait pour livrer des composants React. Je ne pensais ni aux clients, ni aux marges, ni aux contrats.

Sept ans plus tard, je passe autant de temps à parler à des commerçants, des directeurs d’école et des gestionnaires d’agences de transport que dans mon éditeur. Ce n’est pas une histoire de succès du jour au lendemain. C’est la liste des décisions qui ont transformé une compétence en revenu, écrite pour le développeur que j’étais à Goma.

## 1. Se faire payer pour coder d’abord, construire des produits ensuite

Mon parcours n’a pas été une ligne droite vers l’entrepreneuriat. C’était une suite d’emplois, chacun dans un domaine différent :

- **Buku My Class** (2018 à 2021) : l’éducation, en React et Node.
- **One Stop Center** (2021 à 2022) : le suivi des colis partagé entre les agences d’une entreprise, en Angular.
- **Attendacy à KADEA Academy** (2022) : la gestion des présences d’une école de code, en Express et React.
- **CRES** (2022 à 2023) : une start-up et un centre de recherche à Goma, qui construit des outils de gestion d’entreprise et des solutions d’IA, en Nest.js et Next.js.
- **AdminAtete** (2023) : l\u2019archivage de documents pour une start-up technologique belge.
- **Cobiz chez Upperz** (2023) : développeur backend principal d\u2019une application de gestion des ventes, du stock, des clients et des factures, en Adonis.js.
- **Ever Technologies** (depuis novembre 2023) : Ever Gauzy, une plateforme open source d’ERP, CRM et GRH, et Ever Teams, une plateforme de gestion du travail et des projets.

![Ever Gauzy, la plateforme open source d’ERP et de CRM sur laquelle je travaille chez Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Relisez cette liste. Colis, présences, archivage, ventes et stock, ERP, CRM. Ce ne sont pas des frameworks. Ce sont des **métiers**, et ce sont exactement les métiers dans lesquels je vends des logiciels aujourd’hui.

La leçon : ne quittez pas votre emploi pour « monter une start-up » sans connaître un métier. Laissez vos clients et vos employeurs vous payer pour apprendre comment une entreprise fonctionne vraiment. Chaque facture que vous envoyez comme développeur est aussi un frais de scolarité.

## 2. Un produit, c’est un problème qu’on a vu plus d’une fois

Presque tous les produits que je fais tourner aujourd’hui ont commencé comme un problème que j’avais déjà résolu pour quelqu’un d’autre.

Chez One Stop Center, les agences devaient partager les informations sur les colis. Des années plus tard, c’est devenu **Safirisha**, une plateforme tout-en-un pour les agences de transport inter-villes : colis, voyages, flottes et chauffeurs, et **Twende Kivu**, une plateforme de billetterie en ligne.

![Safirisha : colis, voyages, flottes et chauffeurs pour les agences de transport inter-villes](/images/Projects/safirisha/01.jpg)

Buku et Attendacy parlaient tous les deux d’écoles. Cette expérience est devenue **Masomo**, un logiciel scolaire conçu pour continuer à fonctionner quand le réseau s’arrête, parce que dans beaucoup d’écoles congolaises la connexion tombe plusieurs fois par jour.

![Masomo : le logiciel scolaire qui continue de fonctionner quand le réseau s’arrête](/images/Projects/masomo-cd/01.jpg)

AdminAtete, Cobiz et Ever Gauzy m\u2019ont appris comment les entreprises archivent leurs documents, facturent, suivent leur stock, suivent leurs clients et paient leur personnel. Cobiz en particulier, dont j\u2019ai conçu le backend pour les ventes, le stock, les clients et les factures chez Upperz, est l\u2019ancêtre direct de **Hela** : un seul endroit pour gérer plusieurs commerces à la fois, qu’il s’agisse d’une boutique, d’un restaurant, d’un bar ou d’un hôtel.

![Cobiz : ventes, stock, clients et factures dans une seule application](/images/Projects/cobiz.jpg)

![Hela : un seul tableau de bord pour gérer plusieurs commerces à la fois](/images/Projects/hela/01.jpg)

La leçon : tenez un journal des problèmes. Notez chaque problème que vous résolvez pour un employeur ou un client. Quand le même problème revient une troisième fois chez une entreprise différente, vous n’avez plus un projet sous les yeux. Vous avez un produit.

## 3. Vendre le résultat, pas la stack

Personne à Goma ou à Kigali n’achète « Next.js, Nest.js et PostgreSQL ». Les gens achètent : *« Je sais ce que j’ai vendu aujourd’hui, en dollars et en francs, même quand l’internet était coupé. »*

Les deux fonctionnalités que les clients demandent en premier sont une **caisse à deux devises** et un **mode hors ligne**. Aucune des deux n’est techniquement prestigieuse. Les deux décident si un commerçant confie son argent au logiciel.

Alors j’écris maintenant la page de présentation avant le code. Si je n’arrive pas à expliquer le résultat en une phrase à une caissière, je n’ai pas encore de produit. J’ai un passe-temps.

## 4. L’open source est un actif commercial

Travailler sur Ever Gauzy et Ever Teams, c’est travailler dans un grand monorepo public. Au début, je voyais ça comme un emploi. Puis j’ai remarqué ce que ça faisait pour moi :

- **De la crédibilité.** Un prospect n’a pas à me croire sur parole. Il peut lire mes commits.
- **Une architecture réutilisable.** Multi-tenant, suivi du temps, facturation, gestion des rôles : des patterns que j’avais déjà construits une fois, en production, avec revue de code.
- **Un réseau.** Des clients sur Upwork et ailleurs m’ont trouvé parce qu’ils pouvaient voir du vrai travail, pas un CV.

![Ever Teams, la plateforme open source de gestion du travail et des projets](/images/Projects/ever-teams/01.jpg)

La leçon : contribuez là où des entreprises utilisent réellement le code. L’open source n’est pas de la charité. C’est le marketing le moins cher qu’un développeur puisse s’offrir, payé en commits.

## 5. Fixer ses prix comme une entreprise, pas comme un freelance

Mes premiers contrats étaient à l’heure, et je me sous-facturais. La tarification horaire vous punit quand vous devenez plus rapide, et elle attache vos revenus à votre agenda.

Ce qui marche pour moi aujourd’hui : un prix de projet pour la construction initiale, puis un **abonnement mensuel** pour l’hébergement, le support et les mises à jour. Le revenu récurrent a tout changé. Il est prévisible, et il m’oblige à garder le produit vivant au lieu de passer à autre chose après la livraison.

La technique compte ici. Parce que Hela, Safirisha et Masomo sont multi-tenant, un nouveau client ne me coûte presque rien de plus à servir : une seule base de code, plusieurs entreprises, une facture mensuelle chacune. Les décisions d’architecture sont des décisions de prix.

## 6. Les choses ennuyeuses, c’est ça le business

Pour être honnête, le code représente peut-être quarante pour cent du travail. Le reste, c’est :

- les contrats et les factures, en deux devises ;
- les sauvegardes et la supervision, parce qu’une caisse qui perd une journée de ventes est un client perdu ;
- un groupe WhatsApp par client pour le support ;
- des documents d’accueil et des sessions de formation pour les caissiers et les secrétaires ;
- dire non aux fonctionnalités qu’un seul client réclame.

J’automatise ce qui peut l’être : déploiements, supervision, sauvegardes. Je n’automatise jamais la première semaine avec un nouveau client. C’est là que la confiance se construit, et c’est la confiance qui se renouvelle chaque mois.

## 7. Rester développeur

Je livre encore du code tous les jours chez Ever Technologies. L’emploi paie les factures pendant que les produits grandissent, et les produits me gardent près de vrais utilisateurs, ce qui fait de moi un meilleur ingénieur au travail. Les deux se nourrissent l’un l’autre.

Beaucoup de développeurs démissionnent trop tôt, construisent seuls pendant un an, et se retrouvent à court d’argent avant d’être à court d’idées. Laissez les produits vous demander de partir. En attendant, gardez votre emploi et gardez vos soirées.

## Ce que je dirais à celui que j’étais en 2018

1. Livrez pour des clients d’abord. Les produits naissent des problèmes qu’ils vous paient pour résoudre.
2. Tenez le journal des problèmes. La troisième occurrence, c’est le produit.
3. Vendez des résultats, dans les mots du client, dans la devise du client.
4. Facturez au mois. Concevez l’architecture pour que le prochain client soit presque gratuit.
5. Construisez en public. Vos commits sont votre argumentaire de vente.
6. Faites vous-même le travail ennuyeux au début. C’est là que vit réellement le business.

Si vous êtes développeur à Goma, à Bukavu, à Kigali ou ailleurs et que vous lisez ceci : l’écart entre le code et le business, ce n’est ni un diplôme ni une levée de fonds. C’est remarquer quels problèmes reviennent sans cesse, et avoir la patience de résoudre le même problème proprement, contre rémunération, plusieurs fois.`,
    es: `En diciembre de 2018 escribí mis primeras líneas de código pagadas para **Buku My Class**, una aplicación que permitía a los estudiantes de secundaria leer sus apuntes de clase desde cualquier lugar. Me pagaban por entregar componentes React. No pensaba en clientes, ni en márgenes, ni en contratos.

Siete años después, paso tanto tiempo hablando con dueños de tiendas, directores de escuela y gestores de agencias de transporte como en mi editor. Esta no es una historia de éxito de la noche a la mañana. Es la lista de decisiones que convirtieron una habilidad en un ingreso, escrita para el desarrollador que era en Goma.

## 1. Cobrar por el código primero, construir productos después

Mi camino no fue una línea recta hacia el emprendimiento. Fue una secuencia de empleos, cada uno en un sector distinto:

- **Buku My Class** (2018 a 2021): educación, con React y Node.
- **One Stop Center** (2021 a 2022): seguimiento de paquetes compartido entre las agencias de una empresa, en Angular.
- **Attendacy en KADEA Academy** (2022): control de asistencia para una escuela de programación, con Express y React.
- **CRES** (2022 a 2023): una start-up y centro de investigación en Goma que construye herramientas de gestión empresarial y soluciones de IA, con Nest.js y Next.js.
- **AdminAtete** (2023): archivo de documentos para una start-up tecnológica belga.
- **Cobiz en Upperz** (2023): desarrollador backend principal de una aplicación de gestión de ventas, inventario, clientes y facturación para empresas, con Adonis.js.
- **Ever Technologies** (desde noviembre de 2023): Ever Gauzy, una plataforma open source de ERP, CRM y RR. HH., y Ever Teams, una plataforma de gestión del trabajo y de proyectos.

![Ever Gauzy, la plataforma open source de ERP y CRM en la que trabajo en Ever Technologies](/images/Projects/ever-gauzy-platform/01.jpg)

Vuelva a mirar esa lista. Paquetes, asistencia, archivo, ventas e inventario, ERP, CRM. No son frameworks. Son **sectores**, y son exactamente los sectores en los que vendo software hoy.

La lección: no deje su empleo para “montar una start-up” sin conocer un sector. Deje que clientes y empleadores le paguen por aprender cómo funciona realmente una empresa. Cada factura que envía como desarrollador es también una matrícula.

## 2. Un producto es un problema que ha visto más de una vez

Casi todos los productos que gestiono hoy empezaron como un problema que ya había resuelto para otra persona.

En One Stop Center, las agencias necesitaban compartir la información de los paquetes. Años después, eso se convirtió en **Safirisha**, una plataforma todo en uno para agencias de transporte interurbano: paquetes, viajes, flotas y conductores, y en **Twende Kivu**, una plataforma de venta de billetes en línea.

![Safirisha: paquetes, viajes, flotas y conductores para agencias de transporte interurbano](/images/Projects/safirisha/01.jpg)

Buku y Attendacy trataban ambos de escuelas. Esa experiencia se convirtió en **Masomo**, un software escolar diseñado para seguir funcionando cuando la red se cae, porque en muchas escuelas congoleñas la conexión se corta varias veces al día.

![Masomo: software escolar que sigue funcionando cuando la red se cae](/images/Projects/masomo-cd/01.jpg)

AdminAtete, Cobiz y Ever Gauzy me enseñaron cómo las empresas archivan documentos, facturan, controlan el inventario, hacen seguimiento de sus clientes y pagan al personal. Cobiz en particular, cuyo backend de ventas, inventario, clientes y facturas diseñé en Upperz, es el antecesor directo de **Hela**: un solo lugar para gestionar varios negocios a la vez, ya sea una tienda, un restaurante, un bar o un hotel.

![Cobiz: ventas, inventario, clientes y facturas en una sola aplicación](/images/Projects/cobiz.jpg)

![Hela: un solo panel para gestionar varios negocios a la vez](/images/Projects/hela/01.jpg)

La lección: lleve un registro de problemas. Anote cada problema que resuelva para un empleador o un cliente. Cuando el mismo problema aparece por tercera vez en una empresa distinta, ya no está mirando un proyecto. Está mirando un producto.

## 3. Vender el resultado, no la tecnología

Nadie en Goma ni en Kigali compra “Next.js, Nest.js y PostgreSQL”. Compran: *“Sé lo que vendí hoy, en dólares y en francos, incluso cuando no había internet.”*

Las dos funciones por las que los clientes preguntan primero son una **caja con dos monedas** y un **modo sin conexión**. Ninguna de las dos es técnicamente glamurosa. Las dos deciden si un comerciante confía su dinero al software.

Así que ahora escribo la página de presentación antes que el código. Si no puedo explicar el resultado en una frase a una cajera, todavía no tengo un producto. Tengo un pasatiempo.

## 4. El open source es un activo comercial

Trabajar en Ever Gauzy y Ever Teams significó trabajar en un monorepo grande y público. Al principio lo veía como un empleo. Luego me di cuenta de lo que hacía por mí:

- **Credibilidad.** Un posible cliente no tiene que fiarse de mi palabra. Puede leer mis commits.
- **Arquitectura reutilizable.** Multi-tenant, control de tiempo, facturación, acceso por roles: patrones que ya había construido una vez, en producción, con revisión de código.
- **Una red.** Clientes en Upwork y en otros sitios me encontraron porque podían ver trabajo real, no un currículum.

![Ever Teams, la plataforma open source de gestión del trabajo y de proyectos](/images/Projects/ever-teams/01.jpg)

La lección: contribuya donde las empresas usan realmente el código. El open source no es caridad. Es el marketing más barato que un desarrollador puede comprar, pagado en commits.

## 5. Poner precios como una empresa, no como un freelance

Mis primeros contratos eran por horas, y cobraba de menos. Cobrar por horas le castiga por volverse más rápido y ata sus ingresos a su calendario.

Lo que me funciona ahora: un precio de proyecto para la construcción inicial, y después una **suscripción mensual** por el alojamiento, el soporte y las actualizaciones. Los ingresos recurrentes lo cambiaron todo. Son previsibles, y me obligan a mantener el producto vivo en lugar de pasar a otra cosa después de la entrega.

La parte técnica importa aquí. Como Hela, Safirisha y Masomo son multi-tenant, atender a un nuevo cliente casi no me cuesta nada extra: una sola base de código, muchas empresas, una factura mensual para cada una. Las decisiones de arquitectura son decisiones de precio.

## 6. Las cosas aburridas son el negocio

Si soy sincero, el código es quizá el cuarenta por ciento del trabajo. El resto es:

- contratos y facturas, en dos monedas;
- copias de seguridad y monitorización, porque una caja que pierde un día de ventas es un cliente perdido;
- un grupo de WhatsApp por cliente para el soporte;
- documentos de bienvenida y sesiones de formación para cajeros y secretarias;
- decir que no a las funciones que solo quiere un cliente.

Automatizo lo que se puede automatizar: despliegues, monitorización, copias de seguridad. Nunca automatizo la primera semana con un cliente nuevo. Esa semana es donde se construye la confianza, y la confianza es lo que se renueva cada mes.

## 7. Seguir siendo desarrollador

Sigo entregando código todos los días en Ever Technologies. El empleo paga las facturas mientras los productos crecen, y los productos me mantienen cerca de usuarios reales, lo que me hace mejor ingeniero en el trabajo. Las dos cosas se alimentan mutuamente.

Muchos desarrolladores renuncian demasiado pronto, construyen aislados durante un año y se quedan sin dinero antes de quedarse sin ideas. Deje que los productos le pidan irse. Hasta entonces, conserve su empleo y conserve sus noches.

## Lo que le diría a mi yo de 2018

1. Entregue para clientes primero. Los productos nacen de los problemas que le pagan por resolver.
2. Lleve el registro de problemas. La tercera vez es el producto.
3. Venda resultados, con las palabras del cliente, en la moneda del cliente.
4. Cobre mensualmente. Diseñe la arquitectura para que el siguiente cliente salga casi gratis.
5. Construya en público. Sus commits son su presentación de ventas.
6. Haga usted mismo el trabajo aburrido al principio. Ahí es donde vive realmente el negocio.

Si es desarrollador en Goma, Bukavu, Kigali o en cualquier otro lugar y está leyendo esto: la distancia entre el código y el negocio no es un diploma ni una ronda de financiación. Es darse cuenta de qué problemas vuelven una y otra vez, y tener la paciencia de resolver el mismo problema bien, a cambio de dinero, varias veces.`,
  },
};
