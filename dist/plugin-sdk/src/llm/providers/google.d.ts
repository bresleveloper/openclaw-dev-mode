import type { SimpleStreamOptions, StreamFunction } from "../types.js";
import { type GoogleProviderOptions } from "./google-shared.js";
export type GoogleOptions = GoogleProviderOptions;
export declare const streamGoogle: StreamFunction<"google-generative-ai", GoogleOptions>;
export declare const streamSimpleGoogle: StreamFunction<"google-generative-ai", SimpleStreamOptions>;
