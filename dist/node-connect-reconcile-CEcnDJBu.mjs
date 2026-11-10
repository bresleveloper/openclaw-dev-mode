import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { a as isLoopbackAddress, c as isPrivateOrLoopbackAddress, l as isPrivateOrLoopbackHost, s as isLoopbackHost, y as resolveHostName } from "./net-CjQwRK-V.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN, t as AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN } from "./auth-rate-limit-ByL4y2DQ.mjs";
import "./ingress-attribution-CP_2XS9r.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-BtnsIW6U.mjs";
import { i as authorizeWsControlUiGatewayConnect, r as authorizeHttpGatewayConnect } from "./auth-fv7y-hds.mjs";
import { g as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DZGyt5jE.mjs";
import { n as normalizeNodeApprovalSurfaceList, t as intersectNodePermissionSurface } from "./node-pairing-surface-DkE1CvYJ.mjs";
import { i as verifyDeviceSignature } from "./device-identity-8y_iX6az.mjs";
import { n as buildDeviceAuthPayloadV3, t as buildDeviceAuthPayload } from "./device-auth-BT2rF0Jc.mjs";
import { c as normalizeDeclaredNodeCommands, f as retainFulfilledNodeCapabilities, u as resolveNodePairingCommandAllowlist } from "./node-command-policy-CCKsZy54.mjs";
import { n as confirmDevicePairSetupCompletionDelivery, r as consumeDeviceBootstrapTokenWithSetupCompletion } from "./device-bootstrap-FJ4oQdcl.mjs";
//#region src/gateway/server/ws-connection/auth-context.ts
async function resolveConnectAuthState(params) {
	const token = normalizeOptionalString(params.connectAuth?.token);
	const password = normalizeOptionalString(params.connectAuth?.password);
	const sharedConnectAuth = token || password ? {
		token,
		password
	} : void 0;
	const bootstrapTokenCandidate = params.hasDeviceIdentity ? normalizeOptionalString(params.connectAuth?.bootstrapToken) : void 0;
	const explicitDeviceToken = params.hasDeviceIdentity ? normalizeOptionalString(params.connectAuth?.deviceToken) : void 0;
	const deviceCredential = params.hasDeviceIdentity ? explicitDeviceToken ?? token : void 0;
	const deferRateLimitFailure = Boolean(deviceCredential);
	const authResult = await authorizeWsControlUiGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: sharedConnectAuth,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: sharedConnectAuth ? params.rateLimiter : void 0,
		clientIp: params.clientIp,
		rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET,
		deferRateLimitFailure
	});
	const sharedAuthResult = sharedConnectAuth && await authorizeHttpGatewayConnect({
		auth: {
			...params.resolvedAuth,
			allowTailscale: false
		},
		connectAuth: sharedConnectAuth,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimitScope: "shared-secret"
	});
	const sharedAuthOk = sharedAuthResult?.ok === true && (sharedAuthResult.method === "token" || sharedAuthResult.method === "password") || authResult.ok && authResult.method === "trusted-proxy";
	const pendingSharedAuthFailure = deferRateLimitFailure && (authResult.reason === "token_mismatch" || authResult.reason === "password_mismatch");
	return {
		authResult,
		authOk: authResult.ok,
		authMethod: authResult.method ?? (params.resolvedAuth.mode === "password" ? "password" : "token"),
		sharedAuthOk,
		pendingSharedAuthFailure,
		bootstrapTokenCandidate,
		deviceTokenCandidate: deviceCredential,
		deviceTokenCandidateSource: explicitDeviceToken ? "explicit-device-token" : deviceCredential ? "shared-token-fallback" : void 0
	};
}
async function resolveConnectAuthDecision(params) {
	if (!Boolean(params.rateLimiter && params.hasDeviceIdentity && params.deviceId && params.publicKey && params.state.bootstrapTokenCandidate)) return await resolveConnectAuthDecisionCore(params);
	return await withSerializedRateLimitAttempt({
		ip: params.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN,
		run: async () => await resolveConnectAuthDecisionCore(params)
	});
}
async function resolveConnectAuthDecisionCore(params) {
	let authResult = params.state.authResult;
	let authOk = params.state.authOk;
	let authMethod = params.state.authMethod;
	let deviceTokenSharedGatewaySessionGeneration;
	let pendingBootstrapFailure = false;
	async function finish() {
		if (params.state.pendingSharedAuthFailure && !authOk) await params.rateLimiter?.recordFailureAndDelay(params.clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
		if (pendingBootstrapFailure && !authOk) params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
		return {
			authResult,
			authOk,
			authMethod,
			deviceTokenSharedGatewaySessionGeneration
		};
	}
	if (authResult.reason === "proxy_attribution_required" || authResult.reason === "token_redacted_config" || authResult.reason === "password_redacted_config") return await finish();
	const bootstrapTokenCandidate = params.state.bootstrapTokenCandidate;
	if (params.hasDeviceIdentity && params.deviceId && params.publicKey && bootstrapTokenCandidate) {
		let bootstrapRateLimited = false;
		if (params.rateLimiter) {
			const bootstrapRateCheck = params.rateLimiter.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
			if (!bootstrapRateCheck.allowed) {
				bootstrapRateLimited = true;
				if (!authOk || params.requireBootstrapToken) {
					authOk = false;
					authResult = {
						ok: false,
						reason: "rate_limited",
						rateLimited: true,
						retryAfterMs: bootstrapRateCheck.retryAfterMs
					};
				}
			}
		}
		if (!bootstrapRateLimited) {
			const tokenCheck = await params.verifyBootstrapToken({
				deviceId: params.deviceId,
				publicKey: params.publicKey,
				token: bootstrapTokenCandidate,
				role: params.role,
				scopes: params.scopes
			});
			if (tokenCheck.ok) {
				authOk = true;
				authMethod = "bootstrap-token";
				params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN);
			} else {
				pendingBootstrapFailure = true;
				if (!authOk || params.requireBootstrapToken) {
					authOk = false;
					authResult = {
						ok: false,
						reason: tokenCheck.reason ?? "bootstrap_token_invalid"
					};
				}
			}
		}
	}
	const deviceTokenCandidate = params.state.deviceTokenCandidate;
	if (!params.hasDeviceIdentity || !params.deviceId || authOk || !deviceTokenCandidate) return await finish();
	const deviceRateCheck = params.rateLimiter?.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
	if (deviceRateCheck && !deviceRateCheck.allowed) {
		authResult = {
			ok: false,
			reason: "rate_limited",
			rateLimited: true,
			retryAfterMs: deviceRateCheck.retryAfterMs
		};
		return await finish();
	}
	const tokenCheck = await params.verifyDeviceToken({
		deviceId: params.deviceId,
		token: deviceTokenCandidate,
		role: params.role,
		scopes: params.scopes
	});
	if (tokenCheck.ok) {
		authOk = true;
		authMethod = "device-token";
		if (tokenCheck.issuer?.kind === "shared-gateway-auth") deviceTokenSharedGatewaySessionGeneration = tokenCheck.issuer.generation;
		params.rateLimiter?.reset(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
	} else {
		authResult = {
			ok: false,
			reason: tokenCheck.reason === "scope-mismatch" || tokenCheck.reason === "scope_mismatch" ? "scope_mismatch" : params.state.deviceTokenCandidateSource === "explicit-device-token" ? "device_token_mismatch" : authResult.reason ?? "device_token_mismatch"
		};
		params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
	}
	return await finish();
}
//#endregion
//#region src/gateway/server/ws-connection/handshake-auth-helpers.ts
const BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP = "198.18.0.1";
const BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX = "browser-origin:";
function resolveBrowserOriginRateLimitKey(requestOrigin) {
	const origin = URL.parse(requestOrigin?.trim() ?? "")?.origin;
	return origin ? `${BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX}${normalizeLowercaseStringOrEmpty(origin)}` : BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP;
}
function resolveHandshakeBrowserSecurityContext(params) {
	const hasBrowserOriginHeader = Boolean(params.requestOrigin && params.requestOrigin.trim() !== "");
	return {
		hasBrowserOriginHeader,
		enforceOriginCheckForAnyClient: hasBrowserOriginHeader,
		rateLimitClientIp: hasBrowserOriginHeader && isLoopbackAddress(params.clientIp) ? resolveBrowserOriginRateLimitKey(params.requestOrigin) : params.clientIp,
		authRateLimiter: hasBrowserOriginHeader && params.browserRateLimiter ? params.browserRateLimiter : params.rateLimiter
	};
}
function shouldAllowSilentLocalPairing(params) {
	if (params.locality === "remote") return false;
	if (params.hasBrowserOriginHeader && !params.isControlUi && !params.isWebchat) return false;
	if (params.reason === "metadata-upgrade") return !params.hasBrowserOriginHeader && !params.isControlUi && !params.isWebchat && (params.locality === "direct_local" && params.isNativeAppUi === true || params.locality === "cli_container_local" || params.locality === "shared_secret_loopback_local");
	if (params.autoApproveLocal === false) return false;
	if (params.reason === "scope-upgrade") return params.authMethod === "none" || params.authMethod === "token" || params.authMethod === "password";
	return true;
}
function isCliCliClient(client) {
	return client.id === GATEWAY_CLIENT_IDS.CLI && client.mode === GATEWAY_CLIENT_MODES.CLI;
}
function isSharedSecretAuthMethod(method) {
	return method === "token" || method === "password";
}
function resolvePairingLocality(params) {
	if (params.isLocalClient) return "direct_local";
	if (params.connectParams.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.WEBCHAT && params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod) && !params.hasProxyHeaders && params.hasBrowserOriginHeader && isPrivateOrLoopbackAddress(params.remoteAddress) && isLoopbackHost(resolveHostName(params.requestHost)) && isLoopbackHost(URL.parse(params.requestOrigin?.trim() ?? "")?.hostname ?? "")) return "browser_container_local";
	if (params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod) && !params.hasProxyHeaders && !params.hasBrowserOriginHeader && isLoopbackAddress(params.remoteAddress) && isPrivateOrLoopbackHost(resolveHostName(params.requestHost))) return isCliCliClient(params.connectParams.client) ? "cli_container_local" : "shared_secret_loopback_local";
	return "remote";
}
function shouldSkipLocalBackendSelfPairing(params) {
	const isBackendClient = params.connectParams.client.id === GATEWAY_CLIENT_IDS.GATEWAY_CLIENT && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.BACKEND;
	const isLocal = params.locality === "direct_local" || params.locality === "shared_secret_loopback_local";
	if (!isBackendClient || !isLocal || params.hasBrowserOriginHeader) return false;
	return params.authMethod === "none" || params.authMethod === "device-token" || params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod);
}
function shouldPreserveLocalCliSharedAuthScopes(params) {
	return isCliCliClient(params.connectParams.client) && (params.locality === "direct_local" || params.locality === "cli_container_local") && !params.hasBrowserOriginHeader && params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod);
}
function resolveDeviceSignaturePayloadVersion(params) {
	const basePayload = {
		deviceId: params.device.id,
		clientId: params.connectParams.client.id,
		clientMode: params.connectParams.client.mode,
		role: params.role,
		scopes: params.scopes,
		signedAtMs: params.signedAtMs,
		token: params.connectParams.auth?.token ?? params.connectParams.auth?.deviceToken ?? params.connectParams.auth?.bootstrapToken ?? null,
		nonce: params.nonce
	};
	const payloadV3 = buildDeviceAuthPayloadV3({
		...basePayload,
		platform: params.connectParams.client.platform,
		deviceFamily: params.connectParams.client.deviceFamily
	});
	if (verifyDeviceSignature(params.device.publicKey, payloadV3, params.device.signature)) return "v3";
	const payloadV2 = buildDeviceAuthPayload(basePayload);
	if (verifyDeviceSignature(params.device.publicKey, payloadV2, params.device.signature)) return "v2";
	return null;
}
function resolveUnauthorizedHandshakeContext(params) {
	const authProvided = params.connectAuth?.password ? "password" : params.connectAuth?.token ? "token" : params.connectAuth?.bootstrapToken ? "bootstrap-token" : params.connectAuth?.deviceToken ? "device-token" : "none";
	const canRetryWithDeviceToken = params.failedAuth.reason === "token_mismatch" && params.hasDeviceIdentity && authProvided === "token" && !params.connectAuth?.deviceToken;
	if (canRetryWithDeviceToken) return {
		authProvided,
		canRetryWithDeviceToken,
		recommendedNextStep: "retry_with_device_token"
	};
	let recommendedNextStep;
	switch (params.failedAuth.reason) {
		case "token_missing":
		case "token_missing_config":
		case "token_redacted_config":
		case "password_redacted_config":
		case "password_missing":
		case "password_missing_config":
			recommendedNextStep = "update_auth_configuration";
			break;
		case "token_mismatch":
		case "password_mismatch":
		case "device_token_mismatch":
			recommendedNextStep = "update_auth_credentials";
			break;
		case "rate_limited":
			recommendedNextStep = "wait_then_retry";
			break;
		default: recommendedNextStep = "review_auth_configuration";
	}
	return {
		authProvided,
		canRetryWithDeviceToken,
		recommendedNextStep
	};
}
//#endregion
//#region src/gateway/device-pair-setup-completion.ts
async function consumeSetupHandoff(params) {
	const completedAtMs = params.ts ?? Date.now();
	return consumeDeviceBootstrapTokenWithSetupCompletion({
		token: params.token,
		deviceId: params.deviceId,
		completedAtMs,
		admitsCloudWorkerSetup: params.admitsCloudWorkerSetup,
		...params.pairedDeviceMatches ? { pairedDeviceMatches: params.pairedDeviceMatches } : {},
		...params.baseDir ? { baseDir: params.baseDir } : {}
	});
}
/** Confirm the response completed before the operator can observe success. */
async function confirmSetupHandoffDelivery(params) {
	const completion = params.handoff.completion;
	if (!completion) return params.handoff;
	const confirmed = await confirmDevicePairSetupCompletionDelivery({
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...params.baseDir ? { baseDir: params.baseDir } : {}
	});
	return confirmed ? {
		record: params.handoff.record,
		completion: confirmed
	} : null;
}
function broadcastSetupHandoff({ handoff, broadcast }, deliveryState) {
	const completion = handoff.completion;
	if (completion?.deliveryState !== deliveryState) return;
	const payload = {
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...completion.deviceName ? { deviceName: completion.deviceName } : {},
		access: completion.access,
		ts: completion.completedAtMs
	};
	broadcast(deliveryState === "confirmed" ? "device.pair.setup.completed" : "device.pair.setup.deliveryUncertain", payload, { dropIfSlow: true });
}
/** Broadcast the already-committed completion; status reconciliation owns delivery loss. */
function broadcastSetupHandoffCompletion(params) {
	broadcastSetupHandoff(params, "confirmed");
}
/** Tell the operator that replay is blocked but credential delivery is unknown. */
function broadcastSetupHandoffDeliveryUncertain(params) {
	broadcastSetupHandoff(params, "uncertain");
}
//#endregion
//#region src/gateway/node-connect-reconcile.ts
const log = createSubsystemLogger("gateway/node-connect");
function normalizePermissionMap(value) {
	if (!value) return;
	const entries = Object.entries(value).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
async function reconcileNodePairingOnConnect(params) {
	const nodeId = params.connectParams.device?.id ?? params.connectParams.client.id;
	const policyNode = {
		platform: params.connectParams.client.platform,
		deviceFamily: params.connectParams.client.deviceFamily,
		caps: params.connectParams.caps,
		commands: params.connectParams.commands
	};
	const pairingAllowlist = resolveNodePairingCommandAllowlist(params.cfg, policyNode);
	const connectCommands = normalizeNodeApprovalSurfaceList(params.connectParams.commands);
	const declared = normalizeDeclaredNodeCommands({
		declaredCommands: connectCommands,
		allowlist: pairingAllowlist
	});
	const withheldCommands = connectCommands.filter((command) => !declared.includes(command));
	const declaredCaps = retainFulfilledNodeCapabilities({
		caps: normalizeNodeApprovalSurfaceList(params.connectParams.caps),
		admittedCommands: declared,
		withheldCommands
	});
	if (withheldCommands.length > 0) log.warn(`node command surface withheld node=${nodeId} commands=${withheldCommands.join(",")}`);
	const declaredPermissions = normalizePermissionMap(params.connectParams.permissions);
	const declaredComputerUse = params.connectParams.computerUse === void 0 ? void 0 : parseComputerUseCapabilityDescriptor(params.connectParams.computerUse);
	const declaration = {
		nodeId,
		declaredCaps,
		declaredCommands: declared,
		withheldCommands,
		...declaredComputerUse ? { declaredComputerUse } : {},
		declaredPermissions
	};
	const { pairedNode } = params;
	const approvedCommands = new Set(normalizeDeclaredNodeCommands({
		declaredCommands: pairedNode?.commands,
		allowlist: pairingAllowlist
	}));
	const approvedCaps = new Set(normalizeNodeApprovalSurfaceList(pairedNode?.caps));
	const approvedPermissions = normalizePermissionMap(pairedNode?.permissions);
	if (pairedNode && declared.every((command) => approvedCommands.has(command)) && declaredCaps.every((capability) => approvedCaps.has(capability)) && !Object.entries(declaredPermissions ?? {}).some(([key, granted]) => granted && approvedPermissions?.[key] !== true)) return {
		...declaration,
		effectiveCaps: declaredCaps,
		effectiveCommands: declared,
		effectivePermissions: declaredPermissions,
		shouldClearPendingPairings: true
	};
	const effectiveCaps = declaredCaps.filter((cap) => approvedCaps.has(cap));
	const effectiveCommands = declared.filter((command) => approvedCommands.has(command));
	const effectivePermissions = pairedNode ? intersectNodePermissionSurface({
		approved: approvedPermissions,
		declared: declaredPermissions
	}) : void 0;
	const { client } = params.connectParams;
	const pendingPairing = await params.requestPairing({
		nodeId,
		displayName: client.displayName,
		platform: client.platform,
		version: client.version,
		deviceFamily: client.deviceFamily,
		modelIdentifier: client.modelIdentifier,
		caps: declaredCaps,
		commands: declared,
		permissions: declaredPermissions,
		remoteIp: params.reportedClientIp,
		...!pairedNode && params.initialSurfaceSilent ? { silent: true } : {}
	});
	if (!pairedNode && !pendingPairing) throw new Error("node pairing request required");
	return {
		...declaration,
		effectiveCaps,
		effectiveCommands,
		effectivePermissions,
		...pendingPairing ? { pendingPairing } : {}
	};
}
//#endregion
export { consumeSetupHandoff as a, resolvePairingLocality as c, shouldPreserveLocalCliSharedAuthScopes as d, shouldSkipLocalBackendSelfPairing as f, confirmSetupHandoffDelivery as i, resolveUnauthorizedHandshakeContext as l, resolveConnectAuthState as m, broadcastSetupHandoffCompletion as n, resolveDeviceSignaturePayloadVersion as o, resolveConnectAuthDecision as p, broadcastSetupHandoffDeliveryUncertain as r, resolveHandshakeBrowserSecurityContext as s, reconcileNodePairingOnConnect as t, shouldAllowSilentLocalPairing as u };
