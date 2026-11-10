import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { a as workerSshCommandOptions, c as workerSshRemoteCommand, o as workerSshCommandPrefix } from "./ssh-BYwhpB2R.mjs";
//#region src/gateway/worker-environments/bootstrap-command.ts
function commandFailure(phase, result) {
	const output = truncateUtf16Safe(redactSensitiveText(result.stderr.trim() || result.stdout.trim(), { mode: "tools" }).replace(/\s+/gu, " "), 512);
	const status = result.termination === "exit" ? `exit ${result.code ?? "unknown"}` : result.termination;
	return /* @__PURE__ */ new Error(`Worker bootstrap ${phase} failed (${status})${output ? `: ${output}` : ""}`);
}
function isSuccess(result) {
	return result.termination === "exit" && result.code === 0;
}
function matchesCommandFailure(result, code, marker) {
	return result.code === code || result.stderr.includes(marker) || result.stdout.includes(marker);
}
async function runSshScript(params) {
	return await params.runCommand([
		...workerSshCommandPrefix(params.prepared, params.port ?? params.prepared.port),
		"--",
		params.prepared.sshTarget,
		workerSshRemoteCommand([
			"sh",
			"-s",
			"--",
			...params.scriptArgs
		])
	], workerSshCommandOptions({
		input: params.script,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	}));
}
//#endregion
export { runSshScript as i, isSuccess as n, matchesCommandFailure as r, commandFailure as t };
