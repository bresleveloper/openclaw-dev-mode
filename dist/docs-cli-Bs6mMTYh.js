import { m as theme, p as isRich } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime } from "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import { t as formatCliCommand } from "./command-format-BTnLVWI8.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import { t as runCommandWithTimeout } from "./exec-9-lXnoNH.js";
import "./host-env-security-BnQcDbLl.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import { f as hasBinary } from "./frontmatter-BXR2CPEl.js";
import "./env-overrides-0y0M3S6P.js";
import "./path-alias-guards-CNI693yM.js";
import "./skills-BNw7KbKP.js";
import "./redact-DWAErDjv.js";
import "./errors-LFbAe3gQ.js";
import { t as formatDocsLink } from "./links-CPpbuTOP.js";
import { n as runCommandWithRuntime } from "./cli-utils-BQZi5I0U.js";
//#region src/commands/docs.ts
const SEARCH_TOOL = "https://docs.openclaw.ai/mcp.SearchOpenClaw";
const SEARCH_TIMEOUT_MS = 3e4;
const DEFAULT_SNIPPET_MAX = 220;
function resolveNodeRunner() {
	if (hasBinary("pnpm")) return {
		cmd: "pnpm",
		args: ["dlx"]
	};
	if (hasBinary("npx")) return {
		cmd: "npx",
		args: ["-y"]
	};
	throw new Error("Missing pnpm or npx; install a Node package runner.");
}
async function runNodeTool(tool, toolArgs, options = {}) {
	const runner = resolveNodeRunner();
	return await runCommandWithTimeout([
		runner.cmd,
		...runner.args,
		tool,
		...toolArgs
	], {
		timeoutMs: options.timeoutMs ?? SEARCH_TIMEOUT_MS,
		input: options.input
	});
}
async function runTool(tool, toolArgs, options = {}) {
	if (hasBinary(tool)) return await runCommandWithTimeout([tool, ...toolArgs], {
		timeoutMs: options.timeoutMs ?? SEARCH_TIMEOUT_MS,
		input: options.input
	});
	return await runNodeTool(tool, toolArgs, options);
}
function extractLine(lines, prefix) {
	const line = lines.find((value) => value.startsWith(prefix));
	if (!line) return;
	return line.slice(prefix.length).trim();
}
function normalizeSnippet(raw, fallback) {
	const cleaned = (raw && raw.trim().length > 0 ? raw : fallback).replace(/\s+/g, " ").trim();
	if (!cleaned) return "";
	if (cleaned.length <= DEFAULT_SNIPPET_MAX) return cleaned;
	return `${cleaned.slice(0, DEFAULT_SNIPPET_MAX - 3)}...`;
}
function firstParagraph(text) {
	return text.split(/\n\s*\n/).map((chunk) => chunk.trim()).filter(Boolean)[0] ?? "";
}
function parseSearchOutput(raw) {
	const blocks = raw.replace(/\r/g, "").split(/\n(?=Title: )/g).map((chunk) => chunk.trim()).filter(Boolean);
	const results = [];
	for (const block of blocks) {
		const lines = block.split("\n");
		const title = extractLine(lines, "Title:");
		const link = extractLine(lines, "Link:");
		if (!title || !link) continue;
		const content = extractLine(lines, "Content:");
		const contentIndex = lines.findIndex((line) => line.startsWith("Content:"));
		const snippet = normalizeSnippet(content, firstParagraph(contentIndex >= 0 ? lines.slice(contentIndex + 1).join("\n").trim() : ""));
		results.push({
			title,
			link,
			snippet: snippet || void 0
		});
	}
	return results;
}
function escapeMarkdown(text) {
	return text.replace(/[()[\]]/g, "\\$&");
}
function buildMarkdown(query, results) {
	const lines = [`# Docs search: ${escapeMarkdown(query)}`, ""];
	if (results.length === 0) {
		lines.push("_No results._");
		return lines.join("\n");
	}
	for (const item of results) {
		const title = escapeMarkdown(item.title);
		const snippet = item.snippet ? escapeMarkdown(item.snippet) : "";
		const suffix = snippet ? ` - ${snippet}` : "";
		lines.push(`- [${title}](${item.link})${suffix}`);
	}
	return lines.join("\n");
}
function formatLinkLabel(link) {
	return link.replace(/^https?:\/\//i, "");
}
function renderRichResults(query, results, runtime) {
	runtime.log(`${theme.heading("Docs search:")} ${theme.info(query)}`);
	if (results.length === 0) {
		runtime.log(theme.muted("No results."));
		return;
	}
	for (const item of results) {
		const linkLabel = formatLinkLabel(item.link);
		const link = formatDocsLink(item.link, linkLabel);
		runtime.log(`${theme.muted("-")} ${theme.command(item.title)} ${theme.muted("(")}${link}${theme.muted(")")}`);
		if (item.snippet) runtime.log(`  ${theme.muted(item.snippet)}`);
	}
}
async function renderMarkdown(markdown, runtime) {
	runtime.log(markdown.trimEnd());
}
async function docsSearchCommand(queryParts, runtime) {
	const query = queryParts.join(" ").trim();
	if (!query) {
		const docs = formatDocsLink("/", "docs.openclaw.ai");
		if (isRich()) {
			runtime.log(`${theme.muted("Docs:")} ${docs}`);
			runtime.log(`${theme.muted("Search:")} ${formatCliCommand("openclaw docs \"your query\"")}`);
		} else {
			runtime.log("Docs: https://docs.openclaw.ai/");
			runtime.log(`Search: ${formatCliCommand("openclaw docs \"your query\"")}`);
		}
		return;
	}
	const res = await runTool("mcporter", [
		"call",
		SEARCH_TOOL,
		"--args",
		JSON.stringify({ query }),
		"--output",
		"text"
	], { timeoutMs: SEARCH_TIMEOUT_MS });
	if (res.code !== 0) {
		const err = res.stderr.trim() || res.stdout.trim() || `exit ${res.code}`;
		runtime.error(`Docs search failed: ${err}`);
		runtime.exit(1);
		return;
	}
	const results = parseSearchOutput(res.stdout);
	if (isRich()) {
		renderRichResults(query, results, runtime);
		return;
	}
	await renderMarkdown(buildMarkdown(query, results), runtime);
}
//#endregion
//#region src/cli/docs-cli.ts
function registerDocsCli(program) {
	program.command("docs").description("Search the live OpenClaw docs").argument("[query...]", "Search query").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/docs", "docs.openclaw.ai/cli/docs")}\n`).action(async (queryParts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await docsSearchCommand(queryParts, defaultRuntime);
		});
	});
}
//#endregion
export { registerDocsCli };
