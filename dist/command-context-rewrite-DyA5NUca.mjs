//#region src/auto-reply/reply/command-context-rewrite.ts
/** Keep every inbound-text projection aligned when command sugar becomes a normal agent turn. */
function applyCommandTextToContext(ctx, text) {
	const mutableCtx = ctx;
	mutableCtx.commandText = text;
	mutableCtx.agentText = text;
	mutableCtx.rawText = text;
	mutableCtx.Body = text;
	mutableCtx.RawBody = text;
	mutableCtx.CommandBody = text;
	mutableCtx.BodyForCommands = text;
	mutableCtx.BodyForAgent = text;
	mutableCtx.BodyStripped = text;
}
function applyCommandTextToParams(params, text) {
	applyCommandTextToContext(params.ctx, text);
	if (params.rootCtx && params.rootCtx !== params.ctx) applyCommandTextToContext(params.rootCtx, text);
	params.command.rawBodyNormalized = text;
	params.command.commandBodyNormalized = text;
}
//#endregion
export { applyCommandTextToParams as n, applyCommandTextToContext as t };
