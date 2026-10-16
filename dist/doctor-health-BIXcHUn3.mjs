import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { a as measureGatewayBootstrapStep } from "./startup-trace-D7hzafKJ.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-M64rViod.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { n as formatUpdateDoctorConfigChange } from "./update-doctor-config-BrLAVDg0.mjs";
import { u as isUpdateDoctorLintPass } from "./update-phase-BClSJ17n.mjs";
import { a as UpdateDoctorError, b as writeUpdatePostInstallDoctorResult, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, m as normalizeUpdatePostInstallDoctorWarnings, s as captureUpdateDoctorConfigWrites, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-yVslo54h.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-DuSgsySH.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { n as withDeferredDebugProxyCapture } from "./runtime-deferral-Bdhp4T3g.mjs";
import { n as withPluginLoadDiagnostics } from "./load-diagnostics-ue2aSd6P.mjs";
import { n as retainUpdateDoctorProcesses } from "./update-doctor-process-custody-TVsWXnbG.mjs";
import { r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import { n as retainCurrentDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-Bi1cLcKC.mjs";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-W3I4YQ3X.mjs";
import { intro, outro } from "@clack/prompts";
//#region src/flows/doctor-health-update-result.ts
async function publishDoctorUpdateResult(params) {
	const { updateResult, doctorResult, healthContext, maintenance } = params;
	for (const change of updateResult.capture.configChanges) createSubsystemLogger("update").warn(formatUpdateDoctorConfigChange(change));
	const contributionWarnings = healthContext?.updateWarnings ?? [];
	const deferredCount = healthContext?.updateBudget?.deferred.size ?? 0;
	const warnings = await retainCurrentDeferredPluginMigrationWarnings(normalizeUpdatePostInstallDoctorWarnings([
		...contributionWarnings.slice(0, deferredCount),
		...doctorResult.warnings ?? [],
		...(maintenance?.warnings ?? []).filter((warning) => !doctorResult.warnings?.includes(warning)),
		...contributionWarnings.slice(deferredCount)
	]));
	const outcome = { ...doctorResult };
	delete outcome.warnings;
	await writeUpdatePostInstallDoctorResult({
		resultPath: updateResult.resultPath,
		result: {
			...outcome,
			...maintenance?.databaseWrites ? { databaseWrites: maintenance.databaseWrites } : {},
			...updateResult.capture.fileWrites ? { configFileWrites: updateResult.capture.fileWrites } : {},
			...warnings.length ? { warnings } : {},
			...updateResult.capture.configChanges.length ? { configChanges: updateResult.capture.configChanges } : {},
			...updateResult.capture.configWriteRefusal ? { configWriteRefusal: updateResult.capture.configWriteRefusal } : {},
			configHash: updateResult.capture.hash,
			...updateResult.capture.inputHash === void 0 ? {} : { configInputHash: updateResult.capture.inputHash }
		}
	});
}
//#endregion
//#region src/flows/doctor-health.ts
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
/** Runs the full interactive doctor flow against the provided or default runtime. */
async function runDoctorHealthFlow(runtime, options = {}, writeAuthority, databasePreflight) {
	try {
		var _usingCtx$1 = _usingCtx();
		const custody = _usingCtx$1.u(await retainUpdateDoctorProcesses(writeAuthority?.assertCurrent, writeAuthority?.commandAuthority));
		const run = () => withDeferredDebugProxyCapture(async (resumeCapture) => {
			let preparedPreflight = databasePreflight;
			const preCaptureRehearsalRoot = !writeAuthority?.postCoreSchemaRepair && (options.repair === true || options.yes === true) ? resolveUpdateRehearsalRoot(process.env) : void 0;
			if (process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" && !writeAuthority?.postCoreSchemaRepair) {
				const { guardUpdateDoctorSchemaUpgrade, rehearseDeferredUpdateDoctorSchema } = await import("./commands/doctor-update-schema-guard.js");
				const guarded = await guardUpdateDoctorSchemaUpgrade({
					schemas: preparedPreflight,
					runtime,
					json: options.json,
					statePublicationOnly: preCaptureRehearsalRoot !== void 0
				});
				if (!preCaptureRehearsalRoot) preparedPreflight = guarded ?? preparedPreflight;
				if (!preCaptureRehearsalRoot && preparedPreflight?.updateSchemaRehearsal) {
					await rehearseDeferredUpdateDoctorSchema(preparedPreflight, runtime);
					return;
				}
			}
			const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
			return withPluginLoadDiagnostics((diagnostics) => {
				const runDoctor = (capture) => runDoctorHealthFlowWithResult(runtime, options, preparedPreflight, diagnostics, resultPath && capture ? {
					resultPath,
					capture
				} : void 0, writeAuthority, resumeCapture, preCaptureRehearsalRoot);
				return resultPath ? captureUpdateDoctorConfigWrites(resolveConfigPath(), runDoctor, writeAuthority) : runDoctor();
			});
		});
		return await (custody ? withCommandProcessScope(run, void 0, custody) : run());
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function runDoctorHealthFlowWithResult(runtime, options, databasePreflight, diagnostics, updateResult, writeAuthority, resumeCapture, preCaptureRehearsalRoot) {
	const { prepareDoctorHealthFlow } = await import("./doctor-health-startup-CF6lKsRs.mjs");
	const { effectiveRuntime, repairRuntime, stateDirExistedAtStart, root } = await prepareDoctorHealthFlow(runtime, options, intro$1);
	let maintenance;
	let sqliteNoCowPaths = [];
	let sqliteReclamationAgents;
	let exitCode;
	let healthContext;
	let preparedArchiveDiscovery;
	let doctorResult = { status: "error" };
	const recordConfigWriteRefusal = (ctx) => {
		if (!ctx.configWriteRefusal) return false;
		outro$1(ctx.configResultWriteCommitted === true ? "Doctor finished, but some config fixes were not applied." : "Doctor finished, but config fixes were not applied.");
		exitCode = 1;
		doctorResult = {
			status: "error",
			failureFacts: [createUpdateFailureFact({
				check: "config-write",
				code: ctx.configWriteRefusal,
				message: "Doctor config fixes were not applied."
			})]
		};
		return true;
	};
	try {
		if (options.repair === true || options.yes === true) {
			try {
				const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-DMPS_nAI.mjs");
				preparedArchiveDiscovery = (databasePreflight ?? await prepareDoctorDatabasePreflight()).agentDatabaseMigrationDiscovery;
				if (preparedArchiveDiscovery) {
					const { prepareCanonicalTranscriptArchiveMigrations } = await import("./state-migrations.transcript-directives-archives-dWBVOhQO.mjs");
					await prepareCanonicalTranscriptArchiveMigrations(preparedArchiveDiscovery);
				}
			} catch (error) {
				effectiveRuntime.log(`Archive verification preparation deferred: ${String(error)}`);
			}
			const { waitForCliSignalExit } = await import("./signal-exit-barrier-ic1Br9uM.mjs");
			await waitForCliSignalExit();
		}
		const [{ beginDoctorMaintenance }, { createDoctorOriginalCaptureHook }] = await Promise.all([import("./doctor-maintenance-VHedKsfD.mjs"), import("./doctor-original-capture-admission-DX0cCnPU.mjs")]);
		maintenance = await measureGatewayBootstrapStep("doctor.maintenance.begin", () => beginDoctorMaintenance({
			options,
			root,
			runtime: repairRuntime,
			assertCurrent: writeAuthority?.assertCurrent,
			databaseGenerations: writeAuthority?.databaseGenerations,
			beforeStateMutation: createDoctorOriginalCaptureHook({
				root,
				runtime: repairRuntime,
				writeAuthority,
				rehearsalRoot: preCaptureRehearsalRoot,
				json: options.json
			})
		}));
		const runChecks = async () => {
			const doctorRuntime = maintenance ? repairRuntime : effectiveRuntime;
			const { createDoctorPrompter } = await import("./doctor-prompter-Br7mQqSr.mjs");
			const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-DMPS_nAI.mjs");
			const prompter = createDoctorPrompter({
				runtime: doctorRuntime,
				options,
				signal: maintenance?.signal
			});
			if (!maintenance) {
				if (!databasePreflight) await prepareDoctorDatabasePreflight({ scope: "state" });
				const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-B2TDHBKY.mjs");
				if ((await maybeOfferUpdateBeforeDoctor({
					options,
					root,
					confirm: (p) => prompter.confirm(p),
					outro: outro$1
				})).handled) return;
			}
			const refreshRecoveryInventory = maintenance && databasePreflight?.agentDatabaseMigrationDiscovery?.discovery.deletionJournal.status === "unavailable";
			let schemas = databasePreflight && !refreshRecoveryInventory ? databasePreflight : await measureGatewayBootstrapStep("doctor.database-preflight", () => prepareDoctorDatabasePreflight());
			const { recordAgentDatabaseAdmissions } = await import("./agent-database-admission-eMQLBZza.mjs");
			if (options.repair !== true && options.yes !== true) recordAgentDatabaseAdmissions(schemas.agentRefusals ?? []);
			const { guardUpdateDoctorSchemaUpgrade } = await import("./commands/doctor-update-schema-guard.js");
			let verifiedSnapshots = [];
			await guardUpdateDoctorSchemaUpgrade({
				schemas,
				runtime: doctorRuntime,
				json: options.json,
				postCoreSchemaRepair: writeAuthority?.postCoreSchemaRepair,
				onVerifiedBackup: (snapshots) => {
					verifiedSnapshots = snapshots;
				}
			});
			if (maintenance && (options.repair === true || options.yes === true)) {
				const { repairOpenClawStateDatabaseIndexesForDoctor, repairOpenClawStateDatabaseReadabilityForDoctor } = await import("./openclaw-state-db-Dwulrh8X.mjs");
				let repairedState = false;
				for (const repair of [repairOpenClawStateDatabaseIndexesForDoctor, repairOpenClawStateDatabaseReadabilityForDoctor]) {
					const result = repair({ env: process.env });
					repairedState ||= result.changes.length > 0;
					if (result.warnings.length > 0) throw new Error(result.warnings.join("\n"));
					for (const change of result.changes) effectiveRuntime.log(change);
				}
				if (repairedState) schemas = await prepareDoctorDatabasePreflight();
				const { backupDoctorMigrationDatabases } = await import("./doctor-migration-backup-C-CKdISb.mjs");
				const { createOpenClawAgentDatabasePathMatcher } = await import("./openclaw-agent-db.paths-D1UM__eS.mjs");
				const { normalizeAgentId } = await import("./session-key-DSoNakq1.mjs");
				const samePath = createOpenClawAgentDatabasePathMatcher();
				const discovery = schemas.agentDatabaseMigrationDiscovery?.discovery;
				const databasePaths = discovery?.targets.filter((database) => !schemas.agentRefusals?.some((refusal) => normalizeAgentId(refusal.agentId) === normalizeAgentId(database.agentId) && refusal.paths.some((pathname) => samePath(pathname, database.path))) && !schemas.indeterminate.some((failure) => failure.kind === "agent" && (failure.path === database.path || discovery.sourceIdentities.get(failure.path)?.realPath === database.realPath))).map((database) => database.path);
				const backups = await backupDoctorMigrationDatabases({
					env: process.env,
					databasePaths: databasePaths ?? [],
					pendingDatabasePaths: schemas.pendingMigrations?.map((database) => database.path) ?? [],
					verifiedSnapshots
				});
				for (const change of backups.changes) effectiveRuntime.log(change);
				for (const warning of backups.warnings) effectiveRuntime.log(warning);
			}
			const { repairDoctorAgentDeletionJournal } = await import("./doctor-agent-deletion-journal-BLiPXfGm.mjs");
			const deletionJournal = await repairDoctorAgentDeletionJournal({
				preflight: schemas,
				shouldRepair: prompter.shouldRepair,
				env: process.env
			});
			for (const message of deletionJournal.changes) effectiveRuntime.log(message);
			for (const message of deletionJournal.warnings) effectiveRuntime.log(message);
			if (deletionJournal.changes.length > 0) schemas = await prepareDoctorDatabasePreflight();
			const { inspectDoctorSqliteNoCow } = await import("./doctor-sqlite-nocow-BXYxRWfs.mjs");
			const { resolveOpenClawStateSqlitePath } = await import("./openclaw-state-db.paths-BEzdbteY.mjs");
			const nocow = inspectDoctorSqliteNoCow([resolveOpenClawStateSqlitePath(), ...schemas.agentDatabaseMigrationDiscovery?.discovery.targets.map((target) => target.path) ?? []]);
			sqliteNoCowPaths = nocow.paths;
			for (const message of nocow.notes) doctorRuntime.log(message);
			const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-BfFIB3wf.mjs");
			const { noteSourceInstallIssues } = await import("./doctor-install-D6_hbA6u.mjs");
			const { noteBunCliLauncherIssues } = await import("./doctor-bun-cli-launcher-aPmyFXaQ.mjs");
			const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-czOcvGcm.mjs");
			const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-BxpYx9i6.mjs");
			await maybeRepairUiProtocolFreshness(doctorRuntime, prompter);
			await noteSourceInstallIssues(root);
			await noteBunCliLauncherIssues({
				root,
				prompter
			});
			await noteStalePluginRuntimeSymlinks(root);
			noteStartupOptimizationHints();
			const discovery = schemas.agentDatabaseMigrationDiscovery;
			if (discovery && discovery.stateDir === preparedArchiveDiscovery?.stateDir) discovery.preparedTranscriptArchives = preparedArchiveDiscovery?.preparedTranscriptArchives;
			const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-BfIEEBgj.mjs");
			const configResult = await measureGatewayBootstrapStep("doctor.config-flow", () => loadAndMaybeMigrateDoctorConfig({
				options,
				agentDatabaseMigrationDiscovery: schemas.agentDatabaseMigrationDiscovery,
				confirm: (p) => prompter.confirm(p),
				runtime: doctorRuntime,
				prompter
			}));
			const admissionSchemas = schemas.agentDatabaseMigrationDiscovery && schemas.agentDatabaseMigrationDiscovery.stateDir !== resolveStateDir() ? await prepareDoctorDatabasePreflight({ cfg: configResult.cfg }) : schemas;
			const recoveredPaths = new Set(configResult.stateMigrationStepReceipts?.flatMap((receipt) => receipt.id === "media-persistence" ? receipt.recoveredAgentDatabasePaths ?? [] : []));
			const sourceIdentities = admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.sourceIdentities;
			const agentDatabaseRefusals = (admissionSchemas.agentRefusals ?? []).filter((refusal) => !refusal.paths.every((pathname) => recoveredPaths.has(pathname) || recoveredPaths.has(sourceIdentities?.get(pathname)?.realPath ?? pathname)));
			recordAgentDatabaseAdmissions(agentDatabaseRefusals);
			const { CONFIG_PATH } = await loadConfigModule();
			const ctx = {
				runtime: doctorRuntime,
				options,
				prompter,
				configResult,
				cfg: configResult.cfg,
				cfgForPersistence: structuredClone(configResult.cfg),
				sourceConfigValid: configResult.sourceConfigValid ?? true,
				configPath: configResult.path ?? CONFIG_PATH,
				stateDirExistedAtStart,
				gatewayMaintenanceActive: maintenance !== void 0,
				agentDatabaseRefusals,
				updateWarnings: deletionJournal.warnings,
				preparedAgentCount: Math.max(admissionSchemas.agentDatabaseMigrationDiscovery?.configuredAgentDatabaseTargets.length ?? 0, admissionSchemas.agentDatabaseMigrationDiscovery?.registeredAgentDatabases.length ?? 0),
				runWithPluginMetadataSnapshot: configResult.runWithPluginMetadataSnapshot,
				invalidatePluginMetadataSnapshot: configResult.invalidatePluginMetadataSnapshot
			};
			healthContext = ctx;
			const { runDoctorHealthContributions } = await import("./doctor-health-contributions-DYEd7giY.mjs");
			await measureGatewayBootstrapStep("doctor.contributions", () => runDoctorHealthContributions(ctx));
			if (recordConfigWriteRefusal(ctx)) return;
			if (options.repair === true || options.yes === true) {
				const { validateDoctorExternalConfigForStartup } = await import("./doctor-external-config-BvkVQMKv.mjs");
				if (!await validateDoctorExternalConfigForStartup(effectiveRuntime)) {
					exitCode = 1;
					return;
				}
				const { assertDoctorMaintenanceReady } = await import("./doctor-maintenance-inspection-vral2Fmr.mjs");
				if (!(await measureGatewayBootstrapStep("doctor.maintenance-ready", () => assertDoctorMaintenanceReady(ctx.cfg, process.env, effectiveRuntime.log, admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.targets ?? []))).schemaPublicationDeferred) {
					sqliteReclamationAgents = admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.targets ?? [];
					resumeCapture?.();
					if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_PROXY_ENABLED)) {
						const { initializeDebugProxyCaptureAsync } = await import("./runtime-2lyKvCKF.mjs");
						await initializeDebugProxyCaptureAsync("cli");
					}
				}
				const { repairGatewayMaintenanceStartupFailures } = await import("./gateway-boot-lifecycle-DwV0DJ2w.mjs");
				repairGatewayMaintenanceStartupFailures();
			}
			return ctx;
		};
		let ctx;
		let failure;
		try {
			ctx = await (maintenance ? maintenance.run(runChecks) : runChecks());
			if (ctx && maintenance && options.repair === true && sqliteNoCowPaths.length > 0) {
				if (resolveDoctorRepairMode(options).updateInProgress && !isTruthyEnvValue(process.env["OPENCLAW_DOCTOR_SQLITE_NOCOW_REPAIR"])) effectiveRuntime.log("SQLite NOCOW repair deferred: the managed updater did not request the store rewrite in this run.");
				else await maintenance.repairSqliteNoCow(sqliteNoCowPaths);
			}
			if (ctx && maintenance && ctx.prompter.shouldRepair) {
				if (isDoctorUpdateRepairMode(ctx.prompter.repairMode) && sqliteReclamationAgents) await maintenance.enableSqliteReclamation(sqliteReclamationAgents);
				await maintenance.cleanupRetainedRuntimes();
			}
		} catch (error) {
			failure = error;
			throw error;
		} finally {
			const activeMaintenance = maintenance;
			if (activeMaintenance) {
				const completed = ctx;
				await measureGatewayBootstrapStep("doctor.maintenance.finish", () => activeMaintenance.finish(completed?.cfg, completed ? async (nextConfig) => {
					const { writeDoctorGatewayConfig } = await import("./doctor-health-contribution-runners.gateway-jhullIda.mjs");
					return writeDoctorGatewayConfig(completed, nextConfig);
				} : void 0, failure));
			}
		}
		if (!ctx || recordConfigWriteRefusal(ctx)) return;
		const pluginWarnings = [];
		if (diagnostics.length > 0) {
			const { collectPluginLoadHealthFindings } = await import("./doctor-workspace-status-DWZ602cI.mjs");
			const { renderStructuredHealthFindings } = await import("./doctor-health-contribution-C3vEf6a8.mjs");
			const findings = collectPluginLoadHealthFindings(diagnostics);
			renderStructuredHealthFindings(ctx, findings);
			pluginWarnings.push(...findings.map((finding) => `${finding.checkId}: ${finding.message}`));
		}
		const warnings = normalizeUpdatePostInstallDoctorWarnings([
			...pluginWarnings,
			...ctx.configResult.warnings ?? [],
			...maintenance?.warnings ?? [],
			...(ctx.configResult.stateMigrationStepReceipts ?? []).flatMap((receipt) => receipt.outcome === "warning" || receipt.outcome === "skipped" || receipt.outcome === "deferred" ? receipt.warnings : []),
			...ctx.postInstallDoctorResult?.warnings ?? []
		]);
		doctorResult = {
			...ctx.postInstallDoctorResult ?? { status: "ok" },
			...warnings.length ? { warnings } : {},
			...maintenance?.failureFacts?.length ? { failureFacts: [...maintenance.failureFacts, ...ctx.postInstallDoctorResult?.failureFacts ?? []] } : {}
		};
		if (updateResult && doctorResult.status === "advisory") {
			exitCode = 86;
			return;
		}
		if (pluginWarnings.length > 0) {
			outro$1("Doctor finished with plugin load errors.");
			if (options.nonInteractive && !isUpdateDoctorLintPass(process.env)) exitCode = 1;
			return;
		}
	} catch (error) {
		if (!maintenance && error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred" && isDoctorUpdateRepairMode(resolveDoctorRepairMode(options))) {
			writeAuthority?.assertCurrent();
			const { recordUpdateDoctorRefusal } = await import("./doctor-update-refusal-DXfRrMwo.mjs");
			recordUpdateDoctorRefusal(error.message);
			effectiveRuntime.error(error.message);
			doctorResult = {
				status: "ok",
				warnings: [error.message],
				maintenanceRefusal: error.refusal
			};
			const runId = process.env.OPENCLAW_UPDATE_RUN_ID?.trim();
			if (!updateResult && runId) try {
				const { recordUpdateRunStep } = await import("./update-run-ledger-D0iBe9hy.mjs");
				recordUpdateRunStep(runId, {
					step: "warning:doctor-maintenance",
					status: "completed",
					endedAtMs: Date.now(),
					detail: error.message
				});
			} catch {
				effectiveRuntime.error("Doctor maintenance warning could not be saved to update history.");
			}
			outro$1("Doctor maintenance deferred; pending repairs remain unchanged.");
			exitCode = 0;
			return;
		}
		const { DoctorStateMigrationRefusalError } = await import("./state-migrations.messages-CHAbDmBr.mjs");
		const refusalWarnings = error instanceof DoctorStateMigrationRefusalError ? error.failureFacts.map(formatUpdateFailureFact) : [];
		if (healthContext && refusalWarnings.length > 0) {
			const { recordDoctorHealthWarnings } = await import("./doctor-health-contribution-C3vEf6a8.mjs");
			recordDoctorHealthWarnings(healthContext, [], refusalWarnings, { prepend: true });
		}
		if (error instanceof DoctorStateMigrationRefusalError) {
			const { recordUpdateDoctorRefusal, resolveUpdateDoctorGitRecovery } = await import("./doctor-update-refusal-DXfRrMwo.mjs");
			const recovery = await resolveUpdateDoctorGitRecovery({
				root,
				stateRepaired: true
			});
			if (recovery) {
				error.message += `\n${recovery.message}`;
				recordUpdateDoctorRefusal(error.message);
			}
		}
		const causes = collectNestedErrorCandidates(error);
		const { classifyDoctorMaintenanceRefusal } = await import("./doctor-maintenance-inspection-vral2Fmr.mjs");
		const maintenanceRefusal = classifyDoctorMaintenanceRefusal(error);
		const unsafeConfigWrite = causes.find((cause) => cause instanceof ConfigWritePostCommitError && cause.rollbackStatus !== "restored");
		const schemaRefusal = causes.find((cause) => cause instanceof UpdateSchemaRefusalError);
		const refusalFacts = causes.flatMap((cause) => cause instanceof UpdateDoctorError || cause instanceof DoctorStateMigrationRefusalError ? cause.failureFacts : []);
		doctorResult = {
			status: "error",
			...maintenanceRefusal.kind === "data-at-risk" ? { maintenanceRefusal } : {},
			...!healthContext && refusalWarnings.length > 0 ? { warnings: refusalWarnings } : {},
			failureFacts: !unsafeConfigWrite && !schemaRefusal && refusalFacts.length > 0 ? refusalFacts : [createUpdateFailureFact({
				check: unsafeConfigWrite ? "config-write" : schemaRefusal ? "database-schema-preflight" : "doctor",
				code: unsafeConfigWrite ? "rollback-state-unverified" : schemaRefusal?.code ?? "doctor-failed",
				message: unsafeConfigWrite ? `${unsafeConfigWrite.publication} config publication; rollback ${unsafeConfigWrite.rollbackStatus}. ${unsafeConfigWrite.message}` : schemaRefusal?.message ?? (error instanceof Error ? error.message : String(error))
			})]
		};
		if (maintenance && !(error instanceof DoctorStateMigrationRefusalError)) effectiveRuntime.error("Doctor could not complete maintenance. Check the reported service state and resolve the failure.");
		throw error;
	} finally {
		try {
			await measureGatewayBootstrapStep("doctor.maintenance.release", async () => {
				await maintenance?.release();
			});
		} finally {
			if (updateResult) await publishDoctorUpdateResult({
				updateResult,
				doctorResult,
				healthContext,
				maintenance
			});
		}
		if (exitCode !== void 0) effectiveRuntime.exit(exitCode);
	}
	outro$1("Doctor complete.");
}
//#endregion
export { runDoctorHealthFlow };
