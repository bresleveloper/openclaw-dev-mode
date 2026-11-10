import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
//#region src/secrets/store/secret-store-sqlite.ts
function withMissingSecretStoreFallback(operation, missing) {
	try {
		return operation();
	} catch (error) {
		if (error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: secret_store_entries") return missing;
		throw error;
	}
}
//#endregion
export { withMissingSecretStoreFallback as t };
