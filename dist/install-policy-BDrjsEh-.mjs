import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isPathInside } from "./path-safety-0BfxAYBQ.mjs";
import "./includes-CaaCq-XN.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as resolveRuntimeServiceVersion } from "./version-BkM1aB4w.mjs";
import { n as normalizePositiveInt, r as normalizePositiveTimerMs } from "./shared-BUXrUFz5.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { a as inspectPathPermissions, o as safeStat } from "./permissions-DOmAO-Zd.mjs";
import "./audit-fs-td54YTW0.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/security/install-policy-response.ts
const MAX_REASON_CHARS = 1e3;
const MAX_FINDINGS = 100;
const MAX_FINDING_TEXT_CHARS = 1e3;
const TRUNCATION_MARKER = "...";
const installPolicyResponseEnvelopeSchema = object({
	protocolVersion: literal(1),
	decision: _enum([
		"allow",
		"warn",
		"block"
	]),
	reason: unknown().optional(),
	findings: array(unknown()).optional().catch(void 0)
});
const installPolicyReasonSchema = string().trim().min(1);
const findingTextSchema = string().trim().min(1);
const optionalFindingTextSchema = findingTextSchema.optional().catch(void 0);
const installPolicyFindingSchema = object({
	ruleId: findingTextSchema,
	severity: _enum([
		"info",
		"warn",
		"critical"
	]),
	message: findingTextSchema,
	file: optionalFindingTextSchema,
	line: number().finite().transform((value) => Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(value)))).optional().catch(void 0),
	evidence: optionalFindingTextSchema
}).transform(({ evidence, file, line, ...finding }) => ({
	...finding,
	...file ? { file } : {},
	...line !== void 0 ? { line } : {},
	...evidence ? { evidence } : {}
}));
function truncateText(value, maxChars) {
	return truncateWithMarker(value, maxChars, {
		marker: TRUNCATION_MARKER,
		reserve: 3,
		trimEnd: false
	});
}
function createInstallPolicyFailure(message) {
	return { blocked: {
		code: "security_scan_failed",
		reason: `install policy failed closed: ${truncateText(message, MAX_REASON_CHARS)}`
	} };
}
function blockedByPolicy(reason, findings) {
	return {
		blocked: {
			code: "security_scan_blocked",
			reason: `blocked by install policy: ${truncateText(reason, MAX_REASON_CHARS)}`
		},
		...findings && findings.length > 0 ? { findings } : {}
	};
}
function normalizeFinding(value) {
	const parsed = installPolicyFindingSchema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
function truncateFinding(finding) {
	return {
		ruleId: truncateText(finding.ruleId, MAX_FINDING_TEXT_CHARS),
		severity: finding.severity,
		message: truncateText(finding.message, MAX_FINDING_TEXT_CHARS),
		...finding.file ? { file: truncateText(finding.file, MAX_FINDING_TEXT_CHARS) } : {},
		...finding.line !== void 0 ? { line: finding.line } : {},
		...finding.evidence ? { evidence: truncateText(finding.evidence, MAX_FINDING_TEXT_CHARS) } : {}
	};
}
function fingerprintWarning(reason, findings) {
	return createHash("sha256").update(JSON.stringify({
		reason,
		findings
	})).digest("hex");
}
function formatPolicyResponseEnvelopeError(error) {
	const invalidPath = error.issues[0]?.path[0];
	return invalidPath === void 0 ? "policy response must be a JSON object" : invalidPath === "protocolVersion" ? "policy response protocolVersion must be 1" : "policy response decision must be \"allow\", \"warn\", or \"block\"";
}
function parseInstallPolicyResponse(stdout) {
	const trimmed = stdout.trim();
	if (!trimmed) return createInstallPolicyFailure("policy command returned empty stdout");
	let parsed;
	try {
		parsed = JSON.parse(trimmed);
	} catch (err) {
		return createInstallPolicyFailure(`policy command returned invalid JSON (${formatErrorMessage(err)})`);
	}
	const response = installPolicyResponseEnvelopeSchema.safeParse(parsed);
	if (!response.success) return createInstallPolicyFailure(formatPolicyResponseEnvelopeError(response.error));
	const fullFindings = (response.data.findings ?? []).map(normalizeFinding).filter((finding) => finding !== null);
	const normalizedFindings = fullFindings.slice(0, MAX_FINDINGS).map(truncateFinding);
	if (response.data.decision === "allow") return normalizedFindings.length > 0 ? { findings: normalizedFindings } : {};
	const reason = installPolicyReasonSchema.safeParse(response.data.reason);
	if (!reason.success) return createInstallPolicyFailure(`policy response decision "${response.data.decision}" requires a non-empty reason`);
	if (response.data.decision === "warn") {
		if (fullFindings.length > MAX_FINDINGS) return createInstallPolicyFailure(`policy warning returned more than ${String(MAX_FINDINGS)} valid findings; reduce the findings before retrying`);
		return {
			warning: {
				reason: truncateText(reason.data, MAX_REASON_CHARS),
				fingerprint: fingerprintWarning(reason.data, fullFindings)
			},
			...normalizedFindings.length > 0 ? { findings: normalizedFindings } : {}
		};
	}
	return blockedByPolicy(reason.data, normalizedFindings);
}
//#endregion
//#region src/security/install-policy.ts
const DEFAULT_TIMEOUT_MS = 1e4;
const DEFAULT_MAX_OUTPUT_BYTES = 1048576;
const DEFAULT_MAX_REQUEST_BYTES = 262144;
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
const POLICY_INTERPRETER_NAMES = /* @__PURE__ */ new Set([
	"bash",
	"bun",
	"deno",
	"env",
	"fish",
	"node",
	"perl",
	"powershell",
	"pwsh",
	"python",
	"python3",
	"ruby",
	"sh",
	"zsh"
]);
const POLICY_SCRIPT_ARG_PATTERN = /\.(?:bash|cjs|cts|js|mjs|mts|pl|ps1|py|rb|sh|ts|zsh)$/i;
function isAbsolutePathname(value) {
	if (path.isAbsolute(value)) return true;
	return process.platform === "win32" && (WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value));
}
function executableName(commandPath) {
	return path.basename(commandPath).replace(/\.exe$/i, "").toLowerCase();
}
function isPolicyScriptArg(value) {
	return isAbsolutePathname(value) || value.startsWith(".") || value.includes("/") || value.includes("\\") || POLICY_SCRIPT_ARG_PATTERN.test(value);
}
function resolvePolicyScriptArg(params) {
	const interpreterName = executableName(params.command);
	const startIndex = 0;
	if (interpreterName === "env") return {
		kind: "unsupported",
		message: "security.installPolicy.exec.command must not use env; configure the policy executable directly."
	};
	if (!POLICY_INTERPRETER_NAMES.has(interpreterName) || interpreterName === "env") return;
	const scripts = [];
	for (let index = startIndex; index < params.args.length; index += 1) {
		const arg = params.args[index];
		if (!arg) continue;
		if (arg.startsWith("-")) {
			const equalsIndex = arg.indexOf("=");
			if (equalsIndex > 0) {
				const optionValue = arg.slice(equalsIndex + 1);
				if (isPolicyScriptArg(optionValue)) scripts.push({
					index,
					path: optionValue
				});
			}
			continue;
		}
		if (isPolicyScriptArg(arg)) scripts.push({
			index,
			path: arg
		});
	}
	return scripts.length > 0 ? {
		kind: "scripts",
		scripts
	} : void 0;
}
async function readFileStatOrThrow(pathname, label) {
	const stat = await safeStat(pathname);
	if (!stat.ok) throw new Error(`${label} is not readable: ${pathname}`);
	if (stat.isDir) throw new Error(`${label} must be a file: ${pathname}`);
	return stat;
}
function collectPathAncestorDirs(targetPath) {
	const dirs = [];
	let current = path.resolve(path.dirname(targetPath));
	while (true) {
		dirs.push(current);
		const parent = path.dirname(current);
		if (parent === current) return dirs;
		current = parent;
	}
}
async function assertSecureCommandAncestorDirs(params) {
	const currentUid = typeof process.getuid === "function" ? process.getuid() : void 0;
	for (const dir of collectPathAncestorDirs(params.targetPath)) {
		const perms = await inspectPathPermissions(dir);
		if (!perms.ok) throw new Error(`${params.label} parent directory permissions could not be verified: ${dir}`);
		let sticky = false;
		if (process.platform !== "win32" && (perms.worldWritable || perms.groupWritable)) try {
			sticky = ((await fs.stat(dir)).mode & 512) !== 0;
		} catch {
			sticky = false;
		}
		if ((perms.worldWritable || perms.groupWritable) && !sticky) throw new Error(`${params.label} parent directory permissions are too open: ${dir}`);
		if (process.platform !== "win32" && currentUid !== void 0) {
			let stat;
			try {
				stat = await fs.stat(dir);
			} catch {
				throw new Error(`${params.label} parent directory ownership could not be verified: ${dir}`);
			}
			if (stat.uid !== 0 && stat.uid !== currentUid) throw new Error(`${params.label} parent directory owner is not trusted: ${dir}`);
		}
		if (process.platform === "win32" && perms.source === "unknown") throw new Error(`${params.label} parent directory ACL verification unavailable on Windows for ${dir}. Move ${params.label} to a direct path whose ACLs can be verified.`);
	}
}
async function assertSecureCommandPath(params) {
	if (!isAbsolutePathname(params.targetPath)) throw new Error(`${params.label} must be an absolute path.`);
	const effectivePath = params.targetPath;
	const stat = await readFileStatOrThrow(effectivePath, params.label);
	if (stat.isSymlink) throw new Error(`${params.label} must not be a symlink: ${effectivePath}`);
	if (params.trustedDirs && params.trustedDirs.length > 0) {
		if (!params.trustedDirs.map((entry) => resolveUserPath(entry)).some((dir) => isPathInside(dir, effectivePath))) throw new Error(`${params.label} is outside trustedDirs: ${effectivePath}`);
	}
	const perms = await inspectPathPermissions(effectivePath);
	if (!perms.ok) throw new Error(`${params.label} permissions could not be verified: ${effectivePath}`);
	if (perms.worldWritable || perms.groupWritable) throw new Error(`${params.label} permissions are too open: ${effectivePath}`);
	await assertSecureCommandAncestorDirs({
		targetPath: effectivePath,
		label: params.label
	});
	if (process.platform === "win32" && perms.source === "unknown") throw new Error(`${params.label} ACL verification unavailable on Windows for ${effectivePath}. Move ${params.label} to a direct path whose ACLs can be verified.`);
	if (process.platform !== "win32" && typeof process.getuid === "function" && stat.uid != null) {
		const uid = process.getuid();
		if (stat.uid !== uid && stat.uid !== 0) throw new Error(`${params.label} must be owned by the current user (uid=${uid}) or root: ${effectivePath}`);
	}
	return effectivePath;
}
async function assertSecurePolicyScriptArg(params) {
	const scriptArg = resolvePolicyScriptArg({
		command: params.command,
		args: params.args
	});
	if (!scriptArg) return;
	if (scriptArg.kind === "unsupported") throw new Error(scriptArg.message);
	for (const script of scriptArg.scripts) await assertSecureCommandPath({
		targetPath: script.path,
		label: `security.installPolicy.exec.args[${script.index}]`,
		trustedDirs: params.trustedDirs
	});
}
function createPolicyChildEnv(_sourceEnv) {
	return {};
}
function readPassEnvValue(env, key) {
	const exact = env[key];
	if (exact !== void 0 || process.platform !== "win32") return exact;
	const lowerKey = key.toLowerCase();
	const matchedKey = Object.keys(env).find((candidate) => candidate.toLowerCase() === lowerKey);
	return matchedKey ? env[matchedKey] : void 0;
}
function isTargetEnabled(params) {
	const targets = params.policy.targets;
	if (!targets || targets.length === 0) return true;
	return targets.includes(params.targetType);
}
function resolvePolicy(config, targetType) {
	const policy = config?.security?.installPolicy;
	if (!policy || policy.enabled !== true) return { kind: "disabled" };
	if (!isTargetEnabled({
		policy,
		targetType
	})) return { kind: "disabled" };
	if (!policy.exec) return {
		kind: "failure",
		result: createInstallPolicyFailure("security.installPolicy is enabled but security.installPolicy.exec is not configured")
	};
	return {
		kind: "configured",
		exec: policy.exec
	};
}
function resolveConfiguredTargets(policy) {
	const targets = policy.targets;
	return targets && targets.length > 0 ? [...new Set(targets)] : ["skill", "plugin"];
}
async function validateInstallPolicyStatic(config) {
	const policy = config?.security?.installPolicy;
	if (!policy || policy.enabled !== true) return {
		enabled: false,
		targets: [],
		issues: []
	};
	const targets = resolveConfiguredTargets(policy);
	const issues = [];
	if (!policy.exec) {
		issues.push({
			severity: "error",
			message: "security.installPolicy is enabled but security.installPolicy.exec is not configured."
		});
		return {
			enabled: true,
			targets,
			issues
		};
	}
	if (!isAbsolutePathname(policy.exec.command)) {
		issues.push({
			severity: "error",
			message: "security.installPolicy.exec.command must be an absolute path."
		});
		return {
			enabled: true,
			targets,
			issues
		};
	}
	try {
		await assertSecureCommandPath({
			targetPath: policy.exec.command,
			label: "security.installPolicy.exec.command",
			trustedDirs: policy.exec.trustedDirs
		});
	} catch (err) {
		issues.push({
			severity: "error",
			message: formatErrorMessage(err)
		});
	}
	try {
		await assertSecurePolicyScriptArg({
			command: policy.exec.command,
			args: policy.exec.args ?? [],
			trustedDirs: policy.exec.trustedDirs
		});
	} catch (err) {
		issues.push({
			severity: "error",
			message: formatErrorMessage(err)
		});
	}
	return {
		enabled: true,
		targets,
		issues
	};
}
async function runInstallPolicy(params) {
	const decisionContext = formatDecisionContext(params.request);
	const logBlocked = (result) => {
		if (result.blocked) params.logger?.debug?.(`Install policy ${decisionContext}: ${result.blocked.reason}`);
		return result;
	};
	const failClosed = (message) => logBlocked(createInstallPolicyFailure(message));
	let config = params.config;
	if (!config) try {
		const { getRuntimeConfig } = await import("./io-CPLwHuZl.mjs");
		config = getRuntimeConfig({ skipPluginValidation: true });
	} catch (err) {
		return failClosed(`could not load OpenClaw config (${formatErrorMessage(err)})`);
	}
	const policy = resolvePolicy(config, params.request.targetType);
	if (policy.kind === "disabled") return;
	if (policy.kind === "failure") return logBlocked(policy.result);
	const input = JSON.stringify({
		protocolVersion: 1,
		openclawVersion: resolveRuntimeServiceVersion(params.env ?? process.env),
		...params.request
	});
	if (Buffer.byteLength(input, "utf8") > DEFAULT_MAX_REQUEST_BYTES) return failClosed(`policy request exceeded maxInputBytes (${DEFAULT_MAX_REQUEST_BYTES})`);
	const commandPath = policy.exec.command;
	if (!isAbsolutePathname(commandPath)) return failClosed("security.installPolicy.exec.command must be an absolute path.");
	let secureCommandPath;
	try {
		secureCommandPath = await assertSecureCommandPath({
			targetPath: commandPath,
			label: "security.installPolicy.exec.command",
			trustedDirs: policy.exec.trustedDirs
		});
	} catch (err) {
		return failClosed(formatErrorMessage(err));
	}
	try {
		await assertSecurePolicyScriptArg({
			command: secureCommandPath,
			args: policy.exec.args ?? [],
			trustedDirs: policy.exec.trustedDirs
		});
	} catch (err) {
		return failClosed(formatErrorMessage(err));
	}
	const env = params.env ?? process.env;
	const childEnv = createPolicyChildEnv(env);
	for (const key of policy.exec.passEnv ?? []) {
		const value = readPassEnvValue(env, key);
		if (value !== void 0) childEnv[key] = value;
	}
	for (const [key, value] of Object.entries(policy.exec.env ?? {})) childEnv[key] = value;
	const timeoutMs = normalizePositiveTimerMs(policy.exec.timeoutMs, DEFAULT_TIMEOUT_MS);
	const noOutputTimeoutMs = normalizePositiveTimerMs(policy.exec.noOutputTimeoutMs, timeoutMs);
	const maxOutputBytes = normalizePositiveInt(policy.exec.maxOutputBytes, DEFAULT_MAX_OUTPUT_BYTES);
	const cwd = path.dirname(secureCommandPath);
	let result;
	try {
		result = await runCommandWithTimeout([secureCommandPath, ...policy.exec.args ?? []], {
			baseEnv: {},
			cwd,
			env: childEnv,
			input,
			killProcessTree: true,
			maxCombinedOutputBytes: maxOutputBytes,
			maxOutputBytes,
			noOutputTimeoutMs,
			outputCapture: "head",
			terminateOnOutputLimit: true,
			timeoutMs
		});
	} catch (err) {
		return failClosed(formatErrorMessage(err));
	}
	if (result.termination === "timeout") return failClosed(`policy command timed out after ${timeoutMs}ms`);
	if (result.termination === "no-output-timeout") return failClosed(`policy command produced no output for ${noOutputTimeoutMs}ms`);
	if (result.outputLimitExceeded) return failClosed(`output exceeded maxOutputBytes (${maxOutputBytes})`);
	if (result.code !== 0) return failClosed(`policy command exited with code ${String(result.code)}`);
	const parsed = parseInstallPolicyResponse(result.stdout);
	if (parsed.blocked) return logBlocked(parsed);
	if (parsed.warning) {
		params.logger?.debug?.(`Install policy ${decisionContext}: warned`);
		return parsed;
	}
	params.logger?.debug?.(`Install policy ${decisionContext}: allowed`);
	return parsed;
}
function formatDecisionContext(request) {
	const source = request.source ? ` source=${request.source.kind}/${request.source.authority}` : "";
	const origin = typeof request.origin.type === "string" ? request.origin.type : "unknown";
	return [
		`target=${request.targetType}:${request.targetName}`,
		`request=${request.request.kind}/${request.request.mode}`,
		`origin=${origin}`,
		`pathKind=${request.sourcePathKind}`,
		source.trim()
	].filter(Boolean).join(" ");
}
async function probeInstallPolicy(params) {
	const validation = await validateInstallPolicyStatic(params.config);
	if (!validation.enabled || validation.issues.some((issue) => issue.severity === "error")) return;
	const targetType = validation.targets.includes("skill") ? "skill" : validation.targets[0];
	if (!targetType) return;
	return await runInstallPolicy({
		config: params.config,
		env: params.env,
		logger: params.logger,
		request: {
			targetType,
			targetName: "doctor-install-policy-probe",
			sourcePath: params.sourcePath,
			sourcePathKind: "directory",
			origin: { type: "doctor" },
			request: {
				kind: targetType === "skill" ? "skill-install" : "plugin-dir",
				mode: "install",
				requestedSpecifier: "doctor:install-policy-probe"
			}
		}
	});
}
//#endregion
export { runInstallPolicy as n, validateInstallPolicyStatic as r, probeInstallPolicy as t };
