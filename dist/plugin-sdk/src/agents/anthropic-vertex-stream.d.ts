import type { StreamFn } from "./runtime/index.js";
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
export declare function createAnthropicVertexStreamFnForModel(model: {
    baseUrl?: string;
}, env?: NodeJS.ProcessEnv): StreamFn;
