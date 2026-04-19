import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main(): Promise<void> {
  const promptPath = resolve(process.cwd(), "benchmarks/prompts/image.json");
  const prompt = JSON.parse(await readFile(promptPath, "utf8"));
  console.log(prompt);
}

void main();
