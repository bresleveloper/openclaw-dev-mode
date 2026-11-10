import { u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as runCommandBuffered } from "./exec-Bf6uhUA7.mjs";
import { n as ArchiveLimitError } from "./archive-R2ClviiB.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./security-runtime-6domDoE8.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./archive-D3lhZQjN.mjs";
import { a as DIR_FETCH_MAX_ENTRIES, i as DIR_FETCH_HARD_MAX_BYTES, n as inspectDirFetchArchive } from "./dir-fetch-archive-D6NUi15v.mjs";
import { n as matchesFileIdentity } from "./path-binding-CQKpF62F.mjs";
import { i as resolveBoundReadDirectory, n as readAbsolutePath, o as statRequiredDirectory, t as classifyFsSafeReadError } from "./path-errors-Brf_STAe.mjs";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/file-transfer/src/node-host/dir-fetch-archive.ts
const CANONICAL_PATH_CHANGED_EXIT_CODE = 78;
const CANONICAL_TAR_WORKER = [
	"(()=>{",
	"const fs=require(\"node:fs\");",
	"const {spawn}=require(\"node:child_process\");",
	"const [directory,expected,device,inode,tar]=process.argv.slice(1);",
	"try{process.chdir(directory);}catch{process.exitCode=1;return;}",
	"if(fs.realpathSync(\".\")!==expected){process.exitCode=78;return;}",
	"const bound=fs.statSync(\".\",{bigint:true});",
	"if(String(bound.dev)!==device||String(bound.ino)!==inode){process.exitCode=78;return;}",
	"const child=spawn(tar,[\"-czf\",\"-\",\".\"],{stdio:[\"ignore\",\"inherit\",\"inherit\"]});",
	"let failed=false;",
	"child.once(\"error\",()=>{failed=true;});",
	"child.once(\"close\",code=>{process.exitCode=failed?1:(code??1);});",
	"})();"
].join("");
async function createTarArchive(directoryPath, expectedCanonicalPath, expectedDevice, expectedInode, maxBytes) {
	const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
	const result = await runCommandBuffered([
		process.execPath,
		"-e",
		CANONICAL_TAR_WORKER,
		directoryPath,
		expectedCanonicalPath,
		expectedDevice,
		expectedInode,
		tarBin
	], {
		discardOutput: { stderr: true },
		maxOutputBytes: {
			stdout: maxBytes,
			stderr: 65536
		},
		timeoutMs: 6e4
	}).catch(() => null);
	if (!result) return "ERROR";
	if (result.termination === "timeout") return "TIMEOUT";
	if (result.termination === "output-limit" && result.outputLimitStream === "stdout") return "TOO_LARGE";
	if (result.termination === "exit" && result.code === CANONICAL_PATH_CHANGED_EXIT_CODE) return "CANONICAL_PATH_CHANGED";
	return result.termination === "exit" && result.code === 0 ? result.stdout : "ERROR";
}
//#endregion
//#region extensions/file-transfer/src/node-host/dir-fetch.ts
function classifyFsError(err) {
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	if (err?.code === "ENOENT") return "NOT_FOUND";
	return "READ_ERROR";
}
async function preflightDu(dirPath, maxBytes) {
	const heuristicKb = Math.ceil(maxBytes * 4 / 1024);
	const result = await runCommandBuffered([
		"du",
		"-sk",
		dirPath
	], {
		discardOutput: { stderr: true },
		maxOutputBytes: 65536,
		timeoutMs: 1e4
	}).catch(() => null);
	if (!result || result.termination !== "exit" || result.code !== 0) return true;
	const match = /^(\d+)/.exec(result.stdout.toString("utf8").trim());
	return match ? Number.parseInt(match[0], 10) <= heuristicKb : true;
}
async function listTreeEntries(root$1, maxEntries, expectedIdentity) {
	const results = [];
	const rootHandle = await root(root$1);
	const boundStats = await fs.stat(rootHandle.rootReal, { bigint: true });
	if (!matchesFileIdentity(boundStats, expectedIdentity)) throw Object.assign(/* @__PURE__ */ new Error("filesystem identity differs from the authorized target"), { code: "CANONICAL_PATH_CHANGED" });
	async function visit(relativeDir) {
		const entries = await rootHandle.list(relativeDir, { withFileTypes: true });
		for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name) || (left.name < right.name ? -1 : 1))) {
			const relativePath = path.posix.join(relativeDir, entry.name);
			results.push(relativePath);
			if (results.length > maxEntries) return false;
			if (entry.isDirectory && !await visit(relativePath)) return false;
		}
		return true;
	}
	return await visit(".") ? results : "TOO_MANY";
}
async function handleDirFetch(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const maxBytes = Math.min(Math.floor(asPositiveFiniteNumber(params.maxBytes) ?? 8388608), DIR_FETCH_HARD_MAX_BYTES);
	const followSymlinks = params.followSymlinks === true;
	const preflightOnly = params.preflightOnly === true;
	const directory = await resolveBoundReadDirectory({
		requestedPath,
		followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "directory not found",
		expectedCanonicalPath: params.expectedCanonicalPath,
		expectedBinding: params.expectedBinding
	});
	if (!directory.ok) return directory;
	const { canonicalPath: canonical, identity } = directory;
	let preflightEntries;
	if (preflightOnly) {
		let entries;
		try {
			entries = await listTreeEntries(canonical, DIR_FETCH_MAX_ENTRIES, identity);
		} catch (err) {
			return {
				ok: false,
				code: (err && typeof err === "object" && "code" in err ? err.code : void 0) === "CANONICAL_PATH_CHANGED" ? "CANONICAL_PATH_CHANGED" : classifyFsError(err),
				message: `preflight readdir failed: ${String(err)}`,
				canonicalPath: canonical
			};
		}
		if (entries === "TOO_MANY") return {
			ok: false,
			code: "TREE_TOO_LARGE",
			message: "directory tree exceeds 5000 entries during preflight",
			canonicalPath: canonical
		};
		preflightEntries = entries;
	} else if (!await preflightDu(canonical, maxBytes)) return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `directory tree exceeds estimated size limit (${maxBytes} bytes raw)`,
		canonicalPath: canonical
	};
	const tarBuffer = await createTarArchive(canonical, canonical, identity.device, identity.inode, maxBytes);
	if (tarBuffer === "TOO_LARGE") return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `tarball exceeded ${maxBytes} byte limit ${preflightOnly ? "during preflight" : "mid-stream"}`,
		canonicalPath: canonical
	};
	if (tarBuffer === "TIMEOUT") return {
		ok: false,
		code: "READ_ERROR",
		message: "tar command exceeded 60s wall-clock timeout (slow filesystem or symlink loop?)",
		canonicalPath: canonical
	};
	if (tarBuffer === "CANONICAL_PATH_CHANGED") return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "resolved path differs from the authorized target",
		canonicalPath: canonical
	};
	if (tarBuffer === "ERROR") {
		if (preflightOnly) {
			const currentDirectory = await statRequiredDirectory(canonical, classifyFsError);
			if (!currentDirectory.ok) return currentDirectory;
		}
		return {
			ok: false,
			code: "READ_ERROR",
			message: "tar command failed",
			canonicalPath: canonical
		};
	}
	if (preflightEntries) return {
		ok: true,
		path: canonical,
		tarBase64: "",
		tarBytes: 0,
		sha256: "",
		fileCount: preflightEntries.length,
		entries: preflightEntries,
		preflightOnly: true,
		binding: {
			kind: "existing",
			...identity
		}
	};
	const sha256 = crypto.createHash("sha256").update(tarBuffer).digest("hex");
	const tarBase64 = tarBuffer.toString("base64");
	const tarBytes = tarBuffer.byteLength;
	let entries;
	try {
		entries = await inspectDirFetchArchive(tarBuffer, 1e4);
	} catch (error) {
		return {
			ok: false,
			code: error instanceof ArchiveLimitError ? "TREE_TOO_LARGE" : "READ_ERROR",
			message: `archive inspection failed: ${formatErrorMessage(error)}`,
			canonicalPath: canonical
		};
	}
	return {
		ok: true,
		path: canonical,
		tarBase64,
		tarBytes,
		sha256,
		fileCount: entries.length,
		entries,
		binding: {
			kind: "existing",
			...identity
		}
	};
}
//#endregion
export { handleDirFetch as t };
