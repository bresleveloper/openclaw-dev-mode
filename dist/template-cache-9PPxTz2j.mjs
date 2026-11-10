import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { _ as readGatewayLockProcessNamespace } from "./gateway-state-owner-record-DMIM5DCR.mjs";
import { s as hasWorktreeUnknownOutcome } from "./errors-WYf-uyBk.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as listGitWorktrees, o as requireGit, p as worktreePathExists, t as WORKTREE_CHECKOUT_TIMEOUT_MS } from "./git-CljZIJM8.mjs";
import { a as withWorktreeMutationLease, n as startWorktreeWait } from "./allocation-qJnLlg7h.mjs";
import { n as setWorktreePreparationTemplate, r as startWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { t as nativeWorktreeFilesystem } from "./filesystem-native-DBf2aPxS.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import { hostname } from "node:os";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/agents/worktrees/filesystem-backend.ts
function assertActive(options) {
	options.signal?.throwIfAborted();
	options.commitGuard();
}
async function cloneRefsDirectory(source, destination, options, openRoot) {
	const stats = await fs$1.lstat(source);
	if (!stats.isDirectory()) throw new Error(`Worktree template is not a directory: ${source}`);
	const entries = await fs$1.readdir(source, { withFileTypes: true });
	assertActive(options);
	await fs$1.mkdir(destination, { mode: 448 });
	const destinationRoot = await openRoot(destination);
	for (const entry of entries) {
		const sourcePath = path.join(source, entry.name);
		const destinationPath = path.join(destination, entry.name);
		if (entry.isDirectory()) await cloneRefsDirectory(sourcePath, destinationPath, options, openRoot);
		else {
			assertActive(options);
			await destinationRoot.copyIn(entry.name, sourcePath, {
				clone: "always",
				overwrite: false,
				mkdir: false,
				durable: false,
				maxBytes: Infinity,
				preserveSourceMode: true,
				preserveMetadata: true,
				sourceSymlinks: "copy-link",
				sourceHardlinks: "allow",
				mutationSymlinks: "reject",
				signal: options.signal,
				assertBeforeMutation: () => assertActive(options)
			});
			assertActive(options);
			await setImmediate();
		}
	}
	assertActive(options);
	await fs$1.chmod(destination, stats.mode & 511);
}
/** Probe without creating artifacts; the caller supplies an existing destination parent. */
async function detectWorktreeFilesystemBackend(parentPath, options) {
	assertActive(options);
	setWorktreePreparationTemplate("unavailable", { reason: "filesystem-probe" });
	const backend = await nativeWorktreeFilesystem.probe(parentPath, options);
	assertActive(options);
	if (process.platform === "win32") {
		if (backend !== "refs") return null;
		const clusterSize = fs.statfsSync(parentPath).bsize;
		return {
			id: "refs",
			estimateCloneBytes: (entries, indexBytes) => 16 * 1024 ** 2 + 2 * indexBytes + entries * (8192 + clusterSize),
			async createTemplate(destination, templateOptions) {
				assertActive(templateOptions);
				await fs$1.mkdir(destination);
			},
			async cloneTemplate(source, destination, cloneOptions) {
				const { root } = await import("@openclaw/fs-safe/root");
				await cloneRefsDirectory(source, destination, cloneOptions, root);
			}
		};
	}
	if (backend !== "apfs" && backend !== "btrfs") return null;
	const apfs = backend === "apfs" ? (await import("./filesystem-apfs.native-D9soAiTP.mjs")).apfsFilesystem : void 0;
	assertActive(options);
	if (apfs) {
		const parentAcl = await apfs.readDirectoryAcl(parentPath, options);
		assertActive(options);
		if (parentAcl === void 0 || parentAcl === "inheritable") {
			setWorktreePreparationTemplate("unavailable", { reason: "parent-acl" });
			return null;
		}
	}
	const assertCloneAcls = async (directory, parent, aclOptions) => {
		if (!apfs) return;
		const acl = await apfs.readDirectoryAcl(parent, aclOptions);
		if (acl === void 0 || acl === "inheritable" || await apfs.readDirectoryAcl(directory, aclOptions) !== "none") throw new Error("APFS directory cloning cannot preserve directory ACLs; use Git checkout");
	};
	return {
		id: backend,
		estimateCloneBytes: (entries, indexBytes) => 16 * 1024 ** 2 + 2 * indexBytes + (backend === "apfs" ? entries * 8192 : 0),
		async createTemplate(destination, templateOptions) {
			assertActive(templateOptions);
			if (backend === "apfs") await fs$1.mkdir(destination);
			else await nativeWorktreeFilesystem.createSource(destination, templateOptions);
			assertActive(templateOptions);
		},
		async cloneTemplate(source, destination, cloneOptions) {
			const parent = path.dirname(destination);
			await assertCloneAcls(source, parent, cloneOptions);
			assertActive(cloneOptions);
			await nativeWorktreeFilesystem.copy(source, destination, cloneOptions);
			assertActive(cloneOptions);
			await assertCloneAcls(destination, parent, cloneOptions);
		}
	};
}
//#endregion
//#region src/agents/worktrees/template-registry-async.ts
async function runTemplateCommand(env, command, commitGuard) {
	const context = captureOpenClawStateWorkerContext({ env });
	let settled;
	let outcome;
	try {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), {
			assertCurrent: commitGuard,
			createAdmission: (operation) => {
				settled = operation.settled;
				return {
					nativeLocations: [context.admission.databasePath],
					admission: createSqliteWorkerOperationAdmission((_request, grant) => {
						context.admission.assertCurrent();
						commitGuard?.();
						grant();
					})
				};
			}
		});
		context.admission.assertCurrent();
		commitGuard?.();
		outcome = { value: result };
	} catch (error) {
		outcome = { error };
	}
	const settlement = await settled;
	if (settlement?.kind === "unknown") {
		const error = new SqliteWorkerError("Worktree template native state outcome is unknown", "outcome-unknown");
		error.cause = "error" in outcome ? new AggregateError([outcome.error, settlement.error], "Template result delivery and native settlement failed") : settlement.error;
		throw error;
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readTemplateAsync(env, cacheKey, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.read",
		input: { cacheKey }
	}, commitGuard);
}
function hasTemplatesAsync(env, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.has",
		input: void 0
	}, commitGuard);
}
function listTemplatesAsync(env, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.list",
		input: void 0
	}, commitGuard);
}
function reserveTemplateAsync(env, record, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.reserve",
		input: record
	}, commitGuard);
}
function markTemplateReadyAsync(env, id, now, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.ready",
		input: {
			id,
			now
		}
	}, commitGuard);
}
function deleteTemplateAsync(env, id, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.delete",
		input: { id }
	}, commitGuard);
}
function retainTemplateReaderAsync(env, input, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.retainReader",
		input
	}, commitGuard);
}
function releaseTemplateReaderAsync(env, key, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.releaseReader",
		input: { key }
	}, commitGuard);
}
function hasTemplateReadersAsync(env, id, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.hasReaders",
		input: { id }
	}, commitGuard);
}
//#endregion
//#region src/agents/worktrees/template-cache.ts
const log = createSubsystemLogger("agents/worktrees");
const WORKTREE_TEMPLATE_DIRECTORY = ".templates";
const pendingPreparations = /* @__PURE__ */ new Map();
async function retainWorktreeTemplate(env, selection, assertCurrent, unpublish) {
	const context = captureOpenClawStateWorkerContext({ env });
	const key = randomUUID();
	const owner = {
		pid: process.pid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(process.pid, env),
		processNamespace: readGatewayLockProcessNamespace()
	};
	const release = async (outcome) => {
		if (!hasWorktreeUnknownOutcome(outcome)) try {
			await releaseTemplateReaderAsync(env, key, () => context.admission.assertCurrent());
		} catch (cleanupError) {
			if (outcome !== void 0) throw new AggregateError([outcome, cleanupError], "Worktree template operation and reader release failed", { cause: cleanupError });
			throw cleanupError;
		}
	};
	try {
		const record = await retainTemplateReaderAsync(env, {
			key,
			owner,
			..."id" in selection ? {
				id: selection.id,
				unpublish
			} : { selection }
		}, assertCurrent);
		return record ? {
			...record,
			release
		} : void 0;
	} catch (error) {
		await release(error);
		throw error;
	}
}
/** The cache key lease and retained readers jointly own template retirement. */
async function retireWorktreeTemplate(env, record, options) {
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.commitGuard();
	};
	const retained = await retainWorktreeTemplate(env, record, assertCurrent, true);
	if (!retained) return false;
	let outcome;
	try {
		assertCurrent();
		if (record.backend.startsWith("sandbox-")) {
			const { retireSandboxDependencyTemplate } = await import("./dependency-template-u0atGXww.mjs");
			await retireSandboxDependencyTemplate(record.path, assertCurrent);
		}
		const registered = await worktreePathExists(record.repoRoot) && await worktreePathExists(record.commonDir) && (await listGitWorktrees(record.repoRoot, {
			signal: options.signal,
			beforeRun: assertCurrent
		})).some((entry) => path.resolve(entry.path) === record.path);
		assertCurrent();
		if (registered) await requireGit(record.repoRoot, [
			"worktree",
			"remove",
			"--force",
			record.path
		], {
			signal: options.signal,
			beforeRun: assertCurrent,
			killProcessTree: true,
			timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS
		});
		else await fs$1.rm(record.path, {
			recursive: true,
			force: true
		});
		await deleteTemplateAsync(env, record.id, assertCurrent);
		return true;
	} catch (error) {
		outcome = error;
		throw error;
	} finally {
		await retained.release(outcome);
	}
}
/** Collection rechecks each generation after acquiring its template custody. */
async function collectWorktreeTemplates(env, before, options, onError) {
	for (const record of await listTemplatesAsync(env)) {
		if (record.status === "ready" && record.lastUsedAt >= before) continue;
		try {
			await withWorktreeMutationLease({
				env,
				...options,
				id: `template:${record.cacheKey}`
			}, async (guard) => {
				const current = await readTemplateAsync(env, record.cacheKey, guard.commitGuard);
				if (!current || current.id !== record.id || current.status === "ready" && current.lastUsedAt >= before || await hasTemplateReadersAsync(env, current.id, guard.commitGuard)) return;
				await retireWorktreeTemplate(env, current, guard);
			});
		} catch (error) {
			options.signal?.throwIfAborted();
			options.commitGuard();
			onError?.(error, record.id);
			log.warn(`worktree template cleanup failed: ${String(error)}`);
		}
	}
}
/** Source and sandbox templates share persisted build and reader custody. */
async function prepareWorktreeTemplate(params) {
	let retained;
	let preparationKey;
	let finishPreparation;
	try {
		const assertCallerCurrent = () => {
			params.options.signal?.throwIfAborted();
			params.options.commitGuard();
		};
		while (true) {
			retained = await retainWorktreeTemplate(params.env, {
				cacheKey: params.cacheKey,
				contentKey: params.contentKey,
				backend: params.backend
			}, assertCallerCurrent);
			if (retained) {
				setWorktreePreparationTemplate("warm", { reason: "ready" });
				return retained;
			}
			preparationKey ??= JSON.stringify([captureOpenClawStateWorkerContext({ env: params.env }).admission.coordinationKey, params.cacheKey]);
			const pending = pendingPreparations.get(preparationKey);
			if (!pending) {
				pendingPreparations.set(preparationKey, new Promise((resolve) => {
					finishPreparation = resolve;
				}));
				break;
			}
			const waiting = startWorktreeWait(params.options.waitBudget);
			const finishWait = startWorktreePreparationPhase("mutationWait");
			const deadline = AbortSignal.timeout(waiting.waitMs);
			try {
				await racePromiseWithAbortSignal(pending, params.options.signal ? AbortSignal.any([params.options.signal, deadline]) : deadline);
				assertCallerCurrent();
			} catch (error) {
				assertCallerCurrent();
				if (deadline.aborted) {
					const timeout = new OpenClawStateLeaseError("managed worktree template preparation wait expired", {
						code: "OPENCLAW_STATE_LEASE_HELD",
						cause: error
					});
					waiting.end(timeout);
					throw timeout;
				}
				throw error;
			} finally {
				waiting.end();
				finishWait();
			}
		}
		return await withWorktreeMutationLease({
			env: params.env,
			...params.options,
			id: `template:${params.cacheKey}`
		}, async (options) => {
			const assertCurrent = options.commitGuard;
			const existing = await readTemplateAsync(params.env, params.cacheKey);
			assertCurrent();
			const hasReaders = existing ? await hasTemplateReadersAsync(params.env, existing.id, assertCurrent) : false;
			if (existing?.status === "ready" && existing.contentKey === params.contentKey && existing.backend === params.backend) {
				retained = await retainWorktreeTemplate(params.env, existing, assertCurrent, hasReaders ? void 0 : true);
				if (!retained) return;
				if (hasReaders || await worktreePathExists(existing.path) && await params.validate(existing, options)) {
					setWorktreePreparationTemplate("warm", { reason: "ready" });
					if (!hasReaders) await markTemplateReadyAsync(params.env, existing.id, params.now(), assertCurrent);
					return retained;
				}
				await retained.release();
				retained = void 0;
			}
			if (params.reuseOnly || hasReaders) {
				setWorktreePreparationTemplate("unavailable", { reason: hasReaders ? existing?.status === "preparing" ? "template-building" : "stale-template-in-use" : existing ? "template-stale" : "template-missing" });
				return;
			}
			setWorktreePreparationTemplate("cold", { reason: "template-disk-admission" });
			await params.requireSpace();
			if (existing && !await retireWorktreeTemplate(params.env, existing, options)) return;
			const id = randomUUID();
			const directory = path.join(params.worktreeRoot, WORKTREE_TEMPLATE_DIRECTORY);
			const record = {
				cacheKey: params.cacheKey,
				id,
				repoRoot: params.repoRoot,
				commonDir: params.commonDir,
				worktreeRoot: params.worktreeRoot,
				path: path.join(directory, id),
				backend: params.backend,
				sourceCommit: params.sourceCommit,
				contentKey: params.contentKey,
				status: "preparing",
				createdAt: params.now(),
				lastUsedAt: params.now()
			};
			await reserveTemplateAsync(params.env, record, assertCurrent);
			retained = await retainWorktreeTemplate(params.env, record, assertCurrent);
			if (!retained) throw new Error("Worktree template builder lost its reader custody");
			assertCurrent();
			await fs$1.mkdir(directory, { recursive: true });
			setWorktreePreparationTemplate("cold", { reason: "template-build" });
			await params.prepare(record, options);
			await markTemplateReadyAsync(params.env, id, params.now(), assertCurrent);
			setWorktreePreparationTemplate("cold", { reason: "ready" });
			return {
				...retained,
				status: "ready"
			};
		});
	} catch (error) {
		await retained?.release(error);
		if (params.options.signal?.aborted && !(error instanceof OpenClawStateLeaseError) && !hasWorktreeUnknownOutcome(error)) throw new OpenClawStateLeaseError("managed worktree template operation was aborted", {
			code: "OPENCLAW_STATE_LEASE_ABORTED",
			cause: error
		});
		throw error;
	} finally {
		if (finishPreparation && preparationKey) {
			pendingPreparations.delete(preparationKey);
			finishPreparation();
		}
	}
}
//#endregion
export { detectWorktreeFilesystemBackend as a, hasTemplatesAsync as i, collectWorktreeTemplates as n, prepareWorktreeTemplate as r, WORKTREE_TEMPLATE_DIRECTORY as t };
