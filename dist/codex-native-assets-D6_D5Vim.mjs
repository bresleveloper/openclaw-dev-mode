import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-C-QBCzx4.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region src/commands/doctor/shared/codex-native-assets.ts
const MAX_SCAN_DEPTH = 6;
const MAX_DISCOVERED_DIRS = 2e3;
function resolveUserHome(env) {
	return env.HOME?.trim() || os.homedir();
}
function resolveHomePath(value, env) {
	if (value === "~") return resolveUserHome(env);
	if (value.startsWith("~/")) return path.join(resolveUserHome(env), value.slice(2));
	return path.resolve(value);
}
function resolveCodexHome(env) {
	return resolveHomePath(env.CODEX_HOME?.trim() || "~/.codex", env);
}
function resolvePersonalAgentSkillsDir(env) {
	return path.join(resolveUserHome(env), ".agents", "skills");
}
async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
async function isDirectory(filePath) {
	try {
		return (await fs.stat(filePath)).isDirectory();
	} catch {
		return false;
	}
}
async function discoverDirectoryAssets(root, kind) {
	if (!await isDirectory(root)) return [];
	const hits = [];
	async function visit(dir, depth) {
		if (hits.length >= MAX_DISCOVERED_DIRS || depth > MAX_SCAN_DEPTH) return;
		if (kind === "skill" && depth === 1 && path.basename(dir) === ".system") return;
		if (await exists(kind === "skill" ? path.join(dir, "SKILL.md") : path.join(dir, ".codex-plugin", "plugin.json"))) {
			hits.push({
				kind,
				path: dir
			});
			return;
		}
		for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) if (entry.isDirectory()) await visit(path.join(dir, entry.name), depth + 1);
	}
	await visit(root, 0);
	return hits;
}
function isCodexPluginConfigured(cfg) {
	const plugins = cfg.plugins;
	if (plugins?.enabled === false) return false;
	const allow = plugins?.allow;
	if (Array.isArray(allow)) return allow.some((entry) => normalizeOptionalLowercaseString(entry) === "codex");
	return isRecord(plugins?.entries?.codex) && plugins.entries.codex.enabled !== false;
}
/** Discover personal Codex skills, plugins, config, and hooks relevant to Codex-mode agents. */
async function scanCodexNativeAssets(params) {
	const env = params.env ?? process.env;
	if (!collectConfiguredAgentHarnessRuntimes(params.cfg).includes("codex") && !isCodexPluginConfigured(params.cfg)) return [];
	const codexHome = resolveCodexHome(env);
	const hits = /* @__PURE__ */ new Map();
	function record(hit) {
		hits.set(`${hit.kind}:${hit.path}`, hit);
	}
	for (const [resolveRoot, kind] of [
		[() => path.join(codexHome, "skills"), "skill"],
		[() => resolvePersonalAgentSkillsDir(env), "skill"],
		[() => path.join(codexHome, "plugins", "cache"), "plugin"]
	]) for (const hit of await discoverDirectoryAssets(resolveRoot(), kind)) record(hit);
	for (const [kind, relativePath] of [["config", "config.toml"], ["hooks", path.join("hooks", "hooks.json")]]) {
		const assetPath = path.join(codexHome, relativePath);
		if (await exists(assetPath)) record({
			kind,
			path: assetPath
		});
	}
	return [...hits.values()].toSorted((a, b) => a.path.localeCompare(b.path));
}
/** Build an informational doctor note when personal Codex CLI assets need migration review. */
async function collectCodexNativeAssetInfoNotes(params) {
	const env = params.env ?? process.env;
	const hits = await scanCodexNativeAssets({
		cfg: params.cfg,
		env
	});
	if (hits.length === 0) return [];
	return [[`- Personal Codex CLI assets found (${[
		["skill", "skill"],
		["plugin", "plugin"],
		["config", "config file"],
		["hooks", "hook file"]
	].map(([kind, label]) => {
		const count = hits.filter((hit) => hit.kind === kind).length;
		return `${count} ${label}${count === 1 ? "" : "s"}`;
	}).join(", ")}) in ${resolveCodexHome(env)} and ${resolvePersonalAgentSkillsDir(env)}; native Codex-mode agents use isolated per-agent homes and will not load them.`, "- To review or promote them: install the Codex plugin (openclaw plugins install npm:@openclaw/codex), then run openclaw migrate plan codex."].join("\n")];
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.codexNativeAssetsTestApi")] = { scanCodexNativeAssets };
//#endregion
export { collectCodexNativeAssetInfoNotes };
