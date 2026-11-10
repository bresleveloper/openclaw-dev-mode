import { t as resolveCodexAppServerHomeDir } from "./auth-start-options-P3n7Bssz.mjs";
import { o as resolveCodexComputerUseConfig } from "./config-options-l737cwJB.mjs";
import { a as isManagedCodexDesktopCommand, b as resolveMacOSDesktopCodexBundledMarketplaceCandidates } from "./managed-binary-CN7ii1MZ.mjs";
import { n as describeControlFailure } from "./capabilities-Cul-h11D.mjs";
import { n as requestCodexAppServerClientJson } from "./request-i8njrYRU.mjs";
import "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { at as resolveBundledComputerUseMarketplacePath, c as readCodexAppServerClientDesktopGeneration, ct as isLegacyCodexComputerUsePluginDisabled, dt as assertNotSymlink, g as withCodexAppServerClientRequestScope, lt as resolveManagedCodexComputerUseConfig, nt as reconcileCodexComputerUseStartArtifacts, o as getLeasedSharedCodexAppServerClient, ot as resolveClientManagedBundledMarketplacePath, p as releaseLeasedSharedCodexAppServerClient, st as hasLegacyCodexComputerUseMcpPolicy, u as readCodexAppServerClientProcessIdentity, ut as ensureCodexComputerUseSharedPluginCache } from "./shared-client-BEHXwqz5.mjs";
import { l as retireUnsafeCodexTurnClientBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-CCBoNjA1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/codex/src/app-server/computer-use-readiness.ts
/** Computer Use readiness probes and their native subscription lifecycle. */
function createComputerUseRequest(params) {
	const assertCurrent = params.assertCurrent;
	if (params.request) {
		const request = params.request;
		if (!assertCurrent) return request;
		return async (method, requestParams, options) => {
			if (method !== "thread/unsubscribe") assertCurrent();
			return await request(method, requestParams, options);
		};
	}
	const client = params.client;
	if (!client) throw new Error("Computer Use setup requires an acquired app-server client");
	return async (method, requestParams, options) => await client.request(method, requestParams, {
		timeoutMs: options?.timeoutMs ?? params.timeoutMs,
		signal: options?.signal ?? params.signal,
		...method === "thread/unsubscribe" ? {} : { assertCurrent }
	});
}
const COMPUTER_USE_LIVE_TEST_RETRY_COUNT = 1;
const COMPUTER_USE_LIVE_TEST_THREAD_NAME = "OpenClaw Computer Use readiness check";
const COMPUTER_USE_LIST_APPS_TOOL = "list_apps";
const COMPUTER_USE_UNIFIED_JS_TOOL = "js";
const COMPUTER_USE_UNIFIED_JS_PROBE = "await cua.listApps();";
async function runCodexComputerUseLiveTest(params) {
	const startedAt = Date.now();
	let lastError;
	let repair;
	const probe = params.tools?.includes(COMPUTER_USE_UNIFIED_JS_TOOL) && !params.tools.includes(COMPUTER_USE_LIST_APPS_TOOL) ? {
		tool: COMPUTER_USE_UNIFIED_JS_TOOL,
		arguments: { code: COMPUTER_USE_UNIFIED_JS_PROBE }
	} : {
		tool: COMPUTER_USE_LIST_APPS_TOOL,
		arguments: {}
	};
	const liveTestStatus = (attempts, error) => ({
		status: error === void 0 ? "passed" : "failed",
		ok: error === void 0,
		attempted: true,
		attempts,
		timeoutMs: params.config.liveTestTimeoutMs,
		retried: attempts > 1,
		repaired: Boolean(repair?.attempted && repair.warnings.length === 0),
		durationMs: Math.max(0, Date.now() - startedAt),
		message: error === void 0 ? "Computer Use live test passed." : `Computer Use live test failed after ${attempts} attempts: ${error}`,
		...error === void 0 ? {} : { error }
	});
	for (let attempt = 0; attempt <= COMPUTER_USE_LIVE_TEST_RETRY_COUNT; attempt += 1) {
		let threadId;
		let outcome;
		try {
			threadId = (await params.request("thread/start", {
				input: [],
				developerInstructions: COMPUTER_USE_LIVE_TEST_THREAD_NAME,
				ephemeral: true
			}, { timeoutMs: params.config.liveTestTimeoutMs })).thread.id;
			if ((await params.request("mcpServer/tool/call", {
				threadId,
				server: params.config.mcpServerName,
				tool: probe.tool,
				arguments: probe.arguments
			}, { timeoutMs: params.config.toolCallTimeoutMs })).isError === true) throw new Error(`Computer Use readiness tool ${params.config.mcpServerName}.${probe.tool} returned an error result`);
			outcome = { liveTest: liveTestStatus(attempt + 1) };
		} catch (error) {
			outcome = { error };
		}
		let cleanupError;
		if (threadId) try {
			await cleanupComputerUseProbeThread(params, threadId);
		} catch (error) {
			cleanupError = toErrorObject(error, "Computer Use readiness cleanup failed");
		}
		if ("error" in outcome && params.signal?.aborted) throw toErrorObject(outcome.error, "Computer Use live test failed");
		if (cleanupError) throw cleanupError;
		if ("liveTest" in outcome) return {
			liveTest: outcome.liveTest,
			...repair ? { repair } : {}
		};
		lastError = outcome.error;
		if (attempt < COMPUTER_USE_LIVE_TEST_RETRY_COUNT && params.config.autoRepair) repair = await repairComputerUseMcpRuntime(params.request, params.config);
	}
	return {
		liveTest: liveTestStatus(2, describeControlFailure(lastError)),
		...repair ? { repair } : {}
	};
}
async function repairComputerUseMcpRuntime(request, config) {
	try {
		await request("config/mcpServer/reload", void 0, { timeoutMs: config.liveTestTimeoutMs });
		return {
			attempted: true,
			killedPids: [],
			warnings: [],
			message: "Reloaded Computer Use MCP servers through Codex app-server."
		};
	} catch (error) {
		const message = `Could not reload Computer Use MCP servers: ${describeControlFailure(error)}`;
		return {
			attempted: true,
			killedPids: [],
			warnings: [message],
			message
		};
	}
}
async function cleanupComputerUseProbeThread(params, threadId) {
	try {
		await params.request("thread/unsubscribe", { threadId }, {
			timeoutMs: params.config.liveTestTimeoutMs,
			signal: AbortSignal.timeout(params.config.liveTestTimeoutMs)
		});
	} catch (error) {
		if (params.client) await retireUnsafeCodexTurnClientBestEffort(params.client, "Computer Use readiness cleanup");
		throw new CodexAppServerUnsafeSubscriptionError("Computer Use readiness cleanup failed", { cause: error });
	}
}
function skippedLiveTestStatus(config, message) {
	return {
		status: "skipped",
		ok: false,
		attempted: false,
		attempts: 0,
		timeoutMs: config.liveTestTimeoutMs,
		retried: false,
		repaired: false,
		message
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-status.ts
function unavailableStatus(config, reason, message) {
	const disabled = reason === "disabled";
	return {
		enabled: !disabled,
		ready: false,
		reason,
		installed: reason === "plugin_disabled" ? null : false,
		pluginEnabled: false,
		mcpServerAvailable: false,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		...!disabled && config.marketplaceName ? { marketplaceName: config.marketplaceName } : {},
		...!disabled && config.marketplacePath ? { marketplacePath: config.marketplacePath } : {},
		tools: [],
		installation: {
			status: disabled ? "disabled" : reason === "plugin_disabled" ? "unchecked" : reason === "marketplace_missing" ? "marketplace_missing" : "not_installed",
			ok: false,
			message
		},
		exposure: {
			status: "skipped",
			ok: false,
			message: disabled ? "MCP exposure was not checked because Computer Use is disabled." : "MCP exposure was not checked because Computer Use installation is not ready."
		},
		liveTest: skippedLiveTestStatus(config, disabled ? "Computer Use live test was not run because Computer Use is disabled." : "Computer Use live test was not run because installation is not ready."),
		warnings: [],
		message
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use.ts
var CodexComputerUseSetupError = class extends Error {
	constructor(status) {
		super(status.message);
		this.name = "CodexComputerUseSetupError";
		this.status = status;
	}
};
const CURATED_MARKETPLACE_POLL_INTERVAL_MS = 2e3;
const BUNDLED_MARKETPLACE_NAME = "openai-bundled";
const COMPUTER_USE_MARKETPLACE_NAME_PRIORITY = [
	BUNDLED_MARKETPLACE_NAME,
	"openai-curated",
	"openai-api-curated",
	"openai-curated-remote",
	"local"
];
/** Reads Computer Use readiness without installing or mutating app-server state. */
async function readCodexComputerUseStatus(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return unavailableStatus(config, "disabled", "Computer Use is disabled.");
	try {
		return await inspectCodexComputerUse({
			...params,
			computerUseConfig: config,
			runLiveTest: true,
			installMode: "none"
		});
	} catch (error) {
		return unavailableStatus(config, "check_failed", `Computer Use check failed: ${describeControlFailure(error)}`);
	}
}
/**
* Ensures installation and MCP exposure before a turn, optionally installing when
* config allows safe auto-install. Only strict startup waits for a live probe.
*/
async function ensureCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig(params);
	if (!config.enabled) return unavailableStatus(config, "disabled", "Computer Use is disabled.");
	const inspection = {
		computerUseConfig: config,
		runLiveTest: config.strictReadiness,
		refreshSharedCache: config.autoInstall
	};
	let status = await inspectCodexComputerUse({
		...params,
		...inspection,
		installMode: "none"
	});
	if (!status.ready && config.autoInstall) {
		if (config.marketplaceSource) throw new CodexComputerUseSetupError(unavailableStatus(config, "auto_install_blocked", "Computer Use auto-install only uses marketplaces Codex app-server has already discovered. Run /codex computer-use install to install from a configured marketplace source."));
		status = await inspectCodexComputerUse({
			...params,
			...inspection,
			installMode: "automatic"
		});
	}
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
async function installCodexComputerUse(params = {}) {
	const config = resolveComputerUseConfig({
		...params,
		forceEnable: true,
		overrides: {
			...params.overrides,
			enabled: true,
			autoInstall: true
		}
	});
	const status = await inspectCodexComputerUse({
		...params,
		computerUseConfig: config,
		runLiveTest: true,
		installMode: "explicit"
	});
	if (!status.ready) throw new CodexComputerUseSetupError(status);
	return status;
}
async function inspectCodexComputerUse(params) {
	const resolvedRuntime = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.pluginConfig,
		managedCommandOrder: "desktop-first"
	});
	const operationTimeoutMs = params.timeoutMs ?? resolvedRuntime.requestTimeoutMs;
	const deadline = operationTimeoutMs > 0 ? performance.now() + operationTimeoutMs : void 0;
	const remainingTimeoutMs = () => deadline === void 0 ? operationTimeoutMs : Math.max(1, deadline - performance.now());
	const clientOptions = {
		startOptions: resolvedRuntime.start,
		pluginConfig: params.pluginConfig,
		config: params.config,
		agentDir: params.agentDir,
		abandonSignal: params.signal,
		assertCurrent: params.assertCurrent
	};
	const lease = {};
	try {
		let client = params.client;
		if (!client && !params.request) {
			client = await getLeasedSharedCodexAppServerClient({
				...clientOptions,
				timeoutMs: remainingTimeoutMs()
			});
			lease.client = client;
		}
		if (params.installMode === "none" && !params.refreshSharedCache) {
			if (!lease.client) return await inspectCodexComputerUseWithoutFence(params);
			return await withCodexAppServerClientRequestScope({
				lease,
				options: {
					...clientOptions,
					timeoutMs: remainingTimeoutMs()
				},
				signal: params.signal,
				run: async (readClient, requestOptions) => {
					const { assertCurrent } = requestOptions();
					return await inspectCodexComputerUseWithoutFence({
						...params,
						client: readClient,
						request: async (method, requestParams, options) => {
							const scopedOptions = method === "thread/unsubscribe" ? {
								timeoutMs: options?.timeoutMs ?? operationTimeoutMs,
								signal: options?.signal,
								assertCurrent
							} : requestOptions();
							return await requestCodexAppServerClientJson({
								client: readClient,
								method,
								requestParams,
								config: params.config,
								timeoutMs: Math.min(options?.timeoutMs ?? operationTimeoutMs, scopedOptions.timeoutMs),
								signal: scopedOptions.signal,
								assertCurrent: scopedOptions.assertCurrent
							});
						}
					});
				}
			});
		}
		const explicitManagedInstall = client && !resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig }).autoInstall ? await resolveExplicitManagedComputerUseInstallContext({
			...params,
			client
		}) : void 0;
		return await inspectCodexComputerUseWithoutFence({
			...params,
			...client ? { client } : {},
			timeoutMs: remainingTimeoutMs(),
			...explicitManagedInstall ? { explicitManagedInstall } : {}
		});
	} finally {
		if (lease.client) releaseLeasedSharedCodexAppServerClient(lease.client);
	}
}
async function inspectCodexComputerUseWithoutFence(params) {
	const request = createComputerUseRequest(params);
	if (params.installMode !== "none" && !resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig }).autoInstall) await prepareExplicitManagedComputerUseInstall(params);
	const managedMarketplacePath = await resolveClientManagedBundledMarketplacePath(params.client?.getRuntimeIdentity()?.codexHome, params.agentDir);
	const managedCodexHome = managedMarketplacePath ? params.client?.getRuntimeIdentity()?.codexHome : void 0;
	let computerUseConfig = await resolveManagedCodexComputerUseConfig(params.computerUseConfig, managedMarketplacePath);
	const nativeDisableStatus = computerUseConfig !== params.computerUseConfig && params.installMode !== "explicit" ? unavailableStatus(params.computerUseConfig, "plugin_disabled", "Computer Use is disabled by native plugin policy. Run /codex computer-use install for explicit recovery, or enable computer-use@openai-bundled in native Codex config for automatic replacement.") : void 0;
	if (computerUseConfig !== params.computerUseConfig) {
		const nativeConfig = await request("config/read", { includeLayers: false });
		if (nativeDisableStatus && isLegacyCodexComputerUsePluginDisabled(nativeConfig.config)) return nativeDisableStatus;
		if (hasLegacyCodexComputerUseMcpPolicy(nativeConfig.config)) computerUseConfig = params.computerUseConfig;
	}
	if (params.installMode !== "none") await request("experimentalFeature/enablement/set", { enablement: { plugins: true } });
	if (params.installMode !== "none" && managedCodexHome) await assertNotSymlink(path.join(managedCodexHome, "config.toml"), "Codex config");
	const marketplace = await resolveMarketplaceRef({
		request,
		config: computerUseConfig,
		allowAdd: params.installMode !== "none",
		signal: params.signal,
		defaultBundledMarketplacePath: params.defaultBundledMarketplacePath ?? managedMarketplacePath,
		defaultBundledMarketplacePathCandidates: params.defaultBundledMarketplacePathCandidates,
		managedCodexHome
	});
	if (!marketplace.marketplace) return unavailableStatus(computerUseConfig, "marketplace_missing", marketplace.message ?? `No Codex marketplace containing ${computerUseConfig.pluginName} is registered. Configure computerUse.marketplaceSource or computerUse.marketplacePath, then run /codex computer-use install.`);
	const pluginInspection = await ensureComputerUsePlugin(marketplace.marketplace, params.installMode !== "none");
	if ("status" in pluginInspection) return pluginInspection.status;
	if (params.refreshSharedCache && computerUseConfig !== params.computerUseConfig && managedCodexHome && managedMarketplacePath && params.agentDir && params.client) await ensureCodexComputerUseSharedPluginCache({
		codexHome: managedCodexHome,
		ownershipRoot: params.agentDir,
		bundledMarketplacePath: managedMarketplacePath,
		config: computerUseConfig,
		assertCurrent: params.assertCurrent
	});
	return await readComputerUseTools(pluginInspection.plugin, params.installMode !== "none");
	async function ensureComputerUsePlugin(source, installPlugin) {
		let plugin = await readComputerUsePlugin(request, source, computerUseConfig.pluginName);
		if (nativeDisableStatus) {
			const nativeConfig = await request("config/read", { includeLayers: false });
			if (isLegacyCodexComputerUsePluginDisabled(nativeConfig.config)) return { status: nativeDisableStatus };
		}
		if (installPlugin && (!plugin.summary.installed || !plugin.summary.enabled)) {
			await request("plugin/install", pluginRequestParams(source, computerUseConfig.pluginName));
			await request("config/mcpServer/reload", void 0);
			plugin = await readComputerUsePlugin(request, source, computerUseConfig.pluginName);
		}
		if (!plugin.summary.installed || !plugin.summary.enabled) return { status: statusFromPlugin({
			config: computerUseConfig,
			plugin,
			tools: [],
			reason: plugin.summary.installed ? "plugin_disabled" : "plugin_not_installed",
			message: plugin.summary.installed ? `Computer Use is installed, but the ${computerUseConfig.pluginName} plugin is disabled. Run /codex computer-use install or enable computerUse.autoInstall to re-enable it.` : "Computer Use is available but not installed. Run /codex computer-use install or enable computerUse.autoInstall."
		}) };
		return { plugin };
	}
	async function readComputerUseTools(plugin, installPlugin) {
		const { client, signal, runLiveTest } = params;
		let server = await readMcpServerStatus(request, computerUseConfig.mcpServerName);
		let tools = Object.keys(server?.tools ?? {}).toSorted();
		if ((!server || tools.length === 0) && installPlugin) {
			await request("config/mcpServer/reload", void 0);
			server = await readMcpServerStatus(request, computerUseConfig.mcpServerName);
			tools = Object.keys(server?.tools ?? {}).toSorted();
		}
		if (!server || tools.length === 0) return statusFromPlugin({
			config: computerUseConfig,
			plugin,
			tools,
			reason: "mcp_missing",
			message: server ? `Computer Use is installed, but the ${computerUseConfig.mcpServerName} MCP server exposes no tools.` : `Computer Use is installed, but the ${computerUseConfig.mcpServerName} MCP server is not available.`
		});
		const status = statusFromPlugin({
			config: computerUseConfig,
			plugin,
			tools,
			reason: "ready",
			message: "Computer Use is ready."
		});
		if (!runLiveTest) return status;
		const { liveTest, repair } = await runCodexComputerUseLiveTest({
			request,
			client,
			signal,
			config: computerUseConfig,
			tools
		});
		const compatibilityStartupAllowed = !liveTest.ok && !computerUseConfig.strictReadiness;
		return {
			...status,
			ready: liveTest.ok,
			reason: liveTest.ok ? "ready" : "live_test_failed",
			liveTest,
			...repair ? { repair } : {},
			warnings: [
				...status.warnings,
				...repair?.warnings ?? [],
				...compatibilityStartupAllowed ? ["Computer Use live test failed, but compatibility startup remains enabled; set computerUse.strictReadiness to true to block startup after a failed live test."] : []
			],
			message: liveTest.ok ? "Computer Use is ready." : compatibilityStartupAllowed ? `${liveTest.message} Startup is allowed because computerUse.strictReadiness is false.` : liveTest.message
		};
	}
}
async function prepareExplicitManagedComputerUseInstall(params) {
	const context = params.explicitManagedInstall;
	if (!context) return;
	await reconcileCodexComputerUseStartArtifacts({
		startOptions: {
			transport: "stdio",
			command: context.command,
			commandSource: "resolved-managed",
			args: ["app-server"],
			headers: {},
			env: { CODEX_HOME: context.codexHome }
		},
		agentDir: context.agentDir,
		pluginConfig: { computerUse: {
			...params.computerUseConfig,
			autoInstall: true
		} },
		ownsIsolatedCodexHome: true,
		desktopGeneration: context.desktopGeneration,
		forceCacheRefresh: true,
		assertCurrent: params.assertCurrent
	});
}
async function resolveExplicitManagedComputerUseInstallContext(params) {
	if (!params.agentDir) return;
	const codexHome = params.client.getRuntimeIdentity()?.codexHome;
	const processIdentity = readCodexAppServerClientProcessIdentity(params.client);
	const command = processIdentity?.nativeCommand ?? (processIdentity && isManagedCodexDesktopCommand(processIdentity.command, "darwin") ? processIdentity.command : void 0);
	if (!codexHome || !command) return;
	const desktopGeneration = readCodexAppServerClientDesktopGeneration(params.client);
	if (!desktopGeneration) throw new Error("Codex Computer Use install requires a desktop-generation-bound client; reconnect and retry.");
	const expectedHome = resolveCodexAppServerHomeDir(params.agentDir);
	const [actualRealHome, expectedRealHome] = await Promise.all([fs.realpath(codexHome).catch(() => void 0), fs.realpath(expectedHome).catch(() => void 0)]);
	if (!actualRealHome || actualRealHome !== expectedRealHome) return;
	return {
		client: params.client,
		agentDir: params.agentDir,
		codexHome,
		command,
		desktopGeneration
	};
}
async function resolveMarketplaceRef(params) {
	let preferredMarketplaceName = params.config.marketplaceName;
	if (params.config.marketplaceSource && params.allowAdd) {
		const added = await params.request("marketplace/add", { source: params.config.marketplaceSource });
		preferredMarketplaceName ??= added.marketplaceName;
	}
	if (params.config.marketplacePath) return { marketplace: preferredMarketplaceName ? {
		kind: "local",
		name: preferredMarketplaceName,
		path: params.config.marketplacePath
	} : {
		kind: "local",
		path: params.config.marketplacePath
	} };
	let candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	const bundledMarketplacePath = resolveBundledComputerUseMarketplacePath(params);
	const discoverDefaultMarketplace = params.allowAdd && !params.config.marketplaceSource && !params.config.marketplacePath && !params.config.marketplaceName;
	if (candidates.length === 0 && bundledMarketplacePath && discoverDefaultMarketplace) {
		if (params.managedCodexHome) await migrateLegacyBundledMarketplaceSource({
			request: params.request,
			bundledMarketplacePath,
			legacySources: params.defaultBundledMarketplacePathCandidates,
			userConfigPath: path.join(params.managedCodexHome, "config.toml")
		});
		const added = await params.request("marketplace/add", { source: bundledMarketplacePath });
		preferredMarketplaceName ??= added.marketplaceName;
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	const waitUntil = discoverDefaultMarketplace ? performance.now() + params.config.marketplaceDiscoveryTimeoutMs : 0;
	if (candidates.length === 0 && waitUntil > performance.now() && await codexNativePluginsDisabled(params.request)) return { message: "Codex native plugin support is disabled (features.plugins = false). Enable it in the Codex config, then run /codex computer-use install." };
	while (candidates.length === 0) {
		if (performance.now() >= waitUntil) break;
		await delay(Math.min(CURATED_MARKETPLACE_POLL_INTERVAL_MS, waitUntil - performance.now()), params.signal);
		candidates = await listComputerUseMarketplaceCandidates(params.request, params.config);
	}
	if (preferredMarketplaceName) {
		const preferred = candidates.find((candidate) => candidate.name === preferredMarketplaceName);
		if (preferred) return { marketplace: preferred };
		return { message: `Configured Codex marketplace ${preferredMarketplaceName} was not found or does not contain ${params.config.pluginName}. Run /codex computer-use install with a source or path to install from a new marketplace.` };
	}
	if (candidates.length > 1) {
		const preferred = chooseKnownComputerUseMarketplace(candidates);
		if (preferred) return { marketplace: preferred };
		return { message: `Multiple Codex marketplaces contain ${params.config.pluginName}. Configure computerUse.marketplaceName or computerUse.marketplacePath to choose one.` };
	}
	if (params.config.marketplaceSource && !params.allowAdd && candidates.length === 0) return { message: "Computer Use marketplace source is configured but has not been registered. Run /codex computer-use install to register it." };
	const marketplace = candidates[0];
	return marketplace ? { marketplace } : {};
}
async function migrateLegacyBundledMarketplaceSource(params) {
	const response = await params.request("config/read", { includeLayers: false });
	const bundled = response.config.marketplaces?.[BUNDLED_MARKETPLACE_NAME];
	const sourceOrigin = response.origins[`marketplaces.${BUNDLED_MARKETPLACE_NAME}.source`];
	if (bundled?.source_type !== "local" || !bundled.source || sourceOrigin?.name.type !== "user" || sourceOrigin.name.profile !== null || path.resolve(sourceOrigin.name.file) !== path.resolve(params.userConfigPath)) return;
	const configuredSource = path.resolve(bundled.source);
	if (configuredSource === path.resolve(params.bundledMarketplacePath)) return;
	if (!(params.legacySources ?? resolveMacOSDesktopCodexBundledMarketplaceCandidates()).some((source) => path.resolve(source) === configuredSource)) return;
	await params.request("marketplace/remove", { marketplaceName: BUNDLED_MARKETPLACE_NAME });
}
async function listComputerUseMarketplaceCandidates(request, config) {
	const listed = await request("plugin/list", { cwds: [] });
	const { pluginName } = config;
	return listed.marketplaces.flatMap((marketplace) => {
		const plugin = marketplace.plugins.find((candidate) => candidate.name === pluginName || candidate.id === pluginName || candidate.id === `${pluginName}@${marketplace.name}`);
		if (!plugin) return [];
		if (marketplace.path) return [{
			kind: "local",
			name: marketplace.name,
			path: marketplace.path
		}];
		const remotePluginId = plugin.remotePluginId?.trim();
		if (!remotePluginId) return [];
		return [{
			kind: "remote",
			name: marketplace.name,
			remotePluginId
		}];
	});
}
async function codexNativePluginsDisabled(request) {
	return (await request("experimentalFeature/list", {})).data.find(({ name }) => name === "plugins")?.enabled === false;
}
function chooseKnownComputerUseMarketplace(candidates) {
	for (const marketplaceName of COMPUTER_USE_MARKETPLACE_NAME_PRIORITY) {
		const candidate = candidates.find((marketplace) => marketplace.name === marketplaceName);
		if (candidate) return candidate;
	}
}
async function delay(ms, signal) {
	try {
		await sleepWithAbort(Math.max(1, ms), signal);
	} catch (error) {
		if (!signal?.aborted) throw error;
		throw signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Computer Use setup was aborted.");
	}
}
async function readComputerUsePlugin(request, marketplace, pluginName) {
	return (await request("plugin/read", pluginRequestParams(marketplace, pluginName))).plugin;
}
async function readMcpServerStatus(request, serverName) {
	let cursor;
	do {
		const response = await request("mcpServerStatus/list", {
			cursor,
			limit: 100,
			detail: "toolsAndAuthOnly"
		});
		const found = response.data.find((server) => server.name === serverName);
		if (found) return found;
		cursor = response.nextCursor;
	} while (cursor);
}
function pluginRequestParams(marketplace, pluginName) {
	return marketplace.kind === "local" ? {
		marketplacePath: marketplace.path,
		pluginName
	} : {
		remoteMarketplaceName: marketplace.name,
		pluginName: marketplace.remotePluginId
	};
}
function statusFromPlugin(params) {
	const { config, plugin, tools, reason, message } = params;
	const installed = plugin.summary.installed && plugin.summary.enabled;
	const available = tools.length > 0;
	return {
		enabled: true,
		ready: installed && available,
		reason,
		installed: plugin.summary.installed,
		pluginEnabled: plugin.summary.enabled,
		mcpServerAvailable: available,
		pluginName: config.pluginName,
		mcpServerName: config.mcpServerName,
		marketplaceName: plugin.marketplaceName,
		...plugin.marketplacePath ? { marketplacePath: plugin.marketplacePath } : {},
		tools,
		installation: {
			status: !plugin.summary.installed ? "not_installed" : installed ? "installed" : "installed_disabled",
			ok: installed,
			message: installed ? "Computer Use plugin is installed and enabled." : message
		},
		exposure: {
			status: available ? "available" : "missing",
			ok: available,
			message: available ? `Computer Use MCP server ${config.mcpServerName} exposes ${tools.length} tools.` : `Computer Use MCP server ${config.mcpServerName} is not exposed.`
		},
		liveTest: skippedLiveTestStatus(config, "Computer Use live test was not run."),
		warnings: plugin.summary.source?.type === "remote" ? ["Computer Use plugin is resolved from a remote marketplace; live local bundles are preferred."] : [],
		message
	};
}
function resolveComputerUseConfig(params) {
	const overrides = params.forceEnable ? {
		...params.overrides,
		enabled: true
	} : params.overrides;
	return resolveCodexComputerUseConfig({
		pluginConfig: params.pluginConfig,
		overrides
	});
}
//#endregion
export { runCodexComputerUseLiveTest as a, createComputerUseRequest as i, installCodexComputerUse as n, readCodexComputerUseStatus as r, ensureCodexComputerUse as t };
