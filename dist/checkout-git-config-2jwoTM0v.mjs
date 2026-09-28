import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { c as normalizeGitPathForFilesystem, s as gitNullConfigPath, u as requireGitCommandOutput } from "./git-exec-B6ZpVpQV.mjs";
import { c as requireGit, d as runGit, f as runGitBuffered, i as gitEnvironment, n as commandError, p as runGitBytes } from "./git-DSwuA7YL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/agents/worktrees/checkout-git-config.ts
const native = {
	sourceOnly: false,
	run: runGit,
	require: requireGit,
	worker: {
		text: runGitBytes,
		buffered: runGitBuffered
	},
	withContentEnvironment: async (run) => await run(gitEnvironment())
};
const sharedDirectories = [
	"objects",
	"refs",
	"logs",
	"worktrees",
	"reftable"
];
const sharedFiles = [
	"packed-refs",
	"shallow",
	"info/exclude"
];
/** Only content operations borrow this view. Ref authority remains with the real repository. */
function usesCanonicalMetadata(args) {
	let i = 0;
	while (args[i] === "-c") i += 2;
	return [
		"rev-parse",
		"show-ref",
		"update-ref",
		"branch",
		"fetch",
		"worktree"
	].includes(args[i] ?? "") && !(args[i] === "worktree" && args[i + 1] === "remove" && !args.includes("--force") && !args.includes("-f"));
}
/**
* Git reads repository config from GIT_COMMON_DIR, and config.worktree only when
* that config enables extensions.worktreeConfig (Git config.c). Keep the actual
* Git dir/index/HEAD and shared object/ref storage; substitute only trusted config
* for this operation. No repository or operator config is changed or locked.
*/
async function withWorktreeGitConfig(cwd, sourceOnly, guard, run) {
	if (!sourceOnly) return await run(native);
	const check = () => {
		guard.signal?.throwIfAborted();
		guard.beforeRun?.();
	};
	check();
	const common = path.resolve(cwd, normalizeGitPathForFilesystem(await requireGit(cwd, ["rev-parse", "--git-common-dir"], guard)));
	const head = await requireGit(cwd, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], guard);
	if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(head)) throw new Error("Unsupported Git object format");
	const format = head.length === 64 ? "sha256" : "sha1";
	const storage = await runGit(cwd, [
		"config",
		"--local",
		"--get",
		"extensions.refStorage"
	], guard);
	if (storage.code !== 0 && storage.code !== 1) throw commandError("git config refStorage", storage);
	const refStorage = storage.code === 1 ? "files" : storage.stdout.trim();
	if (refStorage !== "files" && refStorage !== "reftable") throw new Error("Unsupported Git ref storage");
	const settings = await runGit(cwd, [
		"config",
		"--includes",
		"--null",
		"--get-regexp",
		"^core\\.(symlinks|ignorecase|precomposeunicode|excludesfile)$"
	], guard);
	if (settings.code !== 0 && settings.code !== 1) throw commandError("git config layout", settings);
	const layout = /* @__PURE__ */ new Map();
	for (const field of settings.stdout.split("\0").filter(Boolean)) {
		const separator = field.indexOf("\n");
		layout.set(separator < 0 ? field : field.slice(0, separator), separator < 0 ? "true" : field.slice(separator + 1));
	}
	check();
	const directory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-git-config-"));
	let active = true;
	const pending = /* @__PURE__ */ new Set();
	const assertActive = () => {
		check();
		if (!active) throw new Error("Git configuration scope closed");
	};
	const prepareMetadata = async (target) => {
		for (const name of sharedDirectories) {
			assertActive();
			const source = path.join(common, name);
			if (process.platform === "win32" && !await fs.stat(source).catch(() => void 0)) continue;
			await fs.symlink(source, path.join(target, name), process.platform === "win32" ? "junction" : "dir");
		}
		await fs.mkdir(path.join(target, "info"));
		for (const name of sharedFiles) {
			assertActive();
			const source = path.join(common, name);
			const destination = path.join(target, name);
			if (process.platform === "win32") await fs.copyFile(source, destination).catch((error) => {
				if (!hasNodeErrorCode(error, "ENOENT")) throw error;
			});
			else await fs.symlink(source, destination, "file");
		}
	};
	try {
		await prepareMetadata(directory);
		await fs.writeFile(path.join(directory, "config"), `[core]\nrepositoryformatversion=${format === "sha256" || refStorage === "reftable" ? 1 : 0}\nbare=false\nsymlinks=${process.platform !== "win32"}\n[extensions]\n${format === "sha256" ? "objectFormat=sha256\n" : ""}${refStorage === "reftable" ? "refStorage=reftable\n" : ""}`);
		for (const [key, value] of layout) await requireGit(cwd, [
			"config",
			"--file",
			path.join(directory, "config"),
			key,
			value
		], guard);
		const optionsFor = async (args, options) => {
			assertActive();
			const guarded = {
				...options,
				beforeRun: () => {
					assertActive();
					options.beforeRun?.();
				}
			};
			if (usesCanonicalMetadata(args)) return guarded;
			let commandDirectory = directory;
			if (process.platform === "win32") {
				commandDirectory = await fs.mkdtemp(path.join(directory, "command-"));
				await prepareMetadata(commandDirectory);
				await fs.copyFile(path.join(directory, "config"), path.join(commandDirectory, "config"));
			}
			const inherited = mergeProcessEnv([options.baseEnv ?? process.env, options.env]);
			const env = Object.fromEntries(Object.entries(inherited).filter(([key]) => !key.toUpperCase().startsWith("GIT_")));
			for (const [key, value] of Object.entries(options.env ?? {})) if (value !== void 0 && /^(?:GIT_INDEX_FILE|GIT_(?:AUTHOR|COMMITTER)_(?:NAME|EMAIL|DATE))$/u.test(key)) env[key] = value;
			Object.assign(env, {
				GIT_COMMON_DIR: commandDirectory,
				GIT_CONFIG_GLOBAL: gitNullConfigPath(),
				GIT_CONFIG_SYSTEM: gitNullConfigPath(),
				GIT_CONFIG_NOSYSTEM: "1",
				GIT_ATTR_NOSYSTEM: "1",
				GIT_NO_REPLACE_OBJECTS: "1",
				GIT_NO_LAZY_FETCH: "1"
			});
			return {
				...guarded,
				baseEnv: env,
				env
			};
		};
		const track = (operation) => {
			assertActive();
			const result = operation();
			pending.add(result);
			result.then(() => pending.delete(result), () => pending.delete(result));
			return result;
		};
		const scopedRun = (root, args, options) => track(async () => await runGit(root, args, await optionsFor(args, { ...options })));
		const scopedRequire = async (root, args, options = {}) => {
			const result = await scopedRun(root, args, options);
			return requireGitCommandOutput(`git ${args.join(" ")}`, result).trim();
		};
		return await run({
			sourceOnly: true,
			withContentEnvironment: (operation) => track(async () => {
				const options = await optionsFor(["pack-objects"], { env: {} });
				return await operation(gitEnvironment(options.env));
			}),
			run: scopedRun,
			require: scopedRequire,
			worker: {
				text: (root, args, options = {}) => track(async () => await runGitBytes(root, args, await optionsFor(args, options))),
				buffered: (root, args, options) => track(async () => await runGitBuffered(root, args, await optionsFor(args, { ...options })))
			}
		});
	} finally {
		active = false;
		await Promise.allSettled(pending);
		await fs.rm(directory, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { withWorktreeGitConfig as t };
