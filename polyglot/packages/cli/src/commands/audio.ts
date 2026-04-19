import type { Command } from "commander";
import { runCodecCommand, parseOptionalSeed, type CommandRuntimeOptions } from "./shared.js";

export function registerAudioCommand(program: Command): void {
  program
    .command("audio")
    .argument("<prompt>", "user prompt")
    .description("Run the audio codec")
    .option("--route <route>", "speech | soundscape | music")
    .option("--duration-sec <number>", "requested duration in seconds")
    .option("--out <path>", "output path")
    .option("--seed <number>", "seed")
    .option("--dry-run", "skip the remote model call and exercise the manifest spine")
    .option("--config <path>", "config path")
    .action(
      async (
        prompt: string,
        options: CommandRuntimeOptions & { route?: "speech" | "soundscape" | "music"; durationSec?: string },
      ) => {
        await runCodecCommand(
          {
            modality: "audio",
            prompt,
            out: options.out,
            seed: parseOptionalSeed(options.seed),
            route: options.route,
            durationSec: options.durationSec
              ? Number.parseFloat(options.durationSec)
              : undefined,
          },
          "polyglot audio",
          process.argv.slice(2),
          options,
        );
      },
    );
}
