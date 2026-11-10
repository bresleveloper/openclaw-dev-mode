import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/net/fetch-request-authority.ts
const requestAuthority = resolveGlobalSingleton(Symbol.for("openclaw.guardedFetchRequestAuthority"), () => new AsyncLocalStorage());
/** Capture before transport preparation so redirects retain the original caller. */
function captureGuardedFetchRequestAuthority() {
	const authority = requestAuthority.getStore();
	return authority ? () => {
		authority.assertCurrent();
		authority.beforeRequest();
	} : void 0;
}
function invokeSynchronousGuard(guard) {
	const result = guard?.();
	if (isPromiseLike(result)) {
		Promise.resolve(result).catch(() => void 0);
		throw new TypeError("Guarded request authority must be synchronous.");
	}
}
/** Carry a host-owned assertion through provider preparation without granting new authority. */
async function withGuardedFetchRequestAuthority(assertCurrent, run, beforeRequest) {
	const inherited = requestAuthority.getStore();
	if (!assertCurrent && !beforeRequest && !inherited) return await run(void 0);
	let active = true;
	const assertAuthority = () => {
		inherited?.assertCurrent();
		if (!active) throw new Error("Guarded request authority is no longer active.");
		invokeSynchronousGuard(assertCurrent);
	};
	try {
		assertAuthority();
		return await requestAuthority.run({
			assertCurrent: assertAuthority,
			beforeRequest: () => {
				inherited?.beforeRequest();
				invokeSynchronousGuard(beforeRequest);
			}
		}, () => run(assertAuthority));
	} finally {
		active = false;
	}
}
//#endregion
export { withGuardedFetchRequestAuthority as n, captureGuardedFetchRequestAuthority as t };
