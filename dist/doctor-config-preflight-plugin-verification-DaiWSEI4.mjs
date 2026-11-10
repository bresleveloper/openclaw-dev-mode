import { c as getPluginCache, k as withPluginCache, p as getPluginMetadataSnapshotCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { a as measureGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { h as formatPluginVerificationDiagnostic, l as PLUGIN_AVAILABILITY_POLICY, p as describePluginAvailabilityFailure, u as buildDegradedPluginsFromVerificationFailures } from "./discovery-availability-CEoTdFoo.mjs";
import { n as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { a as isConfigReadFailure, n as createConfigReadError } from "./io.invalid-config-CsqYoW4w.mjs";
import { s as readConfigFileSnapshot, u as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { h as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-M5rvMZiC.mjs";
import { h as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-CPMSf5LC.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { i as throwStartupMigrationGuardRejected, n as refuseStartupMigrationsForLiveGatewayOwner, r as rethrowStartupConfigFailure } from "./doctor-startup-migration-refusal-DM4p-KXA.mjs";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-Dbhci2Vm.mjs";
import { t as isExistingLegacySessionStore } from "./legacy-store-source-CIkybz71.mjs";
//#region src/commands/doctor-config-preflight-measure.ts
async function measureDoctorConfigPreflightStep(name, run, measure, metrics) {
	const tracedRun = () => measureGatewayBootstrapStep(`cli.bootstrap.${name}`, run, metrics);
	return measure ? await measure(`doctor.config-preflight.${name}`, tracedRun) : await tracedRun();
}
//#endregion
//#region src/commands/config-preflight-snapshot.ts
const STARTUP_STATE_ADMISSION_TIMEOUT_MS = 3e5;
/** Own executable inspection caches until a final snapshot transfers to its caller. */
function createConfigPreflightSnapshotReader() {
	const caches = /* @__PURE__ */ new Set();
	return {
		async [Symbol.asyncDispose]() {
			await Promise.all([...caches].map((cache) => cache[Symbol.asyncDispose]()));
			caches.clear();
		},
		read(params) {
			const cache = params.allowCurrentPluginMetadata ? getPluginCache() : createPluginCache();
			if (!params.allowCurrentPluginMetadata) caches.add(cache);
			return readConfigPreflightSnapshot(params, cache);
		},
		async takePluginCache(snapshot) {
			const selected = snapshot && getPluginMetadataSnapshotCache(snapshot);
			await Promise.all([...caches].filter((cache) => cache !== selected).map(async (cache) => {
				await cache[Symbol.asyncDispose]();
				caches.delete(cache);
			}));
			return selected && caches.delete(selected) ? selected : void 0;
		}
	};
}
async function readConfigPreflightSnapshot(params, cache) {
	return withPluginCache(cache, async () => {
		const sharedOptions = {
			...params.isolateEnv ? { isolateEnv: true } : {},
			...params.observe === false ? { observe: false } : {},
			...params.measure ? { measure: params.measure } : {},
			...params.allowCurrentPluginMetadata ? {} : { allowCurrentPluginMetadata: false }
		};
		let deferred = params.deferredPluginMigrations;
		if (params.preparePluginMigrations) {
			const core = await readConfigFileSnapshot({
				...sharedOptions,
				pluginValidation: "core-only",
				deferredPluginMigrations: deferred
			});
			await params.prepareSnapshot?.(core);
			deferred = await params.preparePluginMigrations(core);
		}
		const readOptions = {
			...sharedOptions,
			deferredPluginMigrations: deferred
		};
		return withDeferredPluginDoctorMigrations(deferred?.map((entry) => entry.pluginId) ?? [], async () => {
			if (params.includePluginMetadata && !params.skipPluginValidation) {
				const result = await readConfigFileSnapshotWithPluginMetadata(readOptions);
				const pluginMetadataSnapshot = completePluginMetadataSnapshot({
					snapshot: result.pluginMetadataSnapshot,
					config: result.snapshot.sourceConfig ?? result.snapshot.config ?? {}
				});
				return {
					snapshot: params.purpose === "doctor" || !result.snapshot.valid ? addDoctorLegacyIssues(result.snapshot, pluginMetadataSnapshot) : result.snapshot,
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
				};
			}
			const snapshot = await readConfigFileSnapshot({
				...readOptions,
				skipPluginValidation: params.skipPluginValidation
			});
			if (!params.preparePluginMigrations) await params.prepareSnapshot?.(snapshot);
			return { snapshot: params.purpose === "doctor" || !snapshot.valid ? addDoctorLegacyIssues(snapshot) : snapshot };
		});
	});
}
/** Admit the same config and state before the lease and again before persistent writes. */
async function readAdmittedConfigSnapshot(params) {
	return await withArtifactPreservingStateReads(async () => {
		await measureDoctorConfigPreflightStep("admission.live-owner", () => refuseStartupMigrationsForLiveGatewayOwner(params.env));
		try {
			const selected = await measureDoctorConfigPreflightStep("admission.core-config", () => readConfigFileSnapshot({
				observe: false,
				isolateEnv: true,
				pluginValidation: "core-only"
			}));
			if (isConfigReadFailure(selected) || selected.issues.some((issue) => issue.errorCode === "CONFIG_SOURCE_INVALID")) return { snapshot: selected };
			const admitted = await measureDoctorConfigPreflightStep("admission.state-snapshot", () => withOpenClawStateDatabaseReadSnapshot(async () => {
				const recoveryOptions = {
					configPath: selected.path,
					observe: false,
					env: params.env
				};
				const coreRecovery = await measureDoctorConfigPreflightStep("admission.core-recovery", () => createConfigIO({
					...recoveryOptions,
					pluginValidation: "core-only"
				}).prepareConfigRecovery(selected));
				const candidate = coreRecovery?.snapshot ?? selected;
				const [readiness, configRead] = await Promise.allSettled([(async () => {
					await assertStartupStateReady({
						cfg: candidate.sourceConfig ?? candidate.config,
						env: cloneEnvWithPlatformSemantics(params.env)
					});
					if (candidate.valid) await params.validateConfig?.(candidate);
				})(), measureDoctorConfigPreflightStep("admission.plugin-config", () => params.readSnapshot(coreRecovery ? { isolateEnv: true } : void 0))]);
				if (readiness.status === "rejected") throw readiness.reason;
				if (configRead.status === "rejected") throw configRead.reason;
				let read = configRead.value;
				if (isConfigReadFailure(read.snapshot)) throw createConfigReadError(read.snapshot);
				const recovery = await measureDoctorConfigPreflightStep("admission.config-recovery", () => createConfigIO(recoveryOptions).prepareConfigRecovery(read.snapshot));
				if (recovery) read = {
					snapshot: recovery.snapshot,
					pluginMetadataSnapshot: recovery.pluginMetadataSnapshot
				};
				if (read.snapshot.valid) {
					await params.validateConfig?.(read.snapshot);
					await measureDoctorConfigPreflightStep("admission.device-identity", async () => {
						const { loadDeviceIdentityIfPresent } = await import("./device-identity-BlNncs5x.mjs");
						loadDeviceIdentityIfPresent({ env: params.env });
					});
				}
				return {
					...read,
					...recovery ? { recovery } : {}
				};
			}, {
				env: params.env,
				admissionTimeoutMs: STARTUP_STATE_ADMISSION_TIMEOUT_MS,
				reuseCleanClose: true
			}));
			if (params.beforeStatePreparation && !await measureDoctorConfigPreflightStep("admission.config-guard", () => params.beforeStatePreparation?.(admitted.snapshot))) throwStartupMigrationGuardRejected();
			return admitted;
		} catch (error) {
			return rethrowStartupConfigFailure(error);
		}
	});
}
/** Admission runs before lease acquisition: even acquiring a lease commits SQLite writes. */
async function assertStartupStateReady(params) {
	const { assertOpenClawDatabasesReady } = await measureDoctorConfigPreflightStep("admission.database-runtime-import", () => import("./openclaw-database-preflight-D3lTU13W.mjs"));
	const agentCount = listAgentIds(params.cfg).length;
	const admissionMetrics = { agentCount };
	await measureDoctorConfigPreflightStep("admission.database-readiness", () => assertOpenClawDatabasesReady({
		env: params.env,
		config: params.cfg,
		operation: "gateway-startup",
		onAgentInspection: (stats) => {
			Object.assign(admissionMetrics, stats);
		}
	}), void 0, () => admissionMetrics);
	const [{ resolveAllAgentSessionStoreCandidateTargetsSync }, { inspectOpenClawRegisteredAgentDatabases }] = await measureDoctorConfigPreflightStep("admission.session-runtime-import", () => Promise.all([import("./targets-BHY-ArLd.mjs"), import("./openclaw-agent-db-registry-VpOy6WWl.mjs")]));
	const registeredDatabases = await measureDoctorConfigPreflightStep("admission.agent-inventory", () => inspectOpenClawRegisteredAgentDatabases({
		env: params.env,
		includeIncompatibleSchemaVersions: true
	}));
	const targets = await measureDoctorConfigPreflightStep("admission.session-targets", () => resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, {
		env: params.env,
		registeredDatabases
	}).filter((target) => !readAgentDatabaseAdmissionRefusal(target.agentId, { env: params.env })), void 0, () => ({
		agentCount,
		registeredDatabaseCount: registeredDatabases.length
	}));
	await measureDoctorConfigPreflightStep("admission.session-readiness", async () => {
		if (!targets.some(({ storePath }) => isExistingLegacySessionStore(storePath))) return;
		const { assertSessionStoreMigrationComplete } = await measureDoctorConfigPreflightStep("admission.session-migration-runtime-import", () => import("./startup-migration-DdU1d51x.mjs"));
		assertSessionStoreMigrationComplete({
			...params,
			targets
		});
	}, void 0, () => ({ targetCount: targets.length }));
	const { assertConfiguredWorkspaceStateReady } = await measureDoctorConfigPreflightStep("admission.workspace-runtime-import", () => import("./workspace-state-dirs-BTAEPnuh.mjs"));
	await measureDoctorConfigPreflightStep("admission.workspace-readiness", () => assertConfiguredWorkspaceStateReady(params), void 0, () => ({ agentCount }));
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-verification.ts
async function planStartupPluginVerification(params) {
	const { planStartupPluginConvergence } = await measureDoctorConfigPreflightStep("plugin-plan-import", () => import("./startup-plugin-convergence-plan-CFY8zEr1.mjs"), params.measure);
	return await measureDoctorConfigPreflightStep("plugin-plan", () => planStartupPluginConvergence({
		config: params.cfg,
		env: params.env
	}), params.measure);
}
function buildStartupPluginQuarantine(params) {
	return buildDegradedPluginsFromVerificationFailures(params.failures.filter((failure) => resolveEffectiveEnableState({
		id: failure.pluginId,
		origin: "global",
		config: normalizePluginsConfig(params.cfg.plugins),
		rootConfig: params.cfg
	}).enabled));
}
async function runDoctorPluginConvergence(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return { quarantinedPlugins: [] };
	const { inspectPluginMigrationAvailability } = await import("./plugin-migration-availability-BmsH5nns.mjs");
	const isUpdateRehearsal = Boolean(resolveUpdateRehearsalRoot(params.env));
	if (isUpdateRehearsal) note("Plugin refresh deferred to live update finalization; the canary verifies copied plugin payloads without downloading replacements.", `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	const deferredToUpdate = isUpdateRehearsal || shouldDeferConfiguredPluginInstallRepair(params.env);
	if (deferredToUpdate || params.deferPackageRepair) {
		const payloads = await verifyStartupPluginPayloads(params, plan.installRecords);
		const warnings = [];
		if (!deferredToUpdate) {
			const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToHealthFinding } = await import("./missing-configured-plugin-install-BTp4wRrU.mjs");
			for (const issue of await detectConfiguredPluginInstallHealthIssues(params)) {
				const finding = configuredPluginInstallIssueToHealthFinding(issue);
				warnings.push(`${finding.message} ${finding.fixHint ?? ""}`.trim());
			}
			if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
		}
		const { pending, ...migrationInspection } = await inspectPluginMigrationAvailability({
			...params,
			installRecords: plan.installRecords,
			deferInstallation: deferredToUpdate
		});
		return {
			...payloads,
			...warnings.length > 0 ? { warnings } : {},
			migrationInspection,
			deferredPlugins: [...new Map([...payloads.deferredPlugins ?? [], ...pending].map((entry) => [entry.pluginId, deferredToUpdate ? entry : {
				...entry,
				command: "openclaw doctor --fix"
			}])).values()]
		};
	}
	const { runPostCorePluginConvergence } = await measureDoctorConfigPreflightStep("plugin-convergence-import", () => import("./post-core-plugin-convergence-BscHhhrr.mjs"), params.measure);
	const convergence = await measureDoctorConfigPreflightStep("plugin-convergence", () => runPostCorePluginConvergence({
		cfg: params.cfg,
		env: params.env,
		compatibilityHostVersion: resolveCompatibilityHostVersion(params.env)
	}), params.measure);
	if (convergence.changes.length > 0) note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = convergence.notices ?? [];
	if (notices.length > 0) note(notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"), "Doctor notices");
	const warnings = convergence.warnings.map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: convergence.smokeFailures
	});
	const { pending, ...migrationInspection } = await inspectPluginMigrationAvailability({
		...params,
		installRecords: convergence.installRecords,
		deferInstallation: false
	});
	const deferredPlugins = new Map(pending.map((plugin) => [plugin.pluginId, plugin]));
	const deferPlugin = (pluginId, reason) => {
		deferredPlugins.set(pluginId, {
			...deferredPlugins.get(pluginId),
			pluginId,
			reason,
			command: "openclaw update repair"
		});
	};
	for (const warning of convergence.warnings) if (warning.pluginId) deferPlugin(warning.pluginId, warning.reason);
	for (const plugin of quarantinedPlugins) deferPlugin(plugin.pluginId, plugin.diagnostic.detail);
	return {
		...warnings.length > 0 ? { warnings } : {},
		quarantinedPlugins,
		...migrationInspection.requiredPluginIds.length > 0 || migrationInspection.inspectionRequiredPluginIds.length > 0 || migrationInspection.statelessPlugins.length > 0 ? { migrationInspection } : {},
		...deferredPlugins.size > 0 ? { deferredPlugins: [...deferredPlugins.values()] } : {}
	};
}
async function refreshStartupPluginQuarantine(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return { quarantinedPlugins: [] };
	if (resolveUpdateRehearsalRoot(params.env) || shouldDeferConfiguredPluginInstallRepair(params.env)) return verifyStartupPluginPayloads(params, plan.installRecords);
	const warnings = [];
	const { maybeRepairPluginOpenClawHostLinks } = await import("./doctor-plugin-host-links-bQkkJe1C.mjs");
	let effectFailure;
	try {
		await maybeRepairPluginOpenClawHostLinks({
			env: params.env,
			installRecords: plan.installRecords,
			prompter: { shouldRepair: true },
			beforePersistentEffect: async () => {
				if (effectFailure) throw effectFailure.error;
				try {
					await params.beforePersistentEffect?.();
				} catch (error) {
					effectFailure = { error };
					throw error;
				}
			}
		});
	} catch (error) {
		if (effectFailure) throw effectFailure.error;
		warnings.push(`Could not repair OpenClaw host links: ${String(error)}. Run openclaw doctor --fix.`);
	}
	const verification = await verifyStartupPluginPayloads(params, plan.installRecords);
	return {
		...verification,
		...warnings.length > 0 ? { warnings: [...warnings, ...verification.warnings ?? []] } : {}
	};
}
async function verifyStartupPluginPayloads(params, records) {
	const { runActivePluginPayloadSmokeCheck } = await measureDoctorConfigPreflightStep("plugin-payload-verification-import", () => import("./active-payload-verification-1n2wu6Ks.mjs"), params.measure);
	const smoke = await measureDoctorConfigPreflightStep("plugin-payload-verification", () => runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records,
		env: params.env
	}), params.measure);
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: smoke.failures
	});
	if (quarantinedPlugins.length > 0) note(quarantinedPlugins.map((plugin) => `- ${describePluginAvailabilityFailure(plugin.pluginId, formatPluginVerificationDiagnostic(plugin.diagnostic)).message}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	return {
		quarantinedPlugins,
		deferredPlugins: quarantinedPlugins.map((plugin) => ({
			pluginId: plugin.pluginId,
			reason: plugin.diagnostic.detail,
			command: "openclaw update repair"
		}))
	};
}
//#endregion
export { measureDoctorConfigPreflightStep as a, readAdmittedConfigSnapshot as i, runDoctorPluginConvergence as n, createConfigPreflightSnapshotReader as r, refreshStartupPluginQuarantine as t };
