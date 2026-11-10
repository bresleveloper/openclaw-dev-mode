import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./config-B3oiWDlr.mjs";
import { r as resolveSandboxConfigForAgent } from "./config-Bf089UPS.mjs";
import { n as resolveSandboxAgentId } from "./shared-BtZkFvkt.mjs";
import { s as shouldPruneSandboxRegistryEntry } from "./registry.kernel-DbYv0cl_.mjs";
import { d as removeSandboxRegistryRuntime, h as withSandboxRegistryEntryLock, i as readBrowserRegistry, o as readRegistry, t as assertSandboxBrowserRegistryEntryCurrent, u as removeSandboxRegistryGeneration } from "./registry-BFvNacyu.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager, l as dockerSandboxBackendManager } from "./backend-B--cbVv-.mjs";
import { r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-DdrqFpzw.mjs";
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
/** Removes expired registry entries and their backing runtime resources. */
async function pruneSandboxRegistryEntries(params) {
	const now = Date.now();
	const registry = await params.read();
	params.assertCurrent?.();
	for (const entry of registry.entries) {
		const prune = {
			...resolveEntryPruneConfig(params.config, entry),
			now
		};
		if (!shouldPruneSandboxRegistryEntry(entry, prune)) continue;
		try {
			await params.remove(entry, prune);
			params.assertCurrent?.();
		} catch (error) {
			params.assertCurrent?.();
			const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox prune failed to remove ${entry.containerName}: ${message ?? "unknown error"}`);
		}
	}
}
/** Prunes ordinary sandbox runtime containers from the configured backend manager. */
async function pruneSandboxContainers(config, guard) {
	const assertCurrent = guard.beforeLegacyApply;
	await pruneSandboxRegistryEntries({
		config,
		assertCurrent,
		read: readRegistry,
		remove: (entry, prune) => removeSandboxRegistryRuntime(entry, async (current) => {
			const backendId = current.backendId ?? "docker";
			const manager = getSandboxBackendManager(backendId);
			if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
			assertCurrent?.();
			await manager.removeRuntime({
				entry: current,
				config,
				agentId: resolveSandboxAgentId(current.sessionKey)
			});
			assertCurrent?.();
		}, {
			reserveRuntime: usesSandboxRuntimeReservations(entry.backendId ?? "docker"),
			prune,
			guard
		})
	});
}
/** Prunes browser bridge containers and closes matching in-process bridge servers. */
async function pruneSandboxBrowsers(config, assertCurrent) {
	await pruneSandboxRegistryEntries({
		config,
		assertCurrent,
		read: readBrowserRegistry,
		remove: async (entry, prune) => {
			await withSandboxRegistryEntryLock({
				...entry,
				backendId: "docker"
			}, async () => {
				assertCurrent?.();
				const current = (await readBrowserRegistry()).entries.find((candidate) => candidate.containerName === entry.containerName);
				assertCurrent?.();
				if (!current || !shouldPruneSandboxRegistryEntry(current, prune)) return;
				try {
					assertSandboxBrowserRegistryEntryCurrent(entry);
				} catch {
					return;
				}
				assertCurrent?.();
				await stopCachedBrowserBridgesForContainer(current.containerName, assertCurrent);
				assertCurrent?.();
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
				assertCurrent?.();
				await removeSandboxRegistryGeneration("browser", current, assertCurrent);
				assertCurrent?.();
			});
		}
	});
}
/** Runs sandbox pruning at most once per throttle window. */
async function maybePruneSandboxes(config, assertCurrent, assertHost) {
	assertCurrent?.();
	const now = Date.now();
	if (now - lastPruneAtMs < 3e5) return;
	lastPruneAtMs = now;
	try {
		const currentConfig = config ?? readRuntimeConfig();
		await pruneSandboxContainers(currentConfig, {
			assertHost,
			beforeLegacyApply: assertCurrent
		});
		assertCurrent?.();
		await pruneSandboxBrowsers(currentConfig, assertCurrent);
		assertCurrent?.();
	} catch (error) {
		assertCurrent?.();
		const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox prune failed: ${message ?? "unknown error"}`);
	}
}
//#endregion
export { maybePruneSandboxes };
