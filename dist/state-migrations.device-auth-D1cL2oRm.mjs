import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.mjs";
import { l as resetLegacyDeviceAuthPresenceCache } from "./device-auth-store-DdN7RDpE.mjs";
import { t as withLegacyMigrationStateLock } from "./state-migrations.lock-CC3fInLn.mjs";
import fs from "node:fs";
import path from "node:path";
import { root } from "@openclaw/fs-safe";
//#region src/infra/state-migrations.device-auth.ts
const LEGACY_PATH = "identity/device-auth.json";
/** Detect the retired device-auth store only when an explicit Doctor flow opts in. */
function detectLegacyDeviceAuth(params) {
	const sourcePath = path.join(params.stateDir, LEGACY_PATH);
	const sourcePresent = fs.existsSync(sourcePath);
	return {
		sourcePath,
		sourcePresent,
		hasLegacy: params.doctorOnlyStateMigrations === true && sourcePresent
	};
}
function parseStore(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.deviceId !== "string" || !value.deviceId.trim() || !isRecord(value.tokens)) throw new Error("legacy device-auth store is invalid or unsupported");
	const entries = Object.entries(value.tokens).flatMap(([rawRole, tokenValue]) => {
		const role = normalizeDeviceAuthRole(rawRole);
		if (!role || !isRecord(tokenValue) || typeof tokenValue.token !== "string") return [];
		return [{
			token: tokenValue.token,
			role,
			scopes: normalizeDeviceAuthScopes(Array.isArray(tokenValue.scopes) ? tokenValue.scopes : void 0),
			updatedAtMs: typeof tokenValue.updatedAtMs === "number" && Number.isSafeInteger(tokenValue.updatedAtMs) ? tokenValue.updatedAtMs : 0
		}];
	});
	return {
		deviceId: value.deviceId,
		entries: [...new Map(entries.map((entry) => [entry.role, entry])).values()]
	};
}
function rowIsCanonical(row) {
	try {
		return Array.isArray(JSON.parse(row.scopes_json)) && Number.isSafeInteger(row.updated_at_ms);
	} catch {
		return false;
	}
}
async function importLegacyStore(params) {
	const stateRoot = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: 262144,
		symlinks: "reject"
	});
	const source = await stateRoot.read(LEGACY_PATH, {
		hardlinks: "reject",
		maxBytes: 262144,
		symlinks: "reject"
	});
	const store = parseStore(JSON.parse(source.buffer.toString("utf8")));
	const counts = runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		let imported = 0;
		let preserved = 0;
		for (const entry of store.entries) {
			const query = stateDb.selectFrom("device_auth_tokens").select(["scopes_json", "updated_at_ms"]).where("device_id", "=", store.deviceId).where("role", "=", entry.role);
			const existing = executeSqliteQueryTakeFirstSync(db, query);
			if (existing && rowIsCanonical(existing)) {
				preserved += 1;
				continue;
			}
			executeSqliteQuerySync(db, stateDb.insertInto("device_auth_tokens").values({
				device_id: store.deviceId,
				role: entry.role,
				token: entry.token,
				scopes_json: JSON.stringify(entry.scopes),
				updated_at_ms: entry.updatedAtMs
			}).onConflict((conflict) => conflict.columns(["device_id", "role"]).doUpdateSet({
				token: entry.token,
				scopes_json: JSON.stringify(entry.scopes),
				updated_at_ms: entry.updatedAtMs
			})));
			if (!executeSqliteQueryTakeFirstSync(db, query)) throw new Error("SQLite verification failed for a device-auth token");
			imported += 1;
		}
		return {
			imported,
			preserved
		};
	}, { env: params.env });
	await stateRoot.remove(LEGACY_PATH);
	resetLegacyDeviceAuthPresenceCache(params.env);
	return {
		changes: [`Migrated ${counts.imported} device-auth token${counts.imported === 1 ? "" : "s"} to SQLite.`],
		warnings: [],
		notices: [...counts.preserved > 0 ? [`Preserved ${counts.preserved} canonical SQLite device-auth token${counts.preserved === 1 ? "" : "s"}.`] : [], "Removed retired device-auth JSON after verified SQLite import."]
	};
}
/** Import retired device-auth JSON while excluding Gateways that can rewrite it. */
async function migrateLegacyDeviceAuth(params) {
	if (!params.detected.hasLegacy) return {
		changes: [],
		warnings: []
	};
	return await withLegacyMigrationStateLock({
		stateDir: params.stateDir,
		env: params.env,
		label: "legacy device auth",
		releaseLabel: "Device-auth",
		errorLabel: "Failed migrating legacy device auth",
		run: async (env) => await importLegacyStore({
			...params,
			env
		})
	});
}
//#endregion
export { migrateLegacyDeviceAuth as n, detectLegacyDeviceAuth as t };
