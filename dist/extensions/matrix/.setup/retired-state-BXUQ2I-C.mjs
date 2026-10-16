import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
import os from "node:os";
import fs from "node:fs/promises";
//#region extensions/matrix/src/matrix/chunked-state.ts
function chunkMatrixStateJson(value, maxBytes, maxChunks, limitMessage) {
	const chunks = [];
	const pushChunk = (chunk) => {
		if (chunks.length >= maxChunks) throw new Error(limitMessage);
		chunks.push(chunk);
	};
	let current = "";
	let currentBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (current && currentBytes + charBytes > maxBytes) {
			pushChunk(current);
			current = "";
			currentBytes = 0;
		}
		current += char;
		currentBytes += charBytes;
	}
	if (current) pushChunk(current);
	return chunks;
}
async function readMatrixStateChunks(store, keys, kind) {
	const records = await store.lookupMany?.(keys);
	const chunks = [];
	for (let index = 0; index < keys.length; index += 1) {
		const result = records?.[index];
		if (result && !result.ok) throw result.error;
		const chunk = records ? result?.value : await store.lookup(keys[index]);
		if (!isRecord(chunk) || chunk.kind !== kind || chunk.index !== index || typeof chunk.data !== "string") return null;
		chunks.push(chunk.data);
	}
	return chunks;
}
async function writeMatrixStateChunks(store, rows, chunkKeyPrefix) {
	for (const row of rows.chunks) await store.register(row.key, row.value);
	await store.register(rows.meta.key, rows.meta.value);
	for (const row of await store.entries()) if (row.key.startsWith(chunkKeyPrefix) && !rows.nextChunkKeys.has(row.key)) await store.delete(row.key);
}
//#endregion
//#region extensions/matrix/src/matrix/sqlite-state.ts
function resolveStateDirOverride(options) {
	if (!options) return;
	return options.stateDir || options.stateRootDir || getMatrixRuntime().state.resolveStateDir(options.env ?? process.env, os.homedir);
}
function resolveMatrixSqliteStateKey(options) {
	return resolveStateDirOverride(options) ?? "";
}
function resolveMatrixSqliteStateEnv(options) {
	const stateDir = resolveStateDirOverride(options);
	if (!stateDir) return options?.env;
	return {
		...options?.env ?? process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
}
//#endregion
//#region extensions/matrix/src/matrix/retired-state.ts
const RETIRED_MATRIX_STATE_FILENAMES = /* @__PURE__ */ new Set([
	"thread-bindings.json",
	"startup-verification.json",
	"recovery-key.json",
	"legacy-crypto-migration.json",
	"crypto-idb-snapshot.json",
	"storage-meta.json",
	"inbound-dedupe.json"
]);
async function assertMatrixSupportedStateRoot(rootDir) {
	for (const filename of RETIRED_MATRIX_STATE_FILENAMES) await assertMatrixSupportedStateFile(path.join(rootDir, filename));
}
const RETIRED_MATRIX_STATE_REMEDIATION = "Install OpenClaw 2026.9.5, run \"openclaw doctor --fix\", and start the Matrix channel once to migrate it, then upgrade to latest.";
function describeRetiredMatrixState(filePath) {
	return `Retired pre-July Matrix state at ${filePath} was left unchanged. ${RETIRED_MATRIX_STATE_REMEDIATION} See https://docs.openclaw.ai/channels/matrix-migration.`;
}
async function assertMatrixSupportedStateFile(filePath) {
	try {
		await fs.lstat(filePath);
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		throw error;
	}
	throw new Error(describeRetiredMatrixState(filePath));
}
//#endregion
export { describeRetiredMatrixState as a, chunkMatrixStateJson as c, assertMatrixSupportedStateRoot as i, readMatrixStateChunks as l, RETIRED_MATRIX_STATE_REMEDIATION as n, resolveMatrixSqliteStateEnv as o, assertMatrixSupportedStateFile as r, resolveMatrixSqliteStateKey as s, RETIRED_MATRIX_STATE_FILENAMES as t, writeMatrixStateChunks as u };
