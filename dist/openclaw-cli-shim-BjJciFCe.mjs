import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeProfileName } from "./profile-utils-D5FwriYc.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { v as writeTextAtomic } from "./json-files-C0HSMh2Z.mjs";
import { a as renderCmdSetAssignment, n as quoteCmdScriptArg } from "./cmd-argv-Cqm1e4_m.mjs";
import { n as resolveCurrentOpenClawCliInvocation } from "./openclaw-cli-invocation-IIQ-EDjW.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/openclaw-cli-shim.ts
const AGENT_CLI_BIN_DIR = path.join("tmp", "agent-cli");
const gatewayAgentCliState = resolveGlobalSingleton(Symbol.for("openclaw.gatewayAgentCliShim"), () => ({ binDir: void 0 }), (state) => {
	state.binDir = void 0;
});
function quotePosixArgument(value) {
	return /^[A-Za-z0-9_@%+=:,./-]+$/u.test(value) ? value : `'${value.replaceAll("'", "'\\''")}'`;
}
function renderPosixShim(invocation, profile) {
	const args = [...invocation.args, ...profile ? ["--profile", profile] : []];
	return `#!/bin/sh
set -eu
${Object.entries(invocation.env ?? {}).map(([key, value]) => `export ${key}=${quotePosixArgument(value)}`).join("\n")}
exec ${[invocation.command, ...args].map(quotePosixArgument).join(" ")} "$@"
`;
}
function renderWindowsShim(invocation, profile) {
	const args = [...invocation.args, ...profile ? ["--profile", profile] : []];
	const context = { delayedExpansion: false };
	const environment = Object.entries(invocation.env ?? {}).map(([key, value]) => renderCmdSetAssignment(key, value, context));
	const command = [invocation.command, ...args].map((arg) => quoteCmdScriptArg(arg, context));
	return [
		"@echo off",
		"setlocal DisableDelayedExpansion",
		...environment,
		`${command.join(" ")} %*`,
		""
	].join("\r\n");
}
/**
* Materialize the exact running Gateway CLI as an agent-visible PATH command.
* The generated launcher is a runtime tool contract, not persisted product state.
*/
async function prepareGatewayAgentCliShim(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const invocation = options.invocation ?? resolveCurrentOpenClawCliInvocation([]);
	const profile = normalizeProfileName(env.OPENCLAW_PROFILE);
	const binDir = path.join(options.stateDir ?? resolveStateDir(env), AGENT_CLI_BIN_DIR);
	const executablePath = path.join(binDir, platform === "win32" ? "openclaw.cmd" : "openclaw");
	const content = platform === "win32" ? renderWindowsShim(invocation, profile) : renderPosixShim(invocation, profile);
	await fs.mkdir(binDir, {
		recursive: true,
		mode: 448
	});
	await fs.chmod(binDir, 448).catch(() => void 0);
	await writeTextAtomic(executablePath, content, {
		mode: 448,
		dirMode: 448,
		durable: false,
		tempPrefix: "openclaw-agent-cli"
	});
	gatewayAgentCliState.binDir = binDir;
}
/** Clear a prepared launcher after startup failure; normal Gateway close resets it globally. */
function clearGatewayAgentCliShim() {
	gatewayAgentCliState.binDir = void 0;
}
/** Prepend the prepared Gateway CLI ahead of operator-configured exec PATH entries. */
function mergeGatewayAgentCliPath(configured) {
	const merged = normalizeUniqueStringEntries([...gatewayAgentCliState.binDir ? [gatewayAgentCliState.binDir] : [], ...configured ?? []]);
	return merged.length > 0 ? merged : void 0;
}
//#endregion
export { mergeGatewayAgentCliPath as n, prepareGatewayAgentCliShim as r, clearGatewayAgentCliShim as t };
