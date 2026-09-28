import { A as SOURCE_EXECUTABLES, P as normalizeExecutableToken, a as extractShellWrapperCommand, f as resolveShellWrapperTransportArgv, o as extractShellWrapperInlineCommand, t as POSIX_PARSEABLE_SHELL_WRAPPERS, u as isShellWrapperExecutable } from "./shell-wrapper-resolution-CPhcV89l.mjs";
import "./exec-wrapper-resolution-ChbEn7AS.mjs";
import { a as detectCommandCarrierArgv, c as detectShellWrapperThroughCarrierArgv, i as detectCarrierInlineEvalArgv, o as detectInlineEvalArgv, r as detectCarriedShellBuiltinArgv } from "./risks-HzTsadnl.mjs";
import { createRequire } from "node:module";
//#region src/infra/command-explainer/tree-sitter-runtime.ts
createRequire(import.meta.url);
let parserPromise = null;
const MAX_COMMAND_EXPLANATION_SOURCE_CHARS = 131072;
const MAX_COMMAND_EXPLANATION_PARSE_MS = 500;
async function loadParser() {
	const TreeSitter = await import("web-tree-sitter");
	await TreeSitter.Parser.init();
	const language = await TreeSitter.Language.load(new URL(new URL("tree-sitter-bash.wasm", import.meta.url).href));
	return new TreeSitter.Parser().setLanguage(language);
}
function getBashParserForCommandExplanation() {
	parserPromise ??= loadParser().catch((error) => {
		parserPromise = null;
		throw error;
	});
	return parserPromise;
}
async function parseBashForCommandExplanation(source) {
	if (source.length > MAX_COMMAND_EXPLANATION_SOURCE_CHARS) throw new Error("Shell command is too large to explain");
	const parser = await getBashParserForCommandExplanation();
	const deadlineMs = performance.now() + MAX_COMMAND_EXPLANATION_PARSE_MS;
	let timedOut = false;
	const tree = parser.parse(source, null, { progressCallback: () => {
		timedOut = performance.now() > deadlineMs;
		return timedOut;
	} });
	if (!tree) {
		parser.reset();
		if (timedOut) throw new Error(`tree-sitter-bash timed out after ${MAX_COMMAND_EXPLANATION_PARSE_MS}ms while parsing shell command`);
		throw new Error("tree-sitter-bash returned no parse tree");
	}
	return tree;
}
//#endregion
//#region src/infra/command-explainer/extract.ts
const MAX_WRAPPER_PAYLOAD_DEPTH = 2;
const MAX_COMMAND_EXPLANATION_NODES = 5e4;
var CommandExplanationWorkLimitError = class extends Error {};
const PARSEABLE_SHELL_WRAPPERS = new Set(POSIX_PARSEABLE_SHELL_WRAPPERS);
const ROOT_SPAN_BASE = {};
function hasDirectChildType(node, type) {
	return node.children.some((child) => child.type === type);
}
function translateSpan(span, base) {
	if (!base.mapOffset) return span;
	const start = base.mapOffset(span.startIndex);
	const end = base.mapOffset(span.endIndex);
	return {
		startIndex: start.index,
		endIndex: end.index,
		startPosition: start.position,
		endPosition: end.position
	};
}
function spanFromNode(node, base = ROOT_SPAN_BASE) {
	const { startIndex, endIndex, startPosition, endPosition } = node;
	return translateSpan({
		startIndex,
		endIndex,
		startPosition,
		endPosition
	}, base);
}
function advancePosition(position, text) {
	let row = position.row;
	let column = position.column;
	for (let index = 0; index < text.length; index += 1) {
		const ch = text[index];
		if (ch === "\r") {
			if (text[index + 1] === "\n") index += 1;
			row += 1;
			column = 0;
			continue;
		}
		if (ch === "\n") {
			row += 1;
			column = 0;
			continue;
		}
		column += 1;
	}
	return {
		row,
		column
	};
}
function positionAtSourceIndex(source, index) {
	return advancePosition({
		row: 0,
		column: 0
	}, source.slice(0, index));
}
function spanFromSourceRange(source, startIndex, endIndex) {
	return {
		startIndex,
		endIndex,
		startPosition: positionAtSourceIndex(source, startIndex),
		endPosition: positionAtSourceIndex(source, endIndex)
	};
}
function valuePrefixLength(node) {
	if (node.type === "string" || node.type === "raw_string") return 1;
	if (node.type === "ansi_c_string") return 2;
	return 0;
}
function appendDecodedText(decoded, value, sourceEndOffset) {
	decoded.value += value;
	decoded.sourceOffsets.push(...Array.from({ length: value.length }, () => sourceEndOffset));
}
function identityDecodedShellText(text, sourceOffset = 0) {
	return {
		value: text,
		sourceOffsets: Array.from({ length: text.length + 1 }, (_, index) => sourceOffset + index)
	};
}
function decodedSourceOffsetsForNode(node, value) {
	let decoded;
	switch (node.type) {
		case "raw_string":
			decoded = identityDecodedShellText(node.text.slice(1, -1), 1);
			break;
		case "string":
			decoded = decodeDoubleQuotedTextWithOffsets(node.text);
			break;
		case "ansi_c_string":
			decoded = decodeAnsiCStringWithOffsets(node.text);
			break;
		default: decoded = decodeUnquotedShellTextWithOffsets(node.text);
	}
	if (decoded.value === value && decoded.sourceOffsets.length === value.length + 1) return decoded.sourceOffsets;
	const prefixLength = valuePrefixLength(node);
	return Array.from({ length: value.length + 1 }, (_, index) => prefixLength + index);
}
function argumentFromNode(index, node, value, base) {
	const span = spanFromNode(node, base);
	const decodedSourceOffsets = decodedSourceOffsetsForNode(node, value.value);
	return {
		index,
		text: node.text,
		value: value.value,
		span,
		decodedSourceOffsets
	};
}
const DYNAMIC_WORD_NODE_TYPES = /* @__PURE__ */ new Set([
	"arithmetic_expansion",
	"command_substitution",
	"expansion",
	"process_substitution",
	"simple_expansion"
]);
const COMMAND_ARGUMENT_NODE_TYPES = /* @__PURE__ */ new Set([
	"ansi_c_string",
	"arithmetic_expansion",
	"command_substitution",
	"concatenation",
	"expansion",
	"number",
	"process_substitution",
	"raw_string",
	"simple_expansion",
	"string",
	"word"
]);
function hasEscapedLineContinuation(text) {
	return /\\(?:\r\n|[\r\n])/.test(text);
}
function hasLineBreakEscapedWordBoundary(text) {
	return /(?:\r\n|[\r\n])\\/.test(text);
}
function hasExecutableLineContinuation(text) {
	return /^[^\s]*\\(?:\r\n|[\r\n])/.test(text);
}
function hasUnescapedDynamicPattern(text) {
	for (let index = 0; index < text.length; index += 1) {
		const ch = text[index];
		if (ch === "\\") {
			index += 1;
			continue;
		}
		if (ch === "*" || ch === "?") return true;
		if (ch === "[" && text.indexOf("]", index + 1) > index + 1) return true;
		if (ch === "{" && text.indexOf("}", index + 1) > index + 1) return true;
	}
	return false;
}
function decodeUnquotedShellTextWithOffsets(text) {
	const decoded = {
		value: "",
		sourceOffsets: [0]
	};
	for (let index = 0; index < text.length; index += 1) {
		const ch = text.charAt(index);
		const next = text[index + 1];
		if (ch === "\\" && next !== void 0) {
			if (next === "\r" && text[index + 2] === "\n") {
				decoded.sourceOffsets[decoded.value.length] = index + 3;
				index += 2;
				continue;
			}
			if (next === "\n" || next === "\r") {
				decoded.sourceOffsets[decoded.value.length] = index + 2;
				index += 1;
				continue;
			}
			appendDecodedText(decoded, next, index + 2);
			index += 1;
			continue;
		}
		appendDecodedText(decoded, ch, index + 1);
	}
	return decoded;
}
function decodeUnquotedShellText(text) {
	return decodeUnquotedShellTextWithOffsets(text).value;
}
function decodeDoubleQuotedTextWithOffsets(text) {
	const hasQuotes = text.startsWith("\"") && text.endsWith("\"");
	const bodyStart = hasQuotes ? 1 : 0;
	const body = hasQuotes ? text.slice(1, -1) : text;
	const decoded = {
		value: "",
		sourceOffsets: [bodyStart]
	};
	for (let index = 0; index < body.length; index += 1) {
		const ch = body.charAt(index);
		const next = body[index + 1];
		const sourceOffset = bodyStart + index;
		if (ch === "\\" && next !== void 0) {
			if (next === "\r" && body[index + 2] === "\n") {
				decoded.sourceOffsets[decoded.value.length] = sourceOffset + 3;
				index += 2;
				continue;
			}
			if ([
				"\\",
				"\"",
				"$",
				"`",
				"\n",
				"\r"
			].includes(next)) {
				if (next !== "\n" && next !== "\r") appendDecodedText(decoded, next, sourceOffset + 2);
				else decoded.sourceOffsets[decoded.value.length] = sourceOffset + 2;
				index += 1;
				continue;
			}
		}
		appendDecodedText(decoded, ch, sourceOffset + 1);
	}
	return decoded;
}
function decodeDoubleQuotedText(text) {
	return decodeDoubleQuotedTextWithOffsets(text).value;
}
const ANSI_C_SIMPLE_ESCAPES = {
	"'": "'",
	"\"": "\"",
	"?": "?",
	"\\": "\\",
	a: "\x07",
	b: "\b",
	e: "\x1B",
	E: "\x1B",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	",
	v: "\v"
};
function decodeAnsiCStringWithOffsets(text) {
	const hasQuotes = text.startsWith("$'") && text.endsWith("'");
	const bodyStart = hasQuotes ? 2 : 0;
	const body = hasQuotes ? text.slice(2, -1) : text;
	const decoded = {
		value: "",
		sourceOffsets: [bodyStart]
	};
	for (let index = 0; index < body.length; index += 1) {
		const ch = body.charAt(index);
		const sourceOffset = bodyStart + index;
		if (ch !== "\\") {
			appendDecodedText(decoded, ch, sourceOffset + 1);
			continue;
		}
		const next = body[index + 1];
		if (next === void 0) {
			appendDecodedText(decoded, "\\", sourceOffset + 1);
			continue;
		}
		const simple = ANSI_C_SIMPLE_ESCAPES[next];
		if (simple !== void 0) {
			appendDecodedText(decoded, simple, sourceOffset + 2);
			index += 1;
			continue;
		}
		if (next === "x") {
			const hex = body.slice(index + 2).match(/^[0-9A-Fa-f]{1,2}/)?.[0] ?? "";
			if (hex) {
				appendDecodedText(decoded, String.fromCodePoint(Number.parseInt(hex, 16)), sourceOffset + 2 + hex.length);
				index += 1 + hex.length;
				continue;
			}
		}
		if (next === "u" || next === "U") {
			const maxLength = next === "u" ? 4 : 8;
			const hex = body.slice(index + 2).match(new RegExp(`^[0-9A-Fa-f]{1,${maxLength}}`))?.[0] ?? "";
			if (hex) {
				const codePoint = Number.parseInt(hex, 16);
				try {
					appendDecodedText(decoded, String.fromCodePoint(codePoint), sourceOffset + 2 + hex.length);
				} catch {
					appendDecodedText(decoded, `\\${next}${hex}`, sourceOffset + 2 + hex.length);
				}
				index += 1 + hex.length;
				continue;
			}
		}
		if (/^[0-7]$/.test(next)) {
			const octal = body.slice(index + 1).match(/^[0-7]{1,3}/)?.[0] ?? "";
			if (octal) {
				appendDecodedText(decoded, String.fromCodePoint(Number.parseInt(octal, 8)), sourceOffset + 1 + octal.length);
				index += octal.length;
				continue;
			}
		}
		appendDecodedText(decoded, next, sourceOffset + 2);
		index += 1;
	}
	return decoded;
}
function decodeAnsiCString(text) {
	return decodeAnsiCStringWithOffsets(text).value;
}
function hasDynamicWordPart(root) {
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) break;
		if (DYNAMIC_WORD_NODE_TYPES.has(node.type)) return true;
		for (const child of node.namedChildren) pending.push(child);
	}
	return false;
}
function shellWordValue(node) {
	if (DYNAMIC_WORD_NODE_TYPES.has(node.type)) return {
		kind: "dynamic",
		value: node.text
	};
	if (node.type !== "command_name" && node.type !== "concatenation" && node.namedChildren.some((child) => hasDynamicWordPart(child))) return {
		kind: "dynamic",
		value: node.type === "string" ? decodeDoubleQuotedText(node.text) : node.text
	};
	switch (node.type) {
		case "command_name": {
			const parts = node.namedChildren;
			if (parts.length === 0) return hasUnescapedDynamicPattern(node.text) ? {
				kind: "dynamic",
				value: decodeUnquotedShellText(node.text)
			} : {
				kind: "literal",
				value: decodeUnquotedShellText(node.text)
			};
			let value = "";
			for (const part of parts) {
				const partValue = shellWordValue(part);
				value += partValue.value;
				if (partValue.kind !== "literal") return {
					kind: "dynamic",
					value
				};
			}
			return {
				kind: "literal",
				value
			};
		}
		case "word": return hasUnescapedDynamicPattern(node.text) ? {
			kind: "dynamic",
			value: decodeUnquotedShellText(node.text)
		} : {
			kind: "literal",
			value: decodeUnquotedShellText(node.text)
		};
		case "raw_string": return {
			kind: "literal",
			value: node.text.slice(1, -1)
		};
		case "string": return {
			kind: "literal",
			value: decodeDoubleQuotedText(node.text)
		};
		case "ansi_c_string": return {
			kind: "literal",
			value: decodeAnsiCString(node.text)
		};
		case "concatenation": {
			if (hasUnescapedDynamicPattern(node.text)) return {
				kind: "dynamic",
				value: decodeUnquotedShellText(node.text)
			};
			let value = "";
			let dynamic = false;
			for (const child of node.namedChildren) {
				const childValue = shellWordValue(child);
				value += childValue.value;
				if (childValue.kind !== "literal") dynamic = true;
			}
			return dynamic ? {
				kind: "dynamic",
				value
			} : {
				kind: "literal",
				value
			};
		}
		default: return node.namedChildren.some((child) => shellWordValue(child).kind === "dynamic") ? {
			kind: "dynamic",
			value: decodeUnquotedShellText(node.text)
		} : {
			kind: "literal",
			value: decodeUnquotedShellText(node.text)
		};
	}
}
function appendCommandArgument(node, parsed, state) {
	const value = shellWordValue(node);
	const argument = argumentFromNode(parsed.argv.length, node, value, state.spanBase);
	parsed.arguments.push(argument);
	if (value.kind === "dynamic") parsed.dynamicArguments.push({
		index: argument.index,
		text: argument.text,
		value: argument.value,
		span: argument.span
	});
	parsed.argv.push(value.value);
}
function argvFromCommand(node, nameNode, state) {
	if (hasEscapedLineContinuation(nameNode.text) || hasExecutableLineContinuation(node.text)) return null;
	const executable = shellWordValue(nameNode);
	if (executable.kind !== "literal") return null;
	const parsed = {
		argv: [executable.value],
		arguments: [],
		dynamicArguments: []
	};
	for (const child of node.childrenForFieldName("argument")) {
		if (!COMMAND_ARGUMENT_NODE_TYPES.has(child.type)) continue;
		appendCommandArgument(child, parsed, state);
	}
	return parsed;
}
function firstShellToken(text) {
	return text.trimStart().match(/^\S+/)?.[0] ?? "";
}
function argvFromDeclarationCommand(node, state) {
	const executable = firstShellToken(node.text);
	if (!executable) return null;
	const parsed = {
		argv: [executable],
		arguments: [],
		dynamicArguments: []
	};
	for (const child of node.namedChildren) {
		if (!COMMAND_ARGUMENT_NODE_TYPES.has(child.type) && child.type !== "variable_assignment") continue;
		appendCommandArgument(child, parsed, state);
	}
	return parsed;
}
function appendTestCommandArguments(root, parsed, state) {
	const pending = [root];
	while (pending.length > 0) {
		const node = pending.pop();
		if (!node) break;
		if (node.type === "test_operator" || COMMAND_ARGUMENT_NODE_TYPES.has(node.type)) {
			appendCommandArgument(node, parsed, state);
			continue;
		}
		for (let index = node.namedChildren.length - 1; index >= 0; index -= 1) {
			const child = node.namedChildren[index];
			if (child) pending.push(child);
		}
	}
}
function argvFromTestCommand(node, state) {
	const trimmed = node.text.trimStart();
	const executable = trimmed.startsWith("[[") ? "[[" : trimmed.startsWith("[") ? "[" : "";
	if (!executable) return null;
	const parsed = {
		argv: [executable],
		arguments: [],
		dynamicArguments: []
	};
	for (const child of node.namedChildren) appendTestCommandArguments(child, parsed, state);
	return parsed;
}
function isCommandLikeNode(node) {
	return node.type === "command" || node.type === "declaration_command" || node.type === "test_command";
}
function recordShape(node, output) {
	if ((node.type === "program" || node.type === "list") && (hasDirectChildType(node, ";") || node.namedChildren.filter(isCommandLikeNode).length > 1)) output.shapes.add("sequence");
	if (hasDirectChildType(node, "&")) output.shapes.add("background");
	if (node.type === "pipeline") output.shapes.add("pipeline");
	if (node.type === "list") {
		if (hasDirectChildType(node, "&&")) output.shapes.add("and");
		if (hasDirectChildType(node, "||")) output.shapes.add("or");
	}
	if (node.type === "if_statement") output.shapes.add("if");
	if (node.type === "for_statement") output.shapes.add("for");
	if (node.type === "while_statement") output.shapes.add("while");
	if (node.type === "case_statement") output.shapes.add("case");
	if (node.type === "subshell") output.shapes.add("subshell");
	if (node.type === "compound_statement") output.shapes.add("group");
}
function shellCommandFlag(argv, startIndex) {
	const shell = normalizeExecutableToken(argv[startIndex - 1] ?? argv[0] ?? "");
	for (let index = startIndex; index < argv.length; index += 1) {
		const token = argv[index]?.trim();
		if (!token) continue;
		if (token === "--") break;
		const lower = token.toLowerCase();
		if (shell === "cmd") {
			if (lower === "/c" || lower === "/k") return {
				flag: token,
				index
			};
			continue;
		}
		if (shell === "powershell" || shell === "pwsh") {
			if (lower === "-c" || lower === "-command" || lower === "--command" || lower === "-encodedcommand" || lower === "-enc" || lower === "-e" || lower === "-f" || lower === "-file") return {
				flag: token,
				index
			};
			continue;
		}
		if (lower === "-c" || lower === "--command") return {
			flag: token,
			index
		};
		if (token.startsWith("-") && !token.startsWith("--") && lower.slice(1).includes("c")) return {
			flag: token,
			index
		};
	}
	return null;
}
function canParseShellWrapperPayload(transportArgv, commandFlag) {
	const shellExecutable = normalizeExecutableToken(transportArgv[0] ?? "");
	if (!PARSEABLE_SHELL_WRAPPERS.has(shellExecutable)) return false;
	const lowerFlag = commandFlag?.toLowerCase() ?? "";
	return lowerFlag === "-c" || lowerFlag === "--command" || /^-[^-]*c[^-]*$/i.test(lowerFlag);
}
function isDynamicPayload(payload, dynamicArguments) {
	return dynamicArguments.some((argument) => argument.value === payload);
}
function payloadBaseFromArgument(argument, payload) {
	const payloadOffset = argument.value.indexOf(payload);
	if (payloadOffset < 0) return null;
	const rawPayloadOffset = argument.decodedSourceOffsets[payloadOffset];
	if (rawPayloadOffset === void 0) return null;
	return { mapOffset(offset) {
		const mappedRawOffset = argument.decodedSourceOffsets[payloadOffset + offset] ?? rawPayloadOffset + offset;
		return {
			index: argument.span.startIndex + mappedRawOffset,
			position: advancePosition(argument.span.startPosition, argument.text.slice(0, mappedRawOffset))
		};
	} };
}
function payloadBaseFromArguments(payload, argumentsList) {
	const exactArgument = argumentsList.find((argument) => argument.value === payload);
	if (exactArgument) return payloadBaseFromArgument(exactArgument, payload);
	for (const argument of argumentsList) {
		const base = payloadBaseFromArgument(argument, payload);
		if (base) return base;
	}
	return null;
}
function shellWrapperPayloadForParsing(argv, argumentsList, dynamicArguments) {
	const shellWrapper = extractShellWrapperCommand(argv);
	const payload = shellWrapper.command ?? extractShellWrapperInlineCommand(argv);
	if (!shellWrapper.isWrapper || !payload || isDynamicPayload(payload, dynamicArguments)) return null;
	const spanBase = payloadBaseFromArguments(payload, argumentsList);
	if (!spanBase) return null;
	const transportArgv = resolveShellWrapperTransportArgv(argv) ?? argv;
	if (!canParseShellWrapperPayload(transportArgv, (shellCommandFlag(transportArgv, 1) ?? shellCommandFlag(argv, 1))?.flag ?? null)) return null;
	return {
		command: payload,
		spanBase
	};
}
function recordInlineEvalRisk(inlineEval, text, span, output) {
	output.risks.push({
		kind: "inline-eval",
		command: inlineEval.normalizedExecutable,
		flag: inlineEval.flag,
		text,
		span
	});
}
function recordDynamicArgumentRisks(command, dynamicArguments, output) {
	for (const argument of dynamicArguments) output.risks.push({
		kind: "dynamic-argument",
		command,
		argumentIndex: argument.index,
		text: argument.text,
		span: argument.span
	});
}
function recordCommandRisks(argv, dynamicArguments, text, span, output) {
	const executable = argv[0];
	if (!executable) return;
	const normalizedExecutable = normalizeExecutableToken(executable);
	recordDynamicArgumentRisks(normalizedExecutable, dynamicArguments, output);
	const inlineEval = detectInlineEvalArgv(argv) ?? detectCarrierInlineEvalArgv(argv);
	if (inlineEval) recordInlineEvalRisk(inlineEval, text, span, output);
	const shellWrapper = extractShellWrapperCommand(argv);
	const shellWrapperPayload = shellWrapper.command ?? extractShellWrapperInlineCommand(argv);
	if (shellWrapper.isWrapper && shellWrapperPayload) {
		const transportArgv = resolveShellWrapperTransportArgv(argv) ?? argv;
		const shellExecutable = transportArgv[0] ?? executable;
		const commandFlag = shellCommandFlag(transportArgv, 1) ?? shellCommandFlag(argv, 1);
		if (isShellWrapperExecutable(executable)) output.risks.push({
			kind: "shell-wrapper",
			executable: shellExecutable,
			flag: commandFlag?.flag ?? "-c",
			payload: shellWrapperPayload,
			text,
			span
		});
		else output.risks.push({
			kind: "shell-wrapper-through-carrier",
			command: normalizedExecutable,
			text,
			span
		});
	}
	for (const carrier of detectCommandCarrierArgv(argv)) output.risks.push({
		kind: "command-carrier",
		command: carrier.command,
		flag: carrier.flag,
		text,
		span
	});
	if (normalizedExecutable === "eval") output.risks.push({
		kind: "eval",
		text,
		span
	});
	if (SOURCE_EXECUTABLES.has(normalizedExecutable)) output.risks.push({
		kind: "source",
		command: normalizedExecutable,
		text,
		span
	});
	if (normalizedExecutable === "alias") output.risks.push({
		kind: "alias",
		text,
		span
	});
	const carrierShellWrapper = !shellWrapper.isWrapper ? detectShellWrapperThroughCarrierArgv(argv, shellCommandFlag) : null;
	if (carrierShellWrapper) output.risks.push({
		kind: "shell-wrapper-through-carrier",
		command: carrierShellWrapper,
		text,
		span
	});
	const carriedShellBuiltin = detectCarriedShellBuiltinArgv(argv);
	if (carriedShellBuiltin?.kind === "eval") output.risks.push({
		kind: "eval",
		text,
		span
	});
	else if (carriedShellBuiltin?.kind === "source") output.risks.push({
		kind: "source",
		command: carriedShellBuiltin.command,
		text,
		span
	});
}
async function visitNode(node, output, context, state) {
	recordShape(node, output);
	const span = spanFromNode(node, state.spanBase);
	let childContext = context;
	if (node.type === "program" && hasEscapedLineContinuation(node.text)) output.risks.push({
		kind: "line-continuation",
		text: node.text,
		span
	});
	else if (node.type === "word" && hasLineBreakEscapedWordBoundary(node.text)) output.risks.push({
		kind: "line-continuation",
		text: node.text,
		span
	});
	if (node.type === "function_definition") {
		const nameNode = node.childForFieldName("name");
		output.risks.push({
			kind: "function-definition",
			name: nameNode?.text ?? "",
			text: node.text,
			span
		});
		childContext = "function-definition";
	} else if (node.type === "command_substitution") {
		output.risks.push({
			kind: "command-substitution",
			text: node.text,
			span
		});
		childContext = "command-substitution";
	} else if (node.type === "process_substitution") {
		output.risks.push({
			kind: "process-substitution",
			text: node.text,
			span
		});
		childContext = "process-substitution";
	} else if (node.type === "heredoc_redirect") output.risks.push({
		kind: "heredoc",
		text: node.text,
		span
	});
	else if (node.type === "herestring_redirect") output.risks.push({
		kind: "here-string",
		text: node.text,
		span
	});
	else if (node.type === "file_redirect") output.risks.push({
		kind: "redirect",
		text: node.text,
		span
	});
	else if (node.type === "ERROR") output.risks.push({
		kind: "syntax-error",
		text: node.text,
		span
	});
	if (node.type === "command" || node.type === "declaration_command" || node.type === "test_command") {
		const nameNode = node.type === "command" ? node.childForFieldName("name") : null;
		const parsed = node.type === "command" ? nameNode ? argvFromCommand(node, nameNode, state) : null : node.type === "declaration_command" ? argvFromDeclarationCommand(node, state) : argvFromTestCommand(node, state);
		if (node.type === "command" && nameNode && !parsed) output.risks.push({
			kind: "dynamic-executable",
			text: nameNode.text,
			span: spanFromNode(nameNode, state.spanBase)
		});
		else if (parsed) {
			const commandId = `command-${output.nextCommandIndex}`;
			const step = {
				id: commandId,
				context,
				executable: parsed.argv[0] ?? "",
				argv: parsed.argv,
				text: node.text,
				span,
				executableSpan: nameNode !== null ? spanFromNode(nameNode, state.spanBase) : parsed.arguments[0]?.span ?? span
			};
			if (nameNode) step.argvSpans = [step.executableSpan, ...parsed.arguments.map((argument) => argument.span)];
			if (state.parentCommandId) step.parentCommandId = state.parentCommandId;
			if (step.executable) {
				output.nextCommandIndex += 1;
				output.commands.push(step);
				recordCommandRisks(parsed.argv, parsed.dynamicArguments, node.text, span, output);
				const wrapperPayload = shellWrapperPayloadForParsing(parsed.argv, parsed.arguments, parsed.dynamicArguments);
				if (wrapperPayload && state.wrapperPayloadDepth < MAX_WRAPPER_PAYLOAD_DEPTH) {
					const wrapperTree = await parseBashForCommandExplanation(wrapperPayload.command);
					const wrapperSpanBase = wrapperPayload.spanBase;
					try {
						output.operatorSources.push({
							context: "wrapper-payload",
							parentCommandId: commandId,
							source: wrapperPayload.command,
							spanBase: wrapperSpanBase
						});
						if (wrapperTree.rootNode.hasError) {
							output.hasParseError = true;
							output.risks.push({
								kind: "syntax-error",
								text: wrapperPayload.command,
								span: spanFromNode(wrapperTree.rootNode, wrapperSpanBase)
							});
						}
						await walk(wrapperTree.rootNode, output, "wrapper-payload", {
							wrapperPayloadDepth: state.wrapperPayloadDepth + 1,
							spanBase: wrapperSpanBase,
							parentCommandId: commandId
						});
					} finally {
						wrapperTree.delete();
					}
				}
			}
		}
	}
	return childContext;
}
async function walk(root, output, rootContext, rootState) {
	if (root.descendantCount > output.remainingNodes) throw new CommandExplanationWorkLimitError("Shell command syntax is too complex to explain safely");
	output.remainingNodes -= root.descendantCount;
	const pending = [{
		node: root,
		context: rootContext,
		state: rootState
	}];
	while (pending.length > 0) {
		const frame = pending.pop();
		if (!frame) break;
		const { node, context, state } = frame;
		const childContext = await visitNode(node, output, context, state);
		for (let index = node.namedChildren.length - 1; index >= 0; index -= 1) {
			const child = node.namedChildren[index];
			if (child) pending.push({
				node: child,
				context: childContext,
				state
			});
		}
	}
}
function commandBucketKey(command) {
	return `${command.context}\0${command.parentCommandId ?? ""}`;
}
function commandTopologyBuckets(commands) {
	const buckets = /* @__PURE__ */ new Map();
	for (const command of commands) {
		if (!command.id) continue;
		const key = commandBucketKey(command);
		const bucket = buckets.get(key);
		if (bucket) {
			bucket.commands.push(command);
			continue;
		}
		const newBucket = {
			context: command.context,
			commands: [command]
		};
		if (command.parentCommandId) newBucket.parentCommandId = command.parentCommandId;
		buckets.set(key, newBucket);
	}
	return Array.from(buckets.values()).map((bucket) => {
		const sortedBucket = {
			context: bucket.context,
			commands: bucket.commands.toSorted((left, right) => left.span.startIndex - right.span.startIndex)
		};
		if (bucket.parentCommandId) sortedBucket.parentCommandId = bucket.parentCommandId;
		return sortedBucket;
	});
}
function operatorSourceForBucket(bucket, sources) {
	return sources.find((source) => source.context === bucket.context && source.parentCommandId === bucket.parentCommandId) ?? null;
}
function commandSourceRanges(source, commands) {
	const ranges = /* @__PURE__ */ new Map();
	let cursor = 0;
	for (const command of commands) {
		if (!command.id) return null;
		const startIndex = source.indexOf(command.text, cursor);
		if (startIndex < 0) return null;
		const endIndex = startIndex + command.text.length;
		ranges.set(command.id, {
			startIndex,
			endIndex
		});
		cursor = endIndex;
	}
	return ranges;
}
function topologyOperatorFromSeparator(separator) {
	const candidates = [
		{
			kind: "and",
			text: "&&"
		},
		{
			kind: "or",
			text: "||"
		},
		{
			kind: "stderr-pipe",
			text: "|&"
		},
		{
			kind: "pipe",
			text: "|"
		},
		{
			kind: "sequence",
			text: ";"
		},
		{
			kind: "background",
			text: "&"
		},
		{
			kind: "newline-sequence",
			text: "\r\n"
		},
		{
			kind: "newline-sequence",
			text: "\n"
		},
		{
			kind: "newline-sequence",
			text: "\r"
		}
	];
	let best = null;
	for (const candidate of candidates) {
		const offset = separator.indexOf(candidate.text);
		if (offset < 0) continue;
		if (!best || offset < best.offset) best = {
			...candidate,
			offset
		};
	}
	return best;
}
function resolveOperators(source, commands, operatorSources) {
	const operators = [];
	for (const bucket of commandTopologyBuckets(commands)) {
		const bucketOperatorSource = operatorSourceForBucket(bucket, operatorSources);
		const bucketRanges = bucketOperatorSource ? commandSourceRanges(bucketOperatorSource.source, bucket.commands) : null;
		for (let index = 0; index < bucket.commands.length - 1; index += 1) {
			const fromCommand = bucket.commands[index];
			const toCommand = bucket.commands[index + 1];
			if (!fromCommand?.id || !toCommand?.id) continue;
			let separatorSource = source;
			let separatorStart = fromCommand.span.endIndex;
			let separatorEnd = toCommand.span.startIndex;
			let separatorBase = null;
			const fromRange = bucketRanges?.get(fromCommand.id);
			const toRange = bucketRanges?.get(toCommand.id);
			if (bucketOperatorSource && fromRange && toRange) {
				separatorSource = bucketOperatorSource.source;
				separatorStart = fromRange.endIndex;
				separatorEnd = toRange.startIndex;
				separatorBase = bucketOperatorSource.spanBase;
			}
			if (separatorEnd < separatorStart) continue;
			const operator = topologyOperatorFromSeparator(separatorSource.slice(separatorStart, separatorEnd));
			if (!operator) continue;
			const startIndex = separatorStart + operator.offset;
			const span = separatorBase ? translateSpan(spanFromSourceRange(separatorSource, startIndex, startIndex + operator.text.length), separatorBase) : spanFromSourceRange(source, startIndex, startIndex + operator.text.length);
			const topologyOperator = {
				id: `operator-${operators.length}`,
				kind: operator.kind,
				text: operator.text,
				span,
				fromCommandId: fromCommand.id,
				toCommandId: toCommand.id
			};
			if (bucket.parentCommandId) topologyOperator.parentCommandId = bucket.parentCommandId;
			operators.push(topologyOperator);
		}
	}
	return operators;
}
/** Parses a shell command into command steps, shapes, risks, and source spans. */
async function explainShellCommand(source) {
	const tree = await parseBashForCommandExplanation(source);
	try {
		const output = {
			shapes: /* @__PURE__ */ new Set(),
			commands: [],
			operatorSources: [],
			risks: [],
			hasParseError: tree.rootNode.hasError,
			nextCommandIndex: 0,
			remainingNodes: MAX_COMMAND_EXPLANATION_NODES
		};
		await walk(tree.rootNode, output, "top-level", {
			wrapperPayloadDepth: 0,
			spanBase: ROOT_SPAN_BASE
		});
		const topLevelCommands = output.commands.filter((command) => command.context === "top-level");
		const operators = resolveOperators(source, output.commands, output.operatorSources);
		return {
			ok: !output.hasParseError,
			source,
			shapes: [...output.shapes],
			topLevelCommands,
			nestedCommands: output.commands.filter((command) => command.context !== "top-level"),
			operators,
			risks: output.risks
		};
	} finally {
		tree.delete();
	}
}
//#endregion
export { explainShellCommand as n, CommandExplanationWorkLimitError as t };
