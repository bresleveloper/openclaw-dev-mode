//#region src/agents/memory-search-source-policy.ts
const DEFAULT_SOURCES = ["memory"];
function normalizeSources(sources, sessionMemoryEnabled) {
	const input = sources?.length ? sources : DEFAULT_SOURCES;
	const normalized = [...new Set(input.filter((source) => source === "memory" || source === "sessions" && sessionMemoryEnabled))];
	return normalized.length > 0 ? normalized : [...DEFAULT_SOURCES];
}
/** Resolve query and indexed sources from already-selected memory policy facts. */
function resolveMemorySearchSourcePolicy(params) {
	const { configuredSources, rememberAcrossConversations, configuredSessionMemory } = params;
	const sessionMemory = rememberAcrossConversations || configuredSessionMemory;
	const searchSources = normalizeSources(configuredSources, configuredSessionMemory || rememberAcrossConversations && configuredSources?.includes("sessions") === true);
	return {
		sources: normalizeSources(rememberAcrossConversations ? [...searchSources, "sessions"] : configuredSources, sessionMemory),
		searchSources,
		sessionMemory
	};
}
//#endregion
export { resolveMemorySearchSourcePolicy as t };
