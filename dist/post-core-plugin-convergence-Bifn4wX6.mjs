import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-jg_14gWz.mjs";
import { a as resolveDefaultPluginExtensionsDir, s as resolveDefaultPluginNpmDir } from "./install-paths-CulPgmRu.mjs";
import { o as reconcileRegisteredOpenClawHostLinks, s as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-U6n90-r7.mjs";
import { u as listManagedPluginNpmRoots } from "./managed-npm-retention-DL_TwTTS.mjs";
import "./capability-consent-error-details-DqbomXex.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { m as resolvePostCoreConvergenceEnv, u as isPostCoreConvergencePass } from "./update-phase-M5rvMZiC.mjs";
import { n as recoverInstalledPluginConfigIds } from "./installed-plugin-id-recovery-CM-iJWF3.mjs";
import { n as runActivePluginPayloadSmokeCheck, t as filterRecordsToActive } from "./active-payload-verification-FFjhpVUe.mjs";
import { t as detectPluginVersionDrift } from "./plugin-version-drift-CDS-f9Kk.mjs";
import { o as pruneStaleLocalBundledPluginInstallRecords, r as maybeRepairStaleManagedNpmBundledPlugins } from "./doctor-plugin-registry-4GHEwsm1.mjs";
import { t as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-lupDczXs.mjs";
import path from "node:path";
//#region src/commands/doctor/shared/post-core-plugin-convergence.ts
const REPAIR_GUIDANCE = "Run `openclaw update repair` to retry plugin repair.";
const inspectGuidance = (pluginId) => `Run \`openclaw plugins inspect ${pluginId} --runtime --json\` for details.`;
function convergenceNotice(message, guidance) {
	return {
		reason: message,
		message,
		guidance
	};
}
function smokeFailureGuidance(failure) {
	if (failure.reason !== "unreadable-package-json") return [REPAIR_GUIDANCE, inspectGuidance(failure.pluginId)];
	return [`Fix file access for ${failure.installPath ? path.join(failure.installPath, "package.json") : "the plugin package.json"} so it is readable by the user running OpenClaw. For EACCES or EPERM, correct its ownership or permissions; otherwise resolve the reported filesystem I/O error, then retry.`, inspectGuidance(failure.pluginId)];
}
async function repairInstalledOpenClawHostLinks(params) {
	const packageReadFailures = [];
	let effectFailure;
	const beforePersistentEffect = params.beforePersistentEffect ? () => {
		if (effectFailure) throw effectFailure.error;
		try {
			params.beforePersistentEffect?.();
		} catch (error) {
			effectFailure ??= { error };
			throw effectFailure.error;
		}
	} : void 0;
	const onPackageReadError = (error, packageDir) => {
		packageReadFailures.push({
			error,
			packageDir
		});
	};
	try {
		const npmRoots = await listManagedPluginNpmRoots(resolveDefaultPluginNpmDir(params.env));
		const results = await Promise.allSettled(npmRoots.map((npmRoot) => relinkOpenClawPeerDependenciesInManagedNpmRoot({
			npmRoot,
			beforePersistentApply: beforePersistentEffect,
			logger: {},
			onPackageReadError
		})));
		if (effectFailure) throw effectFailure.error;
		let repaired = 0;
		for (const result of results) {
			if (result.status === "rejected") throw result.reason;
			repaired += result.value.repaired;
		}
		const registeredRepair = await reconcileRegisteredOpenClawHostLinks({
			installRecords: params.installRecords,
			extensionsDir: resolveDefaultPluginExtensionsDir(params.env),
			env: params.env,
			mode: "repair",
			beforePersistentApply: beforePersistentEffect,
			onPackageReadError
		});
		return {
			changes: [...repaired > 0 ? [`Repaired OpenClaw host peer link(s) for ${repaired} managed npm plugin package(s).`] : [], ...registeredRepair.repaired > 0 ? [`Repaired OpenClaw host peer link(s) for ${registeredRepair.repaired} registered plugin package(s).`] : []],
			warnings: [],
			packageReadFailures
		};
	} catch (err) {
		if (effectFailure) throw effectFailure.error;
		beforePersistentEffect?.();
		return {
			changes: [],
			warnings: [formatPeerLinkPackageReadWarning({ error: err })],
			packageReadFailures
		};
	}
}
function formatPeerLinkPackageReadWarning(failure) {
	return convergenceNotice(`Failed to repair installed OpenClaw host peer links: ${failure.error instanceof Error ? failure.error.message : String(failure.error)}`, [REPAIR_GUIDANCE]);
}
/**
* Mandatory post-core convergence pass. Runs AFTER the core package files
* are swapped and the in-update doctor pass has already returned, but BEFORE
* the gateway is restarted. Transient repair fetch failures stay nonblocking;
* consent that prevents activation and payload smoke failures are errors.
* Gateway startup quarantines known payload failures before any module import,
* then boots with those plugins marked configured-unavailable.
*/
async function runPostCorePluginConvergence(params) {
	return await withPluginLifecycleLease({
		env: params.env,
		assertCurrent: params.beforePersistentEffect
	}, (lease) => runPostCorePluginConvergenceWithLease({
		...params,
		beforePersistentEffect: () => lease.assertOwned()
	}));
}
async function runPostCorePluginConvergenceWithLease(params) {
	const env = resolvePostCoreConvergenceEnv(params.env, params.compatibilityHostVersion);
	const repairVersionDrift = isPostCoreConvergencePass(params.env);
	params.beforePersistentEffect?.();
	const staleManagedNpmBundledPluginRepair = maybeRepairStaleManagedNpmBundledPlugins({
		config: params.cfg,
		env,
		prompter: { shouldRepair: true },
		...params.baselineInstallRecords ? { installRecords: params.baselineInstallRecords } : {}
	});
	const convergenceBaseline = staleManagedNpmBundledPluginRepair?.installRecords ?? params.baselineInstallRecords;
	const prunedBaseline = convergenceBaseline ? pruneStaleLocalBundledPluginInstallRecords({
		installRecords: convergenceBaseline,
		env
	}) : null;
	const warnings = [];
	const repair = await repairMissingConfiguredPluginInstalls({
		cfg: params.cfg,
		repairVersionDrift,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		env,
		...prunedBaseline ? { baselineRecords: prunedBaseline.records } : {},
		onCapabilityConsent: params.onCapabilityConsent,
		onWarning: ({ message, pluginId }) => {
			warnings.push({
				...pluginId ? {
					kind: "repair",
					pluginId
				} : {},
				reason: message,
				message,
				guidance: [REPAIR_GUIDANCE]
			});
		},
		beforePersistentEffect: params.beforePersistentEffect
	});
	params.beforePersistentEffect?.();
	const peerLinkRepair = await repairInstalledOpenClawHostLinks({
		env,
		installRecords: repair.records,
		beforePersistentEffect: params.beforePersistentEffect
	});
	params.beforePersistentEffect?.();
	warnings.push(...peerLinkRepair.warnings);
	const notices = (repair.notices ?? []).map((message) => convergenceNotice(message, []));
	const records = repair.records;
	const recovered = params.configPersistence === "caller" ? await recoverInstalledPluginConfigIds(params.cfg, env) : {
		config: params.cfg,
		changes: [],
		notices: [],
		recovery: /* @__PURE__ */ new Map()
	};
	params.beforePersistentEffect?.();
	notices.push(...recovered.notices.map((message) => convergenceNotice(message, [REPAIR_GUIDANCE])));
	const smoke = await runActivePluginPayloadSmokeCheck({
		cfg: recovered.config,
		records,
		env
	});
	const smokeRecords = filterRecordsToActive({
		cfg: recovered.config,
		records,
		env
	});
	if (repairVersionDrift) for (const drift of detectPluginVersionDrift({
		gatewayVersion: resolveCompatibilityHostVersion(env),
		installRecords: smokeRecords,
		config: recovered.config
	}).drifts) {
		if (drift.source !== "npm") continue;
		warnings.push({
			kind: "repair",
			pluginId: drift.pluginId,
			reason: "plugin-version-mismatch",
			message: `Plugin "${drift.pluginId}" remains at ${drift.installedVersion} after the core update to ${drift.gatewayVersion}.`,
			guidance: [REPAIR_GUIDANCE]
		});
	}
	const resolveInstallRecordPaths = (installRecords) => new Set(Object.values(installRecords).flatMap((record) => {
		const installPath = record.installPath?.trim();
		return installPath ? [path.resolve(resolveUserPath(installPath, env))] : [];
	}));
	const knownInstallPaths = resolveInstallRecordPaths(records);
	const activeInstallPaths = resolveInstallRecordPaths(smokeRecords);
	const smokeFailureInstallPaths = new Set(smoke.failures.flatMap((failure) => failure.installPath ? [path.resolve(failure.installPath)] : []));
	for (const failure of peerLinkRepair.packageReadFailures.toSorted((left, right) => left.packageDir.localeCompare(right.packageDir))) {
		const packageDir = path.resolve(failure.packageDir);
		const hasTypedFailure = smokeFailureInstallPaths.has(packageDir);
		const belongsToInactivePlugin = knownInstallPaths.has(packageDir) && !activeInstallPaths.has(packageDir);
		if (!hasTypedFailure && !belongsToInactivePlugin) warnings.push(formatPeerLinkPackageReadWarning(failure));
	}
	for (const failure of smoke.failures) warnings.push({
		kind: "load",
		pluginId: failure.pluginId,
		reason: `${failure.reason}: ${failure.detail}`,
		message: `Plugin "${failure.pluginId}" failed post-core payload smoke check (${failure.reason}): ${failure.detail}`,
		guidance: smokeFailureGuidance(failure)
	});
	return {
		config: recovered.config,
		configChanges: recovered.changes,
		installedPluginIdRecovery: recovered.recovery,
		changes: [
			...staleManagedNpmBundledPluginRepair?.removedPluginIds.map((pluginId) => `Removed stale managed install record for bundled plugin "${pluginId}".`) ?? [],
			...prunedBaseline?.stale.map((record) => `Removed stale local bundled plugin install record "${record.pluginId}".`) ?? [],
			...repair.changes,
			...peerLinkRepair.changes
		],
		notices,
		warnings,
		outcomes: repair.outcomes,
		...repair.repairedPluginIds?.length ? { repairedPluginIds: repair.repairedPluginIds } : {},
		errored: repair.outcomes?.some((outcome) => outcome.status === "error" && outcome.code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED") === true || smoke.failures.length > 0,
		smokeFailures: smoke.failures,
		installRecords: records
	};
}
//#endregion
export { runPostCorePluginConvergence as t };
