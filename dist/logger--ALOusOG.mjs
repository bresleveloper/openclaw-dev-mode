import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as loggingState, t as APPLIED_LOGGING_CONFIG_UNOWNED } from "./state-UxwJeH7V.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as appendRegularFileSync, t as appendRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { K as invalidateLoggingConfigCache, S as resolveFileLogRedactOptions, _ as redactSensitiveText, p as redactSecrets, q as readLoggingConfig, w as serializeRedactedFileLogRecord } from "./redact-B5EGyLvV.mjs";
import { A as isValidDiagnosticTraceFlags, G as hasInternalDiagnosticEventInterest, O as getActiveDiagnosticTraceContext, j as isValidDiagnosticTraceId, k as isValidDiagnosticSpanId, n as emitDiagnosticEvent, r as emitDiagnosticEventWithTrustedTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { n as formatConsoleDiagnosticLine } from "./json-console-line-BEWeG-Rv.mjs";
import { i as tryParseLogLevel, n as levelToMinLevel, r as normalizeLogLevel, t as ALLOWED_LOG_LEVELS } from "./levels-qpAN12Fm.mjs";
import { n as resolvePreferredOpenClawTmpDir, t as DEFAULT_POSIX_TMP_ROOT } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
import { Logger } from "tslog";
//#region src/logging/env-log-level.ts
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
function resolveEnvLogLevelOverride() {
	const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
	if (!trimmed) {
		loggingState.invalidEnvLogLevelValue = null;
		return;
	}
	const parsed = tryParseLogLevel(trimmed);
	if (parsed) {
		loggingState.invalidEnvLogLevelValue = null;
		return parsed;
	}
	if (loggingState.invalidEnvLogLevelValue !== trimmed) {
		loggingState.invalidEnvLogLevelValue = trimmed;
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	}
}
//#endregion
//#region src/logging/log-file-shared.ts
const LOG_PREFIX = "openclaw";
const LOG_SUFFIX = ".log";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
function formatLocalDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//#endregion
//#region src/logging/log-file-path.ts
const ROLLING_LOG_FILE_RE = /^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u;
const MAX_LOG_PROFILE_SEGMENT_LENGTH = 220;
function encodeLogProfileSegment(profile) {
	let encoded = "";
	for (const char of profile) if (/^[a-z0-9]$/u.test(char)) encoded += char;
	else if (char === "-") encoded += "--";
	else if (char === "_") encoded += "-0";
	else if (/^[A-Z]$/u.test(char)) encoded += `-1${char.toLowerCase()}`;
	else encoded += `-2${char.codePointAt(0)?.toString(16) ?? "0"}-`;
	return encoded;
}
function resolveLogProfileSegment(env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	const encoded = encodeLogProfileSegment(profile);
	if (encoded.length <= MAX_LOG_PROFILE_SEGMENT_LENGTH) return encoded;
	return `-3${createHash("sha256").update(profile).digest("hex")}`;
}
/** Resolves today's default rolling log path for the active CLI profile. */
function resolveDefaultRollingLogFile(options) {
	const date = options?.date ?? /* @__PURE__ */ new Date();
	const env = options?.env ?? process.env;
	const logDir = options?.logDir ?? (canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : "/tmp/openclaw");
	const profileSegment = resolveLogProfileSegment(env);
	const profileSuffix = profileSegment ? `-${profileSegment}` : "";
	return path.join(logDir, `${LOG_PREFIX}${profileSuffix}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Resolves the configured log file or today's rolling default log path. */
function resolveConfiguredLogFilePath(config, options) {
	return config?.logging?.file ?? resolveDefaultRollingLogFile(options);
}
/** Returns whether a path is one of OpenClaw's dated rolling log files. */
function isRollingLogFilePath(file) {
	return ROLLING_LOG_FILE_RE.test(path.basename(file));
}
/** Returns whether a configured path had the legacy default rolling filename shape. */
function isLegacyRollingLogFilePath(file) {
	const base = path.basename(file);
	return base === `openclaw-YYYY-MM-DD.log` || ROLLING_LOG_FILE_RE.exec(base)?.[1] === "openclaw";
}
/** Advances a rolling log path to the requested date while preserving its profile family. */
function resolveRollingLogFilePathForDate(file, date) {
	const match = ROLLING_LOG_FILE_RE.exec(path.basename(file));
	if (!match) return isLegacyRollingLogFilePath(file) ? path.join(path.dirname(file), `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`) : file;
	return path.join(path.dirname(file), `${match[1]}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Returns whether two dated rolling paths belong to the same profile family. */
function isSameRollingLogFileFamily(left, right) {
	const leftMatch = ROLLING_LOG_FILE_RE.exec(path.basename(left));
	const rightMatch = ROLLING_LOG_FILE_RE.exec(path.basename(right));
	return Boolean(leftMatch && rightMatch && leftMatch[1] === rightMatch[1]);
}
//#endregion
//#region src/logging/logger-file-message.ts
const MAX_FILE_LOG_MESSAGE_CHARS = 4096;
function clampMessage(text) {
	return text.length > MAX_FILE_LOG_MESSAGE_CHARS ? `${truncateUtf16Safe(text, MAX_FILE_LOG_MESSAGE_CHARS)}...(truncated)` : text;
}
function stringifyFileLogMessagePart(value, json) {
	if (json) return JSON.stringify(value);
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (isRecord(value) && typeof value.message === "string") return value.message;
}
function buildFileLogMessage(record, parts) {
	const text = [];
	const spans = [];
	let length = 0;
	for (const { key, json, primitiveText } of parts) {
		const value = record[key];
		const part = primitiveText ?? stringifyFileLogMessagePart(value, json);
		if (!part?.trim()) continue;
		if (text.length > 0) length += 1;
		spans.push({
			key,
			json,
			messageField: !json && isRecord(value),
			start: length,
			...primitiveText === void 0 ? {} : { primitiveLength: primitiveText.length }
		});
		text.push(part);
		length += part.length;
	}
	if (text.length === 0) return;
	const joined = text.join(" ");
	const prefix = truncateUtf16Safe(joined, MAX_FILE_LOG_MESSAGE_CHARS);
	const textValue = clampMessage(joined);
	return {
		text: textValue,
		contentLength: prefix.length,
		finish: (value) => value === textValue ? value : clampMessage(value),
		parts: spans
	};
}
//#endregion
//#region src/logging/logger-file-transport.ts
const DEFAULT_MAX_QUEUED_RECORDS = 4096;
const MAX_APPEND_BATCH_BYTES = 65536;
const MAX_ROTATED_LOG_FILES = 5;
const MAX_TRACKED_APPEND_FAILURE_FILES = 64;
let queue = [];
let queueStart = 0;
let activeBatch = null;
let activeIndex = 0;
let droppedCount = 0;
let droppedTarget = null;
let maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
let scheduledFlush = null;
let flushPromise = null;
let drainGeneration = 0;
let processExiting = false;
let processHooksInstalled = false;
let appendFile = appendRegularFile;
const warnedRotationFiles = /* @__PURE__ */ new Map();
const warnedAppendFiles = /* @__PURE__ */ new Set();
let appendFailureTrackingSaturated = false;
function rotatedLogPath(file, index) {
	const ext = path.extname(file);
	return `${file.slice(0, file.length - ext.length)}.${index}${ext}`;
}
function rotateLogFile(file) {
	try {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
		for (let index = 4; index >= 1; index -= 1) {
			const from = rotatedLogPath(file, index);
			if (fs.existsSync(from)) fs.renameSync(from, rotatedLogPath(file, index + 1));
		}
		if (fs.existsSync(file)) fs.renameSync(file, rotatedLogPath(file, 1));
		return true;
	} catch {
		return false;
	}
}
async function getCurrentLogFileBytes(file) {
	try {
		return (await fs$1.stat(file)).size;
	} catch {
		return 0;
	}
}
function getCurrentLogFileBytesSync(file) {
	try {
		return fs.statSync(file).size;
	} catch {
		return 0;
	}
}
function buildDroppedMarker(target, count) {
	const date = /* @__PURE__ */ new Date();
	const message = `[openclaw] file log queue overflow; dropped ${count} oldest record${count === 1 ? "" : "s"}`;
	const record = {
		0: message,
		_meta: {
			date,
			hostname: target.hostname,
			logLevelName: "WARN",
			name: "openclaw"
		},
		time: formatTimestamp(date, { style: "long" }),
		hostname: target.hostname,
		message,
		dropped: count
	};
	return {
		...target,
		payload: `${serializeRedactedFileLogRecord(record)}\n`
	};
}
function writeFileTransportWarning(message, synchronous) {
	try {
		const redactedMessage = redactSensitiveText(message);
		const line = `${formatConsoleDiagnosticLine({
			level: "warn",
			message: redactedMessage
		})}\n`;
		if (synchronous) fs.writeSync(process.stderr.fd, line);
		else process.stderr.write(line);
		return true;
	} catch {
		return false;
	}
}
function warnAboutRotationFailure(entry, synchronous) {
	if (warnedRotationFiles.get(entry.file) === entry.maxFileBytes) return;
	warnedRotationFiles.set(entry.file, entry.maxFileBytes);
	writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${entry.file} maxFileBytes=${entry.maxFileBytes}`, synchronous);
}
function warnAboutAppendFailure(entry, synchronous) {
	if (warnedAppendFiles.has(entry.file)) return;
	const saturated = warnedAppendFiles.size >= MAX_TRACKED_APPEND_FAILURE_FILES;
	if (saturated && appendFailureTrackingSaturated) return;
	if (!writeFileTransportWarning(saturated ? "[openclaw] log file append failure diagnostics saturated; suppressing new file targets" : `[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${entry.file}`, synchronous)) return;
	if (saturated) appendFailureTrackingSaturated = true;
	else warnedAppendFiles.add(entry.file);
}
function clearAppendFailure(entry) {
	if (warnedAppendFiles.delete(entry.file)) appendFailureTrackingSaturated = false;
}
function claimQueuedEntries() {
	const entries = queueStart === 0 ? queue : [...queue.slice(queueStart), ...queue.slice(0, queueStart)];
	queue = [];
	queueStart = 0;
	if (droppedCount > 0 && droppedTarget) entries.unshift(buildDroppedMarker(droppedTarget, droppedCount));
	droppedCount = 0;
	droppedTarget = null;
	return entries;
}
function prepareWrite(entry, cursor, synchronous, entries, index) {
	let payloadBytes = Buffer.byteLength(entry.payload, "utf8");
	if (cursor.bytes > 0 && cursor.bytes + payloadBytes > entry.maxFileBytes) {
		if (rotateLogFile(entry.file)) {
			cursor.bytes = 0;
			warnedRotationFiles.delete(entry.file);
		} else warnAboutRotationFailure(entry, synchronous);
	}
	let nextIndex = index + 1;
	if (synchronous) return {
		payload: entry.payload,
		payloadBytes,
		nextIndex
	};
	const payloads = [entry.payload];
	for (; nextIndex < entries.length; nextIndex += 1) {
		const next = entries[nextIndex];
		if (!next || next.file !== entry.file || next.maxFileBytes !== entry.maxFileBytes) break;
		const nextBytes = Buffer.byteLength(next.payload, "utf8");
		if (payloadBytes + nextBytes > MAX_APPEND_BATCH_BYTES || cursor.bytes + payloadBytes + nextBytes > entry.maxFileBytes) break;
		payloads.push(next.payload);
		payloadBytes += nextBytes;
	}
	return {
		payload: payloads.join(""),
		payloadBytes,
		nextIndex
	};
}
async function writeEntries(entries, generation) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		if (generation !== drainGeneration || processExiting) return;
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: await getCurrentLogFileBytes(entry.file) };
			if (generation !== drainGeneration || processExiting) return;
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, false, entries, index);
		activeIndex = batch.nextIndex;
		try {
			await appendFile({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, false);
		} finally {
			for (const written of entries.slice(index, batch.nextIndex)) written.payload = "";
			index = batch.nextIndex;
		}
	}
}
function writeEntriesSync(entries) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: getCurrentLogFileBytesSync(entry.file) };
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, true, entries, index);
		try {
			appendRegularFileSync({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, true);
		}
		entry.payload = "";
		index = batch.nextIndex;
	}
}
async function runFlushLoop() {
	const generation = drainGeneration;
	for (;;) {
		if (generation !== drainGeneration || processExiting) return;
		const entries = claimQueuedEntries();
		if (entries.length === 0) return;
		activeBatch = entries;
		activeIndex = 0;
		await writeEntries(entries, generation);
		if (generation !== drainGeneration) return;
		activeBatch = null;
		activeIndex = 0;
	}
}
function startFlush() {
	if (flushPromise || processExiting) return;
	const running = runFlushLoop().catch(() => void 0);
	flushPromise = running;
	running.then(() => {
		if (flushPromise === running) flushPromise = null;
		if (queue.length > 0 || droppedCount > 0) scheduleFlush();
	});
}
function scheduleFlush() {
	if (scheduledFlush || flushPromise || processExiting) return;
	scheduledFlush = setImmediate(() => {
		scheduledFlush = null;
		startFlush();
	});
}
function handleProcessBeforeExit() {
	flushFileLogQueue();
}
function handleProcessExit() {
	processExiting = true;
	drainFileLogQueueSync();
}
function installProcessHooks() {
	if (processHooksInstalled) return;
	processHooksInstalled = true;
	process.on("beforeExit", handleProcessBeforeExit);
	process.on("exit", handleProcessExit);
}
function removeProcessHooks() {
	if (!processHooksInstalled) return;
	process.removeListener("beforeExit", handleProcessBeforeExit);
	process.removeListener("exit", handleProcessExit);
	processHooksInstalled = false;
}
if (process.env.VITEST !== "true") installProcessHooks();
/** Enqueues one serialized record without waiting for filesystem I/O. */
function enqueueFileLog(entry) {
	if (processExiting) {
		writeEntriesSync([entry]);
		return;
	}
	installProcessHooks();
	if (queue.length >= maxQueuedRecords) {
		const dropped = queue[queueStart];
		if (dropped) {
			dropped.payload = "";
			droppedTarget ??= dropped;
			droppedCount += 1;
		}
		queue[queueStart] = entry;
		queueStart = (queueStart + 1) % queue.length;
	} else queue.push(entry);
	scheduleFlush();
}
/** Waits until every record currently queued for the async transport has settled. */
async function flushFileLogQueue() {
	for (;;) {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = null;
		}
		if (!flushPromise && (queue.length > 0 || droppedCount > 0)) startFlush();
		const running = flushPromise;
		if (!running) return;
		await running;
	}
}
/** Synchronously rescues pending records for process.exit() and crash-adjacent paths. */
function drainFileLogQueueSync() {
	if (scheduledFlush) {
		clearImmediate(scheduledFlush);
		scheduledFlush = null;
	}
	drainGeneration += 1;
	const entries = activeBatch ? activeBatch.slice(activeIndex) : [];
	activeBatch = null;
	activeIndex = 0;
	entries.push(...claimQueuedEntries());
	writeEntriesSync(entries);
}
function setFileLogQueueMaxRecordsForTests(value) {
	maxQueuedRecords = Math.max(1, value ?? DEFAULT_MAX_QUEUED_RECORDS);
}
function setFileLogAppenderForTests(value) {
	appendFile = value ?? appendRegularFile;
}
function resetFileLogTransportForTests() {
	drainFileLogQueueSync();
	removeProcessHooks();
	processExiting = false;
	appendFile = appendRegularFile;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	warnedRotationFiles.clear();
	warnedAppendFiles.clear();
	appendFailureTrackingSaturated = false;
}
const fileLogTransport = {
	drainSync: drainFileLogQueueSync,
	enqueue: enqueueFileLog,
	flush: flushFileLogQueue,
	resetForTests: resetFileLogTransportForTests,
	setAppenderForTests: setFileLogAppenderForTests,
	setMaxQueuedRecordsForTests: setFileLogQueueMaxRecordsForTests
};
//#endregion
//#region src/logging/logger-hostname-state.ts
const defaultLoggerHostnameResolver = () => os.hostname();
const loggerHostnameState = {
	cached: null,
	resolver: defaultLoggerHostnameResolver
};
//#endregion
//#region src/logging/logger-settings-internal.ts
let resolveLoggerFileTarget;
function setLoggerFileTargetResolver(resolver) {
	resolveLoggerFileTarget = resolver;
}
function getResolvedLoggerFileTarget() {
	if (!resolveLoggerFileTarget) throw new Error("Logger file target resolver is not initialized");
	return resolveLoggerFileTarget();
}
//#endregion
//#region src/logging/logger.ts
const DEFAULT_LOG_FILE = `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
const MAX_LOG_AGE_MS = 864e5;
const DEFAULT_MAX_LOG_FILE_BYTES = 104857600;
const MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8192;
const MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4096;
function invalidateLoggerSettings() {
	loggingState.cachedLogger = null;
	loggingState.cachedSettings = null;
	loggingState.cachedConsoleSettings = null;
}
/** Publishes authoritative config-derived logging state for the active runtime. */
function applyLoggingConfig(config) {
	loggingState.appliedConfig = config;
	invalidateLoggingConfigCache();
	invalidateLoggerSettings();
}
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
const MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2048;
const MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
const MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
const DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
function clampDiagnosticLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampDiagnosticLogText(redactSensitiveText(clampDiagnosticLogText(value, maxChars)), maxChars);
}
function normalizeDiagnosticLogName(value) {
	if (!value || value.trim().startsWith("{")) return;
	const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
	if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) return;
	const normalizedKey = key.trim();
	if (isBlockedObjectKey(normalizedKey)) return;
	if (redactSensitiveText(normalizedKey) !== normalizedKey) return;
	if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) return;
	if (typeof value === "string") {
		attributes[normalizedKey] = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
		state.count += 1;
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[normalizedKey] = value;
		state.count += 1;
		return;
	}
	if (typeof value === "boolean") {
		attributes[normalizedKey] = value;
		state.count += 1;
	}
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
	if (!source) return;
	for (const key in source) {
		if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) break;
		if (!Object.hasOwn(source, key) || key === "trace") continue;
		assignDiagnosticLogAttribute(attributes, state, key, source[key]);
	}
}
function isPlainLogRecordObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (!isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function extractTraceContext(value) {
	const direct = normalizeTraceContext(value);
	if (direct) return direct;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return normalizeTraceContext(value.trace);
}
function getSortedNumericLogEntries(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0]));
}
function clampFileLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return String(value);
}
function readFirstContextString(sources, keys) {
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			const value = normalizeFileLogContextValue(source[key]);
			if (value) return value;
		}
	}
}
function resolveLogHostname() {
	if (loggerHostnameState.cached) return loggerHostnameState.cached;
	const hostname = loggerHostnameState.resolver().trim();
	if (!hostname) return "unknown";
	loggerHostnameState.cached = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return meta;
	return {
		...meta,
		hostname
	};
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
	const fromBindings = extractTraceContext(bindings);
	if (fromBindings) return fromBindings;
	for (const arg of numericArgs) {
		const fromArg = extractTraceContext(arg);
		if (fromArg) return fromArg;
	}
}
function resolveLogTraceContext(bindings, numericArgs) {
	const explicitTrace = findLogTraceContext(bindings, numericArgs);
	if (explicitTrace) return {
		trace: explicitTrace,
		trustedTraceContext: false
	};
	const activeTrace = getActiveDiagnosticTraceContext();
	return activeTrace ? {
		trace: activeTrace,
		trustedTraceContext: true
	} : { trustedTraceContext: false };
}
function prepareFileLogRecord(logObj) {
	const entries = getSortedNumericLogEntries(logObj);
	const { bindings, args } = extractLogBindingPrefix(entries.map(([, value]) => value));
	const { trace } = resolveLogTraceContext(bindings, args);
	const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
	const sources = [
		structuredArg,
		bindings,
		logObj
	];
	const metadataCount = structuredArg && typeof structuredArg.message !== "string" ? 1 : 0;
	const messageParts = entries.slice(entries.length - args.length + metadataCount).map(([key, value]) => {
		const part = {
			key,
			json: value != null && ![
				"string",
				"number",
				"boolean",
				"bigint"
			].includes(typeof value) && !(value instanceof Error) && !(isPlainLogRecordObject(value) && typeof value.message === "string")
		};
		if (typeof value === "number" && !Number.isFinite(value)) part.primitiveText = String(value);
		return part;
	});
	const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
	const sessionId = readFirstContextString(sources, [
		"session_id",
		"sessionId",
		"sessionKey"
	]);
	const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
	return {
		fields: {
			hostname: resolveLogHostname(),
			...agentId ? { agent_id: agentId } : {},
			...sessionId ? { session_id: sessionId } : {},
			...channel ? { channel } : {},
			...trace
		},
		messageParts
	};
}
function buildDiagnosticLogRecord(logObj) {
	const meta = logObj["_meta"];
	const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogEntries(logObj).map(([, value]) => value));
	const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
	const structuredArg = numericArgs[0];
	const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
	if (structuredBindings) numericArgs.shift();
	let message = "";
	if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") message = sanitizeDiagnosticLogText(String(numericArgs.pop()), MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS);
	else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
		message = String(numericArgs[0]);
		numericArgs.length = 0;
	}
	if (!message) message = "log";
	const attributes = Object.create(null);
	const attributeState = { count: 0 };
	addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
	addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
	const code = {};
	if (meta?.path?.fileLine) {
		const line = Number(meta.path.fileLine);
		if (Number.isFinite(line)) code.line = line;
	}
	if (meta?.path?.method) code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	const loggerName = normalizeDiagnosticLogName(meta?.name);
	const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
	return {
		event: {
			type: "log.record",
			level: meta?.logLevelName ?? "INFO",
			message,
			...loggerName ? { loggerName } : {},
			...loggerParents?.length ? { loggerParents } : {},
			...Object.keys(attributes).length > 0 ? { attributes } : {},
			...Object.keys(code).length > 0 ? { code } : {},
			...trace ? { trace } : {}
		},
		trustedTraceContext
	};
}
function attachDiagnosticEventTransport(logger) {
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("log.record")) return;
			try {
				const record = buildDiagnosticLogRecord(redactSecrets(logObj));
				(record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent)(record.event);
			} catch {}
		}
	});
}
function canUseSilentVitestFileLogFastPath(envLevel) {
	return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") return path.join(process.cwd(), ".artifacts", "test-logs", `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`);
	return resolveDefaultRollingLogFile();
}
function resolveSettings() {
	if (!canUseNodeFs()) return {
		level: "silent",
		file: DEFAULT_LOG_FILE,
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: false
	};
	const envLevel = resolveEnvLogLevelOverride();
	if (canUseSilentVitestFileLogFastPath(envLevel)) return {
		level: "silent",
		file: resolveDefaultRollingLogFile(),
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: true
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
	const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
	const level = envLevel ?? fromConfig;
	const rolling = cfg?.file ? isLegacyRollingLogFilePath(cfg.file) : true;
	return {
		level,
		file: resolveActiveLogFileWithMode(cfg?.file ?? resolveDefaultActiveLogFile(), rolling),
		maxFileBytes: resolveMaxLogFileBytes(cfg?.maxFileBytes),
		rolling
	};
}
setLoggerFileTargetResolver(() => {
	const { file, rolling } = resolveSettings();
	return {
		file,
		rolling
	};
});
function getRuntimeSettings() {
	const settings = loggingState.cachedSettings ?? resolveSettings();
	loggingState.cachedSettings = settings;
	return settings;
}
function isFileLogLevelEnabled(level) {
	const settings = getRuntimeSettings();
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function inheritLogLevel(logger, getLevel) {
	let resolveLevel = getLevel;
	Object.defineProperty(logger.settings, "minLevel", {
		configurable: true,
		enumerable: true,
		get: () => resolveLevel(),
		set: (level) => {
			resolveLevel = () => level;
		}
	});
}
var RuntimeLogger = class extends Logger {
	getSubLogger(settings, logObj) {
		const minLevel = settings?.minLevel ?? this.settings.minLevel;
		const child = super.getSubLogger({
			...settings,
			minLevel: minLevel === Infinity ? levelToMinLevel("fatal") : minLevel
		}, logObj);
		if (settings?.minLevel == null) inheritLogLevel(child, () => this.settings.minLevel);
		else if (minLevel === Infinity) child.settings.minLevel = minLevel;
		return child;
	}
};
function buildLogger() {
	const logger = new RuntimeLogger({
		name: "openclaw",
		mask: { keys: [] },
		meta: { property: "_meta" },
		minLevel: levelToMinLevel("fatal"),
		type: "hidden"
	});
	inheritLogLevel(logger, () => levelToMinLevel(getRuntimeSettings().level));
	let activeFile;
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			try {
				const settings = getRuntimeSettings();
				if (settings.level === "silent") return;
				const nextActiveFile = resolveActiveLogFileWithMode(settings.file, settings.rolling);
				if (nextActiveFile !== activeFile) {
					activeFile = nextActiveFile;
					fs.mkdirSync(path.dirname(activeFile), { recursive: true });
					if (settings.rolling) pruneOldRollingLogs(path.dirname(activeFile));
				}
				const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
				const { fields, messageParts } = prepareFileLogRecord(logObj);
				const line = serializeRedactedFileLogRecord({
					...logObj,
					_meta: withResolvedLogMetaHostname(logObj["_meta"], expectDefined(fields.hostname, "structured log hostname")),
					time,
					...fields
				}, {
					deriveMessage: (materialized) => buildFileLogMessage(materialized, messageParts),
					decodedOptions: resolveFileLogRedactOptions()
				});
				fileLogTransport.enqueue({
					file: activeFile,
					hostname: expectDefined(fields.hostname, "structured log hostname"),
					maxFileBytes: settings.maxFileBytes,
					payload: `${line}\n`
				});
			} catch {}
		}
	});
	attachDiagnosticEventTransport(logger);
	return logger;
}
function resolveMaxLogFileBytes(raw) {
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getLogger() {
	const cachedLogger = loggingState.cachedLogger;
	if (cachedLogger) return cachedLogger;
	getRuntimeSettings();
	const logger = buildLogger();
	loggingState.cachedLogger = logger;
	return logger;
}
function getChildLogger(bindings, opts) {
	const base = getLogger();
	const name = bindings ? JSON.stringify(bindings) : void 0;
	return base.getSubLogger({
		name,
		prefix: bindings ? [name ?? ""] : [],
		...opts?.level ? { minLevel: levelToMinLevel(opts.level) } : {}
	});
}
function toPinoLikeLogger(logger, level) {
	return {
		level,
		child: (bindings) => {
			const minLevel = logger.settings.minLevel;
			const child = logger.getSubLogger({
				name: bindings ? JSON.stringify(bindings) : void 0,
				minLevel: minLevel === Infinity ? levelToMinLevel("fatal") : minLevel
			});
			inheritLogLevel(child, () => logger.settings.minLevel);
			return toPinoLikeLogger(child, level);
		},
		trace: (...args) => logger.log(levelToMinLevel("trace"), "TRACE", ...args),
		debug: (...args) => logger.log(levelToMinLevel("debug"), "DEBUG", ...args),
		info: (...args) => logger.log(levelToMinLevel("info"), "INFO", ...args),
		warn: (...args) => logger.log(levelToMinLevel("warn"), "WARN", ...args),
		error: (...args) => logger.log(levelToMinLevel("error"), "ERROR", ...args),
		fatal: (...args) => logger.log(levelToMinLevel("fatal"), "FATAL", ...args)
	};
}
function getResolvedLoggerSettings() {
	const { rolling: _rolling, ...settings } = resolveSettings();
	return settings;
}
/** Flushes queued file logs before a graceful owner exits the process. */
async function flushLogger() {
	await fileLogTransport.flush();
}
function setLoggerOverride(settings) {
	loggingState.overrideSettings = settings;
	invalidateLoggerSettings();
}
function resetLogger() {
	loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
	loggingState.overrideSettings = null;
	invalidateLoggingConfigCache();
	loggerHostnameState.resolver = defaultLoggerHostnameResolver;
	loggerHostnameState.cached = null;
	invalidateLoggerSettings();
}
function resolveActiveLogFileWithMode(file, rolling) {
	const expandedFile = expandHomePrefix(file);
	return rolling ? resolveRollingLogFilePathForDate(expandedFile, /* @__PURE__ */ new Date()) : expandedFile;
}
function pruneOldRollingLogs(dir) {
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		const cutoff = Date.now() - MAX_LOG_AGE_MS;
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!entry.name.startsWith(`openclaw-`) || !entry.name.endsWith(".log")) continue;
			const fullPath = path.join(dir, entry.name);
			try {
				if (fs.statSync(fullPath).mtimeMs < cutoff) fs.rmSync(fullPath, { force: true });
			} catch {}
		}
	} catch {}
}
//#endregion
export { getResolvedLoggerSettings as a, setLoggerOverride as c, isRollingLogFilePath as d, isSameRollingLogFileFamily as f, getLogger as i, toPinoLikeLogger as l, resolveEnvLogLevelOverride as m, flushLogger as n, isFileLogLevelEnabled as o, resolveConfiguredLogFilePath as p, getChildLogger as r, resetLogger as s, applyLoggingConfig as t, getResolvedLoggerFileTarget as u };
