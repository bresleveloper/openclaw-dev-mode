import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-CIfR48BB.mjs";
import { n as createUpdateFailureFact } from "./update-failure-facts-DiyYJNo1.mjs";
import { a as captureUpdateDoctorConfigWrites, d as normalizeUpdatePostInstallDoctorWarnings, g as writeUpdatePostInstallDoctorResult, n as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, r as UpdateDoctorError } from "./update-doctor-result-CoUVRLb-.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-C28rym6a.mjs";
import { n as formatUpdateDoctorConfigChange } from "./update-doctor-config-BrLAVDg0.mjs";
import { n as withPluginLoadDiagnostics } from "./load-diagnostics-CJT2tL9t.mjs";
import { l as isUpdateDoctorLintPass } from "./update-phase-DiVB4MDN.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { r as stylePromptTitle } from "./prompt-style-zarsDmI2.mjs";
import fs from "node:fs";
import { intro, outro } from "@clack/prompts";
//#region src/flows/doctor-health.ts
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
function stateDirectoryExistsAtDoctorStart() {
	try {
		return fs.statSync(resolveStateDir()).isDirectory();
	} catch {
		return false;
	}
}
/** Runs the full interactive doctor flow against the provided or default runtime. */
async function runDoctorHealthFlow(runtime, options = {}, writeAuthority, databasePreflight) {
	let preparedPreflight = databasePreflight;
	if (process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" && !writeAuthority?.postCoreSchemaRepair) {
		const { guardUpdateDoctorSchemaUpgrade, rehearseDeferredUpdateDoctorSchema } = await import("./doctor-update-schema-guard-BKFihgVm.mjs");
		preparedPreflight = await guardUpdateDoctorSchemaUpgrade({
			schemas: preparedPreflight,
			runtime,
			json: options.json
		}) ?? preparedPreflight;
		if (preparedPreflight?.updateSchemaRehearsal) {
			await rehearseDeferredUpdateDoctorSchema(preparedPreflight, runtime);
			return;
		}
	}
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
	return withPluginLoadDiagnostics((diagnostics) => resultPath ? captureUpdateDoctorConfigWrites(resolveConfigPath(), (capture) => runDoctorHealthFlowWithResult(runtime, options, preparedPreflight, diagnostics, {
		resultPath,
		capture
	}, writeAuthority), writeAuthority) : runDoctorHealthFlowWithResult(runtime, options, preparedPreflight, diagnostics, void 0, writeAuthority));
}
async function runDoctorHealthFlowWithResult(runtime, options, databasePreflight, diagnostics, updateResult, writeAuthority) {
	const effectiveRuntime = runtime ?? (await import("./runtime-pvh-jBbt.mjs")).defaultRuntime;
	const stateDirExistedAtStart = stateDirectoryExistsAtDoctorStart();
	intro$1("OpenClaw doctor");
	const { resolveOpenClawPackageRoot } = await import("./openclaw-root-C6IwoLZm.mjs");
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
	if (options.repair === true || options.yes === true || options.generateGatewayToken === true) {
		const { assertConfigWriteAllowedInCurrentMode } = await import("./config-write-guard-D0eCMYLV.mjs");
		assertConfigWriteAllowedInCurrentMode();
	}
	let maintenance;
	let exitCode;
	let healthContext;
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
		const { beginDoctorMaintenance } = await import("./doctor-maintenance-DotE60K-.mjs");
		maintenance = await beginDoctorMaintenance({
			options,
			root,
			runtime: effectiveRuntime,
			assertCurrent: writeAuthority?.assertCurrent
		});
		const runChecks = async () => {
			const { createDoctorPrompter } = await import("./doctor-prompter-BbOgTw2S.mjs");
			const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-l8VsfrNH.mjs");
			const prompter = createDoctorPrompter({
				runtime: effectiveRuntime,
				options
			});
			if (!maintenance) {
				if (!databasePreflight) await prepareDoctorDatabasePreflight({ scope: "state" });
				const { maybeOfferUpdateBeforeDoctor } = await import("./doctor-update-DY-QioM0.mjs");
				if ((await maybeOfferUpdateBeforeDoctor({
					options,
					root,
					confirm: (p) => prompter.confirm(p),
					outro: outro$1
				})).handled) return;
			}
			const schemas = databasePreflight ?? await prepareDoctorDatabasePreflight();
			const { recordAgentDatabaseAdmissions } = await import("./agent-database-admission-9YJceL-Q.mjs");
			if (options.repair !== true && options.yes !== true) recordAgentDatabaseAdmissions(schemas.agentRefusals ?? []);
			const { guardUpdateDoctorSchemaUpgrade } = await import("./doctor-update-schema-guard-BKFihgVm.mjs");
			await guardUpdateDoctorSchemaUpgrade({
				schemas,
				runtime: effectiveRuntime,
				json: options.json,
				postCoreSchemaRepair: writeAuthority?.postCoreSchemaRepair
			});
			if (maintenance && (options.repair === true || options.yes === true)) {
				const { repairOpenClawStateDatabaseReadabilityForDoctor } = await import("./openclaw-state-db-quM4UOZq.mjs");
				const readability = repairOpenClawStateDatabaseReadabilityForDoctor({ env: process.env });
				if (readability.warnings.length > 0) throw new Error(readability.warnings.join("\n"));
				for (const change of readability.changes) effectiveRuntime.log(change);
			}
			const { maybeRepairUiProtocolFreshness } = await import("./doctor-ui-DzlI6Ycx.mjs");
			const { noteSourceInstallIssues } = await import("./doctor-install-Dp-p6miG.mjs");
			const { noteStalePluginRuntimeSymlinks } = await import("./plugin-runtime-symlinks-DM9Rm0zN.mjs");
			const { noteStartupOptimizationHints } = await import("./doctor-platform-notes-3BZ1Afe1.mjs");
			await maybeRepairUiProtocolFreshness(effectiveRuntime, prompter);
			noteSourceInstallIssues(root);
			await noteStalePluginRuntimeSymlinks(root);
			noteStartupOptimizationHints();
			const { loadAndMaybeMigrateDoctorConfig } = await import("./doctor-config-flow-CAX-P7f1.mjs");
			const configResult = await loadAndMaybeMigrateDoctorConfig({
				options,
				agentDatabaseMigrationDiscovery: schemas.agentDatabaseMigrationDiscovery,
				confirm: (p) => prompter.confirm(p),
				runtime: effectiveRuntime,
				prompter
			});
			const admissionSchemas = schemas.agentDatabaseMigrationDiscovery && schemas.agentDatabaseMigrationDiscovery.stateDir !== resolveStateDir() ? await prepareDoctorDatabasePreflight({ cfg: configResult.cfg }) : schemas;
			const recoveredPaths = new Set(configResult.stateMigrationStepReceipts?.flatMap((receipt) => receipt.id === "media-persistence" ? receipt.recoveredAgentDatabasePaths ?? [] : []));
			const sourceIdentities = admissionSchemas.agentDatabaseMigrationDiscovery?.discovery.sourceIdentities;
			const agentDatabaseRefusals = (admissionSchemas.agentRefusals ?? []).filter((refusal) => !refusal.paths.every((pathname) => recoveredPaths.has(pathname) || recoveredPaths.has(sourceIdentities?.get(pathname)?.realPath ?? pathname)));
			recordAgentDatabaseAdmissions(agentDatabaseRefusals);
			const { CONFIG_PATH } = await loadConfigModule();
			const ctx = {
				runtime: effectiveRuntime,
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
				preparedAgentCount: Math.max(admissionSchemas.agentDatabaseMigrationDiscovery?.configuredAgentDatabaseTargets.length ?? 0, admissionSchemas.agentDatabaseMigrationDiscovery?.registeredAgentDatabases.length ?? 0),
				runWithPluginMetadataSnapshot: configResult.runWithPluginMetadataSnapshot,
				invalidatePluginMetadataSnapshot: configResult.invalidatePluginMetadataSnapshot
			};
			healthContext = ctx;
			const { runDoctorHealthContributions } = await import("./doctor-health-contributions-CfFzywm5.mjs");
			await runDoctorHealthContributions(ctx);
			if (recordConfigWriteRefusal(ctx)) return;
			if (options.repair === true || options.yes === true) {
				const { assertSessionStoreMigrationComplete } = await import("./startup-migration-BiLXyJka.mjs");
				assertSessionStoreMigrationComplete({
					cfg: ctx.cfg,
					env: process.env,
					operation: "doctor"
				});
				const { assertOpenClawDatabasesReady } = await import("./openclaw-database-preflight-DwZaE6VW.mjs");
				const { resolveConfiguredAgentDatabaseTargets } = await import("./targets-D9kWQ1Aj.mjs");
				await assertOpenClawDatabasesReady({
					env: process.env,
					config: ctx.cfg,
					operation: "doctor",
					onDeferredSchemaPublication: (publication) => effectiveRuntime.log(publication.message),
					configuredAgentDatabaseTargets: resolveConfiguredAgentDatabaseTargets(ctx.cfg, { env: process.env })
				});
				const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-C5SXBV5U.mjs");
				await assertConfiguredWorkspaceStateReady({
					cfg: ctx.cfg,
					operation: "doctor"
				});
				const { assertNoPendingLegacyExecApprovals } = await import("./exec-approvals-migration-gate-BiILHzF9.mjs");
				assertNoPendingLegacyExecApprovals({ operation: "doctor" });
				const { repairGatewayMaintenanceStartupFailures } = await import("./gateway-boot-lifecycle-MYkRR6Ee.mjs");
				repairGatewayMaintenanceStartupFailures();
			}
			return ctx;
		};
		const ctx = await (maintenance ? maintenance.run(runChecks) : runChecks());
		if (!ctx) return;
		if (maintenance) {
			const { writeDoctorGatewayConfig } = await import("./doctor-health-contribution-runners.gateway-Cw33WrJz.mjs");
			await maintenance.finish(ctx.cfg, (nextConfig) => writeDoctorGatewayConfig(ctx, nextConfig));
			if (recordConfigWriteRefusal(ctx)) return;
		}
		const pluginWarnings = [];
		if (diagnostics.length > 0) {
			const { collectPluginLoadHealthFindings } = await import("./doctor-workspace-status-CedwBdXz.mjs");
			const { renderStructuredHealthFindings } = await import("./doctor-health-contribution-Mj_egLrc.mjs");
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
		const { DoctorStateMigrationRefusalError } = await import("./state-migrations.messages-BKVo-05j.mjs");
		const refusalWarnings = error instanceof DoctorStateMigrationRefusalError ? error.failureFacts.map(formatUpdateFailureFact) : [];
		if (healthContext && refusalWarnings.length > 0) {
			const { recordDoctorHealthWarnings } = await import("./doctor-health-contribution-Mj_egLrc.mjs");
			recordDoctorHealthWarnings(healthContext, [], refusalWarnings, { prepend: true });
		}
		if (error instanceof DoctorStateMigrationRefusalError) {
			const { recordUpdateDoctorRefusal, resolveUpdateDoctorGitRecovery } = await import("./doctor-update-refusal-CD7HS2J9.mjs");
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
		const unsafeConfigWrite = causes.find((cause) => cause instanceof ConfigWritePostCommitError && cause.rollbackStatus !== "restored");
		const schemaRefusal = causes.find((cause) => cause instanceof UpdateSchemaRefusalError);
		const refusalFacts = causes.flatMap((cause) => cause instanceof UpdateDoctorError || cause instanceof DoctorStateMigrationRefusalError ? cause.failureFacts : []);
		doctorResult = {
			status: "error",
			...!healthContext && refusalWarnings.length > 0 ? { warnings: refusalWarnings } : {},
			failureFacts: !unsafeConfigWrite && !schemaRefusal && refusalFacts.length > 0 ? refusalFacts : [createUpdateFailureFact({
				check: unsafeConfigWrite ? "config-write" : schemaRefusal ? "database-schema-preflight" : "doctor",
				code: unsafeConfigWrite ? "rollback-state-unverified" : schemaRefusal?.code ?? "doctor-failed",
				message: unsafeConfigWrite ? `${unsafeConfigWrite.publication} config publication; rollback ${unsafeConfigWrite.rollbackStatus}. ${unsafeConfigWrite.message}` : schemaRefusal?.message ?? (error instanceof Error ? error.message : String(error))
			})]
		};
		if (maintenance) {
			if (!(error instanceof DoctorStateMigrationRefusalError)) effectiveRuntime.error("Doctor could not complete maintenance. Check the reported service state and resolve the failure.");
		}
		throw error;
	} finally {
		try {
			await maintenance?.release();
		} finally {
			if (updateResult) {
				for (const change of updateResult.capture.configChanges) createSubsystemLogger("update").warn(formatUpdateDoctorConfigChange(change));
				const contributionWarnings = healthContext?.updateWarnings ?? [];
				const deferredCount = healthContext?.updateBudget?.deferred.size ?? 0;
				const warnings = normalizeUpdatePostInstallDoctorWarnings([
					...contributionWarnings.slice(0, deferredCount),
					...doctorResult.warnings ?? [],
					...contributionWarnings.slice(deferredCount)
				]);
				await writeUpdatePostInstallDoctorResult({
					resultPath: updateResult.resultPath,
					result: {
						...doctorResult,
						...warnings.length ? { warnings } : {},
						...updateResult.capture.configChanges.length ? { configChanges: updateResult.capture.configChanges } : {},
						...updateResult.capture.configWriteRefusal ? { configWriteRefusal: updateResult.capture.configWriteRefusal } : {},
						configHash: updateResult.capture.hash,
						...updateResult.capture.inputHash === void 0 ? {} : { configInputHash: updateResult.capture.inputHash }
					}
				});
			}
		}
		if (exitCode !== void 0) effectiveRuntime.exit(exitCode);
	}
	outro$1("Doctor complete.");
}
//#endregion
export { runDoctorHealthFlow };
