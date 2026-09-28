import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { i as requestGitWorkerEffect } from "./git-worker-context-Cywc-SH2.mjs";
import { d as stagedInputPathDirectory, i as createStagedInputPathMatcher } from "./staged-inputs-De-HBXyz.mjs";
import { n as MAX_WORKSPACE_INVENTORY_ENTRIES, t as MAX_WORKSPACE_GIT_CANDIDATES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { a as gitFileMode, h as isDerivedWorkspacePath } from "./workspace-manifest-453LPGpv.mjs";
import { t as workspaceInventoryError } from "./workspace-inventory-error-CmipulKw.mjs";
import { t as isPortableRootContainedSymlink } from "./workspace-actual-manifest-B9Vi3bLN.mjs";
import { createReadStream, lstatSync, readlinkSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-inventory-computation.runtime.ts
/** Exact rsync exemptions, prepared once without walking input file contents. */
async function readStagedInputDirectories(rootDir) {
	const root$1 = await root(rootDir);
	const inbound = await root$1.stat("media/inbound").catch(() => void 0);
	if (!inbound?.isDirectory || inbound.isSymbolicLink) return [];
	const isStagedInput = createStagedInputPathMatcher(root$1);
	const directories = [];
	let candidates = 0;
	for await (const entry of await fs$1.opendir(path.join(rootDir, "media/inbound"))) {
		if (++candidates > 25e4) throw workspaceInventoryError("Cloud workspace has too many entries");
		const directory = stagedInputPathDirectory(`media/inbound/${entry.name}`);
		if (entry.isDirectory() && directory && await isStagedInput(directory)) directories.push(directory);
	}
	return directories.toSorted();
}
async function writeChunk(value) {
	await requestGitWorkerEffect({
		type: "workspace.inventory.write",
		input: { bytes: Uint8Array.from(Buffer.from(value)) }
	});
}
function assertWorkerWorkspaceInventoryValues(manifestEntries, manifestPathBytes, transferPathBytes, manifestBytes, eligibleBytes) {
	if (manifestEntries > 25e4) throw workspaceInventoryError(`Cloud workspace inventory exceeds ${MAX_WORKSPACE_INVENTORY_ENTRIES} manifest entries; reduce eligible files or narrow .worktreeinclude`);
	if (manifestPathBytes > 67108864) throw workspaceInventoryError("Cloud workspace manifest paths exceed the 64 MiB metadata limit; reduce eligible files or shorten their paths");
	if (transferPathBytes > 67108864) throw workspaceInventoryError("Cloud workspace eligible paths exceed the 64 MiB metadata limit; reduce eligible files or narrow .worktreeinclude");
	if (manifestBytes > 67108864) throw workspaceInventoryError("Cloud workspace manifest exceeds the 64 MiB limit; reduce eligible files or shorten their paths");
	if (eligibleBytes > 4294967296) throw workspaceInventoryError("Cloud workspace eligible content exceeds the 4 GiB limit; remove large eligible files or ignore them");
}
function inventoryEntryJson(entry) {
	if (entry.type === "directory") return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: 448
	});
	if (entry.type === "symlink") return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: 511,
		target: entry.target
	});
	return JSON.stringify({
		path: entry.path,
		type: entry.type,
		mode: gitFileMode(entry.mode),
		size: entry.size,
		sha256: "0".repeat(64)
	});
}
var WorkerWorkspaceInventoryBudget = class {
	#paths = /* @__PURE__ */ new Set();
	#emptyManifestBytes = Buffer.byteLength(JSON.stringify({
		version: 1,
		baseCommit: "0".repeat(64),
		entries: []
	}));
	#manifestPathBytes = 0;
	#transferPathBytes = 0;
	#manifestEntryBytes = 0;
	#eligibleBytes = 0;
	#assert() {
		const manifestEntries = this.#paths.size;
		assertWorkerWorkspaceInventoryValues(manifestEntries, this.#manifestPathBytes, this.#transferPathBytes, this.#emptyManifestBytes + this.#manifestEntryBytes + Math.max(0, manifestEntries - 1), this.#eligibleBytes);
	}
	addTransferPath(entryPath) {
		this.#transferPathBytes += Buffer.byteLength(entryPath) + 1;
		this.#assert();
	}
	addEntry(entry) {
		if (this.#paths.has(entry.path)) return;
		this.#paths.add(entry.path);
		this.#manifestPathBytes += Buffer.byteLength(entry.path);
		this.#eligibleBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		this.#manifestEntryBytes += Buffer.byteLength(inventoryEntryJson(entry));
		this.#assert();
	}
};
function validateGitRelativePath(file) {
	if (!file || path.posix.isAbsolute(file) || path.posix.normalize(file) !== file || file === ".." || file.startsWith("../")) throw new Error("Worker workspace git file list contains an unsafe path");
	return file;
}
async function* readBoundedGitPathCandidates(filePath) {
	let pending = Buffer.alloc(0);
	let candidateCount = 0;
	let pathBytes = 0;
	for await (const value of createReadStream(filePath)) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		pathBytes += chunk.byteLength;
		if (pathBytes > 67108864) throw workspaceInventoryError("Cloud workspace Git path metadata exceeds the 64 MiB limit");
		const buffer = pending.length === 0 ? chunk : Buffer.concat([pending, chunk]);
		let offset = 0;
		for (;;) {
			const separator = buffer.indexOf(0, offset);
			if (separator < 0) break;
			candidateCount += 1;
			if (candidateCount > 1e6) throw workspaceInventoryError(`Cloud workspace Git path candidates exceed the ${MAX_WORKSPACE_GIT_CANDIDATES} limit`);
			yield validateGitRelativePath(buffer.subarray(offset, separator).toString("utf8"));
			offset = separator + 1;
		}
		pending = Buffer.from(buffer.subarray(offset));
	}
	if (pending.length > 0) throw new Error("Worker workspace git file list is not NUL terminated");
}
async function selectTransferPaths(params) {
	const canonicalRoot = await fs$1.realpath(params.gitRoot);
	const isStagedInput = createStagedInputPathMatcher(await root(canonicalRoot));
	const budget = new WorkerWorkspaceInventoryBudget();
	const transferredPaths = /* @__PURE__ */ new Set();
	let buffered = [];
	let bufferedBytes = 0;
	const flush = async () => {
		if (buffered.length === 0) return;
		await writeChunk(buffered.join(""));
		buffered = [];
		bufferedBytes = 0;
	};
	const inspectFile = async (file) => {
		if (isDerivedWorkspacePath(file, await isStagedInput(file)) || transferredPaths.has(file)) return;
		const absolute = path.join(canonicalRoot, file);
		const stats = (() => {
			try {
				return lstatSync(absolute);
			} catch (error) {
				if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
				throw error;
			}
		})();
		if (!stats || !stats.isFile() && !stats.isSymbolicLink()) return;
		if (stats.isSymbolicLink()) {
			const symlinkTarget = readlinkSync(absolute);
			if (!isPortableRootContainedSymlink(canonicalRoot, file, symlinkTarget)) throw workspaceInventoryError(`Cloud workspace symlink is not portable or escapes the sync root: ${sliceUtf16Safe(file, 0, 160)}`);
			return {
				path: file,
				type: "symlink",
				target: symlinkTarget
			};
		}
		return {
			path: file,
			type: "file",
			mode: stats.mode & 511,
			size: stats.size
		};
	};
	const append = async (entry) => {
		const file = entry.path;
		if (transferredPaths.has(file)) return;
		transferredPaths.add(file);
		const segments = file.split("/");
		for (let index = 1; index < segments.length; index += 1) budget.addEntry({
			path: segments.slice(0, index).join("/"),
			type: "directory"
		});
		budget.addEntry(entry);
		budget.addTransferPath(file);
		const record = `${file}\0`;
		buffered.push(record);
		bufferedBytes += Buffer.byteLength(record);
		if (bufferedBytes >= 65536) await flush();
	};
	async function* candidates() {
		yield* readBoundedGitPathCandidates(params.eligiblePath);
		const selected = readBoundedGitPathCandidates(params.selectedPath);
		try {
			let selectedItem = await selected.next();
			for await (const file of readBoundedGitPathCandidates(params.ignoredPath)) {
				while (!selectedItem.done && Buffer.compare(Buffer.from(selectedItem.value), Buffer.from(file)) < 0) selectedItem = await selected.next();
				if (await isStagedInput(file) || !selectedItem.done && selectedItem.value === file) yield file;
			}
			while (!selectedItem.done) selectedItem = await selected.next();
		} finally {
			await selected.return(void 0);
		}
	}
	for await (const file of candidates()) {
		const entry = await inspectFile(file);
		if (entry) await append(entry);
	}
	await flush();
}
async function filterExistingPaths(params) {
	let records = [];
	let bytes = 0;
	const flush = async () => {
		if (records.length) {
			await writeChunk(records.join(""));
			records = [];
			bytes = 0;
		}
	};
	for await (const file of readBoundedGitPathCandidates(params.preparedListPath)) {
		let stats;
		try {
			stats = lstatSync(path.join(params.gitRoot, file));
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		}
		if (stats?.isFile() || stats?.isSymbolicLink()) {
			const record = `${file}\0`;
			records.push(record);
			bytes += Buffer.byteLength(record);
			if (bytes >= 65536) await flush();
		}
	}
	await flush();
}
async function executeWorkspaceInventoryComputation(command) {
	switch (command.type) {
		case "workspace.inventory.staged-directories": return await readStagedInputDirectories(command.input.rootDir);
		case "workspace.inventory.select": return await selectTransferPaths(command.input);
		case "workspace.inventory.existing": return await filterExistingPaths(command.input);
		case "workspace.inventory.paths": {
			const paths = /* @__PURE__ */ new Set();
			for await (const entry of readBoundedGitPathCandidates(command.input.filePath)) paths.add(entry);
			return paths;
		}
	}
}
//#endregion
export { executeWorkspaceInventoryComputation };
