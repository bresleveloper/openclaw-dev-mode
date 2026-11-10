import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
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
		const exact = flags.has(comparableToken);
		const combined = !exact && options.allowCombinedC ? parseCombinedCommandFlag(token) : null;
		if (exact || combined) {
			if (combined && combined.attachedCommand !== null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const commandIndex = i + 1 + (combined?.separateValueCount ?? 0);
			const valueTokenIndex = !combined && commandIndex >= argv.length ? null : commandIndex;
			const command = exact && options.restValueFlags?.has(comparableToken) ? argv.slice(i + 1).map((arg) => arg.trim()).join(" ").trim() : argv[commandIndex]?.trim();
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
		if (flags.has(token) || parseCombinedCommandFlag(token) !== null) return sawStartupMode;
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
export { hasFishInitCommandOption as a, hasPowerShellProfileStartupBeforeInlineCommand as c, isPowerShellInlineFileCommandFlag as d, isPowerShellInlineRestCommandFlag as f, hasFishAttachedCommandOption as i, isDirectShellPositionalCarrierCommand as l, resolvePowerShellInlineCommandMatch as m, POSIX_INLINE_COMMAND_FLAGS as n, hasPosixInteractiveStartupBeforeInlineCommand as o, resolveInlineCommandMatch as p, advancePosixInlineOptionScan as r, hasPosixLoginStartupBeforeInlineCommand as s, NUSHELL_INLINE_COMMAND_FLAGS as t, isPowerShellInlineEncodedCommandFlag as u };
