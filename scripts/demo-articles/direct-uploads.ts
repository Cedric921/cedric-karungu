export const directUploads = {
  slug: 'direct-to-cloudinary-uploads-nextjs',
  cover: '/images/Projects/safirisha/01.jpg',
  tags: ['Next.js', 'Cloudinary', 'Serverless', 'Security', 'Frontend'],
  daysAgo: 55,
  title: {
    en: "Uploading large images from Next.js without hitting your server's limits",
    fr: 'Uploader de grandes images depuis Next.js sans heurter les limites de son serveur',
  },
  excerpt: {
    en: 'Serverless functions cap request bodies at a few megabytes, and phone photos are bigger. Signed direct uploads fix it without exposing your secret.',
    fr: 'Les fonctions serverless limitent la taille des requêtes à quelques mégaoctets, et les photos de téléphone sont plus lourdes. Les uploads directs signés règlent ça sans exposer votre secret.',
  },
  content: {
    en: `On my own portfolio, the admin let me attach several images to a project. It worked locally — and failed in production as soon as I picked real screenshots. The reason is common enough to be worth writing down.

## The problem: your API route is a bottleneck

The first version did the obvious thing:

1. the browser sends the file to \`/api/upload\`;
2. the route forwards it to Cloudinary with the secret key;
3. it returns the URL.

On serverless platforms, the request body of a function is capped (on Vercel, around **4.5 MB**). A modern phone photo or a retina screenshot easily exceeds that. Uploading ten images one by one through the function is also slow.

## The fix: let the browser upload directly, with a signature

The secret must stay on the server — but the *file* doesn't need to pass through it. The server only signs the upload parameters:

\`\`\`ts
// app/api/admin/uploads/sign/route.ts — protected by the admin auth
export async function POST() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'portfolio/projects';
  const signature = createHash('sha1')
    .update(\`folder=\${folder}&timestamp=\${timestamp}\${process.env.CLOUDINARY_API_SECRET}\`)
    .digest('hex');
  return Response.json({ timestamp, folder, signature, apiKey: process.env.CLOUDINARY_API_KEY });
}
\`\`\`

The browser then posts the file straight to Cloudinary with those fields. The signature only allows that folder, for a limited time, so it can't be reused to upload anywhere else.

## Progress bars for free

\`fetch\` can't report upload progress yet, but \`XMLHttpRequest\` can:

\`\`\`ts
xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
\`\`\`

With a small pool of three uploads in parallel, ten images feel fast, and each one shows its own progress bar.

## Guard rails that still matter

Going direct doesn't remove validation; it moves it:

- **In the browser:** accepted types, maximum size, maximum number of files — for fast feedback.
- **On the signing route:** only authenticated admins get a signature, and only for known folders.
- **On save:** the API that stores the project validates the URLs and caps the gallery size, because the browser can't be trusted.

## Result

Uploads no longer depend on the function's body limit, they run in parallel, and the secret never leaves the server. The same pattern works with S3 presigned URLs or any storage that supports signed uploads.`,
    fr: `Sur mon propre portfolio, l'admin me permettait d'ajouter plusieurs images à un projet. Ça marchait en local — et échouait en production dès que je choisissais de vraies captures. La raison est assez courante pour mériter un article.

## Le problème : la route API devient un goulot d'étranglement

La première version faisait la chose évidente :

1. le navigateur envoie le fichier à \`/api/upload\` ;
2. la route le transmet à Cloudinary avec la clé secrète ;
3. elle renvoie l'URL.

Sur les plateformes serverless, la taille du corps d'une requête vers une fonction est limitée (sur Vercel, environ **4,5 Mo**). Une photo de téléphone récente ou une capture retina dépasse facilement cette limite. Et envoyer dix images une par une à travers la fonction est lent.

## La solution : upload direct depuis le navigateur, avec une signature

Le secret doit rester sur le serveur — mais le *fichier* n'a pas besoin d'y passer. Le serveur se contente de signer les paramètres de l'upload :

\`\`\`ts
// app/api/admin/uploads/sign/route.ts — protégée par l'auth admin
export async function POST() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = 'portfolio/projects';
  const signature = createHash('sha1')
    .update(\`folder=\${folder}&timestamp=\${timestamp}\${process.env.CLOUDINARY_API_SECRET}\`)
    .digest('hex');
  return Response.json({ timestamp, folder, signature, apiKey: process.env.CLOUDINARY_API_KEY });
}
\`\`\`

Le navigateur envoie ensuite le fichier directement à Cloudinary avec ces champs. La signature n'autorise que ce dossier, pour une durée limitée : elle ne peut pas être réutilisée pour uploader ailleurs.

## Des barres de progression gratuites

\`fetch\` ne sait pas encore suivre la progression d'un envoi, mais \`XMLHttpRequest\` oui :

\`\`\`ts
xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
\`\`\`

Avec un petit pool de trois envois en parallèle, dix images partent vite, chacune avec sa propre barre de progression.

## Les garde-fous restent nécessaires

Passer en direct ne supprime pas la validation, elle se déplace :

- **Dans le navigateur :** types acceptés, taille maximale, nombre maximum de fichiers — pour un retour immédiat.
- **Sur la route de signature :** seuls les admins authentifiés obtiennent une signature, et seulement pour des dossiers connus.
- **À l'enregistrement :** l'API qui sauvegarde le projet valide les URL et limite la taille de la galerie, parce qu'on ne peut pas faire confiance au navigateur.

## Résultat

Les uploads ne dépendent plus de la limite des fonctions, ils partent en parallèle, et le secret ne quitte jamais le serveur. Le même principe fonctionne avec les URL présignées S3 ou tout stockage qui accepte des uploads signés.`,
  },
};
