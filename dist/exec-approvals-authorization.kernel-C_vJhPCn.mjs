import { t as expandHomePrefix } from "./home-dir-Dc6nN6HB.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as normalizeExecAsk } from "./exec-approvals-core-s7tTQC_a.mjs";
import { i as isGeneratedHashedArgPattern, r as isCwdBoundHashedArgPattern } from "./exec-command-resolution-DxYxel2J.mjs";
import { f as isShellWrapperInvocation, g as POSIX_INLINE_COMMAND_FLAGS, i as extractBindableShellWrapperInlineCommand, v as hasPosixInteractiveStartupBeforeInlineCommand, y as hasPosixLoginStartupBeforeInlineCommand } from "./shell-wrapper-resolution-BWMoO7Nh.mjs";
import { h as resolveExecApprovalsSocketPath, p as resolveExecApprovalsDisplayPath, u as normalizeExecApprovalsInternal } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { r as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-CU7bs0k0.mjs";
import "./exec-wrapper-resolution-DG9lx7nr.mjs";
import { n as canonicalizeExecApprovalPolicyRules, t as buildExecApprovalPolicyRuleKey } from "./exec-approval-policy-snapshot-DVeeymq8.mjs";
//#region src/infra/exec-approvals-resolver.ts
function isExecSecurity(value) {
	return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
	return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
	return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
	return isExecAsk(value) ? value : fallback;
}
function resolveExecApprovalsFromFilePrepared(params) {
	const rawFile = params.rawFile;
	const file = params.file;
	const defaults = file.defaults ?? {};
	const agentKey = params.agentId ?? "default";
	const agent = file.agents?.[agentKey] ?? {};
	const wildcard = file.agents?.["*"] ?? {};
	const rawAgent = rawFile.agents?.[agentKey] ?? {};
	const rawWildcard = rawFile.agents?.["*"] ?? {};
	const fallbackSecurity = params.overrides?.security ?? "full";
	const fallbackAsk = params.overrides?.ask ?? "off";
	const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
	const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? false;
	const resolvedDefaults = {
		security: normalizeSecurity(defaults.security, fallbackSecurity),
		ask: normalizeAsk(defaults.ask, fallbackAsk),
		askFallback: normalizeSecurity(defaults.askFallback ?? fallbackAskFallback, fallbackAskFallback),
		autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
	};
	const resolveField = (field, fallback, isValid) => {
		const defaultValue = defaults[field];
		const fallbackField = isValid(defaultValue) ? {
			value: defaultValue,
			source: `defaults.${field}`
		} : {
			value: fallback,
			source: null
		};
		if (rawAgent[field] != null) {
			const value = agent[field];
			return isValid(value) ? {
				value,
				source: `agents.${agentKey}.${field}`
			} : fallbackField;
		}
		if (rawWildcard[field] != null) {
			const value = wildcard[field];
			return isValid(value) ? {
				value,
				source: `agents.*.${field}`
			} : fallbackField;
		}
		return fallbackField;
	};
	const resolvedAgentSecurity = resolveField("security", resolvedDefaults.security, isExecSecurity);
	const resolvedAgentAsk = resolveField("ask", resolvedDefaults.ask, isExecAsk);
	const resolvedAgentAskFallback = resolveField("askFallback", resolvedDefaults.askFallback, isExecSecurity);
	const resolvedAgent = {
		security: resolvedAgentSecurity.value,
		ask: resolvedAgentAsk.value,
		askFallback: resolvedAgentAskFallback.value,
		autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
	};
	const allowlist = [...Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [], ...Array.isArray(agent.allowlist) ? agent.allowlist : []];
	return {
		path: params.path ?? resolveExecApprovalsDisplayPath(),
		socketPath: expandHomePrefix(params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: params.token,
		defaults: resolvedDefaults,
		agent: resolvedAgent,
		agentSources: {
			security: resolvedAgentSecurity.source,
			ask: resolvedAgentAsk.source,
			askFallback: resolvedAgentAskFallback.source
		},
		allowlist,
		file
	};
}
function resolveExecApprovalsFromFileInternal(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovalsInternal(params.file);
	const { token: socketToken } = file.socket ?? {};
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? socketToken ?? ""
	});
}
//#endregion
//#region src/infra/exec-approvals-policy.ts
function requiresExecApproval(params) {
	if (params.ask === "always") return true;
	if (params.durableApprovalSatisfied === true) return false;
	return params.ask === "on-miss" && params.security === "allowlist" && (!params.analysisOk || !params.allowlistSatisfied);
}
function minSecurity(a, b) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
function normalizeExecApprovalUnavailableDecisions(decisions) {
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => Array.isArray(decisions) && decisions.includes(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
	if (normalizeExecAsk(params?.ask) === "always" || params?.allowAlwaysPersistence?.kind === "one-shot") return ["allow-once", "deny"];
	return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
	const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
	const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
	const unavailableDecisions = new Set(normalizeExecApprovalUnavailableDecisions(params?.unavailableDecisions));
	if (unavailableDecisions.size === 0) return policyDecisions;
	return policyDecisions.filter((decision) => !unavailableDecisions.has(decision));
}
//#endregion
//#region src/infra/exec-approvals-allow-always.ts
function hasDurableExecApproval(params) {
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) || hasSegmentDurableExecApproval({
		analysisOk: params.analysisOk,
		segmentAllowlistEntries: params.segmentAllowlistEntries
	});
}
function buildDurableCommandApprovalPattern(commandText) {
	return `=command:${sha256HexPrefixCore(commandText, 16)}`;
}
function buildNodeCommandApprovalPattern(commandText) {
	return `=node-command:${sha256HexPrefixCore(commandText, 16)}`;
}
function hasNodeCommandAllowAlwaysMarker(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildNodeCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && entry.pattern === commandPattern);
}
function hasExactCommandDurableExecApproval(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildDurableCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && (entry.pattern === commandPattern || typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand));
}
/** Callers pass whether their final, post-gate authorization depends on a durable grant. */
function resolveDurableExecApprovalRequirement(params) {
	if (!params.durableApprovalRequired) return null;
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) ? "exact-command" : "segment-allowlist";
}
function hasSegmentDurableExecApproval(params) {
	return params.analysisOk && params.segmentAllowlistEntries.length > 0 && params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always");
}
function buildAllowlistEntryMatchKey(entry) {
	return JSON.stringify([entry.pattern, entry.argPattern ?? null]);
}
function buildAllowAlwaysUpgradeRuleKey(rule) {
	if (rule.source !== void 0) return null;
	return buildExecApprovalPolicyRuleKey({
		...rule,
		source: "allow-always"
	});
}
/** Captures effective file policy while excluding ids and mutable usage metadata. */
function createExecApprovalPolicySnapshot(params) {
	const resolved = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId
	});
	return {
		security: resolved.agent.security,
		ask: resolved.agent.ask,
		askFallback: resolved.agent.askFallback,
		autoAllowSkills: resolved.agent.autoAllowSkills,
		allowlistRules: canonicalizeExecApprovalPolicyRules(resolved.allowlist.map((entry) => {
			const rule = { pattern: entry.pattern };
			if (entry.argPattern !== void 0) rule.argPattern = entry.argPattern;
			if (entry.source === "allow-always") rule.source = entry.source;
			return rule;
		}))
	};
}
function isExecApprovalPolicySnapshotCurrent(expected, current) {
	const currentRuleKeys = new Set(current.allowlistRules.map(buildExecApprovalPolicyRuleKey));
	return expected.security === current.security && expected.ask === current.ask && expected.askFallback === current.askFallback && expected.autoAllowSkills === current.autoAllowSkills && expected.allowlistRules.every((rule) => {
		const key = buildExecApprovalPolicyRuleKey(rule);
		if (currentRuleKeys.has(key)) return true;
		const upgradedKey = buildAllowAlwaysUpgradeRuleKey(rule);
		return upgradedKey !== null && currentRuleKeys.has(upgradedKey);
	});
}
function applyAllowlistEntryUpdate(params) {
	if (!params.agentId) throw new Error("Exec allowlist update requires an explicit agent id.");
	const target = params.agentId;
	const agents = params.file.agents ?? {};
	const existing = agents[target] ?? {};
	const allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
	const trimmed = params.pattern.trim();
	if (!trimmed) return null;
	const argPattern = params.options?.argPattern === "" ? void 0 : params.options?.argPattern;
	const existingEntry = allowlist.find((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern);
	if (existingEntry && (!params.options?.source || existingEntry.source === params.options.source)) return null;
	const now = Date.now();
	const nextAllowlist = existingEntry ? allowlist.map((entry) => entry.pattern === trimmed && (entry.argPattern ?? void 0) === argPattern ? {
		...entry,
		argPattern,
		source: params.options?.source ?? entry.source,
		lastUsedAt: now
	} : entry) : [...allowlist, {
		id: crypto.randomUUID(),
		pattern: trimmed,
		argPattern,
		source: params.options?.source,
		lastUsedAt: now
	}];
	return {
		...params.file,
		agents: {
			...agents,
			[target]: {
				...existing,
				allowlist: nextAllowlist
			}
		}
	};
}
function resolveAllowAlwaysPatternCoverage(params) {
	const byKey = /* @__PURE__ */ new Map();
	let representedSegmentCount = 0;
	for (const segment of params.segments) {
		const shellWrapper = isShellWrapperInvocation(segment.argv);
		const segmentPatterns = resolveAllowAlwaysPatternEntries({
			segments: [segment],
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (segmentPatterns.length === 0) continue;
		if (!shellWrapper) representedSegmentCount += 1;
		for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
	}
	return {
		complete: params.segments.length > 0 && representedSegmentCount === params.segments.length,
		patterns: [...byKey.values()]
	};
}
function hasRuntimeShellPayload(argv) {
	const inlineCommand = extractBindableShellWrapperInlineCommand([...argv]);
	return Boolean(inlineCommand && (/(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\()/u.test(inlineCommand) || hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function resolvePlanPersistenceState(plan) {
	if (!plan) return {
		reusablePatternsAllowed: true,
		reasons: []
	};
	if (!plan.ok) return {
		reusablePatternsAllowed: false,
		reasons: ["unplanned"]
	};
	const reasons = /* @__PURE__ */ new Set();
	let reusablePatternsAllowed = true;
	const candidates = plan.groups.flatMap((group) => group.candidates);
	for (const candidate of candidates) {
		if (candidate.trustMode === "prompt-only") reasons.add("prompt-only");
		if (candidate.trustMode === "exact-command") reasons.add("no-reusable-pattern");
		if (candidate.trustMode === "executable" && !candidate.allowAlways) reasons.add("no-reusable-pattern");
		reusablePatternsAllowed = reusablePatternsAllowed && candidate.allowAlways;
		if (hasRuntimeShellPayload(candidate.sourceSegment.argv)) reasons.add("runtime-payload");
		if (candidate.transport.kind === "shell-wrapper" && hasRuntimeShellPayload(candidate.transport.wrapperArgv)) reasons.add("runtime-payload");
	}
	return {
		reusablePatternsAllowed,
		reasons: [...reasons]
	};
}
function resolveAllowAlwaysPersistenceDecision(params) {
	const planPersistence = resolvePlanPersistenceState(params.authorizationPlan);
	const reasons = new Set(planPersistence.reasons);
	if (params.runtimePayload === true) reasons.add("runtime-payload");
	const commandText = params.commandText?.trim();
	const hardReasons = [...reasons].filter((reason) => reason !== "no-reusable-pattern");
	if (hardReasons.length > 0) return {
		kind: "one-shot",
		reasons: hardReasons
	};
	if (params.preparedCoverage?.complete === true && params.preparedCoverage.patterns.length > 0) return {
		kind: "patterns",
		patterns: params.preparedCoverage.patterns,
		...commandText ? { commandText } : {}
	};
	if (planPersistence.reusablePatternsAllowed) {
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: params.segments,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (coverage.patterns.length > 0) return {
			kind: "patterns",
			patterns: coverage.patterns,
			...commandText && coverage.complete ? { commandText } : {}
		};
	}
	reasons.add("no-reusable-pattern");
	return {
		kind: "one-shot",
		reasons: [...reasons]
	};
}
function applyAllowAlwaysDecision(params) {
	const entries = params.decision.kind === "exact-command" ? params.decision.commandText.trim() ? [{
		pattern: buildDurableCommandApprovalPattern(params.decision.commandText.trim()),
		source: "allow-always"
	}] : [] : [...params.decision.patterns.map((pattern) => ({
		pattern: pattern.pattern,
		argPattern: pattern.argPattern,
		source: "allow-always"
	})), ...params.decision.commandText?.trim() ? [{
		pattern: buildNodeCommandApprovalPattern(params.decision.commandText.trim()),
		source: "allow-always"
	}] : []];
	if (!params.agentId) throw new Error("Exec allowlist update requires an explicit agent id.");
	const generatedPatterns = new Set(entries.filter((entry) => isCwdBoundHashedArgPattern(entry.argPattern)).map((entry) => entry.pattern));
	const existingAgent = params.file.agents?.[params.agentId];
	const existingAllowlist = existingAgent?.allowlist ?? [];
	const retainedAllowlist = existingAllowlist.filter((entry) => !(generatedPatterns.has(entry.pattern) && entry.source === "allow-always" && !isCwdBoundHashedArgPattern(entry.argPattern)));
	let next = retainedAllowlist.length === existingAllowlist.length ? params.file : {
		...params.file,
		agents: {
			...params.file.agents,
			[params.agentId]: {
				...existingAgent,
				allowlist: retainedAllowlist
			}
		}
	};
	let changed = next !== params.file;
	for (const entry of entries) {
		const updated = applyAllowlistEntryUpdate({
			file: next,
			agentId: params.agentId,
			pattern: entry.pattern,
			options: {
				argPattern: entry.argPattern,
				source: entry.source
			}
		});
		if (updated) {
			next = updated;
			changed = true;
		}
	}
	return changed ? next : null;
}
//#endregion
//#region src/infra/exec-approvals-authorization.kernel.ts
function assertCurrentUsageAuthorization(params) {
	const current = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId,
		overrides: {
			security: params.authorization.security,
			ask: params.authorization.ask
		}
	});
	const security = params.authorization.bypassHostApprovalFloors ? params.authorization.security : minSecurity(params.authorization.security, current.agent.security);
	const ask = params.authorization.bypassHostApprovalFloors ? params.authorization.ask : maxAsk(params.authorization.ask, current.agent.ask);
	if (security === "deny") throw new Error("Exec approval changed before execution");
	if (params.authorization.source === "explicit-approval" || params.authorization.source === "auto-review") {
		const expectedPolicy = params.authorization.policySnapshot;
		if (!expectedPolicy || !isExecApprovalPolicySnapshotCurrent(expectedPolicy, createExecApprovalPolicySnapshot({
			file: params.file,
			agentId: params.agentId
		}))) throw new Error("Exec approval changed before execution");
	}
	if (params.authorization.source === "explicit-approval") return;
	if (params.authorization.source === "auto-review") {
		if (ask === "always") throw new Error("Exec approval changed before execution");
		return;
	}
	let authorizationSecurity = security;
	if (params.authorization.source === "ask-fallback") {
		const askFallback = minSecurity(security, current.agent.askFallback);
		if (askFallback === "deny" || askFallback !== params.authorization.security) throw new Error("Exec approval changed before execution");
		if (askFallback === "full") return;
		authorizationSecurity = askFallback;
	} else if (security !== params.authorization.security || ask !== params.authorization.ask) throw new Error("Exec approval changed before execution");
	if (authorizationSecurity !== "allowlist") return;
	if (params.authorization.requireExactCommandApproval) {
		if (!hasExactCommandDurableExecApproval({
			allowlist: current.allowlist,
			commandText: params.command
		})) throw new Error("Exec approval changed before execution");
		return;
	}
	if (params.authorization.requireDurableAllowlistApproval) {
		const durableKeys = new Set(current.allowlist.filter((entry) => entry.source === "allow-always").map(buildAllowlistEntryMatchKey));
		if (params.matchKeys.size === 0 || [...params.matchKeys].some((key) => !durableKeys.has(key))) throw new Error("Exec approval changed before execution");
	}
	if (!params.authorization.allowlistSatisfied) throw new Error("Exec approval changed before execution");
	const currentKeys = new Set(current.allowlist.map(buildAllowlistEntryMatchKey));
	if ([...params.matchKeys].some((key) => !currentKeys.has(key))) throw new Error("Exec approval changed before execution");
	if (params.authorization.requireAutoAllowSkills && !current.agent.autoAllowSkills) throw new Error("Exec approval changed before execution");
}
function applyRecordedAllowlistUse(params) {
	const keys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	if (params.authorization) assertCurrentUsageAuthorization({
		file: params.file,
		agentId: params.agentId,
		command: params.command,
		matchKeys: keys,
		authorization: params.authorization
	});
	return applyRecordedAllowlistMetadata({
		...params,
		keys
	});
}
function applyRecordedAllowlistMetadata(params) {
	const { keys } = params;
	if (keys.size === 0) return null;
	if (!params.agentId) throw new Error("Exec allowlist metadata update requires an explicit agent id.");
	const target = params.agentId;
	const agents = params.file.agents ?? {};
	let changed = false;
	const nextAgents = { ...agents };
	for (const key of target === "*" ? [target] : ["*", target]) {
		const existing = agents[key];
		if (!existing?.allowlist) continue;
		let entryChanged = false;
		const nextAllowlist = existing.allowlist.map((entry) => {
			if (!keys.has(buildAllowlistEntryMatchKey(entry))) return entry;
			changed = true;
			entryChanged = true;
			return Object.assign({}, entry, {
				id: entry.id ?? crypto.randomUUID(),
				lastUsedAt: Date.now(),
				lastUsedCommand: isGeneratedHashedArgPattern(entry.argPattern) ? void 0 : params.command,
				lastResolvedPath: params.resolvedPath
			});
		});
		if (entryChanged) nextAgents[key] = {
			...existing,
			allowlist: nextAllowlist
		};
	}
	return changed ? {
		...params.file,
		agents: nextAgents
	} : null;
}
function applyExecAuthorizationCommit(file, params) {
	if ((params.authorization.source === "explicit-approval" || params.authorization.source === "auto-review") && !params.authorization.policySnapshot) throw new Error("Delayed exec authorization requires a policy snapshot");
	if (params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot") {
		if (params.authorization.source !== "explicit-approval") throw new Error("Allow-always persistence requires explicit approval");
	}
	const matchKeys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	assertCurrentUsageAuthorization({
		file,
		agentId: params.agentId,
		command: params.command,
		matchKeys,
		authorization: params.authorization
	});
	const granted = params.allowAlwaysDecision && params.allowAlwaysDecision.kind !== "one-shot" ? applyAllowAlwaysDecision({
		file,
		agentId: params.agentId,
		decision: params.allowAlwaysDecision
	}) : null;
	return applyRecordedAllowlistMetadata({
		...params,
		file: granted ?? file,
		keys: matchKeys
	}) ?? granted;
}
//#endregion
export { resolveExecApprovalAllowedDecisions as _, createExecApprovalPolicySnapshot as a, resolveExecApprovalsFromFileInternal as b, hasNodeCommandAllowAlwaysMarker as c, resolveAllowAlwaysPersistenceDecision as d, resolveDurableExecApprovalRequirement as f, requiresExecApproval as g, normalizeExecApprovalUnavailableDecisions as h, buildAllowlistEntryMatchKey as i, isExecApprovalPolicySnapshotCurrent as l, minSecurity as m, applyRecordedAllowlistUse as n, hasDurableExecApproval as o, maxAsk as p, assertCurrentUsageAuthorization as r, hasExactCommandDurableExecApproval as s, applyExecAuthorizationCommit as t, resolveAllowAlwaysPatternCoverage as u, resolveExecApprovalRequestAllowedDecisions as v, resolveExecApprovalUnavailableDecisions as y };
