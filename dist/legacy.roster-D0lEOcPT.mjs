import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
//#region src/config/legacy.roster.ts
/** Keeps Doctor's allocated identities tied to their original authored list positions. */
function projectLegacyAgentRosterEntries(list) {
	const entries = [];
	const diagnostics = [];
	const ids = /* @__PURE__ */ new Set();
	for (const [sourceIndex, value] of list.entries()) {
		if (!isRecord(value)) {
			diagnostics.push(`Removed malformed agents.list[${sourceIndex}] entry.`);
			continue;
		}
		const rawId = typeof value.id === "string" && value.id.trim() ? value.id.trim() : "agent";
		const requestedId = normalizeAgentId(rawId);
		if (requestedId !== rawId) diagnostics.push(`Normalized agents.list id "${rawId}" → agents.entries.${requestedId}.`);
		let id = requestedId;
		let suffix = 2;
		while (ids.has(id)) {
			id = `${requestedId}-${suffix}`;
			suffix += 1;
		}
		const { id: _id, ...config } = value;
		entries.push({
			sourceIndex,
			id,
			config
		});
		ids.add(id);
		if (id !== requestedId) diagnostics.push(`Moved duplicate agents.list id "${requestedId}" to agents.entries.${id}.`);
	}
	return {
		entries,
		diagnostics
	};
}
/** Converts a valid legacy roster without applying ownership or runtime migrations. */
function parseLegacyAgentRoster(value) {
	if (!Array.isArray(value)) return;
	const ids = /* @__PURE__ */ new Set();
	const entries = [];
	for (const entry of value) {
		if (!isRecord(entry)) return;
		const { id, ...config } = entry;
		if (typeof id !== "string" || id.trim() !== id || !id) return;
		const normalizedId = normalizeAgentId(id);
		if (normalizedId !== id || ids.has(normalizedId)) return;
		ids.add(id);
		entries.push([id, config]);
	}
	return {
		entries: Object.fromEntries(entries),
		order: [...ids]
	};
}
/** Resolve the original data owner using the same occurrence identities Doctor allocates. */
function resolveLegacyAgentRosterOwner(raw) {
	const agents = isRecord(raw) && isRecord(raw.agents) ? raw.agents : void 0;
	if (!agents || agents.ownership === "explicit") return;
	const entries = Object.hasOwn(agents, "entries") ? isRecord(agents.entries) ? Object.entries(agents.entries).map(([id, config]) => ({
		id,
		config
	})) : [] : Array.isArray(agents.list) ? projectLegacyAgentRosterEntries(agents.list).entries : [];
	if (entries.length < 2 || entries.some(({ config }) => !isRecord(config) || Object.hasOwn(config, "default") && typeof config.default !== "boolean")) return;
	const marked = entries.filter(({ config }) => isRecord(config) && config.default === true);
	return marked.length === 1 ? normalizeAgentId(marked[0].id) : void 0;
}
//#endregion
export { projectLegacyAgentRosterEntries as n, resolveLegacyAgentRosterOwner as r, parseLegacyAgentRoster as t };
