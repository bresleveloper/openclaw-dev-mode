import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { C as resolveIsNixMode, o as isDefaultInstallIdentity } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { c as normalizeUpdateChannel, f as resolveUpdateChannelDisplay } from "./update-channels-BquD107I.mjs";
import "./npm-install-env-CROOzau_.mjs";
import { i as formatGitInstallLabel, t as checkUpdateStatus } from "./update-check-eI0vGW6V.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { c as readDeferredPluginMigrations, r as formatDeferredPluginMigration } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { r as validateConfigObjectRaw } from "./validation-core-DxMw-ato.mjs";
import { g as readSourceConfigBestEffort } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { a as renderUpdateRunReport } from "./update-run-report-C8yK_gib.mjs";
import { r as readPackageActivationReceipt } from "./package-update-activation-B8eAkK7X.mjs";
import { c as parseUpdateTimeoutMs, p as resolveUpdateRoot } from "./shared-CiAI6uii.mjs";
import { s as readUpdateChannelConfig } from "./update-command-config-DVVxubY4.mjs";
import { n as resolveGatewayService } from "./service-CCUynFdj.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-CvWMfO8o.mjs";
import { n as auditGatewayServiceConfig } from "./service-audit-DHuHgBps.mjs";
import { s as readGatewayLastInstallationReplacement } from "./gateway-boot-lifecycle-d7mP4u6P.mjs";
import { n as readSessionSqliteMigrationWarnings } from "./doctor-session-sqlite-warnings-C0LhVsyY.mjs";
import { t as collectNodeRuntimeFindings } from "./node-runtime-diagnostics-yzIhwSa8.mjs";
import { a as resolveUpdateAvailability, i as resolveStatusRegistryUpdateChannel, n as formatUpdateOneLiner, t as formatUpdateAvailableHint } from "./status.update-B3BIlw-v.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-Dg9paCEi.mjs";
import { t as readUpdateRunStatus } from "./update-run-status-CM6y9pqw.mjs";
//#region src/cli/update-cli/status.ts
async function readUpdateRecoverySetStatus() {
	try {
		const { inspectUpdateRecoveryBackups } = await import("./update-recovery-backup-status-CENaQet1.mjs");
		return { recoverySets: (await inspectUpdateRecoveryBackups()).map((set) => set.status === "incomplete" ? {
			directory: set.directory,
			status: set.status,
			message: set.message,
			nextAction: set.nextAction
		} : {
			runId: set.runId,
			manifestPath: set.ref.manifestPath,
			status: set.status,
			message: set.message,
			nextAction: set.nextAction
		}) };
	} catch (error) {
		return { recoverySetsError: formatErrorMessage(error) };
	}
}
async function readChannelStatusIssues(config, timeoutMs = 5e3) {
	try {
		const [{ callGateway }, { collectChannelStatusIssues }] = await Promise.all([import("./call-CWvmXO5x.mjs"), import("./channels-status-issues-DT4ijIEc.mjs")]);
		return collectChannelStatusIssues(await callGateway({
			method: "channels.status",
			params: {
				probe: false,
				timeoutMs
			},
			timeoutMs,
			config,
			sharedStateMode: "read-only"
		}), []);
	} catch {
		return [];
	}
}
async function updateStatusCommand(opts) {
	const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
	const [root, config, runtimeFindings] = await Promise.all([
		resolveUpdateRoot(),
		readSourceConfigBestEffort(),
		collectNodeRuntimeFindings()
	]);
	const configChannel = normalizeUpdateChannel(config.update?.channel);
	const gitTargetChannel = opts.json && (configChannel === "stable" || configChannel === "beta") ? await readUpdateChannelConfig(false).then(({ storedChannel }) => storedChannel).catch(() => null) : null;
	const [update, channelIssues] = await Promise.all([checkUpdateStatus({
		root,
		timeoutMs,
		fetchGit: true,
		useDetachedDevUpstream: configChannel === "dev",
		includeRegistry: true,
		resolveRegistryChannel: ({ installKind, git }) => resolveStatusRegistryUpdateChannel({
			configChannel,
			installKind,
			git
		})
	}), readChannelStatusIssues(config, timeoutMs)]);
	const git = update.git;
	const currentSha = git?.sha;
	const preferredTarget = update.installKind === "git" && git && currentSha && git.dirty === false && (gitTargetChannel === "stable" || gitTargetChannel === "beta") ? await import("./update-runner-git-target-CqTQYKLU.mjs").then(({ readPreferredGitChannelTarget }) => readPreferredGitChannelTarget({
		root: git.root,
		sha: currentSha,
		channel: gitTargetChannel,
		timeoutMs: timeoutMs ?? 3e5
	})).catch(() => void 0) : void 0;
	const channelInfo = resolveUpdateChannelDisplay({
		configChannel,
		currentVersion: VERSION,
		installKind: update.installKind,
		gitTag: update.git?.tag ?? null,
		gitBranch: update.git?.branch ?? null
	});
	const channelLabel = channelInfo.label;
	const updateAvailability = resolveUpdateAvailability(update);
	const runStatus = await readUpdateRunStatus();
	const recoveryStatus = await readUpdateRecoverySetStatus();
	const activeRun = "activeRun" in runStatus ? runStatus.activeRun : void 0;
	const updateInProgress = !("runStatusError" in runStatus) && activeRun && !runStatus.staleRun && !runStatus.abandonedRun;
	const safeMessage = (message) => sanitizeTerminalText(redactSensitiveText(message, { mode: "tools" }));
	const configValidation = validateConfigObjectRaw(config);
	const configWarnings = configValidation.ok ? [] : [...formatConfigIssueLines(configValidation.issues, "", { normalizeRoot: true }), "Run openclaw doctor --fix to repair the configuration."].map(safeMessage);
	const replacement = config.gateway?.mode === "remote" ? void 0 : readGatewayLastInstallationReplacement();
	const lastGatewayInstallationReplacement = replacement ? {
		...replacement,
		reason: safeMessage(replacement.reason)
	} : void 0;
	let serviceDefinition;
	if (config.gateway?.mode !== "remote" && isDefaultInstallIdentity(process.env) && !resolveIsNixMode(process.env)) try {
		const command = await resolveGatewayService().readCommand(process.env, {
			requireEffective: true,
			timeoutMs
		});
		if (command) {
			const audit = await auditGatewayServiceConfig({
				env: process.env,
				command,
				timeoutMs
			});
			serviceDefinition = {
				drift: audit.definitionDrift ?? [],
				warnings: [...(audit.definitionDrift ?? []).map((fact) => fact.message), ...audit.definitionDriftError ? [audit.definitionDriftError] : []].map(safeMessage)
			};
		}
	} catch (error) {
		serviceDefinition = {
			drift: [],
			warnings: [safeMessage(`Service definition inspection failed: ${formatErrorMessage(error)}`)]
		};
	}
	const safeChannelIssues = channelIssues.map((issue) => Object.assign({}, issue, {
		channel: safeMessage(issue.channel),
		accountId: safeMessage(issue.accountId),
		message: safeMessage(issue.message),
		...issue.fix ? { fix: safeMessage(issue.fix) } : {}
	}));
	const migrationWarnings = [];
	const migrationWarningErrors = [];
	for (const readWarnings of [() => readDeferredPluginMigrations().map((pending) => formatDeferredPluginMigration(pending, updateInProgress ? {
		...process.env,
		OPENCLAW_UPDATE_IN_PROGRESS: "1"
	} : process.env)), () => readSessionSqliteMigrationWarnings()]) try {
		migrationWarnings.push(...readWarnings().map(safeMessage));
	} catch (error) {
		migrationWarningErrors.push(safeMessage(formatErrorMessage(error)));
	}
	const migrationWarningsError = migrationWarningErrors.join("\n");
	let packageActivation;
	let packageActivationError;
	try {
		if (root) packageActivation = readPackageActivationReceipt(resolveUpdateInstallRoot(root));
	} catch (error) {
		packageActivationError = safeMessage(formatErrorMessage(error));
	}
	if (opts.json) {
		defaultRuntime.writeJson({
			update: preferredTarget ? {
				...update,
				git: {
					...update.git,
					preferredTarget
				}
			} : update,
			channel: {
				value: channelInfo.channel,
				source: channelInfo.source,
				label: channelLabel,
				config: configChannel
			},
			availability: updateAvailability,
			...runtimeFindings.length > 0 ? { runtimeFindings } : {},
			...serviceDefinition ? { serviceDefinition } : {},
			...lastGatewayInstallationReplacement ? { lastGatewayInstallationReplacement } : {},
			...safeChannelIssues.length > 0 ? { channelIssues: safeChannelIssues } : {},
			...migrationWarnings.length > 0 ? { migrationWarnings } : {},
			...migrationWarningsError ? { migrationWarningsError } : {},
			...runStatus,
			...packageActivation ? { packageActivation } : {},
			...packageActivationError ? { packageActivationError } : {},
			...recoveryStatus,
			...configWarnings.length > 0 ? { configWarnings } : {}
		});
		return;
	}
	const gitLabel = formatGitInstallLabel(update);
	const updateLine = formatUpdateOneLiner(update).replace(/^Update:\s*/i, "");
	const tableWidth = getTerminalTableWidth();
	const rows = [
		{
			Item: "Install",
			Value: update.installKind === "host" ? update.installOwner?.displayName ?? "host-managed" : update.installKind === "immutable" ? `immutable (${update.immutable?.root ?? update.root ?? "unknown"})` : update.installKind === "git" ? `git (${update.root ?? "unknown"})` : update.installKind === "package" ? update.packageManager : "unknown"
		},
		{
			Item: "Channel",
			Value: channelLabel
		},
		...update.immutable ? [{
			Item: "Immutable activation",
			Value: update.immutable.activation ? `${update.immutable.activation.phase} (${update.immutable.activation.operationId})` : update.immutable.activationEnabled ? "enabled" : "preparation only"
		}] : [],
		...packageActivation ? [{
			Item: "Package recovery",
			Value: `${packageActivation.phase} (${packageActivation.operationId})`
		}] : [],
		...packageActivation?.recoveryCommand ? [{
			Item: "Recovery command (external Node)",
			Value: packageActivation.recoveryCommand
		}] : [],
		...packageActivationError ? [{
			Item: "Package recovery",
			Value: packageActivationError
		}] : [],
		...gitLabel ? [{
			Item: "Git",
			Value: gitLabel
		}] : [],
		{
			Item: "Update",
			Value: activeRun ? updateInProgress ? `in progress · ${activeRun.phase}` : "needs attention · see run details below" : updateAvailability.available ? theme.warn(`available · ${updateLine}`) : updateLine
		}
	];
	defaultRuntime.log(theme.heading("OpenClaw update status"));
	defaultRuntime.log("");
	for (const finding of runtimeFindings) {
		const color = finding.severity === "error" ? theme.error : finding.severity === "warning" ? theme.warn : theme.muted;
		defaultRuntime.log(color(finding.message));
		if (finding.fixHint) defaultRuntime.log(finding.fixHint);
		defaultRuntime.log("");
	}
	defaultRuntime.log(renderTable({
		width: tableWidth,
		columns: [{
			key: "Item",
			header: "Item",
			minWidth: 10
		}, {
			key: "Value",
			header: "Value",
			flex: true,
			minWidth: 24
		}],
		rows
	}).trimEnd());
	defaultRuntime.log("");
	if (lastGatewayInstallationReplacement) {
		const { reason, completedAtMs } = lastGatewayInstallationReplacement;
		defaultRuntime.log(`Previous Gateway installation replacement (${new Date(completedAtMs).toISOString()}): ${reason}`);
		defaultRuntime.log("");
	}
	for (const warning of serviceDefinition?.warnings ?? []) defaultRuntime.log(theme.warn(`Warning: ${warning}`));
	for (const issue of safeChannelIssues) {
		defaultRuntime.log(theme.warn(`Channel ${issue.channel} ${issue.accountId}: ${issue.message}`));
		if (issue.fix) defaultRuntime.log(issue.fix);
	}
	if (safeChannelIssues.length > 0) defaultRuntime.log("");
	for (const warning of migrationWarnings) defaultRuntime.log(theme.warn(`Warning: ${warning}`));
	if (migrationWarningsError) defaultRuntime.log(theme.warn(`Pending migration status unavailable: ${migrationWarningsError}`));
	if (migrationWarnings.length > 0 || migrationWarningsError) defaultRuntime.log("");
	if ("runReconciliationError" in runStatus) {
		defaultRuntime.log(theme.warn(`Update run reconciliation failed: ${runStatus.runReconciliationError}`));
		defaultRuntime.log("");
	}
	if ("runStatusError" in runStatus) {
		defaultRuntime.log(theme.warn(`Update run status unavailable: ${runStatus.runStatusError}`));
		defaultRuntime.log("");
	} else {
		const { lastRun, staleRun, abandonedRun, advisories } = runStatus;
		const run = activeRun ?? lastRun;
		for (const advisory of advisories ?? []) if (advisory.runId !== run?.runId) defaultRuntime.log(advisory.message);
		if (run) {
			if (!activeRun) defaultRuntime.log(`Last recorded update (${new Date(run.createdAtMs).toISOString()}):`);
			if (staleRun) defaultRuntime.log(`Update ${run.runId}: ${staleRun.guidance}`);
			if (abandonedRun) defaultRuntime.log("Abandoned update detected; the Gateway will reconcile its recorded outcome. Run openclaw update repair to reconcile it now.");
			const report = renderUpdateRunReport(run, run.status === "failed" ? { currentHealth: await readUpdateRunReportHealth(run.verification, { timeoutMs }) } : {});
			if (!abandonedRun && !staleRun) defaultRuntime.log(report.headline);
			for (const line of report.lines) defaultRuntime.log(line);
			defaultRuntime.log("");
		}
	}
	if ("recoverySetsError" in recoveryStatus) {
		defaultRuntime.log(theme.warn(safeMessage(`Update recovery sets unavailable: ${recoveryStatus.recoverySetsError}`)));
		defaultRuntime.log("");
	} else for (const set of recoveryStatus.recoverySets) {
		if (set.status === "incomplete") {
			defaultRuntime.log("Update capture: incomplete");
			defaultRuntime.log(safeMessage(set.directory));
		} else {
			const label = set.status === "manual" ? "Doctor capture" : "Update recovery set";
			defaultRuntime.log(safeMessage(`${label} ${set.runId}: ${set.status}`));
			defaultRuntime.log(safeMessage(set.manifestPath));
		}
		defaultRuntime.log(safeMessage(set.message));
		defaultRuntime.log(safeMessage(`Next action: ${set.nextAction}`));
		defaultRuntime.log("");
	}
	const updateHint = activeRun ? null : formatUpdateAvailableHint(update);
	if (updateHint) defaultRuntime.log(theme.warn(updateHint));
	for (const warning of configWarnings) defaultRuntime.log(theme.warn(`Warning: ${warning}`));
}
//#endregion
export { updateStatusCommand };
