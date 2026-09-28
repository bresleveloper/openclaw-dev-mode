import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { n as isRich, r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { n as parseStrictPositiveIntOption } from "./helpers-BuPKARfv.mjs";
//#region src/commands/docs.ts
const SEARCH_API = "https://docs.openclaw.ai/api/search";
const SEARCH_TIMEOUT_MS = 3e4;
const DOCS_SEARCH_RESPONSE_MAX_BYTES = 8388608;
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
async function fetchDocsSearch(query) {
	const url = new URL(SEARCH_API);
	url.searchParams.set("q", query);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
	try {
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: controller.signal
		});
		if (!response.ok) {
			response.body?.cancel().catch(() => void 0);
			throw new Error(`HTTP ${response.status}`);
		}
		const bytes = await readResponseWithLimit(response, DOCS_SEARCH_RESPONSE_MAX_BYTES, { onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Docs search response exceeds ${maxBytes} bytes`) });
		let payload;
		try {
			payload = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
		} catch (cause) {
			throw new Error("Docs search response is malformed JSON", { cause });
		}
		return parseDocsSearchResults(payload.results);
	} finally {
		clearTimeout(timeout);
		controller.abort();
	}
}
function parseDocsSearchResults(raw) {
	if (!Array.isArray(raw)) throw new Error("Docs search response is malformed: expected results array");
	const results = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const entry = item;
		if (typeof entry.title !== "string" || typeof entry.link !== "string") continue;
		results.push({
			title: entry.title,
			link: entry.link,
			snippet: typeof entry.snippet === "string" && entry.snippet.trim() ? entry.snippet : void 0
		});
	}
	return results;
}
/** Search hosted docs, or print the docs homepage when no query is provided. */
async function docsSearchCommand(queryParts, runtime, options = {}) {
	const query = queryParts.join(" ").trim();
	if (!query) {
		if (options.json) {
			writeRuntimeJson(runtime, {
				query: null,
				url: "https://docs.openclaw.ai/",
				results: []
			});
			return;
		}
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
	let results;
	try {
		results = await fetchDocsSearch(query);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Docs search failed: ${message}`, { cause: error });
	}
	if (options.limit !== void 0) results = results.slice(0, options.limit);
	if (options.json) {
		writeRuntimeJson(runtime, {
			query,
			results
		});
		return;
	}
	if (isRich()) {
		renderRichResults(query, results, runtime);
		return;
	}
	await renderMarkdown(buildMarkdown(query, results), runtime);
}
//#endregion
//#region src/cli/docs-cli.ts
function registerDocsCli(program) {
	program.command("docs").description("Search the live OpenClaw docs").argument("[query...]", "Search query").option("--json", "Output JSON", false).option("--limit <count>", "Maximum results to return", (value) => parseStrictPositiveIntOption(value, "--limit")).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/docs", "docs.openclaw.ai/cli/docs")}\n`).action(async (queryParts, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await docsSearchCommand(queryParts, defaultRuntime, {
				json: Boolean(opts.json),
				limit: opts.limit
			});
		});
	});
}
//#endregion
export { registerDocsCli };
