//#region src/context-engine/types.ts
var ContextEngineRuntimeSettingsUnavailableError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "context_engine_runtime_settings_unavailable";
		this.name = "ContextEngineRuntimeSettingsUnavailableError";
	}
};
var ContextEngineRuntimeSettingsUnsupportedError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "context_engine_runtime_settings_unsupported";
		this.name = "ContextEngineRuntimeSettingsUnsupportedError";
	}
};
/**
* Resolve the post-compaction live transcript identity from a compact result.
*
* Prefers the typed `sessionTarget`. Reading the raw fields is the named
* compat path for shipped third-party engines that predate `sessionTarget`;
* it is removed together with the deprecated `sessionFile` result field.
*/
function resolveCompactionSuccessorTranscript(result) {
	const target = result.result?.sessionTarget;
	return {
		sessionId: target?.sessionId ?? result.result?.sessionId,
		sessionFile: target?.sessionFile ?? result.result?.sessionFile
	};
}
//#endregion
export { ContextEngineRuntimeSettingsUnsupportedError as n, resolveCompactionSuccessorTranscript as r, ContextEngineRuntimeSettingsUnavailableError as t };
