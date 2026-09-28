import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { i as resolveBoundReadDirectory, n as readAbsolutePath, o as statRequiredDirectory, t as classifyFsSafeReadError } from "./path-errors-nBD272aa.mjs";
import { r as mimeFromExtension } from "./mime-moBZOjgf.mjs";
import path from "node:path";
//#region extensions/file-transfer/src/node-host/dir-list-worker-command.ts
const DIR_LIST_WORKER = [
	"const fs=require(\"node:fs\");",
	"const [directory,expected,device,inode,offsetText,maxText]=process.argv.slice(1);",
	"try{",
	"process.chdir(directory);",
	"if(fs.realpathSync(\".\")!==expected)process.exit(78);",
	"const bound=fs.statSync(\".\",{bigint:true});",
	"if(String(bound.dev)!==device||String(bound.ino)!==inode)process.exit(78);",
	"const all=fs.readdirSync(\".\",{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name));",
	"const offset=Number(offsetText),max=Number(maxText);",
	"const entries=all.slice(offset,offset+max).map(entry=>{",
	"const stat=fs.lstatSync(entry.name);return{name:entry.name,isDirectory:stat.isDirectory(),size:stat.size,mtimeMs:stat.mtimeMs};",
	"});",
	"process.stdout.write(JSON.stringify({entries,total:all.length}));",
	"}catch{process.exit(1);}"
].join("");
function createCanonicalDirListCommand(input) {
	return [
		process.execPath,
		"-e",
		DIR_LIST_WORKER,
		input.directoryPath,
		input.expectedCanonicalPath,
		input.expectedDevice,
		input.expectedInode,
		String(input.offset),
		String(input.maxEntries)
	];
}
//#endregion
//#region extensions/file-transfer/src/node-host/dir-list-worker.ts
const CANONICAL_PATH_CHANGED_EXIT_CODE = 78;
const DIR_LIST_MAX_OUTPUT_BYTES = 8388608;
async function listCanonicalDirectory(input) {
	const result = await runCommandBuffered(createCanonicalDirListCommand(input), {
		discardOutput: { stderr: true },
		maxOutputBytes: {
			stdout: DIR_LIST_MAX_OUTPUT_BYTES,
			stderr: 65536
		},
		timeoutMs: 6e4
	}).catch(() => null);
	if (result?.termination === "exit" && result.code === CANONICAL_PATH_CHANGED_EXIT_CODE) return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED"
	};
	if (!result || result.termination !== "exit" || result.code !== 0) return {
		ok: false,
		code: "READ_ERROR"
	};
	try {
		const parsed = asNullableRecord(JSON.parse(result.stdout.toString("utf8")));
		if (!parsed || !Array.isArray(parsed.entries) || typeof parsed.total !== "number") return {
			ok: false,
			code: "READ_ERROR"
		};
		const entries = [];
		for (const value of parsed.entries) {
			const entry = asNullableRecord(value);
			if (!entry || typeof entry.name !== "string" || typeof entry.isDirectory !== "boolean" || typeof entry.size !== "number" || typeof entry.mtimeMs !== "number") return {
				ok: false,
				code: "READ_ERROR"
			};
			entries.push({
				name: entry.name,
				isDirectory: entry.isDirectory,
				size: entry.size,
				mtimeMs: entry.mtimeMs
			});
		}
		return {
			ok: true,
			entries,
			total: parsed.total
		};
	} catch {
		return {
			ok: false,
			code: "READ_ERROR"
		};
	}
}
//#endregion
//#region extensions/file-transfer/src/node-host/dir-list.ts
const DIR_LIST_DEFAULT_MAX_ENTRIES = 200;
const DIR_LIST_HARD_MAX_ENTRIES = 5e3;
function clampMaxEntries(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) return DIR_LIST_DEFAULT_MAX_ENTRIES;
	return Math.min(Math.floor(input), DIR_LIST_HARD_MAX_ENTRIES);
}
function parsePageOffset(input) {
	if (typeof input !== "string") return 0;
	return parseStrictNonNegativeInteger(input) ?? 0;
}
function classifyFsError(err) {
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	const code = err?.code;
	if (code === "ENOENT") return "NOT_FOUND";
	if (code === "EACCES" || code === "EPERM") return "PERMISSION_DENIED";
	return "READ_ERROR";
}
async function handleDirList(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const maxEntries = clampMaxEntries(params.maxEntries);
	const offset = parsePageOffset(params.pageToken);
	const followSymlinks = params.followSymlinks === true;
	const directory = await resolveBoundReadDirectory({
		requestedPath,
		followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "path not found",
		expectedCanonicalPath: params.expectedCanonicalPath,
		expectedBinding: params.expectedBinding
	});
	if (!directory.ok) return directory;
	const { canonicalPath: canonical, identity } = directory;
	if (params.preflightOnly === true) return {
		ok: true,
		path: canonical,
		entries: [],
		truncated: false,
		preflight: true,
		binding: {
			kind: "existing",
			...identity
		}
	};
	const listing = await listCanonicalDirectory({
		directoryPath: canonical,
		expectedCanonicalPath: canonical,
		expectedDevice: identity.device,
		expectedInode: identity.inode,
		maxEntries,
		offset
	});
	if (!listing.ok) {
		if (listing.code === "CANONICAL_PATH_CHANGED") return {
			ok: false,
			code: "CANONICAL_PATH_CHANGED",
			message: "canonical path differs from the authorized target",
			canonicalPath: canonical
		};
		const currentDirectory = await statRequiredDirectory(canonical, classifyFsError);
		if (!currentDirectory.ok) return currentDirectory;
		return {
			ok: false,
			code: "READ_ERROR",
			message: "list failed",
			canonicalPath: canonical
		};
	}
	const total = listing.total;
	const page = listing.entries;
	const truncated = offset + maxEntries < total;
	const nextPageToken = truncated ? String(offset + maxEntries) : void 0;
	const entries = [];
	for (const entry of page) {
		const entryPath = path.join(canonical, entry.name);
		const isDir = entry.isDirectory;
		entries.push({
			name: entry.name,
			path: entryPath,
			size: isDir ? 0 : entry.size,
			mimeType: isDir ? "inode/directory" : mimeFromExtension(entry.name),
			isDir,
			mtime: entry.mtimeMs
		});
	}
	return {
		ok: true,
		path: canonical,
		entries,
		nextPageToken,
		truncated,
		binding: {
			kind: "existing",
			...identity
		}
	};
}
//#endregion
export { handleDirList };
