import { l as isNixMode } from "./paths-DehQwyE0.mjs";
import { n as measureStartup } from "./server-startup-trace-Dr4kvRe8.mjs";
//#region src/gateway/server-startup-early.ts
const loadRemoteSkillsRuntimeModule = async () => await import("./remote-oPvbN3Jo.mjs");
/** Start early Gateway side runtimes before the main server is fully ready. */
async function startGatewayEarlyRuntime(params) {
	const startSideRuntimes = !params.minimalTestGateway && !params.updateCanary;
	if (startSideRuntimes) await measureStartup(params.startupTrace, "runtime.early.task-state", async () => {
		const { ensureTaskRuntimeStateReady } = await import("./runtime-internal-Ct7Qp3gR.mjs");
		await ensureTaskRuntimeStateReady();
		const { reconcileRetainedHarnessCompletionDeliveries } = await import("./agent-harness-completion-delivery-DnEG_zp2.mjs");
		reconcileRetainedHarnessCompletionDeliveries();
	});
	params.swapDiscovery(await measureStartup(params.startupTrace, "runtime.early.discovery", async () => {
		if (!startSideRuntimes) return null;
		const machineDisplayName = await measureStartup(params.startupTrace, "runtime.early.discovery.machine-name", async () => (await import("./machine-name-BBa6wHaH.mjs")).getMachineDisplayName());
		return await measureStartup(params.startupTrace, "runtime.early.discovery.start", async () => {
			const { startGatewayDiscovery } = await import("./server-discovery-runtime-CFvWbNgK.mjs");
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
	let getActiveTaskCount = () => 0;
	if (startSideRuntimes) {
		const [{ primeRemoteSkillsCache, setSkillsRemoteRegistry }, taskRegistryMaintenance] = await measureStartup(params.startupTrace, "runtime.early.lazy-runtime-imports", () => Promise.all([loadRemoteSkillsRuntimeModule(), import("./task-registry.maintenance-DpeVtl6M.mjs")]));
		setSkillsRemoteRegistry(params.nodeRegistry);
		primeRemoteSkillsCache();
		taskRegistryMaintenance.configureTaskRegistryMaintenance({ runtimeAuthoritative: true });
		taskRegistryMaintenance.startTaskRegistryMaintenance();
		getActiveTaskCount = () => taskRegistryMaintenance.getInspectableActiveTaskRestartBlockers().length;
	}
	const skillsChangeUnsub = !startSideRuntimes ? async () => {} : await measureStartup(params.startupTrace, "runtime.early.skills-listener", async () => {
		const skillsRuntimePromise = import("./refresh-E4dYncpU.mjs");
		const remoteSkillsRuntimePromise = loadRemoteSkillsRuntimeModule();
		const { closeSkillsWatchers, registerSkillsChangeListener } = await skillsRuntimePromise;
		const { refreshRemoteBinsForConnectedNodes } = await remoteSkillsRuntimePromise;
		const unregister = registerSkillsChangeListener((event) => {
			if (event.reason === "remote-node") {
				params.broadcast("skills.changed", { reason: event.reason });
				return;
			}
			const existingTimer = params.getSkillsRefreshTimer();
			if (existingTimer) clearTimeout(existingTimer);
			const nextTimer = setTimeout(() => {
				params.setSkillsRefreshTimer(null);
				refreshRemoteBinsForConnectedNodes(params.getRuntimeConfig()).then(() => {
					params.broadcast("skills.changed", { reason: event.reason });
				}, (error) => {
					params.log.warn(`failed to refresh remote bins after skills change: ${String(error)}`);
					params.broadcast("skills.changed", { reason: event.reason });
				});
			}, params.skillsRefreshDelayMs);
			params.setSkillsRefreshTimer(nextTimer);
		});
		return async () => {
			unregister();
			await closeSkillsWatchers();
		};
	});
	const startMaintenance = async (activeWorkInspectors) => {
		if (!startSideRuntimes || params.isClosing()) return null;
		return await measureStartup(params.startupTrace, "post-ready.maintenance", async () => {
			const { startGatewayMaintenanceTimers } = await import("./server-maintenance-ixnU0llV.mjs");
			if (params.isClosing()) return null;
			return startGatewayMaintenanceTimers({
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
		getActiveTaskCount,
		skillsChangeUnsub,
		startMaintenance
	};
}
//#endregion
export { startGatewayEarlyRuntime };
