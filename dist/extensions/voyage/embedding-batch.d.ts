import { Qs as EmbeddingBatchExecutionParams, Ws as uploadBatchJsonlFile, hs as withRemoteHttpResponse, ic as postJsonWithRetry } from "../../types-BpDhk2ev.js";
import { t as EmbeddingBatchStatus } from "../../memory-core-host-engine-embeddings-mqN4TUVX.js";
import { n as VoyageEmbeddingClient } from "../../embedding-provider-CLdZAsbE.js";

//#region extensions/voyage/embedding-batch.d.ts
/**
 * Voyage Batch API Input Line format.
 * See: https://docs.voyageai.com/docs/batch-inference
 */
type VoyageBatchRequest = {
  custom_id: string;
  body: {
    input: string | string[];
  };
};
type VoyageBatchStatus = EmbeddingBatchStatus;
type VoyageBatchDeps = {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  postJsonWithRetry: typeof postJsonWithRetry;
  uploadBatchJsonlFile: typeof uploadBatchJsonlFile;
  withRemoteHttpResponse: typeof withRemoteHttpResponse;
};
declare function fetchVoyageBatchStatus(params: {
  client: VoyageEmbeddingClient;
  batchId: string;
  deps: VoyageBatchDeps;
  maxResponseBytes?: number;
}): Promise<VoyageBatchStatus>;
declare function readVoyageBatchError(params: {
  client: VoyageEmbeddingClient;
  errorFileId: string;
  deps: VoyageBatchDeps;
  maxResponseBytes?: number;
}): Promise<string | undefined>;
declare function runVoyageEmbeddingBatches(params: {
  client: VoyageEmbeddingClient;
  agentId: string;
  requests: VoyageBatchRequest[];
  deps?: Partial<VoyageBatchDeps>;
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
/**
 * Stream-read a Voyage batch output file response body line by line, applying
 * each parsed output line through `applyEmbeddingBatchOutputLine`.
 *
 * The response body is an untrusted external stream. This helper wraps the
 * readline iteration in a try-finally so the readline interface and underlying
 * Node.js Readable are always closed / destroyed, even when JSON.parse or
 * applyEmbeddingBatchOutputLine throws.
 */
declare function readBatchOutputContent(contentRes: Response, remaining: Set<string>, errors: string[], byCustomId: Map<string, number[]>): Promise<void>;
declare const testing: {
  readonly fetchVoyageBatchStatus: typeof fetchVoyageBatchStatus;
  readonly readVoyageBatchError: typeof readVoyageBatchError;
  readonly readBatchOutputContent: typeof readBatchOutputContent;
  readonly VOYAGE_BATCH_RESPONSE_MAX_BYTES: number;
};
//#endregion
export { runVoyageEmbeddingBatches, testing };