import { c as trackAsyncWork, r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { o as registerSignalExitGate } from "./signal-exit-barrier-BFniU76K.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-CSOrFNcy.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { t as CommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { i as runOutsideCommandProcessScope, n as resolveCommandProcessSignal, r as retainCommandProcessCleanup } from "./exec-spawn-IxJJNQFo.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { fileURLToPath } from "node:url";
import { StringDecoder } from "node:string_decoder";
//#region src/commands/doctor-process.ts
const MAX_OUTPUT_BYTES = 1048576;
/** Hosted Doctor keeps its synchronous checks and process-global state outside the Gateway. */
async function runDoctorProcess(runtime) {
	const signal = resolveCommandProcessSignal(getAsyncWorkSignal());
	signal?.throwIfAborted();
	const workerUrl = resolveRuntimeProcessEntrypointUrl("doctor");
	const output = {
		stdout: {
			decoder: new StringDecoder("utf8"),
			pending: "",
			write: runtime.log
		},
		stderr: {
			decoder: new StringDecoder("utf8"),
			pending: "",
			write: runtime.error
		}
	};
	let remaining = MAX_OUTPUT_BYTES;
	let truncated = false;
	let outputFailure;
	const write = (stream, text) => {
		if (outputFailure) return;
		try {
			output[stream].write(text);
		} catch (error) {
			outputFailure = { error };
		}
	};
	const append = (stream, text) => {
		const state = output[stream];
		state.pending += text;
		let newline;
		while ((newline = state.pending.indexOf("\n")) >= 0) {
			write(stream, state.pending.slice(0, newline));
			state.pending = state.pending.slice(newline + 1);
		}
	};
	const worker = trackAsyncWork(() => runOutsideCommandProcessScope(() => runUtf8CommandWithTimeout([process.execPath, ...resolveRuntimeWorkerArgv(workerUrl)], {
		input: "",
		cwd: process.cwd(),
		baseEnv: process.env,
		.../\.[cm]?ts$/.test(fileURLToPath(workerUrl)) ? { env: { TSX_TSCONFIG_PATH: fileURLToPath(new URL("../../tsconfig.json", workerUrl)) } } : {},
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		outputCapture: "discard",
		onOutputChunk(chunk, stream) {
			const accepted = chunk.subarray(0, remaining);
			remaining -= accepted.byteLength;
			truncated ||= accepted.byteLength < chunk.byteLength;
			append(stream, output[stream].decoder.write(accepted));
		}
	})));
	const settlement = worker.then((result) => {
		if (result.cleanup === "uncertain") throw new CommandProcessCleanupError();
	});
	settlement.catch(() => {});
	retainCommandProcessCleanup(settlement);
	const releaseExitGate = registerSignalExitGate(settlement);
	try {
		const result = await worker;
		for (const stream of ["stdout", "stderr"]) {
			if (!truncated) append(stream, output[stream].decoder.end());
			if (output[stream].pending) write(stream, output[stream].pending);
		}
		if (result.cleanup === "uncertain") throw new CommandProcessCleanupError();
		if (outputFailure) throw outputFailure.error;
		signal?.throwIfAborted();
		if (truncated) runtime.error("Doctor output was truncated after 1 MiB. Run `openclaw doctor --non-interactive` on this host for the complete report.");
		if (result.outputErrorStream) throw new Error(`Doctor ${result.outputErrorStream} output could not be read.`);
		if (result.termination !== "exit") throw new Error(`Doctor process stopped unexpectedly (${result.termination}).`);
		if (result.code !== 0) runtime.exit(result.code ?? 1);
	} finally {
		releaseExitGate();
	}
}
//#endregion
//#region src/commands/doctor.ts
async function resolveExplicitSessionSqliteMaintenancePaths(options) {
	if (!options.sessionSqliteStore) return [];
	const [{ resolveSessionStoreTargets }, { resolveSqliteTargetFromSessionStorePath }, { resolveSqliteDatabaseFilePaths }] = await Promise.all([
		import("./targets-Be8sKF4o.mjs"),
		import("./session-sqlite-target-D7Gj74mk.mjs"),
		import("./sqlite-files-CP2dUHSm.mjs")
	]);
	const targets = resolveSessionStoreTargets({ agents: { entries: { [normalizeAgentId(options.sessionSqliteAgent ?? "main")]: {} } } }, {
		store: options.sessionSqliteStore,
		...options.sessionSqliteAgent ? { agent: options.sessionSqliteAgent } : {},
		...options.sessionSqliteAllAgents ? { allAgents: true } : {}
	}, { env: process.env });
	const protectedPaths = [];
	for (const target of targets) {
		const sqlitePath = resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path;
		protectedPaths.push(target.storePath, ...resolveSqliteDatabaseFilePaths(sqlitePath));
	}
	return [...new Set(protectedPaths)];
}
async function doctorCommand(runtime, options, databasePreflight) {
	const outputRuntime = runtime ?? defaultRuntime;
	if (options?.stateSqlite) {
		const { runDoctorStateSqliteCompact } = await import("./doctor-state-sqlite-compact-CycZJ5dk.mjs");
		const report = await runDoctorStateSqliteCompact();
		if (options.json) writeRuntimeJson(outputRuntime, report);
		else if (report.skipped) outputRuntime.log(`state-sqlite compact: skipped; database missing at ${report.path}`);
		else {
			outputRuntime.log(`state-sqlite compact: reclaimed=${report.reclaimedBytes} bytes, db=${report.before.dbSizeBytes}->${report.after.dbSizeBytes} bytes, wal=${report.before.walSizeBytes}->${report.after.walSizeBytes} bytes`);
			outputRuntime.log(`- freelist=${report.before.freelistPages}->${report.after.freelistPages} pages, page-size=${report.after.pageSizeBytes} bytes, auto-vacuum=${report.before.autoVacuum}->${report.after.autoVacuum}`);
			outputRuntime.log(`- integrity-check=${report.integrityCheck}, path=${report.path}`);
		}
		exitCliAfterOutput(outputRuntime, 0);
	}
	if (options?.sessionSqlite) {
		const sessionSqliteMode = options.sessionSqlite;
		const { countBlockingSessionSqliteIssues } = await import("./doctor-session-sqlite-types-CFzkgzit.mjs");
		const { isDestructiveDoctorSessionSqliteMode, withDoctorSqliteMaintenanceLock } = await import("./doctor-sqlite-maintenance-lock-CU_ZsQ_C.mjs");
		const { runDoctorSessionSqlite, reconcileDoctorSessionSqlitePublication } = await import("./doctor-session-sqlite-bqHHceUm.mjs");
		const { withArtifactPreservingStateReads } = await import("./openclaw-state-db-readonly-B2Lj8_jL.mjs");
		const sessionSqliteOptions = {
			mode: sessionSqliteMode,
			...options.sessionSqliteStore ? { store: options.sessionSqliteStore } : {},
			...options.sessionSqliteAgent ? { agent: options.sessionSqliteAgent } : {},
			...options.sessionSqliteAllAgents ? { allAgents: true } : {}
		};
		const runSessionSqlite = async (authority) => await runDoctorSessionSqlite(sessionSqliteOptions, authority);
		const reconcileHardlink = (filePath) => reconcileDoctorSessionSqlitePublication(sessionSqliteOptions, filePath);
		const report = await withArtifactPreservingStateReads(async () => isDestructiveDoctorSessionSqliteMode(sessionSqliteMode) ? await withDoctorSqliteMaintenanceLock({
			env: process.env,
			operation: `session SQLite ${sessionSqliteMode}`,
			...options.sessionSqliteStore ? { protectedPaths: await resolveExplicitSessionSqliteMaintenancePaths(options) } : {},
			...sessionSqliteMode !== "compact" ? { reconcileHardlink } : {},
			run: runSessionSqlite
		}) : await runSessionSqlite());
		if (sessionSqliteMode === "recover" && options.sessionSqliteGithubIssue === true) await maybeCreateSessionSqliteGithubIssue(outputRuntime, report, options);
		if (options.json) writeRuntimeJson(outputRuntime, report);
		else {
			outputRuntime.log(`session-sqlite ${report.mode}: ${report.totals.targets} target(s), ${report.totals.legacyEntries} legacy entries, ${report.totals.sqliteEntries} sqlite entries, ${report.totals.issues} issue(s)`);
			if (report.migrationRun) {
				outputRuntime.log(`- migration-run=${report.migrationRun.runId}`);
				outputRuntime.log(`- manifest=${report.migrationRun.manifestPath}`);
				if (report.migrationRun.failureReportMarkdownPath) outputRuntime.log(`- failure-report=${report.migrationRun.failureReportMarkdownPath}`);
			}
			if (report.supportIssue) outputRuntime.log(`- support-issue-report=${report.supportIssue.bodyPath ?? "inline"}`);
			for (const target of report.targets) {
				outputRuntime.log(`- ${target.agentId}: imported=${target.importedEntries}/${target.importedTranscriptEvents} events, validated=${target.validatedEntries}/${target.validatedTranscriptEvents} events, archived-unreferenced-jsonl=${target.archivedUnreferencedJsonlFiles.length}, unreferenced-jsonl=${target.unreferencedJsonlFiles.length}`);
				if (target.restore) outputRuntime.log(`  restored=${target.restore.restoredFiles.length}, skipped=${target.restore.skippedFiles.length}, conflicts=${target.restore.conflicts.length}, manifests=${target.restore.manifestPaths.length}`);
				if (target.compact) outputRuntime.log(`  compact reclaimed=${target.compact.reclaimedBytes} bytes, db=${target.compact.dbSizeBeforeBytes}->${target.compact.dbSizeAfterBytes} bytes, wal=${target.compact.walSizeBeforeBytes}->${target.compact.walSizeAfterBytes} bytes`);
				if (target.corruptRecovery) outputRuntime.log(`  corrupt-db-recovery moved=${target.corruptRecovery.movedFiles.length}, skipped=${target.corruptRecovery.skippedFiles.length}`);
				for (const issue of target.issues.slice(0, 10)) outputRuntime.log(`  [${issue.code}]${issue.sessionKey ? ` ${issue.sessionKey}:` : ""} ${issue.message}`);
				if (target.issues.length > 10) outputRuntime.log(`  ...and ${target.issues.length - 10} more issue(s)`);
			}
		}
		const hasBlockingIssues = report.targets.some((target) => countBlockingSessionSqliteIssues(target) > 0);
		exitCliAfterOutput(outputRuntime, hasBlockingIssues ? 1 : 0);
	}
	if (options?.postUpgrade) {
		const { runPostUpgradeProbes } = await import("./doctor-post-upgrade-CrkNsZmW.mjs");
		const { readSourceConfigBestEffort } = await import("./io.runtime.js");
		const report = await runPostUpgradeProbes({ updateChannel: (await readSourceConfigBestEffort()).update?.channel });
		if (options.json) writeRuntimeJson(outputRuntime, report);
		else {
			for (const f of report.findings) outputRuntime.log(`[${f.level}] ${f.code}: ${f.message}`);
			if (report.findings.length === 0) outputRuntime.log("post-upgrade: no findings");
		}
		const hasError = report.findings.some((f) => f.level === "error");
		exitCliAfterOutput(outputRuntime, hasError ? 1 : 0);
	}
	await (await import("./doctor-health-BIXcHUn3.mjs")).runDoctorHealthFlow(runtime, options, void 0, databasePreflight);
}
async function maybeCreateSessionSqliteGithubIssue(runtime, report, options) {
	const shouldLog = options.json !== true;
	const supportIssue = report.supportIssue;
	if (!supportIssue) {
		if (shouldLog) runtime.log(report.totals.issues === 0 && report.totals.importedEntries === 0 && report.totals.archivedTranscriptFiles === 0 && report.totals.archivedUnreferencedJsonlFiles === 0 && report.targets.every((target) => !target.restore?.restoredFiles.length && !target.corruptRecovery?.movedFiles.length) ? "session-sqlite recover: nothing to recover; no report filed" : "session-sqlite recover: no support issue payload was generated");
		return;
	}
	const recordFailure = (message) => {
		supportIssue.github = {
			message,
			status: "failed"
		};
		if (shouldLog) runtime.log(`session-sqlite recover: ${message}`);
	};
	const recordCreated = (url) => {
		supportIssue.github = {
			status: "created",
			url
		};
		if (shouldLog) runtime.log(`session-sqlite recover: created GitHub issue ${url}`);
	};
	const { resolveDoctorRepairMode } = await import("./doctor-repair-mode-xZB3ixv3.mjs");
	const canPrompt = options.json !== true && resolveDoctorRepairMode(options).canPrompt;
	let approved = options.yes === true;
	if (canPrompt) {
		const { promptYesNo } = await import("./prompt-gRQjXOH_.mjs");
		approved = await promptYesNo("Create a GitHub issue in openclaw/openclaw with the sanitized recovery report?", false);
	}
	if (!approved) {
		const message = canPrompt ? "GitHub issue creation skipped: confirmation was declined." : "GitHub issue creation skipped: noninteractive recovery requires --yes.";
		supportIssue.github = {
			message,
			status: "skipped"
		};
		if (shouldLog) runtime.log(`session-sqlite recover: ${message}`);
		return;
	}
	const manifestPath = report.migrationRun?.manifestPath;
	if (!manifestPath) {
		recordFailure("GitHub issue creation is unavailable because its private retry receipt could not be prepared.");
		return;
	}
	const { prepareGithubIssue, reconcileGithubIssue, submitGithubIssue } = await import("./github-issue-D-TDe1Wf.mjs");
	const { claimSessionSqliteMigrationGithubIssue, clearSessionSqliteMigrationGithubIssueClaim } = await import("./doctor-session-sqlite-failure-C5xj7_Uz.mjs");
	const prepared = prepareGithubIssue({
		body: supportIssue.body,
		title: supportIssue.title
	});
	let claim;
	try {
		claim = await withSessionSqliteGithubIssueReceipt(manifestPath, (authority) => claimSessionSqliteMigrationGithubIssue(manifestPath, {
			marker: prepared.marker,
			title: prepared.title
		}, authority));
	} catch {
		claim = void 0;
	}
	if (!claim) {
		recordFailure("GitHub issue creation is unavailable because its private retry receipt could not be saved.");
		return;
	}
	supportIssue.title = claim.issue.title;
	const claimedIssue = prepareGithubIssue({
		body: supportIssue.body,
		title: claim.issue.title
	});
	if (claimedIssue.marker !== claim.issue.marker) {
		recordFailure("GitHub issue creation is unavailable because its private retry receipt is inconsistent.");
		return;
	}
	if (claim.status === "existing") {
		const reconciled = await reconcileGithubIssue(claimedIssue).catch(() => ({ status: "unavailable" }));
		if (reconciled.status === "created") {
			recordCreated(reconciled.url);
			return;
		}
		recordFailure("A prior GitHub issue handoff may already have created this report; no duplicate was opened.");
		return;
	}
	const created = await submitGithubIssue(claimedIssue).catch(() => ({
		reason: "creation-outcome-unknown",
		status: "outcome-unknown"
	}));
	if (created.status === "created") {
		recordCreated(created.url);
		return;
	}
	if (created.status === "outcome-unknown") {
		recordFailure("GitHub issue creation outcome is unknown; no duplicate was opened.");
		return;
	}
	if (created.status === "fallback-unavailable") {
		await withSessionSqliteGithubIssueReceipt(manifestPath, (authority) => clearSessionSqliteMigrationGithubIssueClaim(manifestPath, claimedIssue.marker, authority)).catch(() => false);
		recordFailure("GitHub issue creation is unavailable, and this report is too large for a safe browser fallback.");
		return;
	}
	const message = created.reason === "cli-unavailable" ? "GitHub CLI is unavailable." : created.reason === "authentication-unavailable" ? "GitHub authentication is unavailable." : "GitHub issue creation is unavailable.";
	const { detectBrowserOpenSupport, openUrl } = await import("./browser-open-DJbQwE8b.mjs");
	const browserSupport = await detectBrowserOpenSupport().catch(() => ({ ok: false }));
	const opened = browserSupport.ok ? await openUrl(created.url).catch(() => false) : false;
	if (!browserSupport.ok) await withSessionSqliteGithubIssueReceipt(manifestPath, (authority) => clearSessionSqliteMigrationGithubIssueClaim(manifestPath, claimedIssue.marker, authority)).catch(() => false);
	recordFailure(message);
	if (shouldLog) runtime.log(opened ? "session-sqlite recover: opened the sanitized fallback in your browser" : "session-sqlite recover: browser handoff unavailable; the sanitized report remains available in the recovery result");
}
async function withSessionSqliteGithubIssueReceipt(manifestPath, run) {
	const { withDoctorSqliteMaintenanceLock } = await import("./doctor-sqlite-maintenance-lock-CU_ZsQ_C.mjs");
	return await withDoctorSqliteMaintenanceLock({
		env: process.env,
		operation: "session SQLite GitHub issue receipt",
		protectedPaths: [manifestPath],
		run
	});
}
//#endregion
export { doctorCommand, runDoctorProcess };
