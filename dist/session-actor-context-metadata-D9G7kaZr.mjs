import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as transcriptSerializedBytes } from "./transcript-payload-Cu49oQKq.mjs";
import { r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
//#region src/config/sessions/session-actor-context-metadata.ts
const MAX_CONTEXT_METADATA_ROWS = 4096;
function rewriteSessionActorContextStats(database, scope, rows, projectionUnchanged) {
	const actor = readSessionActorTransactionState(database, scope);
	if (!actor) return;
	if (!projectionUnchanged) {
		actor.transcript.contextStats = void 0;
		return;
	}
	rewriteSessionActorContextMetadata(actor, rows.map((row) => ({
		rawSeq: row.seq,
		serializedBytes: transcriptSerializedBytes(database.db, row.eventJson),
		previousSerializedBytes: transcriptSerializedBytes(database.db, row.expectedEventJson)
	})));
}
/** Reuse stored byte lengths; parsed navigation never establishes payload size. */
function projectSessionActorContextMetadata(actor) {
	const { active, coldArchive, contextMetadata, identities, navigation, payloads, projection } = actor.transcript;
	if (!actor.transcript.complete || coldArchive || !contextMetadata || !projection || projection.needsRebuild || projection.hasUnclassifiedEvents || [...identities.values()].some((row) => row.event_type === "reset" || row.event_type === "compaction") || navigation.some((row) => [
		"reset",
		"compaction",
		"leaf",
		"branch_summary"
	].includes(row.type))) return;
	const priorBytes = new Map(contextMetadata.rows.map((row) => [row.event_seq, row.serialized_bytes]));
	const rows = [];
	let sizeBytes = 0;
	for (const row of active.values()) {
		if (row.context_eligible !== 1) continue;
		const bytes = payloads.get(row.event_seq)?.serializedBytes ?? priorBytes.get(row.event_seq);
		if (bytes === void 0 || rows.length === MAX_CONTEXT_METADATA_ROWS) return;
		rows.push({
			event_seq: row.event_seq,
			active_position: row.active_position,
			serialized_bytes: bytes
		});
		sizeBytes += bytes;
	}
	let header = contextMetadata.header;
	if (!header) {
		for (const [seq, payload] of payloads) if (isRecord(payload.event) && payload.event.type === "session") {
			header = {
				seq,
				navigation_valid: 1,
				serialized_bytes: payload.serializedBytes
			};
			break;
		}
	}
	return {
		header,
		rows: rows.toSorted((left, right) => right.active_position - left.active_position),
		boundaryCount: 0,
		eventCount: rows.length,
		sizeBytes
	};
}
function rewriteSessionActorContextMetadata(actor, rewritten) {
	for (const row of rewritten) {
		const stats = actor.transcript.contextStats;
		if (!stats) break;
		const active = actor.transcript.active.get(row.rawSeq);
		if (!active && !actor.transcript.complete || active && active.active_position <= stats.boundaryActivePosition) actor.transcript.contextStats = void 0;
		else if (active?.context_eligible === 1) actor.transcript.contextStats = {
			...stats,
			sizeBytes: stats.sizeBytes + row.serializedBytes - row.previousSerializedBytes
		};
	}
	const metadata = actor.transcript.contextMetadata;
	if (!metadata) return;
	const bytes = new Map(rewritten.map((row) => [row.rawSeq, row.serializedBytes]));
	actor.transcript.contextMetadata = {
		...metadata,
		rows: metadata.rows.map((row) => ({
			event_seq: row.event_seq,
			active_position: row.active_position,
			serialized_bytes: bytes.get(row.event_seq) ?? row.serialized_bytes
		}))
	};
}
function appendSessionActorContextStats(actor, seq, event, serializedBytes, projectionNeedsRebuild) {
	const stats = actor.transcript.contextStats;
	if (!stats) return;
	if (projectionNeedsRebuild || isRecord(event) && (event.type === "reset" || event.type === "compaction")) actor.transcript.contextStats = void 0;
	else if (actor.transcript.active.get(seq)?.context_eligible === 1) actor.transcript.contextStats = {
		...stats,
		eventCount: stats.eventCount + 1,
		sizeBytes: stats.sizeBytes + serializedBytes
	};
}
/** Initial bytes ride the actor's existing navigation hydration statement. */
function seedSessionActorContextMetadata(actor, stored) {
	if (!actor.transcript.complete) return;
	const rows = stored.flatMap((row) => {
		const active = actor.transcript.active.get(row.seq);
		return active?.context_eligible === 1 ? [{
			event_seq: row.seq,
			active_position: active.active_position,
			serialized_bytes: row.serialized_bytes
		}] : [];
	});
	if (rows.length > MAX_CONTEXT_METADATA_ROWS) return;
	const first = stored.find((row) => row.navigation_type === "session" || row.navigation_valid === 0);
	actor.transcript.contextMetadata = {
		header: first && {
			seq: first.seq,
			navigation_valid: first.navigation_valid,
			serialized_bytes: first.serialized_bytes
		},
		rows,
		boundaryCount: 0,
		eventCount: rows.length,
		sizeBytes: rows.reduce((total, row) => total + row.serialized_bytes, 0)
	};
}
//#endregion
export { seedSessionActorContextMetadata as i, projectSessionActorContextMetadata as n, rewriteSessionActorContextStats as r, appendSessionActorContextStats as t };
