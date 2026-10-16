#!/usr/bin/env node
import { t as disableExitUnsafeCompilers } from "./node-exit-safe-compilers-B7V3uapp.mjs";
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-DEgnfd3z.mjs";
import { i as normalizeEnv } from "./env-BBJTTIuE.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { r as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-DPiX2pYu.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as runCliWithExitFinalization } from "./one-shot-exit-CSOrFNcy.mjs";
import { t as enableConsoleCapture } from "./console-BnFs8ZzT.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-BoZCdLcu.mjs";
import "./logging-CIwBT2dJ.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "./json-output-mode-DhC0xNZP.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-BnA40z2t.mjs";
import { n as ensureCliExecutionBootstrap } from "./command-execution-startup-DccTYNhg.mjs";
import { t as loadCliDotEnv } from "./dotenv-DVxS6Drn.mjs";
import { n as createNodeWorkerCommand } from "./command-options-5SoYNuSl.mjs";
import { t as runNodeHostWorker } from "./worker-s2msHcJy.mjs";
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
if (isMainModule({ currentFile: fileURLToPath(import.meta.url) })) {
	disableExitUnsafeCompilers();
	await runCliWithExitFinalization({
		run: () => runMacNodeWorkerEntry(),
		onError: (error) => {
			process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
			process.exitCode = 1;
		}
	});
}
//#endregion
export { resolveMacNodeWorkerArgv };
