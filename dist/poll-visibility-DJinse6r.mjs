//#region extensions/telegram/src/poll-visibility.ts
function resolveTelegramPollVisibility(params) {
	if (params.pollAnonymous && params.pollPublic) throw new Error("pollAnonymous and pollPublic are mutually exclusive");
	return params.pollAnonymous ? true : params.pollPublic ? false : void 0;
}
//#endregion
export { resolveTelegramPollVisibility as t };
