import { An as isValidCreditCard, Bn as validateURL, Dn as isValidBase64, Hn as Doc, Ln as stripTabAndNewline, Mn as isValidIPv6, Nn as isValidJWT, On as isValidBase64URL, Pn as mergeValues, Qr as $ZodAsyncError, Rn as urlHostnameOk, _r as number, ci as codePointLength, di as esc, gi as isPlainObject, ji as shallowClone, jn as isValidIBAN, kn as isValidCIDRv6, pi as floatSafeRemainder, si as clone, zn as urlProtocolOk } from "./json-schema-processors-C6KO_BFy.mjs";
import { Ha as isRecursiveSchema, Va as isBackEdge } from "./schemas-BOYIvvln.mjs";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/compile.js
/** @internal Sentinel the compiled fast path returns when validation fails. */
const INVALID = Symbol.for("zod.compile.invalid");
const FALLBACK_FLAG = Symbol.for("zod.compile.fallback");
/** Raised when the schema contains async refinements or transforms. Surfaces only under `compile(schema, { strict: true })`. */
var ZodCompileAsyncError = class extends Error {
	constructor(message = "z.compile does not support async refinements, transforms, or checks") {
		super(message);
		this.name = "ZodCompileAsyncError";
	}
};
/**
* Raised when the schema contains a feature whose semantics the fast path
* can't fully model. Both the shim in `zod/compile` and the default
* `compile()` fall back to the runtime parser for that schema; only
* `compile(schema, { strict: true })` lets it surface.
*/
var ZodCompileUnsupportedError = class extends Error {
	constructor(feature, islandable = true) {
		super(`z.compile does not support ${feature}; this schema must use the runtime parser`);
		this.name = "ZodCompileUnsupportedError";
		this.islandable = islandable;
	}
};
/**
* Build the validator `validate` calls: the same codegen as the parser with the output construction
* dropped. A schema the flag cannot express reuses the parser, which still answers correctly — it
* just builds a value nothing reads.
*/
function compileValidator(schema, parser) {
	try {
		return compileFn(schema, { assertOnly: true });
	} catch {
		return parser;
	}
}
/**
* AOT-compile a Zod schema. Returns a clone whose `_zod.run` calls a generated
* fast path first and falls back to the original runtime parser on failure.
*
* - Forward direction only. Backward (encode), async, and `skipChecks` paths
*   bypass the fast path and use the runtime directly.
* - Never throws. A schema the fast path can't model is returned unchanged and
*   keeps using the runtime parser. Pass `{ strict: true }` to get the refusal
*   as a thrown `ZodCompileUnsupportedError` / `ZodCompileAsyncError` instead.
* - The original schema is unchanged. The clone shares children by reference.
*/
function compile(schema, options) {
	try {
		const parser = compileFn(schema);
		const clone = withParser(schema, parser);
		clone._zod.bag.validator = compileValidator(schema, parser);
		return clone;
	} catch (err) {
		if (options?.strict) throw err;
		return schema;
	}
}
/**
* Install an already-generated parser as a schema's fast path. Returns a clone; the original is
* unchanged.
*
* The parser takes the input and returns the parsed value, or `INVALID` to hand the parse to the
* runtime. It must be synchronous and forward-direction, and it must build fresh output rather than
* return its input — Zod cannot check either, and a wrong *success* is returned to the caller as-is.
*
* `compile()` is the ordinary entry point. This is for a build-time or native compiler that produces
* a parser where `new Function` is unavailable.
*/
function withParser(schema, parser) {
	if (isRecursiveSchema(schema)) throw new ZodCompileUnsupportedError("a schema whose subtree contains a reference cycle");
	const clone$1 = clone(schema);
	const liveRun = schema._zod.run;
	const originalRun = liveRun.__originalRun ?? liveRun;
	const wrapped = (payload, ctx) => {
		if (ctx?.async || ctx?.direction === "backward" || ctx?.skipChecks || ctx?.[FALLBACK_FLAG]) return originalRun(payload, ctx);
		if (ctx && isBackEdge(ctx, payload.value)) return originalRun(payload, ctx);
		const out = parser(payload.value);
		if (out !== INVALID) {
			payload.value = out;
			return payload;
		}
		if (ctx) ctx[FALLBACK_FLAG] = true;
		return originalRun(payload, ctx);
	};
	wrapped.__originalRun = originalRun;
	clone$1._zod.bag.fallbackRun = originalRun;
	clone$1._zod.bag.validator = parser;
	clone$1._zod.run = wrapped;
	if (!liveRun.__originalRun) installCompiledUserMethods(clone$1, schema, parser);
	return clone$1;
}
function installCompiledUserMethods(target, source, parser) {
	const targetAny = target;
	const sourceAny = source;
	if (typeof sourceAny.safeParse === "function") {
		const originalSafeParse = sourceAny.safeParse;
		targetAny.safeParse = (data, params) => {
			const out = parser(data);
			if (out !== INVALID) return {
				success: true,
				data: out
			};
			return originalSafeParse(data, params);
		};
	}
	if (typeof sourceAny.parse === "function") {
		const originalParse = sourceAny.parse;
		targetAny.parse = (data, params) => {
			const out = parser(data);
			if (out !== INVALID) return out;
			return originalParse(data, params);
		};
	}
}
/**
* @internal Generate the standalone compiled function: a parser by default, a validator under
* `assertOnly`. Returns the parsed value, `true` where nothing reads the output, or `INVALID`. Consumers use `compile()`.
*/
function compileFn(schema, options) {
	let recursive = true;
	try {
		recursive = isRecursiveSchema(schema);
	} catch {}
	if (recursive) throw new ZodCompileUnsupportedError("a schema whose subtree contains a reference cycle");
	const ctx = {
		constants: /* @__PURE__ */ new Map(),
		constantCounter: 0,
		varCounter: 0,
		definite: true
	};
	const doc = new Doc(["input"]);
	const outputAccessor = generateCheck(doc, ctx, schema, "input", !options?.assertOnly);
	doc.write(outputAccessor === null ? `return true;` : `return ${outputAccessor};`);
	const constantNames = ["INVALID", ...ctx.constants.keys()];
	const constantValues = [INVALID, ...ctx.constants.values()];
	const code = doc.content.join("\n");
	const fullCode = options?.debug ? constantNames.length > 0 ? `// Constants: ${constantNames.join(", ")}\n${code}` : code : "";
	const F = Function;
	const factoryCode = `return (input) => {\n${code}\n}`;
	let fn;
	try {
		fn = new F(...constantNames, factoryCode)(...constantValues);
	} catch (err) {
		throw new ZodCompileUnsupportedError(`this schema (generated code failed to evaluate: ${err.message})`);
	}
	if (options?.debug) fn.code = fullCode;
	fn.definite = ctx.definite;
	return fn;
}
function addConstant(ctx, value) {
	for (const [name, v] of ctx.constants) if (v === value) return name;
	const name = `c${ctx.constantCounter++}`;
	ctx.constants.set(name, value);
	return name;
}
/** Hoists a user-supplied callback. Anything the schema's author wrote can throw, and generated code can reject an earlier sibling before ever reaching it, so this clears `definite` — a rejection is then no longer proof that the interpreter would have rejected rather than thrown. */
function addUserConstant(ctx, fn) {
	ctx.definite = false;
	return addConstant(ctx, fn);
}
function newVar(ctx) {
	return `v${ctx.varCounter++}`;
}
function runtimeRun(schema, value) {
	const result = schema._zod.run({
		value,
		issues: []
	}, {});
	if (result && typeof result.then === "function") return INVALID;
	const r = result;
	return r.issues.length === 0 ? r.value : INVALID;
}
function compileChild(doc, ctx, schema, accessor, needsValue = true) {
	const contentLen = doc.content.length;
	const constantCount = ctx.constants.size;
	const constantCounter = ctx.constantCounter;
	const varCounter = ctx.varCounter;
	try {
		return generateCheck(doc, ctx, schema, accessor, needsValue);
	} catch (err) {
		if (!(err instanceof ZodCompileUnsupportedError) || !err.islandable) throw err;
		doc.content.length = contentLen;
		if (ctx.constants.size > constantCount) {
			const trailing = Array.from(ctx.constants.keys()).slice(constantCount);
			for (const k of trailing) ctx.constants.delete(k);
		}
		ctx.constantCounter = constantCounter;
		ctx.varCounter = varCounter;
		return emitRuntimeIsland(doc, ctx, schema, accessor);
	}
}
function emitRuntimeIsland(doc, ctx, schema, accessor) {
	ctx.definite = false;
	const schemaConst = addConstant(ctx, schema);
	const runConst = addConstant(ctx, runtimeRun);
	const outVar = newVar(ctx);
	doc.write(`const ${outVar} = ${runConst}(${schemaConst}, ${accessor});`);
	doc.write(`if (${outVar} === INVALID) return INVALID;`);
	return outVar;
}
const WHEN_DEFAULTED_CHECKS = /* @__PURE__ */ new Set([
	"max_size",
	"min_size",
	"size_equals",
	"max_length",
	"min_length",
	"length_equals"
]);
function generateChecks(doc, ctx, schema, accessor) {
	const schemaChecks = schema._zod.def.checks;
	if (!schemaChecks || schemaChecks.length === 0) return accessor;
	let currentAccessor = accessor;
	for (const check of schemaChecks) {
		const def = check._zod.def;
		if (def.when && !WHEN_DEFAULTED_CHECKS.has(def.check)) throw new ZodCompileUnsupportedError(`check with a custom "when" condition`);
		switch (def.check) {
			case "greater_than":
				generateGreaterThanCheck(doc, ctx, def, currentAccessor);
				break;
			case "less_than":
				generateLessThanCheck(doc, ctx, def, currentAccessor);
				break;
			case "multiple_of":
				generateMultipleOfCheck(doc, ctx, def, currentAccessor);
				break;
			case "number_format":
				generateNumberFormatCheck(doc, def, currentAccessor);
				break;
			case "min_length": {
				const min = numericOperand(def.minimum, "min_length");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length >= ${min} && ${currentAccessor}.length < ${def.minimum * 2}`);
				doc.write(`if (${len} < ${min}) return INVALID;`);
				break;
			}
			case "max_length": {
				const max = numericOperand(def.maximum, "max_length");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length > ${max}`);
				doc.write(`if (${len} > ${max}) return INVALID;`);
				break;
			}
			case "length_equals": {
				const exact = numericOperand(def.length, "length_equals");
				const len = codePointLengthVar(doc, ctx, currentAccessor, `${currentAccessor}.length >= ${exact} && ${currentAccessor}.length <= ${def.length * 2}`);
				doc.write(`if (${len} !== ${exact}) return INVALID;`);
				break;
			}
			case "min_size":
				doc.write(`if (${currentAccessor}.size < ${numericOperand(def.minimum, "min_size")}) return INVALID;`);
				break;
			case "max_size":
				doc.write(`if (${currentAccessor}.size > ${numericOperand(def.maximum, "max_size")}) return INVALID;`);
				break;
			case "size_equals":
				doc.write(`if (${currentAccessor}.size !== ${numericOperand(def.size, "size_equals")}) return INVALID;`);
				break;
			case "string_format":
				currentAccessor = generateStringFormatCheck(doc, ctx, def, currentAccessor);
				break;
			case "custom":
				currentAccessor = generateCustomRefineCheck(doc, ctx, check, currentAccessor);
				break;
			case "bigint_format":
				generateBigIntFormatCheck(doc, def, currentAccessor);
				break;
			case "mime_type":
				generateMimeTypeCheck(doc, ctx, def, currentAccessor);
				break;
			case "property":
				generatePropertyCheck(doc, ctx, def, currentAccessor);
				break;
			case "properties":
				generatePropertiesChecks(doc, ctx, def, currentAccessor);
				break;
			case "overwrite": {
				const newAccessor = newVar(ctx);
				generateOverwriteCheck(doc, ctx, check, currentAccessor, newAccessor);
				currentAccessor = newAccessor;
				break;
			}
			default: throw new ZodCompileUnsupportedError(`check type ${def.check}`);
		}
	}
	return currentAccessor;
}
function codePointLengthVar(doc, ctx, accessor, inDoubt) {
	const cpLen = addConstant(ctx, codePointLength);
	const v = newVar(ctx);
	doc.write(`const ${v} = typeof ${accessor} === "string" && ${inDoubt} ? ${cpLen}(${accessor}) : ${accessor}.length;`);
	return v;
}
/**
* A count bound reaches generated source verbatim, so a non-number would be
* emitted as code rather than as a value — `min('0) {} evil(); if (0')` writes an
* arbitrary statement into the function body. TypeScript types these as `number`
* and fromJSONSchema guards them, so this is a backstop rather than a live hole,
* but generated source is the one place a wrong type stops being a type error.
*/
function numericOperand(value, label) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw new ZodCompileUnsupportedError(`${label} bound of type ${typeof value}`);
	return `${value}`;
}
function comparisonOperand(ctx, value) {
	if (typeof value === "bigint") return `${value}n`;
	if (typeof value === "number") {
		if (Number.isNaN(value)) throw new ZodCompileUnsupportedError("comparison check with NaN bound");
		return `${value}`;
	}
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) throw new ZodCompileUnsupportedError("comparison check with Invalid Date bound");
		return addConstant(ctx, value);
	}
	throw new ZodCompileUnsupportedError(`comparison check bound of type ${typeof value}`);
}
function generateGreaterThanCheck(doc, ctx, def, accessor) {
	const op = def.inclusive ? "<" : "<=";
	doc.write(`if (${accessor} ${op} ${comparisonOperand(ctx, def.value)}) return INVALID;`);
}
function generateLessThanCheck(doc, ctx, def, accessor) {
	const op = def.inclusive ? ">" : ">=";
	doc.write(`if (${accessor} ${op} ${comparisonOperand(ctx, def.value)}) return INVALID;`);
}
function generateMultipleOfCheck(doc, ctx, def, accessor) {
	if (typeof def.value === "bigint") {
		if (def.value === BigInt(0)) throw new ZodCompileUnsupportedError("multiple_of check with a zero divisor");
		doc.write(`if (${accessor} % ${def.value}n !== 0n) return INVALID;`);
	} else {
		const remainder = addConstant(ctx, floatSafeRemainder);
		doc.write(`if (${remainder}(${accessor}, ${numericOperand(def.value, "multiple_of")}) !== 0) return INVALID;`);
	}
}
function generateNumberFormatCheck(doc, def, accessor) {
	const format = def.format;
	switch (format) {
		case "safeint":
			doc.write(`if (!Number.isSafeInteger(${accessor})) return INVALID;`);
			break;
		case "int32":
			doc.write(`if (!Number.isInteger(${accessor}) || ${accessor} < -2147483648 || ${accessor} > 2147483647) return INVALID;`);
			break;
		case "uint32":
			doc.write(`if (!Number.isInteger(${accessor}) || ${accessor} < 0 || ${accessor} > 4294967295) return INVALID;`);
			break;
		case "float32":
			doc.write(`if (!Number.isFinite(${accessor}) || ${accessor} < -3.4028234663852886e38 || ${accessor} > 3.4028234663852886e38) return INVALID;`);
			break;
		case "float64":
			doc.write(`if (!Number.isFinite(${accessor})) return INVALID;`);
			break;
		default: throw new ZodCompileUnsupportedError(`number format ${format}`);
	}
}
function generateBigIntFormatCheck(doc, def, accessor) {
	const format = def.format;
	if (!format) return;
	switch (format) {
		case "int64":
			doc.write(`if (${accessor} < -9223372036854775808n || ${accessor} > 9223372036854775807n) return INVALID;`);
			break;
		case "uint64":
			doc.write(`if (${accessor} < 0n || ${accessor} > 18446744073709551615n) return INVALID;`);
			break;
		default: throw new ZodCompileUnsupportedError(`bigint format ${format}`);
	}
}
function generateMimeTypeCheck(doc, ctx, def, accessor) {
	const mimeTypes = def.mime;
	if (mimeTypes && mimeTypes.length > 0) {
		const mimeSet = addConstant(ctx, new Set(mimeTypes));
		doc.write(`if (!${mimeSet}.has(${accessor}.type)) return INVALID;`);
	}
}
function generatePropertiesChecks(doc, ctx, def, accessor) {
	if (def.when) throw new ZodCompileUnsupportedError(`check with a custom "when" condition`);
	doc.write(`if (${accessor} == null) return INVALID;`);
	const shape = def.shape;
	for (const key of Reflect.ownKeys(shape)) {
		const keyExpr = typeof key === "symbol" ? addConstant(ctx, key) : esc(key);
		const inputVar = newVar(ctx);
		doc.write(`const ${inputVar} = ${accessor}[${keyExpr}];`);
		compileChild(doc, ctx, shape[key], inputVar, false);
	}
}
function generatePropertyCheck(doc, ctx, def, accessor) {
	const propAccessor = `${accessor}[${JSON.stringify(def.property)}]`;
	generateCheck(doc, ctx, def.schema, propAccessor);
}
function generateOverwriteCheck(doc, ctx, check, currentAccessor, newAccessor) {
	const tx = check._zod.def.tx;
	if (!tx) throw new ZodCompileUnsupportedError("overwrite check without a transform function");
	if (isAsyncFunction(tx)) throw new ZodCompileAsyncError("z.compile: async overwrite transforms are not supported");
	const txConst = addConstant(ctx, tx);
	doc.write(`const ${newAccessor} = ${txConst}(${currentAccessor});`);
}
/** A predicate that hands back a thenable is an async check reached synchronously, and the interpreter throws `$ZodAsyncError` for it. Returning INVALID instead would be a bail-out, and a union reads a bail-out as a rejected branch and answers with a later one — so the throw has to survive into generated code. */
function throwAsync() {
	throw new $ZodAsyncError();
}
/** Shared `addIssue` for the spoofed payloads a refine, check or transform receives. Allocating one per call — a fresh closure plus a `this`-bound method on a fresh literal — pinned every payload-allocating schema at ~2.7M ops/sec against 135M for a plain object literal. It captures nothing per call; it only reaches `this.issues`. */
function pushIssue(issue) {
	this.issues.push(issue);
}
function generateCustomRefineCheck(doc, ctx, check, accessor) {
	const def = check._zod.def;
	if (def.fn) {
		if (isAsyncFunction(def.fn)) throw new ZodCompileAsyncError("z.compile: async .refine() predicates are not supported");
		const fnConst = addUserConstant(ctx, def.fn);
		const throwAsyncConst = addConstant(ctx, throwAsync);
		const resVar = newVar(ctx);
		doc.write(`const ${resVar} = ${fnConst}(${accessor});`);
		doc.write(`if (${resVar} instanceof Promise) ${throwAsyncConst}();`);
		doc.write(`if (!${resVar}) return INVALID;`);
		return accessor;
	}
	if (check._zod.check) {
		if (isAsyncFunction(check._zod.check)) throw new ZodCompileAsyncError("z.compile: async .superRefine() / check functions are not supported");
		const checkFn = check._zod.check;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			if (checkFn(fakePayload) instanceof Promise) throwAsync();
			return fakePayload.issues.length === 0 ? fakePayload.value : INVALID;
		};
		const helperConst = addUserConstant(ctx, helperFn);
		const outVar = newVar(ctx);
		doc.write(`const ${outVar} = ${helperConst}(${accessor});`);
		doc.write(`if (${outVar} === INVALID) return INVALID;`);
		return outVar;
	}
	throw new ZodCompileUnsupportedError("custom check without a predicate or check function");
}
/**
* Built-in formats that validate with nothing but `def.pattern`, so compiling
* the regex reproduces the runtime exactly. Deliberately an allowlist: a format
* missing from it loses its fast path, while a format wrongly added to it
* silently accepts input the runtime rejects. Formats that layer extra
* validation over a shape-only pattern (`credit_card`, `base64`, `ipv6`, …) are
* handled above by hoisting the runtime validator itself.
*/
const PATTERN_IS_COMPLETE = /* @__PURE__ */ new Set([
	"cidrv4",
	"cuid",
	"cuid2",
	"date",
	"datetime",
	"duration",
	"e164",
	"email",
	"emoji",
	"ends_with",
	"guid",
	"includes",
	"ipv4",
	"ksuid",
	"lowercase",
	"mac",
	"nanoid",
	"regex",
	"starts_with",
	"time",
	"ulid",
	"uppercase",
	"uuid",
	"xid"
]);
function generateStringFormatCheck(doc, ctx, def, accessor, needsValue = true) {
	const fmt = def.format;
	if (fmt === "base64") {
		const validator = addConstant(ctx, isValidBase64);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "base64url") {
		const validator = addConstant(ctx, isValidBase64URL);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "jwt") {
		const validator = addConstant(ctx, isValidJWT);
		const alg = addConstant(ctx, def.alg ?? null);
		doc.write(`if (!${validator}(${accessor}, ${alg})) return INVALID;`);
		return accessor;
	}
	if (fmt === "ipv6") {
		const validator = addConstant(ctx, isValidIPv6);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "cidrv6") {
		const validator = addConstant(ctx, isValidCIDRv6);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "credit_card") {
		const validator = addConstant(ctx, isValidCreditCard);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (fmt === "iban") {
		const validator = addConstant(ctx, isValidIBAN);
		doc.write(`if (!${validator}(${accessor})) return INVALID;`);
		return accessor;
	}
	const formatDef = def;
	if (fmt === "url" || fmt === "httpurl" || formatDef.normalize || formatDef.hostname !== void 0 || formatDef.protocol !== void 0) {
		const parseConst = addConstant(ctx, validateURL);
		const defConst = addConstant(ctx, def);
		const trimVar = newVar(ctx);
		const urlVar = newVar(ctx);
		doc.write(`const ${trimVar} = ${accessor}.trim();`);
		doc.write(`const ${urlVar} = ${parseConst}(${trimVar}, ${defConst});`);
		doc.write(`if (typeof ${urlVar} === "number") return INVALID;`);
		if (formatDef.hostname !== void 0) {
			const hostnameConst = addConstant(ctx, urlHostnameOk);
			doc.write(`if (!${hostnameConst}(${urlVar}, ${defConst}.hostname)) return INVALID;`);
		}
		if (formatDef.protocol !== void 0) {
			const protocolConst = addConstant(ctx, urlProtocolOk);
			doc.write(`if (!${protocolConst}(${urlVar}, ${defConst}.protocol)) return INVALID;`);
		}
		if (!needsValue) return null;
		const outputVar = newVar(ctx);
		const outputExpr = formatDef.normalize ? `${urlVar}.href` : `${addConstant(ctx, stripTabAndNewline)}(${trimVar})`;
		doc.write(`const ${outputVar} = ${outputExpr};`);
		return outputVar;
	}
	const customFn = def.fn;
	if (customFn) {
		if (isAsyncFunction(customFn)) throw new ZodCompileUnsupportedError(`async string format ${fmt}`);
		const fnConst = addConstant(ctx, customFn);
		doc.write(`if (!${fnConst}(${accessor})) return INVALID;`);
		return accessor;
	}
	if (PATTERN_IS_COMPLETE.has(fmt) && def.pattern) {
		const patternConst = addConstant(ctx, def.pattern);
		doc.write(`${patternConst}.lastIndex = 0;`);
		doc.write(`if (!${patternConst}.test(${accessor})) return INVALID;`);
		return accessor;
	}
	const format = def.format;
	switch (format) {
		case "regex": throw new ZodCompileUnsupportedError("regex format without a pattern");
		case "lowercase":
			doc.write(`if (${accessor} !== ${accessor}.toLowerCase()) return INVALID;`);
			break;
		case "uppercase":
			doc.write(`if (${accessor} !== ${accessor}.toUpperCase()) return INVALID;`);
			break;
		case "includes":
			doc.write(`if (!${accessor}.includes(${esc(def.includes)})) return INVALID;`);
			break;
		case "starts_with": {
			const prefix = def.prefix;
			doc.write(`if (${accessor}.slice(0, ${prefix.length}) !== ${esc(prefix)}) return INVALID;`);
			break;
		}
		case "ends_with": {
			const suffix = def.suffix;
			doc.write(`if (${accessor}.slice(-${suffix.length}) !== ${esc(suffix)}) return INVALID;`);
			break;
		}
		default: throw new ZodCompileUnsupportedError(`string format ${format}`);
	}
	return accessor;
}
function generateCheck(doc, ctx, schema, accessor, needsValue = true) {
	const def = schema._zod.def;
	const type = def.type;
	if (def.coerce) throw new ZodCompileUnsupportedError(`coercion (z.coerce.${type}())`);
	const buildsValue = needsValue || !!def.checks?.length;
	let typeAccessor;
	switch (type) {
		case "string":
			typeAccessor = generateStringCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "number":
			typeAccessor = generateNumberCheck(doc, schema, accessor);
			break;
		case "boolean":
			typeAccessor = generateBooleanCheck(doc, accessor);
			break;
		case "bigint":
			typeAccessor = generateBigIntCheck(doc, schema, accessor);
			break;
		case "symbol":
			typeAccessor = generateSymbolCheck(doc, accessor);
			break;
		case "undefined":
			typeAccessor = generateUndefinedCheck(doc, accessor);
			break;
		case "null":
			typeAccessor = generateNullCheck(doc, accessor);
			break;
		case "any":
		case "unknown":
			typeAccessor = accessor;
			break;
		case "never":
			doc.write("return INVALID;");
			typeAccessor = accessor;
			break;
		case "void":
			typeAccessor = generateVoidCheck(doc, accessor);
			break;
		case "nan":
			typeAccessor = generateNaNCheck(doc, accessor);
			break;
		case "date":
			typeAccessor = generateDateCheck(doc, accessor);
			break;
		case "object":
			typeAccessor = generateObjectCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "optional":
			typeAccessor = generateOptionalCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "nullable":
			typeAccessor = generateNullableCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "array":
			typeAccessor = generateArrayCheck(doc, ctx, schema, accessor, buildsValue);
			break;
		case "literal":
			typeAccessor = generateLiteralCheck(doc, ctx, schema, accessor);
			break;
		case "enum":
			typeAccessor = generateEnumCheck(doc, ctx, schema, accessor);
			break;
		case "readonly": {
			const innerOut = generateWrapperCheck(doc, ctx, schema, accessor);
			const frozenVar = newVar(ctx);
			doc.write(`const ${frozenVar} = Object.freeze(${innerOut});`);
			typeAccessor = frozenVar;
			break;
		}
		case "success":
			generateWrapperCheck(doc, ctx, schema, accessor);
			typeAccessor = "true";
			break;
		case "default":
		case "prefault":
			typeAccessor = generateDefaultCheck(doc, ctx, schema, accessor);
			break;
		case "nonoptional":
			typeAccessor = generateNonOptionalCheck(doc, ctx, schema, accessor);
			break;
		case "tuple":
			typeAccessor = generateTupleCheck(doc, ctx, schema, accessor);
			break;
		case "union":
			typeAccessor = generateUnionCheck(doc, ctx, schema, accessor);
			break;
		case "intersection":
			typeAccessor = generateIntersectionCheck(doc, ctx, schema, accessor);
			break;
		case "record":
			typeAccessor = generateRecordCheck(doc, ctx, schema, accessor);
			break;
		case "map":
			typeAccessor = generateMapCheck(doc, ctx, schema, accessor);
			break;
		case "set":
			typeAccessor = generateSetCheck(doc, ctx, schema, accessor);
			break;
		case "file":
			typeAccessor = generateFileCheck(doc, accessor);
			break;
		case "template_literal":
			typeAccessor = generateTemplateLiteralCheck(doc, ctx, schema, accessor);
			break;
		case "lazy":
			typeAccessor = generateLazyCheck(doc, ctx, schema, accessor);
			break;
		case "pipe":
			typeAccessor = generatePipeCheck(doc, ctx, schema, accessor);
			break;
		case "custom":
			typeAccessor = generateCustomCheck(doc, ctx, schema, accessor);
			break;
		case "transform":
			typeAccessor = generateTransformCheck(doc, ctx, schema, accessor);
			break;
		case "catch":
			typeAccessor = generateCatchCheck(doc, ctx, schema, accessor);
			break;
		default: throw new ZodCompileUnsupportedError(`schema type ${type}`);
	}
	if (typeAccessor === null) return null;
	return generateChecks(doc, ctx, schema, typeAccessor);
}
function generateStringCheck(doc, ctx, schema, accessor, needsValue = true) {
	doc.write(`if (typeof ${accessor} !== "string") return INVALID;`);
	const def = schema._zod.def;
	if (def.format === void 0) return accessor;
	return generateStringFormatCheck(doc, ctx, def, accessor, needsValue);
}
function generateNumberCheck(doc, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "number" || !Number.isFinite(${accessor})) return INVALID;`);
	const def = schema._zod.def;
	if (def.check === "number_format" && def.format) generateNumberFormatCheck(doc, { format: def.format }, accessor);
	return accessor;
}
function generateBooleanCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "boolean") return INVALID;`);
	return accessor;
}
function generateBigIntCheck(doc, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "bigint") return INVALID;`);
	const def = schema._zod.def;
	if (def.format) switch (def.format) {
		case "int64":
			doc.write(`if (${accessor} < -9223372036854775808n || ${accessor} > 9223372036854775807n) return INVALID;`);
			break;
		case "uint64": doc.write(`if (${accessor} < 0n || ${accessor} > 18446744073709551615n) return INVALID;`);
	}
	return accessor;
}
function generateSymbolCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "symbol") return INVALID;`);
	return accessor;
}
function generateUndefinedCheck(doc, accessor) {
	doc.write(`if (${accessor} !== undefined) return INVALID;`);
	return accessor;
}
function generateNullCheck(doc, accessor) {
	doc.write(`if (${accessor} !== null) return INVALID;`);
	return accessor;
}
function generateVoidCheck(doc, accessor) {
	doc.write(`if (${accessor} !== undefined) return INVALID;`);
	return accessor;
}
function generateNaNCheck(doc, accessor) {
	doc.write(`if (typeof ${accessor} !== "number" || !Number.isNaN(${accessor})) return INVALID;`);
	return accessor;
}
function generateDateCheck(doc, accessor) {
	doc.write(`if (!(${accessor} instanceof Date) || Number.isNaN(${accessor}.getTime())) return INVALID;`);
	return accessor;
}
function generateObjectCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	doc.write(`if (typeof ${accessor} !== "object" || ${accessor} === null || Array.isArray(${accessor})) return INVALID;`);
	const shape = def.shape;
	const keys = Object.keys(shape);
	const symbolKeys = Object.getOwnPropertySymbols(shape);
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	const keyExpr = (k) => typeof k === "symbol" ? addConstant(ctx, k) : esc(k);
	const propKey = (k) => typeof k === "symbol" ? `[${keyExpr(k)}]` : esc(k);
	const propShape = shape;
	if (keys.includes("__proto__")) throw new ZodCompileUnsupportedError("object shape key \"__proto__\"");
	const propOutputs = /* @__PURE__ */ new Map();
	for (const key of allKeys) {
		const propSchema = propShape[key];
		const kx = keyExpr(key);
		const inputVar = newVar(ctx);
		doc.write(`const ${inputVar} = ${accessor}[${kx}];`);
		if (propSchema._zod.optin !== void 0) {
			const outputVar = newVar(ctx);
			doc.write(`let ${outputVar} = (() => {`);
			doc.indented((d) => {
				const outputAccessor = compileChild(d, ctx, propSchema, inputVar);
				d.write(`return ${outputAccessor};`);
			});
			doc.write(`})();`);
			if (propSchema._zod.optout === "optional") {
				doc.write(`if (${outputVar} === INVALID) {`);
				doc.indented((d) => {
					d.write(`if (${kx} in ${accessor}) return INVALID;`);
					d.write(`${outputVar} = undefined;`);
				});
				doc.write(`}`);
			} else doc.write(`if (${outputVar} === INVALID) return INVALID;`);
			propOutputs.set(key, outputVar);
		} else {
			if (requiresPresenceCheck(propSchema)) doc.write(`if (!(${kx} in ${accessor})) return INVALID;`);
			const outputAccessor = compileChild(doc, ctx, propSchema, inputVar, buildsValue);
			if (outputAccessor !== null) propOutputs.set(key, outputAccessor);
		}
	}
	const catchall = def.catchall;
	let unknownKeysMode = "none";
	if (catchall) {
		const catchallType = catchall._zod.def.type;
		if (catchallType === "never") {
			const condition = keys.map((k) => `k !== ${esc(k)}`).join(" && ") || "true";
			doc.write(`for (const k in ${accessor}) {`);
			doc.indented((d) => {
				d.write(`if (${condition}) return INVALID;`);
			});
			doc.write(`}`);
		} else if ((catchallType === "unknown" || catchallType === "any") && !catchall._zod.def.checks?.length) unknownKeysMode = "passthrough";
		else unknownKeysMode = "schema";
	}
	const outputVar = newVar(ctx);
	const hasConditionalKeys = allKeys.some((k) => mayOmitUndefined(propShape[k]) || dropsWhenAbsent(propShape[k]));
	if (!buildsValue) {
		if (unknownKeysMode === "schema") {
			const knownSet = keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
			doc.write(`for (const k in ${accessor}) {`);
			doc.indented((d) => {
				d.write(`if (k === "__proto__") continue;`);
				if (knownSet) d.write(`if (${knownSet}.has(k)) continue;`);
				const valVar = newVar(ctx);
				d.write(`const ${valVar} = ${accessor}[k];`);
				compileChild(d, ctx, catchall, valVar, false);
			});
			doc.write(`}`);
		}
		return null;
	}
	if (!hasConditionalKeys) {
		const propLiterals = allKeys.map((k) => `${propKey(k)}: ${propOutputs.get(k)}`).join(", ");
		doc.write(`const ${outputVar} = { ${propLiterals} };`);
	} else {
		doc.write(`const ${outputVar} = {};`);
		for (const k of allKeys) {
			const kx = keyExpr(k);
			const out = propOutputs.get(k);
			if (dropsWhenAbsent(propShape[k])) doc.write(`if (${kx} in ${accessor}) ${outputVar}[${kx}] = ${out};`);
			else if (mayOmitUndefined(propShape[k])) doc.write(`if (${out} !== undefined || ${kx} in ${accessor}) ${outputVar}[${kx}] = ${out};`);
			else doc.write(`${outputVar}[${kx}] = ${out};`);
		}
	}
	if (unknownKeysMode !== "none") {
		const knownSet = keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
		doc.write(`for (const k in ${accessor}) {`);
		doc.indented((d) => {
			d.write(`if (k === "__proto__") continue;`);
			if (knownSet) d.write(`if (${knownSet}.has(k)) continue;`);
			if (unknownKeysMode === "passthrough") d.write(`${outputVar}[k] = ${accessor}[k];`);
			else {
				const valVar = newVar(ctx);
				d.write(`const ${valVar} = ${accessor}[k];`);
				const catchallOut = compileChild(d, ctx, catchall, valVar);
				d.write(`${outputVar}[k] = ${catchallOut};`);
			}
		});
		doc.write(`}`);
	}
	return outputVar;
}
function generateOptionalCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	if (isExactOptional(schema)) return generateCheck(doc, ctx, def.innerType, accessor, buildsValue);
	if (def.innerType._zod.optin === "defaulted") {
		const outputVar = newVar(ctx);
		const branchVar = newVar(ctx);
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} === undefined) {`);
		doc.indented((d) => {
			d.write(`const ${branchVar} = (() => {`);
			d.indented((d2) => {
				const innerOutput = generateCheck(d2, ctx, def.innerType, accessor);
				d2.write(`return ${innerOutput};`);
			});
			d.write(`})();`);
			d.write(`if (${branchVar} !== INVALID) ${outputVar} = ${branchVar};`);
		});
		doc.write(`} else {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput};`);
		});
		doc.write(`}`);
		return outputVar;
	}
	const outputVar = buildsValue ? newVar(ctx) : null;
	if (outputVar) doc.write(`let ${outputVar};`);
	doc.write(`if (${accessor} !== undefined) {`);
	doc.indented((d) => {
		const innerOutput = generateCheck(d, ctx, def.innerType, accessor, buildsValue);
		if (outputVar && innerOutput !== null) d.write(`${outputVar} = ${innerOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function isExactOptional(schema) {
	return schema._zod.traits?.has("$ZodExactOptional") === true;
}
function requiresPresenceCheck(schema) {
	return schema._zod.optin === void 0 && fastPathAcceptsAbsence(schema);
}
function fastPathAcceptsAbsence(schema) {
	if (schema._zod.def.coerce) return true;
	const def = schema._zod.def;
	switch (def.type) {
		case "any":
		case "unknown":
		case "undefined":
		case "void":
		case "default":
		case "prefault":
		case "transform":
		case "custom":
		case "lazy": return true;
		case "string":
		case "number":
		case "boolean":
		case "bigint":
		case "symbol":
		case "null":
		case "never":
		case "nan":
		case "date":
		case "object":
		case "array":
		case "tuple":
		case "record":
		case "map":
		case "set":
		case "file":
		case "template_literal": return false;
		case "nonoptional": return def.innerType ? fastPathAcceptsAbsence(def.innerType) : false;
		case "literal": return !!def.values?.includes(void 0);
		case "enum": return !!schema._zod.values?.has(void 0);
		case "optional":
		case "nullable":
		case "readonly":
		case "success": return def.innerType ? fastPathAcceptsAbsence(def.innerType) : true;
		case "catch": return true;
		case "union": return def.options ? def.options.some(fastPathAcceptsAbsence) : true;
		case "intersection":
			if (!def.left || !def.right) return true;
			return fastPathAcceptsAbsence(def.left) && fastPathAcceptsAbsence(def.right);
		case "pipe": return def.in ? fastPathAcceptsAbsence(def.in) : true;
		default: return true;
	}
}
/** The middle rung permits absence without supplying anything in its place, so an absent key contributes nothing — mirrors the leading gate in `handlePropertyResult`. */
function dropsWhenAbsent(schema) {
	return schema._zod.optin === "optional" && schema._zod.optout === "optional";
}
function mayOmitUndefined(schema) {
	return (schema._zod.optin !== "defaulted" || schema._zod.optout === "optional") && mayOutputUndefined(schema);
}
function mayOutputUndefined(schema) {
	const def = schema._zod.def;
	switch (def.type) {
		case "string":
		case "number":
		case "boolean":
		case "bigint":
		case "symbol":
		case "null":
		case "nan":
		case "date":
		case "object":
		case "array":
		case "tuple":
		case "record":
		case "map":
		case "set":
		case "file":
		case "template_literal":
		case "never":
		case "success": return false;
		case "literal": return !!def.values?.includes(void 0);
		case "enum": return !!schema._zod.values?.has(void 0);
		case "optional": return true;
		case "nullable":
		case "readonly":
		case "nonoptional": return def.innerType ? mayOutputUndefined(def.innerType) : true;
		case "union": return def.options ? def.options.some(mayOutputUndefined) : true;
		case "intersection": return !def.left || !def.right || mayOutputUndefined(def.left) || mayOutputUndefined(def.right);
		case "pipe": return def.out ? mayOutputUndefined(def.out) : true;
		default: return true;
	}
}
function generateNullableCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	const outputVar = buildsValue ? newVar(ctx) : null;
	if (outputVar) doc.write(`let ${outputVar} = null;`);
	doc.write(`if (${accessor} !== null) {`);
	doc.indented((d) => {
		const innerOutput = generateCheck(d, ctx, def.innerType, accessor, buildsValue);
		if (outputVar && innerOutput !== null) d.write(`${outputVar} = ${innerOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateArrayCheck(doc, ctx, schema, accessor, buildsValue = true) {
	const def = schema._zod.def;
	doc.write(`if (!Array.isArray(${accessor})) return INVALID;`);
	const outputVar = buildsValue ? newVar(ctx) : null;
	const iVar = newVar(ctx);
	const elemVar = newVar(ctx);
	if (outputVar) doc.write(`const ${outputVar} = new Array(${accessor}.length);`);
	doc.write(`for (let ${iVar} = 0; ${iVar} < ${accessor}.length; ${iVar}++) {`);
	doc.indented((d) => {
		d.write(`const ${elemVar} = ${accessor}[${iVar}];`);
		const elemOutput = compileChild(d, ctx, def.element, elemVar, buildsValue);
		if (outputVar && elemOutput !== null) d.write(`${outputVar}[${iVar}] = ${elemOutput};`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateLiteralCheck(doc, ctx, schema, accessor) {
	const values = schema._zod.def.values;
	if (values.length !== 1) {
		const literalSet = addConstant(ctx, new Set(values));
		doc.write(`if (!${literalSet}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	const value = values[0];
	if (typeof value === "number" && Number.isNaN(value)) {
		const literalSet = addConstant(ctx, new Set(values));
		doc.write(`if (!${literalSet}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	if (typeof value === "string") doc.write(`if (${accessor} !== ${esc(value)}) return INVALID;`);
	else if (typeof value === "number" || typeof value === "boolean") doc.write(`if (${accessor} !== ${value}) return INVALID;`);
	else if (value === null) doc.write(`if (${accessor} !== null) return INVALID;`);
	else if (value === void 0) doc.write(`if (${accessor} !== undefined) return INVALID;`);
	else if (typeof value === "bigint") doc.write(`if (${accessor} !== ${value}n) return INVALID;`);
	else throw new ZodCompileUnsupportedError(`literal type ${typeof value}`);
	return accessor;
}
function generateEnumCheck(doc, ctx, schema, accessor) {
	const values = schema._zod.values;
	if (!values) throw new ZodCompileUnsupportedError("enum schema without enumerated values");
	const enumSet = addConstant(ctx, values);
	doc.write(`if (!${enumSet}.has(${accessor})) return INVALID;`);
	return accessor;
}
function generateWrapperCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	return generateCheck(doc, ctx, def.innerType, accessor);
}
function generateDefaultCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const defaultGetter = Object.getOwnPropertyDescriptor(schema._zod.def, "defaultValue") ? () => schema._zod.def.defaultValue : void 0;
	if (schema._zod.def.type === "prefault") {
		if (!defaultGetter) return generateCheck(doc, ctx, def.innerType, accessor);
		const defaultFn = addConstant(ctx, defaultGetter);
		const inputVar = newVar(ctx);
		doc.write(`let ${inputVar} = ${accessor};`);
		doc.write(`if (${accessor} === undefined) ${inputVar} = ${defaultFn}();`);
		return generateCheck(doc, ctx, def.innerType, inputVar);
	}
	const outputVar = newVar(ctx);
	if (defaultGetter) {
		const defaultFn = addConstant(ctx, defaultGetter);
		const cloneFn = addConstant(ctx, shallowClone);
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} === undefined) {`);
		doc.indented((d) => {
			d.write(`${outputVar} = ${cloneFn}(${defaultFn}());`);
		});
		doc.write(`} else {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput} === undefined ? ${cloneFn}(${defaultFn}()) : ${innerOutput};`);
		});
		doc.write(`}`);
	} else {
		doc.write(`let ${outputVar};`);
		doc.write(`if (${accessor} !== undefined) {`);
		doc.indented((d) => {
			const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
			d.write(`${outputVar} = ${innerOutput};`);
		});
		doc.write(`}`);
	}
	return outputVar;
}
function generateNonOptionalCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const innerOutput = generateCheck(doc, ctx, def.innerType, accessor);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = ${innerOutput};`);
	doc.write(`if (${outputVar} === undefined) return INVALID;`);
	return outputVar;
}
function generateTupleCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const items = def.items;
	const rest = def.rest;
	doc.write(`if (!Array.isArray(${accessor})) return INVALID;`);
	const optinStart = getTupleOptStart(items, "optin");
	const optoutStart = getTupleOptStart(items, "optout");
	if (rest) doc.write(`if (${accessor}.length < ${optinStart}) return INVALID;`);
	else doc.write(`if (${accessor}.length < ${optinStart} || ${accessor}.length > ${items.length}) return INVALID;`);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = [];`);
	for (let i = 0; i < items.length; i++) {
		const itemSchema = items[i];
		if (i >= optoutStart) {
			doc.write(`if (${outputVar}.length === ${i}) {`);
			doc.indented((d) => {
				d.write(`if (${i} < ${accessor}.length) {`);
				d.indented((d2) => {
					const elemVar = newVar(ctx);
					d2.write(`const ${elemVar} = ${accessor}[${i}];`);
					const elemOutput = compileChild(d2, ctx, itemSchema, elemVar);
					d2.write(`${outputVar}[${i}] = ${elemOutput};`);
				});
				d.write(`} else {`);
				d.indented((d2) => {
					if (dropsWhenAbsent(itemSchema)) {
						d2.write(`${outputVar}.length = ${i};`);
						return;
					}
					const elemVar = newVar(ctx);
					const branchVar = newVar(ctx);
					d2.write(`const ${elemVar} = undefined;`);
					d2.write(`const ${branchVar} = (() => {`);
					d2.indented((d3) => {
						const elemOutput = compileChild(d3, ctx, itemSchema, elemVar);
						d3.write(`return ${elemOutput};`);
					});
					d2.write(`})();`);
					d2.write(`if (${branchVar} === INVALID || ${branchVar} === undefined) ${outputVar}.length = ${i};`);
					d2.write(`else ${outputVar}[${i}] = ${branchVar};`);
				});
				d.write(`}`);
			});
			doc.write(`}`);
		} else {
			const elemVar = newVar(ctx);
			doc.write(`const ${elemVar} = ${accessor}[${i}];`);
			const elemOutput = compileChild(doc, ctx, itemSchema, elemVar);
			doc.write(`${outputVar}[${i}] = ${elemOutput};`);
		}
	}
	if (rest) {
		const iVar = newVar(ctx);
		const elemVar = newVar(ctx);
		doc.write(`for (let ${iVar} = ${items.length}; ${iVar} < ${accessor}.length; ${iVar}++) {`);
		doc.indented((d) => {
			d.write(`const ${elemVar} = ${accessor}[${iVar}];`);
			const elemOutput = compileChild(d, ctx, rest, elemVar);
			d.write(`${outputVar}[${iVar}] = ${elemOutput};`);
		});
		doc.write(`}`);
	}
	return outputVar;
}
function getTupleOptStart(items, key) {
	for (let i = items.length - 1; i >= 0; i--) if (!(key === "optin" ? items[i]._zod.optin !== void 0 : items[i]._zod.optout === "optional")) return i + 1;
	return 0;
}
function generateUnionCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const options = def.options;
	if (def.discriminator) return generateDiscriminatedUnionCheck(doc, ctx, def, accessor);
	if (def.inclusive === false) throw new ZodCompileUnsupportedError("exclusive unions (z.xor)");
	if (options.length === 0) {
		doc.write("return INVALID;");
		return accessor;
	}
	if (options.length === 1) return generateCheck(doc, ctx, options[0], accessor);
	if (options.every((opt) => opt._zod.def.type === "literal" && !opt._zod.def.checks?.length)) {
		const valuesConst = addConstant(ctx, new Set(options.flatMap((opt) => opt._zod.def.values)));
		doc.write(`if (!${valuesConst}.has(${accessor})) return INVALID;`);
		return accessor;
	}
	const outputVar = newVar(ctx);
	doc.write(`let ${outputVar};`);
	for (let i = 0; i < options.length; i++) {
		const opt = options[i];
		if (i === 0) doc.write(`${outputVar} = (() => {`);
		else doc.write(`if (${outputVar} === INVALID) ${outputVar} = (() => {`);
		doc.indented((d) => {
			const branchOutput = generateCheck(d, ctx, opt, accessor);
			d.write(`return ${branchOutput};`);
		});
		doc.write(`})();`);
	}
	doc.write(`if (${outputVar} === INVALID) return INVALID;`);
	return outputVar;
}
function generateDiscriminatedUnionCheck(doc, ctx, def, accessor) {
	if (def.unionFallback) throw new ZodCompileUnsupportedError("discriminated union with unionFallback");
	if (def.options.length === 0) {
		doc.write("return INVALID;");
		return accessor;
	}
	const discVar = newVar(ctx);
	const outputVar = newVar(ctx);
	doc.write(`const ${discVar} = ${accessor}?.[${esc(def.discriminator)}];`);
	doc.write(`let ${outputVar};`);
	let firstBranch = true;
	const claimed = /* @__PURE__ */ new Set();
	for (const option of def.options) {
		const values = option._zod.propValues?.[def.discriminator];
		if (!values || values.size === 0) throw new ZodCompileUnsupportedError("discriminated union option without static discriminator values");
		for (const value of values) {
			if (claimed.has(value)) throw new ZodCompileUnsupportedError(`duplicate discriminator value ${String(value)}`);
			claimed.add(value);
		}
		const conditions = Array.from(values, (value) => literalEquality(ctx, discVar, value));
		const prefix = firstBranch ? "if" : "else if";
		doc.write(`${prefix} (${conditions.join(" || ")}) {`);
		doc.indented((d) => {
			const branchOutput = generateCheck(d, ctx, option, accessor);
			d.write(`${outputVar} = ${branchOutput};`);
		});
		doc.write(`}`);
		firstBranch = false;
	}
	doc.write(`else { return INVALID; }`);
	return outputVar;
}
function literalEquality(ctx, accessor, value) {
	if (typeof value === "string") return `${accessor} === ${esc(value)}`;
	if (typeof value === "number") {
		if (Number.isNaN(value)) return `Number.isNaN(${accessor})`;
		return `${accessor} === ${value}`;
	}
	if (typeof value === "boolean") return `${accessor} === ${value}`;
	if (value === null) return `${accessor} === null`;
	if (value === void 0) return `${accessor} === undefined`;
	if (typeof value === "bigint") return `${accessor} === ${value}n`;
	if (typeof value === "symbol") return `${accessor} === ${addConstant(ctx, value)}`;
	throw new ZodCompileUnsupportedError(`literal discriminator value ${String(value)}`);
}
function generateIntersectionCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	ctx.definite = false;
	const leftOutput = compileChild(doc, ctx, def.left, accessor);
	const rightOutput = compileChild(doc, ctx, def.right, accessor);
	const mergeConst = addConstant(ctx, mergeValues);
	const mergedVar = newVar(ctx);
	doc.write(`const ${mergedVar} = ${mergeConst}(${leftOutput}, ${rightOutput});`);
	doc.write(`if (!${mergedVar}.valid) return INVALID;`);
	return `${mergedVar}.data`;
}
function generateRecordCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const isPlainObjectConst = addConstant(ctx, isPlainObject);
	doc.write(`if (!${isPlainObjectConst}(${accessor})) return INVALID;`);
	const outputVar = newVar(ctx);
	const kVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = {};`);
	const recordDef = def;
	const keyValues = recordDef.partial ? void 0 : def.keyType._zod.values;
	if (keyValues) {
		const inputKeys = [];
		for (const key of keyValues) {
			if (!(typeof key === "string" || typeof key === "number" || typeof key === "symbol")) throw new ZodCompileUnsupportedError(`record key value ${String(key)}`);
			const inputKey = typeof key === "number" ? key.toString() : key;
			if (inputKey === "__proto__") throw new ZodCompileUnsupportedError("record key \"__proto__\"");
			inputKeys.push(inputKey);
			const keyConst = addConstant(ctx, key);
			const outKey = generateCheck(doc, ctx, def.keyType, keyConst);
			const valueVar = newVar(ctx);
			doc.write(`const ${valueVar} = ${accessor}[${literalPropertyKey(ctx, inputKey)}];`);
			const valOutput = compileChild(doc, ctx, def.valueType, valueVar);
			doc.write(`${outputVar}[${outKey}] = ${valOutput};`);
		}
		const knownKeysConst = addConstant(ctx, new Set(inputKeys));
		doc.write(`for (const ${kVar} in ${accessor}) {`);
		doc.indented((d) => {
			d.write(`if (${knownKeysConst}.has(${kVar})) continue;`);
			if (recordDef.mode === "loose") d.write(`if (${kVar} !== "__proto__") ${outputVar}[${kVar}] = ${accessor}[${kVar}];`);
			else d.write(`return INVALID;`);
		});
		doc.write(`}`);
		return outputVar;
	}
	const keyDef = def.keyType._zod.def;
	if (!(keyDef.type === "string" && keyDef.format === void 0 && !keyDef.coerce && (keyDef.checks?.length ?? 0) === 0)) {
		const isLoose = def.mode === "loose";
		const keyFn = compileFn(def.keyType);
		if (keyFn.definite === false) ctx.definite = false;
		const keyFast = addConstant(ctx, keyFn);
		const numericConst = addConstant(ctx, number);
		const outKeyVar = newVar(ctx);
		emitOwnKeys(doc, ctx, accessor, kVar, (d) => {
			d.write(`let ${outKeyVar} = ${keyFast}(${kVar});`);
			d.write(`if (${outKeyVar} === INVALID && typeof ${kVar} === "string" && ${numericConst}.test(${kVar})) ${outKeyVar} = ${keyFast}(Number(${kVar}));`);
			if (isLoose) d.write(`if (${outKeyVar} === INVALID) { ${outputVar}[${kVar}] = ${accessor}[${kVar}]; continue; }`);
			else d.write(`if (${outKeyVar} === INVALID) return INVALID;`);
			d.write(`if (${outKeyVar} === "__proto__") continue;`);
			const valueVar = newVar(ctx);
			d.write(`const ${valueVar} = ${accessor}[${kVar}];`);
			const valOutput = compileChild(d, ctx, def.valueType, valueVar);
			d.write(`${outputVar}[${outKeyVar}] = ${valOutput};`);
		});
		return outputVar;
	}
	emitOwnKeys(doc, ctx, accessor, kVar, (d) => {
		d.write(`const ${valVar} = ${accessor}[${kVar}];`);
		const valOutput = compileChild(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}[${kVar}] = ${valOutput};`);
	}, `return INVALID;`);
	return outputVar;
}
function emitOwnKeys(doc, ctx, accessor, kVar, body, onSymbol) {
	const propIsEnumerableConst = addConstant(ctx, Object.prototype.propertyIsEnumerable);
	const symsVar = newVar(ctx);
	const keysVar = newVar(ctx);
	const iVar = newVar(ctx);
	doc.write(`const ${symsVar} = Object.getOwnPropertySymbols(${accessor});`);
	doc.write(`const ${keysVar} = Object.getOwnPropertyNames(${accessor});`);
	doc.write(`for (let ${iVar} = 0; ${iVar} < ${keysVar}.length; ${iVar}++) {`);
	doc.indented((d) => {
		d.write(`const ${kVar} = ${keysVar}[${iVar}];`);
		d.write(`if (${kVar} === "__proto__" || !${propIsEnumerableConst}.call(${accessor}, ${kVar})) continue;`);
		body(d);
	});
	doc.write(`}`);
	doc.write(`for (let ${iVar} = 0; ${iVar} < ${symsVar}.length; ${iVar}++) {`);
	doc.indented((d) => {
		d.write(`const ${kVar} = ${symsVar}[${iVar}];`);
		d.write(`if (!${propIsEnumerableConst}.call(${accessor}, ${kVar})) continue;`);
		if (onSymbol) d.write(onSymbol);
		else body(d);
	});
	doc.write(`}`);
}
function literalPropertyKey(ctx, key) {
	if (typeof key === "string") return esc(key);
	return addConstant(ctx, key);
}
function generateMapCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	doc.write(`if (!(${accessor} instanceof Map)) return INVALID;`);
	const outputVar = newVar(ctx);
	const kVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = new Map();`);
	doc.write(`for (const [${kVar}, ${valVar}] of ${accessor}) {`);
	doc.indented((d) => {
		const keyOutput = generateCheck(d, ctx, def.keyType, kVar);
		const valOutput = generateCheck(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}.set(${keyOutput}, ${valOutput});`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateSetCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	doc.write(`if (!(${accessor} instanceof Set)) return INVALID;`);
	const outputVar = newVar(ctx);
	const valVar = newVar(ctx);
	doc.write(`const ${outputVar} = new Set();`);
	doc.write(`for (const ${valVar} of ${accessor}) {`);
	doc.indented((d) => {
		const valOutput = generateCheck(d, ctx, def.valueType, valVar);
		d.write(`${outputVar}.add(${valOutput});`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateFileCheck(doc, accessor) {
	doc.write(`if (!(${accessor} instanceof File)) return INVALID;`);
	return accessor;
}
function generateTemplateLiteralCheck(doc, ctx, schema, accessor) {
	doc.write(`if (typeof ${accessor} !== "string") return INVALID;`);
	const pattern = schema._zod.pattern;
	if (pattern) {
		const patternConst = addConstant(ctx, pattern);
		doc.write(`${patternConst}.lastIndex = 0;`);
		doc.write(`if (!${patternConst}.test(${accessor})) return INVALID;`);
	}
	return accessor;
}
function generateLazyCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const getterConst = addUserConstant(ctx, def.getter);
	const cacheConst = addConstant(ctx, { parser: null });
	doc.write(`if (!${cacheConst}.parser) {`);
	doc.indented((d) => {
		d.write(`const inner = ${getterConst}();`);
		d.write(`${cacheConst}.parser = function(input) {`);
		d.indented((d2) => {
			d2.write(`const result = inner._zod.run({ value: input, issues: [] }, {});`);
			d2.write(`return result.issues.length === 0 ? result.value : INVALID;`);
		});
		d.write(`};`);
	});
	doc.write(`}`);
	const outputVar = newVar(ctx);
	doc.write(`const ${outputVar} = ${cacheConst}.parser(${accessor});`);
	doc.write(`if (${outputVar} === INVALID) return INVALID;`);
	return outputVar;
}
function generatePipeCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	const inputOutput = generateCheck(doc, ctx, def.in, accessor);
	if (def.transform) {
		if (isAsyncFunction(def.transform)) throw new ZodCompileAsyncError("z.compile: async transforms in pipes are not supported");
		const transformFn = def.transform;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			const result = transformFn(value, fakePayload);
			if (result instanceof Promise) return INVALID;
			return fakePayload.issues.length === 0 ? result : INVALID;
		};
		const helperConst = addUserConstant(ctx, helperFn);
		const transformedVar = newVar(ctx);
		doc.write(`const ${transformedVar} = ${helperConst}(${inputOutput});`);
		doc.write(`if (${transformedVar} === INVALID) return INVALID;`);
		return generateCheck(doc, ctx, def.out, transformedVar);
	} else return generateCheck(doc, ctx, def.out, inputOutput);
}
function isAsyncFunction(fn) {
	return typeof fn === "function" && (fn.constructor.name === "AsyncFunction" || fn[Symbol.toStringTag] === "AsyncFunction");
}
function generateCustomCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (def.fn) {
		if (isAsyncFunction(def.fn)) throw new ZodCompileAsyncError("z.compile: async custom predicates are not supported");
		const fnConst = addUserConstant(ctx, def.fn);
		const throwAsyncConst = addConstant(ctx, throwAsync);
		const resVar = newVar(ctx);
		doc.write(`const ${resVar} = ${fnConst}(${accessor});`);
		doc.write(`if (${resVar} instanceof Promise) ${throwAsyncConst}();`);
		doc.write(`if (!${resVar}) return INVALID;`);
	} else throw new ZodCompileUnsupportedError("custom schema without a predicate function");
	return accessor;
}
function runtimeCatch(innerSchema, catchValue, value) {
	const result = innerSchema._zod.run({
		value,
		issues: []
	}, {});
	if (result && typeof result.then === "function") return INVALID;
	const r = result;
	if (r.issues.length === 0) return r.value;
	return catchValue();
}
function generateCatchCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (!def.catchValue["~constantCatch"]) throw new ZodCompileUnsupportedError("catch with a callback (only a constant catch value compiles)", false);
	const outputVar = newVar(ctx);
	doc.write(`let ${outputVar} = (() => {`);
	doc.indented((d) => {
		const innerOut = compileChild(d, ctx, def.innerType, accessor);
		d.write(`return ${innerOut};`);
	});
	doc.write(`})();`);
	const innerConst = addConstant(ctx, def.innerType);
	const catchConst = addUserConstant(ctx, def.catchValue);
	const catchHelperConst = addConstant(ctx, runtimeCatch);
	doc.write(`if (${outputVar} === INVALID) {`);
	doc.indented((d) => {
		d.write(`${outputVar} = ${catchHelperConst}(${innerConst}, ${catchConst}, ${accessor});`);
		d.write(`if (${outputVar} === INVALID) return INVALID;`);
	});
	doc.write(`}`);
	return outputVar;
}
function generateTransformCheck(doc, ctx, schema, accessor) {
	const def = schema._zod.def;
	if (def.transform) {
		if (isAsyncFunction(def.transform)) throw new ZodCompileAsyncError("z.compile: async transforms are not supported");
		const transformFn = def.transform;
		const helperFn = (value) => {
			const fakePayload = {
				value,
				issues: [],
				addIssue: pushIssue
			};
			const result = transformFn(value, fakePayload);
			if (result instanceof Promise) return INVALID;
			return fakePayload.issues.length === 0 ? result : INVALID;
		};
		const helperConst = addUserConstant(ctx, helperFn);
		const outputVar = newVar(ctx);
		doc.write(`const ${outputVar} = ${helperConst}(${accessor});`);
		doc.write(`if (${outputVar} === INVALID) return INVALID;`);
		return outputVar;
	}
	return accessor;
}
//#endregion
export { compileFn as a, compile as i, ZodCompileAsyncError as n, withParser as o, ZodCompileUnsupportedError as r, INVALID as t };
