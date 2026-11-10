import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/gateway/session-row-projection-binding.ts
const SessionRowProjectionBinding = resolveGlobalSingleton(Symbol.for("openclaw.sessionRowProjectionBinding"), () => class {
	constructor(owner, readCommittedEntry) {
		this.owner = owner;
		this.readCommittedEntry = readCommittedEntry;
	}
});
//#endregion
export { SessionRowProjectionBinding as t };
