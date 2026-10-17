import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as parseProviderModelRef, n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { o as readSessionTranscriptRunId } from "./transcript-events-DUHAZLVw.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-CCOA5IKG.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-Dlr8j1Wl.mjs";
//#region src/auto-reply/model-runtime.ts
function normalizeModelRef(rawModel, fallbackProvider, parseEmbeddedProvider = false) {
	const trimmed = normalizeOptionalString(rawModel) ?? "";
	const parsed = parseEmbeddedProvider ? parseProviderModelRef(trimmed) : null;
	if (parsed) return {
		...parsed,
		label: `${parsed.provider}/${parsed.model}`
	};
	const provider = normalizeOptionalString(fallbackProvider) ?? "";
	return {
		provider,
		model: trimmed,
		label: provider ? buildModelCatalogRef(provider, trimmed) : trimmed
	};
}
/** Compare configured selected model with the active model stored on a session. */
function resolveSelectedAndActiveModel(params) {
	const selected = normalizeModelRef(params.selectedModel, params.selectedProvider, params.parseSelectedProvider);
	const runtimeModel = normalizeOptionalString(params.sessionEntry?.model);
	const runtimeProvider = normalizeOptionalString(params.sessionEntry?.modelProvider);
	const active = runtimeModel ? normalizeModelRef(runtimeModel, runtimeProvider || selected.provider, !runtimeProvider) : selected;
	return {
		selected,
		active,
		activeDiffers: active.provider !== selected.provider || active.model !== selected.model
	};
}
//#endregion
//#region src/status/session-fallback-model.ts
/** Reads a terminal fallback model only when the run, selection, and notice agree. */
function readSessionFallbackModel(params) {
	const entry = params.sessionEntry;
	if (!params.sessionScope?.sessionKey || !entry?.sessionId || entry.status !== "done" || !entry.lastRunId || !entry.fallbackNotice) return;
	const selectedLabel = resolveSelectedAndActiveModel({
		selectedProvider: params.selectedProvider,
		selectedModel: params.selectedModel,
		parseSelectedProvider: params.parseSelectedProvider
	}).selected.label;
	if (normalizeOptionalString(entry.fallbackNotice.selectedModel) !== selectedLabel) return;
	const terminalModel = params.terminalModel === void 0 ? readSessionTerminalFallbackModel(params) : params.terminalModel;
	if (!terminalModel) return;
	const { selected, active } = resolveSelectedAndActiveModel({
		...params,
		sessionEntry: terminalModel
	});
	return resolveActiveFallbackState({
		selectedModelRef: selected.label,
		activeModelRef: active.label,
		config: params.config,
		state: entry
	}).active ? {
		modelProvider: active.provider,
		model: active.model
	} : void 0;
}
/** Storage readers prepare terminal facts; the host retains runtime alias policy. */
function readSessionTerminalFallbackModel(params) {
	const entry = params.sessionEntry;
	if (!params.sessionScope?.sessionKey || !entry?.sessionId || entry.status !== "done" || !entry.lastRunId || !entry.fallbackNotice) return;
	try {
		const page = readSessionTranscriptBoundedMessageTailPage({
			...params.sessionScope,
			sessionId: entry.sessionId
		}, {
			maxBytes: 262144,
			maxMessages: 1,
			offset: 0,
			readOnly: true
		});
		const message = asOptionalRecord(asOptionalRecord(page.events[0]?.event)?.message);
		if ((message?.stopReason === "stop" || message?.stopReason === "length") && readSessionTranscriptRunId(message) === entry.lastRunId && projectSessionDisplayMessage(message)?.role === "assistant" && typeof message.provider === "string" && typeof message.model === "string") return {
			modelProvider: message.provider,
			model: message.model
		};
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error) && !(error instanceof SessionTranscriptStorageUnavailableError)) throw error;
	}
}
//#endregion
export { readSessionTerminalFallbackModel as n, resolveSelectedAndActiveModel as r, readSessionFallbackModel as t };
