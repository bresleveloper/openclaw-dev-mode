import os from "node:os";
import { randomBytes } from "node:crypto";
//#region src/infra/backup-retention.ts
function normalizeBackupRetention(options) {
	const result = {};
	for (const key of [
		"keepDaily",
		"keepWeekly",
		"keepMonthly"
	]) {
		const value = options[key];
		if (value === void 0) continue;
		const count = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
		if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) throw new Error(`--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} must be a nonnegative integer.`);
		result[key] = count;
	}
	return result;
}
function resolveBackupNamespace(namespace) {
	const value = namespace ?? os.hostname().replace(/[^A-Za-z0-9._-]/g, "-");
	if (!/^[A-Za-z0-9._-]{1,128}$/.test(value) || value === "." || value === "..") throw new Error("Backup namespace must be 1–128 letters, digits, dots, underscores or hyphens, and cannot be . or .. .");
	return value;
}
function createRemoteBackupKey(nowMs = Date.now()) {
	return `${new Date(nowMs).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}-${randomBytes(4).toString("hex")}.tar.gz`;
}
/** Only consumer-owned keys with real UTC timestamps participate in listing or deletion. */
function parseRemoteBackupTimestamp(key) {
	const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z-[a-f0-9]{8}\.tar\.gz$/.exec(key);
	if (!match) return;
	const iso = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}.000Z`;
	const timestamp = Date.parse(iso);
	return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === iso ? timestamp : void 0;
}
/** Keep the newest snapshot in each selected nonempty UTC calendar bucket (Monday weeks). */
function selectBackupRetention(keys, options) {
	const backups = [...new Set(keys)].flatMap((key) => {
		const timestamp = parseRemoteBackupTimestamp(key);
		return timestamp === void 0 ? [] : [{
			key,
			timestamp
		}];
	}).toSorted((a, b) => b.timestamp - a.timestamp || b.key.localeCompare(a.key));
	if (Object.values(options).every((value) => value === void 0)) return {
		kept: backups.map(({ key }) => key),
		deleted: []
	};
	const kept = new Set(backups.slice(0, 1).map(({ key }) => key));
	const buckets = {
		keepDaily: /* @__PURE__ */ new Set(),
		keepWeekly: /* @__PURE__ */ new Set(),
		keepMonthly: /* @__PURE__ */ new Set()
	};
	for (const { key, timestamp } of backups) {
		const date = new Date(timestamp);
		const day = date.toISOString().slice(0, 10);
		const month = day.slice(0, 7);
		date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
		const week = date.toISOString().slice(0, 10);
		for (const [period, bucket] of [
			["keepDaily", day],
			["keepWeekly", week],
			["keepMonthly", month]
		]) {
			const seen = buckets[period];
			if (!seen.has(bucket) && seen.size < (options[period] ?? 0)) {
				kept.add(key);
				seen.add(bucket);
			}
		}
	}
	return {
		kept: backups.filter(({ key }) => kept.has(key)).map(({ key }) => key),
		deleted: backups.filter(({ key }) => !kept.has(key)).map(({ key }) => key)
	};
}
//#endregion
export { selectBackupRetention as a, resolveBackupNamespace as i, normalizeBackupRetention as n, parseRemoteBackupTimestamp as r, createRemoteBackupKey as t };
