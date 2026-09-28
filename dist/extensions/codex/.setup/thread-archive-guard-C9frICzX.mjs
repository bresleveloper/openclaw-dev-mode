import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { normalizeBoundedOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/codex/src/app-server/thread-archive-guard.ts
const DESCENDANT_PAGE_LIMIT = 100;
const MAX_DESCENDANT_PAGES = 100;
const MAX_THREAD_ID_LENGTH = 256;
const MAX_CURSOR_LENGTH = 4096;
function readNextCursor(value) {
	if (value === void 0 || value === null) return;
	if (typeof value !== "string" || !value.trim() || value.length > MAX_CURSOR_LENGTH) throw new Error("Codex app-server returned an invalid descendant-list cursor");
	return value;
}
/**
* Native archive includes the spawned subtree. Enumerate that same subtree first so an
* OpenClaw-owned descendant cannot be stopped as an undocumented side effect.
*/
async function assertCodexArchiveDescendantsUnowned(params) {
	const ancestorThreadId = normalizeBoundedOptionalString(params.threadId, MAX_THREAD_ID_LENGTH);
	if (!ancestorThreadId) throw new Error("cannot verify Codex archive descendants for an invalid thread id");
	const seenCursors = /* @__PURE__ */ new Set();
	const seenThreadIds = /* @__PURE__ */ new Set([ancestorThreadId]);
	let archived = false;
	let cursor;
	for (let pageIndex = 0; pageIndex < MAX_DESCENDANT_PAGES; pageIndex += 1) {
		const response = await params.listPage({
			ancestorThreadId,
			archived,
			limit: DESCENDANT_PAGE_LIMIT,
			sortKey: "created_at",
			sortDirection: "desc",
			useStateDbOnly: true,
			...cursor ? { cursor } : {}
		});
		if (!isJsonObject(response) || !Array.isArray(response.data)) throw new Error("Codex app-server returned an invalid descendant-list response");
		if (response.data.length > DESCENDANT_PAGE_LIMIT) throw new Error("Codex app-server exceeded the descendant-list page limit");
		for (const value of response.data) {
			if (!isJsonObject(value)) throw new Error("Codex app-server returned an invalid descendant thread");
			const descendantThreadId = normalizeBoundedOptionalString(value.id, MAX_THREAD_ID_LENGTH);
			if (!descendantThreadId) throw new Error("Codex app-server returned a descendant without a valid thread id");
			if (seenThreadIds.has(descendantThreadId)) throw new Error("Codex app-server returned a cyclic descendant thread list");
			seenThreadIds.add(descendantThreadId);
			await params.assertDescendantIdle(descendantThreadId);
			if (await params.bindingStore.hasOtherThreadOwner(descendantThreadId)) throw new Error("cannot archive a Codex thread while a spawned descendant is owned by an OpenClaw session");
		}
		const nextCursor = readNextCursor(response.nextCursor);
		if (!nextCursor) {
			if (archived) return;
			archived = true;
			cursor = void 0;
			seenCursors.clear();
			continue;
		}
		if (seenCursors.has(nextCursor)) throw new Error("Codex app-server returned a repeated descendant-list cursor");
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error("Codex descendant enumeration exceeded its safety limit");
}
//#endregion
export { assertCodexArchiveDescendantsUnowned as t };
