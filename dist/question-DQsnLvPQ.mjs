import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { Ar as validateQuestionResolveParams, Dr as validateQuestionGetParams, Or as validateQuestionListParams, jr as validateQuestionWaitAnswerParams, kr as validateQuestionRequestParams } from "./src-l2dWvEsN.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as authorizeGatewaySessionCreation, r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { n as listSecretStoreEntries } from "./secret-store-B2HXTuK3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { h as registerActiveEmbeddedRunHumanInputWait } from "./run-state-BmDkKYBf.mjs";
import { n as handleQuestionChannelResolved, t as handleQuestionChannelRequested } from "./question-channel-runtime-CQFEhZRu.mjs";
import { t as questionShapeError } from "./question-validation-COQSqSzK.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-CxCbIrod.mjs";
import { f as isGatewayAdmin } from "./session-sharing-policy-4QkIpHi4.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as usesOwnRunQuestionAccess, t as canSelectQuestion } from "./question-access-Bxw3nBhY.mjs";
import { n as QuestionManagerError } from "./question-manager-CWgnAtGc.mjs";
import { a as withPreparedQuestionSessions, i as questionNotFound, n as prepareQuestionCommitAuthority, o as withQuestionSessionAccess, r as questionBroadcastOptions, t as prepareQuestionAuthorization } from "./question-session-access-BGNX8sVx.mjs";
//#region src/gateway/server-methods/question.errors.ts
var QuestionRequestValidationError = class extends Error {};
function managerError(error, respond) {
	if (!(error instanceof QuestionManagerError)) return false;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: { reason: error.code } }));
	return true;
}
//#endregion
//#region src/gateway/server-methods/question.ts
const DEFAULT_QUESTION_TIMEOUT_MS = 9e5;
async function normalizeQuestions(params, assertCurrent) {
	const error = questionShapeError(params.questions, {
		allowPlainSecretQuestions: false,
		validateUrls: true
	});
	if (error) throw new QuestionRequestValidationError(error);
	const entries = params.questions.some((question) => question.secretStore) ? await listSecretStoreEntries({
		scope: { kind: "team" },
		assertCurrent
	}) : [];
	assertCurrent();
	return params.questions.map((question) => {
		const binding = question.secretStore;
		if (binding) {
			const existing = entries.find((entry) => entry.name === binding.name);
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
function createQuestionHandlers(manager, storeWriteService, scheduler) {
	const prepareSelectedQuestion = (options, id, access) => {
		readGatewayRequestMutationAuthority(options).assertCurrent();
		const question = canSelectQuestion(manager, id, options.client) ? manager.get(id) : null;
		if (!question) {
			options.respond(false, void 0, questionNotFound(id));
			return;
		}
		const observation = manager.observe(id, question);
		return {
			question,
			observation,
			authorize: prepareQuestionAuthorization(options, observation, id, access)
		};
	};
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
				const questions = await normalizeQuestions(request, authority.assertCurrent);
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
						questions,
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
					handleQuestionChannelRequested(record, scheduler);
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
				const selected = prepareSelectedQuestion(options, request.id, "read");
				if (!selected) return;
				const { authorize } = selected;
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
				const selected = prepareSelectedQuestion(options, request.id, "mutate");
				if (!selected) return;
				const { question, observation, authorize } = selected;
				let reload;
				let save;
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
					const secretQuestion = question.questions[0];
					const binding = secretQuestion?.secretStore;
					if (!binding) {
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
					save = (async () => {
						let saved = false;
						let authority;
						try {
							const currentAuthority = await prepareQuestionCommitAuthority(options, observation, request.id);
							authority = currentAuthority;
							const result = await manager.resolveWithCommit(request.id, { answers: { [secretQuestion.questionId]: ["stored"] } }, request.resolvedBy, {
								resolutionId: request.resolutionId,
								commit: async (assertQuestionCurrent) => {
									await storeWriteService.write({
										name: binding.name,
										value,
										kind: "secret",
										...allowedHosts !== void 0 ? { allowedHosts } : {},
										updatedBy: storeWriteService.resolveUpdatedBy(client),
										assertCurrent: () => {
											currentAuthority.assertCurrent();
											assertQuestionCurrent();
										}
									});
									saved = true;
								}
							});
							currentAuthority.assertCurrent();
							reload = {
								name: binding.name,
								result
							};
						} catch (error) {
							if (!saved && managerError(error, respond)) return;
							respond(false, void 0, errorShape(!saved && error instanceof SecretStoreValidationError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, saved ? "Secret store entry was saved, but runtime refresh failed. Resolve provider errors and retry secrets.reload; do not resubmit this answer." : error instanceof SecretStoreValidationError ? error.message : "Secret store entry could not be saved."));
						} finally {
							authority?.release();
						}
					})();
				}, {
					assertCurrent: authorize.assertCurrent,
					includeMembers: !readGatewayRequestMutationAuthority(options).sessionScope && hasOperatorBoundary(client, options.context.getRuntimeConfig())
				});
				await save;
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
			const selected = prepareSelectedQuestion(options, params.id, "read");
			if (!selected) return;
			const { observation, authorize } = selected;
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
