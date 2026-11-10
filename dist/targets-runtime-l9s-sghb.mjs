import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
//#region src/config/sessions/targets-runtime.ts
/** Discover configured and retired stores in the existing read worker. */
async function resolveAllAgentSessionStoreTargetsAsync(cfg, options = {}) {
	const request = prepareSessionStoreTargetInventory(cfg, listConfiguredSessionStoreAgentIds(cfg), options.env, "recovery");
	return prepareSessionStoreTargetInventoryRead(request, void 0, options.registeredDatabases).withRead(async (inventory) => inventory.agents.flatMap(({ result }) => result.available ? result.targets : []));
}
/** Resolve the reaper's roster through the same discovery owner as session reads. */
async function listKnownSessionStoreAgentIdsAsync(cfg, options = {}) {
	const request = prepareSessionStoreTargetInventory(cfg, listConfiguredSessionStoreAgentIds(cfg), options.env, "known-owners");
	return prepareSessionStoreTargetInventoryRead(request).withRead(async (inventory) => inventory.agents.map(({ agentId }) => agentId));
}
/** Keep unavailable storage distinct from an absent owner; callers must not infer deletion. */
async function resolveExistingAgentSessionStoreTargetsAsync(cfg, agentId, options = {}) {
	const request = prepareSessionStoreTargetInventory(cfg, [agentId], options.env);
	return prepareSessionStoreTargetInventoryRead(request).withRead(async (inventory) => {
		const selected = inventory.agents[0];
		if (!selected || !selected.result.available && selected.result.reason === "database-missing") return [];
		if (!selected.result.available) throw new Error(`Session store discovery failed (${selected.result.reason})`);
		return selected.result.targets.filter((target) => target.storePath !== options.excludeStorePath);
	});
}
//#endregion
export { resolveAllAgentSessionStoreTargetsAsync as n, resolveExistingAgentSessionStoreTargetsAsync as r, listKnownSessionStoreAgentIdsAsync as t };
