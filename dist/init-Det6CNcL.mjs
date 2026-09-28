import { a as registerContextEngineForOwner, h as CONTEXT_ENGINE_HOST_PARAMS } from "./registry-BKkCbmgx.mjs";
import { n as delegateCompactionToRuntime } from "./delegate-BQVMF6F6.mjs";
//#region src/context-engine/legacy.ts
/**
* LegacyContextEngine wraps the existing compaction behavior behind the
* ContextEngine interface, preserving 100% backward compatibility.
*
* - ingest: no-op (SessionManager handles message persistence)
* - assemble: pass-through (existing sanitize/validate/limit pipeline in attempt.ts handles this)
* - compact: delegates to the built-in compaction runtime
*/
var LegacyContextEngine = class {
	constructor() {
		this.info = {
			id: "legacy",
			name: "Legacy Context Engine",
			version: "1.0.0",
			acceptedHostParams: [...CONTEXT_ENGINE_HOST_PARAMS]
		};
		this.compact = delegateCompactionToRuntime;
	}
	async ingest(_params) {
		return { ingested: false };
	}
	async assemble(params) {
		return {
			messages: params.messages,
			estimatedTokens: 0
		};
	}
};
//#endregion
//#region src/context-engine/legacy.registration.ts
function registerLegacyContextEngine() {
	registerContextEngineForOwner("legacy", async () => new LegacyContextEngine(), "core", { allowSameOwnerRefresh: true });
}
//#endregion
//#region src/context-engine/init.ts
/**
* Ensures all built-in context engines are registered in the active registry.
*
* The legacy engine is always registered as a safe fallback so that
* `resolveContextEngine()` can resolve the default "legacy" slot without
* callers needing to remember manual registration.
*
* Additional engines are registered by their own plugins via
* `api.registerContextEngine()` during plugin load.
*/
function ensureContextEnginesInitialized() {
	registerLegacyContextEngine();
}
//#endregion
export { ensureContextEnginesInitialized as t };
