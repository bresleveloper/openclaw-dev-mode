import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { b as tryResolveAmbientOwnerAgentId, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as resolveSubagentConfiguredModelSelection, t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { r as resolveStaticSessionMcpServerNames } from "./agent-bundle-mcp-runtime-config-WTwiCoD-.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-SxX34tmf.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as resolveCronJobsStorePath } from "./paths-Bz2goYfd.mjs";
import { u as loadCronQuarantinedJobs } from "./save.kernel-BmIaenr0.mjs";
import "./store-CV1wrdMb.mjs";
import { t as listReadOnlyChannelPluginsForConfig } from "./read-only-CvMQqs0s.mjs";
import { r as NATIVE_CRON_CREATOR_CAPABILITIES } from "./cron-tool-creator-cap-CrhAXfqG.mjs";
import { i as resolveCodexMcpToolOverridesForAgent } from "./bundle-mcp-codex-_5DCSyq5.mjs";
import { r as tryResolveCronJobEffectiveAgentId } from "./agent-id-DfuNKDxM.mjs";
import { n as resolveCronDeliveryPlan } from "./delivery-plan-D6XdUIQv.mjs";
import { r as normalizeStoredCronJobs } from "./store-migration-BYXGlu9d.mjs";
import { c as formatLegacyGatewayExecAdvisory, d as formatUnresolvedCommandPromptAdvisory, f as formatUnresolvedShellPromptAdvisory, l as formatLegacyIssuePreview, o as rethrowSqliteSchemaVersionError, p as countStaleDreamingJobs, r as loadLegacyCronRepairState, s as formatIncompleteInheritedAuthorityAdvisory, t as applyLegacyCronStoreRepair, u as formatScheduledToolPolicyAdvisory } from "./legacy-repair-DEUk8Na4.mjs";
//#region src/commands/doctor/cron/native-tool-advisory.ts
/** An incomplete default cap is a review hint, never evidence to grant missing tools. */
function collectCronNativeToolAdvisories(params) {
	const advisories = [];
	for (const job of params.jobs) {
		const payload = isRecord(job.payload) ? job.payload : void 0;
		if (payload?.kind !== "agentTurn" || payload.toolsAllowIsDefault !== true || !Array.isArray(payload.toolsAllow) || payload.toolsAllow.some((name) => NATIVE_CRON_CREATOR_CAPABILITIES.has(name))) continue;
		const agentId = tryResolveCronJobEffectiveAgentId({
			agentId: normalizeOptionalString(job.agentId),
			sessionKey: normalizeOptionalString(job.sessionKey)
		}, tryResolveAmbientOwnerAgentId(params.cfg));
		if (!agentId) continue;
		const defaults = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId
		});
		const rawModel = normalizeOptionalString(payload.model) ?? resolveSubagentConfiguredModelSelection({
			cfg: params.cfg,
			agentId
		}) ?? resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model);
		const model = rawModel ? resolveModelRefFromString({
			cfg: params.cfg,
			agentId,
			raw: rawModel,
			defaultProvider: defaults.provider,
			aliasIndex: buildModelAliasIndex({
				cfg: params.cfg,
				agentId,
				defaultProvider: defaults.provider
			})
		})?.ref : defaults;
		if (!model) continue;
		const backendId = resolveCliRuntimeExecutionProvider({
			cfg: params.cfg,
			agentId,
			provider: model.provider,
			modelId: model.model,
			authProfileId: rawModel ? splitTrailingAuthProfile(rawModel).profile : void 0
		}) ?? model.provider;
		if (!resolveCliBackendConfig(backendId, params.cfg, { agentId })?.projectNativeToolAuthority) continue;
		const name = normalizeOptionalString(job.name) ?? normalizeOptionalString(job.id);
		advisories.push([
			`Automation "${name}" has an automatically captured tool list with no native file, command, or web tools.`,
			"Before the native-tool capture fix in 2026.9.x, scheduled jobs could omit these tools. A restricted creator session can produce the same list; deliberately restricted jobs can be left as is.",
			`To change the list, run ${formatCliCommand("openclaw cron edit <id> --tools \"<complete list>\" --json")} from an authorized session that holds the tools. Include every tool the job should retain.`,
			"Doctor --fix does not add missing native tools to this list."
		].join("\n"));
	}
	return advisories;
}
//#endregion
//#region src/commands/doctor/cron/warnings.ts
const LEGACY_WHATSAPP_HEALTH_SCRIPT_RE = /(?:^|\s)(?:"[^"]*ensure-whatsapp\.sh"|'[^']*ensure-whatsapp\.sh'|[^\s#;|&]*ensure-whatsapp\.sh)\b/u;
const CRON_MODEL_OVERRIDE_EXAMPLE_LIMIT = 3;
const CRON_DELIVERY_TARGET_ADVISORY_EXAMPLE_LIMIT = 3;
const CRONTAB_READ_TIMEOUT_MS = 5e3;
function pluralize$1(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function normalizeModelProvider(value) {
	const raw = normalizeOptionalString(value);
	if (!raw) return;
	const slash = raw.indexOf("/");
	if (slash <= 0 || slash >= raw.length - 1) return;
	return raw.slice(0, slash).trim().toLowerCase() || void 0;
}
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
/** Emit a note when cron jobs pin models instead of inheriting the default model. */
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
		const provider = normalizeModelProvider(model) ?? "bare/alias";
		providerCounts.set(provider, (providerCounts.get(provider) ?? 0) + 1);
		const modelKey = normalizeModelMismatchKey(model);
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
		`- ${pluralize$1(overrideCount, "job")} set \`payload.model\` and will not inherit \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`,
		`- Provider namespaces: ${formatSortedCounts(providerCounts)}`
	];
	if (mismatchCount > 0) {
		lines.push(`- ${pluralize$1(mismatchCount, "job")} ${mismatchCount === 1 ? "uses" : "use"} a different model than \`agents.defaults.model\`${defaultModel ? ` (${defaultModel})` : ""}`);
		lines.push(`- Examples: ${mismatchExamples.join(", ")}`);
	}
	lines.push(`Review with ${formatCliCommand("openclaw automations list")} and ${formatCliCommand("openclaw automations show <job-id>")}; remove \`payload.model\` from jobs that should inherit the default.`);
	note(lines.join("\n"), "Cron");
}
/** Canonicalizes a channel id/alias for comparison, falling back to lowercase for external plugin ids. */
function canonicalChannelKey(value) {
	return normalizeChatChannelId(value) ?? value.trim().toLowerCase();
}
/** Collects the concrete announce channels cron jobs pin, skipping pseudo/relative targets. */
function listConcreteCronDeliveryTargets(jobs) {
	const targets = [];
	for (const job of jobs) {
		if (job.enabled === false) continue;
		if (!isRecord(job.delivery)) continue;
		const plan = resolveCronDeliveryPlan(job);
		if (plan.mode !== "announce" || !plan.channel || plan.channel === "last") continue;
		targets.push({
			channel: plan.channel,
			job
		});
	}
	return targets;
}
/**
* Builds an advisory when persisted cron jobs announce to a concrete channel whose plugin
* is not active in the current config, so their next scheduled run will fail-closed on
* delivery. Pseudo/relative targets (announce-to-`last`, webhook, `none`) are skipped because
* they resolve at run time. Observer-only: it never repairs jobs or writes config. The channel
* list is resolved lazily so doctor skips the read-only channel snapshot when no job can drift.
* Returns `null` when no job pins a concrete target or every concrete target is active.
*/
function collectCronDeliveryTargetAdvisory(params) {
	const concreteTargets = listConcreteCronDeliveryTargets(params.jobs);
	if (concreteTargets.length === 0) return null;
	const availableKeys = /* @__PURE__ */ new Set();
	for (const id of params.resolveAvailableChannelIds()) {
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
		`- ${pluralize$1(unavailableCount, "job")} ${unavailableCount === 1 ? "announces" : "announce"} to a channel whose plugin is not active; the next scheduled run will fail to deliver`,
		`- Channels: ${formatSortedCounts(channelCounts)}`,
		`- Examples: ${examples.join(", ")}`,
		`Reactivate the channel plugin or update the job's \`delivery.channel\` after reviewing with ${formatCliCommand("openclaw automations list")} and ${formatCliCommand("openclaw automations show <job-id>")}.`
	].join("\n");
}
/** Emit a note when cron jobs announce to a concrete channel whose plugin is not active. */
function noteCronDeliveryTargetAdvisory(params) {
	let advisory;
	try {
		advisory = collectCronDeliveryTargetAdvisory({
			jobs: params.jobs,
			resolveAvailableChannelIds: () => listReadOnlyChannelPluginsForConfig(params.cfg, {
				includePersistedAuthState: false,
				includeSetupFallbackPlugins: true
			}).map((plugin) => plugin.id)
		});
	} catch {
		return;
	}
	if (advisory) note(advisory, "Cron");
}
async function readUserCrontab() {
	const result = await runExec("crontab", ["-l"], {
		logOutput: false,
		timeoutMs: CRONTAB_READ_TIMEOUT_MS
	});
	return {
		stdout: result.stdout,
		stderr: result.stderr
	};
}
function coerceCrontabText(crontab) {
	if (typeof crontab === "string") return crontab;
	if (crontab == null) return "";
	if (typeof crontab === "number" || typeof crontab === "boolean" || typeof crontab === "bigint") return String(crontab);
	return "";
}
function findLegacyWhatsAppHealthCrontabLines(crontab) {
	return coerceCrontabText(crontab).split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0 && !line.startsWith("#")).filter((line) => LEGACY_WHATSAPP_HEALTH_SCRIPT_RE.test(line));
}
/** Return a warning when the user's crontab still runs the old WhatsApp health script. */
async function collectLegacyWhatsAppCrontabHealthWarning(params = {}) {
	if ((params.platform ?? process.platform) !== "linux") return null;
	let crontab;
	try {
		crontab = (await (params.readCrontab ?? readUserCrontab)()).stdout;
	} catch {
		return null;
	}
	const legacyLines = findLegacyWhatsAppHealthCrontabLines(crontab);
	if (legacyLines.length === 0) return null;
	return [
		"Legacy WhatsApp crontab health check detected.",
		"`~/.openclaw/bin/ensure-whatsapp.sh` is not maintained by current OpenClaw and can misreport `Gateway inactive` from cron when the systemd user bus environment is missing.",
		`Remove the stale crontab entry with ${formatCliCommand("crontab -e")}; use ${formatCliCommand("openclaw channels status --probe")}, ${formatCliCommand("openclaw doctor")}, and ${formatCliCommand("openclaw gateway status")} for current health checks.`,
		`Matched ${pluralize$1(legacyLines.length, "entry")}.`
	].join("\n");
}
/** Emit the legacy WhatsApp crontab warning when present. */
async function noteLegacyWhatsAppCrontabHealthCheck(params = {}) {
	const warning = await collectLegacyWhatsAppCrontabHealthWarning(params);
	if (warning) note(warning, "Cron");
}
//#endregion
//#region src/commands/doctor/cron/index.ts
function pluralize(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
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
	const { storePath, legacyStoreDetected, legacyRunLogDetected, legacyQuarantine, legacyImportCount, rawJobs } = state;
	const sqliteStorePath = resolveOpenClawStateSqlitePath();
	try {
		const quarantine = loadCronQuarantinedJobs(storePath);
		if (quarantine.length > 0) findings.push(legacyCronStoreFinding({
			message: `${pluralize(quarantine.length, "quarantined cron job row")} found in SQLite at ${shortenHomePath(sqliteStorePath)}.`,
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
	if (legacyStoreDetected) findings.push(legacyCronStoreFinding({
		message: legacyImportCount > 0 ? `${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite.` : `Legacy JSON cron store was found at ${shortenHomePath(storePath)}.`,
		path: storePath,
		requirement: "legacy-cron-store"
	}));
	if (legacyRunLogDetected) findings.push(legacyCronStoreFinding({
		message: `Legacy JSON cron run logs will be imported into SQLite for ${shortenHomePath(storePath)}.`,
		path: storePath,
		requirement: "legacy-cron-run-logs"
	}));
	if (rawJobs.length === 0) return findings;
	for (const message of collectCronNativeToolAdvisories({
		cfg: params.cfg,
		jobs: rawJobs
	})) findings.push(legacyCronStoreFinding({
		message,
		path: sqliteStorePath,
		requirement: "cron-native-tool-cap-review",
		fixHint: "Review the job's tools from an authorized session; Doctor will not add native tools."
	}));
	const normalized = normalizeStoredCronJobs(rawJobs);
	for (const line of formatLegacyIssuePreview(normalized.issues)) findings.push(legacyCronStoreFinding({
		message: line.replace(/^- /u, ""),
		path: sqliteStorePath,
		requirement: "legacy-cron-store-shape"
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
		message: `${pluralize(names.length, "tool-bearing automation")} ${description}.`,
		path: sqliteStorePath,
		requirement,
		fixHint: `Review with ${formatCliCommand("openclaw automations list --all")} and reauthorize with ${formatCliCommand("openclaw automations edit <id> --tools <tool,...>")}.`
	}));
	if (normalized.legacyGatewayExecJobs.length > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(normalized.legacyGatewayExecJobs.length, "automation")} require recreation because they grant the retired \`gateway_exec\` alias.`,
		path: sqliteStorePath,
		requirement: "legacy-gateway-exec-recreation",
		fixHint: "Review the affected jobs with `openclaw automations list --all`, then recreate each one from a fresh authenticated creator turn or explicitly reauthorize its complete tool cap from a trusted operator shell."
	}));
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	if (notifyCount > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(notifyCount, "job")} still uses legacy notify webhook fallback.`,
		path: sqliteStorePath,
		requirement: "legacy-notify-fallback"
	}));
	const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
	if (dreamingStaleCount > 0) findings.push(legacyCronStoreFinding({
		message: `${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape.`,
		path: sqliteStorePath,
		requirement: "legacy-dreaming-payload"
	}));
	return findings;
}
function noteLegacyCronRepairResult(result) {
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
/** Inspect cron storage and optionally repair legacy JSON/SQLite/payload shapes. */
async function maybeRepairLegacyCronStore(params) {
	let state;
	try {
		state = await loadLegacyCronRepairState({ cfg: params.cfg });
	} catch (err) {
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
	const { storePath, legacyStoreDetected, legacyRunLogDetected, legacyQuarantine, legacyImportCount, invalidConfigRows, persistedQuarantine, rawJobs } = state;
	const revalidatableQuarantineCount = persistedQuarantine.filter((entry) => entry.reason === "invalid-schedule" && entry.job).length;
	const sqliteStorePath = resolveOpenClawStateSqlitePath();
	try {
		const quarantine = loadCronQuarantinedJobs(storePath);
		if (quarantine.length > 0) note([
			`Quarantined cron job rows found in SQLite at ${shortenHomePath(sqliteStorePath)}.`,
			`- ${pluralize(quarantine.length, "row")} was removed from the active cron store after runtime validation failed.`,
			"- Review or repair quarantined rows before restoring any job to the active cron store."
		].join("\n"), "Cron");
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		const reason = err instanceof Error ? err.message : String(err);
		note([`Unable to read quarantined cron rows in SQLite at ${shortenHomePath(sqliteStorePath)}.`, `- ${reason}`].join("\n"), "Cron");
	}
	if (rawJobs.length === 0) {
		if (!legacyStoreDetected && !legacyRunLogDetected && !legacyQuarantine && invalidConfigRows.length === 0 && revalidatableQuarantineCount === 0) return;
		const previewLines = [];
		if (legacyStoreDetected) previewLines.push("- legacy JSON cron store will be archived after SQLite migration");
		if (legacyRunLogDetected) previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
		if (legacyQuarantine) previewLines.push("- legacy JSON cron quarantine will be imported into SQLite");
		if (invalidConfigRows.length > 0) previewLines.push(`- ${pluralize(invalidConfigRows.length, "malformed cron row")} will be quarantined in SQLite`);
		if (revalidatableQuarantineCount > 0) previewLines.push(`- ${pluralize(revalidatableQuarantineCount, "quarantined automation")} will be revalidated and restored only if current validation passes`);
		const noteHeading = legacyStoreDetected || legacyRunLogDetected || legacyQuarantine ? `Legacy cron storage detected at ${shortenHomePath(storePath)}.` : `Cron store issues detected at ${shortenHomePath(sqliteStorePath)}.`;
		note([
			noteHeading,
			...previewLines,
			`Repair with ${formatCliCommand("openclaw doctor --fix")} to finish the migration.`
		].join("\n"), "Cron");
		if (!await params.prompter.confirm({
			message: "Repair legacy cron jobs now?",
			initialValue: true
		})) return;
		noteLegacyCronRepairResult(await applyLegacyCronStoreRepair({
			cfg: params.cfg,
			state,
			recoverQuarantinedScheduleJobs: true
		}));
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
	for (const message of collectCronNativeToolAdvisories({
		cfg: params.cfg,
		jobs: rawJobs
	})) note(message, "Cron");
	const inFlightCount = countInFlightCronJobs(rawJobs);
	if (inFlightCount > 0) {
		const subject = inFlightCount === 1 ? "it" : "them";
		note([
			`${pluralize(inFlightCount, "automation")} ${inFlightCount === 1 ? "is" : "are"} still marked in-flight (\`state.runningAtMs\` is set).`,
			`- If no gateway is currently executing ${subject}, the marker is left over from an interrupted run; the gateway marks such runs interrupted the next time it starts.`,
			`- Review with ${formatCliCommand("openclaw automations list --all")} or ${formatCliCommand("openclaw automations show <id>")}.`
		].join("\n"), "Cron");
	}
	const chronicFailureCount = countChronicallyFailingCronJobs(rawJobs);
	if (chronicFailureCount > 0) note([
		`${pluralize(chronicFailureCount, "automation")} ${chronicFailureCount === 1 ? "has" : "have"} failed ${CHRONIC_FAILURE_MIN_CONSECUTIVE_ERRORS}+ runs in a row (\`state.consecutiveErrors\`), so the scheduler only re-fires ${chronicFailureCount === 1 ? "it" : "them"} on error backoff.`,
		`- The count resets on the next successful run and also counts runs interrupted by a gateway restart, so a lasting streak means repeated task failures, repeatedly interrupted runs, or a mix. Failure alerts are opt-in, so this may be the only notice.`,
		`- Review with ${formatCliCommand("openclaw automations list")} or ${formatCliCommand("openclaw automations show <id>")}.`
	].join("\n"), "Cron");
	const autoDisabledJobs = collectAutoDisabledCronJobs(rawJobs);
	if (autoDisabledJobs.length > 0) note([`${pluralize(autoDisabledJobs.length, "automation")} ${autoDisabledJobs.length === 1 ? "is" : "are"} auto-disabled after repeated failures.`, ...autoDisabledJobs.map((job) => `- ${job.name} (${job.id}): recorded reason \`${job.reason}\` after ${job.consecutiveErrors} consecutive errors. Fix the cause, then re-enable with ${formatCliCommand(`openclaw automations enable ${job.id}`)}.`)].join("\n"), "Cron");
	const normalized = normalizeStoredCronJobs(rawJobs);
	if (normalized.unsupportedLegacyTriggerScriptJobs.length > 0) note([
		"Legacy cron trigger scripts cannot be safely migrated automatically:",
		...normalized.unsupportedLegacyTriggerScriptJobs.map((job) => `- ${job}`),
		"Inspect each automation and update its trigger script manually to use direct tool calls."
	].join("\n"), "Cron");
	const notifyCount = rawJobs.filter((job) => job.notify === true).length;
	const dreamingStaleCount = countStaleDreamingJobs(rawJobs);
	const commandPromptAdvisory = formatUnresolvedCommandPromptAdvisory(normalized.unresolvedAgentTurnCommandPromptJobs);
	if (commandPromptAdvisory) note(commandPromptAdvisory, "Cron");
	const shellPromptAdvisory = formatUnresolvedShellPromptAdvisory(normalized.unresolvedAgentTurnShellToolPromptJobs);
	if (shellPromptAdvisory) note(shellPromptAdvisory, "Cron");
	const scheduledToolPolicyAdvisory = formatScheduledToolPolicyAdvisory({
		legacyJobs: normalized.legacyScheduledToolPolicyJobs,
		invalidJobs: normalized.invalidScheduledToolPolicyJobs
	});
	if (scheduledToolPolicyAdvisory) note(scheduledToolPolicyAdvisory, "Cron");
	const legacyGatewayExecAdvisory = formatLegacyGatewayExecAdvisory(normalized.legacyGatewayExecJobs);
	if (legacyGatewayExecAdvisory) note(legacyGatewayExecAdvisory, "Cron");
	const staticMcpByAgentWorkspace = /* @__PURE__ */ new Map();
	const incompleteInheritedAuthorityAdvisory = formatIncompleteInheritedAuthorityAdvisory(rawJobs.filter((job) => {
		const payload = isRecord(job.payload) ? job.payload : void 0;
		const provenance = isRecord(job.toolsAllowProvenance) ? job.toolsAllowProvenance : void 0;
		if (payload?.toolsAllowIsDefault !== true || provenance?.version === 1 && provenance.source === "final-executable-surface") return false;
		const agentId = typeof job.agentId === "string" && job.agentId.trim() ? job.agentId.trim() : tryResolveAmbientOwnerAgentId(params.cfg);
		if (!agentId) return false;
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
		const cacheKey = `${agentId}\0${workspaceDir}`;
		let hasStaticMcp = staticMcpByAgentWorkspace.get(cacheKey);
		if (hasStaticMcp === void 0) {
			hasStaticMcp = resolveStaticSessionMcpServerNames({
				workspaceDir,
				cfg: params.cfg,
				toolOverrides: resolveCodexMcpToolOverridesForAgent(params.cfg, {
					agentId,
					toolOverrides: void 0
				})
			}).length > 0;
			staticMcpByAgentWorkspace.set(cacheKey, hasStaticMcp);
		}
		return hasStaticMcp;
	}).map((job) => typeof job.name === "string" && job.name.trim() ? job.name.trim() : typeof job.id === "string" ? job.id : "unknown automation"));
	if (incompleteInheritedAuthorityAdvisory) note(incompleteInheritedAuthorityAdvisory, "Cron");
	const previewLines = formatLegacyIssuePreview(normalized.issues);
	if (normalized.legacyTriggerScriptJobs.length > 0) previewLines.push(`- ${pluralize(normalized.legacyTriggerScriptJobs.length, "legacy cron trigger script")} will be migrated to direct tool calls: ${normalized.legacyTriggerScriptJobs.join(", ")}`);
	if (legacyStoreDetected) previewLines.unshift(legacyImportCount > 0 ? `- ${pluralize(legacyImportCount, "legacy JSON cron job")} will be imported into SQLite` : "- legacy JSON cron store will be archived after SQLite migration");
	if (legacyRunLogDetected) previewLines.push("- legacy JSON cron run logs will be imported into SQLite");
	if (legacyQuarantine) previewLines.push("- legacy JSON cron quarantine will be imported into SQLite");
	if (invalidConfigRows.length > 0) previewLines.push(`- ${pluralize(invalidConfigRows.length, "malformed cron row")} will be quarantined in SQLite`);
	if (revalidatableQuarantineCount > 0) previewLines.push(`- ${pluralize(revalidatableQuarantineCount, "quarantined automation")} will be revalidated and restored only if current validation passes`);
	if (notifyCount > 0) previewLines.push(`- ${pluralize(notifyCount, "job")} still uses legacy \`notify: true\` webhook fallback`);
	if (dreamingStaleCount > 0) previewLines.push(`- ${pluralize(dreamingStaleCount, "managed dreaming job")} still has the legacy heartbeat-coupled shape`);
	if (previewLines.length === 0 && !legacyStoreDetected) return;
	const noteHeading = legacyStoreDetected ? `Legacy cron job storage detected at ${shortenHomePath(storePath)}.` : `Cron store issues detected at ${shortenHomePath(resolveOpenClawStateSqlitePath())}.`;
	note([
		noteHeading,
		...previewLines,
		`Repair with ${formatCliCommand("openclaw doctor --fix")} to normalize the store before the next scheduler run.`
	].join("\n"), "Cron");
	if (!await params.prompter.confirm({
		message: "Repair legacy cron jobs now?",
		initialValue: true
	})) return;
	noteLegacyCronRepairResult(await applyLegacyCronStoreRepair({
		cfg: params.cfg,
		state,
		normalized,
		recoverQuarantinedScheduleJobs: true
	}));
}
//#endregion
export { collectLegacyCronStoreHealthFindings, collectLegacyWhatsAppCrontabHealthWarning, maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck };
