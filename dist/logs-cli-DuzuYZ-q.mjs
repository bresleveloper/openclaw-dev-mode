import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { P as resolvePositiveTimerTimeoutMs, j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { f as toStringifiedError, n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { t as clearActiveProgressLine } from "./progress-line-Bn5MVCt6.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { o as redactSensitiveLines, p as resolveRedactOptions } from "./redact-BcXJu5HP.mjs";
import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-C4n2JwGL.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import "./backoff-N5Hi0doU.mjs";
import { s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import { f as readConnectPairingRequiredMessage } from "./connect-error-details-DhaB57zU.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as projectGatewayConnectionDetailsForDiagnostics } from "./connection-details-DtBQnYSj.mjs";
import { s as isGatewayTransportError } from "./transport-error-VfHcwKpH.mjs";
import { u as throwExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { n as resolveGatewayLocalPortOverride } from "./gateway-port-option-C-xAMj5k.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import { t as buildGatewayConnectionDetails } from "./call-b1jzw5fz.mjs";
import { t as readGatewayDispatchConfig } from "./gateway-dispatch-config-Cbux7zcH.mjs";
import { t as createSafeStreamWriter } from "./stream-writer-DovsKEsG.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { r as parseLogLine, t as readConfiguredLogTail } from "./log-tail--fTVkumy.mjs";
import { t as parseLogsPositiveInt } from "./logs-cli.options-B2OqnHxB.mjs";
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
	params.signal?.throwIfAborted();
	const gatewayExtra = buildLogsTailGatewayExtra(opts, showProgress);
	const payload = await callGatewayFromCli("logs.tail", opts, {
		cursor: gatewayCursor,
		limit: params.limit,
		maxBytes: params.maxBytes
	}, params.signal ? {
		...gatewayExtra,
		signal: params.signal
	} : gatewayExtra);
	params.signal?.throwIfAborted();
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
	params.signal?.throwIfAborted();
	if (process.platform !== "linux") return null;
	const runtime = await import("./logs-cli.runtime.js");
	params.signal?.throwIfAborted();
	const service = await runtime.readSystemdServiceRuntime(process.env);
	params.signal?.throwIfAborted();
	if (service.status !== "running" || typeof service.pid !== "number") return null;
	const limit = resolveIntegerOption(params.limit, 1, {
		min: 1,
		max: JOURNAL_MAX_LIMIT
	});
	const maxBytes = resolveIntegerOption(params.maxBytes, 1, {
		min: 1,
		max: JOURNAL_MAX_BYTES
	});
	const unitOverride = process.env.OPENCLAW_SYSTEMD_UNIT?.trim();
	const unitName = unitOverride ? unitOverride.endsWith(".service") ? unitOverride : `${unitOverride}.service` : `${runtime.resolveGatewaySystemdServiceName(process.env.OPENCLAW_PROFILE)}.service`;
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
	params.signal?.throwIfAborted();
	if (result.code !== 0) return null;
	const firstNewline = result.truncated ? result.stdout.indexOf("\n") : -1;
	const parsed = parseJournalctlOutput(result.truncated ? firstNewline < 0 ? "" : result.stdout.slice(firstNewline + 1) : result.stdout);
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
		truncated: result.truncated || parsed.lines.length > limit,
		localFallback: true
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
	const writer = createSafeStreamWriter((err, stream) => {
		onOutputClosed?.();
		const code = err.code ?? "EPIPE";
		const message = `openclaw logs: output ${stream === process.stdout ? "stdout" : "stderr"} closed (${code}). Stopping tail.`;
		try {
			clearActiveProgressLine();
			process.stderr.write(`${message}\n`);
		} catch {}
	});
	return {
		logLine: (text) => writer.writeLine(process.stdout, text),
		errorLine: (text) => writer.writeLine(process.stderr, text),
		emitJsonLine: (payload, toStdErr = false) => writer.write(toStdErr ? process.stderr : process.stdout, `${JSON.stringify(payload)}\n`)
	};
}
function registerLogsCli(program) {
	const logs = program.command("logs").description("Tail gateway file logs via RPC").option("--limit <n>", "Max lines to return", "200").option("--max-bytes <n>", "Max bytes to read", "250000").option("--follow", "Follow log output", false).option("--interval <ms>", "Polling interval in ms", "1000").option("--json", "Emit JSON log lines", false).option("--plain", "Plain text output (no ANSI styling)", false).option("--no-color", "Disable ANSI colors").option("--local-time", "Display timestamps in local timezone (default)", false).option("--utc", "Display timestamps in UTC", false).addHelpText("after", () => formatDocsHelp("/cli/logs"));
	addGatewayClientOptions(logs);
	logs.action(async (rawOpts) => {
		const signal = getAsyncWorkSignal();
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
				return gatewayRecovery.promise;
			}
		};
		const clearConsumedGatewayRecovery = (promise, result) => {
			const isMatchingProbe = gatewayRecovery.kind === "probing" && gatewayRecovery.promise === promise;
			const isMatchingResult = gatewayRecovery.kind === "settled" && gatewayRecovery.result === result;
			if (isMatchingProbe || isMatchingResult) gatewayRecovery = { kind: "idle" };
		};
		const { logLine, errorLine, emitJsonLine } = createLogWriters(() => {
			abortGatewayRecoveryProbe();
		});
		const interval = resolvePositiveTimerTimeoutMs(parseLogsPositiveInt(opts.interval, 1e3, "--interval"), 1e3);
		const limit = parseLogsPositiveInt(opts.limit, 200, "--limit");
		const maxBytes = parseLogsPositiveInt(opts.maxBytes, 25e4, "--max-bytes");
		let gatewayCursor;
		let gatewayFile;
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
		if (opts.localTime && opts.utc) throwExpectedCliError("Pass only one of --local-time or --utc.");
		const localTime = !opts.utc;
		const emitConnectionNotice = (message, style) => jsonMode ? emitJsonLine({
			type: "notice",
			message
		}, true) : errorLine(colorize(rich, style, message));
		if (configUnavailable) emitConnectionNotice(`Warning: Configuration could not be read. ${opts.localConfigUnavailable ? "Reading local file logs. " : ""}Run \`${formatCliCommand("openclaw doctor --fix")}\`.`, theme.warn);
		const startGatewayRecoveryProbe = () => {
			if (signal?.aborted || !preferJournal || gatewayRecovery.kind !== "idle") return;
			const startedAt = (/* @__PURE__ */ new Date()).toISOString();
			const abortController = new AbortController();
			const promise = fetchGatewayLogs(opts, gatewayCursor, false, {
				limit,
				maxBytes,
				signal: signal ? AbortSignal.any([signal, abortController.signal]) : abortController.signal
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
				maxBytes,
				signal
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
		try {
			for (;;) {
				if (signal?.aborted) break;
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
							maxBytes,
							signal
						});
					} catch (error) {
						signal?.throwIfAborted();
						if (!shouldUseLocalLogsFallback(opts, error)) throw error;
						if (opts.follow) {
							const journalPayload = await readSystemdJournalFallback({
								cursor: journalCursor,
								since: journalSince,
								limit,
								maxBytes,
								signal
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
					if (gatewayCursor !== void 0 && gatewayFile !== void 0 && payload.file !== void 0 && payload.file !== gatewayFile) {
						gatewayCursor = void 0;
						gatewayPollStartedAt = (/* @__PURE__ */ new Date()).toISOString();
						payload = opts.localConfigUnavailable ? {
							...await readConfiguredLogTail({
								limit,
								maxBytes
							}),
							sourceKind: "file",
							localFallback: true
						} : await fetchGatewayLogs(opts, gatewayCursor, false, {
							limit,
							maxBytes,
							signal
						});
					}
				} catch (err) {
					signal?.throwIfAborted();
					if (opts.follow && followRetryAttempt < MAX_FOLLOW_RETRIES && isTransientFollowError(err)) {
						followRetryAttempt += 1;
						const backoffMs = computeBackoff(FOLLOW_BACKOFF_POLICY, followRetryAttempt);
						if (!emitConnectionNotice(`[logs] gateway disconnected, reconnecting in ${Math.round(backoffMs / 1e3)}s...`, theme.warn)) return;
						await setTimeout(backoffMs, void 0, { signal });
						continue;
					}
					const hint = `Hint: run \`${formatCliCommand("openclaw doctor")}\`.`;
					const errorText = redactSensitiveUrlLikeString(formatErrorMessage(err));
					const details = projectGatewayConnectionDetailsForDiagnostics(isGatewayTransportError(err) ? err.connectionDetails : opts.connection);
					if (jsonMode) emitJsonLine({
						type: "error",
						message: errorText,
						error: errorText,
						details,
						hint
					}, true);
					else if (errorLine(colorize(rich, theme.error, errorText)) && errorLine(details.message)) errorLine(colorize(rich, theme.muted, hint));
					defaultRuntime.exit(1, { resetStream: jsonMode ? process.stderr : void 0 });
					return;
				}
				signal?.throwIfAborted();
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
						gatewayFile = payload.file;
						if (opts.follow) {
							journalCursor = void 0;
							journalSince = gatewayPollStartedAt;
						}
					} else if (typeof payload.cursor === "string" && payload.cursor.trim().length > 0) journalCursor = payload.cursor;
				}
				if (sourceIdentity !== void 0) lastSourceIdentity = sourceIdentity;
				first = false;
				if (!opts.follow) return;
				await setTimeout(interval, void 0, { signal });
			}
		} catch (error) {
			if (!signal?.aborted) throw error;
		} finally {
			await abortGatewayRecoveryProbe();
		}
	});
}
//#endregion
export { registerLogsCli };
