import { n as readCodexInferenceMetadata } from "./inference-metadata-CgIf7sOx.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/codex/src/app-server/inference-context.ts
const MAX_CONTEXT_BYTES = 262144;
const MAX_ACTIVE_ROOTS = 64;
/** One physical inference transport owns these confidential, nonpersistent snapshots. */
function createCodexInferenceContext(assertClientCurrent) {
	const roots = /* @__PURE__ */ new Map();
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Codex parent-local inference transport is closed");
		assertClientCurrent();
	};
	return {
		register(params) {
			assertOpen();
			params.signal.throwIfAborted();
			params.assertCurrent();
			if (Buffer.byteLength(params.text) > MAX_CONTEXT_BYTES) throw new Error("Codex parent-local context exceeds the 256 KiB inference limit");
			if (!roots.has(params.threadId) && roots.size >= MAX_ACTIVE_ROOTS) throw new Error("Codex parent-local inference root limit reached");
			roots.get(params.threadId)?.release();
			const controller = new AbortController();
			const registration = {
				generation: randomUUID(),
				text: params.text,
				controller,
				assertCurrent: () => {
					assertOpen();
					controller.signal.throwIfAborted();
					params.signal.throwIfAborted();
					params.assertCurrent();
					if (roots.get(params.threadId) !== registration) throw new Error("Codex parent-local inference generation was replaced");
				},
				release: () => {
					if (roots.get(params.threadId) === registration) roots.delete(params.threadId);
					registration.text = "";
					controller.abort();
					params.signal.removeEventListener("abort", registration.release);
				}
			};
			roots.set(params.threadId, registration);
			params.signal.addEventListener("abort", registration.release, { once: true });
			return {
				generation: registration.generation,
				release: registration.release
			};
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
			if (kind === "compaction") return {
				body,
				assertCurrent: registration.assertCurrent,
				signal: registration.controller.signal
			};
			const instructions = body.instructions;
			if (instructions !== void 0 && typeof instructions !== "string") throw new Error("Codex inference request has invalid top-level instructions");
			return {
				body: registration.text ? {
					...body,
					instructions: instructions === void 0 ? registration.text : instructions + "\n\n" + registration.text
				} : body,
				assertCurrent: registration.assertCurrent,
				signal: registration.controller.signal
			};
		},
		close() {
			closed = true;
			for (const registration of roots.values()) registration.release();
		}
	};
}
//#endregion
export { createCodexInferenceContext as t };
