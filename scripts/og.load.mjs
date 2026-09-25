// The site's data lives in TypeScript, and the asset scripts are plain Node.
// esbuild — already here, under Vite — bundles the modules a script asks for
// into one temporary ESM file that Node can import directly. No duplicated
// copy of the content, and no risk of an OG card naming a project the site has
// since renamed.
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

export async function loadData(entry) {
  const dir = await mkdtemp(path.join(tmpdir(), 'adenike-data-'));
  const outfile = path.join(dir, 'data.mjs');
  try {
    await build({
      entryPoints: [entry],
      outfile,
      bundle: true,
      format: 'esm',
      platform: 'node',
      // The data modules import JSON manifests (media.json and friends).
      loader: { '.json': 'json' },
      logLevel: 'silent',
    });
    return await import(pathToFileURL(outfile).href);
  } finally {
    // Imported already, so the file on disk has done its job.
    await rm(dir, { recursive: true, force: true });
  }
}
