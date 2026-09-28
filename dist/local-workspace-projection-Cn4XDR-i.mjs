import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { c as serializeWorkerWorkspaceManifest, l as serializeWorkerWorkspaceReconciliationPlan, o as parseWorkerWorkspaceManifest, s as parseWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-453LPGpv.mjs";
import { r as manifestNodes } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { c as requireGit, l as requireGitBuffer } from "./git-DSwuA7YL.mjs";
import { u as captureWorkspaceSnapshot } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { a as recoverWorkerWorkspaceReconciliation, n as AcceptedWorkspacePublicationIndeterminateError, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BoiN2pej.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-2jwoTM0v.mjs";
import { d as getRegistryWorktree, u as findLiveRegistryWorktreeByPath } from "./registry-UFMGRqcd.mjs";
import { c as splitNullBuffer } from "./git-path-inventory-q-EbMqyF.mjs";
import { a as hasWorkerWorkspaceResultRef, d as withStagedWorkerWorkspaceResult, f as workerWorkspaceResultRef, l as readStagedWorkerWorkspaceResult, p as workerWorkspaceResultStaging, r as deleteStagedWorkerWorkspaceResult } from "./workspace-result-staging-Cy039j72.mjs";
import { t as localWorkspaceStore } from "./local-workspace-store-DNBv7GZo.mjs";
import { a as runWorkspaceInventoryCommandToFile } from "./workspace-sync-inventory-CqvrrDw_.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-DcOK2Mxs.mjs";
import { realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { isUtf8 } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/local-workspace-archive.ts
/** Git preserves ordinary files, not accepted ignored leaves or empty dirs.
* Keep only that missing delta in the existing projection recovery receipt. */
async function stageLocalWorkspaceArchive(params) {
	if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(params.snapshot)) throw new Error("Invalid archive snapshot commit");
	const listed = await requireGitBuffer(params.root, [
		"ls-tree",
		"-r",
		"-z",
		"--name-only",
		params.snapshot
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent,
		maxOutputBytes: 67108864
	});
	params.assertCurrent();
	const paths = new Set(splitNullBuffer(listed).map((entry) => entry.toString("hex")));
	const entries = params.accepted.entries.filter((entry) => paths.has(Buffer.from(entry.path).toString("hex")));
	const directories = /* @__PURE__ */ new Set();
	for (const entry of entries) for (let parent = path.posix.dirname(entry.path); parent !== "."; parent = path.posix.dirname(parent)) directories.add(parent);
	const base = serializeWorkerWorkspaceManifest({
		...params.accepted,
		entries,
		directories: [...directories].toSorted()
	});
	const baseRef = "sha256:" + createHash("sha256").update(base).digest("hex");
	if (baseRef === params.acceptedRef) return;
	const resultRef = workerWorkspaceResultRef(randomUUID());
	params.reserve(base, baseRef, resultRef);
	await workerWorkspaceResultStaging.stageWorkerWorkspaceResult({
		root: params.root,
		stagingRoot: params.projection,
		stagedResultRef: resultRef,
		baseManifestRaw: base,
		baseManifestRef: baseRef,
		currentManifestRaw: serializeWorkerWorkspaceManifest(params.accepted),
		currentManifestRef: params.acceptedRef
	});
	params.assertCurrent();
}
function localWorkspaceArchiveOperations(params) {
	const { owner, signal, current, update, capture, settle, recover, cleanupAccepted, assertDirectory: assertOwnedDirectory, deleteBinding } = params;
	return {
		restoreSnapshot: async () => {
			await recover();
			const selected = current();
			if (!selected.pending_ref) return;
			if (!selected.pending_target) {
				const receipt = await readStagedWorkerWorkspaceResult(owner.worktree.repoRoot, selected.pending_ref);
				current();
				if (receipt.currentManifestRef !== selected.baseline_ref) throw new Error("Archive restore receipt changed");
				update({
					baseline_json: serializeWorkerWorkspaceManifest(receipt.base),
					baseline_ref: receipt.baseManifestRef,
					pending_target: "canonical"
				});
			}
			await settle(true);
		},
		finishRestore: cleanupAccepted,
		prepareArchive: async (snapshotCommit) => {
			await settle();
			const accepted = await capture("canonical");
			if (accepted.manifestRef !== current().baseline_ref) throw new Error("Local workspace changed before archive capture");
			await stageLocalWorkspaceArchive({
				root: owner.worktree.repoRoot,
				projection: current().projection_path,
				snapshot: snapshotCommit,
				accepted: accepted.manifest,
				acceptedRef: accepted.manifestRef,
				signal,
				assertCurrent: () => {
					current();
				},
				reserve: (base, baseRef, resultRef) => {
					update({
						baseline_json: base,
						baseline_ref: baseRef,
						pending_ref: resultRef,
						pending_target: "canonical"
					});
				}
			});
		},
		expire: async (retireSnapshot) => {
			const selected = current();
			if (selected.journal_json || selected.pending_target && selected.pending_target !== "canonical") throw new Error("Local sandbox has pending edits; restore its worktree before cleanup");
			let accepted = selected.baseline_json && selected.baseline_ref ? {
				raw: selected.baseline_json,
				ref: selected.baseline_ref
			} : void 0;
			if (selected.pending_ref) {
				if (!retireSnapshot || owner.worktree.removedAt === void 0) throw new Error("Archive receipt still owns its restore data");
				if (selected.pending_target) {
					const receipt = await readStagedWorkerWorkspaceResult(owner.worktree.repoRoot, selected.pending_ref);
					current();
					if (receipt.baseManifestRef !== selected.baseline_ref) throw new Error("Archive retention receipt changed");
					accepted = {
						raw: serializeWorkerWorkspaceManifest(receipt.current),
						ref: receipt.currentManifestRef
					};
				}
			}
			if (accepted && (await capture("canonical")).manifestRef !== accepted.ref) throw new Error("Local sandbox has unaccepted edits; restore its worktree before cleanup");
			const { readLocalWorkspaceRuntimes } = await import("./local-workspace-quiescence-BviWY1UO.mjs");
			if ((await readLocalWorkspaceRuntimes(selected.projection_path)).length) throw new Error("Local sandbox runtime still owns its workspace; cleanup deferred");
			const parent = path.dirname(selected.projection_path);
			await assertOwnedDirectory(parent);
			current();
			await retireSnapshot?.(() => {
				current();
			});
			current();
			if (selected.pending_ref && accepted) {
				update({
					baseline_json: accepted.raw,
					baseline_ref: accepted.ref,
					pending_target: null
				});
				await cleanupAccepted();
			}
			await fs$1.rm(parent, {
				recursive: true,
				force: true
			});
			deleteBinding();
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/local-workspace-inventory.ts
function decodeGitPaths(listed) {
	if (!isUtf8(listed)) throw new Error("Local sandbox source paths must be UTF-8; rename the invalid Git path before retrying");
	return listed.toString("utf8").split("\0").filter(Boolean);
}
/** Admit untracked source once, before any guest can change canonical ignore rules. */
async function admitLocalWorkspaceSourcePaths(params) {
	const listed = await requireGitBuffer(params.root, [
		"ls-files",
		"--cached",
		"--others",
		"--exclude-standard",
		"-z"
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent
	});
	params.assertCurrent();
	return JSON.stringify([...new Set(decodeGitPaths(listed))]);
}
/** Ignore changes are source edits, not authority to enroll canonical-only bytes. */
async function selectLocalWorkspaceCanonicalPaths(params) {
	const listed = await requireGitBuffer(params.root, [
		"ls-files",
		"--cached",
		"-z"
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent
	});
	params.assertCurrent();
	const admitted = JSON.parse(params.admittedPaths);
	if (!Array.isArray(admitted) || !admitted.every((entry) => typeof entry === "string")) throw new Error("Invalid local workspace source admission");
	const paths = /* @__PURE__ */ new Set([...admitted, ...decodeGitPaths(listed)]);
	if (params.baseline) for (const entryPath of manifestNodes(params.baseline).keys()) paths.add(entryPath);
	for (const entryPath of paths) for (let parent = path.posix.dirname(entryPath); parent !== "."; parent = path.posix.dirname(parent)) paths.add(parent);
	return paths;
}
//#endregion
//#region src/gateway/worker-environments/local-workspace-projection.ts
/** Publication and lifecycle callers retain their own authority while joining local settlement. */
async function withSettledLocalWorkspace(params, operation) {
	const row = localWorkspaceStore(params.env).get(params.worktree.id);
	if (!row) return await operation();
	const worktree = params.worktree;
	const owner = {
		worktree,
		env: params.env,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		sessionId: row.session_id,
		lifecycleRevision: row.lifecycle_revision,
		assertCurrent: () => {
			params.assertCurrent?.();
			const current = getRegistryWorktree(params.env ?? process.env, worktree.id);
			if (!current || current.ownerKind !== "session" || current.ownerId !== row.session_key || current.path !== worktree.path || current.repoRoot !== worktree.repoRoot) throw new Error("Managed projection owner changed during settlement");
		}
	};
	return await withLocalWorkspaceProjection(owner, async (state, quiescence) => {
		if (params.finishRestore) await state.finishRestore();
		else if (params.restoreSnapshot) await state.restoreSnapshot();
		else if (state.current().baseline_ref) {
			await state.synchronize("canonical");
			if (params.retireRuntime) await state.synchronize("projection");
		}
		if (params.retireRuntime) await quiescence?.retire();
		owner.assertCurrent();
		return await operation(state.current().baseline_ref ? {
			prepareArchive: state.prepareArchive,
			canonicalPaths: state.canonicalPaths,
			assertCurrent: () => {
				state.current();
			}
		} : void 0);
	});
}
async function withSettledLocalWorkspacePath(params, operation) {
	const record = findLiveRegistryWorktreeByPath(process.env, params.cwd);
	return record ? await withSettledLocalWorkspace({
		worktree: record,
		assertCurrent: params.assertCurrent
	}, operation) : await operation();
}
function assertBinding(row, owner) {
	owner.assertCurrent();
	if (row.worktree_id !== owner.worktree.id || row.agent_id !== owner.agentId || row.session_key !== owner.sessionKey || row.session_id !== owner.sessionId || row.lifecycle_revision !== owner.lifecycleRevision) throw new Error("Local sandbox workspace belongs to a different session incarnation; pending edits were preserved");
}
function projectionPath(owner) {
	if (!/^[a-f0-9-]{36}$/u.test(owner.worktree.id)) throw new Error("Invalid managed worktree identity");
	return path.join(realpathSync(resolveStateDir(owner.env)), "worktree-projections", owner.worktree.id, "workspace");
}
async function assertOwnedDirectory(directory) {
	const stat = await fs$1.lstat(directory);
	if (!stat.isDirectory() || stat.isSymbolicLink() || await fs$1.realpath(directory) !== directory) throw new Error("Local sandbox workspace directory changed; preserved for recovery");
}
/** Every operation owns the same renewable, cross-process reconciliation lease. */
async function withLocalWorkspaceProjection(owner, run, options = {}) {
	return await withOpenClawStateLease({
		scope: "workspace.local-reconciliation",
		key: owner.worktree.id,
		database: {
			scope: "shared",
			options: { env: owner.env }
		},
		leaseMs: 6e4,
		waitMs: 6e5,
		leaseLabel: "local sandbox workspace",
		operationLabel: "workspace.local-reconciliation"
	}, async (lease) => {
		const assertCurrent = () => {
			lease.assertOwned();
			owner.assertCurrent();
		};
		assertCurrent();
		const store = localWorkspaceStore(owner.env);
		let previous = store.get(owner.worktree.id);
		if (previous && previous.session_id === owner.sessionId && previous.session_key === owner.sessionKey && previous.agent_id === owner.agentId && previous.lifecycle_revision !== owner.lifecycleRevision) previous = store.update(previous, { lifecycle_revision: owner.lifecycleRevision }, assertCurrent);
		const operations = projectionOperations({
			...owner,
			assertCurrent
		}, lease.signal);
		const { quiesceLocalWorkspace, parseLocalWorkspacePausedRuntimes } = await import("./local-workspace-quiescence-BviWY1UO.mjs");
		const quiescence = previous && !options.provision ? await quiesceLocalWorkspace({
			workspaceDir: previous.projection_path,
			retained: parseLocalWorkspacePausedRuntimes(previous.paused_runtimes_json),
			persist: (runtimes) => operations.rememberPaused(runtimes.length ? JSON.stringify(runtimes) : null),
			assertCurrent
		}) : void 0;
		try {
			return await run(operations, quiescence);
		} finally {
			const retained = localWorkspaceStore(owner.env).get(owner.worktree.id);
			if (retained && !retained.journal_json) await quiescence?.resume();
		}
	});
}
function projectionOperations(owner, signal) {
	const store = localWorkspaceStore(owner.env);
	let row = store.get(owner.worktree.id);
	const current = () => {
		if (!row) throw new Error("Local workspace binding is missing");
		assertBinding(row, owner);
		if (row.projection_path !== projectionPath(owner) || store.revision(row.worktree_id) !== row.revision) throw new Error("Local workspace binding changed");
		return row;
	};
	const update = (patch) => {
		row = store.update(current(), patch, () => {
			current();
		});
		return row;
	};
	const sourcePath = (target) => target === "canonical" ? current().projection_path : owner.worktree.path;
	const targetPath = (target) => target === "canonical" ? owner.worktree.path : current().projection_path;
	const canonicalPaths = async () => {
		const selected = current();
		return await selectLocalWorkspaceCanonicalPaths({
			root: owner.worktree.path,
			admittedPaths: selected.source_paths_json,
			signal,
			assertCurrent: () => {
				current();
			},
			baseline: selected.baseline_json && selected.baseline_ref ? parseWorkerWorkspaceManifest(selected.baseline_json, selected.baseline_ref) : void 0
		});
	};
	const capture = async (target) => {
		const selected = current();
		const root = sourcePath(target);
		await assertOwnedDirectory(root);
		current();
		const includePaths = target === "projection" ? await canonicalPaths() : void 0;
		const snapshot = await captureWorkspaceSnapshot({
			root,
			baseCommit: selected.base_commit,
			includePaths,
			signal
		});
		current();
		return snapshot;
	};
	const recover = async () => {
		const selected = current();
		if (!selected.journal_json) return;
		if (!selected.journal_pack || selected.pending_target !== "canonical" && selected.pending_target !== "projection") throw new Error("Local workspace recovery metadata is incomplete");
		const journal = {
			...parseWorkerWorkspaceReconciliationPlan(selected.journal_json),
			basePack: selected.journal_pack
		};
		await recoverWorkerWorkspaceReconciliation({
			root: targetPath(selected.pending_target),
			journal
		});
		update({
			journal_json: null,
			journal_pack: null
		});
	};
	const cleanupAccepted = async () => {
		const selected = current();
		if (!selected.pending_ref || selected.pending_target) return;
		await deleteStagedWorkerWorkspaceResult({
			root: owner.worktree.repoRoot,
			stagedResultRef: selected.pending_ref
		});
		update({ pending_ref: null });
	};
	const settle = async (retainAccepted = false) => {
		await recover();
		if (!retainAccepted) await cleanupAccepted();
		const selected = current();
		if (!selected.pending_ref) return;
		if (!selected.baseline_ref || !selected.baseline_json || selected.pending_target !== "canonical" && selected.pending_target !== "projection") throw new Error("Local workspace result has no accepted baseline");
		const target = selected.pending_target;
		if (!await hasWorkerWorkspaceResultRef({
			root: owner.worktree.path,
			stagedResultRef: selected.pending_ref
		})) {
			const snapshot = await capture(target);
			await workerWorkspaceResultStaging.stageWorkerWorkspaceResult({
				root: owner.worktree.path,
				stagingRoot: sourcePath(target),
				stagedResultRef: selected.pending_ref,
				baseManifestRef: selected.baseline_ref,
				currentManifestRef: snapshot.manifestRef,
				baseManifestRaw: selected.baseline_json,
				currentManifestRaw: snapshot.rawManifest
			});
			current();
		}
		let accepted;
		await withStagedWorkerWorkspaceResult({
			root: owner.worktree.path,
			stagedResultRef: selected.pending_ref
		}, async (snapshot) => {
			current();
			await applyStagedWorkerWorkspace({
				root: targetPath(target),
				stagingRoot: snapshot.stagingRoot,
				baseManifestRef: snapshot.baseManifestRef,
				currentManifestRef: snapshot.currentManifestRef,
				base: snapshot.base,
				current: snapshot.current,
				journal: {
					load: () => void 0,
					begin: (journal) => {
						update({
							journal_json: serializeWorkerWorkspaceReconciliationPlan(journal),
							journal_pack: journal.basePack
						});
					},
					abort: () => {
						update({
							journal_json: null,
							journal_pack: null
						});
					},
					commit: () => {
						if (!accepted) throw new Error("Local workspace acceptance is missing");
						try {
							update(accepted.conflictPaths.length ? {
								journal_json: null,
								journal_pack: null
							} : {
								baseline_json: serializeWorkerWorkspaceManifest(snapshot.current),
								baseline_ref: snapshot.currentManifestRef,
								pending_target: null,
								journal_json: null,
								journal_pack: null
							});
						} catch (error) {
							throw new AcceptedWorkspacePublicationIndeterminateError("commit", error, void 0);
						}
					}
				},
				acceptance: {
					kind: "reconcile",
					publish: async (value) => {
						current();
						accepted = value;
					}
				}
			});
		});
		if (current().pending_target) throw new Error("Local sandbox edits conflict with the managed workspace; pending changes were preserved. Resolve the workspace conflicts before retrying.");
		if (!retainAccepted) await cleanupAccepted();
	};
	const synchronize = async (target) => {
		await settle();
		if ((await capture(target)).manifestRef === current().baseline_ref) return;
		update({
			pending_ref: workerWorkspaceResultRef(randomUUID()),
			pending_target: target
		});
		await settle();
	};
	const prepare = async () => {
		if (!row) {
			const baseCommit = await requireGit(owner.worktree.path, [
				"rev-parse",
				"--verify",
				"HEAD^{commit}"
			], {
				signal,
				beforeRun: owner.assertCurrent
			});
			const sourcePaths = await admitLocalWorkspaceSourcePaths({
				root: owner.worktree.path,
				signal,
				assertCurrent: owner.assertCurrent
			});
			owner.assertCurrent();
			row = store.create({
				worktree_id: owner.worktree.id,
				agent_id: owner.agentId,
				session_key: owner.sessionKey,
				session_id: owner.sessionId,
				lifecycle_revision: owner.lifecycleRevision,
				projection_path: projectionPath(owner),
				base_commit: baseCommit,
				source_paths_json: sourcePaths,
				baseline_json: null,
				baseline_ref: null,
				pending_ref: null,
				pending_target: null,
				journal_json: null,
				journal_pack: null,
				paused_runtimes_json: null,
				created_at_ms: Date.now()
			}, owner.assertCurrent);
		}
		const selected = current();
		if (!selected.baseline_ref) {
			const parent = path.dirname(selected.projection_path);
			await fs$1.mkdir(parent, {
				recursive: true,
				mode: 448
			});
			await assertOwnedDirectory(parent);
			current();
			await fs$1.rm(selected.projection_path, {
				recursive: true,
				force: true
			});
			const temporary = await fs$1.mkdtemp(path.join(parent, ".prepare-"));
			try {
				const pack = await withWorktreeGitConfig(owner.worktree.path, true, {
					signal,
					beforeRun: () => {
						current();
					}
				}, (git) => git.withContentEnvironment((baseEnv) => prepareWorkerWorkspaceGitPack({
					root: owner.worktree.path,
					baseCommit: selected.base_commit,
					temporaryRoot: temporary,
					signal,
					baseEnv
				})));
				current();
				const repo = path.join(temporary, "workspace");
				await fs$1.mkdir(repo, { mode: 448 });
				const cleanEnv = {
					PATH: process.env.PATH,
					HOME: temporary,
					GIT_CONFIG_NOSYSTEM: "1",
					GIT_CONFIG_GLOBAL: os.devNull,
					GIT_CONFIG_SYSTEM: os.devNull,
					GIT_NO_REPLACE_OBJECTS: "1",
					GIT_TERMINAL_PROMPT: "0"
				};
				const git = (args, input) => requireGit(repo, args, {
					baseEnv: cleanEnv,
					env: cleanEnv,
					input,
					signal,
					beforeRun: () => {
						current();
					}
				});
				await git([
					"init",
					"--quiet",
					"--template=",
					"--object-format=" + (selected.base_commit.length === 40 ? "sha1" : "sha256")
				]);
				current();
				await runWorkspaceInventoryCommandToFile({
					argv: [
						"git",
						"-c",
						"core.hooksPath=" + os.devNull,
						"-c",
						"core.fsmonitor=false",
						"-C",
						repo,
						"index-pack",
						"--stdin"
					],
					inputPath: pack,
					outputPath: path.join(temporary, "index-pack-result"),
					baseEnv: cleanEnv,
					signal,
					timeoutMs: 3e5,
					maxOutputBytes: 4096
				});
				current();
				await fs$1.writeFile(path.join(repo, ".git", "shallow"), selected.base_commit + "\n", { mode: 384 });
				await git([
					"checkout",
					"--quiet",
					"-b",
					owner.worktree.branch,
					selected.base_commit
				]);
				const initial = await captureWorkspaceSnapshot({
					root: repo,
					baseCommit: selected.base_commit,
					signal
				});
				current();
				await fs$1.rename(repo, selected.projection_path);
				update({
					baseline_json: initial.rawManifest,
					baseline_ref: initial.manifestRef
				});
			} finally {
				await fs$1.rm(temporary, {
					recursive: true,
					force: true
				});
			}
		}
		await assertOwnedDirectory(current().projection_path);
		await synchronize("canonical");
		await synchronize("projection");
		return current().projection_path;
	};
	return {
		current,
		canonicalPaths,
		prepare,
		synchronize,
		settle,
		recover,
		...localWorkspaceArchiveOperations({
			owner,
			signal,
			current,
			update,
			capture,
			settle,
			recover,
			cleanupAccepted,
			assertDirectory: assertOwnedDirectory,
			deleteBinding: () => store.delete(current(), owner.assertCurrent)
		}),
		rememberPaused: (value) => {
			update({ paused_runtimes_json: value });
		}
	};
}
/** Expiry belongs to the existing worktree retention owner, never sandbox pruning. */
async function expireLocalWorkspaceProjection(params) {
	const row = localWorkspaceStore(params.env).get(params.worktree.id);
	if (!row) {
		await params.retireSnapshot?.(params.assertCurrent);
		return;
	}
	if (params.worktree.removedAt === void 0) throw new Error("Cannot expire a live sandbox workspace");
	await withLocalWorkspaceProjection({
		worktree: params.worktree,
		env: params.env,
		agentId: row.agent_id,
		sessionKey: row.session_key,
		sessionId: row.session_id,
		lifecycleRevision: row.lifecycle_revision,
		assertCurrent: () => {
			params.assertCurrent();
			const record = getRegistryWorktree(params.env, params.worktree.id);
			if (record?.removedAt !== params.worktree.removedAt || record?.ownerId !== row.session_key) throw new Error("Workspace retention owner changed");
		}
	}, (state) => state.expire(params.retireSnapshot));
}
/** Bind only a live session-owned managed checkout, never an arbitrary host path. */
function resolveLocalWorkspaceOwner(params) {
	const env = params.env ?? process.env;
	const scope = {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
			agentId: params.agentId,
			env
		}),
		env
	};
	const entry = loadSessionEntry(scope);
	if (!entry?.worktree?.id) return;
	const worktree = getRegistryWorktree(env, entry.worktree.id);
	if (!worktree || worktree.removedAt !== void 0 || worktree.ownerKind !== "session" || worktree.ownerId !== params.sessionKey || worktree.repoRoot !== entry.worktree.repoRoot || worktree.branch !== entry.worktree.branch || params.workspaceDir && !isPathInside(worktree.path, params.workspaceDir)) throw new Error("Local sandbox managed workspace owner changed");
	const assertCurrent = () => {
		params.assertCurrent?.();
		const now = loadSessionEntry(scope);
		const current = getRegistryWorktree(env, worktree.id);
		if (now?.sessionId !== entry.sessionId || now?.lifecycleRevision !== entry.lifecycleRevision || now?.archivedAt !== void 0 || now?.worktree?.id !== worktree.id || current?.removedAt !== void 0 || current?.ownerId !== params.sessionKey || current?.path !== worktree.path || current?.repoRoot !== worktree.repoRoot) throw new Error("Local sandbox workspace authority changed");
	};
	assertCurrent();
	return {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision ?? null,
		worktree,
		assertCurrent,
		env
	};
}
//#endregion
export { withSettledLocalWorkspacePath as a, withSettledLocalWorkspace as i, resolveLocalWorkspaceOwner as n, withLocalWorkspaceProjection as r, expireLocalWorkspaceProjection as t };
