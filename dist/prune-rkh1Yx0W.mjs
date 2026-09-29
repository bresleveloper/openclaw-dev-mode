import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-B2J3OrFT.mjs";
import { n as resolveSandboxAgentId } from "./shared-ByhrzAKj.mjs";
import { _ as withSandboxRegistryEntryLock, c as readRegistry, f as removeSandboxRegistryGeneration, o as readBrowserRegistry, p as removeSandboxRegistryRuntime, t as assertSandboxBrowserRegistryEntryCurrent } from "./registry-D02eWy_Z.mjs";
import { p as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-D4P15W-X.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager } from "./backend-CGPDIYBL.mjs";
import { r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-CLHmKa7a.mjs";
//#region src/agents/sandbox/prune.ts
/**
* Sandbox registry pruning.
*
* Removes stale runtime containers and browser bridges on a best-effort schedule.
*/
let lastPruneAtMs = 0;
function resolveEntryPruneConfig(config, entry) {
	return resolveSandboxConfigForAgent(config, resolveSandboxAgentId(entry.sessionKey)).prune;
}
function shouldPruneSandboxEntry(prune, now, entry) {
	const idleHours = prune.idleHours;
	const maxAgeDays = prune.maxAgeDays;
	if (idleHours === 0 && maxAgeDays === 0) return false;
	const nowMs = asDateTimestampMs(now) ?? 0;
	const lastUsedAtMs = asDateTimestampMs(entry.lastUsedAtMs) ?? 0;
	const createdAtMs = asDateTimestampMs(entry.createdAtMs) ?? 0;
	const idleMs = nowMs - lastUsedAtMs;
	const ageMs = nowMs - createdAtMs;
	return idleHours > 0 && idleMs > idleHours * 60 * 60 * 1e3 || maxAgeDays > 0 && ageMs > maxAgeDays * 24 * 60 * 60 * 1e3;
}
/** Removes expired registry entries and their backing runtime resources. */
async function pruneSandboxRegistryEntries(params) {
	const now = Date.now();
	const registry = await params.read();
	for (const entry of registry.entries) {
		if (!shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, entry), now, entry)) continue;
		try {
			await params.remove(entry, (current) => shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, current), now, current));
		} catch (error) {
			const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox prune failed to remove ${entry.containerName}: ${message ?? "unknown error"}`);
		}
	}
}
/** Prunes ordinary sandbox runtime containers from the configured backend manager. */
async function pruneSandboxContainers(config) {
	await pruneSandboxRegistryEntries({
		config,
		read: readRegistry,
		remove: (entry, shouldRemove) => removeSandboxRegistryRuntime(entry, async (current) => {
			const backendId = current.backendId ?? "docker";
			const manager = getSandboxBackendManager(backendId);
			if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
			await manager.removeRuntime({
				entry: current,
				config,
				agentId: resolveSandboxAgentId(current.sessionKey)
			});
		}, {
			reserveRuntime: usesSandboxRuntimeReservations(entry.backendId ?? "docker"),
			shouldRemove
		})
	});
}
/** Prunes browser bridge containers and closes matching in-process bridge servers. */
async function pruneSandboxBrowsers(config) {
	await pruneSandboxRegistryEntries({
		config,
		read: readBrowserRegistry,
		remove: async (entry, shouldRemove) => {
			await withSandboxRegistryEntryLock({
				...entry,
				backendId: "docker"
			}, async () => {
				const current = (await readBrowserRegistry()).entries.find((candidate) => candidate.containerName === entry.containerName);
				if (!current || !shouldRemove(current)) return;
				try {
					assertSandboxBrowserRegistryEntryCurrent(entry);
				} catch {
					return;
				}
				await stopCachedBrowserBridgesForContainer(current.containerName);
				await dockerSandboxBackendManager.removeRuntime({
					entry: {
						...current,
						backendId: "docker",
						runtimeLabel: current.containerName,
						configLabelKind: "Image"
					},
					config,
					agentId: resolveSandboxAgentId(current.sessionKey)
				});
				removeSandboxRegistryGeneration("browser", current, () => assertSandboxBrowserRegistryEntryCurrent(current));
			});
		}
	});
}
/** Runs sandbox pruning at most once per throttle window. */
async function maybePruneSandboxes(config) {
	const now = Date.now();
	if (now - lastPruneAtMs < 3e5) return;
	lastPruneAtMs = now;
	try {
		const currentConfig = config ?? getRuntimeConfig();
		await pruneSandboxContainers(currentConfig);
		await pruneSandboxBrowsers(currentConfig);
	} catch (error) {
		const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox prune failed: ${message ?? "unknown error"}`);
	}
}
//#endregion
export { maybePruneSandboxes };
