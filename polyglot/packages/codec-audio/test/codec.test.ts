import { describe, expect, it } from "vitest";
import { audioCodec } from "../src/index.js";

describe("@polyglot/codec-audio", () => {
  it("exports a typed audio codec with default parse behavior", () => {
    expect(audioCodec.name).toBe("audio");
    expect(audioCodec.parse("{}").ok).toBe(true);
  });
});
