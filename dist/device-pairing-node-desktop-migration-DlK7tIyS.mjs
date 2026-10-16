import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { s as recordLegacyMigrationRun } from "./state-migrations.receipts-gEcgM3Aq.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
import { s as withDevicePairingLock } from "./device-pairing-store-readonly-Dw6Eqbnn.mjs";
import { C as readDevicePairingStoreStateFromDatabase, a as resolveNodePairingGeneration, t as clearNodePairingGenerationState, x as persistDevicePairingStoreState } from "./device-pairing-identity-f0QUXRJo.mjs";
import "./device-pairing-Drmq_Czv.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/device-pairing-node-desktop-migration.ts
const MIGRATION_ID = "node-desktop-stream-pairing-defaults-v1";
/** Also applies to old file-backed surfaces imported after the SQLite migration completed. */
function preserveLegacyDesktopStreamOptOut(device, cfg, now) {
	const commands = cfg.gateway?.nodes?.commands;
	if ([commands?.allow, commands?.deny].some((entries) => entries?.some((command) => command.trim() === "desktop.stream"))) return false;
	const surface = device.nodeSurface;
	if (!Array.isArray(surface?.commands) || !surface.commands.some((command) => typeof command === "string" && command.trim() === "desktop.stream")) return false;
	if (!surface.commands.every((command) => typeof command === "string") || !Number.isSafeInteger(surface.createdAtMs) || !Number.isSafeInteger(surface.approvedAtMs) || !Number.isSafeInteger(surface.approvedAtMs + 1)) throw new Error(`Cannot migrate malformed desktop approval for node ${device.deviceId}`);
	const previousGeneration = resolveNodePairingGeneration(device);
	surface.commands = surface.commands.filter((command) => command.trim() !== NODE_DESKTOP_STREAM_COMMAND);
	surface.approvedAtMs = Math.max(now, surface.approvedAtMs + 1);
	clearNodePairingGenerationState(device, previousGeneration);
	if (device.pendingNodeSurface?.commands?.some((command) => command.trim() === "desktop.stream")) {
		device.pendingNodeSurface.silent = false;
		device.pendingNodeSurface.revision = randomUUID();
	}
	return true;
}
/** Commit narrowed approvals and the once-per-database receipt together before node admission. */
async function migrateLegacyDesktopStreamOptOuts(cfg, baseDir) {
	return await withDevicePairingLock(async () => runOpenClawStateWriteTransaction(({ db }) => {
		const receipt = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_runs").select("status").where("id", "=", MIGRATION_ID));
		if (receipt?.status === "completed") return 0;
		if (receipt) throw new Error("Desktop approval migration receipt is incomplete; existing approvals remain unchanged.");
		const now = Date.now();
		const state = readDevicePairingStoreStateFromDatabase(db);
		let retired = 0;
		for (const device of Object.values(state.pairedByDeviceId)) if (preserveLegacyDesktopStreamOptOut(device, cfg, now)) retired += 1;
		if (retired > 0) persistDevicePairingStoreState(state, baseDir, "paired");
		recordLegacyMigrationRun(db, {
			runId: MIGRATION_ID,
			startedAt: now,
			finishedAt: now,
			status: "completed",
			reportJson: JSON.stringify({ retiredDesktopApprovals: retired })
		});
		return retired;
	}, baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {}, { operationLabel: "preserve legacy desktop stream opt-outs" }));
}
//#endregion
export { preserveLegacyDesktopStreamOptOut as n, migrateLegacyDesktopStreamOptOuts as t };
