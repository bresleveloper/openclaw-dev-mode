import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { v as resolveSessionAgentIdStrict } from "./agent-scope-CTuYDtny.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import path from "node:path";
import os from "node:os";
//#region extensions/memory-wiki/src/config.ts
const WIKI_VAULT_MODES = [
	"isolated",
	"bridge",
	"unsafe-local"
];
const WIKI_VAULT_SCOPES = ["global", "agent"];
const WIKI_RENDER_MODES = ["native", "obsidian"];
const WIKI_SEARCH_BACKENDS = ["shared", "local"];
const WIKI_SEARCH_CORPORA = [
	"wiki",
	"memory",
	"all"
];
const DEFAULT_WIKI_VAULT_MODE = "isolated";
const DEFAULT_WIKI_VAULT_SCOPE = "global";
const DEFAULT_WIKI_RENDER_MODE = "native";
const DEFAULT_WIKI_SEARCH_BACKEND = "shared";
const DEFAULT_WIKI_SEARCH_CORPUS = "wiki";
const MemoryWikiConfigSource = strictObject({
	vaultMode: _enum(WIKI_VAULT_MODES).optional(),
	vault: strictObject({
		scope: _enum(WIKI_VAULT_SCOPES).optional(),
		path: string().optional(),
		renderMode: _enum(WIKI_RENDER_MODES).optional()
	}).optional(),
	obsidian: strictObject({
		enabled: boolean().optional(),
		useOfficialCli: boolean().optional(),
		vaultName: string().optional(),
		openAfterWrites: boolean().optional()
	}).optional(),
	bridge: strictObject({
		enabled: boolean().optional(),
		readMemoryArtifacts: boolean().optional(),
		indexDreamReports: boolean().optional(),
		indexDailyNotes: boolean().optional(),
		indexMemoryRoot: boolean().optional(),
		followMemoryEvents: boolean().optional()
	}).optional(),
	unsafeLocal: strictObject({
		allowPrivateMemoryCoreAccess: boolean().optional(),
		paths: array(string()).optional()
	}).optional(),
	ingest: strictObject({
		autoCompile: boolean().optional(),
		maxConcurrentJobs: number().int().min(1).optional(),
		allowUrlIngest: boolean().optional()
	}).optional(),
	search: strictObject({
		backend: _enum(WIKI_SEARCH_BACKENDS).optional(),
		corpus: _enum(WIKI_SEARCH_CORPORA).optional()
	}).optional(),
	context: strictObject({ includeCompiledDigestPrompt: boolean().optional() }).optional(),
	render: strictObject({
		preserveHumanBlocks: boolean().optional(),
		createBacklinks: boolean().optional(),
		createDashboards: boolean().optional()
	}).optional()
}).superRefine((value, ctx) => {
	if (value.vault?.scope === "agent" && value.vaultMode === "unsafe-local") ctx.addIssue({
		code: "custom",
		path: ["vaultMode"],
		message: "vaultMode=unsafe-local cannot be combined with vault.scope=agent"
	});
	if (value.vault?.scope === "agent" && value.obsidian?.useOfficialCli === true) ctx.addIssue({
		code: "custom",
		path: ["obsidian", "useOfficialCli"],
		message: "obsidian.useOfficialCli cannot be enabled with vault.scope=agent"
	});
});
function expandHomePath(inputPath, homedir) {
	if (inputPath === "~") return homedir;
	if (inputPath.startsWith("~/")) return path.join(homedir, inputPath.slice(2));
	return inputPath;
}
function resolveMemoryWikiConfig(config, options) {
	const homedir = options?.homedir ?? os.homedir();
	const parsed = config ? MemoryWikiConfigSource.safeParse(config) : null;
	const safeConfig = parsed?.success ? parsed.data : config ?? {};
	const vaultScope = safeConfig.vault?.scope ?? DEFAULT_WIKI_VAULT_SCOPE;
	const vaultPath = safeConfig.vault?.path ?? path.join(resolveStateDir({
		...options?.env ?? process.env,
		HOME: homedir
	}), "wiki", ...vaultScope === "agent" ? [] : ["main"]);
	return {
		vaultMode: safeConfig.vaultMode ?? DEFAULT_WIKI_VAULT_MODE,
		vault: {
			scope: vaultScope,
			path: expandHomePath(vaultPath, homedir),
			renderMode: safeConfig.vault?.renderMode ?? DEFAULT_WIKI_RENDER_MODE
		},
		obsidian: {
			enabled: safeConfig.obsidian?.enabled ?? false,
			useOfficialCli: safeConfig.obsidian?.useOfficialCli ?? false,
			...safeConfig.obsidian?.vaultName ? { vaultName: safeConfig.obsidian.vaultName } : {},
			openAfterWrites: safeConfig.obsidian?.openAfterWrites ?? false
		},
		bridge: {
			enabled: safeConfig.bridge?.enabled ?? false,
			readMemoryArtifacts: safeConfig.bridge?.readMemoryArtifacts ?? true,
			indexDreamReports: safeConfig.bridge?.indexDreamReports ?? true,
			indexDailyNotes: safeConfig.bridge?.indexDailyNotes ?? true,
			indexMemoryRoot: safeConfig.bridge?.indexMemoryRoot ?? true,
			followMemoryEvents: safeConfig.bridge?.followMemoryEvents ?? true
		},
		unsafeLocal: {
			allowPrivateMemoryCoreAccess: safeConfig.unsafeLocal?.allowPrivateMemoryCoreAccess ?? false,
			paths: safeConfig.unsafeLocal?.paths ?? []
		},
		ingest: {
			autoCompile: safeConfig.ingest?.autoCompile ?? true,
			maxConcurrentJobs: safeConfig.ingest?.maxConcurrentJobs ?? 1,
			allowUrlIngest: safeConfig.ingest?.allowUrlIngest ?? true
		},
		search: {
			backend: safeConfig.search?.backend ?? DEFAULT_WIKI_SEARCH_BACKEND,
			corpus: safeConfig.search?.corpus ?? DEFAULT_WIKI_SEARCH_CORPUS
		},
		context: { includeCompiledDigestPrompt: safeConfig.context?.includeCompiledDigestPrompt ?? false },
		render: {
			preserveHumanBlocks: safeConfig.render?.preserveHumanBlocks ?? true,
			createBacklinks: safeConfig.render?.createBacklinks ?? true,
			createDashboards: safeConfig.render?.createDashboards ?? true
		}
	};
}
function resolveMemoryWikiConfiguredAgentIds(appConfig) {
	const ids = (appConfig?.agents?.entries ? Object.keys(appConfig.agents.entries) : (appConfig?.agents?.list ?? []).map((entry) => entry.id)).flatMap((entryId) => {
		const rawId = entryId.trim();
		if (!rawId) return [];
		return [resolveSessionAgentIdStrict({
			config: appConfig,
			agentId: rawId
		})];
	});
	return [...new Set(ids.length > 0 ? ids : [resolveDefaultAgentId(appConfig ?? {})])];
}
/** Resolve the exact vault for one trusted runtime agent context. */
function resolveMemoryWikiAgentConfig(params) {
	if (params.config.vault.scope === "global") return params.config;
	if (params.config.vaultMode === "unsafe-local") throw new Error("memory-wiki vault.scope=agent does not support vaultMode=unsafe-local.");
	const configuredAgentIds = resolveMemoryWikiConfiguredAgentIds(params.appConfig);
	const requestedAgentId = params.agentId?.trim();
	if (!requestedAgentId && configuredAgentIds.length > 1) throw new Error("agentId is required for memory-wiki when vault.scope=agent.");
	const agentId = resolveSessionAgentIdStrict({
		config: params.appConfig,
		agentId: requestedAgentId ?? resolveDefaultAgentId(params.appConfig ?? {})
	});
	if (!configuredAgentIds.includes(agentId)) throw new Error(`Unknown memory-wiki agentId: ${requestedAgentId ?? agentId}.`);
	return {
		...params.config,
		agentId,
		vault: {
			...params.config.vault,
			path: path.join(params.config.vault.path, agentId)
		}
	};
}
//#endregion
export { resolveMemoryWikiConfig as a, resolveMemoryWikiAgentConfig as i, WIKI_SEARCH_BACKENDS as n, resolveMemoryWikiConfiguredAgentIds as o, WIKI_SEARCH_CORPORA as r, MemoryWikiConfigSource as t };
