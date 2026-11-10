//#region src/agents/content-blocks.ts
function isTextContentBlock(block) {
	if (!block || typeof block !== "object") return false;
	const rec = block;
	return rec.type === "text" && typeof rec.text === "string";
}
function collectTextContentBlocks(content) {
	if (!Array.isArray(content)) return [];
	return content.filter(isTextContentBlock).map((block) => block.text);
}
//#endregion
export { isTextContentBlock as n, collectTextContentBlocks as t };
