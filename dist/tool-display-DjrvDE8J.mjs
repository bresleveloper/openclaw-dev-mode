import { x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { f as shortenHomeInString } from "./utils-aKqR_F_U.mjs";
import { b as redactToolPayloadText, y as redactToolDetail } from "./redact-B5EGyLvV.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-CXyAxVII.mjs";
//#region src/agents/tool-display-exec-shell.ts
/**
* Lightweight shell parsing helpers for exec display summaries.
*
* Handles common quoting, wrapper, and preamble shapes for UI labels without validating shell syntax.
*/
/** Removes matching outer single or double quotes from a display token. */
function stripOuterQuotes(value) {
	if (!value) return value;
	const trimmed = value.trim();
	if (trimmed.length >= 2 && (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1).trim();
	return trimmed;
}
/** Separates command arguments from unquoted shell redirects before quote removal. */
function parseShellWords(input, maxWords = 48) {
	const source = input ?? "";
	const result = {
		words: [],
		unsupported: false
	};
	let current = "";
	let quote;
	let previousUnquotedDollar = false;
	let started = false;
	let protectedWord = false;
	let redirectOperand = false;
	const flush = () => {
		if (started) {
			if (!redirectOperand) result.words.push(current);
			redirectOperand = false;
		}
		current = "";
		started = false;
		protectedWord = false;
	};
	for (let index = 0; index < source.length; index += 1) {
		const char = source.charAt(index);
		const next = source.charAt(index + 1);
		const wasUnquotedDollar = previousUnquotedDollar;
		previousUnquotedDollar = false;
		if (quote === "'") {
			if (char === quote) quote = void 0;
			else current += char;
			continue;
		}
		if (char === "\\" && (!quote || quote === "ansi-c" || /[$`"\\\n]/u.test(next))) {
			if (!next) {
				result.unsupported = true;
				break;
			}
			index += 1;
			if (next !== "\n") {
				current += next;
				started = protectedWord = true;
			} else previousUnquotedDollar = wasUnquotedDollar;
			continue;
		}
		if (quote) {
			if (char === (quote === "ansi-c" ? "'" : quote)) quote = void 0;
			else current += char;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char === "'" && wasUnquotedDollar ? "ansi-c" : char;
			started = protectedWord = true;
			continue;
		}
		if (/\s/u.test(char)) {
			flush();
			if (result.words.length >= maxWords) return result;
			continue;
		}
		if (char === "#" && !started) break;
		if (char === "<" || char === ">" || char === "&" && next === ">") {
			if (next === "(") result.unsupported = true;
			if (!protectedWord && /^(?:\d+|\{[A-Za-z_][A-Za-z0-9_]*\})$/u.test(current)) {
				current = "";
				started = false;
			}
			flush();
			let operator = char;
			if (char === "&") {
				operator += next;
				index += 1;
				if (source.charAt(index + 1) === ">") {
					operator += ">";
					index += 1;
				}
			} else if (next === char || next === "&" || char === "<" && next === ">" || char === ">" && next === "|") {
				operator += next;
				index += 1;
				if (operator === "<<" && (source.charAt(index + 1) === "-" || source.charAt(index + 1) === "<")) operator += source.charAt(++index);
			}
			if (operator.startsWith("<<")) result.hereInput = operator === "<<<" ? "here-string" : "heredoc";
			redirectOperand = true;
			continue;
		}
		current += char;
		started = true;
		previousUnquotedDollar = char === "$";
	}
	flush();
	result.unsupported ||= quote !== void 0 || redirectOperand;
	return result;
}
/** Returns a normalized basename for a command token. */
function binaryName(token) {
	if (!token) return;
	const cleaned = stripOuterQuotes(token) ?? token;
	const segment = cleaned.split(/[/]/).at(-1) ?? cleaned;
	return normalizeLowercaseStringOrEmpty(segment);
}
/** Parses option boundaries once; callers supply the command's value-taking options. */
function parseShellOptions(words, from = 1, optionsWithValue = []) {
	const positional = [];
	const options = /* @__PURE__ */ new Map();
	const takesValue = new Set(optionsWithValue);
	const record = (name, value) => {
		if (!options.has(name)) options.set(name, value);
	};
	for (let index = from; index < words.length; index += 1) {
		const token = words[index];
		if (token === void 0) break;
		if (token === "--") {
			positional.push(...words.slice(index + 1));
			break;
		}
		if (takesValue.has(token)) record(token, words[++index]);
		else if (token.startsWith("--")) {
			const equals = token.indexOf("=");
			record(equals < 0 ? token : token.slice(0, equals), equals < 0 ? void 0 : token.slice(equals + 1));
		} else if (token.startsWith("-") && token.length > 1) for (let offset = 1; offset < token.length; offset += 1) {
			const name = `-${token[offset]}`;
			if (takesValue.has(name)) {
				record(name, token.slice(offset + 1) || words[++index]);
				break;
			}
			record(name);
		}
		else positional.push(token);
	}
	return {
		positional,
		options
	};
}
/** Reads the first occurrence of any matching short or long option. */
function optionValue(words, names) {
	const { options } = parseShellOptions(words, 1, names);
	for (const [name, value] of options) if (names.includes(name)) return value;
}
/** Returns positional args after consuming options and their values. */
function positionalArgs(words, from = 1, optionsWithValue = []) {
	return parseShellOptions(words, from, optionsWithValue).positional;
}
/** Returns the first positional arg after skipping options and configured option values. */
function firstPositional(words, from = 1, optionsWithValue = []) {
	return positionalArgs(words, from, optionsWithValue)[0];
}
/** Removes leading `env` wrappers and VAR=value assignments from parsed words. */
function trimLeadingEnv(words) {
	if (words.length === 0) return words;
	let index = 0;
	if (binaryName(words[0]) === "env") {
		index = 1;
		while (index < words.length) {
			const token = words[index];
			if (!token) break;
			if (token.startsWith("-")) {
				index += 1;
				continue;
			}
			if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) {
				index += 1;
				continue;
			}
			break;
		}
		return words.slice(index);
	}
	while (index < words.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words.at(index) ?? "")) index += 1;
	return words.slice(index);
}
/** Unwraps common `sh -c`/`bash -lc` command wrappers for display parsing. */
function unwrapShellWrapper(command) {
	const { words } = parseShellWords(command, 10);
	if (words.length < 3) return command;
	const bin = binaryName(words[0]);
	if (!(bin === "bash" || bin === "sh" || bin === "zsh" || bin === "fish")) return command;
	const flagIndex = words.findIndex((token, index) => index > 0 && (token === "-c" || token === "-lc" || token === "-ic"));
	if (flagIndex === -1) return command;
	const inner = words.slice(flagIndex + 1).join(" ").trim();
	return inner ? stripOuterQuotes(inner) ?? command : command;
}
function parseHeredocMarker(command, operatorIndex) {
	if (command[operatorIndex] !== "<" || command[operatorIndex - 1] === "<" || command[operatorIndex + 1] !== "<" || command[operatorIndex + 2] === "<") return;
	const stripLeadingTabs = command[operatorIndex + 2] === "-";
	let index = operatorIndex + (stripLeadingTabs ? 3 : 2);
	while (/[ \t]/u.test(command[index] ?? "")) index += 1;
	let value = "";
	let quote;
	for (; index < command.length; index += 1) {
		const char = command[index] ?? "";
		if (quote) {
			if (char === quote) {
				quote = void 0;
				continue;
			}
			if (quote === "\"" && char === "\\" && index + 1 < command.length) {
				index += 1;
				value += command[index] ?? "";
				continue;
			}
			value += char;
			continue;
		}
		if (/[\r\n;&|<>]/u.test(char) || /[ \t]/u.test(char)) break;
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (char === "\\" && index + 1 < command.length) {
			index += 1;
			value += command[index] ?? "";
			continue;
		}
		value += char;
	}
	return value ? {
		value,
		stripLeadingTabs,
		operatorIndex
	} : void 0;
}
function findHeredocBodyEnd(command, marker, bodyStart) {
	let lineStart = bodyStart;
	while (lineStart <= command.length) {
		const lineEnd = command.indexOf("\n", lineStart);
		const end = lineEnd === -1 ? command.length : lineEnd;
		const rawLine = command.slice(lineStart, end).replace(/\r$/u, "");
		if ((marker.stripLeadingTabs ? rawLine.replace(/^\t+/u, "") : rawLine) === marker.value) return end;
		if (lineEnd === -1) return;
		lineStart = lineEnd + 1;
	}
}
function findArithmeticSecondParen(command, firstParenIndex) {
	let index = firstParenIndex + 1;
	while (command[index] === "\\" && command[index + 1] === "\n") index += 2;
	return command[index] === "(" ? index : void 0;
}
function scanTopLevelChars(command, visit, visitHeredocBody) {
	let quote;
	let escaped = false;
	let atWordStart = true;
	let arithmeticDepth = 0;
	let plainSubshellDepth = 0;
	let pendingHeredocs = [];
	let previousUnquotedDollar = false;
	for (let i = 0; i < command.length; i += 1) {
		const char = command.charAt(i);
		const previousWasUnquotedDollar = previousUnquotedDollar;
		previousUnquotedDollar = false;
		if (escaped) {
			escaped = false;
			if (char === "\n") {
				previousUnquotedDollar = previousWasUnquotedDollar;
				if (visit("", i - 1) === false || visit("", i) === false) return;
			} else atWordStart = false;
			continue;
		}
		if (quote === "'") {
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\\") {
			previousUnquotedDollar = previousWasUnquotedDollar;
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === (quote === "ansi-c" ? "'" : quote)) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char === "'" && previousWasUnquotedDollar ? "ansi-c" : char;
			atWordStart = false;
			continue;
		}
		if (char === "#" && atWordStart && arithmeticDepth === 0) {
			const newline = command.indexOf("\n", i + 1);
			if (newline === -1) return;
			i = newline - 1;
			continue;
		}
		const arithmeticSecondParenIndex = arithmeticDepth === 0 && char === "(" && (previousWasUnquotedDollar || atWordStart) ? findArithmeticSecondParen(command, i) : void 0;
		const startsArithmetic = arithmeticSecondParenIndex !== void 0;
		const inArithmetic = arithmeticDepth > 0 || startsArithmetic;
		if (!inArithmetic) {
			const heredoc = parseHeredocMarker(command, i);
			if (heredoc) pendingHeredocs.push(heredoc);
		}
		if (char === "\n" && pendingHeredocs.length > 0) {
			let bodyStart = i + 1;
			let bodyEnd;
			const bodies = [];
			for (const marker of pendingHeredocs) {
				bodyEnd = findHeredocBodyEnd(command, marker, bodyStart);
				if (bodyEnd === void 0) break;
				bodies.push({
					marker,
					start: bodyStart,
					end: bodyEnd
				});
				bodyStart = bodyEnd + 1;
			}
			pendingHeredocs = [];
			if (bodyEnd !== void 0) {
				for (const body of bodies) visitHeredocBody?.(body.marker.operatorIndex, body.start, body.end);
				i = bodyEnd - 1;
				continue;
			}
		}
		if (arithmeticSecondParenIndex !== void 0) {
			if (visit(char, i) === false || visit(command.charAt(arithmeticSecondParenIndex), arithmeticSecondParenIndex) === false) return;
		} else if (!inArithmetic && visit(char, i) === false) return;
		if (char === "(" && (arithmeticDepth > 0 || startsArithmetic)) {
			arithmeticDepth += 1;
			continue;
		}
		if (char === ")" && arithmeticDepth > 0) {
			arithmeticDepth -= 1;
			continue;
		}
		if (inArithmetic) continue;
		if (/\s/u.test(char)) atWordStart = true;
		else if (char === "(") {
			const previous = command[i - 1];
			if (previous === "$" || previous === "<" || previous === ">") atWordStart = true;
			else if (atWordStart) {
				plainSubshellDepth += 1;
				atWordStart = true;
			}
		} else if (char === ")") {
			if (plainSubshellDepth > 0) {
				plainSubshellDepth -= 1;
				atWordStart = true;
			} else atWordStart = false;
		} else if (/[;&|<>]/u.test(char)) atWordStart = true;
		else atWordStart = false;
		previousUnquotedDollar = char === "$";
	}
}
function splitTopLevel(command, separatorLength) {
	const parts = [];
	let segmentStart = 0;
	let sliceStart = 0;
	let chunks = [];
	scanTopLevelChars(command, (char, index) => {
		const length = separatorLength(char, index);
		if (length === 0) return true;
		parts.push(chunks.join("") + command.slice(sliceStart, index));
		segmentStart = index + length;
		sliceStart = segmentStart;
		chunks = [];
		return true;
	}, (operatorIndex, bodyStart, bodyEnd) => {
		if (operatorIndex < segmentStart) {
			chunks.push(command.slice(sliceStart, bodyStart));
			sliceStart = bodyEnd;
		}
	});
	parts.push(chunks.join("") + command.slice(sliceStart));
	return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}
const SHELL_COMMAND_START_PATTERN = String.raw`(?:^|;|\n|(?<!>)\||(?<![<>])&(?![>&]))\s*(?:(?:time(?:\s+-p)?(?:\s+--)?|!)(?:\s+|(?=\()))*`;
const SHELL_TOKEN_END_PATTERN = String.raw`(?=$|[\s;&|()<>])`;
const SHELL_NAMED_COMPOUND_START_PATTERN = `(?:(?:for|while|until|if|case|select|coproc)${SHELL_TOKEN_END_PATTERN}|(?:\\[\\[|\\{)${SHELL_TOKEN_END_PATTERN})`;
const SHELL_COMPOUND_START_PATTERN = `(?:${SHELL_NAMED_COMPOUND_START_PATTERN}|\\((?!\\())`;
const SHELL_FUNCTION_BODY_START_PATTERN = `(?:${SHELL_NAMED_COMPOUND_START_PATTERN}|\\()`;
const SHELL_COMPOUND_AT_COMMAND_START_RE = new RegExp(`${SHELL_COMMAND_START_PATTERN}${SHELL_COMPOUND_START_PATTERN}`, "u");
const SHELL_FUNCTION_NAME_PATTERN = `[^\\s;&|()<>]+`;
const SHELL_FUNCTION_AT_COMMAND_START_RE = new RegExp(`${SHELL_COMMAND_START_PATTERN}function\\s+${SHELL_FUNCTION_NAME_PATTERN}(?:\\s+${SHELL_FUNCTION_BODY_START_PATTERN}|\\((?!\\s*\\)))`, "u");
const SHELL_PAREN_FUNCTION_AT_COMMAND_START_RE = new RegExp(`${SHELL_COMMAND_START_PATTERN}(?:function\\s+)?${SHELL_FUNCTION_NAME_PATTERN}\\s*\\(\\s*\\)\\s*${SHELL_FUNCTION_BODY_START_PATTERN}`, "u");
const SHELL_SUBSTITUTION_COMMAND_START_PATTERN = String.raw`(?:\$\((?!\()|[<>]\()\s*(?:(?:time(?:\s+-p)?(?:\s+--)?|!)(?:\s+|(?=\()))*`;
const SHELL_COMPOUND_AT_SUBSTITUTION_START_RE = new RegExp(`${SHELL_SUBSTITUTION_COMMAND_START_PATTERN}${SHELL_COMPOUND_START_PATTERN}`, "u");
const SHELL_FUNCTION_AT_SUBSTITUTION_START_RE = new RegExp(`${SHELL_SUBSTITUTION_COMMAND_START_PATTERN}function\\s+${SHELL_FUNCTION_NAME_PATTERN}(?:\\s+${SHELL_FUNCTION_BODY_START_PATTERN}|\\((?!\\s*\\)))`, "u");
const SHELL_PAREN_FUNCTION_AT_SUBSTITUTION_START_RE = new RegExp(`${SHELL_SUBSTITUTION_COMMAND_START_PATTERN}(?:function\\s+)?${SHELL_FUNCTION_NAME_PATTERN}\\s*\\(\\s*\\)\\s*${SHELL_FUNCTION_BODY_START_PATTERN}`, "u");
/** Returns whether unquoted shell syntax contains a compound-command introducer. */
function hasShellCompoundCommand(command) {
	const syntaxChars = Array.from({ length: command.length }, () => "\0");
	scanTopLevelChars(command, (char, index) => {
		syntaxChars[index] = char;
		return true;
	});
	const syntax = syntaxChars.join("");
	return SHELL_COMPOUND_AT_COMMAND_START_RE.test(syntax) || SHELL_FUNCTION_AT_COMMAND_START_RE.test(syntax) || SHELL_PAREN_FUNCTION_AT_COMMAND_START_RE.test(syntax) || SHELL_COMPOUND_AT_SUBSTITUTION_START_RE.test(syntax) || SHELL_FUNCTION_AT_SUBSTITUTION_START_RE.test(syntax) || SHELL_PAREN_FUNCTION_AT_SUBSTITUTION_START_RE.test(syntax);
}
/** Splits a command on top-level stage separators such as `;`, `&&`, and `||`. */
function splitTopLevelStages(command) {
	if (hasShellCompoundCommand(command)) return command.trim() ? [command.trim()] : [];
	return splitTopLevel(command, (char, index) => {
		if (char === ";") return 1;
		if ((char === "&" || char === "|") && command[index + 1] === char) return 2;
		return 0;
	});
}
/** Splits a command on top-level single pipes without splitting `||`. */
function splitTopLevelPipes(command) {
	return splitTopLevel(command, (char, index) => {
		if (char === "|" && command[index - 1] !== "|" && command[index - 1] !== ">" && command[index + 1] !== "|") return 1;
		return 0;
	});
}
function parseChdirTarget(head) {
	const { words } = parseShellWords(head, 3);
	const bin = binaryName(words[0]);
	if (bin === "cd" || bin === "pushd") return words[1] || void 0;
}
function isChdirCommand(head) {
	const bin = binaryName(parseShellWords(head, 2).words[0]);
	return bin === "cd" || bin === "pushd" || bin === "popd";
}
function isPopdCommand(head) {
	return binaryName(parseShellWords(head, 2).words[0]) === "popd";
}
/** Removes leading setup commands such as exports and cwd changes from display summaries. */
function stripShellPreamble(command) {
	let rest = command.trim();
	let chdirPath;
	for (let i = 0; i < 4; i += 1) {
		let first;
		scanTopLevelChars(rest, (char, idx) => {
			if (char === "&" && rest[idx + 1] === "&") {
				first = {
					index: idx,
					length: 2
				};
				return false;
			}
			if (char === "|" && rest[idx + 1] === "|") {
				first = {
					index: idx,
					length: 2,
					isOr: true
				};
				return false;
			}
			if (char === ";" || char === "\n") {
				first = {
					index: idx,
					length: 1
				};
				return false;
			}
		});
		const head = (first ? rest.slice(0, first.index) : rest).trim();
		const isChdir = (first ? !first.isOr : i > 0) && isChdirCommand(head);
		if (!(head.startsWith("set ") || head.startsWith("export ") || head.startsWith("unset ") || isChdir)) break;
		if (isChdir) {
			if (isPopdCommand(head)) chdirPath = void 0;
			else chdirPath = parseChdirTarget(head) ?? chdirPath;
		}
		rest = first ? rest.slice(first.index + first.length).trimStart() : "";
		if (!rest) break;
	}
	return {
		command: rest.trim(),
		chdirPath
	};
}
//#endregion
//#region src/agents/tool-display-exec.ts
/**
* Exec tool display summaries.
*
* Turns common shell commands into short redacted labels for tool timelines and transcripts.
*/
const FILE_COMMAND_LABELS = /* @__PURE__ */ new Map([
	["ls", ["list files in", "list files"]],
	["cat", ["show", "show output"]],
	["rm", ["remove", "remove files"]],
	["mkdir", ["create folder", "create folder"]],
	["touch", ["create file", "create file"]]
]);
function summarizeKnownExec(words, hereInput) {
	if (words.length === 0) return "run command";
	const bin = binaryName(words[0]) ?? "command";
	if (bin === "git") {
		const globalWithValue = /* @__PURE__ */ new Set([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		]);
		const gitCwd = optionValue(words, ["-C"]);
		let sub;
		for (let i = 1; i < words.length; i += 1) {
			const token = words[i];
			if (!token) continue;
			if (token === "--") {
				sub = firstPositional(words, i + 1);
				break;
			}
			if (token.startsWith("--")) {
				if (token.includes("=")) continue;
				if (globalWithValue.has(token)) i += 1;
				continue;
			}
			if (token.startsWith("-")) {
				if (globalWithValue.has(token)) i += 1;
				continue;
			}
			sub = token;
			break;
		}
		const mappedSummary = sub ? {
			status: "check git status",
			diff: "check git diff",
			log: "view git history",
			show: "show git object",
			branch: "list git branches",
			checkout: "switch git branch",
			switch: "switch git branch",
			commit: "create git commit",
			pull: "pull git changes",
			push: "push git changes",
			fetch: "fetch git changes",
			merge: "merge git changes",
			rebase: "rebase git branch",
			add: "stage git changes",
			restore: "restore git files",
			reset: "reset git state",
			stash: "stash git changes"
		}[sub] : void 0;
		if (mappedSummary) return mappedSummary;
		if (!sub || sub.startsWith("/") || sub.startsWith("~") || sub.includes("/")) return gitCwd ? `run git command in ${gitCwd}` : "run git command";
		return `run git ${sub}`;
	}
	if (bin === "grep" || bin === "rg" || bin === "ripgrep") {
		const { positional, options } = parseShellOptions(words, 1, [
			"-e",
			"--regexp",
			"-f",
			"--file",
			"-m",
			"--max-count",
			"-A",
			"--after-context",
			"-B",
			"--before-context",
			"-C",
			"--context",
			...bin === "grep" ? [
				"--include",
				"--exclude",
				"--exclude-from",
				"--binary-files",
				"-D",
				"--devices",
				"-d",
				"--directories",
				"--label"
			] : [
				"--pre",
				"--pre-glob",
				"--dfa-size-limit",
				"-E",
				"--encoding",
				"--engine",
				"--regex-size-limit",
				"-j",
				"--threads",
				"-g",
				"--glob",
				"--iglob",
				"--ignore-file",
				"-d",
				"--max-depth",
				"--max-filesize",
				"-t",
				"--type",
				"-T",
				"--type-not",
				"--type-add",
				"--type-clear",
				"--color",
				"--colors",
				"--context-separator",
				"--field-context-separator",
				"--field-match-separator",
				"--hostname-bin",
				"--hyperlink-format",
				"-M",
				"--max-columns",
				"--path-separator",
				"-r",
				"--replace",
				"--sort",
				"--sortr",
				"--generate"
			]
		]);
		if (bin !== "grep" && options.has("--files")) {
			const target = positional.at(-1);
			return target ? `list files in ${target}` : "list files";
		}
		const explicitPattern = [
			"-e",
			"--regexp",
			"-f",
			"--file"
		].some((name) => options.has(name));
		const pattern = options.get("-e") ?? options.get("--regexp") ?? (explicitPattern ? void 0 : positional[0]);
		const target = explicitPattern || positional.length > 1 ? positional.at(-1) : void 0;
		if (pattern) {
			if (isUnsafeSearchSummaryPattern(pattern)) return target ? `search text in ${target}` : "search text";
			return target ? `search "${pattern}" in ${target}` : `search "${pattern}"`;
		}
		return target ? `search text in ${target}` : "search text";
	}
	if (bin === "find") {
		const path = words[1] && !words[1].startsWith("-") ? words[1] : ".";
		const name = optionValue(words, ["-name", "-iname"]);
		return name ? `find files named "${name}" in ${path}` : `find files in ${path}`;
	}
	const fileCommand = FILE_COMMAND_LABELS.get(bin);
	if (fileCommand) {
		const [prefix, fallback] = fileCommand;
		const target = firstPositional(words, 1);
		return target ? `${prefix} ${target}` : fallback;
	}
	if (bin === "head" || bin === "tail") {
		const lines = optionValue(words, ["-n", "--lines"]) ?? words.slice(1).find((token) => /^-\d+$/.test(token))?.slice(1);
		const positional = positionalArgs(words, 1, ["-n", "--lines"]);
		let target = positional.at(-1);
		if (target && /^\d+$/.test(target) && positional.length === 1) target = void 0;
		const side = bin === "head" ? "first" : "last";
		const unit = lines === "1" ? "line" : "lines";
		if (lines && target) return `show ${side} ${lines} ${unit} of ${target}`;
		if (lines) return `show ${side} ${lines} ${unit}`;
		if (target) return `show ${target}`;
		return `show ${bin} output`;
	}
	if (bin === "sed") {
		const expression = optionValue(words, ["-e", "--expression"]);
		const positional = positionalArgs(words, 1, [
			"-e",
			"--expression",
			"-f",
			"--file"
		]);
		const script = expression ?? positional[0];
		const target = expression ? positional[0] : positional[1];
		if (script) {
			const compact = (stripOuterQuotes(script) ?? script).replace(/\s+/g, "");
			const range = compact.match(/^([0-9]+),([0-9]+)p$/);
			if (range) return target ? `print lines ${range[1]}-${range[2]} from ${target}` : `print lines ${range[1]}-${range[2]}`;
			const single = compact.match(/^([0-9]+)p$/);
			if (single) return target ? `print line ${single[1]} from ${target}` : `print line ${single[1]}`;
		}
		return target ? `run sed on ${target}` : "run sed transform";
	}
	if (bin === "printf" || bin === "echo") return "print text";
	if (bin === "cp" || bin === "mv") {
		const positional = positionalArgs(words, 1, [
			"-t",
			"--target-directory",
			"-S",
			"--suffix"
		]);
		const src = positional[0];
		const dst = positional[1];
		const action = bin === "cp" ? "copy" : "move";
		if (src && dst) return `${action} ${src} to ${dst}`;
		if (src) return `${action} ${src}`;
		return `${action} files`;
	}
	if (bin === "curl" || bin === "wget") {
		const url = words.find((token) => /^https?:\/\//i.test(token));
		return url ? `fetch ${url}` : "fetch url";
	}
	if (bin === "npm" || bin === "pnpm" || bin === "yarn" || bin === "bun") {
		const positional = positionalArgs(words, 1, [
			"--prefix",
			"-C",
			"--cwd",
			"--config"
		]);
		const sub = positional[0] ?? "command";
		return {
			install: "install dependencies",
			test: "run tests",
			build: "run build",
			start: "start app",
			lint: "run lint",
			run: positional[1] ? `run ${positional[1]}` : "run script"
		}[sub] ?? `run ${bin} ${sub}`;
	}
	if (bin === "node" || bin === "python" || bin === "python3" || bin === "ruby" || bin === "php") {
		if (hereInput) return `run ${bin} inline script (${hereInput})`;
		if ((bin === "node" ? optionValue(words, ["-e", "--eval"]) : bin === "python" || bin === "python3" ? optionValue(words, ["-c"]) : void 0) !== void 0) return `run ${bin} inline script`;
		const script = firstPositional(words, 1, bin === "node" ? [
			"-e",
			"--eval",
			"-m"
		] : [
			"-c",
			"-e",
			"--eval",
			"-m"
		]);
		if (!script) return `run ${bin}`;
		if (bin === "node") return `${words.includes("--check") || words.includes("-c") ? "check js syntax for" : "run node script"} ${script}`;
		return `run ${bin} ${script}`;
	}
	if (bin === "openclaw") {
		const sub = firstPositional(words, 1);
		return sub ? `run openclaw ${sub}` : "run openclaw";
	}
	const arg = firstPositional(words, 1);
	if (!arg || arg.length > 48) return `run ${bin}`;
	return /^[A-Za-z0-9._/-]+$/.test(arg) ? `run ${bin} ${arg}` : `run ${bin}`;
}
function isUnsafeSearchSummaryPattern(pattern) {
	const trimmed = pattern.trim();
	return !trimmed || pattern.length > 120 || /[\r\n`]/u.test(pattern) || /^Bash failed:/iu.test(trimmed) || containsGeneratedSearchSummary(trimmed);
}
const GENERATED_SEARCH_SUMMARY_FRAGMENT_RE = /^search\s+(?:["']|text(?:\s+in(?:\s|$)|$))/iu;
function containsGeneratedSearchSummary(pattern) {
	return pattern.split(/(?:\||->)/u).some((fragment) => GENERATED_SEARCH_SUMMARY_FRAGMENT_RE.test(fragment.trim()));
}
function summarizePipeline(stage) {
	const summarize = (command) => {
		const parsed = parseShellWords(command);
		return parsed.unsupported ? void 0 : summarizeKnownExec(trimLeadingEnv(parsed.words), parsed.hereInput);
	};
	const pipeline = splitTopLevelPipes(stage);
	if (pipeline.length > 1) {
		const first = summarize(pipeline[0]);
		const last = summarize(pipeline[pipeline.length - 1]);
		if (!first || !last) return;
		return `${first} -> ${last}${pipeline.length > 2 ? ` (+${pipeline.length - 2} steps)` : ""}`;
	}
	return summarize(stage);
}
function collectHeredocTerminators(commandLine) {
	const terminators = [];
	scanTopLevelChars(commandLine, (char, index) => {
		if (char !== "<" || commandLine[index - 1] === "<" || commandLine[index + 1] !== "<" || commandLine[index + 2] === "<") return true;
		const stripLeadingTabs = commandLine[index + 2] === "-";
		const parsed = parseHeredocTerminator(commandLine, index + (stripLeadingTabs ? 3 : 2));
		if (parsed) terminators.push({
			value: parsed,
			stripLeadingTabs
		});
		return true;
	});
	return terminators;
}
function parseHeredocTerminator(commandLine, rawStart) {
	let start = rawStart;
	while (/\s/u.test(commandLine[start] ?? "")) start += 1;
	let value = "";
	let quote;
	for (let index = start; index < commandLine.length; index += 1) {
		const char = commandLine[index] ?? "";
		if (quote) {
			if (char === quote) {
				quote = void 0;
				continue;
			}
			if (quote === "\"" && char === "\\" && index + 1 < commandLine.length) {
				index += 1;
				value += commandLine[index] ?? "";
				continue;
			}
			value += char;
			continue;
		}
		if (/[\s;&|<>]/u.test(char)) break;
		if (char === "'" || char === "\"") {
			quote = char;
			continue;
		}
		if (char === "\\" && index + 1 < commandLine.length) {
			index += 1;
			value += commandLine[index] ?? "";
			continue;
		}
		value += char;
	}
	return value || void 0;
}
function commandWithoutHeredocBodies(command) {
	if (!command.includes("\n")) return;
	const lines = command.split(/\r?\n/u);
	const summaryLines = [];
	let foundHeredoc = false;
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		summaryLines.push(line);
		const terminators = collectHeredocTerminators(line);
		if (terminators.length === 0) continue;
		foundHeredoc = true;
		for (const terminator of terminators) {
			index += 1;
			while (index < lines.length) {
				if ((terminator.stripLeadingTabs ? (lines[index] ?? "").replace(/^\t+/u, "") : lines[index] ?? "") === terminator.value) break;
				index += 1;
			}
		}
	}
	if (!foundHeredoc) return;
	return summaryLines.map((line) => line.trim()).filter(Boolean).join("; ");
}
function normalizePathForDisplay(path) {
	return path.replace(/\\/g, "/").replace(/\/+$/g, "");
}
function classifyWorkspacePath(path) {
	const segments = normalizePathForDisplay(path).split("/").filter(Boolean);
	if (segments.length === 0) return;
	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index];
		if (!segment) continue;
		if (segment === ".openclaw" && segments[index + 1] === "workspace") return "agent";
		if (segment === ".openclaw" && segments[index + 1] === "sandboxes") return "sandbox";
		if (/[-_]workspace$/i.test(segment) && segment.toLowerCase() !== "workspace") return "agent";
		if (/^workspace[-_]/i.test(segment)) return "agent";
	}
	if (segments.includes("Projects") || segments.includes("projects")) return "repo";
	if (segments.at(-1)?.toLowerCase() === "workspace") return "workspace";
}
function formatCwdSuffix(cwd) {
	const workspace = classifyWorkspacePath(cwd);
	if (workspace === "sandbox") return;
	return workspace ? `(${workspace})` : `(in ${cwd})`;
}
function summarizeExecCommand(command) {
	const { command: cleaned, chdirPath } = stripShellPreamble(command);
	if (!cleaned) return chdirPath ? {
		text: "",
		chdirPath
	} : void 0;
	const stages = splitTopLevelStages(commandWithoutHeredocBodies(cleaned) ?? cleaned);
	if (stages.length === 0) return;
	const summaries = stages.map((stage) => summarizePipeline(stage));
	if (summaries.some((summary) => summary === void 0)) return;
	const text = summaries.length === 1 ? summaries.at(0) : summaries.join(" → ");
	if (!text) return;
	return {
		text,
		chdirPath,
		allGeneric: summaries.every((summary) => summary !== void 0 && isGenericSummary(summary))
	};
}
const KNOWN_SUMMARY_PREFIXES = [
	"check git",
	"view git",
	"show git",
	"list git",
	"switch git",
	"create git",
	"pull git",
	"push git",
	"fetch git",
	"merge git",
	"rebase git",
	"stage git",
	"restore git",
	"reset git",
	"stash git",
	"search ",
	"find files",
	"list files",
	"show first",
	"show last",
	"print line",
	"print text",
	"copy ",
	"move ",
	"remove ",
	"create folder",
	"create file",
	"fetch http",
	"install dependencies",
	"run tests",
	"run build",
	"start app",
	"run lint",
	"run openclaw",
	"run node script",
	"run node ",
	"run python",
	"run ruby",
	"run php",
	"run sed",
	"run git ",
	"run npm ",
	"run pnpm ",
	"run yarn ",
	"run bun ",
	"check js syntax"
];
function isGenericSummary(summary) {
	if (summary === "run command") return true;
	if (summary.startsWith("run ")) return !KNOWN_SUMMARY_PREFIXES.some((prefix) => summary.startsWith(prefix));
	return false;
}
function compactRawCommand(raw, maxLength = 120) {
	const oneLine = redactToolPayloadText(raw.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim());
	if (oneLine.length <= maxLength) return oneLine;
	const half = Math.floor((maxLength - 1) / 2);
	return `${sliceUtf16Safe(oneLine, 0, half)}…${sliceUtf16Safe(oneLine, -(maxLength - 1 - half))}`;
}
/** Treat agent-authored titles as bounded, redacted display text, never an outcome. */
function resolveExecTitle(args) {
	const title = asOptionalObjectRecord(args)?.title;
	if (typeof title !== "string") return;
	const text = sanitizeTerminalText(title.replace(/\s+/gu, " ")).trim();
	return sliceUtf16Safe(redactToolPayloadText(text), 0, 120) || void 0;
}
/** Native Codex cells retain their freeform source under input. */
function resolveExecCode(args) {
	const record = asOptionalObjectRecord(args);
	for (const value of [record?.code, record?.input]) if (typeof value === "string" && value.trim()) return value;
}
function resolveExecDetail(args, options) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	const title = options?.detailMode === "raw" ? void 0 : resolveExecTitle(record);
	if (title) return title;
	const code = resolveExecCode(record);
	if (code) return options?.detailMode === "raw" ? compactRawCommand(code) : record.language === "typescript" ? "run TypeScript" : "run JavaScript";
	const raw = typeof record.command === "string" ? record.command.trim() : void 0;
	if (!raw) return;
	const nodeName = record.host === "node" && typeof record.node === "string" && record.node.trim() ? record.node.trim() : void 0;
	const unwrapped = unwrapShellWrapper(raw);
	const compact = compactRawCommand(unwrapped);
	const cwdRaw = typeof record.workdir === "string" ? record.workdir : typeof record.cwd === "string" ? record.cwd : void 0;
	const nodeFragment = nodeName ? `, node: ${nodeName}` : "";
	if (hasShellCompoundCommand(unwrapped)) {
		const cwdSuffix = cwdRaw?.trim() ? formatCwdSuffix(cwdRaw.trim()) : void 0;
		return `${cwdSuffix ? `${compact} ${cwdSuffix}` : compact}${nodeFragment}`;
	}
	const result = summarizeExecCommand(unwrapped) ?? summarizeExecCommand(raw);
	const summary = result?.text || "run command";
	const cwd = cwdRaw?.trim() || result?.chdirPath || void 0;
	const cwdSuffix = cwd ? formatCwdSuffix(cwd) : void 0;
	if (result?.allGeneric !== false && isGenericSummary(summary)) return `${cwdSuffix ? `${compact} ${cwdSuffix}` : compact}${nodeFragment}`;
	const displaySummary = cwdSuffix ? `${summary} ${cwdSuffix}` : summary;
	if (options?.detailMode !== "explain" && compact && compact !== displaySummary && compact !== summary) return `${displaySummary}${nodeFragment}, ${formatInlineCodeSpan(compact)}`;
	return `${displaySummary}${nodeFragment}`;
}
//#endregion
//#region src/agents/tool-display-common.ts
/**
* Shared compact tool-call display helpers.
* Redacts and summarizes arguments into short labels/details for chat and UI
* tool update streams.
*/
/** Normalize a tool name for fallback display. */
function normalizeToolDisplayName(name) {
	return (name ?? "tool").trim();
}
/** Convert a tool identifier into a human-readable title. */
function defaultTitle(name) {
	const cleaned = name.replace(/_/g, " ").trim();
	if (!cleaned) return "Tool";
	const parts = [];
	for (const part of cleaned.split(/\s+/)) parts.push(part.length <= 2 && part.toUpperCase() === part ? part : `${part.at(0)?.toUpperCase() ?? ""}${part.slice(1)}`);
	return parts.join(" ");
}
/** Beyond this nesting depth, a value does not contribute to the compact display preview. */
const TOOL_DISPLAY_ARRAY_DEPTH_LIMIT = 64;
function coerceDisplayValue(value, opts = {}, depth = 0) {
	if (depth > TOOL_DISPLAY_ARRAY_DEPTH_LIMIT) return;
	if (value === null || value === void 0) return;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return;
		const rawLine = normalizeOptionalString(trimmed.split(/\r?\n/, 1)[0]) ?? "";
		if (!rawLine) return;
		const firstLine = redactToolPayloadText(rawLine);
		if (firstLine.length > 160) return `${sliceUtf16Safe(firstLine, 0, 79)}…${sliceUtf16Safe(firstLine, -80)}`;
		return firstLine;
	}
	if (typeof value === "boolean") {
		if (!value && !opts.includeFalsy) return;
		return value ? "true" : "false";
	}
	if (typeof value === "number") {
		if (!Number.isFinite(value)) return;
		if (value === 0 && !opts.includeFalsy) return;
		return String(value);
	}
	if (Array.isArray(value)) {
		const values = [];
		for (const item of value) {
			const display = coerceDisplayValue(item, opts, depth + 1);
			if (!display) continue;
			if (values.length === 3) return `${values.join(", ")}…`;
			values.push(display);
		}
		return values.length > 0 ? values.join(", ") : void 0;
	}
}
function lookupValueByPath(args, path) {
	if (!args || typeof args !== "object") return;
	let current = args;
	for (const segment of path.split(".")) {
		if (!segment) return;
		if (!current || typeof current !== "object") return;
		current = current[segment];
	}
	return current;
}
/** Format a detail path/key into a short display label. */
function formatDetailKey(raw, overrides = {}) {
	let last = "";
	for (const segment of raw.split(".")) if (segment) last = segment;
	last ||= raw;
	const override = overrides[last];
	if (override) return override;
	const spaced = last.replace(/_/g, " ").replace(/-/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
	return normalizeLowercaseStringOrEmpty(spaced) || normalizeLowercaseStringOrEmpty(last);
}
function resolvePathArg(args) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	for (const candidate of [
		record.path,
		record.file_path,
		record.filePath
	]) {
		if (typeof candidate !== "string") continue;
		const trimmed = candidate.trim();
		if (trimmed) return trimmed;
	}
}
function resolveReadDetail(args) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	const path = resolvePathArg(record);
	if (!path) return;
	const offsetRaw = typeof record.offset === "number" && Number.isFinite(record.offset) ? Math.floor(record.offset) : void 0;
	const limitRaw = typeof record.limit === "number" && Number.isFinite(record.limit) ? Math.floor(record.limit) : void 0;
	const offset = offsetRaw !== void 0 ? Math.max(1, offsetRaw) : void 0;
	const limit = limitRaw !== void 0 ? Math.max(1, limitRaw) : void 0;
	if (offset !== void 0 && limit !== void 0) return `${limit === 1 ? "line" : "lines"} ${offset}-${offset + limit - 1} from ${path}`;
	if (offset !== void 0) return `from line ${offset} in ${path}`;
	if (limit !== void 0) return `first ${limit} ${limit === 1 ? "line" : "lines"} of ${path}`;
	return `from ${path}`;
}
function resolveWriteDetail(toolKey, args) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	const path = resolvePathArg(record) ?? normalizeOptionalString(record.url);
	if (!path) return;
	if (toolKey === "attach") return `from ${path}`;
	const destinationPrefix = toolKey === "edit" ? "in" : "to";
	const content = typeof record.content === "string" ? record.content : typeof record.newText === "string" ? record.newText : typeof record.new_string === "string" ? record.new_string : void 0;
	if (content && content.length > 0) return `${destinationPrefix} ${path} (${content.length} chars)`;
	return `${destinationPrefix} ${path}`;
}
function resolveWebSearchDetail(args) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	const queries = collectWebSearchQueries(record);
	const count = typeof record.count === "number" && Number.isFinite(record.count) && record.count > 0 ? Math.floor(record.count) : typeof record.max_results === "number" && Number.isFinite(record.max_results) && record.max_results > 0 ? Math.floor(record.max_results) : typeof record.num_results === "number" && Number.isFinite(record.num_results) && record.num_results > 0 ? Math.floor(record.num_results) : typeof record.limit === "number" && Number.isFinite(record.limit) && record.limit > 0 ? Math.floor(record.limit) : typeof record.top_k === "number" && Number.isFinite(record.top_k) && record.top_k > 0 ? Math.floor(record.top_k) : void 0;
	if (queries.length === 0) return;
	const displayedQueries = queries.slice(0, 3).map((query) => `"${query}"`);
	const queryText = queries.length > displayedQueries.length ? `${displayedQueries.join(", ")}…` : displayedQueries.join(", ");
	return count !== void 0 ? `for ${queryText} (top ${count})` : `for ${queryText}`;
}
function collectWebSearchQueries(record) {
	const queries = [];
	const seen = /* @__PURE__ */ new Set();
	const add = (value) => {
		const normalized = normalizeOptionalString(value);
		if (!normalized || seen.has(normalized)) return;
		seen.add(normalized);
		queries.push(normalized);
	};
	add(record.query);
	add(record.q);
	add(record.search);
	add(record.input);
	add(record.objective);
	for (const key of [
		"search_query",
		"image_query",
		"queries",
		"search_queries"
	]) {
		const value = record[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) {
			if (typeof entry === "string") {
				add(entry);
				continue;
			}
			const entryRecord = asOptionalObjectRecord(entry);
			if (!entryRecord) continue;
			add(entryRecord.query);
			add(entryRecord.q);
			add(entryRecord.search);
		}
	}
	return queries;
}
function parseToolSearchCall(code) {
	const prefixMatch = code.match(/openclaw\.tools\.call\s*\(\s*/s);
	if (!prefixMatch || prefixMatch.index === void 0) return;
	const rest = code.slice(prefixMatch.index + prefixMatch[0].length);
	const targetMatch = rest.match(/^("[^"]{1,240}"|'[^']{1,240}'|[^,)\s]{1,240})/s);
	if (!targetMatch?.[1]) return;
	const afterTarget = rest.slice(targetMatch[0].length);
	const commaIndex = afterTarget.indexOf(",");
	if (commaIndex < 0) return { target: targetMatch[1] };
	const args = afterTarget.slice(commaIndex + 1);
	return {
		target: targetMatch[1],
		args
	};
}
function normalizeToolSearchDisplayToolName(toolName) {
	const value = normalizeOptionalString(toolName);
	if (!value) return;
	const catalogIdMatch = value.match(/^(?:openclaw|mcp|client):[^:]+:(.+)$/s);
	return normalizeOptionalString(catalogIdMatch?.[1]) ?? value;
}
function collectToolSearchDescribeBindings(code) {
	const bindings = /* @__PURE__ */ new Map();
	for (const match of code.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?openclaw\.tools\.describe\s*\(\s*("[^"]{1,240}"|'[^']{1,240}')\s*(?:,|\))/gs)) {
		const variableName = match[1];
		const target = summarizeToolSearchTarget(match[2]);
		if (variableName && target) bindings.set(variableName, target);
	}
	return bindings;
}
function resolveToolSearchCallTarget(code, rawTarget) {
	const target = normalizeOptionalString(rawTarget);
	if (!target) return;
	const idReference = target.match(/^([A-Za-z_$][\w$]*)\.id\b/s);
	if (idReference?.[1]) {
		const describedTarget = collectToolSearchDescribeBindings(code).get(idReference[1]);
		if (describedTarget) return describedTarget;
	}
	return summarizeToolSearchTarget(target);
}
function summarizeToolSearchTarget(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	const literalMatch = value.match(/^[\s]*["']([^"']{1,160})["'][\s]*$/s);
	if (literalMatch?.[1]) return normalizeOptionalString(literalMatch[1]);
	if (value.match(/\.id\b/)) return normalizeOptionalString(value.replace(/\.id\b.*/s, ""));
	const namePropertyMatch = value.match(/name\s*:\s*["']([^"']{1,120})["']/s);
	if (namePropertyMatch?.[1]) return normalizeOptionalString(namePropertyMatch[1]);
	const compact = value.replace(/\s+/g, " ").trim();
	return compact.length <= 80 ? compact : void 0;
}
function parseToolSearchCallArgs(raw) {
	const source = extractObjectLiteralSource(raw);
	if (!source) return;
	const args = {};
	for (const match of source.matchAll(/(?:^|[,{\s])([A-Za-z_$][\w$]*)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|true|false|null|[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?)/gi)) {
		const key = match[1];
		const value = match[2];
		if (!key || value === void 0) continue;
		args[key] = parseSimpleToolSearchArgValue(value);
	}
	return Object.keys(args).length > 0 ? args : void 0;
}
function extractObjectLiteralSource(raw) {
	const value = normalizeOptionalString(raw);
	if (!value) return;
	const start = value.indexOf("{");
	if (start < 0) return;
	let depth = 0;
	let quote;
	let escaped = false;
	for (let i = start; i < value.length; i += 1) {
		const char = value[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (char === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "{") {
			depth += 1;
			continue;
		}
		if (char === "}") {
			depth -= 1;
			if (depth === 0) return value.slice(start, i + 1);
		}
	}
}
function parseSimpleToolSearchArgValue(raw) {
	if (raw === "true") return true;
	if (raw === "false") return false;
	if (raw === "null") return null;
	const numeric = parseStrictFiniteNumber(raw);
	if (numeric !== void 0) return numeric;
	const quote = raw[0];
	const inner = raw.slice(1, -1);
	if (quote === "\"") try {
		return JSON.parse(raw);
	} catch {
		return inner;
	}
	return inner.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
}
function summarizeToolSearchCallInput(raw) {
	const value = normalizeOptionalString(raw)?.replace(/[);\s]+$/g, "").trim();
	if (!value) return;
	const queryMatch = value.match(/query\s*:\s*["']([^"']{1,80})["']/s);
	if (queryMatch?.[1]) return "query " + queryMatch[1].trim();
	const actionMatch = value.match(/action\s*:\s*["']([^"']{1,80})["']/s);
	if (actionMatch?.[1]) return normalizeOptionalString(actionMatch[1]);
	const commandMatch = value.match(/command\s*:\s*["']([^"'\n]{1,120})["']/s);
	if (commandMatch?.[1]) return normalizeOptionalString(commandMatch[1]);
	const sessionMatch = value.match(/sessionId\s*:\s*["']([^"']{1,80})["']/s);
	if (sessionMatch?.[1]) return "session " + sessionMatch[1].trim();
	const idMatch = value.match(/id\s*:\s*["']([^"']{1,80})["']/s);
	if (idMatch?.[1]) return idMatch[1].trim();
}
/** Infer the bridged tool target displayed for tool_search_code snippets. */
function resolveToolSearchCodeDisplayTarget(args) {
	const record = asOptionalObjectRecord(args);
	if (!record || typeof record.code !== "string") return;
	const code = record.code;
	const call = parseToolSearchCall(code);
	if (call) {
		const toolName = resolveToolSearchCallTarget(code, call.target);
		if (!toolName) return {
			toolName: "tool_search_code",
			detail: "call selected tool",
			bridgeVerb: "call"
		};
		return {
			toolName,
			displayToolName: normalizeToolSearchDisplayToolName(toolName),
			displayArgs: parseToolSearchCallArgs(call.args),
			detail: summarizeToolSearchCallInput(call.args),
			bridgeVerb: "call"
		};
	}
	const describeMatch = code.match(/openclaw\.tools\.describe\s*\(\s*([^)]+?)\s*(?:,|\))/s);
	if (describeMatch) {
		const toolName = summarizeToolSearchTarget(describeMatch[1]);
		return toolName ? {
			toolName,
			detail: "describe via tool search",
			bridgeVerb: "describe"
		} : {
			toolName: "tool_search_code",
			detail: "describe selected tool",
			bridgeVerb: "describe"
		};
	}
	const searchMatch = code.match(/openclaw\.tools\.search\s*\(\s*([^)]+?)\s*(?:,|\))/s);
	if (searchMatch) {
		const query = summarizeToolSearchTarget(searchMatch[1]);
		return {
			toolName: "tool_search_code",
			detail: query ? "search " + query : "search tools",
			bridgeVerb: "search"
		};
	}
	return {
		toolName: "tool_search_code",
		detail: "run bridge code"
	};
}
function resolveToolSearchCodeDetail(args) {
	return resolveToolSearchCodeDisplayTarget(args)?.detail;
}
function resolveWebFetchDetail(args) {
	const record = asOptionalObjectRecord(args);
	if (!record) return;
	const url = normalizeOptionalString(record.url);
	if (!url) return;
	const mode = normalizeOptionalString(record.extractMode);
	const maxChars = typeof record.maxChars === "number" && Number.isFinite(record.maxChars) && record.maxChars > 0 ? Math.floor(record.maxChars) : void 0;
	let suffix = "";
	if (mode) suffix = `mode ${mode}`;
	if (maxChars !== void 0) suffix = suffix ? `${suffix}, max ${maxChars} chars` : `max ${maxChars} chars`;
	return suffix ? `from ${url} (${suffix})` : `from ${url}`;
}
function resolveDetailFromKeys(args, keys, opts) {
	if (opts.mode === "first") {
		for (const key of keys) {
			const display = coerceDisplayValue(lookupValueByPath(args, key), opts.coerce);
			if (display) return display;
		}
		return;
	}
	const entries = [];
	for (const key of keys) {
		const display = coerceDisplayValue(lookupValueByPath(args, key), opts.coerce);
		if (!display) continue;
		entries.push({
			label: opts.formatKey ? opts.formatKey(key) : key,
			value: display
		});
	}
	if (entries.length === 0) return;
	if (entries.length === 1) return entries.at(0)?.value;
	const seen = /* @__PURE__ */ new Set();
	const unique = [];
	for (const entry of entries) {
		const token = `${entry.label}:${entry.value}`;
		if (seen.has(token)) continue;
		seen.add(token);
		unique.push(entry);
	}
	const maxEntries = opts.maxEntries ?? 8;
	const parts = [];
	for (let index = 0; index < unique.length && index < maxEntries; index += 1) {
		const entry = unique[index];
		if (entry) parts.push(`${entry.label} ${entry.value}`);
	}
	return parts.join(", ");
}
/** Resolve display verb/detail from tool args and optional display metadata. */
function resolveToolVerbAndDetailForArgs(params) {
	if (isAgentPlanProgressToolName(params.toolKey)) return {};
	const { toolKey, args, meta } = params;
	const action = normalizeOptionalString(asOptionalObjectRecord(params.args)?.action);
	const { spec, fallbackDetailKeys, detailMode, toolDetailMode, detailCoerce, detailMaxEntries, detailFormatKey } = params;
	const actionSpec = spec && action ? spec.actions?.[action] ?? void 0 : void 0;
	const fallbackVerb = toolKey === "web_search" ? "search" : toolKey === "web_fetch" ? "fetch" : toolKey.replace(/_/g, " ").replace(/\./g, " ");
	const verb = normalizeOptionalString(actionSpec?.label ?? action ?? fallbackVerb)?.replace(/_/g, " ");
	let detail;
	if (toolKey === "exec" || toolKey === "bash" || toolKey === "shell") detail = resolveExecDetail(args, { detailMode: toolDetailMode });
	if (!detail && toolKey === "read") detail = resolveReadDetail(args);
	if (!detail && (toolKey === "write" || toolKey === "edit" || toolKey === "attach")) detail = resolveWriteDetail(toolKey, args);
	if (!detail && toolKey === "web_search") detail = resolveWebSearchDetail(args);
	if (!detail && toolKey === "web_fetch") detail = resolveWebFetchDetail(args);
	if (!detail && toolKey === "tool_search_code") detail = resolveToolSearchCodeDetail(args);
	const detailKeys = actionSpec?.detailKeys ?? spec?.detailKeys ?? fallbackDetailKeys ?? [];
	if (!detail && detailKeys.length > 0) detail = resolveDetailFromKeys(args, detailKeys, {
		mode: detailMode,
		coerce: detailCoerce,
		maxEntries: detailMaxEntries,
		formatKey: detailFormatKey
	});
	if (!detail && meta) detail = meta;
	return {
		verb,
		detail
	};
}
//#endregion
//#region src/agents/tool-display-message-config.ts
function displayAction$1(label, detailKeys) {
	return {
		label,
		detailKeys
	};
}
/** Display metadata for the transport-neutral message action surface. */
const MESSAGE_TOOL_DISPLAY_SPEC = {
	emoji: "✉️",
	title: "Message",
	actions: {
		send: displayAction$1("send", [
			"provider",
			"to",
			"media",
			"replyTo",
			"threadId"
		]),
		poll: displayAction$1("poll", [
			"provider",
			"to",
			"pollQuestion"
		]),
		react: displayAction$1("react", [
			"provider",
			"to",
			"messageId",
			"emoji",
			"remove"
		]),
		reactions: displayAction$1("reactions", [
			"provider",
			"to",
			"messageId",
			"limit"
		]),
		read: displayAction$1("read", [
			"provider",
			"to",
			"limit"
		]),
		edit: displayAction$1("edit", [
			"provider",
			"to",
			"messageId"
		]),
		delete: displayAction$1("delete", [
			"provider",
			"to",
			"messageId"
		]),
		pin: displayAction$1("pin", [
			"provider",
			"to",
			"messageId"
		]),
		unpin: displayAction$1("unpin", [
			"provider",
			"to",
			"messageId"
		]),
		"list-pins": displayAction$1("list pins", ["provider", "to"]),
		permissions: displayAction$1("permissions", [
			"provider",
			"channelId",
			"to"
		]),
		"thread-create": displayAction$1("thread create", [
			"provider",
			"channelId",
			"threadName"
		]),
		"thread-list": displayAction$1("thread list", [
			"provider",
			"guildId",
			"channelId"
		]),
		"thread-reply": displayAction$1("thread reply", [
			"provider",
			"channelId",
			"messageId"
		]),
		search: displayAction$1("search", [
			"provider",
			"guildId",
			"query"
		]),
		sticker: displayAction$1("sticker", [
			"provider",
			"to",
			"stickerId"
		]),
		"member-info": displayAction$1("member", [
			"provider",
			"guildId",
			"userId"
		]),
		"role-info": displayAction$1("roles", ["provider", "guildId"]),
		"emoji-list": displayAction$1("emoji list", ["provider", "guildId"]),
		"emoji-upload": displayAction$1("emoji upload", [
			"provider",
			"guildId",
			"emojiName"
		]),
		"sticker-upload": displayAction$1("sticker upload", [
			"provider",
			"guildId",
			"stickerName"
		]),
		"role-add": displayAction$1("role add", [
			"provider",
			"guildId",
			"userId",
			"roleId"
		]),
		"role-remove": displayAction$1("role remove", [
			"provider",
			"guildId",
			"userId",
			"roleId"
		]),
		"channel-info": displayAction$1("channel", ["provider", "channelId"]),
		"channel-list": displayAction$1("channels", ["provider", "guildId"]),
		"voice-status": displayAction$1("voice", [
			"provider",
			"guildId",
			"userId"
		]),
		"event-list": displayAction$1("events", ["provider", "guildId"]),
		"event-create": displayAction$1("event create", [
			"provider",
			"guildId",
			"eventName"
		]),
		timeout: displayAction$1("timeout", [
			"provider",
			"guildId",
			"userId"
		]),
		kick: displayAction$1("kick", [
			"provider",
			"guildId",
			"userId"
		]),
		ban: displayAction$1("ban", [
			"provider",
			"guildId",
			"userId"
		])
	}
};
//#endregion
//#region src/agents/tool-display-config.ts
function displayAction(label, detailKeys) {
	return detailKeys === void 0 ? { label } : {
		label,
		detailKeys
	};
}
/** Static display metadata for known tools plus fallback detail-key selection. */
const TOOL_DISPLAY_CONFIG = {
	version: 1,
	fallback: {
		emoji: "🧩",
		detailKeys: [
			"command",
			"path",
			"url",
			"targetUrl",
			"targetId",
			"ref",
			"element",
			"node",
			"nodeId",
			"id",
			"requestId",
			"to",
			"channelId",
			"guildId",
			"userId",
			"name",
			"query",
			"pattern",
			"messageId"
		]
	},
	tools: {
		bash: {
			emoji: "🛠️",
			title: "Bash",
			detailKeys: ["command"]
		},
		computer: {
			emoji: "🖱️",
			title: "Computer",
			detailKeys: [
				"action",
				"coordinate",
				"text",
				"node",
				"nodeId",
				"screenIndex"
			]
		},
		mobile_ui: {
			emoji: "📱",
			title: "Mobile UI",
			detailKeys: [
				"action",
				"mobileAction",
				"snapshotId",
				"node",
				"nodeId"
			]
		},
		screen: {
			emoji: "🖥️",
			title: "Screen",
			detailKeys: [
				"action",
				"sessionKey",
				"dock"
			]
		},
		theme: {
			emoji: "🎨",
			title: "Theme",
			detailKeys: [
				"action",
				"id",
				"mode"
			]
		},
		terminal: {
			emoji: "⌨️",
			title: "Terminal",
			detailKeys: [
				"action",
				"sessionId",
				"command",
				"cwd"
			]
		},
		portal: {
			emoji: "🌐",
			title: "Portal",
			detailKeys: [
				"action",
				"port",
				"id",
				"title",
				"path"
			]
		},
		process: {
			emoji: "🧰",
			title: "Process",
			detailKeys: ["sessionId"]
		},
		gateway_process: {
			emoji: "🧰",
			title: "Background Shell",
			detailKeys: ["action", "sessionId"]
		},
		read: {
			emoji: "📖",
			title: "Read",
			detailKeys: ["path"]
		},
		write: {
			emoji: "✍️",
			title: "Write",
			detailKeys: ["path"]
		},
		edit: {
			emoji: "📝",
			title: "Edit",
			detailKeys: ["path"]
		},
		attach: {
			emoji: "📎",
			title: "Attach",
			detailKeys: [
				"path",
				"url",
				"fileName"
			]
		},
		api: {
			emoji: "🌐",
			title: "API",
			detailKeys: [
				"url",
				"endpoint",
				"path",
				"method",
				"name"
			]
		},
		browser: {
			emoji: "🌐",
			title: "Browser",
			actions: {
				status: displayAction("status"),
				start: displayAction("start"),
				stop: displayAction("stop"),
				tabs: displayAction("tabs"),
				open: displayAction("open", ["targetUrl"]),
				focus: displayAction("focus", ["targetId"]),
				close: displayAction("close", ["targetId"]),
				snapshot: displayAction("snapshot", [
					"targetUrl",
					"targetId",
					"ref",
					"element",
					"format"
				]),
				screenshot: displayAction("screenshot", [
					"targetUrl",
					"targetId",
					"ref",
					"element"
				]),
				navigate: displayAction("navigate", ["targetUrl", "targetId"]),
				console: displayAction("console", ["level", "targetId"]),
				pdf: displayAction("pdf", ["targetId"]),
				upload: displayAction("upload", [
					"paths",
					"ref",
					"inputRef",
					"element",
					"targetId"
				]),
				dialog: displayAction("dialog", [
					"accept",
					"promptText",
					"targetId"
				]),
				act: displayAction("act", [
					"request.kind",
					"request.ref",
					"request.selector",
					"request.text",
					"request.value"
				])
			}
		},
		canvas: {
			emoji: "🖼️",
			title: "Canvas",
			actions: {
				present: displayAction("present", [
					"target",
					"node",
					"nodeId"
				]),
				hide: displayAction("hide", ["node", "nodeId"]),
				navigate: displayAction("navigate", [
					"url",
					"node",
					"nodeId"
				])
			}
		},
		dashboard: {
			emoji: "📋",
			title: "Dashboard",
			detailKeys: [
				"action",
				"tabId",
				"name",
				"title"
			]
		},
		nodes: {
			emoji: "📱",
			title: "Nodes",
			actions: {
				status: displayAction("status"),
				describe: displayAction("describe", ["node", "nodeId"]),
				pending: displayAction("pending"),
				approve: displayAction("approve", ["requestId"]),
				reject: displayAction("reject", ["requestId"]),
				notify: displayAction("notify", [
					"node",
					"nodeId",
					"title",
					"body"
				]),
				camera_snap: displayAction("camera snap", [
					"node",
					"nodeId",
					"facing",
					"deviceId"
				]),
				camera_list: displayAction("camera list", ["node", "nodeId"]),
				camera_clip: displayAction("camera clip", [
					"node",
					"nodeId",
					"facing",
					"duration",
					"durationMs"
				]),
				camera_ptz: displayAction("camera PTZ", [
					"ptzOperation",
					"node",
					"nodeId",
					"deviceId"
				]),
				screen_record: displayAction("screen record", [
					"node",
					"nodeId",
					"duration",
					"durationMs",
					"fps",
					"screenIndex"
				]),
				screen_snapshot: displayAction("screen snapshot", [
					"node",
					"nodeId",
					"screenIndex",
					"maxWidth"
				])
			}
		},
		cron: {
			emoji: "⏰",
			title: "Cron",
			actions: {
				status: displayAction("status"),
				list: displayAction("list"),
				add: displayAction("add", [
					"job.name",
					"job.id",
					"job.schedule",
					"job.cron"
				]),
				update: displayAction("update", ["id"]),
				remove: displayAction("remove", ["id"]),
				run: displayAction("run", ["id"]),
				runs: displayAction("runs", ["id"]),
				wake: displayAction("wake", ["text", "mode"])
			}
		},
		get_goal: {
			emoji: "🎯",
			title: "Get Goal",
			detailKeys: []
		},
		create_goal: {
			emoji: "🎯",
			title: "Create Goal",
			detailKeys: ["objective", "token_budget"]
		},
		update_goal: {
			emoji: "🎯",
			title: "Update Goal",
			detailKeys: ["status"]
		},
		progress_card: {
			emoji: "🗺️",
			title: "Progress Card"
		},
		ask_user: {
			emoji: "❓",
			title: "Ask User",
			detailKeys: ["questions.0.question"]
		},
		secrets: {
			emoji: "🔑",
			title: "Secrets",
			detailKeys: [
				"action",
				"name",
				"kind"
			]
		},
		suggest_task: {
			emoji: "✨",
			title: "Suggest Task",
			detailKeys: [
				"title",
				"tldr",
				"cwd"
			]
		},
		dismiss_task: {
			emoji: "🗑️",
			title: "Dismiss Task",
			detailKeys: ["task_id", "reason"]
		},
		skill_workshop: {
			emoji: "🧰",
			title: "Skill Workshop",
			detailKeys: [
				"action",
				"name",
				"proposal_id"
			]
		},
		openclaw: {
			emoji: "🦀",
			title: "OpenClaw",
			detailKeys: [
				"action",
				"path",
				"model"
			]
		},
		gateway: {
			emoji: "🔌",
			title: "Gateway",
			detailKeys: ["action", "path"]
		},
		plugins: {
			emoji: "🧩",
			title: "Plugins",
			detailKeys: [
				"action",
				"pluginId",
				"packageName",
				"query"
			]
		},
		exec: {
			emoji: "🛠️",
			title: "Exec",
			detailKeys: ["command"]
		},
		tool_call: {
			emoji: "🧰",
			title: "Tool Call",
			detailKeys: []
		},
		tool_call_update: {
			emoji: "🧰",
			title: "Tool Call",
			detailKeys: []
		},
		session_status: {
			emoji: "📊",
			title: "Session Status",
			detailKeys: ["sessionKey", "model"]
		},
		github_publish: {
			emoji: "🔀",
			title: "GitHub Publish",
			detailKeys: ["title"]
		},
		github_identity_status: {
			emoji: "🔐",
			title: "GitHub Identity Status",
			detailKeys: []
		},
		sessions: {
			emoji: "🗂️",
			title: "Session Settings",
			actions: {
				patch: displayAction("update", [
					"sessionKey",
					"label",
					"pinned",
					"archived",
					"model",
					"thinkingLevel"
				]),
				group_list: displayAction("groups"),
				group_set: displayAction("set groups", ["names"]),
				group_rename: displayAction("rename group", ["name", "to"]),
				group_delete: displayAction("delete group", ["name"])
			}
		},
		sessions_list: {
			emoji: "🗂️",
			title: "Sessions",
			detailKeys: [
				"kinds",
				"label",
				"agentId",
				"search",
				"limit",
				"activeMinutes",
				"includeDerivedTitles",
				"includeLastMessage",
				"messageLimit"
			]
		},
		conversations_list: {
			emoji: "💬",
			title: "Conversations",
			detailKeys: ["channel", "limit"]
		},
		conversations_send: {
			emoji: "📨",
			title: "Conversation Send",
			detailKeys: ["conversationRef"]
		},
		conversations_turn: {
			emoji: "↔️",
			title: "Conversation Turn",
			detailKeys: ["conversationRef", "timeoutSeconds"]
		},
		sessions_send: {
			emoji: "📨",
			title: "Session Send",
			detailKeys: [
				"label",
				"sessionKey",
				"agentId",
				"timeoutSeconds"
			]
		},
		sessions_history: {
			emoji: "🧾",
			title: "Session History",
			detailKeys: [
				"sessionKey",
				"limit",
				"includeTools"
			]
		},
		sessions_search: {
			emoji: "🔎",
			title: "Session Search",
			detailKeys: [
				"query",
				"sessionKey",
				"limit"
			]
		},
		transcripts: {
			emoji: "🎙️",
			title: "Transcripts",
			actions: {
				start: displayAction("start", [
					"sessionId",
					"title",
					"providerId",
					"accountId",
					"guildId",
					"channelId",
					"meetingUrl"
				]),
				stop: displayAction("stop", ["sessionId"]),
				status: displayAction("status"),
				import: displayAction("import", [
					"sessionId",
					"title",
					"providerId",
					"meetingUrl",
					"speakerLabel"
				]),
				summarize: displayAction("summarize", ["sessionId"])
			}
		},
		sessions_spawn: {
			emoji: "🧑‍🔧",
			title: "Sub-agent",
			detailKeys: [
				"label",
				"taskName",
				"agentId",
				"model",
				"thinking",
				"runTimeoutSeconds",
				"cleanup"
			]
		},
		agents_wait: {
			emoji: "⏳",
			title: "Wait for Agents",
			detailKeys: ["ids", "timeoutSeconds"]
		},
		structured_output: {
			emoji: "🧾",
			title: "Structured Output",
			detailKeys: ["result"]
		},
		subagents: {
			emoji: "🤖",
			title: "Subagents",
			actions: {
				list: displayAction("list", ["recentMinutes"]),
				kill: displayAction("kill", ["target"]),
				steer: displayAction("steer", ["target"])
			}
		},
		agents_list: {
			emoji: "🧭",
			title: "Agents",
			detailKeys: []
		},
		memory_search: {
			emoji: "🧠",
			title: "Memory Search",
			detailKeys: ["query"]
		},
		memory_get: {
			emoji: "📓",
			title: "Memory Get",
			detailKeys: [
				"path",
				"from",
				"lines"
			]
		},
		web_search: {
			emoji: "🔎",
			title: "Web Search",
			detailKeys: ["query", "count"]
		},
		web_fetch: {
			emoji: "📄",
			title: "Web Fetch",
			detailKeys: [
				"url",
				"extractMode",
				"maxChars"
			]
		},
		code_execution: {
			emoji: "🧮",
			title: "Code Execution",
			detailKeys: ["task"]
		},
		message: MESSAGE_TOOL_DISPLAY_SPEC,
		apply_patch: {
			emoji: "🩹",
			title: "Apply Patch",
			detailKeys: []
		},
		image: {
			emoji: "🖼️",
			title: "Image",
			detailKeys: [
				"path",
				"paths",
				"url",
				"urls",
				"prompt",
				"model"
			]
		},
		view_image: {
			emoji: "🖼️",
			title: "View Image",
			detailKeys: [
				"path",
				"paths",
				"url",
				"urls",
				"prompt",
				"model"
			]
		},
		image_generate: {
			emoji: "🎨",
			title: "Image Generation",
			actions: {
				generate: displayAction("generate", [
					"prompt",
					"model",
					"count",
					"resolution",
					"aspectRatio"
				]),
				list: displayAction("list", ["provider", "model"])
			}
		},
		music_generate: {
			emoji: "🎵",
			title: "Music Generation",
			actions: {
				generate: displayAction("generate", [
					"prompt",
					"model",
					"durationSeconds",
					"format",
					"instrumental"
				]),
				list: displayAction("list", ["provider", "model"])
			}
		},
		video_generate: {
			emoji: "🎬",
			title: "Video Generation",
			actions: {
				generate: displayAction("generate", [
					"prompt",
					"model",
					"durationSeconds",
					"resolution",
					"aspectRatio",
					"audio",
					"watermark"
				]),
				list: displayAction("list", ["provider", "model"])
			}
		},
		pdf: {
			emoji: "📑",
			title: "PDF",
			detailKeys: [
				"path",
				"paths",
				"url",
				"urls",
				"prompt",
				"pageRange",
				"model"
			]
		},
		sessions_yield: {
			emoji: "⏸️",
			title: "Yield"
		},
		tts: {
			emoji: "🔊",
			title: "TTS",
			detailKeys: ["text", "channel"]
		}
	}
};
//#endregion
//#region src/agents/tool-display.ts
/**
* User-facing tool display formatter.
*
* Builds redacted labels and compact details from tool metadata without affecting execution semantics.
*/
const FALLBACK = TOOL_DISPLAY_CONFIG.fallback ?? { emoji: "🧩" };
const TOOL_MAP = TOOL_DISPLAY_CONFIG.tools ?? {};
const DETAIL_LABEL_OVERRIDES = {
	agentId: "agent",
	sessionKey: "session",
	targetId: "target",
	targetUrl: "url",
	nodeId: "node",
	requestId: "request",
	messageId: "message",
	threadId: "thread",
	channelId: "channel",
	guildId: "guild",
	userId: "user",
	runTimeoutSeconds: "timeout",
	timeoutSeconds: "timeout",
	includeTools: "tools",
	pollQuestion: "poll",
	maxChars: "max chars"
};
const MAX_DETAIL_ENTRIES = 8;
/** Resolves the display model for a tool invocation. */
function resolveToolDisplay(params) {
	const name = normalizeToolDisplayName(params.name);
	const key = normalizeLowercaseStringOrEmpty(name);
	const spec = TOOL_MAP[key];
	const emoji = spec?.emoji ?? FALLBACK.emoji ?? "🧩";
	const title = spec?.title ?? defaultTitle(name);
	const label = spec?.label ?? title;
	const toolDisplayParts = resolveToolVerbAndDetailForArgs({
		toolKey: key,
		args: params.args,
		meta: params.meta,
		spec,
		fallbackDetailKeys: FALLBACK.detailKeys,
		detailMode: "summary",
		toolDetailMode: params.detailMode,
		detailMaxEntries: MAX_DETAIL_ENTRIES,
		detailFormatKey: (raw) => formatDetailKey(raw, DETAIL_LABEL_OVERRIDES)
	});
	const { verb } = toolDisplayParts;
	let { detail } = toolDisplayParts;
	if (detail) detail = shortenHomeInString(detail);
	return {
		name,
		emoji,
		title,
		label,
		verb,
		detail
	};
}
/** Formats and redacts detail text for display. */
function formatToolDetail(display) {
	return display.detail ? redactToolDetail(display.detail) : void 0;
}
/** Infers compact display metadata for a tool invocation from its arguments. */
function inferToolMetaFromArgsCore(toolName, args, options) {
	return formatToolDetail(resolveToolDisplay({
		name: toolName,
		args,
		detailMode: options?.detailMode
	}));
}
/**
* Shell-family tools render their command as the whole line instead of
* "Label: detail". Backends spell the same tool differently — the Claude CLI
* sends "Bash" where embedded runs send "bash"/"exec" — so every caller must
* compare the normalized name or the shell line silently loses its detail.
*/
function isShellToolDisplayName(name) {
	const normalized = normalizeLowercaseStringOrEmpty(name);
	return normalized === "bash" || normalized === "exec" || normalized === "shell";
}
/** Provider-defined tool names are not enough: namespaced tools can carry executable commands. */
function isCommandBearingToolCall(name, args) {
	if (isShellToolDisplayName(name)) return true;
	const command = asOptionalObjectRecord(args)?.command;
	return typeof command === "string" && normalizeOptionalString(command) !== void 0;
}
/** Builds the compact one-line summary shown in transcripts and logs. */
function formatToolSummary(display) {
	const detail = formatToolDetail(display);
	if (detail && isShellToolDisplayName(display.name)) return `${display.emoji} ${detail}`;
	return detail ? `${display.emoji} ${display.label}: ${detail}` : `${display.emoji} ${display.label}`;
}
//#endregion
export { isShellToolDisplayName as a, resolveToolSearchCodeDisplayTarget as c, isCommandBearingToolCall as i, formatToolSummary as n, resolveToolDisplay as o, inferToolMetaFromArgsCore as r, TOOL_DISPLAY_CONFIG as s, formatToolDetail as t };
