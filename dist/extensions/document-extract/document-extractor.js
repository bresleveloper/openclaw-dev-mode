import { i as resolveRuntimeWorkerUrl } from "../../runtime-worker-url-DoBSDhBS.mjs";
import { t as WorkerTaskPool } from "../../worker-task-pool-iI3pfrsK.mjs";
import { t as documentExtractorWorkerEntrypoint } from "../../document-extractor-worker-entrypoint-DcfMvI4N.mjs";
import "../../process-runtime-CYiH_oPH.mjs";
//#region extensions/document-extract/document-extractor.ts
const pool = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(documentExtractorWorkerEntrypoint),
	maxWorkers: 1,
	sharedCompute: true
});
function createPdfDocumentExtractor() {
	return {
		id: "pdf",
		label: "PDF",
		mimeTypes: ["application/pdf"],
		autoDetectOrder: 10,
		extract: async ({ signal, onImageExtractionError, ...request }) => {
			const reply = await pool.run(request, {
				timeoutMs: 18e4,
				signal,
				inputBytes: request.buffer.byteLength
			});
			signal?.throwIfAborted();
			for (const error of reply.imageErrors) onImageExtractionError?.(error);
			if (reply.status === "failed") throw reply.error;
			return reply.result;
		}
	};
}
//#endregion
export { createPdfDocumentExtractor };
