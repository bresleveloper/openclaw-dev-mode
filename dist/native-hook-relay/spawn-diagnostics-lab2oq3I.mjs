import { B as resolveGlobalSingleton, M as normalizeLowercaseStringOrEmpty } from "./utils-c2rFzEZe.mjs";
import { d as areDiagnosticsEnabledForProcess } from "./subsystem-Y9GXTYwe.mjs";
import "./runtime-process-entrypoints-BMmG9cQl.mjs";
import "./host-ChyoilB1.mjs";
import "node:child_process";
import "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
function getSpawnBroker() {
	return context.getStore();
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
[...POSIX_INLINE_COMMAND_FLAGS];
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
new Set(expandPowerShellSwitchPrefixForms("noprofile", "nop"));
[
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
];
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
/** Find the PowerShell inline command payload and value token index. */
function resolvePowerShellInlineCommandMatch(argv) {
	return resolveInlineCommandMatch(argv, POWERSHELL_INLINE_COMMAND_FLAGS, {
		isOptionToken: isPowerShellOptionToken,
		restValueFlags: POWERSHELL_INLINE_REST_COMMAND_FLAGS,
		stopAtFirstNonOption: true,
		valueOptions: POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES
	});
}
/** Return true when a PowerShell flag treats the next token as script file text. */
function isPowerShellInlineFileCommandFlag(token) {
	return POWERSHELL_INLINE_FILE_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
//#endregion
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
const OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT = [
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
/** Diagnostics attribute the final command without changing the wrapper's execution policy. */
function resolveOomScoreWrappedCommand(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && (args[1] === OOM_SCORE_WRAP_SCRIPT || args[1] === OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT) && args[2] ? args[2] : void 0;
}
//#endregion
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
const childOperation = resolveGlobalSingleton(Symbol.for("openclaw.childSpawnOperation"), () => new AsyncLocalStorage());
function unscopedProcessOperation(family, name, args) {
	if (args[0] === "--version" || args[0] === "-v" && (family === "node" || family === "bun" || name === "gh")) return "unscoped.version";
	if (family === "powershell" || family === "pwsh") {
		const argv = [name, ...args];
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(argv);
		return command !== null && valueTokenIndex !== null && !isPowerShellInlineFileCommandFlag(argv[valueTokenIndex - 1] ?? "") ? "unscoped.shell-command" : "unscoped.shell";
	}
	if (/^(sh|bash|zsh)$/.test(family)) return resolveInlineCommandMatch([name, ...args], POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "cmd") return args.some((arg) => /^-[a-z]*c$/.test(arg) || /^\/(?:c|k)$/i.test(arg)) ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "node" || family === "bun") return "unscoped.runtime";
	if (family === "other" && /^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(name)) return `unscoped.${name}`;
	return "unscoped.command";
}
function unscopedGitOperation(args) {
	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if ([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) i += 2;
		else if (/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(arg)) i++;
		else if ([
			"--no-pager",
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--literal-pathspecs",
			"--bare"
		].includes(arg)) i++;
		else break;
	}
	const command = args[i] ?? "";
	return /^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(command) ? `unscoped.${command}` : command === "--version" || command === "version" ? "unscoped.version" : "unscoped.other";
}
/** Capture attribution before native preparation; record only after a successful launch. */
function prepareChildProcessSpawnRecorder(command, args = [], sqliteOperation) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const wrappedCommand = resolveOomScoreWrappedCommand(command, args);
	const commandArgs = wrappedCommand ? args.slice(3) : args;
	const name = path.win32.basename(wrappedCommand ?? command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? childOperation.getStore() ?? unscopedGitOperation(commandArgs) : sqliteOperation ?? childOperation.getStore() ?? unscopedProcessOperation(family, name, commandArgs);
	const key = `${family}:${operation}`;
	return () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	};
}
/** Count admitted local and broker launches, excluding failed spawn attempts. */
function recordChildProcessSpawn(command, child, sqliteOperation, args = []) {
	const record = prepareChildProcessSpawnRecorder(command, args, sqliteOperation);
	if (record) child.once("spawn", record);
}
//#endregion
export { getSpawnBroker as n, recordChildProcessSpawn as t };
