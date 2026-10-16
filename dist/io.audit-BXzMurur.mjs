import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord, u as readStringField } from "./record-coerce-TIsquoVR.mjs";
import { p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { F as prepareSqliteAuditRecord } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CieLU95K.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as registerSqliteAuditRecordAsync } from "./sqlite-audit-record-store.async-1lh-4o2u.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CUHnuwqh.mjs";
import { n as CONFIG_SNAPSHOT_SCOPE, t as CONFIG_SNAPSHOT_KEY } from "./config-journal-snapshot.kernel-WY2QEkzC.mjs";
import { t as redactSensitiveArgv } from "./redact-argv-BHSPUYQR.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { replaceFileAtomic } from "@openclaw/fs-safe/atomic";
//#region src/config/config-journal-snapshot.ts
const CONFIG_JOURNAL_FINGERPRINT_KEY_FILENAME = "config-journal-fingerprint.key";
const CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES = 32;
const CONFIG_JOURNAL_REDACTION_MARKER = "***";
const configJournalFingerprintKeys = /* @__PURE__ */ new Map();
function loadConfigJournalFingerprintKey(params) {
	const context = resolveConfigAuditStoreContext(params);
	const stateDir = resolveStateDir(context.env, context.homedir);
	const keyPath = path.join(stateDir, CONFIG_JOURNAL_FINGERPRINT_KEY_FILENAME);
	const cached = configJournalFingerprintKeys.get(keyPath);
	if (cached && !params?.readOnly) return cached;
	try {
		let key;
		try {
			key = fs.readFileSync(keyPath);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
			if (params?.readOnly) return null;
			fs.mkdirSync(stateDir, {
				recursive: true,
				mode: 448
			});
			const created = randomBytes(CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES);
			try {
				const descriptor = fs.openSync(keyPath, "wx", 384);
				try {
					fs.writeFileSync(descriptor, created);
				} finally {
					fs.closeSync(descriptor);
				}
				key = created;
			} catch (createError) {
				if (createError.code !== "EEXIST") throw createError;
				key = fs.readFileSync(keyPath);
			}
		}
		if (key.length !== CONFIG_JOURNAL_FINGERPRINT_KEY_BYTES) return null;
		if (!params?.readOnly) {
			fs.chmodSync(keyPath, 384);
			configJournalFingerprintKeys.set(keyPath, key);
		}
		return key;
	} catch {
		return null;
	}
}
function fingerprintConfigSnapshotValue(value, key) {
	if (!key) return CONFIG_JOURNAL_REDACTION_MARKER;
	const serialized = JSON.stringify(value);
	return `fp:${createHmac("sha256", key).update(serialized ?? String(value)).digest("hex").slice(0, 12)}`;
}
function fingerprintConfigSnapshotLeaves(value, key) {
	if (Array.isArray(value)) return value.map((entry) => fingerprintConfigSnapshotLeaves(entry, key));
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([fieldKey, entry]) => [fieldKey, fingerprintConfigSnapshotLeaves(entry, key)]));
	return fingerprintConfigSnapshotValue(value, key);
}
function fingerprintConfigSnapshotAuthoredConfig(value, params) {
	const key = loadConfigJournalFingerprintKey(params);
	return fingerprintConfigSnapshotLeaves(structuredClone(value), key);
}
function resolveConfigAuditStoreContext(params) {
	return {
		env: params?.env ?? process.env,
		homedir: params?.homedir ?? homedir
	};
}
function resolveConfigAuditStoreEnv(params) {
	return {
		...params.env,
		OPENCLAW_STATE_DIR: resolveStateDir(params.env, params.homedir)
	};
}
/** Single owner of the slot's path-identity convention (resolve-normalized). */
function configSnapshotAuditRecordMatchesPath(snapshot, configPath) {
	return snapshot?.configPath === path.resolve(configPath);
}
function prepareConfigSnapshotAuditRecord(params) {
	return {
		configPath: path.resolve(params.configPath),
		rawHash: params.rawHash,
		fingerprintedAuthoredConfig: fingerprintConfigSnapshotAuthoredConfig(params.authoredConfig, params)
	};
}
async function readLatestConfigSnapshotAuditRecordAsync(params, assertCurrent) {
	assertCurrent?.();
	try {
		const env = resolveConfigAuditStoreEnv(resolveConfigAuditStoreContext(params));
		const context = captureOpenClawStateWorkerContext({ env });
		const result = await executeExistingOpenClawStateRead({ env }, { type: "config.snapshot.read" }, {
			context,
			current: true
		});
		context.admission.assertCurrent();
		assertCurrent?.();
		return result?.ok && result.type === "config.snapshot.read" ? result.snapshot : null;
	} catch {
		assertCurrent?.();
		return null;
	}
}
async function upsertConfigSnapshotAuditRecordAsync(params, assertCurrent) {
	assertCurrent?.();
	try {
		const snapshot = prepareConfigSnapshotAuditRecord(params);
		return await writeConfigSnapshotAuditRecord({
			...params,
			snapshot
		}, assertCurrent) ? snapshot : null;
	} catch {
		assertCurrent?.();
		return null;
	}
}
async function writeConfigSnapshotAuditRecord(params, assertCurrent) {
	assertCurrent?.();
	try {
		const env = resolveConfigAuditStoreEnv(resolveConfigAuditStoreContext(params));
		const context = captureOpenClawStateWorkerContext({ env });
		const input = {
			record: params.snapshot === null ? null : prepareSqliteAuditRecord(CONFIG_SNAPSHOT_SCOPE, {
				key: CONFIG_SNAPSHOT_KEY,
				value: params.snapshot,
				createdAt: Date.now()
			}),
			expectedPayloadJson: params.expectedSnapshot === null ? null : JSON.stringify(params.expectedSnapshot)
		};
		const written = await runOpenClawStateWorkerOperation(context, (store) => store.execute({
			type: "config.snapshot.upsert",
			input
		}), { assertCurrent });
		context.admission.assertCurrent();
		assertCurrent?.();
		return written;
	} catch {
		assertCurrent?.();
		return false;
	}
}
async function restoreConfigSnapshotAuditRecordAsync(params, assertCurrent) {
	await writeConfigSnapshotAuditRecord(params, assertCurrent);
}
//#endregion
//#region src/config/io.audit.ts
const CONFIG_AUDIT_ARGV_CAP = 8;
const CONFIG_AUDIT_PATH_CAP = 64;
const CONFIG_AUDIT_ISSUE_CAP = 64;
const CONFIG_SET_VALUE_OPTIONS = /* @__PURE__ */ new Set([
	"--batch-file",
	"--batch-json",
	"--container",
	"--log-level",
	"--profile",
	"--provider-allowlist",
	"--provider-arg",
	"--provider-command",
	"--provider-env",
	"--provider-max-bytes",
	"--provider-max-output-bytes",
	"--provider-mode",
	"--provider-no-output-timeout-ms",
	"--provider-pass-env",
	"--provider-path",
	"--provider-source",
	"--provider-timeout-ms",
	"--provider-trusted-dir",
	"--ref-id",
	"--ref-provider",
	"--ref-source",
	"--section"
]);
function findConfigPositionals(argv, startIndex, maxPositionals) {
	const positionals = [];
	let optionsEnded = false;
	for (let index = startIndex; index < argv.length && positionals.length < maxPositionals; index += 1) {
		const arg = argv[index];
		if (arg === void 0) break;
		if (!optionsEnded && arg === "--") {
			optionsEnded = true;
			continue;
		}
		if (!optionsEnded && arg.startsWith("-")) {
			const equalsIndex = arg.indexOf("=");
			const optionName = equalsIndex < 0 ? arg : arg.slice(0, equalsIndex);
			if (equalsIndex < 0 && CONFIG_SET_VALUE_OPTIONS.has(optionName)) index += 1;
			continue;
		}
		positionals.push(index);
	}
	return positionals;
}
function redactConfigAuditArgv(argv) {
	const redacted = redactSensitiveArgv(argv);
	let setIndex = -1;
	for (let index = 0; index < redacted.length; index += 1) {
		if (redacted[index] !== "config") continue;
		const [commandIndex] = findConfigPositionals(redacted, index + 1, 1);
		if (commandIndex !== void 0 && redacted[commandIndex] === "set") {
			setIndex = commandIndex;
			break;
		}
	}
	if (setIndex < 0) return redacted;
	for (let index = setIndex + 1; index < redacted.length; index += 1) {
		const arg = redacted[index];
		if (arg === void 0) break;
		if (arg === "--batch-json" && index + 1 < redacted.length) {
			redacted[index + 1] = "***";
			index += 1;
			continue;
		}
		if (arg.startsWith("--batch-json=")) redacted[index] = "--batch-json=***";
	}
	const positionals = findConfigPositionals(redacted, setIndex + 1, 2);
	if (positionals.length < 2) return redacted;
	const pathIndex = positionals[0];
	const valueIndex = positionals[1];
	const configPath = redacted[pathIndex];
	if (typeof configPath === "string" && isSensitiveConfigPath(configPath)) redacted[valueIndex] = "***";
	return redacted;
}
function capArgv(argv) {
	if (!Array.isArray(argv)) return [];
	return argv.slice(0, CONFIG_AUDIT_ARGV_CAP);
}
const CONFIG_AUDIT_SCOPE = "config-audit";
const CONFIG_AUDIT_MAX_ENTRIES = 5e4;
const CONFIG_AUDIT_STORE_LABEL = "SQLite diagnostic_events/config-audit state (latest 50000 rows)";
const LEGACY_CONFIG_AUDIT_LOG_FILENAME = ["config-audit", "jsonl"].join(".");
function createConfigObserveAuditRecord(params) {
	const { current, lastKnownGood, backup } = params;
	return {
		ts: current.observedAt,
		source: "config-io",
		event: "config.observe",
		phase: "read",
		configPath: params.configPath,
		...resolveConfigAuditProcessInfo(),
		exists: true,
		valid: params.valid,
		hash: current.hash,
		bytes: current.bytes,
		mtimeMs: current.mtimeMs,
		ctimeMs: current.ctimeMs,
		dev: current.dev,
		ino: current.ino,
		mode: current.mode,
		nlink: current.nlink,
		uid: current.uid,
		gid: current.gid,
		hasMeta: current.hasMeta,
		gatewayMode: current.gatewayMode,
		suspicious: params.suspicious,
		lastKnownGoodHash: lastKnownGood?.hash ?? null,
		lastKnownGoodBytes: lastKnownGood?.bytes ?? null,
		lastKnownGoodMtimeMs: lastKnownGood?.mtimeMs ?? null,
		lastKnownGoodCtimeMs: lastKnownGood?.ctimeMs ?? null,
		lastKnownGoodDev: lastKnownGood?.dev ?? null,
		lastKnownGoodIno: lastKnownGood?.ino ?? null,
		lastKnownGoodMode: lastKnownGood?.mode ?? null,
		lastKnownGoodNlink: lastKnownGood?.nlink ?? null,
		lastKnownGoodUid: lastKnownGood?.uid ?? null,
		lastKnownGoodGid: lastKnownGood?.gid ?? null,
		lastKnownGoodGatewayMode: lastKnownGood?.gatewayMode ?? null,
		backupHash: backup?.hash ?? null,
		backupBytes: backup?.bytes ?? null,
		backupMtimeMs: backup?.mtimeMs ?? null,
		backupCtimeMs: backup?.ctimeMs ?? null,
		backupDev: backup?.dev ?? null,
		backupIno: backup?.ino ?? null,
		backupMode: backup?.mode ?? null,
		backupNlink: backup?.nlink ?? null,
		backupUid: backup?.uid ?? null,
		backupGid: backup?.gid ?? null,
		backupGatewayMode: backup?.gatewayMode ?? null,
		clobberedPath: params.clobberedPath ?? null,
		restoredFromBackup: params.restoredFromBackup ?? false,
		restoredBackupPath: params.restoredBackupPath ?? null,
		restoreErrorCode: params.restoreErrorCode ?? null,
		restoreErrorMessage: params.restoreErrorMessage ?? null
	};
}
function resolveConfigAuditProcessInfo(processInfo) {
	const snapshot = processInfo || {
		pid: process.pid,
		ppid: process.ppid,
		cwd: process.cwd(),
		argv: process.argv,
		execArgv: process.execArgv
	};
	return {
		...snapshot,
		argv: redactConfigAuditArgv(capArgv(snapshot.argv)),
		execArgv: redactConfigAuditArgv(capArgv(snapshot.execArgv))
	};
}
function resolveLegacyConfigAuditLogPath(env, homedir) {
	return path.join(resolveStateDir(env, homedir), "logs", LEGACY_CONFIG_AUDIT_LOG_FILENAME);
}
function formatConfigOverwriteLogMessage(params) {
	const changeSummary = typeof params.changedPathCount === "number" ? `, changedPaths=${params.changedPathCount}` : "";
	return `Config overwrite: ${params.configPath} (sha256 ${params.previousHash ?? "unknown"} -> ${params.nextHash}, backup=${params.configPath}.bak${changeSummary})`;
}
function createConfigWriteAuditRecordBase(params) {
	const processSnapshot = resolveConfigAuditProcessInfo(params.processInfo);
	return {
		ts: params.now ?? (/* @__PURE__ */ new Date()).toISOString(),
		source: "config-io",
		event: "config.write",
		configPath: params.configPath,
		pid: processSnapshot.pid,
		ppid: processSnapshot.ppid,
		cwd: processSnapshot.cwd,
		argv: processSnapshot.argv,
		execArgv: processSnapshot.execArgv,
		watchMode: params.env.OPENCLAW_WATCH_MODE === "1",
		watchSession: normalizeNullableString(params.env.OPENCLAW_WATCH_SESSION),
		watchCommand: normalizeNullableString(params.env.OPENCLAW_WATCH_COMMAND),
		existsBefore: params.existsBefore,
		previousHash: params.previousHash,
		nextHash: params.nextHash,
		previousBytes: params.previousBytes,
		nextBytes: params.nextBytes,
		previousDev: params.previousMetadata.dev,
		previousIno: params.previousMetadata.ino,
		previousMode: params.previousMetadata.mode,
		previousNlink: params.previousMetadata.nlink,
		previousUid: params.previousMetadata.uid,
		previousGid: params.previousMetadata.gid,
		changedPathCount: typeof params.changedPathCount === "number" ? params.changedPathCount : null,
		...params.changedPaths ? { changedPaths: capConfigAuditPaths(params.changedPaths) } : {},
		...params.origin ? { origin: params.origin } : {},
		hasMetaBefore: params.hasMetaBefore,
		hasMetaAfter: params.hasMetaAfter,
		gatewayModeBefore: params.gatewayModeBefore,
		gatewayModeAfter: params.gatewayModeAfter,
		suspicious: params.suspicious
	};
}
function capConfigAuditEntries(values, cap) {
	if (values.length <= cap) return [...values];
	const visibleCount = Math.max(0, cap - 1);
	return [...values.slice(0, visibleCount), `…+${values.length - visibleCount} more`];
}
function capConfigAuditPaths(paths) {
	return capConfigAuditEntries([...new Set(paths)].toSorted(), CONFIG_AUDIT_PATH_CAP);
}
function capConfigAuditIssues(issues) {
	return capConfigAuditEntries(issues, CONFIG_AUDIT_ISSUE_CAP);
}
function finalizeConfigWriteAuditRecord(params) {
	const errorRecord = asOptionalObjectRecord(params.err);
	const errorCode = readStringField(errorRecord, "code");
	const errorMessage = readStringField(errorRecord, "message");
	const success = params.result !== "failed" && params.result !== "rejected";
	const nextMetadata = success ? params.nextMetadata : void 0;
	return {
		...params.base,
		result: params.result,
		nextHash: success ? params.base.nextHash : null,
		nextBytes: success ? params.base.nextBytes : null,
		nextDev: nextMetadata == null ? null : nextMetadata.dev,
		nextIno: nextMetadata == null ? null : nextMetadata.ino,
		nextMode: nextMetadata == null ? null : nextMetadata.mode,
		nextNlink: nextMetadata == null ? null : nextMetadata.nlink,
		nextUid: nextMetadata == null ? null : nextMetadata.uid,
		nextGid: nextMetadata == null ? null : nextMetadata.gid,
		...errorCode !== void 0 ? { errorCode } : {},
		...errorMessage !== void 0 ? { errorMessage } : {}
	};
}
async function scrubConfigAuditLog(params) {
	const auditPath = resolveLegacyConfigAuditLogPath(params.env, params.homedir);
	let raw;
	try {
		raw = await fs$1.readFile(auditPath, "utf-8");
	} catch (err) {
		if (err?.code === "ENOENT") return {
			scanned: 0,
			rewritten: 0,
			skipped: 0,
			aborted: false
		};
		throw err;
	}
	const originalByteLength = Buffer.byteLength(raw, "utf-8");
	let scanned = 0;
	let rewritten = 0;
	let skipped = 0;
	const outLines = [];
	const lines = raw.split("\n");
	for (const line of lines) {
		if (line.length === 0) {
			outLines.push(line);
			continue;
		}
		scanned += 1;
		let record;
		try {
			record = JSON.parse(line);
		} catch {
			outLines.push(line);
			skipped += 1;
			continue;
		}
		if (!record || typeof record !== "object" || Array.isArray(record)) {
			outLines.push(line);
			skipped += 1;
			continue;
		}
		const obj = record;
		let mutated = false;
		for (const key of ["argv", "execArgv"]) {
			const value = obj[key];
			if (!Array.isArray(value)) continue;
			if (!value.every((entry) => typeof entry === "string")) continue;
			const redacted = redactConfigAuditArgv(value);
			if (redacted.some((entry, index) => entry !== value[index])) {
				obj[key] = redacted;
				mutated = true;
			}
		}
		if (mutated) {
			rewritten += 1;
			outLines.push(JSON.stringify(obj));
		} else outLines.push(line);
	}
	if (rewritten === 0 || params.dryRun) return {
		scanned,
		rewritten,
		skipped,
		aborted: false
	};
	const appended = /* @__PURE__ */ new Error("Config audit log changed before scrub publication");
	try {
		const directory = await fs$1.realpath(path.dirname(auditPath));
		await replaceFileAtomic({
			filePath: path.join(directory, path.basename(auditPath)),
			content: outLines.join("\n"),
			mode: 384 & ~process.umask(),
			dirMode: (await fs$1.stat(directory)).mode & 4095,
			beforeRename: async ({ filePath }) => {
				if (await fs$1.stat(filePath).then((stat) => stat.size, () => void 0) !== originalByteLength) throw appended;
			}
		});
	} catch (error) {
		if (error === appended) return {
			scanned,
			rewritten,
			skipped,
			aborted: true
		};
		throw error;
	}
	return {
		scanned,
		rewritten,
		skipped,
		aborted: false
	};
}
function openConfigAuditStore(env) {
	return createSqliteAuditRecordStore({
		scope: CONFIG_AUDIT_SCOPE,
		maxEntries: CONFIG_AUDIT_MAX_ENTRIES,
		env
	});
}
/** Reads a bounded newest-first audit window for Doctor provenance checks. */
function readRecentConfigAuditRecords(params) {
	try {
		return openConfigAuditStore(resolveConfigAuditStoreEnv(params)).latest({ limit: params.limit }).map(({ value }) => value);
	} catch {
		return [];
	}
}
function configAuditEntryKey(record) {
	return `${record.ts}:${record.event}:${randomUUID()}`;
}
function sanitizeConfigAuditRecord(record) {
	const sanitized = structuredClone(record);
	if (sanitized.event !== "config.external") {
		sanitized.argv = redactConfigAuditArgv(capArgv(sanitized.argv));
		sanitized.execArgv = redactConfigAuditArgv(capArgv(sanitized.execArgv));
	}
	return redactSecrets(sanitized);
}
async function appendConfigAuditRecord(params, assertCurrent) {
	assertCurrent?.();
	try {
		const record = sanitizeConfigAuditRecord(params.record);
		await registerSqliteAuditRecordAsync({
			scope: CONFIG_AUDIT_SCOPE,
			maxEntries: CONFIG_AUDIT_MAX_ENTRIES,
			env: resolveConfigAuditStoreEnv(params),
			assertCurrent
		}, {
			key: configAuditEntryKey(record),
			value: record,
			createdAt: Date.parse(record.ts)
		});
	} catch {
		assertCurrent?.();
	}
}
function appendConfigAuditRecordSync(params) {
	try {
		const record = sanitizeConfigAuditRecord(params.record);
		openConfigAuditStore(resolveConfigAuditStoreEnv(params)).register(configAuditEntryKey(record), record, Date.parse(record.ts));
	} catch {}
}
//#endregion
export { fingerprintConfigSnapshotAuthoredConfig as _, appendConfigAuditRecordSync as a, upsertConfigSnapshotAuditRecordAsync as b, createConfigObserveAuditRecord as c, formatConfigOverwriteLogMessage as d, readRecentConfigAuditRecords as f, configSnapshotAuditRecordMatchesPath as g, scrubConfigAuditLog as h, appendConfigAuditRecord as i, createConfigWriteAuditRecordBase as l, sanitizeConfigAuditRecord as m, CONFIG_AUDIT_SCOPE as n, capConfigAuditIssues as o, resolveLegacyConfigAuditLogPath as p, CONFIG_AUDIT_STORE_LABEL as r, capConfigAuditPaths as s, CONFIG_AUDIT_MAX_ENTRIES as t, finalizeConfigWriteAuditRecord as u, readLatestConfigSnapshotAuditRecordAsync as v, restoreConfigSnapshotAuditRecordAsync as y };
