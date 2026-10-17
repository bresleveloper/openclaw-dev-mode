import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath, x as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { c as captureSessionStoreReadCandidate, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as readProjectedSessionMutationTarget } from "./session-sharing-target-read-DUttMvj3.mjs";
import { n as captureSessionMutationRouting, r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-BwpUabTn.mjs";
import { n as prepareCurrentSessionSharing, t as isSameSessionSharingTarget } from "./sessions-sharing-authority-BENaDl9k.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/session-discovery-access.ts
/** Keep discovery bound to current sharing facts and the session's selected skill revisions. */
async function withSessionDiscoveryAccess(params, discover) {
	if (!params.sessionKey) {
		params.respond(true, await discover(), void 0);
		return;
	}
	const { client, context, respond } = params;
	const cfg = context.getRuntimeConfig();
	const assertRouting = captureSessionMutationRouting(cfg);
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
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
		if (params.hasCurrentClientAuthority?.() === false || client?.invalidated || client?.connectionSignal?.aborted || gatewayClientSessionCreator(client)?.id !== actorId || getSessionRowProjection(context) !== projection || client?.internal?.operatorRunAuthority !== runAuthority) throw new Error("Session discovery authority changed.");
	};
	let retained;
	let retainedSourcePath;
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
		if (!captured) {
			const prepared = await prepareSessionMutationFacts({
				cfg,
				...targetRef,
				allowMissing: true
			});
			retained = prepared;
			retainedSourcePath = prepared.readCurrent(context.getRuntimeConfig()).sourcePath;
		} else while (projection.needsMembershipPreparation()) {
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
			if (selected && !isSameSessionSharingTarget(target, selected)) throw new SessionMutationAuthorizationChangedError(params.changedError);
			if (!target) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, "Session not found."));
			const denied = sharing.authorizeTarget(target);
			if (denied) throw new SessionMutationAuthorizationChangedError(denied);
			return target;
		};
		const selected = readCurrent(captured);
		const readEntry = (consume) => withReadySessionRows(projection, () => [query], (read) => {
			readCurrent(selected);
			const row = read.describe(query);
			const entry = row?.storedEntry;
			if (!entry || (read.readSource(row)?.path ?? row.storeTarget.storePath) !== (retainedSourcePath ?? selected.storePath) || entry.sessionId !== selected.entry.sessionId || entry.lifecycleRevision !== selected.entry.lifecycleRevision) throw new SessionMutationAuthorizationChangedError(params.changedError);
			return consume(entry);
		});
		const entry = await readEntry((current) => structuredClone(current));
		readCurrent(selected);
		const result = await discover(entry);
		readCurrent(selected);
		await readEntry((current) => {
			if (!isDeepStrictEqual(current.skillLibrarySelections, entry.skillLibrarySelections)) throw new SessionMutationAuthorizationChangedError(params.changedError);
			respond(true, result, void 0);
		});
	} catch (error) {
		respond(false, void 0, error instanceof SessionMutationAuthorizationChangedError ? error.error : errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
	} finally {
		retained?.release();
	}
}
//#endregion
export { withSessionDiscoveryAccess as t };
