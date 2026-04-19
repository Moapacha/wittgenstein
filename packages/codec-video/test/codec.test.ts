import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { videoCodec } from "../src/index.js";

describe("@wittgenstein/codec-video", () => {
  it("exposes the video codec contract", () => {
    expect(videoCodec.name).toBe("video");
    expect(videoCodec.parse("{}").ok).toBe(true);
  });

  it("renders a HyperFrames-shaped HTML composition", async () => {
    const parsed = videoCodec.parse(
      JSON.stringify({
        durationSec: 2,
        fps: 24,
        scenes: [{ name: "intro", description: "Hello", durationSec: 2 }],
      }),
    );
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const dir = await mkdtemp(join(tmpdir(), "wittgenstein-video-"));
    try {
      const outMp4 = join(dir, "output.mp4");
      const result = await videoCodec.render(parsed.value, {
        runId: "test-run",
        runDir: dir,
        seed: 1,
        outPath: outMp4,
        logger: {
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
        },
      });

      expect(result.mimeType).toContain("text/html");
      expect(result.artifactPath.endsWith(".hyperframes.html")).toBe(true);

      const html = await readFile(result.artifactPath, "utf8");
      expect(html).toContain('data-composition-id="wittgenstein-test-run"');
      expect(html).toContain('data-duration="2"');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
