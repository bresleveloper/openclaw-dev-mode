import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { r as splitShellArgs } from "./shell-argv-DE1kujuY.mjs";
import path from "node:path";
//#region src/infra/exec-wrapper-tokens.ts
const WINDOWS_EXECUTABLE_SUFFIXES = [
	".exe",
	".cmd",
	".bat",
	".com"
];
function stripWindowsExecutableSuffix(value) {
	for (const suffix of WINDOWS_EXECUTABLE_SUFFIXES) if (value.endsWith(suffix)) return value.slice(0, -suffix.length);
	return value;
}
/** Return a lowercase basename using the shorter POSIX/Windows interpretation. */
function basenameLower(token) {
	const win = path.win32.basename(token);
	const posix = path.posix.basename(token);
	const base = win.length < posix.length ? win : posix;
	return normalizeLowercaseStringOrEmpty(base);
}
/** Normalize an executable token for wrapper and policy matching. */
function normalizeExecutableToken(token) {
	return stripWindowsExecutableSuffix(basenameLower(token));
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
const COMMAND_QUERY_OPTIONS = /* @__PURE__ */ new Set(["-v", "-V"]);
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
function optionName(token) {
	return parseInlineOptionToken(token).name;
}
function parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
	if (token.startsWith("--")) {
		const option = parseInlineOptionToken(token);
		const name = option.name;
		if (standaloneOptions.has(name) || optionsWithValue.has(name) || nonExecutingOptions.has(name)) {
			const parsedOption = {
				name,
				hasInlineValue: option.hasInlineValue
			};
			if (option.hasInlineValue) parsedOption.inlineValue = option.inlineValue;
			return [parsedOption];
		}
		return null;
	}
	if (!/^-[A-Za-z0-9]/u.test(token)) return null;
	const options = [];
	for (let index = 1; index < token.length; index += 1) {
		const name = `-${token[index] ?? ""}`;
		if (optionsWithValue.has(name)) {
			options.push({
				name,
				hasInlineValue: index < token.length - 1,
				inlineValue: index < token.length - 1 ? token.slice(index + 1) : void 0
			});
			return options;
		}
		if (standaloneOptions.has(name) || nonExecutingOptions.has(name)) {
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
function knownCarrierOptionConsumesNextValue(options, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
	let consumesNextValue = false;
	for (const option of options) {
		if (nonExecutingOptions.has(option.name)) return null;
		if (optionsWithValue.has(option.name)) consumesNextValue = !option.hasInlineValue;
	}
	return consumesNextValue;
}
function stripSudoEnvAssignmentsFromCommandArgv(executable, argv) {
	if (executable !== "sudo") return argv.length > 0 ? argv : null;
	let index = 0;
	while (index < argv.length && isEnvAssignmentToken(argv[index] ?? "")) index += 1;
	return index < argv.length ? argv.slice(index) : null;
}
function findParsedCarrierOption(options, names) {
	return options.find((option) => names.has(option.name));
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
			const delimiter = token.indexOf("=");
			if (delimiter > 0) assignmentKeys.push(token.slice(0, delimiter));
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
			const splitStringOption = findParsedCarrierOption(option, ENV_SPLIT_STRING_OPTIONS);
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
			if (knownCarrierOptionConsumesNextValue(option, ENV_OPTIONS_WITH_VALUE)) index += 1;
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
	const parsed = parseEnvInvocationPrelude(argv);
	return parsed ? parsed.splitArgv ?? argv.slice(parsed.commandIndex) : null;
}
/** Resolve the command argv behind an `env` carrier, honoring bounded `env -S` recursion. */
function resolveEnvCarriedArgv(argv, depth = 0) {
	const parsed = parseEnvInvocationPrelude(argv, depth);
	return parsed ? parsed.splitArgv ?? argv.slice(parsed.commandIndex) : null;
}
function resolveCommandBuiltinCarriedArgv(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	if (executable !== "command" && executable !== "builtin") return null;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--") return argv.slice(index + 1);
		if (!token.startsWith("-")) return argv.slice(index);
		const normalized = optionName(token);
		if (COMMAND_QUERY_OPTIONS.has(normalized)) return null;
		if (!COMMAND_EXECUTING_OPTIONS.has(normalized)) return null;
	}
	return null;
}
function resolveSudoLikeCarriedArgv(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	const standaloneOptions = executable === "sudo" ? SUDO_STANDALONE_OPTIONS : executable === "doas" ? DOAS_STANDALONE_OPTIONS : null;
	const optionsWithValue = executable === "sudo" ? SUDO_OPTIONS_WITH_VALUE : executable === "doas" ? DOAS_OPTIONS_WITH_VALUE : null;
	if (!standaloneOptions || !optionsWithValue) return null;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--") return stripSudoEnvAssignmentsFromCommandArgv(executable, argv.slice(index + 1));
		if (!token.startsWith("-")) return stripSudoEnvAssignmentsFromCommandArgv(executable, argv.slice(index));
		const option = parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, executable === "sudo" ? SUDO_NON_EXEC_OPTIONS : void 0);
		if (!option) return null;
		const consumeNextValue = knownCarrierOptionConsumesNextValue(option, optionsWithValue, executable === "sudo" ? SUDO_NON_EXEC_OPTIONS : void 0);
		if (consumeNextValue === null) return null;
		if (consumeNextValue) index += 1;
	}
	return null;
}
function resolveExecCarriedArgv(argv) {
	if (normalizeExecutableToken(argv[0] ?? "") !== "exec") return null;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--") return argv.slice(index + 1);
		if (!token.startsWith("-")) return argv.slice(index);
		const option = parseCarrierOptionToken(token, EXEC_STANDALONE_OPTIONS, EXEC_OPTIONS_WITH_VALUE);
		if (!option) return null;
		if (knownCarrierOptionConsumesNextValue(option, EXEC_OPTIONS_WITH_VALUE)) index += 1;
	}
	return null;
}
function resolveCarrierCommandArgv(argv, depth = 0, options) {
	switch (normalizeExecutableToken(argv[0] ?? "")) {
		case "env": return resolveEnvCarriedArgv(argv, depth);
		case "command":
		case "builtin": return resolveCommandBuiltinCarriedArgv(argv);
		case "sudo":
		case "doas": return resolveSudoLikeCarriedArgv(argv);
		case "exec": return options?.includeExec ? resolveExecCarriedArgv(argv) : null;
		default: return null;
	}
}
const NICE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
	"-n",
	"--adjustment",
	"--priority"
]);
const CAFFEINATE_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set(["-t", "-w"]);
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
function isArchSelectorToken(token) {
	return /^-[A-Za-z0-9_]+$/.test(token);
}
function isKnownArchSelectorToken(token) {
	return token === "-arm64" || token === "-arm64e" || token === "-i386" || token === "-x86_64" || token === "-x86_64h";
}
function isKnownArchNameToken(token) {
	return isKnownArchSelectorToken(`-${token}`);
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
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			const { name: flag } = parseInlineOptionToken(lower);
			return params.onFlag(flag, lower);
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
function unwrapCaffeinateInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (flag, lower) => {
		if (flag === "-d" || flag === "-i" || flag === "-m" || flag === "-s" || flag === "-u") return "continue";
		if (CAFFEINATE_OPTIONS_WITH_VALUE.has(flag)) return lower !== flag || lower.includes("=") ? "continue" : "consume-next";
		return "invalid";
	} });
}
function unwrapNohupInvocation(argv) {
	return scanWrapperInvocation(argv, {
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			return lower === "--help" || lower === "--version" ? "continue" : "invalid";
		}
	});
}
function unwrapSandboxExecInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (flag, lower) => {
		if (SANDBOX_EXEC_OPTIONS_WITH_VALUE.has(flag)) return lower !== flag || lower.includes("=") ? "continue" : "consume-next";
		return "invalid";
	} });
}
function unwrapStdbufInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (flag, lower) => {
		if (!STDBUF_OPTIONS_WITH_VALUE.has(flag)) return "invalid";
		return lower.includes("=") ? "continue" : "consume-next";
	} });
}
function unwrapTimeInvocation(argv) {
	return unwrapDashOptionInvocation(argv, { onFlag: (flag, lower) => {
		if (TIME_FLAG_OPTIONS.has(flag)) return "continue";
		if (TIME_OPTIONS_WITH_VALUE.has(flag)) return lower.includes("=") ? "continue" : "consume-next";
		return "invalid";
	} });
}
function isFlockShortFlagCluster(token) {
	return /^-[eFnsxo]+$/.test(token);
}
function unwrapFlockInvocation(argv) {
	return scanWrapperInvocation(argv, {
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			const parsedToken = parseInlineOptionToken(token);
			const lowerFlag = parseInlineOptionToken(lower).name;
			if (FLOCK_LONG_FLAG_OPTIONS.has(lowerFlag)) return "continue";
			if (FLOCK_LONG_OPTIONS_WITH_VALUE.has(lowerFlag)) return parsedToken.hasInlineValue ? "continue" : "consume-next";
			if (isFlockShortFlagCluster(token)) return "continue";
			if (FLOCK_SHORT_FLAG_OPTIONS.has(parsedToken.name)) return "continue";
			if (FLOCK_SHORT_OPTIONS_WITH_VALUE.has(parsedToken.name)) return parsedToken.hasInlineValue || token !== parsedToken.name ? "continue" : "consume-next";
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
function supportsScriptPositionalCommand(platform = process.platform) {
	return platform === "darwin" || platform === "freebsd";
}
function unwrapScriptInvocation(argv, platform = process.platform) {
	if (!supportsScriptPositionalCommand(platform)) return null;
	return scanWrapperInvocation(argv, {
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!lower.startsWith("-") || lower === "-") return "stop";
			const { name: flag } = parseInlineOptionToken(token);
			if (BSD_SCRIPT_OPTIONS_WITH_VALUE.has(flag)) return token.includes("=") ? "continue" : "consume-next";
			if (BSD_SCRIPT_FLAG_OPTIONS.has(flag)) return "continue";
			return "invalid";
		},
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
		onFlag: (flag, lower) => {
			if (TIMEOUT_FLAG_OPTIONS.has(flag)) return "continue";
			if (TIMEOUT_OPTIONS_WITH_VALUE.has(flag)) return lower.includes("=") ? "continue" : "consume-next";
			return "invalid";
		},
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
			return isKnownArchNameToken(lower) ? "continue" : "invalid";
		}
		if (!token.startsWith("-") || token === "-") return "stop";
		if (lower === "-32" || lower === "-64") return "continue";
		if (lower === "-arch") {
			expectsArchName = true;
			return "continue";
		}
		if (lower === "-c" || lower === "-d" || lower === "-e" || lower === "-h") return "invalid";
		return isArchSelectorToken(token) && isKnownArchSelectorToken(lower) ? "continue" : "invalid";
	} });
}
function supportsArchDispatchWrapper(platform = process.platform) {
	return platform === "darwin";
}
function supportsXcrunDispatchWrapper(platform = process.platform) {
	return platform === "darwin";
}
function unwrapXcrunInvocation(argv) {
	return scanWrapperInvocation(argv, { onToken: (token, lower) => {
		if (!token.startsWith("-") || token === "-") return "stop";
		if (XCRUN_FLAG_OPTIONS.has(lower)) return "continue";
		return "invalid";
	} });
}
const DISPATCH_WRAPPER_SPEC_BY_NAME = new Map([
	{
		name: "arch",
		unwrap: (argv, platform) => supportsArchDispatchWrapper(platform) ? unwrapArchInvocation(argv) : null,
		transparentUsage: (_argv, platform) => supportsArchDispatchWrapper(platform)
	},
	{
		name: "caffeinate",
		unwrap: unwrapCaffeinateInvocation,
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
		unwrap: unwrapSandboxExecInvocation,
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
		unwrap: unwrapStdbufInvocation,
		transparentUsage: true
	},
	{ name: "su" },
	{ name: "sudo" },
	{ name: "systemd-run" },
	{ name: "taskset" },
	{
		name: "time",
		unwrap: unwrapTimeInvocation,
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
		unwrap: (argv, platform) => supportsXcrunDispatchWrapper(platform) ? unwrapXcrunInvocation(argv) : null,
		transparentUsage: (_argv, platform) => supportsXcrunDispatchWrapper(platform)
	},
	{ name: "xvfb-run" }
].map((spec) => [spec.name, spec]));
function normalizeDispatchWrapperName(token) {
	return normalizeExecutableToken(token);
}
function blockDispatchWrapper(wrapper) {
	return {
		kind: "blocked",
		wrapper
	};
}
function unwrapDispatchWrapper(wrapper, unwrapped) {
	return unwrapped ? {
		kind: "unwrapped",
		wrapper,
		argv: unwrapped
	} : blockDispatchWrapper(wrapper);
}
function isDispatchWrapperExecutable(token) {
	return DISPATCH_WRAPPER_SPEC_BY_NAME.has(normalizeDispatchWrapperName(token));
}
function unwrapKnownDispatchWrapperInvocation(argv, platform = process.platform) {
	const token0 = argv[0]?.trim();
	if (!token0) return { kind: "not-wrapper" };
	const wrapper = normalizeDispatchWrapperName(token0);
	const spec = DISPATCH_WRAPPER_SPEC_BY_NAME.get(wrapper);
	if (!spec) return { kind: "not-wrapper" };
	return spec.unwrap ? unwrapDispatchWrapper(wrapper, spec.unwrap(argv, platform)) : blockDispatchWrapper(wrapper);
}
function unwrapDispatchWrappersForResolution(argv, maxDepth = 4, platform = process.platform) {
	return resolveDispatchWrapperTrustPlan(argv, maxDepth, platform).argv;
}
function isSemanticDispatchWrapperUsage(wrapper, argv, platform = process.platform) {
	const spec = DISPATCH_WRAPPER_SPEC_BY_NAME.get(wrapper);
	if (!spec?.unwrap) return true;
	const transparentUsage = spec.transparentUsage;
	if (typeof transparentUsage === "function") return !transparentUsage(argv, platform);
	return transparentUsage !== true;
}
function blockedDispatchWrapperPlan(params) {
	return {
		argv: params.argv,
		wrappers: params.wrappers,
		wrapperInvocations: params.wrapperInvocations,
		policyBlocked: true,
		dispatchChainComplete: false,
		blockedWrapper: params.blockedWrapper
	};
}
function resolveDispatchWrapperTrustPlan(argv, maxDepth = 4, platform = process.platform) {
	let current = argv;
	const wrappers = [];
	const wrapperInvocations = [];
	for (let depth = 0; depth < maxDepth; depth += 1) {
		const unwrap = unwrapKnownDispatchWrapperInvocation(current, platform);
		if (unwrap.kind === "blocked") return blockedDispatchWrapperPlan({
			argv: current,
			wrappers,
			wrapperInvocations,
			blockedWrapper: unwrap.wrapper
		});
		if (unwrap.kind !== "unwrapped" || unwrap.argv.length === 0) break;
		wrappers.push(unwrap.wrapper);
		wrapperInvocations.push({
			wrapper: unwrap.wrapper,
			sourceArgv: [...current]
		});
		if (isSemanticDispatchWrapperUsage(unwrap.wrapper, current, platform)) return blockedDispatchWrapperPlan({
			argv: current,
			wrappers,
			wrapperInvocations,
			blockedWrapper: unwrap.wrapper
		});
		current = unwrap.argv;
	}
	if (wrappers.length >= maxDepth) {
		const overflow = unwrapKnownDispatchWrapperInvocation(current, platform);
		if (overflow.kind === "blocked" || overflow.kind === "unwrapped") return blockedDispatchWrapperPlan({
			argv: current,
			wrappers,
			wrapperInvocations,
			blockedWrapper: overflow.wrapper
		});
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
//#region src/infra/shell-inline-command.ts
const POSIX_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	"-lc",
	"-c",
	"--command",
	"--commands",
	"--cmdline"
]);
const NUSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	...POSIX_INLINE_COMMAND_FLAGS,
	"-e",
	"--execute"
]);
function expandPowerShellSwitchPrefixForms(match, smallestMatch) {
	const forms = [];
	for (let length = smallestMatch.length; length <= match.length; length += 1) {
		const prefix = match.slice(0, length);
		forms.push(`-${prefix}`, `--${prefix}`, `/${prefix}`);
	}
	return forms;
}
function expandPowerShellSwitchForms(names) {
	return names.flatMap((name) => {
		const normalized = normalizeLowercaseStringOrEmpty(name);
		return [
			`-${normalized}`,
			`--${normalized}`,
			`/${normalized}`
		];
	});
}
const POWERSHELL_COMMAND_FLAGS = [
	...expandPowerShellSwitchPrefixForms("command", "c"),
	...expandPowerShellSwitchPrefixForms("commandwithargs", "cwa"),
	...expandPowerShellSwitchForms(["cwa"])
];
const POWERSHELL_FILE_FLAGS = expandPowerShellSwitchPrefixForms("file", "f");
const POWERSHELL_INLINE_FILE_FLAGS = new Set(POWERSHELL_FILE_FLAGS);
const POWERSHELL_NO_PROFILE_FLAGS = new Set(expandPowerShellSwitchPrefixForms("noprofile", "nop"));
const POWERSHELL_UNREVIEWED_STARTUP_FLAGS = /* @__PURE__ */ new Set([
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchForms(["ea"]),
	...expandPowerShellSwitchPrefixForms("interactive", "i"),
	...expandPowerShellSwitchPrefixForms("login", "l"),
	...expandPowerShellSwitchPrefixForms("namedpipeservermode", "nam"),
	...expandPowerShellSwitchPrefixForms("noexit", "noe"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchForms(["pscf"]),
	...expandPowerShellSwitchPrefixForms("servermode", "s"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("socketservermode", "so"),
	...expandPowerShellSwitchPrefixForms("sshservermode", "ssh"),
	...expandPowerShellSwitchPrefixForms("v2socketservermode", "v2so")
]);
const POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS = /* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms("encodedcommand", "e"), ...expandPowerShellSwitchPrefixForms("ec", "e")]);
const POWERSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	...POWERSHELL_COMMAND_FLAGS,
	...POWERSHELL_FILE_FLAGS,
	...POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS
]);
const POWERSHELL_INLINE_REST_COMMAND_FLAGS = new Set(POWERSHELL_COMMAND_FLAGS);
const POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchPrefixForms("executionpolicy", "ex"),
	...expandPowerShellSwitchPrefixForms("inputformat", "inp"),
	...expandPowerShellSwitchPrefixForms("outputformat", "o"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("token", "to"),
	...expandPowerShellSwitchPrefixForms("utctimestamp", "utc"),
	...expandPowerShellSwitchPrefixForms("version", "v"),
	...expandPowerShellSwitchPrefixForms("windowstyle", "w"),
	...expandPowerShellSwitchPrefixForms("workingdirectory", "w"),
	...expandPowerShellSwitchForms([
		"ea",
		"ep",
		"if",
		"of",
		"pscf",
		"wd"
	])
]);
const POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"-O",
	"-o",
	"+O",
	"+o"
]);
function isCombinedCommandFlag(token) {
	return parseCombinedCommandFlag(token) !== null;
}
function countSeparateValueOptionChars(token) {
	let count = 0;
	for (let index = 1; index < token.length; index += 1) {
		const char = token[index];
		if (char === "o" || char === "O") count += 1;
	}
	return count;
}
function parseCombinedCommandFlag(token) {
	if (token.length < 2 || token[0] !== "-" || token[1] === "-") return null;
	const optionChars = token.slice(1);
	const commandFlagIndex = optionChars.indexOf("c");
	if (commandFlagIndex === -1 || optionChars.includes("-")) return null;
	const suffix = optionChars.slice(commandFlagIndex + 1);
	if (suffix && !/^[A-Za-z]+$/.test(suffix)) return {
		attachedCommand: suffix,
		separateValueCount: 0
	};
	return {
		attachedCommand: null,
		separateValueCount: countSeparateValueOptionChars(token)
	};
}
function combinedSeparateValueOptionCount(token) {
	if (token.length < 2 || token[0] !== "-" && token[0] !== "+" || token[1] === "-" || token.slice(1).includes("-")) return 0;
	return countSeparateValueOptionChars(token);
}
function consumesSeparateValue(token) {
	return POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token);
}
function isPosixInteractiveModeOption(token) {
	return token === "--interactive" || isPosixShortOption(token, "i");
}
function isPosixShortOption(token, option) {
	if (token.length < 2 || token[0] !== "-" || token[1] === "-") return false;
	let hasOption = false;
	for (let index = 1; index < token.length; index += 1) {
		const char = token[index];
		if (char === "-") return false;
		if (char === option) hasOption = true;
	}
	return hasOption;
}
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
function advancePosixInlineOptionScan(token) {
	const combinedValueCount = combinedSeparateValueOptionCount(token);
	if (combinedValueCount > 0) return 1 + combinedValueCount;
	if (consumesSeparateValue(token)) return 2;
	return 1;
}
function isPowerShellOptionToken(token) {
	return token.startsWith("-") || /^\/[A-Za-z][A-Za-z0-9]*$/.test(token);
}
/** Find the inline command payload for a shell wrapper argv. */
function resolveInlineCommandMatch(argv, flags, options = {}) {
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower === "--") break;
		const comparableToken = options.allowCombinedC ? token : lower;
		if (flags.has(comparableToken)) {
			const valueTokenIndex = i + 1 < argv.length ? i + 1 : null;
			if (options.restValueFlags?.has(comparableToken)) {
				const command = argv.slice(i + 1).map((arg) => arg.trim()).join(" ").trim();
				return {
					command: command ? command : null,
					valueTokenIndex
				};
			}
			const command = argv[i + 1]?.trim();
			return {
				command: command ? command : null,
				valueTokenIndex
			};
		}
		if (options.allowCombinedC && isCombinedCommandFlag(token)) {
			const combined = parseCombinedCommandFlag(token);
			if (combined?.attachedCommand != null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const valueTokenIndex = i + 1 + (combined?.separateValueCount ?? 0);
			const command = argv[valueTokenIndex]?.trim();
			return {
				command: command ? command : null,
				valueTokenIndex
			};
		}
		if (options.valueOptions?.has(lower)) {
			i += 2;
			continue;
		}
		const isOptionToken = options.isOptionToken?.(token) ?? (token.startsWith("-") || token.startsWith("+"));
		if (options.stopAtFirstNonOption && !isOptionToken) break;
		if (options.allowCombinedC && !token.startsWith("-") && !token.startsWith("+")) break;
		i += options.allowCombinedC ? advancePosixInlineOptionScan(token) : 1;
	}
	return {
		command: null,
		valueTokenIndex: null
	};
}
/** Return true when an inline shell payload directly dispatches positional args. */
function isDirectShellPositionalCarrierCommand(command) {
	const trimmed = command.trim();
	if (trimmed.length === 0) return false;
	const shellWhitespace = String.raw`[^\S\r\n]+`;
	const positionalZero = String.raw`(?:\$(?:0|\{0\})|"\$(?:0|\{0\})")`;
	const positionalArg = String.raw`(?:\$(?:[@*]|[1-9]|\{[@*1-9]\})|"\$(?:[@*]|[1-9]|\{[@*1-9]\})")`;
	return new RegExp(`^(?:exec${shellWhitespace}(?:--${shellWhitespace})?)?${positionalZero}(?:${shellWhitespace}${positionalArg})*$`, "u").test(trimmed);
}
/** Find the PowerShell inline command payload and value token index. */
function resolvePowerShellInlineCommandMatch(argv) {
	return resolveInlineCommandMatch(argv, POWERSHELL_INLINE_COMMAND_FLAGS, {
		isOptionToken: isPowerShellOptionToken,
		restValueFlags: POWERSHELL_INLINE_REST_COMMAND_FLAGS,
		stopAtFirstNonOption: true,
		valueOptions: POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES
	});
}
/** Detect default PowerShell profiles or OS login startup before a command. */
function hasPowerShellProfileStartupBeforeInlineCommand(argv, valueTokenIndex = resolvePowerShellInlineCommandMatch(argv).valueTokenIndex) {
	let profilesDisabled = false;
	const commandFlagIndex = valueTokenIndex === null ? argv.length : valueTokenIndex - 1;
	for (let index = 1; index < commandFlagIndex;) {
		const rawToken = argv[index] ?? "";
		if (rawToken === "--") return true;
		if (rawToken === "-") return true;
		if (!isPowerShellOptionToken(rawToken)) return true;
		const token = normalizeLowercaseStringOrEmpty(rawToken);
		if (POWERSHELL_UNREVIEWED_STARTUP_FLAGS.has(token)) return true;
		if (POWERSHELL_NO_PROFILE_FLAGS.has(token)) profilesDisabled = true;
		index += POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token) ? 2 : 1;
	}
	return valueTokenIndex === null || !profilesDisabled;
}
/** Return true when a PowerShell flag consumes the rest of argv as command text. */
function isPowerShellInlineRestCommandFlag(token) {
	return POWERSHELL_INLINE_REST_COMMAND_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
/** Return true when a PowerShell flag treats the next token as script file text. */
function isPowerShellInlineFileCommandFlag(token) {
	return POWERSHELL_INLINE_FILE_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
/** Return true when a PowerShell flag executes an opaque encoded command. */
function isPowerShellInlineEncodedCommandFlag(token) {
	return POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
/** Detect POSIX interactive startup before an inline command flag. */
function hasPosixInteractiveStartupBeforeInlineCommand(argv, flags) {
	let sawInteractiveMode = false;
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		if (token === "--") return false;
		if (isPosixInteractiveModeOption(token)) sawInteractiveMode = true;
		if (flags.has(token) || isCombinedCommandFlag(token)) return sawInteractiveMode;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
		i += advancePosixInlineOptionScan(token);
	}
	return false;
}
/** Detect POSIX login startup before an inline command flag. */
function hasPosixLoginStartupBeforeInlineCommand(argv, flags) {
	let sawLoginMode = false;
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		if (token === "--") return false;
		if (token === "--login" || isPosixShortOption(token, "l")) sawLoginMode = true;
		if (flags.has(token) || isCombinedCommandFlag(token)) return sawLoginMode;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
		i += advancePosixInlineOptionScan(token);
	}
	return false;
}
/** Detect fish init-command options that run before the inline command. */
function hasFishInitCommandOption(argv) {
	for (let i = 1; i < argv.length; i += 1) {
		const token = argv[i]?.trim();
		if (!token) continue;
		if (token === "--") return false;
		if (token === "-C" || token === "--init-command" || token.startsWith("-C") && token !== "-C" || token.startsWith("--init-command=")) return true;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
	}
	return false;
}
/** Detect fish attached `-cCOMMAND` forms that should not be rebound. */
function hasFishAttachedCommandOption(argv) {
	for (let i = 1; i < argv.length; i += 1) {
		const token = argv[i]?.trim();
		if (!token) continue;
		if (token === "--") return false;
		if (token.startsWith("-c") && token !== "-c") return true;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
	}
	return false;
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
	const expanded = /* @__PURE__ */ new Set();
	for (const name of names) {
		expanded.add(name);
		expanded.add(`${name}.exe`);
	}
	return Array.from(expanded);
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
const LOGIN_STARTUP_SHELL_WRAPPER_CANONICAL = new Set(POSIX_SHELL_WRAPPER_NAMES);
const SHELL_WRAPPER_SPECS = [
	{
		kind: "posix",
		names: POSIX_SHELL_WRAPPER_CANONICAL
	},
	{
		kind: "cmd",
		names: WINDOWS_CMD_WRAPPER_CANONICAL
	},
	{
		kind: "powershell",
		names: POWERSHELL_WRAPPER_CANONICAL
	}
];
function resolveShellWrapperCandidate(params) {
	if (!isWithinDispatchClassificationDepth(params.depth)) return null;
	const token0 = params.argv[0]?.trim();
	if (!token0) return null;
	const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(params.argv);
	if (dispatchUnwrap.kind === "blocked") return null;
	if (dispatchUnwrap.kind === "unwrapped") return resolveShellWrapperCandidate({
		...params,
		argv: dispatchUnwrap.argv,
		depth: params.depth + 1,
		state: params.onDispatchUnwrap?.(params.state, params.argv) ?? params.state
	});
	const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(params.argv);
	if (shellMultiplexerUnwrap.kind === "blocked") return null;
	if (shellMultiplexerUnwrap.kind === "unwrapped") return resolveShellWrapperCandidate({
		...params,
		argv: shellMultiplexerUnwrap.argv,
		depth: params.depth + 1
	});
	return {
		argv: params.argv,
		token0,
		state: params.state
	};
}
function resolveShellWrapperSpecAndArgvInternal(argv, depth) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth,
		state: null
	});
	if (!candidate) return null;
	const baseExecutable = normalizeExecutableToken(candidate.token0);
	const wrapper = findShellWrapperSpec(baseExecutable);
	if (!wrapper) return null;
	const payload = extractShellWrapperPayload(candidate.argv, wrapper, baseExecutable);
	if (!payload) return null;
	return {
		argv: candidate.argv,
		wrapper,
		payload
	};
}
function isWithinDispatchClassificationDepth(depth) {
	return depth <= 4;
}
/** Return true when an executable token names a supported shell wrapper. */
function isShellWrapperExecutable(token) {
	return SHELL_WRAPPER_CANONICAL.has(normalizeExecutableToken(token));
}
function isShellWrapperInvocationInternal(argv, depth) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth,
		state: null
	});
	return candidate ? isShellWrapperExecutable(candidate.token0) : false;
}
/** Return true when argv resolves to a shell wrapper invocation. */
function isShellWrapperInvocation(argv) {
	return isShellWrapperInvocationInternal(argv, 0);
}
/** Detect implicit POSIX startup in the requested shell, including dispatch wrappers. */
function hasPosixShellStartupBeforeInlineCommand(argv) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth: 0,
		state: null
	});
	return Boolean(candidate && POSIX_SHELL_WRAPPER_CANONICAL.has(normalizeExecutableToken(candidate.token0)) && (hasPosixLoginStartupBeforeInlineCommand(candidate.argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixInteractiveStartupBeforeInlineCommand(candidate.argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function normalizeRawCommand(rawCommand) {
	const trimmed = rawCommand?.trim() ?? "";
	return trimmed.length > 0 ? trimmed : null;
}
function findShellWrapperSpec(baseExecutable) {
	for (const spec of SHELL_WRAPPER_SPECS) if (spec.names.has(baseExecutable)) return spec;
	return null;
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
	const unwrapped = argv.slice(appletIndex);
	if (unwrapped.length === 0) return {
		kind: "blocked",
		wrapper
	};
	return {
		kind: "unwrapped",
		wrapper,
		argv: unwrapped
	};
}
function extractPosixShellInlineCommand(argv, baseExecutable) {
	if (OPAQUE_STARTUP_FILE_SHELL_WRAPPERS.has(baseExecutable)) return null;
	if (baseExecutable === "nu") {
		if (hasNushellStartupOptionBeforeInlineCommand(argv)) return null;
		const attached = extractNushellAttachedInlineCommand(argv);
		if (attached !== null) return attached.trim() || null;
		return extractInlineCommandByFlags(argv, NUSHELL_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	}
	return extractInlineCommandByFlags(argv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
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
	const tail = argv.slice(idx + 1);
	if (tail.length === 0) return null;
	const cmd = tail.join(" ").trim();
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
function extractPowerShellInlineCommand(argv) {
	return resolvePowerShellInlineCommandMatch(argv).command;
}
function extractInlineCommandByFlags(argv, flags, options = {}) {
	return resolveInlineCommandMatch(argv, flags, options).command;
}
function extractShellWrapperPayload(argv, spec, baseExecutable) {
	switch (spec.kind) {
		case "posix": return extractPosixShellInlineCommand(argv, baseExecutable);
		case "cmd": return extractCmdInlineCommand(argv);
		case "powershell": return extractPowerShellInlineCommand(argv);
	}
	throw new Error("Unsupported shell wrapper kind");
}
function isLegacyLoginInlineForm(argv) {
	return argv[1]?.trim() === "-lc";
}
function isLegacyShLoginInlineForm(argv, baseExecutable) {
	return baseExecutable === "sh" && isLegacyLoginInlineForm(argv);
}
function formatShellWrapperArgv(argv) {
	return argv.map((arg) => {
		if (arg.length === 0) return "\"\"";
		return /\s|"/.test(arg) ? `"${arg.replace(/"/g, "\\\"")}"` : arg;
	}).join(" ");
}
function startupWrapperRequiresFullArgv(params) {
	if (params.spec.kind !== "posix") return false;
	if (params.baseExecutable === "fish" && hasFishInitCommandOption(params.argv)) return true;
	if (params.baseExecutable === "nu") {
		if (hasNushellLoginStartupBeforeInlineCommand(params.argv)) return true;
		return hasNushellInteractiveStartupBeforeInlineCommand(params.argv);
	}
	const inlineCommandFlags = params.baseExecutable === "nu" ? NUSHELL_INLINE_COMMAND_FLAGS : POSIX_INLINE_COMMAND_FLAGS;
	if (LOGIN_STARTUP_SHELL_WRAPPER_CANONICAL.has(params.baseExecutable) && hasPosixLoginStartupBeforeInlineCommand(params.argv, inlineCommandFlags)) return params.includeLegacyLoginInlineForm || !isLegacyShLoginInlineForm(params.argv, params.baseExecutable);
	return hasPosixInteractiveStartupBeforeInlineCommand(params.argv, inlineCommandFlags);
}
function hasNushellLoginStartupBeforeInlineCommand(argv) {
	return hasNushellStartupModeBeforeInlineCommand(argv, (arg) => {
		const normalized = normalizeLowercaseStringOrEmpty(arg);
		return normalized === "--login" || isNushellShortOption(normalized, "l");
	});
}
function hasNushellInteractiveStartupBeforeInlineCommand(argv) {
	return hasNushellStartupModeBeforeInlineCommand(argv, (arg) => {
		const normalized = normalizeLowercaseStringOrEmpty(arg);
		return normalized === "--interactive" || isNushellShortOption(normalized, "i");
	});
}
function hasNushellStartupModeBeforeInlineCommand(argv, isStartupMode) {
	let sawStartupMode = false;
	for (let i = 1; i < argv.length; i += 1) {
		const arg = argv[i]?.trim() ?? "";
		if (!arg || arg === "--") return false;
		if (isStartupMode(arg)) sawStartupMode = true;
		if (isNushellInlineCommandBoundary(arg)) return sawStartupMode;
		if (!arg.startsWith("-") && !arg.startsWith("+")) return false;
	}
	return false;
}
function isNushellShortOption(arg, option) {
	if (arg.length < 2 || arg[0] !== "-" || arg[1] === "-") return false;
	return arg.slice(1).includes(option);
}
function hasEnvManipulationBeforeShellWrapperInternal(argv, depth, envManipulationSeen) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth,
		state: envManipulationSeen,
		onDispatchUnwrap: (state, wrappedArgv) => state || hasDispatchEnvManipulation(wrappedArgv)
	});
	if (!candidate) return false;
	const wrapper = findShellWrapperSpec(normalizeExecutableToken(candidate.token0));
	if (!wrapper) return false;
	if (!extractShellWrapperPayload(candidate.argv, wrapper, normalizeExecutableToken(candidate.token0))) return false;
	return candidate.state;
}
/** Return true when dispatch wrappers set env before the shell wrapper. */
function hasEnvManipulationBeforeShellWrapper(argv) {
	return hasEnvManipulationBeforeShellWrapperInternal(argv, 0, false);
}
function extractShellWrapperCommandInternal(argv, rawCommand, depth) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth,
		state: null
	});
	if (!candidate) return {
		isWrapper: false,
		command: null
	};
	const baseExecutable = normalizeExecutableToken(candidate.token0);
	const wrapper = findShellWrapperSpec(baseExecutable);
	if (!wrapper) return {
		isWrapper: false,
		command: null
	};
	const payload = extractShellWrapperPayload(candidate.argv, wrapper, baseExecutable);
	if (!payload) return {
		isWrapper: false,
		command: null
	};
	if (wrapper.kind === "posix" && baseExecutable === "fish" && hasFishAttachedCommandOption(candidate.argv)) return {
		isWrapper: true,
		command: null
	};
	const rawMatchesPayload = rawCommand === payload;
	const rawMatchesCanonicalArgv = rawCommand === formatShellWrapperArgv(candidate.argv);
	const allowLegacyShLoginPayloadBinding = isLegacyShLoginInlineForm(candidate.argv, baseExecutable) && (rawMatchesPayload || rawMatchesCanonicalArgv);
	if (startupWrapperRequiresFullArgv({
		argv: candidate.argv,
		spec: wrapper,
		baseExecutable,
		includeLegacyLoginInlineForm: !allowLegacyShLoginPayloadBinding
	})) return {
		isWrapper: true,
		command: null
	};
	const resolved = resolveShellWrapperSpecAndArgvInternal(candidate.argv, depth);
	if (!resolved) return {
		isWrapper: false,
		command: null
	};
	return {
		isWrapper: true,
		command: rawMatchesCanonicalArgv ? resolved.payload : rawCommand ?? resolved.payload
	};
}
/** Resolve the argv segment that should be transported for shell execution. */
function resolveShellWrapperTransportArgv(argv) {
	return resolveShellWrapperSpecAndArgvInternal(argv, 0)?.argv ?? null;
}
/** Extract the raw inline command payload from a shell wrapper argv. */
function extractShellWrapperInlineCommand(argv) {
	return resolveShellWrapperSpecAndArgvInternal(argv, 0)?.payload ?? null;
}
/** Extract a command payload only when it is safe to bind to raw command text. */
function extractBindableShellWrapperInlineCommand(argv, rawCommand) {
	return extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand), 0).command;
}
/** Classify shell wrapper argv and return the approval-display command when safe. */
function extractShellWrapperCommand(argv, rawCommand) {
	return extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand), 0);
}
/** Return true when shell wrapper startup behavior blocks command rebinding. */
function isBlockedShellWrapperCommand(argv, rawCommand) {
	const candidate = resolveShellWrapperCandidate({
		argv,
		depth: 0,
		state: null
	});
	if (!candidate) return false;
	const baseExecutable = normalizeExecutableToken(candidate.token0);
	const wrapper = findShellWrapperSpec(baseExecutable);
	if (!wrapper) return false;
	if (wrapper.kind === "cmd" && hasCmdUnreviewedStartupBeforeInlineCommand(candidate.argv)) return true;
	if (wrapper.kind === "powershell") {
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(candidate.argv);
		if (hasPowerShellProfileStartupBeforeInlineCommand(candidate.argv, valueTokenIndex) || valueTokenIndex !== null && (command === "-" || isPowerShellInlineEncodedCommandFlag(candidate.argv[valueTokenIndex - 1] ?? "") || isPowerShellInlineFileCommandFlag(candidate.argv[valueTokenIndex - 1] ?? ""))) return true;
	}
	if (wrapper.kind === "posix") {
		if (baseExecutable === "fish" && hasFishInitCommandOption(candidate.argv) || baseExecutable === "nu" && hasNushellStartupOptionBeforeInlineCommand(candidate.argv)) return true;
	}
	if (wrapper.kind === "posix" && OPAQUE_STARTUP_FILE_SHELL_WRAPPERS.has(baseExecutable)) return true;
	const extracted = extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand), 0);
	return extracted.isWrapper && extracted.command === null;
}
//#endregion
export { SOURCE_EXECUTABLES as A, resolvePowerShellInlineCommandMatch as C, unwrapDispatchWrappersForResolution as D, resolveDispatchWrapperTrustPlan as E, parseEnvInvocationPrelude as M, resolveCarrierCommandArgv as N, unwrapKnownDispatchWrapperInvocation as O, normalizeExecutableToken as P, resolveInlineCommandMatch as S, isDispatchWrapperExecutable as T, hasPosixInteractiveStartupBeforeInlineCommand as _, extractShellWrapperCommand as a, isPowerShellInlineFileCommandFlag as b, hasPosixShellStartupBeforeInlineCommand as c, isShellWrapperInvocation as d, resolveShellWrapperTransportArgv as f, advancePosixInlineOptionScan as g, POSIX_INLINE_COMMAND_FLAGS as h, extractBindableShellWrapperInlineCommand as i, isEnvAssignmentToken as j, COMMAND_CARRIER_EXECUTABLES as k, isBlockedShellWrapperCommand as l, NUSHELL_INLINE_COMMAND_FLAGS as m, POSIX_SHELL_WRAPPERS as n, extractShellWrapperInlineCommand as o, unwrapKnownShellMultiplexerInvocation as p, POWERSHELL_WRAPPERS as r, hasEnvManipulationBeforeShellWrapper as s, POSIX_PARSEABLE_SHELL_WRAPPERS as t, isShellWrapperExecutable as u, hasPosixLoginStartupBeforeInlineCommand as v, extractEnvAssignmentKeysFromDispatchWrappers as w, isPowerShellInlineRestCommandFlag as x, isDirectShellPositionalCarrierCommand as y };
