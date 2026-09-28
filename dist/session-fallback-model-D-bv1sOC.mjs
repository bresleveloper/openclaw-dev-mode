import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as parseProviderModelRef, n as buildModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { a as readSessionTranscriptRunId } from "./transcript-events-DukKauix.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-CuzwVnKb.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-Cnt-hBim.mjs";
import { t as resolveActiveFallbackState } from "./fallback-notice-state-RaMg3ufK.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-bZOY074i.mjs";
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
		if ((message?.stopReason === "stop" || message?.stopReason === "length") && readSessionTranscriptRunId(message) === entry.lastRunId && projectSessionDisplayMessage(message)?.role === "assistant" && typeof message.provider === "string" && typeof message.model === "string") {
			const { selected, active } = resolveSelectedAndActiveModel({
				...params,
				sessionEntry: {
					modelProvider: message.provider,
					model: message.model
				}
			});
			if (resolveActiveFallbackState({
				selectedModelRef: selected.label,
				activeModelRef: active.label,
				config: params.config,
				state: entry
			}).active) return {
				modelProvider: active.provider,
				model: active.model
			};
		}
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error) && !(error instanceof SessionTranscriptStorageUnavailableError)) throw error;
	}
}
//#endregion
export { resolveSelectedAndActiveModel as n, readSessionFallbackModel as t };
