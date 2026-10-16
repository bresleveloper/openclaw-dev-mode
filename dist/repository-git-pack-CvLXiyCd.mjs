import { c as gitNullConfigPath, i as executeGitCommand } from "./git-exec-rH66305f.mjs";
import { r as gitEnvironment } from "./git-DK_u9XbK.mjs";
import { i as workerSshCommandOptions } from "./ssh-C8PSYwfX.mjs";
import { n as prepareWorkerWorkspaceGitPack } from "./workspace-git-base-4x9Itm3z.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/repository-git-pack.ts
const FETCH_TIMEOUT_MS = 6e5;
/** The caller retains scratch-directory custody until this operation settles. */
async function prepareRepositoryWorkerGitPack(params) {
	if (parseConfiguredProjectGitUrl(params.url)?.url !== params.url) throw new Error("Repository preparation requires a canonical GitHub URL");
	if (!/^[a-f0-9]{40}$/u.test(params.baseCommit)) throw new Error("Repository preparation requires an exact GitHub commit");
	if (!params.token.trim()) throw new Error("Private repository preparation requires a current GitHub credential");
	const assertCurrent = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
	};
	const repository = path.join(params.temporaryRoot, "repository.git");
	const baseEnv = gitEnvironment({
		...workerSshCommandOptions({ timeoutMs: FETCH_TIMEOUT_MS }).baseEnv,
		HOME: repository,
		XDG_CONFIG_HOME: repository,
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_CONFIG_SYSTEM: gitNullConfigPath(),
		GIT_CONFIG_GLOBAL: gitNullConfigPath(),
		GIT_TERMINAL_PROMPT: "0",
		GIT_NO_LAZY_FETCH: "1",
		GIT_ALLOW_PROTOCOL: "https"
	});
	const command = async (args, authenticated = false) => {
		assertCurrent();
		const result = await executeGitCommand(repository, [
			"-c",
			"http.followRedirects=false",
			...args
		], {
			baseEnv,
			...authenticated ? { env: {
				GIT_CONFIG_COUNT: "3",
				GIT_CONFIG_KEY_2: `http.${params.url}.extraHeader`,
				GIT_CONFIG_VALUE_2: `Authorization: Basic ${Buffer.from(`x-access-token:${params.token}`).toString("base64")}`
			} } : {},
			input: "",
			timeoutMs: FETCH_TIMEOUT_MS,
			signal: params.signal,
			beforeRun: assertCurrent,
			killProcessTree: true,
			maxOutputBytes: 4096
		}).catch(() => {
			params.signal.throwIfAborted();
			throw new Error("Git could not prepare the repository snapshot; retry preparation");
		});
		assertCurrent();
		if (result.termination !== "exit" || result.code !== 0 || result.stdoutTruncatedBytes) throw new Error(authenticated ? "GitHub could not supply the pinned repository commit; check access and retry preparation" : "Git could not prepare the repository snapshot; retry preparation");
		return result.stdout.trim();
	};
	assertCurrent();
	await fs.mkdir(repository, { mode: 448 });
	await command([
		"init",
		"--bare",
		"--quiet",
		"--template=",
		"--object-format=sha1"
	]);
	await command([
		"fetch",
		"--depth=1",
		"--no-tags",
		"--no-recurse-submodules",
		"--no-auto-maintenance",
		"--no-write-fetch-head",
		"--",
		params.url,
		params.baseCommit
	], true);
	if (await command([
		"cat-file",
		"-t",
		params.baseCommit
	]) !== "commit") throw new Error("The pinned repository object is not a commit");
	assertCurrent();
	const pack = await prepareWorkerWorkspaceGitPack({
		root: repository,
		baseCommit: params.baseCommit,
		temporaryRoot: params.temporaryRoot,
		signal: params.signal,
		baseEnv
	});
	assertCurrent();
	return pack;
}
//#endregion
export { prepareRepositoryWorkerGitPack };
