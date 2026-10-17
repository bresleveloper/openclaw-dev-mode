import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText, b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./logging-core-e269L3HU.mjs";
import "./state-paths-Dd9pLEOI.mjs";
import { l as CRABBOX_STOP_TIMEOUT_MS } from "./crabbox-worker-timeouts-DXsC1sef.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region extensions/crabbox/src/crabbox-worker-command.ts
const MAX_OUTPUT_BYTES = 65536;
const MAX_COMMAND_DETAIL_CHARS = 512;
function leaseRunArgs(context, forwardedEnvNames = [], envProfilePath) {
	return [
		"run",
		"--provider",
		context.provider,
		"--network",
		"public",
		"--tailscale=false",
		"--id",
		context.id,
		"--keep=true",
		"--no-sync",
		...forwardedEnvNames.flatMap((name) => ["--allow-env", name]),
		...envProfilePath ? ["--env-from-profile", envProfilePath] : [],
		"--script-stdin"
	];
}
async function runCrabboxCommand(params) {
	params.signal?.throwIfAborted();
	let result;
	try {
		result = await params.runCommand([params.binary, ...params.args], {
			timeoutMs: params.timeoutMs,
			maxOutputBytes: MAX_OUTPUT_BYTES,
			killProcessTree: true,
			...params.env === void 0 ? {} : { env: params.env },
			...params.input === void 0 ? {} : { input: params.input },
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		params.signal?.throwIfAborted();
		throw crabboxExecutionError(params.action, error);
	}
	params.signal?.throwIfAborted();
	return result;
}
function crabboxExecutionError(action, cause) {
	const message = cause instanceof Error ? cause.message : typeof cause === "string" ? cause : "unknown runner failure";
	const detail = redactToolPayloadText(message).replace(/\s+/gu, " ").trim();
	return /* @__PURE__ */ new Error(`Crabbox ${action} execution failed: ${sliceUtf16Safe(detail, -512)}`);
}
function crabboxCommandDetail(result) {
	const raw = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
	if (!raw) return "";
	const compressed = redactSensitiveText(raw).replace(/\s+/gu, " ");
	return compressed.length <= MAX_COMMAND_DETAIL_CHARS ? `: ${compressed}` : `: ... ${sliceUtf16Safe(compressed, -508)}`;
}
function crabboxCommandError(action, result) {
	const attempts = result.coordinatorAttempts ? ` (after ${result.coordinatorAttempts} attempts)` : "";
	const detail = crabboxCommandDetail(result) || result.coordinatorDetail || "";
	if (result.termination !== "exit") return /* @__PURE__ */ new Error(`Crabbox ${action} did not exit normally (${result.termination})${detail}${attempts}`);
	return /* @__PURE__ */ new Error(`Crabbox ${action} failed with exit code ${result.code ?? "unknown"}${detail}${attempts}`);
}
function crabboxCommandOutput(action, result) {
	if (result.termination !== "exit" || result.code !== 0) throw crabboxCommandError(action, result);
	return result.stdout;
}
function parseCrabboxJson(stdout, action) {
	try {
		return JSON.parse(stdout);
	} catch {
		throw new Error(`Crabbox ${action} returned invalid JSON`);
	}
}
function isCoordinatorTransportFailure(result) {
	if (result.termination !== "exit" || result.code === null || result.code === 0) return false;
	let hasLeaseTimeout = false;
	return `${result.stderr}\n${result.stdout}`.trim().split(/[\r\n]+/u).every((line) => {
		const diagnostic = line.replace(/^warning: could not inspect lease before release: /u, "");
		if (/^(?:context deadline exceeded\s+)?(?:Get|Post) "https:\/\/[^/\s"]+\/v1\/leases\/[^/\s"?]+(?:\/(?:release|heartbeat))?(?:\?[^\s"]*)?": context deadline exceeded$/u.test(diagnostic)) {
			hasLeaseTimeout = true;
			return true;
		}
		return diagnostic === "context deadline exceeded" || /^coordinator read retry \d+\/\d+ reason=timeout$/u.test(diagnostic);
	}) && hasLeaseTimeout;
}
function isFixedLeaseIdUnsupported(result, provider) {
	return result.termination === "exit" && result.code === 2 && result.stdout.trim() === "" && result.stderr.trim() === `provider=${provider} does not support fixed idempotent lease IDs`;
}
/** Only fixed-lease callers opt in; allocation keeps Gateway replay ownership. */
async function runCrabboxCommandWithCoordinatorRetry(params) {
	const deadline = Date.now() + params.timeoutMs;
	const sleep = params.sleep ?? ((ms, signal) => setTimeout(ms, void 0, { signal }));
	let timeoutMs = params.timeoutMs;
	let coordinatorDetail;
	for (let attempt = 1;; attempt += 1) {
		const result = await runCrabboxCommand({
			...params,
			timeoutMs
		});
		const transient = isCoordinatorTransportFailure(result);
		if (transient) coordinatorDetail = crabboxCommandDetail(result);
		const observed = transient || attempt > 1 ? {
			...result,
			coordinatorAttempts: attempt,
			coordinatorDetail
		} : result;
		const backoffMs = 1e3 * 2 ** (attempt - 1);
		if (!transient || attempt === 3 || deadline - Date.now() <= backoffMs) return observed;
		await sleep(backoffMs, params.signal);
		params.signal?.throwIfAborted();
		timeoutMs = deadline - Date.now();
		if (timeoutMs <= 0) return observed;
	}
}
function isUnrecognizedLease(result, identifier, action) {
	const output = `${result.stderr}\n${result.stdout}`;
	if (result.termination !== "exit" || result.code === null || result.code === 0 || !new RegExp(`(?:^|[^\\w-])${escapeRegExp(identifier)}(?=$|[^\\w-])`, "u").test(output) || /\b(?:access\s+denied|auth|authentication|authorization|credentials?|forbidden|permission|token|unauthorized)\b/iu.test(output)) return false;
	if (/\bcoordinator\b/iu.test(output)) {
		const responses = output.trim().split(/[\r\n]+/u).map((line) => line.match(/^(?:warning: could not inspect lease before release: )?coordinator (GET|POST) (?:https?:\/\/[^/\s]+)?\/v1\/leases\/([^/:?\s]+)(\/release)?(?:\?[^\s:]*)?:[ \t]*http (\d{3})\b([^\r\n]*)$/iu));
		const hasRead = responses.some((response) => response?.[1] === "GET" && response[2] === identifier && !response[3] && response[4] === "404");
		if (action === "inspect") return hasRead;
		return hasRead && responses.some((response) => response?.[1] === "POST" && response[3] === "/release") && responses.every((response) => response?.[2] === identifier && response[4] === "404" && (response[1] === "GET" ? !response[3] : response[3] === "/release") && /^:\s*(?:not_found|\{\s*"error"\s*:\s*"not_found"\s*\})\s*$/u.test(response[5] ?? ""));
	}
	return result.code === 4 && (/\b(?:was\s+)?not found\b/iu.test(output) || /\bno longer exists\b/iu.test(output) || /\b(?:points to|is bound to) (?:a )?missing (?:instance|sandbox)\b/iu.test(output) || /\bdisappeared before release\b/iu.test(output) || /\bunknown blacksmith testbox(?:\s|:)/iu.test(output) || action === "inspect" && (/\bis not claimed by Crabbox\b/iu.test(output) || /\bwandb sandbox "[^"\r\n]+" has no matching local ownership claim\b/iu.test(output)) || /\bunknown lease(?:\s|:)/iu.test(output)) || action === "inspect" && result.code === 5 && /\bcoder workspace "[^"\r\n]+" not found\b/iu.test(output);
}
async function stopCrabboxLease(params) {
	const deadline = Date.now() + CRABBOX_STOP_TIMEOUT_MS;
	let result = await runCrabboxCommandWithCoordinatorRetry({
		action: "stop",
		args: [
			"stop",
			"--provider",
			params.provider,
			"--id",
			params.id
		],
		binary: params.binary,
		runCommand: params.runCommand,
		sleep: params.sleep,
		timeoutMs: CRABBOX_STOP_TIMEOUT_MS
	});
	if (isUnrecognizedLease(result, params.id, "stop")) {
		params.warn(`Crabbox lease ${params.id} (provider ${params.provider}) is absent; treating stop as already released`);
		return;
	}
	const output = `${result.stderr}\n${result.stdout}`;
	if (params.provider === "azure" && result.termination === "exit" && result.code === 4 && output.includes("Azure fixed lease cannot be adopted without its create intent")) {
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) throw new Error("Crabbox stop timed out before Azure fixed-lease recovery", { cause: crabboxCommandError("stop", result) });
		result = await runCrabboxCommandWithCoordinatorRetry({
			action: "stop recovery",
			args: [
				"stop",
				"--provider",
				params.provider,
				"--id",
				params.id,
				"--force"
			],
			binary: params.binary,
			runCommand: params.runCommand,
			sleep: params.sleep,
			timeoutMs: remainingMs
		});
	}
	crabboxCommandOutput("stop", result);
}
//#endregion
//#region extensions/crabbox/src/crabbox-managed-binary.ts
const CRABBOX_MIN_VERSION = "0.69.0";
const RELEASE_URL = `https://github.com/openclaw/crabbox/releases/download/v${CRABBOX_MIN_VERSION}`;
const MAX_ARCHIVE_BYTES = 134217728;
const VERSION_TIMEOUT_MS = 3e4;
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
	} catch (error) {
		signal?.throwIfAborted();
		return {
			status: "indeterminate",
			reason: crabboxExecutionError("version command", error).message
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
async function findManagedCrabboxBinary(params = {}) {
	const runCommand = params.runCommand ?? ((argv, options) => runCommandWithTimeout(argv, {
		...options,
		baseEnv: params.env
	}));
	const binary = resolveManagedCrabboxBinaryPath(params.env);
	if (await inspectInstallationDirectory(path.dirname(binary))) return probeInstallation(binary, runCommand, params.signal);
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
	const cached = await findManagedCrabboxBinary({
		env: params.env,
		runCommand,
		signal
	});
	if (cached) return cached;
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
export { resolveManagedCrabboxBinaryPath as a, isFixedLeaseIdUnsupported as c, parseCrabboxJson as d, runCrabboxCommand as f, probeCrabboxVersion as i, isUnrecognizedLease as l, stopCrabboxLease as m, ensureManagedCrabboxBinary as n, crabboxCommandError as o, runCrabboxCommandWithCoordinatorRetry as p, findManagedCrabboxBinary as r, crabboxCommandOutput as s, CRABBOX_MIN_VERSION as t, leaseRunArgs as u };
