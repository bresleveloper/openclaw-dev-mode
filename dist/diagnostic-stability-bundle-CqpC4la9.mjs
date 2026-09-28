import { n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as formatDiagnosticFilenameTimestamp } from "./timestamps-tLN31L4a.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { t as registerFatalErrorHook } from "./fatal-error-hooks-D8bswZzH.mjs";
import { n as getDiagnosticStabilitySnapshot, t as MAX_DIAGNOSTIC_STABILITY_LIMIT } from "./diagnostic-stability-BaUvRyHr.mjs";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";
//#region src/logging/diagnostic-stability-bundle.ts
const DIAGNOSTIC_STABILITY_BUNDLE_VERSION = 1;
const DEFAULT_DIAGNOSTIC_STABILITY_BUNDLE_LIMIT = MAX_DIAGNOSTIC_STABILITY_LIMIT;
const DEFAULT_DIAGNOSTIC_STABILITY_BUNDLE_RETENTION = 20;
const MAX_DIAGNOSTIC_STABILITY_BUNDLE_BYTES = 5242880;
const SAFE_REASON_CODE = /^[A-Za-z0-9_.:-]{1,120}$/u;
const BUNDLE_PREFIX = "openclaw-stability-";
const BUNDLE_SUFFIX = ".json";
const REDACTED_HOSTNAME = "<redacted-hostname>";
const MAX_SAFE_ERROR_MESSAGE_LENGTH = 500;
const MAX_SHUTDOWN_ERRORS = 32;
const MAX_SAFE_ERROR_STACK_LENGTH = 8e3;
let fatalHookUnsubscribe = null;
function normalizeReason(reason) {
	return SAFE_REASON_CODE.test(reason) ? reason : "unknown";
}
function readErrorCode(error) {
	if (!error || typeof error !== "object" || !("code" in error)) return;
	const code = error.code;
	if (typeof code === "string" && SAFE_REASON_CODE.test(code)) return code;
	if (typeof code === "number" && Number.isFinite(code)) return String(code);
}
function readErrorName(error) {
	if (!error || typeof error !== "object" || !("name" in error)) return;
	const name = error.name;
	return typeof name === "string" && SAFE_REASON_CODE.test(name) ? name : void 0;
}
function readErrorMessage(error) {
	if (!error || typeof error !== "object" || !("message" in error)) return;
	const message = error.message;
	if (typeof message !== "string") return;
	const sanitized = redactSensitiveText(message, { mode: "tools" }).replace(/\s+/gu, " ").trim();
	if (!sanitized) return;
	return sanitized.length > MAX_SAFE_ERROR_MESSAGE_LENGTH ? `${truncateUtf16Safe(sanitized, MAX_SAFE_ERROR_MESSAGE_LENGTH)}...` : sanitized;
}
function readSafeErrorMetadata(error) {
	const name = readErrorName(error);
	const code = readErrorCode(error);
	const message = readErrorMessage(error);
	const stack = error && typeof error === "object" && "stack" in error && typeof error.stack === "string" ? truncateUtf16Safe(redactSensitiveText(error.stack, { mode: "tools" }), MAX_SAFE_ERROR_STACK_LENGTH) : void 0;
	if (!name && !code && !message && !stack) return;
	return {
		...name ? { name } : {},
		...code ? { code } : {},
		...message ? { message } : {},
		...stack ? { stack } : {}
	};
}
function readShutdownError(error) {
	return readSafeErrorMetadata(error && typeof error === "object" ? error : { message: formatErrorMessage(error) }) ?? {};
}
function collectShutdownErrors(error) {
	let remaining = 31;
	const candidates = collectErrorGraphCandidates(error, (current) => {
		const nested = [current.cause, ...Array.isArray(current.errors) ? current.errors.slice(0, remaining) : []].filter((value) => value !== void 0).slice(0, remaining);
		remaining -= nested.length;
		return nested;
	});
	return (candidates.length ? candidates : [error]).map(readShutdownError);
}
function resolveDiagnosticStabilityBundleDir(options = {}) {
	return path.join(options.stateDir ?? resolveStateDir(options.env ?? process.env), "logs", "stability");
}
function buildBundlePath(dir, now, reason) {
	return path.join(dir, `${BUNDLE_PREFIX}${formatDiagnosticFilenameTimestamp(now)}-${process.pid}-${normalizeReason(reason)}${BUNDLE_SUFFIX}`);
}
function isBundleFile(name) {
	return name.startsWith(BUNDLE_PREFIX) && name.endsWith(BUNDLE_SUFFIX);
}
function readObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Invalid stability bundle: ${label} must be an object`);
	return value;
}
function readRequiredNumber(value, label) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Invalid stability bundle: ${label} must be a finite number`);
	return value;
}
function readOptionalPositiveInteger(value, label) {
	if (value === void 0) return;
	const parsed = readRequiredNumber(value, label);
	return parsed >= 0 ? Math.floor(parsed) : void 0;
}
function readTimestampMs(value, label) {
	const timestamp = readRequiredNumber(value, label);
	if (Number.isNaN(new Date(timestamp).getTime())) throw new Error(`Invalid stability bundle: ${label} must be a valid timestamp`);
	return timestamp;
}
function readOptionalNumber(value, label) {
	if (value === void 0) return;
	return readRequiredNumber(value, label);
}
function readRequiredString(value, label) {
	if (typeof value !== "string") throw new Error(`Invalid stability bundle: ${label} must be a string`);
	return value;
}
function readTimestampString(value, label) {
	const timestamp = readRequiredString(value, label);
	if (Number.isNaN(new Date(timestamp).getTime())) throw new Error(`Invalid stability bundle: ${label} must be a valid timestamp`);
	return timestamp;
}
function readCodeString(value, label) {
	const code = readRequiredString(value, label);
	if (!SAFE_REASON_CODE.test(code)) throw new Error(`Invalid stability bundle: ${label} must be a safe diagnostic code`);
	return code;
}
function readOptionalCodeString(value, label) {
	if (value === void 0) return;
	const code = readRequiredString(value, label);
	return SAFE_REASON_CODE.test(code) ? code : void 0;
}
function assignOptionalFields(target, source, label, fields, read) {
	for (const key of fields) {
		const parsed = read(source[key], `${label}.${key}`);
		if (parsed !== void 0) target[key] = parsed;
	}
}
function readMemoryUsage(value, label) {
	const memory = readObject(value, label);
	return {
		rssBytes: readRequiredNumber(memory.rssBytes, `${label}.rssBytes`),
		heapTotalBytes: readRequiredNumber(memory.heapTotalBytes, `${label}.heapTotalBytes`),
		heapUsedBytes: readRequiredNumber(memory.heapUsedBytes, `${label}.heapUsedBytes`),
		externalBytes: readRequiredNumber(memory.externalBytes, `${label}.externalBytes`),
		arrayBuffersBytes: readRequiredNumber(memory.arrayBuffersBytes, `${label}.arrayBuffersBytes`)
	};
}
function readHeapStatistics(value) {
	if (value === void 0) return;
	const source = readObject(value, "evidence.memoryPressure.heapStatistics");
	const result = {};
	assignOptionalFields(result, source, "evidence.memoryPressure.heapStatistics", [
		"totalHeapSizeBytes",
		"totalHeapSizeExecutableBytes",
		"totalPhysicalSizeBytes",
		"totalAvailableSizeBytes",
		"usedHeapSizeBytes",
		"heapSizeLimitBytes",
		"mallocedMemoryBytes",
		"externalMemoryBytes"
	], readOptionalPositiveInteger);
	return Object.keys(result).length > 0 ? result : void 0;
}
function readHeapSpaces(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Invalid stability bundle: evidence.memoryPressure.heapSpaces must be an array");
	const spaces = [];
	for (const [index, entry] of value.entries()) {
		const source = readObject(entry, `evidence.memoryPressure.heapSpaces[${index}]`);
		const spaceName = readOptionalCodeString(source.spaceName, `evidence.memoryPressure.heapSpaces[${index}].spaceName`);
		if (!spaceName) continue;
		spaces.push({
			spaceName,
			spaceSizeBytes: readOptionalPositiveInteger(source.spaceSizeBytes, `evidence.memoryPressure.heapSpaces[${index}].spaceSizeBytes`) ?? 0,
			spaceUsedBytes: readOptionalPositiveInteger(source.spaceUsedBytes, `evidence.memoryPressure.heapSpaces[${index}].spaceUsedBytes`) ?? 0,
			spaceAvailableBytes: readOptionalPositiveInteger(source.spaceAvailableBytes, `evidence.memoryPressure.heapSpaces[${index}].spaceAvailableBytes`) ?? 0,
			physicalSpaceSizeBytes: readOptionalPositiveInteger(source.physicalSpaceSizeBytes, `evidence.memoryPressure.heapSpaces[${index}].physicalSpaceSizeBytes`) ?? 0
		});
	}
	return spaces.length > 0 ? spaces : void 0;
}
function readCgroupMemorySummary(value) {
	if (value === void 0) return;
	const source = readObject(value, "evidence.memoryPressure.cgroup");
	const version = readCodeString(source.version, "evidence.memoryPressure.cgroup.version");
	if (version !== "v2") return;
	const valuesSource = readObject(source.values, "evidence.memoryPressure.cgroup.values");
	const values = {};
	for (const [key, raw] of Object.entries(valuesSource)) {
		if (!SAFE_REASON_CODE.test(key)) continue;
		if (raw === "max") values[key] = "max";
		else values[key] = readOptionalPositiveInteger(raw, `evidence.memoryPressure.cgroup.values.${key}`) ?? 0;
	}
	return {
		version,
		values,
		events: readNumberMap(source.events, "evidence.memoryPressure.cgroup.events")
	};
}
function readActiveResources(value) {
	if (value === void 0) return;
	const source = readObject(value, "evidence.memoryPressure.activeResources");
	return {
		total: readOptionalPositiveInteger(source.total, "evidence.memoryPressure.activeResources.total") ?? 0,
		byType: readNumberMap(source.byType, "evidence.memoryPressure.activeResources.byType")
	};
}
function readSessionFiles(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Invalid stability bundle: evidence.memoryPressure.topSessionFiles must be an array");
	const files = [];
	for (const [index, entry] of value.entries()) {
		const source = readObject(entry, `evidence.memoryPressure.topSessionFiles[${index}]`);
		const relativePath = readRequiredString(source.relativePath, `evidence.memoryPressure.topSessionFiles[${index}].relativePath`);
		if (path.isAbsolute(relativePath) || relativePath.includes("..") || relativePath.length > 300 || /[\r\n]/u.test(relativePath)) continue;
		files.push({
			relativePath: sanitizeSessionEvidencePath(relativePath),
			sizeBytes: readOptionalPositiveInteger(source.sizeBytes, `evidence.memoryPressure.topSessionFiles[${index}].sizeBytes`) ?? 0,
			mtimeMs: readOptionalPositiveInteger(source.mtimeMs, `evidence.memoryPressure.topSessionFiles[${index}].mtimeMs`) ?? 0
		});
	}
	return files.length > 0 ? files : void 0;
}
function readMemoryPressureEvidence(value) {
	if (value === void 0) return;
	const pressure = readObject(value, "evidence.memoryPressure");
	const level = readCodeString(pressure.level, "evidence.memoryPressure.level");
	const reason = readCodeString(pressure.reason, "evidence.memoryPressure.reason");
	if (level !== "warning" && level !== "critical" || !isMemoryPressureReason(reason)) return;
	const heapStatistics = readHeapStatistics(pressure.heapStatistics);
	const heapSpaces = readHeapSpaces(pressure.heapSpaces);
	const cgroup = readCgroupMemorySummary(pressure.cgroup);
	const activeResources = readActiveResources(pressure.activeResources);
	const topSessionFiles = readSessionFiles(pressure.topSessionFiles);
	const result = {
		level,
		reason,
		memory: readMemoryUsage(pressure.memory, "evidence.memoryPressure.memory")
	};
	assignOptionalFields(result, pressure, "evidence.memoryPressure", [
		"thresholdBytes",
		"rssGrowthBytes",
		"windowMs"
	], readOptionalNumber);
	return {
		...result,
		...heapStatistics ? { heapStatistics } : {},
		...heapSpaces ? { heapSpaces } : {},
		...cgroup ? { cgroup } : {},
		...activeResources ? { activeResources } : {},
		...topSessionFiles ? { topSessionFiles } : {}
	};
}
function readBundleEvidence(value) {
	if (value === void 0) return;
	const source = readObject(value, "evidence");
	const memoryPressure = readMemoryPressureEvidence(source.memoryPressure);
	let shutdown;
	if (source.shutdown !== void 0) {
		const shutdownSource = readObject(source.shutdown, "evidence.shutdown");
		if (!Array.isArray(shutdownSource.errors)) throw new Error("Invalid stability bundle: evidence.shutdown.errors must be an array");
		shutdown = {
			step: readCodeString(shutdownSource.step, "evidence.shutdown.step"),
			errors: shutdownSource.errors.slice(0, MAX_SHUTDOWN_ERRORS).map(readShutdownError)
		};
	}
	return memoryPressure || shutdown ? {
		...memoryPressure ? { memoryPressure } : {},
		...shutdown ? { shutdown } : {}
	} : void 0;
}
function readNumberMap(value, label) {
	const source = readObject(value, label);
	const result = {};
	for (const [key, entry] of Object.entries(source)) {
		if (!SAFE_REASON_CODE.test(key)) continue;
		result[key] = readRequiredNumber(entry, `${label}.${key}`);
	}
	return result;
}
function readOptionalMemorySummary(value) {
	if (value === void 0) return;
	const memory = readObject(value, "snapshot.summary.memory");
	const latest = memory.latest === void 0 ? void 0 : readMemoryUsage(memory.latest, "snapshot.summary.memory.latest");
	return {
		...latest ? { latest } : {},
		...memory.maxRssBytes !== void 0 ? { maxRssBytes: readRequiredNumber(memory.maxRssBytes, "snapshot.summary.memory.maxRssBytes") } : {},
		...memory.maxHeapUsedBytes !== void 0 ? { maxHeapUsedBytes: readRequiredNumber(memory.maxHeapUsedBytes, "snapshot.summary.memory.maxHeapUsedBytes") } : {},
		pressureCount: readRequiredNumber(memory.pressureCount, "snapshot.summary.memory.pressureCount")
	};
}
function readOptionalPayloadLargeSummary(value) {
	if (value === void 0) return;
	const payloadLarge = readObject(value, "snapshot.summary.payloadLarge");
	return {
		count: readRequiredNumber(payloadLarge.count, "snapshot.summary.payloadLarge.count"),
		rejected: readRequiredNumber(payloadLarge.rejected, "snapshot.summary.payloadLarge.rejected"),
		truncated: readRequiredNumber(payloadLarge.truncated, "snapshot.summary.payloadLarge.truncated"),
		chunked: readRequiredNumber(payloadLarge.chunked, "snapshot.summary.payloadLarge.chunked"),
		bySurface: readNumberMap(payloadLarge.bySurface, "snapshot.summary.payloadLarge.bySurface")
	};
}
function readStabilityEventRecord(value, label) {
	const record = readObject(value, label);
	const sanitized = {
		seq: readRequiredNumber(record.seq, `${label}.seq`),
		ts: readTimestampMs(record.ts, `${label}.ts`),
		type: readCodeString(record.type, `${label}.type`)
	};
	assignOptionalFields(sanitized, record, label, [
		"channel",
		"pluginId",
		"source",
		"surface",
		"action",
		"reason",
		"outcome",
		"level",
		"phase",
		"approvalId",
		"detector",
		"toolName",
		"activeWorkKind",
		"pairedToolName",
		"provider",
		"model"
	], readOptionalCodeString);
	assignOptionalFields(sanitized, record, label, [
		"durationMs",
		"requestBytes",
		"responseBytes",
		"timeToFirstByteMs",
		"costUsd",
		"count",
		"bytes",
		"limitBytes",
		"thresholdBytes",
		"rssGrowthBytes",
		"windowMs",
		"ageMs",
		"queueDepth",
		"queueSize",
		"queueLength",
		"waitMs",
		"active",
		"waiting",
		"queued",
		"droppedEvents",
		"droppedTrustedEvents",
		"droppedUntrustedEvents",
		"droppedPriorityEvents",
		"maxQueueLength",
		"drainBatchSize"
	], readOptionalNumber);
	if (record.webhooks !== void 0) {
		const webhooks = readObject(record.webhooks, `${label}.webhooks`);
		sanitized.webhooks = {
			received: readRequiredNumber(webhooks.received, `${label}.webhooks.received`),
			processed: readRequiredNumber(webhooks.processed, `${label}.webhooks.processed`),
			errors: readRequiredNumber(webhooks.errors, `${label}.webhooks.errors`)
		};
	}
	if (record.memory !== void 0) sanitized.memory = readMemoryUsage(record.memory, `${label}.memory`);
	if (record.usage !== void 0) {
		const usage = readObject(record.usage, `${label}.usage`);
		sanitized.usage = {};
		assignOptionalFields(sanitized.usage, usage, `${label}.usage`, [
			"input",
			"output",
			"cacheRead",
			"cacheWrite",
			"promptTokens",
			"total"
		], readOptionalNumber);
	}
	if (record.context !== void 0) {
		const context = readObject(record.context, `${label}.context`);
		sanitized.context = {};
		assignOptionalFields(sanitized.context, context, `${label}.context`, ["limit", "used"], readOptionalNumber);
	}
	return sanitized;
}
function readStabilitySnapshot(value) {
	const snapshot = readObject(value, "snapshot");
	const generatedAt = readTimestampString(snapshot.generatedAt, "snapshot.generatedAt");
	const capacity = readRequiredNumber(snapshot.capacity, "snapshot.capacity");
	const count = readRequiredNumber(snapshot.count, "snapshot.count");
	const dropped = readRequiredNumber(snapshot.dropped, "snapshot.dropped");
	const firstSeq = readOptionalNumber(snapshot.firstSeq, "snapshot.firstSeq");
	const lastSeq = readOptionalNumber(snapshot.lastSeq, "snapshot.lastSeq");
	if (!Array.isArray(snapshot.events)) throw new Error("Invalid stability bundle: snapshot.events must be an array");
	const events = snapshot.events.map((event, index) => readStabilityEventRecord(event, `snapshot.events[${index}]`));
	const summary = readObject(snapshot.summary, "snapshot.summary");
	return {
		generatedAt,
		capacity,
		count,
		dropped,
		...firstSeq !== void 0 ? { firstSeq } : {},
		...lastSeq !== void 0 ? { lastSeq } : {},
		events,
		summary: {
			byType: readNumberMap(summary.byType, "snapshot.summary.byType"),
			...summary.memory !== void 0 ? { memory: readOptionalMemorySummary(summary.memory) } : {},
			...summary.payloadLarge !== void 0 ? { payloadLarge: readOptionalPayloadLargeSummary(summary.payloadLarge) } : {}
		}
	};
}
function parseDiagnosticStabilityBundle(value) {
	const bundle = readObject(value, "bundle");
	if (bundle.version !== 1) throw new Error(`Unsupported stability bundle version: ${String(bundle.version)}`);
	const processInfo = readObject(bundle.process, "process");
	readObject(bundle.host, "host");
	const error = bundle.error === void 0 ? void 0 : readSafeErrorMetadata(bundle.error);
	const evidence = readBundleEvidence(bundle.evidence);
	return {
		version: 1,
		generatedAt: readTimestampString(bundle.generatedAt, "generatedAt"),
		reason: normalizeReason(readRequiredString(bundle.reason, "reason")),
		process: {
			pid: readRequiredNumber(processInfo.pid, "process.pid"),
			platform: readCodeString(processInfo.platform, "process.platform"),
			arch: readCodeString(processInfo.arch, "process.arch"),
			node: readCodeString(processInfo.node, "process.node"),
			uptimeMs: readRequiredNumber(processInfo.uptimeMs, "process.uptimeMs")
		},
		host: { hostname: REDACTED_HOSTNAME },
		...error ? { error } : {},
		...evidence ? { evidence } : {},
		snapshot: readStabilitySnapshot(bundle.snapshot)
	};
}
function sanitizeSessionEvidencePath(relativePath) {
	const parts = relativePath.split("/");
	if (parts.length === 4 && parts[0] === "agents" && parts[2] === "sessions") return `agents/<agent>/sessions/${sanitizeSessionEvidenceFileName(expectDefined(parts[3], "parts entry at 3"))}`;
	if (parts.length === 2 && parts[0] === "sessions") return `sessions/${sanitizeSessionEvidenceFileName(expectDefined(parts[1], "parts entry at 1"))}`;
	return redactSensitiveText(relativePath, { mode: "tools" });
}
function sanitizeSessionEvidenceFileName(fileName) {
	if (fileName === "sessions.json") return "sessions.json";
	if (fileName.endsWith(".jsonl")) return "<session>.jsonl";
	if (fileName.endsWith(".json")) return "<session>.json";
	return "<session>";
}
function isMemoryPressureReason(reason) {
	return reason === "rss_threshold" || reason === "heap_threshold" || reason === "rss_growth";
}
function listDiagnosticStabilityBundleFilesSync(options = {}) {
	const dir = resolveDiagnosticStabilityBundleDir(options);
	try {
		return fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile() && isBundleFile(entry.name)).map((entry) => {
			const file = path.join(dir, entry.name);
			return {
				path: file,
				mtimeMs: fs.statSync(file).mtimeMs
			};
		}).toSorted((a, b) => b.mtimeMs - a.mtimeMs || b.path.localeCompare(a.path));
	} catch (error) {
		if (isMissingPathError(error)) return [];
		throw error;
	}
}
function readDiagnosticStabilityBundleFileSync(file) {
	try {
		const stat = fs.statSync(file);
		if (stat.size > 5242880) throw new Error(`Stability bundle is too large: ${stat.size} bytes exceeds ${MAX_DIAGNOSTIC_STABILITY_BUNDLE_BYTES}`);
		const raw = fs.readFileSync(file, "utf8");
		const bundle = parseDiagnosticStabilityBundle(JSON.parse(raw));
		return {
			status: "found",
			path: file,
			mtimeMs: stat.mtimeMs,
			bundle
		};
	} catch (error) {
		return {
			status: "failed",
			path: file,
			error
		};
	}
}
function readLatestDiagnosticStabilityBundleSync(options = {}) {
	try {
		const latest = listDiagnosticStabilityBundleFilesSync(options)[0];
		if (!latest) return {
			status: "missing",
			dir: resolveDiagnosticStabilityBundleDir(options)
		};
		return readDiagnosticStabilityBundleFileSync(latest.path);
	} catch (error) {
		return {
			status: "failed",
			error
		};
	}
}
function pruneOldBundles(dir, retention, retainedFile) {
	if (!Number.isFinite(retention) || retention < 1) return;
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile() && isBundleFile(entry.name)).map((entry) => {
			const file = path.join(dir, entry.name);
			let mtimeMs = 0;
			try {
				mtimeMs = fs.statSync(file).mtimeMs;
			} catch {}
			return {
				file,
				mtimeMs
			};
		}).filter((entry) => entry.file !== retainedFile).toSorted((a, b) => b.mtimeMs - a.mtimeMs || b.file.localeCompare(a.file));
		for (const entry of entries.slice(retention - 1)) try {
			fs.unlinkSync(entry.file);
		} catch {}
	} catch {}
}
function writeDiagnosticStabilityBundleSync(options) {
	try {
		const now = options.now ?? /* @__PURE__ */ new Date();
		const snapshot = getDiagnosticStabilitySnapshot({ limit: options.limit ?? DEFAULT_DIAGNOSTIC_STABILITY_BUNDLE_LIMIT });
		if (!options.includeEmpty && snapshot.count === 0) return {
			status: "skipped",
			reason: "empty"
		};
		const reason = normalizeReason(options.reason);
		const error = options.error ? readSafeErrorMetadata(options.error) : void 0;
		const evidence = options.shutdownStep ? {
			...options.evidence,
			shutdown: {
				step: readCodeString(options.shutdownStep, "shutdownStep"),
				errors: collectShutdownErrors(options.error)
			}
		} : options.evidence;
		const bundle = {
			version: 1,
			generatedAt: now.toISOString(),
			reason,
			process: {
				pid: process.pid,
				platform: process.platform,
				arch: process.arch,
				node: process.versions.node,
				uptimeMs: Math.round(process.uptime() * 1e3)
			},
			host: { hostname: REDACTED_HOSTNAME },
			...error ? { error } : {},
			...evidence ? { evidence } : {},
			snapshot
		};
		const dir = resolveDiagnosticStabilityBundleDir(options);
		const file = buildBundlePath(dir, now, reason);
		replaceFileAtomicSync({
			filePath: file,
			content: `${JSON.stringify(bundle, null, 2)}\n`,
			dirMode: 448,
			mode: 384,
			tempPrefix: ".openclaw-stability"
		});
		pruneOldBundles(dir, options.retention ?? DEFAULT_DIAGNOSTIC_STABILITY_BUNDLE_RETENTION, file);
		return {
			status: "written",
			path: file,
			bundle
		};
	} catch (error) {
		return {
			status: "failed",
			error
		};
	}
}
function writeDiagnosticStabilityBundleForFailureSync(reason, error, options = {}) {
	const result = writeDiagnosticStabilityBundleSync({
		...options,
		reason,
		error,
		includeEmpty: true
	});
	if (result.status === "written") return {
		status: "written",
		path: result.path,
		message: `wrote stability bundle: ${result.path}`
	};
	if (result.status === "failed") return {
		status: "failed",
		error: result.error,
		message: `failed to write stability bundle: ${String(result.error)}`
	};
	return result;
}
function installDiagnosticStabilityFatalHook(options = {}) {
	if (fatalHookUnsubscribe) return;
	fatalHookUnsubscribe = registerFatalErrorHook(({ reason, error }) => {
		const result = writeDiagnosticStabilityBundleForFailureSync(reason, error, options);
		return "message" in result ? result.message : void 0;
	});
}
function uninstallDiagnosticStabilityFatalHook() {
	fatalHookUnsubscribe?.();
	fatalHookUnsubscribe = null;
}
//#endregion
export { readLatestDiagnosticStabilityBundleSync as a, writeDiagnosticStabilityBundleSync as c, readDiagnosticStabilityBundleFileSync as i, MAX_DIAGNOSTIC_STABILITY_BUNDLE_BYTES as n, uninstallDiagnosticStabilityFatalHook as o, installDiagnosticStabilityFatalHook as r, writeDiagnosticStabilityBundleForFailureSync as s, DIAGNOSTIC_STABILITY_BUNDLE_VERSION as t };
