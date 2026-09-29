import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getPluginRegistryVersion } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as formatConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import { p as isValidSecretRef } from "./ref-contract-BVi3ykLT.mjs";
import { f as resolveConfigSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-CSuKIPux.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Gn as validatePluginsCatalogBrowseParams, Kn as validatePluginsCatalogCategoriesParams, Qn as validatePluginsInspectParams, er as validatePluginsListParams, qn as validatePluginsCatalogGetParams, rh as validatePluginsSkillsReadParams, rr as validatePluginsSearchParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { $r as validatePluginsCredentialsInspectParams } from "./sessions-KsldKmtI.mjs";
import "./skill-library-C7RO5Y8q.mjs";
import { h as readRequiredClawHubStringField, i as fetchClawHubJson, l as readClawHubBytes, p as readRequiredClawHubNumberField, y as withClawHubResponse } from "./clawhub-client-D8cfvjQG.mjs";
import { t as SKILL_LIBRARY_MAX_TREE_ENTRIES } from "./bundle-rcLpsHEc.mjs";
import { a as pluginSkillFileFromBytes, o as validatePluginSkillPath, t as readPluginSkill } from "./plugin-skills-CnAdRDnb.mjs";
import { y as withManagedPluginCache } from "./management-catalog-HkZv11Ak.mjs";
import { d as fetchClawHubPluginCatalog, f as fetchClawHubPluginCategories, m as fetchClawHubPluginOverview, n as listManagedPlugins, p as fetchClawHubPluginDetail, s as resolveManagedPluginMetadata, t as inspectManagedPlugin, u as resolvePluginCredentialDescriptors } from "./management-service-BPiOYlEh.mjs";
import { t as searchInstallablePluginPackages } from "./catalog-search-CDdabHSg.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { a as joinLocalPluginDetail, i as joinClawHubPluginDetail, n as findLocalPluginByIdentity, o as resolvePluginDiscoveryIdentity, r as joinClawHubPluginCatalog, t as encodePluginDiscoveryId } from "./catalog-discovery-DH_QVLJr.mjs";
import { n as listPluginServiceHealthFailures } from "./service-health-CNd0D8uW.mjs";
import { t as registerClawHubCatalogIconUrls } from "./catalog-icon-registry-b1MkOn00.mjs";
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
//#region src/plugins/credential-inspection.ts
/** Never resolve references; authored literals require the explicit administrator reveal flow. */
function inspectPluginCredentialValue(config, descriptor, env, reveal = false) {
	let value = config;
	for (const segment of descriptor.path) value = value !== null && typeof value === "object" && Object.hasOwn(value, segment) ? Reflect.get(value, segment) : void 0;
	const path = formatConcreteConfigPath(descriptor.path, config);
	const ref = resolveConfigSecretRef({
		config,
		path,
		value,
		defaults: config.secrets?.defaults,
		includeResolved: true
	});
	if (ref && isValidSecretRef(ref)) return {
		kind: "reference",
		ref,
		unresolved: hasUnresolvedConfigPath(config, path)
	};
	if (typeof value === "string" && value.length) return {
		kind: "literal",
		...reveal ? { value } : {}
	};
	if (value !== void 0 && value !== "") return { kind: "invalid" };
	const envVar = descriptor.envVars.find((name) => Boolean(env[name]?.trim()));
	return envVar ? {
		kind: "environment",
		envVar
	} : { kind: "missing" };
}
//#endregion
//#region src/gateway/server-methods/plugins.ts
const pluginsHandlers = {
	"plugins.credentials.inspect": async ({ params, client, context, respond, signal, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validatePluginsCredentialsInspectParams, "plugins.credentials.inspect", respond)) return;
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
	},
	"plugins.skills.read": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsSkillsReadParams, "plugins.skills.read", respond)) return;
		try {
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
		} catch (error) {
			respond(false, void 0, errorShape(error instanceof ManagedPluginLifecycleError && error.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsListParams, "plugins.list", respond)) return;
		try {
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
						...plugin.clawhubPackage ? { catalogId: encodePluginDiscoveryId(plugin.clawhubPackage) } : {},
						runtime: {
							state: record?.status === "loaded" ? failure ? "service-failed" : "active" : record?.status === "disabled" ? "disabled" : "unloaded",
							...error ? { error: error.slice(0, 2e3) } : {}
						}
					});
				})
			}, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.inspect": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsInspectParams, "plugins.inspect", respond)) return;
		try {
			const inspected = await inspectManagedPlugin({
				config: context.getRuntimeConfig(),
				pluginId: params.pluginId
			});
			const { inspectDecisionProviders } = await import("./runtime-BhjNXgzY.mjs");
			respond(true, {
				...inspected,
				decisions: inspectDecisionProviders(context.getRuntimeConfig()).filter((entry) => entry.pluginId === params.pluginId)
			}, void 0);
		} catch (error) {
			const lifecycleError = error instanceof ManagedPluginLifecycleError ? error : void 0;
			respond(false, void 0, errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.search": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsSearchParams, "plugins.search", respond)) return;
		try {
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
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		}
	},
	"plugins.catalog.browse": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsCatalogBrowseParams, "plugins.catalog.browse", respond)) return;
		if (params.query?.trim() && params.cursor) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Plugin search does not accept a browse cursor."));
			return;
		}
		try {
			const local = await listManagedPlugins({ config: context.getRuntimeConfig() });
			const query = params.query?.trim();
			const intent = params.intent ?? "all";
			const includeBundledOnly = intent === "bundled" || intent === "all" && Boolean(query);
			try {
				const overviewRequest = intent === "all" && !query && !params.category && !params.cursor;
				const remote = overviewRequest ? await fetchClawHubPluginOverview() : intent === "bundled" ? { items: [] } : await fetchClawHubPluginCatalog({
					query,
					...params.searchSource ? { searchSource: params.searchSource } : {},
					intent,
					category: params.category,
					cursor: params.cursor,
					limit: params.pageSize ?? 20
				});
				const items = joinClawHubPluginCatalog({
					remote: remote.items,
					local,
					includeBundledOnly,
					intent,
					category: params.category,
					query: params.query,
					cursor: params.cursor
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
						remote: [],
						local,
						includeBundledOnly,
						intent,
						category: params.category,
						query: params.query,
						cursor: params.cursor
					}),
					...params.cursor ? { nextCursor: params.cursor } : {},
					remoteError: `ClawHub is unavailable: ${formatErrorMessage(error)}.${includeBundledOnly ? " Bundled plugins remain available." : intent === "all" ? " Installed plugins remain available." : ""}`
				}, void 0);
			}
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Plugin discovery is unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`));
		}
	},
	"plugins.catalog.categories": async ({ params, respond }) => {
		if (!assertValidParams(params, validatePluginsCatalogCategoriesParams, "plugins.catalog.categories", respond)) return;
		try {
			respond(true, { categories: await fetchClawHubPluginCategories() }, void 0);
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Plugin categories are unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`));
		}
	},
	"plugins.catalog.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validatePluginsCatalogGetParams, "plugins.catalog.get", respond)) return;
		const identity = resolvePluginDiscoveryIdentity(params.id);
		if (!identity) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Unknown plugin discovery identity."));
			return;
		}
		try {
			const local = await listManagedPlugins({ config: context.getRuntimeConfig() });
			const localPlugin = findLocalPluginByIdentity(local, identity.identity, identity.origin);
			if (identity.origin === "local") {
				if (!localPlugin) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Unknown local plugin discovery identity."));
					return;
				}
				const inspectionPluginId = localPlugin.installed ? localPlugin.id : localPlugin.install?.source === "official" ? localPlugin.install.pluginId : void 0;
				const inspection = inspectionPluginId ? await inspectManagedPlugin({
					config: context.getRuntimeConfig(),
					pluginId: inspectionPluginId
				}) : void 0;
				respond(true, joinLocalPluginDetail({
					plugin: localPlugin,
					local,
					inspection
				}), void 0);
				return;
			}
			try {
				const remote = await fetchClawHubPluginDetail({
					packageName: identity.identity,
					...params.version ? { version: params.version } : {}
				});
				registerClawHubCatalogIconUrls([remote.iconUrl, remote.owner?.imageUrl]);
				respond(true, joinClawHubPluginDetail({
					remote,
					local
				}), void 0);
			} catch (error) {
				if (!localPlugin) throw error;
				const inspection = localPlugin.installed ? await inspectManagedPlugin({
					config: context.getRuntimeConfig(),
					pluginId: localPlugin.id
				}) : void 0;
				respond(true, joinLocalPluginDetail({
					plugin: localPlugin,
					local,
					inspection
				}), void 0);
			}
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Plugin details are unavailable: ${formatErrorMessage(error)}. Retry to reconnect to ClawHub.`));
		}
	}
};
//#endregion
export { pluginsHandlers };
