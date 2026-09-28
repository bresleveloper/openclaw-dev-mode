import { b as resolveExecWrapperTrustPlan } from "./exec-command-resolution-D9KnwdvB.mjs";
import { n as resolvePlannedSegmentArgv } from "./exec-approvals-analysis-Dc-DBchW.mjs";
//#region src/infra/exec-authorization-render.ts
const SHELL_BARE_TOKEN_PATTERN = /^[A-Za-z0-9_@%+=:,./-]+$/u;
function shellEscapeSingleArg(value) {
	return `'${value.replace(/'/g, `'"'"'`)}'`;
}
function renderBareShellToken(value) {
	return value.length > 0 && SHELL_BARE_TOKEN_PATTERN.test(value) ? value : shellEscapeSingleArg(value);
}
function renderSourcePreservingArgv(argv) {
	return argv.map((token) => renderBareShellToken(token)).join(" ");
}
function hasUnquotedShellExpansionSource(value) {
	let quote = null;
	let escaped = false;
	let atWordStart = true;
	for (const char of value) {
		if (escaped) {
			escaped = false;
			continue;
		}
		if (quote !== "single" && char === "\\") {
			escaped = true;
			continue;
		}
		if (quote === "single") {
			if (char === "'") quote = null;
			continue;
		}
		if (quote === "double") {
			if (char === "\"") quote = null;
			continue;
		}
		if (char === "'") {
			quote = "single";
			continue;
		}
		if (char === "\"") {
			quote = "double";
			continue;
		}
		if (/\s/u.test(char)) {
			atWordStart = true;
			continue;
		}
		if (char === "~" && atWordStart) return true;
		if (char === "{" || char === "*" || char === "?" || char === "[") return true;
		atWordStart = false;
	}
	return false;
}
function hasArgumentShellExpansionSource(candidate) {
	const executableEnd = Math.max(0, candidate.sourceStep.executableSpan.endIndex - candidate.sourceStep.span.startIndex);
	return hasUnquotedShellExpansionSource(candidate.sourceStep.text.slice(executableEnd));
}
function validateSpan(params) {
	const { span } = params;
	if (!Number.isInteger(span.startIndex) || !Number.isInteger(span.endIndex) || span.startIndex < 0 || span.endIndex > params.command.length || span.startIndex >= span.endIndex) return {
		ok: false,
		reason: "invalid source span"
	};
	if (params.command.slice(span.startIndex, span.endIndex) !== params.expectedText) return {
		ok: false,
		reason: "source span mismatch"
	};
	return {
		ok: true,
		command: ""
	};
}
function sourceStepSlice(params) {
	const relativeStart = Math.max(0, params.span.startIndex - params.candidate.sourceStep.span.startIndex);
	const relativeEnd = Math.max(relativeStart, params.span.endIndex - params.candidate.sourceStep.span.startIndex);
	return params.candidate.sourceStep.text.slice(relativeStart, relativeEnd);
}
function shouldRewriteCandidate(params) {
	if (params.mode === "enforced") return params.satisfiedBy !== "safeBuiltins";
	return params.satisfiedBy === "safeBins" || params.satisfiedBy === "inlineChain";
}
function hasDispatchWrapper(segment) {
	return (segment.resolution?.wrapperChain?.length ?? 0) > 0;
}
function replacementForCandidate(params) {
	if (params.mode === "enforced" && hasArgumentShellExpansionSource(params.candidate)) return {
		ok: false,
		reason: "shell expansion in enforced arguments"
	};
	if (!shouldRewriteCandidate({
		mode: params.mode,
		satisfiedBy: params.satisfiedBy
	})) return null;
	const plannedArgv = resolvePlannedSegmentArgv(params.candidate.sourceSegment);
	if (!plannedArgv) return {
		ok: false,
		reason: "segment execution plan unavailable"
	};
	if (params.satisfiedBy === "safeBins" && hasArgumentShellExpansionSource(params.candidate)) return {
		ok: false,
		reason: "shell expansion in safe-bin arguments"
	};
	if (params.mode === "enforced" && params.candidate.transport.kind === "shell-wrapper") return {
		ok: false,
		reason: "shell quoting required in wrapper payload"
	};
	if (hasDispatchWrapper(params.candidate.sourceSegment)) {
		const spanResult = validateSpan({
			command: params.command,
			span: params.candidate.sourceStep.span,
			expectedText: params.candidate.sourceStep.text
		});
		if (!spanResult.ok) return spanResult;
		return {
			startIndex: params.candidate.sourceStep.span.startIndex,
			endIndex: params.candidate.sourceStep.span.endIndex,
			text: renderSourcePreservingArgv(plannedArgv)
		};
	}
	const executable = plannedArgv[0];
	if (!executable) return {
		ok: false,
		reason: "segment execution plan unavailable"
	};
	const renderedExecutable = renderBareShellToken(executable);
	if (params.satisfiedBy === "safeBins" && params.candidate.transport.kind === "shell-wrapper" && renderedExecutable !== executable) return {
		ok: false,
		reason: "shell quoting required in wrapper payload"
	};
	const spanResult = validateSpan({
		command: params.command,
		span: params.candidate.sourceStep.executableSpan,
		expectedText: sourceStepSlice({
			candidate: params.candidate,
			span: params.candidate.sourceStep.executableSpan
		})
	});
	if (!spanResult.ok) return spanResult;
	return {
		startIndex: params.candidate.sourceStep.executableSpan.startIndex,
		endIndex: params.candidate.sourceStep.executableSpan.endIndex,
		text: renderedExecutable
	};
}
function collectCandidateReplacements(params) {
	const replacements = [];
	for (const [index, candidate] of params.candidates.entries()) {
		const replacement = replacementForCandidate({
			command: params.command,
			candidate,
			mode: params.mode,
			satisfiedBy: params.segmentSatisfiedBy[index]
		});
		if (!replacement) continue;
		if ("ok" in replacement) return replacement;
		replacements.push(replacement);
	}
	return replacements;
}
function applyReplacements(params) {
	const sorted = params.replacements.toSorted((left, right) => left.startIndex - right.startIndex);
	let previousEnd = -1;
	for (const replacement of sorted) {
		if (replacement.startIndex < previousEnd) return {
			ok: false,
			reason: "overlapping replacement ranges"
		};
		previousEnd = replacement.endIndex;
	}
	let command = params.command;
	for (const replacement of sorted.toReversed()) command = command.slice(0, replacement.startIndex) + replacement.text + command.slice(replacement.endIndex);
	return {
		ok: true,
		command
	};
}
function buildAuthorizedShellCommandFromPlan(params) {
	if (!params.plan.ok) return {
		ok: false,
		reason: params.plan.reason
	};
	if (params.plan.dialect !== "posix-shell") return {
		ok: false,
		reason: "unsupported command dialect"
	};
	const candidates = params.plan.groups.flatMap((group) => group.candidates);
	const segmentSatisfiedBy = params.segmentSatisfiedBy ?? [];
	if (segmentSatisfiedBy.length !== candidates.length) return {
		ok: false,
		reason: "segment metadata mismatch"
	};
	const replacements = collectCandidateReplacements({
		command: params.plan.originalCommand,
		candidates,
		mode: params.mode,
		segmentSatisfiedBy
	});
	if ("ok" in replacements) return replacements;
	return applyReplacements({
		command: params.plan.originalCommand,
		replacements
	});
}
/** Pins reviewed dispatches while retaining argument expansion and wrapper semantics. */
function buildReviewedShellCommandFromPlan(params) {
	if (!params.plan.ok) return {
		ok: false,
		reason: params.plan.reason
	};
	if (params.plan.dialect !== "posix-shell") return {
		ok: false,
		reason: "unsupported command dialect"
	};
	const candidates = params.plan.groups.flatMap((group) => group.candidates);
	if (params.segmentSatisfiedBy && params.segmentSatisfiedBy.length !== candidates.length) return {
		ok: false,
		reason: "segment metadata mismatch"
	};
	const replacements = [];
	for (const [candidateIndex, candidate] of candidates.entries()) {
		if (params.segmentSatisfiedBy?.[candidateIndex] === "safeBuiltins") continue;
		const { sourceSegment: segment, sourceStep: step } = candidate;
		const sourceArgv = segment.sourceArgv ?? segment.argv;
		const { dispatchChain } = resolveExecWrapperTrustPlan(sourceArgv);
		if (candidate.transport.kind !== "direct" || segment.resolution?.policyBlocked || !dispatchChain) return {
			ok: false,
			reason: "dispatch chain cannot be rendered"
		};
		if (step.argvSpans?.length !== sourceArgv.length || step.argv.length !== sourceArgv.length || !step.argv.every((token, index) => token === sourceArgv[index])) return {
			ok: false,
			reason: "argument source spans unavailable"
		};
		const stepSpanResult = validateSpan({
			command: params.plan.originalCommand,
			span: step.span,
			expectedText: step.text
		});
		if (!stepSpanResult.ok) return stepSpanResult;
		for (const [index, argv] of dispatchChain.entries()) {
			const argvIndex = sourceArgv.length - argv.length;
			const span = step.argvSpans[argvIndex];
			if (!span || !argv.every((token, offset) => token === sourceArgv[argvIndex + offset]) || span.startIndex < step.span.startIndex || span.endIndex > step.span.endIndex) return {
				ok: false,
				reason: "dispatch source span mismatch"
			};
			const operandArgv = index === dispatchChain.length - 1 ? segment.argv : argv.slice(0, 1);
			const operand = params.binding.operands.find((entry) => entry.executable === true && entry.snapshot.argvIndex === 0 && entry.argv.length === operandArgv.length && entry.argv.every((token, offset) => token === operandArgv[offset]));
			if (!operand?.executable || !operand.invocationPath.startsWith("/")) return {
				ok: false,
				reason: "bound executable unavailable"
			};
			const spanResult = validateSpan({
				command: params.plan.originalCommand,
				span,
				expectedText: sourceStepSlice({
					candidate,
					span
				})
			});
			if (!spanResult.ok) return spanResult;
			replacements.push({
				startIndex: span.startIndex,
				endIndex: span.endIndex,
				text: shellEscapeSingleArg(operand.invocationPath)
			});
		}
	}
	if (replacements.length === 0) return {
		ok: false,
		reason: "no dispatches to render"
	};
	return applyReplacements({
		command: params.plan.originalCommand,
		replacements
	});
}
//#endregion
export { buildReviewedShellCommandFromPlan as n, buildAuthorizedShellCommandFromPlan as t };
