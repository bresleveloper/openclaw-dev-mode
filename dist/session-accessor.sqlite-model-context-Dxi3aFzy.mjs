import { a as iterateSqliteQuerySync, r as executeSqliteQueryTakeFirstSync, s as prepareSqliteQuerySync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { c as transcriptEventModelBytesSql, g as projectModelContextEventSql, l as transcriptEventModelNavigationSql, s as transcriptEventJsonSql, u as transcriptEventNavigationSql } from "./transcript-payload-qsg5dB6v.mjs";
import { r as classifyToolUseResultPairing } from "./tool-result-pairing-Bky0eubt.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { i as projectSessionEntryMessage, n as iterateSessionContextEntries, r as iterateSessionContextMessages } from "./session-D9cHHQGH.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { f as selectSessionTranscriptTreePathNodes, l as scanSessionTranscriptTree } from "./transcript-tree-3xvvNd9-.mjs";
import { o as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-BGrlGphn.mjs";
import { a as runWithSessionTranscriptReadFence, i as resolveSqliteSessionTranscriptReadFence, t as SessionTranscriptReadFenceError } from "./session-transcript-read-fence-Crjo4FKU.mjs";
import { r as readActiveTranscriptEntryAnchorInTransaction } from "./session-accessor.sqlite-transcript-anchor-B0dOIy5w.mjs";
import { n as normalizeSessionContextEntryBoundaries } from "./session-entry-navigation-neBcvf-5.mjs";
import { isCompactionReplayCheckpoint } from "@openclaw/ai/transports";
//#region src/config/sessions/session-accessor.sqlite-model-context.ts
const MODEL_CONTEXT_PAYLOAD_BATCH_SIZE = 400;
function assertContextAnchor(database, resolved, through) {
	if (resolved.agentId !== through.agentId || resolved.sessionId !== through.sessionId || resolved.sessionKey !== through.sessionKey || database.path !== through.storePath) throw new SessionTranscriptReadFenceError("Completed-turn anchor belongs to another transcript");
	const current = readActiveTranscriptEntryAnchorInTransaction({
		database,
		resolved: {
			...resolved,
			sessionKey: through.sessionKey
		},
		entryId: through.entryId
	});
	if (!current || [
		"generation",
		"rawSeq",
		"effectiveParentId",
		"activeMessagePosition"
	].some((field) => current[field] !== through[field])) throw new SessionTranscriptReadFenceError("Completed-turn transcript anchor changed");
}
/** Later appends are allowed; rewriting or removing the accepted turn is not. */
function validateSessionTranscriptContextAnchor(scope, through) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	if (!withOpenClawAgentDatabaseReadOnly((database) => assertContextAnchor(database, resolved, through), toDatabaseOptions(resolved)).found) throw new SessionTranscriptReadFenceError("Completed-turn transcript no longer exists");
}
/** Unadmitted context must still describe this session when an async read returns. */
function validateSessionTranscriptContextVersion(scope, version) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => readTranscriptContextVersionInTransaction(database, resolved.sessionId), toDatabaseOptions(resolved));
	const current = result.found ? result.value : void 0;
	if (current?.generation !== version?.generation || current?.rawSeq !== version?.rawSeq || current?.updatedAt !== version?.updatedAt) throw new SessionTranscriptReadFenceError("Session transcript changed during context read");
}
/** Revalidate admission after an asynchronous read before accepting its detached result. */
function validateSessionTranscriptContextAdmission(scope, admission) {
	if (!admission) return;
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = runWithSessionTranscriptReadFence(admission, () => withOpenClawAgentDatabaseReadOnly((database) => resolveSqliteSessionTranscriptReadFence({
		database,
		...resolved
	}), toDatabaseOptions(resolved)));
	if (!result.found || !result.value) throw new SessionTranscriptReadFenceError("Current-turn transcript admission is no longer readable");
}
/** Select an owned suffix before SQLite payloads can enter JavaScript or cross a worker. */
function selectBoundedModelRequests(requests, readSizes, limits) {
	const boundary = requests.find(({ entry }) => entry.type === "compaction" || entry.type === "reset");
	const candidates = requests.filter((request) => request !== boundary);
	const sizingCandidates = candidates.slice(-limits.maxEvents);
	const sizes = readSizes(boundary ? [boundary, ...sizingCandidates] : sizingCandidates);
	let bytes = boundary ? sizes.get(boundary.entry) : 0;
	let events = boundary ? 1 : 0;
	if (bytes > limits.maxBytes || events > limits.maxEvents) throw new RangeError("Required session context boundary exceeds the model-context limit");
	let cut = candidates.length;
	for (const request of sizingCandidates.toReversed()) {
		const size = sizes.get(request.entry);
		if (bytes + size > limits.maxBytes || events + 1 > limits.maxEvents) break;
		bytes += size;
		events += 1;
		cut -= 1;
	}
	if (cut === 0) return requests;
	const messages = candidates.flatMap(({ entry }) => {
		const message = entry.type === "message" ? entry.message : projectSessionEntryMessage(entry);
		return message ? [message] : [];
	});
	const positions = /* @__PURE__ */ new Map();
	for (const [index, { entry }] of candidates.entries()) if (entry.type === "message") positions.set(entry.message, index);
	const original = classifyToolUseResultPairing(messages);
	const owners = /* @__PURE__ */ new Map();
	for (const frame of original.frames) {
		const start = positions.get(frame.assistant);
		for (const occurrence of frame.occurrences) if (occurrence.sourceResult) {
			owners.set(occurrence.sourceResult, frame.assistant);
			const end = positions.get(occurrence.sourceResult);
			if (start < cut && cut <= end) cut = end + 1;
		}
	}
	let selected = candidates.slice(cut);
	if (selected.length === 0 && limits.toolResultOverflow === "omit") {
		let start = candidates.findLastIndex(({ entry }) => entry.type === "message" && entry.message.role === "user");
		if (start < 0) start = candidates.length - 1;
		for (const frame of original.frames.toReversed()) if (frame.occurrences.some(({ sourceResult }) => sourceResult && positions.get(sourceResult) >= start)) start = Math.min(start, positions.get(frame.assistant));
		const required = candidates.slice(start);
		if (required.length + (boundary ? 1 : 0) <= limits.maxEvents) {
			const requiredSizes = readSizes(boundary ? [boundary, ...required] : required);
			let requiredBytes = [...requiredSizes.values()].reduce((total, size) => total + size, 0);
			const omissions = required.flatMap((request) => {
				const { entry } = request;
				if (entry.type !== "message" || entry.message.role !== "toolResult") return [];
				const message = entry.message;
				return [{
					...request,
					toolResultOmission: `Tool result body omitted from this bounded context: ${JSON.stringify(message.toolName)} (call ${JSON.stringify(message.toolCallId)}), original model-context event ${requiredSizes.get(entry)} bytes. The full result remains in the session transcript. Do not infer its outcome or repeat the operation from this notice.`
				}];
			});
			const omittedSizes = readSizes(omissions);
			const savings = (request) => requiredSizes.get(request.entry) - omittedSizes.get(request.entry);
			const replacements = /* @__PURE__ */ new Map();
			for (const omission of omissions.toSorted((a, b) => savings(b) - savings(a))) {
				if (requiredBytes <= limits.maxBytes) break;
				const saved = savings(omission);
				if (saved > 0) {
					replacements.set(omission.entry, omission);
					requiredBytes -= saved;
				}
			}
			if (requiredBytes <= limits.maxBytes) selected = required.map((request) => replacements.get(request.entry) ?? request);
		}
	}
	if (selected.length === 0) throw new RangeError("Newest session context cannot fit the model-context limit without splitting a tool frame");
	const selectedMessages = selected.flatMap(({ entry }) => entry.type === "message" ? [entry.message] : []);
	const selectedOwners = /* @__PURE__ */ new Map();
	for (const frame of classifyToolUseResultPairing(selectedMessages).frames) for (const occurrence of frame.occurrences) if (occurrence.sourceResult) selectedOwners.set(occurrence.sourceResult, frame.assistant);
	for (const message of selectedMessages) if (message.role === "toolResult" && owners.get(message) !== selectedOwners.get(message)) throw new RangeError("Session context limit would change tool-result ownership");
	return boundary ? [boundary, ...selected] : selected;
}
function modelToolResultOmissionSql(requests) {
	const omissions = requests.flatMap(({ entry, toolResultOmission }) => toolResultOmission ? [{
		seq: entry.seq,
		text: toolResultOmission
	}] : []);
	return omissions.length ? sql`CASE seq ${sql.join(omissions.map(({ seq, text }) => sql`WHEN ${seq} THEN ${text}`), sql` `)} ELSE NULL END` : void 0;
}
/** Read a transient context without opening the writer lifecycle or copying native evidence. */
function readSessionTranscriptModelContext(scope, through, limits) {
	if (limits && (!Number.isSafeInteger(limits.maxBytes) || limits.maxBytes <= 0 || !Number.isSafeInteger(limits.maxEvents) || limits.maxEvents <= 0)) throw new RangeError("Model-context byte and event limits must be positive safe integers");
	const result = withTranscriptContextSnapshot(scope, ({ header, entries, readModelEntries, readModelEntrySizes, version }) => {
		const requests = [];
		for (const { entry, context } of iterateSessionContextEntries(entries)) {
			const omitCheckpoint = context !== "current" && entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay);
			requests.push({
				entry,
				omitCheckpoint
			});
		}
		const payloads = readModelEntries(limits ? selectBoundedModelRequests(requests, readModelEntrySizes, limits) : requests);
		if (limits) {
			const model = entries.findLast((entry) => entry.type === "model_change" || entry.type === "message" && entry.message.role === "assistant");
			const thinking = entries.findLast((entry) => entry.type === "thinking_level_change");
			const detached = entries.flatMap((entry) => {
				const payload = payloads.get(entry);
				if (payload) return [payload];
				if (entry === thinking || entry === model && entry.type === "model_change") return [entry];
				if (entry === model && entry.type === "message" && entry.message.role === "assistant") return [{
					type: "model_change",
					id: entry.id,
					parentId: entry.parentId,
					timestamp: entry.timestamp,
					provider: entry.message.provider,
					modelId: entry.message.model
				}];
				return [];
			});
			const boundaryIndex = detached.findIndex((entry) => entry.type === "compaction" || entry.type === "reset");
			const boundary = detached[boundaryIndex];
			if (boundary?.type === "compaction" || boundary?.type === "reset") boundary.firstKeptEntryId = detached.slice(0, boundaryIndex).find((entry) => entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary")?.id ?? boundary.id;
			return {
				events: [...header ? [header] : [], ...detached.map((entry, index) => {
					entry.parentId = detached[index - 1]?.id ?? null;
					return entry;
				})],
				version
			};
		}
		return {
			events: [...header ? [header] : [], ...entries.map((entry) => payloads.get(entry) ?? entry)],
			version
		};
	}, through);
	return result.found ? result.value : { events: [] };
}
/** Consume full-fidelity context lazily inside one read snapshot, never retaining raw history. */
function readSessionTranscriptContextMessages(scope, read) {
	const result = withTranscriptContextSnapshot(scope, ({ header, entries, readEntry, version }) => {
		const messages = iterateSessionContextMessages(entries, readEntry);
		try {
			return read(messages, header, version);
		} finally {
			messages.return(void 0);
		}
	});
	return result.found ? result.value : read([], void 0);
}
function withTranscriptContextSnapshot(scope, read, through) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	return withOpenClawAgentDatabaseReadOnly((database) => runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		const fence = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		});
		const version = readTranscriptContextVersionInTransaction(database, resolved.sessionId);
		if (through) assertContextAnchor(database, resolved, through);
		const base = db.selectFrom("transcript_events").where("session_id", "=", resolved.sessionId).$if(fence !== void 0, (query) => query.where("seq", "<", fence.beforeRawSeq)).$if(through !== void 0, (query) => query.where("seq", "<=", through.rawSeq));
		const header = executeSqliteQueryTakeFirstSync(database.db, base.select(transcriptEventJsonSql(database.db).as("event_json")).where(sql`json_extract(${transcriptEventNavigationSql()}, '$.type')`, "=", "session").orderBy("seq", "asc").limit(1));
		const tree = scanSessionTranscriptTree((function* () {
			for (const row of iterateSqliteQuerySync(database.db, base.select(["seq", transcriptEventModelNavigationSql().as("navigation_json")]).orderBy("seq", "asc"))) yield {
				...JSON.parse(row.navigation_json),
				seq: row.seq
			};
		})());
		if (through && !tree.byId.has(through.entryId)) throw new SessionTranscriptReadFenceError("Completed-turn anchor is outside the admitted context");
		const entries = normalizeSessionContextEntryBoundaries(selectSessionTranscriptTreePathNodes(tree, through?.entryId ?? tree.leafId).map(({ entry, parentId }) => {
			entry.parentId = parentId;
			return entry;
		}), tree.nodes);
		const readPayload = prepareSqliteQuerySync(database.db, (parameter) => base.select(transcriptEventJsonSql(database.db).as("event_json")).where("seq", "=", parameter((row) => row.seq)));
		return read({
			header: header ? JSON.parse(header.event_json) : void 0,
			entries,
			version,
			readEntry: (entry) => {
				const row = readPayload(entry).rows[0];
				return hydrateContextEntry(row.event_json, entry);
			},
			readModelEntrySizes: (requests) => {
				const sizes = /* @__PURE__ */ new Map();
				for (let offset = 0; offset < requests.length; offset += MODEL_CONTEXT_PAYLOAD_BATCH_SIZE) {
					const batch = requests.slice(offset, offset + MODEL_CONTEXT_PAYLOAD_BATCH_SIZE);
					const bySeq = new Map(batch.map(({ entry }) => [entry.seq, entry]));
					const omitted = batch.filter(({ omitCheckpoint }) => omitCheckpoint).map(({ entry }) => entry.seq);
					const query = base.select((eb) => {
						const omitCheckpoint = omitted.length ? eb.case().when("seq", "in", omitted).then(1).else(0).end() : eb.val(0);
						const storedBytes = transcriptEventModelBytesSql(omitCheckpoint);
						const omission = modelToolResultOmissionSql(batch);
						return ["seq", (omission ? eb.case().when(omission, "is not", null).then(eb.fn("octet_length", [projectModelContextEventSql(transcriptEventJsonSql(database.db), omitCheckpoint, omission)])).else(storedBytes).end() : storedBytes).as("bytes")];
					}).where("seq", "in", [...bySeq.keys()]);
					for (const row of iterateSqliteQuerySync(database.db, query)) sizes.set(bySeq.get(row.seq), row.bytes);
				}
				return sizes;
			},
			readModelEntries: (requests) => {
				const payloads = /* @__PURE__ */ new Map();
				for (let offset = 0; offset < requests.length; offset += MODEL_CONTEXT_PAYLOAD_BATCH_SIZE) {
					const batch = requests.slice(offset, offset + MODEL_CONTEXT_PAYLOAD_BATCH_SIZE);
					const bySeq = new Map(batch.map(({ entry }) => [entry.seq, entry]));
					const omitted = batch.filter(({ omitCheckpoint }) => omitCheckpoint).map(({ entry }) => entry.seq);
					const query = base.select((eb) => ["seq", projectModelContextEventSql(transcriptEventJsonSql(database.db), omitted.length > 0 ? eb.case().when("seq", "in", omitted).then(1).else(0).end() : eb.val(0), modelToolResultOmissionSql(batch)).as("event_json")]).where("seq", "in", [...bySeq.keys()]);
					for (const row of iterateSqliteQuerySync(database.db, query)) {
						const entry = bySeq.get(row.seq);
						payloads.set(entry, hydrateContextEntry(row.event_json, entry));
					}
				}
				return payloads;
			}
		});
	}, { operationLabel: "session context snapshot read" }), toDatabaseOptions(resolved));
}
function hydrateContextEntry(eventJson, entry) {
	return {
		...JSON.parse(eventJson),
		parentId: entry.parentId,
		...(entry.type === "compaction" || entry.type === "reset") && entry.firstKeptEntryId !== void 0 ? { firstKeptEntryId: entry.firstKeptEntryId } : {}
	};
}
//#endregion
export { validateSessionTranscriptContextVersion as a, validateSessionTranscriptContextAnchor as i, readSessionTranscriptModelContext as n, validateSessionTranscriptContextAdmission as r, readSessionTranscriptContextMessages as t };
