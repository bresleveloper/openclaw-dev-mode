//#region src/shared/provider-auth-result.ts
var ProviderCredentialsSavedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ProviderCredentialsSavedError";
	}
};
/** A provider login committed credentials before its settings write failed. */
var ProviderAuthConfigApplyError = class extends ProviderCredentialsSavedError {
	constructor(cause) {
		super(`Credentials saved, but provider settings could not be applied: ${cause instanceof Error ? cause.message : String(cause)}`, { cause });
		this.name = "ProviderAuthConfigApplyError";
	}
};
//#endregion
export { ProviderCredentialsSavedError as n, ProviderAuthConfigApplyError as t };
