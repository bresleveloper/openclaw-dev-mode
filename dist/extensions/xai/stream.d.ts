import { T as StreamFn } from "../../types-D0CdrmU4.js";
import { an as ProviderWrapStreamFnContext } from "../../plugin-entry-L7QTXRH5.js";
//#region extensions/xai/stream.d.ts
type DynamicFastMode = boolean | (() => boolean | undefined);
declare function createXaiToolPayloadCompatibilityWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
declare function createXaiFastModeWrapper(baseStreamFn: StreamFn | undefined, fastMode: DynamicFastMode): StreamFn;
declare function wrapXaiProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { createXaiFastModeWrapper, createXaiToolPayloadCompatibilityWrapper, wrapXaiProviderStream };