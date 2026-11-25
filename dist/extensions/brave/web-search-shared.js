// extensions/brave/web-search-shared.ts
function resolveBraveMode(brave) {
	return brave?.mode === "llm-context" ? "llm-context" : "web";
}
export { resolveBraveMode };
