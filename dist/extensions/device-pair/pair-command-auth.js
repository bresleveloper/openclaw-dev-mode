import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
//#region extensions/device-pair/pair-command-auth.ts
const COMMAND_OWNER_PAIRING_SCOPES = ["operator.pairing"];
const PAIRING_SCOPE = "operator.pairing";
const ADMIN_SCOPE = "operator.admin";
const TALK_SECRETS_SCOPE = "operator.talk.secrets";
function resolveAuthLabel(cfg) {
	const mode = cfg.gateway?.auth?.mode;
	const token = pickFirstDefined([process.env.OPENCLAW_GATEWAY_TOKEN, cfg.gateway?.auth?.token]) ?? void 0;
	const password = pickFirstDefined([process.env.OPENCLAW_GATEWAY_PASSWORD, cfg.gateway?.auth?.password]) ?? void 0;
	if (mode === "token" || mode === "password") return resolveRequiredAuthLabel(mode, {
		token,
		password
	});
	if (token) return { label: "token" };
	if (password) return { label: "password" };
	if (mode === "trusted-proxy") return { label: "trusted-proxy" };
	return { error: "Gateway auth is not configured (no token or password)." };
}
function pickFirstDefined(candidates) {
	for (const value of candidates) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed) return trimmed;
	}
	return null;
}
function resolveRequiredAuthLabel(mode, values) {
	if (mode === "token") return values.token ? { label: "token" } : { error: "Gateway auth is set to token, but no token is configured." };
	return values.password ? { label: "password" } : { error: "Gateway auth is set to password, but no password is configured." };
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
function buildMissingPairingScopeReply() {
	return { text: "⚠️ This command requires operator.pairing." };
}
function buildMissingSetupHandoffScopeReply() {
	return { text: "⚠️ Setup code handoff includes Talk secrets and requires operator.talk.secrets." };
}
//#endregion
export { buildMissingPairingScopeReply, buildMissingSetupHandoffScopeReply, resolveAuthLabel, resolvePairingCommandAuthState };
