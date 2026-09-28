import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-D2rgNcZS.mjs";
import { n as getRegisteredAgentHarness } from "./registry-1lXXOteg.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-DZSSnYMd.mjs";
//#region src/agents/session-runtime-compat.ts
/** Resolves the persisted runtime id, preserving locked transcript ownership. */
function resolvePersistedSessionRuntimeId(entry) {
	const pinnedHarness = resolveSessionPinnedHarnessId(entry);
	if (pinnedHarness && !isDefaultAgentRuntimeId(pinnedHarness)) return pinnedHarness;
	const runtimeOverride = normalizeOptionalAgentRuntimeId(entry?.agentRuntimeOverride);
	if (runtimeOverride && !isDefaultAgentRuntimeId(runtimeOverride)) return runtimeOverride;
	return normalizeOptionalAgentRuntimeId(entry?.agentHarnessId);
}
/** Resolves a runtime id only when it can serve the selected provider. */
function resolveCompatibleAgentRuntimeForProvider(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || isDefaultAgentRuntimeId(runtime)) return;
	if (runtime === "openclaw") return runtime;
	const provider = params.provider?.trim().toLowerCase() ?? "";
	if (runtime === "codex") return provider === "codex" || provider === "openai" ? runtime : void 0;
	if (getRegisteredAgentHarness(runtime)) return runtime;
	const snapshot = getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	}) ?? loadManifestMetadataSnapshot({ config: params.cfg });
	if (snapshot.plugins.some((plugin) => plugin.activation?.onAgentHarnesses?.includes(runtime) && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config: params.cfg
	}))) return runtime;
	return isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	}) ? runtime : void 0;
}
/** Resolves a persisted runtime override only when it can serve the selected provider. */
function resolveSessionRuntimeOverrideForProvider(params) {
	const lockedHarness = resolveSessionPinnedHarnessId(params.entry);
	if (lockedHarness && !isDefaultAgentRuntimeId(lockedHarness)) return lockedHarness;
	return resolveCompatibleAgentRuntimeForProvider({
		provider: params.provider,
		runtime: params.entry?.agentRuntimeOverride,
		cfg: params.cfg
	});
}
/** Resolves the native CLI transcript that owns manual compaction for a session. */
function resolveManualCompactionCliTarget(params) {
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.entry?.agentRuntimeOverride);
	const runtimeConfig = runtimeOverride && getCliSessionBinding(params.entry, runtimeOverride) ? params.cfg : void 0;
	const historicalRuntime = normalizeOptionalAgentRuntimeId(params.entry?.agentHarnessId);
	const historicalRuntimeConfig = historicalRuntime && getCliSessionBinding(params.entry, historicalRuntime) ? params.cfg : void 0;
	const selectedRuntime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: params.entry,
		cfg: runtimeConfig
	});
	const persistedRuntime = params.entry?.modelSelectionLocked === true ? resolvePersistedSessionRuntimeId(params.entry) : selectedRuntime ?? (params.entry?.agentRuntimeOverride ? void 0 : resolveCompatibleAgentRuntimeForProvider({
		provider: params.provider,
		runtime: historicalRuntime,
		cfg: historicalRuntimeConfig
	}));
	if (persistedRuntime) {
		const cliSessionBinding = getCliSessionBinding(params.entry, persistedRuntime);
		return {
			agentHarnessId: persistedRuntime,
			cliSessionBinding,
			cliSessionId: cliSessionBinding?.sessionId
		};
	}
	const compatibleBindings = [.../* @__PURE__ */ new Set([...Object.keys(params.entry?.cliSessionBindings ?? {}), ...Object.keys(params.entry?.cliSessionIds ?? {})])].flatMap((runtime) => {
		const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
			provider: params.provider,
			runtime,
			cfg: params.cfg
		});
		const binding = compatibleRuntime ? getCliSessionBinding(params.entry, compatibleRuntime) : void 0;
		return compatibleRuntime && binding ? [{
			runtime: compatibleRuntime,
			binding
		}] : [];
	});
	const compatibleBinding = compatibleBindings.length === 1 ? compatibleBindings[0] : void 0;
	if (!compatibleBinding) return {};
	return {
		agentHarnessId: compatibleBinding.runtime,
		cliSessionBinding: compatibleBinding.binding,
		cliSessionId: compatibleBinding.binding.sessionId
	};
}
//#endregion
export { resolveSessionRuntimeOverrideForProvider as i, resolveManualCompactionCliTarget as n, resolvePersistedSessionRuntimeId as r, resolveCompatibleAgentRuntimeForProvider as t };
