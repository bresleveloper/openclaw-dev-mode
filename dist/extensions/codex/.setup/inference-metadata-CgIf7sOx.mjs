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
	const requestKind = reconcileMetadataStrings("request kind", nested?.request_kind, compatibility?.request_kind);
	const generation = readId("parent generation", nested?.[CODEX_INFERENCE_GENERATION_KEY], compatibility?.[CODEX_INFERENCE_GENERATION_KEY]);
	const nativeThreadId = readId("thread", nested?.thread_id, compatibility?.thread_id);
	if (!nativeThreadId && (requestKind === "turn" || requestKind === "prewarm" && !(body.generate === false && generation === void 0))) throw new Error("Codex inference request has no native thread metadata");
	return Object.freeze({
		sessionId: readId("session", flat?.session_id, nested?.session_id, compatibility?.session_id, httpHeaders?.["session-id"]),
		threadId: readId("thread", flat?.thread_id, nativeThreadId, httpHeaders?.["thread-id"]),
		turnId: readId("turn", flat?.turn_id, nested?.turn_id, compatibility?.turn_id),
		parentThreadId: readId("parent thread", flat?.["x-codex-parent-thread-id"], nested?.parent_thread_id, compatibility?.parent_thread_id, httpHeaders?.["x-codex-parent-thread-id"]),
		parentTurnId: readId("parent turn", flat?.parent_turn_id, nested?.parent_turn_id, compatibility?.parent_turn_id),
		rootTurnId: readId("root turn", flat?.root_turn_id, nested?.root_turn_id, compatibility?.root_turn_id),
		requestKind,
		threadSource: reconcileMetadataStrings("thread source", nested?.thread_source, compatibility?.thread_source),
		subagent: reconcileMetadataStrings("subagent", flat?.["x-openai-subagent"], headers?.["x-openai-subagent"]),
		subagentKind: reconcileMetadataStrings("subagent kind", nested?.subagent_kind, compatibility?.subagent_kind),
		guardianClassifierSourceThreadId: readId("Guardian classifier source thread", nested?.guardian_classifier_source_thread_id, compatibility?.guardian_classifier_source_thread_id),
		autoReviewEnabled: reconcileMetadataBooleans("automatic review", nested?.auto_review_enabled, compatibility?.auto_review_enabled),
		nodeReplAutoReviewRequired: reconcileMetadataBooleans("model-required review", nested?.node_repl_auto_review_required, compatibility?.node_repl_auto_review_required),
		generation
	});
}
function readNativeMetadata(raw) {
	if (raw === void 0) return;
	const encoded = readStringValue(raw);
	if (encoded === void 0 || Buffer.byteLength(encoded) > MAX_NATIVE_METADATA_BYTES) throw new Error("Codex inference request is missing bounded native metadata");
	let value;
	try {
		value = JSON.parse(encoded);
	} catch {
		throw new Error("Codex inference request has invalid native metadata");
	}
	if (!isRecord(value)) throw new Error("Codex inference request has invalid native metadata");
	return value;
}
function reconcileMetadataStrings(field, ...values) {
	let result;
	for (const value of values) {
		if (value == null) continue;
		const candidate = readStringValue(value);
		if (candidate === void 0 || Buffer.byteLength(candidate) > MAX_METADATA_FIELD_BYTES) throw new Error(`Codex inference ${field} metadata is invalid or exceeds its limit`);
		if (result !== void 0 && candidate !== result) throw new Error(`Codex inference ${field} metadata disagrees`);
		result = candidate;
	}
	return result;
}
function readId(field, ...values) {
	const value = reconcileMetadataStrings(field, ...values);
	if (value !== void 0 && (!value || value.trim() !== value)) throw new Error(`Codex inference ${field} metadata has an invalid identity`);
	return value;
}
function reconcileMetadataBooleans(field, ...values) {
	let result;
	for (const value of values) {
		if (value == null) continue;
		const candidate = asBoolean(value);
		if (candidate === void 0) throw new Error(`Codex inference ${field} metadata is invalid`);
		if (result !== void 0 && candidate !== result) throw new Error(`Codex inference ${field} metadata disagrees`);
		result = candidate;
	}
	return result;
}
//#endregion
export { readCodexInferenceMetadata as n, CODEX_INFERENCE_GENERATION_KEY as t };
