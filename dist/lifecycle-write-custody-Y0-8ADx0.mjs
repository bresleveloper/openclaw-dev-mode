import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
//#region src/infra/lifecycle-write-custody.ts
const owners = resolveGlobalSingleton(Symbol.for("openclaw.lifecycleWriteCustody"), () => /* @__PURE__ */ new Map());
/**
* Records an existing owner's lifetime; this observation grants no write authority.
* Pass the original failure when settling. Uncertain command cleanup retains custody:
* only this handle may release it after independent proof that owned work stopped.
* Without that proof, the fact remains for this process's lifetime, not a timeout.
*/
function beginLifecycleWriteCustody(phase) {
	const owner = owners.get(phase) ?? { count: 0 };
	owner.count++;
	owners.set(phase, owner);
	let released = false;
	return (failure) => {
		if (released || hasCommandProcessCleanupError(failure)) return;
		released = true;
		if (--owner.count === 0) owners.delete(phase);
	};
}
function readLifecycleWriteCustody() {
	return [...owners].toSorted(([left], [right]) => left.localeCompare(right)).map(([phase, { count }]) => ({
		phase,
		count
	}));
}
//#endregion
export { readLifecycleWriteCustody as n, beginLifecycleWriteCustody as t };
