import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
//#region src/media-understanding/image-runtime.ts
const loadImageRuntime = createLazyRuntimeModule(() => import("./image-BBbQ2KSd.mjs"));
const bindImageRuntime = createLazyRuntimeMethodBinder(loadImageRuntime);
const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModelCore);
const describeImagesWithModel = bindImageRuntime((runtime) => runtime.describeImagesWithModelCore);
const describeImageWithModelPayloadTransform = bindImageRuntime((runtime) => runtime.describeImageWithModelPayloadTransformCore);
const describeImagesWithModelPayloadTransform = bindImageRuntime((runtime) => runtime.describeImagesWithModelPayloadTransformCore);
//#endregion
export { describeImagesWithModelPayloadTransform as i, describeImageWithModelPayloadTransform as n, describeImagesWithModel as r, describeImageWithModel as t };
