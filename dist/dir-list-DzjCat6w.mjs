import { C as parseStrictNonNegativeInteger, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as runCommandBuffered } from "./exec-DJvyCA0D.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import { i as resolveBoundReadDirectory, n as readAbsolutePath, o as statRequiredDirectory, t as classifyFsSafeReadError } from "./path-errors-TTz_zELr.mjs";
import { r as mimeFromExtension } from "./mime-2T0HwsBn.mjs";
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
	"const stat=fs.lstatSync(entry.name);return{name:entry.name,isDirectory:stat.isDirectory(),isFile:stat.isFile(),size:stat.size,mtimeMs:stat.mtimeMs};",
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
			if (!entry || typeof entry.name !== "string" || typeof entry.isDirectory !== "boolean" || typeof entry.isFile !== "boolean" || typeof entry.size !== "number" || typeof entry.mtimeMs !== "number") return {
				ok: false,
				code: "READ_ERROR"
			};
			entries.push({
				name: entry.name,
				isDirectory: entry.isDirectory,
				isFile: entry.isFile,
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
	const maxEntries = Math.min(Math.floor(asPositiveFiniteNumber(params.maxEntries) ?? DIR_LIST_DEFAULT_MAX_ENTRIES), DIR_LIST_HARD_MAX_ENTRIES);
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
	const truncated = offset + maxEntries < listing.total;
	const nextPageToken = truncated ? String(offset + maxEntries) : void 0;
	return {
		ok: true,
		path: canonical,
		entries: listing.entries.map((entry) => ({
			name: entry.name,
			path: path.join(canonical, entry.name),
			size: entry.isDirectory ? 0 : entry.size,
			mimeType: entry.isDirectory ? "inode/directory" : mimeFromExtension(entry.name),
			isDir: entry.isDirectory,
			isFile: entry.isFile,
			mtime: entry.mtimeMs
		})),
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
