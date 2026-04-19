import { Polyglot } from "@polyglot/core";

async function main() {
  const polyglot = await Polyglot.bootstrap();
  const outcome = await polyglot.run(
    {
      modality: "image",
      prompt: "A black-and-white architectural still life",
    },
    {
      command: "example:image",
      args: [],
      dryRun: true,
    },
  );

  console.log(outcome.manifest);
}

void main();
