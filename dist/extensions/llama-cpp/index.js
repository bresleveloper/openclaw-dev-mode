import { C as resolveLlamaCppDataDir, D as resolveLlamaCppSyntheticApiKey, E as resolveLlamaCppModelSource, S as resolveLegacyLlamaCppModelCacheDir, T as resolveLlamaCppModelCacheDir, _ as LLAMA_CPP_PROVIDER_ID, a as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, b as resolveCachedLlamaCppModelPath, c as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256, d as DEFAULT_LLAMA_CPP_MODEL_ID, f as DEFAULT_LLAMA_CPP_MODEL_REVISION, g as LLAMA_CPP_DEFAULT_PORT, h as DEFAULT_LLAMA_CPP_MODEL_URI, i as DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE, l as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES, m as DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES, n as resolveManagedLlamaCppProviderConfig, o as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, p as DEFAULT_LLAMA_CPP_MODEL_SHA256, r as DEFAULT_LLAMA_CPP_CONTEXT_SIZE, s as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION, u as DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE, v as LLAMA_CPP_PROVIDER_LABEL, w as resolveLlamaCppEmbeddingModel, x as resolveHomePath, y as buildLlamaCppProviderConfig } from "./.setup/managed-provider-config-BYvyYdAs.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import path from "node:path";
import { getEmbeddingProvider } from "openclaw/plugin-sdk/embedding-providers";
import os from "node:os";
import { asBoolean, asOptionalRecord, asPositiveSafeInteger, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import net from "node:net";
import { readProviderJsonResponse, readProviderTextResponse } from "openclaw/plugin-sdk/provider-http";
import { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "openclaw/plugin-sdk/ssrf-runtime";
import { fetchConfiguredLocalOriginWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime-internal";
import { execFile } from "node:child_process";
import fs$1, { constants } from "node:fs";
import { sha256File } from "@openclaw/fs-safe/durability";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { ARCHIVE_LIMIT_ERROR_CODE, ArchiveLimitError, extractArchive } from "openclaw/plugin-sdk/archive";
import { CUSTOM_LOCAL_AUTH_MARKER, applyAuthProfileConfig, buildApiKeyCredential, ensureApiKeyFromEnvOrPrompt, hasConfiguredSecretInput, isNonSecretApiKeyMarker, normalizeOptionalSecretInput, upsertAuthProfileWithLock } from "openclaw/plugin-sdk/provider-auth";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
import { removeAuthProfileConfig, removeProviderAuthProfilesWithLock, resolveApiKeyForProvider } from "openclaw/plugin-sdk/provider-auth-runtime";
import { resolveConfiguredSecretInputString } from "openclaw/plugin-sdk/secret-input-runtime";
import * as liveCatalogRuntime from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { getCachedLiveCatalogValue } from "openclaw/plugin-sdk/provider-catalog-shared";
import { SELF_HOSTED_DEFAULT_CONTEXT_WINDOW, SELF_HOSTED_DEFAULT_COST, SELF_HOSTED_DEFAULT_MAX_TOKENS, applyProviderDefaultModel, discoverOpenAICompatibleLocalModels } from "openclaw/plugin-sdk/provider-setup";
import { selectPreferredLocalModelId } from "openclaw/plugin-sdk/provider-model-shared";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { setQwenChatTemplateThinking } from "openclaw/plugin-sdk/provider-stream-shared";
import { listAgentIds, resolveAgentConfig } from "openclaw/plugin-sdk/agent-scope-runtime";
//#region extensions/llama-cpp/src/llama-server-assets.ts
const LLAMA_SERVER_RELEASE = "b10809";
const LLAMA_SERVER_COMMIT = "5266f24da75dc449bd56cbed7addb9c8e4a6a73e";
const MEBIBYTE$1 = 1048576;
const CUDA_ARCHIVE_LIMITS = {
	maxArchiveBytes: 400 * MEBIBYTE$1,
	maxExtractedBytes: 600 * MEBIBYTE$1,
	maxEntryBytes: 521 * MEBIBYTE$1
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
		executable: "llama-server.exe",
		regularFileAliases: [],
		limits: CUDA_ARCHIVE_LIMITS,
		dependencies: [{
			archive: "zip",
			archiveRoot: ".",
			name: "cudart-llama-bin-win-cuda-12.4-x64.zip",
			sha256: "8c79a9b226de4b3cacfd1f83d24f962d0773be79f1e7b75c6af4ded7e32ae1d6",
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
		}]
	},
	{
		platform: "win32",
		arch: "arm64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-arm64.zip`,
		sha256: "c1058fe5764a687275c8d20d6bbc1454e787cdbb8ebb8c37a2f959f2b144dc77",
		executable: "llama-server.exe",
		regularFileAliases: []
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-x64.zip`,
		sha256: "9df3158ed228a641a4b127942d7f459f24c9e13f04682659d05c00c80099b6b5",
		executable: "llama-server.exe",
		regularFileAliases: []
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
//#endregion
//#region extensions/llama-cpp/src/llama-server-extract.ts
const MEBIBYTE = 1048576;
const LLAMA_ARCHIVE_LIMITS = {
	maxArchiveBytes: 256 * MEBIBYTE,
	maxEntries: 1e3,
	maxExtractedBytes: 512 * MEBIBYTE,
	maxEntryBytes: 256 * MEBIBYTE,
	maxMetaEntryBytes: MEBIBYTE
};
const MAX_ALIAS_BYTES = 512 * MEBIBYTE;
function assertManifestBasename(filename) {
	if (!filename || filename === "." || filename === ".." || /[\\/]/u.test(filename) || path.basename(filename) !== filename) throw new Error(`invalid llama-server archive manifest filename: ${filename}`);
	return filename;
}
function resolveArchiveRoot(destDir, archiveRoot) {
	if (archiveRoot === ".") return destDir;
	if (path.isAbsolute(archiveRoot) || /\\/u.test(archiveRoot)) throw new Error(`invalid llama-server archive root: ${archiveRoot}`);
	const parts = archiveRoot.split("/");
	if (parts.some((part) => !part || part === "." || part === "..")) throw new Error(`invalid llama-server archive root: ${archiveRoot}`);
	return path.join(destDir, ...parts);
}
async function assertRegularFile(filePath, label) {
	const stat = await fs.lstat(filePath).catch(() => void 0);
	if (!stat?.isFile() || stat.nlink > 1) throw new Error(`llama-server archive does not contain regular ${label}`);
	return stat;
}
async function materializeAssetAliases(params) {
	const claimedNames = new Set(params.requiredFiles.map(assertManifestBasename));
	for (const file of claimedNames) await assertRegularFile(path.join(params.rootDir, file), `file ${file}`);
	let copiedBytes = 0;
	for (const [rawSource, rawAliases] of params.asset.regularFileAliases) {
		const source = assertManifestBasename(rawSource);
		if (claimedNames.has(source)) throw new Error(`duplicate llama-server archive manifest filename: ${source}`);
		claimedNames.add(source);
		const sourcePath = path.join(params.rootDir, source);
		const sourceStat = await assertRegularFile(sourcePath, `alias source ${source}`);
		for (const rawAlias of rawAliases) {
			const alias = assertManifestBasename(rawAlias);
			if (claimedNames.has(alias)) throw new Error(`duplicate llama-server archive manifest filename: ${alias}`);
			claimedNames.add(alias);
			copiedBytes += sourceStat.size;
			if (copiedBytes > MAX_ALIAS_BYTES) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.EXTRACTED_SIZE_EXCEEDS_LIMIT);
			const aliasPath = path.join(params.rootDir, alias);
			await fs.copyFile(sourcePath, aliasPath, constants.COPYFILE_EXCL);
			await fs.chmod(aliasPath, sourceStat.mode & 511);
			if ((await assertRegularFile(aliasPath, `alias ${alias}`)).size !== sourceStat.size) throw new Error(`llama-server archive alias copy is incomplete: ${alias}`);
		}
	}
}
async function extractVerifiedArchive(params) {
	const isTar = params.asset.archive === "tar.gz";
	const limits = {
		...LLAMA_ARCHIVE_LIMITS,
		...params.asset.limits
	};
	const aliasCount = params.asset.regularFileAliases.reduce((count, [, aliases]) => count + aliases.length, 0);
	if (aliasCount > limits.maxEntries) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT);
	await extractArchive({
		archivePath: params.archivePath,
		destDir: params.destDir,
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
	const rootDir = resolveArchiveRoot(params.destDir, params.asset.archiveRoot);
	await materializeAssetAliases({
		rootDir,
		asset: params.asset,
		requiredFiles: params.requiredFiles
	});
	return rootDir;
}
/** Extracts one verified asset and returns its unpublished executable path. */
async function extractLlamaServerArchive(params) {
	const rootDir = await extractVerifiedArchive({
		...params,
		requiredFiles: [params.asset.executable]
	});
	return path.join(rootDir, params.asset.executable);
}
async function extractLlamaServerDependencyArchive(params) {
	return await extractVerifiedArchive({
		...params,
		requiredFiles: params.asset.files
	});
}
//#endregion
//#region extensions/llama-cpp/src/llama-server-install.ts
const DOWNLOAD_TIMEOUT_MS = 18e5;
const VERSION_TIMEOUT_MS = 15e3;
const FRESH_VERSION_TIMEOUT_MS = 12e4;
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
function assertSupportedLinuxRuntime(asset) {
	if (asset.platform !== "linux") return;
	const header = asOptionalRecord(asOptionalRecord(process.report?.getReport())?.header);
	const glibc = typeof header?.glibcVersionRuntime === "string" ? header.glibcVersionRuntime : "";
	if (!glibc) throw new Error("The verified Ubuntu llama-server build requires glibc and cannot run on musl/Alpine. Install llama-server manually for this host and configure its absolute path.");
	const minimum = asset.arch === "arm64" ? "2.38" : "2.34";
	if (compareVersion(glibc, minimum) < 0) throw new Error(`The verified llama-server build requires glibc ${minimum}+ on Linux ${asset.arch}; this host has ${glibc}. Install a compatible llama-server manually and configure its absolute path.`);
}
function assetUrl(asset) {
	return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_SERVER_RELEASE}/${asset.name}`;
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
	if (verifiedFiles.size > VERIFIED_FILE_LIMIT) {
		const oldest = verifiedFiles.keys().next().value;
		if (oldest !== void 0) verifiedFiles.delete(oldest);
	}
}
async function sha256File$1(filePath, signal) {
	signal?.throwIfAborted();
	try {
		const identity = fileIdentity(await fs.stat(filePath, { bigint: true }));
		const verified = verifiedFiles.get(filePath);
		if (verified?.identity === identity) return verified.sha256;
		verifiedFiles.delete(filePath);
		const handle = await fs.open(filePath, "r");
		try {
			const before = fileIdentity(await handle.stat({ bigint: true }));
			const { digest: sha256 } = await sha256File(handle, { signal });
			const after = await handle.stat({ bigint: true });
			if (before !== fileIdentity(after) || before !== fileIdentity(await fs.stat(filePath, { bigint: true }))) throw new Error(`File changed during integrity verification: ${filePath}. Retry setup.`);
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
	await fs.mkdir(path.dirname(params.destination), { recursive: true });
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
			const handle = await fs.open(partialPath, "wx", 384);
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
				await fs.rename(partialPath, params.destination);
				const published = await handle.stat({ bigint: true });
				if (completed.size === published.size && completed.mtimeNs === published.mtimeNs) rememberVerifiedFile(params.destination, published, actualSha256);
			} finally {
				await handle.close();
			}
		} finally {
			await release();
		}
	} finally {
		await fs.rm(partialPath, { force: true }).catch(() => void 0);
	}
}
async function runServerCommand(command, args, signal, timeoutMs = VERSION_TIMEOUT_MS) {
	return await new Promise((resolve, reject) => {
		execFile(command, args, {
			timeout: timeoutMs,
			signal,
			windowsHide: true
		}, (error, stdout, stderr) => {
			if (error) reject(new Error(error.message, { cause: error }));
			else resolve(`${stdout}${stderr}`.trim());
		});
	});
}
function formatRuntimeDependencyError(error) {
	const detail = error instanceof Error ? error.message : String(error);
	if (process.platform === "linux") return new Error(`The verified llama-server build could not start. Install the OpenMP runtime (for example libgomp1 on Debian/Ubuntu or libgomp on Fedora), then rerun llama.cpp setup. Detail: ${detail}`, { cause: error });
	if (process.platform === "win32") return new Error(`The verified llama-server build could not start. Install the Microsoft Visual C++ 2015-2022 Redistributable, then rerun llama.cpp setup. Detail: ${detail}`, { cause: error });
	return new Error(`The verified llama-server build could not start: ${detail}`, { cause: error });
}
async function validateInstalledServer(command, asset, signal, versionTimeoutMs = VERSION_TIMEOUT_MS) {
	let version;
	try {
		version = await runServerCommand(command, ["--version"], signal, versionTimeoutMs);
	} catch (error) {
		signal?.throwIfAborted();
		throw formatRuntimeDependencyError(error);
	}
	const match = (version.split(/\r?\n/u, 1)[0]?.trim() ?? "").match(/^version: .+ \(build (\d+), commit ([a-f\d]{9})\)$/u);
	const build = match?.[1] ? Number(match[1]) : void 0;
	const commit = match?.[2];
	if (build !== 10809 || commit !== "5266f24da75dc449bd56cbed7addb9c8e4a6a73e".slice(0, 9)) throw new Error(`Unexpected llama-server build at ${command}: expected ${LLAMA_SERVER_RELEASE} (${LLAMA_SERVER_COMMIT.slice(0, 9)}), got ${version || "no version output"}`);
	if (asset.backend === "cuda") {
		const devices = await runServerCommand(command, ["--list-devices"], signal);
		if (!/^\s*CUDA\d+: .+\(\d+ MiB, \d+ MiB free\)$/mu.test(devices)) throw new Error("The verified llama-server could not initialize an NVIDIA CUDA device. Update the NVIDIA driver and rerun setup, or configure a compatible llama-server manually. CPU fallback was not activated.");
	}
}
async function installLlamaServer(asset, options) {
	options.signal?.throwIfAborted();
	assertSupportedLinuxRuntime(asset);
	const { installDir, command } = resolveManagedLlamaServerPaths(asset);
	if (await fs.stat(command).then((stat) => stat.isFile()).catch(() => false)) {
		await validateInstalledServer(command, asset, options.signal);
		return command;
	}
	const dataDir = resolveLlamaCppDataDir();
	const archivePath = path.join(dataDir, `.download-${randomUUID()}-${asset.name}`);
	const extractDir = path.join(dataDir, `.extract-${randomUUID()}`);
	await fs.mkdir(dataDir, { recursive: true });
	try {
		await downloadVerifiedFile({
			url: assetUrl(asset),
			destination: archivePath,
			expectedSha256: asset.sha256,
			signal: options.signal,
			onProgress: options.onProgress
		});
		const serverExtractDir = path.join(extractDir, "server");
		await fs.mkdir(serverExtractDir, { recursive: true });
		const extractedCommand = await extractLlamaServerArchive({
			archivePath,
			destDir: serverExtractDir,
			asset
		});
		const extractedRoot = path.dirname(extractedCommand);
		for (const [index, dependency] of (asset.dependencies ?? []).entries()) {
			options.signal?.throwIfAborted();
			const dependencyArchive = path.join(extractDir, dependency.name);
			await downloadVerifiedFile({
				url: assetUrl(dependency),
				destination: dependencyArchive,
				expectedSha256: dependency.sha256,
				signal: options.signal,
				onProgress: options.onProgress
			});
			const dependencyExtractDir = path.join(extractDir, `dependency-${index}`);
			await fs.mkdir(dependencyExtractDir);
			const dependencyRoot = await extractLlamaServerDependencyArchive({
				archivePath: dependencyArchive,
				destDir: dependencyExtractDir,
				asset: dependency
			});
			for (const file of dependency.files) await fs.copyFile(path.join(dependencyRoot, file), path.join(extractedRoot, file), fs$1.constants.COPYFILE_EXCL);
		}
		options.signal?.throwIfAborted();
		await fs.chmod(extractedCommand, 493);
		await validateInstalledServer(extractedCommand, asset, options.signal, FRESH_VERSION_TIMEOUT_MS);
		await fs.mkdir(path.dirname(installDir), { recursive: true });
		options.signal?.throwIfAborted();
		await fs.rm(installDir, {
			recursive: true,
			force: true
		});
		await fs.rename(extractedRoot, installDir);
		await validateInstalledServer(command, asset, options.signal);
		return command;
	} finally {
		await Promise.all([fs.rm(archivePath, { force: true }), fs.rm(extractDir, {
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
	return {
		command: previous && options.signal ? await new Promise((resolve, reject) => {
			const signal = options.signal;
			const onAbort = () => reject(toErrorObject(signal?.reason, "Installation cancelled"));
			signal?.addEventListener("abort", onAbort, { once: true });
			pending.then(resolve, reject).finally(() => signal?.removeEventListener("abort", onAbort));
			if (signal?.aborted) onAbort();
		}) : await pending,
		asset
	};
}
//#endregion
//#region extensions/llama-cpp/src/llama-server-preset.ts
const LLAMA_CPP_EMBEDDING_UBATCH_SIZE = 2048;
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
	LLAMA_ARG_EMBEDDINGS: "embedding"
};
function updateModelSection(sections, id, values, newline) {
	assertIniValue(id, "llama.cpp model id");
	if (id.includes("]")) throw new Error("llama.cpp model ids cannot contain ]");
	const name = [...sections.keys()].filter((candidate) => normalizePresetName(candidate) === normalizePresetName(id)).toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))).at(-1) ?? id;
	const pending = new Set(Object.keys(values));
	let contents = (sections.get(name) ?? `[${id}]${newline}`).replace(/(?<![^\r\n])([a-zA-Z_][a-zA-Z0-9_.-]*)([ \t]*=[ \t]*)([^\r\n]*?)([ \t]*(?:[;#][^\r\n]*)?)(\r\n|\n|\r|(?![\s\S]))/g, (line, key, separator, _value, comment, ending) => {
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
	if (params.chatModel.mode === "configure") updateModelSection(sections, params.chatModel.id, {
		model: assertIniValue(params.chatModel.path, "llama.cpp model path"),
		"ctx-size": String(params.chatModel.contextSize ?? 65536),
		"n-predict": String(params.chatModel.maxTokens ?? 2048),
		jinja: "true"
	}, newline);
	const embeddingPath = params.embeddingModelPath ?? (!sections.has("embeddinggemma-300m-qat-q8_0") ? params.defaultEmbeddingModelPath : void 0);
	if (embeddingPath) {
		const isDefault = params.embeddingModelPath ? params.embeddingModelIsDefault : true;
		updateModelSection(sections, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID, {
			model: assertIniValue(embeddingPath, "llama.cpp embedding model path"),
			...isDefault ? { "ubatch-size": String(LLAMA_CPP_EMBEDDING_UBATCH_SIZE) } : {},
			embedding: "true"
		}, newline);
	}
	const embeddingSection = sections.get(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID);
	if (!embeddingSection) throw new Error("llama.cpp embedding model path is required for a new managed preset");
	sections.delete(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID);
	const orderedSections = [...[...sections].toSorted(([left], [right]) => Number(left > right) - Number(left < right)).map(([, section]) => section), embeddingSection];
	return header + (header && !/[\r\n]$/u.test(header) ? newline : "") + orderedSections.map((section) => section.replace(/[\r\n]+$/u, "")).join(newline + newline) + newline;
}
//#endregion
//#region extensions/llama-cpp/src/hardware.ts
const GIB$1 = 1024 ** 3;
const MIB = 1024 ** 2;
async function runHardwareProbe(command, args, signal) {
	try {
		return await new Promise((resolve, reject) => {
			execFile(command, args, {
				encoding: "utf8",
				timeout: 3e3,
				maxBuffer: 65536,
				signal
			}, (error, stdout) => error ? reject(error) : resolve(stdout));
		});
	} catch {
		signal?.throwIfAborted();
		return;
	}
}
async function readAvailableMemory(platform, signal) {
	if (platform === "linux") {
		const meminfo = await fs.readFile("/proc/meminfo", "utf8").catch(() => "");
		const available = /^MemAvailable:\s+(\d+)\s+kB$/mu.exec(meminfo)?.[1];
		if (available) return Number(available) * 1024;
	}
	if (platform === "darwin") {
		const vmstat = await runHardwareProbe("/usr/bin/vm_stat", [], signal);
		const pageSize = /page size of (\d+) bytes/u.exec(vmstat ?? "")?.[1];
		const free = /^Pages free:\s+(\d+)\./mu.exec(vmstat ?? "")?.[1];
		const inactive = /^Pages inactive:\s+(\d+)\./mu.exec(vmstat ?? "")?.[1];
		if (pageSize && free && inactive) return (Number(free) + Number(inactive)) * Number(pageSize);
	}
	return os.freemem();
}
async function readAvailableDisk(cacheDir, platform, signal) {
	let directory = path.resolve(cacheDir);
	while (true) try {
		const [capacity, stat] = await Promise.all([fs.statfs(directory), fs.stat(directory)]);
		let capacityGroup = `device:${stat.dev}`;
		if (platform === "linux" && ![
			61267,
			1481003842,
			4076150800
		].includes(capacity.type)) capacityGroup = void 0;
		if (platform === "darwin") {
			const disk = /^\/dev\/(disk\d+(?:s\d+)*)\s/mu.exec(await runHardwareProbe("/bin/df", ["-P", directory], signal) ?? "")?.[1];
			const info = disk ? await runHardwareProbe("/usr/sbin/diskutil", [
				"info",
				"-plist",
				disk
			], signal) : void 0;
			const container = /<key>APFSContainerReference<\/key>\s*<string>(disk\d+)<\/string>/u.exec(info ?? "")?.[1];
			const filesystem = /<key>FilesystemType<\/key>\s*<string>([^<]+)<\/string>/u.exec(info ?? "")?.[1];
			capacityGroup = container ? `apfs:${container}` : filesystem && filesystem !== "apfs" ? capacityGroup : void 0;
		}
		return {
			availableBytes: capacity.bavail * capacity.bsize,
			capacityGroup
		};
	} catch (error) {
		signal?.throwIfAborted();
		const code = error instanceof Error && "code" in error ? error.code : void 0;
		const parent = path.dirname(directory);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parent === directory) return;
		directory = parent;
	}
}
async function readAccelerator(platform, arch, signal) {
	if (platform === "darwin" && arch === "arm64") return { kind: "metal" };
	if (platform !== "linux" && platform !== "win32") return {
		kind: "cpu",
		reason: "No managed GPU backend is available for this host."
	};
	const devices = ((await runHardwareProbe("nvidia-smi", ["--query-gpu=name,memory.total,memory.free,driver_version,compute_cap", "--format=csv,noheader,nounits"], signal))?.trim().split(/\r?\n/u) ?? []).slice(0, 32).flatMap((line) => {
		const fields = line.split(",").map((field) => field.trim());
		const [total, available, driverVersion, compute] = fields.slice(-4);
		const name = fields.slice(0, -4).join(", ");
		const totalMemoryBytes = Number(total) * MIB;
		const availableMemoryBytes = Number(available) * MIB;
		const computeCapability = Number(compute);
		if (!name || !driverVersion || !/^\d+(?:\.\d+)+$/u.test(driverVersion) || !Number.isFinite(totalMemoryBytes) || !Number.isFinite(availableMemoryBytes) || totalMemoryBytes <= 0 || availableMemoryBytes < 0 || availableMemoryBytes > totalMemoryBytes) return [];
		return [{
			name,
			totalMemoryBytes,
			availableMemoryBytes,
			driverVersion,
			...Number.isFinite(computeCapability) && computeCapability > 0 ? { computeCapability } : {}
		}];
	});
	return devices.length > 0 ? {
		kind: "cuda",
		devices
	} : {
		kind: "cpu",
		reason: "nvidia-smi did not report a usable NVIDIA GPU."
	};
}
/** Read the Gateway host once during setup; never probe on inference requests. */
async function detectLlamaCppHardware(params) {
	params.signal?.throwIfAborted();
	const platform = os.platform();
	const arch = os.arch();
	const hostMemoryBytes = os.totalmem();
	const constrainedMemory = process.constrainedMemory();
	const constrained = constrainedMemory > 0 && constrainedMemory < hostMemoryBytes;
	const totalMemoryBytes = constrained ? constrainedMemory : hostMemoryBytes;
	const [availableMemory, modelDisk, runtimeDisk, accelerator] = await Promise.all([
		readAvailableMemory(platform, params.signal),
		readAvailableDisk(params.cacheDir, platform, params.signal),
		readAvailableDisk(resolveLlamaCppDataDir(), platform, params.signal),
		readAccelerator(platform, arch, params.signal)
	]);
	params.signal?.throwIfAborted();
	return {
		platform,
		arch,
		totalMemoryBytes,
		availableMemoryBytes: Math.min(totalMemoryBytes, availableMemory, constrained ? process.availableMemory() : totalMemoryBytes),
		availableDiskBytes: modelDisk?.availableBytes,
		availableRuntimeDiskBytes: runtimeDisk?.availableBytes,
		sharedDisk: !modelDisk?.capacityGroup || !runtimeDisk?.capacityGroup || modelDisk.capacityGroup === runtimeDisk.capacityGroup,
		accelerator
	};
}
function formatLlamaCppMemory(bytes) {
	return `${(bytes / GIB$1).toFixed(1).replace(/\.0$/u, "")} GiB`;
}
//#endregion
//#region extensions/llama-cpp/src/model-catalog.ts
const GIB = 1024 ** 3;
function modelRecipe(params) {
	const source = params.source ?? `hf:${params.repository}/${params.file}#${params.revision}`;
	return {
		model: {
			id: params.id,
			name: params.name,
			api: "openai-completions",
			reasoning: params.reasoning ?? false,
			input: ["text"],
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0
			},
			contextWindow: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
			contextTokens: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
			maxTokens: params.maxTokens ?? 2048,
			params: {
				modelPath: source,
				contextSize: DEFAULT_LLAMA_CPP_CONTEXT_SIZE
			},
			compat: {
				supportsTools: true,
				supportsUsageInStreaming: true,
				toolSchemaProfile: "llamacpp"
			}
		},
		sizeBytes: params.sizeBytes,
		memoryBytes: params.memoryGiB * GIB,
		minimumSystemMemoryBytes: params.minimumSystemGiB * GIB,
		requiresAcceleration: params.requiresAcceleration ?? false,
		artifact: {
			fileName: params.cacheFile ?? `hf_${params.repository.replaceAll("/", "_")}_${params.revision}_${params.file}`,
			url: `https://huggingface.co/${params.repository}/resolve/${params.revision}/${params.file}?download=true`,
			expectedSize: params.sizeBytes,
			expectedSha256: params.sha256
		}
	};
}
const LLAMA_CPP_MODEL_RECIPES = [
	modelRecipe({
		id: "qwen3.8-27b-ud-q4_k_m",
		name: "Qwen3.8 27B (UD-Q4_K_M)",
		repository: "unsloth/Qwen3.8-27B-GGUF",
		file: "Qwen3.8-27B-UD-Q4_K_M.gguf",
		revision: "4ca720788d1e01f1bff70c033e0d0028fd02e502",
		sha256: "322e194ff79741c7baa497c240f677f54b201b0efab44ca8e50f122b39123482",
		sizeBytes: 16464440224,
		memoryGiB: 22,
		minimumSystemGiB: 32,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "muse-glimmer-30b-q4_k_m",
		name: "Muse Glimmer 30B (Q4_K_M)",
		repository: "meta-models/Muse-Glimmer-30B-GGUF",
		file: "Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf",
		revision: "70bf1b61ac09f91b24d39038091b41c582bc5d7a",
		sha256: "4cc57c0f51040a226e5a72cc47b7613f7772950e460a665f7083de89f183f60e",
		sizeBytes: 16756683904,
		memoryGiB: 20,
		minimumSystemGiB: 32,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "gemma-4-26b-a4b-it-ud-q4_k_m",
		name: "Gemma 4 26B A4B (UD-Q4_K_M)",
		repository: "unsloth/gemma-4-26B-A4B-it-GGUF",
		file: "gemma-4-26B-A4B-it-UD-Q4_K_M.gguf",
		revision: "c099eb48e663fd284577b04978a94ffccb261841",
		sha256: "f2c28b3dc4776931ac6f879e11f203dec637ea0f14267a86ec8f6165f63f293f",
		sizeBytes: 16947541728,
		memoryGiB: 22,
		minimumSystemGiB: 32,
		requiresAcceleration: true
	}),
	modelRecipe({
		id: "gemma-4-12b-it-q4_k_m",
		name: "Gemma 4 12B (Q4_K_M)",
		repository: "unsloth/gemma-4-12b-it-GGUF",
		file: "gemma-4-12b-it-Q4_K_M.gguf",
		revision: "fc034cfff751157913579611efad8462ac1be606",
		sha256: "0a270ec9fe6b34f4a0d33992b6135117b484ebc4766ab76b51d4ae8c457e4c42",
		sizeBytes: 7121861440,
		memoryGiB: 12,
		minimumSystemGiB: 24,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "qwen3.5-9b-q4_k_m",
		name: "Qwen3.5 9B (Q4_K_M)",
		repository: "unsloth/Qwen3.5-9B-GGUF",
		file: "Qwen3.5-9B-Q4_K_M.gguf",
		revision: "3885219b6810b007914f3a7950a8d1b469d598a5",
		sha256: "03b74727a860a56338e042c4420bb3f04b2fec5734175f4cb9fa853daf52b7e8",
		sizeBytes: 5680522464,
		memoryGiB: 10,
		minimumSystemGiB: 16,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: DEFAULT_LLAMA_CPP_MODEL_ID,
		name: "Gemma 4 E4B (Q4_K_M)",
		repository: "unsloth/gemma-4-E4B-it-GGUF",
		file: "gemma-4-E4B-it-Q4_K_M.gguf",
		revision: DEFAULT_LLAMA_CPP_MODEL_REVISION,
		sha256: DEFAULT_LLAMA_CPP_MODEL_SHA256,
		sizeBytes: DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES,
		memoryGiB: 10,
		minimumSystemGiB: 16,
		source: DEFAULT_LLAMA_CPP_MODEL_URI,
		cacheFile: DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE
	}),
	modelRecipe({
		id: "qwen3.5-4b-q4_k_m",
		name: "Qwen3.5 4B (Q4_K_M)",
		repository: "unsloth/Qwen3.5-4B-GGUF",
		file: "Qwen3.5-4B-Q4_K_M.gguf",
		revision: "e87f176479d0855a907a41277aca2f8ee7a09523",
		sha256: "00fe7986ff5f6b463e62455821146049db6f9313603938a70800d1fb69ef11a4",
		sizeBytes: 2740937888,
		memoryGiB: 6,
		minimumSystemGiB: 8,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "gemma-4-e2b-it-q4_k_m",
		name: "Gemma 4 E2B (Q4_K_M)",
		repository: "unsloth/gemma-4-E2B-it-GGUF",
		file: "gemma-4-E2B-it-Q4_K_M.gguf",
		revision: "0314792d7f1f7e229411f620751375812bb9faf2",
		sha256: "740185b21d22ceb83a11c3aa62ad5842ef32c70f6096d756bbee85a1e4ec34b8",
		sizeBytes: 3106738272,
		memoryGiB: 6,
		minimumSystemGiB: 8
	})
];
function resolveLlamaCppCatalogArtifact(source) {
	return LLAMA_CPP_MODEL_RECIPES.find((recipe) => recipe.model.params?.modelPath === source)?.artifact;
}
function resolveLlamaCppModelCandidates(hardware, backend) {
	const systemBudget = Math.min(hardware.availableMemoryBytes, hardware.totalMemoryBytes - Math.max(2 * GIB, hardware.totalMemoryBytes * .25));
	const gpuBudget = hardware.accelerator.kind === "cuda" ? Math.max(0, ...hardware.accelerator.devices.map((device) => Math.min(device.availableMemoryBytes, device.totalMemoryBytes - Math.max(GIB, device.totalMemoryBytes * .1)))) : 0;
	const memoryBudgetBytes = backend === "cuda" ? Math.min(systemBudget, gpuBudget) : systemBudget;
	return {
		recipes: LLAMA_CPP_MODEL_RECIPES.filter((recipe) => (!recipe.requiresAcceleration || backend !== "cpu") && hardware.totalMemoryBytes >= recipe.minimumSystemMemoryBytes && memoryBudgetBytes >= recipe.memoryBytes),
		memoryBudgetBytes
	};
}
function recommendLlamaCppModel(hardware, backend, cached = {}) {
	if (hardware.availableDiskBytes === void 0 || hardware.availableRuntimeDiskBytes === void 0) return {
		kind: "unavailable",
		reason: "Cannot measure free space in the model cache or runtime directory. Check their permissions and retry setup."
	};
	const { recipes: candidates, memoryBudgetBytes } = resolveLlamaCppModelCandidates(hardware, backend);
	const runtimeDiskBytes = cached.runtime ? 0 : (backend === "cuda" ? 3 : 2) * GIB;
	if (!hardware.sharedDisk && hardware.availableRuntimeDiskBytes < runtimeDiskBytes) return {
		kind: "unavailable",
		reason: "There is not enough free disk space in the runtime directory. Free space on that volume and retry setup."
	};
	const modelDiskBudget = hardware.sharedDisk ? Math.min(hardware.availableDiskBytes, hardware.availableRuntimeDiskBytes) - runtimeDiskBytes : hardware.availableDiskBytes;
	for (const recipe of candidates) {
		const modelDiskBytes = (cached.modelIds?.has(recipe.model.id) ? 0 : recipe.sizeBytes) + (cached.embedding ? 0 : DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES);
		if (modelDiskBudget < modelDiskBytes) continue;
		const placement = backend === "metal" ? "Metal unified memory" : backend === "cuda" ? "NVIDIA GPU memory" : "CPU memory";
		return {
			kind: "recommended",
			recipe,
			memoryBudgetBytes,
			requiredDiskBytes: modelDiskBytes + runtimeDiskBytes,
			reason: `${recipe.model.name} fits the ${formatLlamaCppMemory(memoryBudgetBytes)} ${placement} budget with a 64K context. Runtime verification checks the actual model before activation.`
		};
	}
	return {
		kind: "unavailable",
		reason: candidates.length > 0 ? "There is not enough free disk space for a recommended model, embeddings, and the runtime. Free space in the model cache and retry setup." : `No recommended model fits the current ${formatLlamaCppMemory(Math.max(0, memoryBudgetBytes))} memory budget. Close other applications and retry, or configure an existing GGUF or external server.`
	};
}
//#endregion
//#region extensions/llama-cpp/src/managed-server.ts
const modelPromises = /* @__PURE__ */ new Map();
const resolvedModelArtifacts = /* @__PURE__ */ new Map();
const presetState = {
	appliedRevisions: /* @__PURE__ */ new Map(),
	desiredRevisions: /* @__PURE__ */ new Map(),
	transition: Promise.resolve()
};
const LLAMA_CPP_PRESET_RELOAD_TIMEOUT_MS = 15e3;
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
	const recipe = resolveLlamaCppCatalogArtifact(source);
	if (recipe) return recipe;
	if (source === "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") return {
		fileName: DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE,
		url: `https://huggingface.co/ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/resolve/${DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION}/embeddinggemma-300m-qat-Q8_0.gguf?download=true`,
		expectedSize: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES,
		expectedSha256: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256
	};
}
async function assertGguf(filePath) {
	const handle = await fs.open(filePath, "r").catch((error) => {
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
async function ensureLlamaCppModel(params) {
	const localSource = resolveHomePath(params.source);
	if (!/^(?:hf|huggingface|https):/iu.test(localSource)) {
		const localPath = path.isAbsolute(localSource) ? localSource : path.resolve(params.cacheDir, localSource);
		await assertGguf(localPath);
		return localPath;
	}
	const artifactCacheKey = `${path.resolve(params.cacheDir)}\0${localSource}`;
	const artifact = resolvedModelArtifacts.get(artifactCacheKey) ?? await resolveModelArtifact(localSource, params.signal);
	resolvedModelArtifacts.set(artifactCacheKey, artifact);
	const destination = path.join(params.cacheDir, artifact.fileName);
	const load = modelPromises.get(destination) ?? (async () => {
		const exists = await fs.stat(destination).then((stat) => stat.isFile()).catch(() => false);
		if (exists && artifact.expectedSha256 && await sha256File$1(destination, params.signal) === artifact.expectedSha256) return destination;
		if (exists && !artifact.expectedSha256) {
			await assertGguf(destination);
			return destination;
		}
		if (!params.download) throw new Error(`Model is not cached at ${destination}`);
		await downloadVerifiedFile({
			url: artifact.url,
			destination,
			expectedSha256: artifact.expectedSha256,
			expectedSize: artifact.expectedSize,
			requireServerDigest: !artifact.expectedSha256,
			signal: params.signal,
			onProgress: params.onProgress
		});
		await assertGguf(destination);
		return destination;
	})();
	modelPromises.set(destination, load);
	try {
		return await load;
	} finally {
		if (modelPromises.get(destination) === load) modelPromises.delete(destination);
	}
}
async function writePreset(presetPath, contents) {
	await fs.mkdir(path.dirname(presetPath), { recursive: true });
	const temporary = `${presetPath}.tmp-${randomUUID()}`;
	try {
		await fs.writeFile(temporary, contents, { mode: 384 });
		await fs.rename(temporary, presetPath);
	} finally {
		await fs.rm(temporary, { force: true });
	}
}
async function runPresetTransition(run) {
	const pending = presetState.transition.catch(() => void 0).then(run);
	presetState.transition = pending;
	await pending;
}
async function updatePreset(presetPath, params) {
	await runPresetTransition(async () => {
		const existing = await fs.readFile(presetPath, "utf8").catch((error) => {
			if (asOptionalRecord(error)?.code === "ENOENT") return;
			throw error;
		});
		const next = buildLlamaServerPreset(existing, params);
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
async function prepareManagedLlamaServer(params) {
	params.signal?.throwIfAborted();
	const command = params.localService?.command ?? (await ensureLlamaServerInstalled({
		asset: params.asset,
		signal: params.signal,
		onProgress: params.onProgress
	})).command;
	const port = params.port ?? await findAvailableLlamaServerPort(params.isolated ? 0 : void 0);
	const rootUrl = `http://127.0.0.1:${port}`;
	const reconcileOrigin = params.reconcileBaseUrl ? new URL(params.reconcileBaseUrl).origin : rootUrl;
	const endpoint = {
		command,
		baseUrl: `${rootUrl}/v1`,
		healthUrl: params.localService?.healthUrl ?? `${rootUrl}/health`
	};
	const configuredPreset = params.localService?.args?.find((_, index, args) => args[index - 1] === "--models-preset") ?? params.localService?.env?.LLAMA_ARG_MODELS_PRESET;
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
	await updatePreset(presetPath, {
		chatModel: params.chatModel,
		configuredChatModelIds: params.configuredChatModelIds,
		embeddingModelIsDefault: params.embeddingModelIsDefault,
		embeddingModelPath: params.embeddingModelPath,
		defaultEmbeddingModelPath: params.defaultEmbeddingModelPath,
		reconcileOrigin: params.isolated ? void 0 : reconcileOrigin
	});
	params.signal?.throwIfAborted();
	return {
		...endpoint,
		args: params.localService && !params.isolated ? params.localService.args ?? [] : [
			"--host",
			"127.0.0.1",
			"--port",
			String(port),
			"--models-preset",
			presetPath,
			"--models-max",
			"2",
			"--metrics",
			"--no-ui"
		]
	};
}
async function ensureManagedLlamaServerForChat(params) {
	if (!params.provider.localService || !params.provider.baseUrl) return;
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	let chatModelPath = resolveCachedLlamaCppModelPath({
		model: params.model,
		provider: params.provider
	});
	if (!chatModelPath && resolveLlamaCppModelSource(params.model) === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") {
		const legacy = path.join(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
		if (await fs.stat(legacy).then((stat) => stat.isFile()).catch(() => false)) chatModelPath = legacy;
	}
	chatModelPath = await ensureLlamaCppModel({
		source: chatModelPath ?? resolveLlamaCppModelSource(params.model),
		cacheDir,
		download: false
	});
	const configuredContext = params.model.params?.contextSize;
	const port = Number(new URL(params.provider.baseUrl).port);
	await prepareManagedLlamaServer({
		chatModel: {
			mode: "configure",
			id: params.model.id,
			path: chatModelPath,
			contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : params.model.contextTokens,
			maxTokens: params.model.maxTokens
		},
		configuredChatModelIds: params.provider.models.map((model) => model.id),
		defaultEmbeddingModelPath: path.join(cacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE),
		port: Number.isInteger(port) && port > 0 ? port : void 0,
		reconcileBaseUrl: params.provider.baseUrl,
		localService: params.provider.localService
	});
}
async function fetchEndpoint(url, accept) {
	try {
		const configuredLocalOriginBaseUrl = new URL(url).origin;
		const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
			url,
			configuredLocalOriginBaseUrl,
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(configuredLocalOriginBaseUrl),
			timeoutMs: 2500,
			auditContext: "llama-server-inspect"
		});
		try {
			if (!response.ok) return { ok: false };
			return {
				ok: true,
				value: accept === "json" ? await readProviderJsonResponse(response, "llama-server inspection") : await readProviderTextResponse(response, "llama-server inspection")
			};
		} finally {
			await release();
		}
	} catch {
		return { ok: false };
	}
}
async function inspectLlamaServerRuntime(params) {
	const root = params.baseUrl.replace(/\/v1\/?$/u, "").replace(/\/+$/u, "");
	const query = `model=${encodeURIComponent(params.modelId)}&autoload=false`;
	const [health, models, props, metrics] = await Promise.all([
		fetchEndpoint(`${root}/health`, "json"),
		fetchEndpoint(`${root}/models`, "json"),
		fetchEndpoint(`${root}/props?${query}`, "json"),
		fetchEndpoint(`${root}/metrics?${query}`, "text")
	]);
	const propsRecord = asOptionalRecord(props.value);
	const modalities = asOptionalRecord(propsRecord?.modalities);
	const modelsRecord = asOptionalRecord(models.value);
	const selected = (Array.isArray(modelsRecord?.data) ? modelsRecord.data : []).map((row) => asOptionalRecord(row)).find((row) => row?.id === params.modelId);
	const pathValue = typeof propsRecord?.model_path === "string" ? propsRecord.model_path : typeof selected?.path === "string" ? selected.path : void 0;
	return {
		engine: "llama.cpp",
		state: health.ok && models.ok && props.ok && metrics.ok && !params.loadError ? "ready" : "failed",
		backend: params.backend,
		buildInfo: typeof propsRecord?.build_info === "string" ? propsRecord.build_info : void 0,
		model: {
			id: params.modelId,
			...pathValue ? { path: pathValue } : {}
		},
		capabilities: {
			vision: modalities?.vision === true,
			draft: false
		},
		endpoints: {
			health: health.ok ? "ready" : "unavailable",
			models: models.ok ? "ready" : "unavailable",
			props: props.ok ? "ready" : "unavailable",
			metrics: metrics.ok ? "ready" : "unavailable"
		},
		...params.loadError ? { loadError: params.loadError } : {}
	};
}
//#endregion
//#region extensions/llama-cpp/src/embedding-provider.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function readLocalOptions(options) {
	return options.local ?? {};
}
function readIdentityLocalOptions(options) {
	const local = readLocalOptions(options);
	const provider = options.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	return provider?.localService ? {
		...local,
		modelCacheDir: resolveLlamaCppModelCacheDir(provider)
	} : local;
}
function createCacheKeyData(model, dimensions) {
	return {
		provider: "local",
		model,
		...typeof dimensions === "number" ? { outputDimensionality: dimensions } : {}
	};
}
function resolveModelIdentity(local, dimensions) {
	const embeddingModel = resolveLlamaCppEmbeddingModel(local);
	const configuredCacheDir = embeddingModel.cacheDir;
	const currentDefaultPath = path.resolve(configuredCacheDir, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE);
	const legacyDefaultPath = path.resolve(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE);
	if (!embeddingModel.isDefault) return {
		model: embeddingModel.source,
		cacheKeyData: createCacheKeyData(embeddingModel.source, dimensions),
		aliases: []
	};
	const aliases = /* @__PURE__ */ new Set([
		currentDefaultPath,
		legacyDefaultPath,
		DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE
	]);
	if (embeddingModel.source !== "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf") aliases.add(embeddingModel.source);
	return {
		model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
		cacheKeyData: createCacheKeyData(DEFAULT_LLAMA_CPP_EMBEDDING_MODEL, dimensions),
		aliases: [...aliases].map((model) => ({
			model,
			cacheKeyData: createCacheKeyData(model, dimensions)
		}))
	};
}
function resolveConfiguredProvider(options) {
	return resolveManagedLlamaCppProviderConfig(options.config);
}
function resolveProviderPort(provider) {
	const port = Number(new URL(provider.baseUrl ?? "").port);
	if (!Number.isInteger(port) || port <= 0) throw new Error("Managed llama.cpp provider baseUrl must include a loopback port.");
	return port;
}
async function prepareEmbeddingServer(options, embeddingSource, embeddingModelIsDefault) {
	const provider = resolveConfiguredProvider(options);
	const embeddingModelPath = await ensureLlamaCppModel({
		source: embeddingSource,
		cacheDir: resolveLlamaCppModelCacheDir(provider),
		download: true
	});
	await prepareManagedLlamaServer({
		chatModel: { mode: "preserve" },
		configuredChatModelIds: provider.models.map((model) => model.id),
		embeddingModelIsDefault,
		embeddingModelPath,
		port: resolveProviderPort(provider),
		reconcileBaseUrl: provider.baseUrl,
		localService: provider.localService
	});
}
function wrapProvider(params) {
	let runtimeFacts;
	const refreshFacts = async (loadError) => {
		runtimeFacts = await inspectLlamaServerRuntime({
			baseUrl: params.baseUrl,
			modelId: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			loadError
		});
	};
	const withFacts = async (operation) => {
		try {
			const value = await operation();
			await refreshFacts();
			return value;
		} catch (error) {
			await refreshFacts(error instanceof Error ? error.message : String(error));
			throw error;
		}
	};
	const wrapped = {
		id: "local",
		model: params.canonicalModel,
		dimensions: params.provider.dimensions,
		maxInputTokens: params.provider.maxInputTokens,
		embed: async (input, callOptions) => await withFacts(async () => await params.provider.embed(input, callOptions)),
		embedBatch: async (inputs, callOptions) => await withFacts(async () => await params.provider.embedBatch(inputs, callOptions)),
		close: params.provider.close
	};
	Object.defineProperty(wrapped, LOCAL_EMBEDDING_RUNTIME_FACTS, {
		enumerable: false,
		value: () => runtimeFacts
	});
	return wrapped;
}
const llamaCppEmbeddingProviderAdapter = {
	id: "local",
	defaultModel: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL,
	transport: "local",
	formatSetupError: (error) => `Managed local embeddings are unavailable. Run \`openclaw configure\`, choose llama.cpp, and retry. ${error instanceof Error ? error.message : String(error)}`,
	resolveIndexIdentity: (options) => {
		return resolveModelIdentity(readIdentityLocalOptions(options), options.dimensions);
	},
	create: async (options) => {
		const local = readIdentityLocalOptions(options);
		const embeddingModel = resolveLlamaCppEmbeddingModel(local);
		const identity = resolveModelIdentity(local, options.dimensions);
		await prepareEmbeddingServer(options, embeddingModel.source, embeddingModel.isDefault);
		const genericAdapter = getEmbeddingProvider("openai-compatible", options.config);
		if (!genericAdapter) throw new Error("OpenAI-compatible embedding transport is unavailable.");
		const acquireLocalService = options.acquireLocalService;
		const result = await genericAdapter.create({
			...options,
			provider: LLAMA_CPP_PROVIDER_ID,
			model: DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID,
			remote: void 0,
			...acquireLocalService ? { acquireLocalService: (...[target, signal]) => acquireLocalService({
				...target,
				reconcile: reconcileManagedLlamaServer
			}, signal) } : {}
		});
		if (!result.provider) return result;
		return {
			provider: wrapProvider({
				provider: result.provider,
				canonicalModel: identity.model,
				baseUrl: resolveConfiguredProvider(options).baseUrl ?? ""
			}),
			runtime: {
				id: "local",
				inlineQueryTimeoutMs: 3e5,
				inlineBatchTimeoutMs: 6e5,
				cacheKeyData: identity.cacheKeyData,
				...identity.aliases.length > 0 ? { indexIdentityAliases: identity.aliases } : {}
			}
		};
	}
};
//#endregion
//#region extensions/llama-cpp/src/external-server/auth.ts
function hasLlamaServerAuthorizationHeader(headers) {
	const record = asOptionalRecord(headers);
	if (!record) return false;
	return Object.entries(record).some(([name, value]) => name.trim().toLowerCase() === "authorization" && hasConfiguredSecretInput(value));
}
function shouldUseLlamaServerSyntheticAuth(providerConfig) {
	const apiKey = normalizeOptionalSecretInput(providerConfig?.apiKey)?.trim();
	return !(hasConfiguredSecretInput(providerConfig?.apiKey) && apiKey !== resolveLlamaCppSyntheticApiKey() && apiKey !== CUSTOM_LOCAL_AUTH_MARKER);
}
async function resolveLlamaServerProviderHeaders(params) {
	const headers = asOptionalRecord(params.headers);
	if (!headers) return;
	const resolved = {};
	for (const [name, value] of Object.entries(headers)) {
		if (!params.config) {
			if (typeof value === "string" && value.trim()) resolved[name] = value.trim();
			continue;
		}
		const path = `models.providers.${LLAMA_CPP_PROVIDER_ID}.headers[${JSON.stringify(name)}]`;
		const header = await resolveConfiguredSecretInputString({
			config: params.config,
			env: params.env ?? process.env,
			value,
			path,
			unresolvedReasonStyle: "detailed"
		});
		if (header.unresolvedRefReason) throw new Error(`${path}: ${header.unresolvedRefReason}`);
		if (header.value) resolved[name] = header.value;
	}
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
async function resolveLlamaServerRuntimeApiKey(params) {
	const apiKey = (await resolveApiKeyForProvider({
		provider: LLAMA_CPP_PROVIDER_ID,
		cfg: params.config,
		agentDir: params.agentDir,
		profileId: params.profileId,
		lockedProfile: params.profileId !== void 0
	})).apiKey?.trim();
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
//#endregion
//#region extensions/llama-cpp/src/external-server/defaults.ts
const LLAMA_SERVER_DEFAULT_ORIGIN = "http://127.0.0.1:8080";
const LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR = "LLAMA_SERVER_API_KEY";
//#endregion
//#region extensions/llama-cpp/src/external-server/endpoint.ts
function toFetchableBaseUrl(value) {
	if (/^[a-z][a-z\d+.-]*:\/\//iu.test(value)) return value;
	return `http://${value}`;
}
/** Resolves the server origin and its OpenAI-compatible `/v1` inference base. */
function resolveLlamaServerEndpoint(configuredBaseUrl) {
	const configured = configuredBaseUrl?.trim() || "http://127.0.0.1:8080";
	const parsed = new URL(toFetchableBaseUrl(configured));
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new TypeError(`Unsupported llama-server protocol: ${parsed.protocol}`);
	if (parsed.username || parsed.password) throw new TypeError("llama-server base URL must not contain credentials");
	parsed.pathname = parsed.pathname.replace(/\/+$/u, "").replace(/\/v1$/iu, "") || "/";
	parsed.search = "";
	parsed.hash = "";
	const origin = parsed.toString().replace(/\/$/u, "");
	return {
		origin,
		inferenceBaseUrl: `${origin}/v1`
	};
}
/** Canonicalizes persisted provider config for the shared OpenAI transport. */
function normalizeLlamaServerProviderConfig(provider) {
	const endpoint = resolveLlamaServerEndpoint(provider.baseUrl);
	const request = provider.request ?? {};
	const normalizedRequest = typeof request.allowPrivateNetwork === "boolean" ? request : {
		...request,
		allowPrivateNetwork: true
	};
	return {
		...provider,
		baseUrl: endpoint.inferenceBaseUrl,
		api: "openai-completions",
		request: normalizedRequest
	};
}
//#endregion
//#region extensions/llama-cpp/src/external-server/models.ts
function normalizeStatus(value) {
	switch (value) {
		case "unloaded":
		case "loading":
		case "loaded":
		case "sleeping":
		case "downloading": return value;
		default: return "unknown";
	}
}
function resolveContextWindow(props) {
	return asPositiveSafeInteger(props?.default_generation_settings?.n_ctx) ?? asPositiveSafeInteger(props?.n_ctx) ?? SELF_HOSTED_DEFAULT_CONTEXT_WINDOW;
}
function resolveMaxTokens(props, contextWindow) {
	const params = props?.default_generation_settings?.params;
	const advertised = asPositiveSafeInteger(params?.max_tokens) ?? asPositiveSafeInteger(params?.n_predict);
	return Math.min(advertised ?? SELF_HOSTED_DEFAULT_MAX_TOKENS, contextWindow);
}
function resolveInput(row, props) {
	const advertised = row.architecture?.input_modalities;
	return Array.isArray(advertised) && advertised.includes("image") || props?.modalities?.vision === true ? ["text", "image"] : ["text"];
}
function buildCompat(props) {
	const caps = props?.chat_template_caps;
	const supportsTools = asBoolean(caps?.supports_tool_calls) === true;
	const supportsTypedContent = asBoolean(caps?.supports_typed_content) === true;
	return {
		supportsStore: false,
		supportsDeveloperRole: false,
		supportsReasoningEffort: asBoolean(caps?.supports_reasoning_effort) === true,
		supportsTemperature: true,
		supportsUsageInStreaming: true,
		supportsTools,
		supportsStrictMode: false,
		supportsJsonSchemaResponseFormat: true,
		requiresStringContent: !supportsTypedContent,
		maxTokensField: "max_tokens"
	};
}
/** Maps one llama-server model row plus optional runtime properties into OpenClaw config. */
function mapLlamaServerModel(row, props) {
	const id = typeof row.id === "string" ? row.id.trim() : "";
	if (!id || row.object !== void 0 && row.object !== "model") return null;
	const contextWindow = resolveContextWindow(props);
	const compat = buildCompat(props);
	return {
		config: {
			id,
			name: id,
			reasoning: compat.supportsReasoningEffort === true,
			input: resolveInput(row, props),
			cost: { ...SELF_HOSTED_DEFAULT_COST },
			contextWindow,
			contextTokens: contextWindow,
			maxTokens: resolveMaxTokens(props, contextWindow),
			compat
		},
		status: normalizeStatus(row.status?.value),
		failed: row.status?.failed === true
	};
}
/** Keeps explicit rows first and appends models discovered from the server. */
function mergeLlamaServerModels(params) {
	const explicit = Array.isArray(params.explicitModels) ? params.explicitModels : [];
	const merged = [...explicit];
	const seen = new Set(explicit.map((model) => model.id));
	for (const discovered of params.discoveredModels) {
		if (seen.has(discovered.config.id)) continue;
		seen.add(discovered.config.id);
		merged.push(discovered.config);
	}
	return merged;
}
function buildLlamaServerProviderConfig(params) {
	return normalizeLlamaServerProviderConfig({
		...params.configured,
		baseUrl: params.configured?.baseUrl ?? "http://127.0.0.1:8080",
		models: mergeLlamaServerModels({
			explicitModels: params.configured?.models,
			discoveredModels: params.discoveredModels
		})
	});
}
//#endregion
//#region extensions/llama-cpp/src/external-server/discovery.ts
/** Discovers llama-server models without loading, waking, or unloading them. */
async function discoverLlamaServer(params) {
	const endpoint = resolveLlamaServerEndpoint(params.baseUrl);
	const apiKey = params.apiKey?.trim();
	const cacheTtlMs = Boolean(apiKey && !isNonSecretApiKeyMarker(apiKey)) || Boolean(params.headers && Object.keys(params.headers).length > 0) ? 0 : Math.max(0, params.cacheTtlMs ?? 3e4);
	return await getCachedLiveCatalogValue({
		keyParts: [
			"llama-cpp",
			"external",
			endpoint.origin
		],
		ttlMs: cacheTtlMs,
		shouldCache: (result) => result.kind === "success",
		load: async () => {
			const result = await discoverOpenAICompatibleLocalModels({
				baseUrl: endpoint.inferenceBaseUrl,
				serverBaseUrl: endpoint.origin,
				apiKey: params.apiKey,
				headers: params.headers,
				label: "llama-server",
				healthPath: "/health",
				modelsPathOrder: "server-first",
				routerModelProps: true,
				timeoutMs: params.timeoutMs ?? 5e3,
				signal: params.signal,
				rawResult: true
			});
			if (result.kind !== "success") return {
				...result,
				endpoint
			};
			return {
				kind: "success",
				endpoint,
				models: result.rows.flatMap(({ model, props }) => {
					const mapped = mapLlamaServerModel(model, props);
					return mapped ? [mapped] : [];
				})
			};
		}
	});
}
//#endregion
//#region extensions/llama-cpp/src/external-server/provider.ts
const liveCatalogSdk = liveCatalogRuntime;
async function runLlamaServerCatalog(params) {
	if (liveCatalogSdk.runLiveProviderCatalog) return await liveCatalogSdk.runLiveProviderCatalog(params);
	const identity = {
		provider: params.providerId,
		...params.profileId ? { profileId: params.profileId } : {}
	};
	try {
		const result = await params.run();
		return result ? {
			...result,
			outcomes: [...result.outcomes ?? [], {
				...identity,
				status: "ready"
			}]
		} : result;
	} catch (error) {
		return {
			providers: {},
			outcomes: [error instanceof liveCatalogRuntime.LiveModelCatalogHttpError && (error.status === 401 || error.status === 403) ? {
				...identity,
				status: "auth-rejected",
				rejectionScope: "catalog"
			} : {
				...identity,
				status: "unavailable"
			}]
		};
	}
}
/** Discovers external llama-server models for provider runtime resolution. */
async function discoverLlamaServerProvider(ctx) {
	const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const auth = ctx.resolveProviderApiKey(LLAMA_CPP_PROVIDER_ID);
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: configured?.headers
	});
	const authApiKey = auth.discoveryApiKey ?? auth.apiKey;
	const apiKey = hasLlamaServerAuthorizationHeader(headers) || authApiKey && isNonSecretApiKeyMarker(authApiKey) ? void 0 : authApiKey;
	return await runLlamaServerCatalog({
		providerId: LLAMA_CPP_PROVIDER_ID,
		profileId: apiKey ? auth.profileId : void 0,
		run: async () => {
			const discovery = await discoverLlamaServer({
				baseUrl: configured?.baseUrl,
				apiKey,
				headers,
				cacheTtlMs: 0
			});
			if (discovery.kind !== "success") {
				if (!configured && !apiKey && !headers) return null;
				throw discovery.kind === "http-error" ? new liveCatalogRuntime.LiveModelCatalogHttpError(LLAMA_CPP_PROVIDER_ID, discovery.status) : discovery.error;
			}
			return { provider: buildLlamaServerProviderConfig({
				configured,
				discoveredModels: discovery.models
			}) };
		}
	});
}
async function prepareLlamaServerDynamicModel(ctx) {
	const apiKey = await resolveLlamaServerRuntimeApiKey({
		config: ctx.config,
		agentDir: ctx.agentDir,
		profileId: ctx.authProfileId
	});
	const headers = await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: ctx.providerConfig?.headers
	});
	const discovery = await discoverLlamaServer({
		baseUrl: ctx.providerConfig?.baseUrl,
		apiKey: hasLlamaServerAuthorizationHeader(headers) ? void 0 : apiKey,
		headers,
		cacheTtlMs: 0
	});
	const model = discovery.kind === "success" ? discovery.models.find((entry) => entry.config.id === ctx.modelId) : void 0;
	if (!model) return;
	return {
		...model.config,
		provider: LLAMA_CPP_PROVIDER_ID,
		api: ctx.providerConfig?.api ?? "openai-completions",
		baseUrl: resolveLlamaServerEndpoint(ctx.providerConfig?.baseUrl).inferenceBaseUrl,
		input: model.config.input.filter((entry) => entry === "text" || entry === "image")
	};
}
//#endregion
//#region extensions/llama-cpp/src/auth-config.ts
const LLAMA_CPP_DEFAULT_PROFILE_ID = `${LLAMA_CPP_PROVIDER_ID}:default`;
function buildLlamaCppAuthProfileRemovalPatch(config) {
	const profileExists = Boolean(config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
	const referencedOrders = Object.entries(config.auth?.order ?? {}).filter(([, ids]) => ids.includes(LLAMA_CPP_DEFAULT_PROFILE_ID));
	if (!profileExists && referencedOrders.length === 0) return {};
	const authPatch = {};
	if (profileExists) Reflect.set(authPatch, "profiles", { [LLAMA_CPP_DEFAULT_PROFILE_ID]: void 0 });
	if (referencedOrders.length > 0) Reflect.set(authPatch, "order", Object.fromEntries(referencedOrders.map(([providerId, ids]) => {
		const next = ids.filter((id) => id !== LLAMA_CPP_DEFAULT_PROFILE_ID);
		return [providerId, next.length > 0 ? next : void 0];
	})));
	return { auth: authPatch };
}
//#endregion
//#region extensions/llama-cpp/src/external-server/setup.ts
function selectSetupModelId(discovery) {
	const candidates = discovery.models.filter((model) => !model.failed);
	const ready = candidates.filter((model) => model.status === "loaded" || model.status === "sleeping");
	const ids = (ready.length > 0 ? ready : candidates).map((model) => model.config.id);
	return selectPreferredLocalModelId(ids) ?? ids[0];
}
function describeDiscoveryFailure(result) {
	switch (result.kind) {
		case "unreachable": return `llama-server could not be reached at ${result.endpoint.origin}.`;
		case "http-error": return `llama-server returned HTTP ${result.status} for ${result.path} at ${result.endpoint.origin}.`;
		case "invalid-response": return `llama-server returned an invalid response from ${result.path} at ${result.endpoint.origin}.`;
		default: throw new Error("Unexpected llama-server discovery result");
	}
}
function stripAuthOverrides(provider, removeAuthorization) {
	if (!provider) return provider;
	const headers = removeAuthorization ? stripAuthorizationHeader(provider.headers) : provider.headers;
	return {
		...provider,
		auth: void 0,
		apiKey: void 0,
		...removeAuthorization ? { headers } : {}
	};
}
function stripEndpointCredentials(provider) {
	if (!provider) return;
	const { localService: _localService, ...external } = provider;
	if (!provider.localService) return {
		...external,
		auth: void 0,
		apiKey: void 0,
		headers: void 0
	};
	const { auth: _auth, apiKey: _apiKey, headers: _headers, localService: _managedService, models: _managedModels, params: managedParams, timeoutSeconds: _managedTimeout, ...externalProvider } = provider;
	const { modelCacheDir: _modelCacheDir, ...params } = managedParams ?? {};
	return {
		...externalProvider,
		models: [],
		params: Object.keys(params).length > 0 ? params : void 0
	};
}
function hasEndpointChanged(provider, baseUrl) {
	if (!provider) return false;
	return resolveLlamaServerEndpoint(provider.baseUrl ?? "http://127.0.0.1:8080").inferenceBaseUrl !== resolveLlamaServerEndpoint(baseUrl).inferenceBaseUrl;
}
function stripLlamaServerEndpointAuth(config) {
	const withoutProfile = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	const provider = withoutProfile.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafeProvider = stripEndpointCredentials(provider);
	if (!endpointSafeProvider) return withoutProfile;
	return {
		...withoutProfile,
		models: {
			...withoutProfile.models,
			providers: {
				...withoutProfile.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: endpointSafeProvider
			}
		}
	};
}
function stripAuthorizationHeader(headers) {
	const filtered = Object.fromEntries(Object.entries(headers ?? {}).filter(([name]) => name.toLowerCase() !== "authorization"));
	return Object.keys(filtered).length > 0 ? filtered : void 0;
}
function buildExistingProviderConfig(params) {
	const configured = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const endpointSafe = params.resetEndpoint ? stripEndpointCredentials(configured) : configured;
	const existing = params.persistence.kind === "preserve" ? endpointSafe : stripAuthOverrides(endpointSafe, params.persistence.kind === "upsert");
	return buildLlamaServerProviderConfig({
		configured: {
			...existing,
			baseUrl: params.discovery.endpoint.inferenceBaseUrl,
			models: existing?.models ?? []
		},
		discoveredModels: params.discovery.models
	});
}
function buildSetupResult$1(params) {
	return {
		profiles: params.persistence.kind === "upsert" ? [{
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential: buildApiKeyCredential(LLAMA_CPP_PROVIDER_ID, params.persistence.credential, void 0, { config: params.config })
		}] : [],
		defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${params.modelId}`,
		configPatch: {
			...params.persistence.kind === "remove" ? buildLlamaCppAuthProfileRemovalPatch(params.config) : {},
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildExistingProviderConfig(params) }
			}
		}
	};
}
async function removeDefaultAuthProfile(config, agentDir) {
	if (!await removeProviderAuthProfilesWithLock({
		cfg: config,
		agentDir,
		provider: "llama-cpp",
		profileIds: [LLAMA_CPP_DEFAULT_PROFILE_ID]
	})) throw new Error("Failed to remove the previous llama-server auth profile; wait a moment and retry.");
}
async function discoverForSetup(ctx) {
	const provider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (provider?.localService) return null;
	try {
		const headers = await resolveLlamaServerProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: provider?.headers
		});
		const apiKey = !hasLlamaServerAuthorizationHeader(headers) ? await resolveLlamaServerRuntimeApiKey({ config: ctx.config }) : void 0;
		const discovery = await discoverLlamaServer({
			baseUrl: provider?.baseUrl ?? "http://127.0.0.1:8080",
			apiKey,
			headers,
			signal: ctx.signal,
			cacheTtlMs: 0
		});
		return discovery.kind === "success" ? discovery : null;
	} catch {
		return null;
	}
}
async function discoverWithAccess(params) {
	return await discoverLlamaServer({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		signal: params.signal,
		cacheTtlMs: 0
	});
}
/** Read-only discovery for the guided local-provider setup ladder. */
async function detectLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const modelId = selectSetupModelId(discovery);
	if (!modelId) return null;
	return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${modelId}`,
		detail: `${modelId} at ${discovery.endpoint.origin}`
	};
}
/** Rechecks one guided candidate and returns the config needed for a live probe. */
async function prepareLlamaServerSetup(ctx) {
	const discovery = await discoverForSetup(ctx);
	if (!discovery) return null;
	const prefix = `${LLAMA_CPP_PROVIDER_ID}/`;
	const modelId = ctx.modelRef.startsWith(prefix) ? ctx.modelRef.slice(prefix.length) : "";
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) return null;
	return buildSetupResult$1({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: false,
		persistence: { kind: "preserve" }
	});
}
/** Interactive setup for an existing llama-server endpoint. */
async function runLlamaServerSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const defaultOrigin = resolveLlamaServerEndpoint(existing?.baseUrl).origin;
	const endpoint = resolveLlamaServerEndpoint(await ctx.prompter.text({
		message: `${LLAMA_CPP_PROVIDER_LABEL} URL`,
		initialValue: defaultOrigin,
		placeholder: LLAMA_SERVER_DEFAULT_ORIGIN,
		validate: (value) => value?.trim() ? void 0 : "Required"
	}));
	const endpointChanged = Boolean(existing?.localService) || hasEndpointChanged(existing, endpoint.inferenceBaseUrl);
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: ctx.env,
		headers: existing?.headers
	});
	const usesApiKey = await ctx.prompter.confirm({
		message: "Does this llama-server require an API key?",
		initialValue: false
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (!usesApiKey) persistence = { kind: "remove" };
	else {
		const hasConfiguredProfile = Boolean(ctx.config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
		const profileApiKey = !endpointChanged && !hasLlamaServerAuthorizationHeader(resolvedHeaders) && hasConfiguredProfile ? await resolveLlamaServerRuntimeApiKey({
			config: ctx.config,
			agentDir: ctx.agentDir,
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID
		}) : void 0;
		if (profileApiKey) {
			apiKey = profileApiKey;
			persistence = { kind: "preserve" };
		} else {
			let credentialInput;
			apiKey = await ensureApiKeyFromEnvOrPrompt({
				config: endpointChanged ? stripLlamaServerEndpointAuth(ctx.config) : ctx.config,
				env: endpointChanged ? {} : ctx.env,
				provider: LLAMA_CPP_PROVIDER_ID,
				envLabel: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
				promptMessage: "Enter the llama-server API key",
				normalize: (value) => value.trim(),
				validate: (value) => value.trim() ? void 0 : "Required",
				prompter: ctx.prompter,
				secretInputMode: ctx.secretInputMode,
				setCredential: async (input) => {
					credentialInput = input;
				}
			});
			if (credentialInput === void 0) throw new Error("llama-server API-key setup did not produce a credential");
			headers = stripAuthorizationHeader(resolvedHeaders);
			persistence = {
				kind: "upsert",
				credential: credentialInput
			};
		}
	}
	const discovery = await discoverWithAccess({
		baseUrl: endpoint.inferenceBaseUrl,
		apiKey,
		headers,
		signal: ctx.signal
	});
	if (discovery.kind !== "success") throw new Error(describeDiscoveryFailure(discovery));
	const modelId = selectSetupModelId(discovery);
	if (!modelId) throw new Error(`No llama-server text models were found at ${discovery.endpoint.origin}.`);
	if (persistence.kind === "remove") await removeDefaultAuthProfile(ctx.config, ctx.agentDir);
	return buildSetupResult$1({
		config: ctx.config,
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	});
}
async function validateNonInteractiveDiscovery(ctx) {
	const configuredProvider = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const baseUrl = normalizeOptionalSecretInput(ctx.opts.customBaseUrl) ?? configuredProvider?.baseUrl ?? "http://127.0.0.1:8080";
	const endpointChanged = Boolean(configuredProvider?.localService) || hasEndpointChanged(configuredProvider, baseUrl);
	const providerApiKey = normalizeOptionalSecretInput(ctx.opts.llamaServerApiKey);
	const customApiKey = normalizeOptionalSecretInput(ctx.opts.customApiKey);
	const authoredApiKey = providerApiKey ?? customApiKey;
	const hasAuthoredApiKey = authoredApiKey !== void 0;
	const resolvedApiKey = await ctx.resolveApiKey({
		provider: LLAMA_CPP_PROVIDER_ID,
		flagValue: authoredApiKey,
		flagName: providerApiKey === void 0 ? "--custom-api-key" : "--llama-server-api-key",
		envVar: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		envVarName: LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR,
		required: false
	});
	const resolvedHeaders = endpointChanged ? void 0 : await resolveLlamaServerProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: configuredProvider?.headers
	});
	let apiKey;
	let headers = resolvedHeaders;
	let persistence;
	if (hasAuthoredApiKey && resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		headers = stripAuthorizationHeader(resolvedHeaders);
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else if (endpointChanged || hasLlamaServerAuthorizationHeader(resolvedHeaders)) persistence = { kind: "remove" };
	else if (resolvedApiKey?.source === "profile") {
		apiKey = resolvedApiKey.key;
		persistence = { kind: "preserve" };
	} else if (resolvedApiKey) {
		apiKey = resolvedApiKey.key;
		persistence = {
			kind: "upsert",
			credential: resolvedApiKey
		};
	} else persistence = { kind: "remove" };
	const discovery = await discoverWithAccess({
		baseUrl,
		apiKey,
		headers
	});
	if (discovery.kind !== "success") {
		ctx.runtime.error(describeDiscoveryFailure(discovery));
		ctx.runtime.exit(1);
		return null;
	}
	const requestedModelId = normalizeOptionalSecretInput(ctx.opts.customModelId);
	const modelId = requestedModelId ?? selectSetupModelId(discovery);
	if (!modelId || !discovery.models.some((model) => model.config.id === modelId)) {
		const available = discovery.models.map((model) => model.config.id).join(", ");
		ctx.runtime.error(requestedModelId ? `llama-server model ${requestedModelId} was not found. Available models: ${available}` : `No llama-server text models were found at ${discovery.endpoint.origin}.`);
		ctx.runtime.exit(1);
		return null;
	}
	return {
		discovery,
		modelId,
		resetEndpoint: endpointChanged,
		persistence
	};
}
async function validateLlamaServerNonInteractive(ctx) {
	return Boolean(await validateNonInteractiveDiscovery(ctx));
}
/** Non-interactive setup with optional API-key persistence. */
async function configureLlamaServerNonInteractive(ctx) {
	const validated = await validateNonInteractiveDiscovery(ctx);
	if (!validated) return null;
	const providerConfig = buildExistingProviderConfig({
		config: ctx.config,
		discovery: validated.discovery,
		resetEndpoint: validated.resetEndpoint,
		persistence: validated.persistence
	});
	let config = {
		...ctx.config,
		models: {
			...ctx.config.models,
			mode: ctx.config.models?.mode ?? "merge",
			providers: {
				...ctx.config.models?.providers,
				[LLAMA_CPP_PROVIDER_ID]: providerConfig
			}
		}
	};
	if (validated.persistence.kind === "upsert") {
		const credential = ctx.toApiKeyCredential({
			provider: LLAMA_CPP_PROVIDER_ID,
			resolved: validated.persistence.credential
		});
		if (!credential) return null;
		await upsertAuthProfileWithLock({
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			credential,
			agentDir: ctx.agentDir
		});
		config = applyAuthProfileConfig(config, {
			profileId: LLAMA_CPP_DEFAULT_PROFILE_ID,
			provider: LLAMA_CPP_PROVIDER_ID,
			mode: "api_key"
		});
	} else if (validated.persistence.kind === "remove") {
		await removeDefaultAuthProfile(ctx.config, ctx.agentDir);
		config = removeAuthProfileConfig(config, LLAMA_CPP_DEFAULT_PROFILE_ID);
	}
	ctx.runtime.log(`Default ${LLAMA_CPP_PROVIDER_LABEL} model: ${validated.modelId}`);
	return applyProviderDefaultModel(config, `${LLAMA_CPP_PROVIDER_ID}/${validated.modelId}`);
}
//#endregion
//#region extensions/llama-cpp/src/external-server/stream.ts
/** Maps shared structured-output requests to the shape accepted by older llama-server builds. */
function normalizeLlamaServerResponseFormat(payload, requestedResponseFormat) {
	const responseFormat = isRecord(payload.response_format) ? payload.response_format : requestedResponseFormat;
	if (!responseFormat || responseFormat.type === "text") return;
	const schema = responseFormat.type === "json_schema" ? isRecord(responseFormat.json_schema) ? responseFormat.json_schema.schema : responseFormat.schema : responseFormat.type === "json_object" ? responseFormat.schema : responseFormat;
	if (isRecord(schema)) payload.response_format = {
		type: "json_object",
		schema
	};
}
/** Keeps the shared OpenAI transport and adjusts llama-server request compatibility. */
function wrapLlamaServerStream(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "llama-cpp") return underlying(model, context, options);
		const onPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload: async (payload, requestModel) => {
				const customized = await onPayload?.(payload, requestModel) ?? payload;
				if (isRecord(customized)) {
					if ((options?.reasoning ?? ctx.thinkingLevel) === "off") setQwenChatTemplateThinking(customized, false);
					normalizeLlamaServerResponseFormat(customized, options?.responseFormat);
				}
				return customized;
			}
		});
	};
}
//#endregion
//#region extensions/llama-cpp/src/setup.ts
const BYTES_PER_GB = 1e9;
const BYTES_PER_MB = 1e6;
function formatDownloadProgress(label, params) {
	const downloadedSize = Math.max(0, params.downloadedSize);
	const totalSize = Math.max(1, params.totalSize);
	return `Downloading ${label}… ${Math.min(100, Math.floor(downloadedSize / totalSize * 100))}% (${(downloadedSize / BYTES_PER_GB).toFixed(1)}/${(totalSize / BYTES_PER_GB).toFixed(1)} GB, ${Math.max(0, Math.round(params.bytesPerSecond / BYTES_PER_MB))} MB/s)`;
}
function describeEmbeddingDownload(isDefault) {
	return isDefault ? "the local embedding model (about 0.3 GB)" : "your configured local embedding model";
}
function readPrimaryModel(config) {
	const model = config.agents?.defaults?.model;
	return typeof model === "string" ? model : model?.primary;
}
function configuredCandidates(config, scope) {
	const existing = config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const managedExisting = existing?.localService ? existing : void 0;
	const provider = buildLlamaCppProviderConfig({
		existing: managedExisting,
		...managedExisting && scope === "detection" ? { modelInventory: managedExisting.models } : {}
	});
	const primary = readPrimaryModel(config);
	const primaryId = primary?.startsWith(`llama-cpp/`) ? primary.slice(LLAMA_CPP_PROVIDER_ID.length + 1) : void 0;
	return provider.models.map((model) => ({
		model,
		provider
	})).toSorted((a, b) => Number(b.model.id === primaryId) - Number(a.model.id === primaryId));
}
async function isFile(filePath) {
	return await fs.stat(filePath).then((stat) => stat.isFile()).catch(() => false);
}
async function resolveCachedArtifact(source, cacheDir, signal) {
	return await ensureLlamaCppModel({
		source,
		cacheDir,
		download: false,
		signal
	}).catch(() => {
		signal?.throwIfAborted();
	});
}
async function resolveCachedCandidate(candidate, signal) {
	const source = resolveLlamaCppModelSource(candidate.model);
	const resolved = resolveCachedLlamaCppModelPath(candidate);
	if (resolved && await isFile(resolved)) return resolved;
	if (candidate.model.id === "gemma-4-e4b-it-q4_k_m") {
		const legacy = path.join(resolveLegacyLlamaCppModelCacheDir(), DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
		if (await isFile(legacy)) return legacy;
	}
	if (/^(?:hf|huggingface|https):/iu.test(source)) return await resolveCachedArtifact(source, resolveLlamaCppModelCacheDir(candidate.provider), signal);
}
function buildSetupResult(params) {
	const existing = params.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const switchingFromExternal = Boolean(existing && !existing.localService);
	return {
		profiles: [],
		...params.defaultModel ? { defaultModel: params.defaultModel } : {},
		configPatch: {
			...buildLlamaCppAuthProfileRemovalPatch(params.config),
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig({
					existing: switchingFromExternal ? void 0 : existing,
					managed: params.managed,
					modelInventory: params.plan === "embedding-only" ? [] : params.model ? [params.model, ...existing?.localService ? existing.models.filter((model) => model.id !== params.model?.id) : []] : existing?.models
				}) }
			}
		}
	};
}
async function detectLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const command = existing?.localService?.command;
	const presetPath = existing?.localService?.args?.find((_, index, args) => args[index - 1] === "--models-preset");
	if (!command || !path.isAbsolute(command) || !await isFile(command) || !presetPath || !await isFile(presetPath)) return null;
	for (const candidate of configuredCandidates(ctx.config, "detection")) if (await resolveCachedCandidate(candidate, ctx.signal)) return {
		modelRef: `${LLAMA_CPP_PROVIDER_ID}/${candidate.model.id}`,
		detail: "Managed llama.cpp server ready"
	};
	return null;
}
async function prepareLlamaCppSetup(ctx) {
	const detected = await detectLlamaCppSetup(ctx);
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (detected?.modelRef !== ctx.modelRef || !existing?.localService?.command) return null;
	const baseUrl = existing.baseUrl?.replace(/\/+$/u, "") ?? "";
	const rootUrl = baseUrl.replace(/\/v1$/u, "");
	return buildSetupResult({
		config: ctx.config,
		plan: "chat",
		defaultModel: ctx.modelRef,
		managed: {
			command: existing.localService.command,
			baseUrl,
			healthUrl: existing.localService.healthUrl ?? `${rootUrl}/health`,
			args: existing.localService.args ?? []
		}
	});
}
function resolveEmbeddingSetup(config, cacheDir) {
	const defaults = config.memory?.search;
	const models = listAgentIds(config).flatMap((agentId) => {
		const override = resolveAgentConfig(config, agentId)?.memory?.search;
		if (!(override?.enabled ?? defaults?.enabled ?? true) || (override?.provider ?? defaults?.provider) !== "local") return [];
		return [resolveLlamaCppEmbeddingModel({
			modelPath: override?.local?.modelPath ?? defaults?.local?.modelPath,
			modelCacheDir: cacheDir
		})];
	});
	const model = models[0] ?? resolveLlamaCppEmbeddingModel({ modelCacheDir: cacheDir });
	return {
		model,
		localMemoryIntent: models.length > 0,
		conflict: models.some((candidate) => candidate.source !== model.source)
	};
}
async function resolveSetupPlan(ctx, candidates, embeddingModelIsDefault, localMemoryIntent, hardware, asset, runtimeNote) {
	let candidate = candidates[0];
	const configuredPath = candidate ? await resolveCachedCandidate(candidate, ctx.signal) : void 0;
	if (candidate && configuredPath) {
		if (runtimeNote && !await ctx.prompter.confirm({
			message: `${runtimeNote} Use cached ${candidate.model.name} on Gateway host ${os.hostname()} with the verified CPU runtime?`,
			initialValue: false
		})) return;
		return {
			kind: "chat",
			candidate,
			cachedPath: configuredPath
		};
	}
	const provider = candidate?.provider ?? buildLlamaCppProviderConfig();
	const cacheDir = resolveLlamaCppModelCacheDir(provider);
	const cachedModels = /* @__PURE__ */ new Map();
	for (const recipe of resolveLlamaCppModelCandidates(hardware, asset.backend).recipes) {
		const cached = await resolveCachedArtifact(resolveLlamaCppModelSource(recipe.model), cacheDir, ctx.signal);
		if (cached) {
			cachedModels.set(recipe.model.id, cached);
			break;
		}
	}
	const cachedEmbedding = embeddingModelIsDefault && Boolean(await resolveCachedArtifact("hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf", cacheDir, ctx.signal));
	const recommendation = recommendLlamaCppModel(hardware, asset.backend, {
		modelIds: new Set(cachedModels.keys()),
		embedding: cachedEmbedding,
		runtime: await isFile(resolveManagedLlamaServerPaths(asset).command)
	});
	if (recommendation.kind === "recommended") {
		const { recipe } = recommendation;
		const cachedPath = cachedModels.get(recipe.model.id);
		candidate = {
			model: recipe.model,
			provider
		};
		const recommendationSummary = [
			`Runs on Gateway host ${os.hostname()} (${hardware.platform}/${hardware.arch}), using ${asset.backend === "metal" ? "Apple Metal" : asset.backend === "cuda" ? "NVIDIA CUDA" : "the CPU"}.`,
			`${formatLlamaCppMemory(hardware.totalMemoryBytes)} RAM; ${formatLlamaCppMemory(hardware.availableDiskBytes ?? 0)} free disk.`,
			!hardware.sharedDisk ? `${formatLlamaCppMemory(hardware.availableRuntimeDiskBytes ?? 0)} free on the runtime volume.` : void 0,
			runtimeNote,
			recommendation.reason,
			!embeddingModelIsDefault ? "This estimate includes the default embedding model; your configured embedding model may need more memory and disk space." : void 0,
			"OpenClaw will check a real tool call before making this your default model."
		].filter(Boolean).join("\n");
		if (await ctx.prompter.confirm({
			message: `${recommendationSummary}\n\n${cachedPath ? `Use cached ${recipe.model.name}, download any missing embedding and ${asset.backend.toUpperCase()} runtime files, then use this model?` : `Download ${recipe.model.name} (${(recipe.sizeBytes / BYTES_PER_GB).toFixed(1)} GB), ${describeEmbeddingDownload(embeddingModelIsDefault)}, and the verified ${asset.backend.toUpperCase()} runtime, then use this model?`}`,
			initialValue: false
		})) return {
			kind: "chat",
			candidate,
			cachedPath
		};
	} else if (!localMemoryIntent) {
		await ctx.prompter.note(recommendation.reason, "Setup skipped");
		return;
	}
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (localMemoryIntent && existing && (!existing.localService || existing.models.length > 0)) {
		await ctx.prompter.note("Embedding-only setup cannot replace an existing llama.cpp server or configured llama.cpp chat routes. Move those routes to another provider, remove any existing server config, then retry llama.cpp setup.", "Setup skipped");
		return;
	}
	if (localMemoryIntent) {
		if (await ctx.prompter.confirm({
			message: `${runtimeNote ? `${runtimeNote} ` : ""}Install a verified ${asset.backend.toUpperCase()} llama.cpp server on Gateway host ${os.hostname()} and download only ${describeEmbeddingDownload(embeddingModelIsDefault)}? Your chat model will stay unchanged.`,
			initialValue: false
		})) return { kind: "embedding-only" };
	}
	await ctx.prompter.note("Local model setup skipped.", "Setup skipped");
}
async function runLlamaCppSetup(ctx) {
	const existing = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	const managedExisting = existing?.localService ? existing : void 0;
	const cacheDir = resolveLlamaCppModelCacheDir(managedExisting);
	const embeddingSetup = resolveEmbeddingSetup(ctx.config, cacheDir);
	if (embeddingSetup.conflict) {
		await ctx.prompter.note("Configured agents resolve to different local embedding models. Set memory.search.local.modelPath and any per-agent overrides to the same value, then retry llama.cpp setup.", "Setup skipped");
		return { profiles: [] };
	}
	const embeddingModel = embeddingSetup.model;
	const hardware = await detectLlamaCppHardware({
		cacheDir,
		signal: ctx.signal
	});
	let asset;
	let runtimeNote;
	try {
		asset = selectLlamaServerAsset(hardware.platform, hardware.arch, hardware.accelerator);
	} catch (error) {
		if (hardware.accelerator.kind !== "cuda") throw error;
		asset = selectLlamaServerAsset(hardware.platform, hardware.arch, { kind: "cpu" });
		runtimeNote = `${error instanceof Error ? error.message : String(error)} This recommendation uses CPU execution.`;
	}
	const plan = await resolveSetupPlan(ctx, configuredCandidates(ctx.config, "setup"), embeddingModel.isDefault, embeddingSetup.localMemoryIntent, hardware, asset, runtimeNote);
	if (!plan) return { profiles: [] };
	const progress = ctx.prompter.progress("Preparing managed llama.cpp server…");
	try {
		let chatModel;
		if (plan.kind === "chat") {
			const chatModelPath = plan.cachedPath ?? await ensureLlamaCppModel({
				source: resolveLlamaCppModelSource(plan.candidate.model),
				cacheDir,
				download: true,
				signal: ctx.signal,
				onProgress: (status) => progress.update(formatDownloadProgress(plan.candidate.model.name, status))
			});
			const configuredContext = plan.candidate.model.params?.contextSize;
			chatModel = {
				mode: "configure",
				id: plan.candidate.model.id,
				path: chatModelPath,
				contextSize: typeof configuredContext === "number" && configuredContext > 0 ? Math.floor(configuredContext) : plan.candidate.model.contextTokens,
				maxTokens: plan.candidate.model.maxTokens
			};
		} else chatModel = { mode: "remove" };
		const embeddingModelLabel = embeddingModel.isDefault ? "EmbeddingGemma" : "configured embedding model";
		const embeddingModelPath = await ensureLlamaCppModel({
			source: embeddingModel.source,
			cacheDir,
			download: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress(embeddingModelLabel, status))
		});
		const managed = await prepareManagedLlamaServer({
			chatModel,
			configuredChatModelIds: plan.kind === "chat" ? plan.candidate.provider.models.map((model) => model.id) : [],
			embeddingModelIsDefault: embeddingModel.isDefault,
			embeddingModelPath,
			asset,
			isolated: true,
			signal: ctx.signal,
			onProgress: (status) => progress.update(formatDownloadProgress("llama.cpp runtime", status))
		});
		ctx.signal?.throwIfAborted();
		progress.stop("Managed llama.cpp server prepared");
		return buildSetupResult({
			config: ctx.config,
			managed,
			plan: plan.kind,
			...plan.kind === "chat" ? {
				defaultModel: `${LLAMA_CPP_PROVIDER_ID}/${plan.candidate.model.id}`,
				model: plan.candidate.model
			} : {}
		});
	} catch (error) {
		progress.stop("llama.cpp setup failed");
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Managed llama.cpp setup failed. Run openclaw doctor, fix the reported runtime or model issue, then retry. ${detail}`, { cause: error });
	}
}
//#endregion
//#region extensions/llama-cpp/src/managed-provider.ts
function wrapLlamaCppStream(ctx) {
	const inner = wrapLlamaServerStream(ctx);
	const providerConfig = ctx.config?.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (!providerConfig?.localService) return inner;
	const selectedModel = ctx.model;
	if (!selectedModel) return;
	return async (...args) => {
		await ensureManagedLlamaServerForChat({
			provider: providerConfig,
			model: selectedModel
		});
		return inner(...args);
	};
}
function registerLlamaCppProvider(api) {
	api.registerProvider({
		id: LLAMA_CPP_PROVIDER_ID,
		label: LLAMA_CPP_PROVIDER_LABEL,
		docsPath: "/plugins/llama-cpp",
		envVars: [LLAMA_SERVER_DEFAULT_API_KEY_ENV_VAR],
		auth: [{
			id: "local",
			label: LLAMA_CPP_PROVIDER_LABEL,
			hint: "Choose a Qwen, Gemma, or Muse model for this Gateway’s hardware and install llama.cpp",
			kind: "custom",
			wizard: {
				choiceId: LLAMA_CPP_PROVIDER_ID,
				choiceLabel: "Managed local server",
				choiceHint: "Choose a Qwen, Gemma, or Muse model for this Gateway’s hardware and install llama.cpp",
				groupId: LLAMA_CPP_PROVIDER_ID,
				groupLabel: "Local llama.cpp",
				groupHint: "Managed or external llama.cpp server",
				methodId: "local"
			},
			appGuidedSetup: {
				detect: detectLlamaCppSetup,
				prepare: prepareLlamaCppSetup
			},
			run: runLlamaCppSetup
		}, {
			id: "existing-server",
			label: "Existing llama-server",
			hint: "Connect to an existing local, private, or remote llama.cpp server",
			kind: "custom",
			wizard: {
				choiceId: "llama-cpp-existing-server",
				choiceLabel: "Existing llama-server",
				choiceHint: "Connect to a llama.cpp server managed outside OpenClaw",
				groupId: LLAMA_CPP_PROVIDER_ID,
				groupLabel: "Local llama.cpp",
				groupHint: "Managed or external llama.cpp server",
				methodId: "existing-server"
			},
			appGuidedSetup: {
				detect: detectLlamaServerSetup,
				prepare: prepareLlamaServerSetup
			},
			run: runLlamaServerSetup,
			validateNonInteractive: validateLlamaServerNonInteractive,
			runNonInteractive: async (ctx) => await configureLlamaServerNonInteractive(ctx)
		}],
		catalog: {
			order: "late",
			run: async (ctx) => {
				const configured = ctx.config.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
				return configured?.localService ? { provider: buildLlamaCppProviderConfig({
					existing: configured,
					modelInventory: configured.models
				}) } : await discoverLlamaServerProvider(ctx);
			}
		},
		staticCatalog: {
			order: "late",
			run: async () => ({ provider: buildLlamaCppProviderConfig() })
		},
		resolveSyntheticAuth: ({ providerConfig }) => providerConfig?.localService || shouldUseLlamaServerSyntheticAuth(providerConfig) ? {
			apiKey: resolveLlamaCppSyntheticApiKey(),
			source: providerConfig?.localService ? "managed local llama.cpp server" : hasLlamaServerAuthorizationHeader(providerConfig?.headers) ? "models.providers.llama-cpp.headers.Authorization" : "models.providers.llama-cpp (synthetic local key)",
			mode: "api-key"
		} : void 0,
		shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === resolveLlamaCppSyntheticApiKey() || resolvedApiKey?.trim() === CUSTOM_LOCAL_AUTH_MARKER,
		normalizeConfig: ({ providerConfig }) => providerConfig.localService ? providerConfig : normalizeLlamaServerProviderConfig(providerConfig),
		prepareDynamicModel: async (ctx) => ctx.config?.models?.providers?.["llama-cpp"]?.localService ? void 0 : await prepareLlamaServerDynamicModel(ctx),
		reconcileLocalService: reconcileManagedLlamaServer,
		wrapSimpleCompletionStreamFn: wrapLlamaCppStream,
		wrapStreamFn: wrapLlamaCppStream,
		...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
		wizard: { modelPicker: {
			label: "llama.cpp",
			hint: `Use a managed server or connect to ${LLAMA_SERVER_DEFAULT_ORIGIN}`,
			methodId: "local"
		} }
	});
}
//#endregion
//#region extensions/llama-cpp/index.ts
var llama_cpp_default = definePluginEntry({
	id: "llama-cpp",
	name: "llama.cpp Provider",
	description: "Managed and external llama.cpp servers for GGUF chat and embeddings",
	register(api) {
		api.registerEmbeddingProvider(llamaCppEmbeddingProviderAdapter);
		registerLlamaCppProvider(api);
	}
});
//#endregion
export { llama_cpp_default as default };
