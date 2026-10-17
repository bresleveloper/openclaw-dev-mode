import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as requireGit, f as runGit } from "./git-DK_u9XbK.mjs";
import { a as requireWorktreeDiskSpace, t as WORKTREE_SETUP_HEADROOM_BYTES } from "./capacity-BLcBSfzr.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CA7TAxaq.mjs";
import { a as detectWorktreeFilesystemBackend, r as prepareWorktreeTemplate } from "./template-cache-C_TJ9TbQ.mjs";
import { n as resolveSandboxDependencyTemplateIdentity, t as prepareSandboxDependencyTemplate } from "./dependency-template-CVMyopW4.mjs";
import { t as prepareLocalWorkspaceCheckout } from "./local-workspace-checkout-B64JS7z4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { parse as parse$1 } from "yaml";
//#region src/gateway/worker-environments/local-workspace-template.ts
const log = createSubsystemLogger("agents/worktrees");
const digest = (value) => createHash("sha256").update(value).digest("hex");
async function hasContainedVirtualStore(directory, workdir) {
	try {
		const { buffer } = await (await root(directory)).read("node_modules/.modules.yaml", {
			symlinks: "reject",
			maxBytes: 1048576
		});
		const manifest = parse$1(buffer.toString("utf8"));
		if (!isRecord(manifest) || typeof manifest.virtualStoreDir !== "string") return false;
		const modules = path.posix.resolve(workdir, "node_modules");
		const relative = path.posix.relative(modules, path.posix.resolve(modules, manifest.virtualStoreDir));
		return relative !== ".." && !relative.startsWith("../") && !path.posix.isAbsolute(relative);
	} catch {
		return false;
	}
}
/** Only dependencies may survive installation; repository setup outputs remain private. */
async function validateTemplate(directory, commit, guard, trim = false) {
	return await withWorktreeGitConfig(directory, true, {
		signal: guard.signal,
		beforeRun: guard.commitGuard
	}, async (git) => {
		const result = await git.run(directory, [
			"status",
			"--porcelain=v2",
			"--branch",
			"-z",
			"--untracked-files=normal",
			"--ignored=matching"
		], {
			signal: guard.signal,
			beforeRun: guard.commitGuard,
			killProcessTree: true
		});
		const fields = result.stdout.split("\0");
		if (result.code !== 0 || result.termination !== "exit" || result.stdoutTruncatedBytes || fields.pop() !== "") return false;
		const heads = fields.filter((field) => field.startsWith("# branch.oid "));
		if (heads.length !== 1 || heads[0] !== `# branch.oid ${commit}`) return false;
		for (const field of fields) {
			if (field.startsWith("# ")) continue;
			if (!field.startsWith("! ") && !field.startsWith("? ")) return false;
			const relative = field.slice(2);
			const parts = relative.replace(/\/$/u, "").split("/");
			if (parts.some((part) => !part || part === "." || part === "..") || path.isAbsolute(relative)) return false;
			const target = path.join(directory, ...parts);
			const modulesIndex = parts.indexOf("node_modules");
			if (modulesIndex !== -1) {
				if (!(await fs.lstat(path.join(directory, ...parts.slice(0, modulesIndex + 1)))).isDirectory()) return false;
				continue;
			}
			if (!trim) return false;
			guard.commitGuard();
			await fs.rm(target, {
				recursive: true,
				force: true
			});
		}
		return true;
	});
}
/** The caller holds allocation before projection custody, matching removal's lock order. */
async function cloneLocalWorkspaceTemplate(params) {
	const { guard } = params;
	const backend = await detectWorktreeFilesystemBackend(path.dirname(params.destination), guard);
	if (!backend) return false;
	const gitOptions = {
		signal: guard.signal,
		beforeRun: guard.commitGuard,
		killProcessTree: true
	};
	const lockfile = await runGit(params.source, ["show", `${params.baseCommit}:pnpm-lock.yaml`], gitOptions);
	if (lockfile.code !== 0 || lockfile.stdoutTruncatedBytes) {
		log.debug("sandbox dependency template skipped: no complete pnpm lockfile at the selected commit");
		return false;
	}
	const identity = await resolveSandboxDependencyTemplateIdentity(params.sandbox, {
		signal: guard.signal,
		assertCurrent: guard.commitGuard
	});
	if (!identity) {
		log.debug("sandbox dependency template skipped: local image identity unavailable");
		return false;
	}
	const commonDir = path.resolve(params.source, await requireGit(params.source, ["rev-parse", "--git-common-dir"], gitOptions));
	const prepareSource = async (directory) => {
		requireWorktreeDiskSpace([{
			path: params.templateRoot,
			bytes: WORKTREE_SETUP_HEADROOM_BYTES
		}], "sandbox dependency template");
		await backend.createTemplate(directory, guard);
		await prepareLocalWorkspaceCheckout({
			source: params.source,
			destination: directory,
			temporaryRoot: params.temporaryRoot,
			baseCommit: params.baseCommit,
			branch: "openclaw-template",
			signal: guard.signal,
			assertCurrent: guard.commitGuard
		});
	};
	const record = await prepareWorktreeTemplate({
		env: params.env,
		now: Date.now,
		options: guard,
		cacheKey: digest(`sandbox-v1\n${commonDir}\n${params.templateRoot}\n${identity.key}`),
		contentKey: digest(`${params.baseCommit}\n${digest(lockfile.stdout)}\n${identity.key}`),
		repoRoot: params.repoRoot,
		commonDir,
		worktreeRoot: params.templateRoot,
		sourceCommit: params.baseCommit,
		backend: `sandbox-${backend.id}`,
		requireSpace: () => requireWorktreeDiskSpace([{
			path: params.templateRoot,
			bytes: WORKTREE_SETUP_HEADROOM_BYTES
		}], "sandbox dependency template"),
		validate: (existing) => validateTemplate(existing.path, params.baseCommit, guard),
		prepare: async (preparing) => {
			await prepareSource(preparing.path);
			const result = await prepareSandboxDependencyTemplate({
				directory: preparing.path,
				cfg: params.sandbox,
				scopeKey: preparing.id,
				identity,
				signal: guard.signal,
				assertCurrent: guard.commitGuard,
				rollbackGuard: guard.rollbackGuard
			});
			let reason = result.installed ? void 0 : result.reason;
			if (result.installed) {
				const contained = await hasContainedVirtualStore(preparing.path, identity.docker.workdir);
				guard.commitGuard();
				if (contained && await validateTemplate(preparing.path, params.baseCommit, guard, true)) {
					log.info("sandbox dependency template prepared for the selected commit");
					return;
				}
				reason = contained ? "installation changed tracked source" : "pnpm virtual store is outside node_modules or unavailable";
			}
			log.warn(`sandbox dependency template using source-only fallback: ${reason}`);
			guard.commitGuard();
			await fs.rm(preparing.path, {
				recursive: true,
				force: true
			});
			await prepareSource(preparing.path);
		}
	});
	if (!record) return false;
	guard.commitGuard();
	requireWorktreeDiskSpace([{
		path: params.destination,
		bytes: backend.id === "btrfs" ? backend.estimateCloneBytes(0, 0) : WORKTREE_SETUP_HEADROOM_BYTES
	}], "sandbox workspace clone");
	try {
		await backend.cloneTemplate(record.path, params.destination, guard);
	} catch {
		guard.commitGuard();
		await fs.rm(params.destination, {
			recursive: true,
			force: true
		});
		log.warn("sandbox dependency snapshot unavailable; using source-only checkout");
		return false;
	}
	await requireGit(params.destination, [
		"branch",
		"-m",
		params.branch
	], gitOptions);
	return true;
}
//#endregion
export { cloneLocalWorkspaceTemplate };
