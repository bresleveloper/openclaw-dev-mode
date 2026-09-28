import { t as coerceErrorMessage } from "../../error-coercion-C787aVxk.mjs";
import { d as normalizeStringEntries } from "../../string-normalization-_gRhJUDw.mjs";
import { h as readProviderTextResponse, m as readProviderJsonResponse, r as assertOkOrThrowProviderError } from "../../provider-http-errors-CTY_-ABT.mjs";
import { M as withRemoteHttpResponse } from "../../gateway-startup-plugin-config-XCCRUavD.mjs";
import "../../error-runtime-Bf1fYXFh.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { g as waitProviderOperationPollInterval, h as resolveProviderOperationTimeoutMs, r as createProviderOperationDeadline } from "../../shared-BLFkM12I.mjs";
import "../../provider-http-Dn9NddwC.mjs";
import { D as formatBatchErrorDetail, E as extractBatchErrorMessage, O as formatUnavailableBatchError, b as waitForEmbeddingBatch, d as buildEmbeddingBatchGroupOptions, l as resolveEmbeddingEndpointUrl, m as buildBatchHeaders, p as runEmbeddingBatches, s as uploadBatchJsonlFile, w as postJsonWithRetry, x as EMBEDDING_BATCH_ENDPOINT } from "../../memory-core-host-engine-embeddings-CRt6gGvK.mjs";
//#region extensions/openai/embedding-batch.ts
const OPENAI_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const OPENAI_BATCH_COMPLETION_WINDOW = "24h";
const OPENAI_BATCH_MAX_REQUESTS = 5e4;
const OPENAI_BATCH_MAX_JSONL_BYTES = 199229440;
const OPENAI_BATCH_MAX_POLL_BACKOFF_MS = 3e5;
async function submitOpenAiBatch(params) {
	const inputFileId = await uploadBatchJsonlFile({
		client: params.openAi,
		requests: params.requests,
		errorPrefix: "openai batch file upload failed"
	});
	return await postJsonWithRetry({
		url: resolveEmbeddingEndpointUrl(params.openAi.baseUrl, "batches"),
		headers: buildBatchHeaders(params.openAi, { json: true }),
		ssrfPolicy: params.openAi.ssrfPolicy,
		fetchImpl: params.openAi.fetchImpl,
		body: {
			input_file_id: inputFileId,
			endpoint: OPENAI_BATCH_ENDPOINT,
			completion_window: OPENAI_BATCH_COMPLETION_WINDOW,
			metadata: {
				source: "openclaw-memory",
				agent: params.agentId
			}
		},
		errorPrefix: "openai batch create failed"
	});
}
async function fetchOpenAiBatchStatus(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/batches/${params.batchId}`,
		label: "openai.batch-status",
		signal: params.signal,
		parse: async (res) => readProviderJsonResponse(res, "openai.batch-status")
	});
}
async function fetchOpenAiFileContent(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/files/${params.fileId}/content`,
		label: "openai.batch-file-content",
		parse: async (res) => await readProviderTextResponse(res, "openai.batch-file-content")
	});
}
async function fetchOpenAiBatchResource(params) {
	return await withRemoteHttpResponse({
		url: resolveEmbeddingEndpointUrl(params.openAi.baseUrl, params.path),
		ssrfPolicy: params.openAi.ssrfPolicy,
		fetchImpl: params.openAi.fetchImpl,
		signal: params.signal,
		init: { headers: buildBatchHeaders(params.openAi, { json: true }) },
		onResponse: async (res) => {
			await assertOkOrThrowProviderError(res, params.label);
			return await params.parse(res);
		}
	});
}
function formatOpenAiBatchDiagnostic(error) {
	return formatBatchErrorDetail(coerceErrorMessage(error)) ?? "unknown error";
}
function isOpenAiBatchUploadTooLargeError(error) {
	const message = coerceErrorMessage(error);
	if (!/openai batch file upload failed/i.test(message)) return false;
	return /\b413\b/.test(message) || /payload too large/i.test(message) || /request body too large/i.test(message) || /file too large/i.test(message) || /maximum allowed/i.test(message) || /max(?:imum)? (?:body|payload|file) (?:size )?(?:exceeded|limit)/i.test(message);
}
function parseOpenAiBatchOutput(text) {
	if (!text.trim()) return [];
	return normalizeStringEntries(text.split("\n")).map(parseOpenAiBatchOutputLine);
}
function parseOpenAiBatchOutputLine(line) {
	try {
		return JSON.parse(line);
	} catch {
		throw new Error("OpenAI embedding batch output contained malformed JSONL");
	}
}
async function readOpenAiBatchError(params) {
	try {
		const lines = parseOpenAiBatchOutput(await fetchOpenAiFileContent({
			openAi: params.openAi,
			fileId: params.errorFileId
		}));
		return formatBatchErrorDetail(extractBatchErrorMessage(lines));
	} catch (err) {
		return formatUnavailableBatchError(err);
	}
}
function formatOpenAiBatchProgress(status) {
	const counts = status.request_counts;
	if (!counts || typeof counts.total !== "number") return "";
	const completed = typeof counts.completed === "number" ? counts.completed : 0;
	const failed = typeof counts.failed === "number" ? counts.failed : 0;
	return `; progress ${completed}/${counts.total} failed=${failed}`;
}
function isRetryableOpenAiBatchPollError(error) {
	const message = coerceErrorMessage(error);
	const status = error && typeof error === "object" ? error.status : void 0;
	return typeof status === "number" && (status === 408 || status === 409 || status === 425 || status === 429 || status >= 500 && status <= 599) || /\b(ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN)\b|fetch failed|network error/i.test(message);
}
async function runOpenAiEmbeddingBatches(params) {
	return await runEmbeddingBatches({
		provider: "openai",
		...buildEmbeddingBatchGroupOptions(params, {
			maxRequests: OPENAI_BATCH_MAX_REQUESTS,
			maxJsonlBytes: params.maxJsonlBytes ?? OPENAI_BATCH_MAX_JSONL_BYTES,
			debugLabel: "memory embeddings: openai batch submit"
		}),
		shouldSplitGroupOnError: isOpenAiBatchUploadTooLargeError,
		onSplitGroup: ({ error, group, parts, depth }) => {
			params.debug?.("memory embeddings: openai batch upload too large; splitting group", {
				requests: group.length,
				parts: parts.map((part) => part.length),
				depth,
				error: formatOpenAiBatchDiagnostic(error)
			});
		},
		submit: (group) => submitOpenAiBatch({
			openAi: params.openAi,
			requests: group,
			agentId: params.agentId
		}),
		readError: (errorFileId) => readOpenAiBatchError({
			openAi: params.openAi,
			errorFileId
		}),
		readOutput: (fileId, parse) => fetchOpenAiBatchResource({
			openAi: params.openAi,
			path: `/files/${fileId}/content`,
			label: "openai.batch-file-content",
			parse
		}),
		waitForBatch: async (batchInfo, pollIntervalMs, timeoutMs) => {
			const batchId = batchInfo.id;
			const openAi = params.openAi;
			const wait = params.wait;
			const debug = params.debug;
			const deadline = createProviderOperationDeadline({
				label: `openai batch ${batchId}`,
				timeoutMs
			});
			return await waitForEmbeddingBatch({
				provider: "openai",
				batchId,
				wait,
				pollIntervalMs,
				timeoutMs,
				debug,
				initial: batchInfo,
				fetchStatus: (signal) => fetchOpenAiBatchStatus({
					openAi,
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
				readError: async (errorFileId) => await readOpenAiBatchError({
					openAi,
					errorFileId
				}),
				backoff: {
					maxDelayMs: OPENAI_BATCH_MAX_POLL_BACKOFF_MS,
					shouldRetry: isRetryableOpenAiBatchPollError,
					formatError: formatOpenAiBatchDiagnostic,
					formatProgress: formatOpenAiBatchProgress
				}
			});
		}
	});
}
//#endregion
export { OPENAI_BATCH_ENDPOINT, runOpenAiEmbeddingBatches };
