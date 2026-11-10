//#region src/gateway/server-methods/prepared-read.ts
async function withPreparedGatewayRead(handler, options, consume) {
	let read;
	let outcome = "returned";
	try {
		read = handler.prepareRead ? await handler.prepareRead(options) : { run: (respond) => handler({
			...options,
			respond
		}) };
		if (read) await consume(read);
	} catch (error) {
		outcome = "threw";
		if (!handler.onReadError) throw error;
		handler.onReadError(error, options);
	} finally {
		read?.release?.(outcome);
	}
}
/** Direct internal callers and dispatcher readers use the same preparation and cleanup. */
function createPreparedReadHandler(prepareRead, onReadError) {
	const handler = Object.assign(async (options) => withPreparedGatewayRead(handler, options, async (read) => {
		await read.run((...response) => {
			if (response[0]) {
				read.assertCurrent?.();
				read.beforeRespond?.();
			}
			(read.respond ?? options.respond)(...response);
		});
	}), {
		prepareRead,
		onReadError
	});
	return handler;
}
//#endregion
export { withPreparedGatewayRead as n, createPreparedReadHandler as t };
