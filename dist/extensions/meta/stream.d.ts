import { T as StreamFn } from "../../types-D0CdrmU4.js";
import { an as ProviderWrapStreamFnContext } from "../../plugin-entry-L7QTXRH5.js";
//#region extensions/meta/stream.d.ts
declare function createMetaResponsesWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
declare function wrapMetaProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { createMetaResponsesWrapper, wrapMetaProviderStream };