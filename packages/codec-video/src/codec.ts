import type { WittgensteinCodec, RenderCtx, RenderResult, VideoRequest } from "@wittgenstein/schemas";
import { Modality } from "@wittgenstein/schemas";
import {
  VideoCompositionSchema,
  VideoRequestSchema,
  parseVideoComposition,
  type VideoComposition,
  videoSchemaPreamble,
} from "./schema.js";
import { renderWithHyperFrames } from "./hyperframes-wrapper.js";

export const videoCodec: WittgensteinCodec<VideoRequest, VideoComposition> = {
  name: "video",
  modality: Modality.Video,
  schemaPreamble: videoSchemaPreamble,
  requestSchema: VideoRequestSchema,
  outputSchema: VideoCompositionSchema,
  parse: parseVideoComposition,
  async render(parsed: VideoComposition, ctx: RenderCtx): Promise<RenderResult> {
    return await renderWithHyperFrames(parsed, ctx);
  },
};
