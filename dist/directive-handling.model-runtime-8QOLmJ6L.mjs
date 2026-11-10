import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
//#region src/auto-reply/reply/directive-handling.model-runtime.ts
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
	if (resolution.kind !== "clear" && resolution.kind !== "set") return { updated: false };
	const runtime = resolution.kind === "set" ? resolution.runtime : void 0;
	const updated = entry.agentRuntimeOverride !== runtime || entry.nativeRuntimeConsent !== void 0 && entry.nativeRuntimeConsent !== runtime;
	if (resolution.kind === "clear") delete entry.agentRuntimeOverride;
	if (updated || resolution.kind === "clear") delete entry.nativeRuntimeConsent;
	if (resolution.kind === "set") entry.agentRuntimeOverride = resolution.runtime;
	return { updated };
}
//#endregion
export { resolveModelRuntimeDirective as n, applyModelRuntimeDirective as t };
