import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { S as isSubagentSessionKey, l as resolveAgentIdFromSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import { t as GatewaySecretRefUnavailableError } from "./credentials-CyW929E5.mjs";
import { t as GatewayCredentialsRequiredError } from "./call-C_MP4_Gs.mjs";
import { t as GatewayExplicitAuthRequiredError } from "./client-bootstrap-CE3rvLFg.mjs";
import "./client-CpsABkfT.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
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
	return action === "list" ? "Session list" : `Session ${action}`;
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
function lookupFailedDenialSuffix(kind) {
	if (kind === "transient") return "spawned-session ownership lookup failed (transient); retry once, then ask the operator to inspect OpenClaw logs.";
	if (kind === "credentials") return "spawned-session ownership lookup failed; ask the operator to check gateway configuration and credentials.";
	return "spawned-session ownership lookup failed; ask the operator to inspect OpenClaw logs.";
}
function lookupFailedDenialMessage(action, kind) {
	return `${action === "list" ? "Session list" : `Session ${action}`} denied because ${lookupFailedDenialSuffix(kind)}`;
}
function lookupFailedOperationMessage(action, kind) {
	return `${action === "list" ? "Session list" : `Session ${action}`} failed because session lookup failed${kind === "transient" ? " (transient)" : ""}; ${kind === "transient" ? "retry once, then ask the operator to inspect OpenClaw logs" : kind === "credentials" ? "ask the operator to check gateway configuration and credentials" : "ask the operator to inspect OpenClaw logs"}.`;
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
		const list = await (params.callGateway ?? (await import("./in-process-gateway-CSMvBDM8.mjs")).bindAgentToolGatewayRequest({ hostedOnly: true }))({
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
		const sessions = list.sessions;
		const keys = normalizeTrimmedStringList(sessions.map((entry) => entry?.key));
		return ok(new Set(keys));
	} catch (error) {
		return err(sessionOwnershipLookupFailure(error));
	}
}
//#endregion
//#region src/plugin-sdk/session-visibility.ts
const scopedSessionAccessProviders = /* @__PURE__ */ new Map();
function registerScopedSessionAccessProvider(provider, options) {
	const registration = {
		provider,
		resolveAsync: options?.resolveAsync
	};
	scopedSessionAccessProviders.set(provider, registration);
	return () => {
		if (scopedSessionAccessProviders.get(provider) === registration) scopedSessionAccessProviders.delete(provider);
	};
}
function resolveScopedSessionAccess(request) {
	if (resolveIncognitoSessionAccessDecision(request.targetSessionKey)) return;
	for (const provider of scopedSessionAccessProviders.keys()) try {
		const grant = provider(request);
		const expectedSessionId = normalizeOptionalString(grant?.expectedSessionId);
		if (expectedSessionId) return { expectedSessionId };
	} catch {}
}
async function resolveScopedSessionAccessAsync(request) {
	if (resolveIncognitoSessionAccessDecision(request.targetSessionKey)) return;
	const registrations = [...scopedSessionAccessProviders.values()];
	for (const registration of registrations) {
		const { provider, resolveAsync } = registration;
		if (scopedSessionAccessProviders.get(provider) !== registration) continue;
		try {
			const grant = await (resolveAsync ?? provider)(request);
			const expectedSessionId = normalizeOptionalString(grant?.expectedSessionId);
			if (expectedSessionId && scopedSessionAccessProviders.get(provider) === registration) return { expectedSessionId };
		} catch {}
	}
}
/** Public compatibility wrapper; direct guards use the richer private result. */
async function listSpawnedSessionKeys(params) {
	const result = await listSpawnedSessionKeysWithResult(params);
	if (!result.ok) {
		logSessionOwnershipLookupFailure({
			requesterSessionKey: params.requesterSessionKey,
			failure: result.error
		});
		return /* @__PURE__ */ new Set();
	}
	return result.value;
}
/** Resolve configured session-tool visibility, defaulting invalid or missing values to all. */
function resolveSessionToolsVisibility(cfg) {
	const raw = cfg.tools?.sessions?.visibility;
	const value = normalizeLowercaseStringOrEmpty(raw);
	if (value === "self" || value === "tree" || value === "agent" || value === "all") return value;
	return "all";
}
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
function resolveEffectiveSessionToolsVisibility(params) {
	const visibility = resolveSessionToolsVisibility(params.cfg);
	if (!params.sandboxed) return visibility;
	if ((params.cfg.agents?.defaults?.sandbox?.sessionToolsVisibility ?? "spawned") === "spawned" && visibility !== "tree") return "tree";
	return visibility;
}
/** Resolve sandbox-specific session visibility clamp for agent defaults. */
function resolveSandboxSessionToolsVisibility(cfg) {
	return cfg.agents?.defaults?.sandbox?.sessionToolsVisibility ?? "spawned";
}
function compileAgentAllowPattern(pattern) {
	const raw = normalizeOptionalString(pattern) ?? "";
	if (!raw) return { kind: "deny" };
	if (raw === "*") return { kind: "all" };
	if (!raw.includes("*")) return {
		kind: "exact",
		value: raw
	};
	const parts = raw.toLowerCase().split("*");
	return {
		kind: "wildcard",
		first: parts[0] ?? "",
		last: parts[parts.length - 1] ?? "",
		interior: parts.slice(1, -1).filter(Boolean)
	};
}
/**
* Linear-time case-insensitive glob matcher for precompiled `*` patterns.
* Checks prefix, suffix, then ordered interior segments without entering the
* regex engine, avoiding polynomial backtracking on repeated wildcards.
*/
function matchesCompiledWildcard(pattern, lower) {
	let pos = 0;
	if (pattern.first) {
		if (!lower.startsWith(pattern.first)) return false;
		pos = pattern.first.length;
	}
	const endBound = pattern.last ? lower.length - pattern.last.length : lower.length;
	if (pattern.last && (!lower.endsWith(pattern.last) || endBound < pos)) return false;
	for (const part of pattern.interior) {
		const idx = lower.indexOf(part, pos);
		if (idx === -1 || idx + part.length > endBound) return false;
		pos = idx + part.length;
	}
	return true;
}
/** Compile agent-to-agent allow rules into reusable matching predicates. */
function createAgentToAgentPolicy(cfg) {
	const routingA2A = cfg.tools?.agentToAgent;
	const enabled = routingA2A?.enabled !== false;
	const allowPatterns = (Array.isArray(routingA2A?.allow) ? routingA2A.allow : []).map((pattern) => compileAgentAllowPattern(pattern));
	const hasWildcardPatterns = allowPatterns.some((pattern) => pattern.kind === "wildcard");
	const matchesAllow = (agentId) => {
		if (allowPatterns.length === 0) return true;
		const lowerAgentId = hasWildcardPatterns ? agentId.toLowerCase() : "";
		return allowPatterns.some((pattern) => {
			if (pattern.kind === "all") return true;
			if (pattern.kind === "deny") return false;
			if (pattern.kind === "exact") return pattern.value === agentId;
			return matchesCompiledWildcard(pattern, lowerAgentId);
		});
	};
	const isAllowed = (requesterAgentId, targetAgentId) => {
		if (requesterAgentId === targetAgentId) return true;
		if (!enabled) return false;
		return matchesAllow(requesterAgentId) && matchesAllow(targetAgentId);
	};
	return {
		enabled,
		matchesAllow,
		isAllowed
	};
}
function toSessionAccessResult(decision, action, targetSessionKey) {
	return decision.allowed ? decision : {
		allowed: false,
		status: "forbidden",
		error: renderSessionVisibilityDenial(decision, {
			action,
			targetSessionKey
		})
	};
}
function createSessionVisibilityCheckerWithResult(params) {
	const spawnedKeys = params.spawnedKeys;
	let lookupFailureLogged = false;
	const decisionChecker = createSessionVisibilityDecisionChecker(params);
	const check = (targetSessionKey) => {
		const incognitoDenial = resolveIncognitoSessionAccessDecision(targetSessionKey);
		if (incognitoDenial) return toSessionAccessResult(incognitoDenial, params.action, targetSessionKey);
		if (params.action !== "list") {
			const scoped = resolveScopedSessionAccess({
				action: params.action,
				requesterSessionKey: params.requesterSessionKey,
				targetSessionKey
			});
			if (scoped) return {
				allowed: true,
				expectedSessionId: scoped.expectedSessionId
			};
		}
		const isSpawnedSession = (spawnedKeys?.ok ? spawnedKeys.value : void 0)?.has(targetSessionKey) === true;
		const result = decisionChecker.check({
			key: targetSessionKey,
			spawnedBy: isSpawnedSession ? params.requesterSessionKey : void 0
		});
		if (!result.allowed) {
			const ownedResult = decisionChecker.check({
				key: targetSessionKey,
				spawnedBy: params.requesterSessionKey
			});
			if (spawnedKeys !== null && !spawnedKeys.ok && targetSessionKey !== params.requesterSessionKey && targetSessionKey !== "current" && ownedResult.allowed) {
				if (!lookupFailureLogged) {
					lookupFailureLogged = true;
					logSessionOwnershipLookupFailure({
						requesterSessionKey: params.requesterSessionKey,
						failure: spawnedKeys.error
					});
				}
				return toSessionAccessResult(sessionOwnershipLookupDenied(spawnedKeys.error.kind), params.action, targetSessionKey);
			}
		}
		return toSessionAccessResult(result, params.action, targetSessionKey);
	};
	return { check };
}
/** Create a direct session-key visibility checker for one requester/action pair. */
function createSessionVisibilityCheckerImpl(params) {
	return createSessionVisibilityCheckerWithResult({
		...params,
		spawnedKeys: params.spawnedKeys ? {
			ok: true,
			value: params.spawnedKeys
		} : null
	});
}
/** Direct-key visibility checker plus registration for narrow host-owned grants. */
const createSessionVisibilityChecker = Object.assign(createSessionVisibilityCheckerImpl, {
	registerScopedAccessProvider: registerScopedSessionAccessProvider,
	resolveScopedAccess: resolveScopedSessionAccess,
	resolveScopedAccessAsync: resolveScopedSessionAccessAsync
});
/** Create a row-aware visibility checker that can use owner/spawn metadata. */
function createSessionVisibilityRowChecker(params) {
	const checker = createSessionVisibilityDecisionChecker(params);
	return { check: (row) => toSessionAccessResult(checker.check(row), params.action, row.key) };
}
/** Create a visibility guard, loading spawned-session ownership when direct keys need it. */
async function createSessionVisibilityGuard(params) {
	const spawnedKeys = params.action !== "list" && (params.visibility === "tree" || params.visibility === "all") ? await listSpawnedSessionKeysWithResult({
		requesterSessionKey: params.requesterSessionKey,
		callGateway: params.callGateway
	}) : null;
	return createSessionVisibilityCheckerWithResult({
		...params,
		spawnedKeys
	});
}
//#endregion
export { listSpawnedSessionKeys as a, resolveSessionToolsVisibility as c, logSessionOwnershipLookupFailure as d, lookupFailedDenialMessage as f, sessionOwnershipLookupFailure as g, sessionOwnershipLookupDenied as h, createSessionVisibilityRowChecker as i, createSessionVisibilityDecisionChecker as l, renderSessionVisibilityDenial as m, createSessionVisibilityChecker as n, resolveEffectiveSessionToolsVisibility as o, lookupFailedOperationMessage as p, createSessionVisibilityGuard as r, resolveSandboxSessionToolsVisibility as s, createAgentToAgentPolicy as t, listSpawnedSessionKeysWithResult as u };
