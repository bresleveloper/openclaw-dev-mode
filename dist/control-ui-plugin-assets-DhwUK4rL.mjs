import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { i as capturePluginLifecycleAuthority } from "./registry-lifecycle-BhTDZAHB.mjs";
import "./runtime-BvdPUus5.mjs";
import { o as CUSTOM_PLUGIN_UI_DISABLED_MESSAGE, s as isControlUiPluginAllowed } from "./control-ui-plugin-tabs-DjZIdZqM.mjs";
import { n as controlUiPluginAssetRoot, t as controlUiPluginAssetPrefix } from "./control-ui-plugin-assets-contract-BEmf5f0r.mjs";
import { m as authorizeControlUiPluginCookieRequest, t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BJQtuB_7.mjs";
import { l as sendMethodNotAllowed, o as sendGatewayAuthFailure, y as respondNotFound } from "./http-common-Ckbyca3h.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-DTv5-s0n.mjs";
import { r as readPluginControlUiAssets } from "./control-ui-assets-CkvqX-YU.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/control-ui-plugin-assets.ts
const MAX_CONTROL_UI_PLUGINS = 64;
const MAX_CONTROL_UI_CATALOG_BYTES = 67108864;
const MAX_CONTROL_UI_CATALOG_REVISIONS = 256;
const browserPluginStates = /* @__PURE__ */ new WeakMap();
let pendingCatalogOperation;
function getActiveBrowserRegistry() {
	const registry = getPluginRegistryForContext();
	return registry && capturePluginLifecycleAuthority(registry)?.() ? registry : null;
}
function pluginState(registry, record) {
	let state = browserPluginStates.get(record);
	if (!state?.isCurrent()) {
		const isCurrent = capturePluginLifecycleAuthority(registry, record);
		if (!isCurrent?.()) throw new Error("plugin is no longer active");
		state = {
			isCurrent,
			revisions: /* @__PURE__ */ new Map(),
			activations: /* @__PURE__ */ new WeakMap(),
			initialized: false
		};
		browserPluginStates.set(record, state);
	}
	return state;
}
function browserOwners(registry) {
	return registry.plugins.filter((record) => record.enabled && record.status === "loaded" && record.controlUi).toSorted((left, right) => left.id.localeCompare(right.id));
}
async function snapshotBrowserBuild(registry, record, declaration = record.controlUi) {
	const authority = capturePluginLifecycleAuthority(registry, record);
	const isCurrent = () => authority?.() === true && isControlUiPluginAllowed(record);
	if (!declaration || !record.rootDir || !isCurrent()) throw new Error("plugin is no longer active");
	const { entryName, styles, assets, bytes } = await readPluginControlUiAssets(record.rootDir, declaration);
	const digest = createHash("sha256").update(JSON.stringify(declaration));
	for (const [name, asset] of [...assets].toSorted(([left], [right]) => left.localeCompare(right))) digest.update(`${name}\0${asset.body.length}\0`).update(asset.body);
	const revision = digest.digest("hex");
	const basePath = getRuntimeConfigSnapshot()?.gateway?.controlUi?.basePath;
	const prefix = `${controlUiPluginAssetPrefix(record.id, basePath)}${revision}/`;
	const assetUrl = (name) => `${prefix}${name.split("/").map(encodeURIComponent).join("/")}`;
	if (!isCurrent()) throw new Error("plugin was replaced while its browser assets loaded");
	return {
		isCurrent,
		assets,
		bytes,
		module: {
			pluginId: record.id,
			name: record.name,
			revision,
			entryUrl: assetUrl(entryName),
			styles: styles.map(assetUrl)
		}
	};
}
async function refreshBrowserCatalog(registry, isCurrent, pluginId, reloadManifest = false) {
	if (!isCurrent()) throw new Error("plugin registry is no longer active");
	const owners = browserOwners(registry);
	if (owners.length > MAX_CONTROL_UI_PLUGINS) throw new Error(`Native Control UI supports at most ${MAX_CONTROL_UI_PLUGINS} active plugins`);
	if (pluginId && !owners.some((record) => record.id === pluginId)) throw new Error("No active Control UI entrypoint for this plugin");
	for (const record of owners) {
		if (!isControlUiPluginAllowed(record)) {
			browserPluginStates.delete(record);
			continue;
		}
		const state = pluginState(registry, record);
		if (state.initialized && (!reloadManifest || pluginId && record.id !== pluginId)) continue;
		try {
			let declaration = record.controlUi;
			if (reloadManifest) {
				const loaded = withPluginCache(createPluginCache(), () => loadPluginManifest(record.rootDir, true, record.rootDir));
				if (!loaded.ok || loaded.manifest.id !== record.id || !loaded.manifest.controlUi) throw new Error("active plugin browser declaration is missing or invalid");
				declaration = loaded.manifest.controlUi;
			}
			const build = await snapshotBrowserBuild(registry, record, declaration);
			if (!isCurrent()) throw new Error("plugin registry was replaced while its browser assets loaded");
			const revisionKey = build.module.revision;
			if (!state.revisions.has(revisionKey)) {
				let bytes = build.bytes;
				let revisionCount = 0;
				for (const owner of owners) {
					const retained = browserPluginStates.get(owner);
					if (!isControlUiPluginAllowed(owner) || !retained?.isCurrent()) continue;
					revisionCount += retained.revisions.size;
					for (const retainedBuild of retained.revisions.values()) bytes += retainedBuild.bytes;
				}
				if (bytes > MAX_CONTROL_UI_CATALOG_BYTES || revisionCount >= MAX_CONTROL_UI_CATALOG_REVISIONS) {
					state.diagnostic = {
						pluginId: record.id,
						message: "Control UI revision cache is full. Reload this plugin's backend or restart the Gateway before loading another browser build."
					};
					continue;
				}
			}
			state.revisions.set(revisionKey, build);
			state.build = build;
			delete state.diagnostic;
		} catch {
			if (!isCurrent()) throw new Error("plugin registry was replaced while its browser assets loaded");
			state.diagnostic = {
				pluginId: record.id,
				message: "Control UI assets could not be loaded. Build the plugin and reload its UI."
			};
		} finally {
			if (isCurrent()) state.initialized = true;
		}
	}
}
function projectBrowserCatalog(registry) {
	const active = registry ? browserOwners(registry) : [];
	const plugins = active.flatMap((record) => {
		const build = browserPluginStates.get(record)?.build;
		return build?.isCurrent() ? [build.module] : [];
	});
	const diagnostics = active.flatMap((record) => {
		if (!isControlUiPluginAllowed(record)) return [{
			pluginId: record.id,
			code: "custom-plugin-ui-disabled",
			message: CUSTOM_PLUGIN_UI_DISABLED_MESSAGE
		}];
		const diagnostic = browserPluginStates.get(record)?.diagnostic;
		return diagnostic ? [diagnostic] : [];
	});
	return {
		revision: createHash("sha256").update(JSON.stringify({
			plugins,
			diagnostics
		})).digest("hex"),
		plugins,
		diagnostics
	};
}
async function loadControlUiPluginCatalog(pluginId, reloadManifest = false) {
	const registry = getPluginRegistryForContext();
	if (!registry) {
		if (pluginId) throw new Error("No active Control UI entrypoint for this plugin");
		return projectBrowserCatalog(null);
	}
	const isCurrent = capturePluginLifecycleAuthority(registry);
	if (!isCurrent?.()) throw new Error("plugin registry is no longer active");
	const operation = (pendingCatalogOperation ?? Promise.resolve()).then(async () => {
		await refreshBrowserCatalog(registry, isCurrent, pluginId, reloadManifest);
		if (!isCurrent()) throw new Error("plugin registry is no longer active");
		return projectBrowserCatalog(registry);
	});
	const pending = operation.then(() => void 0, () => void 0);
	pendingCatalogOperation = pending;
	try {
		return await operation;
	} finally {
		if (pendingCatalogOperation === pending) pendingCatalogOperation = void 0;
	}
}
/** Explicit UI-only refresh; never imports or replaces backend plugin code. */
function reloadControlUiPluginCatalog(pluginId) {
	return loadControlUiPluginCatalog(pluginId, true);
}
function listControlUiPluginCatalog() {
	return loadControlUiPluginCatalog();
}
/** A receipt is an observation by one live browser connection, never activation authority. */
function reportControlUiPluginActivation(client, report) {
	const owner = getActiveBrowserRegistry()?.plugins.find((record) => record.id === report.pluginId);
	const state = owner && browserPluginStates.get(owner);
	const build = state?.build;
	if (!state || !build?.isCurrent() || build.module.revision !== report.revision) return false;
	state.activations.set(client, { ...report });
	return true;
}
function listControlUiPluginActivations(client, pluginId) {
	const registry = getActiveBrowserRegistry();
	return (registry ? browserOwners(registry) : []).flatMap((record) => {
		const state = browserPluginStates.get(record);
		const report = state?.activations.get(client);
		return report && (!pluginId || pluginId === record.id) && state?.build?.isCurrent() && state.build.module.revision === report.revision ? [report] : [];
	});
}
/** Serves only snapshot bytes after scoped plugin-cookie or explicit read authentication. */
async function handleControlUiPluginAssetRequest(req, res, params) {
	const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
	const assetRoot = controlUiPluginAssetRoot(params.basePath);
	if (!pathname.startsWith(assetRoot)) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	let segments;
	try {
		segments = pathname.slice(assetRoot.length).split("/").map(decodeURIComponent);
	} catch {
		respondNotFound(res);
		return true;
	}
	const [pluginId, revision = "", ...fileParts] = segments;
	if (!pluginId || !/^[a-f0-9]{64}$/u.test(revision) || fileParts.length === 0 || fileParts.some((part) => !part || part === "." || part === ".." || /[\\/\0]/u.test(part))) {
		respondNotFound(res);
		return true;
	}
	const cookieAuth = authorizeControlUiPluginCookieRequest(req, {
		requestPath: pathname,
		authGeneration: resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies),
		res
	});
	if (res.writableEnded || res.destroyed) return true;
	if (cookieAuth) {
		if (!cookieAuth.requestAuth.controlUiPluginGrants?.find((candidate) => candidate.pluginId === pluginId && authorizeOperatorScopesForRequiredScope("operator.read", candidate.scopes).allowed)) {
			sendGatewayAuthFailure(res, {
				ok: false,
				reason: "unauthorized"
			});
			return true;
		}
	} else if (!await authorizeControlUiReadRequestOrReply({
		req,
		res,
		...params
	})) return true;
	const owner = getActiveBrowserRegistry()?.plugins.find((record) => record.id === pluginId);
	const build = owner && browserPluginStates.get(owner)?.revisions.get(revision);
	const asset = build && build.module.revision === revision && build.isCurrent() ? build.assets.get(fileParts.join("/")) : void 0;
	if (!asset) {
		respondNotFound(res);
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", asset.contentType);
	res.setHeader("Content-Length", asset.body.length);
	res.setHeader("Cache-Control", "private, no-cache");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.end(req.method === "HEAD" ? void 0 : asset.body);
	return true;
}
//#endregion
export { reportControlUiPluginActivation as a, reloadControlUiPluginCatalog as i, listControlUiPluginActivations as n, listControlUiPluginCatalog as r, handleControlUiPluginAssetRequest as t };
