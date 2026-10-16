import { _ as MaybePromise, y as Model } from "./types.openclaw-DWWUw8hA.js";
import "./index-wBwNmkiI.js";
import { o as ImagesDescriptionRequest, r as ImageDescriptionRequest } from "./types-BooLarQr.js";
//#region src/media-understanding/image-runtime.d.ts
/** Describes one image through the configured media runtime. */
declare const describeImageWithModel: (params: ImageDescriptionRequest) => Promise<{
  text: string;
  model?: string;
}>;
/** Describes multiple images through the configured media runtime. */
declare const describeImagesWithModel: (params: ImagesDescriptionRequest) => Promise<{
  text: string;
  model?: string;
}>;
/** Describes one image after applying the runtime payload transform. */
declare const describeImageWithModelPayloadTransform: (params: ImageDescriptionRequest, onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined) => Promise<{
  text: string;
  model?: string;
}>;
/** Describes multiple images after applying the runtime payload transform. */
declare const describeImagesWithModelPayloadTransform: (params: ImagesDescriptionRequest, onPayload: ((payload: unknown, model: Model) => MaybePromise<unknown>) | undefined) => Promise<{
  text: string;
  model?: string;
}>;
//#endregion
export { describeImagesWithModelPayloadTransform as i, describeImageWithModelPayloadTransform as n, describeImagesWithModel as r, describeImageWithModel as t };