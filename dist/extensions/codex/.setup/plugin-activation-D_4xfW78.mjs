import { d as CodexAppServerRpcError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { i as CODEX_PLUGINS_MARKETPLACE_NAME } from "./config-B-xRmWRi.mjs";
import { i as listCodexPluginMetadata, n as findCodexMarketplacePluginSummary, o as pluginReadParams, r as isOpenAiCuratedMarketplaceName, t as createCodexAppInventoryRequest } from "./plugin-inventory-2AKJLSMB.mjs";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
// extensions/codex/src/app-server/plugin-activation.ts
/** Activates legacy curated plugins without granting install authority to other marketplaces. */
async function ensureCodexPluginActivation(params) {
	if (params.identity.marketplaceName === "workspace-directory") return activationFailure("disabled", { message: "workspace-directory plugins must be installed and enabled outside OpenClaw before use." });
	if (!isOpenAiCuratedMarketplaceName(params.identity.marketplaceName)) {
		const target = params.identity.pluginName.endsWith(`@${params.identity.marketplaceName}`) ? params.identity.pluginName : `${params.identity.pluginName}@${params.identity.marketplaceName}`;
		return activationFailure("disabled", { message: `${params.identity.marketplaceName} plugins must be installed and enabled by an owner before use. Run /codex plugins install ${target}.` });
	}
	const listed = await listCodexPluginMetadata(params, CODEX_PLUGINS_MARKETPLACE_NAME);
	const resolved = findCodexMarketplacePluginSummary(listed, params.identity.marketplaceName, params.identity.pluginName);
	if (!resolved) {
		if (!listed.marketplaces.some((marketplace) => isOpenAiCuratedMarketplaceName(marketplace.name))) return activationFailure("marketplace_missing", { message: `Codex marketplace ${CODEX_PLUGINS_MARKETPLACE_NAME} was not found.` });
		return activationFailure("plugin_missing", { message: `${params.identity.pluginName} was not found in ${CODEX_PLUGINS_MARKETPLACE_NAME}.` });
	}
	if (resolved.marketplace.remoteMarketplaceName && !resolved.summary.remotePluginId) return activationFailure("plugin_missing", { message: `${params.identity.pluginName} detail unavailable: Codex did not return a remote plugin id.` });
	if (resolved.summary.availability === "DISABLED_BY_ADMIN" || resolved.summary.installPolicy === "NOT_AVAILABLE") return activationFailure("disabled", { message: `${params.identity.pluginName} was disabled or made unavailable by its marketplace administrator.` });
	if (resolved.summary.installed && resolved.summary.enabled && !params.installEvenIfActive) return {
		ok: true,
		reason: "already_active",
		installAttempted: false,
		diagnostics: []
	};
	const remotePluginId = resolved.marketplace.remoteMarketplaceName ? resolved.summary.remotePluginId : void 0;
	let installResponse;
	try {
		installResponse = await params.request("plugin/install", pluginReadParams(resolved.marketplace, remotePluginId ?? params.identity.pluginName));
	} catch (error) {
		if (!(error instanceof CodexAppServerRpcError) || error.code !== -32600 || !remotePluginId || error.message !== `remote plugin ${remotePluginId} is disabled by admin` && error.message !== `remote plugin ${remotePluginId} is not available for install`) throw error;
		return {
			ok: false,
			reason: "install_failed",
			installAttempted: true,
			diagnostics: [{ message: `Codex plugin install failed: ${coerceErrorMessage(error)}` }]
		};
	}
	const refreshDiagnostics = [];
	let refreshFailed = false;
	try {
		const refreshResult = await refreshCodexPluginRuntimeState(params);
		refreshDiagnostics.push(...refreshResult.diagnostics);
	} catch (error) {
		refreshFailed = true;
		refreshDiagnostics.push({ message: `Codex plugin runtime refresh failed after install: ${coerceErrorMessage(error)}` });
	}
	const authRequired = installResponse.appsNeedingAuth.length > 0;
	return {
		ok: !authRequired && !refreshFailed,
		reason: refreshFailed ? "refresh_failed" : authRequired ? "auth_required" : resolved.summary.installed && resolved.summary.enabled ? "already_active" : "installed",
		installAttempted: true,
		installResponse,
		diagnostics: [...refreshDiagnostics, ...installResponse.appsNeedingAuth.map((app) => ({ message: `${app.name} requires app authentication before plugin tools are exposed.` }))]
	};
}
async function refreshCodexPluginRuntimeState(params) {
	const diagnostics = [];
	if (params.appCacheKey) params.metadataCache?.invalidate(params.appCacheKey);
	await listCodexPluginMetadata(params, CODEX_PLUGINS_MARKETPLACE_NAME, { forceRefetch: true });
	if (params.appCache && params.appCacheKey) try {
		await refreshCodexAppRuntimeState({
			...params,
			appCache: params.appCache,
			appCacheKey: params.appInventoryCacheKey ?? params.appCacheKey
		});
	} catch (error) {
		diagnostics.push({ message: `Codex app inventory refresh skipped: ${coerceErrorMessage(error)}` });
	}
	return { diagnostics };
}
/** Refreshes hosted app tools without reloading unrelated active threads. */
async function refreshCodexAppRuntimeState(params) {
	params.appCache.invalidate(params.appCacheKey);
	if (params.deferAppInventoryRefresh) return;
	await params.appCache.refreshNow({
		key: params.appCacheKey,
		request: createCodexAppInventoryRequest(params),
		forceRefetch: true,
		targetAppIds: params.targetAppIds
	});
}
function activationFailure(reason, diagnostic) {
	return {
		ok: false,
		reason,
		installAttempted: false,
		diagnostics: [diagnostic]
	};
}
export { refreshCodexAppRuntimeState as n, refreshCodexPluginRuntimeState as r, ensureCodexPluginActivation as t };
