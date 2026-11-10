//#region src/shared/current-read-authority.ts
/** Begin private preparation in the same synchronous frame as the refreshed authority. */
async function withCurrentReadAuthority(authority, consume) {
	const read = () => {
		authority?.assertCurrent?.();
		return consume();
	};
	return await (authority?.withCurrent ? authority.withCurrent(read) : read());
}
/** Keep the first failure while joining every preparation already started by the caller. */
async function settleCurrentReadPreparations(preparations) {
	try {
		return await Promise.all(preparations);
	} catch (error) {
		await Promise.allSettled(preparations);
		throw error;
	}
}
//#endregion
export { withCurrentReadAuthority as n, settleCurrentReadPreparations as t };
