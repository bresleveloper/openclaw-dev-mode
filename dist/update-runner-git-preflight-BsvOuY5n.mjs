import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { n as DEV_BRANCH } from "./update-channels-l0GQCX9n.mjs";
import { o as resolveControlUiAssetHealth } from "./control-ui-assets-f8KcxxVR.mjs";
import { n as readPackageManagerSpec } from "./package-json-B0xzRYh1.mjs";
import { a as resolveDevUpdateTargetRevision } from "./update-dev-target-yMMMhCo4.mjs";
import { n as readGitTargetSchemaVersions, o as resolveGitUpdateTrackingRef } from "./update-git-metadata-Bci7Iprk.mjs";
import { b as UpdatePreMutationError } from "./update-global-BlXQRfes.mjs";
import { a as runStep, i as reportUpdateStepCompletion } from "./update-runner-command-DETznIV7.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { r as resolveUpdateBuildManager, t as parsePnpmPackageManagerVersion } from "./update-package-manager-BK5Ltzin.mjs";
import { n as cleanupGitPreflight } from "./update-runner-git-cleanup-DohV8M13.mjs";
import { a as gitCleanCheckArgs, c as resolveBuildEnv, d as shouldInstallWithoutScriptsOnWindows, f as shouldRunDevPreflightLint, i as createPreflightRoot, l as resolveDevPreflightLintEnv, n as classifyPreflightFailure, o as prepareCandidateCommandEnv, r as createGitStepFactory, s as resetPreflightCandidateWorktree, t as buildDevTargetRefResolutionCandidates, u as resolveTagFetchRef } from "./update-runner-git-commands-X6nu_XbS.mjs";
import { t as prepareGitCandidateNodeRuntime } from "./update-runner-git-node-preflight-BluX5QoJ.mjs";
import path from "node:path";
//#region src/infra/update-runner-git-steps.ts
/** Publish completion only after the Git owner classifies its result. */
async function runClassifiedGitStep(options, classify) {
	const result = await runStep({
		...options,
		progress: {
			...options.progress,
			onStepComplete: void 0
		}
	});
	const classified = classify(result);
	await reportUpdateStepCompletion(options.progress, {
		...result,
		index: options.stepIndex,
		total: options.totalSteps
	});
	return classified;
}
function runGitCleanCheckStep(options) {
	return runClassifiedGitStep(options, (result) => {
		const dirty = !isFailedUpdateStep(result) && Boolean(result.stdoutTail?.trim());
		if (dirty) {
			result.exitCode = 1;
			result.stderrTail = "This checkout has local changes. Installation has not started.";
		}
		return {
			result,
			dirty
		};
	});
}
function runGitUpstreamStep(options) {
	return runClassifiedGitStep(options, (upstreamStep) => {
		if (typeof upstreamStep.exitCode === "number" && upstreamStep.exitCode !== 0 && !upstreamStep.signal && !upstreamStep.killed && !upstreamStep.outputLimitExceeded && (!upstreamStep.termination || upstreamStep.termination === "exit") && upstreamStep.exitCode !== 130 && upstreamStep.exitCode !== 143) {
			const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
			upstreamStep.advisory = {
				kind: "recoverable-maintenance",
				message: `Skipped Git upstream tracking setup. Complete it with: git ${options.argv.slice(1).map(quote).join(" ")}. Reason: ${upstreamStep.stderrTail || "git branch failed"}`
			};
		}
		return upstreamStep;
	});
}
async function runGitActivationBranchCheckStep(stepOptions, branch) {
	const devBranchRef = `refs/heads/${branch}`;
	return runStep({
		...stepOptions,
		runCommand: async (argv, options) => {
			const exists = await stepOptions.runCommand([
				"git",
				"-C",
				stepOptions.cwd,
				"show-ref",
				"--verify",
				"--quiet",
				devBranchRef
			], options);
			if (exists.code === 1) return {
				...exists,
				code: 0,
				stdout: "",
				stderr: ""
			};
			if (exists.code !== 0) return {
				...exists,
				stdout: "",
				stderr: `Could not inspect local branch ${branch} before activation. Resolve the Git branch error, then rerun openclaw update.`
			};
			const result = await stepOptions.runCommand(argv, options);
			const sanitized = {
				...result,
				stdout: ""
			};
			return result.code !== 0 ? {
				...sanitized,
				stderr: `Cannot activate this dev update because a Git worktree uses or reserves branch ${branch}. Finish or abort its rebase or bisect, or move it off ${branch}, then rerun openclaw update.`
			} : sanitized;
		}
	});
}
/**
* Immediate rollback resets and cleans the checkout. Activation admitted a clean tree,
* so changes seen before runtime restoration belong to the operator. Returns a failed
* step that refuses the destructive restore to keep them, or undefined when clean.
*/
async function readGitRollbackPreservation(params) {
	const { beforeSha, branch, gitRoot } = params;
	const argv = gitCleanCheckArgs(gitRoot, params.sourceTreeStagingPaths);
	const { runCommand, cwd, timeoutMs } = params.recoveryStep("git-rollback-preserve", argv, gitRoot);
	params.assertCurrent();
	const status = await runCommand(argv, {
		cwd,
		timeoutMs
	});
	params.assertCurrent();
	const changes = status.code === 0 ? status.stdout.trim() : "Could not read the checkout status.";
	if (!changes) return;
	const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
	const git = `git -C ${quote(gitRoot)}`;
	const restore = branch && branch !== "HEAD" ? `${git} checkout ${quote(branch)}, then ${git} reset --keep ${beforeSha}` : `${git} checkout --detach ${beforeSha}`;
	return {
		name: "git-rollback-preserve",
		command: argv.join(" "),
		cwd: gitRoot,
		durationMs: 0,
		exitCode: 1,
		stderrTail: `${changes}
Source rollback was refused so these changes are kept; the previous runtime is still restored. After saving your changes, restore the checkout with: ${restore}`
	};
}
async function runGitRollbackSteps({ beforeSha, branch, gitRoot, createdDevBranchDuringUpdate, sourceTreeStagingPaths, recoveryStep, checkSourceUnchanged, assertCurrent, activatedSource }) {
	if (!beforeSha) return false;
	let source = activatedSource;
	const assertSourceCurrent = async () => {
		assertCurrent();
		if (source && await checkSourceUnchanged(source.sha, source.branch, assertCurrent)) throw new Error("Git checkout changed after activation; retained rollback was refused.");
		assertCurrent();
	};
	const execute = async (name, args, expectedSource = source, refChange) => {
		if (source) await assertSourceCurrent();
		assertCurrent();
		const stepOptions = recoveryStep(name, refChange === "keep" ? args : [
			"git",
			"-C",
			gitRoot,
			...args
		], gitRoot);
		const result = await runClassifiedGitStep({
			...stepOptions,
			runCommand: async (argv, options) => {
				assertCurrent();
				if (refChange === "keep") return {
					code: 0,
					stdout: "",
					stderr: ""
				};
				const commandResult = await stepOptions.runCommand(argv, options);
				if (refChange === "rewrite" && source && branch && commandResult.code === 0) {
					const ref = `refs/heads/${branch}`;
					const previous = await stepOptions.runCommand([
						"git",
						"-C",
						gitRoot,
						"rev-parse",
						"--verify",
						`${ref}@{1}`
					], options);
					const current = await stepOptions.runCommand([
						"git",
						"-C",
						gitRoot,
						"rev-parse",
						"--verify",
						ref
					], options);
					assertCurrent();
					const previousSha = previous.code === 0 ? previous.stdout.trim() : void 0;
					const currentSha = current.code === 0 ? current.stdout.trim() : void 0;
					if (previousSha !== source.sha || currentSha !== beforeSha) {
						const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
						const recovery = currentSha === beforeSha && previousSha && previousSha !== source.sha ? `After inspecting the reflog and preserving local edits, detach with: git checkout --detach --no-overwrite-ignore. If the branch still points to ${beforeSha}, restore the intended ref with: git branch -f ${quote(branch)} ${previousSha}` : `Inspect git reflog ${quote(branch)} and keep the newest intended commit.`;
						return {
							...commandResult,
							code: 1,
							stderr: `Cannot verify rollback branch transition: expected ${source.sha} -> ${beforeSha}, observed ${previousSha || "unavailable reflog"} -> ${currentSha || "unreadable ref"}. Previous runtime retained. ${recovery}`
						};
					}
				}
				return commandResult;
			}
		}, (rollbackStep) => {
			if (refChange === "keep" && activatedSource) {
				const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
				rollbackStep.advisory = {
					kind: "recoverable-maintenance",
					message: `Kept branch ${DEV_BRANCH} created by this update at ${activatedSource.sha}. Once no worktree uses it, remove it with: git branch -d ${quote(DEV_BRANCH)}`
				};
			} else if (refChange === "detach" && source && branch && !isFailedUpdateStep(rollbackStep)) {
				const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
				const git = `git -C ${quote(gitRoot)}`;
				rollbackStep.advisory = {
					kind: "recoverable-maintenance",
					message: `Restored ${quote(gitRoot)} to ${beforeSha} on a detached HEAD; branch ${quote(branch)} still points to ${source.sha} because it has no reflog to verify a rollback rewrite. Once no worktree uses it, restore it with: ${git} update-ref ${quote(`refs/heads/${branch}`)} ${beforeSha} ${source.sha}, then ${git} switch ${quote(branch)}. Enable reflogs with: ${git} config core.logAllRefUpdates true`
				};
			}
			return rollbackStep;
		});
		assertCurrent();
		if (source) {
			if (isFailedUpdateStep(result)) throw new Error(`Git source rollback failed at ${name}; previous runtime retained.${result.stderrTail ? ` ${result.stderrTail}` : ""}`);
			source = expectedSource;
			await assertSourceCurrent();
		}
		return result;
	};
	const restore = async (name, args, expectedSource = source, refChange) => !isFailedUpdateStep(await execute(name, args, expectedSource, refChange));
	let restored = true;
	if (!source) {
		restored = await restore("git-rollback-clean", ["reset", "--hard"]);
		restored = await restore("git-rollback-clean-untracked", [
			"clean",
			"-fd",
			"-e",
			"dist/control-ui/",
			...sourceTreeStagingPaths?.flatMap((relative) => ["-e", `/${relative}/`]) ?? []
		]) && restored;
	}
	const attached = branch && branch !== "HEAD";
	const checkedOut = await restore("git-rollback-checkout", attached ? [
		"checkout",
		source ? "--no-overwrite-ignore" : "--force",
		branch
	] : [
		"checkout",
		"--detach",
		...source ? ["--no-overwrite-ignore"] : [],
		beforeSha
	], source ? {
		sha: attached && branch === source.branch ? source.sha : beforeSha,
		branch: attached ? branch : "HEAD"
	} : void 0);
	if (attached && checkedOut) {
		if (source) {
			if (source.sha !== beforeSha) {
				const { runCommand, cwd, timeoutMs } = recoveryStep("git-rollback-source", [], gitRoot);
				const options = {
					cwd,
					timeoutMs
				};
				const ref = `refs/heads/${branch}`;
				const reflog = await runCommand([
					"git",
					"-C",
					gitRoot,
					"reflog",
					"exists",
					ref
				], options);
				assertCurrent();
				const latest = reflog.code === 0 ? await runCommand([
					"git",
					"-C",
					gitRoot,
					"rev-parse",
					"--verify",
					`${ref}@{0}`
				], options) : reflog;
				assertCurrent();
				const rewrite = latest.code === 0 && Boolean(latest.stdout.trim());
				await restore("git-rollback-source", rewrite ? [
					"checkout",
					"--no-overwrite-ignore",
					"-B",
					branch,
					beforeSha
				] : [
					"checkout",
					"--detach",
					"--no-overwrite-ignore",
					beforeSha
				], {
					sha: beforeSha,
					branch: rewrite ? branch : "HEAD"
				}, rewrite ? "rewrite" : "detach");
			}
		} else restored = await restore("git-rollback-reset", [
			"reset",
			"--hard",
			beforeSha
		]) && restored;
	}
	if (createdDevBranchDuringUpdate && (!attached || checkedOut)) {
		if (activatedSource) await execute("git-rollback-keep-branch", [
			"keep",
			"branch",
			DEV_BRANCH
		], source, "keep");
		else await restore("git-rollback-delete-branch", [
			"branch",
			"-D",
			DEV_BRANCH
		]);
	}
	const head = await execute("git-rollback-verify-head", ["rev-parse", "HEAD"]);
	const verified = !isFailedUpdateStep(head) && head.stdoutTail?.trim() === beforeSha;
	head.exitCode = verified ? 0 : 1;
	if (!verified) head.stderrTail = `expected ${beforeSha}, found ${head.stdoutTail?.trim() || "unreadable HEAD"}`;
	return restored && checkedOut && verified;
}
//#endregion
//#region src/infra/update-runner-git-preflight.ts
const PREFLIGHT_MAX_COMMITS = 10;
const PREFLIGHT_WORKTREE_DIRNAME = process.platform === "win32" ? "wt" : "worktree";
async function resolveExplicitTarget(params) {
	const step = createGitStepFactory(params.gitRoot, params.step);
	const workStep = createGitStepFactory(params.gitRoot, params.workStep);
	const warnings = [];
	for (const candidate of buildDevTargetRefResolutionCandidates(params.devTargetRef)) {
		if (candidate.startsWith("refs/remotes/") && !params.refreshedRemotes.some((remote) => candidate.startsWith(`refs/remotes/${remote}/`))) continue;
		const tagFetchRef = resolveTagFetchRef(candidate);
		if (tagFetchRef) {
			const remoteStep = await runStep(step("git-remote", "remote"));
			if (isFailedUpdateStep(remoteStep)) return null;
			const remotes = normalizeStringEntries((remoteStep.stdoutTail ?? "").split("\n"));
			let fetchedTag = false;
			for (const remote of remotes) {
				const fetchOutcome = await runClassifiedGitStep(workStep("git-fetch-target-tag", "fetch", remote, `+${tagFetchRef}:${tagFetchRef}`), (fetchStep) => {
					const interrupted = fetchStep.termination === "signal" || fetchStep.exitCode === 130 || fetchStep.exitCode === 143;
					const fetchedSuccessfully = fetchStep.exitCode === 0 && !isFailedUpdateStep(fetchStep);
					if (!fetchedSuccessfully && !interrupted) {
						fetchStep.advisory = {
							kind: "recoverable-maintenance",
							message: `Could not fetch the requested tag from ${remote}; trying another remote. ${fetchStep.stderrTail ?? ""}`
						};
						warnings.push(fetchStep.advisory.message);
					}
					if (warnings.length > 0) fetchStep.warnings = [...warnings];
					return {
						interrupted,
						fetchedSuccessfully
					};
				});
				if (fetchOutcome.interrupted) return null;
				if (fetchOutcome.fetchedSuccessfully) {
					fetchedTag = true;
					break;
				}
			}
			if (remotes.length > 0 && !fetchedTag) continue;
		}
		const shaStep = await runStep(step("git-resolve-target", "rev-parse", candidate));
		const sha = shaStep.stdoutTail?.trim();
		if (!isFailedUpdateStep(shaStep) && sha) return sha;
	}
	return null;
}
async function resolveUpstreamCandidates(params) {
	const step = createGitStepFactory(params.gitRoot, params.step);
	let localDevBranchExists = null;
	if (params.needsCheckoutMain) localDevBranchExists = (await runStep(step("git-show-branch", "show-ref", "--verify", `refs/heads/${DEV_BRANCH}`))).exitCode === 0;
	const readGit = async (...args) => {
		const result = await runStep(step("upstream-check", ...args));
		return !isFailedUpdateStep(result) ? result.stdoutTail?.trim() || null : null;
	};
	const source = params.devSource;
	if (!source || source.remote !== "." && !params.refreshedRemotes.includes(source.remote)) return {
		status: "skipped",
		reason: "no-upstream"
	};
	const upstreamRef = await resolveGitUpdateTrackingRef(readGit, DEV_BRANCH, source);
	if (!upstreamRef) return {
		status: "skipped",
		reason: "no-upstream"
	};
	const upstreamSha = await readGit("rev-parse", "--verify", `${upstreamRef}^{commit}`);
	if (!upstreamSha) return {
		status: "error",
		reason: "no-upstream-sha"
	};
	const selectedDevUpstream = upstreamRef.startsWith("refs/heads/") ? null : upstreamRef;
	const revListStep = await runStep(step("git-rev-list", "rev-list", `--max-count=${PREFLIGHT_MAX_COMMITS}`, upstreamSha));
	if (isFailedUpdateStep(revListStep)) return {
		status: "error",
		reason: "preflight-revlist-failed"
	};
	const candidates = normalizeStringEntries((revListStep.stdoutTail ?? "").split("\n"));
	if (candidates.length === 0) return {
		status: "error",
		reason: "preflight-no-candidates"
	};
	return {
		status: "ok",
		sha: upstreamSha,
		candidates,
		selectedDevUpstream,
		localDevBranchExists
	};
}
async function testPreflightCandidate(params) {
	if (!await resetPreflightCandidateWorktree(params.worktreeDir, params.workStep)) return { status: "failed" };
	const runCandidateCheck = async (name, argv, env, factory = params.workStep) => {
		const check = factory(`preflight-${name}`, argv, params.worktreeDir, env);
		const result = await runStep(check);
		return isFailedUpdateStep(result) ? result : null;
	};
	const checkout = await runCandidateCheck("checkout", [
		"git",
		"-C",
		params.worktreeDir,
		"checkout",
		"--detach",
		params.sha
	]);
	if (checkout) return { status: classifyPreflightFailure(checkout) };
	if (params.rebaseFrom) {
		const rebase = await runCandidateCheck("local-checkout", [
			"git",
			"-C",
			params.worktreeDir,
			"checkout",
			"--detach",
			params.rebaseFrom
		]) ?? await runCandidateCheck("rebase", [
			"git",
			"-C",
			params.worktreeDir,
			"rebase",
			...params.referenceSource ? ["--rebase-merges"] : [],
			params.sha
		]);
		if (rebase) {
			await runCandidateCheck("rebase-abort", [
				"git",
				"-C",
				params.worktreeDir,
				"rebase",
				"--abort"
			], void 0, params.step);
			return { status: classifyPreflightFailure(rebase) };
		}
	}
	const candidateHead = await params.runCommand([
		"git",
		"-C",
		params.worktreeDir,
		"rev-parse",
		"HEAD"
	], {
		cwd: params.worktreeDir,
		timeoutMs: params.timeoutMs
	});
	if (candidateHead.code !== 0 || !candidateHead.stdout.trim()) return { status: "failed" };
	const candidateSha = candidateHead.stdout.trim();
	await params.beforeCandidate(candidateSha);
	await params.referenceSource?.copyBuildInputs(params.worktreeDir);
	if (params.frozenLockfile && !parsePnpmPackageManagerVersion(await readPackageManagerSpec(params.worktreeDir))) return {
		status: "manager-unavailable",
		reason: "immutable-pnpm-pin-required"
	};
	const nodeRuntime = await prepareGitCandidateNodeRuntime(params.worktreeDir, params.defaultCommandEnv);
	if (nodeRuntime.step) {
		params.steps.push(nodeRuntime.step);
		return { status: "node-runtime-incompatible" };
	}
	if (params.referenceSource) {
		const version = parsePnpmPackageManagerVersion(await readPackageManagerSpec(params.worktreeDir));
		const probe = await runStep({
			...params.step("preflight-package-manager", ["pnpm", "--version"], params.worktreeDir, nodeRuntime.env),
			runCommand: async (argv, options) => {
				const result = version ? await params.runCommand(argv, options) : {
					code: 1,
					stdout: "",
					stderr: ""
				};
				return version && result.stdout.trim() === version ? result : {
					...result,
					code: 1,
					stderr: "Reference source updates require an exact pnpm packageManager pin supported by the scoped Corepack shim. Repair Corepack or the candidate pin, then retry."
				};
			}
		});
		if (isFailedUpdateStep(probe)) return {
			status: "manager-unavailable",
			reason: "reference-source-pnpm-unavailable"
		};
	}
	const manager = params.referenceSource ? {
		kind: "resolved",
		manager: "pnpm",
		fallback: false
	} : await resolveUpdateBuildManager(params.runCommand, params.worktreeDir, params.timeoutMs, nodeRuntime.env, { timeoutMs: params.workTimeoutMs });
	if (manager.kind === "missing-required") {
		params.steps.push({
			name: "preflight-package-manager",
			command: `resolve ${manager.preferred} package manager`,
			cwd: params.worktreeDir,
			durationMs: 0,
			exitCode: 1,
			stderrTail: manager.reason
		});
		return {
			status: "manager-unavailable",
			reason: manager.reason
		};
	}
	try {
		const preferIgnoreScripts = !params.referenceSource && shouldInstallWithoutScriptsOnWindows(manager.manager);
		const installArgv = [
			manager.manager,
			"install",
			...preferIgnoreScripts ? ["--ignore-scripts"] : manager.fallback && manager.manager === "npm" ? ["--no-package-lock", "--legacy-peer-deps"] : []
		];
		const installName = preferIgnoreScripts ? "deps-install-ignore-scripts" : "deps-install";
		if (params.referenceSource || params.frozenLockfile) installArgv.push("--frozen-lockfile");
		const candidateCommand = await prepareCandidateCommandEnv(manager.manager, manager.env ?? nodeRuntime.env, params.worktreeDir, params.runCommand, params.timeoutMs);
		const scriptArgs = (script) => manager.manager === "pnpm" ? ["pnpm", script] : [
			manager.manager,
			"run",
			script
		];
		const buildEnv = resolveBuildEnv(candidateCommand.env, path.join(params.artifactRoot, ".artifacts", "build-all-cache"));
		buildEnv.sourceRuntimePrepared = params.sourceRuntimePrepared?.toString();
		let failure = await runCandidateCheck(installName, installArgv, candidateCommand.env) ?? await runCandidateCheck("build", scriptArgs("build"), buildEnv);
		if (!failure && (await resolveControlUiAssetHealth({ root: params.worktreeDir })).kind !== "ready") failure = await runCandidateCheck("ui-build", scriptArgs("ui:build"), candidateCommand.env);
		if (!failure && (await resolveControlUiAssetHealth({ root: params.worktreeDir })).kind !== "ready") {
			params.steps.push({
				name: "preflight-ui-assets-verify",
				command: "verify startup assets",
				cwd: params.worktreeDir,
				durationMs: 0,
				exitCode: 1,
				stderrTail: "Update Control UI startup assets are missing or incomplete"
			});
			return { status: "failed" };
		}
		if (!failure && params.runLint) failure = await runCandidateCheck("lint", scriptArgs("lint"), resolveDevPreflightLintEnv(candidateCommand.env));
		if (failure) return { status: classifyPreflightFailure(failure) };
		await params.prepareGitExposure?.(params.worktreeDir, candidateSha, candidateCommand.env);
		await candidateCommand.restoreWorkspace?.();
		params.steps.push(...await params.validateCandidate(params.worktreeDir) ?? []);
		const { result: cleanCheck } = await runGitCleanCheckStep(params.step("preflight-update-clean-check", params.referenceSource ? [
			"git",
			"-C",
			params.worktreeDir,
			"status",
			"--porcelain",
			"--untracked-files=no"
		] : gitCleanCheckArgs(params.worktreeDir), params.worktreeDir));
		if (isFailedUpdateStep(cleanCheck)) return { status: "failed" };
		const sourceCheck = await runCandidateCheck("update-source-check", [
			"git",
			"-C",
			params.worktreeDir,
			"diff",
			"--quiet",
			candidateSha,
			"--"
		], void 0, params.step);
		if (sourceCheck) {
			sourceCheck.stderrTail = "Update source differs from the selected commit. Repair the source revision before retrying the update.";
			return { status: "failed" };
		}
		await params.prepareCandidate?.(params.worktreeDir, params.preflightRoot);
		return {
			status: "ok",
			candidateSha
		};
	} finally {
		await manager.cleanup?.();
	}
}
async function runGitCandidatePreflight(params) {
	const step = createGitStepFactory(params.gitRoot, params.step);
	const workStep = createGitStepFactory(params.gitRoot, params.workStep);
	if (params.referenceSource) {
		if (!params.targetRevision || !params.beforeSha) throw new Error("Reference source preparation requires the original HEAD and pinned target.");
		if (params.referenceSource.branch === "main") {
			const ancestry = await runStep(step("reference-source-fast-forward", "merge-base", "--is-ancestor", params.beforeSha, params.targetRevision));
			if (isFailedUpdateStep(ancestry)) return {
				status: "error",
				reason: "reference-source-not-fast-forward"
			};
		}
	}
	const devTargetRef = params.devTarget ? normalizeNullableString(resolveDevUpdateTargetRevision(params.devTarget)) : null;
	let candidates;
	let selectedDevUpstream = null;
	let localDevBranchExists = null;
	if (params.targetRevision) {
		const result = await params.runCommand([
			"git",
			"-C",
			params.gitRoot,
			"rev-parse",
			`${params.targetRevision}^{commit}`
		], {
			cwd: params.gitRoot,
			timeoutMs: params.timeoutMs
		});
		if (result.code !== 0 || !result.stdout.trim()) return {
			status: "error",
			reason: "no-target-sha"
		};
		candidates = [result.stdout.trim()];
	} else if (devTargetRef) {
		const targetSha = await resolveExplicitTarget({
			...params,
			devTargetRef
		});
		if (!targetSha) return {
			status: "error",
			reason: "no-target-sha"
		};
		candidates = [targetSha];
		if (params.devTarget?.mode === "tracked") {
			const ancestryStep = await runStep(step("tracked-target-ancestry", "merge-base", "--is-ancestor", targetSha, `${params.devSource?.revision ?? params.devTarget.upstreamRef}^{commit}`));
			if (isFailedUpdateStep(ancestryStep)) return {
				status: "error",
				reason: "tracked-upstream-invalid"
			};
		}
	} else {
		const upstream = await resolveUpstreamCandidates(params);
		if (upstream.status !== "ok") return upstream;
		candidates = upstream.candidates;
		selectedDevUpstream = upstream.selectedDevUpstream;
		localDevBranchExists = upstream.localDevBranchExists;
	}
	const canSkipActivation = !params.referenceSource && !params.prepareGitExposure && params.beforeRuntimeVerified;
	const rebaseFrom = params.referenceSource ? params.referenceSource.branch === "main" ? void 0 : params.beforeSha ?? void 0 : !params.targetRevision && !params.devTarget && localDevBranchExists !== false ? params.needsCheckoutMain ? DEV_BRANCH : params.beforeSha ?? void 0 : void 0;
	const checkNodeRuntime = async (sha) => {
		if (params.referenceSource || canSkipActivation && sha === params.beforeSha) return true;
		if (rebaseFrom && (await params.runCommand([
			"git",
			"-C",
			params.gitRoot,
			"merge-base",
			"--is-ancestor",
			rebaseFrom,
			sha
		], {
			cwd: params.gitRoot,
			timeoutMs: params.timeoutMs
		})).code !== 0) return true;
		const target = await readGitTargetSchemaVersions({
			...params,
			root: params.gitRoot,
			revision: sha
		});
		if (target.status !== "ok") return true;
		const runtime = await prepareGitCandidateNodeRuntime(params.artifactRoot, params.defaultCommandEnv, "package-tooling", target.nodeEngine);
		if (!runtime.step) return true;
		params.steps.push(runtime.step);
		return false;
	};
	while (candidates.length > 0 && !await checkNodeRuntime(candidates[0])) candidates.shift();
	if (candidates.length === 0) return {
		status: "error",
		reason: "preflight-node-runtime-incompatible"
	};
	const preflightBaseSha = candidates[0];
	if (canSkipActivation && preflightBaseSha === params.beforeSha) return {
		status: "skipped",
		reason: "already-current"
	};
	if (params.beforeGitStaging) {
		const admission = await params.beforeGitStaging();
		params.steps.push(admission.step);
		if (isFailedUpdateStep(admission.step)) return {
			status: "error",
			reason: admission.failureReason
		};
	}
	await params.beforeCandidate(preflightBaseSha);
	let preflightRoot;
	try {
		preflightRoot = await createPreflightRoot(params.artifactRoot);
	} catch (error) {
		return {
			status: "error",
			reason: hasErrnoCode(error, "ENOSPC") ? "preflight-insufficient-space" : "preflight-worktree-failed"
		};
	}
	const worktreeDir = path.join(preflightRoot, PREFLIGHT_WORKTREE_DIRNAME);
	let tested;
	let cleanupUncertain = false;
	try {
		const worktreeStep = await runStep(workStep("preflight-worktree", "worktree", "add", "--detach", worktreeDir, preflightBaseSha));
		if (isFailedUpdateStep(worktreeStep)) return {
			status: "error",
			reason: classifyPreflightFailure(worktreeStep) === "insufficient-space" ? "preflight-insufficient-space" : "preflight-worktree-failed"
		};
		for (const sha of candidates) {
			if (canSkipActivation && sha === params.beforeSha) return {
				status: "skipped",
				reason: "already-current"
			};
			if (sha !== preflightBaseSha) {
				if (!await checkNodeRuntime(sha)) continue;
				await params.beforeCandidate(sha);
			}
			const candidate = await testPreflightCandidate({
				...params,
				worktreeDir,
				preflightRoot,
				sha,
				rebaseFrom,
				runLint: !params.targetRevision && shouldRunDevPreflightLint()
			});
			if (candidate.status === "ok" || candidate.status === "insufficient-space") {
				tested = candidate;
				break;
			}
			const runtimeMismatch = candidate.status === "node-runtime-incompatible";
			if (tested?.status !== "failed" && (!runtimeMismatch || !tested)) tested = candidate;
		}
	} catch (error) {
		cleanupUncertain = hasCommandProcessCleanupError(error);
		const failedStep = params.steps.findLast(isFailedUpdateStep);
		throw cleanupUncertain || failedStep?.name !== "preflight-runtime-stage" || error instanceof UpdatePreMutationError ? error : new UpdatePreMutationError("git-preflight-failed", formatErrorMessage(error), {
			cause: error,
			stepResult: {
				steps: params.steps,
				failedStep
			}
		});
	} finally {
		if (!cleanupUncertain) {
			const cleanup = () => cleanupGitPreflight(params, worktreeDir, preflightRoot);
			if (tested?.status !== "ok" || !params.retainCleanup?.(cleanup)) await cleanup();
		}
	}
	if (tested?.status !== "ok") return {
		status: "error",
		reason: tested?.status === "insufficient-space" ? "preflight-insufficient-space" : tested?.status === "manager-unavailable" ? tested.reason : tested?.status === "node-runtime-incompatible" ? "preflight-node-runtime-incompatible" : "preflight-no-good-commit"
	};
	return {
		status: "ok",
		candidateSha: tested.candidateSha,
		selectedDevUpstream,
		localDevBranchExists
	};
}
//#endregion
export { runGitCleanCheckStep as a, runGitActivationBranchCheckStep as i, readGitRollbackPreservation as n, runGitRollbackSteps as o, runClassifiedGitStep as r, runGitUpstreamStep as s, runGitCandidatePreflight as t };
