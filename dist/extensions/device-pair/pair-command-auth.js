import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/device-pair/pair-command-auth.ts
const COMMAND_OWNER_PAIRING_SCOPES = ["operator.pairing"];
const PAIRING_SCOPE = "operator.pairing";
const ADMIN_SCOPE = "operator.admin";
const TALK_SECRETS_SCOPE = "operator.talk.secrets";
function resolveAuthLabel(cfg) {
	const mode = cfg.gateway?.auth?.mode;
	const token = normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN) ?? normalizeOptionalString(cfg.gateway?.auth?.token);
	const password = normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD) ?? normalizeOptionalString(cfg.gateway?.auth?.password);
	if (mode === "token" || mode === "password") return resolveRequiredAuthLabel(mode, {
		token,
		password
	});
	if (token) return { label: "token" };
	if (password) return { label: "password" };
	if (mode === "trusted-proxy") return { label: "trusted-proxy" };
	return { error: "Gateway auth is not configured (no token or password)." };
}
function resolveRequiredAuthLabel(mode, values) {
	return values[mode] ? { label: mode } : { error: `Gateway auth is set to ${mode}, but no ${mode} is configured.` };
}
function isInternalGatewayPairingCaller(params) {
	return params.channel === "webchat" || Array.isArray(params.gatewayClientScopes);
}
function hasPairingPrivilege(scopes) {
	return scopes.includes(PAIRING_SCOPE) || scopes.includes(ADMIN_SCOPE);
}
function hasSetupHandoffPrivilege(scopes) {
	return scopes.includes(TALK_SECRETS_SCOPE) || scopes.includes(ADMIN_SCOPE);
}
function resolvePairingCommandAuthState(params) {
	const isInternalGatewayCaller = isInternalGatewayPairingCaller(params);
	if (isInternalGatewayCaller) {
		const approvalCallerScopes = Array.isArray(params.gatewayClientScopes) ? params.gatewayClientScopes : [];
		return {
			isInternalGatewayCaller,
			isMissingPairingPrivilege: !hasPairingPrivilege(approvalCallerScopes),
			isMissingSetupHandoffPrivilege: !hasSetupHandoffPrivilege(approvalCallerScopes),
			canIssueFullAccessSetup: approvalCallerScopes.includes(ADMIN_SCOPE),
			approvalCallerScopes
		};
	}
	if (params.senderIsOwner === true) return {
		isInternalGatewayCaller,
		isMissingPairingPrivilege: false,
		isMissingSetupHandoffPrivilege: false,
		canIssueFullAccessSetup: true,
		approvalCallerScopes: COMMAND_OWNER_PAIRING_SCOPES
	};
	return {
		isInternalGatewayCaller,
		isMissingPairingPrivilege: true,
		isMissingSetupHandoffPrivilege: true,
		canIssueFullAccessSetup: false,
		approvalCallerScopes: void 0
	};
}
//#endregion
export { resolveAuthLabel, resolvePairingCommandAuthState };
