import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { E as statRegularFile, g as readRegularFile } from "./fs-safe-BUXBSN-4.mjs";
import { f as extensionUsesSkippedScannerPath, p as isPathInside } from "./includes-BkzfmxST.mjs";
import { t as MANIFEST_KEY } from "./legacy-names-Cq8ruaO5.mjs";
import { t as resolveWorkshopSkillsDir } from "./skills-root-5Lc00M9N.mjs";
import { n as loadWorkspaceSkills } from "./workspace-skill-loader-CWlRhYtz.mjs";
import { c as loadSkillRootRecords } from "./plugin-skills-BVTLcXRM.mjs";
import { t as listInstalledPluginDirs } from "./installed-plugin-dirs-LSqpVO75.mjs";
import path from "node:path";
//#region src/security/audit.deep.runtime.ts
/** Deep audit implementation for code-safety scans loaded only when requested. */
const loadAgentScopeModule = createLazyRuntimeModule(() => import("./agent-scope-BbGZA7Yc.mjs"));
const loadAgentWorkspaceDirsModule = createLazyRuntimeModule(() => import("./workspace-dirs-BIJN6nlE.mjs"));
const loadSkillSourceModule = createLazyRuntimeModule(() => import("./source-CvrnxwE1.mjs"));
const loadSkillScannerModule = createLazyRuntimeModule(() => import("./scanner-AFrN6W5N.mjs"));
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
	return normalizeTrimmedStringList(asOptionalRecord(asOptionalRecord(parsed)?.[MANIFEST_KEY])?.extensions);
}
function formatCodeSafetyDetails(findings, rootDir) {
	return findings.map((finding) => {
		const relPath = path.relative(rootDir, finding.file);
		const normalizedPath = (relPath && relPath !== "." && !relPath.startsWith("..") ? relPath : path.basename(finding.file)).replaceAll("\\", "/");
		return `  - [${finding.ruleId}] ${finding.message} (${normalizedPath}:${finding.line})`;
	}).join("\n");
}
async function getCodeSafetySummary(params) {
	const includeFiles = normalizeStringEntries(params.includeFiles);
	const includeKey = includeFiles.length > 0 ? includeFiles.toSorted().join("\0") : "";
	const cacheKey = `${params.dirPath}\u0000${includeKey}`;
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
		if (summary.truncated) findings.push({
			checkId: "plugins.code_safety.scan_truncated",
			severity: "warn",
			title: `Plugin "${pluginName}" code scan is incomplete`,
			detail: `Static code scan reached its file or directory-entry budget under ${pluginPath}. Some files were not checked.`,
			remediation: "Review the remaining files manually; this bounded scan is not a full code audit."
		});
		const severity = summary.critical > 0 ? "critical" : summary.warn > 0 ? "warn" : void 0;
		if (severity) {
			const details = formatCodeSafetyDetails(summary.findings.filter((finding) => finding.severity === severity), pluginPath);
			const critical = severity === "critical";
			findings.push({
				checkId: "plugins.code_safety",
				severity,
				title: `Plugin "${pluginName}" contains ${critical ? "dangerous" : "suspicious"} code patterns`,
				detail: `Found ${summary[severity]} ${critical ? "critical issue(s)" : "warning(s)"} in ${summary.scannedFiles} scanned file(s):\n${details}`,
				remediation: critical ? "Review the plugin source code carefully before use. If untrusted, remove the plugin from your OpenClaw extensions state directory." : "Review the flagged code to ensure it is intentional and safe."
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
		if (summary.truncated) findings.push({
			checkId: "skills.code_safety.scan_truncated",
			severity: "warn",
			title: `Skill "${skillName}" code scan is incomplete`,
			detail: `Static code scan reached its file or directory-entry budget under ${skillDir}. Some files were not checked.`,
			remediation: "Review the remaining files manually; this bounded scan is not a full code audit."
		});
		const severity = summary.critical > 0 ? "critical" : summary.warn > 0 ? "warn" : void 0;
		if (severity) {
			const details = formatCodeSafetyDetails(summary.findings.filter((finding) => finding.severity === severity), skillDir);
			const critical = severity === "critical";
			findings.push({
				checkId: "skills.code_safety",
				severity,
				title: `Skill "${skillName}" contains ${critical ? "dangerous" : "suspicious"} code patterns`,
				detail: `Found ${summary[severity]} ${critical ? "critical issue(s)" : "warning(s)"} in ${summary.scannedFiles} scanned file(s) under ${skillDir}:\n${details}`,
				remediation: critical ? `Review the skill source code before use. If untrusted, remove "${skillDir}".` : "Review flagged lines to ensure the behavior is intentional and safe."
			});
		}
	}
	return findings;
}
//#endregion
export { collectInstalledSkillsCodeSafetyFindings, collectPluginsCodeSafetyFindings };
