import { a as executeSqliteQueryTakeFirstSync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { o as recordLegacyMigrationRun } from "./state-migrations.receipts-CikBNdPu.mjs";
import { o as withDevicePairingLock } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { D as readDevicePairingStoreStateFromDatabase, c as resolveNodePairingGeneration, t as clearNodePairingGenerationState, w as persistDevicePairingStoreState } from "./device-pairing-identity-BRtdqCdi.mjs";
import "./device-pairing-_Xo0MHGf.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND } from "./node-desktop-stream-BZM2AiRA.mjs";
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
