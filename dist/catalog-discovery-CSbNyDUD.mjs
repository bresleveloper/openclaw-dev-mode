import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { c as readPluginCacheFile, n as parsePluginCacheJson } from "./plugin-cache-files-VxWaav6j.mjs";
import { n as validatePluginUiCapabilities } from "./plugin-ui-capabilities-C5nEC6Su.mjs";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-DiVSy6jb.mjs";
import { n as inspectBundleMcpRuntimeSupport, r as inspectNativePluginMcpRuntimeSupport } from "./bundle-mcp-dtpQHFMr.mjs";
import { n as buildPluginCapabilitySummary } from "./capability-summary-Cy4VIUND.mjs";
import { t as loadHookEntriesFromDir } from "./discovery-Di6VdRVw.mjs";
import { r as resolvePluginSkillDetails } from "./plugin-skills-Du3r4DEy.mjs";
import { t as inspectBundleLspRuntimeSupport } from "./bundle-lsp-CtEbI7PB.mjs";
import { n as inspectBundlePluginArtifact } from "./install-artifact-inspection-X2JhMF_r.mjs";
import path from "node:path";
//#region packages/plugin-package-contract/src/catalog-order.ts
/** Compare registry-issued category priorities, then downloads and canonical identity. */
function comparePluginCatalogEntries(left, right, category) {
	if (category) {
		const leftRank = left.catalog.categoryRanks?.[category] ?? Number.MAX_SAFE_INTEGER;
		const rightRank = right.catalog.categoryRanks?.[category] ?? Number.MAX_SAFE_INTEGER;
		if (leftRank !== rightRank) return leftRank - rightRank;
	}
	const downloads = (right.catalog.downloads ?? 0) - (left.catalog.downloads ?? 0);
	const leftIdentity = left.catalog.packageName ?? left.id;
	const rightIdentity = right.catalog.packageName ?? right.id;
	return downloads || (leftIdentity < rightIdentity ? -1 : leftIdentity > rightIdentity ? 1 : 0);
}
//#endregion
//#region src/plugins/installed-plugin-components.ts
function emptyInstalledPluginComponents() {
	return {
		mapped: [],
		skills: [],
		mcpServers: [],
		commands: [],
		hooks: [],
		lspServers: [],
		unavailable: {
			capabilities: [],
			mcpServers: [],
			lspServers: []
		}
	};
}
/** Projects only components that the installed OpenClaw runtime can actually use. */
function projectInstalledPluginComponents(params) {
	const { manifest, declared } = params;
	const skillDetails = manifest?.rootDir ? resolvePluginSkillDetails(manifest) : void 0;
	const skillNames = skillDetails?.map((skill) => skill.name) ?? sortUniqueStrings(declared.skills);
	if (manifest?.format !== "bundle" || !manifest.bundleFormat) {
		const mcp = manifest?.rootDir ? inspectNativePluginMcpRuntimeSupport({
			rootDir: manifest.rootDir,
			mcpServers: manifest.mcpServers ?? {}
		}) : void 0;
		const skills = skillNames;
		const mcpServers = sortUniqueStrings(mcp?.supportedServerNames ?? declared.mcpServers);
		const commands = sortUniqueStrings(declared.cliCommands);
		const hooks = sortUniqueStrings(declared.hooks);
		return {
			mapped: [
				...skills.length > 0 ? ["skills"] : [],
				...mcpServers.length > 0 ? ["mcpServers"] : [],
				...commands.length > 0 ? ["commands"] : [],
				...hooks.length > 0 ? ["hooks"] : []
			],
			skills,
			...skillDetails ? { skillDetails } : {},
			mcpServers,
			commands,
			hooks,
			lspServers: [],
			unavailable: {
				capabilities: [],
				mcpServers: sortUniqueStrings(mcp?.unsupportedServerNames ?? []),
				lspServers: []
			}
		};
	}
	const support = inspectBundlePluginArtifact({
		format: manifest.bundleFormat,
		capabilities: manifest.bundleCapabilities ?? []
	});
	const mapped = new Set(support.mapped);
	const hooks = mapped.has("hooks") && manifest.rootDir ? sortUniqueStrings((manifest.hooks ?? []).filter((dir) => loadHookEntriesFromDir({
		dir: path.resolve(manifest.rootDir, dir),
		rootDir: manifest.rootDir,
		pluginId: manifest.id,
		source: "openclaw-plugin"
	}).some(({ hook }) => Boolean(hook.handlerPath)))) : [];
	if (mapped.has("hooks") && hooks.length === 0) {
		mapped.delete("hooks");
		support.unavailable.push("hooks");
	}
	const mcp = manifest.rootDir ? inspectBundleMcpRuntimeSupport({
		pluginId: manifest.id,
		rootDir: manifest.rootDir,
		bundleFormat: manifest.bundleFormat
	}) : void 0;
	const lsp = manifest.rootDir ? inspectBundleLspRuntimeSupport({
		pluginId: manifest.id,
		rootDir: manifest.rootDir,
		bundleFormat: manifest.bundleFormat
	}) : void 0;
	return {
		mapped: sortUniqueStrings(mapped),
		skills: mapped.has("skills") ? skillNames : [],
		...mapped.has("skills") && skillDetails ? { skillDetails } : {},
		mcpServers: mapped.has("mcpServers") ? sortUniqueStrings(mcp?.supportedServerNames ?? []) : [],
		commands: [],
		hooks,
		lspServers: mapped.has("lspServers") ? sortUniqueStrings(lsp?.supportedServerNames ?? []) : [],
		unavailable: {
			capabilities: sortUniqueStrings(support.unavailable),
			mcpServers: sortUniqueStrings(mcp?.unsupportedServerNames ?? []),
			lspServers: sortUniqueStrings(lsp?.unsupportedServerNames ?? [])
		}
	};
}
//#endregion
//#region src/plugins/installed-plugin-overview.ts
/** Project a selected manifest's summary, never its package-wide consent union. */
function projectPluginOverviewCapabilities(declared, uiCapabilities) {
	const contracts = {};
	for (const contract of declared.contracts) {
		const separator = contract.indexOf(": ");
		(contracts[contract.slice(0, separator)] ??= []).push(contract.slice(separator + 2));
	}
	const ui = validatePluginUiCapabilities(uiCapabilities);
	if (!ui.ok) throw new Error(`Invalid plugin uiCapabilities: ${ui.error}`);
	return {
		providers: declared.providers,
		channels: declared.channels,
		contracts,
		...ui.capabilities !== void 0 ? { ui: ui.capabilities } : {}
	};
}
/** Read presentation artifacts through the lifecycle-owned, bounded plugin root cache. */
function readInstalledPluginOverview(manifest) {
	if (!manifest) return;
	const read = (relativePath) => readPluginCacheFile({
		rootDir: manifest.rootDir,
		relativePath,
		rejectHardlinks: shouldRejectHardlinkedPluginFiles(manifest),
		maxBytes: 524288
	});
	const readme = read("README.md");
	const packageFile = read("package.json");
	const parsed = packageFile.ok ? parsePluginCacheJson(packageFile) : void 0;
	const pkg = asRecord(parsed?.ok ? parsed.value : void 0);
	const repository = typeof pkg.repository === "string" ? pkg.repository : asRecord(pkg.repository).url;
	const repositoryUrl = normalizeOptionalString(repository);
	const documentationUrl = normalizeOptionalString(pkg.homepage);
	const publisherName = normalizeOptionalString(asRecord(pkg.author).name);
	return {
		capabilities: projectPluginOverviewCapabilities(buildPluginCapabilitySummary({
			manifest,
			origin: manifest.origin
		}).declared, manifest.uiCapabilities),
		...readme.ok ? { readme: readme.contents.toString("utf8") } : {},
		...repositoryUrl ? { repositoryUrl } : {},
		...documentationUrl ? { documentationUrl } : {},
		...publisherName ? { publisherName } : {}
	};
}
//#endregion
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
		const localPlugin = localIndex.get(normalizedAlias(plugin.packageName) ?? "");
		const categories = [.../* @__PURE__ */ new Set([...plugin.categories, ...localPlugin?.capabilityCategories ?? []])];
		return {
			id: encodePluginDiscoveryId(plugin.packageName),
			catalog: {
				name: plugin.displayName,
				packageName: plugin.packageName,
				...plugin.summary ? { summary: plugin.summary } : {},
				family: plugin.family,
				...plugin.ownerHandle ? { author: plugin.ownerHandle } : {},
				official: plugin.isOfficial,
				categories,
				...categoryPriorityFacts(plugin.packageName, categories, params.categories),
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
	const publishedPackages = new Set(params.remote.map((plugin) => normalizedAlias(plugin.packageName)));
	const query = normalizedAlias(params.query);
	const joined = [...params.local.plugins.filter((plugin) => !publishedPackages.has(normalizedAlias(localClawHubIdentity(plugin))) && (params.intent === "all" && plugin.installed && (!params.categories || params.query?.trim() || plugin.capabilityCategories?.some((category) => !params.category || category === params.category)) || params.includeBundledOnly && plugin.origin === "bundled" && (params.intent !== "bundled" || !localClawHubIdentity(plugin)))).filter((plugin) => {
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
	}).toSorted((left, right) => left.name.localeCompare(right.name)).map((plugin) => projectLocalDiscoveryEntry(plugin, params.local.mutationAllowed, params.includeBundledOnly && plugin.origin === "bundled", params.categories)), ...remote];
	return params.intent === "all" && !query ? joined.toSorted((left, right) => comparePluginCatalogEntries(left, right, params.category)) : joined;
}
function localDiscoveryCategories(plugin) {
	return [.../* @__PURE__ */ new Set([...plugin.categories ?? (plugin.category ? [plugin.category] : []), ...plugin.capabilityCategories ?? []])];
}
function localClawHubIdentity(plugin) {
	return plugin.clawhubPackage ?? (plugin.install?.source === "clawhub" ? plugin.install.packageName : void 0);
}
function projectLocalDiscoveryEntry(plugin, mutationAllowed, publicationVerified = false, categories) {
	const clawhubIdentity = localClawHubIdentity(plugin);
	const publishedToClawHub = clawhubIdentity ? true : publicationVerified ? false : void 0;
	const packageName = plugin.clawhubPackage ?? plugin.packageName;
	const official = plugin.origin === "bundled";
	return {
		id: clawhubIdentity ? encodePluginDiscoveryId(clawhubIdentity) : encodeLocalPluginDiscoveryId(plugin.id),
		catalog: {
			name: plugin.name,
			...packageName ? { packageName } : {},
			...plugin.description ? { summary: plugin.description } : {},
			official,
			...official ? { author: "openclaw" } : {},
			categories: localDiscoveryCategories(plugin),
			...official ? categoryPriorityFacts(packageName, localDiscoveryCategories(plugin), categories) : {},
			...publishedToClawHub !== void 0 ? { publishedToClawHub } : {},
			...plugin.version ? { latestVersion: plugin.version } : {}
		},
		local: projectLocalFacts(plugin, mutationAllowed, false)
	};
}
function categoryPriorityFacts(packageName, memberships, categories = []) {
	const ranks = categories.flatMap((category) => {
		const rank = packageName && memberships.includes(category.slug) ? category.pinnedPackages?.indexOf(packageName) ?? -1 : -1;
		return rank >= 0 ? [[category.slug, rank]] : [];
	});
	return ranks.length ? { categoryRanks: Object.fromEntries(ranks) } : {};
}
function findLocalPluginByIdentity(local, identity, origin = "clawhub") {
	return origin === "local" ? local.plugins.find((plugin) => plugin.id === identity) : indexClawHubPlugins(local.plugins).get(normalizedAlias(identity) ?? "");
}
function joinLocalPluginDetail(params) {
	const plugin = projectLocalDiscoveryEntry(params.plugin, params.local.mutationAllowed);
	const inspection = params.inspection;
	const capabilities = inspection?.overview?.capabilities;
	const contracts = { ...capabilities?.contracts };
	if (inspection?.declared.tools.length) contracts.tools = inspection.declared.tools;
	return {
		plugin,
		detail: {
			origin: "local",
			...plugin.catalog.official ? { author: {
				handle: "openclaw",
				displayName: "OpenClaw",
				official: true
			} } : inspection?.overview?.publisherName ? { author: { displayName: inspection.overview.publisherName } } : {},
			...params.plugin.packageName ? { packageName: params.plugin.packageName } : {},
			topics: [],
			...inspection?.overview?.readme ? { readme: inspection.overview.readme } : {},
			...inspection?.overview?.repositoryUrl ? { repositoryUrl: inspection.overview.repositoryUrl } : {},
			...inspection?.overview?.documentationUrl ? { documentationUrl: inspection.overview.documentationUrl } : {},
			...Object.keys(contracts).length ? { contracts } : {},
			...capabilities?.providers.length ? { providers: capabilities.providers } : {},
			...capabilities?.channels.length ? { channels: capabilities.channels } : {},
			...capabilities?.ui !== void 0 ? { uiCapabilities: capabilities.ui } : {},
			configuration: [],
			mcpServers: inspection?.components.mcpServers ?? [],
			skills: (inspection?.components.skills ?? []).map((name) => ({ name })),
			versions: [],
			selectedRelease: null,
			downloadability: {
				status: "unknown",
				reason: "Local metadata does not establish ClawHub release downloadability."
			}
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
			registry: params.remote.registry,
			tags: params.remote.tags,
			selectedRelease: params.remote.selectedRelease,
			downloadability: params.remote.downloadability,
			metadata: params.remote.metadata,
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
			...params.remote.uiCapabilities !== void 0 ? { uiCapabilities: params.remote.uiCapabilities } : {},
			configuration: params.remote.configFields,
			mcpServers: params.remote.mcpServers,
			...params.remote.mcpServerDetails ? { mcpServerDetails: params.remote.mcpServerDetails } : {},
			skills: params.remote.skills,
			versions: params.remote.versions,
			...params.remote.verification ? { verification: params.remote.verification } : {},
			...params.remote.security ? { security: params.remote.security } : {}
		}
	};
}
/** Project advisory registry metadata without issuing package capability consent. */
function projectClawHubPluginInspection(params) {
	const { remote, local, config } = params;
	const localPlugin = findLocalPluginByIdentity(local, remote.packageName);
	const installedPlugin = localPlugin?.installed ? localPlugin : void 0;
	const runtimePlugin = remote.runtimeId ? findLocalPluginByIdentity({
		...local,
		plugins: local.plugins.filter((plugin) => plugin.id === remote.runtimeId)
	}, remote.packageName) : void 0;
	const summary = buildPluginCapabilitySummary({
		manifest: {
			contracts: remote.contracts,
			channels: remote.channels,
			providers: remote.providers,
			mcpServers: Object.fromEntries(remote.mcpServers.map((name) => [name, {}])),
			skills: remote.skills.map((skill) => skill.name)
		},
		origin: "global",
		entryConfig: runtimePlugin?.installed ? config.plugins?.entries?.[runtimePlugin.id] : void 0
	});
	const catalog = joinClawHubPluginDetail({
		remote,
		local
	});
	return {
		ok: true,
		plugin: {
			id: installedPlugin?.id ?? catalog.plugin.id,
			name: remote.displayName,
			...remote.selectedRelease ? { version: remote.selectedRelease.version } : {},
			...remote.summary ? { description: remote.summary } : {},
			origin: "clawhub",
			installed: Boolean(installedPlugin),
			enabled: installedPlugin?.enabled ?? false
		},
		source: {
			kind: "clawhub",
			packageName: remote.packageName
		},
		...summary,
		declaredSurfaceStatus: remote.metadata.manifest === "available" ? "partial" : "unavailable",
		components: emptyInstalledPluginComponents(),
		overview: {
			...remote.metadata.manifest === "available" ? { capabilities: projectPluginOverviewCapabilities(summary.declared, remote.uiCapabilities) } : {},
			...remote.readme ? { readme: remote.readme } : {},
			...remote.repositoryUrl ? { repositoryUrl: remote.repositoryUrl } : {},
			...remote.documentationUrl ? { documentationUrl: remote.documentationUrl } : {},
			...remote.owner?.displayName ? { publisherName: remote.owner.displayName } : {}
		},
		...remote.trust ? { trust: remote.trust } : {},
		catalog
	};
}
var CatalogDiscoveryRequestError = class extends Error {};
const CATALOG_SEARCH_LIMIT = 100;
const CATALOG_SEARCH_CONCURRENCY = 4;
async function prepareCatalogLocalState(scope, kinds) {
	const [plugins, skills] = await Promise.all([kinds.includes("plugin") ? import("./management-service-COnIN4Mh.mjs").then(({ listManagedPlugins }) => listManagedPlugins({ config: scope.config })) : void 0, kinds.includes("skill") ? import("./status-welFNywk.mjs").then(async ({ prepareWorkspaceSkillStatus }) => {
		if (!scope.agentId || !scope.workspaceDir) throw new CatalogDiscoveryRequestError("Skill discovery requires an agent workspace.");
		return (await prepareWorkspaceSkillStatus(scope.workspaceDir, {
			config: scope.config,
			agentId: scope.agentId
		})).report;
	}) : void 0]);
	return {
		plugins,
		skills
	};
}
async function readCatalogPage(params) {
	const { request, local } = params;
	const { resolveClawHubBaseUrl } = await import("./clawhub-client-CC9uklGH.mjs");
	const registry = resolveClawHubBaseUrl();
	const query = request.query?.trim();
	const limit = request.pageSize ?? 20;
	let items;
	let nextCursor;
	if (request.kind === "plugin") {
		const { fetchClawHubPluginCatalog } = await import("./clawhub-plugin-catalog-CBNi0vj0.mjs");
		const remote = await fetchClawHubPluginCatalog({
			query,
			intent: request.feed === "trending" ? "trending" : "all",
			officialOnly: request.officialOnly,
			cursor: request.cursor,
			limit
		});
		if (!local.plugins) throw new Error("Plugin installation status is unavailable.");
		items = joinClawHubPluginCatalog({
			remote: remote.items,
			local: local.plugins
		}).map((entry) => Object.assign({
			kind: "plugin",
			registry
		}, entry));
		nextCursor = remote.nextCursor;
	} else {
		const { fetchClawHubSkillCatalog } = await import("./clawhub-skills-DDPCTdTo.mjs");
		const remote = await fetchClawHubSkillCatalog({
			query,
			feed: request.feed,
			officialOnly: request.officialOnly,
			cursor: request.cursor,
			limit
		});
		const report = local.skills;
		if (!report?.agentId) throw new Error("Skill installation status is unavailable.");
		const agentId = report.agentId;
		const installed = new Map(report.skills.flatMap((skill) => {
			const link = skill.clawhub;
			if (!link?.valid) return [];
			const ref = link.requestedReference ?? (link.ownerHandle ? `@${link.ownerHandle}/${link.slug}` : void 0);
			return ref ? [[JSON.stringify([link.registry, ref]), skill]] : [];
		}));
		items = remote.items.map((entry) => {
			const skill = installed.get(JSON.stringify([entry.registry, entry.installRef]));
			return {
				kind: "skill",
				registry: entry.registry,
				id: entry.installRef,
				installRef: entry.installRef,
				slug: entry.slug,
				...entry.ownerHandle !== void 0 ? { ownerHandle: entry.ownerHandle } : {},
				...entry.installOnly ? { installOnly: entry.installOnly } : {},
				...entry.trustState ? { trustState: entry.trustState } : {},
				catalog: {
					name: entry.displayName,
					official: entry.official === true,
					categories: [],
					...entry.summary ? { summary: entry.summary } : {},
					...entry.ownerHandle ? { author: entry.ownerHandle } : {},
					...entry.icon ? { imageUrl: entry.icon } : {},
					...entry.version ? { latestVersion: entry.version } : {},
					publishedToClawHub: !entry.installOnly
				},
				local: {
					agentId,
					installed: skill !== void 0,
					enabled: skill !== void 0 && !skill.disabled,
					eligible: skill?.eligible === true && !skill.blockedByAgentFilter,
					...skill ? { skillKey: skill.skillKey } : {}
				}
			};
		});
		nextCursor = remote.nextCursor;
	}
	return {
		items: [...new Map(items.filter((entry) => !request.officialOnly || entry.catalog.official).map((entry) => [JSON.stringify([
			entry.kind,
			entry.registry,
			entry.id
		]), entry])).values()].slice(0, limit),
		...nextCursor ? { nextCursor } : {}
	};
}
async function browseClawHubCatalog(params) {
	const { request } = params;
	const mode = request.query?.trim() ? "search" : request.feed ?? "catalog";
	if (mode === "search" && (request.cursor || request.feed === "trending")) throw new CatalogDiscoveryRequestError("Search accepts neither a browse cursor nor the trending feed.");
	const local = await prepareCatalogLocalState(params, [request.kind]);
	const searchFacts = mode === "search" ? { searchLimit: request.pageSize ?? 20 } : {};
	try {
		const page = await readCatalogPage({
			request,
			local
		});
		const { registerClawHubCatalogIconUrls } = await import("./catalog-icon-registry-D3WVtHWz.mjs");
		registerClawHubCatalogIconUrls(page.items.map((entry) => entry.catalog.imageUrl));
		return {
			...page,
			mode,
			...searchFacts
		};
	} catch (error) {
		const { formatErrorMessage } = await import("./infra/errors.js");
		return {
			items: [],
			mode,
			...searchFacts,
			...request.cursor ? { nextCursor: request.cursor } : {},
			remoteError: `ClawHub discovery is unavailable: ${formatErrorMessage(error)}. Retry this request.`
		};
	}
}
async function searchClawHubCatalogKeywords(params) {
	const { createHash } = await import("node:crypto");
	const { resolveClawHubBaseUrl } = await import("./clawhub-client-CC9uklGH.mjs");
	const { formatErrorMessage } = await import("./infra/errors.js");
	const { request } = params;
	const keywords = [...new Set(request.keywords.map((term) => term.trim().replace(/\s+/gu, " ").toLowerCase()))].toSorted();
	const kinds = (request.kinds ?? ["plugin", "skill"]).toSorted();
	const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
	const key = hash([
		keywords,
		kinds,
		resolveClawHubBaseUrl(),
		params.agentId,
		params.workspaceDir
	]);
	let offset = 0;
	if (request.cursor) {
		const match = /^kw1\.([a-f0-9]{64})\.([a-f0-9]{64})\.(\d{1,5})$/u.exec(request.cursor);
		if (!match || match[1] !== key || Number(match[3]) > 2e4) throw new CatalogDiscoveryRequestError("Invalid keyword cursor. Restart discovery with the same keywords and agent.");
		offset = Number(match[3]);
	}
	const local = await prepareCatalogLocalState(params, kinds);
	const queries = keywords.flatMap((query) => kinds.map((kind) => ({
		kind,
		query
	})));
	const results = [];
	const errors = [];
	let nextQuery = 0;
	await Promise.all(Array.from({ length: Math.min(CATALOG_SEARCH_CONCURRENCY, queries.length) }, async () => {
		while (nextQuery < queries.length) {
			const index = nextQuery++;
			const query = queries[index];
			try {
				results[index] = await readCatalogPage({
					request: {
						...query,
						officialOnly: true,
						pageSize: CATALOG_SEARCH_LIMIT
					},
					local
				});
			} catch (error) {
				results[index] = { items: [] };
				errors.push({
					...query,
					message: formatErrorMessage(error)
				});
			}
		}
	}));
	const union = new Map(results.flatMap((page) => page.items.map((entry) => [JSON.stringify([
		entry.kind,
		entry.registry,
		entry.id
	]), entry])));
	const identities = [...union.keys()].toSorted();
	const signature = hash(identities);
	const pageSize = request.pageSize ?? 20;
	const items = identities.slice(offset, offset + pageSize).map((id) => union.get(id));
	const { registerClawHubCatalogIconUrls } = await import("./catalog-icon-registry-D3WVtHWz.mjs");
	registerClawHubCatalogIconUrls(items.map((entry) => entry.catalog.imageUrl));
	return {
		items,
		keywords,
		searchLimit: CATALOG_SEARCH_LIMIT,
		errors: errors.toSorted((a, b) => a.kind.localeCompare(b.kind) || a.query.localeCompare(b.query)),
		...offset + pageSize < identities.length ? { nextCursor: `kw1.${key}.${signature}.${offset + pageSize}` } : {}
	};
}
//#endregion
export { findLocalPluginByIdentity as a, joinLocalPluginDetail as c, searchClawHubCatalogKeywords as d, projectPluginOverviewCapabilities as f, projectInstalledPluginComponents as h, encodePluginDiscoveryId as i, projectClawHubPluginInspection as l, emptyInstalledPluginComponents as m, browseClawHubCatalog as n, joinClawHubPluginCatalog as o, readInstalledPluginOverview as p, encodeLocalPluginDiscoveryId as r, joinClawHubPluginDetail as s, CatalogDiscoveryRequestError as t, resolvePluginDiscoveryIdentity as u };
