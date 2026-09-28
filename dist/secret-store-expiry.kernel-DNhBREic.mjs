import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { d as isMissingSecretStoreTableError, i as classifyHiddenGitHubStoreName, n as GITHUB_SETUP_HANDOFF_MAX_AGE_MS, t as GITHUB_DEVICE_STORE_MAX_AGE_MS } from "./secret-store-hidden-github-B2SEsxSq.mjs";
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
export { purgeExpiredSecretStoreEntriesInDatabase as n, captureSecretStoreExpiryCutoffs as t };
