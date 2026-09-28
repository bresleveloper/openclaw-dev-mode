import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import "./utils-aKqR_F_U.mjs";
import { i as matchRootFileOpenFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { f as readPluginCacheFile, o as parsePluginCacheJson, s as pluginCacheExistsSync, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES, u as pluginCacheStatSync } from "./package-manifest-C8sTeZKW.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as normalizeManifestActivation } from "./manifest-DHkEL08H.mjs";
import path from "node:path";
//#region src/plugins/bundle-manifest.ts
/** Reads Agent/Codex/Claude/Cursor bundle manifests into OpenClaw plugin manifest metadata. */
/** Relative manifest path for Codex-style plugin bundles. */
const CODEX_BUNDLE_MANIFEST_RELATIVE_PATH = ".codex-plugin/plugin.json";
const CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH = ".claude-plugin/plugin.json";
const CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH = ".cursor-plugin/plugin.json";
const AGENT_BUNDLE_MANIFEST_RELATIVE_PATH = "plugin.json";
const AGENT_BUNDLE_EXTENSION_NAMESPACE = "ai.openclaw";
const AGENT_BUNDLE_MANIFEST_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
const MAX_AGENT_BUNDLE_MANIFEST_BYTES = 262144;
const log = createSubsystemLogger("plugins/bundle-manifest");
/** Normalizes string-or-list path fields from bundle manifests. */
function normalizeBundlePathList(value) {
	return normalizeUniqueSingleOrTrimmedStringList(value);
}
function mergeBundlePathLists(...groups) {
	const merged = [];
	const seen = /* @__PURE__ */ new Set();
	for (const group of groups) for (const entry of group) {
		if (seen.has(entry)) continue;
		seen.add(entry);
		merged.push(entry);
	}
	return merged;
}
function hasInlineCapabilityValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isRecord(value)) return Object.keys(value).length > 0;
	return value === true;
}
function slugifyPluginId(raw, rootDir) {
	const fallback = path.basename(rootDir);
	return (normalizeLowercaseStringOrEmpty(raw) || normalizeLowercaseStringOrEmpty(fallback)).replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "bundle-plugin";
}
function loadBundleManifestFile(params) {
	const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		relativePath: params.manifestRelativePath,
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes ?? MAX_AGENT_BUNDLE_MANIFEST_BYTES
	});
	if (!file.ok) return matchRootFileOpenFailure(file.failure, {
		path: () => {
			if (params.allowMissing) return {
				ok: true,
				raw: {},
				manifestPath
			};
			return {
				ok: false,
				error: `plugin manifest not found: ${manifestPath}`,
				manifestPath
			};
		},
		fallback: (failure) => ({
			ok: false,
			error: `unsafe plugin manifest path: ${manifestPath} (${failure.reason})`,
			manifestPath
		})
	});
	const result = parsePluginCacheJson(file, { json5: !params.strictJson });
	if (!result.ok) return {
		ok: false,
		error: `failed to parse plugin manifest: ${formatErrorMessage(result.error)}`,
		manifestPath
	};
	if (!isRecord(result.value)) return {
		ok: false,
		error: "plugin manifest must be an object",
		manifestPath
	};
	return {
		ok: true,
		raw: result.value,
		manifestPath
	};
}
function resolveCodexSkillDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [];
}
function resolveCodexHookDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.hooks);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, "hooks")) ? ["hooks"] : [];
}
function resolveCursorSkillsRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.skills);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, "skills")) ? ["skills"] : [], declared);
}
function resolveCursorCommandRootDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.commands);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, ".cursor", "commands")) ? [".cursor/commands"] : [], declared);
}
function resolveCursorSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveCursorSkillsRootDirs(raw, rootDir), resolveCursorCommandRootDirs(raw, rootDir));
}
function resolveCursorAgentDirs(raw, rootDir) {
	const declared = normalizeBundlePathList(raw.subagents ?? raw.agents);
	return mergeBundlePathLists(pluginCacheExistsSync(path.join(rootDir, ".cursor", "agents")) ? [".cursor/agents"] : [], declared);
}
function hasCursorHookCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.hooks) || pluginCacheExistsSync(path.join(rootDir, ".cursor", "hooks.json"));
}
function hasCursorRulesCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.rules) || pluginCacheExistsSync(path.join(rootDir, ".cursor", "rules"));
}
function hasCursorMcpCapability(raw, rootDir) {
	return hasInlineCapabilityValue(raw.mcpServers) || pluginCacheExistsSync(path.join(rootDir, ".mcp.json"));
}
function resolveClaudeComponentPaths(raw, key, rootDir, defaults) {
	const declared = normalizeBundlePathList(raw[key]);
	return mergeBundlePathLists(defaults.filter((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate))), declared);
}
function buildCodexCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCodexSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCodexHookDirs(raw, rootDir).length > 0) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || pluginCacheExistsSync(path.join(rootDir, ".mcp.json"))) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.apps) || pluginCacheExistsSync(path.join(rootDir, ".app.json"))) capabilities.push("apps");
	return capabilities;
}
function buildCursorCapabilities(raw, rootDir) {
	const capabilities = [];
	if (resolveCursorSkillDirs(raw, rootDir).length > 0) capabilities.push("skills");
	if (resolveCursorCommandRootDirs(raw, rootDir).length > 0) capabilities.push("commands");
	if (resolveCursorAgentDirs(raw, rootDir).length > 0) capabilities.push("agents");
	if (hasCursorHookCapability(raw, rootDir)) capabilities.push("hooks");
	if (hasCursorRulesCapability(raw, rootDir)) capabilities.push("rules");
	if (hasCursorMcpCapability(raw, rootDir)) capabilities.push("mcpServers");
	return capabilities;
}
function resolveAgentSkillDirs(rootDir) {
	try {
		return pluginCacheStatSync(path.join(rootDir, "skills"))?.isDirectory() ? ["skills"] : [];
	} catch {
		return [];
	}
}
function buildAgentCapabilities(rootDir) {
	const capabilities = [];
	if (resolveAgentSkillDirs(rootDir).length > 0) capabilities.push("skills");
	if (pluginCacheExistsSync(path.join(rootDir, "mcp.json"))) capabilities.push("mcpServers");
	return capabilities;
}
function resolveAgentActivation(raw, manifestPath) {
	if (raw.extensions === void 0) return;
	if (!isRecord(raw.extensions)) {
		log.warn(`ignoring Agent Plugins extensions in ${manifestPath}: expected an object`);
		return;
	}
	const openclawExtension = raw.extensions[AGENT_BUNDLE_EXTENSION_NAMESPACE];
	if (openclawExtension === void 0) return;
	if (!isRecord(openclawExtension)) {
		log.warn(`ignoring Agent Plugins ${AGENT_BUNDLE_EXTENSION_NAMESPACE} extension in ${manifestPath}: expected an object`);
		return;
	}
	return normalizeManifestActivation(openclawExtension.activation);
}
function loadBundleManifest(params) {
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const manifestRelativePath = params.bundleFormat === "codex" ? CODEX_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "cursor" ? CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH : params.bundleFormat === "agent" ? AGENT_BUNDLE_MANIFEST_RELATIVE_PATH : CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH;
	const loaded = loadBundleManifestFile({
		rootDir: params.rootDir,
		...params.rootRealPath !== void 0 ? { rootRealPath: params.rootRealPath } : {},
		manifestRelativePath,
		rejectHardlinks,
		allowMissing: params.bundleFormat === "claude",
		strictJson: params.bundleFormat === "agent",
		...params.bundleFormat === "agent" ? { maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES } : {}
	});
	if (!loaded.ok) return loaded;
	const raw = loaded.raw;
	const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
	const name = normalizeOptionalString(raw.name);
	const description = normalizeOptionalString(raw.description) ?? normalizeOptionalString(raw.shortDescription) ?? normalizeOptionalString(interfaceRecord?.shortDescription);
	const version = normalizeOptionalString(raw.version);
	if (params.bundleFormat === "agent") {
		if (raw.$schema !== AGENT_BUNDLE_MANIFEST_SCHEMA) return {
			ok: false,
			error: `root plugin.json is not an Agent Plugins manifest; expected $schema ${AGENT_BUNDLE_MANIFEST_SCHEMA}`,
			manifestPath: loaded.manifestPath
		};
		if (!name) return {
			ok: false,
			error: "agent plugin manifest name must be a non-empty string",
			manifestPath: loaded.manifestPath
		};
		return {
			ok: true,
			manifest: {
				id: slugifyPluginId(name, params.rootDir),
				name,
				description,
				version,
				skills: resolveAgentSkillDirs(params.rootDir),
				settingsFiles: [],
				hooks: [],
				bundleFormat: "agent",
				activation: resolveAgentActivation(raw, loaded.manifestPath),
				capabilities: buildAgentCapabilities(params.rootDir)
			},
			manifestPath: loaded.manifestPath
		};
	}
	if (params.bundleFormat === "codex") {
		const skills = resolveCodexSkillDirs(raw, params.rootDir);
		const hooks = resolveCodexHookDirs(raw, params.rootDir);
		return {
			ok: true,
			manifest: {
				id: slugifyPluginId(name, params.rootDir),
				name,
				description,
				version,
				skills,
				settingsFiles: [],
				hooks,
				bundleFormat: "codex",
				activation: normalizeManifestActivation(raw.activation),
				capabilities: buildCodexCapabilities(raw, params.rootDir)
			},
			manifestPath: loaded.manifestPath
		};
	}
	if (params.bundleFormat === "cursor") return {
		ok: true,
		manifest: {
			id: slugifyPluginId(name, params.rootDir),
			name,
			description,
			version,
			skills: resolveCursorSkillDirs(raw, params.rootDir),
			settingsFiles: [],
			hooks: [],
			bundleFormat: "cursor",
			activation: normalizeManifestActivation(raw.activation),
			capabilities: buildCursorCapabilities(raw, params.rootDir)
		},
		manifestPath: loaded.manifestPath
	};
	const id = slugifyPluginId(name, params.rootDir);
	const skillRoots = resolveClaudeComponentPaths(raw, "skills", params.rootDir, ["skills"]);
	const commands = resolveClaudeComponentPaths(raw, "commands", params.rootDir, ["commands"]);
	const agents = resolveClaudeComponentPaths(raw, "agents", params.rootDir, ["agents"]);
	const outputStyles = resolveClaudeComponentPaths(raw, "outputStyles", params.rootDir, ["output-styles"]);
	const skills = mergeBundlePathLists(skillRoots, commands, agents, outputStyles);
	const settingsFiles = pluginCacheExistsSync(path.join(params.rootDir, "settings.json")) ? ["settings.json"] : [];
	const hooks = resolveClaudeComponentPaths(raw, "hooks", params.rootDir, ["hooks/hooks.json"]);
	const activation = normalizeManifestActivation(raw.activation);
	const capabilities = [];
	if (skills.length > 0) capabilities.push("skills");
	if (commands.length > 0) capabilities.push("commands");
	if (agents.length > 0) capabilities.push("agents");
	if (hasInlineCapabilityValue(raw.hooks) || hooks.length > 0) capabilities.push("hooks");
	if (hasInlineCapabilityValue(raw.mcpServers) || resolveClaudeComponentPaths(raw, "mcpServers", params.rootDir, [".mcp.json"]).length > 0) capabilities.push("mcpServers");
	if (hasInlineCapabilityValue(raw.lspServers) || resolveClaudeComponentPaths(raw, "lspServers", params.rootDir, [".lsp.json"]).length > 0) capabilities.push("lspServers");
	if (hasInlineCapabilityValue(raw.outputStyles) || outputStyles.length > 0) capabilities.push("outputStyles");
	if (settingsFiles.length > 0) capabilities.push("settings");
	return {
		ok: true,
		manifest: {
			id,
			name,
			description,
			version,
			skills,
			settingsFiles,
			hooks,
			bundleFormat: "claude",
			activation,
			capabilities
		},
		manifestPath: loaded.manifestPath
	};
}
function detectBundleManifestFormat(rootDir, hasPackageExtensions = false) {
	if (hasPackageExtensions && pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, ".codex-plugin/plugin.json"))) return "codex";
	if (pluginCacheExistsSync(path.join(rootDir, ".cursor-plugin/plugin.json"))) return "cursor";
	if (pluginCacheExistsSync(path.join(rootDir, ".claude-plugin/plugin.json"))) return "claude";
	if (pluginCacheExistsSync(path.join(rootDir, "openclaw.plugin.json"))) return null;
	if (pluginCacheExistsSync(path.join(rootDir, "plugin.json"))) {
		const agentManifest = loadBundleManifestFile({
			rootDir,
			manifestRelativePath: AGENT_BUNDLE_MANIFEST_RELATIVE_PATH,
			rejectHardlinks: false,
			strictJson: true,
			maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES
		});
		if (agentManifest.ok && agentManifest.raw.$schema === AGENT_BUNDLE_MANIFEST_SCHEMA) return "agent";
	}
	if (DEFAULT_PLUGIN_ENTRY_CANDIDATES.some((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate)))) return null;
	if ([
		path.join(rootDir, "skills"),
		path.join(rootDir, "commands"),
		path.join(rootDir, "agents"),
		path.join(rootDir, "hooks", "hooks.json"),
		path.join(rootDir, ".mcp.json"),
		path.join(rootDir, ".lsp.json"),
		path.join(rootDir, "settings.json")
	].some((candidate) => pluginCacheExistsSync(candidate))) return "claude";
	return null;
}
//#endregion
export { detectBundleManifestFormat as a, normalizeBundlePathList as c, CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH as i, CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH as n, loadBundleManifest as o, CODEX_BUNDLE_MANIFEST_RELATIVE_PATH as r, mergeBundlePathLists as s, AGENT_BUNDLE_MANIFEST_RELATIVE_PATH as t };
