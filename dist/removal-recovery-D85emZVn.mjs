import { r as withGitProcessOperation } from "./spawn-diagnostics-BltWCplw.mjs";
import { i as runOutsideCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { l as normalizeGitPathForFilesystem, n as createGitCommandError } from "./git-exec-rH66305f.mjs";
import { c as requireGit, f as runGit, l as requireGitBuffer, o as listGitWorktrees } from "./git-DK_u9XbK.mjs";
import { n as getRegistryWorktreeProvisionedPaths } from "./registry-read-CqOwdsWM.mjs";
import { b as updateRegistryWorktree, d as getRegistryWorktree, r as assertWorktreeRemovalClaim, t as abortWorktreeRemovalRow } from "./registry-Bm5FVBwN.mjs";
import { t as withWorktreeAllocationLease } from "./allocation-D2ptJdFR.mjs";
import { a as requireWorktreeDiskSpace } from "./capacity-BLcBSfzr.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CA7TAxaq.mjs";
import { a as removeManagedCheckout, d as withExactStateGitLocks, i as prepareSnapshotBranchDeletion } from "./removal-git-C1z0ZRNp.mjs";
import { s as resolveRepository } from "./service-preparation-DirAUHyx.mjs";
import { n as claimWorktreeRemoval, s as lockState } from "./run-lease-CixZzbdu.mjs";
import { c as rawPathStat, l as splitNullBuffer } from "./git-path-inventory-BZyLLmiS.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/agents/worktrees/removal-recovery-inventory.ts
/** Match physical checkout bytes to the original capture under Git's filename/content policy. */
async function createRemovalRecoveryInventory(params) {
	const { record, snapshot, gitdir, options, assertIdentity, refuse: preserved } = params;
	const readRetainedGitBoolean = async (key, fallback) => {
		const result = await runGit(record.repoRoot, [
			"config",
			"--type=bool",
			"--get",
			key
		], {
			...options,
			beforeRun: assertIdentity,
			env: {
				...options.env,
				GIT_DIR: gitdir
			}
		});
		if (result.code !== 0 && result.code !== 1) throw createGitCommandError(`git config ${key}`, result);
		return result.code === 1 ? fallback : result.stdout.trim() === "true";
	};
	const precompose = process.platform === "darwin" && await readRetainedGitBoolean("core.precomposeunicode", false);
	const pathKey = (filename) => precompose ? filename.normalize("NFC") : filename;
	const entries = /* @__PURE__ */ new Map();
	for (const item of splitNullBuffer(await requireGitBuffer(record.repoRoot, [
		"ls-tree",
		"-r",
		"-l",
		"-z",
		snapshot
	], options))) {
		const tab = item.indexOf(9);
		const filename = item.subarray(tab + 1).toString("utf8");
		const fields = item.subarray(0, tab).toString("ascii").trim().split(/\s+/u);
		if (tab < 0 || !Buffer.from(filename).equals(item.subarray(tab + 1)) || filename.split("/").some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git") || ![
			"100644",
			"100755",
			"120000"
		].includes(fields[0])) throw preserved("Unsupported snapshot path or file type");
		const key = pathKey(filename);
		if (entries.has(key)) throw preserved("Snapshot paths alias under the checkout filename policy");
		entries.set(key, {
			filename,
			mode: fields[0],
			oid: fields[2],
			size: Number(fields[3])
		});
	}
	const materializedSymlinks = [...entries.values()].some((entry) => entry.mode === "120000") && !await readRetainedGitBoolean("core.symlinks", process.platform !== "win32");
	const checkoutBytes = (entry) => entry.size * (snapshot.length + 8) + 65536;
	const inventory = (conversionCandidates) => {
		const found = /* @__PURE__ */ new Set();
		const visit = (relative) => {
			const directory = path.join(record.path, relative);
			for (const raw of fs.readdirSync(directory, { encoding: "buffer" })) {
				const name = raw.toString("utf8");
				if (!Buffer.from(name).equals(raw)) throw preserved("Unsupported remaining path");
				if (!relative && name === ".git") continue;
				const child = relative ? `${relative}/${name}` : name;
				const key = pathKey(child);
				const target = path.join(record.path, child);
				const info = fs.lstatSync(target);
				if (info.isDirectory()) {
					if (![...entries.keys()].some((entry) => entry.startsWith(`${key}/`))) throw preserved(`Foreign directory: ${child}`);
					visit(child);
					continue;
				}
				if (found.has(key)) throw preserved(`Aliased remaining path: ${child}`);
				const expected = entries.get(key);
				const mode = info.isSymbolicLink() ? "120000" : info.isFile() ? (process.platform === "win32" ? expected?.mode === "100755" : info.mode & 73) ? "100755" : "100644" : "unsupported";
				const symlinkFile = materializedSymlinks && expected?.mode === "120000" && mode === "100644";
				if (!expected || mode !== expected.mode && !symlinkFile) throw preserved(`Changed or foreign file: ${child}`);
				const content = info.isSymbolicLink() ? fs.readlinkSync(target, { encoding: "buffer" }) : fs.readFileSync(target);
				if (createHash(snapshot.length === 64 ? "sha256" : "sha1").update(`blob ${content.length}\0`).update(content).digest("hex") !== expected.oid) {
					if (conversionCandidates && expected.mode !== "120000") conversionCandidates.push(key);
					else throw preserved(`Changed file: ${child}`);
				}
				found.add(key);
			}
		};
		assertIdentity();
		visit("");
		assertIdentity();
		return [...entries].filter(([key]) => !found.has(key)).map(([, entry]) => entry.filename);
	};
	const verifyInventory = async () => {
		const conversions = [];
		inventory(conversions);
		if (conversions.length) await withWorktreeGitConfig(record.repoRoot, true, {
			...options,
			beforeRun: assertIdentity,
			env: {
				...options.env,
				GIT_DIR: gitdir
			}
		}, async (git) => {
			for (const key of conversions) {
				const entry = entries.get(key);
				const filename = entry.filename;
				const result = await git.worker.buffered(record.repoRoot, [
					`--attr-source=${snapshot}`,
					"cat-file",
					"--filters",
					`--path=${filename}`,
					`${snapshot}:${filename}`
				], {
					...options,
					maxOutputBytes: {
						stdout: checkoutBytes(entry),
						stderr: 65536
					}
				});
				if (result.code !== 0 || result.termination !== "exit" || result.outputLimitStream) throw preserved("Captured checkout representation is unavailable");
				entry.oid = createHash(snapshot.length === 64 ? "sha256" : "sha1").update(`blob ${result.stdout.length}\0`).update(result.stdout).digest("hex");
			}
		});
		return inventory();
	};
	return {
		verify: verifyInventory,
		missingBytes: (files) => files.reduce((sum, file) => sum + checkoutBytes(entries.get(pathKey(file))), 0),
		assertComplete: () => {
			if (inventory().length) throw preserved("Checkout changed before destructive admission");
		}
	};
}
//#endregion
//#region src/agents/worktrees/removal-recovery.ts
const preserved = (reason) => /* @__PURE__ */ new Error(`${reason}; remaining source and original snapshot preserved`);
/** Explicit recovery: reconstitute a clean checkout without replacing any surviving file,
* then let native non-force Git removal own deletion. Dirty/exact-state captures keep their
* existing recovery owners; neither their index nor their snapshots can be reconstructed here.
*/
async function recoverManagedWorktreeRemoval(params, context) {
	return await withGitProcessOperation("worktree.recovery", () => withWorktreeAllocationLease({
		...params,
		env: context.env
	}, async (guard) => recoverRemovalWithAllocation({
		...params,
		...guard,
		...context
	})));
}
async function recoverRemovalWithAllocation(params) {
	if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(params.snapshot)) throw preserved("Expected a full snapshot commit id");
	const record = getRegistryWorktree(params.env, params.id);
	if (!record || record.snapshotRef !== `refs/openclaw/snapshots/${params.id}`) throw preserved("Recovery requires an ordinary removal snapshot");
	const repository = await resolveRepository(record.repoRoot);
	if (repository.fingerprint !== record.repoFingerprint || repository.repoRoot !== record.repoRoot) throw preserved("Worktree repository identity changed");
	const pendingRef = `refs/openclaw/removals/${record.id}`;
	const removalRefs = [
		record.snapshotRef,
		pendingRef,
		`refs/heads/${record.branch}`
	];
	const assertDirectRefFiles = () => {
		for (const ref of removalRefs) {
			const filename = path.join(repository.commonDir, ref);
			const info = fs.lstatSync(filename, { throwIfNoEntry: false });
			if (info && (!info.isFile() || info.nlink !== 1 || fs.readFileSync(filename, "utf8").startsWith("ref:"))) throw preserved("Removal refs must remain direct refs");
		}
	};
	const assertDirectRefs = async (options) => {
		for (const ref of removalRefs) if ((await runGit(record.repoRoot, [
			"symbolic-ref",
			"--quiet",
			ref
		], options)).code !== 1) throw preserved("Removal refs must remain direct refs");
	};
	const retiredRegistration = record.removedAt !== void 0 && (await listGitWorktrees(record.repoRoot, {
		signal: params.signal,
		beforeRun: params.commitGuard,
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_OPTIONAL_LOCKS: "0"
		}
	})).some((entry) => path.resolve(entry.path) === record.path);
	if (record.removedAt !== void 0 && !retiredRegistration) {
		const assertTerminal = () => {
			params.commitGuard?.();
			assertDirectRefFiles();
			if (JSON.stringify(getRegistryWorktree(params.env, record.id)) !== JSON.stringify(record)) throw preserved("Completed removal lifecycle changed");
		};
		const options = {
			signal: params.signal,
			beforeRun: assertTerminal,
			env: {
				GIT_NO_LAZY_FETCH: "1",
				GIT_NO_REPLACE_OBJECTS: "1",
				GIT_OPTIONAL_LOCKS: "0"
			}
		};
		await assertDirectRefs(options);
		if (await rawPathStat(record.path) || (await listGitWorktrees(record.repoRoot, options)).some((entry) => path.resolve(entry.path) === record.path) || await requireGit(record.repoRoot, ["rev-parse", record.snapshotRef], options) !== params.snapshot) throw preserved("Completed removal identity changed");
		const pending = await runGit(record.repoRoot, [
			"rev-parse",
			"--verify",
			"--quiet",
			pendingRef
		], options);
		const branch = await runGit(record.repoRoot, [
			"rev-parse",
			"--verify",
			"--quiet",
			`refs/heads/${record.branch}`
		], options);
		if (pending.code === 1) {
			if (branch.code !== 1) throw preserved("Completed removal branch changed");
		} else {
			if (pending.code !== 0 || pending.stdout.trim() !== params.snapshot) throw preserved("Pending snapshot changed");
			if (branch.code !== 1) {
				const head = await requireGit(record.repoRoot, ["rev-parse", `${params.snapshot}^`], options);
				if (branch.code !== 0 || branch.stdout.trim() !== head) throw preserved("Recorded branch changed");
				const deletion = await prepareSnapshotBranchDeletion(record, record.snapshotRef, params.snapshot, options);
				await requireGit(record.repoRoot, [
					"branch",
					"-d",
					"--",
					record.branch
				], deletion);
			}
			await requireGit(record.repoRoot, ["update-ref", "--stdin"], {
				...options,
				input: `option no-deref\nverify ${record.snapshotRef} ${params.snapshot}\noption no-deref\ndelete ${pendingRef} ${params.snapshot}\n`
			});
		}
		return {
			removed: true,
			snapshotRef: record.snapshotRef
		};
	}
	const token = randomUUID();
	const assertRecord = () => {
		params.commitGuard?.();
		params.signal?.throwIfAborted();
		const current = getRegistryWorktree(params.env, record.id);
		if (JSON.stringify(current) !== JSON.stringify(record)) throw preserved("Worktree registry changed during recovery");
	};
	assertRecord();
	claimWorktreeRemoval(params.env, {
		worktreeId: record.id,
		token,
		...retiredRegistration ? { retiredRemoval: true } : {},
		assertCurrent: assertRecord
	});
	const assertCurrent = () => {
		assertRecord();
		assertDirectRefFiles();
		assertWorktreeRemovalClaim(params.env, record.id, token);
	};
	const options = {
		signal: params.signal,
		beforeRun: assertCurrent,
		killProcessTree: true,
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_OPTIONAL_LOCKS: "0"
		}
	};
	try {
		const provisioned = await getRegistryWorktreeProvisionedPaths(params.env, record.id);
		if (!provisioned || provisioned.length) throw preserved("Provisioned-file recovery requires its original archive owner");
		const { localWorkspaceStore } = await import("./local-workspace-store-E1UuzVne.mjs");
		if (localWorkspaceStore(params.env).get(record.id)) throw preserved("Projected worktree recovery requires its original archive owner");
		const head = await requireGit(record.repoRoot, ["rev-parse", `${params.snapshot}^`], options);
		if (await requireGit(record.repoRoot, ["rev-parse", `${head}^{tree}`], options) !== await requireGit(record.repoRoot, ["rev-parse", `${params.snapshot}^{tree}`], options)) throw preserved("Recovery requires an unchanged captured tree");
		const assertRefs = async (allowAbsentBranch = false) => {
			await assertDirectRefs(options);
			for (const ref of [record.snapshotRef, pendingRef]) if (await requireGit(record.repoRoot, [
				"rev-parse",
				"--verify",
				ref
			], options) !== params.snapshot) throw preserved("Removal snapshot ref changed");
			const branch = await runGit(record.repoRoot, [
				"rev-parse",
				"--verify",
				"--quiet",
				`refs/heads/${record.branch}`
			], options);
			if (branch.code === 0 ? branch.stdout.trim() !== head : !allowAbsentBranch || branch.code !== 1) throw preserved("Recorded branch changed");
			assertCurrent();
		};
		await assertRefs(!await rawPathStat(record.path));
		const state = await lockState(record);
		if (state.kind === "live" || state.kind === "foreign") throw preserved("Worktree is locked or in use");
		const registered = (await listGitWorktrees(record.repoRoot, options)).some((entry) => path.resolve(entry.path) === record.path);
		const originalRoot = await rawPathStat(record.path);
		if (retiredRegistration && originalRoot) throw preserved("Retired checkout path reappeared");
		let admin;
		if (registered) {
			const adminRoot = path.join(repository.commonDir, "worktrees");
			for (const name of await fs$1.readdir(adminRoot)) {
				const candidate = path.join(adminRoot, name);
				if (!(await rawPathStat(candidate))?.isDirectory()) continue;
				const backlink = await fs$1.readFile(path.join(candidate, "gitdir"), "utf8").catch(() => "");
				if (path.resolve(candidate, normalizeGitPathForFilesystem(backlink.trim())) === path.join(record.path, ".git")) {
					if (admin) throw preserved("Ambiguous worktree registration");
					admin = candidate;
				}
			}
			if (!admin) throw preserved("Original worktree administration is unavailable");
		}
		if (originalRoot && (!originalRoot.isDirectory() || !admin || await fs$1.realpath(record.path) !== record.path)) throw preserved("Worktree path identity is unavailable");
		let assertAdmin = () => {};
		if (admin) {
			const gitdir = admin;
			const adminIdentity = await fs$1.lstat(gitdir);
			const indexOptions = {
				...options,
				env: {
					...options.env,
					GIT_DIR: gitdir,
					GIT_INDEX_FILE: path.join(gitdir, "index")
				}
			};
			const sharedIndex = await requireGit(record.repoRoot, ["rev-parse", "--shared-index-path"], indexOptions);
			const metadataNames = [
				"HEAD",
				"gitdir",
				"commondir",
				"index"
			];
			if (sharedIndex) {
				const shared = path.resolve(record.repoRoot, normalizeGitPathForFilesystem(sharedIndex));
				if (path.dirname(shared) !== gitdir || !/^sharedindex\.[a-f0-9]+$/u.test(path.basename(shared))) throw preserved("Original split index identity changed");
				metadataNames.push(path.basename(shared));
			}
			const worktreeConfig = path.join(gitdir, "config.worktree");
			const hadWorktreeConfig = Boolean(await rawPathStat(worktreeConfig));
			if (hadWorktreeConfig) metadataNames.push("config.worktree");
			const metadata = await Promise.all(metadataNames.map(async (name) => {
				const filename = path.join(gitdir, name);
				const identity = await fs$1.lstat(filename);
				if (!identity.isFile() || identity.nlink !== 1) throw preserved("Original Git metadata is aliased");
				return {
					filename,
					identity,
					bytes: await fs$1.readFile(filename)
				};
			}));
			assertAdmin = () => {
				assertCurrent();
				if (!hadWorktreeConfig && fs.lstatSync(worktreeConfig, { throwIfNoEntry: false })) throw preserved("Original Git configuration changed");
				const currentAdmin = fs.lstatSync(gitdir);
				if (currentAdmin.dev !== adminIdentity.dev || currentAdmin.ino !== adminIdentity.ino) throw preserved("Worktree administration identity changed");
				for (const saved of metadata) {
					const current = fs.lstatSync(saved.filename);
					if (current.dev !== saved.identity.dev || current.ino !== saved.identity.ino || current.mode !== saved.identity.mode || current.nlink !== saved.identity.nlink || !fs.readFileSync(saved.filename).equals(saved.bytes)) throw preserved("Original Git metadata changed");
				}
				assertCurrent();
			};
			if (await fs$1.realpath(gitdir) !== gitdir || path.resolve(gitdir, normalizeGitPathForFilesystem((await fs$1.readFile(path.join(gitdir, "commondir"), "utf8")).trim())) !== repository.commonDir || (await fs$1.readFile(path.join(gitdir, "HEAD"), "utf8")).trim() !== `ref: refs/heads/${record.branch}`) throw preserved("Original Git metadata identity changed");
			const indexed = await requireGitBuffer(record.repoRoot, [
				"ls-files",
				"--stage",
				"-v",
				"-z"
			], indexOptions);
			if (splitNullBuffer(indexed).some((entry) => entry[0] !== 72)) throw preserved("Original index has hidden or unmerged entries");
			if ((await runGit(record.repoRoot, [
				"diff-index",
				"--cached",
				"--quiet",
				params.snapshot,
				"--"
			], indexOptions)).code !== 0) throw preserved("Original index differs from the capture");
		}
		if (originalRoot && admin) {
			const gitdir = admin;
			const gitfile = path.join(record.path, ".git");
			const assertIdentity = () => {
				assertCurrent();
				assertAdmin();
				const current = fs.lstatSync(record.path, { throwIfNoEntry: false });
				if (current?.dev !== originalRoot.dev || current.ino !== originalRoot.ino) throw preserved("Checkout or original index changed");
				const marker = fs.lstatSync(gitfile, { throwIfNoEntry: false });
				if (marker) {
					if (!marker.isFile() || marker.nlink !== 1) throw preserved("Checkout Git link changed");
					const text = fs.readFileSync(gitfile, "utf8").trim();
					const target = text.startsWith("gitdir: ") ? path.resolve(record.path, normalizeGitPathForFilesystem(text.slice(8))) : "";
					if (!(process.platform === "win32" ? target.toLowerCase() === gitdir.toLowerCase() : target === gitdir)) throw preserved("Checkout Git link changed");
				}
			};
			const inventory = await createRemovalRecoveryInventory({
				record,
				snapshot: params.snapshot,
				gitdir,
				options,
				assertIdentity,
				refuse: preserved
			});
			const missing = await inventory.verify();
			await assertRefs();
			requireWorktreeDiskSpace([{
				path: record.path,
				bytes: inventory.missingBytes(missing)
			}], "interrupted removal recovery");
			if (!await rawPathStat(gitfile)) {
				assertIdentity();
				await fs$1.writeFile(gitfile, `gitdir: ${gitdir}\n`, {
					flag: "wx",
					mode: 384
				});
			}
			if (state.kind === "dead") await requireGit(record.repoRoot, [
				"worktree",
				"unlock",
				record.path
			], options);
			if (missing.length) await withWorktreeGitConfig(record.path, true, {
				...options,
				beforeRun: assertIdentity
			}, async (git) => {
				await git.require(record.path, [
					`--attr-source=${params.snapshot}`,
					"checkout-index",
					"--stdin",
					"-z"
				], {
					...options,
					beforeRun: assertIdentity,
					input: Buffer.from(`${missing.join("\0")}\0`)
				});
			});
			await withExactStateGitLocks(record, assertIdentity, async () => {
				if ((await inventory.verify()).length) throw preserved("Reconstruction is incomplete");
				await assertRefs();
				assertIdentity();
				await withWorktreeGitConfig(record.path, true, options, async (git) => await removeManagedCheckout(record, git, true, inventory.assertComplete));
			}, [record.snapshotRef, pendingRef]);
		} else if (registered) {
			await assertRefs();
			assertAdmin();
			await withWorktreeGitConfig(record.repoRoot, true, options, async (git) => await runOutsideCommandProcessScope(() => git.require(record.repoRoot, [
				"worktree",
				"remove",
				"--",
				record.path
			], {
				beforeRun: () => {
					assertCurrent();
					assertAdmin();
					if (fs.lstatSync(record.path, { throwIfNoEntry: false })) throw preserved("Missing checkout reappeared before destructive admission");
				},
				killProcessTree: true,
				waitForExit: true
			})));
		}
		await assertRefs(true);
		if (await rawPathStat(record.path) || (await listGitWorktrees(record.repoRoot, options)).some((entry) => path.resolve(entry.path) === record.path)) throw preserved("Checkout removal did not finish");
		const branch = await runGit(record.repoRoot, [
			"show-ref",
			"--verify",
			"--quiet",
			`refs/heads/${record.branch}`
		], options);
		if (branch.code === 0) {
			const deletion = await prepareSnapshotBranchDeletion(record, record.snapshotRef, params.snapshot, options);
			await assertRefs();
			await requireGit(record.repoRoot, [
				"branch",
				"-d",
				"--",
				record.branch
			], deletion);
		} else if (branch.code !== 1) throw createGitCommandError("git show-ref", branch);
		await assertRefs(true);
		assertCurrent();
		updateRegistryWorktree(params.env, record.id, { removedAt: record.removedAt ?? params.now() }, {
			assertCurrent,
			removalToken: token
		});
		const finalized = JSON.stringify(getRegistryWorktree(params.env, record.id));
		await requireGit(record.repoRoot, ["update-ref", "--stdin"], {
			beforeRun: () => {
				params.commitGuard?.();
				assertDirectRefFiles();
				assertWorktreeRemovalClaim(params.env, record.id, token);
				if (JSON.stringify(getRegistryWorktree(params.env, record.id)) !== finalized) throw preserved("Completed removal lifecycle changed");
			},
			env: options.env,
			input: `option no-deref\nverify ${record.snapshotRef} ${params.snapshot}\noption no-deref\ndelete ${pendingRef} ${params.snapshot}\n`
		});
		await fs$1.rmdir(path.dirname(record.path)).catch(() => void 0);
		return {
			removed: true,
			snapshotRef: record.snapshotRef
		};
	} finally {
		abortWorktreeRemovalRow(params.env, record.id, token);
	}
}
//#endregion
export { recoverManagedWorktreeRemoval };
