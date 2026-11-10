import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as withArtifactPreservingStateReads, t as artifactPreservingReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { l as closeOpenClawStateDatabaseByPathAsync } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { f as loadPinnedRuntimeConfigAsync } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot, o as withDisposableOpenClawStateReads } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as withPluginSourceCaptureStorage, t as getPluginSourceCaptureStorage } from "./plugin-source-capture-context-BeR5LVZ8.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { a as withPluginInstallRoots, i as resolvePluginInstallRoots } from "./install-root-context-cuIncTSC.mjs";
import "./sqlite-BlFpr2YD.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import { o as maybeLoadDotEnvForConfig, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { c as readDeferredPluginMigrations } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { s as readConfigFileSnapshot, u as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { f as isUpdateDoctorLintPass, u as isPostCoreConvergencePass } from "./update-phase-M5rvMZiC.mjs";
import { t as UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX } from "./update-doctor-lint-BSXy6tAC.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { n as configValidationIssuesToHealthFindings } from "./doctor-config-validation-findings-BKpzgT9b.mjs";
import { n as listExtensionHealthChecksForDoctor } from "./health-check-registry-Lw8LGAUO.mjs";
import { i as parseHealthFindingSeverity, n as healthFindingMeetsSeverity, r as isHealthCheckEnabledByDefault } from "./health-checks-_h8bcnIK.mjs";
import { i as stateSchemaHealthCheck, n as runDoctorLintChecks, r as selectUpdateReadinessChecks, t as exitCodeFromFindings } from "./doctor-lint-flow-CUUVnNVU.mjs";
import { i as detectDoctorLintOutputMode, n as createStateSnapshotFailureExecution, o as writeJsonResult, r as createStateSnapshotFailureFinding, t as createDeferredInspectionExecution } from "./doctor-lint-output-lxo3atAt.mjs";
import { n as resolveDoctorUpdateBudget, t as admitDoctorUpdateInspection } from "./doctor-update-budget-Bf-myTlJ.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/commands/doctor-lint-runner.ts
const RUNTIME_TOOL_SCHEMA_CHECK_ID = "core/doctor/runtime-tool-schemas";
const PROJECT_CLONE_SHAPE_CHECK_ID = "core/doctor/project-clone-shape";
const SKILLS_READINESS_CHECK_ID = "core/doctor/skills-readiness";
const AUTH_PROFILE_CHECK_ID = "core/doctor/auth-profiles";
var DoctorLintStateSnapshotError = class extends Error {
	constructor(cause) {
		super(`Doctor lint could not prepare a private plugin-state snapshot: ${scrubDoctorErrorMessage(cause)}`, { cause });
		this.name = "DoctorLintStateSnapshotError";
	}
};
/** Only the rehearsal worker reports before disposal and inherits its CLI's budget anchor. */
async function runDoctorLintCliInProcess(runtime, opts, worker) {
	let reported;
	const report = (execution) => {
		execution.writeOutput();
		reported = execution;
	};
	try {
		const execution = await withArtifactPreservingStateReads(() => prepareDoctorLintExecution(runtime, opts, worker ? report : void 0, worker?.commandStartedAtMs), { agentDatabases: true });
		if (!reported) report(execution);
		else for (const warning of execution.cleanupWarnings ?? []) runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${warning.message}`);
		return execution.exitCode;
	} catch (error) {
		if (!reported) throw error;
		runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${scrubDoctorErrorMessage(error)}`);
		return reported.exitCode;
	}
}
/** Collect advisory doctor findings without writing output or repairing operator state. */
async function collectDoctorFindings(runtime) {
	return (await withArtifactPreservingStateReads(() => prepareDoctorLintExecution(runtime, { severityMin: "info" }), { agentDatabases: true })).findings;
}
async function prepareDoctorLintExecution(runtime, opts, onChecksComplete, commandStartedAtMs) {
	const sevMin = opts.severityMin === void 0 ? "warning" : parseHealthFindingSeverity(opts.severityMin);
	if (sevMin === null) throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
	maybeLoadDotEnvForConfig(process.env);
	const sourceEnv = { ...process.env };
	if (resolveUpdateRehearsalRoot(sourceEnv) && !opts.onlyIds?.length) {
		const snapshot = await createConfigIO({
			env: sourceEnv,
			observe: false,
			pluginValidation: "core-only"
		}).readConfigFileSnapshot();
		if (snapshot.valid) {
			const budget = await resolveDoctorUpdateBudget({
				cfg: snapshot.config,
				env: sourceEnv,
				commandStartedAtMs
			});
			if (budget && !admitDoctorUpdateInspection(budget, "agent", [{
				id: "core/doctor/lint-inspection",
				label: "Doctor lint inspection"
			}])) return createDeferredInspectionExecution(runtime, opts, [...budget.deferred.values()]);
		}
	}
	const cleanupWarnings = isUpdateDoctorLintPass(sourceEnv) ? [] : void 0;
	const run = () => prepareDoctorLintStateExecution(runtime, opts, sevMin, sourceEnv, cleanupWarnings, onChecksComplete);
	if (opts.onlyIds?.length) return await run();
	let execution;
	try {
		return await withOpenClawStateDatabaseReadSnapshot(async () => execution = await run(), { env: sourceEnv });
	} catch (error) {
		if (!execution || !cleanupWarnings || !(error instanceof SqliteSnapshotCleanupError)) throw error;
		recordSnapshotCleanupWarning(cleanupWarnings);
		return execution;
	}
}
async function prepareDoctorLintStateExecution(runtime, opts, sevMin, sourceEnv, cleanupWarnings, onChecksComplete) {
	const updateReadiness = isPostCoreConvergencePass(sourceEnv) ? "post-plugin" : void 0;
	const effectiveOpts = updateReadiness ? {
		...opts,
		updateReadiness
	} : opts;
	const { resolveBundledHealthCheckPluginStateMode } = await import("./bundled-health-checks-Nex_6rpM.mjs");
	const pluginStateMode = resolveBundledHealthCheckPluginStateMode(effectiveOpts);
	let coreChecks;
	const deferredCheckIds = /* @__PURE__ */ new Set();
	if (resolveUpdateRehearsalRoot(sourceEnv) && !updateReadiness && !opts.onlyIds?.length) {
		const { resolveDoctorContributionHealthChecks } = await import("./doctor-health-contributions-BNG0zGh_.mjs");
		coreChecks = await resolveDoctorContributionHealthChecks();
		for (const check of coreChecks) if ((check.updateWork?.kind === "inspection" || check.updateWork?.kind === "standalone") && (opts.includeAllChecks === true || isHealthCheckEnabledByDefault(check)) && !opts.skipIds?.includes(check.id)) deferredCheckIds.add(check.id);
	}
	const prepareRuntimeValidation = !deferredCheckIds.has(RUNTIME_TOOL_SCHEMA_CHECK_ID) && (pluginStateMode === "isolated" || !effectiveOpts.onlyIds?.length || effectiveOpts.onlyIds.includes(RUNTIME_TOOL_SCHEMA_CHECK_ID));
	const readConfigSnapshot = async (deferredPluginMigrations) => {
		const io = pluginStateMode === "direct" ? {
			readConfigFileSnapshot,
			readConfigFileSnapshotWithPluginMetadata
		} : createConfigIO({
			env: sourceEnv,
			configPath: resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv)),
			observe: false,
			pluginValidation: pluginStateMode === "deferred" ? "core-only" : void 0,
			deferredPluginMigrations
		});
		return pluginStateMode === "deferred" || !prepareRuntimeValidation ? io.readConfigFileSnapshot({ observe: false }) : (await io.readConfigFileSnapshotWithPluginMetadata({
			observe: false,
			prepareValidation: "runtime"
		})).snapshot;
	};
	const stateView = {
		coreChecks,
		deferredCheckIds,
		cleanupWarnings,
		pluginMetadataEnv: sourceEnv,
		sourceEnv,
		readConfigSnapshot,
		runWithPluginStateSnapshot: async (run) => withReadOnlyPluginStateSnapshot(sourceEnv, run, cleanupWarnings)
	};
	if (pluginStateMode !== "isolated" && !onChecksComplete) return await executeDoctorLint(runtime, effectiveOpts, sevMin, stateView);
	let checksReported = false;
	let completedExecution;
	try {
		return await stateView.runWithPluginStateSnapshot(async (pluginMetadataEnv) => {
			const pending = readDeferredPluginMigrations({ env: pluginMetadataEnv });
			const disposals = [];
			try {
				const execution = await executeDoctorLint(runtime, effectiveOpts, sevMin, {
					...stateView,
					pluginMetadataEnv,
					readConfigSnapshot: () => readConfigSnapshot(pending),
					runWithPluginStateSnapshot: async (run) => run(pluginMetadataEnv),
					deferInspectionDisposal: onChecksComplete ? (dispose) => disposals.push(dispose) : void 0
				});
				completedExecution = execution;
				onChecksComplete?.(execution);
				checksReported = onChecksComplete !== void 0;
				return execution;
			} finally {
				for (const dispose of disposals) try {
					await dispose();
				} catch (error) {
					runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${scrubDoctorErrorMessage(error)}`);
				}
			}
		});
	} catch (error) {
		if (checksReported || !(error instanceof DoctorLintStateSnapshotError)) throw error;
		return createStateSnapshotFailureExecution(runtime, effectiveOpts, sevMin, error, completedExecution);
	}
}
async function executeDoctorLint(runtime, opts, sevMin, stateView) {
	const snapshot = await stateView.readConfigSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-BUSjWkv_.mjs");
		const runtimeFindings = await collectNodeRuntimeFindings(stateView.sourceEnv);
		const findings = [...configValidationIssuesToHealthFindings(snapshot.issues), ...runtimeFindings];
		const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
		return {
			checksRun: 1,
			checksSkipped: 0,
			exitCode: exitCodeFromFindings(findings, sevMin),
			findings: visible,
			cleanupWarnings: stateView.cleanupWarnings,
			writeOutput() {
				if (detectDoctorLintOutputMode(opts) === "json") {
					writeJsonResult({
						ok: false,
						checksRun: 1,
						checksSkipped: 0,
						findings: visible,
						warnings: stateView.cleanupWarnings
					});
					return;
				}
				runtime.error("doctor --lint: config file exists but does not parse cleanly.");
				for (const issue of snapshot.issues) {
					const issuePath = issue.path || "<root>";
					runtime.error(`- ${issuePath}: ${issue.message}`);
				}
				for (const finding of runtimeFindings.filter((entry) => healthFindingMeetsSeverity(entry, sevMin))) runtime.error(finding.fixHint ? `${finding.message}\n${finding.fixHint}` : finding.message);
				for (const warning of stateView.cleanupWarnings ?? []) runtime.error(`${UPDATE_DOCTOR_DISPOSAL_WARNING_PREFIX}: ${warning.message}`);
			}
		};
	}
	await loadPinnedRuntimeConfigAsync(async () => ({ config: snapshot.config }));
	const cfg = captureRuntimeConfig(snapshot.config);
	const sourceEnv = { ...stateView.sourceEnv };
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const ctx = {
		mode: "lint",
		runtime,
		cfg,
		cwd: defaultAgentId ? resolveAgentWorkspaceDir(cfg, defaultAgentId) : process.cwd(),
		env: sourceEnv,
		allowExecSecretRefs: opts.allowExec === true,
		...snapshot.path !== void 0 ? { configPath: snapshot.path } : {}
	};
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-Nex_6rpM.mjs");
	const availabilityFindings = registerBundledHealthChecks({
		cfg,
		cwd: ctx.cwd,
		env: stateView.pluginMetadataEnv,
		runWithPluginStateSnapshot: stateView.runWithPluginStateSnapshot,
		updateReadiness: opts.updateReadiness
	});
	const registeredExtensionChecks = listExtensionHealthChecksForDoctor([], availabilityFindings);
	const onlyRegisteredExtensionChecks = opts.onlyIds !== void 0 && opts.onlyIds.length > 0 && opts.onlyIds.every((id) => registeredExtensionChecks.some((check) => check.id === id));
	let coreChecks = onlyRegisteredExtensionChecks ? [] : stateView.coreChecks;
	if (!coreChecks) {
		const { resolveDoctorContributionHealthChecks } = await import("./doctor-health-contributions-BNG0zGh_.mjs");
		coreChecks = await resolveDoctorContributionHealthChecks();
	}
	const extensionChecks = onlyRegisteredExtensionChecks ? registeredExtensionChecks : listExtensionHealthChecksForDoctor(coreChecks, availabilityFindings);
	const runWithPrivateStateSnapshot = async (run) => await stateView.runWithPluginStateSnapshot(async () => await run());
	const runWithSourceState = async (run) => opts.updateReadiness ? run() : withDoctorLintStateEnv(sourceEnv, run);
	const coreCtx = {
		...ctx,
		env: opts.updateReadiness ? stateView.pluginMetadataEnv : sourceEnv,
		lintConfigSnapshot: snapshot,
		deep: opts.deep === true,
		runWithPrivateStateSnapshot,
		runWithSourceState,
		deferInspectionDisposal: stateView.deferInspectionDisposal
	};
	const checks = [
		stateSchemaHealthCheck,
		...coreChecks.map((check) => withCoreLintContext(check, coreCtx, availabilityFindings)),
		...extensionChecks
	];
	const runOpts = {
		checks: opts.updateReadiness && opts.includeAllChecks !== true ? selectUpdateReadinessChecks(checks, opts.updateReadiness) : checks,
		includeAllChecks: opts.updateReadiness !== void 0 || opts.includeAllChecks === true,
		skipIds: [...opts.skipIds ?? [], ...stateView.deferredCheckIds ?? []],
		...opts.onlyIds && opts.onlyIds.length > 0 ? { onlyIds: opts.onlyIds } : {}
	};
	const result = await runDoctorLintChecks(ctx, runOpts);
	const detectedFindings = [...result.findings, ...coreChecks.filter((check) => stateView.deferredCheckIds?.has(check.id)).map((check) => ({
		checkId: check.id,
		source: "doctor",
		severity: "warning",
		errorCode: "update-inspection-deferred",
		requirement: "update-validation-scope",
		message: "Advisory inspection deferred until after update activation; required migration, config, plugin, and Gateway readiness checks remain enabled.",
		fixHint: `Run \`openclaw doctor --lint --only ${check.id}\` after activation to complete this inspection.`
	}))];
	const advisoryChecks = new Set(coreChecks.filter((check) => check.updateWork?.kind === "inspection" || check.updateWork?.kind === "standalone").map((check) => check.id));
	const findings = isUpdateDoctorLintPass(stateView.sourceEnv) ? detectedFindings.map((finding) => finding.severity === "error" && advisoryChecks.has(finding.checkId) ? {
		...finding,
		severity: "warning"
	} : finding) : detectedFindings;
	const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
	const warnings = findings.filter((finding) => !healthFindingMeetsSeverity(finding, sevMin) && (finding.errorCode === "OPENCLAW_STATE_LEASE_ABORTED" || isUpdateDoctorLintPass(stateView.sourceEnv) && finding.severity === "warning"));
	const exitCode = exitCodeFromFindings(findings, sevMin);
	return {
		checksRun: result.checksRun,
		checksSkipped: result.checksSkipped,
		exitCode,
		findings: visible,
		warnings,
		cleanupWarnings: stateView.cleanupWarnings,
		writeOutput() {
			if (detectDoctorLintOutputMode(opts) === "json") {
				writeJsonResult({
					ok: exitCode === 0,
					checksRun: result.checksRun,
					checksSkipped: result.checksSkipped,
					findings: visible,
					warnings: [...warnings, ...stateView.cleanupWarnings ?? []]
				});
				return;
			}
			const displayed = [
				...visible,
				...warnings,
				...stateView.cleanupWarnings ?? []
			];
			process.stdout.write(`doctor --lint: ran ${result.checksRun} check(s), ${displayed.length} finding(s)\n`);
			if (displayed.length === 0) {
				process.stdout.write("  no findings\n");
				return;
			}
			for (const f of displayed) {
				const where = f.path !== void 0 ? ` ${f.path}` : "";
				const line = f.line !== void 0 ? `:${f.line}` : "";
				process.stdout.write(`  [${f.severity}] ${f.checkId}${where}${line} - ${f.message}\n`);
				if (f.fixHint !== void 0) process.stdout.write(`    fix: ${f.fixHint}\n`);
			}
		}
	};
}
async function withReadOnlyPluginStateSnapshot(sourceEnv, run, cleanupWarnings) {
	const sourceDatabasePath = resolveOpenClawStateSqlitePath(sourceEnv);
	const captureStorage = Object.freeze({
		stateDir: getPluginSourceCaptureStorage()?.stateDir ?? resolveStateDir(sourceEnv),
		placement: "temporary"
	});
	let cleanup;
	let privateRoot;
	let prepared;
	try {
		if (fs.existsSync(sourceDatabasePath)) {
			prepared = prepareSqliteReadOnlyLocationSync(sourceDatabasePath);
			privateRoot = path.dirname(prepared.location);
			cleanup = prepared.cleanupAsync;
		} else {
			privateRoot = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-doctor-lint-state-"));
			cleanup = async () => {
				try {
					await fs.promises.rm(privateRoot, {
						force: true,
						recursive: true
					});
					return true;
				} catch {
					return false;
				}
			};
		}
	} catch (error) {
		throw new DoctorLintStateSnapshotError(error);
	}
	const privateStateDir = path.join(privateRoot, "openclaw-state");
	const inspection = artifactPreservingReads.getStore();
	if (inspection) inspection.privateRoots.add(privateStateDir);
	const privateDatabasePath = resolveOpenClawStateSqlitePath({
		...sourceEnv,
		OPENCLAW_STATE_DIR: privateStateDir
	});
	const privateEnv = {
		...sourceEnv,
		OPENCLAW_CONFIG_PATH: resolveConfigPath(sourceEnv, resolveStateDir(sourceEnv)),
		OPENCLAW_STATE_DIR: privateStateDir
	};
	return await withDoctorLintStateEnv(privateEnv, async () => {
		let outcome;
		let runStarted = false;
		try {
			fs.mkdirSync(path.dirname(privateDatabasePath), {
				recursive: true,
				mode: 448
			});
			if (prepared) for (const suffix of [
				"",
				"-journal",
				"-shm",
				"-wal"
			]) {
				const sourcePath = `${prepared.location}${suffix}`;
				if (fs.existsSync(sourcePath)) fs.renameSync(sourcePath, `${privateDatabasePath}${suffix}`);
			}
			const installRoots = resolvePluginInstallRoots(sourceEnv);
			outcome = {
				ok: true,
				value: await withPluginSourceCaptureStorage(captureStorage, () => withDisposableOpenClawStateReads(privateDatabasePath, () => withPluginInstallRoots({
					...installRoots,
					stateDir: privateStateDir
				}, async () => {
					runStarted = true;
					return await run(privateEnv);
				})))
			};
		} catch (error) {
			outcome = {
				ok: false,
				error
			};
		}
		try {
			const retirementErrors = [];
			try {
				closeAuthProfileReadPool({
					kind: "root",
					rootPath: privateStateDir
				});
			} catch (error) {
				retirementErrors.push(error);
			}
			try {
				await closeOpenClawStateDatabaseByPathAsync(privateDatabasePath);
			} catch (error) {
				retirementErrors.push(error);
			}
			if (retirementErrors.length > 0) throw new AggregateError(retirementErrors, retirementErrors.map((error) => scrubDoctorErrorMessage(error)).join("; "));
			if (!await cleanup()) {
				const message = "Temporary doctor lint state snapshot cleanup did not complete.";
				if (!cleanupWarnings) throw new Error(message);
				recordSnapshotCleanupWarning(cleanupWarnings);
			}
		} catch (error) {
			throw new DoctorLintStateSnapshotError(outcome.ok ? error : new AggregateError([outcome.error, error], `${scrubDoctorErrorMessage(outcome.error)}; ${scrubDoctorErrorMessage(error)}`));
		}
		if (!outcome.ok) throw runStarted ? outcome.error : new DoctorLintStateSnapshotError(outcome.error);
		return outcome.value;
	});
}
function recordSnapshotCleanupWarning(warnings) {
	warnings.push({
		checkId: "core/doctor/lint-state-inspection",
		severity: "warning",
		requirement: "temporary-snapshot-cleanup",
		message: "Temporary doctor lint state snapshot cleanup did not complete.",
		fixHint: "Rerun `openclaw doctor --lint` after the update to check snapshot cleanup."
	});
}
async function withDoctorLintStateEnv(env, run) {
	const stateDir = resolveStateDir(env);
	const overrides = {
		OPENCLAW_CONFIG_PATH: resolveConfigPath(env, stateDir),
		OPENCLAW_STATE_DIR: stateDir
	};
	const previous = Object.keys(overrides).map((key) => [key, process.env[key]]);
	Object.assign(process.env, overrides);
	try {
		return await run();
	} finally {
		for (const [key, value] of previous) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
	}
}
function withCoreLintContext(check, ctx, availabilityFindings) {
	return {
		...check,
		detect(_ctx, scope) {
			const detect = async () => [...await check.detect(ctx, scope), ...availabilityFindings.filter((finding) => finding.checkId === check.id)];
			const inspectPrivate = async (run) => {
				let completed;
				try {
					return await ctx.runWithPrivateStateSnapshot(async () => completed = await run());
				} catch (error) {
					if (!completed?.length || !(error instanceof DoctorLintStateSnapshotError)) throw error;
					return [...completed, createStateSnapshotFailureFinding(error)];
				}
			};
			if (check.id === SKILLS_READINESS_CHECK_ID) return inspectPrivate(() => ctx.runWithSourceState(detect));
			if (check.id === RUNTIME_TOOL_SCHEMA_CHECK_ID || check.id === PROJECT_CLONE_SHAPE_CHECK_ID) return inspectPrivate(detect);
			return check.id === AUTH_PROFILE_CHECK_ID ? ctx.runWithSourceState(detect) : detect();
		}
	};
}
//#endregion
export { collectDoctorFindings, runDoctorLintCliInProcess };
