import { s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { r as loadPluginManifest } from "./manifest-gUPkNRN0.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import "./runtime-DkPagH0y.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { a as pluginControlUiRevision, o as readPluginControlUiAssets } from "./control-ui-assets-DErxGcit.mjs";
import "./operator-scopes-BO7_XQCg.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { i as hasCanonicalPluginDistribution } from "./plugin-runtime-artifact-binding-CqK5OPco.mjs";
import { c as controlUiPluginAssetPrefix, l as controlUiPluginAssetRoot, o as CUSTOM_PLUGIN_UI_DISABLED_MESSAGE, s as isControlUiPluginAllowed } from "./control-ui-plugin-tabs-y8H4PDI0.mjs";
import { r as respondNotFound } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BeRsGF9T.mjs";
import { c as sendGatewayAuthFailure, d as sendMethodNotAllowed } from "./http-common-DyL3AdjD.mjs";
import { i as captureHttpRequestAuthority } from "./http-request-authority-Dyt1S0uG.mjs";
import { m as prepareControlUiPluginCookieRequest, p as authorizeControlUiPluginCookieRequest, t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-DvoR_YDD.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/control-ui-plugin-assets.ts
const log = createSubsystemLogger("gateway/control-ui");
const MAX_CONTROL_UI_PLUGINS = 64;
const MAX_CONTROL_UI_CATALOG_BYTES = 67108864;
const MAX_CONTROL_UI_CATALOG_REVISIONS = 256;
const browserPluginStates = /* @__PURE__ */ new WeakMap();
let pendingCatalogOperation;
function getActiveBrowserRegistry() {
	const registry = getPluginRegistryForContext();
	return registry && capturePluginLifecycleAuthority(registry)?.() ? registry : null;
}
function pluginState(record) {
	let state = browserPluginStates.get(record);
	if (!state) {
		state = {
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
async function staticBrowserImports(entryUrl, assets, assetUrl) {
	const { parse } = await import("@babel/parser");
	const modules = new Map([...assets].filter(([name]) => /\.m?js$/u.test(name)).map(([name, asset]) => [new URL(assetUrl(name), "http://localhost").href, asset]));
	const entry = new URL(entryUrl, "http://localhost").href;
	const visited = /* @__PURE__ */ new Set([entry]);
	const pending = [entry];
	for (const url of pending) {
		const asset = modules.get(url);
		if (!asset) continue;
		let statements;
		try {
			statements = parse(asset.body.toString("utf8"), { sourceType: "module" }).program.body;
		} catch {
			continue;
		}
		for (const statement of statements) {
			if (statement.type !== "ImportDeclaration" && statement.type !== "ExportNamedDeclaration" && statement.type !== "ExportAllDeclaration") continue;
			const specifier = statement.source?.value;
			if (!specifier || !specifier.startsWith("./") && !specifier.startsWith("../")) continue;
			const target = new URL(specifier, url).href;
			if (modules.has(target) && !visited.has(target)) {
				visited.add(target);
				pending.push(target);
			}
		}
	}
	return pending.slice(1).map((url) => new URL(url).pathname);
}
async function snapshotBrowserBuild(record, declaration = record.controlUi, uiCapabilities) {
	if (!declaration || !record.rootDir || !isControlUiPluginAllowed(record)) throw new Error("plugin is no longer active");
	const { entryName, styles, assets, bytes } = await readPluginControlUiAssets(record.rootDir, declaration, { rejectHardlinks: shouldRejectHardlinkedPluginFiles({
		origin: record.origin,
		rootDir: record.rootDir
	}) });
	const revision = pluginControlUiRevision(declaration, uiCapabilities, assets);
	const basePath = getRuntimeConfigSnapshot()?.gateway?.controlUi?.basePath;
	const prefix = `${controlUiPluginAssetPrefix(record.id, basePath)}${revision}/`;
	const assetUrl = (name) => `${prefix}${name.split("/").map(encodeURIComponent).join("/")}`;
	const imports = await staticBrowserImports(assetUrl(entryName), assets, assetUrl);
	return {
		assets,
		bytes,
		module: {
			pluginId: record.id,
			name: record.name,
			revision,
			entryUrl: assetUrl(entryName),
			imports,
			styles: styles.map(assetUrl),
			...uiCapabilities !== void 0 ? { uiCapabilities } : {},
			...hasCanonicalPluginDistribution(record) && record.packageName && record.packageVersion ? { bundledDistribution: {
				packageName: record.packageName,
				packageVersion: record.packageVersion
			} } : {}
		}
	};
}
async function refreshBrowserCatalog(registry, pluginId, reloadManifest = false) {
	const owners = browserOwners(registry);
	if (owners.length > MAX_CONTROL_UI_PLUGINS) throw new Error(`Native Control UI supports at most ${MAX_CONTROL_UI_PLUGINS} active plugins`);
	if (pluginId && !owners.some((record) => record.id === pluginId)) throw new Error("No active Control UI entrypoint for this plugin");
	for (const record of owners) {
		if (!isControlUiPluginAllowed(record)) {
			browserPluginStates.delete(record);
			continue;
		}
		const state = pluginState(record);
		if (state.initialized && (!reloadManifest || pluginId && record.id !== pluginId)) continue;
		try {
			let declaration = record.controlUi;
			let uiCapabilities = record.uiCapabilities;
			if (reloadManifest) {
				const rootDir = record.rootDir;
				if (!rootDir) throw new Error("plugin is no longer active");
				const rejectManifestHardlinks = shouldRejectHardlinkedPluginFiles({
					origin: record.origin,
					rootDir
				});
				const loaded = withPluginCache(createPluginCache(), () => loadPluginManifest(rootDir, rejectManifestHardlinks, rootDir));
				if (!loaded.ok) throw new Error(loaded.error);
				if (loaded.manifest.id !== record.id || !loaded.manifest.controlUi) throw new Error("active plugin browser declaration is missing or invalid");
				declaration = loaded.manifest.controlUi;
				uiCapabilities = loaded.manifest.uiCapabilities;
			}
			const build = await snapshotBrowserBuild(record, declaration, uiCapabilities);
			const revisionKey = build.module.revision;
			if (!state.revisions.has(revisionKey)) {
				let bytes = build.bytes;
				let revisionCount = 0;
				for (const owner of owners) {
					const retained = browserPluginStates.get(owner);
					if (!isControlUiPluginAllowed(owner) || !retained) continue;
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
		} catch (error) {
			log.warn(`Browser assets unavailable for plugin ${record.id}: ${formatErrorMessage(error, { includeCode: true })}`);
			state.diagnostic = {
				pluginId: record.id,
				message: "Control UI assets could not be loaded. Build the plugin and reload its UI."
			};
		} finally {
			state.initialized = true;
		}
	}
}
function projectBrowserCatalog(registry) {
	const active = registry ? browserOwners(registry) : [];
	const plugins = active.flatMap((record) => {
		const build = browserPluginStates.get(record)?.build;
		return build && isControlUiPluginAllowed(record) ? [build.module] : [];
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
	if (!capturePluginLifecycleAuthority(registry)?.()) throw new Error("plugin registry is no longer active");
	const operation = (pendingCatalogOperation ?? Promise.resolve()).then(async () => {
		await refreshBrowserCatalog(registry, pluginId, reloadManifest);
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
	const registry = getActiveBrowserRegistry();
	const owner = registry && browserOwners(registry).find((record) => record.id === report.pluginId);
	const state = owner && browserPluginStates.get(owner);
	const build = state?.build;
	if (!state || !build || !owner || !isControlUiPluginAllowed(owner) || build.module.revision !== report.revision) return false;
	state.activations.set(client, { ...report });
	return true;
}
function listControlUiPluginActivations(client, pluginId) {
	const registry = getActiveBrowserRegistry();
	return (registry ? browserOwners(registry) : []).flatMap((record) => {
		const state = browserPluginStates.get(record);
		const report = state?.activations.get(client);
		return report && (!pluginId || pluginId === record.id) && isControlUiPluginAllowed(record) && state?.build && state.build.module.revision === report.revision ? [report] : [];
	});
}
/** Authorized content-addressed snapshots stay in the private browser cache across grant renewal. */
async function handleControlUiPluginAssetRequest(req, res, params) {
	const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
	const assetRoot = controlUiPluginAssetRoot(params.basePath);
	if (!pathname.startsWith(assetRoot)) return false;
	res.setHeader("Cache-Control", "no-store");
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
	const hasCurrentClientAuthority = captureHttpRequestAuthority({
		...params,
		req
	});
	await prepareControlUiPluginCookieRequest(req, {
		requestPath: pathname,
		authGeneration: resolveSharedGatewaySessionGeneration(params.auth, params.trustedProxies),
		res
	});
	if (res.writableEnded || res.destroyed) return true;
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
	if (!hasCurrentClientAuthority()) {
		sendGatewayAuthFailure(res, {
			ok: false,
			reason: "unauthorized"
		});
		return true;
	}
	const registry = getActiveBrowserRegistry();
	const owner = registry && browserOwners(registry).find((record) => record.id === pluginId);
	const build = owner && browserPluginStates.get(owner)?.revisions.get(revision);
	const asset = build && owner && isControlUiPluginAllowed(owner) ? build.assets.get(fileParts.join("/")) : void 0;
	if (!asset) {
		respondNotFound(res);
		return true;
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", asset.contentType);
	res.setHeader("Content-Length", asset.body.length);
	res.setHeader("Cache-Control", "private, max-age=31536000, immutable");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.end(req.method === "HEAD" ? void 0 : asset.body);
	return true;
}
//#endregion
export { reportControlUiPluginActivation as a, reloadControlUiPluginCatalog as i, listControlUiPluginActivations as n, listControlUiPluginCatalog as r, handleControlUiPluginAssetRequest as t };
