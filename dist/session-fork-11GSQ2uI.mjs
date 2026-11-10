import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { u as normalizeUsage } from "./usage-BqbJmOEZ.mjs";
import { n as withGuardedFetchRequestAuthority } from "./fetch-request-authority-BA1Sa1i8.mjs";
import { t as collectTextContentBlocks } from "./content-blocks-DDtxq3Ff.mjs";
import { i as toNormalizedUsage, r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-Cd3yWsMu.mjs";
import { deserialize, serialize } from "node:v8";
import { isCredentialFieldName, preparedRequestSuffix } from "@openclaw/ai/internal/shared";
import { registerSessionResourceCleanup } from "@openclaw/ai/internal/runtime";
import { getAiTransportHost } from "@openclaw/ai";
import { independentResponsesRequest, modelRequestBodyState, responsesRequestLifecycle } from "@openclaw/ai/internal/openai";
//#region src/agents/embedded-agent-runner/session-fork.ts
const snapshots = /* @__PURE__ */ new Map();
const TTL_MS = 54e5;
const MAX_ENTRIES = 1e3;
const captures = /* @__PURE__ */ new Map();
const MAX_BYTES = 67108864;
const ENTRY_OVERHEAD_BYTES = 2048;
let retainedBytes = 0;
function retainData(value) {
	if (isPlainData(value)) {
		const data = serialize(value);
		return {
			data,
			bytes: 128 + retainedDataBytes(data)
		};
	}
	const detached = structuredClone(value);
	const bytes = 256 + retainedDataBytes(detached);
	return {
		data: getAiTransportHost().runInDetachedAsyncContext(() => detachBlobStorage(detached).then(() => detached)),
		bytes
	};
}
async function readData(value) {
	const data = await value.data;
	return Buffer.isBuffer(data) ? deserialize(data) : structuredClone(data);
}
/** Blob slices share their entire source backing store; retain only visible bytes. */
async function detachBlobStorage(root) {
	const seen = /* @__PURE__ */ new Map();
	const visit = async (value) => {
		if (!value || typeof value !== "object") return value;
		if (seen.has(value)) return seen.get(value);
		if (value instanceof Blob) {
			const copy = value.arrayBuffer().then((bytes) => new Blob([bytes], { type: value.type }));
			seen.set(value, copy);
			return copy;
		}
		seen.set(value, value);
		if (value instanceof Map) {
			const entries = [];
			for (const [key, child] of value) entries.push([await visit(key), await visit(child)]);
			value.clear();
			for (const [key, child] of entries) value.set(key, child);
		} else if (value instanceof Set) {
			const entries = [];
			for (const child of value) entries.push(await visit(child));
			value.clear();
			for (const child of entries) value.add(child);
		} else if (!ArrayBuffer.isView(value) && !(value instanceof ArrayBuffer)) for (const key of value instanceof Error ? Object.hasOwn(value, "cause") ? ["cause"] : [] : Object.keys(value)) Reflect.set(value, key, await visit(Reflect.get(value, key)));
		return value;
	};
	await visit(root);
}
function retireFailedData(snapshot, retained) {
	if (!Buffer.isBuffer(retained.data)) retained.data.catch(() => {
		if (snapshots.get(snapshot.sessionId) === snapshot) clearEmbeddedSessionForkSnapshot(snapshot.sessionId);
	});
}
/** Charge our detached data, never the parent graph or shared transport runtime. */
function retainedDataBytes(value, seen = /* @__PURE__ */ new Set()) {
	if (typeof value === "string") return 32 + value.length * 2;
	if (typeof value === "bigint") return 32 + value.toString(16).length;
	if (!value || typeof value !== "object" || seen.has(value)) return 8;
	seen.add(value);
	if (ArrayBuffer.isView(value)) return 256 + retainedDataBytes(value.buffer, seen);
	if (value instanceof SharedArrayBuffer) throw new Error("Shared memory cannot be retained for isolated fork replay");
	if (value instanceof ArrayBuffer) return 128 + value.byteLength;
	if (value instanceof Blob) return 512 + value.size + retainedDataBytes(value.type, seen);
	if (value instanceof Map || value instanceof Set) {
		let bytes = 256;
		for (const [key, child] of value.entries()) {
			bytes += 64 + retainedDataBytes(key, seen);
			if (value instanceof Map) bytes += retainedDataBytes(child, seen);
		}
		return bytes;
	}
	if (value instanceof Date) return 128;
	if (value instanceof RegExp) return 256 + retainedDataBytes(value.source, seen);
	if (value instanceof Error) return 256 + retainedDataBytes(value.message, seen) + retainedDataBytes(value.stack, seen) + retainedDataBytes(value.cause, seen);
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && prototype !== Object.prototype && prototype !== Array.prototype) throw new Error("Unsupported retained fork data");
	let bytes = 128 + (Array.isArray(value) ? value.length * 8 : 0);
	for (const key of Object.keys(value)) bytes += 64 + retainedDataBytes(key, seen) + retainedDataBytes(Reflect.get(value, key), seen);
	return bytes;
}
function forgetSnapshot(sessionId) {
	const previous = snapshots.get(sessionId);
	if (previous) {
		clearTimeout(previous.expiryTimer);
		retainedBytes -= previous.bytes;
		snapshots.delete(sessionId);
	}
}
function clearEmbeddedSessionForkSnapshot(sessionId) {
	if (sessionId === void 0) {
		for (const id of captures.keys()) clearEmbeddedSessionForkSnapshot(id);
		return;
	}
	const authority = captures.get(sessionId);
	if (authority) {
		authority.active = false;
		retainedBytes -= authority.bytes;
	}
	captures.delete(sessionId);
	forgetSnapshot(sessionId);
}
registerSessionResourceCleanup(clearEmbeddedSessionForkSnapshot);
function prune() {
	const now = Date.now();
	for (const [id, snapshot] of snapshots) if (snapshot.expires <= now || retainedBytes > MAX_BYTES) clearEmbeddedSessionForkSnapshot(id);
}
function safeHeaders(headers) {
	return headers && Object.fromEntries(Object.entries(headers).filter(([key]) => !isCredentialFieldName(key)));
}
/** Record the model-visible publication, including split async calls and their outcomes. */
function recordEmbeddedSessionForkMessage(sessionId, runId, message) {
	const snapshot = snapshots.get(sessionId);
	if (!snapshot || snapshot.runId !== runId || !snapshot.authority.active || snapshot.expires <= Date.now()) return;
	try {
		const completed = retainData(message);
		const bytes = completed.bytes;
		snapshot.publications.push(completed);
		snapshot.bytes += bytes;
		retainedBytes += bytes;
		retireFailedData(snapshot, completed);
		prune();
	} catch {
		clearEmbeddedSessionForkSnapshot(sessionId);
	}
}
/** Installed below host context transforms and above the actual provider transport. */
function wrapStreamFnWithSessionFork(streamFn, identity) {
	return async (model, context, options) => {
		const previous = snapshots.get(identity.sessionId);
		if (previous && (previous.runId !== identity.runId || previous.streamFn !== streamFn)) forgetSnapshot(identity.sessionId);
		if (!captures.has(identity.sessionId) && captures.size >= MAX_ENTRIES) {
			const oldest = captures.keys().next().value;
			if (oldest !== void 0) clearEmbeddedSessionForkSnapshot(oldest);
		}
		const capture = {};
		let authority = captures.get(identity.sessionId);
		if (!authority) {
			authority = {
				active: true,
				capture,
				bytes: 256 + retainedDataBytes(identity.sessionId)
			};
			captures.set(identity.sessionId, authority);
			retainedBytes += authority.bytes;
			prune();
		}
		authority.capture = capture;
		const { apiKey: _apiKey, signal: _signal, onPayload, onResponse: _onResponse, onActiveResponse: _onActiveResponse, ...savedOptions } = options ?? {};
		savedOptions.headers = safeHeaders(savedOptions.headers);
		for (const key of Object.getOwnPropertySymbols(savedOptions)) Reflect.deleteProperty(savedOptions, key);
		for (const key of Object.keys(savedOptions)) if (typeof Reflect.get(savedOptions, key) === "function") Reflect.deleteProperty(savedOptions, key);
		let retainedOptions;
		try {
			retainedOptions = retainData(savedOptions);
			if (!Buffer.isBuffer(retainedOptions.data)) await retainedOptions.data;
		} catch {
			retainedOptions = void 0;
		}
		const save = (savedPayload) => {
			if (!retainedOptions || !authority.active || authority.capture !== capture) return;
			let metadata;
			let bytes;
			try {
				const json = JSON.stringify({
					model: {
						...model,
						headers: safeHeaders(model.headers)
					},
					tools: context.tools?.map(({ name, description, parameters, async }) => ({
						name,
						description,
						parameters,
						...async === false ? { async } : {}
					}))
				});
				metadata = Buffer.allocUnsafeSlow(Buffer.byteLength(json));
				metadata.write(json);
				bytes = ENTRY_OVERHEAD_BYTES + savedPayload.size + retainedDataBytes(metadata) + retainedOptions.bytes + retainedDataBytes(identity.sessionId) + retainedDataBytes(identity.agentId) + retainedDataBytes(identity.runId);
			} catch {
				return;
			}
			forgetSnapshot(identity.sessionId);
			if (bytes <= MAX_BYTES) {
				const snapshot = {
					...identity,
					metadata,
					options: retainedOptions,
					publications: [],
					payload: savedPayload,
					streamFn,
					authority,
					bytes,
					expires: Date.now() + TTL_MS,
					expiryTimer: getAiTransportHost().runInDetachedAsyncContext(() => setTimeout(clearEmbeddedSessionForkSnapshot, TTL_MS, identity.sessionId).unref())
				};
				snapshots.set(identity.sessionId, snapshot);
				retainedBytes += bytes;
			} else clearEmbeddedSessionForkSnapshot(identity.sessionId);
			prune();
		};
		let preparedPayload;
		const capturedOptions = {
			...options,
			onPayload: async (payload, payloadModel) => {
				const replacement = await onPayload?.(payload, payloadModel);
				const finalPayload = replacement === void 0 ? payload : replacement;
				if (modelRequestBodyState(capturedOptions).enabled) preparedPayload = finalPayload;
				else if (isRecord(finalPayload)) save(new Blob([JSON.stringify(finalPayload)]));
				return finalPayload;
			}
		};
		modelRequestBodyState(capturedOptions).onEncoded = (body, payload) => {
			if (!isRecord(payload)) return;
			if (payload.previous_response_id && preparedPayload === void 0) return;
			save(payload.previous_response_id ? new Blob([JSON.stringify(preparedPayload)]) : body);
			preparedPayload = void 0;
		};
		return streamFn(model, context, capturedOptions);
	};
}
const EMBEDDED_FORK_REQUIRES_PARENT = "Cache-parity session fork requires a parent turn prepared by this OpenClaw runtime. Send a normal message first.";
function stripNewCacheMarkers(value) {
	if (Array.isArray(value)) return value.map(stripNewCacheMarkers);
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "cache_control").map(([key, child]) => [key, stripNewCacheMarkers(child)]));
}
/** Replay prepared payload data, never the parent's one-shot admission hooks or tool executor. */
async function runEmbeddedSessionFork(params) {
	switch (params.model.api) {
		case "openai-responses":
		case "openai-chatgpt-responses":
		case "openai-completions":
		case "anthropic-messages": break;
		default: throw new Error(`Session forks do not support provider API ${params.model.api}. Use OpenAI Responses, Chat Completions, or Anthropic Messages.`);
	}
	prune();
	const snapshot = snapshots.get(params.sessionId);
	if (!snapshot) throw new Error(EMBEDDED_FORK_REQUIRES_PARENT);
	const assertCurrent = () => {
		params.assertCurrent();
		params.signal?.throwIfAborted();
		if (!snapshot.authority.active || snapshot.expires <= Date.now()) throw new Error(EMBEDDED_FORK_REQUIRES_PARENT);
	};
	assertCurrent();
	const metadata = JSON.parse(snapshot.metadata.toString("utf8"));
	if (snapshot.agentId !== params.agentId || metadata.model.provider !== params.model.provider || metadata.model.id !== params.model.id || metadata.model.api !== params.model.api || metadata.model.baseUrl !== params.model.baseUrl) throw new Error("Cache-parity session fork requires the parent's prepared model. Send a normal message first.");
	const context = {
		tools: metadata.tools,
		messages: await Promise.all(snapshot.publications.map((data) => readData(data)))
	};
	const parentPayload = JSON.parse(await snapshot.payload.text());
	if (!isRecord(parentPayload)) throw new Error("Cache-parity session fork requires an object provider request.");
	const key = Array.isArray(parentPayload.input) ? "input" : "messages";
	const prefix = parentPayload[key];
	if (!Array.isArray(prefix)) throw new Error("Cache-parity session fork could not preserve the parent request prefix.");
	const toolCallIds = /* @__PURE__ */ new Set();
	for (const message of prefix) {
		if (!isRecord(message)) continue;
		if (message.type === "function_call" && typeof message.call_id === "string") toolCallIds.add(message.call_id);
		const blocks = message.tool_calls ?? message.content;
		if (Array.isArray(blocks)) {
			for (const block of blocks) if (isRecord(block) && (block.type === "tool_use" || block.type === "function") && typeof block.id === "string") toolCallIds.add(block.id);
		}
	}
	preparedRequestSuffix.mark(context, toolCallIds);
	const completedCalls = /* @__PURE__ */ new Set();
	for (let index = context.messages.length - 1; index >= 0; index--) {
		const message = context.messages[index];
		if (message.role === "toolResult") completedCalls.add(message.toolCallId);
		else if (message.role === "assistant") for (const block of message.content) {
			if (block.type !== "toolCall" || completedCalls.delete(block.id)) continue;
			context.messages.splice(index + 1, 0, {
				role: "toolResult",
				toolCallId: block.id,
				toolName: block.name,
				content: [{
					type: "text",
					text: "This tool call is still running. Its result is not available yet."
				}],
				isError: false,
				timestamp: Date.now()
			});
		}
	}
	context.messages.push({
		role: "user",
		content: params.question,
		timestamp: Date.now()
	});
	const model = getAiTransportHost().inheritManagedTransport(params.model, {
		...metadata.model,
		headers: params.model.headers
	});
	const usage = createUsageAccumulator();
	for (let iteration = 0; iteration < 3; iteration++) {
		assertCurrent();
		const options = {
			...await readData(snapshot.options),
			apiKey: params.apiKey,
			signal: params.signal,
			asyncToolExecution: false,
			onPayload: (payload) => {
				assertCurrent();
				if (!isRecord(payload)) throw new Error("Cache-parity session fork requires an object provider request.");
				const messages = payload[key];
				if (!Array.isArray(messages)) throw new Error("Cache-parity session fork could not preserve the parent request prefix.");
				const replay = {
					...parentPayload,
					[key]: [...prefix, ...messages.map(stripNewCacheMarkers)]
				};
				delete replay.previous_response_id;
				if (Array.isArray(replay.tools) && replay.tools.length > 0) {
					if (model.api === "anthropic-messages") replay.tool_choice = { type: "none" };
					else if (model.api === "openai-responses" || model.api === "openai-chatgpt-responses" || model.api === "openai-completions") replay.tool_choice = "none";
					else throw new Error("Session fork cannot disable hosted tools for this provider API.");
				}
				return replay;
			}
		};
		independentResponsesRequest.set(options);
		responsesRequestLifecycle.set(options, {
			assertCurrent,
			beforeDispatch: async () => assertCurrent(),
			accepted: async () => assertCurrent(),
			settle: async () => assertCurrent()
		});
		assertCurrent();
		const result = await withGuardedFetchRequestAuthority(assertCurrent, async () => {
			const stream = await snapshot.streamFn(model, context, options);
			assertCurrent();
			return await stream.result();
		});
		assertCurrent();
		mergeUsageIntoAccumulator(usage, normalizeUsage(result.usage));
		params.onUsage?.(toNormalizedUsage(usage));
		if (result.stopReason === "error" || result.stopReason === "aborted") throw new Error(result.errorMessage || "Cache-parity session fork failed.");
		const calls = result.content.filter((block) => block.type === "toolCall");
		if (calls.length === 0) {
			const text = collectTextContentBlocks(result.content).join("").trim();
			if (!text) throw new Error("No cache-parity session fork response generated.");
			return text;
		}
		context.messages.push(result);
		for (const call of calls) context.messages.push({
			role: "toolResult",
			toolCallId: call.id,
			toolName: call.name,
			content: [{
				type: "text",
				text: "Tool execution denied for this side question. Answer without calling tools."
			}],
			isError: true,
			timestamp: Date.now()
		});
	}
	throw new Error("Cache-parity session fork kept requesting tools after three attempts. Ask a question that can be answered without tools.");
}
//#endregion
export { wrapStreamFnWithSessionFork as i, recordEmbeddedSessionForkMessage as n, runEmbeddedSessionFork as r, clearEmbeddedSessionForkSnapshot as t };
