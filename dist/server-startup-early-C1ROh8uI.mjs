import { l as isNixMode } from "./paths-orClZ-2Z.mjs";
import { c as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as measureStartup } from "./server-startup-trace-D_q4lWuA.mjs";
import { d as setSessionMcpRuntimeScheduler } from "./agent-bundle-mcp-manager-api-BF9Uyz8N.mjs";
//#region src/gateway/server-startup-early.ts
/** Start early Gateway side runtimes before the main server is fully ready. */
async function startGatewayEarlyRuntime(params) {
	await setSessionMcpRuntimeScheduler(params.scheduler);
	const startSideRuntimes = !params.minimalTestGateway && !params.updateCanary;
	params.swapDiscovery(await measureStartup(params.startupTrace, "runtime.early.discovery", async () => {
		if (!startSideRuntimes) return null;
		const machineDisplayName = await measureStartup(params.startupTrace, "runtime.early.discovery.machine-name", async () => (await import("./machine-name-DMvZ7_S2.mjs")).getMachineDisplayName());
		return await measureStartup(params.startupTrace, "runtime.early.discovery.start", async () => {
			const { startGatewayDiscovery } = await import("./server-discovery-runtime-B6e7mG_O.mjs");
			return await startGatewayDiscovery({
				machineDisplayName,
				port: params.port,
				gatewayTls: params.gatewayTls.enabled ? params.gatewayTls : void 0,
				gatewayDirectReachable: params.gatewayDirectReachable,
				discovery: params.cfgAtStart.discovery,
				tailscaleMode: params.tailscaleMode,
				gatewayDiscoveryServices: params.pluginRegistry?.gatewayDiscoveryServices,
				pluginRuntimeClaim: params.pluginRuntimeClaim,
				logDiscovery: params.logDiscovery
			});
		});
	}));
	if (startSideRuntimes) {
		const [{ primeRemoteSkillsCache, setSkillsRemoteRegistry }, { startCronMaintenance }] = await measureStartup(params.startupTrace, "runtime.early.lazy-runtime-imports", () => Promise.all([import("./remote-C7EtdSLd.mjs"), import("./maintenance-B0-QKfYN.mjs")]));
		setSkillsRemoteRegistry(params.nodeRegistry);
		primeRemoteSkillsCache();
		if (!params.isClosing()) startCronMaintenance(params.scheduler, params.getCronStorePath);
	}
	const skillsChangeUnsub = !startSideRuntimes ? async () => {} : await measureStartup(params.startupTrace, "runtime.early.skills-listener", async () => {
		const skillsRuntimePromise = import("./refresh-C3a1Ipyv.mjs");
		const remoteSkillsRuntimePromise = import("./remote-C7EtdSLd.mjs");
		const { closeSkillsWatchers, detachSkillsWatchers, registerSkillsChangeListener } = await skillsRuntimePromise;
		const { refreshRemoteBinsForConnectedNodes } = await remoteSkillsRuntimePromise;
		const unregister = registerSkillsChangeListener((event) => {
			if (params.isClosing()) return;
			if (event.reason === "watch-available") return;
			if (event.reason === "remote-node") {
				params.broadcast("skills.changed", { reason: event.reason });
				return;
			}
			params.broadcast("skills.changed", { reason: event.reason });
			params.scheduler.schedule({
				id: "skills.remote-bin-refresh",
				delayMs: 3e4,
				run: async () => {
					if (params.isClosing()) return;
					try {
						await refreshRemoteBinsForConnectedNodes(params.getRuntimeConfig());
					} catch (error) {
						params.log.warn(`failed to refresh remote bins after skills change: ${String(error)}`);
					}
				}
			});
		});
		return async ({ exitAfterClose = false } = {}) => {
			unregister();
			await (exitAfterClose ? detachSkillsWatchers() : closeSkillsWatchers());
		};
	});
	const startMaintenance = async (activeWorkInspectors, resolveGatewayContext) => {
		if (!startSideRuntimes || params.isClosing()) return null;
		return await measureStartup(params.startupTrace, "post-ready.maintenance", async () => {
			const [{ refreshSkillsDiscovery }, { startGatewayMaintenanceTimers }] = await Promise.all([import("./refresh-C3a1Ipyv.mjs"), import("./server-maintenance-BeJ8rxND.mjs")]);
			if (params.isClosing()) return null;
			try {
				await refreshSkillsDiscovery({
					config: params.getRuntimeConfig(),
					pluginMetadataSnapshot: params.getPluginMetadataSnapshot()
				});
			} catch (error) {
				params.log.warn(`failed to refresh skills during startup: ${String(error)}`);
			}
			if (params.isClosing()) return null;
			return withPluginRuntimeGatewayContextResolver(resolveGatewayContext, () => startGatewayMaintenanceTimers({
				...params.maintenance,
				scheduler: params.scheduler,
				broadcast: params.broadcast,
				activeWorkInspectors,
				isNixMode,
				getRuntimeConfig: params.getRuntimeConfig
			}), { inheritRequestScope: false });
		});
	};
	return {
		skillsChangeUnsub,
		startMaintenance
	};
}
//#endregion
export { startGatewayEarlyRuntime };
