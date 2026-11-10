import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { v as sortUniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { a as hasFishInitCommandOption, c as hasPowerShellProfileStartupBeforeInlineCommand, d as isPowerShellInlineFileCommandFlag, i as hasFishAttachedCommandOption, m as resolvePowerShellInlineCommandMatch, n as POSIX_INLINE_COMMAND_FLAGS, o as hasPosixInteractiveStartupBeforeInlineCommand, p as resolveInlineCommandMatch, s as hasPosixLoginStartupBeforeInlineCommand, t as NUSHELL_INLINE_COMMAND_FLAGS, u as isPowerShellInlineEncodedCommandFlag } from "./shell-inline-command-DKNYBguD.mjs";
import { r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import path from "node:path";
//#region src/infra/exec-wrapper-tokens.ts
/** Normalize the shorter POSIX/Windows basename, removing native executable suffixes. */
function normalizeExecutableToken(token) {
	const win = path.win32.basename(token);
	const posix = path.posix.basename(token);
	const base = win.length < posix.length ? win : posix;
	return normalizeLowercaseStringOrEmpty(base).replace(/\.(?:exe|cmd|bat|com)$/, "");
}
//#endregion
//#region src/infra/command-carriers.ts
const COMMAND_CARRIER_EXECUTABLES = /* @__PURE__ */ new Set([
	"sudo",
	"doas",
	"env",
	"command",
	"builtin"
]);
const SOURCE_EXECUTABLES = /* @__PURE__ */ new Set([".", "source"]);
const MAX_ENV_SPLIT_PAYLOAD_DEPTH = 32;
const COMMAND_EXECUTING_OPTIONS = /* @__PURE__ */ new Set(["-p"]);
const ENV_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-C",
	"-P",
	"-S",
	"-s",
	"-u",
	"--argv0",
	"--block-signal",
	"--chdir",
	"--default-signal",
	"--ignore-signal",
	"--split-string",
	"--unset"
]);
const ENV_SPLIT_STRING_OPTIONS = /* @__PURE__ */ new Set([
	"-S",
	"-s",
	"--split-string"
]);
const ENV_STANDALONE_OPTIONS = /* @__PURE__ */ new Set([
	"-0",
	"-i",
	"--ignore-environment",
	"--null"
]);
const SUDO_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-C",
	"-D",
	"-g",
	"-h",
	"-p",
	"-R",
	"-T",
	"-U",
	"-u",
	"--chdir",
	"--chroot",
	"--close-from",
	"--command-timeout",
	"--group",
	"--host",
	"--other-user",
	"--prompt",
	"--role",
	"--type",
	"--user"
]);
const SUDO_STANDALONE_OPTIONS = /* @__PURE__ */ new Set([
	"-A",
	"-B",
	"-b",
	"-E",
	"-H",
	"-i",
	"-k",
	"-N",
	"-n",
	"-P",
	"-S",
	"-s",
	"--askpass",
	"--background",
	"--bell",
	"--login",
	"--no-update",
	"--non-interactive",
	"--preserve-env",
	"--preserve-groups",
	"--reset-home",
	"--reset-timestamp",
	"--set-home",
	"--shell",
	"--stdin"
]);
const SUDO_NON_EXEC_OPTIONS = /* @__PURE__ */ new Set([
	"-K",
	"-l",
	"-V",
	"-v",
	"-e",
	"--edit",
	"--help",
	"--list",
	"--remove-timestamp",
	"--validate",
	"--version"
]);
const DOAS_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-a",
	"-C",
	"-u"
]);
const DOAS_STANDALONE_OPTIONS = /* @__PURE__ */ new Set([
	"-L",
	"-n",
	"-s"
]);
const EXEC_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-a"]);
const EXEC_STANDALONE_OPTIONS = /* @__PURE__ */ new Set(["-c", "-l"]);
function isEnvAssignmentToken(token) {
	return /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(token);
}
function parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
	if (token.startsWith("--")) {
		const option = parseInlineOptionToken(token);
		const name = option.name;
		if (nonExecutingOptions.has(name)) return null;
		if (standaloneOptions.has(name) || optionsWithValue.has(name)) return [option];
		return null;
	}
	if (!/^-[A-Za-z0-9]/u.test(token)) return null;
	const options = [];
	for (let index = 1; index < token.length; index += 1) {
		const name = `-${token[index] ?? ""}`;
		if (nonExecutingOptions.has(name)) return null;
		if (optionsWithValue.has(name)) {
			options.push({
				name,
				hasInlineValue: index < token.length - 1,
				inlineValue: index < token.length - 1 ? token.slice(index + 1) : void 0
			});
			return options;
		}
		if (standaloneOptions.has(name)) {
			options.push({
				name,
				hasInlineValue: false
			});
			continue;
		}
		return null;
	}
	return options.length > 0 ? options : null;
}
function resolveEnvSplitPayload(payload, trailingArgv, depth) {
	const innerArgv = splitShellArgs(payload);
	if (!innerArgv || innerArgv.length === 0) return null;
	const carriedArgv = [...innerArgv, ...trailingArgv];
	return resolveEnvCarriedArgv(["env", ...carriedArgv], depth + 1) ?? carriedArgv;
}
/** Parse the option and assignment prelude of an `env` invocation. */
function parseEnvInvocationPrelude(argv, depth = 0) {
	if (depth > MAX_ENV_SPLIT_PAYLOAD_DEPTH || normalizeExecutableToken(argv[0] ?? "") !== "env") return null;
	let usesModifiers = false;
	const assignmentKeys = [];
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (!token) return null;
		if (isEnvAssignmentToken(token)) {
			usesModifiers = true;
			assignmentKeys.push(token.slice(0, token.indexOf("=")));
			continue;
		}
		if (token === "--" || token === "-") return index + 1 < argv.length ? {
			assignmentKeys,
			commandIndex: index + 1,
			usesModifiers
		} : null;
		if (token.startsWith("-")) {
			const option = parseCarrierOptionToken(token, ENV_STANDALONE_OPTIONS, ENV_OPTIONS_WITH_VALUE);
			if (!option) return null;
			usesModifiers = true;
			const splitStringOption = option.find((entry) => ENV_SPLIT_STRING_OPTIONS.has(entry.name));
			if (splitStringOption) {
				const payloadIndex = splitStringOption.inlineValue === void 0 ? index + 1 : index;
				const payload = splitStringOption.inlineValue ?? argv[payloadIndex];
				const trailingIndex = payloadIndex + 1;
				const splitArgv = typeof payload === "string" ? resolveEnvSplitPayload(payload, argv.slice(trailingIndex), depth) : null;
				return splitArgv ? {
					assignmentKeys,
					commandIndex: trailingIndex,
					splitArgv,
					usesModifiers
				} : null;
			}
			if (option.some((entry) => ENV_OPTIONS_WITH_VALUE.has(entry.name) && !entry.hasInlineValue)) index += 1;
			continue;
		}
		return {
			assignmentKeys,
			commandIndex: index,
			usesModifiers
		};
	}
	return null;
}
function envInvocationUsesModifiers(argv) {
	return parseEnvInvocationPrelude(argv)?.usesModifiers ?? normalizeExecutableToken(argv[0] ?? "") === "env";
}
/** Return the argv carried by `env`, including argv reconstructed from `env -S`. */
function unwrapEnvInvocation(argv) {
	return resolveEnvCarriedArgv(argv);
}
/** Resolve the command argv behind an `env` carrier, honoring bounded `env -S` recursion. */
function resolveEnvCarriedArgv(argv, depth = 0) {
	const parsed = parseEnvInvocationPrelude(argv, depth);
	return parsed ? parsed.splitArgv ?? argv.slice(parsed.commandIndex) : null;
}
function resolveCommandBuiltinCarriedArgv(argv) {
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--") return argv.slice(index + 1);
		if (!token.startsWith("-")) return argv.slice(index);
		const normalized = parseInlineOptionToken(token).name;
		if (!COMMAND_EXECUTING_OPTIONS.has(normalized)) return null;
	}
	return null;
}
function resolveOptionCarrierArgv(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	const profile = executable === "sudo" ? [
		SUDO_STANDALONE_OPTIONS,
		SUDO_OPTIONS_WITH_VALUE,
		SUDO_NON_EXEC_OPTIONS
	] : executable === "doas" ? [DOAS_STANDALONE_OPTIONS, DOAS_OPTIONS_WITH_VALUE] : executable === "exec" ? [EXEC_STANDALONE_OPTIONS, EXEC_OPTIONS_WITH_VALUE] : null;
	if (!profile) return null;
	const [standaloneOptions, optionsWithValue, nonExecutingOptions] = profile;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--" || !token.startsWith("-")) {
			const commandArgv = argv.slice(token === "--" ? index + 1 : index);
			if (executable !== "sudo") return executable === "exec" || commandArgv.length > 0 ? commandArgv : null;
			let assignmentIndex = 0;
			while (assignmentIndex < commandArgv.length && isEnvAssignmentToken(commandArgv[assignmentIndex] ?? "")) assignmentIndex += 1;
			return assignmentIndex < commandArgv.length ? commandArgv.slice(assignmentIndex) : null;
		}
		const option = parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, nonExecutingOptions);
		if (!option) return null;
		if (option.some((entry) => optionsWithValue.has(entry.name) && !entry.hasInlineValue)) index += 1;
	}
	return null;
}
function resolveCarrierCommandArgv(argv, depth = 0, options) {
	switch (normalizeExecutableToken(argv[0] ?? "")) {
		case "env": return resolveEnvCarriedArgv(argv, depth);
		case "command":
		case "builtin": return resolveCommandBuiltinCarriedArgv(argv);
		case "sudo":
		case "doas": return resolveOptionCarrierArgv(argv);
		case "exec": return options?.includeExec ? resolveOptionCarrierArgv(argv) : null;
		default: return null;
	}
}
const NICE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-n",
	"--adjustment",
	"--priority"
]);
const CAFFEINATE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-t", "-w"]);
const CAFFEINATE_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"-d",
	"-i",
	"-m",
	"-s",
	"-u"
]);
const STDBUF_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-i",
	"--input",
	"-o",
	"--output",
	"-e",
	"--error"
]);
const FLOCK_SHORT_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"-e",
	"-F",
	"-n",
	"-o",
	"-s",
	"-x"
]);
const FLOCK_LONG_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"--close",
	"--exclusive",
	"--nb",
	"--no-fork",
	"--nonblock",
	"--shared",
	"--verbose"
]);
const FLOCK_SHORT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-E", "-w"]);
const FLOCK_LONG_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--conflict-exit-code",
	"--timeout",
	"--wait"
]);
const TIME_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"-a",
	"--append",
	"-h",
	"--help",
	"-l",
	"-p",
	"-q",
	"--quiet",
	"-v",
	"--verbose",
	"-V",
	"--version"
]);
const TIME_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-f",
	"--format",
	"-o",
	"--output"
]);
const BSD_SCRIPT_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"-a",
	"-d",
	"-k",
	"-p",
	"-q",
	"-r"
]);
const BSD_SCRIPT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-F", "-t"]);
const SANDBOX_EXEC_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-f",
	"-p",
	"-d"
]);
const TIMEOUT_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"--foreground",
	"--preserve-status",
	"-v",
	"--verbose"
]);
const TIMEOUT_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-k",
	"--kill-after",
	"-s",
	"--signal"
]);
const XCRUN_FLAG_OPTIONS = /* @__PURE__ */ new Set([
	"-k",
	"--kill-cache",
	"-l",
	"--log",
	"-n",
	"--no-cache",
	"-r",
	"--run",
	"-v",
	"--verbose"
]);
function isKnownArchSelectorToken(token) {
	return token === "-arm64" || token === "-arm64e" || token === "-i386" || token === "-x86_64" || token === "-x86_64h";
}
function scanWrapperInvocation(argv, params) {
	let idx = 1;
	let expectsOptionValue = false;
	while (idx < argv.length) {
		const token = argv[idx]?.trim() ?? "";
		if (!token) {
			idx += 1;
			continue;
		}
		if (expectsOptionValue) {
			expectsOptionValue = false;
			idx += 1;
			continue;
		}
		if (params.separators?.has(token)) {
			idx += 1;
			break;
		}
		const directive = params.onToken(token, normalizeLowercaseStringOrEmpty(token));
		if (directive === "stop") break;
		if (directive === "invalid") return null;
		if (directive === "consume-next") expectsOptionValue = true;
		idx += 1;
	}
	if (expectsOptionValue) return null;
	const commandIndex = params.adjustCommandIndex ? params.adjustCommandIndex(idx, argv) : idx;
	if (commandIndex === null || commandIndex >= argv.length) return null;
	return argv.slice(commandIndex);
}
function extractEnvAssignmentKeysFromDispatchWrappers(argv, maxDepth = 4) {
	let current = argv;
	const assignmentKeys = [];
	for (let depth = 0; depth < maxDepth; depth += 1) {
		const unwrap = unwrapKnownDispatchWrapperInvocation(current);
		if (unwrap.kind !== "unwrapped" || unwrap.argv.length === 0) break;
		if (unwrap.wrapper === "env") {
			const parsed = parseEnvInvocationPrelude(current);
			if (parsed) assignmentKeys.push(...parsed.assignmentKeys);
		}
		current = unwrap.argv;
	}
	return sortUniqueStrings(assignmentKeys);
}
function unwrapDashOptionInvocation(argv, params) {
	return scanWrapperInvocation(argv, {
		separators: params.allowDoubleDash === false ? void 0 : /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			const comparableToken = params.caseSensitive ? token : lower;
			const { name: flag } = parseInlineOptionToken(comparableToken);
			if (params.onFlag) return params.onFlag(flag, comparableToken);
			if (params.flagOptions?.has(flag)) return "continue";
			if (params.optionsWithValue?.has(flag)) return comparableToken.includes("=") ? "continue" : "consume-next";
			return "invalid";
		},
		adjustCommandIndex: params.adjustCommandIndex
	});
}
function unwrapNiceInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (flag, lower) => {
		if (/^-\d+$/.test(lower)) return "continue";
		if (NICE_OPTIONS_WITH_VALUE.has(flag)) return lower.includes("=") || lower !== flag ? "continue" : "consume-next";
		if (lower.startsWith("-n") && lower.length > 2) return "continue";
		return "invalid";
	} });
}
function unwrapNohupInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (_flag, token) => token === "--help" || token === "--version" ? "continue" : "invalid" });
}
function isFlockShortFlagCluster(token) {
	return /^-[eFnsxo]+$/.test(token);
}
function unwrapFlockInvocation(argv) {
	return unwrapDashOptionInvocation(argv, {
		caseSensitive: true,
		onFlag: (flag, token) => {
			const lowerFlag = flag.toLowerCase();
			if (FLOCK_LONG_FLAG_OPTIONS.has(lowerFlag) || isFlockShortFlagCluster(token) || FLOCK_SHORT_FLAG_OPTIONS.has(flag)) return "continue";
			if (FLOCK_LONG_OPTIONS_WITH_VALUE.has(lowerFlag) || FLOCK_SHORT_OPTIONS_WITH_VALUE.has(flag)) return token.includes("=") ? "continue" : "consume-next";
			return "invalid";
		},
		adjustCommandIndex: (commandIndex, currentArgv) => {
			const wrappedCommandIndex = commandIndex + 1;
			const wrappedCommand = currentArgv[wrappedCommandIndex]?.trim() ?? "";
			return wrappedCommand && (!wrappedCommand.startsWith("-") || wrappedCommand === "-") ? wrappedCommandIndex : null;
		}
	});
}
function timeInvocationWritesOutputFile(argv) {
	let expectsOptionValue = false;
	for (let idx = 1; idx < argv.length; idx += 1) {
		const token = argv[idx]?.trim() ?? "";
		if (!token) continue;
		if (expectsOptionValue) {
			expectsOptionValue = false;
			continue;
		}
		if (token === "--") return false;
		if (!token.startsWith("-") || token === "-") return false;
		const lower = normalizeLowercaseStringOrEmpty(token);
		const { name: flag } = parseInlineOptionToken(lower);
		if (flag === "-o" || flag === "--output") return true;
		if (TIME_OPTIONS_WITH_VALUE.has(flag) && !lower.includes("=")) expectsOptionValue = true;
	}
	return false;
}
function unwrapScriptInvocation(argv, platform = process.platform) {
	if (platform !== "darwin" && platform !== "freebsd") return null;
	return unwrapDashOptionInvocation(argv, {
		caseSensitive: true,
		optionsWithValue: BSD_SCRIPT_OPTIONS_WITH_VALUE,
		flagOptions: BSD_SCRIPT_FLAG_OPTIONS,
		adjustCommandIndex: (commandIndex, currentArgv) => {
			let sawTranscript = false;
			for (let idx = commandIndex; idx < currentArgv.length; idx += 1) {
				if (!(currentArgv[idx]?.trim() ?? "")) continue;
				if (!sawTranscript) {
					sawTranscript = true;
					continue;
				}
				return idx;
			}
			return null;
		}
	});
}
function unwrapTimeoutInvocation(argv) {
	return unwrapDashOptionInvocation(argv, {
		flagOptions: TIMEOUT_FLAG_OPTIONS,
		optionsWithValue: TIMEOUT_OPTIONS_WITH_VALUE,
		adjustCommandIndex: (commandIndex, currentArgv) => {
			const wrappedCommandIndex = commandIndex + 1;
			return wrappedCommandIndex < currentArgv.length ? wrappedCommandIndex : null;
		}
	});
}
function unwrapArchInvocation(argv) {
	let expectsArchName = false;
	return scanWrapperInvocation(argv, { onToken: (token, lower) => {
		if (expectsArchName) {
			expectsArchName = false;
			return isKnownArchSelectorToken(`-${lower}`) ? "continue" : "invalid";
		}
		if (!token.startsWith("-") || token === "-") return "stop";
		if (lower === "-32" || lower === "-64") return "continue";
		if (lower === "-arch") {
			expectsArchName = true;
			return "continue";
		}
		if (lower === "-c" || lower === "-d" || lower === "-e" || lower === "-h") return "invalid";
		return isKnownArchSelectorToken(lower) ? "continue" : "invalid";
	} });
}
function supportsDarwinDispatchWrapper(platform = process.platform) {
	return platform === "darwin";
}
function unwrapXcrunInvocation(argv) {
	return unwrapDashOptionInvocation(argv, {
		allowDoubleDash: false,
		onFlag: (_flag, token) => XCRUN_FLAG_OPTIONS.has(token) ? "continue" : "invalid"
	});
}
const DISPATCH_WRAPPER_SPEC_BY_NAME = new Map([
	{
		name: "arch",
		unwrap: (argv, platform) => supportsDarwinDispatchWrapper(platform) ? unwrapArchInvocation(argv) : null,
		transparentUsage: (_argv, platform) => supportsDarwinDispatchWrapper(platform)
	},
	{
		name: "caffeinate",
		dashOptions: {
			flagOptions: CAFFEINATE_FLAG_OPTIONS,
			optionsWithValue: CAFFEINATE_OPTIONS_WITH_VALUE
		},
		transparentUsage: true
	},
	{ name: "bwrap" },
	{ name: "catchsegv" },
	{ name: "chrt" },
	{ name: "chroot" },
	{ name: "cpulimit" },
	{ name: "doas" },
	{ name: "eatmydata" },
	{
		name: "env",
		unwrap: unwrapEnvInvocation,
		transparentUsage: (argv) => !envInvocationUsesModifiers(argv)
	},
	{ name: "firejail" },
	{
		name: "flock",
		unwrap: unwrapFlockInvocation,
		transparentUsage: true
	},
	{ name: "gosu" },
	{ name: "ionice" },
	{ name: "linux32" },
	{ name: "linux64" },
	{
		name: "nice",
		unwrap: unwrapNiceInvocation,
		transparentUsage: true
	},
	{ name: "nsenter" },
	{
		name: "nohup",
		unwrap: unwrapNohupInvocation,
		transparentUsage: true
	},
	{ name: "numactl" },
	{ name: "pkexec" },
	{ name: "proot" },
	{ name: "proxychains" },
	{ name: "proxychains4" },
	{ name: "runuser" },
	{
		name: "sandbox-exec",
		dashOptions: { optionsWithValue: SANDBOX_EXEC_OPTIONS_WITH_VALUE },
		transparentUsage: true
	},
	{
		name: "script",
		unwrap: unwrapScriptInvocation,
		transparentUsage: false
	},
	{ name: "setarch" },
	{ name: "setsid" },
	{ name: "setpriv" },
	{
		name: "stdbuf",
		dashOptions: { optionsWithValue: STDBUF_OPTIONS_WITH_VALUE },
		transparentUsage: true
	},
	{ name: "su" },
	{ name: "sudo" },
	{ name: "systemd-run" },
	{ name: "taskset" },
	{
		name: "time",
		dashOptions: {
			flagOptions: TIME_FLAG_OPTIONS,
			optionsWithValue: TIME_OPTIONS_WITH_VALUE
		},
		transparentUsage: (argv) => !timeInvocationWritesOutputFile(argv)
	},
	{
		name: "timeout",
		unwrap: unwrapTimeoutInvocation,
		transparentUsage: true
	},
	{ name: "torify" },
	{ name: "torsocks" },
	{ name: "unbuffer" },
	{ name: "unshare" },
	{ name: "watch" },
	{
		name: "xcrun",
		changesExecutableLookup: true,
		unwrap: (argv, platform) => supportsDarwinDispatchWrapper(platform) ? unwrapXcrunInvocation(argv) : null,
		transparentUsage: (_argv, platform) => supportsDarwinDispatchWrapper(platform)
	},
	{ name: "xvfb-run" }
].map((spec) => [spec.name, spec]));
function isDispatchWrapperExecutable(token) {
	return DISPATCH_WRAPPER_SPEC_BY_NAME.has(normalizeExecutableToken(token));
}
function unwrapKnownDispatchWrapperInvocation(argv, platform = process.platform) {
	const token0 = argv[0]?.trim();
	if (!token0) return { kind: "not-wrapper" };
	const wrapper = normalizeExecutableToken(token0);
	const spec = DISPATCH_WRAPPER_SPEC_BY_NAME.get(wrapper);
	if (!spec) return { kind: "not-wrapper" };
	const unwrapped = spec.dashOptions ? unwrapDashOptionInvocation(argv, spec.dashOptions) : spec.unwrap?.(argv, platform);
	return unwrapped ? {
		kind: "unwrapped",
		wrapper,
		argv: unwrapped
	} : {
		kind: "blocked",
		wrapper
	};
}
function unwrapDispatchWrappersForResolution(argv, maxDepth = 4, platform = process.platform) {
	return resolveDispatchWrapperTrustPlan(argv, maxDepth, platform).argv;
}
function isSemanticDispatchWrapperUsage(wrapper, argv, platform = process.platform) {
	const spec = DISPATCH_WRAPPER_SPEC_BY_NAME.get(wrapper);
	if (!spec?.unwrap && !spec?.dashOptions) return true;
	const transparentUsage = spec.transparentUsage;
	if (typeof transparentUsage === "function") return !transparentUsage(argv, platform);
	return transparentUsage !== true;
}
function resolveDispatchWrapperTrustPlan(argv, maxDepth = 4, platform = process.platform) {
	let current = argv;
	const wrappers = [];
	const wrapperInvocations = [];
	const blocked = (blockedWrapper) => ({
		argv: current,
		wrappers,
		wrapperInvocations,
		policyBlocked: true,
		dispatchChainComplete: false,
		blockedWrapper
	});
	for (let depth = 0; depth < maxDepth; depth += 1) {
		const unwrap = unwrapKnownDispatchWrapperInvocation(current, platform);
		if (unwrap.kind === "blocked") return blocked(unwrap.wrapper);
		if (unwrap.kind !== "unwrapped" || unwrap.argv.length === 0) break;
		wrappers.push(unwrap.wrapper);
		wrapperInvocations.push({
			wrapper: unwrap.wrapper,
			sourceArgv: [...current]
		});
		if (isSemanticDispatchWrapperUsage(unwrap.wrapper, current, platform)) return blocked(unwrap.wrapper);
		current = unwrap.argv;
	}
	if (wrappers.length >= maxDepth) {
		const overflow = unwrapKnownDispatchWrapperInvocation(current, platform);
		if (overflow.kind === "blocked" || overflow.kind === "unwrapped") return blocked(overflow.wrapper);
	}
	return {
		argv: current,
		wrappers,
		wrapperInvocations,
		policyBlocked: false,
		dispatchChainComplete: wrappers.every((wrapper) => !DISPATCH_WRAPPER_SPEC_BY_NAME.get(wrapper)?.changesExecutableLookup)
	};
}
function hasDispatchEnvManipulation(argv) {
	const unwrap = unwrapKnownDispatchWrapperInvocation(argv);
	return unwrap.kind === "unwrapped" && unwrap.wrapper === "env" && envInvocationUsesModifiers(argv);
}
//#endregion
//#region src/infra/shell-wrapper-resolution.ts
const POSIX_SHELL_WRAPPER_NAMES = [
	"ash",
	"bash",
	"csh",
	"dash",
	"elvish",
	"fish",
	"ksh",
	"mksh",
	"nu",
	"osh",
	"sh",
	"tcsh",
	"xonsh",
	"yash",
	"zsh"
];
const POSIX_PARSEABLE_SHELL_WRAPPER_NAMES = [
	"ash",
	"bash",
	"dash",
	"fish",
	"ksh",
	"mksh",
	"sh",
	"yash",
	"zsh"
];
const WINDOWS_CMD_WRAPPER_NAMES = ["cmd"];
const POWERSHELL_WRAPPER_NAMES = ["powershell", "pwsh"];
const SHELL_MULTIPLEXER_WRAPPER_NAMES = ["busybox", "toybox"];
const NUSHELL_STARTUP_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"--config",
	"--env-config",
	"--plugin-config",
	"--plugins"
]);
const OPAQUE_STARTUP_FILE_SHELL_WRAPPERS = /* @__PURE__ */ new Set([
	"csh",
	"osh",
	"tcsh"
]);
function withWindowsExeAliases(names) {
	return names.flatMap((name) => [name, `${name}.exe`]);
}
const POSIX_SHELL_WRAPPERS = new Set(withWindowsExeAliases(POSIX_SHELL_WRAPPER_NAMES));
const POSIX_PARSEABLE_SHELL_WRAPPERS = new Set(withWindowsExeAliases(POSIX_PARSEABLE_SHELL_WRAPPER_NAMES));
const POWERSHELL_WRAPPERS = new Set(withWindowsExeAliases(POWERSHELL_WRAPPER_NAMES));
const POSIX_SHELL_WRAPPER_CANONICAL = new Set(POSIX_SHELL_WRAPPER_NAMES);
const WINDOWS_CMD_WRAPPER_CANONICAL = new Set(WINDOWS_CMD_WRAPPER_NAMES);
const POWERSHELL_WRAPPER_CANONICAL = new Set(POWERSHELL_WRAPPER_NAMES);
const SHELL_MULTIPLEXER_WRAPPER_CANONICAL = new Set(SHELL_MULTIPLEXER_WRAPPER_NAMES);
const SHELL_WRAPPER_CANONICAL = /* @__PURE__ */ new Set([
	...POSIX_SHELL_WRAPPER_NAMES,
	...WINDOWS_CMD_WRAPPER_NAMES,
	...POWERSHELL_WRAPPER_NAMES
]);
function resolveShellWrapperCandidate(inputArgv, inspectEnv = false) {
	let argv = inputArgv;
	let hasEnvManipulation = false;
	for (let depth = 0; depth <= 4; depth++) {
		const token0 = argv[0]?.trim();
		if (!token0) return null;
		const dispatch = unwrapKnownDispatchWrapperInvocation(argv);
		if (dispatch.kind === "unwrapped" && inspectEnv) hasEnvManipulation ||= hasDispatchEnvManipulation(argv);
		const wrapper = dispatch.kind === "not-wrapper" ? unwrapKnownShellMultiplexerInvocation(argv) : dispatch;
		if (wrapper.kind === "blocked") return null;
		if (wrapper.kind === "unwrapped") {
			argv = wrapper.argv;
			continue;
		}
		return {
			argv,
			token0,
			hasEnvManipulation
		};
	}
	return null;
}
function resolveShellWrapperPayload(argv, inspectEnv = false) {
	const candidate = resolveShellWrapperCandidate(argv, inspectEnv);
	if (!candidate) return null;
	const baseExecutable = normalizeExecutableToken(candidate.token0);
	const wrapper = findShellWrapperKind(baseExecutable);
	if (!wrapper) return null;
	const payload = extractShellWrapperPayload(candidate.argv, wrapper, baseExecutable);
	if (!payload) return null;
	return {
		...candidate,
		wrapper,
		payload,
		baseExecutable
	};
}
/** Return true when an executable token names a supported shell wrapper. */
function isShellWrapperExecutable(token) {
	return SHELL_WRAPPER_CANONICAL.has(normalizeExecutableToken(token));
}
/** Return true when argv resolves to a shell wrapper invocation. */
function isShellWrapperInvocation(argv) {
	const candidate = resolveShellWrapperCandidate(argv);
	return candidate ? isShellWrapperExecutable(candidate.token0) : false;
}
/** Detect implicit POSIX startup in the requested shell, including dispatch wrappers. */
function hasPosixShellStartupBeforeInlineCommand(argv) {
	const candidate = resolveShellWrapperCandidate(argv);
	return Boolean(candidate && POSIX_SHELL_WRAPPER_CANONICAL.has(normalizeExecutableToken(candidate.token0)) && (hasPosixLoginStartupBeforeInlineCommand(candidate.argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixInteractiveStartupBeforeInlineCommand(candidate.argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function findShellWrapperKind(baseExecutable) {
	if (POSIX_SHELL_WRAPPER_CANONICAL.has(baseExecutable)) return "posix";
	if (WINDOWS_CMD_WRAPPER_CANONICAL.has(baseExecutable)) return "cmd";
	return POWERSHELL_WRAPPER_CANONICAL.has(baseExecutable) ? "powershell" : null;
}
/** Unwrap busybox/toybox shell applets or fail closed for ambiguous applets. */
function unwrapKnownShellMultiplexerInvocation(argv) {
	const token0 = argv[0]?.trim();
	if (!token0) return { kind: "not-wrapper" };
	const wrapper = normalizeExecutableToken(token0);
	if (!SHELL_MULTIPLEXER_WRAPPER_CANONICAL.has(wrapper)) return { kind: "not-wrapper" };
	let appletIndex = 1;
	if (argv[appletIndex]?.trim() === "--") appletIndex += 1;
	const applet = argv[appletIndex]?.trim();
	if (!applet || !isShellWrapperExecutable(applet)) return {
		kind: "blocked",
		wrapper
	};
	return {
		kind: "unwrapped",
		wrapper,
		argv: argv.slice(appletIndex)
	};
}
function extractPosixShellInlineCommand(argv, baseExecutable) {
	if (OPAQUE_STARTUP_FILE_SHELL_WRAPPERS.has(baseExecutable)) return null;
	if (baseExecutable === "nu") {
		if (hasNushellStartupOptionBeforeInlineCommand(argv)) return null;
		const attached = extractNushellAttachedInlineCommand(argv);
		if (attached !== null) return attached.trim() || null;
		return resolveInlineCommandMatch(argv, NUSHELL_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command;
	}
	return resolveInlineCommandMatch(argv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command;
}
function hasNushellStartupOptionBeforeInlineCommand(argv) {
	for (let i = 1; i < argv.length; i += 1) {
		const token = normalizeLowercaseStringOrEmpty(argv[i]);
		if (!token || token === "--") return false;
		if (isNushellInlineCommandBoundary(token)) return false;
		for (const option of NUSHELL_STARTUP_OPTIONS_WITH_VALUE) if (token === option || token.startsWith(`${option}=`)) return true;
	}
	return false;
}
function extractNushellAttachedInlineCommand(argv) {
	for (let i = 1; i < argv.length; i += 1) {
		const arg = argv[i]?.trim() ?? "";
		if (!arg || arg === "--") return null;
		const equalsIndex = arg.indexOf("=");
		if (equalsIndex === -1) continue;
		const flag = normalizeLowercaseStringOrEmpty(arg.slice(0, equalsIndex));
		if (flag.startsWith("--") && NUSHELL_INLINE_COMMAND_FLAGS.has(flag)) return arg.slice(equalsIndex + 1);
	}
	return null;
}
function isNushellInlineCommandBoundary(arg) {
	const normalized = normalizeLowercaseStringOrEmpty(arg);
	if (NUSHELL_INLINE_COMMAND_FLAGS.has(normalized)) return true;
	const equalsIndex = normalized.indexOf("=");
	if (equalsIndex === -1) return false;
	const flag = normalized.slice(0, equalsIndex);
	return flag.startsWith("--") && NUSHELL_INLINE_COMMAND_FLAGS.has(flag);
}
function extractCmdInlineCommand(argv) {
	const idx = argv.findIndex((item) => {
		const token = normalizeLowercaseStringOrEmpty(item);
		return token === "/c" || token === "/k" || token === "-c" || token === "-k";
	});
	if (idx === -1) return null;
	const cmd = argv.slice(idx + 1).join(" ").trim();
	return cmd.length > 0 ? cmd : null;
}
function hasCmdUnreviewedStartupBeforeInlineCommand(argv) {
	let autoRunDisabled = false;
	for (let index = 1; index < argv.length; index += 1) {
		const token = normalizeLowercaseStringOrEmpty(argv[index]);
		if (!token) continue;
		if (token === "/d") {
			autoRunDisabled = true;
			continue;
		}
		if (token === "/k") return true;
		if (token === "/c") return !autoRunDisabled || !argv.slice(index + 1).some((value) => value.trim().length > 0);
		if (token === "/s" || token === "/q" || token === "/a" || token === "/u" || /^\/t:[\da-f]{1,2}$/u.test(token) || token === "/e:on" || token === "/e:off" || token === "/f:on" || token === "/f:off" || token === "/v:on" || token === "/v:off") continue;
		return true;
	}
	return true;
}
function extractShellWrapperPayload(argv, kind, baseExecutable) {
	if (kind === "posix") return extractPosixShellInlineCommand(argv, baseExecutable);
	if (kind === "cmd") return extractCmdInlineCommand(argv);
	return resolvePowerShellInlineCommandMatch(argv).command;
}
function isLegacyShLoginInlineForm(argv, baseExecutable) {
	return baseExecutable === "sh" && argv[1]?.trim() === "-lc";
}
/** Format argv with minimal shell-style quoting for display and consistency checks. */
function formatExecCommand(argv) {
	return argv.map((arg) => {
		if (arg.length === 0) return "\"\"";
		return /\s|"/.test(arg) ? `"${arg.replace(/"/g, "\\\"")}"` : arg;
	}).join(" ");
}
function startupWrapperRequiresFullArgv(params) {
	if (params.kind !== "posix") return false;
	if (params.baseExecutable === "fish" && hasFishInitCommandOption(params.argv)) return true;
	if (params.baseExecutable === "nu") return hasNushellStartupBeforeInlineCommand(params.argv);
	if (POSIX_SHELL_WRAPPER_CANONICAL.has(params.baseExecutable) && hasPosixLoginStartupBeforeInlineCommand(params.argv, POSIX_INLINE_COMMAND_FLAGS)) return params.includeLegacyLoginInlineForm || !isLegacyShLoginInlineForm(params.argv, params.baseExecutable);
	return hasPosixInteractiveStartupBeforeInlineCommand(params.argv, POSIX_INLINE_COMMAND_FLAGS);
}
function hasNushellStartupBeforeInlineCommand(argv) {
	let sawStartupMode = false;
	for (let i = 1; i < argv.length; i += 1) {
		const arg = argv[i]?.trim() ?? "";
		if (!arg || arg === "--") return false;
		const normalized = normalizeLowercaseStringOrEmpty(arg);
		if (normalized === "--login" || normalized === "--interactive" || normalized.startsWith("-") && !normalized.startsWith("--") && /[li]/.test(normalized.slice(1))) sawStartupMode = true;
		if (isNushellInlineCommandBoundary(arg)) return sawStartupMode;
		if (!arg.startsWith("-") && !arg.startsWith("+")) return false;
	}
	return false;
}
/** Return true when dispatch wrappers set env before the shell wrapper. */
function hasEnvManipulationBeforeShellWrapper(argv) {
	return resolveShellWrapperPayload(argv, true)?.hasEnvManipulation ?? false;
}
/** Classify shell wrapper argv and return the approval-display command when safe. */
function extractShellWrapperCommand(argv, rawCommandInput) {
	const rawCommand = rawCommandInput?.trim() || null;
	const candidate = resolveShellWrapperPayload(argv);
	if (!candidate) return {
		isWrapper: false,
		command: null
	};
	const { baseExecutable, wrapper, payload } = candidate;
	if (wrapper === "posix" && baseExecutable === "fish" && hasFishAttachedCommandOption(candidate.argv)) return {
		isWrapper: true,
		command: null
	};
	const rawMatchesPayload = rawCommand === payload;
	const rawMatchesCanonicalArgv = rawCommand === formatExecCommand(candidate.argv);
	const allowLegacyShLoginPayloadBinding = isLegacyShLoginInlineForm(candidate.argv, baseExecutable) && (rawMatchesPayload || rawMatchesCanonicalArgv);
	if (startupWrapperRequiresFullArgv({
		argv: candidate.argv,
		kind: wrapper,
		baseExecutable,
		includeLegacyLoginInlineForm: !allowLegacyShLoginPayloadBinding
	})) return {
		isWrapper: true,
		command: null
	};
	return {
		isWrapper: true,
		command: rawMatchesCanonicalArgv ? payload : rawCommand ?? payload
	};
}
/** Resolve the argv segment that should be transported for shell execution. */
function resolveShellWrapperTransportArgv(argv) {
	return resolveShellWrapperPayload(argv)?.argv ?? null;
}
/** Extract the raw inline command payload from a shell wrapper argv. */
function extractShellWrapperInlineCommand(argv) {
	return resolveShellWrapperPayload(argv)?.payload ?? null;
}
/** Extract a command payload only when it is safe to bind to raw command text. */
function extractBindableShellWrapperInlineCommand(argv, rawCommand) {
	return extractShellWrapperCommand(argv, rawCommand).command;
}
/** Return true when shell wrapper startup behavior blocks command rebinding. */
function isBlockedShellWrapperCommand(argv, rawCommand) {
	const candidate = resolveShellWrapperCandidate(argv);
	if (!candidate) return false;
	const baseExecutable = normalizeExecutableToken(candidate.token0);
	const wrapper = findShellWrapperKind(baseExecutable);
	if (!wrapper) return false;
	if (wrapper === "cmd" && hasCmdUnreviewedStartupBeforeInlineCommand(candidate.argv)) return true;
	if (wrapper === "powershell") {
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(candidate.argv);
		if (hasPowerShellProfileStartupBeforeInlineCommand(candidate.argv, valueTokenIndex) || valueTokenIndex !== null && (command === "-" || isPowerShellInlineEncodedCommandFlag(candidate.argv[valueTokenIndex - 1] ?? "") || isPowerShellInlineFileCommandFlag(candidate.argv[valueTokenIndex - 1] ?? ""))) return true;
	}
	if (wrapper === "posix") {
		if (baseExecutable === "fish" && hasFishInitCommandOption(candidate.argv) || baseExecutable === "nu" && hasNushellStartupOptionBeforeInlineCommand(candidate.argv)) return true;
	}
	if (wrapper === "posix" && OPAQUE_STARTUP_FILE_SHELL_WRAPPERS.has(baseExecutable)) return true;
	const extracted = extractShellWrapperCommand(argv, rawCommand);
	return extracted.isWrapper && extracted.command === null;
}
//#endregion
export { parseEnvInvocationPrelude as C, isEnvAssignmentToken as S, normalizeExecutableToken as T, resolveDispatchWrapperTrustPlan as _, extractShellWrapperCommand as a, COMMAND_CARRIER_EXECUTABLES as b, hasEnvManipulationBeforeShellWrapper as c, isShellWrapperExecutable as d, isShellWrapperInvocation as f, isDispatchWrapperExecutable as g, extractEnvAssignmentKeysFromDispatchWrappers as h, extractBindableShellWrapperInlineCommand as i, hasPosixShellStartupBeforeInlineCommand as l, unwrapKnownShellMultiplexerInvocation as m, POSIX_SHELL_WRAPPERS as n, extractShellWrapperInlineCommand as o, resolveShellWrapperTransportArgv as p, POWERSHELL_WRAPPERS as r, formatExecCommand as s, POSIX_PARSEABLE_SHELL_WRAPPERS as t, isBlockedShellWrapperCommand as u, unwrapDispatchWrappersForResolution as v, resolveCarrierCommandArgv as w, SOURCE_EXECUTABLES as x, unwrapKnownDispatchWrapperInvocation as y };
