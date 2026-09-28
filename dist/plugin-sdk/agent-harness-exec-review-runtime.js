//#region src/plugin-sdk/agent-harness-exec-review-runtime.ts
/**
* Review an exec request using the configured model without executing it.
* Handle all three results explicitly: `allow-once` with low/medium risk permits
* one execution; `ask` routes to human approval; `deny` must not run or escalate
* to human approval and must return the rationale and rejection guidance to the
* agent. Provider failures, timeouts, and invalid responses become `ask`;
* detected reviewer-directed prompt injection becomes high-risk `deny`.
* Facade loading or reviewer construction errors may still reject the promise.
*/
async function reviewExecRequestWithConfiguredModel(params) {
	const { createModelExecAutoReviewer } = await import("../exec-auto-reviewer-DXJFspUk.mjs");
	return createModelExecAutoReviewer({
		cfg: params.cfg,
		agentId: params.agentId,
		reviewer: params.reviewer
	})(params.input);
}
/**
* Build review input for a supported shell command, or return `undefined` when
* this helper cannot review it. This does not authorize execution; consumers of
* the subsequent review must handle `allow-once`, `deny`, and `ask` explicitly.
*/
async function buildExecAutoReviewInputForShellCommand(params) {
	const [{ commandRequiresSecurityAuditSuppressionApproval, evaluateShellAllowlistWithAuthorization }, { detectUnsafeExecControlShellCommand }, { detectPolicyInlineEval }, { isBlockedShellWrapperCommand }] = await Promise.all([
		import("../exec-approvals-CcP_Znli.mjs"),
		import("../exec-control-command-guard-B4i5GqV0.mjs"),
		import("../policy-BibU02x9.mjs"),
		import("../exec-wrapper-resolution-CW0s5wIV.mjs")
	]);
	const command = params.command.trim();
	const host = params.host;
	if (!command) return;
	const allowlistEval = await evaluateShellAllowlistWithAuthorization({
		command,
		allowlist: [],
		safeBins: /* @__PURE__ */ new Set(),
		cwd: params.cwd ?? void 0,
		platform: process.platform
	});
	const [segment] = allowlistEval.segments;
	if (!(allowlistEval.analysisOk && allowlistEval.segments.length === 1 && segment !== void 0 && segment.raw.trim() === command)) return;
	if (segment.resolution?.policyBlocked === true || isBlockedShellWrapperCommand(segment.argv)) return;
	if (commandRequiresSecurityAuditSuppressionApproval({
		command,
		cwd: params.cwd ?? void 0,
		segments: allowlistEval.segments
	})) return;
	if (await detectUnsafeExecControlShellCommand(command) !== null) return;
	const inlineEval = detectPolicyInlineEval(allowlistEval.segments) !== null;
	const heredoc = segment.argv.some((token) => token.startsWith("<<"));
	return {
		command,
		argv: segment.argv,
		cwd: params.cwd ?? null,
		envKeys: params.envKeys,
		host,
		reason: inlineEval ? "strict-inline-eval" : heredoc ? "heredoc" : "approval-required",
		analysis: {
			parsed: true,
			allowlistMatched: false,
			inlineEval,
			...heredoc ? { heredoc } : {}
		},
		agent: params.agent
	};
}
//#endregion
export { buildExecAutoReviewInputForShellCommand, reviewExecRequestWithConfiguredModel };
