import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { n as defaultRuntime } from "./runtime-B4lgFmsS.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./config-A41fTHlt.js";
import { D as readRegistry, E as readBrowserRegistry, O as removeBrowserRegistryEntry, k as removeRegistryEntry } from "./docker-mM8z5yjQ.js";
import { a as getSandboxBackendManager, k as dockerSandboxBackendManager, r as stopBrowserBridgeServer, t as BROWSER_BRIDGES } from "./browser-bridges-BBCPaB7P.js";
//#region src/agents/sandbox/prune.ts
/**
* Sandbox registry pruning.
*
* Removes stale runtime containers and browser bridges on a best-effort schedule.
*/
let lastPruneAtMs = 0;
function shouldPruneSandboxEntry(cfg, now, entry) {
	const idleHours = cfg.prune.idleHours;
	const maxAgeDays = cfg.prune.maxAgeDays;
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
	if (params.cfg.prune.idleHours === 0 && params.cfg.prune.maxAgeDays === 0) return;
	const registry = await params.read();
	for (const entry of registry.entries) {
		if (!shouldPruneSandboxEntry(params.cfg, now, entry)) continue;
		try {
			await params.removeRuntime(entry);
			await params.remove(entry.containerName);
			await params.onRemoved?.(entry);
		} catch (error) {
			const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox prune failed to remove ${entry.containerName}: ${message ?? "unknown error"}`);
		}
	}
}
/** Prunes ordinary sandbox runtime containers from the configured backend manager. */
async function pruneSandboxContainers(cfg) {
	const config = getRuntimeConfig();
	await pruneSandboxRegistryEntries({
		cfg,
		read: readRegistry,
		remove: removeRegistryEntry,
		removeRuntime: async (entry) => {
			await getSandboxBackendManager(entry.backendId ?? "docker")?.removeRuntime({
				entry,
				config
			});
		}
	});
}
/** Prunes browser bridge containers and closes matching in-process bridge servers. */
async function pruneSandboxBrowsers(cfg) {
	const config = getRuntimeConfig();
	await pruneSandboxRegistryEntries({
		cfg,
		read: readBrowserRegistry,
		remove: removeBrowserRegistryEntry,
		removeRuntime: async (entry) => {
			await dockerSandboxBackendManager.removeRuntime({
				entry: {
					...entry,
					backendId: "docker",
					runtimeLabel: entry.containerName,
					configLabelKind: "Image"
				},
				config
			});
		},
		onRemoved: async (entry) => {
			const bridge = BROWSER_BRIDGES.get(entry.sessionKey);
			if (bridge?.containerName === entry.containerName) {
				await stopBrowserBridgeServer(bridge.bridge.server).catch(() => void 0);
				BROWSER_BRIDGES.delete(entry.sessionKey);
			}
		}
	});
}
/** Runs sandbox pruning at most once per throttle window. */
async function maybePruneSandboxes(cfg) {
	const now = Date.now();
	if (now - lastPruneAtMs < 300 * 1e3) return;
	lastPruneAtMs = now;
	try {
		await pruneSandboxContainers(cfg);
		await pruneSandboxBrowsers(cfg);
	} catch (error) {
		const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox prune failed: ${message ?? "unknown error"}`);
	}
}
//#endregion
export { maybePruneSandboxes };
