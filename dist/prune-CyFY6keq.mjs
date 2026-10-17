import { o as asDateTimestampMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { n as resolveSandboxAgentId } from "./shared-2nFGF-qq.mjs";
import { d as removeSandboxRegistryRuntime, h as withSandboxRegistryEntryLock, i as readBrowserRegistry, o as readRegistry, t as assertSandboxBrowserRegistryEntryCurrent, u as removeSandboxRegistryGeneration } from "./registry-BmXc2WeW.mjs";
import { d as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-Yzu4yhJD.mjs";
import { c as usesSandboxRuntimeReservations, i as getSandboxBackendManager } from "./backend-Bhk9VbVt.mjs";
import { r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-BI_v0pGs.mjs";
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
	params.assertCurrent?.();
	for (const entry of registry.entries) {
		if (!shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, entry), now, entry)) continue;
		try {
			await params.remove(entry, (current) => shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, current), now, current));
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
		remove: (entry, shouldRemove) => removeSandboxRegistryRuntime(entry, async (current) => {
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
			shouldRemove,
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
		remove: async (entry, shouldRemove) => {
			await withSandboxRegistryEntryLock({
				...entry,
				backendId: "docker"
			}, async () => {
				assertCurrent?.();
				const current = (await readBrowserRegistry()).entries.find((candidate) => candidate.containerName === entry.containerName);
				assertCurrent?.();
				if (!current || !shouldRemove(current)) return;
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
		const currentConfig = config ?? getRuntimeConfig();
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
