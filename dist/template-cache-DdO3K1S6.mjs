import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { t as isRosettaTranslatedProcess } from "./rosetta-translation-DvPrY0r4.mjs";
import { c as requireGit, h as worktreePathExists, o as listGitWorktrees, t as WORKTREE_CHECKOUT_TIMEOUT_MS } from "./git-DK_u9XbK.mjs";
import { t as nativeWorktreeFilesystem } from "./filesystem-native-C-mW-4AB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { setImmediate } from "node:timers/promises";
//#region src/agents/worktrees/filesystem-backend.ts
function assertActive(options) {
	options.signal?.throwIfAborted();
	options.commitGuard();
}
async function cloneRefsDirectory(source, destination, options, cloneFile) {
	const stats = await fs.lstat(source);
	if (!stats.isDirectory()) throw new Error(`Worktree template is not a directory: ${source}`);
	const entries = await fs.readdir(source, { withFileTypes: true });
	assertActive(options);
	await fs.mkdir(destination, { mode: 448 });
	for (const entry of entries) {
		const sourcePath = path.join(source, entry.name);
		const destinationPath = path.join(destination, entry.name);
		if (entry.isDirectory()) await cloneRefsDirectory(sourcePath, destinationPath, options, cloneFile);
		else {
			assertActive(options);
			cloneFile(sourcePath, destinationPath);
			await setImmediate();
		}
	}
	assertActive(options);
	await fs.chmod(destination, stats.mode & 511);
}
/** Probe without creating artifacts; the caller supplies an existing destination parent. */
async function detectWorktreeFilesystemBackend(parentPath, options) {
	assertActive(options);
	if (process.platform === "win32") {
		const { refsFilesystem } = await import("./filesystem-refs.native-Dch1HiPE.mjs");
		assertActive(options);
		const volume = refsFilesystem.probe(parentPath);
		if (!volume) return null;
		return {
			id: "refs",
			estimateCloneBytes: (entries, indexBytes) => 16 * 1024 ** 2 + 2 * indexBytes + entries * (8192 + volume.clusterSize),
			async createTemplate(destination, templateOptions) {
				assertActive(templateOptions);
				await fs.mkdir(destination);
			},
			async cloneTemplate(source, destination, cloneOptions) {
				await cloneRefsDirectory(source, destination, cloneOptions, (from, to) => refsFilesystem.cloneFile(from, to, volume.clusterSize));
			}
		};
	}
	const backend = await nativeWorktreeFilesystem.probe(parentPath, options);
	assertActive(options);
	if (backend !== "apfs" && backend !== "btrfs" || backend === "apfs" && isRosettaTranslatedProcess()) return null;
	const apfs = backend === "apfs" ? (await import("./filesystem-apfs.native-TWc7UrxH.mjs")).apfsFilesystem : void 0;
	assertActive(options);
	if (apfs) {
		const parentAcl = apfs.readDirectoryAcl(parentPath);
		if (parentAcl === void 0 || parentAcl === "inheritable") return null;
	}
	const assertCloneAcls = (directory, parent) => {
		if (!apfs) return;
		const acl = apfs.readDirectoryAcl(parent);
		if (acl === void 0 || acl === "inheritable" || apfs.readDirectoryAcl(directory) !== "none") throw new Error("APFS directory cloning cannot preserve directory ACLs; use Git checkout");
	};
	return {
		id: backend,
		estimateCloneBytes: (entries, indexBytes) => 16 * 1024 ** 2 + 2 * indexBytes + (backend === "apfs" ? entries * 8192 : 0),
		async createTemplate(destination, templateOptions) {
			assertActive(templateOptions);
			if (backend === "apfs") await fs.mkdir(destination);
			else await nativeWorktreeFilesystem.createSource(destination, templateOptions);
			assertActive(templateOptions);
		},
		async cloneTemplate(source, destination, cloneOptions) {
			const parent = path.dirname(destination);
			assertCloneAcls(source, parent);
			assertActive(cloneOptions);
			await nativeWorktreeFilesystem.copy(source, destination, cloneOptions);
			assertActive(cloneOptions);
			assertCloneAcls(destination, parent);
		}
	};
}
//#endregion
//#region src/agents/worktrees/template-registry-async.ts
async function runTemplateCommand(env, command, commitGuard) {
	const context = captureOpenClawStateWorkerContext({ env });
	let settled;
	try {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
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
		return result;
	} finally {
		await settled;
	}
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
function touchTemplateAsync(env, id, now, commitGuard) {
	return runTemplateCommand(env, {
		type: "worktrees.templates.touch",
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
//#endregion
//#region src/agents/worktrees/template-cache.ts
const log = createSubsystemLogger("agents/worktrees");
const WORKTREE_TEMPLATE_DIRECTORY = ".templates";
/** Allocation custody covers preparation, cloning, replacement, and collection. */
async function retireWorktreeTemplate(env, record, options) {
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.commitGuard();
	};
	assertCurrent();
	if (record.backend.startsWith("sandbox-")) {
		const { retireSandboxDependencyTemplate } = await import("./dependency-template-2nh7D5LG.mjs");
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
	else await fs.rm(record.path, {
		recursive: true,
		force: true
	});
	await deleteTemplateAsync(env, record.id, assertCurrent);
}
/** Called under the same allocation lease as checkout creation. */
async function collectWorktreeTemplates(env, before, options, onError) {
	for (const record of await listTemplatesAsync(env)) {
		if (record.status === "ready" && record.lastUsedAt >= before) continue;
		try {
			await retireWorktreeTemplate(env, record, options);
		} catch (error) {
			options.signal?.throwIfAborted();
			options.commitGuard();
			onError?.(error, record.id);
			log.warn(`worktree template cleanup failed: ${String(error)}`);
		}
	}
}
/** Source and sandbox templates share the existing reservation and retention owner. */
async function prepareWorktreeTemplate(params) {
	const assertCurrent = () => {
		params.options.signal?.throwIfAborted();
		params.options.commitGuard();
	};
	const existing = await readTemplateAsync(params.env, params.cacheKey);
	assertCurrent();
	if (existing?.status === "ready" && existing.contentKey === params.contentKey && existing.backend === params.backend && await worktreePathExists(existing.path) && await params.validate(existing)) {
		await touchTemplateAsync(params.env, existing.id, params.now(), assertCurrent);
		return existing;
	}
	if (params.reuseOnly) return;
	params.requireSpace();
	if (existing) await retireWorktreeTemplate(params.env, existing, params.options);
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
	assertCurrent();
	await fs.mkdir(directory, { recursive: true });
	await params.prepare(record);
	await markTemplateReadyAsync(params.env, id, params.now(), assertCurrent);
	return record;
}
//#endregion
export { detectWorktreeFilesystemBackend as a, hasTemplatesAsync as i, collectWorktreeTemplates as n, prepareWorktreeTemplate as r, WORKTREE_TEMPLATE_DIRECTORY as t };
