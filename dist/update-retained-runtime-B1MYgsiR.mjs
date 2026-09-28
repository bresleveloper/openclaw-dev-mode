import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as removeTemporaryArtifacts } from "./temp-artifact-cleanup-D_2UpyuT.mjs";
import { n as withRuntimeWorkerGeneration } from "./runtime-worker-generation-Bj2WcDkG.mjs";
import { n as withUpdateCandidateIoBudget } from "./update-candidate-io-Dx8FiSJf.mjs";
import { i as relocateRuntimePath, n as relocateRuntimeEntry } from "./update-runtime-relocation-YSSIn7u2.mjs";
import { a as assertUpdateCandidatePluginEntryStat, c as resolveUpdateCandidatePluginTreeTargets, i as prepareUpdateCandidatePluginTrees, l as verifyUpdateCandidatePluginTree, o as assertUpdateCandidatePluginLinkTarget, s as publishUpdateCandidatePluginTreeLinks } from "./update-candidate-plugin-tree-BIliVjO7.mjs";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
//#region src/infra/update-retained-runtime-tree.ts
const isRelocatedFile = (file) => path.basename(file) === ".modules.yaml" || path.basename(path.dirname(file)) === ".bin" && !file.endsWith(".exe");
const isLinkUnsupported = (error) => [
	"EXDEV",
	"EPERM",
	"EACCES",
	"ENOTSUP",
	"EOPNOTSUPP",
	"EMLINK",
	"ENOSYS"
].some((code) => hasNodeErrorCode(error, code));
/**
* Retain the admitted tree by hard-linking its files into the private directory.
*
* Retention only needs the inventoried inodes to outlive the installer's rename or
* unlink, so files share their inode with the source and bytes are copied only when
* the filesystem refuses the link or the member must be rewritten for relocation.
* One walk performs the inventory check, publication, relocation, and escape check
* for every entry.
*/
async function linkUpdateCandidatePluginTrees(plan, params) {
	const targets = resolveUpdateCandidatePluginTreeTargets(plan, params);
	const { privateRoot, candidateRoot, hostLinks, relocations, destinationFor } = targets;
	const linkedInodes = /* @__PURE__ */ new Set();
	const assertEntry = async (entry) => {
		await params.onProgress?.();
		const current = await fs$1.lstat(entry.path, { bigint: true });
		const expected = entry.kind === "file" && linkedInodes.has(`${entry.dev}:${entry.ino}`) ? {
			...entry,
			ctimeNs: current.ctimeNs.toString()
		} : entry;
		assertUpdateCandidatePluginEntryStat(expected, current);
		if (entry.kind === "symlink" && await fs$1.readlink(entry.path) !== entry.link) throw new Error(`Plugin entry changed after snapshot inventory: ${entry.path}`);
	};
	await targets.assertBindings();
	await fs$1.mkdir(privateRoot, {
		recursive: true,
		mode: 448
	});
	let destinationRoot;
	const copyEntry = async (entry, destination) => {
		destinationRoot ??= await root(privateRoot);
		await destinationRoot.copyIn(path.relative(privateRoot, destination), entry.path, {
			overwrite: false,
			maxBytes: entry.size,
			mode: entry.mode | 384,
			sourceHardlinks: "allow",
			assertBeforeMutation: () => assertUpdateCandidatePluginEntryStat(entry, fs.lstatSync(entry.path, { bigint: true }))
		});
		await assertEntry(entry);
		await relocateRuntimeEntry(destination, entry.path, destination, "file", relocations);
		if ((entry.mode & 384) !== 384) await fs$1.chmod(destination, entry.mode);
	};
	const counts = {
		linked: 0,
		copied: 0
	};
	const directories = [];
	for (const entry of plan.entries) {
		await assertEntry(entry);
		const destination = destinationFor(entry.path);
		if (entry.kind === "directory") {
			await fs$1.mkdir(destination, {
				recursive: true,
				mode: entry.mode | 448
			});
			directories.push(entry);
			continue;
		}
		await fs$1.mkdir(path.dirname(destination), {
			recursive: true,
			mode: 448
		});
		if (entry.kind === "symlink") {
			await fs$1.symlink(entry.link, destination, entry.linkType);
			await relocateRuntimeEntry(destination, entry.path, destination, "symlink", relocations);
			assertUpdateCandidatePluginLinkTarget(destination, path.resolve(path.dirname(destination), await fs$1.readlink(destination)), {
				privateRoot,
				candidateRoot
			});
			continue;
		}
		if (isRelocatedFile(destination)) {
			await copyEntry(entry, destination);
			counts.copied += 1;
			continue;
		}
		try {
			await fs$1.link(entry.path, destination);
		} catch (error) {
			if (!isLinkUnsupported(error)) throw error;
			await copyEntry(entry, destination);
			counts.copied += 1;
			continue;
		}
		linkedInodes.add(`${entry.dev}:${entry.ino}`);
		const linked = await fs$1.lstat(destination, { bigint: true });
		if (!linked.isFile() || linked.dev.toString() !== entry.dev || linked.ino.toString() !== entry.ino) throw new Error(`Retained runtime entry does not reference its inventoried file: ${entry.path}`);
		counts.linked += 1;
	}
	await targets.assertBindings();
	const privateAliases = await publishUpdateCandidatePluginTreeLinks({
		privateRoot,
		candidateRoot,
		hostLinks,
		aliases: targets.aliases
	});
	for (const alias of privateAliases) await verifyUpdateCandidatePluginTree(alias, {
		privateRoot,
		candidateRoot,
		hostLinks
	});
	for (const entry of directories.toSorted((left, right) => right.path.length - left.path.length)) await fs$1.chmod(destinationFor(entry.path), entry.mode);
	return counts;
}
//#endregion
//#region src/infra/update-retained-runtime.ts
/** The command retains its own workers through reporting, rollback, and native settlement. */
async function withRetainedUpdateRuntime(moduleUrl, operation) {
	let directory;
	let prepared = false;
	return await withRuntimeWorkerGeneration(async (bind) => await operation(async ({ mutationRoots, timeoutMs, assertCurrent }) => {
		assertCurrent();
		if (prepared) return;
		const root = await resolveOpenClawPackageRoot({ moduleUrl });
		if (!root) throw new Error("Cannot retain the running updater's package root");
		const sourceRoot = await fs$1.realpath(root);
		assertCurrent();
		if (!mutationRoots.some((entry) => {
			const mutation = resolvePathViaExistingAncestorSync(path.resolve(entry));
			return isPathInside(mutation, sourceRoot) || isPathInside(sourceRoot, mutation);
		})) return;
		directory = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-runtime-"));
		const privateRoot = await fs$1.realpath(directory);
		const project = (source) => {
			const base = path.parse(source).root;
			return path.join(privateRoot, "tree", Buffer.from(base).toString("hex"), path.relative(base, source));
		};
		const candidateRoot = project(sourceRoot);
		const roots = /* @__PURE__ */ new Map();
		for (const name of [
			"package.json",
			"dist",
			"node_modules"
		]) {
			const entry = path.join(sourceRoot, name);
			const present = await fs$1.lstat(entry).catch((error) => {
				if (hasErrnoCode(error, "ENOENT")) return;
				throw error;
			});
			assertCurrent();
			if (present) roots.set(entry, project(entry));
		}
		const plan = await prepareUpdateCandidatePluginTrees({
			roots,
			project,
			targetStateDir: privateRoot,
			candidateRoot,
			retainedHostRoot: sourceRoot,
			onProgress: assertCurrent
		});
		await withUpdateCandidateIoBudget({
			directory: privateRoot,
			bytes: plan.bytes,
			timeoutMs
		}, async (signal) => await linkUpdateCandidatePluginTrees(plan, {
			targetStateDir: privateRoot,
			candidateRoot,
			onProgress: () => {
				signal.throwIfAborted();
				assertCurrent();
			}
		}));
		assertCurrent();
		const relocations = [...plan.relocations, ...root === sourceRoot ? [] : [{
			sourceRoot: root,
			destinationRoot: candidateRoot
		}]].map((entry) => Object.freeze({ ...entry }));
		const resolve = (url) => pathToFileURL(relocateRuntimePath(fileURLToPath(url), relocations));
		bind(resolve);
		prepared = true;
	}), async () => {
		if (directory) await removeTemporaryArtifacts(directory, "Updater runtime");
	}, () => directory);
}
//#endregion
export { withRetainedUpdateRuntime };
