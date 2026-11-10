import { h as backupDoctorSqliteRepair } from "./openclaw-state-db-BtDOU_3j.mjs";
import { c as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { s as updateSqliteTranscriptEventJsonInTransaction } from "./session-accessor.sqlite-transcript-store-Dp-yP34B.mjs";
import { y as readTranscriptEventRows } from "./session-accessor.sqlite-read-Cx1b3WWI.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as normalizeLegacyInboundContextLabels, t as mayContainLegacyInboundContextLabels } from "./legacy-inbound-context-labels-DO2fx3cl.mjs";
import { n as transcriptSnapshotsMatch, t as scanDoctorSessionTranscripts } from "./doctor-session-transcript-scan-CE-dl4J4.mjs";
import { t as countLabel } from "./doctor-state-integrity-format-CGut2D9E.mjs";
//#region src/commands/doctor-session-transcript-labels.ts
const NOTE_TITLE = "Session transcript labels";
async function noteSessionTranscriptLabelHealth(params) {
	const env = params.env ?? process.env;
	let foundSessions = 0;
	let foundEvents = 0;
	let repairedSessions = 0;
	let repairedEvents = 0;
	const preserved = /* @__PURE__ */ new Set();
	scanDoctorSessionTranscripts({
		cfg: params.cfg,
		env,
		title: NOTE_TITLE,
		failureLabel: "Failed to inspect or rewrite labels"
	}, ({ reader, target, databaseOptions, reportError, sessionId }) => {
		const { agentId } = target;
		const readResult = reader.repairSnapshot(sessionId, normalizeLegacyInboundContextLabels, mayContainLegacyInboundContextLabels);
		if (!readResult.ok) {
			reportError(`- Failed to read transcript for session ${sessionId} (${agentId})`, readResult.error);
			return;
		}
		const updates = [];
		let hasMalformedRow = false;
		for (const row of readResult.rows) {
			let event;
			try {
				event = JSON.parse(row.eventJson);
			} catch {
				hasMalformedRow = true;
				continue;
			}
			if (normalizeLegacyInboundContextLabels(event)) updates.push({
				seq: row.seq,
				eventJson: JSON.stringify(event)
			});
		}
		if (updates.length === 0) return;
		foundSessions += 1;
		foundEvents += updates.length;
		if (params.shouldRepair) try {
			if (hasMalformedRow) throw new Error(`transcript contains malformed event JSON for ${sessionId}`);
			runOpenClawAgentWriteTransaction((writeDatabase) => {
				const currentRows = readTranscriptEventRows(writeDatabase, sessionId);
				if (!transcriptSnapshotsMatch(readResult.rows, currentRows)) throw new Error(`transcript changed while preparing rewrite for ${sessionId}`);
				if (!preserved.has(target.sqlitePath)) {
					const backup = backupDoctorSqliteRepair(target.sqlitePath, "transcript-labels");
					preserved.add(target.sqlitePath);
					note(`- Saved pre-repair SQLite backup: ${backup}`, NOTE_TITLE);
				}
				updateSqliteTranscriptEventJsonInTransaction(writeDatabase, sessionId, updates);
			}, databaseOptions, { operationLabel: "doctor.session-transcript-labels" });
			repairedSessions += 1;
			repairedEvents += updates.length;
		} catch (repairError) {
			reportError(`- Failed to rewrite labels for session ${sessionId} (${agentId})`, repairError);
		}
	});
	if (params.shouldRepair && repairedSessions > 0) note(`- Rewrote legacy inbound-context labels in ${countLabel(repairedSessions, "session")} (${countLabel(repairedEvents, "event")}).`, NOTE_TITLE);
	else if (!params.shouldRepair && foundEvents > 0) note([`- Found ${countLabel(foundSessions, "session")} with legacy inbound-context labels.`, "- Run \"openclaw doctor --fix\" to rewrite them."].join("\n"), NOTE_TITLE);
}
//#endregion
export { noteSessionTranscriptLabelHealth };
