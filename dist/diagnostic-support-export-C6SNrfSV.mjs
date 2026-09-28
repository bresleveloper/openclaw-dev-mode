import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-C7YSvZ9t.mjs";
import { n as resolveHomeRelativePath } from "./home-dir-BKwhAL2c.mjs";
import { n as parseBooleanValue } from "./boolean-C30ltbL7.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { r as INCLUDE_KEY } from "./includes-CaaCq-XN.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { i as readRegularFileSync } from "./regular-file-D4i0kJHS.mjs";
import "./errors-DnjwnOju.mjs";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.mjs";
import { t as formatDiagnosticFilenameTimestamp } from "./timestamps-tLN31L4a.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { c as parseConfigJson5 } from "./io.read-helpers-N26RjV2V.mjs";
import { t as redactConfigObject } from "./redact-snapshot-uX3ICFnt.mjs";
import { c as sanitizeSupportConfigValue, l as sanitizeSupportSnapshotValue, n as redactPathForSupport, o as redactSupportString, s as redactTextForSupport } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import "./io-C0BSvvM5.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-CSUVJC6v.mjs";
import { a as readLatestDiagnosticStabilityBundleSync, i as readDiagnosticStabilityBundleFileSync } from "./diagnostic-stability-bundle-CqpC4la9.mjs";
import { t as buildConfigSchemaCore } from "./schema-RpXu-eUV.mjs";
import { t as readConfiguredLogTail } from "./log-tail-Dj1EcI26.mjs";
import { i as textSupportBundleFile, n as jsonlSupportBundleFile, o as writeSupportBundleZip, r as supportBundleContents, t as jsonSupportBundleFile } from "./diagnostic-support-bundle-BYEENxY_.mjs";
import fs from "node:fs";
import process from "node:process";
import path from "node:path";
//#region src/logging/diagnostic-support-log-redaction.ts
const LOG_STRING_FIELD_RE = /^(?:action|channel|code|component|endpoint|event|handshake|kind|level|localAddr|logger|method|model|module|msg|name|outcome|phase|pluginId|provider|reason|remoteAddr|requestId|runId|service|source|status|subsystem|surface|target|time|traceId|type)$/iu;
const LOG_SCALAR_FIELD_RE = /^(?:active|attempt|bytes|count|durationMs|enabled|exitCode|intervalMs|jobs|limitBytes|localPort|nextWakeAtMs|pid|port|queueDepth|queued|remotePort|statusCode|waitMs|waiting)$/iu;
const OMITTED_LOG_FIELD_RE = /(?:authorization|body|chat|content|cookie|credential|detail|error|header|instruction|message|password|payload|prompt|result|secret|session[-_]?id|session[-_]?key|text|token|tool|transcript|url)/iu;
const UNSAFE_LOG_MESSAGE_RE = /(?:\blastAssistant\s*=|\b(?:ai response|assistant said|chat text|message contents|prompt|raw webhook body|tool output|tool result|transcript|user said|webhook body)\b|auto-responding\b.*:\s*["']|partial for\b.*:)/iu;
const MAX_LOG_STRING_LENGTH = 240;
const LOGTAPE_META_FIELD = "_meta";
const LOGTAPE_ARG_FIELD_RE = /^\d+$/u;
const LOGTAPE_META_STRING_FIELDS = /* @__PURE__ */ new Map([["logLevelName", "level"], ["name", "logger"]]);
function byteLength(content) {
	return Buffer.byteLength(content, "utf8");
}
function createLogRecord() {
	return Object.create(null);
}
/** Parses and sanitizes one log line into safe support-bundle metadata. */
function sanitizeSupportLogRecord(line, redaction) {
	let parsed;
	try {
		parsed = JSON.parse(line);
	} catch {
		return {
			omitted: "unparsed",
			bytes: byteLength(line)
		};
	}
	const source = asOptionalRecord(parsed);
	if (!source) return {
		omitted: "non-object",
		bytes: byteLength(line)
	};
	const sanitized = createLogRecord();
	addNamedLogFields(sanitized, source, redaction);
	addLogTapeMetaFields(sanitized, source, redaction);
	addLogTapeArgFields(sanitized, source, redaction);
	return Object.keys(sanitized).length > 0 ? sanitized : {
		omitted: "no-safe-fields",
		bytes: byteLength(line)
	};
}
function addNamedLogFields(sanitized, source, redaction) {
	for (const [key, value] of Object.entries(source)) {
		if (key === LOGTAPE_META_FIELD || LOGTAPE_ARG_FIELD_RE.test(key)) continue;
		addSafeLogField(sanitized, key, value, redaction);
	}
}
function addLogTapeMetaFields(sanitized, source, redaction) {
	const meta = asOptionalRecord(source[LOGTAPE_META_FIELD]);
	if (!meta) return;
	for (const [sourceKey, outputKey] of LOGTAPE_META_STRING_FIELDS) {
		if (sanitized[outputKey] !== void 0) continue;
		const value = meta[sourceKey];
		if (typeof value === "string") {
			if (sourceKey === "name") {
				const record = parseJsonRecord(value);
				if (record) {
					addLogObjectFields(sanitized, record, redaction);
					continue;
				}
			}
			sanitized[outputKey] = sanitizeLogString(value, redaction);
		}
	}
}
function addLogTapeArgFields(sanitized, source, redaction) {
	const args = Object.entries(source).filter(([key]) => LOGTAPE_ARG_FIELD_RE.test(key)).toSorted(([left], [right]) => Number(left) - Number(right));
	for (const [, value] of args) {
		const record = typeof value === "string" ? parseJsonRecord(value) : asOptionalRecord(value);
		if (record) {
			addLogObjectFields(sanitized, record, redaction);
			continue;
		}
		if (typeof value === "string") addLogTapeMessageField(sanitized, value, redaction);
	}
}
function addLogTapeMessageField(sanitized, value, redaction) {
	const message = sanitizeLogString(value, redaction);
	if (sanitized.msg === void 0 && message && !UNSAFE_LOG_MESSAGE_RE.test(message)) {
		sanitized.msg = message;
		return;
	}
	addOmittedLogMessageMetadata(sanitized, value);
}
function addOmittedLogMessageMetadata(sanitized, value) {
	sanitized.omitted = "log-message";
	sanitized.omittedLogMessageBytes = numericLogMetadata(sanitized.omittedLogMessageBytes) + byteLength(value);
	sanitized.omittedLogMessageCount = numericLogMetadata(sanitized.omittedLogMessageCount) + 1;
}
function numericLogMetadata(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
function parseJsonRecord(value) {
	const trimmed = value.trim();
	if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return;
	return safeParseJsonRecord(trimmed);
}
function addLogObjectFields(sanitized, source, redaction) {
	for (const [key, value] of Object.entries(source)) addSafeLogField(sanitized, key, value, redaction);
}
function addSafeLogField(sanitized, key, value, redaction) {
	if (OMITTED_LOG_FIELD_RE.test(key)) return;
	if (isBlockedObjectKey(key)) return;
	if (!isSafeLogField(key, value)) return;
	if (typeof value === "string") {
		const message = sanitizeLogString(value, redaction);
		if (key === "msg" && (!message || UNSAFE_LOG_MESSAGE_RE.test(message))) {
			addOmittedLogMessageMetadata(sanitized, value);
			return;
		}
		sanitized[key] = message;
	} else if (typeof value === "number" || typeof value === "boolean" || value === null) sanitized[key] = value;
}
function sanitizeLogString(value, redaction) {
	return redactSupportString(value, redaction, {
		maxLength: MAX_LOG_STRING_LENGTH,
		truncationSuffix: ""
	});
}
function isSafeLogField(key, value) {
	if (typeof value === "string") return LOG_STRING_FIELD_RE.test(key);
	return LOG_STRING_FIELD_RE.test(key) || LOG_SCALAR_FIELD_RE.test(key);
}
//#endregion
//#region src/logging/diagnostic-support-export.ts
const DIAGNOSTIC_SUPPORT_EXPORT_VERSION = 1;
const DEFAULT_LOG_LIMIT = 5e3;
const DEFAULT_LOG_MAX_BYTES = 1e6;
const SUPPORT_EXPORT_CONFIG_MAX_BYTES = 8388608;
const SUPPORT_EXPORT_PREFIX = "openclaw-diagnostics-";
const SUPPORT_EXPORT_SUFFIX = ".zip";
function normalizePositiveInteger(value, fallback) {
	const parsed = typeof value === "number" ? value : Number(value);
	if (!Number.isFinite(parsed) || parsed < 1) return fallback;
	return Math.floor(parsed);
}
function safeScalar(value) {
	if (typeof value === "boolean") return value;
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") return redactTextForSupport(value) === value && /^[A-Za-z0-9_.:-]{1,120}$/u.test(value) ? value : "<redacted>";
}
function resolveBonjourEnvOverride(env) {
	const raw = env.OPENCLAW_DISABLE_BONJOUR?.trim();
	if (!raw) return "unset";
	const disabled = parseBooleanValue(raw);
	if (disabled === true) return "force-disabled";
	return disabled === false ? "force-enabled" : "unrecognized";
}
function sortedConfigEntryKeys(value) {
	return Object.keys(asOptionalRecord(value) ?? {}).filter((key) => key !== INCLUDE_KEY).toSorted((a, b) => a.localeCompare(b));
}
function sanitizeConfigShape(parsed, configPath, stat, env) {
	const root = asOptionalRecord(parsed) ?? {};
	const gateway = asOptionalRecord(root.gateway);
	const auth = asOptionalRecord(gateway?.auth);
	const discovery = asOptionalRecord(root.discovery);
	const mdns = asOptionalRecord(discovery?.mdns);
	const channels = asOptionalRecord(root.channels);
	const plugins = asOptionalRecord(root.plugins);
	const agents = asOptionalRecord(asOptionalRecord(root.agents)?.entries);
	const shape = {
		path: configPath,
		exists: true,
		parseOk: true,
		bytes: stat.size,
		mtime: stat.mtime.toISOString(),
		topLevelKeys: Object.keys(root).toSorted((a, b) => a.localeCompare(b))
	};
	if (gateway) shape.gateway = {
		mode: safeScalar(gateway.mode),
		bind: safeScalar(gateway.bind),
		port: safeScalar(gateway.port),
		authMode: safeScalar(auth?.mode),
		tailscale: safeScalar(asOptionalRecord(gateway.tailscale)?.mode)
	};
	const bonjourEnvOverride = resolveBonjourEnvOverride(env);
	if (mdns || bonjourEnvOverride !== "unset") shape.discovery = {
		mdnsMode: safeScalar(mdns?.mode),
		bonjourEnvOverride
	};
	if (channels) {
		const ids = sortedConfigEntryKeys(channels).filter((key) => !isChannelConfigMetadataKey(key));
		shape.channels = {
			count: ids.length,
			ids
		};
	}
	if (plugins) {
		const ids = sortedConfigEntryKeys(plugins.entries);
		shape.plugins = {
			count: ids.length,
			ids
		};
	}
	if (agents) shape.agents = { count: sortedConfigEntryKeys(agents).length };
	return shape;
}
function sanitizeConfigDetails(parsed, redaction) {
	return sanitizeSupportConfigValue(redactConfigObject(parsed, buildConfigSchemaCore().uiHints), redaction);
}
function configShapeReadFailure(params) {
	const shape = {
		path: params.configPath,
		exists: Boolean(params.stat),
		parseOk: false,
		topLevelKeys: []
	};
	if (params.stat) {
		shape.bytes = params.stat.size;
		shape.mtime = params.stat.mtime.toISOString();
	}
	if (params.error) shape.error = redactSupportString(params.error, params.redaction);
	return shape;
}
function configReadErrorMessage(error, stat) {
	if (!stat && isMissingPathError(error)) return;
	return error instanceof Error ? error.message : String(error);
}
function readConfigExport(options) {
	const redactedConfigPath = redactPathForSupport(options.configPath, options);
	let stat;
	try {
		assertNotUpdateCapturePath(options.configPath, options.stateDir);
		stat = fs.statSync(options.configPath);
		const { buffer } = readRegularFileSync({
			filePath: options.configPath,
			maxBytes: SUPPORT_EXPORT_CONFIG_MAX_BYTES
		});
		const parsed = parseConfigJson5(buffer.toString("utf8"));
		if (!parsed.ok) return { shape: configShapeReadFailure({
			configPath: redactedConfigPath,
			redaction: options,
			stat,
			error: parsed.error
		}) };
		return {
			shape: sanitizeConfigShape(parsed.parsed, redactedConfigPath, stat, options.env),
			sanitized: sanitizeConfigDetails(parsed.parsed, options)
		};
	} catch (error) {
		return { shape: configShapeReadFailure({
			configPath: redactedConfigPath,
			redaction: options,
			stat,
			error: configReadErrorMessage(error, stat)
		}) };
	}
}
function redactErrorForSupport(error, redaction) {
	return redactSupportString(error instanceof Error ? error.message : String(error), redaction);
}
async function collectSupportSnapshot(params) {
	if (!params.reader) return { summary: { status: "skipped" } };
	try {
		const data = await params.reader();
		return {
			summary: {
				status: "included",
				path: params.path
			},
			file: jsonSupportBundleFile(params.path, {
				status: "ok",
				capturedAt: params.generatedAt,
				data: sanitizeSupportSnapshotValue(data, params.redaction)
			})
		};
	} catch (error) {
		const redactedError = redactErrorForSupport(error, params.redaction);
		return {
			summary: {
				status: "failed",
				path: params.path,
				error: redactedError
			},
			file: jsonSupportBundleFile(params.path, {
				status: "failed",
				capturedAt: params.generatedAt,
				error: redactedError
			})
		};
	}
}
function readStabilityBundle(target, stateDir) {
	if (target === false) return {
		status: "missing",
		dir: "$OPENCLAW_STATE_DIR/logs/stability"
	};
	try {
		if (target !== void 0 && target !== "latest") assertNotUpdateCapturePath(target, stateDir);
		const result = target === void 0 || target === "latest" ? readLatestDiagnosticStabilityBundleSync({ stateDir }) : readDiagnosticStabilityBundleFileSync(target);
		if (result.status === "found") assertNotUpdateCapturePath(result.path, stateDir);
		return result;
	} catch (error) {
		return {
			status: "failed",
			error
		};
	}
}
function sanitizeLogTail(tail, options) {
	return {
		status: "included",
		file: redactPathForSupport(tail.file, options),
		cursor: tail.cursor,
		size: tail.size,
		lineCount: tail.lines.length,
		truncated: tail.truncated,
		reset: tail.reset,
		lines: tail.lines.map((line) => sanitizeSupportLogRecord(line, options))
	};
}
function failedLogTail(error, redaction) {
	const redactedError = redactErrorForSupport(error, redaction);
	return {
		status: "failed",
		file: "unavailable",
		cursor: 0,
		size: 0,
		lineCount: 0,
		truncated: false,
		reset: false,
		error: redactedError,
		lines: [{
			omitted: "log-tail-read-failed",
			error: redactedError
		}]
	};
}
function logString(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function isBonjourLogRecord(record) {
	if ([
		"subsystem",
		"logger",
		"module",
		"pluginId",
		"component"
	].some((field) => logString(record, field)?.toLowerCase().includes("bonjour"))) return true;
	return logString(record, "msg")?.toLowerCase().startsWith("bonjour:") === true;
}
function classifyBonjourLogKind(normalizedMsg) {
	if (normalizedMsg.includes("disabling")) return "disabled";
	if (normalizedMsg.includes("restarting")) return "restarted";
	if (normalizedMsg.includes("suppressing ciao")) return "ciao_suppressed";
	if (normalizedMsg.includes("conflict")) return "conflict";
	if (normalizedMsg.includes("watchdog")) return "watchdog";
	return "other";
}
function summarizeBonjourLogs(logTail) {
	const summary = {
		count: 0,
		warnings: 0,
		flags: {
			disabled: false,
			restarted: false,
			ciaoSuppressed: false
		}
	};
	for (const record of logTail.lines) {
		if (!isBonjourLogRecord(record)) continue;
		summary.count += 1;
		const level = logString(record, "level")?.toLowerCase();
		if (level === "warn" || level === "error") summary.warnings += 1;
		const normalizedMsg = logString(record, "msg")?.toLowerCase() ?? "";
		summary.flags.disabled ||= normalizedMsg.includes("disabling");
		summary.flags.restarted ||= normalizedMsg.includes("restarting");
		summary.flags.ciaoSuppressed ||= normalizedMsg.includes("suppressing ciao");
		summary.last = {
			...logString(record, "time") ? { time: logString(record, "time") } : {},
			...logString(record, "level") ? { level: logString(record, "level") } : {},
			kind: classifyBonjourLogKind(normalizedMsg)
		};
	}
	return summary;
}
async function collectSupportLogTail(params) {
	try {
		const tail = await params.readLogTail({
			limit: params.limit,
			maxBytes: params.maxBytes
		});
		assertNotUpdateCapturePath(tail.file, params.redaction.stateDir);
		return sanitizeLogTail(tail, params.redaction);
	} catch (error) {
		return failedLogTail(error, params.redaction);
	}
}
function describeStabilityForDiagnostics(stability, redaction) {
	if (stability.status === "found") return {
		status: "found",
		path: redactPathForSupport(stability.path, redaction),
		mtimeMs: stability.mtimeMs,
		eventCount: stability.bundle.snapshot.count,
		reason: stability.bundle.reason,
		generatedAt: stability.bundle.generatedAt
	};
	if (stability.status === "missing") return {
		status: "missing",
		dir: redactPathForSupport(stability.dir, redaction)
	};
	return {
		status: "failed",
		path: stability.path ? redactPathForSupport(stability.path, redaction) : void 0,
		error: redactErrorForSupport(stability.error, redaction)
	};
}
function renderSummary(params) {
	const stabilityLine = params.stability.status === "found" ? `included latest stability bundle (${params.stability.bundle.snapshot.count} event(s))` : `no stability bundle included (${params.stability.status})`;
	const configLine = params.config.exists ? `config shape included (${params.config.parseOk ? "parsed" : "parse failed"})` : params.config.error ?? "config file not found";
	const logTailLine = params.logTail.status === "failed" ? `sanitized log tail unavailable (${params.logTail.error})` : `sanitized log tail (${params.logTail.lineCount} line(s), inspected ${params.logTail.size} byte(s), raw messages omitted)`;
	const supportSnapshotLine = (label, snapshot) => {
		if (snapshot.status === "included") return `${label} snapshot included (${snapshot.path})`;
		if (snapshot.status === "failed") return `${label} snapshot failed (${snapshot.error})`;
		return `${label} snapshot skipped`;
	};
	return [
		"# OpenClaw Diagnostics Export",
		"",
		"Attach this zip to the bug report. It is designed for maintainers to inspect without asking for raw logs first.",
		"",
		"## Generated",
		"",
		`Generated: ${params.generatedAt}`,
		`OpenClaw: ${VERSION}`,
		"",
		"## Contents",
		"",
		`- ${stabilityLine}`,
		`- ${logTailLine}`,
		`- ${configLine}`,
		`- ${supportSnapshotLine("gateway status", params.status)}`,
		`- ${supportSnapshotLine("gateway health", params.health)}`,
		"",
		"## Maintainer Quick Read",
		"",
		"- `manifest.json`: file inventory and privacy notes",
		"- `diagnostics.json`: top-level summary of config, logs, Bonjour/mDNS, stability, status, and health",
		"- `config/sanitized.json`: config values with credentials, private identifiers, and prompt text redacted",
		"- `status/gateway-status.json`: sanitized service/connectivity snapshot",
		"- `health/gateway-health.json`: sanitized Gateway health snapshot",
		"- `logs/openclaw-sanitized.jsonl`: sanitized log summaries and metadata",
		"- `stability/latest.json`: newest payload-free stability bundle, when available",
		"",
		"## Privacy",
		"",
		"- raw chat text, webhook bodies, tool outputs, tokens, cookies, and secrets are not included intentionally",
		"- log records keep operational summaries and safe metadata fields",
		"- status and health snapshots redact secret fields, payload-like fields, and account/message identifiers",
		"- config output keeps useful settings but redacts secrets, private identifiers, and prompt text"
	].join("\n");
}
function defaultOutputPath(options) {
	return path.join(options.stateDir, "logs", "support", `${SUPPORT_EXPORT_PREFIX}${formatDiagnosticFilenameTimestamp(options.now)}-${process.pid}${SUPPORT_EXPORT_SUFFIX}`);
}
function resolveOutputPath(options) {
	const raw = options.outputPath?.trim();
	if (!raw) return defaultOutputPath(options);
	const resolved = path.isAbsolute(raw) || raw.startsWith("~") ? resolveHomeRelativePath(raw, { env: options.env }) : path.resolve(options.cwd, raw);
	try {
		if (fs.statSync(resolved).isDirectory()) return path.join(resolved, `${SUPPORT_EXPORT_PREFIX}${formatDiagnosticFilenameTimestamp(options.now)}-${process.pid}${SUPPORT_EXPORT_SUFFIX}`);
	} catch {}
	return resolved;
}
async function buildDiagnosticSupportExport(options = {}) {
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveStateDir(env);
	const generatedAt = (options.now ?? /* @__PURE__ */ new Date()).toISOString();
	const configPath = resolveConfigPath(env, stateDir);
	const stability = readStabilityBundle(options.stabilityBundle, stateDir);
	const redaction = {
		env,
		stateDir
	};
	const logTail = await collectSupportLogTail({
		readLogTail: options.readLogTail ?? readConfiguredLogTail,
		limit: normalizePositiveInteger(options.logLimit, DEFAULT_LOG_LIMIT),
		maxBytes: normalizePositiveInteger(options.logMaxBytes, DEFAULT_LOG_MAX_BYTES),
		redaction
	});
	const config = readConfigExport({
		configPath,
		env,
		stateDir
	});
	const [statusSnapshot, healthSnapshot] = await Promise.all([collectSupportSnapshot({
		path: "status/gateway-status.json",
		reader: options.readStatusSnapshot,
		generatedAt,
		redaction
	}), collectSupportSnapshot({
		path: "health/gateway-health.json",
		reader: options.readHealthSnapshot,
		generatedAt,
		redaction
	})]);
	const diagnostics = {
		generatedAt,
		openclawVersion: VERSION,
		process: {
			platform: process.platform,
			arch: process.arch,
			node: process.versions.node,
			pid: process.pid
		},
		stateDir: redactPathForSupport(stateDir, redaction),
		config: config.shape,
		logs: {
			file: logTail.file,
			cursor: logTail.cursor,
			size: logTail.size,
			lineCount: logTail.lineCount,
			truncated: logTail.truncated,
			reset: logTail.reset
		},
		stability: describeStabilityForDiagnostics(stability, redaction),
		bonjour: summarizeBonjourLogs(logTail),
		status: statusSnapshot.summary,
		health: healthSnapshot.summary
	};
	const files = [
		jsonSupportBundleFile("diagnostics.json", diagnostics),
		jsonSupportBundleFile("config/shape.json", config.shape),
		jsonSupportBundleFile("config/sanitized.json", config.sanitized ?? null),
		jsonlSupportBundleFile("logs/openclaw-sanitized.jsonl", logTail.lines.map((line) => JSON.stringify(line)))
	];
	for (const snapshot of [statusSnapshot, healthSnapshot]) if (snapshot.file) files.push(snapshot.file);
	if (stability.status === "found") files.push(jsonSupportBundleFile("stability/latest.json", stability.bundle));
	files.push(textSupportBundleFile("summary.md", renderSummary({
		generatedAt,
		stability,
		logTail,
		config: config.shape,
		status: statusSnapshot.summary,
		health: healthSnapshot.summary
	})));
	const manifest = {
		version: DIAGNOSTIC_SUPPORT_EXPORT_VERSION,
		generatedAt,
		openclawVersion: VERSION,
		platform: process.platform,
		arch: process.arch,
		node: process.versions.node,
		stateDir: redactPathForSupport(stateDir, redaction),
		contents: supportBundleContents(files),
		privacy: {
			payloadFree: true,
			rawLogsIncluded: false,
			notes: [
				"Stability bundles are payload-free diagnostic snapshots.",
				"Logs keep operational summaries and safe metadata fields; payload-like fields are omitted.",
				"Status and health snapshots redact secrets, payload-like fields, and account/message identifiers.",
				"Config output includes useful settings with credentials, private identifiers, and prompt text redacted."
			]
		}
	};
	return {
		manifest,
		files: [jsonSupportBundleFile("manifest.json", manifest), ...files]
	};
}
async function writeDiagnosticSupportExport(options = {}) {
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveStateDir(env);
	const now = options.now ?? /* @__PURE__ */ new Date();
	const outputPath = resolveOutputPath({
		outputPath: options.outputPath,
		cwd: options.cwd ?? process.cwd(),
		env,
		stateDir,
		now
	});
	const artifact = await buildDiagnosticSupportExport({
		...options,
		env,
		stateDir,
		now
	});
	const published = await writeSupportBundleZip({
		outputPath,
		files: artifact.files,
		compressionLevel: 6
	});
	return {
		path: published.path,
		bytes: published.bytes,
		manifest: artifact.manifest
	};
}
//#endregion
export { writeDiagnosticSupportExport };
