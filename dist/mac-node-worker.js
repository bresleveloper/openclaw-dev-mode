#!/usr/bin/env node
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as runCliWithExitFinalization } from "./one-shot-exit-f6PhkiZS.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-wa21S6WO.mjs";
import { i as normalizeEnv } from "./env-C4a8LL2I.mjs";
import { t as isMainModule } from "./is-main-CH4EEB_R.mjs";
import { r as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-BGYPTRmo.mjs";
import { t as enableConsoleCapture } from "./console-DwqfhE-H.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-QhifpZGP.mjs";
import "./logging-CrcvifP_.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "./json-output-mode-DRPBa2uN.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-gB_2DGw2.mjs";
import { n as ensureCliExecutionBootstrap } from "./command-execution-startup-CiFHqswd.mjs";
import { t as loadCliDotEnv } from "./dotenv-Bn1InbsD.mjs";
import { n as createNodeWorkerCommand } from "./command-options-5SoYNuSl.mjs";
import { t as runNodeHostWorker } from "./worker-CrLRmEp6.mjs";
import process from "node:process";
import { fileURLToPath } from "node:url";
//#region src/node-host/mac-worker-entry.ts
const COMMAND_PATH = ["node", "worker"];
function resolveMacNodeWorkerArgv(argv) {
	const parsed = parseCliProfileArgs(argv);
	if (!parsed.ok) return parsed;
	const command = parsed.argv.slice(2);
	const worker = createNodeWorkerCommand();
	const remaining = worker.parseOptions(command.slice(COMMAND_PATH.length));
	if (!COMMAND_PATH.every((value, index) => command[index] === value) || remaining.operands.length || remaining.unknown.length) return {
		ok: false,
		error: "Private macOS worker accepts only: node worker"
	};
	return {
		...parsed,
		desktopSharingEnabled: worker.opts().desktopSharing
	};
}
async function runMacNodeWorkerEntry(argv = process.argv) {
	const parsed = resolveMacNodeWorkerArgv(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	process.title = "openclaw-node-worker";
	ensureOpenClawExecMarkerOnProcess();
	installProcessWarningFilter();
	normalizeEnv();
	if (parsed.profile) applyCliProfileEnv({ profile: parsed.profile });
	loadCliDotEnv({ quiet: true });
	enableConsoleCapture();
	await assertSupportedRuntime(void 0, void 0, parsed.argv, true, { ...process.env });
	const startupPolicy = resolveCliStartupPolicy({
		argv: parsed.argv,
		commandPath: [...COMMAND_PATH],
		jsonOutputMode: false,
		machineOutputMode: true
	});
	await withConsoleLogsRoutedToStderrForJson(parsed.argv, async () => {
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath: [...COMMAND_PATH],
			startupPolicy
		});
		await runNodeHostWorker({ desktopSharingEnabled: parsed.desktopSharingEnabled });
	}, {
		machineOutput: true,
		retainRoutingUntilProcessExit: true
	});
}
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) await runCliWithExitFinalization({
	run: () => runMacNodeWorkerEntry(),
	onError: (error) => {
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
		process.exitCode = 1;
	}
});
//#endregion
export { resolveMacNodeWorkerArgv };
