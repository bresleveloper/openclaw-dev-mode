//#region src/auto-reply/reply/context-text.ts
/** Resolves normalized text for slash/bang command parsing. */
function resolveCommandContextText(ctx) {
	return ctx.commandText.trim();
}
/** Checks whether the inbound context carries an explicit command prefix. */
function hasExplicitCommandContextText(ctx) {
	const text = resolveCommandContextText(ctx);
	return text.startsWith("/") || text.startsWith("!");
}
//#endregion
export { resolveCommandContextText as n, hasExplicitCommandContextText as t };
