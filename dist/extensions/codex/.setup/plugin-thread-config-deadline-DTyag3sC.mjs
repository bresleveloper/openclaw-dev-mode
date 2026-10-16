import { f as resolveCodexPluginsPolicy } from "./config-parsing-BQq-CHTF.mjs";
import { r as withAbortableTimeout } from "./timeout-CXOfNoaX.mjs";
import { a as defaultCodexAppInventoryCache } from "./plugin-app-cache-key-BW8rd98k.mjs";
import { s as resolveRecoverableCodexPluginConfigKeys } from "./plugin-inventory-Bf0_piTw.mjs";
import "./config-0Gxk3_eq.mjs";
import { Tt as shouldBuildCodexPluginThreadConfig, gt as buildCodexPluginThreadConfig, vt as buildCodexPluginThreadConfigTimeoutFallback } from "./thread-requests-DMd-wcni.mjs";
import { m as readCurrentCodexScheduledAppPolicy, p as intersectCodexPluginThreadConfigWithScheduledAuthority } from "./thread-lifecycle-DGgqkt-m.mjs";
import { n as disableCodexPluginThreadConfig } from "./dynamic-tool-build-B_h3tzwt.mjs";
import { t as defaultCodexPluginMetadataCache } from "./plugin-metadata-cache-DWnB7VMj.mjs";
import { AgentHarnessPreflightError } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/plugin-thread-config-deadline.ts
/** Enforces one bounded startup budget across Codex plugin config discovery. */
const CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS = 6e4;
const CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR = 4;
const CODEX_PLUGIN_THREAD_CONFIG_MIN_TIMEOUT_MS = 100;
var CodexPluginThreadConfigDeadlineError = class extends Error {
	constructor() {
		super("Codex plugin thread config deadline elapsed");
		this.name = "CodexPluginThreadConfigDeadlineError";
	}
};
/** Resolves the plugin policy state reused throughout app-server startup. */
function resolveCodexPluginThreadConfigStartupPolicy(params) {
	const pluginThreadConfigRequired = params.hostedAppsSupported === false || Boolean(params.scheduledRuntimeAuthority) || !params.nativeToolSurfaceEnabled || shouldBuildCodexPluginThreadConfig(params.pluginConfig);
	const pluginThreadConfigPluginConfig = params.hostedAppsSupported !== false && (params.nativeToolSurfaceEnabled || params.scheduledRuntimeAuthority) ? params.pluginConfig : disableCodexPluginThreadConfig(params.pluginConfig);
	const resolvedPluginPolicy = pluginThreadConfigRequired ? resolveCodexPluginsPolicy(pluginThreadConfigPluginConfig) : void 0;
	return {
		pluginThreadConfigRequired,
		pluginThreadConfigPluginConfig,
		resolvedPluginPolicy,
		enabledPluginConfigKeys: resolvedPluginPolicy ? resolvedPluginPolicy.pluginPolicies.filter((plugin) => plugin.enabled).map((plugin) => plugin.configKey).toSorted() : void 0
	};
}
/** Builds plugin config without allowing sequential RPC timeouts to consume the turn. */
async function buildCodexPluginThreadConfigWithinDeadline(params) {
	const { requestTimeoutMs, signal, request, failClosedOnTimeout, transform, ...buildParams } = params;
	signal.throwIfAborted();
	const timeoutMs = resolveCodexPluginThreadConfigTimeoutMs(requestTimeoutMs);
	const deadlineMs = performance.now() + timeoutMs;
	let requestTimedOut = false;
	const boundedRequest = async (method, requestParams) => {
		const remainingTimeoutMs = deadlineMs - performance.now();
		if (requestTimedOut || remainingTimeoutMs <= 0) throw new CodexPluginThreadConfigDeadlineError();
		try {
			return await request(method, requestParams, {
				timeoutMs: remainingTimeoutMs,
				signal
			});
		} catch (error) {
			requestTimedOut ||= isCodexPluginThreadConfigTimeoutError(error);
			throw error;
		}
	};
	try {
		return await withAbortableTimeout({
			signal,
			timeoutMs,
			promise: (async () => {
				const config = await buildCodexPluginThreadConfig({
					...buildParams,
					request: boundedRequest
				});
				const result = transform ? await transform(config, boundedRequest) : config;
				if (requestTimedOut || performance.now() >= deadlineMs) throw new CodexPluginThreadConfigDeadlineError();
				return result;
			})(),
			timeoutMessage: "Codex plugin thread config deadline elapsed",
			createTimeoutError: () => new CodexPluginThreadConfigDeadlineError()
		});
	} catch (error) {
		if (signal.aborted || !requestTimedOut && !isCodexPluginThreadConfigTimeoutError(error) && performance.now() < deadlineMs) throw error;
		if (failClosedOnTimeout) throw new AgentHarnessPreflightError(`Codex app policy verification exceeded its ${timeoutMs} ms startup budget. No app tools were executed. Retry after Codex app inventory is responsive.`);
		return buildCodexPluginThreadConfigTimeoutFallback({
			pluginConfig: buildParams.pluginConfig,
			appCacheKey: buildParams.appCacheKey,
			message: `Codex plugin discovery exceeded its ${timeoutMs} ms startup budget; plugin apps were disabled for this turn.`
		});
	}
}
/** Creates the recovery metadata and bounded builder used by thread startup. */
function createCodexPluginThreadConfigStartupProvider(params) {
	const { client, policy, inputFingerprint, enabledPluginConfigKeys, appCache, metadataCache: configuredMetadataCache, ...buildParams } = params;
	const metadataCache = configuredMetadataCache ?? defaultCodexPluginMetadataCache;
	return {
		enabled: true,
		requiresCurrentPolicyCheck: Boolean(policy?.enabled || params.scheduledRuntimeAuthority),
		inputFingerprint,
		enabledPluginConfigKeys,
		accountAppRecoveryEnabled: policy?.allowAllPlugins,
		recoverablePluginConfigKeys: policy ? resolveRecoverableCodexPluginConfigKeys({
			policy,
			metadataCache,
			appCacheKey: params.appCacheKey,
			configCwd: params.configCwd
		}) : void 0,
		build: async (buildOptions) => {
			const config = await buildCodexPluginThreadConfigWithinDeadline({
				...buildParams,
				threadId: buildOptions?.threadId,
				appCache: appCache ?? defaultCodexAppInventoryCache,
				metadataCache,
				failClosedOnTimeout: Boolean(params.scheduledRuntimeAuthority),
				transform: params.scheduledRuntimeAuthority ? async (builtConfig, request) => intersectCodexPluginThreadConfigWithScheduledAuthority(builtConfig, params.scheduledRuntimeAuthority, await readCurrentCodexScheduledAppPolicy({
					request,
					configCwd: params.configCwd,
					threadId: buildOptions?.threadId
				})) : void 0,
				request: (method, requestParams, options) => client.request(method, requestParams, options)
			});
			return params.scheduledRuntimeAuthority && params.inputFingerprint ? {
				...config,
				inputFingerprint: params.inputFingerprint
			} : config;
		}
	};
}
function resolveCodexPluginThreadConfigTimeoutMs(requestTimeoutMs) {
	return Math.min(CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS, Math.max(CODEX_PLUGIN_THREAD_CONFIG_MIN_TIMEOUT_MS, Math.floor((Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0 ? requestTimeoutMs : CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS * CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR) / CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR)));
}
function isCodexPluginThreadConfigTimeoutError(error) {
	return error instanceof CodexPluginThreadConfigDeadlineError || error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && error.message.endsWith(" timed out");
}
//#endregion
export { resolveCodexPluginThreadConfigStartupPolicy as n, createCodexPluginThreadConfigStartupProvider as t };
