import { n as consumeResponseBytes, t as decodeTextPrefix } from "./src-CZ2wJvNB.mjs";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as retryAsync } from "./src-D4OikzaT.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.mjs";
import { t as formatErrorMessage } from "./error-utils-6idLpSHC.mjs";
import "./runtime-snapshots-CBozwlR0.mjs";
import { V as requireApiKey } from "./loader-runtime-load-XbrcYJWd.mjs";
import { M as withRemoteHttpResponse, N as createProviderHttpError, P as readEmbeddingVectors, j as buildRemoteBaseUrlPolicy } from "./gateway-startup-plugin-config-AVh0bjkO.mjs";
import { l as runMemoryHostTasksWithConcurrency } from "./internal-CDL7w83q.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
import "./multimodal-BBZswXZ7.mjs";
import "./memory-embedding-provider-runtime-GODJ08xg.mjs";
import "./openclaw-runtime-memory-CN3Vnxp5.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-BnUd_lfW.mjs";
//#region packages/memory-host-sdk/src/host/batch-error-utils.ts
const BATCH_ERROR_DETAIL_MAX_CHARS = 500;
const BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX = "... [truncated]";
const EMBEDDING_BATCH_UNAVAILABLE_CODE = "embedding_batch_unavailable";
/** Signals that a provider cannot run the configured embedding batch operation. */
var EmbeddingBatchUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = EMBEDDING_BATCH_UNAVAILABLE_CODE;
		this.name = "EmbeddingBatchUnavailableError";
	}
};
function isEmbeddingBatchUnavailableError(error) {
	if (!error || typeof error !== "object") return false;
	try {
		return error.code === EMBEDDING_BATCH_UNAVAILABLE_CODE;
	} catch {
		return false;
	}
}
/** Pull a nested response error message without assuming a fixed provider body shape. */
function getResponseErrorMessage(line) {
	const body = line?.response?.body;
	if (typeof body === "string") return body || line?.response?.message || void 0;
	if (!body || typeof body !== "object") return line?.response?.message || void 0;
	return body.error?.message || line?.response?.message || void 0;
}
/** Return the first useful error message from batch output lines. */
function extractBatchErrorMessage(lines) {
	const first = lines.find((line) => line.error?.message || getResponseErrorMessage(line));
	return first?.error?.message || getResponseErrorMessage(first);
}
/** Redact and bound provider-controlled batch diagnostics before logging them. */
function formatBatchErrorDetail(detail) {
	if (!detail) return;
	const formatted = formatErrorMessage(detail);
	if (formatted.length <= BATCH_ERROR_DETAIL_MAX_CHARS) return formatted;
	return `${truncateUtf16Safe(formatted, 485)}${BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX}`;
}
/** Format a failed error-file read without hiding the underlying read problem. */
function formatUnavailableBatchError(err) {
	const message = formatBatchErrorDetail(formatErrorMessage(err));
	return message ? `error file unavailable: ${message}` : void 0;
}
//#endregion
//#region packages/memory-host-sdk/src/host/response-snippet.ts
const DEFAULT_ERROR_BODY_MAX_BYTES = 8192;
const DEFAULT_ERROR_BODY_MAX_CHARS = 1e3;
const DEFAULT_JSON_BODY_MAX_BYTES = 67108864;
const TRUNCATED_SUFFIX = "... [truncated]";
/** Read a small collapsed text snippet from a response body. */
async function readMemoryHostResponseTextSnippet(res, options = {}) {
	const maxBytes = options.maxBytes ?? DEFAULT_ERROR_BODY_MAX_BYTES;
	const maxChars = options.maxChars ?? DEFAULT_ERROR_BODY_MAX_CHARS;
	const prefix = await readResponsePrefix(res, maxBytes, options.signal);
	if (prefix.length === 0) return "";
	const collapsed = decodeTextPrefix(joinChunks(prefix.bytes, prefix.length), { truncated: prefix.truncated }).replace(/\s+/g, " ").trim();
	if (!collapsed) return "";
	if (prefix.truncated || collapsed.length > maxChars) return `${truncateUtf16Safe(collapsed, maxChars)}${TRUNCATED_SUFFIX}`;
	return collapsed;
}
/** Read and parse JSON while enforcing a hard byte limit. */
async function readResponseJsonWithLimit(res, options) {
	const maxBytes = options.maxBytes ?? DEFAULT_JSON_BODY_MAX_BYTES;
	const contentLength = parseContentLength(res.headers.get("content-length"), options.errorPrefix);
	if (typeof contentLength === "number" && contentLength > maxBytes) {
		await cancelResponseBody(res);
		throw responseTooLarge(options.errorPrefix, contentLength, maxBytes);
	}
	const prefix = await readResponsePrefix(res, maxBytes, options.signal, options.errorPrefix);
	const text = new TextDecoder("utf-8", { fatal: true }).decode(joinChunks(prefix.bytes, prefix.length));
	try {
		return JSON.parse(text);
	} catch (cause) {
		throw new Error(`${options.errorPrefix}: malformed JSON response`, { cause });
	}
}
function toAbortError(signal, fallbackMessage) {
	return signal.reason instanceof Error ? signal.reason : new Error(fallbackMessage);
}
async function readChunkWithAbort(reader, signal, fallbackMessage) {
	if (!signal) return await reader.read();
	if (signal.aborted) {
		reader.cancel().catch(() => void 0);
		throw toAbortError(signal, fallbackMessage);
	}
	let removeAbortListener;
	const abortPromise = new Promise((_resolve, reject) => {
		const onAbort = () => {
			reject(toAbortError(signal, fallbackMessage));
			reader.cancel().catch(() => void 0);
		};
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
	});
	try {
		return await Promise.race([reader.read(), abortPromise]);
	} finally {
		removeAbortListener?.();
	}
}
async function readResponsePrefix(res, maxBytes, signal, errorPrefix) {
	const body = res.body;
	if (!body || typeof body.getReader !== "function") return {
		bytes: [],
		length: 0,
		truncated: false
	};
	const reader = body.getReader();
	const chunks = [];
	let result;
	try {
		result = await consumeResponseBytes({
			maxBytes,
			stopAtLimit: errorPrefix === void 0,
			read: () => readChunkWithAbort(reader, signal, errorPrefix === void 0 ? "Response snippet body read aborted" : `${errorPrefix}: response body read aborted`),
			onChunk: (chunk) => chunks.push(chunk),
			onLimit: (size) => {
				reader.cancel().catch(() => void 0);
				if (errorPrefix !== void 0) throw responseTooLarge(errorPrefix, size, maxBytes);
			}
		});
	} finally {
		try {
			reader.releaseLock();
		} catch {}
	}
	return {
		bytes: chunks,
		length: result.truncated ? Math.max(0, maxBytes) : result.size,
		truncated: result.truncated
	};
}
async function cancelResponseBody(res) {
	const body = res.body;
	if (!body || typeof body.cancel !== "function") return;
	body.cancel().catch(() => void 0);
}
function parseContentLength(raw, errorPrefix) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	if (!/^\d+$/.test(trimmed)) throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
	const value = Number(trimmed);
	if (!Number.isSafeInteger(value)) throw new Error(`${errorPrefix}: invalid content-length header: ${raw}`);
	return value;
}
function responseTooLarge(errorPrefix, size, maxBytes) {
	return new Error(responseTooLargeMessage(errorPrefix, size, maxBytes));
}
function responseTooLargeMessage(errorPrefix, size, maxBytes) {
	return `${errorPrefix}: response body too large: ${size} bytes (limit: ${maxBytes} bytes)`;
}
function joinChunks(chunks, length) {
	if (chunks.length === 1 && chunks[0]?.length === length) return chunks[0];
	const joined = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		joined.set(chunk, offset);
		offset += chunk.length;
	}
	return joined;
}
//#endregion
//#region packages/memory-host-sdk/src/host/post-json.ts
/** POST JSON, parse bounded response JSON, and preserve provider error metadata. */
async function postJson(params) {
	return await withRemoteHttpResponse({
		url: params.url,
		ssrfPolicy: params.ssrfPolicy,
		fetchImpl: params.fetchImpl,
		signal: params.signal,
		init: {
			method: "POST",
			headers: params.headers,
			body: JSON.stringify(params.body)
		},
		onResponse: async (res) => {
			if (!res.ok) throw await createProviderHttpError(res, params.errorPrefix, {
				requestHeaders: params.headers,
				signal: params.signal,
				maxBodyBytes: 8192
			});
			const payload = await readResponseJsonWithLimit(res, {
				errorPrefix: params.errorPrefix,
				maxBytes: params.maxResponseBytes,
				signal: params.signal
			});
			return await params.parse(payload);
		}
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-http.ts
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
async function postJsonWithRetry(params) {
	return await (params.retryImpl ?? retryAsync)(async () => {
		return await postJson({
			url: params.url,
			headers: params.headers,
			ssrfPolicy: params.ssrfPolicy,
			fetchImpl: params.fetchImpl,
			body: params.body,
			errorPrefix: params.errorPrefix,
			parse: async (payload) => payload
		});
	}, {
		attempts: 3,
		minDelayMs: 300,
		maxDelayMs: 2e3,
		jitter: .2,
		shouldRetry: (err) => {
			const status = err.status;
			return status === 429 || typeof status === "number" && status >= 500;
		}
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-output.ts
const DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES = 4194304;
const INITIAL_BATCH_OUTPUT_RECORD_BYTES = 65536;
/** Stream bounded JSONL records without buffering the provider output file. */
async function readEmbeddingBatchJsonl(response, options) {
	const reader = response.body?.getReader();
	if (!reader) return;
	const maxRecordBytes = options.maxRecordBytes ?? DEFAULT_BATCH_OUTPUT_RECORD_MAX_BYTES;
	const decoder = new TextDecoder("utf-8", { fatal: true });
	let recordCount = 0;
	let recordBytes = 0;
	let recordBuffer;
	const appendRecordPart = (part) => {
		if (part.byteLength === 0) return;
		const nextRecordBytes = recordBytes + part.byteLength;
		if (nextRecordBytes > maxRecordBytes) throw new Error(`${options.label}: JSONL record exceeds ${maxRecordBytes} bytes`);
		if (!recordBuffer || recordBuffer.byteLength < nextRecordBytes) {
			const nextCapacity = Math.min(maxRecordBytes, Math.max(nextRecordBytes, recordBuffer ? recordBuffer.byteLength * 2 : Math.min(INITIAL_BATCH_OUTPUT_RECORD_BYTES, maxRecordBytes)));
			const nextBuffer = new Uint8Array(nextCapacity);
			if (recordBuffer) nextBuffer.set(recordBuffer.subarray(0, recordBytes));
			recordBuffer = nextBuffer;
		}
		recordBuffer.set(part, recordBytes);
		recordBytes = nextRecordBytes;
	};
	const emitRecord = () => {
		recordCount += 1;
		if (recordCount > options.maxRecords) throw new Error(`${options.label}: JSONL output exceeds ${options.maxRecords} records`);
		let text;
		try {
			text = decoder.decode(recordBuffer?.subarray(0, recordBytes)).trim();
		} catch {
			recordBytes = 0;
			throw new Error(`${options.label}: malformed JSONL record`);
		}
		recordBytes = 0;
		if (!text) return true;
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch {
			throw new Error(`${options.label}: malformed JSONL record`);
		}
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`${options.label}: malformed JSONL record`);
		return options.onRecord(parsed);
	};
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			let offset = 0;
			for (let index = 0; index < value.byteLength; index += 1) {
				if (value[index] !== 10) continue;
				appendRecordPart(value.subarray(offset, index));
				if (!emitRecord()) {
					reader.cancel().catch(() => {});
					return;
				}
				offset = index + 1;
			}
			appendRecordPart(value.subarray(offset));
		}
		if (recordBytes > 0) emitRecord();
	} catch (error) {
		reader.cancel().catch(() => {});
		throw error;
	} finally {
		reader.releaseLock();
	}
}
/** Apply one output line, collecting errors and successful embeddings by custom id. */
function applyEmbeddingBatchOutputLine(params) {
	const customId = params.line.custom_id;
	if (!customId) return;
	params.remaining.delete(customId);
	const errorMessage = params.line.error?.message;
	if (errorMessage) {
		params.errors.push(`${customId}: ${errorMessage}`);
		return;
	}
	const response = params.line.response;
	if ((response?.status_code ?? 0) >= 400) {
		const messageFromObject = response?.body && typeof response.body === "object" ? response.body.error?.message : void 0;
		const messageFromString = typeof response?.body === "string" ? response.body : void 0;
		params.errors.push(`${customId}: ${messageFromObject || messageFromString || response?.message || "unknown error"}`);
		return;
	}
	const embedding = (response?.body && typeof response.body === "object" ? response.body.data ?? [] : [])[0]?.embedding ?? [];
	if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every(Number.isFinite)) {
		params.errors.push(`${customId}: ${embedding?.length ? "invalid" : "empty"} embedding`);
		return;
	}
	params.byCustomId.set(customId, embedding);
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-provider-common.ts
/** OpenAI-compatible endpoint used inside embedding batch request lines. */
const EMBEDDING_BATCH_ENDPOINT = "/v1/embeddings";
//#endregion
//#region packages/memory-host-sdk/src/host/batch-status.ts
const TERMINAL_FAILURE_STATES = /* @__PURE__ */ new Set([
	"failed",
	"expired",
	"cancelled",
	"canceled"
]);
/** Convert a completed provider status payload into output/error file ids. */
function resolveBatchCompletionFromStatus(params) {
	if (!params.status.output_file_id) throw new Error(`${params.provider} batch ${params.batchId} completed without output file`);
	return {
		outputFileId: params.status.output_file_id,
		errorFileId: params.status.error_file_id ?? void 0
	};
}
/** Fail a completed partial/all-error batch before requiring its success file. */
async function throwIfBatchCompletionError(params) {
	if (params.status.status !== "completed" || !params.status.error_file_id) return;
	const detail = await params.readError(params.status.error_file_id);
	throw new Error(`${params.provider} batch ${params.status.id ?? "<unknown>"} completed: ${detail ?? "provider error file present"}`);
}
/** Throw when a provider reports a terminal failure, including error-file detail if available. */
async function throwIfBatchTerminalFailure(params) {
	const state = params.status.status ?? "unknown";
	if (!TERMINAL_FAILURE_STATES.has(state)) return;
	const detail = params.status.error_file_id ? await params.readError(params.status.error_file_id) : void 0;
	const suffix = detail ? `: ${detail}` : "";
	throw new Error(`${params.provider} batch ${params.status.id ?? "<unknown>"} ${state}${suffix}`);
}
/** Resolve the completed batch files, optionally waiting according to caller policy. */
async function resolveCompletedBatchResult(params) {
	const batchId = params.status.id ?? "<unknown>";
	if (!params.wait && params.status.status !== "completed") throw new Error(`${params.provider} batch ${batchId} submitted; enable remote.batch.wait to await completion`);
	const completed = params.status.status === "completed" ? resolveBatchCompletionFromStatus({
		provider: params.provider,
		batchId,
		status: params.status
	}) : await params.waitForBatch();
	if (!completed.outputFileId) throw new Error(`${params.provider} batch ${batchId} completed without output file`);
	return completed;
}
/**
* Share compatible status transitions while callers retain the canonical
* deadline and transport owners; only a supplied backoff policy retries reads.
*/
async function waitForEmbeddingBatch(params) {
	const label = `${params.provider} batch ${params.batchId}`;
	const backoff = params.backoff;
	const maxDelayMs = backoff ? Math.max(params.pollIntervalMs, Math.min(params.timeoutMs, backoff.maxDelayMs)) : params.pollIntervalMs;
	let nextPollDelayMs = params.pollIntervalMs;
	const nextDelayMs = () => {
		const delay = nextPollDelayMs;
		nextPollDelayMs = Math.min(maxDelayMs, delay * 2);
		return delay;
	};
	let current = params.initial;
	while (true) {
		let status;
		let statusSignal;
		try {
			if (current) status = current;
			else {
				statusSignal = AbortSignal.timeout(params.resolveTimeoutMs());
				status = await params.fetchStatus(statusSignal);
			}
		} catch (error) {
			if (statusSignal?.aborted) throw new Error(`${label} timed out after ${params.timeoutMs}ms`, { cause: error });
			if (!params.wait || !backoff?.shouldRetry(error)) throw error;
			const delayMs = nextDelayMs();
			params.debug?.(`${label} status check failed: ${backoff.formatError(error)}; waiting up to ${delayMs}ms`);
			try {
				await params.waitForPoll(delayMs);
				params.resolveTimeoutMs();
			} catch {
				throw new Error(`${label} timed out after ${params.timeoutMs}ms`, { cause: error });
			}
			current = void 0;
			continue;
		}
		const state = status.status ?? "unknown";
		await throwIfBatchCompletionError({
			provider: params.provider,
			status: {
				...status,
				id: params.batchId
			},
			readError: params.readError
		});
		if (state === "completed") return resolveBatchCompletionFromStatus({
			provider: params.provider,
			batchId: params.batchId,
			status
		});
		await throwIfBatchTerminalFailure({
			provider: params.provider,
			status: {
				...status,
				id: params.batchId
			},
			readError: params.readError
		});
		if (!params.wait) throw new Error(`${label} still ${state}; wait disabled`);
		const waitMs = backoff ? nextDelayMs() : Math.min(params.pollIntervalMs, params.resolveTimeoutMs());
		params.debug?.(backoff ? `${label} ${state}${backoff.formatProgress(status)}; waiting up to ${waitMs}ms` : `${label} ${state}; waiting ${waitMs}ms`);
		await params.waitForPoll(waitMs);
		params.resolveTimeoutMs();
		current = void 0;
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-utils.ts
/** Normalize batch API base URLs by removing one trailing slash. */
function normalizeBatchBaseUrl(client) {
	return client.baseUrl?.replace(/\/$/, "") ?? "";
}
/** Build request headers, preserving caller auth and controlling JSON/form content type. */
function buildBatchHeaders(client, params) {
	const headers = client.headers ? { ...client.headers } : {};
	if (params.json) {
		if (!headers["Content-Type"] && !headers["content-type"]) headers["Content-Type"] = "application/json";
	} else {
		delete headers["Content-Type"];
		delete headers["content-type"];
	}
	return headers;
}
const jsonlEncoder = new TextEncoder();
function estimateJsonlLineBytes(request) {
	return jsonlEncoder.encode(JSON.stringify(request) ?? "").byteLength;
}
function normalizePositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function splitBatchRequestsByLimits(requests, limits) {
	const maxRequests = normalizePositiveInteger(limits.maxRequests) ?? 1;
	const maxJsonlBytes = normalizePositiveInteger(limits.maxJsonlBytes);
	if (requests.length === 0) return maxJsonlBytes ? [] : [requests];
	const groups = [];
	let current = [];
	let currentBytes = 0;
	for (const request of requests) {
		const requestBytes = estimateJsonlLineBytes(request);
		const separatorBytes = current.length === 0 ? 0 : 1;
		const wouldExceedRequests = current.length >= maxRequests;
		const wouldExceedBytes = maxJsonlBytes !== void 0 && current.length > 0 && currentBytes + separatorBytes + requestBytes > maxJsonlBytes;
		if (current.length > 0 && (wouldExceedRequests || wouldExceedBytes)) {
			groups.push(current);
			current = [];
			currentBytes = 0;
		}
		currentBytes += (current.length === 0 ? 0 : 1) + requestBytes;
		current.push(request);
	}
	if (current.length > 0) groups.push(current);
	return groups;
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-runner.ts
/** Clamp polling to both configured poll interval and total timeout budget. */
function resolveEmbeddingBatchPollIntervalMs(params) {
	const safePollIntervalMs = resolveSafeTimeoutDelayMs(params.pollIntervalMs);
	const safeTimeoutMs = typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs) && params.timeoutMs > 0 ? resolveSafeTimeoutDelayMs(params.timeoutMs) : safePollIntervalMs;
	return Math.min(safePollIntervalMs, safeTimeoutMs);
}
/** Run request groups with bounded concurrency and return embeddings by custom id. */
async function runEmbeddingBatchGroups(params) {
	if (params.requests.length === 0) return /* @__PURE__ */ new Map();
	const groups = splitBatchRequestsByLimits(params.requests, {
		maxRequests: params.maxRequests,
		maxJsonlBytes: params.maxJsonlBytes
	});
	const byCustomId = /* @__PURE__ */ new Map();
	const pollIntervalMs = resolveEmbeddingBatchPollIntervalMs(params);
	const runGroup = async (group, groupIndex, depth = 0) => {
		try {
			await params.runGroup({
				group,
				groupIndex,
				groups: groups.length,
				byCustomId,
				pollIntervalMs,
				timeoutMs: params.timeoutMs
			});
		} catch (error) {
			if (group.length <= 1 || !params.shouldSplitGroupOnError?.(error, group)) throw error;
			const splitAt = Math.ceil(group.length / 2);
			const parts = [group.slice(0, splitAt), group.slice(splitAt)].filter((part) => part.length > 0);
			params.onSplitGroup?.({
				error,
				group,
				parts,
				groupIndex,
				groups: groups.length,
				depth
			});
			for (const part of parts) await runGroup(part, groupIndex, depth + 1);
		}
	};
	const tasks = groups.map((group, groupIndex) => async () => {
		await runGroup(group, groupIndex);
	});
	params.debug?.(params.debugLabel, {
		requests: params.requests.length,
		groups: groups.length,
		maxRequests: params.maxRequests,
		maxJsonlBytes: params.maxJsonlBytes,
		wait: params.wait,
		concurrency: params.concurrency,
		pollIntervalMs,
		timeoutMs: params.timeoutMs
	});
	await runMemoryHostTasksWithConcurrency(tasks, params.concurrency);
	return byCustomId;
}
/** Build normalized batch-group options for provider-specific runners. */
function buildEmbeddingBatchGroupOptions(params, options) {
	const pollIntervalMs = resolveEmbeddingBatchPollIntervalMs(params);
	return {
		requests: params.requests,
		maxRequests: options.maxRequests,
		maxJsonlBytes: options.maxJsonlBytes,
		wait: params.wait,
		pollIntervalMs,
		timeoutMs: params.timeoutMs,
		concurrency: params.concurrency,
		debug: params.debug,
		debugLabel: options.debugLabel
	};
}
/** Run compatible batch jobs while providers retain submission, polling, and HTTP ownership. */
async function runEmbeddingBatches(params) {
	return await runEmbeddingBatchGroups({
		...params,
		runGroup: async ({ group, groupIndex, groups, byCustomId, pollIntervalMs, timeoutMs }) => {
			const status = await params.submit(group);
			if (!status.id) throw new Error(`${params.provider} batch create failed: missing batch id`);
			const batchId = status.id;
			params.debug?.(`memory embeddings: ${params.provider} batch created`, {
				batchId,
				status: status.status,
				group: groupIndex + 1,
				groups,
				requests: group.length
			});
			await throwIfBatchCompletionError({
				provider: params.provider,
				status,
				readError: params.readError
			});
			const completed = await resolveCompletedBatchResult({
				provider: params.provider,
				status,
				wait: params.wait,
				waitForBatch: () => params.waitForBatch({
					...status,
					id: batchId
				}, pollIntervalMs, timeoutMs)
			});
			const errors = [];
			const remaining = new Set(group.map((request) => request.custom_id));
			await params.readOutput(completed.outputFileId, async (response) => {
				await readEmbeddingBatchJsonl(response, {
					label: `${params.provider}.batch-file-content`,
					maxRecords: group.length,
					onRecord: (line) => {
						if (line.custom_id && remaining.has(line.custom_id)) applyEmbeddingBatchOutputLine({
							line,
							remaining,
							errors,
							byCustomId
						});
						return errors.length === 0 && remaining.size > 0;
					}
				});
			});
			if (errors.length > 0) throw new Error(`${params.provider} batch ${batchId} failed: ${formatBatchErrorDetail(errors[0]) ?? "unknown error"}`);
			if (remaining.size > 0) throw new Error(`${params.provider} batch ${batchId} missing ${remaining.size} embedding responses`);
		}
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime-auth.ts
/** Resolve a provider API key through the core model-auth runtime. */
const resolveApiKeyForProvider = async (...args) => {
	return (await import("./model-auth-B4xo6b1W.mjs")).resolveApiKeyForProviderCore(...args);
};
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-client.ts
/** Attribution headers for native OpenAI embedding calls. */
function resolveOpenClawAttributionHeaders() {
	const version = typeof process !== "undefined" ? process.env.OPENCLAW_VERSION?.trim() : void 0;
	return {
		originator: "openclaw",
		...version ? { version } : {},
		"User-Agent": version ? `openclaw/${version}` : "openclaw"
	};
}
function normalizeEmbeddingDestinationKey(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		const hostname = parsed.hostname.toLowerCase();
		const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
		const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
		return `${parsed.protocol}//${hostname}:${port}${pathname}${parsed.search}`;
	} catch {
		return;
	}
}
/** Whether provider-owned embedding credentials belong to the selected destination. */
function embeddingProviderOwnsDestination(params) {
	const baseUrlKey = normalizeEmbeddingDestinationKey(params.baseUrl);
	const providerBaseUrlKey = normalizeEmbeddingDestinationKey(params.providerBaseUrl);
	return baseUrlKey !== void 0 && baseUrlKey === providerBaseUrlKey;
}
/** Append an embedding endpoint without changing its destination-owned query. */
function resolveEmbeddingEndpointUrl(baseUrl, endpoint) {
	const url = new URL(baseUrl);
	url.pathname = `${url.pathname.replace(/\/+$/u, "")}/${endpoint.replace(/^\/+/, "")}`;
	url.hash = "";
	return url.toString();
}
function resolveEmbeddingHeaders(...sources) {
	const resolved = /* @__PURE__ */ new Map();
	for (const source of sources) {
		const headers = {};
		for (const [name, value] of Object.entries(source.headers ?? {})) {
			const header = resolveMemorySecretInputString({
				value,
				path: `${source.path}.${name}`
			});
			if (header) headers[name] = header;
		}
		for (const entry of Object.entries(headers)) resolved.set(entry[0].toLowerCase(), entry);
	}
	return resolved;
}
/** Detect the native OpenAI embeddings API route that accepts attribution headers. */
function isNativeOpenAIEmbeddingRoute(provider, baseUrl) {
	if (provider !== "openai") return false;
	try {
		return new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
	} catch {
		return false;
	}
}
/** Resolve base URL, bearer headers, header overrides, and SSRF policy for remote embeddings. */
async function resolveRemoteEmbeddingBearerClient(params) {
	const remote = params.options.remote;
	const remoteApiKey = resolveMemorySecretInputString({
		value: remote?.apiKey,
		path: "memory.search.remote.apiKey"
	});
	const remoteBaseUrl = normalizeOptionalString(remote?.baseUrl);
	const providerConfig = params.options.config.models?.providers?.[params.provider];
	const providerBaseUrl = normalizeOptionalString(providerConfig?.baseUrl) || params.defaultBaseUrl;
	const baseUrl = remoteBaseUrl || providerBaseUrl;
	const providerOwnsDestination = embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl
	});
	const headerOverrides = resolveEmbeddingHeaders({
		headers: providerOwnsDestination ? providerConfig?.headers : void 0,
		path: `models.providers.${params.provider}.headers`
	}, {
		headers: remote?.headers,
		path: "memory.search.remote.headers"
	});
	const hasExplicitAuthorization = headerOverrides.has("authorization");
	const apiKey = hasExplicitAuthorization ? void 0 : remoteApiKey ? remoteApiKey : providerOwnsDestination ? requireApiKey(await resolveApiKeyForProvider({
		provider: params.provider,
		cfg: params.options.config,
		agentDir: params.options.agentDir
	}), params.provider) : void 0;
	if (!apiKey && !hasExplicitAuthorization) throw new Error(`${params.provider} embedding credentials are not configured for ${baseUrl}. Set memory.search.remote.apiKey or an Authorization header for this destination.`);
	const entries = [["Content-Type", "application/json"]];
	if (apiKey) entries.push(["Authorization", `Bearer ${apiKey}`]);
	entries.push(...headerOverrides.values());
	if (isNativeOpenAIEmbeddingRoute(params.provider, baseUrl)) entries.push(...Object.entries(resolveOpenClawAttributionHeaders()));
	return {
		baseUrl,
		headers: Object.fromEntries(new Map(entries.map((entry) => [entry[0].toLowerCase(), entry])).values()),
		ssrfPolicy: buildRemoteBaseUrlPolicy(baseUrl)
	};
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-upload.ts
/** Upload embedding batch requests and return the provider file id. */
async function uploadBatchJsonlFile(params) {
	const jsonl = params.requests.map((request) => JSON.stringify(request)).join("\n");
	const form = new FormData();
	form.append("purpose", "batch");
	form.append("file", new Blob([jsonl], { type: "application/jsonl" }), `memory-embeddings.${hashText(String(Date.now()))}.jsonl`);
	const filePayload = await withRemoteHttpResponse({
		url: resolveEmbeddingEndpointUrl(params.client.baseUrl ?? "", "files"),
		ssrfPolicy: params.client.ssrfPolicy,
		fetchImpl: params.client.fetchImpl,
		signal: params.signal,
		init: {
			method: "POST",
			headers: buildBatchHeaders(params.client, { json: false }),
			body: form
		},
		onResponse: async (fileRes) => {
			if (!fileRes.ok) {
				const text = await readMemoryHostResponseTextSnippet(fileRes, { signal: params.signal });
				throw new Error(`${params.errorPrefix}: ${fileRes.status} ${formatErrorMessage(text)}`);
			}
			return await readResponseJsonWithLimit(fileRes, {
				errorPrefix: params.errorPrefix,
				maxBytes: params.maxResponseBytes,
				signal: params.signal
			});
		}
	});
	if (!filePayload.id) throw new Error(`${params.errorPrefix}: missing file id`);
	return filePayload.id;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.ts
const normalizedDebugEmbeddings = normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_DEBUG_MEMORY_EMBEDDINGS);
const debugEmbeddings = parseBoolean(normalizedDebugEmbeddings) ?? [
	"1",
	"on",
	"yes"
].includes(normalizedDebugEmbeddings);
/** Write embedding debug metadata when OPENCLAW_DEBUG_MEMORY_EMBEDDINGS is enabled. */
function debugEmbeddingsLog(message, meta) {
	if (!debugEmbeddings) return;
	const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
	console.warn(`${message}${suffix}`);
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-model-normalize.ts
/** Trim a configured model id, fall back when empty, and strip known prefixes. */
function normalizeEmbeddingModelWithPrefixes(params) {
	const trimmed = params.model.trim();
	if (!trimmed) return params.defaultModel;
	for (const prefix of params.prefixes) if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	return trimmed;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-fetch.ts
/** POST an embedding request and return validated vectors in request order. */
async function fetchRemoteEmbeddingVectors(params) {
	return await postJson({
		url: params.url,
		headers: params.headers,
		ssrfPolicy: params.ssrfPolicy,
		fetchImpl: params.fetchImpl,
		signal: params.signal,
		body: params.body,
		errorPrefix: params.errorPrefix,
		parse: (payload) => {
			const input = asOptionalRecord(params.body)?.input;
			return readEmbeddingVectors(asOptionalRecord(payload)?.data, Array.isArray(input) ? input.length : void 0, params.errorPrefix);
		}
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-provider.ts
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
function createRemoteEmbeddingProvider(params) {
	const { client } = params;
	const url = resolveEmbeddingEndpointUrl(client.baseUrl, "embeddings");
	const embedMany = async (input, signal, kind = "document") => {
		if (input.length === 0) return [];
		return await fetchRemoteEmbeddingVectors({
			url,
			headers: client.headers,
			ssrfPolicy: client.ssrfPolicy,
			fetchImpl: client.fetchImpl,
			signal,
			body: {
				...params.buildRequestFields?.(kind),
				model: client.model,
				input
			},
			errorPrefix: params.errorPrefix
		});
	};
	return {
		id: params.id,
		model: client.model,
		...typeof params.maxInputTokens === "number" ? { maxInputTokens: params.maxInputTokens } : {},
		embed: async (input, options) => {
			const text = typeof input === "string" ? input : input.text;
			const [vec] = await embedMany([text], options?.signal, options?.inputType === "query" ? "query" : "document");
			return vec ?? [];
		},
		embedBatch: async (inputs, options) => {
			const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
			if (options?.inputType === "query" && params.batchQueryInputs !== true) return await Promise.all(texts.map(async (text) => (await embedMany([text], options.signal, "query"))[0] ?? []));
			return await embedMany(texts, options?.signal, options?.inputType === "query" ? "query" : "document");
		}
	};
}
/** Resolve a normalized remote embedding client from provider config and model options. */
async function resolveRemoteEmbeddingClient(params) {
	const { baseUrl, headers, ssrfPolicy } = await resolveRemoteEmbeddingBearerClient({
		provider: params.provider,
		options: params.options,
		defaultBaseUrl: params.defaultBaseUrl
	});
	return {
		baseUrl,
		headers,
		ssrfPolicy,
		model: params.normalizeModel(params.options.model)
	};
}
//#endregion
//#region src/plugin-sdk/memory-core-host-engine-embeddings.ts
/**
* @deprecated Load-only bridge for published llama.cpp provider releases from before the
* managed llama-server cutover. Remove after managed releases have replaced the old npm
* latest and extended-stable packages and their upgrade window has closed.
*/
function createLocalEmbeddingProvider(..._args) {
	return Promise.reject(/* @__PURE__ */ new Error("The legacy in-process llama.cpp embedding runtime is retired. Run `openclaw update repair` to install the managed llama-server provider, then restart OpenClaw."));
}
//#endregion
export { readEmbeddingBatchJsonl as C, formatBatchErrorDetail as D, extractBatchErrorMessage as E, formatUnavailableBatchError as O, applyEmbeddingBatchOutputLine as S, EmbeddingBatchUnavailableError as T, resolveCompletedBatchResult as _, normalizeEmbeddingModelWithPrefixes as a, waitForEmbeddingBatch as b, embeddingProviderOwnsDestination as c, buildEmbeddingBatchGroupOptions as d, runEmbeddingBatchGroups as f, resolveBatchCompletionFromStatus as g, normalizeBatchBaseUrl as h, fetchRemoteEmbeddingVectors as i, isEmbeddingBatchUnavailableError as k, resolveEmbeddingEndpointUrl as l, buildBatchHeaders as m, createRemoteEmbeddingProvider as n, debugEmbeddingsLog as o, runEmbeddingBatches as p, resolveRemoteEmbeddingClient as r, uploadBatchJsonlFile as s, createLocalEmbeddingProvider as t, resolveRemoteEmbeddingBearerClient as u, throwIfBatchCompletionError as v, postJsonWithRetry as w, EMBEDDING_BATCH_ENDPOINT as x, throwIfBatchTerminalFailure as y };
