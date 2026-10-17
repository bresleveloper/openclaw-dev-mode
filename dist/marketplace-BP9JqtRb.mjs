import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath, r as resolveOsHomeRelativePath } from "./home-dir-Dc6nN6HB.mjs";
import { d as pathExists$1, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as sanitizeForLog } from "./ansi-BeFJ0Uu7.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BnHakqqk.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { t as readChunkWithIdleTimeout } from "./http-response-body-timeout-DMIhnjTT.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { f as resolveArchiveKind } from "./archive-DqZZMnnW.mjs";
import { L as copyPluginInstallTransactionRequest } from "./npm-managed-root-GptrecB0.mjs";
import { n as installPluginFromPath } from "./install-D30jO0d-.mjs";
import { i as acquireGitSource, n as isImmutableGitCommitRef } from "./git-install-C_lvfhPd.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
//#region src/plugins/marketplace.ts
const DEFAULT_MARKETPLACE_DOWNLOAD_TIMEOUT_MS = 12e4;
const MAX_MARKETPLACE_ARCHIVE_BYTES = 268435456;
const MAX_MARKETPLACE_MANIFEST_BYTES = 16777216;
const MARKETPLACE_MANIFEST_CANDIDATES = [path.join(".claude-plugin", "marketplace.json"), "marketplace.json"];
const CLAUDE_KNOWN_MARKETPLACES_PATH = path.join("~", ".claude", "plugins", "known_marketplaces.json");
function isGitUrl(value) {
	return /^git@/i.test(value) || /^ssh:\/\//i.test(value) || /^https?:\/\/.+\.git(?:#.*)?$/i.test(value);
}
function looksLikeGitHubRepoShorthand(value) {
	return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#.+)?$/.test(value.trim());
}
function splitRef(value) {
	const trimmed = value.trim();
	const hashIndex = trimmed.lastIndexOf("#");
	if (hashIndex <= 0 || hashIndex >= trimmed.length - 1) return { base: trimmed };
	return {
		base: trimmed.slice(0, hashIndex),
		ref: normalizeOptionalString(trimmed.slice(hashIndex + 1))
	};
}
function normalizeEntrySource(raw) {
	if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (!trimmed) return {
			ok: false,
			error: "empty plugin source"
		};
		if (hasHttpUrlPrefix(trimmed)) return {
			ok: true,
			source: {
				kind: "url",
				url: trimmed
			}
		};
		return {
			ok: true,
			source: {
				kind: "path",
				path: trimmed
			}
		};
	}
	if (!raw || typeof raw !== "object") return {
		ok: false,
		error: "plugin source must be a string or object"
	};
	const rec = raw;
	const kind = normalizeOptionalString(rec.type) ?? normalizeOptionalString(rec.source);
	if (!kind) return {
		ok: false,
		error: "plugin source object missing \"type\" or \"source\""
	};
	if (kind === "path") {
		const sourcePath = normalizeOptionalString(rec.path);
		if (!sourcePath) return {
			ok: false,
			error: "path source missing \"path\""
		};
		return {
			ok: true,
			source: {
				kind: "path",
				path: sourcePath
			}
		};
	}
	if (kind === "github" || kind === "git") {
		const identifier = kind === "github" ? normalizeOptionalString(rec.repo) ?? normalizeOptionalString(rec.url) : normalizeOptionalString(rec.url) ?? normalizeOptionalString(rec.repo);
		if (!identifier) return {
			ok: false,
			error: kind === "github" ? "github source missing \"repo\"" : "git source missing \"url\""
		};
		return {
			ok: true,
			source: {
				...kind === "github" ? {
					kind,
					repo: identifier
				} : {
					kind,
					url: identifier
				},
				path: normalizeOptionalString(rec.path),
				ref: normalizeOptionalString(rec.ref) ?? normalizeOptionalString(rec.branch) ?? normalizeOptionalString(rec.tag)
			}
		};
	}
	if (kind === "git-subdir") {
		const url = normalizeOptionalString(rec.url) ?? normalizeOptionalString(rec.repo);
		const sourcePath = normalizeOptionalString(rec.path) ?? normalizeOptionalString(rec.subdir);
		if (!url) return {
			ok: false,
			error: "git-subdir source missing \"url\""
		};
		if (!sourcePath) return {
			ok: false,
			error: "git-subdir source missing \"path\""
		};
		return {
			ok: true,
			source: {
				kind: "git-subdir",
				url,
				path: sourcePath,
				ref: normalizeOptionalString(rec.ref) ?? normalizeOptionalString(rec.branch) ?? normalizeOptionalString(rec.tag)
			}
		};
	}
	if (kind === "url") {
		const url = normalizeOptionalString(rec.url);
		if (!url) return {
			ok: false,
			error: "url source missing \"url\""
		};
		return {
			ok: true,
			source: {
				kind: "url",
				url
			}
		};
	}
	return {
		ok: false,
		error: `unsupported plugin source kind: ${kind}`
	};
}
function marketplaceEntrySourceToInput(source) {
	switch (source.kind) {
		case "path": return source.path;
		case "github": return `${source.repo}${source.ref ? `#${source.ref}` : ""}`;
		case "git":
		case "git-subdir": return `${source.url}${source.ref ? `#${source.ref}` : ""}`;
		default: return source.url;
	}
}
function marketplaceEntryGitRef(source) {
	switch (source.kind) {
		case "github":
		case "git":
		case "git-subdir": return source.ref;
		case "url": return resolveArchiveKind(source.url) ? void 0 : normalizeGitCloneSource(source.url)?.ref;
		default: return;
	}
}
function marketplaceInstallPolicySource(params) {
	const archive = Boolean(resolveArchiveKind(params.resolvedPath));
	if (params.source.kind === "path" && !hasHttpUrlPrefix(params.source.path)) {
		const remote = params.marketplaceOrigin === "remote";
		return {
			kind: archive ? "archive" : remote ? "git" : "local-path",
			authority: remote ? "third-party" : "user",
			mutable: remote ? !isImmutableGitCommitRef(params.marketplaceRef) : true,
			network: remote
		};
	}
	return {
		kind: archive || params.source.kind === "path" || params.source.kind === "url" && resolveArchiveKind(params.source.url) ? "archive" : "git",
		authority: "third-party",
		mutable: !isImmutableGitCommitRef(marketplaceEntryGitRef(params.source)),
		network: true
	};
}
function marketplaceInstallPolicyRequestKind(params) {
	if (resolveArchiveKind(params.resolvedPath)) return "plugin-archive";
	if (params.marketplaceOrigin === "remote") return "plugin-git";
	if (params.source.kind === "github" || params.source.kind === "git" || params.source.kind === "git-subdir") return "plugin-git";
	if (params.source.kind === "url" && !resolveArchiveKind(params.source.url)) return "plugin-git";
	return "plugin-dir";
}
function parseMarketplaceManifest(raw, sourceLabel) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		return {
			ok: false,
			error: `invalid marketplace JSON at ${sourceLabel}: ${String(err)}`
		};
	}
	if (!parsed || typeof parsed !== "object") return {
		ok: false,
		error: `invalid marketplace JSON at ${sourceLabel}: expected object`
	};
	const rec = parsed;
	if (!Array.isArray(rec.plugins)) return {
		ok: false,
		error: `invalid marketplace JSON at ${sourceLabel}: missing plugins[]`
	};
	const plugins = [];
	for (const entry of rec.plugins) {
		if (!entry || typeof entry !== "object") return {
			ok: false,
			error: `invalid marketplace entry in ${sourceLabel}: expected object`
		};
		const plugin = entry;
		const name = normalizeOptionalString(plugin.name);
		if (!name) return {
			ok: false,
			error: `invalid marketplace entry in ${sourceLabel}: missing name`
		};
		const normalizedSource = normalizeEntrySource(plugin.source);
		if (!normalizedSource.ok) return {
			ok: false,
			error: `invalid marketplace entry "${name}" in ${sourceLabel}: ${normalizedSource.error}`
		};
		plugins.push({
			name,
			version: normalizeOptionalString(plugin.version),
			description: normalizeOptionalString(plugin.description),
			source: normalizedSource.source
		});
	}
	return {
		ok: true,
		manifest: {
			name: normalizeOptionalString(rec.name),
			version: normalizeOptionalString(rec.version),
			plugins
		}
	};
}
async function readClaudeKnownMarketplaces() {
	const knownPath = resolveOsHomeRelativePath(CLAUDE_KNOWN_MARKETPLACES_PATH);
	const parsed = await tryReadJson(knownPath);
	if (!parsed || typeof parsed !== "object") return {};
	const entries = parsed;
	const result = {};
	for (const [name, value] of Object.entries(entries)) {
		if (!value || typeof value !== "object") continue;
		const record = value;
		result[name] = {
			installLocation: normalizeOptionalString(record.installLocation),
			source: record.source
		};
	}
	return result;
}
function deriveMarketplaceRootFromManifestPath(manifestPath) {
	const manifestDir = path.dirname(manifestPath);
	return path.basename(manifestDir) === ".claude-plugin" ? path.dirname(manifestDir) : manifestDir;
}
async function findMarketplaceManifestPath(rootDir) {
	for (const candidate of MARKETPLACE_MANIFEST_CANDIDATES) {
		const manifestPath = path.join(rootDir, candidate);
		if (await pathExists$1(manifestPath)) return manifestPath;
	}
}
async function resolveLocalMarketplaceSource(input) {
	const resolved = resolveUserPath(input);
	if (!await pathExists$1(resolved)) return null;
	const stat = await fs.stat(resolved);
	if (stat.isFile()) return {
		ok: true,
		rootDir: deriveMarketplaceRootFromManifestPath(resolved),
		manifestPath: resolved
	};
	if (!stat.isDirectory()) return {
		ok: false,
		error: `unsupported marketplace source: ${resolved}`
	};
	const rootDir = path.basename(resolved) === ".claude-plugin" ? path.dirname(resolved) : resolved;
	const manifestPath = await findMarketplaceManifestPath(rootDir);
	if (manifestPath) return {
		ok: true,
		rootDir,
		manifestPath
	};
	return {
		ok: false,
		error: `marketplace manifest not found under ${resolved}`
	};
}
function normalizeGitCloneSource(source) {
	const split = splitRef(source);
	if (looksLikeGitHubRepoShorthand(split.base)) return {
		url: `https://github.com/${split.base}.git`,
		ref: split.ref,
		label: split.base
	};
	if (isGitUrl(source)) return {
		url: split.base,
		ref: split.ref,
		label: split.base
	};
	if (hasHttpUrlPrefix(source)) try {
		const url = new URL(split.base);
		if (url.hostname !== "github.com") return null;
		const parts = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
		if (parts.length < 2) return null;
		const repo = `${parts[0]}/${parts[1]?.replace(/\.git$/i, "")}`;
		return {
			url: `https://github.com/${repo}.git`,
			ref: split.ref,
			label: repo
		};
	} catch {
		return null;
	}
	return null;
}
async function cloneMarketplaceRepo(params) {
	const normalized = normalizeGitCloneSource(params.source);
	if (!normalized) return {
		ok: false,
		error: `unsupported marketplace source: ${params.source}`
	};
	const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-marketplace-"));
	const repoDir = path.join(tmpDir, "repo");
	const cleanup = async () => {
		await fs.rm(tmpDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	};
	params.logger?.info?.(`Cloning marketplace source ${normalized.label}...`);
	const acquired = await acquireGitSource({
		...normalized,
		repoDir,
		refMode: isImmutableGitCommitRef(normalized.ref) ? "detached" : "shallow-branch",
		timeoutMs: params.timeoutMs,
		cloneSeparator: false,
		recordCommit: false,
		cleanupOnFailure: cleanup,
		formatFailure: ({ action, stdout, stderr }) => {
			const detail = stderr.trim() || stdout.trim() || `git ${action} failed`;
			return `failed to ${action} marketplace source ${normalized.label}: ${detail}`;
		}
	});
	if (!acquired.ok) return acquired;
	return {
		ok: true,
		rootDir: repoDir,
		label: normalized.label,
		...normalized.ref ? { ref: normalized.ref } : {},
		cleanup
	};
}
async function loadMarketplace(params) {
	const loadMarketplaceFromManifestFile = async (paramsLocal) => {
		let raw;
		try {
			const resolvedManifestPath = await fs.realpath(paramsLocal.manifestPath);
			const { buffer } = await readRegularFile({
				filePath: resolvedManifestPath,
				maxBytes: MAX_MARKETPLACE_MANIFEST_BYTES
			});
			raw = buffer.toString("utf-8");
		} catch (err) {
			await paramsLocal.cleanup?.();
			const message = err instanceof Error ? err.message : String(err);
			if (message.startsWith("File exceeds")) return {
				ok: false,
				error: "Marketplace manifest too large"
			};
			return {
				ok: false,
				error: `Marketplace manifest unreadable: ${message}`
			};
		}
		const parsed = parseMarketplaceManifest(raw, paramsLocal.manifestPath);
		if (!parsed.ok) {
			await paramsLocal.cleanup?.();
			return parsed;
		}
		const validated = await validateMarketplaceManifest({
			manifest: parsed.manifest,
			sourceLabel: paramsLocal.sourceLabel,
			rootDir: paramsLocal.rootDir,
			origin: paramsLocal.origin
		});
		if (!validated.ok) {
			await paramsLocal.cleanup?.();
			return validated;
		}
		return {
			ok: true,
			marketplace: {
				manifest: validated.manifest,
				rootDir: paramsLocal.rootDir,
				sourceLabel: paramsLocal.sourceLabel,
				origin: paramsLocal.origin,
				...paramsLocal.remoteRef ? { remoteRef: paramsLocal.remoteRef } : {},
				cleanup: paramsLocal.cleanup
			}
		};
	};
	const loadResolvedLocalMarketplace = async (local, sourceLabel) => loadMarketplaceFromManifestFile({
		manifestPath: local.manifestPath,
		sourceLabel,
		rootDir: local.rootDir,
		origin: "local"
	});
	const knownMarketplaces = await readClaudeKnownMarketplaces();
	const visitedKnownMarketplaces = /* @__PURE__ */ new Set();
	let source = params.source;
	while (true) {
		const known = knownMarketplaces[source];
		if (!known) break;
		if (visitedKnownMarketplaces.has(source)) return {
			ok: false,
			error: `known marketplace source cycle: ${[...visitedKnownMarketplaces, source].join(" -> ")}`
		};
		visitedKnownMarketplaces.add(source);
		if (known.installLocation) {
			const local = await resolveLocalMarketplaceSource(known.installLocation);
			if (local?.ok) return await loadResolvedLocalMarketplace(local, source);
		}
		const normalizedSource = normalizeEntrySource(known.source);
		if (!normalizedSource.ok) break;
		source = marketplaceEntrySourceToInput(normalizedSource.source);
	}
	const local = await resolveLocalMarketplaceSource(source);
	if (local?.ok === false) return local;
	if (local?.ok) return await loadResolvedLocalMarketplace(local, local.manifestPath);
	const cloned = await cloneMarketplaceRepo({
		source,
		timeoutMs: params.timeoutMs,
		logger: params.logger
	});
	if (!cloned.ok) return cloned;
	const manifestPath = await findMarketplaceManifestPath(cloned.rootDir);
	if (!manifestPath) {
		await cloned.cleanup();
		return {
			ok: false,
			error: `marketplace manifest not found in ${cloned.label}`
		};
	}
	return await loadMarketplaceFromManifestFile({
		manifestPath,
		sourceLabel: cloned.label,
		rootDir: cloned.rootDir,
		origin: "remote",
		...cloned.ref ? { remoteRef: cloned.ref } : {},
		cleanup: cloned.cleanup
	});
}
function resolveSafeMarketplaceDownloadFileName(url, fallback) {
	const pathname = new URL(url).pathname;
	const fileName = path.basename(pathname).trim() || fallback;
	if (fileName === "." || fileName === ".." || /^[a-zA-Z]:/.test(fileName) || path.isAbsolute(fileName) || fileName.includes("/") || fileName.includes("\\")) throw new Error("invalid download filename");
	return fileName;
}
function resolveMarketplaceDownloadTimeoutMs(timeoutMs) {
	return Math.max(1e3, Math.floor(typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_MARKETPLACE_DOWNLOAD_TIMEOUT_MS));
}
function formatMarketplaceDownloadError(url, detail) {
	return `failed to download ${sanitizeForLog(redactSensitiveUrlLikeString(url))}: ` + sanitizeForLog(detail);
}
function hasStreamingResponseBody(response) {
	return Boolean(response.body && typeof response.body.getReader === "function");
}
function parseMarketplaceContentLength(raw) {
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) throw new Error(`invalid content-length header: ${raw}`);
	const size = Number(trimmed);
	if (!Number.isSafeInteger(size)) throw new Error(`invalid content-length header: ${raw}`);
	return size;
}
async function* marketplaceResponseChunks(body, timeoutMs) {
	const reader = body.getReader();
	try {
		while (true) {
			const { done, value } = await readChunkWithIdleTimeout(reader, timeoutMs, ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`download timed out after ${chunkTimeoutMs}ms`));
			if (done) return;
			if (!value?.length) continue;
			yield value;
		}
	} finally {
		await reader.cancel().catch(() => void 0);
		try {
			reader.releaseLock();
		} catch {}
	}
}
async function downloadUrlToTempFile(url, timeoutMs) {
	let sourceFileName = "plugin.tgz";
	let workspace;
	try {
		sourceFileName = resolveSafeMarketplaceDownloadFileName(url, sourceFileName);
		const downloadTimeoutMs = resolveMarketplaceDownloadTimeoutMs(timeoutMs);
		const { response, finalUrl, release } = await fetchWithSsrFGuard({
			url,
			timeoutMs: downloadTimeoutMs,
			auditContext: "marketplace-plugin-download"
		});
		try {
			if (!response.ok) return {
				ok: false,
				error: formatMarketplaceDownloadError(url, `HTTP ${response.status}`)
			};
			if (!response.body) return {
				ok: false,
				error: formatMarketplaceDownloadError(url, "empty response body")
			};
			if (!hasStreamingResponseBody(response)) return {
				ok: false,
				error: formatMarketplaceDownloadError(url, "streaming response body unavailable")
			};
			const contentLength = response.headers.get("content-length");
			if (contentLength) {
				const size = parseMarketplaceContentLength(contentLength);
				if (size > MAX_MARKETPLACE_ARCHIVE_BYTES) throw new Error(`download too large: ${size} bytes (limit: ${MAX_MARKETPLACE_ARCHIVE_BYTES} bytes)`);
			}
			const finalFileName = resolveSafeMarketplaceDownloadFileName(finalUrl, sourceFileName);
			const fileName = resolveArchiveKind(finalFileName) ? finalFileName : sourceFileName;
			workspace = await tempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "openclaw-marketplace-download-"
			});
			const createdWorkspace = workspace;
			const targetPath = workspace.path(fileName);
			await (await root(workspace.dir)).create(fileName, marketplaceResponseChunks(response.body, downloadTimeoutMs), {
				maxBytes: MAX_MARKETPLACE_ARCHIVE_BYTES,
				mode: 438 & ~process.umask(),
				durable: false
			});
			return {
				ok: true,
				path: targetPath,
				cleanup: async () => {
					await createdWorkspace.cleanup().catch(() => void 0);
				}
			};
		} finally {
			await response.body?.cancel().catch(() => void 0);
			await release().catch(() => void 0);
		}
	} catch (error) {
		await workspace?.cleanup().catch(() => void 0);
		return {
			ok: false,
			error: formatMarketplaceDownloadError(url, formatErrorMessage(error))
		};
	}
}
async function ensureInsideMarketplaceRoot(rootDir, candidate, options) {
	const resolved = path.resolve(rootDir, candidate);
	const resolvedExists = await pathExists$1(resolved);
	const escaped = {
		ok: false,
		error: `plugin source escapes marketplace root: ${candidate}`
	};
	if (!isPathInside(rootDir, resolved)) return escaped;
	if (options?.canonicalRootDir) {
		if (!(await fs.lstat(options.canonicalRootDir)).isDirectory()) return escaped;
		const rootRealPath = await fs.realpath(options.canonicalRootDir);
		let existingPath = resolved;
		while (!await pathExists$1(existingPath)) {
			const parentPath = path.dirname(existingPath);
			if (parentPath === existingPath) return escaped;
			existingPath = parentPath;
		}
		const existingRealPath = await fs.realpath(existingPath);
		if (!isPathInside(rootRealPath, existingRealPath)) return escaped;
	}
	if (!resolvedExists) return {
		ok: false,
		error: `plugin source not found in marketplace root: ${candidate}`
	};
	return {
		ok: true,
		path: resolved
	};
}
async function validateMarketplaceManifest(params) {
	if (params.origin === "local") return {
		ok: true,
		manifest: params.manifest
	};
	const canonicalRootDir = await fs.realpath(params.rootDir);
	for (const plugin of params.manifest.plugins) {
		const source = plugin.source;
		if (source.kind === "path") {
			if (hasHttpUrlPrefix(source.path)) return {
				ok: false,
				error: `invalid marketplace entry "${plugin.name}" in ${params.sourceLabel}: remote marketplaces may not use HTTP(S) plugin paths`
			};
			if (path.isAbsolute(source.path)) return {
				ok: false,
				error: `invalid marketplace entry "${plugin.name}" in ${params.sourceLabel}: remote marketplaces may only use relative plugin paths`
			};
			const resolved = await ensureInsideMarketplaceRoot(params.rootDir, source.path, { canonicalRootDir });
			if (!resolved.ok) return {
				ok: false,
				error: `invalid marketplace entry "${plugin.name}" in ${params.sourceLabel}: ${resolved.error}`
			};
			continue;
		}
		return {
			ok: false,
			error: `invalid marketplace entry "${plugin.name}" in ${params.sourceLabel}: remote marketplaces may not use ${source.kind} plugin sources`
		};
	}
	return {
		ok: true,
		manifest: params.manifest
	};
}
async function resolveMarketplaceEntryInstallPath(params) {
	if (params.source.kind === "path") {
		if (hasHttpUrlPrefix(params.source.path)) {
			if (resolveArchiveKind(params.source.path)) return await downloadUrlToTempFile(params.source.path, params.timeoutMs);
			return {
				ok: false,
				error: `unsupported remote plugin path source: ${params.source.path}`
			};
		}
		const canonicalRootDir = params.marketplaceOrigin === "remote" ? await fs.realpath(params.marketplaceRootDir) : void 0;
		return path.isAbsolute(params.source.path) ? {
			ok: true,
			path: params.source.path
		} : await ensureInsideMarketplaceRoot(params.marketplaceRootDir, params.source.path, { canonicalRootDir });
	}
	if (params.source.kind === "url") {
		if (resolveArchiveKind(params.source.url)) return await downloadUrlToTempFile(params.source.url, params.timeoutMs);
		if (!normalizeGitCloneSource(params.source.url)) return {
			ok: false,
			error: `unsupported URL plugin source: ${params.source.url}`
		};
	}
	const cloned = await cloneMarketplaceRepo({
		source: marketplaceEntrySourceToInput(params.source),
		timeoutMs: params.timeoutMs,
		logger: params.logger
	});
	if (!cloned.ok) return cloned;
	if (params.source.kind === "url") return {
		ok: true,
		path: cloned.rootDir,
		cleanup: cloned.cleanup
	};
	const subPath = params.source.kind === "git-subdir" ? params.source.path.trim() : normalizeOptionalString(params.source.path) || ".";
	const canonicalRootDir = await fs.realpath(cloned.rootDir);
	const target = await ensureInsideMarketplaceRoot(cloned.rootDir, subPath, { canonicalRootDir });
	if (!target.ok) {
		await cloned.cleanup();
		return target;
	}
	return {
		ok: true,
		path: target.path,
		cleanup: cloned.cleanup
	};
}
async function listMarketplacePlugins(params) {
	const loaded = await loadMarketplace({
		source: params.marketplace,
		logger: params.logger,
		timeoutMs: params.timeoutMs
	});
	if (!loaded.ok) return loaded;
	try {
		return {
			ok: true,
			manifest: loaded.marketplace.manifest,
			sourceLabel: loaded.marketplace.sourceLabel
		};
	} finally {
		await loaded.marketplace.cleanup?.();
	}
}
async function resolveMarketplaceInstallShortcut(raw) {
	const trimmed = raw.trim();
	const atIndex = trimmed.lastIndexOf("@");
	if (atIndex <= 0 || atIndex >= trimmed.length - 1) return null;
	const plugin = trimmed.slice(0, atIndex).trim();
	const marketplaceName = trimmed.slice(atIndex + 1).trim();
	if (!plugin || !marketplaceName || plugin.includes("/")) return null;
	const known = (await readClaudeKnownMarketplaces())[marketplaceName];
	if (!known) return null;
	if (!known.installLocation) {
		const normalizedSource = normalizeEntrySource(known.source);
		if (!normalizedSource.ok) return {
			ok: false,
			error: `known Claude marketplace "${marketplaceName}" has an invalid source: ${normalizedSource.error}`
		};
	}
	return {
		ok: true,
		plugin,
		marketplaceName,
		marketplaceSource: marketplaceName
	};
}
async function installPluginFromMarketplace(params) {
	const loaded = await loadMarketplace({
		source: params.marketplace,
		logger: params.logger,
		timeoutMs: params.timeoutMs
	});
	if (!loaded.ok) return loaded;
	let installCleanup;
	try {
		const entry = loaded.marketplace.manifest.plugins.find((plugin) => plugin.name === params.plugin);
		if (!entry) {
			const known = loaded.marketplace.manifest.plugins.map((plugin) => plugin.name).toSorted();
			return {
				ok: false,
				error: `plugin "${params.plugin}" not found in marketplace ${loaded.marketplace.sourceLabel}` + (known.length > 0 ? ` (available: ${known.join(", ")})` : "")
			};
		}
		const resolved = await resolveMarketplaceEntryInstallPath({
			source: entry.source,
			marketplaceRootDir: loaded.marketplace.rootDir,
			marketplaceOrigin: loaded.marketplace.origin,
			logger: params.logger,
			timeoutMs: params.timeoutMs
		});
		if (!resolved.ok) return resolved;
		installCleanup = resolved.cleanup;
		const result = await installPluginFromPath(copyPluginInstallTransactionRequest(params, {
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			path: resolved.path,
			logger: params.logger,
			mode: params.mode,
			extensionsDir: params.extensionsDir,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			dryRun: params.dryRun,
			expectedPluginId: params.expectedPluginId,
			onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
			beforePersistentApply: params.beforePersistentApply,
			installPolicyRequest: {
				kind: marketplaceInstallPolicyRequestKind({
					marketplaceOrigin: loaded.marketplace.origin,
					resolvedPath: resolved.path,
					source: entry.source
				}),
				requestedSpecifier: `${entry.name}@${params.marketplace}`,
				source: marketplaceInstallPolicySource({
					marketplaceOrigin: loaded.marketplace.origin,
					marketplaceRef: loaded.marketplace.remoteRef,
					resolvedPath: resolved.path,
					source: entry.source
				})
			}
		}));
		if (!result.ok) return result;
		return {
			...result,
			marketplaceName: loaded.marketplace.manifest.name,
			marketplaceVersion: loaded.marketplace.manifest.version,
			marketplacePlugin: entry.name,
			marketplaceSource: params.marketplace,
			marketplaceEntryVersion: entry.version
		};
	} finally {
		await installCleanup?.();
		await loaded.marketplace.cleanup?.();
	}
}
//#endregion
export { listMarketplacePlugins as n, resolveMarketplaceInstallShortcut as r, installPluginFromMarketplace as t };
