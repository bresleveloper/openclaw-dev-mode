//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 65536;
//#endregion
export { SecretStoreValidationError as n, SECRET_STORE_VALUE_MAX_BYTES as t };
