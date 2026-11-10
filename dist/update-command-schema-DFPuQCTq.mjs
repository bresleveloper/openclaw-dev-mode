import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isBunRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveNodeVersionManager } from "./version-manager-path-CORhhR2Q.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as SUPPORTED_NODE_VERSION_RANGE, s as formatNodeSecurityWarning } from "./node-version-BfT-yCVT.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-BvDyEHkZ.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as UPDATE_GLOBAL_PERMISSION_REASON, c as createRuntimeUpdateRecoverySteps, u as formatUpdateRecoverySteps } from "./update-outcome-DLbo5ecI.mjs";
import { i as createUpdatePreflightDiagnostics } from "./update-failure-facts-3t5Fm3wV.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { r as withNodeRuntimePath } from "./node-runtime-env-CYkSIfJc.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { b as UpdatePreMutationError, t as canResolveRegistryVersionForPackageTarget } from "./update-global-BlXQRfes.mjs";
import { a as nodeVersionSatisfiesEngine } from "./runtime-guard-BzyF4hYe.mjs";
import { l as recordUpdateRunPhase } from "./update-run-ledger-C3oL-g8r.mjs";
import { i as getUpdateRun } from "./update-run-reader-BOC3s3Sk.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { a as resolveBunRuntimeInfo, o as resolveNodeRuntimeInfo, t as buildRuntimeProbeEnv } from "./runtime-paths-v6m7qRRF.mjs";
import { t as prepareGitCandidateNodeRuntime } from "./update-runner-git-node-preflight-BluX5QoJ.mjs";
import { f as withUpdateCommandExecutorChild } from "./update-command-executor-DUq8yLzH.mjs";
import { u as resolveGitInstallDir } from "./shared-DRiGAorf.mjs";
import { t as createUpdateCommandAuthority } from "./update-command-authority-BUaM9lV-.mjs";
import { r as resolveServiceRecoveryContext } from "./update-command-service-env-Bq_QrqHd.mjs";
import { n as printResult } from "./progress-rcOXmnPk.mjs";
import { a as gatewayServiceCommandUsesRoot, g as tryRealpathOrResolve, s as isGatewayServiceManagementAllowedForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { v as prepareUpdateCommandNativeGate } from "./update-command-verification-D_6SIpZK.mjs";
import { c as readUpdateStateSchemaVersions, u as resolveUpdateStateContentVersion } from "./update-candidate-state-fXM6fMqw.mjs";
import { a as hasSchemaRefusal, i as formatSchemaRefusalLines, o as isCandidateAdmissionContextCovered, r as checkTargetDatabaseSchemasForContexts, t as assertReadableGitMetadata } from "./schema-preflight-Dfpu1-Iv.mjs";
import { r as capturePackageActivationRuntime } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { s as checkGlobalPackageUpdateAdmission } from "./package-update-steps-CyYbYiYK.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { Range, compare, minVersion, satisfies, valid, validRange } from "semver";
//#region src/cli/update-cli/update-command-node-engine.ts
function minimumSupportedNodeVersion(engineRange) {
	const candidate = new Range(engineRange);
	return new Range(SUPPORTED_NODE_VERSION_RANGE).set.flatMap((supported) => candidate.set.flatMap((required) => {
		const intersection = [...supported, ...required].map((entry) => entry.value).join(" ");
		const minimum = minVersion(intersection);
		if (!minimum) return [];
		const release = `${minimum.major}.${minimum.minor}.${minimum.patch}`;
		return satisfies(release, intersection) ? [release] : [];
	})).toSorted(compare)[0];
}
//#endregion
//#region src/cli/update-cli/update-command-runtime-preflight.ts
/** Records a nonblocking Node security recommendation as a passing preflight step. */
function recordNodeSecurityWarning(record, cwd, warning) {
	if (warning) record({
		name: "node-security-patch",
		command: "inspect Node.js security patch level",
		cwd,
		durationMs: 0,
		exitCode: 0,
		warnings: [warning]
	});
}
async function resolvePackageRuntimePreflight(params) {
	return await withCommandProcessScope(async () => {
		const verdict = params.service?.serviceUpdateVerdict;
		const nodeRunner = normalizeOptionalString(params.alreadyCurrent && !(verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) ? params.service?.serviceNodeRunner ?? params.nodeRunner : params.nodeRunner);
		let nodeSecurityWarning = null;
		const unchanged = () => ({
			...nodeRunner ? { nodeRunner } : {},
			...nodeSecurityWarning ? { nodeSecurityWarning } : {}
		});
		let target = params.target;
		if (!target && params.installedRoot) {
			const manifest = asNullableRecord(await tryReadJson(path.join(params.installedRoot, "package.json"), { maxBytes: 1048576 }));
			const version = normalizeOptionalString(manifest?.version);
			if (!version) return err("Cannot inspect the installed OpenClaw runtime requirement; repair its package.json before retrying openclaw update.");
			target = {
				version,
				nodeEngine: normalizeOptionalString(asNullableRecord(manifest?.engines)?.node) ?? null
			};
		}
		if (!target) return ok(unchanged());
		const selected = nodeRunner ?? process.execPath;
		let captureError;
		const captureRuntime = (executable) => {
			try {
				return capturePackageActivationRuntime("node", executable);
			} catch (error) {
				captureError = error;
				return;
			}
		};
		let activationRuntime = captureRuntime(selected);
		if (process.versions.bun && (!nodeRunner || selected === process.execPath || activationRuntime?.path === await tryRealpathOrResolve(process.execPath)) || isBunRuntime(selected)) {
			if (params.engineOnly) return ok(unchanged());
			const runtimeEnv = buildRuntimeProbeEnv(params.service?.serviceEnv ?? process.env);
			try {
				if (!activationRuntime) throw captureError;
				activationRuntime = {
					...activationRuntime,
					kind: "bun",
					env: runtimeEnv
				};
				const runtime = await resolveBunRuntimeInfo(activationRuntime.path, void 0, runtimeEnv);
				if (runtime.status === "probe-failed") throw runtime.error;
				if (runtime.status !== "supported") throw new Error(runtime.sqliteSelectionError ?? "Bun 1.4.4+ with WAL-reset-safe node:sqlite is required.");
				const updater = process.versions.bun ? ok({}) : await resolvePackageRuntimePreflight({
					target,
					timeoutMs: params.timeoutMs
				});
				return updater.ok ? ok({
					...unchanged(),
					activationRuntime,
					targetVersion: target.version
				}) : updater;
			} catch (error) {
				return err(coerceErrorMessage(error));
			}
		}
		const runtime = await resolvePackageRuntimeForPreflight({
			nodeRunner: nodeRunner ? activationRuntime?.path ?? nodeRunner : void 0,
			timeoutMs: params.timeoutMs
		});
		nodeSecurityWarning = formatNodeSecurityWarning(runtime.version);
		const satisfies = runtime.failure && !params.engineOnly ? false : nodeVersionSatisfiesEngine(runtime.version, target.nodeEngine);
		const targetVersion = target.version;
		const runtimeResult = (capturedRuntime, selectedRunner = nodeRunner, replacedNodeRunner) => capturedRuntime ? ok({
			...selectedRunner ? { nodeRunner: selectedRunner } : {},
			...nodeSecurityWarning ? { nodeSecurityWarning } : {},
			activationRuntime: capturedRuntime,
			...replacedNodeRunner ? { replacedNodeRunner } : {},
			targetVersion
		}) : err(coerceErrorMessage(captureError));
		if (satisfies === true) return params.engineOnly ? ok(unchanged()) : runtimeResult(activationRuntime);
		const canRefreshCurrentService = params.service?.running && verdict?.kind === "owned" && verdict.refreshDefinition;
		const canRefreshAtAdmission = !process.versions.bun && params.shouldRestart && params.service?.inspected === true && params.service.runtimeInspected && params.service.serviceMutationAllowed !== false && isGatewayServiceManagementAllowedForUpdate(params.service.serviceEnv ?? process.env) && canRefreshCurrentService && !verdict.requiresInstallRootRefresh && params.root !== void 0 && await tryRealpathOrResolve(verdict.root) === await tryRealpathOrResolve(params.root) && params.service.serviceNodeRunner === nodeRunner;
		const fallbackNodeRunner = params.engineOnly ? canRefreshAtAdmission ? resolveNodeRunner() : void 0 : params.fallbackNodeRunner ?? (params.shouldRestart && !process.versions.bun && nodeRunner && (params.alreadyCurrent ? canRefreshCurrentService : await gatewayServiceCommandUsesRoot({ root: params.root })) ? resolveNodeRunner() : void 0);
		if (nodeRunner && fallbackNodeRunner && fallbackNodeRunner !== nodeRunner) {
			const fallbackActivationRuntime = captureRuntime(fallbackNodeRunner);
			const fallbackRuntime = await resolvePackageRuntimeForPreflight({
				nodeRunner: fallbackActivationRuntime?.path ?? fallbackNodeRunner,
				timeoutMs: params.timeoutMs
			});
			if ((fallbackRuntime.failure ? false : nodeVersionSatisfiesEngine(fallbackRuntime.version, target.nodeEngine)) === true && fallbackActivationRuntime) {
				const current = captureRuntime(fallbackNodeRunner);
				if (current?.path === fallbackActivationRuntime.path && current.identity === fallbackActivationRuntime.identity) {
					nodeSecurityWarning = formatNodeSecurityWarning(fallbackRuntime.version);
					return runtimeResult(fallbackActivationRuntime, fallbackNodeRunner, nodeRunner);
				}
				return err("Selected Node changed during target compatibility probing.");
			}
		}
		if (satisfies !== false) return params.engineOnly ? ok(unchanged()) : runtimeResult(activationRuntime);
		const recovery = params.engineOnly ? canRefreshAtAdmission ? { env: params.service?.serviceEnv ?? process.env } : void 0 : params.runtimeRecovery;
		if (recovery && target.nodeEngine) {
			const { resolveTargetNodeRuntime } = await import("./update-command-node-runtime-resolution-op-pdrh5.mjs");
			const recovered = await resolveTargetNodeRuntime({
				engine: target.nodeEngine,
				recovery,
				timeoutMs: params.timeoutMs
			});
			if (recovered) {
				const recoveredRuntime = captureRuntime(recovered);
				if (!recoveredRuntime) return runtimeResult(recoveredRuntime);
				const probe = await resolvePackageRuntimeForPreflight({
					nodeRunner: recoveredRuntime.path,
					timeoutMs: params.timeoutMs
				});
				const current = captureRuntime(recovered);
				if (!probe.failure && nodeVersionSatisfiesEngine(probe.version, target.nodeEngine) === true && current?.path === recoveredRuntime.path && current.identity === recoveredRuntime.identity) {
					nodeSecurityWarning = formatNodeSecurityWarning(probe.version);
					return runtimeResult(recoveredRuntime, recovered, nodeRunner ?? resolveNodeRunner());
				}
			}
		}
		const runtimePath = runtime.nodeRunner ?? process.execPath;
		const runtimeLabel = `Node ${runtime.version ?? "unknown"} at ${runtimePath}`;
		const recommendation = minimumSupportedNodeVersion((target.nodeEngine ? validRange(target.nodeEngine) : null) ?? "*");
		const requirement = target.nodeEngine ? `Node ${target.nodeEngine}` : "a working Node runtime";
		const context = verdict?.kind === "owned" && params.service?.serviceEnv ? resolveServiceRecoveryContext({
			serviceEnv: params.service.serviceEnv,
			serviceDefinitionEnv: params.service.serviceDefinitionEnv,
			invocationCwd: params.invocationCwd
		}) : void 0;
		const env = context?.env ?? params.service?.serviceEnv ?? process.env;
		const recoveryVersion = valid(targetVersion);
		const recoveryChannel = params.requestedChannel ?? (params.channel === "extended-stable" ? params.channel : void 0);
		const recoveryTarget = [
			"openclaw update",
			recoveryChannel ? `--channel ${recoveryChannel}` : "",
			params.sourceRoot || params.channel === "extended-stable" ? "" : `--tag ${recoveryVersion}`
		].filter(Boolean).join(" ");
		const retainedRoot = params.sourceRoot ?? params.root ?? params.installedRoot;
		const retainedEntry = retainedRoot ? path.resolve(retainedRoot, "openclaw.mjs") : void 0;
		const continuation = retainedEntry ? formatCliCommand(recoveryTarget, env).replace(/^openclaw\b/, () => `node ${process.platform === "win32" ? quotePowerShellArg(retainedEntry) : quoteCliArg(retainedEntry)}`) : void 0;
		const recoverySteps = recommendation && recoveryVersion ? createRuntimeUpdateRecoverySteps({
			nodeVersion: recommendation,
			targetVersion: recoveryVersion,
			manager: resolveNodeVersionManager(await tryRealpathOrResolve(runtime.nodeRunner ?? resolveNodeRunner()), env),
			container: isContainerEnvironment(),
			contextCommand: context?.command,
			continuation
		}) : void 0;
		if (recoverySteps?.at(-1)?.kind === "continue-update" && params.alreadyCurrent && nodeRunner && params.service?.serviceNodeRunner && !canRefreshCurrentService) recoverySteps.splice(-1, 0, {
			kind: "select-runtime",
			instruction: `The Gateway service still selects ${nodeRunner}. Before continuing, have its deployment owner select Node ${recommendation} in the service definition while retaining its installation, service account, and state/config selectors. Switching the shell runtime alone does not update that service definition.`
		});
		const upgrade = recoverySteps ? `Recovery:\n${formatUpdateRecoverySteps(recoverySteps)}` : recommendation ? "Select a published OpenClaw version before installing it under a supported Node runtime." : `No Node version satisfies both this range and this updater's supported range (${SUPPORTED_NODE_VERSION_RANGE}). This candidate version cannot be run by this updater with a supported Node release; install a supported Node and select a compatible OpenClaw target.`;
		const serviceHint = params.engineOnly && nodeRunner ? `Gateway service Node ${runtime.version ?? "unknown"} at ${runtimePath} requires ${target.nodeEngine}. Install ${recommendation ? `Node ${recommendation}` : "a compatible Node runtime"} and update that service definition, then retry; changing the shell's Node alone does not update the service.` : void 0;
		const diagnostics = createUpdatePreflightDiagnostics({
			check: "node-runtime",
			code: "node-runtime-preflight",
			affectedKey: "engines.node",
			required: `openclaw@${targetVersion} ${requirement}`,
			detected: runtimeLabel,
			installRoot: retainedRoot ? await tryRealpathOrResolve(retainedRoot) : void 0,
			binaryPath: retainedEntry,
			gatewayInstall: verdict?.kind === "owned" || verdict?.kind === "unresolved" ? await tryRealpathOrResolve(verdict.root) : void 0,
			remedy: [
				runtime.failure,
				upgrade,
				serviceHint
			].filter(Boolean).join("\n")
		});
		return {
			...recoverySteps ? { recoverySteps } : {},
			...err(diagnostics.message),
			failureFacts: diagnostics.failureFacts.slice(0, 1)
		};
	});
}
async function resolvePackageRuntimeForPreflight(params) {
	const nodeRunner = normalizeOptionalString(params.nodeRunner);
	if (!nodeRunner) {
		const version = process.versions.node ?? null;
		return {
			version,
			failure: nodeRuntimeFailure(version, await detectCurrentSqliteCapabilities())
		};
	}
	const runtime = await resolveNodeRuntimeInfo(nodeRunner, process.env, params.timeoutMs ?? 12e5);
	return {
		version: runtime.status === "probe-failed" ? null : runtime.version,
		failure: runtime.status === "probe-failed" ? runtime.error.message : runtime.capabilityError ?? null,
		nodeRunner
	};
}
//#endregion
//#region src/cli/update-cli/update-command-node-runtime.ts
/** Only a live updater may provision; discovery never reads dotenv-selected paths. */
function createPackageRuntimeRecovery(params) {
	const authority = createUpdateCommandAuthority(params, "Node runtime provisioning");
	const executor = authority.executorFence;
	return {
		env: params.opts.runtimeRecoveryEnv ?? {},
		...executor ? { installCommand: async (command, args, env) => {
			authority.assertCurrent();
			const installResult = await withUpdateCommandExecutorChild(executor, params.root, async (_grant, bindChild) => {
				authority.assertRequesterCurrent();
				const gate = prepareUpdateCommandNativeGate(randomUUID(), [env]);
				const result = await runCommandWithTimeout([
					process.execPath,
					"--input-type=module",
					"-e",
					gate.source,
					"--",
					command,
					...args
				], {
					baseEnv: {},
					env: gate.env,
					cwd: params.root,
					input: gate.input,
					beforeInput: (pid, argv) => {
						authority.assertRequesterCurrent();
						bindChild(pid, argv);
					},
					timeoutMs: params.timeoutMs,
					killProcessTree: true,
					requireProcessTreeExtinction: true,
					maxOutputBytes: 65536
				});
				if (result.cleanup === "forced" || result.cleanup === "uncertain") throw new CommandProcessCleanupError();
				authority.assertRequesterCurrent();
				if (result.code !== 0 || result.termination !== "exit" || result.signal !== null || result.killed || result.cleanup !== "normal" && result.cleanup !== "cooperative" || result.outputLimitExceeded || result.outputErrorStream) throw new Error("Private Node runtime provisioning did not complete successfully.");
				return result;
			}, { auxiliaryPreflight: true });
			authority.assertCurrent();
			return installResult.code;
		} } : {}
	};
}
/** The same target-runtime owner serves admitted updates and target-owned initialization. */
async function preparePackageUpdateRuntime(params) {
	const managedServiceNodeRunner = params.managedService?.serviceNodeRunner ?? params.managedServiceNodeRunner;
	const canRefreshManagedServiceNode = params.shouldRestart && params.managedService?.serviceUpdateVerdict?.kind === "owned" && params.managedService.serviceUpdateVerdict.refreshDefinition && params.managedService.serviceMutationAllowed !== false;
	const fence = await params.executor.enter(params.root, {
		preflight: true,
		serviceRoot: params.managedServiceRoot
	});
	if (params.opts.run) params.opts.run.executorFence = fence;
	await params.assertPackageRuntimeCurrent?.();
	const result = await resolvePackageRuntimePreflight({
		root: params.root,
		service: params.managedService,
		shouldRestart: params.shouldRestart,
		invocationCwd: params.invocationCwd,
		channel: params.channel,
		requestedChannel: params.requestedChannel,
		target: params.packageRuntimeTarget,
		installedRoot: params.root,
		timeoutMs: params.timeoutMs,
		nodeRunner: params.admittedPackageRuntime?.path ?? (params.managedServiceRoot && canRefreshManagedServiceNode ? params.packageUpdateNodeRunner : managedServiceNodeRunner ?? params.packageUpdateNodeRunner),
		fallbackNodeRunner: canRefreshManagedServiceNode && !process.versions.bun ? resolveNodeRunner() : void 0,
		runtimeRecovery: !params.admittedPackageRuntime && (!managedServiceNodeRunner || canRefreshManagedServiceNode) ? createPackageRuntimeRecovery({
			root: params.root,
			opts: params.opts,
			timeoutMs: params.timeoutMs,
			executorFence: fence
		}) : void 0
	});
	fence.assertCurrent();
	await params.assertPackageRuntimeCurrent?.();
	if (result.ok) {
		if (params.admittedPackageRuntime) {
			result.value.activationRuntime = params.admittedPackageRuntime;
			if (managedServiceNodeRunner && managedServiceNodeRunner !== result.value.nodeRunner) result.value.replacedNodeRunner = managedServiceNodeRunner;
		}
		if (result.value.nodeSecurityWarning && result.value.nodeSecurityWarning !== (process.versions.bun ? null : formatNodeSecurityWarning(process.versions.node))) defaultRuntime.error(`SECURITY WARNING: ${result.value.nodeSecurityWarning}`);
		if (params.packageInstallEnv && result.value.nodeRunner) Object.assign(params.packageInstallEnv, withNodeRuntimePath(params.packageInstallEnv, result.value.nodeRunner));
		const selection = result.value;
		if (selection.replacedNodeRunner && !params.opts.json) {
			defaultRuntime.log(theme.warn(`Managed gateway service Node (${selection.replacedNodeRunner}) cannot run openclaw@${selection.targetVersion ?? params.tag}.`));
			defaultRuntime.log(theme.muted(`Using compatible Node (${selection.nodeRunner}) for the update and managed service refresh.`));
		}
	}
	return result;
}
//#endregion
//#region src/cli/update-cli/update-command-dry-run.ts
async function handleDryRunPreflightError(error, notes, refuseUpdate) {
	if (!(error instanceof UpdatePreMutationError)) throw error;
	if (error.reason === "database-schema-preflight" || error.reason === "target-metadata-preflight" || error.reason === "invalid-config" || error.reason === "config-read-failed") notes.push(error.message.replace(/^Update refused:/u, "Would refuse update:"));
	else await refuseUpdate(error.reason, error.message, error.failureFacts, error.recoverySteps);
	return {
		incompatible: [],
		indeterminate: []
	};
}
async function printUpdateDryRun(params) {
	const actions = [];
	if (params.requestedChannel && params.requestedChannel !== params.storedChannel) actions.push(`Persist update.channel=${params.requestedChannel} in config`);
	if (params.switchToGit) actions.push("Switch install mode from package to git checkout (dev channel)");
	else if (params.switchToPackage) actions.push(`Switch install mode from git to package manager (${params.mode})`);
	else if (params.updateInstallKind === "git") actions.push(`Run git update flow on channel ${params.channel} (fetch/rebase/build/doctor)`);
	else if (params.packageAlreadyCurrent) actions.push(`Refresh package install with spec ${params.packageInstallSpec ?? params.tag}; current version already matches ${params.targetVersion}`);
	else actions.push(`Run global package manager update with spec ${params.packageInstallSpec ?? params.tag}`);
	actions.push("Run plugin update sync after core update");
	actions.push("Refresh shell completion cache (if needed)");
	actions.push(params.shouldRestart ? "Restart gateway service and run doctor checks" : "Skip restart (because --no-restart is set)");
	const notes = [...params.preflightNotes ?? []];
	if (params.opts.tag && params.updateInstallKind === "git") notes.push("--tag applies to npm installs only; git updates ignore it.");
	if (params.fallbackToLatest) notes.push("Beta channel resolves to latest for this run (fallback).");
	if (params.managedServiceRoot) actions.push(`Rebind the managed Gateway from ${params.managedServiceRoot} to ${params.root} after verification.`);
	if (params.managedServiceRootRedirect) notes.push(`Package update targets managed service root ${params.managedServiceRootRedirect.root} instead of invoking root ${params.managedServiceRootRedirect.previousRoot}.`);
	if (params.explicitTag && !canResolveRegistryVersionForPackageTarget(params.tag)) notes.push("Non-registry package specs skip npm version lookup and downgrade previews.");
	if (hasSchemaRefusal(params.packageSchemaPreflight)) notes.push(...formatSchemaRefusalLines(params.packageSchemaPreflight, true));
	if (params.updateInstallKind === "git") notes.push("Git preview does not execute target scripts or select a build-tested development fallback. The real update repeats database admission before executing each update.");
	const run = getUpdateRun(params.runId, { env: params.opts.run?.env });
	const targetVersionReason = params.targetVersion ? void 0 : params.updateInstallKind === "git" ? "Git dry-runs do not select a build-tested target version." : canResolveRegistryVersionForPackageTarget(params.packageInstallSpec ?? params.tag) ? "The package target version could not be resolved." : "The package artifact is not staged during a dry-run.";
	const preview = {
		runId: params.runId,
		run,
		dryRun: true,
		root: params.root,
		installKind: params.installKind,
		mode: params.mode,
		updateInstallKind: params.updateInstallKind,
		switchToGit: params.switchToGit,
		switchToPackage: params.switchToPackage,
		restart: params.shouldRestart,
		requestedChannel: params.requestedChannel,
		storedChannel: params.storedChannel,
		effectiveChannel: params.channel,
		tag: params.packageInstallSpec ?? params.tag,
		currentVersion: run?.before?.version ?? params.currentVersion,
		targetVersion: params.targetVersion,
		...targetVersionReason ? { targetVersionReason } : {},
		downgradeRisk: params.downgradeRisk,
		actions,
		notes,
		...params.preflightFailures?.length ? { failures: params.preflightFailures } : {}
	};
	if (params.opts.json) defaultRuntime.writeJson(preview);
	else {
		defaultRuntime.log(theme.heading("Update dry-run"));
		defaultRuntime.log(theme.muted("No changes were applied."));
		defaultRuntime.log("");
		defaultRuntime.log(`  Root: ${theme.muted(preview.root)}`);
		defaultRuntime.log(`  Install kind: ${theme.muted(preview.installKind)}`);
		defaultRuntime.log(`  Mode: ${theme.muted(preview.mode)}`);
		defaultRuntime.log(`  Channel: ${theme.muted(preview.effectiveChannel)}`);
		defaultRuntime.log(`  Tag/spec: ${theme.muted(preview.tag)}`);
		if (preview.currentVersion) defaultRuntime.log(`  Current version: ${theme.muted(preview.currentVersion)}`);
		if (preview.targetVersion) defaultRuntime.log(`  Target version: ${theme.muted(preview.targetVersion)}`);
		else if (preview.targetVersionReason) defaultRuntime.log(`  Target version: unresolved (${preview.targetVersionReason})`);
		if (preview.downgradeRisk) defaultRuntime.log(theme.warn("  Downgrade confirmation would be required in a real run."));
		const printSection = (heading, lines, format = (line) => line) => {
			defaultRuntime.log("");
			defaultRuntime.log(theme.heading(heading));
			for (const line of lines) defaultRuntime.log(`  - ${format(line)}`);
		};
		printSection("Planned actions:", preview.actions);
		if (preview.notes.length > 0) printSection("Notes:", preview.notes, theme.muted);
		await printResult({
			runId: params.runId,
			status: "skipped",
			mode: params.mode,
			reason: "dry-run",
			steps: [],
			durationMs: 0
		}, params.opts);
	}
}
//#endregion
//#region src/cli/update-cli/update-command-schema.ts
/** Render prepared preview facts without initializing runtime state. */
async function previewUpdateCommand(params) {
	const { target, prepared, opts } = params;
	const preflight = params.preflight ?? await preflightUpdateCommandSchemas({
		...target,
		shouldRestart: prepared.shouldRestart,
		updateStepTimeoutMs: params.updateStepTimeoutMs,
		invocationCwd: params.invocationCwd,
		packageTargetVersion: target.targetVersion ?? void 0,
		opts,
		expectedForeground: prepared.controlPlaneUpdateSentinelMeta?.completionOwner === "gateway-restart" || void 0
	});
	if (preflight) {
		preflight.preflightNotes.push(...prepared.packageActivationNotes ?? []);
		if (prepared.nodeSecurityWarning) preflight.preflightNotes.push(`SECURITY WARNING: ${prepared.nodeSecurityWarning}`);
		if (target.inspectionWarning) preflight.preflightNotes.push(target.inspectionWarning);
		if (target.packageInstallTarget && !target.packageAlreadyCurrent && preflight.preflightFailures.length === 0) {
			const admission = await checkGlobalPackageUpdateAdmission(target.packageInstallTarget, await readPackageName(target.packageInstallTarget.packageRoot ?? target.root) ?? "openclaw");
			if (admission?.stderrTail) {
				preflight.preflightFailures.push({
					reason: admission.name === "package-permissions" ? UPDATE_GLOBAL_PERMISSION_REASON : admission.name,
					message: admission.stderrTail,
					failureFacts: admission.failureFacts
				});
				preflight.preflightNotes.push(`Would refuse update: ${admission.stderrTail}`);
			}
		}
		await printUpdateDryRun({
			...target,
			...preflight,
			runId: params.runId,
			installKind: prepared.installKind,
			mode: target.updateInstallKind === "git" ? "git" : target.packageInstallTarget?.manager ?? "unknown",
			shouldRestart: prepared.shouldRestart,
			requestedChannel: prepared.requestedChannel,
			opts
		});
	}
}
/** Record validation, then inspect package admission or Git previews before mutation. */
async function preflightUpdateCommandSchemas(params) {
	const { root, updateInstallKind, switchToGit, shouldRestart, updateStepTimeoutMs, invocationCwd, managedServiceRootRedirect, channel, devTarget, packageTargetSchemaVersions, opts, refuseUpdate } = params;
	const run = opts.run;
	const candidateAdmissionChecks = updateInstallKind === "package" && !opts.dryRun ? params.candidateAdmissionChecks ?? run?.candidateAdmissionChecks : void 0;
	if (run) recordUpdateRunPhase(run.runId, "validating", void 0, { env: run.env });
	let packageSchemaPreflight = {
		incompatible: [],
		indeterminate: []
	};
	const preflightNotes = [];
	const preflightFailures = [];
	let service;
	if ((opts.dryRun || updateInstallKind === "package") && updateInstallKind !== "unknown") try {
		const { inspectUpdateDatabaseContexts } = await import("./update-command-database-context-BrHPoL6g.mjs");
		const { inspectGitDryRunTargetSchemaVersions } = await import("./update-command-git-DAPC2Drn.mjs");
		const admission = await inspectUpdateDatabaseContexts({
			roots: switchToGit ? [root, resolveGitInstallDir()] : [root],
			updateInstallKind,
			shouldRestart,
			jsonMode: Boolean(opts.json),
			timeoutMs: updateStepTimeoutMs,
			invocationCwd,
			managedServiceRootRedirect,
			managedServiceRoot: params.managedServiceRoot,
			legacyConfigPlan: params.legacyConfigPlan,
			callerLegacyConfigPlan: params.callerLegacyConfigPlan,
			candidateAdmissionChecks,
			expectedForeground: params.expectedForeground || run?.completionOwner === "gateway-restart" || void 0
		});
		service = admission.foreground ? void 0 : admission.service ?? admission.services.get(root);
		for (const inspectedService of admission.services.values()) if (inspectedService.serviceUpdateVerdict?.kind === "unavailable") preflightNotes.push(inspectedService.serviceUpdateVerdict.message);
		else if (inspectedService.serviceUpdateVerdict?.kind === "owned" && inspectedService.serviceUpdateVerdict.requiresInstallRootRefresh) preflightNotes.push(`Gateway service targets ${inspectedService.serviceUpdateVerdict.root}; ${shouldRestart ? "would reconcile it with" : `restart is disabled; run ${formatCliCommand("openclaw doctor --fix", inspectedService.serviceEnv)} to reconcile it with`} the active installation ${root}.`);
		const target = updateInstallKind === "git" ? await inspectGitDryRunTargetSchemaVersions({
			root: switchToGit ? resolveGitInstallDir() : root,
			timeoutMs: updateStepTimeoutMs,
			channel,
			devTarget
		}) : { schemaVersions: packageTargetSchemaVersions };
		if ("metadataUnreadable" in target && target.metadataUnreadable) {
			preflightNotes.push("Node compatibility was not checked because the Git target metadata is unavailable.");
			assertReadableGitMetadata(target.metadataUnreadable, "failureCode" in target && target.failureCode ? target.failureCode : void 0);
		}
		const installedContexts = candidateAdmissionChecks?.includes("database-schema") ? admission.contexts.filter((context) => !isCandidateAdmissionContextCovered(context.env)) : admission.contexts;
		packageSchemaPreflight = await checkTargetDatabaseSchemasForContexts(target.schemaVersions, installedContexts);
		if (opts.dryRun && updateInstallKind === "git") {
			if ("nodeEngine" in target && target.nodeEngine) {
				preflightNotes.push(`Selected Git target requires Node ${target.nodeEngine}.`);
				const runtime = await prepareGitCandidateNodeRuntime(root, process.env, "package-tooling", target.nodeEngine);
				if (runtime.step) {
					const message = [runtime.step.stdoutTail, runtime.step.stderrTail].filter(Boolean).join("\n");
					preflightFailures.push({
						reason: "preflight-node-runtime-incompatible",
						message
					});
					preflightNotes.push(`Would refuse update: ${message}`);
				}
			} else preflightNotes.push("Node compatibility was not checked because the Git target does not declare engines.node.");
		}
		if (opts.dryRun && updateInstallKind === "package") {
			const engineOnly = !params.packageAlreadyCurrent && Boolean(params.packageRuntimeTarget?.nodeEngine) && canResolveRegistryVersionForPackageTarget(params.packageInstallSpec ?? "");
			const runtime = await resolvePackageRuntimePreflight({
				...params,
				engineOnly,
				target: params.packageRuntimeTarget,
				nodeRunner: params.managedServiceNodeRunner,
				timeoutMs: updateStepTimeoutMs,
				alreadyCurrent: params.packageAlreadyCurrent,
				service,
				installedRoot: params.packageAlreadyCurrent ? root : void 0
			});
			if (!runtime.ok) {
				preflightNotes.push(`Would refuse update: ${runtime.error}`);
				preflightFailures.push({
					reason: engineOnly ? "preflight-node-runtime-incompatible" : "node-runtime-preflight",
					message: runtime.error,
					failureFacts: runtime.failureFacts,
					recoverySteps: runtime.recoverySteps
				});
			} else if (runtime.value.replacedNodeRunner) preflightNotes.push(`Would replace managed gateway service Node (${runtime.value.replacedNodeRunner}) with current Node (${runtime.value.nodeRunner}) for openclaw@${runtime.value.targetVersion}.`);
			if (runtime.ok && runtime.value.nodeSecurityWarning) preflightNotes.push(`SECURITY WARNING: ${runtime.value.nodeSecurityWarning}`);
			if (params.packageInstallSpec && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec)) preflightNotes.push("Configured plugin availability will be checked against the staged package before update checks or activation; this preview does not stage the target.");
			else {
				const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-G9u29LUh.mjs");
				const context = admission.contexts.at(-1);
				const pluginWarnings = await preflightConfiguredNpmPluginTargets({
					config: context.configSnapshot.sourceConfig,
					env: context.env,
					targetVersion: params.packageTargetVersion ?? null,
					channel,
					timeoutMs: updateStepTimeoutMs
				});
				preflightNotes.push(...pluginWarnings.map((warning) => warning.message));
			}
		}
	} catch (error) {
		if (!opts.dryRun) {
			if (error instanceof UpdatePreMutationError) {
				await refuseUpdate(error.reason, error.message, error.failureFacts, error.recoverySteps);
				return;
			}
			throw error;
		}
		packageSchemaPreflight = await handleDryRunPreflightError(error, preflightNotes, refuseUpdate);
		if (error instanceof UpdatePreMutationError && error.reason === "target-metadata-preflight") preflightFailures.push({
			reason: error.reason,
			message: error.message,
			failureFacts: error.failureFacts
		});
	}
	if (!opts.dryRun && hasSchemaRefusal(packageSchemaPreflight)) {
		await refuseUpdate("database-schema-preflight", formatSchemaRefusalLines(packageSchemaPreflight).join("\n"));
		return;
	}
	return {
		packageSchemaPreflight,
		preflightNotes,
		preflightFailures,
		service
	};
}
async function captureUpdateActivationSchemas(params) {
	const previousSchemaVersions = parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(params.root, "package.json")));
	const schemaVersions = params.candidateSchemaVersions ? await readUpdateStateSchemaVersions({
		stateDir: resolveStateDir(params.env),
		config: params.config,
		env: params.env,
		timeoutMs: params.timeoutMs
	}) : void 0;
	const { run, candidateSchemaVersions, gatewayRestartCompletion } = params;
	if (run?.completionOwner === "gateway-restart" && !gatewayRestartCompletion && candidateSchemaVersions) {
		const sharedPath = resolveOpenClawStateSqlitePath(run.env);
		if (schemaVersions?.some((entry) => {
			const version = resolveUpdateStateContentVersion(entry);
			return version !== null && version !== candidateSchemaVersions[entry.path === sharedPath ? "state" : "agent"];
		})) throw new UpdatePreMutationError("target-native-unsupported", "Target runtime cannot preserve the foreground Gateway's completion owner after state migration; refusing activation.");
	}
	return {
		previousSchemaVersions,
		schemaVersions
	};
}
//#endregion
export { preparePackageUpdateRuntime as a, createPackageRuntimeRecovery as i, preflightUpdateCommandSchemas as n, recordNodeSecurityWarning as o, previewUpdateCommand as r, resolvePackageRuntimePreflight as s, captureUpdateActivationSchemas as t };
