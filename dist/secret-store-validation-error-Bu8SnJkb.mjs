//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 65536;
function isSecretStoreValidationCode(value) {
	return value === "SECRET_STORE_INVALID_NAME" || value === "SECRET_STORE_INVALID_ALLOWED_HOST" || value === "SECRET_STORE_VALUE_TOO_LARGE" || value === "SECRET_STORE_VALUE_IN_ARGV" || value === "SECRET_STORE_VALUE_REDACTED" || value === "SECRET_STORE_VALUE_CHANGED" || value === "SECRET_STORE_VALUE_EMPTY";
}
//#endregion
export { SecretStoreValidationError as n, isSecretStoreValidationCode as r, SECRET_STORE_VALUE_MAX_BYTES as t };
