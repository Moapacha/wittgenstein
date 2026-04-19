import type { ImageRequest, PolyglotCodec, RenderCtx, RenderResult } from "@polyglot/schemas";
import { Modality } from "@polyglot/schemas";
import {
  ImageRequestSchema,
  ImageSceneSpecSchema,
  imageSchemaPreamble,
  parseImageSceneSpec,
  type ImageSceneSpec,
} from "./schema.js";
import { renderImagePipeline } from "./pipeline/index.js";

export const imageCodec: PolyglotCodec<ImageRequest, ImageSceneSpec> = {
  name: "image",
  modality: Modality.Image,
  schemaPreamble: imageSchemaPreamble,
  requestSchema: ImageRequestSchema,
  outputSchema: ImageSceneSpecSchema,
  parse: parseImageSceneSpec,
  async render(parsed: ImageSceneSpec, ctx: RenderCtx): Promise<RenderResult> {
    try {
      return await renderImagePipeline(parsed, ctx);
    } catch (error) {
      throw createNotImplementedError("codec: image", error);
    }
  },
};

function createNotImplementedError(scope: string, cause?: unknown): Error & { code: string } {
  return Object.assign(new Error(`NotImplementedError(${scope})`, { cause }), {
    name: "NotImplementedError",
    code: "NOT_IMPLEMENTED",
  });
}
