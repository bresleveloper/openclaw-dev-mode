import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as resolveChannelAccountBindingRepairInput } from "./legacy-config-binding-repair-input-LZJfZZrP.mjs";
import { r as projectLegacyAgentRosterEntries } from "./legacy.roster-zIYbDm7V.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import { n as resolveReadOnlyChannelPluginsForConfig } from "./read-only-BvrVstXM.mjs";
//#region src/commands/doctor/shared/legacy-config-binding-repair.ts
function pruneBindingsForMissingAgents(cfg, changes) {
	const agents = cfg.agents?.list;
	const bindings = cfg.bindings;
	if (!Array.isArray(agents) || agents.length === 0 || !Array.isArray(bindings)) return cfg;
	const validAgents = agents.filter((agent) => {
		return agent !== null && typeof agent === "object" && typeof agent.id === "string";
	});
	if (validAgents.length !== agents.length) return cfg;
	const agentIds = new Set(validAgents.map((agent) => normalizeAgentId(agent.id)));
	const nextBindings = bindings.filter((binding) => {
		const agentId = binding && typeof binding === "object" ? binding.agentId : void 0;
		return typeof agentId !== "string" || agentId === "main" || agentIds.has(normalizeAgentId(agentId));
	});
	const removed = bindings.length - nextBindings.length;
	if (removed === 0) return cfg;
	changes.push(`Removed ${removed} binding${removed === 1 ? "" : "s"} that referenced missing agents.list ids.`);
	return {
		...cfg,
		...nextBindings.length > 0 ? { bindings: nextBindings } : { bindings: void 0 }
	};
}
/** Preserve proven route owners before explicit ownership retires implicit account routing. */
function repairUnownedChannelAccountBindings({ config: cfg, sourceConfigBeforeMigrations }) {
	const input = resolveChannelAccountBindingRepairInput(cfg);
	if (!input) return {
		config: cfg,
		changes: []
	};
	const { agentIds, bindings } = input;
	const additions = [];
	const warnings = [];
	const sourceAgents = asNullableRecord(asNullableRecord(sourceConfigBeforeMigrations)?.agents);
	const sourceList = sourceAgents?.list;
	const legacyDefaultAgentId = sourceAgents?.ownership === void 0 && sourceAgents?.entries === void 0 && Array.isArray(sourceList) && sourceList.length > 1 && sourceList.every((entry) => isRecord(entry) && typeof entry.id === "string" && entry.id.trim().length > 0 && (entry.default === void 0 || entry.default === false)) ? projectLegacyAgentRosterEntries(sourceList).entries[0]?.id : void 0;
	const inventory = resolveReadOnlyChannelPluginsForConfig(cfg, {
		includePersistedAuthState: false,
		includeSetupFallbackPlugins: true
	});
	const plugins = new Map(inventory.plugins.map((plugin) => [plugin.id, plugin]));
	for (const channelId of [...inventory.configuredChannelIds].toSorted()) {
		const plugin = plugins.get(channelId);
		const channel = asNullableRecord(cfg.channels?.[channelId]);
		if (!plugin || channel?.enabled === false) continue;
		const accounts = asNullableRecord(channel?.accounts) ?? void 0;
		const accountIds = [...new Set(plugin.config.listAccountIds(cfg).map(normalizeAccountId))].toSorted();
		for (const accountId of accountIds) {
			const account = resolveChannelAccountEntry(accounts, accountId, channelId, normalizeAccountId);
			if (asNullableRecord(account)?.enabled === false) continue;
			const routeInput = {
				cfg,
				channel: channelId,
				accountId
			};
			let missingOwner;
			try {
				const route = resolveAgentRoute(routeInput);
				if (!legacyDefaultAgentId || route.matchedBy !== "default") continue;
			} catch (error) {
				if (!(error instanceof AgentSelectionRequiredError)) throw error;
				missingOwner = error;
			}
			const agentId = legacyDefaultAgentId;
			if (agentId && agentIds.has(agentId)) additions.push({
				agentId,
				match: {
					channel: channelId,
					accountId
				}
			});
			else if (missingOwner) warnings.push(!Array.isArray(sourceList) && !isRecord(sourceAgents?.entries) ? `${channelId}:${accountId} unresolved: original roster unavailable. ${missingOwner.message}` : missingOwner.message);
		}
	}
	return {
		config: additions.length ? {
			...cfg,
			bindings: [...bindings, ...additions]
		} : cfg,
		changes: additions.map(({ agentId, match }) => `Preserved ${match.channel}:${match.accountId} ownership with binding ${JSON.stringify({
			agentId,
			match
		})}.`),
		...warnings.length > 0 ? { warnings } : {}
	};
}
//#endregion
export { repairUnownedChannelAccountBindings as n, pruneBindingsForMissingAgents as t };
