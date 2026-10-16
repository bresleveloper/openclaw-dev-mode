import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { S as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as isPerAgentSessionStoreConfig } from "./session-store-config-dGf2LeNv.mjs";
import { t as resolvePersistedSessionStoreOwner } from "./session-store-owner-CnfJSmam.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { o as resolveSessionRoutingContract } from "./main-session-00MgEWj5.mjs";
import { a as onOperatorRolePolicyChanged, g as readGatewayAccessRevision, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BrMPjfvW.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { r as isGatewayAuthPolicyCurrent, t as captureGatewayAuthPolicy } from "./auth-policy-DNAJam1S.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { n as canResolveOperatorApproval, r as canReviewOperatorApproval } from "./operator-approval-authorization-BCjW3avN.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/approval-request-authority.ts
/** Pure policy/locator facts used by approval visibility; no row or registry discovery. */
function captureApprovalConfigPolicy(config) {
	const agents = listAgentIds(config).toSorted();
	const configuredStores = listConfiguredSessionStoreAgentIds(config).toSorted();
	const compatibilityAgent = resolveSessionStoreCompatibilityAgentId(config);
	const storeAgents = [.../* @__PURE__ */ new Set([...configuredStores, compatibilityAgent])].toSorted();
	return {
		routing: resolveSessionRoutingContract(config),
		storeOwner: resolvePersistedSessionStoreOwner(config),
		compatibilityAgent,
		legacyAgent: tryResolveLegacyCompatibilityAgentId(config),
		agents,
		configuredStores,
		perAgentStore: isPerAgentSessionStoreConfig(config.session?.store),
		stores: storeAgents.map((agentId) => ({
			agentId,
			path: resolveSessionStorePathCore(config.session?.store, { agentId })
		}))
	};
}
/**
* Commit facts for one resolved approval source: its route and the stores it resolves through.
* Shared fixed stores select an owner among co-tenants, and unconfigured owners discover
* through every configured store root, so those keep the matching inventory.
*/
function captureApprovalSourcePolicy(config, source) {
	const { agents, configuredStores, stores, ...policy } = captureApprovalConfigPolicy(config);
	const { sessionKey, agentId } = source;
	if (!sessionKey) return policy;
	let identity;
	try {
		identity = resolveSessionStoreIdentity({
			cfg: config,
			sessionKey,
			...agentId ? { agentId } : {}
		});
	} catch {
		identity = null;
	}
	const owners = new Set([
		parseAgentSessionKey(sessionKey)?.agentId,
		agentId,
		identity?.agentId
	].flatMap((owner) => owner ? [normalizeAgentId(owner)] : []));
	return {
		...policy,
		identity,
		owners: [...owners].toSorted().map((owner) => {
			const path = resolveSessionStorePathCore(config.session?.store, { agentId: owner });
			const configured = configuredStores.includes(owner);
			return {
				agentId: owner,
				listed: agents.includes(owner),
				configured,
				path,
				stores: configured ? stores.filter((store) => store.path === path) : stores
			};
		})
	};
}
/** Retain the original invocation; copying options loses its request-owner binding. */
function createApprovalRequestAuthority(options) {
	const authority = readGatewayRequestMutationAuthority(options);
	const { client } = options;
	const method = options.req.method;
	const profileId = client?.authenticatedUserProfile?.profileId;
	const userId = client?.authenticatedUserId;
	const role = client?.connect.role;
	const deviceId = client?.connect.device?.id;
	const approvalRuntime = client?.internal?.approvalRuntime;
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const actor = resolveGatewayOperatorRoleActor(client);
	const actorKind = actor?.kind;
	const actorProfileId = actor?.kind === "operator" ? actor.profileId : void 0;
	const readRuntimeConfig = options.context.getRuntimeConfig;
	const readCommittedConfig = options.context.getCommittedRuntimeConfig;
	const resolveGatewayContext = options.context.resolveGatewayContext;
	const gatewayContext = resolveGatewayContext?.() ?? options.context;
	const getConfig = readCommittedConfig ?? readRuntimeConfig;
	const config = getConfig();
	const authPolicy = client?.authPolicy ?? captureGatewayAuthPolicy(config, null);
	let captureConfigPolicy = captureApprovalConfigPolicy;
	let configPolicy = captureConfigPolicy(config);
	let boundSource;
	const accessRevision = readGatewayAccessRevision();
	let configRevoked = false;
	let closed = false;
	const observeConfig = () => {
		try {
			const current = getConfig();
			configRevoked = !isGatewayAuthPolicyCurrent(authPolicy, current) || !isDeepStrictEqual(configPolicy, captureConfigPolicy(current));
		} catch {
			configRevoked = true;
		}
	};
	const releaseConfig = onOperatorRolePolicyChanged((change) => {
		if (change.kind !== "config" || change.context !== gatewayContext || configRevoked) return;
		observeConfig();
	});
	const bindSource = (record) => {
		const source = {
			sessionKey: normalizeOptionalString(record.sessionKey) ?? null,
			agentId: normalizeOptionalString(record.agentId) ?? null
		};
		if (boundSource) {
			configRevoked ||= !isDeepStrictEqual(boundSource, source);
			return;
		}
		if (configRevoked) return;
		observeConfig();
		if (configRevoked) return;
		boundSource = source;
		captureConfigPolicy = (current) => captureApprovalSourcePolicy(current, source);
		try {
			configPolicy = captureConfigPolicy(getConfig());
		} catch {
			configRevoked = true;
		}
	};
	const assertPolicyCurrent = () => {
		const currentActor = resolveGatewayOperatorRoleActor(client);
		const allowed = method.startsWith("exec.approval.") || method.startsWith("plugin.approval.") ? authority.family === "native-compatibility" || authorizeOperatorScopesForMethod(method, client?.connect.scopes ?? []).allowed : method === "approval.resolve" ? canResolveOperatorApproval(client) : method === "approval.history" ? authorizeOperatorScopesForMethod(method, client?.connect.scopes ?? []).allowed : canReviewOperatorApproval(client);
		if (closed || !allowed || client?.invalidated || client?.connect.role !== role || client?.connect.device?.id !== deviceId || client?.internal?.approvalRuntime !== approvalRuntime || client?.internal?.agentRuntimeIdentity !== runtimeIdentity || currentActor?.kind !== actorKind || (currentActor?.kind === "operator" ? currentActor.profileId : void 0) !== actorProfileId || client?.authenticatedUserProfile?.profileId !== profileId || client?.authenticatedUserId !== userId || options.context.getRuntimeConfig !== readRuntimeConfig || options.context.getCommittedRuntimeConfig !== readCommittedConfig || options.context.resolveGatewayContext !== resolveGatewayContext || (resolveGatewayContext?.() ?? options.context) !== gatewayContext || configRevoked || readGatewayAccessRevision() !== accessRevision) throw new Error("Approval requester authority changed");
	};
	const assertCurrent = () => {
		authority.assertCurrent();
		authority.expectedProfileBinding?.assertCurrent();
		assertPolicyCurrent();
	};
	const guard = {
		family: authority.family,
		assertCurrent: authority.family === "native-compatibility" ? assertCurrent : () => {
			authority.assertWorkerCurrent();
			authority.expectedProfileBinding?.assertCurrent();
			assertPolicyCurrent();
		}
	};
	return {
		guard,
		bindSource,
		assertCurrent,
		assertCommitCurrent: guard.assertCurrent,
		isCurrent: () => {
			try {
				assertCurrent();
				return true;
			} catch {
				return false;
			}
		},
		[Symbol.dispose]() {
			closed = true;
			releaseConfig();
		}
	};
}
//#endregion
export { createApprovalRequestAuthority as t };
