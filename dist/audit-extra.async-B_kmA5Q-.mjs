import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { i as createLazyRuntimeNamedExport, r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { T as statRegularFile, g as readRegularFile } from "./fs-safe-BAPek8At.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import { d as extensionUsesSkippedScannerPath } from "./includes-CaaCq-XN.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { C as resolveOAuthDir } from "./paths-DehQwyE0.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import { p as resolveAuthProfileDatabaseFilePaths } from "./sqlite-BIg_k8qE.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-Bd-leLaO.mjs";
import { r as loadWorkspaceSkills } from "./workspace-skill-loader-CHLLbFK6.mjs";
import { c as loadSkillRootRecords } from "./plugin-skills-CnAdRDnb.mjs";
import { t as collectIncludePathsRecursive } from "./includes-scan-CbcNtXjC.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/security/installed-plugin-dirs.ts
const IGNORED_INSTALLED_PLUGIN_DIR_NAMES = /* @__PURE__ */ new Set(["node_modules", ".openclaw-install-backups"]);
/**
* Decide whether an installed-plugin directory should be skipped by security audits.
* This filters generated install debris while keeping real plugin roots visible to scans.
*/
function shouldIgnoreInstalledPluginDirName(name) {
	const normalized = normalizeOptionalLowercaseString(name);
	if (!normalized) return true;
	if (IGNORED_INSTALLED_PLUGIN_DIR_NAMES.has(normalized)) return true;
	if (normalized.startsWith(".")) return true;
	if (normalized.endsWith(".bak")) return true;
	if (normalized.includes(".backup-")) return true;
	if (normalized.includes(".disabled")) return true;
	return false;
}
/**
* Lists installed plugin directories under the state extensions dir. Read
* failures surface through `onReadError` so audits can report scan problems,
* except a missing extensions dir, which is the normal no-plugins state.
*/
async function listInstalledPluginDirs(params) {
	const extensionsDir = path.join(params.stateDir, "extensions");
	if (!(await fs.stat(extensionsDir).catch((err) => {
		const code = err?.code;
		if (code !== "ENOENT" && code !== "ENOTDIR") params.onReadError?.(err);
		return null;
	}))?.isDirectory()) return {
		extensionsDir,
		pluginDirs: []
	};
	return {
		extensionsDir,
		pluginDirs: (await fs.readdir(extensionsDir, { withFileTypes: true }).catch((err) => {
			params.onReadError?.(err);
			return [];
		})).filter((entry) => entry.isDirectory()).map((entry) => entry.name).filter((name) => !shouldIgnoreInstalledPluginDirName(name)).filter(Boolean)
	};
}
//#endregion
//#region src/security/audit-extra.async.ts
/**
* Asynchronous security audit collector functions.
*
* These functions perform I/O (filesystem, config reads) to detect security issues.
*/
const DEFAULT_SANDBOX_BROWSER_DOCKER_PROBE_TIMEOUT_MS = 5e3;
const loadConfigModule = createLazyRuntimeModule(() => import("./config/config.js"));
const loadAuditFsModule = createLazyRuntimeModule(() => import("./audit-fs-DsqYBoTv.mjs"));
const loadAgentScopeModule = createLazyRuntimeModule(() => import("./agent-scope-C4CYkKyC.mjs"));
const loadAgentWorkspaceDirsModule = createLazyRuntimeModule(() => import("./workspace-dirs-CKcLSUS2.mjs"));
const loadSkillSourceModule = createLazyRuntimeModule(() => import("./source-CYBFwLQw.mjs"));
const loadSkillScannerModule = createLazyRuntimeModule(() => import("./scanner-DYRQM2Hs.mjs"));
const loadExecDockerRaw = createLazyRuntimeNamedExport(() => import("./docker-CIeFx_Te.mjs"), "execDockerRaw");
const loadSandboxBrowserSecurityHashEpoch = createLazyRuntimeNamedExport(() => import("./constants-CMe90DG3.mjs"), "SANDBOX_BROWSER_SECURITY_HASH_EPOCH");
function expandTilde(p, env) {
	if (!p.startsWith("~")) return p;
	const home = normalizeOptionalString(env.HOME) ?? null;
	if (!home) return null;
	if (p === "~") return home;
	if (p.startsWith("~/") || p.startsWith("~\\")) return path.join(home, p.slice(2));
	return null;
}
const MAX_PLUGIN_MANIFEST_BYTES = 1048576;
const MAX_SKILL_AUDIT_FILE_BYTES = 256e3;
async function readPluginManifestExtensions(pluginPath) {
	const manifestPath = path.join(pluginPath, "package.json");
	const statResult = await statRegularFile(manifestPath);
	if (statResult.missing) return [];
	if (statResult.stat.size > MAX_PLUGIN_MANIFEST_BYTES) throw new Error(`Plugin manifest at ${manifestPath} is too large (${statResult.stat.size} bytes, max ${MAX_PLUGIN_MANIFEST_BYTES})`);
	const { buffer } = await readRegularFile({
		filePath: manifestPath,
		maxBytes: MAX_PLUGIN_MANIFEST_BYTES
	});
	const raw = buffer.toString("utf-8");
	if (!raw.trim()) return [];
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error(`Failed to parse plugin manifest at ${manifestPath}: ${String(err)}`, { cause: err });
	}
	const extensions = parsed?.[MANIFEST_KEY]?.extensions;
	if (!Array.isArray(extensions)) return [];
	return normalizeTrimmedStringList(extensions);
}
function formatCodeSafetyDetails(findings, rootDir) {
	return findings.map((finding) => {
		const relPath = path.relative(rootDir, finding.file);
		const normalizedPath = (relPath && relPath !== "." && !relPath.startsWith("..") ? relPath : path.basename(finding.file)).replaceAll("\\", "/");
		return `  - [${finding.ruleId}] ${finding.message} (${normalizedPath}:${finding.line})`;
	}).join("\n");
}
function buildCodeSafetySummaryCacheKey(params) {
	const includeFiles = normalizeStringEntries(params.includeFiles);
	const includeKey = includeFiles.length > 0 ? includeFiles.toSorted().join("\0") : "";
	return `${params.dirPath}\u0000${includeKey}`;
}
async function getCodeSafetySummary(params) {
	const cacheKey = buildCodeSafetySummaryCacheKey({
		dirPath: params.dirPath,
		includeFiles: params.includeFiles
	});
	const scan = async () => {
		return await (await loadSkillScannerModule()).scanDirectoryWithSummary(params.dirPath, { includeFiles: params.includeFiles });
	};
	return params.summaryCache ? await getOrCreatePromise(params.summaryCache, cacheKey, scan) : await scan();
}
async function getSkillCodeSafetySummary(params) {
	const [summary, skillContent, skillScanner] = await Promise.all([
		getCodeSafetySummary({
			dirPath: params.dirPath,
			summaryCache: params.summaryCache
		}),
		readRegularFile({
			filePath: params.skillFilePath,
			maxBytes: MAX_SKILL_AUDIT_FILE_BYTES
		}).then(({ buffer }) => buffer.toString("utf-8")),
		loadSkillScannerModule()
	]);
	const skillFindings = [...skillScanner.scanSkillContent(skillContent, params.skillFilePath), ...skillScanner.scanSource(skillContent, params.skillFilePath)];
	return {
		...summary,
		scannedFiles: summary.scannedFiles + 1,
		critical: summary.critical + skillFindings.filter((finding) => finding.severity === "critical").length,
		warn: summary.warn + skillFindings.filter((finding) => finding.severity === "warn").length,
		info: summary.info + skillFindings.filter((finding) => finding.severity === "info").length,
		findings: [...summary.findings, ...skillFindings]
	};
}
function normalizeDockerLabelValue(raw) {
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed || trimmed === "<no value>") return null;
	return trimmed;
}
var DockerProbeTimeoutError = class extends Error {
	constructor(timeoutMs) {
		super(`Docker probe timed out after ${timeoutMs}ms`);
		this.name = "DockerProbeTimeoutError";
	}
};
function normalizeDockerProbeTimeoutMs(timeoutMs) {
	if (Number.isFinite(timeoutMs) && timeoutMs !== void 0) return Math.max(250, Math.floor(timeoutMs));
	return DEFAULT_SANDBOX_BROWSER_DOCKER_PROBE_TIMEOUT_MS;
}
async function withDockerProbeTimeout(timeoutMs, run) {
	const controller = new AbortController();
	let timeout;
	let timedOut = false;
	const timeoutPromise = new Promise((_, reject) => {
		timeout = setTimeout(() => {
			timedOut = true;
			controller.abort();
			reject(new DockerProbeTimeoutError(timeoutMs));
		}, timeoutMs);
	});
	try {
		return await Promise.race([run(controller.signal), timeoutPromise]);
	} catch (err) {
		if (timedOut || controller.signal.aborted) throw new DockerProbeTimeoutError(timeoutMs);
		throw err;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function isDockerProbeTimeoutError(error) {
	return error instanceof DockerProbeTimeoutError;
}
async function listSandboxBrowserContainers(params) {
	try {
		const result = await withDockerProbeTimeout(params.timeoutMs, (signal) => params.execDockerRawFn([
			"ps",
			"-a",
			"--filter",
			"label=openclaw.sandboxBrowser=1",
			"--format",
			"{{.Names}}"
		], {
			allowFailure: true,
			signal
		}));
		if (result.code !== 0) return null;
		return normalizeStringEntries(result.stdout.toString("utf8").split(/\r?\n/));
	} catch (err) {
		if (isDockerProbeTimeoutError(err)) params.onTimeout?.();
		return null;
	}
}
async function readSandboxBrowserHashLabels(params) {
	try {
		const result = await withDockerProbeTimeout(params.timeoutMs, (signal) => params.execDockerRawFn([
			"inspect",
			"-f",
			"{{ index .Config.Labels \"openclaw.configHash\" }}	{{ index .Config.Labels \"openclaw.browserConfigEpoch\" }}",
			params.containerName
		], {
			allowFailure: true,
			signal
		}));
		if (result.code !== 0) return null;
		const [hashRaw, epochRaw] = result.stdout.toString("utf8").split("	");
		return {
			configHash: normalizeDockerLabelValue(hashRaw),
			epoch: normalizeDockerLabelValue(epochRaw)
		};
	} catch (err) {
		if (isDockerProbeTimeoutError(err)) params.onTimeout?.();
		return null;
	}
}
function parsePublishedHostFromDockerPortLine(line) {
	const trimmed = normalizeOptionalString(line) ?? "";
	const rhs = trimmed.includes("->") ? normalizeOptionalString(trimmed.split("->").at(-1)) ?? "" : trimmed;
	if (!rhs) return null;
	const bracketHost = rhs.match(/^\[([^\]]+)\]:\d+$/);
	if (bracketHost?.[1]) return bracketHost[1];
	const hostPort = rhs.match(/^([^:]+):\d+$/);
	if (hostPort?.[1]) return hostPort[1];
	return null;
}
function isLoopbackPublishHost(host) {
	const normalized = normalizeOptionalLowercaseString(host);
	return normalized === "127.0.0.1" || normalized === "::1" || normalized === "localhost";
}
async function readSandboxBrowserPortMappings(params) {
	try {
		const result = await withDockerProbeTimeout(params.timeoutMs, (signal) => params.execDockerRawFn(["port", params.containerName], {
			allowFailure: true,
			signal
		}));
		if (result.code !== 0) return null;
		return normalizeStringEntries(result.stdout.toString("utf8").split(/\r?\n/));
	} catch (err) {
		if (isDockerProbeTimeoutError(err)) params.onTimeout?.();
		return null;
	}
}
async function collectSandboxBrowserHashLabelFindings(params) {
	const findings = [];
	const timeoutMs = normalizeDockerProbeTimeoutMs(params?.timeoutMs);
	let timedOut = false;
	const markTimedOut = () => {
		timedOut = true;
	};
	const [execFn, browserHashEpoch] = await Promise.all([params?.execDockerRawFn ? Promise.resolve(params.execDockerRawFn) : loadExecDockerRaw(), loadSandboxBrowserSecurityHashEpoch()]);
	const containers = await listSandboxBrowserContainers({
		execDockerRawFn: execFn,
		timeoutMs,
		onTimeout: markTimedOut
	});
	if (!containers || containers.length === 0) {
		if (timedOut) findings.push(buildSandboxBrowserDockerProbeTimeoutFinding(timeoutMs));
		return findings;
	}
	const missingHash = [];
	const staleEpoch = [];
	const nonLoopbackPublished = [];
	for (const containerName of containers) {
		const labels = await readSandboxBrowserHashLabels({
			containerName,
			execDockerRawFn: execFn,
			timeoutMs,
			onTimeout: markTimedOut
		});
		if (timedOut) break;
		if (!labels) continue;
		if (!labels.configHash) missingHash.push(containerName);
		if (labels.epoch !== browserHashEpoch) staleEpoch.push(containerName);
		const portMappings = await readSandboxBrowserPortMappings({
			containerName,
			execDockerRawFn: execFn,
			timeoutMs,
			onTimeout: markTimedOut
		});
		if (timedOut) break;
		if (!portMappings?.length) continue;
		const exposedMappings = portMappings.filter((line) => {
			const host = parsePublishedHostFromDockerPortLine(line);
			return Boolean(host && !isLoopbackPublishHost(host));
		});
		if (exposedMappings.length > 0) nonLoopbackPublished.push(`${containerName} (${exposedMappings.join("; ")})`);
	}
	if (missingHash.length > 0) findings.push({
		checkId: "sandbox.browser_container.hash_label_missing",
		severity: "warn",
		title: "Sandbox browser container missing config hash label",
		detail: `Containers: ${missingHash.join(", ")}. These browser containers predate hash-based drift checks and may miss security remediations until recreated.`,
		remediation: `${formatCliCommand("openclaw sandbox recreate --browser --all")} (add --force to skip prompt).`
	});
	if (staleEpoch.length > 0) findings.push({
		checkId: "sandbox.browser_container.hash_epoch_stale",
		severity: "warn",
		title: "Sandbox browser container hash epoch is stale",
		detail: `Containers: ${staleEpoch.join(", ")}. Expected openclaw.browserConfigEpoch=${browserHashEpoch}.`,
		remediation: `${formatCliCommand("openclaw sandbox recreate --browser --all")} (add --force to skip prompt).`
	});
	if (nonLoopbackPublished.length > 0) findings.push({
		checkId: "sandbox.browser_container.non_loopback_publish",
		severity: "critical",
		title: "Sandbox browser container publishes ports on non-loopback interfaces",
		detail: `Containers: ${nonLoopbackPublished.join(", ")}. Sandbox browser observer/control ports should stay loopback-only to avoid unintended remote access.`,
		remediation: `${formatCliCommand("openclaw sandbox recreate --browser --all")} (add --force to skip prompt), then verify published ports are bound to 127.0.0.1.`
	});
	if (timedOut) findings.push(buildSandboxBrowserDockerProbeTimeoutFinding(timeoutMs));
	return findings;
}
function buildSandboxBrowserDockerProbeTimeoutFinding(timeoutMs) {
	return {
		checkId: "sandbox.browser_container.docker_probe_timeout",
		severity: "warn",
		title: "Sandbox browser Docker audit probe timed out",
		detail: `Docker did not answer within ${timeoutMs}ms while checking sandbox browser containers. OpenClaw skipped any remaining sandbox browser container drift checks for this status run.`,
		remediation: "Retry after Docker is responsive, or recreate sandbox browser containers if drift is suspected."
	};
}
async function collectIncludeFilePermFindings(params) {
	const findings = [];
	if (!params.configSnapshot.exists) return findings;
	const configPath = params.configSnapshot.path;
	const includePaths = await collectIncludePathsRecursive({
		configPath,
		parsed: params.configSnapshot.parsed,
		env: params.env
	});
	if (includePaths.length === 0) return findings;
	const { formatPermissionDetail, formatPermissionRemediation, inspectPathPermissions } = await loadAuditFsModule();
	for (const p of includePaths) {
		const perms = await inspectPathPermissions(p, {
			env: params.env,
			platform: params.platform,
			exec: params.execIcacls
		});
		if (!perms.ok) continue;
		if (perms.worldWritable || perms.groupWritable) findings.push({
			checkId: "fs.config_include.perms_writable",
			severity: "critical",
			title: "Config include file is writable by others",
			detail: `${formatPermissionDetail(p, perms)}; another user could influence your effective config.`,
			remediation: formatPermissionRemediation({
				targetPath: p,
				perms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
		else if (perms.worldReadable) findings.push({
			checkId: "fs.config_include.perms_world_readable",
			severity: "critical",
			title: "Config include file is world-readable",
			detail: `${formatPermissionDetail(p, perms)}; include files can contain tokens and private settings.`,
			remediation: formatPermissionRemediation({
				targetPath: p,
				perms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
		else if (perms.groupReadable) findings.push({
			checkId: "fs.config_include.perms_group_readable",
			severity: "warn",
			title: "Config include file is group-readable",
			detail: `${formatPermissionDetail(p, perms)}; include files can contain tokens and private settings.`,
			remediation: formatPermissionRemediation({
				targetPath: p,
				perms,
				isDir: false,
				posixMode: 384,
				env: params.env
			})
		});
	}
	return findings;
}
async function collectStateDeepFilesystemFindings(params) {
	const findings = [];
	const oauthDir = resolveOAuthDir(params.env, params.stateDir);
	const { formatPermissionDetail, formatPermissionRemediation, inspectPathPermissions } = await loadAuditFsModule();
	const oauthPerms = await inspectPathPermissions(oauthDir, {
		env: params.env,
		platform: params.platform,
		exec: params.execIcacls
	});
	if (oauthPerms.ok && oauthPerms.isDir) {
		if (oauthPerms.worldWritable || oauthPerms.groupWritable) findings.push({
			checkId: "fs.credentials_dir.perms_writable",
			severity: "critical",
			title: "Credentials dir is writable by others",
			detail: `${formatPermissionDetail(oauthDir, oauthPerms)}; another user could drop/modify credential files.`,
			remediation: formatPermissionRemediation({
				targetPath: oauthDir,
				perms: oauthPerms,
				isDir: true,
				posixMode: 448,
				env: params.env
			})
		});
		else if (oauthPerms.groupReadable || oauthPerms.worldReadable) findings.push({
			checkId: "fs.credentials_dir.perms_readable",
			severity: "warn",
			title: "Credentials dir is readable by others",
			detail: `${formatPermissionDetail(oauthDir, oauthPerms)}; credentials and allowlists can be sensitive.`,
			remediation: formatPermissionRemediation({
				targetPath: oauthDir,
				perms: oauthPerms,
				isDir: true,
				posixMode: 448,
				env: params.env
			})
		});
	}
	const agentScope = await loadAgentScopeModule();
	const agentIds = agentScope.listAgentEntries(params.cfg).map((agent) => agent.id);
	let defaultAgentId;
	if (agentIds.length > 0) try {
		defaultAgentId = agentScope.resolveDefaultAgentId(params.cfg);
	} catch {}
	const ids = uniqueStrings([
		LEGACY_IMPLICIT_AGENT_ID,
		...defaultAgentId ? [defaultAgentId] : [],
		...agentIds
	]).map((id) => normalizeAgentId(id));
	for (const agentId of ids) {
		const agentDir = path.join(params.stateDir, "agents", agentId, "agent");
		const authTargets = [{
			path: path.join(agentDir, "auth-profiles.json"),
			label: "legacy auth-profiles.json"
		}, ...resolveAuthProfileDatabaseFilePaths(agentDir).map((targetPath) => ({
			path: targetPath,
			label: "auth profile SQLite store"
		}))];
		for (const authTarget of authTargets) {
			const authPerms = await inspectPathPermissions(authTarget.path, {
				env: params.env,
				platform: params.platform,
				exec: params.execIcacls
			});
			if (authPerms.ok) {
				if (authPerms.worldWritable || authPerms.groupWritable) findings.push({
					checkId: "fs.auth_profiles.perms_writable",
					severity: "critical",
					title: `${authTarget.label} is writable by others`,
					detail: `${formatPermissionDetail(authTarget.path, authPerms)}; another user could inject credentials.`,
					remediation: formatPermissionRemediation({
						targetPath: authTarget.path,
						perms: authPerms,
						isDir: false,
						posixMode: 384,
						env: params.env
					})
				});
				else if (authPerms.worldReadable || authPerms.groupReadable) findings.push({
					checkId: "fs.auth_profiles.perms_readable",
					severity: "warn",
					title: `${authTarget.label} is readable by others`,
					detail: `${formatPermissionDetail(authTarget.path, authPerms)}; auth profile storage contains API keys and OAuth tokens.`,
					remediation: formatPermissionRemediation({
						targetPath: authTarget.path,
						perms: authPerms,
						isDir: false,
						posixMode: 384,
						env: params.env
					})
				});
			}
		}
		const storePath = path.join(params.stateDir, "agents", agentId, "sessions", "sessions.json");
		const storePerms = await inspectPathPermissions(storePath, {
			env: params.env,
			platform: params.platform,
			exec: params.execIcacls
		});
		if (storePerms.ok) {
			if (storePerms.worldReadable || storePerms.groupReadable) findings.push({
				checkId: "fs.sessions_store.perms_readable",
				severity: "warn",
				title: "sessions.json is readable by others",
				detail: `${formatPermissionDetail(storePath, storePerms)}; routing and transcript metadata can be sensitive.`,
				remediation: formatPermissionRemediation({
					targetPath: storePath,
					perms: storePerms,
					isDir: false,
					posixMode: 384,
					env: params.env
				})
			});
		}
	}
	const logFile = normalizeOptionalString(params.cfg.logging?.file) ?? "";
	if (logFile) {
		const expanded = logFile.startsWith("~") ? expandTilde(logFile, params.env) : logFile;
		if (expanded) {
			const logPath = path.resolve(expanded);
			const logPerms = await inspectPathPermissions(logPath, {
				env: params.env,
				platform: params.platform,
				exec: params.execIcacls
			});
			if (logPerms.ok) {
				if (logPerms.worldReadable || logPerms.groupReadable) findings.push({
					checkId: "fs.log_file.perms_readable",
					severity: "warn",
					title: "Log file is readable by others",
					detail: `${formatPermissionDetail(logPath, logPerms)}; logs can contain private messages and tool output.`,
					remediation: formatPermissionRemediation({
						targetPath: logPath,
						perms: logPerms,
						isDir: false,
						posixMode: 384,
						env: params.env
					})
				});
			}
		}
	}
	return findings;
}
async function readConfigSnapshotForAudit(params) {
	const { createConfigIO } = await loadConfigModule();
	return await createConfigIO({
		env: params.env,
		configPath: params.configPath
	}).readConfigFileSnapshot();
}
async function collectPluginsCodeSafetyFindings(params) {
	const findings = [];
	const { extensionsDir, pluginDirs } = await listInstalledPluginDirs({
		stateDir: params.stateDir,
		onReadError: (err) => {
			findings.push({
				checkId: "plugins.code_safety.scan_failed",
				severity: "warn",
				title: "Plugin extensions directory scan failed",
				detail: `Static code scan could not list extensions directory: ${String(err)}`,
				remediation: "Check file permissions and plugin layout, then rerun `openclaw security audit --deep`."
			});
		}
	});
	for (const pluginName of pluginDirs) {
		const pluginPath = path.join(extensionsDir, pluginName);
		let extensionEntries = [];
		try {
			extensionEntries = await readPluginManifestExtensions(pluginPath);
		} catch (manifestErr) {
			findings.push({
				checkId: "plugins.code_safety.manifest_parse_error",
				severity: "warn",
				title: `Plugin "${pluginName}" has a malformed package.json`,
				detail: `Could not parse plugin manifest: ${String(manifestErr)}.\nThe extension entrypoint list is unavailable. Deep scan will cover the plugin directory but may miss entries declared via \`openclaw.extensions\`.`,
				remediation: "Inspect the plugin package.json for syntax errors. If the plugin is untrusted, remove it from your OpenClaw extensions state directory."
			});
		}
		const forcedScanEntries = [];
		const escapedEntries = [];
		for (const entry of extensionEntries) {
			const resolvedEntry = path.resolve(pluginPath, entry);
			if (!isPathInside(pluginPath, resolvedEntry)) {
				escapedEntries.push(entry);
				continue;
			}
			if (extensionUsesSkippedScannerPath(entry)) findings.push({
				checkId: "plugins.code_safety.entry_path",
				severity: "warn",
				title: `Plugin "${pluginName}" entry path is hidden or node_modules`,
				detail: `Extension entry "${entry}" points to a hidden or node_modules path. Deep code scan will cover this entry explicitly, but review this path choice carefully.`,
				remediation: "Prefer extension entrypoints under normal source paths like dist/ or src/."
			});
			forcedScanEntries.push(resolvedEntry);
		}
		if (escapedEntries.length > 0) findings.push({
			checkId: "plugins.code_safety.entry_escape",
			severity: "critical",
			title: `Plugin "${pluginName}" has extension entry path traversal`,
			detail: `Found extension entries that escape the plugin directory:\n${escapedEntries.map((entry) => `  - ${entry}`).join("\n")}`,
			remediation: "Update the plugin manifest so all openclaw.extensions entries stay inside the plugin directory."
		});
		const summary = await getCodeSafetySummary({
			dirPath: pluginPath,
			includeFiles: forcedScanEntries,
			summaryCache: params.summaryCache
		}).catch((err) => {
			findings.push({
				checkId: "plugins.code_safety.scan_failed",
				severity: "warn",
				title: `Plugin "${pluginName}" code scan failed`,
				detail: `Static code scan could not complete: ${String(err)}`,
				remediation: "Check file permissions and plugin layout, then rerun `openclaw security audit --deep`."
			});
			return null;
		});
		if (!summary) continue;
		if (summary.critical > 0) {
			const details = formatCodeSafetyDetails(summary.findings.filter((f) => f.severity === "critical"), pluginPath);
			findings.push({
				checkId: "plugins.code_safety",
				severity: "critical",
				title: `Plugin "${pluginName}" contains dangerous code patterns`,
				detail: `Found ${summary.critical} critical issue(s) in ${summary.scannedFiles} scanned file(s):\n${details}`,
				remediation: "Review the plugin source code carefully before use. If untrusted, remove the plugin from your OpenClaw extensions state directory."
			});
		} else if (summary.warn > 0) {
			const details = formatCodeSafetyDetails(summary.findings.filter((f) => f.severity === "warn"), pluginPath);
			findings.push({
				checkId: "plugins.code_safety",
				severity: "warn",
				title: `Plugin "${pluginName}" contains suspicious code patterns`,
				detail: `Found ${summary.warn} warning(s) in ${summary.scannedFiles} scanned file(s):\n${details}`,
				remediation: `Review the flagged code to ensure it is intentional and safe.`
			});
		}
	}
	return findings;
}
async function collectInstalledSkillsCodeSafetyFindings(params) {
	const findings = [];
	const pluginExtensionsDir = path.join(params.stateDir, "extensions");
	const scannedSkillDirs = /* @__PURE__ */ new Set();
	const [{ listAgentWorkspaceDirs, listExplicitAgentWorkspaceDirs }, { resolveSkillSource }] = await Promise.all([loadAgentWorkspaceDirsModule(), loadSkillSourceModule()]);
	const workspaceDirs = new Set(params.workspaceDir ? [params.workspaceDir] : []);
	try {
		for (const workspaceDir of listAgentWorkspaceDirs(params.cfg)) workspaceDirs.add(workspaceDir);
	} catch {
		for (const workspaceDir of listExplicitAgentWorkspaceDirs(params.cfg)) workspaceDirs.add(workspaceDir);
	}
	const entries = [...workspaceDirs].flatMap((workspaceDir) => loadWorkspaceSkills(workspaceDir, { config: params.cfg }));
	const { listAgentIds } = await loadAgentScopeModule();
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	const reportWorkshopScanFailure = (filePath, error) => {
		findings.push({
			checkId: "skills.code_safety.scan_failed",
			severity: "warn",
			title: "Workshop skill inventory scan failed",
			detail: `Static code scan could not inspect ${filePath}: ${String(error)}`,
			remediation: "Check file permissions and skill layout, then rerun `openclaw security audit --deep`."
		});
	};
	for (const agentId of listAgentIds(params.cfg)) {
		const workshopDir = resolveWorkshopSkillsDir(params.cfg, agentId, env);
		entries.push(...loadSkillRootRecords({
			dir: workshopDir,
			source: "openclaw-workshop",
			config: params.cfg,
			mode: "audit",
			rejectHardlinks: true,
			onDiagnostic: ({ path: filePath, message }) => reportWorkshopScanFailure(filePath, message)
		}));
	}
	for (const entry of entries) {
		if (resolveSkillSource(entry.skill) === "openclaw-bundled") continue;
		const skillDir = path.resolve(entry.skill.baseDir);
		if (isPathInside(pluginExtensionsDir, skillDir)) continue;
		if (scannedSkillDirs.has(skillDir)) continue;
		scannedSkillDirs.add(skillDir);
		const skillName = entry.skill.name;
		const summary = await getSkillCodeSafetySummary({
			dirPath: skillDir,
			skillFilePath: entry.skill.filePath,
			summaryCache: params.summaryCache
		}).catch((err) => {
			findings.push({
				checkId: "skills.code_safety.scan_failed",
				severity: "warn",
				title: `Skill "${skillName}" code scan failed`,
				detail: `Static code scan could not complete for ${skillDir}: ${String(err)}`,
				remediation: "Check file permissions and skill layout, then rerun `openclaw security audit --deep`."
			});
			return null;
		});
		if (!summary) continue;
		if (summary.critical > 0) {
			const details = formatCodeSafetyDetails(summary.findings.filter((finding) => finding.severity === "critical"), skillDir);
			findings.push({
				checkId: "skills.code_safety",
				severity: "critical",
				title: `Skill "${skillName}" contains dangerous code patterns`,
				detail: `Found ${summary.critical} critical issue(s) in ${summary.scannedFiles} scanned file(s) under ${skillDir}:\n${details}`,
				remediation: `Review the skill source code before use. If untrusted, remove "${skillDir}".`
			});
		} else if (summary.warn > 0) {
			const details = formatCodeSafetyDetails(summary.findings.filter((finding) => finding.severity === "warn"), skillDir);
			findings.push({
				checkId: "skills.code_safety",
				severity: "warn",
				title: `Skill "${skillName}" contains suspicious code patterns`,
				detail: `Found ${summary.warn} warning(s) in ${summary.scannedFiles} scanned file(s) under ${skillDir}:\n${details}`,
				remediation: "Review flagged lines to ensure the behavior is intentional and safe."
			});
		}
	}
	return findings;
}
//#endregion
export { collectStateDeepFilesystemFindings as a, collectSandboxBrowserHashLabelFindings as i, collectInstalledSkillsCodeSafetyFindings as n, readConfigSnapshotForAudit as o, collectPluginsCodeSafetyFindings as r, listInstalledPluginDirs as s, collectIncludeFilePermFindings as t };
