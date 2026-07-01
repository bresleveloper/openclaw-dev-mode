import type { SimpleStreamOptions, StreamFunction } from "../types.js";
import { type GoogleProviderOptions } from "./google-shared.js";
export interface GoogleVertexOptions extends GoogleProviderOptions {
    project?: string;
    location?: string;
}
export declare const streamGoogleVertex: StreamFunction<"google-vertex", GoogleVertexOptions>;
export declare const streamSimpleGoogleVertex: StreamFunction<"google-vertex", SimpleStreamOptions>;
