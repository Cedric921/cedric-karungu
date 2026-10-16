/* eslint-disable no-console */
/**
 * Refreshes src/data/oss-snapshot.json, the fallback shown when the live
 * GitHub data can't be fetched (rate limit, network).
 *
 *   GITHUB_TOKEN=$(gh auth token) npx tsx scripts/sync-oss-snapshot.ts
 */
import { writeFileSync } from 'node:fs';
import { fetchOssData } from '../src/lib/oss';

fetchOssData()
  .then((data) => {
    writeFileSync('src/data/oss-snapshot.json', `${JSON.stringify(data, null, 2)}\n`);
    for (const r of data.repos) {
      const merged = r.prs.filter((p) => p.state === 'merged').length;
      console.log(`  ${r.repo.padEnd(50)} ★${r.stars}  merged ${merged}  open ${r.prs.length - merged}`);
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
