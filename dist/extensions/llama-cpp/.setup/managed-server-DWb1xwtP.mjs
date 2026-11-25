import { D as resolveLlamaCppModelSource, E as resolveLlamaCppModelCacheDir, S as resolveHomePath, a as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, c as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES, h as LLAMA_CPP_DEFAULT_PORT, n as DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE, o as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION, r as DEFAULT_LLAMA_CPP_EMBEDDING_CONTEXT_SIZE, s as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256, w as resolveLlamaCppDataDir, x as resolveCachedLlamaCppModelPath } from "./defaults-B-3wLNsP.mjs";
import { a as resolveLlamaCppCatalogArtifact, r as resolveLlamaCppMediaArtifact } from "./media-catalog-D-CRqGbe.mjs";
import path from "node:path";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
import { fetchConfiguredLocalOriginWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime-internal";
import { createHash, randomUUID } from "node:crypto";
import fsp from "node:fs/promises";
import net from "node:net";
import { createAsyncLock } from "openclaw/plugin-sdk/async-lock-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/logging-core";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { execFile } from "node:child_process";
import fs, { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { sha256File } from "@openclaw/fs-safe/durability";
import { ARCHIVE_LIMIT_ERROR_CODE, ArchiveLimitError, extractArchive } from "openclaw/plugin-sdk/archive";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
// extensions/llama-cpp/src/llama-server-assets.ts
const LLAMA_SERVER_RELEASE = "b10809";
const LLAMA_SERVER_COMMIT = "5266f24da75dc449bd56cbed7addb9c8e4a6a73e";
const MEBIBYTE$1 = 1048576;
const CUDA_ARCHIVE_LIMITS = {
	maxArchiveBytes: 400 * MEBIBYTE$1,
	maxExtractedBytes: 600 * MEBIBYTE$1,
	maxEntryBytes: 521 * MEBIBYTE$1
};
const WINDOWS_X64_VC_RUNTIME = {
	archive: "vc-redist",
	name: "VC_redist.x64.exe",
	url: "https://download.visualstudio.microsoft.com/download/pr/ebdab8e5-1d7b-4d9f-a11b-cbb1720c3b12/843068991DAAA1F73AD9F6239BCE4D0F6A07A51F18C37EA2A867E9BECA71295C/VC_redist.x64.exe",
	sha256: "843068991daaa1f73ad9f6239bce4d0f6a07a51f18c37ea2a867e9beca71295c",
	size: 18731856,
	containerOffset: 63e4,
	containerSize: 18091661,
	nestedCabinet: "a4",
	files: [
		{
			source: "msvcp140.dll_amd64",
			target: "msvcp140.dll"
		},
		{
			source: "vcruntime140.dll_amd64",
			target: "vcruntime140.dll"
		},
		{
			source: "vcruntime140_1.dll_amd64",
			target: "vcruntime140_1.dll"
		}
	]
};
const WINDOWS_ARM64_VC_RUNTIME = {
	archive: "vc-redist",
	name: "VC_redist.arm64.exe",
	url: "https://download.visualstudio.microsoft.com/download/pr/ece44298-3977-4f73-ab91-c13fe79cfea8/B70EF586669A620A0A30A1156969C05C6A3831DC8F8BC992DA75779D2A92F944/VC_redist.arm64.exe",
	sha256: "b70ef586669a620a0a30a1156969c05c6a3831dc8f8bc992da75779d2a92f944",
	size: 11870816,
	containerOffset: 684112,
	containerSize: 11176508,
	nestedCabinet: "a1",
	files: [{
		source: "msvcp140.dll_arm64",
		target: "msvcp140.dll"
	}, {
		source: "vcruntime140.dll_arm64",
		target: "vcruntime140.dll"
	}]
};
const MACOS_ALIASES = [
	["libggml-rpc.0.23.0.dylib", ["libggml-rpc.0.dylib", "libggml-rpc.dylib"]],
	["libllama.0.4.0.dylib", ["libllama.0.dylib", "libllama.dylib"]],
	["libmtmd.0.4.0.dylib", ["libmtmd.0.dylib", "libmtmd.dylib"]],
	["libggml.0.23.0.dylib", ["libggml.0.dylib", "libggml.dylib"]],
	["libggml-base.0.23.0.dylib", ["libggml-base.0.dylib", "libggml-base.dylib"]],
	["libggml-blas.0.23.0.dylib", ["libggml-blas.0.dylib", "libggml-blas.dylib"]],
	["libllama-common.0.4.0.dylib", ["libllama-common.0.dylib", "libllama-common.dylib"]],
	["libggml-cpu.0.23.0.dylib", ["libggml-cpu.0.dylib", "libggml-cpu.dylib"]]
];
const MACOS_METAL_ALIASES = [...MACOS_ALIASES, ["libggml-metal.0.23.0.dylib", ["libggml-metal.0.dylib", "libggml-metal.dylib"]]];
const LINUX_ALIASES = [
	["libllama.so.0.4.0", ["libllama.so.0", "libllama.so"]],
	["libggml.so.0.23.0", ["libggml.so.0", "libggml.so"]],
	["libmtmd.so.0.4.0", ["libmtmd.so.0", "libmtmd.so"]],
	["libggml-base.so.0.23.0", ["libggml-base.so.0", "libggml-base.so"]],
	["libllama-common.so.0.4.0", ["libllama-common.so.0", "libllama-common.so"]]
];
const LLAMA_SERVER_ASSETS = [
	{
		platform: "darwin",
		arch: "arm64",
		backend: "metal",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-arm64.tar.gz`,
		sha256: "7d692df9e1e386e62f1c12b843903218041e6cd74c9415aa39a7ed3176f9eaa2",
		sizeBytes: 11123196,
		executable: "llama-server",
		regularFileAliases: MACOS_METAL_ALIASES
	},
	{
		platform: "darwin",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-x64.tar.gz`,
		sha256: "13b34aa8a5d87341a21065a83f54a8167e1aaa6fe0d66065de01632a1ed64be6",
		sizeBytes: 11175330,
		executable: "llama-server",
		regularFileAliases: MACOS_ALIASES
	},
	{
		platform: "linux",
		arch: "arm64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-arm64.tar.gz`,
		sha256: "f2b7333971e1b7b42e9268bfdbfa30f5f56e2897156084d2251385df94aec358",
		sizeBytes: 13380118,
		executable: "llama-server",
		regularFileAliases: LINUX_ALIASES
	},
	{
		platform: "linux",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-x64.tar.gz`,
		sha256: "5e34434ddc6d03cd1584f403201aff0d4bd1a5793a72ff7e286532dfd1e4b941",
		sizeBytes: 16734586,
		executable: "llama-server",
		regularFileAliases: LINUX_ALIASES
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cuda",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cuda-12.4-x64.zip`,
		sha256: "c77bfcd9ed8d91e8721a2d6a290b907fddd4fa5412a47b21c6fa1709116b85f9",
		sizeBytes: 253938543,
		executable: "llama-server.exe",
		regularFileAliases: [],
		limits: CUDA_ARCHIVE_LIMITS,
		dependencies: [{
			archive: "zip",
			archiveRoot: ".",
			name: "cudart-llama-bin-win-cuda-12.4-x64.zip",
			sha256: "8c79a9b226de4b3cacfd1f83d24f962d0773be79f1e7b75c6af4ded7e32ae1d6",
			sizeBytes: 391443627,
			regularFileAliases: [],
			files: [
				"cublas64_12.dll",
				"cublasLt64_12.dll",
				"cudart64_12.dll"
			],
			limits: {
				...CUDA_ARCHIVE_LIMITS,
				maxEntries: 3
			}
		}, WINDOWS_X64_VC_RUNTIME]
	},
	{
		platform: "win32",
		arch: "arm64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-arm64.zip`,
		sha256: "c1058fe5764a687275c8d20d6bbc1454e787cdbb8ebb8c37a2f959f2b144dc77",
		sizeBytes: 11974499,
		executable: "llama-server.exe",
		regularFileAliases: [],
		dependencies: [WINDOWS_ARM64_VC_RUNTIME]
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-x64.zip`,
		sha256: "9df3158ed228a641a4b127942d7f459f24c9e13f04682659d05c00c80099b6b5",
		sizeBytes: 18407457,
		executable: "llama-server.exe",
		regularFileAliases: [],
		dependencies: [WINDOWS_X64_VC_RUNTIME]
	}
];
function selectLlamaServerAsset(platform = process.platform, arch = process.arch, acceleration) {
	const backend = acceleration?.kind ?? (platform === "darwin" && arch === "arm64" ? "metal" : "cpu");
	if (backend === "cuda" && acceleration?.kind === "cuda") {
		if (platform !== "win32" || arch !== "x64") throw new Error(`No verified CUDA llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a CUDA-enabled llama-server manually and configure its absolute path, or explicitly choose CPU setup.`);
		if (!(acceleration.devices.length > 0 && acceleration.devices.every((device) => {
			const version = /^(\d+)\.(\d+)(?:\.\d+)?$/u.exec(device.driverVersion);
			return version && (Number(version[1]) > 551 || Number(version[1]) === 551 && Number(version[2]) >= 78) && (device.computeCapability === void 0 || device.computeCapability >= 5);
		}))) throw new Error("The verified CUDA 12.4 build requires NVIDIA driver 551.78 or newer and compute capability 5.0 or newer. Update the NVIDIA driver, configure a compatible llama-server manually, or explicitly choose CPU setup.");
	}
	const asset = LLAMA_SERVER_ASSETS.find((candidate) => candidate.platform === platform && candidate.arch === arch && candidate.backend === backend);
	if (!asset) throw new Error(`No verified llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a compatible llama-server manually, then rerun llama.cpp setup with its absolute path.`);
	return asset;
}
function resolveManagedLlamaServerPaths(asset = selectLlamaServerAsset()) {
	const installDir = path.join(resolveLlamaCppDataDir(), LLAMA_SERVER_RELEASE, `${asset.platform}-${asset.arch}${asset.backend === "cuda" ? "-cuda-12.4" : ""}`);
	return {
		installDir,
		command: path.join(installDir, asset.executable),
		presetPath: path.join(resolveLlamaCppDataDir(), "models.ini")
	};
}
function findManagedLlamaServerAsset(command, platform = process.platform, arch = process.arch) {
	return LLAMA_SERVER_ASSETS.find((asset) => asset.platform === platform && asset.arch === arch && resolveManagedLlamaServerPaths(asset).command === command);
}
// extensions/llama-cpp/src/runtime-error.ts
function formatLlamaServerRuntimeError(error) {
	const cause = error instanceof Error ? error : new Error(String(error));
	const library = cause.message.match(/error while loading shared libraries: ([\w.+-]+):/u)?.[1];
	if (!library) return cause;
	const runtime = /^lib(?:ssl|crypto)\.so\.3$/u.test(library) ? "OpenSSL 3 (libssl3t64 or libssl3 on Debian/Ubuntu)" : library.startsWith("libgomp.so.") ? "OpenMP (libgomp1 on Debian/Ubuntu or libgomp on Fedora)" : library;
	return new Error(`Missing llama-server shared library ${library}. Install the ${runtime} runtime using your system package manager, then rerun llama.cpp setup. Detail: ${cause.message}`, { cause });
}
// extensions/llama-cpp/src/llama-server-install.ts
const MEBIBYTE = 1048576;
const LLAMA_ARCHIVE_LIMITS = {
	maxArchiveBytes: 256 * MEBIBYTE,
	maxEntries: 1e3,
	maxExtractedBytes: 512 * MEBIBYTE,
	maxEntryBytes: 256 * MEBIBYTE,
	maxMetaEntryBytes: MEBIBYTE
};
const MAX_ALIAS_BYTES = 512 * MEBIBYTE;
const CAB_HEADER_SIZE = 12;
const EXPAND_TIMEOUT_MS = 6e4;
async function assertRegularFile(filePath, label, source = "llama-server archive") {
	const stat = await fsp.lstat(filePath).catch(() => void 0);
	if (!stat?.isFile() || stat.nlink > 1) throw new Error(`${source} does not contain regular ${label}`);
	return stat;
}
async function extractVerifiedArchive(archivePath, destDir, asset, requiredFiles) {
	const isTar = asset.archive === "tar.gz";
	const limits = {
		...LLAMA_ARCHIVE_LIMITS,
		...asset.limits
	};
	const aliasCount = asset.regularFileAliases.reduce((count, [, aliases]) => count + aliases.length, 0);
	if (aliasCount > limits.maxEntries) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT);
	await extractArchive({
		archivePath,
		destDir,
		kind: isTar ? "tar" : "zip",
		timeoutMs: 0,
		limits: {
			...limits,
			maxEntries: limits.maxEntries - aliasCount
		},
		tarGzip: isTar,
		entryFilter: (entry) => entry.kind === "symlink" ? "skip" : "extract",
		onFiltered: "skip-entry"
	});
	const rootDir = path.join(destDir, asset.archiveRoot);
	for (const file of requiredFiles) await assertRegularFile(path.join(rootDir, file), `file ${file}`);
	let copiedBytes = 0;
	for (const [source, aliases] of asset.regularFileAliases) {
		const sourcePath = path.join(rootDir, source);
		const sourceStat = await assertRegularFile(sourcePath, `alias source ${source}`);
		for (const alias of aliases) {
			copiedBytes += sourceStat.size;
			if (copiedBytes > MAX_ALIAS_BYTES) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.EXTRACTED_SIZE_EXCEEDS_LIMIT);
			const aliasPath = path.join(rootDir, alias);
			await fsp.copyFile(sourcePath, aliasPath, fs.constants.COPYFILE_EXCL);
			await fsp.chmod(aliasPath, sourceStat.mode & 511);
		}
	}
	return rootDir;
}
async function runExpand(command, args, signal) {
	await runServerCommand(command, args, signal, EXPAND_TIMEOUT_MS, (error, stderr) => {
		const detail = stderr.trim();
		return new Error(`Failed to extract the Visual C++ runtime${detail ? `: ${detail}` : ""}`, { cause: error });
	});
}
const DOWNLOAD_TIMEOUT_MS = 18e5;
const PROBE_TIMEOUT_MS = 15e3;
const VERSION_TIMEOUT_MS = 12e4;
const installationPromises = /* @__PURE__ */ new Map();
function compareVersion(left, right) {
	const leftParts = left.split(".").map(Number);
	const rightParts = right.split(".").map(Number);
	for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
		const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
		if (delta !== 0) return delta;
	}
	return 0;
}
/** The verified build cannot run on this host; rerunning setup cannot change that. */
var UnsupportedLlamaServerHostError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "UnsupportedLlamaServerHostError";
	}
};
function assertSupportedLinuxRuntime(asset) {
	if (asset.platform !== "linux") return;
	const header = asOptionalRecord(asOptionalRecord(process.report?.getReport())?.header);
	const glibc = typeof header?.glibcVersionRuntime === "string" ? header.glibcVersionRuntime : "";
	if (!glibc) throw new UnsupportedLlamaServerHostError("The verified Ubuntu llama-server build requires glibc and cannot run on musl/Alpine. Install llama-server manually for this host and configure its absolute path.");
	const minimum = asset.arch === "arm64" ? "2.38" : "2.34";
	if (compareVersion(glibc, minimum) < 0) throw new UnsupportedLlamaServerHostError(`The verified llama-server build requires glibc ${minimum}+ on Linux ${asset.arch}; this host has ${glibc}. Install a compatible llama-server manually and configure its absolute path.`);
}
const MACOS_MINIMUM = "13.3";
async function assertSupportedMacosRuntime(asset, signal, cause) {
	if (asset.platform !== "darwin") return;
	const version = await runServerCommand("/usr/bin/sw_vers", ["-productVersion"], signal).catch(() => {
		signal?.throwIfAborted();
		return "";
	});
	if (!/^\d+\.\d+(?:\.\d+)?$/u.test(version) || compareVersion(version, MACOS_MINIMUM) >= 0) return;
	throw new UnsupportedLlamaServerHostError(`The verified llama-server ${LLAMA_SERVER_RELEASE} build requires macOS ${MACOS_MINIMUM}+; this Mac runs macOS ${version}. Build llama-server for this Mac and set models.providers.llama-cpp.localService.command to its absolute path, or use a remote model or embedding provider.`, cause === void 0 ? void 0 : { cause });
}
function assetUrl(asset) {
	return asset.url ?? `https://github.com/ggml-org/llama.cpp/releases/download/b10809/${asset.name}`;
}
const verifiedFiles = /* @__PURE__ */ new Map();
const VERIFIED_FILE_LIMIT = 16;
function fileIdentity(stat) {
	return `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}`;
}
function rememberVerifiedFile(filePath, stat, sha256) {
	verifiedFiles.delete(filePath);
	verifiedFiles.set(filePath, {
		identity: fileIdentity(stat),
		sha256
	});
	pruneMapToMaxSize(verifiedFiles, VERIFIED_FILE_LIMIT);
}
async function sha256File$1(filePath, signal) {
	signal?.throwIfAborted();
	try {
		const identity = fileIdentity(await fsp.stat(filePath, { bigint: true }));
		const verified = verifiedFiles.get(filePath);
		if (verified?.identity === identity) return verified.sha256;
		verifiedFiles.delete(filePath);
		const handle = await fsp.open(filePath, "r");
		try {
			const before = fileIdentity(await handle.stat({ bigint: true }));
			const { digest: sha256 } = await sha256File(handle, { signal });
			const after = await handle.stat({ bigint: true });
			if (before !== fileIdentity(after) || before !== fileIdentity(await fsp.stat(filePath, { bigint: true }))) throw new Error(`File changed during integrity verification: ${filePath}. Retry setup.`);
			rememberVerifiedFile(filePath, after, sha256);
			return sha256;
		} finally {
			await handle.close();
		}
	} catch (error) {
		verifiedFiles.delete(filePath);
		throw error;
	}
}
function readResponseSha256(response) {
	for (const name of ["x-checksum-sha256", "x-linked-etag"]) {
		const value = response.headers.get(name)?.replace(/^W\//u, "").replaceAll("\"", "").trim();
		if (value && /^[a-f\d]{64}$/iu.test(value)) return value.toLowerCase();
	}
	const encoded = response.headers.get("digest")?.match(/(?:^|,)\s*sha-256=([^,\s]+)/iu)?.[1];
	return encoded ? Buffer.from(encoded, "base64").toString("hex") : void 0;
}
async function downloadVerifiedFile(params) {
	const partialPath = `${params.destination}.partial-${randomUUID()}`;
	await fsp.mkdir(path.dirname(params.destination), { recursive: true });
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } = await import("openclaw/plugin-sdk/ssrf-runtime");
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: params.url,
			signal: params.signal,
			timeoutMs: DOWNLOAD_TIMEOUT_MS,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.url),
			requireHttps: true,
			auditContext: "llama-cpp-download"
		});
		try {
			if (!response.ok || !response.body) throw new Error(`download failed: HTTP ${response.status} ${response.statusText}`);
			const expectedSha256 = params.expectedSha256 ?? readResponseSha256(response);
			if (!expectedSha256 && params.requireServerDigest) throw new Error("the download server did not provide a SHA-256 digest; download the GGUF manually and configure its local path");
			const contentLength = Number(response.headers.get("content-length"));
			const totalSize = params.expectedSize ?? (Number.isFinite(contentLength) && contentLength > 0 ? contentLength : 0);
			const handle = await fsp.open(partialPath, "wx", 384);
			const hash = createHash("sha256");
			let downloadedSize = 0;
			let previousSize = 0;
			let previousAt = Date.now();
			let rollingBytesPerSecond = 0;
			try {
				for await (const value of response.body.values({ preventCancel: true })) {
					const chunk = Buffer.from(value);
					await handle.writeFile(chunk);
					hash.update(chunk);
					downloadedSize += chunk.byteLength;
					const now = Date.now();
					if (now > previousAt) {
						const currentRate = (downloadedSize - previousSize) * 1e3 / (now - previousAt);
						rollingBytesPerSecond = rollingBytesPerSecond === 0 ? currentRate : rollingBytesPerSecond * .75 + currentRate * .25;
						previousSize = downloadedSize;
						previousAt = now;
					}
					params.onProgress?.({
						downloadedSize,
						totalSize,
						bytesPerSecond: rollingBytesPerSecond
					});
				}
				if (params.expectedSize && downloadedSize !== params.expectedSize) throw new Error(`download size mismatch: expected ${params.expectedSize}, got ${downloadedSize}`);
				const actualSha256 = hash.digest("hex");
				if (expectedSha256 && actualSha256 !== expectedSha256.toLowerCase()) throw new Error(`download SHA-256 mismatch: expected ${expectedSha256}, got ${actualSha256}`);
				const completed = await handle.stat({ bigint: true });
				params.signal?.throwIfAborted();
				await fsp.rename(partialPath, params.destination);
				const published = await handle.stat({ bigint: true });
				if (completed.size === published.size && completed.mtimeNs === published.mtimeNs) rememberVerifiedFile(params.destination, published, actualSha256);
			} finally {
				await handle.close();
			}
		} finally {
			await release();
		}
	} finally {
		await fsp.rm(partialPath, { force: true }).catch(() => void 0);
	}
}
async function runServerCommand(command, args, signal, timeoutMs = PROBE_TIMEOUT_MS, formatError = formatRuntimeDependencyError) {
	return await new Promise((resolve, reject) => {
		execFile(command, args, {
			timeout: timeoutMs,
			signal,
			windowsHide: true
		}, (error, stdout, stderr) => {
			if (error) reject(signal?.aborted ? toErrorObject(signal.reason, "Installation cancelled") : formatError(error, stderr));
			else resolve(`${stdout}${stderr}`.trim());
		});
	});
}
function formatRuntimeDependencyError(error) {
	const detail = error instanceof Error ? error.message : String(error);
	if (process.platform === "win32") return new Error(`The verified llama-server build could not start with its app-local Visual C++ runtime. Rerun llama.cpp setup to reinstall it, or configure a compatible llama-server manually. Detail: ${detail}`, { cause: error });
	return formatLlamaServerRuntimeError(error);
}
function queryServerVersion(command, signal) {
	return runServerCommand(command, ["--version"], signal, VERSION_TIMEOUT_MS);
}
function validateServerVersionOutput(command, version) {
	const match = (version.split(/\r?\n/u, 1)[0]?.trim() ?? "").match(/^version: .+ \(build (\d+), commit ([a-f\d]{9})\)$/u);
	const build = match?.[1] ? Number(match[1]) : void 0;
	const commit = match?.[2];
	if (build !== 10809 || commit !== "5266f24da75dc449bd56cbed7addb9c8e4a6a73e".slice(0, 9)) throw new Error(`Unexpected llama-server build at ${command}: expected ${LLAMA_SERVER_RELEASE} (${LLAMA_SERVER_COMMIT.slice(0, 9)}), got ${version || "no version output"}`);
}
async function validateCudaServer(command, asset, signal) {
	if (asset.backend === "cuda") {
		const devices = await runServerCommand(command, ["--list-devices"], signal);
		if (!/^\s*CUDA\d+: .+\(\d+ MiB, \d+ MiB free\)$/mu.test(devices)) throw new Error("The verified llama-server could not initialize an NVIDIA CUDA device. Update the NVIDIA driver and rerun setup, or configure a compatible llama-server manually. CPU fallback was not activated.");
	}
}
async function validateInstalledServer(command, asset, signal) {
	validateServerVersionOutput(command, await queryServerVersion(command, signal));
	await validateCudaServer(command, asset, signal);
}
function formatVcRuntimeFallbackError(startupError, fallbackError) {
	const startupDetail = startupError instanceof Error ? startupError.message : String(startupError);
	const fallbackDetail = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
	return new Error(`The extracted llama-server could not start with the installed Windows runtime, and its app-local Visual C++ runtime fallback did not restore it. Initial startup detail: ${startupDetail} Fallback detail: ${fallbackDetail}`, { cause: fallbackError });
}
async function installLlamaServer(asset, options) {
	options.signal?.throwIfAborted();
	assertSupportedLinuxRuntime(asset);
	const { installDir, command } = resolveManagedLlamaServerPaths(asset);
	if (await fsp.stat(command).then((stat) => stat.isFile()).catch(() => false)) {
		try {
			await validateInstalledServer(command, asset, options.signal);
		} catch (error) {
			await assertSupportedMacosRuntime(asset, options.signal, error);
			throw error;
		}
		return command;
	}
	await assertSupportedMacosRuntime(asset, options.signal);
	const dataDir = resolveLlamaCppDataDir();
	const archivePath = path.join(dataDir, `.download-${randomUUID()}-${asset.name}`);
	const extractDir = path.join(dataDir, `.extract-${randomUUID()}`);
	await fsp.mkdir(dataDir, { recursive: true });
	try {
		await downloadVerifiedFile({
			url: assetUrl(asset),
			destination: archivePath,
			expectedSha256: asset.sha256,
			signal: options.signal,
			onProgress: options.onProgress
		});
		const serverExtractDir = path.join(extractDir, "server");
		await fsp.mkdir(serverExtractDir, { recursive: true });
		const extractedCommand = path.join(await extractVerifiedArchive(archivePath, serverExtractDir, asset, [asset.executable]), asset.executable);
		const extractedRoot = path.dirname(extractedCommand);
		const stageDependency = async (dependency, index) => {
			options.signal?.throwIfAborted();
			const dependencyArchive = path.join(extractDir, dependency.name);
			await downloadVerifiedFile({
				url: assetUrl(dependency),
				destination: dependencyArchive,
				expectedSha256: dependency.sha256,
				expectedSize: dependency.archive === "vc-redist" ? dependency.size : void 0,
				signal: options.signal,
				onProgress: options.onProgress
			});
			const dependencyExtractDir = path.join(extractDir, `dependency-${index}`);
			await fsp.mkdir(dependencyExtractDir);
			let dependencyRoot;
			if (dependency.archive === "vc-redist") {
				const { nestedCabinet, files } = dependency;
				const systemRoot = process.env.SystemRoot;
				if (!systemRoot || !path.win32.isAbsolute(systemRoot)) throw new Error("SystemRoot is unavailable; cannot extract the Visual C++ runtime");
				const expandCommand = path.win32.join(systemRoot, "System32", "expand.exe");
				const containerPath = path.join(dependencyExtractDir, "bundle.cab");
				const nestedDir = path.join(dependencyExtractDir, "nested");
				const filesDir = path.join(dependencyExtractDir, "files");
				await Promise.all([fsp.mkdir(nestedDir, { recursive: true }), fsp.mkdir(filesDir, { recursive: true })]);
				const source = await fsp.open(dependencyArchive, "r");
				try {
					const stat = await source.stat();
					if (!stat.isFile() || stat.size !== dependency.size) throw new Error(`Visual C++ runtime bundle size mismatch: expected ${dependency.size}, got ${stat.size}`);
					if (dependency.containerOffset < 0 || dependency.containerSize < CAB_HEADER_SIZE || dependency.containerOffset + dependency.containerSize > stat.size) throw new Error("invalid Visual C++ runtime container bounds");
					const header = Buffer.alloc(CAB_HEADER_SIZE);
					if ((await source.read(header, 0, header.length, dependency.containerOffset)).bytesRead !== header.length || header.subarray(0, 4).toString("ascii") !== "MSCF" || header.readUInt32LE(8) !== dependency.containerSize) throw new Error("Visual C++ runtime bundle does not contain the pinned cabinet");
					await pipeline(source.createReadStream({
						start: dependency.containerOffset,
						end: dependency.containerOffset + dependency.containerSize - 1,
						autoClose: false
					}), createWriteStream(containerPath, {
						flags: "wx",
						mode: 384
					}), { signal: options.signal });
				} finally {
					await source.close();
				}
				await runExpand(expandCommand, [
					`-F:${nestedCabinet}`,
					containerPath,
					nestedDir
				], options.signal);
				const nestedPath = path.join(nestedDir, nestedCabinet);
				await assertRegularFile(nestedPath, `file ${nestedCabinet}`, "Visual C++ runtime");
				for (const file of files) {
					options.signal?.throwIfAborted();
					await runExpand(expandCommand, [
						`-F:${file.source}`,
						nestedPath,
						filesDir
					], options.signal);
					const sourcePath = path.join(filesDir, file.source);
					await assertRegularFile(sourcePath, `file ${file.source}`, "Visual C++ runtime");
					await fsp.copyFile(sourcePath, path.join(dependencyExtractDir, file.target), fs.constants.COPYFILE_EXCL);
				}
				dependencyRoot = dependencyExtractDir;
			} else dependencyRoot = await extractVerifiedArchive(dependencyArchive, dependencyExtractDir, dependency, dependency.files);
			const files = dependency.archive === "vc-redist" ? dependency.files.map((file) => file.target) : dependency.files;
			for (const file of files) await fsp.copyFile(path.join(dependencyRoot, file), path.join(extractedRoot, file), fs.constants.COPYFILE_EXCL);
		};
		const dependencies = asset.dependencies ?? [];
		const windowsRuntimeDependencies = [];
		for (const [index, dependency] of dependencies.entries()) if (dependency.archive === "vc-redist") windowsRuntimeDependencies.push({
			dependency,
			index
		});
		else await stageDependency(dependency, index);
		options.signal?.throwIfAborted();
		await fsp.chmod(extractedCommand, 493);
		if (windowsRuntimeDependencies.length > 0) {
			let version;
			try {
				version = await queryServerVersion(extractedCommand, options.signal);
			} catch (startupError) {
				options.signal?.throwIfAborted();
				try {
					for (const { dependency, index } of windowsRuntimeDependencies) await stageDependency(dependency, index);
				} catch (stagingError) {
					options.signal?.throwIfAborted();
					throw formatVcRuntimeFallbackError(startupError, stagingError);
				}
				try {
					version = await queryServerVersion(extractedCommand, options.signal);
				} catch (retryError) {
					options.signal?.throwIfAborted();
					throw formatVcRuntimeFallbackError(startupError, retryError);
				}
			}
			validateServerVersionOutput(extractedCommand, version);
			await validateCudaServer(extractedCommand, asset, options.signal);
		} else await validateInstalledServer(extractedCommand, asset, options.signal);
		await fsp.mkdir(path.dirname(installDir), { recursive: true });
		options.signal?.throwIfAborted();
		await fsp.rm(installDir, {
			recursive: true,
			force: true
		});
		await fsp.rename(extractedRoot, installDir);
		return command;
	} finally {
		await Promise.all([fsp.rm(archivePath, { force: true }), fsp.rm(extractDir, {
			recursive: true,
			force: true
		})]);
	}
}
async function ensureLlamaServerInstalled(options = {}) {
	options.signal?.throwIfAborted();
	const asset = options.asset ?? selectLlamaServerAsset();
	const key = resolveManagedLlamaServerPaths(asset).command;
	const previous = installationPromises.get(key);
	const pending = Promise.resolve(previous).catch(() => void 0).then(() => installLlamaServer(asset, options)).finally(() => {
		if (installationPromises.get(key) === pending) installationPromises.delete(key);
	});
	installationPromises.set(key, pending);
	return { command: await racePromiseWithAbortSignal(pending, previous ? options.signal : void 0, (signal) => toErrorObject(signal.reason, "Installation cancelled")) };
}
// extensions/llama-cpp/src/llama-server-preset.ts
function assertIniValue(value, label) {
	if (/\r|\n/u.test(value)) throw new Error(`${label} cannot contain a newline`);
	return value;
}
function normalizePresetName(name) {
	const colon = name.lastIndexOf(":");
	if (colon < 0) return name;
	const tag = name.slice(colon + 1);
	const quantization = /[-.]([a-zA-Z0-9_]+)$/u.exec(tag)?.[1] ?? tag;
	return name.slice(0, colon + 1) + quantization.replace(/[a-z]/g, (char) => char.toUpperCase());
}
function readModelSections(contents) {
	const headers = [...contents.matchAll(/(?<![^\r\n])\[[ \t]*([^\]]+)\][ \t]*(?:[;#][^\r\n]*)?(?:\r\n|\n|\r|(?![\s\S]))/g)];
	return {
		header: contents.slice(0, headers[0]?.index ?? contents.length),
		sections: new Map(headers.map((match, index) => [match[1], contents.slice(match.index, headers[index + 1]?.index ?? contents.length)]))
	};
}
const PRESET_KEY_ALIASES = {
	m: "model",
	LLAMA_ARG_MODEL: "model",
	c: "ctx-size",
	LLAMA_ARG_CTX_SIZE: "ctx-size",
	n: "n-predict",
	predict: "n-predict",
	LLAMA_ARG_N_PREDICT: "n-predict",
	"no-jinja": "jinja",
	LLAMA_ARG_JINJA: "jinja",
	ub: "ubatch-size",
	LLAMA_ARG_UBATCH: "ubatch-size",
	embeddings: "embedding",
	LLAMA_ARG_EMBEDDINGS: "embedding",
	LLAMA_ARG_MMPROJ: "mmproj",
	mm: "mmproj",
	mmdev: "mmproj-device",
	MTMD_BACKEND_DEVICE: "mmproj-device",
	LLAMA_ARG_IMAGE_MAX_TOKENS: "image-max-tokens",
	np: "parallel",
	LLAMA_ARG_N_PARALLEL: "parallel",
	dev: "device",
	LLAMA_ARG_DEVICE: "device",
	sm: "split-mode",
	LLAMA_ARG_SPLIT_MODE: "split-mode",
	LLAMA_ARG_KV_UNIFIED_PER_SLOT: "kv-unified-per-slot"
};
function assertMediaPresetLimits(args, models) {
	const limits = {
		"ctx-size": Math.min(...models.map((model) => model.contextSize)),
		"image-max-tokens": Math.min(...models.map((model) => model.imageMaxTokens)),
		parallel: 1
	};
	for (let index = 0; index < args.length; index++) {
		const [option = "", inlineValue] = args[index].split("=", 2);
		const name = option.replace(/^--?/u, "").replaceAll("_", "-");
		const limit = limits[PRESET_KEY_ALIASES[name] ?? name];
		if (limit === void 0) continue;
		const value = Number(inlineValue ?? args[++index]);
		if (!Number.isInteger(value) || value < 1 || value > limit) throw new Error(`Router option ${option} exceeds the local media limit (${limit}). Lower it or move it into the existing model's preset section, then retry local media setup. Existing configuration is unchanged.`);
	}
}
const PRESET_SETTING_PATTERN = /(?<![^\r\n])([a-zA-Z_][a-zA-Z0-9_.-]*)([ \t]*=[ \t]*)([^\r\n]*?)([ \t]*(?:[;#][^\r\n]*)?)(\r\n|\n|\r|(?![\s\S]))/g;
function readSettingKeys(section) {
	return new Set([...(section ?? "").matchAll(PRESET_SETTING_PATTERN)].map(([, key = ""]) => PRESET_KEY_ALIASES[key] ?? key));
}
function readServiceSettingKeys(service) {
	const caseInsensitiveEnv = process.platform === "win32";
	const keys = [...Object.entries(service?.env ?? {}).filter(([, value]) => value !== void 0).map(([key]) => caseInsensitiveEnv ? key.toUpperCase() : key).filter((key) => key.startsWith("LLAMA_ARG_")), ...(service?.args ?? []).filter((arg) => arg.startsWith("-")).map((arg) => arg.startsWith("--") ? arg.slice(2).replaceAll("_", "-") : arg.slice(1))];
	return new Set(keys.map((key) => PRESET_KEY_ALIASES[key] ?? key));
}
function updateModelSection(sections, id, values, newline) {
	assertIniValue(id, "llama.cpp model id");
	if (id.includes("]")) throw new Error("llama.cpp model ids cannot contain ]");
	const name = [...sections.keys()].filter((candidate) => normalizePresetName(candidate) === normalizePresetName(id)).toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))).at(-1) ?? id;
	const pending = new Set(Object.keys(values));
	let contents = (sections.get(name) ?? `[${id}]${newline}`).replace(PRESET_SETTING_PATTERN, (line, key, separator, _value, comment, ending) => {
		const canonical = PRESET_KEY_ALIASES[key] ?? key;
		if (!Object.hasOwn(values, canonical)) return line;
		pending.delete(canonical);
		return `${canonical}${separator}${values[canonical]}${comment}${ending}`;
	});
	for (const key of pending) contents += `${/[\r\n]$/u.test(contents) ? "" : newline}${key} = ${values[key]}${newline}`;
	sections.set(name, contents);
}
function buildLlamaServerPreset(existing, params) {
	const newline = existing?.match(/\r\n|\n|\r/u)?.[0] ?? "\n";
	const { header, sections } = readModelSections(existing ?? "version = 1\n\n");
	const configuredIds = params.configuredChatModelIds ? new Set(params.configuredChatModelIds.map(normalizePresetName)) : void 0;
	for (const id of sections.keys()) if (id !== "*" && id !== "embeddinggemma-300m-qat-q8_0" && (params.chatModel.mode === "remove" || configuredIds && !configuredIds.has(normalizePresetName(id)))) sections.delete(id);
	const models = [...params.chatModel.mode === "configure" ? [params.chatModel] : [], ...params.mediaModels ?? []];
	for (const model of models) updateModelSection(sections, model.id, {
		model: assertIniValue(model.path, "llama.cpp model path"),
		"ctx-size": String(model.contextSize ?? 65536),
		"n-predict": String(model.maxTokens ?? 2048),
		jinja: "true",
		...model.projectorPath ? {
			mmproj: assertIniValue(model.projectorPath, "llama.cpp projector path"),
			"image-max-tokens": String(model.imageMaxTokens ?? 1024),
			parallel: "1",
			"load-on-startup": "false"
		} : {},
		...model.device ? {
			device: assertIniValue(model.device, "llama.cpp device"),
			"mmproj-device": assertIniValue(model.device, "llama.cpp projector device"),
			"split-mode": "none"
		} : {}
	}, newline);
	const embeddingPath = params.embeddingModelPath ?? (!sections.has("embeddinggemma-300m-qat-q8_0") ? params.defaultEmbeddingModelPath : void 0);
	if (embeddingPath) {
		const configured = /* @__PURE__ */ new Set([
			...readSettingKeys(sections.get(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID)),
			...readSettingKeys(sections.get("*")),
			...readServiceSettingKeys(params.serviceSettings)
		]);
		const defaults = {
			parallel: "1",
			"ctx-size": String(DEFAULT_LLAMA_CPP_EMBEDDING_CONTEXT_SIZE),
			"ubatch-size": String(DEFAULT_LLAMA_CPP_EMBEDDING_CONTEXT_SIZE)
		};
		if (configured.has("parallel") || configured.has("kv-unified-per-slot")) delete defaults["ctx-size"];
		for (const key of configured) delete defaults[key];
		updateModelSection(sections, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, {
			model: assertIniValue(embeddingPath, "llama.cpp embedding model path"),
			embedding: "true",
			...defaults
		}, newline);
	}
	const embeddingSection = sections.get(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID);
	if (!embeddingSection && params.mediaModels === void 0) throw new Error("llama.cpp embedding model path is required for a new managed preset");
	sections.delete(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID);
	const orderedSections = [...[...sections].toSorted(([left], [right]) => Number(left > right) - Number(left < right)).map(([, section]) => section), ...embeddingSection ? [embeddingSection] : []];
	return header + (header && !/[\r\n]$/u.test(header) ? newline : "") + orderedSections.map((section) => section.replace(/[\r\n]+$/u, "")).join(newline + newline) + newline;
}
// extensions/llama-cpp/src/managed-server.ts
const modelPromises = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("llama-cpp");
const recoveries = /* @__PURE__ */ new Map();
const resolvedModelArtifacts = /* @__PURE__ */ new Map();
const presetState = {
	appliedRevisions: /* @__PURE__ */ new Map(),
	desiredRevisions: /* @__PURE__ */ new Map()
};
const runPresetTransition = createAsyncLock();
const LLAMA_CPP_PRESET_RELOAD_TIMEOUT_MS = 15e3;
function readUniqueArgument(argv, name) {
	const values = argv.flatMap((argument, index) => {
		if (argument === name) {
			const value = argv[index + 1];
			return value === void 0 ? [] : [value];
		}
		return argument.startsWith(`${name}=`) ? [argument.slice(name.length + 1)] : [];
	});
	return values.length === 1 ? values[0] : void 0;
}
function parseHuggingFaceSource(source) {
	const [pathPart, revisionPart] = source.replace(/^(?:hf|huggingface):(?:\/\/)?/iu, "").split("#", 2);
	const [user, repositoryWithTag, ...fileParts] = (pathPart ?? "").split("/");
	const [repository, ...tagParts] = (repositoryWithTag ?? "").split(":");
	if (!user || !repository) throw new Error(`Invalid Hugging Face model URI: ${source}`);
	return {
		user,
		repository,
		file: fileParts.length > 0 ? fileParts.join("/") : void 0,
		revision: revisionPart || "main",
		tag: tagParts.length > 0 ? tagParts.join(":") : void 0
	};
}
async function resolveHuggingFaceArtifact(source, signal) {
	const parsed = parseHuggingFaceSource(source);
	let file = parsed.file;
	let expectedSize;
	if (!file) {
		const tag = parsed.tag || "latest";
		const manifestUrl = `https://huggingface.co/v2/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/manifests/${encodeURIComponent(tag)}`;
		const { response, release } = await fetchWithSsrFGuard({
			url: manifestUrl,
			init: { headers: { "user-agent": "llama-cpp" } },
			signal,
			requireHttps: true,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(manifestUrl),
			auditContext: "llama-cpp-model-resolve"
		});
		try {
			if (!response.ok) throw new Error(`Cannot resolve ${source}: HTTP ${response.status}`);
			const ggufFile = asOptionalRecord(asOptionalRecord(await readProviderJsonResponse(response, "llama.cpp Hugging Face manifest"))?.ggufFile);
			file = typeof ggufFile?.rfilename === "string" ? ggufFile.rfilename : void 0;
			expectedSize = typeof ggufFile?.size === "number" ? ggufFile.size : void 0;
			if (!file) throw new Error(`Hugging Face did not return a GGUF file for ${source}`);
		} finally {
			await release();
		}
	}
	const encodedFile = file.split("/").map(encodeURIComponent).join("/");
	const url = `https://huggingface.co/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/resolve/${encodeURIComponent(parsed.revision)}/${encodedFile}?download=true`;
	const fileInfoUrl = `https://huggingface.co/api/models/${encodeURIComponent(parsed.user)}/${encodeURIComponent(parsed.repository)}/paths-info/${encodeURIComponent(parsed.revision)}`;
	const { response: fileInfoResponse, release: releaseFileInfo } = await fetchWithSsrFGuard({
		url: fileInfoUrl,
		init: {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"user-agent": "llama-cpp"
			},
			body: JSON.stringify({
				paths: [file],
				expand: false
			})
		},
		signal,
		requireHttps: true,
		policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(fileInfoUrl),
		auditContext: "llama-cpp-model-resolve"
	});
	let fileInfo;
	try {
		if (!fileInfoResponse.ok) throw new Error(`Cannot read Hugging Face integrity metadata for ${source}: HTTP ${fileInfoResponse.status}`);
		fileInfo = await readProviderJsonResponse(fileInfoResponse, "llama.cpp Hugging Face file metadata");
	} finally {
		await releaseFileInfo();
	}
	const fileRow = Array.isArray(fileInfo) ? fileInfo.map((entry) => asOptionalRecord(entry)).find((entry) => entry?.path === file) : void 0;
	const lfs = asOptionalRecord(fileRow?.lfs);
	const expectedSha256 = typeof lfs?.oid === "string" && /^[a-f\d]{64}$/iu.test(lfs.oid) ? lfs.oid.toLowerCase() : void 0;
	expectedSize = expectedSize ?? (typeof fileRow?.size === "number" ? fileRow.size : void 0);
	if (!expectedSha256) throw new Error(`Hugging Face did not publish a SHA-256 LFS identity for ${source}`);
	return {
		fileName: `hf_${[
			parsed.user,
			parsed.repository,
			parsed.revision === "main" ? "" : parsed.revision,
			...file.split("/")
		].filter(Boolean).join("_").replace(/[^a-z\d._-]+/giu, "_")}`,
		url,
		expectedSize,
		expectedSha256
	};
}
function defaultArtifact(source) {
	const recipe = resolveLlamaCppCatalogArtifact(source) ?? resolveLlamaCppMediaArtifact(source);
	if (recipe) return recipe;
	if (source === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") return {
		fileName: DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE,
		url: `https://huggingface.co/ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/resolve/${DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION}/embeddinggemma-300m-qat-Q8_0.gguf?download=true`,
		expectedSize: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES,
		expectedSha256: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256
	};
}
async function assertGguf(filePath) {
	const handle = await fsp.open(filePath, "r").catch((error) => {
		if ((error instanceof Error && "code" in error ? error.code : void 0) === "ENOENT") throw new Error(`Model file is missing: ${filePath}. Run interactive llama.cpp setup or correct params.modelPath.`, { cause: error });
		throw error;
	});
	try {
		const header = Buffer.alloc(4);
		const { bytesRead } = await handle.read(header, 0, header.length, 0);
		if (bytesRead !== 4 || header.toString("ascii") !== "GGUF") throw new Error(`Model is not a GGUF file: ${filePath}`);
	} finally {
		await handle.close();
	}
}
async function resolveModelArtifact(source, signal) {
	const known = defaultArtifact(source);
	if (known) return known;
	if (/^(?:hf|huggingface):/iu.test(source)) return await resolveHuggingFaceArtifact(source, signal);
	if (/^https:\/\//iu.test(source)) {
		const url = new URL(source);
		const fileName = path.basename(decodeURIComponent(url.pathname));
		if (!fileName.toLowerCase().includes(".gguf")) throw new Error(`Remote model URL must name a GGUF file: ${source}`);
		return {
			fileName,
			url: source
		};
	}
	throw new Error(`Unsupported remote model URI: ${source}`);
}
async function resolveCachedModelArtifact(source, cacheDir, signal) {
	const key = `${path.resolve(cacheDir)}\0${source}`;
	const artifact = resolvedModelArtifacts.get(key) ?? await resolveModelArtifact(source, signal);
	resolvedModelArtifacts.set(key, artifact);
	return artifact;
}
async function resolveLlamaCppModelDownloadSize(source, cacheDir, signal) {
	const artifact = await resolveCachedModelArtifact(source, cacheDir, signal);
	if (artifact.expectedSize !== void 0) return artifact.expectedSize;
	const result = await fetchWithSsrFGuard({
		url: artifact.url,
		init: { method: "HEAD" },
		signal,
		requireHttps: true,
		policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(artifact.url),
		auditContext: "llama-cpp-model-resolve"
	}).catch(() => {
		signal?.throwIfAborted();
	});
	if (!result) return;
	const { response, release } = result;
	try {
		const size = response.ok ? Number(response.headers.get("content-length")) : 0;
		return Number.isSafeInteger(size) && size > 0 ? size : void 0;
	} finally {
		await release();
	}
}
async function ensureLlamaCppModel(params) {
	params.signal?.throwIfAborted();
	const localSource = resolveHomePath(params.source);
	if (!/^(?:hf|huggingface|https):/iu.test(localSource)) {
		const localPath = path.isAbsolute(localSource) ? localSource : path.resolve(params.cacheDir, localSource);
		await assertGguf(localPath);
		return localPath;
	}
	const artifact = await resolveCachedModelArtifact(localSource, params.cacheDir, params.signal);
	const destination = path.join(params.cacheDir, artifact.fileName);
	let load = modelPromises.get(destination);
	if (!load) {
		const shared = (async () => {
			const exists = await fsp.stat(destination).then((stat) => stat.isFile()).catch(() => false);
			if (exists && artifact.expectedSha256 && (artifact.expectedSize === void 0 || (await fsp.stat(destination)).size === artifact.expectedSize) && await sha256File$1(destination) === artifact.expectedSha256) {
				await assertGguf(destination);
				return destination;
			}
			if (exists && !artifact.expectedSha256) {
				await assertGguf(destination);
				return destination;
			}
			if (!params.download) {
				const repair = resolveLlamaCppMediaArtifact(localSource) ? " Run openclaw models auth login --provider llama-cpp --method local-media to download and verify the missing or invalid artifact." : "";
				throw new Error(`Model is not cached at ${destination}.${repair}`);
			}
			await downloadVerifiedFile({
				url: artifact.url,
				destination,
				expectedSha256: artifact.expectedSha256,
				expectedSize: artifact.expectedSize,
				requireServerDigest: !artifact.expectedSha256,
				onProgress: params.onProgress
			});
			await assertGguf(destination);
			return destination;
		})();
		modelPromises.set(destination, shared);
		const release = () => {
			if (modelPromises.get(destination) === shared) modelPromises.delete(destination);
		};
		shared.then(release, release);
		load = shared;
	}
	return await racePromiseWithAbortSignal(load, params.signal);
}
async function writePreset(presetPath, contents) {
	await fsp.mkdir(path.dirname(presetPath), { recursive: true });
	const temporary = `${presetPath}.tmp-${randomUUID()}`;
	try {
		await fsp.writeFile(temporary, contents, { mode: 384 });
		await fsp.rename(temporary, presetPath);
	} finally {
		await fsp.rm(temporary, { force: true });
	}
}
async function updatePreset(presetPath, params) {
	await runPresetTransition(async () => {
		const existing = await fsp.readFile(presetPath, "utf8").catch((error) => {
			if (asOptionalRecord(error)?.code === "ENOENT") return;
			throw error;
		});
		const next = buildLlamaServerPreset(existing ?? params.initialContents, params);
		if (next !== existing) await writePreset(presetPath, next);
		if (params.reconcileOrigin) presetState.desiredRevisions.set(params.reconcileOrigin, `${presetPath}\0${next}`);
	});
}
async function reconcileManagedLlamaServer(params) {
	await runPresetTransition(async () => {
		const origin = new URL(params.baseUrl).origin;
		const revision = presetState.desiredRevisions.get(origin);
		if (!revision || presetState.appliedRevisions.get(origin) === revision) return;
		const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
			url: `${origin}/models?reload=1`,
			configuredLocalOriginBaseUrl: origin,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(origin),
			signal: params.signal,
			timeoutMs: LLAMA_CPP_PRESET_RELOAD_TIMEOUT_MS,
			auditContext: "llama-server-preset-reload"
		});
		try {
			if (!response.ok) throw new Error(`llama.cpp preset reload failed: HTTP ${response.status}`);
			presetState.appliedRevisions.set(origin, revision);
		} finally {
			await release();
		}
	});
}
async function findAvailableLlamaServerPort(preferred = LLAMA_CPP_DEFAULT_PORT) {
	const tryPort = async (port) => await new Promise((resolve) => {
		const server = net.createServer();
		server.unref();
		server.once("error", () => resolve(void 0));
		server.listen(port, "127.0.0.1", () => {
			const address = server.address();
			const selected = typeof address === "object" && address ? address.port : void 0;
			server.close(() => resolve(selected));
		});
	});
	return await tryPort(preferred) ?? await tryPort(0) ?? Promise.reject(/* @__PURE__ */ new Error("No loopback port is available for llama-server"));
}
function resolveLlamaCppPresetPath(service) {
	const args = service?.args ?? [];
	return args.find((arg) => arg.startsWith("--models-preset="))?.slice(16) ?? args.find((_, index) => args[index - 1] === "--models-preset") ?? service?.env?.LLAMA_ARG_MODELS_PRESET;
}
async function prepareManagedLlamaServer(params) {
	params.signal?.throwIfAborted();
	let command = params.asset ? void 0 : params.localService?.command;
	const asset = command === void 0 ? params.asset : findManagedLlamaServerAsset(command);
	if (command !== void 0 && asset) try {
		await fsp.stat(command);
	} catch (error) {
		if (asOptionalRecord(error)?.code !== "ENOENT") throw error;
		command = void 0;
	}
	command ??= (await ensureLlamaServerInstalled({
		asset,
		signal: params.signal,
		onProgress: params.onProgress
	})).command;
	params.signal?.throwIfAborted();
	const port = params.port ?? await findAvailableLlamaServerPort(params.isolated ? 0 : void 0);
	const rootUrl = `http://127.0.0.1:${port}`;
	const reconcileOrigin = params.reconcileBaseUrl ? new URL(params.reconcileBaseUrl).origin : rootUrl;
	const endpoint = {
		command,
		baseUrl: `${rootUrl}/v1`,
		healthUrl: (!params.isolated ? params.localService?.healthUrl : void 0) ?? `${rootUrl}/health`
	};
	const configuredPreset = resolveLlamaCppPresetPath(params.localService);
	if (params.localService && !params.isolated) {
		const { cwd: configuredCwd, args: configuredArgs } = params.localService;
		const signal = params.signal;
		signal?.throwIfAborted();
		if (findManagedLlamaServerAsset(command)) {
			const args = configuredArgs ?? [];
			const preset = readUniqueArgument(args, "--models-preset");
			const host = readUniqueArgument(args, "--host");
			if (preset && host && readUniqueArgument(args, "--port") === String(port)) {
				const required = /* @__PURE__ */ new Map([
					["--port", String(port)],
					["--models-preset", preset],
					["--host", host]
				]);
				const cwd = !path.isAbsolute(preset) ? path.resolve(configuredCwd ?? process.cwd()) : void 0;
				const key = JSON.stringify([
					command,
					[...required],
					cwd
				]);
				while (true) {
					let recovery = recoveries.get(key);
					if (!recovery) {
						recovery = (async () => {
							const { reapOrphanedProcesses } = await import("openclaw/plugin-sdk/process-runtime");
							await reapOrphanedProcesses({
								command,
								cwd,
								matchesArguments: (argv) => [...required].every(([name, value]) => readUniqueArgument(argv, name) === value),
								signal,
								onReap: (pid) => log.info(`reaping orphaned managed llama-server: pid=${pid} port=${port}`)
							});
							return "recovered";
						})().catch((error) => {
							recoveries.delete(key);
							if (signal?.aborted && error === signal.reason) return "cancelled";
							throw error;
						});
						recoveries.set(key, recovery);
					}
					const outcome = await recovery;
					signal?.throwIfAborted();
					if (outcome === "recovered") break;
				}
			}
		}
	}
	if (params.localService && !configuredPreset && !params.isolated) {
		await runPresetTransition(async () => {
			presetState.desiredRevisions.delete(reconcileOrigin);
			presetState.appliedRevisions.delete(reconcileOrigin);
		});
		return {
			...endpoint,
			args: params.localService.args ?? []
		};
	}
	const defaultPreset = configuredPreset ? path.resolve(params.localService?.cwd ?? process.cwd(), configuredPreset) : resolveManagedLlamaServerPaths(params.asset).presetPath;
	const presetPath = params.isolated ? path.join(path.dirname(defaultPreset), `models-${randomUUID()}.ini`) : defaultPreset;
	const initialContents = params.isolated && params.mediaModels ? await fsp.readFile(defaultPreset, "utf8").catch((error) => {
		if (!configuredPreset && asOptionalRecord(error)?.code === "ENOENT") return;
		throw error;
	}) : void 0;
	params.signal?.throwIfAborted();
	try {
		await updatePreset(presetPath, {
			chatModel: params.chatModel,
			configuredChatModelIds: params.configuredChatModelIds,
			embeddingModelPath: params.embeddingModelPath,
			defaultEmbeddingModelPath: params.defaultEmbeddingModelPath,
			reconcileOrigin: params.isolated ? void 0 : reconcileOrigin,
			mediaModels: params.mediaModels,
			serviceSettings: params.isolated && !params.mediaModels ? { env: process.env } : {
				args: params.localService?.args,
				env: {
					...process.env,
					...params.localService?.env
				}
			},
			initialContents
		});
		params.signal?.throwIfAborted();
	} catch (error) {
		if (params.isolated) await fsp.rm(presetPath, { force: true });
		throw error;
	}
	return {
		...endpoint,
		args: params.localService && !params.isolated ? params.localService.args ?? [] : params.mediaModels && params.localService ? buildIsolatedMediaRouterArgs(params.localService.args ?? [], port, presetPath) : [
			"--host",
			"127.0.0.1",
			"--port",
			String(port),
			"--models-preset",
			presetPath,
			"--models-max",
			String(params.modelsMax ?? 2),
			"--metrics",
			"--no-ui"
		]
	};
}
function buildIsolatedMediaRouterArgs(args, port, preset) {
	const values = /* @__PURE__ */ new Map([
		["--host", "127.0.0.1"],
		["--port", String(port)],
		["--models-preset", preset],
		["--models-max", "1"]
	]);
	const result = [];
	for (let index = 0; index < args.length; index++) {
		const arg = args[index];
		const key = arg.split("=", 1)[0];
		if (values.has(key)) {
			if (!arg.includes("=")) index++;
		} else result.push(arg);
	}
	return [...result, ...[...values].flat()];
}
async function ensureManagedLlamaServerForChat(params) {
	if (!params.provider.localService || !params.provider.baseUrl) return;
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	let chatModelPath = resolveCachedLlamaCppModelPath({
		model: params.model,
		provider: params.provider
	});
	chatModelPath = await ensureLlamaCppModel({
		source: chatModelPath ?? resolveLlamaCppModelSource(params.model),
		cacheDir,
		download: false,
		signal: params.signal
	});
	const projectorSource = params.model.params?.mmprojPath;
	const projectorPath = typeof projectorSource === "string" ? await ensureLlamaCppModel({
		source: projectorSource,
		cacheDir,
		download: false,
		signal: params.signal
	}) : void 0;
	const configuredContext = params.model.params?.contextSize;
	const port = Number(new URL(params.provider.baseUrl).port);
	await prepareManagedLlamaServer({
		chatModel: {
			mode: "configure",
			id: params.model.id,
			path: chatModelPath,
			contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : params.model.contextTokens,
			maxTokens: params.model.maxTokens,
			...projectorPath ? { projectorPath } : {},
			...typeof params.model.params?.imageMaxTokens === "number" ? { imageMaxTokens: params.model.params.imageMaxTokens } : {},
			...typeof params.model.params?.device === "string" ? { device: params.model.params.device } : {}
		},
		configuredChatModelIds: params.provider.models.map((model) => model.id),
		...params.provider.params?.mediaModels ? { mediaModels: [] } : { defaultEmbeddingModelPath: path.join(cacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE) },
		port: Number.isInteger(port) && port > 0 ? port : void 0,
		reconcileBaseUrl: params.provider.baseUrl,
		localService: params.provider.localService,
		signal: params.signal
	});
}
export { resolveManagedLlamaServerPaths as a, ensureLlamaCppModel, ensureManagedLlamaServerForChat, formatLlamaServerRuntimeError as i, UnsupportedLlamaServerHostError as n, selectLlamaServerAsset as o, prepareManagedLlamaServer, ensureLlamaServerInstalled as r, reconcileManagedLlamaServer, resolveLlamaCppModelDownloadSize, resolveLlamaCppPresetPath, assertMediaPresetLimits as t };
