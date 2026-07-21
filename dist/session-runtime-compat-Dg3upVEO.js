import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-B1-PRucg.js";
//#region src/agents/session-runtime-compat.ts
/** Resolves a runtime id only when it can serve the selected provider. */
function resolveCompatibleAgentRuntimeForProvider(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || isDefaultAgentRuntimeId(runtime)) return;
	if (runtime === "openclaw") return runtime;
	const provider = params.provider?.trim().toLowerCase() ?? "";
	if (runtime === "codex" && (provider === "codex" || provider === "openai")) return runtime;
	return isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	}) ? runtime : void 0;
}
/** Resolves a persisted runtime override only when it can serve the selected provider. */
function resolveSessionRuntimeOverrideForProvider(params) {
	return resolveCompatibleAgentRuntimeForProvider({
		provider: params.provider,
		runtime: params.entry?.agentRuntimeOverride,
		cfg: params.cfg
	});
}
//#endregion
export { resolveSessionRuntimeOverrideForProvider as n, resolveCompatibleAgentRuntimeForProvider as t };
