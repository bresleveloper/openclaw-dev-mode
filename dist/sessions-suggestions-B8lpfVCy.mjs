import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { ci as validateSessionSuggestionsAddParams, di as validateSessionTypingParams, li as validateSessionSuggestionsListParams, ui as validateSessionSuggestionsResolveParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { c as isSessionWorkStartInvalidatedError, o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { t as SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS } from "./session-suggestion-store.kernel-BJlDtUvU.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId, s as resolveSessionSubscriptionKeys } from "./session-request-agent-Bxi11ET4.mjs";
import { t as listSessionSuggestions } from "./sessions-DNhLX2Ep.mjs";
import { n as presenceUserKey } from "./presence-user-DFg4B6Vx.mjs";
import { a as updateTypingConnections, i as liveViewerIdentities, n as broadcastTypingThrottled, t as TYPING_THROTTLE_MS } from "./session-typing-state-bCPje0x2.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { o as withSessionMutationCommitGuard } from "./session-mutation-guards-CxCbIrod.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-eHG52FnK.mjs";
import { l as canManageSessionSharing, n as authorizeIncognitoSessionTarget, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import { t as resolveSessionMutationAuthorization } from "./session-sharing-t7UPtrZq.mjs";
import { r as prepareSessionMutationFacts } from "./session-sharing-preparation-DCGOreuH.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { g as sessionObserverScopeKey } from "./session-observer-model-DBd4UseX.mjs";
import { t as handleChatSend } from "./chat-send-handler-CEaYLxKm.mjs";
import { i as sharingExpectedEntry } from "./sessions-sharing-authority-exUb7j4B.mjs";
import { a as releaseSessionSuggestionDispatchInWorker, i as finalizeSessionSuggestionClaimInWorker, r as claimSessionSuggestionDispatchInWorker, t as addSessionSuggestionInWorker } from "./session-metadata-write.async-B56kwvYb.mjs";
import { a as requireVisibleSuggestionRole, i as requireSuggestionTarget, n as createSessionSuggestionMutation, o as sessionSuggestionSessionChangedError, r as publishSuggestion, s as suggestionScope, t as authorizeSessionSuggestionMutation } from "./sessions-suggestions-access-D_DEAOZo.mjs";
//#region src/gateway/server-methods/sessions-suggestions-dispatch.ts
function attributedSuggestionClient(client, suggestion) {
	const label = suggestion.authorLabel ?? suggestion.authorId;
	return {
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
}
async function dispatchSuggestion(params) {
	let response;
	const chatParams = {
		sessionKey: params.target.canonicalKey,
		agentId: params.target.agentId,
		sessionId: params.expectedSessionId,
		message: params.suggestion.text,
		...params.resolution === "queue" ? { queueMode: "followup" } : { queueMode: "steer" },
		idempotencyKey: `session-suggestion:${params.suggestion.id}`
	};
	const captureResponse = (...args) => {
		response = args;
	};
	const chatClient = attributedSuggestionClient(params.client, params.suggestion);
	const assertRequestCurrent = () => {
		params.signal?.throwIfAborted();
		params.sessionMutationAuthorization?.assertCurrent();
	};
	const assertAdmittedCurrent = params.sessionMutationAuthorization?.assertAdmittedInputCurrent ?? params.sessionMutationAuthorization?.assertCurrent;
	let chatAuthorization;
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
		const authorization = await withReadySessionRows(requireSessionRowProjection(params.context), () => [{
			key: params.target.canonicalKey,
			agentId: params.target.agentId
		}], (sessionRowRead) => {
			const row = sessionRowRead.describe({
				key: params.target.canonicalKey,
				agentId: params.target.agentId
			});
			const rowSourcePath = row && (isIncognitoSessionKey(row.key) ? row.storeTarget.storePath : sessionRowRead.readSource(row)?.path);
			if (!row || rowSourcePath !== current.physicalStorePath) throw new SessionWorkStartInvalidatedError("session source changed before suggestion dispatch");
			return resolveSessionMutationAuthorization({
				client: chatClient,
				method: "chat.send",
				requestParams: chatParams,
				context: params.context,
				sessionRowRead,
				expectedTarget: {
					agentId: params.target.agentId,
					sessionKey: params.target.canonicalKey,
					storePath: row.storeTarget.storePath,
					sessionId: params.expectedSessionId
				}
			});
		});
		assertRequestCurrent();
		params.readCurrent();
		if (authorization.error) return {
			ok: false,
			error: authorization.error
		};
		chatAuthorization = withSessionMutationCommitGuard(authorization.authorization, assertAdmittedCurrent, assertRequestCurrent);
		chatAuthorization?.assertCurrent();
	} catch (error) {
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
	return response?.[0] === true ? { ok: true } : {
		ok: false,
		error: response?.[2]
	};
}
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
function respondSuggestionDispatchError(respond, error) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion dispatch outcome is unknown", {
		retryable: true,
		retryAfterMs: SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS
	}));
}
const sessionSuggestionHandlers = {
	"session.suggestions.add": defineValidatedGatewayHandler("session.suggestions.add", validateSessionSuggestionsAddParams, async ({ params, respond, client, context, signal, sessionMutationAuthorization }) => {
		const cfg = context.getCommittedRuntimeConfig?.() ?? context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		const author = gatewayClientSessionCreator(client);
		if (!target || !authorizeSessionSuggestionMutation({
			client,
			cfg,
			sessionKey: params.sessionKey,
			target,
			respond
		}, "add")) return;
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
					const projected = protocolSuggestion(target, suggestion);
					publishSuggestion(context, target, params.sessionKey, {
						action: "added",
						suggestion: projected
					});
					return projected;
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
		const facts = await prepareSessionMutationFacts({
			cfg,
			sessionKey: params.sessionKey,
			agentId: requested.agentId,
			allowMissing: true
		});
		try {
			const readCurrent = () => {
				if (signal?.aborted || client?.invalidated || client?.connectionSignal?.aborted || hasCurrentClientAuthority?.() === false || gatewayClientSessionCreator(client)?.id !== identity?.id) {
					respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "suggestion reader authority changed"));
					return null;
				}
				const current = facts.readCurrent(context.getRuntimeConfig());
				const policy = (context.getCommittedRuntimeConfig ?? context.getRuntimeConfig)();
				const sharing = prepareProjectedSessionSharing({
					cfg: policy,
					client,
					isMember: (_target, id) => current.membership.has(id)
				});
				const target = current.target;
				if (!target || hasOperatorBoundary(client, policy) && sharing.entryFilter?.(target.storeKey, target.entry) === false) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
					return null;
				}
				const role = requireVisibleSuggestionRole({
					client,
					cfg: policy,
					sessionKey: params.sessionKey,
					target,
					respond,
					sharing
				});
				return role === null ? null : {
					target,
					role
				};
			};
			const initial = readCurrent();
			if (!initial) return;
			const stored = await listSessionSuggestions(suggestionScope(initial.target));
			const current = readCurrent();
			if (!current) return;
			const visible = stored.filter((suggestion) => suggestion.authorId === identity?.id || current.role !== "viewer" && suggestion.state === "pending");
			respond(true, {
				role: current.role,
				suggestions: visible.map((suggestion) => protocolSuggestion(current.target, suggestion))
			});
		} finally {
			facts.release();
		}
	}),
	"session.suggestions.resolve": defineValidatedGatewayHandler("session.suggestions.resolve", validateSessionSuggestionsResolveParams, async ({ params, respond, client, context, req, isWebchatConnect, signal, sessionMutationAuthorization }) => {
		const cfg = context.getCommittedRuntimeConfig?.() ?? context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		if (!target) return;
		const resolution = params.resolution;
		const dispatching = resolution === "send" || resolution === "queue";
		if (!authorizeSessionSuggestionMutation({
			client,
			cfg,
			sessionKey: params.sessionKey,
			target,
			respond
		}, resolution)) return;
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
					if (!released.ok) {
						respond(false, void 0, released.error);
						return false;
					}
					return true;
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
					const projected = protocolSuggestion(target, suggestion);
					publishSuggestion(context, target, params.sessionKey, {
						action: "resolved",
						suggestion: projected
					});
					return projected;
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
	"session.typing": async ({ params: requestParams, respond, client, context, hasCurrentClientAuthority }) => {
		const params = typeof requestParams.preview === "string" ? {
			...requestParams,
			preview: truncateCodePoints(requestParams.preview.trim(), 400)
		} : requestParams;
		if (!assertValidParams(params, validateSessionTypingParams, "session.typing", respond)) return;
		const projection = requireSessionRowProjection(context);
		while (projection.needsMembershipPreparation()) await projection.prepareMembership();
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
		const readTarget = (read = projection) => {
			if (isIncognitoSessionKey(query.key)) {
				const row = read.describe(query);
				return row && {
					agentId: row.agentId,
					canonicalKey: row.key,
					storeKey: row.key,
					storeKeys: [row.key],
					storePath: row.storeTarget.storePath,
					entry: row.entry,
					generation: row.generation
				};
			}
			const current = projection.sharingTargetState(query);
			return current.status === "ready" ? current.target : null;
		};
		const incognitoError = authorizeIncognitoSessionTarget({
			client,
			sessionKey: query.key,
			target: null
		});
		if (incognitoError) {
			respond(false, void 0, incognitoError);
			return;
		}
		const target = isIncognitoSessionKey(query.key) ? await withReadySessionRows(projection, () => [query], readTarget) : readTarget();
		const sharing = () => prepareProjectedSessionSharing({
			cfg: projection.getPolicyConfig(),
			client,
			isMember: (value, identity) => projection.hasMembership(value.storePath, value.storeKey, identity)
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
		const { typing: effectiveTyping, preview } = updateTypingConnections({
			key: typingKey,
			connectionId: client?.connId ?? actor.id,
			typing: params.typing,
			...params.typing && params.preview ? { preview: params.preview } : {},
			now
		});
		respond(true, {
			ok: true,
			broadcast: broadcastTypingThrottled({
				key: typingKey,
				typing: effectiveTyping,
				signature: `${effectiveTyping}\0${preview ?? ""}`,
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
	}
};
//#endregion
export { sessionSuggestionHandlers };
