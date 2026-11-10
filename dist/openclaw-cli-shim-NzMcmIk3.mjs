import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { n as normalizeProfileName } from "./profile-utils-Bt5nN5dt.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as renderCmdSetAssignment } from "./cmd-set-C2w3lnGi.mjs";
import { n as quoteCmdScriptArg } from "./cmd-argv-OFfYg1uK.mjs";
import { m as writeTextAtomic } from "./json-files-DYmSFHoN.mjs";
import { n as resolveCurrentOpenClawCliInvocation } from "./openclaw-cli-invocation-DF2fY0bT.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/infra/openclaw-cli-shim.ts
const AGENT_CLI_BIN_DIR = path.join("tmp", "agent-cli");
const gatewayAgentCliState = resolveGlobalSingleton(Symbol.for("openclaw.gatewayAgentCliShim"), () => ({ binDir: void 0 }), (state) => {
	state.binDir = void 0;
});
function renderCliShim(invocation, profile, windows) {
	const args = [...invocation.args, ...profile ? ["--profile", profile] : []];
	const context = { delayedExpansion: false };
	const environment = Object.entries(invocation.env ?? {}).map(([key, value]) => windows ? renderCmdSetAssignment(key, value, context) : `export ${key}=${quoteCliArg(value)}`);
	if (windows) {
		const command = [invocation.command, ...args].map((arg) => quoteCmdScriptArg(arg, context));
		return [
			"@echo off",
			"setlocal DisableDelayedExpansion",
			...environment,
			`${command.join(" ")} %*`,
			""
		].join("\r\n");
	}
	return `#!/bin/sh
set -eu
${environment.join("\n")}
exec ${[invocation.command, ...args].map(quoteCliArg).join(" ")} "$@"
`;
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
	const content = renderCliShim(invocation, profile, platform === "win32");
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
/** Drop the Gateway-local CLI shim, e.g. before judging operator PATH entries for remote hosts. */
function omitGatewayAgentCliPath(entries) {
	const binDir = gatewayAgentCliState.binDir;
	return entries.filter((entry) => entry !== binDir);
}
//#endregion
export { prepareGatewayAgentCliShim as i, mergeGatewayAgentCliPath as n, omitGatewayAgentCliPath as r, clearGatewayAgentCliShim as t };
