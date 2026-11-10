import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
//#region src/state/incognito-session-error.ts
const IncognitoSessionEndedError = resolveGlobalSingleton(Symbol.for("openclaw.incognitoSessionEndedError"), () => class IncognitoEndedError extends Error {
	constructor(options) {
		super("Incognito session ended. Create a new incognito session to continue.", options);
		this.code = "INCOGNITO_SESSION_ENDED";
		this.name = "IncognitoSessionEndedError";
	}
});
const IncognitoSessionMissingError = resolveGlobalSingleton(Symbol.for("openclaw.incognitoSessionMissingError"), () => class IncognitoMissingError extends Error {
	constructor() {
		super("No incognito session owner. Create a new incognito session to continue.");
		this.code = "INCOGNITO_SESSION_MISSING";
		this.name = "IncognitoSessionMissingError";
	}
});
/**
* Shared by the host and SDK graphs so legacy adapters retain the actionable refusal.
* @internal Knip production exception; P7d removes this tag when it installs sync refusal preflight.
*/
const IncognitoSessionSyncAccessError = resolveGlobalSingleton(Symbol.for("openclaw.incognitoSessionSyncAccessError"), () => class IncognitoSyncAccessError extends Error {
	constructor(method, replacement) {
		super(`${method} cannot access an incognito session synchronously. Await ${replacement} instead.`);
		this.code = "INCOGNITO_SESSION_SYNC_ACCESS";
		this.name = "IncognitoSessionSyncAccessError";
	}
});
/** An ended actor or unsupported sync access is never an empty or successfully updated session. */
function rethrowIncognitoSessionError(error) {
	if (collectNestedErrorCandidates(error).some((candidate) => candidate instanceof IncognitoSessionMissingError || candidate instanceof IncognitoSessionSyncAccessError || candidate instanceof IncognitoSessionEndedError)) throw error;
}
//#endregion
export { rethrowIncognitoSessionError as i, IncognitoSessionMissingError as n, IncognitoSessionSyncAccessError as r, IncognitoSessionEndedError as t };
