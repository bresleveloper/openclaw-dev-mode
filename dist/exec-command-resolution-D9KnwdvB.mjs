import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as expandHomePrefix } from "./home-dir-BKwhAL2c.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { o as resolveExecutablePath, s as resolveExecutablePathCandidate } from "./executable-path-BMRdcL7i.mjs";
import { E as resolveDispatchWrapperTrustPlan, N as resolveCarrierCommandArgv, O as unwrapKnownDispatchWrapperInvocation, c as hasPosixShellStartupBeforeInlineCommand, i as extractBindableShellWrapperInlineCommand, o as extractShellWrapperInlineCommand, p as unwrapKnownShellMultiplexerInvocation, u as isShellWrapperExecutable } from "./shell-wrapper-resolution-CPhcV89l.mjs";
import path from "node:path";
import { safeRealpathSync } from "@openclaw/fs-safe/path";
import crypto from "node:crypto";
//#region src/infra/exec-allowlist-pattern.ts
const GLOB_REGEX_CACHE_LIMIT = 512;
const globRegexCache = /* @__PURE__ */ new Map();
function normalizeMatchTarget(value) {
	if (process.platform === "win32") {
		const stripped = value.replace(/^\\\\[?.]\\/, "");
		return normalizeLowercaseStringOrEmpty(stripped.replace(/\\/g, "/"));
	}
	const normalized = value.replace(/\\\\/g, "/");
	if (process.platform === "darwin") {
		if (normalized === "/private/var") return "/var";
		if (normalized.startsWith("/private/var/")) return normalized.slice(8);
	}
	return normalized;
}
function hasDotPathSegment(value) {
	return value.replace(/\\/g, "/").split("/").some((segment) => segment === "." || segment === "..");
}
function normalizeDotPathSegments(value) {
	return normalizeMatchTarget(process.platform === "win32" ? path.win32.normalize(value) : path.posix.normalize(value));
}
function compileGlobRegex(pattern) {
	const cacheKey = `${process.platform}:${pattern}`;
	const cached = globRegexCache.get(cacheKey);
	if (cached) return cached;
	let regex = "^";
	let i = 0;
	while (i < pattern.length) {
		const ch = pattern.charAt(i);
		if (ch === "*") {
			if (pattern[i + 1] === "*") {
				regex += ".*";
				i += 2;
				continue;
			}
			regex += "[^/]*";
			i += 1;
			continue;
		}
		if (ch === "?") {
			regex += "[^/]";
			i += 1;
			continue;
		}
		regex += escapeRegExp(ch);
		i += 1;
	}
	regex += "$";
	const compiled = new RegExp(regex, process.platform === "win32" ? "i" : "");
	if (globRegexCache.size >= GLOB_REGEX_CACHE_LIMIT) globRegexCache.clear();
	globRegexCache.set(cacheKey, compiled);
	return compiled;
}
function matchesExecAllowlistPattern(pattern, target) {
	const trimmed = pattern.trim();
	if (!trimmed) return false;
	const expanded = trimmed.startsWith("~") ? expandHomePrefix(trimmed) : trimmed;
	const hasWildcard = /[*?]/.test(expanded);
	let normalizedPattern = expanded;
	let normalizedTarget = target;
	if (process.platform === "win32" && !hasWildcard) {
		normalizedPattern = safeRealpathSync(expanded) ?? expanded;
		normalizedTarget = safeRealpathSync(target) ?? target;
	}
	normalizedPattern = normalizeMatchTarget(normalizedPattern);
	normalizedTarget = normalizeMatchTarget(normalizedTarget);
	if (hasWildcard && hasDotPathSegment(normalizedTarget)) normalizedTarget = normalizeDotPathSegments(normalizedTarget);
	return compileGlobRegex(normalizedPattern).test(normalizedTarget);
}
//#endregion
//#region src/infra/exec-wrapper-trust-plan.ts
function blockedExecWrapperTrustPlan(params) {
	return {
		dispatchChain: null,
		argv: params.argv,
		policyArgv: params.policyArgv ?? params.argv,
		wrapperChain: params.wrapperChain,
		wrapperInvocations: params.wrapperInvocations,
		policyBlocked: true,
		blockedWrapper: params.blockedWrapper,
		shellWrapperExecutable: false,
		shellInlineCommand: null
	};
}
function finalizeExecWrapperTrustPlan(argv, policyArgv, wrapperChain, wrapperInvocations, policyBlocked, dispatchChainComplete) {
	const rawExecutable = argv[0]?.trim() ?? "";
	const shellWrapperExecutable = !policyBlocked && rawExecutable.length > 0 && isShellWrapperExecutable(rawExecutable);
	return {
		dispatchChain: dispatchChainComplete && !policyBlocked && rawExecutable && (!shellWrapperExecutable || extractShellWrapperInlineCommand(argv) === null && !hasPosixShellStartupBeforeInlineCommand(argv)) ? [...wrapperInvocations.map(({ sourceArgv }) => sourceArgv), argv] : null,
		argv,
		policyArgv,
		wrapperChain,
		wrapperInvocations,
		policyBlocked,
		shellWrapperExecutable,
		shellInlineCommand: shellWrapperExecutable ? extractBindableShellWrapperInlineCommand(argv) : null
	};
}
const TRANSPARENT_SHELL_ARGV_CARRIERS = /* @__PURE__ */ new Set([
	"builtin",
	"command",
	"exec"
]);
function commandCarrierUsesDefaultPathSearch(argv) {
	if (argv[0]?.trim() !== "command") return false;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index]?.trim() ?? "";
		if (token === "--" || !token.startsWith("-")) return false;
		if (/^-[^-]*p/u.test(token)) return true;
	}
	return false;
}
function unwrapTransparentShellArgvCarrierInvocation(argv, platform = process.platform) {
	if (platform === "win32") return { kind: "not-wrapper" };
	const token0 = argv[0]?.trim();
	if (!token0) return { kind: "not-wrapper" };
	if (!TRANSPARENT_SHELL_ARGV_CARRIERS.has(token0)) return { kind: "not-wrapper" };
	if (commandCarrierUsesDefaultPathSearch(argv)) return {
		kind: "blocked",
		wrapper: token0
	};
	const unwrapped = resolveCarrierCommandArgv(argv, 0, { includeExec: true });
	return unwrapped && unwrapped.length > 0 ? {
		kind: "unwrapped",
		wrapper: token0,
		argv: unwrapped
	} : {
		kind: "blocked",
		wrapper: token0
	};
}
/**
* Resolves transparent dispatch wrappers into the executable that policy should inspect.
* Shell multiplexers keep their original argv as the trust target while exposing the
* nested shell command for shell-specific approval checks.
*/
function resolveExecWrapperTrustPlan(argv, maxDepth = 4, platform = process.platform) {
	let current = argv;
	let policyArgv = argv;
	let sawShellMultiplexer = false;
	let dispatchChainComplete = true;
	const wrapperChain = [];
	const wrapperInvocations = [];
	for (let depth = 0; depth < maxDepth; depth += 1) {
		const dispatchPlan = resolveDispatchWrapperTrustPlan(current, maxDepth - wrapperChain.length, platform);
		wrapperInvocations.push(...dispatchPlan.wrapperInvocations);
		dispatchChainComplete &&= dispatchPlan.dispatchChainComplete;
		if (dispatchPlan.policyBlocked) return blockedExecWrapperTrustPlan({
			argv: dispatchPlan.argv,
			policyArgv: dispatchPlan.argv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: dispatchPlan.blockedWrapper ?? current[0] ?? "unknown"
		});
		if (dispatchPlan.wrappers.length > 0) {
			wrapperChain.push(...dispatchPlan.wrappers);
			current = dispatchPlan.argv;
			if (!sawShellMultiplexer) policyArgv = current;
			if (wrapperChain.length >= maxDepth) break;
			continue;
		}
		const shellArgvCarrierUnwrap = unwrapTransparentShellArgvCarrierInvocation(current, platform);
		if (shellArgvCarrierUnwrap.kind === "blocked") return blockedExecWrapperTrustPlan({
			argv: current,
			policyArgv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: shellArgvCarrierUnwrap.wrapper
		});
		if (shellArgvCarrierUnwrap.kind === "unwrapped") {
			dispatchChainComplete = false;
			wrapperChain.push(shellArgvCarrierUnwrap.wrapper);
			wrapperInvocations.push({
				wrapper: shellArgvCarrierUnwrap.wrapper,
				sourceArgv: [...current]
			});
			current = shellArgvCarrierUnwrap.argv;
			if (!sawShellMultiplexer) policyArgv = current;
			if (wrapperChain.length >= maxDepth) break;
			continue;
		}
		const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(current);
		if (shellMultiplexerUnwrap.kind === "blocked") return blockedExecWrapperTrustPlan({
			argv: current,
			policyArgv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: shellMultiplexerUnwrap.wrapper
		});
		if (shellMultiplexerUnwrap.kind === "unwrapped") {
			dispatchChainComplete = false;
			wrapperChain.push(shellMultiplexerUnwrap.wrapper);
			wrapperInvocations.push({
				wrapper: shellMultiplexerUnwrap.wrapper,
				sourceArgv: [...current]
			});
			if (!sawShellMultiplexer) {
				policyArgv = current;
				sawShellMultiplexer = true;
			}
			current = shellMultiplexerUnwrap.argv;
			if (wrapperChain.length >= maxDepth) break;
			continue;
		}
		break;
	}
	if (wrapperChain.length >= maxDepth) {
		const dispatchOverflow = unwrapKnownDispatchWrapperInvocation(current, platform);
		if (dispatchOverflow.kind === "blocked" || dispatchOverflow.kind === "unwrapped") return blockedExecWrapperTrustPlan({
			argv: current,
			policyArgv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: dispatchOverflow.wrapper
		});
		const shellArgvCarrierOverflow = unwrapTransparentShellArgvCarrierInvocation(current, platform);
		if (shellArgvCarrierOverflow.kind === "blocked" || shellArgvCarrierOverflow.kind === "unwrapped") return blockedExecWrapperTrustPlan({
			argv: current,
			policyArgv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: shellArgvCarrierOverflow.wrapper
		});
		const shellMultiplexerOverflow = unwrapKnownShellMultiplexerInvocation(current);
		if (shellMultiplexerOverflow.kind === "blocked" || shellMultiplexerOverflow.kind === "unwrapped") return blockedExecWrapperTrustPlan({
			argv: current,
			policyArgv,
			wrapperChain,
			wrapperInvocations,
			blockedWrapper: shellMultiplexerOverflow.wrapper
		});
	}
	return finalizeExecWrapperTrustPlan(current, policyArgv, wrapperChain, wrapperInvocations, false, dispatchChainComplete);
}
//#endregion
//#region src/infra/exec-command-resolution.ts
function parseFirstToken(command) {
	const trimmed = command.trim();
	if (!trimmed) return null;
	const first = trimmed[0];
	if (first === "\"" || first === "'") {
		const end = trimmed.indexOf(first, 1);
		if (end > 1) return trimmed.slice(1, end);
		return trimmed.slice(1);
	}
	const match = /^[^\s]+/.exec(trimmed);
	return match ? match[0] : null;
}
function tryResolveRealpath(filePath) {
	return filePath ? safeRealpathSync(filePath) ?? void 0 : void 0;
}
function buildExecutableResolution(rawExecutable, params) {
	const resolvedPath = resolveExecutablePath(rawExecutable, {
		cwd: params.cwd,
		env: params.env,
		useCache: params.useCache
	});
	return {
		kind: "executable",
		rawExecutable,
		resolvedPath,
		resolvedRealPath: tryResolveRealpath(resolvedPath),
		executableName: resolvedPath ? path.basename(resolvedPath) : rawExecutable
	};
}
function buildCommandResolution(params) {
	const execution = buildExecutableResolution(params.rawExecutable, params);
	return {
		kind: "command",
		execution,
		policy: params.policyRawExecutable ? buildExecutableResolution(params.policyRawExecutable, params) : execution,
		effectiveArgv: params.effectiveArgv,
		wrapperChain: params.wrapperChain,
		policyBlocked: params.policyBlocked,
		blockedWrapper: params.blockedWrapper
	};
}
function resolveCommandResolution(command, cwd, env) {
	const rawExecutable = parseFirstToken(command);
	if (!rawExecutable) return null;
	return buildCommandResolution({
		rawExecutable,
		effectiveArgv: [rawExecutable],
		wrapperChain: [],
		policyBlocked: false,
		cwd,
		env
	});
}
function resolveCommandResolutionFromArgv(argv, cwd, env, platform = process.platform, options) {
	const plan = resolveExecWrapperTrustPlan(argv, void 0, platform);
	const effectiveArgv = plan.argv;
	const rawExecutable = effectiveArgv[0]?.trim();
	if (!rawExecutable) return null;
	return buildCommandResolution({
		rawExecutable,
		policyRawExecutable: plan.policyArgv[0]?.trim(),
		effectiveArgv,
		wrapperChain: plan.wrapperChain,
		policyBlocked: plan.policyBlocked,
		blockedWrapper: plan.blockedWrapper,
		useCache: options?.useCache,
		cwd,
		env
	});
}
function resolveExecutableCandidatePathFromResolution(resolution, cwd) {
	if (!resolution) return;
	if (resolution.resolvedPath) return resolution.resolvedPath;
	const raw = resolution.rawExecutable?.trim();
	if (!raw) return;
	return resolveExecutablePathCandidate(raw, {
		cwd,
		requirePathSeparator: true
	});
}
function resolveExecutableTrustPath(resolution, cwd) {
	const realPath = resolution?.resolvedRealPath?.trim();
	if (realPath) return realPath;
	const candidatePath = resolveExecutableCandidatePathFromResolution(resolution, cwd);
	return tryResolveRealpath(candidatePath) ?? candidatePath;
}
function resolveExecutionTargetResolution(resolution) {
	if (!resolution) return null;
	return resolution.kind === "command" ? resolution.execution : resolution;
}
function resolvePolicyTargetResolution(resolution) {
	if (!resolution) return null;
	return resolution.kind === "command" ? resolution.policy : resolution;
}
function resolveExecutionTargetCandidatePath(resolution, cwd) {
	return resolveExecutableCandidatePathFromResolution(resolution?.kind === "command" ? resolution.execution : resolution, cwd);
}
function resolveExecutionTargetTrustPath(resolution, cwd) {
	return resolveExecutableTrustPath(resolution?.kind === "command" ? resolution.execution : resolution, cwd);
}
function resolvePolicyTargetCandidatePath(resolution, cwd) {
	return resolveExecutableCandidatePathFromResolution(resolution?.kind === "command" ? resolution.policy : resolution, cwd);
}
function resolvePolicyTargetTrustPath(resolution, cwd) {
	return resolveExecutableTrustPath(resolution?.kind === "command" ? resolution.policy : resolution, cwd);
}
function resolveApprovalAuditCandidatePath(resolution, cwd) {
	return resolvePolicyTargetCandidatePath(resolution, cwd);
}
function resolveApprovalAuditTrustPath(resolution, cwd) {
	return resolvePolicyTargetTrustPath(resolution, cwd);
}
/** @deprecated Use resolveExecutionTargetCandidatePath. */
function resolveAllowlistCandidatePath(resolution, cwd) {
	return resolveExecutionTargetCandidatePath(resolution, cwd);
}
function resolvePolicyAllowlistCandidatePath(resolution, cwd) {
	return resolvePolicyTargetCandidatePath(resolution, cwd);
}
const LEGACY_HASHED_ARG_PATTERN_PREFIX = "sha256:argv:";
const CWD_BOUND_HASHED_ARG_PATTERN_PREFIX = "sha256:cwd-argv:v1:";
function isGeneratedHashedArgPattern(value) {
	return typeof value === "string" && (value.startsWith(CWD_BOUND_HASHED_ARG_PATTERN_PREFIX) || value.startsWith(LEGACY_HASHED_ARG_PATTERN_PREFIX));
}
function isCwdBoundHashedArgPattern(value) {
	return typeof value === "string" && value.startsWith(CWD_BOUND_HASHED_ARG_PATTERN_PREFIX);
}
function classifyExecAllowlistScope(entry) {
	const pattern = entry.pattern.trim();
	const generated = entry.source === "allow-always";
	if (generated && (pattern.startsWith("=command:") || pattern.startsWith("=node-command:"))) return "command text";
	if (entry.argPattern?.startsWith(LEGACY_HASHED_ARG_PATTERN_PREFIX) === true || generated && !isCwdBoundHashedArgPattern(entry.argPattern)) return "inactive";
	if (isCwdBoundHashedArgPattern(entry.argPattern)) return "argv+cwd";
	return entry.argPattern ? "argv" : "any args";
}
function renderGeneratedArgPatternSubject(argv) {
	const argsSlice = argv.slice(1);
	return argsSlice.length === 0 ? "\0\0" : argsSlice.join("\0") + "\0";
}
function renderGeneratedHashedArgPatternSubject(argv) {
	const argsSlice = argv.slice(1);
	return `${argsSlice.length}\x00${argsSlice.map((arg) => `${Buffer.byteLength(arg, "utf8")}\x00${arg}\x00`).join("")}`;
}
function normalizeGrantCwd(cwd, platform) {
	return (normalizeLowercaseStringOrEmpty(platform ?? process.platform).startsWith("win") ? path.win32 : path.posix).normalize(cwd).replaceAll("\\", "/");
}
function buildCwdBoundHashedArgPattern(argv, cwd, platform) {
	const normalizedCwd = normalizeGrantCwd(cwd, platform);
	const subject = `${Buffer.byteLength(normalizedCwd, "utf8")}\x00${normalizedCwd}\x00${renderGeneratedHashedArgPatternSubject(argv)}`;
	const digest = crypto.createHash("sha256").update(subject, "utf8").digest("hex");
	return `${CWD_BOUND_HASHED_ARG_PATTERN_PREFIX}${digest}`;
}
function matchArgPattern(argPattern, argv, platform) {
	if (argPattern.startsWith(LEGACY_HASHED_ARG_PATTERN_PREFIX)) return false;
	const sep = argPattern.includes("\0") ? "\0" : " ";
	const argsString = sep === "\0" ? renderGeneratedArgPatternSubject(argv) : argv.slice(1).join(sep);
	try {
		const regex = new RegExp(argPattern);
		if (regex.test(argsString)) return true;
		if (normalizeLowercaseStringOrEmpty(platform ?? process.platform).startsWith("win")) {
			const normalized = argsString.replace(/\//g, "\\");
			if (normalized !== argsString && regex.test(normalized)) return true;
		}
		return false;
	} catch {
		return false;
	}
}
function hasPathSelector(value) {
	return value.includes("/") || value.includes("\\") || value.includes("~");
}
function matchesExecutableBasenamePattern(pattern, resolution) {
	if (hasPathSelector(resolution.rawExecutable)) return false;
	const candidates = /* @__PURE__ */ new Set();
	if (resolution.executableName) candidates.add(resolution.executableName);
	if (resolution.resolvedPath) candidates.add(path.basename(resolution.resolvedPath));
	return [...candidates].some((candidate) => matchesExecAllowlistPattern(pattern, candidate));
}
function matchAllowlist(entries, resolution, argv, platform, cwd) {
	if (!entries.length) return null;
	const bareWild = entries.find((e) => e.pattern?.trim() === "*" && !e.argPattern && e.source !== "allow-always");
	if (bareWild && resolution) return bareWild;
	if (!resolution?.resolvedPath) return null;
	const trustPath = resolution.resolvedRealPath?.trim() || resolution.resolvedPath;
	if (!trustPath) return null;
	let pathOnlyMatch = null;
	let cwdBoundHash;
	for (const entry of entries) {
		const pattern = entry.pattern?.trim();
		if (!pattern) continue;
		if (!(hasPathSelector(pattern) ? matchesExecAllowlistPattern(pattern, trustPath) : pattern !== "*" && matchesExecutableBasenamePattern(pattern, resolution))) continue;
		if (!entry.argPattern) {
			if (entry.source === "allow-always") continue;
			if (!pathOnlyMatch) pathOnlyMatch = entry;
			continue;
		}
		if (!argv) continue;
		if (isCwdBoundHashedArgPattern(entry.argPattern)) {
			if (cwd === void 0) continue;
			cwdBoundHash ??= buildCwdBoundHashedArgPattern(argv, cwd, platform);
			if (entry.argPattern === cwdBoundHash) return entry;
		} else if (entry.source !== "allow-always" && matchArgPattern(entry.argPattern, argv, platform)) return entry;
	}
	return pathOnlyMatch;
}
/**
* Tokenizes a single argv entry into a normalized option/positional model.
* Consumers can share this model to keep argv parsing behavior consistent.
*/
function parseExecArgvToken(raw) {
	if (!raw) return {
		kind: "empty",
		raw
	};
	if (raw === "--") return {
		kind: "terminator",
		raw
	};
	if (raw === "-") return {
		kind: "stdin",
		raw
	};
	if (!raw.startsWith("-")) return {
		kind: "positional",
		raw
	};
	if (raw.startsWith("--")) {
		const eqIndex = raw.indexOf("=");
		if (eqIndex > 0) return {
			kind: "option",
			raw,
			style: "long",
			flag: raw.slice(0, eqIndex),
			inlineValue: raw.slice(eqIndex + 1)
		};
		return {
			kind: "option",
			raw,
			style: "long",
			flag: raw
		};
	}
	const cluster = raw.slice(1);
	return {
		kind: "option",
		raw,
		style: "short-cluster",
		cluster,
		flags: cluster.split("").map((entry) => `-${entry}`)
	};
}
//#endregion
export { resolvePolicyTargetCandidatePath as _, matchAllowlist as a, resolveExecWrapperTrustPlan as b, resolveApprovalAuditCandidatePath as c, resolveCommandResolutionFromArgv as d, resolveExecutableTrustPath as f, resolvePolicyAllowlistCandidatePath as g, resolveExecutionTargetTrustPath as h, isGeneratedHashedArgPattern as i, resolveApprovalAuditTrustPath as l, resolveExecutionTargetResolution as m, classifyExecAllowlistScope as n, parseExecArgvToken as o, resolveExecutionTargetCandidatePath as p, isCwdBoundHashedArgPattern as r, resolveAllowlistCandidatePath as s, buildCwdBoundHashedArgPattern as t, resolveCommandResolution as u, resolvePolicyTargetResolution as v, resolvePolicyTargetTrustPath as y };
