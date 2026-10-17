import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath, x as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { c as captureSessionStoreReadCandidate, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { l as canManageSessionSharing } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as readProjectedSessionMutationTarget, u as prepareProjectedSessionSharing } from "./session-sharing-target-read-DUttMvj3.mjs";
import { n as captureSessionMutationRouting, r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-BwpUabTn.mjs";
//#region src/gateway/server-methods/sessions-sharing-authority.ts
/** Synthetic profile preparation may reenter authority owners; retain only one current policy. */
function prepareCurrentSessionSharing(params) {
	const { client, context, projection, actorId, runAuthority, isMember } = params;
	const currentCfg = context.getRuntimeConfig();
	const policyConfig = context.getCommittedRuntimeConfig?.() ?? currentCfg;
	const sharing = prepareProjectedSessionSharing({
		cfg: policyConfig,
		client,
		isMember
	});
	const preparedProfile = client?.preparedSessionProfile;
	if (runAuthority) {
		const actor = resolveGatewayOperatorRoleActor(client);
		if (actor?.kind !== "operator" || actor.profileId !== runAuthority.profileId || operatorSessionCap(client, policyConfig) !== sharing.sessionCap) throw new SessionMutationFactsUnavailableError();
	}
	const actor = resolveGatewayOperatorRoleActor(client);
	if (runAuthority && (actor?.kind !== "operator" || actor.profileId !== runAuthority.profileId) || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority || client?.preparedSessionProfile !== preparedProfile || context.getRuntimeConfig() !== currentCfg || (context.getCommittedRuntimeConfig?.() ?? currentCfg) !== policyConfig) throw new SessionMutationFactsUnavailableError();
	return {
		currentCfg,
		policyConfig,
		sharing
	};
}
function isSameSessionSharingTarget(target, selected) {
	return Boolean(target && target.agentId === selected.agentId && target.canonicalKey === selected.canonicalKey && target.storeKey === selected.storeKey && target.storePath === selected.storePath && target.entry.sessionId === selected.entry.sessionId && target.entry.lifecycleRevision === selected.entry.lifecycleRevision && target.readSource?.path === selected.readSource?.path && target.readSource?.agentId === selected.readSource?.agentId && target.readSource?.databaseIdentity === selected.readSource?.databaseIdentity && target.readSource?.databaseBirthtime === selected.readSource?.databaseBirthtime);
}
/** Retain one facts owner through management reads, writer grants, and publication. */
async function prepareManagedSessionAccess(params) {
	const { client, context, respond } = params;
	const cfg = context.getRuntimeConfig();
	const assertRouting = captureSessionMutationRouting(cfg);
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return null;
	}
	const projection = requireSessionRowProjection(context);
	const targetRef = {
		sessionKey: params.sessionKey,
		agentId: requestedAgent.agentId
	};
	const actorId = gatewayClientSessionCreator(client)?.id;
	const runAuthority = client?.internal?.operatorRunAuthority;
	const operation = params.operation ?? "mutation";
	const assertCaller = () => {
		params.signal?.throwIfAborted();
		if (params.hasCurrentClientAuthority?.() === false || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority) throw new Error(`session ownership changed before sharing ${operation}`);
	};
	let retained;
	try {
		assertCaller();
		const query = {
			key: targetRef.sessionKey,
			agentId: targetRef.agentId
		};
		const resident = projection.sharingTarget(query);
		const source = resident && projection.readSource({
			...query,
			storePath: resident.storePath
		});
		const configuredStorePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: requestedAgent.agentId });
		const configuredSource = captureSessionStoreReadCandidate(resolveUnsuffixedSqliteTargetFromSessionStorePath(configuredStorePath).path);
		const captured = resident && source?.path === resident.storePath && typeof source.databaseIdentity === "string" && isConfiguredSessionStoreAgentId(cfg, resident.agentId) && source.path === configuredSource.physicalPath ? {
			...resident,
			readSource: source
		} : void 0;
		if (!captured) retained = await prepareSessionMutationFacts({
			cfg,
			...targetRef,
			allowMissing: true
		});
		else while (projection.needsMembershipPreparation()) {
			await projection.prepareMembership();
			assertCaller();
		}
		const readCurrent = (selected) => {
			assertCaller();
			let membership;
			const { currentCfg, sharing } = prepareCurrentSessionSharing({
				client,
				context,
				projection,
				actorId,
				runAuthority,
				isMember: (target, identityId) => retained ? membership.has(identityId) : projection.hasMembership(target.storePath, target.storeKey, identityId)
			});
			assertRouting(currentCfg);
			let target;
			if (retained) {
				const facts = retained.readCurrent(currentCfg);
				target = facts.target;
				membership = facts.membership;
			} else {
				assertSessionStoreReadCandidate(configuredSource.path, [configuredSource]);
				const current = readProjectedSessionMutationTarget(targetRef, currentCfg, projection);
				if (current.status !== "ready") throw new SessionMutationFactsUnavailableError();
				target = current.target;
			}
			if (selected && !isSameSessionSharingTarget(target, selected)) throw new Error(`session changed before sharing ${operation}`);
			return {
				target,
				sharing
			};
		};
		const initial = readCurrent(captured);
		const selected = initial.target;
		if (!selected || !canManageSessionSharing(initial.sharing.roleForTarget(selected))) {
			respond(false, void 0, !selected ? errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`) : errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required", { details: {
				code: "SESSION_SHARING_MANAGER_REQUIRED",
				sessionKey: selected.canonicalKey
			} }));
			retained?.release();
			return null;
		}
		const current = (entry) => {
			readCurrent(selected);
			params.sessionMutationAuthorization?.assertCurrent();
			const { target, sharing } = readCurrent(selected);
			if (entry && (entry.sessionId !== selected.entry.sessionId || entry.lifecycleRevision !== selected.entry.lifecycleRevision)) throw new Error(`session changed before sharing ${operation}`);
			const role = target && sharing.roleForTarget(entry ? {
				...target,
				entry
			} : target);
			if (!target || !role || !canManageSessionSharing(role)) throw new Error(`session ownership changed before sharing ${operation}`);
			return {
				target,
				role
			};
		};
		return {
			target: selected,
			lifecycleStorePath: retained?.storageTarget.storePath ?? configuredStorePath,
			current,
			assertCurrent: () => {
				current();
			},
			assertEntryManageable: (entry) => {
				current(entry);
			},
			[Symbol.dispose]: () => retained?.release()
		};
	} catch (error) {
		retained?.release();
		throw error;
	}
}
function sharingExpectedEntry(target) {
	return {
		sessionId: target.entry.sessionId,
		createdActor: target.entry.createdActor,
		visibility: target.entry.visibility,
		incognito: target.entry.incognito
	};
}
//#endregion
export { sharingExpectedEntry as i, prepareCurrentSessionSharing as n, prepareManagedSessionAccess as r, isSameSessionSharingTarget as t };
