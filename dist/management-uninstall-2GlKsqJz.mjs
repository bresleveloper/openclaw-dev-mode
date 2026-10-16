import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-Zl-RSskC.mjs";
import { c as tracePluginLifecyclePhaseAsync, s as tracePluginLifecyclePhase } from "./discovery-Dma3bVNk.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-R7__5hE9.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-DczkVvPu.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import { b as withConfigWriteLock } from "./io.warnings-Dz_nq5SM.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-EjDH4q5b.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-CPntde4x.mjs";
import { o as transformConfigFileWithRetry, r as replaceConfigFile } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { i as withoutPluginInstallRecords, n as removePluginInstallRecordFromRecords, r as withPluginInstallRecords } from "./installed-plugin-index-records-VCj98mZ6.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-DneslQx1.mjs";
import { n as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-v-fevrKC.mjs";
import { a as prepareConfigForDisabledPluginSet, i as pluginUninstallTargetExists, n as formatUninstallActionLabels, o as recordPluginPackageUninstallPlan, r as planPluginUninstall, t as applyPluginUninstallDirectoryRemoval } from "./uninstall-8bZrB2NB.mjs";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-I97ACS0P.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-jgowtM4M.mjs";
import { i as selectInstallMutationWriteOptions } from "./install-config-mutation-CIWDvRTm.mjs";
import { o as buildPluginSnapshotReport } from "./status-DZs4I6vz.mjs";
import { r as capturePluginRuntimeApplications } from "./lifecycle-CGWepTug.mjs";
import { t as readPluginMutationSnapshot } from "./management-config-Ymv9tMiN.mjs";
import { i as refreshManagedPluginMetadata, r as loadFreshManagedPluginMetadata } from "./management-service-Bj6L37l8.mjs";
import { t as withPluginSourceCleanup } from "./source-cleanup-PVYL0Hqp.mjs";
import { t as collectClawPluginUninstallWarnings } from "./uninstall-claw-references-ffN70ZXy.mjs";
//#region src/plugins/uninstall-selection.ts
/** Resolve user input to the plugin id that should be removed from config/install records. */
function resolvePluginUninstallId(params) {
	const rawId = params.rawId.trim();
	const pluginConfig = params.config.plugins;
	const installs = pluginConfig?.installs ?? {};
	const resolveInstalledPlugin = (pluginId) => {
		const plugin = params.plugins.find((entry) => entry.id === pluginId);
		return plugin ? {
			pluginId,
			plugin
		} : { pluginId };
	};
	const exactPlugin = params.plugins.find((entry) => entry.id === rawId);
	if (exactPlugin) return ok({
		pluginId: exactPlugin.id,
		plugin: exactPlugin
	});
	if (Object.hasOwn(installs, rawId) || Object.hasOwn(pluginConfig?.entries ?? {}, rawId) || pluginConfig?.allow?.includes(rawId) || pluginConfig?.deny?.includes(rawId) || pluginConfig?.slots?.memory === rawId || pluginConfig?.slots?.contextEngine === rawId) return ok(resolveInstalledPlugin(rawId));
	const matchingPluginIds = new Set(params.plugins.filter((plugin) => plugin.name === rawId).map((plugin) => plugin.id));
	for (const [pluginId, install] of Object.entries(installs)) if (install.spec === rawId || install.resolvedSpec === rawId || install.resolvedName === rawId || install.marketplacePlugin === rawId) matchingPluginIds.add(pluginId);
	const requestedClawHub = parseClawHubPluginSpec(rawId);
	if (requestedClawHub) {
		for (const [pluginId, install] of Object.entries(installs)) if ((install.clawhubPackage ?? parseClawHubPluginSpec(install.spec ?? "")?.name ?? parseClawHubPluginSpec(install.resolvedSpec ?? "")?.name) === requestedClawHub.name) matchingPluginIds.add(pluginId);
	}
	if (matchingPluginIds.size > 1) {
		const matches = [...matchingPluginIds].toSorted().join(", ");
		return err(`Plugin uninstall target "${rawId}" is ambiguous; matches: ${matches}. Use an exact plugin id.`);
	}
	const [matchedPluginId] = matchingPluginIds;
	return ok(resolveInstalledPlugin(matchedPluginId ?? rawId));
}
//#endregion
//#region src/plugins/management-uninstall.ts
function runUninstallPhase(params, phase, run) {
	return params.caller === "cli" ? tracePluginLifecyclePhaseAsync(phase, run, { command: "uninstall" }) : run();
}
async function readUninstallSnapshot(params, phase) {
	return await runUninstallPhase(params, phase, async () => {
		if (params.caller === "management") return await readPluginMutationSnapshot(params.env ?? process.env);
		const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
		return {
			config: snapshot.sourceConfig,
			baseHash: snapshot.hash,
			writeOptions: selectInstallMutationWriteOptions(writeOptions)
		};
	});
}
/** Read-only plan; execution always replans under its lease after confirmation. */
async function preparePluginUninstall(params) {
	const env = params.env ?? process.env;
	const cli = params.caller === "cli";
	const snapshot = await readUninstallSnapshot(params, "config read");
	const installRecords = await runUninstallPhase(params, "install records load", () => loadInstalledPluginIndexInstallRecords(cli ? {} : { env }));
	const config = withPluginInstallRecords(snapshot.config, installRecords);
	const metadata = cli ? void 0 : loadFreshManagedPluginMetadata(config, env);
	const index = metadata?.index ?? loadInstalledPluginIndex({
		config,
		installRecords
	});
	const plugins = metadata ? metadata.index.plugins.map((record) => {
		const manifest = metadata.byPluginId.get(record.pluginId);
		return {
			id: record.pluginId,
			name: manifest?.name ?? record.pluginId,
			origin: record.origin,
			source: manifest?.source,
			channelIds: manifest?.channels
		};
	}) : tracePluginLifecyclePhase("plugin registry snapshot", () => buildPluginSnapshotReport({ config }), { command: "uninstall" }).plugins;
	const requestedId = metadata ? metadata.normalizePluginId(params.pluginId.trim()) : params.pluginId;
	const selection = cli ? resolvePluginUninstallId({
		rawId: requestedId,
		config,
		plugins
	}) : ok({
		pluginId: requestedId,
		plugin: plugins.find((plugin) => plugin.id === requestedId)
	});
	if (!selection.ok) return selection;
	const { pluginId: requestedPluginId, plugin } = selection.value;
	if (!cli) {
		if (plugin?.origin === "bundled") return err(`bundled plugin cannot be uninstalled: ${requestedPluginId}; disable it instead`);
		if (!plugin && !Object.hasOwn(installRecords, requestedPluginId)) return err(`Plugin not found: ${requestedPluginId}`);
	}
	const ownership = createInstalledPluginOwnershipResolver(index, env).resolveLifecycle(requestedPluginId);
	if (!ownership.ok) return ownership;
	const { installOwner: pluginId, pluginIds } = ownership.value;
	const policyPluginIds = pluginIds.length ? pluginIds : [pluginId];
	let channelIds;
	if (cli) {
		if (pluginIds.length === 1 && pluginIds[0] === requestedPluginId) channelIds = plugin?.channelIds;
		else if (pluginIds.length) channelIds = uniqueStrings(pluginIds.flatMap((id) => plugins.find((entry) => entry.id === id)?.channelIds ?? []));
		else if (createInstalledPluginIndexScopeLookup(index).hasChannelContributionOwners([pluginId])) channelIds = [];
	} else {
		const manifests = pluginIds.flatMap((id) => metadata?.byPluginId.get(id) ?? []);
		channelIds = manifests.length ? uniqueStrings(manifests.flatMap((manifest) => manifest.channels)) : ownership.value.kind === "orphan" && createInstalledPluginIndexScopeLookup(index).hasChannelContributionOwners([pluginId]) ? [] : void 0;
	}
	const runtimeLoadPaths = pluginIds.flatMap((id) => plugins.find((entry) => entry.id === id)?.source ?? []);
	const extensionsDir = resolveDefaultPluginExtensionsDir(cli ? void 0 : env);
	const planForConfig = (source) => planPluginUninstall(recordPluginPackageUninstallPlan({
		config: withPluginInstallRecords(source, installRecords),
		pluginId,
		...channelIds !== void 0 ? { channelIds } : {},
		deleteFiles: !params.keepFiles,
		extensionsDir
	}, {
		runtimePluginIds: policyPluginIds,
		runtimeLoadPaths
	}));
	const plan = planForConfig(snapshot.config);
	if (!plan.ok) return err(cli && plugin ? `Plugin "${pluginId}" is not managed by plugins config/install records and cannot be uninstalled.` : plan.error);
	return ok({
		snapshot,
		installRecords,
		pluginId,
		requestedPluginId,
		pluginIds,
		policyPluginIds,
		name: plugin?.name || pluginId,
		channelIds,
		plan,
		planForConfig
	});
}
/** Shared leased removal; callbacks preserve CLI output at its original mutation boundaries. */
async function uninstallPluginWithPolicy(params) {
	const env = params.env ?? process.env;
	const cli = params.caller === "cli";
	const applyRuntime = params.applyRuntime ? capturePluginRuntimeApplications(params.applyRuntime).applyRuntime : void 0;
	return await withPluginLifecycleLease({
		...cli ? {} : { env },
		signal: params.signal
	}, async (lease) => {
		const beforePersistentApply = () => {
			params.signal?.throwIfAborted();
			lease.assertOwned();
			params.beforePersistentApply?.();
		};
		beforePersistentApply();
		if (cli) assertConfigWriteAllowedInCurrentMode();
		const preparation = await preparePluginUninstall(params);
		if (!preparation.ok) return preparation;
		const prepared = preparation.value;
		await params.onPreview?.(prepared);
		const uninstall = async () => {
			const { pluginId, requestedPluginId, pluginIds, policyPluginIds, installRecords, plan: initialPlan } = prepared;
			const snapshot = prepared.snapshot;
			const assertConfigPathForWrite = () => {
				snapshot.writeOptions.assertConfigPathForWrite?.();
				beforePersistentApply();
			};
			let directoryResult = {
				directoryRemoved: false,
				warnings: []
			};
			if (initialPlan.directoryRemoval || applyRuntime) {
				const disabledConfig = prepareConfigForDisabledPluginSet(snapshot.config, policyPluginIds, initialPlan.config);
				const write = await runUninstallPhase(params, "config disable", () => replaceConfigFile({
					sourceConfig: disabledConfig,
					baseHash: snapshot.baseHash,
					writeOptions: {
						...snapshot.writeOptions,
						assertConfigPathForWrite,
						afterWrite: params.applyRuntime || params.deferRuntime ? {
							mode: "none",
							reason: "plugin lifecycle applies runtime"
						} : { mode: "auto" }
					}
				}));
				await applyRuntime?.({
					config: disabledConfig,
					write,
					pluginIds: policyPluginIds,
					reason: "uninstall",
					assertInvokerOwned: beforePersistentApply
				});
				beforePersistentApply();
				if (initialPlan.directoryRemoval) {
					const removal = initialPlan.directoryRemoval;
					directoryResult = await withPluginSourceCleanup(removal.target, {
						configPath: write.path,
						env,
						assertCurrent: beforePersistentApply,
						isReferenced: (config) => {
							const current = prepared.planForConfig(config);
							if (!current.ok) throw new Error(current.error);
							return current.actions.loadPath;
						}
					}, (assertCurrent) => applyPluginUninstallDirectoryRemoval(removal, assertCurrent));
				}
				for (const warning of directoryResult.warnings) params.onWarning?.(warning);
				if (initialPlan.directoryRemoval && pluginUninstallTargetExists(initialPlan.directoryRemoval.target)) {
					const message = `Failed to remove plugin directory ${cli ? shortenHomePath(initialPlan.directoryRemoval.target) : initialPlan.directoryRemoval.target}; the plugin remains disabled and tracked so uninstall can be retried.`;
					throw cli ? new Error(message) : new ManagedPluginLifecycleError(message, { kind: "unavailable" });
				}
			}
			const nextInstallRecords = removePluginInstallRecordFromRecords(installRecords, pluginId);
			const { expectedConfigPath, ownedConfigPathForWrite, auditOrigin } = snapshot.writeOptions;
			const io = !cli && params.env ? createConfigIO({
				configPath: ownedConfigPathForWrite ?? expectedConfigPath,
				env: cloneEnvWithPlatformSemantics(env)
			}) : void 0;
			let commitReceipt;
			const transform = () => transformConfigFileWithRetry({
				base: "source",
				...io ? { io: {
					...io,
					readConfigFileSnapshotForWrite: () => createConfigIO({
						configPath: io.configPath,
						env: cloneEnvWithPlatformSemantics(env)
					}).readConfigFileSnapshotForWrite()
				} } : {},
				writeOptions: {
					...expectedConfigPath ? { expectedConfigPath } : {},
					...ownedConfigPathForWrite ? { ownedConfigPathForWrite } : {},
					...auditOrigin ? { auditOrigin } : {},
					assertConfigPathForWrite,
					assertCurrent: beforePersistentApply,
					...cli || params.applyRuntime ? { allowConfigSizeDrop: true } : {},
					...params.applyRuntime || params.deferRuntime ? { afterWrite: {
						mode: "none",
						reason: "plugin lifecycle applies runtime"
					} } : cli ? { afterWrite: {
						mode: "restart",
						reason: "plugin source changed"
					} } : {}
				},
				transform: (currentConfig) => {
					beforePersistentApply();
					const plan = prepared.planForConfig(currentConfig);
					if (!plan.ok) throw cli ? new Error(plan.error) : new ManagedPluginLifecycleError(plan.error);
					return {
						nextConfig: withoutPluginInstallRecords(plan.config),
						result: plan
					};
				},
				commit: async ({ nextConfig, baseHash, writeOptions, afterWrite }) => {
					const receipt = await commitPluginInstallRecordsWithConfig({
						previousInstallRecords: installRecords,
						nextInstallRecords,
						nextConfig,
						baseHash,
						beforePersistentEffect: beforePersistentApply,
						writeOptions: {
							...writeOptions,
							afterWrite
						}
					});
					commitReceipt = receipt;
					return {
						config: receipt.configWrite.nextConfig,
						persistedHash: receipt.configWrite.persistedHash,
						persistedSourceConfig: receipt.configWrite.persistedSourceConfig,
						afterWrite: receipt.configWrite.afterWrite
					};
				}
			});
			const mutation = await runUninstallPhase(params, "config mutation", () => io ? withConfigWriteLock(io.configPath, transform, env, beforePersistentApply) : transform());
			const committed = expectDefined(commitReceipt, "plugin uninstall commit receipt");
			const plan = expectDefined(mutation.result, "committed plugin uninstall plan");
			const nextConfig = mutation.nextConfig;
			params.deferRuntime?.record({
				operation: "uninstall",
				pluginId,
				write: committed
			});
			const warnings = [
				...!cli ? await collectClawPluginUninstallWarnings({
					pluginId,
					installRecord: installRecords[pluginId],
					env
				}) : [],
				...!cli && (requestedPluginId !== pluginId || pluginIds.length > 1) ? [`Uninstalled package "${pluginId}" and all owned plugin entries: ${pluginIds.join(", ")}.`] : [],
				...directoryResult.warnings
			];
			await refreshPluginRegistryAfterConfigMutation({
				configPath: committed.configWrite.path,
				env,
				lease,
				reason: "source-changed",
				installRecords: nextInstallRecords,
				invalidateRuntimeCache: cli ? params.invalidateRuntimeCache : false,
				...cli ? { traceCommand: "uninstall" } : {},
				logger: { warn: (message) => {
					warnings.push(message);
					params.onWarning?.(message);
				} }
			});
			if (!cli) refreshManagedPluginMetadata({
				config: nextConfig,
				env
			});
			const application = await applyRuntime?.({
				config: nextConfig,
				write: committed.configWrite,
				pluginIds: policyPluginIds,
				reason: "uninstall",
				assertInvokerOwned: beforePersistentApply
			});
			const result = {
				...application ? { application } : {},
				pluginId,
				requestedPluginId,
				pluginIds,
				removed: formatUninstallActionLabels({
					...plan.actions,
					loadPath: initialPlan.actions.loadPath || plan.actions.loadPath,
					directory: directoryResult.directoryRemoved
				}),
				warnings: [.../* @__PURE__ */ new Set([...warnings, ...application?.warnings ?? []])]
			};
			params.onComplete?.(result);
			return ok(result);
		};
		const record = prepared.installRecords[prepared.pluginId];
		const packageName = record?.source === "clawhub" ? record.clawhubPackage ?? parseClawHubPluginSpec(record.spec ?? "")?.name : void 0;
		if (params.clawManaged || !packageName || !cli && !params.applyRuntime) return await uninstall();
		return await withClawPackageLifecycleLease({
			kind: "plugin",
			source: "clawhub",
			ref: packageName
		}, uninstall, cli ? void 0 : { env });
	});
}
/** Preserve the management API's canonical-id admission and response shape. */
async function uninstallManagedPlugin(params) {
	const env = params.env ?? process.env;
	return await withPluginLifecycleLease({
		env,
		signal: params.signal
	}, async () => {
		const result = await uninstallPluginWithPolicy({
			...params,
			caller: "management"
		});
		if (!result.ok) throw new ManagedPluginLifecycleError(result.error);
		const { pluginId, removed, warnings, application } = result.value;
		return {
			pluginId,
			removed,
			...warnings.length ? { warnings } : {},
			...application ? { application } : {}
		};
	});
}
//#endregion
export { uninstallManagedPlugin as n, uninstallPluginWithPolicy as r, preparePluginUninstall as t };
