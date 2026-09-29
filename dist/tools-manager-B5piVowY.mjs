import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { O as walkDirectorySync, w as root } from "./fs-safe-BAPek8At.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { l as extractArchive } from "./archive-BVJWOqLD.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { r as getBinDir } from "./config-B8b8m5IS.mjs";
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { arch, homedir, platform } from "node:os";
import { randomUUID } from "node:crypto";
import chalk from "chalk";
//#region src/agents/package-metadata.ts
/** Package metadata and assets without runtime configuration dependencies. */
const currentFile = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFile);
/**
* Detect if we're running as a Bun compiled binary.
* Bun binaries have import.meta.url containing "$bunfs", "~BUN", or "%7EBUN" (Bun's virtual filesystem path)
*/
const isBunBinary = import.meta.url.includes("$bunfs") || import.meta.url.includes("~BUN") || import.meta.url.includes("%7EBUN");
/**
* Get the base directory for resolving package assets (themes, package.json, README.md, CHANGELOG.md).
* - For Bun binary: returns the directory containing the executable
* - For Node.js (dist/): returns currentDir (the dist/ directory)
* - For tsx (src/): returns parent directory (the package root)
*/
function getPackageDir() {
	const envDir = process.env.OPENCLAW_PACKAGE_DIR;
	if (envDir) {
		if (envDir === "~") return homedir();
		if (envDir.startsWith("~/")) return homedir() + envDir.slice(1);
		return envDir;
	}
	if (isBunBinary) return dirname(process.execPath);
	let dir = currentDir;
	while (dir !== dirname(dir)) {
		if (existsSync(join(dir, "package.json"))) return dir;
		dir = dirname(dir);
	}
	return currentDir;
}
/** Get path to package.json */
function getPackageJsonPath() {
	return join(getPackageDir(), "package.json");
}
/** Get path to README.md */
function getReadmePath() {
	return resolve(join(getPackageDir(), "README.md"));
}
/** Get path to docs directory */
function getDocsPath() {
	return resolve(join(getPackageDir(), "docs"));
}
/** Get path to examples directory */
function getExamplesPath() {
	return resolve(join(getPackageDir(), "examples"));
}
const workerVersion = typeof WORKER_DEPLOY_VERSION === "string" ? WORKER_DEPLOY_VERSION : void 0;
const pkg = workerVersion ? {
	name: "openclaw",
	version: workerVersion
} : JSON.parse(readFileSync(getPackageJsonPath(), "utf-8"));
const APP_NAME = pkg.openclawConfig?.name || "openclaw";
const CONFIG_DIR_NAME = pkg.openclawConfig?.configDir || ".openclaw";
const PACKAGE_MANIFEST_VERSION = pkg.version || "0.0.0";
//#endregion
//#region src/agents/utils/tools-manager.ts
/**
* Tool binary manager for agent-side helper commands.
*
* Locates or downloads pinned helper binaries such as fd and ripgrep.
*/
const NETWORK_TIMEOUT_MS = 1e4;
const DOWNLOAD_TIMEOUT_MS = 12e4;
const MAX_ARCHIVE_BYTES = 104857600;
const MAX_EXTRACTED_BYTES = 524288e3;
const MAX_ARCHIVE_ENTRIES = 1e3;
const ARCHIVE_EXTRACT_TIMEOUT_MS = 6e4;
const CONTENT_LENGTH_RE = /^\d+$/;
const GITHUB_RELEASE_JSON_MAX_BYTES = 1048576;
const TOOL_INSTALL_STALE_MS = 22e4;
const toolInstallations = /* @__PURE__ */ new Map();
const TOOL_INSTALL_LOCK_OPTIONS = {
	retries: {
		retries: 480,
		factor: 1.2,
		minTimeout: 25,
		maxTimeout: 500,
		randomize: true
	},
	stale: TOOL_INSTALL_STALE_MS,
	staleRecovery: "remove-if-unchanged"
};
function isOfflineModeEnabled() {
	return isTruthyEnvValue(process.env.OPENCLAW_OFFLINE);
}
const TOOLS = {
	fd: {
		name: "fd",
		repo: "sharkdp/fd",
		binaryName: "fd",
		systemBinaryNames: ["fd", "fdfind"],
		tagPrefix: "v",
		getAssetName: (version, plat, architecture) => {
			if (plat === "darwin") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
			else if (plat === "linux") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-unknown-linux-gnu.tar.gz`;
			else if (plat === "win32") return `fd-v${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
			return null;
		}
	},
	rg: {
		name: "ripgrep",
		repo: "BurntSushi/ripgrep",
		binaryName: "rg",
		tagPrefix: "",
		getAssetName: (version, plat, architecture) => {
			if (plat === "darwin") return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-apple-darwin.tar.gz`;
			else if (plat === "linux") {
				if (architecture === "arm64") return `ripgrep-${version}-aarch64-unknown-linux-gnu.tar.gz`;
				return `ripgrep-${version}-x86_64-unknown-linux-musl.tar.gz`;
			} else if (plat === "win32") return `ripgrep-${version}-${architecture === "arm64" ? "aarch64" : "x86_64"}-pc-windows-msvc.zip`;
			return null;
		}
	}
};
function commandExists(cmd) {
	try {
		const result = spawnSync(cmd, ["--version"], {
			killSignal: "SIGKILL",
			stdio: "pipe",
			timeout: 5e3
		});
		return !result.error && result.status === 0;
	} catch {
		return false;
	}
}
function getToolPath(tool, toolsDir) {
	const config = TOOLS[tool];
	if (toolsDir) {
		const localPath = join(toolsDir, config.binaryName + (platform() === "win32" ? ".exe" : ""));
		if (existsSync(localPath)) return localPath;
	}
	const systemBinaryNames = config.systemBinaryNames ?? [config.binaryName];
	for (const systemBinaryName of systemBinaryNames) if (commandExists(systemBinaryName)) return systemBinaryName;
	return null;
}
async function getLatestVersion(repo) {
	const guarded = await fetchWithSsrFGuard({
		url: `https://api.github.com/repos/${repo}/releases/latest`,
		timeoutMs: NETWORK_TIMEOUT_MS,
		auditContext: "tools-manager-release-check",
		init: { headers: { "User-Agent": `${APP_NAME}-coding-agent` } }
	});
	const { response } = guarded;
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`GitHub API error: ${response.status}`);
		}
		return (await readProviderJsonResponse(response, "GitHub release", { maxBytes: GITHUB_RELEASE_JSON_MAX_BYTES })).tag_name.replace(/^v/, "");
	} finally {
		await guarded.release();
	}
}
async function downloadFile(url, destination, assetName) {
	const guarded = await fetchWithSsrFGuard({
		url,
		timeoutMs: DOWNLOAD_TIMEOUT_MS,
		auditContext: "tools-manager-download"
	});
	const { response } = guarded;
	try {
		if (!response.ok) {
			await cancelUnreadResponseBody(response);
			throw new Error(`Failed to download: ${response.status}`);
		}
		if (!response.body) throw new Error("No response body");
		const rawContentLength = response.headers.get("content-length");
		const contentEncoding = response.headers.get("content-encoding")?.trim().toLowerCase();
		if (rawContentLength !== null && (!contentEncoding || contentEncoding === "identity")) {
			const contentLength = rawContentLength.trim();
			if (CONTENT_LENGTH_RE.test(contentLength)) {
				const declaredBytes = Number(contentLength);
				if (!Number.isSafeInteger(declaredBytes) || declaredBytes > MAX_ARCHIVE_BYTES) {
					await cancelUnreadResponseBody(response);
					throw new Error(`Download exceeds the ${MAX_ARCHIVE_BYTES}-byte archive limit`);
				}
			}
		}
		const body = response.body;
		async function* chunks() {
			yield* body.values({ preventCancel: true });
		}
		await destination.create(join(destination.rootReal, assetName), chunks(), {
			maxBytes: MAX_ARCHIVE_BYTES,
			mkdir: false,
			durable: false,
			mode: 438 & ~process.umask()
		});
	} finally {
		await guarded.release();
	}
}
async function extractArchiveSafe(archivePath, extractDir, assetName) {
	try {
		await extractArchive({
			archivePath,
			destDir: extractDir,
			timeoutMs: ARCHIVE_EXTRACT_TIMEOUT_MS,
			limits: {
				maxArchiveBytes: MAX_ARCHIVE_BYTES,
				maxExtractedBytes: MAX_EXTRACTED_BYTES,
				maxEntries: MAX_ARCHIVE_ENTRIES
			}
		});
	} catch (err) {
		throw new Error(`Failed to extract ${assetName}: ${err instanceof Error ? err.message : String(err)}`, { cause: err });
	}
}
async function downloadTool(tool, toolsDir) {
	const config = TOOLS[tool];
	const plat = platform();
	const architecture = arch();
	let version = await getLatestVersion(config.repo);
	if (tool === "fd" && plat === "darwin" && architecture === "x64") version = "10.3.0";
	const assetName = config.getAssetName(version, plat, architecture);
	if (!assetName) throw new Error(`Unsupported platform: ${plat}/${architecture}`);
	mkdirSync(toolsDir, { recursive: true });
	const downloadUrl = `https://github.com/${config.repo}/releases/download/${config.tagPrefix}${version}/${assetName}`;
	const binaryExt = plat === "win32" ? ".exe" : "";
	const binaryPath = join(toolsDir, config.binaryName + binaryExt);
	const stagingDir = join(toolsDir, `install_tmp_${config.binaryName}_${process.pid}_${randomUUID()}`);
	const archivePath = join(stagingDir, assetName);
	const extractDir = join(stagingDir, "extract");
	mkdirSync(extractDir, { recursive: true });
	try {
		await downloadFile(downloadUrl, await root(stagingDir), assetName);
		if (assetName.endsWith(".tar.gz") || assetName.endsWith(".zip")) await extractArchiveSafe(archivePath, extractDir, assetName);
		else throw new Error(`Unsupported archive format: ${assetName}`);
		const binaryFileName = config.binaryName + binaryExt;
		const extractedDir = join(extractDir, assetName.replace(/\.(tar\.gz|zip)$/, ""));
		let extractedBinary = [join(extractedDir, binaryFileName), join(extractDir, binaryFileName)].find((candidate) => existsSync(candidate));
		if (!extractedBinary) {
			const { entries, failedDirs } = walkDirectorySync(extractDir, {
				symlinks: "skip",
				include: (entry) => entry.kind === "file" && entry.name === binaryFileName
			});
			extractedBinary = entries[0]?.path;
			const failure = failedDirs[0];
			if (!extractedBinary && failure) throw failure.error;
		}
		if (extractedBinary) renameSync(extractedBinary, binaryPath);
		else throw new Error(`Binary not found in archive: expected ${binaryFileName} under ${extractDir}`);
		if (plat !== "win32") chmodSync(binaryPath, 493);
	} finally {
		rmSync(stagingDir, {
			recursive: true,
			force: true
		});
	}
	return binaryPath;
}
function installTool(tool, toolsDir) {
	const config = TOOLS[tool];
	const binaryPath = join(toolsDir, config.binaryName + (platform() === "win32" ? ".exe" : ""));
	const currentInstallation = toolInstallations.get(binaryPath);
	if (currentInstallation) return currentInstallation;
	mkdirSync(toolsDir, { recursive: true });
	const installation = withFileLock(binaryPath, TOOL_INSTALL_LOCK_OPTIONS, async () => {
		return getToolPath(tool, toolsDir) ?? downloadTool(tool, toolsDir);
	});
	toolInstallations.set(binaryPath, installation);
	installation.then(() => {
		if (toolInstallations.get(binaryPath) === installation) toolInstallations.delete(binaryPath);
	}, () => {
		if (toolInstallations.get(binaryPath) === installation) toolInstallations.delete(binaryPath);
	});
	return installation;
}
const TERMUX_PACKAGES = {
	fd: "fd",
	rg: "ripgrep"
};
async function ensureTool(tool, silent = false) {
	const toolsDir = getBinDir();
	const existingPath = getToolPath(tool, toolsDir);
	if (existingPath) return existingPath;
	const config = TOOLS[tool];
	if (!toolsDir) {
		if (!silent) console.log(chalk.yellow(`${config.name} not found. Install it on PATH or select an agent owner before downloading.`));
		return;
	}
	if (isOfflineModeEnabled()) {
		if (!silent) console.log(chalk.yellow(`${config.name} not found. Offline mode enabled, skipping download.`));
		return;
	}
	if (platform() === "android") {
		const pkgName = TERMUX_PACKAGES[tool] ?? tool;
		if (!silent) console.log(chalk.yellow(`${config.name} not found. Install with: pkg install ${pkgName}`));
		return;
	}
	if (!silent) console.log(chalk.dim(`${config.name} not found. Downloading...`));
	try {
		const path = await installTool(tool, toolsDir);
		if (!silent) console.log(chalk.dim(`${config.name} installed to ${path}`));
		return path;
	} catch (e) {
		if (!silent) console.log(chalk.yellow(`Failed to download ${config.name}: ${e instanceof Error ? e.message : String(e)}`));
		return;
	}
}
//#endregion
export { getExamplesPath as a, getDocsPath as i, CONFIG_DIR_NAME as n, getReadmePath as o, PACKAGE_MANIFEST_VERSION as r, isBunBinary as s, ensureTool as t };
