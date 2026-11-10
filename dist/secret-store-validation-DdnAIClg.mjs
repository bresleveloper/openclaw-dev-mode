import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-Bfd9_-Lp.mjs";
import "./types.secrets-Dgbd2kyP.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { a as classifyHiddenGitHubStoreName, n as GITHUB_DEVICE_STORE_MAX_AGE_MS, r as GITHUB_SETUP_HANDOFF_MAX_AGE_MS, t as assertSecretStoreValueLength } from "./secret-store-value-B2wKejcx.mjs";
import { t as withMissingSecretStoreFallback } from "./secret-store-sqlite-Bm3BSwuM.mjs";
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
	const sqlite = state.db;
	const db = getNodeSqliteKysely(sqlite);
	const { threshold, handoffThreshold, deviceThreshold } = cutoffs;
	return withMissingSecretStoreFallback(() => {
		const readExpiry = () => {
			const deleted = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select((eb) => eb.fn.min("deleted_at_ms").as("deletedAtMs")));
			const deletedAtMs = normalizeSqliteNumber(deleted?.deletedAtMs ?? null);
			let nextExpiryAtMs = deletedAtMs === void 0 ? null : deletedAtMs + SECRET_STORE_RETENTION_MS + 1;
			return {
				deletedAtMs,
				expiredHidden: executeSqliteQuerySync(sqlite, db.selectFrom("secret_store_entries").select([
					"scope_kind",
					"scope_id",
					"name",
					"created_at_ms"
				]).where((eb) => eb.or([eb("name", ">=", "github-device-").and("name", "<", "github-device."), eb("name", ">=", "github-setup-").and("name", "<", "github-setup.")])).where("deleted_at_ms", "is", null)).rows.filter((row) => {
					const kind = classifyHiddenGitHubStoreName(row.name);
					const createdAtMs = normalizeSqliteNumber(row.created_at_ms);
					if (createdAtMs === void 0 || kind !== "setup" && kind !== "device") return false;
					const expiry = createdAtMs + (kind === "setup" ? GITHUB_SETUP_HANDOFF_MAX_AGE_MS + 1 : GITHUB_DEVICE_STORE_MAX_AGE_MS);
					nextExpiryAtMs = Math.min(nextExpiryAtMs ?? expiry, expiry);
					return kind === "setup" && createdAtMs < handoffThreshold || kind === "device" && createdAtMs <= deviceThreshold;
				}),
				nextExpiryAtMs
			};
		};
		let expiry = readExpiry();
		let removed = 0;
		if (expiry.deletedAtMs !== void 0 && expiry.deletedAtMs < threshold || expiry.expiredHidden.length > 0) {
			removed = runOpenClawStateWriteTransaction(() => {
				let count = 0;
				if (expiry.deletedAtMs !== void 0 && expiry.deletedAtMs < threshold) {
					const deleted = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("deleted_at_ms", "<", threshold));
					count += Number(deleted.numAffectedRows ?? 0n);
				}
				for (const row of expiry.expiredHidden) {
					const deleted = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", row.scope_kind).where("scope_id", "=", row.scope_id).where("name", "=", row.name).where("created_at_ms", "=", row.created_at_ms).where("deleted_at_ms", "is", null));
					count += Number(deleted.numAffectedRows ?? 0n);
				}
				return count;
			}, {
				...databaseOptions,
				database: state
			}, { operationLabel: "secrets.store.purge" });
			expiry = readExpiry();
		}
		return {
			removed,
			nextExpiryAtMs: expiry.nextExpiryAtMs
		};
	}, {
		removed: 0,
		nextExpiryAtMs: null
	});
}
//#endregion
//#region src/secrets/store/secret-store-validation.ts
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertSecretStoreMutationName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name) && classifyHiddenGitHubStoreName(name) !== "setup") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)} or github-setup-<32 lowercase hex characters>.`);
}
function assertSecretStoreValue(value, kind, name) {
	if (isRedactedSecretValue(value)) throw new SecretStoreValidationError("SECRET_STORE_VALUE_REDACTED", `Secret store entry "${name}" contains a redaction placeholder. Supply a real value or leave the field unchanged. Run openclaw doctor --fix to repair a store-backed Gateway token.`);
	assertSecretStoreValueLength(value, kind);
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
export { normalizeSecretAllowedHosts as a, purgeExpiredSecretStoreEntriesInDatabase as c, assertSecretStoreWriteShape as i, assertSecretStoreMutationName as n, parseSecretAllowedHosts as o, assertSecretStoreValue as r, captureSecretStoreExpiryCutoffs as s, assertSecretStoreEnvName as t };
