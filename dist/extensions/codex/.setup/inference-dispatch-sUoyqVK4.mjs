import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { n as readCodexInferenceMetadata } from "./inference-metadata-BLz9LKvW.mjs";
import { t as CODEX_INFERENCE_TRANSPORT_FAILURE } from "./inference-transport-CEu6bcj7.mjs";
import { promisify } from "node:util";
import { zstdCompress, zstdDecompress } from "node:zlib";
import { isUtf8 } from "node:buffer";
import { createPermitPool } from "openclaw/plugin-sdk/concurrency-runtime";
import { getDefaultHighWaterMark } from "node:stream";
// extensions/codex/src/app-server/inference-upload.ts
const MAX_BODY_BYTES = 33554432;
function createUploadAdmission() {
	const permits = createPermitPool(16);
	let outstanding = 0;
	let queuedBytes = 0;
	return async (signal, deadlineAtMs, bytes = 0) => {
		const queued = outstanding >= 16;
		if (outstanding >= 32 || queued && queuedBytes + bytes > 33554432) return null;
		outstanding++;
		if (queued) queuedBytes += bytes;
		const releasePermit = await permits.acquire({
			signal,
			deadlineAtMs
		});
		if (queued) queuedBytes -= bytes;
		let released = false;
		const release = () => {
			if (released) return;
			released = true;
			outstanding--;
			releasePermit?.();
		};
		if (!releasePermit || signal.aborted) {
			release();
			return null;
		}
		return release;
	};
}
function createUploadBody(bytes, signal, release) {
	const length = bytes.length;
	const chunkSize = getDefaultHighWaterMark(false);
	let remaining = bytes;
	let offset = 0;
	const settle = () => {
		remaining = void 0;
		signal.removeEventListener("abort", settle);
		release();
	};
	signal.addEventListener("abort", settle, { once: true });
	if (signal.aborted) settle();
	return {
		body: new ReadableStream({
			pull(controller) {
				signal.throwIfAborted();
				if (!remaining || offset === length) {
					settle();
					controller.close();
					return;
				}
				const end = Math.min(offset + chunkSize, length);
				controller.enqueue(Uint8Array.from(remaining.subarray(offset, end)));
				offset = end;
			},
			cancel: settle
		}, { highWaterMark: 0 }),
		length,
		settle
	};
}
/** Retain one bounded upload under its original permit until OAuth accepts it or retries once. */
function createRetryableUploadBody(bytes, signal, release) {
	let replay = bytes;
	let firstActive = true;
	let uploaded = false;
	let active = createUploadBody(bytes, signal, () => {
		uploaded = true;
		if (firstActive && !replay) release();
	});
	return {
		body: active.body,
		length: active.length,
		commit() {
			replay = void 0;
			if (firstActive && uploaded) release();
		},
		retry() {
			signal.throwIfAborted();
			if (!replay) throw new Error("Codex inference upload cannot be replayed");
			firstActive = false;
			active.settle();
			active = createUploadBody(replay, signal, release);
			replay = void 0;
			return active.body;
		},
		settle() {
			replay = void 0;
			active.settle();
			release();
		}
	};
}
// extensions/codex/src/app-server/inference-dispatch.ts
const compress = promisify(zstdCompress);
const decompress = promisify(zstdDecompress);
/** An ephemeral caller already holds model authority; it cannot start child/background work. */
function createCodexBoundedInferenceModelBinding(params) {
	return (request) => {
		params.assertCurrent();
		request.signal.throwIfAborted();
		if (request.path !== "/responses" || request.body.model !== params.model || request.metadata.requestKind !== "turn" || request.metadata.parentThreadId || request.metadata.subagent || request.metadata.subagentKind) throw new CodexInferenceAuthorizationError("owner");
		return {
			assertCurrent: params.assertCurrent,
			release: () => {}
		};
	};
}
/** Only host-owned authorization failures may cross the private transport boundary. */
var CodexInferenceAuthorizationError = class extends Error {
	constructor(reason) {
		super(reason === "model" ? "Your operator role cannot use this model. Choose an allowed model or ask a gateway administrator to update your role's model policy." : "Codex cannot verify the owner of this model request. Start a fresh request before retrying.");
	}
};
function authorizationFailure(error) {
	if (!(error instanceof CodexInferenceAuthorizationError)) return;
	return JSON.stringify({
		type: "error",
		status: 403,
		error: {
			type: "invalid_request_error",
			code: "model_permission_denied",
			message: error.message
		}
	});
}
/**
* A request body over the relay limit is deterministic: replaying the same history on a
* fresh connection cannot make it fit, so it must not look like a transport failure.
*/
var CodexInferenceRequestTooLargeError = class extends Error {
	constructor() {
		super(`Request exceeds the maximum size accepted by the Codex inference relay (${MAX_BODY_BYTES} bytes).`);
	}
};
/** Native Codex maps status 400 to a terminal invalid request; 5xx and other statuses replay. */
function requestTooLargeFailure(error) {
	if (!(error instanceof CodexInferenceRequestTooLargeError)) return;
	return JSON.stringify({
		type: "error",
		status: 400,
		error: {
			type: "invalid_request_error",
			code: "request_too_large",
			message: error.message
		}
	});
}
/** The route supplies its selected provider; native custody supplies the execution's source. */
function createCodexInferenceModelBinding(params) {
	const { assertCurrent: assertClient, provider } = params;
	const refuseOwner = (error, signal) => {
		signal.throwIfAborted();
		assertClient();
		throw error instanceof CodexInferenceAuthorizationError ? error : new CodexInferenceAuthorizationError("owner");
	};
	return async ({ path, body, metadata, signal, transport }) => {
		assertClient();
		signal.throwIfAborted();
		if (typeof body.model !== "string" || !body.model.trim() || transport === "websocket" && (body.type !== "response.create" || ![
			"/responses",
			"/guardian",
			"/guardian-classifier"
		].includes(path)) || ![
			"/responses",
			"/responses/compact",
			"/alpha/search",
			"/images/generations",
			"/images/edits",
			"/guardian",
			"/guardian-classifier"
		].includes(path)) throw new CodexInferenceAuthorizationError("owner");
		const reviewer = metadata.subagent === "guardian" && metadata.threadSource === "guardian_review";
		const classifier = metadata.subagent === "guardian" && metadata.threadSource === "guardian_classifier";
		if (path === "/guardian" && !reviewer || path === "/guardian-classifier" && !classifier || path === "/responses/compact" && metadata.requestKind !== "compaction") throw new CodexInferenceAuthorizationError("owner");
		const memory = metadata.threadSource === "memory_consolidation" && (metadata.requestKind === "memory" || metadata.subagent === "memory_consolidation");
		if (path === "/responses" && metadata.requestKind === "prewarm" && body.generate === false || memory && params.memoryConfigured() && path === "/responses") return {
			assertCurrent: assertClient,
			release: () => {}
		};
		const parentExecution = reviewer || classifier || metadata.subagent === "review";
		const imageTurnId = metadata.nativeImageTurnId;
		const threadId = imageTurnId ? params.resolveModelThreadId({
			client: params.client,
			turnId: imageTurnId
		}) : parentExecution ? classifier ? metadata.guardianClassifierSourceThreadId : metadata.parentThreadId : metadata.threadId;
		const turnId = imageTurnId ?? (parentExecution ? metadata.parentTurnId : metadata.turnId);
		if (!threadId || !turnId || memory) throw new CodexInferenceAuthorizationError("owner");
		let acquired;
		try {
			acquired = await params.captureModelSource({
				client: params.client,
				threadId,
				turnId,
				...parentExecution ? { rootTurnId: metadata.rootTurnId } : {
					parentThreadId: metadata.parentThreadId,
					parentTurnId: metadata.parentTurnId,
					rootTurnId: metadata.rootTurnId
				},
				signal
			});
		} catch (error) {
			refuseOwner(error, signal);
		}
		if (!acquired) throw new CodexInferenceAuthorizationError("owner");
		const captured = acquired;
		const cancelNativeTurn = () => {
			if (!imageTurnId) captured.cancel();
		};
		let model;
		let releaseAbort = () => {};
		const release = () => {
			releaseAbort();
			model?.release();
			captured.release();
		};
		try {
			captured.assertCurrent();
			signal.throwIfAborted();
			assertClient();
			if (reviewer || classifier) {
				if (!captured.nativeReviewRequired) throw new CodexInferenceAuthorizationError("owner");
			} else if (captured.source) {
				const bind = captured.source.bindModelExecution;
				if (!bind) throw new CodexInferenceAuthorizationError("owner");
				try {
					const mapping = captured.modelMapping;
					const accessPrograms = body.access_programs;
					if (accessPrograms !== void 0 && !isJsonObject(accessPrograms)) throw new CodexInferenceAuthorizationError("model");
					const cyber = isJsonObject(accessPrograms) ? accessPrograms.cyber : void 0;
					if (cyber !== void 0 && cyber !== "standard" && cyber !== "daybreak_blue" && cyber !== "daybreak_red") throw new CodexInferenceAuthorizationError("model");
					const selection = params.modelPolicyEnforced === false ? void 0 : mapping?.nativeModel.provider === provider && mapping.nativeModel.model === body.model ? mapping.authorizedModel : {
						provider,
						model: body.model
					};
					model = bind(selection && {
						...selection,
						cyberAccessProgram: cyber ?? "standard"
					});
				} catch {
					cancelNativeTurn();
					throw new CodexInferenceAuthorizationError("model");
				}
				if (!model) throw new CodexInferenceAuthorizationError("owner");
				model.signal.addEventListener("abort", cancelNativeTurn, { once: true });
				releaseAbort = () => model?.signal.removeEventListener("abort", cancelNativeTurn);
				if (model.signal.aborted) cancelNativeTurn();
			}
			if (!parentExecution) captured.recordNativeReviewRequirement(metadata.autoReviewEnabled === true || metadata.nodeReplAutoReviewRequired === true);
			const assertExecution = () => {
				assertClient();
				try {
					captured.assertCurrent();
					model?.assertCurrent();
				} catch (error) {
					refuseOwner(error, signal);
				}
			};
			assertExecution();
			return {
				assertCurrent: assertExecution,
				signal: model?.signal ?? captured.source?.signal,
				release
			};
		} catch (error) {
			release();
			return refuseOwner(error, signal);
		}
	};
}
/** One preparation path binds both HTTP requests and reusable WebSocket frames. */
function createCodexInferenceDispatch(params) {
	const { context, assertCurrent } = params;
	const prepare = async (bytes, path, headers, signal, transport) => {
		assertCurrent();
		const sampling = path === "/responses";
		let execution;
		let released = false;
		const release = () => {
			if (!released) {
				released = true;
				execution?.release();
			}
		};
		try {
			const value = sampling || params.bindModelExecution ? JSON.parse(bytes.toString("utf8")) : void 0;
			if ((sampling || params.bindModelExecution) && !isJsonObject(value)) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
			let metadata;
			if (isJsonObject(value)) {
				try {
					metadata = readCodexInferenceMetadata(value, headers, transport, path);
				} catch (error) {
					if (params.bindModelExecution) throw new CodexInferenceAuthorizationError("owner");
					throw error;
				}
				execution = await params.bindModelExecution?.({
					path,
					body: value,
					headers,
					metadata,
					transport,
					signal
				});
			}
			signal.throwIfAborted();
			const prepared = sampling && isJsonObject(value) ? context.prepare(value, metadata, params.requireAdmission) : void 0;
			const assertPrepared = () => {
				if (released) throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
				assertCurrent();
				signal.throwIfAborted();
				prepared?.assertCurrent();
				execution?.assertCurrent();
			};
			assertPrepared();
			const rewritten = prepared && (prepared.body !== value || !isUtf8(bytes)) ? Buffer.from(JSON.stringify(prepared.body)) : bytes;
			if (rewritten.length > 33554432) throw new CodexInferenceRequestTooLargeError();
			return {
				bytes: rewritten,
				assertCurrent: assertPrepared,
				signal: AbortSignal.any([
					signal,
					...prepared?.signal ? [prepared.signal] : [],
					...execution?.signal ? [execution.signal] : []
				]),
				contextSignal: prepared?.signal,
				release
			};
		} catch (error) {
			release();
			throw error;
		}
	};
	const prepareHttp = async (req, path, signal, release, retryable = false) => {
		const wire = await readProxyBody(req, MAX_BODY_BYTES, () => new CodexInferenceRequestTooLargeError());
		const encoding = req.headers["content-encoding"];
		if (encoding && encoding !== "identity" && encoding !== "zstd") throw new Error(CODEX_INFERENCE_TRANSPORT_FAILURE);
		const decoded = encoding === "zstd" ? await decompress(wire, { maxOutputLength: MAX_BODY_BYTES }).catch((error) => {
			throw error instanceof Error && "code" in error && error.code === "ERR_BUFFER_TOO_LARGE" ? new CodexInferenceRequestTooLargeError() : error;
		}) : wire;
		signal.throwIfAborted();
		const prepared = await prepare(decoded, path, req.headers, signal, "http");
		try {
			const body = prepared.bytes === decoded ? wire : encoding === "zstd" ? await compress(prepared.bytes) : prepared.bytes;
			prepared.assertCurrent();
			return {
				...retryable ? createRetryableUploadBody(body, prepared.signal, release) : {
					...createUploadBody(body, prepared.signal, release),
					retry: void 0,
					commit: void 0
				},
				assertCurrent: prepared.assertCurrent,
				signal: prepared.signal,
				releaseModelExecution: prepared.release
			};
		} catch (error) {
			prepared.release();
			throw error;
		}
	};
	return {
		prepare,
		prepareHttp
	};
}
async function readProxyBody(stream, maxBytes, oversized = () => new Error(CODEX_INFERENCE_TRANSPORT_FAILURE)) {
	const chunks = [];
	let size = 0;
	for await (const chunk of stream) {
		const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += bytes.length;
		if (size > maxBytes) throw oversized();
		chunks.push(bytes);
	}
	return Buffer.concat(chunks);
}
const TERMINAL_RESPONSE_CANDIDATE = /response\.(?:completed|failed|incomplete)|\\u/u;
function isTerminalResponse(bytes) {
	const text = bytes.toString("utf8");
	if (!TERMINAL_RESPONSE_CANDIDATE.test(text)) return false;
	try {
		const event = JSON.parse(text);
		return isJsonObject(event) && (event.type === "response.failed" || event.type === "response.incomplete" || event.type === "response.completed" && isJsonObject(event.response) && typeof event.response.id === "string");
	} catch {
		return false;
	}
}
export { CodexInferenceAuthorizationError, CodexInferenceRequestTooLargeError, authorizationFailure, createCodexBoundedInferenceModelBinding, createCodexInferenceDispatch, createCodexInferenceModelBinding, isTerminalResponse, createUploadAdmission as n, readProxyBody, requestTooLargeFailure, MAX_BODY_BYTES as t };
