export const multiTenant = {
  slug: 'multi-tenant-saas-nestjs-postgresql',
  cover: '/images/Projects/nunua/01.jpg',
  tags: ['Nest.js', 'PostgreSQL', 'Multi-tenant SaaS', 'Security', 'Backend'],
  daysAgo: 27,
  title: {
    en: 'One database, many companies: multi-tenant SaaS with Nest.js and PostgreSQL',
    fr: 'Une base, plusieurs entreprises : un SaaS multi-tenant avec Nest.js et PostgreSQL',
  },
  excerpt: {
    en: 'Hela, Nunua and Safirisha all let one account run several businesses. The hard part is not the feature — it is making sure company A can never read company B.',
    fr: 'Hela, Nunua et Safirisha permettent tous à un compte de gérer plusieurs entreprises. Le plus dur n’est pas la fonctionnalité : c’est garantir que l’entreprise A ne lira jamais l’entreprise B.',
  },
  content: {
    en: `Several products I've built share the same shape: one user, several companies (a shop and a bar, two transport agencies, a school and its annex). Each company must see **only its own data**, while the user switches between them in one click.

There are three classic ways to isolate tenants. Here is why I usually pick the simplest — and what makes it safe.

## The three options

| Strategy | Isolation | Cost to run | Good for |
|---|---|---|---|
| Database per tenant | Strongest | High | Few large clients, strict compliance |
| Schema per tenant | Strong | Medium | Dozens of tenants |
| Shared tables + \`tenant_id\` | Depends on you | Low | Many small tenants |

For SMEs in the region — many small companies, little budget — **shared tables with a \`company_id\` column** win. The risk is obvious: forget one \`WHERE company_id = …\` and you leak data.

## Make the tenant impossible to forget

The fix is to never let a developer write that filter by hand.

**1. Resolve the tenant once, per request.** A Nest.js guard reads the active company from the session, checks the user really belongs to it, and stores it in request-scoped context:

\`\`\`ts
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly memberships: MembershipService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const companyId = req.headers['x-company-id'];
    const ok = await this.memberships.has(req.user.id, companyId);
    if (!ok) throw new ForbiddenException();
    req.companyId = companyId;
    return true;
  }
}
\`\`\`

**2. Scope every query in the repository layer, not in controllers.** A base repository adds the \`company_id\` condition to every read and sets it on every insert. Feature code simply cannot query "all invoices".

**3. Let PostgreSQL enforce it too.** Row-level security is the safety net if the application ever gets it wrong:

\`\`\`sql
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoice
  USING (company_id = current_setting('app.company_id')::uuid);
\`\`\`

The connection sets \`app.company_id\` at the start of each transaction. Even a raw SQL query written in a hurry stays inside its tenant.

## Index for the tenant first

Almost every query filters by company, so composite indexes start with it:

\`\`\`sql
CREATE INDEX ON invoice (company_id, created_at DESC);
\`\`\`

## Test the leak, not just the feature

My favourite test in these projects is boring and essential: create two companies, write data in A, call every list endpoint as a member of B, and assert it returns **nothing** from A. It catches regressions that code review misses.

## What about shared data?

Some things legitimately cross tenants — a supplier used by both your shop and your bar, for example. Model that explicitly (a supplier owned by the *user*, linked to companies) instead of loosening the tenant rule.

Multi-tenancy is mostly discipline. Put the tenant check in one place, back it with the database, and test that isolation holds. Then the feature itself — switching companies in one click — becomes the easy part.`,
    fr: `Plusieurs produits que j'ai construits ont la même forme : un utilisateur, plusieurs entreprises (une boutique et un bar, deux agences de transport, une école et son annexe). Chaque entreprise doit voir **uniquement ses propres données**, pendant que l'utilisateur passe de l'une à l'autre en un clic.

Il existe trois façons classiques d'isoler les tenants. Voici pourquoi je choisis souvent la plus simple — et ce qui la rend sûre.

## Les trois options

| Stratégie | Isolation | Coût | Idéal pour |
|---|---|---|---|
| Une base par tenant | Maximale | Élevé | Peu de gros clients, conformité stricte |
| Un schéma par tenant | Forte | Moyen | Quelques dizaines de tenants |
| Tables partagées + \`tenant_id\` | Dépend de vous | Faible | Beaucoup de petits tenants |

Pour les PME de la région — beaucoup de petites entreprises, peu de budget — les **tables partagées avec une colonne \`company_id\`** l'emportent. Le risque est évident : oubliez un seul \`WHERE company_id = …\` et vous exposez des données.

## Rendre le tenant impossible à oublier

La solution : ne jamais laisser un développeur écrire ce filtre à la main.

**1. Résoudre le tenant une fois par requête.** Un guard Nest.js lit l'entreprise active dans la session, vérifie que l'utilisateur en fait bien partie, et la stocke dans le contexte de la requête :

\`\`\`ts
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly memberships: MembershipService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const companyId = req.headers['x-company-id'];
    const ok = await this.memberships.has(req.user.id, companyId);
    if (!ok) throw new ForbiddenException();
    req.companyId = companyId;
    return true;
  }
}
\`\`\`

**2. Filtrer chaque requête dans la couche repository, pas dans les contrôleurs.** Un repository de base ajoute la condition \`company_id\` à chaque lecture et la renseigne à chaque insertion. Le code métier ne peut tout simplement pas demander « toutes les factures ».

**3. Laisser PostgreSQL l'imposer aussi.** La row-level security est le filet de sécurité si l'application se trompe un jour :

\`\`\`sql
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoice
  USING (company_id = current_setting('app.company_id')::uuid);
\`\`\`

La connexion définit \`app.company_id\` au début de chaque transaction. Même une requête SQL écrite dans l'urgence reste dans son tenant.

## Indexer d'abord par tenant

Presque toutes les requêtes filtrent par entreprise, donc les index composites commencent par elle :

\`\`\`sql
CREATE INDEX ON invoice (company_id, created_at DESC);
\`\`\`

## Tester la fuite, pas seulement la fonctionnalité

Mon test préféré sur ces projets est ennuyeux et essentiel : créer deux entreprises, écrire des données dans A, appeler chaque endpoint de liste en tant que membre de B, et vérifier qu'il ne renvoie **rien** de A. Il attrape des régressions que la revue de code laisse passer.

## Et les données partagées ?

Certaines choses traversent légitimement les tenants — un fournisseur commun à votre boutique et à votre bar, par exemple. Modélisez-le explicitement (un fournisseur appartenant à *l'utilisateur*, lié à des entreprises) plutôt que d'assouplir la règle du tenant.

Le multi-tenant, c'est surtout de la discipline. Mettez la vérification du tenant à un seul endroit, doublez-la par la base de données, et testez que l'isolation tient. La fonctionnalité elle-même — changer d'entreprise en un clic — devient alors la partie facile.`,
  },
};
