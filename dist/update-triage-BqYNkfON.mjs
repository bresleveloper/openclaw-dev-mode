import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { t as ExitError } from "./runtime-BC29JSZp.mjs";
import { r as resolveOsHomeDir } from "./home-dir-D0b-ywue.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as redactSupportString } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { r as UPDATE_RUN_ID_ENV } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { i as resolveInstallationTarget, r as installationTargetEnv } from "./installation-target-context-CrBRhZSM.mjs";
import { t as formatInstallationTargetCommand } from "./installation-target-format-B8ZeqO2M.mjs";
import { a as resolveUpdateTargetEnv, c as withOwnedManagedUpdateEnv, i as resolveServiceRefreshEnv, s as stripGatewayServiceMarkerEnv, t as disableUpdatedPackageCompileCacheEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { c as writeTriageUpdateFailure } from "./update-failure-report-artifact-Bp1ktecS.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import fs from "node:fs/promises";
//#region src/infra/update-triage.ts
const triageReportPathsSchema = object({
	promptPath: string().min(1).max(4096),
	bundlePath: string().min(1).max(4096).nullish(),
	bundleError: string().max(1024).nullish()
});
const TRIAGE_OUTPUT_HINT = "See the Gateway host command output for saved diagnostics and the installation-specific openclaw triage command.";
/** Capture the interactive handoff before replacement; invoke it after native cleanup releases. */
async function prepareUpdateFailureTriage(params) {
	const { mode, runtime } = params;
	if (mode !== "interactive") return (invocation) => runUpdateFailureTriage({
		...invocation,
		mode,
		runtime
	});
	const invocationCwd = params.invocationCwd ?? tryProcessCwd();
	const operatorEnv = resolveServiceRefreshEnv(process.env, invocationCwd);
	const operatorHome = resolveOsHomeDir(operatorEnv);
	const { triageCommand } = await import("./triage-kb06Lo9W.mjs");
	const prepared = {
		mode,
		runtime,
		triageCommand,
		operatorEnv,
		invocationCwd,
		operatorHome
	};
	return (invocation) => runPreparedUpdateFailureTriage(invocation, prepared);
}
/** Fresh-CLI diagnostics for callers that do not own an interactive repair terminal. */
async function runUpdateFailureTriage(params) {
	return runPreparedUpdateFailureTriage(params, params);
}
async function runPreparedUpdateFailureTriage(params, prepared) {
	const isCurrent = () => !params.signal?.aborted && (params.isCurrent?.() ?? true);
	if (!isCurrent()) return { status: "cancelled" };
	const targetEnv = prepared.mode === "interactive" ? resolveServiceRefreshEnv(params.target.env, prepared.invocationCwd) : { ...params.target.env };
	const installationTarget = resolveInstallationTarget(targetEnv);
	const env = {
		...stripGatewayServiceMarkerEnv(prepared.mode === "interactive" ? resolveUpdateTargetEnv({
			baseEnv: prepared.operatorEnv,
			serviceEnv: targetEnv
		}) : disableUpdatedPackageCompileCacheEnv(targetEnv)),
		...installationTargetEnv(installationTarget)
	};
	delete env.OPENCLAW_UPDATE_IN_PROGRESS;
	delete env[UPDATE_RUN_ID_ENV];
	const redaction = {
		env,
		stateDir: installationTarget.stateDir
	};
	const { log, error: logError } = prepared.runtime;
	log(prepared.mode === "interactive" ? "Update failed. Entering triage..." : "Update failed. Preparing triage diagnostics...");
	let contextPath;
	try {
		let stdout = "";
		if (prepared.mode === "interactive") {
			let cwd = prepared.invocationCwd;
			if (cwd) try {
				if (!(await fs.stat(cwd)).isDirectory()) cwd = void 0;
				else await fs.access(cwd, fs.constants.X_OK);
			} catch {
				cwd = void 0;
			}
			if (!isCurrent()) return { status: "cancelled" };
			await withOwnedManagedUpdateEnv(env, () => prepared.triageCommand({
				...prepared.runtime,
				exit: (code) => {
					throw new ExitError(code);
				}
			}, { recovery: {
				target: installationTarget,
				cwd: cwd ?? prepared.operatorHome,
				updateFailure: params.failure,
				signal: params.signal,
				isCurrent
			} })).catch((error) => {
				if (!(error instanceof ExitError) || error.code !== 0) throw error;
			});
		} else {
			contextPath = await writeTriageUpdateFailure(params.failure, { env: targetEnv });
			if (!isCurrent()) return { status: "cancelled" };
			const root = params.target.root ?? await params.resolveRoot?.();
			const entryPath = await resolveGatewayInstallEntrypoint(root);
			if (!isCurrent()) return { status: "cancelled" };
			if (!entryPath) throw new Error("The installed OpenClaw entrypoint is unavailable.");
			const args = [
				entryPath,
				"triage",
				"--update-result",
				contextPath,
				prepared.mode === "json" ? "--json" : "--non-interactive"
			];
			const nodeRunner = params.target.nodeRunner ?? process.execPath;
			const result = await runCommandWithTimeout([nodeRunner, ...args], {
				cwd: root,
				baseEnv: {},
				env,
				input: "",
				timeoutMs: 6e4,
				killProcessTree: true,
				maxOutputBytes: 65536,
				...params.signal ? { signal: params.signal } : {}
			});
			if (!isCurrent()) return { status: "cancelled" };
			stdout = result.stdout.trimEnd();
			if (stdout) log(stdout);
			if (result.stderr.trim()) logError(result.stderr.trimEnd());
			if (result.termination !== "exit") throw new Error(`Triage stopped (${result.termination}).`);
			const exitCode = resolveSubprocessExitCode(result.code, result.signal);
			if (exitCode !== 0) throw new Error(`Triage exited with code ${exitCode}.`);
		}
		if (!isCurrent()) return { status: "cancelled" };
		let hint = `${prepared.mode === "interactive" ? "Triage completed." : "Triage diagnostics saved; no repair agent was started."} ${TRIAGE_OUTPUT_HINT}`;
		if (prepared.mode === "json") {
			const report = triageReportPathsSchema.parse(JSON.parse(stdout));
			if (report.bundleError) {
				const reason = scrubDoctorErrorMessage(redactSupportString(report.bundleError, redaction));
				hint += `\nDiagnostics export unavailable: ${reason}`;
			}
		}
		return {
			status: "completed",
			hint
		};
	} catch (error) {
		if (!isCurrent()) return { status: "cancelled" };
		const detail = error instanceof ExitError ? `Triage exited with code ${error.code}.` : formatErrorMessage(error);
		const message = `Triage could not complete: ${scrubDoctorErrorMessage(redactSupportString(detail, redaction))}`;
		const guidance = `On the Gateway host, run ${formatInstallationTargetCommand([
			"openclaw",
			"triage",
			...contextPath ? ["--update-result", contextPath] : []
		], installationTarget, { env: targetEnv })} after resolving the diagnostic error.`;
		logError(message);
		if (contextPath) log(`Saved update failure: ${contextPath}`);
		log(guidance);
		return {
			status: "failed",
			hint: `${message}\n${TRIAGE_OUTPUT_HINT}`
		};
	}
}
//#endregion
export { prepareUpdateFailureTriage, runUpdateFailureTriage };
