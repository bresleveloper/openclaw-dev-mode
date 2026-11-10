import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { n as defineCodexBuildState } from "./build-state-L_MglvnW.mjs";
import { n as readCodexInferenceMetadata } from "./inference-metadata-CYFWLHVk.mjs";
import { randomUUID } from "node:crypto";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/inference-context.ts
const MAX_CONTEXT_BYTES = 262144;
const MAX_ACTIVE_ROOTS = 64;
const MAX_PREPARED_PREFIXES = 256;
const MAX_RETAINED_REQUEST_BYTES = 33554432;
const retained = defineCodexBuildState("openclaw.codexPreparedRequests", () => ({
	requests: /* @__PURE__ */ new Map(),
	bytes: 0
}))();
function forgetRequest(prefix) {
	if (!prefix) return;
	const request = retained.requests.get(prefix);
	if (request) {
		retained.bytes -= request.bytes;
		retained.requests.delete(prefix);
	}
}
function retainRequest(prefix, body) {
	const previous = retained.requests.get(prefix)?.body;
	forgetRequest(prefix);
	const continuation = body.previous_response_id != null;
	const snapshot = {};
	for (const key of [
		"instructions",
		"tools",
		"input",
		"prompt_cache_key"
	]) {
		if (continuation && key === "input") continue;
		const value = body[key] ?? (continuation ? previous?.[key] : void 0);
		if (value !== void 0) snapshot[key] = value;
	}
	if (continuation) {
		const inputTools = Array.isArray(previous?.input) ? previous.input.find((item) => isJsonObject(item) && item.type === "additional_tools") : previous?.inputTools;
		if (inputTools !== void 0) snapshot.inputTools = inputTools;
	}
	const bytes = Buffer.byteLength(JSON.stringify(snapshot));
	if (bytes > MAX_RETAINED_REQUEST_BYTES) return;
	while (retained.bytes + bytes > MAX_RETAINED_REQUEST_BYTES) forgetRequest(retained.requests.keys().next().value);
	retained.requests.set(prefix, {
		body: snapshot,
		bytes
	});
	retained.bytes += bytes;
}
/** One physical inference transport owns these confidential, nonpersistent snapshots. */
function createCodexInferenceContext(assertClientCurrent) {
	const roots = /* @__PURE__ */ new Map();
	const prefixes = /* @__PURE__ */ new Map();
	const waiters = /* @__PURE__ */ new Set();
	const drain = () => {
		while (roots.size < MAX_ACTIVE_ROOTS && waiters.size > 0) waiters.values().next().value?.admit();
	};
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Codex parent-local inference transport is closed");
		assertClientCurrent();
	};
	return {
		async register(params) {
			assertOpen();
			params.signal.throwIfAborted();
			params.assertCurrent();
			if (Buffer.byteLength(params.text) > MAX_CONTEXT_BYTES) throw new Error("Codex parent-local context exceeds the 256 KiB inference limit");
			const admit = () => {
				assertOpen();
				params.signal.throwIfAborted();
				params.assertCurrent();
				if (params.retainPrefix !== false && !prefixes.has(params.threadId) && prefixes.size >= MAX_PREPARED_PREFIXES) throw new Error("Codex prepared inference prefix limit reached; reconnect before retrying");
				const controller = new AbortController();
				const registration = {
					generation: randomUUID(),
					text: params.text,
					forkPrefix: params.forkPrefix,
					denyToolCalls: params.denyToolCalls === true,
					controller,
					assertCurrent: () => {
						assertOpen();
						controller.signal.throwIfAborted();
						params.signal.throwIfAborted();
						params.assertCurrent();
						if (roots.get(params.threadId) !== registration) throw new Error("Codex parent-local inference generation was replaced");
					},
					release: () => {
						if (roots.get(params.threadId) === registration) {
							roots.delete(params.threadId);
							drain();
						}
						registration.text = "";
						controller.abort();
						params.signal.removeEventListener("abort", registration.release);
					}
				};
				const previous = roots.get(params.threadId);
				roots.set(params.threadId, registration);
				previous?.release();
				if (params.retainPrefix !== false) {
					const prefix = prefixes.get(params.threadId);
					if (prefix) prefix.text = params.text;
					else prefixes.set(params.threadId, { text: params.text });
				}
				params.signal.addEventListener("abort", registration.release, { once: true });
				return {
					generation: registration.generation,
					release: registration.release
				};
			};
			if (roots.has(params.threadId) || roots.size < MAX_ACTIVE_ROOTS) return admit();
			embeddedAgentLog.debug("codex parent-local inference waiting for an active root", {
				limit: MAX_ACTIVE_ROOTS,
				waiting: waiters.size + 1
			});
			return new Promise((resolve, reject) => {
				const remove = () => {
					waiters.delete(waiter);
					params.signal.removeEventListener("abort", onAbort);
				};
				const waiter = {
					admit: () => {
						remove();
						try {
							resolve(admit());
						} catch (error) {
							reject(toErrorObject(error, "Codex inference root admission failed"));
						}
					},
					cancel: (error) => {
						remove();
						reject(toErrorObject(error, "Codex inference root admission cancelled"));
					}
				};
				const onAbort = () => waiter.cancel(params.signal.reason);
				waiters.add(waiter);
				params.signal.addEventListener("abort", onAbort, { once: true });
			});
		},
		/** A retained prefix is data; only the new root's caller grants model authority. */
		async fork(params) {
			assertOpen();
			const prefix = prefixes.get(params.sourceThreadId);
			if (!prefix) throw new Error("Cache-parity fork has no prepared parent inference context.");
			const request = retained.requests.get(prefix);
			if (request) {
				retained.requests.delete(prefix);
				retained.requests.set(prefix, request);
			}
			return this.register({
				threadId: params.threadId,
				text: prefix.text,
				forkPrefix: request?.body,
				retainPrefix: false,
				denyToolCalls: true,
				signal: params.signal,
				assertCurrent: params.assertCurrent
			});
		},
		forget(threadId) {
			forgetRequest(prefixes.get(threadId));
			prefixes.delete(threadId);
			roots.get(threadId)?.release();
		},
		/** Caller must authenticate its private transport before parsing any model request. */
		prepare(body, preparedMetadata, requireAdmission = false) {
			assertOpen();
			const metadata = preparedMetadata ?? readCodexInferenceMetadata(body);
			const child = Boolean(metadata.parentThreadId || metadata.subagentKind || metadata.subagent);
			const kind = metadata.requestKind;
			if (!requireAdmission && (child || kind === "compaction" || kind === "memory")) return {
				body,
				assertCurrent: assertOpen,
				signal: void 0
			};
			if (child || kind !== "turn" && kind !== "prewarm" && !(requireAdmission && kind === "compaction")) throw new Error("Codex inference request has an unsupported native purpose");
			const registration = metadata.threadId ? roots.get(metadata.threadId) : void 0;
			const generation = metadata.generation;
			if (!requireAdmission && kind === "prewarm" && body.generate === false && generation == null) return {
				body,
				assertCurrent: assertOpen,
				signal: void 0
			};
			if (!registration || generation !== registration.generation) throw new Error("Codex inference has no current admitted parent generation");
			registration.assertCurrent();
			let preparedBody = body;
			if (kind !== "compaction") {
				const instructions = body.instructions;
				if (instructions !== void 0 && typeof instructions !== "string") throw new Error("Codex inference request has invalid top-level instructions");
				if (registration.text) preparedBody = {
					...body,
					instructions: instructions === void 0 ? registration.text : instructions + "\n\n" + registration.text
				};
			}
			if (kind === "turn") {
				const prefix = registration.forkPrefix;
				const inputTools = Array.isArray(prefix?.input) ? prefix.input.find((item) => isJsonObject(item) && item.type === "additional_tools") : prefix?.inputTools;
				const input = prefix && Array.isArray(body.input) ? body.input.map((item) => isJsonObject(inputTools) && isJsonObject(item) && item.type === "additional_tools" ? inputTools : item) : void 0;
				if (prefix && Array.isArray(prefix.input) && input && prefix.input.length <= input.length && prefix.input.every((item, index) => JSON.stringify(item) === JSON.stringify(input[index]))) {
					preparedBody = { ...body };
					delete preparedBody.previous_response_id;
					for (const key of [
						"instructions",
						"tools",
						"input"
					]) delete preparedBody[key];
					for (const key of [
						"instructions",
						"tools",
						"input",
						"prompt_cache_key"
					]) {
						const value = prefix[key];
						if (value !== void 0) preparedBody[key] = value;
					}
					preparedBody.input = [...prefix.input, ...input.slice(prefix.input.length)];
				} else if (prefix) {
					preparedBody = {
						...preparedBody,
						...prefix.tools !== void 0 ? { tools: prefix.tools } : {},
						...input ? { input } : {}
					};
					delete preparedBody.instructions;
					if (prefix.instructions !== void 0) preparedBody.instructions = prefix.instructions;
				}
				if (registration.denyToolCalls) preparedBody = {
					...preparedBody,
					tool_choice: "none"
				};
				const retainedPrefix = metadata.threadId ? prefixes.get(metadata.threadId) : void 0;
				if (retainedPrefix) retainRequest(retainedPrefix, preparedBody);
			}
			return {
				body: preparedBody,
				assertCurrent: registration.assertCurrent,
				signal: registration.controller.signal
			};
		},
		close() {
			closed = true;
			for (const waiter of waiters) waiter.cancel(/* @__PURE__ */ new Error("Codex parent-local inference transport is closed"));
			for (const prefix of prefixes.values()) forgetRequest(prefix);
			prefixes.clear();
			for (const registration of roots.values()) registration.release();
		}
	};
}
//#endregion
export { createCodexInferenceContext as t };
