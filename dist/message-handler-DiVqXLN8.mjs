import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { u as normalizeSortedUniqueTrimmedStringList, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as getActivePluginGatewayNodePolicyRegistry } from "./runtime-state-C5tDvNBc.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { C as createChildDiagnosticTraceContext, M as parseDiagnosticTraceparent, N as runWithDiagnosticTraceContext, c as emitTrustedSecurityEvent, w as createDiagnosticTraceContext } from "./diagnostic-events-CVabF32H.mjs";
import { l as resolveRuntimeServiceVersion, s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as PAIRING_SCOPE, t as ADMIN_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { a as isLoopbackAddress, c as isPrivateOrLoopbackAddress, d as isTrustedProxyAddress, i as isLocalishHost } from "./net-DU4aWKLv.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, o as AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING } from "./auth-rate-limit-DuWYneOU.mjs";
import { n as PROXY_ATTRIBUTION_REQUIRED_REASON } from "./ingress-attribution-C5e071om.mjs";
import { n as isGatewayHostBrowserOrigin, r as normalizeChromeExtensionOrigin } from "./origin-check-Dh0t_-zy.mjs";
import { n as withSerializedRateLimitAttempt, t as withSerializedCredentialFallbackAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { i as isGatewayCliClient, l as isWebchatClient, n as isBrowserOperatorUiClient, r as isEphemeralGatewayClient, s as isOperatorUiClient, t as isBrowserCopilotClient } from "./message-channel-DDcHHhpX.mjs";
import { h as resolveDeviceAuthConnectErrorDetailCode, i as buildPairingConnectErrorMessage, m as resolveAuthConnectErrorDetailCode, n as buildPairingConnectCloseReason, r as buildPairingConnectErrorDetails, t as ConnectErrorDetailCodes } from "./connect-error-details-HKRZ1hRc.mjs";
import { n as deriveDeviceIdFromPublicKey, o as normalizeDevicePublicKeyBase64Url } from "./device-identity-B_zMrBd6.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./version-CwNT1gaY.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { i as gatewayStartupUnavailableDetails, n as GATEWAY_STARTUP_CLOSE_REASON, r as GATEWAY_STARTUP_PENDING_CLOSE_CAUSE, t as GATEWAY_STARTUP_CLOSE_CODE } from "./startup-unavailable-D0-EeFjq.mjs";
import { r as normalizeDeviceMetadataForAuth } from "./device-auth-na9vtJo1.mjs";
import { Bg as GATEWAY_SERVER_CAPS, Or as validateRequestFrame, _h as formatValidationErrors, bd as GATEWAY_RESTART_UNAVAILABLE_REASON, ot as validateConnectParams, xd as GATEWAY_SUSPEND_UNAVAILABLE_REASON } from "./src-BRUl7oDv.mjs";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.mjs";
import { t as resolveGatewayClientPlatformIdentity } from "./gateway-client-platform-h2QbDjYZ.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { O as tryBeginGatewayRestartStartupRootWorkAdmission, S as runWithGatewayIndependentRootWorkAdmission, c as getGatewaySuspendAdmissionPhase, k as tryBeginGatewayRootWorkAdmission, u as isGatewayRestartDraining, y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { p as hasMultipleSessionSharingIdentities } from "./user-profile-list-B5pNqyXa.mjs";
import { f as adoptTailscaleProfileAvatar, g as classifyTailscaleLogin } from "./user-profiles-CRttx6hj.mjs";
import { i as prepareUserProfileRoleAuthority } from "./user-channel-identity-operations-BY1hMzdF.mjs";
import { a as onOperatorRolePolicyChanged, f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Bt6aG_wj.mjs";
import { a as hasGatewayOperatorAccessPolicies, i as hasCurrentGatewayOperatorAccess, n as GatewayOperatorAccessDeniedError, o as resolveGatewayOperatorAccessAuthority, t as GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE } from "./operator-access-policy-D8OrWXWF.mjs";
import { t as resolveIdentityOperatorScopes } from "./operator-identity-scopes-IJD0CgVb.mjs";
import { a as MAX_PAYLOAD_BYTES, i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES, s as TICK_INTERVAL_MS } from "./server-constants-Dx_kHnY5.mjs";
import { a as verifyAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-C6L1CTtM.mjs";
import { n as isOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-QQd0oTAi.mjs";
import { t as BoundedSerialQueue } from "./bounded-serial-queue-3JaVUeMO.mjs";
import { n as resolveControlUiLinkLocation } from "./control-ui-link-base-CQdQgsxo.mjs";
import { i as upsertPresence } from "./system-presence-BhyW53Ym.mjs";
import { n as captureGatewayDeviceRevocation } from "./device-revocation-BMta3qGW.mjs";
import { n as resolveGatewayAuthPolicyGeneration, t as isGatewayAuthPolicyCurrent } from "./auth-policy-C2a9TtAr.mjs";
import { a as registerGatewayPolicyResponse, i as onGatewayPolicyClientInvalidated, r as invalidateGatewayPolicyClient, t as hasCurrentGatewayPolicyClientSource } from "./ws-policy-close-fX60H7oF.mjs";
import { t as SharedGatewaySessionGenerationState } from "./server-shared-auth-generation-aNODWb-9.mjs";
import { r as bindWebSocketRequestMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { i as TALK_PTT_COMMANDS, n as IOS_WATCH_RELAY_COMMANDS, r as PLATFORM_DEFAULTS, t as DEFAULT_DANGEROUS_NODE_COMMANDS } from "./node-command-policy-CnGfXM76.mjs";
import { n as resolveGatewayAgentSelectionState } from "./agent-list-BEVnf1d5.mjs";
import { a as listControlUiPluginWidgetKinds, i as listControlUiPluginTabs, t as listControlUiLinkReaders } from "./control-ui-plugin-tabs-DjZIdZqM.mjs";
import { A as allowedSessionVisibilities, Z as authenticatedProfileUnavailableError } from "./session-sharing-C_5FkkwM.mjs";
import { n as createExpectedProfileBinding, r as prepareGatewayRecipientProfile } from "./expected-profile-D7DCE30e.mjs";
import { n as loadVoiceWakeConfig } from "./server-utils-BHpxAA43.mjs";
import { c as deviceBootstrapProfilesEqual, d as isVoiceNodePairingSetupBootstrapProfile, h as resolveBootstrapProfileScopesForRoles, l as isMobilePairingSetupBootstrapProfile, m as resolveBootstrapProfileScopesForRole, n as CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE, r as CONTROL_UI_OWNER_BOOTSTRAP_PROFILE, t as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, u as isNodePairingSetupBootstrapProfile } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { i as listEffectivePairedDeviceRoles, n as hasEffectivePairedDeviceRole, r as listApprovedPairedDeviceRoles } from "./device-pairing-identity-BnU9nqx2.mjs";
import { d as updatePairedDeviceMetadata, i as listDevicePairing, o as pruneSupersededSilentPairedDevices, t as getPairedDevice, u as requestDevicePairing } from "./device-pairing-DbLfxuuq.mjs";
import { i as recordRemoteNodeInfo, o as refreshRemoteNodeBins } from "./remote-3_oGYmdR.mjs";
import { n as normalizeNodeApprovalSurfaceList } from "./node-pairing-surface-B68Et9XU.mjs";
import { f as requestNodePairing, n as beginNodePairingConnect, o as recordPairedNodeConnection, r as finalizeNodePairingCleanupClaim, t as approveNodePairing, u as releaseNodePairingCleanupClaim } from "./device-pairing-node-DvH1kI0G.mjs";
import { t as rawDataByteLength } from "./ws-BdD3UP1C.mjs";
import { r as classifyGatewayStaleInstall } from "./stale-install-BTpQ40eq.mjs";
import { n as logRejectedLargePayload } from "./diagnostic-payload-CxhAhghE.mjs";
import { t as resolveEffectiveComputerUseDescriptor } from "./node-computer-use-descriptor-D_tS4bop.mjs";
import { r as serializeEventPayload } from "./node-registry-zajLqj5_.mjs";
import { h as setClientPluginNodeCapability, o as indexPluginNodeCapabilitySurfaces, p as resolvePluginNodeCapabilityExpiresAtMs, r as buildPluginNodeCapabilityScopedHostUrl, s as mintPluginNodeCapabilityToken } from "./plugin-node-capability-BUbmEXwy.mjs";
import { n as approveDevicePairing, t as approveBootstrapDevicePairing } from "./device-pairing-approval-6orhFPdN.mjs";
import { a as getBoundDeviceBootstrapContext, d as redeemDeviceBootstrapTokenProfile, f as restoreGenericDeviceBootstrapToken, m as verifyDeviceBootstrapToken, o as getBoundDeviceBootstrapProfile } from "./device-bootstrap-BtrqJlcg.mjs";
import { t as getTailscalePublishedOrigin } from "./tailscale-published-origin-BvNdSLZR.mjs";
import { a as resolveBrowserAuthOrigin } from "./provider-browser-auth-pWTijt25.mjs";
import { i as verifyDeviceToken, t as ensureDeviceToken } from "./device-pairing-tokens-ET3TWOUZ.mjs";
import { n as shouldUseGatewayOwnerProfile, r as resolveHostAccountName, t as createAuthenticatedGitHubIdentitySync } from "./github-user-identity-RsLyC9VX.mjs";
import { n as ensureCanonicalUserProfileForEmail, r as ensureCanonicalUserProfileForTailscaleIdentity, t as ensureCanonicalGatewayOwnerProfile } from "./user-profile-writes-ColUfz03.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
import { n as logWs, t as formatForLog } from "./ws-log-DGu5Y--9.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-DTv5-s0n.mjs";
import { r as resolveChatAttachmentPolicy } from "./chat-attachment-policy-3-T7Wh4j.mjs";
import { t as loadVoiceWakeRoutingConfig } from "./voicewake-routing-Dh15APAj.mjs";
import { r as prepareGatewayLocalUserIngress, t as attachGatewayLocalUserIngress } from "./local-user-ingress-B0Jbf3Pk.mjs";
import { n as parseGatewayRole, r as roleCanSkipDeviceIdentity } from "./role-policy-qz1zEEvg.mjs";
import { a as canReadDetailedUpdateMetadata } from "./events-J-3spXBQ.mjs";
import { n as getHealthCache, r as getHealthVersion, t as buildGatewaySnapshot } from "./health-state-BFGMqqXu.mjs";
import { t as shouldScheduleBackgroundHealthRefresh } from "./health-refresh-admission-CbSP_L_Q.mjs";
import { n as clearRemovedNodeRuntimeState, s as reconcileRevokedDeviceWorker } from "./node-runtime-state-DG7DCGJV.mjs";
import { t as captureAuthenticatedNodePairingState } from "./device-pairing-node-state-BxpHZHxS.mjs";
import { t as resolveLocalNodeId } from "./local-id-CZRXV_8o.mjs";
import { t as broadcastPresenceSnapshot } from "./presence-events-gFR-cYCD.mjs";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-BJ-hRa6a.mjs";
import { a as scheduleNodeConnectionNotification, o as retireDeviceTokenClients, r as resolveGatewayWsBrowserOrigin, t as checkGatewayWsBrowserOrigin } from "./ws-origin-policy-CbiiBniI.mjs";
import { t as truncateCloseReason } from "./close-reason-B67wSC7I.mjs";
import { a as buildHandshakeAuthLogKey, i as HandshakeAuthLogLimiter, n as createGatewayRpcDiagnostics, o as shouldLimitMissingCredentialAuthLog } from "./request-diagnostics-B9azH0yR.mjs";
import { a as consumeSetupHandoff, c as isNativeAppUiClient, d as resolvePairingLocality, f as resolveUnauthorizedHandshakeContext, h as shouldSkipLocalBackendSelfPairing, i as confirmSetupHandoffDelivery, l as resolveDeviceSignaturePayloadVersion, m as shouldPreserveLocalCliSharedAuthScopes, n as broadcastSetupHandoffCompletion, o as resolveConnectAuthDecision, p as shouldAllowSilentLocalPairing, r as broadcastSetupHandoffDeliveryUncertain, s as resolveConnectAuthState, t as reconcileNodePairingOnConnect, u as resolveHandshakeBrowserSecurityContext } from "./node-connect-reconcile-CsfPzhmA.mjs";
import { isDeepStrictEqual } from "node:util";
import net from "node:net";
import os from "node:os";
import { setImmediate } from "node:timers/promises";
import { performance } from "node:perf_hooks";
//#region src/gateway/node-pairing-auto-approve.ts
/** Remote auto-approval may grant only the fresh, capability-free node request it proved. */
function isScopelessNodePairingRequest(request) {
	return request.isRepair !== true && (request.scopes ?? []).length === 0 && (request.role === void 0 || request.role === "node") && (request.roles ?? []).every((role) => role === "node");
}
/** Classifies how the gateway learned the client IP for node auto-approval. */
function resolveNodePairingClientIpSource(params) {
	if (!params.reportedClientIp) return "none";
	if (!params.hasProxyHeaders || !params.remoteIsTrustedProxy) return "direct";
	return params.remoteIsLoopback ? "loopback-trusted-proxy" : "trusted-proxy";
}
/**
* Shared floor for every non-interactive node pairing approval (trusted-CIDR,
* SSH-verified): only a fresh, scopeless, non-browser `role: node` request
* with a directly attributable client IP qualifies. Upgrades and spoofable
* loopback trusted-proxy header paths always stay on the manual prompt.
*/
function isEligibleFreshNodePairingRequest(params) {
	if (params.existingPairedDevice) return false;
	if (params.role !== "node") return false;
	if (params.reason !== "not-paired") return false;
	if (params.scopes.length > 0) return false;
	if (params.hasBrowserOriginHeader || params.isControlUi || params.isWebchat) return false;
	if (params.reportedClientIpSource === "none" || params.reportedClientIpSource === "loopback-trusted-proxy") return false;
	return Boolean(params.reportedClientIp);
}
/** Returns true when a node pairing request can be auto-approved by trusted CIDR policy. */
function shouldAutoApproveNodePairingFromTrustedCidrs(params) {
	if (!isEligibleFreshNodePairingRequest(params) || !params.reportedClientIp) return false;
	const autoApproveCidrs = params.autoApproveCidrs?.map((entry) => entry.trim()).filter((entry) => entry.length > 0);
	if (!autoApproveCidrs || autoApproveCidrs.length === 0) return false;
	return isTrustedProxyAddress(params.reportedClientIp, autoApproveCidrs);
}
//#endregion
//#region src/gateway/server/ws-connection/request-start.ts
const requestStarts = new BoundedSerialQueue({
	maxPendingCount: 256,
	maxPendingWeight: 52428800
});
const MAX_STARTS_PER_TURN = 64;
const START_WORK_BUDGET_MS = 12;
let turnStartedAt = 0;
let turnStarts = 0;
/** Grants operator router-start permission, or null when its waiting budget is exhausted. */
function scheduleGatewayRequestStart(frameBytes) {
	return runOutsideGatewayRootWorkAdmission(() => {
		const wasIdle = requestStarts.isIdle;
		const admission = requestStarts.enqueue(async () => {
			await new Promise(queueMicrotask);
			if (wasIdle || turnStarts >= MAX_STARTS_PER_TURN || performance.now() - turnStartedAt >= START_WORK_BUDGET_MS) {
				await setImmediate();
				turnStartedAt = performance.now();
				turnStarts = 0;
			}
			turnStarts++;
		}, {
			weight: frameBytes,
			sealOnOverflow: false
		});
		return admission.accepted ? admission.completion : null;
	});
}
//#endregion
//#region src/gateway/server/ws-connection/unauthorized-flood-guard.ts
const DEFAULT_CLOSE_AFTER = 10;
const DEFAULT_LOG_EVERY = 100;
/** Counts unauthorized failures and decides when to log or close the socket. */
var UnauthorizedFloodGuard = class {
	constructor(options) {
		this.count = 0;
		this.suppressedSinceLastLog = 0;
		this.closeAfter = resolveIntegerOption(options?.closeAfter, DEFAULT_CLOSE_AFTER, { min: 1 });
		this.logEvery = resolveIntegerOption(options?.logEvery, DEFAULT_LOG_EVERY, { min: 1 });
	}
	registerUnauthorized() {
		this.count += 1;
		const shouldClose = this.count > this.closeAfter;
		if (!(this.count === 1 || this.count % this.logEvery === 0 || shouldClose)) {
			this.suppressedSinceLastLog += 1;
			return {
				shouldClose,
				shouldLog: false,
				count: this.count,
				suppressedSinceLastLog: 0
			};
		}
		const suppressedSinceLastLog = this.suppressedSinceLastLog;
		this.suppressedSinceLastLog = 0;
		return {
			shouldClose,
			shouldLog: true,
			count: this.count,
			suppressedSinceLastLog
		};
	}
	reset() {
		this.count = 0;
		this.suppressedSinceLastLog = 0;
	}
};
/** Identifies role-auth failures that should feed the flood guard. */
function isUnauthorizedRoleError(error) {
	if (!error) return false;
	return error.code === ErrorCodes.INVALID_REQUEST && typeof error.message === "string" && error.message.startsWith("unauthorized role:");
}
//#endregion
//#region src/gateway/server/ws-connection/authenticated-request-dispatch.ts
const loadGatewayServerMethods = createLazyPromise(() => import("./authenticated-request-dispatch.server-methods.runtime.js"));
const DEVICE_CREDENTIAL_INVALIDATING_METHODS = /* @__PURE__ */ new Set([
	"device.pair.remove",
	"device.token.rotate",
	"device.token.revoke",
	"node.pair.remove"
]);
function createGatewayAuthenticatedRequestDispatcher(params) {
	const { connId, clients, getRequiredSharedGatewaySessionGeneration, extraHandlers, getMethodRegistry, buildRequestContext, send, close, isClosed, setCloseCause, logGateway } = params.handler;
	const unauthorizedFloodGuard = new UnauthorizedFloodGuard();
	let deviceCredentialMutationBarrier;
	const closeInvalidatedClient = (client, method) => {
		const policyChanged = !isGatewayAuthPolicyCurrent(client.authPolicyGeneration);
		if (!client.invalidated && !policyChanged) return false;
		const reason = client.invalidatedReason ?? (policyChanged ? "gateway-policy-changed" : "invalidated");
		setCloseCause("client-invalidated", {
			reason,
			method
		});
		invalidateGatewayPolicyClient(client, {
			reason,
			code: 4001,
			message: `client invalidated: ${reason}`,
			close: () => close(4001, `client invalidated: ${reason}`),
			revokeSource: false
		});
		return true;
	};
	const dispatch = async (parsed, client, frameBytes, admission, sendResponse = send) => {
		if (!validateRequestFrame(parsed)) {
			send({
				type: "res",
				id: parsed?.id ?? "invalid",
				ok: false,
				error: errorShape(ErrorCodes.INVALID_REQUEST, `invalid request frame: ${formatValidationErrors(validateRequestFrame.errors)}`)
			});
			return;
		}
		const req = parsed;
		if (closeInvalidatedClient(client, req.method)) return;
		const diagnostics = createGatewayRpcDiagnostics(req.method, getMethodRegistry, extraHandlers);
		logWs("in", "req", {
			connId,
			id: req.id,
			method: req.method
		});
		const context = buildRequestContext();
		const generationState = SharedGatewaySessionGenerationState.fromReader(getRequiredSharedGatewaySessionGeneration);
		const sourceContext = context.resolveGatewayContext?.() ?? context;
		const isCommittedPolicyCurrent = () => client.authPolicyGeneration === void 0 || isGatewayAuthPolicyCurrent(client.authPolicyGeneration, sourceContext.getCommittedRuntimeConfig?.() ?? sourceContext.getRuntimeConfig());
		const clientAuthority = captureGatewayDeviceRevocation(context, {
			deviceId: client.connect.device?.id,
			role: client.connect.role
		}, () => {
			if (!hasCurrentGatewayOperatorAccess(client.internal?.operatorAccessAuthority)) invalidateGatewayPolicyClient(client, {
				reason: "operator-access-closed",
				code: 4001,
				message: GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE,
				close: () => close(4001, GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE)
			});
			if (closeInvalidatedClient(client, req.method)) return false;
			const requiredGeneration = client.usesSharedGatewayAuth ? getRequiredSharedGatewaySessionGeneration?.() : void 0;
			if (requiredGeneration !== void 0 && client.sharedGatewaySessionGeneration !== requiredGeneration) {
				setCloseCause("gateway-auth-rotated", {
					authGenerationStale: true,
					method: req.method
				});
				invalidateGatewayPolicyClient(client, {
					reason: "gateway-auth-changed",
					code: 4001,
					message: "gateway auth changed",
					close: () => close(4001, "gateway auth changed"),
					revokeSource: false
				});
				return false;
			}
			return true;
		}, client.connectionSignal, client.connect.role === "operator" && (!client.usesSharedGatewayAuth || generationState) ? {
			isCurrent: () => hasCurrentGatewayPolicyClientSource(client) && isCommittedPolicyCurrent(),
			subscribe: (onRevoked) => {
				const releaseClient = onGatewayPolicyClientInvalidated(client, onRevoked);
				const releasePolicy = onOperatorRolePolicyChanged((change) => {
					if (change.kind === "config" && change.context === sourceContext && !isCommittedPolicyCurrent()) onRevoked();
				});
				const releaseGeneration = client.usesSharedGatewayAuth ? generationState?.onInvalidated(client.sharedGatewaySessionGeneration, onRevoked) : void 0;
				return () => {
					releaseClient();
					releasePolicy();
					releaseGeneration?.();
				};
			}
		} : void 0);
		const hasCurrentClientAuthority = clientAuthority.isCurrent;
		const releaseAuthority = clients.retainRequest(client);
		const credentialMutationBarrier = deviceCredentialMutationBarrier;
		const mutationCompletion = DEVICE_CREDENTIAL_INVALIDATING_METHODS.has(req.method) ? createDeferredCore() : void 0;
		if (mutationCompletion) {
			const barrier = Promise.allSettled([credentialMutationBarrier, mutationCompletion.promise]).then(() => {
				if (deviceCredentialMutationBarrier === barrier) deviceCredentialMutationBarrier = void 0;
			});
			deviceCredentialMutationBarrier = barrier;
		}
		try {
			const expectedProfileBinding = req.expectedProfileId === void 0 ? void 0 : await createExpectedProfileBinding(req.expectedProfileId, client, () => {
				if (!hasCurrentClientAuthority()) throw new Error("Gateway requester authority changed");
			});
			const publishResponse = (ok, payload, error, meta) => {
				if (!policyResponse?.pending && !hasCurrentClientAuthority()) {
					diagnostics?.response("suppressed");
					return;
				}
				try {
					let responseOk = ok;
					let responseError = error;
					let sendResult = sendResponse({
						type: "res",
						id: req.id,
						ok,
						payload,
						error
					});
					if (sendResult.kind === "serialization") {
						const detail = formatForLog(sendResult.error);
						logGateway.error(`response serialization failed method=${req.method}: ${detail}`);
						responseOk = false;
						responseError = errorShape(ErrorCodes.UNAVAILABLE, "response serialization failed");
						sendResult = sendResponse({
							type: "res",
							id: req.id,
							ok: responseOk,
							error: responseError
						});
					}
					diagnostics?.response(sendResult.kind === "sent" ? responseOk ? "ok" : "error" : "unavailable");
					const unauthorizedRoleError = isUnauthorizedRoleError(responseError);
					let logMeta = meta;
					if (unauthorizedRoleError) {
						const unauthorizedDecision = unauthorizedFloodGuard.registerUnauthorized();
						if (unauthorizedDecision.suppressedSinceLastLog > 0) logMeta = {
							...logMeta,
							suppressedUnauthorizedResponses: unauthorizedDecision.suppressedSinceLastLog
						};
						if (!unauthorizedDecision.shouldLog) return;
						if (unauthorizedDecision.shouldClose) {
							setCloseCause("repeated-unauthorized-requests", {
								unauthorizedCount: unauthorizedDecision.count,
								method: req.method
							});
							queueMicrotask(() => close(1008, "repeated unauthorized calls"));
						}
						logMeta = {
							...logMeta,
							unauthorizedCount: unauthorizedDecision.count
						};
					} else unauthorizedFloodGuard.reset();
					logWs("out", "res", {
						connId,
						id: req.id,
						ok: responseOk,
						method: req.method,
						errorCode: responseError?.code,
						errorMessage: responseError?.message,
						...logMeta
					});
				} finally {
					policyResponse?.finish();
				}
			};
			const respond = expectedProfileBinding?.guardResponse(publishResponse) ?? publishResponse;
			const agentRuntimeIdentity = client.internal?.agentRuntimeIdentity;
			const hasCurrentRuntimeAuthority = () => {
				if (agentRuntimeIdentity && context.validateAgentRuntimeApprovalAuthority?.(agentRuntimeIdentity) !== true) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime authority is no longer active"));
					setCloseCause("agent-runtime-authority-closed", { method: req.method });
					close(4001, "agent runtime authority closed");
					return false;
				}
				return true;
			};
			const respondWithAuthority = (ok, payload, error, meta) => {
				if (hasCurrentRuntimeAuthority()) respond(ok, payload, error, meta);
			};
			const policyResponse = registerGatewayPolicyResponse(req.method, client, respondWithAuthority);
			const executeRequest = async () => {
				diagnostics?.bindTrace();
				let entry;
				const requestController = req.method === "sessions.companion.ask" || req.method === "node.invoke" && client.connect.client.id === GATEWAY_CLIENT_IDS.CLI && client.connect.client.mode === GATEWAY_CLIENT_MODES.CLI ? new AbortController() : void 0;
				const accessSignal = client.internal?.operatorAccessAuthority?.signal;
				const signal = requestController ? accessSignal ? AbortSignal.any([requestController.signal, accessSignal]) : requestController.signal : accessSignal;
				const cancelRequest = () => requestController?.abort();
				if (requestController) client.socket.once("close", cancelRequest);
				let dispatchOutcome = "returned";
				try {
					entry = context.requestEntryLifetime?.enter({
						req,
						client,
						context
					});
					if (credentialMutationBarrier) {
						await racePromiseWithAbortSignal(credentialMutationBarrier, context.requestEntryLifetime?.signal).catch(() => void 0);
						if (context.requestEntryLifetime?.signal.aborted) {
							respondWithAuthority(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "gateway closing before request dispatch", { retryable: true }));
							return;
						}
						if (isClosed()) return;
					}
					if (!hasCurrentClientAuthority() || !hasCurrentRuntimeAuthority()) return;
					const { handleGatewayRequest } = await loadGatewayServerMethods();
					entry?.assertOpen();
					if (client.connect.role === "operator") {
						diagnostics?.startQueue();
						const start = scheduleGatewayRequestStart(frameBytes);
						if (!start) {
							respondWithAuthority(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "The server is busy. Please try again in a moment.", { retryable: true }));
							return;
						}
						await start;
						diagnostics?.finishQueue();
					}
					entry?.assertOpen();
					if (signal?.aborted || !hasCurrentClientAuthority() || !hasCurrentRuntimeAuthority()) return;
					await runOutsideGatewayRootWorkAdmission(() => handleGatewayRequest(bindWebSocketRequestMutationAuthority({
						req,
						respond: respondWithAuthority,
						client,
						isWebchatConnect: params.isWebchatConnect,
						hasCurrentClientAuthority,
						expectedProfileBinding,
						extraHandlers,
						methodRegistry: getMethodRegistry?.(),
						context,
						...admission ? { admission } : {},
						requestEntry: entry,
						...signal ? { signal } : {}
					}, client, getRequiredSharedGatewaySessionGeneration), diagnostics));
				} catch (err) {
					dispatchOutcome = "threw";
					logGateway.error(`request handler failed: ${formatForLog(err)}`);
					const staleInstall = classifyGatewayStaleInstall(err);
					respondWithAuthority(false, void 0, staleInstall?.error ?? errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
				} finally {
					policyResponse?.finish();
					diagnostics?.finish(signal?.aborted ? "cancelled" : dispatchOutcome);
					entry?.release();
					if (requestController) client.socket.off("close", cancelRequest);
				}
			};
			const upstreamTrace = parseDiagnosticTraceparent(req.traceparent);
			const dispatchRequest = () => upstreamTrace ? runWithDiagnosticTraceContext(createChildDiagnosticTraceContext(upstreamTrace), executeRequest) : executeRequest();
			await (client.connect.role === "node" ? params.handler.nodeLifecycleDispatch.dispatch(req.method, dispatchRequest) : dispatchRequest());
		} finally {
			try {
				releaseAuthority();
			} finally {
				try {
					clientAuthority.release();
				} finally {
					mutationCompletion?.resolve();
				}
			}
		}
	};
	return { dispatch };
}
//#endregion
//#region src/gateway/server/ws-connection/connect-admission.ts
function hasCredential(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function isStartupNodeConnect(connectParams) {
	return connectParams.role === "node" && connectParams.client.mode === GATEWAY_CLIENT_MODES.NODE;
}
/** Exact first-connect shape emitted by `openclaw connect` for a setup-code node. */
function isStartupNodeBootstrapConnect(connectParams) {
	const auth = connectParams.auth;
	const device = connectParams.device;
	return isStartupNodeConnect(connectParams) && connectParams.client.id === GATEWAY_CLIENT_IDS.NODE_HOST && Array.isArray(connectParams.scopes) && connectParams.scopes.length === 0 && Boolean(device?.id.trim() && device.publicKey.trim()) && hasCredential(auth?.bootstrapToken) && !hasCredential(auth?.token) && !hasCredential(auth?.deviceToken) && !hasCredential(auth?.password) && !hasCredential(auth?.approvalRuntimeToken) && !hasCredential(auth?.agentRuntimeIdentityToken);
}
async function rejectGatewayStartupConnect(context) {
	const { close } = context.handler;
	const { frame, markHandshakeFailure, sendFrame } = context;
	markHandshakeFailure(GATEWAY_STARTUP_PENDING_CLOSE_CAUSE);
	await sendFrame({
		type: "res",
		id: frame.id,
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "gateway starting; retry shortly", {
			retryable: true,
			retryAfterMs: 500,
			details: gatewayStartupUnavailableDetails()
		})
	}).catch(() => {});
	queueMicrotask(() => close(GATEWAY_STARTUP_CLOSE_CODE, GATEWAY_STARTUP_CLOSE_REASON));
}
async function rejectUnavailableProfileConnect(context, error) {
	const failure = authenticatedProfileUnavailableError(error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429 ? "GitHub is rate limiting profile verification. Retry shortly; if this continues, ask a gateway administrator to check the GitHub API credential." : void 0, error instanceof gitHubPublicApi.ControlUiGitHubError ? error.retryAfterMs : void 0);
	context.markHandshakeFailure("authenticated-profile-unavailable");
	context.sendHandshakeErrorResponse(ErrorCodes.UNAVAILABLE, failure.message, failure);
	await context.releasePendingNodePairingCleanup();
	context.handler.close(1013, truncateCloseReason(failure.message));
}
function applyConnectionScopeCap(params) {
	const header = params.upgradeReq.headers["x-openclaw-scopes"];
	const rawHeader = Array.isArray(header) ? header[0] : header;
	if (rawHeader === void 0) return params.scopes;
	const declaredScopes = new Set(rawHeader.split(",").map((scope) => scope.trim()).filter((scope) => scope.length > 0));
	return declaredScopes.size === 0 ? [] : params.scopes.filter((scope) => declaredScopes.has(scope));
}
function resolveEffectiveConnectionScopes(params) {
	const verifiedIdentity = params.verifiedIdentity;
	let identityScopes = [];
	if (params.role === "operator" && verifiedIdentity) identityScopes = resolveIdentityOperatorScopes(verifiedIdentity, params.identityScopes);
	const scopes = applyConnectionScopeCap({
		scopes: [.../* @__PURE__ */ new Set([...params.deviceScopes, ...identityScopes])],
		upgradeReq: params.upgradeReq
	});
	return {
		scopes,
		addedIdentityScopes: identityScopes.filter((scope) => scopes.includes(scope) && !roleScopesAllow({
			role: "operator",
			requestedScopes: [scope],
			allowedScopes: params.deviceScopes
		}))
	};
}
function rejectGatewayConnectOrigin(context, reason) {
	const message = "origin not allowed (open the Control UI from the gateway host or allow it in gateway.controlUi.allowedOrigins)";
	context.markHandshakeFailure("origin-mismatch", {
		origin: context.handler.requestOrigin ?? "n/a",
		host: context.handler.requestHost ?? "n/a",
		reason
	});
	context.sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, message, { details: {
		code: ConnectErrorDetailCodes.CONTROL_UI_ORIGIN_NOT_ALLOWED,
		reason
	} });
	context.handler.close(1008, truncateCloseReason(message));
}
/** Recheck live authority after awaited work, before granting credentials or registering a client. */
function resolveGatewayConnectPolicyFailure(context, state) {
	if (!isGatewayAuthPolicyCurrent(resolveGatewayAuthPolicyGeneration(context.configSnapshot))) return { kind: "auth" };
	if (state.sessionUsesSharedGatewayAuth && context.handler.getRequiredSharedGatewaySessionGeneration && state.sessionSharedGatewaySessionGeneration !== context.handler.getRequiredSharedGatewaySessionGeneration()) return { kind: "auth" };
	if (context.browserOrigin) {
		const originCheck = checkGatewayWsBrowserOrigin(context.browserOrigin, getRuntimeConfig());
		if (!originCheck.ok) return {
			kind: "origin",
			reason: originCheck.reason
		};
	}
}
async function admitGatewayConnect(context) {
	const { connId, remoteAddr, remotePort, requestHost, requestOrigin, close, isStartupPending, logGateway, logWsControl, originCheckMetrics } = context.handler;
	const { connectParams, configSnapshot, peerLabel, browserOrigin, clientLabel, markHandshakeFailure, sendHandshakeErrorResponse, isWebchatConnect } = context;
	const isNodeClient = isStartupNodeConnect(connectParams);
	const startupPending = isStartupPending?.() === true;
	if (startupPending && !isNodeClient) {
		await rejectGatewayStartupConnect(context);
		return;
	}
	const { minProtocol, maxProtocol } = connectParams;
	const supportsCurrentProtocol = maxProtocol >= 4 && minProtocol <= 4;
	const supportsProbeRestartProtocol = connectParams.client.mode === GATEWAY_CLIENT_MODES.PROBE && maxProtocol >= 3 && minProtocol <= 4;
	const supportsPreviousNodeProtocol = isNodeClient && maxProtocol >= 3 && minProtocol <= 3;
	const usesLegacyNodeProtocol = !supportsCurrentProtocol && supportsPreviousNodeProtocol;
	if (!supportsCurrentProtocol && !supportsProbeRestartProtocol && !supportsPreviousNodeProtocol) {
		markHandshakeFailure("protocol-mismatch", {
			minProtocol,
			maxProtocol,
			expectedProtocol: 4,
			minimumProbeProtocol: 3
		});
		logWsControl.warn(`protocol mismatch conn=${connId} peer=${formatForLog(peerLabel)} remote=${remoteAddr ?? "?"} remotePort=${remotePort ?? "?"} client=${formatForLog(clientLabel)} ${connectParams.client.mode} v${formatForLog(connectParams.client.version)} min=${minProtocol} max=${maxProtocol} expected=4 probeMin=3 instance=${formatForLog(connectParams.client.instanceId ?? "n/a")}`);
		sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, "protocol mismatch", { details: {
			code: ConnectErrorDetailCodes.PROTOCOL_MISMATCH,
			clientMinProtocol: minProtocol,
			clientMaxProtocol: maxProtocol,
			expectedProtocol: 4,
			minimumProbeProtocol: 3
		} });
		close(1002, "protocol mismatch");
		return;
	}
	const roleRaw = connectParams.role ?? "operator";
	const role = parseGatewayRole(roleRaw);
	if (!role) {
		markHandshakeFailure("invalid-role", { role: roleRaw });
		sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, "invalid role");
		close(1008, "invalid role");
		return;
	}
	const scopes = Array.isArray(connectParams.scopes) ? connectParams.scopes : [];
	connectParams.role = role;
	connectParams.scopes = scopes;
	const isBrowserCopilot = isBrowserCopilotClient(connectParams.client);
	const browserCopilotOrigin = isBrowserCopilot ? normalizeChromeExtensionOrigin(requestOrigin ?? void 0) : void 0;
	if (isBrowserCopilot && (connectParams.client.mode !== GATEWAY_CLIENT_MODES.UI || !hasGatewayClientCap(connectParams.caps, GATEWAY_CLIENT_CAPS.RUN_TOOL_BINDINGS) || !hasGatewayClientCap(connectParams.caps, GATEWAY_CLIENT_CAPS.SESSION_SCOPED_EVENTS))) {
		const message = "browser copilot requires ui mode with run-tool-bindings and session-scoped-events capabilities";
		markHandshakeFailure("invalid-client", {
			client: connectParams.client.id,
			mode: connectParams.client.mode
		});
		sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, message);
		close(1008, truncateCloseReason(message));
		return;
	}
	if (isBrowserCopilot && !browserCopilotOrigin) {
		const message = "browser copilot requires a canonical Chrome extension origin";
		markHandshakeFailure("origin-mismatch", {
			origin: requestOrigin ?? "n/a",
			client: connectParams.client.id
		});
		sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, message, { details: {
			code: ConnectErrorDetailCodes.CONTROL_UI_ORIGIN_NOT_ALLOWED,
			reason: "invalid browser copilot origin"
		} });
		close(1008, truncateCloseReason(message));
		return;
	}
	const isControlUi = isOperatorUiClient(connectParams.client) && !isBrowserCopilot;
	const isBrowserOperatorUi = isBrowserOperatorUiClient(connectParams.client);
	const isWebchat = isWebchatConnect(connectParams);
	const isNativeAppUi = isNativeAppUiClient(connectParams.client);
	if (browserOrigin) {
		const originCheck = checkGatewayWsBrowserOrigin(browserOrigin, configSnapshot);
		if (!originCheck.ok) {
			rejectGatewayConnectOrigin(context, originCheck.reason);
			return;
		}
		if (originCheck.matchedBy === "host-header-fallback") {
			originCheckMetrics.hostHeaderFallbackAccepted += 1;
			logWsControl.warn(`security warning: websocket origin accepted via Host-header fallback conn=${connId} count=${originCheckMetrics.hostHeaderFallbackAccepted} host=${requestHost ?? "n/a"} origin=${requestOrigin ?? "n/a"}`);
			logGateway.warn("security metric: gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback accepted a websocket connect request");
		}
	}
	return {
		minProtocol,
		maxProtocol,
		usesLegacyNodeProtocol,
		role,
		scopes,
		isControlUi,
		isBrowserOperatorUi,
		isWebchat,
		isNativeAppUi,
		startupPending
	};
}
//#endregion
//#region src/gateway/server/ws-connection/auth-messages.ts
const SETUP_CODE_REJECTED_MESSAGE = "unauthorized: setup code invalid, expired, revoked, or already used (create a new code; review `openclaw devices list`)";
/** Formats a client-specific auth failure message without exposing secret values. */
function formatGatewayAuthFailureMessage(params) {
	const { authMode, authProvided, reason, client, isLocalClient } = params;
	const isCli = isGatewayCliClient(client);
	const isControlUi = isOperatorUiClient(client);
	const isWebchat = isWebchatClient(client);
	if (client?.mode === "node" && reason?.startsWith("trusted_proxy_missing_header_")) return "gateway rejected this node: trusted-proxy identity-header authentication is required and no usable machine credential was accepted; run `openclaw doctor` on the Gateway";
	const uiHint = "open the dashboard URL and paste the token in Control UI settings";
	const missingUiTokenHint = "paste in Control UI settings or openclaw doctor --generate-gateway-token; restart";
	const tokenHint = isCli ? isLocalClient ? "use this gateway's gateway.auth.token or pair the device" : "set gateway.remote.token to match gateway.auth.token" : isControlUi || isWebchat ? uiHint : "provide gateway auth token";
	const passwordHint = isCli ? isLocalClient ? "use this gateway's gateway.auth.password" : "set gateway.remote.password to match gateway.auth.password" : isControlUi || isWebchat ? "enter the password in Control UI settings" : "provide gateway auth password";
	switch (reason) {
		case "token_missing": return `unauthorized: gateway token missing (${isControlUi || isWebchat ? missingUiTokenHint : tokenHint})`;
		case "token_mismatch": return `unauthorized: gateway token mismatch (${tokenHint})`;
		case "token_missing_config": return "unauthorized: gateway token not configured on gateway (set gateway.auth.token)";
		case "token_redacted_config":
		case "password_redacted_config": return "gateway credential is a redaction sentinel (run openclaw doctor --fix on the Gateway, then restart and re-pair)";
		case "password_missing": return `unauthorized: gateway password missing (${passwordHint})`;
		case "password_mismatch": return `unauthorized: gateway password mismatch (${passwordHint})`;
		case "password_missing_config": return "unauthorized: gateway password not configured on gateway (set gateway.auth.password)";
		case "bootstrap_token_invalid": return SETUP_CODE_REJECTED_MESSAGE;
		case "tailscale_user_missing": return "unauthorized: tailscale identity missing (use Tailscale Serve auth or gateway token/password)";
		case "tailscale_proxy_missing": return "unauthorized: tailscale proxy headers missing (use Tailscale Serve or gateway token/password)";
		case "tailscale_whois_failed": return "unauthorized: tailscale identity check failed (use Tailscale Serve auth or gateway token/password)";
		case "tailscale_user_mismatch": return "unauthorized: tailscale identity mismatch (use Tailscale Serve auth or gateway token/password)";
		case "rate_limited": return "unauthorized: too many failed authentication attempts (retry later)";
		case PROXY_ATTRIBUTION_REQUIRED_REASON: return "unauthorized: proxy client attribution is required (configure gateway.trustedProxies narrowly and make the proxy overwrite or safely rebuild forwarded client headers)";
		case "device_token_mismatch": return "unauthorized: device token mismatch (rotate/reissue device token)";
		case "scope_mismatch": return "unauthorized: device token scope mismatch (re-pair or approve scope upgrade)";
	}
	if (authMode === "token" && authProvided === "none") return `unauthorized: gateway token missing (${tokenHint})`;
	if (authMode === "token" && authProvided === "device-token") return "unauthorized: device token rejected (pair/repair this device, or provide gateway token)";
	if (authProvided === "bootstrap-token") return SETUP_CODE_REJECTED_MESSAGE;
	if (authMode === "password" && authProvided === "none") return `unauthorized: gateway password missing (${passwordHint})`;
	return "unauthorized";
}
//#endregion
//#region src/gateway/server/ws-connection/connect-auth-security.ts
function hashGatewaySecurityId(value) {
	const normalized = value?.trim();
	if (!normalized) return;
	return `sha256:${sha256HexPrefixCore(normalized, 12)}`;
}
function emitGatewayAuthSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "auth",
		action: params.action,
		outcome: params.outcome,
		severity: params.severity,
		actor: {
			kind: params.role === "node" ? "node" : "operator",
			...params.deviceId ? { deviceIdHash: hashGatewaySecurityId(params.deviceId) } : {},
			role: params.role
		},
		target: {
			kind: "gateway",
			name: "websocket"
		},
		policy: {
			id: "gateway.websocket-auth",
			decision: params.outcome === "success" ? "allow" : "deny",
			...params.reason ? { reason: params.reason } : {}
		},
		control: {
			id: "gateway.ws.connect",
			family: "auth"
		},
		...params.reason ? { reason: params.reason } : {},
		attributes: {
			auth_mode: params.authMode,
			auth_method: params.authMethod ?? "unknown",
			auth_provided: params.authProvided ?? "unknown",
			client_mode: params.clientMode ?? "unknown",
			has_device_identity: Boolean(params.deviceId),
			scope_count: params.scopes.length,
			...params.rateLimited !== void 0 ? { rate_limited: params.rateLimited } : {}
		}
	});
}
//#endregion
//#region src/gateway/server/ws-connection/connect-device-metadata.ts
function resolvePairedAccessScopes(device) {
	const scopes = Array.isArray(device?.approvedScopes) ? device.approvedScopes : Array.isArray(device?.scopes) ? device.scopes : [];
	return normalizeSortedUniqueTrimmedStringList(scopes);
}
function isSetupCodeMobileBootstrapClient(client) {
	const platform = normalizeDeviceMetadataForAuth(client.platform);
	const deviceFamily = normalizeDeviceMetadataForAuth(client.deviceFamily);
	if (client.id === GATEWAY_CLIENT_IDS.ANDROID_APP) return /^android(?:\s|$)/u.test(platform) && deviceFamily === "android";
	if (client.id === GATEWAY_CLIENT_IDS.IOS_APP) return /^(?:ios|ipados)(?:\s|$)/u.test(platform) && /^(?:iphone|ipad|ios)$/u.test(deviceFamily);
	return false;
}
/** Embedded voice nodes must prove the canonical node-host and ESP32 metadata tuple. */
function isSetupCodeVoiceNodeBootstrapClient(client) {
	const platform = normalizeDeviceMetadataForAuth(client.platform);
	const deviceFamily = normalizeDeviceMetadataForAuth(client.deviceFamily);
	return client.id === GATEWAY_CLIENT_IDS.NODE_HOST && /^esp32(?:\s|$)/u.test(platform) && deviceFamily === "esp32";
}
/** Match a closed setup profile to the client metadata class allowed to redeem it silently. */
function isSetupCodeHandoffBootstrapClient(params) {
	return isMobilePairingSetupBootstrapProfile(params.profile) && isSetupCodeMobileBootstrapClient(params.client) || isNodePairingSetupBootstrapProfile(params.profile) && params.client.id === GATEWAY_CLIENT_IDS.NODE_HOST || isVoiceNodePairingSetupBootstrapProfile(params.profile) && isSetupCodeVoiceNodeBootstrapClient(params.client);
}
/** Match the exact host-issued browser-owner profile and its closed requested scope set. */
function isControlUiOwnerBootstrapProfile(params) {
	const { profile, requestedScopes } = params;
	return Boolean(profile && deviceBootstrapProfilesEqual(profile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) && deviceBootstrapProfilesEqual({
		roles: ["operator"],
		scopes: requestedScopes,
		purpose: CONTROL_UI_OWNER_BOOTSTRAP_PROFILE.purpose
	}, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE));
}
function isControlUiOperatorBootstrapProfile(params) {
	const { profile, requestedScopes } = params;
	if (isControlUiOwnerBootstrapProfile(params)) return true;
	if (!profile || profile.purpose !== "control-ui") return false;
	if (profile.roles.length !== 1 || profile.roles[0] !== "operator") return false;
	if (!profile.scopes.every((scope) => BOOTSTRAP_HANDOFF_OPERATOR_SCOPES.includes(scope))) return false;
	return roleScopesAllow({
		role: "operator",
		requestedScopes,
		allowedScopes: profile.scopes
	});
}
function isMobileNodeBootstrapConnect(params) {
	return params.role === "node" && params.scopes.length === 0 && !params.isControlUi && !params.isBrowserOperatorUi && !params.isWebchat && params.clientMode === GATEWAY_CLIENT_MODES.NODE;
}
function pairedDeviceAllowsBootstrapRole(params) {
	return hasEffectivePairedDeviceRole(params.device, params.role) && roleScopesAllow({
		role: params.role,
		requestedScopes: resolveBootstrapProfileScopesForRole(params.role, params.profile.scopes, params.profile.purpose),
		allowedScopes: resolvePairedAccessScopes(params.device)
	});
}
function pairedDeviceAllowsBootstrapProfile(params) {
	const device = params.device;
	return Boolean(device && device.publicKey === params.devicePublicKey && params.profile.roles.every((role) => pairedDeviceAllowsBootstrapRole({
		device,
		profile: params.profile,
		role
	})));
}
function pairedDeviceAllowsBootstrapOperator(params) {
	const device = params.device;
	return Boolean(device && device.publicKey === params.devicePublicKey && pairedDeviceAllowsBootstrapRole({
		device,
		profile: params.profile,
		role: "operator"
	}));
}
function resolvePinnedClientMetadata(params) {
	function resolveNativeAppPlatformFamily(clientId, value) {
		if (clientId === GATEWAY_CLIENT_IDS.IOS_APP && /^(?:ios|ipados)(?:\s|$)/.test(value)) return "ios-family";
		if (clientId === GATEWAY_CLIENT_IDS.ANDROID_APP && /^android(?:\s|$)/.test(value)) return "android";
		if (clientId === GATEWAY_CLIENT_IDS.WATCHOS_APP && /^watchos \d+(?:\.\d+){0,2}$/.test(value)) return "watchos";
		if (clientId === GATEWAY_CLIENT_IDS.MACOS_APP && /^macos \d+(?:\.\d+){0,2}$/.test(value)) return "macos";
	}
	const claimedPlatform = normalizeDeviceMetadataForAuth(params.claimedPlatform);
	const claimedDeviceFamily = normalizeDeviceMetadataForAuth(params.claimedDeviceFamily);
	const pairedPlatform = normalizeDeviceMetadataForAuth(params.pairedPlatform);
	const pairedDeviceFamily = normalizeDeviceMetadataForAuth(params.pairedDeviceFamily);
	const hasPinnedPlatform = pairedPlatform !== "";
	const hasPinnedDeviceFamily = pairedDeviceFamily !== "";
	const pairedRuntimeIdentity = resolveGatewayClientPlatformIdentity(pairedPlatform);
	const isRuntimePlatformPin = params.clientId === GATEWAY_CLIENT_IDS.NODE_HOST && params.clientMode === GATEWAY_CLIENT_MODES.NODE && hasPinnedPlatform && claimedPlatform !== "" && resolveGatewayClientPlatformIdentity(claimedPlatform).platform === pairedRuntimeIdentity.platform || !hasPinnedDeviceFamily && pairedRuntimeIdentity.platform !== pairedPlatform && claimedPlatform === pairedRuntimeIdentity.platform && claimedDeviceFamily === normalizeDeviceMetadataForAuth(pairedRuntimeIdentity.deviceFamily);
	const isNodeHostUsingMacAppPlatformPin = params.clientId === GATEWAY_CLIENT_IDS.NODE_HOST && params.clientMode === GATEWAY_CLIENT_MODES.NODE && (claimedPlatform === "darwin" || claimedPlatform === "macos") && /^macos \d+(?:\.\d+){0,2}$/.test(pairedPlatform);
	const claimedNativeAppPlatformFamily = resolveNativeAppPlatformFamily(params.clientId, claimedPlatform);
	const pairedNativeAppPlatformFamily = resolveNativeAppPlatformFamily(params.clientId, pairedPlatform);
	const isNativeAppPlatformVersionRefresh = hasPinnedPlatform && claimedPlatform !== "" && claimedPlatform !== pairedPlatform && (claimedNativeAppPlatformFamily !== void 0 && claimedNativeAppPlatformFamily === pairedNativeAppPlatformFamily || params.clientId === GATEWAY_CLIENT_IDS.MACOS_APP && claimedNativeAppPlatformFamily === "macos" && (pairedPlatform === "darwin" || pairedPlatform === "macos"));
	const platformMismatch = hasPinnedPlatform && claimedPlatform !== pairedPlatform && !isRuntimePlatformPin && !isNodeHostUsingMacAppPlatformPin && !isNativeAppPlatformVersionRefresh;
	const deviceFamilyMismatch = hasPinnedDeviceFamily && claimedDeviceFamily !== pairedDeviceFamily;
	const pinnedPlatform = isRuntimePlatformPin ? pairedRuntimeIdentity.platform : claimedPlatform === pairedPlatform ? params.pairedPlatform : isNodeHostUsingMacAppPlatformPin ? params.pairedPlatform : isNativeAppPlatformVersionRefresh ? params.claimedPlatform : void 0;
	return {
		platformMismatch,
		deviceFamilyMismatch,
		pinnedPlatform: hasPinnedPlatform ? pinnedPlatform : void 0,
		pinnedDeviceFamily: hasPinnedDeviceFamily ? params.pairedDeviceFamily : void 0,
		...isNativeAppPlatformVersionRefresh ? { refreshPairedPlatform: params.claimedPlatform } : {}
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-device-proof.ts
const DEVICE_SIGNATURE_SKEW_MS = 12e4;
function verifyGatewayConnectDeviceProof(context, params) {
	const { device, resolvedAuth, authMethod, role, scopes } = params;
	if (!device) return {
		ok: true,
		devicePublicKey: null,
		deviceAuthPayloadVersion: null
	};
	const { frame, connectParams } = context;
	const { send, close, setHandshakeState, setCloseCause } = context.handler;
	const rejectDeviceAuthInvalid = (reason, message) => {
		emitGatewayAuthSecurityEvent({
			action: "gateway.auth.failed",
			outcome: "denied",
			severity: "medium",
			authMode: resolvedAuth.mode,
			authMethod,
			authProvided: "device-signature",
			role,
			scopes,
			clientMode: connectParams.client.mode,
			deviceId: device.id,
			reason
		});
		setHandshakeState("failed");
		setCloseCause("device-auth-invalid", {
			reason,
			client: connectParams.client.id,
			deviceId: device.id
		});
		send({
			type: "res",
			id: frame.id,
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
				code: resolveDeviceAuthConnectErrorDetailCode(reason),
				reason
			} })
		});
		close(1008, message);
	};
	const derivedId = deriveDeviceIdFromPublicKey(device.publicKey);
	if (!derivedId || derivedId !== device.id) {
		rejectDeviceAuthInvalid("device-id-mismatch", "device identity mismatch");
		return { ok: false };
	}
	const signedAt = device.signedAt;
	if (typeof signedAt !== "number" || Math.abs(Date.now() - signedAt) > DEVICE_SIGNATURE_SKEW_MS) {
		rejectDeviceAuthInvalid("device-signature-stale", "device signature expired");
		return { ok: false };
	}
	const providedNonce = typeof device.nonce === "string" ? device.nonce.trim() : "";
	if (!providedNonce) {
		rejectDeviceAuthInvalid("device-nonce-missing", "device nonce required");
		return { ok: false };
	}
	if (providedNonce !== context.handler.connectNonce) {
		rejectDeviceAuthInvalid("device-nonce-mismatch", "device nonce mismatch");
		return { ok: false };
	}
	const payloadVersion = resolveDeviceSignaturePayloadVersion({
		device,
		connectParams,
		role,
		scopes,
		signedAtMs: signedAt,
		nonce: providedNonce
	});
	if (!payloadVersion) {
		rejectDeviceAuthInvalid("device-signature", "device signature invalid");
		return { ok: false };
	}
	const devicePublicKey = normalizeDevicePublicKeyBase64Url(device.publicKey);
	if (!devicePublicKey) {
		rejectDeviceAuthInvalid("device-public-key", "device public key invalid");
		return { ok: false };
	}
	return {
		ok: true,
		devicePublicKey,
		deviceAuthPayloadVersion: payloadVersion
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-policy.ts
function shouldSkipControlUiPairing(params) {
	if (params.isControlUi && params.role === "operator" && params.authMethod === "tailscale" && params.device) return "tailscale-device";
	if (params.isControlUi && params.role === "operator" && params.authMode === "none") return "auth-none";
	return null;
}
function isTrustedProxyControlUiOperatorAuth(params) {
	return params.isControlUi && params.role === "operator" && params.authMode === "trusted-proxy" && params.authOk && params.authMethod === "trusted-proxy";
}
function shouldClearUnboundScopesForMissingDeviceIdentity(params) {
	return params.decision.kind !== "allow" || params.authMethod === "token" || params.authMethod === "password" || params.authMethod === "trusted-proxy";
}
function evaluateMissingDeviceIdentity(params) {
	if (params.hasDeviceIdentity) return { kind: "allow" };
	if (params.isControlUi && params.trustedProxyAuthOk) return { kind: "allow" };
	if (params.localBackendSelfPairingOk && params.role === "operator") return { kind: "allow" };
	if (params.isControlUi) return { kind: "reject-control-ui-insecure-auth" };
	if (roleCanSkipDeviceIdentity(params.role, params.sharedAuthOk)) return { kind: "allow" };
	if (!params.authOk && params.hasSharedAuth) return { kind: "reject-unauthorized" };
	return { kind: "reject-device-required" };
}
//#endregion
//#region src/gateway/server/ws-connection/connect-auth.ts
const unauthorizedHandshakeLogLimiter = new HandshakeAuthLogLimiter();
async function authenticateGatewayConnect(context) {
	const hasCredentialFallback = Boolean(context.connectParams.auth?.deviceToken || context.connectParams.device && context.connectParams.auth?.token);
	if (!context.authRateLimiter || !hasCredentialFallback) return await authenticateGatewayConnectCore(context);
	return await withSerializedCredentialFallbackAttempt({
		limiter: context.authRateLimiter,
		ip: context.browserRateLimitClientIp,
		run: async () => await authenticateGatewayConnectCore(context)
	});
}
async function authenticateGatewayConnectCore(context) {
	const { upgradeReq, connId, remoteAddr, remotePort, localAddr, localPort, requestHost, requestOrigin, requestUserAgent, getResolvedAuth, getRequiredSharedGatewaySessionGeneration, advanceHandshakePhase, setCloseCause, close, logWsControl } = context.handler;
	const { connectParams, trustedProxies, allowRealIpFallback, peerLabel, hasProxyHeaders, isLocalClient, hasBrowserOriginHeader, browserRateLimitClientIp, authRateLimiter, clientLabel, markHandshakeFailure, sendHandshakeErrorResponse } = context;
	const resolvedAuth = getResolvedAuth();
	const hasRequestedScopes = Array.isArray(connectParams.scopes);
	const admission = await admitGatewayConnect(context);
	if (!admission) return;
	let { scopes } = admission;
	const { minProtocol, maxProtocol, usesLegacyNodeProtocol, role, isControlUi, isBrowserOperatorUi, isWebchat, isNativeAppUi, startupPending } = admission;
	const startupBootstrapConnect = startupPending && isStartupNodeBootstrapConnect(connectParams);
	const deviceRaw = connectParams.device;
	const hasTokenAuth = Boolean(connectParams.auth?.token);
	const hasPasswordAuth = Boolean(connectParams.auth?.password);
	const hasSharedAuth = hasTokenAuth || hasPasswordAuth;
	const device = deviceRaw;
	const hasBootstrapProof = Boolean(connectParams.auth?.bootstrapToken);
	const hasDeviceTokenProof = Boolean(connectParams.auth?.deviceToken);
	if (hasSharedAuth || hasBootstrapProof || hasDeviceTokenProof || Boolean(device)) advanceHandshakePhase("auth_credentials_received");
	const connectAuthState = await resolveConnectAuthState({
		resolvedAuth,
		connectAuth: connectParams.auth,
		hasDeviceIdentity: Boolean(device),
		req: upgradeReq,
		trustedProxies,
		allowRealIpFallback,
		rateLimiter: authRateLimiter,
		clientIp: browserRateLimitClientIp
	});
	const { sharedAuthOk, pendingSharedAuthFailure, bootstrapTokenCandidate, deviceTokenCandidate, deviceTokenCandidateSource } = connectAuthState;
	let { authResult, authOk, authMethod } = connectAuthState;
	let rejectedPendingSharedAuthFailure = pendingSharedAuthFailure;
	const settleRejectedSharedAuthFailure = async () => {
		if (!rejectedPendingSharedAuthFailure) return;
		rejectedPendingSharedAuthFailure = false;
		await authRateLimiter?.recordFailureAndDelay(browserRateLimitClientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
	};
	const rejectUnauthorized = (failedAuth) => {
		const { authProvided, canRetryWithDeviceToken, recommendedNextStep } = resolveUnauthorizedHandshakeContext({
			connectAuth: connectParams.auth,
			failedAuth,
			hasDeviceIdentity: Boolean(device)
		});
		emitGatewayAuthSecurityEvent({
			action: "gateway.auth.failed",
			outcome: "denied",
			severity: failedAuth.rateLimited ? "high" : "medium",
			authMode: resolvedAuth.mode,
			authMethod: failedAuth.method ?? authMethod,
			authProvided,
			role,
			scopes,
			clientMode: connectParams.client.mode,
			deviceId: device?.id,
			reason: failedAuth.reason ?? "unknown",
			rateLimited: failedAuth.rateLimited === true
		});
		markHandshakeFailure("unauthorized", {
			authMode: resolvedAuth.mode,
			authProvided,
			authReason: failedAuth.reason,
			allowTailscale: resolvedAuth.allowTailscale,
			peer: peerLabel,
			remoteAddr,
			remotePort,
			localAddr,
			localPort,
			role,
			scopeCount: scopes.length,
			hasDeviceIdentity: Boolean(device)
		});
		const authMessage = formatGatewayAuthFailureMessage({
			authMode: resolvedAuth.mode,
			authProvided,
			reason: failedAuth.reason,
			client: connectParams.client,
			isLocalClient
		});
		const authLogDecision = shouldLimitMissingCredentialAuthLog({
			reason: failedAuth.reason,
			authProvided
		}) ? unauthorizedHandshakeLogLimiter.register(buildHandshakeAuthLogKey({
			reason: failedAuth.reason,
			remoteAddr,
			client: clientLabel,
			mode: connectParams.client.mode,
			authProvided
		})) : {
			shouldLog: true,
			suppressedSinceLastLog: 0
		};
		if (authLogDecision.shouldLog) {
			const suppressedText = authLogDecision.suppressedSinceLastLog > 0 ? ` suppressed=${authLogDecision.suppressedSinceLastLog}` : "";
			logWsControl.warn(`unauthorized conn=${connId} peer=${formatForLog(peerLabel)} remote=${remoteAddr ?? "?"} client=${formatForLog(clientLabel)} ${connectParams.client.mode} v${formatForLog(connectParams.client.version)} role=${role} scopes=${scopes.length} auth=${authProvided} device=${device ? "yes" : "no"} platform=${formatForLog(connectParams.client.platform)} instance=${formatForLog(connectParams.client.instanceId ?? "n/a")} host=${formatForLog(requestHost ?? "n/a")} origin=${formatForLog(requestOrigin ?? "n/a")} ua=${formatForLog(requestUserAgent ?? "n/a")} reason=${failedAuth.reason ?? "unknown"} guidance=${formatForLog(authMessage)}${suppressedText}`);
		}
		sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, authMessage, {
			...failedAuth.rateLimited === true ? {
				retryable: true,
				...failedAuth.retryAfterMs !== void 0 ? { retryAfterMs: failedAuth.retryAfterMs } : {}
			} : {},
			details: {
				code: resolveAuthConnectErrorDetailCode(failedAuth.reason),
				authReason: failedAuth.reason,
				canRetryWithDeviceToken,
				recommendedNextStep
			}
		});
		close(1008, truncateCloseReason(authMessage));
	};
	const clearUnboundScopes = () => {
		if (scopes.length > 0) {
			scopes = [];
			connectParams.scopes = scopes;
		}
	};
	let pairingLocality = resolvePairingLocality({
		connectParams,
		isLocalClient,
		requestHost,
		requestOrigin,
		remoteAddress: remoteAddr,
		hasProxyHeaders,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	let skipLocalBackendSelfPairing = shouldSkipLocalBackendSelfPairing({
		connectParams,
		locality: pairingLocality,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	let preserveLocalCliSharedAuthScopes = shouldPreserveLocalCliSharedAuthScopes({
		connectParams,
		locality: pairingLocality,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	const handleMissingDeviceIdentity = () => {
		const trustedProxyAuthOk = isTrustedProxyControlUiOperatorAuth({
			isControlUi,
			role,
			authMode: resolvedAuth.mode,
			authOk,
			authMethod
		});
		const decision = evaluateMissingDeviceIdentity({
			hasDeviceIdentity: Boolean(device),
			role,
			isControlUi,
			trustedProxyAuthOk,
			localBackendSelfPairingOk: skipLocalBackendSelfPairing,
			sharedAuthOk,
			authOk,
			hasSharedAuth,
			isLocalClient
		});
		if (!device && !skipLocalBackendSelfPairing && !preserveLocalCliSharedAuthScopes && shouldClearUnboundScopesForMissingDeviceIdentity({
			decision,
			authMethod
		})) clearUnboundScopes();
		if (decision.kind === "allow") return true;
		if (decision.kind === "reject-control-ui-insecure-auth") {
			const errorMessage = "control ui requires device identity (use HTTPS or localhost secure context)";
			markHandshakeFailure("control-ui-insecure-auth", { insecureAuthConfigured: false });
			sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, errorMessage, { details: { code: ConnectErrorDetailCodes.CONTROL_UI_DEVICE_IDENTITY_REQUIRED } });
			close(1008, errorMessage);
			return false;
		}
		if (decision.kind === "reject-unauthorized") {
			rejectUnauthorized(authResult);
			return false;
		}
		markHandshakeFailure("device-required");
		sendHandshakeErrorResponse(ErrorCodes.NOT_PAIRED, "device identity required", { details: { code: ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED } });
		close(1008, "device identity required");
		return false;
	};
	if (startupPending && !device) {
		await settleRejectedSharedAuthFailure();
		await rejectGatewayStartupConnect(context);
		return;
	}
	if (!handleMissingDeviceIdentity()) {
		await settleRejectedSharedAuthFailure();
		return;
	}
	const deviceProof = verifyGatewayConnectDeviceProof(context, {
		device,
		resolvedAuth,
		authMethod,
		role,
		scopes
	});
	if (!deviceProof.ok) {
		await settleRejectedSharedAuthFailure();
		return;
	}
	const authDecision = await resolveConnectAuthDecision({
		state: {
			authResult,
			authOk,
			authMethod,
			sharedAuthOk,
			pendingSharedAuthFailure,
			bootstrapTokenCandidate,
			deviceTokenCandidate,
			deviceTokenCandidateSource
		},
		hasDeviceIdentity: Boolean(device),
		deviceId: device?.id,
		publicKey: device?.publicKey,
		role,
		scopes,
		requireBootstrapToken: startupBootstrapConnect,
		rateLimiter: authRateLimiter,
		clientIp: browserRateLimitClientIp,
		async verifyBootstrapToken({ deviceId, publicKey, token, role: roleLocal, scopes: scopesLocal }) {
			return await verifyDeviceBootstrapToken({
				deviceId,
				publicKey,
				token,
				role: roleLocal,
				scopes: scopesLocal
			});
		},
		async verifyDeviceToken(paramsLocal) {
			return await verifyDeviceToken({
				...paramsLocal,
				requiredSharedGatewaySessionGeneration: getRequiredSharedGatewaySessionGeneration?.()
			});
		}
	});
	({authResult, authOk, authMethod} = authDecision);
	const deviceTokenSharedGatewaySessionGeneration = authDecision.deviceTokenSharedGatewaySessionGeneration;
	pairingLocality = resolvePairingLocality({
		connectParams,
		isLocalClient,
		requestHost,
		requestOrigin,
		remoteAddress: remoteAddr,
		hasProxyHeaders,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	skipLocalBackendSelfPairing = shouldSkipLocalBackendSelfPairing({
		connectParams,
		locality: pairingLocality,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	preserveLocalCliSharedAuthScopes = shouldPreserveLocalCliSharedAuthScopes({
		connectParams,
		locality: pairingLocality,
		hasBrowserOriginHeader,
		sharedAuthOk,
		authMethod
	});
	if (!authOk) {
		if (startupPending && bootstrapTokenCandidate) {
			await rejectGatewayStartupConnect(context);
			return;
		}
		rejectUnauthorized(authResult);
		return;
	}
	const boundBootstrapContext = authMethod === "bootstrap-token" && bootstrapTokenCandidate && device ? await getBoundDeviceBootstrapContext({
		token: bootstrapTokenCandidate,
		deviceId: device.id,
		publicKey: device.publicKey
	}) : null;
	if (startupPending && authMethod === "bootstrap-token" && !startupBootstrapConnect) {
		await rejectGatewayStartupConnect(context);
		return;
	}
	if (startupBootstrapConnect) {
		const setupId = boundBootstrapContext?.setupId?.trim();
		const isCloudWorkerProfile = Boolean(boundBootstrapContext && deviceBootstrapProfilesEqual(boundBootstrapContext.profile, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE));
		let pendingSetup = false;
		if (isCloudWorkerProfile && setupId && device) try {
			pendingSetup = context.handler.isPendingWorkerNodeSetup?.(setupId, device.id) === true;
		} catch {
			pendingSetup = false;
		}
		if (!isCloudWorkerProfile || !pendingSetup) {
			await rejectGatewayStartupConnect(context);
			return;
		}
	}
	advanceHandshakePhase("auth_validated");
	const issuedBootstrapProfile = boundBootstrapContext?.profile ?? null;
	const usesSharedGatewayAuth = authMethod === "token" || authMethod === "password" || authMethod === "trusted-proxy";
	const sharedGatewaySessionGeneration = usesSharedGatewayAuth ? resolveSharedGatewaySessionGeneration(resolvedAuth, trustedProxies) : void 0;
	const controlUiBootstrapSharedGatewaySessionGeneration = authMethod === "bootstrap-token" && isControlUi && role === "operator" && isControlUiOperatorBootstrapProfile({
		profile: issuedBootstrapProfile,
		requestedScopes: scopes
	}) ? getRequiredSharedGatewaySessionGeneration?.() : void 0;
	const sessionUsesSharedGatewayAuth = usesSharedGatewayAuth || deviceTokenSharedGatewaySessionGeneration !== void 0 || controlUiBootstrapSharedGatewaySessionGeneration !== void 0;
	const sessionSharedGatewaySessionGeneration = sharedGatewaySessionGeneration ?? deviceTokenSharedGatewaySessionGeneration ?? controlUiBootstrapSharedGatewaySessionGeneration;
	if (sessionUsesSharedGatewayAuth) {
		const requiredSharedGatewaySessionGeneration = getRequiredSharedGatewaySessionGeneration?.();
		if (requiredSharedGatewaySessionGeneration !== void 0 && sessionSharedGatewaySessionGeneration !== requiredSharedGatewaySessionGeneration) {
			setCloseCause("gateway-auth-rotated", { authGenerationStale: true });
			close(4001, "gateway auth changed");
			return;
		}
	}
	const handoffBootstrapProfile = null;
	const trustedProxyAuthOk = isTrustedProxyControlUiOperatorAuth({
		isControlUi,
		role,
		authMode: resolvedAuth.mode,
		authOk,
		authMethod
	});
	if (trustedProxyAuthOk) {
		scopes = applyConnectionScopeCap({
			scopes,
			upgradeReq
		});
		connectParams.scopes = scopes;
	}
	const controlUiPairingKind = shouldSkipControlUiPairing({
		isControlUi,
		device,
		role,
		authMode: resolvedAuth.mode,
		authMethod
	});
	return {
		resolvedAuth,
		minProtocol,
		maxProtocol,
		usesLegacyNodeProtocol,
		role,
		scopes,
		hasRequestedScopes,
		isControlUi,
		isBrowserOperatorUi,
		isWebchat,
		isNativeAppUi,
		startupPending,
		device,
		devicePublicKey: deviceProof.devicePublicKey,
		deviceAuthPayloadVersion: deviceProof.deviceAuthPayloadVersion,
		hasTokenAuth,
		hasPasswordAuth,
		bootstrapTokenCandidate,
		deviceTokenSharedGatewaySessionGeneration,
		authResult,
		authOk,
		authMethod,
		pairingLocality,
		usesSharedGatewayAuth,
		sessionUsesSharedGatewayAuth,
		sessionSharedGatewaySessionGeneration,
		issuedBootstrapProfile,
		handoffBootstrapProfile,
		trustedProxyAuthOk,
		controlUiPairingKind,
		skipLocalBackendSelfPairing,
		rejectUnauthorized
	};
}
//#endregion
//#region src/gateway/device-pairing-prune.ts
/**
* After a silent auto-approval, retire older silent pairings of the same client
* cluster. Ephemeral state dirs mint a fresh deviceId per run and every run
* re-pairs silently, so without this the paired-device list grows without bound
* (dozens of stale operator/node records per host).
*/
async function pruneSupersededSilentPairingsAfterApproval(params) {
	const { context } = params;
	const pruned = await pruneSupersededSilentPairedDevices({
		deviceId: params.deviceId,
		baseDir: params.baseDir,
		nowMs: params.nowMs,
		isDeviceConnected: (deviceId) => context.hasConnectedClientsForDevice?.(deviceId) ?? false
	});
	for (const entry of pruned) {
		context.logGateway.info(`device pairing pruned superseded silent pairing device=${entry.deviceId} roles=${entry.roles.join(",") || "none"}`);
		if (entry.roles.includes("node")) clearRemovedNodeRuntimeState({
			nodeId: entry.deviceId,
			context
		});
		context.invalidateClientsForDevice?.(entry.deviceId, { reason: "device-pair-removed" });
		await reconcileRevokedDeviceWorker(context, entry.deviceId);
		if (entry.roles.includes("node")) context.broadcast("node.pair.resolved", {
			requestId: "",
			nodeId: entry.deviceId,
			decision: "removed",
			ts: Date.now()
		}, { dropIfSlow: true });
		context.disconnectClientsForDevice?.(entry.deviceId);
	}
	return pruned;
}
//#endregion
//#region src/gateway/node-legacy-protocol-filter.ts
const BUILT_IN_NODE_COMMANDS = /* @__PURE__ */ new Set([
	...Object.values(PLATFORM_DEFAULTS).flat(),
	...DEFAULT_DANGEROUS_NODE_COMMANDS,
	...TALK_PTT_COMMANDS,
	...IOS_WATCH_RELAY_COMMANDS
]);
const LEGACY_NODE_HOST_DESKTOP_METADATA = {
	darwin: {
		platform: "macos",
		deviceFamily: "Mac"
	},
	linux: {
		platform: "linux",
		deviceFamily: "Linux"
	},
	macos: {
		platform: "macos",
		deviceFamily: "Mac"
	},
	win32: {
		platform: "windows",
		deviceFamily: "Windows"
	},
	windows: {
		platform: "windows",
		deviceFamily: "Windows"
	}
};
/** Normalizes desktop aliases used by protocol-v3-compatible node hosts. */
function normalizeNodeHostCompatibilityMetadata(client) {
	if (client.id !== GATEWAY_CLIENT_IDS.NODE_HOST || client.mode !== GATEWAY_CLIENT_MODES.NODE) return client;
	if (!Object.hasOwn(LEGACY_NODE_HOST_DESKTOP_METADATA, client.platform)) return client;
	const metadata = LEGACY_NODE_HOST_DESKTOP_METADATA[client.platform];
	const deviceFamily = client.deviceFamily?.trim();
	if (deviceFamily && deviceFamily.toLowerCase() !== metadata.deviceFamily.toLowerCase()) return client;
	if (client.platform === metadata.platform && deviceFamily) return client;
	return {
		...client,
		platform: metadata.platform,
		deviceFamily: deviceFamily || metadata.deviceFamily
	};
}
function filterLegacyNodeProtocolFeatures(params) {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	if (!registry) return {
		caps: [...params.caps],
		commands: [...params.commands]
	};
	const pluginIds = /* @__PURE__ */ new Set([...registry.nodeHostCommands.map((entry) => entry.pluginId), ...registry.nodeInvokePolicies.map((entry) => entry.pluginId)]);
	const pluginCaps = /* @__PURE__ */ new Set([...params.pluginSurfaces, ...pluginIds]);
	const isPluginOnly = (command) => !BUILT_IN_NODE_COMMANDS.has(command);
	const pluginCommands = /* @__PURE__ */ new Set([...registry.nodeHostCommands.map((entry) => entry.command.command).filter(isPluginOnly), ...registry.nodeInvokePolicies.flatMap((entry) => entry.policy.commands).filter(isPluginOnly)]);
	return {
		caps: params.caps.filter((cap) => !pluginCaps.has(cap)),
		commands: params.commands.filter((command) => !pluginCommands.has(command))
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-device-tokens.ts
async function issueGatewayConnectDeviceTokens(params) {
	const { state, scopes, hasApprovedDeviceBaseline } = params;
	const { role, device, isBrowserOperatorUi, isWebchat, trustedProxyAuthOk, sessionUsesSharedGatewayAuth, sessionSharedGatewaySessionGeneration, deviceTokenSharedGatewaySessionGeneration, handoffBootstrapProfile } = state;
	const sharedGatewayAuthIssuer = sessionSharedGatewaySessionGeneration && (deviceTokenSharedGatewaySessionGeneration !== void 0 || sessionUsesSharedGatewayAuth && (isBrowserOperatorUi || isWebchat)) ? {
		kind: "shared-gateway-auth",
		generation: sessionSharedGatewaySessionGeneration
	} : void 0;
	const issuedDeviceGrant = !trustedProxyAuthOk && device && hasApprovedDeviceBaseline ? await ensureDeviceToken({
		deviceId: device.id,
		role,
		scopes,
		issuer: sharedGatewayAuthIssuer,
		isIssuanceCurrent: params.isIssuanceCurrent
	}) : null;
	const bootstrapDeviceTokens = [];
	if (issuedDeviceGrant) bootstrapDeviceTokens.push({
		deviceToken: issuedDeviceGrant.token,
		role: issuedDeviceGrant.role,
		scopes: issuedDeviceGrant.scopes,
		issuedAtMs: issuedDeviceGrant.rotatedAtMs ?? issuedDeviceGrant.createdAtMs
	});
	if (device && handoffBootstrapProfile) for (const bootstrapRole of handoffBootstrapProfile.roles) {
		if (bootstrapDeviceTokens.some((entry) => entry.role === bootstrapRole)) continue;
		const bootstrapRoleScopes = bootstrapRole === "operator" ? resolveBootstrapProfileScopesForRole(bootstrapRole, handoffBootstrapProfile.scopes, handoffBootstrapProfile.purpose) : [];
		const extraToken = await ensureDeviceToken({
			deviceId: device.id,
			role: bootstrapRole,
			scopes: bootstrapRoleScopes,
			isIssuanceCurrent: params.isIssuanceCurrent
		});
		if (!extraToken) continue;
		bootstrapDeviceTokens.push({
			deviceToken: extraToken.token,
			role: extraToken.role,
			scopes: extraToken.scopes,
			issuedAtMs: extraToken.rotatedAtMs ?? extraToken.createdAtMs
		});
	}
	return {
		deviceToken: issuedDeviceGrant,
		bootstrapDeviceTokens
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-existing-device.ts
async function authorizeExistingGatewayDevice(params) {
	const { context, state, paired, devicePublicKey, clientAccessMetadata, requirePairing } = params;
	const { connectParams, hasBrowserOriginHeader, reportedClientIp } = context;
	const { connId, logGateway } = context.handler;
	const { role, scopes, device, deviceAuthPayloadVersion, authMethod, bootstrapTokenCandidate, pairingLocality, isControlUi, isBrowserOperatorUi, isWebchat, isNativeAppUi } = state;
	let { handoffBootstrapProfile } = params;
	const claimedPlatform = connectParams.client.platform;
	const pairedPlatform = paired.platform;
	const claimedDeviceFamily = connectParams.client.deviceFamily;
	const pairedDeviceFamily = paired.deviceFamily;
	const metadataPinning = resolvePinnedClientMetadata({
		clientId: connectParams.client.id,
		clientMode: connectParams.client.mode,
		claimedPlatform,
		claimedDeviceFamily,
		pairedPlatform,
		pairedDeviceFamily
	});
	const { platformMismatch, deviceFamilyMismatch } = metadataPinning;
	if (platformMismatch || deviceFamilyMismatch) {
		if (!shouldAllowSilentLocalPairing({
			locality: pairingLocality,
			hasBrowserOriginHeader,
			isControlUi,
			isWebchat,
			isNativeAppUi,
			authMethod,
			reason: "metadata-upgrade"
		})) logGateway.warn(`security audit: device metadata upgrade requested reason=metadata-upgrade device=${device?.id} ip=${reportedClientIp ?? "unknown-ip"} auth=${authMethod} payload=${deviceAuthPayloadVersion ?? "unknown"} claimedPlatform=${claimedPlatform ?? "<none>"} pinnedPlatform=${pairedPlatform ?? "<none>"} claimedDeviceFamily=${claimedDeviceFamily ?? "<none>"} pinnedDeviceFamily=${pairedDeviceFamily ?? "<none>"} client=${connectParams.client.id} conn=${connId}`);
		if (!await requirePairing("metadata-upgrade", paired)) return {
			ok: false,
			handoffBootstrapProfile
		};
	} else {
		if (metadataPinning.pinnedPlatform) connectParams.client.platform = metadataPinning.pinnedPlatform;
		if (metadataPinning.pinnedDeviceFamily) connectParams.client.deviceFamily = metadataPinning.pinnedDeviceFamily;
	}
	const pairedRoles = listEffectivePairedDeviceRoles(paired);
	const pairedScopes = resolvePairedAccessScopes(paired);
	if (!pairedRoles.includes(role)) {
		if (!await requirePairing("role-upgrade", paired)) return {
			ok: false,
			handoffBootstrapProfile
		};
	}
	if (scopes.length > 0) {
		if (!(pairedScopes.length > 0 && roleScopesAllow({
			role,
			requestedScopes: scopes,
			allowedScopes: pairedScopes
		}))) {
			if (!await requirePairing("scope-upgrade", paired)) return {
				ok: false,
				handoffBootstrapProfile
			};
		}
	}
	const retryBootstrapHandoffProfile = authMethod === "bootstrap-token" && bootstrapTokenCandidate && isMobileNodeBootstrapConnect({
		role,
		scopes,
		isControlUi,
		isBrowserOperatorUi,
		isWebchat,
		clientMode: connectParams.client.mode
	}) && device ? await getBoundDeviceBootstrapProfile({
		token: bootstrapTokenCandidate,
		deviceId: device.id,
		publicKey: devicePublicKey
	}) : null;
	if (retryBootstrapHandoffProfile && isSetupCodeHandoffBootstrapClient({
		profile: retryBootstrapHandoffProfile,
		client: connectParams.client
	})) {
		const retryBootstrapOperatorScopes = resolveBootstrapProfileScopesForRole("operator", retryBootstrapHandoffProfile.scopes, retryBootstrapHandoffProfile.purpose);
		if (!(pairedRoles.includes("operator") && roleScopesAllow({
			role: "operator",
			requestedScopes: retryBootstrapOperatorScopes,
			allowedScopes: pairedScopes
		})) && !await requirePairing("scope-upgrade", paired)) return {
			ok: false,
			handoffBootstrapProfile
		};
		if (pairedDeviceAllowsBootstrapOperator({
			device: device ? await getPairedDevice(device.id) : null,
			devicePublicKey,
			profile: retryBootstrapHandoffProfile
		})) handoffBootstrapProfile = retryBootstrapHandoffProfile;
	}
	if (device) await updatePairedDeviceMetadata(device.id, {
		...clientAccessMetadata,
		...metadataPinning.refreshPairedPlatform ? { platform: metadataPinning.refreshPairedPlatform } : {}
	});
	return {
		ok: true,
		handoffBootstrapProfile
	};
}
//#endregion
//#region src/gateway/node-pairing-ssh-verify.runtime.ts
const MAX_PROBE_OUTPUT_BYTES = 65536;
const REMOTE_IDENTITY_COMMAND = "sh -lc 'openclaw node identity --json'";
/** Read the node device identity back from the pairing host over SSH. */
async function runNodeIdentityProbe(params) {
	const args = [
		"-o",
		"BatchMode=yes",
		"-o",
		"ConnectTimeout=5",
		"-o",
		"NumberOfPasswordPrompts=0",
		"-o",
		"PreferredAuthentications=publickey",
		"-o",
		"StrictHostKeyChecking=yes",
		"-o",
		"UpdateHostKeys=no",
		"-a",
		"-x",
		"-o",
		"ForwardAgent=no",
		"-o",
		"ForwardX11=no",
		"-o",
		"ForwardX11Trusted=no",
		"-o",
		"ClearAllForwardings=yes",
		"-o",
		"ExitOnForwardFailure=yes",
		"-p",
		String(params.port ?? 22)
	];
	if (params.identity?.trim()) args.push("-i", params.identity.trim(), "-o", "IdentitiesOnly=yes");
	args.push("--", `${params.user}@${params.host}`, REMOTE_IDENTITY_COMMAND);
	try {
		const result = await runUtf8CommandWithTimeout(["ssh", ...args], {
			maxOutputBytes: MAX_PROBE_OUTPUT_BYTES,
			outputCapture: "head",
			timeoutMs: Math.max(250, params.timeoutMs)
		});
		if (result.termination === "timeout") return { status: "timeout" };
		if (result.code === 0) return {
			status: "ok",
			stdout: result.stdout
		};
		return {
			status: "failed",
			code: result.code,
			stderr: result.stderr
		};
	} catch (error) {
		return {
			status: "spawn-error",
			message: error instanceof Error ? error.message : String(error)
		};
	}
}
//#endregion
//#region src/gateway/node-pairing-ssh-verify.ts
const DEFAULT_TIMEOUT_MS = 7e3;
const FAILURE_COOLDOWN_MS = 6e4;
const MISMATCH_COOLDOWN_MS = 3e5;
const MAX_CONCURRENT_PROBES = 4;
const MAX_COOLDOWN_ENTRIES = 512;
function resolveProcessUser() {
	try {
		const user = os.userInfo().username.trim();
		if (user) return user;
	} catch {}
	return (process.env.USER ?? process.env.USERNAME)?.trim() || void 0;
}
/** Normalize the enabled-by-default config union into a probe policy, or null when off. */
function resolveNodePairingSshVerifyPolicy(raw) {
	if (raw === false) return null;
	const cfg = typeof raw === "object" && raw !== null ? raw : {};
	const user = cfg.user?.trim() || resolveProcessUser();
	if (!user) return null;
	const cidrs = cfg.cidrs?.map((entry) => entry.trim()).filter((entry) => entry.length > 0).toSorted();
	return {
		user,
		identity: cfg.identity?.trim() || void 0,
		timeoutMs: typeof cfg.timeoutMs === "number" && Number.isFinite(cfg.timeoutMs) && cfg.timeoutMs > 0 ? cfg.timeoutMs : DEFAULT_TIMEOUT_MS,
		cidrs: cidrs && cidrs.length > 0 ? cidrs : void 0
	};
}
function normalizeProbeHost(reportedClientIp) {
	const trimmed = reportedClientIp.trim();
	const host = trimmed.toLowerCase().startsWith("::ffff:") ? trimmed.slice(7) : trimmed;
	if (host.includes("%") || net.isIP(host) === 0) return null;
	return host;
}
/**
* Resolve whether this pairing request qualifies for an SSH verification probe.
* Shares the fresh-node eligibility floor with trusted-CIDR auto-approval and
* additionally bounds the probe target: default private/CGNAT ranges only, so
* a token holder cannot use the gateway as an SSH probe primitive against
* arbitrary public addresses.
*/
function planNodePairingSshVerify(params) {
	const policy = resolveNodePairingSshVerifyPolicy(params.config);
	if (!policy) return null;
	if (!isEligibleFreshNodePairingRequest(params.eligibility) || !params.eligibility.reportedClientIp) return null;
	if (!(policy.cidrs ? isTrustedProxyAddress(params.eligibility.reportedClientIp, policy.cidrs) : isPrivateOrLoopbackAddress(params.eligibility.reportedClientIp) && !isLoopbackAddress(params.eligibility.reportedClientIp))) return null;
	const host = normalizeProbeHost(params.eligibility.reportedClientIp);
	return host ? {
		policy,
		host
	} : null;
}
function parseRemoteIdentity(stdout) {
	for (const line of stdout.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed.startsWith("{")) continue;
		try {
			const parsed = JSON.parse(trimmed);
			if (typeof parsed.deviceId === "string" && typeof parsed.publicKey === "string") return {
				deviceId: parsed.deviceId.trim(),
				publicKey: parsed.publicKey.trim()
			};
		} catch {}
	}
	return null;
}
const inFlightByKey = /* @__PURE__ */ new Map();
const cooldownExpiryByKey = /* @__PURE__ */ new Map();
function probeKey(plan, deviceId, publicKey) {
	return JSON.stringify([
		plan.host,
		deviceId,
		publicKey,
		plan.policy.user,
		plan.policy.identity,
		plan.policy.timeoutMs,
		plan.policy.cidrs
	]);
}
function pruneCooldowns(nowMs) {
	for (const [key, expiry] of cooldownExpiryByKey) if (expiry <= nowMs) cooldownExpiryByKey.delete(key);
	pruneMapToMaxSize(cooldownExpiryByKey, MAX_COOLDOWN_ENTRIES);
}
/**
* Start an SSH verification for one pending pairing request. Returns null when
* the probe should not run right now (cooldown or concurrency cap) so callers
* keep the default manual-approval reconnect behavior. A reconnect that lands
* while the probe is still running gets `alreadyInFlight: true`: the client
* must keep its retry hint, but only the connection that started the probe
* owns the approval work.
*/
function startNodePairingSshVerify(params) {
	const nowMs = params.nowMs ?? Date.now();
	pruneCooldowns(nowMs);
	const key = probeKey(params.plan, params.expectedDeviceId, params.expectedPublicKey);
	const inFlight = inFlightByKey.get(key);
	if (inFlight) return {
		done: inFlight,
		alreadyInFlight: true
	};
	if ((cooldownExpiryByKey.get(key) ?? 0) > nowMs) return null;
	if (inFlightByKey.size >= MAX_CONCURRENT_PROBES) return null;
	const probe = params.probe ?? runNodeIdentityProbe;
	const done = (async () => {
		const result = await probe({
			user: params.plan.policy.user,
			host: params.plan.host,
			identity: params.plan.policy.identity,
			timeoutMs: params.plan.policy.timeoutMs
		});
		if (result.status !== "ok") {
			cooldownExpiryByKey.set(key, Date.now() + FAILURE_COOLDOWN_MS);
			return {
				ok: false,
				reason: "probe-failed"
			};
		}
		const remote = parseRemoteIdentity(result.stdout);
		if (!remote) {
			cooldownExpiryByKey.set(key, Date.now() + FAILURE_COOLDOWN_MS);
			return {
				ok: false,
				reason: "identity-unreadable"
			};
		}
		const expectedKey = normalizeDevicePublicKeyBase64Url(params.expectedPublicKey);
		const remoteKey = normalizeDevicePublicKeyBase64Url(remote.publicKey);
		if (!(Boolean(expectedKey) && expectedKey === remoteKey && remote.deviceId === params.expectedDeviceId)) {
			cooldownExpiryByKey.set(key, Date.now() + MISMATCH_COOLDOWN_MS);
			return {
				ok: false,
				reason: "identity-mismatch"
			};
		}
		return {
			ok: true,
			user: params.plan.policy.user,
			host: params.plan.host
		};
	})();
	return {
		done: getOrCreatePromise(inFlightByKey, key, () => done, { evictOnSettled: true }),
		alreadyInFlight: false
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-node-pairing-ssh.ts
function startGatewayNodePairingSshApproval(params) {
	const { context, state, pairing, existingPairedDevice, devicePublicKey, clientAccessMetadata } = params;
	const { connectParams, configSnapshot, reportedClientIp, reportedClientIpSource, hasBrowserOriginHeader, runDetachedConnectWork } = context;
	const { connId, buildRequestContext, logGateway } = context.handler;
	const { device, role, scopes, isControlUi, isWebchat } = state;
	if (!device || pairing.request.silent === true) return false;
	if (!isScopelessNodePairingRequest(pairing.request)) return false;
	const eligibility = {
		existingPairedDevice: Boolean(existingPairedDevice),
		role,
		reason: params.reason,
		scopes,
		hasBrowserOriginHeader,
		isControlUi,
		isWebchat,
		reportedClientIpSource,
		reportedClientIp
	};
	const sshVerifyPlan = planNodePairingSshVerify({
		config: configSnapshot.gateway?.nodes?.pairing?.sshVerify,
		eligibility
	});
	const sshVerify = sshVerifyPlan ? startNodePairingSshVerify({
		plan: sshVerifyPlan,
		expectedDeviceId: device.id,
		expectedPublicKey: devicePublicKey
	}) : null;
	if (sshVerifyPlan && sshVerify && !sshVerify.alreadyInFlight) {
		const pendingRequestId = pairing.request.requestId;
		runDetachedConnectWork(async () => {
			const outcome = await sshVerify.done;
			if (!outcome.ok) {
				logGateway.info(`node pairing ssh-verify did not approve device=${device.id} host=${sshVerifyPlan.host} reason=${outcome.reason}`);
				return;
			}
			const approvedBySsh = await approveDevicePairing(pendingRequestId, {
				callerScopes: scopes,
				accessMetadata: clientAccessMetadata,
				approvedVia: "ssh-verified",
				isApprovalCurrent: ({ pending, existing }) => {
					const currentConfig = getRuntimeConfigSnapshot();
					if (!currentConfig || pending.deviceId !== device.id || pending.publicKey !== devicePublicKey || !isScopelessNodePairingRequest(pending)) return false;
					return isDeepStrictEqual(sshVerifyPlan, planNodePairingSshVerify({
						config: currentConfig.gateway?.nodes?.pairing?.sshVerify,
						eligibility: {
							...eligibility,
							existingPairedDevice: Boolean(existing),
							scopes: pending.scopes ?? []
						}
					}));
				}
			});
			if (approvedBySsh?.status !== "approved") {
				const reason = approvedBySsh?.status === "forbidden" ? approvedBySsh.reason : "request superseded or already resolved";
				logGateway.info(`node pairing ssh-verify approval skipped device=${device.id} (${reason})`);
				return;
			}
			logGateway.info(`security audit: device pairing ssh-verified auto-approve device=${device.id} ip=${reportedClientIp ?? "unknown-ip"} sshUser=${outcome.user} client=${connectParams.client.id} conn=${connId}`);
			buildRequestContext().broadcast("device.pair.resolved", {
				requestId: pendingRequestId,
				deviceId: device.id,
				decision: "approved",
				ts: Date.now()
			}, { dropIfSlow: true });
		}, (error) => {
			logGateway.warn(`node pairing ssh-verify failed device=${device.id}: ${String(error)}`);
		});
	}
	return Boolean(sshVerifyPlan && sshVerify);
}
//#endregion
//#region src/gateway/server/ws-connection/connect-pairing-approval-plan.ts
const DEFAULT_TRUSTED_PROXY_DEVICE_AUTO_APPROVE_SCOPES = [
	"operator.read",
	"operator.write",
	"operator.approvals",
	"operator.questions"
];
function resolveTrustedProxyDeviceAutoApproveScopes(params) {
	const configuredScopes = normalizeSortedUniqueTrimmedStringList(params.configuredScopes ?? [...DEFAULT_TRUSTED_PROXY_DEVICE_AUTO_APPROVE_SCOPES]);
	if (!params.hasRequestedScopes) return configuredScopes;
	const configured = new Set(configuredScopes);
	const requestedScopes = normalizeSortedUniqueTrimmedStringList(params.requestedScopes);
	if (params.configuredScopes === void 0) requestedScopes.push("operator.questions");
	return normalizeSortedUniqueTrimmedStringList(requestedScopes).filter((scope) => configured.has(scope));
}
/** Reused at planning and synchronous approval commit so config changes revoke the same policy. */
function resolveLocalPairingApproval(params) {
	const { reason, existingPairedDevice, state, configSnapshot, scopes } = params;
	const { role, isControlUi, isWebchat, isNativeAppUi, authMethod, pairingLocality } = state;
	if (!(existingPairedDevice && role !== "operator") && shouldAllowSilentLocalPairing({
		autoApproveLocal: configSnapshot.gateway?.nodes?.pairing?.autoApproveLocal,
		locality: pairingLocality,
		hasBrowserOriginHeader: params.hasBrowserOriginHeader,
		isControlUi,
		isWebchat,
		isNativeAppUi,
		authMethod,
		reason
	})) return "silent";
	return shouldAutoApproveNodePairingFromTrustedCidrs({
		existingPairedDevice: Boolean(existingPairedDevice),
		role,
		reason,
		scopes,
		hasBrowserOriginHeader: params.hasBrowserOriginHeader,
		isControlUi,
		isWebchat,
		reportedClientIpSource: params.reportedClientIpSource,
		reportedClientIp: params.reportedClientIp,
		autoApproveCidrs: configSnapshot.gateway?.nodes?.pairing?.autoApproveCidrs
	}) ? "trusted-cidr" : null;
}
async function resolvePairingApprovalPlan(params) {
	const { reason, existingPairedDevice, state, connectParams, configSnapshot, scopes } = params;
	const { role, isControlUi, isBrowserOperatorUi, isWebchat, isNativeAppUi, authMethod, authResult, bootstrapTokenCandidate } = state;
	const localApproval = resolveLocalPairingApproval(params);
	const trustedProxyAutoApproveConfig = configSnapshot.gateway?.auth?.trustedProxy?.deviceAutoApprove;
	const trustedProxyUser = authResult.user?.trim();
	const isTrustedProxySameKeyUpgrade = reason === "scope-upgrade" && existingPairedDevice?.publicKey === params.devicePublicKey;
	const trustedProxyAutoApproveScopes = (reason === "not-paired" && !existingPairedDevice || isTrustedProxySameKeyUpgrade) && role === "operator" && (isBrowserOperatorUi || isWebchat || isNativeAppUi) && authMethod === "trusted-proxy" && Boolean(trustedProxyUser) && trustedProxyAutoApproveConfig?.enabled === true ? params.connectionScopeCap(resolveTrustedProxyDeviceAutoApproveScopes({
		requestedScopes: scopes,
		hasRequestedScopes: params.hasRequestedScopes,
		configuredScopes: trustedProxyAutoApproveConfig?.scopes
	})) : null;
	const isSetupCodeMobileNodeConnect = isMobileNodeBootstrapConnect({
		role,
		scopes,
		isControlUi,
		isBrowserOperatorUi,
		isWebchat,
		clientMode: connectParams.client.mode
	});
	const boundBootstrapProfile = authMethod === "bootstrap-token" && bootstrapTokenCandidate && (reason === "not-paired" && !existingPairedDevice && (isSetupCodeMobileNodeConnect || isControlUi && role === "operator") || reason === "scope-upgrade" && Boolean(existingPairedDevice) && (isSetupCodeMobileNodeConnect || isControlUi && role === "operator")) ? await getBoundDeviceBootstrapProfile({
		token: bootstrapTokenCandidate,
		deviceId: params.deviceId,
		publicKey: params.devicePublicKey
	}) : null;
	const allowSetupCodeHandoffBootstrapPairing = boundBootstrapProfile !== null && isSetupCodeMobileNodeConnect && isSetupCodeHandoffBootstrapClient({
		profile: boundBootstrapProfile,
		client: connectParams.client
	});
	const setupCodeHandoffBootstrapProfile = allowSetupCodeHandoffBootstrapPairing ? boundBootstrapProfile : null;
	const allowControlUiOwnerBootstrapPairing = reason === "scope-upgrade" && isControlUiOwnerBootstrapProfile({
		profile: boundBootstrapProfile,
		requestedScopes: scopes
	});
	const allowControlUiOperatorBootstrapPairing = reason === "not-paired" && isControlUiOperatorBootstrapProfile({
		profile: boundBootstrapProfile,
		requestedScopes: scopes
	}) || allowControlUiOwnerBootstrapPairing;
	const controlUiOperatorBootstrapProfile = allowControlUiOperatorBootstrapPairing ? boundBootstrapProfile : null;
	const bootstrapPairingRoles = setupCodeHandoffBootstrapProfile ? uniqueStrings([role, ...setupCodeHandoffBootstrapProfile.roles]) : controlUiOperatorBootstrapProfile ? ["operator"] : void 0;
	const bootstrapPairingScopes = setupCodeHandoffBootstrapProfile ? resolveBootstrapProfileScopesForRoles(bootstrapPairingRoles ?? [], setupCodeHandoffBootstrapProfile.scopes, setupCodeHandoffBootstrapProfile.purpose) : controlUiOperatorBootstrapProfile ? resolveBootstrapProfileScopesForRole("operator", controlUiOperatorBootstrapProfile.scopes, controlUiOperatorBootstrapProfile.purpose) : void 0;
	return {
		silent: localApproval !== null || allowSetupCodeHandoffBootstrapPairing || allowControlUiOperatorBootstrapPairing,
		localApproval,
		trustedProxyAutoApproveScopes,
		trustedProxyUser,
		isTrustedProxySameKeyUpgrade,
		allowSetupCodeHandoffBootstrapPairing,
		allowControlUiOwnerBootstrapPairing,
		bootstrapApprovalProfile: setupCodeHandoffBootstrapProfile ?? controlUiOperatorBootstrapProfile,
		bootstrapPairingRoles,
		bootstrapPairingScopes
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-device-pairing.ts
async function authorizeGatewayConnectDevice(context, state) {
	const { connId, buildRequestContext, close, send, setHandshakeState, setCloseCause, logGateway, requestOrigin } = context.handler;
	const { frame, connectParams, configSnapshot, reportedClientIp, reportedClientIpSource, hasBrowserOriginHeader } = context;
	let { scopes } = state;
	let { handoffBootstrapProfile } = state;
	const { role, device, devicePublicKey, authMethod, authResult, hasRequestedScopes, skipLocalBackendSelfPairing, controlUiPairingKind } = state;
	const isConnectAuthorizationCurrent = () => resolveGatewayConnectPolicyFailure(context, state) === void 0;
	const failPairingHandshake = (params) => {
		const { message, details, closeCause, closeReason } = params;
		setHandshakeState("failed");
		if (closeCause) setCloseCause(closeCause.cause, closeCause.meta);
		send({
			type: "res",
			id: frame.id,
			ok: false,
			error: errorShape(ErrorCodes.NOT_PAIRED, message, details ? { details } : void 0)
		});
		close(1008, truncateCloseReason(closeReason ?? message));
	};
	const roleConfiguredHumanOperator = role === "operator" && Boolean(configSnapshot.gateway?.roles);
	if (roleConfiguredHumanOperator && !(authMethod === "token" || authMethod === "password") && !authResult.user?.trim()) {
		failPairingHandshake({
			message: "operator role policies require a verified user identity for this authentication method; reconnect through the trusted proxy or Tailscale, or use the shared gateway token/password",
			details: { code: ConnectErrorDetailCodes.AUTH_VERIFIED_USER_REQUIRED }
		});
		return;
	}
	let hasServerApprovedDeviceTokenBaseline = false;
	let pairedClientId;
	let pairedBrowserOrigin;
	connectParams.client = normalizeNodeHostCompatibilityMetadata(connectParams.client);
	const browserCopilotOrigin = isBrowserCopilotClient(connectParams.client) ? normalizeChromeExtensionOrigin(requestOrigin) : void 0;
	if (device && devicePublicKey) {
		const formatAuditList = (items) => normalizeSortedUniqueTrimmedStringList(items).join(",") || "<none>";
		const logUpgradeAudit = (reason, currentRoles, currentScopes) => logGateway.warn(`security audit: device access upgrade requested reason=${reason} device=${device.id} ip=${reportedClientIp ?? "unknown-ip"} auth=${authMethod} roleFrom=${formatAuditList(currentRoles)} roleTo=${role} scopesFrom=${formatAuditList(currentScopes)} scopesTo=${formatAuditList(scopes)} client=${connectParams.client.id} conn=${connId}`);
		const clientPairingMetadata = {
			displayName: connectParams.client.displayName,
			platform: connectParams.client.platform,
			deviceFamily: connectParams.client.deviceFamily,
			clientId: connectParams.client.id,
			clientMode: connectParams.client.mode,
			...browserCopilotOrigin ? { browserOrigin: browserCopilotOrigin } : {},
			role,
			scopes,
			remoteIp: reportedClientIp
		};
		const clientAccessMetadata = {
			displayName: connectParams.client.displayName,
			remoteIp: reportedClientIp,
			lastSeenAtMs: Date.now(),
			lastSeenReason: "connect"
		};
		const requirePairing = async (reason, existingPairedDevice = null) => {
			const pairingStateAllowsRequestedAccess = (pairedCandidate, requestedScopes = scopes) => pairedCandidate?.publicKey === devicePublicKey && hasEffectivePairedDeviceRole(pairedCandidate, role) && roleScopesAllow({
				role,
				requestedScopes,
				allowedScopes: resolvePairedAccessScopes(pairedCandidate)
			});
			const pairingPlanParams = {
				reason,
				existingPairedDevice,
				state,
				connectParams,
				configSnapshot,
				hasBrowserOriginHeader,
				reportedClientIp,
				reportedClientIpSource,
				deviceId: device.id,
				devicePublicKey,
				scopes,
				hasRequestedScopes,
				connectionScopeCap: (capped) => applyConnectionScopeCap({
					scopes: capped,
					upgradeReq: context.handler.upgradeReq
				})
			};
			const plan = await resolvePairingApprovalPlan(pairingPlanParams);
			if (reason === "scope-upgrade" && plan.isTrustedProxySameKeyUpgrade && plan.trustedProxyAutoApproveScopes !== null) {
				const livePaired = await getPairedDevice(device.id);
				if (livePaired && pairingStateAllowsRequestedAccess(livePaired, plan.trustedProxyAutoApproveScopes)) {
					const livePairedScopes = resolvePairedAccessScopes(livePaired);
					scopes = normalizeSortedUniqueTrimmedStringList([...scopes, ...plan.trustedProxyAutoApproveScopes].filter((scope) => roleScopesAllow({
						role,
						requestedScopes: [scope],
						allowedScopes: livePairedScopes
					})));
					connectParams.scopes = scopes;
					return true;
				}
			}
			if (reason === "role-upgrade" || reason === "scope-upgrade") logUpgradeAudit(reason, existingPairedDevice ? listEffectivePairedDeviceRoles(existingPairedDevice) : void 0, existingPairedDevice ? resolvePairedAccessScopes(existingPairedDevice) : void 0);
			const pairing = await requestDevicePairing({
				deviceId: device.id,
				publicKey: devicePublicKey,
				...clientPairingMetadata,
				scopes,
				...plan.bootstrapPairingRoles ? {
					roles: plan.bootstrapPairingRoles,
					scopes: plan.bootstrapPairingScopes ?? []
				} : {},
				silent: plan.silent
			});
			const trustedProxyApprovalScopes = pairing.request.isRepair !== true || plan.isTrustedProxySameKeyUpgrade ? plan.trustedProxyAutoApproveScopes : null;
			const requestContext = buildRequestContext();
			const supersededResolvedAt = Date.now();
			for (const superseded of pairing.superseded ?? []) requestContext.broadcast("device.pair.resolved", {
				requestId: superseded.requestId,
				deviceId: superseded.deviceId,
				decision: "rejected",
				ts: supersededResolvedAt
			}, { dropIfSlow: true });
			let approved;
			const resolveLivePendingRequestId = async () => {
				const pendingList = await listDevicePairing();
				const exactPending = pendingList.pending.find((pending) => pending.requestId === pairing.request.requestId);
				if (exactPending) return exactPending.requestId;
				return pendingList.pending.find((pending) => pending.deviceId === device.id && pending.publicKey === devicePublicKey)?.requestId;
			};
			const inlineApprovalAttempted = trustedProxyApprovalScopes !== null || pairing.request.silent === true;
			if (inlineApprovalAttempted) {
				if (trustedProxyApprovalScopes !== null) approved = await approveDevicePairing(pairing.request.requestId, {
					callerScopes: trustedProxyApprovalScopes,
					accessMetadata: clientAccessMetadata,
					approvedVia: "trusted-proxy",
					autoApproveNewDeviceScopes: trustedProxyApprovalScopes,
					isApprovalCurrent: isConnectAuthorizationCurrent
				});
				else if (plan.bootstrapApprovalProfile) approved = await approveBootstrapDevicePairing(pairing.request.requestId, plan.bootstrapApprovalProfile, {
					accessMetadata: clientAccessMetadata,
					isApprovalCurrent: isConnectAuthorizationCurrent,
					onTokensReplaced: (deviceId, roles) => retireDeviceTokenClients(requestContext, deviceId, roles, "device-token-rotated")
				});
				else if (plan.localApproval) approved = await approveDevicePairing(pairing.request.requestId, {
					callerScopes: uniqueStrings([...scopes, ...existingPairedDevice ? resolvePairedAccessScopes(existingPairedDevice) : []]),
					accessMetadata: clientAccessMetadata,
					approvedVia: plan.localApproval,
					isApprovalCurrent: ({ pending, existing }) => {
						const currentConfig = getRuntimeConfigSnapshot();
						if (!currentConfig || !isConnectAuthorizationCurrent() || pending.deviceId !== device.id || pending.publicKey !== devicePublicKey || plan.localApproval === "trusted-cidr" && !isScopelessNodePairingRequest(pending)) return false;
						return resolveLocalPairingApproval({
							...pairingPlanParams,
							configSnapshot: currentConfig,
							existingPairedDevice: existing ?? null,
							scopes: pending.scopes ?? []
						}) === plan.localApproval;
					}
				});
				if (approved?.status === "approved") {
					if (trustedProxyApprovalScopes !== null) {
						scopes = trustedProxyApprovalScopes;
						connectParams.scopes = scopes;
					}
					if (plan.bootstrapApprovalProfile) handoffBootstrapProfile = plan.bootstrapApprovalProfile;
					if (trustedProxyApprovalScopes !== null && plan.trustedProxyUser) logGateway.warn(`security audit: trusted-proxy operator device auto-approved user=${formatForLog(plan.trustedProxyUser)} device=${formatForLog(approved.device.deviceId.slice(0, 12))} scopes=${formatAuditList(scopes)}`);
					else logGateway.info(`device pairing auto-approved device=${approved.device.deviceId} role=${approved.device.role ?? "unknown"}`);
					requestContext.broadcast("device.pair.resolved", {
						requestId: pairing.request.requestId,
						deviceId: approved.device.deviceId,
						decision: "approved",
						ts: Date.now()
					}, { dropIfSlow: true });
					if (!plan.allowSetupCodeHandoffBootstrapPairing) try {
						await pruneSupersededSilentPairingsAfterApproval({
							deviceId: approved.device.deviceId,
							context: requestContext
						});
					} catch (error) {
						logGateway.warn(`device pairing prune failed device=${approved.device.deviceId} error=${String(error)}`);
					}
				}
			} else if (pairing.created) requestContext.broadcast("device.pair.requested", pairing.request, { dropIfSlow: true });
			const sshVerifyStarted = startGatewayNodePairingSshApproval({
				context,
				state: {
					...state,
					scopes,
					handoffBootstrapProfile
				},
				pairing,
				existingPairedDevice,
				devicePublicKey,
				clientAccessMetadata,
				reason
			});
			const recoveryRequestId = await resolveLivePendingRequestId();
			const livePaired = await getPairedDevice(device.id);
			const liveMetadata = resolvePinnedClientMetadata({
				clientId: connectParams.client.id,
				clientMode: connectParams.client.mode,
				claimedPlatform: connectParams.client.platform,
				claimedDeviceFamily: connectParams.client.deviceFamily,
				pairedPlatform: livePaired?.platform,
				pairedDeviceFamily: livePaired?.deviceFamily
			});
			if (!(!liveMetadata.platformMismatch && !liveMetadata.deviceFamilyMismatch && (plan.bootstrapApprovalProfile ? pairedDeviceAllowsBootstrapProfile({
				device: livePaired,
				devicePublicKey,
				profile: plan.bootstrapApprovalProfile
			}) : pairingStateAllowsRequestedAccess(livePaired)))) {
				if (inlineApprovalAttempted && recoveryRequestId === pairing.request.requestId) requestContext.broadcast("device.pair.requested", pairing.request, { dropIfSlow: true });
				const exposeApprovedAccess = existingPairedDevice?.publicKey === devicePublicKey;
				const approvedRoles = exposeApprovedAccess ? listApprovedPairedDeviceRoles(existingPairedDevice) : [];
				const approvedScopes = exposeApprovedAccess ? resolvePairedAccessScopes(existingPairedDevice) : [];
				const retryAfterBootstrapPairingApproval = authMethod === "bootstrap-token" && reason === "not-paired" && role === "node" && scopes.length === 0 && !existingPairedDevice;
				const retryWhileControlUiApprovalPending = state.isControlUi && role === "operator" && Boolean(recoveryRequestId);
				const retryWhileApprovalPending = retryAfterBootstrapPairingApproval || sshVerifyStarted || retryWhileControlUiApprovalPending;
				failPairingHandshake({
					message: buildPairingConnectErrorMessage(reason),
					details: buildPairingConnectErrorDetails({
						reason,
						requestId: recoveryRequestId,
						...retryWhileApprovalPending ? {
							recommendedNextStep: "wait_then_retry",
							retryable: true,
							pauseReconnect: false
						} : {},
						deviceId: device.id,
						requestedRole: role,
						requestedScopes: scopes,
						...approvedRoles.length > 0 ? { approvedRoles } : {},
						...approvedScopes.length > 0 ? { approvedScopes } : {}
					}),
					closeCause: {
						cause: "pairing-required",
						meta: {
							deviceId: device.id,
							...recoveryRequestId ? { requestId: recoveryRequestId } : {},
							reason
						}
					},
					closeReason: buildPairingConnectCloseReason({
						reason,
						requestId: recoveryRequestId
					})
				});
				return false;
			}
			pairedClientId = livePaired?.clientId;
			pairedBrowserOrigin = livePaired?.browserOrigin;
			return true;
		};
		const paired = await getPairedDevice(device.id);
		const isPaired = paired?.publicKey === devicePublicKey;
		if (state.startupPending && !isStartupNodeBootstrapConnect(connectParams) && (!paired || !isPaired || !hasEffectivePairedDeviceRole(paired, "node") || !paired.nodeSurface)) {
			await rejectGatewayStartupConnect(context);
			return;
		}
		if (skipLocalBackendSelfPairing || controlUiPairingKind === "auth-none") {
			if (isPaired) {
				pairedClientId = paired.clientId;
				pairedBrowserOrigin = paired.browserOrigin;
				hasServerApprovedDeviceTokenBaseline = true;
				await updatePairedDeviceMetadata(device.id, clientAccessMetadata);
			} else if (controlUiPairingKind === "auth-none" || skipLocalBackendSelfPairing && authMethod !== "device-token") hasServerApprovedDeviceTokenBaseline = true;
		} else if (!isPaired) {
			if (controlUiPairingKind === null) {
				if (!await requirePairing("not-paired", paired)) return;
				hasServerApprovedDeviceTokenBaseline = true;
			} else hasServerApprovedDeviceTokenBaseline = true;
		} else {
			pairedClientId = paired.clientId;
			pairedBrowserOrigin = paired.browserOrigin;
			hasServerApprovedDeviceTokenBaseline = true;
			const existingDevice = await authorizeExistingGatewayDevice({
				context,
				state: {
					...state,
					scopes,
					handoffBootstrapProfile
				},
				paired,
				devicePublicKey,
				clientAccessMetadata,
				handoffBootstrapProfile,
				requirePairing
			});
			if (!existingDevice.ok) return;
			handoffBootstrapProfile = existingDevice.handoffBootstrapProfile;
		}
	}
	const browserCopilotIdentityMismatch = pairedClientId !== connectParams.client.id && (isBrowserCopilotClient(connectParams.client) || isBrowserCopilotClient({ id: pairedClientId }));
	const browserCopilotOriginMismatch = isBrowserCopilotClient(connectParams.client) && (!pairedBrowserOrigin || !browserCopilotOrigin || pairedBrowserOrigin !== browserCopilotOrigin);
	if (browserCopilotIdentityMismatch || browserCopilotOriginMismatch) {
		failPairingHandshake({ message: "browser copilot requires a dedicated paired device identity" });
		return;
	}
	const { deviceToken, bootstrapDeviceTokens } = roleConfiguredHumanOperator && authResult.user?.trim() ? {
		deviceToken: null,
		bootstrapDeviceTokens: []
	} : await issueGatewayConnectDeviceTokens({
		state: {
			...state,
			scopes,
			handoffBootstrapProfile
		},
		scopes,
		hasApprovedDeviceBaseline: hasServerApprovedDeviceTokenBaseline,
		isIssuanceCurrent: isConnectAuthorizationCurrent
	});
	return {
		...state,
		scopes,
		handoffBootstrapProfile,
		deviceToken,
		bootstrapDeviceTokens
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-model-catalog.ts
/** Bootstrap uses ordinary request admission and delivery authority, including deferred identity. */
async function publishConnectModelCatalog(handler, dispatcher) {
	const client = handler.getClient();
	const requestedScope = client?.connect.modelCatalog;
	if (client?.connect.client.id !== GATEWAY_CLIENT_IDS.CONTROL_UI || !hasGatewayClientCap(client.connect.caps, GATEWAY_CLIENT_CAPS.MODEL_CATALOG_SNAPSHOT) || !requestedScope) return;
	let scope;
	if ("shortId" in requestedScope) {
		const resolveRequest = {
			type: "req",
			id: `catalog-session:${handler.connId}`,
			method: "sessions.resolve",
			params: requestedScope
		};
		const resolution = {};
		await dispatcher.dispatch(resolveRequest, client, Buffer.byteLength(JSON.stringify(resolveRequest)), void 0, (frame) => {
			if (!frame.ok) return handler.send(frame);
			resolution.value = frame.payload;
			return { kind: "sent" };
		});
		const resolved = resolution.value;
		if (!resolved?.ok) return;
		scope = {
			agentId: resolved.agentId,
			sessionKey: resolved.key
		};
	} else if (requestedScope.sessionKey) scope = requestedScope;
	else {
		const cfg = handler.buildRequestContext().getRuntimeConfig();
		const requestedAgentId = requestedScope.agentId ? normalizeAgentId(requestedScope.agentId) : void 0;
		scope = { agentId: requestedAgentId && listAgentIds(cfg).includes(requestedAgentId) ? requestedAgentId : resolveGatewayAgentSelectionState(cfg).defaultId };
	}
	const request = {
		type: "req",
		id: `catalog:${handler.connId}`,
		method: "models.list",
		params: {
			...scope,
			view: "configured"
		}
	};
	return dispatcher.dispatch(request, client, Buffer.byteLength(JSON.stringify(request)), void 0, (frame) => handler.send(frame.ok ? {
		type: "event",
		event: "models.snapshot",
		payload: {
			target: requestedScope,
			scope,
			catalog: frame.payload
		}
	} : frame));
}
//#endregion
//#region src/gateway/control-ui-identity.ts
/** Advertise browser identity at the ingress that actually authenticates people. */
function resolveControlUiIdentity(cfg, auth) {
	if (cfg.gateway?.controlUi?.enabled === false) return;
	let origin;
	let signal;
	if (auth.mode === "trusted-proxy") origin = resolveGatewayPublicOrigin(cfg);
	else if (auth.mode !== "none" && auth.allowTailscale) {
		const published = getTailscalePublishedOrigin();
		if (published?.mode === "serve") {
			origin = published.origin;
			signal = published.signal;
		}
	}
	if (!origin?.startsWith("https://")) return;
	return {
		url: `${origin}${normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath)}/`,
		signal
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-hello.ts
async function sendGatewayHello(context, state, pluginSurfaceUrls, authenticatedUserProfileId) {
	const { connId, bootId, nodeReapprovalCoordinator, gatewayMethods, events, buildRequestContext, refreshHealthSnapshot, close, advanceHandshakePhase, setCloseCause, logGateway, logHealth } = context.handler;
	const { frame, connectParams, sendFrame, onHelloDelivered, pendingNodePairingCleanup, releasePendingNodePairingCleanup } = context;
	const { resolvedAuth, role, scopes, device, devicePublicKey, hasTokenAuth, hasPasswordAuth, bootstrapTokenCandidate, authResult, authMethod, sessionSharedGatewaySessionGeneration, issuedBootstrapProfile, handoffBootstrapProfile, deviceToken, bootstrapDeviceTokens } = state;
	const authenticatedPrincipal = authResult.user ? authenticatedUserProfileId ?? authResult.user : void 0;
	const recoveryScopeMaterial = authenticatedPrincipal ? [
		"principal",
		authenticatedPrincipal,
		device?.id ?? ""
	] : deviceToken?.token ? ["device-token", deviceToken.token] : sessionSharedGatewaySessionGeneration ? [
		"shared-auth",
		sessionSharedGatewaySessionGeneration,
		device?.id ?? ""
	] : device?.id ? ["device", device.id] : void 0;
	const recoveryScope = role === "operator" && recoveryScopeMaterial ? sha256Base64Url(JSON.stringify(recoveryScopeMaterial)) : void 0;
	const canMigrateRecovery = role === "operator" && !authenticatedPrincipal && Boolean(deviceToken);
	const snapshot = buildGatewaySnapshot({
		client: context.handler.getClient(),
		includeSensitive: scopes.includes(ADMIN_SCOPE),
		includeUpdateDetails: canReadDetailedUpdateMetadata(role, scopes),
		revisionProjector: buildRequestContext().configRevisionProjector
	});
	const cachedHealth = getHealthCache();
	if (cachedHealth) {
		snapshot.health = cachedHealth;
		snapshot.stateVersion.health = getHealthVersion();
	}
	const controlUiTabs = listControlUiPluginTabs(scopes, { requireGatewayAuthGrant: resolvedAuth.mode !== "none" });
	const controlUiWidgetKinds = listControlUiPluginWidgetKinds(scopes);
	const controlUiLinkReaders = listControlUiLinkReaders(scopes, buildRequestContext().getGatewayMethodRegistry?.());
	const controlUiLocation = resolveControlUiLinkLocation(context.configSnapshot);
	const controlUiBuildSource = context.configSnapshot.gateway?.controlUi?.root ? "configured" : "bundled";
	const serverBuildId = resolveRuntimeServiceBuildId();
	const helloOk = {
		type: "hello-ok",
		protocol: 4,
		server: {
			version: resolveRuntimeServiceVersion(process.env),
			...serverBuildId ? { buildId: serverBuildId } : {},
			bootId,
			controlUiBuildSource,
			connId
		},
		features: {
			methods: resolveBrowserAuthOrigin(context.browserOrigin, new AbortController().signal) ? gatewayMethods : gatewayMethods.filter((method) => method !== "mcp.authLogin"),
			events,
			capabilities: [
				GATEWAY_SERVER_CAPS.BOARD_WIDGET_PUT_CANVAS_DOC,
				GATEWAY_SERVER_CAPS.CHAT_SEND_ROUTING_CONTRACT,
				GATEWAY_SERVER_CAPS.GATEWAY_RESTART_TARGET_SAFE,
				GATEWAY_SERVER_CAPS.MODEL_CATALOG_SNAPSHOT,
				GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_RETENTION,
				GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_STATUS,
				GATEWAY_SERVER_CAPS.NODE_WORKER_CAPTURED_EXEC_POLICY,
				GATEWAY_SERVER_CAPS.NODE_WORKER_ENVIRONMENT_SESSION,
				GATEWAY_SERVER_CAPS.NODE_WORKER_PORTAL_STREAM,
				GATEWAY_SERVER_CAPS.PROFILE_BINDING,
				GATEWAY_SERVER_CAPS.PUBLISHED_MODEL_CATALOG,
				GATEWAY_SERVER_CAPS.PROGRESS_CARD_AGENT_SCOPE,
				GATEWAY_SERVER_CAPS.SESSION_SCOPED_CHAT_METADATA,
				GATEWAY_SERVER_CAPS.SESSION_SCOPED_MODEL_CATALOG,
				GATEWAY_SERVER_CAPS.SESSION_UNREAD_ACK_CONTRACT,
				GATEWAY_SERVER_CAPS.SESSION_GOAL_START,
				GATEWAY_SERVER_CAPS.SESSION_SETTINGS_CONTRACT,
				GATEWAY_SERVER_CAPS.SESSION_SETTINGS_CAS,
				GATEWAY_SERVER_CAPS.SYSTEM_AGENT_WIZARD_CANCEL,
				GATEWAY_SERVER_CAPS.SYSTEM_AGENT_SETUP_MODEL_REF,
				GATEWAY_SERVER_CAPS.TASK_SUGGESTIONS_ACCEPT_MODES
			]
		},
		snapshot,
		...controlUiLocation ? { controlUiUrl: `${controlUiLocation.origin}${controlUiLocation.basePath}` } : {},
		...controlUiTabs.length > 0 ? { controlUiTabs } : {},
		...controlUiWidgetKinds.length > 0 ? { controlUiWidgetKinds } : {},
		...controlUiLinkReaders.length > 0 ? { controlUiLinkReaders } : {},
		...Object.keys(pluginSurfaceUrls).length > 0 ? { pluginSurfaceUrls } : {},
		auth: {
			method: authMethod,
			role,
			scopes,
			...recoveryScope ? { recoveryScope } : {},
			...canMigrateRecovery ? { recoveryMigrationAllowed: true } : {},
			...deviceToken ? {
				deviceToken: deviceToken.token,
				issuedAtMs: deviceToken.rotatedAtMs ?? deviceToken.createdAtMs,
				...bootstrapDeviceTokens.length > 1 ? { deviceTokens: bootstrapDeviceTokens.slice(1) } : {}
			} : {}
		},
		policy: {
			maxPayload: MAX_PAYLOAD_BYTES,
			maxBufferedBytes: MAX_BUFFERED_BYTES,
			tickIntervalMs: TICK_INTERVAL_MS,
			attachments: resolveChatAttachmentPolicy(context.configSnapshot),
			allowedSessionVisibilities: allowedSessionVisibilities(context.configSnapshot),
			hasMultipleSessionSharingIdentities: hasMultipleSessionSharingIdentities()
		}
	};
	advanceHandshakePhase("hello_payload_prepared");
	let bootstrapHandoff;
	if (authMethod === "bootstrap-token" && bootstrapTokenCandidate && device) try {
		if (handoffBootstrapProfile || issuedBootstrapProfile) {
			const redemption = await redeemDeviceBootstrapTokenProfile({
				token: bootstrapTokenCandidate,
				role,
				scopes
			});
			if (handoffBootstrapProfile || redemption.fullyRedeemed) {
				const consumed = await consumeSetupHandoff({
					token: bootstrapTokenCandidate,
					deviceId: device.id,
					pairedDeviceMatches: (paired) => paired?.publicKey === devicePublicKey
				});
				if (!consumed) {
					await releasePendingNodePairingCleanup();
					setCloseCause("bootstrap-token-consume-failed");
					close();
					return;
				}
				bootstrapHandoff = consumed;
			}
		}
	} catch (err) {
		logGateway.warn(`bootstrap token post-connect bookkeeping failed device=${device.id}: ${formatForLog(err)}`);
		await releasePendingNodePairingCleanup();
		setCloseCause("bootstrap-token-consume-failed", { error: formatForLog(err) });
		close();
		return;
	}
	try {
		if (role === "operator") {
			const identity = resolveControlUiIdentity(context.configSnapshot, resolvedAuth);
			if (identity) {
				snapshot.controlUiIdentityUrl = identity.url;
				if (identity.signal && !context.handler.isClosed()) {
					const signal = identity.signal;
					const withdraw = () => {
						setCloseCause("browser-identity-route-withdrawn");
						close(1012, "browser identity route changed");
					};
					signal.addEventListener("abort", withdraw, { once: true });
					context.handler.socket.once("close", () => signal.removeEventListener("abort", withdraw));
				}
			}
		}
		snapshot.suspension = { phase: getGatewaySuspendAdmissionPhase() };
		await sendFrame({
			type: "res",
			id: frame.id,
			ok: true,
			payload: helloOk
		});
		onHelloDelivered();
	} catch (err) {
		if (bootstrapHandoff) {
			if (bootstrapHandoff.completion) try {
				broadcastSetupHandoffDeliveryUncertain({
					handoff: bootstrapHandoff,
					broadcast: buildRequestContext().broadcast
				});
			} catch (broadcastError) {
				logGateway.warn(`setup delivery-uncertain broadcast failed device=${device?.id ?? "unknown"}: ${formatForLog(broadcastError)}`);
			}
			else try {
				await restoreGenericDeviceBootstrapToken({ record: bootstrapHandoff.record });
			} catch (restoreError) {
				logGateway.warn(`generic bootstrap token restore after hello-send failure failed device=${device?.id ?? "unknown"}: ${formatForLog(restoreError)}`);
			}
		}
		await releasePendingNodePairingCleanup();
		setCloseCause("hello-send-failed", { error: formatForLog(err) });
		close();
		return;
	}
	if (bootstrapHandoff) try {
		const confirmedHandoff = await confirmSetupHandoffDelivery({ handoff: bootstrapHandoff });
		if (confirmedHandoff) broadcastSetupHandoffCompletion({
			handoff: confirmedHandoff,
			broadcast: buildRequestContext().broadcast
		});
		else broadcastSetupHandoffDeliveryUncertain({
			handoff: bootstrapHandoff,
			broadcast: buildRequestContext().broadcast
		});
	} catch (err) {
		logGateway.warn(`setup completion confirmation failed device=${device?.id ?? "unknown"}: ${formatForLog(err)}`);
		try {
			broadcastSetupHandoffDeliveryUncertain({
				handoff: bootstrapHandoff,
				broadcast: buildRequestContext().broadcast
			});
		} catch {}
	}
	let authProvided = authMethod;
	if (authMethod !== "device-token" && authMethod !== "bootstrap-token") {
		if (hasPasswordAuth) authProvided = "password";
		else if (hasTokenAuth) authProvided = "token";
	}
	emitGatewayAuthSecurityEvent({
		action: "gateway.auth.succeeded",
		outcome: "success",
		severity: "low",
		authMode: resolvedAuth.mode,
		authMethod,
		authProvided,
		role,
		scopes,
		clientMode: connectParams.client.mode,
		deviceId: device?.id
	});
	advanceHandshakePhase("ready");
	if (role === "node") {
		const requestContext = buildRequestContext();
		const nodeId = connectParams.device?.id ?? connectParams.client.id;
		const nodeSession = requestContext.nodeRegistry.get(nodeId);
		const pairingGeneration = nodeSession?.pairingGeneration;
		if (nodeSession?.connId === connId && pairingGeneration) try {
			const connection = await recordPairedNodeConnection(nodeSession.nodeId, nodeSession.connectedAtMs, void 0, {
				nodeId: nodeSession.nodeId,
				key: pairingGeneration
			});
			if (!connection.recorded) logGateway.warn(`failed to record last connect for ${nodeSession.nodeId}: not paired`);
			else {
				const currentSession = requestContext.nodeRegistry.getForPairingGeneration(nodeSession.nodeId, pairingGeneration);
				if (currentSession) scheduleNodeConnectionNotification(requestContext.nodeRegistry, currentSession, { isFirstConnection: connection.firstConnection });
			}
		} catch (err) {
			logGateway.warn(`failed to record last connect for ${nodeSession.nodeId}: ${formatForLog(err)}`);
		}
	}
	if (pendingNodePairingCleanup.value) {
		const requestContext = buildRequestContext();
		const cleanupClaim = pendingNodePairingCleanup.value;
		pendingNodePairingCleanup.value = void 0;
		try {
			const resolvedPairings = nodeReapprovalCoordinator ? await nodeReapprovalCoordinator.finalizeCleanup(cleanupClaim) : await finalizeNodePairingCleanupClaim(cleanupClaim);
			const resolvedAt = Date.now();
			for (const resolved of resolvedPairings) requestContext.broadcast("node.pair.resolved", {
				requestId: resolved.requestId,
				nodeId: resolved.nodeId,
				decision: "rejected",
				ts: resolvedAt
			}, { dropIfSlow: true });
		} catch (error) {
			logGateway.warn(`failed to clear stale pending pairings for ${cleanupClaim.nodeId}: ${formatForLog(error)}`);
		}
	}
	logWs("out", "hello-ok", {
		connId,
		methods: gatewayMethods.length,
		events: events.length,
		presence: snapshot.presence.length,
		stateVersion: snapshot.stateVersion.presence
	});
	if (shouldScheduleBackgroundHealthRefresh(refreshHealthSnapshot, Date.now())) refreshHealthSnapshot({ probe: false }).catch((err) => logHealth.error(`post-connect health refresh failed: ${formatErrorMessage(err)}`));
	const client = context.handler.getClient();
	if (client?.presenceKey && !client.invalidated && client.socket.readyState === 1 && !context.handler.isClosed()) broadcastPresenceSnapshot(buildRequestContext());
}
//#endregion
//#region src/gateway/server/ws-connection/connect-node-session.ts
var NodePairingRateLimitError = class extends Error {
	constructor(retryAfterMs) {
		super("node pairing rate limited");
		this.retryAfterMs = retryAfterMs;
	}
};
async function requestNodePairingFromConnect(params) {
	if (params.pairedReconnect) return params.reapprovalCoordinator ? await params.reapprovalCoordinator.request({
		input: params.input,
		cleanupClaim: params.cleanupClaim
	}) : await requestNodePairing(params.input);
	if (!params.rateLimiter) return await requestNodePairing(params.input);
	return await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING,
		run: async () => {
			const rateCheck = params.rateLimiter?.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING);
			if (rateCheck && !rateCheck.allowed) throw new NodePairingRateLimitError(rateCheck.retryAfterMs);
			const result = await requestNodePairing(params.input);
			params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_NODE_PAIRING);
			return result;
		}
	});
}
async function prepareGatewayNodeConnect(context, state) {
	if (state.role !== "node") return true;
	const { pluginNodeCapabilities = [], nodeReapprovalCoordinator, buildRequestContext, logGateway } = context.handler;
	const { connectParams, reportedClientIp, authRateLimiter, browserRateLimitClientIp, pendingNodePairingCleanup, releasePendingNodePairingCleanup, broadcastNodePairingResult } = context;
	const { device, devicePublicKey, usesLegacyNodeProtocol, rejectUnauthorized } = state;
	const nodeId = connectParams.device?.id ?? connectParams.client.id;
	const nodePairingSnapshot = await beginNodePairingConnect(nodeId);
	const pairedNode = nodePairingSnapshot.pairedNode;
	pendingNodePairingCleanup.value = nodePairingSnapshot.cleanupClaim;
	const pairedDeviceForSurface = device && devicePublicKey ? await getPairedDevice(device.id) : null;
	const deviceApprovedVia = pairedDeviceForSurface?.publicKey === devicePublicKey ? pairedDeviceForSurface?.approvedVia : void 0;
	const deviceApprovedNonInteractively = deviceApprovedVia === "silent" || deviceApprovedVia === "ssh-verified" || deviceApprovedVia === "bootstrap";
	let reconciliation;
	try {
		reconciliation = await reconcileNodePairingOnConnect({
			cfg: getRuntimeConfig(),
			connectParams,
			pairedNode,
			reportedClientIp,
			initialSurfaceSilent: deviceApprovedNonInteractively,
			requestPairing: async (input) => {
				return await requestNodePairingFromConnect({
					input,
					rateLimiter: authRateLimiter,
					clientIp: browserRateLimitClientIp,
					pairedReconnect: pairedNode !== null,
					cleanupClaim: pendingNodePairingCleanup.value,
					reapprovalCoordinator: nodeReapprovalCoordinator
				});
			}
		});
	} catch (error) {
		await releasePendingNodePairingCleanup();
		if (error instanceof NodePairingRateLimitError) {
			rejectUnauthorized({
				ok: false,
				reason: "rate_limited",
				rateLimited: true,
				retryAfterMs: error.retryAfterMs
			});
			return false;
		}
		throw error;
	}
	if ((deviceApprovedVia === "ssh-verified" || deviceApprovedVia === "bootstrap") && !pairedNode && reconciliation.pendingPairing) {
		const surfaceRequestId = reconciliation.pendingPairing.request.requestId;
		const approvedSurface = await approveNodePairing(surfaceRequestId, { callerScopes: [
			ADMIN_SCOPE,
			PAIRING_SCOPE,
			WRITE_SCOPE
		] });
		if (approvedSurface && "node" in approvedSurface) {
			logGateway.info(`security audit: node capability surface ${deviceApprovedVia} auto-approve node=${reconciliation.nodeId} commands=${reconciliation.declaredCommands.join(",") || "<none>"}`);
			buildRequestContext().broadcast("node.pair.resolved", {
				requestId: surfaceRequestId,
				nodeId: reconciliation.nodeId,
				decision: "approved",
				ts: Date.now()
			}, { dropIfSlow: true });
			reconciliation = {
				...reconciliation,
				effectiveCaps: reconciliation.declaredCaps,
				effectiveCommands: reconciliation.declaredCommands,
				effectivePermissions: reconciliation.declaredPermissions,
				pendingPairing: void 0,
				shouldClearPendingPairings: true
			};
		}
	}
	if (!reconciliation.shouldClearPendingPairings) await releasePendingNodePairingCleanup();
	if (reconciliation.pendingPairing) broadcastNodePairingResult(reconciliation.pendingPairing);
	const nodeConnectParams = connectParams;
	nodeConnectParams.declaredCaps = reconciliation.declaredCaps;
	nodeConnectParams.declaredCommands = reconciliation.declaredCommands;
	nodeConnectParams.withheldCommands = reconciliation.withheldCommands;
	nodeConnectParams.declaredComputerUse = reconciliation.declaredComputerUse;
	nodeConnectParams.declaredPermissions = reconciliation.declaredPermissions;
	const pluginSurfaces = pluginNodeCapabilities.map((surface) => surface.surface);
	const declaredFeatures = {
		caps: normalizeNodeApprovalSurfaceList(connectParams.caps),
		commands: normalizeNodeApprovalSurfaceList(connectParams.commands)
	};
	const sessionCeiling = usesLegacyNodeProtocol ? filterLegacyNodeProtocolFeatures({
		...declaredFeatures,
		pluginSurfaces
	}) : declaredFeatures;
	nodeConnectParams.sessionCapsCeiling = sessionCeiling.caps;
	nodeConnectParams.sessionCommandsCeiling = sessionCeiling.commands;
	const effectiveFeatures = usesLegacyNodeProtocol ? filterLegacyNodeProtocolFeatures({
		caps: reconciliation.effectiveCaps,
		commands: reconciliation.effectiveCommands,
		pluginSurfaces
	}) : {
		caps: reconciliation.effectiveCaps,
		commands: reconciliation.effectiveCommands
	};
	connectParams.caps = effectiveFeatures.caps;
	connectParams.commands = effectiveFeatures.commands;
	connectParams.computerUse = resolveEffectiveComputerUseDescriptor({
		commands: effectiveFeatures.commands,
		declared: reconciliation.declaredComputerUse
	});
	connectParams.permissions = reconciliation.effectivePermissions;
	return true;
}
//#endregion
//#region src/gateway/server/ws-connection/connect-operator-access.ts
function prepareGatewayConnectOperatorAccess(client) {
	if (client.connect.role !== "operator" || client.internal?.operatorRoleActor?.kind === "system") return;
	const profile = client.authenticatedUserProfile;
	const config = getRuntimeConfig();
	if (hasGatewayOperatorAccessPolicies(config) && !profile) throw new GatewayOperatorAccessDeniedError();
	const operatorAccessAuthority = profile ? resolveGatewayOperatorAccessAuthority(profile.profileId, config) : void 0;
	if (operatorAccessAuthority !== void 0) client.internal = {
		...client.internal,
		operatorAccessAuthority
	};
}
async function rejectGatewayConnectOperatorAccess(context) {
	context.markHandshakeFailure("operator-access-denied");
	context.sendHandshakeErrorResponse(ErrorCodes.FORBIDDEN, GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE);
	await context.releasePendingNodePairingCleanup();
	context.handler.close(1008, GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE);
}
/** Attach only this connection to the grant; disconnect never closes the retained authority. */
function bindGatewayConnectOperatorAccess(context, client) {
	const authority = client.internal?.operatorAccessAuthority;
	if (!authority) return true;
	const revoke = () => {
		context.handler.setCloseCause("operator-access-closed");
		invalidateGatewayPolicyClient(client, {
			reason: "operator-access-closed",
			code: 4001,
			message: GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE,
			close: () => context.handler.close(4001, GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE)
		});
	};
	const release = () => authority.signal.removeEventListener("abort", revoke);
	client.socket.once("close", release);
	authority.signal.addEventListener("abort", revoke, { once: true });
	if (authority.signal.aborted) {
		revoke();
		return false;
	}
	return true;
}
//#endregion
//#region src/gateway/server/ws-connection/connect-user-profile.ts
/** One connection retains its profile authority through admission and later identity refreshes. */
function createGatewayConnectProfileLifecycle(context, state) {
	const { handler } = context;
	let client;
	const rolesCurrent = () => isDeepStrictEqual(context.configSnapshot.gateway?.roles, getRuntimeConfig().gateway?.roles);
	const clientCurrent = () => !handler.isClosed() && handler.socket.readyState === 1 && (!client || handler.getClient() === client && !client.invalidated);
	const assertCurrent = () => {
		handler.connectionWork.signal.throwIfAborted();
		if (!clientCurrent() || resolveGatewayConnectPolicyFailure(context, state) || !rolesCurrent()) throw new Error("Gateway profile acquisition authority expired");
	};
	return {
		assertCurrent,
		isCurrent: (prepared) => (!prepared || prepared.authority.isCurrent()) && rolesCurrent(),
		bind: (registered) => {
			client = registered;
		},
		async attach(profileId, updatedAt, prepareIngress) {
			if (!client || !clientCurrent()) return;
			const registered = client;
			assertCurrent();
			const prepared = await resolveAuthenticatedProfile(profileId, updatedAt, assertCurrent);
			assertCurrent();
			if (client !== registered || !prepared.authority.isCurrent()) throw new Error("Gateway profile changed before attachment");
			const { profile } = prepared;
			registered.preparedRecipientProfileId = void 0;
			if (registered.authenticatedUserProfile) Object.assign(registered.authenticatedUserProfile, profile);
			else registered.authenticatedUserProfile = profile;
			prepareGatewayRecipientProfile(registered, { identity: prepared.recipient });
			attachGatewayLocalUserIngress(registered, prepareIngress(profile));
			const { profileId: id, ...display } = profile;
			handler.buildRequestContext().refreshConnectedUserProfile?.({
				id,
				...display
			});
		}
	};
}
async function resolveAuthenticatedProfile(profileId, updatedAt, assertCurrent) {
	assertCurrent?.();
	const authority = await prepareUserProfileRoleAuthority(profileId);
	assertCurrent?.();
	if (!authority?.isCurrent()) throw new Error("Gateway profile changed during acquisition");
	const { id, displayName, avatarRevision, hasAvatar } = authority.display;
	return {
		profile: {
			profileId: id,
			displayName,
			avatarRevision,
			hasAvatar,
			updatedAt
		},
		authority,
		recipient: {
			profileId: authority.profileId,
			role: authority.role,
			aliases: new Set(authority.aliases)
		}
	};
}
async function resolveGatewayConnectUserProfile(params) {
	params.assertCurrent?.();
	const options = { assertCurrent: params.assertCurrent };
	const ownerDisplayName = params.ownerProfileExpected ? await resolveHostAccountName() : void 0;
	params.assertCurrent?.();
	const profile = params.ownerProfileExpected ? await ensureCanonicalGatewayOwnerProfile(ownerDisplayName ?? null, options) : params.resolveAuthenticatedGitHubIdentity ? await params.resolveAuthenticatedGitHubIdentity() : params.authResult.tailscaleIdentity ? await ensureCanonicalUserProfileForTailscaleIdentity(params.authResult.tailscaleIdentity, options) : await ensureCanonicalUserProfileForEmail(params.authenticatedUserId, options);
	params.assertCurrent?.();
	const resolved = await resolveAuthenticatedProfile("profileId" in profile ? profile.profileId : profile.id, profile.updatedAt, params.assertCurrent);
	params.assertCurrent?.();
	return resolved;
}
/** Role and access policies need verified identity before admission; attribution alone may defer it. */
async function resolveGatewayConnectProfileAdmission(params) {
	const { context, state, ownerProfileExpected, authenticatedUserId } = params;
	const profileRequired = Boolean(context.configSnapshot.gateway?.roles) || hasGatewayOperatorAccessPolicies(context.configSnapshot);
	if (!ownerProfileExpected && (!authenticatedUserId || params.resolveAuthenticatedGitHubIdentity && !profileRequired)) return { ok: true };
	try {
		const prepared = await resolveGatewayConnectUserProfile({
			ownerProfileExpected,
			authenticatedUserId,
			authResult: state.authResult,
			resolveAuthenticatedGitHubIdentity: params.resolveAuthenticatedGitHubIdentity,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent?.();
		if (!prepared.authority.isCurrent()) throw new Error("Gateway profile changed during acquisition");
		return {
			ok: true,
			prepared
		};
	} catch (error) {
		context.handler.logWsControl.warn(`user profile resolution failed conn=${context.handler.connId} user=${formatForLog(authenticatedUserId)}: ${formatForLog(error)}`);
		if (!ownerProfileExpected && profileRequired && state.role === "operator" && state.authMethod !== "token" && state.authMethod !== "password") {
			await rejectUnavailableProfileConnect(context, error);
			return { ok: false };
		}
		return { ok: true };
	}
}
//#endregion
//#region src/gateway/server/ws-connection/control-ui-build-admission.ts
/**
* The Gateway owns bundled same-origin UI admission. Browser code still owns
* reload, but an older document must never become an RPC-capable session.
*
* The exemptions are deliberate, not gaps (ui/AGENTS.md "Gateway Coupling"):
* configured roots serve an independently built artifact the Gateway owns no
* matching build identity for, "dev" is the ui:dev sentinel, and cross-origin
* stays exempt because build ids embed the build timestamp — version-identical
* source-built installs carry different ids, so equality would reject matched
* pairings, and "reload" cannot remediate a client the Gateway did not serve.
* Exempted skew fails visibly at the first missing method instead.
*/
function resolveControlUiBuildMismatch(params) {
	const gatewayBuildId = params.gatewayBuildId?.trim();
	const clientBuildId = params.clientBuildId?.trim();
	if (params.clientId !== GATEWAY_CLIENT_IDS.CONTROL_UI || params.configuredControlUiRoot || !gatewayBuildId || clientBuildId === "dev" || !isGatewayHostBrowserOrigin({
		requestHost: params.requestHost,
		origin: params.requestOrigin
	}) || clientBuildId === gatewayBuildId) return null;
	return {
		gatewayBuildId,
		clientBuildId: clientBuildId || null
	};
}
//#endregion
//#region src/gateway/server/ws-connection/connect-session.ts
async function attachAuthenticatedGatewayConnect(context, state) {
	const { socket, connId, remoteAddr, pluginSurfaceBaseUrl, pluginNodeCapabilities = [], buildRequestContext, close, isClosed, clearHandshakeTimer, setClient, setHandshakeState, advanceHandshakePhase, setCloseCause, logGateway, logWsControl, requestHost, requestOrigin } = context.handler;
	const { connectParams, isLocalClient, reportedClientIp, runDetachedConnectWork, isWebchatConnect, clientLabel, clientMeta, markHandshakeFailure, sendHandshakeErrorResponse, releasePendingNodePairingCleanup } = context;
	const { minProtocol, maxProtocol, usesLegacyNodeProtocol, role, scopes: deviceScopes, device, devicePublicKey, deviceToken, authResult, authMethod, pairingLocality, sessionUsesSharedGatewayAuth, sessionSharedGatewaySessionGeneration } = state;
	if (!await prepareGatewayNodeConnect(context, state)) return;
	let nodePairingAdmission;
	if (role === "node") {
		const nodeId = device?.id ?? connectParams.client.id;
		const authenticatedNodeToken = authMethod === "device-token" ? normalizeOptionalString(connectParams.auth?.deviceToken ?? connectParams.auth?.token) : deviceToken?.token;
		if (!device || !devicePublicKey || !authenticatedNodeToken) {
			const message = "authenticated node pairing identity unavailable";
			markHandshakeFailure("node-pairing-generation-changed", {});
			sendHandshakeErrorResponse(ErrorCodes.NOT_PAIRED, message);
			await releasePendingNodePairingCleanup();
			close(1008, truncateCloseReason(message));
			return;
		}
		const authenticatedNodePairing = {
			nodeId,
			publicKey: devicePublicKey,
			token: authenticatedNodeToken
		};
		const admittedPairingState = await captureAuthenticatedNodePairingState(authenticatedNodePairing);
		if (!admittedPairingState) {
			const message = "node pairing changed during connect";
			markHandshakeFailure("node-pairing-generation-changed", device?.id ? { deviceId: device.id } : {});
			sendHandshakeErrorResponse(ErrorCodes.NOT_PAIRED, message);
			await releasePendingNodePairingCleanup();
			close(1008, truncateCloseReason(message));
			return;
		}
		nodePairingAdmission = {
			...admittedPairingState,
			authenticated: authenticatedNodePairing
		};
	}
	const shouldTrackPresence = !isEphemeralGatewayClient(connectParams.client);
	const clientId = connectParams.client.id;
	const instanceId = connectParams.client.instanceId;
	const presenceKey = shouldTrackPresence ? role === "node" ? device?.id ?? instanceId ?? connId : connId : void 0;
	const authenticatedUserId = normalizeOptionalString(authResult.user);
	const authenticatedUserIsTailscaleProvider = (authResult.tailscaleIdentity ? classifyTailscaleLogin(authResult.tailscaleIdentity.login) : void 0)?.kind === "provider";
	const profileLifecycle = createGatewayConnectProfileLifecycle(context, state);
	const resolveAuthenticatedGitHubIdentity = createAuthenticatedGitHubIdentitySync({
		authResult,
		authConfig: context.configSnapshot.gateway?.auth,
		requestHeaders: context.handler.upgradeReq.headers,
		assertCurrent: profileLifecycle.assertCurrent
	});
	const rolesConfigured = Boolean(context.configSnapshot.gateway?.roles);
	const sharedSecretOperatorOwner = role === "operator" && (authMethod === "token" || authMethod === "password");
	const ownerProfileExpected = shouldTrackPresence && shouldUseGatewayOwnerProfile({
		role,
		authenticatedUserId,
		authMethod,
		rolesConfigured
	});
	const profileAdmission = await resolveGatewayConnectProfileAdmission({
		context,
		state,
		ownerProfileExpected,
		authenticatedUserId,
		resolveAuthenticatedGitHubIdentity,
		assertCurrent: profileLifecycle.assertCurrent
	});
	if (!profileAdmission.ok) return;
	const preparedProfile = profileAdmission.prepared;
	const authenticatedUserProfile = preparedProfile?.profile;
	const effectiveScopes = resolveEffectiveConnectionScopes({
		role,
		deviceScopes,
		verifiedIdentity: authenticatedUserId,
		identityScopes: context.configSnapshot.gateway?.auth?.identityScopes,
		upgradeReq: context.handler.upgradeReq
	});
	const rolePolicy = role === "operator" && !sharedSecretOperatorOwner ? resolveOperatorRolePolicyForAssignment(authenticatedUserProfile?.profileId, preparedProfile?.authority.role ?? null, context.configSnapshot) : void 0;
	const scopes = rolePolicy ? intersectOperatorScopes(effectiveScopes.scopes, rolePolicy.scopes) : effectiveScopes.scopes;
	state.scopes = scopes;
	connectParams.scopes = scopes;
	const addedIdentityScopes = effectiveScopes.addedIdentityScopes.filter((scope) => scopes.includes(scope));
	if (authenticatedUserId && addedIdentityScopes.length > 0) logGateway.warn(`security audit: identity scope grant elevated connection identity=${formatForLog(authenticatedUserId)} addedScopes=${addedIdentityScopes.join(",")} conn=${connId}`);
	if (isClosed()) {
		await releasePendingNodePairingCleanup();
		setCloseCause("connect-aborted-before-register", {
			...clientMeta,
			auth: authMethod
		});
		return;
	}
	const pluginSurfaceUrls = {};
	const pluginNodeCapabilitySurfaces = indexPluginNodeCapabilitySurfaces(pluginNodeCapabilities);
	const pendingPluginNodeCapabilities = [];
	const effectiveNodeCaps = role === "node" ? new Set(connectParams.caps ?? []) : void 0;
	if (pluginSurfaceBaseUrl && !usesLegacyNodeProtocol) for (const pluginCapabilitySurface of Object.values(pluginNodeCapabilitySurfaces)) {
		if (effectiveNodeCaps && !effectiveNodeCaps.has(pluginCapabilitySurface.surface)) continue;
		const capability = mintPluginNodeCapabilityToken();
		const expiresAtMs = resolvePluginNodeCapabilityExpiresAtMs(pluginCapabilitySurface);
		if (expiresAtMs === void 0) continue;
		const scopedUrl = buildPluginNodeCapabilityScopedHostUrl(pluginSurfaceBaseUrl, capability) ?? pluginSurfaceBaseUrl;
		pluginSurfaceUrls[pluginCapabilitySurface.surface] = scopedUrl;
		pendingPluginNodeCapabilities.push({
			surface: pluginCapabilitySurface,
			capability,
			expiresAtMs
		});
	}
	const isTrustedApprovalRuntime = pairingLocality !== "remote" && scopes.includes("operator.approvals") && connectParams.client.id === GATEWAY_CLIENT_IDS.GATEWAY_CLIENT && connectParams.client.mode === GATEWAY_CLIENT_MODES.BACKEND && isOperatorApprovalRuntimeToken(connectParams.auth?.approvalRuntimeToken);
	const agentRuntimeIdentityProof = connectParams.auth?.agentRuntimeIdentityToken;
	const canAcceptAgentRuntimeIdentity = pairingLocality !== "remote" && connectParams.client.id === GATEWAY_CLIENT_IDS.GATEWAY_CLIENT && connectParams.client.mode === GATEWAY_CLIENT_MODES.BACKEND;
	let trustedAgentRuntimeIdentity;
	if (typeof agentRuntimeIdentityProof === "string") {
		if (!canAcceptAgentRuntimeIdentity) {
			const message = "agent runtime identity token is only accepted from local backend gateway clients";
			markHandshakeFailure("agent-runtime-identity-untrusted-client", {
				client: connectParams.client.id,
				mode: connectParams.client.mode,
				pairingLocality
			});
			sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, message);
			close(1008, truncateCloseReason(message));
			return;
		}
		trustedAgentRuntimeIdentity = await verifyAgentRuntimeIdentityToken(agentRuntimeIdentityProof);
		if (!trustedAgentRuntimeIdentity) {
			const message = "invalid agent runtime identity token";
			markHandshakeFailure("agent-runtime-identity-invalid", {
				client: connectParams.client.id,
				mode: connectParams.client.mode,
				pairingLocality
			});
			sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, message);
			close(1008, message);
			return;
		}
	}
	const controlUiBuildMismatch = resolveControlUiBuildMismatch({
		clientId: connectParams.client.id,
		clientBuildId: connectParams.client.buildId,
		gatewayBuildId: resolveRuntimeServiceBuildId(),
		configuredControlUiRoot: context.configSnapshot.gateway?.controlUi?.root,
		requestHost,
		requestOrigin
	});
	if (controlUiBuildMismatch) {
		const message = "protocol mismatch: Control UI updated; reload this page to continue";
		markHandshakeFailure("control-ui-build-mismatch", {
			clientBuildId: controlUiBuildMismatch.clientBuildId ?? "legacy",
			gatewayBuildId: controlUiBuildMismatch.gatewayBuildId
		});
		sendHandshakeErrorResponse(ErrorCodes.UNAVAILABLE, message, {
			retryable: false,
			details: {
				code: ConnectErrorDetailCodes.PROTOCOL_MISMATCH,
				gatewayBuildId: controlUiBuildMismatch.gatewayBuildId,
				reloadRequired: true
			}
		});
		logWsControl.warn(`control ui build rejected conn=${connId} clientBuild=${formatForLog(controlUiBuildMismatch.clientBuildId ?? "legacy")} gatewayBuild=${formatForLog(controlUiBuildMismatch.gatewayBuildId)}; reload required`);
		await releasePendingNodePairingCleanup();
		close(1008, truncateCloseReason(message));
		return;
	}
	const authenticatedControlUi = role === "operator" && authMethod !== void 0 && authMethod !== "none" && connectParams.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI;
	const controlUiAdmin = authenticatedControlUi && scopes.includes("operator.admin");
	const internal = {
		...isLocalClient ? { isLocalClient: true } : {},
		...authenticatedControlUi ? { authenticatedControlUi: true } : {},
		...controlUiAdmin ? { controlUiAdmin: true } : {},
		...isTrustedApprovalRuntime ? { approvalRuntime: true } : {},
		...trustedAgentRuntimeIdentity ? { agentRuntimeIdentity: trustedAgentRuntimeIdentity } : {},
		...sharedSecretOperatorOwner ? { operatorRoleActor: { kind: "system" } } : {}
	};
	const prepareLocalUserIngress = (profile = authenticatedUserProfile) => prepareGatewayLocalUserIngress({
		authMethod,
		authenticatedUserExpected: Boolean(authenticatedUserId) || ownerProfileExpected,
		...profile ? { profile: {
			profileId: profile.profileId,
			displayName: profile.displayName
		} } : {},
		...device?.id ? { pairedDeviceId: device.id } : {},
		isLocalClient
	});
	const localUserIngress = prepareLocalUserIngress();
	if (usesLegacyNodeProtocol) logWsControl.warn(`legacy node protocol accepted conn=${connId} client=${formatForLog(clientLabel)} v${formatForLog(connectParams.client.version)} min=${minProtocol} max=${maxProtocol} current=4; upgrade recommended`);
	const nextClient = {
		socket,
		connect: connectParams,
		connId,
		connectionKind: "gateway",
		...!usesLegacyNodeProtocol && pluginSurfaceBaseUrl ? { pluginSurfaceBaseUrl } : {},
		isDeviceTokenAuth: authMethod === "device-token",
		pairedClientId: isBrowserCopilotClient(connectParams.client) ? connectParams.client.id : void 0,
		usesSharedGatewayAuth: sessionUsesSharedGatewayAuth,
		sharedGatewaySessionGeneration: sessionSharedGatewaySessionGeneration,
		authPolicyGeneration: resolveGatewayAuthPolicyGeneration(context.configSnapshot),
		presenceKey,
		...authenticatedUserId ? { authenticatedUserId } : {},
		...authenticatedUserIsTailscaleProvider ? { authenticatedUserIsTailscaleProvider: true } : {},
		...authenticatedUserProfile ? { authenticatedUserProfile } : {},
		clientIp: reportedClientIp,
		...context.browserOrigin ? { browserOrigin: context.browserOrigin } : {},
		...Object.keys(internal).length > 0 ? { internal } : {},
		...Object.keys(pluginSurfaceUrls).length > 0 ? { pluginSurfaceUrls } : {},
		...Object.keys(pluginNodeCapabilitySurfaces).length > 0 ? { pluginNodeCapabilitySurfaces } : {}
	};
	attachGatewayLocalUserIngress(nextClient, localUserIngress);
	if (resolveAuthenticatedGitHubIdentity) nextClient.authenticatedGitHubIdentitySync = async () => {
		const result = await resolveAuthenticatedGitHubIdentity();
		await profileLifecycle.attach(result.profileId, result.updatedAt, prepareLocalUserIngress);
		return result;
	};
	for (const entry of pendingPluginNodeCapabilities) setClientPluginNodeCapability({
		client: nextClient,
		surface: entry.surface,
		capability: entry.capability,
		expiresAtMs: entry.expiresAtMs
	});
	if (role === "node" && isLocalClient) {
		const localNodeId = await resolveLocalNodeId();
		if (localNodeId && device?.id === localNodeId) {
			const gatewayVersion = resolveRuntimeServiceVersion(process.env);
			const clientVersion = connectParams.client.version;
			const releaseOrder = compareOpenClawReleaseVersions(clientVersion, gatewayVersion);
			if (releaseOrder !== null && releaseOrder < 0) {
				logWsControl.info(`node version mismatch conn=${connId} client=${formatForLog(clientLabel)} clientVersion=${formatForLog(clientVersion)} gatewayVersion=${gatewayVersion}; closing for supervisor restart`);
				sendHandshakeErrorResponse(ErrorCodes.INVALID_REQUEST, "client version mismatch", { details: {
					code: ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH,
					clientVersion,
					gatewayVersion
				} });
				await releasePendingNodePairingCleanup();
				close(1008, "client version mismatch");
				return;
			}
		}
	}
	const admittedNodePairing = role === "node" ? nodePairingAdmission : void 0;
	if (admittedNodePairing) {
		const currentPairingState = await captureAuthenticatedNodePairingState(admittedNodePairing.authenticated);
		if (!currentPairingState || currentPairingState.identity.key !== admittedNodePairing.identity.key || currentPairingState.generation?.key !== admittedNodePairing.generation?.key) {
			const message = "node pairing changed during connect";
			markHandshakeFailure("node-pairing-generation-changed", { deviceId: admittedNodePairing.identity.nodeId });
			sendHandshakeErrorResponse(ErrorCodes.NOT_PAIRED, message);
			await releasePendingNodePairingCleanup();
			close(1008, truncateCloseReason(message));
			return;
		}
	}
	const policyFailure = resolveGatewayConnectPolicyFailure(context, state);
	if (policyFailure) {
		await releasePendingNodePairingCleanup();
		if (policyFailure.kind === "auth") {
			setCloseCause("gateway-auth-rotated", { authGenerationStale: true });
			close(4001, "gateway auth changed");
		} else rejectGatewayConnectOrigin(context, policyFailure.reason);
		return;
	}
	const handoffReceiver = context.handler.prepareAuthenticatedReceive(role);
	if (!handoffReceiver.ok) {
		const { cause, message } = handoffReceiver.error;
		markHandshakeFailure(cause, {});
		sendHandshakeErrorResponse(ErrorCodes.UNAVAILABLE, message);
		await releasePendingNodePairingCleanup();
		close(1011, message);
		return;
	}
	try {
		prepareGatewayConnectOperatorAccess(nextClient);
	} catch {
		await rejectGatewayConnectOperatorAccess(context);
		return;
	}
	if (!profileLifecycle.isCurrent(preparedProfile)) {
		await rejectUnavailableProfileConnect(context, /* @__PURE__ */ new Error("Gateway profile changed before registration"));
		return;
	}
	prepareGatewayRecipientProfile(nextClient, { identity: preparedProfile?.recipient });
	if (!setClient(nextClient)) {
		await releasePendingNodePairingCleanup();
		setCloseCause("connect-aborted-before-register", {
			...clientMeta,
			auth: authMethod
		});
		return;
	}
	profileLifecycle.bind(nextClient);
	if (!bindGatewayConnectOperatorAccess(context, nextClient)) return;
	clearHandshakeTimer();
	handoffReceiver.value();
	setHandshakeState("connected");
	advanceHandshakePhase("session_attached");
	logWs("in", "connect", {
		connId,
		client: connectParams.client.id,
		clientDisplayName: connectParams.client.displayName,
		version: connectParams.client.version,
		mode: connectParams.client.mode,
		clientId,
		platform: connectParams.client.platform,
		auth: authMethod
	});
	if (authenticatedUserId) logWsControl.info(`authenticated user connected conn=${connId} user=${formatForLog(authenticatedUserId)}`);
	if (isWebchatConnect(connectParams)) {
		const clientBuildId = connectParams.client.buildId?.trim();
		logWsControl.info(`webchat connected conn=${connId} remote=${remoteAddr ?? "?"} client=${clientLabel} ${connectParams.client.mode} v${connectParams.client.version} build=${formatForLog(clientBuildId ?? "legacy")}`);
	}
	const currentAuthenticatedPresenceUser = () => nextClient.authenticatedGitHubIdentitySync && !nextClient.authenticatedUserProfile ? void 0 : buildAuthenticatedPresenceUser({
		authenticatedUserId,
		authenticatedUserIsTailscaleProvider,
		authenticatedUserProfile: nextClient.authenticatedUserProfile
	});
	if (presenceKey) {
		const authenticatedPresenceUser = currentAuthenticatedPresenceUser();
		upsertPresence(presenceKey, {
			host: connectParams.client.displayName ?? connectParams.client.id ?? os.hostname(),
			clientId: connectParams.client.id,
			ip: isLocalClient ? void 0 : reportedClientIp,
			version: connectParams.client.version,
			platform: connectParams.client.platform,
			deviceFamily: connectParams.client.deviceFamily,
			modelIdentifier: connectParams.client.modelIdentifier,
			timeZone: connectParams.client.timeZone,
			mode: connectParams.client.mode,
			deviceId: device?.id,
			roles: [role],
			scopes,
			instanceId: role === "node" ? device?.id ?? instanceId : instanceId,
			...authenticatedPresenceUser ? { user: authenticatedPresenceUser } : {},
			reason: "connect"
		});
	}
	if (admittedNodePairing) {
		const pairingGeneration = admittedNodePairing.generation?.key;
		const requestContext = buildRequestContext();
		const nodeSession = requestContext.nodeRegistry.register(nextClient, {
			remoteIp: reportedClientIp,
			pairingIdentity: admittedNodePairing.identity.key,
			approvedSurface: admittedNodePairing.approvedSurface,
			...pairingGeneration ? { pairingGeneration } : {}
		});
		recordRemoteNodeInfo({
			nodeId: nodeSession.nodeId,
			connId: nodeSession.connId,
			displayName: nodeSession.displayName,
			platform: nodeSession.platform,
			deviceFamily: nodeSession.deviceFamily,
			commands: nodeSession.commands,
			remoteIp: nodeSession.remoteIp,
			pairingGeneration: nodeSession.pairingGeneration
		});
		runDetachedConnectWork(async () => {
			await refreshRemoteNodeBins({
				nodeId: nodeSession.nodeId,
				platform: nodeSession.platform,
				deviceFamily: nodeSession.deviceFamily,
				commands: nodeSession.commands,
				cfg: getRuntimeConfig(),
				readinessDelayMs: 5e3,
				readinessSignal: context.handler.connectionWork.signal
			});
		}, (err) => logGateway.warn(`remote bin probe failed for ${nodeSession.nodeId}: ${formatForLog(err)}`));
		const sendConnectSnapshot = async (event, payload) => {
			if (pairingGeneration) {
				await requestContext.nodeRegistry.sendEventRawForPairingGeneration(nodeSession.nodeId, pairingGeneration, event, serializeEventPayload(payload));
				return;
			}
			await requestContext.nodeRegistry.sendEventForPairingIdentity({
				nodeId: nodeSession.nodeId,
				connId: nodeSession.connId,
				pairingIdentity: admittedNodePairing.identity.key,
				event,
				payload
			});
		};
		runDetachedConnectWork(async () => {
			const cfg = await loadVoiceWakeConfig();
			await sendConnectSnapshot("voicewake.changed", { triggers: cfg.triggers });
		}, (err) => logGateway.warn(`voicewake snapshot failed for ${nodeSession.nodeId}: ${formatForLog(err)}`));
		runDetachedConnectWork(async () => {
			const routing = await loadVoiceWakeRoutingConfig();
			await sendConnectSnapshot("voicewake.routing.changed", { config: routing });
		}, (err) => logGateway.warn(`voicewake routing snapshot failed for ${nodeSession.nodeId}: ${formatForLog(err)}`));
	}
	await sendGatewayHello(context, state, pluginSurfaceUrls, authenticatedUserProfile?.profileId);
	if (nextClient.authenticatedGitHubIdentitySync) runDetachedConnectWork(async () => {
		const result = await nextClient.authenticatedGitHubIdentitySync();
		const profile = nextClient.authenticatedUserProfile;
		const profilePic = authResult.tailscaleIdentity?.profilePic;
		if (!profile?.hasAvatar && profilePic) try {
			const updated = await adoptTailscaleProfileAvatar(result.profileId, profilePic);
			if (updated.avatarMime) await profileLifecycle.attach(updated.id, updated.updatedAt, prepareLocalUserIngress);
		} catch (error) {
			logGateway.warn(`Tailscale avatar adoption failed conn=${connId}: ${formatForLog(error)}`);
		}
	}, (error) => {
		logGateway.warn(`GitHub identity sync failed conn=${connId}: ${formatForLog(error)}`);
	});
	const tailscaleProfilePic = authResult.tailscaleIdentity?.profilePic;
	const tailscaleProfileId = nextClient.authenticatedUserProfile?.profileId;
	if (!nextClient.authenticatedGitHubIdentitySync && tailscaleProfileId && !nextClient.authenticatedUserProfile?.hasAvatar && tailscaleProfilePic) runDetachedConnectWork(async () => {
		const updated = await adoptTailscaleProfileAvatar(tailscaleProfileId, tailscaleProfilePic);
		if (!updated.avatarMime) return;
		await profileLifecycle.attach(updated.id, updated.updatedAt, prepareLocalUserIngress);
	}, (error) => logGateway.warn(`Tailscale avatar adoption failed conn=${connId}: ${formatForLog(error)}`));
}
//#endregion
//#region src/gateway/server/ws-connection/message-handler.ts
const GATEWAY_WORK_ADMISSION_RETRY_AFTER_MS = 1e3;
const GATEWAY_WORK_ADMISSION_CLOSE_CODE = 1013;
function claimsWorkerConnectionIdentity(value) {
	if (!value || typeof value !== "object") return false;
	const connect = value;
	if (connect.role === "worker") return true;
	if (!connect.client || typeof connect.client !== "object") return false;
	const client = connect.client;
	return client.id === GATEWAY_CLIENT_IDS.WORKER || client.mode === GATEWAY_CLIENT_MODES.WORKER;
}
function attachGatewayWsMessageHandler(params) {
	const { socket, ingressAttribution, connId, remoteAddr, endpoint, forwardedFor, requestHost, requestOrigin, requestUserAgent, rateLimiter, browserRateLimiter, buildRequestContext, send, close, isClosed, getClient, setHandshakeState, setCloseCause, setLastFrameMeta, logGateway, logWsControl } = params;
	const sendFrame = async (obj) => await new Promise((resolve, reject) => {
		socket.send(JSON.stringify(obj), (err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
	const configSnapshot = getRuntimeConfig();
	const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
	const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
	const clientIp = ingressAttribution.clientIp;
	const peerLabel = endpoint ?? remoteAddr ?? "n/a";
	const hasProxyHeaders = ingressAttribution.kind === "trusted-proxy" || ingressAttribution.kind === "tailscale-serve" || ingressAttribution.kind === "tailscale-funnel";
	const remoteIsTrustedProxy = ingressAttribution.kind === "trusted-proxy" || ingressAttribution.kind === "tailscale-serve" || ingressAttribution.kind === "tailscale-funnel";
	const hostIsLocalish = isLocalishHost(requestHost);
	const isLocalClient = ingressAttribution.kind === "direct-local";
	const reportedClientIp = isLocalClient ? void 0 : clientIp && !isLoopbackAddress(clientIp) ? clientIp : void 0;
	const reportedClientIpSource = resolveNodePairingClientIpSource({
		reportedClientIp,
		hasProxyHeaders,
		remoteIsTrustedProxy,
		remoteIsLoopback: isLoopbackAddress(remoteAddr)
	});
	if (!hostIsLocalish && isLoopbackAddress(remoteAddr) && !hasProxyHeaders) logWsControl.warn("Loopback connection with non-local Host header. Treating it as remote. If you're behind a reverse proxy, set gateway.trustedProxies and forward X-Forwarded-For/X-Real-IP.");
	const isWebchatConnect = (p) => isWebchatClient(p?.client);
	const authenticatedRequestDispatcher = createGatewayAuthenticatedRequestDispatcher({
		handler: params,
		isWebchatConnect
	});
	const { hasBrowserOriginHeader, enforceOriginCheckForAnyClient, rateLimitClientIp: browserRateLimitClientIp, authRateLimiter } = resolveHandshakeBrowserSecurityContext({
		requestOrigin,
		clientIp: ingressAttribution.rateLimit.subject.key,
		rateLimiter,
		browserRateLimiter
	});
	const runDetachedConnectWork = (run, onError) => {
		params.connectionWork.track(() => runWithGatewayIndependentRootWorkAdmission(run, "ws:preauth", params.connectionWork.signal)).catch(onError);
	};
	const rejectOversizedPreauthFrame = (data) => {
		const payloadBytes = rawDataByteLength(data);
		if (payloadBytes <= 65536) return false;
		logRejectedLargePayload({
			surface: "gateway.ws.preauth",
			bytes: payloadBytes,
			limitBytes: MAX_PREAUTH_PAYLOAD_BYTES,
			reason: "preauth_frame_limit"
		});
		setHandshakeState("failed");
		setCloseCause("preauth-payload-too-large", {
			payloadBytes,
			limitBytes: MAX_PREAUTH_PAYLOAD_BYTES
		});
		close(1009, "preauth payload too large");
		return true;
	};
	const handleMessage = async (data, admission) => {
		if (isClosed()) return;
		if (!getClient() && rejectOversizedPreauthFrame(data)) return;
		const text = rawDataToString(data);
		const pendingNodePairingCleanup = {};
		const broadcastNodePairingResult = (result) => {
			const context = buildRequestContext();
			const resolvedAt = Date.now();
			for (const superseded of result.created ? result.superseded ?? [] : []) context.broadcast("node.pair.resolved", {
				requestId: superseded.requestId,
				nodeId: superseded.nodeId,
				decision: "rejected",
				ts: resolvedAt
			}, { dropIfSlow: true });
			if (result.created) context.broadcast("node.pair.requested", result.request, { dropIfSlow: true });
		};
		const releasePendingNodePairingCleanup = async () => {
			const claim = pendingNodePairingCleanup.value;
			pendingNodePairingCleanup.value = void 0;
			if (!claim) return;
			try {
				await releaseNodePairingCleanupClaim(claim);
			} catch (error) {
				logGateway.warn(`failed to release pending pairing cleanup for ${claim.nodeId}: ${formatForLog(error)}`);
			}
		};
		try {
			const parsed = JSON.parse(text);
			const client = getClient();
			if (!client && parsed !== null && typeof parsed === "object" && "params" in parsed && claimsWorkerConnectionIdentity(parsed.params)) {
				setHandshakeState("failed");
				setCloseCause("invalid-handshake", { handshakeError: "invalid worker handshake" });
				logWsControl.warn("worker admission rejected reason=invalid-handshake");
				close(1008, "invalid-handshake");
				return;
			}
			const frameType = parsed && typeof parsed === "object" && "type" in parsed ? typeof parsed.type === "string" ? String(parsed.type) : void 0 : void 0;
			const frameMethod = parsed && typeof parsed === "object" && "method" in parsed ? typeof parsed.method === "string" ? String(parsed.method) : void 0 : void 0;
			const frameId = parsed && typeof parsed === "object" && "id" in parsed ? typeof parsed.id === "string" ? String(parsed.id) : void 0 : void 0;
			if (frameType || frameMethod || frameId) setLastFrameMeta({
				type: frameType,
				method: frameMethod,
				id: frameId
			});
			if (!client) {
				const isRequestFrame = validateRequestFrame(parsed);
				if (!isRequestFrame || parsed.method !== "connect" || !validateConnectParams(parsed.params)) {
					const handshakeError = isRequestFrame ? parsed.method === "connect" ? `invalid connect params: ${formatValidationErrors(validateConnectParams.errors)}` : "invalid handshake: first request must be connect" : "invalid request frame";
					setHandshakeState("failed");
					setCloseCause("invalid-handshake", {
						frameType,
						frameMethod,
						frameId,
						handshakeError
					});
					if (isRequestFrame) send({
						type: "res",
						id: parsed.id,
						ok: false,
						error: errorShape(ErrorCodes.INVALID_REQUEST, handshakeError)
					});
					else logWsControl.warn(`invalid handshake conn=${connId} peer=${formatForLog(peerLabel)} remote=${remoteAddr ?? "?"} fwd=${formatForLog(forwardedFor ?? "n/a")} origin=${formatForLog(requestOrigin ?? "n/a")} host=${formatForLog(requestHost ?? "n/a")} ua=${formatForLog(requestUserAgent ?? "n/a")}`);
					const closeReason = truncateCloseReason(handshakeError || "invalid handshake");
					if (isRequestFrame) queueMicrotask(() => close(1008, closeReason));
					else close(1008, closeReason);
					return;
				}
				const frame = parsed;
				const connectParams = frame.params;
				const clientLabel = connectParams.client.displayName ?? connectParams.client.id;
				const clientMeta = {
					client: connectParams.client.id,
					clientDisplayName: connectParams.client.displayName,
					mode: connectParams.client.mode,
					version: connectParams.client.version,
					buildId: connectParams.client.buildId,
					platform: connectParams.client.platform,
					deviceFamily: connectParams.client.deviceFamily,
					modelIdentifier: connectParams.client.modelIdentifier,
					instanceId: connectParams.client.instanceId
				};
				const markHandshakeFailure = (cause, meta) => {
					setHandshakeState("failed");
					setCloseCause(cause, {
						...meta,
						...clientMeta
					});
				};
				const sendHandshakeErrorResponse = (code, message, options) => {
					send({
						type: "res",
						id: frame.id,
						ok: false,
						error: errorShape(code, message, options)
					});
				};
				const phaseContext = {
					handler: params,
					frame,
					connectParams,
					configSnapshot,
					trustedProxies,
					allowRealIpFallback,
					peerLabel,
					hasProxyHeaders,
					isLocalClient,
					reportedClientIp,
					reportedClientIpSource,
					hasBrowserOriginHeader,
					browserOrigin: resolveGatewayWsBrowserOrigin({
						client: connectParams.client,
						requestHost,
						origin: requestOrigin,
						isLocalClient,
						enforceOriginCheckForAnyClient
					}),
					browserRateLimitClientIp,
					authRateLimiter,
					clientLabel,
					clientMeta,
					markHandshakeFailure,
					sendHandshakeErrorResponse,
					sendFrame,
					onHelloDelivered: flushQueuedHandshakeFrames,
					isWebchatConnect,
					runDetachedConnectWork,
					pendingNodePairingCleanup,
					broadcastNodePairingResult,
					releasePendingNodePairingCleanup
				};
				const authenticated = await authenticateGatewayConnect(phaseContext);
				if (!authenticated) return;
				const deviceAuthorized = await authorizeGatewayConnectDevice(phaseContext, authenticated);
				if (!deviceAuthorized) return;
				await attachAuthenticatedGatewayConnect(phaseContext, deviceAuthorized);
				runDetachedConnectWork(() => publishConnectModelCatalog(params, authenticatedRequestDispatcher), (error) => logGateway.debug(`connection model catalog unavailable: ${formatForLog(error)}`));
				return;
			}
			await authenticatedRequestDispatcher.dispatch(parsed, client, rawDataByteLength(data), admission);
		} catch (err) {
			await releasePendingNodePairingCleanup();
			logGateway.error(`parse/handle error: ${String(err)}`);
			logWs("out", "parse-error", {
				connId,
				error: formatForLog(err)
			});
			if (!getClient()) close();
		}
	};
	const parsePreauthConnectFrame = (data) => {
		if (isClosed() || rawDataByteLength(data) > 65536) return null;
		let parsed;
		try {
			parsed = JSON.parse(rawDataToString(data));
		} catch {
			return null;
		}
		if (!validateRequestFrame(parsed) || parsed.method !== "connect" || !validateConnectParams(parsed.params)) return null;
		return {
			id: parsed.id,
			params: parsed.params
		};
	};
	const isPreparedControlConnect = (data) => {
		const parsed = parsePreauthConnectFrame(data);
		if (!parsed) return false;
		return parsed.params.role !== "node" && !claimsWorkerConnectionIdentity(parsed.params);
	};
	const isStartupNodePreauth = (data) => {
		const parsed = parsePreauthConnectFrame(data);
		return parsed ? isStartupNodeConnect(parsed.params) : false;
	};
	const rejectConnectForClosedAdmission = async (data) => {
		const parsed = parsePreauthConnectFrame(data);
		if (!parsed) return false;
		const restartDraining = isGatewayRestartDraining();
		const reason = restartDraining ? GATEWAY_RESTART_UNAVAILABLE_REASON : GATEWAY_SUSPEND_UNAVAILABLE_REASON;
		const operation = restartDraining ? "restart" : "suspension";
		const phase = getGatewaySuspendAdmissionPhase();
		setLastFrameMeta({
			type: "req",
			method: "connect",
			id: parsed.id
		});
		setHandshakeState("failed");
		setCloseCause(reason, {
			method: "connect",
			phase
		});
		await sendFrame({
			type: "res",
			id: parsed.id,
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, `connect unavailable during gateway ${operation}`, {
				retryable: true,
				retryAfterMs: GATEWAY_WORK_ADMISSION_RETRY_AFTER_MS,
				details: {
					method: "connect",
					reason,
					phase
				}
			})
		}).catch(() => {});
		queueMicrotask(() => close(GATEWAY_WORK_ADMISSION_CLOSE_CODE, `gateway ${operation} in progress`));
		return true;
	};
	const handleIncomingMessage = async (data, requestAdmission) => {
		if (getClient()) {
			await handleMessage(data, requestAdmission);
			return;
		}
		const admission = tryBeginGatewayRootWorkAdmission("ws:connect");
		if (!admission) {
			if (isGatewayRestartDraining() && getGatewaySuspendAdmissionPhase() === "accepting" && params.isStartupPending?.() === true && isStartupNodePreauth(data)) {
				const startupAdmission = tryBeginGatewayRestartStartupRootWorkAdmission();
				if (startupAdmission) {
					try {
						await startupAdmission.run(() => handleMessage(data));
					} finally {
						startupAdmission.release();
					}
					return;
				}
			}
			if (!isGatewayRestartDraining() && (getGatewaySuspendAdmissionPhase() === "draining" || getGatewaySuspendAdmissionPhase() === "prepared") && isPreparedControlConnect(data)) {
				await handleMessage(data);
				return;
			}
			if (await rejectConnectForClosedAdmission(data)) return;
			await handleMessage(data);
			return;
		}
		try {
			await admission.run(() => handleMessage(data));
		} finally {
			admission.release();
		}
	};
	const dispatchIncomingMessage = (data, onSettled) => {
		const admission = params.connectionWork.isClosing ? "continuation" : void 0;
		if (admission && getClient()?.connect.role !== "node") {
			onSettled?.();
			return;
		}
		params.connectionWork.track(() => runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () => handleIncomingMessage(data, admission))).catch((error) => {
			logGateway.error(`request dispatch failed conn=${connId}: ${formatForLog(error)}`);
		}).finally(onSettled);
	};
	let queuedHandshakeFrames;
	function flushQueuedHandshakeFrames() {
		const frames = queuedHandshakeFrames?.splice(0) ?? [];
		queuedHandshakeFrames = void 0;
		if (isClosed()) return;
		for (const frame of frames) onMessage(frame);
	}
	const onMessage = (data) => {
		if (isClosed()) return;
		if (queuedHandshakeFrames) {
			if (rejectOversizedPreauthFrame(data)) {
				queuedHandshakeFrames.length = 0;
				return;
			}
			if (queuedHandshakeFrames.length >= 15) {
				setHandshakeState("failed");
				setCloseCause("handshake-message-overflow", { queuedFrames: queuedHandshakeFrames.length });
				queuedHandshakeFrames.length = 0;
				close(1008, "too many pending handshake frames");
				return;
			}
			queuedHandshakeFrames.push(data);
			return;
		}
		if (getClient()) {
			dispatchIncomingMessage(data);
			return;
		}
		queuedHandshakeFrames = [];
		dispatchIncomingMessage(data, flushQueuedHandshakeFrames);
	};
	socket.on("message", onMessage);
	return onMessage;
}
//#endregion
export { attachGatewayWsMessageHandler };
