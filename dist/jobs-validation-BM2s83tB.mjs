import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as compileSafeRegexDetailed } from "./safe-regex-mjvTiaxD.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as assertSafeCronSessionTargetId } from "./session-target-d98pYOqN.mjs";
import { n as resolveCronTriggerMinIntervalMs } from "./cron-limits-txevLFpr.mjs";
import { n as parseCodeModeScriptSyntax } from "./code-mode-script-syntax-DZwdESO8.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-B3paXGEX.mjs";
import { i as isCronEventSchedule } from "./source-schedule-49zenZxx.mjs";
import { t as isSystemOwnedCronPayloadKind } from "./types--MeiGb_d.mjs";
import { n as assertCanonicalCronDeliveryMode } from "./delivery-codec-DMPX9PBc.mjs";
import { t as resolveCronDeliveryMode } from "./delivery-defaults-BZP2TvGw.mjs";
import { t as parseCronPacingBounds } from "./pacing-DhLKxAJH.mjs";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-ChE1-aMy.mjs";
import { r as computeJobNextRunAtMs } from "./jobs-scheduling-sefIqbJ3.mjs";
import { n as isHeartbeatTaskCronJob } from "./heartbeat-task-Ds7Wgs5C.mjs";
//#region src/cron/service/jobs-validation.ts
/** Validation helpers for cron schedules, targets, payloads, and delivery. */
async function resolveConfiguredChannelsForValidation(state) {
	try {
		return await state.deps.listConfiguredChannels?.();
	} catch {
		state.deps.log.debug({}, "cron: configured channel validation skipped");
		return;
	}
}
function assertCronScriptSyntax(script, subject) {
	if (!script.trim()) throw new Error(`cron ${subject} must not be empty`);
	const parsed = parseCodeModeScriptSyntax(script);
	if (!parsed.ok) throw new Error(`cron ${subject} has a syntax error: ${parsed.message} (line ${parsed.line}, column ${parsed.column})`);
}
/** Validates that session target and payload kind form a supported cron job shape. */
function assertSupportedJobSpec(job) {
	if (typeof job.sessionTarget !== "string") throw new Error("cron job is missing sessionTarget; expected \"main\", \"isolated\", \"current\", or \"session:<id>\"");
	const isConversationTarget = job.sessionTarget === "current" || job.sessionTarget.startsWith("session:");
	if (job.sessionTarget.startsWith("session:")) assertSafeCronSessionTargetId(job.sessionTarget.slice(8));
	if (job.sessionTarget === "main" && job.payload.kind !== "systemEvent" && job.payload.kind !== "script" && !isSystemOwnedCronPayloadKind(job.payload.kind)) throw new Error("cron sessionTarget \"main\" requires payload.kind=\"systemEvent\" or \"script\"; agent turns use \"isolated\", \"current\", or \"session:<key>\"");
	if (job.payload.kind === "script" && job.sessionTarget !== "main" && job.sessionTarget !== "isolated") throw new Error(`cron sessionTarget "${job.sessionTarget}" cannot run script payloads: scripts run headless and support only "main" or "isolated"; to run a turn in an existing conversation use payload {kind:"agentTurn",message} with sessionTarget "session:<key>"`);
	if (isConversationTarget && job.payload.kind !== "agentTurn" && job.payload.kind !== "command") throw new Error(`cron sessionTarget "${job.sessionTarget}" cannot run ${job.payload.kind}: systemEvent only runs in the main session; for sessionTarget "${job.sessionTarget}" use payload {kind:"agentTurn",message}`);
	if (job.sessionTarget === "isolated" && job.payload.kind !== "agentTurn" && job.payload.kind !== "command" && job.payload.kind !== "script") throw new Error("cron sessionTarget \"isolated\" requires payload.kind=\"agentTurn\", \"command\", or \"script\"");
}
function assertScriptPayloadSupport(job, opts) {
	if (job.payload.kind !== "script") return;
	if (opts?.validateSyntax !== false) assertCronScriptSyntax(job.payload.script, "script payload");
	else if (!job.payload.script.trim()) throw new Error("cron script payload must not be empty");
	if (job.trigger) throw new Error("cron script payloads cannot be combined with a condition trigger");
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled === false) throw new Error("cron script payloads are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true to allow unattended scripts");
}
function assertTriggerSupport(job, opts) {
	if (!job.trigger) return;
	if (opts?.validateAuthoredTrigger && opts.cronConfig?.triggers?.enabled === false) throw new Error("cron triggers are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true");
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron" && job.schedule.kind !== "stream") throw new Error("cron triggers require an every, cron, or stream schedule");
	const minIntervalMs = resolveCronTriggerMinIntervalMs();
	if (job.schedule.kind === "every" && job.schedule.everyMs < minIntervalMs) throw new Error(`cron trigger every interval must be at least ${minIntervalMs}ms`);
	if (opts?.validateAuthoredTrigger) assertCronScriptSyntax(job.trigger.script, "trigger script");
}
function assertPacingSupport(job) {
	if (job.pacing === void 0) return;
	parseCronPacingBounds(job.pacing);
	if (job.schedule.kind !== "every" && job.schedule.kind !== "cron") throw new Error("cron pacing requires an every or cron schedule");
}
function assertExternalSourceScheduleSupport(job, opts) {
	if (job.schedule.kind !== "stream" && job.schedule.kind !== "event") return;
	if (opts?.requireEnabled && opts.cronConfig?.triggers?.enabled === false) throw new Error(`cron ${job.schedule.kind} schedules are disabled because the operator set cron.triggers.enabled: false; remove it or set it to true`);
	if (job.schedule.kind === "event") {
		if (!isCronEventSchedule(job.schedule) || job.payload.kind !== "agentTurn") throw new Error("event schedules require a plugin source, options object, and agentTurn payload");
		return;
	}
	const { command, mode = "line", match } = job.schedule;
	if (!Array.isArray(command) || command.length === 0 || command.some((entry) => typeof entry !== "string" || entry.length === 0)) throw new Error("cron stream schedule requires a non-empty command argv array");
	if (mode !== "line" && mode !== "match") throw new Error("cron stream mode must be \"line\" or \"match\"");
	if (mode === "match") {
		if (typeof match !== "string" || !match) throw new Error("cron stream match is required when mode=\"match\"");
		const compiled = compileSafeRegexDetailed(match);
		if (!compiled.regex) throw new Error(`cron stream match is not a safe regular expression (${compiled.reason})`);
	} else if (match !== void 0) throw new Error("cron stream match requires mode=\"match\"");
	if (job.payload.kind === "command") throw new Error("cron stream schedules cannot use command payloads");
}
function assertTimeScheduleSatisfiable(job, nowMs) {
	if (job.schedule.kind === "at") {
		if (parseAbsoluteTimeMs(job.schedule.at) === null) throw new Error("cron at schedule must contain a Date-valid absolute timestamp");
		return;
	}
	if (job.schedule.kind !== "cron" && job.schedule.kind !== "every") return;
	if (computeJobNextRunAtMs({
		...job,
		enabled: true
	}, nowMs) !== void 0) return;
	if (job.schedule.kind === "every") throw new Error("cron every schedule has no upcoming run time and would never fire");
	throw new Error(`cron expression "${job.schedule.expr}" has no upcoming run time and would never fire`);
}
function assertMainSessionAgentId(job, defaultAgentId, patch) {
	if (patch && !("agentId" in patch) && !("sessionTarget" in patch) && patch.payload?.kind === void 0) return;
	if (job.sessionTarget !== "main") return;
	if (!job.agentId) return;
	if (job.payload.kind === "script" || isSystemOwnedCronPayloadKind(job.payload.kind) || isHeartbeatTaskCronJob(job)) return;
	if (normalizeAgentId(job.agentId) !== normalizeAgentId(defaultAgentId)) throw new Error(`cron: sessionTarget "main" is only valid for the default agent. Use sessionTarget "isolated" with payload.kind "agentTurn" for non-default agents (agentId: ${job.agentId})`);
}
function assertDeliverySupport(job) {
	assertCanonicalCronDeliveryMode(job.delivery);
	if (!job.delivery) return;
	if (job.delivery.mode === "none" && !job.delivery.completionDestination) return;
	if (job.delivery.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(job.delivery.to);
		if (!target) throw new Error("cron webhook delivery requires delivery.to to be a valid http(s) URL");
		job.delivery.to = target;
	}
	if (job.delivery.completionDestination?.mode === "webhook") {
		if (job.delivery.mode !== "announce") throw new Error("cron completion destination webhook is only supported with delivery.mode=\"announce\"");
		const target = normalizeHttpWebhookUrl(job.delivery.completionDestination.to);
		if (!target) throw new Error("cron completion destination webhook requires delivery.completionDestination.to to be a valid http(s) URL");
		job.delivery.completionDestination.to = target;
	}
	if (job.delivery.mode === "none") return;
	if (job.delivery.mode === "webhook") return;
	if (!(job.sessionTarget === "isolated" || job.sessionTarget === "current" || job.sessionTarget.startsWith("session:"))) throw new Error("cron channel delivery config is only supported for sessionTarget=\"isolated\"");
}
function assertAnnounceDeliveryChannelSupport(job, configuredChannels, patch) {
	if (patch && !cronPatchTouchesDeliveryResolution(patch)) return;
	const mode = resolveCronDeliveryMode(job);
	const channel = normalizeMessageChannel(job.delivery?.channel);
	const to = normalizeOptionalString(job.delivery?.to);
	const channels = [...new Set(configuredChannels ?? [])].toSorted();
	const targetMaySelectChannel = /^[a-z][a-z0-9_-]*:/i.test(to ?? "");
	if (job.sessionTarget !== "isolated" || job.sessionKey?.trim() || mode !== "announce" || channel !== void 0 && channel !== "last" || targetMaySelectChannel || job.delivery?.bestEffort === true || channels.length < 2) return;
	throw new Error(`cron announce delivery requires an explicit channel when multiple channels are configured (${channels.join(", ")}): set --channel <id> or use --best-effort-deliver`);
}
function cronPatchTouchesDeliveryResolution(patch) {
	return patch.delivery !== void 0 || patch.sessionTarget !== void 0 || "agentId" in patch || "sessionKey" in patch;
}
function assertFailureDestinationSupport(job) {
	const failureDestination = job.delivery?.failureDestination;
	if (!failureDestination || failureDestination.channel === void 0 && failureDestination.to === void 0 && failureDestination.accountId === void 0 && failureDestination.mode === void 0) return;
	if (job.sessionTarget === "main" && job.delivery?.mode !== "webhook") throw new Error("cron delivery.failureDestination is only supported for sessionTarget=\"isolated\" unless delivery.mode=\"webhook\"");
	if (failureDestination.mode === "webhook") {
		const target = normalizeHttpWebhookUrl(failureDestination.to);
		if (!target) throw new Error("cron failure destination webhook requires delivery.failureDestination.to to be a valid http(s) URL");
		failureDestination.to = target;
	}
}
//#endregion
export { assertMainSessionAgentId as a, assertSupportedJobSpec as c, cronPatchTouchesDeliveryResolution as d, resolveConfiguredChannelsForValidation as f, assertFailureDestinationSupport as i, assertTimeScheduleSatisfiable as l, assertDeliverySupport as n, assertPacingSupport as o, assertExternalSourceScheduleSupport as r, assertScriptPayloadSupport as s, assertAnnounceDeliveryChannelSupport as t, assertTriggerSupport as u };
