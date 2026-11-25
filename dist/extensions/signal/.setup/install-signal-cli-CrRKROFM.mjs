import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { sliceUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { extractErrorCode, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import fs from "node:fs/promises";
import { CONFIG_DIR, extractArchive, resolveBrewExecutable } from "openclaw/plugin-sdk/setup-tools";
import { walkDirectory } from "@openclaw/fs-safe/walk";
import { root } from "openclaw/plugin-sdk/file-access-runtime";
import { redactToolPayloadText } from "openclaw/plugin-sdk/logging-core";
import { readProviderJsonObjectResponse } from "openclaw/plugin-sdk/provider-http";
import { runPluginCommandWithTimeout } from "openclaw/plugin-sdk/run-command";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { withTempDownloadPath } from "openclaw/plugin-sdk/temp-path";
// extensions/signal/src/install-signal-cli.ts
const MAX_SIGNAL_CLI_ARCHIVE_BYTES = 268435456;
const MAX_SIGNAL_CLI_EXTRACTED_BYTES = 402653184;
const SIGNAL_CLI_DOWNLOAD_TIMEOUT_MS = 3e5;
const SIGNAL_CLI_RELEASE_INFO_TIMEOUT_MS = 3e4;
const CONTENT_LENGTH_RE = /^\d+$/;
/** @internal Exported for testing. */
async function downloadToFile(url, dest) {
	const { response, release } = await fetchWithSsrFGuard({
		url,
		maxRedirects: 5,
		requireHttps: true,
		timeoutMs: SIGNAL_CLI_DOWNLOAD_TIMEOUT_MS,
		capture: false,
		auditContext: "signal-cli-install-archive"
	});
	try {
		if (!response.ok || !response.body) throw new Error(`HTTP ${response.status || "?"} downloading file`);
		const rawLength = response.headers.get("content-length");
		if (rawLength !== null) {
			const trimmedLength = rawLength.trim();
			const declaredLength = CONTENT_LENGTH_RE.test(trimmedLength) ? Number(trimmedLength) : NaN;
			if (Number.isFinite(declaredLength) && declaredLength > MAX_SIGNAL_CLI_ARCHIVE_BYTES) throw new Error(`signal-cli archive exceeds the ${MAX_SIGNAL_CLI_ARCHIVE_BYTES}-byte download cap (declared ${declaredLength}).`);
		}
		const body = response.body;
		async function* chunks() {
			yield* body.values({ preventCancel: true });
		}
		await (await root(path.dirname(dest))).create(path.basename(dest), chunks(), {
			maxBytes: MAX_SIGNAL_CLI_ARCHIVE_BYTES,
			mkdir: false,
			durable: false,
			mode: 438 & ~process.umask()
		});
	} catch (error) {
		if (extractErrorCode(error) === "too-large") throw new Error(`signal-cli archive exceeded the ${MAX_SIGNAL_CLI_ARCHIVE_BYTES}-byte download cap.`, { cause: error });
		throw error;
	} finally {
		await release();
	}
}
async function findSignalCliBinary(root) {
	const { entries } = await walkDirectory(root, {
		maxDepth: 4,
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && entry.name === "signal-cli"
	});
	return entries[0]?.path ?? null;
}
async function resolveBrewSignalCliPath(brewExe) {
	try {
		const result = await runPluginCommandWithTimeout({
			argv: [
				brewExe,
				"--prefix",
				"signal-cli"
			],
			timeoutMs: 1e4
		});
		if (result.code === 0 && result.stdout.trim()) {
			const prefix = result.stdout.trim();
			const candidate = path.join(prefix, "bin", "signal-cli");
			try {
				await fs.access(candidate);
				return candidate;
			} catch {
				return findSignalCliBinary(prefix);
			}
		}
	} catch {}
	return null;
}
function brewErrorTail(stderr) {
	const text = redactToolPayloadText(stderr).trim();
	return text.length > 200 ? `...${sliceUtf16Safe(text, -200)}` : text;
}
async function installSignalCliViaBrew(runtime) {
	const brewExe = resolveBrewExecutable();
	if (!brewExe) return {
		ok: false,
		error: `No native signal-cli build is available for ${process.platform}/${process.arch}. Install Homebrew (https://brew.sh) and try again, or install signal-cli manually.`
	};
	runtime.log(`Installing signal-cli via Homebrew (${brewExe})…`);
	const result = await runPluginCommandWithTimeout({
		argv: [
			brewExe,
			"install",
			"signal-cli"
		],
		timeoutMs: 9e5
	});
	if (result.code !== 0) return {
		ok: false,
		error: `brew install signal-cli failed (exit ${result.code}): ${brewErrorTail(result.stderr)}`
	};
	const cliPath = await resolveBrewSignalCliPath(brewExe);
	if (!cliPath) return {
		ok: false,
		error: "brew install succeeded but signal-cli binary was not found."
	};
	let version;
	try {
		version = (await runPluginCommandWithTimeout({
			argv: [cliPath, "--version"],
			timeoutMs: 1e4
		})).stdout.trim().replace(/^signal-cli\s+/, "") || void 0;
	} catch {}
	return {
		ok: true,
		cliPath,
		version
	};
}
async function installSignalCli(runtime) {
	if (process.platform === "win32") return {
		ok: false,
		error: "Signal CLI auto-install is not supported on Windows yet."
	};
	if (process.platform === "linux" && process.arch === "x64") {
		const { response, release } = await fetchWithSsrFGuard({
			url: "https://api.github.com/repos/AsamK/signal-cli/releases/latest",
			maxRedirects: 5,
			requireHttps: true,
			timeoutMs: SIGNAL_CLI_RELEASE_INFO_TIMEOUT_MS,
			capture: false,
			auditContext: "signal-cli-release-info",
			init: { headers: {
				"User-Agent": "openclaw",
				Accept: "application/vnd.github+json"
			} }
		});
		let releaseInfo;
		try {
			if (!response.ok) return {
				ok: false,
				error: `Failed to fetch release info (${response.status})`
			};
			try {
				const payload = await readProviderJsonObjectResponse(response, "signal.release-info");
				const tagName = normalizeOptionalString(payload.tag_name);
				const version = normalizeOptionalString(tagName?.replace(/^v/, ""));
				if (!version || !Array.isArray(payload.assets)) throw new Error("Unexpected signal-cli release info");
				releaseInfo = {
					version,
					assets: payload.assets.flatMap((asset) => {
						if (!isRecord(asset)) return [];
						const name = normalizeOptionalString(asset.name);
						const browserDownloadUrl = normalizeOptionalString(asset.browser_download_url);
						return name && browserDownloadUrl ? [{
							name,
							browser_download_url: browserDownloadUrl
						}] : [];
					})
				};
			} catch {
				return {
					ok: false,
					error: "Failed to parse signal-cli release info."
				};
			}
		} finally {
			await release();
		}
		const archives = releaseInfo.assets.filter((asset) => /\.(?:tar\.gz|tgz|zip)$/.test(normalizeLowercaseStringOrEmpty(asset.name)));
		const byName = (pattern) => archives.find((asset) => pattern.test(normalizeLowercaseStringOrEmpty(asset.name)));
		const asset = byName(/linux-native/) || byName(/linux/) || archives[0];
		if (!asset) return {
			ok: false,
			error: "No compatible release asset found for this platform."
		};
		return await withTempDownloadPath({
			prefix: "openclaw-signal",
			fileName: asset.name
		}, async (archivePath) => {
			runtime.log(`Downloading signal-cli ${releaseInfo.version} (${asset.name})…`);
			await downloadToFile(asset.browser_download_url, archivePath);
			const installRoot = path.join(CONFIG_DIR, "tools", "signal-cli", releaseInfo.version);
			await fs.mkdir(installRoot, { recursive: true });
			try {
				await extractArchive({
					archivePath,
					destDir: installRoot,
					timeoutMs: 6e4,
					limits: {
						maxArchiveBytes: MAX_SIGNAL_CLI_ARCHIVE_BYTES,
						maxEntries: 32,
						maxEntryBytes: MAX_SIGNAL_CLI_EXTRACTED_BYTES,
						maxExtractedBytes: MAX_SIGNAL_CLI_EXTRACTED_BYTES
					}
				});
			} catch (err) {
				const message = formatErrorMessage(err);
				return {
					ok: false,
					error: `Failed to extract ${asset.name}: ${message}`
				};
			}
			const cliPath = await findSignalCliBinary(installRoot);
			if (!cliPath) return {
				ok: false,
				error: `signal-cli binary not found after extracting ${asset.name}`
			};
			await fs.chmod(cliPath, 493).catch(() => {});
			return {
				ok: true,
				cliPath,
				version: releaseInfo.version
			};
		});
	}
	return installSignalCliViaBrew(runtime);
}
export { installSignalCli as n, downloadToFile as t };
