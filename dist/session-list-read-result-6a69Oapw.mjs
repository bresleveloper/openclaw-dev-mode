import { i as withReadySessionRows } from "./session-row-prepared-read-BwiDGjfX.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-BYWh0eAO.mjs";
//#region src/gateway/session-list-read-result.ts
const reads = /* @__PURE__ */ new WeakMap();
function bindSessionListRowRead(row, read) {
	reads.set(row, {
		projection: new WeakRef(read.projection),
		client: read.client,
		agentId: read.record.agentId,
		key: read.record.key,
		storePath: read.record.storeTarget.storePath,
		storeAgentId: read.record.storeTarget.agentId,
		generation: read.record.generation,
		sessionId: read.record.entry.sessionId,
		lifecycleRevision: read.record.entry.lifecycleRevision
	});
}
/** Explicit tool enrichment reads the selected physical owner, never a wire-provided path. */
async function readSessionListRowTitleFields(row, requireOwner) {
	const selected = reads.get(row);
	if (!selected) {
		if (requireOwner) throw new Error("Session enrichment requires its Gateway or embedded read owner");
		return;
	}
	if (!await withCurrentSessionListRows([row], ([allowed]) => allowed, true)) return null;
	const { readSessionTitleFieldsFromTranscriptAsync } = await import("./session-transcript-title-reader-BiPKBO7M.mjs");
	return await readSessionTitleFieldsFromTranscriptAsync({
		agentId: selected.storeAgentId,
		sessionKey: selected.key,
		sessionId: selected.sessionId,
		storePath: selected.storePath,
		sessionEntry: { sessionId: selected.sessionId }
	});
}
/** Finalize buffered enrichment inside one current owner read, without a later await. */
async function withCurrentSessionListRows(rows, consume, requireOwner) {
	if (rows.length === 0) return consume([]);
	const captured = rows.map((row) => reads.get(row));
	if (!requireOwner && captured.every((read) => !read)) return consume(rows.map(() => true));
	const selected = captured.map((read) => {
		if (!read) throw new Error("Session enrichment requires its Gateway or embedded read owner");
		return read;
	});
	const projection = selected[0].projection.deref();
	if (!projection || selected.some((read) => read.projection.deref() !== projection)) throw new Error("Gateway changed while preparing session inventory; retry the request");
	return withReadySessionRows(projection, () => selected.map(({ agentId, key }) => ({
		agentId,
		key
	})), (read) => {
		const presentations = /* @__PURE__ */ new Map();
		return consume(selected.map((selectedRead) => {
			const { agentId, key, client } = selectedRead;
			const query = {
				agentId,
				key
			};
			const record = read.describe(query);
			if (!record || record.agentId !== agentId || record.key !== key || record.storeTarget.storePath !== selectedRead.storePath || record.storeTarget.agentId !== selectedRead.storeAgentId || record.generation !== selectedRead.generation || record.entry.sessionId !== selectedRead.sessionId || record.entry.lifecycleRevision !== selectedRead.lifecycleRevision) return false;
			if (client === void 0) return true;
			let presentation = presentations.get(client);
			if (!presentation) {
				presentation = prepareProjectedSessionPresentation(read, client);
				presentations.set(client, presentation);
			}
			return !presentation.authorizeDescription(query) && presentation.sharing.entryFilter?.(record.key, record.entry) !== false;
		}));
	});
}
//#endregion
export { readSessionListRowTitleFields as n, withCurrentSessionListRows as r, bindSessionListRowRead as t };
