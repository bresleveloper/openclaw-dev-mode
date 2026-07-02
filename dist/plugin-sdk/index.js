import { p as onDiagnosticEvent } from "../diagnostic-events-CLCyIzm6.js";
import { i as registerContextEngine } from "../registry-BLZQzICr.js";
import { r as assertContextEngineHostSupport } from "../host-compat-BibWlia2.js";
import { o as optionalStringEnum, s as stringEnum } from "../typebox-DK0GFdj5.js";
import { n as delegateCompactionToRuntime, t as buildMemorySystemPromptAddition } from "../delegate-D8Qhr_YO.js";
import { r as emptyPluginConfigSchema } from "../config-schema-nMrjYIPk.js";
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
//#endregion
export { ContextEngineRuntimeSettingsUnavailableError, ContextEngineRuntimeSettingsUnsupportedError, assertContextEngineHostSupport, buildMemorySystemPromptAddition, delegateCompactionToRuntime, emptyPluginConfigSchema, onDiagnosticEvent, optionalStringEnum, registerContextEngine, stringEnum };
