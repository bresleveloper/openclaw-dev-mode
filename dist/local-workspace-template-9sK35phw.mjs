import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { s as hasWorktreeUnknownOutcome } from "./errors-WYf-uyBk.mjs";
import { o as requireGit, u as runGit } from "./git-CljZIJM8.mjs";
import { u as WORKTREE_SETUP_HEADROOM_BYTES } from "./allocation-qJnLlg7h.mjs";
import { i as timeWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CsrQ5-l1.mjs";
import { a as detectWorktreeFilesystemBackend, r as prepareWorktreeTemplate } from "./template-cache-9PPxTz2j.mjs";
import { n as resolveSandboxDependencyTemplateIdentity, t as prepareSandboxDependencyTemplate } from "./dependency-template-CC1Kq7Fa.mjs";
import { t as prepareLocalWorkspaceCheckout } from "./local-workspace-checkout-DgiPOUfx.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
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
			"--no-optional-locks",
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
/** The returned template retains its generation until the caller settles its clone. */
async function prepareLocalWorkspaceTemplate(params) {
	const { guard } = params;
	const backend = await detectWorktreeFilesystemBackend(params.temporaryRoot, guard);
	if (!backend) return;
	const gitOptions = {
		signal: guard.signal,
		beforeRun: guard.commitGuard,
		killProcessTree: true
	};
	const lockfile = await runGit(params.source, ["show", `${params.baseCommit}:pnpm-lock.yaml`], gitOptions);
	if (lockfile.code !== 0 || lockfile.stdoutTruncatedBytes) {
		log.debug("sandbox dependency template skipped: no complete pnpm lockfile at the selected commit");
		return;
	}
	const identity = await resolveSandboxDependencyTemplateIdentity(params.sandbox, {
		signal: guard.signal,
		assertCurrent: guard.commitGuard
	});
	if (!identity) {
		log.debug("sandbox dependency template skipped: local image identity unavailable");
		return;
	}
	const commonDir = path.resolve(params.source, await requireGit(params.source, ["rev-parse", "--git-common-dir"], gitOptions));
	const prepareSource = async (directory, templateGuard) => {
		await guard.requireDiskSpace([{
			path: params.templateRoot,
			bytes: WORKTREE_SETUP_HEADROOM_BYTES
		}], "sandbox dependency template");
		await backend.createTemplate(directory, templateGuard);
		await timeWorktreePreparationPhase("checkout", () => prepareLocalWorkspaceCheckout({
			source: params.source,
			destination: directory,
			temporaryRoot: params.temporaryRoot,
			baseCommit: params.baseCommit,
			branch: "openclaw-template",
			signal: templateGuard.signal,
			assertCurrent: templateGuard.commitGuard
		}));
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
		requireSpace: () => guard.requireDiskSpace([{
			path: params.templateRoot,
			bytes: WORKTREE_SETUP_HEADROOM_BYTES
		}], "sandbox dependency template"),
		validate: (existing, templateOptions) => validateTemplate(existing.path, params.baseCommit, templateOptions),
		prepare: async (preparing, templateOptions) => {
			const templateGuard = {
				...guard,
				...templateOptions,
				signal: templateOptions.signal ?? guard.signal
			};
			await prepareSource(preparing.path, templateGuard);
			const result = await prepareSandboxDependencyTemplate({
				directory: preparing.path,
				cfg: params.sandbox,
				scopeKey: preparing.id,
				identity,
				signal: templateGuard.signal,
				assertCurrent: templateGuard.commitGuard,
				rollbackGuard: templateOptions.rollbackGuard
			});
			let reason = result.installed ? void 0 : result.reason;
			if (result.installed) {
				const contained = await hasContainedVirtualStore(preparing.path, identity.docker.workdir);
				templateGuard.commitGuard();
				if (contained && await validateTemplate(preparing.path, params.baseCommit, templateGuard, true)) {
					log.info("sandbox dependency template prepared for the selected commit");
					return;
				}
				reason = contained ? "installation changed tracked source" : "pnpm virtual store is outside node_modules or unavailable";
			}
			log.warn(`sandbox dependency template using source-only fallback: ${reason}`);
			templateGuard.commitGuard();
			await fs.rm(preparing.path, {
				recursive: true,
				force: true
			});
			await prepareSource(preparing.path, templateGuard);
		}
	});
	return record ? {
		record,
		backend
	} : void 0;
}
/** The caller holds allocation before projection custody, matching removal's lock order. */
async function cloneLocalWorkspaceTemplate(params) {
	const prepared = await timeWorktreePreparationPhase("templatePrepare", () => prepareLocalWorkspaceTemplate(params));
	if (!prepared) return false;
	const { record, backend } = prepared;
	const { guard } = params;
	let outcome;
	try {
		guard.commitGuard();
		await guard.requireDiskSpace([{
			path: params.destination,
			bytes: backend.id === "btrfs" ? backend.estimateCloneBytes(0, 0) : WORKTREE_SETUP_HEADROOM_BYTES
		}], "sandbox workspace clone");
		try {
			await timeWorktreePreparationPhase("templateApply", () => backend.cloneTemplate(record.path, params.destination, guard));
		} catch (error) {
			if (hasWorktreeUnknownOutcome(error)) throw error;
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
		], {
			signal: guard.signal,
			beforeRun: guard.commitGuard,
			killProcessTree: true
		});
		return true;
	} catch (error) {
		outcome = error;
		throw error;
	} finally {
		await record.release(outcome);
	}
}
//#endregion
export { prepareLocalWorkspaceTemplate as n, cloneLocalWorkspaceTemplate as t };
