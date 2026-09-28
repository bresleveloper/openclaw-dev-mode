import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { a as inspectPathPermissions } from "./permissions-DOmAO-Zd.mjs";
import { i as executeGitCommand } from "./git-exec-B6ZpVpQV.mjs";
import { i as managedGitHubIdentityEnvironment, y as writeManagedGitHubProfileFiles } from "./github-tool-identity-BOF32-1s.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/worker/github-binding.runtime.ts
const log = createSubsystemLogger("worker/github");
async function bindWorkerGitHubCheckout(cwd, binding, baseEnv, signal) {
	const git = (args, timeoutMs = 5e3) => executeGitCommand(cwd, args, {
		baseEnv,
		timeoutMs,
		maxOutputBytes: {
			stdout: 1048576,
			stderr: 2048
		},
		...signal ? { signal } : {}
	});
	const requireGit = async (args) => {
		const result = await git(args);
		if (result.code !== 0 || result.stdoutTruncatedBytes) throw new Error(`git ${args[0]} failed or output was truncated (exit ${result.code})`);
		return result.stdout;
	};
	try {
		if ((await git(["rev-parse", "--git-dir"])).code !== 0) return;
		if (binding.remoteUrl) {
			const origin = await git([
				"remote",
				"get-url",
				"origin"
			]);
			if (origin.code !== 0) await requireGit([
				"remote",
				"add",
				"origin",
				binding.remoteUrl
			]);
			else if (origin.stdout.trim() !== binding.remoteUrl) await requireGit([
				"remote",
				"set-url",
				"origin",
				binding.remoteUrl
			]);
		}
		const head = await git([
			"symbolic-ref",
			"--quiet",
			"HEAD"
		]);
		const branch = `refs/heads/${binding.branch}`;
		if (head.code !== 0 || head.stdout.trim() !== branch) {
			await requireGit([
				"update-ref",
				branch,
				"HEAD"
			]);
			await requireGit([
				"symbolic-ref",
				"HEAD",
				branch
			]);
		}
		if (!binding.remoteUrl || signal?.aborted) return;
		const fetched = await git([
			"fetch",
			"--quiet",
			"origin",
			binding.branch
		], 6e4);
		if (fetched.code !== 0) {
			if (fetched.stderr.includes("couldn't find remote ref")) return;
			throw new Error(`git fetch failed (exit ${fetched.code})`);
		}
		await requireGit([
			"update-ref",
			`refs/remotes/origin/${binding.branch}`,
			"FETCH_HEAD"
		]);
		await requireGit([
			"branch",
			`--set-upstream-to=origin/${binding.branch}`,
			binding.branch
		]);
		const local = (await requireGit(["rev-parse", "HEAD"])).trim();
		const remote = (await requireGit(["rev-parse", "FETCH_HEAD"])).trim();
		if (local === remote) return;
		if ((await git([
			"merge-base",
			"--is-ancestor",
			"HEAD",
			"FETCH_HEAD"
		])).code !== 0) {
			log.warn(`GitHub checkout fast-forward skipped: ${binding.branch} HEAD=${local.slice(0, 7)} origin=${remote.slice(0, 7)}`);
			return;
		}
		if (signal?.aborted) return;
		const listDeleted = async () => (await requireGit([
			"ls-files",
			"--deleted",
			"-z"
		])).split("\0").filter(Boolean);
		const deletedBefore = new Set(await listDeleted());
		await requireGit([
			"reset",
			"--mixed",
			"FETCH_HEAD"
		]);
		const missing = (await listDeleted()).filter((file) => !deletedBefore.has(file));
		if (missing.length > 0) await requireGit([
			"--literal-pathspecs",
			"checkout",
			"--",
			...missing
		]);
	} catch (error) {
		log.warn(`GitHub checkout binding failed: ${String(error).slice(0, 2048)}`);
	}
}
async function prepareWorkerGitHubEnvironment(params) {
	const { binding, stateDir, runId, cwd, signal } = params;
	registerSecretValueForRedaction(binding.token);
	const profilesRoot = path.join(stateDir, "github-profiles");
	const profileDir = path.join(profilesRoot, sha256HexPrefixCore(runId, 16));
	try {
		await fs.rm(profilesRoot, {
			recursive: true,
			force: true
		});
		await writeManagedGitHubProfileFiles(profileDir, binding);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Worker GitHub identity profile could not be written: ${message}`, { cause: error });
	}
	const localIdentityEnv = managedGitHubIdentityEnvironment({
		profileDir,
		gitAuthor: binding.gitAuthor,
		gitConfig: [["credential.helper", ""], ["credential.helper", "!gh auth git-credential"]]
	});
	if (process.platform === "win32") {
		const permissions = await inspectPathPermissions(profileDir);
		if (!permissions.ok || permissions.source !== "windows-acl" || permissions.ownerTrusted !== true || permissions.groupReadable || permissions.worldReadable || permissions.groupWritable || permissions.worldWritable) {
			log.warn(`GitHub binding skipped: profile is not owner-only: ${profileDir}`);
			return;
		}
	}
	await bindWorkerGitHubCheckout(cwd, binding, {
		...process.env,
		...localIdentityEnv,
		GH_TOKEN: binding.token,
		GITHUB_TOKEN: ""
	}, signal);
	return {
		managedLocalIdentity: true,
		excludedStoreNames: [],
		credentialScrubEnv: {
			GH_TOKEN: "",
			GITHUB_TOKEN: ""
		},
		localIdentityEnv
	};
}
//#endregion
export { prepareWorkerGitHubEnvironment };
