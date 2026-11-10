import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { n as isSameAuthoredSessionStoreConfig } from "./session-store-config-ugPrOKRi.mjs";
import { n as containsAuthoredInclude, r as readDoctorConfigBackup } from "./include-migration-ownership-KfGWiqXu.mjs";
import "./backup-rotation-BJBdiSUE.mjs";
import { n as sanitizeDoctorNote } from "./emit-notes-4SxaFD1H.mjs";
import JSON5 from "json5";
//#region src/commands/doctor-session-store-owner.ts
const OWNER_KEY = "agents.defaults.sessionStore.agentId";
/** Offers historical ownership without guessing whether its removal was intentional. */
async function prepareSessionStoreOwnerRecovery(params) {
	const unchanged = {
		config: params.config,
		changes: [],
		warnings: []
	};
	if (!params.snapshot.valid || params.config.agents?.defaults?.sessionStore?.agentId !== void 0 || containsAuthoredInclude(params.snapshot.parsed)) return unchanged;
	const currentStore = asNullableRecord(asNullableRecord(params.snapshot.parsed)?.session)?.store;
	if (currentStore !== void 0 && typeof currentStore !== "string") return unchanged;
	const roster = new Set(listAgentIds(params.config).map(normalizeAgentId));
	for (let index = 0; index < 5; index++) {
		const backupPath = `${params.snapshot.path}.bak${index === 0 ? "" : `.${index}`}`;
		let raw;
		let backup;
		try {
			raw = readDoctorConfigBackup(backupPath);
			backup = raw === void 0 ? void 0 : JSON5.parse(raw);
		} catch {
			unchanged.warnings.push(`Could not inspect ${backupPath} for ${OWNER_KEY} recovery. Review that backup or re-author ${OWNER_KEY}; Doctor did not choose an owner.`);
			break;
		}
		if (raw === void 0) continue;
		if (!isRecord(backup) || containsAuthoredInclude(backup)) break;
		if (backup.session !== void 0 && !isRecord(backup.session)) break;
		const store = asNullableRecord(backup.session)?.store;
		if (store !== void 0 && typeof store !== "string" || !isSameAuthoredSessionStoreConfig(store, currentStore)) break;
		const owner = asNullableRecord(asNullableRecord(asNullableRecord(backup.agents)?.defaults)?.sessionStore)?.agentId;
		if (owner === void 0) continue;
		if (typeof owner !== "string" || !isValidAgentId(owner) || !roster.has(normalizeAgentId(owner))) {
			unchanged.warnings.push(`${OWNER_KEY} is missing, but its last backed-up value in ${backupPath} does not name a configured agent. Re-author ${OWNER_KEY} with the intended owner; Doctor did not choose one.`);
			break;
		}
		const restoreCommand = formatCliCommand(`openclaw config set ${OWNER_KEY} ${owner.trim()}`);
		if (!await params.prompter?.confirmRuntimeRepair({
			message: sanitizeDoctorNote(`Restore ${OWNER_KEY}=${JSON.stringify(owner)} from ${backupPath}? Its removal may have been intentional.`),
			initialValue: false,
			requiresInteractiveConfirmation: true
		})) {
			unchanged.warnings.push(`${OWNER_KEY} is missing; ${backupPath} retains ${JSON.stringify(owner)} for the unchanged session.store. The removal may have been intentional, so Doctor left it unchanged. To restore this value, run "${restoreCommand}".`);
			break;
		}
		let currentBackup;
		try {
			currentBackup = readDoctorConfigBackup(backupPath);
		} catch {}
		if (currentBackup !== raw) {
			unchanged.warnings.push(`${backupPath} changed or became unreadable while confirming ${OWNER_KEY}; nothing was restored. Rerun Doctor to inspect the current backup.`);
			break;
		}
		const config = structuredClone(params.config);
		config.agents ??= {};
		config.agents.defaults ??= {};
		config.agents.defaults.sessionStore = {
			...config.agents.defaults.sessionStore,
			agentId: owner
		};
		return {
			config,
			changes: [`Restored ${OWNER_KEY}=${JSON.stringify(owner)} from ${backupPath}.`],
			warnings: []
		};
	}
	return unchanged;
}
//#endregion
export { prepareSessionStoreOwnerRecovery };
