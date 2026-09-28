import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { a as isLoopbackAddress, c as isPrivateOrLoopbackAddress, l as isPrivateOrLoopbackHost, s as isLoopbackHost, y as resolveHostName } from "./net-DU4aWKLv.mjs";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN, t as AUTH_RATE_LIMIT_SCOPE_BOOTSTRAP_TOKEN } from "./auth-rate-limit-DuWYneOU.mjs";
import "./ingress-attribution-C5e071om.mjs";
import { n as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-Bc5jN4Z8.mjs";
import { i as authorizeWsControlUiGatewayConnect, r as authorizeHttpGatewayConnect } from "./auth-CRxiLJL8.mjs";
import { l as verifyDeviceSignature } from "./device-identity-B_zMrBd6.mjs";
import { n as buildDeviceAuthPayloadV3, t as buildDeviceAuthPayload } from "./device-auth-na9vtJo1.mjs";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DzawlQtp.mjs";
import { c as normalizeDeclaredNodeCommands, f as retainFulfilledNodeCapabilities, u as resolveNodePairingCommandAllowlist } from "./node-command-policy-CnGfXM76.mjs";
import { n as normalizeNodeApprovalSurfaceList, t as intersectNodePermissionSurface } from "./node-pairing-surface-B68Et9XU.mjs";
import { n as confirmDevicePairSetupCompletionDelivery, r as consumeDeviceBootstrapTokenWithSetupCompletion } from "./device-bootstrap-BtrqJlcg.mjs";
//#region src/gateway/server/ws-connection/handshake-auth-helpers.ts
const BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP = "198.18.0.1";
const BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX = "browser-origin:";
function isNativeAppUiClient(client) {
	return client.mode === GATEWAY_CLIENT_MODES.UI && (client.id === GATEWAY_CLIENT_IDS.MACOS_APP || client.id === GATEWAY_CLIENT_IDS.LINUX_APP || client.id === GATEWAY_CLIENT_IDS.IOS_APP || client.id === GATEWAY_CLIENT_IDS.ANDROID_APP);
}
function resolveBrowserOriginRateLimitKey(requestOrigin) {
	const trimmedOrigin = requestOrigin?.trim();
	if (!trimmedOrigin) return BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP;
	try {
		return `${BROWSER_ORIGIN_RATE_LIMIT_KEY_PREFIX}${normalizeLowercaseStringOrEmpty(new URL(trimmedOrigin).origin)}`;
	} catch {
		return BROWSER_ORIGIN_LOOPBACK_RATE_LIMIT_IP;
	}
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
function isSharedSecretLoopbackLocalEquivalent(params) {
	return params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod) && !params.hasProxyHeaders && !params.hasBrowserOriginHeader && isLoopbackAddress(params.remoteAddress) && isPrivateOrLoopbackHost(resolveHostName(params.requestHost));
}
function resolveOriginHost(origin) {
	const trimmed = origin?.trim();
	if (!trimmed) return "";
	try {
		return new URL(trimmed).hostname;
	} catch {
		return "";
	}
}
function isControlUiBrowserContainerLocalEquivalent(params) {
	return params.connectParams.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI && params.connectParams.client.mode === GATEWAY_CLIENT_MODES.WEBCHAT && params.sharedAuthOk && isSharedSecretAuthMethod(params.authMethod) && !params.hasProxyHeaders && params.hasBrowserOriginHeader && isPrivateOrLoopbackAddress(params.remoteAddress) && isLoopbackHost(resolveHostName(params.requestHost)) && isLoopbackHost(resolveOriginHost(params.requestOrigin));
}
function resolvePairingLocality(params) {
	if (params.isLocalClient) return "direct_local";
	if (isControlUiBrowserContainerLocalEquivalent(params)) return "browser_container_local";
	if (isSharedSecretLoopbackLocalEquivalent(params)) return isCliCliClient(params.connectParams.client) ? "cli_container_local" : "shared_secret_loopback_local";
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
function resolveSignatureToken(connectParams) {
	return connectParams.auth?.token ?? connectParams.auth?.deviceToken ?? connectParams.auth?.bootstrapToken ?? null;
}
function buildUnauthorizedHandshakeContext(params) {
	return {
		authProvided: params.authProvided,
		canRetryWithDeviceToken: params.canRetryWithDeviceToken,
		recommendedNextStep: params.recommendedNextStep
	};
}
function resolveDeviceSignaturePayloadVersion(params) {
	const signatureToken = resolveSignatureToken(params.connectParams);
	const basePayload = {
		deviceId: params.device.id,
		clientId: params.connectParams.client.id,
		clientMode: params.connectParams.client.mode,
		role: params.role,
		scopes: params.scopes,
		signedAtMs: params.signedAtMs,
		token: signatureToken,
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
function resolveAuthProvidedKind(connectAuth) {
	return connectAuth?.password ? "password" : connectAuth?.token ? "token" : connectAuth?.bootstrapToken ? "bootstrap-token" : connectAuth?.deviceToken ? "device-token" : "none";
}
function resolveUnauthorizedHandshakeContext(params) {
	const authProvided = resolveAuthProvidedKind(params.connectAuth);
	const canRetryWithDeviceToken = params.failedAuth.reason === "token_mismatch" && params.hasDeviceIdentity && authProvided === "token" && !params.connectAuth?.deviceToken;
	if (canRetryWithDeviceToken) return buildUnauthorizedHandshakeContext({
		authProvided,
		canRetryWithDeviceToken,
		recommendedNextStep: "retry_with_device_token"
	});
	switch (params.failedAuth.reason) {
		case "token_missing":
		case "token_missing_config":
		case "token_redacted_config":
		case "password_redacted_config":
		case "password_missing":
		case "password_missing_config": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "update_auth_configuration"
		});
		case "token_mismatch":
		case "password_mismatch":
		case "device_token_mismatch": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "update_auth_credentials"
		});
		case "scope_mismatch": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "review_auth_configuration"
		});
		case "rate_limited": return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "wait_then_retry"
		});
		default: return buildUnauthorizedHandshakeContext({
			authProvided,
			canRetryWithDeviceToken,
			recommendedNextStep: "review_auth_configuration"
		});
	}
}
//#endregion
//#region src/gateway/server/ws-connection/auth-context.ts
function mapDeviceTokenAuthFailureReason(params) {
	if (params.tokenCheckReason === "scope-mismatch" || params.tokenCheckReason === "scope_mismatch") return "scope_mismatch";
	if (params.candidateSource === "explicit-device-token") return "device_token_mismatch";
	return params.fallbackReason ?? "device_token_mismatch";
}
function resolveSharedConnectAuth(connectAuth) {
	const token = normalizeOptionalString(connectAuth?.token);
	const password = normalizeOptionalString(connectAuth?.password);
	if (!token && !password) return;
	return {
		token,
		password
	};
}
function resolveDeviceTokenCandidate(connectAuth) {
	const explicitDeviceToken = normalizeOptionalString(connectAuth?.deviceToken);
	if (explicitDeviceToken) return {
		token: explicitDeviceToken,
		source: "explicit-device-token"
	};
	const fallbackToken = normalizeOptionalString(connectAuth?.token);
	if (!fallbackToken) return {};
	return {
		token: fallbackToken,
		source: "shared-token-fallback"
	};
}
async function resolveConnectAuthState(params) {
	const sharedConnectAuth = resolveSharedConnectAuth(params.connectAuth);
	const sharedAuthProvided = Boolean(sharedConnectAuth);
	const bootstrapTokenCandidate = params.hasDeviceIdentity ? normalizeOptionalString(params.connectAuth?.bootstrapToken) : void 0;
	const { token: deviceCredential, source: deviceCredentialSource } = params.hasDeviceIdentity ? resolveDeviceTokenCandidate(params.connectAuth) : {};
	const deferRateLimitFailure = Boolean(deviceCredential);
	const authResult = await authorizeWsControlUiGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: sharedConnectAuth,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		rateLimiter: sharedAuthProvided ? params.rateLimiter : void 0,
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
		deviceTokenCandidateSource: deviceCredentialSource
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
	let deviceTokenRateLimited = false;
	if (params.rateLimiter) {
		const deviceRateCheck = params.rateLimiter.check(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		if (!deviceRateCheck.allowed) {
			deviceTokenRateLimited = true;
			authResult = {
				ok: false,
				reason: "rate_limited",
				rateLimited: true,
				retryAfterMs: deviceRateCheck.retryAfterMs
			};
		}
	}
	if (!deviceTokenRateLimited) {
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
				reason: mapDeviceTokenAuthFailureReason({
					tokenCheckReason: tokenCheck.reason,
					candidateSource: params.state.deviceTokenCandidateSource,
					fallbackReason: authResult.reason
				})
			};
			params.rateLimiter?.recordFailure(params.clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		}
	}
	return await finish();
}
//#endregion
//#region src/gateway/device-pair-setup-completion.ts
async function consumeSetupHandoff(params) {
	const completedAtMs = params.ts ?? Date.now();
	return await consumeDeviceBootstrapTokenWithSetupCompletion({
		token: params.token,
		deviceId: params.deviceId,
		completedAtMs,
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
/** Broadcast the already-committed completion; status reconciliation owns delivery loss. */
function broadcastSetupHandoffCompletion(params) {
	const completion = params.handoff.completion;
	if (!completion || completion.deliveryState !== "confirmed") return;
	const payload = {
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...completion.deviceName ? { deviceName: completion.deviceName } : {},
		access: completion.access,
		ts: completion.completedAtMs
	};
	params.broadcast("device.pair.setup.completed", payload, { dropIfSlow: true });
}
/** Tell the operator that replay is blocked but credential delivery is unknown. */
function broadcastSetupHandoffDeliveryUncertain(params) {
	const completion = params.handoff.completion;
	if (!completion || completion.deliveryState !== "uncertain") return;
	const payload = {
		setupId: completion.setupId,
		deviceId: completion.deviceId,
		...completion.deviceName ? { deviceName: completion.deviceName } : {},
		access: completion.access,
		ts: completion.completedAtMs
	};
	params.broadcast("device.pair.setup.deliveryUncertain", payload, { dropIfSlow: true });
}
//#endregion
//#region src/gateway/node-connect-reconcile.ts
const log = createSubsystemLogger("gateway/node-connect");
function resolveApprovedReconnectCommands(params) {
	return normalizeDeclaredNodeCommands({
		declaredCommands: Array.isArray(params.pairedCommands) ? params.pairedCommands : [],
		allowlist: params.allowlist
	});
}
function normalizePermissionMap(value) {
	if (!value) return;
	const entries = Object.entries(value).toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function intersectApprovalSurfaceList(params) {
	const approved = new Set(normalizeNodeApprovalSurfaceList(params.approved));
	return normalizeNodeApprovalSurfaceList(params.declared).filter((entry) => approved.has(entry));
}
function hasPermissionUpgrade(params) {
	return Object.entries(params.declared ?? {}).some(([key, declaredValue]) => declaredValue && params.approved?.[key] !== true);
}
function buildNodePairingRequestInput(params) {
	return {
		nodeId: params.nodeId,
		displayName: params.connectParams.client.displayName,
		platform: params.connectParams.client.platform,
		version: params.connectParams.client.version,
		deviceFamily: params.connectParams.client.deviceFamily,
		modelIdentifier: params.connectParams.client.modelIdentifier,
		caps: params.caps,
		commands: params.commands,
		permissions: params.permissions,
		remoteIp: params.remoteIp,
		...params.silent ? { silent: true } : {}
	};
}
/** Reconciles a connecting node against stored approval and requests pairing when needed. */
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
	if (!params.pairedNode) {
		const pendingPairing = await params.requestPairing(buildNodePairingRequestInput({
			nodeId,
			connectParams: params.connectParams,
			caps: declaredCaps,
			commands: declared,
			permissions: declaredPermissions,
			remoteIp: params.reportedClientIp,
			silent: params.initialSurfaceSilent
		}));
		if (!pendingPairing) throw new Error("node pairing request required");
		return {
			nodeId,
			declaredCaps,
			effectiveCaps: [],
			declaredCommands: declared,
			effectiveCommands: [],
			withheldCommands,
			...declaredComputerUse ? { declaredComputerUse } : {},
			declaredPermissions,
			effectivePermissions: void 0,
			pendingPairing
		};
	}
	const approvedCommands = resolveApprovedReconnectCommands({
		pairedCommands: params.pairedNode.commands,
		allowlist: pairingAllowlist
	});
	const approvedCaps = normalizeNodeApprovalSurfaceList(params.pairedNode.caps);
	const approvedPermissions = normalizePermissionMap(params.pairedNode.permissions);
	const hasCommandUpgrade = declared.some((command) => !approvedCommands.includes(command));
	const hasCapabilityUpgrade = declaredCaps.some((capability) => !approvedCaps.includes(capability));
	const permissionUpgrade = hasPermissionUpgrade({
		approved: approvedPermissions,
		declared: declaredPermissions
	});
	const effectiveApprovedDeclaredCaps = intersectApprovalSurfaceList({
		approved: approvedCaps,
		declared: declaredCaps
	});
	const effectiveApprovedDeclaredCommands = intersectApprovalSurfaceList({
		approved: approvedCommands,
		declared
	});
	const effectiveApprovedDeclaredPermissions = intersectNodePermissionSurface({
		approved: approvedPermissions,
		declared: declaredPermissions
	});
	if (hasCommandUpgrade || hasCapabilityUpgrade || permissionUpgrade) {
		const pendingPairing = await params.requestPairing(buildNodePairingRequestInput({
			nodeId,
			connectParams: params.connectParams,
			caps: declaredCaps,
			commands: declared,
			permissions: declaredPermissions ?? (permissionUpgrade ? {} : void 0),
			remoteIp: params.reportedClientIp
		}));
		return {
			nodeId,
			declaredCaps,
			effectiveCaps: effectiveApprovedDeclaredCaps,
			declaredCommands: declared,
			effectiveCommands: effectiveApprovedDeclaredCommands,
			withheldCommands,
			...declaredComputerUse ? { declaredComputerUse } : {},
			declaredPermissions,
			effectivePermissions: effectiveApprovedDeclaredPermissions,
			...pendingPairing ? { pendingPairing } : {}
		};
	}
	return {
		nodeId,
		declaredCaps,
		effectiveCaps: declaredCaps,
		declaredCommands: declared,
		effectiveCommands: declared,
		withheldCommands,
		...declaredComputerUse ? { declaredComputerUse } : {},
		declaredPermissions,
		effectivePermissions: declaredPermissions,
		shouldClearPendingPairings: true
	};
}
//#endregion
export { consumeSetupHandoff as a, isNativeAppUiClient as c, resolvePairingLocality as d, resolveUnauthorizedHandshakeContext as f, shouldSkipLocalBackendSelfPairing as h, confirmSetupHandoffDelivery as i, resolveDeviceSignaturePayloadVersion as l, shouldPreserveLocalCliSharedAuthScopes as m, broadcastSetupHandoffCompletion as n, resolveConnectAuthDecision as o, shouldAllowSilentLocalPairing as p, broadcastSetupHandoffDeliveryUncertain as r, resolveConnectAuthState as s, reconcileNodePairingOnConnect as t, resolveHandshakeBrowserSecurityContext as u };
