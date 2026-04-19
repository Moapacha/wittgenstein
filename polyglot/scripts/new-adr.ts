import { mkdir, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main(): Promise<void> {
  const title = process.argv.slice(2).join(" ").trim();

  if (!title) {
    console.error("Usage: pnpm new-adr \"title\"");
    process.exitCode = 1;
    return;
  }

  const dir = resolve(process.cwd(), "docs/adrs");
  await mkdir(dir, { recursive: true });
  const entries = await readdir(dir);
  const maxNumber = entries.reduce((currentMax, entry) => {
    const match = entry.match(/^(\d{4})-/);
    if (!match) {
      return currentMax;
    }
    return Math.max(currentMax, Number.parseInt(match[1], 10));
  }, 0);

  const nextNumber = String(maxNumber + 1).padStart(4, "0");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const target = resolve(dir, `${nextNumber}-${slug}.md`);

  await writeFile(
    target,
    `# ${nextNumber} ${title}\n\n## Status\n\nProposed\n\n## Decision\n\n## Consequence\n`,
    "utf8",
  );

  console.log(target);
}

void main();
