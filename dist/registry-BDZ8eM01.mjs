import { d as withPluginRuntimeRegistryScope, i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as getPluginRegistryLifetime, x as isPluginRegistryRetired } from "./registry-lifecycle-CjTFYNkp.mjs";
import { d as runPluginCleanup } from "./plugin-instance-scope-BoTOTPL4.mjs";
import "./runtime-DkPagH0y.mjs";
import { n as AgentHarnessSessionCleanupError } from "./errors-BAipjK5G.mjs";
import { i as retainCliRegistryHarnesses } from "./runtime-cleanup-scope-Dv2f28xK.mjs";
import { n as getPluginRegistryInspectionResources } from "./registry-inspection-resources-COvkPmap.mjs";
//#region src/agents/harness/registry.ts
const log = createSubsystemLogger("agents/harness");
const CODEX_NATIVE_COMPACTION_OWNER_ID = "codex";
const warnedResetHarnessIds = /* @__PURE__ */ new Set();
function getAgentHarnesses() {
	const registry = getPluginRegistryForContext();
	if (!registry || isPluginRegistryRetired(registry)) return [];
	retainCliRegistryHarnesses(registry, (harness) => withPluginRuntimeRegistryScope(registry, () => disposeAgentHarness(harness)), () => getPluginRegistryInspectionResources(registry)?.retain().release ?? getPluginRegistryLifetime(registry)?.retain());
	return registry.agentHarnesses;
}
/** Returns the harness plus plugin ownership metadata for registry diagnostics. */
function getRegisteredAgentHarness(id) {
	const registration = getAgentHarnesses().find((entry) => entry.harness.id === id.trim());
	return registration ? {
		harness: registration.harness,
		ownerPluginId: registration.pluginId === "core" ? void 0 : registration.pluginId
	} : void 0;
}
/** Resolves the registry-owned approval identity for the exact registered harness object. */
function resolveAgentHarnessOwnerPluginId(harness) {
	const registration = getRegisteredAgentHarness(harness.id);
	if (registration?.harness !== harness) throw new Error(`Agent harness ${harness.id} changed during owner resolution.`);
	return registration.ownerPluginId ?? "core";
}
/** Resolves the private Codex compaction bridge from exact registry-owned capability state. */
function resolveCodexAgentHarnessNativeCompaction(harness) {
	if (harness.id !== CODEX_NATIVE_COMPACTION_OWNER_ID) return;
	const registration = getAgentHarnesses().find((entry) => entry.harness.id === CODEX_NATIVE_COMPACTION_OWNER_ID);
	if (registration?.harness !== harness) throw new Error(`Agent harness ${harness.id} changed during native compaction resolution.`);
	return registration.pluginId === CODEX_NATIVE_COMPACTION_OWNER_ID ? registration.nativeCompaction : void 0;
}
function listRegisteredAgentHarnesses() {
	return getAgentHarnesses().map((entry) => ({
		harness: entry.harness,
		ownerPluginId: entry.pluginId === "core" ? void 0 : entry.pluginId
	}));
}
/** Resets each live harness owner once, retaining the caller's registry for direct hosts. */
async function resetRegisteredAgentHarnessSessions(params, executionRegistries = []) {
	const current = getPluginRegistryForContext();
	const registries = /* @__PURE__ */ new Set([...executionRegistries, ...current ? [current] : []]);
	const visited = /* @__PURE__ */ new Set();
	let cleanupError;
	for (const registry of registries) await withPluginRuntimeRegistryScope(registry, async () => {
		await Promise.all(listRegisteredAgentHarnesses().map(async (entry) => {
			if (!entry.harness.reset || visited.has(entry.harness)) return;
			visited.add(entry.harness);
			try {
				await entry.harness.reset(params);
			} catch (error) {
				if (error instanceof AgentHarnessSessionCleanupError) {
					cleanupError ??= error;
					return;
				}
				if (!warnedResetHarnessIds.has(entry.harness.id)) {
					warnedResetHarnessIds.add(entry.harness.id);
					log.warn(`${entry.harness.label} session reset hook failed`, {
						harnessId: entry.harness.id,
						error
					});
				}
			}
		}));
	});
	if (cleanupError) throw cleanupError;
}
async function disposeAgentHarness(harness) {
	try {
		await runPluginCleanup(harness, () => harness.dispose?.());
	} catch (error) {
		log.warn(`${harness.label} dispose hook failed`, {
			harnessId: harness.id,
			error
		});
	}
}
async function disposeRegisteredAgentHarnesses() {
	await Promise.all(listRegisteredAgentHarnesses().map(({ harness }) => disposeAgentHarness(harness)));
}
//#endregion
export { resolveAgentHarnessOwnerPluginId as a, resetRegisteredAgentHarnessSessions as i, getRegisteredAgentHarness as n, resolveCodexAgentHarnessNativeCompaction as o, listRegisteredAgentHarnesses as r, disposeRegisteredAgentHarnesses as t };
