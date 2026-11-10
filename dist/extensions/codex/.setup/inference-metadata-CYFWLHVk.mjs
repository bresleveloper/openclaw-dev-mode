import { asBoolean, isRecord, readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/inference-metadata.ts
const MAX_NATIVE_METADATA_BYTES = 1048576;
const MAX_METADATA_FIELD_BYTES = 256;
const CODEX_INFERENCE_GENERATION_KEY = "openclaw_inference_generation";
/** Call only after authenticating the private transport that supplied these carriers. */
function readCodexInferenceMetadata(body, headers, transport = "http", path) {
	if (transport === "http" && (path === "/images/generations" || path === "/images/edits")) {
		const nativeImageTurnId = readId("image turn", headers?.["x-codex-image-turn-id"]);
		if (!nativeImageTurnId) throw new Error("Codex image inference has no native turn metadata");
		return Object.freeze({ nativeImageTurnId });
	}
	const flat = body.client_metadata;
	if (flat !== void 0 && !isRecord(flat)) throw new Error("Codex inference request has invalid native metadata");
	const nested = readNativeMetadata(flat?.["x-codex-turn-metadata"]);
	const httpHeaders = transport === "http" ? headers : void 0;
	const compatibility = readNativeMetadata(httpHeaders?.["x-codex-turn-metadata"]);
	if (!nested && !compatibility) throw new Error("Codex inference request is missing bounded native metadata");
	const nativeField = (key) => [nested?.[key], compatibility?.[key]];
	const requestKind = reconcileMetadataStrings("request kind", ...nativeField("request_kind"));
	const generation = readId("parent generation", ...nativeField(CODEX_INFERENCE_GENERATION_KEY));
	const nativeThreadId = readId("thread", ...nativeField("thread_id"));
	if (!nativeThreadId && (requestKind === "turn" || requestKind === "prewarm" && !(body.generate === false && generation === void 0))) throw new Error("Codex inference request has no native thread metadata");
	const readTurnId = (field, key) => readId(field, flat?.[key], ...nativeField(key));
	const sessionId = readId("session", flat?.session_id, ...nativeField("session_id"));
	const routingSessionId = readId("routing session", httpHeaders?.["session-id"]);
	return Object.freeze({
		sessionId: sessionId ?? routingSessionId,
		threadId: readId("thread", flat?.thread_id, nativeThreadId, httpHeaders?.["thread-id"]),
		turnId: readTurnId("turn", "turn_id"),
		parentThreadId: readId("parent thread", flat?.["x-codex-parent-thread-id"], ...nativeField("parent_thread_id"), httpHeaders?.["x-codex-parent-thread-id"]),
		parentTurnId: readTurnId("parent turn", "parent_turn_id"),
		rootTurnId: readTurnId("root turn", "root_turn_id"),
		requestKind,
		threadSource: reconcileMetadataStrings("thread source", ...nativeField("thread_source")),
		subagent: reconcileMetadataStrings("subagent", flat?.["x-openai-subagent"], headers?.["x-openai-subagent"]),
		subagentKind: reconcileMetadataStrings("subagent kind", ...nativeField("subagent_kind")),
		guardianClassifierSourceThreadId: readId("Guardian classifier source thread", ...nativeField("guardian_classifier_source_thread_id")),
		autoReviewEnabled: reconcileMetadataBooleans("automatic review", ...nativeField("auto_review_enabled")),
		nodeReplAutoReviewRequired: reconcileMetadataBooleans("model-required review", ...nativeField("node_repl_auto_review_required")),
		generation
	});
}
function readNativeMetadata(raw) {
	if (raw === void 0) return;
	const encoded = readStringValue(raw);
	if (encoded === void 0 || Buffer.byteLength(encoded) > MAX_NATIVE_METADATA_BYTES) throw new Error("Codex inference request is missing bounded native metadata");
	try {
		const value = JSON.parse(encoded);
		if (isRecord(value)) return value;
	} catch {}
	throw new Error("Codex inference request has invalid native metadata");
}
const reconcileMetadataStrings = metadataReconciler((value) => {
	const text = readStringValue(value);
	return text !== void 0 && Buffer.byteLength(text) <= MAX_METADATA_FIELD_BYTES ? text : void 0;
}, "invalid or exceeds its limit");
const reconcileMetadataBooleans = metadataReconciler(asBoolean, "invalid");
function readId(field, ...values) {
	const value = reconcileMetadataStrings(field, ...values);
	if (value !== void 0 && (!value || value.trim() !== value)) throw new Error(`Codex inference ${field} metadata has an invalid identity`);
	return value;
}
function metadataReconciler(read, invalid) {
	return (field, ...values) => {
		let result;
		for (const value of values) {
			if (value == null) continue;
			const candidate = read(value);
			if (candidate === void 0) throw new Error(`Codex inference ${field} metadata is ${invalid}`);
			if (result !== void 0 && candidate !== result) throw new Error(`Codex inference ${field} metadata disagrees`);
			result = candidate;
		}
		return result;
	};
}
//#endregion
export { readCodexInferenceMetadata as n, CODEX_INFERENCE_GENERATION_KEY as t };
