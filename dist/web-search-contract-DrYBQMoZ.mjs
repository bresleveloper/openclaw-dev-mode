//#region extensions/ollama/src/web-search-contract.ts
const OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION = "Search the web using Ollama's web search API. Returns titles, URLs, and snippets from the configured Ollama host.";
const OLLAMA_WEB_SEARCH_TOOL_PARAMETERS = {
	type: "object",
	properties: {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		}
	},
	required: ["query"],
	additionalProperties: false
};
//#endregion
export { OLLAMA_WEB_SEARCH_TOOL_PARAMETERS as n, OLLAMA_WEB_SEARCH_TOOL_DESCRIPTION as t };
