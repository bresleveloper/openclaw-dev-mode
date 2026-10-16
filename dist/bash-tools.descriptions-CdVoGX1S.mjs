//#region src/agents/bash-tools.descriptions.ts
const EXEC_AUTO_REVIEW_GUIDANCE = "An automatic reviewer may deny a command and explain why; if denied, choose a materially safer alternative or ask the user, never work around the denial.";
/** Builds the model-facing exec tool description for the current platform and capabilities. */
function describeExecTool(params) {
	const base = [
		...params?.hasProcessTool === false ? ["Run shell and wait for completion."] : [
			"Run shell now; background continuation supported.",
			"Completed calls return command output directly. Use process only when exec reports running with a sessionId; output text alone is not a process handle.",
			"Long run: automatic completion wake when enabled and output/failure occurs; otherwise process confirms completion."
		],
		params?.hasCronTool ? "No sleep loops for reminders/follow-ups; use automations." : void 0,
		"TTY CLI/UI/coding agent: pty=true."
	].filter(Boolean).join(" ");
	const description = process.platform !== "win32" ? `${base} Quote arguments containing shell metacharacters, including URL query strings with \`?\` or \`&\`.` : `${base}\nIMPORTANT (Windows): Run executables directly; do NOT wrap commands in \`cmd /c\`, \`powershell -Command\`, \`& \` prefix, or WSL. Use backslash paths (C:\\path), not forward slashes. Use short executable names (e.g. \`node\`, \`python3\`) instead of full paths.`;
	return params?.autoReview ? `${description} ${EXEC_AUTO_REVIEW_GUIDANCE}` : description;
}
/** Builds the model-facing process-control tool description. */
function describeProcessTool(params) {
	return [
		"Control existing exec: list, poll, log, write, send-keys, submit, paste, kill.",
		"poll/log: status, output, quiet success, completion without auto-wake, input hints. Others: input/intervention.",
		params?.hasCronTool ? "No polling as timer/reminder; scheduled follow-up uses automations." : void 0
	].filter(Boolean).join(" ");
}
//#endregion
export { describeExecTool as n, describeProcessTool as r, EXEC_AUTO_REVIEW_GUIDANCE as t };
