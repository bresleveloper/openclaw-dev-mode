//#region src/agents/content-blocks.ts
function isTextContentBlock(block) {
	if (!block || typeof block !== "object") return false;
	const rec = block;
	return rec.type === "text" && typeof rec.text === "string";
}
/** Collects text block payloads from provider-style structured content arrays. */
function collectTextContentBlocks(content) {
	if (!Array.isArray(content)) return [];
	const parts = [];
	for (const block of content) if (isTextContentBlock(block)) parts.push(block.text);
	return parts;
}
//#endregion
export { isTextContentBlock as n, collectTextContentBlocks as t };
