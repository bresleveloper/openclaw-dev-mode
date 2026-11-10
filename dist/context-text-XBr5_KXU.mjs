//#region src/auto-reply/reply/context-text.ts
function resolveCommandContextText(ctx) {
	return ctx.commandText.trim();
}
function hasExplicitCommandContextText(ctx) {
	const text = resolveCommandContextText(ctx);
	return text.startsWith("/") || text.startsWith("!");
}
//#endregion
export { resolveCommandContextText as n, hasExplicitCommandContextText as t };
