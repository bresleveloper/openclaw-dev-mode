import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
//#region src/media-understanding/image-runtime.ts
const loadImageRuntime = createLazyRuntimeModule(() => import("./image-D4dcU3Pr.mjs"));
const bindImageRuntime = createLazyRuntimeMethodBinder(loadImageRuntime);
/** Describes one image through the configured media runtime. */
const describeImageWithModel = bindImageRuntime((runtime) => runtime.describeImageWithModelCore);
/** Describes multiple images through the configured media runtime. */
const describeImagesWithModel = bindImageRuntime((runtime) => runtime.describeImagesWithModelCore);
/** Describes one image after applying the runtime payload transform. */
const describeImageWithModelPayloadTransform = bindImageRuntime((runtime) => runtime.describeImageWithModelPayloadTransformCore);
/** Describes multiple images after applying the runtime payload transform. */
const describeImagesWithModelPayloadTransform = bindImageRuntime((runtime) => runtime.describeImagesWithModelPayloadTransformCore);
//#endregion
export { describeImagesWithModelPayloadTransform as i, describeImageWithModelPayloadTransform as n, describeImagesWithModel as r, describeImageWithModel as t };
