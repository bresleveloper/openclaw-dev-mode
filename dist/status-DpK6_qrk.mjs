import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { C as resolveIsNixMode, o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { c as normalizeUpdateChannel, d as resolveUpdateChannelDisplay } from "./update-channels-l0GQCX9n.mjs";
import { r as validateConfigObjectRaw } from "./validation-core-ezn1vWYO.mjs";
import { n as formatConfigIssueLines } from "./issue-format-Cu1pIc3h.mjs";
import { l as readDeferredPluginMigrationsAsync, r as formatDeferredPluginMigration } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { m as readSourceConfigBestEffort } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import "./npm-install-env-B76s0YXJ.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { i as formatGitInstallLabel, t as checkUpdateStatus } from "./update-check-hpRujh0z.mjs";
import { a as renderUpdateRunReport } from "./update-run-report-rePuji8s.mjs";
import { r as readPackageActivationReceipt } from "./package-update-activation-Bm88ttku.mjs";
import { c as parseUpdateTimeoutMs, p as resolveUpdateRoot } from "./shared-DRiGAorf.mjs";
import { s as readUpdateChannelConfig } from "./update-command-config-CDBhVGHw.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { n as auditGatewayServiceConfig } from "./service-audit-C97Wl6Zv.mjs";
import { o as readGatewayLastInstallationReplacement } from "./gateway-boot-lifecycle-B_E2PbYI.mjs";
import { n as readSessionSqliteMigrationWarnings } from "./doctor-session-sqlite-warnings-DAoplGKm.mjs";
import { t as collectNodeRuntimeFindings } from "./node-runtime-diagnostics-zqUVmxFt.mjs";
import { a as resolveUpdateAvailability, i as resolveStatusRegistryUpdateChannel, n as formatUpdateOneLiner, t as formatUpdateAvailableHint } from "./status.update-CEoOwwR9.mjs";
import { t as readUpdateRunReportHealth } from "./update-run-report-health-Ben2oLtO.mjs";
import { t as readUpdateRunStatus } from "./update-run-status-b2QdJHBV.mjs";
//#region src/cli/update-cli/status.ts
async function readUpdateRecoverySetStatus() {
	try {
		const { inspectUpdateRecoveryBackups } = await import("./update-recovery-backup-status-B5Z6mKAK.mjs");
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
		const [{ callGateway }, { collectChannelStatusIssues }, { loadDeviceIdentityIfPresent }] = await Promise.all([
			import("./call-BvbeEASg.mjs"),
			import("./channels-status-issues-Cw8Fz09f.mjs"),
			import("./device-identity-BlNncs5x.mjs")
		]);
		return collectChannelStatusIssues(await callGateway({
			method: "channels.status",
			params: {
				probe: false,
				timeoutMs
			},
			timeoutMs,
			config,
			sharedStateMode: "read-only",
			deviceIdentity: loadDeviceIdentityIfPresent()
		}), []);
	} catch {
		return [];
	}
}
async function updateStatusCommand(opts) {
	return await withArtifactPreservingStateReads(() => inspectUpdateStatus(opts));
}
async function inspectUpdateStatus(opts) {
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
	const preferredTarget = update.installKind === "git" && git && currentSha && git.dirty === false && (gitTargetChannel === "stable" || gitTargetChannel === "beta") ? await import("./update-runner-git-target-4yi-krJQ.mjs").then(({ readPreferredGitChannelTarget }) => readPreferredGitChannelTarget({
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
	let immutableCoverage;
	let immutableCoverageLines = [];
	if (update.immutable) try {
		const { inspectImmutableUpdateCoverage, formatImmutableUpdateCoverage } = await import("./update-immutable-inspection-CSHsVfmi.mjs");
		immutableCoverage = await inspectImmutableUpdateCoverage({ root: update.immutable.root });
		immutableCoverageLines = formatImmutableUpdateCoverage(immutableCoverage);
	} catch (error) {
		immutableCoverageLines = [`Immutable coverage unavailable: ${formatErrorMessage(error)}`];
	}
	const runStatus = await readUpdateRunStatus();
	const recoveryStatus = await readUpdateRecoverySetStatus();
	const activeRun = "activeRun" in runStatus ? runStatus.activeRun : void 0;
	const updateInProgress = !("runStatusError" in runStatus) && activeRun && !runStatus.staleRun && !runStatus.abandonedRun;
	const safeMessage = (message) => sanitizeTerminalText(redactSensitiveText(message, { mode: "tools" }));
	const printWarning = (message) => defaultRuntime.log(theme.warn(message));
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
	for (const readWarnings of [async () => (await readDeferredPluginMigrationsAsync()).map((pending) => formatDeferredPluginMigration(pending, updateInProgress ? {
		...process.env,
		OPENCLAW_UPDATE_IN_PROGRESS: "1"
	} : process.env)), () => readSessionSqliteMigrationWarnings()]) try {
		migrationWarnings.push(...(await readWarnings()).map(safeMessage));
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
			...immutableCoverage ? { immutableCoverage } : {},
			...update.immutable && !immutableCoverage ? { immutableCoverageError: immutableCoverageLines[0] } : {},
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
	const installLabel = update.installKind === "host" ? update.installOwner?.displayName ?? "host-managed" : update.installKind === "immutable" ? `immutable (${update.immutable?.root ?? update.root ?? "unknown"})` : update.installKind === "git" ? `git (${update.root ?? "unknown"})` : update.installKind === "package" ? update.packageManager : "unknown";
	const immutable = update.immutable;
	const activation = immutable?.activation;
	const lastActivation = immutable?.lastActivation;
	const verifiedGateway = lastActivation?.gateway;
	const rows = [
		{
			Item: "Install",
			Value: installLabel
		},
		{
			Item: "Channel",
			Value: channelLabel
		},
		...immutable ? [{
			Item: "Immutable activation",
			Value: activation ? `pending recovery · ${activation.phase} (${activation.operationId})` : immutable.activationEnabled ? "enabled" : "preparation only"
		}] : [],
		...activation?.failure ? [{
			Item: "Immutable failure",
			Value: activation.failure
		}] : [],
		...activation?.recoveryCommand ? [{
			Item: "Recovery command (external Node)",
			Value: activation.recoveryCommand
		}] : [],
		...lastActivation ? [{
			Item: "Last immutable activation",
			Value: `${lastActivation.outcome === "succeeded" ? "accepted" : "restored"} · ${lastActivation.selectedSha} · verified ${new Date(lastActivation.verifiedAtMs).toISOString()} (${lastActivation.operationId})`
		}] : [],
		...verifiedGateway ? [{
			Item: "Last verified Gateway",
			Value: `version ${verifiedGateway.version} · build ${verifiedGateway.buildId} · PID ${verifiedGateway.pid} · boot ${verifiedGateway.bootId}`
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
	for (const line of immutableCoverageLines) defaultRuntime.log(safeMessage(line));
	if (lastGatewayInstallationReplacement) {
		const { reason, completedAtMs } = lastGatewayInstallationReplacement;
		defaultRuntime.log(`Previous Gateway installation replacement (${new Date(completedAtMs).toISOString()}): ${reason}`);
		defaultRuntime.log("");
	}
	for (const warning of serviceDefinition?.warnings ?? []) printWarning(`Warning: ${warning}`);
	for (const issue of safeChannelIssues) {
		printWarning(`Channel ${issue.channel} ${issue.accountId}: ${issue.message}`);
		if (issue.fix) defaultRuntime.log(issue.fix);
	}
	if (safeChannelIssues.length > 0) defaultRuntime.log("");
	for (const warning of migrationWarnings) printWarning(`Warning: ${warning}`);
	if (migrationWarningsError) printWarning(`Pending migration status unavailable: ${migrationWarningsError}`);
	if (migrationWarnings.length > 0 || migrationWarningsError) defaultRuntime.log("");
	if ("runReconciliationError" in runStatus) {
		printWarning(`Update run reconciliation failed: ${runStatus.runReconciliationError}`);
		defaultRuntime.log("");
	}
	if ("runStatusError" in runStatus) {
		printWarning(`Update run status unavailable: ${runStatus.runStatusError}`);
		defaultRuntime.log("");
	} else {
		const { lastRun, staleRun, abandonedRun, advisories } = runStatus;
		const run = activeRun ?? lastRun;
		for (const advisory of advisories ?? []) if (advisory.runId !== run?.runId) defaultRuntime.log(advisory.message);
		if (run) {
			if (!activeRun) defaultRuntime.log(`Last recorded update (${new Date(run.createdAtMs).toISOString()}):`);
			if (staleRun) defaultRuntime.log(`Update ${run.runId}: ${staleRun.guidance}`);
			if (abandonedRun) defaultRuntime.log(`Abandoned update detected; the Gateway will reconcile its recorded outcome. Stop the Gateway first (${formatCliCommand("openclaw gateway stop")}), then run ${formatCliCommand("openclaw update repair")} to reconcile it now.`);
			const report = renderUpdateRunReport(run, run.status === "failed" ? { currentHealth: await readUpdateRunReportHealth(run.verification, { timeoutMs }) } : {});
			if (!abandonedRun && !staleRun) defaultRuntime.log(report.headline);
			for (const line of report.lines) defaultRuntime.log(line);
			defaultRuntime.log("");
		}
	}
	if ("recoverySetsError" in recoveryStatus) {
		printWarning(safeMessage(`Update recovery sets unavailable: ${recoveryStatus.recoverySetsError}`));
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
	if (updateHint) printWarning(updateHint);
	for (const warning of configWarnings) printWarning(`Warning: ${warning}`);
}
//#endregion
export { updateStatusCommand };
