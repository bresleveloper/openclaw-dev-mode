import { Co as withRemoteHttpResponse, Qo as uploadBatchJsonlFile, fs as postJsonWithRetry, os as EmbeddingBatchExecutionParams } from "../../types-BVLQjFJF.js";
import { n as VoyageEmbeddingClient } from "../../embedding-provider-Bj7Vd4wC.js";

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
type VoyageBatchDeps = {
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  postJsonWithRetry: typeof postJsonWithRetry;
  uploadBatchJsonlFile: typeof uploadBatchJsonlFile;
  withRemoteHttpResponse: typeof withRemoteHttpResponse;
};
declare function runVoyageEmbeddingBatches(params: {
  client: VoyageEmbeddingClient;
  agentId: string;
  requests: VoyageBatchRequest[];
  deps?: Partial<VoyageBatchDeps>;
} & EmbeddingBatchExecutionParams): Promise<Map<string, number[]>>;
//#endregion
export { runVoyageEmbeddingBatches };