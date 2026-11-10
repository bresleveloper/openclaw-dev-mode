import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { c as onUserProfilesChanged, g as readUserProfileVersion } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
import { p as resolveOperatorRolePolicyForAssignment } from "./operator-role-policy-Coro3qc5.mjs";
//#region src/gateway/operator-access-policy.ts
const GATEWAY_OPERATOR_ACCESS_DENIED_MESSAGE = "Gateway access is not active for this account; ask a Gateway administrator to grant or restore access.";
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
	return usesGitHubRoleAssignments(config, null) || currentAccessPolicies().length > 0 || Object.values(config.gateway?.roles?.definitions ?? {}).some((role) => role.accessPolicyPlugin);
}
function usesGitHubRoleAssignments(config, assignedRole) {
	const roles = config.gateway?.roles;
	return Boolean(roles && Object.keys(roles.assignments?.byGithubLogin ?? {}).length > 0 && (!assignedRole || !Object.hasOwn(roles.definitions, assignedRole)));
}
function pluginProfile(profile, assignedRole) {
	return {
		profileId: profile.profileId,
		emails: [...profile.emails],
		...profile.githubAccountIds ? { githubAccountIds: [...profile.githubAccountIds] } : {},
		assignedRole
	};
}
/** Bind additional access to this exact authenticated person and the original policy lifetimes. */
function resolveGatewayOperatorAccessAuthority(profileId, config, options = {}) {
	if (profileId === "gateway-owner") return null;
	if (!options.requireLivePolicySet && !hasGatewayOperatorAccessPolicies(config)) return null;
	const resident = captureResidentUserProfileAccess(profileId);
	const profile = resident.readCurrentFacts();
	const emails = [...profile.emails];
	const githubAccountIds = [...profile.githubAccountIds ?? []];
	const usesGithubAssignments = usesGitHubRoleAssignments(config, profile.assignedRole);
	let profileVersion = readUserProfileVersion();
	return resolvePreparedGatewayOperatorAccessAuthority({
		profileId: profile.profileId,
		emails,
		githubAccountIds,
		role: profile.assignedRole,
		githubLogin: profile.githubLogin ?? null,
		isCurrent: () => {
			resident.assertCurrent();
			if (profile.profileId !== profileId) return false;
			const currentVersion = readUserProfileVersion();
			if (currentVersion !== profileVersion) {
				const current = resident.readCurrentFacts();
				const currentEmails = new Set(current.emails);
				if (current.profileId !== profileId || usesGithubAssignments && current.githubLogin !== profile.githubLogin || emails.some((email) => !currentEmails.has(email)) || githubAccountIds.some((accountId) => !current.githubAccountIds?.includes(accountId))) return false;
				profileVersion = currentVersion;
			}
			return true;
		}
	}, config, options);
}
/** Worker-prepared person facts retain their owner's memory-only identity lifetime. */
function resolvePreparedGatewayOperatorAccessAuthority(profile, config, options = {}) {
	if (profile.profileId === "gateway-owner") return null;
	const policies = currentAccessPolicies();
	if (!options.requireLivePolicySet && policies.length === 0 && !hasGatewayOperatorAccessPolicies(config)) return null;
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(profile.profileId, profile.role, config, profile.githubLogin ?? null)?.accessPolicyPlugin;
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
				profile: pluginProfile(profile, profile.role),
				requiredByRole: pluginId === requiredPlugin
			});
			if (authority && pluginId === requiredPlugin) requiredPolicyConfirmed = true;
			return authority ? [{
				pluginId,
				authority
			}] : [];
		});
		if (!requiredPolicyConfirmed) throw new GatewayOperatorAccessDeniedError();
		if (!options.requireLivePolicySet && authorities.length === 0 && !usesGitHubRoleAssignments(config, profile.role)) {
			releaseProfiles();
			return null;
		}
		signal = AbortSignal.any([invalidated.signal, ...authorities.map(({ authority }) => authority.signal)]);
		const assertCurrent = () => {
			try {
				assertProfileCurrent();
				if (options.requireLivePolicySet) {
					const current = currentAccessPolicies();
					if (current.length !== policies.length || current.some((entry, index) => entry !== policies[index])) throw new GatewayOperatorAccessDeniedError();
				}
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
			}) : authorities.length === 0 ? null : void 0
		};
	} catch {
		releaseProfiles();
		throw invalidate();
	}
}
/** Recheck current facts, returning the original grant's live authority for retained work. */
function resumeGatewayOperatorAccessGrant(profile, config, grant, retained) {
	const policies = currentAccessPolicies();
	const requiredPlugin = resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, config, profile.githubLogin ?? null)?.accessPolicyPlugin;
	if (requiredPlugin && requiredPlugin !== grant?.pluginId) throw new GatewayOperatorAccessDeniedError();
	const context = {
		config,
		profile: pluginProfile(profile, profile.assignedRole)
	};
	let resumed;
	if (grant) {
		const policy = policies.find(({ pluginId }) => pluginId === grant.pluginId)?.policy;
		if (!policy?.resume) throw new GatewayOperatorAccessUnavailableError();
		let authority;
		try {
			authority = retained ?? policy.resume({
				...context,
				grantId: grant.grantId,
				requiredByRole: requiredPlugin === grant.pluginId
			});
		} catch {
			throw new GatewayOperatorAccessUnavailableError();
		}
		if (!authority || authority.grantId !== grant.grantId) throw new GatewayOperatorAccessDeniedError();
		resumed = authority;
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
	try {
		resumed?.signal.throwIfAborted();
		resumed?.assertCurrent();
	} catch {
		throw new GatewayOperatorAccessUnavailableError();
	}
	return resumed;
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
