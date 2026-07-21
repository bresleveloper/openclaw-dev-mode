//#region src/plugin-sdk/memory-core-host-engine-embeddings.d.ts
/** Provider batch status payload shared by memory embedding batch helpers. */
type EmbeddingBatchStatus = {
  id?: string;
  status?: string;
  output_file_id?: string | null;
  error_file_id?: string | null;
};
//#endregion
export { EmbeddingBatchStatus as t };