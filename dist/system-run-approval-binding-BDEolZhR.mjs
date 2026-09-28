import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { o as normalizeHostOverrideEnvVarKey } from "./host-env-security-D7wdDMke.mjs";
import { n as readFileWindowFullySync } from "./file-read-Csm265gq.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { b as resolveExecWrapperTrustPlan, d as resolveCommandResolutionFromArgv } from "./exec-command-resolution-D9KnwdvB.mjs";
import { r as splitShellArgs } from "./shell-argv-DE1kujuY.mjs";
import { C as resolvePowerShellInlineCommandMatch, D as unwrapDispatchWrappersForResolution, O as unwrapKnownDispatchWrapperInvocation, P as normalizeExecutableToken, S as resolveInlineCommandMatch, a as extractShellWrapperCommand, g as advancePosixInlineOptionScan, h as POSIX_INLINE_COMMAND_FLAGS, m as NUSHELL_INLINE_COMMAND_FLAGS, n as POSIX_SHELL_WRAPPERS, p as unwrapKnownShellMultiplexerInvocation, s as hasEnvManipulationBeforeShellWrapper, t as POSIX_PARSEABLE_SHELL_WRAPPERS, x as isPowerShellInlineRestCommandFlag } from "./shell-wrapper-resolution-CPhcV89l.mjs";
import { i as analyzeWindowsShellCommand } from "./exec-approvals-analysis-Dc-DBchW.mjs";
import "./exec-wrapper-resolution-ChbEn7AS.mjs";
import { _ as planShellAuthorization, d as PNPM_DLX_OPTIONS_WITH_VALUE, f as PNPM_FLAG_OPTIONS, h as unwrapKnownPackageManagerExecInvocation, m as normalizePackageManagerExecToken, p as PNPM_OPTIONS_WITH_VALUE, u as PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE } from "./exec-approvals-allowlist-BcPQSHv1.mjs";
import { t as isInterpreterLikeSafeBin } from "./exec-safe-bin-runtime-policy-eHJh3MzL.mjs";
import { d as mapAllowFromEntries } from "./channel-config-helpers-FM3VqlCl.mjs";
import { n as detectPolicyInlineEval } from "./policy-BwFvV9Jw.mjs";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
//#region src/infra/system-run-command.ts
/** Format argv with minimal shell-style quoting for display and consistency checks. */
function formatExecCommand(argv) {
	return argv.map((arg) => {
		if (arg.length === 0) return "\"\"";
		if (!/\s|"/.test(arg)) return arg;
		return `"${arg.replace(/"/g, "\\\"")}"`;
	}).join(" ");
}
/** Extract the inline shell payload carried by a shell wrapper argv. */
function extractShellCommandFromArgv(argv) {
	return extractShellWrapperCommand(argv).command;
}
const POSIX_OR_POWERSHELL_INLINE_WRAPPER_NAMES = /* @__PURE__ */ new Set([
	...POSIX_SHELL_WRAPPERS,
	"powershell",
	"pwsh"
]);
function unwrapShellWrapperArgv(argv) {
	const dispatchUnwrapped = unwrapDispatchWrappersForResolution(argv);
	const shellMultiplexer = unwrapKnownShellMultiplexerInvocation(dispatchUnwrapped);
	return shellMultiplexer.kind === "unwrapped" ? shellMultiplexer.argv : dispatchUnwrapped;
}
function hasTrailingPositionalArgvAfterInlineCommand(argv) {
	const wrapperArgv = unwrapShellWrapperArgv(argv);
	const token0 = wrapperArgv[0]?.trim();
	if (!token0) return false;
	const wrapper = normalizeExecutableToken(token0);
	if (!POSIX_OR_POWERSHELL_INLINE_WRAPPER_NAMES.has(wrapper)) return false;
	const inlineCommandIndex = wrapper === "powershell" || wrapper === "pwsh" ? resolvePowerShellInlineCommandMatch(wrapperArgv).valueTokenIndex : wrapper === "nu" ? resolveNushellInlineCommandValueTokenIndex(wrapperArgv) : resolveInlineCommandMatch(wrapperArgv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).valueTokenIndex;
	if (inlineCommandIndex === null) return false;
	if ((wrapper === "powershell" || wrapper === "pwsh") && isPowerShellInlineRestCommandFlag(wrapperArgv[inlineCommandIndex - 1] ?? "")) return false;
	return wrapperArgv.slice(inlineCommandIndex + 1).some((entry) => entry.trim().length > 0);
}
function resolveNushellInlineCommandValueTokenIndex(argv) {
	for (let i = 1; i < argv.length; i += 1) {
		const arg = argv[i]?.trim() ?? "";
		if (!arg || arg === "--") return null;
		const equalsIndex = arg.indexOf("=");
		if (equalsIndex === -1) continue;
		const flag = arg.slice(0, equalsIndex).toLowerCase();
		if (flag.startsWith("--") && NUSHELL_INLINE_COMMAND_FLAGS.has(flag)) return i;
	}
	return resolveInlineCommandMatch(argv, NUSHELL_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).valueTokenIndex;
}
function buildSystemRunCommandDisplay(argv, rawCommand) {
	const rawlessShellWrapperResolution = extractShellWrapperCommand(argv);
	const shellWrapperResolution = rawlessShellWrapperResolution.command === null && rawCommand !== null ? extractShellWrapperCommand(argv, rawCommand) : rawlessShellWrapperResolution;
	const shellPayload = shellWrapperResolution.command;
	const shellWrapperPositionalArgv = hasTrailingPositionalArgvAfterInlineCommand(argv);
	const envManipulationBeforeShellWrapper = shellWrapperResolution.isWrapper && hasEnvManipulationBeforeShellWrapper(argv);
	return {
		shellPayload,
		commandText: formatExecCommand(argv),
		previewText: shellPayload !== null && !envManipulationBeforeShellWrapper && !shellWrapperPositionalArgv ? shellPayload.trim() : null
	};
}
function normalizeRawCommandText(rawCommand) {
	return typeof rawCommand === "string" && rawCommand.trim().length > 0 ? rawCommand.trim() : null;
}
function validateSystemRunCommandConsistency(params) {
	const raw = normalizeRawCommandText(params.rawCommand);
	const display = buildSystemRunCommandDisplay(params.argv, raw);
	if (raw) {
		const matchesCanonicalArgv = raw === display.commandText;
		const matchesLegacyShellText = params.allowLegacyShellText === true && display.previewText !== null && raw === display.previewText;
		if (!matchesCanonicalArgv && !matchesLegacyShellText) return {
			ok: false,
			message: "INVALID_REQUEST: rawCommand does not match command",
			details: {
				code: "RAW_COMMAND_MISMATCH",
				rawCommand: raw,
				inferred: display.commandText,
				formattedArgv: display.commandText
			}
		};
	}
	return {
		ok: true,
		shellPayload: display.shellPayload,
		commandText: display.commandText,
		previewText: display.previewText
	};
}
/** Resolve request command fields while accepting the legacy shell-preview text. */
function resolveSystemRunCommandRequest(params) {
	return resolveSystemRunCommandWithMode(params, true);
}
function resolveSystemRunCommandWithMode(params, allowLegacyShellText) {
	const raw = normalizeRawCommandText(params.rawCommand);
	const command = Array.isArray(params.command) ? params.command : [];
	if (command.length === 0) {
		if (raw) return {
			ok: false,
			message: "rawCommand requires params.command",
			details: { code: "MISSING_COMMAND" }
		};
		return {
			ok: true,
			argv: [],
			commandText: "",
			shellPayload: null,
			previewText: null
		};
	}
	const argv = command.map((v) => String(v));
	const validation = validateSystemRunCommandConsistency({
		argv,
		rawCommand: raw,
		allowLegacyShellText
	});
	if (!validation.ok) return {
		ok: false,
		message: validation.message,
		details: validation.details ?? { code: "RAW_COMMAND_MISMATCH" }
	};
	return {
		ok: true,
		argv,
		commandText: validation.commandText,
		shellPayload: validation.shellPayload,
		previewText: validation.previewText
	};
}
//#endregion
//#region src/infra/system-run-file-snapshot.ts
function hashFileContentsSync(filePath) {
	return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
function snapshotFileOperandAtPath(params) {
	let realPath;
	let stat;
	try {
		realPath = fs.realpathSync(params.filePath);
		stat = fs.statSync(realPath);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires an existing script operand"
		};
	}
	if (!stat.isFile()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a file script operand"
	};
	let sha256;
	try {
		sha256 = hashFileContentsSync(realPath);
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires a readable script operand"
		};
	}
	return {
		ok: true,
		snapshot: {
			argvIndex: params.argvIndex,
			path: realPath,
			sha256
		}
	};
}
function revalidateApprovedMutableFileOperand(params) {
	const operand = params.argv[params.snapshot.argvIndex]?.trim();
	if (!operand) return false;
	let realPath;
	try {
		realPath = fs.realpathSync(path.resolve(params.cwd ?? process.cwd(), operand));
	} catch {
		return false;
	}
	if (realPath !== params.snapshot.path) return false;
	try {
		return hashFileContentsSync(realPath) === params.snapshot.sha256;
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/system-run-mutable-file-options.ts
/** Interpreter and runtime option tables used by mutable operand detection. */
const BUN_SUBCOMMANDS = /* @__PURE__ */ new Set([
	"add",
	"audit",
	"completions",
	"create",
	"exec",
	"help",
	"init",
	"install",
	"link",
	"outdated",
	"patch",
	"pm",
	"publish",
	"remove",
	"repl",
	"run",
	"test",
	"unlink",
	"update",
	"upgrade",
	"x"
]);
const BUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--backend",
	"--bunfig",
	"--conditions",
	"--config",
	"--console-depth",
	"--cwd",
	"--define",
	"--elide-lines",
	"--env-file",
	"--extension-order",
	"--filter",
	"--hot",
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--install",
	"--jsx-factory",
	"--jsx-fragment",
	"--jsx-import-source",
	"--loader",
	"--origin",
	"--port",
	"--preload",
	"--smol",
	"--tsconfig-override",
	"-c",
	"-e",
	"-p",
	"-r"
]);
const BUN_UNBINDABLE_APPROVAL_OPTIONS = /* @__PURE__ */ new Set([
	"--bunfig",
	"--config",
	"--cwd",
	"--env-file",
	"--loader",
	"--preload",
	"--tsconfig-override",
	"-r"
]);
const DENO_RUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--cached-only",
	"--cert",
	"--config",
	"--env-file",
	"--ext",
	"--harmony-import-attributes",
	"--import-map",
	"--inspect",
	"--inspect-brk",
	"--inspect-wait",
	"--location",
	"--log-level",
	"--lock",
	"--node-modules-dir",
	"--no-check",
	"--preload",
	"--reload",
	"--seed",
	"--strace-ops",
	"--unstable-bare-node-builtins",
	"--v8-flags",
	"--watch",
	"--watch-exclude",
	"-L"
]);
const DENO_UNBINDABLE_APPROVAL_OPTIONS = /* @__PURE__ */ new Set([
	"--config",
	"--env-file",
	"--import-map",
	"--lock",
	"--node-modules-dir",
	"--preload"
]);
const NODE_OPTIONS_WITH_FILE_VALUE = /* @__PURE__ */ new Set([
	"--env-file",
	"--env-file-if-exists",
	"-r",
	"--experimental-loader",
	"--import",
	"--loader",
	"--require"
]);
const RUBY_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set([
	"-I",
	"-r",
	"--require"
]);
const PERL_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set([
	"-I",
	"-M",
	"-m"
]);
//#endregion
//#region src/infra/system-run-mutable-file-policy.ts
/** Filesystem heuristics for mutable executable and script operands. */
function pathComponentsFromRootSync(targetPath) {
	const parts = [];
	let cursor = path.resolve(targetPath);
	while (true) {
		parts.unshift(cursor);
		const parent = path.dirname(cursor);
		if (parent === cursor) return parts;
		cursor = parent;
	}
}
function isOwnedByCurrentProcessSync(candidate) {
	if (process.platform === "win32" || typeof process.getuid !== "function") return false;
	try {
		return fs.statSync(candidate).uid === process.getuid();
	} catch {
		return false;
	}
}
function isMutableByCurrentProcessSync(candidate) {
	try {
		fs.accessSync(candidate, fs.constants.W_OK);
		return true;
	} catch {
		return isOwnedByCurrentProcessSync(candidate);
	}
}
function hasMutableSymlinkPathComponentSync(targetPath) {
	for (const component of pathComponentsFromRootSync(targetPath)) try {
		if (!fs.lstatSync(component).isSymbolicLink()) continue;
		if (isMutableByCurrentProcessSync(path.dirname(component))) return true;
	} catch {
		return true;
	}
	return false;
}
function pathLooksMutableForShellPayloadSync(targetPath) {
	if (isMutableByCurrentProcessSync(targetPath) || isMutableByCurrentProcessSync(path.dirname(targetPath)) || hasMutableSymlinkPathComponentSync(targetPath)) return true;
	let realPath;
	try {
		realPath = fs.realpathSync(targetPath);
	} catch {
		return true;
	}
	return isMutableByCurrentProcessSync(realPath) || isMutableByCurrentProcessSync(path.dirname(realPath)) || hasMutableSymlinkPathComponentSync(realPath);
}
function looksLikePathToken(token) {
	return token.startsWith(".") || token.startsWith("/") || token.startsWith("\\") || token.includes("/") || token.includes("\\") || path.extname(token).length > 0;
}
function looksLikeExplicitPathToken(token) {
	return token.startsWith(".") || token.startsWith("/") || token.startsWith("\\") || token.includes("/") || token.includes("\\");
}
function resolvesToExistingFileSync(rawOperand, cwd) {
	if (!rawOperand) return false;
	try {
		return fs.statSync(path.resolve(cwd ?? process.cwd(), rawOperand)).isFile();
	} catch {
		return false;
	}
}
const BINARY_EXECUTABLE_MAGICS = /* @__PURE__ */ new Set([
	2135247942,
	4277009102,
	3472551422,
	4277009103,
	3489328638,
	3405691582,
	3199925962,
	3405691583,
	3216703178
]);
function isKnownBinaryExecutableHeader(buffer) {
	if (buffer.length >= 4 && BINARY_EXECUTABLE_MAGICS.has(buffer.readUInt32BE(0))) return true;
	if (buffer.length < 64 || buffer.readUInt16BE(0) !== 19802) return false;
	const peOffset = buffer.readUInt32LE(60);
	return peOffset <= buffer.length - 4 && buffer.readUInt32BE(peOffset) === 1346699264;
}
function isLikelyScriptLikePathSync(targetPath) {
	let stat;
	try {
		stat = fs.statSync(targetPath);
	} catch {
		return true;
	}
	if (!stat.isFile()) return true;
	let header;
	try {
		const fd = fs.openSync(targetPath, "r");
		try {
			header = Buffer.alloc(1024);
			const bytesRead = readFileWindowFullySync(fd, header, 0);
			header = header.subarray(0, bytesRead);
		} finally {
			fs.closeSync(fd);
		}
	} catch {
		return true;
	}
	if (header.length === 0 || header[0] === 35 && header[1] === 33) return true;
	return !isKnownBinaryExecutableHeader(header);
}
//#endregion
//#region src/infra/system-run-runtime-file-options.ts
/** Rejects runtime options whose file/cwd effects cannot fit one operand binding. */
function hasListedOption(argv, options) {
	return argv.slice(1).some((token) => options.has(normalizeLowercaseStringOrEmpty(parseInlineOptionToken(token).name)));
}
function hasPhpUnbindableOption(argv) {
	return argv.slice(1).some((token) => {
		const normalized = token.trim().toLowerCase();
		return normalized === "-c" || normalized.startsWith("-c=") || normalized === "--php-ini" || normalized.startsWith("--php-ini=") || normalized === "-d" || normalized.startsWith("-d");
	});
}
function hasUnbindableRuntimeApprovalOption(params) {
	if (params.executable === "bun") return hasListedOption(params.argv, BUN_UNBINDABLE_APPROVAL_OPTIONS);
	if (params.executable === "deno") return hasListedOption(params.argv, DENO_UNBINDABLE_APPROVAL_OPTIONS);
	return params.executable === "php" && hasPhpUnbindableOption(params.argv);
}
function hasPerlUnsafeApprovalFlag(argv) {
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = normalizeNullableString(argv[i]) ?? "";
		if (!token) continue;
		if (afterDoubleDash) return false;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-I" || token === "-M" || token === "-m" || token === "-S") return true;
		if (token.startsWith("-I") || token.startsWith("-M") || token.startsWith("-m")) return true;
		if (PERL_UNSAFE_APPROVAL_FLAGS.has(token)) return true;
	}
	return false;
}
//#endregion
//#region src/infra/system-run-shell-file-operand.ts
/** POSIX shell option handling for mutable file operand detection. */
const POSIX_SHELL_WRAPPER_SET$1 = POSIX_SHELL_WRAPPERS;
const POSIX_SHELL_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"--startup-script",
	"-O",
	"-o",
	"+O",
	"+o"
]);
const POSIX_SHELL_CODE_LOADING_OPTIONS = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"--startup-script"
]);
const POSIX_SHELLS_WITH_PLUS_OPTIONS = /* @__PURE__ */ new Set([
	"ash",
	"bash",
	"dash",
	"ksh",
	"mksh",
	"osh",
	"sh",
	"yash",
	"zsh"
]);
function normalizeOptionFlag(token) {
	return normalizeLowercaseStringOrEmpty(parseInlineOptionToken(token).name);
}
function isPosixShellOptionToken(token, supportsPlusOptions) {
	return token.startsWith("-") || supportsPlusOptions && token.startsWith("+");
}
function resolvePosixShellScriptOperandIndex(argv, executable) {
	const supportsPlusOptions = POSIX_SHELLS_WITH_PLUS_OPTIONS.has(executable);
	if (resolveInlineCommandMatch(argv, POSIX_INLINE_COMMAND_FLAGS, {
		allowCombinedC: true,
		isOptionToken: (token) => isPosixShellOptionToken(token, supportsPlusOptions),
		stopAtFirstNonOption: true
	}).valueTokenIndex !== null) return null;
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = argv[i]?.trim() ?? "";
		if (!token) continue;
		if (token === "-" || !afterDoubleDash && token === "-s") return null;
		if (!afterDoubleDash && token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (!afterDoubleDash && isPosixShellOptionToken(token, supportsPlusOptions)) {
			const flag = normalizeOptionFlag(token);
			if (POSIX_SHELL_OPTIONS_WITH_VALUE.has(flag)) {
				if (!token.includes("=")) i += 1;
				continue;
			}
			i += advancePosixInlineOptionScan(token) - 1;
			continue;
		}
		return i;
	}
	return null;
}
function hasPosixShellCodeLoadingOption(argv, executable) {
	if (!POSIX_SHELL_WRAPPER_SET$1.has(executable)) return false;
	for (const token of argv.slice(1)) {
		if (token === "--") return false;
		if (POSIX_SHELL_CODE_LOADING_OPTIONS.has(normalizeOptionFlag(token))) return true;
		if (token === "-s" || token === "--stdin") return true;
		if (token === "--interactive" || token === "-i" || /^-[^-]*i/u.test(token) && !token.includes("=")) return true;
	}
	return false;
}
function hasPosixShellStartupEnvironment(params) {
	if (!POSIX_SHELL_WRAPPER_SET$1.has(params.executable)) return false;
	if (params.env?.BASH_ENV?.trim() || params.env?.ENV?.trim()) return true;
	return params.argv.some((token) => /^(?:BASH_ENV|ENV)=/u.test(token.trim()));
}
//#endregion
//#region src/infra/system-run-mutable-file-operand.ts
/** Detects mutable file operands in approved commands. */
const POSIX_SHELL_WRAPPER_SET = POSIX_SHELL_WRAPPERS;
const POSIX_PARSEABLE_SHELL_WRAPPER_SET = POSIX_PARSEABLE_SHELL_WRAPPERS;
const PACKAGE_MANAGER_EXECUTABLES = /* @__PURE__ */ new Set([
	"corepack",
	"npm",
	"npx",
	"pnpm",
	"yarn"
]);
const MUTABLE_ARGV1_INTERPRETER_PATTERNS = [
	/^(?:node|nodejs)$/,
	/^perl$/,
	/^php$/,
	/^python(?:\d+(?:\.\d+)*)?$/,
	/^ruby$/
];
const GENERIC_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set([
	"esno",
	"jiti",
	"ts-node",
	"ts-node-esm",
	"tsx",
	"vite-node"
]);
const OPAQUE_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set(["busybox", "toybox"]);
function readTrimmedArgToken(argv, index) {
	return normalizeNullableString(argv[index]) ?? "";
}
function unwrapArgvForMutableOperand(argv) {
	let current = argv;
	let baseIndex = 0;
	let opaqueMultiplexerSeen = false;
	while (true) {
		const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(current);
		if (dispatchUnwrap.kind === "unwrapped") {
			baseIndex += current.length - dispatchUnwrap.argv.length;
			current = dispatchUnwrap.argv;
			continue;
		}
		const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(current);
		if (shellMultiplexerUnwrap.kind === "unwrapped") {
			if (OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(shellMultiplexerUnwrap.wrapper)) opaqueMultiplexerSeen = true;
			baseIndex += current.length - shellMultiplexerUnwrap.argv.length;
			current = shellMultiplexerUnwrap.argv;
			continue;
		}
		const packageManagerUnwrap = unwrapKnownPackageManagerExecInvocation(current);
		if (packageManagerUnwrap) {
			baseIndex += current.length - packageManagerUnwrap.length;
			current = packageManagerUnwrap;
			continue;
		}
		return {
			argv: current,
			baseIndex,
			opaqueMultiplexerSeen
		};
	}
}
function hasDispatchCwdOption(argv) {
	if (normalizeExecutableToken(argv[0] ?? "") !== "env") return false;
	for (const token of argv.slice(1)) {
		const normalized = token.trim().toLowerCase();
		if (normalized === "-c" || normalized.startsWith("-c=") || normalized === "--chdir" || normalized.startsWith("--chdir=")) return true;
		if (!normalized.startsWith("-") && !normalized.includes("=")) return false;
	}
	return false;
}
function unwrapSystemRunMutableFileOperandArgv(argv) {
	return unwrapArgvForMutableOperand(argv).argv;
}
function resolveOptionFilteredFileOperandIndex(params) {
	let afterDoubleDash = false;
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) return resolvesToExistingFileSync(token, params.cwd) ? i : null;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return null;
		if (token.startsWith("-")) {
			if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
			continue;
		}
		return resolvesToExistingFileSync(token, params.cwd) ? i : null;
	}
	return null;
}
function resolveOptionFilteredPositionalIndex(params) {
	let afterDoubleDash = false;
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) return i;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return null;
		if (token.startsWith("-")) {
			if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
			continue;
		}
		return i;
	}
	return null;
}
function collectExistingFileOperandIndexes(params) {
	let afterDoubleDash = false;
	const hits = [];
	for (let i = params.startIndex; i < params.argv.length; i += 1) {
		const token = readTrimmedArgToken(params.argv, i);
		if (!token) continue;
		if (afterDoubleDash) {
			if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
			continue;
		}
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-") return {
			hits: [],
			sawOptionValueFile: false
		};
		if (token.startsWith("-")) {
			const option = parseInlineOptionToken(token);
			const flag = option.name;
			const inlineValue = option.hasInlineValue ? option.inlineValue : void 0;
			if (params.optionsWithFileValue?.has(normalizeLowercaseStringOrEmpty(flag))) {
				if (inlineValue && resolvesToExistingFileSync(inlineValue, params.cwd)) {
					hits.push(i);
					return {
						hits,
						sawOptionValueFile: true
					};
				}
				const nextToken = readTrimmedArgToken(params.argv, i + 1);
				if (!inlineValue && nextToken && resolvesToExistingFileSync(nextToken, params.cwd)) {
					hits.push(i + 1);
					return {
						hits,
						sawOptionValueFile: true
					};
				}
			}
			continue;
		}
		if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
	}
	return {
		hits,
		sawOptionValueFile: false
	};
}
function resolveGenericInterpreterScriptOperandIndex(params) {
	const collection = collectExistingFileOperandIndexes({
		argv: params.argv,
		startIndex: 1,
		cwd: params.cwd,
		optionsWithFileValue: params.optionsWithFileValue
	});
	if (collection.sawOptionValueFile) return null;
	return collection.hits.length === 1 ? expectDefined(collection.hits[0], "hits entry at 0") : null;
}
function resolveBunScriptOperandIndex(params) {
	const directIndex = resolveOptionFilteredPositionalIndex({
		argv: params.argv,
		startIndex: 1,
		optionsWithValue: BUN_OPTIONS_WITH_VALUE
	});
	if (directIndex === null) return null;
	const directToken = readTrimmedArgToken(params.argv, directIndex);
	if (directToken === "run") return resolveOptionFilteredFileOperandIndex({
		argv: params.argv,
		startIndex: directIndex + 1,
		cwd: params.cwd,
		optionsWithValue: BUN_OPTIONS_WITH_VALUE
	});
	if (BUN_SUBCOMMANDS.has(directToken)) return null;
	if (!looksLikePathToken(directToken)) return null;
	return directIndex;
}
function resolveDenoRunScriptOperandIndex(params) {
	if (readTrimmedArgToken(params.argv, 1) !== "run") return null;
	return resolveOptionFilteredFileOperandIndex({
		argv: params.argv,
		startIndex: 2,
		cwd: params.cwd,
		optionsWithValue: DENO_RUN_OPTIONS_WITH_VALUE
	});
}
function hasRubyUnsafeApprovalFlag(argv) {
	let afterDoubleDash = false;
	for (let i = 1; i < argv.length; i += 1) {
		const token = readTrimmedArgToken(argv, i);
		if (!token) continue;
		if (afterDoubleDash) return false;
		if (token === "--") {
			afterDoubleDash = true;
			continue;
		}
		if (token === "-C" || token === "-I" || token === "-r" || token === "-S" || token === "--chdir") return true;
		if (token.startsWith("-C") || token.startsWith("-I") || token.startsWith("-r") || token.startsWith("--chdir=") || token.startsWith("--require=")) return true;
		if (RUBY_UNSAFE_APPROVAL_FLAGS.has(normalizeLowercaseStringOrEmpty(token))) return true;
	}
	return false;
}
function hasNodeFileLoadingOption(argv) {
	return argv.slice(1).some((token) => {
		const normalized = token.trim().toLowerCase();
		if (normalized === "-r" || normalized.startsWith("-r")) return true;
		return [...NODE_OPTIONS_WITH_FILE_VALUE].some((flag) => normalized === flag || normalized.startsWith(`${flag}=`));
	});
}
function isSystemRunCommandTextBoundInterpreterInvocation(argv) {
	const unwrapped = unwrapArgvForMutableOperand(argv);
	const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
	if (POSIX_SHELL_WRAPPER_SET.has(executable)) return false;
	if ((executable === "node" || executable === "nodejs") && hasNodeFileLoadingOption(unwrapped.argv)) return false;
	if (executable === "ruby" && hasRubyUnsafeApprovalFlag(unwrapped.argv) || executable === "perl" && hasPerlUnsafeApprovalFlag(unwrapped.argv)) return false;
	if (detectPolicyInlineEval([{
		raw: unwrapped.argv.join(" "),
		argv: unwrapped.argv,
		resolution: null
	}])) return true;
	return unwrapped.argv.length === 2 && [
		"--help",
		"--version",
		"-h",
		"-v"
	].includes(unwrapped.argv[1]?.trim().toLowerCase() ?? "");
}
function isMutableScriptRunner(executable) {
	return GENERIC_MUTABLE_SCRIPT_RUNNERS.has(executable) || OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable) || isInterpreterLikeSafeBin(executable);
}
function resolveDirectScriptExecutableIndex(params) {
	const unwrapped = unwrapArgvForMutableOperand(params.argv);
	const executable = readTrimmedArgToken(unwrapped.argv, 0);
	if (PACKAGE_MANAGER_EXECUTABLES.has(normalizeExecutableToken(executable)) || !looksLikeExplicitPathToken(executable) || !resolvesToExistingFileSync(executable, params.cwd)) return null;
	return pathLooksMutableForShellPayloadSync(path.resolve(params.cwd ?? process.cwd(), executable)) ? unwrapped.baseIndex : null;
}
function resolveMutableFileOperandIndex(argv, cwd) {
	const unwrapped = unwrapArgvForMutableOperand(argv);
	const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
	if (!executable) return null;
	if (unwrapped.opaqueMultiplexerSeen || OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable)) return null;
	if (POSIX_SHELL_WRAPPER_SET.has(executable)) {
		if (!POSIX_PARSEABLE_SHELL_WRAPPER_SET.has(executable)) return null;
		const shellIndex = resolvePosixShellScriptOperandIndex(unwrapped.argv, executable);
		return shellIndex === null ? null : unwrapped.baseIndex + shellIndex;
	}
	if (MUTABLE_ARGV1_INTERPRETER_PATTERNS.some((pattern) => pattern.test(executable))) {
		const operand = readTrimmedArgToken(unwrapped.argv, 1);
		if (operand && operand !== "-" && !operand.startsWith("-")) return unwrapped.baseIndex + 1;
	}
	if (executable === "bun") {
		const bunIndex = resolveBunScriptOperandIndex({
			argv: unwrapped.argv,
			cwd
		});
		if (bunIndex !== null) return unwrapped.baseIndex + bunIndex;
	}
	if (executable === "deno") {
		const denoIndex = resolveDenoRunScriptOperandIndex({
			argv: unwrapped.argv,
			cwd
		});
		if (denoIndex !== null) return unwrapped.baseIndex + denoIndex;
	}
	if (executable === "ruby" && hasRubyUnsafeApprovalFlag(unwrapped.argv)) return null;
	if (executable === "perl" && hasPerlUnsafeApprovalFlag(unwrapped.argv)) return null;
	if (!isMutableScriptRunner(executable)) return resolveDirectScriptExecutableIndex({
		argv,
		cwd
	});
	const genericIndex = resolveGenericInterpreterScriptOperandIndex({
		argv: unwrapped.argv,
		cwd,
		optionsWithFileValue: executable === "node" || executable === "nodejs" ? NODE_OPTIONS_WITH_FILE_VALUE : void 0
	});
	return genericIndex === null ? null : unwrapped.baseIndex + genericIndex;
}
function shellPayloadNeedsStableBinding(shellCommand, cwd) {
	if (/[;&|<>]/u.test(shellCommand)) return true;
	const argv = splitShellArgs(shellCommand);
	if (!argv || argv.length === 0) return false;
	if (resolveMutableFileOperandIndex(argv, cwd) !== null || requiresStableInterpreterApprovalBindingWithShellCommand({
		argv,
		cwd,
		shellCommand: null
	})) return true;
	const firstToken = readTrimmedArgToken(argv, 0);
	if (firstToken === "." || firstToken === "source") return true;
	if (!resolvesToExistingFileSync(firstToken, cwd)) return false;
	if (!path.isAbsolute(firstToken)) return true;
	const resolvedPath = path.resolve(cwd ?? process.cwd(), firstToken);
	if (pathLooksMutableForShellPayloadSync(resolvedPath)) return true;
	return isLikelyScriptLikePathSync(resolvedPath);
}
function requiresStableInterpreterApprovalBindingWithShellCommand(params) {
	const unwrapped = unwrapArgvForMutableOperand(params.argv);
	if (unwrapped.opaqueMultiplexerSeen) return true;
	if (params.shellCommand !== null) return shellPayloadNeedsStableBinding(params.shellCommand, params.cwd);
	if (pnpmDlxInvocationNeedsFailClosedBinding(params.argv, params.cwd)) return true;
	const directExecutable = readTrimmedArgToken(unwrapped.argv, 0);
	if (looksLikeExplicitPathToken(directExecutable) && !resolvesToExistingFileSync(directExecutable, params.cwd)) return true;
	const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
	return Boolean(executable) && !POSIX_SHELL_WRAPPER_SET.has(executable) && isMutableScriptRunner(executable);
}
function pnpmDlxInvocationNeedsFailClosedBinding(argv, cwd) {
	if (normalizePackageManagerExecToken(argv[0] ?? "") !== "pnpm") return false;
	let idx = 1;
	while (idx < argv.length) {
		const token = readTrimmedArgToken(argv, idx);
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") {
			idx += 1;
			continue;
		}
		if (!token.startsWith("-")) {
			if (token !== "dlx") return false;
			return pnpmDlxTailNeedsFailClosedBinding(argv.slice(idx + 1), cwd);
		}
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_FLAG_OPTIONS.has(flag)) {
			idx += 1;
			continue;
		}
		return true;
	}
	return false;
}
function pnpmDlxTailNeedsFailClosedBinding(argv, cwd) {
	let idx = 0;
	while (idx < argv.length) {
		const token = readTrimmedArgToken(argv, idx);
		if (!token) {
			idx += 1;
			continue;
		}
		if (token === "--") return pnpmDlxTailMayNeedStableBinding(argv.slice(idx + 1), cwd);
		if (!token.startsWith("-")) return pnpmDlxTailMayNeedStableBinding(argv.slice(idx), cwd);
		const parsedOption = parseInlineOptionToken(token);
		const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
		if (flag === "-c" || flag === "--shell-mode") return false;
		if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
			idx += token.includes("=") ? 1 : 2;
			continue;
		}
		if (PNPM_FLAG_OPTIONS.has(flag)) {
			idx += 1;
			continue;
		}
		return true;
	}
	return true;
}
function pnpmDlxTailMayNeedStableBinding(argv, cwd) {
	return resolveMutableFileOperandIndex(argv, cwd) !== null;
}
function resolveSystemRunMutableFileOperandTarget(params) {
	if (hasDispatchCwdOption(params.argv)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind dispatch cwd options"
	};
	const unwrapped = unwrapArgvForMutableOperand(params.argv);
	if (hasPosixShellCodeLoadingOption(unwrapped.argv, normalizeExecutableToken(unwrapped.argv[0] ?? ""))) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell startup files"
	};
	if (hasPosixShellStartupEnvironment({
		argv: params.argv,
		executable: normalizeExecutableToken(unwrapped.argv[0] ?? ""),
		env: process.env
	})) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell startup environment"
	};
	if (hasUnbindableRuntimeApprovalOption({
		argv: unwrapped.argv,
		executable: normalizeExecutableToken(unwrapped.argv[0] ?? "")
	})) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind runtime code-loading or cwd options"
	};
	const argvIndex = resolveMutableFileOperandIndex(params.argv, params.cwd);
	if (argvIndex === null) {
		if (requiresStableInterpreterApprovalBindingWithShellCommand({
			argv: params.argv,
			shellCommand: params.shellCommand,
			cwd: params.cwd
		})) return {
			ok: false,
			reason: "unsupported-command-shape",
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command"
		};
		return {
			ok: true,
			argvIndex: null
		};
	}
	if (!readTrimmedArgToken(params.argv, argvIndex)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a stable script operand"
	};
	return {
		ok: true,
		argvIndex
	};
}
//#endregion
//#region src/infra/system-run-normalize.ts
/** Normalizes unknown system-run metadata to a trimmed non-empty string. */
function normalizeNonEmptyString(value) {
	return typeof value === "string" ? normalizeOptionalString(value) ?? null : null;
}
/** Coerces array entries to allow-list strings while rejecting non-array inputs. */
function normalizeStringArray(value) {
	return Array.isArray(value) ? mapAllowFromEntries(value) : [];
}
//#endregion
//#region src/infra/system-run-approval-binding.ts
const APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval script operand changed before execution";
function normalizeSystemRunEnvEntries(env) {
	if (!env || typeof env !== "object" || Array.isArray(env)) return [];
	const entries = [];
	for (const [rawKey, rawValue] of Object.entries(env)) {
		if (typeof rawValue !== "string") continue;
		const key = normalizeHostOverrideEnvVarKey(rawKey);
		if (!key) continue;
		entries.push([key, rawValue]);
	}
	entries.sort((a, b) => a[0].localeCompare(b[0]));
	return entries;
}
function hashSystemRunEnvEntries(entries) {
	if (entries.length === 0) return null;
	return sha256Hex(JSON.stringify(entries));
}
function buildSystemRunApprovalEnvBinding(env) {
	const entries = normalizeSystemRunEnvEntries(env);
	return {
		envHash: hashSystemRunEnvEntries(entries),
		envKeys: entries.map(([key]) => key)
	};
}
function buildSystemRunApprovalBinding(params) {
	const envBinding = buildSystemRunApprovalEnvBinding(params.env);
	return {
		binding: {
			argv: normalizeStringArray(params.argv),
			cwd: normalizeNonEmptyString(params.cwd),
			agentId: normalizeNonEmptyString(params.agentId),
			sessionKey: normalizeNonEmptyString(params.sessionKey),
			envHash: envBinding.envHash
		},
		envKeys: envBinding.envKeys
	};
}
function argvMatches(expectedArgv, actualArgv) {
	if (expectedArgv.length === 0 || expectedArgv.length !== actualArgv.length) return false;
	for (let i = 0; i < expectedArgv.length; i += 1) if (expectedArgv[i] !== actualArgv[i]) return false;
	return true;
}
const APPROVAL_REQUEST_MISMATCH_MESSAGE = "approval id does not match request";
function requestMismatch(details) {
	return {
		ok: false,
		code: "APPROVAL_REQUEST_MISMATCH",
		message: APPROVAL_REQUEST_MISMATCH_MESSAGE,
		details
	};
}
function matchSystemRunApprovalEnvHash(params) {
	if (!params.expectedEnvHash && !params.actualEnvHash && params.actualEnvKeys.length > 0) return {
		ok: false,
		code: "APPROVAL_ENV_BINDING_MISSING",
		message: "approval id missing env binding for requested env overrides",
		details: { envKeys: params.actualEnvKeys }
	};
	if (!params.expectedEnvHash && !params.actualEnvHash) return { ok: true };
	if (!params.expectedEnvHash && params.actualEnvHash) return {
		ok: false,
		code: "APPROVAL_ENV_BINDING_MISSING",
		message: "approval id missing env binding for requested env overrides",
		details: { envKeys: params.actualEnvKeys }
	};
	if (params.expectedEnvHash !== params.actualEnvHash) return {
		ok: false,
		code: "APPROVAL_ENV_MISMATCH",
		message: "approval id env binding mismatch",
		details: {
			envKeys: params.actualEnvKeys,
			expectedEnvHash: params.expectedEnvHash,
			actualEnvHash: params.actualEnvHash
		}
	};
	return { ok: true };
}
function matchSystemRunApprovalBinding(params) {
	if (!argvMatches(params.expected.argv, params.actual.argv)) return requestMismatch();
	if (params.expected.cwd !== params.actual.cwd) return requestMismatch();
	if (params.expected.agentId !== params.actual.agentId) return requestMismatch();
	if (params.expected.sessionKey !== params.actual.sessionKey) return requestMismatch();
	return matchSystemRunApprovalEnvHash({
		expectedEnvHash: params.expected.envHash,
		actualEnvHash: params.actual.envHash,
		actualEnvKeys: params.actualEnvKeys
	});
}
function missingSystemRunApprovalBinding(params) {
	return requestMismatch({ envKeys: params.actualEnvKeys });
}
function toSystemRunApprovalMismatchError(params) {
	const details = {
		code: params.match.code,
		runId: params.runId
	};
	if (params.match.details) Object.assign(details, params.match.details);
	return {
		ok: false,
		message: params.match.message,
		details
	};
}
/** Captures file identity for a mutable script operand that approval is bound to. */
function resolveMutableFileOperandSnapshotSync(params) {
	const target = resolveSystemRunMutableFileOperandTarget(params);
	if (!target.ok) return target;
	if (target.argvIndex === null) return {
		ok: true,
		snapshot: null
	};
	const operand = params.argv[target.argvIndex]?.trim();
	if (!operand) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a stable script operand"
	};
	return snapshotFileOperandAtPath({
		argvIndex: target.argvIndex,
		filePath: path.resolve(params.cwd ?? process.cwd(), operand)
	});
}
const SHELL_CWD_MUTATORS = /* @__PURE__ */ new Set([
	"cd",
	"chdir",
	"popd",
	"pushd"
]);
const SHELL_BUILTIN_DISPATCHERS = /* @__PURE__ */ new Set(["builtin", "command"]);
function prepareMutableFileBindingsForArgv(params) {
	const operands = [];
	const commands = [];
	const seen = /* @__PURE__ */ new Set();
	for (const argv of params.commands) {
		const key = JSON.stringify(argv);
		if (seen.has(key)) continue;
		seen.add(key);
		commands.push([...argv]);
		const prepared = resolveMutableFileOperandSnapshotSync({
			argv,
			cwd: params.cwd,
			shellCommand: extractShellCommandFromArgv(argv)
		});
		if (!prepared.ok) {
			if (prepared.reason === "unsupported-command-shape" && isSystemRunCommandTextBoundInterpreterInvocation(argv)) continue;
			return prepared;
		}
		if (prepared.snapshot) operands.push({
			kind: "mutable",
			argv: [...argv],
			snapshot: prepared.snapshot
		});
	}
	return {
		ok: true,
		binding: {
			commands,
			operands
		}
	};
}
function prepareMutableFileBindingsForSegments(params) {
	if (params.segments.length === 0) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind this command"
	};
	const ordinaryCommands = [];
	for (const [index, segment] of params.segments.entries()) {
		const effectiveArgv = unwrapSystemRunMutableFileOperandArgv(segment.argv);
		const executable = effectiveArgv[SHELL_BUILTIN_DISPATCHERS.has(effectiveArgv[0]?.trim() ?? "") ? 1 : 0]?.trim() ?? "";
		if (hasPosixShellStartupEnvironment({
			argv: segment.argv,
			executable,
			env: params.env
		})) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell startup environment"
		};
		if (executable && (executable === "." || executable === "source")) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell source operands"
		};
		if (SHELL_CWD_MUTATORS.has(executable) && index < params.segments.length - 1) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind commands after cwd changes"
		};
		const resolvedExecutable = segment.resolution?.execution.resolvedRealPath ?? segment.resolution?.execution.resolvedPath;
		if (executable && !looksLikeExplicitPathToken(executable) && segment.resolution && !resolvedExecutable) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval requires a resolved executable"
		};
		ordinaryCommands.push(segment.argv);
	}
	const ordinary = prepareMutableFileBindingsForArgv({
		commands: ordinaryCommands,
		cwd: params.cwd
	});
	if (!ordinary.ok) return ordinary;
	const executables = prepareSystemRunExecutableIdentityBinding({
		...params,
		shellCommand: true
	});
	if (!executables.ok) return executables;
	return {
		ok: true,
		binding: {
			commands: ordinary.binding.commands,
			operands: [...ordinary.binding.operands, ...executables.binding.operands]
		}
	};
}
/** In-memory executable identities; wire approval plans retain their script snapshot shape. */
function prepareSystemRunExecutableIdentityBinding(params) {
	const operands = [];
	for (const segment of params.segments) {
		const executions = [];
		const plan = resolveExecWrapperTrustPlan(segment.sourceArgv ?? segment.argv);
		let shellCommandPosition = params.shellCommand;
		for (const { wrapper, sourceArgv } of plan.wrapperInvocations) {
			if (shellCommandPosition && (wrapper === "builtin" || wrapper === "command" || wrapper === "exec")) {
				if (wrapper === "exec") shellCommandPosition = false;
				continue;
			}
			shellCommandPosition = false;
			const argv = sourceArgv.slice(0, 1);
			const execution = resolveCommandResolutionFromArgv(argv, params.cwd, params.env, process.platform, { useCache: false })?.execution;
			if (!execution?.resolvedRealPath && !execution?.resolvedPath) return {
				ok: false,
				message: "SYSTEM_RUN_DENIED: approval requires a resolved executable"
			};
			executions.push({
				argv,
				execution
			});
		}
		executions.push({
			argv: segment.argv,
			execution: segment.resolution?.execution
		});
		for (const { argv, execution } of executions) {
			const resolvedExecutable = execution?.resolvedRealPath ?? execution?.resolvedPath;
			if (!execution || !resolvedExecutable) continue;
			const invocationPath = path.resolve(params.cwd ?? process.cwd(), execution.resolvedPath ?? resolvedExecutable);
			let realPath;
			try {
				realPath = fs.realpathSync(resolvedExecutable);
			} catch {
				return {
					ok: false,
					message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
				};
			}
			const pathSearch = !looksLikeExplicitPathToken(execution.rawExecutable) ? {
				path: resolveEnvironmentValue(params.env, "PATH") ?? resolveEnvironmentValue(process.env, "PATH") ?? "",
				pathExt: resolveEnvironmentValue(params.env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? ".EXE;.CMD;.BAT;.COM"
			} : void 0;
			if (pathLooksMutableForShellPayloadSync(resolvedExecutable)) {
				const snapshot = snapshotFileOperandAtPath({
					argvIndex: 0,
					filePath: realPath
				});
				if (!snapshot.ok) return snapshot;
				operands.push({
					kind: "mutable",
					argv: [...argv],
					snapshot: snapshot.snapshot,
					executable: true,
					invocationPath,
					pathSearch
				});
			} else operands.push({
				kind: "identity",
				argv: [...argv],
				snapshot: {
					argvIndex: 0,
					path: realPath
				},
				executable: true,
				invocationPath,
				pathSearch
			});
		}
	}
	return {
		ok: true,
		binding: {
			commands: [],
			operands
		}
	};
}
/** Captures executable identities and mutable file bytes an approval would release. */
async function prepareSystemRunMutableFileBinding(params) {
	if (params.command.kind === "argv") {
		const prepared = resolveMutableFileOperandSnapshotSync({
			argv: params.command.argv,
			cwd: params.cwd,
			shellCommand: params.command.shellCommand ?? extractShellCommandFromArgv(params.command.argv)
		});
		if (!prepared.ok) return prepared;
		return {
			ok: true,
			binding: {
				commands: [[...params.command.argv]],
				operands: prepared.snapshot ? [{
					kind: "mutable",
					argv: [...params.command.argv],
					snapshot: prepared.snapshot
				}] : []
			}
		};
	}
	if (params.command.kind === "segments") return prepareMutableFileBindingsForSegments({
		segments: params.command.segments,
		cwd: params.cwd,
		env: params.env
	});
	const commandText = params.command.text.trim();
	if (!commandText) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a command binding"
	};
	if (params.env?.BASH_ENV?.trim() || params.env?.ENV?.trim()) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell startup environment"
	};
	if ((params.platform ?? process.platform) === "win32") {
		const analysis = analyzeWindowsShellCommand({
			command: commandText,
			cwd: params.cwd,
			env: params.env,
			platform: "win32"
		});
		if (!analysis.ok || analysis.segments.length === 0) return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: approval cannot safely bind this command"
		};
		return prepareMutableFileBindingsForSegments({
			segments: analysis.segments,
			cwd: params.cwd,
			env: params.env
		});
	}
	const plan = await planShellAuthorization({
		command: commandText,
		cwd: params.cwd,
		env: params.env,
		platform: params.platform
	});
	if (!plan.ok) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind this command"
	};
	if (plan.groups.some((group) => group.candidates.length > 1)) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind shell pipelines"
	};
	return prepareMutableFileBindingsForSegments({
		segments: plan.groups.flatMap((group) => group.candidates.map((candidate) => candidate.sourceSegment)),
		cwd: params.cwd,
		env: params.env
	});
}
/** Revalidates approved executable identities and bytes after awaited approval work. */
async function revalidateSystemRunMutableFileBinding(params) {
	const current = prepareMutableFileBindingsForArgv({
		commands: params.binding.commands,
		cwd: params.cwd
	});
	if (!current.ok) return {
		ok: false,
		message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
	};
	const signature = (binding) => binding.operands.filter((operand) => !operand.executable).map(({ argv, snapshot }) => JSON.stringify([
		argv,
		snapshot.argvIndex,
		snapshot.path,
		snapshot.sha256
	])).toSorted();
	const expected = signature(params.binding);
	const actual = signature(current.binding);
	if (expected.length !== actual.length || expected.some((value, index) => value !== actual[index])) return {
		ok: false,
		message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
	};
	for (const operand of params.binding.operands) {
		if (!operand.executable) continue;
		const env = operand.pathSearch ? {
			...process.env,
			...operand.pathSearch.path !== void 0 ? { PATH: operand.pathSearch.path } : {},
			...operand.pathSearch.pathExt !== void 0 ? { PATHEXT: operand.pathSearch.pathExt } : {}
		} : void 0;
		const resolution = resolveCommandResolutionFromArgv(operand.argv, params.cwd, env, process.platform, { useCache: false });
		const resolvedPath = resolution?.execution.resolvedRealPath ?? resolution?.execution.resolvedPath;
		if (!resolvedPath || resolvedPath !== operand.snapshot.path || path.resolve(params.cwd ?? process.cwd(), resolution?.execution.resolvedPath ?? resolvedPath) !== operand.invocationPath) return {
			ok: false,
			message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
		};
		if (operand.kind === "mutable") {
			const snapshot = snapshotFileOperandAtPath({
				argvIndex: 0,
				filePath: resolvedPath
			});
			if (!snapshot.ok || snapshot.snapshot.sha256 !== operand.snapshot.sha256) return {
				ok: false,
				message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
			};
		}
	}
	return { ok: true };
}
/** Prepares an opaque revalidator so callers cannot replace the approved snapshot. */
async function prepareSystemRunMutableFileApproval(params) {
	const prepared = await prepareSystemRunMutableFileBinding({
		command: {
			kind: "shell",
			text: params.command
		},
		cwd: params.cwd
	});
	if (!prepared.ok) return {
		ok: false,
		message: prepared.message
	};
	const binding = prepared.binding;
	return {
		ok: true,
		requiresOneShot: binding.operands.some((operand) => operand.kind === "mutable"),
		revalidate: async () => await revalidateSystemRunMutableFileBinding({
			binding,
			cwd: params.cwd
		})
	};
}
//#endregion
export { formatExecCommand as _, missingSystemRunApprovalBinding as a, prepareSystemRunMutableFileBinding as c, toSystemRunApprovalMismatchError as d, normalizeNonEmptyString as f, extractShellCommandFromArgv as g, revalidateApprovedMutableFileOperand as h, matchSystemRunApprovalBinding as i, resolveMutableFileOperandSnapshotSync as l, hasMutableSymlinkPathComponentSync as m, buildSystemRunApprovalBinding as n, prepareSystemRunExecutableIdentityBinding as o, normalizeStringArray as p, buildSystemRunApprovalEnvBinding as r, prepareSystemRunMutableFileApproval as s, APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE as t, revalidateSystemRunMutableFileBinding as u, resolveSystemRunCommandRequest as v };
