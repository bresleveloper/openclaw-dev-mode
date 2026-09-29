import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-DmCrQjUt.mjs";
//#region src/auto-reply/reply/directive-handling.model-runtime.ts
/** Resolves and applies explicit runtime selections attached to `/model`. */
/** Preserves compatible runtime pins and validates explicit runtime selections. */
function resolveModelRuntimeDirective(params) {
	const requestedRuntime = params.rawRuntime?.trim();
	const rawRuntime = requestedRuntime || params.sessionEntry?.agentRuntimeOverride?.trim();
	if (!rawRuntime) return { kind: "unchanged" };
	const runtime = normalizeOptionalAgentRuntimeId(rawRuntime);
	if (isDefaultAgentRuntimeId(runtime)) return { kind: requestedRuntime ? "clear" : "unchanged" };
	const provider = normalizeProviderId(params.provider);
	const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
		provider,
		runtime,
		cfg: params.cfg
	});
	if (compatibleRuntime) return requestedRuntime ? {
		kind: "set",
		runtime: compatibleRuntime
	} : { kind: "unchanged" };
	if (!requestedRuntime) return { kind: "clear" };
	return {
		kind: "invalid",
		runtime: rawRuntime,
		errorText: `Runtime "${rawRuntime}" is not supported for ${provider || params.provider}.`
	};
}
/** Applies a validated runtime choice, clearing consent with an incompatible or reset pin. */
function applyModelRuntimeDirective(entry, resolution) {
	if (resolution.kind === "clear") {
		const updated = entry.agentRuntimeOverride !== void 0 || entry.nativeRuntimeConsent !== void 0;
		delete entry.agentRuntimeOverride;
		delete entry.nativeRuntimeConsent;
		return { updated };
	}
	if (resolution.kind === "set") {
		const updated = entry.agentRuntimeOverride !== resolution.runtime || entry.nativeRuntimeConsent !== void 0 && entry.nativeRuntimeConsent !== resolution.runtime;
		if (updated) delete entry.nativeRuntimeConsent;
		entry.agentRuntimeOverride = resolution.runtime;
		return { updated };
	}
	return { updated: false };
}
//#endregion
export { resolveModelRuntimeDirective as n, applyModelRuntimeDirective as t };
