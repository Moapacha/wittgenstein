import { deflateSync } from "node:zlib";
import type { RenderCtx } from "@wittgenstein/schemas";
import type { ImageLatentCodes } from "../schema.js";

export interface DecodedRaster {
  pngBytes: Uint8Array;
}

export async function decodeLatentsToRaster(
  codes: ImageLatentCodes,
  ctx: RenderCtx,
): Promise<DecodedRaster> {
  const [tokenWidth, tokenHeight] = codes.tokenGrid;
  const pixelWidth = tokenWidth * 8;
  const pixelHeight = tokenHeight * 8;
  const pixelCount = pixelWidth * pixelHeight;
  const rgba = new Uint8Array(pixelCount * 4);

  for (let y = 0; y < pixelHeight; y += 1) {
    for (let x = 0; x < pixelWidth; x += 1) {
      const tokenX = Math.floor(x / 8);
      const tokenY = Math.floor(y / 8);
      const tokenIndex = tokenY * tokenWidth + tokenX;
      const token = codes.tokens[tokenIndex] ?? 0;
      const base = (y * pixelWidth + x) * 4;
      rgba[base] = token % 256;
      rgba[base + 1] = (token >> 3) % 256;
      rgba[base + 2] = (token >> 7) % 256;
      rgba[base + 3] = 255;
    }
  }

  ctx.logger.warn("Using placeholder frozen-decoder bridge; image fidelity is not representative.");
  return {
    pngBytes: encodeRgbaAsPng(pixelWidth, pixelHeight, rgba),
  };
}

function encodeRgbaAsPng(width: number, height: number, rgba: Uint8Array): Uint8Array {
  const signature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  writeU32(ihdr, 0, width);
  writeU32(ihdr, 4, height);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const scanlineLength = width * 4 + 1;
  const raw = new Uint8Array(scanlineLength * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * scanlineLength;
    raw[rowStart] = 0; // no filter
    const sourceStart = y * width * 4;
    raw.set(rgba.subarray(sourceStart, sourceStart + width * 4), rowStart + 1);
  }

  const idat = deflateSync(raw);
  const ihdrChunk = createChunk("IHDR", ihdr);
  const idatChunk = createChunk("IDAT", idat);
  const iendChunk = createChunk("IEND", new Uint8Array(0));

  return concatUint8Arrays(signature, ihdrChunk, idatChunk, iendChunk);
}

function createChunk(type: string, data: Uint8Array): Uint8Array {
  const output = new Uint8Array(8 + data.length + 4);
  writeU32(output, 0, data.length);
  output[4] = type.charCodeAt(0);
  output[5] = type.charCodeAt(1);
  output[6] = type.charCodeAt(2);
  output[7] = type.charCodeAt(3);
  output.set(data, 8);
  const crc = crc32(output.subarray(4, 8 + data.length));
  writeU32(output, 8 + data.length, crc);
  return output;
}

function concatUint8Arrays(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let cursor = 0;
  for (const part of parts) {
    output.set(part, cursor);
    cursor += part.length;
  }
  return output;
}

function writeU32(target: Uint8Array, offset: number, value: number): void {
  target[offset] = (value >>> 24) & 255;
  target[offset + 1] = (value >>> 16) & 255;
  target[offset + 2] = (value >>> 8) & 255;
  target[offset + 3] = value & 255;
}

function crc32(data: Uint8Array): number {
  let crc = -1;
  for (let index = 0; index < data.length; index += 1) {
    const byte = data[index];
    if (byte === undefined) {
      continue;
    }
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ -1) >>> 0;
}
