import { C as resolveIsNixMode, S as resolveIsConfigReadOnly } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { _ as recordUpdateDoctorConfigMigration, m as getUpdateDoctorConfigWriteAuthority, x as runUpdateDoctorIncludeWrite, y as recordUpdateDoctorConfigWriteRefusal } from "./update-doctor-result-oZ38327j.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { g as shouldSkipLegacyUpdateDoctorConfigWrite } from "./update-phase-M5rvMZiC.mjs";
import { n as recordUpdateModelRetirement } from "./update-deferred-model-retirement-BmVkte5n.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { a as resolveLegacyParentVersionOverride, n as noteDoctorRepairResult, r as resolveDoctorMode, t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/flows/doctor-health-contribution-runners.config.ts
/** Removes queued retired profiles after any config references have been durably repaired. */
async function runRetiredAuthProfileCleanup(ctx) {
	if (ctx.externalConfigRepairsPending) return;
	const retiredAuthProfileCleanupPlans = ctx.configResult.retiredAuthProfileCleanupPlans;
	if (!retiredAuthProfileCleanupPlans?.length) return;
	const { removeAuthProfilesAcrossOwnerStores } = await import("./auth-profiles-Ci7Cc0l7.mjs");
	for (const plan of retiredAuthProfileCleanupPlans) if (!await removeAuthProfilesAcrossOwnerStores({
		...plan,
		cfg: ctx.cfg
	})) throw new Error(`Failed to remove retired auth profile "${plan.profileIds.join(", ")}".`);
	delete ctx.configResult.retiredAuthProfileCleanupPlans;
}
/** Returns false when persistence was refused or skipped, without authorizing dependent work. */
async function runWriteConfigHealth(ctx, options = {}) {
	if (ctx.configWriteError) throw ctx.configWriteError;
	if (ctx.configWriteRefusal) return false;
	const { applyWizardMetadata } = await import("./onboard-helpers-G-2HeHvm.mjs");
	const { ConfigMutationConflictError, readConfigFileSnapshot, transformConfigFile } = await import("./config/config.js");
	const { collectChangedConfigPaths } = await import("./include-write-boundary-BNteZrOh.mjs");
	const { hashConfigRaw } = await import("./io.read-helpers-CIT7Mp41.mjs");
	const { resolveConfigIncludeWriteBoundary } = await import("./mutate-CJrOnF4H.mjs");
	const { isDeepStrictEqual } = await import("node:util");
	const { getDeferredPluginMigrationConfigFacts, preserveDeferredPluginMigrationConfig } = await import("./deferred-plugin-migration-config-Ci8N4dmA.mjs");
	const { createSubsystemLogger } = await import("./subsystem-BZ11qwdq.mjs");
	const { recordDoctorHealthWarnings } = await import("./doctor-health-contribution-CVlQJvV2.mjs");
	const { logConfigUpdated } = await import("./logging-pCROUbfb.mjs");
	const { shortenHomePath } = await import("./utils-a_bDQSyF.mjs");
	const providerRenames = ctx.configResult.providerRenames ?? [];
	const providerRenamePending = ctx.prompter.shouldRepair && providerRenames.length > 0;
	const configResultWritePending = ctx.configResult.shouldWriteConfig === true && ctx.configResultWriteCommitted !== true || providerRenamePending;
	const shouldWriteConfig = configResultWritePending || JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence);
	if (resolveIsConfigReadOnly(ctx.env ?? process.env)) {
		if (shouldWriteConfig) {
			const { reportDoctorExternalConfigRepairs } = await import("./doctor-external-config-NBbOWncF.mjs");
			await reportDoctorExternalConfigRepairs(ctx);
			return false;
		}
		if (ctx.externalConfigRepairsPending) return false;
	}
	if (shouldWriteConfig && shouldSkipLegacyUpdateDoctorConfigWrite(ctx.env ?? process.env)) {
		ctx.runtime.log("Skipping doctor config write during legacy update handoff.");
		return false;
	}
	if (providerRenamePending) {
		const { maybeRepairCodexSessionRoutes } = await import("./codex-route-session-repair-BRtFFFqT.mjs");
		const { maybeRepairProviderRenameCronJobs } = await import("./provider-rename-state-BG3-4HbC.mjs");
		const { applyProviderRenames } = await import("./provider-rename-dRgDVuMD.mjs");
		const renamedCron = await maybeRepairProviderRenameCronJobs({
			renames: providerRenames,
			env: ctx.env,
			shouldRepair: true
		});
		noteDoctorRepairResult(renamedCron, note);
		const renamedSessions = await maybeRepairCodexSessionRoutes({
			cfg: ctx.cfg,
			providerRenames,
			providerRenameOnly: true,
			env: ctx.env,
			shouldRepair: true
		});
		noteDoctorRepairResult(renamedSessions, note);
		if (renamedCron.warnings.length > 0 || renamedSessions.warnings.length > 0) throw new Error("Provider references could not be fully repaired. Config was preserved; rerun openclaw doctor --fix.");
		const migration = applyProviderRenames(ctx.cfg, providerRenames);
		ctx.cfg = migration.config;
		if (migration.changes.length > 0) ctx.configResult.pendingChangePanels = [...ctx.configResult.pendingChangePanels ?? [], migration.changes.join("\n")];
	}
	if (shouldWriteConfig) {
		const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
		const { readDeferredPluginMigrationsAsync } = await import("./deferred-plugin-migrations-qYowxTGV.mjs");
		const deferredPluginMigrations = await readDeferredPluginMigrationsAsync({ env: ctx.env ?? process.env });
		const { restoreDoctorConfigEnvRefs } = await import("./config-flow-steps-BUWpg1VL.mjs");
		const { prepareDoctorConfigWriteStage } = await import("./roster-include-write-DB-x0FYB.mjs");
		let stageSnapshot = configResultWritePending ? await readConfigFileSnapshot({
			observe: false,
			skipPluginValidation: true,
			deferredPluginMigrations
		}) : void 0;
		let stage = stageSnapshot ? prepareDoctorConfigWriteStage({
			snapshot: stageSnapshot,
			nextConfig: restoreDoctorConfigEnvRefs(ctx.cfg, ctx.configResult.referenceSource, ctx.configResult.explicitSetPaths),
			persistCanonicalAgentRoster: ctx.configResult.persistCanonicalAgentRoster,
			installedPluginIdRecovery: ctx.configResult.referenceSource?.installedPluginIdRecovery,
			explicitSetPaths: ctx.configResult.explicitSetPaths
		}) : void 0;
		if (stage) ctx.configResult.skipWizardMetadataForIncludeWrite = true;
		if (ctx.configResult.skipWizardMetadataForIncludeWrite !== true && !resolveUpdateRehearsalRoot(ctx.env ?? process.env)) ctx.cfg = applyWizardMetadata(ctx.cfg, {
			command: "doctor",
			mode: resolveDoctorMode(ctx.cfg)
		});
		const legacyParentVersionOverride = resolveLegacyParentVersionOverride(ctx).lastTouchedVersionOverride;
		const { findRetiredConfigUpgradeRequirement } = await import("./retired-config-formats-CUjAI6rP.mjs");
		const { assertInstalledPluginIdRecoveryCurrent } = await import("./installed-plugin-id-recovery-BSECgX5c.mjs");
		const installedPluginIdRecovery = ctx.configResult.referenceSource?.installedPluginIdRecovery;
		let committed;
		let stagedWriteCommitted = false;
		try {
			while (stage && stageSnapshot) {
				const currentStage = stage;
				const stageContext = {
					...ctx,
					cfg: currentStage.config,
					cfgForPersistence: stageSnapshot.sourceConfig,
					configResultWriteCommitted: false,
					configResult: {
						cfg: currentStage.config,
						shouldWriteConfig: true,
						confirmedConfigSource: ctx.configResult.confirmedConfigSource,
						referenceSource: ctx.configResult.referenceSource,
						persistCanonicalAgentRoster: currentStage.persistCanonicalAgentRoster,
						skipWizardMetadataForIncludeWrite: true,
						skipPluginValidationOnWrite: currentStage.persistCanonicalAgentRoster || ctx.configResult.skipPluginValidationOnWrite,
						preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
						explicitSetPaths: ctx.configResult.explicitSetPaths?.filter(([key]) => !currentStage.persistCanonicalAgentRoster || key === "agents")
					}
				};
				try {
					if (!await runWriteConfigHealth(stageContext, { runPostWriteRepairs: false })) {
						ctx.configWriteRefusal = stageContext.configWriteRefusal;
						return false;
					}
				} finally {
					if (stageContext.configWriteError) ctx.configWriteError = stageContext.configWriteError;
					if (stageContext.configResultWriteCommitted) {
						ctx.configResult.confirmedConfigSource = stageContext.configResult.confirmedConfigSource;
						ctx.cfgForPersistence = stageContext.cfgForPersistence;
						if (currentStage.persistCanonicalAgentRoster) delete ctx.configResult.persistCanonicalAgentRoster;
						stagedWriteCommitted = true;
					}
				}
				const message = "Saved a config migration stage; remaining repairs are still pending.";
				recordUpdateDoctorConfigMigration(message);
				ctx.runtime.log(message);
				const savedStage = await readConfigFileSnapshot({
					observe: false,
					skipPluginValidation: true,
					deferredPluginMigrations
				});
				if (savedStage.path !== ctx.configResult.confirmedConfigSource?.path || savedStage.hash !== ctx.configResult.confirmedConfigSource?.hash) throw new ConfigMutationConflictError("config changed after Doctor saved a migration stage", { retryable: false });
				const { cloneConfigWithResolutionFacts } = await import("./resolution-facts-BJCejl9c.mjs");
				const { getConfigValueAtPath, setConfigValueAtPath } = await import("./config-paths-cLpEYHY7.mjs");
				const pending = ctx.cfg;
				ctx.cfg = cloneConfigWithResolutionFacts(savedStage.sourceConfig);
				for (const field of currentStage.remainingPaths) setConfigValueAtPath(ctx.cfg, field, getConfigValueAtPath(pending, field));
				stageSnapshot = savedStage;
				stage = prepareDoctorConfigWriteStage({
					snapshot: savedStage,
					nextConfig: ctx.cfg,
					persistCanonicalAgentRoster: ctx.configResult.persistCanonicalAgentRoster,
					installedPluginIdRecovery,
					explicitSetPaths: ctx.configResult.explicitSetPaths
				});
			}
			const confirmedConfigSource = ctx.configResult.confirmedConfigSource;
			if (!confirmedConfigSource?.hash) throw new ConfigMutationConflictError("Doctor config write has no source revision", { retryable: false });
			const { path, hash } = confirmedConfigSource;
			const nextConfig = restoreDoctorConfigEnvRefs(ctx.cfg, ctx.configResult.referenceSource, ctx.configResult.explicitSetPaths);
			const authority = getUpdateDoctorConfigWriteAuthority(ctx.configPath);
			const includeSnapshot = authority ? await readConfigFileSnapshot({
				skipPluginValidation: updateDoctorRun,
				observe: false,
				deferredPluginMigrations
			}) : void 0;
			const resolveIncludeBoundary = (snapshot) => resolveConfigIncludeWriteBoundary({
				snapshot,
				nextConfig,
				persistCanonicalAgentRoster: configResultWritePending ? ctx.configResult.persistCanonicalAgentRoster : void 0,
				explicitSetPaths: ctx.configResult.explicitSetPaths
			});
			const includeBoundary = includeSnapshot && resolveIncludeBoundary(includeSnapshot);
			const includeWrite = includeBoundary ? includeSnapshot : void 0;
			let recoveryConfig = ctx.cfg;
			const persistConfig = (assertOwned) => {
				const assertCurrent = () => {
					authority?.assertCurrent();
					assertOwned?.();
				};
				return transformConfigFile({
					baseHash: hash,
					transform: async (_current, { snapshot }) => {
						assertOwned?.();
						authority?.assertCurrent();
						const retired = findRetiredConfigUpgradeRequirement(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig);
						if (retired) throw new ConfigMutationConflictError(`${retired.message} ${retired.nextAction}`);
						recoveryConfig = snapshot.sourceConfig;
						await assertInstalledPluginIdRecoveryCurrent(recoveryConfig, installedPluginIdRecovery, ctx.env ?? process.env);
						assertCurrent();
						if (includeBoundary) {
							const currentBoundary = resolveIncludeBoundary(snapshot);
							if (!isDeepStrictEqual(currentBoundary, includeBoundary)) throw new ConfigMutationConflictError("included config changed after Doctor prepared its repairs", { retryable: false });
						}
						const { repairLegacyCronOwnersBeforeConfigWrite } = await import("./legacy-owner-CR2Wcjti.mjs");
						const cronOwnerChanges = await repairLegacyCronOwnersBeforeConfigWrite({
							snapshot,
							nextConfig,
							env: ctx.env ?? process.env,
							assertCurrent
						});
						for (const change of cronOwnerChanges) ctx.runtime.log(change);
						return { nextConfig };
					},
					afterWrite: { mode: "auto" },
					writeOptions: {
						deferredPluginMigrations,
						assertCurrent,
						...installedPluginIdRecovery?.size ? { beforeCommit: async () => {
							assertCurrent();
							await assertInstalledPluginIdRecoveryCurrent(recoveryConfig, installedPluginIdRecovery, ctx.env ?? process.env);
							assertCurrent();
						} } : {},
						expectedConfigPath: path,
						auditOrigin: "doctor",
						allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
						skipPluginValidation: ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
						...ctx.configResult.explicitSetPaths ? { explicitSetPaths: ctx.configResult.explicitSetPaths } : {},
						persistCanonicalAgentRoster: configResultWritePending ? ctx.configResult.persistCanonicalAgentRoster : void 0,
						preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
						...legacyParentVersionOverride ? { lastTouchedVersionOverride: legacyParentVersionOverride } : {}
					}
				});
			};
			const writeConfig = async () => {
				if (!installedPluginIdRecovery?.size) return await persistConfig();
				const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-C4DiOvV_.mjs");
				return await withPluginLifecycleLease({
					env: ctx.env ?? process.env,
					assertCurrent: () => authority?.assertCurrent()
				}, (lease) => persistConfig(() => lease.assertOwned()));
			};
			if (includeWrite) {
				const keys = [...new Set(collectChangedConfigPaths(includeWrite.sourceConfig, ctx.cfg).paths.flatMap(([key]) => key === void 0 ? [] : [key]))].toSorted();
				committed = await runUpdateDoctorIncludeWrite(includeWrite.path, hashConfigRaw(includeWrite.raw), async () => {
					const warning = `Doctor include-owned keys ${keys.join(", ")}: promotion unavailable for include-owned configuration.`;
					recordDoctorHealthWarnings(ctx, [], [warning]);
					createSubsystemLogger("update").warn(warning);
					ctx.runtime.log(warning);
					return await writeConfig();
				});
			} else committed = await writeConfig();
		} catch (error) {
			if (error instanceof ConfigWritePostCommitError) {
				ctx.configWriteError = error;
				if (error.publication === "partial") delete ctx.configResult.confirmedConfigSource;
				throw error;
			}
			recordUpdateDoctorConfigWriteRefusal({
				reason: "config-write-refused",
				message: formatErrorMessage(error),
				keys: []
			});
			if (error instanceof ConfigMutationConflictError) {
				const { note } = await import("./terminal-core/note.js");
				note(["The config changed after Doctor prepared these repairs.", stagedWriteCommitted ? "Earlier config fixes were saved; the remaining fixes were not written. Rerun \"openclaw doctor\" to review the current config." : "These config fixes were not written. Rerun \"openclaw doctor\" to review repairs for the current config."].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "config-conflict";
				return false;
			}
			const { isConfigIncludeOwnershipError, isConfigValidationFailedError } = await import("./io.write-errors-Dv0PXPCc.mjs");
			const unpersistedLine = ctx.configResultWriteCommitted === true || stagedWriteCommitted ? "Earlier config fixes were already saved; the remaining changes were not written." : "No config changes were written.";
			if (isConfigIncludeOwnershipError(error)) {
				const { note } = await import("./terminal-core/note.js");
				const targets = error.includeTargets ?? [];
				const includedFile = targets.length === 0 ? "its included file" : `the included ${targets.length === 1 ? "file" : "files"} ${targets.join(", ")}`;
				note([`Doctor could not apply config fixes: ${error.message}`, `${unpersistedLine} Repair ${error.ownedConfigPath} in ${includedFile} by hand, then rerun "openclaw doctor --fix" for the remaining changes.`].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "include-ownership";
				return false;
			}
			if (isConfigValidationFailedError(error)) {
				const { note } = await import("./terminal-core/note.js");
				const { formatConfigIssueLines } = await import("./issue-format-BthLOJ3-.mjs");
				note([
					"Doctor could not apply config fixes: the repaired config still fails validation.",
					...Array.isArray(error.issues) ? formatConfigIssueLines(error.issues, "-", { normalizeRoot: true }) : [error.message],
					`${unpersistedLine} Fix the value(s) above in ${shortenHomePath(ctx.configPath)} by hand, then rerun "openclaw doctor --fix".`
				].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "validation";
				return false;
			}
			const { isCronOwnerWriteRefusalError } = await import("./io.cron-owner-refusal-DgXAE26T.mjs");
			if (!isCronOwnerWriteRefusalError(error)) throw error;
			const { note } = await import("./terminal-core/note.js");
			note([
				error.message,
				stagedWriteCommitted ? "Earlier config fixes were saved; the remaining config repairs were not written." : "Doctor left the config unchanged, preserving any retained legacy owner for a later repair.",
				"Resolve the reported Gateway or cron-store condition, then rerun \"openclaw doctor --fix\"."
			].join("\n"), "Doctor warnings");
			ctx.configWriteRefusal = "cron-owner-safety";
			return false;
		}
		ctx.configResult.confirmedConfigSource = {
			path: committed.path,
			hash: committed.persistedHash
		};
		const pendingChangePanels = ctx.configResult.pendingChangePanels;
		if (pendingChangePanels?.length) {
			const { note } = await import("./terminal-core/note.js");
			for (const panel of pendingChangePanels) {
				note(panel, "Doctor changes");
				for (const message of panel.split("\n")) recordUpdateDoctorConfigMigration(message);
			}
			delete ctx.configResult.pendingChangePanels;
		}
		ctx.cfgForPersistence = structuredClone(preserveDeferredPluginMigrationConfig({
			sourceConfig: committed.nextConfig,
			nextConfig: ctx.cfg,
			pending: getDeferredPluginMigrationConfigFacts(committed.nextConfig) ?? []
		}));
		if (ctx.configResult.shouldWriteConfig === true || providerRenamePending) ctx.configResultWriteCommitted = true;
		delete ctx.configResult.providerRenames;
		logConfigUpdated(ctx.runtime);
		const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
		if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath)) ctx.runtime.log(`Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`);
	}
	if (ctx.configResult.modelRetirementRepairRan === true) {
		recordUpdateModelRetirement("completed", ctx.env ?? process.env);
		delete ctx.configResult.modelRetirementRepairRan;
	}
	const billingWarnings = ctx.configResult.modelBillingRouteWarnings;
	if (billingWarnings?.length) {
		const { note } = await import("./terminal-core/note.js");
		const log = createSubsystemLogger("doctor");
		note(billingWarnings.join("\n"), "Billing route changes");
		for (const warning of billingWarnings) log.warn(warning);
		recordDoctorHealthWarnings(ctx, [], billingWarnings);
		delete ctx.configResult.modelBillingRouteWarnings;
	}
	if (options.runPostWriteRepairs === false) return true;
	await runRetiredAuthProfileCleanup(ctx);
	if (ctx.configResult.retiredPhoneControlStateCleanupPending === true) {
		const { finalizeRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-CeVuBhuT.mjs");
		const { note } = await import("./terminal-core/note.js");
		const cleanup = await finalizeRetiredPhoneControlCleanup({ env: ctx.env ?? process.env });
		noteDoctorRepairResult(cleanup, note);
	}
	if (!ctx.prompter.shouldRepair && !ctx.configResult.openAICodexAuthProfileIdMap?.size && ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite !== true || ctx.postConfigWriteRepairsCommitted === true) return true;
	const { repairCronCodexModelRefsAfterConfigWrite } = await import("./legacy-repair-D8uyiY-k.mjs");
	const result = await repairCronCodexModelRefsAfterConfigWrite({
		cfg: ctx.cfg,
		migrateCodexModelRefs: ctx.prompter.shouldRepair || ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite === true,
		...ctx.configResult.retiredModelRefConfig ? { retiredModelRefConfig: ctx.configResult.retiredModelRefConfig } : {},
		repairRetiredModelRefs: ctx.prompter.shouldRepair,
		authProfileIdMap: ctx.configResult.openAICodexAuthProfileIdMap,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {}
	});
	ctx.postConfigWriteRepairsCommitted = true;
	const { note: note$1 } = await import("./terminal-core/note.js");
	noteDoctorRepairResult(result, note$1);
	return true;
}
/** Commits the finalized config-flow candidate before fallible health diagnostics start. */
async function runInitialConfigWriteHealth(ctx) {
	if (ctx.configResult.shouldWriteConfig !== true && !ctx.configResult.modelBillingRouteWarnings?.length && ctx.configResult.modelRetirementRepairRan !== true && !ctx.configResult.providerRenames?.length) return;
	await runWriteConfigHealth(ctx, { runPostWriteRepairs: false });
}
async function collectWriteConfigHealthFindings(ctx) {
	const findings = [];
	const configPath = ctx.configPath;
	const isNixMode = resolveIsNixMode(process.env);
	if (resolveIsConfigReadOnly(process.env)) findings.push({
		checkId: "core/doctor/write-config",
		severity: "warning",
		message: isNixMode ? "Doctor config writes are disabled because OpenClaw is running in Nix mode." : "Doctor config writes are disabled because config is externally managed.",
		...configPath ? { path: configPath } : {},
		requirement: "mutable-config-write-path",
		fixHint: isNixMode ? "Edit the Nix source for this install and rebuild; do not run doctor --fix against this config file." : "Apply reported config edits in your external deployment source and redeploy; doctor --fix still repairs writable runtime state."
	});
	if (!configPath) return findings;
	const configDirectory = path.dirname(configPath);
	const configPathExists = fs.existsSync(configPath);
	const existingParent = configPathExists ? configDirectory : findNearestExistingParent(configDirectory);
	if (!isDirectoryPath(existingParent)) {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: "Doctor cannot create the config directory because a path component is a file.",
			path: existingParent,
			target: configDirectory,
			requirement: "config-directory-path",
			fixHint: "Move the file blocking the config directory path before running doctor --fix."
		});
		return findings;
	}
	try {
		fs.accessSync(existingParent, fs.constants.W_OK | fs.constants.X_OK);
	} catch {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: configPathExists ? "Doctor cannot write config because the config directory is not writable." : "Doctor cannot create the config directory because the nearest existing parent is not writable.",
			path: existingParent,
			target: configPathExists ? configPath : configDirectory,
			requirement: "writable-config-directory",
			fixHint: "Make the existing config directory or parent directory writable before running doctor --fix."
		});
	}
	return findings;
}
function findNearestExistingParent(path$1) {
	let candidate = path$1;
	while (!pathEntryExists(candidate)) {
		const parent = path.dirname(candidate);
		if (parent === candidate) return candidate;
		candidate = parent;
	}
	return candidate;
}
function pathEntryExists(path) {
	if (fs.existsSync(path)) return true;
	try {
		fs.lstatSync(path);
		return true;
	} catch {
		return false;
	}
}
function isDirectoryPath(path) {
	try {
		return fs.statSync(path).isDirectory();
	} catch {
		return false;
	}
}
//#endregion
export { runWriteConfigHealth as i, runInitialConfigWriteHealth as n, runRetiredAuthProfileCleanup as r, collectWriteConfigHealthFindings as t };
