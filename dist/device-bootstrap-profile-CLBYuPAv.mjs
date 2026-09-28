import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.mjs";
//#region src/shared/device-bootstrap-profile.ts
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES = [
	"operator.approvals",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET = new Set(BOOTSTRAP_HANDOFF_OPERATOR_SCOPES);
/** Full browser-owner scopes allowed only by the host-issued Control UI profile. */
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES = [
	"operator.admin",
	"operator.approvals",
	"operator.pairing",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET = new Set(CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES);
/** Full native-mobile operator scopes allowed only by the closed mobile setup profile. */
const MOBILE_FULL_ACCESS_OPERATOR_SCOPES = ["operator.admin", ...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES];
const MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET = new Set(MOBILE_FULL_ACCESS_OPERATOR_SCOPES);
const VOICE_NODE_OPERATOR_SCOPE_SET = /* @__PURE__ */ new Set(["operator.read", "operator.talk"]);
/** Existing least-privilege setup-code/QR profile. */
const PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES]
};
/** Full browser-owner profile issued only by dashboard and graphical onboarding. */
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE = {
	roles: ["operator"],
	scopes: [...CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES],
	purpose: "control-ui-owner"
};
/** Full native-mobile setup profile for explicitly authorized setup surfaces. */
const FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...MOBILE_FULL_ACCESS_OPERATOR_SCOPES],
	purpose: "mobile-full"
};
/** Node-only setup profile for companions that never act as operators. */
const NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node"],
	scopes: []
};
/** Environment-owned node profile removed when its cloud lease is released. */
const CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node"],
	scopes: [],
	purpose: "cloud-worker"
};
/** Room/embedded voice profile: node capabilities plus least-privilege Talk RPCs. */
const VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: ["operator.read", "operator.talk"],
	purpose: "voice-node"
};
/** Compare normalized bootstrap profiles, including their closed purpose. */
function deviceBootstrapProfilesEqual(left, right) {
	const profile = normalizeDeviceBootstrapProfile(left);
	const expected = normalizeDeviceBootstrapProfile(right);
	return profile.purpose === expected.purpose && profile.roles.length === expected.roles.length && profile.scopes.length === expected.scopes.length && profile.roles.every((role, index) => role === expected.roles[index]) && profile.scopes.every((scope, index) => scope === expected.scopes[index]);
}
function matchesBootstrapProfile(input, expected) {
	return deviceBootstrapProfilesEqual(input, expected);
}
/** Return whether an input matches either supported native-mobile setup profile. */
function isMobilePairingSetupBootstrapProfile(input) {
	return isPairingSetupBootstrapProfile(input) || matchesBootstrapProfile(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the existing limited setup profile. */
function isPairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the node-only companion setup profile. */
function isNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE) || matchesBootstrapProfile(input, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
function resolvePairingSetupAccess(input) {
	if (deviceBootstrapProfilesEqual(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "full";
	if (deviceBootstrapProfilesEqual(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE) || deviceBootstrapProfilesEqual(input, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "node";
	return "limited";
}
/** Return whether an input exactly matches the embedded voice-node setup profile. */
function isVoiceNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Resolve the subset of requested scopes a bootstrap profile may carry for one role. */
function resolveBootstrapProfileScopesForRole(role, scopes, purpose) {
	const normalizedRole = normalizeDeviceAuthRole(role);
	const normalizedScopes = normalizeDeviceAuthScopes(Array.from(scopes));
	if (normalizedRole === "operator") {
		const allowedScopes = purpose === "control-ui-owner" ? CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET : purpose === "mobile-full" ? MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET : purpose === "voice-node" ? VOICE_NODE_OPERATOR_SCOPE_SET : BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET;
		return normalizedScopes.filter((scope) => allowedScopes.has(scope));
	}
	return [];
}
/** Resolve bounded bootstrap handoff scopes across a role set. */
function resolveBootstrapProfileScopesForRoles(roles, scopes, purpose) {
	return normalizeDeviceAuthScopes(roles.flatMap((role) => resolveBootstrapProfileScopesForRole(role, scopes, purpose)));
}
/** Resolve one role's scopes directly from a normalized bootstrap profile. */
function resolveDeviceProfileRoleScopes(profile, role, scopes = profile.scopes) {
	return resolveBootstrapProfileScopesForRole(role, scopes, profile.purpose);
}
/** Resolve role-set scopes directly from a normalized bootstrap profile. */
function resolveDeviceProfileScopes(profile, roles, scopes = profile.scopes) {
	return resolveBootstrapProfileScopesForRoles(roles, scopes, profile.purpose);
}
/** Normalize a requested bootstrap profile and strip scopes outside the handoff allowlist. */
function normalizeDeviceBootstrapHandoffProfile(input) {
	const profile = normalizeDeviceBootstrapProfile(input);
	return {
		roles: profile.roles,
		scopes: resolveBootstrapProfileScopesForRoles(profile.roles, profile.scopes, profile.purpose),
		...profile.purpose ? { purpose: profile.purpose } : {}
	};
}
function normalizeBootstrapRoles(roles) {
	if (!Array.isArray(roles)) return [];
	const out = /* @__PURE__ */ new Set();
	for (const role of roles) {
		const normalized = normalizeDeviceAuthRole(role);
		if (normalized) out.add(normalized);
	}
	return [...out].toSorted();
}
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
function normalizeDeviceBootstrapProfile(input) {
	const purpose = input?.purpose === "control-ui" || input?.purpose === "control-ui-owner" || input?.purpose === "mobile-full" || input?.purpose === "voice-node" || input?.purpose === "cloud-worker" ? input.purpose : void 0;
	return {
		roles: normalizeBootstrapRoles(input?.roles),
		scopes: normalizeDeviceAuthScopes(input?.scopes ? [...input.scopes] : []),
		...purpose ? { purpose } : {}
	};
}
//#endregion
export { resolveDeviceProfileScopes as _, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as a, deviceBootstrapProfilesEqual as c, isVoiceNodePairingSetupBootstrapProfile as d, normalizeDeviceBootstrapHandoffProfile as f, resolveDeviceProfileRoleScopes as g, resolveBootstrapProfileScopesForRoles as h, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE as i, isMobilePairingSetupBootstrapProfile as l, resolveBootstrapProfileScopesForRole as m, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE as n, PAIRING_SETUP_BOOTSTRAP_PROFILE as o, normalizeDeviceBootstrapProfile as p, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE as r, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as s, BOOTSTRAP_HANDOFF_OPERATOR_SCOPES as t, isNodePairingSetupBootstrapProfile as u, resolvePairingSetupAccess as v };
