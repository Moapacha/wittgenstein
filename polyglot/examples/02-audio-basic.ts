import { Polyglot } from "@polyglot/core";

async function main() {
  const polyglot = await Polyglot.bootstrap();
  const outcome = await polyglot.run(
    {
      modality: "audio",
      prompt: "A calm voice introducing the project",
      route: "speech",
    },
    {
      command: "example:audio",
      args: [],
      dryRun: true,
    },
  );

  console.log(outcome.manifest);
}

void main();
