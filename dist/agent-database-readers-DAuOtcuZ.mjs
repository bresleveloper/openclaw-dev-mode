import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import path from "node:path";
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
/** A deleted agent's database stays closed in this isolate until the roster admits the agent again. */
function isDeletedAgentDatabasePath(pathname) {
	return readers.deleted.has(path.resolve(pathname));
}
function hasDeletedAgentDatabases() {
	return readers.deleted.size > 0;
}
/** Task admission carries the parent owner's current fences into every worker generation. */
function captureDeletedAgentDatabaseFences() {
	return [...readers.deleted];
}
function installDeletedAgentDatabaseFences(fences) {
	readers.deleted.clear();
	for (const [pathname, agentId] of fences) readers.deleted.set(pathname, agentId);
}
async function applyAgentDatabaseReaderRequest(request) {
	if (request.kind === "revive") {
		for (const [deleted, agentId] of readers.deleted) if (request.agentIds.includes(agentId)) readers.deleted.delete(deleted);
		return;
	}
	if (request.deleted) for (const candidate of request.candidates) readers.deleted.set(path.resolve(candidate.path), request.agentId);
	const errors = (await Promise.allSettled([...readers.closers].map(async (closer) => closer(request.candidates)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Agent database reader cleanup failed");
}
function normalizeCandidates(candidates) {
	if (!Array.isArray(candidates) || !candidates.every((candidate) => isRecord(candidate) && typeof candidate.path === "string" && (candidate.scope === void 0 || candidate.scope === "sibling-family"))) return;
	return candidates.map((candidate) => candidate.scope ? {
		path: candidate.path,
		scope: candidate.scope
	} : { path: candidate.path });
}
function encodeAgentDatabaseReaderRequest(request) {
	if (request.kind === "revive") return JSON.stringify({ revive: request.agentIds });
	const candidates = normalizeCandidates(request.candidates) ?? [];
	return request.deleted ? JSON.stringify({
		deleted: candidates,
		agentId: request.agentId
	}) : JSON.stringify(candidates);
}
/** Worker resource keys that name agent databases; other keys belong to their worker's own closer. */
function decodeAgentDatabaseReaderRequest(key) {
	if (key === void 0) return;
	let parsed;
	try {
		parsed = JSON.parse(key);
	} catch {
		return;
	}
	if (Array.isArray(parsed)) {
		const candidates = normalizeCandidates(parsed);
		return candidates ? {
			kind: "close",
			candidates,
			deleted: false
		} : void 0;
	}
	if (!isRecord(parsed)) return;
	if ("deleted" in parsed) {
		const candidates = normalizeCandidates(parsed.deleted);
		return candidates && typeof parsed.agentId === "string" && parsed.agentId.length > 0 ? {
			kind: "close",
			candidates,
			deleted: true,
			agentId: parsed.agentId
		} : void 0;
	}
	if ("revive" in parsed && Array.isArray(parsed.revive) && parsed.revive.every((agentId) => typeof agentId === "string")) return {
		kind: "revive",
		agentIds: parsed.revive
	};
}
//#endregion
export { hasDeletedAgentDatabases as a, matchesAgentDatabaseReadCandidatePath as c, encodeAgentDatabaseReaderRequest as i, registerAgentDatabaseReaderCloser as l, captureDeletedAgentDatabaseFences as n, installDeletedAgentDatabaseFences as o, decodeAgentDatabaseReaderRequest as r, isDeletedAgentDatabasePath as s, applyAgentDatabaseReaderRequest as t };
