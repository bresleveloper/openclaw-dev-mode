import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { S as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as resolveRequestedSessionAgentInput, r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { m as resolveIncognitoSessionSharingTarget, u as hiddenSessionNotFound } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as readSessionSharingMemoryFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as captureSessionMutationRouting, t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { i as resolveDirectSessionTargets } from "./session-sharing-target-input-Cob8P56S.mjs";
//#region src/gateway/session-sharing-target-read.ts
function isSameSessionSharingTarget(target, selected) {
	return Boolean(target && target.agentId === selected.agentId && target.canonicalKey === selected.canonicalKey && target.storeKey === selected.storeKey && target.storePath === selected.storePath && target.entry.sessionId === selected.entry.sessionId && target.entry.lifecycleRevision === selected.entry.lifecycleRevision && target.readSource?.path === selected.readSource?.path && target.readSource?.agentId === selected.readSource?.agentId && target.readSource?.databaseIdentity === selected.readSource?.databaseIdentity && target.readSource?.databaseBirthtime === selected.readSource?.databaseBirthtime);
}
/** Reuse admitted sharing facts; other targets retain their prepared storage custody. */
async function prepareSessionSharingRead(params) {
	try {
		if (isIncognitoSessionKey(params.sessionKey)) return prepareSessionMutationFacts({
			...params,
			allowMissing: true
		});
		const { cfg, projection } = params;
		const query = {
			key: params.sessionKey,
			agentId: params.agentId
		};
		const resident = projection?.sharingTarget(query);
		const source = resident && projection?.readSource({
			...query,
			storePath: resident.storePath
		});
		const configuredStorePath = resolveSessionStorePathCore(cfg.session?.store, { agentId: params.agentId });
		const configuredSource = captureSessionStoreReadCandidate(resolveUnsuffixedSqliteTargetFromSessionStorePath(configuredStorePath).path);
		const captured = !params.preserveQualifiedAddress && resident && source?.path === resident.storePath && isConfiguredSessionStoreAgentId(cfg, resident.agentId) && source.path === configuredSource.physicalPath ? {
			...resident,
			readSource: source
		} : void 0;
		if (!captured || !projection) return prepareSessionMutationFacts({
			...params,
			allowMissing: true
		});
		const assertRouting = captureSessionMutationRouting(cfg, void 0, [params]);
		while (projection.needsMembershipPreparation()) await projection.prepareMembership();
		let active = true;
		const readCurrent = (currentCfg) => {
			try {
				if (!active) throw new SessionMutationFactsUnavailableError();
				assertRouting(currentCfg);
				assertSessionStoreReadCandidate(configuredSource.path, [configuredSource]);
				const current = readProjectedSessionMutationTarget({
					sessionKey: params.sessionKey,
					agentId: params.agentId
				}, currentCfg, projection);
				if (current.status !== "ready" || !isSameSessionSharingTarget(current.target, captured)) throw new SessionMutationFactsUnavailableError();
				const target = current.target;
				return {
					target,
					sourcePath: captured.readSource.path,
					sourceAgentId: captured.readSource.agentId,
					membership: projection.readMembership({
						...query,
						storePath: target.storePath
					}) ?? /* @__PURE__ */ new Set()
				};
			} catch (error) {
				throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
			}
		};
		readCurrent(cfg);
		return {
			storageTarget: {
				agentId: captured.agentId,
				canonicalKey: captured.canonicalKey,
				storePath: configuredStorePath
			},
			readCurrent,
			release: () => {
				active = false;
			}
		};
	} catch (error) {
		throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
	}
}
const readProjectedSessionMutationTarget = (targetRef, cfg, projection) => {
	const agent = resolveRequestedSessionAgentId(cfg, targetRef.sessionKey, targetRef.agentId);
	if (!agent.ok) return { status: "unavailable" };
	const query = {
		key: targetRef.sessionKey,
		agentId: agent.agentId
	};
	const state = projection.sharingTargetState(query);
	if (state.status !== "ready") return { status: state.status === "pending" ? "pending" : "unavailable" };
	const readSource = projection.readSource({
		...query,
		storePath: state.target.storePath
	});
	if (!readSource || readSource.path !== state.target.storePath) return { status: "unavailable" };
	assertExistingDatabaseIdentity(readSource.path, `file:${readSource.databaseIdentity}`, readSource.databaseBirthtime);
	return {
		status: "ready",
		target: {
			...state.target,
			readSource
		}
	};
};
function readSessionMutationTarget(params) {
	const input = resolveRequestedSessionAgentInput(params.targetRef.sessionKey, params.targetRef.agentId);
	if (!input.ok) return { error: input.error };
	try {
		if (isIncognitoSessionKey(params.targetRef.sessionKey)) {
			const { agentId, canonicalKey } = resolveSessionStoreIdentity({
				cfg: params.cfg,
				...params.targetRef
			});
			return { target: readSessionSharingMemoryFacts({
				agentId,
				sessionKey: canonicalKey,
				resolved: { storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }) }
			})?.target ?? null };
		}
		const projection = getSessionRowProjection(params.context);
		const projected = projection && readProjectedSessionMutationTarget(params.targetRef, params.cfg, projection);
		if (projected?.status === "ready" && (!params.expectedTarget || projected.target.storePath === params.expectedTarget.storePath)) return {
			target: projected.target,
			preparedReadSource: projected.target.readSource,
			projection
		};
		if (params.sessionRowRead && resolveDirectSessionTargets(params.method, params.requestParams).some((direct) => direct.sessionKey === params.targetRef.sessionKey && direct.agentId === params.targetRef.agentId)) {
			const agent = resolveRequestedSessionAgentId(params.sessionRowRead.state.cfg, params.targetRef.sessionKey, params.targetRef.agentId);
			if (!agent.ok) return { error: agent.error };
			const row = params.sessionRowRead.describe({
				key: params.targetRef.sessionKey,
				agentId: agent.agentId
			});
			if (!row && params.sessionScope === "operator.sessions.read") return { error: hiddenSessionNotFound(params.targetRef.sessionKey) };
			const readSource = row && params.sessionRowRead.readSource(row);
			return {
				preparedReadSource: readSource,
				target: row?.storedEntry ? {
					agentId: row.agentId,
					canonicalKey: row.key,
					storeKey: row.key,
					storeKeys: [row.key],
					storePath: row.storeTarget.storePath,
					readSource,
					entry: row.storedEntry
				} : null
			};
		}
		if (!isIncognitoSessionKey(params.targetRef.sessionKey)) return { error: errorShape(ErrorCodes.UNAVAILABLE, "Session facts are unavailable; retry the request") };
		let preparedReadSource;
		return {
			target: resolveIncognitoSessionSharingTarget({
				cfg: params.cfg,
				sessionKey: params.targetRef.sessionKey,
				agentId: input.value,
				onReadSource: (source) => {
					preparedReadSource = source;
				}
			}),
			preparedReadSource
		};
	} catch (error) {
		if (error instanceof AgentSelectionRequiredError) return { error: errorShape(ErrorCodes.INVALID_REQUEST, error.message) };
		throw error;
	}
}
//#endregion
export { readSessionMutationTarget as i, prepareSessionSharingRead as n, readProjectedSessionMutationTarget as r, isSameSessionSharingTarget as t };
