import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-D0kh4WcK.mjs";
import { o as tracePluginLifecyclePhase, s as tracePluginLifecyclePhaseAsync } from "./discovery-D_5mAUI7.mjs";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DnOgVB7K.mjs";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-r-Sm6wpn.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { t as createInstalledPluginOwnershipResolver } from "./installed-plugin-package-ownership-BnGMmE02.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as withoutPluginInstallRecords, i as withPluginInstallRecords, r as removePluginInstallRecordFromRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { t as createInstalledPluginIndexScopeLookup } from "./installed-plugin-index-scope-lookup-Dl4k2vJA.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { r as withClawPackageLifecycleLease } from "./claw-package-lifecycle-lease-YnpLFoM-.mjs";
import { a as prepareConfigForDisabledPluginSet, i as pluginUninstallTargetExists, n as formatUninstallActionLabels, o as recordPluginPackageUninstallPlan, r as planPluginUninstall, t as applyPluginUninstallDirectoryRemoval } from "./uninstall-Bz4RjU1V.mjs";
import { i as commitPluginInstallRecordsWithConfig } from "./install-record-commit-DDMKSyro.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-B0PJDNFd.mjs";
import { r as selectInstallMutationWriteOptions } from "./install-config-mutation-COmtsyZD.mjs";
import { o as buildPluginSnapshotReport } from "./status-tJQ_0mMd.mjs";
import { r as capturePluginRuntimeApplications } from "./lifecycle-D58-fLcH.mjs";
import { t as readPluginMutationSnapshot } from "./management-config-CpRbfnfV.mjs";
import { i as refreshManagedPluginMetadata, r as loadFreshManagedPluginMetadata } from "./management-service-BPiOYlEh.mjs";
import { t as collectClawPluginUninstallWarnings } from "./uninstall-claw-references--MenFN-T.mjs";
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
		params.onPreview?.(prepared);
		const uninstall = async () => {
			const { pluginId, requestedPluginId, pluginIds, policyPluginIds, installRecords, plan: initialPlan } = prepared;
			let plan = initialPlan;
			let snapshot = prepared.snapshot;
			const guardedWriteOptions = (options) => ({
				...options,
				assertConfigPathForWrite: () => {
					options.assertConfigPathForWrite?.();
					beforePersistentApply();
				}
			});
			let directoryResult = {
				directoryRemoved: false,
				warnings: []
			};
			if (plan.directoryRemoval || applyRuntime) {
				const disabledConfig = prepareConfigForDisabledPluginSet(snapshot.config, policyPluginIds, plan.config);
				const write = await runUninstallPhase(params, "config disable", () => replaceConfigFile({
					sourceConfig: disabledConfig,
					baseHash: snapshot.baseHash,
					writeOptions: {
						...guardedWriteOptions(snapshot.writeOptions),
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
				directoryResult = await applyPluginUninstallDirectoryRemoval(plan.directoryRemoval, beforePersistentApply);
				for (const warning of directoryResult.warnings) params.onWarning?.(warning);
				if (plan.directoryRemoval && pluginUninstallTargetExists(plan.directoryRemoval.target)) {
					const message = `Failed to remove plugin directory ${cli ? shortenHomePath(plan.directoryRemoval.target) : plan.directoryRemoval.target}; the plugin remains disabled and tracked so uninstall can be retried.`;
					throw cli ? new Error(message) : new ManagedPluginLifecycleError(message, { kind: "unavailable" });
				}
				snapshot = await readUninstallSnapshot(params, "config reread");
				const refreshed = prepared.planForConfig(snapshot.config);
				if (!refreshed.ok) throw cli ? new Error(refreshed.error) : new ManagedPluginLifecycleError(refreshed.error);
				plan = refreshed;
			}
			const nextConfig = withoutPluginInstallRecords(plan.config);
			const nextInstallRecords = removePluginInstallRecordFromRecords(installRecords, pluginId);
			const committed = await runUninstallPhase(params, "config mutation", () => commitPluginInstallRecordsWithConfig({
				previousInstallRecords: installRecords,
				nextInstallRecords,
				nextConfig,
				baseHash: snapshot.baseHash,
				beforePersistentEffect: beforePersistentApply,
				writeOptions: {
					...guardedWriteOptions(snapshot.writeOptions),
					...cli || params.applyRuntime ? { allowConfigSizeDrop: true } : {},
					...params.applyRuntime || params.deferRuntime ? { afterWrite: {
						mode: "none",
						reason: "plugin lifecycle applies runtime"
					} } : cli ? { afterWrite: {
						mode: "restart",
						reason: "plugin source changed"
					} } : {}
				}
			}));
			params.deferRuntime?.record({
				operation: "uninstall",
				pluginId,
				write: committed
			});
			const warnings = [
				...!cli ? collectClawPluginUninstallWarnings({
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
		}, uninstall, {
			...cli ? {} : { env },
			required: true
		});
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
