import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { m as normalizeUniqueSingleOrTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { i as matchRootFileOpenFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { f as readPluginCacheFile, o as parsePluginCacheJson, s as pluginCacheExistsSync, t as DEFAULT_PLUGIN_ENTRY_CANDIDATES, u as pluginCacheStatSync } from "./package-manifest-CEbdS_C4.mjs";
import { i as normalizeManifestActivation } from "./manifest-BXjFCp0F.mjs";
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
	return [...new Set(groups.flat())];
}
function hasInlineCapabilityValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	if (isRecord(value)) return Object.keys(value).length > 0;
	return value === true;
}
function slugifyPluginId(raw, rootDir) {
	const fallback = path.basename(rootDir);
	return (normalizeLowercaseStringOrEmpty(raw) || normalizeLowercaseStringOrEmpty(fallback)).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "bundle-plugin";
}
function loadBundleManifestFile(params) {
	const manifestPath = path.join(params.rootDir, params.manifestRelativePath);
	const file = readPluginCacheFile({
		rootDir: params.rootDir,
		rootRealPath: params.rootRealPath,
		relativePath: params.manifestRelativePath,
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: MAX_AGENT_BUNDLE_MANIFEST_BYTES
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
function resolveCodexComponentDirs(raw, rootDir, component) {
	const declared = normalizeBundlePathList(raw[component]);
	if (declared.length > 0) return declared;
	return pluginCacheExistsSync(path.join(rootDir, component)) ? [component] : [];
}
function resolveCursorCommandRootDirs(raw, rootDir) {
	return resolveBundleComponentPaths(raw.commands, rootDir, [".cursor/commands"]);
}
function resolveCursorSkillDirs(raw, rootDir) {
	return mergeBundlePathLists(resolveBundleComponentPaths(raw.skills, rootDir, ["skills"]), resolveCursorCommandRootDirs(raw, rootDir));
}
function resolveCursorAgentDirs(raw, rootDir) {
	return resolveBundleComponentPaths(raw.subagents ?? raw.agents, rootDir, [".cursor/agents"]);
}
function resolveBundleComponentPaths(value, rootDir, defaults) {
	const declared = normalizeBundlePathList(value);
	return mergeBundlePathLists(defaults.filter((candidate) => pluginCacheExistsSync(path.join(rootDir, candidate))), declared);
}
function buildCursorCapabilities(raw, rootDir) {
	const capabilities = [
		...resolveCursorSkillDirs(raw, rootDir).length > 0 ? ["skills"] : [],
		...resolveCursorCommandRootDirs(raw, rootDir).length > 0 ? ["commands"] : [],
		...resolveCursorAgentDirs(raw, rootDir).length > 0 ? ["agents"] : []
	];
	for (const [capability, defaultPath] of [
		["hooks", ".cursor/hooks.json"],
		["rules", ".cursor/rules"],
		["mcpServers", ".mcp.json"]
	]) if (hasInlineCapabilityValue(raw[capability]) || pluginCacheExistsSync(path.join(rootDir, defaultPath))) capabilities.push(capability);
	return capabilities;
}
function resolveAgentSkillDirs(rootDir) {
	try {
		return pluginCacheStatSync(path.join(rootDir, "skills"))?.isDirectory() ? ["skills"] : [];
	} catch {
		return [];
	}
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
		strictJson: params.bundleFormat === "agent"
	});
	if (!loaded.ok) return loaded;
	const raw = loaded.raw;
	const interfaceRecord = isRecord(raw.interface) ? raw.interface : void 0;
	const name = normalizeOptionalString(raw.name);
	const description = normalizeOptionalString(raw.description) ?? normalizeOptionalString(raw.shortDescription) ?? normalizeOptionalString(interfaceRecord?.shortDescription);
	const version = normalizeOptionalString(raw.version);
	const manifest = {
		id: slugifyPluginId(name, params.rootDir),
		name,
		description,
		version,
		skills: [],
		settingsFiles: [],
		hooks: [],
		bundleFormat: params.bundleFormat,
		activation: void 0,
		capabilities: []
	};
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
		manifest.skills = resolveAgentSkillDirs(params.rootDir);
		manifest.activation = resolveAgentActivation(raw, loaded.manifestPath);
		manifest.capabilities = [...manifest.skills.length > 0 ? ["skills"] : [], ...pluginCacheExistsSync(path.join(params.rootDir, "mcp.json")) ? ["mcpServers"] : []];
	} else {
		manifest.activation = normalizeManifestActivation(raw.activation);
		if (params.bundleFormat === "codex") {
			manifest.skills = resolveCodexComponentDirs(raw, params.rootDir, "skills");
			manifest.hooks = resolveCodexComponentDirs(raw, params.rootDir, "hooks");
			manifest.capabilities = [...manifest.skills.length > 0 ? ["skills"] : [], ...manifest.hooks.length > 0 ? ["hooks"] : []];
			for (const [capability, defaultPath] of [["mcpServers", ".mcp.json"], ["apps", ".app.json"]]) if (hasInlineCapabilityValue(raw[capability]) || pluginCacheExistsSync(path.join(params.rootDir, defaultPath))) manifest.capabilities.push(capability);
		} else if (params.bundleFormat === "cursor") {
			manifest.skills = resolveCursorSkillDirs(raw, params.rootDir);
			manifest.capabilities = buildCursorCapabilities(raw, params.rootDir);
		} else Object.assign(manifest, resolveClaudeComponents(raw, params.rootDir));
	}
	const extensions = isRecord(raw.extensions) ? raw.extensions : void 0;
	const openai = isRecord(extensions?.["com.openai"]) ? extensions["com.openai"] : void 0;
	const onboardingSkill = normalizeOptionalString(openai?.onboardingSkill);
	if (onboardingSkill) {
		const relative = path.normalize(onboardingSkill);
		if (!path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`) && path.basename(relative) === "SKILL.md" && manifest.skills.some((root) => {
			const fromRoot = path.relative(path.resolve(params.rootDir, root), path.resolve(params.rootDir, relative));
			return fromRoot !== ".." && !fromRoot.startsWith(`..${path.sep}`) && !path.isAbsolute(fromRoot);
		})) manifest.onboardingSkill = relative;
	}
	return {
		ok: true,
		manifest,
		manifestPath: loaded.manifestPath
	};
}
function resolveClaudeComponents(raw, rootDir) {
	const skillRoots = resolveBundleComponentPaths(raw.skills, rootDir, ["skills"]);
	const commands = resolveBundleComponentPaths(raw.commands, rootDir, ["commands"]);
	const agents = resolveBundleComponentPaths(raw.agents, rootDir, ["agents"]);
	const outputStyles = resolveBundleComponentPaths(raw.outputStyles, rootDir, ["output-styles"]);
	const skills = mergeBundlePathLists(skillRoots, commands, agents, outputStyles);
	const settingsFiles = pluginCacheExistsSync(path.join(rootDir, "settings.json")) ? ["settings.json"] : [];
	const hooks = resolveBundleComponentPaths(raw.hooks, rootDir, ["hooks/hooks.json"]);
	return {
		skills,
		settingsFiles,
		hooks,
		capabilities: [
			...skills.length > 0 ? ["skills"] : [],
			...commands.length > 0 ? ["commands"] : [],
			...agents.length > 0 ? ["agents"] : [],
			...hasInlineCapabilityValue(raw.hooks) || hooks.length > 0 ? ["hooks"] : [],
			...hasInlineCapabilityValue(raw.mcpServers) || resolveBundleComponentPaths(raw.mcpServers, rootDir, [".mcp.json"]).length > 0 ? ["mcpServers"] : [],
			...hasInlineCapabilityValue(raw.lspServers) || resolveBundleComponentPaths(raw.lspServers, rootDir, [".lsp.json"]).length > 0 ? ["lspServers"] : [],
			...hasInlineCapabilityValue(raw.outputStyles) || outputStyles.length > 0 ? ["outputStyles"] : [],
			...settingsFiles.length > 0 ? ["settings"] : []
		]
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
			strictJson: true
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
export { detectBundleManifestFormat as a, normalizeBundlePathList as c, CURSOR_BUNDLE_MANIFEST_RELATIVE_PATH as i, resolveBundleComponentPaths as l, CLAUDE_BUNDLE_MANIFEST_RELATIVE_PATH as n, loadBundleManifest as o, CODEX_BUNDLE_MANIFEST_RELATIVE_PATH as r, mergeBundlePathLists as s, AGENT_BUNDLE_MANIFEST_RELATIVE_PATH as t };
