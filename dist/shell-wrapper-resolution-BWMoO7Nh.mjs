import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
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
function parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, nonExecutingOptions = /* @__PURE__ */ new Set()) {
	if (token.startsWith("--")) {
		const option = parseInlineOptionToken(token);
		const name = option.name;
		if (standaloneOptions.has(name) || optionsWithValue.has(name) || nonExecutingOptions.has(name)) return [option];
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
	return resolveEnvCarriedArgv(argv);
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
		const normalized = parseInlineOptionToken(token).name;
		if (COMMAND_QUERY_OPTIONS.has(normalized)) return null;
		if (!COMMAND_EXECUTING_OPTIONS.has(normalized)) return null;
	}
	return null;
}
function resolveOptionCarrierArgv(argv) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	const standaloneOptions = executable === "sudo" ? SUDO_STANDALONE_OPTIONS : executable === "doas" ? DOAS_STANDALONE_OPTIONS : executable === "exec" ? EXEC_STANDALONE_OPTIONS : null;
	const optionsWithValue = executable === "sudo" ? SUDO_OPTIONS_WITH_VALUE : executable === "doas" ? DOAS_OPTIONS_WITH_VALUE : executable === "exec" ? EXEC_OPTIONS_WITH_VALUE : null;
	if (!standaloneOptions || !optionsWithValue) return null;
	for (let index = 1; index < argv.length; index += 1) {
		const token = argv[index] ?? "";
		if (token === "--" || !token.startsWith("-")) {
			const commandArgv = argv.slice(token === "--" ? index + 1 : index);
			return executable === "exec" ? commandArgv : stripSudoEnvAssignmentsFromCommandArgv(executable, commandArgv);
		}
		const option = parseCarrierOptionToken(token, standaloneOptions, optionsWithValue, executable === "sudo" ? SUDO_NON_EXEC_OPTIONS : void 0);
		if (!option) return null;
		const consumeNextValue = knownCarrierOptionConsumesNextValue(option, optionsWithValue, executable === "sudo" ? SUDO_NON_EXEC_OPTIONS : void 0);
		if (consumeNextValue === null) return null;
		if (consumeNextValue) index += 1;
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
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			const { name: flag } = parseInlineOptionToken(lower);
			if (params.onFlag) return params.onFlag(flag, lower);
			if (params.flagOptions?.has(flag)) return "continue";
			if (params.optionsWithValue?.has(flag)) return lower.includes("=") ? "continue" : "consume-next";
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
	return scanWrapperInvocation(argv, {
		separators: /* @__PURE__ */ new Set(["--"]),
		onToken: (token, lower) => {
			if (!token.startsWith("-") || token === "-") return "stop";
			return lower === "--help" || lower === "--version" ? "continue" : "invalid";
		}
	});
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
function unwrapScriptInvocation(argv, platform = process.platform) {
	if (platform !== "darwin" && platform !== "freebsd") return null;
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
	return scanWrapperInvocation(argv, { onToken: (token, lower) => {
		if (!token.startsWith("-") || token === "-") return "stop";
		if (XCRUN_FLAG_OPTIONS.has(lower)) return "continue";
		return "invalid";
	} });
}
const DISPATCH_WRAPPER_SPEC_BY_NAME = new Map([
	{
		name: "arch",
		unwrap: (argv, platform) => supportsDarwinDispatchWrapper(platform) ? unwrapArchInvocation(argv) : null,
		transparentUsage: (_argv, platform) => supportsDarwinDispatchWrapper(platform)
	},
	{
		name: "caffeinate",
		unwrap: (argv) => unwrapDashOptionInvocation(argv, {
			flagOptions: CAFFEINATE_FLAG_OPTIONS,
			optionsWithValue: CAFFEINATE_OPTIONS_WITH_VALUE
		}),
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
		unwrap: (argv) => unwrapDashOptionInvocation(argv, { optionsWithValue: SANDBOX_EXEC_OPTIONS_WITH_VALUE }),
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
		unwrap: (argv) => unwrapDashOptionInvocation(argv, { optionsWithValue: STDBUF_OPTIONS_WITH_VALUE }),
		transparentUsage: true
	},
	{ name: "su" },
	{ name: "sudo" },
	{ name: "systemd-run" },
	{ name: "taskset" },
	{
		name: "time",
		unwrap: (argv) => unwrapDashOptionInvocation(argv, {
			flagOptions: TIME_FLAG_OPTIONS,
			optionsWithValue: TIME_OPTIONS_WITH_VALUE
		}),
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
	const unwrapped = spec.unwrap?.(argv, platform);
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
	if (!spec?.unwrap) return true;
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
function isPosixShortOption(token, option) {
	return token.startsWith("-") && !token.includes("-", 1) && token.includes(option, 1);
}
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
function advancePosixInlineOptionScan(token) {
	const combinedValueCount = combinedSeparateValueOptionCount(token);
	if (combinedValueCount > 0) return 1 + combinedValueCount;
	if (POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token)) return 2;
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
		const combined = options.allowCombinedC ? parseCombinedCommandFlag(token) : null;
		if (combined) {
			if (combined.attachedCommand !== null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const valueTokenIndex = i + 1 + combined.separateValueCount;
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
	return hasPosixStartupModeBeforeInlineCommand(argv, flags, "--interactive", "i");
}
/** Detect POSIX login startup before an inline command flag. */
function hasPosixLoginStartupBeforeInlineCommand(argv, flags) {
	return hasPosixStartupModeBeforeInlineCommand(argv, flags, "--login", "l");
}
function hasPosixStartupModeBeforeInlineCommand(argv, flags, longOption, shortOption) {
	let sawStartupMode = false;
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		if (token === "--") return false;
		if (token === longOption || isPosixShortOption(token, shortOption)) sawStartupMode = true;
		if (flags.has(token) || isCombinedCommandFlag(token)) return sawStartupMode;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
		i += advancePosixInlineOptionScan(token);
	}
	return false;
}
function hasFishOption(argv, matches) {
	for (let i = 1; i < argv.length; i += 1) {
		const token = argv[i]?.trim();
		if (!token) continue;
		if (token === "--") return false;
		if (matches(token)) return true;
		if (!token.startsWith("-") && !token.startsWith("+")) return false;
	}
	return false;
}
/** Detect fish init-command options that run before the inline command. */
function hasFishInitCommandOption(argv) {
	return hasFishOption(argv, (token) => token.startsWith("-C") || token === "--init-command" || token.startsWith("--init-command="));
}
/** Detect fish attached `-cCOMMAND` forms that should not be rebound. */
function hasFishAttachedCommandOption(argv) {
	return hasFishOption(argv, (token) => token.startsWith("-c") && token !== "-c");
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
		if (dispatch.kind === "blocked") return null;
		if (dispatch.kind === "unwrapped") {
			if (inspectEnv) hasEnvManipulation ||= hasDispatchEnvManipulation(argv);
			argv = dispatch.argv;
			continue;
		}
		const multiplexer = unwrapKnownShellMultiplexerInvocation(argv);
		if (multiplexer.kind === "blocked") return null;
		if (multiplexer.kind === "unwrapped") {
			argv = multiplexer.argv;
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
function normalizeRawCommand(rawCommand) {
	const trimmed = rawCommand?.trim() ?? "";
	return trimmed.length > 0 ? trimmed : null;
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
	switch (kind) {
		case "posix": return extractPosixShellInlineCommand(argv, baseExecutable);
		case "cmd": return extractCmdInlineCommand(argv);
		case "powershell": return resolvePowerShellInlineCommandMatch(argv).command;
	}
	throw new Error("Unsupported shell wrapper kind");
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
	if (params.baseExecutable === "nu") {
		if (hasNushellLoginStartupBeforeInlineCommand(params.argv)) return true;
		return hasNushellInteractiveStartupBeforeInlineCommand(params.argv);
	}
	if (POSIX_SHELL_WRAPPER_CANONICAL.has(params.baseExecutable) && hasPosixLoginStartupBeforeInlineCommand(params.argv, POSIX_INLINE_COMMAND_FLAGS)) return params.includeLegacyLoginInlineForm || !isLegacyShLoginInlineForm(params.argv, params.baseExecutable);
	return hasPosixInteractiveStartupBeforeInlineCommand(params.argv, POSIX_INLINE_COMMAND_FLAGS);
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
/** Return true when dispatch wrappers set env before the shell wrapper. */
function hasEnvManipulationBeforeShellWrapper(argv) {
	return resolveShellWrapperPayload(argv, true)?.hasEnvManipulation ?? false;
}
function extractShellWrapperCommandInternal(argv, rawCommand) {
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
	return extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand)).command;
}
/** Classify shell wrapper argv and return the approval-display command when safe. */
function extractShellWrapperCommand(argv, rawCommand) {
	return extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand));
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
	const extracted = extractShellWrapperCommandInternal(argv, normalizeRawCommand(rawCommand));
	return extracted.isWrapper && extracted.command === null;
}
//#endregion
export { COMMAND_CARRIER_EXECUTABLES as A, resolveInlineCommandMatch as C, resolveDispatchWrapperTrustPlan as D, isDispatchWrapperExecutable as E, normalizeExecutableToken as F, isEnvAssignmentToken as M, parseEnvInvocationPrelude as N, unwrapDispatchWrappersForResolution as O, resolveCarrierCommandArgv as P, isPowerShellInlineRestCommandFlag as S, extractEnvAssignmentKeysFromDispatchWrappers as T, advancePosixInlineOptionScan as _, extractShellWrapperCommand as a, isDirectShellPositionalCarrierCommand as b, hasEnvManipulationBeforeShellWrapper as c, isShellWrapperExecutable as d, isShellWrapperInvocation as f, POSIX_INLINE_COMMAND_FLAGS as g, NUSHELL_INLINE_COMMAND_FLAGS as h, extractBindableShellWrapperInlineCommand as i, SOURCE_EXECUTABLES as j, unwrapKnownDispatchWrapperInvocation as k, hasPosixShellStartupBeforeInlineCommand as l, unwrapKnownShellMultiplexerInvocation as m, POSIX_SHELL_WRAPPERS as n, extractShellWrapperInlineCommand as o, resolveShellWrapperTransportArgv as p, POWERSHELL_WRAPPERS as r, formatExecCommand as s, POSIX_PARSEABLE_SHELL_WRAPPERS as t, isBlockedShellWrapperCommand as u, hasPosixInteractiveStartupBeforeInlineCommand as v, resolvePowerShellInlineCommandMatch as w, isPowerShellInlineFileCommandFlag as x, hasPosixLoginStartupBeforeInlineCommand as y };
