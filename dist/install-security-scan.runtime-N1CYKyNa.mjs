import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import "./includes-CaaCq-XN.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-DlvY8FQy.mjs";
import { n as runInstallPolicy } from "./install-policy-BDrjsEh-.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/plugins/install-policy-context.ts
function emptyBuiltinScan() {
	return {
		status: "ok",
		scannedFiles: 0,
		critical: 0,
		warn: 0,
		info: 0,
		findings: []
	};
}
function createBeforeInstallHookPayload(params) {
	return {
		event: {
			targetType: params.targetType,
			targetName: params.targetName,
			sourcePath: params.sourcePath,
			sourcePathKind: params.sourcePathKind,
			...params.origin ? { origin: params.origin } : {},
			request: params.request,
			builtinScan: params.builtinScan ?? emptyBuiltinScan(),
			...params.skill ? { skill: params.skill } : {},
			...params.plugin ? { plugin: params.plugin } : {}
		},
		ctx: {
			targetType: params.targetType,
			requestKind: params.request.kind,
			...params.origin ? { origin: params.origin } : {}
		}
	};
}
//#endregion
//#region src/plugins/install-security-scan.runtime.ts
const FULL_GIT_COMMIT_PATTERN = /^[0-9a-f]{40}$/i;
const INSTALL_POLICY_BLOCK_REASON_PREFIX = "blocked by install policy: ";
const INSTALL_POLICY_ACKNOWLEDGEMENT_FLAG = "--acknowledge-install-policy-warning";
const MAX_INSTALL_POLICY_NOTICE_CHARS = 4e3;
const INSTALL_POLICY_REVIEW_GUIDANCE = [
	"This invocation cannot approve install policy warnings.",
	"To continue:",
	"  • Run the matching direct `openclaw plugins ...` or `openclaw skills ...` command interactively.",
	`  • For reviewed direct CLI automation, add ${INSTALL_POLICY_ACKNOWLEDGEMENT_FLAG}.`,
	"  • If no equivalent direct command exists, change security.installPolicy to allow this reviewed request, then retry.",
	"  • --force does not approve install policy warnings."
];
function formatInstallPolicyFinding(finding) {
	const location = finding.file ? ` (${sanitizeTerminalText(finding.file)}${finding.line ? `:${finding.line}` : ""})` : "";
	const evidence = finding.evidence ? ` Evidence: ${sanitizeTerminalText(finding.evidence)}` : "";
	return `[${finding.severity.toUpperCase()}] ${sanitizeTerminalText(finding.ruleId)}: ${sanitizeTerminalText(finding.message)}${location}${evidence}`;
}
function formatInstallPolicyNotice(params) {
	const targetLabel = params.targetType === "skill" ? "Skill" : "Plugin";
	const lines = [
		params.decision === "warn" ? "Install requires approval" : "Install blocked by policy",
		"",
		`  ${targetLabel}: ${sanitizeTerminalText(params.targetName)}`,
		`  Reason: ${sanitizeTerminalText(params.reason)}`
	];
	if (params.findings?.length) {
		lines.push("  Findings:");
		for (const finding of params.findings) lines.push(`    • ${formatInstallPolicyFinding(finding)}`);
	}
	if (params.guidance?.length) lines.push("", ...params.guidance);
	return lines.join("\n");
}
function failOversizedInstallPolicyWarning(params) {
	if (!params.result?.warning) return;
	if (formatInstallPolicyNotice({
		decision: "warn",
		findings: params.result.findings,
		guidance: INSTALL_POLICY_REVIEW_GUIDANCE,
		reason: params.result.warning.reason,
		targetName: params.targetName,
		targetType: params.targetType
	}).length <= MAX_INSTALL_POLICY_NOTICE_CHARS) return;
	return { blocked: {
		code: "security_scan_failed",
		reason: "install policy failed closed: policy review exceeds the 4,000-character display limit; reduce or coalesce the reason and findings"
	} };
}
function formatBlockedInstallPolicyResult(params) {
	if (params.blocked.code !== "security_scan_blocked" || !params.blocked.reason.startsWith(INSTALL_POLICY_BLOCK_REASON_PREFIX)) return { blocked: params.blocked };
	const reason = params.blocked.reason.slice(27);
	const notice = formatInstallPolicyNotice({
		decision: "block",
		findings: params.findings,
		reason,
		targetName: params.targetName,
		targetType: params.targetType
	});
	if (notice.length > MAX_INSTALL_POLICY_NOTICE_CHARS) {
		const compactNotice = `${formatInstallPolicyNotice({
			decision: "block",
			reason,
			targetName: params.targetName,
			targetType: params.targetType
		})}\n  Findings omitted: policy review exceeds the 4,000-character display limit.`;
		return { blocked: {
			...params.blocked,
			reason: compactNotice.length <= MAX_INSTALL_POLICY_NOTICE_CHARS ? compactNotice : "Install blocked by policy: review exceeds the 4,000-character display limit."
		} };
	}
	return { blocked: {
		...params.blocked,
		reason: notice
	} };
}
const DEFAULT_PACKAGE_TRAVERSAL_LIMITS = {
	maxDepth: 64,
	maxDirectories: 1e4
};
function pathContainsNodeModulesSegment(relativePath) {
	return relativePath.split(/[\\/]+/).map((segment) => segment.trim().toLowerCase()).includes("node_modules");
}
function isPackageRootOpenClawPeerSymlink(segments) {
	return segments.length === 2 && segments[0] === "node_modules" && segments[1] === "openclaw" || segments.length === 3 && segments[0] === "node_modules" && segments[1] === ".bin" && segments[2] === "openclaw";
}
function isManagedNpmRootPackagePeerSymlink(segments) {
	if (segments[0] !== "node_modules") return false;
	const packageEndIndex = segments[1]?.startsWith("@") ? 3 : 2;
	const packageNameSegments = segments.slice(1, packageEndIndex);
	if (packageNameSegments.length === 0 || packageNameSegments.some((segment) => !segment || segment === "." || segment === "..")) return false;
	return isPackageRootOpenClawPeerSymlink(segments.slice(packageEndIndex));
}
function isTrustedOpenClawPeerSymlink(params) {
	const segments = params.relativePath.split(/[\\/]+/);
	return isPackageRootOpenClawPeerSymlink(segments) || params.allowManagedNpmRootPackagePeerSymlinks === true && isManagedNpmRootPackagePeerSymlink(segments);
}
async function resolveTrustedHostOpenClawRootRealPath() {
	const hostRoot = resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		cwd: process.cwd(),
		moduleUrl: import.meta.url
	});
	if (!hostRoot) return null;
	return await fs.realpath(hostRoot).catch(() => path.resolve(hostRoot));
}
function isTrustedHostOpenClawPath(params) {
	return params.trustedHostOpenClawRootRealPath !== null && isPathInside(params.trustedHostOpenClawRootRealPath, params.resolvedTargetPath);
}
async function inspectNodeModulesSymlinkTarget(params) {
	let resolvedTargetPath;
	try {
		resolvedTargetPath = await fs.realpath(params.symlinkPath);
	} catch (error) {
		throw new Error(`dependency boundary scan could not resolve symlink target ${params.symlinkRelativePath}: ${String(error)}`, { cause: error });
	}
	if (!isPathInside(params.rootRealPath, resolvedTargetPath)) {
		if (isTrustedOpenClawPeerSymlink({
			allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
			relativePath: params.symlinkRelativePath
		}) && isTrustedHostOpenClawPath({
			resolvedTargetPath,
			trustedHostOpenClawRootRealPath: params.trustedHostOpenClawRootRealPath
		})) return;
		throw new Error(`dependency boundary scan found node_modules symlink target outside install root at ${params.symlinkRelativePath}`);
	}
}
function readPositiveIntegerEnv(name, fallback) {
	const rawValue = process.env[name];
	if (!rawValue) return fallback;
	return parseStrictPositiveInteger(rawValue) ?? fallback;
}
function resolvePackageTraversalLimits() {
	return {
		maxDepth: readPositiveIntegerEnv("OPENCLAW_INSTALL_SCAN_MAX_DEPTH", DEFAULT_PACKAGE_TRAVERSAL_LIMITS.maxDepth),
		maxDirectories: readPositiveIntegerEnv("OPENCLAW_INSTALL_SCAN_MAX_DIRECTORIES", DEFAULT_PACKAGE_TRAVERSAL_LIMITS.maxDirectories)
	};
}
function isSamePathOrInside(parentPath, candidatePath) {
	return parentPath === candidatePath || isPathInside(parentPath, candidatePath);
}
function getErrnoCode(error) {
	if (typeof error !== "object" || error === null || !("code" in error)) return;
	const code = error.code;
	return typeof code === "string" ? code : void 0;
}
function isInstallScannableDependencyName(name) {
	if (name.startsWith("@")) {
		const parts = name.split("/");
		return parts.length === 2 && parts.every((part) => part.length > 0 && part !== "." && part !== "..");
	}
	return name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== "..";
}
function collectManifestRuntimeDependencyNames(manifest) {
	const dependencyNames = /* @__PURE__ */ new Set();
	for (const dependencies of [manifest.dependencies, manifest.optionalDependencies]) for (const dependencyName of Object.keys(dependencies ?? {})) if (isInstallScannableDependencyName(dependencyName)) dependencyNames.add(dependencyName);
	for (const dependencyName of Object.keys(manifest.peerDependencies ?? {})) if (dependencyName !== "openclaw" && isInstallScannableDependencyName(dependencyName)) dependencyNames.add(dependencyName);
	return [...dependencyNames].toSorted((left, right) => left.localeCompare(right));
}
async function resolveInstalledPackageScanRoot(params) {
	const packageDir = path.join(params.packageDir, "node_modules", params.dependencyName);
	let stats;
	try {
		stats = await fs.stat(packageDir);
	} catch (error) {
		if (getErrnoCode(error) === "ENOENT") return;
		throw error;
	}
	if (!stats.isDirectory()) return;
	const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
	if (!isSamePathOrInside(params.boundaryRealPath, realPath)) {
		if (params.allowManagedNpmRootPackagePeerSymlinks === true && params.dependencyName === "openclaw" && isTrustedHostOpenClawPath({
			resolvedTargetPath: realPath,
			trustedHostOpenClawRootRealPath: params.trustedHostOpenClawRootRealPath
		})) return;
		throw new Error(`installed dependency scan found package outside install root at ${packageDir}`);
	}
	return {
		packageDir,
		realPath
	};
}
async function collectInstalledPackageScanRoots(params) {
	const limits = resolvePackageTraversalLimits();
	const boundaryDir = params.dependencyScanRootDir ?? params.packageDir;
	const boundaryRealPath = await fs.realpath(boundaryDir).catch(() => path.resolve(boundaryDir));
	const trustedHostOpenClawRootRealPath = await resolveTrustedHostOpenClawRootRealPath();
	const packageRealPath = await fs.realpath(params.packageDir).catch(() => path.resolve(params.packageDir));
	if (!isSamePathOrInside(boundaryRealPath, packageRealPath)) throw new Error(`installed dependency scan found package outside install root at ${params.packageDir}`);
	const queue = [{
		packageDir: params.packageDir,
		realPath: packageRealPath
	}];
	for (const packageDir of params.additionalPackageDirs ?? []) {
		const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
		if (!isSamePathOrInside(boundaryRealPath, realPath)) throw new Error(`installed dependency scan found package outside install root at ${packageDir}`);
		queue.push({
			packageDir,
			realPath
		});
	}
	const visitedRealPaths = /* @__PURE__ */ new Set();
	const scanRoots = [];
	let queueIndex = 0;
	while (queueIndex < queue.length) {
		const current = queue[queueIndex];
		queueIndex += 1;
		if (!current || visitedRealPaths.has(current.realPath)) continue;
		visitedRealPaths.add(current.realPath);
		if (visitedRealPaths.size > limits.maxDirectories) throw new Error(`installed dependency scan exceeded max packages (${limits.maxDirectories}) under ${boundaryDir}`);
		scanRoots.push(current.packageDir);
		const manifest = await tryReadJson(path.join(current.packageDir, "package.json"));
		if (!manifest) continue;
		for (const dependencyName of collectManifestRuntimeDependencyNames(manifest)) {
			const candidate = await resolveInstalledPackageScanRoot({
				allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
				boundaryRealPath,
				dependencyName,
				packageDir: current.packageDir,
				trustedHostOpenClawRootRealPath
			}) ?? (params.dependencyScanRootDir ? await resolveInstalledPackageScanRoot({
				allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
				boundaryRealPath,
				dependencyName,
				packageDir: params.dependencyScanRootDir,
				trustedHostOpenClawRootRealPath
			}) : void 0);
			if (candidate && !visitedRealPaths.has(candidate.realPath)) queue.push(candidate);
		}
	}
	return scanRoots;
}
async function collectNonOverlappingPackageScanRoots(packageDirs) {
	const selectedRoots = [];
	for (const packageDir of packageDirs) {
		const realPath = await fs.realpath(packageDir).catch(() => path.resolve(packageDir));
		if (selectedRoots.some((selectedRoot) => isSamePathOrInside(selectedRoot.realPath, realPath))) continue;
		selectedRoots.push({
			packageDir,
			realPath
		});
	}
	return selectedRoots.map((selectedRoot) => selectedRoot.packageDir);
}
async function validatePackageDependencyBoundaries(params) {
	const limits = resolvePackageTraversalLimits();
	const rootDir = params.rootDir;
	const rootRealPath = await fs.realpath(rootDir).catch(() => rootDir);
	const trustedHostOpenClawRootRealPath = await resolveTrustedHostOpenClawRootRealPath();
	const queue = [{
		depth: 0,
		dir: rootDir
	}];
	const visitedDirectories = /* @__PURE__ */ new Set();
	let queueIndex = 0;
	while (queueIndex < queue.length) {
		const current = queue[queueIndex];
		queueIndex += 1;
		if (!current) continue;
		if (current.depth > limits.maxDepth) throw new Error(`dependency boundary scan exceeded max depth (${limits.maxDepth}) at ${current.dir}`);
		const currentDir = current.dir;
		const currentRealPath = await fs.realpath(currentDir).catch(() => currentDir);
		if (visitedDirectories.has(currentRealPath)) continue;
		visitedDirectories.add(currentRealPath);
		if (visitedDirectories.size > limits.maxDirectories) throw new Error(`dependency boundary scan exceeded max directories (${limits.maxDirectories}) under ${rootDir}`);
		let entries;
		try {
			entries = await fs.readdir(currentDir, {
				encoding: "utf8",
				withFileTypes: true
			});
		} catch (error) {
			throw new Error(`dependency boundary scan could not read ${currentDir}: ${String(error)}`, { cause: error });
		}
		for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
			const nextPath = path.join(currentDir, entry.name);
			const relativeNextPath = path.relative(rootDir, nextPath) || entry.name;
			if (entry.isSymbolicLink()) {
				if (pathContainsNodeModulesSegment(relativeNextPath)) await inspectNodeModulesSymlinkTarget({
					allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
					rootRealPath,
					symlinkPath: nextPath,
					symlinkRelativePath: relativeNextPath,
					trustedHostOpenClawRootRealPath
				});
				continue;
			}
			if (entry.isDirectory()) queue.push({
				depth: current.depth + 1,
				dir: nextPath
			});
		}
	}
}
async function runBeforeInstallHook(params) {
	const hookRunner = getGlobalHookRunner();
	if (!hookRunner?.hasHooks("before_install")) return;
	try {
		const { event, ctx } = createBeforeInstallHookPayload({
			targetName: params.targetName,
			targetType: params.targetType,
			origin: params.origin,
			sourcePath: params.sourcePath,
			sourcePathKind: params.sourcePathKind,
			request: {
				kind: params.requestKind,
				mode: params.requestMode,
				...params.requestedSpecifier ? { requestedSpecifier: params.requestedSpecifier } : {}
			},
			...params.skill ? { skill: params.skill } : {},
			...params.plugin ? { plugin: params.plugin } : {}
		});
		const hookResult = await hookRunner.runBeforeInstall(event, ctx);
		if (hookResult?.block) {
			const reason = hookResult.blockReason || "Installation blocked by plugin hook";
			params.logger.warn?.(`WARNING: ${params.installLabel} blocked by plugin hook: ${reason}`);
			return { blocked: {
				code: "security_scan_blocked",
				reason
			} };
		}
		if (hookResult?.findings) {
			for (const finding of hookResult.findings) if (finding.severity === "critical" || finding.severity === "warn") params.logger.warn?.(`Plugin scanner: ${finding.message} (${finding.file}:${finding.line})`);
		}
	} catch (err) {
		const reason = `Installation blocked because before_install hook failed: ${formatErrorMessage(err)}`;
		params.logger.warn?.(`WARNING: ${params.installLabel} blocked by plugin hook failure: ${reason}`);
		return { blocked: {
			code: "security_scan_failed",
			reason
		} };
	}
}
function formatInstallPolicyOriginForHook(origin) {
	const type = typeof origin.type === "string" ? origin.type : "unknown";
	if (type === "upload") return "skill-upload";
	const spec = typeof origin.spec === "string" ? origin.spec : void 0;
	const slug = typeof origin.slug === "string" ? origin.slug : void 0;
	return spec ?? slug ?? type;
}
function isMutableGitOrigin(origin) {
	const ref = typeof origin?.ref === "string" ? origin.ref : void 0;
	return !FULL_GIT_COMMIT_PATTERN.test(ref ?? "");
}
function resolvePolicySource(params) {
	if (params.requestKind === "skill-install") switch (params.origin?.type) {
		case "clawhub": return {
			kind: "clawhub",
			authority: "openclaw",
			mutable: false,
			network: true
		};
		case "git": return {
			kind: "git",
			authority: "third-party",
			mutable: isMutableGitOrigin(params.origin),
			network: true
		};
		case "path": return {
			kind: "local-path",
			authority: "user",
			mutable: true,
			network: false
		};
		case "upload": return {
			kind: "upload",
			authority: "user",
			mutable: false,
			network: false
		};
		case "openclaw-bundled": return {
			kind: "bundled",
			authority: "openclaw",
			mutable: false,
			network: false
		};
		case "openclaw-managed":
		case "openclaw-extra": return {
			kind: "managed",
			authority: "openclaw",
			mutable: false,
			network: false
		};
		default: return {
			kind: "workspace",
			authority: "user",
			mutable: true,
			network: false
		};
	}
	switch (params.requestKind) {
		case "plugin-archive": return {
			kind: "archive",
			authority: "third-party",
			mutable: true,
			network: false
		};
		case "plugin-file": return {
			kind: "file",
			authority: "user",
			mutable: true,
			network: false
		};
		case "plugin-git": return {
			kind: "git",
			authority: "third-party",
			mutable: true,
			network: true
		};
		case "plugin-npm": return {
			kind: "npm",
			authority: "third-party",
			mutable: false,
			network: true
		};
		case "plugin-dir": return {
			kind: "local-path",
			authority: "user",
			mutable: true,
			network: false
		};
	}
	return {
		kind: "local-path",
		authority: "unknown",
		mutable: true,
		network: false
	};
}
function shouldBypassOpenClawInstallFriction(params) {
	if (params.trustedSourceLinkedOfficialInstall === true) return true;
	const source = params.source;
	if (!source || source.mutable) return false;
	if (source.authority === "official") return source.kind === "clawhub" || source.kind === "git" || source.kind === "npm";
	return source.authority === "openclaw" && (source.kind === "bundled" || source.kind === "managed");
}
async function runOperatorInstallPolicy(params) {
	const request = {
		targetName: params.targetName,
		targetType: params.targetType,
		sourcePath: params.sourcePath,
		sourcePathKind: params.sourcePathKind,
		...params.source ? { source: params.source } : {},
		origin: params.origin,
		request: {
			kind: params.requestKind,
			mode: params.requestMode,
			...params.requestedSpecifier ? { requestedSpecifier: params.requestedSpecifier } : {}
		},
		...params.skill ? { skill: params.skill } : {},
		...params.plugin ? { plugin: params.plugin } : {}
	};
	const evaluatePolicy = () => runInstallPolicy({
		config: params.config,
		logger: params.logger,
		request
	});
	const logPolicyResult = (result) => {
		if (result?.warning) {
			params.logger.warn?.(`${formatInstallPolicyNotice({
				decision: "warn",
				findings: result.findings,
				reason: result.warning.reason,
				targetName: params.targetName,
				targetType: params.targetType
			})}\n`);
			return;
		}
		const messages = (result?.findings ?? []).filter((finding) => finding.severity === "critical" || finding.severity === "warn").map((finding) => `Install policy: ${formatInstallPolicyFinding(finding)}`);
		if (messages.reduce((length, message) => length + message.length + 1, 0) <= MAX_INSTALL_POLICY_NOTICE_CHARS) {
			for (const message of messages) params.logger.warn?.(message);
			return;
		}
		const omittedMessage = "Install policy: additional findings omitted because the 4,000-character log limit was reached.";
		let remaining = 3905;
		for (const message of messages) {
			if (message.length + 1 > remaining) continue;
			params.logger.warn?.(message);
			remaining -= message.length + 1;
		}
		params.logger.warn?.(omittedMessage);
	};
	const result = await evaluatePolicy();
	const presentationFailure = failOversizedInstallPolicyWarning({
		result,
		targetName: params.targetName,
		targetType: params.targetType
	});
	if (presentationFailure) return presentationFailure;
	if (result?.blocked) return formatBlockedInstallPolicyResult({
		blocked: result.blocked,
		findings: result.findings,
		targetName: params.targetName,
		targetType: params.targetType
	});
	if (!result?.warning) {
		logPolicyResult(result);
		return;
	}
	const installPolicyWarning = {
		targetName: params.targetName,
		targetType: params.targetType,
		requestMode: params.requestMode,
		reason: result.warning.reason,
		...result.findings?.length ? { findings: result.findings } : {}
	};
	if (!params.onInstallPolicyWarning) return { blocked: {
		code: "security_scan_blocked",
		installPolicyWarning,
		reason: formatInstallPolicyNotice({
			decision: "warn",
			findings: result.findings,
			guidance: INSTALL_POLICY_REVIEW_GUIDANCE,
			reason: result.warning.reason,
			targetName: params.targetName,
			targetType: params.targetType
		})
	} };
	logPolicyResult(result);
	if ((await params.onInstallPolicyWarning({ ...installPolicyWarning })).status === "approved") {
		const reevaluated = await evaluatePolicy();
		const reevaluatedPresentationFailure = failOversizedInstallPolicyWarning({
			result: reevaluated,
			targetName: params.targetName,
			targetType: params.targetType
		});
		if (reevaluatedPresentationFailure) return reevaluatedPresentationFailure;
		if (reevaluated?.blocked) return formatBlockedInstallPolicyResult({
			blocked: reevaluated.blocked,
			findings: reevaluated.findings,
			targetName: params.targetName,
			targetType: params.targetType
		});
		if (reevaluated?.warning) {
			if (!(reevaluated.warning.fingerprint === result.warning.fingerprint)) return { blocked: {
				code: "security_scan_blocked",
				installPolicyWarning: {
					targetName: params.targetName,
					targetType: params.targetType,
					requestMode: params.requestMode,
					reason: reevaluated.warning.reason,
					...reevaluated.findings?.length ? { findings: reevaluated.findings } : {}
				},
				reason: formatInstallPolicyNotice({
					decision: "warn",
					findings: reevaluated.findings,
					guidance: ["The policy warning changed after approval.", "Review the current warning and try again."],
					reason: reevaluated.warning.reason,
					targetName: params.targetName,
					targetType: params.targetType
				})
			} };
		} else logPolicyResult(reevaluated);
		return;
	}
	return { blocked: {
		code: "security_scan_blocked",
		installPolicyWarning,
		reason: "Install cancelled: the install policy warning was not approved."
	} };
}
async function runInstallPolicyAndHook(params) {
	const policyResult = await runOperatorInstallPolicy({
		...params,
		origin: params.policyOrigin
	});
	if (params.skipHook || policyResult?.blocked) return policyResult;
	return await runBeforeInstallHook({
		...params,
		origin: params.hookOrigin
	});
}
async function scanBundleInstallSourceRuntime(params) {
	const requestKind = params.requestKind ?? "plugin-dir";
	const source = params.source ?? resolvePolicySource({ requestKind });
	const plugin = {
		contentType: "bundle",
		pluginId: params.pluginId,
		manifestId: params.pluginId,
		...params.version ? { version: params.version } : {}
	};
	await validatePackageDependencyBoundaries({ rootDir: params.sourceDir });
	return await runInstallPolicyAndHook({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		policyOrigin: {
			type: "plugin-bundle",
			...params.version ? { version: params.version } : {}
		},
		hookOrigin: "plugin-bundle",
		installLabel: `Bundle "${params.pluginId}" installation`,
		source,
		sourcePath: params.sourceDir,
		sourcePathKind: "directory",
		targetName: params.pluginId,
		targetType: "plugin",
		requestKind,
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin,
		skipHook: shouldBypassOpenClawInstallFriction({ source: params.source })
	});
}
async function scanPackageInstallSourceRuntime(params) {
	const requestKind = params.requestKind ?? "plugin-dir";
	const source = params.source ?? resolvePolicySource({ requestKind });
	const plugin = {
		contentType: "package",
		pluginId: params.pluginId,
		...params.packageName ? { packageName: params.packageName } : {},
		...params.manifestId ? { manifestId: params.manifestId } : {},
		...params.version ? { version: params.version } : {},
		extensions: params.extensions.slice()
	};
	await validatePackageDependencyBoundaries({ rootDir: params.packageDir });
	return await runInstallPolicyAndHook({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		policyOrigin: {
			type: "plugin-package",
			...params.packageName ? { packageName: params.packageName } : {},
			...params.version ? { version: params.version } : {}
		},
		hookOrigin: "plugin-package",
		installLabel: `Plugin "${params.pluginId}" installation`,
		source,
		sourcePath: params.packageDir,
		sourcePathKind: "directory",
		targetName: params.pluginId,
		targetType: "plugin",
		requestKind,
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin,
		skipHook: shouldBypassOpenClawInstallFriction({
			source: params.source,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
		})
	});
}
async function scanInstalledPackageDependencyTreeRuntime(params) {
	const requestKind = params.requestKind ?? "plugin-npm";
	const runPolicy = () => runOperatorInstallPolicy({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		origin: { type: "plugin-dependency-tree" },
		source: params.source ?? resolvePolicySource({ requestKind }),
		sourcePath: params.dependencyScanRootDir ?? params.packageDir,
		sourcePathKind: "directory",
		targetName: params.pluginId,
		targetType: "plugin",
		requestKind,
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin: {
			contentType: "dependency-tree",
			pluginId: params.pluginId
		},
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	const boundaryScanRoots = await collectNonOverlappingPackageScanRoots(await collectInstalledPackageScanRoots({
		...params.additionalPackageDirs ? { additionalPackageDirs: params.additionalPackageDirs } : {},
		dependencyScanRootDir: params.dependencyScanRootDir,
		allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks,
		packageDir: params.packageDir
	}));
	for (const rootDir of boundaryScanRoots) await validatePackageDependencyBoundaries({
		rootDir,
		allowManagedNpmRootPackagePeerSymlinks: params.allowManagedNpmRootPackagePeerSymlinks
	});
	return await runPolicy();
}
async function scanFileInstallSourceRuntime(params) {
	const plugin = {
		contentType: "file",
		pluginId: params.pluginId,
		extensions: [path.basename(params.filePath)]
	};
	return await runInstallPolicyAndHook({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		policyOrigin: { type: "plugin-file" },
		hookOrigin: "plugin-file",
		installLabel: `Plugin file "${params.pluginId}" installation`,
		source: params.source ?? resolvePolicySource({ requestKind: "plugin-file" }),
		sourcePath: params.filePath,
		sourcePathKind: "file",
		targetName: params.pluginId,
		targetType: "plugin",
		requestKind: "plugin-file",
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin
	});
}
async function preflightPluginNpmInstallPolicyRuntime(params) {
	const pluginId = params.pluginId ?? params.packageName;
	return await runOperatorInstallPolicy({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		origin: {
			type: "plugin-npm",
			packageName: params.packageName
		},
		source: params.source ?? resolvePolicySource({ requestKind: "plugin-npm" }),
		sourcePath: params.sourcePath,
		sourcePathKind: params.sourcePathKind,
		targetName: pluginId,
		targetType: "plugin",
		requestKind: "plugin-npm",
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin: {
			contentType: "package",
			pluginId,
			packageName: params.packageName
		}
	});
}
async function preflightPluginGitInstallPolicyRuntime(params) {
	return await runOperatorInstallPolicy({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		origin: { type: "plugin-git" },
		source: params.source ?? resolvePolicySource({ requestKind: "plugin-git" }),
		sourcePath: params.sourcePath,
		sourcePathKind: "directory",
		targetName: params.pluginId,
		targetType: "plugin",
		requestKind: "plugin-git",
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		plugin: {
			contentType: "package",
			pluginId: params.pluginId
		}
	});
}
async function evaluateSkillInstallPolicyRuntime(params) {
	const source = params.source ?? resolvePolicySource({
		requestKind: "skill-install",
		origin: params.origin
	});
	const skill = {
		installId: params.installId,
		...params.installSpec ? { installSpec: params.installSpec } : {}
	};
	return await runInstallPolicyAndHook({
		config: params.config,
		logger: params.logger,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		policyOrigin: params.origin,
		hookOrigin: formatInstallPolicyOriginForHook(params.origin),
		installLabel: `Skill "${params.skillName}" installation`,
		source,
		sourcePath: params.sourceDir,
		sourcePathKind: "directory",
		targetName: params.skillName,
		targetType: "skill",
		requestKind: "skill-install",
		requestMode: params.mode ?? "install",
		requestedSpecifier: params.requestedSpecifier,
		skill,
		skipHook: shouldBypassOpenClawInstallFriction({ source: params.source })
	});
}
//#endregion
export { evaluateSkillInstallPolicyRuntime, preflightPluginGitInstallPolicyRuntime, preflightPluginNpmInstallPolicyRuntime, scanBundleInstallSourceRuntime, scanFileInstallSourceRuntime, scanInstalledPackageDependencyTreeRuntime, scanPackageInstallSourceRuntime };
