import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { Et as _enum, Jn as string, Lt as boolean, Nt as array, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as getProcessGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { c as onUserProfilesChanged } from "./user-profile-events-CXjmX5Qy.mjs";
import { n as GatewayOperatorRoleDefinitionSchema } from "./zod-schema.gateway-DYzs4yT2.mjs";
import { o as createAdmittedRunOperatorAuthority, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { a as roleScopesAllow, t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { l as isWebchatClient, n as isBrowserOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { l as prepareUserProfileIdentity } from "./user-profile-list-BdNJnrJe.mjs";
import { a as onOperatorRolePolicyChanged, p as resolveOperatorRolePolicyForAssignment, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { d as readGatewayDeviceSourceIdentity, f as retainGatewayDeviceRevocation, s as onGatewayDeviceSourceRevoked, u as readGatewayDeviceSourceAuthority } from "./device-revocation-DpGQRUdo.mjs";
import { n as prepareOperatorModelPolicy, r as readOperatorModelPolicyMembership, t as captureOperatorModelPolicySnapshot } from "./operator-model-policy-3pT6BgLA.mjs";
import { i as bindSharedGatewayOwnerRunAuthority } from "./host-private-capabilities-eTr803c9.mjs";
import { r as sourceRolePolicy } from "./operator-role-source-policy-BO9lXFYe.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-run-recovery-source.ts
const MAX_RECOVERY_SOURCE_BYTES = 65536;
const boundedString = string().min(1).max(4096);
const refs = strictObject({
	exact: array(boundedString).max(4096),
	wildcards: array(boundedString).max(256)
});
const snapshotSchema = strictObject({
	profileId: boundedString,
	scopes: array(boundedString).max(64),
	assignedRole: boundedString.nullable(),
	githubLogin: boundedString.nullable(),
	rolePolicy: GatewayOperatorRoleDefinitionSchema.omit({ modelPolicy: true }).optional(),
	modelPolicy: strictObject({
		models: array(strictObject({
			provider: boundedString,
			model: boundedString
		})).max(4096),
		allowed: refs,
		denied: refs
	}).optional(),
	grant: strictObject({
		pluginId: boundedString,
		grantId: boundedString
	}).nullable(),
	aliasBindingIds: array(boundedString).max(256),
	authPolicy: strictObject({
		generation: literal(""),
		grantGeneration: boundedString,
		role: literal("operator"),
		authMethod: _enum([
			"token",
			"password",
			"device-token",
			"tailscale",
			"trusted-proxy"
		]),
		authModeOverride: _enum([
			"none",
			"token",
			"password",
			"trusted-proxy"
		]).optional(),
		verifiedIdentity: boundedString.optional(),
		browserOrigin: strictObject({
			requestHost: boundedString.optional(),
			origin: boundedString.optional(),
			isLocalClient: boolean().optional()
		}).optional()
	}),
	sharedGeneration: boundedString.optional(),
	device: strictObject({
		deviceId: boundedString,
		key: string().regex(/^[a-f0-9]{64}$/)
	}).optional(),
	controlUiAdmin: boolean(),
	localOperator: boolean(),
	sourceIngress: _enum(["control-ui", "internal"])
});
const sourceSchema = strictObject({
	version: literal(1),
	agentId: boundedString,
	sessionKey: boundedString,
	sessionId: boundedString,
	lifecycleRevision: boundedString.optional(),
	sourceRunId: boundedString,
	snapshot: snapshotSchema
});
function decodeGatewayOperatorRecoverySource(value) {
	const json = JSON.stringify(value);
	if (!json || Buffer.byteLength(json, "utf8") > MAX_RECOVERY_SOURCE_BYTES) throw new Error("Restart recovery operator source exceeds its storage bound.");
	const parsed = sourceSchema.safeParse(value);
	if (!parsed.success) throw new Error("Restart recovery operator source is invalid; start a new user turn.");
	return freezeJsonSnapshot(parsed.data);
}
/** Capture only handshake-attested input; internal callers cannot manufacture a durable source. */
function captureGatewayOperatorRecoverySnapshot(params) {
	const { client, authority, identity } = params;
	if (!client.internal?.authenticatedOperator || client.internal.syntheticClient || !client.authPolicy?.authMethod || authority.gatewayAccessGrant === void 0) return;
	authority.assertCurrent();
	const device = client.internal.operatorDeviceTokenIdentity ?? void 0;
	if (client.connect.device && client.internal.operatorDeviceTokenIdentity === void 0) return;
	const sharedGeneration = client.usesSharedGatewayAuth ? client.sharedGatewaySessionGeneration : void 0;
	if (client.usesSharedGatewayAuth && sharedGeneration === void 0) return;
	const modelPolicy = captureOperatorModelPolicySnapshot(params.modelPolicy);
	if (params.modelPolicy && !modelPolicy) return;
	const profile = identity.readCurrentProfile();
	const source = {
		profileId: authority.profileId,
		scopes: [...authority.scopes],
		assignedRole: profile.assignedRole,
		githubLogin: profile.githubLogin ?? null,
		rolePolicy: sourceRolePolicy(resolveOperatorRolePolicyForAssignment(profile.profileId, profile.assignedRole, params.config, profile.githubLogin ?? null)),
		modelPolicy,
		grant: authority.gatewayAccessGrant,
		aliasBindingIds: identity.emailBindingIds,
		authPolicy: {
			...client.authPolicy,
			generation: ""
		},
		sharedGeneration,
		device,
		controlUiAdmin: client.internal.controlUiAdmin === true,
		localOperator: client.internal.isLocalClient === true,
		sourceIngress: isBrowserOperatorUiClient(client.connect.client) ? "control-ui" : "internal"
	};
	const json = JSON.stringify(source);
	if (Buffer.byteLength(json, "utf8") > MAX_RECOVERY_SOURCE_BYTES) return;
	const parsed = snapshotSchema.safeParse(JSON.parse(json));
	return parsed.success ? freezeJsonSnapshot(parsed.data) : void 0;
}
//#endregion
//#region src/gateway/operator-run-authority.ts
const operatorSources = /* @__PURE__ */ new WeakMap();
const continuationAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.gatewayOperatorContinuationAuthorities"), () => /* @__PURE__ */ new WeakMap());
/** Accepted continuations retain policy custody independently of a recovered work claim. */
function bindGatewayOperatorContinuationAuthority(work, source) {
	continuationAuthorities.set(work, source);
}
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
function intersectOperatorRunModelPolicy(original, current) {
	return original && current && readOperatorModelPolicyMembership(original) !== readOperatorModelPolicyMembership(current) ? Object.freeze({
		models: Object.freeze(current.models.filter(original.allows)),
		allows: (ref) => original.allows(ref) && current.allows(ref)
	}) : current ?? original;
}
/** Keep the admission ceiling while refreshing only committed config/metadata views. */
function prepareRunModelPolicy(params) {
	let { cfg, metadata } = params;
	const original = prepareOperatorModelPolicy({
		cfg,
		policy: params.initialPolicy,
		manifestPlugins: metadata ?? []
	});
	let policy = original;
	return {
		original,
		readCurrent: () => {
			const nextConfig = params.getConfig();
			const nextMetadata = getProcessGatewayPluginMetadataSnapshot();
			if (nextConfig !== cfg || nextMetadata !== metadata) {
				const current = prepareOperatorModelPolicy({
					cfg: nextConfig,
					policy: params.resolvePolicy(nextConfig),
					manifestPlugins: nextMetadata ?? []
				});
				policy = intersectOperatorRunModelPolicy(original, current);
				cfg = nextConfig;
				metadata = nextMetadata;
			}
			return policy;
		}
	};
}
/** Bridge a prepared linked principal while retaining its exact channel admission capability. */
function captureChannelOperatorRunAuthority(input) {
	const params = { ...input };
	params.assertCurrent();
	const initialConfig = params.getRuntimeConfig();
	const metadata = getProcessGatewayPluginMetadataSnapshot();
	const resolveRole = (cfg) => resolveOperatorRolePolicyForAssignment(params.profileId, params.assignedRole, cfg, params.githubLogin ?? null);
	const role = resolveRole(initialConfig);
	const modelPolicy = prepareRunModelPolicy({
		cfg: initialConfig,
		metadata,
		initialPolicy: role?.modelPolicy,
		getConfig: params.getRuntimeConfig,
		resolvePolicy: (cfg) => resolveRole(cfg)?.modelPolicy
	});
	return createAdmittedRunOperatorAuthority({
		profileId: params.profileId,
		scopes: params.scopes,
		rolePolicy: prepareRunRolePolicy(sourceRolePolicy(role)),
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
			return modelPolicy.readCurrent();
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
		const continuation = continuationAuthorities.get(inherited);
		const source = params.independentContinuation ? continuation ?? inherited : inherited;
		const authority = roleScopesAllow({
			role: "operator",
			requestedScopes: source.scopes,
			allowedScopes: scopes
		}) ? source : createAdmittedRunOperatorAuthority({
			...source,
			scopes,
			get modelPolicy() {
				return source.modelPolicy;
			}
		});
		if (continuation && !params.independentContinuation && authority !== inherited) continuationAuthorities.set(authority, continuation);
		return {
			authority,
			release: source.retain?.() ?? (() => {})
		};
	}
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const client = params.client;
	const ingressPrincipal = client?.internal?.remoteIngressPrincipal;
	const isAuthenticatedOwner = (currentActor) => client?.internal?.authenticatedOperator === true && (currentActor === void 0 || currentActor.kind === "system") && client.connect.role === "operator" && (Boolean(client.connId) || ingressPrincipal !== void 0 && client.internal.remoteIngressPrincipal === ingressPrincipal && ingressPrincipal.operatorRoleActor.kind === "system" && ingressPrincipal.authenticatedUserProfile.profileId === "gateway-owner") && !client.invalidated && !client.connectionSignal?.aborted && !client.internal.syntheticClient && !client.internal.agentRuntimeIdentity && !client.internal.agentToolCaller && client.authenticatedUserProfile?.profileId === "gateway-owner";
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
	const isGatewayCurrent = () => !resolveGatewayContext || gatewayContext !== void 0 && resolveGatewayContext() === gatewayContext;
	const sourceAuthority = params.sourceAuthority !== void 0 ? params.sourceAuthority : client.internal?.operatorAccessAuthority;
	const sourceAuthorities = [
		sourceAuthority,
		ingressPrincipal,
		params.invocationAuthority
	];
	const scopes = Object.freeze([...client.connect.scopes ?? []]);
	const sourceOwners = [
		gatewayContext ?? params.context,
		resolveGatewayContext,
		getConfig,
		readGatewayDeviceSourceIdentity(params.hasCurrentClientAuthority) ?? (params.hasCurrentClientAuthority ? Object.freeze({}) : void 0),
		sourceAuthority,
		ingressPrincipal,
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
	const assertSourceCurrent = composeSessionSourceAssertion(sourceAuthorities.map((authority) => composeSessionSourceAssertion([authority?.assertCurrent], (assertSource) => {
		authority?.signal?.throwIfAborted();
		assertSource();
		authority?.signal?.throwIfAborted();
	})), (assertSources) => {
		if (revoked || references === 0) throw new Error("operator execution authority is no longer active");
		if (isSourceCurrent?.() === false || !isGatewayCurrent()) throw new Error("operator source authority is no longer active");
		assertSources();
		if (revoked || references === 0) throw new Error("operator execution authority is no longer active");
	});
	const assertCurrent = composeSessionSourceAssertion([assertSourceCurrent], (assertSource) => {
		try {
			assertSource();
			assertRoleCurrent();
		} catch (error) {
			revoked = true;
			throw error;
		}
	});
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
		let assertCapturedRoleCurrent = () => {};
		subscriptions.push(onGatewayDeviceSourceRevoked(params.hasCurrentClientAuthority, () => revoke(/* @__PURE__ */ new Error("operator source authority is no longer active"))), onUserProfilesChanged(() => recheck(assertCapturedRoleCurrent)), onOperatorRolePolicyChanged((change) => {
			if (change.kind === "assignment" && change.profileId === profileId) revoke(/* @__PURE__ */ new Error("Your operator role changed; reconnect before continuing."));
			else if (change.kind === "config" && change.context === (gatewayContext ?? params.context)) recheck(assertCapturedRoleCurrent);
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
		const capturedConfig = getConfig();
		const capturedProfile = assertProfileCurrent();
		const capturedAssignedRole = capturedProfile.assignedRole;
		const capturedRole = structuredClone(resolveOperatorRolePolicyForAssignment(profileId, capturedAssignedRole, capturedConfig, capturedProfile.githubLogin ?? null));
		const capturedSourcePolicy = sourceRolePolicy(capturedRole);
		assertCapturedRoleCurrent = () => {
			const current = assertProfileCurrent();
			const policy = resolveOperatorRolePolicyForAssignment(profileId, current.assignedRole, getConfig(), current.githubLogin ?? null);
			if (current.assignedRole !== capturedAssignedRole || !isDeepStrictEqual(capturedSourcePolicy, sourceRolePolicy(policy))) throw new Error("Your operator role changed; reconnect before continuing.");
		};
		const modelPolicy = prepareRunModelPolicy({
			cfg: capturedConfig,
			metadata: getProcessGatewayPluginMetadataSnapshot(),
			initialPolicy: capturedRole?.modelPolicy,
			getConfig,
			resolvePolicy: (cfg) => resolveCurrentRole(cfg)?.modelPolicy
		});
		const source = retainOperatorSource(client, sourceOwners, readOperatorModelPolicyMembership(modelPolicy.original));
		releaseSource = source.release;
		const grant = sourceAuthority === null || sourceAuthority === void 0 && authenticatedOwner ? null : sourceAuthority?.gatewayAccessGrant;
		const admission = {
			profileId,
			scopes,
			gatewayAccessGrant: grant ? Object.freeze({ ...grant }) : grant,
			assertCurrent
		};
		const recoverySnapshot = captureGatewayOperatorRecoverySnapshot({
			client,
			authority: admission,
			modelPolicy: modelPolicy.original,
			identity: preparedProfile,
			config: getConfig()
		});
		assertCurrent();
		const authority = createAdmittedRunOperatorAuthority({
			...admission,
			recoverySnapshot,
			rolePolicy: prepareRunRolePolicy(capturedSourcePolicy),
			readCurrentRoleAssignment: () => {
				assertCurrent();
				return assertProfileCurrent().assignedRole;
			},
			readCurrentGithubLogin: () => {
				assertCurrent();
				return assertProfileCurrent().githubLogin ?? null;
			},
			source: source.token,
			signal: revocation.signal,
			retain: () => {
				assertCurrent();
				references += 1;
				return releaseHold();
			},
			get modelPolicy() {
				return modelPolicy.readCurrent();
			},
			onModelPolicyChanged: (listener) => onOperatorRolePolicyChanged((change) => {
				if (change.kind === "config" && change.context === (gatewayContext ?? params.context)) listener();
			})
		});
		if (authenticatedOwner && client.usesSharedGatewayAuth === true && client.sharedGatewaySessionGeneration && (isBrowserOperatorUiClient(client.connect.client) || isWebchatClient(client.connect.client))) bindSharedGatewayOwnerRunAuthority(authority);
		return {
			authority,
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { transferGatewayOperatorSourceIdentity as a, intersectOperatorRunModelPolicy as i, captureChannelOperatorRunAuthority as n, decodeGatewayOperatorRecoverySource as o, captureGatewayOperatorRunAuthority as r, bindGatewayOperatorContinuationAuthority as t };
