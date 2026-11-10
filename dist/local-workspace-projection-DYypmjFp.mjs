import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { o as requireGit, s as requireGitBuffer } from "./git-CljZIJM8.mjs";
import { i as timeWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { a as prepareWorktreeRegistryGuard, c as readLiveRegistryWorktreeByPath, t as captureWorktreeRegistryReadGuard, u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { l as splitNullBuffer } from "./git-path-inventory-BM2twRa6.mjs";
import { l as captureWorkspaceSnapshot } from "./workspace-reconcile-fs-BUR9ZwNY.mjs";
import { c as serializeWorkerWorkspaceManifest, g as workspacePathAncestors, l as serializeWorkerWorkspaceReconciliationPlan, o as parseWorkerWorkspaceManifest, s as parseWorkerWorkspaceReconciliationPlan } from "./workspace-manifest-BR0NHoW3.mjs";
import { i as recoverWorkerWorkspaceReconciliation, n as AcceptedWorkspacePublicationIndeterminateError, t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BuXOoPIv.mjs";
import { a as hasWorkerWorkspaceResultRef, d as withStagedWorkerWorkspaceResult, f as workerWorkspaceResultRef, l as readStagedWorkerWorkspaceResult, p as workerWorkspaceResultStaging, r as deleteStagedWorkerWorkspaceResult } from "./workspace-result-staging-CYU_4-6b.mjs";
import { t as prepareLocalWorkspaceCheckout } from "./local-workspace-checkout-DgiPOUfx.mjs";
import { n as selectLocalWorkspaceCanonicalPaths, t as admitLocalWorkspaceSourcePaths } from "./local-workspace-inventory-Ck6_Q8Xx.mjs";
import { n as withLocalWorkspaceStore } from "./local-workspace-store-232cU8AI.mjs";
import { realpathSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/gateway/worker-environments/local-workspace-state.ts
function projectionPath(owner) {
	if (!/^[a-f0-9-]{36}$/u.test(owner.worktree.id)) throw new Error("Invalid managed worktree identity");
	return path.join(realpathSync(resolveStateDir(owner.env)), "worktree-projections", owner.worktree.id, "workspace");
}
async function assertOwnedDirectory(directory) {
	const stat = await fs$1.lstat(directory);
	if (!stat.isDirectory() || stat.isSymbolicLink() || await fs$1.realpath(directory) !== directory) throw new Error("Local sandbox workspace directory changed; preserved for recovery");
}
function projectionOperations(owner, store, initialRow) {
	const signal = store.signal;
	let row = initialRow;
	const selectCurrent = (assertCurrent) => {
		if (!row) throw new Error("Local workspace binding is missing");
		assertCurrent();
		if (row.worktree_id !== owner.worktree.id || row.agent_id !== owner.agentId || row.session_key !== owner.sessionKey || row.session_id !== owner.sessionId || row.lifecycle_revision !== owner.lifecycleRevision) throw new Error("Local sandbox workspace belongs to a different session incarnation; pending edits were preserved");
		if (row.projection_path !== projectionPath(owner) || store.get()?.revision !== row.revision) throw new Error("Local workspace binding changed");
		return row;
	};
	const current = () => selectCurrent(() => owner.assertCurrent());
	const assertCurrent = () => {
		current();
	};
	const workerAuthority = {
		...owner.workerAuthority,
		assertCurrent: () => {
			selectCurrent(() => owner.workerAuthority?.assertCurrent?.());
		}
	};
	const update = async (patch) => {
		row = await store.update(current(), patch, owner.workerAuthority);
	};
	const sourcePath = (target) => target === "canonical" ? current().projection_path : owner.worktree.path;
	const targetPath = (target) => target === "canonical" ? owner.worktree.path : current().projection_path;
	const canonicalPaths = async () => {
		const selected = current();
		return await selectLocalWorkspaceCanonicalPaths({
			root: owner.worktree.path,
			admittedPaths: selected.source_paths_json,
			signal,
			assertCurrent,
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
			journal,
			assertCurrent
		});
		await update({
			journal_json: null,
			journal_pack: null
		});
	};
	const cleanupAccepted = async () => {
		const selected = current();
		if (!selected.pending_ref || selected.pending_target) return;
		await deleteStagedWorkerWorkspaceResult({
			root: owner.worktree.repoRoot,
			stagedResultRef: selected.pending_ref,
			assertCurrent
		});
		await update({ pending_ref: null });
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
				currentManifestRaw: snapshot.rawManifest,
				assertCurrent
			});
			current();
		}
		let conflictPaths;
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
				assertCurrent,
				journal: {
					load: async () => void 0,
					begin: async (journal) => {
						await update({
							journal_json: serializeWorkerWorkspaceReconciliationPlan(journal),
							journal_pack: journal.basePack
						});
					},
					abort: async () => {
						await update({
							journal_json: null,
							journal_pack: null
						});
					},
					commit: async () => {
						if (!conflictPaths) throw new Error("Local workspace acceptance is missing");
						try {
							await update(conflictPaths.length ? {
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
						conflictPaths = value.conflictPaths;
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
		await update({
			pending_ref: workerWorkspaceResultRef(randomUUID()),
			pending_target: target
		});
		await settle();
	};
	const prepare = async (dependencies) => {
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
			row = await store.create({
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
			}, owner.workerAuthority);
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
				const repo = path.join(temporary, "workspace");
				const checkout = {
					source: owner.worktree.path,
					destination: repo,
					temporaryRoot: temporary,
					baseCommit: selected.base_commit,
					branch: owner.worktree.branch,
					signal,
					assertCurrent
				};
				if (!(dependencies && await (await import("./local-workspace-template-BLAbcRyB.mjs")).cloneLocalWorkspaceTemplate({
					...checkout,
					repoRoot: owner.worktree.repoRoot,
					templateRoot: path.dirname(parent),
					env: owner.env ?? process.env,
					sandbox: dependencies.sandbox,
					guard: {
						...dependencies.allocation,
						signal: dependencies.allocation.signal ? AbortSignal.any([signal, dependencies.allocation.signal]) : signal,
						commitGuard: () => {
							dependencies.allocation.commitGuard();
							current();
						}
					}
				}))) await timeWorktreePreparationPhase("checkout", () => prepareLocalWorkspaceCheckout(checkout));
				const initial = await timeWorktreePreparationPhase("snapshot", () => captureWorkspaceSnapshot({
					root: repo,
					baseCommit: selected.base_commit,
					signal
				}));
				current();
				await fs$1.rename(repo, selected.projection_path);
				await update({
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
		if (selected.baseline_ref) await timeWorktreePreparationPhase("synchronizeCanonical", () => synchronize("canonical"));
		await timeWorktreePreparationPhase("synchronizeProjection", () => synchronize("projection"));
		return current().projection_path;
	};
	return {
		current,
		workerAuthority,
		canonicalPaths,
		prepare,
		reuse: async () => row?.baseline_ref ? await prepare() : void 0,
		synchronize,
		settle,
		recover,
		restoreSnapshot: async () => {
			await recover();
			const selected = current();
			if (!selected.pending_ref) return;
			if (!selected.pending_target) {
				const receipt = await readStagedWorkerWorkspaceResult(owner.worktree.repoRoot, selected.pending_ref);
				current();
				if (receipt.currentManifestRef !== selected.baseline_ref) throw new Error("Archive restore receipt changed");
				await update({
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
			const projection = current().projection_path;
			if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(snapshotCommit)) throw new Error("Invalid archive snapshot commit");
			const listed = await requireGitBuffer(owner.worktree.repoRoot, [
				"ls-tree",
				"-r",
				"-z",
				"--name-only",
				snapshotCommit
			], {
				signal,
				beforeRun: current,
				maxOutputBytes: 67108864
			});
			current();
			const paths = new Set(splitNullBuffer(listed).map((entry) => entry.toString("hex")));
			const entries = accepted.manifest.entries.filter((entry) => paths.has(Buffer.from(entry.path).toString("hex")));
			const directories = /* @__PURE__ */ new Set();
			for (const entry of entries) for (const parent of workspacePathAncestors(entry.path)) directories.add(parent);
			const base = serializeWorkerWorkspaceManifest({
				...accepted.manifest,
				entries,
				directories: [...directories].toSorted()
			});
			const baseRef = "sha256:" + createHash("sha256").update(base).digest("hex");
			if (baseRef === accepted.manifestRef) return;
			const resultRef = workerWorkspaceResultRef(randomUUID());
			await update({
				baseline_json: base,
				baseline_ref: baseRef,
				pending_ref: resultRef,
				pending_target: "canonical"
			});
			await workerWorkspaceResultStaging.stageWorkerWorkspaceResult({
				root: owner.worktree.repoRoot,
				stagingRoot: projection,
				stagedResultRef: resultRef,
				baseManifestRaw: base,
				baseManifestRef: baseRef,
				currentManifestRaw: serializeWorkerWorkspaceManifest(accepted.manifest),
				currentManifestRef: accepted.manifestRef,
				assertCurrent
			});
			current();
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
			const { readLocalWorkspaceRuntimes } = await import("./local-workspace-quiescence-FLqrIlm1.mjs");
			if ((await readLocalWorkspaceRuntimes(selected.projection_path)).length) throw new Error("Local sandbox runtime still owns its workspace; cleanup deferred");
			const parent = path.dirname(selected.projection_path);
			await assertOwnedDirectory(parent);
			current();
			await retireSnapshot?.(assertCurrent);
			current();
			if (selected.pending_ref && accepted) {
				await update({
					baseline_json: accepted.raw,
					baseline_ref: accepted.ref,
					pending_target: null
				});
				await cleanupAccepted();
			}
			current();
			await fs$1.rm(parent, {
				recursive: true,
				force: true
			});
			await store.delete(current(), owner.workerAuthority);
		},
		rememberPaused: async (value) => {
			await update({ paused_runtimes_json: value });
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/local-workspace-projection.ts
/** Publication and lifecycle callers retain their own authority while joining local settlement. */
async function withSettledLocalWorkspace(params, operation) {
	const context = captureWorktreeRunEndContext(params.env ?? process.env);
	const env = {
		...params.env ?? process.env,
		...context.environment
	};
	return await withLocalWorkspaceStore({
		...params,
		env,
		worktreeId: params.worktree.id
	}, async (store) => {
		const row = store.get();
		if (!row) return await operation({
			assertCurrent: store.assertCurrent,
			workerAuthority: store.workerAuthority
		});
		const worktree = params.worktree;
		const workerAuthority = {
			...params.workerAuthority,
			assertCurrent: params.workerAuthority ? params.workerAuthority.assertCurrent : params.assertCurrent,
			predicates: [...params.workerAuthority?.predicates ?? [], {
				kind: "projection",
				id: worktree.id,
				ownerId: row.session_key,
				path: worktree.path,
				repoRoot: worktree.repoRoot
			}]
		};
		const assertWorktreeCurrent = await prepareWorktreeRegistryGuard(context, workerAuthority);
		const owner = {
			worktree,
			env,
			agentId: row.agent_id,
			sessionKey: row.session_key,
			sessionId: row.session_id,
			lifecycleRevision: row.lifecycle_revision,
			workerAuthority,
			assertCurrent: () => {
				params.assertCurrent?.();
				assertWorktreeCurrent();
			}
		};
		return await runLocalWorkspaceProjection(owner, store, async (state, quiescence) => {
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
				assertCurrent: state.current,
				workerAuthority: state.workerAuthority
			} : {
				assertCurrent: store.assertCurrent,
				workerAuthority: store.workerAuthority
			});
		});
	});
}
async function withSettledLocalWorkspacePath(params, operation) {
	const context = captureWorktreeRunEndContext(process.env);
	const env = {
		...process.env,
		...context.environment
	};
	const record = await readLiveRegistryWorktreeByPath(context, params.cwd);
	params.assertCurrent?.();
	return record ? await withSettledLocalWorkspace({
		worktree: record,
		env,
		assertCurrent: params.assertCurrent
	}, operation) : await operation();
}
/** Every operation owns the same renewable, cross-process reconciliation lease. */
async function withLocalWorkspaceProjection(owner, run, options = {}) {
	return await withLocalWorkspaceStore({
		...owner,
		worktreeId: owner.worktree.id,
		signal: options.signal
	}, (store) => runLocalWorkspaceProjection(owner, store, run, options));
}
async function runLocalWorkspaceProjection(owner, store, run, options = {}) {
	const assertCurrent = () => {
		store.assertCurrent();
		owner.assertCurrent();
	};
	assertCurrent();
	const workerAuthority = {
		...store.workerAuthority,
		predicates: owner.workerAuthority?.predicates ?? store.workerAuthority.predicates,
		assertCurrent: () => {
			store.workerAuthority.assertCurrent?.();
			owner.workerAuthority?.assertCurrent?.();
		}
	};
	let previous = store.get();
	if (previous && previous.session_id === owner.sessionId && previous.session_key === owner.sessionKey && previous.agent_id === owner.agentId && previous.lifecycle_revision !== owner.lifecycleRevision) previous = await store.update(previous, { lifecycle_revision: owner.lifecycleRevision }, workerAuthority);
	const operations = projectionOperations({
		...owner,
		assertCurrent,
		workerAuthority
	}, store, previous);
	const { quiesceLocalWorkspace, parseLocalWorkspacePausedRuntimes } = await import("./local-workspace-quiescence-FLqrIlm1.mjs");
	const quiescence = previous && !options.provision ? await quiesceLocalWorkspace({
		workspaceDir: previous.projection_path,
		retained: parseLocalWorkspacePausedRuntimes(previous.paused_runtimes_json),
		persist: (runtimes) => operations.rememberPaused(runtimes.length ? JSON.stringify(runtimes) : null),
		assertCurrent
	}) : void 0;
	try {
		return await run(operations, quiescence);
	} finally {
		const retained = store.get();
		if (retained && !retained.journal_json) await quiescence?.resume();
	}
}
/** Expiry belongs to the existing worktree retention owner, never sandbox pruning. */
async function expireLocalWorkspaceProjection(params) {
	const context = captureWorktreeRunEndContext(params.env);
	const env = {
		...params.env,
		...context.environment
	};
	return await withLocalWorkspaceStore({
		...params,
		env,
		worktreeId: params.worktree.id
	}, async (store) => {
		const row = store.get();
		if (!row) {
			await params.retireSnapshot?.(store.assertCurrent);
			return;
		}
		if (params.worktree.removedAt === void 0) throw new Error("Cannot expire a live sandbox workspace");
		const accept = captureWorktreeRegistryReadGuard(context, "lifecycle");
		const record = await readRegistryWorktree(context, params.worktree.id);
		const assertWorktreeCurrent = accept(record);
		params.assertCurrent();
		if (record?.removedAt !== params.worktree.removedAt || record?.ownerId !== row.session_key) throw new Error("Workspace retention owner changed");
		await runLocalWorkspaceProjection({
			worktree: params.worktree,
			env,
			agentId: row.agent_id,
			sessionKey: row.session_key,
			sessionId: row.session_id,
			lifecycleRevision: row.lifecycle_revision,
			workerAuthority: params.workerAuthority,
			assertCurrent: () => {
				params.assertCurrent();
				assertWorktreeCurrent();
			}
		}, store, (state) => state.expire(params.retireSnapshot));
	});
}
/** Bind only a live session-owned managed checkout, never an arbitrary host path. */
async function resolveLocalWorkspaceOwner(params) {
	const context = captureWorktreeRunEndContext(params.env ?? process.env);
	const env = {
		...params.env ?? process.env,
		...context.environment
	};
	const scope = {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, {
			agentId: params.agentId,
			env
		}),
		env
	};
	let active = true;
	let retained;
	let unregister = () => {};
	const release = () => {
		if (!active) return;
		active = false;
		retained?.release();
		unregister();
	};
	const assertActive = () => {
		params.assertCurrent?.();
		if (!active) throw new Error("Local sandbox workspace authority changed");
	};
	const metadata = captureSessionEntryMetadataRead(scope, assertActive);
	try {
		let databaseIdentity;
		const entry = metadata ? metadata.readCurrent() : await withSessionEntryReadOnlyInWorker(scope, assertActive, async (read) => {
			if (!read.ok) throw read.error;
			const preparedEntry = read.value;
			if (databaseIdentity && preparedEntry) retained = retainPreparedSessionEntryPredicate({
				databaseIdentity,
				sessionKey: scope.sessionKey,
				entry: preparedEntry,
				matches: (before, after) => after !== void 0 && before?.sessionId === after.sessionId && before?.lifecycleRevision === after.lifecycleRevision && after.archivedAt === void 0 && before?.worktree?.id === after.worktree?.id
			});
			return preparedEntry;
		}, (database, identity) => {
			databaseIdentity = identity.key;
			unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: database.agentId,
				path: database.path,
				revoke: release,
				close: async () => release()
			});
		});
		if (!entry?.worktree?.id) {
			release();
			return;
		}
		const accept = captureWorktreeRegistryReadGuard(context, "lifecycle");
		const worktree = await readRegistryWorktree(context, entry.worktree.id);
		const assertWorktreeCurrent = accept(worktree);
		if (!worktree || worktree.removedAt !== void 0 || worktree.ownerKind !== "session" || worktree.ownerId !== params.sessionKey || worktree.repoRoot !== entry.worktree.repoRoot || worktree.branch !== entry.worktree.branch || params.workspaceDir && !isPathInside(worktree.path, params.workspaceDir)) throw new Error("Local sandbox managed workspace owner changed");
		const assertSessionCurrent = () => {
			assertActive();
			if (!metadata) {
				if (!retained?.isCurrent()) throw new Error("Local sandbox workspace authority changed");
				return;
			}
			const now = metadata.readCurrent();
			if (now?.sessionId !== entry.sessionId || now?.lifecycleRevision !== entry.lifecycleRevision || now?.archivedAt !== void 0 || now?.worktree?.id !== worktree.id) throw new Error("Local sandbox workspace authority changed");
		};
		const assertCurrent = () => {
			assertSessionCurrent();
			assertWorktreeCurrent();
		};
		assertCurrent();
		return {
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: entry.sessionId,
			lifecycleRevision: entry.lifecycleRevision ?? null,
			worktree,
			assertCurrent,
			workerAuthority: {
				assertCurrent: assertSessionCurrent,
				predicates: [{
					kind: "live-binding",
					record: worktree
				}]
			},
			env,
			[Symbol.dispose]: release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { withSettledLocalWorkspacePath as a, withSettledLocalWorkspace as i, resolveLocalWorkspaceOwner as n, withLocalWorkspaceProjection as r, expireLocalWorkspaceProjection as t };
