import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { f as resolveConfiguredAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { a as isImplicitLocalGatewayTargetFromCli, n as callGatewayFromCli } from "./gateway-rpc-DXO3PHhc.mjs";
import { i as executeGitCommand } from "./git-exec-B6ZpVpQV.mjs";
import { r as listCronJobsFromGateway } from "./list-jobs-DVm3xLFY.mjs";
import { u as resolveRequiredBackupPath } from "./backup-shared-CDd4btcJ.mjs";
import { t as GIT_BACKUP_PUSH_CREDENTIAL_WARNING } from "./backup-git-D2B9yn_m.mjs";
import { n as SCHEDULED_BACKUP_DECLARATION_KEY, t as SCHEDULED_BACKUP_COMMAND } from "./backup-command-IVzAG_2T.mjs";
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
function buildScheduledArgv(options, repositoryPath, redactSecrets) {
	const agent = options.agent?.trim();
	if (options.agent !== void 0 && !agent) throw new Error("--agent must not be blank");
	if (options.globalOnly && agent) throw new Error("Use either --global-only or --agent <id>, not both.");
	const agentId = agent ? resolveConfiguredAgentId(getRuntimeConfig({ skipPluginValidation: true }), normalizeAgentId(agent)) : void 0;
	return [
		...SCHEDULED_BACKUP_COMMAND,
		"--repository",
		repositoryPath,
		...options.globalOnly ? ["--global"] : agentId ? ["--agent", agentId] : ["--all"],
		...options.push ? ["--push"] : [],
		...redactSecrets ? ["--exclude-secrets"] : []
	];
}
async function assertLocalGatewayScheduleTarget(options) {
	if (!await isImplicitLocalGatewayTargetFromCli(options)) throw new Error(LOCAL_GATEWAY_REQUIRED_ERROR);
}
async function backupEnableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	const repositoryPath = resolveRequiredBackupPath(options.repository, "--repository");
	const every = options.every?.trim() ?? "24h";
	const everyMs = parseDurationMs(every, { defaultUnit: "ms" });
	if (!Number.isSafeInteger(everyMs) || everyMs <= 0) throw new Error("--every must be a positive duration such as 6h or 24h.");
	const redactSecrets = resolveScheduledRedaction(options);
	const spec = {
		declarationKey: SCHEDULED_BACKUP_DECLARATION_KEY,
		name: SCHEDULED_BACKUP_DECLARATION_KEY,
		enabled: true,
		schedule: {
			kind: "every",
			everyMs
		},
		sessionTarget: "isolated",
		wakeMode: "now",
		payload: {
			kind: "command",
			argv: buildScheduledArgv(options, repositoryPath, redactSecrets)
		},
		delivery: { mode: "none" }
	};
	if (options.push) {
		if ((await executeGitCommand(repositoryPath, [
			"remote",
			"get-url",
			"origin"
		])).code !== 0) throw new Error(`--push requires an origin remote. Run: openclaw backup git init --repository ${shortenHomePath(repositoryPath)} --remote <url>`);
		if (!redactSecrets) runtime.error(GIT_BACKUP_PUSH_CREDENTIAL_WARNING);
	}
	const result = await callGatewayFromCli("cron.add", options, spec);
	const id = result.job?.id;
	if (!id) throw new Error("cron.add returned no scheduled backup job id.");
	const updated = result.created === false;
	runtime.log(`Scheduled Git backups ${updated ? "updated" : "enabled"}: every ${every} to ${shortenHomePath(repositoryPath)}`);
	return {
		id,
		updated
	};
}
async function backupDisableCommand(runtime, options) {
	await assertLocalGatewayScheduleTarget(options);
	const { jobs } = await listCronJobsFromGateway(options, { includeDisabled: true });
	const existing = jobs.find((job) => job.declarationKey === SCHEDULED_BACKUP_DECLARATION_KEY);
	if (!existing) {
		runtime.log("Scheduled Git backups are already disabled.");
		return { removed: false };
	}
	await callGatewayFromCli("cron.remove", options, { id: existing.id });
	runtime.log("Scheduled Git backups disabled.");
	return { removed: true };
}
//#endregion
export { backupDisableCommand, backupEnableCommand };
