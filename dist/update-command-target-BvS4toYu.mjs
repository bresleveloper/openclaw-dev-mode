import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { i as isPathStrictlyInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { g as SqliteReadOnlyInspectionContentionError } from "./sqlite-readonly-worker-CmkAsqCm.mjs";
import { a as channelToNpmTag, r as EXTENDED_STABLE_TAG_UNSUPPORTED_REASON, u as resolveEffectiveUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as UPDATE_FOREIGN_DESTINATION_REASON } from "./update-outcome-ZpL2Kt9B.mjs";
import { l as createUpdatePreflightFailure, n as createUpdateFailureFact } from "./update-failure-facts-DiyYJNo1.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { n as readPackageName, r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { s as summarizeGatewayServiceLayout } from "./service-layout-DuzmQnH1.mjs";
import { i as updateRunStepsFromResultStep } from "./update-run-step-ijjXM1mH.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-wgYVxidq.mjs";
import { A as createFreeBsdPkgOwnershipInspection, D as resolveNpmGlobalPrefixLayoutFromGlobalRoot, T as probeNpmGlobalPrefix, _ as resolveGlobalInstallSpec, l as createGlobalInstallEnv, m as isPackageTargetAlreadyCurrent, o as canResolveRegistryVersionForPackageTarget, v as resolveGlobalInstallTarget, w as inspectNpmLauncher, y as resolveNpmLifecyclePolicyGate } from "./update-runner-command-DZBJTDir.mjs";
import { i as resolveUpdateInstallSurface, r as resolveUnmanagedUpdateInstallReason, t as describeUpdateInstallRoot } from "./update-runner-install-surface-DTETdBMu.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { r as captureUpdateCommandExecutorAuthority } from "./update-command-executor-BQrAUjan.mjs";
import { _ as readDevUpdateTarget, f as assertUpdatePackageActivationAdmission, o as reportPreMutationUpdateResult, v as recordUpdateCommandTarget } from "./update-command-terminal-3Hu1mJ4t.mjs";
import { a as resolveExtendedStablePackage, n as compareSemverStrings, o as resolveNpmChannelTag } from "./update-check-CtYi2ZDp.mjs";
import { f as resolveGlobalManager, n as UpdatePreMutationError, p as resolveTargetVersion, s as normalizeTag, t as DEFAULT_PACKAGE_NAME } from "./shared-OuJSSGTT.mjs";
import { s as readUpdateChannelConfig } from "./update-command-config-DgQs2s0y.mjs";
import { t as createLowDiskSpaceWarning } from "./disk-space-CtKhSv74.mjs";
import { r as resolveCanonicalPath } from "./package-update-manager-preflight-CtFk3SHr.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { r as UPDATE_DESTINATION_RECOVERY } from "./update-failure-facts-format-Uhxv535Y.mjs";
import { a as gatewayServiceCommandUsesRoot, d as resolveManagedServicePackageUpdatePlan, l as readManagedGatewayServiceForUpdate, s as isGatewayServiceManagementAllowedForUpdate } from "./update-command-service-plan-LoWdIMX_.mjs";
import { t as assessInitialUpdateSnapshotCapacity } from "./update-candidate-snapshot-CDDtmKEr.mjs";
import { t as UnreportedUpdateAdmissionOutcome } from "./update-command-result-ZgmOI6c9.mjs";
import { i as readUpdateCandidateSource } from "./update-command-managed-context-DAWjJT6G.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/cli/update-cli/update-command-package-destination.ts
/** Re-invocation after a Node switch admits only a positively inspected empty or owned destination. */
async function inspectNpmGlobalDestination(root, timeoutMs) {
	const destination = {
		destinationKind: "unknown",
		prefix: null,
		packageRoot: null,
		runningRoot: path.resolve(root),
		runningPrefix: resolveNpmGlobalPrefixLayoutFromGlobalRoot(path.dirname(root))?.prefix ?? null,
		launcher: null,
		launcherTarget: null
	};
	const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
	const retry = formatCliCommand("openclaw update").replace(/^openclaw\b/, () => `node ${quote(path.resolve(root, "openclaw.mjs"))}`);
	const unknown = (prefix, cause) => ({
		kind: "unknown",
		cause,
		prefix,
		...destinationRefusal(`Selected npm destination ${prefix ?? "(unresolved; npm prefix -g)"} could not be inspected (${cause}); ownership is unknown. No installation was attempted. Fix inspection permissions on this prefix for the service account, or make \`npm prefix -g\` succeed with the selected runtime, then run \`${retry}\`. Alternatively, ask the deployment owner to verify the layout and explicitly select the intended installation using its existing deployment procedure.`, {
			...destination,
			ownership: "unknown",
			cause
		})
	});
	let prefix = null;
	try {
		const destinationLayout = await probeNpmGlobalPrefix(runCommandWithTimeout, timeoutMs);
		if (!destinationLayout) return unknown(prefix, "probe-failure");
		prefix = destinationLayout.prefix;
		const packageRoot = path.join(destinationLayout.globalRoot, "openclaw");
		destination.destinationKind = "npm-global";
		destination.prefix = prefix;
		destination.packageRoot = packageRoot;
		const { launcher, launcherTarget } = await inspectNpmLauncher(destinationLayout);
		destination.launcher = launcher;
		destination.launcherTarget = launcherTarget;
		const present = (target) => fs.lstat(target).then(() => true, (error) => {
			if (hasErrnoCode(error, "ENOENT")) return false;
			throw error;
		});
		const packagePresent = await present(packageRoot);
		const launcherPresent = await present(launcher);
		if (!packagePresent && !launcherPresent) return {
			kind: "empty",
			prefix
		};
		const packageRootReal = packagePresent ? await fs.realpath(packageRoot) : null;
		if (launcherPresent && !launcherTarget) return unknown(prefix, "unreadable-layout");
		const serviceInspection = isGatewayServiceManagementAllowedForUpdate(process.env) ? await readManagedGatewayServiceForUpdate(process.env) : null;
		const command = serviceInspection?.command ?? null;
		const ownsPackage = packageRootReal !== null && (await resolveCanonicalPath(root) === packageRootReal || await gatewayServiceCommandUsesRoot({
			root: packageRootReal,
			command
		}) === true);
		const ownsLauncher = !launcherPresent || packageRootReal !== null && launcherTarget !== null && isPathStrictlyInside(packageRootReal, launcherTarget);
		if (ownsPackage && ownsLauncher) return {
			kind: "owned",
			prefix
		};
		const layout = await summarizeGatewayServiceLayout(command);
		const wrapper = [
			process.env,
			command?.environment,
			resolveManagedGatewayServiceCommand(command)?.environment
		].some((env) => env?.OPENCLAW_WRAPPER?.trim());
		const select = serviceInspection?.verdict.refreshDefinition && !wrapper && ownsLauncher && launcherTarget ? formatCliCommand(`openclaw gateway install --force --runtime-path ${quote(process.execPath)}`).replace(/^openclaw\b/, () => `node ${quote(launcherTarget)}`) : void 0;
		const message = [
			`Selected npm destination ${prefix} is occupied by another OpenClaw installation: package ${packageRoot}; launcher ${launcher}${launcherTarget ? ` -> ${launcherTarget}` : " (target unresolved)"}.`,
			layout?.entrypoint ? `The selected service${layout.sourcePath ? ` (${layout.sourcePath})` : ""} uses ${layout.entrypoint}; it does not own this destination.` : "No selected managed service could be verified as owning this destination.",
			`No installation was attempted. Switch the runtime back and run \`${retry}\`.`,
			select ? `Alternatively, if the destination's owner agrees to use it for this service, explicitly select it with \`${select}\` and rerun the update. This changes the service binding; it does not grant ownership of another deployment's package.` : "Alternatively, ask the destination's deployment owner to resolve its package/launcher and select it for the intended service using their deployment procedure. Do not overwrite it."
		].join(" ");
		return {
			kind: "foreign",
			prefix,
			...destinationRefusal(message, {
				...destination,
				ownership: "foreign",
				cause: ownsPackage ? "launcher-mismatch" : "package-mismatch"
			})
		};
	} catch (error) {
		return unknown(prefix, hasErrnoCode(error, "EACCES") || hasErrnoCode(error, "EPERM") ? "permission" : "unreadable-layout");
	}
}
function destinationRefusal(detail, destination) {
	const message = `Next step: ${UPDATE_DESTINATION_RECOVERY} ${detail}`;
	return {
		reason: UPDATE_FOREIGN_DESTINATION_REASON,
		message,
		failureFacts: [createUpdateFailureFact({
			check: "package-install",
			code: UPDATE_FOREIGN_DESTINATION_REASON,
			message,
			destination
		})]
	};
}
//#endregion
//#region src/cli/update-cli/update-command-target.ts
/** A fresh profile must be initialized by an identified, schema-declaring target. */
async function resolveFreshUpdateMetadata(target) {
	if (target.targetVersion && target.packageTargetSchemaVersions) return {
		version: target.targetVersion,
		schemaVersions: target.packageTargetSchemaVersions
	};
	const failure = createUpdatePreflightFailure(target.targetVersion ? "target-schema-metadata" : "target-registry-dist-tag");
	await target.refuseUpdate("target-metadata-preflight", failure.message, failure.failureFacts);
}
/** Describe the selected plan without changing roots, runtime, or service authority. */
function formatManagedServicePackageUpdatePlan(params) {
	const { rootRedirect, nodeRunner } = params;
	if (rootRedirect) return [
		{
			level: "muted",
			message: `Targeting managed gateway service package root: ${rootRedirect.root}`
		},
		{
			level: "warn",
			message: `Shell OpenClaw root differs from the managed gateway service root: ${rootRedirect.previousRoot}`
		},
		{
			level: "muted",
			message: `After the update, make sure \`${CLI_NAME}\` on PATH resolves to the managed service root or reinstall the gateway service from the shell install you want to use.`
		},
		...nodeRunner ? [{
			level: "muted",
			message: `Managed gateway service Node: ${nodeRunner}`
		}] : []
	];
	if (params.serviceRoot) return [{
		level: "muted",
		message: `Updating this installation and rebinding the managed Gateway from ${params.serviceRoot} after ownership and runtime verification.`
	}];
	return nodeRunner ? [{
		level: "warn",
		message: `Current Node (${resolveNodeRunner()}) differs from the managed gateway service Node (${nodeRunner}).`
	}, {
		level: "muted",
		message: "Using the managed service Node for this update so the gateway can start after the upgrade."
	}] : [];
}
async function resolveUpdateCommandTarget(opts, recoveryState, invocationCwd, prepared, executor, updateStepTimeoutMs) {
	let preparingTarget = true;
	try {
		return await withCommandProcessScope(async () => {
			const { discoveredRoot, installKind, requestedChannel, controlPlaneUpdateSentinelMeta, timeoutMs } = prepared;
			const pkgOwnership = createFreeBsdPkgOwnershipInspection(updateStepTimeoutMs);
			await pkgOwnership.assertUnowned(discoveredRoot);
			let { devTarget } = prepared;
			let root = discoveredRoot;
			let updateInstallKind = installKind;
			let packageManager;
			const resolveMode = async () => {
				if (updateInstallKind === "git") return "git";
				if (packageManager) return packageManager;
				return (await resolveUpdateInstallSurface({
					root,
					installKind,
					timeoutMs: updateStepTimeoutMs,
					runCommand: runCommandWithTimeout
				})).mode;
			};
			const refuseUpdate = async (reason, message, failureFacts, recoverySteps) => {
				const report = {
					root,
					installKind: updateInstallKind,
					mode: reason === "invalid-config" ? packageManager : await resolveMode(),
					reason,
					message,
					failureFacts,
					recoverySteps,
					opts,
					controlPlaneUpdateSentinelMeta
				};
				if (preparingTarget || !opts.run && !opts.dryRun) throw new UnreportedUpdateAdmissionOutcome(report);
				return await reportPreMutationUpdateResult(report);
			};
			if (installKind === "unknown") {
				const servicePlan = await resolveManagedServicePackageUpdatePlan({
					root,
					pkgOwnership
				});
				const failure = createUpdatePreflightFailure("installation-unclassified", `${await describeUpdateInstallRoot(root)} Service unit target: ${servicePlan.serviceUnitTarget ?? "not inspected"}.`);
				throw new UnreportedUpdateAdmissionOutcome({
					root,
					installKind,
					mode: "unknown",
					opts,
					controlPlaneUpdateSentinelMeta,
					reason: resolveUnmanagedUpdateInstallReason(),
					...failure
				}, { exitCode: 0 });
			}
			recordUpdateCommandTarget(opts.run, { step: {
				step: "installation-inspection",
				status: "in_progress"
			} });
			if (requestedChannel === "extended-stable" && installKind === "git") {
				await refuseUpdate("unsupported_git_channel");
				return;
			}
			const readChannelConfig = () => readUpdateChannelConfig(Boolean(opts.channel));
			let channelConfig;
			let inspectionWarning;
			try {
				channelConfig = await readChannelConfig();
			} catch (error) {
				if (!(error instanceof SqliteReadOnlyInspectionContentionError)) throw error;
				channelConfig = await readChannelConfig();
				inspectionWarning = `Read-only SQLite inspection recovered after temporary contention; continuing the update. ${formatErrorMessage(error)}`;
				recordUpdateCommandTarget(opts.run, { step: {
					step: "warning:installation-inspection",
					status: "completed",
					detail: inspectionWarning
				} });
				defaultRuntime.error(`Warning: ${inspectionWarning}`);
			}
			const { configSnapshot, legacyConfigPlan, storedChannel } = channelConfig;
			if (opts.channel && !configSnapshot.valid && !legacyConfigPlan) {
				await refuseUpdate("invalid-config", ["Config is invalid; cannot set update channel.", ...formatConfigIssueLines(configSnapshot.issues, "-")].join("\n"));
				return;
			}
			const channel = (opts.sourceUpdate ? "dev" : requestedChannel) ?? storedChannel ?? (installKind === "git" ? "dev" : resolveEffectiveUpdateChannel({
				currentVersion: VERSION,
				installKind
			}).channel);
			if (channel === "extended-stable" && installKind === "git") {
				await refuseUpdate("unsupported_git_channel");
				return;
			}
			const explicitTag = normalizeTag(opts.tag);
			const switchToGit = installKind !== "git" && (requestedChannel === "dev" || channel === "dev" && explicitTag === null);
			const switchToPackage = requestedChannel !== null && requestedChannel !== "dev" && installKind === "git";
			updateInstallKind = switchToGit ? "git" : switchToPackage ? "package" : installKind;
			if (channel === "dev" && requestedChannel !== "dev" && !opts.sourceUpdate) try {
				devTarget = readDevUpdateTarget();
			} catch (error) {
				await refuseUpdate("invalid-dev-target", formatErrorMessage(error));
				return;
			}
			const unsupportedMainTag = updateInstallKind === "package" && explicitTag === "main";
			if (channel === "extended-stable" && explicitTag || unsupportedMainTag) {
				await refuseUpdate(unsupportedMainTag ? "unsupported-package-target" : EXTENDED_STABLE_TAG_UNSUPPORTED_REASON, unsupportedMainTag ? "`--tag main` cannot update a package install. Run `openclaw update --channel dev` to switch to the supported Git checkout and build flow." : void 0);
				return;
			}
			let tag = explicitTag ?? channelToNpmTag(channel);
			let targetVersion = null;
			let downgradeRisk = false;
			let fallbackToLatest = false;
			let packageInstallSpec = null;
			let packageInstallEnv;
			let packageInstallTarget;
			let installedPackageName = DEFAULT_PACKAGE_NAME;
			let packageAlreadyCurrent = false;
			let packageTargetSchemaVersions;
			let packageRuntimeTarget;
			let managedServiceRootRedirect = null;
			let managedServiceRoot;
			let managedServiceNodeRunner;
			let packageUpdateNodeRunner;
			let serviceUnitTarget;
			if (updateInstallKind === "package") {
				const servicePlan = prepared.servicePlan ?? await resolveManagedServicePackageUpdatePlan({
					root,
					pkgOwnership,
					rebind: prepared.shouldRestart
				});
				await pkgOwnership.assertUnowned(servicePlan.rootRedirect?.root ?? root);
				managedServiceRootRedirect = servicePlan.rootRedirect;
				serviceUnitTarget = servicePlan.serviceUnitTarget;
				managedServiceRoot = servicePlan.serviceRoot;
				managedServiceNodeRunner = servicePlan.nodeRunner;
				if (managedServiceRootRedirect) root = managedServiceRootRedirect.root;
				if (!opts.json) for (const { level, message } of formatManagedServicePackageUpdatePlan(servicePlan)) defaultRuntime.log(theme[level](message));
				packageUpdateNodeRunner = managedServiceRoot ? resolveNodeRunner() : managedServiceNodeRunner;
			}
			if (updateInstallKind === "package" && !opts.dryRun) {
				assertUpdatePackageActivationAdmission(root, { serviceRoot: managedServiceRoot });
				const fence = await executor.enter(root, {
					preflight: true,
					serviceRoot: managedServiceRoot
				});
				if (opts.run) opts.run.executorFence = fence;
				fence.assertCurrent();
				assertUpdatePackageActivationAdmission(captureUpdateCommandExecutorAuthority(fence).installKey, { serviceRoot: managedServiceRoot });
			}
			const currentVersion = await readPackageVersion(root);
			if (updateInstallKind !== "git") {
				recoveryState.triageTarget.root = root;
				recoveryState.triageTarget.nodeRunner = packageUpdateNodeRunner;
				packageInstallEnv = await createGlobalInstallEnv();
				if (updateInstallKind === "package") {
					installedPackageName = await readPackageName(root) ?? "openclaw";
					const manager = await resolveGlobalManager({
						root,
						installKind,
						timeoutMs: updateStepTimeoutMs,
						pkgOwnership,
						serviceUnitTarget
					}).catch(async (error) => {
						if (hasCommandProcessCleanupError(error)) throw error;
						if (!(error instanceof UpdatePreMutationError)) throw error;
						const report = {
							root,
							installKind,
							reason: error.reason,
							message: error.message,
							failureFacts: error.failureFacts,
							opts,
							controlPlaneUpdateSentinelMeta
						};
						throw new UnreportedUpdateAdmissionOutcome(report, { exitCode: 0 });
					});
					packageManager = manager;
					recordUpdateCommandTarget(opts.run, { target: {
						kind: updateInstallKind,
						tag,
						installationMethod: `${manager}-global`
					} });
					packageInstallTarget = await resolveGlobalInstallTarget({
						manager,
						runCommand: runCommandWithTimeout,
						timeoutMs: updateStepTimeoutMs,
						pkgRoot: root,
						honorPackageRoot: managedServiceRootRedirect !== null || managedServiceRoot !== void 0 || managedServiceNodeRunner !== void 0,
						packageName: installedPackageName,
						pkgOwnership
					});
					if (packageInstallTarget.manager === "npm") {
						const destination = await inspectNpmGlobalDestination(root, updateStepTimeoutMs);
						if (destination.kind !== "owned" && destination.kind !== "empty") {
							await refuseUpdate(destination.reason, destination.message, destination.failureFacts);
							return;
						}
					}
					const diskWarning = createLowDiskSpaceWarning({
						targetPath: packageInstallTarget.packageRoot ? path.dirname(packageInstallTarget.packageRoot) : root,
						purpose: "global package update"
					});
					if (diskWarning) {
						if (opts.json) defaultRuntime.error(`Warning: ${diskWarning}`);
						else defaultRuntime.log(theme.warn(diskWarning));
						opts.run?.executorFence?.assertCurrent();
						for (const step of updateRunStepsFromResultStep({
							name: "disk-space-preflight",
							exitCode: 0,
							warnings: [diskWarning]
						})) recordUpdateCommandTarget(opts.run, { step });
					}
					const npmLifecycleGate = resolveNpmLifecyclePolicyGate(packageInstallTarget);
					if (npmLifecycleGate.error) {
						await refuseUpdate("npm lifecycle policy preflight", npmLifecycleGate.error);
						return;
					}
				}
				recordUpdateCommandTarget(opts.run, { step: {
					step: "installation-inspection",
					status: "completed",
					endedAtMs: Date.now()
				} });
				recordUpdateCommandTarget(opts.run, {
					target: {
						kind: updateInstallKind,
						tag
					},
					step: {
						step: "target-resolution",
						status: "in_progress",
						startedAtMs: Date.now()
					}
				});
				const npmMetadataCommand = packageInstallTarget?.manager === "npm" ? packageInstallTarget.command : void 0;
				if (channel === "extended-stable") {
					const extendedStable = await resolveExtendedStablePackage({
						installKind: updateInstallKind,
						timeoutMs,
						packageName: installedPackageName
					});
					if (extendedStable.status === "failed") {
						await refuseUpdate(extendedStable.reason);
						return;
					}
					targetVersion = extendedStable.version;
					tag = extendedStable.version;
					packageInstallSpec = extendedStable.packageSpec;
				} else if (explicitTag) targetVersion = await resolveTargetVersion(tag, timeoutMs, {
					spec: resolveGlobalInstallSpec({
						packageName: DEFAULT_PACKAGE_NAME,
						tag,
						env: packageInstallEnv
					}),
					command: npmMetadataCommand,
					cwd: invocationCwd,
					env: packageInstallEnv
				});
				else targetVersion = await resolveNpmChannelTag({
					channel,
					timeoutMs,
					command: npmMetadataCommand,
					cwd: invocationCwd,
					env: packageInstallEnv
				}).then((resolved) => {
					tag = resolved.tag;
					fallbackToLatest = channel === "beta" && resolved.tag === "latest";
					return resolved.version;
				});
				const cmp = currentVersion && targetVersion ? compareSemverStrings(currentVersion, targetVersion) : null;
				packageInstallSpec ??= resolveGlobalInstallSpec({
					packageName: DEFAULT_PACKAGE_NAME,
					tag,
					env: packageInstallEnv
				});
				packageAlreadyCurrent = !managedServiceRoot && updateInstallKind === "package" && !switchToPackage && isPackageTargetAlreadyCurrent({
					currentVersion,
					targetVersion,
					target: packageInstallSpec
				});
				downgradeRisk = canResolveRegistryVersionForPackageTarget(tag) && !fallbackToLatest && currentVersion != null && (targetVersion == null ? tag !== "latest" : cmp != null && cmp > 0);
				if (targetVersion) {
					const targetMetadata = await fetchNpmPackageTargetStatus({
						target: targetVersion,
						spec: resolveGlobalInstallSpec({
							packageName: DEFAULT_PACKAGE_NAME,
							tag: targetVersion,
							env: packageInstallEnv
						}),
						command: npmMetadataCommand,
						timeoutMs,
						cwd: invocationCwd,
						env: packageInstallEnv
					});
					if (targetMetadata.error || targetMetadata.version !== targetVersion) {
						const failure = createUpdatePreflightFailure(targetMetadata.error ? "target-registry-metadata" : "target-version-resolution", `Could not inspect exact package target openclaw@${targetVersion}: ${targetMetadata.error ?? `registry returned version ${targetMetadata.version ?? "unknown"}`}.`);
						await refuseUpdate("target-metadata-preflight", failure.message, failure.failureFacts);
						return;
					}
					packageTargetSchemaVersions = targetMetadata.schemaVersions;
					packageRuntimeTarget = {
						version: targetVersion,
						nodeEngine: targetMetadata.nodeEngine
					};
					if (updateInstallKind === "package" && canResolveRegistryVersionForPackageTarget(tag)) packageInstallSpec = resolveGlobalInstallSpec({
						packageName: DEFAULT_PACKAGE_NAME,
						tag: targetVersion,
						env: packageInstallEnv
					});
				}
			}
			recordUpdateCommandTarget(opts.run, {
				target: {
					kind: updateInstallKind,
					tag,
					...targetVersion ? { version: targetVersion } : {},
					...updateInstallKind === "git" ? { installationMethod: "git-checkout" } : {}
				},
				step: {
					step: updateInstallKind === "git" ? "installation-inspection" : "target-resolution",
					status: "completed",
					endedAtMs: Date.now()
				}
			});
			if (updateInstallKind === "package" && !packageAlreadyCurrent && !opts.dryRun) {
				const env = opts.run?.env ?? process.env;
				const source = await readUpdateCandidateSource(env, legacyConfigPlan);
				const snapshot = await assessInitialUpdateSnapshotCapacity({
					config: source.config,
					stateDir: resolveStateDir(env),
					env
				});
				opts.run?.executorFence?.assertCurrent();
				for (const step of updateRunStepsFromResultStep(snapshot)) recordUpdateCommandTarget(opts.run, { step });
				if (snapshot.exitCode !== 0) {
					await refuseUpdate("snapshot-capacity-insufficient", snapshot.stderrTail ?? void 0);
					return;
				}
				for (const warning of snapshot.warnings ?? []) if (opts.json) defaultRuntime.error(`Warning: ${warning}`);
				else defaultRuntime.log(theme.warn(warning));
			}
			return {
				root,
				...inspectionWarning ? { inspectionWarning } : {},
				mode: await resolveMode(),
				updateInstallKind,
				refuseUpdate,
				configSnapshot,
				legacyConfigPlan,
				storedChannel,
				requestedChannel,
				channel,
				explicitTag,
				switchToGit,
				switchToPackage,
				tag,
				currentVersion,
				targetVersion,
				downgradeRisk,
				fallbackToLatest,
				packageInstallSpec,
				packageInstallEnv,
				packageInstallTarget,
				packageAlreadyCurrent,
				packageTargetSchemaVersions,
				packageRuntimeTarget,
				managedServiceRootRedirect,
				managedServiceRoot,
				managedServiceNodeRunner,
				packageUpdateNodeRunner,
				devTarget
			};
		});
	} catch (error) {
		if (!hasCommandProcessCleanupError(error) && error instanceof UnreportedUpdateAdmissionOutcome && (error.skipped ? opts.run : opts.run || opts.dryRun)) return await reportPreMutationUpdateResult({
			...error.report,
			...error.skipped?.exitCode === 0 ? { status: "skipped" } : {}
		});
		throw error;
	} finally {
		preparingTarget = false;
	}
}
//#endregion
export { resolveUpdateCommandTarget as n, resolveFreshUpdateMetadata as t };
