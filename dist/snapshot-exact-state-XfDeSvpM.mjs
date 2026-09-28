import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, xn as literal } from "./schemas-BOYIvvln.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { i as requestGitWorkerEffect } from "./git-worker-context-Cywc-SH2.mjs";
import { c as normalizeGitPathForFilesystem } from "./git-exec-B6ZpVpQV.mjs";
import { c as requireGit, d as runGit, l as requireGitBuffer } from "./git-DSwuA7YL.mjs";
import { t as checkoutPathFromGitBytes } from "./git-path-inventory-q-EbMqyF.mjs";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/agents/worktrees/provisioned-file-inspection.ts
function normalizeProvisionedRelativePath(relativePath) {
	if (path.isAbsolute(relativePath)) return;
	const segments = relativePath.split("/");
	if (segments.length === 0 || segments.some((segment) => !segment || segment === "." || segment === "..")) return;
	return segments.join("/");
}
function resolveGitPath(root, relativePath) {
	return path.join(root, ...relativePath.split("/"));
}
async function hasSafeParentDirectories(root, relativePath) {
	const segments = relativePath.split("/");
	let current = root;
	for (const segment of segments.slice(0, -1)) {
		current = path.join(current, segment);
		try {
			const stat = await fs$1.lstat(current);
			if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	}
	return true;
}
async function lstatIfExists(target) {
	try {
		return await fs$1.lstat(target);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function inspectProvisionedFiles(worktreePath, provisionedPaths) {
	if (provisionedPaths === void 0) return;
	const files = [];
	for (const relativePath of provisionedPaths) {
		const normalized = normalizeProvisionedRelativePath(relativePath);
		if (!normalized || !await hasSafeParentDirectories(worktreePath, normalized)) throw new Error(`unsafe provisioned path: ${relativePath}`);
		const target = resolveGitPath(worktreePath, normalized);
		const stat = await lstatIfExists(target);
		if (!stat) {
			files.push({
				path: normalized,
				target,
				mode: null
			});
			continue;
		}
		if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`provisioned path is no longer a regular file: ${relativePath}`);
		files.push({
			path: normalized,
			target,
			mode: stat.mode & 4095
		});
	}
	return files.toSorted((a, b) => a.path.localeCompare(b.path));
}
async function hasUnsnapshotableProvisionedFiles(worktreePath, provisionedPaths) {
	try {
		return await inspectProvisionedFiles(worktreePath, provisionedPaths) === void 0;
	} catch {
		return true;
	}
}
//#endregion
//#region src/agents/worktrees/snapshot-index-objects.ts
/** gitformat-index(5): raw index bytes do not themselves retain embedded Git objects. */
function exactIndexObjects(data, hashSize) {
	const end = data.length - hashSize;
	const invalid = () => /* @__PURE__ */ new Error("Unsupported or invalid exact-state index; source preserved");
	if (end < 12 || data.toString("ascii", 0, 4) !== "DIRC" || ![
		2,
		3,
		4
	].includes(data.readUInt32BE(4)) || !createHash(hashSize === 20 ? "sha1" : "sha256").update(data.subarray(0, end)).digest().equals(data.subarray(end))) throw invalid();
	const objects = /* @__PURE__ */ new Map();
	const add = (offset, limit, kind) => {
		if (offset + hashSize > limit) throw invalid();
		const object = data.subarray(offset, offset + hashSize).toString("hex");
		if (!/^0+$/u.test(object)) objects.set(object, kind);
	};
	const nul = (offset, limit) => {
		const result = data.indexOf(0, offset);
		if (result < offset || result >= limit) throw invalid();
		return result;
	};
	let offset = 12;
	for (let entry = 0; entry < data.readUInt32BE(8); entry++) {
		const start = offset;
		offset += 42 + hashSize;
		if (offset > end) throw invalid();
		const mode = data.readUInt32BE(start + 24);
		if ((mode & 61440) === 57344) throw new Error("Nested Git index objects cannot be snapshotted losslessly");
		add(start + 40, end, (mode & 61440) === 16384 ? "tree" : "blob");
		if (data.readUInt16BE(offset - 2) & 16384) offset += 2;
		if (data.readUInt32BE(4) === 4) {
			let bytes = 0;
			do
				if (offset >= end || ++bytes > 10) throw invalid();
			while (data[offset++] & 128);
			offset = nul(offset, end) + 1;
		} else offset = start + Math.ceil((nul(offset, end) + 1 - start) / 8) * 8;
		if (offset > end) throw invalid();
	}
	while (offset < end) {
		if (offset + 8 > end) throw invalid();
		const signature = data.toString("ascii", offset, offset + 4);
		const limit = offset + 8 + data.readUInt32BE(offset + 4);
		offset += 8;
		if (limit > end) throw invalid();
		if (signature === "TREE") while (offset < limit) {
			offset = nul(offset, limit) + 1;
			const newline = data.indexOf(10, offset);
			if (newline < offset || newline >= limit) throw invalid();
			const counts = /^(-?\d+) (\d+)$/u.exec(data.toString("ascii", offset, newline));
			if (!counts) throw invalid();
			offset = newline + 1;
			if (Number(counts[1]) >= 0) {
				add(offset, limit, "tree");
				offset += hashSize;
			}
		}
		else if (signature === "REUC") while (offset < limit) {
			offset = nul(offset, limit) + 1;
			const modes = [];
			for (let stage = 0; stage < 3; stage++) {
				const next = nul(offset, limit);
				const raw = data.toString("ascii", offset, next);
				if (!/^[0-7]+$/u.test(raw)) throw invalid();
				modes.push(Number.parseInt(raw, 8));
				offset = next + 1;
			}
			for (const mode of modes) {
				if (mode === 0) continue;
				if ((mode & 61440) === 57344) throw new Error("Nested Git resolve-undo objects cannot be snapshotted losslessly");
				add(offset, limit, "blob");
				offset += hashSize;
			}
		}
		else if (![
			"link",
			"UNTR",
			"FSMN",
			"EOIE",
			"IEOT"
		].includes(signature)) throw new Error(`Unsupported exact-state index extension ${signature}; source preserved`);
		offset = limit;
	}
	return objects;
}
//#endregion
//#region src/agents/worktrees/snapshot-exact-state.ts
const oid = string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);
const entrySchema = object({
	path: string().regex(/^(?:[a-f0-9]{2})+$/u),
	kind: _enum([
		"file",
		"symlink",
		"directory",
		"missing"
	]),
	mode: number().int().nonnegative(),
	mtimeMs: number().finite(),
	blob: oid.optional(),
	provisioned: boolean(),
	size: number().int().nonnegative()
}).strict();
const metadataSchema = object({
	version: literal(1),
	sourceIdentity: object({
		device: string().regex(/^\d+$/u),
		inode: string().regex(/^\d+$/u)
	}).strict(),
	retirementName: string().regex(/^\.openclaw-retiring-[a-f0-9-]{36}$/u),
	head: oid,
	branch: string(),
	branchHead: oid,
	indexSha256: string().regex(/^[a-f0-9]{64}$/u),
	index: object({
		blob: oid,
		mode: number().int(),
		mtimeMs: number().finite()
	}).strict(),
	sharedIndex: object({
		name: string().regex(/^sharedindex\.[a-f0-9]{40}(?:[a-f0-9]{24})?$/u),
		blob: oid
	}).strict().optional(),
	files: array(entrySchema)
}).strict();
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const exactSnapshotPrefix = "refs/openclaw/snapshots/exact-v1/";
const identity = {
	GIT_AUTHOR_NAME: "OpenClaw",
	GIT_AUTHOR_EMAIL: "openclaw@localhost",
	GIT_COMMITTER_NAME: "OpenClaw",
	GIT_COMMITTER_EMAIL: "openclaw@localhost"
};
const assertSnapshotCurrent = () => requestGitWorkerEffect({
	type: "worktree.assert-current",
	input: {}
});
/** Keep raw Git path bytes, but never allow archive paths to traverse or alias Git metadata. */
function checkedPath(hex) {
	const bytes = Buffer.from(hex, "hex");
	if (bytes.includes(0) || bytes[0] === 47 || bytes.includes(92) && process.platform === "win32" || bytes.toString("latin1").split("/").some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git") || process.platform === "win32" && bytes.includes(58)) throw new Error("Invalid path in exact-state snapshot");
	return bytes;
}
async function checkParents(root, relative, allowMissing = false) {
	const parents = [root];
	for (let slash = relative.indexOf(47); slash !== -1; slash = relative.indexOf(47, slash + 1)) parents.push(checkoutPathFromGitBytes(root, relative.subarray(0, slash)));
	const observed = await Promise.all(parents.map(async (parent) => {
		const stat = await fs$1.lstat(parent, { bigint: true }).catch((error) => {
			if (allowMissing && parent !== root && isMissingPathError(error)) return;
			throw error;
		});
		if (stat && !stat.isDirectory()) throw new Error("Exact-state path has a non-directory parent; checkout preserved");
		return {
			parent,
			stat
		};
	}));
	return () => {
		for (const { parent, stat } of observed) {
			const current = fs.lstatSync(parent, {
				bigint: true,
				throwIfNoEntry: !allowMissing
			});
			if (stat ? !current?.isDirectory() || current.dev !== stat.dev || current.ino !== stat.ino : current !== void 0) throw new Error("Exact-state parent directory changed; source preserved");
		}
	};
}
async function indexPath(cwd) {
	return path.resolve(cwd, normalizeGitPathForFilesystem(await requireGit(cwd, [
		"rev-parse",
		"--git-path",
		"index"
	])));
}
function blobOid(bytes, algorithm) {
	return createHash(algorithm).update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
}
function quotePath(bytes) {
	return "\"" + [...bytes].map((b) => `\\${b.toString(8).padStart(3, "0")}`).join("") + "\"";
}
/** Capture before publication, then recapture at deletion admission. Ignored bytes stay in SQLite. */
async function captureExactState(input) {
	const params = {
		...input,
		paths: [...input.paths]
	};
	const cwd = params.checkoutPath;
	const sourceStat = await fs$1.lstat(cwd, { bigint: true });
	if (!sourceStat.isDirectory()) throw new Error("Exact-state source is no longer a directory; source preserved");
	const sparse = await runGit(cwd, [
		"config",
		"--bool",
		"core.sparseCheckout"
	]);
	if (sparse.code !== 1 && (sparse.code !== 0 || sparse.stdout.trim() !== "false")) throw new Error("Exact-state retirement requires a full, non-sparse checkout; source preserved");
	const head = await requireGit(cwd, ["rev-parse", "HEAD^{commit}"]);
	const branchHead = await requireGit(cwd, ["rev-parse", `refs/heads/${params.branch}^{commit}`]);
	const sourceIndex = await indexPath(cwd);
	const indexStat = await fs$1.lstat(sourceIndex);
	if (!indexStat.isFile()) throw new Error("Exact-state retirement requires a regular Git index");
	const indexBytes = await fs$1.readFile(sourceIndex);
	const indexSha256 = sha256(indexBytes);
	if (head !== params.expected.head || branchHead !== params.expected.branchHead || indexSha256 !== params.expected.indexSha256) throw new Error("Worktree HEAD, branch or index changed; checkout preserved");
	const algorithm = head.length === 64 ? "sha256" : "sha1";
	if (params.write) {
		let bytes = indexBytes.length;
		for (const relative of params.paths) {
			const stat = await fs$1.lstat(checkoutPathFromGitBytes(cwd, relative)).catch((error) => {
				if (isMissingPathError(error)) return;
				throw error;
			});
			bytes += (stat?.size ?? 0) + 1024 + relative.length * 4;
		}
		let provisionedBytes = 0;
		for (const relative of params.provisionedPaths) {
			const stat = await fs$1.lstat(path.join(cwd, relative)).catch((error) => {
				if (isMissingPathError(error)) return;
				throw error;
			});
			provisionedBytes += stat?.size ?? 0;
		}
		const common = path.resolve(cwd, normalizeGitPathForFilesystem(await requireGit(cwd, ["rev-parse", "--git-common-dir"])));
		await requestGitWorkerEffect({
			type: "worktree.snapshot-capacity",
			input: {
				demands: [{
					path: common,
					bytes: 2 * bytes
				}, ...params.temporaryDirectory ? [{
					path: params.temporaryDirectory,
					bytes: 2 * bytes
				}] : []],
				stateBytes: 2 * provisionedBytes,
				purpose: "worktree safety snapshot"
			}
		});
	}
	const metadataEntries = [];
	const putBlob = async (name, bytes) => {
		const blob = blobOid(bytes, algorithm);
		if (params.write) {
			if (await requireGit(cwd, [
				"hash-object",
				"--no-filters",
				"-w",
				"--stdin"
			], { input: bytes }) !== blob) throw new Error("Git exact-state object verification failed");
		}
		metadataEntries.push(`100644 blob ${blob}\t${name}\0`);
		return blob;
	};
	const index = {
		blob: await putBlob("index", indexBytes),
		mode: indexStat.mode & 4095,
		mtimeMs: indexStat.mtimeMs
	};
	const indexObjects = exactIndexObjects(indexBytes, head.length === 64 ? 32 : 20);
	const sharedPath = await requireGit(cwd, ["rev-parse", "--shared-index-path"]);
	let sharedIndex;
	if (sharedPath) {
		const source = path.resolve(cwd, normalizeGitPathForFilesystem(sharedPath));
		const name = path.basename(source);
		if (!/^sharedindex\.[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(name)) throw new Error("Invalid split-index dependency");
		const bytes = await fs$1.readFile(source);
		sharedIndex = {
			name,
			blob: await putBlob(name, bytes)
		};
		for (const [object, kind] of exactIndexObjects(bytes, head.length === 64 ? 32 : 20)) indexObjects.set(object, kind);
	}
	for (const [object, kind] of indexObjects) metadataEntries.push(`${kind === "tree" ? "040000" : "100644"} ${kind} ${object}\tindex-object-${object}\0`);
	const provisioned = new Set(params.provisionedPaths.map((p) => Buffer.from(p).toString("hex")));
	const paths = new Map([...params.paths, ...params.provisionedPaths.map((p) => Buffer.from(p))].map((p) => [p.toString("hex"), p]));
	const filePaths = Array.from(paths.values());
	for (const entry of filePaths) for (let slash = entry.indexOf(47); slash !== -1; slash = entry.indexOf(47, slash + 1)) {
		const directory = entry.subarray(0, slash);
		paths.set(directory.toString("hex"), directory);
	}
	const files = [];
	const treeEntries = [];
	const regular = [];
	for (const [hex, relative] of [...paths].toSorted(([a], [b]) => a.localeCompare(b))) {
		checkedPath(hex);
		let stat;
		try {
			await checkParents(cwd, relative);
			stat = await fs$1.lstat(checkoutPathFromGitBytes(cwd, relative));
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			files.push({
				path: hex,
				kind: "missing",
				mode: 0,
				size: 0,
				mtimeMs: 0,
				provisioned: provisioned.has(hex)
			});
			continue;
		}
		const kind = stat.isFile() ? "file" : stat.isSymbolicLink() ? "symlink" : stat.isDirectory() ? "directory" : void 0;
		if (!kind) throw new Error("Exact-state snapshot contains an unsupported file type; checkout preserved");
		const entry = {
			path: hex,
			kind,
			mode: stat.mode & 4095,
			size: stat.size,
			mtimeMs: stat.mtimeMs,
			provisioned: provisioned.has(hex)
		};
		if (kind !== "directory") {
			const filename = checkoutPathFromGitBytes(cwd, relative);
			let bytes;
			if (kind === "symlink") bytes = await fs$1.readlink(filename, { encoding: "buffer" });
			else {
				const handle = await fs$1.open(filename, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
				try {
					bytes = await handle.readFile();
				} finally {
					await handle.close();
				}
			}
			entry.blob = blobOid(bytes, algorithm);
			if (!entry.provisioned) {
				if (kind === "symlink") await putBlob(`symlink-${files.length}`, bytes);
				else regular.push({
					path: relative,
					blob: entry.blob
				});
				const mode = kind === "symlink" ? "120000" : entry.mode & 73 ? "100755" : "100644";
				treeEntries.push(Buffer.concat([
					Buffer.from(`${mode} ${entry.blob}\t`),
					relative,
					Buffer.from([0])
				]));
			}
		}
		files.push(entry);
	}
	if (params.write) for (let offset = 0; offset < regular.length; offset += 128) {
		await assertSnapshotCurrent();
		const batch = regular.slice(offset, offset + 128);
		const stored = (await requireGit(cwd, [
			"hash-object",
			"--no-filters",
			"-w",
			"--stdin-paths"
		], { input: Buffer.from(batch.map((e) => quotePath(e.path) + "\n").join("")) })).split("\n");
		if (stored.some((value, i) => value !== batch[i]?.blob) || stored.length !== batch.length) throw new Error("Worktree files changed during exact-state capture; checkout preserved");
	}
	const metadata = {
		version: 1,
		sourceIdentity: {
			device: sourceStat.dev.toString(),
			inode: sourceStat.ino.toString()
		},
		retirementName: params.retirementName,
		head,
		branch: params.branch,
		branchHead,
		indexSha256,
		index,
		...sharedIndex ? { sharedIndex } : {},
		files
	};
	const bytes = Buffer.from(JSON.stringify(metadata));
	await putBlob("manifest.json", bytes);
	return {
		metadata,
		digest: sha256(bytes),
		treeEntries,
		metadataEntries
	};
}
async function writeExactStateCommit(cwd, captured) {
	const tree = await requireGit(cwd, ["mktree", "-z"], { input: Buffer.from(captured.metadataEntries.join("")) });
	return await requireGit(cwd, [
		"commit-tree",
		tree,
		"-p",
		captured.metadata.branchHead,
		"-m",
		"OpenClaw worktree exact state v1"
	], { env: identity });
}
async function readExactStateSnapshot(cwd, snapshot, snapshotRef, options) {
	if (!snapshotRef.startsWith("refs/openclaw/snapshots/exact-v1/")) {
		if (snapshotRef.startsWith("refs/openclaw/snapshots/exact-")) throw new Error("Unsupported exact-state snapshot version; preserve the snapshot and use a compatible runtime");
		return;
	}
	const metadata = metadataSchema.parse(JSON.parse((await requireGitBuffer(cwd, ["show", `${snapshot}^2:manifest.json`], options)).toString("utf8")));
	for (const file of metadata.files) checkedPath(file.path);
	if (await requireGit(cwd, ["rev-parse", `${snapshot}^`], options) !== metadata.head || await requireGit(cwd, ["rev-parse", `${snapshot}^2^`], options) !== metadata.branchHead) throw new Error("Exact-state snapshot parent mismatch");
	return metadata;
}
/** A receipt owns an incarnation, not arbitrary files added during an interrupted attempt. */
async function assertExactRestorePaths(cwd, metadata, temporaryRoot, assertCurrent) {
	const allowed = new Set(metadata.files.map((entry) => entry.path));
	for (const entry of metadata.files) {
		const relative = checkedPath(entry.path);
		for (let slash = relative.indexOf(47); slash !== -1; slash = relative.indexOf(47, slash + 1)) allowed.add(relative.subarray(0, slash).toString("hex"));
	}
	const temporary = Buffer.from(path.basename(temporaryRoot));
	const pending = [Buffer.alloc(0)];
	while (pending.length) {
		const relative = pending.pop();
		assertCurrent();
		const entries = await fs$1.readdir(checkoutPathFromGitBytes(cwd, relative), {
			withFileTypes: true,
			encoding: "buffer"
		});
		for (const entry of entries) {
			if (!relative.length && (entry.name.equals(Buffer.from(".git")) || entry.name.equals(temporary))) continue;
			const child = relative.length ? Buffer.concat([
				relative,
				Buffer.from("/"),
				entry.name
			]) : entry.name;
			if (!allowed.has(child.toString("hex"))) throw new Error("Unexpected exact-state restore path; source and receipt preserved");
			if (entry.isDirectory()) pending.push(child);
		}
	}
	assertCurrent();
}
/** Worktree bytes are materialized through the native source-only Git checkout; restore metadata last. */
async function restoreExactStateMetadata(params) {
	const { checkoutPath: cwd, metadata, options, assertCurrent } = params;
	await assertExactRestorePaths(cwd, metadata, params.temporaryRoot, assertCurrent);
	const temporaryFiles = path.join(params.temporaryRoot, "files");
	await fs$1.mkdir(temporaryFiles, { recursive: true });
	for (const entry of metadata.files.filter((file) => file.kind === "directory").toSorted((a, b) => a.path.length - b.path.length)) {
		assertCurrent();
		const relative = checkedPath(entry.path);
		const assertParents = await checkParents(cwd, relative);
		assertCurrent();
		assertParents();
		fs.mkdirSync(checkoutPathFromGitBytes(cwd, relative), { recursive: true });
	}
	const rawFiles = metadata.files.filter((entry) => !entry.provisioned && (entry.kind === "file" || entry.kind === "symlink"));
	const algorithm = metadata.head.length === 64 ? "sha256" : "sha1";
	for (let offset = 0; offset < rawFiles.length;) {
		const batch = [];
		let bytes = 0;
		while (offset < rawFiles.length && (batch.length === 0 || batch.length < 128 && bytes + rawFiles[offset].size < 16777216)) {
			const entry = rawFiles[offset++];
			if (!entry.blob) throw new Error("Exact-state snapshot lacks file content");
			batch.push(entry);
			bytes += entry.size;
		}
		const output = await requireGitBuffer(cwd, ["cat-file", "--batch"], {
			...options,
			env: {
				...options?.env,
				GIT_NO_REPLACE_OBJECTS: "1"
			},
			input: Buffer.from(batch.map((entry) => entry.blob).join("\n") + "\n"),
			maxOutputBytes: {
				stdout: bytes + batch.length * 128,
				stderr: 65536
			},
			maxCombinedOutputBytes: bytes + batch.length * 128 + 65536
		});
		let cursor = 0;
		for (const entry of batch) {
			const end = output.indexOf(10, cursor);
			const header = output.subarray(cursor, end).toString("ascii");
			if (end < cursor || header !== `${entry.blob} blob ${entry.size}`) throw new Error("Exact-state file object mismatch");
			const content = output.subarray(end + 1, end + 1 + entry.size);
			if (content.length !== entry.size || output[end + 1 + entry.size] !== 10 || blobOid(content, algorithm) !== entry.blob) throw new Error("Exact-state file content mismatch");
			cursor = end + entry.size + 2;
			assertCurrent();
			const relative = checkedPath(entry.path);
			const assertParents = await checkParents(cwd, relative);
			const target = checkoutPathFromGitBytes(cwd, relative);
			const existing = await fs$1.lstat(target).catch((error) => {
				if (isMissingPathError(error)) return;
				throw error;
			});
			if (existing) {
				const existingBytes = entry.kind === "symlink" && existing.isSymbolicLink() ? await fs$1.readlink(target, { encoding: "buffer" }) : entry.kind === "file" && existing.isFile() ? await fs$1.readFile(target) : void 0;
				if (!existingBytes || !existingBytes.equals(content)) throw new Error("Incomplete exact restore source changed; source and receipt preserved");
				continue;
			}
			const temporary = path.join(temporaryFiles, createHash("sha256").update(entry.path).digest("hex"));
			if (entry.kind === "symlink") {
				assertCurrent();
				assertParents();
				fs.symlinkSync(content, target);
			} else {
				await fs$1.writeFile(temporary, content, {
					flag: "wx",
					mode: 384
				});
				assertCurrent();
				assertParents();
				fs.linkSync(temporary, target);
				fs.unlinkSync(temporary);
			}
		}
		if (cursor !== output.length) throw new Error("Unexpected trailing exact-state object bytes");
	}
	for (const entry of metadata.files.toSorted((a, b) => b.path.length - a.path.length)) {
		assertCurrent();
		if (entry.kind === "missing") {
			const relative = checkedPath(entry.path);
			const assertParents = await checkParents(cwd, relative, true);
			const exists = await fs$1.lstat(checkoutPathFromGitBytes(cwd, relative)).then(() => true, (error) => {
				if (isMissingPathError(error)) return false;
				throw error;
			});
			assertCurrent();
			assertParents();
			if (exists) throw new Error("Captured missing exact-state path changed; source and receipt preserved");
			continue;
		}
		const relative = checkedPath(entry.path);
		const assertParents = await checkParents(cwd, relative);
		const target = checkoutPathFromGitBytes(cwd, relative);
		const stat = await fs$1.lstat(target);
		const currentBytes = entry.kind === "symlink" && stat.isSymbolicLink() ? await fs$1.readlink(target, { encoding: "buffer" }) : entry.kind === "file" && stat.isFile() ? await fs$1.readFile(target) : void 0;
		if (entry.blob && (!currentBytes || blobOid(currentBytes, algorithm) !== entry.blob)) throw new Error("Exact-state restore bytes changed; source and receipt preserved");
		assertCurrent();
		assertParents();
		const current = fs.lstatSync(target);
		if (entry.kind !== "directory" && current.nlink !== 1) throw new Error("Exact-state restore hard-linked metadata target; source preserved");
		if (current.dev !== stat.dev || current.ino !== stat.ino) throw new Error("Exact-state metadata target changed; source preserved");
		if (entry.kind === "symlink") {
			if (!stat.isSymbolicLink()) throw new Error("Exact-state symlink restoration mismatch");
			fs.lutimesSync(target, entry.mtimeMs / 1e3, entry.mtimeMs / 1e3);
		} else {
			if (entry.kind === "directory" ? !stat.isDirectory() : !stat.isFile()) throw new Error("Exact-state file restoration mismatch");
			if (process.platform !== "win32") fs.chmodSync(target, entry.mode);
			fs.utimesSync(target, entry.mtimeMs / 1e3, entry.mtimeMs / 1e3);
		}
	}
	await assertExactRestorePaths(cwd, metadata, params.temporaryRoot, assertCurrent);
	const destination = await indexPath(cwd);
	const atomicIndexFile = async (target, bytes, mode, mtimeMs) => {
		const temporary = target + ".openclaw-" + path.basename(params.temporaryRoot);
		assertCurrent();
		await fs$1.writeFile(temporary, bytes, { mode });
		if (process.platform !== "win32") await fs$1.chmod(temporary, mode);
		if (mtimeMs !== void 0) await fs$1.utimes(temporary, mtimeMs / 1e3, mtimeMs / 1e3);
		assertCurrent();
		await fs$1.rename(temporary, target);
	};
	if (metadata.sharedIndex) {
		const bytes = await requireGitBuffer(cwd, [
			"cat-file",
			"blob",
			metadata.sharedIndex.blob
		], options);
		await atomicIndexFile(path.join(path.dirname(destination), metadata.sharedIndex.name), bytes, 384);
	}
	const index = await requireGitBuffer(cwd, [
		"cat-file",
		"blob",
		metadata.index.blob
	], options);
	if (sha256(index) !== metadata.indexSha256) throw new Error("Exact-state index digest mismatch");
	await atomicIndexFile(destination, index, metadata.index.mode, metadata.index.mtimeMs);
	assertCurrent();
}
//#endregion
export { writeExactStateCommit as a, inspectProvisionedFiles as c, resolveGitPath as d, restoreExactStateMetadata as i, lstatIfExists as l, exactSnapshotPrefix as n, hasSafeParentDirectories as o, readExactStateSnapshot as r, hasUnsnapshotableProvisionedFiles as s, captureExactState as t, normalizeProvisionedRelativePath as u };
