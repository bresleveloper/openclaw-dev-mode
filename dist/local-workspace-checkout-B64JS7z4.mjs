import { c as requireGit } from "./git-DK_u9XbK.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CA7TAxaq.mjs";
import { a as runWorkspaceInventoryCommandToFile } from "./workspace-sync-inventory-6viatxYT.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-4x9Itm3z.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/gateway/worker-environments/local-workspace-checkout.ts
/** Build independent, source-only Git metadata before any guest can write this checkout. */
async function prepareLocalWorkspaceCheckout(params) {
	const { signal, assertCurrent: current, destination: repo } = params;
	const temporary = await fs.mkdtemp(path.join(params.temporaryRoot, "git-"));
	try {
		const pack = await withWorktreeGitConfig(params.source, true, {
			signal,
			beforeRun: current
		}, (git) => git.withContentEnvironment((baseEnv) => prepareWorkerWorkspaceGitPack({
			root: params.source,
			baseCommit: params.baseCommit,
			temporaryRoot: temporary,
			signal,
			baseEnv
		})));
		current();
		await fs.mkdir(repo, {
			recursive: true,
			mode: 448
		});
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
			beforeRun: current
		});
		await git([
			"init",
			"--quiet",
			"--template=",
			"--object-format=" + (params.baseCommit.length === 40 ? "sha1" : "sha256")
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
		await fs.writeFile(path.join(repo, ".git", "shallow"), params.baseCommit + "\n", { mode: 384 });
		await git([
			"checkout",
			"--quiet",
			"-b",
			params.branch,
			params.baseCommit
		]);
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { prepareLocalWorkspaceCheckout as t };
