import { r as getAsyncWorkSignal } from "./async-work-scope-CWk2dk1h.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bzzf_1MN.mjs";
import { i as listSecretStoreEntries } from "./secret-store-BjhT4Kcc.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Cr as validateQuestionGetParams, Dr as validateQuestionWaitAnswerParams, Er as validateQuestionResolveParams, Tr as validateQuestionRequestParams, wr as validateQuestionListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as readUserProfileAliases } from "./user-profile-list-B5pNqyXa.mjs";
import { n as authorizeGatewaySessionCreation, o as operatorSessionCap, r as hasOperatorBoundary, t as authorizeCurrentOperatorRoleScopes, u as resolveGatewayOperatorRoleActor, v as readGatewayAccessRevision } from "./operator-role-policy-Bt6aG_wj.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { a as withSessionEntriesFromStoresInWorker } from "./session-accessor-C05KQ5A3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { n as retainSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-C8IP_HKT.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { m as registerActiveEmbeddedRunHumanInputWait } from "./run-state-CTlPY590.mjs";
import { n as handleQuestionChannelResolved, t as handleQuestionChannelRequested } from "./question-channel-runtime-iX-d9p2G.mjs";
import { t as questionShapeError } from "./question-validation-56ns4QXx.mjs";
import { t as captureGatewayOperatorRunAuthority } from "./operator-run-authority-siPNmoXo.mjs";
import { i as readGatewayRequestMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { M as authorizeOwnSessionMutation, O as prepareSessionSharing, V as isGatewayAdmin, Y as sharingIdentity, w as canReceiveSessionEvent } from "./session-sharing-C_5FkkwM.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as usesOwnRunQuestionAccess, t as canSelectQuestion } from "./question-access-Zri0o4CD.mjs";
import { n as QuestionManagerError, r as QuestionManagerErrorCodes } from "./question-manager-qGFSWUta.mjs";
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
	const source = captureGatewayOperatorRunAuthority(options);
	const producer = resolveGatewayOperatorRoleActor(options.client);
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
//#region src/gateway/server-methods/question.ts
const DEFAULT_QUESTION_TIMEOUT_MS = 9e5;
var QuestionRequestValidationError = class extends Error {};
function managerError(error, respond) {
	if (!(error instanceof QuestionManagerError)) return false;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: { reason: error.code } }));
	return true;
}
function normalizeQuestions(params) {
	const error = questionShapeError(params.questions, {
		allowPlainSecretQuestions: false,
		validateUrls: true
	});
	if (error) throw new QuestionRequestValidationError(error);
	return params.questions.map((question) => {
		const binding = question.secretStore;
		if (binding) {
			const existing = listSecretStoreEntries({ scope: { kind: "team" } }).find((entry) => entry.name === binding.name);
			return {
				...question,
				secretStore: {
					...binding,
					allowedHosts: binding.allowedHosts ?? existing?.allowedHosts ?? []
				},
				...existing ? { secretStoreExisting: {
					updatedAtMs: existing.updatedAtMs,
					...existing.updatedBy ? { updatedBy: existing.updatedBy } : {}
				} } : {}
			};
		}
		return question;
	});
}
/** Creates the lazily loaded question RPC surface for one Gateway lifetime. */
function createQuestionHandlers(manager, storeWriteService) {
	return {
		"question.request": async (options) => {
			const { params, respond, context, client } = options;
			if (!assertValidParams(params, validateQuestionRequestParams, "question.request", respond)) return;
			let request = params;
			const storeBound = request.questions.some((question) => question.secretStore);
			const authority = readGatewayRequestMutationAuthority(options);
			authority.assertCurrent();
			const narrow = usesOwnRunQuestionAccess(client);
			let sessionAccess;
			let accepted = false;
			const requiresSharing = () => !isGatewayAdmin(client) && hasOperatorBoundary(client, context.getRuntimeConfig());
			if (storeBound && !isGatewayAdmin(client)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "secret store questions require an operator.admin client"));
				return;
			}
			const identity = client?.internal?.agentRuntimeIdentity;
			const validateAuthority = context.validateAgentRuntimeApprovalAuthority;
			if ((storeBound || narrow) && (!identity || !validateAuthority)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, storeBound ? "secret store questions require trusted agent runtime authority" : "question creation requires trusted agent runtime authority"));
				return;
			}
			const requester = identity ? structuredClone(identity) : void 0;
			const operatorAuthority = client?.internal?.operatorRunAuthority;
			const isRequesterActive = requester && validateAuthority ? () => {
				try {
					operatorAuthority?.assertCurrent();
					sessionAccess?.assertSourceCurrent();
					return validateAuthority(requester);
				} catch {
					return false;
				}
			} : void 0;
			if (narrow && (!operatorAuthority || storeBound || request.questions.some((question) => question.isSecret) || isRequesterActive?.() !== true)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session-scoped questions require an ordinary question and a live agent requester."));
				return;
			}
			if (requester) request = {
				...request,
				agentId: requester.agentId,
				sessionKey: requester.sessionKey,
				runId: requester.operationalRunInstance.runId
			};
			try {
				if (narrow && operatorAuthority) assertAdmittedRunOperatorAuthority(operatorAuthority);
				const requestedSession = request.sessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), request.sessionKey, request.agentId) : void 0;
				if (requestedSession && !requestedSession.ok) {
					respond(false, void 0, requestedSession.error);
					return;
				}
				if (narrow && requestedSession?.ok) {
					const agentError = authorizeGatewaySessionCreation({
						cfg: context.getRuntimeConfig(),
						client,
						agentId: requestedSession.agentId
					});
					if (agentError) {
						respond(false, void 0, agentError);
						return;
					}
				}
				const sessionKey = request.sessionKey && requestedSession?.ok ? resolveStoredSessionKeyForAgentStore({
					cfg: context.getRuntimeConfig(),
					agentId: requestedSession.agentId,
					sessionKey: request.sessionKey
				}) : void 0;
				const create = (prepared) => {
					if (sessionKey && requiresSharing()) {
						const authorizationError = prepared?.authorizeMutation(client);
						if (!prepared?.target || authorizationError) {
							respond(false, void 0, authorizationError ?? errorShape(ErrorCodes.FORBIDDEN, "Session is unavailable."));
							return;
						}
					}
					if (narrow) {
						authority.assertCurrent();
						if (!sessionAccess || !prepared?.canAccess(client, "mutate", true, sessionAccess)) {
							respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Session-scoped questions require your own materialized ordinary session."));
							return;
						}
					}
					const broadcastQuestion = (event, payload, observation, current, expectedRecord) => {
						const scoped = sessionKey && context.getRuntimeConfig().gateway?.roles ? {
							sessionKeys: [sessionKey],
							...requestedSession?.ok ? { agentId: requestedSession.agentId } : {}
						} : void 0;
						let publishing = true;
						const retained = questionBroadcastOptions({
							observation,
							prepared: current,
							expectedRecord,
							cfg: context.getRuntimeConfig(),
							isPublishing: () => publishing
						});
						try {
							if (scoped || retained) context.broadcast(event, payload, {
								...scoped,
								...retained
							});
							else context.broadcast(event, payload);
						} finally {
							publishing = false;
						}
					};
					authority.assertCurrent();
					const managerRequest = {
						...request.id ? { id: request.id } : {},
						questions: normalizeQuestions(request),
						...requestedSession?.ok ? { agentId: requestedSession.agentId } : request.agentId ? { agentId: request.agentId } : {},
						...sessionKey ? { sessionKey } : {},
						...request.runId ? { runId: request.runId } : {},
						timeoutMs: request.timeoutMs ?? DEFAULT_QUESTION_TIMEOUT_MS,
						isRequesterActive,
						sessionAccess,
						requesterRun: requester?.operationalRunInstance,
						registerHumanInputWait: requester && isRequesterActive ? (isPending) => registerActiveEmbeddedRunHumanInputWait(requester.delegatedAuthority, isPending) : void 0,
						onResolved: async (event, observation) => {
							handleQuestionChannelResolved(event);
							let consumed = false;
							try {
								await withPreparedQuestionSessions(options, [{
									...observation.record,
									sessionAccess: observation.sessionAccess
								}], ([current]) => {
									consumed = true;
									if (!observation.isCurrent()) return;
									broadcastQuestion("question.resolved", event, observation, current);
								}, { assertCurrent: () => {
									if (!observation.isCurrent()) throw new Error("Question publication owner retired");
								} });
							} catch (error) {
								if (consumed || !observation.isCurrent()) throw error;
								broadcastQuestion("question.resolved", event, observation, void 0);
							}
						}
					};
					const record = manager.request(managerRequest);
					accepted = true;
					handleQuestionChannelRequested(record);
					broadcastQuestion("question.requested", record, manager.observe(record.id, record), prepared, record);
					respond(true, {
						id: record.id,
						expiresAtMs: record.expiresAtMs
					}, void 0);
				};
				if (sessionKey && requestedSession?.ok) {
					let consumed = false;
					try {
						await withQuestionSessionAccess(options, sessionKey, requestedSession.agentId, (access, prepared) => {
							consumed = true;
							sessionAccess = request.questions.some((question) => question.isSecret || question.secretStore) ? void 0 : access;
							try {
								return create(prepared);
							} finally {
								if (!sessionAccess) access?.release();
							}
						}, {
							assertCurrent: authority.assertCurrent,
							includeMembers: !narrow && requiresSharing()
						});
					} catch (error) {
						if (consumed || narrow || requiresSharing()) throw error;
						create();
					}
				} else create();
			} catch (error) {
				if (error instanceof QuestionRequestValidationError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
					return;
				}
				if (!managerError(error, respond)) {
					if (storeBound) {
						respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Secret store entry metadata is unavailable."));
						return;
					}
					throw error;
				}
			} finally {
				if (!accepted) sessionAccess?.release();
			}
		},
		"question.waitAnswer": async (options) => {
			const { params, respond } = options;
			if (!assertValidParams(params, validateQuestionWaitAnswerParams, "question.waitAnswer", respond)) return;
			const request = params;
			try {
				readGatewayRequestMutationAuthority(options).assertCurrent();
				const question = canSelectQuestion(manager, request.id, options.client) ? manager.get(request.id) : null;
				if (!question) {
					respond(false, void 0, questionNotFound(request.id));
					return;
				}
				const authorize = prepareQuestionAuthorization(options, question ? manager.observe(request.id, question) : null, request.id, "read");
				const target = authorize.target;
				const waiting = await withPreparedQuestionSessions(options, [target], ([prepared]) => {
					const error = authorize.authorize(prepared);
					if (error) {
						respond(false, void 0, error);
						return;
					}
					return { answer: manager.waitAnswer(request.id, request.timeoutMs, request.includeResolutionId) };
				}, { assertCurrent: authorize.assertCurrent });
				if (!waiting) return;
				const answer = await waiting.answer;
				await withPreparedQuestionSessions(options, [target], ([prepared]) => {
					const error = authorize.authorize(prepared);
					if (error) {
						respond(false, void 0, error);
						return;
					}
					respond(true, answer, void 0);
				}, { assertCurrent: authorize.assertCurrent });
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.resolve": async (options) => {
			const { params, respond, client } = options;
			if (!assertValidParams(params, validateQuestionResolveParams, "question.resolve", respond)) return;
			const request = params;
			try {
				readGatewayRequestMutationAuthority(options).assertCurrent();
				const question = canSelectQuestion(manager, request.id, options.client) ? manager.get(request.id) : null;
				if (!question) {
					respond(false, void 0, questionNotFound(request.id));
					return;
				}
				const authorize = prepareQuestionAuthorization(options, question ? manager.observe(request.id, question) : null, request.id, "mutate");
				let reload;
				await withPreparedQuestionSessions(options, [authorize.target], ([prepared]) => {
					const authorizationError = authorize.authorize(prepared);
					if (authorizationError) {
						respond(false, void 0, authorizationError);
						return;
					}
					if ("cancel" in request) {
						respond(true, manager.cancel(request.id, request.resolvedBy), void 0);
						return;
					}
					const secretQuestion = question?.questions[0];
					const binding = secretQuestion?.secretStore;
					if (!binding || !question) {
						if (request.secretStoreAllowedHosts !== void 0) {
							respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Secret store allowed hosts require a store-bound question."));
							return;
						}
						respond(true, manager.resolve(request.id, request.answers, request.resolvedBy, { resolutionId: request.resolutionId }), void 0);
						return;
					}
					const submittedAnswers = request.answers.answers;
					const values = Object.hasOwn(submittedAnswers, secretQuestion.questionId) ? submittedAnswers[secretQuestion.questionId] : void 0;
					const value = values?.[0];
					if (Object.keys(submittedAnswers).length !== 1 || values?.length !== 1 || value === void 0) {
						respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `question '${secretQuestion.questionId}' requires exactly one secret value`));
						return;
					}
					registerSecretValueForRedaction(value);
					const allowedHosts = request.secretStoreAllowedHosts ?? binding.allowedHosts;
					let saved = false;
					try {
						const result = manager.resolve(request.id, { answers: { [secretQuestion.questionId]: ["stored"] } }, request.resolvedBy, {
							resolutionId: request.resolutionId,
							commit: () => {
								storeWriteService.write({
									name: binding.name,
									value,
									kind: "secret",
									...allowedHosts !== void 0 ? { allowedHosts } : {},
									updatedBy: storeWriteService.resolveUpdatedBy(client)
								});
								saved = true;
							}
						});
						reload = {
							name: binding.name,
							result
						};
					} catch (error) {
						if (managerError(error, respond)) return;
						respond(false, void 0, errorShape(!saved && error instanceof SecretStoreValidationError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, saved ? "Secret store entry was saved, but runtime refresh failed. Resolve provider errors and retry secrets.reload; do not resubmit this answer." : error instanceof SecretStoreValidationError ? error.message : "Secret store entry could not be saved."));
					}
				}, {
					assertCurrent: authorize.assertCurrent,
					includeMembers: !readGatewayRequestMutationAuthority(options).sessionScope && hasOperatorBoundary(client, options.context.getRuntimeConfig())
				});
				if (reload) try {
					await storeWriteService.reloadReference(reload.name);
					respond(true, reload.result, void 0);
				} catch {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Secret store entry was saved, but runtime refresh failed. Resolve provider errors and retry secrets.reload; do not resubmit this answer."));
				}
			} catch (error) {
				if (!managerError(error, respond)) throw error;
			}
		},
		"question.get": async (options) => {
			const { params, respond } = options;
			if (!assertValidParams(params, validateQuestionGetParams, "question.get", respond)) return;
			const id = params.id;
			readGatewayRequestMutationAuthority(options).assertCurrent();
			const question = canSelectQuestion(manager, id, options.client) ? manager.get(id) : null;
			if (!question) {
				respond(false, void 0, questionNotFound(id));
				return;
			}
			const observation = manager.observe(id, question);
			const authorize = prepareQuestionAuthorization(options, observation, id, "read");
			await withPreparedQuestionSessions(options, [authorize.target], ([prepared]) => {
				const error = authorize.authorize(prepared);
				if (error) {
					respond(false, void 0, error);
					return;
				}
				respond(true, { question: observation.record }, void 0);
			}, { assertCurrent: authorize.assertCurrent }).catch((error) => {
				if (!managerError(error, respond)) throw error;
			});
		},
		"question.list": async (options) => {
			const { params, respond } = options;
			if (!assertValidParams(params, validateQuestionListParams, "question.list", respond)) return;
			readGatewayRequestMutationAuthority(options).assertCurrent();
			const records = manager.list(usesOwnRunQuestionAccess(options.client) ? (question) => canSelectQuestion(manager, question.id, options.client) : void 0).map((question) => {
				const observation = manager.observe(question.id, question);
				return {
					question,
					observation,
					authorize: prepareQuestionAuthorization(options, observation, question.id, "read")
				};
			});
			await withPreparedQuestionSessions(options, records.map(({ authorize }) => authorize.target), (prepared) => {
				const questions = records.flatMap(({ question, observation, authorize }, index) => observation?.record === question && question.status === "pending" && !authorize.authorize(prepared[index]) ? [question] : []);
				respond(true, { questions }, void 0);
			}, { assertCurrent: readGatewayRequestMutationAuthority(options).assertCurrent });
		}
	};
}
//#endregion
export { createQuestionHandlers };
