import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { R as onUserProfilesChanged } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as createAdmittedRunOperatorAuthority, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as readOperatorModelPolicyMembership, t as prepareOperatorModelPolicy } from "./operator-model-policy-q5o4hsUa.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { o as prepareUserProfileIdentity } from "./user-profile-list-CtETKur7.mjs";
import { d as retainGatewayDeviceRevocation, l as readGatewayDeviceSourceAuthority, o as onGatewayDeviceSourceRevoked, u as readGatewayDeviceSourceIdentity } from "./device-revocation-DeateGFe.mjs";
import { a as onOperatorRolePolicyChanged, f as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { r as sourceRolePolicy } from "./operator-role-source-policy-DD1lr4qS.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-run-authority.ts
const operatorSources = /* @__PURE__ */ new WeakMap();
function getOperatorSources(client) {
	let sources = operatorSources.get(client);
	if (!sources) {
		sources = /* @__PURE__ */ new Set();
		operatorSources.set(client, sources);
	}
	return sources;
}
/** A captured transport principal keeps its source's comparison identity, not new authority. */
function transferGatewayOperatorSourceIdentity(source, target) {
	operatorSources.set(target, getOperatorSources(source));
}
function retainOperatorSource(client, owners, membership) {
	const sources = getOperatorSources(client);
	let source = membership === void 0 ? void 0 : [...sources].find((entry) => entry.membership === membership && entry.owners.every((owner, index) => owner === owners[index]));
	if (!source) {
		source = {
			owners,
			membership,
			token: Object.freeze({}),
			references: 0
		};
		sources.add(source);
	}
	const retained = source;
	const bucket = sources;
	retained.references += 1;
	return {
		token: retained.token,
		release: () => {
			if (--retained.references === 0) bucket.delete(retained);
		}
	};
}
function prepareRunRolePolicy(role) {
	return role ? {
		sessionAccessCap: role.sessions.others,
		sandboxRequired: role.sandbox === "required",
		agents: role.agents
	} : void 0;
}
function intersectRunModelPolicy(original, current) {
	return original && current && readOperatorModelPolicyMembership(original) !== readOperatorModelPolicyMembership(current) ? Object.freeze({
		models: Object.freeze(current.models.filter(original.allows)),
		allows: (ref) => original.allows(ref) && current.allows(ref)
	}) : current ?? original;
}
/** Bridge a prepared linked principal while retaining its exact channel admission capability. */
function captureChannelOperatorRunAuthority(input) {
	const params = { ...input };
	params.assertCurrent();
	let modelPolicyConfig = params.getRuntimeConfig();
	let modelPolicyMetadata = getProcessGatewayPluginMetadataSnapshot();
	const prepareModelPolicy = (cfg, metadata) => prepareOperatorModelPolicy({
		cfg,
		policy: resolveOperatorRolePolicyForAssignment(params.profileId, params.assignedRole, cfg, params.githubLogin ?? null)?.modelPolicy,
		manifestPlugins: metadata ?? []
	});
	const originalModelPolicy = prepareModelPolicy(modelPolicyConfig, modelPolicyMetadata);
	let modelPolicy = originalModelPolicy;
	return createAdmittedRunOperatorAuthority({
		profileId: params.profileId,
		scopes: params.scopes,
		rolePolicy: prepareRunRolePolicy(sourceRolePolicy(resolveOperatorRolePolicyForAssignment(params.profileId, params.assignedRole, modelPolicyConfig, params.githubLogin ?? null))),
		gatewayAccessGrant: params.gatewayAccessGrant,
		assertCurrent: params.assertCurrent,
		readCurrentRoleAssignment: () => {
			params.assertCurrent();
			return params.assignedRole;
		},
		readCurrentGithubLogin: () => {
			params.assertCurrent();
			return params.githubLogin ?? null;
		},
		get modelPolicy() {
			const cfg = params.getRuntimeConfig();
			const metadata = getProcessGatewayPluginMetadataSnapshot();
			if (cfg !== modelPolicyConfig || metadata !== modelPolicyMetadata) {
				const current = prepareModelPolicy(cfg, metadata);
				modelPolicy = intersectRunModelPolicy(originalModelPolicy, current);
				modelPolicyConfig = cfg;
				modelPolicyMetadata = metadata;
			}
			return modelPolicy;
		},
		onModelPolicyChanged: (listener) => {
			const releaseProfile = onUserProfilesChanged(listener);
			const releasePolicy = onOperatorRolePolicyChanged((change) => {
				if (change.kind === "config" || change.profileId === params.profileId) listener();
			});
			params.signal?.addEventListener("abort", listener, { once: true });
			return () => {
				releaseProfile();
				releasePolicy();
				params.signal?.removeEventListener("abort", listener);
			};
		}
	});
}
/** Transfers the original operator restriction into accepted work, independently of its request. */
async function captureGatewayOperatorRunAuthority(input) {
	const params = { ...input };
	const inherited = params.client?.internal?.operatorRunAuthority;
	if (inherited !== void 0) {
		assertAdmittedRunOperatorAuthority(inherited);
		inherited.assertCurrent();
		const scopes = intersectOperatorScopes(inherited.scopes, params.client?.connect.scopes ?? []);
		return {
			authority: roleScopesAllow({
				role: "operator",
				requestedScopes: inherited.scopes,
				allowedScopes: scopes
			}) ? inherited : createAdmittedRunOperatorAuthority({
				...inherited,
				scopes,
				get modelPolicy() {
					return inherited.modelPolicy;
				}
			}),
			release: inherited.retain?.() ?? (() => {})
		};
	}
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const client = params.client;
	const isAuthenticatedOwner = (currentActor) => client?.internal?.authenticatedOperator === true && (currentActor === void 0 || currentActor.kind === "system") && client.connect.role === "operator" && Boolean(client.connId) && !client.invalidated && !client.connectionSignal?.aborted && !client.internal.syntheticClient && !client.internal.agentRuntimeIdentity && !client.internal.agentToolCaller && client.authenticatedUserProfile?.profileId === "gateway-owner";
	const authenticatedOwner = isAuthenticatedOwner(actor);
	if (!client || actor?.kind !== "operator" && !authenticatedOwner) return;
	const profileId = actor?.kind === "operator" ? actor.profileId : GATEWAY_OWNER_PROFILE_ID;
	const connectionId = client.connId;
	const connectionSignal = client.connectionSignal;
	if (params.hasCurrentClientAuthority?.() === false) throw new Error("Gateway caller authority is no longer active.");
	const releaseDevice = retainGatewayDeviceRevocation(params.hasCurrentClientAuthority);
	const isSourceCurrent = readGatewayDeviceSourceAuthority(params.hasCurrentClientAuthority);
	const resolveGatewayContext = params.context.resolveGatewayContext;
	const gatewayContext = resolveGatewayContext?.();
	const getConfig = params.context.getCommittedRuntimeConfig ?? params.context.getRuntimeConfig;
	let modelPolicyConfig = getConfig();
	let modelPolicyMetadata = getProcessGatewayPluginMetadataSnapshot();
	let modelPolicy;
	let originalModelPolicy;
	const isGatewayCurrent = () => !resolveGatewayContext || gatewayContext !== void 0 && resolveGatewayContext() === gatewayContext;
	const sourceAuthority = params.sourceAuthority !== void 0 ? params.sourceAuthority : client.internal?.operatorAccessAuthority;
	const sourceAuthorities = [sourceAuthority, params.invocationAuthority];
	const scopes = Object.freeze([...client.connect.scopes ?? []]);
	const sourceOwners = [
		gatewayContext ?? params.context,
		resolveGatewayContext,
		getConfig,
		readGatewayDeviceSourceIdentity(params.hasCurrentClientAuthority) ?? (params.hasCurrentClientAuthority ? Object.freeze({}) : void 0),
		sourceAuthority,
		params.invocationAuthority
	];
	let releaseSource;
	let references = 1;
	let revoked = false;
	const revocation = new AbortController();
	const subscriptions = [];
	let preparedProfile;
	const assertProfileCurrent = () => {
		try {
			const profile = preparedProfile?.readCurrentProfile();
			if (!profile || profile.profileId !== profileId) throw new Error("operator profile is unavailable");
			return profile;
		} catch (error) {
			throw new Error("operator source identity changed; start a new request", { cause: error });
		}
	};
	const resolveCurrentRole = (cfg = getConfig()) => {
		const profile = assertProfileCurrent();
		return resolveOperatorRolePolicyForAssignment(profileId, profile.assignedRole, cfg, profile.githubLogin ?? null);
	};
	const assertRoleCurrent = () => {
		const policy = resolveCurrentRole();
		if (policy && !roleScopesAllow({
			role: "operator",
			requestedScopes: scopes,
			allowedScopes: policy.scopes
		})) throw new Error("Your operator role changed; reconnect before continuing.");
	};
	const readModelPolicy = () => {
		const original = originalModelPolicy;
		const cfg = getConfig();
		const metadata = getProcessGatewayPluginMetadataSnapshot();
		if (cfg !== modelPolicyConfig || metadata !== modelPolicyMetadata) {
			modelPolicy = intersectRunModelPolicy(original, prepareOperatorModelPolicy({
				cfg,
				policy: resolveCurrentRole(cfg)?.modelPolicy,
				manifestPlugins: metadata ?? []
			}));
			modelPolicyConfig = cfg;
			modelPolicyMetadata = metadata;
		}
		return modelPolicy;
	};
	const revoke = (reason) => {
		if (references > 0 && isGatewayCurrent()) {
			revoked = true;
			revocation.abort(reason);
		}
	};
	const recheck = (check) => {
		if (!revoked && references > 0 && isGatewayCurrent()) try {
			check();
		} catch (error) {
			revoke(error);
		}
	};
	const assertSourceCurrent = () => {
		if (revoked || references === 0) throw new Error("operator execution authority is no longer active");
		if (isSourceCurrent?.() === false || !isGatewayCurrent()) throw new Error("operator source authority is no longer active");
		for (const authority of sourceAuthorities) {
			authority?.signal?.throwIfAborted();
			authority?.assertCurrent();
			authority?.signal?.throwIfAborted();
		}
		if (revoked || references === 0) throw new Error("operator execution authority is no longer active");
	};
	const assertCurrent = () => {
		try {
			assertSourceCurrent();
			assertRoleCurrent();
		} catch (error) {
			revoked = true;
			throw error;
		}
	};
	const releaseHold = () => {
		let released = false;
		return () => {
			if (!released) {
				released = true;
				if (--references === 0) {
					releaseSource?.();
					releaseSource = void 0;
					for (const unsubscribe of subscriptions.splice(0)) unsubscribe?.();
					preparedProfile?.release();
					releaseDevice?.();
				}
			}
		};
	};
	const release = releaseHold();
	try {
		const initialRoleConfig = { gateway: { roles: structuredClone(modelPolicyConfig.gateway?.roles) } };
		const preparationConfigs = [initialRoleConfig];
		let onConfigChange = () => {
			preparationConfigs.push({ gateway: { roles: structuredClone(getConfig().gateway?.roles) } });
		};
		let profileChangedDuringPreparation = false;
		let onProfileChange = () => {
			profileChangedDuringPreparation = true;
		};
		subscriptions.push(onGatewayDeviceSourceRevoked(params.hasCurrentClientAuthority, () => revoke(/* @__PURE__ */ new Error("operator source authority is no longer active"))), onUserProfilesChanged(() => onProfileChange()), onOperatorRolePolicyChanged((change) => {
			if (change.kind === "assignment" && change.profileId === profileId) revoke(/* @__PURE__ */ new Error("Your operator role changed; reconnect before continuing."));
			else if (change.kind === "config" && change.context === (gatewayContext ?? params.context)) onConfigChange();
		}));
		for (const authority of sourceAuthorities) {
			const sourceSignal = authority?.signal;
			if (sourceSignal) {
				const onAbort = () => revoke(sourceSignal.reason);
				sourceSignal.addEventListener("abort", onAbort, { once: true });
				subscriptions.push(() => sourceSignal.removeEventListener("abort", onAbort));
			}
		}
		assertSourceCurrent();
		preparedProfile = await prepareUserProfileIdentity(profileId);
		const currentActor = resolveGatewayOperatorRoleActor(params.client);
		const originalActorCurrent = authenticatedOwner ? isAuthenticatedOwner(currentActor) && client.connId === connectionId && client.connectionSignal === connectionSignal : currentActor?.kind === "operator" && currentActor.profileId === profileId;
		if (params.client !== client || !originalActorCurrent || params.hasCurrentClientAuthority?.() === false || !isGatewayCurrent() || !roleScopesAllow({
			role: "operator",
			requestedScopes: scopes,
			allowedScopes: client.connect.scopes ?? []
		})) throw new Error("Gateway caller authority is no longer active.");
		const capturedProfile = assertProfileCurrent();
		const capturedAssignedRole = capturedProfile.assignedRole;
		const capturedGithubLogin = capturedProfile.githubLogin ?? null;
		const capturedRole = structuredClone(resolveCurrentRole());
		const capturedSourcePolicy = sourceRolePolicy(capturedRole);
		if (preparationConfigs.some((config) => !isDeepStrictEqual(capturedSourcePolicy, sourceRolePolicy(resolveOperatorRolePolicyForAssignment(profileId, capturedAssignedRole, config, capturedGithubLogin))))) revoke(/* @__PURE__ */ new Error("Your operator role changed; reconnect before continuing."));
		const assertCapturedRoleCurrent = () => {
			const current = assertProfileCurrent();
			const policy = resolveOperatorRolePolicyForAssignment(profileId, current.assignedRole, getConfig(), current.githubLogin ?? null);
			if (current.assignedRole !== capturedAssignedRole || !isDeepStrictEqual(capturedSourcePolicy, sourceRolePolicy(policy))) throw new Error("Your operator role changed; reconnect before continuing.");
		};
		onConfigChange = () => recheck(assertCapturedRoleCurrent);
		onProfileChange = () => recheck(assertCapturedRoleCurrent);
		if (profileChangedDuringPreparation) onProfileChange();
		assertCurrent();
		originalModelPolicy = prepareOperatorModelPolicy({
			cfg: modelPolicyConfig,
			policy: resolveOperatorRolePolicyForAssignment(profileId, capturedAssignedRole, initialRoleConfig, capturedGithubLogin)?.modelPolicy,
			manifestPlugins: modelPolicyMetadata ?? []
		});
		modelPolicy = originalModelPolicy;
		preparationConfigs.length = 0;
		const source = retainOperatorSource(client, sourceOwners, readOperatorModelPolicyMembership(originalModelPolicy));
		releaseSource = source.release;
		return {
			authority: createAdmittedRunOperatorAuthority({
				profileId,
				scopes,
				rolePolicy: prepareRunRolePolicy(capturedSourcePolicy),
				readCurrentRoleAssignment: () => {
					assertCurrent();
					return assertProfileCurrent().assignedRole;
				},
				readCurrentGithubLogin: () => {
					assertCurrent();
					return assertProfileCurrent().githubLogin ?? null;
				},
				gatewayAccessGrant: sourceAuthority === null || sourceAuthority === void 0 && authenticatedOwner ? null : sourceAuthority?.gatewayAccessGrant,
				source: source.token,
				assertCurrent,
				signal: revocation.signal,
				retain: () => {
					assertCurrent();
					references += 1;
					return releaseHold();
				},
				get modelPolicy() {
					return readModelPolicy();
				},
				onModelPolicyChanged: (listener) => onOperatorRolePolicyChanged((change) => {
					if (change.kind === "config" && change.context === (gatewayContext ?? params.context)) listener();
				})
			}),
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { captureGatewayOperatorRunAuthority as n, transferGatewayOperatorSourceIdentity as r, captureChannelOperatorRunAuthority as t };
