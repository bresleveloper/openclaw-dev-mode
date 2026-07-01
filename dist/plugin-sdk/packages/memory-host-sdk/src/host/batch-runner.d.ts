/** Execution controls for provider embedding batch submissions and polling. */
export type EmbeddingBatchExecutionParams = {
    wait: boolean;
    pollIntervalMs: number;
    timeoutMs: number;
    concurrency: number;
    debug?: (message: string, data?: Record<string, unknown>) => void;
};
type EmbeddingBatchGroupRunArgs<TRequest> = {
    group: TRequest[];
    groupIndex: number;
    groups: number;
    byCustomId: Map<string, number[]>;
    pollIntervalMs: number;
    timeoutMs: number;
};
type EmbeddingBatchSplitArgs<TRequest> = {
    error: unknown;
    group: TRequest[];
    parts: TRequest[][];
    groupIndex: number;
    groups: number;
    depth: number;
};
/** Run request groups with bounded concurrency and return embeddings by custom id. */
export declare function runEmbeddingBatchGroups<TRequest>(params: {
    requests: TRequest[];
    maxRequests: number;
    maxJsonlBytes?: number;
    wait: EmbeddingBatchExecutionParams["wait"];
    pollIntervalMs: EmbeddingBatchExecutionParams["pollIntervalMs"];
    timeoutMs: EmbeddingBatchExecutionParams["timeoutMs"];
    concurrency: EmbeddingBatchExecutionParams["concurrency"];
    debugLabel: string;
    debug?: EmbeddingBatchExecutionParams["debug"];
    shouldSplitGroupOnError?: (error: unknown, group: TRequest[]) => boolean;
    onSplitGroup?: (args: EmbeddingBatchSplitArgs<TRequest>) => void;
    runGroup: (args: EmbeddingBatchGroupRunArgs<TRequest>) => Promise<void>;
}): Promise<Map<string, number[]>>;
/** Build normalized batch-group options for provider-specific runners. */
export declare function buildEmbeddingBatchGroupOptions<TRequest>(params: {
    requests: TRequest[];
} & EmbeddingBatchExecutionParams, options: {
    maxRequests: number;
    maxJsonlBytes?: number;
    debugLabel: string;
}): {
    requests: TRequest[];
    maxRequests: number;
    maxJsonlBytes: number | undefined;
    wait: boolean;
    pollIntervalMs: number;
    timeoutMs: number;
    concurrency: number;
    debug: ((message: string, data?: Record<string, unknown>) => void) | undefined;
    debugLabel: string;
};
export {};
