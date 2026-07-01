import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { h as readResponseTextLimited } from "./provider-http-errors-DLfoTBpx.js";
import "./string-coerce-runtime-BiZzULo_.js";
import "./provider-http-B13K4lug.js";
import { C as withRemoteHttpResponse, T as formatUnavailableBatchError, _ as buildBatchHeaders, b as applyEmbeddingBatchOutputLine, d as uploadBatchJsonlFile, f as resolveBatchCompletionFromStatus, g as runEmbeddingBatchGroups, h as buildEmbeddingBatchGroupOptions, m as throwIfBatchTerminalFailure, p as resolveCompletedBatchResult, v as normalizeBatchBaseUrl, w as extractBatchErrorMessage, x as postJsonWithRetry, y as EMBEDDING_BATCH_ENDPOINT } from "./memory-core-host-engine-embeddings-S1TIPzGc.js";
//#region extensions/openai/embedding-batch.ts
const OPENAI_BATCH_ENDPOINT = EMBEDDING_BATCH_ENDPOINT;
const OPENAI_BATCH_COMPLETION_WINDOW = "24h";
const OPENAI_BATCH_MAX_REQUESTS = 5e4;
const OPENAI_BATCH_MAX_JSONL_BYTES = 190 * 1024 * 1024;
const OPENAI_BATCH_MAX_POLL_BACKOFF_MS = 5 * 6e4;
const OPENAI_BATCH_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
async function submitOpenAiBatch(params) {
	const baseUrl = normalizeBatchBaseUrl(params.openAi);
	const inputFileId = await uploadBatchJsonlFile({
		client: params.openAi,
		requests: params.requests,
		errorPrefix: "openai batch file upload failed"
	});
	return await postJsonWithRetry({
		url: `${baseUrl}/batches`,
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
		errorPrefix: "openai batch status",
		parse: async (res) => await res.json()
	});
}
async function fetchOpenAiFileContent(params) {
	return await fetchOpenAiBatchResource({
		openAi: params.openAi,
		path: `/files/${params.fileId}/content`,
		errorPrefix: "openai batch file content",
		parse: async (res) => await res.text()
	});
}
async function fetchOpenAiBatchResource(params) {
	return await withRemoteHttpResponse({
		url: `${normalizeBatchBaseUrl(params.openAi)}${params.path}`,
		ssrfPolicy: params.openAi.ssrfPolicy,
		fetchImpl: params.openAi.fetchImpl,
		init: { headers: buildBatchHeaders(params.openAi, { json: true }) },
		onResponse: async (res) => {
			if (!res.ok) {
				const text = await readResponseTextLimited(res, OPENAI_BATCH_ERROR_BODY_LIMIT_BYTES);
				throw new Error(`${params.errorPrefix} failed: ${res.status} ${text}`);
			}
			return await params.parse(res);
		}
	});
}
function formatOpenAiBatchError(error) {
	return error instanceof Error ? error.message : String(error);
}
function isOpenAiBatchUploadTooLargeError(error) {
	const message = formatOpenAiBatchError(error);
	if (!/openai batch file upload failed/i.test(message)) return false;
	return /\b413\b/.test(message) || /payload too large/i.test(message) || /request body too large/i.test(message) || /file too large/i.test(message) || /maximum allowed/i.test(message) || /max(?:imum)? (?:body|payload|file) (?:size )?(?:exceeded|limit)/i.test(message);
}
function parseOpenAiBatchOutput(text) {
	if (!text.trim()) return [];
	return normalizeStringEntries(text.split("\n")).map((line) => {
		try {
			return JSON.parse(line);
		} catch {
			throw new Error("OpenAI embedding batch output contained malformed JSONL");
		}
	});
}
async function readOpenAiBatchError(params) {
	try {
		return extractBatchErrorMessage(parseOpenAiBatchOutput(await fetchOpenAiFileContent({
			openAi: params.openAi,
			fileId: params.errorFileId
		})));
	} catch (err) {
		return formatUnavailableBatchError(err);
	}
}
function createOpenAiBatchPollBackoff(params) {
	const maxDelayMs = Math.max(params.pollIntervalMs, Math.min(params.timeoutMs, OPENAI_BATCH_MAX_POLL_BACKOFF_MS));
	let delayMs = params.pollIntervalMs;
	return { nextDelayMs: () => {
		const current = delayMs;
		delayMs = Math.min(maxDelayMs, current * 2);
		return current;
	} };
}
function formatOpenAiBatchProgress(status) {
	const counts = status.request_counts;
	if (!counts || typeof counts.total !== "number") return "";
	const completed = typeof counts.completed === "number" ? counts.completed : 0;
	const failed = typeof counts.failed === "number" ? counts.failed : 0;
	return `; progress ${completed}/${counts.total} failed=${failed}`;
}
function formatOpenAiBatchPollError(error) {
	return error instanceof Error ? error.message : String(error);
}
function isRetryableOpenAiBatchPollError(error) {
	const message = formatOpenAiBatchPollError(error);
	return /openai batch status failed: (408|409|425|429|5\d\d)\b/i.test(message) || /\b(ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN)\b|fetch failed|network error/i.test(message);
}
async function waitForOpenAiBatch(params) {
	const start = Date.now();
	const pollBackoff = createOpenAiBatchPollBackoff(params);
	let current = params.initial;
	while (true) {
		let status;
		try {
			status = current ?? await fetchOpenAiBatchStatus({
				openAi: params.openAi,
				batchId: params.batchId
			});
		} catch (error) {
			if (!params.wait || !isRetryableOpenAiBatchPollError(error)) throw error;
			if (Date.now() - start > params.timeoutMs) throw new Error(`openai batch ${params.batchId} timed out after ${params.timeoutMs}ms`, { cause: error });
			const delayMs = pollBackoff.nextDelayMs();
			params.debug?.(`openai batch ${params.batchId} status check failed: ${formatOpenAiBatchPollError(error)}; waiting ${delayMs}ms`);
			await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
			current = void 0;
			continue;
		}
		const state = status.status ?? "unknown";
		if (state === "completed") return resolveBatchCompletionFromStatus({
			provider: "openai",
			batchId: params.batchId,
			status
		});
		await throwIfBatchTerminalFailure({
			provider: "openai",
			status: {
				...status,
				id: params.batchId
			},
			readError: async (errorFileId) => await readOpenAiBatchError({
				openAi: params.openAi,
				errorFileId
			})
		});
		if (!params.wait) throw new Error(`openai batch ${params.batchId} still ${state}; wait disabled`);
		if (Date.now() - start > params.timeoutMs) throw new Error(`openai batch ${params.batchId} timed out after ${params.timeoutMs}ms`);
		const delayMs = pollBackoff.nextDelayMs();
		params.debug?.(`openai batch ${params.batchId} ${state}${formatOpenAiBatchProgress(status)}; waiting ${delayMs}ms`);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		current = void 0;
	}
}
async function runOpenAiEmbeddingBatches(params) {
	return await runEmbeddingBatchGroups({
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
				error: formatOpenAiBatchError(error)
			});
		},
		runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
			const batchInfo = await submitOpenAiBatch({
				openAi: params.openAi,
				requests: group,
				agentId: params.agentId
			});
			if (!batchInfo.id) throw new Error("openai batch create failed: missing batch id");
			const batchId = batchInfo.id;
			params.debug?.("memory embeddings: openai batch created", {
				batchId: batchInfo.id,
				status: batchInfo.status,
				group: groupIndex + 1,
				groups,
				requests: group.length
			});
			const completed = await resolveCompletedBatchResult({
				provider: "openai",
				status: batchInfo,
				wait: params.wait,
				waitForBatch: async () => await waitForOpenAiBatch({
					openAi: params.openAi,
					batchId,
					wait: params.wait,
					pollIntervalMs,
					timeoutMs,
					debug: params.debug,
					initial: batchInfo
				})
			});
			const outputLines = parseOpenAiBatchOutput(await fetchOpenAiFileContent({
				openAi: params.openAi,
				fileId: completed.outputFileId
			}));
			const errors = [];
			const remaining = new Set(group.map((request) => request.custom_id));
			for (const line of outputLines) applyEmbeddingBatchOutputLine({
				line,
				remaining,
				errors,
				byCustomId
			});
			if (errors.length > 0) throw new Error(`openai batch ${batchInfo.id} failed: ${errors.join("; ")}`);
			if (remaining.size > 0) throw new Error(`openai batch ${batchInfo.id} missing ${remaining.size} embedding responses`);
		}
	});
}
//#endregion
export { parseOpenAiBatchOutput as n, runOpenAiEmbeddingBatches as r, OPENAI_BATCH_ENDPOINT as t };
