import { r as getPluginRegistryState } from "./runtime-state-C5tDvNBc.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { B as readUserProfileVersion, N as onUserProfilesChanged } from "./user-profiles-internal-BxQLnWfo.mjs";
import { i as getUserProfileListItem } from "./user-profiles-BA6bh7Le.mjs";
import { f as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-BNrKHiJ3.mjs";
//#region src/gateway/operator-access-policy.ts
const GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE = "Gateway access is no longer active; ask a Gateway administrator to restore it.";
var GatewayOperatorAccessDeniedError = class extends Error {
	constructor() {
		super(GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE);
		this.name = "GatewayOperatorAccessDeniedError";
	}
};
var GatewayOperatorAccessUnavailableError = class extends Error {
	constructor() {
		super("Gateway access policy is unavailable; retry after its plugin is ready.");
		this.name = "GatewayOperatorAccessUnavailableError";
	}
};
const profileAccessChecks = /* @__PURE__ */ new WeakMap();
const profileAccessCleanup = new FinalizationRegistry((release) => release());
function watchProfileAccess(reference, token) {
	const unsubscribe = onUserProfilesChanged(() => {
		const check = reference.deref();
		if (check) try {
			check();
			return;
		} catch {}
		release();
	});
	function release() {
		unsubscribe();
		profileAccessCleanup.unregister(token);
	}
	return release;
}
function currentAccessPolicies() {
	const registry = getPluginRegistryState()?.activeRegistry;
	return registry?.gatewayAccessPolicies?.filter((registration) => registry.plugins.some((plugin) => plugin.id === registration.pluginId && plugin.enabled && plugin.status === "loaded")) ?? [];
}
function hasGatewayOperatorAccessPolicies(config) {
	return currentAccessPolicies().length > 0 || Object.values(config.gateway?.roles?.definitions ?? {}).some((role) => role.accessPolicyPlugin);
}
/** Bind additional access to this exact authenticated person and the original policy lifetimes. */
function resolveGatewayOperatorAccessAuthority(profileId, config) {
	if (profileId === "gateway-owner") return null;
	if (!hasGatewayOperatorAccessPolicies(config)) return null;
	const profile = getUserProfileListItem(profileId);
	const emails = [...profile.emails];
	let profileVersion = readUserProfileVersion();
	return resolvePreparedGatewayOperatorAccessAuthority({
		profileId: profile.id,
		emails,
		role: profile.role ?? null,
		isCurrent: () => {
			if (profile.id !== profileId) return false;
			const currentVersion = readUserProfileVersion();
			if (currentVersion !== profileVersion) {
				const current = getUserProfileListItem(profileId);
				const currentEmails = new Set(current.emails);
				if (current.id !== profileId || emails.some((email) => !currentEmails.has(email))) return false;
				profileVersion = currentVersion;
			}
			return true;
		}
	}, config);
}
/** Worker-prepared person facts retain their owner's memory-only identity lifetime. */
function resolvePreparedGatewayOperatorAccessAuthority(profile, config) {
	if (profile.profileId === "gateway-owner") return null;
	const policies = currentAccessPolicies();
	if (policies.length === 0 && !hasGatewayOperatorAccessPolicies(config)) return null;
	const emails = [...profile.emails];
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(profile.profileId, profile.role, config)?.accessPolicyPlugin;
	if (requiredPlugin && !policies.some((entry) => entry.pluginId === requiredPlugin)) throw new GatewayOperatorAccessDeniedError();
	const invalidated = new AbortController();
	let signal = invalidated.signal;
	let denial;
	const invalidate = () => {
		denial ??= new GatewayOperatorAccessDeniedError();
		invalidated.abort(denial);
		return denial;
	};
	const assertProfileCurrent = () => {
		try {
			signal.throwIfAborted();
			if (!profile.isCurrent()) throw new GatewayOperatorAccessDeniedError();
		} catch {
			throw invalidate();
		}
	};
	const token = {};
	const releaseProfiles = watchProfileAccess(new WeakRef(assertProfileCurrent), token);
	profileAccessCleanup.register(assertProfileCurrent, releaseProfiles, token);
	try {
		assertProfileCurrent();
		let requiredPolicyConfirmed = !requiredPlugin;
		const authorities = policies.flatMap(({ policy, pluginId }) => {
			const authority = policy.authorize({
				config,
				profile: {
					profileId: profile.profileId,
					emails: [...emails],
					assignedRole: profile.role
				},
				requiredByRole: pluginId === requiredPlugin
			});
			if (authority && pluginId === requiredPlugin) requiredPolicyConfirmed = true;
			return authority ? [{
				pluginId,
				authority
			}] : [];
		});
		if (!requiredPolicyConfirmed) throw new GatewayOperatorAccessDeniedError();
		if (authorities.length === 0) {
			releaseProfiles();
			return null;
		}
		signal = AbortSignal.any([invalidated.signal, ...authorities.map(({ authority }) => authority.signal)]);
		const assertCurrent = () => {
			try {
				assertProfileCurrent();
				for (const { authority } of authorities) authority.assertCurrent();
			} catch {
				releaseProfiles();
				throw invalidate();
			}
		};
		profileAccessChecks.set(signal, assertCurrent);
		assertCurrent();
		const original = authorities.length === 1 ? authorities[0] : void 0;
		return {
			assertCurrent,
			signal,
			gatewayAccessGrant: original?.authority.grantId ? Object.freeze({
				pluginId: original.pluginId,
				grantId: original.authority.grantId
			}) : void 0
		};
	} catch {
		releaseProfiles();
		throw invalidate();
	}
}
/** The caller supplies current profile facts and rechecks its retained authority after callbacks. */
function resumeGatewayOperatorAccessGrant(profile, config, grant) {
	const policies = currentAccessPolicies();
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, config)?.accessPolicyPlugin;
	if (requiredPlugin && requiredPlugin !== grant?.pluginId) throw new GatewayOperatorAccessDeniedError();
	const context = {
		config,
		profile
	};
	if (grant) {
		const policy = policies.find(({ pluginId }) => pluginId === grant.pluginId)?.policy;
		if (!policy?.resume) throw new GatewayOperatorAccessUnavailableError();
		let authority;
		try {
			authority = policy.resume({
				...context,
				grantId: grant.grantId,
				requiredByRole: requiredPlugin === grant.pluginId
			});
			authority?.signal.throwIfAborted();
			authority?.assertCurrent();
		} catch {
			throw new GatewayOperatorAccessUnavailableError();
		}
		if (!authority || authority.grantId !== grant.grantId) throw new GatewayOperatorAccessDeniedError();
	}
	for (const { pluginId, policy } of policies) {
		if (pluginId === grant?.pluginId) continue;
		let authority;
		try {
			authority = policy.authorize({
				...context,
				requiredByRole: requiredPlugin === pluginId
			});
		} catch {
			throw new GatewayOperatorAccessUnavailableError();
		}
		if (authority) throw new GatewayOperatorAccessDeniedError();
	}
}
function hasCurrentGatewayOperatorAccess(authority) {
	try {
		authority?.signal.throwIfAborted();
		authority?.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { hasGatewayOperatorAccessPolicies as a, resumeGatewayOperatorAccessGrant as c, hasCurrentGatewayOperatorAccess as i, GatewayOperatorAccessDeniedError as n, resolveGatewayOperatorAccessAuthority as o, GatewayOperatorAccessUnavailableError as r, resolvePreparedGatewayOperatorAccessAuthority as s, GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE as t };
