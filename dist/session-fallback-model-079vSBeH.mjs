import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as parseProviderModelRef, n as buildModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { d as readSessionTranscriptTerminalModel } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-Bf7HNrTn.mjs";
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
function resolveCompletedFallbackEntry(params) {
	const entry = params.sessionEntry;
	if (!params.sessionScope?.sessionKey || !entry?.sessionId || entry.status !== "done" || !entry.lastRunId || !entry.fallbackNotice) return;
	const selectedLabel = resolveSelectedAndActiveModel({
		selectedProvider: params.selectedProvider,
		selectedModel: params.selectedModel,
		parseSelectedProvider: params.parseSelectedProvider
	}).selected.label;
	return normalizeOptionalString(entry.fallbackNotice.selectedModel) === selectedLabel ? {
		entry,
		scope: params.sessionScope
	} : void 0;
}
function selectCompletedFallbackModel(params, entry, terminalModel) {
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
/** Present prepared terminal facts without opening storage. */
function readSessionFallbackModel(params) {
	const completed = resolveCompletedFallbackEntry(params);
	return completed ? selectCompletedFallbackModel(params, completed.entry, params.terminalModel) : void 0;
}
/** Read terminal facts through the retained asynchronous history owner. */
async function readSessionFallbackModelAsync(params) {
	const completed = resolveCompletedFallbackEntry(params);
	if (!completed) return;
	const terminalModel = await readSessionTerminalFallbackModelAsync({
		sessionEntry: completed.entry,
		sessionScope: completed.scope
	});
	return selectCompletedFallbackModel(params, completed.entry, terminalModel);
}
async function readSessionTerminalFallbackModelAsync(params) {
	const { readSessionTranscriptBoundedMessageTailPageAsync } = await import("./session-transcript-readers-Cee7Y9gw.mjs");
	try {
		const page = await readSessionTranscriptBoundedMessageTailPageAsync({
			...params.sessionScope,
			sessionId: params.sessionEntry.sessionId
		}, {
			maxBytes: 262144,
			maxMessages: 1,
			offset: 0,
			readOnly: true
		});
		return selectSessionTerminalFallbackModel(params.sessionEntry, page.events[0]?.event);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error) && !(error instanceof SessionTranscriptStorageUnavailableError)) throw error;
	}
}
/** Durable and memory readers apply the same terminal-run selection to a bounded tail. */
function selectSessionTerminalFallbackModel(entry, event) {
	const terminal = readSessionTranscriptTerminalModel(event);
	return terminal && terminal.runId === entry.lastRunId ? {
		modelProvider: terminal.modelProvider,
		model: terminal.model
	} : void 0;
}
//#endregion
export { resolveSelectedAndActiveModel as i, readSessionFallbackModelAsync as n, selectSessionTerminalFallbackModel as r, readSessionFallbackModel as t };
