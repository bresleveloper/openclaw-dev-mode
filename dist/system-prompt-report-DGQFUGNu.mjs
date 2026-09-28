import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
//#region src/agents/system-prompt-report.ts
/**
* System prompt report builder.
*
* Session metadata uses this report to account for prompt size, bootstrap file
* injection, skills, and tool schema footprint without storing raw prompt text.
*/
const toolSummaryHashCache = /* @__PURE__ */ new Map();
const MAX_TOOL_SUMMARY_HASHES = 512;
const MAX_CACHED_TOOL_SUMMARY_CHARS = 4096;
const toolSchemaStatsCache = /* @__PURE__ */ new WeakMap();
function parseSkillBlocks(skillsPrompt) {
	const prompt = skillsPrompt.trim();
	if (!prompt) return [];
	return Array.from(prompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi), (match) => {
		const block = match[0];
		return {
			name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
			blockChars: block.length
		};
	});
}
function buildToolSchemaStats(parameters) {
	if (!parameters || typeof parameters !== "object") return {
		schemaChars: 0,
		schemaHash: sha256Hex(""),
		propertiesCount: null
	};
	const cached = toolSchemaStatsCache.get(parameters);
	if (cached) return cached;
	let schemaJson;
	try {
		schemaJson = JSON.stringify(parameters);
	} catch {
		schemaJson = "";
	}
	const stats = {
		schemaChars: schemaJson.length,
		schemaHash: sha256Hex(schemaJson),
		propertiesCount: (() => {
			const schema = parameters;
			const props = typeof schema.properties === "object" ? schema.properties : null;
			if (!props || typeof props !== "object") return null;
			return Object.keys(props).length;
		})()
	};
	toolSchemaStatsCache.set(parameters, stats);
	return stats;
}
function resolveSummaryHash(summary) {
	if (summary.length > MAX_CACHED_TOOL_SUMMARY_CHARS) return sha256Hex(summary);
	const cached = toolSummaryHashCache.get(summary);
	if (cached !== void 0) return cached;
	const hash = sha256Hex(summary);
	toolSummaryHashCache.set(summary, hash);
	pruneMapToMaxSize(toolSummaryHashCache, MAX_TOOL_SUMMARY_HASHES);
	return hash;
}
function buildToolsEntries(tools) {
	return tools.map((tool) => {
		const name = tool.name;
		const summary = tool.description?.trim() || tool.label?.trim() || "";
		const summaryChars = summary.length;
		const schemaStats = buildToolSchemaStats(tool.parameters);
		return {
			name,
			summaryChars,
			summaryHash: resolveSummaryHash(summary),
			...schemaStats
		};
	});
}
function measureRenderedProjectContextChars(systemPrompt) {
	const start = systemPrompt.indexOf("\n# Project Context\n");
	if (start === -1) return 0;
	const end = systemPrompt.indexOf("\n## Silent Replies\n", start + 19);
	return (end === -1 ? systemPrompt.length : end) - start;
}
/** Builds the stored report for a rendered system prompt and its inputs. */
function buildSystemPromptReport(params) {
	const systemPromptChars = params.systemPrompt.length;
	const projectContextChars = measureRenderedProjectContextChars(params.systemPrompt);
	const toolsEntries = buildToolsEntries(params.tools);
	const toolsSchemaChars = toolsEntries.reduce((sum, t) => sum + (t.schemaChars ?? 0), 0);
	const skillsEntries = parseSkillBlocks(params.skillsPrompt);
	return {
		source: params.source,
		generatedAt: params.generatedAt,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		provider: params.provider,
		model: params.model,
		workspaceDir: params.workspaceDir,
		bootstrapMaxChars: params.bootstrapMaxChars,
		bootstrapTotalMaxChars: params.bootstrapTotalMaxChars,
		...params.bootstrapTruncation ? { bootstrapTruncation: params.bootstrapTruncation } : {},
		sandbox: params.sandbox,
		systemPrompt: {
			chars: systemPromptChars,
			hash: sha256Hex(params.systemPrompt),
			projectContextChars,
			nonProjectContextChars: Math.max(0, systemPromptChars - projectContextChars)
		},
		...params.currentTurn ? { currentTurn: params.currentTurn } : {},
		injectedWorkspaceFiles: params.injectedWorkspaceFiles,
		skills: {
			promptChars: params.skillsPrompt.length,
			hash: sha256Hex(params.skillsPrompt),
			entries: skillsEntries
		},
		tools: {
			listChars: 0,
			schemaChars: toolsSchemaChars,
			entries: toolsEntries
		}
	};
}
//#endregion
export { buildSystemPromptReport as t };
