import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { b as isAcpSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { h as GatewayCredentialsRequiredError } from "./call-DnqhP17M.mjs";
import { t as GatewaySecretRefUnavailableError } from "./credentials-lHQ7_oVm.mjs";
import { t as GatewayExplicitAuthRequiredError } from "./client-bootstrap-D-pUrrKi.mjs";
import "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
//#region src/plugin-sdk/session-visibility-internal.ts
/** Core-private spawned-session ownership lookup; not a published plugin SDK subpath. */
function denied(reasonCode, policyRefs, contextFieldsUsed, missingEvidence = []) {
	return {
		allowed: false,
		status: "forbidden",
		reasonCode,
		policyRefs,
		contextFieldsUsed,
		missingEvidence
	};
}
function resolveIncognitoSessionAccessDecision(targetSessionKey) {
	return isIncognitoSessionKey(targetSessionKey) ? denied("incognito_session", ["sessions.incognito"], ["targetSessionKey"]) : void 0;
}
function rowOwnedByRequester(row, requesterSessionKey) {
	return row.ownerSessionKey === requesterSessionKey || row.spawnedBy === requesterSessionKey || row.parentSessionKey === requesterSessionKey;
}
/** Core-private policy owner; public SDK wrappers only render this decision. */
function createSessionVisibilityDecisionChecker(params) {
	const requesterAgentId = normalizeLowercaseStringOrEmpty(params.requesterAgentId) || resolveAgentIdFromSessionKey(params.requesterSessionKey, params.defaultAgentId);
	return { check: (row) => {
		const targetSessionKey = row.key;
		const incognito = resolveIncognitoSessionAccessDecision(targetSessionKey);
		if (incognito) return incognito;
		const isRequesterSession = targetSessionKey === params.requesterSessionKey || targetSessionKey === "current";
		let targetAgentId = normalizeLowercaseStringOrEmpty(row.agentId);
		if (!targetAgentId && (targetSessionKey === "current" || targetSessionKey === params.requesterSessionKey && !params.defaultAgentId?.trim())) targetAgentId = requesterAgentId;
		if (!targetAgentId) try {
			targetAgentId = resolveAgentIdFromSessionKey(targetSessionKey, params.defaultAgentId);
		} catch {
			return denied("target_agent_ownership_unavailable", ["session.owner"], ["requesterSessionKey", "targetSessionKey"], ["session.owner"]);
		}
		const isRequesterOwned = rowOwnedByRequester(row, params.requesterSessionKey) || params.visibility === "tree" && targetAgentId === requesterAgentId && params.requesterSessionKey === params.mainSessionKey;
		const isCrossAgent = targetAgentId !== requesterAgentId;
		if (!isRequesterSession && isRequesterOwned && (!isCrossAgent || isAcpSessionKey(targetSessionKey) || isSubagentSessionKey(targetSessionKey)) && (params.visibility === "tree" || params.visibility === "all")) return { allowed: true };
		if (isCrossAgent) {
			const a2aDenial = !params.a2aPolicy.enabled ? denied("agent_to_agent_disabled", ["tools.agentToAgent.enabled"], ["requesterAgentId", "targetAgentId"]) : !params.a2aPolicy.isAllowed(requesterAgentId, targetAgentId) ? denied("agent_to_agent_not_allowed", ["tools.agentToAgent.allow"], ["requesterAgentId", "targetAgentId"]) : void 0;
			if (params.action === "status" && params.explicitTargetAgentOwnership && a2aDenial) return a2aDenial;
			if (params.visibility !== "all") return denied("cross_agent_visibility_restricted", ["tools.sessions.visibility"], [
				"requesterAgentId",
				"targetAgentId",
				"visibility"
			]);
			if (a2aDenial) return a2aDenial;
			return { allowed: true };
		}
		if (params.visibility === "self" && !isRequesterSession) return denied("self_visibility_restricted", ["tools.sessions.visibility"], [
			"requesterSessionKey",
			"targetSessionKey",
			"visibility"
		]);
		if (params.visibility === "tree" && !isRequesterSession && !isRequesterOwned) return denied("tree_visibility_restricted", ["tools.sessions.visibility"], [
			"requesterSessionKey",
			"targetSessionKey",
			"requesterOwned",
			"visibility"
		]);
		return { allowed: true };
	} };
}
function sessionOwnershipLookupDenied(kind) {
	return denied(`session_ownership_lookup_failed_${kind}`, ["tools.sessions.visibility"], ["requesterSessionKey", "targetSessionKey"], ["session.owner"]);
}
function actionPrefix(action) {
	return `Session ${action}`;
}
/** Preserve the established public/tool prose without making prose the policy fact. */
function renderSessionVisibilityDenial(denial, params) {
	switch (denial.reasonCode) {
		case "incognito_session": return `Session not visible from session tools${params.targetSessionKey ? `: ${params.targetSessionKey}` : ""}`;
		case "target_agent_ownership_unavailable": return `${actionPrefix(params.action)} denied because target agent ownership is unavailable.`;
		case "cross_agent_visibility_restricted": return `${actionPrefix(params.action)} visibility is restricted. Set tools.sessions.visibility=all to allow cross-agent access; use tools.agentToAgent to restrict permitted agent pairs.`;
		case "agent_to_agent_disabled":
			if (params.action === "send") return "Agent-to-agent messaging is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent sends.";
			if (params.action === "list") return "Agent-to-agent listing is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent visibility.";
			return `Agent-to-agent ${params.action} is disabled. Set tools.agentToAgent.enabled=true to allow cross-agent access.`;
		case "agent_to_agent_not_allowed": return `Agent-to-agent ${params.action === "send" ? "messaging" : params.action === "list" ? "listing" : params.action} denied by tools.agentToAgent.allow.`;
		case "self_visibility_restricted": return `${actionPrefix(params.action)} visibility is restricted to the current session (tools.sessions.visibility=self).`;
		case "tree_visibility_restricted": return `${actionPrefix(params.action)} visibility is restricted to the current session tree (tools.sessions.visibility=tree).`;
		case "session_ownership_lookup_failed_transient": return lookupFailedDenialMessage(params.action, "transient");
		case "session_ownership_lookup_failed_credentials": return lookupFailedDenialMessage(params.action, "credentials");
		case "session_ownership_lookup_failed_unknown": return lookupFailedDenialMessage(params.action, "unknown");
		default: throw new Error("unsupported session visibility denial");
	}
}
function classifyLookupFailure(error) {
	if (error instanceof GatewayClientRequestError && error.retryable) return "transient";
	if (isGatewayTransportError(error) && (error.kind === "timeout" || error.code === 1006 || error.code === 1013)) return "transient";
	if (error instanceof GatewayCredentialsRequiredError || error instanceof GatewayExplicitAuthRequiredError || error instanceof GatewaySecretRefUnavailableError) return "credentials";
	return "unknown";
}
function lookupFailureGuidance(kind) {
	return kind === "transient" ? "retry once, then ask the operator to inspect OpenClaw logs" : kind === "credentials" ? "ask the operator to check gateway configuration and credentials" : "ask the operator to inspect OpenClaw logs";
}
function lookupFailedDenialSuffix(kind) {
	return `spawned-session ownership lookup failed${kind === "transient" ? " (transient)" : ""}; ${lookupFailureGuidance(kind)}.`;
}
function lookupFailedDenialMessage(action, kind) {
	return `${actionPrefix(action)} denied because ${lookupFailedDenialSuffix(kind)}`;
}
function lookupFailedOperationMessage(action, kind) {
	return `${actionPrefix(action)} failed because session lookup failed${kind === "transient" ? " (transient)" : ""}; ${lookupFailureGuidance(kind)}.`;
}
function sessionOwnershipLookupFailure(error) {
	return {
		kind: classifyLookupFailure(error),
		diagnostic: formatErrorMessage(error)
	};
}
function logSessionOwnershipLookupFailure(params) {
	logWarn(`session-visibility: spawned-session ownership lookup failed for requester=${redactIdentifier(params.requesterSessionKey)}: ${params.failure.diagnostic}`);
}
/** List sessions spawned by the requester through the gateway session list method. */
async function listSpawnedSessionKeysWithResult(params) {
	const limit = typeof params.limit === "number" && Number.isFinite(params.limit) ? Math.max(1, Math.floor(params.limit)) : void 0;
	try {
		const list = await (params.callGateway ?? (await import("./in-process-gateway-DiBEA4LJ.mjs")).bindAgentToolGatewayRequest({ hostedOnly: true }))({
			method: "sessions.list",
			params: {
				includeGlobal: false,
				includeUnknown: false,
				...limit !== void 0 ? { limit } : {},
				spawnedBy: params.requesterSessionKey
			}
		});
		if (!Array.isArray(list?.sessions)) return err({
			kind: "unknown",
			diagnostic: "gateway sessions.list returned an invalid response"
		});
		const keys = normalizeTrimmedStringList(list.sessions.map((entry) => entry?.key));
		return ok(new Set(keys));
	} catch (error) {
		return err(sessionOwnershipLookupFailure(error));
	}
}
//#endregion
export { lookupFailedOperationMessage as a, sessionOwnershipLookupDenied as c, lookupFailedDenialMessage as i, sessionOwnershipLookupFailure as l, listSpawnedSessionKeysWithResult as n, renderSessionVisibilityDenial as o, logSessionOwnershipLookupFailure as r, resolveIncognitoSessionAccessDecision as s, createSessionVisibilityDecisionChecker as t };
