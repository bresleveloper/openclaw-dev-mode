import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { N as resolveOptionalIntegerOption, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { f as shortenHomeInString } from "./utils-gjJ-tD2q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as dedupeByKey } from "./dedupe-by-key-DnqEVrst.mjs";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-Cjgdy85s.mjs";
import { t as unwrapToolCallForDisplay } from "./tool-display-call-D2LOOBqc.mjs";
//#region src/agents/tool-display-exec-shell.ts
/**
* Lightweight shell parsing helpers for exec display summaries.
*
* Handles common quoting, wrapper, and preamble shapes for UI labels without validating shell syntax.
*/
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
function trimLeadingEnv(words) {
	if (words.length === 0) return words;
	const isEnv = binaryName(words[0]) === "env";
	let index = isEnv ? 1 : 0;
	while (index < words.length) {
		const token = words[index];
		if (!token || !(isEnv && token.startsWith("-")) && !/^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) break;
		index += 1;
	}
	return words.slice(index);
}
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
function parseHeredocMarker(command, operatorIndex, whitespace = /[ \t]/u) {
	if (command[operatorIndex] !== "<" || command[operatorIndex - 1] === "<" || command[operatorIndex + 1] !== "<" || command[operatorIndex + 2] === "<") return;
	const stripLeadingTabs = command[operatorIndex + 2] === "-";
	let index = operatorIndex + (stripLeadingTabs ? 3 : 2);
	while (whitespace.test(command[index] ?? "")) index += 1;
	let value = "";
	let quote;
	for (; index < command.length; index += 1) {
		let char = command[index] ?? "";
		if (quote && char === quote) {
			quote = void 0;
			continue;
		}
		if (!quote) {
			if (/[\r\n;&|<>]/u.test(char) || whitespace.test(char)) break;
			if (char === "'" || char === "\"") {
				quote = char;
				continue;
			}
		}
		if (quote !== "'" && char === "\\" && index + 1 < command.length) {
			index += 1;
			char = command[index] ?? "";
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
const SHELL_FUNCTION_NAME_PATTERN = `[^\\s;&|()<>]+`;
const SHELL_COMPOUND_PATTERNS = [SHELL_COMMAND_START_PATTERN, String.raw`(?:\$\((?!\()|[<>]\()\s*(?:(?:time(?:\s+-p)?(?:\s+--)?|!)(?:\s+|(?=\()))*`].flatMap((start) => [
	SHELL_COMPOUND_START_PATTERN,
	`function\\s+${SHELL_FUNCTION_NAME_PATTERN}(?:\\s+${SHELL_FUNCTION_BODY_START_PATTERN}|\\((?!\\s*\\)))`,
	`(?:function\\s+)?${SHELL_FUNCTION_NAME_PATTERN}\\s*\\(\\s*\\)\\s*${SHELL_FUNCTION_BODY_START_PATTERN}`
].map((body) => new RegExp(`${start}${body}`, "u")));
function hasShellCompoundCommand(command) {
	const syntaxChars = Array.from({ length: command.length }, () => "\0");
	scanTopLevelChars(command, (char, index) => {
		syntaxChars[index] = char;
		return true;
	});
	const syntax = syntaxChars.join("");
	return SHELL_COMPOUND_PATTERNS.some((pattern) => pattern.test(syntax));
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
/** Removes leading setup commands such as exports and cwd changes from display summaries. */
function stripShellPreamble(command) {
	let rest = command.trim();
	let chdirPath;
	for (let i = 0; i < 4; i += 1) {
		let first;
		scanTopLevelChars(rest, (char, idx) => {
			if ((char === "&" || char === "|") && rest[idx + 1] === char) {
				first = {
					index: idx,
					length: 2,
					isOr: char === "|"
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
		const { words } = parseShellWords(head, 3);
		const bin = binaryName(words[0]);
		const isChdir = (first ? !first.isOr : i > 0) && (bin === "cd" || bin === "pushd" || bin === "popd");
		if (!(head.startsWith("set ") || head.startsWith("export ") || head.startsWith("unset ") || isChdir)) break;
		if (isChdir) chdirPath = bin === "popd" ? void 0 : words[1] || chdirPath;
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
				sub = parseShellOptions(words, i + 1).positional[0];
				break;
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
		const target = parseShellOptions(words).positional[0];
		return target ? `${prefix} ${target}` : fallback;
	}
	if (bin === "head" || bin === "tail") {
		const lines = optionValue(words, ["-n", "--lines"]) ?? words.slice(1).find((token) => /^-\d+$/.test(token))?.slice(1);
		const { positional } = parseShellOptions(words, 1, ["-n", "--lines"]);
		let target = positional.at(-1);
		if (target && /^\d+$/.test(target) && positional.length === 1) target = void 0;
		const side = bin === "head" ? "first" : "last";
		const unit = lines === "1" ? "line" : "lines";
		if (lines) return `show ${side} ${lines} ${unit}${target ? ` of ${target}` : ""}`;
		if (target) return `show ${target}`;
		return `show ${bin} output`;
	}
	if (bin === "sed") {
		const expression = optionValue(words, ["-e", "--expression"]);
		const { positional } = parseShellOptions(words, 1, [
			"-e",
			"--expression",
			"-f",
			"--file"
		]);
		const script = expression ?? positional[0];
		const target = expression ? positional[0] : positional[1];
		if (script) {
			const range = (stripOuterQuotes(script) ?? script).replace(/\s+/g, "").match(/^([0-9]+)(?:,([0-9]+))?p$/);
			if (range) return `print ${range[2] ? `lines ${range[1]}-${range[2]}` : `line ${range[1]}`}${target ? ` from ${target}` : ""}`;
		}
		return target ? `run sed on ${target}` : "run sed transform";
	}
	if (bin === "printf" || bin === "echo") return "print text";
	if (bin === "cp" || bin === "mv") {
		const { positional } = parseShellOptions(words, 1, [
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
		const { positional } = parseShellOptions(words, 1, [
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
		const script = parseShellOptions(words, 1, bin === "node" ? [
			"-e",
			"--eval",
			"-m"
		] : [
			"-c",
			"-e",
			"--eval",
			"-m"
		]).positional[0];
		if (!script) return `run ${bin}`;
		if (bin === "node") return `${words.includes("--check") || words.includes("-c") ? "check js syntax for" : "run node script"} ${script}`;
		return `run ${bin} ${script}`;
	}
	if (bin === "openclaw") {
		const sub = parseShellOptions(words).positional[0];
		return sub ? `run openclaw ${sub}` : "run openclaw";
	}
	const arg = parseShellOptions(words).positional[0];
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
	scanTopLevelChars(commandLine, (_char, index) => {
		const marker = parseHeredocMarker(commandLine, index, /\s/u);
		if (marker) terminators.push(marker);
		return true;
	});
	return terminators;
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
function classifyWorkspacePath(path) {
	const segments = path.split(/[\\/]/).filter(Boolean);
	for (const [index, segment] of segments.entries()) {
		if (segment === ".openclaw" && segments[index + 1] === "workspace") return "agent";
		if (segment === ".openclaw" && segments[index + 1] === "sandboxes") return "sandbox";
		if (/[-_]workspace$/i.test(segment)) return "agent";
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
	"run tests",
	"run build",
	"run lint",
	"run openclaw",
	"run node ",
	"run python",
	"run ruby",
	"run php",
	"run sed",
	"run git ",
	"run npm ",
	"run pnpm ",
	"run yarn ",
	"run bun "
];
function isGenericSummary(summary) {
	if (summary === "run command") return true;
	if (summary.startsWith("run ")) return !KNOWN_SUMMARY_PREFIXES.some((prefix) => summary.startsWith(prefix));
	return false;
}
function compactRawCommand(raw, maxLength = 120) {
	const oneLine = raw.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
	if (oneLine.length <= maxLength) return oneLine;
	const half = Math.floor((maxLength - 1) / 2);
	return `${sliceUtf16Safe(oneLine, 0, half)}…${sliceUtf16Safe(oneLine, -(maxLength - 1 - half))}`;
}
/** Treat agent-authored titles as bounded display text, never an outcome. */
function resolveExecTitle(args) {
	const title = asOptionalObjectRecord(args)?.title;
	if (typeof title !== "string") return;
	const text = sanitizeTerminalText(title.replace(/\s+/gu, " ")).trim();
	return sliceUtf16Safe(text, 0, 120) || void 0;
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
function normalizeToolDisplayName(name) {
	return (name ?? "tool").trim();
}
function defaultTitle(name) {
	const cleaned = name.replace(/_/g, " ").trim();
	if (!cleaned) return "Tool";
	return cleaned.split(/\s+/).map((part) => `${part.at(0)?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
}
/** Beyond this nesting depth, a value does not contribute to the compact display preview. */
const TOOL_DISPLAY_ARRAY_DEPTH_LIMIT = 64;
function coerceDisplayValue(value, opts = {}, depth = 0) {
	if (depth > TOOL_DISPLAY_ARRAY_DEPTH_LIMIT) return;
	if (value === null || value === void 0) return;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return;
		const firstLine = normalizeOptionalString(trimmed.split(/\r?\n/, 1)[0]) ?? "";
		if (!firstLine) return;
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
function formatDetailKey(raw, overrides) {
	const last = raw.split(".").findLast(Boolean) || raw;
	const override = overrides[last];
	if (override) return override;
	const spaced = last.replace(/[_-]/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2");
	return normalizeLowercaseStringOrEmpty(spaced) || normalizeLowercaseStringOrEmpty(last);
}
function resolvePathArg(record) {
	for (const candidate of [
		record.path,
		record.file_path,
		record.filePath
	]) {
		const trimmed = normalizeOptionalString(candidate);
		if (trimmed) return trimmed;
	}
}
function resolveReadDetail(record) {
	const path = resolvePathArg(record);
	if (!path) return;
	const offset = resolveOptionalIntegerOption(record.offset, { min: 1 });
	const limit = resolveOptionalIntegerOption(record.limit, { min: 1 });
	if (offset !== void 0 && limit !== void 0) return `${limit === 1 ? "line" : "lines"} ${offset}-${offset + limit - 1} from ${path}`;
	if (offset !== void 0) return `from line ${offset} in ${path}`;
	if (limit !== void 0) return `first ${limit} ${limit === 1 ? "line" : "lines"} of ${path}`;
	return `from ${path}`;
}
function resolveWriteDetail(toolKey, record) {
	const path = resolvePathArg(record) ?? normalizeOptionalString(record.url);
	if (!path) return;
	if (toolKey === "attach") return `from ${path}`;
	const destinationPrefix = toolKey === "edit" ? "in" : "to";
	const content = typeof record.content === "string" ? record.content : typeof record.newText === "string" ? record.newText : typeof record.new_string === "string" ? record.new_string : void 0;
	if (content) return `${destinationPrefix} ${path} (${content.length} chars)`;
	return `${destinationPrefix} ${path}`;
}
function resolveWebSearchDetail(record) {
	const queries = collectWebSearchQueries(record);
	const count = asPositiveFiniteNumber(record.count) ?? asPositiveFiniteNumber(record.max_results) ?? asPositiveFiniteNumber(record.num_results) ?? asPositiveFiniteNumber(record.limit) ?? asPositiveFiniteNumber(record.top_k);
	if (queries.length === 0) return;
	const displayedQueries = queries.slice(0, 3).map((query) => `"${query}"`);
	const queryText = queries.length > displayedQueries.length ? `${displayedQueries.join(", ")}…` : displayedQueries.join(", ");
	return count !== void 0 ? `for ${queryText} (top ${Math.floor(count)})` : `for ${queryText}`;
}
function collectWebSearchQueries(record) {
	const queries = /* @__PURE__ */ new Set();
	const add = (value) => {
		const normalized = normalizeOptionalString(value);
		if (normalized) queries.add(normalized);
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
	return [...queries];
}
function resolveWebFetchDetail(record) {
	const url = normalizeOptionalString(record.url);
	if (!url) return;
	const mode = normalizeOptionalString(record.extractMode);
	const maxChars = asPositiveFiniteNumber(record.maxChars);
	const suffix = [mode ? `mode ${mode}` : "", maxChars === void 0 ? "" : `max ${Math.floor(maxChars)} chars`].filter(Boolean).join(", ");
	return suffix ? `from ${url} (${suffix})` : `from ${url}`;
}
function resolveDetailFromKeys(args, keys, opts) {
	const entries = [];
	for (const key of keys) {
		const display = coerceDisplayValue(lookupValueByPath(args, key), opts.coerce);
		if (!display) continue;
		if (opts.mode === "first") return display;
		entries.push({
			label: opts.formatKey ? opts.formatKey(key) : key,
			value: display
		});
	}
	if (entries.length === 0) return;
	if (entries.length === 1) return entries.at(0)?.value;
	const unique = dedupeByKey(entries, (entry) => `${entry.label}:${entry.value}`);
	const parts = [];
	for (let index = 0; index < unique.length && index < 8; index += 1) {
		const entry = unique[index];
		if (entry) parts.push(`${entry.label} ${entry.value}`);
	}
	return parts.join(", ");
}
function resolveToolVerbAndDetailForArgs(params) {
	if (isAgentPlanProgressToolName(params.toolKey)) return {};
	const { toolKey, args, meta } = params;
	const action = normalizeOptionalString(asOptionalObjectRecord(params.args)?.action);
	const { spec, fallbackDetailKeys, detailMode, toolDetailMode, detailCoerce, detailFormatKey } = params;
	const actionSpec = spec && action ? spec.actions?.[action] ?? void 0 : void 0;
	const fallbackVerb = toolKey === "web_search" ? "search" : toolKey === "web_fetch" ? "fetch" : toolKey.replace(/[_.]/g, " ");
	const verb = normalizeOptionalString(actionSpec?.label ?? action ?? fallbackVerb)?.replace(/_/g, " ");
	let detail;
	if (toolKey === "exec" || toolKey === "bash" || toolKey === "shell") detail = resolveExecDetail(args, { detailMode: toolDetailMode });
	const record = asOptionalObjectRecord(args);
	if (record && !detail) {
		if (toolKey === "read") detail = resolveReadDetail(record);
		else if (toolKey === "write" || toolKey === "edit" || toolKey === "attach") detail = resolveWriteDetail(toolKey, record);
		else if (toolKey === "web_search") detail = resolveWebSearchDetail(record);
		else if (toolKey === "web_fetch") detail = resolveWebFetchDetail(record);
	}
	const detailKeys = actionSpec?.detailKeys ?? spec?.detailKeys ?? fallbackDetailKeys ?? [];
	if (!detail && detailKeys.length > 0) detail = resolveDetailFromKeys(args, detailKeys, {
		mode: detailMode,
		coerce: detailCoerce,
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
	icon: "mail",
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
function displayTool(icon, title, detailKeys) {
	return detailKeys === void 0 ? {
		icon,
		title
	} : {
		icon,
		title,
		detailKeys
	};
}
function displayAction(label, detailKeys) {
	return detailKeys === void 0 ? { label } : {
		label,
		detailKeys
	};
}
function mediaGenerationTool(icon, title, detailKeys) {
	return {
		icon,
		title,
		actions: {
			generate: displayAction("generate", detailKeys),
			list: displayAction("list", ["provider", "model"])
		}
	};
}
/** Static display metadata for known tools plus fallback detail-key selection. */
const TOOL_DISPLAY_CONFIG = {
	version: 1,
	fallback: {
		icon: "puzzle",
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
		bash: displayTool("squareTerminal", "Bash", ["command"]),
		computer: displayTool("monitor", "Computer", [
			"action",
			"coordinate",
			"text",
			"node",
			"nodeId",
			"screenIndex"
		]),
		mobile_ui: displayTool("monitorSmartphone", "Mobile UI", [
			"action",
			"mobileAction",
			"snapshotId",
			"node",
			"nodeId"
		]),
		screen: displayTool("monitor", "Screen", [
			"action",
			"sessionKey",
			"dock"
		]),
		theme: displayTool("palette", "Theme", [
			"action",
			"id",
			"mode"
		]),
		terminal: displayTool("squareTerminal", "Terminal", [
			"action",
			"sessionId",
			"command",
			"cwd"
		]),
		portal: displayTool("globe", "Portal", [
			"action",
			"port",
			"id",
			"title",
			"path"
		]),
		process: displayTool("squareTerminal", "Process", ["sessionId"]),
		gateway_process: displayTool("squareTerminal", "Background Shell", ["action", "sessionId"]),
		read: displayTool("fileText", "Read", ["path"]),
		write: displayTool("edit", "Write", ["path"]),
		edit: displayTool("penLine", "Edit", ["path"]),
		personal_instructions: {
			icon: "penLine",
			title: "Personal Instructions",
			detailKeys: ["action", "agentId"],
			actions: {
				get: displayAction("read", ["agentId"]),
				set: displayAction("save", ["agentId"])
			}
		},
		presence: displayTool("radio", "Presence"),
		attach: displayTool("paperclip", "Attach", [
			"path",
			"url",
			"fileName"
		]),
		api: displayTool("globe", "API", [
			"url",
			"endpoint",
			"path",
			"method",
			"name"
		]),
		browser: {
			icon: "globe",
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
			icon: "image",
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
		dashboard: displayTool("layoutDashboard", "Dashboard", [
			"action",
			"tabId",
			"name",
			"title"
		]),
		nodes: {
			icon: "monitorSmartphone",
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
			icon: "calendarClock",
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
		get_goal: displayTool("target", "Get Goal", []),
		create_goal: displayTool("target", "Create Goal", ["objective", "token_budget"]),
		update_goal: displayTool("target", "Update Goal", ["status"]),
		progress_card: displayTool("listChecks", "Progress Card"),
		ask_user: displayTool("shieldQuestion", "Ask User", ["questions.0.question"]),
		secrets: displayTool("key", "Secrets", [
			"action",
			"name",
			"kind"
		]),
		suggest_task: displayTool("spark", "Suggest Task", [
			"title",
			"tldr",
			"cwd"
		]),
		dismiss_task: displayTool("trash", "Dismiss Task", ["task_id", "reason"]),
		skill_workshop: displayTool("wrench", "Skill Workshop", [
			"action",
			"name",
			"proposal_id"
		]),
		openclaw: displayTool("claw", "OpenClaw", [
			"action",
			"path",
			"model"
		]),
		gateway: displayTool("plug", "Gateway", ["action", "path"]),
		plugins: displayTool("puzzle", "Plugins", [
			"action",
			"pluginId",
			"packageName",
			"query"
		]),
		exec: displayTool("squareTerminal", "Exec", ["command"]),
		tool_call: displayTool("wrench", "Tool Call", []),
		dispatch_action: displayTool("wrench", "Tool Call", []),
		tool_call_update: displayTool("wrench", "Tool Call", []),
		session_status: displayTool("barChart", "Session Status", ["sessionKey", "model"]),
		github_publish: displayTool("github", "GitHub Publish", ["title"]),
		github_identity_status: displayTool("settings", "GitHub Identity Status", []),
		sessions: {
			icon: "layers",
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
		sessions_list: displayTool("layers", "Sessions", [
			"kinds",
			"label",
			"agentId",
			"search",
			"limit",
			"activeMinutes",
			"includeDerivedTitles",
			"includeLastMessage",
			"messageLimit"
		]),
		conversations_list: displayTool("messageSquare", "Conversations", ["channel", "limit"]),
		conversations_send: displayTool("send", "Conversation Send", ["conversationRef"]),
		conversations_turn: displayTool("arrowLeftRight", "Conversation Turn", ["conversationRef", "timeoutSeconds"]),
		sessions_send: displayTool("send", "Session Send", [
			"label",
			"sessionKey",
			"agentId",
			"timeoutSeconds"
		]),
		sessions_history: displayTool("fileText", "Session History", [
			"sessionKey",
			"limit",
			"includeTools"
		]),
		sessions_search: displayTool("search", "Session Search", [
			"query",
			"sessionKey",
			"limit"
		]),
		transcripts: {
			icon: "mic",
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
		sessions_spawn: displayTool("bot", "Sub-agent", [
			"label",
			"taskName",
			"agentId",
			"model",
			"thinking",
			"runTimeoutSeconds",
			"cleanup"
		]),
		agents_wait: displayTool("clock", "Wait for Agents", ["ids", "timeoutSeconds"]),
		structured_output: displayTool("fileText", "Structured Output", ["result"]),
		subagents: {
			icon: "users",
			title: "Subagents",
			actions: {
				list: displayAction("list", ["recentMinutes"]),
				kill: displayAction("kill", ["target"]),
				steer: displayAction("steer", ["target"])
			}
		},
		agents_list: displayTool("users", "Agents", []),
		memory_search: displayTool("search", "Memory Search", ["query"]),
		memory_get: displayTool("brain", "Memory Get", [
			"path",
			"from",
			"lines"
		]),
		skills_search: displayTool("search", "Skill Search", ["query"]),
		skills_read: displayTool("fileText", "Skill Read", ["name"]),
		web_search: displayTool("search", "Web Search", ["query", "count"]),
		web_fetch: displayTool("globe", "Web Fetch", [
			"url",
			"extractMode",
			"maxChars"
		]),
		code_execution: displayTool("braces", "Code Execution", ["task"]),
		decision_evaluate: displayTool("shieldCheck", "Decision Evaluation", []),
		message: MESSAGE_TOOL_DISPLAY_SPEC,
		apply_patch: displayTool("fileDiff", "Apply Patch", []),
		image: displayTool("image", "Image", [
			"path",
			"paths",
			"url",
			"urls",
			"prompt",
			"model"
		]),
		view_image: displayTool("image", "View Image", [
			"path",
			"paths",
			"url",
			"urls",
			"prompt",
			"model"
		]),
		image_generate: mediaGenerationTool("image", "Image Generation", [
			"prompt",
			"model",
			"count",
			"resolution",
			"aspectRatio"
		]),
		music_generate: mediaGenerationTool("music", "Music Generation", [
			"prompt",
			"model",
			"durationSeconds",
			"format",
			"instrumental"
		]),
		video_generate: mediaGenerationTool("play", "Video Generation", [
			"prompt",
			"model",
			"durationSeconds",
			"resolution",
			"aspectRatio",
			"audio",
			"watermark"
		]),
		pdf: displayTool("fileText", "PDF", [
			"path",
			"paths",
			"url",
			"urls",
			"prompt",
			"pageRange",
			"model"
		]),
		sessions_yield: displayTool("pause", "Yield"),
		tts: displayTool("audioLines", "TTS", ["text", "channel"])
	}
};
//#endregion
//#region src/agents/tool-display.ts
/**
* User-facing tool display formatter.
*
* Builds labels and compact details from tool metadata without affecting execution semantics.
*/
const FALLBACK = TOOL_DISPLAY_CONFIG.fallback;
const TOOL_MAP = TOOL_DISPLAY_CONFIG.tools;
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
/** Resolves the display model for a tool invocation. */
function resolveToolDisplay(params) {
	const call = unwrapToolCallForDisplay({
		name: params.name,
		args: params.args
	});
	const name = normalizeToolDisplayName(call.name);
	const key = normalizeLowercaseStringOrEmpty(name);
	const spec = TOOL_MAP[key];
	const title = spec?.title ?? defaultTitle(name);
	const label = spec?.label ?? title;
	const { verb, detail } = resolveToolVerbAndDetailForArgs({
		toolKey: key,
		args: call.args,
		meta: params.meta,
		spec,
		fallbackDetailKeys: FALLBACK.detailKeys,
		detailMode: "summary",
		toolDetailMode: params.detailMode,
		detailFormatKey: (raw) => formatDetailKey(raw, DETAIL_LABEL_OVERRIDES)
	});
	return {
		name,
		icon: spec?.icon ?? FALLBACK.icon,
		title,
		label,
		verb,
		detail: detail ? shortenHomeInString(detail) : detail
	};
}
/** Formats detail text for display. */
function formatToolDetail(display) {
	return display.detail || void 0;
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
	return normalizeOptionalString(asOptionalObjectRecord(args)?.command) !== void 0;
}
/** Builds the compact one-line summary shown in transcripts and logs. */
function formatToolSummary(display) {
	const detail = formatToolDetail(display);
	if (detail && isShellToolDisplayName(display.name)) return detail;
	return detail ? `${display.label}: ${detail}` : display.label;
}
//#endregion
export { isShellToolDisplayName as a, isCommandBearingToolCall as i, formatToolSummary as n, resolveToolDisplay as o, inferToolMetaFromArgsCore as r, formatToolDetail as t };
