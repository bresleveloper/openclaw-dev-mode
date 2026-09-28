import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { a as READ_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { a as BOARD_REPORT_WIDGET_KIND, n as BOARD_WEBSITE_WIDGET_KIND } from "./board-website-CZkEDDYp.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { t as controlUiPluginAssetPrefix } from "./control-ui-plugin-assets-contract-BEmf5f0r.mjs";
import { a as resolvePluginRoutePathContext, n as findRegisteredPluginHttpRoute, t as findMatchingPluginHttpRoutes } from "./route-match-3ODu6iRN.mjs";
//#region src/gateway/control-ui-plugin-frame-contract.ts
/** Lifetime shared by server-minted plugin-tab grants and parent-side renewal. */
const CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS = 3e5;
/** Reserved query key for the sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY = "__openclaw_plugin_frame_auth_probe";
/** Exact parent origin that may receive the successful probe message. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY = "__openclaw_plugin_frame_auth_origin";
/** Message emitted only by a successful sandbox cookie capability probe. */
const CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE = "openclaw-plugin-frame-auth-probe";
/** Extracts the same-origin route pathname from a tab descriptor URL. */
function resolveControlUiPluginTabPathname(path) {
	try {
		const baseUrl = new URL("http://openclaw.invalid");
		const tabUrl = new URL(path, baseUrl);
		return tabUrl.origin === baseUrl.origin ? tabUrl.pathname : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/control-ui-plugin-policy.ts
const CUSTOM_PLUGIN_UI_DISABLED_MESSAGE = "Custom plugin UI is disabled. Enable Custom plugin UI in Settings > Labs.";
function isControlUiPluginAllowed(plugin) {
	return plugin.origin === "bundled" || getRuntimeConfigSnapshot()?.gateway?.controlUi?.experimental?.customPlugins === true;
}
//#endregion
//#region src/gateway/control-ui-plugin-tabs.ts
const log = createSubsystemLogger("gateway/control-ui");
const CORE_CONTROL_UI_WIDGET_KINDS = [
	{
		pluginId: "session",
		kind: "session:progress",
		label: "Session progress"
	},
	{
		pluginId: "session",
		kind: BOARD_REPORT_WIDGET_KIND,
		label: "Report"
	},
	{
		pluginId: "session",
		kind: BOARD_WEBSITE_WIDGET_KIND,
		label: "Website"
	}
];
function findControlUiTabGatewayRoute(registry, tab) {
	if (!tab.path) return;
	const routePath = resolveControlUiPluginTabPathname(tab.path);
	if (!routePath) return;
	const route = findMatchingPluginHttpRoutes(registry, resolvePluginRoutePathContext(routePath)).find((candidate) => candidate.auth === "gateway");
	if (!route) return;
	return route.pluginId === tab.pluginId ? route : null;
}
function visibleDescriptors(entries, scopes) {
	return entries.filter(({ descriptor }) => (descriptor.requiredScopes ?? []).every((scope) => authorizeOperatorScopesForRequiredScope(scope, scopes).allowed));
}
/** Full descriptors and hello projections share the same scope admission. */
function listControlUiPluginDescriptors(scopes) {
	return visibleDescriptors(getPluginRegistryForContext()?.controlUiDescriptors ?? [], scopes).map(({ pluginId, pluginName, descriptor }) => ({
		pluginId,
		pluginName,
		id: descriptor.id,
		surface: descriptor.surface,
		linkReader: descriptor.linkReader,
		label: descriptor.label,
		description: descriptor.description,
		placement: descriptor.placement,
		schema: descriptor.schema,
		requiredScopes: descriptor.requiredScopes,
		icon: descriptor.icon,
		path: descriptor.path,
		group: descriptor.group,
		order: descriptor.order
	})).toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.id.localeCompare(right.id));
}
/** Pure projection of tab descriptors visible to the presented scopes. */
function projectControlUiPluginTabs(entries, scopes) {
	const tabs = [];
	for (const entry of visibleDescriptors(entries, scopes)) {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "tab") continue;
		tabs.push({
			pluginId: entry.pluginId,
			id: descriptor.id,
			label: descriptor.label,
			description: descriptor.description,
			icon: descriptor.icon,
			path: descriptor.path,
			placement: descriptor.placement,
			...descriptor.slug ? { slug: descriptor.slug } : {},
			group: descriptor.group,
			order: descriptor.order
		});
	}
	return tabs.toSorted((left, right) => (left.order ?? 0) - (right.order ?? 0) || left.label.localeCompare(right.label) || left.id.localeCompare(right.id));
}
/** Lists active plugins' tab descriptors visible to the presented scopes. */
function listControlUiPluginTabs(scopes, opts = {}) {
	const registry = getPluginRegistryForContext();
	const basePath = normalizeControlUiBasePath(getRuntimeConfigSnapshot()?.gateway?.controlUi?.basePath);
	return projectControlUiPluginTabs(registry?.controlUiDescriptors ?? [], scopes).flatMap((tab) => {
		const route = registry ? findControlUiTabGatewayRoute(registry, tab) : void 0;
		if (route === null) return [];
		if (registry && tab.slug) {
			const pathname = `${basePath}/${tab.slug}`;
			const shadow = findRegisteredPluginHttpRoute(registry, pathname);
			if (shadow) {
				const message = `Control UI tab slug ${pathname} is shadowed by plugin HTTP route ${shadow.pluginId}:${shadow.path}; using the generic tab URL for ${tab.pluginId}:${tab.id}`;
				if (!registry.diagnostics.some((diagnostic) => diagnostic.message === message)) {
					registry.diagnostics.push({
						level: "warn",
						pluginId: tab.pluginId,
						message
					});
					log.warn(message);
				}
				delete tab.slug;
			}
		}
		return route && opts.requireGatewayAuthGrant !== false ? [{
			...tab,
			requiresGatewayAuth: true
		}] : [tab];
	});
}
/** Lists active plugins' trusted widget kinds visible to the presented scopes. */
function listControlUiPluginWidgetKinds(scopes) {
	const registry = getPluginRegistryForContext();
	const entries = registry?.controlUiDescriptors ?? [];
	const disabled = new Set(registry?.plugins.filter((plugin) => plugin.controlUi && !isControlUiPluginAllowed(plugin)).map((plugin) => plugin.id));
	const coreEntries = authorizeOperatorScopesForRequiredScope("operator.read", scopes).allowed ? CORE_CONTROL_UI_WIDGET_KINDS : [];
	const pluginEntries = visibleDescriptors(entries, scopes).flatMap((entry) => {
		const descriptor = entry.descriptor;
		if (descriptor.surface !== "widget" || disabled.has(entry.pluginId)) return [];
		return [{
			pluginId: entry.pluginId,
			kind: `${entry.pluginId}:${descriptor.id}`,
			label: descriptor.label
		}];
	});
	return [...coreEntries, ...pluginEntries].toSorted((left, right) => left.label.localeCompare(right.label) || left.kind.localeCompare(right.kind));
}
/** Grants read access to active native assets and visible same-plugin Gateway tabs. */
function listControlUiPluginTabAuthGrants(callerScopes) {
	const registry = getPluginRegistryForContext();
	if (!registry || !authorizeOperatorScopesForRequiredScope("operator.read", callerScopes).allowed) return [];
	const grants = /* @__PURE__ */ new Map();
	const basePath = getRuntimeConfigSnapshot()?.gateway?.controlUi?.basePath;
	for (const plugin of registry.plugins) {
		if (!plugin.enabled || plugin.status !== "loaded" || !plugin.controlUi || !isControlUiPluginAllowed(plugin)) continue;
		const assetPath = controlUiPluginAssetPrefix(plugin.id, basePath);
		grants.set(`${plugin.id}\n${assetPath}`, {
			pluginId: plugin.id,
			path: assetPath,
			match: "prefix",
			scopes: [READ_SCOPE]
		});
	}
	for (const tab of projectControlUiPluginTabs(registry.controlUiDescriptors ?? [], callerScopes)) {
		if (!tab.path) continue;
		const route = findControlUiTabGatewayRoute(registry, tab);
		if (!route) continue;
		const key = `${tab.pluginId}\n${route.path}`;
		const existing = grants.get(key);
		if (existing) {
			if (existing.match === "exact" && route.match === "prefix") grants.set(key, {
				...existing,
				match: "prefix"
			});
			continue;
		}
		grants.set(key, {
			pluginId: tab.pluginId,
			path: route.path,
			match: route.match,
			scopes: [READ_SCOPE]
		});
	}
	return [...grants.values()];
}
/** Reader selection shares the request's actual dispatch snapshot and scope admission. */
function listControlUiLinkReaders(scopes, methods) {
	const registry = getPluginRegistryForContext();
	if (!registry || !methods || !authorizeOperatorScopesForRequiredScope("operator.read", scopes).allowed) return [];
	if (methods.pluginRegistry && methods.pluginRegistry !== registry) return [];
	const loaded = new Set(registry.plugins.filter((plugin) => plugin.enabled && plugin.status === "loaded").map((plugin) => plugin.id));
	const descriptors = new Map(methods.descriptors().map((method) => [method.name, method]));
	const readable = (name, pluginId) => {
		const method = descriptors.get(name);
		return method?.owner.kind === "plugin" && method.owner.pluginId === pluginId && method.scope === "operator.read" && method.advertise !== false && !method.controlPlaneWrite;
	};
	return visibleDescriptors(registry.controlUiDescriptors, scopes).flatMap((entry) => {
		const descriptor = entry.descriptor;
		const metadata = descriptor.linkReader;
		if (descriptor.surface !== "link-reader" || !metadata || !loaded.has(entry.pluginId) || !readable(metadata.detailMethod, entry.pluginId) || metadata.previewMethod && !readable(metadata.previewMethod, entry.pluginId) || metadata.imageMethod && !readable(metadata.imageMethod, entry.pluginId)) return [];
		return [{
			pluginId: entry.pluginId,
			id: descriptor.id,
			label: descriptor.label,
			icon: descriptor.icon,
			linkReader: {
				...metadata,
				hosts: [...metadata.hosts]
			}
		}];
	}).toSorted((left, right) => left.pluginId.localeCompare(right.pluginId) || left.id.localeCompare(right.id));
}
//#endregion
export { listControlUiPluginWidgetKinds as a, CONTROL_UI_PLUGIN_AUTH_GRANT_TTL_MS as c, CONTROL_UI_PLUGIN_AUTH_PROBE_QUERY as d, listControlUiPluginTabs as i, CONTROL_UI_PLUGIN_AUTH_PROBE_MESSAGE as l, listControlUiPluginDescriptors as n, CUSTOM_PLUGIN_UI_DISABLED_MESSAGE as o, listControlUiPluginTabAuthGrants as r, isControlUiPluginAllowed as s, listControlUiLinkReaders as t, CONTROL_UI_PLUGIN_AUTH_PROBE_ORIGIN_QUERY as u };
