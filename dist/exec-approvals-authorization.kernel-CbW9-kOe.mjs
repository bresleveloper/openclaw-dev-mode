import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { n as POSIX_INLINE_COMMAND_FLAGS, o as hasPosixInteractiveStartupBeforeInlineCommand, s as hasPosixLoginStartupBeforeInlineCommand } from "./shell-inline-command-DKNYBguD.mjs";
import { i as isGeneratedHashedArgPattern, r as isCwdBoundHashedArgPattern } from "./exec-command-resolution-BBO1XScO.mjs";
import { f as isShellWrapperInvocation, i as extractBindableShellWrapperInlineCommand } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
import { n as maxAsk, r as minSecurity } from "./exec-approvals-policy-Cd5JaUxb.mjs";
import { t as resolveExecApprovalsFromFileInternal } from "./exec-approvals-resolver-BYbI_zvO.mjs";
import { r as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-CzbwiW56.mjs";
import "./exec-wrapper-resolution-CXchNEiE.mjs";
import { n as canonicalizeExecApprovalPolicyRules, t as buildExecApprovalPolicyRuleKey } from "./exec-approval-policy-snapshot-DVeeymq8.mjs";
//#region src/infra/exec-approvals-allow-always.ts
function hasDurableExecApproval(params) {
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) || params.analysisOk && params.segmentAllowlistEntries.length > 0 && params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always");
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
function buildAllowlistEntryMatchKey(entry) {
	return JSON.stringify([entry.pattern, entry.argPattern ?? null]);
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
		return rule.source === void 0 && currentRuleKeys.has(buildExecApprovalPolicyRuleKey({
			...rule,
			source: "allow-always"
		}));
	});
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
	const entries = params.decision.kind === "patterns" ? [...params.decision.patterns] : [];
	const commandText = params.decision.commandText?.trim();
	if (commandText) entries.push({ pattern: params.decision.kind === "exact-command" ? buildDurableCommandApprovalPattern(commandText) : buildNodeCommandApprovalPattern(commandText) });
	if (!params.agentId) throw new Error("Exec allowlist update requires an explicit agent id.");
	const generatedPatterns = new Set(entries.filter((entry) => isCwdBoundHashedArgPattern(entry.argPattern)).map((entry) => entry.pattern));
	const existingAgent = params.file.agents?.[params.agentId];
	const existingAllowlist = existingAgent?.allowlist ?? [];
	let allowlist = existingAllowlist.filter((entry) => !(generatedPatterns.has(entry.pattern) && entry.source === "allow-always" && !isCwdBoundHashedArgPattern(entry.argPattern)));
	let changed = allowlist.length !== existingAllowlist.length;
	for (const entry of entries) {
		const pattern = entry.pattern.trim();
		if (!pattern) continue;
		const argPattern = entry.argPattern === "" ? void 0 : entry.argPattern;
		const matches = (candidate) => candidate.pattern === pattern && (candidate.argPattern ?? void 0) === argPattern;
		const existingEntry = allowlist.find(matches);
		if (existingEntry?.source === "allow-always") continue;
		const lastUsedAt = Date.now();
		if (existingEntry) allowlist = allowlist.map((candidate) => matches(candidate) ? {
			...candidate,
			argPattern,
			source: "allow-always",
			lastUsedAt
		} : candidate);
		else allowlist.push({
			id: crypto.randomUUID(),
			pattern,
			argPattern,
			source: "allow-always",
			lastUsedAt
		});
		changed = true;
	}
	return changed ? {
		...params.file,
		agents: {
			...params.file.agents,
			[params.agentId]: {
				...existingAgent,
				allowlist
			}
		}
	} : null;
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
export { hasDurableExecApproval as a, isExecApprovalPolicySnapshotCurrent as c, resolveDurableExecApprovalRequirement as d, createExecApprovalPolicySnapshot as i, resolveAllowAlwaysPatternCoverage as l, assertCurrentUsageAuthorization as n, hasExactCommandDurableExecApproval as o, buildAllowlistEntryMatchKey as r, hasNodeCommandAllowAlwaysMarker as s, applyExecAuthorizationCommit as t, resolveAllowAlwaysPersistenceDecision as u };
