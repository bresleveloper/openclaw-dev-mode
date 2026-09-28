import { EMBEDDING_BATCH_ENDPOINT, buildBatchHeaders, buildEmbeddingBatchGroupOptions, extractBatchErrorMessage, formatBatchErrorDetail, formatUnavailableBatchError, postJsonWithRetry, resolveEmbeddingEndpointUrl, runEmbeddingBatches, uploadBatchJsonlFile, waitForEmbeddingBatch, withRemoteHttpResponse } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
import { assertOkOrThrowProviderError, createProviderOperationDeadline, readProviderJsonResponse, resolveProviderOperationTimeoutMs, waitProviderOperationPollInterval } from "openclaw/plugin-sdk/provider-http";
import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { normalizeStringEntries } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/voyage/embedding-batch.ts
const VOYAGE_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const VOYAGE_BATCH_COMPLETION_WINDOW = "12h";
const VOYAGE_BATCH_MAX_REQUESTS = 5e4;
const VOYAGE_BATCH_RESPONSE_MAX_BYTES = 16777216;
function buildVoyageBatchRequest(params) {
	return {
		url: resolveEmbeddingEndpointUrl(params.client.baseUrl, params.path),
		ssrfPolicy: params.client.ssrfPolicy,
		signal: params.signal,
		init: { headers: buildBatchHeaders(params.client, { json: true }) },
		onResponse: params.onResponse
	};
}
async function submitVoyageBatch(params) {
	const inputFileId = await uploadBatchJsonlFile({
		client: params.client,
		requests: params.requests,
		errorPrefix: "voyage batch file upload failed"
	});
	return await postJsonWithRetry({
		url: resolveEmbeddingEndpointUrl(params.client.baseUrl, "batches"),
		headers: buildBatchHeaders(params.client, { json: true }),
		ssrfPolicy: params.client.ssrfPolicy,
		body: {
			input_file_id: inputFileId,
			endpoint: VOYAGE_BATCH_ENDPOINT,
			completion_window: VOYAGE_BATCH_COMPLETION_WINDOW,
			request_params: {
				model: params.client.model,
				input_type: "document"
			},
			metadata: {
				source: "clawdbot-memory",
				agent: params.agentId
			}
		},
		errorPrefix: "voyage batch create failed"
	});
}
async function fetchVoyageBatchStatus(params) {
	return await withRemoteHttpResponse(buildVoyageBatchRequest({
		client: params.client,
		path: `batches/${params.batchId}`,
		signal: params.signal,
		onResponse: async (res) => {
			await assertOkOrThrowProviderError(res, "voyage.batch-status");
			return await readProviderJsonResponse(res, "voyage-batch-status", { maxBytes: VOYAGE_BATCH_RESPONSE_MAX_BYTES });
		}
	}));
}
async function readVoyageBatchError(params) {
	try {
		return await withRemoteHttpResponse(buildVoyageBatchRequest({
			client: params.client,
			path: `files/${params.errorFileId}/content`,
			onResponse: async (res) => {
				await assertOkOrThrowProviderError(res, "voyage.batch-error-file-content");
				const bytes = await readResponseWithLimit(res, VOYAGE_BATCH_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`voyage batch error file content exceeds ${maxBytesLocal} bytes`) });
				const text = new TextDecoder().decode(bytes);
				if (!text.trim()) return;
				const lines = normalizeStringEntries(text.split("\n")).map((line) => JSON.parse(line));
				return formatBatchErrorDetail(extractBatchErrorMessage(lines));
			}
		}));
	} catch (err) {
		return formatUnavailableBatchError(err);
	}
}
async function runVoyageEmbeddingBatches(params) {
	return await runEmbeddingBatches({
		provider: "voyage",
		...buildEmbeddingBatchGroupOptions(params, {
			maxRequests: VOYAGE_BATCH_MAX_REQUESTS,
			debugLabel: "memory embeddings: voyage batch submit"
		}),
		submit: (group) => submitVoyageBatch({
			client: params.client,
			requests: group,
			agentId: params.agentId
		}),
		readError: (errorFileId) => readVoyageBatchError({
			client: params.client,
			errorFileId
		}),
		readOutput: (fileId, read) => withRemoteHttpResponse(buildVoyageBatchRequest({
			client: params.client,
			path: `files/${fileId}/content`,
			onResponse: async (response) => {
				await assertOkOrThrowProviderError(response, "voyage.batch-file-content");
				await read(response);
			}
		})),
		waitForBatch: async (batchInfo, pollIntervalMs, timeoutMs) => {
			const batchId = batchInfo.id;
			const client = params.client;
			const wait = params.wait;
			const debug = params.debug;
			const deadline = createProviderOperationDeadline({
				label: `voyage batch ${batchId}`,
				timeoutMs
			});
			return await waitForEmbeddingBatch({
				provider: "voyage",
				batchId,
				wait,
				pollIntervalMs,
				timeoutMs,
				debug,
				initial: batchInfo,
				fetchStatus: (signal) => fetchVoyageBatchStatus({
					client,
					batchId,
					signal
				}),
				resolveTimeoutMs: () => resolveProviderOperationTimeoutMs({
					deadline,
					defaultTimeoutMs: timeoutMs
				}),
				waitForPoll: (delayMs) => waitProviderOperationPollInterval({
					deadline,
					pollIntervalMs: delayMs
				}),
				readError: async (errorFileId) => await readVoyageBatchError({
					client,
					errorFileId
				})
			});
		}
	});
}
//#endregion
export { runVoyageEmbeddingBatches };
