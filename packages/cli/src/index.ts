import { Command } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerImageCommand } from "./commands/image.js";
import { registerAudioCommand } from "./commands/audio.js";
import { registerVideoCommand } from "./commands/video.js";
import { registerSensorCommand } from "./commands/sensor.js";
import { registerSvgCommand } from "./commands/svg.js";
import { registerAsciipngCommand } from "./commands/asciipng.js";
import { registerDoctorCommand } from "./commands/doctor.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("wittgenstein")
    .description("Wittgenstein modality harness CLI")
    .version("0.1.0");

  registerInitCommand(program);
  registerImageCommand(program);
  registerAudioCommand(program);
  registerVideoCommand(program);
  registerSensorCommand(program);
  registerSvgCommand(program);
  registerAsciipngCommand(program);
  registerDoctorCommand(program);

  return program;
}

export async function runCli(argv = process.argv): Promise<void> {
  await createProgram().parseAsync(argv);
}
