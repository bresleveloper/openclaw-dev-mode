import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs, j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { d as toStringifiedError, t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import { C as resolveRedactOptions, g as redactSensitiveLines } from "./redact-DJ8j6ADa.mjs";
import { n as computeBackoff } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import "./backoff-BrzXG7iD.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-BtunGZyj.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import { f as readConnectPairingRequiredMessage } from "./connect-error-details-q_NaMExM.mjs";
import { t as buildGatewayConnectionDetails } from "./call-DnqhP17M.mjs";
import { t as readGatewayDispatchConfig } from "./gateway-dispatch-config-DIC_vPET.mjs";
import { n as projectGatewayConnectionDetailsForDiagnostics } from "./connection-details-BcuL3xPn.mjs";
import { t as createSafeStreamWriter } from "./stream-writer-CHkNJ2hY.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { r as parseLogLine, t as readConfiguredLogTail } from "./log-tail-DwxGxkhZ.mjs";
import { setTimeout } from "node:timers/promises";
//#region src/cli/logs-cli.format.ts
function formatLogTimestamp(value, mode = "plain", localTime = true) {
	if (!value) return "";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	if (mode === "pretty") return formatTimestamp(parsed, {
		style: "short",
		timeZone: localTime ? void 0 : "UTC"
	});
	return localTime ? formatTimestamp(parsed, { style: "long" }) : parsed.toISOString();
}
function formatLogsCliLine(raw, opts) {
	const parsed = parseLogLine(raw);
	if (!parsed) return raw;
	const label = parsed.subsystem ?? parsed.module ?? parsed.plugin ?? "";
	const time = formatLogTimestamp(parsed.time, opts.pretty ? "pretty" : "plain", opts.localTime);
	const level = parsed.level ?? "";
	const message = parsed.message || parsed.raw;
	if (!opts.pretty) return [
		time,
		level,
		label,
		message
	].filter(Boolean).join(" ").trim();
	const timeLabel = colorize(opts.rich, theme.muted, time);
	const labelValue = colorize(opts.rich, theme.accent, label);
	const levelStyle = level === "error" || level === "fatal" ? theme.error : level === "warn" ? theme.warn : level === "debug" || level === "trace" ? theme.muted : theme.info;
	const levelValue = colorize(opts.rich, levelStyle, level);
	const messageValue = colorize(opts.rich, levelStyle, message);
	return [[
		timeLabel,
		levelValue,
		labelValue
	].filter(Boolean).join(" "), messageValue].filter(Boolean).join(" ").trim();
}
//#endregion
//#region src/cli/logs-cli.options.ts
function parseLogsPositiveInt(value, fallback, flag) {
	if (value === void 0) return fallback;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
//#endregion
//#region src/cli/logs-cli.ts
const LOCAL_FALLBACK_NOTICE = "Local Gateway RPC unavailable; reading configured file log instead.";
const JOURNAL_FALLBACK_NOTICE = "Local Gateway RPC unavailable; reading active systemd gateway journal instead.";
const JOURNAL_CURSOR_PREFIX = "-- cursor: ";
const JOURNAL_MAX_LIMIT = 5e3;
const JOURNAL_MAX_BYTES = 1e6;
function normalizeLogTailPayloadSource(payload) {
	if (payload.sourceKind || !payload.file) return payload;
	return {
		...payload,
		sourceKind: "file"
	};
}
function buildLogSourceIdentity(payload) {
	const sourceKind = payload.sourceKind ?? (payload.file ? "file" : void 0);
	if (!sourceKind && !payload.file && !payload.source) return;
	return JSON.stringify({
		file: payload.file,
		source: payload.source,
		sourceKind,
		servicePid: payload.service?.pid,
		serviceUnit: payload.service?.unit,
		localFallback: payload.localFallback === true ? true : void 0
	});
}
function buildLogMetaRecord(payload) {
	return {
		type: "meta",
		file: payload.file,
		source: payload.source,
		sourceKind: payload.sourceKind ?? (payload.file ? "file" : void 0),
		service: payload.service,
		cursor: payload.cursor,
		size: payload.size,
		localFallback: payload.localFallback === true ? true : void 0
	};
}
async function fetchGatewayLogs(opts, gatewayCursor, showProgress, params) {
	const gatewayExtra = buildLogsTailGatewayExtra(opts, showProgress);
	const payload = await callGatewayFromCli("logs.tail", opts, {
		cursor: gatewayCursor,
		limit: params.limit,
		maxBytes: params.maxBytes
	}, params.signal ? {
		...gatewayExtra,
		signal: params.signal
	} : gatewayExtra);
	if (!payload || typeof payload !== "object") throw new Error("Unexpected logs.tail response");
	return payload;
}
function shouldUseLocalLogsFallback(opts, error) {
	if (!isLocalGatewayRpcUnavailableError(error)) return false;
	if (typeof opts.url === "string" && opts.url.trim().length > 0) return false;
	return isImplicitLoopbackGatewayConnection(isGatewayTransportError(error) ? error.connectionDetails : opts.connection);
}
function buildLogsTailGatewayExtra(opts, showProgress) {
	const base = { progress: showProgress };
	if (opts.url?.trim() || !isImplicitLoopbackGatewayConnection(opts.connection)) return base;
	return {
		...base,
		clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
		mode: GATEWAY_CLIENT_MODES.BACKEND,
		deviceIdentity: null
	};
}
function isImplicitLoopbackGatewayConnection(connection) {
	if (connection.urlSource !== "local loopback") return false;
	try {
		return isLoopbackHost(new URL(connection.url).hostname);
	} catch {
		return false;
	}
}
function isLocalGatewayRpcUnavailableError(error) {
	if (isGatewayTransportError(error)) return error.kind === "closed" || error.kind === "timeout";
	const message = normalizeLowercaseStringOrEmpty(coerceErrorMessage(error));
	if (readConnectPairingRequiredMessage(message)) return true;
	return isPlainGatewayRequestUnavailableError(message);
}
function isPlainGatewayRequestUnavailableError(message) {
	return message.startsWith("gateway closed (") || /^gateway timeout after \d+ms\b/u.test(message);
}
async function readSystemdJournalFallback(params) {
	if (process.platform !== "linux") return null;
	const runtime = await import("./logs-cli.runtime.js");
	const service = await runtime.readSystemdServiceRuntime(process.env);
	if (service.status !== "running" || typeof service.pid !== "number") return null;
	const limit = resolveIntegerOption(params.limit, 1, {
		min: 1,
		max: JOURNAL_MAX_LIMIT
	});
	const maxBytes = resolveIntegerOption(params.maxBytes, 1, {
		min: 1,
		max: JOURNAL_MAX_BYTES
	});
	const unitName = resolveLogsSystemdUnitName(runtime, process.env);
	const source = `journalctl --user --boot --user-unit=${unitName} _PID=${service.pid}`;
	const args = [
		"--user",
		"--boot",
		`--user-unit=${unitName}`,
		`_PID=${service.pid}`,
		"--no-pager",
		"--output=cat",
		"--show-cursor"
	];
	if (typeof params.cursor === "string" && params.cursor.trim().length > 0) args.push(`--after-cursor=${params.cursor}`);
	else if (params.since) args.push(`--since=${params.since.replace("T", " ").replace("Z", " UTC")}`);
	else args.push("-n", String(limit));
	const result = await runtime.execFileUtf8Tail("journalctl", args, {
		env: process.env,
		maxBytes
	});
	if (result.code !== 0) return null;
	const boundedOutput = normalizeTailText(result.stdout, result.truncated);
	const parsed = parseJournalctlOutput(boundedOutput.text);
	const lines = parsed.lines.length > limit ? parsed.lines.slice(-limit) : parsed.lines;
	const redaction = resolveRedactOptions();
	return {
		source,
		sourceKind: "journal",
		service: {
			pid: service.pid,
			unit: unitName
		},
		cursor: parsed.cursor ?? params.cursor,
		lines: redactSensitiveLines(lines, redaction),
		truncated: boundedOutput.truncated || parsed.lines.length > limit,
		localFallback: true
	};
}
function normalizeTailText(text, truncated) {
	if (!truncated) return {
		text,
		truncated
	};
	const firstNewline = text.indexOf("\n");
	if (firstNewline < 0) return {
		text: "",
		truncated
	};
	return {
		text: text.slice(firstNewline + 1),
		truncated
	};
}
function formatLogResetNotice(skippedBytes) {
	return skippedBytes !== void 0 && skippedBytes > 0 ? `Log cursor re-anchored (skipped ${skippedBytes} bytes).` : "Log cursor reset (file rotated).";
}
function parseJournalctlOutput(output) {
	const lines = [];
	let cursor;
	for (const rawLine of output.split(/\r?\n/u)) {
		if (!rawLine) continue;
		if (rawLine.startsWith(JOURNAL_CURSOR_PREFIX)) {
			cursor = rawLine.slice(11).trim() || cursor;
			continue;
		}
		lines.push(rawLine);
	}
	return {
		lines,
		cursor
	};
}
function resolveLogsSystemdUnitName(runtime, env) {
	const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
	if (override) return override.endsWith(".service") ? override : `${override}.service`;
	return `${runtime.resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
const MAX_FOLLOW_RETRIES = 8;
const FOLLOW_BACKOFF_POLICY = {
	initialMs: 1e3,
	maxMs: 3e4,
	factor: 2,
	jitter: .2
};
function isTransientFollowError(error) {
	if (isGatewayTransportError(error)) {
		if (error.kind === "timeout") return true;
		const code = error.code ?? 0;
		return code !== 1008 && !(code >= 4e3 && code <= 4999);
	}
	const message = normalizeLowercaseStringOrEmpty(coerceErrorMessage(error));
	if (readConnectPairingRequiredMessage(message)) return false;
	return isPlainGatewayRequestUnavailableError(message);
}
function createLogWriters(onOutputClosed) {
	const writer = createSafeStreamWriter({
		beforeWrite: () => clearActiveProgressLine(),
		onBrokenPipe: (err, stream) => {
			onOutputClosed?.();
			const code = err.code ?? "EPIPE";
			const message = `openclaw logs: output ${stream === process.stdout ? "stdout" : "stderr"} closed (${code}). Stopping tail.`;
			try {
				clearActiveProgressLine();
				process.stderr.write(`${message}\n`);
			} catch {}
		}
	});
	return {
		logLine: (text) => writer.writeLine(process.stdout, text),
		errorLine: (text) => writer.writeLine(process.stderr, text),
		emitJsonLine: (payload, toStdErr = false) => writer.write(toStdErr ? process.stderr : process.stdout, `${JSON.stringify(payload)}\n`)
	};
}
async function emitGatewayError(err, opts, mode, rich, emitJsonLine, errorLine) {
	const hint = `Hint: run \`${formatCliCommand("openclaw doctor")}\`.`;
	const errorText = redactSensitiveUrlLikeString(formatErrorMessage(err));
	const details = projectGatewayConnectionDetailsForDiagnostics(isGatewayTransportError(err) ? err.connectionDetails : opts.connection);
	if (mode === "json") {
		emitJsonLine({
			type: "error",
			message: errorText,
			error: errorText,
			details,
			hint
		}, true);
		return;
	}
	if (!errorLine(colorize(rich, theme.error, errorText))) return;
	if (!errorLine(details.message)) return;
	errorLine(colorize(rich, theme.muted, hint));
}
function registerLogsCli(program) {
	const logs = program.command("logs").description("Tail gateway file logs via RPC").option("--limit <n>", "Max lines to return", "200").option("--max-bytes <n>", "Max bytes to read", "250000").option("--follow", "Follow log output", false).option("--interval <ms>", "Polling interval in ms", "1000").option("--json", "Emit JSON log lines", false).option("--plain", "Plain text output (no ANSI styling)", false).option("--no-color", "Disable ANSI colors").option("--local-time", "Display timestamps in local timezone (default)", false).option("--utc", "Display timestamps in UTC", false).addHelpText("after", () => formatDocsHelp("/cli/logs"));
	addGatewayClientOptions(logs);
	logs.action(async (rawOpts) => {
		const localPortOverride = resolveGatewayLocalPortOverride(rawOpts);
		let config;
		let configUnavailable = false;
		try {
			config = readGatewayDispatchConfig();
		} catch {
			config = {};
			configUnavailable = true;
		}
		const connection = buildGatewayConnectionDetails({
			config,
			url: rawOpts.url,
			localPortOverride
		});
		const opts = {
			...rawOpts,
			localPortOverride,
			connection,
			...configUnavailable ? { config } : {},
			localConfigUnavailable: configUnavailable && isImplicitLoopbackGatewayConnection(connection)
		};
		let gatewayRecovery = { kind: "idle" };
		const abortGatewayRecoveryProbe = () => {
			if (gatewayRecovery.kind === "probing") {
				gatewayRecovery.abortController.abort();
				gatewayRecovery = { kind: "idle" };
			}
		};
		const clearConsumedGatewayRecovery = (promise, result) => {
			const isMatchingProbe = gatewayRecovery.kind === "probing" && gatewayRecovery.promise === promise;
			const isMatchingResult = gatewayRecovery.kind === "settled" && gatewayRecovery.result === result;
			if (isMatchingProbe || isMatchingResult) gatewayRecovery = { kind: "idle" };
		};
		const { logLine, errorLine, emitJsonLine } = createLogWriters(abortGatewayRecoveryProbe);
		const interval = resolvePositiveTimerTimeoutMs(parseLogsPositiveInt(opts.interval, 1e3, "--interval"), 1e3);
		const limit = parseLogsPositiveInt(opts.limit, 200, "--limit");
		const maxBytes = parseLogsPositiveInt(opts.maxBytes, 25e4, "--max-bytes");
		let gatewayCursor;
		let journalCursor;
		let journalSince;
		let preferJournal = false;
		let first = true;
		let lastSourceIdentity;
		const jsonMode = Boolean(opts.json);
		const emitNotice = (message) => jsonMode ? emitJsonLine({
			type: "notice",
			message
		}) : errorLine(message);
		const pretty = !jsonMode && process.stdout.isTTY && !opts.plain;
		const rich = isRich() && opts.color !== false && !opts.plain;
		const localTime = !opts.utc;
		const emitConnectionNotice = (message, style) => jsonMode ? emitJsonLine({
			type: "notice",
			message
		}, true) : errorLine(colorize(rich, style, message));
		if (configUnavailable) emitConnectionNotice(`Warning: Configuration could not be read. ${opts.localConfigUnavailable ? "Reading local file logs. " : ""}Run \`${formatCliCommand("openclaw doctor --fix")}\`.`, theme.warn);
		const startGatewayRecoveryProbe = () => {
			if (!preferJournal || gatewayRecovery.kind !== "idle") return;
			const startedAt = (/* @__PURE__ */ new Date()).toISOString();
			const abortController = new AbortController();
			const promise = fetchGatewayLogs(opts, gatewayCursor, false, {
				limit,
				maxBytes,
				signal: abortController.signal
			}).then((payload) => ({
				ok: true,
				payload,
				startedAt
			}), (error) => ({
				ok: false,
				error
			}));
			gatewayRecovery = {
				kind: "probing",
				promise,
				abortController
			};
			promise.then((result) => {
				if (gatewayRecovery.kind === "probing" && gatewayRecovery.promise === promise) gatewayRecovery = {
					kind: "settled",
					result
				};
			});
		};
		const readJournalWhileProbingRecovery = async () => {
			let fallbackError;
			if (gatewayRecovery.kind === "settled") {
				const result = gatewayRecovery.result;
				gatewayRecovery = { kind: "idle" };
				if (result.ok) return {
					payload: result.payload,
					gatewayPollStartedAt: result.startedAt
				};
				if (!shouldUseLocalLogsFallback(opts, result.error)) throw toStringifiedError(result.error);
				fallbackError = toStringifiedError(result.error);
			}
			const activeProbe = gatewayRecovery.kind === "probing" ? gatewayRecovery.promise : void 0;
			const journalPayload = await readSystemdJournalFallback({
				cursor: journalCursor,
				since: journalSince,
				limit,
				maxBytes
			});
			if (journalPayload) return { payload: journalPayload };
			if (activeProbe) {
				const result = await activeProbe;
				clearConsumedGatewayRecovery(activeProbe, result);
				if (result.ok) return {
					payload: result.payload,
					gatewayPollStartedAt: result.startedAt
				};
				throw toStringifiedError(result.error);
			}
			throw fallbackError ?? /* @__PURE__ */ new Error("Active systemd journal unavailable for logs follow");
		};
		let followRetryAttempt = 0;
		while (true) {
			let payload;
			const showProgress = first && !opts.follow;
			let gatewayPollStartedAt = (/* @__PURE__ */ new Date()).toISOString();
			try {
				if (opts.localConfigUnavailable) payload = {
					...await readConfiguredLogTail({
						cursor: gatewayCursor,
						limit,
						maxBytes
					}),
					sourceKind: "file",
					localFallback: true
				};
				else if (preferJournal) {
					startGatewayRecoveryProbe();
					const result = await readJournalWhileProbingRecovery();
					payload = result.payload;
					gatewayPollStartedAt = result.gatewayPollStartedAt ?? gatewayPollStartedAt;
				} else try {
					payload = await fetchGatewayLogs(opts, gatewayCursor, showProgress, {
						limit,
						maxBytes
					});
				} catch (error) {
					if (!shouldUseLocalLogsFallback(opts, error)) throw error;
					if (opts.follow) {
						const journalPayload = await readSystemdJournalFallback({
							cursor: journalCursor,
							since: journalSince,
							limit,
							maxBytes
						});
						if (!journalPayload) throw error;
						payload = journalPayload;
					} else payload = {
						...await readConfiguredLogTail({
							cursor: gatewayCursor,
							limit,
							maxBytes
						}),
						sourceKind: "file",
						localFallback: true
					};
				}
			} catch (err) {
				if (opts.follow && followRetryAttempt < MAX_FOLLOW_RETRIES && isTransientFollowError(err)) {
					followRetryAttempt += 1;
					const backoffMs = computeBackoff(FOLLOW_BACKOFF_POLICY, followRetryAttempt);
					if (!emitConnectionNotice(`[logs] gateway disconnected, reconnecting in ${Math.round(backoffMs / 1e3)}s...`, theme.warn)) return;
					await setTimeout(backoffMs);
					continue;
				}
				await emitGatewayError(err, opts, jsonMode ? "json" : "text", rich, emitJsonLine, errorLine);
				defaultRuntime.exit(1, { resetStream: jsonMode ? process.stderr : void 0 });
				return;
			}
			if (followRetryAttempt > 0 && !emitConnectionNotice("[logs] gateway reconnected", theme.muted)) return;
			followRetryAttempt = 0;
			payload = normalizeLogTailPayloadSource(payload);
			const sourceIdentity = buildLogSourceIdentity(payload);
			const shouldEmitSourceMetadata = first || sourceIdentity !== void 0 && sourceIdentity !== lastSourceIdentity;
			const lines = Array.isArray(payload.lines) ? payload.lines : [];
			if (jsonMode) {
				if (shouldEmitSourceMetadata) {
					if (!emitJsonLine(buildLogMetaRecord(payload))) return;
				}
				for (const line of lines) {
					const parsed = parseLogLine(line);
					if (!emitJsonLine(parsed ? {
						type: "log",
						...parsed
					} : {
						type: "raw",
						raw: line
					})) return;
				}
			} else {
				if (shouldEmitSourceMetadata && payload.localFallback === true) {
					const notice = payload.sourceKind === "journal" ? JOURNAL_FALLBACK_NOTICE : LOCAL_FALLBACK_NOTICE;
					if (!errorLine(colorize(rich, theme.warn, notice))) return;
				}
				if (shouldEmitSourceMetadata) {
					if (payload.sourceKind === "journal" && payload.source) {
						if (!logLine(`${pretty ? colorize(rich, theme.muted, "Log source:") : "Log source:"} ${payload.source}`)) return;
						if (payload.service?.pid !== void 0 && !logLine(`Service PID: ${payload.service.pid}`)) return;
						if (payload.service?.unit && !logLine(`Service Unit: ${payload.service.unit}`)) return;
					} else if (payload.file) {
						if (!logLine(`${pretty ? colorize(rich, theme.muted, "Log file:") : "Log file:"} ${payload.file}`)) return;
					}
				}
				for (const line of lines) if (!logLine(formatLogsCliLine(line, {
					pretty,
					rich,
					localTime
				}))) return;
			}
			if (payload.truncated && !emitNotice("Log tail truncated (increase --limit or --max-bytes).")) return;
			if (payload.reset && !emitNotice(formatLogResetNotice(payload.skippedBytes))) return;
			if (payload.sourceKind === "journal") {
				preferJournal = true;
				if (typeof payload.cursor === "string" && payload.cursor.trim().length > 0) journalCursor = payload.cursor;
				startGatewayRecoveryProbe();
			} else {
				preferJournal = false;
				gatewayRecovery = { kind: "idle" };
				if (typeof payload.cursor === "number" && Number.isFinite(payload.cursor)) {
					gatewayCursor = payload.cursor;
					if (opts.follow) {
						journalCursor = void 0;
						journalSince = gatewayPollStartedAt;
					}
				} else if (typeof payload.cursor === "string" && payload.cursor.trim().length > 0) journalCursor = payload.cursor;
			}
			if (sourceIdentity !== void 0) lastSourceIdentity = sourceIdentity;
			first = false;
			if (!opts.follow) return;
			await setTimeout(interval);
		}
	});
}
//#endregion
export { registerLogsCli };
