import { describe, expect, it } from "vitest";
import { videoCodec } from "../src/index.js";

describe("@polyglot/codec-video", () => {
  it("exposes the video codec contract", () => {
    expect(videoCodec.name).toBe("video");
    expect(videoCodec.parse("{}").ok).toBe(true);
  });
});
