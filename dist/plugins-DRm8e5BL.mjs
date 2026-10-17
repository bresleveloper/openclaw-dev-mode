import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as getPluginRegistryVersion } from "./runtime-state-Cd-Ga9cg.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { Jn as validatePluginsCatalogCategoriesParams, Yn as validatePluginsCatalogGetParams, ar as validatePluginsSearchParams, er as validatePluginsInspectParams, nr as validatePluginsListParams, qn as validatePluginsCatalogBrowseParams, ym as validatePluginsSkillsReadParams } from "./src-l2dWvEsN.mjs";
import { ii as validatePluginsCredentialsInspectParams } from "./sessions-DJqMAtE3.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import "./skill-library-Bgib5R_8.mjs";
import { b as withClawHubResponse, g as readRequiredClawHubStringField, i as fetchClawHubJson, l as readClawHubBytes, m as readRequiredClawHubNumberField, v as resolveClawHubBaseUrl } from "./clawhub-client-D-mEumEV.mjs";
import { t as SKILL_LIBRARY_MAX_TREE_ENTRIES } from "./bundle-Cu4zt9nj.mjs";
import { a as pluginSkillFileFromBytes, o as validatePluginSkillPath, t as readPluginSkill } from "./plugin-skills-BVTLcXRM.mjs";
import { y as withManagedPluginCache } from "./management-catalog-WXw--Fds.mjs";
import { d as resolvePluginCredentialDescriptors, f as fetchClawHubPluginCatalog, h as fetchClawHubPluginOverview, m as fetchClawHubPluginDetail, n as listManagedPlugins, p as fetchClawHubPluginCategories, s as resolveManagedPluginMetadata, t as inspectManagedPlugin, u as inspectPluginCredentialValue } from "./management-service-D8UpDtZ-.mjs";
import { a as joinClawHubPluginDetail, c as resolvePluginDiscoveryIdentity, i as joinClawHubPluginCatalog, n as encodePluginDiscoveryId, o as joinLocalPluginDetail, r as findLocalPluginByIdentity, t as encodeLocalPluginDiscoveryId } from "./catalog-discovery-bzOzSctU.mjs";
import { n as registerClawHubCatalogIconUrls } from "./catalog-icon-registry-QbEIkWWZ.mjs";
import { t as searchInstallablePluginPackages } from "./catalog-search-m4ClEdqP.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
import { n as listPluginServiceHealthFailures } from "./service-health-DdlAkI7p.mjs";
import { createHash } from "node:crypto";
//#region src/infra/clawhub-plugin-skills.ts
/** A release inventory supplies both the declared boundary and exact hashes; no archive or install. */
async function fetchClawHubPluginSkill(params) {
	if (params.path !== void 0) validatePluginSkillPath(params.path);
	const deadline = Date.now() + (params.timeoutMs ?? 3e4);
	const remainingMs = () => Math.max(1, deadline - Date.now());
	const basePath = `/api/v1/packages/${encodeURIComponent(params.packageName)}`;
	const value = await fetchClawHubJson({
		...params,
		timeoutMs: remainingMs(),
		retryTransientReads: false,
		path: `${basePath}/versions/${encodeURIComponent(params.version)}`
	});
	if (!isRecord(value) || !isRecord(value.package) || value.package.name !== params.packageName || !isRecord(value.version) || value.version.version !== params.version || !Array.isArray(value.version.files) || !isRecord(value.version.pluginManifestSummary) || !Array.isArray(value.version.pluginManifestSummary.bundledSkills)) throw new Error("ClawHub did not return the selected plugin version and skill inventory.");
	const matches = value.version.pluginManifestSummary.bundledSkills.filter((skill) => isRecord(skill) && skill.name === params.skillName);
	const selected = matches[0];
	if (matches.length !== 1 || !isRecord(selected)) throw new Error(matches.length ? "Plugin skill name is ambiguous." : "Plugin skill not found.");
	const rootPath = readRequiredClawHubStringField(selected, "rootPath", "bundled skill");
	const rawEntry = readRequiredClawHubStringField(selected, "skillMdPath", "bundled skill");
	const entry = rawEntry.replace(/^(?:\.\/)+/u, "");
	if (rootPath !== ".") validatePluginSkillPath(rootPath);
	const prefix = rootPath === "." ? "" : `${rootPath}/`;
	const entryPath = entry.slice(prefix.length);
	if (!entry.startsWith(prefix) || entryPath.toLowerCase() !== "skill.md") throw new Error("ClawHub skill entry is outside its declared bundle.");
	const files = value.version.files.flatMap((candidate) => {
		if (!isRecord(candidate)) throw new Error("Invalid ClawHub file inventory.");
		const fullPath = readRequiredClawHubStringField(candidate, "path", "skill file");
		const bundlePath = fullPath.replace(/^(?:\.\/)+/u, "");
		if (!bundlePath.startsWith(prefix)) return [];
		const filePath = bundlePath.slice(prefix.length);
		validatePluginSkillPath(filePath);
		const size = readRequiredClawHubNumberField(candidate, "size", "skill file");
		const hash = readRequiredClawHubStringField(candidate, "sha256", "skill file");
		if (!Number.isSafeInteger(size) || size < 0 || !/^[a-f0-9]{64}$/u.test(hash)) throw new Error("Invalid ClawHub skill file integrity metadata.");
		return [{
			path: filePath,
			fullPath,
			size,
			hash
		}];
	}).toSorted((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
	if (files.length > 256) throw new Error("Skill bundle exceeds file count limit.");
	if (new Set(files.map((file) => file.path.toLowerCase())).size !== files.length || !files.some((file) => file.fullPath === rawEntry && file.path === entryPath)) throw new Error("ClawHub skill inventory is incomplete or ambiguous.");
	const selectedPath = params.path ?? entryPath;
	if (!files.some((file) => file.path === selectedPath)) throw new Error("Plugin skill file not found.");
	const directories = new Set(files.flatMap((file) => {
		const parts = file.path.split("/");
		return parts.slice(1).map((_, index) => parts.slice(0, index + 1).join("/"));
	}));
	if (files.length + directories.size > SKILL_LIBRARY_MAX_TREE_ENTRIES) throw new Error("Skill bundle exceeds inventory limits.");
	const result = {
		name: params.skillName,
		rootPath,
		entryPath,
		version: params.version,
		files: [],
		directories: [],
		inventoryComplete: true
	};
	let totalBytes = 0;
	for (const file of files) {
		if (file.size > 1048576 || totalBytes + file.size > 8388608) {
			result.files.push({
				path: file.path,
				sizeBytes: file.size,
				status: "too-large"
			});
			continue;
		}
		totalBytes += file.size;
		if (file.path !== selectedPath) {
			result.files.push({
				path: file.path,
				sizeBytes: file.size,
				status: "deferred"
			});
			continue;
		}
		if (Date.now() >= deadline) {
			result.files.push({
				path: file.path,
				sizeBytes: file.size,
				status: "unavailable"
			});
			continue;
		}
		try {
			const read = await withClawHubResponse({
				...params,
				timeoutMs: remainingMs(),
				retryTransientReads: false,
				path: `${basePath}/file`,
				search: {
					path: file.fullPath,
					version: params.version
				},
				headers: { Accept: "application/octet-stream" }
			}, async ({ response }) => {
				if (!response.ok) return {
					path: file.path,
					sizeBytes: file.size,
					status: response.status === 413 ? "too-large" : "unavailable"
				};
				const buffer = await readClawHubBytes({
					response,
					maxBytes: Math.max(1, file.size),
					timeoutMs: remainingMs(),
					resourceLabel: "plugin skill file"
				});
				if (buffer.length !== file.size || createHash("sha256").update(buffer).digest("hex") !== file.hash) return {
					path: file.path,
					sizeBytes: file.size,
					status: "unavailable"
				};
				return pluginSkillFileFromBytes(file.path, buffer);
			});
			result.files.push(read);
		} catch {
			result.files.push({
				path: file.path,
				sizeBytes: file.size,
				status: "unavailable"
			});
		}
	}
	result.directories = [...directories].toSorted();
	return result;
}
//#endregion
//#region src/plugins/management-skill-read.ts
const readManagedPluginSkill = withManagedPluginCache(async (params) => {
	const metadata = resolveManagedPluginMetadata(params.config, params.env ?? process.env);
	const manifest = metadata.byPluginId.get(metadata.normalizePluginId(params.pluginId));
	if (!manifest) throw new ManagedPluginLifecycleError("Installed plugin not found.");
	return readPluginSkill(manifest, params.skillName, params);
});
//#endregion
//#region src/gateway/server-methods/plugins.credentials.ts
const pluginCredentialHandlers = { "plugins.credentials.inspect": defineValidatedGatewayHandler("plugins.credentials.inspect", validatePluginsCredentialsInspectParams, async ({ params, client, context, respond, signal, hasCurrentClientAuthority }) => {
	const authorized = () => Boolean(client && !client.invalidated && !client.connectionSignal?.aborted && client.connect.scopes?.includes("operator.admin") && !signal?.aborted && (!hasCurrentClientAuthority || hasCurrentClientAuthority()));
	const denied = () => respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Current administrator access is required to inspect plugin credentials."));
	if (!authorized()) {
		denied();
		return;
	}
	try {
		const snapshot = await readConfigFileSnapshot();
		if (!authorized()) {
			denied();
			return;
		}
		const baseHash = snapshot.hash ? context.configRevisionProjector.projectRawHash(snapshot.hash) : void 0;
		if (!baseHash || baseHash !== params.baseHash) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Configuration changed. Reload Settings before inspecting this reference."));
			return;
		}
		const manifest = resolveManagedPluginMetadata(context.getRuntimeConfig(), process.env).byPluginId.get(params.pluginId);
		const descriptor = manifest && resolvePluginCredentialDescriptors(manifest).find((field) => JSON.stringify(field.path) === JSON.stringify(params.path));
		if (!descriptor) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "This installed plugin does not declare that credential field."));
			return;
		}
		respond(true, {
			baseHash,
			credential: inspectPluginCredentialValue(snapshot.sourceConfig, descriptor, process.env, params.reveal === true)
		}, void 0);
	} catch {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Credential metadata is unavailable. Reload Settings and try again."));
	}
}) };
//#endregion
//#region src/gateway/server-methods/plugins.ts
function pluginReadError(error) {
	return errorShape(error instanceof ManagedPluginLifecycleError && error.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
const pluginsHandlers = {
	...pluginCredentialHandlers,
	"plugins.skills.read": defineValidatedGatewayHandler("plugins.skills.read", validatePluginsSkillsReadParams, async ({ params, respond, context }) => {
		if (params.path !== void 0) try {
			validatePluginSkillPath(params.path);
		} catch {
			throw new ManagedPluginLifecycleError("Invalid plugin skill bundle path.");
		}
		if (params.source === "installed") {
			respond(true, await readManagedPluginSkill({
				config: context.getRuntimeConfig(),
				pluginId: params.pluginId,
				skillName: params.skillName,
				path: params.path,
				version: params.version
			}), void 0);
			return;
		}
		const identity = resolvePluginDiscoveryIdentity(params.catalogId);
		if (!identity || identity.origin !== "clawhub") throw new ManagedPluginLifecycleError("Unknown ClawHub plugin identity.");
		respond(true, await fetchClawHubPluginSkill({
			packageName: identity.identity,
			version: params.version,
			skillName: params.skillName,
			path: params.path
		}), void 0);
	}, pluginReadError),
	"plugins.list": defineValidatedGatewayHandler("plugins.list", validatePluginsListParams, async ({ respond, context }) => {
		const catalog = await listManagedPlugins({ config: context.getRuntimeConfig() });
		const registry = getPluginRegistryForContext();
		const records = new Map(registry?.plugins.toReversed().map((record) => [record.id, record]));
		const failures = new Map(registry ? listPluginServiceHealthFailures(registry).map((failure) => [failure.pluginId, failure]) : []);
		respond(true, {
			...catalog,
			generation: getPluginRegistryVersion(registry),
			plugins: catalog.plugins.map((plugin) => {
				const record = records.get(plugin.id);
				const failure = failures.get(plugin.id);
				const error = failure ? `${failure.serviceId}: ${failure.error}` : record?.error;
				return Object.assign({}, plugin, {
					catalogId: plugin.clawhubPackage ? encodePluginDiscoveryId(plugin.clawhubPackage) : encodeLocalPluginDiscoveryId(plugin.id),
					runtime: {
						state: record?.status === "loaded" ? failure ? "service-failed" : "active" : record?.status === "disabled" ? "disabled" : "unloaded",
						...error ? { error: error.slice(0, 2e3) } : {}
					}
				});
			})
		}, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error))),
	"plugins.inspect": defineValidatedGatewayHandler("plugins.inspect", validatePluginsInspectParams, async ({ params, respond, context }) => {
		let target;
		if ("pluginId" in params) target = { pluginId: params.pluginId };
		else if ("source" in params) target = { clawhub: {
			packageName: params.packageName,
			version: params.version
		} };
		else {
			const identity = resolvePluginDiscoveryIdentity(params.catalogId);
			if (!identity) throw new ManagedPluginLifecycleError("Unknown plugin catalog identity.", { kind: "invalid-request" });
			if (identity.origin === "local" && params.version) throw new ManagedPluginLifecycleError("Local plugin inspection does not select releases.", { kind: "invalid-request" });
			target = identity.origin === "clawhub" ? { clawhub: {
				packageName: identity.identity,
				version: params.version
			} } : { pluginId: identity.identity };
		}
		const remote = "clawhub" in target;
		const inspected = await inspectManagedPlugin({
			config: context.getRuntimeConfig(),
			...target
		});
		const { inspectDecisionProviders } = await import("./runtime-DbiS_UJb.mjs");
		respond(true, {
			...inspected,
			decisions: remote ? [] : inspectDecisionProviders(context.getRuntimeConfig()).filter((entry) => entry.pluginId === inspected.plugin.id)
		}, void 0);
	}, pluginReadError),
	"plugins.search": defineValidatedGatewayHandler("plugins.search", validatePluginsSearchParams, async ({ params, respond }) => {
		respond(true, { results: (await searchInstallablePluginPackages({
			query: params.query,
			limit: params.limit
		})).flatMap((entry) => {
			if (entry.package.family !== "code-plugin" && entry.package.family !== "bundle-plugin") return [];
			const downloads = entry.package.stats?.downloads;
			return [{
				score: entry.score,
				package: {
					name: entry.package.name,
					displayName: entry.package.displayName,
					family: entry.package.family,
					channel: entry.package.channel,
					isOfficial: entry.package.isOfficial,
					...entry.package.summary ? { summary: entry.package.summary } : {},
					...entry.package.latestVersion ? { latestVersion: entry.package.latestVersion } : {},
					...entry.package.runtimeId ? { runtimeId: entry.package.runtimeId } : {},
					...typeof downloads === "number" && Number.isFinite(downloads) && downloads >= 0 ? { downloads } : {},
					...entry.package.verificationTier ? { verificationTier: entry.package.verificationTier } : {}
				}
			}];
		}) }, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error))),
	"plugins.catalog.browse": defineValidatedGatewayHandler("plugins.catalog.browse", validatePluginsCatalogBrowseParams, async ({ params, respond, context }) => {
		if (params.query?.trim() && params.cursor) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Plugin search does not accept a browse cursor."));
			return;
		}
		const query = params.query?.trim();
		const intent = params.intent ?? "all";
		const includeBundledOnly = intent === "bundled" || intent === "official" || intent === "all";
		const overviewRequest = intent === "all" && !query && !params.category && !params.cursor;
		const remoteRequest = overviewRequest ? fetchClawHubPluginOverview() : intent === "bundled" ? Promise.resolve({ items: [] }) : fetchClawHubPluginCatalog({
			query,
			...params.searchSource ? { searchSource: params.searchSource } : {},
			intent,
			category: params.category,
			cursor: params.cursor,
			limit: params.pageSize ?? 20
		});
		const [[remoteResult], local] = await Promise.all([Promise.allSettled([remoteRequest]), listManagedPlugins({ config: context.getRuntimeConfig() })]);
		const catalogOptions = {
			local,
			includeBundledOnly,
			intent,
			category: params.category,
			query: params.query,
			cursor: params.cursor
		};
		try {
			if (remoteResult.status === "rejected") throw remoteResult.reason;
			const remote = remoteResult.value;
			const items = joinClawHubPluginCatalog({
				...catalogOptions,
				remote: remote.items,
				categories: remote.categories
			});
			registerClawHubCatalogIconUrls(items.map((item) => item.catalog.imageUrl));
			respond(true, {
				items,
				...overviewRequest ? { categories: remote.categories } : {},
				...remote.nextCursor ? { nextCursor: remote.nextCursor } : {}
			}, void 0);
		} catch (error) {
			respond(true, {
				items: joinClawHubPluginCatalog({
					...catalogOptions,
					remote: []
				}),
				...params.cursor ? { nextCursor: params.cursor } : {},
				remoteError: `ClawHub is unavailable: ${formatErrorMessage(error)}.${intent === "all" ? " Installed plugins remain available." : includeBundledOnly ? " Bundled plugins remain available." : ""}`
			}, void 0);
		}
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, `Plugin discovery is unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`)),
	"plugins.catalog.categories": defineValidatedGatewayHandler("plugins.catalog.categories", validatePluginsCatalogCategoriesParams, async ({ respond }) => {
		respond(true, { categories: await fetchClawHubPluginCategories() }, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, `Plugin categories are unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`)),
	"plugins.catalog.get": defineValidatedGatewayHandler("plugins.catalog.get", validatePluginsCatalogGetParams, async ({ params, respond, context }) => {
		const identity = resolvePluginDiscoveryIdentity(params.id);
		if (!identity) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Unknown plugin discovery identity."));
			return;
		}
		if (identity.origin === "local" && params.version) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Local plugin details do not select releases."));
			return;
		}
		const local = await listManagedPlugins({ config: context.getRuntimeConfig() });
		const localPlugin = findLocalPluginByIdentity(local, identity.identity, identity.origin);
		let remoteError;
		if (identity.origin !== "local") try {
			const remote = await fetchClawHubPluginDetail({
				packageName: identity.identity,
				...params.version ? { version: params.version } : {}
			});
			registerClawHubCatalogIconUrls([remote.iconUrl, remote.owner?.imageUrl]);
			respond(true, joinClawHubPluginDetail({
				remote,
				local
			}), void 0);
			return;
		} catch (error) {
			if (!localPlugin) throw error;
			remoteError = `ClawHub details are unavailable: ${formatErrorMessage(error)}. Showing installed plugin metadata.`;
		}
		else if (!localPlugin) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Unknown local plugin discovery identity."));
			return;
		}
		const inspectionPluginId = localPlugin.installed ? localPlugin.id : identity.origin === "local" && localPlugin.install?.source === "official" ? localPlugin.install.pluginId : void 0;
		const inspection = inspectionPluginId ? await inspectManagedPlugin({
			config: context.getRuntimeConfig(),
			pluginId: inspectionPluginId
		}) : void 0;
		const result = joinLocalPluginDetail({
			plugin: localPlugin,
			local,
			inspection
		});
		if (remoteError) {
			result.plugin.id = params.id;
			result.plugin.catalog.packageName = identity.identity;
			result.detail = {
				...result.detail,
				packageName: identity.identity,
				registry: resolveClawHubBaseUrl(),
				remoteError,
				...params.version ? { requestedVersion: params.version } : {},
				selectedRelease: null,
				downloadability: {
					status: "unknown",
					reason: "ClawHub release metadata is unavailable."
				}
			};
		}
		respond(true, result, void 0);
	}, (error) => errorShape(ErrorCodes.UNAVAILABLE, `Plugin details are unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`))
};
//#endregion
export { pluginsHandlers };
