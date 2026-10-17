import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { u as readUserProfileAliases } from "./user-profile-list-CtETKur7.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { g as readGatewayAccessRevision, o as operatorSessionCap, r as hasOperatorBoundary, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-BqPaarjx.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BT0kzSVu.mjs";
import { _ as resolveSessionStorePathForScope, i as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { l as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { f as isGatewayAdmin, r as authorizeOwnSessionMutation, y as sharingIdentity } from "./session-sharing-policy-BVt5saXn.mjs";
import { d as prepareSessionSharing, s as canReceiveSessionEvent } from "./session-sharing-target-read-DUttMvj3.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-BwpUabTn.mjs";
import { n as usesOwnRunQuestionAccess } from "./question-access-Bxw3nBhY.mjs";
import { n as QuestionManagerError, r as QuestionManagerErrorCodes } from "./question-manager-CWgnAtGc.mjs";
//#region src/gateway/question-session-access.ts
function prepareQuestionSharing(cfg, client, isMember) {
	const identity = sharingIdentity(client, resolveGatewayOperatorRoleActor(client));
	return prepareSessionSharing({
		cfg,
		client
	}, {
		aliases: identity ? readUserProfileAliases(identity.id) : /* @__PURE__ */ new Set(),
		sessionCap: operatorSessionCap(client, cfg),
		isMember
	});
}
/** Batch a response's targets; no row or recipient predicate remains authoritative after consume. */
async function withPreparedQuestionSessions(options, questions, consume, operation) {
	const signal = getAsyncWorkSignal();
	while (true) {
		operation.assertCurrent();
		const cfg = options.context.getRuntimeConfig();
		const accessRevision = readGatewayAccessRevision();
		let changed = false;
		const groups = /* @__PURE__ */ new Map();
		const selections = questions.map((question) => {
			if (!question.sessionKey) return;
			const resolved = resolveRequestedSessionAgentId(cfg, question.sessionKey, question.agentId);
			if (!resolved.ok) return;
			const agentId = resolved.agentId;
			const sessionKey = resolveStoredSessionKeyForAgentStore({
				cfg,
				agentId,
				sessionKey: question.sessionKey
			});
			const storePath = resolveSessionStorePathForScope({
				agentId,
				sessionKey
			}, cfg);
			const key = JSON.stringify([agentId, storePath]);
			const group = groups.get(key) ?? {
				agentId,
				storePath,
				sessionKeys: [],
				includeMembers: operation.includeMembers ?? false,
				includeAuthorization: true
			};
			group.sessionKeys.push(sessionKey);
			groups.set(key, group);
			return {
				key,
				agentId,
				sessionKey,
				storePath,
				binding: question.sessionAccess
			};
		});
		const readSignal = groups.size > 0 ? signal : void 0;
		readSignal?.throwIfAborted();
		const keys = [...groups.keys()];
		const unsubscribe = sessionChanges.subscribe((change) => {
			if ("all" in change) {
				const scope = change.scope;
				changed ||= typeof scope === "string" || selections.some((selected) => selected && (!scope.agentId || selected.agentId === scope.agentId) && (!scope.storePath || selected.storePath === scope.storePath || Boolean(scope.agentId)));
			} else changed ||= selections.some((selected) => selected && (!change.agentId || selected.agentId === change.agentId) && selected.sessionKey === change.sessionKey);
		});
		try {
			const outcome = await withSessionEntriesFromStoresInWorker([...groups.values()], (reads) => {
				readSignal?.throwIfAborted();
				operation.assertCurrent();
				if (changed || accessRevision !== readGatewayAccessRevision() || cfg !== options.context.getRuntimeConfig()) return { retry: true };
				let active = true;
				try {
					const value = consume(selections.map((selection) => {
						if (!selection) return;
						const read = reads[keys.indexOf(selection.key)];
						const entry = read.result.entries.find((row) => row.sessionKey === selection.sessionKey)?.entry;
						const target = entry ? {
							agentId: selection.agentId,
							canonicalKey: selection.sessionKey,
							storePath: selection.storePath,
							storeKey: selection.sessionKey,
							storeKeys: [selection.sessionKey],
							entry
						} : null;
						const assertCurrent = () => {
							if (!active || changed || cfg !== options.context.getRuntimeConfig() || accessRevision !== readGatewayAccessRevision()) throw new Error("Question session preparation is no longer current");
							read.assertCurrent();
							const identity = read.result.databaseIdentity;
							if (identity) assertExistingDatabaseIdentity(read.database.path, `file:${identity.identity}`);
							const currentCfg = options.context.getRuntimeConfig();
							if (resolveSessionStorePathForScope({
								agentId: selection.agentId,
								sessionKey: selection.sessionKey
							}, currentCfg) !== selection.storePath || resolveStoredSessionKeyForAgentStore({
								cfg: currentCfg,
								...selection
							}) !== selection.sessionKey) throw new Error("Question session route changed");
						};
						const recipients = /* @__PURE__ */ new Map();
						const sharingFor = (client) => {
							if (client?.invalidated) throw new Error("Question recipient is no longer current");
							client?.internal?.operatorAccessAuthority?.assertCurrent();
							client?.internal?.operatorRunAuthority?.assertCurrent();
							let sharing = recipients.get(client);
							if (!sharing) {
								sharing = prepareQuestionSharing(cfg, client, (selected, identityId) => read.result.members?.[selected.canonicalKey]?.some((member) => member.identityId === identityId) ?? false);
								recipients.set(client, sharing);
							}
							return sharing;
						};
						const preparedSession = {
							target,
							read,
							assertCurrent,
							canAccess: (client, _access, narrow, binding = selection.binding) => {
								try {
									if (narrow && binding) binding.assertCurrent(preparedSession);
									else assertCurrent();
									if (!target) return false;
									if (narrow) {
										client?.internal?.operatorAccessAuthority?.assertCurrent();
										client?.internal?.operatorRunAuthority?.assertCurrent();
										if (!binding?.canSelect(client) || authorizeCurrentOperatorRoleScopes(client, cfg) || target.entry.incognito || isIncognitoSessionKey(target.canonicalKey)) return false;
										const actor = resolveGatewayOperatorRoleActor(client);
										return actor?.kind === "operator" && !authorizeOwnSessionMutation({
											client,
											target,
											expectedProfileId: actor.profileId
										});
									}
									return sharingFor(client).entryFilter?.(target.canonicalKey, target.entry) ?? true;
								} catch {
									return false;
								}
							},
							authorizeMutation: (client) => {
								assertCurrent();
								return target ? sharingFor(client).authorizeTarget(target) : null;
							},
							canReceive: (client) => {
								try {
									assertCurrent();
									return canReceiveSessionEvent({
										cfg,
										client,
										sessionKeys: [selection.sessionKey],
										agentId: selection.agentId,
										prepared: {
											sharing: sharingFor(client),
											target: () => target
										}
									});
								} catch {
									return false;
								}
							}
						};
						return preparedSession;
					}));
					if (isPromiseLike(value)) {
						Promise.resolve(value).catch(() => {});
						throw new Error("Question session consumers must remain synchronous");
					}
					return {
						retry: false,
						value
					};
				} finally {
					active = false;
				}
			});
			if (!outcome.retry) return outcome.value;
		} finally {
			unsubscribe();
		}
	}
}
/** Capture before the first worker await, then bind only the exact admitted row in its consumer. */
async function withQuestionSessionAccess(options, sessionKey, agentId, consume, operation) {
	operation.assertCurrent();
	const producer = resolveGatewayOperatorRoleActor(options.client);
	const source = await captureGatewayOperatorRunAuthority(options);
	const profileId = usesOwnRunQuestionAccess(options.client) && options.client?.internal?.operatorRunAuthority ? source?.authority.profileId : void 0;
	let transferred = false;
	try {
		return await withPreparedQuestionSessions(options, [{
			sessionKey,
			agentId
		}], ([prepared]) => {
			const selected = prepared?.target;
			if (!prepared || !selected?.entry.sessionId || !selected.entry.lifecycleRevision || selected.entry.incognito || isIncognitoSessionKey(selected.canonicalKey)) return consume(void 0, prepared);
			source?.authority.assertCurrent();
			const retained = retainSessionHistoryWorkerDatabase(prepared.read.database);
			const identity = prepared.read.result.databaseIdentity;
			const original = {
				agentId: selected.agentId,
				sessionKey: selected.canonicalKey,
				storePath: selected.storePath,
				databasePath: prepared.read.database.path,
				sessionId: selected.entry.sessionId,
				lifecycleRevision: selected.entry.lifecycleRevision
			};
			let released = false;
			let invalidated = false;
			const assertSourceCurrent = () => {
				if (released || invalidated) throw new Error("Question session source was released");
				retained.owner.assertCurrent();
				source?.authority.assertCurrent();
				const currentProducer = resolveGatewayOperatorRoleActor(options.client);
				if (producer?.kind === "operator" && (currentProducer?.kind !== "operator" || producer.profileId !== currentProducer.profileId)) throw new Error("Question producer identity changed");
			};
			const access = {
				agentId: original.agentId,
				sessionKey: original.sessionKey,
				canSelect: (client) => Boolean(profileId && client && !client.invalidated && (client.connect.role ?? "operator") === "operator" && !authorizeOwnSessionMutation({
					client,
					target: null,
					expectedProfileId: profileId
				})),
				assertSourceCurrent,
				assertCurrent: (current) => {
					assertSourceCurrent();
					current.assertCurrent();
					const next = current.target;
					const nextIdentity = current.read.result.databaseIdentity;
					if (!identity || !nextIdentity || identity.identity !== nextIdentity.identity || identity.birthtime !== nextIdentity.birthtime || current.read.database.path !== original.databasePath || next?.agentId !== original.agentId || next.canonicalKey !== original.sessionKey || next.storePath !== original.storePath || next.entry.sessionId !== original.sessionId || next.entry.lifecycleRevision !== original.lifecycleRevision || next.entry.incognito) {
						invalidated = true;
						throw new Error("Question session generation changed");
					}
				},
				release: () => {
					if (!released) {
						released = true;
						try {
							retained.release();
						} finally {
							source?.release();
						}
					}
				}
			};
			transferred = true;
			try {
				const value = consume(access, prepared);
				if (isPromiseLike(value)) {
					Promise.resolve(value).catch(() => {});
					throw new Error("Question session consumers must remain synchronous");
				}
				return value;
			} catch (error) {
				access.release();
				throw error;
			}
		}, {
			assertCurrent: () => {
				operation.assertCurrent();
				source?.authority.assertCurrent();
			},
			includeMembers: operation.includeMembers
		});
	} finally {
		if (!transferred) source?.release();
	}
}
function canAccessSessionQuestion(observation, prepared, client, access) {
	try {
		if (!observation?.isCurrent() || !observation.ordinary || !observation.sessionAccess?.canSelect(client) || !prepared) return false;
		const allowed = prepared.canAccess(client, access, true, observation.sessionAccess);
		if (!allowed) observation.refreshRequester();
		return allowed;
	} catch {
		return false;
	}
}
function questionNotFound(id) {
	return errorShape(ErrorCodes.INVALID_REQUEST, `question '${id}' was not found`, { details: { reason: QuestionManagerErrorCodes.NOT_FOUND } });
}
function prepareQuestionAuthorization(options, observation, id, access) {
	const authority = readGatewayRequestMutationAuthority(options);
	const actor = resolveGatewayOperatorRoleActor(options.client);
	const narrow = usesOwnRunQuestionAccess(options.client);
	return {
		target: narrow || !isGatewayAdmin(options.client) && hasOperatorBoundary(options.client, options.context.getRuntimeConfig()) ? {
			...observation?.record,
			sessionAccess: observation?.sessionAccess
		} : {},
		assertCurrent: () => {
			authority.assertCurrent();
			if (narrow && observation?.sessionAccess) try {
				observation.sessionAccess.assertSourceCurrent();
			} catch {
				observation.refreshRequester();
				throw new QuestionManagerError(QuestionManagerErrorCodes.NOT_FOUND, `question '${id}' was not found`);
			}
		},
		authorize: (prepared) => {
			if (!observation?.isCurrent()) return questionNotFound(id);
			if (narrow) {
				authority.assertCurrent();
				const current = resolveGatewayOperatorRoleActor(options.client);
				if (actor?.kind !== "operator" || current?.kind !== "operator" || current.profileId !== actor.profileId || !canAccessSessionQuestion(observation, prepared, options.client, access)) return questionNotFound(id);
				return null;
			}
			if (isGatewayAdmin(options.client) || !hasOperatorBoundary(options.client, options.context.getRuntimeConfig()) || !observation.record.sessionKey) return null;
			if (!prepared?.canAccess(options.client, "read", false)) return questionNotFound(id);
			return access === "mutate" ? prepared.authorizeMutation(options.client) : null;
		}
	};
}
/** Retain the existing sharing facts owner through an asynchronous secret-answer commit. */
async function prepareQuestionCommitAuthority(options, observation, id) {
	const authorization = prepareQuestionAuthorization(options, observation, id, "mutate");
	authorization.assertCurrent();
	const cfg = options.context.getRuntimeConfig();
	const target = authorization.target;
	const resolved = target.sessionKey ? resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId) : void 0;
	if (resolved && !resolved.ok) throw new QuestionManagerError(QuestionManagerErrorCodes.NOT_FOUND, questionNotFound(id).message);
	const facts = target.sessionKey && resolved?.ok ? await prepareSessionMutationFacts({
		cfg,
		sessionKey: target.sessionKey,
		agentId: resolved.agentId,
		allowMissing: true
	}) : void 0;
	const assertCurrent = () => {
		authorization.assertCurrent();
		options.client?.internal?.operatorAccessAuthority?.assertCurrent();
		options.client?.internal?.operatorRunAuthority?.assertCurrent();
		const currentCfg = options.context.getRuntimeConfig();
		const accessRevision = readGatewayAccessRevision();
		let current = facts?.readCurrent(currentCfg);
		const sharing = prepareQuestionSharing(currentCfg, options.client, (_target, identityId) => current?.membership.has(identityId) ?? false);
		authorization.assertCurrent();
		current = facts?.readCurrent(options.context.getRuntimeConfig());
		if (!observation?.isCurrent() || usesOwnRunQuestionAccess(options.client) || currentCfg !== options.context.getRuntimeConfig() || !isGatewayAdmin(options.client) && hasOperatorBoundary(options.client, currentCfg) && observation.record.sessionKey && (!current?.target || sharing.entryFilter?.(current.target.storeKey, current.target.entry) === false || sharing.authorizeTarget(current.target)) || accessRevision !== readGatewayAccessRevision()) throw new QuestionManagerError(QuestionManagerErrorCodes.NOT_FOUND, questionNotFound(id).message);
	};
	try {
		assertCurrent();
		return {
			assertCurrent,
			release: () => facts?.release()
		};
	} catch (error) {
		facts?.release();
		throw error;
	}
}
function questionBroadcastOptions(params) {
	const { observation, prepared, expectedRecord, cfg, isPublishing } = params;
	const sessionKey = observation?.record.sessionKey;
	if (!prepared && !sessionKey) return;
	const isCurrent = () => Boolean(isPublishing() && observation?.isCurrent() && (!expectedRecord || observation.record === expectedRecord && expectedRecord.status === "pending"));
	return { questionRecipient: (client) => {
		if (!isCurrent()) return false;
		if (usesOwnRunQuestionAccess(client)) return canAccessSessionQuestion(observation, prepared, client, "read");
		if (prepared) return prepared.canReceive(client);
		return canReceiveSessionEvent({
			cfg,
			client,
			sessionKeys: sessionKey ? [sessionKey] : [],
			agentId: observation?.record.agentId,
			prepared: {
				sharing: prepareQuestionSharing(cfg, client, () => false),
				target: () => null
			}
		});
	} };
}
//#endregion
export { withPreparedQuestionSessions as a, questionNotFound as i, prepareQuestionCommitAuthority as n, withQuestionSessionAccess as o, questionBroadcastOptions as r, prepareQuestionAuthorization as t };
