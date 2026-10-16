//#region src/auto-reply/reply/command-context-rewrite.ts
/** Keep every inbound-text projection aligned when command sugar becomes a normal agent turn. */
function applyCommandTextToContext(ctx, text) {
	ctx.commandText = text;
	ctx.agentText = text;
	ctx.rawText = text;
	ctx.Body = text;
	ctx.RawBody = text;
	ctx.CommandBody = text;
	ctx.BodyForCommands = text;
	ctx.BodyForAgent = text;
	ctx.BodyStripped = text;
}
function applyCommandTextToParams(params, text) {
	applyCommandTextToContext(params.ctx, text);
	if (params.rootCtx && params.rootCtx !== params.ctx) applyCommandTextToContext(params.rootCtx, text);
	params.command.rawBodyNormalized = text;
	params.command.commandBodyNormalized = text;
}
//#endregion
export { applyCommandTextToParams as n, applyCommandTextToContext as t };
