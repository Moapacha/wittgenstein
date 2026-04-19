import { describe, expect, it } from "vitest";
import { asciipngCodec, minimaxTextToAsciiIr, renderPseudoAsciiPng } from "../src/index.js";

describe("@wittgenstein/codec-asciipng", () => {
  it("registers codec", () => {
    expect(asciipngCodec.name).toBe("asciipng");
    expect(asciipngCodec.modality).toBe("asciipng");
  });

  it("post-processes Minimax-style text into a fixed-size grid IR", () => {
    const raw = "```\n##\n..##\n```";
    const ir = minimaxTextToAsciiIr(raw, 6, 3, 4);
    expect(ir.text.length).toBe(18);
    expect(ir.glyphMode).toBe("density");
  });

  it("produces PNG magic from minimal IR", () => {
    const bytes = renderPseudoAsciiPng(
      {
        text: "Hi",
        columns: 12,
        rows: 4,
        cell: 4,
        fg: [200, 255, 200],
        bg: [0, 0, 0],
      },
      1,
    );
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50);
    expect(bytes[2]).toBe(0x4e);
    expect(bytes[3]).toBe(0x47);
  });
});
