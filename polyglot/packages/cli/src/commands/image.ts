import type { Command } from "commander";
import { runCodecCommand, parseOptionalSeed, type CommandRuntimeOptions } from "./shared.js";

export function registerImageCommand(program: Command): void {
  program
    .command("image")
    .argument("<prompt>", "user prompt")
    .description("Run the image codec")
    .option("--out <path>", "output path")
    .option("--seed <number>", "seed")
    .option("--dry-run", "skip the remote model call and exercise the manifest spine")
    .option("--config <path>", "config path")
    .action(
      async (
        prompt: string,
        options: CommandRuntimeOptions,
      ) => {
        await runCodecCommand(
          {
            modality: "image",
            prompt,
            out: options.out,
            seed: parseOptionalSeed(options.seed),
          },
          "polyglot image",
          process.argv.slice(2),
          options,
        );
      },
    );
}
