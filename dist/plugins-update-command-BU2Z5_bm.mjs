import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as parseRegistryNpmSpec } from "./npm-registry-spec-Dw2vyAJw.mjs";
import { c as normalizeUpdateChannel, d as resolveRegistryUpdateChannel } from "./update-channels-BquD107I.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { n as containsConfigIncludeDirective } from "./io.read-helpers-Bvdjf9tk.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { r as getRuntimeConfig, u as readConfigFileSnapshotForWrite } from "./io.runtime-CPntde4x.mjs";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-C4XTCka4.mjs";
import { r as replaceConfigFile } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { t as buildNpmResolutionFields } from "./install-source-utils-CQUKARYZ.mjs";
import { i as withoutPluginInstallRecords, o as configReferencesNpmInstallPath, r as withPluginInstallRecords } from "./installed-plugin-index-records-VCj98mZ6.mjs";
import { n as VERSION_BOUND_RUNTIME_PLUGIN_IDS } from "./official-runtime-plugins-WPvV9MD6.mjs";
import { a as resolvePackageDirInstallTransaction, i as requestDeferredPackageDirInstall } from "./install-package-dir-BIZrRqZG.mjs";
import { R as requestDeferredPluginInstall, U as settlePluginInstallTransactions, V as resolvePluginInstallTransactionRequest, z as resolvePluginInstallOwnerMigrations } from "./npm-managed-root-f7M5m6yA.mjs";
import { a as readInstalledPackageVersion, n as expectedIntegrityForUpdate, r as isPackageVersionDowngrade } from "./package-update-utils-CEpDQ5XC.mjs";
import { o as resolveSourceCheckoutBundledPluginIds } from "./bundled-sources-fjtOrSJ6.mjs";
import { d as isPluginInstallRecordUpdateSource, m as pluginInstallRecordMayMigrateConfigId, r as resolveOfficialPluginCohortNpmSpecs } from "./plugin-version-drift-BsJ4AHQ4.mjs";
import { n as updateNpmInstalledPlugins, r as isClawHubTrustSkippedOutcome } from "./update-6VE9BzxJ.mjs";
import { a as getRetainedPluginInstallPublication, i as commitPluginInstallRecordsWithConfig, r as commitPluginInstallRecordsOnly } from "./install-record-commit-I97ACS0P.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-jgowtM4M.mjs";
import { n as pluginPackageUpdateMayMutateConfig, r as reconcilePluginPackageUpdateConfig, t as capturePluginPackageUpdateSnapshot } from "./plugin-package-update-DQMDqz5A.mjs";
import { r as promptYesNo } from "./prompt-CZNjwnP9.mjs";
import { n as resolvePluginCapabilityConsentCliOptions } from "./plugin-capability-consent-C9XqXUw9.mjs";
import { i as selectInstallMutationWriteOptions, n as resolveCombinedPluginAndHookConfigMutationPreflight, r as resolveInstallConfigMutationPreflights, t as assertRecordsOnlyUpdateConfigFresh } from "./install-config-mutation-CIWDvRTm.mjs";
import { a as installHooksFromNpmSpec, n as createPluginInstallLogger, s as resolveHookInstallDir } from "./plugins-command-helpers-DJLU9f2x.mjs";
import { n as resolvePluginLifecycleGateway } from "./plugins-lifecycle-client-BZibQSaQ.mjs";
import { t as resolveInstallPolicyWarningAcknowledgementCliOptions } from "./install-policy-warning-acknowledgement-DHlWS8ba.mjs";
import { t as readHookInstalls } from "./installs-BGk9-X-q.mjs";
import { t as stageHookInstall } from "./install-record-transaction-DBAa8uF8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/hooks/update.ts
function createHookPackUpdateIntegrityDriftHandler(params) {
	return async (drift) => {
		const payload = {
			hookId: params.hookId,
			spec: drift.spec,
			expectedIntegrity: drift.expectedIntegrity,
			actualIntegrity: drift.actualIntegrity,
			resolution: drift.resolution,
			resolvedSpec: drift.resolution.resolvedSpec,
			resolvedVersion: drift.resolution.version,
			dryRun: params.dryRun
		};
		if (params.onIntegrityDrift) return await params.onIntegrityDrift(payload);
		params.logger.warn?.(`Integrity drift for hook pack "${params.hookId}" (${payload.resolvedSpec ?? payload.spec}): expected ${payload.expectedIntegrity}, got ${payload.actualIntegrity}`);
		return false;
	};
}
/** Update npm-installed hook packs and return config changes plus per-pack outcomes. */
async function updateNpmInstalledHookPacks(params) {
	const logger = params.logger ?? {};
	const transactionRequest = resolvePluginInstallTransactionRequest(params);
	const persistence = params.dryRun ? void 0 : {
		lease: expectDefined(params.lease, "hook update lifecycle lease"),
		transactions: expectDefined(transactionRequest?.transactionSink, "hook update transaction sink")
	};
	const beforePersistentApply = () => {
		persistence?.lease.assertOwned();
		params.beforePersistentApply?.();
	};
	if (persistence) beforePersistentApply();
	const installs = readHookInstalls(persistence ? { path: persistence.lease.databasePath } : {});
	const targets = params.hookIds?.length ? params.hookIds : Object.keys(installs);
	const outcomes = [];
	let changed = false;
	for (const hookId of targets) {
		const record = installs[hookId];
		if (!record) {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `No install record for hook pack "${hookId}".`
			});
			continue;
		}
		if (record.source !== "npm") {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `Skipping hook pack "${hookId}" (source: ${record.source}).`
			});
			continue;
		}
		const effectiveSpec = params.specOverrides?.[hookId] ?? record.spec;
		const expectedIntegrity = effectiveSpec === record.spec ? expectedIntegrityForUpdate(record.spec, record.integrity) : void 0;
		if (!effectiveSpec) {
			outcomes.push({
				hookId,
				status: "skipped",
				message: `Skipping hook pack "${hookId}" (missing npm spec).`
			});
			continue;
		}
		let installPath;
		try {
			installPath = record.installPath ?? resolveHookInstallDir(hookId);
		} catch (err) {
			outcomes.push({
				hookId,
				status: "error",
				message: `Invalid install path for hook pack "${hookId}": ${String(err)}`
			});
			continue;
		}
		const currentVersion = await readInstalledPackageVersion(installPath);
		const result = await installHooksFromNpmSpec(requestDeferredPackageDirInstall({
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			spec: effectiveSpec,
			mode: "update",
			dryRun: params.dryRun,
			beforePersistentApply,
			expectedHookPackId: hookId,
			expectedIntegrity,
			onIntegrityDrift: createHookPackUpdateIntegrityDriftHandler({
				hookId,
				dryRun: Boolean(params.dryRun),
				logger,
				onIntegrityDrift: params.onIntegrityDrift
			}),
			logger
		}, transactionRequest?.assertOwned));
		if (!result.ok) {
			outcomes.push({
				hookId,
				status: "error",
				message: `Failed to ${params.dryRun ? "check" : "update"} hook pack "${hookId}": ${result.error}`
			});
			continue;
		}
		const nextVersion = result.version ?? await readInstalledPackageVersion(result.targetDir);
		const currentLabel = currentVersion ?? "unknown";
		const nextLabel = nextVersion ?? "unknown";
		const status = currentVersion && nextVersion && currentVersion === nextVersion ? "unchanged" : "updated";
		const downgraded = isPackageVersionDowngrade(currentVersion, nextVersion);
		if (persistence) {
			persistence.transactions.push(await stageHookInstall({
				update: {
					hookId,
					source: "npm",
					spec: effectiveSpec,
					installPath: result.targetDir,
					version: nextVersion,
					...buildNpmResolutionFields(result.npmResolution),
					hooks: result.hooks
				},
				payloadTransaction: resolvePackageDirInstallTransaction(result),
				lease: persistence.lease,
				beforePersistentApply
			}));
			changed = true;
		}
		const action = persistence ? downgraded ? "Downgraded" : "Updated" : downgraded ? "Would downgrade" : "Would update";
		outcomes.push({
			hookId,
			status,
			currentVersion: currentVersion ?? void 0,
			nextVersion: nextVersion ?? void 0,
			message: status === "unchanged" ? persistence ? `Hook pack "${hookId}" already at ${currentLabel}.` : `Hook pack "${hookId}" is up to date (${currentLabel}).` : `${action} hook pack "${hookId}": ${currentLabel} -> ${nextLabel}.`
		});
	}
	return {
		config: params.config,
		changed,
		outcomes
	};
}
//#endregion
//#region src/cli/plugins-update-outcomes.ts
/** Log update outcomes with severity styling and report whether any errors occurred. */
function logPluginUpdateOutcomes(params) {
	let hasErrors = false;
	for (const outcome of params.outcomes) {
		if (outcome.status === "error") {
			hasErrors = true;
			params.error(theme.error(outcome.message));
		} else if (outcome.status === "skipped") {
			if (isClawHubTrustSkippedOutcome(outcome)) hasErrors = true;
			params.log(theme.warn(outcome.message));
		} else params.log(outcome.message);
		if (outcome.channelFallback) params.log(theme.warn(outcome.channelFallback.message));
	}
	return { hasErrors };
}
//#endregion
//#region src/cli/plugins-update-selection.ts
function installedNpmPackageName(install) {
	return install.resolvedName?.trim() || ((install.spec ? parseRegistryNpmSpec(install.spec)?.name : void 0) ?? (install.resolvedSpec ? parseRegistryNpmSpec(install.resolvedSpec)?.name : void 0));
}
function resolveTrackedUpdateSelection(params) {
	const ids = /* @__PURE__ */ new Set();
	const overrides = /* @__PURE__ */ new Map();
	const unmatchedIds = /* @__PURE__ */ new Set();
	for (const rawId of params.all ? Object.keys(params.installs) : params.rawIds) {
		if (params.rejectedPluginIds?.has(rawId)) return {
			ids: [],
			error: params.rejectedPluginIds.get(rawId)
		};
		const owner = params.installOwnerByPluginId?.get(rawId) ?? rawId;
		let id = Object.hasOwn(params.installs, owner) ? owner : void 0;
		let specOverride;
		if (!id) {
			const spec = parseRegistryNpmSpec(rawId);
			const matches = spec ? Object.entries(params.installs).filter(([, install]) => params.packageName(install) === spec.name) : [];
			const match = matches.length === 1 ? matches[0] : void 0;
			if (match && spec) {
				id = match[0];
				specOverride = spec.raw;
			}
		}
		if (!id) {
			unmatchedIds.add(rawId);
			continue;
		}
		if (params.rejectedPluginIds?.has(id)) return {
			ids: [],
			error: params.rejectedPluginIds.get(id)
		};
		if (specOverride) {
			const previous = overrides.get(id);
			if (previous !== void 0 && previous !== specOverride) return {
				ids: [],
				error: `Conflicting npm specs for "${id}": "${previous}" and "${specOverride}". Choose one spec per installed package.`
			};
			overrides.set(id, specOverride);
		}
		ids.add(id);
	}
	return {
		ids: [...ids],
		...overrides.size > 0 ? { specOverrides: Object.fromEntries(overrides) } : {},
		...unmatchedIds.size > 0 ? { unmatchedIds: [...unmatchedIds] } : {}
	};
}
/** Resolve plugin update targets and npm spec overrides from CLI inputs. */
function resolvePluginUpdateSelection(params) {
	const { ids, ...selection } = resolveTrackedUpdateSelection({
		...params,
		packageName: (install) => install.source === "npm" ? installedNpmPackageName(install) : void 0
	});
	return {
		pluginIds: ids,
		...selection
	};
}
/** Resolve hook-pack update targets and npm spec overrides from CLI inputs. */
function resolveHookPackUpdateSelection(params) {
	const { ids, ...selection } = resolveTrackedUpdateSelection({
		...params,
		packageName: installedNpmPackageName
	});
	return {
		hookIds: ids,
		...selection
	};
}
//#endregion
//#region src/cli/plugins-update-command.ts
const DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING = "--dangerously-force-unsafe-install is deprecated and no longer affects plugin updates because built-in install-time dangerous-code scanning has been removed. Configure security.installPolicy for operator-owned install decisions.";
async function confirmUpdateIntegrityDrift(item, drift) {
	defaultRuntime.log(theme.warn(`Integrity drift detected for ${item} (${drift.resolvedSpec ?? drift.spec})\nExpected: ${drift.expectedIntegrity}\nActual:   ${drift.actualIntegrity}`));
	return drift.dryRun || await promptYesNo(`Continue updating ${item} with this artifact?`);
}
function mayMutatePluginInstallRecord(record, specOverride) {
	if (!isPluginInstallRecordUpdateSource(record)) return false;
	if (record?.source === "npm") return Boolean(specOverride ?? record.spec);
	if (record?.source === "git") return Boolean(record.spec);
	if (record?.source === "clawhub") return Boolean(record.clawhubPackage);
	return Boolean(record?.marketplaceSource && record.marketplacePlugin);
}
function pluginConfigReferencesId(config, pluginId) {
	const plugins = config.plugins;
	return plugins?.allow?.includes(pluginId) || plugins?.deny?.includes(pluginId) || Object.hasOwn(plugins?.entries ?? {}, pluginId) || plugins?.slots?.memory === pluginId || plugins?.slots?.contextEngine === pluginId;
}
function shouldPreserveEmptyPlugins(params) {
	const plugins = params.sourceConfig.plugins;
	const parsedPlugins = params.parsed && typeof params.parsed === "object" && !Array.isArray(params.parsed) ? params.parsed.plugins : void 0;
	return Boolean(plugins && (!Object.hasOwn(plugins, "installs") || Object.keys(plugins).some((key) => key !== "installs") || containsConfigIncludeDirective(parsedPlugins)));
}
/** Run plugin/hook-pack updates, persist changed install records, and refresh runtime registry. */
async function runPluginUpdateCommand(params) {
	if (params.opts.all && params.ids.length > 0) {
		defaultRuntime.error("Use either plugin or hook-pack ids or --all, not both.");
		defaultRuntime.exit(1);
		return;
	}
	if (params.opts.dryRun) {
		const exitCode = await runPluginUpdateCommandUnlocked(params);
		if (exitCode !== 0) defaultRuntime.exit(exitCode);
		return;
	}
	assertConfigWriteAllowedInCurrentMode();
	const gateway = await resolvePluginLifecycleGateway();
	if (gateway) await gateway("plugins.list", {});
	let changed = false;
	let activationDeferred = false;
	const update = withPluginLifecycleLease({}, (lease) => runPluginUpdateCommandUnlocked(params, lease, (deferred) => {
		changed = true;
		activationDeferred ||= deferred;
	}));
	let updateFailure;
	await update.catch((error) => {
		updateFailure = { error };
	});
	if (changed && !activationDeferred) {
		if (gateway) try {
			const result = await gateway("plugins.refresh", {});
			if (!result.runtime) throw new Error("Plugin update did not return a runtime application receipt.");
			for (const warning of result.warnings ?? []) defaultRuntime.log(theme.warn(warning));
			defaultRuntime.log(`Applied plugin updates in Gateway generation ${result.runtime.generation}.`);
		} catch (error) {
			const failure = new Error("Plugin updates were saved but runtime application failed. Inspect the error, repair the plugin, then run openclaw plugins reload <id>.", { cause: error });
			if (updateFailure) failure.cause = new AggregateError([updateFailure.error, error], void 0, { cause: error });
			throw failure;
		}
		else defaultRuntime.log("Updates saved; they will load on the next Gateway start.");
	}
	const exitCode = await update;
	if (exitCode !== 0) defaultRuntime.exit(exitCode);
}
async function runPluginUpdateCommandUnlocked(params, lease, onMetadataChanged) {
	const assertOwned = lease?.assertOwned.bind(lease);
	if (!params.opts.dryRun) assertConfigWriteAllowedInCurrentMode();
	const sourceSnapshotPromise = readConfigFileSnapshotForWrite().then((prepared) => {
		const writeOptions = selectInstallMutationWriteOptions(prepared.writeOptions);
		return {
			...prepared,
			writeOptions: {
				...writeOptions,
				assertConfigPathForWrite: () => {
					assertOwned?.();
					writeOptions.assertConfigPathForWrite?.();
				}
			}
		};
	}).catch(() => null);
	const mutationSnapshot = params.opts.dryRun ? null : await sourceSnapshotPromise;
	if (!params.opts.dryRun && !mutationSnapshot) {
		defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
		return 1;
	}
	if (mutationSnapshot && !mutationSnapshot.snapshot.valid) {
		defaultRuntime.error("Cannot update plugins or hooks while the config is invalid.");
		return 1;
	}
	const cfg = mutationSnapshot?.snapshot.runtimeConfig ?? getRuntimeConfig();
	const sourceCfg = mutationSnapshot?.snapshot.sourceConfig ?? cfg;
	const pluginInstallRecords = await loadInstalledPluginIndexInstallRecords();
	const cfgWithPluginInstallRecords = withPluginInstallRecords(cfg, pluginInstallRecords);
	const sourceCfgWithPluginInstallRecords = withPluginInstallRecords(sourceCfg, pluginInstallRecords);
	const installedPluginIndex = loadInstalledPluginIndex({
		config: cfgWithPluginInstallRecords,
		installRecords: pluginInstallRecords
	});
	const sourceBundledIds = resolveSourceCheckoutBundledPluginIds({
		config: cfgWithPluginInstallRecords,
		installRecords: pluginInstallRecords
	});
	const installOwnerByPluginId = /* @__PURE__ */ new Map();
	const rejectedPluginIds = /* @__PURE__ */ new Map();
	const ownershipResolver = createInstalledPluginOwnershipResolver(installedPluginIndex);
	for (const pluginId of /* @__PURE__ */ new Set([...installedPluginIndex.plugins.map((plugin) => plugin.pluginId), ...Object.keys(pluginInstallRecords)])) {
		if (sourceBundledIds.has(pluginId)) continue;
		const ownership = ownershipResolver.resolveLifecycle(pluginId);
		if (!ownership.ok) {
			rejectedPluginIds.set(pluginId, ownership.error);
			continue;
		}
		installOwnerByPluginId.set(pluginId, ownership.value.installOwner);
		installOwnerByPluginId.set(ownership.value.installOwner, ownership.value.installOwner);
	}
	const configuredUpdateChannel = normalizeUpdateChannel(cfg.update?.channel) ?? void 0;
	const officialPluginUpdateChannel = resolveRegistryUpdateChannel({
		configChannel: configuredUpdateChannel,
		currentVersion: VERSION
	});
	const logger = createPluginInstallLogger();
	if (params.opts.dangerouslyForceUnsafeInstall) defaultRuntime.log(theme.warn(DEPRECATED_DANGEROUS_FORCE_UNSAFE_UPDATE_WARNING));
	const pluginSelection = resolvePluginUpdateSelection({
		installs: pluginInstallRecords,
		installOwnerByPluginId,
		rejectedPluginIds,
		rawIds: params.ids,
		all: params.opts.all
	});
	if (pluginSelection.error) {
		defaultRuntime.error(pluginSelection.error);
		return 1;
	}
	const selectedHooks = readHookInstalls();
	const hookSelection = resolveHookPackUpdateSelection({
		installs: selectedHooks,
		rawIds: params.ids,
		all: params.opts.all
	});
	if (hookSelection.error) {
		defaultRuntime.error(hookSelection.error);
		return 1;
	}
	const unmatchedId = pluginSelection.unmatchedIds?.find((id) => hookSelection.unmatchedIds?.includes(id));
	if (unmatchedId !== void 0) {
		defaultRuntime.error(`No tracked plugin or hook pack found for "${unmatchedId}". Run "${formatCliCommand("openclaw plugins list")}" or "${formatCliCommand("openclaw hooks list")}" to inspect installed packages.`);
		return 1;
	}
	const packageUpdateIds = pluginSelection.pluginIds.filter((id) => !sourceBundledIds.has(id));
	const packageUpdateSnapshotResult = capturePluginPackageUpdateSnapshot({
		index: installedPluginIndex,
		installOwners: packageUpdateIds
	});
	if (!packageUpdateSnapshotResult.ok) {
		defaultRuntime.error(packageUpdateSnapshotResult.error);
		return 1;
	}
	const packageUpdateSnapshot = packageUpdateSnapshotResult.value;
	const packagePluginIds = Object.fromEntries([...packageUpdateSnapshot.values()].map((ownership) => [ownership.installOwner, [...ownership.pluginIds]]));
	if (pluginSelection.pluginIds.length === 0 && hookSelection.hookIds.length === 0) {
		if (params.opts.all) {
			defaultRuntime.log("No tracked plugins or hook packs to update.");
			return 0;
		}
		defaultRuntime.error("Provide plugin or hook-pack ids, or use --all.");
		return 1;
	}
	const pluginUpdateMayMutate = !params.opts.dryRun && packageUpdateIds.some((pluginId) => {
		return mayMutatePluginInstallRecord(pluginInstallRecords[pluginId], pluginSelection.specOverrides?.[pluginId]);
	});
	const hookUpdateMayMutate = !params.opts.dryRun && hookSelection.hookIds.some((hookId) => {
		const record = selectedHooks[hookId];
		return record?.source === "npm" && Boolean(hookSelection.specOverrides?.[hookId] ?? record.spec);
	});
	if (pluginUpdateMayMutate || hookUpdateMayMutate) {
		if (!mutationSnapshot) {
			defaultRuntime.error("Could not inspect config ownership before updating plugins or hooks.");
			return 1;
		}
		const { hookMutation, pluginMutation } = resolveInstallConfigMutationPreflights({
			parsed: mutationSnapshot.snapshot.parsed ?? {},
			snapshotPath: mutationSnapshot.snapshot.path,
			writeOptions: mutationSnapshot.writeOptions
		});
		const parsedConfig = mutationSnapshot.snapshot.parsed && typeof mutationSnapshot.snapshot.parsed === "object" && !Array.isArray(mutationSnapshot.snapshot.parsed) ? mutationSnapshot.snapshot.parsed : {};
		const pluginReferencesMayBeUnresolved = Object.hasOwn(parsedConfig, "$include") || containsConfigIncludeDirective(mutationSnapshot.snapshot.sourceConfig.plugins);
		const pluginIdMigrationMayMutate = packageUpdateIds.some((pluginId) => {
			return pluginInstallRecordMayMigrateConfigId({
				pluginId,
				record: pluginInstallRecords[pluginId],
				specOverride: pluginSelection.specOverrides?.[pluginId]
			}) && (pluginReferencesMayBeUnresolved || pluginConfigReferencesId(mutationSnapshot.snapshot.sourceConfig, pluginId));
		});
		const pluginLoadPathMayMutate = packageUpdateIds.some((pluginId) => configReferencesNpmInstallPath({
			config: cfg,
			install: pluginInstallRecords[pluginId]
		}));
		const pluginConfigMayMutate = pluginIdMigrationMayMutate || pluginLoadPathMayMutate || pluginPackageUpdateMayMutateConfig({
			config: mutationSnapshot.snapshot.sourceConfig,
			index: installedPluginIndex,
			snapshot: packageUpdateSnapshot
		});
		const blockedReasons = /* @__PURE__ */ new Set();
		if (pluginConfigMayMutate && pluginMutation.mode === "blocked") blockedReasons.add(pluginMutation.reason);
		if (hookUpdateMayMutate && hookMutation.mode === "blocked") blockedReasons.add(hookMutation.reason);
		if (pluginConfigMayMutate && hookUpdateMayMutate && pluginMutation.mode === "allowed" && hookMutation.mode === "allowed") {
			const combinedMutation = resolveCombinedPluginAndHookConfigMutationPreflight({
				parsed: mutationSnapshot.snapshot.parsed ?? {},
				snapshotPath: mutationSnapshot.snapshot.path
			});
			if (combinedMutation.mode === "blocked") blockedReasons.add(combinedMutation.reason);
		}
		if (blockedReasons.size > 0) {
			defaultRuntime.error(Array.from(blockedReasons).join(" "));
			return 1;
		}
	}
	const installPolicyWarningAcknowledgement = resolveInstallPolicyWarningAcknowledgementCliOptions({
		acknowledgeInstallPolicyWarning: params.opts.acknowledgeInstallPolicyWarning,
		allowPrompt: !params.opts.dryRun
	});
	const deferredInstallTransactions = [];
	let packageUpdatePersisted = false;
	let updateFailure;
	try {
		let pluginResult = pluginSelection.pluginIds.length > 0 ? await updateNpmInstalledPlugins(requestDeferredPluginInstall({
			config: cfgWithPluginInstallRecords,
			pluginIds: pluginSelection.pluginIds,
			packagePluginIds,
			specOverrides: pluginSelection.specOverrides,
			dryRun: params.opts.dryRun,
			updateChannel: params.opts.all ? void 0 : configuredUpdateChannel,
			officialPluginUpdateChannel,
			syncOfficialPluginInstalls: params.opts.all ? true : void 0,
			coreVersion: VERSION,
			versionBoundPluginIds: VERSION_BOUND_RUNTIME_PLUGIN_IDS,
			npmInstallSpecOverrides: resolveOfficialPluginCohortNpmSpecs({
				gatewayVersion: VERSION,
				installRecords: pluginInstallRecords,
				config: cfgWithPluginInstallRecords
			}),
			...installPolicyWarningAcknowledgement,
			...resolvePluginCapabilityConsentCliOptions({
				acceptCapabilities: params.opts.acceptCapabilities,
				action: "update",
				allowPrompt: !params.opts.dryRun
			}),
			logger,
			onIntegrityDrift: (drift) => confirmUpdateIntegrityDrift(`"${drift.pluginId}"`, drift)
		}, deferredInstallTransactions, assertOwned)) : {
			config: cfgWithPluginInstallRecords,
			changed: false,
			outcomes: []
		};
		if (pluginSelection.pluginIds.length > 0 && pluginResult.changed && !params.opts.dryRun) {
			const nextInstallRecords = pluginResult.config.plugins?.installs ?? {};
			const afterIndex = withPluginCache(createPluginCache(), () => loadInstalledPluginIndex({
				config: pluginResult.config,
				installRecords: nextInstallRecords
			}));
			const reconciled = reconcilePluginPackageUpdateConfig({
				config: pluginResult.config,
				beforeIndex: installedPluginIndex,
				afterIndex,
				snapshot: packageUpdateSnapshot,
				installOwnerMigrations: resolvePluginInstallOwnerMigrations(pluginResult)
			});
			if (!reconciled.ok) {
				defaultRuntime.error(reconciled.error);
				return 1;
			}
			pluginResult = {
				...pluginResult,
				config: reconciled.config
			};
		}
		const hookResult = hookSelection.hookIds.length > 0 ? await updateNpmInstalledHookPacks(requestDeferredPluginInstall({
			config: pluginResult.config,
			lease,
			beforePersistentApply: mutationSnapshot?.writeOptions.assertConfigPathForWrite,
			hookIds: hookSelection.hookIds,
			specOverrides: hookSelection.specOverrides,
			dryRun: params.opts.dryRun,
			...installPolicyWarningAcknowledgement,
			logger,
			onIntegrityDrift: (drift) => confirmUpdateIntegrityDrift(`hook pack "${drift.hookId}"`, drift)
		}, deferredInstallTransactions, assertOwned)) : {
			config: pluginResult.config,
			changed: false,
			outcomes: []
		};
		if (!params.opts.dryRun) try {
			var _usingCtx$1 = _usingCtx();
			const sourceSnapshot = mutationSnapshot ?? await sourceSnapshotPromise;
			if (pluginResult.changed) {
				const currentInstallRecords = await loadInstalledPluginIndexInstallRecords();
				const currentSnapshot = capturePluginPackageUpdateSnapshot({
					index: installedPluginIndex,
					installOwners: packageUpdateIds
				});
				if (!isDeepStrictEqual(currentInstallRecords, pluginInstallRecords) || !currentSnapshot.ok || !isDeepStrictEqual([...currentSnapshot.value], [...packageUpdateSnapshot])) {
					defaultRuntime.error(currentSnapshot.ok ? "Plugin package ownership changed during update; no config or index changes were committed. Refresh the plugin registry and retry." : currentSnapshot.error);
					return 1;
				}
			}
			const nextPluginInstallRecords = pluginResult.config.plugins?.installs ?? {};
			const shouldPersistPluginInstallIndex = pluginResult.changed || Object.keys(pluginInstallRecords).length > 0;
			const sourceShapedUpdateConfig = applyMergePatch(sourceCfgWithPluginInstallRecords, createMergePatch(cfgWithPluginInstallRecords, hookResult.config));
			let nextConfig = withoutPluginInstallRecords(sourceShapedUpdateConfig, { preserveEmptyPlugins: shouldPreserveEmptyPlugins({
				parsed: sourceSnapshot?.snapshot.parsed,
				sourceConfig: sourceSnapshot?.snapshot.sourceConfig ?? {}
			}) });
			const writeOptions = {
				...sourceSnapshot?.writeOptions,
				afterWrite: {
					mode: "none",
					reason: "plugin update applies runtime after releasing its lease"
				}
			};
			const { preparePluginUpdateConfigMigration } = await import("./plugin-update-config-migration-Cc0yYqgV.mjs");
			const installOwnerMigrations = resolvePluginInstallOwnerMigrations(pluginResult);
			const migrationOwners = pluginResult.outcomes.filter((outcome) => outcome.status === "updated" || outcome.status === "unchanged").map((outcome) => installOwnerMigrations?.[outcome.pluginId] ?? outcome.pluginId);
			const migration = _usingCtx$1.a(sourceSnapshot && migrationOwners.length > 0 ? await preparePluginUpdateConfigMigration({
				config: nextConfig,
				snapshot: sourceSnapshot.snapshot,
				installRecords: nextPluginInstallRecords,
				installOwners: migrationOwners,
				assertCurrent: () => {
					assertOwned?.();
					sourceSnapshot.writeOptions.assertConfigPathForWrite?.();
				}
			}) : void 0);
			if (!pluginResult.changed && !hookResult.changed && !migration?.changed) {
				await migration?.publish(nextConfig, async () => {});
				return logPluginUpdateOutcomes({
					outcomes: [...pluginResult.outcomes, ...hookResult.outcomes],
					log: defaultRuntime.log,
					error: defaultRuntime.error
				}).hasErrors ? 1 : 0;
			}
			nextConfig = migration?.config ?? nextConfig;
			const commit = async () => {
				if (shouldPersistPluginInstallIndex) {
					if (!migration?.changed && isDeepStrictEqual(nextConfig, sourceSnapshot?.snapshot.sourceConfig ?? sourceCfg)) await commitPluginInstallRecordsOnly({
						previousInstallRecords: pluginInstallRecords,
						nextInstallRecords: nextPluginInstallRecords,
						nextConfig,
						verifyConfigFresh: async () => {
							await assertRecordsOnlyUpdateConfigFresh({
								baseHash: sourceSnapshot?.snapshot.hash,
								writeOptions: sourceSnapshot?.writeOptions
							});
						}
					});
					else await commitPluginInstallRecordsWithConfig({
						previousInstallRecords: pluginInstallRecords,
						nextInstallRecords: nextPluginInstallRecords,
						nextConfig,
						baseHash: sourceSnapshot?.snapshot.hash,
						writeOptions
					});
				} else await replaceConfigFile({
					nextConfig,
					baseHash: sourceSnapshot?.snapshot.hash,
					writeOptions
				});
			};
			await (migration ? migration.publish(nextConfig, commit) : commit());
			packageUpdatePersisted = true;
			onMetadataChanged?.(Boolean(migration?.activationWarning));
			if (migration?.activationWarning) logger.warn(migration.activationWarning);
			await settlePluginInstallTransactions(deferredInstallTransactions, "commit").catch(() => logger.warn("Plugin update committed, but cleanup failed. Run openclaw plugins doctor."));
			if (pluginResult.changed) await refreshPluginRegistryAfterConfigMutation({
				configPath: sourceSnapshot?.writeOptions.ownedConfigPathForWrite,
				reason: "source-changed",
				installRecords: nextPluginInstallRecords,
				invalidateRuntimeCache: false,
				logger
			});
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
		return logPluginUpdateOutcomes({
			outcomes: [...pluginResult.outcomes, ...hookResult.outcomes],
			log: defaultRuntime.log,
			error: defaultRuntime.error
		}).hasErrors ? 1 : 0;
	} catch (error) {
		updateFailure = { error };
		if (getRetainedPluginInstallPublication(error)) {
			packageUpdatePersisted = true;
			await settlePluginInstallTransactions(deferredInstallTransactions, "commit").catch(() => logger.warn("Plugin update was retained, but cleanup failed. Run openclaw plugins doctor."));
		}
		throw error;
	} finally {
		if (!packageUpdatePersisted) await settlePluginInstallTransactions(deferredInstallTransactions, "rollback", updateFailure);
	}
}
//#endregion
export { runPluginUpdateCommand };
