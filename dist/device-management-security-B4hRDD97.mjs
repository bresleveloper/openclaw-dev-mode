import { l as emitTrustedSecurityEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/gateway/server-methods/device-management-authz.ts
function resolveDeviceSessionAuthz(client) {
	const callerScopes = client?.connect.scopes ?? [];
	return {
		callerDeviceId: client?.isDeviceTokenAuth ? client.connect.device?.id.trim() || null : null,
		callerScopes,
		isAdminCaller: callerScopes.includes("operator.admin")
	};
}
function resolveDeviceManagementAuthz(client, targetDeviceId) {
	return {
		...resolveDeviceSessionAuthz(client),
		normalizedTargetDeviceId: targetDeviceId.trim()
	};
}
function deniesCrossDeviceManagement(authz) {
	return Boolean(authz.callerDeviceId && authz.callerDeviceId !== authz.normalizedTargetDeviceId && !authz.isAdminCaller);
}
function deniesDeviceTokenRoleManagement(authz, targetRole) {
	return !authz.isAdminCaller && requestsNonOperatorDeviceRole({ role: targetRole });
}
function requestsNonOperatorDeviceRole(input) {
	return [input.role, ...input.roles ?? []].some((role) => {
		const normalized = role?.trim();
		return Boolean(normalized && normalized !== "operator");
	});
}
function pairedDeviceHasNonOperatorRole(device) {
	return requestsNonOperatorDeviceRole(device) || Object.values(device.tokens ?? {}).some((token) => {
		const normalized = token.role.trim();
		return Boolean(normalized && normalized !== "operator");
	});
}
//#endregion
//#region src/gateway/server-methods/device-management-security.ts
function hashDeviceSecurityId(value) {
	const normalized = value?.trim();
	if (!normalized) return;
	return `sha256:${sha256HexPrefixCore(normalized, 12)}`;
}
function emitDeviceManagementSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "auth",
		action: params.action,
		outcome: params.outcome,
		severity: params.severity,
		actor: {
			kind: "operator",
			...params.authz.callerDeviceId ? { deviceIdHash: hashDeviceSecurityId(params.authz.callerDeviceId) } : {},
			role: params.authz.isAdminCaller ? "admin" : "operator"
		},
		target: {
			kind: "device",
			...params.targetDeviceId ? { idHash: hashDeviceSecurityId(params.targetDeviceId) } : {}
		},
		policy: {
			id: params.policyId,
			decision: params.decision,
			...params.reason ? { reason: params.reason } : {}
		},
		control: {
			id: params.controlId,
			family: "auth"
		},
		...params.reason ? { reason: params.reason } : {},
		...params.attributes ? { attributes: params.attributes } : {}
	});
}
//#endregion
export { requestsNonOperatorDeviceRole as a, pairedDeviceHasNonOperatorRole as i, deniesCrossDeviceManagement as n, resolveDeviceManagementAuthz as o, deniesDeviceTokenRoleManagement as r, resolveDeviceSessionAuthz as s, emitDeviceManagementSecurityEvent as t };
