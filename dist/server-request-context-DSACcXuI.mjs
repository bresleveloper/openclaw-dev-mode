import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as trackAsyncWork, r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { o as racePromiseWithAbortSignal, s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { n as getUserProfileDisplay } from "./user-profile-list-CtETKur7.mjs";
import { a as invalidateGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import "./user-profiles-DYQbtiqy.mjs";
import { s as publishOperatorRoleConfigChange } from "./operator-role-policy-BqPaarjx.mjs";
import { r as invalidateGatewayPolicyClient } from "./ws-policy-close-BgtfQbi3.mjs";
import { n as disconnectStaleSharedGatewayAuthClients, r as enforceSharedGatewaySessionGenerationForConfigWrite } from "./server-shared-auth-generation-C2ZgQQOt.mjs";
import { t as bindSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { r as prepareGatewayRecipientProfile } from "./expected-profile-DP5LiA7Q.mjs";
import { n as getPendingDevicePairing, t as getPairedDevice } from "./device-pairing-Drmq_Czv.mjs";
import { t as resolveSessionRequestTargets } from "./session-request-targets-DZ6yT_dq.mjs";
import { n as getHealthCache } from "./health-state-CFMejOLY.mjs";
import { t as NODE_DESKTOP_SERVICE_CONTEXT } from "./node-source-context-Csxf7qYw.mjs";
import { n as refreshClientPresence, r as snapshotClientPresence, t as recordClientPresenceActivity } from "./client-presence-O8mBp5sO.mjs";
//#region src/gateway/device-scope-upgrade.ts
const TERMINAL_GRACE_MS = 15e3;
const DURABLE_RECONCILE_INTERVAL_MS = 250;
function sameOwner(left, right) {
	return left.deviceId === right.deviceId && left.publicKey === right.publicKey;
}
/** Coordinates live device scope-upgrade waiters with the durable pairing store. */
var ScopeUpgradeCoordinator = class {
	constructor(scheduler) {
		this.entries = /* @__PURE__ */ new Map();
		this.work = new AsyncWorkScope();
		this.lifetimeBound = false;
		this.scheduler = scheduler.scope();
	}
	bindGatewayLifetime() {
		if (this.lifetimeBound || this.work.isClosing) return;
		this.lifetimeBound = true;
		const gatewaySignal = getAsyncWorkSignal();
		if (!gatewaySignal) return;
		if (gatewaySignal.aborted) {
			this.close();
			return;
		}
		const signal = AbortSignal.any([gatewaySignal, this.work.signal]);
		trackAsyncWork(() => new Promise((resolve, reject) => {
			signal.addEventListener("abort", () => {
				this.close().then(resolve, reject);
			}, { once: true });
		}));
	}
	async close() {
		this.work.beginClose();
		this.scheduler.beginClose();
		for (const entry of this.entries.values()) entry.wake.resolve();
		this.entries.clear();
		await this.work.drain();
	}
	register(params) {
		this.bindGatewayLifetime();
		if (this.work.isClosing) return false;
		const existing = this.entries.get(params.requestId);
		if (existing && !sameOwner(existing.owner, params.owner)) return false;
		const entry = existing ?? {
			requestId: params.requestId,
			owner: params.owner,
			requestedScopes: [...params.requestedScopes],
			initialToken: params.initialToken,
			initialApprovedAtMs: params.initialApprovedAtMs,
			expiresAtMs: 0,
			wake: createDeferredCore()
		};
		entry.requestedScopes = [...params.requestedScopes];
		entry.expiresAtMs = params.expiresAtMs;
		this.scheduleCleanup(entry, Math.max(0, entry.expiresAtMs + TERMINAL_GRACE_MS - this.scheduler.now()));
		this.entries.set(entry.requestId, entry);
		return true;
	}
	notify(requestId, resolution) {
		const entry = this.entries.get(requestId);
		if (!entry) return;
		entry.resolutionHint = resolution;
		const wake = entry.wake;
		entry.wake = createDeferredCore();
		wake.resolve();
	}
	async wait(requestId, owner) {
		const entry = this.entries.get(requestId);
		if (!entry || !sameOwner(entry.owner, owner)) return null;
		if (!entry.resultPromise) {
			const pending = this.work.track(() => this.waitForResult(entry));
			entry.resultPromise = pending;
			pending.catch(() => {
				if (entry.resultPromise === pending) entry.resultPromise = void 0;
			});
		}
		return await racePromiseWithAbortSignal(entry.resultPromise, getAsyncWorkSignal());
	}
	async waitForResult(entry) {
		while (!this.work.isClosing) {
			if (this.scheduler.now() >= entry.expiresAtMs) {
				this.scheduleCleanup(entry);
				return {
					status: "expired",
					requestId: entry.requestId
				};
			}
			const wake = entry.wake;
			const result = await this.readDurableResult(entry);
			if (this.work.isClosing) break;
			if (result) {
				this.scheduleCleanup(entry);
				return result;
			}
			const delayMs = Math.min(DURABLE_RECONCILE_INTERVAL_MS, Math.max(0, entry.expiresAtMs - this.scheduler.now()));
			try {
				await raceWithTimeout(wake.promise, delayMs, wake.resolve, { ref: false });
			} finally {
				if (entry.wake === wake) entry.wake = createDeferredCore();
			}
		}
		return null;
	}
	async readDurableResult(entry) {
		const pending = await getPendingDevicePairing(entry.requestId);
		if (this.work.isClosing || pending) return null;
		if (entry.resolutionHint === "rejected") return {
			status: "rejected",
			requestId: entry.requestId
		};
		const paired = await getPairedDevice(entry.owner.deviceId);
		if (this.work.isClosing) return null;
		const token = paired?.tokens?.operator;
		const approvedEvidence = entry.resolutionHint === "approved" || token?.token !== entry.initialToken && paired?.approvedAtMs !== entry.initialApprovedAtMs;
		if (paired?.publicKey !== entry.owner.publicKey || token === void 0 || token.revokedAtMs !== void 0 || !approvedEvidence) return {
			status: "rejected",
			requestId: entry.requestId
		};
		if (!roleScopesAllow({
			role: "operator",
			requestedScopes: entry.requestedScopes,
			allowedScopes: token.scopes
		})) return {
			status: "insufficient-scopes",
			requestId: entry.requestId
		};
		return {
			status: "approved",
			requestId: entry.requestId,
			deviceToken: token.token,
			scopes: token.scopes
		};
	}
	scheduleCleanup(entry, delayMs = TERMINAL_GRACE_MS) {
		this.scheduler.schedule({
			id: `device-scope-upgrade:${entry.requestId}`,
			delayMs,
			run: () => {
				this.entries.delete(entry.requestId);
			}
		});
	}
};
//#endregion
//#region src/gateway/server-request-context.ts
const ALL_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([GATEWAY_CLIENT_IDS.CONTROL_UI]);
const EXEC_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([
	GATEWAY_CLIENT_IDS.MACOS_APP,
	GATEWAY_CLIENT_IDS.IOS_APP,
	GATEWAY_CLIENT_IDS.ANDROID_APP
]);
const PLUGIN_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([GATEWAY_CLIENT_IDS.TUI]);
function canDeliverApprovals(gatewayClient, approvalKind) {
	if (gatewayClient.invalidated) return false;
	const scopes = Array.isArray(gatewayClient.connect.scopes) ? gatewayClient.connect.scopes : [];
	if (!(scopes.includes("operator.admin") || scopes.includes("operator.approvals"))) return false;
	return gatewayClient.internal?.approvalRuntime === true || ALL_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.APPROVALS) || approvalKind === "exec" && (EXEC_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.EXEC_APPROVALS)) || approvalKind === "plugin" && (PLUGIN_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.PLUGIN_APPROVALS));
}
function createGatewayRequestContext(params) {
	const { runtime } = params;
	const { connectionWork, runtimeState, lifecycle, cancelRunBoundApprovals, clients, broadcast, nodeRegistry, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForRuntimeSnapshot, sessionEventSubscribers, sessionMessageSubscribers, sessionObserver, sessionActivitySummaries } = runtime;
	const { getPortalService } = runtime.transportBridge;
	const workerSessionPlacementService = runtime.workerEnvironmentStartup?.placementStore;
	const workerPlacementDiskSpaceReader = runtime.workerPlacementRuntime?.diskSpace;
	const workerPlacementRunnerAvailabilityReader = runtime.workerPlacementRuntime?.runnerAvailability;
	const workerPlacementRuntimeInstallReader = runtime.workerPlacementRuntime?.runtimeInstall;
	const workerRepositoryWorkspaceMutationService = runtime.workerPlacementRuntime?.repositoryWorkspaceMutationService;
	const { invalidateSessionsForDevice: invalidateDeviceTransports, disconnectSessionsForDevice: disconnectDeviceTransports } = runtime.watchNodeHttpRuntime;
	const scopeUpgradeCoordinator = new ScopeUpgradeCoordinator(runtime.scheduler);
	const context = {
		trackExecution: (run) => connectionWork.track(run),
		deps: runtime.deps,
		configRevisionProjector: params.configRevisionProjector,
		get cron() {
			return runtimeState.cronState.cron;
		},
		get cronStorePath() {
			return runtimeState.cronState.storePath;
		},
		getRuntimeConfig,
		resolveSessionRequestTargets: (request) => resolveSessionRequestTargets({
			...request,
			context
		}),
		getCommittedRuntimeConfig: () => runtimeState.configReloader.getCommittedRuntimeConfig?.() ?? getRuntimeConfig(),
		isConfigReloadSettled: () => !lifecycle.closePreludeStarted && runtimeState.configReloader.isConfigReloadSettled(),
		getDeferredChannelReloads: () => lifecycle.closePreludeStarted ? [] : runtimeState.configReloader.getDeferredChannelReloads?.() ?? [],
		getGatewayMethodRegistry: runtime.getAttachedGatewayMethodRegistry,
		get gatewayTlsFingerprint() {
			return runtime.gatewayTls.enabled ? runtime.gatewayTls.fingerprintSha256 : void 0;
		},
		controlUiSessionPullRequests: runtimeState.controlUiSessionPullRequests,
		sessionViewerPresence: runtimeState.sessionViewerPresence,
		sessionCompanion: runtime.sessionCompanion,
		sessionObserver,
		sessionActivitySummaries,
		channelAdmissionAudit: runtime.channelAdmissionAudit,
		mentionInbox: runtime.mentionInbox,
		applyPluginLifecycleChange: runtime.kernel.applyPluginLifecycleChange,
		getMcpAppSandboxPort: runtime.transportBridge.getMcpAppSandboxPort,
		ensureSandboxHostPort: runtime.transportBridge.ensureSandboxHostPort,
		get portalService() {
			return getPortalService?.();
		},
		resolveTerminalLaunchPolicy: runtime.terminalLaunchPolicy.resolve,
		isTerminalEnabled: runtime.terminalLaunchPolicy.isEnabled,
		execApprovalManager: runtime.execApprovalManager,
		questionManager: runtime.questionManager,
		scopeUpgradeCoordinator,
		cancelRunBoundApprovals: cancelRunBoundApprovals ? (runId) => cancelRunBoundApprovals(runId, context) : void 0,
		forwardPluginApprovalRequest: runtime.forwardPluginApprovalRequest,
		forwardExecApprovalRequest: runtime.forwardExecApprovalRequest,
		forwardSystemAgentApprovalRequest: runtime.forwardSystemAgentApprovalRequest,
		forwardSystemAgentApprovalResolved: runtime.forwardSystemAgentApprovalResolved,
		execApprovalIosPushDelivery: runtime.execApprovalIosPushDelivery,
		approvalWebPushDelivery: runtime.approvalWebPushDelivery,
		pluginApprovalIosPushDelivery: runtime.pluginApprovalIosPushDelivery,
		pluginApprovalManager: runtime.pluginApprovalManager,
		placementStandingGrants: runtime.placementStandingGrants,
		systemAgentApprovalManager: runtime.systemAgentApprovalManager,
		listSessionPendingApprovals: runtime.approvalSessionEvents.replay,
		loadGatewayModelCatalog: runtime.loadGatewayModelCatalog,
		loadGatewayModelCatalogSnapshot: runtime.loadGatewayModelCatalogSnapshot,
		...runtime.readPreparedGatewayModelCatalog ? { readPreparedGatewayModelCatalog: runtime.readPreparedGatewayModelCatalog } : {},
		...runtime.readPreparedGatewayModelCatalogBatch ? { readPreparedGatewayModelCatalogBatch: runtime.readPreparedGatewayModelCatalogBatch } : {},
		readChatMetadata: params.chatMetadataLifecycle.read,
		readPreparedModelsList: params.chatMetadataLifecycle.readModelsList,
		...params.chatMetadataLifecycle.readStartup ? { readChatStartupProjection: params.chatMetadataLifecycle.readStartup } : {},
		getHealthCache,
		refreshHealthSnapshot: runtime.refreshGatewayHealthSnapshotWithRuntime,
		logHealth: params.logHealth,
		logGateway: params.log,
		broadcast,
		publishPresence: runtime.publishPresence,
		getPresenceSnapshot: () => snapshotClientPresence(clients),
		broadcastToConnIds: runtime.broadcastToConnIds,
		nodeSendToSession: runtime.nodeSendToSession,
		nodeSendToAllSubscribed: runtime.nodeSendToAllSubscribed,
		nodeSubscribe: runtime.nodeSubscribe,
		nodeUnsubscribe: runtime.nodeUnsubscribe,
		nodeUnsubscribeAll: runtime.nodeUnsubscribeAll,
		hasConnectedTalkNode: runtime.hasTalkNodeConnected,
		isConnectionActive: runtime.isConnectionActive,
		recordClientActivity: (client) => {
			if (recordClientPresenceActivity(clients, client)) runtime.publishPresence();
		},
		hasExecApprovalClients: (excludeConnId) => {
			for (const gatewayClient of clients) {
				if (excludeConnId && gatewayClient.connId === excludeConnId) continue;
				if (canDeliverApprovals(gatewayClient, "exec")) return true;
			}
			return false;
		},
		getApprovalClientConnIds: (opts = {}) => {
			const connIds = /* @__PURE__ */ new Set();
			for (const gatewayClient of clients) {
				if (!gatewayClient.connId) continue;
				if (opts.excludeConnId && gatewayClient.connId === opts.excludeConnId) continue;
				if (!canDeliverApprovals(gatewayClient, opts.approvalKind ?? "exec")) continue;
				if (opts.filter && !opts.filter(gatewayClient, opts.record)) continue;
				connIds.add(gatewayClient.connId);
			}
			return connIds;
		},
		getClientConnIds: (filter) => {
			const connIds = /* @__PURE__ */ new Set();
			for (const gatewayClient of clients) {
				if (!gatewayClient.connId || gatewayClient.invalidated) continue;
				if (filter && !filter(gatewayClient)) continue;
				connIds.add(gatewayClient.connId);
			}
			return connIds;
		},
		hasConnectedClientsForDevice: (deviceId) => {
			for (const gatewayClient of clients) if (gatewayClient.connect.device?.id === deviceId && !gatewayClient.invalidated) return true;
			return false;
		},
		refreshConnectedUserProfile: (profile) => {
			let presenceChanged = false;
			for (const gatewayClient of clients) prepareGatewayRecipientProfile(gatewayClient);
			for (const gatewayClient of clients) {
				if (gatewayClient.invalidated || gatewayClient.socket.readyState !== 1) continue;
				const authenticatedUserProfile = gatewayClient.authenticatedUserProfile;
				if (!authenticatedUserProfile) continue;
				const canonicalProfileId = gatewayClient.preparedRecipientProfileId;
				try {
					const currentProfile = profile ? authenticatedUserProfile.profileId === profile.id || canonicalProfileId === profile.id ? profile : void 0 : canonicalProfileId ? getUserProfileDisplay(canonicalProfileId) : void 0;
					if (!currentProfile || profile === void 0 && authenticatedUserProfile.profileId === currentProfile.id && authenticatedUserProfile.displayName === currentProfile.displayName && authenticatedUserProfile.avatarRevision === currentProfile.avatarRevision && authenticatedUserProfile.hasAvatar === currentProfile.hasAvatar) continue;
					Object.assign(authenticatedUserProfile, {
						profileId: currentProfile.id,
						displayName: currentProfile.displayName,
						avatarRevision: currentProfile.avatarRevision,
						hasAvatar: currentProfile.hasAvatar,
						updatedAt: profile?.updatedAt ?? authenticatedUserProfile.updatedAt
					});
					presenceChanged = refreshClientPresence(clients, gatewayClient) || presenceChanged;
				} catch {
					gatewayClient.preparedRecipientProfileId = void 0;
				}
			}
			if (presenceChanged) runtime.publishPresence();
		},
		invalidateClientsForDevice: (deviceId, opts) => {
			const reason = opts?.reason ?? "device-invalidated";
			invalidateGatewayDeviceRevocation(context, deviceId, opts?.role);
			for (const gatewayClient of clients) {
				if (gatewayClient.connect.device?.id !== deviceId) continue;
				if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
				if (gatewayClient.connId) nodeRegistry.invalidateConnectionForPairingChange(gatewayClient.connId, reason);
				gatewayClient.invalidated = true;
				gatewayClient.invalidatedReason = reason;
			}
			invalidateDeviceTransports?.(deviceId, opts);
		},
		disconnectClientsForDevice: (deviceId, opts) => {
			invalidateGatewayDeviceRevocation(context, deviceId, opts?.role);
			for (const gatewayClient of clients) {
				if (gatewayClient.connect.device?.id !== deviceId) continue;
				if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
				invalidateGatewayPolicyClient(gatewayClient, {
					reason: "device-removed",
					code: 4001,
					message: "device removed"
				});
			}
			disconnectDeviceTransports?.(deviceId, opts);
		},
		disconnectClientsForUserProfile: (profileId) => {
			for (const gatewayClient of clients.authorityClients) {
				if (gatewayClient.authenticatedUserProfile?.profileId !== profileId) continue;
				invalidateGatewayPolicyClient(gatewayClient, {
					reason: "operator-role-changed",
					code: 4001,
					message: "operator role changed"
				});
			}
		},
		disconnectClientsUsingSharedGatewayAuth: () => {
			disconnectStaleSharedGatewayAuthClients({
				clients,
				expectedGeneration: null,
				state: sharedGatewaySessionGenerationState
			});
		},
		enforceSharedGatewayAuthGenerationForConfigWrite: (nextConfig, previousConfig) => {
			enforceSharedGatewaySessionGenerationForConfigWrite({
				state: sharedGatewaySessionGenerationState,
				nextConfig,
				resolveRuntimeSnapshotGeneration: resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
				clients,
				transition: {
					previous: previousConfig,
					next: getRuntimeConfig()
				}
			});
			publishOperatorRoleConfigChange(context);
		},
		nodeRegistry,
		...runtime.nodeDesktopService ? { [NODE_DESKTOP_SERVICE_CONTEXT]: runtime.nodeDesktopService } : {},
		...runtime.workerEnvironmentService ? { workerEnvironmentService: runtime.workerEnvironmentService } : {},
		...runtime.hostDesktopService ? { hostDesktopService: runtime.hostDesktopService } : {},
		...runtime.gatewayComputerService ? { gatewayComputerService: runtime.gatewayComputerService } : {},
		...workerSessionPlacementService ? { workerSessionPlacementService } : {},
		...workerPlacementDiskSpaceReader ? { workerPlacementDiskSpaceReader } : {},
		...workerPlacementRunnerAvailabilityReader ? { workerPlacementRunnerAvailabilityReader } : {},
		...workerPlacementRuntimeInstallReader ? { workerPlacementRuntimeInstallReader } : {},
		...workerRepositoryWorkspaceMutationService ? { workerRepositoryWorkspaceMutationService } : {},
		validateAgentRuntimeApprovalAuthority: runtime.validateAgentRuntimeApprovalAuthority,
		...runtime.workerPlacementControlAvailable ? { workerPlacementDispatchService: runtime.workerPlacementControlAvailable } : {},
		...runtime.githubPublicationService ? { githubPublicationService: runtime.githubPublicationService } : {},
		terminalSessions: runtime.terminalSessions,
		agentRunSeq: runtime.agentRunSeq,
		chatAbortControllers: runtime.chatAbortControllers,
		chatQueuedTurns: runtime.chatQueuedTurns,
		chatRunState: runtime.chatRunState,
		addChatRun: runtime.addChatRun,
		removeChatRun: runtime.removeChatRun,
		subscribeSessionEvents: sessionEventSubscribers.subscribe,
		unsubscribeSessionEvents: sessionEventSubscribers.unsubscribe,
		forgetConnectionAncestors: runtime.forgetConnectionAncestors,
		subscribeSessionMessageEvents: runtime.subscribeSessionMessageEvents,
		unsubscribeSessionMessageEvents: runtime.unsubscribeSessionMessageEvents,
		unsubscribeAllSessionEvents: (connId) => {
			sessionEventSubscribers.unsubscribe(connId);
			sessionMessageSubscribers.unsubscribeAll(connId);
			runtime.toolEventRecipients.removeConnection(connId);
			sessionObserver.removeConnection(connId);
			runtimeState.controlUiSessionPullRequests?.unsubscribe(connId);
			runtimeState.sessionViewerPresence?.unsubscribe(connId);
		},
		getSessionEventSubscriberConnIds: sessionEventSubscribers.getAll,
		registerToolEventRecipient: runtime.toolEventRecipients.add,
		dedupe: runtime.dedupe,
		wizardSessions: runtime.wizardSessions,
		systemAgentSessions: runtime.systemAgentSessions,
		findRunningWizard: runtime.findRunningWizard,
		purgeWizardSession: runtime.purgeWizardSession,
		getRuntimeSnapshot: runtime.getRuntimeSnapshot,
		getEventLoopHealth: runtime.readinessEventLoopHealth.snapshot,
		getConfigReloaderHotReloadStatus: runtime.kernel.getConfigReloaderHotReloadStatus,
		startChannel: runtime.startChannel,
		stopChannel: runtime.stopChannel,
		markChannelLoggedOut: runtime.markChannelLoggedOut,
		wizardRunner: runtime.wizardRunner,
		channelWizardRunner: runtime.channelWizardRunner,
		broadcastVoiceWakeChanged: runtime.broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged: runtime.broadcastVoiceWakeRoutingChanged,
		unavailableGatewayMethods: runtime.unavailableGatewayMethods
	};
	return bindSessionRowProjection(context, runtime.getSessionRowProjection);
}
//#endregion
export { createGatewayRequestContext };
