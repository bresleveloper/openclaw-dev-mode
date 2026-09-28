import { t as readCodexAsyncQuestions } from "./async-questions-DdhOCwGi.mjs";
import { i as readUpstreamUserText, r as readMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
//#region extensions/codex/src/app-server/transcript-mirror-attestation.ts
function isMirroredAgentMessage(message) {
	return message.role === "user" || message.role === "assistant" || message.role === "toolResult";
}
function buildCodexMirrorDedupeIdentity(message) {
	const identity = readMirrorIdentity(message);
	if (identity) return identity;
	const payload = JSON.stringify({
		role: message.role,
		content: message.content
	});
	return `${message.role}:${createHash("sha256").update(payload).digest("hex").slice(0, 16)}`;
}
const MIRROR_ORIGIN_META_KEY = "mirrorOrigin";
const MIRROR_SOURCE_FINGERPRINT_META_KEY = "mirrorSourceFingerprint";
const CODEX_APP_SERVER_MIRROR_ORIGIN = "codex-app-server";
const CODEX_META_KEY = "__openclaw";
function applyCodexTranscriptTaint(message, state) {
	if (message.role === "user") {
		state.tainted = false;
		return message;
	}
	const existing = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const metadata = asOptionalRecord(existing);
	state.tainted ||= metadata?.turnTainted === true || metadata?.resultContentSource === "network";
	return message.role === "assistant" && state.tainted ? {
		...message,
		__openclaw: {
			...metadata,
			turnTainted: true
		}
	} : message;
}
function attachCodexMirrorAttestation(message, sourceFingerprint) {
	const existing = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...message,
		[CODEX_META_KEY]: {
			...baseMeta,
			[MIRROR_ORIGIN_META_KEY]: CODEX_APP_SERVER_MIRROR_ORIGIN,
			...sourceFingerprint ? { [MIRROR_SOURCE_FINGERPRINT_META_KEY]: sourceFingerprint } : {}
		}
	};
}
function attachCodexMirrorRunId(message, runId, terminal = false, settlementWarning) {
	const existing = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	const { runTerminal: _staleTerminal, ...current } = asOptionalRecord(existing) ?? {};
	return {
		...message,
		[CODEX_META_KEY]: {
			...current,
			runId,
			...terminal ? { runTerminal: true } : {},
			...terminal && settlementWarning ? { settlementWarning } : {}
		}
	};
}
function hasCodexMirrorOrigin(message) {
	const meta = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	return asOptionalRecord(meta)?.[MIRROR_ORIGIN_META_KEY] === CODEX_APP_SERVER_MIRROR_ORIGIN;
}
function readCodexMirrorSourceFingerprint(message) {
	const meta = CODEX_META_KEY in message ? message[CODEX_META_KEY] : void 0;
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const value = meta[MIRROR_SOURCE_FINGERPRINT_META_KEY];
	return typeof value === "string" && value ? value : void 0;
}
function serializeCodexMirrorSourceEvidence(message) {
	const content = "content" in message ? message.content : void 0;
	const questions = isMirroredAgentMessage(message) ? readCodexAsyncQuestions(message.openclawAsyncDelivery?.questions) : void 0;
	return JSON.stringify({
		role: message.role,
		content,
		...questions ? { questions } : {},
		...message.role === "user" ? { upstreamUserText: readUpstreamUserText(message) } : {},
		...message.role === "toolResult" ? {
			toolCallId: message.toolCallId,
			toolName: message.toolName,
			isError: message.isError
		} : {}
	});
}
function fingerprintCodexMirrorSourceMessage(message) {
	return createHash("sha256").update(serializeCodexMirrorSourceEvidence(message)).digest("hex").slice(0, 32);
}
//#endregion
export { fingerprintCodexMirrorSourceMessage as a, readCodexMirrorSourceFingerprint as c, buildCodexMirrorDedupeIdentity as i, serializeCodexMirrorSourceEvidence as l, attachCodexMirrorAttestation as n, hasCodexMirrorOrigin as o, attachCodexMirrorRunId as r, isMirroredAgentMessage as s, applyCodexTranscriptTaint as t };
