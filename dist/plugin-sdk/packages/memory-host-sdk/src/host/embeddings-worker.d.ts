import type { LocalEmbeddingProviderRuntimeOptions } from "./embeddings.js";
import type { EmbeddingProvider, EmbeddingProviderOptions } from "./embeddings.types.js";
/** Create the public local embedding provider backed by the child worker client. */
export declare function createLocalEmbeddingWorkerProvider(options: EmbeddingProviderOptions, runtimeOptions?: LocalEmbeddingProviderRuntimeOptions): Promise<EmbeddingProvider>;
