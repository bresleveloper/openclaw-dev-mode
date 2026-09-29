import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { x as resolveIsNixMode } from "./paths-DehQwyE0.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { b as resolveOfficialExternalProviderPluginIds, i as getOfficialExternalPluginCatalogEntryForPackage, o as isOfficialExternalPluginId } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { h as resolveOfficialExternalPluginId } from "./official-external-plugin-catalog-source-CkmJlLAW.mjs";
import { t as loadPluginManifestRegistryCore } from "./manifest-registry-CEG7WMVu.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { V as isBuiltInModelProviderOverlayId } from "./zod-schema.core-DyJd-bbI.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import path from "node:path";
//#region src/plugins/plugin-public-identity.ts
/** True when a plugin identity is already public and safe to report. */
function isPubliclyKnownPluginId(plugin) {
	if (plugin.origin === "bundled" || plugin.trustedOfficialInstall === true) return true;
	if (!isOfficialExternalPluginId(plugin.id)) return false;
	const catalogEntry = getOfficialExternalPluginCatalogEntryForPackage(plugin.packageName);
	return catalogEntry !== void 0 && resolveOfficialExternalPluginId(catalogEntry) === plugin.id;
}
//#endregion
//#region src/plugins/plugin-runtime-inventory.ts
/** Lists loaded plugin identities, or configured manifest identities before runtime activation. */
function listEnabledPluginRecords(config) {
	const registry = getActivePluginRegistry();
	if (registry) return registry.plugins.filter((plugin) => plugin.enabled && plugin.status === "loaded" && (plugin.format === "bundle" || plugin.imported !== false));
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	return loadPluginManifestRegistryCore({ config }).plugins.filter((plugin) => resolveEffectivePluginActivationState({
		id: plugin.id,
		origin: plugin.origin,
		channelIds: plugin.channels,
		config: normalizedConfig,
		rootConfig: config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).enabled).map((plugin) => ({
		id: plugin.id,
		origin: plugin.origin,
		packageName: plugin.packageName,
		trustedOfficialInstall: plugin.trustedOfficialInstall,
		channelIds: plugin.channels
	}));
}
//#endregion
//#region src/infra/telemetry.ts
const DEFAULT_TELEMETRY_ENDPOINT = "https://telemetry.openclaw.ai/api/latest-version";
const TELEMETRY_CHECK_INTERVAL_MS = 864e5;
const TELEMETRY_FAILURE_BACKOFF_MS = 6e4;
const TELEMETRY_TIMEOUT_MS = 3e3;
const TELEMETRY_NOTE_MAX_LENGTH = 500;
const TELEMETRY_PENDING_SUCCESS_LIMIT = 32;
const SAFE_FEATURE_NAME = /^[a-z][a-z0-9_-]{0,63}$/;
const TelemetryResponseSchema = object({
	version: string().trim().min(1),
	note: string().optional()
});
let lastFailedAttempt;
let inFlightUpdate;
const pendingSuccesses = /* @__PURE__ */ new Map();
function captureTelemetryStorage() {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath());
	try {
		return {
			databasePath,
			worker: captureOpenClawStateWorkerContext({ path: databasePath })
		};
	} catch {
		return { databasePath };
	}
}
/**
* CI jobs are not installs. Left unchecked they outnumber operators by orders of
* magnitude and make version and platform counts meaningless, and someone else's
* pipeline should not report to us on every job either. A configured endpoint
* means the caller is deliberately exercising this path, so it still reports.
*/
function isAutomatedEnvironment() {
	if (process.env.OPENCLAW_TELEMETRY_ENDPOINT?.trim()) return false;
	return isTruthyEnvValue(process.env.CI);
}
function isUpdateCheckDisabled(config) {
	return config.update?.checkOnStart === false || isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE) || isAutomatedEnvironment() || resolveIsNixMode();
}
function isDoNotTrackEnabled() {
	const value = process.env.DO_NOT_TRACK?.trim().toLowerCase();
	return value === "1" || value === "true";
}
async function countRecentSessions(context, nowMs) {
	if (!context.worker) return 0;
	try {
		return await runOpenClawStateWorkerOperation(context.worker, (scope) => scope.execute({
			type: "telemetry.countRecentSessions",
			input: { sinceMs: nowMs - TELEMETRY_CHECK_INTERVAL_MS }
		}), { existingOnly: true }) ?? 0;
	} catch {
		return 0;
	}
}
function resolveTelemetryEndpoint() {
	return process.env.OPENCLAW_TELEMETRY_ENDPOINT?.trim() || DEFAULT_TELEMETRY_ENDPOINT;
}
function buildTelemetryUserAgent(surface) {
	return `openclaw/${VERSION} (${process.platform}; node/${process.versions.node}; ${process.arch}; ${surface})`;
}
async function readTelemetryState(context) {
	if (!context.worker) return {};
	try {
		return await runOpenClawStateWorkerOperation(context.worker, (scope) => scope.execute({
			type: "telemetry.readState",
			input: void 0
		}), { existingOnly: true }) ?? {};
	} catch {
		return {};
	}
}
async function persistTelemetrySuccess(key, state, context) {
	const updatedAtMs = Date.now();
	if (context.worker) try {
		return await runOpenClawStateWorkerOperation(context.worker, async (scope) => {
			const persisted = await scope.execute({
				type: "telemetry.persistSuccess",
				input: {
					state,
					updatedAtMs
				}
			});
			pendingSuccesses.delete(key);
			return persisted;
		});
	} catch {}
	pendingSuccesses.delete(key);
	pendingSuccesses.set(key, state);
	if (pendingSuccesses.size > TELEMETRY_PENDING_SUCCESS_LIMIT) {
		const oldestKey = pendingSuccesses.keys().next().value;
		if (oldestKey !== void 0) pendingSuccesses.delete(oldestKey);
	}
	return state;
}
async function resolveTelemetryStatus(config) {
	let reason;
	if (isAutomatedEnvironment()) reason = "automated-environment";
	else if (isUpdateCheckDisabled(config)) reason = "update-disabled";
	else if (isDoNotTrackEnabled()) reason = "do-not-track";
	else if (config.telemetry?.enabled === true) reason = "enabled";
	else if (config.telemetry?.enabled === false || config.telemetry?.consentedAt) reason = "config-disabled";
	else reason = "never-asked";
	const endpoint = resolveTelemetryEndpoint();
	const { lastPingAt } = await readTelemetryState(captureTelemetryStorage());
	return {
		enabled: reason === "enabled",
		reason,
		endpoint,
		...lastPingAt === void 0 ? {} : { lastPingAt }
	};
}
async function buildTelemetryPayload(config, options) {
	return await prepareTelemetryPayload(config, options, captureTelemetryStorage());
}
async function prepareTelemetryPayload(config, options, context) {
	const enabledPlugins = listEnabledPluginRecords(config);
	const publicPlugins = enabledPlugins.filter(isPubliclyKnownPluginId);
	const publicChannelIds = new Set(publicPlugins.flatMap((plugin) => plugin.channelIds));
	const channels = Object.entries(config.channels ?? {}).filter(([channelId, channelConfig]) => SAFE_FEATURE_NAME.test(channelId) && !isChannelConfigMetadataKey(channelId) && isRecord(channelConfig) && channelConfig.enabled !== false && publicChannelIds.has(channelId)).map(([channelId]) => channelId).toSorted();
	const configuredProviders = [
		...Object.keys(config.models?.providers ?? {}),
		...Object.values(config.auth?.profiles ?? {}).map((profile) => profile.provider),
		...collectConfiguredModelRefs(config, { includeChannelModelOverrides: false }).flatMap(({ value }) => {
			const provider = parseModelCatalogRef(value)?.provider;
			return provider ? [provider] : [];
		})
	];
	const providerFamilies = [...new Set(configuredProviders.map(normalizeProviderId))].filter((providerId) => SAFE_FEATURE_NAME.test(providerId) && (isBuiltInModelProviderOverlayId(providerId) || resolveOfficialExternalProviderPluginIds({ providerIds: /* @__PURE__ */ new Set([providerId]) }).length > 0)).toSorted();
	const plugins = [...new Set(publicPlugins.map((plugin) => plugin.id))].filter((pluginId) => SAFE_FEATURE_NAME.test(pluginId)).toSorted();
	return {
		schema: 1,
		version: VERSION,
		platform: `${process.platform}-${process.arch}`,
		node: process.versions.node,
		surface: options.surface,
		features: {
			channels,
			providerFamilies,
			plugins,
			pluginsEnabled: enabledPlugins.length,
			sessionsLast24h: await countRecentSessions(context, Date.now())
		}
	};
}
async function checkTelemetryUpdate(getConfig, options) {
	const config = getConfig();
	if (isUpdateCheckDisabled(config)) return null;
	const precedingCheck = inFlightUpdate;
	const endpoint = resolveTelemetryEndpoint();
	const context = captureTelemetryStorage();
	const pendingKey = JSON.stringify([endpoint, context.databasePath]);
	const nowMs = options.nowMs ?? Date.now();
	const stateDirectory = process.env.OPENCLAW_STATE_DIR;
	const check = async (preceding) => {
		let state = await readTelemetryState(context);
		const pending = pendingSuccesses.get(pendingKey);
		if (pending) {
			if (state.lastPingAt === void 0 || pending.lastPingAt > state.lastPingAt) state = await persistTelemetrySuccess(pendingKey, pending, context);
			else pendingSuccesses.delete(pendingKey);
		}
		const cached = state.latestVersion ? {
			version: state.latestVersion,
			...state.note ? { note: state.note } : {}
		} : null;
		if (state.lastPingAt !== void 0 && nowMs >= state.lastPingAt && nowMs - state.lastPingAt < TELEMETRY_CHECK_INTERVAL_MS) return {
			update: cached,
			networkAttempted: false
		};
		if (!options.fetchImpl && (process.env.VITEST !== void 0 || false)) return {
			update: cached,
			networkAttempted: false
		};
		if (lastFailedAttempt?.endpoint === endpoint && lastFailedAttempt.stateDirectory === stateDirectory && nowMs >= lastFailedAttempt.at && nowMs - lastFailedAttempt.at < TELEMETRY_FAILURE_BACKOFF_MS) return {
			update: cached,
			networkAttempted: false
		};
		if (preceding) {
			const outcome = await preceding;
			if (outcome.networkAttempted) return outcome;
			const current = inFlightUpdate;
			if (!current) inFlightUpdate = pendingCheck;
			return await check(current);
		}
		let networkAttempted = false;
		try {
			const featureStatsEnabled = config.telemetry?.enabled === true && !isDoNotTrackEnabled();
			const headers = { "User-Agent": buildTelemetryUserAgent(options.surface) };
			const init = {
				method: featureStatsEnabled ? "POST" : "GET",
				headers
			};
			if (featureStatsEnabled) {
				headers["Content-Type"] = "application/json";
				init.body = JSON.stringify(await prepareTelemetryPayload(config, { surface: options.surface }, context));
			}
			const currentConfig = getConfig();
			if (isUpdateCheckDisabled(currentConfig)) return {
				update: cached,
				networkAttempted
			};
			if (featureStatsEnabled && (currentConfig.telemetry?.enabled !== true || isDoNotTrackEnabled())) {
				init.method = "GET";
				delete headers["Content-Type"];
				delete init.body;
			}
			init.signal = AbortSignal.timeout(TELEMETRY_TIMEOUT_MS);
			networkAttempted = true;
			const response = await (options.fetchImpl ?? fetch)(endpoint, init);
			if (response.status !== 200) {
				lastFailedAttempt = {
					at: nowMs,
					endpoint,
					stateDirectory
				};
				return {
					update: cached,
					networkAttempted
				};
			}
			const parsed = TelemetryResponseSchema.parse(await readProviderJsonResponse(response, "Telemetry update response"));
			const note = parsed.note?.trim().slice(0, TELEMETRY_NOTE_MAX_LENGTH);
			const update = {
				version: parsed.version,
				...note ? { note } : {}
			};
			const persisted = await persistTelemetrySuccess(pendingKey, {
				lastPingAt: nowMs,
				latestVersion: update.version,
				...update.note ? { note: update.note } : {}
			}, context);
			lastFailedAttempt = void 0;
			return {
				update: {
					version: persisted.latestVersion,
					...persisted.note ? { note: persisted.note } : {}
				},
				networkAttempted
			};
		} catch {
			lastFailedAttempt = {
				at: nowMs,
				endpoint,
				stateDirectory
			};
			return {
				update: cached,
				networkAttempted
			};
		}
	};
	const pendingCheck = check(precedingCheck).finally(() => {
		if (inFlightUpdate === pendingCheck) inFlightUpdate = void 0;
	});
	if (!precedingCheck) inFlightUpdate = pendingCheck;
	return (await pendingCheck).update;
}
//#endregion
export { resolveTelemetryStatus as i, buildTelemetryUserAgent as n, checkTelemetryUpdate as r, buildTelemetryPayload as t };
