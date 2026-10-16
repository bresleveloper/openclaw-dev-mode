import { f as isOperatorScope } from "./operator-scopes-DsrPoRc4.mjs";
import { At as validateDevicePairRejectParams, Ft as validateDeviceTokenRevokeParams, It as validateDeviceTokenRotateParams, Mt as validateDevicePairRenameParams, Nr as validateScopeUpgradeRequest, Ot as validateDevicePairApproveParams, Pr as validateScopeUpgradeWait, jt as validateDevicePairRemoveParams, kt as validateDevicePairListParams } from "./src-l2dWvEsN.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as resolveOperatorRolePolicy } from "./operator-role-policy-BqPaarjx.mjs";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-q_NaMExM.mjs";
import { n as normalizeDeviceAuthScopes } from "./device-auth-DIR2dK9a.mjs";
import { n as holdGatewayPolicyResponse } from "./ws-policy-close-BgtfQbi3.mjs";
import { c as removePairedDevice, d as updatePairedDeviceMetadata, i as listDevicePairing, n as getPendingDevicePairing, s as rejectDevicePairing, t as getPairedDevice, u as requestDevicePairing } from "./device-pairing-Drmq_Czv.mjs";
import { n as approveDevicePairing, r as formatDevicePairingForbiddenMessage } from "./device-pairing-approval-DyoNg7Fe.mjs";
import { r as summarizeDeviceTokens } from "./device-pairing-token-utils-BIebfL9d.mjs";
import { n as revokeDeviceToken, r as rotateDeviceToken } from "./device-pairing-tokens-BD-uMVyw.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as GATEWAY_EVENT_DEVICE_PAIR_CHANGED } from "./events-D023Lo1g.mjs";
import { n as clearRemovedNodeRuntimeState, s as reconcileRevokedDeviceWorker } from "./node-runtime-state-C9n3OwRL.mjs";
import { a as invalidateNodeWakeState } from "./node-wake-state-CWVR-GCk.mjs";
import { a as requestsNonOperatorDeviceRole, i as pairedDeviceHasNonOperatorRole, n as deniesCrossDeviceManagement, o as resolveDeviceManagementAuthz, r as deniesDeviceTokenRoleManagement, s as resolveDeviceSessionAuthz, t as emitDeviceManagementSecurityEvent } from "./device-management-security-BQTmXF1c.mjs";
//#region src/gateway/server-methods/device-scope-upgrade.ts
const DEVICE_REQUIRED_MESSAGE = "device scope upgrade requires a paired browser identity; reopen the Control UI over HTTPS or localhost, then retry";
function readUpgradeOwner(client) {
	const deviceId = client?.connect.device?.id.trim();
	const publicKey = client?.connect.device?.publicKey.trim();
	return client?.connId && client.connect.role === "operator" && deviceId && publicKey ? {
		deviceId,
		publicKey
	} : null;
}
function respondDeviceRequired(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_REQUIRED_MESSAGE, { details: {
		code: ConnectErrorDetailCodes.DEVICE_IDENTITY_REQUIRED,
		recommendedNextStep: "reopen_control_ui_securely"
	} }));
}
/** Live operator scope-upgrade request and identity-bound wait handlers. */
const scopeUpgradeHandlers = {
	"device.scopes.requestUpgrade": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateScopeUpgradeRequest, "device.scopes.requestUpgrade", respond)) return;
		const owner = readUpgradeOwner(client);
		if (!owner) {
			respondDeviceRequired(respond);
			return;
		}
		const paired = await getPairedDevice(owner.deviceId);
		if (!paired || paired.publicKey !== owner.publicKey) {
			respondDeviceRequired(respond);
			return;
		}
		const requestedScopes = normalizeDeviceAuthScopes(params.scopes);
		if (!requestedScopes.every(isOperatorScope)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "requested scopes contain an unknown operator scope"));
			return;
		}
		const rolePolicy = resolveOperatorRolePolicy(client, context.getRuntimeConfig());
		if (rolePolicy && !roleScopesAllow({
			role: "operator",
			requestedScopes,
			allowedScopes: rolePolicy.scopes
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "requested scopes exceed your assigned operator role; ask a gateway administrator to change your role"));
			return;
		}
		const currentScopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		if (!roleScopesAllow({
			role: "operator",
			requestedScopes: currentScopes,
			allowedScopes: requestedScopes
		})) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "requested scopes must include the connection's current scopes"));
			return;
		}
		const pairing = await requestDevicePairing({
			deviceId: owner.deviceId,
			publicKey: owner.publicKey,
			displayName: client?.connect.client.displayName,
			platform: client?.connect.client.platform,
			deviceFamily: client?.connect.client.deviceFamily,
			clientId: client?.connect.client.id,
			clientMode: client?.connect.client.mode,
			browserOrigin: paired.browserOrigin,
			role: "operator",
			scopes: requestedScopes,
			remoteIp: client?.clientIp,
			silent: false
		});
		const coordinator = context.scopeUpgradeCoordinator;
		if (!coordinator?.register({
			requestId: pairing.request.requestId,
			expiresAtMs: pairing.expiresAtMs,
			owner,
			requestedScopes,
			initialToken: paired.tokens?.operator?.token,
			initialApprovedAtMs: paired.approvedAtMs
		})) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "device scope upgrade is temporarily unavailable", { retryable: true }));
			return;
		}
		const resolvedAt = Date.now();
		for (const superseded of pairing.superseded ?? []) {
			coordinator.notify(superseded.requestId, "rejected");
			context.broadcast("device.pair.resolved", {
				requestId: superseded.requestId,
				deviceId: superseded.deviceId,
				decision: "rejected",
				ts: resolvedAt
			}, { dropIfSlow: true });
		}
		if (pairing.created) context.broadcast("device.pair.requested", pairing.request, { dropIfSlow: true });
		context.logGateway.warn(`security audit: live device scope upgrade requested device=${owner.deviceId} scopesFrom=${currentScopes.join(",")} scopesTo=${requestedScopes.join(",")}`);
		respond(true, { requestId: pairing.request.requestId }, void 0);
	},
	"device.scopes.waitUpgrade": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateScopeUpgradeWait, "device.scopes.waitUpgrade", respond)) return;
		const owner = readUpgradeOwner(client);
		if (!owner) {
			respondDeviceRequired(respond);
			return;
		}
		const result = await context.scopeUpgradeCoordinator?.wait(params.requestId, owner);
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "scope upgrade expired or not found"));
			return;
		}
		if (result.status === "insufficient-scopes") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Pairing was approved, but this browser's previously narrowed token still lacks the requested access. Run openclaw dashboard --json on the Gateway host for a fresh one-time owner pairing link. Open its browserUrl in this browser using the same Control UI address and Gateway URL to restore administrator access."));
			return;
		}
		if (result.status === "approved") {
			const rolePolicy = resolveOperatorRolePolicy(client, context.getRuntimeConfig());
			if (rolePolicy && !roleScopesAllow({
				role: "operator",
				requestedScopes: result.scopes,
				allowedScopes: rolePolicy.scopes
			})) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approved scopes exceed your assigned operator role; ask a gateway administrator to change your role"));
				return;
			}
		}
		respond(true, result, void 0);
	}
};
//#endregion
//#region src/gateway/server-methods/devices.ts
const DEVICE_PAIR_APPROVAL_DENIED_MESSAGE = "device pairing approval denied";
const DEVICE_PAIR_REJECTION_DENIED_MESSAGE = "device pairing rejection denied";
function redactPairedDevice(device, connected) {
	const { tokens, approvedScopes: _approvedScopes, ...rest } = device;
	return {
		...rest,
		...connected !== void 0 ? { connected } : {},
		tokens: summarizeDeviceTokens(tokens)
	};
}
function prepareDeviceTokenMutation(operation, params, options) {
	const { deviceId, role } = params;
	const { client, context, respond } = options;
	const authz = resolveDeviceManagementAuthz(client, deviceId);
	const deny = (reason, scope) => {
		const noun = operation === "rotate" ? "rotation" : "revocation";
		const message = `device token ${noun} denied`;
		const suffix = scope ? ` scope=${scope}` : "";
		context.logGateway.warn(`${message} device=${deviceId} role=${role} reason=${reason}${suffix}`);
		emitDeviceManagementSecurityEvent({
			outcome: "denied",
			severity: "medium",
			policyId: "gateway.device-token",
			decision: "deny",
			action: `device.token.${noun}_denied`,
			authz,
			targetDeviceId: deviceId,
			controlId: `device.token.${operation}`,
			reason,
			attributes: { role: role.trim() }
		});
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
	};
	const denial = deniesCrossDeviceManagement(authz) ? "device-ownership-mismatch" : deniesDeviceTokenRoleManagement(authz, role) ? "role-management-requires-admin" : void 0;
	if (denial) {
		deny(denial);
		return;
	}
	return {
		authz,
		callerScopes: role.trim() === "operator" ? authz.callerScopes : void 0,
		deny
	};
}
async function runDevicePairingMutation(params) {
	const authz = resolveDeviceManagementAuthz(params.client, params.deviceId);
	let reason;
	if (deniesCrossDeviceManagement(authz)) reason = "device-ownership-mismatch";
	else if (authz.callerDeviceId && !authz.isAdminCaller) {
		const paired = await getPairedDevice(authz.normalizedTargetDeviceId);
		if (paired && pairedDeviceHasNonOperatorRole(paired)) reason = "role-management-requires-admin";
	}
	if (!reason) return params.run(authz);
	const message = `device pairing ${params.operation === "remove" ? "removal" : "rename"} denied`;
	params.context.logGateway.warn(`${message} device=${params.deviceId} reason=${reason}`);
	emitDevicePairingDeniedSecurityEvent({
		authz,
		targetDeviceId: params.deviceId,
		controlId: `device.pair.${params.operation}`,
		reason
	});
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
function emitDevicePairingDeniedSecurityEvent(params) {
	emitDeviceManagementSecurityEvent({
		action: "device.pairing.denied",
		outcome: "denied",
		severity: params.severity ?? "medium",
		authz: params.authz,
		targetDeviceId: params.targetDeviceId,
		policyId: "gateway.device-pairing",
		decision: "deny",
		controlId: params.controlId,
		reason: params.reason
	});
}
function emitDevicePairingLifecycleSecurityEvent(params) {
	emitDeviceManagementSecurityEvent({
		...params,
		outcome: "success",
		policyId: "gateway.device-pairing",
		decision: "allow"
	});
}
function emitDeviceTokenLifecycleSecurityEvent(params) {
	emitDeviceManagementSecurityEvent({
		...params,
		outcome: "success",
		policyId: "gateway.device-token",
		decision: "allow",
		attributes: {
			role: params.role,
			...params.scopeCount !== void 0 ? { scope_count: params.scopeCount } : {}
		}
	});
}
const deviceHandlers = {
	...scopeUpgradeHandlers,
	"device.pair.list": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairListParams, "device.pair.list", respond)) return;
		const list = await listDevicePairing();
		const authz = resolveDeviceSessionAuthz(client);
		let visibleList = list;
		if (authz.callerDeviceId && !authz.isAdminCaller) visibleList = {
			pending: list.pending.filter((request) => request.deviceId.trim() === authz.callerDeviceId),
			paired: list.paired.filter((device) => device.deviceId.trim() === authz.callerDeviceId)
		};
		respond(true, {
			pending: visibleList.pending,
			paired: visibleList.paired.map((device) => redactPairedDevice(device, context.hasConnectedClientsForDevice?.(device.deviceId.trim()) ?? false))
		}, void 0);
	},
	"device.pair.approve": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairApproveParams, "device.pair.approve", respond)) return;
		const requestId = params.requestId.trim();
		const authz = resolveDeviceSessionAuthz(client);
		if (!authz.isAdminCaller) {
			const pending = await getPendingDevicePairing(requestId);
			if (!pending) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
			const reason = authz.callerDeviceId && pending.deviceId.trim() !== authz.callerDeviceId ? "device-ownership-mismatch" : requestsNonOperatorDeviceRole(pending) ? "role-management-requires-admin" : void 0;
			if (reason) {
				context.logGateway.warn(`device pairing approval denied request=${requestId} reason=${reason}`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: pending.deviceId,
					controlId: "device.pair.approve",
					reason
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_APPROVAL_DENIED_MESSAGE));
				return;
			}
		}
		const approved = await approveDevicePairing(requestId, { callerScopes: authz.callerScopes });
		if (!approved) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
			return;
		}
		if (approved.status === "forbidden") {
			emitDevicePairingDeniedSecurityEvent({
				authz,
				controlId: "device.pair.approve",
				reason: approved.reason
			});
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatDevicePairingForbiddenMessage(approved)));
			return;
		}
		const normalizedDeviceId = approved.device.deviceId.trim();
		context.scopeUpgradeCoordinator?.notify(requestId, "approved");
		if (approved.nodePairingGenerationChanged) {
			invalidateNodeWakeState(normalizedDeviceId);
			context.invalidateClientsForDevice?.(normalizedDeviceId, {
				role: "node",
				reason: "device-pairing-reapproved"
			});
		}
		context.logGateway.info(`device pairing approved device=${approved.device.deviceId} role=${approved.device.role ?? "unknown"}`);
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.approved",
			severity: "low",
			authz,
			targetDeviceId: approved.device.deviceId,
			controlId: "device.pair.approve",
			attributes: {
				role_count: approved.device.roles?.length ?? (approved.device.role ? 1 : 0),
				scope_count: approved.device.approvedScopes?.length ?? approved.device.scopes?.length ?? 0
			}
		});
		context.broadcast("device.pair.resolved", {
			requestId,
			deviceId: approved.device.deviceId,
			decision: "approved",
			ts: Date.now()
		}, { dropIfSlow: true });
		respond(true, {
			requestId,
			device: redactPairedDevice(approved.device)
		}, void 0);
		if (approved.nodePairingGenerationChanged) queueMicrotask(() => {
			context.disconnectClientsForDevice?.(normalizedDeviceId, { role: "node" });
		});
	},
	"device.pair.reject": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRejectParams, "device.pair.reject", respond)) return;
		const requestId = params.requestId.trim();
		const authz = resolveDeviceSessionAuthz(client);
		if (authz.callerDeviceId && !authz.isAdminCaller) {
			const pending = await getPendingDevicePairing(requestId);
			if (!pending) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE));
				return;
			}
			if (pending.deviceId.trim() !== authz.callerDeviceId) {
				context.logGateway.warn(`device pairing rejection denied request=${requestId} reason=device-ownership-mismatch`);
				emitDevicePairingDeniedSecurityEvent({
					authz,
					targetDeviceId: pending.deviceId,
					controlId: "device.pair.reject",
					reason: "device-ownership-mismatch"
				});
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, DEVICE_PAIR_REJECTION_DENIED_MESSAGE));
				return;
			}
		}
		const rejected = await rejectDevicePairing(requestId);
		if (!rejected) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown requestId"));
			return;
		}
		context.scopeUpgradeCoordinator?.notify(requestId, "rejected");
		emitDevicePairingLifecycleSecurityEvent({
			action: "device.pairing.rejected",
			authz,
			targetDeviceId: rejected.deviceId,
			controlId: "device.pair.reject",
			severity: "low"
		});
		context.broadcast("device.pair.resolved", {
			requestId,
			deviceId: rejected.deviceId,
			decision: "rejected",
			ts: Date.now()
		}, { dropIfSlow: true });
		respond(true, rejected, void 0);
	},
	"device.pair.remove": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRemoveParams, "device.pair.remove", respond)) return;
		const { deviceId } = params;
		await runDevicePairingMutation({
			operation: "remove",
			client,
			context,
			respond,
			deviceId,
			run: async (authz) => {
				const removed = await removePairedDevice(deviceId);
				if (!removed) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
					return;
				}
				clearRemovedNodeRuntimeState({
					nodeId: removed.deviceId,
					context
				});
				try {
					try {
						holdGatewayPolicyResponse(respond);
					} finally {
						context.invalidateClientsForDevice?.(removed.deviceId, { reason: "device-pair-removed" });
						await reconcileRevokedDeviceWorker(context, removed.deviceId);
					}
					context.logGateway.info(`device pairing removed device=${removed.deviceId}`);
					emitDevicePairingLifecycleSecurityEvent({
						action: "device.pairing.removed",
						severity: "medium",
						authz,
						targetDeviceId: removed.deviceId,
						controlId: "device.pair.remove"
					});
					respond(true, removed, void 0);
				} finally {
					queueMicrotask(() => {
						context.disconnectClientsForDevice?.(removed.deviceId);
					});
				}
			}
		});
	},
	"device.pair.rename": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDevicePairRenameParams, "device.pair.rename", respond)) return;
		const { deviceId, label } = params;
		const trimmed = label.trim();
		if (!trimmed) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "label required"));
			return;
		}
		await runDevicePairingMutation({
			operation: "rename",
			client,
			context,
			respond,
			deviceId,
			run: async (authz) => {
				if (!await updatePairedDeviceMetadata(deviceId, { operatorLabel: trimmed })) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown deviceId"));
					return;
				}
				context.logGateway.info(`device pairing renamed device=${deviceId} label=${trimmed}`);
				emitDevicePairingLifecycleSecurityEvent({
					action: "device.pairing.renamed",
					severity: "low",
					authz,
					targetDeviceId: deviceId,
					controlId: "device.pair.rename"
				});
				context.broadcast(GATEWAY_EVENT_DEVICE_PAIR_CHANGED, {}, { dropIfSlow: true });
				respond(true, {
					deviceId,
					label: trimmed
				}, void 0);
			}
		});
	},
	"device.token.rotate": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDeviceTokenRotateParams, "device.token.rotate", respond)) return;
		const { deviceId, role, scopes } = params;
		const mutation = prepareDeviceTokenMutation("rotate", params, {
			client,
			context,
			respond
		});
		if (!mutation) return;
		const { authz, callerScopes, deny } = mutation;
		const result = await rotateDeviceToken({
			deviceId,
			role,
			scopes,
			callerScopes
		});
		if (!result.ok) {
			deny(result.reason, result.scope);
			return;
		}
		const entry = result.entry;
		const normalizedDeviceId = deviceId.trim();
		context.logGateway.info(`device token rotated device=${deviceId} role=${entry.role} scopes=${entry.scopes.join(",")}`);
		emitDeviceTokenLifecycleSecurityEvent({
			action: "device.token.rotated",
			severity: "medium",
			authz,
			targetDeviceId: deviceId,
			controlId: "device.token.rotate",
			role: entry.role,
			scopeCount: entry.scopes.length
		});
		if (entry.role === "node") invalidateNodeWakeState(normalizedDeviceId);
		try {
			holdGatewayPolicyResponse(respond);
		} finally {
			context.invalidateClientsForDevice?.(normalizedDeviceId, {
				role: entry.role,
				reason: "device-token-rotated"
			});
			queueMicrotask(() => {
				context.disconnectClientsForDevice?.(normalizedDeviceId, { role: entry.role });
			});
		}
		const deliversTokenInBand = Boolean(authz.callerDeviceId && authz.callerDeviceId === authz.normalizedTargetDeviceId);
		respond(true, {
			deviceId,
			role: entry.role,
			...deliversTokenInBand ? { token: entry.token } : {},
			scopes: entry.scopes,
			rotatedAtMs: entry.rotatedAtMs ?? entry.createdAtMs,
			tokenDelivery: deliversTokenInBand ? "in-band" : "withheld-cross-device"
		}, void 0);
	},
	"device.token.revoke": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateDeviceTokenRevokeParams, "device.token.revoke", respond)) return;
		const { deviceId, role } = params;
		const mutation = prepareDeviceTokenMutation("revoke", params, {
			client,
			context,
			respond
		});
		if (!mutation) return;
		const { authz, callerScopes, deny } = mutation;
		const result = await revokeDeviceToken({
			deviceId,
			role,
			callerScopes
		});
		if (!result.ok) {
			deny(result.reason, result.scope);
			return;
		}
		const entry = result.entry;
		const normalizedDeviceId = deviceId.trim();
		context.logGateway.info(`device token revoked device=${normalizedDeviceId} role=${entry.role}`);
		emitDeviceTokenLifecycleSecurityEvent({
			action: "device.token.revoked",
			severity: "high",
			authz,
			targetDeviceId: normalizedDeviceId,
			controlId: "device.token.revoke",
			role: entry.role
		});
		try {
			try {
				holdGatewayPolicyResponse(respond);
			} finally {
				context.invalidateClientsForDevice?.(normalizedDeviceId, {
					role: entry.role,
					reason: "device-token-revoked"
				});
				if (entry.role === "node") {
					clearRemovedNodeRuntimeState({
						nodeId: normalizedDeviceId,
						context
					});
					await reconcileRevokedDeviceWorker(context, normalizedDeviceId);
				}
			}
		} finally {
			queueMicrotask(() => {
				context.disconnectClientsForDevice?.(normalizedDeviceId, { role: entry.role });
			});
		}
		respond(true, {
			deviceId: normalizedDeviceId,
			role: entry.role,
			revokedAtMs: entry.revokedAtMs ?? Date.now()
		}, void 0);
	}
};
//#endregion
export { deviceHandlers };
