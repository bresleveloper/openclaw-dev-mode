import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as expandHomePrefix } from "./home-dir-Dc6nN6HB.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { a as validateSafeBinArgv, c as DEFAULT_SAFE_BINS, l as SAFE_BIN_PROFILES, n as isTrustedSafeBinPath } from "./exec-safe-bin-trust-c6wAnYib.mjs";
import { a as matchAllowlist, c as resolveCommandResolutionFromArgv, d as resolveExecutionTargetResolution, f as resolveExecutionTargetTrustPath, g as resolveExecWrapperTrustPlan, h as resolvePolicyTargetTrustPath, l as resolveExecutableTrustPath, m as resolvePolicyTargetResolution, p as resolvePolicyTargetCandidatePath, t as buildCwdBoundHashedArgPattern, u as resolveExecutionTargetCandidatePath } from "./exec-command-resolution-DxYxel2J.mjs";
import { C as resolveInlineCommandMatch, D as resolveDispatchWrapperTrustPlan, E as isDispatchWrapperExecutable, F as normalizeExecutableToken, O as unwrapDispatchWrappersForResolution, _ as advancePosixInlineOptionScan, b as isDirectShellPositionalCarrierCommand, d as isShellWrapperExecutable, g as POSIX_INLINE_COMMAND_FLAGS, i as extractBindableShellWrapperInlineCommand, n as POSIX_SHELL_WRAPPERS, r as POWERSHELL_WRAPPERS, t as POSIX_PARSEABLE_SHELL_WRAPPERS, v as hasPosixInteractiveStartupBeforeInlineCommand, w as resolvePowerShellInlineCommandMatch, x as isPowerShellInlineFileCommandFlag, y as hasPosixLoginStartupBeforeInlineCommand } from "./shell-wrapper-resolution-BWMoO7Nh.mjs";
import "./exec-wrapper-resolution-DG9lx7nr.mjs";
import { a as detectInlineEvalArgv, l as isInterpreterLikeAllowlistPattern } from "./risks-C7nFiQYV.mjs";
import { n as explainShellCommand } from "./extract-CfkpViVt.mjs";
import path from "node:path";
//#region src/infra/windows-shell-command.ts
const WINDOWS_UNSUPPORTED_TOKENS = /* @__PURE__ */ new Set([
	"&",
	"|",
	"<",
	">",
	";",
	"^",
	"(",
	")",
	"%",
	"!",
	"`",
	"\n",
	"\r"
]);
const WINDOWS_ALWAYS_UNSAFE_TOKENS = /* @__PURE__ */ new Set([
	"\n",
	"\r",
	"%",
	"`"
]);
function findWindowsUnsupportedToken(command) {
	let inDouble = false;
	for (let i = 0; i < command.length; i++) {
		const ch = command.charAt(i);
		if (ch === "\"") {
			inDouble = !inDouble;
			continue;
		}
		if (ch === "$") {
			const next = command[i + 1];
			if (next !== void 0 && /[A-Za-z_{(?$]/.test(next)) return "$";
			continue;
		}
		if (WINDOWS_UNSUPPORTED_TOKENS.has(ch)) {
			if (inDouble && !WINDOWS_ALWAYS_UNSAFE_TOKENS.has(ch)) continue;
			if (ch === "\n" || ch === "\r") return "newline";
			return ch;
		}
	}
	return null;
}
function tokenizeWindowsSegment(segment) {
	const tokens = [];
	let buf = "";
	let inDouble = false;
	let inSingle = false;
	let wasQuoted = false;
	const pushToken = () => {
		if (buf.length > 0 || wasQuoted) {
			tokens.push(buf);
			buf = "";
		}
		wasQuoted = false;
	};
	for (let i = 0; i < segment.length; i += 1) {
		const ch = segment.charAt(i);
		if (ch === "\"" && !inSingle) {
			if (!inDouble) wasQuoted = true;
			inDouble = !inDouble;
			continue;
		}
		if (ch === "'" && !inDouble) {
			if (inSingle && segment[i + 1] === "'") {
				buf += "'";
				i += 1;
				continue;
			}
			if (!inSingle) wasQuoted = true;
			inSingle = !inSingle;
			continue;
		}
		if (!inDouble && !inSingle && /\s/.test(ch)) {
			pushToken();
			continue;
		}
		buf += ch;
	}
	if (inDouble || inSingle) return null;
	pushToken();
	return tokens.length > 0 ? tokens : null;
}
function stripWindowsShellWrapper(command) {
	const maxDepth = 5;
	let result = command;
	for (let i = 0; i < maxDepth; i++) {
		const previous = result;
		result = stripWindowsShellWrapperOnce(result.trim());
		if (result === previous) break;
	}
	return result;
}
const POWERSHELL_INVOKE_PREFIX = `^(?:powershell|pwsh)(?:\\.exe)?\\s+${/(?:-(?!c(?:ommand)?\b|-command\b)\w+(?:\s+(?!-)(?:"[^"]*(?:""[^"]*)*"|'[^']*(?:''[^']*)*'|\S+))?\s+)*/i.source}(?:-command|-c|--command)\\s+`;
const POWERSHELL_DOUBLE_QUOTED = new RegExp(`${POWERSHELL_INVOKE_PREFIX}"(.+)"$`, "is");
const POWERSHELL_SINGLE_QUOTED = new RegExp(`${POWERSHELL_INVOKE_PREFIX}'(.+)'$`, "is");
const POWERSHELL_UNQUOTED = new RegExp(`${POWERSHELL_INVOKE_PREFIX}(.+)$`, "is");
function stripWindowsShellWrapperOnce(command) {
	const psCallMatch = command.match(/^&\s+(.+)$/s);
	if (psCallMatch?.[1]) return psCallMatch[1];
	const psInvokeMatch = command.match(POWERSHELL_DOUBLE_QUOTED);
	if (psInvokeMatch?.[1]) return psInvokeMatch[1].replace(/""/g, "\"");
	const psInvokeSingleQuote = command.match(POWERSHELL_SINGLE_QUOTED);
	if (psInvokeSingleQuote?.[1]) return psInvokeSingleQuote[1].replace(/''/g, "'");
	const psInvokeNoQuote = command.match(POWERSHELL_UNQUOTED);
	if (psInvokeNoQuote?.[1]) return psInvokeNoQuote[1];
	return command;
}
function analyzeWindowsShellCommand(params) {
	const effective = stripWindowsShellWrapper(params.command.trim());
	const unsupported = findWindowsUnsupportedToken(effective);
	if (unsupported) return {
		ok: false,
		reason: `unsupported windows shell token: ${unsupported}`,
		segments: []
	};
	const argv = tokenizeWindowsSegment(effective);
	if (!argv) return {
		ok: false,
		reason: "unable to parse windows command",
		segments: []
	};
	return {
		ok: true,
		segments: [{
			raw: params.command,
			argv,
			resolution: resolveCommandResolutionFromArgv(argv, params.cwd, params.env, params.platform ?? void 0)
		}]
	};
}
function isWindowsPlatform(platform) {
	return normalizeLowercaseStringOrEmpty(platform ?? process.platform).startsWith("win");
}
const WINDOWS_UNSAFE_CMD_META = /[%`]|\$(?=[A-Za-z_{(?$])/;
function windowsEscapeArg(value) {
	if (value === "") return {
		ok: true,
		escaped: "\"\""
	};
	if (WINDOWS_UNSAFE_CMD_META.test(value)) return { ok: false };
	if (/^[a-zA-Z0-9_./:~\\=-]+$/.test(value)) return {
		ok: true,
		escaped: value
	};
	return {
		ok: true,
		escaped: `"${value.replace(/"/g, "\"\"")}"`
	};
}
function rebuildWindowsShellCommandFromSource(params) {
	const source = stripWindowsShellWrapper(params.command.trim());
	if (!source) return {
		ok: false,
		reason: "empty command"
	};
	const unsupported = findWindowsUnsupportedToken(source);
	if (unsupported) return {
		ok: false,
		reason: `unsupported windows shell token: ${unsupported}`
	};
	const rendered = params.renderSegment(source, 0);
	if (!rendered.ok) return {
		ok: false,
		reason: rendered.reason
	};
	return {
		ok: true,
		command: `& ${rendered.rendered}`,
		segmentCount: 1
	};
}
//#endregion
//#region src/infra/exec-argv-analysis.ts
function analyzeArgvCommand(params) {
	const argv = params.argv.filter((entry) => entry.trim().length > 0);
	if (argv.length === 0) return {
		ok: false,
		reason: "empty argv",
		segments: []
	};
	return {
		ok: true,
		segments: [{
			raw: argv.join(" "),
			argv,
			sourceArgv: [...params.argv],
			resolution: resolveCommandResolutionFromArgv(argv, params.cwd, params.env, params.platform ?? void 0)
		}]
	};
}
//#endregion
//#region src/infra/exec-approvals-analysis.ts
function renderWindowsQuotedArgv(argv) {
	const parts = [];
	for (const token of argv) {
		const result = windowsEscapeArg(token);
		if (!result.ok) return {
			ok: false,
			reason: `unsafe windows token: ${token}`
		};
		parts.push(result.escaped);
	}
	return {
		ok: true,
		rendered: parts.join(" ")
	};
}
function resolvePlannedSegmentArgv(segment) {
	if (segment.resolution?.policyBlocked === true) return null;
	const baseArgv = segment.resolution?.effectiveArgv && segment.resolution.effectiveArgv.length > 0 ? segment.resolution.effectiveArgv : segment.argv;
	if (baseArgv.length === 0) return null;
	const argv = [...baseArgv];
	const execution = segment.resolution?.execution;
	const resolvedExecutable = execution?.resolvedRealPath?.trim() ?? execution?.resolvedPath?.trim() ?? "";
	if (resolvedExecutable) argv[0] = resolvedExecutable;
	return argv;
}
function buildEnforcedShellCommand(params) {
	if (params.platform !== "win32") return {
		ok: false,
		reason: "unsupported platform"
	};
	const rebuilt = rebuildWindowsShellCommandFromSource({
		command: params.command,
		renderSegment: (_raw, segmentIndex) => {
			const segment = params.segments[segmentIndex];
			if (!segment) return {
				ok: false,
				reason: "segment mapping failed"
			};
			const argv = resolvePlannedSegmentArgv(segment);
			if (!argv) return {
				ok: false,
				reason: "segment execution plan unavailable"
			};
			return renderWindowsQuotedArgv(argv);
		}
	});
	if (!rebuilt.ok) return {
		ok: false,
		reason: rebuilt.reason
	};
	if (rebuilt.segmentCount !== params.segments.length) return {
		ok: false,
		reason: "segment count mismatch"
	};
	return {
		ok: true,
		command: rebuilt.command
	};
}
//#endregion
//#region src/infra/exec-authorization-plan.ts
const POSIX_SHELL_NAMES = new Set(POSIX_PARSEABLE_SHELL_WRAPPERS);
const PROMPT_ONLY_RISKS = /* @__PURE__ */ new Set([
	"eval",
	"source",
	"alias",
	"shell-wrapper-through-carrier",
	"command-carrier"
]);
const NON_REUSABLE_RISKS = /* @__PURE__ */ new Set(["inline-eval"]);
const UNANALYZABLE_RISKS = /* @__PURE__ */ new Set([
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
const POWERSHELL_NAMES = /* @__PURE__ */ new Set(["powershell", "pwsh"]);
const WINDOWS_CMD_NAMES = /* @__PURE__ */ new Set(["cmd", "cmd.exe"]);
const POSITIONAL_CARRIER_BLOCKED_EXECUTABLES = /* @__PURE__ */ new Set(["find", "xargs"]);
const SHELL_WRAPPER_PRELUDE_REASON = "shell-env-assignment";
const UNSUPPORTED_DIRECT_SHELL_TOPOLOGY_SHAPES = /* @__PURE__ */ new Set([
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
function stepReasons(step, risks, kinds = PROMPT_ONLY_RISKS) {
	const reasons = [];
	for (const risk of risks) if (kinds.has(risk.kind) && riskInsideStep(risk, step)) reasons.push(risk.kind);
	return uniqueStrings(reasons);
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
	return uniqueStrings(reasons);
}
function isPathScopedExecutableToken$1(token) {
	return token.includes("/") || token.includes("\\");
}
function isUnresolvedPathScopedExecutable(segment) {
	const execution = segment.resolution?.execution;
	return isPathScopedExecutableToken$1(segment.argv[0]?.trim() ?? "") && !(execution?.resolvedPath?.trim() || execution?.resolvedRealPath?.trim());
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
	const stepNonReusableReasons = stepReasons(params.step, params.risks, NON_REUSABLE_RISKS);
	const preludeReasons = hasCommandPrelude(params.step) ? shellWrapperPreludeReasons({
		step: params.step,
		risks: params.risks
	}) : [];
	if (hasCommandPrelude(params.step) && preludeReasons.length === 0) preludeReasons.push(SHELL_WRAPPER_PRELUDE_REASON);
	const reasons = uniqueStrings([
		...stepPromptReasons,
		...stepNonReusableReasons,
		...preludeReasons
	]);
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
		groups.push(finalizeGroup({
			steps: current,
			relationship: "simple",
			opToNext: operator ?? ";",
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
	if (!carriedSteps && !shouldUseWrapperPayload({
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
	const nestedStepsForWrapper = wrapper.step.id ? params.nestedSteps.filter((entry) => entry.step.parentCommandId === wrapper.step.id) : params.nestedSteps;
	const operatorsForWrapper = wrapper.step.id ? params.operators.filter((operator) => operator.parentCommandId === wrapper.step.id) : params.operators;
	const groups = groupsFromSteps({
		steps: carriedSteps ?? nestedStepsForWrapper,
		operators: carriedSteps ? void 0 : operatorsForWrapper,
		transport,
		risks: params.risks
	});
	return groups.length > 0 ? groups : null;
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
				if (canUseReusableWrapperPayloadCandidates(shellPlan.groups.flatMap((group) => group.candidates.map((candidate) => candidate.sourceSegment)))) {
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
const DEFAULT_SAFE_BUILTINS = /* @__PURE__ */ new Set([
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
//#region src/infra/package-manager-exec-wrapper.ts
const NPM_EXEC_CONTEXT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--cache",
	"--package",
	"--prefix",
	"--script-shell",
	"--userconfig",
	"--workspace",
	"-p",
	"-w"
]);
const NPM_EXEC_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([...NPM_EXEC_CONTEXT_OPTIONS_WITH_VALUE, "--loglevel"]);
const NPM_EXEC_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"--no",
	"--quiet",
	"--ws",
	"--workspaces",
	"--yes",
	"-q",
	"-y"
]);
const NPM_EXEC_SUBCOMMANDS = /* @__PURE__ */ new Set(["exec", "x"]);
const PNPM_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--config",
	"--dir",
	"--filter",
	"--reporter",
	"--stream",
	"--test-pattern",
	"--workspace-concurrency"
]);
const PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-C"]);
const PNPM_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"--aggregate-output",
	"--color",
	"--parallel",
	"--recursive",
	"--silent",
	"--workspace-root",
	"-r",
	"-s",
	"-w"
]);
const PNPM_DLX_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--allow-build",
	"--package",
	"-p"
]);
const PNPM_EXEC_CONTEXT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--allow-build",
	"--config",
	"--dir",
	"--filter",
	"--package",
	"-p"
]);
const PNPM_EXEC_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"exec",
	"dlx",
	"node"
]);
const PNPM_SCRIPT_RUN_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"restart",
	"run",
	"start",
	"stop",
	"test"
]);
const PNPM_BUILTIN_NON_EXEC_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"add",
	"audit",
	"bin",
	"config",
	"dedupe",
	"deploy",
	"help",
	"import",
	"init",
	"install",
	"licenses",
	"link",
	"list",
	"outdated",
	"patch",
	"prune",
	"publish",
	"rebuild",
	"remove",
	"root",
	"server",
	"store",
	"unlink",
	"update",
	"view",
	"why"
]);
const YARN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["--cwd"]);
const YARN_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"--immutable",
	"--silent",
	"-s"
]);
const YARN_DLX_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["--package", "-p"]);
const YARN_DLX_FLAG_OPTIONS = /* @__PURE__ */ new Set(["--quiet", "-q"]);
const YARN_EXEC_SUBCOMMANDS = /* @__PURE__ */ new Set(["exec", "dlx"]);
const YARN_BUILTIN_NON_EXEC_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"add",
	"audit",
	"autoclean",
	"bin",
	"cache",
	"check",
	"config",
	"create",
	"dedupe",
	"generate-lock-entry",
	"global",
	"help",
	"import",
	"info",
	"init",
	"install",
	"licenses",
	"link",
	"list",
	"login",
	"logout",
	"outdated",
	"owner",
	"pack",
	"policies",
	"prune",
	"publish",
	"remove",
	"self-update",
	"tag",
	"team",
	"unlink",
	"upgrade",
	"upgrade-interactive",
	"version",
	"versions",
	"why",
	"workspace"
]);
const NPM_DIRECT_EXEC_OPTIONS = {
	optionsWithValue: NPM_EXEC_OPTIONS_WITH_VALUE,
	flagOptions: NPM_EXEC_FLAG_OPTIONS
};
const NPM_EXEC_OPTIONS = {
	...NPM_DIRECT_EXEC_OPTIONS,
	caseSensitiveOptionsWithValue: /* @__PURE__ */ new Set(["-C"]),
	contextOptionsWithValue: NPM_EXEC_CONTEXT_OPTIONS_WITH_VALUE,
	contextFlagOptions: /* @__PURE__ */ new Set(["--ws", "--workspaces"])
};
const PNPM_EXEC_OPTIONS = {
	optionsWithValue: /* @__PURE__ */ new Set([...PNPM_OPTIONS_WITH_VALUE, ...PNPM_DLX_OPTIONS_WITH_VALUE]),
	caseSensitiveOptionsWithValue: PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE,
	flagOptions: PNPM_FLAG_OPTIONS,
	contextOptionsWithValue: PNPM_EXEC_CONTEXT_OPTIONS_WITH_VALUE,
	contextFlagOptions: /* @__PURE__ */ new Set([
		"--recursive",
		"--workspace-root",
		"-r",
		"-w"
	])
};
const PNPM_DLX_OPTIONS = {
	optionsWithValue: PNPM_EXEC_OPTIONS.optionsWithValue,
	flagOptions: PNPM_FLAG_OPTIONS
};
const YARN_EXEC_OPTIONS = {
	optionsWithValue: /* @__PURE__ */ new Set([...YARN_OPTIONS_WITH_VALUE, ...YARN_DLX_OPTIONS_WITH_VALUE]),
	flagOptions: /* @__PURE__ */ new Set([...YARN_FLAG_OPTIONS, ...YARN_DLX_FLAG_OPTIONS]),
	contextOptionsWithValue: YARN_OPTIONS_WITH_VALUE
};
const YARN_DLX_OPTIONS = {
	optionsWithValue: YARN_DLX_OPTIONS_WITH_VALUE,
	flagOptions: YARN_DLX_FLAG_OPTIONS,
	contextOptionsWithValue: YARN_DLX_OPTIONS_WITH_VALUE
};
function findFirstNonOptionIndex(argv, startIdx, params, terminator = "skip") {
	let idx = startIdx;
	while (idx < argv.length) {
		const token = argv[idx]?.trim() ?? "";
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") {
			if (terminator === "reject") return null;
			if (terminator === "stop") return idx + 1 < argv.length ? idx + 1 : null;
			idx += 1;
			continue;
		}
		if (!token.startsWith("-")) return idx;
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (params.caseSensitiveOptionsWithValue?.has(parsedOption.name) || params.optionsWithValue.has(flag)) {
			idx += parsedOption.hasInlineValue ? 1 : 2;
			continue;
		}
		if (params.flagOptions.has(flag)) {
			idx += 1;
			continue;
		}
		return null;
	}
	return null;
}
function hasContextOption(argv, startIdx, params, scope = "leading") {
	let idx = startIdx;
	while (idx < argv.length) {
		const token = argv[idx]?.trim() ?? "";
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") {
			if (scope === "before-terminator") return false;
			idx += 1;
			continue;
		}
		if (!token.startsWith("-")) {
			if (scope === "leading") return false;
			idx += 1;
			continue;
		}
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (params.caseSensitiveOptionsWithValue?.has(parsedOption.name) || params.contextOptionsWithValue.has(flag) || params.contextFlagOptions?.has(flag)) return true;
		if (params.optionsWithValue.has(flag)) {
			idx += parsedOption.hasInlineValue ? 1 : 2;
			continue;
		}
		if (params.flagOptions.has(flag)) {
			idx += 1;
			continue;
		}
		if (scope === "leading") return false;
		idx += 1;
	}
	return false;
}
function hasKnownPackageManagerExecContextOptions(argv) {
	const executable = normalizePackageManagerExecToken(argv[0] ?? "");
	if (executable === "npx" || executable === "bunx") return hasContextOption(argv, 1, NPM_EXEC_OPTIONS);
	if (executable !== "npm" && executable !== "pnpm" && executable !== "yarn") return false;
	const [options] = PACKAGE_EXEC_MANAGERS[executable];
	if (hasContextOption(argv, 1, options)) return true;
	const subcommandIdx = findFirstNonOptionIndex(argv, 1, options);
	if (subcommandIdx === null) return false;
	if (executable === "npm") return NPM_EXEC_SUBCOMMANDS.has(argv[subcommandIdx] ?? "") && hasContextOption(argv, subcommandIdx + 1, options, "before-terminator");
	return argv[subcommandIdx] === "dlx" && hasContextOption(argv, subcommandIdx + 1, executable === "pnpm" ? options : YARN_DLX_OPTIONS);
}
function normalizePackageManagerExecToken(token) {
	return normalizeExecutableToken(token).replace(/\.(?:c|m)?js$/i, "");
}
function unwrapPackageExecArguments(argv, startIdx, params, terminator) {
	const idx = findFirstNonOptionIndex(argv, startIdx, params, terminator);
	return idx === null ? null : argv.slice(idx);
}
function unwrapNpmExecInvocation(argv) {
	const idx = findFirstNonOptionIndex(argv, 1, NPM_EXEC_OPTIONS, "reject");
	if (idx === null || !NPM_EXEC_SUBCOMMANDS.has(argv[idx]?.trim() ?? "")) return null;
	const tail = argv.slice(idx + 1);
	if (tail[0] === "--") return tail.length > 1 ? tail.slice(1) : null;
	return unwrapPackageExecArguments(argv, idx + 1, NPM_DIRECT_EXEC_OPTIONS, "reject");
}
function unwrapPnpmOrYarnExecInvocation(argv, manager) {
	const idx = findFirstNonOptionIndex(argv, 1, manager === "pnpm" ? PNPM_EXEC_OPTIONS : {
		optionsWithValue: YARN_OPTIONS_WITH_VALUE,
		flagOptions: YARN_FLAG_OPTIONS
	});
	if (idx === null) return null;
	const token = argv[idx]?.trim();
	if (token === "dlx") return unwrapPackageExecArguments(argv, idx + 1, manager === "pnpm" ? PNPM_DLX_OPTIONS : YARN_DLX_OPTIONS, "stop");
	const tail = argv.slice(idx + 1);
	const normalizedTail = tail[0] === "--" ? tail.slice(1) : tail;
	if (manager === "pnpm" && token === "node") return ["node", ...normalizedTail];
	if (token !== "exec") return null;
	if (manager === "pnpm") {
		const firstExecArg = normalizeLowercaseStringOrEmpty(parseInlineOptionToken(normalizedTail[0] ?? "").name);
		if (firstExecArg === "-c" || firstExecArg === "--shell-mode") return null;
	}
	return normalizedTail.length > 0 ? normalizedTail : null;
}
function unwrapKnownPackageManagerExecInvocation(argv) {
	const resolution = resolveKnownPackageManagerExecInvocation(argv);
	return resolution.kind === "unwrapped" ? resolution.argv : null;
}
const PACKAGE_EXEC_MANAGERS = {
	npm: [NPM_EXEC_OPTIONS, NPM_EXEC_SUBCOMMANDS],
	pnpm: [PNPM_EXEC_OPTIONS, PNPM_EXEC_SUBCOMMANDS],
	yarn: [YARN_EXEC_OPTIONS, YARN_EXEC_SUBCOMMANDS]
};
function resolveKnownPackageManagerExecInvocation(argv) {
	const executable = normalizePackageManagerExecToken(argv[0] ?? "");
	if (executable === "npx" || executable === "bunx") {
		const unwrapped = unwrapPackageExecArguments(argv, 1, NPM_DIRECT_EXEC_OPTIONS, "reject");
		return unwrapped ? {
			kind: "unwrapped",
			argv: unwrapped
		} : { kind: "unsafe-exec" };
	}
	if (executable !== "npm" && executable !== "pnpm" && executable !== "yarn") return { kind: "not-package-manager" };
	const [options, execSubcommands] = PACKAGE_EXEC_MANAGERS[executable];
	const unwrapped = executable === "npm" ? unwrapNpmExecInvocation(argv) : unwrapPnpmOrYarnExecInvocation(argv, executable);
	if (unwrapped) return {
		kind: "unwrapped",
		argv: unwrapped
	};
	const subcommandIndex = findFirstNonOptionIndex(argv, 1, options);
	const firstSubcommand = subcommandIndex === null ? null : normalizeLowercaseStringOrEmpty(argv[subcommandIndex] ?? "");
	const knownExec = firstSubcommand === null ? argv.slice(1).some((token) => execSubcommands.has(normalizeLowercaseStringOrEmpty(token))) : execSubcommands.has(firstSubcommand);
	const implicitExec = firstSubcommand !== null && (executable === "pnpm" ? !PNPM_SCRIPT_RUN_SUBCOMMANDS.has(firstSubcommand) && !PNPM_BUILTIN_NON_EXEC_SUBCOMMANDS.has(firstSubcommand) : executable === "yarn" && (firstSubcommand === "run" || !YARN_BUILTIN_NON_EXEC_SUBCOMMANDS.has(firstSubcommand)));
	return knownExec || implicitExec ? { kind: "unsafe-exec" } : { kind: "not-exec" };
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
	return normalizeSafeBins(entries === void 0 ? DEFAULT_SAFE_BINS : entries ?? []);
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
	if (!isTrustedSafeBinPath({
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
		const name = normalizeOptionalLowercaseString(entry.name);
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
	const executableName = normalizeOptionalLowercaseString(execution.executableName);
	const resolvedPath = normalizeSkillBinResolvedPath(trustPath);
	if (!executableName || !resolvedPath) return false;
	return Boolean(params.skillBinTrust.get(executableName)?.has(resolvedPath));
}
const MAX_SHELL_WRAPPER_INLINE_EVAL_DEPTH = 3;
const MAX_PACKAGE_MANAGER_EXEC_UNWRAP_DEPTH = 6;
function resolvePackageManagerTrustTargetArgv(argv, platform = process.platform) {
	let current = argv;
	let sawPackageManagerExec = false;
	for (let depth = 0; depth < MAX_PACKAGE_MANAGER_EXEC_UNWRAP_DEPTH; depth += 1) {
		const dispatchPlan = resolveDispatchWrapperTrustPlan(current, void 0, platform);
		if (dispatchPlan.policyBlocked) return { kind: "blocked" };
		current = dispatchPlan.argv;
		const packageManagerExec = resolveKnownPackageManagerExecInvocation(current);
		if (packageManagerExec.kind === "unwrapped" && hasKnownPackageManagerExecContextOptions(current)) return { kind: "blocked" };
		if (packageManagerExec.kind === "unsafe-exec") return { kind: "blocked" };
		if (packageManagerExec.kind !== "unwrapped") return sawPackageManagerExec ? {
			kind: "package-manager",
			argv: current
		} : {
			kind: "not-package-manager",
			argv: current
		};
		sawPackageManagerExec = true;
		current = packageManagerExec.argv;
	}
	return { kind: "blocked" };
}
function resolvePackageManagerAllowlistTargetArgv(argv, platform = process.platform) {
	const packageManagerTarget = resolvePackageManagerTrustTargetArgv(argv, platform);
	if (packageManagerTarget.kind === "blocked") return null;
	if (packageManagerTarget.kind !== "package-manager") return;
	const trustPlan = resolveExecWrapperTrustPlan(packageManagerTarget.argv, void 0, platform);
	if (trustPlan.policyBlocked || trustPlan.shellWrapperExecutable && trustPlan.shellInlineCommand) return null;
	return trustPlan.argv;
}
function matchExecutableAllowlistForSegment(params) {
	if (params.isPositionalCarrierInvocation) return null;
	const match = matchAllowlist(params.allowlist, params.candidateResolution, params.effectiveArgv, params.platform, params.cwd);
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
	const packageManagerTargetArgv = resolvePackageManagerAllowlistTargetArgv(effectiveArgv, params.context.platform ?? void 0);
	if (packageManagerTargetArgv === null) return {
		effectiveArgv,
		inlineCommand: null,
		match: null
	};
	const matchArgv = packageManagerTargetArgv ?? effectiveArgv;
	const matchResolution = matchArgv === effectiveArgv ? params.segment.resolution : resolveCommandResolutionFromArgv(matchArgv, params.context.cwd, params.context.env, params.context.platform ?? void 0);
	const allowlistSegment = matchArgv === params.segment.argv ? params.segment : {
		...params.segment,
		argv: matchArgv,
		resolution: matchResolution
	};
	const executableResolution = resolvePolicyTargetResolution(matchResolution);
	const executionResolution = resolveExecutionTargetResolution(params.segment.resolution);
	const candidatePath = resolvePolicyTargetCandidatePath(matchResolution, params.context.cwd);
	const trustPath = resolvePolicyTargetTrustPath(matchResolution, params.context.cwd);
	const candidateResolution = candidatePath && executableResolution ? {
		...executableResolution,
		resolvedPath: candidatePath,
		resolvedRealPath: trustPath
	} : executableResolution;
	const matchExecutionResolution = resolveExecutionTargetResolution(matchResolution);
	const inlineCommand = extractBindableShellWrapperInlineCommand(allowlistSegment.argv);
	const opaquePosixShellWrapper = isOpaquePosixShellWrapperSegment(allowlistSegment);
	const powerShellFileScriptArgv = resolvePowerShellFileScriptArgv({
		segment: allowlistSegment,
		cwd: params.context.cwd
	});
	const isShellWrapperInvocation = isShellWrapperSegment(allowlistSegment);
	const isPositionalCarrierInvocation = inlineCommand !== null && isDirectShellPositionalCarrierCommand(inlineCommand);
	const executableMatch = matchExecutableAllowlistForSegment({
		allowlist: params.context.allowlist,
		candidateResolution,
		effectiveArgv: matchArgv,
		platform: params.context.platform,
		cwd: params.context.cwd,
		inlineCommand,
		isShellWrapperInvocation,
		isPositionalCarrierInvocation,
		allowlistTargetIsExecutionTarget: executableResolutionsReferToSameTarget(executableResolution, matchExecutionResolution ?? executionResolution)
	});
	const shellPositionalArgvCandidate = inlineCommand !== null ? resolveShellWrapperPositionalArgvCandidate({
		segment: allowlistSegment,
		cwd: params.context.cwd,
		env: params.context.env,
		platform: params.context.platform
	}) : void 0;
	const shellPositionalArgvMatch = shellPositionalArgvCandidate ? matchAllowlist(shellPositionalArgvCandidate.durable ? params.context.allowlist : params.context.allowlist.filter((entry) => entry.argPattern === void 0), {
		kind: "executable",
		rawExecutable: shellPositionalArgvCandidate.path,
		resolvedPath: shellPositionalArgvCandidate.path,
		resolvedRealPath: resolveCandidateTrustPath(shellPositionalArgvCandidate.path),
		executableName: path.basename(shellPositionalArgvCandidate.path)
	}, shellPositionalArgvCandidate.argv, params.context.platform, params.context.cwd) : null;
	const shellScriptCandidatePath = powerShellFileScriptArgv?.[0] ?? (inlineCommand === null ? resolveShellWrapperScriptCandidatePath({
		segment: allowlistSegment,
		cwd: params.context.cwd
	}) : void 0);
	const shellScriptArgv = shellScriptCandidatePath ? powerShellFileScriptArgv ?? resolveShellWrapperScriptArgv({
		shellScriptCandidatePath,
		effectiveArgv: matchArgv,
		cwd: params.context.cwd
	}) : null;
	const shellScriptMatch = shellScriptCandidatePath && shellScriptArgv ? matchAllowlist(params.context.allowlist, {
		kind: "executable",
		rawExecutable: shellScriptCandidatePath,
		resolvedPath: shellScriptCandidatePath,
		resolvedRealPath: resolveCandidateTrustPath(shellScriptCandidatePath),
		executableName: path.basename(shellScriptCandidatePath)
	}, shellScriptArgv, params.context.platform, params.context.cwd) : null;
	return {
		effectiveArgv,
		inlineCommand: powerShellFileScriptArgv || opaquePosixShellWrapper ? null : inlineCommand,
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
	for (const group of analysis.chains ?? [analysis.segments]) {
		const result = evaluateSegments(group, params.context, params.inlineDepth);
		if (!result.allowlistSatisfied) return null;
		matches.push(...result.allowlistMatches);
	}
	return matches;
}
function emptyExecAllowlistEvaluation() {
	return {
		allowlistSatisfied: false,
		allowlistMatches: [],
		segmentAllowlistEntries: [],
		segmentSatisfiedBy: []
	};
}
function evaluateSegments(segments, params, inlineDepth = 0) {
	const result = emptyExecAllowlistEvaluation();
	const { allowlistMatches, segmentAllowlistEntries, segmentSatisfiedBy } = result;
	const skillBinTrust = buildSkillBinTrustIndex(params.skillBins);
	const allowSkills = params.autoAllowSkills === true && skillBinTrust.size > 0;
	result.allowlistSatisfied = segments.every((segment) => {
		if (segment.resolution?.policyBlocked === true) {
			segmentAllowlistEntries.push(null);
			segmentSatisfiedBy.push(null);
			return false;
		}
		const { effectiveArgv, inlineCommand, match } = resolveSegmentAllowlistMatch({
			segment,
			context: params
		});
		if (match) allowlistMatches.push(match);
		segmentAllowlistEntries.push(match ?? null);
		const by = resolveSegmentSatisfaction({
			match,
			segment,
			effectiveArgv,
			context: params,
			allowSkills,
			skillBinTrust
		});
		const inlineResult = by === null && inlineCommand && isWindowsPlatform(params.platform) ? evaluateShellWrapperInlineCommand({
			inlineCommand,
			context: params,
			inlineDepth: inlineDepth + 1
		}) : null;
		if (inlineResult) {
			allowlistMatches.push(...inlineResult);
			segmentSatisfiedBy.push("allowlist");
			return true;
		}
		segmentSatisfiedBy.push(by);
		return Boolean(by);
	});
	return result;
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
function evaluateAuthorizationPlan(params) {
	const result = {
		...emptyExecAllowlistEvaluation(),
		analysisOk: params.plan.ok,
		allowlistSatisfied: params.plan.ok,
		segments: [],
		authorizationPlan: params.plan
	};
	if (!params.plan.ok) return result;
	const skillBins = params.context.skillBins ?? [];
	const allowSkills = params.context.autoAllowSkills === true && skillBins.length > 0;
	const skillBinTrust = buildSkillBinTrustIndex(skillBins);
	for (const group of params.plan.groups) for (const candidate of group.candidates) {
		const { match, satisfiedBy } = evaluateAuthorizationCandidate({
			candidate,
			context: params.context,
			allowSkills,
			skillBinTrust
		});
		if (match) result.allowlistMatches.push(match);
		result.segments.push(candidate.sourceSegment);
		result.segmentAllowlistEntries.push(match);
		result.segmentSatisfiedBy.push(satisfiedBy);
		if (!satisfiedBy) result.allowlistSatisfied = false;
	}
	return result;
}
function evaluateExecAllowlist(params) {
	if (!params.analysis.ok || params.analysis.segments.length === 0) return emptyExecAllowlistEvaluation();
	if (!params.analysis.chains) return evaluateSegments(params.analysis.segments, params);
	const result = emptyExecAllowlistEvaluation();
	for (const group of params.analysis.chains) {
		const groupResult = evaluateSegments(group, params);
		if (!groupResult.allowlistSatisfied) return emptyExecAllowlistEvaluation();
		result.allowlistMatches.push(...groupResult.allowlistMatches);
		result.segmentAllowlistEntries.push(...groupResult.segmentAllowlistEntries);
		result.segmentSatisfiedBy.push(...groupResult.segmentSatisfiedBy);
	}
	result.allowlistSatisfied = true;
	return result;
}
function hasSegmentExecutableMatch(segment, predicate) {
	const execution = resolveExecutionTargetResolution(segment.resolution);
	return [
		execution?.executableName,
		execution?.rawExecutable,
		segment.argv[0]
	].some((candidate) => {
		const trimmed = normalizeOptionalString(candidate);
		return trimmed ? predicate(trimmed) : false;
	});
}
function isShellWrapperSegment(segment) {
	return hasSegmentExecutableMatch(segment, isShellWrapperExecutable);
}
function isOpaquePosixShellWrapperSegment(segment) {
	return hasSegmentExecutableMatch(segment, (token) => {
		const wrapper = normalizeExecutableToken(token);
		return POSIX_SHELL_WRAPPERS.has(wrapper) && !POSIX_PARSEABLE_SHELL_WRAPPERS.has(wrapper);
	});
}
const SHELL_WRAPPER_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-c",
	"--command",
	"-o",
	"-O",
	"+O",
	"+o"
]);
const POSIX_SHELLS_WITH_PLUS_OPTIONS = /* @__PURE__ */ new Set([
	"ash",
	"bash",
	"dash",
	"ksh",
	"mksh",
	"osh",
	"sh",
	"yash",
	"zsh"
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
	if (isOpaquePosixShellWrapperSegment(params.segment)) return;
	const argv = params.segment.argv;
	if (!Array.isArray(argv) || argv.length < 2) return;
	const wrapperName = normalizeExecutableToken(argv[0] ?? "");
	const isPowerShell = POWERSHELL_WRAPPERS.has(wrapperName);
	const supportsPosixPlusOptions = POSIX_SHELLS_WITH_PLUS_OPTIONS.has(wrapperName);
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
		if (!isPowerShell && POSIX_INLINE_COMMAND_FLAGS.has(token)) return;
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
		if (!isPowerShell && (token.startsWith("-") || supportsPosixPlusOptions && token.startsWith("+"))) {
			idx += advancePosixInlineOptionScan(token);
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
function isDurableShellPositionalCarrierCommand(command, tailArgv) {
	const trimmed = command.trim();
	if (trimmed.length === 0) return false;
	const shellWhitespace = String.raw`[^\S\r\n]+`;
	const positionalZero = String.raw`(?:\$(?:0|\{0\})|"\$(?:0|\{0\})")`;
	if (tailArgv.length === 0) return new RegExp(`^(?:exec${shellWhitespace}(?:--${shellWhitespace})?)?${positionalZero}$`, "u").test(trimmed);
	const positionalAll = String.raw`(?:\$(?:@|\{@\})|"\$(?:@|\{@\})")`;
	return new RegExp(`^(?:exec${shellWhitespace}(?:--${shellWhitespace})?)?${positionalZero}${shellWhitespace}${positionalAll}$`, "u").test(trimmed);
}
function resolveShellWrapperPositionalArgvCandidate(params) {
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
	const carriedOffset = argv.slice(inlineMatch.valueTokenIndex + 1).findIndex((token) => token.trim().length > 0);
	if (carriedOffset === -1) return;
	const carriedIndex = inlineMatch.valueTokenIndex + 1 + carriedOffset;
	const carriedExecutable = argv[carriedIndex]?.trim() ?? "";
	if (!carriedExecutable) return;
	const carriedTailArgv = argv.slice(carriedIndex + 1);
	const durable = isDurableShellPositionalCarrierCommand(inlineMatch.command, carriedTailArgv);
	const carriedName = normalizeExecutableToken(carriedExecutable);
	if (isDispatchWrapperExecutable(carriedName) || isShellWrapperExecutable(carriedName)) return;
	const resolution = resolveCommandResolutionFromArgv([carriedExecutable], params.cwd, params.env, params.platform ?? void 0);
	const candidatePath = resolveExecutionTargetCandidatePath(resolution, params.cwd);
	if (!candidatePath) return;
	return {
		path: candidatePath,
		argv: [resolveCandidateTrustPath(candidatePath) ?? candidatePath, ...carriedTailArgv],
		durable
	};
}
function buildScriptArgPatternFromArgv(argv, scriptPath, cwd, platform) {
	const scriptArgv = resolveShellWrapperScriptArgv({
		shellScriptCandidatePath: scriptPath,
		effectiveArgv: argv,
		cwd
	});
	const base = cwd && cwd.trim() ? cwd.trim() : process.cwd();
	return buildCwdBoundHashedArgPattern(scriptArgv, base, platform);
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
		kind: "executable",
		rawExecutable: candidatePath,
		resolvedPath: candidatePath,
		executableName: path.basename(candidatePath)
	});
}
function resolveAllowAlwaysPatternArgv(argv, platform = process.platform) {
	const packageManagerTarget = resolvePackageManagerTrustTargetArgv(argv, platform);
	if (packageManagerTarget.kind === "blocked") return null;
	return packageManagerTarget.argv;
}
function collectAllowAlwaysPatterns(params) {
	if (params.depth >= 3) return;
	const patternArgv = resolveAllowAlwaysPatternArgv(params.segment.argv, params.platform ?? void 0);
	if (!patternArgv) return;
	const trustPlan = resolveExecWrapperTrustPlan(patternArgv, void 0, params.platform ?? void 0);
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
		const argPattern = buildCwdBoundHashedArgPattern(segment.argv, params.cwd ?? process.cwd(), params.platform);
		addAllowAlwaysPattern(params.out, candidatePath, argPattern);
		return;
	}
	const powerShellFileScriptArgv = resolvePowerShellFileScriptArgv({
		segment,
		cwd: params.cwd
	});
	const inlineCommand = powerShellFileScriptArgv ? null : trustPlan.shellInlineCommand;
	if (inlineCommand && isOpaquePosixShellWrapperSegment(segment)) return;
	const positionalArgvCandidate = inlineCommand !== null ? resolveShellWrapperPositionalArgvCandidate({
		segment,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	}) : void 0;
	if (positionalArgvCandidate) {
		if (!positionalArgvCandidate.durable) return;
		const positionalTrustPath = resolveCandidateTrustPath(positionalArgvCandidate.path) ?? positionalArgvCandidate.path;
		const argPattern = buildCwdBoundHashedArgPattern(positionalArgvCandidate.argv, params.cwd ?? process.cwd(), params.platform);
		addAllowAlwaysPattern(params.out, positionalTrustPath, argPattern);
		return;
	}
	if (!inlineCommand) {
		const scriptPath = powerShellFileScriptArgv?.[0] ?? resolveShellWrapperScriptCandidatePath({
			segment,
			cwd: params.cwd
		});
		if (scriptPath) {
			const scriptTrustPath = resolveCandidateTrustPath(scriptPath) ?? scriptPath;
			const argPattern = buildScriptArgPatternFromArgv(powerShellFileScriptArgv ?? segment.argv, scriptPath, params.cwd, params.platform);
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
/**
* Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
*/
function evaluateShellAllowlist(params) {
	const analysisFailure = () => ({
		analysisOk: false,
		...emptyExecAllowlistEvaluation(),
		segments: []
	});
	if (hasShellLineContinuation(params.command) || !isWindowsPlatform(params.platform)) return analysisFailure();
	const analysis = analyzeWindowsShellCommand(params);
	if (!analysis.ok) return analysisFailure();
	return {
		analysisOk: true,
		...evaluateExecAllowlist({
			...params,
			analysis,
			allowShellBuiltins: true
		}),
		segments: analysis.segments
	};
}
async function evaluateShellAllowlistWithAuthorization(params) {
	if (isWindowsPlatform(params.platform)) return evaluateShellAllowlist(params);
	const allowlistContext = {
		...params,
		allowShellBuiltins: true
	};
	const authorizationPlan = await planShellAuthorization({ ...params });
	if (!authorizationPlan.ok) return {
		analysisOk: false,
		...emptyExecAllowlistEvaluation(),
		segments: await explainShellPolicySegments({ ...params }),
		authorizationPlan
	};
	return evaluateAuthorizationPlan({
		plan: authorizationPlan,
		context: allowlistContext
	});
}
//#endregion
export { isWindowsPlatform as _, PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE as a, PNPM_OPTIONS_WITH_VALUE as c, planExecAuthorization as d, planShellAuthorization as f, analyzeWindowsShellCommand as g, analyzeArgvCommand as h, resolveSafeBins as i, normalizePackageManagerExecToken as l, resolvePlannedSegmentArgv as m, evaluateShellAllowlistWithAuthorization as n, PNPM_DLX_OPTIONS_WITH_VALUE as o, buildEnforcedShellCommand as p, resolveAllowAlwaysPatternEntries as r, PNPM_FLAG_OPTIONS as s, evaluateExecAllowlist as t, unwrapKnownPackageManagerExecInvocation as u };
