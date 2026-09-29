import { t as truncateCodePoints } from "./code-points-5tfEHPUH.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { $r as validateSessionSuggestionsListParams, Qr as validateSessionSuggestionsAddParams, ei as validateSessionSuggestionsResolveParams, ti as validateSessionTypingParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as operatorSessionCap, r as hasOperatorBoundary } from "./operator-role-policy-BNrKHiJ3.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId, s as resolveSessionSubscriptionKeys } from "./session-request-agent-DN7PUqhR.mjs";
import { a as releaseSessionSuggestionDispatch, i as listSessionSuggestions, n as claimSessionSuggestionDispatch, o as SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS, r as finalizeSessionSuggestionClaim, t as addSessionSuggestion } from "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError, l as isSessionWorkStartInvalidatedError } from "./lifecycle-WWQJH57y.mjs";
import { t as presenceUserKey } from "./presence-user-ulXqGuvR.mjs";
import { a as updateTypingConnections, i as liveViewerIdentities, n as broadcastTypingThrottled, t as TYPING_THROTTLE_MS } from "./session-typing-state-duh0Qlrq.mjs";
import { E as createSessionListEntryFilter, G as resolveSessionSharingRole, I as authorizeSessionSharingTarget, J as resolveSessionVisibility, K as resolveSessionSharingTarget, R as canManageSessionSharing, et as gatewayClientSessionCreator, j as authorizeIncognitoSessionTarget } from "./session-sharing-C4w_but1.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { h as sessionObserverScopeKey } from "./session-observer-model-DE6FpzkF.mjs";
import { t as handleChatSend } from "./chat-send-handler-B23MaQHN.mjs";
//#region src/gateway/server-methods/sessions-suggestions-access.ts
function requireSuggestionTarget(params) {
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return null;
	}
	const target = resolveSessionSharingTarget({
		cfg,
		sessionKey: params.sessionKey,
		agentId: requestedAgent.agentId
	});
	if (!target || hasOperatorBoundary(params.client, cfg) && createSessionListEntryFilter({
		client: params.client,
		cfg
	})?.(target.storeKey, target.entry) === false) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	return target;
}
function requireVisibleSuggestionRole(params) {
	const role = resolveSessionSharingRole({
		client: params.client,
		cfg: params.cfg,
		target: params.target
	});
	const incognitoError = authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target: params.target
	});
	if (incognitoError) {
		params.respond(false, void 0, incognitoError);
		return null;
	}
	if (resolveSessionVisibility(params.target.entry) !== "draft") return role;
	const error = authorizeSessionSharingTarget({
		client: params.client,
		cfg: params.cfg,
		target: params.target
	});
	if (!error) return role;
	params.respond(false, void 0, error);
	return null;
}
function publishSuggestion(context, target, requestedSessionKey, event) {
	context.broadcast("session.suggestion", event, {
		sessionKeys: [.../* @__PURE__ */ new Set([
			requestedSessionKey,
			target.canonicalKey,
			target.storeKey
		])].toSorted(),
		agentId: event.suggestion.agentId
	});
}
//#endregion
//#region src/gateway/server-methods/sessions-suggestions.ts
function suggestionScope(target) {
	return {
		agentId: target.agentId,
		sessionKey: target.storeKey,
		storePath: target.storePath
	};
}
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
function resolutionState(resolution) {
	return resolution === "dismiss" ? "dismissed" : "accepted";
}
function respondSessionSuggestionSessionChanged(respond, sessionKey) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session changed before suggestion resolution could be finalized", {
		retryable: false,
		details: {
			code: "SESSION_SUGGESTION_SESSION_CHANGED",
			sessionKey
		}
	}));
}
function runSessionSuggestionMutation(params) {
	try {
		return {
			ok: true,
			value: params.mutate()
		};
	} catch (error) {
		if (!isSessionWorkStartInvalidatedError(error)) throw error;
		respondSessionSuggestionSessionChanged(params.respond, params.sessionKey);
		return { ok: false };
	}
}
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
		sessionId: params.target.entry.sessionId,
		message: params.suggestion.text,
		...params.resolution === "queue" ? { queueMode: "followup" } : { queueMode: "steer" },
		idempotencyKey: `session-suggestion:${params.suggestion.id}`
	};
	await handleChatSend({
		req: {
			...params.req,
			method: "chat.send",
			params: chatParams
		},
		params: chatParams,
		client: attributedSuggestionClient(params.client, params.suggestion),
		isWebchatConnect: params.isWebchatConnect,
		respond: (...args) => {
			response = args;
		},
		context: params.context
	});
	return response?.[0] === true ? { ok: true } : {
		ok: false,
		error: response?.[2]
	};
}
const sessionSuggestionHandlers = {
	"session.suggestions.add": ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionSuggestionsAddParams, "session.suggestions.add", respond)) return;
		const cfg = context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		const author = gatewayClientSessionCreator(client);
		if (!target) return;
		const role = requireVisibleSuggestionRole({
			client,
			cfg,
			sessionKey: params.sessionKey,
			target,
			respond
		});
		if (role === null) return;
		if (role === "viewer" && operatorSessionCap(client, cfg) === "view") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "your operator role permits viewing sessions only"));
			return;
		}
		const lifecycleError = resolveSessionWorkStartError(target.canonicalKey, target.entry);
		if (lifecycleError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, lifecycleError));
			return;
		}
		if (!author) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "identified suggestion author required"));
			return;
		}
		if (resolveSessionVisibility(target.entry) !== "suggest") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session is not accepting suggestions"));
			return;
		}
		const text = params.text;
		if (!text.trim()) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "suggestion text is required"));
			return;
		}
		let suggestion;
		try {
			suggestion = addSessionSuggestion(suggestionScope(target), {
				authorId: author.id,
				authorLabel: author.label,
				text,
				expectedSessionId: target.entry.sessionId
			});
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "suggestion could not be stored"));
			return;
		}
		const projected = protocolSuggestion(target, suggestion);
		publishSuggestion(context, target, params.sessionKey, {
			action: "added",
			suggestion: projected
		});
		respond(true, { suggestion: projected });
	},
	"session.suggestions.list": ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionSuggestionsListParams, "session.suggestions.list", respond)) return;
		const cfg = context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		if (!target) return;
		const role = requireVisibleSuggestionRole({
			client,
			cfg,
			sessionKey: params.sessionKey,
			target,
			respond
		});
		if (role === null) return;
		const identity = gatewayClientSessionCreator(client);
		respond(true, {
			role,
			suggestions: (role === "viewer" ? identity ? listSessionSuggestions(suggestionScope(target), { authorId: identity.id }) : [] : listSessionSuggestions(suggestionScope(target)).filter((suggestion) => suggestion.state === "pending" || suggestion.authorId === identity?.id)).map((suggestion) => protocolSuggestion(target, suggestion))
		});
	},
	"session.suggestions.resolve": async ({ params, respond, client, context, req, isWebchatConnect }) => {
		if (!assertValidParams(params, validateSessionSuggestionsResolveParams, "session.suggestions.resolve", respond)) return;
		const cfg = context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		if (!target) return;
		const role = requireVisibleSuggestionRole({
			client,
			cfg,
			sessionKey: params.sessionKey,
			target,
			respond
		});
		if (role === null) return;
		if (role !== "owner" && role !== "admin") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required"));
			return;
		}
		const resolution = params.resolution;
		const dispatching = resolution === "send" || resolution === "queue";
		if (resolution !== "dismiss") {
			const lifecycleError = resolveSessionWorkStartError(target.canonicalKey, target.entry);
			if (lifecycleError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, lifecycleError));
				return;
			}
		}
		if (dispatching && !client) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "connected client required for suggestion dispatch"));
			return;
		}
		const scope = suggestionScope(target);
		const claimResult = runSessionSuggestionMutation({
			respond,
			sessionKey: params.sessionKey,
			mutate: () => claimSessionSuggestionDispatch(scope, {
				id: params.id,
				resolution,
				expectedSessionId: target.entry.sessionId
			})
		});
		if (!claimResult.ok) return;
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
					resolution
				});
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion dispatch outcome is unknown", {
					retryable: true,
					retryAfterMs: SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS
				}));
				return;
			}
			if (!dispatched.ok) {
				let releaseResult;
				try {
					releaseResult = runSessionSuggestionMutation({
						respond,
						sessionKey: params.sessionKey,
						mutate: () => releaseSessionSuggestionDispatch(scope, {
							id: claim.suggestion.id,
							token: claim.token,
							expectedSessionId: target.entry.sessionId
						})
					});
				} catch (error) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion dispatch outcome is unknown", {
						retryable: true,
						retryAfterMs: SESSION_SUGGESTION_DISPATCH_CLAIM_TTL_MS
					}));
					return;
				}
				if (!releaseResult.ok) return;
				respond(false, void 0, dispatched.error ?? errorShape(ErrorCodes.INVALID_REQUEST, "suggestion dispatch failed"));
				return;
			}
		}
		const currentTarget = resolveSessionSharingTarget({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: target.agentId
		});
		if (!currentTarget || currentTarget.entry.sessionId !== target.entry.sessionId) {
			respondSessionSuggestionSessionChanged(respond, params.sessionKey);
			return;
		}
		const finalizeResult = runSessionSuggestionMutation({
			respond,
			sessionKey: params.sessionKey,
			mutate: () => finalizeSessionSuggestionClaim(scope, {
				id: claim.suggestion.id,
				token: claim.token,
				state: resolutionState(resolution),
				expectedSessionId: target.entry.sessionId
			})
		});
		if (!finalizeResult.ok) return;
		const suggestion = finalizeResult.value;
		if (!suggestion) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "suggestion resolution could not be finalized", { retryable: true }));
			return;
		}
		const projected = protocolSuggestion(target, suggestion);
		publishSuggestion(context, target, params.sessionKey, {
			action: "resolved",
			suggestion: projected
		});
		respond(true, { suggestion: projected });
	},
	"session.typing": ({ params: requestParams, respond, client, context }) => {
		const params = typeof requestParams.preview === "string" ? {
			...requestParams,
			preview: truncateCodePoints(requestParams.preview.trim(), 400)
		} : requestParams;
		if (!assertValidParams(params, validateSessionTypingParams, "session.typing", respond)) return;
		const cfg = context.getRuntimeConfig();
		const target = requireSuggestionTarget({
			client,
			context,
			...params,
			respond
		});
		const actor = gatewayClientSessionCreator(client);
		if (!target) return;
		const incognitoError = authorizeIncognitoSessionTarget({
			client,
			sessionKey: params.sessionKey,
			target
		});
		if (incognitoError) {
			respond(false, void 0, incognitoError);
			return;
		}
		if (params.sessionId !== target.entry.sessionId) {
			respond(true, {
				ok: true,
				broadcast: false
			});
			return;
		}
		if (!actor) {
			respond(true, {
				ok: true,
				broadcast: false
			});
			return;
		}
		const role = resolveSessionSharingRole({
			client,
			cfg,
			target
		});
		const visibility = resolveSessionVisibility(target.entry);
		if (role === "viewer" && operatorSessionCap(client, cfg) === "view") {
			respond(true, {
				ok: true,
				broadcast: false
			});
			return;
		}
		if (visibility === "draft" && !canManageSessionSharing(role)) {
			respond(true, {
				ok: true,
				broadcast: false
			});
			return;
		}
		if (role === "viewer" && visibility !== "shared" && visibility !== "suggest") {
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
		const typingKey = `${actor.id}\0${target.agentId}\0${target.canonicalKey}\0${target.entry.sessionId}`;
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
					const current = resolveSessionSharingTarget({
						cfg: context.getRuntimeConfig(),
						sessionKey: params.sessionKey,
						agentId: target.agentId
					});
					if (!current || current.entry.sessionId !== target.entry.sessionId) return false;
					const currentCfg = context.getRuntimeConfig();
					const currentRole = resolveSessionSharingRole({
						client,
						cfg: currentCfg,
						target: current
					});
					const currentVisibility = resolveSessionVisibility(current.entry);
					if (currentRole === "viewer" && operatorSessionCap(client, currentCfg) === "view") return false;
					if (currentVisibility === "draft" && !canManageSessionSharing(currentRole)) return false;
					if (currentRole === "viewer" && currentVisibility !== "shared" && currentVisibility !== "suggest") return false;
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
