import { Ai as validateSessionSuggestionsAddParams, Mi as validateSessionSuggestionsResolveParams, Ng as errorShape, Ni as validateSessionTypingParams, ji as validateSessionSuggestionsListParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { t as SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS } from "./session-suggestion-policy-D8gImch7.mjs";
import { s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { l as resolveSessionSubscriptionKeys, r as resolveRequestedSessionAgentId, s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { t as listSessionSuggestions } from "./sessions-CnzPI1yx.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility, c as canManageSessionSharing, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as captureSessionSharingMemoryFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import "./session-sharing-preparation-DAfvBDLL.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as presenceUserKey } from "./presence-user-DFg4B6Vx.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { a as normalizeTypingRequestParams, i as liveViewerIdentities, n as broadcastTypingThrottled, o as updateTypingConnections, t as TYPING_THROTTLE_MS } from "./session-typing-state-D7sRI0Ow.mjs";
import { c as withSessionMutationCommitGuard, o as retainForwardedSessionMutationAuthorization } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-C1LFMGG7.mjs";
import { t as handleChatSend } from "./chat-send-handler-BoIwRdj6.mjs";
import { r as sharingExpectedEntry } from "./sessions-sharing-authority-D3-YNQkH.mjs";
import { a as releaseSessionSuggestionDispatchInWorker, i as finalizeSessionSuggestionClaimInWorker, r as claimSessionSuggestionDispatchInWorker, t as addSessionSuggestionInWorker } from "./session-metadata-write.async-Bn8QH4ek.mjs";
import { a as requireVisibleSuggestionRole, i as requireSuggestionTarget, n as createSessionSuggestionMutation, o as sessionSuggestionSessionChangedError, r as readCollaborationTarget, s as suggestionScope, t as authorizeSessionSuggestionMutation } from "./sessions-suggestions-access-Dvq3mGgw.mjs";
//#region src/gateway/server-methods/sessions-suggestions-dispatch.ts
async function dispatchSuggestion(params) {
	let response;
	const chatParams = {
		sessionKey: params.target.canonicalKey,
		agentId: params.target.agentId,
		sessionId: params.expectedSessionId,
		message: params.suggestion.text,
		queueMode: params.resolution === "queue" ? "followup" : "steer",
		idempotencyKey: `session-suggestion:${params.suggestion.id}`
	};
	const captureResponse = (...args) => {
		response = args;
	};
	const { client, suggestion } = params;
	const label = suggestion.authorLabel ?? suggestion.authorId;
	const chatClient = {
		...client,
		internal: {
			...client.internal,
			syntheticClient: true,
			senderAttribution: {
				id: suggestion.authorId,
				identity: {
					type: "profile",
					id: suggestion.authorId
				},
				name: `Suggested by ${label}`
			}
		}
	};
	const assertRequestCurrent = () => {
		params.signal?.throwIfAborted();
		params.sessionMutationAuthorization?.assertCurrent();
	};
	const assertAdmittedCurrent = params.sessionMutationAuthorization?.assertAdmittedSourceCurrent ?? params.sessionMutationAuthorization?.assertAdmittedInputCurrent ?? params.sessionMutationAuthorization?.assertCurrent;
	let chatAuthorization;
	let releaseChatAuthorization;
	try {
		assertRequestCurrent();
		const current = params.readCurrent();
		if (!authorizeSessionSuggestionMutation({
			client: params.client,
			...current,
			sessionKey: params.target.canonicalKey,
			respond: captureResponse
		}, params.resolution)) return {
			ok: false,
			error: response?.[2]
		};
		const expectedTarget = {
			agentId: current.target.agentId,
			sessionKey: current.target.canonicalKey,
			storePath: current.target.storePath,
			sessionId: params.expectedSessionId
		};
		const authorization = await resolveSessionMutationAuthorizationAsync({
			client: chatClient,
			method: "chat.send",
			requestParams: chatParams,
			context: params.context,
			expectedTarget,
			assertInvocationCurrent: assertRequestCurrent
		});
		releaseChatAuthorization = authorization.authorization?.release;
		assertRequestCurrent();
		if (authorization.error) return {
			ok: false,
			error: authorization.error
		};
		chatAuthorization = withSessionMutationCommitGuard(authorization.authorization, assertAdmittedCurrent, assertRequestCurrent);
		if (chatAuthorization) {
			chatAuthorization = retainForwardedSessionMutationAuthorization(chatAuthorization, params.sessionMutationAuthorization);
			releaseChatAuthorization = chatAuthorization.release;
		}
		chatAuthorization?.assertCurrent();
	} catch (error) {
		releaseChatAuthorization?.();
		if (error instanceof SessionMutationAuthorizationChangedError) return {
			ok: false,
			error: error.error
		};
		if (isSessionWorkStartInvalidatedError(error)) return {
			ok: false,
			error: sessionSuggestionSessionChangedError(params.target.canonicalKey)
		};
		return {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion dispatch authorization failed")
		};
	}
	try {
		await handleChatSend({
			req: {
				...params.req,
				method: "chat.send",
				params: chatParams
			},
			params: chatParams,
			client: chatClient,
			isWebchatConnect: params.isWebchatConnect,
			respond: captureResponse,
			sessionMutationAuthorization: chatAuthorization,
			sessionMutationCommitGuard: assertRequestCurrent,
			context: params.context
		});
	} finally {
		releaseChatAuthorization?.();
	}
	return response?.[0] === true ? { ok: true } : {
		ok: false,
		error: response?.[2]
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-typing.ts
const sessionTypingHandler = async ({ params: requestParams, respond, client, context, hasCurrentClientAuthority }) => {
	const params = normalizeTypingRequestParams(requestParams);
	if (!assertValidParams(params, validateSessionTypingParams, "session.typing", respond)) return;
	const projection = requireSessionRowProjection(context);
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		respond(false, void 0, requestedAgent.error);
		return;
	}
	const query = {
		key: params.sessionKey,
		agentId: requestedAgent.agentId
	};
	const actorFacts = captureSessionSharingMemoryFacts({
		sessionKey: query.key,
		agentId: query.agentId,
		resolved: null
	}, () => {
		if (client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false) throw new SessionMutationFactsUnavailableError();
	});
	if (!actorFacts) while (projection.needsMembershipPreparation()) await projection.prepareMembership();
	const readTarget = () => readCollaborationTarget(projection, query, actorFacts);
	const incognitoError = authorizeIncognitoSessionTarget({
		client,
		sessionKey: query.key,
		target: null
	});
	if (incognitoError) {
		respond(false, void 0, incognitoError);
		return;
	}
	const target = readTarget();
	const sharing = () => prepareProjectedSessionSharing({
		cfg: projection.getPolicyConfig(),
		client,
		isMember: (value, identity) => actorFacts ? actorFacts.readCurrent().membership.has(identity) : projection.hasMembership(value.storePath, value.storeKey, identity)
	});
	const prepared = sharing();
	if (!target || hasOperatorBoundary(client, projection.getPolicyConfig()) && prepared.entryFilter?.(target.storeKey, target.entry) === false) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return;
	}
	const denied = authorizeIncognitoSessionTarget({
		client,
		sessionKey: query.key,
		target
	});
	if (denied) {
		respond(false, void 0, denied);
		return;
	}
	const canType = (current, access = sharing()) => {
		if (authorizeIncognitoSessionTarget({
			client,
			sessionKey: query.key,
			target: current
		}) || hasOperatorBoundary(client, projection.getPolicyConfig()) && access.entryFilter?.(current.storeKey, current.entry) === false) return false;
		const role = access.roleForTarget(current);
		const visibility = resolveSessionVisibility(current.entry);
		return !(role === "viewer" && access.sessionCap === "view") && (visibility !== "draft" || canManageSessionSharing(role)) && (role !== "viewer" || visibility === "shared" || visibility === "suggest");
	};
	const actor = gatewayClientSessionCreator(client);
	if (params.sessionId !== target.entry.sessionId || !actor || client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false || !canType(target, prepared)) {
		respond(true, {
			ok: true,
			broadcast: false
		});
		return;
	}
	if (params.typing) context.recordClientActivity?.(client);
	const sessionKeys = /* @__PURE__ */ new Set([
		params.sessionKey,
		target.canonicalKey,
		target.storeKey,
		sessionObserverScopeKey(target.canonicalKey, target.agentId)
	]);
	const now = Date.now();
	const typingKey = `${actor.id}\0${target.agentId}\0${target.canonicalKey}\0${target.entry.sessionId}\0${target.entry.lifecycleRevision ?? 0}`;
	const { typing: effectiveTyping, preview, cursor } = updateTypingConnections({
		key: typingKey,
		connectionId: client?.connId ?? actor.id,
		typing: params.typing,
		preview: params.preview,
		cursor: params.cursor,
		now
	});
	respond(true, {
		ok: true,
		broadcast: broadcastTypingThrottled({
			key: typingKey,
			typing: effectiveTyping,
			signature: `${effectiveTyping}\0${preview ?? ""}\0${cursor ?? ""}`,
			intervalMs: preview ? 250 : TYPING_THROTTLE_MS,
			now,
			emit: () => {
				if (client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false || gatewayClientSessionCreator(client)?.id !== actor.id || getSessionRowProjection(context) !== projection) return false;
				const current = readTarget();
				if (!current || current.generation !== target.generation || current.storePath !== target.storePath || current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision || !canType(current)) return false;
				const liveIdentities = liveViewerIdentities(sessionKeys);
				const actorKey = presenceUserKey({
					id: actor.id,
					identity: {
						type: "profile",
						id: actor.id
					}
				});
				if (liveIdentities.size < 2 || !liveIdentities.has(actorKey)) return false;
				const event = {
					sessionKey: target.canonicalKey,
					sessionId: current.entry.sessionId,
					agentId: target.agentId,
					actor,
					typing: effectiveTyping,
					...preview ? { preview } : {},
					...cursor !== void 0 ? { cursor } : {},
					ts: Date.now()
				};
				context.broadcast("session.typing", event, {
					sessionKeys: resolveSessionSubscriptionKeys(current.canonicalKey, current.agentId, current.canonicalKey === "global" ? tryResolveSessionCompatibilityOwnerAgentId(context.getRuntimeConfig(), current.canonicalKey) : void 0),
					agentId: target.agentId,
					dropIfSlow: true
				});
				return true;
			}
		})
	});
};
//#endregion
//#region src/gateway/server-methods/sessions-suggestions.ts
function protocolSuggestion(target, suggestion) {
	return {
		id: suggestion.id,
		sessionKey: target.canonicalKey,
		agentId: target.agentId,
		author: {
			type: "human",
			id: suggestion.authorId,
			...suggestion.authorLabel ? { label: suggestion.authorLabel } : {}
		},
		text: suggestion.text,
		createdAt: suggestion.createdAt,
		state: suggestion.state
	};
}
function publishSuggestion(context, target, requestedSessionKey, action, stored) {
	const suggestion = protocolSuggestion(target, stored);
	context.broadcast("session.suggestion", {
		action,
		suggestion
	}, {
		sessionKeys: [.../* @__PURE__ */ new Set([
			requestedSessionKey,
			target.canonicalKey,
			target.storeKey
		])].toSorted(),
		agentId: suggestion.agentId
	});
	return suggestion;
}
function respondSuggestionDispatchError(respond, error) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion dispatch outcome is unknown", {
		retryable: true,
		retryAfterMs: SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS
	}));
}
const sessionSuggestionHandlers = {
	"session.suggestions.add": defineValidatedGatewayHandler("session.suggestions.add", validateSessionSuggestionsAddParams, async ({ params, respond, client, context, signal, sessionMutationAuthorization }) => {
		const target = await requireSuggestionTarget({
			context,
			...params,
			respond
		});
		const author = gatewayClientSessionCreator(client);
		if (!target) return;
		if (!author) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "identified suggestion author required"));
			return;
		}
		const text = params.text;
		if (!text.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "suggestion text is required"));
			return;
		}
		const expectedSessionId = target.entry.sessionId;
		const expectedEntry = {
			...sharingExpectedEntry(target),
			lifecycleRevision: target.entry.lifecycleRevision
		};
		const mutation = await createSessionSuggestionMutation({
			target,
			context,
			client,
			respond,
			sessionKey: params.sessionKey,
			signal,
			assertCurrent: sessionMutationAuthorization?.assertCurrent
		});
		try {
			const added = await mutation.run({
				kind: "start",
				action: "add",
				mutate: async (scope, assertCurrent) => {
					const suggestion = await addSessionSuggestionInWorker(scope, {
						authorId: author.id,
						authorLabel: author.label,
						text,
						expectedSessionId,
						expectedEntry
					}, assertCurrent);
					mutation.readCurrent();
					return publishSuggestion(context, target, params.sessionKey, "added", suggestion);
				}
			});
			if (added.ok) respond(true, { suggestion: added.value });
			else respond(false, void 0, added.error);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "suggestion could not be stored"));
		} finally {
			mutation.release();
		}
	}),
	"session.suggestions.list": defineValidatedGatewayHandler("session.suggestions.list", validateSessionSuggestionsListParams, async ({ params, respond, client, context, signal, hasCurrentClientAuthority }) => {
		const cfg = context.getRuntimeConfig();
		const requested = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
		if (!requested.ok) {
			respond(false, void 0, requested.error);
			return;
		}
		const identity = gatewayClientSessionCreator(client);
		const projection = requireSessionRowProjection(context);
		const query = {
			key: params.sessionKey,
			agentId: requested.agentId
		};
		const actorFacts = captureSessionSharingMemoryFacts({
			sessionKey: query.key,
			agentId: query.agentId,
			resolved: null
		}, () => {
			signal?.throwIfAborted();
			if (client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false) throw new SessionMutationFactsUnavailableError();
		});
		if (!actorFacts) while (projection.needsMembershipPreparation()) await projection.prepareMembership();
		let selected = null;
		const readCurrent = () => {
			if (signal?.aborted || client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false || gatewayClientSessionCreator(client)?.id !== identity?.id) {
				respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "suggestion reader authority changed"));
				return null;
			}
			const target = readCollaborationTarget(projection, query, actorFacts);
			if (getSessionRowProjection(context) !== projection || selected && (!target || !actorFacts && target.generation !== selected.generation || target.storePath !== selected.storePath || target.entry.sessionId !== selected.entry.sessionId || target.entry.lifecycleRevision !== selected.entry.lifecycleRevision)) throw new SessionMutationFactsUnavailableError();
			const policy = (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)();
			const sharing = prepareProjectedSessionSharing({
				cfg: policy,
				client,
				isMember: (value, id) => actorFacts ? actorFacts.readCurrent().membership.has(id) : projection.hasMembership(value.storePath, value.storeKey, id)
			});
			const role = requireVisibleSuggestionRole({
				client,
				cfg: policy,
				sessionKey: params.sessionKey,
				target: target ?? null,
				respond,
				sharing
			});
			return role === null || !target ? null : {
				target,
				role
			};
		};
		const initial = readCurrent();
		if (!initial) return;
		selected = initial.target;
		const stored = await listSessionSuggestions(suggestionScope(initial.target));
		const reply = () => {
			const current = readCurrent();
			if (!current) return;
			const visible = stored.filter((suggestion) => suggestion.authorId === identity?.id || current.role !== "viewer" && suggestion.state === "pending");
			respond(true, {
				role: current.role,
				suggestions: visible.map((suggestion) => protocolSuggestion(current.target, suggestion))
			});
		};
		reply();
	}),
	"session.suggestions.resolve": defineValidatedGatewayHandler("session.suggestions.resolve", validateSessionSuggestionsResolveParams, async ({ params, respond, client, context, req, isWebchatConnect, signal, sessionMutationAuthorization }) => {
		const target = await requireSuggestionTarget({
			context,
			...params,
			respond
		});
		if (!target) return;
		const resolution = params.resolution;
		const dispatching = resolution === "send" || resolution === "queue";
		if (dispatching && !client) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "connected client required for suggestion dispatch"));
			return;
		}
		const expectedSessionId = target.entry.sessionId;
		const expectedEntry = {
			...sharingExpectedEntry(target),
			lifecycleRevision: target.entry.lifecycleRevision
		};
		const mutation = await createSessionSuggestionMutation({
			target,
			context,
			client,
			respond,
			sessionKey: params.sessionKey,
			signal,
			assertCurrent: sessionMutationAuthorization?.assertCurrent
		});
		try {
			const claimResult = await mutation.run({
				kind: "start",
				action: resolution,
				mutate: (scope, assertCurrent) => claimSessionSuggestionDispatchInWorker(scope, {
					id: params.id,
					resolution,
					expectedSessionId,
					expectedEntry
				}, assertCurrent)
			});
			if (!claimResult.ok) {
				respond(false, void 0, claimResult.error);
				return;
			}
			const claim = claimResult.value;
			if (!claim) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "pending suggestion not found"));
				return;
			}
			if (claim.kind === "busy") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "suggestion resolution is already in progress", {
					retryable: true,
					retryAfterMs: SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS
				}));
				return;
			}
			if (claim.kind === "mismatch") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `suggestion dispatch recovery must retry the original ${claim.resolution} action`));
				return;
			}
			const releaseClaim = async () => {
				try {
					const released = await mutation.run({
						kind: "settle",
						mutate: (scope, assertCurrent) => releaseSessionSuggestionDispatchInWorker(scope, {
							id: claim.suggestion.id,
							token: claim.token,
							expectedSessionId
						}, assertCurrent)
					});
					if (!released.ok) respond(false, void 0, released.error);
					return released.ok;
				} catch (error) {
					respondSuggestionDispatchError(respond, error);
					return false;
				}
			};
			if (dispatching && client) {
				let dispatched;
				try {
					dispatched = await dispatchSuggestion({
						context,
						client,
						req,
						isWebchatConnect,
						target,
						suggestion: claim.suggestion,
						resolution,
						expectedSessionId,
						readCurrent: mutation.readCurrent,
						signal,
						sessionMutationAuthorization
					});
				} catch (error) {
					respondSuggestionDispatchError(respond, error);
					return;
				}
				if (!dispatched.ok) {
					if (!await releaseClaim()) return;
					respond(false, void 0, dispatched.error ?? errorShape(ErrorCodes.INVALID_REQUEST, "suggestion dispatch failed"));
					return;
				}
			}
			const finalizeResult = await mutation.run({
				...dispatching ? { kind: "settle" } : {
					kind: "start",
					action: resolution
				},
				mutate: async (scope, assertCurrent) => {
					const suggestion = await finalizeSessionSuggestionClaimInWorker(scope, {
						id: claim.suggestion.id,
						token: claim.token,
						state: resolution === "dismiss" ? "dismissed" : "accepted",
						expectedSessionId,
						...!dispatching ? { expectedEntry } : {}
					}, assertCurrent);
					mutation.readCurrent();
					if (!suggestion) return null;
					return publishSuggestion(context, target, params.sessionKey, "resolved", suggestion);
				}
			});
			if (!finalizeResult.ok) {
				if (!dispatching && !await releaseClaim()) return;
				respond(false, void 0, finalizeResult.error);
				return;
			}
			const suggestion = finalizeResult.value;
			if (!suggestion) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "suggestion resolution could not be finalized", { retryable: true }));
				return;
			}
			respond(true, { suggestion });
		} finally {
			mutation.release();
		}
	}),
	"session.typing": sessionTypingHandler
};
//#endregion
export { sessionSuggestionHandlers };
