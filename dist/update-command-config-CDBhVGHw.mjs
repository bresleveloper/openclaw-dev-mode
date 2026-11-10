import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { i as resolveConfigEnvVars } from "./env-substitution-4XQMuGXB.mjs";
import { u as resolveConfigIncludes } from "./includes-rygJQufe.mjs";
import { m as resolveConfigPath, x as resolveIncludeRoots } from "./paths-orClZ-2Z.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { s as parseConfigJson5 } from "./io.read-helpers-KYk5dB53.mjs";
import { d as asRuntimeConfig, u as asResolvedSourceConfig } from "./validation-core-ezn1vWYO.mjs";
import { i as createConfigFileSnapshot, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { i as withConfigWriteLock } from "./write-lock-BlX1pI0w.mjs";
import { n as composeConfigWriteAssertions } from "./write-authority-BQPo8rSc.mjs";
import { l as readDeferredPluginMigrationsAsync } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { c as setDeferredPluginMigrationConfigFacts, n as getDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-config.ts
const PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS = 216e5;
/** Update preparation keeps Doctor's retained inputs available until plugin convergence. */
async function readUpdateConfigFileSnapshot(options = {}) {
	const deferredPluginMigrations = options.deferredPluginMigrations ?? await readDeferredPluginMigrationsAsync();
	return await readConfigFileSnapshot({
		...options,
		deferredPluginMigrations
	});
}
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
		const deferredPluginMigrations = await readDeferredPluginMigrationsAsync();
		assertCurrent?.();
		await withConfigWriteLock(snapshot.path, () => mutateConfigFileWithRetry({
			mutate: () => void 0,
			writeOptions: withUpdateConfigWriteAuthority({
				deferredPluginMigrations,
				expectedConfigPath: snapshot.path,
				...assertCurrent ? { beforeCommit: assertCurrent } : {}
			}, assertCurrent)
		}), process.env, assertCurrent);
	});
}
async function persistRequestedUpdateChannel(params) {
	if (!params.requestedChannel || !params.configSnapshot.valid) return params.configSnapshot;
	const storedChannel = normalizeUpdateChannel(params.configSnapshot.config.update?.channel);
	if (params.requestedChannel === storedChannel) return params.configSnapshot;
	const requestedChannel = params.requestedChannel;
	params.assertCurrent?.();
	const deferredPluginMigrations = getDeferredPluginMigrationConfigFacts(params.configSnapshot.sourceConfig) ?? await readDeferredPluginMigrationsAsync();
	params.assertCurrent?.();
	const mutation = await withConfigWriteLock(params.configSnapshot.path, () => mutateConfigFileWithRetry({
		writeOptions: withUpdateConfigWriteAuthority({
			deferredPluginMigrations,
			expectedConfigPath: params.configSnapshot.path,
			skipPluginValidation: true,
			...params.assertCurrent ? { beforeCommit: params.assertCurrent } : {}
		}, params.assertCurrent),
		mutate: (draft) => {
			draft.update = {
				...draft.update,
				channel: requestedChannel
			};
		}
	}), process.env, params.assertCurrent);
	return createUpdatedConfigSnapshot(mutation.snapshot, mutation.nextConfig);
}
/** Capture write provenance in the process that will converge plugins, after any channel write. */
async function preparePostCorePluginConfig(params) {
	params.assertCurrent?.();
	const deferredPluginMigrations = await readDeferredPluginMigrationsAsync();
	params.assertCurrent?.();
	const io = createConfigIO({
		pluginValidation: "skip",
		deferredPluginMigrations,
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
			deferredPluginMigrations,
			...params.assertCurrent ? { beforeCommit: params.assertCurrent } : {}
		}, params.assertCurrent),
		configChanged: restored.changed,
		restoredAuthoredChannels: restored.authoredChannels
	};
}
function createUpdatedConfigSnapshot(snapshot, next) {
	if (!snapshot.valid) return snapshot;
	const updated = {
		...snapshot,
		hash: void 0,
		parsed: next,
		sourceConfig: asResolvedSourceConfig(next),
		resolved: asResolvedSourceConfig(next),
		runtimeConfig: asRuntimeConfig(next),
		config: asRuntimeConfig(next)
	};
	setDeferredPluginMigrationConfigFacts(updated.sourceConfig, getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig));
	return updated;
}
/** Read-only startup configuration, retaining the authored snapshot alongside any projection. */
async function readUpdateChannelConfig(channelRequested, options) {
	let configSnapshot;
	let configReadFailure;
	try {
		configSnapshot = await readUpdateConfigFileSnapshot({
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
	if (channelRequested) ({configSnapshot, legacyConfigPlan} = await planUpdateChannelLegacyConfig(configSnapshot));
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
	const { planLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-D-NVEyEl.mjs");
	const plan = planLegacyConfigForUpdateChannel(snapshot);
	if (!plan || !snapshot.includedPaths?.length) return {
		configSnapshot: snapshot,
		legacyConfigPlan: plan
	};
	const current = await createConfigIO({
		observe: false,
		pluginValidation: "skip",
		deferredPluginMigrations: getDeferredPluginMigrationConfigFacts(snapshot.sourceConfig)
	}).readConfigFileSnapshotForWrite();
	return {
		configSnapshot: current.snapshot,
		legacyConfigPlan: current.snapshot.valid ? void 0 : planLegacyConfigForUpdateChannel(current.snapshot, current.writeOptions)
	};
}
async function maybeRepairLegacyConfigForUpdateChannel(params) {
	if (!params.plan && (params.configSnapshot.valid || params.configSnapshot.legacyIssues.length === 0)) return params.configSnapshot;
	const { repairLegacyConfigForUpdateChannel: repairLegacyConfig } = await import("./legacy-config-repair-D-NVEyEl.mjs");
	const { snapshot, repaired, warnings } = await repairLegacyConfig(params);
	for (const warning of warnings ?? []) defaultRuntime.error(`Warning: ${warning}`);
	if (!params.jsonMode && repaired) defaultRuntime.log(theme.muted("Migrated legacy config for the update."));
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
		const { sourceConfig, authoredConfig } = parsed.parsed;
		if (isRecord(sourceConfig) && isRecord(authoredConfig)) return {
			sourceConfig,
			authoredConfig
		};
		const authored = parsed.parsed;
		let resolvedSourceConfig = authored;
		if (options?.configPath) try {
			const withIncludes = resolveConfigIncludes(authored, options.configPath, void 0, { allowedRoots: resolveIncludeRoots(process.env) });
			const resolved = resolveConfigEnvVars(withIncludes, process.env, { onMissing: () => void 0 });
			if (isRecord(resolved)) resolvedSourceConfig = resolved;
		} catch {}
		return {
			sourceConfig: resolvedSourceConfig,
			authoredConfig: authored
		};
	} catch {
		return;
	}
}
async function readPostCorePreUpdateSourceConfig(params) {
	const fromChildEnv = await readPostCoreSourceConfigFile(params.sourceConfigPath);
	if (fromChildEnv) return fromChildEnv;
	if (params.updateStartedAtMs === void 0) return;
	for (const suffix of [".pre-update", ".bak"]) {
		const snapshotPath = `${params.currentSnapshot.path}${suffix}`;
		const currentConfigPath = params.currentSnapshot.path;
		const updateStartedAtMs = params.updateStartedAtMs;
		const snapshotStat = await fs.stat(snapshotPath).catch(() => null);
		if (!snapshotStat || snapshotStat.mtimeMs + 1e3 < updateStartedAtMs || Date.now() - snapshotStat.mtimeMs > PRE_UPDATE_CONFIG_SNAPSHOT_MAX_AGE_MS) continue;
		const currentStat = await fs.stat(currentConfigPath).catch(() => null);
		if (!(!currentStat || snapshotStat.mtimeMs <= currentStat.mtimeMs + 1e3)) continue;
		const preUpdateConfig = await readPostCoreSourceConfigFile(snapshotPath, { configPath: params.currentSnapshot.path });
		if (!preUpdateConfig) return;
		const snapshot = params.currentSnapshot;
		if (!snapshot.valid) return;
		const preUpdateChannels = asNullableRecord(preUpdateConfig.sourceConfig.channels);
		if (!preUpdateChannels) return;
		const postUpdateChannels = asNullableRecord(snapshot.sourceConfig.channels) ?? {};
		return Object.keys(preUpdateChannels).some((channelId) => postUpdateChannels[channelId] === void 0) ? preUpdateConfig : void 0;
	}
}
//#endregion
export { preparePostCorePluginConfig as a, readUpdateConfigFileSnapshot as c, persistValidatedDowngradeConfig as i, withUpdateConfigWriteAuthority as l, maybeRepairLegacyConfigForUpdateChannel as n, readPostCorePreUpdateSourceConfig as o, persistRequestedUpdateChannel as r, readUpdateChannelConfig as s, capturePreUpdateSourceConfig as t, writePostCoreSourceConfigFile as u };
