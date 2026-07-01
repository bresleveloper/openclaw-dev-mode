import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region extensions/feishu/src/dedup-migrations.ts
const DEDUP_TTL_MS = 1440 * 60 * 1e3;
const STORE_MAX_ENTRIES = 1e4;
function safeNamespaceFromFileName(fileName) {
	if (!fileName.endsWith(".json")) return null;
	const namespace = fileName.slice(0, -5).trim();
	return namespace ? namespace : null;
}
function readLegacyDedupeData(filePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
		const out = {};
		for (const [messageId, seenAt] of Object.entries(parsed)) if (typeof seenAt === "number" && Number.isFinite(seenAt) && seenAt > 0) out[messageId] = seenAt;
		return out;
	} catch {
		return {};
	}
}
function dedupeStoreKey(namespace, messageId) {
	return createHash("sha256").update(`${namespace}\0${messageId}`, "utf8").digest("hex").slice(0, 32);
}
function remainingTtlMs(seenAt, now) {
	return Math.max(1, DEDUP_TTL_MS - (now - seenAt));
}
function buildMigrationEntries(namespace, sourcePath, now) {
	return Object.entries(readLegacyDedupeData(sourcePath)).flatMap(([messageId, seenAt]) => {
		if (now - seenAt >= DEDUP_TTL_MS) return [];
		return [{
			key: dedupeStoreKey(namespace, messageId),
			value: {
				namespace,
				messageId,
				seenAt
			},
			ttlMs: remainingTtlMs(seenAt, now)
		}];
	});
}
const detectFeishuLegacyStateMigrations = ({ stateDir }) => {
	const dedupDir = path.join(stateDir, "feishu", "dedup");
	let entries;
	try {
		entries = fs.readdirSync(dedupDir, { withFileTypes: true });
	} catch {
		return [];
	}
	const now = Date.now();
	return entries.flatMap((entry) => {
		if (!entry.isFile()) return [];
		const namespace = safeNamespaceFromFileName(entry.name);
		if (!namespace) return [];
		const sourcePath = path.join(dedupDir, entry.name);
		if (buildMigrationEntries(namespace, sourcePath, now).length === 0) return [];
		return [{
			kind: "plugin-state-import",
			label: `Feishu ${namespace} dedupe`,
			sourcePath,
			targetPath: `plugin state:dedup.${namespace}`,
			pluginId: "feishu",
			namespace: `dedup.${namespace}`,
			maxEntries: STORE_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			readEntries: () => buildMigrationEntries(namespace, sourcePath, now)
		}];
	});
};
//#endregion
export { detectFeishuLegacyStateMigrations };
