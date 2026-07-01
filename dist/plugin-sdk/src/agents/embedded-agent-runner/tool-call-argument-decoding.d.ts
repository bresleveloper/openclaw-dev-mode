import type { StreamFn } from "../runtime/index.js";
/** Recursively decodes common HTML entities in string leaves of an object graph. */
export declare function decodeHtmlEntitiesInObject(value: unknown): unknown;
/** Wraps a stream function so tool-call arguments are decoded before consumers inspect them. */
export declare function createHtmlEntityToolCallArgumentDecodingWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
