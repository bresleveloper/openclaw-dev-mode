//#region src/auto-reply/reply/acp-elicitation-handler-lazy.ts
/** Defers the structured-input stack while preserving one exact handler per turn. */
function createLazyAcpElicitationHandler(params) {
	let handler;
	return async (request, context) => {
		handler ??= import("./acp-elicitation-handler-HdtheeJw.mjs").then(({ createAcpElicitationHandler }) => createAcpElicitationHandler(params));
		return (await handler)(request, context);
	};
}
//#endregion
export { createLazyAcpElicitationHandler as t };
