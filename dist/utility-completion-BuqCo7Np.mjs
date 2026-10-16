import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { a as hasAvailableAuthForProvider } from "./model-auth-DfAz5WFK.mjs";
import { t as formatAgentRuntimeName } from "./agent-runtime-label-DgK-9QfF.mjs";
import { i as resolveSimpleCompletionSelectionForAgent } from "./simple-completion-runtime-CbAcEdye.mjs";
import { n as resolveAutomaticUtilityRuntimeOverride } from "./utility-model-T3nTQ8n8.mjs";
import { i as resolveIsolatedCompletionRuntime, n as resolveIsolatedCompletionProvider } from "./isolated-completion-route-o0X01uRG.mjs";
import { t as createModelCatalogDecisions } from "./model-catalog-decisions-BcFXF2w-.mjs";
//#region src/agents/utility-completion.ts
function resolveUtilityCompletionForAgent(params) {
	const selection = resolveSimpleCompletionSelectionForAgent(params);
	if (!selection) throw new Error(`No utility model configured for agent ${params.agentId}.`);
	const inheritedRuntime = params.useUtilityModel ? resolveAutomaticUtilityRuntimeOverride({
		cfg: params.cfg,
		agentId: params.agentId,
		utilityProvider: selection.provider,
		utilityModelId: selection.modelId,
		...params.manifestPlugins ? { metadataSnapshot: "plugins" in params.manifestPlugins ? params.manifestPlugins : { plugins: params.manifestPlugins } } : {}
	}) : void 0;
	return {
		config: params.cfg,
		provider: selection.provider,
		model: selection.modelId,
		authProfileId: selection.profileId ?? params.preferredProfile,
		outputTextPolicy: "strict-visible",
		agentId: params.agentId,
		agentDir: selection.agentDir,
		...inheritedRuntime ? { agentHarnessRuntimeOverride: inheritedRuntime } : {}
	};
}
/** Keep visible-text retry/fallback in callers; the runtime owns authentication. */
async function prepareUtilityCompletionForAgent(params) {
	const prepared = resolveUtilityCompletionForAgent(params);
	if (prepared.agentHarnessRuntimeOverride && await hasAvailableAuthForProvider({
		provider: prepared.provider,
		cfg: params.cfg,
		modelId: prepared.model,
		agentDir: prepared.agentDir,
		preferredProfile: prepared.authProfileId
	})) delete prepared.agentHarnessRuntimeOverride;
	return prepared;
}
/**
* Planned utility runtime from the same prepared generation as the caller's
* catalog. An unavailable auth plan or retired owner has no route to report.
*/
async function resolveUtilityCompletionRuntimeForAgent(params) {
	return await withPluginRuntimeGenerationScope(params, async () => {
		try {
			if (params.isCurrent?.() === false) return;
			const prepared = resolveUtilityCompletionForAgent({
				cfg: params.cfg,
				agentId: params.agentId,
				manifestPlugins: params.metadataSnapshot,
				useUtilityModel: true
			});
			const { provider } = resolveIsolatedCompletionProvider(prepared);
			const entry = [...params.snapshot.entries, ...params.snapshot.staticEntries ?? []].find((candidate) => candidate.provider === provider && candidate.id === prepared.model);
			if (!entry) return;
			const decisions = createModelCatalogDecisions({
				...params,
				preferredProfileId: prepared.authProfileId,
				pinnedProfileId: prepared.authProfileId,
				profileProvider: provider
			});
			if (prepared.agentHarnessRuntimeOverride) {
				if ((await decisions.evaluateEntry(entry, params.snapshot.routeVariants, "openclaw")).availability === true) delete prepared.agentHarnessRuntimeOverride;
			}
			const runtime = resolveIsolatedCompletionRuntime({
				...prepared,
				agentDir: params.agentDir ?? prepared.agentDir,
				workspaceDir: params.workspaceDir,
				preparedAuth: params
			});
			if (!runtime) return;
			const host = await decisions.evaluateEntry(entry, params.snapshot.routeVariants, runtime.id);
			return decisions.evaluateNative(entry, host, runtime.id).availability === true && decisions.isCurrent() ? {
				id: runtime.id,
				kind: runtime.kind,
				label: formatAgentRuntimeName(runtime.id, runtime.harnessLabel)
			} : void 0;
		} catch {
			return;
		}
	});
}
//#endregion
export { resolveUtilityCompletionRuntimeForAgent as n, prepareUtilityCompletionForAgent as t };
