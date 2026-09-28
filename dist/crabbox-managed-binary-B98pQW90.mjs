import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/crabbox/src/crabbox-managed-binary.ts
const CRABBOX_MIN_VERSION = "0.56.0";
const RELEASE_URL = `https://github.com/openclaw/crabbox/releases/download/v${CRABBOX_MIN_VERSION}`;
const MAX_ARCHIVE_BYTES = 134217728;
const VERSION_TIMEOUT_MS = 5e3;
const DOWNLOAD_IDLE_TIMEOUT_MS = 3e4;
const DOWNLOAD_TOTAL_TIMEOUT_MS = 6e5;
async function probeCrabboxVersion(binary, runCommand = runCommandWithTimeout, signal) {
	signal?.throwIfAborted();
	let result;
	try {
		result = await runCommand([binary, "--version"], {
			killProcessTree: true,
			maxOutputBytes: 65536,
			timeoutMs: VERSION_TIMEOUT_MS,
			...signal ? { signal } : {}
		});
	} catch {
		signal?.throwIfAborted();
		return {
			status: "indeterminate",
			reason: "version command could not start"
		};
	}
	signal?.throwIfAborted();
	if (result.termination !== "exit" || result.code !== 0 || result.outputLimitExceeded) return {
		status: "indeterminate",
		reason: result.outputLimitExceeded ? "version output exceeded 64 KiB" : result.termination === "timeout" ? `version command timed out after ${VERSION_TIMEOUT_MS} ms` : `version command failed (${result.termination}, code ${result.code ?? "unknown"})`
	};
	const match = /(?:^|\s)v?((\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:\s|$)/u.exec(`${result.stdout}\n${result.stderr}`);
	if (!match) return {
		status: "indeterminate",
		reason: "version output was not recognized"
	};
	const current = [
		Number(match[2]),
		Number(match[3]),
		Number(match[4])
	];
	if (current.some((part) => !Number.isSafeInteger(part))) return {
		status: "indeterminate",
		reason: "version output was not recognized"
	};
	const minimum = CRABBOX_MIN_VERSION.split(".").map(Number);
	const difference = current.findIndex((part, index) => part !== minimum[index]);
	return {
		status: (difference === -1 ? !match[5] : current[difference] > minimum[difference]) ? "supported" : "outdated",
		version: match[1]
	};
}
function releaseTarget() {
	const platform = process.platform === "win32" ? "windows" : process.platform;
	const arch = process.arch === "x64" ? "amd64" : process.arch;
	if (![
		"darwin",
		"linux",
		"windows"
	].includes(platform) || !["amd64", "arm64"].includes(arch)) throw new Error(`Crabbox has no managed release for ${process.platform}/${process.arch}`);
	const extension = platform === "windows" ? "zip" : "tar.gz";
	return {
		directory: `${platform}-${arch}`,
		executable: platform === "windows" ? "crabbox.exe" : "crabbox",
		asset: `crabbox_${CRABBOX_MIN_VERSION}_${platform}_${arch}.${extension}`,
		tar: extension === "tar.gz"
	};
}
function resolveManagedCrabboxBinaryPath(env = process.env) {
	const target = releaseTarget();
	return path.join(resolveStateDir(env), "tools", "crabbox", CRABBOX_MIN_VERSION, target.directory, target.executable);
}
async function downloadReleaseFile(destination, name, maxBytes, signal) {
	const [{ buildTimeoutAbortSignal }, { fetchWithSsrFGuard }] = await Promise.all([import("./plugin-sdk/extension-shared.js"), import("./plugin-sdk/ssrf-runtime.js")]);
	signal.throwIfAborted();
	const deadline = buildTimeoutAbortSignal({
		timeoutMs: DOWNLOAD_TOTAL_TIMEOUT_MS,
		signal,
		operation: "crabbox-release-download"
	});
	const { response, release, refreshTimeout } = await fetchWithSsrFGuard({
		url: `${RELEASE_URL}/${name}`,
		requireHttps: true,
		timeoutMs: DOWNLOAD_IDLE_TIMEOUT_MS,
		signal: deadline.signal,
		policy: { hostnameAllowlist: ["github.com", "release-assets.githubusercontent.com"] },
		auditContext: "crabbox-managed-release"
	}).catch((error) => {
		deadline.cleanup();
		throw error;
	});
	try {
		if (!response.ok) throw new Error(`Crabbox release download failed for ${name} (HTTP ${response.status})`);
		if (Number(response.headers.get("content-length")) > maxBytes) throw new Error(`Crabbox release file ${name} exceeds ${maxBytes} bytes`);
		if (!response.body) throw new Error(`Crabbox release file ${name} has no response body`);
		const body = response.body;
		const mode = 384 & ~process.umask();
		await destination.create(name, (async function* () {
			for await (const chunk of body.values({ preventCancel: true })) {
				deadline.signal?.throwIfAborted();
				if (chunk.byteLength > 0) {
					refreshTimeout?.();
					yield chunk;
				}
			}
		})(), {
			maxBytes,
			signal: deadline.signal,
			mode,
			durable: false,
			mkdir: false
		});
	} finally {
		deadline.cleanup();
		await response.body?.cancel().catch(() => void 0);
		await release();
	}
}
async function probeInstallation(binary, runCommand, signal) {
	if (!(await fs.lstat(binary).catch(() => void 0))?.isFile()) return;
	const result = await probeCrabboxVersion(binary, runCommand, signal);
	return result.status === "supported" ? {
		binary,
		version: result.version
	} : void 0;
}
async function inspectInstallationDirectory(destination) {
	let stat;
	try {
		stat = await fs.lstat(destination);
	} catch (error) {
		const { extractErrorCode } = await import("./plugin-sdk/error-runtime.js");
		if (extractErrorCode(error) === "ENOENT") return;
		throw error;
	}
	if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Managed Crabbox destination must be a regular directory: ${destination}`);
	return stat;
}
async function publishInstallation(params) {
	const { binary, payload, runCommand, signal } = params;
	const destination = path.dirname(binary);
	const { withFileLock } = await import("./plugin-sdk/file-lock.js");
	signal.throwIfAborted();
	return withFileLock(`${destination}.publication`, {
		retries: {
			retries: 100,
			factor: 1,
			minTimeout: 100,
			maxTimeout: 100
		},
		stale: 12e4,
		staleRecovery: "remove-if-definitely-stale"
	}, async () => {
		signal.throwIfAborted();
		const existing = await inspectInstallationDirectory(destination);
		const installed = existing ? await probeInstallation(binary, runCommand, signal) : void 0;
		if (installed) return installed;
		signal.throwIfAborted();
		let recovery;
		if (existing) {
			recovery = `${destination}.recovery-${randomUUID()}`;
			await fs.rename(destination, recovery);
		}
		try {
			signal.throwIfAborted();
			await fs.rename(payload, destination);
			return {
				binary,
				version: params.version
			};
		} catch (error) {
			if (recovery) try {
				if (!await inspectInstallationDirectory(destination)) {
					await fs.rename(recovery, destination);
					recovery = void 0;
				}
			} catch (restoreError) {
				throw new AggregateError([error, restoreError], `Crabbox publication failed; previous installation is preserved at ${recovery}`, { cause: restoreError });
			}
			if (!signal.aborted && await inspectInstallationDirectory(destination)) {
				const winner = await probeInstallation(binary, runCommand, signal);
				if (winner) return winner;
			}
			if (recovery) throw new Error(`Crabbox publication failed; previous installation is preserved at ${recovery}`, { cause: error });
			throw error;
		}
	});
}
async function installManagedBinary(binary, runCommand, signal) {
	const destination = path.dirname(binary);
	await inspectInstallationDirectory(destination);
	const installed = await probeInstallation(binary, runCommand, signal);
	if (installed) return installed;
	const parent = path.dirname(destination);
	await fs.mkdir(parent, {
		recursive: true,
		mode: 448
	});
	const staging = await fs.mkdtemp(path.join(parent, ".install-"));
	try {
		const { root, sha256File } = await import("./plugin-sdk/file-access-runtime.js");
		const stagingRoot = await root(staging);
		const target = releaseTarget();
		await downloadReleaseFile(stagingRoot, "checksums.txt", 65536, signal);
		const hashes = (await stagingRoot.readText("checksums.txt", { maxBytes: 65536 })).split(/\r?\n/u).flatMap((line) => {
			const match = /^([a-fA-F0-9]{64})\s+\*?(\S+)\s*$/u.exec(line);
			return match?.[2] === target.asset ? [match[1].toLowerCase()] : [];
		});
		if (hashes.length !== 1) throw new Error(`Crabbox release checksums must contain exactly one entry for ${target.asset}`);
		await downloadReleaseFile(stagingRoot, target.asset, MAX_ARCHIVE_BYTES, signal);
		const archivePath = path.join(staging, target.asset);
		if ((await sha256File(archivePath, {
			maxBytes: MAX_ARCHIVE_BYTES,
			signal
		})).digest !== hashes[0]) throw new Error(`Crabbox release checksum mismatch for ${target.asset}`);
		const { extractArchive } = await import("./plugin-sdk/archive.js");
		signal.throwIfAborted();
		const payload = path.join(staging, "distribution");
		await fs.mkdir(payload, { mode: 448 });
		await extractArchive({
			archivePath,
			destDir: payload,
			kind: target.tar ? "tar" : "zip",
			tarGzip: target.tar,
			timeoutMs: 0,
			limits: {
				maxArchiveBytes: MAX_ARCHIVE_BYTES,
				maxEntries: 128,
				maxExtractedBytes: 536870912,
				maxEntryBytes: 268435456
			},
			entryFilter: (entry) => entry.kind === "file" || entry.kind === "directory" ? "extract" : "skip",
			onFiltered: "reject-archive"
		});
		const staged = await probeInstallation(path.join(payload, target.executable), runCommand, signal);
		if (!staged) throw new Error(`Downloaded Crabbox executable does not satisfy ${CRABBOX_MIN_VERSION}`);
		return await publishInstallation({
			binary,
			version: staged.version,
			payload,
			runCommand,
			signal
		});
	} finally {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
	}
}
const acquisitions = /* @__PURE__ */ new Map();
async function ensureManagedCrabboxBinary(params = {}) {
	const { signal } = params;
	const runCommand = params.runCommand ?? ((argv, options) => runCommandWithTimeout(argv, {
		...options,
		baseEnv: params.env,
		cwd: params.cwd
	}));
	const candidate = params.binary ?? "crabbox";
	const binary = resolveManagedCrabboxBinaryPath(params.env);
	if (path.resolve(params.cwd ?? ".", candidate) === binary) await inspectInstallationDirectory(path.dirname(binary));
	const preferred = await probeCrabboxVersion(candidate, runCommand, signal);
	if (preferred.status === "supported") return {
		binary: candidate,
		version: preferred.version
	};
	const { toErrorObject } = await import("./plugin-sdk/error-runtime.js");
	signal?.throwIfAborted();
	let acquisition = acquisitions.get(binary);
	if (acquisition?.controller.signal.aborted) {
		await acquisition.promise.catch(() => void 0);
		signal?.throwIfAborted();
		acquisition = acquisitions.get(binary);
	}
	if (!acquisition) {
		const controller = new AbortController();
		acquisition = {
			controller,
			waiters: 0,
			promise: installManagedBinary(binary, runCommand, controller.signal)
		};
		acquisitions.set(binary, acquisition);
		const owned = acquisition;
		acquisition.promise.finally(() => {
			if (acquisitions.get(binary) === owned) acquisitions.delete(binary);
		}).catch(() => void 0);
	}
	const shared = acquisition;
	shared.waiters += 1;
	let waiting = true;
	const leave = () => {
		if (waiting) {
			waiting = false;
			shared.waiters -= 1;
			if (shared.waiters === 0) shared.controller.abort();
		}
	};
	let abandon = () => {};
	const abandoned = new Promise((_resolve, reject) => {
		abandon = () => {
			leave();
			if (shared.waiters > 0) reject(toErrorObject(signal?.reason, "Crabbox acquisition aborted"));
		};
	});
	signal?.addEventListener("abort", abandon, { once: true });
	if (signal?.aborted) abandon();
	try {
		const resolved = await Promise.race([shared.promise, abandoned]);
		signal?.throwIfAborted();
		return resolved;
	} catch (error) {
		signal?.throwIfAborted();
		throw error;
	} finally {
		signal?.removeEventListener("abort", abandon);
		leave();
	}
}
//#endregion
export { resolveManagedCrabboxBinaryPath as i, ensureManagedCrabboxBinary as n, probeCrabboxVersion as r, CRABBOX_MIN_VERSION as t };
