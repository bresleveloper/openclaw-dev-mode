import { r as defaultRuntime } from "../runtime-BazLsT0s.mjs";
import { t as enableConsoleCapture } from "../console-CML7QnOp.mjs";
import { Jn as string, Lt as boolean, Nt as array, Pn as number, qn as strictObject, xn as literal } from "../schemas-BOYIvvln.mjs";
import { i as resolveUpdateRehearsalRoot } from "../update-rehearsal-paths-CRhoE25Z.mjs";
import { a as withCliCommandCleanup, o as withCliProcessScope } from "../runtime-cleanup-scope-Dv2f28xK.mjs";
import { r as runCliDisposer, t as closeCliResources } from "../runtime-cleanup-DQlcWeTy.mjs";
import { i as runCliWithExitFinalization } from "../one-shot-exit-DmuNrGrj.mjs";
import { a as withConsoleLogsRoutedToStderrForJson } from "../json-output-mode-CjwEBwVY.mjs";
import { t as scrubDoctorErrorMessage } from "../doctor-error-message-CBAGGfGW.mjs";
//#region src/commands/doctor-lint-options.ts
const DoctorLintCliOptionsSchema = strictObject({
	json: boolean().optional(),
	severityMin: string().optional(),
	skipIds: array(string()).readonly().optional(),
	onlyIds: array(string()).readonly().optional(),
	allowExec: boolean().optional(),
	deep: boolean().optional(),
	includeAllChecks: boolean().optional(),
	updateReadiness: literal("post-plugin").optional()
});
/** Private CLI→worker stdin handoff: the later worker shares the CLI's validation-command budget anchor. */
const DoctorLintWorkerInputSchema = strictObject({
	options: DoctorLintCliOptionsSchema,
	commandStartedAtMs: number().int().optional()
});
//#endregion
//#region src/commands/doctor-lint.worker.ts
async function runDoctorLintWorker() {
	if (!resolveUpdateRehearsalRoot(process.env)) throw new Error("Doctor lint worker requires an isolated update rehearsal.");
	const chunks = [];
	let bytes = 0;
	for await (const chunk of process.stdin) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.length;
		if (bytes > 1048576) throw new Error("Doctor lint worker input exceeded its limit.");
		chunks.push(buffer);
	}
	const { options, commandStartedAtMs } = DoctorLintWorkerInputSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
	if (options.json !== true) throw new Error("Doctor lint worker requires JSON output.");
	enableConsoleCapture();
	await withCliProcessScope(() => withCliCommandCleanup(false, async (cleanup) => {
		let exitCode;
		try {
			const { runDoctorLintCliInProcess } = await import("../doctor-lint-runner-CrgYvHwq.mjs");
			exitCode = await runDoctorLintCliInProcess(defaultRuntime, options, { commandStartedAtMs });
		} finally {
			await closeCliResources(cleanup);
			const resources = cleanup?.pluginResources;
			if (resources) await runCliDisposer("plugin-registration-resources", () => resources.release());
		}
		process.exitCode = exitCode;
	}));
}
withConsoleLogsRoutedToStderrForJson(process.argv, () => runCliWithExitFinalization({
	run: runDoctorLintWorker,
	onError: (error) => {
		process.stderr.write(`Doctor lint worker failed: ${scrubDoctorErrorMessage(error)}\n`);
		process.exitCode = 2;
	}
}), {
	machineOutput: true,
	retainRoutingUntilProcessExit: true
});
//#endregion
export {};
