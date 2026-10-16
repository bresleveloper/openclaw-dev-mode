import { c as isPathInside } from "./fs-safe-BUXBSN-4.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-B4yBUiAP.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, n as MAX_WORKSPACE_INVENTORY_ENTRIES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { g as workspacePathAncestors, i as MAX_RECONCILIATION_TOTAL_BYTES } from "./workspace-manifest-q-txD9ZU.mjs";
import { i as parseChangedWorkspaceResult } from "./workspace-manifest-comparison-BXiy_dh_.mjs";
import { p as decodeWorkspaceManifest, u as captureWorkspaceSnapshot } from "./workspace-reconcile-fs-DPrmhSwD.mjs";
import { a as assertWorkspaceMatchesManifest } from "./workspace-reconcile-DEtkg-5s.mjs";
import { i as readWorkspaceTransferPaths, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-6viatxYT.mjs";
import { o as probeWorkspaceGitMode } from "./workspace-sync-helpers-CJW1gdNZ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-workspace-transfer-snapshot.ts
const TRANSFER_TIMEOUT_MS = 6e5;
async function prepareNodeWorkspaceTransferSnapshot(params) {
	const root = await fs.realpath(params.localPath);
	const git = await probeWorkspaceGitMode({
		localPath: root,
		commandOptions: {
			timeoutMs: TRANSFER_TIMEOUT_MS,
			maxOutputBytes: 262144,
			maxCombinedOutputBytes: 524288,
			baseEnv: {
				...process.env,
				GIT_TERMINAL_PROMPT: "0",
				GIT_ASKPASS: ""
			},
			signal: params.signal
		},
		runTask: runCommandWithTimeout
	});
	let baseCommit = null;
	let includePaths;
	if (git.mode === "git") {
		if (await fs.realpath(git.gitRoot) !== root) throw new Error("Worker git workspace sync requires the managed worktree root");
		baseCommit = git.baseCommit;
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(baseCommit)) throw new Error("Worker workspace Git base is not a commit id");
		const transferList = await createWorkspaceGitTransferList({
			gitRoot: root,
			temporaryDirectory: path.join(params.temporaryRoot, "inventory"),
			signal: params.signal ?? AbortSignal.timeout(TRANSFER_TIMEOUT_MS),
			timeoutMs: TRANSFER_TIMEOUT_MS
		});
		const transferable = await readWorkspaceTransferPaths(transferList, params.signal);
		const manifestPaths = new Set(transferable);
		for (const relative of transferable) for (const ancestor of workspacePathAncestors(relative)) manifestPaths.add(ancestor);
		includePaths = manifestPaths;
	}
	return {
		...await captureWorkspaceSnapshot({
			root,
			baseCommit,
			includePaths,
			signal: params.signal
		}),
		root
	};
}
function nodeWorkspaceTransferEntryPath(root, relative) {
	const candidate = path.join(root, ...relative.split("/"));
	if (candidate !== root && !isPathInside(root, candidate)) throw new Error("Workspace transfer entry escaped its staging root");
	return candidate;
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-upload-reader.ts
const MAX_UPLOAD_BYTES = MAX_WORKSPACE_MANIFEST_BYTES * 2 + MAX_RECONCILIATION_TOTAL_BYTES + MAX_WORKSPACE_INVENTORY_ENTRIES * 8 + 8;
var NodeWorkspaceTransferLimitError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "workspace-transfer-limit";
	}
};
var NodeWorkspaceTransferInvalidError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.code = "workspace-transfer-invalid";
	}
};
function nodeWorkspaceTransferInvalidReason(error) {
	return error instanceof NodeWorkspaceTransferInvalidError ? error.reason : void 0;
}
var RequestByteReader = class {
	#iterator;
	#signal;
	#assertCurrent;
	#pending;
	#done;
	constructor(request, signal, assertCurrent) {
		this.#pending = Buffer.alloc(0);
		this.#done = false;
		this.bytesRead = 0;
		this.#iterator = request[Symbol.asyncIterator]();
		this.#signal = signal;
		this.#assertCurrent = assertCurrent;
	}
	async take(maxBytes) {
		this.#signal.throwIfAborted();
		if (this.#pending.length === 0 && !this.#done) {
			const next = await this.#iterator.next();
			this.#assertCurrent();
			this.#signal.throwIfAborted();
			this.#done = Boolean(next.done);
			if (!next.done) {
				if (!Buffer.isBuffer(next.value)) throw new NodeWorkspaceTransferInvalidError("payload", "Workspace transfer upload must contain binary data");
				this.#pending = next.value;
			}
		}
		if (this.#pending.length === 0) return Buffer.alloc(0);
		const count = Math.min(maxBytes, this.#pending.length);
		const value = this.#pending.subarray(0, count);
		this.#pending = count === this.#pending.length ? Buffer.alloc(0) : this.#pending.subarray(count);
		this.bytesRead += value.byteLength;
		if (this.bytesRead > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
		return value;
	}
	async readExactly(bytes) {
		const chunks = [];
		let remaining = bytes;
		while (remaining > 0) {
			const chunk = await this.take(remaining);
			if (chunk.length === 0) throw new NodeWorkspaceTransferInvalidError("premature_eof", "Workspace transfer upload ended before its declared payload");
			chunks.push(chunk);
			remaining -= chunk.length;
		}
		return Buffer.concat(chunks, bytes);
	}
	async assertEnd() {
		if ((await this.take(1)).length !== 0) throw new NodeWorkspaceTransferInvalidError("trailing_bytes", "Workspace transfer upload contains trailing bytes");
	}
};
async function streamUploadFile(params) {
	if ((await params.reader.readExactly(8)).readBigUInt64BE() !== BigInt(params.entry.size)) throw new NodeWorkspaceTransferInvalidError("file_size", "Workspace transfer file size differs from its manifest");
	const hash = createHash("sha256");
	let offset = 0;
	while (offset < params.entry.size) {
		const chunk = await params.reader.take(Math.min(65536, params.entry.size - offset));
		if (chunk.length === 0) throw new NodeWorkspaceTransferInvalidError("premature_eof", "Workspace transfer upload ended mid-file");
		hash.update(chunk);
		await writeFileWindowFully(params.handle, chunk, offset, { assertBeforeMutation: params.assertCurrent });
		params.assertCurrent();
		offset += chunk.length;
	}
	if (hash.digest("hex") !== params.entry.sha256) throw new NodeWorkspaceTransferInvalidError("file_digest", "Workspace transfer file digest differs from its manifest");
}
/** Stages one bounded upload before its context owner publishes the authenticated result. */
async function readNodeWorkspaceUpload(params) {
	const { assertCurrent } = params;
	let stagingRoot;
	try {
		assertCurrent();
		const contentLength = Number(params.request.headers["content-length"]);
		if (!Number.isSafeInteger(contentLength) || contentLength < 8 || contentLength > MAX_UPLOAD_BYTES) throw new NodeWorkspaceTransferLimitError("Workspace transfer upload exceeds its byte limit");
		const reader = new RequestByteReader(params.request, params.signal, assertCurrent);
		const readManifest = async (expectedRef) => {
			const bytes = (await reader.readExactly(4)).readUInt32BE();
			if (bytes < 2 || bytes > 67108864) throw new NodeWorkspaceTransferLimitError("Workspace transfer manifest exceeds its byte limit");
			const raw = (await reader.readExactly(bytes)).toString("utf8");
			try {
				const decoded = await decodeWorkspaceManifest(raw, expectedRef, params.signal);
				return {
					raw,
					ref: decoded.manifestRef,
					manifest: decoded.manifest
				};
			} catch (error) {
				if (error instanceof WorkerTaskError || params.signal.aborted && error === params.signal.reason) throw error;
				throw new NodeWorkspaceTransferInvalidError("manifest", "Workspace transfer manifest is invalid", { cause: error });
			}
		};
		const base = await readManifest(params.baseManifestRef);
		assertCurrent();
		const current = await readManifest();
		assertCurrent();
		let transferEntries;
		try {
			params.signal.throwIfAborted();
			transferEntries = parseChangedWorkspaceResult(base.manifest, current.manifest).entries;
		} catch (error) {
			if (params.signal.aborted && error === params.signal.reason) throw error;
			throw new NodeWorkspaceTransferInvalidError("manifest", "Workspace transfer manifests cannot be reconciled", { cause: error });
		}
		assertCurrent();
		stagingRoot = await fs.mkdtemp(path.join(params.temporaryRoot, "upload-"));
		for (const entry of transferEntries) try {
			const destination = nodeWorkspaceTransferEntryPath(stagingRoot, entry.path);
			await fs.mkdir(path.dirname(destination), {
				recursive: true,
				mode: 448
			});
			assertCurrent();
			if (entry.type === "symlink") {
				await fs.symlink(entry.target, destination);
				assertCurrent();
			} else {
				const handle = await fs.open(destination, "wx", entry.mode);
				try {
					await streamUploadFile({
						reader,
						handle,
						entry,
						assertCurrent
					});
				} finally {
					await handle.close();
				}
				assertCurrent();
			}
		} catch (error) {
			if (error instanceof NodeWorkspaceTransferInvalidError) throw error;
			if (params.signal.aborted || !params.isAuthorized()) throw error;
			throw new NodeWorkspaceTransferInvalidError("staging", "Workspace transfer payload could not be staged", { cause: error });
		}
		await reader.assertEnd();
		assertCurrent();
		if (reader.bytesRead !== contentLength) throw new NodeWorkspaceTransferInvalidError("content_length", "Workspace transfer upload length is inconsistent");
		try {
			await assertWorkspaceMatchesManifest({
				root: stagingRoot,
				manifest: current.manifest,
				entries: transferEntries
			});
		} catch (error) {
			if (error instanceof WorkerTaskError || params.signal.aborted && error === params.signal.reason) throw error;
			throw new NodeWorkspaceTransferInvalidError("staging", "Workspace transfer payload did not match its staged result", { cause: error });
		}
		assertCurrent();
		return {
			base: base.manifest,
			baseManifestRef: params.baseManifestRef,
			baseRaw: base.raw,
			current: current.manifest,
			currentManifestRef: current.ref,
			currentRaw: current.raw,
			stagingRoot
		};
	} catch (error) {
		if (stagingRoot) await fs.rm(stagingRoot, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
//#endregion
export { prepareNodeWorkspaceTransferSnapshot as a, nodeWorkspaceTransferEntryPath as i, nodeWorkspaceTransferInvalidReason as n, readNodeWorkspaceUpload as r, NodeWorkspaceTransferLimitError as t };
