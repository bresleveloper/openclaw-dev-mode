import { s as raceWithTimeout } from "./src-D1BHGNTj.mjs";
//#region src/shared/settle-within.ts
/** A deadline bounds waiting; fulfillment alone does not certify resource cleanup. */
async function settlesWithin(promise, timeoutMs) {
	return await raceWithTimeout(promise.then(() => true), timeoutMs, () => false, { ref: false });
}
//#endregion
export { settlesWithin as t };
