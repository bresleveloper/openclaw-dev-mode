import { C as parseStrictNonNegativeInteger, D as resolveExpiresAtMsFromDurationMs, R as timestampMsToIsoString, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { c as visibleWidth, s as truncateToVisibleWidth } from "./ansi-CWsy0bu4.mjs";
import { n as formatTimestamp } from "./timestamps-tLN31L4a.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-DXO3PHhc.mjs";
import { i as formatLookupMiss } from "./error-format-B21fL1a_.mjs";
import { o as readCronJobNotFoundError } from "./gateway-error-details-D85F07e9.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { i as formatCliOperatorError, l as rethrowExpectedCliError, t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { r as isOffsetlessIsoDateTime, t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { n as resolveCronStaggerMs } from "./stagger-wESOTFE0.mjs";
import { r as listChannelPlugins } from "./registry-D3wOWFDo.mjs";
import "./plugins-BEpDh--e.mjs";
import { r as isJsonOutputModeActive } from "./json-output-mode-DRPBa2uN.mjs";
import { n as formatDurationHuman } from "./format-duration-CeDWULoS.mjs";
import { t as parseOffsetlessIsoDateTimeInTimeZone } from "./parse-offsetless-zoned-datetime-BPJWMjOZ.mjs";
import { t as formatExactDuration } from "./format-duration-exact-Cxymrq6G.mjs";
import { randomUUID } from "node:crypto";
//#region src/cli/cron-cli/cron-cli-error.ts
/** An operator error identified by cron input validation or a domain operation. */
var CronCliError = class extends Error {
	constructor(message, options) {
		super(typeof message === "string" ? message : message.message, options);
		this.originalError = typeof message === "string" ? void 0 : message;
		this.matches = options?.matches;
	}
};
//#endregion
//#region src/cli/cron-cli/shared.ts
function parseCronIntegerOption(value, flag, kind = "positive") {
	const parsed = kind === "non-negative" ? parseStrictNonNegativeInteger(value) : parseStrictPositiveInteger(value);
	if (value !== void 0 && parsed === void 0) throw new CronCliError(`Invalid ${flag} (must be a ${kind} integer).`);
	return parsed;
}
function parseCronNoOutputTimeoutOption(opts) {
	return parseCronIntegerOption(opts.noOutputTimeoutSeconds ?? (typeof opts.outputTimeoutSeconds === "string" || typeof opts.outputTimeoutSeconds === "number" ? opts.outputTimeoutSeconds : void 0), "--no-output-timeout-seconds");
}
function parseCronArgv(value, flag) {
	if (typeof value !== "string") return;
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch {
		throw new CronCliError(`${flag} must be a JSON array of strings`);
	}
	if (!Array.isArray(parsed) || parsed.length === 0 || parsed.some((entry) => typeof entry !== "string" || entry.length === 0)) throw new CronCliError(`${flag} must be a non-empty JSON array of non-empty strings`);
	return parsed;
}
function parseCronCommandArgv(value) {
	return parseCronArgv(value, "--command-argv");
}
function parseCronStreamCommandArgv(value) {
	return parseCronArgv(value, "--stream-command");
}
function parseCronCommandEnv(values) {
	const rawValues = Array.isArray(values) ? values : typeof values === "string" ? [values] : [];
	if (rawValues.length === 0) return;
	const env = {};
	for (const raw of rawValues) {
		if (typeof raw !== "string") throw new CronCliError("--command-env must be KEY=VALUE");
		const idx = raw.indexOf("=");
		const key = idx > 0 ? raw.slice(0, idx).trim() : "";
		if (!key) throw new CronCliError("--command-env must be KEY=VALUE");
		env[key] = raw.slice(idx + 1);
	}
	return env;
}
const getCronChannelOptions = () => {
	const pluginIds = listChannelPlugins().map((plugin) => plugin.id).filter(Boolean);
	return pluginIds.length > 0 ? ["last", ...pluginIds].join("|") : "last|<channel-plugin-id>";
};
function toLocalIsoTime(value) {
	return typeof value === "number" && Number.isFinite(value) ? formatTimestamp(new Date(value), { style: "long" }) : void 0;
}
/**
* CLI-only display enrichment for `cron runs` history entries: adds a short
* `cause` alias for `errorReason` plus readable local-offset ISO mirrors of the
* numeric timestamps (matching the diagnostic log `time` format). Stored data
* and the gateway protocol stay unchanged; raw numeric fields are preserved.
*/
function enrichCronRunEntriesForDisplay(value) {
	if (!value || typeof value !== "object") return value;
	const record = value;
	const entries = record.entries;
	if (!Array.isArray(entries)) return value;
	const nextEntries = entries.map((entry) => {
		if (!entry || typeof entry !== "object") return entry;
		const item = entry;
		if (item.action !== "finished") return item;
		const extra = {};
		const cause = typeof item.errorReason === "string" ? item.errorReason.trim() : "";
		if (cause) extra.cause = cause;
		const tsIso = toLocalIsoTime(item.ts);
		if (tsIso) extra.tsIso = tsIso;
		const runAtIso = toLocalIsoTime(item.runAtMs);
		if (runAtIso) extra.runAtIso = runAtIso;
		const nextRunAtIso = toLocalIsoTime(item.nextRunAtMs);
		if (nextRunAtIso) extra.nextRunAtIso = nextRunAtIso;
		return Object.keys(extra).length > 0 ? Object.assign({}, item, extra) : item;
	});
	return {
		...record,
		entries: nextEntries
	};
}
function printCronJson(value) {
	defaultRuntime.writeJson(enrichCronRunEntriesForDisplay(value));
}
/**
* Enrich a CronJob (or list response) with a computed `status` field
* derived from enabled + state.runningAtMs + state.lastRunStatus.
* This mirrors the human-readable status shown by `cron list` / `cron show`.
*/
function enrichCronJsonWithStatus(value) {
	if (!value || typeof value !== "object") return value;
	const obj = value;
	if ("state" in obj && "enabled" in obj) return {
		...obj,
		status: computeStatus(obj)
	};
	if ("jobs" in obj && Array.isArray(obj.jobs)) {
		const enrichedJobs = obj.jobs.map((job) => {
			const status = computeStatus(job);
			return Object.assign({}, job, { status });
		});
		return {
			...obj,
			jobs: enrichedJobs
		};
	}
	return value;
}
function computeStatus(job) {
	const state = asOptionalRecord(job.state) ?? {};
	if (state.runningAtMs) return "running";
	if (!job.enabled) return "disabled";
	return typeof state.lastRunStatus === "string" ? state.lastRunStatus : typeof state.lastStatus === "string" ? state.lastStatus : "idle";
}
function decorateStatusWithFailures(status, consecutiveErrors) {
	const failures = consecutiveErrors ?? 0;
	if (status !== "error" || failures <= 1) return status;
	return failures > 99 ? `${status} (99+x)` : `${status} (${failures}x)`;
}
function formatCronStatusForDisplay(job) {
	const state = job.state ?? {};
	const status = computeStatus(job);
	const streamDisabled = job.enabled && job.schedule?.kind === "stream" && state.streamStatus === "disabled";
	const undelivered = status === "ok" && state.lastDeliveryStatus === "not-delivered";
	const suppressed = undelivered && !streamDisabled && state.deliverySuppressionReason !== void 0;
	const color = status === "error" ? theme.error : status === "running" || undelivered && !suppressed ? theme.warn : status === "ok" ? theme.success : theme.muted;
	let label = decorateStatusWithFailures(status, state.consecutiveErrors);
	if (streamDisabled && status !== "running") label = "disabled";
	else if (status === "disabled" && state.autoDisabled) label = state.autoDisabled.reason === "schedule-errors" ? "disabled (schedule)" : `disabled (${state.autoDisabled.consecutiveErrors}x)`;
	else if (undelivered) label = suppressed ? "ok (suppressed)" : "ok (not delivered)";
	return {
		label,
		color
	};
}
function handleCronCliError(err) {
	if (err instanceof ExitError) throw err;
	rethrowExpectedCliError(err);
	const missingJob = readCronJobNotFoundError(err);
	const diagnostic = err instanceof CronCliError ? err.originalError ?? err : err;
	const matches = err instanceof CronCliError ? err.matches : void 0;
	if (isJsonOutputModeActive(process.argv)) {
		if (!missingJob && !(err instanceof CronCliError) && !(err instanceof GatewayClientRequestError)) throw err;
		const message = missingJob ? formatCronLookupMiss(missingJob.jobId) : formatCliOperatorError(diagnostic);
		throw new ExpectedCliError({
			message,
			humanOutput: danger(message),
			machineOutput: message,
			matches
		});
	}
	const message = missingJob ? formatCronLookupMiss(missingJob.jobId) : formatErrorMessage(diagnostic);
	defaultRuntime.error(danger(matches ? `${message}\n${formatCronJobMatches(matches)}` : message));
	exitCliAfterOutput(defaultRuntime, 1);
}
function createCronAmbiguousNameError(jobs) {
	return new CronCliError("Multiple automations match this name. Retry this command with a matching job ID instead of the name.", { matches: jobs.map((job) => ({
		id: job.id,
		name: job.name,
		schedule: job.schedule.kind === "on-exit" || job.schedule.kind === "stream" ? job.schedule.kind : formatSchedule(job.schedule, job.trigger !== void 0),
		enabled: job.enabled,
		status: computeStatus(job)
	})) });
}
function formatCronJobMatches(matches) {
	return ["Matching automations:", ...matches.map((match) => `  ${sanitizeTerminalText(match.id)}  ${sanitizeTerminalText(match.name)}\n    ${sanitizeTerminalText(match.schedule)}; enabled: ${match.enabled ? "yes" : "no"}; status: ${sanitizeTerminalText(match.status)}`)].join("\n");
}
const formatCronLookupMiss = (jobId) => formatLookupMiss({
	noun: "Automation",
	value: sanitizeTerminalText(jobId),
	listCommand: "openclaw cron list",
	valueLabel: "automation id"
});
function requireCronJobId(id, accepted = "Pass it positionally.") {
	const jobId = normalizeOptionalString(id);
	if (!jobId) throw new CronCliError(`Missing job id. ${accepted}`);
	return jobId;
}
async function warnIfCronSchedulerDisabled(opts) {
	try {
		const res = await callGatewayFromCli("cron.status", opts, {});
		if (res?.enabled !== false) return;
		const store = typeof res?.sqlitePath === "string" ? res.sqlitePath : typeof res?.storePath === "string" ? res.storePath : "";
		defaultRuntime.error([
			"warning: the automations scheduler is disabled in the Gateway; jobs are saved but will not run automatically.",
			"To enable automatic runs, set `cron.enabled: true` (or remove `cron.enabled: false`), remove `OPENCLAW_SKIP_CRON=1` from the Gateway's launch environment, and restart the Gateway.",
			store ? `store: ${store}` : ""
		].filter(Boolean).join("\n"));
	} catch {}
}
function parsePositiveCronDurationMs(input) {
	try {
		const result = parseDurationMs(input);
		return result > 0 && result <= 864e13 ? result : null;
	} catch {
		return null;
	}
}
function parseCronStaggerMs(params) {
	if (params.useExact) return 0;
	if (!params.staggerRaw) return;
	const parsed = parsePositiveCronDurationMs(params.staggerRaw);
	if (!parsed) throw new CronCliError("Invalid --stagger; use e.g. 30s, 1m, 5m");
	return parsed;
}
function parseCronStringList(input) {
	if (input === void 0) return;
	return (Array.isArray(input) ? input.map((value) => String(value)).join(" ") : typeof input === "string" ? input : "").split(/[,\s]+/u).map((entry) => normalizeOptionalString(entry)).filter((entry) => Boolean(entry));
}
/**
* Parse a one-shot `--at` value into an ISO string (UTC).
*
* When `tz` is provided and the input is an offset-less datetime
* (e.g. `2026-03-23T23:00:00`), the datetime is interpreted in
* that IANA timezone instead of UTC.
*/
function parseAt(input, tz) {
	const raw = input.trim();
	if (!raw) return null;
	if (tz && isOffsetlessIsoDateTime(raw)) return parseOffsetlessIsoDateTimeInTimeZone(raw, tz);
	const absolute = parseAbsoluteTimeMs(raw);
	if (absolute !== null) return timestampMsToIsoString(absolute) ?? null;
	const dur = parsePositiveCronDurationMs(raw.startsWith("+") ? raw.slice(1) : raw);
	if (dur !== null) {
		const expiresAt = resolveExpiresAtMsFromDurationMs(dur);
		return timestampMsToIsoString(expiresAt) ?? null;
	}
	return null;
}
const CRON_ID_PAD = 36;
const CRON_DECLARATION_PAD = 24;
const CRON_NAME_PAD = 24;
const CRON_SCHEDULE_PAD = 32;
const CRON_NEXT_PAD = 10;
const CRON_LAST_PAD = 10;
const CRON_STATUS_PAD = 19;
const CRON_TARGET_PAD = 9;
const CRON_DELIVERY_PAD = 64;
const CRON_AGENT_PAD = 10;
const CRON_OWNER_PAD = 24;
const CRON_MODEL_PAD = 20;
const TRUNCATED_SUFFIX = "...";
const stringifyCell = (value, fallback = "-") => {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return fallback;
};
const formatCell = (value, width) => {
	const text = sanitizeTerminalText(stringifyCell(value));
	const truncated = visibleWidth(text) <= width ? text : width <= 3 ? truncateToVisibleWidth(text, width) : `${truncateToVisibleWidth(text, width - 3)}${TRUNCATED_SUFFIX}`;
	const remaining = width - visibleWidth(truncated);
	return remaining > 0 ? `${truncated}${" ".repeat(remaining)}` : truncated;
};
const formatIsoMinute = (iso) => {
	const isoStr = timestampMsToIsoString(parseAbsoluteTimeMs(iso));
	return isoStr ? `${isoStr.slice(0, -8).replace("T", " ")}Z` : "-";
};
const formatSpan = (ms) => ms < 6e4 ? "<1m" : formatDurationHuman(ms);
const formatRelative = (ms, nowMs) => {
	if (!ms) return "-";
	const delta = ms - nowMs;
	const label = formatSpan(Math.abs(delta));
	return delta >= 0 ? `in ${label}` : `${label} ago`;
};
const formatSchedule = (schedule, hasTrigger = false) => {
	const suffix = hasTrigger ? "+trigger" : "";
	if (schedule?.kind === "at") return `at ${formatIsoMinute(schedule.at)}${suffix}`;
	if (schedule?.kind === "every") return `every ${formatExactDuration(schedule.everyMs)}${suffix}`;
	if (schedule?.kind === "on-exit") {
		const cwd = schedule.cwd ? ` @ ${schedule.cwd}` : "";
		return `on-exit ${schedule.command}${cwd}`;
	}
	if (schedule?.kind === "stream") {
		const cwd = schedule.cwd ? ` @ ${schedule.cwd}` : "";
		return `stream ${schedule.command.join(" ")}${cwd}${suffix}`;
	}
	if (schedule?.kind !== "cron") return "-";
	const base = schedule.tz ? `cron ${schedule.expr} @ ${schedule.tz}${suffix}` : `cron ${schedule.expr}${suffix}`;
	const staggerMs = resolveCronStaggerMs(schedule);
	if (staggerMs <= 0) return `${base} (exact)`;
	return `${base} (stagger ${formatExactDuration(staggerMs)})`;
};
function coerceCronDeliveryPreviews(value) {
	const previews = value && typeof value === "object" ? value.deliveryPreviews : void 0;
	if (!previews || typeof previews !== "object") return /* @__PURE__ */ new Map();
	return new Map(Object.entries(previews).flatMap(([jobId, preview]) => {
		if (!preview || typeof preview !== "object") return [];
		const record = preview;
		if (typeof record.label !== "string" || typeof record.detail !== "string") return [];
		return [[jobId, {
			label: record.label,
			detail: record.detail
		}]];
	}));
}
function printCronList(jobs, runtime = defaultRuntime, opts) {
	if (jobs.length === 0) {
		runtime.log("No automations.");
		return;
	}
	const rich = isRich();
	const header = [
		formatCell("ID", CRON_ID_PAD),
		formatCell("Declaration", CRON_DECLARATION_PAD),
		formatCell("Name", CRON_NAME_PAD),
		formatCell("Schedule", CRON_SCHEDULE_PAD),
		formatCell("Next", CRON_NEXT_PAD),
		formatCell("Last", CRON_LAST_PAD),
		formatCell("Status", CRON_STATUS_PAD),
		formatCell("Target", CRON_TARGET_PAD),
		formatCell("Delivery", CRON_DELIVERY_PAD),
		formatCell("Agent ID", CRON_AGENT_PAD),
		formatCell("Owner", CRON_OWNER_PAD),
		formatCell("Model", CRON_MODEL_PAD)
	].join(" ");
	const lines = [rich ? theme.heading(header) : header];
	const now = Date.now();
	for (const job of jobs) {
		const state = job.state ?? {};
		const idLabel = formatCell(job.id, CRON_ID_PAD);
		const declarationLabel = formatCell(job.declarationKey, CRON_DECLARATION_PAD);
		const nameLabel = formatCell(job.displayName ?? job.name, CRON_NAME_PAD);
		const scheduleLabel = formatCell(formatSchedule(job.schedule, job.trigger !== void 0), CRON_SCHEDULE_PAD);
		const nextLabel = formatCell(job.enabled ? formatRelative(state.nextRunAtMs, now) : "-", CRON_NEXT_PAD);
		const lastLabel = formatCell(formatRelative(state.lastRunAtMs, now), CRON_LAST_PAD);
		const status = formatCronStatusForDisplay(job);
		const statusLabel = formatCell(status.label, CRON_STATUS_PAD);
		const targetLabel = formatCell(job.sessionTarget, CRON_TARGET_PAD);
		const deliveryPreview = opts?.deliveryPreviews?.get(job.id);
		const deliveryText = deliveryPreview ? `${deliveryPreview.label} (${deliveryPreview.detail})` : "-";
		const deliveryLabel = formatCell(deliveryText, CRON_DELIVERY_PAD);
		const agentId = job.effectiveAgentId ?? job.agentId;
		const agentLabel = formatCell(agentId ?? "unresolved", CRON_AGENT_PAD);
		const ownerLabel = formatCell(job.owner?.sessionKey ?? job.owner?.agentId, CRON_OWNER_PAD);
		const modelLabel = formatCell(job.payload?.kind === "agentTurn" ? job.payload.model : void 0, CRON_MODEL_PAD);
		const coloredTarget = job.sessionTarget === "main" ? colorize(rich, theme.accent, targetLabel) : colorize(rich, theme.accentBright, targetLabel);
		const coloredAgent = agentId ? colorize(rich, theme.info, agentLabel) : colorize(rich, theme.muted, agentLabel);
		const line = [
			colorize(rich, theme.accent, idLabel),
			colorize(rich, theme.muted, declarationLabel),
			colorize(rich, theme.info, nameLabel),
			colorize(rich, theme.info, scheduleLabel),
			colorize(rich, theme.muted, nextLabel),
			colorize(rich, theme.muted, lastLabel),
			colorize(rich, status.color, statusLabel),
			coloredTarget,
			deliveryPreview ? colorize(rich, theme.info, deliveryLabel) : colorize(rich, theme.muted, deliveryLabel),
			coloredAgent,
			colorize(rich, job.owner ? theme.info : theme.muted, ownerLabel),
			job.payload?.kind === "agentTurn" && job.payload.model ? colorize(rich, theme.info, modelLabel) : colorize(rich, theme.muted, modelLabel)
		].join(" ");
		lines.push(line.trimEnd());
	}
	runtime.log(lines.join("\n"));
}
function printCronShow(job, runtime = defaultRuntime, opts) {
	const preview = opts?.deliveryPreview ?? {
		label: "-",
		detail: "unavailable"
	};
	const showValue = (value) => sanitizeTerminalText(stringifyCell(value));
	runtime.log(`id: ${showValue(job.id)}`);
	runtime.log(`declaration: ${showValue(job.declarationKey)}`);
	runtime.log(`name: ${showValue(job.name)}`);
	runtime.log(`display name: ${showValue(job.displayName)}`);
	runtime.log(`owner agent: ${showValue(job.owner?.agentId)}`);
	runtime.log(`owner session: ${showValue(job.owner?.sessionKey)}`);
	runtime.log(`enabled: ${job.enabled ? "yes" : "no"}`);
	runtime.log(`schedule: ${showValue(formatSchedule(job.schedule, job.trigger !== void 0))}`);
	if (job.schedule?.kind === "stream") {
		runtime.log(`stream status: ${showValue(job.state.streamStatus)}`);
		runtime.log(`stream error: ${showValue(job.state.streamError)}`);
	}
	runtime.log(`trigger: ${job.trigger ? `once=${job.trigger.once === true ? "yes" : "no"}; evals=${job.state.triggerEvalCount ?? 0}; last eval=${formatRelative(job.state.lastTriggerEvalAtMs, Date.now())}; last fire=${formatRelative(job.state.lastTriggerFireAtMs, Date.now())}` : "-"}`);
	runtime.log(`session: ${showValue(job.sessionTarget)}`);
	runtime.log(`agent: ${showValue(job.agentId)}`);
	runtime.log(`model: ${showValue(job.payload.kind === "agentTurn" ? job.payload.model : void 0)}`);
	runtime.log(`delivery: ${showValue(preview.label)} (${showValue(preview.detail)})`);
	runtime.log(`next: ${formatRelative(job.state.nextRunAtMs, Date.now())}`);
	runtime.log(`last: ${formatRelative(job.state.lastRunAtMs, Date.now())}`);
	runtime.log(`status: ${showValue(formatCronStatusForDisplay(job).label)}`);
	runtime.log(`last error: ${showValue(job.state.lastError)}`);
	runtime.log(`last delivery: ${showValue(job.state.lastDeliveryStatus)}`);
	runtime.log(`last delivery suppression: ${showValue(job.state.deliverySuppressionReason)}`);
	runtime.log(`last delivery error: ${showValue(job.state.lastDeliveryError)}`);
	runtime.log(`diagnostic: ${showValue(job.state.lastDiagnosticSummary)}`);
}
//#endregion
//#region src/cli/cron-cli/list-jobs.ts
const CRON_LIST_PAGE_SIZE = 200;
const CRON_LIST_MAX_PAGES = 50;
const CRON_LIST_MAX_SNAPSHOT_RESTARTS = 3;
/** Recognize the explicit protocol-v4 capability boundary, not transport failures. */
function isUnknownCronGetMethodError(error) {
	return error instanceof Error && error.name === "GatewayClientRequestError" && error.gatewayCode === "INVALID_REQUEST" && error.message.includes("unknown method: cron.get");
}
/** Read every bounded Gateway page from one complete cron inventory revision. */
async function listCronJobsFromGateway(opts, filters, options = {}) {
	let allowLegacyUnversionedPagination = options.allowLegacyUnversionedPagination === true;
	for (let restart = 0; restart <= CRON_LIST_MAX_SNAPSHOT_RESTARTS; restart += 1) {
		let offset = 0;
		let snapshotRevision;
		let total;
		let pageMetadataMode;
		let firstPage;
		let snapshotChanged = false;
		const jobs = [];
		const deliveryPreviews = {};
		for (let pageNumber = 0; pageNumber < CRON_LIST_MAX_PAGES; pageNumber += 1) {
			const page = await callGatewayFromCli("cron.list", opts, {
				...filters,
				limit: CRON_LIST_PAGE_SIZE,
				offset
			});
			const hasCanonicalMetadata = page !== null && typeof page === "object" && (page.snapshotRevision !== void 0 || page.total !== void 0 || page.offset !== void 0 || page.limit !== void 0);
			if (!page || typeof page !== "object" || !Array.isArray(page.jobs) || page.jobs.length > CRON_LIST_PAGE_SIZE || page.snapshotRevision !== void 0 && (typeof page.snapshotRevision !== "string" || page.snapshotRevision.length === 0) || page.total !== void 0 && (typeof page.total !== "number" || !Number.isSafeInteger(page.total) || page.total < 0) || page.offset !== void 0 && (typeof page.offset !== "number" || !Number.isSafeInteger(page.offset) || page.offset < 0) || page.limit !== void 0 && (typeof page.limit !== "number" || !Number.isSafeInteger(page.limit) || page.limit < 1 || page.limit > CRON_LIST_PAGE_SIZE || page.jobs.length > page.limit) || page.hasMore !== void 0 && typeof page.hasMore !== "boolean" || hasCanonicalMetadata && (page.snapshotRevision === void 0 || page.total === void 0 || page.offset === void 0 || page.limit === void 0 || page.hasMore === void 0 || page.nextOffset === void 0)) throw new Error("cron.list returned an invalid inventory page");
			const currentMetadataMode = hasCanonicalMetadata ? "canonical" : "legacy";
			if (pageMetadataMode !== void 0 && pageMetadataMode !== currentMetadataMode) {
				snapshotChanged = true;
				break;
			}
			if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) {
				snapshotChanged = true;
				break;
			}
			if (page.offset !== void 0 && page.offset !== offset) throw new Error("cron.list returned an invalid inventory page");
			if (!hasCanonicalMetadata && !allowLegacyUnversionedPagination) {
				const probeJob = page.jobs[0];
				if (probeJob && (typeof probeJob.id !== "string" || probeJob.id.length === 0)) throw new Error("cron.list returned an invalid inventory page");
				const probeJobId = probeJob?.id ?? randomUUID();
				try {
					await callGatewayFromCli("cron.get", opts, { id: probeJobId });
				} catch (error) {
					if (isUnknownCronGetMethodError(error)) allowLegacyUnversionedPagination = true;
					else if (!isMissingCronGetError(error, probeJobId)) throw error;
				}
				if (!allowLegacyUnversionedPagination) throw new Error("cron.list returned an invalid inventory page");
			}
			pageMetadataMode ??= currentMetadataMode;
			firstPage ??= page;
			snapshotRevision ??= page.snapshotRevision;
			total ??= page.total;
			jobs.push(...page.jobs);
			if (page.deliveryPreviews) Object.assign(deliveryPreviews, page.deliveryPreviews);
			if (!page.hasMore) {
				if (total !== void 0 && jobs.length !== total || page.nextOffset !== void 0 && page.nextOffset !== null) throw new Error("cron.list returned an inconsistent terminal inventory page");
				return {
					...firstPage,
					jobs,
					...Object.keys(deliveryPreviews).length > 0 ? { deliveryPreviews } : {},
					...total !== void 0 ? { total } : {},
					...snapshotRevision !== void 0 ? { snapshotRevision } : {},
					...firstPage.offset !== void 0 ? { offset: firstPage.offset } : {},
					...firstPage.limit !== void 0 ? { limit: firstPage.limit } : {},
					...firstPage.hasMore !== void 0 ? {
						hasMore: false,
						nextOffset: null
					} : {}
				};
			}
			if (typeof page.nextOffset !== "number" || !Number.isSafeInteger(page.nextOffset) || page.nextOffset <= offset || total !== void 0 && page.nextOffset !== offset + page.jobs.length) throw new Error("cron.list pagination did not advance while looking up automation");
			offset = page.nextOffset;
		}
		if (!snapshotChanged) throw new Error("cron.list pagination exceeded maximum pages while looking up automation");
		if (restart === CRON_LIST_MAX_SNAPSHOT_RESTARTS) throw new Error("cron.list inventory changed repeatedly while reading automations");
	}
	throw new Error("cron.list inventory changed repeatedly while reading automations");
}
function isMissingCronGetError(error, id) {
	return isUnknownCronGetMethodError(error) || error instanceof Error && error.name === "GatewayClientRequestError" && error.gatewayCode === "INVALID_REQUEST" && (error.message.includes(`automation not found: ${id}`) || error.message.includes(`cron job not found: ${id}`));
}
/** Resolve stable IDs before exact names without trusting page order. */
async function findCronJobByIdOrName(opts, idOrName, options = {}) {
	let allowLegacyUnversionedPagination = false;
	try {
		const directJob = await callGatewayFromCli("cron.get", opts, { id: idOrName });
		if (directJob?.id === idOrName) {
			if (!options.includeDeliveryPreview) return { job: directJob };
			return {
				job: directJob,
				deliveryPreview: (await listCronJobsFromGateway(opts, {
					includeDisabled: true,
					query: idOrName
				})).deliveryPreviews?.[directJob.id]
			};
		}
	} catch (error) {
		if (!isMissingCronGetError(error, idOrName)) throw error;
		allowLegacyUnversionedPagination = isUnknownCronGetMethodError(error);
	}
	const inventory = await listCronJobsFromGateway(opts, { includeDisabled: true }, { allowLegacyUnversionedPagination });
	const needle = normalizeLowercaseStringOrEmpty(idOrName);
	let job = inventory.jobs.find((candidate) => normalizeLowercaseStringOrEmpty(candidate.id) === needle);
	if (!job) {
		const matches = inventory.jobs.filter((candidate) => normalizeLowercaseStringOrEmpty(candidate.name) === needle);
		if (matches.length > 1) throw createCronAmbiguousNameError(matches);
		job = matches[0];
	}
	return {
		job,
		deliveryPreview: job ? inventory.deliveryPreviews?.[job.id] : void 0
	};
}
//#endregion
export { CronCliError as C, warnIfCronSchedulerDisabled as S, parsePositiveCronDurationMs as _, enrichCronJsonWithStatus as a, printCronShow as b, handleCronCliError as c, parseCronCommandEnv as d, parseCronIntegerOption as f, parseCronStringList as g, parseCronStreamCommandArgv as h, coerceCronDeliveryPreviews as i, parseAt as l, parseCronStaggerMs as m, isUnknownCronGetMethodError as n, formatCronLookupMiss as o, parseCronNoOutputTimeoutOption as p, listCronJobsFromGateway as r, getCronChannelOptions as s, findCronJobByIdOrName as t, parseCronCommandArgv as u, printCronJson as v, requireCronJobId as x, printCronList as y };
