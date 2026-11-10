import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { l as isDirectShellPositionalCarrierCommand, n as POSIX_INLINE_COMMAND_FLAGS, p as resolveInlineCommandMatch } from "./shell-inline-command-DKNYBguD.mjs";
import { r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import { C as parseEnvInvocationPrelude, S as isEnvAssignmentToken, T as normalizeExecutableToken, b as COMMAND_CARRIER_EXECUTABLES, d as isShellWrapperExecutable, o as extractShellWrapperInlineCommand, t as POSIX_PARSEABLE_SHELL_WRAPPERS, w as resolveCarrierCommandArgv, x as SOURCE_EXECUTABLES, y as unwrapKnownDispatchWrapperInvocation } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
import "./exec-wrapper-resolution-CXchNEiE.mjs";
//#region src/infra/command-analysis/inline-eval.ts
const VERSION_SUFFIX_PATTERN = /-?\d+(?:\.\d+)*$/;
const FLAG_INTERPRETER_INLINE_EVAL_SPECS = [
	{
		names: [
			"python",
			"python2",
			"python3",
			"pypy",
			"pypy3"
		],
		exactFlags: /* @__PURE__ */ new Set(["-c"]),
		shortClusterFlags: [{
			label: "-c",
			flag: "c",
			prefixChars: "BEIOPRSbdiqsuvx"
		}]
	},
	{
		names: [
			"node",
			"nodejs",
			"bun",
			"deno"
		],
		exactFlags: /* @__PURE__ */ new Set([
			"-e",
			"--eval",
			"-p",
			"--print"
		])
	},
	{
		names: [
			"awk",
			"gawk",
			"mawk",
			"nawk"
		],
		exactFlags: /* @__PURE__ */ new Set(["-e", "--source"]),
		abbreviatedFlags: [{
			full: "--source",
			min: "--s"
		}]
	},
	{
		names: ["ruby"],
		exactFlags: /* @__PURE__ */ new Set(["-e"]),
		shortClusterFlags: [{
			label: "-e",
			flag: "e",
			prefixChars: "SUWacdlnpsvw",
			allowNumericRecordSeparator: true,
			numericValuePrefixChars: "W"
		}]
	},
	{
		names: ["perl"],
		exactFlags: /* @__PURE__ */ new Set(["-e", "-E"]),
		shortClusterFlags: ["e", "E"].map((flag) => ({
			label: "-e",
			flag,
			prefixChars: "STWXUVacdflnpstuw",
			allowNumericRecordSeparator: true,
			numericValuePrefixChars: "l"
		}))
	},
	{
		names: ["php"],
		exactFlags: /* @__PURE__ */ new Set(["-r"]),
		rawExactFlags: /* @__PURE__ */ new Set([
			"-B",
			"-E",
			"-R"
		])
	},
	{
		names: ["r", "rscript"],
		exactFlags: /* @__PURE__ */ new Set(["-e"])
	},
	{
		names: ["julia"],
		exactFlags: /* @__PURE__ */ new Set([
			"-e",
			"--eval",
			"--print"
		]),
		rawExactFlags: /* @__PURE__ */ new Set(["-E"])
	},
	{
		names: ["elixir", "iex"],
		exactFlags: /* @__PURE__ */ new Set([
			"-e",
			"--eval",
			"--rpc-eval"
		]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["guile"],
		exactFlags: /* @__PURE__ */ new Set(["-c", "-e"]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["groovy"],
		exactFlags: /* @__PURE__ */ new Set(["-e"]),
		joinedFlagDenyExact: /* @__PURE__ */ new Set(["-encoding"]),
		joinedFlagDenyPrefixes: ["-encoding="],
		shortClusterFlags: [{
			label: "-e",
			flag: "e",
			prefixChars: "np"
		}]
	},
	{
		names: ["scala", "scala-cli"],
		exactFlags: /* @__PURE__ */ new Set([
			"-e",
			"--script-snippet",
			"--execute-script",
			"--execute-sc",
			"--execute-scala-script",
			"--scala-snippet",
			"--execute-scala",
			"--java-snippet",
			"--execute-java",
			"--markdown-snippet",
			"--md-snippet",
			"--execute-markdown",
			"--execute-md"
		]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["clojure", "clj"],
		exactFlags: /* @__PURE__ */ new Set(["-e", "--eval"]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["raku", "perl6"],
		exactFlags: /* @__PURE__ */ new Set(["-e"]),
		joinedExactFlags: /* @__PURE__ */ new Set(["-e"]),
		shortClusterFlags: [{
			label: "-e",
			flag: "e",
			prefixChars: "np"
		}]
	},
	{
		names: ["ghc", "ghci"],
		exactFlags: /* @__PURE__ */ new Set(["-e"]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["erl", "werl"],
		exactFlags: /* @__PURE__ */ new Set([
			"-eval",
			"-run",
			"-s"
		]),
		joinedExactFlags: /* @__PURE__ */ new Set()
	},
	{
		names: ["gdb"],
		exactFlags: /* @__PURE__ */ new Set([
			"-ex",
			"-iex",
			"-eiex",
			"-eval-command",
			"--eval-command",
			"-init-eval-command",
			"--init-eval-command",
			"-early-init-eval-command",
			"--early-init-eval-command"
		]),
		abbreviatedFlags: [
			{
				full: "-eval-command",
				min: "-ev"
			},
			{
				full: "--eval-command",
				min: "--ev"
			},
			{
				full: "-init-eval-command",
				min: "-init-e"
			},
			{
				full: "--init-eval-command",
				min: "--init-e"
			},
			{
				full: "-early-init-eval-command",
				min: "-early-init-e"
			},
			{
				full: "--early-init-eval-command",
				min: "--early-init-e"
			}
		],
		prefixFlags: [
			{
				label: "-ex",
				prefix: "-ex="
			},
			{
				label: "-iex",
				prefix: "-iex="
			},
			{
				label: "-eiex",
				prefix: "-eiex="
			},
			{
				label: "-eval-command",
				prefix: "-eval-command="
			},
			{
				label: "-init-eval-command",
				prefix: "-init-eval-command="
			},
			{
				label: "-early-init-eval-command",
				prefix: "-early-init-eval-command="
			}
		]
	},
	{
		names: ["expect"],
		exactFlags: /* @__PURE__ */ new Set(["-c"])
	},
	{
		names: ["lua"],
		exactFlags: /* @__PURE__ */ new Set(["-e"])
	},
	{
		names: ["osascript"],
		exactFlags: /* @__PURE__ */ new Set(["-e"])
	},
	{
		names: ["find"],
		exactFlags: /* @__PURE__ */ new Set([
			"-exec",
			"-execdir",
			"-ok",
			"-okdir"
		]),
		scanPastDoubleDash: true
	},
	{
		names: ["make", "gmake"],
		exactFlags: /* @__PURE__ */ new Set([
			"-f",
			"--file",
			"--makefile",
			"--eval"
		]),
		rawExactFlags: /* @__PURE__ */ new Set(["-E"]),
		abbreviatedFlags: [{
			full: "--eval",
			min: "--ev"
		}],
		prefixFlags: [{
			label: "-f",
			prefix: "-f"
		}]
	},
	{
		names: ["sed", "gsed"],
		exactFlags: /* @__PURE__ */ new Set(),
		rawExactFlags: /* @__PURE__ */ new Set(["-e"])
	}
];
const POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS = [
	{
		names: [
			"awk",
			"gawk",
			"mawk",
			"nawk"
		],
		fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
		fileFlagPrefixes: ["-f", "--file="],
		exactValueFlags: /* @__PURE__ */ new Set([
			"-f",
			"--file",
			"-F",
			"--field-separator",
			"-v",
			"--assign",
			"-i",
			"--include",
			"-l",
			"--load",
			"-W"
		]),
		flag: "<program>"
	},
	{
		names: ["xargs"],
		exactValueFlags: /* @__PURE__ */ new Set([
			"-a",
			"--arg-file",
			"-d",
			"--delimiter",
			"-E",
			"-I",
			"-L",
			"--max-lines",
			"-n",
			"--max-args",
			"-P",
			"--max-procs",
			"-s",
			"--max-chars"
		]),
		flag: "<command>"
	},
	{
		names: ["sed", "gsed"],
		fileFlags: /* @__PURE__ */ new Set(["-f", "--file"]),
		fileFlagPrefixes: ["-f", "--file="],
		exactValueFlags: /* @__PURE__ */ new Set([
			"-f",
			"--file",
			"-l",
			"--line-length"
		]),
		flag: "<program>"
	}
];
const INTERPRETER_ALLOWLIST_NAMES = new Set(FLAG_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names).concat(POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS.flatMap((entry) => entry.names)));
function interpreterNameVariants(value) {
	const stripped = value.replace(VERSION_SUFFIX_PATTERN, "");
	return stripped === value || stripped.length < 2 ? [value] : [value, stripped];
}
function createInlineEvalHit(executable, argv, flag) {
	return {
		executable,
		normalizedExecutable: normalizeExecutableToken(executable),
		flag,
		argv
	};
}
function matchAbbreviatedFlag(spec, lower) {
	const optionName = lower.split("=", 1)[0] ?? lower;
	for (const flag of spec.abbreviatedFlags ?? []) if (optionName.length >= flag.min.length && flag.full.startsWith(optionName) && flag.min.startsWith(optionName.slice(0, flag.min.length))) return flag.full;
	return null;
}
function matchJoinedExactFlag(spec, token, lower) {
	if (spec.joinedFlagDenyExact?.has(lower) === true || spec.joinedFlagDenyPrefixes?.some((prefix) => lower.startsWith(prefix)) === true) return null;
	for (const flag of spec.exactFlags) if (flag.startsWith("--")) {
		const prefix = `${flag}=`;
		if (lower.startsWith(prefix) && lower.length > prefix.length) return flag;
	}
	return matchJoinedShortFlag(spec.joinedExactFlags ?? spec.exactFlags, token);
}
function matchJoinedShortFlag(flags, token, preserveCase = false) {
	for (const flag of flags) if (/^-[A-Za-z]$/.test(flag) && token.startsWith(flag) && token.length > flag.length) return preserveCase ? flag : normalizeLowercaseStringOrEmpty(flag);
	return null;
}
function matchShortClusterFlag(spec, token) {
	if (!token.startsWith("-") || token.startsWith("--")) return null;
	for (const clusterFlag of spec.shortClusterFlags ?? []) {
		const index = token.indexOf(clusterFlag.flag, 2);
		if (index < 2) continue;
		if (isShortClusterPrefixAllowed(clusterFlag, token.slice(1, index))) return clusterFlag.label;
	}
	return null;
}
function isShortClusterPrefixAllowed(clusterFlag, prefix) {
	for (let index = 0; index < prefix.length; index += 1) {
		const char = prefix[index] ?? "";
		if (clusterFlag.prefixChars.includes(char)) {
			if (clusterFlag.numericValuePrefixChars?.includes(char) !== true) continue;
		} else if (!(clusterFlag.allowNumericRecordSeparator === true && char === "0")) return false;
		while (/^[0-9]$/.test(prefix[index + 1] ?? "")) index += 1;
	}
	return true;
}
function detectInterpreterInlineEvalArgv(argv) {
	if (!Array.isArray(argv) || argv.length === 0) return null;
	const executable = argv[0]?.trim();
	if (!executable) return null;
	const names = interpreterNameVariants(normalizeExecutableToken(executable));
	const spec = FLAG_INTERPRETER_INLINE_EVAL_SPECS.find((entry) => names.some((name) => entry.names.includes(name)));
	if (spec) for (let idx = 1; idx < argv.length; idx += 1) {
		const token = argv[idx]?.trim();
		if (!token) continue;
		if (token === "--") {
			if (spec.scanPastDoubleDash) continue;
			break;
		}
		const rawFlag = spec.rawExactFlags?.has(token) ? token : matchJoinedShortFlag(spec.rawExactFlags ?? [], token, true);
		if (rawFlag) return createInlineEvalHit(executable, argv, rawFlag);
		const lower = normalizeLowercaseStringOrEmpty(token);
		const flag = matchAbbreviatedFlag(spec, lower) || (spec.exactFlags.has(lower) ? lower : null) || matchJoinedExactFlag(spec, token, lower) || matchShortClusterFlag(spec, token) || spec.prefixFlags?.find(({ prefix }) => lower.startsWith(prefix) && lower.length > prefix.length)?.label;
		if (flag) return createInlineEvalHit(executable, argv, flag);
	}
	const positionalSpec = POSITIONAL_INTERPRETER_INLINE_EVAL_SPECS.find((entry) => names.some((name) => entry.names.includes(name)));
	if (!positionalSpec) return null;
	for (let idx = 1; idx < argv.length; idx += 1) {
		const token = argv[idx]?.trim();
		if (!token) continue;
		if (token === "--") {
			if (!argv[idx + 1]?.trim()) return null;
			return createInlineEvalHit(executable, argv, positionalSpec.flag);
		}
		if (positionalSpec.fileFlags?.has(token)) return null;
		if (positionalSpec.fileFlagPrefixes?.some((prefix) => token.startsWith(prefix) && token.length > prefix.length)) return null;
		if (positionalSpec.exactValueFlags?.has(token)) {
			idx += 1;
			continue;
		}
		if (token.startsWith("-")) continue;
		return createInlineEvalHit(executable, argv, positionalSpec.flag);
	}
	return null;
}
function describeInterpreterInlineEval(hit) {
	if (hit.flag === "<command>") return `${hit.normalizedExecutable} inline command`;
	if (hit.flag === "<program>") return `${hit.normalizedExecutable} inline program`;
	return `${hit.normalizedExecutable} ${hit.flag}`;
}
function isInterpreterLikeAllowlistPattern(pattern) {
	const trimmed = normalizeLowercaseStringOrEmpty(pattern);
	if (!trimmed) return false;
	if (interpreterNameVariants(normalizeExecutableToken(trimmed)).some((candidate) => INTERPRETER_ALLOWLIST_NAMES.has(candidate))) return true;
	const basename = trimmed.replace(/\\/g, "/").split("/").pop() ?? trimmed;
	return interpreterNameVariants((basename.endsWith(".exe") ? basename.slice(0, -4) : basename).replace(/[*?[\]{}()]/g, "").replace(/[.-]+$/, "")).some((candidate) => INTERPRETER_ALLOWLIST_NAMES.has(candidate));
}
//#endregion
//#region src/infra/command-analysis/risks.ts
function commandArgvKey(argv) {
	return argv.join("\0");
}
function isCommandCarrierExecutable(executable) {
	return COMMAND_CARRIER_EXECUTABLES.has(executable) || executable === "exec";
}
function buildCommandPayloadArgvCandidates(argv, seenArgv = /* @__PURE__ */ new Set()) {
	const key = commandArgvKey(argv);
	if (seenArgv.has(key)) return argv.length > 0 ? [argv] : [];
	seenArgv.add(key);
	const assignmentStrippedArgv = stripLeadingEnvAssignments(argv);
	const carriedArgv = resolveCarrierCommandArgv(assignmentStrippedArgv, 0, { includeExec: true });
	const executableArgv = carriedArgv ?? assignmentStrippedArgv;
	const carriedCandidates = carriedArgv ? buildCommandPayloadArgvCandidates(carriedArgv, seenArgv) : [];
	const shellWrapperPayload = extractShellWrapperInlineCommand(executableArgv);
	const shellWrapperCandidates = shellWrapperPayload ? (() => {
		const innerArgv = splitShellArgs(shellWrapperPayload);
		return innerArgv ? buildCommandPayloadArgvCandidates(innerArgv, seenArgv) : [[shellWrapperPayload]];
	})() : [];
	const seenCandidates = /* @__PURE__ */ new Set();
	return [
		...executableArgv.length > 0 ? [executableArgv] : [],
		...carriedCandidates,
		...shellWrapperCandidates
	].filter((candidate) => {
		if (candidate.length === 0) return false;
		const candidateKey = commandArgvKey(candidate);
		if (seenCandidates.has(candidateKey)) return false;
		seenCandidates.add(candidateKey);
		return true;
	});
}
function stripLeadingEnvAssignments(argv) {
	let index = 0;
	while (index < argv.length && isEnvAssignmentToken(argv[index] ?? "")) index += 1;
	return index > 0 ? argv.slice(index) : argv;
}
function normalizeShellPositionalToken(token) {
	const match = (token.length >= 2 && token.startsWith("\"") && token.endsWith("\"") ? token.slice(1, -1) : token).match(/^\$(?:([0-9@*])|\{([0-9@*])\})$/u);
	const value = match?.[1] ?? match?.[2];
	if (value === void 0) return null;
	if (value === "@") return { kind: "all" };
	if (value === "*") return { kind: "star" };
	if (value === "0") return { kind: "zero" };
	const index = parseStrictPositiveInteger(value);
	return index === void 0 ? null : {
		kind: "index",
		index
	};
}
function resolveShellPositionalCarrierPlan(command) {
	const trimmed = command.trim();
	if (!isDirectShellPositionalCarrierCommand(trimmed)) return null;
	const tokens = trimmed.match(/"[^"]*"|\S+/gu) ?? [];
	let index = 0;
	if (tokens[index] === "exec") {
		index += 1;
		if (tokens[index] === "--") index += 1;
	}
	if (normalizeShellPositionalToken(tokens[index] ?? "")?.kind !== "zero") return null;
	index += 1;
	const indexes = [0];
	for (; index < tokens.length; index += 1) {
		const positional = normalizeShellPositionalToken(tokens[index] ?? "");
		if (positional === null || positional.kind === "zero" || positional.kind === "star") return null;
		if (positional.kind === "all") return { kind: "all" };
		if (positional.kind === "index") indexes.push(positional.index);
	}
	return {
		kind: "indexes",
		indexes
	};
}
function detectShellPositionalCarrierInlineEvalArgvInternal(argv, seenArgv) {
	const executableArgv = stripLeadingEnvAssignments(argv);
	const executable = normalizeExecutableToken(executableArgv[0] ?? "");
	if (!isShellWrapperExecutable(executable)) return null;
	if (!POSIX_PARSEABLE_SHELL_WRAPPERS.has(executable)) return null;
	const key = commandArgvKey(executableArgv);
	if (seenArgv.has(key)) return null;
	seenArgv.add(key);
	const inlineMatch = resolveInlineCommandMatch(executableArgv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	if (inlineMatch.valueTokenIndex === null || !inlineMatch.command) return null;
	const carrierPlan = resolveShellPositionalCarrierPlan(inlineMatch.command);
	if (!carrierPlan) return null;
	const positionalArgv = executableArgv.slice(inlineMatch.valueTokenIndex + 1);
	const carriedArgv = (carrierPlan.kind === "all" ? positionalArgv : carrierPlan.indexes.map((index) => positionalArgv[index] ?? "")).map((token) => token.trim()).filter((token) => token.length > 0);
	if (carriedArgv.length === 0) return null;
	return detectInlineEvalArgvInternal(carriedArgv, seenArgv);
}
function detectCarrierInlineEvalArgvInternal(argv, seenArgv) {
	const executableArgv = stripLeadingEnvAssignments(argv);
	const key = commandArgvKey(executableArgv);
	if (seenArgv.has(key)) return null;
	seenArgv.add(key);
	const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(executableArgv);
	if (dispatchUnwrap.kind === "unwrapped") return detectInlineEvalArgvInternal(dispatchUnwrap.argv, seenArgv);
	if (!isCommandCarrierExecutable(normalizeExecutableToken(executableArgv[0] ?? ""))) return null;
	const carriedArgv = resolveCarrierCommandArgv(executableArgv, 0, { includeExec: true });
	if (!carriedArgv) return null;
	return detectInlineEvalArgvInternal(carriedArgv, seenArgv);
}
function detectCarrierInlineEvalArgv(argv) {
	return detectCarrierInlineEvalArgvInternal(argv, /* @__PURE__ */ new Set());
}
function detectInlineEvalArgvInternal(argv, seenArgv) {
	if (!Array.isArray(argv)) return null;
	return detectInterpreterInlineEvalArgv(argv) ?? detectShellPositionalCarrierInlineEvalArgvInternal(argv, seenArgv) ?? detectCarrierInlineEvalArgvInternal(argv, seenArgv);
}
function detectInlineEvalArgv(argv) {
	return detectInlineEvalArgvInternal(argv, /* @__PURE__ */ new Set());
}
function detectInlineEvalInSegments(segments) {
	for (const segment of segments) {
		const hit = detectInlineEvalArgv(segment.resolution?.effectiveArgv ?? segment.argv) ?? detectInlineEvalArgv(segment.argv);
		if (hit) return hit;
	}
	return null;
}
function detectCommandCarrierArgv(argv) {
	const executable = argv[0];
	if (!executable) return [];
	const normalizedExecutable = normalizeExecutableToken(executable);
	const hits = [];
	if (normalizedExecutable === "find") {
		const flag = argv.find((arg) => [
			"-exec",
			"-execdir",
			"-ok",
			"-okdir"
		].includes(arg));
		if (flag) hits.push({
			command: executable,
			flag
		});
	}
	if (normalizedExecutable === "xargs") hits.push({ command: normalizedExecutable });
	if (unwrapKnownDispatchWrapperInvocation(argv).kind === "blocked") hits.push({ command: normalizedExecutable });
	const splitStringFlag = detectEnvSplitStringFlag(argv);
	if (splitStringFlag) hits.push({
		command: normalizedExecutable,
		flag: splitStringFlag
	});
	return hits;
}
function detectEnvSplitStringFlag(argv) {
	if (normalizeExecutableToken(argv[0] ?? "") !== "env") return null;
	const parsed = parseEnvInvocationPrelude(argv);
	if (!parsed?.splitArgv) return null;
	for (const arg of argv.slice(1, parsed.commandIndex)) {
		const token = arg.trim();
		if (token === "-S" || token === "-s") return token;
		if (token === "--split-string") return "--split-string";
		if (token.startsWith("--split-string=") || token.startsWith("-S") && token.length > 2) return token.startsWith("--") ? "--split-string" : "-S";
		if (token.startsWith("-") && !token.startsWith("--")) for (const option of token.slice(1)) {
			if (option === "S") return "-S";
			if (option === "s") return "-s";
		}
	}
	return null;
}
function detectShellWrapperThroughCarrierArgv(argv, shellCommandFlag) {
	const executable = normalizeExecutableToken(argv[0] ?? "");
	if (!isCommandCarrierExecutable(executable)) return null;
	const carriedArgv = resolveCarrierCommandArgv(argv, 0, { includeExec: true });
	if (!carriedArgv) return null;
	if (isShellWrapperExecutable(carriedArgv[0] ?? "") && shellCommandFlag(carriedArgv, 1)) return executable;
	return detectShellWrapperThroughCarrierArgv(carriedArgv, shellCommandFlag) ? executable : null;
}
function detectCarriedShellBuiltinArgv(argv) {
	if (!isCommandCarrierExecutable(normalizeExecutableToken(argv[0] ?? ""))) return null;
	const carriedArgv = resolveCarrierCommandArgv(argv, 0, { includeExec: true });
	if (!carriedArgv) return null;
	const nestedCarrierHit = detectCarriedShellBuiltinArgv(carriedArgv);
	if (nestedCarrierHit) return nestedCarrierHit;
	const carriedCommand = carriedArgv[0];
	const normalizedCarriedCommand = carriedCommand ? normalizeExecutableToken(carriedCommand) : void 0;
	if (normalizedCarriedCommand === "eval") return { kind: "eval" };
	if (normalizedCarriedCommand && SOURCE_EXECUTABLES.has(normalizedCarriedCommand)) return {
		kind: "source",
		command: normalizedCarriedCommand
	};
	return null;
}
//#endregion
export { detectInlineEvalArgv as a, describeInterpreterInlineEval as c, detectCommandCarrierArgv as i, isInterpreterLikeAllowlistPattern as l, detectCarriedShellBuiltinArgv as n, detectInlineEvalInSegments as o, detectCarrierInlineEvalArgv as r, detectShellWrapperThroughCarrierArgv as s, buildCommandPayloadArgvCandidates as t };
