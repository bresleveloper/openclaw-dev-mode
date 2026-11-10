import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { c as canManageSessionSharing } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import "./session-sharing-preparation-DAfvBDLL.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import { n as prepareSessionSharingRead, t as isSameSessionSharingTarget } from "./session-sharing-target-read-DwJlM38W.mjs";
//#region src/gateway/server-methods/sessions-sharing-authority.ts
/** Bind the caller and sharing facts once; each consumer applies its own operation policy. */
async function prepareSessionSharingAccess(params, callerChanged) {
	const { client, context, respond } = params;
	const cfg = context.getRuntimeConfig();
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
	const assertCaller = () => {
		params.signal?.throwIfAborted();
		if (params.hasCurrentClientAuthority?.() === false || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority) callerChanged();
	};
	assertCaller();
	if (params.prepareMembership) while (projection.needsMembershipPreparation()) {
		await projection.prepareMembership();
		assertCaller();
	}
	const facts = await prepareSessionSharingRead({
		cfg,
		...targetRef,
		projection
	});
	return {
		projection,
		query: {
			key: targetRef.sessionKey,
			agentId: targetRef.agentId
		},
		storageTarget: facts.storageTarget,
		readCurrent() {
			assertCaller();
			const currentCfg = context.getRuntimeConfig();
			const policyConfig = context.getCommittedRuntimeConfig?.() ?? currentCfg;
			const sharing = prepareProjectedSessionSharing({
				cfg: policyConfig,
				client,
				isMember: (_target, identityId) => current.membership.has(identityId)
			});
			const preparedProfile = client?.preparedSessionProfile;
			if (runAuthority) {
				const actor = resolveGatewayOperatorRoleActor(client);
				if (actor?.kind !== "operator" || actor.profileId !== runAuthority.profileId || operatorSessionCap(client, policyConfig) !== sharing.sessionCap) throw new SessionMutationFactsUnavailableError();
			}
			const actor = resolveGatewayOperatorRoleActor(client);
			if (runAuthority && (actor?.kind !== "operator" || actor.profileId !== runAuthority.profileId) || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority || client?.preparedSessionProfile !== preparedProfile || context.getRuntimeConfig() !== currentCfg || (context.getCommittedRuntimeConfig?.() ?? currentCfg) !== policyConfig) throw new SessionMutationFactsUnavailableError();
			const current = facts.readCurrent(currentCfg);
			return {
				...current,
				sharing,
				policyConfig
			};
		},
		[Symbol.dispose]: facts.release
	};
}
/** Retain one facts owner through management reads, writer grants, and publication. */
async function prepareManagedSessionAccess(params) {
	const { respond } = params;
	const operation = params.operation ?? "mutation";
	const access = await prepareSessionSharingAccess(params, () => {
		throw new Error(`session ownership changed before sharing ${operation}`);
	});
	if (!access) return null;
	try {
		const readCurrent = (selected) => {
			const { target, sharing, sourcePath, sourceAgentId } = access.readCurrent();
			if (selected && !isSameSessionSharingTarget(target, selected)) throw new Error(`session changed before sharing ${operation}`);
			return {
				target,
				sharing,
				sourcePath,
				sourceAgentId
			};
		};
		const initial = readCurrent();
		const selected = initial.target;
		if (!selected || !canManageSessionSharing(initial.sharing.roleForTarget(selected))) {
			respond(false, void 0, !selected ? errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`) : errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required", { details: {
				code: "SESSION_SHARING_MANAGER_REQUIRED",
				sessionKey: selected.canonicalKey
			} }));
			access[Symbol.dispose]();
			return null;
		}
		const requireManageable = ({ target, sharing }, entry) => {
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
		const prepareCurrent = (assertRequest = () => params.sessionMutationAuthorization?.assertCurrent()) => {
			assertRequest();
			return readCurrent(selected);
		};
		const current = (entry, assertRequest) => requireManageable(prepareCurrent(assertRequest), entry);
		return {
			target: selected,
			lifecycleStorePath: access.storageTarget.storePath,
			current,
			assertCurrent: composeSessionSourceAssertion([params.sessionMutationAuthorization?.assertCurrent], (assertSources) => {
				current(void 0, assertSources);
			}),
			assertEntryManageable: (entry) => {
				current(entry);
			},
			[Symbol.dispose]: access[Symbol.dispose]
		};
	} catch (error) {
		access[Symbol.dispose]();
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
export { prepareSessionSharingAccess as n, sharingExpectedEntry as r, prepareManagedSessionAccess as t };
