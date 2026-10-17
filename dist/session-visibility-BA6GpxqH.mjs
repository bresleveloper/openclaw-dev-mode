import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as sessionOwnershipLookupDenied, n as listSpawnedSessionKeysWithResult, o as renderSessionVisibilityDenial, r as logSessionOwnershipLookupFailure, s as resolveIncognitoSessionAccessDecision, t as createSessionVisibilityDecisionChecker } from "./session-visibility-internal-D2EfOhU9.mjs";
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
	const value = normalizeLowercaseStringOrEmpty(cfg.tools?.sessions?.visibility);
	if (value === "self" || value === "tree" || value === "agent" || value === "all") return value;
	return "all";
}
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
function resolveEffectiveSessionToolsVisibility(params) {
	const visibility = resolveSessionToolsVisibility(params.cfg);
	if (!params.sandboxed) return visibility;
	return resolveSandboxSessionToolsVisibility(params.cfg) === "spawned" ? "tree" : visibility;
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
	if (!lower.startsWith(pattern.first)) return false;
	let pos = pattern.first.length;
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
	const isAllowed = (requesterAgentId, targetAgentId) => requesterAgentId === targetAgentId || enabled && matchesAllow(requesterAgentId) && matchesAllow(targetAgentId);
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
export { listSpawnedSessionKeys as a, resolveSessionToolsVisibility as c, createSessionVisibilityRowChecker as i, createSessionVisibilityChecker as n, resolveEffectiveSessionToolsVisibility as o, createSessionVisibilityGuard as r, resolveSandboxSessionToolsVisibility as s, createAgentToAgentPolicy as t };
