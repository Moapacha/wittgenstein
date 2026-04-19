import { describe, expect, it } from "vitest";
import { execProgram } from "../src/index.js";

describe("@polyglot/sandbox", () => {
  it("preserves the reserved execution seam", async () => {
    await expect(
      execProgram("print('hi')", {
        timeoutMs: 10,
      }),
    ).rejects.toThrow("not implemented");
  });
});
