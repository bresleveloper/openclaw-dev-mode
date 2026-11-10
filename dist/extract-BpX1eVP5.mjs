import { T as normalizeExecutableToken, a as extractShellWrapperCommand, d as isShellWrapperExecutable, o as extractShellWrapperInlineCommand, p as resolveShellWrapperTransportArgv, t as POSIX_PARSEABLE_SHELL_WRAPPERS, x as SOURCE_EXECUTABLES } from "./shell-wrapper-resolution-kxOrsoTv.mjs";
import "./exec-wrapper-resolution-CXchNEiE.mjs";
import { a as detectInlineEvalArgv, i as detectCommandCarrierArgv, n as detectCarriedShellBuiltinArgv, r as detectCarrierInlineEvalArgv, s as detectShellWrapperThroughCarrierArgv } from "./risks-VRoLvNNn.mjs";
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
	return parseBashForCommandExplanation.bind(null, new TreeSitter.Parser().setLanguage(language));
}
/** Callers own each returned tree and must delete it before yielding. */
function getBashParserForCommandExplanation() {
	parserPromise ??= loadParser().catch((error) => {
		parserPromise = null;
		throw error;
	});
	return parserPromise;
}
function parseBashForCommandExplanation(parser, source) {
	if (source.length > MAX_COMMAND_EXPLANATION_SOURCE_CHARS) throw new Error("Shell command is too large to explain");
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
		if (ch === "\r" || ch === "\n") {
			if (ch === "\r" && text[index + 1] === "\n") index += 1;
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
			decoded = decodeShellTextWithOffsets(node.text, "double");
			break;
		case "ansi_c_string":
			decoded = decodeShellTextWithOffsets(node.text, "ansi-c");
			break;
		default: decoded = decodeShellTextWithOffsets(node.text);
	}
	if (decoded.value === value && decoded.sourceOffsets.length === value.length + 1) return decoded.sourceOffsets;
	const prefixLength = valuePrefixLength(node);
	return Array.from({ length: value.length + 1 }, (_, index) => prefixLength + index);
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
function decodeShellTextWithOffsets(text, quoting = "unquoted") {
	const prefix = quoting === "double" ? "\"" : quoting === "ansi-c" ? "$'" : "";
	const hasQuotes = prefix && text.startsWith(prefix) && text.endsWith(prefix.slice(-1));
	const bodyStart = hasQuotes ? prefix.length : 0;
	const body = hasQuotes ? text.slice(bodyStart, -1) : text;
	const decoded = {
		value: "",
		sourceOffsets: [bodyStart]
	};
	for (let index = 0; index < body.length; index += 1) {
		const ch = body.charAt(index);
		const next = body[index + 1];
		const sourceOffset = bodyStart + index;
		if (ch !== "\\" || next === void 0 || quoting === "double" && ![
			"\\",
			"\"",
			"$",
			"`",
			"\n",
			"\r"
		].includes(next)) {
			appendDecodedText(decoded, ch, sourceOffset + 1);
			continue;
		}
		if (quoting !== "ansi-c" && (next === "\n" || next === "\r")) {
			const width = next === "\r" && body[index + 2] === "\n" ? 3 : 2;
			decoded.sourceOffsets[decoded.value.length] = sourceOffset + width;
			index += width - 1;
			continue;
		}
		let digits;
		let radix = 16;
		let prefixLength = 2;
		if (quoting === "ansi-c") {
			if (next === "x" || next === "u" || next === "U") {
				const maxLength = next === "x" ? 2 : next === "u" ? 4 : 8;
				digits = body.slice(index + 2).match(new RegExp(`^[0-9A-Fa-f]{1,${maxLength}}`))?.[0];
			} else if (/^[0-7]$/.test(next)) {
				digits = body.slice(index + 1).match(/^[0-7]{1,3}/)?.[0];
				radix = 8;
				prefixLength = 1;
			}
		}
		if (digits) {
			const endOffset = sourceOffset + prefixLength + digits.length;
			try {
				appendDecodedText(decoded, String.fromCodePoint(Number.parseInt(digits, radix)), endOffset);
			} catch {
				appendDecodedText(decoded, `\\${next}${digits}`, endOffset);
			}
			index += prefixLength + digits.length - 1;
			continue;
		}
		appendDecodedText(decoded, quoting === "ansi-c" ? ANSI_C_SIMPLE_ESCAPES[next] ?? next : next, sourceOffset + 2);
		index += 1;
	}
	return decoded;
}
function hasDynamicWordPart(root) {
	const pending = [root];
	for (let node = pending.pop(); node; node = pending.pop()) {
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
		value: node.type === "string" ? decodeShellTextWithOffsets(node.text, "double").value : node.text
	};
	switch (node.type) {
		case "command_name":
		case "concatenation": {
			const parts = node.namedChildren;
			if (node.type === "command_name" ? parts.length === 0 : hasUnescapedDynamicPattern(node.text)) return {
				kind: hasUnescapedDynamicPattern(node.text) ? "dynamic" : "literal",
				value: decodeShellTextWithOffsets(node.text).value
			};
			let value = "";
			let dynamic = false;
			for (const part of parts) {
				const partValue = shellWordValue(part);
				value += partValue.value;
				if (partValue.kind !== "literal") {
					dynamic = true;
					if (node.type === "command_name") break;
				}
			}
			return {
				kind: dynamic ? "dynamic" : "literal",
				value
			};
		}
		case "word": return {
			kind: hasUnescapedDynamicPattern(node.text) ? "dynamic" : "literal",
			value: decodeShellTextWithOffsets(node.text).value
		};
		case "raw_string": return {
			kind: "literal",
			value: node.text.slice(1, -1)
		};
		case "string": return {
			kind: "literal",
			value: decodeShellTextWithOffsets(node.text, "double").value
		};
		case "ansi_c_string": return {
			kind: "literal",
			value: decodeShellTextWithOffsets(node.text, "ansi-c").value
		};
		default: return {
			kind: node.namedChildren.some((child) => shellWordValue(child).kind === "dynamic") ? "dynamic" : "literal",
			value: decodeShellTextWithOffsets(node.text).value
		};
	}
}
function appendCommandArgument(node, parsed, state) {
	const value = shellWordValue(node);
	const argument = {
		index: parsed.argv.length,
		text: node.text,
		value: value.value,
		span: spanFromNode(node, state.spanBase),
		decodedSourceOffsets: decodedSourceOffsetsForNode(node, value.value)
	};
	parsed.arguments.push(argument);
	if (value.kind === "dynamic") parsed.dynamicArguments.push(argument);
	parsed.argv.push(value.value);
}
function argvFromCommand(node, nameNode, state) {
	let executable;
	if (node.type === "command") {
		if (!nameNode || hasEscapedLineContinuation(nameNode.text) || hasExecutableLineContinuation(node.text)) return null;
		const value = shellWordValue(nameNode);
		if (value.kind !== "literal") return null;
		executable = value.value;
	} else if (node.type === "declaration_command") executable = node.text.trimStart().match(/^\S+/)?.[0] ?? "";
	else {
		const trimmed = node.text.trimStart();
		executable = trimmed.startsWith("[[") ? "[[" : trimmed.startsWith("[") ? "[" : "";
	}
	if (node.type !== "command" && !executable) return null;
	const parsed = {
		argv: [executable],
		arguments: [],
		dynamicArguments: []
	};
	const children = node.type === "command" ? node.childrenForFieldName("argument") : node.namedChildren;
	for (const child of children) if (node.type === "test_command") appendTestCommandArguments(child, parsed, state);
	else if (COMMAND_ARGUMENT_NODE_TYPES.has(child.type) || node.type === "declaration_command" && child.type === "variable_assignment") appendCommandArgument(child, parsed, state);
	return parsed;
}
function appendTestCommandArguments(root, parsed, state) {
	const pending = [root];
	for (let node = pending.pop(); node; node = pending.pop()) {
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
function isCommandLikeNode(node) {
	return node.type === "command" || node.type === "declaration_command" || node.type === "test_command";
}
function recordShape(node, output) {
	if ((node.type === "program" || node.type === "list") && (hasDirectChildType(node, ";") || node.namedChildren.filter(isCommandLikeNode).length > 1)) output.shapes.add("sequence");
	if (hasDirectChildType(node, "&")) output.shapes.add("background");
	if (node.type === "list") {
		if (hasDirectChildType(node, "&&")) output.shapes.add("and");
		if (hasDirectChildType(node, "||")) output.shapes.add("or");
	}
	const shape = STATEMENT_SHAPES.get(node.type);
	if (shape) output.shapes.add(shape);
}
const STATEMENT_SHAPES = /* @__PURE__ */ new Map([
	["pipeline", "pipeline"],
	["if_statement", "if"],
	["for_statement", "for"],
	["while_statement", "while"],
	["case_statement", "case"],
	["subshell", "subshell"],
	["compound_statement", "group"]
]);
function shellCommandFlag(argv, startIndex) {
	const shell = normalizeExecutableToken(argv[startIndex - 1] ?? argv[0] ?? "");
	const isPosix = shell !== "cmd" && shell !== "powershell" && shell !== "pwsh";
	const flags = shell === "cmd" ? ["/c", "/k"] : isPosix ? ["-c", "--command"] : [
		"-c",
		"-command",
		"--command",
		"-encodedcommand",
		"-enc",
		"-e",
		"-f",
		"-file"
	];
	for (let index = startIndex; index < argv.length; index += 1) {
		const token = argv[index]?.trim();
		if (!token) continue;
		if (token === "--") break;
		const lower = token.toLowerCase();
		if (flags.includes(lower) || isPosix && token.startsWith("-") && !token.startsWith("--") && lower.slice(1).includes("c")) return {
			flag: token,
			index
		};
	}
	return null;
}
function canParseShellWrapperPayload(transportArgv, commandFlag) {
	const shellExecutable = normalizeExecutableToken(transportArgv[0] ?? "");
	if (!POSIX_PARSEABLE_SHELL_WRAPPERS.has(shellExecutable)) return false;
	const lowerFlag = commandFlag?.toLowerCase() ?? "";
	return lowerFlag === "-c" || lowerFlag === "--command" || /^-[^-]*c[^-]*$/i.test(lowerFlag);
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
function recordCommandRisks(parsed, text, span, output) {
	const { argv, dynamicArguments } = parsed;
	const executable = argv[0];
	if (!executable) return null;
	const normalizedExecutable = normalizeExecutableToken(executable);
	for (const argument of dynamicArguments) output.risks.push({
		kind: "dynamic-argument",
		command: normalizedExecutable,
		argumentIndex: argument.index,
		text: argument.text,
		span: argument.span
	});
	const inlineEval = detectInlineEvalArgv(argv) ?? detectCarrierInlineEvalArgv(argv);
	if (inlineEval) output.risks.push({
		kind: "inline-eval",
		command: inlineEval.normalizedExecutable,
		flag: inlineEval.flag,
		text,
		span
	});
	const shellWrapper = extractShellWrapperCommand(argv);
	const shellWrapperPayload = shellWrapper.command ?? extractShellWrapperInlineCommand(argv);
	let wrapperPayload = null;
	if (shellWrapper.isWrapper && shellWrapperPayload) {
		const transportArgv = resolveShellWrapperTransportArgv(argv) ?? argv;
		const shellExecutable = transportArgv[0] ?? executable;
		const commandFlag = shellCommandFlag(transportArgv, 1) ?? shellCommandFlag(argv, 1);
		if (!dynamicArguments.some((argument) => argument.value === shellWrapperPayload) && canParseShellWrapperPayload(transportArgv, commandFlag?.flag ?? null)) {
			const spanBase = payloadBaseFromArguments(shellWrapperPayload, parsed.arguments);
			if (spanBase) wrapperPayload = {
				command: shellWrapperPayload,
				spanBase
			};
		}
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
	return wrapperPayload;
}
function visitNode(node, output, context, state) {
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
	if (isCommandLikeNode(node)) {
		const nameNode = node.type === "command" ? node.childForFieldName("name") : null;
		const parsed = argvFromCommand(node, nameNode, state);
		if (node.type === "command" && nameNode && !parsed) output.risks.push({
			kind: "dynamic-executable",
			text: nameNode.text,
			span: spanFromNode(nameNode, state.spanBase)
		});
		else if (parsed) {
			const commandId = `command-${output.commands.length}`;
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
				output.commands.push(step);
				const wrapperPayload = recordCommandRisks(parsed, node.text, span, output);
				if (wrapperPayload && state.wrapperPayloadDepth < MAX_WRAPPER_PAYLOAD_DEPTH) {
					const wrapperTree = state.parse(wrapperPayload.command);
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
						walk(wrapperTree.rootNode, output, "wrapper-payload", {
							parse: state.parse,
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
function walk(root, output, rootContext, rootState) {
	if (root.descendantCount > output.remainingNodes) throw new CommandExplanationWorkLimitError("Shell command syntax is too complex to explain safely");
	output.remainingNodes -= root.descendantCount;
	const pending = [{
		node: root,
		context: rootContext,
		state: rootState
	}];
	for (let frame = pending.pop(); frame; frame = pending.pop()) {
		const { node, context, state } = frame;
		const childContext = visitNode(node, output, context, state);
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
function commandTopologyBuckets(commands) {
	const buckets = /* @__PURE__ */ new Map();
	for (const command of commands) {
		const key = `${command.context}\0${command.parentCommandId ?? ""}`;
		const bucket = buckets.get(key);
		if (bucket) bucket.push(command);
		else buckets.set(key, [command]);
	}
	for (const bucket of buckets.values()) bucket.sort((left, right) => left.span.startIndex - right.span.startIndex);
	return Array.from(buckets.values());
}
function commandSourceRanges(source, commands) {
	const ranges = /* @__PURE__ */ new Map();
	let cursor = 0;
	for (const command of commands) {
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
		const context = bucket[0].context;
		const parentCommandId = bucket[0].parentCommandId || void 0;
		const bucketOperatorSource = operatorSources.find((entry) => entry.context === context && entry.parentCommandId === parentCommandId);
		const bucketRanges = bucketOperatorSource ? commandSourceRanges(bucketOperatorSource.source, bucket) : null;
		for (const [index, fromCommand] of bucket.entries()) {
			const toCommand = bucket[index + 1];
			if (!toCommand) break;
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
			if (parentCommandId) topologyOperator.parentCommandId = parentCommandId;
			operators.push(topologyOperator);
		}
	}
	return operators;
}
async function explainShellCommand(source) {
	const parse = await getBashParserForCommandExplanation();
	const tree = parse(source);
	try {
		const output = {
			shapes: /* @__PURE__ */ new Set(),
			commands: [],
			operatorSources: [],
			risks: [],
			hasParseError: tree.rootNode.hasError,
			remainingNodes: MAX_COMMAND_EXPLANATION_NODES
		};
		walk(tree.rootNode, output, "top-level", {
			parse,
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
