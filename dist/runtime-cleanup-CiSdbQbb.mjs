import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import { a as stopActiveManagedProviderLocalServices, n as hasProviderTransportDispatcherPool } from "./provider-runtime-lifecycle-fpszViWt.mjs";
import { t as finalizeActiveDebugProxyCaptures } from "./runtime-cleanup-CDxMLsqE.mjs";
//#region src/cli/runtime-cleanup.ts
const DISPOSER_TIMEOUT_MS = 5e3;
const pendingDisposers = /* @__PURE__ */ new Map();
function getPendingCliDisposers() {
	return [...pendingDisposers.values()].map(({ name }) => name);
}
/** Automatic process exit must join cleanup that outlived its reporting grace. */
async function waitForPendingCliDisposers() {
	while (pendingDisposers.size > 0) await Promise.allSettled([...pendingDisposers.values()].map(({ operation }) => operation));
}
/** Preserve resources for overdue cleanup without making the command wait again. */
async function runCliDisposerAfterPending(name, dispose) {
	const pending = [...pendingDisposers.values()];
	if (pending.length === 0) return runCliDisposer(name, dispose);
	const token = Symbol(name);
	const predecessors = pending.filter(({ deferred }) => deferred).map((entry) => entry.operation);
	const operation = Promise.resolve().then(async () => {
		await Promise.allSettled(predecessors);
		for (;;) {
			const active = [...pendingDisposers.values()].filter(({ deferred }) => !deferred).map((entry) => entry.operation);
			if (active.length === 0) break;
			await Promise.allSettled(active);
		}
		pendingDisposers.delete(token);
		await runCliDisposer(name, dispose);
	});
	pendingDisposers.set(token, {
		name,
		operation,
		deferred: true
	});
	console.error(`CLI cleanup deferred: ${name} until pending disposers settle: ${pending.map((entry) => entry.name).join(", ")}`);
}
async function runCliDisposer(name, dispose, runCleanup, timeoutMs = DISPOSER_TIMEOUT_MS) {
	const token = Symbol(name);
	const operation = Promise.resolve().then(() => runCleanup ? runCleanup(dispose) : dispose()).finally(() => pendingDisposers.delete(token));
	pendingDisposers.set(token, {
		name,
		operation,
		deferred: false
	});
	try {
		await raceWithTimeout(operation, timeoutMs, () => {
			console.error(`CLI cleanup timed out: ${name} after ${timeoutMs}ms`);
		});
	} catch {}
}
async function closeCliResources(cleanup) {
	const runCleanup = cleanup?.pluginResources?.runCleanup;
	if (cleanup) {
		const scheduledWork = cleanup.scheduler.stop();
		await runCliDisposer("scheduled-work", () => scheduledWork, runCleanup);
		await scheduledWork;
	}
	const finalizers = {
		"agent-harnesses": async () => {
			const { listRegisteredAgentHarnesses, disposeRegisteredAgentHarnesses } = await import("./registry-XKLI-G8a.mjs");
			const registered = listRegisteredAgentHarnesses();
			if (!cleanup) {
				if (registered.length > 0) await disposeRegisteredAgentHarnesses();
				return;
			}
			const { markPluginRegistryRetired } = await import("./registry-lifecycle-BAGXm0-E.mjs");
			try {
				await Promise.all([...cleanup.harnesses].map(([harness, dispose]) => runCliDisposer(`agent-harness/${harness.id}`, dispose, runCleanup)));
			} finally {
				for (const registry of cleanup.registries) markPluginRegistryRetired(registry);
				cleanup.harnesses.clear();
				cleanup.registries.clear();
			}
		},
		"provider-local-services": stopActiveManagedProviderLocalServices,
		"provider-transport-dispatchers": async () => {
			if (hasProviderTransportDispatcherPool()) {
				const { closeProviderTransportDispatcherPool } = await import("./provider-transport-dispatcher-pool-CIlvbSmB.mjs");
				await closeProviderTransportDispatcherPool();
			}
		},
		"mcp-loopback": async () => {
			const { getActiveMcpLoopbackRuntime } = await import("./mcp-http.loopback-runtime-DcPzaK5r.mjs");
			if (getActiveMcpLoopbackRuntime()) {
				const { closeMcpLoopbackServer } = await import("./mcp-http-DfkbA3yf.mjs");
				await closeMcpLoopbackServer();
			}
		},
		memory: async () => {
			const { hasMemoryRuntime } = await import("./plugins/memory-state.js");
			if (hasMemoryRuntime()) {
				const { closeActiveMemorySearchManagersCore } = await import("./memory-runtime-BNDrcERN.mjs");
				await closeActiveMemorySearchManagersCore();
			}
		},
		"proxy-capture": finalizeActiveDebugProxyCaptures,
		"agent-databases": async () => {
			const { hasOpenClawAgentDatabaseAsyncResources } = await import("./openclaw-agent-db-resources-4k8R9RPJ.mjs");
			if (!hasOpenClawAgentDatabaseAsyncResources()) return;
			const { closeOpenClawAgentDatabasesAsync } = await import("./openclaw-agent-db-lifecycle-CxGnM_Lx.mjs");
			await closeOpenClawAgentDatabasesAsync();
		}
	};
	for (const [name, finalize] of Object.entries(finalizers)) await runCliDisposer(name, finalize, runCleanup);
}
//#endregion
export { waitForPendingCliDisposers as a, runCliDisposerAfterPending as i, getPendingCliDisposers as n, runCliDisposer as r, closeCliResources as t };
