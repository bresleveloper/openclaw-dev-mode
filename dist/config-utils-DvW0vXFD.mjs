import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as tryResolveRawLegacyDefaultAgentId, n as listAgentEntries, s as tryResolveLegacyDataOwner } from "./agent-roster-gkYP38su.mjs";
import { n as resolveStateDir, t as resolveDefaultAgentWorkspaceDir } from "./openclaw-runtime-paths-BEYXs6HA.mjs";
import path from "node:path";
//#region packages/memory-host-sdk/src/host/config-utils.ts
/** Trim and deduplicate configured extra-memory roots without losing pattern identity. */
function normalizeConfiguredMemoryExtraPaths(extraPaths) {
	const normalized = /* @__PURE__ */ new Map();
	for (const entry of extraPaths ?? []) {
		const configuredPath = (typeof entry === "string" ? entry : entry.path).trim();
		const pattern = typeof entry === "string" ? "" : entry.pattern?.trim() || "";
		if (configuredPath) normalized.set(`${configuredPath}\0${pattern}`, pattern ? {
			path: configuredPath,
			pattern
		} : configuredPath);
	}
	return Array.from(normalized.values());
}
function resolveRememberAcrossConversations(cfg, agentId) {
	const defaults = cfg.memory?.search;
	const explicit = (resolveAgentConfig(cfg, agentId)?.memory?.search)?.rememberAcrossConversations ?? defaults?.rememberAcrossConversations;
	if (explicit !== void 0) return explicit;
	return (cfg.session?.dmScope === void 0 || cfg.session.dmScope === "main") && !cfg.bindings?.some((binding) => {
		if (!binding || typeof binding !== "object") return false;
		const session = binding.session;
		return Boolean(session) && typeof session === "object" && session.dmScope !== void 0;
	});
}
const MEMORY_HOST_ROOT_FILENAME = "MEMORY.md";
const DEFAULT_AGENT_ID = "main";
/** Preserve raw default-marker, then first-agent, workspace inheritance. */
function resolveDefaultAgentId(cfg) {
	return normalizeAgentId(tryResolveRawLegacyDefaultAgentId(cfg) ?? listAgentEntries(cfg)[0]?.id ?? DEFAULT_AGENT_ID);
}
function resolveAgentConfig(cfg, agentId) {
	const id = normalizeAgentId(agentId);
	return listAgentEntries(cfg).find((entry) => normalizeAgentId(entry.id) === id);
}
/** Remove null bytes before paths are handed to filesystem APIs. */
function stripNullBytes(value) {
	return value.replaceAll("\0", "");
}
function resolveMemoryHostAgentWorkspaceDir(cfg, agentId, env = process.env) {
	const id = normalizeAgentId(agentId);
	const configured = resolveAgentConfig(cfg, id)?.workspace?.trim();
	if (configured) return stripNullBytes(resolveUserPath(configured, env));
	const fallback = cfg.agents?.defaults?.workspace?.trim();
	if (id === (cfg.agents?.ownership === "explicit" ? tryResolveLegacyDataOwner(cfg) : resolveDefaultAgentId(cfg))) return stripNullBytes(fallback ? resolveUserPath(fallback, env) : resolveDefaultAgentWorkspaceDir(env));
	if (fallback) return stripNullBytes(path.join(resolveUserPath(fallback, env), id));
	return stripNullBytes(path.join(resolveStateDir(env), `workspace-${id}`));
}
/** Resolve context limits for an agent with defaults fallback. */
function resolveMemoryHostAgentContextLimits(cfg, agentId) {
	const defaults = cfg?.agents?.defaults?.contextLimits;
	if (!cfg || !agentId) return defaults;
	const overrides = resolveAgentConfig(cfg, agentId)?.contextLimits;
	return overrides ? {
		...defaults,
		...overrides
	} : defaults;
}
/** Resolve enabled memory search config plus deduplicated extra paths for an agent. */
function resolveMemoryHostSearchPathConfig(cfg, agentId) {
	const defaults = cfg.memory?.search;
	const overrides = resolveAgentConfig(cfg, agentId)?.memory?.search;
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	if (!enabled) return null;
	const extraPaths = normalizeConfiguredMemoryExtraPaths([...defaults?.extraPaths ?? [], ...overrides?.extraPaths ?? []]);
	return {
		enabled,
		rememberAcrossConversations: resolveRememberAcrossConversations(cfg, agentId),
		extraPaths
	};
}
//#endregion
export { resolveMemoryHostSearchPathConfig as a, resolveMemoryHostAgentWorkspaceDir as i, normalizeConfiguredMemoryExtraPaths as n, resolveRememberAcrossConversations as o, resolveMemoryHostAgentContextLimits as r, MEMORY_HOST_ROOT_FILENAME as t };
