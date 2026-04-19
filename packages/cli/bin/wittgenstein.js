#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const bundled = resolve(here, "../dist/bundle.cjs");
const devEntry = resolve(here, "../src/cli-main.ts");

const argv = process.argv.slice(2);
const useBundle = existsSync(bundled);
const args = useBundle ? [bundled, ...argv] : ["--import", "tsx", devEntry, ...argv];

const result = spawnSync(process.execPath, args, {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
