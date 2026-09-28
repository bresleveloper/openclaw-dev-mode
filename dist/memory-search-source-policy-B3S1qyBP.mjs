//#region src/agents/memory-search-source-policy.ts
const DEFAULT_SOURCES = ["memory"];
function normalizeSources(sources, sessionMemoryEnabled) {
	const normalized = /* @__PURE__ */ new Set();
	const input = sources?.length ? sources : DEFAULT_SOURCES;
	for (const source of input) {
		if (source === "memory") normalized.add("memory");
		if (source === "sessions" && sessionMemoryEnabled) normalized.add("sessions");
	}
	if (normalized.size === 0) normalized.add("memory");
	return Array.from(normalized);
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
