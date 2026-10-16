import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { o as operatorSessionCap, r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { c as isSessionWorkStartInvalidatedError, o as SessionWorkStartInvalidatedError } from "./work-start-error-Dh9d0ImY.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveSessionWorkStartError } from "./lifecycle-BH2MRg79.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { _ as resolveSessionSharingTarget, g as resolveSessionSharingRole, n as authorizeIncognitoSessionTarget, s as authorizeSessionSharingTarget, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { l as createSessionListEntryFilter, u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { r as prepareSessionMutationFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-preparation-DCGOreuH.mjs";
//#region src/gateway/server-methods/sessions-suggestions-access.ts
function canSeeSuggestionTarget(params) {
	return !hasOperatorBoundary(params.client, params.cfg) || (params.sharing?.entryFilter ?? createSessionListEntryFilter({
		client: params.client,
		cfg: params.cfg
	}))?.(params.target.storeKey, params.target.entry) !== false;
}
function requireSuggestionTarget(params) {
	const cfg = params.context.getRuntimeConfig();
	const policyConfig = params.context.getCommittedRuntimeConfig?.() ?? cfg;
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
	if (!target || !canSeeSuggestionTarget({
		client: params.client,
		cfg: policyConfig,
		target
	})) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	return target;
}
function requireVisibleSuggestionRole(params) {
	const role = params.sharing?.roleForTarget(params.target) ?? resolveSessionSharingRole({
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
	const error = params.sharing ? params.sharing.authorizeTarget(params.target) : authorizeSessionSharingTarget({
		client: params.client,
		cfg: params.cfg,
		target: params.target
	});
	if (!error) return role;
	params.respond(false, void 0, error);
	return null;
}
function authorizeSessionSuggestionMutation(params, action) {
	const { cfg, client, target, respond } = params;
	if (!canSeeSuggestionTarget(params)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return false;
	}
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
function resolveCurrentSuggestionTarget(target, expectedSessionId, current) {
	if (!current || current.agentId !== target.agentId || current.canonicalKey !== target.canonicalKey || current.storeKey !== target.storeKey || current.storePath !== target.storePath || current.entry.sessionId !== expectedSessionId) throw new SessionWorkStartInvalidatedError("session changed before suggestion mutation");
	return current;
}
async function createSessionSuggestionMutation(params) {
	const scope = {
		...suggestionScope(params.target),
		env: { ...process.env }
	};
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
		const target = resolveCurrentSuggestionTarget(params.target, expectedSessionId, current.target);
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
export { requireVisibleSuggestionRole as a, requireSuggestionTarget as i, createSessionSuggestionMutation as n, sessionSuggestionSessionChangedError as o, publishSuggestion as r, suggestionScope as s, authorizeSessionSuggestionMutation as t };
