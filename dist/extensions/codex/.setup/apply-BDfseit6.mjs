import { p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { s as resolveCodexAppServerFallbackApiKeyCacheKey } from "./auth-cache-key-DS0mnvrR.mjs";
import { a as defaultCodexAppInventoryCache, r as buildCodexPluginAppCacheKey } from "./plugin-app-cache-key-C1YmeiUB.mjs";
import { r as requestCodexAppServerJson } from "./request-DaqFEDj8.mjs";
import { i as CODEX_PLUGINS_MARKETPLACE_NAME } from "./config-B-xRmWRi.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { i as clearSharedCodexAppServerClientIfCurrentAndWait, m as releaseLeasedSharedCodexAppServerClient, mt as resolveCodexAppServerAuthAccountCacheKey, o as getLeasedSharedCodexAppServerClient } from "./shared-client-DhJ31S_8.mjs";
import { i as resolveCodexAppServerAuthProfileIdForAgent } from "./auth-profile-TZnVUd6M.mjs";
import { r as isOpenAiCuratedMarketplaceName } from "./plugin-inventory-2AKJLSMB.mjs";
import { t as ensureCodexPluginActivation } from "./plugin-activation-D_4xfW78.mjs";
import { CODEX_PLUGIN_CONFIG_PATH, buildCodexMigrationPlan, buildCodexPluginsConfigValue, hasCodexPluginConfigConflict, n as resolveCodexConfigPatchMode, readCodexPluginMigrationConfigEntry, t as createCodexAuthItemApplier } from "./plan-B2QoCQa-.mjs";
import { uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { parseStrictNonNegativeInteger } from "openclaw/plugin-sdk/number-runtime";
import { sleep } from "openclaw/plugin-sdk/runtime-env";
import { MIGRATION_REASON_TARGET_EXISTS, applyMigrationManualItem, markMigrationItemConflict, markMigrationItemError, markMigrationItemSkipped, resolveMigrationConfigRuntime, summarizeMigrationItems, writeMigrationConfigPath } from "openclaw/plugin-sdk/migration";
import { archiveMigrationItem, copyMemoryMigrationFileItem, copyMigrationFileItem, resolvePlannedMigrationTargets, withCachedMigrationConfigRuntime, writeMigrationReport } from "openclaw/plugin-sdk/migration-runtime";
// extensions/codex/src/migration/apply.ts
const CODEX_PLUGIN_AUTH_REQUIRED_REASON = "auth_required";
const CODEX_PLUGIN_NOT_SELECTED_REASON = "not selected for migration";
const CODEX_PLUGIN_LOAD_WARNING = "Some Codex plugins could not be migrated. Run `openclaw migrate codex` after onboarding.";
const TARGET_CODEX_MARKETPLACE_DISCOVERY_POLL_MS = 250;
const TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_MS = 3e4;
const TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_ENV = "OPENCLAW_CODEX_MIGRATION_PLUGIN_LIST_TIMEOUT_MS";
const PLUGIN_ACTIVATION_REPORT_STATE = {
	already_active: {
		installed: true,
		enabled: true
	},
	installed: {
		installed: true,
		enabled: true
	},
	auth_required: {
		installed: true,
		enabled: false
	},
	refresh_failed: {
		installed: true,
		enabled: false
	},
	disabled: {
		installed: false,
		enabled: false
	},
	install_failed: {
		installed: false,
		enabled: false
	},
	marketplace_missing: {
		installed: false,
		enabled: false
	},
	plugin_missing: {
		installed: false,
		enabled: false
	}
};
var CodexPluginConfigConflictError = class extends Error {
	constructor(reason) {
		super(reason);
		this.reason = reason;
		this.name = "CodexPluginConfigConflictError";
	}
};
function prepareTargetCodexAppServer(ctx) {
	const appServer = resolveTargetCodexAppServer(ctx);
	const targets = resolvePlannedMigrationTargets(ctx);
	const ready = getLeasedSharedCodexAppServerClient({
		startOptions: appServer.start,
		timeoutMs: 6e4,
		agentDir: targets.agentDir,
		config: ctx.config
	}).catch(() => void 0);
	return { async dispose() {
		const warmedClient = await ready;
		if (warmedClient) releaseLeasedSharedCodexAppServerClient(warmedClient);
		await clearSharedCodexAppServerClientIfCurrentAndWait(warmedClient, {
			exitTimeoutMs: 2e3,
			forceKillDelayMs: 250
		});
	} };
}
async function applyCodexMigrationPlan(params) {
	const plan = params.plan ?? await buildCodexMigrationPlan(params.ctx);
	const reportDir = params.ctx.reportDir ?? path.join(params.ctx.stateDir, "migration", "codex");
	const items = [];
	const targets = resolvePlannedMigrationTargets(params.ctx);
	const codexHome = typeof plan.metadata?.codexHome === "string" && plan.metadata.codexHome.trim() ? plan.metadata.codexHome : plan.source;
	const authSource = {
		codexHome,
		modelsCachePath: path.join(codexHome, "models_cache.json")
	};
	const runtime = withCachedMigrationConfigRuntime(params.ctx.runtime ?? params.runtime, params.ctx.config);
	const applyCtx = {
		...params.ctx,
		runtime
	};
	const applyAuthItem = createCodexAuthItemApplier({
		ctx: applyCtx,
		source: authSource,
		targets,
		items: plan.items
	});
	for (const item of plan.items) {
		if (item.status !== "planned") {
			items.push(item);
			continue;
		}
		if (item.id === "config:codex-plugins") items.push(await applyCodexPluginConfigItem(applyCtx, item, items));
		else if (item.kind === "auth") items.push(...await applyAuthItem(item));
		else if (item.kind === "plugin" && item.action === "install") items.push(await applyCodexPluginInstallItem(applyCtx, item));
		else if (item.kind === "manual") items.push(applyMigrationManualItem(item));
		else if (item.action === "archive") items.push(await archiveMigrationItem(item, reportDir));
		else if (item.kind === "memory") items.push(await copyMemoryMigrationFileItem(item, reportDir, {
			workspaceDir: targets.workspaceDir,
			overwrite: params.ctx.overwrite
		}));
		else items.push(await copyMigrationFileItem(item, reportDir, { overwrite: params.ctx.overwrite }));
	}
	const result = {
		...plan,
		items,
		summary: summarizeMigrationItems(items),
		backupPath: params.ctx.backupPath,
		reportDir
	};
	if (items.some(isCodexPluginLoadWarningItem)) {
		result.warnings = uniqueStrings([...result.warnings ?? [], CODEX_PLUGIN_LOAD_WARNING]);
		result.nextSteps = uniqueStrings([CODEX_PLUGIN_LOAD_WARNING, ...result.nextSteps ?? []]);
	}
	await writeMigrationReport(result, { title: "Codex Migration Report" });
	return result;
}
async function applyCodexPluginInstallItem(ctx, item) {
	const policy = readCodexPluginPolicy(item);
	if (!policy) return {
		...markMigrationItemError(item, "invalid Codex plugin migration item"),
		details: {
			...item.details,
			code: "invalid_plugin_item"
		}
	};
	try {
		const appCacheKey = await buildTargetCodexPluginAppCacheKey(ctx);
		const appServer = resolveTargetCodexAppServer(ctx);
		const result = await ensureCodexPluginActivation({
			identity: policy,
			installEvenIfActive: true,
			request: async (method, requestParams) => await requestTargetCodexAppServerJson({
				method,
				requestParams,
				startOptions: appServer.start,
				agentDir: resolvePlannedMigrationTargets(ctx).agentDir,
				config: ctx.config
			}),
			appCache: defaultCodexAppInventoryCache,
			appCacheKey
		});
		const applied = {
			...item,
			status: result.ok ? "migrated" : "error",
			details: {
				...item.details,
				code: result.reason,
				activationReason: result.reason,
				...PLUGIN_ACTIVATION_REPORT_STATE[result.reason],
				installAttempted: result.installAttempted,
				diagnostics: result.diagnostics.map((diagnostic) => diagnostic.message)
			}
		};
		if (result.ok) {
			if (result.reason === "already_active") applied.reason = "already active";
			return applied;
		}
		applied.reason = result.reason;
		if (result.reason === CODEX_PLUGIN_AUTH_REQUIRED_REASON) {
			applied.status = "skipped";
			applied.details = {
				...applied.details,
				appsNeedingAuth: (result.installResponse?.appsNeedingAuth ?? []).map(({ id, name }) => ({
					id,
					name,
					needsAuth: true
				}))
			};
		} else if (result.reason === "plugin_missing" || result.reason === "marketplace_missing") {
			applied.status = "warning";
			applied.message = `Codex plugin "${policy.pluginName}" could not be migrated automatically`;
			applied.details = {
				...applied.details,
				warningReason: CODEX_PLUGIN_LOAD_WARNING
			};
		}
		return applied;
	} catch (error) {
		if (coerceErrorMessage(error).includes("codex app-server plugin/list timed out")) return {
			...item,
			status: "warning",
			reason: "plugin_inventory_unavailable",
			message: `Codex plugin "${policy.pluginName}" could not be migrated automatically`,
			details: {
				...item.details,
				code: "plugin_inventory_unavailable",
				warningReason: CODEX_PLUGIN_LOAD_WARNING,
				diagnostic: coerceErrorMessage(error)
			}
		};
		return {
			...item,
			status: "error",
			reason: coerceErrorMessage(error),
			details: {
				...item.details,
				code: "plugin_install_failed"
			}
		};
	}
}
function resolveTargetCodexAppServer(ctx) {
	return resolveCodexAppServerRuntimeOptions({ pluginConfig: readCodexPluginConfig(ctx.config.plugins?.entries?.codex?.config) });
}
async function requestTargetCodexAppServerJson(params) {
	const options = {
		...params,
		timeoutMs: 6e4,
		isolated: false
	};
	if (params.method !== "plugin/list") return await requestCodexAppServerJson(options);
	const deadline = performance.now() + options.timeoutMs;
	const discoveryTimeoutMs = targetCodexMarketplaceDiscoveryTimeoutMs();
	const discoveryDeadline = Math.min(deadline, performance.now() + discoveryTimeoutMs);
	let lastResponse;
	do {
		const remainingMs = Math.max(1, discoveryDeadline - performance.now());
		lastResponse = await requestCodexAppServerJson({
			...options,
			timeoutMs: remainingMs
		});
		if (lastResponse.marketplaces.some((marketplace) => isOpenAiCuratedMarketplaceName(marketplace.name))) return lastResponse;
		if (performance.now() >= discoveryDeadline) return lastResponse;
		const waitMs = Math.min(TARGET_CODEX_MARKETPLACE_DISCOVERY_POLL_MS, discoveryDeadline - performance.now());
		await sleep(waitMs);
	} while (performance.now() < discoveryDeadline);
	return lastResponse;
}
function targetCodexMarketplaceDiscoveryTimeoutMs(env = process.env) {
	return parseStrictNonNegativeInteger(env[TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_ENV]) ?? TARGET_CODEX_MARKETPLACE_DISCOVERY_TIMEOUT_MS;
}
function isCodexPluginLoadWarningItem(item) {
	return item.kind === "plugin" && item.action === "install" && item.status === "warning" && item.details?.warningReason === CODEX_PLUGIN_LOAD_WARNING;
}
async function buildTargetCodexPluginAppCacheKey(ctx) {
	const targets = resolvePlannedMigrationTargets(ctx);
	const appServer = resolveTargetCodexAppServer(ctx);
	const authProfileId = await resolveCodexAppServerAuthProfileIdForAgent({
		agentDir: targets.agentDir,
		config: ctx.config
	});
	const accountId = await resolveCodexAppServerAuthAccountCacheKey({
		authProfileId,
		agentDir: targets.agentDir,
		config: ctx.config
	});
	const envApiKeyFingerprint = authProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start });
	return buildCodexPluginAppCacheKey({
		appServer,
		agentDir: targets.agentDir,
		authProfileId,
		accountId,
		envApiKeyFingerprint
	});
}
async function applyCodexPluginConfigItem(ctx, item, appliedItems) {
	if (appliedItems.some((candidate) => candidate.kind === "plugin" && candidate.action === "install" && readCodexPluginMigrationConfigEntry(candidate, true) !== void 0 && !isCodexPluginConfigTerminal(candidate))) return {
		...item,
		status: "warning",
		reason: "selected Codex plugin activation is incomplete"
	};
	const entries = appliedItems.map(readAppliedPluginConfigEntry).filter((entry) => entry !== void 0);
	if (entries.length === 0) return {
		...markMigrationItemSkipped(item, "no selected Codex plugins"),
		deferredCompletion: true
	};
	const returnPatch = resolveCodexConfigPatchMode(ctx) === "return";
	const configApi = resolveMigrationConfigRuntime(ctx);
	const currentConfig = returnPatch ? ctx.config : configApi?.current?.();
	if (!currentConfig) return markMigrationItemError(item, "config runtime unavailable");
	const value = buildCodexPluginsConfigValue(entries, currentConfig);
	if (!ctx.overwrite && hasCodexPluginConfigConflict(currentConfig, value)) return markMigrationItemConflict(item, MIGRATION_REASON_TARGET_EXISTS);
	const migratedItem = {
		...item,
		status: "migrated",
		details: {
			...item.details,
			path: [...CODEX_PLUGIN_CONFIG_PATH],
			value
		}
	};
	if (returnPatch) return migratedItem;
	if (!configApi?.mutateConfigFile) return markMigrationItemError(item, "config runtime unavailable");
	try {
		await configApi.mutateConfigFile({
			base: "runtime",
			afterWrite: { mode: "auto" },
			mutate(draft) {
				if (!ctx.overwrite && hasCodexPluginConfigConflict(draft, value)) throw new CodexPluginConfigConflictError(MIGRATION_REASON_TARGET_EXISTS);
				writeMigrationConfigPath(draft, CODEX_PLUGIN_CONFIG_PATH, value);
			}
		});
		return migratedItem;
	} catch (error) {
		if (error instanceof CodexPluginConfigConflictError) return markMigrationItemConflict(item, error.reason);
		return markMigrationItemError(item, coerceErrorMessage(error));
	}
}
function isCodexPluginConfigTerminal(item) {
	return item.status === "migrated" || item.status === "skipped" && (item.deferredCompletion === true || item.reason === CODEX_PLUGIN_NOT_SELECTED_REASON || item.reason === CODEX_PLUGIN_AUTH_REQUIRED_REASON);
}
function readAppliedPluginConfigEntry(item) {
	if (item.status === "migrated" || item.deferredCompletion === true) return readCodexPluginMigrationConfigEntry(item, true);
	if (item.status === "skipped" && item.reason === CODEX_PLUGIN_AUTH_REQUIRED_REASON) return readCodexPluginMigrationConfigEntry(item, false);
}
function readCodexPluginPolicy(item) {
	const entry = readCodexPluginMigrationConfigEntry(item, true);
	if (!entry) return;
	return {
		configKey: entry.configKey,
		marketplaceName: CODEX_PLUGINS_MARKETPLACE_NAME,
		pluginName: entry.pluginName,
		enabled: true,
		allowDestructiveActions: true,
		destructiveApprovalMode: "allow"
	};
}
export { applyCodexMigrationPlan, prepareTargetCodexAppServer };
