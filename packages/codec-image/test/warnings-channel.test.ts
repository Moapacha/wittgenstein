import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { codecV2 } from "@wittgenstein/schemas";
import { describe, expect, it } from "vitest";
import { imageV2Codec } from "../src/codec.js";

describe("image v2 warnings channel", () => {
  it("surfaces declared warning codes from adapter/decode warns", async () => {
    const runDir = await mkdtemp(resolve(tmpdir(), "witt-image-warn-"));
    const art = await imageV2Codec.produce(
      { modality: "image", prompt: "misty shoreline" },
      {
        runId: "warn-1",
        parentRunId: null,
        runDir,
        seed: null,
        outPath: resolve(runDir, "out.png"),
        logger: { debug: () => {}, info: () => {}, warn: () => {}, error: () => {} },
        clock: { now: () => 0, iso: () => new Date(0).toISOString() },
        sidecar: codecV2.createRunSidecar(),
        services: { dryRun: true, telemetry: { writeText: async () => {} } },
        fork: () => {
          throw new Error("unused");
        },
      },
    );
    expect(
      art.metadata.warnings.some((warning) => warning.code === imageV2Codec.warnings.adapter_stub),
    ).toBe(true);
  });
});
