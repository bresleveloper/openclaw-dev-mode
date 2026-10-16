import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { i as stripAnsi } from "./ansi-BeFJ0Uu7.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as getLogger } from "./logger-Mnn26Jj7.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { d as resolveRegistryUpdateChannel } from "./update-channels-BquD107I.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-eI0vGW6V.mjs";
import { f as resolvePostCoreConvergenceEnv } from "./update-phase-BClSJ17n.mjs";
import "./managed-child-process-DzXLUTpR.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { r as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-DRa6WG1g.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { n as getDeferredPluginMigrationConfigFacts, o as setDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { i as withoutPluginInstallRecords, r as withPluginInstallRecords } from "./installed-plugin-index-records-VCj98mZ6.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { t as isRecord$1 } from "./record-shared-D7QlEuV3.mjs";
import "./shared-CiAI6uii.mjs";
import { c as withUpdateConfigWriteAuthority } from "./update-command-config-DVVxubY4.mjs";
import "./update-command-service-maintenance-Bc6Zm_Kc.mjs";
import { n as withGatewayRuntimeArtifactPublication } from "./update-command-service-publication-CRHfFdIc.mjs";
import { n as assessPluginUpdate, o as createPluginUpdateWarning, r as buildInvalidConfigPostCoreUpdateResult } from "./update-command-plugins-internals-CcrNnWB5.mjs";
import { F as attachPluginInstallOwnerMigrations, z as resolvePluginInstallOwnerMigrations } from "./npm-managed-root-f7M5m6yA.mjs";
import { t as comparePackageUpdateVersions } from "./package-update-utils-CEpDQ5XC.mjs";
import { i as restoreDoctorConfigEnvRefs, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-ZXEVMxo9.mjs";
import { t as assertInstalledPluginIdRecoveryCurrent } from "./installed-plugin-id-recovery-CjK88Neg.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-fjtOrSJ6.mjs";
import { t as collectMissingPluginInstallPayloads } from "./payload-verification-DenWO8lB.mjs";
import { _ as resolveExactNpmSpecVersion, b as resolveNpmSpecPackageName, d as isPluginInstallRecordUpdateSource, r as resolveOfficialPluginCohortNpmSpecs } from "./plugin-version-drift-BsJ4AHQ4.mjs";
import { n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome, t as syncPluginsForUpdateChannel } from "./update-6VE9BzxJ.mjs";
import { t as runPostCorePluginConvergence } from "./post-core-plugin-convergence-D9aZ5Ssz.mjs";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-I97ACS0P.mjs";
import { t as listPersistedBundledPluginLocationBridges } from "./location-bridges-6RE48Rni.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-jgowtM4M.mjs";
import { r as reconcilePluginPackageUpdateConfig, t as capturePluginPackageUpdateSnapshot } from "./plugin-package-update-DQMDqz5A.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-C9XqXUw9.mjs";
import fs, { existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { acquireFileLock } from "@openclaw/fs-safe/file-lock";
import { root } from "@openclaw/fs-safe/root";
//#region scripts/lib/repo-root.mjs
/** Finds the checkout containing a directory, including linked worktrees. */
function findRepoRoot(startDir) {
	let dir = path.resolve(startDir);
	const { root } = path.parse(dir);
	while (dir !== root) {
		if (existsSync(path.join(dir, ".git")) || existsSync(path.join(dir, "package.json")) && existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir;
		dir = path.dirname(dir);
	}
}
//#endregion
//#region scripts/lib/dist-artifact-lock.mts
const DIST_ARTIFACT_LOCK_PATH = ".artifacts/dist-artifacts.lock";
const LOCK_POLL_MS = 500;
function resolveDistArtifactLockPath(rootDir) {
	return path.join(findRepoRoot(rootDir) ?? rootDir, DIST_ARTIFACT_LOCK_PATH);
}
async function acquireDistArtifactOwnership(rootDir, wait = false, signal) {
	const directory = resolveDistArtifactLockPath(fs.realpathSync(rootDir));
	const ownerPath = path.join(directory, "owner.json");
	let reportedWait = false;
	let owner;
	let lock;
	try {
		fs.mkdirSync(directory, { recursive: true });
		const lockRoot = await root(directory);
		while (true) {
			signal?.throwIfAborted();
			try {
				lock = await acquireFileLock(ownerPath, {
					lockPath: ownerPath,
					retainOnExit: true,
					lockRoot,
					payload: () => ({
						pid: process.pid,
						startedAt: (/* @__PURE__ */ new Date()).toISOString()
					}),
					timeoutMs: wait ? signal ? LOCK_POLL_MS : Number.POSITIVE_INFINITY : 0,
					retry: {
						minTimeout: LOCK_POLL_MS,
						maxTimeout: LOCK_POLL_MS,
						factor: 1
					},
					staleRecovery: "fail-closed",
					shouldReclaim: ({ payload }) => {
						owner = payload;
						const pid = payload && typeof payload === "object" && "pid" in payload ? payload.pid : null;
						if (typeof pid !== "number" || !Number.isSafeInteger(pid) || pid <= 1 || pid > 2147483647) return true;
						try {
							process.kill(pid, 0);
						} catch {
							return true;
						}
						if (fs.existsSync(path.join(directory, "unjoined"))) return true;
						if (!reportedWait) {
							console.error(`[dist artifacts] waiting for checkout ownership: ${directory}`);
							reportedWait = true;
						}
						return false;
					}
				});
				break;
			} catch (error) {
				if (!wait || !signal || !error || typeof error !== "object" || !("code" in error) || error.code !== "file_lock_timeout") throw error;
			}
		}
	} catch (error) {
		if (signal?.aborted && error === signal.reason) throw error;
		if (!fs.existsSync(ownerPath)) throw new Error(`Could not acquire ${directory}: ${String(error)}. Resolve this filesystem error and retry before stopping the Gateway.`, { cause: error });
		try {
			owner ??= JSON.parse(fs.readFileSync(ownerPath, "utf8"));
		} catch {}
		const record = isRecord$1(owner) ? owner : {};
		const pid = record.pid ?? "unknown";
		const started = record.startedAt ?? "unknown";
		const identity = record.startIdentity ?? record.starttime ?? "unknown";
		const lastSeen = record.heartbeatAt ?? record.heartbeat ?? started;
		const release = process.platform === "win32" ? `Remove-Item -LiteralPath '${directory.replaceAll("'", "''")}' -Recurse -Force` : `rm -rf -- '${directory.replaceAll("'", "'\\''")}'`;
		throw new Error(`Could not acquire ${directory}: retained by PID ${JSON.stringify(pid)}, started ${JSON.stringify(started)}, identity ${JSON.stringify(identity)}, last seen ${JSON.stringify(lastSeen)}. Inspect owner.json and verify all associated build/check processes, including detached descendants, have stopped; then run \`${release}\` to release and retry. PID death alone is not sufficient.`, { cause: error });
	}
	if (signal?.aborted) {
		await lock.release();
		signal.throwIfAborted();
	}
	return lock;
}
//#endregion
//#region scripts/lib/source-update-artifact-preflight.mts
const hasPreparation = (value) => isRecord$1(value) && typeof value.prepareBundledPluginRuntime === "function";
async function loadSourceRuntimePreparation(root) {
	const stagingFile = path.join(root, "scripts", "stage-bundled-plugin-runtime.mts");
	try {
		fs.lstatSync(stagingFile);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	}
	const staging = await import(pathToFileURL(stagingFile).href);
	if (hasPreparation(staging)) return staging.prepareBundledPluginRuntime;
	if (isRecord$1(staging) && staging.prepareBundledPluginRuntime === void 0 && typeof staging.stageBundledPluginRuntime === "function") return;
	throw new Error(`Installed runtime staging is unavailable: ${stagingFile}`);
}
/** Inspect without publishing while the caller retains checkout artifact ownership. */
async function inspectOwnedSourceUpdateArtifacts(root, assertCurrent = () => {}) {
	assertCurrent();
	const prepare = await loadSourceRuntimePreparation(root);
	assertCurrent();
	const prepared = prepare?.({ repoRoot: root });
	await prepared?.cleanup();
	assertCurrent();
	return !prepared?.changed;
}
async function inspectSourceUpdateArtifacts(rootDir) {
	if (!fs.existsSync(path.join(rootDir, ".git"))) return {
		sourceRuntimePrepared: true,
		lock: void 0
	};
	const root = fs.realpathSync(rootDir);
	const lock = await acquireDistArtifactOwnership(root);
	try {
		return {
			sourceRuntimePrepared: await inspectOwnedSourceUpdateArtifacts(root),
			lock
		};
	} catch (error) {
		await lock.release();
		throw error;
	}
}
//#endregion
//#region src/cli/update-cli/update-command-runtime.ts
async function releaseLegacySourceLock(root, lock) {
	const consumer = path.join(root, "scripts/lib/source-update-artifact-preflight.mts");
	if (lock && !existsSync(consumer)) await lock.release();
}
function isSourceArtifactOwnership(value) {
	return isRecord(value) && typeof value.withDistArtifactOwnership === "function";
}
/** Complete source-install artifacts before the target loads plugin configuration. */
async function completeSourceUpdateRuntime(params) {
	params.lease.assertOwned();
	if (params.sourceRuntimePrepared === true) return { changed: false };
	if (await resolveUpdateInstallKind(params.root, {
		signal: params.lease.signal,
		timeoutMs: params.timeoutMs
	}) !== "git") {
		params.lease.assertOwned();
		return { changed: false };
	}
	const root = await fs$1.realpath(params.root);
	params.lease.assertOwned();
	const prepare = await loadSourceRuntimePreparation(root);
	params.lease.assertOwned();
	if (!prepare) return { changed: false };
	const complete = async () => {
		params.lease.assertOwned();
		const prepared = prepare({ repoRoot: root });
		try {
			params.lease.assertOwned();
			if (prepared.changed) {
				await params.beforePublication?.();
				params.lease.assertOwned();
				const publicationFailures = [];
				try {
					await withGatewayRuntimeArtifactPublication({
						root,
						env: process.env,
						timeoutMs: params.timeoutMs,
						assertCurrent: () => params.lease.assertOwned()
					}, async (assertPublicationCurrent) => {
						params.lease.renew?.();
						await prepared.publish(async () => {
							await params.beforePersistentEffect?.();
							await assertPublicationCurrent();
							params.lease.assertOwned();
						});
					});
				} catch (error) {
					publicationFailures.push(error);
				}
				try {
					params.lease.renew?.();
				} catch (error) {
					if (!publicationFailures.includes(error)) publicationFailures.push(error);
				}
				throwSqliteLifecycleErrors(publicationFailures, "Runtime publication and plugin lease renewal restoration failed.");
			}
		} catch (error) {
			try {
				await prepared.cleanup();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Runtime completion and staging cleanup failed.", { cause: cleanupError });
			}
			throw error;
		}
		await prepared.cleanup();
		return { changed: prepared.changed };
	};
	if (params.sourceRuntimePrepared === false) return await complete();
	const ownership = await import(pathToFileURL(path.join(root, "scripts", "lib", "dist-artifact-ownership.mts")).href);
	params.lease.assertOwned();
	if (!isSourceArtifactOwnership(ownership)) throw new Error("The installed source checkout cannot complete its runtime artifacts.");
	return await ownership.withDistArtifactOwnership(root, complete);
}
//#endregion
//#region src/cli/update-cli/update-command-maintenance.ts
/** Restore service custody only after update and Doctor commands have settled. */
async function settleUpdateDoctorMaintenance(outcome, restore, release, failureMessage) {
	const failures = "error" in outcome ? [outcome.error] : [];
	for (const operation of [restore, release]) {
		if (failures.some(hasCommandProcessCleanupError)) break;
		try {
			await withCommandProcessScope(operation);
		} catch (error) {
			if (!failures.includes(error)) failures.push(error);
		}
	}
	return failures.length ? { error: failures.length === 1 ? failures[0] : new AggregateError(failures, failureMessage, { cause: failures[0] }) } : outcome;
}
//#endregion
//#region src/plugins/update-cohort.ts
/** Aligns managed plugin install sources and official packages with one core release cohort. */
async function convergePluginReleaseCohort(params) {
	return await withPluginLifecycleLease({
		env: params.env,
		assertCurrent: params.beforePersistentEffect
	}, () => convergePluginReleaseCohortWithLease(params));
}
async function convergePluginReleaseCohortWithLease(params) {
	const operatorManaged = [];
	const operatorManagedIds = /* @__PURE__ */ new Set();
	const loadFreshIndex = (config) => withPluginCache(createPluginCache(), () => loadInstalledPluginIndex({
		config,
		installRecords: config.plugins?.installs ?? {},
		workspaceDir: params.workspaceDir,
		env: params.env
	}));
	if (params.config.plugins?.load?.paths?.length) {
		const index = loadFreshIndex(params.config);
		const resolver = createInstalledPluginOwnershipResolver(index, params.env);
		for (const plugin of index.plugins) {
			if (plugin.origin !== "config") continue;
			const resolved = resolver.resolveUpdate(plugin.pluginId);
			if (!resolved.ok) throw new Error(resolved.error);
			if (resolved.value.kind !== "operator-managed") continue;
			const { source, rootDir, shadowedInstallOwner, shadowedInstallRecord } = resolved.value;
			operatorManagedIds.add(plugin.pluginId);
			if (shadowedInstallOwner) operatorManagedIds.add(shadowedInstallOwner);
			const shadowed = shadowedInstallRecord ? ` It shadows the ${shadowedInstallRecord.source} install ${shadowedInstallRecord.spec ?? plugin.pluginId}${shadowedInstallRecord.installPath ? ` at ${shadowedInstallRecord.installPath}` : ""}.` : "";
			const guidance = `This copy was not updated; verify it against ${params.coreVersion ?? "the updated OpenClaw version"} or remove it from plugins.load.paths.`;
			const message = `Plugin "${plugin.pluginId}" is operator-managed by plugins.load.paths. ${guidance} Source: ${rootDir}.${shadowed}`;
			operatorManaged.push({
				pluginId: plugin.pluginId,
				status: "skipped",
				code: "plugin-operator-managed",
				source,
				rootDir,
				shadowedInstallOwner,
				shadowedInstallRecord,
				message,
				guidance: [guidance]
			});
			params.logger?.warn?.(message);
		}
	}
	const sync = await syncPluginsForUpdateChannel({
		config: params.config,
		channel: params.channel,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		coreVersion: params.coreVersion,
		skipIds: operatorManagedIds,
		workspaceDir: params.workspaceDir,
		env: params.env,
		externalizedBundledPluginBridges: params.externalizedBundledPluginBridges,
		logger: params.logger,
		onCapabilityConsent: params.onCapabilityConsent,
		beforePersistentEffect: params.beforePersistentEffect
	});
	params.beforePersistentEffect?.();
	let config = sync.config;
	const npmInstallSpecOverrides = params.coreVersion ? resolveOfficialPluginCohortNpmSpecs({
		gatewayVersion: params.coreVersion,
		installRecords: config.plugins?.installs ?? {},
		config
	}) : void 0;
	let changed = sync.changed;
	let npmChanged = false;
	let installOwners = Object.entries(config.plugins?.installs ?? {}).filter(([id, record]) => !operatorManagedIds.has(id) && isPluginInstallRecordUpdateSource(record)).map(([id]) => id);
	if (installOwners.length > 0) {
		const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
			config,
			installRecords: config.plugins?.installs ?? {},
			env: params.env
		});
		installOwners = installOwners.filter((id) => !sourceBundledIds.has(id));
	}
	const beforeIndex = installOwners.length ? loadFreshIndex(config) : void 0;
	const packageUpdateSnapshot = beforeIndex ? capturePluginPackageUpdateSnapshot({
		index: beforeIndex,
		installOwners,
		env: params.env
	}) : void 0;
	if (packageUpdateSnapshot && !packageUpdateSnapshot.ok) throw new Error(packageUpdateSnapshot.error);
	const installOwnerMigrations = {};
	const missingPayloads = (await collectMissingPluginInstallPayloads({
		records: config.plugins?.installs ?? {},
		config,
		skipDisabledPlugins: true,
		syncOfficialPluginInstalls: true,
		env: params.env
	})).filter((entry) => !operatorManagedIds.has(entry.pluginId));
	const repairedMissingPayloadIds = new Set(missingPayloads.map((entry) => entry.pluginId));
	const updateInstalled = async (selection) => {
		const result = await updateNpmInstalledPlugins({
			config,
			npmInstallSpecOverrides,
			...selection,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			updateChannel: params.channel,
			coreVersion: params.coreVersion,
			versionBoundPluginIds: params.versionBoundPluginIds,
			skipDisabledPlugins: true,
			syncOfficialPluginInstalls: true,
			retainOnUnavailable: true,
			logger: params.logger,
			onIntegrityDrift: params.onIntegrityDrift,
			onCapabilityConsent: params.onCapabilityConsent,
			beforePersistentEffect: params.beforePersistentEffect
		});
		params.beforePersistentEffect?.();
		config = result.config;
		changed ||= result.changed;
		npmChanged ||= result.changed;
		Object.assign(installOwnerMigrations, resolvePluginInstallOwnerMigrations(result));
		return result.outcomes;
	};
	const repairOutcomes = repairedMissingPayloadIds.size ? await updateInstalled({ pluginIds: [...repairedMissingPayloadIds] }) : [];
	const updateOutcomes = await updateInstalled({ skipIds: /* @__PURE__ */ new Set([
		...operatorManagedIds,
		...sync.summary.switchedToClawHub,
		...sync.summary.switchedToNpm,
		...repairedMissingPayloadIds,
		...Object.values(installOwnerMigrations)
	]) });
	if (beforeIndex && packageUpdateSnapshot) {
		const afterIndex = loadFreshIndex(config);
		const reconciled = reconcilePluginPackageUpdateConfig({
			config,
			beforeIndex,
			afterIndex,
			snapshot: packageUpdateSnapshot.value,
			installOwnerMigrations,
			env: params.env
		});
		if (!reconciled.ok) throw new Error(reconciled.error);
		changed ||= reconciled.config !== config;
		config = reconciled.config;
	}
	const result = {
		config,
		changed,
		npmChanged,
		sync,
		missingPayloads,
		repairedMissingPayloadIds,
		repairOutcomes,
		updateOutcomes: [...operatorManaged, ...updateOutcomes.filter((outcome) => !operatorManagedIds.has(outcome.pluginId) && (outcome.status !== "skipped" || !repairedMissingPayloadIds.has(outcome.pluginId)))],
		remainingMissingPayloads: (await collectMissingPluginInstallPayloads({
			records: config.plugins?.installs ?? {},
			config,
			skipDisabledPlugins: true,
			syncOfficialPluginInstalls: true,
			env: params.env
		})).filter((entry) => !operatorManagedIds.has(entry.pluginId))
	};
	return Object.keys(installOwnerMigrations).length > 0 ? attachPluginInstallOwnerMigrations(result, installOwnerMigrations) : result;
}
//#endregion
//#region src/cli/update-cli/update-command-plugins.ts
function formatMissingPluginPayloadReason(entry) {
	if (entry.reason === "missing-install-path") return "installPath is missing";
	if (entry.reason === "missing-package-json") return `package.json is missing under ${entry.installPath}`;
	return `package directory is missing: ${entry.installPath}`;
}
function isDisabledAfterFailureOutcome(outcome) {
	return outcome.status === "skipped" && outcome.message.includes("after plugin update failure");
}
function isActionableSkippedPostUpdateOutcome(outcome) {
	return isDisabledAfterFailureOutcome(outcome) || isClawHubTrustSkippedOutcome(outcome);
}
async function updatePluginsAfterCoreUpdate(params) {
	if (!params.configSnapshot.valid) return await updatePluginsAfterCoreUpdateWithLease(params);
	return await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, (lease) => updatePluginsAfterCoreUpdateWithLease({
		...params,
		assertCurrent: () => lease.assertOwned()
	}));
}
async function updatePluginsAfterCoreUpdateWithLease(params) {
	params.assertCurrent?.();
	const runtime = params.runtime ?? defaultRuntime;
	const requirements = { ...params.pluginRequirements };
	if (!params.configSnapshot.valid) {
		const invalid = buildInvalidConfigPostCoreUpdateResult(params.configSnapshot);
		if (!params.json) {
			runtime.log(theme.error(invalid.message));
			for (const line of invalid.guidance) runtime.log(theme.muted(`  ${line}`));
		}
		return {
			...invalid.result,
			assessment: {
				kind: "core-critical",
				reason: invalid.result.reason
			}
		};
	}
	const referenceSource = prepareDoctorConfigReferenceSource(params.configSnapshot);
	const clawHubTrustNotices = /* @__PURE__ */ new Set();
	const loggedPluginWarnings = /* @__PURE__ */ new Set();
	const logPluginWarning = (message) => {
		const plain = stripAnsi(message);
		if (!params.json && !loggedPluginWarnings.has(plain)) {
			runtime.log(message.includes("╭─") ? message : theme.warn(message));
			loggedPluginWarnings.add(plain);
		}
	};
	const pluginLogger = {
		...params.json ? { terminalLinks: false } : {},
		info: (msg) => {
			if (!params.json) runtime.log(msg);
		},
		warn: (msg) => {
			const plain = stripAnsi(msg);
			if (plain.includes("ClawHub Security Audit") && (params.json || plain.includes("Outcome: Review"))) clawHubTrustNotices.add(plain);
			if (plain.includes("ClawHub") && plain.includes("╭─")) logPluginWarning(msg);
		}
	};
	if (!params.json) {
		runtime.log("");
		runtime.log(theme.heading("Updating plugins..."));
	}
	let warnings = [];
	const capabilityConsent = params.onCapabilityConsent ? { onCapabilityConsent: params.onCapabilityConsent } : resolvePluginCapabilityConsentCliOptions({
		acceptCapabilities: params.acceptCapabilities,
		action: "update",
		allowPrompt: !params.json,
		runtime
	});
	const pluginInstallRecords = params.pluginInstallRecords ?? await loadInstalledPluginIndexInstallRecords();
	const coreVersion = await readPackageVersion(params.root);
	const pluginUpdateChannel = resolveRegistryUpdateChannel({
		configChannel: params.channel,
		currentVersion: coreVersion
	});
	const integrityDrifts = [];
	const pluginUpdateOutcomes = [];
	const collectPluginOutcome = (outcome) => {
		if (outcome.status === "skipped" && outcome.code === "plugin-operator-managed") warnings.push({
			pluginId: outcome.pluginId,
			source: outcome.rootDir,
			reason: outcome.code,
			message: outcome.message,
			guidance: outcome.guidance
		});
		if (outcome.status !== "error" && !isActionableSkippedPostUpdateOutcome(outcome)) {
			pluginUpdateOutcomes.push(outcome);
			return;
		}
		const includeWarningInReason = params.json || !outcome.warning || !loggedPluginWarnings.has(stripAnsi(outcome.warning));
		const warning = createPluginUpdateWarning({
			...outcome.pluginId && outcome.pluginId !== "unknown" ? { pluginId: outcome.pluginId } : {},
			reason: outcome.warning && includeWarningInReason ? `${outcome.warning}\n${outcome.message}` : outcome.message
		});
		pluginUpdateOutcomes.push(outcome);
		warnings.push(warning);
	};
	const collectMissingPayloadOutcome = (entry) => {
		const warning = createPluginUpdateWarning({
			pluginId: entry.pluginId,
			reason: `Plugin install payload missing after update: ${formatMissingPluginPayloadReason(entry)}.`,
			kind: "load"
		});
		warnings.push(warning);
		pluginUpdateOutcomes.push({
			pluginId: entry.pluginId,
			status: "error",
			message: warning.message
		});
	};
	const onPluginIntegrityDrift = async (drift) => {
		integrityDrifts.push({
			pluginId: drift.pluginId,
			spec: drift.spec,
			expectedIntegrity: drift.expectedIntegrity,
			actualIntegrity: drift.actualIntegrity,
			...drift.resolvedSpec ? { resolvedSpec: drift.resolvedSpec } : {},
			...drift.resolvedVersion ? { resolvedVersion: drift.resolvedVersion } : {},
			action: "aborted"
		});
		return false;
	};
	const externalizedBundledPluginBridges = await listPersistedBundledPluginLocationBridges({ workspaceDir: params.root });
	params.assertCurrent?.();
	const cohort = await convergePluginReleaseCohort({
		config: withPluginInstallRecords(params.configSnapshot.sourceConfig, pluginInstallRecords),
		channel: pluginUpdateChannel,
		coreVersion: coreVersion ?? void 0,
		versionBoundPluginIds: VERSION_BOUND_RUNTIME_PLUGIN_IDS,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		workspaceDir: params.root,
		externalizedBundledPluginBridges,
		beforePersistentEffect: params.assertCurrent,
		logger: pluginLogger,
		onIntegrityDrift: onPluginIntegrityDrift,
		...capabilityConsent
	});
	params.assertCurrent?.();
	for (const error of cohort.sync.summary.errors) collectPluginOutcome({
		...error,
		status: "error"
	});
	for (const warning of cohort.sync.summary.warnings) getLogger().warn(warning);
	let pluginConfig = cohort.config;
	let pluginsChanged = cohort.changed || params.configChanged === true;
	for (const entry of cohort.missingPayloads) collectMissingPayloadOutcome(entry);
	pluginUpdateOutcomes.push(...cohort.repairOutcomes);
	for (const rawOutcome of cohort.updateOutcomes) collectPluginOutcome(rawOutcome);
	for (const entry of cohort.remainingMissingPayloads) if (!cohort.repairedMissingPayloadIds.has(entry.pluginId)) collectMissingPayloadOutcome(entry);
	const convergenceBaselineRecords = pluginConfig.plugins?.installs ?? {};
	const probedRecords = new Map(cohort.updateOutcomes.map(({ pluginId }) => {
		const record = convergenceBaselineRecords[pluginId];
		return [pluginId, record ? { ...record } : void 0];
	}));
	const convergenceEnv = resolvePostCoreConvergenceEnv(process.env, coreVersion ?? void 0);
	const convergence = await runPostCorePluginConvergence({
		cfg: pluginConfig,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		configPersistence: "caller",
		env: convergenceEnv,
		compatibilityHostVersion: coreVersion ?? void 0,
		baselineInstallRecords: convergenceBaselineRecords,
		beforePersistentEffect: params.assertCurrent,
		...capabilityConsent
	});
	params.assertCurrent?.();
	const repairedPluginIds = /* @__PURE__ */ new Set([...[...cohort.repairOutcomes, ...cohort.updateOutcomes].filter((outcome) => outcome.status === "updated" || outcome.status === "unchanged").map((outcome) => outcome.pluginId), ...convergence.repairedPluginIds ?? []]);
	warnings = warnings.filter((warning) => !warning.pluginId || !repairedPluginIds.has(warning.pluginId));
	for (const pluginId of convergence.repairedPluginIds ?? []) {
		const before = convergenceBaselineRecords[pluginId];
		const after = convergence.installRecords[pluginId];
		pluginUpdateOutcomes.push({
			pluginId,
			status: "updated",
			currentVersion: before?.resolvedVersion ?? before?.version,
			nextVersion: after?.resolvedVersion ?? after?.version,
			message: `Repaired plugin "${pluginId}".`
		});
	}
	for (const change of convergence.changes) if (!params.json) runtime.log(theme.muted(change));
	const convergenceWarnings = convergence.warnings.map((warning) => createPluginUpdateWarning({
		...warning,
		kind: warning.kind === "repair" ? "update" : warning.kind
	}));
	const convergenceOutcomes = [...convergence.outcomes ?? [], ...convergence.warnings.flatMap((warning) => warning.pluginId ? [{
		pluginId: warning.pluginId,
		status: "error",
		message: warning.message
	}] : [])];
	warnings.push(...convergenceWarnings, ...convergence.notices ?? []);
	for (const outcome of convergenceOutcomes) {
		pluginUpdateOutcomes.push(outcome);
		if (outcome.status === "error" || isActionableSkippedPostUpdateOutcome(outcome)) {
			const warning = createPluginUpdateWarning({
				pluginId: outcome.pluginId,
				reason: outcome.message
			});
			if (!warnings.some((entry) => entry.pluginId === warning.pluginId)) warnings.push(warning);
		}
	}
	pluginConfig = withPluginInstallRecords(convergence.config, convergence.installRecords);
	for (const outcome of cohort.updateOutcomes) {
		const record = convergence.installRecords[outcome.pluginId];
		const probed = probedRecords.get(outcome.pluginId);
		if (outcome.status !== "unchanged" || !outcome.currentVersion || !record || record.source !== probed?.source || record.spec !== probed.spec) continue;
		const unavailable = outcome.code === "plugin-target-unavailable";
		if (unavailable ? record.installPath !== probed?.installPath || record.version !== probed?.version || record.resolvedVersion !== probed?.resolvedVersion : record.source !== "npm" || !outcome.nextVersion || comparePackageUpdateVersions(outcome.nextVersion, outcome.currentVersion) <= 0 || (record.resolvedVersion ?? record.version) !== outcome.currentVersion || resolveExactNpmSpecVersion(record.spec) !== outcome.currentVersion || !isTrustedOfficialPluginInstallRecord({
			pluginId: outcome.pluginId,
			packageName: resolveNpmSpecPackageName(record.spec),
			record
		})) continue;
		const message = unavailable ? outcome.message : `Plugin update retained an official plugin pin: ${outcome.message}`;
		warnings.push({
			pluginId: outcome.pluginId,
			reason: unavailable ? "plugin-target-unavailable" : "retained-plugin-pin",
			message,
			guidance: unavailable ? [formatCliCommand(`openclaw plugins update ${outcome.pluginId}`)] : ["Keep the pin if intentional; replacing it is an explicit operator choice."]
		});
		if (unavailable) getLogger().warn(message);
	}
	if (convergence.changes.length > 0 || convergence.configChanges.length > 0) pluginsChanged = true;
	if (pluginsChanged) {
		const nextInstallRecords = pluginConfig.plugins?.installs ?? {};
		const appliedPluginIdMigrations = Object.fromEntries(Object.entries(resolvePluginInstallOwnerMigrations(cohort) ?? {}).filter(([fromId, toId]) => !Object.hasOwn(nextInstallRecords, fromId) && Object.hasOwn(nextInstallRecords, toId)));
		const installedPluginIdRecovery = convergence.installedPluginIdRecovery;
		let nextConfig = withoutPluginInstallRecords(pluginConfig);
		if (referenceSource) {
			referenceSource.installedPluginIdRecovery = installedPluginIdRecovery;
			nextConfig = restoreDoctorConfigEnvRefs(nextConfig, referenceSource, params.configWriteOptions.explicitSetPaths, { appliedPluginIdMigrations });
		}
		if (params.restoredAuthoredChannels !== void 0) nextConfig = {
			...nextConfig,
			channels: structuredClone(params.restoredAuthoredChannels)
		};
		setDeferredPluginMigrationConfigFacts(nextConfig, getDeferredPluginMigrationConfigFacts(params.configSnapshot.sourceConfig));
		const guardedWriteOptions = withUpdateConfigWriteAuthority(params.configWriteOptions, params.assertCurrent);
		const commit = async (lease) => {
			const assertCurrent = () => {
				guardedWriteOptions.assertCurrent?.();
				lease?.assertOwned();
			};
			assertCurrent();
			await assertInstalledPluginIdRecoveryCurrent(params.configSnapshot.sourceConfig, installedPluginIdRecovery, convergenceEnv);
			assertCurrent();
			await commitPluginInstallRecordsWithConfig({
				beforePersistentEffect: assertCurrent,
				previousInstallRecords: pluginInstallRecords,
				nextInstallRecords,
				nextConfig,
				baseHash: params.configSnapshot.hash,
				writeOptions: {
					...guardedWriteOptions,
					observe: false,
					assertCurrent,
					beforeCommit: async () => {
						assertCurrent();
						await params.configWriteOptions.beforeCommit?.();
						assertCurrent();
						await assertInstalledPluginIdRecoveryCurrent(params.configSnapshot.sourceConfig, installedPluginIdRecovery, convergenceEnv);
						assertCurrent();
					},
					inputBase: "source",
					skipPluginValidation: true
				}
			});
		};
		if (installedPluginIdRecovery.size > 0) await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, commit);
		else await commit();
		if (!params.json) for (const change of convergence.configChanges) runtime.log(theme.muted(change));
		params.assertCurrent?.();
		await withPluginLifecycleLease({ assertCurrent: params.assertCurrent }, async (lease) => refreshPluginRegistryAfterConfigMutation({
			configPath: params.configSnapshot.path,
			reason: "source-changed",
			workspaceDir: params.root,
			installRecords: nextInstallRecords,
			invalidateRuntimeCache: false,
			logger: pluginLogger,
			lease
		}));
		params.assertCurrent?.();
	}
	for (const notice of clawHubTrustNotices) {
		if (warnings.some((warning) => warning.reason.includes(notice))) continue;
		warnings.push({
			reason: notice,
			message: notice,
			guidance: []
		});
	}
	const assessment = assessPluginUpdate({
		smokeFailures: convergence.smokeFailures,
		disabledPluginIds: [...new Set(pluginUpdateOutcomes.filter((outcome) => isDisabledAfterFailureOutcome(outcome) && pluginConfig.plugins?.entries?.[outcome.pluginId]?.enabled === false).map((outcome) => outcome.pluginId))],
		errored: convergence.errored,
		outcomes: pluginUpdateOutcomes,
		integrityDrift: integrityDrifts.length > 0,
		requirements
	});
	const finalPluginOutcomes = [...new Map(pluginUpdateOutcomes.map((outcome) => [outcome.pluginId, outcome])).values()];
	const result = {
		status: warnings.length > 0 || cohort.sync.summary.warnings.length > 0 || finalPluginOutcomes.some((outcome) => outcome.status === "error") ? "warning" : "ok",
		assessment,
		changed: pluginsChanged,
		warnings,
		sync: {
			changed: cohort.sync.changed,
			switchedToBundled: cohort.sync.summary.switchedToBundled,
			switchedToNpm: cohort.sync.summary.switchedToNpm,
			warnings: cohort.sync.summary.warnings,
			errors: cohort.sync.summary.errors.map((error) => error.message)
		},
		npm: {
			changed: cohort.npmChanged,
			outcomes: pluginUpdateOutcomes
		},
		integrityDrifts
	};
	if (params.json) return result;
	const summarizeList = (list) => {
		if (list.length <= 6) return list.join(", ");
		return `${list.slice(0, 6).join(", ")} +${list.length - 6} more`;
	};
	for (const [label, plugins] of [["Switched to bundled plugins", cohort.sync.summary.switchedToBundled], ["Restored plugins", cohort.sync.summary.switchedToNpm]]) if (plugins.length > 0) runtime.log(theme.muted(`${label}: ${summarizeList(plugins)}.`));
	for (const warning of cohort.sync.summary.warnings) logPluginWarning(warning);
	const updated = finalPluginOutcomes.filter((entry) => entry.status === "updated").length;
	const unchanged = finalPluginOutcomes.filter((entry) => entry.status === "unchanged").length;
	const failed = finalPluginOutcomes.filter((entry) => entry.status === "error").length;
	const skipped = finalPluginOutcomes.filter((entry) => entry.status === "skipped").length;
	if (pluginUpdateOutcomes.length === 0 && warnings.length === 0) runtime.log(theme.muted("No plugin updates needed."));
	else if (pluginUpdateOutcomes.length > 0) {
		const parts = [`${updated} updated`, `${unchanged} unchanged`];
		if (failed > 0) parts.push(`${failed} to retry`);
		if (skipped > 0) parts.push(`${skipped} skipped`);
		runtime.log(theme.muted(`Plugin updates: ${parts.join(", ")}.`));
	}
	for (const message of uniqueStrings(pluginUpdateOutcomes.flatMap(({ channelFallback }) => channelFallback?.message ? [channelFallback.message] : []))) runtime.log(theme.warn(message));
	for (const warning of warnings) logPluginWarning(warning.message);
	return result;
}
//#endregion
export { inspectSourceUpdateArtifacts as a, releaseLegacySourceLock as i, settleUpdateDoctorMaintenance as n, completeSourceUpdateRuntime as r, updatePluginsAfterCoreUpdate as t };
