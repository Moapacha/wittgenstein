import type { Command } from "commander";
import { runCodecCommand, parseOptionalSeed, type CommandRuntimeOptions } from "./shared.js";

export function registerVideoCommand(program: Command): void {
  program
    .command("video")
    .argument("<prompt>", "user prompt")
    .description("Run the video codec")
    .option("--duration-sec <number>", "requested duration in seconds")
    .option("--out <path>", "output path")
    .option("--seed <number>", "seed")
    .option("--dry-run", "skip the remote model call and exercise the manifest spine")
    .option("--config <path>", "config path")
    .action(
      async (
        prompt: string,
        options: CommandRuntimeOptions & { durationSec?: string },
      ) => {
        await runCodecCommand(
          {
            modality: "video",
            prompt,
            out: options.out,
            seed: parseOptionalSeed(options.seed),
            durationSec: options.durationSec
              ? Number.parseFloat(options.durationSec)
              : undefined,
          },
          "polyglot video",
          process.argv.slice(2),
          options,
        );
      },
    );
}
