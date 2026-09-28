//#region src/plugins/catalog-discovery.ts
const DISCOVERY_ID_PREFIX = "ch_";
const LOCAL_DISCOVERY_ID_PREFIX = "local_";
const DISCOVERY_ID_PAYLOAD = /^[A-Za-z0-9_-]+$/u;
function normalizedAlias(value) {
	return value?.trim().toLowerCase() || void 0;
}
function indexClawHubPlugins(plugins) {
	const index = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		const identity = normalizedAlias(localClawHubIdentity(plugin));
		if (identity) index.set(identity, plugin);
	}
	return index;
}
function findLocalPlugin(plugin, index) {
	return index.get(normalizedAlias(plugin.packageName) ?? "");
}
function projectLocalFacts(plugin, mutationAllowed, remoteInstallable = true) {
	if (!plugin) return {
		present: false,
		installed: false,
		enabled: false,
		state: "not-installed",
		action: mutationAllowed ? "install" : "unavailable"
	};
	return {
		present: true,
		installed: plugin.installed,
		enabled: plugin.enabled,
		state: plugin.state,
		pluginId: plugin.id,
		...!plugin.installed && plugin.install ? { install: plugin.install } : {},
		action: plugin.installed ? "manage" : mutationAllowed && (remoteInstallable || plugin.install) ? "install" : "unavailable"
	};
}
/** URL-safe route identity. Package aliases remain private to the Gateway join. */
function encodeDiscoveryId(prefix, identity) {
	const normalized = identity.trim();
	if (!normalized) throw new Error("Cannot encode an empty plugin discovery identity.");
	return `${prefix}${Buffer.from(normalized, "utf8").toString("base64url")}`;
}
function encodePluginDiscoveryId(packageName) {
	const normalized = packageName.trim();
	if (!normalized) throw new Error("Cannot encode an empty ClawHub package identity.");
	return encodeDiscoveryId(DISCOVERY_ID_PREFIX, normalized);
}
function encodeLocalPluginDiscoveryId(identity) {
	return encodeDiscoveryId(LOCAL_DISCOVERY_ID_PREFIX, identity);
}
function resolvePluginDiscoveryIdentity(id) {
	const prefix = id.startsWith(DISCOVERY_ID_PREFIX) ? DISCOVERY_ID_PREFIX : id.startsWith(LOCAL_DISCOVERY_ID_PREFIX) ? LOCAL_DISCOVERY_ID_PREFIX : void 0;
	if (!prefix) return;
	const payload = id.slice(prefix.length);
	if (!payload || !DISCOVERY_ID_PAYLOAD.test(payload)) return;
	try {
		const identity = Buffer.from(payload, "base64url").toString("utf8");
		return encodeDiscoveryId(prefix, identity) === id ? {
			origin: prefix === DISCOVERY_ID_PREFIX ? "clawhub" : "local",
			identity
		} : void 0;
	} catch {
		return;
	}
}
function joinClawHubPluginCatalog(params) {
	const localIndex = indexClawHubPlugins(params.local.plugins);
	const remote = params.remote.map((plugin) => {
		const localPlugin = findLocalPlugin(plugin, localIndex);
		return {
			id: encodePluginDiscoveryId(plugin.packageName),
			catalog: {
				name: plugin.displayName,
				packageName: plugin.packageName,
				...plugin.summary ? { summary: plugin.summary } : {},
				family: plugin.family,
				...plugin.ownerHandle ? { author: plugin.ownerHandle } : {},
				official: plugin.isOfficial,
				categories: plugin.categories,
				...plugin.iconUrl ? { imageUrl: plugin.iconUrl } : {},
				...plugin.latestVersion ? { latestVersion: plugin.latestVersion } : {},
				...plugin.downloads !== void 0 ? { downloads: plugin.downloads } : {},
				...plugin.installs !== void 0 ? { installs: plugin.installs } : {},
				...plugin.verificationTier ? { verificationTier: plugin.verificationTier } : {},
				...plugin.featured !== void 0 ? { featured: plugin.featured } : {},
				...plugin.trending !== void 0 ? { trending: plugin.trending } : {},
				...plugin.featuredRank !== void 0 ? { featuredRank: plugin.featuredRank } : {},
				...plugin.trendingRank !== void 0 ? { trendingRank: plugin.trendingRank } : {},
				publishedToClawHub: true
			},
			local: projectLocalFacts(localPlugin, params.local.mutationAllowed)
		};
	});
	if (!params.includeBundledOnly && params.intent !== "all" || params.cursor) return remote;
	const publishedLocalPlugins = /* @__PURE__ */ new Set();
	for (const plugin of params.remote) {
		const localPlugin = findLocalPlugin(plugin, localIndex);
		if (localPlugin) publishedLocalPlugins.add(localPlugin);
	}
	const query = normalizedAlias(params.query);
	const joined = [...params.local.plugins.filter((plugin) => !publishedLocalPlugins.has(plugin) && (params.intent === "all" && plugin.installed || params.includeBundledOnly && plugin.origin === "bundled" && (params.intent !== "bundled" || !localClawHubIdentity(plugin)))).filter((plugin) => {
		const categories = localDiscoveryCategories(plugin);
		if (params.category && !categories.includes(params.category)) return false;
		if (!query) return true;
		return [
			plugin.id,
			plugin.packageName,
			plugin.name,
			plugin.description,
			...categories
		].flatMap((value) => value ? [value.toLowerCase()] : []).some((value) => value.includes(query));
	}).toSorted((left, right) => left.name.localeCompare(right.name)).map((plugin) => projectLocalDiscoveryEntry(plugin, params.local.mutationAllowed, params.includeBundledOnly)), ...remote];
	return params.intent === "all" && !query ? joined.toSorted(compareOfficialDownloads) : joined;
}
function localDiscoveryCategories(plugin) {
	return plugin.categories ?? (plugin.category ? [plugin.category] : []);
}
function localClawHubIdentity(plugin) {
	return plugin.clawhubPackage ?? (plugin.install?.source === "clawhub" ? plugin.install.packageName : void 0);
}
function projectLocalDiscoveryEntry(plugin, mutationAllowed, publicationVerified = false) {
	const clawhubIdentity = localClawHubIdentity(plugin);
	const publishedToClawHub = clawhubIdentity ? true : publicationVerified ? false : void 0;
	const packageName = plugin.clawhubPackage ?? plugin.packageName;
	return {
		id: clawhubIdentity ? encodePluginDiscoveryId(clawhubIdentity) : encodeLocalPluginDiscoveryId(plugin.id),
		catalog: {
			name: plugin.name,
			...packageName ? { packageName } : {},
			...plugin.description ? { summary: plugin.description } : {},
			official: false,
			categories: localDiscoveryCategories(plugin),
			...publishedToClawHub !== void 0 ? { publishedToClawHub } : {},
			...plugin.version ? { latestVersion: plugin.version } : {}
		},
		local: projectLocalFacts(plugin, mutationAllowed, false)
	};
}
function compareOfficialDownloads(left, right) {
	if (left.catalog.official !== right.catalog.official) return left.catalog.official ? -1 : 1;
	return (right.catalog.downloads ?? 0) - (left.catalog.downloads ?? 0) || left.catalog.name.localeCompare(right.catalog.name);
}
function findLocalPluginByIdentity(local, identity, origin = "clawhub") {
	return origin === "local" ? local.plugins.find((plugin) => plugin.id === identity) : indexClawHubPlugins(local.plugins).get(normalizedAlias(identity) ?? "");
}
function joinLocalPluginDetail(params) {
	const plugin = projectLocalDiscoveryEntry(params.plugin, params.local.mutationAllowed);
	const inspection = params.inspection;
	return {
		plugin,
		detail: {
			origin: "local",
			...params.plugin.packageName ? { packageName: params.plugin.packageName } : {},
			topics: [],
			...inspection?.overview?.readme ? { readme: inspection.overview.readme } : {},
			...inspection?.overview?.repositoryUrl ? { repositoryUrl: inspection.overview.repositoryUrl } : {},
			...inspection?.overview?.documentationUrl ? { documentationUrl: inspection.overview.documentationUrl } : {},
			configuration: [],
			mcpServers: inspection?.components.mcpServers ?? [],
			skills: (inspection?.components.skills ?? []).map((name) => ({ name })),
			versions: []
		}
	};
}
function joinClawHubPluginDetail(params) {
	const [plugin] = joinClawHubPluginCatalog({
		remote: [params.remote],
		local: params.local
	});
	if (!plugin) throw new Error("ClawHub returned no plugin detail.");
	return {
		plugin,
		detail: {
			origin: "clawhub",
			packageName: params.remote.packageName,
			...params.remote.owner ? { author: params.remote.owner } : {},
			topics: params.remote.topics,
			...params.remote.createdAt !== void 0 ? { createdAt: params.remote.createdAt } : {},
			...params.remote.updatedAt !== void 0 ? { updatedAt: params.remote.updatedAt } : {},
			...params.remote.readme ? { readme: params.remote.readme } : {},
			...params.remote.repositoryUrl ? { repositoryUrl: params.remote.repositoryUrl } : {},
			...params.remote.documentationUrl ? { documentationUrl: params.remote.documentationUrl } : {},
			...params.remote.compatibility ? { compatibility: params.remote.compatibility } : {},
			...params.remote.contracts ? { contracts: params.remote.contracts } : {},
			...params.remote.providers ? { providers: params.remote.providers } : {},
			...params.remote.channels ? { channels: params.remote.channels } : {},
			configuration: params.remote.configFields,
			mcpServers: params.remote.mcpServers,
			skills: params.remote.skills,
			versions: params.remote.versions,
			...params.remote.verification ? { verification: params.remote.verification } : {},
			...params.remote.security ? { security: params.remote.security } : {}
		}
	};
}
//#endregion
export { joinLocalPluginDetail as a, joinClawHubPluginDetail as i, findLocalPluginByIdentity as n, resolvePluginDiscoveryIdentity as o, joinClawHubPluginCatalog as r, encodePluginDiscoveryId as t };
