import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/command-authorization.ts
const CODEX_NATIVE_EXECUTION_AUTH_ERROR = "Only an owner or operator.admin can control Codex native execution.";
const CODEX_HOST_INSPECTION_AUTH_ERROR = "Only an owner or operator.admin can inspect Codex host state.";
const CODEX_FULL_PERMISSIONS_AUTH_ERROR = "Full Codex permissions require operator.admin. Choose Admin in the Control UI permission picker, or use an admin-authenticated CLI.";
function hasCodexAdminScope(ctx) {
	return ctx.gatewayClientScopes?.includes("operator.admin") === true;
}
function canMutateCodexHost(ctx) {
	return ctx.senderIsOwner === true || hasCodexAdminScope(ctx);
}
function assertCodexHostOwnerCurrent(ctx) {
	if (!hasCodexAdminScope(ctx)) ctx.assertOwnerCurrent?.();
}
//#endregion
//#region extensions/codex/src/plugin-marketplace-discovery.ts
/** Read-only discovery of Codex-owned local, curated, and remote plugin marketplaces. */
const PLUGIN_NAME_PATTERN = /^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/;
const MARKETPLACE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const MAX_PLUGIN_METADATA_LENGTH = 160;
const SUPPLEMENTAL_MARKETPLACE_KINDS = [
	"workspace-directory",
	"shared-with-me",
	"created-by-me-remote",
	"vertical"
];
function filterCodexMarketplacePlugins(plugins, query, marketplace) {
	const normalizedQuery = query.trim().toLowerCase();
	return plugins.filter((plugin) => (!marketplace || plugin.marketplaceName === marketplace) && (!normalizedQuery || `${plugin.id} ${plugin.displayName ?? ""} ${plugin.developerName ?? ""} ${plugin.description ?? ""}`.toLowerCase().includes(normalizedQuery)));
}
/** Validates the same identifier segments required by Codex's stable PluginId parser. */
function parseCodexPluginMarketplaceId(value) {
	const separator = value.lastIndexOf("@");
	if (separator <= 0 || separator === value.length - 1) return;
	const pluginName = value.slice(0, separator);
	const marketplaceName = value.slice(separator + 1);
	return PLUGIN_NAME_PATTERN.test(pluginName) && MARKETPLACE_NAME_PATTERN.test(marketplaceName) ? {
		pluginName,
		marketplaceName
	} : void 0;
}
/** Lists local/global first and separately requests workspace, shared, and personal catalogs. */
async function discoverCodexMarketplacePlugins(params) {
	const requestParams = { cwds: [params.workspaceDir] };
	const primary = await params.request(requestParams);
	const warnings = (primary.marketplaceLoadErrors ?? []).map((error) => boundedCatalogText(error.message));
	const marketplaces = [...primary.marketplaces];
	try {
		const supplemental = await params.request({
			...requestParams,
			marketplaceKinds: [...SUPPLEMENTAL_MARKETPLACE_KINDS]
		});
		marketplaces.push(...supplemental.marketplaces);
		warnings.push(...(supplemental.marketplaceLoadErrors ?? []).map((error) => boundedCatalogText(error.message)));
	} catch (error) {
		let recoveredSupplementalMarketplace = false;
		for (const kind of SUPPLEMENTAL_MARKETPLACE_KINDS) try {
			const supplemental = await params.request({
				...requestParams,
				marketplaceKinds: [kind]
			});
			marketplaces.push(...supplemental.marketplaces);
			recoveredSupplementalMarketplace ||= supplemental.marketplaces.length > 0;
			warnings.push(...(supplemental.marketplaceLoadErrors ?? []).map((loadError) => boundedCatalogText(loadError.message)));
		} catch (kindError) {
			warnings.push(boundedCatalogText(`${kind} marketplace unavailable: ${kindError instanceof Error ? kindError.message : String(kindError)}`));
		}
		if (!recoveredSupplementalMarketplace && warnings.length === 0) warnings.push(boundedCatalogText(`Additional marketplaces could not be listed: ${error instanceof Error ? error.message : String(error)}`));
	}
	const discovered = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	for (const marketplace of marketplaces) {
		if (!MARKETPLACE_NAME_PATTERN.test(marketplace.name)) continue;
		for (const summary of marketplace.plugins) {
			const pluginName = pluginSlug(summary, marketplace.name);
			if (!pluginName) continue;
			const id = `${pluginName}@${marketplace.name}`;
			if (ambiguous.has(id)) continue;
			const previous = discovered.get(id);
			const pluginInterface = asOptionalRecord(summary.interface);
			const next = {
				id,
				pluginName,
				marketplaceName: marketplace.name,
				displayName: boundedCatalogText(pluginInterface?.displayName) || void 0,
				developerName: boundedCatalogText(pluginInterface?.developerName) || void 0,
				description: boundedCatalogText(pluginInterface?.shortDescription) || boundedCatalogText(pluginInterface?.longDescription) || void 0,
				installed: summary.installed,
				enabled: summary.enabled,
				available: summary.availability !== "DISABLED_BY_ADMIN" && summary.installPolicy !== "NOT_AVAILABLE",
				...summary.installPolicy ? { installPolicy: summary.installPolicy } : {},
				...summary.authPolicy ? { authPolicy: summary.authPolicy } : {},
				...marketplace.path ? { marketplacePath: marketplace.path } : {},
				...summary.remotePluginId?.trim() ? {
					remotePluginId: summary.remotePluginId.trim(),
					mustShowInstallationInterstitial: summary.mustShowInstallationInterstitial ?? null
				} : {},
				summaryId: summary.id
			};
			if (previous && (previous.marketplacePath !== next.marketplacePath || previous.remotePluginId !== next.remotePluginId)) {
				discovered.delete(id);
				ambiguous.add(id);
				warnings.push(`Multiple discovered plugins share ${id}; installation requires a unique identity.`);
				continue;
			}
			if (!previous) discovered.set(id, next);
			else {
				const preferred = !previous.installed && next.installed || !previous.enabled && next.installed && next.enabled ? next : previous;
				discovered.set(id, {
					...preferred,
					available: previous.available && next.available,
					...preferred.remotePluginId ? { mustShowInstallationInterstitial: previous.mustShowInstallationInterstitial === true || next.mustShowInstallationInterstitial === true ? true : previous.mustShowInstallationInterstitial === false && next.mustShowInstallationInterstitial === false ? false : null } : {},
					...previous.installPolicy === "NOT_AVAILABLE" || next.installPolicy === "NOT_AVAILABLE" ? { installPolicy: "NOT_AVAILABLE" } : {}
				});
			}
		}
	}
	return {
		plugins: [...discovered.values()].toSorted((left, right) => left.id.localeCompare(right.id)),
		warnings
	};
}
function pluginSlug(summary, marketplaceName) {
	const qualified = parseCodexPluginMarketplaceId(summary.id);
	if (qualified?.marketplaceName === marketplaceName) return qualified.pluginName;
	const identitySegment = summary.id.split("/").at(-1);
	if (identitySegment && PLUGIN_NAME_PATTERN.test(identitySegment)) return identitySegment;
	return PLUGIN_NAME_PATTERN.test(summary.name) ? summary.name : void 0;
}
function boundedCatalogText(value) {
	if (typeof value !== "string") return "";
	let sanitized = "";
	for (const character of value) {
		const codePoint = character.codePointAt(0);
		sanitized += codePoint !== void 0 && (codePoint <= 31 || codePoint >= 127 && codePoint <= 159) ? " " : character;
	}
	return sanitized.replace(/\s+/g, " ").trim().slice(0, MAX_PLUGIN_METADATA_LENGTH);
}
//#endregion
export { CODEX_HOST_INSPECTION_AUTH_ERROR as a, canMutateCodexHost as c, CODEX_FULL_PERMISSIONS_AUTH_ERROR as i, hasCodexAdminScope as l, filterCodexMarketplacePlugins as n, CODEX_NATIVE_EXECUTION_AUTH_ERROR as o, parseCodexPluginMarketplaceId as r, assertCodexHostOwnerCurrent as s, discoverCodexMarketplacePlugins as t };
