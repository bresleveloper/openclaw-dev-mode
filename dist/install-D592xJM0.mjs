import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { g as resolveConfigDir, s as ensureDir } from "./utils-gjJ-tD2q.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as resolveBrewExecutable } from "./brew-D_VHatKs.mjs";
import { r as sha256File } from "./crypto-digest-y6oZN-_F.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { a as safePathSegmentHashed, t as assertCanonicalPathWithinBase } from "./install-safe-path-CvmSx2MJ.mjs";
import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DRapCKeS.mjs";
import { i as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-sFz3TNTx.mjs";
import { r as resolveSkillKey } from "./frontmatter-siV6LZij.mjs";
import { i as prepareSkillBundle } from "./bundle-CsGYNL0a.mjs";
import { r as resolveSkillFileHost } from "./skill-file-host-d_CtoZp0.mjs";
import { t as resolveSkillSource } from "./source-DbWOnpPI.mjs";
import { n as hasBinary } from "./config-eval-wcqg1YVW.mjs";
import { d as resolveSkillsInstallPreferences } from "./config-D7Jc5w1r.mjs";
import { t as evaluateSkillInstallPolicy } from "./install-security-scan-w6F7ef4V.mjs";
import { i as withTempDownloadPath } from "./temp-download-DmCt_Uvg.mjs";
import { i as prepareWorkspaceSkills } from "./workspace-skill-loader-B_yVTg_A.mjs";
import { t as materializeSkillResources } from "./resources-B8SeIb4_.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { isWithinDir } from "@openclaw/fs-safe/path";
import { isWindowsDrivePath } from "@openclaw/fs-safe/archive";
//#region src/skills/runtime/tools-dir.ts
function resolveSkillToolsRootDir(skillKey) {
	const safeKey = safePathSegmentHashed(skillKey);
	return path.join(resolveConfigDir(), "tools", safeKey);
}
//#endregion
//#region src/skills/lifecycle/install-output.ts
function summarizeInstallOutput(text) {
	const lines = normalizeStringEntries(text.trim().split("\n"));
	const preferred = lines.find((line) => /^error\b/i.test(line)) ?? lines.find((line) => /\b(err!|error:|failed)\b/i.test(line)) ?? lines.at(-1);
	if (!preferred) return;
	const normalized = preferred.replace(/\s+/g, " ").trim();
	return normalized.length > 200 ? `${truncateUtf16Safe(normalized, 199)}…` : normalized;
}
/** Formats a bounded install failure message from command exit and output. */
function formatInstallFailureMessage(result) {
	const code = typeof result.code === "number" ? `exit ${result.code}` : "unknown exit";
	const summary = summarizeInstallOutput(result.stderr) ?? summarizeInstallOutput(result.stdout);
	if (!summary) return `Install failed (${code})`;
	return `Install failed (${code}): ${summary}`;
}
//#endregion
//#region src/skills/lifecycle/install-download.ts
const MAX_SKILL_DOWNLOAD_BYTES = 268435456;
function resolveDownloadTargetDir(skillKey, spec) {
	const root = resolveSkillToolsRootDir(skillKey);
	const raw = spec.targetDir?.trim();
	if (!raw) return root;
	const resolved = raw.startsWith("~") || path.isAbsolute(raw) || isWindowsDrivePath(raw) ? resolveUserPath(raw) : path.resolve(root, raw);
	if (!isWithinDir(root, resolved)) throw new Error(`Refusing to install outside the skill tools directory. targetDir="${raw}" resolves to "${resolved}". Allowed root: "${root}".`);
	return resolved;
}
function parseSkillInstallFileName(header) {
	const disposition = /^[\t ]*[!#$%&'*+.^_`|~\da-z-]+[\t ]*/i.exec(header ?? "");
	if (!header || !disposition) return;
	const parameter = /;[\t ]*([!#$%&'*+.^_`|~\da-z-]+)[\t ]*=[\t ]*(?:"((?:[\t\x20-\x21\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\t\x20-\x7e\x80-\xff])*)"|([!#$%&'*+.^_`|~\da-z-]+))[\t ]*/giy;
	let filename;
	let extended;
	let offset = disposition[0].length;
	while (offset < header.length) {
		parameter.lastIndex = offset;
		const match = parameter.exec(header);
		if (!match) return;
		offset = parameter.lastIndex;
		const name = match[1].toLowerCase();
		if (name === "filename") {
			if (filename !== void 0) return;
			filename = match[2]?.replace(/\\([\s\S])/g, "$1") ?? match[3];
		} else if (name === "filename*") {
			if (extended !== void 0 || match[2] !== void 0) return;
			const value = /^utf-8'(?:[a-z]{1,8}(?:-[a-z\d]{1,8})*)?'((?:[!#$&+.^_`|~\da-z-]|%[\da-f]{2})*)$/i.exec(match[3]);
			if (!value) return;
			try {
				extended = decodeURIComponent(value[1]);
			} catch {
				return;
			}
		}
	}
	return (extended ?? filename) || void 0;
}
function detectArchiveType(filename) {
	const lower = normalizeOptionalLowercaseString(filename);
	if (!lower) return;
	if (lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) return "tar.gz";
	if (lower.endsWith(".tar.bz2") || lower.endsWith(".tbz2")) return "tar.bz2";
	if (lower.endsWith(".zip")) return "zip";
}
function resolveArchiveType(spec, filename, headerFileName) {
	const explicit = normalizeOptionalLowercaseString(spec.archive);
	if (explicit) return explicit;
	return detectArchiveType(spec.extract === true ? headerFileName : void 0) ?? detectArchiveType(filename);
}
async function downloadFile(params) {
	const temporaryRoot = await root(path.dirname(params.tempPath));
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		timeoutMs: Math.max(1e3, params.timeoutMs)
	});
	try {
		if (!response.ok || !response.body) throw new Error(`Download failed (${response.status} ${response.statusText})`);
		const archiveFileName = parseSkillInstallFileName(response.headers.get("content-disposition"));
		const contentEncoding = normalizeOptionalLowercaseString(response.headers.get("content-encoding"));
		const declaredBytes = !contentEncoding || contentEncoding === "identity" ? parseStrictNonNegativeInteger(response.headers.get("content-length")) : void 0;
		if (declaredBytes !== void 0 && declaredBytes > MAX_SKILL_DOWNLOAD_BYTES) throw new Error(`Skill download exceeds ${MAX_SKILL_DOWNLOAD_BYTES}-byte limit (declared ${declaredBytes} bytes)`);
		const body = response.body;
		let downloadedBytes = 0;
		async function* chunks() {
			for await (const chunk of body.values({ preventCancel: true })) {
				downloadedBytes += chunk.byteLength;
				yield chunk;
			}
		}
		await temporaryRoot.create(path.basename(params.tempPath), chunks(), {
			maxBytes: MAX_SKILL_DOWNLOAD_BYTES,
			mkdir: false,
			durable: false,
			mode: 438 & ~process.umask()
		});
		if (params.sha256) {
			const actual = await sha256File(params.tempPath);
			if (actual !== params.sha256) {
				const filename = path.basename(params.relativePath);
				throw new Error(`SHA-256 mismatch for ${filename}: expected ${params.sha256}, actual ${actual}. The download was discarded; verify the publisher checksum or update the skill manifest before retrying.`);
			}
		}
		await params.pinnedRoot.copyIn(params.relativePath, params.tempPath);
		return archiveFileName ? {
			bytes: downloadedBytes,
			archiveFileName
		} : { bytes: downloadedBytes };
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "too-large") throw new Error(`Skill download exceeds ${MAX_SKILL_DOWNLOAD_BYTES}-byte limit`, { cause: error });
		throw error;
	} finally {
		await release();
	}
}
async function publishExtractedTree(params) {
	if (params.targetRelativePath) await params.pinnedRoot.mkdir(params.targetRelativePath);
	else await params.pinnedRoot.ensureRoot();
	const publishDirectory = async (relativeDir) => {
		const sourceDir = path.join(params.sourceDir, relativeDir);
		for (const entry of await fs.promises.readdir(sourceDir, { withFileTypes: true })) {
			const relativePath = path.join(relativeDir, entry.name);
			const sourcePath = path.join(params.sourceDir, relativePath);
			const destinationPath = path.join(params.targetRelativePath, relativePath);
			const sourceStat = await fs.promises.lstat(sourcePath);
			try {
				if (sourceStat.isDirectory()) {
					await params.pinnedRoot.mkdir(destinationPath);
					await publishDirectory(relativePath);
					continue;
				}
				if (!sourceStat.isFile() || sourceStat.nlink !== 1) throw new Error(`archive staging contains unsupported entry: ${relativePath}`);
				await params.pinnedRoot.copyIn(destinationPath, sourcePath, {
					mode: sourceStat.mode & 511,
					sourceHardlinks: "reject"
				});
			} catch (error) {
				if (error instanceof FsSafeError && (error.code === "symlink" || error.code === "path-alias")) throw new Error(`archive entry traverses symlink in destination: ${relativePath}`, { cause: error });
				throw error;
			}
		}
	};
	await publishDirectory("");
}
function downloadFailure(message, details = {}) {
	return {
		ok: false,
		message,
		stdout: "",
		stderr: details.stderr ?? message,
		code: details.code ?? null
	};
}
async function installDownloadSpec(params) {
	const { skillKey, spec, timeoutMs } = params;
	const root$1 = resolveSkillToolsRootDir(skillKey);
	const url = spec.url?.trim();
	if (!url) return downloadFailure("missing download url", { stderr: "" });
	let filename;
	try {
		const parsed = new URL(url);
		filename = path.basename(parsed.pathname);
	} catch {
		filename = path.basename(url);
	}
	if (!filename) filename = "download";
	let canonicalRoot;
	let targetDir;
	let pinnedRoot;
	try {
		await ensureDir(root$1);
		await assertCanonicalPathWithinBase({
			baseDir: root$1,
			candidatePath: root$1,
			boundaryLabel: "skill tools directory"
		});
		canonicalRoot = await fs.promises.realpath(root$1);
		pinnedRoot = await root(canonicalRoot);
		const requestedTargetDir = resolveDownloadTargetDir(skillKey, spec);
		const targetRelativePath = path.relative(root$1, requestedTargetDir);
		targetDir = path.join(canonicalRoot, targetRelativePath);
	} catch (err) {
		return downloadFailure(formatErrorMessage(err));
	}
	const archivePath = path.join(targetDir, filename);
	const archiveRelativePath = path.relative(canonicalRoot, archivePath);
	if (!archiveRelativePath || archiveRelativePath === ".." || archiveRelativePath.startsWith(`..${path.sep}`) || path.isAbsolute(archiveRelativePath)) return downloadFailure("invalid download archive path");
	return await withTempDownloadPath({ prefix: "skill-download" }, async (tempArchivePath) => {
		let downloaded;
		let archiveFileName;
		try {
			const result = await downloadFile({
				url,
				relativePath: archiveRelativePath,
				pinnedRoot,
				tempPath: tempArchivePath,
				sha256: spec.sha256,
				timeoutMs
			});
			downloaded = result.bytes;
			archiveFileName = result.archiveFileName;
		} catch (err) {
			return downloadFailure(formatErrorMessage(err));
		}
		const archiveType = resolveArchiveType(spec, filename, archiveFileName);
		if (!(spec.extract ?? Boolean(archiveType))) return {
			ok: true,
			message: `Downloaded to ${archivePath}`,
			stdout: `downloaded=${downloaded}`,
			stderr: "",
			code: 0
		};
		if (!archiveType) return downloadFailure("extract requested but archive type could not be detected", { stderr: "" });
		const stagingDir = path.join(path.dirname(tempArchivePath), "extracted");
		try {
			await fs.promises.mkdir(stagingDir, { mode: 448 });
			const { extractSkillDownloadArchive } = await import("./install-extract-D9ibQlAw.mjs");
			const extractResult = await extractSkillDownloadArchive({
				archivePath: tempArchivePath,
				archiveType,
				targetDir: stagingDir,
				stripComponents: spec.stripComponents,
				timeoutMs
			});
			if (extractResult.code === 0) await publishExtractedTree({
				sourceDir: stagingDir,
				targetRelativePath: path.relative(canonicalRoot, targetDir),
				pinnedRoot
			});
			const success = extractResult.code === 0;
			return {
				ok: success,
				message: success ? `Downloaded and extracted to ${targetDir}` : formatInstallFailureMessage(extractResult),
				stdout: extractResult.stdout.trim(),
				stderr: extractResult.stderr.trim(),
				code: extractResult.code
			};
		} catch (err) {
			return downloadFailure(formatErrorMessage(err), { code: 1 });
		}
	});
}
//#endregion
//#region src/skills/lifecycle/install-policy-source.ts
/** Gateway hooks inspect a local source tree, never a path supplied by the workspace host. */
async function withSkillInstallPolicySource(skill, access, inspect) {
	if (!access || resolveSkillFileHost(skill) === "gateway") return await inspect(path.resolve(skill.baseDir));
	if (!access.skillResources) throw new WorkspaceAccessUnavailableError("Remote skill policy source is unavailable");
	const files = await access.skillResources.readSkillFiles(skill, { allowMissingRoot: false });
	if (!files) throw new WorkspaceAccessUnavailableError("Remote skill policy source disappeared");
	const bundle = prepareSkillBundle(files);
	const source = await materializeSkillResources({
		version: 1,
		skills: [{
			name: skill.name,
			description: skill.description,
			revision: bundle.revision,
			files
		}]
	}, () => {});
	try {
		return await inspect(source.snapshot.resolvedSkills[0].baseDir);
	} finally {
		await source.cleanup();
	}
}
function normalizeSkillInstallSpec(spec) {
	return {
		...spec.id ? { id: spec.id } : {},
		kind: spec.kind,
		...spec.label ? { label: spec.label } : {},
		...spec.bins ? { bins: spec.bins.slice() } : {},
		...spec.os ? { os: spec.os.slice() } : {},
		...spec.formula ? { formula: spec.formula } : {},
		...spec.package ? { package: spec.package } : {},
		...spec.module ? { module: spec.module } : {},
		...spec.url ? { url: spec.url } : {},
		...spec.sha256 ? { sha256: spec.sha256 } : {},
		...spec.archive ? { archive: spec.archive } : {},
		...spec.extract !== void 0 ? { extract: spec.extract } : {},
		...spec.stripComponents !== void 0 ? { stripComponents: spec.stripComponents } : {},
		...spec.targetDir ? { targetDir: spec.targetDir } : {}
	};
}
function findInstallSpec(entry, installId) {
	return entry.metadata?.install?.find((spec, index) => (spec.id ?? `${spec.kind}-${index}`).trim() === installId);
}
//#endregion
//#region src/skills/lifecycle/install.ts
function withWarnings(result, warnings) {
	if (warnings.length === 0) return result;
	return {
		...result,
		warnings: warnings.slice()
	};
}
const DEFAULT_NODE_INSTALL_COMMAND = [
	"npm",
	"install",
	"-g",
	"--ignore-scripts"
];
const NODE_INSTALL_COMMANDS = /* @__PURE__ */ new Map([
	["pnpm", [
		"pnpm",
		"add",
		"-g",
		"--ignore-scripts"
	]],
	["yarn", [
		"yarn",
		"global",
		"add",
		"--ignore-scripts"
	]],
	["bun", [
		"bun",
		"add",
		"-g",
		"--ignore-scripts"
	]]
]);
const SAFE_BREW_FORMULA = /^[a-z0-9][a-z0-9+._@-]*(\/[a-z0-9][a-z0-9+._@-]*){0,2}$/;
const SAFE_NODE_PACKAGE = /^(@[a-z0-9._-]+\/)?[a-z0-9._-]+(@[a-z0-9^~>=<.*|-]+)?$/;
const SAFE_GO_MODULE = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*@[a-z0-9v._-]+$/;
const SAFE_UV_PACKAGE = /^[a-z0-9][a-z0-9._-]*(\[[a-z0-9,._-]+\])?(([><=!~]=?|===?)[a-z0-9.*_-]+)?$/i;
function buildValidatedInstallCommand(value, kind, pattern, command) {
	if (!value) return { error: `missing ${kind}` };
	const trimmed = value.trim();
	if (!trimmed || trimmed.startsWith("-")) return { error: `${kind} value is empty or starts with a dash` };
	if (!pattern.test(trimmed)) return { error: `${kind} value contains invalid characters: ${trimmed}` };
	return { argv: [...command, trimmed] };
}
function buildInstallCommand(spec, prefs) {
	switch (spec.kind) {
		case "brew": return buildValidatedInstallCommand(spec.formula, "brew formula", SAFE_BREW_FORMULA, ["brew", "install"]);
		case "node": return buildValidatedInstallCommand(spec.package, "node package", SAFE_NODE_PACKAGE, NODE_INSTALL_COMMANDS.get(prefs.nodeManager) ?? DEFAULT_NODE_INSTALL_COMMAND);
		case "go": return buildValidatedInstallCommand(spec.module, "go module", SAFE_GO_MODULE, ["go", "install"]);
		case "uv": return buildValidatedInstallCommand(spec.package, "uv package", SAFE_UV_PACKAGE, [
			"uv",
			"tool",
			"install"
		]);
		default: return { error: "unsupported installer" };
	}
}
async function resolveBrewBinDir(timeoutMs, brewExe, fallbackDirs = ["/opt/homebrew/bin", "/usr/local/bin"]) {
	const prefixResult = await runCommandSafely([brewExe, "--prefix"], { timeoutMs: Math.min(timeoutMs, 3e4) });
	if (prefixResult.code === 0) {
		const prefix = prefixResult.stdout.trim();
		if (prefix) return path.join(prefix, "bin");
	}
	for (const candidate of fallbackDirs) if (fs.existsSync(candidate)) return candidate;
}
function createInstallFailure(params) {
	return {
		ok: false,
		message: params.message,
		stdout: params.stdout?.trim() ?? "",
		stderr: params.stderr?.trim() ?? "",
		code: params.code ?? null,
		...params.skipReason ? { skipReason: params.skipReason } : {}
	};
}
async function runCommandSafely(argv, optionsOrTimeout) {
	try {
		return await runCommandWithTimeout(argv, optionsOrTimeout);
	} catch (err) {
		return {
			code: null,
			stdout: "",
			stderr: formatErrorMessage(err)
		};
	}
}
function resolveBrewMissingFailure(spec) {
	if (process.platform === "freebsd") return createInstallFailure({ message: "brew not installed — Homebrew is not supported on FreeBSD. Install the required binaries on the Gateway host using pkg or Ports, then run `openclaw skills check` (use `--agent <id>` for a specific agent) to verify readiness." });
	const formula = spec.formula ?? "this package";
	if (process.platform === "linux" && isContainerEnvironment()) return createInstallFailure({ message: `brew not installed — Homebrew is not installed in this Linux container. Build a custom image with Homebrew or install "${formula}" manually using a supported system package before enabling this skill.` });
	return createInstallFailure({ message: `brew not installed — ${process.platform === "linux" ? `Homebrew is not installed. Install it from https://brew.sh or install "${formula}" manually using your system package manager (e.g. apt, dnf, pacman).` : "Homebrew is not installed. Install it from https://brew.sh"}` });
}
const MIN_AUTO_GO_MAJOR = 1;
const MIN_AUTO_GO_MINOR = 21;
const MIN_AUTO_GO_VERSION = `${MIN_AUTO_GO_MAJOR}.${MIN_AUTO_GO_MINOR}`;
const APT_GO_PACKAGE = "golang-go";
const APT_GO_POLICY_ARGV = [
	"apt-cache",
	"policy",
	APT_GO_PACKAGE
];
const APT_GO_UPDATE_ARGV = [
	"apt-get",
	"update",
	"-qq"
];
const APT_GO_INSTALL_ARGV = [
	"apt-get",
	"install",
	"-y",
	APT_GO_PACKAGE
];
const SUDO_NONINTERACTIVE_PREFIX = ["sudo", "-n"];
const SUDO_APT_GO_CHECK_ARGVS = [[
	"sudo",
	"-k",
	"-n",
	"-ll",
	...APT_GO_UPDATE_ARGV
], [
	"sudo",
	"-k",
	"-n",
	"-ll",
	...APT_GO_INSTALL_ARGV
]];
const GO_VERSION_ENV_ARGV = [
	"go",
	"env",
	"GOVERSION"
];
function isSupportedGoVersion(version) {
	return version.major > MIN_AUTO_GO_MAJOR || version.major === MIN_AUTO_GO_MAJOR && version.minor >= MIN_AUTO_GO_MINOR;
}
function appendPathDirectory(pathEnv, directory) {
	if ((pathEnv ?? "").split(path.delimiter).includes(directory)) return pathEnv ?? directory;
	return pathEnv ? `${pathEnv}${path.delimiter}${directory}` : directory;
}
function sudoListAllowsPasswordlessCommand(output) {
	const optionsLine = output.split(/\r?\n/).find((line) => /^\s*Options:\s*/.test(line));
	if (!optionsLine) return false;
	return optionsLine.slice(optionsLine.indexOf(":") + 1).split(",").some((option) => option.trim() === "!authenticate");
}
async function resolveAptCommandAccess() {
	if (typeof process.getuid === "function" && process.getuid() === 0) return {
		available: true,
		prefix: []
	};
	if (!hasBinary("sudo")) return {
		available: false,
		reason: "sudo-missing"
	};
	for (const argv of SUDO_APT_GO_CHECK_ARGVS) {
		const sudoCheck = await runCommandSafely(argv, {
			timeoutMs: 5e3,
			env: { LC_ALL: "C" }
		});
		if (sudoCheck.code !== 0) return {
			available: false,
			reason: "sudo-unusable",
			failure: sudoCheck
		};
		if (!sudoListAllowsPasswordlessCommand(sudoCheck.stdout)) return {
			available: false,
			reason: "sudo-unusable",
			failure: {
				code: 1,
				stdout: sudoCheck.stdout,
				stderr: sudoCheck.stderr || "sudo rule requires authentication"
			}
		};
	}
	return {
		available: true,
		prefix: SUDO_NONINTERACTIVE_PREFIX
	};
}
async function installGoViaApt(timeoutMs) {
	const aptFailureMessage = "go not installed — automatic install via apt failed. Install manually: https://go.dev/doc/install";
	const access = await resolveAptCommandAccess();
	if (!access.available && access.reason === "sudo-missing") return createInstallFailure({ message: "go not installed — apt-get is available but sudo is not installed. Install manually: https://go.dev/doc/install" });
	if (!access.available) return createInstallFailure({
		message: "go not installed — apt-get is available but sudo is not usable (missing or requires a password). Install manually: https://go.dev/doc/install",
		...access.failure
	});
	const update = await runCommandSafely([...access.prefix, ...APT_GO_UPDATE_ARGV], { timeoutMs });
	const policy = await runCommandSafely(APT_GO_POLICY_ARGV, {
		timeoutMs: Math.min(timeoutMs, 1e4),
		env: { LC_ALL: "C" }
	});
	if (policy.code !== 0) return createInstallFailure({
		message: aptFailureMessage,
		...policy
	});
	const candidate = parseGoVersion(/Candidate:\s*(?:\d+:)?(\d+)\.(\d+)/.exec(policy.stdout));
	if (!candidate && update.code !== 0) return createInstallFailure({
		message: aptFailureMessage,
		...update
	});
	if (!candidate || !isSupportedGoVersion(candidate)) return createInstallFailure({
		message: `go not installed — apt does not provide a usable Go ${MIN_AUTO_GO_VERSION}+ package. Install manually: https://go.dev/doc/install`,
		skipReason: "go"
	});
	const aptResult = await runCommandSafely([...access.prefix, ...APT_GO_INSTALL_ARGV], { timeoutMs });
	if (aptResult.code === 0) return;
	return createInstallFailure({
		message: aptFailureMessage,
		...aptResult
	});
}
function parseGoVersion(match) {
	if (!match) return;
	return {
		major: Number(match[1]),
		minor: Number(match[2])
	};
}
async function isGoUsableForAutoInstall() {
	const versionResult = await runCommandSafely(GO_VERSION_ENV_ARGV, {
		timeoutMs: 5e3,
		env: { GOTOOLCHAIN: "local" }
	});
	if (versionResult.code !== 0) return false;
	const version = parseGoVersion(/\bgo(\d+)\.(\d+)(?:[.\w-]*)?\b/.exec(versionResult.stdout));
	return version !== void 0 && isSupportedGoVersion(version);
}
function isGoToolchainPrerequisiteFailure(result) {
	const output = `${result.message}\n${result.stdout}\n${result.stderr}`;
	return /requires go >= \S+ \(running go \S+(?:; GOTOOLCHAIN=[^)]+)?\)/i.test(output) || /invalid GOTOOLCHAIN/i.test(output) || /cannot find "go[^"]+" in PATH/i.test(output);
}
/**
* Preflight twin of installSkillDependencies' prerequisite fallbacks. Says whether
* a recipe can run without manual setup so callers can skip doomed installs.
*
* uv bootstraps count only on-PATH brew because the recipe still spawns bare `uv`.
* Go installs can use a resolved brew prefix because installSkill carries that bin
* into the child and current PATH. Brew recipes swap argv[0] to the resolved path.
*/
async function resolveInstallerKindReadiness(kind) {
	const brewOnPath = hasBinary("brew");
	const brewExe = brewOnPath ? "brew" : resolveBrewExecutable();
	switch (kind) {
		case "brew": return brewExe ? { ready: true } : {
			ready: false,
			reason: "brew"
		};
		case "uv":
			if (hasBinary("uv")) return { ready: true };
			return brewOnPath ? { ready: true } : {
				ready: false,
				reason: "uv"
			};
		case "go": {
			let ready;
			if (hasBinary("go")) ready = await isGoUsableForAutoInstall();
			else if (brewOnPath) ready = true;
			else if (brewExe) ready = Boolean(await resolveBrewBinDir(1e4, brewExe, []));
			else ready = hasBinary("apt-get") && (await resolveAptCommandAccess()).available;
			return ready ? { ready: true } : {
				ready: false,
				reason: "go"
			};
		}
		default: return { ready: true };
	}
}
async function installSkill(params) {
	const timeoutMs = Math.min(Math.max(params.timeoutMs ?? 3e5, 1e3), 9e5);
	const workspaceDir = resolveUserPath(params.workspaceDir);
	const entry = (await prepareWorkspaceSkills(workspaceDir, {
		config: params.config,
		agentId: params.agentId,
		agentSkillFilter: "ignore"
	})).find((item) => item.skill.name === params.skillName);
	if (!entry) return createInstallFailure({ message: `Skill not found: ${params.skillName}` });
	const spec = findInstallSpec(entry, params.installId);
	const warnings = [];
	const skillSource = resolveSkillSource(entry.skill);
	const normalizedSpec = spec ? normalizeSkillInstallSpec(spec) : void 0;
	const workspaceAccess = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
	if (access && !access.installSkillDependencies) throw new WorkspaceAccessUnavailableError("Remote skill dependency installation is unavailable");
	const scanResult = await withSkillInstallPolicySource(entry.skill, access, (sourceDir) => evaluateSkillInstallPolicy({
		config: params.config,
		installId: params.installId,
		...normalizedSpec ? { installSpec: normalizedSpec } : {},
		logger: { warn: (message) => warnings.push(message) },
		origin: {
			type: skillSource,
			skillName: params.skillName,
			installId: params.installId
		},
		source: skillSource === "openclaw-bundled" ? {
			kind: "bundled",
			authority: "openclaw",
			mutable: false,
			network: false
		} : skillSource === "openclaw-managed" || skillSource === "openclaw-extra" ? {
			kind: "managed",
			authority: "openclaw",
			mutable: false,
			network: false
		} : {
			kind: "workspace",
			authority: "user",
			mutable: true,
			network: false
		},
		requestedSpecifier: `${params.skillName}:${params.installId}`,
		skillName: params.skillName,
		sourceDir
	}));
	if (scanResult?.blocked) return withWarnings(createInstallFailure({ message: scanResult.blocked.reason }), warnings);
	if (!(/* @__PURE__ */ new Set([
		"openclaw-bundled",
		"openclaw-managed",
		"openclaw-extra"
	])).has(skillSource)) warnings.push(`WARNING: Skill "${params.skillName}" install triggered from non-bundled source "${skillSource}". Verify the install recipe is trusted.`);
	if (!spec) return withWarnings(createInstallFailure({ message: `Installer not found: ${params.installId}` }), warnings);
	const request = {
		skillKey: resolveSkillKey(entry),
		spec,
		preferences: resolveSkillsInstallPreferences(params.config),
		timeoutMs
	};
	const result = access ? await access.installSkillDependencies(request) : await installSkillDependencies(request);
	if (result.ok) try {
		const { refreshSkillsDiscovery } = await import("./refresh-C3a1Ipyv.mjs");
		await refreshSkillsDiscovery({
			workspaceDir,
			config: params.config
		});
	} catch (error) {
		warnings.push(`Dependencies installed, but discovery refresh failed: ${formatErrorMessage(error)}`);
	}
	return withWarnings(result, warnings);
}
/** Runs only the approved recipe on the host that owns the Harness tools directory. */
async function installSkillDependencies(params) {
	const { skillKey, spec, preferences: prefs } = params;
	const timeoutMs = Math.min(Math.max(params.timeoutMs, 1e3), 9e5);
	if (spec.kind === "download") return installDownloadSpec({
		skillKey,
		spec,
		timeoutMs
	});
	const command = buildInstallCommand(spec, prefs);
	if ("error" in command) return createInstallFailure({ message: command.error });
	const brewExe = hasBinary("brew") ? "brew" : resolveBrewExecutable();
	if (spec.kind === "brew" && !brewExe) return resolveBrewMissingFailure(spec);
	const goWasAlreadyInstalled = spec.kind === "go" && hasBinary("go");
	if (spec.kind === "uv" && !hasBinary("uv") || spec.kind === "go" && !goWasAlreadyInstalled) {
		if (brewExe) {
			const result = await runCommandSafely([
				brewExe,
				"install",
				spec.kind
			], { timeoutMs });
			if (result.code !== 0) return createInstallFailure({
				message: `Failed to install ${spec.kind} (brew)`,
				...result
			});
		} else if (spec.kind === "go" && hasBinary("apt-get")) {
			const failure = await installGoViaApt(timeoutMs);
			if (failure) return failure;
		} else return createInstallFailure({ message: spec.kind === "uv" ? "uv not installed — install manually: https://docs.astral.sh/uv/getting-started/installation/" : "go not installed — install manually: https://go.dev/doc/install" });
	}
	const { argv } = command;
	if (spec.kind === "brew" && brewExe && argv[0] === "brew") argv[0] = brewExe;
	const envOverrides = {};
	let installedGoBin;
	if (spec.kind === "node" && prefs.nodeManager === "npm") {
		const stateDir = process.platform !== "win32" && process.getuid?.() === 0 ? path.join(path.parse(process.cwd()).root, "var", "lib", "openclaw") : path.join(os.homedir(), ".openclaw");
		const prefix = path.join(stateDir, "tools", "node", "npm");
		await fs.promises.mkdir(prefix, {
			recursive: true,
			mode: 448
		});
		envOverrides.NPM_CONFIG_PREFIX = prefix;
		envOverrides.npm_config_prefix = prefix;
	}
	if (spec.kind === "go") {
		installedGoBin = (brewExe && !goWasAlreadyInstalled ? await resolveBrewBinDir(timeoutMs, brewExe) : void 0) ?? path.join(os.homedir(), ".local", "bin");
		envOverrides.GOBIN = installedGoBin;
		envOverrides.PATH = appendPathDirectory(process.env.PATH, installedGoBin);
	}
	const result = await runCommandSafely(argv, {
		timeoutMs,
		env: Object.keys(envOverrides).length > 0 ? envOverrides : void 0
	});
	if (result.code === 0) {
		if (installedGoBin && envOverrides.PATH) process.env.PATH = envOverrides.PATH;
		return {
			ok: true,
			message: "Installed",
			stdout: result.stdout.trim(),
			stderr: result.stderr.trim(),
			code: result.code
		};
	}
	const installResult = createInstallFailure({
		message: formatInstallFailureMessage(result),
		...result
	});
	return spec.kind === "go" && isGoToolchainPrerequisiteFailure(installResult) ? {
		...installResult,
		skipReason: "go"
	} : installResult;
}
//#endregion
export { resolveInstallerKindReadiness as i, installSkill as n, installSkillDependencies as r, MIN_AUTO_GO_VERSION as t };
