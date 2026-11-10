import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { o as sameFileMutationMetadata, r as hashFileMutationSnapshotSync } from "./file-descriptor-BWLpOgrg.mjs";
import { t as createRuntimePathLookup } from "./update-runtime-path-index-BEj-lDda.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as captureUpdateCandidatePluginCodeLink } from "./update-candidate-plugin-code-links-BYVVtSuY.mjs";
import { t as ignoreMissingUpdateCandidateFile } from "./update-candidate-files-BfBN3EpP.mjs";
import { i as relocateRuntimePath, t as prepareRuntimeRelocations } from "./update-runtime-relocation-VUX2bZ3P.mjs";
import fs, { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { assertDirectoryIdentitySync } from "@openclaw/fs-safe/advanced";
//#region src/infra/update-candidate-plugin-tasks.ts
/** Stop admissions on failure, but settle every admitted filesystem operation before cleanup. */
async function runUpdateCandidatePluginTasks(tasks) {
	const result = await runTasksWithConcurrency({
		tasks,
		limit: 4,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.results;
}
async function createUpdateCandidatePluginPool(workers) {
	const [{ WorkerTaskPool }, { resolveRuntimeProcessEntrypointUrl }] = await Promise.all([import("./worker-task-pool-CvM7d10Q.mjs"), import("./runtime-process-url-BXPNA_Cz.mjs")]);
	return new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("updateCandidateState"),
		...workers === void 0 ? { workerClass: "compute" } : { maxWorkers: workers },
		maxPendingTasks: 4,
		restartOnError: false
	});
}
//#endregion
//#region src/infra/update-candidate-plugin-tree-links.ts
function ignoreUnresolvedPluginLink(error) {
	if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ELOOP")) return;
	throw error;
}
const isUpdateCandidateHostLauncher = (file) => path.basename(path.dirname(file)) === ".bin" && [
	"openclaw",
	"openclaw.cmd",
	"openclaw.ps1"
].includes(path.basename(file));
function assertUpdateCandidatePluginEntryStat(entry, current) {
	const sameKind = entry.kind === "directory" ? current.isDirectory() : entry.kind === "file" ? current.isFile() : current.isSymbolicLink();
	const sameIdentity = current.dev.toString() === entry.dev && current.ino.toString() === entry.ino;
	const sameMode = Number(current.mode & 4095n) === entry.mode;
	if (!sameKind || !sameIdentity || !sameMode) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	if (entry.kind === "file") {
		const expected = {
			dev: BigInt(entry.dev),
			ino: BigInt(entry.ino),
			size: BigInt(entry.size),
			birthtimeNs: BigInt(entry.birthtimeNs),
			mtimeNs: BigInt(entry.mtimeNs),
			ctimeNs: BigInt(entry.ctimeNs),
			mode: BigInt(entry.mode | constants.S_IFREG),
			uid: BigInt(entry.uid),
			gid: BigInt(entry.gid)
		};
		if (!sameFileMutationMetadata(expected, current) || current.ctimeNs !== expected.ctimeNs && hashFileMutationSnapshotSync(entry.path, expected) !== entry.sha256) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	} else if (entry.kind === "symlink" && current.size !== BigInt(entry.size)) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
}
/** Rebase the admitted plan onto the caller's state directory and check its bindings still hold. */
function resolveUpdateCandidatePluginTreeTargets(plan, params, onProgress) {
	const privateRoot = resolvePathViaExistingAncestorSync$1(path.resolve(params.targetStateDir));
	const candidateRoot = resolvePathViaExistingAncestorSync$1(path.resolve(params.candidateRoot));
	if (candidateRoot !== plan.candidateRoot) throw new Error("Plugin files changed during update preparation; rerun the update");
	const rebasing = prepareRuntimeRelocations([{
		sourceRoot: plan.privateRoot,
		destinationRoot: privateRoot
	}]);
	const rebase = (file) => relocateRuntimePath(file, rebasing);
	const copies = plan.copies.map(([source, target]) => [source, rebase(target)]);
	for (const [, target] of copies) {
		const destination = resolvePathViaExistingAncestorSync$1(target);
		if (!isPathInside(privateRoot, destination)) throw new Error("Plugin copy destination escapes update state");
		for (const [other] of copies) if (isPathInside(other, destination) || isPathInside(destination, other)) throw new Error("Plugin copy source overlaps its destination");
	}
	const copyOwner = createRuntimePathLookup(copies.map((copy) => [copy[0], copy]));
	const destinationFor = (source) => {
		const owner = copyOwner(source);
		if (!owner) throw new Error("Inventoried plugin entry has no copy owner");
		return path.join(owner[1], path.relative(owner[0], source));
	};
	const assertBindings = async () => {
		await runUpdateCandidatePluginTasks([...plan.moduleBindings.map(([source, real]) => async () => {
			if (await fs$1.realpath(source) !== real) throw new Error(`Plugin module owner changed after snapshot inventory: ${source}`);
			onProgress?.();
		}), ...plan.edges.map((edge) => async () => {
			const target = path.resolve(path.dirname(edge.source), await fs$1.readlink(edge.source));
			const real = await fs$1.realpath(edge.source).catch((error) => ignoreUnresolvedPluginLink(error) ?? target);
			if (target !== edge.target || real !== edge.real) throw new Error(`Plugin link changed after snapshot inventory: ${edge.source}`);
			onProgress?.();
		})]);
	};
	return {
		privateRoot,
		candidateRoot,
		copies,
		hostLinks: new Set(plan.hostLinks.map(rebase)),
		relocations: prepareRuntimeRelocations(plan.relocations.map(({ sourceRoot, destinationRoot }) => ({
			sourceRoot,
			destinationRoot: rebase(destinationRoot)
		}))),
		aliases: plan.aliases.map(([alias, target]) => [rebase(alias), rebase(target)]),
		destinationFor,
		assertBindings
	};
}
/** Publish host links and module aliases; both must stay inside the private tree. */
async function publishUpdateCandidatePluginTreeLinks(params) {
	const { privateRoot, candidateRoot } = params;
	const publish = async (file, target, kind) => {
		const host = kind === "host link";
		const parent = path.dirname(file);
		if (!isPathInside(privateRoot, resolvePathViaExistingAncestorSync$1(parent))) throw new Error(`Plugin ${kind} escapes update state`);
		if (host) {
			params.assertBeforeMutation?.();
			await fs$1.mkdir(parent, { recursive: true });
		}
		const existing = await fs$1.lstat(file).catch(ignoreMissingUpdateCandidateFile);
		if (existing) {
			if (!(host ? existing.isSymbolicLink() && path.resolve(parent, await fs$1.readlink(file)) === target : await fs$1.realpath(file) === await fs$1.realpath(target))) throw new Error(`Plugin ${kind} conflicts with its ${host ? "update" : "private"} owner`);
		} else {
			if (!host) {
				params.assertBeforeMutation?.();
				await fs$1.mkdir(parent, { recursive: true });
			}
			params.assertBeforeMutation?.();
			await fs$1.symlink(target, file, process.platform === "win32" ? "junction" : "dir");
		}
	};
	for (const link of params.hostLinks) await publish(link, candidateRoot, "host link");
	const privateAliases = [];
	for (const [alias, target] of params.aliases) {
		await publish(alias, target, "module alias");
		privateAliases.push(alias);
	}
	return privateAliases;
}
/** Symbolic links in the private tree may only point back into it or at the update host. */
function assertUpdateCandidatePluginLinkTarget(file, target, params) {
	if (!isPathInside(params.privateRoot, target) && !(isUpdateCandidateHostLauncher(file) && isPathInside(params.candidateRoot, target))) throw new Error("Copied plugin symlink escapes update state");
}
async function verifyUpdateCandidatePluginTree(rootFile, params) {
	const readEntry = async (file) => {
		const stat = await fs$1.lstat(file, { bigint: true });
		return {
			file,
			stat,
			link: stat.isSymbolicLink() ? await fs$1.readlink(file) : void 0
		};
	};
	const verify = async ({ file, stat, link }) => {
		if (params.hostLinks.has(file)) {
			if (!stat.isSymbolicLink() || path.resolve(path.dirname(file), link) !== params.candidateRoot) throw new Error("Copied plugin host link does not target the update");
		} else if (stat.isSymbolicLink()) assertUpdateCandidatePluginLinkTarget(file, path.resolve(path.dirname(file), link), params);
		params.onProgress?.();
		if (link !== void 0) {
			params.onCodeLink?.(captureUpdateCandidatePluginCodeLink(file, stat, link));
			return;
		}
		if (stat.isDirectory()) {
			const listing = await fs$1.readdir(file, { withFileTypes: true });
			const leaves = await runUpdateCandidatePluginTasks(listing.filter((entry) => !entry.isDirectory()).map((entry) => () => readEntry(path.join(file, entry.name))));
			const observations = new Map(leaves.map((entry) => [entry.file, entry]));
			for (const entry of listing) {
				const child = path.join(file, entry.name);
				await verify(entry.isDirectory() ? await readEntry(child) : observations.get(child));
			}
		}
	};
	await verify(await readEntry(rootFile));
}
//#endregion
//#region src/infra/update-candidate-plugin-file.ts
/** Keep identical inventory, containment, and byte checks in both execution paths. */
async function copyUpdateCandidatePluginFile(request, destinationRoot) {
	const { entry, privateRoot, rootIdentity } = request;
	const assertEntry = async () => assertUpdateCandidatePluginEntryStat(entry, await fs$1.lstat(entry.path, { bigint: true }));
	await assertEntry();
	await copyUpdateCandidatePluginFileBytes(request, destinationRoot, {
		assertBeforeMutation: () => assertDirectoryIdentitySync(privateRoot, rootIdentity),
		assertAfterCopy: assertEntry
	});
}
/** Shared byte publication; each owner supplies its live authority and post-copy inspection. */
async function copyUpdateCandidatePluginFileBytes({ entry, privateRoot, destination }, destinationRoot, checks) {
	await destinationRoot.copyIn(path.relative(privateRoot, destination), entry.path, {
		overwrite: false,
		mkdir: false,
		durable: false,
		clone: "auto",
		maxBytes: entry.size,
		mode: entry.mode | 384,
		sourceHardlinks: "allow",
		assertBeforeMutation: () => {
			checks.assertBeforeMutation();
			assertUpdateCandidatePluginEntryStat(entry, fs.lstatSync(entry.path, { bigint: true }));
		}
	});
	await checks.assertAfterCopy();
	const copiedStat = await fs$1.lstat(destination, { bigint: true });
	if (hashFileMutationSnapshotSync(destination, copiedStat) !== entry.sha256) throw new Error(`Copied plugin bytes differ from snapshot inventory: ${entry.path}`);
}
/** Drain the complete file phase before the tree owner can publish links or clean up. */
async function copyUpdateCandidatePluginFiles(files, params) {
	const { privateRoot, rootIdentity, destinationRoot, destinationFor } = params;
	const pool = files.length >= 1024 ? await createUpdateCandidatePluginPool() : void 0;
	try {
		await runUpdateCandidatePluginTasks(files.map((entry) => async () => {
			const request = {
				entry,
				privateRoot,
				rootIdentity,
				destination: destinationFor(entry.path)
			};
			if (!pool) await copyUpdateCandidatePluginFile(request, destinationRoot);
			else {
				const reply = await pool.run(request, {});
				if (reply.type === "failed") throw Object.assign(reply.error, {
					...reply.code === void 0 ? {} : { code: reply.code },
					...reply.details === void 0 ? {} : { details: reply.details }
				});
			}
			params.onProgress?.();
		}));
	} finally {
		await pool?.close();
	}
}
//#endregion
export { assertUpdateCandidatePluginLinkTarget as a, publishUpdateCandidatePluginTreeLinks as c, createUpdateCandidatePluginPool as d, runUpdateCandidatePluginTasks as f, assertUpdateCandidatePluginEntryStat as i, resolveUpdateCandidatePluginTreeTargets as l, copyUpdateCandidatePluginFileBytes as n, ignoreUnresolvedPluginLink as o, copyUpdateCandidatePluginFiles as r, isUpdateCandidateHostLauncher as s, copyUpdateCandidatePluginFile as t, verifyUpdateCandidatePluginTree as u };
