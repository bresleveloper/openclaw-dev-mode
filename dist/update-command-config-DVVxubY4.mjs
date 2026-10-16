import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveConfigEnvVars } from "./env-substitution-mBnQ8cYd.mjs";
import { u as resolveConfigIncludes } from "./includes-BkzfmxST.mjs";
import { m as resolveConfigPath, x as resolveIncludeRoots } from "./paths-DGIwWbpu.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BquD107I.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import { s as parseConfigJson5 } from "./io.read-helpers-Bvdjf9tk.mjs";
import { d as asRuntimeConfig, u as asResolvedSourceConfig } from "./validation-core-DxMw-ato.mjs";
import { i as createConfigFileSnapshot, t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import { t as composeConfigWriteAssertions } from "./write-authority-BBYsD_pp.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/cli/update-cli/update-command-config.ts
const PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS = 216e5;
function capturePreUpdateSourceConfig(snapshot) {
	return snapshot.valid ? {
		sourceConfig: snapshot.sourceConfig,
		authoredConfig: isRecord(snapshot.parsed) ? snapshot.parsed : snapshot.sourceConfig
	} : void 0;
}
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
function normalizeDirectAuthoredChannelConfigMap(value) {
	const channels = asNullableRecord(value);
	if (!channels || Object.hasOwn(channels, "$include")) return null;
	return channels;
}
function restoreMissingChannelConfigKeys(current, previous) {
	const restored = [];
	for (const [key, value] of Object.entries(previous)) if (current[key] === void 0) {
		current[key] = structuredClone(value);
		restored.push(key);
	}
	return restored;
}
function restorePreUpdateChannelModelOverrides(params) {
	if (params.restoredChannelIds.length === 0) return params.channels;
	const preUpdateModelByChannel = asNullableRecord(params.preUpdateChannels.modelByChannel);
	if (!preUpdateModelByChannel) return params.channels;
	const currentModelByChannel = asNullableRecord(params.channels.modelByChannel) ?? {};
	const restoredModelByChannel = structuredClone(currentModelByChannel);
	let changed = false;
	for (const [providerId, providerOverrides] of Object.entries(preUpdateModelByChannel)) {
		const preUpdateProviderOverrides = asNullableRecord(providerOverrides);
		if (!preUpdateProviderOverrides) continue;
		const currentProviderOverrides = asNullableRecord(restoredModelByChannel[providerId]) ?? {};
		if (restoreMissingChannelConfigKeys(currentProviderOverrides, Object.fromEntries(params.restoredChannelIds.filter((channelId) => preUpdateProviderOverrides[channelId] !== void 0).map((channelId) => [channelId, preUpdateProviderOverrides[channelId]]))).length > 0) {
			restoredModelByChannel[providerId] = currentProviderOverrides;
			changed = true;
		}
	}
	return changed ? {
		...params.channels,
		modelByChannel: restoredModelByChannel
	} : params.channels;
}
function restoreDroppedPreUpdateChannels(snapshot, preUpdateConfig) {
	if (!snapshot.valid || !preUpdateConfig) return {
		snapshot,
		changed: false
	};
	const preUpdateChannels = asNullableRecord(preUpdateConfig.sourceConfig.channels);
	if (!preUpdateChannels) return {
		snapshot,
		changed: false
	};
	let restoredChannels = { ...asNullableRecord(snapshot.sourceConfig.channels) ?? {} };
	const restoredKeys = restoreMissingChannelConfigKeys(restoredChannels, preUpdateChannels);
	if (restoredKeys.length === 0) return {
		snapshot,
		changed: false
	};
	const restoredChannelIds = restoredKeys.filter((channelId) => channelId !== "modelByChannel");
	restoredChannels = restorePreUpdateChannelModelOverrides({
		channels: restoredChannels,
		preUpdateChannels,
		restoredChannelIds
	});
	const authoredChannels = resolveRestoredAuthoredChannels({
		currentChannels: snapshot.sourceConfig.channels,
		currentAuthoredChannels: capturePreUpdateSourceConfig(snapshot)?.authoredConfig.channels,
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
	const preUpdateChannels = asNullableRecord(preUpdateConfig.sourceConfig.channels);
	if (!preUpdateChannels) return false;
	const postUpdateChannels = asNullableRecord(snapshot.sourceConfig.channels) ?? {};
	return Object.keys(preUpdateChannels).some((channelId) => postUpdateChannels[channelId] === void 0);
}
function resolveRestoredAuthoredChannels(params) {
	if (params.preUpdateAuthoredChannels === void 0) return;
	const directAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(params.preUpdateAuthoredChannels);
	if (!directAuthoredChannels) {
		const preUpdateAuthoredChannels = asNullableRecord(params.preUpdateAuthoredChannels);
		if (!preUpdateAuthoredChannels) return;
		const currentDirectAuthoredChannels = normalizeDirectAuthoredChannelConfigMap(params.currentAuthoredChannels);
		if (currentDirectAuthoredChannels) return {
			...structuredClone(preUpdateAuthoredChannels),
			...structuredClone(currentDirectAuthoredChannels)
		};
		const currentAuthoredChannels = asNullableRecord(params.currentAuthoredChannels);
		return !currentAuthoredChannels || Object.keys(currentAuthoredChannels).length === 0 ? structuredClone(preUpdateAuthoredChannels) : void 0;
	}
	const restoredChannels = { ...normalizeDirectAuthoredChannelConfigMap(params.currentAuthoredChannels) ?? normalizeDirectAuthoredChannelConfigMap(params.currentChannels) ?? {} };
	const changed = restoreMissingChannelConfigKeys(restoredChannels, Object.fromEntries(params.restoredChannelIds.filter((channelId) => directAuthoredChannels[channelId] !== void 0).map((channelId) => [channelId, directAuthoredChannels[channelId]]))).length > 0;
	const restoredModelOverrides = restorePreUpdateChannelModelOverrides({
		channels: restoredChannels,
		preUpdateChannels: directAuthoredChannels,
		restoredChannelIds: params.restoredChannelIds
	});
	return changed || restoredModelOverrides !== restoredChannels ? restoredModelOverrides : void 0;
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
async function readUpdateChannelConfig(channelRequested, options) {
	let configSnapshot;
	let configReadFailure;
	try {
		configSnapshot = await readConfigFileSnapshot({
			skipPluginValidation: true,
			observe: false
		});
	} catch (error) {
		if (!options?.tolerateReadFailure) throw error;
		configReadFailure = toErrorObject(error, "Configuration could not be read.");
		configSnapshot = createConfigFileSnapshot({
			path: resolveConfigPath(),
			exists: true,
			raw: null,
			parsed: null,
			sourceConfig: {},
			runtimeConfig: {},
			valid: false,
			issues: [{
				path: "",
				message: "Configuration could not be read."
			}],
			warnings: [],
			legacyIssues: [],
			readError: { code: null }
		});
	}
	let legacyConfigPlan;
	if (channelRequested || options?.tolerateReadFailure) ({configSnapshot, legacyConfigPlan} = await planUpdateChannelLegacyConfig(configSnapshot));
	const plannedConfig = legacyConfigPlan?.config ?? (configSnapshot.valid ? configSnapshot.config : options?.tolerateReadFailure ? configSnapshot.sourceConfig : void 0);
	return {
		configSnapshot,
		configReadFailure,
		legacyConfigPlan,
		storedChannel: normalizeUpdateChannel(plannedConfig?.update?.channel)
	};
}
/** Preserve authored bytes during target admission; the projection grants no write authority. */
async function planUpdateChannelLegacyConfig(snapshot) {
	if (snapshot.valid || snapshot.legacyIssues.length === 0) return { configSnapshot: snapshot };
	const { planLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-Dtn3xZqx.mjs");
	const plan = planLegacyConfigForUpdateChannel(snapshot);
	if (!plan || !snapshot.includedPaths?.length) return {
		configSnapshot: snapshot,
		legacyConfigPlan: plan
	};
	const current = await createConfigIO({
		observe: false,
		pluginValidation: "skip"
	}).readConfigFileSnapshotForWrite();
	if (snapshot.path !== current.snapshot.path) throw new Error("Legacy configuration path changed during update planning; retry against the current source.");
	if ([
		"exists",
		"raw",
		"hash",
		"includedPaths",
		"includeProvenance",
		"sourceConfig"
	].some((key) => !isDeepStrictEqual(snapshot[key], current.snapshot[key]))) defaultRuntime.error(`Warning: Configuration changed during update planning at ${snapshot.path}; continuing with the current configuration.`);
	return {
		configSnapshot: current.snapshot,
		legacyConfigPlan: current.snapshot.valid ? void 0 : planLegacyConfigForUpdateChannel(current.snapshot, current.writeOptions)
	};
}
async function maybeRepairLegacyConfigForUpdateChannel(params) {
	if (!params.plan && (params.configSnapshot.valid || params.configSnapshot.legacyIssues.length === 0)) return params.configSnapshot;
	const { repairLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-Dtn3xZqx.mjs");
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
	for (const suffix of [".pre-update", ".bak"]) {
		const snapshotPath = `${params.currentSnapshot.path}${suffix}`;
		if (!await isFreshPreUpdateConfigSnapshot({
			currentConfigPath: params.currentSnapshot.path,
			snapshotPath,
			updateStartedAtMs: params.updateStartedAtMs
		})) continue;
		const preUpdateConfig = await readPostCoreSourceConfigFile(snapshotPath, { configPath: params.currentSnapshot.path });
		return preUpdateConfig && hasRestorablePreUpdateChannels(params.currentSnapshot, preUpdateConfig) ? preUpdateConfig : void 0;
	}
}
//#endregion
export { preparePostCorePluginConfig as a, withUpdateConfigWriteAuthority as c, persistValidatedDowngradeConfig as i, writePostCoreSourceConfigFile as l, maybeRepairLegacyConfigForUpdateChannel as n, readPostCorePreUpdateSourceConfig as o, persistRequestedUpdateChannel as r, readUpdateChannelConfig as s, capturePreUpdateSourceConfig as t };
