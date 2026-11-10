import { F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { t as isBunRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { i as isPathStrictlyInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { i as SqliteReadOnlyInspectionContentionError } from "./sqlite-readonly-worker-session-Bq0RBm36.mjs";
import { t as createLowDiskSpaceWarning } from "./disk-space-CtKhSv74.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { a as channelToNpmTag, l as resolveEffectiveUpdateChannel, r as EXTENDED_STABLE_TAG_UNSUPPORTED_REASON } from "./update-channels-l0GQCX9n.mjs";
import { i as parseUpdateAdmissionVerdict } from "./update-run-schema-CY2FAM7T.mjs";
import { c as redactSupportString, s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { i as UPDATE_FOREIGN_DESTINATION_REASON } from "./update-outcome-DLbo5ecI.mjs";
import { t as UPDATE_DESTINATION_RECOVERY } from "./update-failure-facts-format-DbAtk-ZC.mjs";
import { m as createUpdatePreflightFailure } from "./service-inspection-error-ozNMOrIE.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { r as createUpdateFailureFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as readPackageVersion, r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { o as resolveManagedGatewayServiceCommand } from "./service-types-CPk6CBn6.mjs";
import { c as summarizeGatewayServiceLayout } from "./service-layout-DcU2-cAg.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CiE2knkN.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { t as fetchNpmPackageTargetStatus } from "./update-check-package-target-B_9onsoT.mjs";
import { i as readDevUpdateTarget } from "./update-dev-target-yMMMhCo4.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { b as UpdatePreMutationError, d as resolveGlobalInstallTarget, f as resolveNpmLifecyclePolicyGate, g as createGlobalInstallEnv, s as isPackageTargetAlreadyCurrent, t as canResolveRegistryVersionForPackageTarget, u as resolveGlobalInstallSpec, y as createSystemPackageOwnershipInspection } from "./update-global-BlXQRfes.mjs";
import { i as resolveNpmGlobalPrefixLayoutFromGlobalRoot, t as inspectNpmLauncher } from "./update-npm-prefix-DY4dJ1W0.mjs";
import { o as updateRunStepsFromResultStep, r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { a as resolveExtendedStablePackage, f as resolveUnmanagedUpdateInstallReason, n as compareSemverStrings, o as resolveNpmChannelTag, p as resolveUpdateInstallSurface, u as describeUpdateInstallRoot } from "./update-check-hpRujh0z.mjs";
import { f as recordUpdateRunStep, l as recordUpdateRunPhase } from "./update-run-ledger-C3oL-g8r.mjs";
import { t as resolveNodeRunner } from "./node-runner-DIokVayT.mjs";
import { o as captureUpdateCommandExecutorAuthority } from "./update-command-executor-DUq8yLzH.mjs";
import { d as resolveGlobalManager, f as resolveTargetVersion, g as usesCandidateUpdateAdmission, o as normalizeTag, t as DEFAULT_PACKAGE_NAME } from "./shared-DRiGAorf.mjs";
import { s as readUpdateChannelConfig } from "./update-command-config-CDBhVGHw.mjs";
import { l as withOwnedManagedUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { c as handoffUpdateFromGateway, i as UpdateCommandAbort } from "./update-command-service-maintenance-DvLJF4Bi.mjs";
import { a as gatewayServiceCommandUsesRoot, d as readManagedGatewayServiceForUpdate, p as resolveManagedServicePackageUpdatePlan, s as isGatewayServiceManagementAllowedForUpdate } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { t as createUpdateConfigFailure } from "./update-command-config-failure-D1j4PRpI.mjs";
import { r as resolveUpdateCandidateAdmissionTimeoutMs, t as assessInitialUpdateSnapshotCapacity } from "./update-candidate-snapshot-CXUOq_kW.mjs";
import { r as capturePackageActivationRuntime } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { c as resolveCanonicalPath } from "./package-update-steps-CyYbYiYK.mjs";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { t as UnreportedUpdateAdmissionOutcome } from "./update-command-result-BgqRj9_Z.mjs";
import { i as readUpdateCandidateSource } from "./update-command-managed-context-CxkSVUSh.mjs";
import { b as assertUpdatePackageActivationAdmission, o as reportPreMutationUpdateResult, v as recordUpdateCommandTarget } from "./update-command-terminal-CPGdOHR-.mjs";
import { n as parseUpdateAdmissionContext, t as isUpdateAdmissionAuthorityEnvKey } from "./update-admission-contract-jHaLk-DI.mjs";
import { n as withPrivateStagedPackageInstall } from "./update-command-artifact-CVKkHa6F.mjs";
import { n as inspectUpdateManagedServices } from "./update-command-database-context-DRSOBnuV.mjs";
import { i as waitBounded, r as terminateCanary, t as launchCanary } from "./update-candidate-canary-process-DQ3BqGc7.mjs";
import { o as recordNodeSecurityWarning, s as resolvePackageRuntimePreflight } from "./update-command-schema-DFPuQCTq.mjs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { withTempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/infra/update-candidate-admission.ts
const candidateRuntimeEnvKeys = /* @__PURE__ */ new Set([
	"NODE_COMPILE_CACHE",
	"NODE_DISABLE_COMPILE_CACHE",
	"OPENCLAW_DEV_SOURCE_ROOT",
	"OPENCLAW_VERSION",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_NO_RESPAWN"
]);
/** Inspect the passive declaration before running any candidate lifecycle scripts. */
async function readUpdateAdmissionProtocol(candidateRoot) {
	const manifest = await tryReadJson(path.join(candidateRoot, "package.json"), { maxBytes: 1048576 });
	return isRecord(manifest) && isRecord(manifest.openclaw) && manifest.openclaw.updateAdmissionProtocol === 1 ? 1 : void 0;
}
/** Ask the staged package to inspect the live installation without a grant or lease. */
async function runUpdateCandidateAdmission(params) {
	const sourceEnv = params.env ?? process.env;
	if (params.admission === "installed") return {
		owner: "installed",
		fallbackReason: "forced-installed"
	};
	if (await readUpdateAdmissionProtocol(params.candidateRoot) === void 0) return {
		owner: "installed",
		fallbackReason: "unsupported-target",
		warning: {
			code: "update-admission-unsupported-target",
			message: "This target does not support candidate-owned admission; the installed updater will check admission."
		}
	};
	const redaction = {
		env: sourceEnv,
		stateDir: resolveStateDir(sourceEnv)
	};
	const fallback = (reason, diagnostic, redactedDetail = "") => ({
		owner: "installed",
		fallbackReason: reason,
		warning: {
			code: "update-admission-fallback",
			message: `Candidate admission did not return a valid verdict (${reason}); the installed updater will check admission.${diagnostic ? ` ${redactSupportDiagnosticLine(diagnostic, redaction)}` : ""}${redactedDetail}`
		}
	});
	try {
		const context = parseUpdateAdmissionContext(params.context);
		if (!context) return fallback("invalid-context");
		const entry = await resolveGatewayInstallEntrypoint(params.candidateRoot);
		if (!entry) return fallback("missing-entrypoint");
		return await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "openclaw-update-admission-"
		}, async ({ dir }) => {
			const contextPath = path.join(dir, "context.json");
			const locator = (value) => value.includes("://") ? redactSupportString(value, redaction) : value;
			const privateContext = {
				...context,
				target: {
					...context.target,
					spec: locator(context.target.spec),
					...context.target.tag ? { tag: locator(context.target.tag) } : {}
				}
			};
			await fs.writeFile(contextPath, JSON.stringify(privateContext), {
				mode: 384,
				flag: "wx"
			});
			const env = { ...sourceEnv };
			for (const key of Object.keys(env)) {
				const normalized = key.toUpperCase();
				if (isUpdateAdmissionAuthorityEnvKey(key) || candidateRuntimeEnvKeys.has(normalized)) delete env[key];
			}
			env.NODE_DISABLE_COMPILE_CACHE = "1";
			env.OPENCLAW_DEV_SOURCE_ROOT = params.candidateRoot;
			if (context.target.version !== null) env.OPENCLAW_VERSION = context.target.version;
			env.OPENCLAW_NO_RESPAWN = "1";
			const budget = resolveTimerTimeoutMs(params.timeoutMs ?? context.request.timeoutMs, 12e4);
			const deadline = Date.now() + budget;
			const cleanupBudget = Math.min(2e3, Math.floor(budget / 10));
			const running = launchCanary({
				entry,
				args: [
					"update",
					"admit",
					"--context",
					contextPath
				],
				root: params.candidateRoot,
				env,
				nodeRunner: params.nodeRunner,
				stateDir: redaction.stateDir,
				capture: () => {}
			});
			let outcome;
			try {
				outcome = await waitBounded(running.result, budget - cleanupBudget);
			} finally {
				await terminateCanary(running.child, running.closed, deadline);
			}
			const diagnostic = running.stderrDiagnostic();
			if (outcome.status !== "completed") return fallback("timeout", diagnostic);
			if (outcome.value !== 0 && outcome.value !== 3) return fallback(outcome.value === null ? "crash" : `exit-${outcome.value}`, diagnostic);
			if (running.outputExceeded()) return fallback("output-limit", diagnostic);
			let value;
			try {
				value = JSON.parse(running.stdout());
			} catch {
				const excerpt = redactSupportDiagnosticLine(running.stdout(), redaction, 160);
				return fallback("malformed-json", diagnostic, ` Candidate stdout began with: ${JSON.stringify(excerpt)}`);
			}
			if (isRecord(value) && value.protocol !== 1) return fallback("protocol-mismatch", diagnostic);
			const verdict = parseUpdateAdmissionVerdict(value);
			if (!verdict || outcome.value !== (verdict.verdict === "admit" ? 0 : 3)) return fallback("invalid-verdict", diagnostic);
			const safe = (diagnosticText) => redactSupportString(diagnosticText, redaction, {
				maxLength: UPDATE_RUN_TEXT_LIMIT - 3,
				truncationSuffix: "..."
			});
			return {
				owner: "candidate",
				verdict: {
					...verdict,
					reasons: verdict.reasons.map((reason) => ({
						code: reason.code,
						message: safe(reason.message),
						...reason.nextAction ? { nextAction: safe(reason.nextAction) } : {}
					})),
					warnings: verdict.warnings.map((warning) => ({
						code: warning.code,
						message: safe(warning.message)
					})),
					facts: {
						...verdict.facts,
						...verdict.facts.nodeEngines !== void 0 ? { nodeEngines: safe(verdict.facts.nodeEngines) } : {},
						checks: verdict.facts.checks.map((check) => Object.assign({
							name: check.name,
							status: check.status
						}, check.detail ? { detail: safe(check.detail) } : {}))
					}
				}
			};
		});
	} catch (error) {
		return fallback("internal-error", error instanceof Error ? error.message : String(error));
	}
}
//#endregion
//#region src/cli/update-cli/update-command-candidate-admission.ts
function createUpdateCandidateAdmissionReport({ target, opts, prepared }, error) {
	return {
		root: target.root,
		mode: target.mode,
		installKind: target.updateInstallKind,
		opts,
		controlPlaneUpdateSentinelMeta: prepared.controlPlaneUpdateSentinelMeta,
		reason: error.reason,
		message: error.message,
		nextAction: error.nextAction,
		failureFacts: error.failureFacts,
		stepResult: error.stepResult,
		recoverySteps: error.recoverySteps
	};
}
/** Inspect before lifecycle scripts, including when fresh state cannot yet host update history. */
async function inspectStagedUpdateCandidateAdmission(params) {
	return await withOwnedManagedUpdateEnv(params.env, async () => {
		const { target, opts, prepared } = params;
		const installTarget = target.packageInstallTarget;
		if (!installTarget) throw new Error("Candidate admission requires the resolved package installation.");
		await target.assertPackageRuntimeCurrent?.();
		await inspectUpdateManagedServices({
			...target,
			roots: [target.root],
			updateInstallKind: "package",
			shouldRestart: prepared.shouldRestart,
			jsonMode: Boolean(opts.json),
			timeoutMs: params.timeoutMs,
			invocationCwd: params.invocationCwd,
			expectedForeground: opts.run?.completionOwner === "gateway-restart" || prepared.controlPlaneUpdateSentinelMeta?.completionOwner === "gateway-restart" || void 0,
			handoffFromGateway: (state) => handoffUpdateFromGateway({
				state,
				root: target.root,
				opts,
				tag: target.channel === "extended-stable" ? void 0 : target.packageInstallSpec ?? target.tag,
				mode: target.mode,
				timeoutMs: params.timeoutMs,
				nodeRunner: target.packageUpdateNodeRunner,
				invocationCwd: params.invocationCwd,
				stopProgress: params.presentation.stop
			})
		});
		params.assertCurrent?.();
		const nodeRunner = target.packageUpdateNodeRunner ?? resolveNodeRunner();
		const candidateVersion = await readPackageVersion(params.candidateRoot);
		const result = await runUpdateCandidateAdmission({
			candidateRoot: params.candidateRoot,
			nodeRunner,
			env: process.env,
			timeoutMs: prepared.timeoutMs ?? await resolveUpdateCandidateAdmissionTimeoutMs({
				config: target.configSnapshot.config,
				stateDir: resolveStateDir(process.env),
				env: process.env,
				stepTimeoutMs: params.timeoutMs
			}),
			admission: opts.admission,
			context: {
				protocol: 1,
				installation: {
					root: target.root,
					canonicalRoot: resolveUpdateInstallRoot(target.root),
					version: target.currentVersion,
					installKind: prepared.installKind,
					packageManager: installTarget.manager,
					...installTarget.globalRoot ? { globalRoot: installTarget.globalRoot } : {}
				},
				target: {
					spec: target.packageInstallSpec ?? target.tag,
					version: candidateVersion ?? target.targetVersion,
					source: canResolveRegistryVersionForPackageTarget(target.packageInstallSpec ?? target.tag) ? "registry" : "artifact",
					channel: target.channel,
					tag: target.tag
				},
				request: {
					yes: Boolean(opts.yes),
					noRestart: !prepared.shouldRestart,
					acceptCapabilities: Boolean(opts.acceptCapabilities),
					json: Boolean(opts.json),
					timeoutMs: prepared.timeoutMs,
					requestedChannel: prepared.requestedChannel
				},
				run: { id: params.runId },
				supervisor: {
					version: VERSION,
					host: os.hostname(),
					pid: process.pid
				}
			}
		});
		params.assertCurrent?.();
		if (result.verdict?.verdict === "admit") {
			target.packageUpdateNodeRunner = nodeRunner;
			target.packageTargetSchemaVersions = parsePackageOpenClawSchemaVersions(await tryReadJson(path.join(params.candidateRoot, "package.json")));
			target.targetVersion ??= candidateVersion;
		}
		return result;
	});
}
/** Publish a buffered decision only after the installed process admits its history owner. */
function applyUpdateCandidateAdmission(params) {
	const { result, opts, target } = params;
	const run = opts.run;
	const verdict = result.verdict;
	if (run) {
		recordUpdateRunPhase(run.runId, "staging", {
			origin: {
				admission: {
					owner: result.owner,
					...verdict ? {
						protocol: verdict.protocol,
						candidateVersion: verdict.facts.candidateVersion,
						checks: verdict.facts.checks
					} : {},
					...result.fallbackReason ? { fallbackReason: result.fallbackReason } : {}
				},
				...verdict ? { candidateAdmission: verdict } : {}
			},
			...verdict ? { step: {
				step: "candidate-admission",
				status: verdict.verdict === "admit" ? "completed" : "failed",
				detail: JSON.stringify(verdict.facts.checks),
				endedAtMs: Date.now()
			} } : {}
		}, { env: run.env });
		for (const warning of [...result.warning ? [result.warning] : [], ...verdict?.warnings ?? []]) {
			recordUpdateRunStep(run.runId, {
				step: `warning:${warning.code}`,
				status: "completed",
				detail: warning.message
			}, { env: run.env });
			defaultRuntime.error(`Warning: ${warning.message}`);
		}
		if (verdict?.verdict === "admit") run.candidateAdmissionChecks = verdict.facts.checks.map((check) => check.name);
	}
	if (verdict?.verdict === "refuse") {
		const reason = verdict.reasons[0];
		throw new UpdatePreMutationError(reason.code, reason.message, {
			origin: "candidate-admission",
			nextAction: reason.nextAction,
			failureFacts: verdict.reasons.map((entry) => ({
				check: "candidate-admission",
				code: entry.code,
				message: entry.message
			}))
		});
	}
	if (!verdict?.facts.checks.some((check) => check.name === "config") && target.configReadFailure) throw target.configReadFailure;
}
/** Stage once; the installed process retains service and execution authority. */
async function withUpdateCandidateAdmission(params, execute) {
	const { target, opts, prepared } = params;
	const run = opts.run;
	try {
		const inspect = async (stage) => {
			await target.assertPackageRuntimeCurrent?.();
			const result = await inspectStagedUpdateCandidateAdmission({
				...params,
				candidateRoot: stage.root,
				runId: run.runId,
				assertCurrent: () => run.executorFence?.assertCurrent()
			});
			applyUpdateCandidateAdmission({
				target,
				opts,
				result
			});
			return await execute(stage);
		};
		if (params.candidateAdmission) {
			applyUpdateCandidateAdmission({
				target,
				opts,
				result: params.candidateAdmission
			});
			return await execute(params.stagedPackage);
		}
		if (target.packageAlreadyCurrent || !usesCandidateUpdateAdmission(opts, prepared.installKind) || target.updateInstallKind !== "package") {
			applyUpdateCandidateAdmission({
				target,
				opts,
				result: {
					owner: "installed",
					...opts.admission === "installed" ? { fallbackReason: "forced-installed" } : {}
				}
			});
			return await execute(params.stagedPackage);
		}
		if (params.stagedPackage) return await inspect(params.stagedPackage);
		await target.assertPackageRuntimeCurrent?.();
		return await withPrivateStagedPackageInstall({
			root: target.root,
			installKind: prepared.installKind,
			tag: target.tag,
			installSpec: target.packageInstallSpec ?? void 0,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: prepared.timeoutMs ?? null,
			startedAt: prepared.startedAt,
			progress: params.presentation.progress,
			invocationCwd: params.invocationCwd,
			nodeRunner: target.packageUpdateNodeRunner,
			installEnv: target.packageInstallEnv,
			installTarget: target.packageInstallTarget,
			pauseBeforeVerification: true,
			assertCurrent: () => run.executorFence?.assertCurrent()
		}, ({ stage }) => inspect(stage));
	} catch (error) {
		if (error instanceof UpdateCommandAbort && !hasCommandProcessCleanupError(error)) return;
		if (!(error instanceof UpdatePreMutationError)) throw error;
		return await reportPreMutationUpdateResult(createUpdateCandidateAdmissionReport(params, error));
	}
}
//#endregion
//#region src/cli/update-cli/update-command-package-destination.ts
/** Inspect the same destination the package transaction will write after a Node switch. */
async function inspectNpmGlobalDestination(root, installTarget) {
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
		...destinationRefusal(`Selected npm destination ${prefix ?? "(unresolved installation layout)"} could not be inspected (${cause}); ownership is unknown. No installation was attempted. Fix inspection permissions on this prefix for the service account, or restore the selected package layout, then run \`${retry}\`. Alternatively, ask the deployment owner to verify the layout and explicitly select the intended installation using its existing deployment procedure.`, {
			...destination,
			ownership: "unknown",
			cause
		})
	});
	let prefix = null;
	try {
		const destinationLayout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(installTarget.globalRoot, { allowDirectNodeModulesRoot: installTarget.directNodeModulesRoot === true });
		const packageRoot = installTarget.packageRoot;
		if (!destinationLayout || !packageRoot) return unknown(prefix, "unreadable-layout");
		prefix = destinationLayout.prefix;
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
//#region src/cli/update-cli/update-command-runtime-admission.ts
async function inspectPackageEngineAdmission(params) {
	const inspect = async (expectedServices) => await inspectUpdateManagedServices({
		roots: [params.root],
		updateInstallKind: "package",
		shouldRestart: params.shouldRestart === true,
		jsonMode: true,
		timeoutMs: params.timeoutMs,
		invocationCwd: params.invocationCwd,
		managedServiceRootRedirect: null,
		expectedServices
	});
	const admission = params.nodeRunner ? await inspect() : void 0;
	const observed = admission?.foreground ? void 0 : admission?.service ?? admission?.services.get(params.root);
	const service = observed ? {
		...observed,
		serviceUpdateVerdict: observed.serviceUpdateVerdict ? { ...observed.serviceUpdateVerdict } : void 0,
		serviceEnv: observed.serviceEnv ? { ...observed.serviceEnv } : void 0,
		serviceDefinitionEnv: observed.serviceDefinitionEnv ? { ...observed.serviceDefinitionEnv } : void 0
	} : void 0;
	const expectedServices = new Map(admission?.services);
	if (service) expectedServices.set(params.root, service);
	const runtime = await resolvePackageRuntimePreflight({
		...params,
		engineOnly: true,
		service
	});
	const selected = runtime.ok && runtime.value.replacedNodeRunner ? runtime.value : void 0;
	const assertCurrent = async () => {
		if (!selected?.activationRuntime || !admission || !service) return;
		const latest = await inspect(expectedServices);
		const current = latest.service ?? latest.services.get(params.root);
		const before = service.serviceUpdateVerdict;
		const after = current?.serviceUpdateVerdict;
		let executable;
		try {
			executable = capturePackageActivationRuntime("node", selected.nodeRunner);
		} catch (cause) {
			throw new UpdatePreMutationError("managed-service-preflight", "Selected Node is no longer available after engine admission; retry without staging the target.", { cause });
		}
		if (before?.kind !== "owned" || after?.kind !== "owned" || after.root !== before.root || after.fingerprint !== before.fingerprint || !after.refreshDefinition || after.requiresInstallRootRefresh || current?.serviceMutationAllowed === false || !isGatewayServiceManagementAllowedForUpdate(current?.serviceEnv ?? process.env) || !current?.running || !current.inspected || !current.runtimeInspected || current.serviceNodeRunner !== service.serviceNodeRunner || executable.path !== selected.activationRuntime.path || executable.identity !== selected.activationRuntime.identity) throw new UpdatePreMutationError("managed-service-preflight", "Gateway service authority or selected Node changed after engine admission; retry without staging the target.");
	};
	await assertCurrent();
	return {
		runtime,
		assertCurrent
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
function printManagedServicePackageUpdatePlan(params) {
	const { rootRedirect, nodeRunner } = params;
	if (rootRedirect) {
		defaultRuntime.log(theme.muted(`Targeting managed gateway service package root: ${rootRedirect.root}`));
		defaultRuntime.log(theme.warn(`Shell OpenClaw root differs from the managed gateway service root: ${rootRedirect.previousRoot}`));
		defaultRuntime.log(theme.muted(`After the update, make sure \`${CLI_NAME}\` on PATH resolves to the managed service root or reinstall the gateway service from the shell install you want to use.`));
		if (nodeRunner) defaultRuntime.log(theme.muted(`Managed gateway service runtime: ${nodeRunner}`));
	} else if (params.serviceRoot) defaultRuntime.log(theme.muted(`Updating this installation and rebinding the managed Gateway from ${params.serviceRoot} after ownership and runtime verification.`));
	else if (nodeRunner) {
		defaultRuntime.log(theme.warn(`Current runtime (${resolveNodeRunner()}) differs from the managed gateway service runtime (${nodeRunner}).`));
		defaultRuntime.log(theme.muted("Using the managed service runtime for this update so the gateway can start after the upgrade."));
	}
}
async function resolveUpdateCommandTarget(opts, recoveryState, invocationCwd, prepared, executor, updateStepTimeoutMs) {
	let preparingTarget = true;
	try {
		return await withCommandProcessScope(async () => {
			const { discoveredRoot, installKind, requestedChannel, controlPlaneUpdateSentinelMeta, timeoutMs } = prepared;
			const pkgOwnership = createSystemPackageOwnershipInspection(updateStepTimeoutMs);
			await pkgOwnership.assertUnowned(discoveredRoot);
			let { devTarget } = prepared;
			let root = prepared.servicePlan?.rootRedirect?.root ?? discoveredRoot;
			let updateInstallKind = installKind;
			let managedServiceRoot = prepared.servicePlan?.serviceRoot;
			let packageManager;
			const preflightSteps = [];
			const warn = (message) => opts.json ? defaultRuntime.error(`Warning: ${message}`) : defaultRuntime.log(theme.warn(message));
			const recordPreflightStep = (result) => {
				if (!opts.run) {
					preflightSteps.push(result);
					return;
				}
				for (const step of updateRunStepsFromResultStep(result)) recordUpdateCommandTarget(opts.run, { step });
			};
			recordNodeSecurityWarning(recordPreflightStep, root, prepared.nodeSecurityWarning);
			const resolveMode = async () => {
				return updateInstallKind === "git" ? "git" : packageManager || (await resolveUpdateInstallSurface({
					root,
					installKind,
					timeoutMs: updateStepTimeoutMs,
					runCommand: runCommandWithTimeout
				})).mode;
			};
			const refuseUpdate = async (reason, message, failureFacts, recoverySteps) => {
				const report = {
					root,
					serviceRoot: managedServiceRoot,
					installKind: updateInstallKind,
					mode: reason === "invalid-config" || reason === "config-read-failed" ? packageManager : await resolveMode(),
					reason,
					message,
					failureFacts,
					recoverySteps,
					...preflightSteps.length ? { stepResult: {
						steps: preflightSteps,
						failedStep: preflightSteps.findLast(isFailedUpdateStep)
					} } : {},
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
					serviceRoot: servicePlan.serviceRoot,
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
			const readChannelConfig = () => readUpdateChannelConfig(Boolean(opts.channel), { tolerateReadFailure: usesCandidateUpdateAdmission(opts, installKind) });
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
			const { configSnapshot, configReadFailure, legacyConfigPlan, storedChannel } = channelConfig;
			if (opts.channel && !configSnapshot.valid && !legacyConfigPlan && !usesCandidateUpdateAdmission(opts, installKind)) {
				const failure = createUpdateConfigFailure(configSnapshot);
				await refuseUpdate(failure.reason, failure.message, failure.failureFacts);
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
			if (updateInstallKind !== "package") {
				root = discoveredRoot;
				managedServiceRoot = void 0;
			}
			if (updateInstallKind !== "package" && configReadFailure) throw configReadFailure;
			if (opts.channel && !configSnapshot.valid && !legacyConfigPlan && updateInstallKind !== "package" && usesCandidateUpdateAdmission(opts, installKind)) {
				const failure = createUpdateConfigFailure(configSnapshot);
				await refuseUpdate(failure.reason, failure.message, failure.failureFacts);
				return;
			}
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
			let installedPackageName;
			let packageAlreadyCurrent = false;
			let packageTargetSchemaVersions;
			let packageRuntimeTarget;
			let managedServiceRootRedirect = null;
			let managedServiceNodeRunner;
			let packageUpdateNodeRunner;
			let admittedPackageRuntime;
			let assertPackageRuntimeCurrent;
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
				root = managedServiceRootRedirect?.root ?? discoveredRoot;
				if (!opts.json) printManagedServicePackageUpdatePlan(servicePlan);
				packageUpdateNodeRunner = managedServiceRoot && !process.versions.bun ? resolveNodeRunner() : managedServiceNodeRunner;
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
			if (updateInstallKind === "package") {
				recoveryState.triageTarget.root = root;
				recoveryState.triageTarget.nodeRunner = packageUpdateNodeRunner;
				installedPackageName = await readPackageName(root) ?? "openclaw";
				const manager = await resolveGlobalManager({
					root,
					installKind,
					timeoutMs: updateStepTimeoutMs,
					pkgOwnership,
					serviceUnitTarget
				}).catch(async (error) => {
					if (hasCommandProcessCleanupError(error) || !(error instanceof UpdatePreMutationError)) throw error;
					const report = {
						root,
						serviceRoot: managedServiceRoot,
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
					manager: manager === "bun" && packageUpdateNodeRunner && isBunRuntime(packageUpdateNodeRunner) ? {
						manager,
						command: packageUpdateNodeRunner
					} : manager,
					runCommand: runCommandWithTimeout,
					timeoutMs: updateStepTimeoutMs,
					pkgRoot: root,
					honorPackageRoot: managedServiceRootRedirect !== null || managedServiceRoot !== void 0 || managedServiceNodeRunner !== void 0,
					packageName: installedPackageName,
					pkgOwnership
				});
				packageInstallEnv = await createGlobalInstallEnv(void 0, packageInstallTarget);
				if (packageInstallTarget.manager === "npm") {
					const destination = await inspectNpmGlobalDestination(root, packageInstallTarget);
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
					warn(diskWarning);
					opts.run?.executorFence?.assertCurrent();
					recordPreflightStep({
						name: "disk-space-preflight",
						command: "disk-space-preflight",
						cwd: root,
						durationMs: 0,
						exitCode: 0,
						warnings: [diskWarning]
					});
				}
				const npmLifecycleGate = resolveNpmLifecyclePolicyGate(packageInstallTarget);
				if (npmLifecycleGate.error) {
					await refuseUpdate("npm lifecycle policy preflight", npmLifecycleGate.error);
					return;
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
				const npmMetadataOptions = {
					command: packageInstallTarget?.manager === "npm" ? packageInstallTarget.command : void 0,
					cwd: invocationCwd,
					env: packageInstallEnv
				};
				const packageSpec = (targetTag) => resolveGlobalInstallSpec({
					packageName: DEFAULT_PACKAGE_NAME,
					tag: targetTag,
					env: packageInstallEnv
				});
				let targetMetadata;
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
				} else if (explicitTag) {
					const resolved = await resolveTargetVersion(tag, timeoutMs, {
						spec: packageSpec(tag),
						...npmMetadataOptions
					});
					targetVersion = resolved.version;
					targetMetadata = resolved.metadata;
				} else {
					const resolved = await resolveNpmChannelTag({
						channel,
						timeoutMs,
						...npmMetadataOptions
					});
					tag = resolved.tag;
					fallbackToLatest = channel === "beta" && resolved.tag === "latest";
					targetVersion = resolved.version;
					targetMetadata = resolved.metadata;
				}
				const cmp = currentVersion && targetVersion ? compareSemverStrings(currentVersion, targetVersion) : null;
				packageInstallSpec ??= packageSpec(tag);
				packageAlreadyCurrent = !managedServiceRoot && !switchToPackage && isPackageTargetAlreadyCurrent({
					currentVersion,
					targetVersion,
					target: packageInstallSpec
				});
				downgradeRisk = canResolveRegistryVersionForPackageTarget(tag) && !fallbackToLatest && currentVersion != null && (targetVersion == null ? tag !== "latest" : cmp != null && cmp > 0);
				if (targetVersion) {
					if (packageSpec(targetVersion) !== `openclaw@${targetVersion}`) targetMetadata = void 0;
					targetMetadata ??= await fetchNpmPackageTargetStatus({
						target: targetVersion,
						timeoutMs,
						spec: packageSpec(targetVersion),
						...npmMetadataOptions
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
					if (canResolveRegistryVersionForPackageTarget(tag)) packageInstallSpec = packageSpec(targetVersion);
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
			if (updateInstallKind === "package" && !opts.dryRun && !packageAlreadyCurrent && canResolveRegistryVersionForPackageTarget(packageInstallSpec ?? tag) && packageRuntimeTarget?.nodeEngine) {
				const runtimeAdmission = await inspectPackageEngineAdmission({
					channel,
					requestedChannel,
					target: packageRuntimeTarget,
					root,
					nodeRunner: managedServiceNodeRunner ?? packageUpdateNodeRunner,
					timeoutMs: updateStepTimeoutMs,
					shouldRestart: prepared.shouldRestart,
					invocationCwd
				}).catch(async (error) => {
					if (hasCommandProcessCleanupError(error) || !(error instanceof UpdatePreMutationError)) throw error;
					await refuseUpdate(error.reason, error.message, error.failureFacts, error.recoverySteps);
				});
				if (!runtimeAdmission) return;
				const { runtime, assertCurrent } = runtimeAdmission;
				if (!runtime.ok) {
					await refuseUpdate("preflight-node-runtime-incompatible", runtime.error, runtime.failureFacts, runtime.recoverySteps);
					return;
				}
				if (runtime.value.replacedNodeRunner) {
					packageUpdateNodeRunner = runtime.value.nodeRunner;
					admittedPackageRuntime = runtime.value.activationRuntime;
					assertPackageRuntimeCurrent = assertCurrent;
				}
				const runtimeWarning = runtime.value.nodeSecurityWarning;
				if (runtimeWarning && runtimeWarning !== prepared.nodeSecurityWarning) {
					warn(`SECURITY WARNING: ${runtimeWarning}`);
					recordNodeSecurityWarning(recordPreflightStep, root, runtimeWarning);
				}
			}
			if (updateInstallKind === "package" && !packageAlreadyCurrent && !opts.dryRun && (!usesCandidateUpdateAdmission(opts, installKind) || configSnapshot.valid && !configReadFailure)) {
				const env = opts.run?.env ?? process.env;
				const source = await readUpdateCandidateSource(env, legacyConfigPlan);
				const snapshot = await assessInitialUpdateSnapshotCapacity({
					config: source.config,
					stateDir: resolveStateDir(env),
					env
				});
				opts.run?.executorFence?.assertCurrent();
				recordPreflightStep(snapshot);
				if (snapshot.exitCode !== 0) {
					await refuseUpdate("snapshot-capacity-insufficient", snapshot.stderrTail ?? void 0);
					return;
				}
				for (const warning of snapshot.warnings ?? []) warn(warning);
			}
			return {
				root,
				...inspectionWarning ? { inspectionWarning } : {},
				...preflightSteps.length ? { preflightSteps } : {},
				mode: await resolveMode(),
				updateInstallKind,
				refuseUpdate,
				configSnapshot,
				configReadFailure,
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
				...assertPackageRuntimeCurrent ? { assertPackageRuntimeCurrent } : {},
				...admittedPackageRuntime ? { admittedPackageRuntime } : {},
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
export { inspectStagedUpdateCandidateAdmission as a, createUpdateCandidateAdmissionReport as i, resolveUpdateCommandTarget as n, withUpdateCandidateAdmission as o, applyUpdateCandidateAdmission as r, resolveFreshUpdateMetadata as t };
