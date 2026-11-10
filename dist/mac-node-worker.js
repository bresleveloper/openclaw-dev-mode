#!/usr/bin/env node
import { n as parseCliProfileArgs, t as applyCliProfileEnv } from "./profile-Dw600tcl.mjs";
import { i as normalizeEnv } from "./env-DbG527wb.mjs";
import { t as isMainModule } from "./is-main-DYSvvM1W.mjs";
import { i as ensureOpenClawExecMarkerOnProcess } from "./openclaw-exec-env-eyUZROLC.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-DEomBGoF.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as enableConsoleCapture } from "./console-CML7QnOp.mjs";
import { o as withCliProcessScope } from "./runtime-cleanup-scope-Dv2f28xK.mjs";
import "./logging-DuTp4Ty7.mjs";
import { t as closeCliResources } from "./runtime-cleanup-DQlcWeTy.mjs";
import { i as runCliWithExitFinalization } from "./one-shot-exit-DmuNrGrj.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-BzyF4hYe.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "./json-output-mode-CjwEBwVY.mjs";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-_d9_K0F3.mjs";
import { t as withCliPluginInvocation } from "./run-main-plugin-cache-BUJVO30q.mjs";
import { n as ensureCliExecutionBootstrap } from "./command-execution-startup-CVTKe0ke.mjs";
import { t as loadCliDotEnv } from "./dotenv-DkfB7xOR.mjs";
import { n as createNodeWorkerCommand } from "./command-options-5SoYNuSl.mjs";
import { t as runNodeHostWorker } from "./worker-cO3r1tbZ.mjs";
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
	run: () => withCliProcessScope(() => withCliPluginInvocation(false, async (cleanup) => {
		const resources = cleanup?.pluginResources;
		try {
			await (resources ? resources.run(() => runMacNodeWorkerEntry()) : runMacNodeWorkerEntry());
		} finally {
			try {
				await closeCliResources(cleanup);
			} finally {
				await resources?.release();
			}
		}
	})),
	onError: (error) => {
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
		process.exitCode = 1;
	}
});
//#endregion
export { resolveMacNodeWorkerArgv };
