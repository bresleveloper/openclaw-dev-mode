import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolveNodeVersionManager } from "./version-manager-path-CORhhR2Q.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as SUPPORTED_NODE_VERSION_RANGE } from "./node-version-DdJ6cN09.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as CommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as withNodeRuntimePath } from "./node-runtime-env-Biflw58A.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { f as createUpdatePreflightFailure } from "./service-inspection-error-Bsltcpi4.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { t as canResolveRegistryVersionForPackageTarget } from "./update-global-rkW-mKvG.mjs";
import { a as nodeVersionSatisfiesEngine } from "./runtime-guard-BoZCdLcu.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { a as UPDATE_GLOBAL_PERMISSION_REASON, c as createRuntimeUpdateRecoverySteps, u as formatUpdateRecoverySteps } from "./update-outcome-BHX5xsqd.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { l as recordUpdateRunPhase } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as getUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { d as withUpdateCommandExecutorChild } from "./update-command-executor-C94Zye_E.mjs";
import { n as UpdatePreMutationError, u as resolveGitInstallDir } from "./shared-D-l8dmoD.mjs";
import { t as createUpdateCommandAuthority } from "./update-command-authority-BrcSIUcQ.mjs";
import { r as resolveServiceRecoveryContext } from "./update-command-service-env-lR0aWgPL.mjs";
import { a as resolveBunRuntimeInfo, o as resolveNodeRuntimeInfo, t as buildRuntimeProbeEnv } from "./runtime-paths-D7k3lrcM.mjs";
import { n as printResult } from "./progress-BdyrcKI6.mjs";
import { a as gatewayServiceCommandUsesRoot, m as tryRealpathOrResolve } from "./update-command-service-plan-VzuhDrTH.mjs";
import { v as prepareUpdateCommandNativeGate } from "./update-command-verification-vVqHGRJB.mjs";
import { c as readUpdateStateSchemaVersions, u as resolveUpdateStateContentVersion } from "./update-candidate-state-CO0vwfHU.mjs";
import { a as isCandidateAdmissionContextCovered, i as hasSchemaRefusal, n as checkTargetDatabaseSchemasForContexts, r as formatSchemaRefusalLines } from "./schema-preflight-Cj5ktU_q.mjs";
import { o as checkGlobalPackageUpdatePermissions } from "./package-update-steps-DQ5EiA1a.mjs";
import { r as capturePackageActivationRuntime } from "./package-update-activation-paths-D77TjCW-.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
async function resolvePackageRuntimePreflight(params) {
	return await withCommandProcessScope(async () => {
		const verdict = params.service?.serviceUpdateVerdict;
		const nodeRunner = normalizeOptionalString(params.alreadyCurrent && !(verdict?.kind === "owned" && verdict.requiresInstallRootRefresh) ? params.service?.serviceNodeRunner ?? params.nodeRunner : params.nodeRunner);
		const unchanged = () => nodeRunner ? { nodeRunner } : {};
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
		let activationRuntime;
		let captureError;
		try {
			activationRuntime = capturePackageActivationRuntime("node", selected);
		} catch (error) {
			captureError = error;
		}
		if (process.versions.bun && (!nodeRunner || selected === process.execPath || activationRuntime?.path === await tryRealpathOrResolve(process.execPath)) || isBunRuntime(selected)) {
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
				if (runtime.status !== "supported") throw new Error(runtime.sqliteSelectionError ?? "Bun 1.4+ with WAL-reset-safe node:sqlite is required.");
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
				return err(error instanceof Error ? error.message : String(error));
			}
		}
		const runtime = await resolvePackageRuntimeForPreflight({
			nodeRunner: nodeRunner ? activationRuntime?.path ?? nodeRunner : void 0,
			timeoutMs: params.timeoutMs
		});
		const satisfies = runtime.failure ? false : nodeVersionSatisfiesEngine(runtime.version, target.nodeEngine);
		const targetVersion = target.version;
		const unchangedRuntime = {
			...unchanged(),
			activationRuntime,
			targetVersion
		};
		if (satisfies === true) {
			if (!activationRuntime) return err(captureError instanceof Error ? captureError.message : String(captureError));
			return ok(unchangedRuntime);
		}
		const canRefreshCurrentService = params.service?.running && verdict?.kind === "owned" && verdict.refreshDefinition;
		const fallbackNodeRunner = params.fallbackNodeRunner ?? (params.shouldRestart && !process.versions.bun && nodeRunner && (params.alreadyCurrent ? canRefreshCurrentService : await gatewayServiceCommandUsesRoot({ root: params.root })) ? resolveNodeRunner() : void 0);
		if (nodeRunner && fallbackNodeRunner && fallbackNodeRunner !== nodeRunner) {
			let fallbackActivationRuntime;
			try {
				fallbackActivationRuntime = capturePackageActivationRuntime("node", fallbackNodeRunner);
			} catch (error) {
				captureError = error;
			}
			const fallbackRuntime = await resolvePackageRuntimeForPreflight({
				nodeRunner: fallbackActivationRuntime?.path ?? fallbackNodeRunner,
				timeoutMs: params.timeoutMs
			});
			if ((fallbackRuntime.failure ? false : nodeVersionSatisfiesEngine(fallbackRuntime.version, target.nodeEngine)) === true) {
				if (!fallbackActivationRuntime) return err(captureError instanceof Error ? captureError.message : String(captureError));
				return ok({
					nodeRunner: fallbackNodeRunner,
					activationRuntime: fallbackActivationRuntime,
					replacedNodeRunner: nodeRunner,
					targetVersion
				});
			}
		}
		if (satisfies !== false) {
			if (!activationRuntime) return err(captureError instanceof Error ? captureError.message : String(captureError));
			return ok(unchangedRuntime);
		}
		if (params.runtimeRecovery && target.nodeEngine) {
			const { resolveTargetNodeRuntime } = await import("./update-command-node-runtime-resolution-ClemUfGM.mjs");
			const recovered = await resolveTargetNodeRuntime({
				engine: target.nodeEngine,
				recovery: params.runtimeRecovery,
				timeoutMs: params.timeoutMs
			});
			if (recovered) {
				let recoveredRuntime;
				try {
					recoveredRuntime = capturePackageActivationRuntime("node", recovered);
				} catch (error) {
					return err(error instanceof Error ? error.message : String(error));
				}
				return ok({
					nodeRunner: recovered,
					activationRuntime: recoveredRuntime,
					replacedNodeRunner: nodeRunner ?? resolveNodeRunner(),
					targetVersion
				});
			}
		}
		const runtimeLabel = runtime.nodeRunner ? `Node ${runtime.version ?? "unknown"} at ${runtime.nodeRunner}` : `Node ${runtime.version ?? "unknown"}`;
		const engineRange = target.nodeEngine ? validRange(target.nodeEngine) : null;
		const minimum = engineRange ? minVersion(engineRange)?.version ?? "unspecified" : "unspecified";
		const recommendation = minimumSupportedNodeVersion(engineRange ?? "*");
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
		return {
			...recoverySteps ? { recoverySteps } : {},
			...err([
				`openclaw@${targetVersion} requires ${requirement}; selected runtime is ${runtimeLabel}.`,
				...runtime.failure ? [runtime.failure] : [],
				upgrade
			].join("\n")),
			failureFacts: [createUpdateFailureFact({
				check: "node-runtime",
				code: "node-runtime-preflight",
				affectedKey: "engines.node",
				message: `Target package: openclaw@${valid(targetVersion) ?? "unknown"}; Minimum Node engine: ${minimum}; Running Node: ${valid(runtime.version ?? "") ?? "unknown"}`
			})]
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
function reportPackageRuntimeSelection(selection, opts) {
	if (!selection.replacedNodeRunner || opts.json) return;
	defaultRuntime.log(theme.warn(`Managed gateway service Node (${selection.replacedNodeRunner}) cannot run openclaw@${selection.targetVersion ?? opts.tag}.`));
	defaultRuntime.log(theme.muted(`Using compatible Node (${selection.nodeRunner}) for the update and managed service refresh.`));
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
		nodeRunner: params.managedServiceRoot && canRefreshManagedServiceNode ? params.packageUpdateNodeRunner : managedServiceNodeRunner ?? params.packageUpdateNodeRunner,
		fallbackNodeRunner: canRefreshManagedServiceNode && !process.versions.bun ? resolveNodeRunner() : void 0,
		runtimeRecovery: !managedServiceNodeRunner || canRefreshManagedServiceNode ? createPackageRuntimeRecovery({
			root: params.root,
			opts: params.opts,
			timeoutMs: params.timeoutMs,
			executorFence: fence
		}) : void 0
	});
	fence.assertCurrent();
	if (result.ok) {
		if (params.packageInstallEnv && result.value.nodeRunner) Object.assign(params.packageInstallEnv, withNodeRuntimePath(params.packageInstallEnv, result.value.nodeRunner));
		reportPackageRuntimeSelection(result.value, {
			json: params.opts.json,
			tag: params.tag
		});
	}
	return result;
}
//#endregion
//#region src/cli/update-cli/update-command-dry-run.ts
async function handleDryRunPreflightError(error, notes, refuseUpdate) {
	if (!(error instanceof UpdatePreMutationError)) throw error;
	if (error.reason === "database-schema-preflight" || error.reason === "target-metadata-preflight" || error.reason === "invalid-config" || error.reason === "config-read-failed") {
		notes.push(error.message.replace(/^Update refused:/u, "Would refuse update:"));
		return {
			incompatible: [],
			indeterminate: []
		};
	}
	await refuseUpdate(error.reason, error.message, error.failureFacts, error.recoverySteps);
	return {
		incompatible: [],
		indeterminate: []
	};
}
function printDryRunPreview(preview, jsonMode) {
	if (jsonMode) {
		defaultRuntime.writeJson(preview);
		return;
	}
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
	defaultRuntime.log("");
	defaultRuntime.log(theme.heading("Planned actions:"));
	for (const action of preview.actions) defaultRuntime.log(`  - ${action}`);
	if (preview.notes.length > 0) {
		defaultRuntime.log("");
		defaultRuntime.log(theme.heading("Notes:"));
		for (const note of preview.notes) defaultRuntime.log(`  - ${theme.muted(note)}`);
	}
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
	printDryRunPreview({
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
	}, Boolean(params.opts.json));
	if (!params.opts.json) await printResult({
		runId: params.runId,
		status: "skipped",
		mode: params.mode,
		reason: "dry-run",
		steps: [],
		durationMs: 0
	}, params.opts);
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
		if (target.inspectionWarning) preflight.preflightNotes.push(target.inspectionWarning);
		if (target.packageInstallTarget && !target.packageAlreadyCurrent && preflight.preflightFailures.length === 0) {
			const permissions = await checkGlobalPackageUpdatePermissions(target.packageInstallTarget);
			if (permissions?.stderrTail) {
				preflight.preflightFailures.push({
					reason: UPDATE_GLOBAL_PERMISSION_REASON,
					message: permissions.stderrTail,
					failureFacts: permissions.failureFacts
				});
				preflight.preflightNotes.push(`Would refuse update: ${permissions.stderrTail}`);
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
		const { inspectUpdateDatabaseContexts } = await import("./update-command-database-context-McFChiq1.mjs");
		const { inspectGitDryRunTargetSchemaVersions } = await import("./update-command-git-DYOR4R8R.mjs");
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
			const failure = createUpdatePreflightFailure("failureCode" in target && target.failureCode ? target.failureCode : "target-git-metadata", target.metadataUnreadable);
			throw new UpdatePreMutationError("target-metadata-preflight", failure.message, { failureFacts: failure.failureFacts });
		}
		const installedContexts = candidateAdmissionChecks?.includes("database-schema") ? admission.contexts.filter((context) => !isCandidateAdmissionContextCovered(context.env)) : admission.contexts;
		packageSchemaPreflight = await checkTargetDatabaseSchemasForContexts(target.schemaVersions, installedContexts);
		if (opts.dryRun && updateInstallKind === "package") {
			const runtime = await resolvePackageRuntimePreflight({
				...params,
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
					reason: "node-runtime-preflight",
					message: runtime.error,
					failureFacts: runtime.failureFacts,
					recoverySteps: runtime.recoverySteps
				});
			} else if (runtime.value.replacedNodeRunner) preflightNotes.push(`Would replace managed gateway service Node (${runtime.value.replacedNodeRunner}) with current Node (${runtime.value.nodeRunner}) for openclaw@${runtime.value.targetVersion}.`);
			if (params.packageInstallSpec && !canResolveRegistryVersionForPackageTarget(params.packageInstallSpec)) preflightNotes.push("Configured plugin availability will be checked against the staged package before update checks or activation; this preview does not stage the target.");
			else {
				const { preflightConfiguredNpmPluginTargets } = await import("./update-command-plugin-preflight-DyW9D77r.mjs");
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
function assertForegroundUpdateSchemaSupport(run, candidate, schemas, gatewayRestartCompletion) {
	if (run?.completionOwner !== "gateway-restart" || gatewayRestartCompletion || !candidate) return;
	const sharedPath = resolveOpenClawStateSqlitePath(run.env);
	if (schemas?.some((entry) => {
		const version = resolveUpdateStateContentVersion(entry);
		return version !== null && version !== candidate[entry.path === sharedPath ? "state" : "agent"];
	})) throw new UpdatePreMutationError("target-native-unsupported", "Target runtime cannot preserve the foreground Gateway's completion owner after state migration; refusing activation.");
}
async function captureUpdateActivationSchemas(params) {
	const previousSchemaVersions = parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(params.root, "package.json")));
	const schemaVersions = params.candidateSchemaVersions ? await readUpdateStateSchemaVersions({
		stateDir: resolveStateDir(params.env),
		config: params.config,
		env: params.env,
		timeoutMs: params.timeoutMs
	}) : void 0;
	assertForegroundUpdateSchemaSupport(params.run, params.candidateSchemaVersions, schemaVersions, params.gatewayRestartCompletion);
	return {
		previousSchemaVersions,
		schemaVersions
	};
}
//#endregion
export { preparePackageUpdateRuntime as a, createPackageRuntimeRecovery as i, preflightUpdateCommandSchemas as n, resolvePackageRuntimePreflight as o, previewUpdateCommand as r, captureUpdateActivationSchemas as t };
