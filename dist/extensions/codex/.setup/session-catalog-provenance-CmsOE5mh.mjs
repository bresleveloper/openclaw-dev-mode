import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import path from "node:path";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { createZstdDecompress } from "node:zlib";
//#region extensions/codex/src/session-catalog-provenance.ts
const MAX_SESSION_META_BYTES = 1048576;
const SESSION_META_READ_CHUNK_BYTES = 65536;
const MAX_PROVENANCE_CACHE_ENTRIES = 2e4;
const provenanceByPath = /* @__PURE__ */ new Map();
function cacheProvenance(key, value) {
	provenanceByPath.delete(key);
	provenanceByPath.set(key, value);
	if (provenanceByPath.size > MAX_PROVENANCE_CACHE_ENTRIES) provenanceByPath.delete(provenanceByPath.keys().next().value);
}
/** Undefined means the metadata line is not durable enough to cache yet. */
async function readCodexSessionMeta(sessionsRoot, rolloutPath, threadId) {
	let safeRoot;
	try {
		safeRoot = await root(sessionsRoot, {
			hardlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER,
			symlinks: "reject"
		});
	} catch {
		return;
	}
	const candidates = rolloutPath.endsWith(".zst") ? [rolloutPath, rolloutPath.slice(0, -4)] : [rolloutPath, `${rolloutPath}.zst`];
	for (const candidate of candidates) {
		let opened;
		try {
			opened = await safeRoot.open(path.relative(sessionsRoot, candidate));
		} catch {
			continue;
		}
		const input = opened.handle.createReadStream({
			autoClose: false,
			highWaterMark: SESSION_META_READ_CHUNK_BYTES
		});
		const decoder = candidate.endsWith(".zst") ? createZstdDecompress() : void 0;
		if (decoder) {
			input.on("error", (error) => decoder.destroy(error));
			input.pipe(decoder);
		}
		const reader = decoder ?? input;
		try {
			const chunks = [];
			let bytesReadTotal = 0;
			let line;
			for await (const value of reader) {
				const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
				const remaining = MAX_SESSION_META_BYTES - bytesReadTotal;
				if (remaining <= 0) break;
				const bounded = chunk.subarray(0, remaining);
				bytesReadTotal += bounded.length;
				const newline = bounded.indexOf(10);
				chunks.push(newline >= 0 ? bounded.subarray(0, newline) : bounded);
				if (newline >= 0) {
					line = Buffer.concat(chunks).toString("utf8");
					break;
				}
			}
			if (!line) continue;
			const parsed = JSON.parse(line);
			if (!isJsonObject(parsed) || parsed.type !== "session_meta" || !isJsonObject(parsed.payload)) return null;
			const payload = parsed.payload;
			return payload.id === threadId ? payload : null;
		} catch {
			continue;
		} finally {
			reader.destroy();
			input.destroy();
			await opened.handle.close().catch(() => void 0);
		}
	}
}
/** Passive local listing uses native creation provenance, with rollout fallback for older records. */
async function isOpenClawManagedCodexThread(thread, localSessionsRoot, diagnostics) {
	const started = diagnostics ? performance.now() : 0;
	if (diagnostics) diagnostics.fields.provenanceChecks++;
	try {
		const rolloutPath = typeof thread.path === "string" ? thread.path.trim() : "";
		if (!localSessionsRoot || !rolloutPath) return false;
		if (typeof thread.originator === "string" && thread.originator.length > 0) return thread.originator === "openclaw";
		const cacheKey = `${localSessionsRoot}\0${rolloutPath}`;
		const cached = provenanceByPath.get(cacheKey);
		if (cached !== void 0) {
			if (diagnostics) diagnostics.fields.provenanceCacheHits++;
			return cached;
		}
		if (diagnostics) diagnostics.fields.provenanceReadCalls++;
		const metadata = await readCodexSessionMeta(localSessionsRoot, rolloutPath, thread.id);
		const managed = metadata === void 0 ? void 0 : metadata?.originator === "openclaw";
		if (managed !== void 0) cacheProvenance(cacheKey, managed);
		return managed ?? false;
	} finally {
		if (diagnostics) diagnostics.fields.provenanceMs = (diagnostics.fields.provenanceMs ?? 0) + performance.now() - started;
	}
}
//#endregion
export { readCodexSessionMeta as n, isOpenClawManagedCodexThread as t };
