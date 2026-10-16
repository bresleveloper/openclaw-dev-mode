import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as SecretStoreValidationError, t as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { l as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { d as isMissingSecretStoreTableError, i as classifyHiddenGitHubStoreName, n as GITHUB_SETUP_HANDOFF_MAX_AGE_MS, t as GITHUB_DEVICE_STORE_MAX_AGE_MS } from "./secret-store-hidden-github-D9HzXdxU.mjs";
//#region src/secrets/store/secret-store-expiry.kernel.ts
const SECRET_STORE_RETENTION_MS = 2592e6;
function captureSecretStoreExpiryCutoffs() {
	return {
		threshold: Date.now() - SECRET_STORE_RETENTION_MS,
		handoffThreshold: Date.now() - GITHUB_SETUP_HANDOFF_MAX_AGE_MS,
		deviceThreshold: Date.now() - GITHUB_DEVICE_STORE_MAX_AGE_MS
	};
}
function purgeExpiredSecretStoreEntriesInDatabase(cutoffs, databaseOptions) {
	const state = openOpenClawStateDatabase(databaseOptions);
	const { threshold, handoffThreshold, deviceThreshold } = cutoffs;
	try {
		return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const deleted = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("deleted_at_ms", "is not", null).where("deleted_at_ms", "<", threshold));
			const hiddenRows = executeSqliteQuerySync(sqlite, db.selectFrom("secret_store_entries").select([
				"scope_kind",
				"scope_id",
				"name",
				"created_at_ms"
			]).where((eb) => eb.or([eb("name", ">=", "github-device-").and("name", "<", "github-device."), eb("name", ">=", "github-setup-").and("name", "<", "github-setup.")])).where("deleted_at_ms", "is", null).where("created_at_ms", "<=", Math.max(handoffThreshold, deviceThreshold))).rows.filter((row) => {
				const kind = classifyHiddenGitHubStoreName(row.name);
				const createdAtMs = normalizeSqliteNumber(row.created_at_ms);
				return createdAtMs !== void 0 && (kind === "setup" && createdAtMs < handoffThreshold || kind === "device" && createdAtMs <= deviceThreshold);
			});
			let expiredHidden = 0;
			for (const row of hiddenRows) {
				const result = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", row.scope_kind).where("scope_id", "=", row.scope_id).where("name", "=", row.name));
				expiredHidden += Number(result.numAffectedRows ?? 0n);
			}
			return Number(deleted.numAffectedRows ?? 0n) + expiredHidden;
		}, {
			...databaseOptions,
			database: state
		}, { operationLabel: "secrets.store.purge" });
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return 0;
		throw error;
	}
}
//#endregion
//#region src/secrets/store/secret-store-validation.ts
function normalizeScope(_scope) {
	return {
		scopeKind: "team",
		scopeId: ""
	};
}
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertSecretStoreMutationName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name) && classifyHiddenGitHubStoreName(name) !== "setup") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)} or github-setup-<32 lowercase hex characters>.`);
}
function assertSecretStoreValue(value, kind, name) {
	if (isRedactedSecretValue(value)) throw new SecretStoreValidationError("SECRET_STORE_VALUE_REDACTED", `Secret store entry "${name}" contains a redaction placeholder. Supply a real value or leave the field unchanged. Run openclaw doctor --fix to repair a store-backed Gateway token.`);
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (kind === "secret" && value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
function assertSecretStoreWriteShape(value, kind, name, allowedHosts) {
	assertSecretStoreValue(value, kind, name);
	if (kind === "env" && allowedHosts !== void 0) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", "Allowed hosts apply only to secret entries.");
}
function normalizeSecretAllowedHost(raw) {
	try {
		return normalizeExactAllowedHost(raw);
	} catch (error) {
		throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", error instanceof Error ? error.message : `Allowed host "${raw}" is not a valid hostname.`);
	}
}
function normalizeSecretAllowedHosts(hosts) {
	if (hosts.length > 128) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `A secret can allow at most 128 hosts.`);
	return [...new Set(hosts.map(normalizeSecretAllowedHost))].toSorted();
}
function parseSecretAllowedHosts(raw) {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every((host) => typeof host === "string") ? normalizeSecretAllowedHosts(parsed) : [];
	} catch {
		return [];
	}
}
//#endregion
export { normalizeScope as a, captureSecretStoreExpiryCutoffs as c, assertSecretStoreWriteShape as i, purgeExpiredSecretStoreEntriesInDatabase as l, assertSecretStoreMutationName as n, normalizeSecretAllowedHosts as o, assertSecretStoreValue as r, parseSecretAllowedHosts as s, assertSecretStoreEnvName as t };
