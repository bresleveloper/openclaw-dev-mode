import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as expandHomePrefix } from "./home-dir-BjcCg_IW.js";
import { a as validateSafeBinArgv, c as DEFAULT_SAFE_BINS, l as SAFE_BIN_PROFILES, n as isTrustedSafeBinPath } from "./exec-safe-bin-trust-B9RgXGB4.js";
import { c as resolveExecutableTrustPath, d as resolveExecutionTargetTrustPath, h as resolvePolicyTargetTrustPath, l as resolveExecutionTargetCandidatePath, m as resolvePolicyTargetResolution, p as resolvePolicyTargetCandidatePath, s as resolveCommandResolutionFromArgv, t as matchAllowlist, u as resolveExecutionTargetResolution, y as resolveExecWrapperTrustPlan } from "./exec-command-resolution-D4oPviYm.js";
import { S as isDispatchWrapperExecutable, _ as isPowerShellInlineFileCommandFlag, b as resolvePowerShellInlineCommandMatch, c as isShellWrapperExecutable, f as POSIX_INLINE_COMMAND_FLAGS, g as isDirectShellPositionalCarrierCommand, h as hasPosixLoginStartupBeforeInlineCommand, j as normalizeExecutableToken, m as hasPosixInteractiveStartupBeforeInlineCommand, n as POWERSHELL_WRAPPERS, r as extractBindableShellWrapperInlineCommand, t as POSIX_SHELL_WRAPPERS, w as unwrapDispatchWrappersForResolution, y as resolveInlineCommandMatch } from "./shell-wrapper-resolution-CWcJ2fJQ.js";
import "./exec-wrapper-resolution-CHJqVUbw.js";
import { a as detectInlineEvalArgv, l as isInterpreterLikeAllowlistPattern } from "./risks-CJwO60fG.js";
import { t as explainShellCommand } from "./extract-Sdk9m_MB.js";
import { a as isWindowsPlatform, i as analyzeWindowsShellCommand } from "./exec-approvals-analysis-DNOGYrfb.js";
import path from "node:path";
//#region src/infra/exec-authorization-plan.ts
const POSIX_SHELL_NAMES = new Set(POSIX_SHELL_WRAPPERS);
const PROMPT_ONLY_RISKS = new Set([
	"eval",
	"source",
	"alias",
	"shell-wrapper-through-carrier",
	"command-carrier"
]);
const NON_REUSABLE_RISKS = new Set(["inline-eval"]);
const UNANALYZABLE_RISKS = new Set([
	"command-substitution",
	"dynamic-executable",
	"line-continuation",
	"heredoc",
	"here-string",
	"process-substitution",
	"redirect",
	"syntax-error",
	"function-definition"
]);
const POWERSHELL_NAMES = new Set(["powershell", "pwsh"]);
const WINDOWS_CMD_NAMES = new Set(["cmd", "cmd.exe"]);
const POSITIONAL_CARRIER_BLOCKED_EXECUTABLES = new Set(["find", "xargs"]);
const SHELL_WRAPPER_PRELUDE_REASON = "shell-env-assignment";
const UNSUPPORTED_DIRECT_SHELL_TOPOLOGY_SHAPES = new Set([
	"background",
	"if",
	"for",
	"while",
	"case",
	"subshell",
	"group"
]);
function normalizePlanningPlatform(platform) {
	switch (platform) {
		case "aix":
		case "android":
		case "cygwin":
		case "darwin":
		case "freebsd":
		case "haiku":
		case "linux":
		case "netbsd":
		case "openbsd":
		case "sunos":
		case "win32": return platform;
		default: return;
	}
}
function commandSegmentFromStep(step, context) {
	return {
		raw: step.text,
		argv: step.argv,
		resolution: resolveCommandResolutionFromArgv(step.argv, context.cwd, context.env, context.platform)
	};
}
function commandSegmentFromArgv(argv, context, sourceArgv) {
	return {
		raw: argv.join(" "),
		argv,
		sourceArgv,
		resolution: resolveCommandResolutionFromArgv(argv, context.cwd, context.env, context.platform)
	};
}
function authorizationOperatorForTopology(operator) {
	switch (operator.kind) {
		case "and": return "&&";
		case "or": return "||";
		case "pipe":
		case "stderr-pipe": return "pipe";
		case "sequence":
		case "newline-sequence": return ";";
		case "background": return "&";
		default: return operator.kind;
	}
}
function riskInsideStep(risk, step) {
	return risk.span.startIndex >= step.span.startIndex && risk.span.endIndex <= step.span.endIndex;
}
function riskBeforeStepExecutable(risk, step) {
	return riskInsideStep(risk, step) && risk.span.endIndex <= step.executableSpan.startIndex;
}
function stepReasons(step, risks) {
	const reasons = [];
	for (const risk of risks) if (PROMPT_ONLY_RISKS.has(risk.kind) && riskInsideStep(risk, step)) reasons.push(risk.kind);
	return [...new Set(reasons)];
}
function nonReusableStepReasons(step, risks) {
	const reasons = [];
	for (const risk of risks) if (NON_REUSABLE_RISKS.has(risk.kind) && riskInsideStep(risk, step)) reasons.push(risk.kind);
	return [...new Set(reasons)];
}
function isShellExpansionDynamicArgument(risk) {
	return risk.kind === "dynamic-argument" && /(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\(|[<>]\()/u.test(risk.text);
}
function riskInsidePromptOnlyStep(risk, explanation) {
	return [...explanation.topLevelCommands, ...explanation.nestedCommands].some((step) => riskInsideStep(risk, step) && stepReasons(step, explanation.risks).length > 0);
}
function findUnanalyzableRisk(explanation) {
	return explanation.risks.find((entry) => UNANALYZABLE_RISKS.has(entry.kind)) ?? null;
}
function hasBlockingRisk(explanation) {
	const risk = findUnanalyzableRisk(explanation);
	if (risk) return risk.kind;
	const unsupportedShape = explanation.shapes.find((shape) => UNSUPPORTED_DIRECT_SHELL_TOPOLOGY_SHAPES.has(shape));
	if (unsupportedShape) return unsupportedShape;
	const dynamicArgument = explanation.risks.find((entry) => isShellExpansionDynamicArgument(entry) && !riskInsidePromptOnlyStep(entry, explanation));
	if (dynamicArgument) return dynamicArgument.kind;
	return null;
}
function shellWrapperPreludeReasons(params) {
	const reasons = params.risks.filter((risk) => UNANALYZABLE_RISKS.has(risk.kind) && riskBeforeStepExecutable(risk, params.step)).map((risk) => risk.kind);
	return [...new Set(reasons)];
}
function isPathScopedExecutableToken$1(token) {
	return token.includes("/") || token.includes("\\");
}
function hasResolvedExecutionPath(segment) {
	const execution = segment.resolution?.execution;
	return Boolean(execution?.resolvedPath?.trim() || execution?.resolvedRealPath?.trim());
}
function isUnresolvedPathScopedExecutable(segment) {
	return isPathScopedExecutableToken$1(segment.argv[0]?.trim() ?? "") && !hasResolvedExecutionPath(segment);
}
function canUseReusableWrapperPayloadCandidates(segments) {
	if (!(segments[0]?.argv[0]?.trim() ?? "")) return false;
	if (segments.some((segment) => isPathScopedExecutableToken$1(segment.argv[0]?.trim() ?? ""))) return false;
	return !segments.some((segment) => normalizeExecutableToken(segment.argv[0] ?? "").endsWith("-wrapper"));
}
function isShellExecutable(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	return POSIX_SHELL_NAMES.has(executable);
}
function canUseWrapperShellInvocation(segment) {
	const argv = segment.argv;
	if (isPathScopedExecutableToken$1(argv[0]?.trim() ?? "")) return false;
	return isShellExecutable(argv) && !hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) && !hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS);
}
function wrapperPrefixForStep(step) {
	const executableStart = Math.max(0, step.executableSpan.startIndex - step.span.startIndex);
	return step.text.slice(0, executableStart);
}
function hasCommandPrelude(step) {
	return /^[A-Za-z_][A-Za-z0-9_]*=/u.test(wrapperPrefixForStep(step).trimStart());
}
function positionalCarrierSteps(params) {
	const inlineMatch = resolveInlineCommandMatch(params.wrapper.segment.argv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	if (inlineMatch.valueTokenIndex === null || !inlineMatch.command) return null;
	if (!canUseWrapperShellInvocation(params.wrapper.segment)) return null;
	if (!isDirectShellPositionalCarrierCommand(inlineMatch.command)) return null;
	const carriedArgv = params.wrapper.segment.argv.slice(inlineMatch.valueTokenIndex + 1).filter((token) => token.trim().length > 0);
	if (carriedArgv.length === 0) return null;
	const carriedName = normalizeExecutableToken(carriedArgv[0] ?? "");
	if (isDispatchWrapperExecutable(carriedName) || POSITIONAL_CARRIER_BLOCKED_EXECUTABLES.has(carriedName) || POSIX_SHELL_NAMES.has(carriedName) || carriedName.endsWith("-wrapper")) return null;
	const raw = carriedArgv.join(" ");
	const carriedSpan = {
		startIndex: params.wrapper.step.span.endIndex,
		endIndex: params.wrapper.step.span.endIndex,
		startPosition: params.wrapper.step.span.endPosition,
		endPosition: params.wrapper.step.span.endPosition
	};
	return [{
		step: {
			context: "wrapper-payload",
			executable: carriedArgv[0] ?? "",
			argv: carriedArgv,
			text: raw,
			span: carriedSpan,
			executableSpan: carriedSpan
		},
		segment: commandSegmentFromArgv(carriedArgv, params.context, params.wrapper.segment.sourceArgv)
	}];
}
function shouldPersistCandidate(params) {
	if (params.trustMode !== "executable") return false;
	if (params.relationship === "pipeline" && isShellExecutable(params.segment.argv)) return false;
	return params.segment.resolution?.policyBlocked !== true;
}
function createCandidate(params) {
	const isDirectShellWrapper = params.transport.kind === "direct" && extractBindableShellWrapperInlineCommand(params.segment.argv);
	const stepPromptReasons = stepReasons(params.step, params.risks);
	const stepNonReusableReasons = nonReusableStepReasons(params.step, params.risks);
	const preludeReasons = hasCommandPrelude(params.step) ? shellWrapperPreludeReasons({
		step: params.step,
		risks: params.risks
	}) : [];
	if (hasCommandPrelude(params.step) && preludeReasons.length === 0) preludeReasons.push(SHELL_WRAPPER_PRELUDE_REASON);
	const reasons = [...new Set([
		...stepPromptReasons,
		...stepNonReusableReasons,
		...preludeReasons
	])];
	const trustMode = params.segment.resolution?.policyBlocked === true ? "prompt-only" : preludeReasons.length > 0 ? "prompt-only" : isDirectShellWrapper ? "exact-command" : stepPromptReasons.length > 0 ? "prompt-only" : "executable";
	return {
		sourceSegment: params.segment,
		sourceStep: params.step,
		...params.step.id ? { sourceStepId: params.step.id } : {},
		transport: params.transport,
		trustMode,
		allowAlways: stepNonReusableReasons.length === 0 && shouldPersistCandidate({
			segment: params.segment,
			relationship: params.relationship,
			trustMode
		}),
		reasons
	};
}
function finalizeGroup(params) {
	const relationship = params.steps.length > 1 ? "pipeline" : params.relationship;
	return {
		opToNext: params.opToNext,
		candidates: params.steps.map((entry) => createCandidate({
			step: entry.step,
			segment: entry.segment,
			relationship,
			transport: params.transport,
			risks: params.risks
		}))
	};
}
function groupsFromSteps(params) {
	const sorted = params.steps.toSorted((left, right) => left.step.span.startIndex - right.step.span.startIndex);
	const groups = [];
	let current = [];
	const operatorByFromCommandId = /* @__PURE__ */ new Map();
	for (const operator of params.operators ?? []) operatorByFromCommandId.set(operator.fromCommandId, authorizationOperatorForTopology(operator));
	if (sorted.length > 1 && operatorByFromCommandId.size === 0) return [finalizeGroup({
		steps: sorted,
		relationship: "pipeline",
		opToNext: null,
		transport: params.transport,
		risks: params.risks
	})];
	for (const entry of sorted) {
		if (current.length === 0) {
			current = [entry];
			continue;
		}
		const previous = current[current.length - 1];
		if (!previous) {
			current = [entry];
			continue;
		}
		const previousCommandId = previous.step.id;
		const operator = previousCommandId ? operatorByFromCommandId.get(previousCommandId) : void 0;
		if (operator === "pipe") {
			current.push(entry);
			continue;
		}
		const opToNext = operator === "&&" || operator === "||" || operator === ";" || operator === "&" ? operator : ";";
		groups.push(finalizeGroup({
			steps: current,
			relationship: "simple",
			opToNext,
			transport: params.transport,
			risks: params.risks
		}));
		current = [entry];
	}
	if (current.length > 0) groups.push(finalizeGroup({
		steps: current,
		relationship: "simple",
		opToNext: null,
		transport: params.transport,
		risks: params.risks
	}));
	return groups;
}
function shellWrapperRiskForStep(step, risks) {
	return risks.find((entry) => entry.kind === "shell-wrapper" && riskInsideStep(entry, step)) ?? null;
}
function shouldUseWrapperPayload(params) {
	if (params.topLevelSteps.length !== 1 || params.nestedSteps.length === 0) return false;
	const wrapperStep = params.topLevelSteps[0]?.step;
	if (!wrapperStep || !shellWrapperRiskForStep(wrapperStep, params.risks)) return false;
	return canUseReusableWrapperPayloadCandidates((params.wrapperCommandId ? params.nestedSteps.filter((entry) => entry.step.parentCommandId === params.wrapperCommandId) : params.nestedSteps).map((entry) => entry.segment));
}
function applyWrapperPayloadPersistenceBoundary(params) {
	if (!isUnresolvedPathScopedExecutable(params.wrapper.segment)) return params.groups;
	return params.groups.map((group) => ({
		...group,
		candidates: group.candidates.map((candidate) => ({
			...candidate,
			allowAlways: false
		}))
	}));
}
function wrapperPayloadPlan(params) {
	const wrapper = params.topLevelSteps[0];
	if (!wrapper) return null;
	const wrapperRisk = shellWrapperRiskForStep(wrapper.step, params.risks);
	if (!wrapperRisk) return null;
	if (hasCommandPrelude(wrapper.step)) return null;
	if (!canUseWrapperShellInvocation(wrapper.segment)) return null;
	if (!params.allowNestedPayload) return null;
	const carriedSteps = positionalCarrierSteps({
		wrapper,
		context: params.context
	});
	if (carriedSteps) {
		const groups = groupsFromSteps({
			steps: carriedSteps,
			transport: {
				kind: "shell-wrapper",
				wrapperSegment: wrapper.segment,
				wrapperArgv: wrapper.segment.argv,
				wrapperPrefix: wrapperPrefixForStep(wrapper.step),
				inlineCommand: wrapperRisk.payload
			},
			risks: params.risks
		});
		return groups.length > 0 ? applyWrapperPayloadPersistenceBoundary({
			wrapper,
			groups
		}) : null;
	}
	if (!shouldUseWrapperPayload({
		wrapperCommandId: wrapper.step.id,
		topLevelSteps: params.topLevelSteps,
		nestedSteps: params.nestedSteps,
		risks: params.risks
	})) return null;
	const transport = {
		kind: "shell-wrapper",
		wrapperSegment: wrapper.segment,
		wrapperArgv: wrapper.segment.argv,
		wrapperPrefix: wrapperPrefixForStep(wrapper.step),
		inlineCommand: wrapperRisk.payload
	};
	const groups = groupsFromSteps({
		steps: wrapper.step.id ? params.nestedSteps.filter((entry) => entry.step.parentCommandId === wrapper.step.id) : params.nestedSteps,
		operators: wrapper.step.id ? params.operators.filter((operator) => operator.parentCommandId === wrapper.step.id) : params.operators,
		transport,
		risks: params.risks
	});
	return groups.length > 0 ? applyWrapperPayloadPersistenceBoundary({
		wrapper,
		groups
	}) : null;
}
function dialectForArgv(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	if (POWERSHELL_NAMES.has(executable)) return "powershell";
	if (WINDOWS_CMD_NAMES.has(executable)) return "windows-cmd";
	return "argv";
}
function unanalyzablePlan(params) {
	return {
		ok: false,
		dialect: params.dialect,
		originalCommand: params.command,
		reason: params.reason,
		groups: [],
		operators: []
	};
}
function planFromExplanation(params) {
	const topLevelSteps = params.explanation.topLevelCommands.map((step) => ({
		step,
		segment: commandSegmentFromStep(step, params.context)
	}));
	const nestedSteps = params.explanation.nestedCommands.filter((step) => step.context === "wrapper-payload").map((step) => ({
		step,
		segment: commandSegmentFromStep(step, params.context)
	}));
	const blockingRisk = hasBlockingRisk(params.explanation);
	const unanalyzableRisk = findUnanalyzableRisk(params.explanation);
	const topLevelStep = topLevelSteps[0]?.step;
	const canFallBackToExactWrapper = topLevelSteps.length === 1 && Boolean(topLevelStep && shellWrapperRiskForStep(topLevelStep, params.explanation.risks) && (!unanalyzableRisk || riskInsideStep(unanalyzableRisk, topLevelStep)));
	if (!params.explanation.ok || blockingRisk && !canFallBackToExactWrapper) return unanalyzablePlan({
		dialect: "posix-shell",
		command: params.command,
		reason: blockingRisk ?? "unable to parse command"
	});
	const groups = wrapperPayloadPlan({
		context: params.context,
		allowNestedPayload: !blockingRisk && !params.explanation.shapes.some((shape) => UNSUPPORTED_DIRECT_SHELL_TOPOLOGY_SHAPES.has(shape)),
		topLevelSteps,
		nestedSteps,
		operators: params.explanation.operators ?? [],
		risks: params.explanation.risks
	}) ?? groupsFromSteps({
		steps: topLevelSteps,
		operators: (params.explanation.operators ?? []).filter((operator) => operator.parentCommandId === void 0),
		transport: { kind: "direct" },
		risks: params.explanation.risks
	});
	if (groups.length === 0) return unanalyzablePlan({
		dialect: "posix-shell",
		command: params.command,
		reason: "no commands to authorize"
	});
	return {
		ok: true,
		dialect: "posix-shell",
		originalCommand: params.command,
		groups,
		operators: params.explanation.operators ?? []
	};
}
async function planShellAuthorization(params) {
	if (params.platform === "win32") return unanalyzablePlan({
		dialect: "windows-cmd",
		command: params.command,
		reason: "non-POSIX shell command"
	});
	try {
		const explanation = await explainShellCommand(params.command);
		return planFromExplanation({
			command: params.command,
			explanation,
			context: {
				cwd: params.cwd,
				env: params.env,
				platform: normalizePlanningPlatform(params.platform)
			}
		});
	} catch (error) {
		return unanalyzablePlan({
			dialect: "posix-shell",
			command: params.command,
			reason: error instanceof Error ? error.message : "unable to parse command"
		});
	}
}
async function planExecAuthorization(params) {
	const command = params.command ?? params.analysis.segments.map((segment) => segment.raw).join(params.analysis.chains ? " && " : " | ");
	if (!params.analysis.ok) return unanalyzablePlan({
		dialect: "argv",
		command,
		reason: params.analysis.reason ?? "unable to parse command"
	});
	const argv = params.analysis.segments[0]?.argv ?? [];
	const dialect = dialectForArgv(argv);
	if (dialect !== "argv") return unanalyzablePlan({
		dialect,
		command,
		reason: "non-POSIX command wrapper"
	});
	if (params.analysis.segments.length === 1) {
		const wrapperSegment = params.analysis.segments[0];
		const inlineCommand = extractBindableShellWrapperInlineCommand(argv);
		if (inlineCommand && wrapperSegment && canUseWrapperShellInvocation(wrapperSegment)) {
			const shellPlan = await planShellAuthorization({
				command: inlineCommand,
				cwd: params.cwd,
				env: params.env,
				platform: params.platform
			});
			if (shellPlan.ok) {
				const nestedSegments = shellPlan.groups.flatMap((group) => group.candidates.map((candidate) => candidate.sourceSegment));
				if (wrapperSegment && canUseReusableWrapperPayloadCandidates(nestedSegments)) {
					const persistNestedPayloads = !isUnresolvedPathScopedExecutable(wrapperSegment);
					return {
						ok: true,
						dialect: "argv",
						originalCommand: command,
						groups: shellPlan.groups.map((group) => ({
							...group,
							candidates: group.candidates.map((candidate) => {
								const transport = {
									kind: "shell-wrapper",
									wrapperSegment,
									wrapperArgv: wrapperSegment.argv,
									wrapperPrefix: "",
									inlineCommand
								};
								return {
									...candidate,
									transport,
									allowAlways: persistNestedPayloads ? candidate.allowAlways : false
								};
							})
						})),
						operators: shellPlan.operators
					};
				}
			}
		}
	}
	return {
		ok: true,
		dialect: "argv",
		originalCommand: command,
		groups: groupsFromSteps({
			steps: params.analysis.segments.map((segment, index) => ({
				step: {
					context: "top-level",
					executable: segment.argv[0] ?? "",
					argv: segment.argv,
					text: segment.raw,
					span: {
						startIndex: index,
						endIndex: index + segment.raw.length,
						startPosition: {
							row: 0,
							column: index
						},
						endPosition: {
							row: 0,
							column: index + segment.raw.length
						}
					},
					executableSpan: {
						startIndex: index,
						endIndex: index + (segment.argv[0]?.length ?? 0),
						startPosition: {
							row: 0,
							column: index
						},
						endPosition: {
							row: 0,
							column: index + (segment.argv[0]?.length ?? 0)
						}
					}
				},
				segment: segment.resolution === null ? commandSegmentFromArgv(segment.argv, {
					cwd: params.cwd,
					env: params.env,
					platform: normalizePlanningPlatform(params.platform)
				}, segment.sourceArgv) : segment
			})),
			transport: { kind: "direct" },
			risks: []
		}),
		operators: []
	};
}
//#endregion
//#region src/infra/exec-safe-builtins.ts
const DEFAULT_SAFE_BUILTINS = new Set([
	":",
	"cd",
	"false",
	"pwd",
	"test",
	"true"
]);
/** Returns true when a parsed POSIX shell segment is one of the closed safe builtin forms. */
function isSafeBuiltinSegment(params) {
	if (isWindowsPlatform(params.platform ?? process.platform)) return false;
	const head = params.segment.argv[0]?.trim().toLowerCase();
	if (!head) return false;
	if (head === "[") return params.segment.argv.at(-1) === "]" || params.segment.raw.trim().endsWith("]");
	return DEFAULT_SAFE_BUILTINS.has(head);
}
//#endregion
//#region src/infra/exec-approvals-allowlist.ts
function hasShellLineContinuation(command) {
	return /\\(?:\r\n|\n|\r)/.test(command);
}
function commandStepToPolicySegment(step, params) {
	return {
		raw: step.text,
		argv: step.argv,
		resolution: resolveCommandResolutionFromArgv(step.argv, params.cwd, params.env, params.platform ?? void 0)
	};
}
async function explainShellPolicySegments(params) {
	try {
		const explanation = await explainShellCommand(params.command);
		return [...explanation.topLevelCommands, ...explanation.nestedCommands].map((step) => commandStepToPolicySegment(step, params));
	} catch {
		return [];
	}
}
function normalizeSafeBins(entries) {
	if (!Array.isArray(entries)) return /* @__PURE__ */ new Set();
	const normalized = entries.map((entry) => normalizeLowercaseStringOrEmpty(entry)).filter((entry) => entry.length > 0);
	return new Set(normalized);
}
function resolveSafeBins(entries) {
	if (entries === void 0) return normalizeSafeBins(DEFAULT_SAFE_BINS);
	return normalizeSafeBins(entries ?? []);
}
function isSafeBinUsage(params) {
	if (isWindowsPlatform(params.platform ?? process.platform)) return false;
	if (params.safeBins.size === 0) return false;
	const resolution = params.resolution;
	const execName = normalizeOptionalLowercaseString(resolution?.executableName);
	if (!execName) return false;
	if (!params.safeBins.has(execName)) return false;
	const trustPath = resolveExecutableTrustPath(resolution);
	if (!trustPath) return false;
	if (!(params.isTrustedSafeBinPathFn ?? isTrustedSafeBinPath)({
		resolvedPath: trustPath,
		trustedDirs: params.trustedSafeBinDirs
	})) return false;
	const argv = params.argv.slice(1);
	const profile = (params.safeBinProfiles ?? SAFE_BIN_PROFILES)[execName];
	if (!profile) return false;
	return validateSafeBinArgv(argv, profile, { binName: execName });
}
function isPathScopedExecutableToken(token) {
	return token.includes("/") || token.includes("\\");
}
function pickExecAllowlistContext(params) {
	return {
		allowlist: params.allowlist,
		safeBins: params.safeBins,
		safeBinProfiles: params.safeBinProfiles,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform,
		trustedSafeBinDirs: params.trustedSafeBinDirs,
		skillBins: params.skillBins,
		autoAllowSkills: params.autoAllowSkills,
		allowShellBuiltins: params.allowShellBuiltins
	};
}
function normalizeSkillBinName(value) {
	const trimmed = normalizeOptionalLowercaseString(value);
	return trimmed && trimmed.length > 0 ? trimmed : null;
}
function normalizeSkillBinResolvedPath(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return null;
	const resolved = path.resolve(trimmed);
	if (process.platform === "win32") return normalizeLowercaseStringOrEmpty(resolved.replace(/\\/g, "/"));
	return resolved;
}
function buildSkillBinTrustIndex(entries) {
	const trustByName = /* @__PURE__ */ new Map();
	if (!entries || entries.length === 0) return trustByName;
	for (const entry of entries) {
		const name = normalizeSkillBinName(entry.name);
		const resolvedPath = normalizeSkillBinResolvedPath(entry.resolvedPath);
		if (!name || !resolvedPath) continue;
		const paths = trustByName.get(name) ?? /* @__PURE__ */ new Set();
		paths.add(resolvedPath);
		trustByName.set(name, paths);
	}
	return trustByName;
}
function isSkillAutoAllowedSegment(params) {
	if (!params.allowSkills) return false;
	const resolution = params.segment.resolution;
	const execution = resolveExecutionTargetResolution(resolution);
	const trustPath = resolveExecutionTargetTrustPath(resolution);
	if (!execution?.resolvedPath || !trustPath) return false;
	const rawExecutable = execution.rawExecutable?.trim() ?? "";
	if (!rawExecutable || isPathScopedExecutableToken(rawExecutable)) return false;
	const executableName = normalizeSkillBinName(execution.executableName);
	const resolvedPath = normalizeSkillBinResolvedPath(trustPath);
	if (!executableName || !resolvedPath) return false;
	return Boolean(params.skillBinTrust.get(executableName)?.has(resolvedPath));
}
const MAX_SHELL_WRAPPER_INLINE_EVAL_DEPTH = 3;
function matchExecutableAllowlistForSegment(params) {
	if (params.isPositionalCarrierInvocation) return null;
	const match = matchAllowlist(params.allowlist, params.candidateResolution, params.effectiveArgv, params.platform);
	const hasBoundArgPattern = typeof match?.argPattern === "string" && match.argPattern.trim().length > 0;
	const isBareWildcardMatch = match?.pattern?.trim() === "*" && !hasBoundArgPattern;
	if (params.allowlistTargetIsExecutionTarget && (params.inlineCommand !== null || params.isShellWrapperInvocation && params.effectiveArgv.length > 1) && !hasBoundArgPattern && !isBareWildcardMatch) return null;
	return match;
}
function executableResolutionsReferToSameTarget(left, right) {
	if (!left || !right) return false;
	return left.rawExecutable === right.rawExecutable && left.resolvedPath === right.resolvedPath && left.resolvedRealPath === right.resolvedRealPath && left.executableName === right.executableName;
}
function resolveShellWrapperScriptArgv(params) {
	const scriptBase = normalizeLowercaseStringOrEmpty(path.basename(params.shellScriptCandidatePath));
	const cwdBase = params.cwd && params.cwd.trim() ? params.cwd.trim() : process.cwd();
	const resolveArgPath = (a) => path.isAbsolute(a) ? a : path.resolve(cwdBase, a);
	let idx = params.effectiveArgv.findIndex((a) => resolveArgPath(a) === params.shellScriptCandidatePath);
	if (idx === -1) idx = params.effectiveArgv.findIndex((a) => normalizeLowercaseStringOrEmpty(path.basename(a)) === scriptBase);
	const scriptArgs = idx !== -1 ? params.effectiveArgv.slice(idx + 1) : [];
	return [params.shellScriptCandidatePath, ...scriptArgs];
}
function resolvePowerShellFileScriptArgv(params) {
	const argv = resolveSegmentSourceArgv(params.segment);
	if (!Array.isArray(argv) || argv.length < 3) return null;
	const wrapperName = normalizeExecutableToken(argv[0] ?? "");
	if (!POWERSHELL_WRAPPERS.has(wrapperName)) return null;
	const match = resolvePowerShellInlineCommandMatch(argv);
	if (match.valueTokenIndex === null || !match.command) return null;
	if (!isPowerShellInlineFileCommandFlag(argv[match.valueTokenIndex - 1] ?? "")) return null;
	const scriptToken = argv[match.valueTokenIndex]?.trim();
	if (!scriptToken) return null;
	const expanded = scriptToken.startsWith("~") ? expandHomePrefix(scriptToken) : scriptToken;
	const base = params.cwd && params.cwd.trim().length > 0 ? params.cwd : process.cwd();
	return [path.isAbsolute(expanded) ? expanded : path.resolve(base, expanded), ...argv.slice(match.valueTokenIndex + 1)];
}
function resolveSegmentSourceArgv(segment) {
	const sourceArgv = segment.sourceArgv;
	if (!Array.isArray(sourceArgv) || sourceArgv.length === 0) return segment.argv;
	const segmentExecutable = normalizeExecutableToken(segment.argv[0] ?? "");
	if (!segmentExecutable) return segment.argv;
	if (normalizeExecutableToken(sourceArgv[0] ?? "") === segmentExecutable) return sourceArgv;
	const unwrappedSourceArgv = unwrapDispatchWrappersForResolution(sourceArgv);
	return normalizeExecutableToken(unwrappedSourceArgv[0] ?? "") === segmentExecutable ? unwrappedSourceArgv : segment.argv;
}
function resolveSegmentAllowlistMatch(params) {
	const effectiveArgv = params.segment.resolution?.effectiveArgv && params.segment.resolution.effectiveArgv.length > 0 ? params.segment.resolution.effectiveArgv : params.segment.argv;
	const allowlistSegment = effectiveArgv === params.segment.argv ? params.segment : {
		...params.segment,
		argv: effectiveArgv
	};
	const executableResolution = resolvePolicyTargetResolution(params.segment.resolution);
	const executionResolution = resolveExecutionTargetResolution(params.segment.resolution);
	const candidatePath = resolvePolicyTargetCandidatePath(params.segment.resolution, params.context.cwd);
	const trustPath = resolvePolicyTargetTrustPath(params.segment.resolution, params.context.cwd);
	const candidateResolution = candidatePath && executableResolution ? {
		...executableResolution,
		resolvedPath: candidatePath,
		resolvedRealPath: trustPath
	} : executableResolution;
	const inlineCommand = extractBindableShellWrapperInlineCommand(allowlistSegment.argv);
	const powerShellFileScriptArgv = resolvePowerShellFileScriptArgv({
		segment: allowlistSegment,
		cwd: params.context.cwd
	});
	const isShellWrapperInvocation = isShellWrapperSegment(allowlistSegment);
	const isPositionalCarrierInvocation = inlineCommand !== null && isDirectShellPositionalCarrierCommand(inlineCommand);
	const executableMatch = matchExecutableAllowlistForSegment({
		allowlist: params.context.allowlist,
		candidateResolution,
		effectiveArgv,
		platform: params.context.platform,
		inlineCommand,
		isShellWrapperInvocation,
		isPositionalCarrierInvocation,
		allowlistTargetIsExecutionTarget: executableResolutionsReferToSameTarget(executableResolution, executionResolution)
	});
	const shellPositionalArgvCandidatePath = inlineCommand !== null ? resolveShellWrapperPositionalArgvCandidatePath({
		segment: allowlistSegment,
		cwd: params.context.cwd,
		env: params.context.env,
		platform: params.context.platform
	}) : void 0;
	const shellPositionalArgvMatch = shellPositionalArgvCandidatePath ? matchAllowlist(params.context.allowlist, {
		rawExecutable: shellPositionalArgvCandidatePath,
		resolvedPath: shellPositionalArgvCandidatePath,
		resolvedRealPath: resolveCandidateTrustPath(shellPositionalArgvCandidatePath),
		executableName: path.basename(shellPositionalArgvCandidatePath)
	}, void 0, params.context.platform) : null;
	const shellScriptCandidatePath = powerShellFileScriptArgv?.[0] ?? (inlineCommand === null ? resolveShellWrapperScriptCandidatePath({
		segment: allowlistSegment,
		cwd: params.context.cwd
	}) : void 0);
	const shellScriptArgv = shellScriptCandidatePath ? powerShellFileScriptArgv ?? resolveShellWrapperScriptArgv({
		shellScriptCandidatePath,
		effectiveArgv,
		cwd: params.context.cwd
	}) : null;
	const shellScriptMatch = shellScriptCandidatePath && shellScriptArgv ? matchAllowlist(params.context.allowlist, {
		rawExecutable: shellScriptCandidatePath,
		resolvedPath: shellScriptCandidatePath,
		resolvedRealPath: resolveCandidateTrustPath(shellScriptCandidatePath),
		executableName: path.basename(shellScriptCandidatePath)
	}, shellScriptArgv, params.context.platform) : null;
	return {
		effectiveArgv,
		inlineCommand: powerShellFileScriptArgv ? null : inlineCommand,
		match: executableMatch ?? shellPositionalArgvMatch ?? shellScriptMatch
	};
}
function resolveSegmentSatisfaction(params) {
	if (params.match) return "allowlist";
	if (isSafeBinUsage({
		argv: params.effectiveArgv,
		resolution: resolveExecutionTargetResolution(params.segment.resolution),
		safeBins: params.context.safeBins,
		safeBinProfiles: params.context.safeBinProfiles,
		platform: params.context.platform,
		trustedSafeBinDirs: params.context.trustedSafeBinDirs
	})) return "safeBins";
	if (params.context.allowShellBuiltins === true && isSafeBuiltinSegment({
		segment: params.segment,
		platform: params.context.platform
	})) return "safeBuiltins";
	return isSkillAutoAllowedSegment({
		segment: params.segment,
		allowSkills: params.allowSkills,
		skillBinTrust: params.skillBinTrust
	}) ? "skills" : null;
}
function resolveInlineCommandFallback(params) {
	if (params.by !== null || !params.inlineCommand) return null;
	if (!isWindowsPlatform(params.context.platform)) return null;
	return evaluateShellWrapperInlineCommand({
		inlineCommand: params.inlineCommand,
		context: params.context,
		inlineDepth: params.inlineDepth + 1
	});
}
function evaluateShellWrapperInlineCommand(params) {
	if (params.inlineDepth >= MAX_SHELL_WRAPPER_INLINE_EVAL_DEPTH) return null;
	if (hasShellLineContinuation(params.inlineCommand)) return null;
	const analysis = analyzeWindowsShellCommand({
		command: params.inlineCommand,
		cwd: params.context.cwd,
		env: params.context.env,
		platform: params.context.platform
	});
	if (!analysis.ok || analysis.segments.length === 0) return null;
	const matches = [];
	for (const group of resolveAnalysisSegmentGroups(analysis)) {
		const result = evaluateSegments(group, params.context, params.inlineDepth);
		if (!result.satisfied) return null;
		matches.push(...result.matches);
	}
	return {
		matches,
		satisfiedBy: "allowlist"
	};
}
function evaluateSegments(segments, params, inlineDepth = 0) {
	const matches = [];
	const skillBinTrust = buildSkillBinTrustIndex(params.skillBins);
	const allowSkills = params.autoAllowSkills === true && skillBinTrust.size > 0;
	const segmentAllowlistEntries = [];
	const segmentSatisfiedBy = [];
	return {
		satisfied: segments.every((segment) => {
			if (segment.resolution?.policyBlocked === true) {
				segmentAllowlistEntries.push(null);
				segmentSatisfiedBy.push(null);
				return false;
			}
			const { effectiveArgv, inlineCommand, match } = resolveSegmentAllowlistMatch({
				segment,
				context: params
			});
			if (match) matches.push(match);
			segmentAllowlistEntries.push(match ?? null);
			const by = resolveSegmentSatisfaction({
				match,
				segment,
				effectiveArgv,
				context: params,
				allowSkills,
				skillBinTrust
			});
			const inlineResult = resolveInlineCommandFallback({
				by,
				inlineCommand,
				context: params,
				inlineDepth
			});
			if (inlineResult) {
				matches.push(...inlineResult.matches);
				segmentSatisfiedBy.push(inlineResult.satisfiedBy);
				return true;
			}
			segmentSatisfiedBy.push(by);
			return Boolean(by);
		}),
		matches,
		segmentAllowlistEntries,
		segmentSatisfiedBy
	};
}
function resolveAnalysisSegmentGroups(analysis) {
	if (analysis.chains) return analysis.chains;
	return [analysis.segments];
}
function evaluateAuthorizationCandidate(params) {
	if (params.candidate.trustMode === "prompt-only") return {
		match: null,
		satisfiedBy: null
	};
	const { effectiveArgv, match } = resolveSegmentAllowlistMatch({
		segment: params.candidate.sourceSegment,
		context: params.context
	});
	if (match) return {
		match,
		satisfiedBy: "allowlist"
	};
	return {
		match,
		satisfiedBy: resolveSegmentSatisfaction({
			match,
			segment: params.candidate.sourceSegment,
			effectiveArgv,
			context: params.context,
			allowSkills: params.allowSkills,
			skillBinTrust: params.skillBinTrust
		})
	};
}
function evaluateAuthorizationPlanGroup(params) {
	const matches = [];
	const segmentAllowlistEntries = [];
	const segmentSatisfiedBy = [];
	const segments = [];
	let allowlistSatisfied = true;
	for (const candidate of params.group.candidates) {
		const result = evaluateAuthorizationCandidate({
			candidate,
			context: params.context,
			allowSkills: params.allowSkills,
			skillBinTrust: params.skillBinTrust
		});
		if (result.match) matches.push(result.match);
		segments.push(candidate.sourceSegment);
		segmentAllowlistEntries.push(result.match);
		segmentSatisfiedBy.push(result.satisfiedBy);
		if (!result.satisfiedBy) allowlistSatisfied = false;
	}
	return {
		evaluation: {
			allowlistSatisfied,
			allowlistMatches: matches,
			segmentAllowlistEntries,
			segmentSatisfiedBy
		},
		segments
	};
}
function finalizeShellAllowlistEvaluations(params) {
	const allowlistMatches = [];
	const segments = [];
	const segmentAllowlistEntries = [];
	const segmentSatisfiedBy = [];
	let allowlistSatisfied = true;
	for (const { analysis, evaluation } of params.evaluations) {
		segments.push(...analysis.segments);
		allowlistMatches.push(...evaluation.allowlistMatches);
		segmentAllowlistEntries.push(...evaluation.segmentAllowlistEntries);
		segmentSatisfiedBy.push(...evaluation.segmentSatisfiedBy);
		if (!evaluation.allowlistSatisfied) allowlistSatisfied = false;
	}
	return {
		analysisOk: true,
		allowlistSatisfied,
		allowlistMatches,
		segments,
		segmentAllowlistEntries,
		segmentSatisfiedBy,
		...params.authorizationPlan ? { authorizationPlan: params.authorizationPlan } : {}
	};
}
function evaluateAuthorizationPlan(params) {
	const analysisFailure = () => ({
		analysisOk: false,
		allowlistSatisfied: false,
		allowlistMatches: [],
		segments: [],
		segmentAllowlistEntries: [],
		segmentSatisfiedBy: [],
		authorizationPlan: params.plan
	});
	if (!params.plan.ok) return analysisFailure();
	const skillBins = params.context.skillBins ?? [];
	const allowSkills = params.context.autoAllowSkills === true && skillBins.length > 0;
	const skillBinTrust = buildSkillBinTrustIndex(skillBins);
	return finalizeShellAllowlistEvaluations({
		evaluations: params.plan.groups.map((group) => {
			const { evaluation, segments } = evaluateAuthorizationPlanGroup({
				group,
				context: params.context,
				allowSkills,
				skillBinTrust
			});
			return {
				analysis: {
					ok: true,
					segments
				},
				evaluation,
				opToNext: group.opToNext ?? null
			};
		}),
		authorizationPlan: params.plan
	});
}
function evaluateExecAllowlist(params) {
	const allowlistMatches = [];
	const segmentAllowlistEntries = [];
	const segmentSatisfiedBy = [];
	if (!params.analysis.ok || params.analysis.segments.length === 0) return {
		allowlistSatisfied: false,
		allowlistMatches,
		segmentAllowlistEntries,
		segmentSatisfiedBy
	};
	const allowlistContext = pickExecAllowlistContext(params);
	const hasChains = Boolean(params.analysis.chains);
	for (const group of resolveAnalysisSegmentGroups(params.analysis)) {
		const result = evaluateSegments(group, allowlistContext);
		if (!result.satisfied) {
			if (!hasChains) return {
				allowlistSatisfied: false,
				allowlistMatches: result.matches,
				segmentAllowlistEntries: result.segmentAllowlistEntries,
				segmentSatisfiedBy: result.segmentSatisfiedBy
			};
			return {
				allowlistSatisfied: false,
				allowlistMatches: [],
				segmentAllowlistEntries: [],
				segmentSatisfiedBy: []
			};
		}
		allowlistMatches.push(...result.matches);
		segmentAllowlistEntries.push(...result.segmentAllowlistEntries);
		segmentSatisfiedBy.push(...result.segmentSatisfiedBy);
	}
	return {
		allowlistSatisfied: true,
		allowlistMatches,
		segmentAllowlistEntries,
		segmentSatisfiedBy
	};
}
function hasSegmentExecutableMatch(segment, predicate) {
	const execution = resolveExecutionTargetResolution(segment.resolution);
	const candidates = [
		execution?.executableName,
		execution?.rawExecutable,
		segment.argv[0]
	];
	for (const candidate of candidates) {
		if (typeof candidate !== "string") continue;
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		if (predicate(trimmed)) return true;
	}
	return false;
}
function isShellWrapperSegment(segment) {
	return hasSegmentExecutableMatch(segment, isShellWrapperExecutable);
}
const SHELL_WRAPPER_OPTIONS_WITH_VALUE = new Set([
	"-c",
	"--command",
	"-o",
	"-O",
	"+O"
]);
const SHELL_WRAPPER_DISQUALIFYING_SCRIPT_OPTIONS = [
	"--rcfile",
	"--init-file",
	"--startup-file"
];
function hasDisqualifyingShellWrapperScriptOption(token) {
	return SHELL_WRAPPER_DISQUALIFYING_SCRIPT_OPTIONS.some((option) => token === option || token.startsWith(`${option}=`));
}
const POWERSHELL_OPTIONS_WITH_VALUE_RE = /^-(?:executionpolicy|ep|windowstyle|w|workingdirectory|wd|inputformat|outputformat|settingsfile|configurationfile|version|v|psconsolefile|pscf|encodedcommand|en|enc|encodedarguments|ea)$/i;
function resolveShellWrapperScriptCandidatePath(params) {
	if (!isShellWrapperSegment(params.segment)) return;
	const argv = params.segment.argv;
	if (!Array.isArray(argv) || argv.length < 2) return;
	const wrapperName = normalizeExecutableToken(argv[0] ?? "");
	const isPowerShell = POWERSHELL_WRAPPERS.has(wrapperName);
	let idx = 1;
	while (idx < argv.length) {
		const token = argv[idx]?.trim() ?? "";
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") {
			idx += 1;
			break;
		}
		if (token === "-c" || token === "--command") return;
		if (!isPowerShell && /^-[^-]*c[^-]*$/i.test(token)) return;
		if (token === "-s" || !isPowerShell && /^-[^-]*s[^-]*$/i.test(token)) return;
		if (hasDisqualifyingShellWrapperScriptOption(token)) return;
		if (SHELL_WRAPPER_OPTIONS_WITH_VALUE.has(token)) {
			idx += 2;
			continue;
		}
		if (isPowerShell && POWERSHELL_OPTIONS_WITH_VALUE_RE.test(token)) {
			idx += 2;
			continue;
		}
		if (token.startsWith("-") || token.startsWith("+")) {
			idx += 1;
			continue;
		}
		break;
	}
	const scriptToken = argv[idx]?.trim();
	if (!scriptToken) return;
	if (path.isAbsolute(scriptToken)) return scriptToken;
	const expanded = scriptToken.startsWith("~") ? expandHomePrefix(scriptToken) : scriptToken;
	const base = params.cwd && params.cwd.trim().length > 0 ? params.cwd : process.cwd();
	return path.resolve(base, expanded);
}
function resolveShellWrapperPositionalArgvCandidatePath(params) {
	if (!isShellWrapperSegment(params.segment)) return;
	const argv = params.segment.argv;
	if (!Array.isArray(argv) || argv.length < 4) return;
	const wrapper = normalizeExecutableToken(argv[0] ?? "");
	if (![
		"ash",
		"bash",
		"dash",
		"fish",
		"ksh",
		"sh",
		"zsh"
	].includes(wrapper)) return;
	const inlineMatch = resolveInlineCommandMatch(argv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	if (inlineMatch.valueTokenIndex === null || !inlineMatch.command) return;
	if (!isDirectShellPositionalCarrierCommand(inlineMatch.command)) return;
	const carriedExecutable = argv.slice(inlineMatch.valueTokenIndex + 1).map((token) => token.trim()).find((token) => token.length > 0);
	if (!carriedExecutable) return;
	const carriedName = normalizeExecutableToken(carriedExecutable);
	if (isDispatchWrapperExecutable(carriedName) || isShellWrapperExecutable(carriedName)) return;
	return resolveExecutionTargetCandidatePath(resolveCommandResolutionFromArgv([carriedExecutable], params.cwd, params.env, params.platform ?? void 0), params.cwd);
}
function escapeRegExpLiteral(input) {
	return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function buildScriptArgPatternFromArgv(argv, scriptPath, cwd, platform) {
	if (!isWindowsPlatform(platform ?? process.platform)) return;
	const scriptBase = normalizeLowercaseStringOrEmpty(path.basename(scriptPath));
	const base = cwd && cwd.trim() ? cwd.trim() : process.cwd();
	const resolveArgPath = (arg) => path.isAbsolute(arg) ? arg : path.resolve(base, arg);
	let scriptIdx = argv.findIndex((arg) => resolveArgPath(arg) === scriptPath);
	if (scriptIdx === -1) scriptIdx = argv.findIndex((arg) => normalizeLowercaseStringOrEmpty(path.basename(arg)) === scriptBase);
	const normalized = (scriptIdx !== -1 ? argv.slice(scriptIdx + 1) : []).map((a) => a.replace(/\//g, "\\"));
	if (normalized.length === 0) return "^\0\0$";
	return `^${normalized.map(escapeRegExpLiteral).join("\0")}\x00$`;
}
function buildArgPatternFromArgv(argv, platform) {
	if (!isWindowsPlatform(platform ?? process.platform)) return;
	const normalized = argv.slice(1).map((a) => a.replace(/\//g, "\\"));
	if (normalized.length === 0) return "^\0\0$";
	return `^${escapeRegExpLiteral(normalized.join("\0"))}\x00$`;
}
function addAllowAlwaysPattern(out, pattern, argPattern) {
	if (!out.some((p) => p.pattern === pattern && (p.argPattern ?? void 0) === (argPattern ?? void 0))) out.push({
		pattern,
		argPattern
	});
}
function resolveCandidateTrustPath(candidatePath) {
	if (!candidatePath) return;
	return resolveExecutableTrustPath({
		rawExecutable: candidatePath,
		resolvedPath: candidatePath,
		executableName: path.basename(candidatePath)
	});
}
function collectAllowAlwaysPatterns(params) {
	if (params.depth >= 3) return;
	const trustPlan = resolveExecWrapperTrustPlan(params.segment.argv, void 0, params.platform ?? void 0);
	if (trustPlan.policyBlocked) return;
	const segment = trustPlan.argv === params.segment.argv ? params.segment : {
		raw: trustPlan.argv.join(" "),
		argv: trustPlan.argv,
		sourceArgv: params.segment.sourceArgv,
		resolution: resolveCommandResolutionFromArgv(trustPlan.argv, params.cwd, params.env, params.platform ?? void 0)
	};
	const candidatePath = resolveExecutionTargetTrustPath(segment.resolution, params.cwd);
	if (!candidatePath) return;
	if (isInterpreterLikeAllowlistPattern(candidatePath)) {
		const effectiveArgv = segment.resolution?.effectiveArgv ?? segment.argv;
		if (params.strictInlineEval !== true || detectInlineEvalArgv(effectiveArgv) !== null) return;
	}
	if (!trustPlan.shellWrapperExecutable) {
		const argPattern = buildArgPatternFromArgv(segment.argv, params.platform);
		addAllowAlwaysPattern(params.out, candidatePath, argPattern);
		return;
	}
	const powerShellFileScriptArgv = resolvePowerShellFileScriptArgv({
		segment,
		cwd: params.cwd
	});
	const inlineCommand = powerShellFileScriptArgv ? null : trustPlan.shellInlineCommand;
	const positionalArgvPath = inlineCommand !== null ? resolveShellWrapperPositionalArgvCandidatePath({
		segment,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	}) : void 0;
	if (positionalArgvPath) {
		addAllowAlwaysPattern(params.out, resolveCandidateTrustPath(positionalArgvPath) ?? positionalArgvPath);
		return;
	}
	if (!inlineCommand) {
		const scriptPath = powerShellFileScriptArgv?.[0] ?? resolveShellWrapperScriptCandidatePath({
			segment,
			cwd: params.cwd
		});
		if (scriptPath) {
			const scriptTrustPath = resolveCandidateTrustPath(scriptPath) ?? scriptPath;
			const argPattern = buildScriptArgPatternFromArgv(powerShellFileScriptArgv ?? params.segment.argv, scriptPath, params.cwd, params.platform);
			addAllowAlwaysPattern(params.out, scriptTrustPath, argPattern);
		}
		return;
	}
	if (!isWindowsPlatform(params.platform)) return;
	const nested = analyzeWindowsShellCommand({
		command: inlineCommand,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	});
	if (!nested.ok || !canUseReusableWrapperPayloadCandidates(nested.segments)) return;
	for (const nestedSegment of nested.segments) collectAllowAlwaysPatterns({
		segment: nestedSegment,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform,
		strictInlineEval: params.strictInlineEval,
		depth: params.depth + 1,
		out: params.out
	});
}
/**
* Derive persisted allowlist patterns for an "allow always" decision.
* When a command is wrapped in a shell (for example `zsh -lc "<cmd>"`),
* persist the inner executable(s) rather than the shell binary.
*/
function resolveAllowAlwaysPatternEntries(params) {
	const patterns = [];
	for (const segment of params.segments) collectAllowAlwaysPatterns({
		segment,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform,
		strictInlineEval: params.strictInlineEval,
		depth: 0,
		out: patterns
	});
	return patterns;
}
function resolveAllowAlwaysPatterns(params) {
	return resolveAllowAlwaysPatternEntries(params).map((pattern) => pattern.pattern);
}
/**
* Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
*/
function evaluateShellAllowlist(params) {
	const allowlistContext = {
		...pickExecAllowlistContext(params),
		allowShellBuiltins: true
	};
	const analysisFailure = () => ({
		analysisOk: false,
		allowlistSatisfied: false,
		allowlistMatches: [],
		segments: [],
		segmentAllowlistEntries: [],
		segmentSatisfiedBy: []
	});
	if (hasShellLineContinuation(params.command)) return analysisFailure();
	if (!isWindowsPlatform(params.platform)) return analysisFailure();
	const analysis = analyzeWindowsShellCommand({
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	});
	if (!analysis.ok) return analysisFailure();
	const evaluation = evaluateExecAllowlist({
		analysis,
		...allowlistContext
	});
	return {
		analysisOk: true,
		allowlistSatisfied: evaluation.allowlistSatisfied,
		allowlistMatches: evaluation.allowlistMatches,
		segments: analysis.segments,
		segmentAllowlistEntries: evaluation.segmentAllowlistEntries,
		segmentSatisfiedBy: evaluation.segmentSatisfiedBy
	};
}
async function evaluateShellAllowlistWithAuthorization(params) {
	const allowlistContext = {
		...pickExecAllowlistContext(params),
		allowShellBuiltins: true
	};
	const analysisFailure = (segments = [], authorizationPlan) => ({
		analysisOk: false,
		allowlistSatisfied: false,
		allowlistMatches: [],
		segments,
		segmentAllowlistEntries: [],
		segmentSatisfiedBy: [],
		...authorizationPlan ? { authorizationPlan } : {}
	});
	if (!isWindowsPlatform(params.platform)) {
		const authorizationPlan = await planShellAuthorization({
			command: params.command,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform
		});
		if (!authorizationPlan.ok) return analysisFailure(await explainShellPolicySegments({
			command: params.command,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform
		}), authorizationPlan);
		return evaluateAuthorizationPlan({
			plan: authorizationPlan,
			context: allowlistContext
		});
	}
	return evaluateShellAllowlist(params);
}
async function evaluateExecAllowlistWithAuthorization(params) {
	if (isWindowsPlatform(params.platform)) return evaluateExecAllowlist(params);
	const authorizationPlan = await planExecAuthorization({
		analysis: params.analysis,
		command: params.command,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	});
	if (!authorizationPlan.ok) return {
		allowlistSatisfied: false,
		allowlistMatches: [],
		segmentAllowlistEntries: [],
		segmentSatisfiedBy: [],
		segments: params.analysis.segments,
		authorizationPlan
	};
	const result = evaluateAuthorizationPlan({
		plan: authorizationPlan,
		context: pickExecAllowlistContext(params)
	});
	return {
		allowlistSatisfied: result.allowlistSatisfied,
		allowlistMatches: result.allowlistMatches,
		segmentAllowlistEntries: result.segmentAllowlistEntries,
		segmentSatisfiedBy: result.segmentSatisfiedBy,
		segments: result.segments,
		authorizationPlan
	};
}
//#endregion
export { isSafeBinUsage as a, resolveAllowAlwaysPatterns as c, evaluateShellAllowlistWithAuthorization as i, resolveSafeBins as l, evaluateExecAllowlistWithAuthorization as n, normalizeSafeBins as o, evaluateShellAllowlist as r, resolveAllowAlwaysPatternEntries as s, evaluateExecAllowlist as t, planShellAuthorization as u };
