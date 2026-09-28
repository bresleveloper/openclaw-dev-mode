//#region src/gateway/session-mutation-authorization-error.ts
var SessionMutationAuthorizationChangedError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = "SessionMutationAuthorizationChangedError";
		this.error = error;
	}
};
//#endregion
export { SessionMutationAuthorizationChangedError as t };
