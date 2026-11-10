import { t as formatInstallationTargetCommand } from "./installation-target-format-CiRghKkr.mjs";
//#region src/commands/triage-handoff.ts
const TRIAGE_EXTERNAL_AGENTS = [
	"codex",
	"claude",
	"pi",
	"opencode",
	"muse",
	"grok",
	"cursor",
	"kimi",
	"qwen",
	"agy"
];
/** Keep executable manual commands and the complete JSON handoff pinned to the same target. */
function formatTriageHandoffCommands(params) {
	const { target, env, prompt, promptPath, updateResultPath } = params;
	const format = (argv, stdinPath) => formatInstallationTargetCommand(argv, target, {
		env,
		...stdinPath ? { stdinPath } : {}
	});
	const external = {
		agy: format([
			"agy",
			"--prompt-interactive",
			promptPath ? `Read the debugging prompt at ${promptPath} and follow its repair and verification instructions.` : prompt
		]),
		claude: format([
			"claude",
			"-p",
			...promptPath ? [] : [prompt]
		], promptPath),
		codex: format([
			"codex",
			"exec",
			"--skip-git-repo-check",
			promptPath ? "-" : prompt
		], promptPath),
		cursor: format([
			"cursor-agent",
			"--print",
			...promptPath ? [] : [prompt]
		], promptPath),
		grok: format(["grok", ...promptPath ? ["--prompt-file", promptPath] : ["--single", prompt]]),
		kimi: format([
			"kimi",
			"--prompt",
			promptPath ? `Read the debugging prompt at ${promptPath} and follow its repair and verification instructions.` : prompt
		]),
		muse: format([
			"muse",
			"exec",
			...promptPath ? ["--prompt-file", promptPath] : [prompt]
		]),
		opencode: format([
			"opencode",
			"run",
			...promptPath ? [] : [prompt]
		], promptPath),
		pi: format([
			"pi",
			"--print",
			...promptPath ? [] : [prompt]
		], promptPath),
		qwen: format(["qwen", ...promptPath ? [] : [prompt]], promptPath)
	};
	const failureArgs = updateResultPath ? ["--update-result", updateResultPath] : [];
	return {
		external,
		embedded: format([
			"openclaw",
			"triage",
			"--run",
			...failureArgs
		]),
		retry: format([
			"openclaw",
			"triage",
			...params.agent ? ["--agent", params.agent] : [],
			...failureArgs
		])
	};
}
//#endregion
export { formatTriageHandoffCommands as n, TRIAGE_EXTERNAL_AGENTS as t };
