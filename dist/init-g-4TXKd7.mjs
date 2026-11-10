import { g as CONTEXT_ENGINE_HOST_PARAMS, i as registerContextEngineForOwner } from "./registry-BNFZRyO5.mjs";
import { n as delegateCompactionToRuntime } from "./delegate-B_LbG8w_.mjs";
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
async function registerLegacyContextEngine() {
	await registerContextEngineForOwner("legacy", async () => new LegacyContextEngine(), "core", { allowSameOwnerRefresh: true });
}
//#endregion
export { registerLegacyContextEngine as t };
