import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as operatorSessionCap, r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { a as SessionWorkStartInvalidatedError, s as isSessionWorkStartInvalidatedError } from "./work-start-error-BI-UhSB2.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { _ as resolveSessionVisibility, g as resolveSessionSharingTargetAsync, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
//#region src/gateway/server-methods/sessions-suggestions-access.ts
async function requireSuggestionTarget(params) {
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return null;
	}
	const target = await resolveSessionSharingTargetAsync({
		cfg,
		sessionKey: params.sessionKey,
		agentId: requestedAgent.agentId
	});
	if (!target) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	return target;
}
function requireVisibleSuggestionRole(params) {
	const { target, client, cfg, sharing } = params;
	const entryFilter = hasOperatorBoundary(client, cfg) ? sharing.entryFilter : void 0;
	if (!target || entryFilter?.(target.storeKey, target.entry) === false) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	const role = sharing.roleForTarget(target);
	const incognitoError = authorizeIncognitoSessionTarget({
		client: params.client,
		sessionKey: params.sessionKey,
		target
	});
	if (incognitoError) {
		params.respond(false, void 0, incognitoError);
		return null;
	}
	if (resolveSessionVisibility(target.entry) !== "draft") return role;
	const error = sharing.authorizeTarget(target);
	if (!error) return role;
	params.respond(false, void 0, error);
	return null;
}
function authorizeSessionSuggestionMutation(params, action) {
	const { cfg, client, target, respond } = params;
	const role = requireVisibleSuggestionRole(params);
	if (role === null) return false;
	if (action === "add") {
		if (role === "viewer" && operatorSessionCap(client, cfg) === "view") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "your operator role permits viewing sessions only"));
			return false;
		}
		if (resolveSessionVisibility(target.entry) !== "suggest") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session is not accepting suggestions"));
			return false;
		}
	} else if (role !== "owner" && role !== "admin") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required"));
		return false;
	}
	const lifecycleError = action === "dismiss" ? void 0 : resolveSessionWorkStartError(target.canonicalKey, target.entry);
	if (lifecycleError) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, lifecycleError));
		return false;
	}
	return true;
}
function suggestionScope(target) {
	return {
		agentId: target.agentId,
		sessionKey: target.storeKey,
		storePath: target.storePath
	};
}
function sessionSuggestionSessionChangedError(sessionKey) {
	return errorShape(ErrorCodes.UNAVAILABLE, "session changed before suggestion resolution could be finalized", {
		retryable: false,
		details: {
			code: "SESSION_SUGGESTION_SESSION_CHANGED",
			sessionKey
		}
	});
}
async function createSessionSuggestionMutation(params) {
	const scope = captureSessionTranscriptTargetBinding(suggestionScope(params.target));
	const expectedSessionId = params.target.entry.sessionId;
	const facts = await prepareSessionMutationFacts({
		cfg: params.context.getRuntimeConfig(),
		sessionKey: params.target.canonicalKey,
		agentId: params.target.agentId,
		allowMissing: true
	});
	const readCurrent = () => {
		const cfg = params.context.getRuntimeConfig();
		const current = facts.readCurrent(cfg);
		if (!current.sourcePath) throw new SessionMutationFactsUnavailableError();
		const target = current.target;
		if (!target || target.agentId !== params.target.agentId || target.canonicalKey !== params.target.canonicalKey || target.storeKey !== params.target.storeKey || target.storePath !== params.target.storePath || target.entry.sessionId !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
		const policyConfig = params.context.getCommittedRuntimeConfig?.() ?? cfg;
		const sharing = prepareProjectedSessionSharing({
			cfg: policyConfig,
			client: params.client,
			isMember: (_target, identityId) => current.membership.has(identityId)
		});
		return {
			target,
			physicalStorePath: current.sourcePath,
			cfg: policyConfig,
			sharing
		};
	};
	const run = async (operation) => {
		const rejected = /* @__PURE__ */ new Error("session suggestion mutation refused");
		let rejectionError;
		const assertCurrent = () => {
			if (operation.kind === "start") {
				if (params.signal?.aborted) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.UNAVAILABLE, "suggestion request was cancelled"));
				try {
					params.assertCurrent?.();
				} catch (error) {
					if (error instanceof SessionMutationAuthorizationChangedError) throw error;
					throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "suggestion requester authority changed"));
				}
			}
			const current = readCurrent();
			if (operation.kind === "start" && !authorizeSessionSuggestionMutation({
				...params,
				...current,
				respond: (_ok, _payload, error) => {
					rejectionError = error;
				}
			}, operation.action)) throw rejected;
		};
		try {
			assertCurrent();
			return {
				ok: true,
				value: await operation.mutate(scope, assertCurrent)
			};
		} catch (error) {
			if (error === rejected) return {
				ok: false,
				error: rejectionError ?? errorShape(ErrorCodes.FORBIDDEN, "suggestion mutation refused")
			};
			if (error instanceof SessionMutationAuthorizationChangedError) return {
				ok: false,
				error: error.error
			};
			if (!isSessionWorkStartInvalidatedError(error) && !(error instanceof SessionMutationFactsUnavailableError)) throw error;
			return {
				ok: false,
				error: sessionSuggestionSessionChangedError(params.sessionKey)
			};
		}
	};
	return {
		run,
		readCurrent,
		release: facts.release
	};
}
function readCollaborationTarget(projection, query, actorFacts) {
	if (actorFacts) return actorFacts.readCurrent().target;
	const current = projection.sharingTargetState(query);
	return current.status === "ready" ? current.target : null;
}
//#endregion
export { requireVisibleSuggestionRole as a, requireSuggestionTarget as i, createSessionSuggestionMutation as n, sessionSuggestionSessionChangedError as o, readCollaborationTarget as r, suggestionScope as s, authorizeSessionSuggestionMutation as t };
