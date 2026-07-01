import { r as buildBootstrapInjectionStats } from "./bootstrap-budget-DFC5I5_X.js";
import { createHash } from "node:crypto";
//#region src/agents/system-prompt-report.ts
/**
* System prompt report builder.
*
* Session metadata uses this report to account for prompt size, bootstrap file
* injection, skills, and tool schema footprint without storing raw prompt text.
*/
const toolReportEntryCache = /* @__PURE__ */ new WeakMap();
const toolSchemaStatsCache = /* @__PURE__ */ new WeakMap();
function sha256(input) {
	return createHash("sha256").update(input).digest("hex");
}
function extractBetween(input, startMarker, endMarker) {
	const start = input.indexOf(startMarker);
	if (start === -1) return "";
	const end = input.indexOf(endMarker, start + startMarker.length);
	return end === -1 ? input.slice(start) : input.slice(start, end);
}
function parseSkillBlocks(skillsPrompt) {
	const prompt = skillsPrompt.trim();
	if (!prompt) return [];
	return Array.from(prompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi)).map((match) => match[0] ?? "").map((block) => {
		return {
			name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
			blockChars: block.length
		};
	}).filter((b) => b.blockChars > 0);
}
function buildToolSchemaStats(parameters) {
	if (!parameters || typeof parameters !== "object") return {
		schemaChars: 0,
		schemaHash: sha256(""),
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
		schemaHash: sha256(schemaJson),
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
function buildToolsEntries(tools) {
	return tools.map((tool) => {
		const cached = toolReportEntryCache.get(tool);
		if (cached) return cached;
		const name = tool.name;
		const summary = tool.description?.trim() || tool.label?.trim() || "";
		const summaryChars = summary.length;
		const schemaStats = buildToolSchemaStats(tool.parameters);
		const entry = {
			name,
			summaryChars,
			summaryHash: sha256(summary),
			...schemaStats
		};
		toolReportEntryCache.set(tool, entry);
		return entry;
	});
}
function measureRenderedProjectContextChars(systemPrompt) {
	return extractBetween(systemPrompt, "\n# Project Context\n", "\n## Silent Replies\n").length;
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
			hash: sha256(params.systemPrompt),
			projectContextChars,
			nonProjectContextChars: Math.max(0, systemPromptChars - projectContextChars)
		},
		...params.currentTurn ? { currentTurn: params.currentTurn } : {},
		injectedWorkspaceFiles: buildBootstrapInjectionStats({
			bootstrapFiles: params.bootstrapFiles,
			injectedFiles: params.injectedFiles
		}),
		skills: {
			promptChars: params.skillsPrompt.length,
			hash: sha256(params.skillsPrompt),
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
