import { h as buildCodexNativeWebSearchThreadConfig } from "./thread-requests-BMazAevT.mjs";
import { runBoundedCodexAppServerTurn } from "./bounded-turn-DwSU7K39.mjs";
import { n as readCodexWebSearchResults, t as projectCodexWebSearchItem } from "./web-search-item-Bdzc0S8B.mjs";
import { externalContentStamp, readStringParam, resolveSearchTimeoutSeconds, wrapWebContent } from "openclaw/plugin-sdk/provider-web-search";
// extensions/codex/src/web-search-provider.runtime.ts
async function executeCodexWebSearchProviderTool(ctx, args, executionContext, options) {
	const query = readStringParam(args, "query", { required: true });
	const start = Date.now();
	const selected = executionContext?.modelSelection?.provider === "openai" ? executionContext.modelSelection : void 0;
	const result = await runBoundedCodexAppServerTurn({
		config: ctx.config,
		model: selected ? {
			mode: "required",
			id: selected.model
		} : { mode: "live-default" },
		profile: selected?.authProfileId,
		modelProvider: "openai",
		timeoutMs: resolveSearchTimeoutSeconds(ctx.searchConfig) * 1e3,
		signal: executionContext?.signal,
		assertCurrent: executionContext?.assertCurrent,
		agentDir: ctx.agentDir,
		options,
		taskLabel: "native search",
		developerInstructions: "You are OpenClaw's bounded web-search worker. You must use Codex native web.run search to answer the user's search query. Return a concise grounded answer with source URLs. Do not call other tools, edit files, or ask follow-up questions.",
		input: [{
			type: "text",
			text: query,
			text_elements: []
		}],
		requiredModalities: ["text"],
		isolation: "private-stdio",
		threadConfig: buildCodexNativeWebSearchThreadConfig(ctx.config, true)
	});
	const searches = result.items.filter((item) => item.type === "webSearch").map(projectCodexWebSearchItem);
	if (searches.length === 0) throw new Error("Codex native search completed without invoking web search.");
	const citations = [...new Map(result.items.filter((item) => item.type === "webSearch").flatMap(readCodexWebSearchResults).map((citation) => [citation.url, citation])).values()];
	return {
		kind: "answer",
		query,
		provider: "codex",
		model: result.model,
		tookMs: Date.now() - start,
		externalContent: externalContentStamp("codex"),
		content: wrapWebContent(result.text, "web_search"),
		searches,
		citations
	};
}
export { executeCodexWebSearchProviderTool };
