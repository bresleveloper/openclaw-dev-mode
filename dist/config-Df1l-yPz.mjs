import { t as resolveCanonicalConfiguredSecretInputString } from "./resolve-configured-secret-input-string-VGELFJX8.mjs";
//#region src/infra/database-engine/config.ts
/** Resolve on the host; the existing broker input transport keeps credentials out of config/logs. */
async function resolveDatabaseEngineInput(config) {
	if (config.database?.engine !== "postgres") return;
	const { value, unresolvedRefReason } = await resolveCanonicalConfiguredSecretInputString({
		config,
		env: process.env,
		value: config.database.postgres?.connection,
		path: "database.postgres.connection"
	});
	if (!value) throw new Error(`${unresolvedRefReason ?? "database.engine postgres requires database.postgres.connection."} Configure a resolvable PostgreSQL DSN (prefer a SecretRef).`);
	return {
		connection: value,
		schemaPrefix: config.database.postgres?.schemaPrefix ?? "openclaw"
	};
}
//#endregion
export { resolveDatabaseEngineInput as t };
