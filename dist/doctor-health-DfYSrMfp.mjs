import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { a as measureGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-C8zbzbYZ.mjs";
import { n as formatUpdateFailureFact } from "./update-failure-facts-format-DbAtk-ZC.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { S as writeUpdatePostInstallDoctorResult, c as captureUpdateDoctorConfigWrites, h as normalizeUpdatePostInstallDoctorWarnings, i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, o as UpdateDoctorError, t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { n as withDeferredDebugProxyCapture } from "./runtime-deferral-Bdhp4T3g.mjs";
import { n as withPluginLoadDiagnostics } from "./load-diagnostics-CkJULaNY.mjs";
import { n as formatUpdateDoctorConfigChange } from "./update-doctor-config-BrLAVDg0.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
import { n as retainCurrentDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-DinUPp8o.mjs";
import { n as retainUpdateDoctorProcesses } from "./update-doctor-process-custody-15rJBSoi.mjs";
import { n as resolveDoctorRepairMode, t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-CGb0a8nw.mjs";
import { o as showDoctorIntro, s as showDoctorOutro, t as exitDoctorHealthFlow } from "./doctor-health-startup-jIlY6MJm.mjs";
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
	delete outcome.deferredInspectionCheckIds;
	await writeUpdatePostInstallDoctorResult({
		resultPath: updateResult.resultPath,
		result: {
			...outcome,
			...updateResult.capture.deferredInspectionCheckIds ? { deferredInspectionCheckIds: updateResult.capture.deferredInspectionCheckIds } : {},
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
/** Runs the full interactive doctor flow against the provided or default runtime. */
async function runDoctorHealthFlow(runtime, options = {}, writeAuthority, databasePreflight) {
	try {
		var _usingCtx$1 = _usingCtx();
		const custody = _usingCtx$1.u(await retainUpdateDoctorProcesses(writeAuthority?.assertCurrent, writeAuthority?.commandAuthority));
		let requestedExit;
		const run = () => withDeferredDebugProxyCapture(async (resumeCapture) => {
			let preparedPreflight = databasePreflight;
			const preserveSourceArtifacts = writeAuthority?.databaseGenerations ? true : void 0;
			const preCaptureRehearsalRoot = !writeAuthority?.postCoreSchemaRepair && (options.repair === true || options.yes === true) ? resolveUpdateRehearsalRoot(process.env) : void 0;
			if (process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" && !writeAuthority?.postCoreSchemaRepair) {
				const { guardUpdateDoctorSchemaUpgrade, rehearseDeferredUpdateDoctorSchema } = await import("./commands/doctor-update-schema-guard.js");
				const guarded = await guardUpdateDoctorSchemaUpgrade({
					schemas: preparedPreflight,
					runtime,
					json: options.json,
					statePublicationOnly: preCaptureRehearsalRoot !== void 0,
					preserveSourceArtifacts
				});
				if (!preCaptureRehearsalRoot) preparedPreflight = guarded ?? preparedPreflight;
				if (!preCaptureRehearsalRoot && preparedPreflight?.updateSchemaRehearsal) {
					await rehearseDeferredUpdateDoctorSchema(preparedPreflight, runtime);
					return;
				}
			}
			const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
			return withPluginLoadDiagnostics((diagnostics) => {
				const runDoctor = (capture) => runDoctorHealthFlowWithResult((selectedRuntime, code) => {
					requestedExit = () => exitDoctorHealthFlow(selectedRuntime, code);
				}, runtime, options, preparedPreflight, diagnostics, resultPath && capture ? {
					resultPath,
					capture
				} : void 0, writeAuthority, resumeCapture, preCaptureRehearsalRoot);
				return resultPath ? captureUpdateDoctorConfigWrites(resolveConfigPath(), runDoctor, writeAuthority) : runDoctor();
			});
		});
		const { withPluginGenerationSourceCustody } = await import("./plugin-generation-source-lookup-DeFbtALP.mjs");
		await withPluginGenerationSourceCustody(() => custody ? withCommandProcessScope(run, void 0, custody) : run());
		requestedExit?.();
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function runDoctorHealthFlowWithResult(requestExit, runtime, options, databasePreflight, diagnostics, updateResult, writeAuthority, resumeCapture, preCaptureRehearsalRoot) {
	try {
		var _usingCtx3 = _usingCtx();
		const { prepareDoctorHealthFlow, prepareDoctorInteractiveMaintenance, prepareDoctorMaintenanceArchives, prepareDoctorStateSchema } = await import("./doctor-health-startup-CDDU5VZh.mjs");
		const { effectiveRuntime, repairRuntime, stateDirExistedAtStart, root } = await prepareDoctorHealthFlow(runtime, options, showDoctorIntro);
		let maintenance;
		let sqliteNoCowPaths = [];
		const preflightOptions = { preserveSourceArtifacts: writeAuthority?.databaseGenerations ? true : void 0 };
		let sqliteReclamationAgents;
		let exitCode;
		let healthContext;
		let preparedArchiveDiscovery;
		let doctorResult = { status: "error" };
		const recordRepairRefusal = (ctx) => {
			if (!ctx.configWriteRefusal) {
				if (ctx.postInstallDoctorResult?.status !== "error") return false;
				showDoctorOutro("Doctor blocked; required repairs remain incomplete.");
				exitCode = 1;
				doctorResult = ctx.postInstallDoctorResult;
				return true;
			}
			showDoctorOutro(ctx.configResultWriteCommitted === true ? "Doctor finished, but some config fixes were not applied." : "Doctor finished, but config fixes were not applied.");
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
		const repairMode = resolveDoctorRepairMode(options);
		let interactiveRepair = false;
		let updateAdmissionComplete = false;
		if (repairMode.canPrompt && !repairMode.shouldRepair) {
			const admission = await prepareDoctorInteractiveMaintenance({
				runtime: effectiveRuntime,
				options,
				databasePreflight,
				root,
				outro: showDoctorOutro
			});
			if (admission !== "accepted") {
				if (admission !== "handled") requestExit(effectiveRuntime, admission.diagnosticExitCode);
				return;
			}
			interactiveRepair = true;
			updateAdmissionComplete = true;
		}
		const resources = _usingCtx3.a(new AsyncDisposableStack());
		resources.defer(async () => maintenance?.release());
		try {
			const { assertDoctorRetiredStateAdmission } = await import("./doctor-retired-state-admission-BWCB1BS6.mjs");
			assertDoctorRetiredStateAdmission();
			if (options.repair === true || options.yes === true || interactiveRepair) preparedArchiveDiscovery = await prepareDoctorMaintenanceArchives(databasePreflight, effectiveRuntime, preflightOptions);
			const [{ beginDoctorMaintenance }, { createDoctorOriginalCaptureHook }] = await Promise.all([import("./doctor-maintenance-eL8AysZq.mjs"), import("./doctor-original-capture-admission-kgkhJfdZ.mjs")]);
			maintenance = await measureGatewayBootstrapStep("doctor.maintenance.begin", () => beginDoctorMaintenance({
				options,
				interactiveRepair,
				root,
				runtime: repairRuntime,
				assertCurrent: writeAuthority?.assertCurrent,
				databaseGenerations: writeAuthority?.databaseGenerations,
				databaseWriteCapture: writeAuthority?.databaseWriteCapture,
				serviceInspectionDeadlineAtMs: writeAuthority?.serviceInspectionDeadlineAtMs,
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
				const { createDoctorPrompter } = await import("./doctor-prompter-CP6ANN7m.mjs");
				const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-D2a0BEQu.mjs");
				const prompter = createDoctorPrompter({
					runtime: doctorRuntime,
					options,
					signal: maintenance?.signal
				});
				if (!maintenance && !updateAdmissionComplete) {
					if (!databasePreflight) await prepareDoctorDatabasePreflight({ scope: "state" });
					const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-CheGXRC6.mjs");
					if ((await maybeOfferUpdateBeforeDoctor({
						options,
						root,
						confirm: (p) => prompter.confirm(p),
						outro: showDoctorOutro
					})).handled) return;
				}
				const refreshRecoveryInventory = maintenance && databasePreflight?.agentDatabaseMigrationDiscovery?.discovery.deletionJournal.status === "unavailable";
				let schemas = databasePreflight && !refreshRecoveryInventory ? databasePreflight : await measureGatewayBootstrapStep("doctor.database-preflight", () => prepareDoctorDatabasePreflight(preflightOptions));
				const { recordAgentDatabaseAdmissions } = await import("./agent-database-admission-0YPxJQR-.mjs");
				if (options.repair !== true && options.yes !== true) recordAgentDatabaseAdmissions(schemas.agentRefusals ?? []);
				const { guardUpdateDoctorSchemaUpgrade } = await import("./commands/doctor-update-schema-guard.js");
				let verifiedSnapshots = schemas.verifiedSnapshots ?? [];
				await guardUpdateDoctorSchemaUpgrade({
					schemas,
					runtime: doctorRuntime,
					json: options.json,
					postCoreSchemaRepair: writeAuthority?.postCoreSchemaRepair,
					signal: maintenance?.signal,
					onVerifiedBackup: (snapshots) => {
						verifiedSnapshots = snapshots;
					}
				});
				if (maintenance && (options.repair === true || options.yes === true)) {
					const { repairOpenClawStateDatabaseIndexesForDoctor, repairOpenClawStateDatabaseReadabilityForDoctor } = await import("./openclaw-state-db-C_MWM4sr.mjs");
					let repairedState = false;
					for (const repair of [repairOpenClawStateDatabaseIndexesForDoctor, repairOpenClawStateDatabaseReadabilityForDoctor]) {
						const result = repair({ env: process.env });
						repairedState ||= result.changes.length > 0;
						if (result.warnings.length > 0) throw new Error(result.warnings.join("\n"));
						for (const change of result.changes) effectiveRuntime.log(change);
					}
					if (repairedState) schemas = await prepareDoctorDatabasePreflight();
				}
				if (maintenance) {
					const { prepareDoctorDatabaseMigrations } = await import("./doctor-schema-migrations-bHtq3T3Z.mjs");
					const { createOpenClawAgentDatabasePathMatcher } = await import("./openclaw-agent-db.paths-CIJftpgq.mjs");
					const { normalizeAgentId } = await import("./session-key-BhGY8nZT.mjs");
					const samePath = createOpenClawAgentDatabasePathMatcher();
					const discovery = schemas.agentDatabaseMigrationDiscovery?.discovery;
					const databaseTargets = discovery?.schemaTargets.filter(({ agentId, path: databasePath, realPath }) => !schemas.agentRefusals?.some((refusal) => normalizeAgentId(refusal.agentId) === normalizeAgentId(agentId) && refusal.paths.some((pathname) => samePath(pathname, databasePath))) && !schemas.indeterminate.some((failure) => failure.kind === "agent" && (failure.path === databasePath || discovery.sourceIdentities.get(failure.path)?.realPath === realPath)));
					const backups = await prepareDoctorDatabaseMigrations({
						env: process.env,
						databasePaths: databaseTargets?.map((database) => database.path) ?? [],
						agentDatabaseTargets: databaseTargets,
						pendingDatabasePaths: schemas.pendingMigrations?.map((database) => database.path) ?? [],
						pendingMigrations: schemas.pendingMigrations,
						verifiedSnapshots
					});
					for (const message of [...backups.changes, ...backups.warnings]) effectiveRuntime.log(message);
					if (schemas.agentDatabaseMigrationDiscovery && backups.versionMigrations) schemas.agentDatabaseMigrationDiscovery.versionMigrations = backups.versionMigrations;
				}
				const stateSchemaPreparation = await prepareDoctorStateSchema(schemas, prompter.shouldRepair);
				const { repairDoctorAgentDeletionJournal } = await import("./doctor-agent-deletion-journal-yihqiJAK.mjs");
				const deletionJournal = await repairDoctorAgentDeletionJournal({
					preflight: schemas,
					shouldRepair: prompter.shouldRepair,
					env: process.env
				});
				for (const message of [...deletionJournal.changes, ...deletionJournal.warnings]) effectiveRuntime.log(message);
				if (deletionJournal.changes.length > 0) schemas = await prepareDoctorDatabasePreflight();
				const { inspectDoctorSqliteNoCow } = await import("./doctor-sqlite-nocow-Dkwyfd3K.mjs");
				const { resolveOpenClawStateSqlitePath } = await import("./openclaw-state-db.paths-DOpcSToL.mjs");
				const nocow = inspectDoctorSqliteNoCow([resolveOpenClawStateSqlitePath(), ...schemas.agentDatabaseMigrationDiscovery?.discovery.targets.map((target) => target.path) ?? []]);
				sqliteNoCowPaths = nocow.paths;
				for (const message of nocow.notes) doctorRuntime.log(message);
				const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-CJUTxVjn.mjs");
				const { noteSourceInstallIssues } = await import("./doctor-install-DrfueCM8.mjs");
				const { noteBunCliLauncherIssues } = await import("./doctor-bun-cli-launcher-CNmkz8SB.mjs");
				const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-B6jF22OT.mjs");
				const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-DCt_dOk-.mjs");
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
				const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-AiMZyiIP.mjs");
				const configResult = await measureGatewayBootstrapStep("doctor.config-flow", () => loadAndMaybeMigrateDoctorConfig({
					options,
					retiredStateAdmitted: true,
					stateSchemaPreparation,
					agentDatabaseMigrationDiscovery: schemas.agentDatabaseMigrationDiscovery,
					confirm: (p) => prompter.confirm(p),
					runtime: doctorRuntime,
					prompter
				}));
				resources.use(configResult);
				const admissionSchemas = schemas.agentDatabaseMigrationDiscovery && schemas.agentDatabaseMigrationDiscovery.stateDir !== resolveStateDir() ? await prepareDoctorDatabasePreflight({ cfg: configResult.cfg }) : schemas;
				const recoveredPaths = new Set(configResult.stateMigrationStepReceipts?.flatMap((receipt) => receipt.id === "media-persistence" ? receipt.recoveredAgentDatabasePaths ?? [] : []));
				const sourceIdentities = admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.sourceIdentities;
				const agentDatabaseRefusals = (admissionSchemas.agentRefusals ?? []).filter((refusal) => !refusal.paths.every((pathname) => recoveredPaths.has(pathname) || recoveredPaths.has(sourceIdentities?.get(pathname)?.realPath ?? pathname)));
				recordAgentDatabaseAdmissions(agentDatabaseRefusals);
				const { CONFIG_PATH } = await import("./config/config.js");
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
				const { runDoctorHealthContributions } = await import("./doctor-health-contributions-BNG0zGh_.mjs");
				await measureGatewayBootstrapStep("doctor.contributions", () => runDoctorHealthContributions(ctx));
				if (recordRepairRefusal(ctx)) return;
				if (maintenance) {
					const { validateDoctorExternalConfigForStartup } = await import("./doctor-external-config-NBbOWncF.mjs");
					if (!await validateDoctorExternalConfigForStartup(effectiveRuntime)) {
						exitCode = 1;
						return;
					}
					const { assertDoctorMaintenanceReady } = await import("./doctor-maintenance-inspection-BCLvr1sB.mjs");
					if (!(await measureGatewayBootstrapStep("doctor.maintenance-ready", () => assertDoctorMaintenanceReady(ctx.cfg, process.env, effectiveRuntime.log, admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.targets ?? []))).schemaPublicationDeferred) {
						sqliteReclamationAgents = admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.targets ?? [];
						resumeCapture?.();
						if (isTruthyEnvValue(process.env.OPENCLAW_DEBUG_PROXY_ENABLED)) {
							const { initializeDebugProxyCaptureAsync } = await import("./runtime-DBg_d6LY.mjs");
							await initializeDebugProxyCaptureAsync("cli");
						}
					}
					const { repairGatewayMaintenanceStartupFailures } = await import("./gateway-boot-lifecycle-B1imFqMz.mjs");
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
						const { writeDoctorGatewayConfig } = await import("./doctor-health-contribution-runners.gateway-CYJYcGSt.mjs");
						return writeDoctorGatewayConfig(completed, nextConfig);
					} : void 0, failure));
				}
			}
			if (!ctx || recordRepairRefusal(ctx)) return;
			const pluginWarnings = [];
			if (diagnostics.length > 0) {
				const { collectPluginLoadHealthFindings } = await import("./doctor-workspace-status-b2y7YkO5.mjs");
				const { renderStructuredHealthFindings } = await import("./doctor-health-contribution-CVlQJvV2.mjs");
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
				showDoctorOutro("Doctor finished with plugin load errors.");
				if (options.nonInteractive && !isUpdateDoctorLintPass(process.env)) exitCode = 1;
				return;
			}
		} catch (error) {
			if (!maintenance && error instanceof DoctorMaintenanceRefusalError && error.refusal.kind === "deferred" && isDoctorUpdateRepairMode(resolveDoctorRepairMode(options))) {
				writeAuthority?.assertCurrent();
				const { recordUpdateDoctorRefusal } = await import("./doctor-update-refusal-Co8sNHQ2.mjs");
				recordUpdateDoctorRefusal(error.message);
				effectiveRuntime.error(error.message);
				doctorResult = {
					status: "ok",
					warnings: [error.message],
					maintenanceRefusal: error.refusal
				};
				const runId = process.env.OPENCLAW_UPDATE_RUN_ID?.trim();
				if (!updateResult && runId) try {
					const { recordUpdateRunStep } = await import("./update-run-ledger-BNpLktkl.mjs");
					recordUpdateRunStep(runId, {
						step: "warning:doctor-maintenance",
						status: "completed",
						endedAtMs: Date.now(),
						detail: error.message
					});
				} catch {
					effectiveRuntime.error("Doctor maintenance warning could not be saved to update history.");
				}
				showDoctorOutro("Doctor maintenance deferred; pending repairs remain unchanged.");
				exitCode = 0;
				return;
			}
			const { DoctorStateMigrationRefusalError } = await import("./state-migrations.messages-2aF4-Shb.mjs");
			const refusalWarnings = error instanceof DoctorStateMigrationRefusalError ? error.failureFacts.map(formatUpdateFailureFact) : [];
			if (healthContext && refusalWarnings.length > 0) {
				const { recordDoctorHealthWarnings } = await import("./doctor-health-contribution-CVlQJvV2.mjs");
				recordDoctorHealthWarnings(healthContext, [], refusalWarnings, { prepend: true });
			}
			if (error instanceof DoctorStateMigrationRefusalError) {
				const { recordUpdateDoctorRefusal, resolveUpdateDoctorGitRecovery } = await import("./doctor-update-refusal-Co8sNHQ2.mjs");
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
			const { classifyDoctorMaintenanceRefusal } = await import("./doctor-maintenance-inspection-BCLvr1sB.mjs");
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
			await measureGatewayBootstrapStep("doctor.maintenance.release", () => resources.disposeAsync());
			if (updateResult) await publishDoctorUpdateResult({
				updateResult,
				doctorResult,
				healthContext,
				maintenance
			});
			if (exitCode !== void 0) requestExit(effectiveRuntime, exitCode);
		}
		showDoctorOutro("Doctor complete.");
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
//#endregion
export { runDoctorHealthFlow as t };
