//#region src/gateway/session-mutation-authorization-error.ts
var SessionMutationAuthorizationChangedError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = "SessionMutationAuthorizationChangedError";
		this.error = error;
	}
};
var SessionSharingProfileFactsChangedError = class extends SessionMutationAuthorizationChangedError {
	constructor(error, readSource) {
		super(error);
		this.readSource = readSource;
	}
};
//#endregion
export { SessionSharingProfileFactsChangedError as n, SessionMutationAuthorizationChangedError as t };
