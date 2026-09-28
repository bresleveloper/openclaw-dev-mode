import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { v as writeTextAtomic } from "./json-files-C0HSMh2Z.mjs";
import { r as stripRuntimeOnlySessionSkillsFields } from "./store-entry-shape-CWorLqwJ.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/config/sessions/skill-prompt-blobs.ts
const PROMPT_BLOB_DIR = "skills-prompts";
const PROMPT_BLOB_ALGORITHM = "sha256";
const PROMPT_BLOB_VERSION = 1;
const MIN_PROMPT_BLOB_CHARS = 512;
const MAX_PROMPT_BLOB_BYTES = 524288;
const PROMPT_REF_CACHE_MAX_ENTRIES = 256;
const VALID_PROMPT_BLOB_CACHE_MAX_ENTRIES = 256;
const promptRefCache = /* @__PURE__ */ new Map();
const validPromptBlobCache = /* @__PURE__ */ new Map();
function hashPrompt(prompt) {
	return crypto.createHash(PROMPT_BLOB_ALGORITHM).update(prompt).digest("hex");
}
function clearSessionSkillPromptRefCache() {
	promptRefCache.clear();
	validPromptBlobCache.clear();
}
function isSha256Hex(value) {
	return /^[a-f0-9]{64}$/u.test(value);
}
function resolveSessionSkillPromptBlobPath(storePath, hash) {
	if (!isSha256Hex(hash)) return null;
	return path.join(path.dirname(path.resolve(storePath)), PROMPT_BLOB_DIR, PROMPT_BLOB_ALGORITHM, hash.slice(0, 2), `${hash}.txt`);
}
function buildPromptRef(prompt) {
	const cached = promptRefCache.get(prompt);
	if (cached) return cached;
	const ref = {
		version: PROMPT_BLOB_VERSION,
		algorithm: PROMPT_BLOB_ALGORITHM,
		hash: hashPrompt(prompt),
		bytes: Buffer.byteLength(prompt, "utf8")
	};
	promptRefCache.set(prompt, ref);
	pruneMapToMaxSize(promptRefCache, PROMPT_REF_CACHE_MAX_ENTRIES);
	return ref;
}
function shouldStorePromptAsBlob(prompt) {
	const bytes = Buffer.byteLength(prompt, "utf8");
	return prompt.length >= MIN_PROMPT_BLOB_CHARS && bytes <= MAX_PROMPT_BLOB_BYTES;
}
function rememberValidPromptBlob(blobPath, stat, prompt) {
	validPromptBlobCache.set(blobPath, {
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		prompt
	});
	pruneMapToMaxSize(validPromptBlobCache, VALID_PROMPT_BLOB_CACHE_MAX_ENTRIES);
}
function readValidPromptBlob(storePath, ref) {
	if (ref.version !== PROMPT_BLOB_VERSION || ref.algorithm !== PROMPT_BLOB_ALGORITHM || !isSha256Hex(ref.hash) || typeof ref.bytes !== "number" || !Number.isFinite(ref.bytes) || ref.bytes < 0 || ref.bytes > MAX_PROMPT_BLOB_BYTES) return null;
	const blobPath = resolveSessionSkillPromptBlobPath(storePath, ref.hash);
	if (!blobPath) return null;
	try {
		const stat = fs.statSync(blobPath);
		if (!stat.isFile() || stat.size !== ref.bytes) {
			validPromptBlobCache.delete(blobPath);
			return null;
		}
		const cached = validPromptBlobCache.get(blobPath);
		if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached.prompt;
		const prompt = fs.readFileSync(blobPath, "utf8");
		if (hashPrompt(prompt) !== ref.hash || Buffer.byteLength(prompt, "utf8") !== ref.bytes) {
			validPromptBlobCache.delete(blobPath);
			return null;
		}
		rememberValidPromptBlob(blobPath, stat, prompt);
		return prompt;
	} catch {
		validPromptBlobCache.delete(blobPath);
		return null;
	}
}
async function ensurePromptBlob(storePath, prompt) {
	const ref = buildPromptRef(prompt);
	const blobPath = resolveSessionSkillPromptBlobPath(storePath, ref.hash);
	if (!blobPath) return ref;
	if (readValidPromptBlob(storePath, ref) === prompt) try {
		const now = /* @__PURE__ */ new Date();
		await fs.promises.utimes(blobPath, now, now);
		rememberValidPromptBlob(blobPath, await fs.promises.stat(blobPath), prompt);
		return ref;
	} catch {}
	await fs.promises.mkdir(path.dirname(blobPath), { recursive: true });
	await writeTextAtomic(blobPath, prompt, {
		durable: false,
		mode: 384,
		tempPrefix: path.basename(blobPath)
	});
	rememberValidPromptBlob(blobPath, await fs.promises.stat(blobPath), prompt);
	return ref;
}
function stripPromptForPersistence(entry, ref) {
	const { prompt: _prompt, ...snapshot } = entry.skillsSnapshot;
	return {
		...entry,
		skillsSnapshot: {
			...snapshot,
			promptRef: ref
		}
	};
}
function projectSessionStoreForPersistence(params) {
	let persisted = params.store;
	let changed = false;
	const promptBlobs = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(params.store)) {
		let projectedEntry = stripRuntimeOnlySessionSkillsFields(entry);
		const prompt = projectedEntry.skillsSnapshot?.prompt;
		if (prompt && shouldStorePromptAsBlob(prompt)) {
			const promptRef = buildPromptRef(prompt);
			promptBlobs.set(promptRef.hash, {
				ref: promptRef,
				path: resolveSessionSkillPromptBlobPath(params.storePath, promptRef.hash),
				prompt
			});
			projectedEntry = stripPromptForPersistence(projectedEntry, promptRef);
		}
		if (projectedEntry === entry) continue;
		if (persisted === params.store) persisted = { ...params.store };
		persisted[key] = projectedEntry;
		changed = true;
	}
	return {
		store: persisted,
		changed,
		promptBlobs
	};
}
async function ensureSessionStorePromptBlobsForPersistence(params) {
	for (const blob of params.promptBlobs) await ensurePromptBlob(params.storePath, blob.prompt);
}
function parsePromptRef(value) {
	if (!value || typeof value !== "object") return null;
	const ref = value;
	return ref.version === PROMPT_BLOB_VERSION && ref.algorithm === PROMPT_BLOB_ALGORITHM && typeof ref.hash === "string" && typeof ref.bytes === "number" ? {
		version: ref.version,
		algorithm: ref.algorithm,
		hash: ref.hash,
		bytes: ref.bytes
	} : null;
}
function hydrateSessionStoreSkillPromptRefs(params) {
	let changed = false;
	for (const [key, value] of Object.entries(params.store)) {
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		const entry = value;
		const snapshot = entry.skillsSnapshot;
		if (!snapshot || typeof snapshot.prompt === "string") continue;
		const promptRef = parsePromptRef(snapshot.promptRef);
		const prompt = promptRef ? readValidPromptBlob(params.storePath, promptRef) : null;
		if (!prompt) {
			const nextEntry = { ...entry };
			delete nextEntry.skillsSnapshot;
			params.store[key] = nextEntry;
			changed = true;
			continue;
		}
		const { promptRef: _promptRef, ...rest } = snapshot;
		params.store[key] = {
			...entry,
			skillsSnapshot: {
				...rest,
				prompt
			}
		};
		changed = true;
	}
	return changed;
}
//#endregion
export { projectSessionStoreForPersistence as i, ensureSessionStorePromptBlobsForPersistence as n, hydrateSessionStoreSkillPromptRefs as r, clearSessionSkillPromptRefCache as t };
