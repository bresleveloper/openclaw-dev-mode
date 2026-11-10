import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as readGitMetadataDirectories } from "./git-root-toH5zPNI.mjs";
import { o as WorktreeRepositoryError } from "./errors-WYf-uyBk.mjs";
import { p as requireGitCommandOutput } from "./git-exec-CvORirty.mjs";
import { u as runGit } from "./git-CljZIJM8.mjs";
import { n as gitFilesystemEnvironmentRevision } from "./git-worker-context-Bo3RTsYA.mjs";
import { i as insideGitCheckout, n as findGitCheckoutRoot } from "./workspace-git-CiP8oVHR.mjs";
import { t as resolveCheckoutRootFromRealPath } from "./repository-paths-D7rjAU03.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/agents/worktrees/branches.runtime.ts
const BRANCH_INVENTORY_MAX_OUTPUT_BYTES = 262144;
const BRANCH_SUGGESTIONS_PER_KIND = 100;
const BRANCH_INVENTORY_FRESHNESS_MS = 3e4;
const branchInventories = /* @__PURE__ */ new Map();
function branchInventoryRevision(repoRoot) {
	const environment = gitFilesystemEnvironmentRevision();
	if (environment === void 0) return;
	try {
		const stamps = createHash("sha256");
		const stamp = (file) => {
			const stat = fs.lstatSync(file, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (stat && !stat.isFile() && !stat.isDirectory()) throw new Error("Uncacheable ref inventory");
			const metadata = stat ? `${stat.dev}:${stat.ino}:${stat.mode}:${stat.uid}:${stat.gid}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}` : "missing";
			stamps.update(`${file}\0${metadata}\0`);
			return stat;
		};
		stamp(path.join(repoRoot, ".git"));
		const directories = readGitMetadataDirectories(repoRoot);
		if (!directories) return;
		const { gitDir, commonDir: common } = directories;
		if (fs.existsSync(path.join(common, "reftable"))) return;
		for (const file of [
			repoRoot,
			gitDir,
			common,
			path.join(gitDir, "HEAD"),
			path.join(gitDir, "commondir"),
			path.join(common, "packed-refs")
		]) stamp(file);
		const visit = (directory, depth = 0) => {
			if (depth > 32 || !stamp(directory)?.isDirectory()) throw new Error("Uncacheable ref directory");
			for (const name of fs.readdirSync(directory).toSorted()) {
				const file = path.join(directory, name);
				if (stamp(file)?.isDirectory()) visit(file, depth + 1);
			}
		};
		visit(path.join(common, "refs"));
		const worktreeRefs = path.join(gitDir, "refs");
		if (common !== gitDir && stamp(worktreeRefs)?.isDirectory()) visit(worktreeRefs);
		return JSON.stringify([environment, stamps.digest("hex")]);
	} catch {
		return;
	}
}
async function listRepositoryBranchRefs(repoRoot, patterns, count) {
	const result = await runGit(repoRoot, [
		"-c",
		"core.warnAmbiguousRefs=true",
		"for-each-ref",
		...count === void 0 ? [] : [`--count=${count}`],
		"--sort=refname",
		count === void 0 ? "--format=%(refname)%00%(refname:short)%00%(symref)%00%(HEAD)" : "--format=%(refname)%00%(refname:short)",
		...patterns
	], {
		maxOutputBytes: BRANCH_INVENTORY_MAX_OUTPUT_BYTES,
		terminateOnOutputLimit: count === void 0
	});
	const output = requireGitCommandOutput("git for-each-ref", result);
	const branches = [];
	for (const line of output.trim().split("\n")) {
		const [ref, name, symbolicRef, head] = line.split("\0");
		const metadata = {
			symbolicRef: symbolicRef || void 0,
			current: head === "*"
		};
		if (!ref || !name) continue;
		if (ref.startsWith("refs/heads/")) branches.push({
			ref,
			...metadata,
			branchName: ref.slice(11),
			branch: {
				name,
				kind: "local"
			}
		});
		else if (ref.startsWith("refs/remotes/")) {
			const remoteRef = ref.slice(13);
			const slash = remoteRef.indexOf("/");
			const branchName = slash > 0 ? remoteRef.slice(slash + 1) : "";
			branches.push({
				ref,
				branchName,
				...metadata,
				branch: {
					name,
					kind: "remote"
				}
			});
		}
	}
	return branches;
}
async function readRepositoryBranches(repoRoot, options = {}) {
	let sourceRoot;
	let requested;
	let snapshot;
	const environment = gitFilesystemEnvironmentRevision();
	try {
		requested = await fs$1.realpath(repoRoot).catch(() => {
			throw new Error(`repository does not exist: ${repoRoot}`);
		});
		if (options.includeRepositoryStatus) {
			if (!(await fs$1.stat(requested)).isDirectory()) return {
				branches: [],
				repositoryStatus: "unavailable"
			};
			if (!insideGitCheckout(requested)) return {
				branches: [],
				repositoryStatus: "not_git"
			};
		}
		const candidate = findGitCheckoutRoot(requested);
		const cached = candidate ? branchInventories.get(candidate) : void 0;
		if (candidate && environment !== void 0) {
			snapshot = branchInventoryRevision(candidate);
			if (cached?.requested === requested && snapshot === cached.revision && Date.now() - cached.refreshedAt < BRANCH_INVENTORY_FRESHNESS_MS) {
				branchInventories.delete(candidate);
				branchInventories.set(candidate, cached);
				return {
					...cached.result,
					...options.includeRepositoryStatus ? { repositoryStatus: "git" } : {}
				};
			}
		}
		sourceRoot = (await resolveCheckoutRootFromRealPath(requested, repoRoot)).root;
		if (candidate !== sourceRoot) snapshot = void 0;
	} catch (error) {
		if (options.includeRepositoryStatus) {
			if (error instanceof WorktreeRepositoryError && error.reason === "unborn") return {
				branches: [],
				repositoryStatus: "not_git"
			};
			return {
				branches: [],
				repositoryStatus: "unavailable"
			};
		}
		throw error;
	}
	branchInventories.delete(sourceRoot);
	let inventory;
	try {
		inventory = await listRepositoryBranchRefs(sourceRoot, ["refs/heads/", "refs/remotes/"]);
	} catch {
		inventory = void 0;
	}
	const branches = /* @__PURE__ */ new Map();
	let branchesUnavailable = false;
	for (const prefix of ["refs/remotes/", "refs/heads/"]) try {
		const entries = inventory ? inventory.filter((entry) => entry.ref.startsWith(prefix)).slice(0, BRANCH_SUGGESTIONS_PER_KIND) : await listRepositoryBranchRefs(sourceRoot, [prefix], BRANCH_SUGGESTIONS_PER_KIND);
		for (const entry of entries) if (entry.branchName && (entry.branch.kind !== "remote" || entry.branchName !== "HEAD")) branches.set(entry.branchName, entry);
	} catch {
		branchesUnavailable = true;
	}
	let defaultRef;
	let headRef;
	if (inventory) {
		defaultRef = inventory.find((entry) => entry.ref === "refs/remotes/origin/HEAD")?.symbolicRef;
		headRef = inventory.find((entry) => entry.current)?.ref;
	} else {
		const remoteHead = await runGit(sourceRoot, [
			"symbolic-ref",
			"--quiet",
			"refs/remotes/origin/HEAD"
		]);
		defaultRef = remoteHead.code === 0 ? remoteHead.stdout.trim() : void 0;
		const head = await runGit(sourceRoot, [
			"symbolic-ref",
			"--quiet",
			"HEAD"
		]);
		headRef = head.code === 0 ? head.stdout.trim() : void 0;
	}
	const resolveBranch = async (ref) => {
		if (!ref) return;
		const known = (inventory ?? [...branches.values()]).find((entry) => entry.ref === ref);
		if (known || inventory) return known?.branchName && (known.branch.kind !== "remote" || known.branchName !== "HEAD") ? known : void 0;
		try {
			return (await listRepositoryBranchRefs(sourceRoot, [ref], 1)).find((entry) => entry.ref === ref && entry.branchName && (entry.branch.kind !== "remote" || entry.branchName !== "HEAD"));
		} catch {
			branchesUnavailable = true;
			return;
		}
	};
	const defaultEntry = await resolveBranch(defaultRef?.startsWith("refs/remotes/origin/") ? `refs/heads/${defaultRef.slice(20)}` : void 0) ?? await resolveBranch(defaultRef);
	const headEntry = await resolveBranch(headRef);
	for (const entry of [defaultEntry, headEntry]) if (entry) branches.set(entry.branchName, entry);
	const rank = (entry) => entry.ref === defaultEntry?.ref ? 0 : entry.ref === headEntry?.ref ? 1 : 2;
	const result = {
		branches: [...branches.values()].toSorted((a, b) => rank(a) - rank(b) || a.branch.name.localeCompare(b.branch.name)).map((entry) => entry.branch),
		...defaultEntry ? { defaultBranch: defaultEntry.branch.name } : {},
		...headEntry ? { headBranch: headEntry.branch.name } : {},
		...branchesUnavailable ? { branchesUnavailable: true } : {}
	};
	if (!branchesUnavailable && environment !== void 0 && snapshot !== void 0) {
		branchInventories.set(sourceRoot, {
			revision: snapshot,
			requested,
			refreshedAt: Date.now(),
			result
		});
		pruneMapToMaxSize(branchInventories, 64);
	}
	return {
		...result,
		...options.includeRepositoryStatus ? { repositoryStatus: "git" } : {}
	};
}
//#endregion
export { readRepositoryBranches };
