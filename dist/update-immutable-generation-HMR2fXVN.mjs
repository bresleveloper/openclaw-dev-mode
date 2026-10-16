import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { l as syncDirectory, p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { i as readGitRuntimeArtifactIdentity, t as collectGitRuntimeErrors } from "./update-git-runtime-Cg4widap.mjs";
import { i as gitCleanCheckArgs } from "./update-runner-git-commands-q2TC5CLQ.mjs";
import { c as resolvePackageActivationAnchor, l as resolvePackageActivationControl, o as packageActivationRuntimeIdentity } from "./package-update-activation-paths-D77TjCW-.mjs";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/infra/update-immutable-generation.ts
/** Preparation and verification must inspect their selected tree, not the caller's Git context. */
function resolveImmutableGenerationEnv(env = process.env) {
	return {
		...env,
		GIT_DIR: void 0,
		GIT_WORK_TREE: void 0,
		GIT_COMMON_DIR: void 0,
		GIT_INDEX_FILE: void 0,
		GIT_OBJECT_DIRECTORY: void 0,
		GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
		GIT_NAMESPACE: void 0,
		GIT_GRAFT_FILE: void 0,
		GIT_SHALLOW_FILE: void 0,
		GIT_REPLACE_REF_BASE: void 0,
		GIT_PREFIX: void 0,
		GIT_IMPLICIT_WORK_TREE: void 0
	};
}
async function inspectGenerationTree(root, sealed) {
	if (await fs$1.realpath(root) !== path.resolve(root)) throw new Error("Immutable generation must be a physical directory.");
	const entries = [];
	const visit = async (file) => {
		const stat = await fs$1.lstat(file);
		if (stat.uid !== 0) throw new Error(`Immutable generation is not root-owned: ${file}`);
		if (stat.isSymbolicLink()) {
			if (!isPathInside(root, await fs$1.realpath(file))) throw new Error(`Immutable generation symlink escapes its release: ${file}`);
		} else {
			if (!stat.isDirectory() && !stat.isFile()) throw new Error(`Unsupported immutable generation entry: ${file}`);
			if (stat.isFile() && stat.nlink !== 1) throw new Error(`Immutable generation must not share hardlinked files: ${file}`);
			if (sealed && ((stat.mode & 146) !== 0 || (stat.mode & 292) !== 292)) throw new Error(`Immutable generation is not sealed and readable: ${file}`);
			if (sealed && stat.isDirectory() && (stat.mode & 73) !== 73) throw new Error(`Immutable generation directory is not traversable: ${file}`);
			if (stat.isDirectory()) for (const name of await fs$1.readdir(file)) await visit(path.join(file, name));
		}
		entries.push({
			file,
			stat
		});
	};
	await visit(root);
	return entries;
}
/** Seal a private, fully materialized tree; never chmod pnpm's shared store or symlink targets. */
async function sealImmutableGeneration(root) {
	const entries = await inspectGenerationTree(root, false);
	for (const { file, stat } of entries) {
		if (stat.isSymbolicLink()) continue;
		const handle = await fs$1.open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
		try {
			const current = await handle.stat();
			if (current.dev !== stat.dev || current.ino !== stat.ino || current.nlink !== stat.nlink) throw new Error(`Immutable generation changed while sealing: ${file}`);
			await handle.chmod(stat.isDirectory() ? 365 : 292 | stat.mode & 73);
			await handle.sync();
		} finally {
			await handle.close();
		}
	}
}
async function verifyPluginSdkExports(root) {
	const manifest = asNullableRecord(JSON.parse(await fs$1.readFile(path.join(root, "package.json"), "utf8")));
	const exports = asNullableRecord(manifest?.exports);
	const sdk = Object.entries(exports ?? {}).filter(([key]) => key.startsWith("./plugin-sdk/"));
	if (manifest?.name !== "openclaw" || sdk.length === 0) throw new Error("Immutable generation has no OpenClaw plugin SDK exports.");
	const verifyTarget = async (target) => {
		if (typeof target === "string") {
			const file = path.resolve(root, target);
			if (!target.startsWith("./dist/plugin-sdk/") || !isPathInside(root, file) || !(await fs$1.stat(file)).isFile()) throw new Error(`Invalid immutable plugin SDK export: ${target}`);
			return;
		}
		const conditions = asNullableRecord(target);
		if (!conditions || Object.keys(conditions).length === 0) throw new Error("Immutable generation contains an invalid plugin SDK export.");
		for (const value of Object.values(conditions)) await verifyTarget(value);
	};
	for (const [, target] of sdk) await verifyTarget(target);
}
/** Artifact facts only; this cannot authorize publication or a service restart. */
async function verifyImmutableGeneration(root, expectedSha, runCommand = runCommandWithTimeout, options = {}) {
	if (!/^[a-f0-9]{40}$/u.test(expectedSha)) throw new Error("Immutable generation requires an exact full commit SHA.");
	const sealed = options.sealed !== false;
	await inspectGenerationTree(root, sealed);
	if (sealed && !(await fs$1.lstat(path.join(root, ".git"))).isDirectory()) throw new Error("A sealed generation requires its own Git metadata directory.");
	if (sealed) {
		if ((await fs$1.readFile(path.join(root, ".git", "objects", "info", "alternates"), "utf8").catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return "";
			throw error;
		})).trim()) throw new Error("A sealed generation must not borrow another repository's Git objects.");
	}
	const commandOptions = {
		cwd: root,
		timeoutMs: 6e4,
		env: {
			...resolveImmutableGenerationEnv(),
			GIT_OPTIONAL_LOCKS: "0"
		}
	};
	const head = await runCommand([
		"git",
		"-C",
		root,
		"rev-parse",
		"HEAD"
	], commandOptions);
	if (head.code !== 0 || head.stdout.trim() !== expectedSha) throw new Error("Immutable generation Git HEAD does not match the selected SHA.");
	const clean = await runCommand(gitCleanCheckArgs(root), commandOptions);
	if (clean.code !== 0 || clean.stdout.trim()) throw new Error("Immutable generation has uncommitted source changes.");
	const errors = await collectGitRuntimeErrors({
		root,
		sha: expectedSha
	});
	if (errors.length) throw new Error(errors.join("; "));
	if (!(await fs$1.stat(path.join(root, "dist", "index.js"))).isFile()) throw new Error("Immutable generation Gateway entrypoint is missing.");
	await verifyPluginSdkExports(root);
	const artifact = await readGitRuntimeArtifactIdentity(root);
	const stat = await fs$1.lstat(root, { bigint: true });
	return {
		buildDigest: artifact.distDigest,
		identity: `${stat.dev}:${stat.ino}`
	};
}
const IMMUTABLE_V1_LAUNCHER_SHA256 = "7e3bcd5e1143c2b054ab2bd184b159143b2d2a45893fc462741b8f51780ad5d3";
function upgradeImmutableLauncher(params) {
	const normalized = params.previous.replace(/^#![^\n]*\n/u, "#!/usr/bin/env node\n");
	if (!params.previous.startsWith(`#!${params.runtime}\n`) || createHash("sha256").update(normalized).digest("hex") !== IMMUTABLE_V1_LAUNCHER_SHA256) throw new Error("An existing immutable Gateway launcher conflicts with the known v1 upgrade; it was preserved.");
	const control = resolvePackageActivationControl(resolvePackageActivationAnchor(params.root));
	const bin = path.dirname(params.launcher);
	const directories = [
		params.root,
		bin,
		control
	].map((file) => ({
		file,
		stat: fs.lstatSync(file)
	}));
	const runtimeIdentity = packageActivationRuntimeIdentity(params.runtime);
	const assertUpgrade = () => {
		params.assertCurrent();
		for (const { file, stat: previous } of directories) {
			const stat = fs.lstatSync(file);
			if (!stat.isDirectory() || stat.uid !== 0 || (stat.mode & 18) !== 0 || stat.dev !== previous.dev || stat.ino !== previous.ino || fs.realpathSync(file) !== file) throw new Error("Immutable launcher upgrade directory identity changed.");
		}
		const current = fs.lstatSync(params.launcher);
		if (!current.isFile() || current.uid !== 0 || current.nlink !== 1 || (current.mode & 18) !== 0 || current.dev !== params.previousStat.dev || current.ino !== params.previousStat.ino || fs.readFileSync(params.launcher, "utf8") !== params.previous || packageActivationRuntimeIdentity(params.runtime) !== runtimeIdentity) throw new Error("Immutable launcher changed before its v1 upgrade.");
	};
	assertUpgrade();
	const stage = fs.mkdtempSync(path.join(bin, ".launcher-upgrade-"));
	const stageIdentity = fs.lstatSync(stage);
	const backup = path.join(control, "openclaw-gateway.v1");
	const writeDurable = (file, content, mode) => {
		const fd = fs.openSync(file, "wx", mode);
		try {
			fs.writeFileSync(fd, content);
			fs.fchmodSync(fd, mode);
			fs.fsyncSync(fd);
		} finally {
			fs.closeSync(fd);
		}
	};
	try {
		const previousBackup = fs.lstatSync(backup, { throwIfNoEntry: false });
		if (previousBackup) {
			if (!previousBackup.isFile() || previousBackup.uid !== 0 || previousBackup.nlink !== 1 || (previousBackup.mode & 146) !== 0 || fs.readFileSync(backup, "utf8") !== params.previous) throw new Error("Existing immutable v1 launcher backup differs; it was preserved.");
		} else {
			const stagedBackup = path.join(stage, "previous");
			writeDurable(stagedBackup, params.previous, 292);
			assertUpgrade();
			if (fs.lstatSync(backup, { throwIfNoEntry: false })) throw new Error("Immutable v1 launcher backup appeared during upgrade.");
			fs.renameSync(stagedBackup, backup);
			requireDirectorySync(syncDirectorySync(control), "Immutable v1 launcher backup");
		}
		const candidate = path.join(stage, "next");
		writeDurable(candidate, params.content, 493);
		assertUpgrade();
		const retained = fs.lstatSync(backup);
		if (!retained.isFile() || retained.uid !== 0 || retained.nlink !== 1 || (retained.mode & 146) !== 0 || fs.readFileSync(backup, "utf8") !== params.previous) throw new Error("Immutable v1 launcher backup changed before publication.");
		fs.renameSync(candidate, params.launcher);
		requireDirectorySync(syncDirectorySync(bin), "Immutable launcher upgrade");
		params.assertCurrent();
	} finally {
		const remaining = fs.lstatSync(stage, { throwIfNoEntry: false });
		if (remaining?.dev === stageIdentity.dev && remaining.ino === stageIdentity.ino) fs.rmSync(stage, { recursive: true });
	}
}
async function installImmutableLauncher(params) {
	const root = await fs$1.realpath(params.root);
	const rootStat = await fs$1.lstat(root);
	if (!rootStat.isDirectory() || rootStat.uid !== 0 || (rootStat.mode & 18) !== 0) throw new Error("Immutable launcher installation root is not root-owned and protected.");
	const runtime = await fs$1.realpath(params.runtimePath);
	const runtimeStat = await fs$1.lstat(runtime);
	if (!runtimeStat.isFile() || runtimeStat.uid !== 0 || (runtimeStat.mode & 18) !== 0 || (runtimeStat.mode & 73) === 0 || isPathInside(root, runtime) || /\s/u.test(runtime)) throw new Error("Immutable launcher requires a root-owned external Node executable without whitespace in its path.");
	const packageRoot = await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url });
	if (!packageRoot) throw new Error("Cannot locate the packaged immutable Gateway launcher.");
	const content = (await fs$1.readFile(path.join(packageRoot, "scripts", "openclaw-immutable-launcher.mjs"), "utf8")).replace(/^#![^\n]*\n/u, `#!${runtime}\n`);
	const bin = path.join(root, "bin");
	await fs$1.mkdir(bin, { mode: 493 }).catch((error) => {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	});
	requireDirectorySync(await syncDirectory(root), "Immutable launcher installation root");
	const binStat = await fs$1.lstat(bin);
	if (!binStat.isDirectory() || binStat.uid !== 0 || (binStat.mode & 18) !== 0) throw new Error("Immutable launcher directory is not root-owned and protected.");
	const launcher = path.join(bin, "openclaw-gateway");
	const handle = await fs$1.open(launcher, "wx", 493).catch(async (error) => {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
		const existing = await fs$1.lstat(launcher);
		if (!existing.isFile() || existing.uid !== 0 || (existing.mode & 18) !== 0) throw new Error("An existing immutable Gateway launcher conflicts with this adoption; it was preserved.");
		const previous = await fs$1.readFile(launcher, "utf8");
		if (previous !== content) {
			if (!params.upgradeFromV1) throw new Error("An existing immutable Gateway launcher conflicts with this adoption; it was preserved.");
			upgradeImmutableLauncher({
				root,
				launcher,
				runtime,
				content,
				previous,
				previousStat: existing,
				assertCurrent: params.upgradeFromV1.assertCurrent
			});
		}
		return null;
	});
	if (!handle) return launcher;
	try {
		await handle.writeFile(content);
		await handle.sync();
	} finally {
		await handle.close();
	}
	requireDirectorySync(await syncDirectory(bin), "Immutable launcher directory");
	return launcher;
}
//#endregion
export { verifyImmutableGeneration as i, resolveImmutableGenerationEnv as n, sealImmutableGeneration as r, installImmutableLauncher as t };
