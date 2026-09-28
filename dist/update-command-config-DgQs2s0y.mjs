import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { l as resolveConfigIncludes } from "./includes-CaaCq-XN.mjs";
import { y as resolveIncludeRoots } from "./paths-DehQwyE0.mjs";
import { X as resolveConfigEnvVars } from "./redact-B5EGyLvV.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import { f as parsePluginInstallRecordMap } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { d as asResolvedSourceConfig, f as asRuntimeConfig } from "./validation-core-DwJVlxTe.mjs";
import { c as parseConfigJson5 } from "./io.read-helpers-N26RjV2V.mjs";
import { t as composeConfigWriteAssertions } from "./write-authority-BBYsD_pp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as createConfigIO } from "./io.factory-BWiVTxfI.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { isDeepStrictEqual } from "node:util";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-config.ts
const PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS = 216e5;
/** Preserve captured path ownership while adding the update's original executor. */
function withUpdateConfigWriteAuthority(writeOptions, assertCurrent) {
	if (!assertCurrent) return writeOptions;
	const assertOwner = writeOptions.assertCurrent;
	return {
		...writeOptions,
		observe: false,
		assertCurrent: composeConfigWriteAssertions(assertOwner, assertCurrent)
	};
}
function normalizePluginInstallRecordMap(value) {
	const records = parsePluginInstallRecordMap(value);
	if (!records) throw new Error("Invalid plugin install record map");
	return records;
}
function normalizeChannelConfigMap(value) {
	if (!isRecord(value)) return null;
	return value;
}
function normalizeDirectAuthoredChannelConfigMap(value) {
	const channels = normalizeChannelConfigMap(value);
	if (!channels || Object.hasOwn(channels, "$include")) return null;
	return channels;
}
function restorePreUpdateChannelModelOverrides(params) {
	if (params.restoredChannelIds.length === 0) return {
		channels: params.channels,
		changed: false
	};
	const preUpdateModelByChannel = normalizeChannelConfigMap(params.preUpdateChannels.modelByChannel);
	if (!preUpdateModelByChannel) return {
		channels: params.channels,
		changed: false
	};
	const currentModelByChannel = normalizeChannelConfigMap(params.channels.modelByChannel) ?? {};
	const restoredModelByChannel = structuredClone(currentModelByChannel);
	let changed = false;
	for (const [providerId, providerOverrides] of Object.entries(preUpdateModelByChannel)) {
		const preUpdateProviderOverrides = normalizeChannelConfigMap(providerOverrides);
		if (!preUpdateProviderOverrides) continue;
		const currentProviderOverrides = normalizeChannelConfigMap(restoredModelByChannel[providerId]) ?? {};
		let providerChanged = false;
		for (const channelId of params.restoredChannelIds) {
			if (currentProviderOverrides[channelId] !== void 0 || preUpdateProviderOverrides[channelId] === void 0) continue;
			currentProviderOverrides[channelId] = structuredClone(preUpdateProviderOverrides[channelId]);
			providerChanged = true;
		}
		if (providerChanged) {
			restoredModelByChannel[providerId] = currentProviderOverrides;
			changed = true;
		}
	}
	return changed ? {
		channels: {
			...params.channels,
			modelByChannel: restoredModelByChannel
		},
		changed: true
	} : {
		channels: params.channels,
		changed: false
	};
}
function restoreDroppedPreUpdateChannels(snapshot, preUpdateConfig) {
	if (!snapshot.valid || !preUpdateConfig) return {
		snapshot,
		changed: false
	};
	const preUpdateChannels = normalizeChannelConfigMap(preUpdateConfig.sourceConfig.channels);
	if (!preUpdateChannels) return {
		snapshot,
		changed: false
	};
	let restoredChannels = { ...normalizeChannelConfigMap(snapshot.sourceConfig.channels) ?? {} };
	const restoredChannelIds = [];
	let restored = false;
	for (const [channelId, channelConfig] of Object.entries(preUpdateChannels)) {
		if (restoredChannels[channelId] !== void 0) continue;
		restoredChannels[channelId] = structuredClone(channelConfig);
		if (channelId !== "modelByChannel") restoredChannelIds.push(channelId);
		restored = true;
	}
	if (!restored) return {
		snapshot,
		changed: false
	};
	restoredChannels = restorePreUpdateChannelModelOverrides({
		channels: restoredChannels,
		preUpdateChannels,
		restoredChannelIds
	}).channels;
	const authoredChannels = resolveRestoredAuthoredChannels({
		currentChannels: snapshot.sourceConfig.channels,
		currentAuthoredChannels: isRecord(snapshot.parsed) ? snapshot.parsed.channels : snapshot.sourceConfig.channels,
		preUpdateAuthoredChannels: preUpdateConfig.authoredConfig.channels,
		restoredChannelIds
	});
	return {
		snapshot: {
			...createUpdatedConfigSnapshot(snapshot, {
				...snapshot.sourceConfig,
				channels: restoredChannels
			}),
			hash: snapshot.hash
		},
		changed: true,
		...authoredChannels !== void 0 ? { authoredChannels } : {}
	};
}
function hasRestorablePreUpdateChannels(snapshot, preUpdateConfig) {
	if (!snapshot.valid) return false;
	const preUpdateChannels = normalizeChannelConfigMap(preUpdateConfig.sourceConfig.channels);
	if (!preUpdateChannels) return false;
	const postUpdateChannels = normalizeChannelConfigMap(snapshot.sourceConfig.channels) ?? {};
	return Object.keys(preUpdateChannels).some((channelId) => postUpdateChannels[channelId] === void 0);
}
function resolveRestoredAuthoredChannels(params) {
	if (params.preUpdateAuthoredChannels === void 0) return;
	const directAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(params.preUpdateAuthoredChannels);
	if (!directAuthoredChannels) {
		const preUpdateAuthoredChannels = normalizeChannelConfigMap(params.preUpdateAuthoredChannels);
		if (!preUpdateAuthoredChannels) return;
		const currentDirectAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(params.currentAuthoredChannels);
		if (currentDirectAuthoredChannels) return {
			...structuredClone(preUpdateAuthoredChannels),
			...structuredClone(currentDirectAuthoredChannels)
		};
		const currentAuthoredChannels = normalizeChannelConfigMap(params.currentAuthoredChannels);
		return !currentAuthoredChannels || Object.keys(currentAuthoredChannels).length === 0 ? structuredClone(preUpdateAuthoredChannels) : void 0;
	}
	const restoredChannels = { ...normalizeDirectAuthoredChannelConfigMap(params.currentAuthoredChannels) ?? normalizeDirectAuthoredChannelConfigMap(params.currentChannels) ?? {} };
	let changed = false;
	for (const channelId of params.restoredChannelIds) {
		if (restoredChannels[channelId] !== void 0 || directAuthoredChannels[channelId] === void 0) continue;
		restoredChannels[channelId] = structuredClone(directAuthoredChannels[channelId]);
		changed = true;
	}
	const restoredModelOverrides = restorePreUpdateChannelModelOverrides({
		channels: restoredChannels,
		preUpdateChannels: directAuthoredChannels,
		restoredChannelIds: params.restoredChannelIds
	});
	if (restoredModelOverrides.changed) return restoredModelOverrides.channels;
	return changed ? restoredChannels : void 0;
}
async function persistValidatedDowngradeConfig(snapshot, assertCurrent) {
	if (snapshot.valid && shouldWarnOnTouchedVersion(VERSION, snapshot.sourceConfig.meta?.lastTouchedVersion)) await withPluginLifecycleLease({ assertCurrent }, async () => {
		assertCurrent?.();
		await mutateConfigFileWithRetry({
			mutate: () => void 0,
			...assertCurrent ? { writeOptions: withUpdateConfigWriteAuthority({ beforeCommit: assertCurrent }, assertCurrent) } : {}
		});
	});
}
async function persistRequestedUpdateChannel(params) {
	if (!params.requestedChannel || !params.configSnapshot.valid) return params.configSnapshot;
	const storedChannel = normalizeUpdateChannel(params.configSnapshot.config.update?.channel);
	if (params.requestedChannel === storedChannel) return params.configSnapshot;
	const requestedChannel = params.requestedChannel;
	const mutation = await mutateConfigFileWithRetry({
		writeOptions: withUpdateConfigWriteAuthority({
			skipPluginValidation: true,
			...params.assertCurrent ? { beforeCommit: params.assertCurrent } : {}
		}, params.assertCurrent),
		mutate: (draft) => {
			draft.update = {
				...draft.update,
				channel: requestedChannel
			};
		}
	});
	return createUpdatedConfigSnapshot(mutation.snapshot, mutation.nextConfig);
}
/** Capture write provenance in the process that will converge plugins, after any channel write. */
async function preparePostCorePluginConfig(params) {
	const io = createConfigIO({
		pluginValidation: "skip",
		suppressFutureVersionWarning: params.suppressFutureVersionWarning,
		observe: params.observe
	});
	let prepared = await io.readConfigFileSnapshotForWrite();
	params.assertCurrent?.();
	if (await persistRequestedUpdateChannel({
		configSnapshot: prepared.snapshot,
		requestedChannel: params.requestedChannel,
		assertCurrent: params.assertCurrent
	}) !== prepared.snapshot) prepared = await io.readConfigFileSnapshotForWrite();
	params.assertCurrent?.();
	const restored = restoreDroppedPreUpdateChannels(prepared.snapshot, params.preUpdateConfig);
	return {
		configSnapshot: restored.snapshot,
		configWriteOptions: withUpdateConfigWriteAuthority({
			...prepared.writeOptions,
			...params.assertCurrent ? { beforeCommit: params.assertCurrent } : {}
		}, params.assertCurrent),
		configChanged: restored.changed,
		restoredAuthoredChannels: restored.authoredChannels
	};
}
function createUpdatedConfigSnapshot(snapshot, next) {
	if (!snapshot.valid) return snapshot;
	return {
		...snapshot,
		hash: void 0,
		parsed: next,
		sourceConfig: asResolvedSourceConfig(next),
		resolved: asResolvedSourceConfig(next),
		runtimeConfig: asRuntimeConfig(next),
		config: asRuntimeConfig(next)
	};
}
/** Read-only startup configuration, retaining the authored snapshot alongside any projection. */
async function readUpdateChannelConfig(channelRequested) {
	const configSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: true,
		observe: false
	});
	const legacyConfigPlan = channelRequested ? await planUpdateChannelLegacyConfig(configSnapshot) : void 0;
	const plannedConfig = legacyConfigPlan?.config ?? (configSnapshot.valid ? configSnapshot.config : void 0);
	return {
		configSnapshot,
		legacyConfigPlan,
		storedChannel: normalizeUpdateChannel(plannedConfig?.update?.channel)
	};
}
/** Preserve authored bytes during target admission; the projection grants no write authority. */
async function planUpdateChannelLegacyConfig(snapshot) {
	if (snapshot.valid || snapshot.legacyIssues.length === 0) return;
	const { planLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-DdtyEtKL.mjs");
	const plan = planLegacyConfigForUpdateChannel(snapshot);
	if (!plan || !snapshot.includedPaths?.length) return plan;
	const current = await createConfigIO({
		observe: false,
		pluginValidation: "skip"
	}).readConfigFileSnapshotForWrite();
	if ([
		"path",
		"exists",
		"raw",
		"hash",
		"includedPaths",
		"includeProvenance",
		"sourceConfig"
	].some((key) => !isDeepStrictEqual(snapshot[key], current.snapshot[key]))) throw new Error("Legacy configuration changed during update planning; retry against the current source.");
	return planLegacyConfigForUpdateChannel(snapshot, current.writeOptions);
}
async function maybeRepairLegacyConfigForUpdateChannel(params) {
	if (!params.plan && (params.configSnapshot.valid || params.configSnapshot.legacyIssues.length === 0)) return params.configSnapshot;
	const { repairLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-DdtyEtKL.mjs");
	const { snapshot, repaired, warnings } = await repairLegacyConfigForUpdateChannel(params);
	for (const warning of warnings ?? []) defaultRuntime.error(`Warning: ${warning}`);
	if (!params.jsonMode && repaired) defaultRuntime.log(theme.muted("Migrated legacy config before changing update channel."));
	return snapshot;
}
async function writePostCoreSourceConfigFile(filePath, preUpdateConfig) {
	if (!preUpdateConfig) return;
	await fs.writeFile(filePath, `${JSON.stringify(preUpdateConfig)}\n`, "utf-8");
}
async function readPostCoreSourceConfigFile(filePath, options) {
	if (!filePath) return;
	try {
		const parsed = parseConfigJson5(await fs.readFile(filePath, "utf-8"));
		if (!parsed.ok || !isRecord(parsed.parsed)) return;
		return normalizePreUpdateConfigRestoreInput(parsed.parsed, options);
	} catch {
		return;
	}
}
function normalizePreUpdateConfigRestoreInput(parsed, options) {
	const sourceConfig = parsed.sourceConfig;
	const authoredConfig = parsed.authoredConfig;
	if (isRecord(sourceConfig) && isRecord(authoredConfig)) return {
		sourceConfig,
		authoredConfig
	};
	const authored = parsed;
	return {
		sourceConfig: options?.configPath ? resolvePreUpdateSourceConfigFromAuthored(authored, options.configPath) : authored,
		authoredConfig: authored
	};
}
function resolvePreUpdateSourceConfigFromAuthored(authoredConfig, configPath) {
	try {
		const withIncludes = resolveConfigIncludes(authoredConfig, configPath, void 0, { allowedRoots: resolveIncludeRoots(process.env) });
		const resolved = resolveConfigEnvVars(withIncludes, process.env, { onMissing: () => void 0 });
		return isRecord(resolved) ? resolved : authoredConfig;
	} catch {
		return authoredConfig;
	}
}
async function isFreshPreUpdateConfigSnapshot(params) {
	const snapshotStat = await fs.stat(params.snapshotPath).catch(() => null);
	if (!snapshotStat) return false;
	if (params.updateStartedAtMs !== void 0 && snapshotStat.mtimeMs + 1e3 < params.updateStartedAtMs) return false;
	if (Date.now() - snapshotStat.mtimeMs > PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS) return false;
	const currentStat = await fs.stat(params.currentConfigPath).catch(() => null);
	return !currentStat || snapshotStat.mtimeMs <= currentStat.mtimeMs + 1e3;
}
async function readPostCorePreUpdateSourceConfig(params) {
	const fromChildEnv = await readPostCoreSourceConfigFile(params.sourceConfigPath);
	if (fromChildEnv) return fromChildEnv;
	if (params.updateStartedAtMs === void 0) return;
	const explicitPreUpdatePath = `${params.currentSnapshot.path}.pre-update`;
	if (await isFreshPreUpdateConfigSnapshot({
		currentConfigPath: params.currentSnapshot.path,
		snapshotPath: explicitPreUpdatePath,
		updateStartedAtMs: params.updateStartedAtMs
	})) {
		const preUpdateConfig = await readPostCoreSourceConfigFile(explicitPreUpdatePath, { configPath: params.currentSnapshot.path });
		if (preUpdateConfig && hasRestorablePreUpdateChannels(params.currentSnapshot, preUpdateConfig)) return preUpdateConfig;
		return;
	}
	const backupPath = `${params.currentSnapshot.path}.bak`;
	if (await isFreshPreUpdateConfigSnapshot({
		currentConfigPath: params.currentSnapshot.path,
		snapshotPath: backupPath,
		updateStartedAtMs: params.updateStartedAtMs
	})) {
		const preUpdateConfig = await readPostCoreSourceConfigFile(backupPath, { configPath: params.currentSnapshot.path });
		if (preUpdateConfig && hasRestorablePreUpdateChannels(params.currentSnapshot, preUpdateConfig)) return preUpdateConfig;
	}
}
//#endregion
export { preparePostCorePluginConfig as a, withUpdateConfigWriteAuthority as c, persistValidatedDowngradeConfig as i, writePostCoreSourceConfigFile as l, normalizePluginInstallRecordMap as n, readPostCorePreUpdateSourceConfig as o, persistRequestedUpdateChannel as r, readUpdateChannelConfig as s, maybeRepairLegacyConfigForUpdateChannel as t };
