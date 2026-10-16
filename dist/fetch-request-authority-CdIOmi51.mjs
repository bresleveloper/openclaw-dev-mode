import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/net/fetch-request-authority.ts
const requestAuthority = resolveGlobalSingleton(Symbol.for("openclaw.guardedFetchRequestAuthority"), () => new AsyncLocalStorage());
/** Capture before transport preparation so redirects retain the original caller. */
function captureGuardedFetchRequestAuthority() {
	return requestAuthority.getStore();
}
/** Carry a host-owned assertion through provider preparation without granting new authority. */
async function withGuardedFetchRequestAuthority(assertCurrent, run) {
	const inherited = requestAuthority.getStore();
	if (!assertCurrent && !inherited) return await run(void 0);
	let active = true;
	const assertAuthority = () => {
		inherited?.();
		if (!active) throw new Error("Guarded request authority is no longer active.");
		const result = assertCurrent?.();
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => void 0);
			throw new TypeError("Guarded request authority must be synchronous.");
		}
	};
	try {
		assertAuthority();
		return await requestAuthority.run(assertAuthority, () => run(assertAuthority));
	} finally {
		active = false;
	}
}
//#endregion
export { withGuardedFetchRequestAuthority as n, captureGuardedFetchRequestAuthority as t };
