import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import "./security-runtime-B2x5tet5.js";
import { t as consumeChildOutput } from "./child-output-CNOvMJ6_.js";
import { i as statRequiredDirectory, n as readAbsolutePath, r as resolveCanonicalReadPath, t as classifyFsSafeReadError } from "./path-errors-CXQr6BuD.js";
import path from "node:path";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/dir-fetch.ts
const DIR_FETCH_HARD_MAX_BYTES = 16 * 1024 * 1024;
const DIR_FETCH_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
function clampMaxBytes(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) return DIR_FETCH_DEFAULT_MAX_BYTES;
	return Math.min(Math.floor(input), DIR_FETCH_HARD_MAX_BYTES);
}
function classifyFsError(err) {
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	if (err?.code === "ENOENT") return "NOT_FOUND";
	return "READ_ERROR";
}
async function preflightDu(dirPath, maxBytes) {
	const heuristicKb = Math.ceil(maxBytes * 4 / 1024);
	return new Promise((resolve) => {
		const du = spawn("du", ["-sk", dirPath], { stdio: [
			"ignore",
			"pipe",
			"ignore"
		] });
		let output = "";
		let settled = false;
		const finish = (withinBudget) => {
			if (settled) return;
			settled = true;
			resolve(withinBudget);
		};
		const stopChild = () => {
			try {
				du.kill("SIGKILL");
			} catch {}
		};
		consumeChildOutput(du.stdout, {
			onData: (chunk) => {
				output += chunk.toString();
			},
			onError: () => {
				stopChild();
				finish(true);
			}
		});
		du.on("close", (code) => {
			if (code !== 0) {
				finish(true);
				return;
			}
			const match = /^(\d+)/.exec(output.trim());
			if (!match) {
				finish(true);
				return;
			}
			const sizeKb = Number.parseInt(match[1], 10);
			finish(sizeKb <= heuristicKb);
		});
		du.on("error", () => {
			finish(true);
		});
	});
}
async function listTarEntries(tarBuffer) {
	return new Promise((resolve) => {
		const child = spawn("tar", ["-tzf", "-"], { stdio: [
			"pipe",
			"pipe",
			"ignore"
		] });
		let stdoutBuf = "";
		let settled = false;
		const finish = (entries) => {
			if (settled) return;
			settled = true;
			clearTimeout(watchdog);
			resolve(entries);
		};
		const stopChild = () => {
			try {
				child.kill("SIGKILL");
			} catch {}
		};
		const watchdog = setTimeout(() => {
			stopChild();
			finish(null);
		}, 1e4);
		consumeChildOutput(child.stdout, {
			onData: (chunk) => {
				if (settled) return;
				stdoutBuf += chunk.toString();
				if (stdoutBuf.length > 32 * 1024 * 1024) {
					stopChild();
					finish(null);
				}
			},
			onError: () => {
				stopChild();
				finish(null);
			}
		});
		child.on("close", (code) => {
			if (settled) return;
			if (code !== 0) {
				finish(null);
				return;
			}
			const lines = stdoutBuf.split("\n").map((line) => line.replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/\/$/u, "")).filter((line) => line.length > 0);
			finish(lines);
		});
		child.on("error", () => {
			finish(null);
		});
		child.stdin.on("error", (error) => {
			if (settled && error.code === "EPIPE") return;
			stopChild();
			finish(null);
		});
		child.stdin.end(tarBuffer);
	});
}
async function createTarArchive(canonicalPath, maxBytes) {
	const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
	const tarArgs = [
		"-czf",
		"-",
		"-C",
		canonicalPath,
		"."
	];
	const timeoutMs = 6e4;
	return await new Promise((resolve) => {
		const child = spawn(tarBin, tarArgs, { stdio: [
			"ignore",
			"pipe",
			"ignore"
		] });
		const chunks = [];
		let totalBytes = 0;
		let settled = false;
		const finish = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(watchdog);
			resolve(result);
		};
		const stopChild = (signal) => {
			try {
				child.kill(signal);
			} catch {}
		};
		const watchdog = setTimeout(() => {
			stopChild("SIGKILL");
			finish("TIMEOUT");
		}, timeoutMs);
		consumeChildOutput(child.stdout, {
			onData: (chunk) => {
				if (settled) return;
				totalBytes += chunk.byteLength;
				if (totalBytes > maxBytes) {
					stopChild("SIGTERM");
					finish("TOO_LARGE");
					return;
				}
				chunks.push(chunk);
			},
			onError: () => {
				stopChild("SIGKILL");
				finish("ERROR");
			}
		});
		child.on("close", (code) => {
			if (settled) return;
			finish(code === 0 ? Buffer.concat(chunks) : "ERROR");
		});
		child.on("error", () => {
			finish("ERROR");
		});
	});
}
async function listTreeEntries(root$1, maxEntries) {
	const results = [];
	const rootHandle = await root(root$1);
	async function visit(relativeDir) {
		const entries = await rootHandle.list(relativeDir, { withFileTypes: true });
		entries.sort((left, right) => left.name.localeCompare(right.name));
		for (const entry of entries) {
			const rel = path.posix.join(relativeDir === "." ? "" : relativeDir, entry.name);
			results.push(rel);
			if (results.length > maxEntries) return false;
			if (entry.isDirectory) {
				if (!await visit(rel)) return false;
			}
		}
		return true;
	}
	return await visit(".") ? results : "TOO_MANY";
}
async function handleDirFetch(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const maxBytes = clampMaxBytes(params.maxBytes);
	params.includeDotfiles;
	const followSymlinks = params.followSymlinks === true;
	const preflightOnly = params.preflightOnly === true;
	const canonical = await resolveCanonicalReadPath({
		requestedPath,
		followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "directory not found"
	});
	if (typeof canonical !== "string") return canonical;
	const directory = await statRequiredDirectory(canonical, classifyFsError);
	if (!directory.ok) return directory;
	if (preflightOnly) try {
		const entries = await listTreeEntries(canonical, 5e3);
		if (entries === "TOO_MANY") return {
			ok: false,
			code: "TREE_TOO_LARGE",
			message: "directory tree exceeds 5000 entries during preflight",
			canonicalPath: canonical
		};
		return {
			ok: true,
			path: canonical,
			tarBase64: "",
			tarBytes: 0,
			sha256: "",
			fileCount: entries.length,
			entries,
			preflightOnly: true
		};
	} catch (err) {
		return {
			ok: false,
			code: classifyFsError(err),
			message: `preflight readdir failed: ${String(err)}`,
			canonicalPath: canonical
		};
	}
	if (!await preflightDu(canonical, maxBytes)) return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `directory tree exceeds estimated size limit (${maxBytes} bytes raw)`,
		canonicalPath: canonical
	};
	const tarBuffer = await createTarArchive(canonical, maxBytes);
	if (tarBuffer === "TOO_LARGE") return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `tarball exceeded ${maxBytes} byte limit mid-stream`,
		canonicalPath: canonical
	};
	if (tarBuffer === "TIMEOUT") return {
		ok: false,
		code: "READ_ERROR",
		message: "tar command exceeded 60s wall-clock timeout (slow filesystem or symlink loop?)",
		canonicalPath: canonical
	};
	if (tarBuffer === "ERROR") return {
		ok: false,
		code: "READ_ERROR",
		message: "tar command failed",
		canonicalPath: canonical
	};
	const sha256 = crypto.createHash("sha256").update(tarBuffer).digest("hex");
	const tarBase64 = tarBuffer.toString("base64");
	const tarBytes = tarBuffer.byteLength;
	const entries = await listTarEntries(tarBuffer);
	if (entries === null) return {
		ok: false,
		code: "READ_ERROR",
		message: "tar entry listing failed",
		canonicalPath: canonical
	};
	return {
		ok: true,
		path: canonical,
		tarBase64,
		tarBytes,
		sha256,
		fileCount: entries.length,
		entries
	};
}
//#endregion
export { handleDirFetch };
