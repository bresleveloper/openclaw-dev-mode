import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { l as readDatabasePathIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { d as runSqliteReadOnlyOperation } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { l as syncDirectory, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { c as resolvePackageActivationAnchor, d as resolvePackageActivationJournalPath, l as resolvePackageActivationControl, o as packageActivationRuntimeIdentity } from "./package-update-activation-paths-D77TjCW-.mjs";
import { n as ImmutableInstallRecordSchema } from "./update-immutable-install-schema-DFmmcnqh.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/infra/update-immutable-install-record.ts
async function readImmutableInstallRecord(root) {
	const anchor = resolvePackageActivationAnchor(root);
	try {
		await fs$1.lstat(resolvePackageActivationControl(anchor));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
	const journal = resolvePackageActivationJournalPath(anchor);
	const identity = await readDatabasePathIdentity(journal);
	const record = await runSqliteReadOnlyOperation(journal, {
		type: "immutableInstall.read",
		input: { root }
	}, {
		source: "canonical",
		expectedIdentity: identity.key,
		env: process.env
	});
	return ImmutableInstallRecordSchema.parse(record);
}
//#endregion
//#region src/infra/update-immutable-layout.ts
const SHA$1 = /^[a-f0-9]{40}$/u;
function directoryIdentity(file) {
	const stat = fs.lstatSync(file);
	if (!stat.isDirectory() || stat.uid !== 0 || (stat.mode & 18) !== 0) throw new Error(`Immutable installation directory must be root-owned and protected: ${file}`);
	return `${stat.dev}:${stat.ino}`;
}
function readImmutableLayout(root) {
	if (fs.realpathSync(root) !== root) throw new Error("Immutable installation must have a canonical physical root.");
	const rootIdentity = directoryIdentity(root);
	const releases = path.join(root, "releases");
	const releasesIdentity = directoryIdentity(releases);
	const pointer = path.join(root, "current");
	const stat = fs.lstatSync(pointer);
	const target = stat.isSymbolicLink() ? fs.readlinkSync(pointer) : "";
	const generationPath = path.resolve(root, target);
	const sha = path.basename(generationPath);
	if (!stat.isSymbolicLink() || stat.uid !== 0 || !SHA$1.test(sha) || path.dirname(generationPath) !== releases) throw new Error("Immutable current must select a root-owned direct releases/<40-hex SHA> generation.");
	const identity = directoryIdentity(generationPath);
	if (fs.realpathSync(pointer) !== generationPath || rootIdentity.split(":")[0] !== releasesIdentity.split(":")[0] || identity.split(":")[0] !== releasesIdentity.split(":")[0]) throw new Error("Immutable release layout must be contained on one filesystem.");
	return {
		rootIdentity,
		releasesIdentity,
		current: {
			sha,
			path: generationPath,
			identity,
			pointerIdentity: `${stat.dev}:${stat.ino}`
		}
	};
}
function assertImmutableDescriptorCurrent(descriptor) {
	const layout = readImmutableLayout(descriptor.root);
	if (layout.rootIdentity !== descriptor.rootIdentity || layout.releasesIdentity !== descriptor.releasesIdentity || layout.current.sha !== descriptor.current.sha || layout.current.path !== descriptor.current.path || layout.current.identity !== descriptor.current.identity || layout.current.pointerIdentity !== descriptor.current.pointerIdentity || packageActivationRuntimeIdentity(descriptor.runtime.path) !== descriptor.runtime.identity) throw new Error("Immutable installation changed since adoption; current was not modified.");
}
//#endregion
//#region src/infra/update-immutable-owner.ts
/** All immutable writers share the native executor; its lease survives host reboot beside control. */
async function withImmutableUpdateOwner(root, run, authority, options) {
	const { withUpdateCommandExecutor } = await import("./update-command-executor-BiuIJSym.mjs");
	const control = resolvePackageActivationControl(resolvePackageActivationAnchor(root));
	const leasePath = path.join(control, "executor", "lease.sqlite");
	let pinned = authority;
	if (authority && authority.databasePath !== leasePath) throw new Error("Immutable recovery executor does not match its installation control.");
	if (!pinned && fs.existsSync(control)) {
		const stat = fs.lstatSync(control);
		if (!stat.isDirectory() || stat.uid !== 0 || (stat.mode & 18) !== 0 || fs.realpathSync(control) !== control) throw new Error("Immutable executor control is not root-owned and protected.");
		const { createManagedHandoffLeaseDatabase, captureManagedUpdateLeaseDatabaseIdentity } = await import("./update-managed-service-handoff-database-DLM-aScz.mjs");
		if (!fs.existsSync(leasePath)) createManagedHandoffLeaseDatabase(leasePath)(true, () => void 0);
		pinned = {
			...captureManagedUpdateLeaseDatabaseIdentity(leasePath),
			installKey: root
		};
	}
	if (options?.recover && pinned) {
		const { recoverManagedUpdateLeaseJournal } = await import("./update-managed-service-handoff-database-recovery-DXi3nOPw.mjs");
		await recoverManagedUpdateLeaseJournal({
			existingIdentity: pinned,
			installKey: root,
			serviceManagerEnv: process.env
		});
	}
	return withUpdateCommandExecutor(randomUUID(), async (executor) => {
		const fence = await executor.enter(root);
		return run(fence.assertCurrent, fence);
	}, pinned ? { existingAuthority: pinned } : void 0);
}
//#endregion
//#region src/infra/update-immutable-install.ts
const SHA = /^[a-f0-9]{40}$/u;
const SOURCE = "https://github.com/openclaw/openclaw.git";
function projectImmutableInstall(record) {
	const { descriptor, prepared } = record;
	return {
		root: descriptor.root,
		currentSha: descriptor.current.sha,
		currentPath: descriptor.current.path,
		...descriptor.activationEnabled ? { activationEnabled: true } : {},
		...record.activation?.operation ? { activation: {
			operationId: record.activation.operation.operationId,
			phase: record.activation.operation.phase,
			previousSha: record.activation.operation.previous.sha,
			candidateSha: record.activation.operation.candidate.sha
		} } : {},
		...record.activation?.lastResult ? { lastActivation: {
			operationId: record.activation.lastResult.operationId,
			outcome: record.activation.lastResult.outcome,
			selectedSha: record.activation.lastResult.selectedSha,
			verifiedAtMs: record.activation.lastResult.verifiedAtMs
		} } : {},
		...prepared ? { prepared: {
			sha: prepared.sha,
			path: prepared.path,
			buildDigest: prepared.buildDigest,
			preparedAtMs: prepared.preparedAtMs
		} } : {}
	};
}
async function installationRoot(input) {
	const root = path.resolve(input);
	if (path.basename(path.dirname(root)) === "releases" && /^[a-f0-9]{40}$/iu.test(path.basename(root))) return path.dirname(path.dirname(root));
	if (path.basename(root) === "current") {
		if ((await fs$1.lstat(root).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return null;
			throw error;
		}))?.isSymbolicLink()) return path.dirname(root);
	}
	if (!await fs$1.lstat(path.join(root, "current")).catch((error) => {
		if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return null;
		throw error;
	})) return null;
	return await fs$1.lstat(path.join(root, "releases")).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}) ? root : null;
}
/** Shape is only a hint. Unadopted releases must never fall through to mutable Git. */
async function inspectImmutableInstall(root) {
	const installation = await installationRoot(root);
	if (!installation) return null;
	const record = await readImmutableInstallRecord(installation);
	if (!record) throw new Error("Immutable release layout is not adopted. Use openclaw update adopt-immutable after its previous updater has stopped.");
	const operation = record.activation?.operation;
	if (operation?.pointerIntent) {
		const layout = readImmutableLayout(record.descriptor.root);
		const intent = operation.pointerIntent;
		const selected = intent.targetSha === operation.candidate.sha ? operation.candidate : operation.previous;
		if (layout.current.pointerIdentity === intent.temporaryIdentity && layout.current.sha === selected.sha && layout.current.identity === selected.identity) {
			assertImmutableDescriptorCurrent({
				...record.descriptor,
				current: {
					...layout.current,
					buildDigest: selected.buildDigest
				}
			});
			return projectImmutableInstall({
				...record,
				descriptor: {
					...record.descriptor,
					current: {
						...layout.current,
						buildDigest: selected.buildDigest
					}
				}
			});
		}
	}
	assertImmutableDescriptorCurrent(record.descriptor);
	return projectImmutableInstall(record);
}
function requireUpdater() {
	if (process.platform !== "linux" || process.geteuid?.() !== 0) throw new Error("Immutable preparation and adoption require the root updater on Linux; the current Gateway remains running.");
}
async function adoptImmutableInstall(params) {
	requireUpdater();
	const { installImmutableLauncher, verifyImmutableGeneration } = await import("./update-immutable-generation-TjPbxxnH.mjs");
	const { verifyImmutableService } = await import("./update-immutable-service-DdJCenlK.mjs");
	const { ImmutableInstallDescriptorSchema } = await import("./update-immutable-install-schema-BT7GNQuC.mjs");
	if (!params.previousUpdaterStopped) throw new Error("The previous updater must be stopped before adoption.");
	const root = await fs$1.realpath(params.root);
	return withImmutableUpdateOwner(root, async (assertOwner) => {
		const layout = readImmutableLayout(root);
		const runtime = await fs$1.realpath(params.runtime);
		const runtimeStat = await fs$1.lstat(runtime);
		if (!runtimeStat.isFile() || runtimeStat.uid !== 0 || (runtimeStat.mode & 18) !== 0 || runtime.startsWith(`${root}/`)) throw new Error("Immutable installation requires a protected external Node runtime.");
		for (let parent = path.dirname(runtime);; parent = path.dirname(parent)) {
			directoryIdentity(parent);
			if (parent === path.dirname(parent)) break;
		}
		const generation = await verifyImmutableGeneration(layout.current.path, layout.current.sha);
		const descriptor = {
			version: params.enableActivation ? 2 : 1,
			...params.enableActivation ? { activationEnabled: true } : {},
			kind: "immutable",
			root,
			...layout,
			current: {
				...layout.current,
				buildDigest: generation.buildDigest
			},
			service: params.service,
			runtime: {
				path: runtime,
				identity: packageActivationRuntimeIdentity(runtime)
			},
			source: SOURCE
		};
		ImmutableInstallDescriptorSchema.parse(descriptor);
		const assertCurrent = () => {
			assertOwner();
			assertImmutableDescriptorCurrent(descriptor);
		};
		const { createImmutableInstallRecord, updateImmutableInstallRecord, assertImmutableInstallRecordCurrent } = await import("./package-update-activation-immutable-D2JuwVAn.mjs");
		const existing = await readImmutableInstallRecord(root);
		assertCurrent();
		if (existing) {
			if (existing.activation?.operation) throw new Error("Immutable activation recovery is pending; run openclaw update recover.");
			const { isDeepStrictEqual } = await import("node:util");
			const { version: _version, activationEnabled: _enabled, current: previous, ...original } = existing.descriptor;
			const { version: _nextVersion, activationEnabled: _nextEnabled, current: selected, ...requested } = descriptor;
			const upgrade = params.enableActivation && existing.descriptor.version === 1;
			if (!isDeepStrictEqual(original, requested) || !upgrade && !isDeepStrictEqual(previous, selected)) throw new Error("Existing immutable adoption differs; preserve its original owner.");
			if (upgrade) {
				const { withGatewayServiceOperationLock } = await import("./service-operation-lock-k_pdLDZV.mjs");
				const { inspectImmutableActivationService, assertImmutableServiceProcessCurrent } = await import("./update-immutable-service-DdJCenlK.mjs");
				return withGatewayServiceOperationLock({ OPENCLAW_SYSTEMD_UNIT: descriptor.service.unit }, async (assertNative) => {
					const assertUpgrade = () => {
						assertCurrent();
						assertNative();
						assertImmutableInstallRecordCurrent(existing, assertCurrent);
						if (directoryIdentity(previous.path) !== previous.identity) throw new Error("Previous sealed immutable generation changed; adoption is unchanged.");
					};
					assertUpgrade();
					const retained = previous.path === selected.path ? generation : await verifyImmutableGeneration(previous.path, previous.sha);
					assertUpgrade();
					if (retained.identity !== previous.identity || retained.buildDigest !== previous.buildDigest) throw new Error("Previous sealed immutable generation changed; adoption is unchanged.");
					const service = await inspectImmutableActivationService({
						descriptor,
						generationPath: selected.path,
						assertCurrent: assertUpgrade
					});
					const assertServing = () => {
						assertUpgrade();
						assertImmutableServiceProcessCurrent(service);
					};
					assertServing();
					await installImmutableLauncher({
						root,
						runtimePath: runtime,
						upgradeFromV1: { assertCurrent: assertServing }
					});
					assertServing();
					const prepared = existing.prepared;
					const selectedPrepared = prepared?.sha === selected.sha && prepared.path === selected.path && prepared.identity === selected.identity && prepared.buildDigest === selected.buildDigest;
					const { pointerIdentity: _pointerIdentity, ...predecessor } = previous;
					return projectImmutableInstall(updateImmutableInstallRecord(existing, {
						...existing,
						descriptor,
						prepared: selectedPrepared ? null : prepared,
						...previous.sha !== selected.sha ? { activation: {
							...existing.activation,
							previous: predecessor
						} } : {}
					}, assertServing));
				});
			}
		}
		await verifyImmutableService(descriptor.service, root, descriptor.current.path, runtime);
		assertCurrent();
		await installImmutableLauncher({
			root,
			runtimePath: runtime
		});
		assertCurrent();
		return projectImmutableInstall(existing ?? createImmutableInstallRecord(descriptor, assertCurrent));
	});
}
/** Prepare only. Pointer publication, Doctor, drain, and service activation belong to slice 2. */
async function prepareImmutableUpdate(params) {
	const installation = await inspectImmutableInstall(params.root);
	if (!installation) throw new Error("Installation is not an adopted immutable release.");
	const steps = [];
	const warnings = [];
	let targetSha;
	const result = (status, reason) => ({
		status,
		reason,
		installation,
		targetSha,
		steps,
		warnings
	});
	try {
		if (params.sha !== void 0 && !SHA.test(params.sha)) throw new Error("--sha requires a full lowercase 40-hex commit SHA.");
		const { buildUpdateCommandRunner, runStep } = await import("./update-runner-command-l6TrY3Am.mjs");
		const { resolveImmutableGenerationEnv, sealImmutableGeneration, verifyImmutableGeneration } = await import("./update-immutable-generation-TjPbxxnH.mjs");
		const runner = await buildUpdateCommandRunner();
		const defaultCommandEnv = resolveImmutableGenerationEnv(runner.defaultCommandEnv);
		const runCommand = (argv, options) => runner.runCommand(argv, {
			...options,
			env: resolveImmutableGenerationEnv({
				...defaultCommandEnv,
				...options.env
			})
		});
		const timeoutMs = params.timeoutMs ?? 12e5;
		const step = (name, argv, cwd, env) => ({
			name,
			argv,
			cwd,
			env,
			runCommand,
			timeoutMs,
			results: steps,
			stepIndex: steps.length,
			totalSteps: 0
		});
		const command = async (name, argv, cwd) => {
			const outcome = await runStep(step(name, argv, cwd));
			if (outcome.exitCode !== 0 || outcome.termination && outcome.termination !== "exit") throw new Error(`${name} failed; current was not modified.`);
			return outcome.stdoutTail?.trim() ?? "";
		};
		targetSha = params.sha;
		if (!targetSha) {
			const match = (await command("immutable-resolve-main", [
				"git",
				"ls-remote",
				"--exit-code",
				SOURCE,
				"refs/heads/main"
			], installation.root)).match(/^([a-f0-9]{40})\s+refs\/heads\/main$/u);
			if (!match?.[1]) throw new Error("Official main did not resolve to one exact commit.");
			targetSha = match[1];
		}
		if (params.dryRun) return result("dry-run", "preparation-only; activation unavailable");
		requireUpdater();
		const { collectGitRuntimeErrors } = await import("./update-git-runtime-CsxzS_k8.mjs");
		const { verifyImmutableService } = await import("./update-immutable-service-DdJCenlK.mjs");
		const { runGitCandidatePreflight } = await import("./update-runner-git-preflight-DCwXEDTy.mjs");
		const { readGitTargetSchemaVersions } = await import("./update-runner-git-target-CqTQYKLU.mjs");
		const selectedSha = targetSha;
		return await withImmutableUpdateOwner(installation.root, async (assertOwner) => {
			const record = await readImmutableInstallRecord(installation.root);
			if (!record) throw new Error("Immutable adoption record disappeared.");
			if (record.activation?.operation) throw new Error("Immutable activation recovery is pending; run openclaw update recover.");
			const descriptor = record.descriptor;
			if (await fs$1.realpath(process.execPath) !== descriptor.runtime.path) throw new Error(`Run preparation with the adopted Node executable: ${descriptor.runtime.path}`);
			const assertCurrent = () => {
				assertOwner();
				assertImmutableDescriptorCurrent(descriptor);
			};
			assertCurrent();
			await verifyImmutableService(descriptor.service, descriptor.root, descriptor.current.path, descriptor.runtime.path);
			if ((await verifyImmutableGeneration(descriptor.current.path, descriptor.current.sha, runCommand)).buildDigest !== descriptor.current.buildDigest) throw new Error("Current sealed generation has changed since adoption.");
			assertCurrent();
			if (selectedSha === descriptor.current.sha) return result("already-current");
			const destination = path.join(descriptor.root, "releases", selectedSha);
			if (await fs$1.lstat(destination).then(() => true, (error) => {
				if (hasErrnoCode(error, "ENOENT")) return false;
				throw error;
			})) {
				if (record.prepared?.sha !== selectedSha) throw new Error("Generation already exists without a matching preparation receipt; preserved for inspection.");
				const existing = await verifyImmutableGeneration(destination, selectedSha, runCommand);
				if (existing.identity !== record.prepared.identity || existing.buildDigest !== record.prepared.buildDigest) throw new Error("Existing prepared generation differs from its receipt; preserved for inspection.");
				assertCurrent();
				return {
					...result("prepared", "activation unavailable"),
					installation: projectImmutableInstall(record)
				};
			}
			assertCurrent();
			const stage = await fs$1.mkdtemp(path.join(descriptor.root, ".openclaw-immutable-"));
			let cleanupUncertain = false;
			try {
				const source = path.join(stage, "source");
				await command("immutable-clone", [
					"git",
					"clone",
					"--no-checkout",
					"--single-branch",
					"--branch",
					"main",
					SOURCE,
					source
				], stage);
				await command("immutable-official-ancestry", [
					"git",
					"-C",
					source,
					"merge-base",
					"--is-ancestor",
					selectedSha,
					"refs/remotes/origin/main"
				], source);
				const metadata = await readGitTargetSchemaVersions({
					runCommand,
					root: source,
					revision: selectedSha,
					timeoutMs
				});
				if (metadata.status !== "ok" || !metadata.schemaVersions) throw new Error("Candidate schema metadata is unreadable.");
				let prepared = null;
				const preflight = await runGitCandidatePreflight({
					gitRoot: source,
					artifactRoot: stage,
					targetRevision: selectedSha,
					refreshedRemotes: ["origin"],
					beforeRuntimeVerified: false,
					frozenLockfile: true,
					needsCheckoutMain: false,
					runCommand,
					timeoutMs,
					defaultCommandEnv: {
						...defaultCommandEnv,
						PATH: `${path.dirname(descriptor.runtime.path)}${path.delimiter}${defaultCommandEnv?.PATH ?? process.env.PATH ?? ""}`
					},
					steps,
					step,
					workStep: step,
					workTimeoutMs: params.timeoutMs,
					beforeCandidate: async (sha) => {
						assertCurrent();
						if (sha !== selectedSha) throw new Error("Immutable preparation cannot fall back to another commit.");
					},
					validateCandidate: async (root) => {
						const errors = await collectGitRuntimeErrors({
							root,
							sha: selectedSha
						});
						if (errors.length) throw new Error(errors.join("; "));
					},
					prepareCandidate: async (built) => {
						const candidate = path.join(stage, "generation");
						await command("immutable-independent-git", [
							"git",
							"clone",
							"--no-hardlinks",
							"--no-checkout",
							source,
							candidate
						], stage);
						await command("immutable-exact-checkout", [
							"git",
							"-C",
							candidate,
							"checkout",
							"--detach",
							selectedSha
						], candidate);
						await fs$1.cp(built, candidate, {
							recursive: true,
							verbatimSymlinks: true,
							filter: (file) => file !== path.join(built, ".git")
						});
						await verifyImmutableGeneration(candidate, selectedSha, runCommand, { sealed: false });
						await sealImmutableGeneration(candidate);
						const verified = await verifyImmutableGeneration(candidate, selectedSha, runCommand);
						await verifyImmutableService(descriptor.service, descriptor.root, descriptor.current.path, descriptor.runtime.path);
						assertCurrent();
						if (fs.existsSync(destination)) throw new Error("Generation publication conflict; existing generation preserved.");
						await fs$1.rename(candidate, destination);
						requireDirectorySync(await syncDirectory(path.dirname(destination)), "Immutable releases");
						assertCurrent();
						prepared = {
							sha: selectedSha,
							path: destination,
							...verified,
							preparedAtMs: Date.now(),
							schemaVersions: metadata.schemaVersions
						};
					}
				});
				if (preflight.status !== "ok" || !prepared) throw new Error(preflight.status === "ok" ? "Candidate preparation did not produce a generation." : preflight.reason);
				assertCurrent();
				const { recordImmutablePreparedGeneration } = await import("./package-update-activation-immutable-D2JuwVAn.mjs");
				const recorded = recordImmutablePreparedGeneration(record, prepared, assertCurrent);
				return {
					...result("prepared", "activation unavailable"),
					installation: projectImmutableInstall(recorded)
				};
			} catch (error) {
				cleanupUncertain = hasCommandProcessCleanupError(error);
				throw error;
			} finally {
				assertCurrent();
				if (cleanupUncertain) warnings.push(`Preparation processes did not settle; retained ${stage} for inspection.`);
				else await fs$1.rm(stage, {
					recursive: true,
					force: true
				}).catch(() => {
					warnings.push(`Preparation scratch retained at ${stage}; current is unchanged.`);
				});
			}
		});
	} catch (error) {
		return result("error", error instanceof Error ? error.message : "Immutable preparation failed; current was not modified.");
	}
}
//#endregion
export { withImmutableUpdateOwner as a, readImmutableLayout as c, projectImmutableInstall as i, readImmutableInstallRecord as l, inspectImmutableInstall as n, assertImmutableDescriptorCurrent as o, prepareImmutableUpdate as r, directoryIdentity as s, adoptImmutableInstall as t };
