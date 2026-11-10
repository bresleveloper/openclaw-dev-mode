import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { g as readRegularFile$1, u as openLocalFileSafely } from "./fs-safe-6Z4UiMS4.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { n as DEV_BRANCH } from "./update-channels-l0GQCX9n.mjs";
import { n as gitRuntimeStagingPath } from "./plugin-safety-inspected-files-C9Of4ALD.mjs";
import { r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-3t5Fm3wV.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { o as resolveControlUiAssetHealth } from "./control-ui-assets-f8KcxxVR.mjs";
import { i as readPackageVersion, r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { a as resolveDevUpdateTargetRevision } from "./update-dev-target-yMMMhCo4.mjs";
import { n as readGitTargetSchemaVersions, o as resolveGitUpdateTrackingRef, r as readGitUpdateFetchTarget } from "./update-git-metadata-Bci7Iprk.mjs";
import { i as readGitRuntimeArtifactIdentity, n as readBuiltGatewayBuildId, o as verifyGitUpdateRecovery, r as readBuiltRuntimeCommit } from "./update-git-runtime-S2Kgafdv.mjs";
import { d as resolveGlobalInstallTarget, f as resolveNpmLifecyclePolicyGate, g as createGlobalInstallEnv, h as verifyPackageUpdateRecovery, y as createSystemPackageOwnershipInspection } from "./update-global-BlXQRfes.mjs";
import { a as runStep, i as reportUpdateStepCompletion, n as buildUpdateCommandRunner, r as normalizeFallbackFailureReason } from "./update-runner-command-DETznIV7.mjs";
import { i as getUpdateDoctorConfigFailureReason } from "./update-doctor-config-BrLAVDg0.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-Db60sdKj.mjs";
import { t as UpdateRecoveryRequiredError } from "./update-run-recovery-schema-DparDBZU.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-BP771TSP.mjs";
import { r as settleGitUpdateCleanup } from "./update-runner-git-cleanup-DohV8M13.mjs";
import { a as gitCleanCheckArgs } from "./update-runner-git-commands-X6nu_XbS.mjs";
import { a as runGitCleanCheckStep, i as runGitActivationBranchCheckStep, n as readGitRollbackPreservation, o as runGitRollbackSteps, s as runGitUpstreamStep } from "./update-runner-git-preflight-BsvOuY5n.mjs";
import { m as UpdateCommandRecoveryPendingError } from "./update-command-executor-DUq8yLzH.mjs";
import { d as resolveGlobalManager, m as runUpdateStep, r as ensureGitCheckout, u as resolveGitInstallDir } from "./shared-DRiGAorf.mjs";
import { n as recordGitRollbackOutcome, t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BaoznbwZ.mjs";
import { a as gatewayServiceCommandUsesRoot } from "./update-command-service-plan-Bdkyi9qw.mjs";
import { t as readPackageUpdateIdentity } from "./update-command-package-identity-DsYk7vPy.mjs";
import { n as loadUpdateRecovery } from "./update-run-recovery-BUElUFkd.mjs";
import { t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-CPjoG803.mjs";
import { t as assessInitialUpdateSnapshotCapacity } from "./update-candidate-snapshot-CXUOq_kW.mjs";
import { c as withGitTargetInspectionRoot, i as readBranchName, n as fetchGitUpdateTarget, o as selectChannelTag, r as prepareGitMutation, s as selectGitInspectionTarget, t as classifyPartialCloneGitFailure } from "./update-runner-git-target-DGCdW2JS.mjs";
import { r as classifyDoctorMaintenanceRefusal } from "./doctor-maintenance-inspection-D2Lw5Rm3.mjs";
import { n as readRuntimeModulesManifest, o as relocateRuntimeTree } from "./update-runtime-relocation-VUX2bZ3P.mjs";
import { r as runPackageUpdateDoctor, t as prepareGitPackageExposure } from "./update-command-package-Cj3ya4Kc.mjs";
import { i as UpdateCommandPendingRecoveryFailure } from "./update-command-result-BgqRj9_Z.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
//#region src/infra/update-runner-git-runtime.ts
function readRuntimeEntry(file) {
	try {
		return fs.lstatSync(file, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
function sameRuntimeIdentity(expected, current) {
	return expected !== void 0 && expected.dev === current.dev && expected.ino === current.ino && (process.platform !== "win32" || current.dev !== 0n && current.ino !== 0n);
}
async function collectRuntimeDirectories(root, runCommand, timeoutMs) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"ls-files",
		"--others",
		"--ignored",
		"--exclude-standard",
		"--directory",
		"-z",
		"--",
		"dist",
		"dist-runtime",
		"node_modules",
		"**/dist",
		"**/dist-runtime",
		"**/node_modules",
		":(exclude).artifacts/**",
		":(exclude).worktrees/**",
		":(exclude).claude/**"
	], {
		cwd: root,
		timeoutMs
	});
	if (result.code !== 0) throw new Error("Cannot enumerate update runtime outputs");
	const directories = result.stdout.split("\0").filter(Boolean).flatMap((entry) => {
		const parts = entry.split("/");
		const runtimeIndex = parts.findIndex((part) => [
			"dist",
			"dist-runtime",
			"node_modules"
		].includes(part));
		const runtimeRoot = parts.slice(0, runtimeIndex + 1);
		return runtimeRoot.length && !runtimeRoot.some((part) => part.startsWith(".")) ? [runtimeRoot.join("/")] : [];
	});
	return [...new Set(directories)];
}
async function collectDisposableRuntimeCaches(modulesDirs, runtimeRoots, storeRoots) {
	const caches = /* @__PURE__ */ new Set();
	const overlaps = (left, right) => isPathInside(left, right) || isPathInside(right, left);
	for (const modulesDir of modulesDirs) for (const relative of [
		".cache/jiti",
		".vite",
		".vite-temp"
	]) {
		const cache = path.join(modulesDir, relative);
		try {
			if ((await fs$1.lstat(cache)).isDirectory() && await fs$1.realpath(cache) === cache && !storeRoots.some((store) => overlaps(cache, store))) caches.add(cache);
		} catch {}
	}
	const pending = [...runtimeRoots];
	const visited = /* @__PURE__ */ new Set();
	while (caches.size > 0 && pending.length > 0) {
		const entry = pending.pop();
		if (visited.has(entry) || caches.has(entry)) continue;
		visited.add(entry);
		const stat = await fs$1.lstat(entry);
		if (stat.isSymbolicLink()) {
			const targets = [path.resolve(path.dirname(entry), await fs$1.readlink(entry))];
			try {
				targets.push(await fs$1.realpath(entry));
			} catch {
				caches.clear();
				break;
			}
			for (const cache of caches) if (targets.some((dependency) => overlaps(cache, dependency))) {
				caches.delete(cache);
				pending.push(cache);
			}
		} else if (stat.isDirectory()) {
			for (const child of await fs$1.readdir(entry, { withFileTypes: true })) if (child.isDirectory() || child.isSymbolicLink()) pending.push(path.join(entry, child.name));
		}
	}
	return caches;
}
/** Stage on the destination filesystem; activation only renames the already validated runtime. */
async function prepareGitRuntimePromotion(root, candidateRoot, runCommand, timeoutMs, cleanupRoot, assertDestination) {
	const relocation = {
		sourceRoot: await fs$1.realpath(candidateRoot),
		destinationRoot: await fs$1.realpath(root),
		sourceAliases: [candidateRoot]
	};
	const directories = await collectRuntimeDirectories(relocation.sourceRoot, runCommand, timeoutMs);
	const copiedRoots = /* @__PURE__ */ new Map();
	for (const relative of directories) {
		const sourceRoot = path.join(relocation.sourceRoot, relative);
		copiedRoots.set(sourceRoot, {
			sourceRoot,
			destinationRoot: path.join(relocation.destinationRoot, relative)
		});
	}
	const stores = /* @__PURE__ */ new Map();
	const ownedRoot = await fs$1.realpath(cleanupRoot);
	for (const relative of directories) {
		if (path.basename(relative) !== "node_modules") continue;
		const modulesDir = path.join(relocation.sourceRoot, relative);
		const virtualStoreDir = (await readRuntimeModulesManifest(path.join(modulesDir, ".modules.yaml")))?.manifest.virtualStoreDir;
		if (typeof virtualStoreDir !== "string") continue;
		const store = path.resolve(modulesDir, virtualStoreDir);
		const sourceRoot = path.join(await fs$1.realpath(path.dirname(store)), path.basename(store));
		const owned = isPathInside(ownedRoot, sourceRoot);
		const storeRelocation = {
			sourceRoot,
			destinationRoot: owned ? path.resolve(relocation.destinationRoot, path.relative(relocation.sourceRoot, sourceRoot)) : sourceRoot,
			sourceAliases: [store]
		};
		const destinationEntry = path.join(resolvePathViaExistingAncestorSync$1(path.dirname(storeRelocation.destinationRoot)), path.basename(storeRelocation.destinationRoot));
		if (isPathInside(sourceRoot, relocation.sourceRoot) || owned && isPathInside(destinationEntry, relocation.destinationRoot)) throw new Error("Update pnpm virtual store overlaps the source or live checkout; use a dedicated store directory before updating.");
		stores.set(sourceRoot, storeRelocation);
		if (owned) copiedRoots.set(sourceRoot, storeRelocation);
	}
	const relocations = [...stores.values(), relocation];
	const roots = [...copiedRoots.values()].filter((entry) => ![...copiedRoots.keys()].some((other) => other !== entry.sourceRoot && isPathInside(other, entry.sourceRoot)));
	const destinations = roots.map(({ destinationRoot }) => path.join(resolvePathViaExistingAncestorSync$1(path.dirname(destinationRoot)), path.basename(destinationRoot)));
	const storeRoots = [...stores.keys()];
	for (const store of stores.keys()) {
		const payload = await fs$1.realpath(store);
		storeRoots.push(payload, ...stores.get(store)?.sourceAliases ?? []);
		if (!copiedRoots.has(store) && destinations.some((dest) => isPathInside(dest, store)) || !roots.some(({ sourceRoot }) => isPathInside(sourceRoot, payload)) && destinations.some((dest) => isPathInside(dest, payload))) throw new Error("Update pnpm virtual store overlaps a runtime directory being replaced.");
	}
	const disposableCaches = await collectDisposableRuntimeCaches(directories.filter((relative) => path.basename(relative) === "node_modules").map((relative) => path.join(relocation.sourceRoot, relative)), roots.map(({ sourceRoot }) => sourceRoot), storeRoots);
	for (const { destinationRoot } of roots) assertDestination?.(destinationRoot);
	const staged = [];
	const promoted = [];
	let restoreStarted = false;
	const cleanup = async (assertCurrent = () => {}) => {
		const retiring = staged.filter((entry) => !restoreStarted || !promoted.includes(entry));
		for (const entry of retiring) assertDestination?.(entry.destination);
		const failures = (await Promise.allSettled(retiring.map(async (entry) => {
			assertCurrent();
			assertDestination?.(entry.destination);
			await fs$1.rm(entry.temporary, {
				recursive: true,
				force: true
			});
			assertCurrent();
		}))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError(failures, "Git runtime backup cleanup did not finish.");
	};
	const filter = (source, destination) => {
		if (process.platform === "win32" && fs.lstatSync(source).isSymbolicLink() && fs.statSync(source).isDirectory()) {
			const target = path.resolve(path.dirname(source), fs.readlinkSync(source));
			fs.symlinkSync(target, destination, "junction");
			return false;
		}
		return !disposableCaches.has(source);
	};
	try {
		for (const { sourceRoot, destinationRoot: destination } of roots) {
			assertDestination?.(destination);
			const temporary = gitRuntimeStagingPath(destination);
			const entry = {
				destination,
				temporary,
				previous: false,
				activated: false
			};
			staged.push(entry);
			await fs$1.mkdir(temporary, { recursive: true });
			const candidate = path.join(temporary, "candidate");
			assertDestination?.(destination);
			await fs$1.cp(sourceRoot, candidate, {
				recursive: true,
				preserveTimestamps: true,
				verbatimSymlinks: true,
				filter: process.platform === "win32" || disposableCaches.size > 0 ? filter : void 0
			});
			assertDestination?.(destination);
			await relocateRuntimeTree(candidate, sourceRoot, destination, relocations);
		}
	} catch (error) {
		await cleanup();
		throw error;
	}
	const assertParents = (entry) => {
		const identities = entry.identities;
		const parent = path.dirname(entry.destination);
		const parentStat = fs.statSync(parent, { bigint: true });
		const stagingStat = fs.lstatSync(entry.temporary, { bigint: true });
		if (!identities || !parentStat.isDirectory() || !stagingStat.isDirectory() || fs.realpathSync.native(parent) !== identities.parentPath || !sameRuntimeIdentity(identities.parent, parentStat) || !sameRuntimeIdentity(identities.staging, stagingStat)) throw new Error(`Git runtime parent identity changed; retained ${entry.temporary}`);
	};
	const assertPrevious = (entry) => {
		if (entry.previous && !sameRuntimeIdentity(entry.identities?.previous, fs.lstatSync(path.join(entry.temporary, "previous"), { bigint: true }))) throw new Error(`Retained Git runtime identity changed: ${entry.temporary}`);
	};
	const assertRetainedEntry = (entry, assertCurrent = () => {}) => {
		assertCurrent();
		assertDestination?.(entry.destination);
		assertParents(entry);
		assertPrevious(entry);
	};
	const restoreEntry = async (entry, assertCurrent = () => {}) => {
		const guard = () => assertRetainedEntry(entry, assertCurrent);
		guard();
		if (entry.activated) {
			await fs$1.rm(entry.destination, {
				recursive: true,
				force: true
			});
			if (entry.previous) guard();
		} else if (readRuntimeEntry(entry.destination)) throw new Error(`Git runtime destination is occupied during partial recovery: ${entry.destination}`);
		if (entry.previous) await fs$1.rename(path.join(entry.temporary, "previous"), entry.destination);
		promoted.pop();
		assertCurrent();
		assertDestination?.(entry.destination);
		assertParents(entry);
		if (entry.previous && !sameRuntimeIdentity(entry.identities?.previous, fs.lstatSync(entry.destination, { bigint: true }))) throw new Error(`Restored Git runtime identity changed: ${entry.destination}`);
	};
	return {
		backupRoot: staged[0]?.temporary ?? root,
		sourceTreeStagingPaths: staged.flatMap(({ temporary }) => {
			const relative = path.relative(relocation.destinationRoot, temporary);
			return relative && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative) ? [relative.split(path.sep).join("/")] : [];
		}),
		async activate() {
			try {
				for (const entry of staged) assertDestination?.(entry.destination);
				for (const entry of staged) {
					assertDestination?.(entry.destination);
					const parent = path.dirname(entry.destination);
					entry.identities = {
						parent: fs.statSync(parent, { bigint: true }),
						parentPath: fs.realpathSync.native(parent),
						staging: fs.lstatSync(entry.temporary, { bigint: true }),
						previous: readRuntimeEntry(entry.destination)
					};
					assertParents(entry);
					if (entry.identities.previous && !sameRuntimeIdentity(entry.identities.previous, entry.identities.previous)) throw new Error(`Git runtime identity is unavailable: ${entry.destination}`);
					try {
						await fs$1.rename(entry.destination, path.join(entry.temporary, "previous"));
						entry.previous = true;
					} catch (error) {
						if (!hasErrnoCode(error, "ENOENT") || entry.identities.previous) throw error;
					}
					promoted.push(entry);
					try {
						assertRetainedEntry(entry);
						await fs$1.rename(path.join(entry.temporary, "candidate"), entry.destination);
						entry.activated = true;
					} catch (error) {
						restoreStarted = true;
						if (hasCommandProcessCleanupError(error)) throw error;
						try {
							await restoreEntry(entry);
						} catch (restorationError) {
							throw new AggregateError([error, restorationError], `Git runtime activation failed (${formatErrorMessage(error)}); partial restoration failed (${formatErrorMessage(restorationError)}).`, { cause: restorationError });
						}
						throw error;
					}
				}
			} catch (error) {
				restoreStarted = true;
				throw error;
			}
		},
		async restore(assertCurrent = () => {}) {
			restoreStarted = true;
			for (const entry of promoted) assertRetainedEntry(entry, assertCurrent);
			for (const entry of promoted.toReversed()) await restoreEntry(entry, assertCurrent);
		},
		cleanup
	};
}
function createGitRuntimeTransaction({ root, promotion, assertRollbackSafe, restoreRuntime }) {
	let restored;
	let completed;
	const retention = (message, warning = false) => ({
		name: "git-runtime-backup-retention",
		command: "retain previous Git runtime",
		cwd: root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: message,
		...warning ? { advisory: {
			kind: "recoverable-maintenance",
			message
		} } : {}
	});
	return {
		backupRoot: promotion.backupRoot,
		assertRollbackSafe,
		rollback: (assertCurrent) => {
			assertCurrent();
			if (completed) throw new Error("Git runtime backup retirement has already started.");
			return restored ??= (async () => {
				await assertRollbackSafe();
				assertCurrent();
				return await restoreRuntime(assertCurrent);
			})();
		},
		complete: (outcome, assertCurrent) => {
			assertCurrent();
			return completed ??= (async () => {
				if (!outcome.activationVerified && (await restored)?.exitCode !== 0) return retention(`Git recovery is unverified; previous runtime retained at ${promotion.backupRoot}.`);
				try {
					return await promotion.cleanup(assertCurrent);
				} catch (error) {
					assertCurrent();
					if (hasCommandProcessCleanupError(error) || !(error instanceof AggregateError ? error.errors : [error]).every(isErrno)) throw error;
					return retention(`Git verification succeeded; backup cleanup remains pending at ${promotion.backupRoot}: ${formatErrorMessage(error)}`, true);
				}
			})();
		}
	};
}
//#endregion
//#region src/infra/update-runner-git-transfer.ts
const LARGE_CANDIDATE_PACK_WARNING_BYTES = 268435456;
function reportStep(step, result, cleanup = false) {
	step.results?.push(result);
	return reportUpdateStepCompletion(step.progress, {
		...result,
		index: cleanup ? 0 : step.stepIndex,
		total: cleanup ? 0 : step.totalSteps
	});
}
async function recordStagingFailure(step, name, command, message, durationMs = 0) {
	await reportStep(step, {
		name,
		command,
		cwd: step.cwd,
		durationMs,
		exitCode: 1,
		stderrTail: message
	});
}
/** Prepare a self-contained pack before admission can stop the serving gateway. */
async function prepareGitCandidateTransfer(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const { candidateSha, beforeSha, installedRoot, installedRunCommand, upstreamRef, step } = params;
		const runGit = async (name, args, input, root = step.cwd, budget = { timeoutMs: params.probeTimeoutMs }) => {
			let stdout = "";
			const result = await runStep({
				...step,
				timeoutMs: budget.timeoutMs,
				name,
				cwd: root,
				argv: [
					"git",
					"-C",
					root,
					...args
				],
				runCommand: async (argv, options) => {
					const rawCommandResult = await step.runCommand(argv, {
						...options,
						input,
						terminateOnOutputLimit: true
					});
					const commandResult = await classifyPartialCloneGitFailure({
						result: rawCommandResult,
						root: installedRoot,
						runCommand: installedRunCommand,
						timeoutMs: params.probeTimeoutMs
					});
					stdout = commandResult.stdout;
					return args.includes("rev-list") || args.includes("cat-file") ? {
						...commandResult,
						stdout: ""
					} : commandResult;
				}
			});
			return !isFailedUpdateStep(result) && !result.signal ? stdout.trim() : void 0;
		};
		const upstreamSha = upstreamRef ? await runGit("git-pin-update-upstream", ["rev-parse", upstreamRef]) : void 0;
		if (upstreamRef && !upstreamSha) return;
		const objects = await runGit("git-update-history", [
			"rev-list",
			"--objects",
			"--no-object-names",
			"--missing=allow-any",
			candidateSha,
			...upstreamSha ? [upstreamSha] : [],
			...beforeSha ? [`^${beforeSha}`] : []
		]);
		const tree = await runGit("git-update-tree", [
			"rev-list",
			"--objects",
			"--no-object-names",
			`${candidateSha}^{tree}`
		]);
		if (objects === void 0 || tree === void 0) return;
		const retained = /* @__PURE__ */ new Set();
		const probe = beforeSha ? await step.runCommand([
			"git",
			"--no-lazy-fetch",
			"version"
		], {
			cwd: installedRoot,
			timeoutMs: params.probeTimeoutMs
		}) : void 0;
		if (probe?.code === 0 && probe.stdout.startsWith("git version ") && !probe.killed && !probe.signal && (!probe.termination || probe.termination === "exit")) {
			const beforeTree = await runGit("git-retained-tree", [
				"rev-list",
				"--objects",
				"--no-object-names",
				`${beforeSha}^{tree}`
			]);
			if (beforeTree === void 0) return;
			const local = await runGit("git-retained-object-availability", [
				"--no-lazy-fetch",
				"cat-file",
				"--batch-check=%(objectname) %(objecttype)"
			], `${beforeTree}\n`, installedRoot);
			if (local === void 0) return;
			const invalidInventory = () => recordStagingFailure({
				...step,
				cwd: installedRoot
			}, "git-retained-object-inventory", "verify retained Git object availability", "Incomplete retained Git object availability inventory");
			const pending = new Set(beforeTree.split("\n"));
			for (const line of local.split("\n")) {
				const [oid, type, ...extra] = line.split(" ");
				if (!oid || !type || extra.length || !pending.delete(oid) || ![
					"blob",
					"tree",
					"missing"
				].includes(type)) return await invalidInventory();
				if (type !== "missing") retained.add(oid);
			}
			if (pending.size) return await invalidInventory();
		}
		const input = [...new Set(`${objects}\n${tree}`.split("\n").filter(Boolean))].filter((oid) => !retained.has(oid)).map((oid) => `${oid}\n`).join("");
		const prefix = path.join(step.cwd, "update-candidate");
		const hash = await runGit("git-pack-update", [
			"-c",
			"pack.packSizeLimit=0",
			"pack-objects",
			"--max-pack-size=0",
			prefix
		], input, step.cwd, { timeoutMs: step.timeoutMs });
		if (!hash) return;
		const stagedPack = _usingCtx$2.a(new AsyncDisposableStack());
		let pack;
		const packPath = `${prefix}-${hash}.pack`;
		const readStarted = Date.now();
		let requiredBytes;
		try {
			pack = stagedPack.use(await openLocalFileSafely({ filePath: packPath }));
			requiredBytes = pack.stat.size + (await fs$1.stat(`${prefix}-${hash}.idx`)).size;
		} catch (error) {
			return await recordStagingFailure(step, "git-update-pack-read", `read update pack ${packPath}`, `Cannot stage the Git update pack: ${String(error)}`, Date.now() - readStarted);
		}
		const objectDirectory = await runGit("git update object directory", [
			"rev-parse",
			"--path-format=absolute",
			"--git-path",
			"objects"
		], void 0, installedRoot);
		if (!objectDirectory) return;
		const capacity = tryReadDiskSpace(objectDirectory);
		if (capacity && capacity.availableBytes < requiredBytes) {
			const reason = "snapshot-capacity-insufficient";
			await recordStagingFailure(step, "git update pack capacity", "measure Git update pack capacity", `${reason}: Git update pack and index need ${requiredBytes} bytes in ${objectDirectory}; ${capacity.availableBytes} bytes available. Free space on this volume and retry; the installed checkout is unchanged.`, Date.now() - readStarted);
			return {
				status: "error",
				reason
			};
		}
		const warnings = [];
		if (pack.stat.size > LARGE_CANDIDATE_PACK_WARNING_BYTES) warnings.push(`Large Git update pack: ${pack.stat.size} bytes; importing from disk without buffering it in memory.`);
		if (!capacity) warnings.push("Git object-volume free space could not be measured; continuing the update.");
		await reportStep(step, {
			name: "git update pack capacity",
			command: "measure Git update pack capacity",
			cwd: installedRoot,
			durationMs: Date.now() - readStarted,
			exitCode: 0,
			stdoutTail: `Git update pack and index: ${requiredBytes} bytes; ${capacity ? `${capacity.availableBytes} bytes available` : "free space unknown"} in ${objectDirectory}.`,
			...warnings.length ? { warnings } : {}
		});
		const keepMessage = `openclaw-update-${randomUUID()}`;
		const retainedPack = stagedPack.move();
		return {
			status: "ok",
			[Symbol.asyncDispose]: () => retainedPack[Symbol.asyncDispose](),
			async importInto(target) {
				const imported = await runStep({
					...target,
					argv: [
						"git",
						"-C",
						target.cwd,
						"index-pack",
						"--stdin",
						`--keep=${keepMessage}`
					],
					runCommand: (argv, options) => target.runCommand(argv, {
						...options,
						stdinFileDescriptor: pack.handle.fd
					})
				});
				if (isFailedUpdateStep(imported)) return false;
				if (!upstreamRef || !upstreamSha) return true;
				const tracked = await runStep({
					...target,
					name: "git-import-admitted-upstream",
					argv: [
						"git",
						"-C",
						target.cwd,
						"update-ref",
						upstreamRef,
						upstreamSha
					]
				});
				return !isFailedUpdateStep(tracked);
			},
			async cleanup(target) {
				try {
					const location = await target.runCommand([
						"git",
						"-C",
						target.cwd,
						"rev-parse",
						"--path-format=absolute",
						"--git-path",
						`objects/pack/pack-${hash}.keep`
					], {
						cwd: target.cwd,
						timeoutMs: params.probeTimeoutMs
					});
					if (location.code !== 0) throw new Error("Cannot locate the retained Git update pack");
					const keepPath = location.stdout.trim();
					if (await fs$1.readFile(keepPath, "utf8").catch((error) => {
						if (hasErrnoCode(error, "ENOENT")) return;
						throw error;
					}) === `${keepMessage}\n`) await fs$1.unlink(keepPath);
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					await reportStep(target, {
						name: "git-update-pack-cleanup",
						command: "release retained Git update pack",
						cwd: target.cwd,
						durationMs: 0,
						exitCode: 1,
						stderrTail: String(error),
						advisory: {
							kind: "recoverable-maintenance",
							message: `Git update pack could not be removed: ${String(error)}`
						}
					}, true);
				}
			}
		};
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
}
//#endregion
//#region src/infra/update-runner-git.ts
async function updateGitCheckout(params) {
	const { opts, defaultCommandEnv, timeoutMs, startedAt } = params;
	let gitRoot = params.gitRoot;
	const runCommand = (argv, options) => params.runCommand(argv, {
		...options,
		...argv[0] === "git" ? { env: {
			...options.env,
			GIT_OPTIONAL_LOCKS: "0"
		} } : {}
	});
	const channel = opts.channel ?? "dev";
	if (channel === "extended-stable") return {
		status: "error",
		mode: "git",
		root: gitRoot,
		reason: "unsupported_git_channel",
		recovery: await readCurrentGitUpdateRecovery(gitRoot, timeoutMs),
		steps: [],
		durationMs: Date.now() - startedAt
	};
	const beforeShaResult = await runCommand([
		"git",
		"-C",
		gitRoot,
		"rev-parse",
		"HEAD"
	], {
		cwd: gitRoot,
		timeoutMs
	});
	const beforeSha = beforeShaResult.stdout.trim() || null;
	const [beforeVersion, beforeBuildId, beforeBuiltCommit] = await Promise.all([
		readPackageVersion(gitRoot),
		readBuiltGatewayBuildId(gitRoot),
		readBuiltRuntimeCommit(gitRoot)
	]);
	const before = {
		sha: beforeSha,
		version: beforeVersion,
		...beforeBuildId ? { buildId: beforeBuildId } : {}
	};
	const branch = await readBranchName(runCommand, gitRoot, timeoutMs);
	const devTarget = channel === "dev" ? opts.devTarget : void 0;
	const hasDevTarget = devTarget !== void 0;
	const activateBranch = channel === "dev" && !hasDevTarget;
	const needsCheckoutMain = channel === "dev" && !hasDevTarget && branch !== "main";
	const totalSteps = channel === "dev" ? needsCheckoutMain ? 12 : 11 : 9;
	const steps = [];
	const failureStep = (name, command, stderrTail) => ({
		name,
		command,
		cwd: gitRoot,
		durationMs: 0,
		exitCode: 1,
		stderrTail
	});
	let stepIndex = 0;
	const forRunner = (runner, deadline) => (name, argv, cwd, env) => ({
		runCommand: runner,
		name,
		argv,
		cwd,
		timeoutMs: deadline,
		env,
		progress: opts.progress,
		stepIndex: stepIndex++,
		totalSteps,
		results: steps
	});
	const step = forRunner(runCommand, timeoutMs);
	const workStep = forRunner(runCommand, opts.timeoutMs);
	const recoveryStep = (name, argv, cwd) => ({
		runCommand,
		name,
		argv,
		cwd,
		timeoutMs,
		stepIndex: 0,
		totalSteps: 1,
		results: steps
	});
	let createdDevBranchDuringUpdate = false;
	let mutationPrepared = false;
	let sourceMutationStarted = false;
	let runtimePromotion;
	let runtimeRetained = false;
	const runtimeCleanups = {};
	const cleanupCandidateRuntime = async (assertCurrent = () => {}) => {
		assertCurrent();
		for (const kind of ["candidate", "inspection"]) {
			const cleanup = runtimeCleanups[kind];
			if (cleanup) {
				const removed = await cleanup();
				assertCurrent();
				if (!removed) return false;
				runtimeCleanups[kind] = void 0;
			}
		}
		return true;
	};
	let candidateTransfer;
	let stateMigrationStarted = false;
	let cleanupUncertain = false;
	const cleanupReportingFailures = [];
	let recovery = await verifyGitUpdateRecovery({
		root: gitRoot,
		sha: beforeSha
	});
	let rollbackOutcome = {
		status: "not-needed",
		reason: "Installed checkout was not changed"
	};
	const prepareMutation = async (revision, root = gitRoot, runner = runCommand) => {
		await prepareGitMutation({
			runCommand: runner,
			root,
			revision,
			timeoutMs,
			beforeGitMutation: mutationPrepared ? opts.inspectGitTarget : opts.beforeGitMutation
		});
		if (!mutationPrepared) {
			mutationPrepared = true;
			recovery = {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			};
		}
	};
	const buildError = (reason, status = "error") => ({
		status,
		mode: "git",
		root: gitRoot,
		reason,
		before,
		recovery,
		rollbackOutcome,
		steps,
		durationMs: Date.now() - startedAt
	});
	const restoreRuntime = async (assertCurrent = () => {}, runtimeSha = beforeSha, source) => {
		const rollback = {
			beforeSha,
			branch,
			gitRoot,
			createdDevBranchDuringUpdate,
			sourceTreeStagingPaths: runtimePromotion?.sourceTreeStagingPaths,
			recoveryStep,
			checkSourceUnchanged,
			assertCurrent,
			activatedSource: source
		};
		const restoreSource = () => runGitRollbackSteps(rollback);
		const preserved = source ? void 0 : await readGitRollbackPreservation(rollback);
		steps.push(...preserved ? [preserved] : []);
		let sourceRestored = source ? await restoreSource() : false;
		let runtimeRestored = true;
		try {
			await runtimePromotion?.restore(assertCurrent);
		} catch (error) {
			assertCurrent();
			runtimeRestored = false;
			steps.push(failureStep("git-runtime-rollback", "restore previous runtime", String(error)));
		}
		if (!source && !preserved) sourceRestored = await restoreSource();
		recovery = !sourceRestored ? {
			serviceRestartSafe: false,
			reason: "source-rollback-failed"
		} : !runtimeRestored ? {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		} : await verifyGitUpdateRecovery({
			root: gitRoot,
			sha: runtimeSha
		});
		assertCurrent();
		const restored = sourceRestored && runtimeRestored && recovery.serviceRestartSafe;
		rollbackOutcome = {
			status: restored ? "succeeded" : "failed",
			reason: restored ? "Previous checkout and runtime restored and verified" : "Previous checkout or runtime restoration could not be verified"
		};
		return restored;
	};
	const rollbackError = async (reason) => {
		try {
			if (!sourceMutationStarted) {
				if (!await checkSourceUnchanged()) recovery = await verifyGitUpdateRecovery({
					root: gitRoot,
					sha: beforeSha
				});
				return buildError(reason);
			}
			if (stateMigrationStarted) {
				rollbackOutcome = {
					status: "not-attempted",
					reason: "State migration started; restoring code alone cannot restore operator state"
				};
				return buildError(reason);
			}
			if (!runtimeRetained) await restoreRuntime();
			return buildError(reason);
		} catch (error) {
			if (sourceMutationStarted && !stateMigrationStarted) rollbackOutcome = {
				status: "failed",
				reason: "Rollback threw before restoration could be verified"
			};
			throw error;
		} finally {
			recordGitRollbackOutcome({
				outcome: rollbackOutcome,
				progress: opts.progress,
				root: gitRoot,
				steps
			});
		}
	};
	if (beforeShaResult.code !== 0 || !beforeSha) return buildError("git-root-unresolved");
	const { result: statusCheck, dirty } = await runGitCleanCheckStep(step("clean-check", gitCleanCheckArgs(gitRoot), gitRoot));
	if (isFailedUpdateStep(statusCheck)) return buildError(dirty ? "dirty" : "clean-check-failed");
	if (activateBranch && branch !== "main") {
		const devBranchRef = `refs/heads/${DEV_BRANCH}`;
		const branchCheckOptions = step("git-activation-branch-check", [
			"git",
			"-C",
			gitRoot,
			"branch",
			"--force",
			DEV_BRANCH,
			devBranchRef
		], gitRoot);
		const branchCheck = await runGitActivationBranchCheckStep(branchCheckOptions, DEV_BRANCH);
		if (isFailedUpdateStep(branchCheck)) return buildError("checkout-failed");
	}
	const checkSourceUnchanged = async (expectedSha = beforeSha, expectedBranch = branch, assertCurrent = () => {}) => {
		assertCurrent();
		const currentHead = await runCommand([
			"git",
			"-C",
			gitRoot,
			"rev-parse",
			"HEAD"
		], {
			cwd: gitRoot,
			timeoutMs
		});
		assertCurrent();
		const currentStatus = await runCommand(gitCleanCheckArgs(gitRoot, runtimePromotion?.sourceTreeStagingPaths), {
			cwd: gitRoot,
			timeoutMs
		});
		assertCurrent();
		if (currentHead.code !== 0 || currentStatus.code !== 0) return {
			status: "error",
			reason: "clean-check-failed"
		};
		const currentBranch = await readBranchName(runCommand, gitRoot, timeoutMs);
		assertCurrent();
		if (currentHead.stdout.trim() !== expectedSha || currentBranch !== expectedBranch || currentStatus.stdout.trim()) return {
			status: "error",
			reason: "dirty"
		};
	};
	const runUpdate = async () => {
		const inspectAndPrepare = async (inspectionRoot, runInspectionCommand) => {
			let publishedCandidate = false;
			const inspectionStep = forRunner(runInspectionCommand, timeoutMs);
			const inspectionWorkStep = forRunner(runInspectionCommand, opts.timeoutMs);
			const importCandidate = async (candidateSha, upstreamRef) => {
				try {
					var _usingCtx$1 = _usingCtx();
					const transfer = await prepareGitCandidateTransfer({
						candidateSha,
						beforeSha,
						installedRoot: gitRoot,
						installedRunCommand: runCommand,
						upstreamRef,
						step: inspectionWorkStep("git-pack-update", [], inspectionRoot),
						probeTimeoutMs: timeoutMs
					});
					if (!transfer || transfer.status === "error") return {
						status: "error",
						reason: transfer?.reason ?? "fetch-failed"
					};
					const admittedTransfer = _usingCtx$1.a(transfer);
					const sourceChanged = await checkSourceUnchanged();
					if (sourceChanged) return sourceChanged;
					await prepareMutation(candidateSha, inspectionRoot, runInspectionCommand);
					candidateTransfer = transfer;
					if (!await admittedTransfer.importInto(workStep("git-import-admitted-target", [], gitRoot))) return {
						status: "error",
						reason: "fetch-failed"
					};
					return { status: "ok" };
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					await _usingCtx$1.d();
				}
			};
			const fetched = await fetchGitUpdateTarget({
				root: inspectionRoot,
				step: inspectionStep,
				workStep: inspectionWorkStep,
				name: "git-target-inspection-fetch",
				channel,
				devTarget,
				steps
			});
			if (!fetched.ok) return {
				status: "error",
				reason: fetched.reason ?? "fetch-failed"
			};
			const inspectTarget = async (revision, root = inspectionRoot) => {
				await prepareGitMutation({
					runCommand: runInspectionCommand,
					root,
					revision,
					timeoutMs,
					beforeGitMutation: opts.inspectGitTarget
				});
			};
			const selected = await selectGitInspectionTarget({
				gitRoot: inspectionRoot,
				artifactRoot: opts.gitArtifactStorageRoot ?? gitRoot,
				runCommand: runInspectionCommand,
				step: inspectionStep,
				workStep: inspectionWorkStep,
				workTimeoutMs: opts.timeoutMs,
				channel,
				devTarget,
				refreshedRemotes: fetched.refreshedRemotes,
				devSource: fetched.devSource,
				beforeSha,
				beforeRuntimeVerified: recovery.serviceRestartSafe,
				sourceRuntimePrepared: opts.sourceRuntimePrepared,
				beforeGitStaging: opts.beforeGitStaging,
				needsCheckoutMain,
				timeoutMs,
				defaultCommandEnv,
				steps,
				beforeCandidate: inspectTarget,
				validateCandidate: opts.validateCandidate,
				prepareGitExposure: opts.prepareGitExposure,
				onCleanupReportingError: (error) => cleanupReportingFailures.push(error),
				retainCleanup: (cleanup) => {
					runtimeCleanups.candidate = cleanup;
					return true;
				},
				prepareCandidate: async (root, cleanupRoot) => {
					const candidate = await runInspectionCommand([
						"git",
						"-C",
						root,
						"rev-parse",
						"HEAD"
					], {
						cwd: root,
						timeoutMs
					});
					if (candidate.code !== 0 || !candidate.stdout.trim()) throw new Error("Cannot inspect the validated Git update");
					await inspectTarget(candidate.stdout.trim(), root);
					if (opts.publishGitCheckout) {
						if ((await importCandidate(candidate.stdout.trim())).status !== "ok") throw new Error("Cannot import the admitted Git update");
						gitRoot = await opts.publishGitCheckout();
						publishedCandidate = true;
					}
					await runStep({
						...inspectionWorkStep("preflight-runtime-stage", [], root),
						runCommand: async () => {
							runtimePromotion = await prepareGitRuntimePromotion(gitRoot, root, runInspectionCommand, timeoutMs, cleanupRoot);
							return {
								code: 0,
								stdout: "",
								stderr: ""
							};
						}
					});
				}
			});
			if (selected.status !== "ok") return selected;
			if (!publishedCandidate) {
				const upstreamRef = selected.selectedDevUpstream ?? void 0;
				const imported = await importCandidate(selected.candidateSha, upstreamRef);
				if (imported.status !== "ok") return imported;
			}
			return selected;
		};
		const preflight = await withGitTargetInspectionRoot({
			root: gitRoot,
			runCommand,
			timeoutMs,
			work: { timeoutMs: opts.timeoutMs },
			onWarning: (warning) => {
				steps.push(warning);
				return reportUpdateStepCompletion(opts.progress, {
					...warning,
					index: 0,
					total: 0
				});
			},
			retainCleanup: (cleanup) => {
				if (!runtimeCleanups.candidate) return false;
				runtimeCleanups.inspection = cleanup;
				return true;
			}
		}, inspectAndPrepare);
		if (preflight.status !== "ok") {
			if (preflight.status === "skipped" && preflight.reason === "already-current") return {
				...buildError(preflight.reason, preflight.status),
				sourceRuntimePrepared: opts.sourceRuntimePrepared
			};
			return mutationPrepared ? await rollbackError(preflight.reason) : buildError(preflight.reason, preflight.status);
		}
		const sourceChanged = await checkSourceUnchanged();
		if (sourceChanged) return buildError(sourceChanged.reason, sourceChanged.status);
		await prepareMutation(preflight.candidateSha);
		sourceMutationStarted = true;
		const checkout = await runStep(workStep("git-checkout", activateBranch ? [
			"git",
			"-C",
			gitRoot,
			"checkout",
			"-B",
			DEV_BRANCH,
			preflight.candidateSha
		] : [
			"git",
			"-C",
			gitRoot,
			"checkout",
			"--detach",
			preflight.candidateSha
		], gitRoot));
		if (isFailedUpdateStep(checkout)) return await rollbackError("checkout-failed");
		createdDevBranchDuringUpdate = activateBranch && preflight.localDevBranchExists === false;
		if (createdDevBranchDuringUpdate && preflight.selectedDevUpstream) {
			const upstreamArgs = [
				"git",
				"-C",
				gitRoot,
				"branch",
				"--set-upstream-to",
				preflight.selectedDevUpstream,
				DEV_BRANCH
			];
			const upstreamOptions = workStep("git-set-upstream", upstreamArgs, gitRoot);
			const upstreamStep = await runGitUpstreamStep(upstreamOptions);
			if (isFailedUpdateStep(upstreamStep)) return await rollbackError("checkout-failed");
		}
		const promotedRuntime = runtimePromotion;
		if (!promotedRuntime) return await rollbackError("runtime-verification-failed");
		try {
			await runStep({
				...workStep("git-runtime-activation", [], gitRoot),
				runCommand: async () => {
					await promotedRuntime.activate();
					return {
						code: 0,
						stdout: "",
						stderr: ""
					};
				}
			});
		} catch {
			return await rollbackError("runtime-verification-failed");
		}
		if (opts.onTransaction) {
			const activatedBranch = await readBranchName(runCommand, gitRoot, timeoutMs);
			const assertRollbackSafe = async () => {
				if (await checkSourceUnchanged(preflight.candidateSha, activatedBranch)) throw new Error("Git checkout changed after activation; retained rollback was refused.");
			};
			runtimeRetained = true;
			const promotion = promotedRuntime;
			await opts.onTransaction(createGitRuntimeTransaction({
				root: gitRoot,
				promotion: {
					backupRoot: promotion.backupRoot,
					cleanup: async (assertCurrent) => {
						if (!await cleanupCandidateRuntime(assertCurrent)) return steps.findLast((cleanupStep) => cleanupStep.advisory?.kind === "recoverable-maintenance" && (cleanupStep.name === "preflight-cleanup" || cleanupStep.name === "git-target-inspection-cleanup"));
						return await promotion.cleanup(assertCurrent);
					}
				},
				assertRollbackSafe,
				restoreRuntime: async (assertCurrent) => {
					const rollbackStart = steps.length;
					const verified = await restoreRuntime(assertCurrent, beforeBuiltCommit ?? beforeSha, {
						sha: preflight.candidateSha,
						branch: activatedBranch
					});
					const rollbackSteps = steps.slice(rollbackStart);
					const messages = rollbackSteps.flatMap((entry) => entry.advisory?.message ?? []);
					return {
						name: "git-runtime-rollback",
						command: "restore previous Git runtime",
						cwd: gitRoot,
						durationMs: 0,
						exitCode: verified ? 0 : 1,
						activePackageRoot: gitRoot,
						advisory: verified && messages.length ? {
							kind: "recoverable-maintenance",
							message: messages.join(" ")
						} : void 0,
						stderrTail: verified ? void 0 : rollbackSteps.find(isFailedUpdateStep)?.stderrTail
					};
				}
			}));
		}
		if (!opts.prepareGitExposure) {
			stateMigrationStarted = true;
			recovery = {
				serviceRestartSafe: false,
				reason: "state-migration-started",
				dataAtRisk: "state-migrated-no-rollback"
			};
			const doctorSteps = [];
			let doctorStep;
			try {
				doctorStep = await opts.runGitDoctor(gitRoot, doctorSteps);
			} catch (error) {
				const refusal = classifyDoctorMaintenanceRefusal(error);
				if (refusal.kind === "data-at-risk") recovery.dataAtRisk = refusal.reason;
				steps.push(...doctorSteps);
				throw error;
			}
			steps.push(...doctorSteps.filter((result) => result !== doctorStep), doctorStep ?? failureStep("openclaw doctor", "run activation doctor", "Required activation Doctor did not produce a result."));
			if (!doctorStep) {
				stateMigrationStarted = false;
				return await rollbackError("doctor-entry-missing");
			}
			if (isFailedUpdateStep(doctorStep)) return await rollbackError(getUpdateDoctorConfigFailureReason(doctorStep.configWriteRefusal) ?? "doctor-failed");
		}
		if ((await resolveControlUiAssetHealth({ root: gitRoot })).kind !== "ready") {
			steps.push(failureStep("ui-assets-verify", "verify startup assets", "Control UI startup assets are missing or incomplete after Doctor"));
			return await rollbackError("ui-assets-missing");
		}
		const afterBuildId = await readBuiltGatewayBuildId(gitRoot);
		const afterShaStep = await runStep(step("git-verify-head", [
			"git",
			"-C",
			gitRoot,
			"rev-parse",
			"HEAD"
		], gitRoot));
		if (isFailedUpdateStep(afterShaStep)) return await rollbackError("head-verification-failed");
		if (afterShaStep.stdoutTail?.trim() !== preflight.candidateSha) return await rollbackError("target-sha-mismatch");
		const gitRuntime = await readGitRuntimeArtifactIdentity(gitRoot);
		return {
			status: "ok",
			mode: "git",
			root: gitRoot,
			before,
			gitRuntime,
			sourceRuntimePrepared: true,
			after: {
				sha: afterShaStep.stdoutTail?.trim() ?? null,
				version: await readPackageVersion(gitRoot),
				...afterBuildId ? { buildId: afterBuildId } : {},
				...devTarget?.mode === "tracked" ? { upstreamRef: devTarget.upstreamRef } : {}
			},
			steps,
			durationMs: Date.now() - startedAt
		};
	};
	return settleGitUpdateCleanup(async () => {
		try {
			return await runUpdate();
		} catch (error) {
			cleanupUncertain = hasCommandProcessCleanupError(error);
			if (!mutationPrepared || cleanupUncertain) throw error;
			const fact = createUpdateErrorFact("git update", error, defaultCommandEnv);
			steps.push({
				...failureStep("git-update", "update checkout", fact.message),
				failureFacts: [fact]
			});
			let rollbackFailure;
			try {
				return await rollbackError(error instanceof UpdateRequesterRevokedError ? error.code : "unexpected-error");
			} catch (cause) {
				cleanupUncertain = hasCommandProcessCleanupError(cause);
				rollbackFailure = cause;
			}
			throw new AggregateError([error, rollbackFailure], "Git update and rollback failed", { cause: error });
		}
	}, async () => {
		if (!cleanupUncertain) {
			await candidateTransfer?.cleanup(step("git-update-pack-cleanup", [], gitRoot));
			if (!runtimeRetained && await cleanupCandidateRuntime()) await runtimePromotion?.cleanup();
		}
	}, cleanupReportingFailures);
}
//#endregion
//#region src/cli/update-cli/update-command-recovery.ts
function readOriginalUpdateRecovery(params, timeoutMs) {
	return params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, timeoutMs) : verifyPackageUpdateRecovery(params.root);
}
/** Refuse retained recovery before any package-only effects or diagnostic writes. */
function assertUpdateCommandRecovery(opts) {
	opts.run?.executorFence?.assertCurrent();
	assertUpdateCommandRecoveryState(opts);
}
function assertUpdateCommandRecoveryState(opts) {
	if (opts.recovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
	const current = opts.run && loadUpdateRecovery(opts.run.runId, {
		env: opts.run.env,
		allowNativeRead: true
	});
	if (current) throw new UpdateRecoveryRequiredError(current);
}
/** Package-only finalization cannot adopt a retained full-state claim. */
async function assertUpdateCommandPackageFinalization(params) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	const assertCurrent = () => executor?.assertCurrent();
	try {
		assertCurrent();
		if (params.opts.recovery) throw new Error("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
		const env = params.ownedManagedUpdateEnv ?? params.opts.run?.env;
		const targetPath = resolveOpenClawStateSqlitePath(env);
		await assertUpdateRecoveryAdmission({
			env,
			path: targetPath
		});
		assertCurrent();
		if (run && resolveOpenClawStateSqlitePath(run.env) !== targetPath) {
			await assertUpdateRecoveryAdmission({ env: run.env });
			assertCurrent();
		}
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(params.result, formatErrorMessage(cause), { cause });
	}
}
/** Hold the originally admitted executor through package finalization awaits. */
function createUpdateCommandFinalizationFence(params) {
	const executor = params.opts.run?.executorFence;
	return () => {
		try {
			executor?.assertCurrent();
		} catch (cause) {
			throw new UpdateCommandPendingRecoveryFailure(params.result, formatErrorMessage(cause), { cause });
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-git.ts
async function retireStandaloneGitWrapper(params) {
	const platform = params.platform ?? process.platform;
	const wrapperName = platform === "win32" ? "openclaw.cmd" : "openclaw";
	const searchDirs = params.searchDirs ?? (process.env.PATH ?? "").split(path.delimiter);
	const expectedEntry = platform === "win32" ? path.win32.join(params.previousRoot, "dist", "entry.js") : path.join(params.previousRoot, "dist", "entry.js");
	const seen = /* @__PURE__ */ new Set();
	for (const directory of searchDirs) {
		if (!directory) continue;
		const wrapperPath = path.resolve(directory, wrapperName);
		if (seen.has(wrapperPath)) continue;
		seen.add(wrapperPath);
		let stat;
		try {
			stat = await fs$1.lstat(wrapperPath, { bigint: true });
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			return { error: `Could not inspect ${wrapperPath}: ${String(error)}` };
		}
		if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4096n || platform !== "win32" && (stat.mode & 73n) === 0n) continue;
		let contents;
		try {
			contents = await fs$1.readFile(wrapperPath, "utf8");
		} catch (error) {
			return { error: `Could not inspect ${wrapperPath}: ${String(error)}` };
		}
		const lines = contents.trimEnd().split(/\r?\n/u);
		const matchesWindows = platform === "win32" && lines.length === 2 && lines[0] === "@echo off" && lines[1] === `node "${expectedEntry}" %*`;
		const execArgs = platform === "win32" || lines.length !== 3 ? null : splitShellArgs(lines[2] ?? "");
		const matchesPosix = platform !== "win32" && lines[0] === "#!/usr/bin/env bash" && lines[1] === "set -euo pipefail" && execArgs?.length === 4 && execArgs[0] === "exec" && execArgs[2] === expectedEntry && execArgs[3] === "$@";
		if (!matchesWindows && !matchesPosix) continue;
		await createSystemPackageOwnershipInspection(UPDATE_RUNNER_TIMEOUT_MS).assertEntryUnowned(wrapperPath);
		try {
			const currentFile = await readRegularFile$1({
				filePath: wrapperPath,
				maxBytes: 4096
			});
			const current = await fs$1.lstat(wrapperPath, { bigint: true });
			if (!current.isFile() || !sameFileIdentity(stat, currentFile.exactIdentity) || !sameFileIdentity(currentFile.exactIdentity, current) || currentFile.buffer.toString("utf8") !== contents) throw new Error("The installer wrapper changed before retirement.");
		} catch (error) {
			return { error: `Could not retire ${wrapperPath}: ${String(error)}` };
		}
		params.assertCurrent?.();
		try {
			await fs$1.unlink(wrapperPath);
		} catch (error) {
			return { error: `Could not retire ${wrapperPath}: ${String(error)}` };
		}
	}
	return {};
}
async function runReadOnlyGitCommand(params) {
	return params.runCommand([
		"git",
		"-C",
		params.root,
		...params.args
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => null);
}
async function listGitRemotes(params) {
	const result = await runReadOnlyGitCommand({
		...params,
		args: ["remote"]
	});
	if (result?.code !== 0) return { metadataUnreadable: "could not inspect configured Git remotes" };
	return { remotes: result.stdout.split("\n").map((value) => value.trim()).filter(Boolean) };
}
async function resolveCurrentRemoteBranchRevision(params) {
	const readGit = async (...args) => {
		const result = await runReadOnlyGitCommand({
			...params,
			args
		});
		return result?.code === 0 ? result.stdout.trim() || null : null;
	};
	const source = await readGitUpdateFetchTarget(readGit, DEV_BRANCH, params.useDevDefault);
	if (!source) return { status: "missing" };
	const trackingRef = await resolveGitUpdateTrackingRef(readGit, DEV_BRANCH, source);
	const localRevision = trackingRef ? await readGit("rev-parse", trackingRef) : null;
	if (source.remote === ".") return localRevision ? {
		status: "ok",
		revision: localRevision
	} : { status: "missing" };
	const remoteLabel = `${source.remote}/${source.mergeRef.replace(/^refs\/heads\//u, "")}`;
	const remoteResult = await readGit("ls-remote", "--exit-code", source.remote, source.mergeRef);
	const remoteRevision = remoteResult ? readExactRemoteRevision(remoteResult, source.mergeRef) : null;
	if (!remoteRevision) return {
		status: "unreadable",
		reason: `could not inspect current remote target ${remoteLabel}`
	};
	return localRevision === remoteRevision ? {
		status: "ok",
		revision: remoteRevision
	} : {
		status: "unreadable",
		reason: `cached ${trackingRef?.replace(/^refs\/remotes\//u, "") ?? "Git target"} differs from current remote ${remoteLabel}`,
		failureCode: "target-git-cache-stale"
	};
}
function readExactRemoteRevision(stdout, ref) {
	const matches = stdout.split("\n").map((line) => line.trim().split(/\s+/u)).filter((parts) => parts.length === 2 && parts[1] === ref).map((parts) => parts[0] ?? "").filter((sha) => /^[0-9a-f]{40,64}$/iu.test(sha));
	return matches.length === 1 ? matches[0] ?? null : null;
}
function readRemoteTagRevisions(stdout) {
	const direct = /* @__PURE__ */ new Map();
	const peeled = /* @__PURE__ */ new Map();
	for (const line of stdout.split("\n")) {
		const [sha = "", ref = "", extra] = line.trim().split(/\s+/u);
		if (extra || !/^[0-9a-f]{40,64}$/iu.test(sha)) {
			if (line.trim()) return null;
			continue;
		}
		const match = /^refs\/tags\/(v.+?)(\^\{\})?$/u.exec(ref);
		if (!match) return null;
		(match[2] ? peeled : direct).set(match[1], sha);
	}
	return new Map([...direct, ...peeled]);
}
async function resolveCurrentRemoteTagRevision(params) {
	const remoteList = await listGitRemotes(params);
	if (remoteList.metadataUnreadable) return { metadataUnreadable: remoteList.metadataUnreadable };
	const remotes = remoteList.remotes ?? [];
	if (remotes.length === 0) return { metadataUnreadable: "could not resolve a remote for the selected Git release" };
	const tagRevisions = /* @__PURE__ */ new Map();
	for (const remote of remotes) {
		const result = await runReadOnlyGitCommand({
			...params,
			args: [
				"ls-remote",
				"--tags",
				remote,
				"refs/tags/v*"
			]
		});
		const remoteTags = result?.code === 0 ? readRemoteTagRevisions(result.stdout) : null;
		if (!remoteTags) return { metadataUnreadable: `could not inspect current release tags from ${remote}` };
		for (const [tag, revision] of remoteTags) {
			const existing = tagRevisions.get(tag);
			if (existing && existing !== revision) return { metadataUnreadable: `release tag ${tag} resolves differently across remotes` };
			tagRevisions.set(tag, revision);
		}
	}
	const tag = selectChannelTag([...tagRevisions.keys()], params.channel);
	return tag ? { revision: tagRevisions.get(tag) } : { metadataUnreadable: "could not resolve the selected Git release tag" };
}
async function inspectGitDryRunTargetSchemaVersions(params) {
	const runCommand = (argv, options) => runCommandWithTimeout(argv, {
		...options,
		env: {
			...options.env,
			GIT_OPTIONAL_LOCKS: "0",
			GIT_NO_LAZY_FETCH: "1"
		}
	});
	const runTargetCommand = (argv, options) => runCommand(argv, {
		...options,
		timeoutMs: options.timeoutMs ?? params.timeoutMs
	});
	let revision = null;
	if (params.channel === "extended-stable") return { metadataUnreadable: "extended-stable is unavailable for Git updates" };
	if (params.channel !== "dev") {
		const resolved = await resolveCurrentRemoteTagRevision({
			runCommand,
			root: params.root,
			timeoutMs: params.timeoutMs,
			channel: params.channel
		});
		if (resolved.metadataUnreadable) return { metadataUnreadable: resolved.metadataUnreadable };
		revision = resolved.revision ?? null;
	} else if (params.devTarget) {
		const selected = resolveDevUpdateTargetRevision(params.devTarget);
		if (!/^[0-9a-f]{40,64}$/iu.test(selected)) return { metadataUnreadable: "the explicit symbolic Git target requires a fetch to verify" };
		revision = selected;
	} else {
		const branch = await readBranchName(runTargetCommand, params.root, params.timeoutMs);
		const resolved = await resolveCurrentRemoteBranchRevision({
			runCommand,
			root: params.root,
			timeoutMs: params.timeoutMs,
			useDevDefault: branch !== DEV_BRANCH
		});
		if (resolved.status === "ok") revision = resolved.revision;
		else if (resolved.status === "unreadable") return {
			metadataUnreadable: resolved.reason,
			failureCode: resolved.failureCode
		};
	}
	if (!revision) return { metadataUnreadable: "could not resolve the selected Git target" };
	const target = await readGitTargetSchemaVersions({
		runCommand: runTargetCommand,
		root: params.root,
		revision,
		timeoutMs: params.timeoutMs
	});
	return target.status === "ok" ? {
		schemaVersions: target.schemaVersions,
		nodeEngine: target.nodeEngine
	} : {
		metadataUnreadable: target.reason,
		...target.reason.startsWith("git show ") ? { failureCode: "target-git-cache-stale" } : {}
	};
}
async function updateGitInstall(params) {
	const assertCurrent = params.assertCurrent;
	let updateRoot = params.switchToGit ? resolveGitInstallDir() : params.root;
	const effectiveTimeout = params.timeoutMs ?? 18e5;
	const pkgOwnership = createSystemPackageOwnershipInspection(effectiveTimeout);
	await pkgOwnership.assertUnowned(updateRoot);
	const installTarget = params.switchToGit ? await resolveGlobalInstallTarget({
		manager: await resolveGlobalManager({
			root: params.root,
			installKind: params.installKind,
			timeoutMs: effectiveTimeout,
			pkgOwnership
		}),
		runCommand: runCommandWithTimeout,
		timeoutMs: effectiveTimeout,
		pkgRoot: params.root,
		pkgOwnership
	}) : null;
	const installEnv = await createGlobalInstallEnv(void 0, installTarget ?? {});
	const npmLifecycleGate = installTarget ? resolveNpmLifecyclePolicyGate(installTarget) : {
		policy: null,
		error: null
	};
	const failed = async (reason, steps, recovery = readOriginalUpdateRecovery(params, effectiveTimeout)) => ({
		status: "error",
		mode: "git",
		root: params.root,
		reason,
		recovery: await recovery,
		steps,
		durationMs: Date.now() - params.startedAt
	});
	if (npmLifecycleGate.error) {
		defaultRuntime.error(npmLifecycleGate.error);
		return failed("npm-lifecycle-policy-preflight", []);
	}
	const checkSnapshot = async () => {
		await params.progress.onStepStart?.({
			name: "snapshot-space-preflight",
			command: "snapshot-space-preflight",
			index: 0,
			total: 0
		});
		assertCurrent?.();
		const { config, env } = await params.getSnapshotSource();
		const snapshot = await assessInitialUpdateSnapshotCapacity({
			config,
			stateDir: resolveStateDir(env),
			env
		});
		await reportUpdateStepCompletion(params.progress, {
			...snapshot,
			index: 0,
			total: 0
		});
		assertCurrent?.();
		if (snapshot.exitCode !== 0) defaultRuntime.error(snapshot.stderrTail ?? "snapshot-capacity-insufficient");
		else for (const warning of snapshot.warnings ?? []) if (params.jsonMode) defaultRuntime.error(`Warning: ${warning}`);
		else defaultRuntime.log(theme.warn(warning));
		return snapshot;
	};
	const snapshotBeforeClone = params.switchToGit ? await checkSnapshot() : void 0;
	if (snapshotBeforeClone && snapshotBeforeClone.exitCode !== 0) return failed("snapshot-capacity-insufficient", [snapshotBeforeClone], verifyPackageUpdateRecovery(params.root));
	const previousPackage = installTarget ? await readPackageUpdateIdentity(installTarget.packageRoot ?? params.root) : void 0;
	let exposure;
	const runDoctor = (root, results) => runPackageUpdateDoctor({
		...params,
		results,
		managedServiceEnv: params.getManagedServiceEnv(),
		root,
		timeoutMs: effectiveTimeout,
		workTimeoutMs: params.timeoutMs ?? null
	});
	const runUpdate = async (gitRoot, publishGitCheckout, gitArtifactStorageRoot) => updateGitCheckout({
		...await buildUpdateCommandRunner(),
		gitRoot,
		timeoutMs: params.timeoutMs ?? 12e5,
		startedAt: params.startedAt,
		opts: {
			timeoutMs: params.timeoutMs,
			sourceRuntimePrepared: params.sourceRuntimePrepared,
			progress: params.progress,
			channel: params.channel,
			devTarget: params.devTarget,
			beforeGitMutation: async (target) => {
				await params.beforeGitMutation(target);
				await createSystemPackageOwnershipInspection(effectiveTimeout).assertUnowned(updateRoot);
				params.assertCurrent?.();
			},
			inspectGitTarget: (target) => params.inspectGitTarget(target, installTarget ?? void 0),
			beforeGitStaging: params.switchToGit ? void 0 : async () => ({
				step: await checkSnapshot(),
				failureReason: "snapshot-capacity-insufficient"
			}),
			publishGitCheckout,
			gitArtifactStorageRoot,
			validateCandidate: params.validateCandidate,
			...installTarget ? { prepareGitExposure: async (candidateRoot, candidateSha, candidateEnv) => {
				const packageName = await readPackageName(installTarget.packageRoot ?? params.root) ?? "openclaw";
				exposure = await prepareGitPackageExposure({
					installTarget,
					installSpec: candidateRoot,
					packageName,
					packageRoot: installTarget.packageRoot,
					runCommand: runCommandWithTimeout,
					runStep: (stepParams) => runUpdateStep({
						...stepParams,
						progress: params.progress
					}),
					timeoutMs: effectiveTimeout,
					workTimeoutMs: params.timeoutMs ?? null,
					env: mergeProcessEnv([installEnv, candidateEnv]),
					installCwd: candidateRoot,
					expectedGitCheckout: {
						root: candidateRoot,
						sha: candidateSha
					},
					activateGitRoot: updateRoot,
					onTransaction: params.onTransaction,
					assertCurrent: params.assertCurrent,
					postVerifyStep: runDoctor
				});
			} } : {
				onTransaction: params.onTransaction,
				runGitDoctor: runDoctor
			}
		}
	});
	let stagedUpdateResult;
	try {
		const checkout = params.switchToGit ? await ensureGitCheckout({
			dir: updateRoot,
			env: installEnv,
			timeoutMs: effectiveTimeout,
			progress: params.progress,
			useStagedCheckout: async (stagingRoot, publish, targetRoot, storageRoot) => {
				updateRoot = targetRoot;
				await createSystemPackageOwnershipInspection(effectiveTimeout).assertUnowned(updateRoot);
				stagedUpdateResult = await runUpdate(stagingRoot, publish, storageRoot);
				if (stagedUpdateResult.root === stagingRoot) stagedUpdateResult = {
					...stagedUpdateResult,
					root: params.root,
					recovery: await verifyPackageUpdateRecovery(params.root)
				};
			}
		}) : null;
		const cloneStep = checkout?.step ?? null;
		updateRoot = checkout?.checkoutDir ?? updateRoot;
		if (cloneStep && cloneStep.exitCode !== 0) return await failed("git-clone-failed", [...snapshotBeforeClone ? [snapshotBeforeClone] : [], cloneStep]);
		const updateResult = stagedUpdateResult ?? await runUpdate(updateRoot);
		const before = previousPackage ?? updateResult.before;
		const steps = [
			...snapshotBeforeClone ? [snapshotBeforeClone] : [],
			...cloneStep ? [cloneStep] : [],
			...updateResult.steps
		];
		if (exposure && updateResult.status === "ok") {
			const packageUpdate = await exposure.activate();
			return {
				...updateResult,
				before,
				status: packageUpdate.failedStep ? "error" : "ok",
				reason: packageUpdate.reason ?? getUpdateDoctorConfigFailureReason(packageUpdate.failedStep?.configWriteRefusal) ?? (packageUpdate.failedStep ? normalizeFallbackFailureReason(packageUpdate.failedStep.name) : void 0),
				recovery: packageUpdate.recovery,
				failedStep: packageUpdate.failedStep ?? void 0,
				steps: [...steps, ...packageUpdate.steps],
				durationMs: Date.now() - params.startedAt
			};
		}
		if (exposure) {
			const cancelled = await exposure.cancel();
			exposure = void 0;
			const packageRoot = installTarget?.packageRoot ?? params.root;
			const [packageOwner, gitOwner, serviceUsesPackage] = await Promise.all([
				fs$1.realpath(packageRoot).catch(() => null),
				fs$1.realpath(updateRoot).catch(() => null),
				gatewayServiceCommandUsesRoot({
					root: packageRoot,
					env: params.getManagedServiceEnv()
				})
			]);
			if (packageOwner && gitOwner && packageOwner !== gitOwner && serviceUsesPackage === true) updateResult.recovery = cancelled.recovery;
			steps.push(...cancelled.steps);
		}
		return {
			...updateResult,
			before,
			steps,
			durationMs: Date.now() - params.startedAt
		};
	} finally {
		await exposure?.cancel();
	}
}
//#endregion
export { assertUpdateCommandRecovery as a, readOriginalUpdateRecovery as c, assertUpdateCommandPackageFinalization as i, retireStandaloneGitWrapper as n, assertUpdateCommandRecoveryState as o, updateGitInstall as r, createUpdateCommandFinalizationFence as s, inspectGitDryRunTargetSchemaVersions as t };
