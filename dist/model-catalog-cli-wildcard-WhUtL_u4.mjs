import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { n as resolveConfiguredModelEntries } from "./configured-model-entries-BnlVcGcZ.mjs";
//#region src/agents/model-catalog-cli-wildcard.ts
/**
* Claude CLI sign-in writes `agents.*.models["anthropic/*"]` with the `claude-cli` runtime so any
* typed Claude ID runs through Claude Code. In catalog decisions that wildcard lights up only the
* models the Claude CLI catalog lists; authored rows keep their availability and typed refs still
* run. Other provider wildcards are unchanged.
*/
const CLAUDE_CLI_RUNTIME_ID = "claude-cli";
const ANTHROPIC_WILDCARD_REF = "anthropic/*";
/** Project the account menu onto canonical identities without admitting hosted-only models. */
function projectClaudeCliNativeCatalog(snapshot, cliOnly) {
	const listing = snapshot.providerOutcomes?.find((outcome) => outcome.provider === CLAUDE_CLI_RUNTIME_ID && outcome.listedModelIds !== void 0);
	const nativeOnly = cliOnly && listing !== void 0;
	const listed = new Set(listing?.listedModelIds ?? []);
	const nativeRows = snapshot.entries.filter((entry) => entry.provider === CLAUDE_CLI_RUNTIME_ID && listed.has(entry.id));
	const metadata = new Map([...snapshot.staticEntries ?? [], ...snapshot.entries].filter((entry) => entry.provider === "anthropic").map((entry) => [entry.id, entry]));
	const enrichedNativeRows = [];
	const canonical = [];
	for (const entry of nativeRows) {
		const enriched = {
			...entry,
			...metadata.get(entry.id),
			id: entry.id,
			provider: CLAUDE_CLI_RUNTIME_ID,
			name: entry.name,
			reasoning: entry.reasoning,
			thinkingLevelMap: entry.thinkingLevelMap
		};
		enrichedNativeRows.push(enriched);
		if (nativeOnly) canonical.push({
			...enriched,
			provider: "anthropic"
		});
	}
	const replaced = new Set(canonical.map((entry) => entry.id));
	const keep = (entry) => entry.provider !== CLAUDE_CLI_RUNTIME_ID && !(entry.provider === "anthropic" && (nativeOnly || replaced.has(entry.id)));
	return {
		...snapshot,
		entries: [...snapshot.entries.filter(keep), ...nativeOnly ? canonical : enrichedNativeRows],
		routeVariants: [
			...snapshot.routeVariants.filter(keep),
			...enrichedNativeRows,
			...canonical
		],
		staticEntries: snapshot.staticEntries?.filter((entry) => entry.provider !== CLAUDE_CLI_RUNTIME_ID && !(nativeOnly && entry.provider === "anthropic"))
	};
}
/** Builds one decisions-scoped check; catalog and configured refs are read once, on first use. */
function createUnlistedClaudeCliWildcardCheck(params) {
	const wildcard = resolveAgentConfig(params.cfg, params.agentId)?.models?.[ANTHROPIC_WILDCARD_REF] ?? params.cfg.agents?.defaults?.models?.[ANTHROPIC_WILDCARD_REF];
	if (normalizeProviderId(wildcard?.agentRuntime?.id ?? "") !== CLAUDE_CLI_RUNTIME_ID) return () => false;
	let listed;
	let configuredRefs;
	return (provider, modelId) => {
		if (provider !== "anthropic" || normalizeProviderId(resolveModelRuntimePolicy({
			config: params.cfg,
			provider,
			modelId,
			agentId: params.agentId
		}).policy?.id ?? "") !== CLAUDE_CLI_RUNTIME_ID) return false;
		listed ??= new Set(params.outcomes()?.flatMap((outcome) => outcome.provider === CLAUDE_CLI_RUNTIME_ID && outcome.listedModelIds !== void 0 ? outcome.listedModelIds : []));
		configuredRefs ??= resolveConfiguredModelEntries({
			cfg: params.cfg,
			agentId: params.agentId
		}).byKey;
		return !listed.has(modelId) && !configuredRefs.has(modelKey(provider, modelId));
	};
}
//#endregion
export { projectClaudeCliNativeCatalog as n, createUnlistedClaudeCliWildcardCheck as t };
