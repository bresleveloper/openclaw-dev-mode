import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { u as retryAsync } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./error-utils-C1BwZRSn.mjs";
import "./runtime-snapshots-HRosak4u.mjs";
import { f as resolveProviderRequestPolicyConfig } from "./provider-request-config-WdycwKIG.mjs";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-ClVlVfGz.mjs";
import { A as readMemoryHostResponseTextSnippet, N as withRemoteHttpResponse, O as fetchRemoteEmbeddingVectors, P as createProviderHttpError, j as readResponseJsonWithLimit, k as postJson } from "./gateway-startup-plugin-config-Cv_2HdnZ.mjs";
import { t as resolveProviderTransportSsrFPolicy } from "./provider-network-policy-DGvgCdvN.mjs";
import { A as requireApiKey } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import "./multimodal-Di4Q334s.mjs";
import { t as runWithConcurrency } from "./concurrency-BvONODc2.mjs";
import "./memory-embedding-provider-runtime-QhiZ6pba.mjs";
import { n as resolveMemorySecretInputString } from "./secret-input-c4CL7oqZ.mjs";
//#region packages/memory-host-sdk/src/host/batch-response-error.ts
/** Pull a nested response error message without assuming a fixed provider body shape. */
function getBatchResponseError(response) {
	const body = response?.body;
	if (typeof body === "string") return body || response?.message || void 0;
	if (!body || typeof body !== "object") return response?.message || void 0;
	return body.error?.message || response?.message || void 0;
}
//#endregion
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
/** Return the first useful error message from batch output lines. */
function extractBatchErrorMessage(lines) {
	const first = lines.find((line) => line.error?.message || getBatchResponseError(line.response));
	return first?.error?.message || getBatchResponseError(first?.response);
}
/** Redact and bound provider-controlled batch diagnostics before logging them. */
function formatBatchErrorDetail(detail) {
	if (!detail) return;
	return truncateWithMarker(formatErrorMessage(detail), BATCH_ERROR_DETAIL_MAX_CHARS, {
		marker: BATCH_ERROR_DETAIL_TRUNCATED_SUFFIX,
		reserve: 15,
		trimEnd: false
	});
}
/** Format a failed error-file read without hiding the underlying read problem. */
function formatUnavailableBatchError(err) {
	const message = formatBatchErrorDetail(formatErrorMessage(err));
	return message ? `error file unavailable: ${message}` : void 0;
}
//#endregion
//#region packages/memory-host-sdk/src/host/batch-http.ts
/** POST JSON and retry provider 429/5xx failures with bounded backoff. */
async function postJsonWithRetry(params) {
	return await (params.retryImpl ?? retryAsync)(async () => {
		return await postJson({
			...params,
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
		let parsed;
		try {
			const text = decoder.decode(recordBuffer?.subarray(0, recordBytes)).trim();
			recordBytes = 0;
			if (!text) return true;
			parsed = JSON.parse(text);
		} catch {
			recordBytes = 0;
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
		params.errors.push(`${customId}: ${getBatchResponseError(response) || "unknown error"}`);
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
		const requestBytes = Buffer.byteLength(JSON.stringify(request) ?? "", "utf8");
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
			const parts = [group.slice(0, splitAt), group.slice(splitAt)];
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
	const tasks = groups.map((group, groupIndex) => () => runGroup(group, groupIndex));
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
	await runWithConcurrency(tasks, params.concurrency);
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
	return (await import("./model-auth-BajGa6yN.mjs")).resolveApiKeyForProviderCore(...args);
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
	const parsed = URL.parse(baseUrl);
	if (!parsed) return;
	const hostname = parsed.hostname.toLowerCase();
	const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
	const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
	return `${parsed.protocol}//${hostname}:${port}${pathname}${parsed.search}`;
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
	return provider === "openai" && URL.parse(baseUrl)?.hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com";
}
/**
* The recognized native ChatGPT/Codex subscription route. It serves chat
* traffic only — it has no embeddings endpoint, so its base URL must never
* leak into embedding requests. (#165476)
*/
const NATIVE_CHAT_ONLY_SUBSCRIPTION_BASE_URL = "https://chatgpt.com/backend-api/codex";
/**
* Whether the provider is pinned to the recognized native chat-only
* subscription route. The redirect to the adapter default must apply ONLY
* here: matching on the api mode alone would also redirect custom provider
* URLs, misattributing their destination-owned credentials (e.g. a custom
* Authorization header) to the adapter default such as api.openai.com.
*/
function isNativeChatOnlySubscriptionRoute(api, baseUrl) {
	return api === "openai-chatgpt-responses" && normalizeEmbeddingDestinationKey(NATIVE_CHAT_ONLY_SUBSCRIPTION_BASE_URL) === normalizeEmbeddingDestinationKey(baseUrl ?? "");
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
	const providerBaseUrl = isNativeChatOnlySubscriptionRoute(normalizeOptionalString(providerConfig?.api), normalizeOptionalString(providerConfig?.baseUrl)) ? params.defaultBaseUrl : normalizeOptionalString(providerConfig?.baseUrl) || params.defaultBaseUrl;
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
	const resolveAuth = (forceRefresh, signal) => resolveApiKeyForProvider({
		provider: params.provider,
		capability: params.capability,
		modelBaseUrl: baseUrl,
		cfg: params.options.config,
		agentDir: params.options.agentDir,
		forceRefresh,
		signal
	});
	const auth = !hasExplicitAuthorization && !remoteApiKey && providerOwnsDestination ? await resolveAuth(false) : void 0;
	const apiKey = hasExplicitAuthorization ? void 0 : remoteApiKey || (auth ? requireApiKey(auth, params.provider) : void 0);
	if (!apiKey && !hasExplicitAuthorization) throw new Error(`${params.provider} embedding credentials are not configured for ${baseUrl}. Set memory.search.remote.apiKey or an Authorization header for this destination.`);
	const entries = [["Content-Type", "application/json"]];
	if (apiKey && auth?.mode !== "oauth") entries.push(["Authorization", `Bearer ${apiKey}`]);
	entries.push(...headerOverrides.values());
	if (isNativeOpenAIEmbeddingRoute(params.provider, baseUrl)) entries.push(...Object.entries(resolveOpenClawAttributionHeaders()));
	const headers = Object.fromEntries(new Map(entries.map((entry) => [entry[0].toLowerCase(), entry])).values());
	const resolveRequestHeaders = auth?.mode === "oauth" ? async ({ forceRefresh, signal }) => ({ Authorization: `Bearer ${requireApiKey(await resolveAuth(forceRefresh, signal), params.provider)}` }) : void 0;
	return {
		baseUrl,
		headers,
		...resolveRequestHeaders ? { resolveRequestHeaders } : {},
		ssrfPolicy: resolveEmbeddingProviderSsrFPolicy({
			provider: params.provider,
			api: providerConfig?.api ?? "openai-completions",
			baseUrl,
			allowPrivateNetwork: providerConfig?.request?.allowPrivateNetwork
		})
	};
}
/** Embedding adapters share inference's endpoint classification and explicit network policy. */
function resolveEmbeddingProviderSsrFPolicy(params) {
	const policy = resolveProviderRequestPolicyConfig({
		provider: params.provider,
		api: params.api,
		baseUrl: params.baseUrl,
		capability: "other",
		request: { allowPrivateNetwork: params.allowPrivateNetwork }
	});
	return resolveProviderTransportSsrFPolicy({
		baseUrl: params.baseUrl,
		url: params.baseUrl,
		allowPrivateNetwork: policy.allowPrivateNetwork,
		trustConfiguredBaseUrlOrigin: policy.trustConfiguredBaseUrlOrigin
	});
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
		resolveRequestHeaders: params.client.resolveRequestHeaders,
		signal: params.signal,
		init: {
			method: "POST",
			headers: buildBatchHeaders(params.client, { json: false }),
			body: form
		},
		onResponse: async (fileRes, requestHeaders) => {
			if (!fileRes.ok) {
				if (params.client.resolveRequestHeaders) throw await createProviderHttpError(fileRes, params.errorPrefix, {
					requestHeaders,
					signal: params.signal
				});
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
//#region packages/memory-host-sdk/src/host/embeddings-model-normalize.ts
/** Trim a configured model id, fall back when empty, and strip known prefixes. */
function normalizeEmbeddingModelWithPrefixes(params) {
	const trimmed = params.model.trim();
	if (!trimmed) return params.defaultModel;
	for (const prefix of params.prefixes) if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	return trimmed;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-provider.ts
/** Create an EmbeddingProvider backed by a remote embeddings endpoint. */
function createRemoteEmbeddingProvider(params) {
	const { client } = params;
	const url = resolveEmbeddingEndpointUrl(client.baseUrl, "embeddings");
	const embedMany = async (input, options) => {
		if (input.length === 0) return [];
		return await fetchRemoteEmbeddingVectors({
			url,
			headers: client.headers,
			ssrfPolicy: client.ssrfPolicy,
			fetchImpl: client.fetchImpl,
			resolveRequestHeaders: client.resolveRequestHeaders,
			signal: options?.signal,
			onUsage: options?.onUsage,
			body: {
				...params.buildRequestFields?.(options?.inputType === "query" ? "query" : "document"),
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
		maxInputsPerRequest: params.maxInputsPerRequest,
		embed: async (input, options) => {
			const text = typeof input === "string" ? input : input.text;
			const [vec] = await embedMany([text], options);
			return vec ?? [];
		},
		embedBatch: async (inputs, options) => {
			const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
			if (options?.inputType === "query" && params.batchQueryInputs !== true) return await Promise.all(texts.map(async (text) => (await embedMany([text], options))[0] ?? []));
			return await embedMany(texts, options);
		}
	};
}
/** Resolve a normalized remote embedding client from provider config and model options. */
async function resolveRemoteEmbeddingClient(params) {
	const client = await resolveRemoteEmbeddingBearerClient({
		provider: params.provider,
		capability: params.capability,
		options: params.options,
		defaultBaseUrl: params.defaultBaseUrl
	});
	const model = params.normalizeModel(params.options.model);
	return {
		...client,
		model
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
export { isEmbeddingBatchUnavailableError as S, postJsonWithRetry as _, uploadBatchJsonlFile as a, formatBatchErrorDetail as b, resolveEmbeddingProviderSsrFPolicy as c, runEmbeddingBatchGroups as d, runEmbeddingBatches as f, readEmbeddingBatchJsonl as g, EMBEDDING_BATCH_ENDPOINT as h, normalizeEmbeddingModelWithPrefixes as i, resolveRemoteEmbeddingBearerClient as l, waitForEmbeddingBatch as m, createRemoteEmbeddingProvider as n, embeddingProviderOwnsDestination as o, buildBatchHeaders as p, resolveRemoteEmbeddingClient as r, resolveEmbeddingEndpointUrl as s, createLocalEmbeddingProvider as t, buildEmbeddingBatchGroupOptions as u, EmbeddingBatchUnavailableError as v, formatUnavailableBatchError as x, extractBatchErrorMessage as y };
