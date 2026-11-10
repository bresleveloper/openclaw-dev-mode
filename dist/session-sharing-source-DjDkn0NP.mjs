import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { i as bindPublishedSessionSourceAdmission, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey, _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { h as resolveConfiguredAgentId, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { a as isSessionArchiveMutation, o as isSessionProfileDependentMethod, t as isAgentRunStartMethod } from "./session-method-policy-B7o-3I76.mjs";
import { i as isSessionStoreReadCandidateCurrent, n as captureSessionStoreCandidateIdentities, r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as authorizeGatewaySessionCreation, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { r as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { r as isSyntheticGatewayCaller } from "./gateway-personal-caller-BLfLqLHg.mjs";
import { a as isGatewayClientProfilePending, t as authenticatedProfileUnavailableError } from "./gateway-client-identity-DXWhtQve.mjs";
import { d as isGatewayAdmin, r as authorizeOwnSessionMutation, y as withSessionSharingTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as captureSessionSharingMemoryFacts } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { c as resolveTalkSessionTargetInput, n as resolveChatSendAuthorizationParams } from "./session-sharing-target-input-Cob8P56S.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
//#region src/talk/agent-target.ts
/** Agent-scoped keys own their Talk session; legacy/unscoped aliases use the Talk target. */
function resolveTalkSessionAgentId(config, sessionKey) {
	const normalizedSessionKey = sessionKey ?? void 0;
	const scopedAgentId = parseAgentSessionKey(normalizedSessionKey)?.agentId;
	if (scopedAgentId) return normalizeAgentId(scopedAgentId);
	return resolvePersistedSessionStoreOwnerForKey(config, normalizedSessionKey).kind === "none" ? resolveAmbientOwnerAgentId(config, config.talk?.agentId, {
		surface: "Talk session ownership",
		hint: "Set talk.agentId to the agent that owns unscoped Talk sessions."
	}) : resolveSessionAgentId({
		config,
		sessionKey: normalizedSessionKey
	});
}
//#endregion
//#region src/gateway/talk/session-target.ts
function requirePreparedTalkSessionTarget(target) {
	if (!target) throw new Error("Talk session target was not prepared by the Gateway");
	return target;
}
/** Resolve Talk ownership before aliases collapse, then retain the exact storage target. */
async function prepareTalkSessionTarget(cfg, requestedSessionKey) {
	const requestedKey = normalizeOptionalString(requestedSessionKey);
	const owner = resolveTalkSessionAgentId(cfg, requestedKey ?? "main");
	const sessionKey = requestedKey ?? resolveAgentMainSessionKey({
		cfg,
		agentId: owner
	});
	const assertCurrent = captureSessionMutationRouting(cfg, () => /* @__PURE__ */ new Error("Talk session storage target changed; retry the request"), [{
		sessionKey,
		agentId: owner
	}]);
	const { agentId, canonicalKey, storePath } = await resolveTalkSessionStorageTarget(cfg, sessionKey, owner);
	return Object.freeze({
		agentId,
		sessionKey,
		canonicalKey,
		storePath,
		assertCurrent
	});
}
/** Revalidate a retained owner without consulting the current ambient Talk default. */
function assertTalkSessionStorageTarget(cfg, target) {
	target.assertCurrent(cfg);
}
async function resolveTalkSessionStorageTarget(cfg, sessionKey, owner) {
	const { agentId, canonicalKey } = resolveSessionStoreIdentity({
		cfg,
		sessionKey,
		agentId: resolveConfiguredAgentId(cfg, owner)
	});
	return {
		agentId,
		canonicalKey,
		storePath: (await resolveGatewaySessionStoreTargetInWorker({
			cfg,
			key: canonicalKey,
			agentId
		})).storePath
	};
}
//#endregion
//#region src/gateway/session-sharing-authorization.ts
function prepareSessionMutationAuthorizationRequest(request) {
	let params = { ...request };
	params.preparedProfiles?.readCurrent();
	if (params.method === "chat.send") {
		const normalized = resolveChatSendAuthorizationParams(params.context.getRuntimeConfig(), params.requestParams);
		if (!normalized.ok) return {
			ok: false,
			error: normalized.error
		};
		params = {
			...params,
			requestParams: normalized.value
		};
	}
	const requester = params.method === "question.request" ? params.client?.internal?.agentRuntimeIdentity : void 0;
	if (requester && isRecord(params.requestParams)) params = {
		...params,
		requestParams: {
			...params.requestParams,
			agentId: requester.agentId,
			sessionKey: requester.sessionKey,
			runId: requester.operationalRunInstance.runId
		}
	};
	const patch = params.method === "sessions.patchMany" && isRecord(params.requestParams) ? params.requestParams.patch : params.requestParams;
	const requiresCommunicationAuthority = [
		"sessions.create",
		"sessions.patch",
		"sessions.patchMany"
	].includes(params.method) && isRecord(patch) && Object.hasOwn(patch, "communication");
	if (requiresCommunicationAuthority && (!params.client || isSyntheticGatewayCaller(params.client))) return {
		ok: false,
		error: errorShape(ErrorCodes.FORBIDDEN, "Session communication settings require a direct human request.")
	};
	const authorizesAgentRun = isAgentRunStartMethod(params.method, params.requestParams);
	const bindsProgressLifecycle = params.method === "progressCard.put" || params.method === "progressCard.refresh";
	const adminBypass = isGatewayAdmin(params.client) && !authorizesAgentRun;
	if (!adminBypass && isGatewayClientProfilePending(params.client) && isSessionProfileDependentMethod(params.method)) return {
		ok: false,
		error: authenticatedProfileUnavailableError()
	};
	return {
		ok: true,
		params,
		authorizesAgentRun,
		bindsProgressLifecycle,
		adminBypass,
		requiresSessionFacts: !adminBypass || requiresCommunicationAuthority || bindsProgressLifecycle || params.expectedTarget !== void 0,
		targetOwnership: {
			requireOwner: requiresCommunicationAuthority || isSessionArchiveMutation(params.method, params.requestParams),
			ownerAction: requiresCommunicationAuthority ? "change communication settings" : void 0
		}
	};
}
function createSessionSharingLookupCaches() {
	return {
		storeCache: /* @__PURE__ */ new Map(),
		targetDiscoveryCache: /* @__PURE__ */ new Map()
	};
}
const VISIBILITY_AUTHORIZED_METHODS = /* @__PURE__ */ new Set(["sessions.assignOwner"]);
function resolveOwnSessionProfileAuthorization(params) {
	if (!params.bindsOwnProfile) return { error: null };
	const actor = resolveGatewayOperatorRoleActor(params.client);
	const profileId = actor?.kind === "operator" ? actor.profileId : void 0;
	if (!profileId) return { error: authenticatedProfileUnavailableError() };
	return {
		profileId,
		error: authorizeOwnSessionMutation({
			client: params.client,
			target: null,
			expectedProfileId: profileId
		})
	};
}
function sessionMutationTargetChanged(method, sessionKey) {
	return new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.INVALID_REQUEST, `session changed before ${method}; retry the request`, { details: {
		code: "SESSION_MUTATION_AUTHORIZATION_CHANGED",
		method,
		sessionKey
	} }));
}
function expectedSessionMutationTargetError(expected, target, method) {
	return expected && (!target || target.agentId !== expected.agentId || target.canonicalKey !== expected.sessionKey || target.storePath !== expected.storePath || target.entry.sessionId?.trim() !== expected.sessionId) ? sessionMutationTargetChanged(method, expected.sessionKey).error : null;
}
function prepareAuthorizedSessionMutationFacts(params) {
	const { expected, facts } = params;
	const original = expected.resolved;
	const expectedRoute = original ? {
		agentId: original.agentId,
		storePath: original.storePath,
		sessionKey: original.canonicalKey,
		storeKey: original.storeKey
	} : expected.absentTarget ? {
		agentId: expected.absentTarget.agentId,
		storePath: expected.absentTarget.storePath,
		sessionKey: expected.absentTarget.canonicalKey,
		storeKey: expected.absentTarget.canonicalKey
	} : void 0;
	const expectedReadSource = original?.readSource ?? params.source;
	if (!expectedRoute || facts.agentId !== expectedRoute.agentId || toAgentStoreSessionKey({
		agentId: facts.agentId,
		requestKey: facts.sessionKey
	}) !== toAgentStoreSessionKey({
		agentId: expectedRoute.agentId,
		requestKey: expectedRoute.storeKey
	}) || (expectedReadSource ? facts.readSource?.databaseIdentity !== expectedReadSource.databaseIdentity || facts.readSource.databaseBirthtime !== expectedReadSource.databaseBirthtime || facts.readSource.agentId !== expectedReadSource.agentId : facts.storePath !== expectedRoute.storePath)) throw params.targetChanged();
	return {
		storageTarget: {
			agentId: expectedRoute.agentId,
			canonicalKey: expectedRoute.sessionKey,
			storePath: expectedRoute.storePath
		},
		target: facts.entry ? {
			...original ?? {
				agentId: expectedRoute.agentId,
				canonicalKey: expectedRoute.sessionKey,
				storeKey: expectedRoute.sessionKey,
				storePath: expectedRoute.storePath
			},
			storeKeys: [expectedRoute.storeKey],
			entry: facts.entry
		} : null
	};
}
function assertSessionMutationProjectionCurrent(expected, context, changed) {
	if (expected?.projection && getSessionRowProjection(context) !== expected.projection) throw changed();
}
/** Only an acknowledged creation may advance an absent or idless Talk admission. */
function createSessionCreationAuthorizationRecorder(params) {
	let createdSessionRecorded = false;
	return (created) => {
		if (createdSessionRecorded) return;
		let expected = params.targets.find((target) => {
			const route = target.absentTarget ?? (params.talkSessionTarget ? target.resolved : null);
			return target.sessionId === null && route?.agentId === created.agentId && route.canonicalKey === created.sessionKey && route.storePath === created.storePath;
		});
		if (!expected && params.permitsGeneratedSession) {
			expected = {
				sessionKey: created.sessionKey,
				agentId: created.agentId,
				resolved: null,
				sessionId: null
			};
			params.targets.push(expected);
		}
		if (!expected) return;
		createdSessionRecorded = true;
		expected.resolved = {
			...expected.resolved,
			agentId: created.agentId,
			canonicalKey: created.sessionKey,
			storeKey: created.sessionKey,
			storePath: created.storePath,
			...created.readSource ? { readSource: created.readSource } : {}
		};
		expected.sessionId = created.sessionId;
		expected.lifecycleRevision = created.lifecycleRevision;
		expected.created = true;
	};
}
function resolvePreparedTalkAuthorizationTarget(params, getCfg) {
	try {
		const talkInput = resolveTalkSessionTargetInput(params.method, params.requestParams, params.client?.connId);
		const talkSessionTarget = talkInput?.kind === "relay" ? talkInput.target : params.preparedTalkSessionTarget;
		if (talkInput && !talkSessionTarget) throw new Error("Talk session authorization requires prepared session facts");
		if (talkSessionTarget) assertTalkSessionStorageTarget(getCfg(), talkSessionTarget);
		return {
			error: null,
			talkInput,
			talkSessionTarget
		};
	} catch (error) {
		return { error: errorShape(ErrorCodes.INVALID_REQUEST, String(error instanceof Error ? error.message : error)) };
	}
}
function findPreparedSharingTarget(params, targetRef) {
	const sessionKey = normalizeOptionalString(targetRef.sessionKey ?? targetRef.key);
	const agentId = normalizeOptionalString(targetRef.agentId);
	return params.preparedTargets?.find((target) => target.sessionKey === sessionKey && target.agentId === agentId);
}
async function withCurrentSessionSharingSource(params) {
	const { request, target } = params;
	request.preparedProfiles?.readCurrent();
	const cfg = request.context.getRuntimeConfig();
	const assertRoutingCurrent = captureSessionMutationRouting(cfg, params.changed, [target]);
	return withSessionSharingTarget({
		cfg,
		sessionKey: target.sessionKey,
		agentId: target.agentId
	}, (read) => params.consumeSharing({
		...read,
		assertCurrent: () => {
			read.assertCurrent();
			assertRoutingCurrent(request.context.getRuntimeConfig());
		}
	}, () => {
		params.assertCurrent();
		return params.consume();
	}), request.preparedSharing?.selection);
}
/** Missing rows bind to their memory namespace or configured durable write target. */
function resolveSessionMutationWriteRoute(cfg, target) {
	const identity = resolveSessionStoreIdentity({
		cfg,
		...target
	});
	const memory = captureMemoryExactSessionReader({
		agentId: identity.agentId,
		sessionKey: identity.canonicalKey
	});
	return {
		...identity,
		storePath: memory?.path ?? resolveSessionStorePathCore(cfg.session?.store, identity)
	};
}
//#endregion
//#region src/gateway/session-sharing-source-store.ts
/** Capture the complete selector family before resolving its physical owner. */
function captureSessionSharingStore(target, env, assertCallerCurrent) {
	const candidates = captureSessionStoreReadCandidates(target.storePath);
	const { agentId, storePath, readSource } = target;
	if (readSource) {
		const known = captureSessionStoreReadCandidate(readSource.path);
		if (!candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath({
			...candidate,
			path: candidate.physicalPath
		}, known.physicalPath))) throw new Error("Session sharing source changed");
		candidates.push(known);
	}
	const identities = captureSessionStoreCandidateIdentities(candidates);
	return async () => {
		assertCallerCurrent();
		const resolved = readSource ?? await prepareSqliteTargetFromSessionStorePath(storePath, {
			agentId,
			env
		});
		const assertSourcePathCurrent = () => {
			if (!candidates.every(isSessionStoreReadCandidateCurrent)) throw new Error("Session sharing source changed");
			try {
				return assertSessionStoreReadCandidate(resolved.path, candidates);
			} catch (cause) {
				throw new Error("Session sharing source changed", { cause });
			}
		};
		const pathname = assertSourcePathCurrent();
		const identity = identities.get(pathname);
		if (!resolved.agentId || !identity?.key.startsWith("file:")) throw new Error("Session sharing source is unavailable");
		const source = readSource ?? {
			agentId: resolved.agentId,
			path: pathname,
			databaseIdentity: identity.key.slice(5),
			databaseBirthtime: identity.birthtime
		};
		const databaseIdentity = source.databaseIdentity;
		if (typeof databaseIdentity !== "string") throw new Error("Session sharing reader requires a file-backed source");
		const assertCurrent = () => {
			assertSourcePathCurrent();
			assertExistingDatabaseIdentity(pathname, identity.key, identity.birthtime);
			assertExistingDatabaseIdentity(source.path, `file:${databaseIdentity}`, source.databaseBirthtime);
		};
		assertCallerCurrent();
		assertCurrent();
		return {
			source,
			assertCurrent
		};
	};
}
//#endregion
//#region src/gateway/session-sharing-source.ts
/** Hold the existing reader only until the prepared writer operation settles. */
async function prepareSessionSharingSource(target, assertCallerCurrent, memoryFacts) {
	const read = memoryFacts ?? captureSessionSharingMemoryFacts({
		agentId: target.agentId,
		sessionKey: target.storeKey,
		resolved: target
	}, assertCallerCurrent);
	if (read) {
		if (target.agentId !== read.location.agentId || target.storePath !== read.location.path) throw new Error("Session sharing source changed");
		let active = true;
		const assertCurrent = () => {
			if (!active) throw new Error("Session sharing source is no longer retained");
			assertCallerCurrent();
			read.assertCurrent();
		};
		assertCurrent();
		return {
			actorSource: true,
			source: void 0,
			get target() {
				return read.readCurrent().target;
			},
			get members() {
				return [...read.readCurrent().membership];
			},
			assertCurrent,
			async release() {
				active = false;
			}
		};
	}
	const env = captureSessionTranscriptStorageEnvironment(process.env);
	const { source, assertCurrent: assertSourceCurrent } = await captureSessionSharingStore(target, env, assertCallerCurrent)();
	const retained = retainSessionHistoryWorkerDatabase({
		agentId: source.agentId,
		path: source.path,
		env
	});
	const assertCurrent = () => {
		assertCallerCurrent();
		assertSourceCurrent();
		retained.owner.assertCurrent();
	};
	try {
		const result = await retained.owner.readExactEntries({
			sessionKeys: [target.storeKey],
			projection: "sharing",
			includeAuthorization: true,
			env
		});
		assertCurrent();
		if (result.databaseIdentity?.identity !== source.databaseIdentity || result.databaseIdentity?.birthtime !== source.databaseBirthtime) throw new Error("Session sharing source changed");
		const entry = result.entries.find(({ sessionKey }) => sessionKey === target.storeKey)?.entry;
		return {
			actorSource: false,
			source,
			target: entry ? {
				...target,
				readSource: source,
				storeKeys: [target.storeKey],
				entry
			} : null,
			members: result.sharing?.members.find((row) => row.sessionKey === target.storeKey)?.identityIds ?? [],
			assertCurrent,
			release: retained.release
		};
	} catch (error) {
		await releaseSessionSourceAuthorities([retained], [error]);
		throw error;
	}
}
/** Storage facts are prepared here; the sharing owner supplies every access decision. */
function withPreparedSessionSharingSource(params) {
	const boundSources = /* @__PURE__ */ new Map();
	const targetChanged = (key) => sessionMutationTargetChanged(params.request.method, key);
	const assertSource = () => {
		const error = authorizeOwnSessionMutation({
			client: params.request.client,
			target: null,
			expectedProfileId: params.ownSessionProfileId
		});
		if (error) throw new SessionMutationAuthorizationChangedError(error);
		return params.request.context.getRuntimeConfig();
	};
	const assertCurrent = () => {
		const cfg = assertSource();
		const currentTalkTarget = params.assertTalkTargetCurrent(cfg);
		const caches = createSessionSharingLookupCaches();
		for (const target of params.targets) {
			const bound = boundSources.get(target)?.readCurrent();
			params.assertTargetCurrent(target, target, cfg, caches, void 0, bound && {
				target: bound.target,
				members: [...bound.membership]
			}, currentTalkTarget);
		}
	};
	const changed = () => targetChanged(params.targets[0]?.sessionKey ?? "");
	const assertRoutingCurrent = captureSessionMutationRouting(params.sourceConfig, changed, params.targets);
	const assertSourceCurrent = () => {
		const cfg = assertSource();
		assertRoutingCurrent(cfg);
		if (params.talk?.kind === "relay" && !params.talk.isCurrent()) throw changed();
		return cfg;
	};
	for (const target of params.targets) {
		const facts = captureSessionSharingMemoryFacts(target, assertSourceCurrent);
		if (facts) boundSources.set(target, facts);
	}
	const prepare = async () => {
		if (params.targets.every((target) => !target.resolved && !target.absentTarget)) {
			assertCurrent();
			return {
				assertCurrent,
				checks: [],
				release: async () => {}
			};
		}
		const prepared = [];
		const release = () => releaseSessionSourceAuthorities(prepared);
		try {
			assertSourceCurrent();
			const targets = params.targets.map((expected) => {
				const route = expected.resolved ?? expected.absentTarget;
				if (!route) throw targetChanged(expected.sessionKey);
				return {
					...route,
					storeKey: expected.resolved?.storeKey ?? route.canonicalKey
				};
			});
			for (const [index, target] of targets.entries()) {
				const bound = boundSources.get(params.targets[index]);
				prepared.push(await prepareSessionSharingSource(target, assertSourceCurrent, bound));
			}
			const assertPrepared = (index, facts) => {
				const read = prepared[index];
				if (!facts) read.assertCurrent();
				assertSourceCurrent();
				const expected = params.targets[index];
				params.assertTargetCurrent(expected, expected, assertSource(), void 0, void 0, {
					target: facts ? facts.entry ? {
						...targets[index],
						storeKeys: [targets[index].storeKey],
						readSource: read.source,
						entry: facts.entry
					} : null : read.target,
					members: facts?.members ?? read.members
				});
			};
			const assertPreparedCurrent = () => {
				assertSourceCurrent();
				for (let index = 0; index < prepared.length; index += 1) assertPrepared(index);
			};
			assertPreparedCurrent();
			return {
				assertCurrent: assertPreparedCurrent,
				checks: prepared.flatMap((read, index) => {
					if (read.actorSource) return [];
					const expected = params.targets[index];
					const predicate = {
						source: read.source,
						sessionKey: targets[index].storeKey,
						fields: [
							"sessionId",
							"lifecycleRevision",
							"createdActor",
							"visibility",
							"incognito",
							"sandbox"
						],
						expected: read.target?.entry,
						members: read.members
					};
					if (findPreparedSharingTarget(params.request, expected)) bindPublishedSessionSourceAdmission(predicate, () => {
						params.assertTargetCurrent(expected, expected, assertSourceCurrent());
					});
					return [{
						predicate,
						refuse: (facts) => {
							assertPrepared(index, facts);
							throw targetChanged(expected.sessionKey);
						}
					}];
				}),
				release
			};
		} catch (error) {
			await releaseSessionSourceAuthorities(prepared, [error]);
			throw error;
		}
	};
	return Object.assign(assertCurrent, {
		prepareSessionSource: prepare,
		...boundSources.size ? { prepareSessionSourceScope: prepare } : {}
	});
}
function captureSessionSharingTalkAuthority({ request, input, target, authorizesAgentRun, preparedPolicy }) {
	return (cfg) => {
		if (!input || !target) return;
		try {
			if (input.kind === "relay" && !input.isCurrent()) throw sessionMutationTargetChanged(request.method, target.sessionKey);
			assertTalkSessionStorageTarget(cfg, target);
		} catch {
			throw sessionMutationTargetChanged(request.method, target.sessionKey);
		}
		if (authorizesAgentRun) {
			const policyConfig = request.context.getCommittedRuntimeConfig?.() ?? cfg;
			const policy = preparedPolicy(policyConfig);
			const error = authorizeGatewaySessionCreation({
				cfg: policyConfig,
				client: request.client,
				agentId: target.agentId
			}, policy ? { policy: policy.policy } : void 0);
			if (error) throw new SessionMutationAuthorizationChangedError(error);
		}
		return target;
	};
}
function isSameSessionSharingSource(current, expected) {
	const source = expected.readSource;
	return source ? current.readSource?.databaseIdentity === source.databaseIdentity && current.readSource.databaseBirthtime === source.databaseBirthtime && current.readSource.agentId === source.agentId : current.storePath === expected.storePath;
}
function resolveSessionSharingMembership(target, identityId, members, projection) {
	return members ? Boolean(identityId && members.includes(identityId)) : projection && Boolean(identityId && projection.hasMembership(target.storePath, target.storeKey, identityId));
}
//#endregion
export { withCurrentSessionSharingSource as _, withPreparedSessionSharingSource as a, requirePreparedTalkSessionTarget as b, createSessionCreationAuthorizationRecorder as c, prepareAuthorizedSessionMutationFacts as d, prepareSessionMutationAuthorizationRequest as f, sessionMutationTargetChanged as g, resolveSessionMutationWriteRoute as h, resolveSessionSharingMembership as i, expectedSessionMutationTargetError as l, resolvePreparedTalkAuthorizationTarget as m, isSameSessionSharingSource as n, VISIBILITY_AUTHORIZED_METHODS as o, resolveOwnSessionProfileAuthorization as p, prepareSessionSharingSource as r, assertSessionMutationProjectionCurrent as s, captureSessionSharingTalkAuthority as t, findPreparedSharingTarget as u, assertTalkSessionStorageTarget as v, resolveTalkSessionAgentId as x, prepareTalkSessionTarget as y };
