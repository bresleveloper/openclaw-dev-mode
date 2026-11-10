//#region src/plugin-sdk/reply-options.ts
/** Event custody is issued by core, never accepted from plugin reply options. */
function publicReplyOptions(options) {
	if (!options) return;
	const publicOptions = { ...options };
	Reflect.deleteProperty(publicOptions, "internalEventExecution");
	Reflect.deleteProperty(publicOptions, "onReplyOperationOwned");
	return publicOptions;
}
function publicChannelTurn(turn) {
	return {
		...turn,
		replyOptions: publicReplyOptions(turn.replyOptions)
	};
}
/** Resolve plugin plans before core attaches its own admission authority. */
function publicChannelTurnParams(params) {
	return {
		...params,
		adapter: {
			...params.adapter,
			resolveTurn: async (...args) => {
				const turn = await params.adapter.resolveTurn(...args);
				if (!("replyOptions" in turn)) return turn;
				return {
					...turn,
					replyOptions: publicReplyOptions(turn.replyOptions)
				};
			}
		}
	};
}
//#endregion
export { publicChannelTurnParams as n, publicReplyOptions as r, publicChannelTurn as t };
