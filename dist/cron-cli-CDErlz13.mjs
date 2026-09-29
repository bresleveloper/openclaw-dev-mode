import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs, P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { F as isCronMachineOutput, N as CRON_GATEWAY_OPTION_NAMES, P as createCronOutputCommand } from "./argv-IYTsfFsq.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-maXyqxro.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as isErrno } from "./errno-CkbDOfLk.mjs";
import { p as sanitizeAgentId } from "./session-key-CBvmC8zz.mjs";
import { Xt as resolveCronCompletionStatus } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as THINKING_LEVELS_HELP } from "./thinking.shared-BKzBCWpI.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DXO3PHhc.mjs";
import { t as parseTimeoutMs } from "./parse-timeout-G1LpD3Dj.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-BqkZLKq3.mjs";
import { t as CRON_JOB_SCRATCH_MAX_BYTES } from "./scratch-contract-B-Laspel.mjs";
import { i as isSystemMonitorDeclaration } from "./system-owned-declaration-CIFRO5mv.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { C as CronCliError, S as warnIfCronSchedulerDisabled, _ as parsePositiveCronDurationMs, a as enrichCronJsonWithStatus, b as printCronShow, c as handleCronCliError, d as parseCronCommandEnv, f as parseCronIntegerOption, g as parseCronStringList, h as parseCronStreamCommandArgv, i as coerceCronDeliveryPreviews, l as parseAt, m as parseCronStaggerMs, n as isUnknownCronGetMethodError, o as formatCronLookupMiss, p as parseCronNoOutputTimeoutOption, r as listCronJobsFromGateway, s as getCronChannelOptions, t as findCronJobByIdOrName, u as parseCronCommandArgv, v as printCronJson, x as requireCronJobId, y as printCronList } from "./list-jobs-DVm3xLFY.mjs";
import { n as setCommandJsonMode } from "./json-mode-BYKm3vNF.mjs";
import { createReadStream } from "node:fs";
import { Option } from "commander";
//#region src/cli/cron-cli/register.cron-options.ts
function registerCronMutationOptions(command, mode) {
	const create = mode === "add";
	return command.option("--name <name>", "Job name").option("--display-name <name>", "Human-readable job label").option("--description <text>", "Job description").option("--delete-after-run", "Delete one-shot after successful completion (confirmed/no delivery, intentional silence, or best effort); failed/unknown required delivery retains it disabled", false).option("--keep-after-run", "Keep one-shot job after it succeeds", false).option("--agent <id>", "Agent id for this job").option("--session <target>", "Session target (main|isolated|current|session:<id>)").option("--session-key <key>", "Session key for job routing").option("--wake <mode>", "Wake mode (now|next-heartbeat)", create ? "now" : void 0).option("--at <when>", "One-shot time (ISO, offset-less uses --tz) or duration like 20m").option("--every <duration>", "Interval duration (e.g. 10m, 1h)").option("--pacing-min <duration>", "Minimum delay for a dynamic next check").option("--pacing-max <duration>", "Maximum delay for a dynamic next check").option("--cron <expr>", "Cron expression (5-field or 6-field with seconds)").option("--on-exit <shell>", "Fire once when the watched command exits").option("--on-exit-cwd <path>", "Working directory for the --on-exit watched command").option("--stream-command <json>", "Stream source argv as a JSON array of strings").option("--stream-cwd <path>", "Working directory for the stream source").option("--stream-mode <mode>", "Stream line selection mode (line|match)").option("--stream-match <regex>", "Regex source required for stream match mode").option("--stream-batch-ms <n>", "Quiet-window batch delay in milliseconds").option("--stream-max-batch-bytes <n>", "Maximum UTF-8 bytes per stream batch").option("--tz <iana>", "Timezone for cron expressions (IANA; cron default: Gateway host local timezone)", create ? "" : void 0).option("--stagger <duration>", "Cron stagger window (e.g. 30s, 5m)").option("--exact", "Disable cron staggering (set stagger to 0)", create ? false : void 0).option("--trigger-script <path|->", "Condition script file, or - for stdin").option("--trigger-once", "Disable after the first successful triggered run", false).option("--system-event <text>", "System event payload (main session)").option("--message <text>", "Agent message payload").option("--script <file|->", "Headless script payload file, or - for stdin").option("--script-timeout-seconds <n>", "Script wall-clock timeout seconds").option("--script-tool-budget <n>", "Maximum script tool calls").option("--command <shell>", "Command payload run as sh -lc <shell> on the Gateway").option("--command-argv <json>", "Command payload argv as JSON array of strings").option("--command-cwd <path>", "Working directory for command payloads").option("--command-env <KEY=VALUE>", "Environment override for command payloads (repeatable)", (value, previous) => [...previous ?? [], value]).option("--command-input <text>", "stdin for command payloads").option("--thinking <level>", `Thinking level for agent jobs (${THINKING_LEVELS_HELP})`).option("--model <model>", "Model override for agent jobs (provider/model or alias)").option("--fallbacks <list>", "Fallback model list for agent jobs").option("--timeout-seconds <n>", "Timeout seconds for agent or command jobs (non-negative integer; 0 disables scheduler timeout)").option("--no-output-timeout-seconds <n>", "No-output timeout seconds for command jobs").option("--output-max-bytes <n>", "Maximum captured stdout/stderr bytes for command jobs").option("--light-context", "Use lightweight bootstrap context for agent jobs", create ? false : void 0).option("--tools <list>", "Tool allow-list (e.g. exec,read or exec read; \"\" disables all tools)").option("--announce", "Fallback-deliver final text to a chat", create ? false : void 0).option("--deliver", "Deprecated (use --announce). Fallback-delivers final text to a chat.").option("--no-deliver", "Disable runner fallback delivery").option("--webhook <url>", "POST the finished payload to a webhook URL").option("--channel <channel>", `Delivery channel (${getCronChannelOptions()})`, create ? "last" : void 0).option("--to <dest>", "Delivery destination (E.164, Telegram chatId, or Discord channel/user)").option("--thread-id <id>", "Telegram forum topic thread id").option("--account <id>", "Channel account id for delivery (multi-account setups)").option("--best-effort-deliver", create ? "Do not fail the job if delivery fails" : "Do not fail job if delivery fails (also implies --announce when used alone)", create ? false : void 0);
}
//#endregion
//#region src/cli/cron-cli/schedule-options.ts
/** A single normalized creation selector resolves or throws during validation. */
function resolveCronCreateSchedule(options) {
	const normalized = normalizeScheduleOptions(options);
	if (normalized.onExitCwd && !normalized.onExitCommand) throw new CronCliError("--on-exit-cwd requires --on-exit.");
	if (countChosenSchedules(normalized) !== 1) throw new CronCliError("Choose exactly one schedule: --at, --every, --cron, --on-exit, or --stream-command");
	return expectDefined(resolveDirectSchedule(normalized), "created cron schedule");
}
/** Resolve cron creation schedule from either a positional shorthand or explicit flags. */
function resolveCronCreateScheduleFromArgs(options) {
	const positionalSchedule = normalizeOptionalString(options.positionalSchedule);
	if (!positionalSchedule) return resolveCronCreateSchedule(options);
	if (countChosenSchedules(normalizeScheduleOptions(options)) > 0) throw new CronCliError("Choose a positional schedule or one of --at, --every, --cron, --on-exit, or --stream-command.");
	const every = parseEverySchedule(positionalSchedule);
	return resolveCronCreateSchedule({
		...options,
		at: every ? void 0 : looksLikeCronExpression(positionalSchedule) ? void 0 : positionalSchedule,
		cron: looksLikeCronExpression(positionalSchedule) ? positionalSchedule : void 0,
		every
	});
}
/** Resolve a cron edit request, allowing at most one direct schedule replacement. */
function resolveCronEditScheduleRequest(options) {
	const normalized = normalizeScheduleOptions(options);
	const chosen = countChosenSchedules(normalized);
	if (hasStreamSchedulePatch(normalized) && !normalized.streamCommand) {
		if (normalized.tz !== void 0 || normalized.requestedStaggerMs !== void 0) throw new CronCliError("--tz/--stagger/--exact are not valid with stream schedule edits");
		if (chosen > 0) throw new CronCliError("Choose at most one schedule change");
		return {
			kind: "patch-existing-stream",
			cwd: normalized.streamCwdSupplied ? normalized.streamCwd ?? null : void 0,
			mode: normalized.streamModeSupplied ? normalized.streamMode : void 0,
			match: normalized.streamMatchSupplied ? normalized.streamMatch ?? null : void 0,
			batchMs: normalized.streamBatchMs,
			maxBatchBytes: normalized.streamMaxBatchBytes
		};
	}
	if (chosen > 1) throw new CronCliError("Choose at most one schedule change");
	const schedule = resolveDirectSchedule(normalized, { deferStreamMetadataValidation: true });
	if (schedule) return {
		kind: "direct",
		schedule
	};
	if (normalized.requestedStaggerMs !== void 0 || normalized.tz !== void 0) return {
		kind: "patch-existing-cron",
		tz: normalized.tz,
		staggerMs: normalized.requestedStaggerMs
	};
	return { kind: "none" };
}
/** Apply stream metadata edits without requiring callers to restate the source argv. */
function applyExistingStreamSchedulePatch(existingSchedule, request) {
	if (existingSchedule.kind !== "stream") throw new CronCliError("Current job is not a stream schedule; use --stream-command to convert first");
	const mode = request.mode ?? existingSchedule.mode ?? "line";
	const requestedMatch = request.match === void 0 ? existingSchedule.match : request.match ?? void 0;
	if (mode === "match" && !requestedMatch) throw new CronCliError("--stream-match is required when --stream-mode=match");
	if (mode === "line" && request.match) throw new CronCliError("--stream-match requires --stream-mode=match");
	return {
		...existingSchedule,
		cwd: request.cwd === void 0 ? existingSchedule.cwd : request.cwd ?? void 0,
		mode,
		match: mode === "match" ? requestedMatch : void 0,
		batchMs: request.batchMs ?? existingSchedule.batchMs,
		maxBatchBytes: request.maxBatchBytes ?? existingSchedule.maxBatchBytes
	};
}
/** Validate a newly-created stream schedule after edit metadata has been merged. */
function validateStreamScheduleMetadata(schedule) {
	const mode = schedule.mode ?? "line";
	if (mode === "match" && !schedule.match) throw new CronCliError("--stream-match is required when --stream-mode=match");
	if (mode === "line" && schedule.match) throw new CronCliError("--stream-match requires --stream-mode=match");
}
/** Apply `--tz`, `--stagger`, or `--exact` metadata changes to an existing cron schedule. */
function applyExistingCronSchedulePatch(existingSchedule, request) {
	if (existingSchedule.kind !== "cron") throw new CronCliError("Current job is not a cron schedule; use --cron to convert first");
	return {
		kind: "cron",
		expr: existingSchedule.expr,
		tz: request.tz ?? existingSchedule.tz,
		staggerMs: request.staggerMs !== void 0 ? request.staggerMs : existingSchedule.staggerMs
	};
}
function normalizeScheduleOptions(options) {
	for (const value of [
		options.at,
		options.every,
		options.cron,
		options.onExit
	]) if (typeof value === "string" && !value.trim()) throw new CronCliError("Schedule values must not be blank");
	const staggerRaw = normalizeOptionalString(options.stagger) ?? "";
	const useExact = Boolean(options.exact);
	if (staggerRaw && useExact) throw new CronCliError("Choose either --stagger or --exact, not both");
	const streamModeSupplied = options.streamMode !== void 0;
	const suppliedStreamMode = normalizeOptionalString(options.streamMode);
	if (streamModeSupplied && !suppliedStreamMode) throw new CronCliError("--stream-mode must be line or match");
	const streamModeRaw = suppliedStreamMode ?? "line";
	if (streamModeRaw !== "line" && streamModeRaw !== "match") throw new CronCliError("--stream-mode must be line or match");
	const parsePositiveInteger = (value, flag) => {
		if (value === void 0) return;
		if (typeof value !== "string" && typeof value !== "number") throw new CronCliError(`${flag} must be a positive integer`);
		const text = String(value).trim();
		if (!/^\d+$/u.test(text)) throw new CronCliError(`${flag} must be a positive integer`);
		const parsed = Number(text);
		if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new CronCliError(`${flag} must be a positive integer`);
		return parsed;
	};
	return {
		at: normalizeOptionalString(options.at) ?? "",
		every: normalizeOptionalString(options.every) ?? "",
		cronExpr: normalizeOptionalString(options.cron) ?? "",
		onExitCommand: normalizeOptionalString(options.onExit) ?? "",
		onExitCwd: normalizeOptionalString(options.onExitCwd),
		streamCommand: parseCronStreamCommandArgv(options.streamCommand),
		streamCwd: normalizeOptionalString(options.streamCwd),
		streamCwdSupplied: options.streamCwd !== void 0,
		streamMode: streamModeRaw,
		streamModeSupplied,
		streamMatch: normalizeOptionalString(options.streamMatch),
		streamMatchSupplied: options.streamMatch !== void 0,
		streamBatchMs: parsePositiveInteger(options.streamBatchMs, "--stream-batch-ms"),
		streamMaxBatchBytes: parsePositiveInteger(options.streamMaxBatchBytes, "--stream-max-batch-bytes"),
		tz: normalizeOptionalString(options.tz),
		requestedStaggerMs: parseCronStaggerMs({
			staggerRaw,
			useExact
		})
	};
}
function hasStreamSchedulePatch(options) {
	return options.streamCwdSupplied || options.streamModeSupplied || options.streamMatchSupplied || options.streamBatchMs !== void 0 || options.streamMaxBatchBytes !== void 0;
}
function countChosenSchedules(options) {
	return [
		Boolean(options.at),
		Boolean(options.every),
		Boolean(options.cronExpr),
		Boolean(options.onExitCommand),
		Boolean(options.streamCommand)
	].filter(Boolean).length;
}
function parseEverySchedule(value) {
	return /^every\s+(.+)$/iu.exec(value.trim())?.[1]?.trim() || void 0;
}
function looksLikeCronExpression(value) {
	const parts = value.trim().split(/\s+/u);
	return parts.length === 5 || parts.length === 6;
}
function resolveDirectSchedule(options, behavior = {}) {
	if (options.onExitCwd && !options.onExitCommand) throw new CronCliError("--on-exit-cwd requires --on-exit.");
	if (hasStreamSchedulePatch(options) && !options.streamCommand) throw new CronCliError("Stream options require --stream-command.");
	if (options.tz && options.every) throw new CronCliError("--tz is only valid with --cron or offset-less --at");
	if (options.requestedStaggerMs !== void 0 && (options.at || options.every)) throw new CronCliError("--stagger/--exact are only valid for cron schedules");
	if (options.at) {
		const atIso = parseAt(options.at, options.tz);
		if (!atIso) throw new CronCliError("Invalid --at. Use an ISO timestamp or a duration like 20m.");
		return {
			kind: "at",
			at: atIso
		};
	}
	if (options.every) {
		const everyMs = parsePositiveCronDurationMs(options.every);
		if (!everyMs) throw new CronCliError("Invalid --every. Use a duration like 10m, 1h, or 1d.");
		return {
			kind: "every",
			everyMs
		};
	}
	if (options.cronExpr) return {
		kind: "cron",
		expr: options.cronExpr,
		tz: options.tz,
		staggerMs: options.requestedStaggerMs
	};
	if (options.onExitCommand) {
		if (options.tz || options.requestedStaggerMs !== void 0) throw new CronCliError("--tz/--stagger/--exact are not valid with --on-exit");
		return {
			kind: "on-exit",
			command: options.onExitCommand,
			...options.onExitCwd ? { cwd: options.onExitCwd } : {}
		};
	}
	if (options.streamCommand) {
		if (options.tz || options.requestedStaggerMs !== void 0) throw new CronCliError("--tz/--stagger/--exact are not valid with --stream-command");
		const schedule = {
			kind: "stream",
			command: options.streamCommand,
			...options.streamCwd ? { cwd: options.streamCwd } : {},
			mode: options.streamMode,
			...options.streamMatch ? { match: options.streamMatch } : {},
			...options.streamBatchMs !== void 0 ? { batchMs: options.streamBatchMs } : {},
			...options.streamMaxBatchBytes !== void 0 ? { maxBatchBytes: options.streamMaxBatchBytes } : {}
		};
		if (!behavior.deferStreamMetadataValidation) validateStreamScheduleMetadata(schedule);
		return schedule;
	}
}
//#endregion
//#region src/cli/cron-cli/thread-id-shared.ts
function parseCronThreadIdOption(value) {
	if (typeof value !== "string") return;
	const raw = normalizeOptionalString(value);
	if (!raw || !/^\d+$/.test(raw)) throw new CronCliError("--thread-id must be a positive integer Telegram topic thread id");
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new CronCliError("--thread-id must be a safe positive integer Telegram topic thread id");
	return parsed;
}
function normalizeCronSessionTargetOption(value) {
	const raw = normalizeOptionalString(value);
	if (!raw) return;
	const lower = normalizeLowercaseStringOrEmpty(raw);
	if (lower === "main" || lower === "isolated" || lower === "current") return lower;
	if (lower.startsWith("session:")) {
		const id = normalizeOptionalString(raw.slice(8));
		return id ? `session:${id}` : void 0;
	}
}
//#endregion
//#region src/cli/cron-cli/trigger-options.ts
const MAX_CRON_TRIGGER_SCRIPT_BYTES = 65536;
async function readCronInput(source, stdin, options) {
	const stream = source === "-" ? stdin ?? process.stdin : createReadStream(source);
	try {
		return await readByteStreamWithLimit(stream, options);
	} catch (error) {
		if (error instanceof Error && isErrno(error) && typeof error.errno === "number" && typeof error.syscall === "string") throw new CronCliError(error);
		throw error;
	}
}
async function readScriptStream(source, stdin, label) {
	return (await readCronInput(source, stdin, {
		maxBytes: MAX_CRON_TRIGGER_SCRIPT_BYTES,
		onOverflow: () => new CronCliError(`${label} exceeds ${MAX_CRON_TRIGGER_SCRIPT_BYTES} bytes`)
	})).toString("utf8");
}
/** Reads a trigger script locally before sending the cron RPC. */
async function readCronTriggerScript(source, deps) {
	const script = (await readScriptStream(source, deps?.stdin, "Trigger script")).trim();
	if (!script) throw new CronCliError("Trigger script must not be empty");
	return script;
}
/** Reads a script payload locally before sending the cron RPC. */
async function readCronPayloadScript(source, deps) {
	const script = (await readScriptStream(source, deps?.stdin, "Script payload")).trim();
	if (!script) throw new CronCliError("Script payload must not be empty");
	return script;
}
/** Reads exact scratch content locally; empty content is a meaningful value. */
async function readCronScratchContent(source, deps) {
	return (await readCronInput(source, deps?.stdin, {
		maxBytes: CRON_JOB_SCRATCH_MAX_BYTES,
		onOverflow: () => new CronCliError(`Cron scratch exceeds ${CRON_JOB_SCRATCH_MAX_BYTES} bytes`)
	})).toString("utf8");
}
//#endregion
//#region src/cli/cron-cli/register.cron-add.ts
function registerCronStatusCommand(cron) {
	addGatewayClientOptions(createCronOutputCommand(cron, "status").description("Show automations scheduler status").action(async (opts) => {
		try {
			const res = await callGatewayFromCli("cron.status", opts, {});
			printCronJson(res);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronListCommand(cron) {
	addGatewayClientOptions(cron.command("list").description("List automations").option("--all", "Include disabled jobs", false).option("--agent <id>", "Filter by agent id").option("--json", "Output JSON", false).action(async (opts) => {
		try {
			const listParams = { includeDisabled: Boolean(opts.all) };
			const agentId = normalizeOptionalString(opts.agent);
			if (typeof opts.agent === "string" && !agentId) throw new CronCliError("--agent must not be blank");
			if (agentId) listParams.agentId = sanitizeAgentId(agentId);
			const res = await listCronJobsFromGateway(opts, listParams);
			if (opts.json) {
				printCronJson(enrichCronJsonWithStatus(res));
				return;
			}
			const jobs = res?.jobs ?? [];
			const deliveryPreviews = coerceCronDeliveryPreviews(res);
			printCronList(jobs, defaultRuntime, { deliveryPreviews });
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronAddCommand(cron) {
	addGatewayClientOptions(registerCronMutationOptions(createCronOutputCommand(cron, "add").description("Add an automation").argument("[scheduleOrName]", "Schedule string, or job name when using --at/--every/--cron").argument("[message]", "Agent message when using a positional schedule"), "add").option("--declaration-key <key>", "Idempotent declaration identity key").option("--disabled", "Create job disabled", false).action(async (nameArg, messageArg, opts, cmd) => {
		try {
			for (const [flag, cwd] of [
				["--command-cwd", opts.commandCwd],
				["--on-exit-cwd", opts.onExitCwd],
				["--stream-cwd", opts.streamCwd]
			]) if (typeof cwd === "string" && !normalizeOptionalString(cwd)) throw new CronCliError(`${flag} must not be blank`);
			const hasScheduleFlag = typeof opts.at === "string" || typeof opts.cron === "string" || typeof opts.every === "string" || typeof opts.onExit === "string" || typeof opts.streamCommand === "string";
			const positionalSchedule = hasScheduleFlag ? void 0 : nameArg;
			const schedule = resolveCronCreateScheduleFromArgs({
				...opts,
				positionalSchedule
			});
			const wakeMode = normalizeOptionalString(opts.wake) ?? "now";
			if (wakeMode !== "now" && wakeMode !== "next-heartbeat") throw new CronCliError("--wake must be now or next-heartbeat");
			const rawAgentId = normalizeOptionalString(opts.agent);
			const agentId = rawAgentId ? sanitizeAgentId(rawAgentId) : void 0;
			const hasAnnounce = Boolean(opts.announce) || opts.deliver === true;
			const hasNoDeliver = opts.deliver === false;
			const webhookUrl = typeof opts.webhook === "string" ? normalizeHttpWebhookUrl(opts.webhook) : null;
			if (typeof opts.webhook === "string" && !webhookUrl) throw new CronCliError("--webhook must be a valid http(s) URL");
			const hasWebhook = Boolean(webhookUrl);
			if ([
				hasAnnounce,
				hasNoDeliver,
				hasWebhook
			].filter(Boolean).length > 1) throw new CronCliError("Choose at most one of --announce, --no-deliver, or --webhook");
			const resolvedPayload = await (async () => {
				const systemEvent = normalizeOptionalString(opts.systemEvent) ?? "";
				const optionMessage = normalizeOptionalString(opts.message);
				const positionalMessage = normalizeOptionalString(messageArg);
				const commandShell = readNonBlankString(opts.command);
				const commandArgv = parseCronCommandArgv(opts.commandArgv);
				const scriptPath = readNonBlankString(opts.script);
				if (typeof opts.script === "string" && !scriptPath) throw new CronCliError("--script must not be blank");
				const toolsAllow = parseCronStringList(opts.tools);
				if (optionMessage && positionalMessage && optionMessage !== positionalMessage) throw new CronCliError("Pass the automation message either positionally or with --message, not both.");
				const message = optionMessage ?? positionalMessage ?? "";
				if (commandShell && commandArgv) throw new CronCliError("Pass command payload either with --command or --command-argv, not both.");
				if ([
					Boolean(systemEvent),
					Boolean(message),
					Boolean(commandShell) || Boolean(commandArgv),
					Boolean(scriptPath)
				].filter(Boolean).length !== 1) throw new CronCliError("Choose exactly one payload: --system-event, --message, --command, or --script");
				if (systemEvent) return {
					kind: "systemEvent",
					text: systemEvent,
					...toolsAllow ? { toolsAllow } : {}
				};
				if (scriptPath) {
					if (opts.timeoutSeconds !== void 0) throw new CronCliError("Use --script-timeout-seconds for script jobs, not --timeout-seconds.");
					return {
						kind: "script",
						timeoutSeconds: parseCronIntegerOption(opts.scriptTimeoutSeconds, "--script-timeout-seconds"),
						toolBudget: parseCronIntegerOption(opts.scriptToolBudget, "--script-tool-budget"),
						toolsAllow,
						script: await readCronPayloadScript(scriptPath)
					};
				}
				const timeoutSeconds = parseCronIntegerOption(opts.timeoutSeconds, "--timeout-seconds", "non-negative");
				if (commandShell || commandArgv) {
					const noOutputTimeoutSeconds = parseCronNoOutputTimeoutOption(opts);
					const outputMaxBytes = parseCronIntegerOption(opts.outputMaxBytes, "--output-max-bytes");
					return {
						kind: "command",
						argv: commandArgv ?? [
							"sh",
							"-lc",
							commandShell ?? ""
						],
						cwd: normalizeOptionalString(opts.commandCwd),
						env: parseCronCommandEnv(opts.commandEnv),
						input: typeof opts.commandInput === "string" ? opts.commandInput : void 0,
						timeoutSeconds,
						noOutputTimeoutSeconds,
						outputMaxBytes,
						...toolsAllow ? { toolsAllow } : {}
					};
				}
				return {
					kind: "agentTurn",
					message,
					model: normalizeOptionalString(opts.model),
					fallbacks: parseCronStringList(opts.fallbacks),
					thinking: normalizeOptionalString(opts.thinking),
					timeoutSeconds,
					lightContext: opts.lightContext === true ? true : void 0,
					toolsAllow
				};
			})();
			const sessionSource = cmd.getOptionValueSource("session");
			const sessionTargetRaw = normalizeOptionalString(opts.session) ?? "";
			const inferredSessionTarget = resolvedPayload.kind === "agentTurn" || resolvedPayload.kind === "command" || resolvedPayload.kind === "script" ? "isolated" : "main";
			const sessionTarget = sessionSource === "cli" ? normalizeCronSessionTargetOption(sessionTargetRaw) || "" : inferredSessionTarget;
			const isCustomSessionTarget = normalizeLowercaseStringOrEmpty(sessionTarget).startsWith("session:") && Boolean(normalizeOptionalString(sessionTarget.slice(8)));
			const isIsolatedLikeSessionTarget = sessionTarget === "isolated" || sessionTarget === "current" || isCustomSessionTarget;
			if (sessionTarget !== "main" && !isIsolatedLikeSessionTarget) throw new CronCliError("--session must be main, isolated, current, or session:<id>");
			if (opts.deleteAfterRun && opts.keepAfterRun) throw new CronCliError("Choose --delete-after-run or --keep-after-run, not both");
			if (sessionTarget === "main" && resolvedPayload.kind !== "systemEvent" && resolvedPayload.kind !== "script") throw new CronCliError("Main jobs require --system-event or --script.");
			if (resolvedPayload.kind === "script" && sessionTarget !== "main" && sessionTarget !== "isolated") throw new CronCliError("Script jobs require --session main or --session isolated.");
			if (isIsolatedLikeSessionTarget && resolvedPayload.kind !== "agentTurn" && resolvedPayload.kind !== "command" && resolvedPayload.kind !== "script") throw new CronCliError("Isolated jobs require --message, --command, or --script.");
			if ((opts.announce || typeof opts.deliver === "boolean") && (!isIsolatedLikeSessionTarget || resolvedPayload.kind !== "agentTurn" && resolvedPayload.kind !== "command" && resolvedPayload.kind !== "script")) throw new CronCliError("--announce/--no-deliver require a non-main agentTurn, command, or script session target.");
			const accountId = normalizeOptionalString(opts.account);
			const threadId = parseCronThreadIdOption(opts.threadId);
			const hasThreadId = typeof threadId === "number";
			const hasChatDeliveryTarget = cmd.getOptionValueSource("channel") === "cli" || typeof opts.to === "string" || Boolean(accountId) || hasThreadId;
			if (hasChatDeliveryTarget && (!isIsolatedLikeSessionTarget || resolvedPayload.kind !== "agentTurn" && resolvedPayload.kind !== "command" && resolvedPayload.kind !== "script")) throw new CronCliError("--channel, --to, --account, and --thread-id require a non-main agentTurn, command, or script job with delivery.");
			if (hasWebhook && hasChatDeliveryTarget) throw new CronCliError("--webhook cannot be combined with chat delivery options.");
			const deliveryMode = hasWebhook ? "webhook" : isIsolatedLikeSessionTarget && (resolvedPayload.kind === "agentTurn" || resolvedPayload.kind === "command" || resolvedPayload.kind === "script") ? hasAnnounce ? "announce" : hasNoDeliver ? "none" : "announce" : void 0;
			const optionName = normalizeOptionalString(opts.name);
			const positionalName = hasScheduleFlag ? normalizeOptionalString(nameArg) : void 0;
			if (optionName && positionalName && optionName !== positionalName) throw new CronCliError("Pass the automation name either positionally or with --name, not both.");
			const name = optionName ?? positionalName ?? "";
			if (!name) throw new CronCliError("Cron job name is required. Pass a name or --name <name>.");
			const description = normalizeOptionalString(opts.description);
			const declarationKey = normalizeOptionalString(opts.declarationKey);
			if (typeof opts.declarationKey === "string" && !declarationKey) throw new CronCliError("--declaration-key must not be blank");
			const displayName = normalizeOptionalString(opts.displayName);
			if (typeof opts.displayName === "string" && !displayName) throw new CronCliError("--display-name must not be blank");
			const pacingMin = normalizeOptionalString(opts.pacingMin);
			const pacingMax = normalizeOptionalString(opts.pacingMax);
			if (typeof opts.pacingMin === "string" && !pacingMin) throw new CronCliError("--pacing-min must not be blank");
			if (typeof opts.pacingMax === "string" && !pacingMax) throw new CronCliError("--pacing-max must not be blank");
			const sessionKey = normalizeOptionalString(opts.sessionKey);
			const triggerScriptPath = readNonBlankString(opts.triggerScript);
			if ((opts.triggerOnce || opts.triggerScript !== void 0) && !triggerScriptPath) throw new CronCliError(`--trigger-${opts.triggerOnce ? "once requires --trigger-script" : "script must not be blank"}`);
			const trigger = triggerScriptPath && {
				script: await readCronTriggerScript(triggerScriptPath),
				...opts.triggerOnce ? { once: true } : {}
			};
			if ((resolvedPayload.kind === "agentTurn" || resolvedPayload.kind === "script") && !agentId) defaultRuntime.error(theme.warn("No --agent specified; the job will run with the configured default agent. Specify --agent to choose a specific agent, or set agents.defaults.systemAgent.agentId."));
			const params = {
				name,
				declarationKey,
				displayName,
				description,
				...declarationKey && cmd.getOptionValueSource("disabled") !== "cli" ? {} : { enabled: !opts.disabled },
				deleteAfterRun: opts.deleteAfterRun ? true : opts.keepAfterRun ? false : void 0,
				agentId,
				sessionKey,
				schedule,
				...pacingMin || pacingMax ? { pacing: {
					...pacingMin ? { min: pacingMin } : {},
					...pacingMax ? { max: pacingMax } : {}
				} } : {},
				trigger,
				sessionTarget,
				wakeMode,
				payload: resolvedPayload,
				delivery: deliveryMode ? {
					mode: deliveryMode,
					channel: hasWebhook ? void 0 : normalizeOptionalString(opts.channel),
					to: hasWebhook ? webhookUrl : normalizeOptionalString(opts.to),
					threadId: hasWebhook ? void 0 : threadId,
					accountId: hasWebhook ? void 0 : accountId,
					bestEffort: opts.bestEffortDeliver ? true : void 0
				} : void 0
			};
			const res = await callGatewayFromCli("cron.add", opts, params);
			printCronJson(res);
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.cron-edit-options.ts
const assignIf = (target, key, value, shouldAssign) => {
	if (shouldAssign) target[key] = value;
};
async function resolveCronEditPayloadDeliveryPatch(opts, loadExistingJob, webhookUrl, commandCwd) {
	const patch = {};
	const hasSystemEventPatch = typeof opts.systemEvent === "string";
	const scriptPath = readNonBlankString(opts.script);
	const commandShell = readNonBlankString(opts.command);
	const commandArgv = parseCronCommandArgv(opts.commandArgv);
	if (commandShell && commandArgv) throw new CronCliError("Pass command payload either with --command or --command-argv, not both.");
	const hasModel = typeof opts.model === "string";
	const model = normalizeOptionalString(opts.model);
	if (hasModel && opts.clearModel) throw new CronCliError("Use --model or --clear-model, not both");
	const hasThinking = typeof opts.thinking === "string";
	const thinking = normalizeOptionalString(opts.thinking);
	if (hasThinking && opts.clearThinking) throw new CronCliError("Use --thinking or --clear-thinking, not both");
	const fallbacks = parseCronStringList(opts.fallbacks);
	if (typeof opts.fallbacks === "string" && opts.clearFallbacks) throw new CronCliError("Use --fallbacks or --clear-fallbacks, not both");
	const toolsAllow = parseCronStringList(opts.tools);
	const timeoutSeconds = parseCronIntegerOption(opts.timeoutSeconds, "--timeout-seconds", "non-negative");
	const hasTimeoutSeconds = timeoutSeconds !== void 0;
	const noOutputTimeoutSeconds = parseCronNoOutputTimeoutOption(opts);
	const outputMaxBytes = parseCronIntegerOption(opts.outputMaxBytes, "--output-max-bytes");
	const scriptTimeoutSeconds = parseCronIntegerOption(opts.scriptTimeoutSeconds, "--script-timeout-seconds");
	const scriptToolBudget = parseCronIntegerOption(opts.scriptToolBudget, "--script-tool-budget");
	const hasWebhookDelivery = Boolean(webhookUrl);
	const hasDeliveryModeFlag = opts.announce || typeof opts.deliver === "boolean" || hasWebhookDelivery;
	const threadId = parseCronThreadIdOption(opts.threadId);
	const hasDeliveryThreadId = typeof threadId === "number";
	const hasDeliveryTarget = typeof opts.channel === "string" || typeof opts.to === "string" || hasDeliveryThreadId || Boolean(opts.clearChannel) || Boolean(opts.clearTo) || Boolean(opts.clearThreadId);
	const hasDeliveryAccount = typeof opts.account === "string" || Boolean(opts.clearAccount);
	const hasBestEffort = typeof opts.bestEffortDeliver === "boolean";
	if (hasWebhookDelivery && (hasDeliveryTarget || hasDeliveryAccount)) throw new CronCliError("--webhook cannot be combined with chat delivery options.");
	if (typeof opts.channel === "string" && opts.clearChannel) throw new CronCliError("Use --channel or --clear-channel, not both");
	if (typeof opts.to === "string" && opts.clearTo) throw new CronCliError("Use --to or --clear-to, not both");
	if (hasDeliveryThreadId && opts.clearThreadId) throw new CronCliError("Use --thread-id or --clear-thread-id, not both");
	if (typeof opts.account === "string" && opts.clearAccount) throw new CronCliError("Use --account or --clear-account, not both");
	const hasCommandInput = typeof opts.commandInput === "string";
	const hasCommandSpecificPayloadField = Boolean(commandShell) || Boolean(commandArgv) || Boolean(commandCwd) || hasCommandInput || opts.commandEnv !== void 0 || noOutputTimeoutSeconds !== void 0 || outputMaxBytes !== void 0;
	const hasToolsAllowPatch = typeof opts.tools === "string" || Array.isArray(opts.tools) || Boolean(opts.clearTools);
	const hasAgentTurnSpecificPayloadField = typeof opts.message === "string" || Boolean(model) || Boolean(opts.clearModel) || typeof opts.fallbacks === "string" || Boolean(opts.clearFallbacks) || Boolean(thinking) || Boolean(opts.clearThinking) || typeof opts.lightContext === "boolean";
	const hasScriptSpecificPayloadField = Boolean(scriptPath) || scriptTimeoutSeconds !== void 0 || scriptToolBudget !== void 0;
	if (hasTimeoutSeconds && hasScriptSpecificPayloadField) throw new CronCliError("Use --script-timeout-seconds for script jobs, not --timeout-seconds.");
	if (hasTimeoutSeconds && hasSystemEventPatch) throw new CronCliError("--timeout-seconds is not supported for systemEvent jobs.");
	let timeoutOnlyPayloadKind;
	if (hasTimeoutSeconds && !hasCommandSpecificPayloadField && !hasAgentTurnSpecificPayloadField) {
		const existingJob = await loadExistingJob();
		const existingKind = existingJob.payload.kind;
		if (existingKind === "script") throw new CronCliError("Use --script-timeout-seconds for script jobs, not --timeout-seconds.");
		if (existingKind === "systemEvent" || isSystemOwnedCronPayloadKind(existingKind) || isSystemMonitorDeclaration(existingJob.declarationKey)) throw new CronCliError(`--timeout-seconds is not supported for ${existingKind} jobs.`);
		timeoutOnlyPayloadKind = existingKind;
	}
	let toolsOnlyPayloadKind;
	if (hasToolsAllowPatch && !hasSystemEventPatch && !hasAgentTurnSpecificPayloadField && !hasCommandSpecificPayloadField && !hasScriptSpecificPayloadField && !hasTimeoutSeconds) {
		const existingJob = await loadExistingJob();
		if (isSystemMonitorDeclaration(existingJob.declarationKey)) throw new CronCliError("System-owned cron jobs cannot be edited by cron clients.");
		toolsOnlyPayloadKind = existingJob.payload.kind;
	}
	const hasAgentTurnPayloadField = hasAgentTurnSpecificPayloadField || timeoutOnlyPayloadKind === "agentTurn" || hasToolsAllowPatch && toolsOnlyPayloadKind === "agentTurn";
	const hasCommandPayloadField = hasCommandSpecificPayloadField || timeoutOnlyPayloadKind === "command" || toolsOnlyPayloadKind === "command";
	const hasAgentTurnPatch = hasAgentTurnPayloadField;
	const hasCommandPatch = hasCommandPayloadField;
	const hasScriptPatch = hasScriptSpecificPayloadField || toolsOnlyPayloadKind === "script";
	const hasSystemEventOrToolsPatch = hasSystemEventPatch || toolsOnlyPayloadKind === "systemEvent";
	if ([
		hasSystemEventOrToolsPatch,
		hasAgentTurnPatch,
		hasCommandPatch,
		hasScriptPatch
	].filter(Boolean).length > 1) throw new CronCliError("Choose at most one payload change");
	const assignToolsAllowPatch = (payload) => {
		if (opts.clearTools) payload.toolsAllow = ["*"];
		else if (toolsAllow) payload.toolsAllow = toolsAllow;
	};
	if (hasSystemEventOrToolsPatch) {
		const payload = { kind: "systemEvent" };
		assignIf(payload, "text", String(opts.systemEvent), hasSystemEventPatch);
		assignToolsAllowPatch(payload);
		patch.payload = payload;
	} else if (hasAgentTurnPatch) {
		const payload = { kind: "agentTurn" };
		assignIf(payload, "message", String(opts.message), typeof opts.message === "string");
		if (opts.clearModel) payload.model = null;
		else assignIf(payload, "model", model, Boolean(model));
		assignIf(payload, "fallbacks", fallbacks, typeof opts.fallbacks === "string");
		assignIf(payload, "fallbacks", null, Boolean(opts.clearFallbacks));
		if (opts.clearThinking) payload.thinking = null;
		else assignIf(payload, "thinking", thinking, Boolean(thinking));
		assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
		assignIf(payload, "lightContext", opts.lightContext, typeof opts.lightContext === "boolean");
		assignToolsAllowPatch(payload);
		patch.payload = payload;
	} else if (hasCommandPatch) {
		const payload = { kind: "command" };
		assignIf(payload, "argv", commandArgv, Boolean(commandArgv));
		assignIf(payload, "argv", [
			"sh",
			"-lc",
			commandShell
		], Boolean(commandShell));
		assignIf(payload, "cwd", commandCwd, Boolean(commandCwd));
		assignIf(payload, "env", parseCronCommandEnv(opts.commandEnv), opts.commandEnv !== void 0);
		assignIf(payload, "input", opts.commandInput, hasCommandInput);
		assignIf(payload, "timeoutSeconds", timeoutSeconds, hasTimeoutSeconds);
		assignIf(payload, "noOutputTimeoutSeconds", noOutputTimeoutSeconds, noOutputTimeoutSeconds !== void 0);
		assignIf(payload, "outputMaxBytes", outputMaxBytes, outputMaxBytes !== void 0);
		assignToolsAllowPatch(payload);
		patch.payload = payload;
	} else if (hasScriptPatch) {
		const payload = { kind: "script" };
		if (scriptPath) payload.script = await readCronPayloadScript(scriptPath);
		assignIf(payload, "timeoutSeconds", scriptTimeoutSeconds, scriptTimeoutSeconds !== void 0);
		assignIf(payload, "toolBudget", scriptToolBudget, scriptToolBudget !== void 0);
		assignToolsAllowPatch(payload);
		patch.payload = payload;
	}
	if (hasDeliveryModeFlag || hasDeliveryTarget || hasDeliveryAccount || hasBestEffort) {
		const delivery = {};
		if (hasDeliveryModeFlag) delivery.mode = hasWebhookDelivery ? "webhook" : opts.announce || opts.deliver === true ? "announce" : "none";
		else if (opts.bestEffortDeliver === true) delivery.mode = "announce";
		if (opts.clearChannel) delivery.channel = null;
		else if (typeof opts.channel === "string") {
			const channel = opts.channel.trim();
			delivery.channel = channel ? channel : void 0;
		}
		if (hasWebhookDelivery) delivery.to = webhookUrl;
		else if (opts.clearTo) delivery.to = null;
		else if (typeof opts.to === "string") {
			const to = opts.to.trim();
			delivery.to = to ? to : void 0;
		}
		if (opts.clearThreadId) delivery.threadId = null;
		else if (hasDeliveryThreadId) delivery.threadId = threadId;
		if (opts.clearAccount) delivery.accountId = null;
		else if (typeof opts.account === "string") {
			const account = opts.account.trim();
			delivery.accountId = account ? account : void 0;
		}
		if (typeof opts.bestEffortDeliver === "boolean") delivery.bestEffort = opts.bestEffortDeliver;
		patch.delivery = delivery;
	}
	return patch;
}
//#endregion
//#region src/cli/cron-cli/register.cron-edit.ts
async function readCronJobForEdit(opts, id) {
	try {
		return await callGatewayFromCli("cron.get", opts, { id });
	} catch (error) {
		if (!isUnknownCronGetMethodError(error)) throw error;
		const existing = (await listCronJobsFromGateway(opts, { includeDisabled: true }, { allowLegacyUnversionedPagination: true })).jobs.find((job) => job.id === id);
		if (!existing) throw new CronCliError(`unknown automation id: ${id}`, { cause: error });
		return existing;
	}
}
function registerCronEditCommand(cron) {
	addGatewayClientOptions(registerCronMutationOptions(createCronOutputCommand(cron, "edit").description("Edit an automation (patch fields)").argument("<id>", "Job id"), "edit").option("--clear-display-name", "Restore the stable name in list and detail views", false).option("--enable", "Enable job", false).option("--disable", "Disable job", false).option("--clear-agent", "Unset agent and use default", false).option("--clear-session-key", "Unset session key", false).option("--clear-pacing", "Remove dynamic-cadence bounds", false).option("--clear-trigger", "Remove the condition trigger", false).option("--clear-thinking", "Remove the per-job thinking override (restore normal cron thinking precedence)", false).option("--clear-fallbacks", "Remove per-job fallback override", false).option("--clear-model", "Remove the per-job model override (restore normal cron model precedence)", false).option("--no-light-context", "Disable lightweight bootstrap context for agent jobs").option("--clear-tools", "Remove tool allow-list (use all tools)", false).option("--clear-channel", "Unset the delivery channel", false).option("--clear-to", "Unset the delivery destination", false).option("--clear-thread-id", "Unset the Telegram forum topic thread id", false).option("--clear-account", "Unset the per-job delivery account override", false).option("--no-best-effort-deliver", "Fail job when delivery fails").option("--failure-alert", "Enable failure alerts for this job").option("--no-failure-alert", "Disable failure alerts for this job").option("--failure-alert-after <n>", "Alert after N consecutive job errors").option("--failure-alert-channel <channel>", `Failure alert channel (${getCronChannelOptions()})`).option("--failure-alert-to <dest>", "Failure alert destination").option("--failure-alert-cooldown <duration>", "Minimum time between alerts (e.g. 1h, 30m)").option("--failure-alert-include-skipped", "Count consecutive skipped runs toward alerts").option("--failure-alert-exclude-skipped", "Alert only on execution errors").option("--failure-alert-mode <mode>", "Failure alert delivery mode (announce or webhook)").option("--failure-alert-account-id <id>", "Account ID for failure alert channel (multi-account setups)").action(async (idArg, opts) => {
		try {
			const id = requireCronJobId(idArg);
			if (opts.clearTools && opts.tools !== void 0) throw new CronCliError("Use --tools or --clear-tools, not both");
			if (typeof opts.script === "string" && !readNonBlankString(opts.script)) throw new CronCliError("--script must not be blank");
			const commandCwd = normalizeOptionalString(opts.commandCwd);
			if (typeof opts.commandCwd === "string" && !commandCwd) throw new CronCliError("--command-cwd must not be blank");
			let existingJobPromise;
			let expectedConfigRevision;
			const readExistingCronJob = async () => {
				const existing = await (existingJobPromise ??= readCronJobForEdit(opts, id));
				if (typeof existing.configRevision === "string") expectedConfigRevision = existing.configRevision;
				return existing;
			};
			const sessionTarget = typeof opts.session === "string" ? normalizeCronSessionTargetOption(opts.session) : void 0;
			if (typeof opts.session === "string" && !sessionTarget) throw new CronCliError("--session must be main, isolated, current, or session:<id>");
			if (sessionTarget === "main" && (opts.message || opts.command || opts.commandArgv)) throw new CronCliError("Main jobs cannot use --message or --command; use --system-event or --session isolated.");
			if ((sessionTarget === "current" || sessionTarget?.startsWith("session:")) && typeof opts.script === "string") throw new CronCliError("Script jobs require --session main or --session isolated.");
			if ((sessionTarget === "isolated" || sessionTarget === "current" || sessionTarget?.startsWith("session:")) && opts.systemEvent) throw new CronCliError("Isolated jobs cannot use --system-event; use --message, --command, or --session main.");
			const hasExplicitChatDelivery = parseCronThreadIdOption(opts.threadId) !== void 0 || typeof opts.channel === "string" || typeof opts.to === "string" || typeof opts.account === "string";
			if (sessionTarget === "main" && typeof opts.systemEvent === "string" && hasExplicitChatDelivery) throw new CronCliError("--channel, --to, --account, and --thread-id require a non-main agentTurn or command job with delivery.");
			const webhookUrl = typeof opts.webhook === "string" ? normalizeHttpWebhookUrl(opts.webhook) ?? void 0 : void 0;
			if (typeof opts.webhook === "string" && !webhookUrl) throw new CronCliError("--webhook must be a valid http(s) URL");
			const hasWebhookDelivery = Boolean(webhookUrl);
			if ([
				Boolean(opts.announce),
				typeof opts.deliver === "boolean",
				hasWebhookDelivery
			].filter(Boolean).length > 1) throw new CronCliError("Choose at most one of --announce, --no-deliver, or --webhook.");
			const triggerScriptPath = readNonBlankString(opts.triggerScript);
			if (typeof opts.triggerScript === "string" && !triggerScriptPath) throw new CronCliError("--trigger-script must not be blank");
			if (opts.clearTrigger && (triggerScriptPath || opts.triggerOnce)) throw new CronCliError("Use --clear-trigger or trigger options, not both");
			const triggerScript = triggerScriptPath ? await readCronTriggerScript(triggerScriptPath) : void 0;
			const patch = {};
			if (typeof opts.name === "string") patch.name = opts.name;
			const displayName = normalizeOptionalString(opts.displayName);
			if (typeof opts.displayName === "string" && !displayName) throw new CronCliError("--display-name must not be blank");
			if (displayName && opts.clearDisplayName) throw new CronCliError("Use --display-name or --clear-display-name, not both");
			if (displayName) patch.displayName = displayName;
			if (opts.clearDisplayName) patch.displayName = null;
			if (typeof opts.description === "string") patch.description = opts.description;
			if (opts.enable && opts.disable) throw new CronCliError("Choose --enable or --disable, not both");
			if (opts.enable) patch.enabled = true;
			if (opts.disable) patch.enabled = false;
			if (opts.deleteAfterRun && opts.keepAfterRun) throw new CronCliError("Choose --delete-after-run or --keep-after-run, not both");
			if (opts.deleteAfterRun) patch.deleteAfterRun = true;
			if (opts.keepAfterRun) patch.deleteAfterRun = false;
			if (typeof opts.session === "string") patch.sessionTarget = sessionTarget;
			if (typeof opts.wake === "string") {
				const wakeMode = opts.wake.trim();
				if (wakeMode !== "now" && wakeMode !== "next-heartbeat") throw new CronCliError("--wake must be now or next-heartbeat");
				patch.wakeMode = wakeMode;
			}
			const agentId = normalizeOptionalString(opts.agent);
			if (typeof opts.agent === "string" && !agentId) throw new CronCliError("--agent must not be blank");
			if (agentId && opts.clearAgent) throw new CronCliError("Use --agent or --clear-agent, not both");
			if (agentId) patch.agentId = sanitizeAgentId(agentId);
			if (opts.clearAgent) patch.agentId = null;
			const sessionKey = normalizeOptionalString(opts.sessionKey);
			if (typeof opts.sessionKey === "string" && !sessionKey) throw new CronCliError("--session-key must not be blank");
			if (sessionKey && opts.clearSessionKey) throw new CronCliError("Use --session-key or --clear-session-key, not both");
			if (sessionKey) patch.sessionKey = sessionKey;
			if (opts.clearSessionKey) patch.sessionKey = null;
			const pacingMin = normalizeOptionalString(opts.pacingMin);
			const pacingMax = normalizeOptionalString(opts.pacingMax);
			const hasPacingMin = typeof opts.pacingMin === "string";
			const hasPacingMax = typeof opts.pacingMax === "string";
			if (hasPacingMin && !pacingMin) throw new CronCliError("--pacing-min must not be blank");
			if (hasPacingMax && !pacingMax) throw new CronCliError("--pacing-max must not be blank");
			if (opts.clearPacing && (hasPacingMin || hasPacingMax)) throw new CronCliError("Use --clear-pacing or pacing bounds, not both");
			if (opts.clearPacing) patch.pacing = null;
			else if (hasPacingMin || hasPacingMax) patch.pacing = {
				...(await readExistingCronJob()).pacing,
				...pacingMin ? { min: pacingMin } : {},
				...pacingMax ? { max: pacingMax } : {}
			};
			if (opts.clearTrigger) patch.trigger = null;
			else if (triggerScript !== void 0) patch.trigger = {
				...(await readExistingCronJob()).trigger,
				script: triggerScript,
				...opts.triggerOnce ? { once: true } : {}
			};
			else if (opts.triggerOnce) {
				const existing = await readExistingCronJob();
				if (!existing.trigger) throw new CronCliError("--trigger-once requires an existing trigger or --trigger-script");
				patch.trigger = {
					...existing.trigger,
					once: true
				};
			}
			const scheduleRequest = resolveCronEditScheduleRequest(opts);
			if (scheduleRequest.kind === "direct") {
				if (scheduleRequest.schedule.kind === "stream") {
					const existing = await readExistingCronJob();
					if (existing.schedule.kind === "stream") {
						const metadataRequest = resolveCronEditScheduleRequest({
							streamCwd: opts.streamCwd,
							streamMode: opts.streamMode,
							streamMatch: opts.streamMatch,
							streamBatchMs: opts.streamBatchMs,
							streamMaxBatchBytes: opts.streamMaxBatchBytes
						});
						patch.schedule = {
							...metadataRequest.kind === "patch-existing-stream" ? applyExistingStreamSchedulePatch(existing.schedule, metadataRequest) : existing.schedule,
							command: scheduleRequest.schedule.command
						};
					} else {
						validateStreamScheduleMetadata(scheduleRequest.schedule);
						patch.schedule = scheduleRequest.schedule;
					}
				} else if (scheduleRequest.schedule.kind === "cron" && scheduleRequest.schedule.tz === void 0) {
					const existing = await readExistingCronJob();
					patch.schedule = existing.schedule.kind === "cron" && existing.schedule.tz !== void 0 ? {
						...scheduleRequest.schedule,
						tz: existing.schedule.tz
					} : scheduleRequest.schedule;
				} else patch.schedule = scheduleRequest.schedule;
			} else if (scheduleRequest.kind === "patch-existing-cron") patch.schedule = applyExistingCronSchedulePatch((await readExistingCronJob()).schedule, scheduleRequest);
			else if (scheduleRequest.kind === "patch-existing-stream") patch.schedule = applyExistingStreamSchedulePatch((await readExistingCronJob()).schedule, scheduleRequest);
			Object.assign(patch, await resolveCronEditPayloadDeliveryPatch(opts, readExistingCronJob, webhookUrl, commandCwd));
			const hasFailureAlertAfter = typeof opts.failureAlertAfter === "string";
			const hasFailureAlertChannel = typeof opts.failureAlertChannel === "string";
			const hasFailureAlertTo = typeof opts.failureAlertTo === "string";
			const hasFailureAlertCooldown = typeof opts.failureAlertCooldown === "string";
			const hasFailureAlertIncludeSkipped = typeof opts.failureAlertIncludeSkipped === "boolean";
			const hasFailureAlertExcludeSkipped = typeof opts.failureAlertExcludeSkipped === "boolean";
			const hasFailureAlertMode = typeof opts.failureAlertMode === "string";
			const hasFailureAlertAccountId = typeof opts.failureAlertAccountId === "string";
			if (hasFailureAlertIncludeSkipped && hasFailureAlertExcludeSkipped) throw new CronCliError("Use either --failure-alert-include-skipped or --failure-alert-exclude-skipped.");
			const hasFailureAlertFields = hasFailureAlertAfter || hasFailureAlertChannel || hasFailureAlertTo || hasFailureAlertCooldown || hasFailureAlertIncludeSkipped || hasFailureAlertExcludeSkipped || hasFailureAlertMode || hasFailureAlertAccountId;
			const failureAlertFlag = typeof opts.failureAlert === "boolean" ? opts.failureAlert : void 0;
			if (failureAlertFlag === false && hasFailureAlertFields) throw new CronCliError("Use --no-failure-alert alone (without failure-alert-* options).");
			if (failureAlertFlag === false) patch.failureAlert = false;
			else if (failureAlertFlag === true || hasFailureAlertFields) {
				const failureAlert = {};
				if (hasFailureAlertAfter) failureAlert.after = parseCronIntegerOption(opts.failureAlertAfter, "--failure-alert-after");
				if (hasFailureAlertChannel) failureAlert.channel = normalizeOptionalLowercaseString(opts.failureAlertChannel);
				if (hasFailureAlertTo) {
					const to = normalizeOptionalString(opts.failureAlertTo) ?? "";
					failureAlert.to = to ? to : void 0;
				}
				if (hasFailureAlertCooldown) {
					let cooldownMs;
					try {
						cooldownMs = parseDurationMs(String(opts.failureAlertCooldown));
					} catch {
						throw new CronCliError("Invalid --failure-alert-cooldown.");
					}
					failureAlert.cooldownMs = cooldownMs;
				}
				if (hasFailureAlertIncludeSkipped || hasFailureAlertExcludeSkipped) failureAlert.includeSkipped = hasFailureAlertIncludeSkipped;
				if (hasFailureAlertMode) {
					const mode = normalizeOptionalLowercaseString(opts.failureAlertMode);
					if (mode !== "announce" && mode !== "webhook") throw new CronCliError("Invalid --failure-alert-mode (must be 'announce' or 'webhook').");
					failureAlert.mode = mode;
				}
				if (hasFailureAlertAccountId) {
					const accountId = normalizeOptionalString(opts.failureAlertAccountId) ?? "";
					failureAlert.accountId = accountId ? accountId : void 0;
				}
				patch.failureAlert = failureAlert;
			}
			const res = await callGatewayFromCli("cron.update", opts, {
				id,
				patch,
				...expectedConfigRevision !== void 0 ? { expectedConfigRevision } : {}
			});
			defaultRuntime.writeJson(res);
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.cron-scratch.ts
function parseExpectedRevision(value) {
	if (value === void 0) return;
	const revision = parseStrictNonNegativeInteger(value);
	if (revision === void 0) throw new CronCliError("--expected-revision must be a non-negative integer");
	return revision;
}
function registerCronScratchCommand(cron) {
	addGatewayClientOptions(createCronOutputCommand(cron, "scratch").description("Read or replace an automation's private scratch").argument("<id>", "Job id").option("--set <text>", "Replace scratch with exact text").option("--file <path>", "Replace scratch from a file, or - for stdin").option("--unset", "Remove the scratch row", false).option("--expected-revision <n>", "Require the current scratch revision").action(async (idArg, opts) => {
		try {
			const id = requireCronJobId(idArg);
			const mutations = [
				opts.set !== void 0,
				opts.file !== void 0,
				opts.unset === true
			].filter(Boolean).length;
			if (mutations > 1) throw new CronCliError("choose only one of --set, --file, or --unset");
			let expectedRevision = mutations === 1 && opts.expectedRevision !== void 0 && opts.file === void 0 && (opts.unset || Buffer.byteLength(String(opts.set ?? ""), "utf8") <= 262144) ? parseStrictNonNegativeInteger(opts.expectedRevision) : void 0;
			if (expectedRevision === void 0) {
				const current = await callGatewayFromCli("cron.scratch.get", opts, { id });
				if (mutations === 0) {
					if (opts.json) printCronJson(current);
					else if (current.scratch) process.stdout.write(current.scratch.content);
					return;
				}
				expectedRevision = parseExpectedRevision(opts.expectedRevision) ?? current.currentRevision;
			}
			const content = opts.unset ? null : opts.file !== void 0 ? await readCronScratchContent(String(opts.file)) : String(opts.set ?? "");
			const result = await callGatewayFromCli("cron.scratch.set", opts, {
				id,
				content,
				expectedRevision
			});
			if (!result.ok) throw new CronCliError(`cron scratch changed concurrently (current revision ${result.currentRevision})`);
			printCronJson(result);
		} catch (error) {
			handleCronCliError(error);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.cron-simple.ts
const CRON_RUN_WAIT_TIMEOUT_DEFAULT = "10m";
const CRON_RUN_WAIT_POLL_INTERVAL_DEFAULT = "2s";
function parseCronRunWaitDuration(raw) {
	const input = typeof raw === "string" || typeof raw === "number" || typeof raw === "bigint" ? String(raw) : "";
	let durationMs;
	try {
		durationMs = parseDurationMs(input, { defaultUnit: "ms" });
	} catch (error) {
		if (error instanceof Error) throw new CronCliError(error);
		throw error;
	}
	return resolveTimerTimeoutMs(durationMs, 0, 0);
}
function parseCronRunPollInterval(raw) {
	const durationMs = parseCronRunWaitDuration(raw);
	if (durationMs <= 0) throw new CronCliError("invalid --poll-interval");
	return resolvePositiveTimerTimeoutMs(durationMs, 2e3);
}
async function waitForCronRunCompletion(params) {
	const startedAt = performance.now();
	let hasPolled = false;
	for (;;) {
		const elapsedBeforePollMs = Math.floor(performance.now() - startedAt);
		if (hasPolled && elapsedBeforePollMs >= params.timeoutMs) throw new CronCliError(`timed out waiting for cron run ${params.runId}`);
		const remainingMs = Math.max(1, params.timeoutMs - elapsedBeforePollMs);
		const configuredTimeoutMs = parseTimeoutMs(params.opts.timeout);
		const pollTimeoutMs = configuredTimeoutMs === void 0 ? remainingMs : Math.min(configuredTimeoutMs, remainingMs);
		hasPolled = true;
		const pollOpts = {
			...params.opts,
			timeout: String(pollTimeoutMs)
		};
		const entry = (await callGatewayFromCli("cron.runs", pollOpts, {
			id: params.jobId,
			runId: params.runId,
			limit: 1
		})).entries?.[0];
		if (entry?.status === "ok" || entry?.status === "error" || entry?.status === "skipped") return entry;
		const elapsedMs = Math.floor(performance.now() - startedAt);
		if (elapsedMs >= params.timeoutMs) throw new CronCliError(`timed out waiting for cron run ${params.runId}`);
		await sleep(Math.min(params.pollIntervalMs, params.timeoutMs - elapsedMs));
	}
}
function registerCronToggleCommand(params) {
	addGatewayClientOptions(createCronOutputCommand(params.cron, params.name).description(params.description).argument("<id>", "Job id").action(async (id, opts) => {
		try {
			const res = await callGatewayFromCli("cron.update", opts, {
				id: requireCronJobId(id),
				patch: { enabled: params.enabled }
			});
			printCronJson(res);
			if (!params.enabled && process.stderr.isTTY) process.stderr.write(`Note: 'openclaw cron list' hides disabled jobs by default. Use 'openclaw cron list --all' to see this job, or 'openclaw cron enable <id>' to re-enable it.\n`);
			await warnIfCronSchedulerDisabled(opts);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
function registerCronSimpleCommands(cron) {
	addGatewayClientOptions(createCronOutputCommand(cron, "rm").description("Remove an automation").argument("<id>", "Job id").action(async (id, opts) => {
		try {
			const res = await callGatewayFromCli("cron.remove", opts, { id: requireCronJobId(id) });
			printCronJson(res);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	registerCronToggleCommand({
		cron,
		name: "enable",
		description: "Enable an automation",
		enabled: true
	});
	registerCronToggleCommand({
		cron,
		name: "disable",
		description: "Disable an automation",
		enabled: false
	});
	addGatewayClientOptions(createCronOutputCommand(cron, "get").description("Get an automation as JSON").argument("<id>", "Job id").action(async (id, opts) => {
		try {
			const res = await callGatewayFromCli("cron.get", opts, { id: requireCronJobId(id) });
			printCronJson(res);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	addGatewayClientOptions(cron.command("show").description("Show an automation").argument("<id>", "Job id or exact name").option("--json", "Output JSON", false).action(async (idArg, opts) => {
		try {
			const id = requireCronJobId(idArg);
			const { job, deliveryPreview } = await findCronJobByIdOrName(opts, id, { includeDeliveryPreview: !opts.json });
			if (!job) throw new CronCliError(formatCronLookupMiss(id));
			if (opts.json) {
				printCronJson(enrichCronJsonWithStatus(job));
				return;
			}
			printCronShow(job, defaultRuntime, { deliveryPreview });
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	addGatewayClientOptions(createCronOutputCommand(cron, "runs").description("Show automation run history").argument("[id]", "Job id").option("--id <id>", "Job id (alternative to positional argument)").option("--run-id <runId>", "Filter by cron run id").addOption(new Option("--status <status>", "Filter by run status").choices([
		"all",
		"ok",
		"error",
		"skipped"
	])).addOption(new Option("--delivery-status <status>", "Filter by delivery status").choices([
		"delivered",
		"not-delivered",
		"unknown",
		"not-requested"
	])).option("--query <text>", "Filter by run summary or error text").option("--offset <n>", "Entries to skip before returning results").addOption(new Option("--sort <direction>", "Sort by run time").choices(["asc", "desc"])).option("--limit <n>", "Max entries (default 50)", "50").action(async (idArg, opts) => {
		try {
			const argId = normalizeOptionalString(idArg);
			const flagId = normalizeOptionalString(opts.id);
			if (argId && flagId && argId !== flagId) throw new CronCliError(`Conflicting job ids: positional "${argId}" and --id "${flagId}".`);
			const id = requireCronJobId(argId ?? flagId, "Pass it positionally or with --id.");
			const limit = parseCronIntegerOption(opts.limit ?? "50", "--limit");
			const offset = parseCronIntegerOption(opts.offset, "--offset", "non-negative");
			if (typeof opts.runId === "string" && !opts.runId.trim()) throw new CronCliError("--run-id must not be blank");
			const res = await callGatewayFromCli("cron.runs", opts, {
				id,
				...typeof opts.runId === "string" && opts.runId.trim() ? { runId: opts.runId } : {},
				...typeof opts.status === "string" ? { status: opts.status } : {},
				...typeof opts.deliveryStatus === "string" ? { deliveryStatus: opts.deliveryStatus } : {},
				...typeof opts.query === "string" ? { query: opts.query } : {},
				...offset !== void 0 ? { offset } : {},
				...typeof opts.sort === "string" ? { sortDir: opts.sort } : {},
				limit
			});
			printCronJson(res);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
	addGatewayClientOptions(createCronOutputCommand(cron, "run").description("Run an automation now (debug)").argument("<id>", "Job id").option("--due", "Run only when due (default behavior in older versions)", false).option("--wait", "Wait for the queued run to finish", false).option("--wait-timeout <duration>", "Maximum time to wait for --wait", CRON_RUN_WAIT_TIMEOUT_DEFAULT).option("--poll-interval <duration>", "Polling interval for --wait", CRON_RUN_WAIT_POLL_INTERVAL_DEFAULT).action(async (idArg, opts, command) => {
		try {
			const id = requireCronJobId(idArg);
			let waitTimeoutMs = 0;
			let pollIntervalMs = 0;
			if (opts.wait) {
				waitTimeoutMs = parseCronRunWaitDuration(opts.waitTimeout);
				pollIntervalMs = parseCronRunPollInterval(opts.pollInterval);
			}
			if (command.getOptionValueSource("timeout") === "default") opts.timeout = "600000";
			const res = await callGatewayFromCli("cron.run", opts, {
				id,
				mode: opts.due ? "due" : "force"
			});
			const result = res;
			if (opts.wait && result?.ok && result.enqueued) {
				if (!result.runId) throw new Error("cron run did not return a runId to wait for");
				const run = await waitForCronRunCompletion({
					opts,
					jobId: id,
					runId: result.runId,
					timeoutMs: waitTimeoutMs,
					pollIntervalMs
				});
				const completionStatus = run.completionStatus ?? resolveCronCompletionStatus({
					status: run.status,
					delivered: run.delivered,
					deliveryStatus: run.deliveryStatus
				});
				const completedRun = {
					...run,
					completionStatus
				};
				printCronJson({
					...res,
					completed: true,
					status: run.status,
					completionStatus,
					run: completedRun
				});
				exitCliAfterOutput(defaultRuntime, completionStatus === "succeeded" ? 0 : 1);
			}
			printCronJson(res);
			exitCliAfterOutput(defaultRuntime, result?.ok && (result.ran || result.enqueued) ? 0 : 1);
		} catch (err) {
			handleCronCliError(err);
		}
	}));
}
//#endregion
//#region src/cli/cron-cli/register.ts
function inheritCronGatewayOptions(command) {
	for (const name of CRON_GATEWAY_OPTION_NAMES) {
		const inherited = inheritOptionFromParent(command, name);
		const source = command.parent?.getOptionValueSource(name);
		if (inherited !== void 0 && source && source !== "default") command.setOptionValueWithSource(name, inherited, source);
	}
}
function registerCronCli(program) {
	const cron = program.command("cron").alias("automations").description("Manage automations (via Gateway)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/cron", "docs.openclaw.ai/cli/cron")}\n${theme.muted("Upgrade tip:")} run \`openclaw doctor --fix\` to normalize legacy automation storage.\n`);
	addGatewayClientOptions(cron);
	cron.hook("preAction", (_parent, command) => inheritCronGatewayOptions(command));
	registerCronStatusCommand(cron);
	registerCronListCommand(cron);
	registerCronAddCommand(cron);
	registerCronSimpleCommands(cron);
	registerCronScratchCommand(cron);
	registerCronEditCommand(cron);
	setCommandJsonMode(cron, "output", ({ argv }) => isCronMachineOutput(argv));
	applyParentDefaultHelpAction(cron);
}
//#endregion
export { registerCronCli };
