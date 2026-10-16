import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { t as resolveCronJobsStorePath } from "./paths-C7ju4So0.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-bu8BjV4Y.mjs";
import { p as loadCronQuarantinedJobs } from "./store-ChPMJI5O.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-1uq0obi_.mjs";
import { t as RetiredStateFormatError } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { i as normalizeStoredCronJobs } from "./store-migration-bjHoqgkQ.mjs";
import { t as countLabel } from "./doctor-state-integrity-format-CGut2D9E.mjs";
import { c as formatLegacyIssuePreview, d as formatUnresolvedShellPromptAdvisory, l as formatScheduledToolPolicyAdvisory, o as rethrowSqliteSchemaVersionError, r as loadLegacyCronRepairState, s as formatLegacyGatewayExecAdvisory, t as applyLegacyCronStoreRepair, u as formatUnresolvedCommandPromptAdvisory } from "./legacy-repair-COrJZ9ct.mjs";
//#region src/commands/doctor/cron/warnings.ts
const LEGACY_WHATSAPP_HEALTH_SCRIPT_RE = /(?:^|\s)(?:"[^"]*ensure-whatsapp\.sh"|'[^']*ensure-whatsapp\.sh'|[^\s#;|&]*ensure-whatsapp\.sh)\b/u;
const CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT = 3;
const CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT = 3;
const CRONTAB_READ_TIMEOUT_MS = 5e3;
function normalizeModelRef(value) {
	const raw = normalizeOptionalString(value);
	if (!raw) return;
	const slash = raw.indexOf("/");
	if (slash <= 0 || slash >= raw.length - 1) return;
	const provider = raw.slice(0, slash).trim().toLowerCase();
	const model = raw.slice(slash + 1).trim();
	return provider && model ? `${provider}/${model}` : void 0;
}
function normalizeModelMismatchKey(value) {
	return normalizeModelRef(value) ?? normalizeOptionalString(value)?.toLowerCase();
}
function formatSortedCounts(counts) {
	return [...counts.entries()].toSorted(([left], [right]) => left.localeCompare(right)).map(([label, count]) => `${label}=${count}`).join(", ");
}
function noteCronModelOverrides(params) {
	const defaultModel = resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
	const defaultKey = normalizeModelMismatchKey(defaultModel);
	const providerCounts = /* @__PURE__ */ new Map();
	const mismatchExamples = [];
	let overrideCount = 0;
	let mismatchCount = 0;
	for (const rawJob of params.jobs) {
		if (rawJob.enabled === false) continue;
		const payload = isRecord(rawJob.payload) ? rawJob.payload : void 0;
		const kind = normalizeOptionalString(payload?.kind)?.toLowerCase();
		if (kind && kind !== "agentturn") continue;
		const model = normalizeOptionalString(payload?.model);
		if (!model) continue;
		overrideCount += 1;
		const modelRef = normalizeModelRef(model);
		const provider = modelRef?.split("/", 1)[0] ?? "bare/alias";
		providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
		const modelKey = modelRef ?? model.toLowerCase();
		if (defaultKey && modelKey && modelKey !== defaultKey) {
			mismatchCount += 1;
			if (mismatchExamples.length < CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT) {
				const id = normalizeOptionalString(rawJob.id) ?? normalizeOptionalString(rawJob.jobId);
				const name = normalizeOptionalString(rawJob.name);
				mismatchExamples.push(`${id ?? name ?? "<unnamed>"} -> ${model}`);
			}
		}
	}
	if (overrideCount === 0) return;
	const lines = [
		"Automation model overrides detected.",
		`- ${countLabel(overrideCount, "job")} set \`payload.model\` and will not inherit \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`,
		`- Provider namespaces: ${formatSortedCounts(providerCounts)}`
	];
	if (mismatchCount > 0) {
		lines.push(`- ${countLabel(mismatchCount, "job")} ${mismatchCount === 1 ? "uses" : "use"} a different model than \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`);
		lines.push(`- Examples: ${mismatchExamples.join(", ")}`);
	}
	lines.push(`Review with ${formatCliCommand("openclaw automations list")} and ${formatCliCommand("openclaw automations show <job-id>")}; remove \`payload.model\` from jobs that should inherit the default.`);
	note(lines.join("\n"), "Cron");
}
function canonicalChannelKey(value) {
	return normalizeChatChannelId(value) ?? value.trim().toLowerCase();
}
function listConcreteCronDeliveryTargets(jobs) {
	const targets = [];
	for (const job of jobs) {
		if (job.enabled === false || !isRecord(job.delivery) || job.delivery.mode !== "announce") continue;
		const plan = resolveCronDeliveryPlan(job);
		if (plan.mode !== "announce" || !plan.channel || plan.channel === "last") continue;
		targets.push({
			channel: plan.channel,
			job
		});
	}
	return targets;
}
function collectCronDeliveryTargetAdvisory(params) {
	const concreteTargets = listConcreteCronDeliveryTargets(params.jobs);
	if (concreteTargets.length === 0) return null;
	const availableKeys = /* @__PURE__ */ new Set();
	const plugins = listReadOnlyChannelPluginsForConfig(params.cfg, {
		includePersistedAuthState: false,
		includeSetupFallbackPlugins: true
	});
	for (const { id } of plugins) {
		const normalized = normalizeOptionalString(id);
		if (normalized) availableKeys.add(canonicalChannelKey(normalized));
	}
	const channelCounts = /* @__PURE__ */ new Map();
	const examples = [];
	let unavailableCount = 0;
	for (const { channel, job } of concreteTargets) {
		if (availableKeys.has(canonicalChannelKey(channel))) continue;
		unavailableCount += 1;
		channelCounts.set(channel, (channelCounts.get(channel) ?? 0) + 1);
		if (examples.length < CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT) {
			const id = normalizeOptionalString(job.id) ?? normalizeOptionalString(job.jobId);
			const name = normalizeOptionalString(job.name);
			examples.push(`${id ?? name ?? "<unnamed>"} -> ${channel}`);
		}
	}
	if (unavailableCount === 0) return null;
	return [
		"Automation delivery targets unavailable channels.",
		`- ${countLabel(unavailableCount, "job")} ${unavailableCount === 1 ? "announces" : "announce"} to a channel whose plugin is not active; the next scheduled run will fail to deliver`,
		`- Channels: ${formatSortedCounts(channelCounts)}`,
		`- Examples: ${examples.join(", ")}`,
		`Reactivate the channel plugin or update the job's \`delivery.channel\` after reviewing with ${formatCliCommand("openclaw automations list")} and ${formatCliCommand("openclaw automations show <job-id>")}.`
	].join("\n");
}
function noteCronDeliveryTargetAdvisory(params) {
	let advisory;
	try {
		advisory = collectCronDeliveryTargetAdvisory(params);
	} catch {
		return;
	}
	if (advisory) note(advisory, "Cron");
}
function findLegacyWhatsAppHealthCrontabLines(crontab) {
	return (normalizeStringifiedOptionalString(crontab) ?? "").split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#")).filter((line) => LEGACY_WHATSAPP_HEALTH_SCRIPT_RE.test(line));
}
async function collectLegacyWhatsAppCrontabHealthWarning(params = {}) {
	if ((params.platform ?? process.platform) !== "linux") return null;
	let crontab;
	try {
		crontab = (await (params.readCrontab ? params.readCrontab() : runExec("crontab", ["-l"], {
			logOutput: false,
			timeoutMs: CRONTAB_READ_TIMEOUT_MS
		}))).stdout;
	} catch {
		return null;
	}
	const legacyLines = findLegacyWhatsAppHealthCrontabLines(crontab);
	if (legacyLines.length === 0) return null;
	return [
		"Legacy WhatsApp crontab health check detected.",
		"`~/.openclaw/bin/ensure-whatsapp.sh` is not maintained by current OpenClaw and can misreport `Gateway inactive` from cron when the systemd user bus environment is missing.",
		`Remove the stale crontab entry with ${formatCliCommand("crontab -e")}; use ${formatCliCommand("openclaw channels status --probe")}, ${formatCliCommand("openclaw doctor")}, and ${formatCliCommand("openclaw gateway status")} for current health checks.`,
		`Matched ${countLabel(legacyLines.length, "entry")}.`
	].join("\n");
}
async function noteLegacyWhatsAppCrontabHealthCheck(params = {}) {
	const warning = await collectLegacyWhatsAppCrontabHealthWarning(params);
	if (warning) note(warning, "Cron");
}
//#endregion
//#region src/commands/doctor/cron/index.ts
function readLegacyCronStorePath(cfg) {
	return cfg.cron?.store;
}
function countInFlightCronJobs(jobs) {
	return jobs.filter((job) => {
		const state = job.state;
		return typeof state === "object" && state !== null && typeof state.runningAtMs === "number";
	}).length;
}
const CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS = 3;
function countChronicallyFailingCronJobs(jobs) {
	return jobs.filter((job) => {
		if (job.enabled === false) return false;
		const state = job.state;
		if (typeof state !== "object" || state === null) return false;
		const consecutiveErrors = state.consecutiveErrors;
		return typeof consecutiveErrors === "number" && consecutiveErrors >= CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS;
	}).length;
}
function collectAutoDisabledCronJobs(jobs) {
	const autoDisabledJobs = [];
	for (const job of jobs) {
		if (job.enabled !== false || typeof job.id !== "string") continue;
		const state = job.state;
		if (!isRecord(state)) continue;
		const autoDisabled = state.autoDisabled;
		if (!isRecord(autoDisabled)) continue;
		if (autoDisabled.reason !== "consecutive-failures" && autoDisabled.reason !== "schedule-errors" || typeof autoDisabled.consecutiveErrors !== "number") continue;
		autoDisabledJobs.push({
			id: job.id,
			name: typeof job.name === "string" && job.name.trim() ? job.name.trim() : job.id,
			reason: autoDisabled.reason,
			consecutiveErrors: autoDisabled.consecutiveErrors
		});
	}
	return autoDisabledJobs;
}
const LEGACY_CRON_STORE_CHECK_ID = "core/doctor/legacy-cron-store";
function legacyCronStoreFinding(params) {
	return {
		checkId: LEGACY_CRON_STORE_CHECK_ID,
		severity: "warning",
		message: params.message,
		path: params.path,
		requirement: params.requirement,
		fixHint: params.fixHint ?? `Run ${formatCliCommand("openclaw doctor --fix")} to normalize legacy cron storage.`
	};
}
async function collectLegacyCronStoreHealthFindings(params) {
	let state;
	try {
		state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			readOnly: true
		});
	} catch (err) {
		if (err instanceof RetiredStateFormatError) throw err;
		rethrowSqliteSchemaVersionError(err);
		const storePath = resolveCronJobsStorePath(readLegacyCronStorePath(params.cfg));
		return [legacyCronStoreFinding({
			message: `Unable to read cron job store at ${shortenHomePath(storePath)}.`,
			path: storePath,
			requirement: "cron-store-readable",
			fixHint: [
				`Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}.`,
				"Later health checks will continue.",
				`Details: ${formatErrorMessage(err)}`
			].join(" ")
		})];
	}
	if (!state) return [];
	const findings = [];
	const { storePath, legacyQuarantine, rawJobs } = state;
	const sqliteStorePath = resolveOpenClawStateSqlitePath();
	try {
		const quarantine = await loadCronQuarantinedJobs(storePath);
		if (quarantine.length > 0) findings.push(legacyCronStoreFinding({
			message: `${countLabel(quarantine.length, "quarantined cron job row")} found in SQLite at ${shortenHomePath(sqliteStorePath)}.`,
			path: sqliteStorePath,
			requirement: "quarantined-cron-rows",
			fixHint: "Review or repair quarantined rows before restoring any job to the active cron store."
		}));
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		findings.push(legacyCronStoreFinding({
			message: `Unable to read quarantined cron rows in SQLite at ${shortenHomePath(sqliteStorePath)}.`,
			path: sqliteStorePath,
			requirement: "cron-quarantine-readable",
			fixHint: `Check the shared state database permissions and contents. Details: ${formatErrorMessage(err)}`
		}));
	}
	if (legacyQuarantine) findings.push(legacyCronStoreFinding({
		message: `Legacy JSON cron quarantine will be imported into SQLite from ${shortenHomePath(legacyQuarantine.path)}.`,
		path: legacyQuarantine.path,
		requirement: "legacy-cron-quarantine"
	}));
	if (rawJobs.length === 0) return findings;
	const normalized = normalizeStoredCronJobs(rawJobs);
	for (const line of formatLegacyIssuePreview(normalized.issues)) findings.push(legacyCronStoreFinding({
		message: line.replace(/^- /u, ""),
		path: sqliteStorePath,
		requirement: "legacy-cron-store-shape"
	}));
	for (const job of normalized.unsupportedDeliveryModeJobs) findings.push(legacyCronStoreFinding({
		message: `Cron job ${job} has an unsupported delivery mode; Doctor left it unchanged.`,
		path: sqliteStorePath,
		requirement: "cron-delivery-mode-valid",
		fixHint: "Review its intended delivery and set mode to \"none\", \"announce\", or \"webhook\"."
	}));
	for (const job of normalized.legacyTriggerScriptJobs) findings.push(legacyCronStoreFinding({
		message: `Legacy cron trigger script for ${job} can be migrated to canonical direct tool calls.`,
		path: sqliteStorePath,
		requirement: "legacy-cron-trigger-script"
	}));
	for (const job of normalized.unsupportedLegacyTriggerScriptJobs) findings.push(legacyCronStoreFinding({
		message: `Legacy cron trigger script for ${job} cannot be safely migrated automatically.`,
		path: sqliteStorePath,
		requirement: "unsupported-legacy-cron-trigger-script",
		fixHint: "Inspect the automation and update its trigger script manually to use direct tool calls."
	}));
	for (const [names, requirement, description] of [[
		normalized.legacyScheduledToolPolicyJobs,
		"cron-scheduled-authority-reauthorization",
		"require explicit scheduled authority reauthorization"
	], [
		normalized.invalidScheduledToolPolicyJobs,
		"cron-scheduled-authority-valid",
		"have invalid scheduled authority provenance"
	]]) if (names.length > 0) findings.push(legacyCronStoreFinding({
		message: `${countLabel(names.length, "tool-bearing automation")} ${description}.`,
		path: sqliteStorePath,
		requirement,
		fixHint: `Review with ${formatCliCommand("openclaw automations list --all")} and reauthorize with ${formatCliCommand("openclaw automations edit <id> --tools <tool,...>")}.`
	}));
	if (normalized.legacyGatewayExecJobs.length > 0) findings.push(legacyCronStoreFinding({
		message: `${countLabel(normalized.legacyGatewayExecJobs.length, "automation")} require recreation because they grant the retired \`gateway_exec\` alias.`,
		path: sqliteStorePath,
		requirement: "legacy-gateway-exec-recreation",
		fixHint: "Review the affected jobs with `openclaw automations list --all`, then recreate each one from a fresh authenticated creator turn or explicitly reauthorize its complete tool cap from a trusted operator shell."
	}));
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	if (notifyCount > 0) findings.push(legacyCronStoreFinding({
		message: `${countLabel(notifyCount, "job")} still uses legacy notify webhook fallback.`,
		path: sqliteStorePath,
		requirement: "legacy-notify-fallback"
	}));
	return findings;
}
function noteLegacyCronRepairResult(result) {
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function maybeRepairLegacyCronStore(params) {
	let state;
	try {
		state = await loadLegacyCronRepairState({ cfg: params.cfg });
	} catch (err) {
		if (err instanceof RetiredStateFormatError) throw err;
		rethrowSqliteSchemaVersionError(err);
		const reason = err instanceof Error ? err.message : String(err);
		const storePath = resolveCronJobsStorePath(readLegacyCronStorePath(params.cfg));
		note([
			`Unable to read cron job store at ${shortenHomePath(storePath)}.`,
			`- ${reason}`,
			`Fix the file's permissions or contents and re-run ${formatCliCommand("openclaw doctor")}; later health checks will continue.`
		].join("\n"), "Cron");
		return;
	}
	if (!state) return;
	const { storePath, legacyQuarantine, invalidConfigRows, persistedQuarantine, rawJobs } = state;
	const repair = async (normalized) => {
		if (await params.prompter.confirm({
			message: "Repair legacy cron jobs now?",
			initialValue: true
		})) noteLegacyCronRepairResult(await applyLegacyCronStoreRepair({
			cfg: params.cfg,
			state,
			...normalized ? { normalized } : {},
			recoverQuarantinedScheduleJobs: true
		}));
	};
	const revalidatableQuarantineCount = persistedQuarantine.filter((entry) => entry.reason === "invalid-schedule" && entry.job).length;
	const sqliteStorePath = resolveOpenClawStateSqlitePath();
	try {
		const quarantine = await loadCronQuarantinedJobs(storePath);
		if (quarantine.length > 0) note([
			`Quarantined cron job rows found in SQLite at ${shortenHomePath(sqliteStorePath)}.`,
			`- ${countLabel(quarantine.length, "row")} was removed from the active cron store after runtime validation failed.`,
			"- Review or repair quarantined rows before restoring any job to the active cron store."
		].join("\n"), "Cron");
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		const reason = err instanceof Error ? err.message : String(err);
		note([`Unable to read quarantined cron rows in SQLite at ${shortenHomePath(sqliteStorePath)}.`, `- ${reason}`].join("\n"), "Cron");
	}
	const storagePreviewLines = [];
	if (legacyQuarantine) storagePreviewLines.push("- legacy JSON cron quarantine will be imported into SQLite");
	if (invalidConfigRows.length > 0) storagePreviewLines.push(`- ${countLabel(invalidConfigRows.length, "malformed cron row")} will be quarantined in SQLite`);
	if (revalidatableQuarantineCount > 0) storagePreviewLines.push(`- ${countLabel(revalidatableQuarantineCount, "quarantined automation")} will be revalidated and restored only if current validation passes`);
	if (rawJobs.length === 0) {
		if (!legacyQuarantine && invalidConfigRows.length === 0 && revalidatableQuarantineCount === 0) return;
		const noteHeading = legacyQuarantine ? `Legacy cron storage detected at ${shortenHomePath(storePath)}.` : `Cron store issues detected at ${shortenHomePath(sqliteStorePath)}.`;
		note([
			noteHeading,
			...storagePreviewLines,
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to finish the migration.`
		].join("\n"), "Cron");
		await repair();
		return;
	}
	noteCronModelOverrides({
		cfg: params.cfg,
		jobs: rawJobs
	});
	noteCronDeliveryTargetAdvisory({
		cfg: params.cfg,
		jobs: rawJobs
	});
	const inFlightCount = countInFlightCronJobs(rawJobs);
	if (inFlightCount > 0) {
		const subject = inFlightCount === 1 ? "it" : "them";
		note([
			`${countLabel(inFlightCount, "automation")} ${inFlightCount === 1 ? "is" : "are"} still marked in-flight (\`state.runningAtMs\` is set).`,
			`- If no gateway is currently executing ${subject}, the marker is left over from an interrupted run; the gateway marks such runs interrupted the next time it starts.`,
			`- Review with ${formatCliCommand("openclaw automations list --all")} or ${formatCliCommand("openclaw automations show <id>")}.`
		].join("\n"), "Cron");
	}
	const chronicFailureCount = countChronicallyFailingCronJobs(rawJobs);
	if (chronicFailureCount > 0) note([
		`${countLabel(chronicFailureCount, "automation")} ${chronicFailureCount === 1 ? "has" : "have"} failed ${CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS}+ runs in a row (\`state.consecutiveErrors\`), so the scheduler only re-fires ${chronicFailureCount === 1 ? "it" : "them"} on error backoff.`,
		`- The count resets on the next successful run and also counts runs interrupted by a gateway restart, so a lasting streak means repeated task failures, repeatedly interrupted runs, or a mix. Failure alerts are opt-in, so this may be the only notice.`,
		`- Review with ${formatCliCommand("openclaw automations list")} or ${formatCliCommand("openclaw automations show <id>")}.`
	].join("\n"), "Cron");
	const autoDisabledJobs = collectAutoDisabledCronJobs(rawJobs);
	if (autoDisabledJobs.length > 0) note([`${countLabel(autoDisabledJobs.length, "automation")} ${autoDisabledJobs.length === 1 ? "is" : "are"} auto-disabled after repeated failures.`, ...autoDisabledJobs.map((job) => `- ${job.name} (${job.id}): recorded reason \`${job.reason}\` after ${job.consecutiveErrors} consecutive errors. Fix the cause, then re-enable with ${formatCliCommand(`openclaw automations enable ${job.id}`)}.`)].join("\n"), "Cron");
	const normalized = normalizeStoredCronJobs(rawJobs);
	if (normalized.unsupportedDeliveryModeJobs.length > 0) note(`Unsupported cron delivery modes were left unchanged: ${normalized.unsupportedDeliveryModeJobs.join(", ")}. Review their intended delivery and set mode to "none", "announce", or "webhook".`, "Cron");
	if (normalized.unsupportedLegacyTriggerScriptJobs.length > 0) note([
		"Legacy cron trigger scripts cannot be safely migrated automatically:",
		...normalized.unsupportedLegacyTriggerScriptJobs.map((job) => `- ${job}`),
		"Inspect each automation and update its trigger script manually to use direct tool calls."
	].join("\n"), "Cron");
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	for (const advisory of [
		formatUnresolvedCommandPromptAdvisory(normalized.unresolvedAgentTurnCommandPromptJobs),
		formatUnresolvedShellPromptAdvisory(normalized.unresolvedAgentTurnShellToolPromptJobs),
		formatScheduledToolPolicyAdvisory({
			legacyJobs: normalized.legacyScheduledToolPolicyJobs,
			invalidJobs: normalized.invalidScheduledToolPolicyJobs
		}),
		formatLegacyGatewayExecAdvisory(normalized.legacyGatewayExecJobs)
	]) if (advisory) note(advisory, "Cron");
	const previewLines = formatLegacyIssuePreview(normalized.issues);
	if (normalized.legacyTriggerScriptJobs.length > 0) previewLines.push(`- ${countLabel(normalized.legacyTriggerScriptJobs.length, "legacy cron trigger script")} will be migrated to direct tool calls: ${normalized.legacyTriggerScriptJobs.join(", ")}`);
	previewLines.push(...storagePreviewLines);
	if (notifyCount > 0) previewLines.push(`- ${countLabel(notifyCount, "job")} still uses legacy \`notify: true\` webhook fallback`);
	if (previewLines.length === 0) return;
	const noteHeading = `Cron store issues detected at ${shortenHomePath(resolveOpenClawStateSqlitePath())}.`;
	note([
		noteHeading,
		...previewLines,
		`Repair with ${formatCliCommand("openclaw doctor --fix")} to normalize the store before the next scheduler run.`
	].join("\n"), "Cron");
	await repair(normalized);
}
//#endregion
export { collectLegacyCronStoreHealthFindings, collectLegacyWhatsAppCrontabHealthWarning, maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck };
