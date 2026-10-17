import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { i as executeGitCommand } from "./git-exec-rH66305f.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as resolveConfiguredAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { a as isImplicitLocalGatewayTargetFromCli, n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { r as listCronJobsFromGateway } from "./list-jobs-CIWrHtJ_.mjs";
import { u as resolveRequiredBackupPath } from "./backup-shared-B7EKbg00.mjs";
import { i as resolveBackupNamespace, n as normalizeBackupRetention } from "./backup-retention-D0JLSuDB.mjs";
import { t as GIT_BACKUP_PUSH_CREDENTIAL_WARNING } from "./backup-git-ChYmu6Tw.mjs";
import { n as buildBackupScheduleJob, t as backupScheduleModeForDeclaration } from "./backup-command-DM-EcqY5.mjs";
//#region src/commands/backup-schedule.ts
const LOCAL_GATEWAY_REQUIRED_ERROR = "backup enable manages backups on the Gateway host and currently requires a local Gateway. Create the cron job manually with openclaw cron add for remote Gateways.";
/**
* Unattended pushed schedules make credential retention durable in remote
* history, so they redact by default; --include-secrets is the explicit
* full-fidelity override. Local (non-push) schedules keep full fidelity for
* complete restores.
*/
function resolveScheduledRedaction(options) {
	if (options.excludeSecrets && options.includeSecrets) throw new Error("Use either --exclude-secrets or --include-secrets, not both.");
	if (!options.push) return options.excludeSecrets === true;
	return options.includeSecrets !== true;
}
function resolveScheduleSpec(options, everyMs) {
	if (options.to !== void 0) {
		if (options.repository !== void 0 || options.push || options.excludeSecrets || options.includeSecrets || options.globalOnly || options.agent !== void 0) throw new Error("--to cannot be combined with Git backup options (--repository, --push, --exclude-secrets, --include-secrets, --global-only, --agent).");
		const location = options.to.trim();
		if (!location) throw new Error("--to must name a configured storage location.");
		if (!getRuntimeConfig({ skipPluginValidation: true }).storage?.locations?.[location]) throw new Error(`Storage location "${location}" is not configured. Run openclaw storage list.`);
		return {
			mode: "offsite",
			everyMs,
			location,
			namespace: resolveBackupNamespace(options.namespace),
			claimNamespace: options.claimNamespace === true,
			includeWorkspace: options.includeWorkspace !== false,
			...normalizeBackupRetention(options)
		};
	}
	if (options.namespace !== void 0 || options.claimNamespace || options.includeWorkspace === false || options.keepDaily !== void 0 || options.keepWeekly !== void 0 || options.keepMonthly !== void 0) throw new Error("--namespace, --claim-namespace, --no-include-workspace, and --keep-* require --to <location>.");
	const repository = resolveRequiredBackupPath(options.repository, "--repository");
	const agent = options.agent?.trim();
	if (options.agent !== void 0 && !agent) throw new Error("--agent must not be blank");
	if (options.globalOnly && agent) throw new Error("Use either --global-only or --agent <id>, not both.");
	const agentId = agent ? resolveConfiguredAgentId(getRuntimeConfig({ skipPluginValidation: true }), normalizeAgentId(agent)) : void 0;
	return {
		mode: "git",
		everyMs,
		repository,
		scope: options.globalOnly ? { kind: "global" } : agentId ? {
			kind: "agent",
			agentId
		} : { kind: "all" },
		push: options.push === true,
		excludeSecrets: resolveScheduledRedaction(options)
	};
}
async function assertLocalGatewayScheduleTarget(options) {
	if (!await isImplicitLocalGatewayTargetFromCli(options)) throw new Error(LOCAL_GATEWAY_REQUIRED_ERROR);
}
async function backupEnableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	const every = options.every?.trim() ?? "24h";
	const everyMs = parseDurationMs(every, { defaultUnit: "ms" });
	if (!Number.isSafeInteger(everyMs) || everyMs <= 0) throw new Error("--every must be a positive duration such as 6h or 24h.");
	const spec = resolveScheduleSpec(options, everyMs);
	if (spec.mode === "git" && spec.push) {
		if ((await executeGitCommand(spec.repository, [
			"remote",
			"get-url",
			"origin"
		])).code !== 0) throw new Error(`--push requires an origin remote. Run: openclaw backup git init --repository ${shortenHomePath(spec.repository)} --remote <url>`);
		if (!spec.excludeSecrets) runtime.error(GIT_BACKUP_PUSH_CREDENTIAL_WARNING);
	}
	const result = await callGatewayFromCli("cron.add", options, buildBackupScheduleJob(spec));
	const id = result.job?.id;
	if (!id) throw new Error("cron.add returned no scheduled backup job id.");
	const updated = result.created === false;
	runtime.log(`Scheduled ${spec.mode === "git" ? "Git" : "offsite"} backups ${updated ? "updated" : "enabled"}: every ${every} to ${spec.mode === "git" ? shortenHomePath(spec.repository) : spec.location}`);
	return {
		id,
		updated
	};
}
async function backupDisableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	if (options.git && options.offsite) throw new Error("Use either --git or --offsite, or omit both to disable all backup schedules.");
	const { jobs } = await listCronJobsFromGateway(options, { includeDisabled: true });
	const selectedMode = options.git ? "git" : options.offsite ? "offsite" : void 0;
	const existing = jobs.filter((job) => {
		const mode = backupScheduleModeForDeclaration(job.declarationKey);
		return mode !== void 0 && (selectedMode === void 0 || mode === selectedMode);
	});
	const label = selectedMode === "git" ? "Scheduled Git backups" : selectedMode === "offsite" ? "Scheduled offsite backups" : "Scheduled backups";
	if (existing.length === 0) {
		runtime.log(`${label} are already disabled.`);
		return { removed: false };
	}
	for (const job of existing) await callGatewayFromCli("cron.remove", options, { id: job.id });
	runtime.log(`${label} disabled.`);
	return { removed: true };
}
//#endregion
export { backupDisableCommand, backupEnableCommand };
