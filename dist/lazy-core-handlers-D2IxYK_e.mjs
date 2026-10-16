//#region src/gateway/server-methods/lazy-core-handlers.ts
const preparations = /* @__PURE__ */ new WeakMap();
/** Resolve forwarding wrappers without mistaking them for actual handler entry. */
async function prepareGatewayRequestHandler(handler, entry, options) {
	let preparedHandler = handler;
	let prepare = preparations.get(preparedHandler);
	while (prepare) {
		entry?.assertOpen();
		preparedHandler = await prepare();
		prepare = preparations.get(preparedHandler);
	}
	if (options?.prepareDispatchCurrent) await options.prepareDispatchCurrent();
	return preparedHandler;
}
function createLazyCoreHandlers(params) {
	return Object.fromEntries(params.methods.map((method) => {
		const forwarding = async (opts) => {
			const entry = opts.context.requestEntryLifetime?.enter(opts);
			try {
				const handler = await prepareGatewayRequestHandler(forwarding, entry);
				entry?.assertOpen();
				entry?.release();
				await handler(opts);
			} finally {
				entry?.release();
			}
		};
		preparations.set(forwarding, async () => {
			const handler = (await params.loadHandlers())[method];
			if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
			return handler;
		});
		return [method, forwarding];
	}));
}
//#endregion
export { prepareGatewayRequestHandler as n, createLazyCoreHandlers as t };
