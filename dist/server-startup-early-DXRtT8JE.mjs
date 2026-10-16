import { l as isNixMode } from "./paths-DGIwWbpu.mjs";
import { d as setSessionMcpRuntimeScheduler } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { n as measureStartup } from "./server-startup-trace-D88Ik5PK.mjs";
//#region src/gateway/server-startup-early.ts
const loadRemoteSkillsRuntimeModule = async () => await import("./remote-B2OAp9sJ.mjs");
/** Start early Gateway side runtimes before the main server is fully ready. */
async function startGatewayEarlyRuntime(params) {
	await setSessionMcpRuntimeScheduler(params.scheduler);
	const startSideRuntimes = !params.minimalTestGateway && !params.updateCanary;
	params.swapDiscovery(await measureStartup(params.startupTrace, "runtime.early.discovery", async () => {
		if (!startSideRuntimes) return null;
		const machineDisplayName = await measureStartup(params.startupTrace, "runtime.early.discovery.machine-name", async () => (await import("./machine-name-BuiKUq1s.mjs")).getMachineDisplayName());
		return await measureStartup(params.startupTrace, "runtime.early.discovery.start", async () => {
			const { startGatewayDiscovery } = await import("./server-discovery-runtime-B1riINEb.mjs");
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
		const [{ primeRemoteSkillsCache, setSkillsRemoteRegistry }, { startCronMaintenance }] = await measureStartup(params.startupTrace, "runtime.early.lazy-runtime-imports", () => Promise.all([loadRemoteSkillsRuntimeModule(), import("./maintenance-CR192Kbk.mjs")]));
		setSkillsRemoteRegistry(params.nodeRegistry);
		primeRemoteSkillsCache();
		if (!params.isClosing()) startCronMaintenance(params.scheduler);
	}
	const skillsChangeUnsub = !startSideRuntimes ? async () => {} : await measureStartup(params.startupTrace, "runtime.early.skills-listener", async () => {
		const skillsRuntimePromise = import("./refresh-D0Cr8MC9.mjs");
		const remoteSkillsRuntimePromise = loadRemoteSkillsRuntimeModule();
		const { closeSkillsWatchers, registerSkillsChangeListener } = await skillsRuntimePromise;
		const { refreshRemoteBinsForConnectedNodes } = await remoteSkillsRuntimePromise;
		const unregister = registerSkillsChangeListener((event) => {
			if (params.isClosing()) return;
			if (event.reason === "watch-available") return;
			if (event.reason === "remote-node") {
				params.broadcast("skills.changed", { reason: event.reason });
				return;
			}
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
					if (!params.isClosing()) params.broadcast("skills.changed", { reason: event.reason });
				}
			});
		});
		return async () => {
			unregister();
			await closeSkillsWatchers();
		};
	});
	const startMaintenance = async (activeWorkInspectors) => {
		if (!startSideRuntimes || params.isClosing()) return null;
		return await measureStartup(params.startupTrace, "post-ready.maintenance", async () => {
			const { startGatewayMaintenanceTimers } = await import("./server-maintenance-Cpv9JVJx.mjs");
			if (params.isClosing()) return null;
			return startGatewayMaintenanceTimers({
				scheduler: params.scheduler,
				broadcast: params.broadcast,
				nodeSendToAllSubscribed: params.nodeSendToAllSubscribed,
				getPresenceVersion: params.getPresenceVersion,
				getHealthVersion: params.getHealthVersion,
				refreshGatewayHealthSnapshot: params.refreshGatewayHealthSnapshot,
				restartRunningChannels: params.restartRunningChannels,
				activeWorkInspectors,
				refreshPresence: params.refreshPresence,
				resetEventLoopHealth: params.resetEventLoopHealth,
				logHealth: params.logHealth,
				clients: params.clients,
				dedupe: params.dedupe,
				chatAbortControllers: params.chatAbortControllers,
				chatQueuedTurns: params.chatQueuedTurns,
				restartRecoveryCandidates: params.restartRecoveryCandidates,
				chatRunState: params.chatRunState,
				removeChatRun: params.removeChatRun,
				agentRunSeq: params.agentRunSeq,
				nodeSendToSession: params.nodeSendToSession,
				isNixMode,
				getRuntimeConfig: params.getRuntimeConfig
			});
		});
	};
	return {
		skillsChangeUnsub,
		startMaintenance
	};
}
//#endregion
export { startGatewayEarlyRuntime };
