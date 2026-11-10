import { ft as toErrorObject, j as resolveIdentityPathViaExistingAncestorSync, lt as extractErrorCode } from "./redact-tYkqLD33.mjs";
import { A as resolveTimerTimeoutMs, B as resolveGlobalSingleton, G as isRecord, M as normalizeLowercaseStringOrEmpty } from "./utils-c2rFzEZe.mjs";
import { i as isPidDefinitelyDead, r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-B0Qv4xHQ.mjs";
import "./src-Dpfm4nnc.mjs";
import { u as normalizeUniqueStringEntriesLower } from "./string-normalization-Djlq3kPB.mjs";
import { f as emitTrustedDiagnosticEvent, m as hasInternalDiagnosticEventInterest, p as normalizeDiagnosticWorkerScript } from "./subsystem-Y9GXTYwe.mjs";
import { k as runInDetachedAsyncContext, p as sqlPublicationAnchor } from "./sqlite-worker-identity-BvirgyPs.mjs";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.mjs";
import { a as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DGDQTHyE.mjs";
import { N as stageSqliteTransactionState, ct as captureSqliteWorkerEnvironmentData, ft as parseDiagnosticEnvFlags, g as prepareSqliteDatabaseAdmission, i as captureSqliteDatabaseAdmissions, it as readSqliteDatabaseAdmissions, k as trackSqliteDatabaseAdmissionWorker, mt as currentSqliteOperationTiming, p as installSqliteDatabaseAdmissions, rt as createSqliteDatabaseAdmissionCursor, w as retainSqliteDatabaseAdmissionLocation } from "./sqlite-database-admission-BHBZtMyW.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-BOuHXXbo.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-C6BkyDvx.mjs";
import { n as BrokerNativeResourceCloseError, r as decodeNativeWorkerFailure, t as createSpawnBrokerHost } from "./host-ChyoilB1.mjs";
import { spawnSync } from "node:child_process";
import fsSync from "node:fs";
import path, { basename } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import os, { availableParallelism } from "node:os";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, MessagePort, SHARE_ENV, Worker, isMainThread, receiveMessageOnPort } from "node:worker_threads";
import { types } from "node:util";
import "node:util/types";
import { serialize, setFlagsFromString } from "node:v8";
import { EventEmitter } from "node:events";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
var Cached = class {
	constructor(getter) {
		this._getter = getter;
		this._value = void 0;
	}
	get value() {
		const getter = this._getter;
		if (getter !== void 0) {
			this._value = getter();
			this._getter = void 0;
		}
		return this._value;
	}
};
function cached(getter) {
	return new Cached(getter);
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
/**
* Whichever object a def's `shape` currently answers from: the one the caller passed until the first read, the frozen copy after it.
*
* Its keys and descriptors read without invoking anything, which is what lets a discriminated union check its discriminator, and the cycle walk read a shape, without resolving a getter that references the schema being constructed. A def that answers `shape` from an accessor of its own has none.
*/
function rawShape(def) {
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
	return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
	Object.defineProperty(target, key, {
		get() {
			const value = getter();
			assignProp(this, key, value);
			return value;
		},
		enumerable: true,
		configurable: true
	});
}
function putProp(target, key, value) {
	if (key in target) assignProp(target, key, value);
	else target[key] = value;
}
/**
* Copies `keys` of `source`'s shape onto `target`, each value passed through `wrap`.
*
* A key the source has resolved is copied through now, so the derived shape states it outright and nothing has to resolve it to learn what it holds. A key the source still defers stays deferred, and reads back through the source's own `shape`, so it resolves once and both shapes get that one schema.
*/
function mirrorShape(target, source, keys, wrap) {
	const raw = sourceShape(source);
	for (const key of keys) {
		const desc = Object.getOwnPropertyDescriptor(raw, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => {
			const value = source._zod.def.shape[key];
			return wrap ? wrap(value, key) : value;
		});
		else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
	}
}
function mirrorProps(target, source) {
	for (const key of Reflect.ownKeys(source)) {
		const desc = Object.getOwnPropertyDescriptor(source, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => source[key]);
		else putProp(target, key, desc.value);
	}
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
const BIGINT_FORMAT_RANGES = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const newShape = {};
	mirrorShape(newShape, schema, maskedKeys(schema, mask));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function maskedKeys(schema, mask) {
	const raw = sourceShape(schema);
	const keys = [];
	for (const key of Reflect.ownKeys(mask)) {
		if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
		if (mask[key]) keys.push(key);
	}
	return keys;
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const omitted = new Set(maskedKeys(schema, mask));
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = sourceShape(schema);
		for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
	mirrorProps(newShape, shape);
	return newShape;
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
	if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const newShape = {};
	mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
	mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
	return clone(a, mergeDefs(a._zod.def, {
		shape: newShape,
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask, name = "partial") {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
		type: "optional",
		innerType: value
	})));
	return clone(schema, mergeDefs(schema._zod.def, {
		shape: newShape,
		checks: []
	}));
}
function required(Class, schema, mask) {
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
		type: "nonoptional",
		innerType: value
	}));
	return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const full = {};
	for (const k of Object.keys(iss)) {
		if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
		full[k] = iss[k];
	}
	full.path ?? (full.path = []);
	full.message = message;
	if (ctx?.reportInput) full.input = iss.input;
	return full;
}
const highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
/**
* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
*
* Call this from a `proto` initializer, which runs once per prototype — never per instance.
*/
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
/** Adds members a table derives from the instance: each builds on first read and shadows as own data, and assignment shadows the same way, as when these were own properties. */
function derived(computes, table) {
	for (const key in computes) {
		const compute = computes[key];
		Object.defineProperty(table, key, {
			configurable: true,
			enumerable: true,
			get() {
				return own(this, key, compute(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	return table;
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return this == null ? fn : own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
let installing;
let broke = false;
const breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
/**
* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
* constructor, computed from the internals object itself and cached there on
* first read. One accessor per constructor rather than one per instance.
*/
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
/**
* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
* data property. One accessor per constructor rather than one per instance, because an own accessor
* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
*/
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
const CONSTANT_CATCH = "~constantCatch";
/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
function constantCatch(value) {
	const fn = () => value;
	fn[CONSTANT_CATCH] = true;
	return fn;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/core.js
var _a$1;
const _zodDesc = {
	value: void 0,
	enumerable: false
};
let _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = /* @__PURE__ */ new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc);
			} finally {
				_zodDesc.value = void 0;
			}
		} else if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/errors.js
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
const _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
const $ZodError = $constructor("$ZodError", initializer$1);
$constructor("$ZodError", initializer$1, void 0, { Parent: Error });
/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
* ("toString", "constructor") would otherwise read through to the prototype, and assigning
* "__proto__" would hit the setter instead of creating a key. */
function node(obj, key, make) {
	if (!Object.prototype.hasOwnProperty.call(obj, key)) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: make(),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = make();
	}
	return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
	else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (el === "_errors") {
						if (terminal) curr._errors.push(mapper(issue));
						i++;
						continue;
					}
					if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
						value: { _errors: [] },
						enumerable: true,
						writable: true,
						configurable: true
					});
					const node = curr[el];
					if (terminal) node._errors.push(mapper(issue));
					curr = node;
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
	return {
		callee: params?.callee ?? callee,
		Err: params?.Err
	};
}
const _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
function failure(Err, issues, ctx) {
	let error;
	return {
		success: false,
		get error() {
			if (!error) {
				error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
				issues = void 0;
				ctx = void 0;
			}
			return error;
		},
		set error(e) {
			error = e;
			issues = void 0;
			ctx = void 0;
		}
	};
}
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
const COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
const COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
const validate = ((schema, value, _ctx) => {
	const validator = schema._zod.bag.validator;
	if (validator !== void 0) {
		if (validator(value) !== COMPILE_INVALID) return true;
		if (validator.definite === true && _ctx === void 0) return false;
	}
	return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
	const ctx = _ctx ? {
		..._ctx,
		async: false,
		abortEarly: true
	} : {
		async: false,
		abortEarly: true
	};
	const fallbackRun = schema._zod.bag.fallbackRun;
	let result;
	if (fallbackRun) {
		ctx[COMPILE_FALLBACK] = true;
		result = fallbackRun({
			value,
			issues: []
		}, ctx);
	} else result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length === 0;
}
const validateAsync$1 = async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true,
		abortEarly: true
	} : {
		async: true,
		abortEarly: true
	};
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length === 0;
};
const _encode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return parse(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		return parse(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _encodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
	return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
/** Anchors a pattern source. The interpolation lives here rather than at the call site because
* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
function anchor(source) {
	return new RegExp(`^${source}$`);
}
const date = /*@__PURE__*/ anchor(dateSource);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
	const opts = ["Z"];
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const qualified = `${timeSource({
		precision: args.precision,
		seconds: true
	})}(?:${opts.join("|")})`;
	const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const anyString = /^[\s\S]{0,}$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const boolean$1 = /^(?:true|false)$/i;
const _undefined$2 = /^undefined$/i;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/checks.js
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
const _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		try {
			fn(this);
		} finally {
			this.indent -= 1;
		}
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 6,
	patch: 5
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/schemas.js
const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
const toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync(inst, value) {
	const ctx = { async: true };
	return toStandardResult(await inst._zod.run({
		value,
		issues: []
	}, ctx), ctx);
}
function standardProps(inst) {
	return {
		validate: (value) => {
			const ctx = { async: false };
			try {
				const r = inst._zod.run({
					value,
					issues: []
				}, ctx);
				if (!(r instanceof Promise)) return toStandardResult(r, ctx);
			} catch (_) {}
			return validateAsync(inst, value);
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = def.pattern ?? anyString;
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
function canParseURL(input) {
	try {
		if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
		new URL(input);
		return true;
	} catch {
		return false;
	}
}
function validateURL(trimmed, def) {
	if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
	return parseURLObject(trimmed, def);
}
/** Parses a URL while preserving the non-normalizing HTTP guard. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		if (typeof URL !== "undefined") {
			const URLStatic = URL;
			if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
		}
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
const asciiTabOrNewline = /[\t\n\r]/g;
/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = validateURL(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === true) {
				payload.value = stripTabAndNewline(trimmed);
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
	def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
});
/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	return canParseURL(`http://[${value}]`);
}
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidIPv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidCIDRv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64Charset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
	if (!base64urlCharset.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64urlCharset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = _undefined$2;
	inst._zod.values = /* @__PURE__ */ new Set([void 0]);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (typeof input === "undefined") return payload;
		payload.issues.push({
			expected: "undefined",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		const abortEarly = ctx?.abortEarly;
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else {
				handleArrayResult(result, payload, i);
				if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
const NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	let seen = 0;
	for (const key in input) {
		if (abortEarly && payload.issues.length !== seen) {
			if (aborted(payload, seen)) break;
			seen = payload.issues.length;
		}
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	const sh = desc?.get ? desc.get.raw : def.shape ?? {};
	if (sh) {
		const get = () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			get.raw = newSh;
			return newSh;
		};
		get.raw = sh;
		Object.defineProperty(def, "shape", { get });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		const abortEarly = ctx?.abortEarly;
		let seen = payload.issues.length;
		for (const key of value.allKeys) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
	};
});
const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const memo = globalConfig.memoizer;
	const generateFastpass = (shape) => {
		const normalized = _normalized.value;
		const syms = normalized.symbolKeys;
		const doc = new Doc(["payload", "ctx"], {
			shape,
			inst,
			memo,
			syms
		});
		const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
		doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
		for (const key of normalized.allKeys) {
			if (key === "__proto__") continue;
			const id = ids[key];
			const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
			const isPresent = `${k} in input`;
			const schema = shape[key];
			const optin = schema?._zod?.optin;
			const isOptionalIn = optin !== void 0;
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(k)};`);
			if (isOptionalIn && isOptionalOut) {
				const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
				doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
			else {
				doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
				if (optin === "defaulted") doc.write(`newResult[${k}] = ${id}.value;`);
				else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
			}
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		return doc.compile();
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
	defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazyInternal(inst, "values", (zod) => {
		if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		if (zod.def.options.every((o) => o._zod.pattern)) {
			const patterns = zod.def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
function discriminatorMap(def) {
	const map = /* @__PURE__ */ new Map();
	for (const option of def.options) {
		const values = option._zod.propValues?.[def.discriminator];
		if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
		for (const value of values) if (map.has(value)) {
			if (value !== void 0) throw new Error(`Duplicate discriminator value "${String(value)}"`);
			map.set(value, null);
		} else map.set(value, option);
	}
	return map;
}
const $ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
	def.inclusive = false;
	$ZodUnion.init(inst, def);
	const _super = inst._zod.parse;
	defineLazyInternal(inst, "propValues", (zod) => {
		const propValues = {};
		let undefinedCount = 0;
		for (const option of zod.def.options) {
			const pv = option._zod.propValues;
			if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
			if (pv[zod.def.discriminator]?.has(void 0)) undefinedCount++;
			for (const [k, v] of Object.entries(pv)) {
				if (!Object.prototype.hasOwnProperty.call(propValues, k)) assignProp(propValues, k, /* @__PURE__ */ new Set());
				for (const val of v) propValues[k].add(val);
			}
		}
		if (!zod.def.unionFallback && undefinedCount > 1) propValues[zod.def.discriminator]?.delete(void 0);
		return propValues;
	});
	def.options.forEach((option, i) => {
		const propShape = rawShape(option._zod.def);
		if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) throw new Error(`Invalid discriminated union option at index "${i}"`);
	});
	const disc = cached(() => discriminatorMap(def));
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				code: "invalid_type",
				expected: "object",
				input,
				inst
			});
			return payload;
		}
		const value = input?.[def.discriminator];
		const opt = disc.value.get(value);
		if (opt && (value !== void 0 || ctx.direction !== "backward")) return opt._zod.run(payload, ctx);
		if (def.unionFallback || ctx.direction === "backward") return _super(payload, ctx);
		payload.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: def.discriminator,
			options: Array.from(disc.value.keys()).filter((value) => disc.value.get(value) !== null),
			input,
			path: [def.discriminator],
			inst
		});
		return payload;
	};
});
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	const keyIssues = /* @__PURE__ */ new Map();
	const collect = (iss, side) => {
		let keys;
		if (iss.code === "unrecognized_keys" && !iss.path?.length) {
			unrecIssue ?? (unrecIssue = iss);
			keys = iss.keys;
		} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
			const k = String(iss.path[0]);
			if (!keyIssues.has(k)) keyIssues.set(k, iss);
			keys = [k];
		} else return false;
		for (const k of keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k)[side] = true;
		}
		return true;
	};
	for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
	for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length) {
		const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
		if (aggregated.length) result.issues.push({
			...unrecIssue,
			keys: aggregated
		});
		for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
	}
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) {
		if (aborted(result)) return result;
		throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	}
	result.value = merged.data;
	return result;
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	defineLazyInternal(inst, "pattern", (zod) => {
		const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
		return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	const values = new Set(def.values);
	inst._zod.values = values;
	defineLazyInternal(inst, "pattern", (zod) => {
		const vals = zod.def.values;
		return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	globalConfig.memoizer?.guard(inst);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(payload, result) {
	payload.value = result.issues.length ? void 0 : result.value;
	return payload;
}
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	inst._zod.optout = "optional";
	defineLazyInternal(inst, "values", (zod) => {
		const values = zod.def.innerType._zod.values;
		return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === void 0) {
			if (def.innerType._zod.optin !== "defaulted") return payload;
			const result = def.innerType._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
			return handleOptionalResult(payload, result);
		}
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => {
		const v = zod.def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handleCatchResult(payload, result, def, ctx) {
	if (!result.issues.length) {
		payload.value = result.value;
		if (result.memo) payload.memo = true;
		return payload;
	}
	payload.value = def.catchValue({
		...result,
		value: payload.value,
		error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
		input: payload.value
	});
	return payload;
}
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run({
			value: payload.value,
			issues: []
		}, ctx);
		if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
		return handleCatchResult(payload, result, def, ctx);
	};
});
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	if (!payload.memo) payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
	constructor() {
		super(`Cannot parse a reference cycle that closes through a transform`);
		this.name = "ZodCyclicError";
	}
};
/** Keyed off the context object every schema in one parse call already shares. */
const STATE = "~memo";
const NO_ISSUES = [];
function isRef(value) {
	return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
	return issues.map((iss) => iss.path ? {
		...iss,
		path: iss.path.slice()
	} : { ...iss });
}
const recursive = /*@__PURE__*/ new WeakMap();
/** What the walk established, in order of certainty: ordered so the strongest answer among children wins. */
const NONE = 0;
const ASSUMED = 1;
const PROVEN = 2;
/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
function isRecursive(inst, stack, resolve) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached ? PROVEN : NONE;
	if (stack.has(inst)) return PROVEN;
	stack.add(inst);
	let result = NONE;
	const check = (child) => {
		if (result !== PROVEN && child?._zod) {
			const answer = isRecursive(child, stack, resolve);
			if (answer > result) result = answer;
		}
	};
	const shape = (sh, spread) => {
		let answer = NONE;
		for (const key of Reflect.ownKeys(sh)) {
			const desc = Object.getOwnPropertyDescriptor(sh, key);
			if (spread && !desc.enumerable) continue;
			const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
			if (child > answer) answer = child;
		}
		return answer;
	};
	const merge = (answer) => {
		if (answer > result) result = answer;
	};
	const def = inst._zod.def;
	switch (def.type) {
		case "object": {
			const raw = rawShape(def);
			merge(raw ? shape(raw, true) : ASSUMED);
			check(def.catchall);
			break;
		}
		case "array":
			check(def.element);
			break;
		case "tuple":
			for (const el of def.items) check(el);
			check(def.rest);
			break;
		case "record":
		case "map":
			check(def.keyType);
			check(def.valueType);
			break;
		case "set":
			check(def.valueType);
			break;
		case "union":
			for (const el of def.options) check(el);
			break;
		case "intersection":
			check(def.left);
			check(def.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			check(def.innerType);
			break;
		case "pipe":
			check(def.in);
			check(def.out);
			break;
		case "function":
			check(def.input);
			check(def.output);
			break;
		case "lazy": {
			const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
			merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (const key in def) {
			const desc = Object.getOwnPropertyDescriptor(def, key);
			if (!desc || desc.get) continue;
			const value = desc.value;
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	return settle(inst, result);
}
/** An assumed answer must not outlive the resolution that settles it, so only a certain one is cached. */
function settle(inst, answer) {
	if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
	return answer;
}
function bucketFor(state, inst) {
	let bucket = state.buckets.get(inst);
	if (!bucket) {
		bucket = /* @__PURE__ */ new WeakMap();
		state.buckets.set(inst, bucket);
	}
	return bucket;
}
let handoff;
const open = [];
const memo = {
	alloc(_inst, payload, empty) {
		const bucket = handoff;
		if (!bucket) return empty;
		handoff = void 0;
		const entry = {
			value: empty,
			issues: null
		};
		bucket.set(payload.value, entry);
		open.push(entry);
		return empty;
	},
	guard(inst) {
		var _a;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
				return base(payload, ctx);
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	},
	attach(inst) {
		var _a;
		let isRecursiveInst;
		let rechecked = false;
		let lastCtx;
		let lastBucket;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (isRecursiveInst === void 0) {
					const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
					if (walked === NONE) {
						inst._zod.parse = base;
						if (inst._zod.run === wrapped) inst._zod.run = base;
						return base(payload, ctx);
					}
					if (walked === PROVEN || rechecked) isRecursiveInst = true;
					else rechecked = true;
				}
				const input = payload.value;
				if (!isRef(input)) return base(payload, ctx);
				let state = ctx[STATE];
				if (!state) {
					state = {
						buckets: /* @__PURE__ */ new WeakMap(),
						backEdges: void 0
					};
					ctx[STATE] = state;
				}
				let bucket;
				if (lastCtx === ctx) bucket = lastBucket;
				else {
					bucket = bucketFor(state, inst);
					lastCtx = ctx;
					lastBucket = bucket;
				}
				const hit = bucket.get(input);
				if (hit) {
					payload.value = hit.value;
					if (hit.issues) {
						if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
					} else {
						payload.memo = true;
						state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
						state.backEdges.add(hit.value);
					}
					return payload;
				}
				handoff = bucket;
				const depth = open.length;
				const result = base(payload, ctx);
				handoff = void 0;
				const entry = open.length > depth ? open.pop() : void 0;
				if (result instanceof Promise) return result.then((r) => {
					if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
					return r;
				});
				if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
				return result;
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	}
};
/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
function memoizer() {
	return memo;
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/en.js
const error = () => {
	const Sizable = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	function getTypeName(type, input) {
		if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
		return TypeDictionary[type] ?? type;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
				if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				if (issue.inclusive === false) return "Invalid input: more than one option matched";
				return "Invalid input";
			case "invalid_element": return `Invalid value in ${issue.origin}`;
			default: return `Invalid input`;
		}
	};
};
function en_default() {
	return { localeError: error() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
	if (def.checks) def.checks = [...def.checks];
	return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class(snapshotChecks({
		type: "string",
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class(snapshotChecks({
		type: "number",
		checks: [],
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _undefined$1(Class, params) {
	return new Class({
		type: "undefined",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _custom(Class, fn, _params) {
	const norm = normalizeParams(_params);
	norm.abort ?? (norm.abort = true);
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...norm
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
	for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
	return target;
}
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: params?.external ?? void 0
	};
}
/**
* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
* custom JSON Schema was written into `json`, in which case the caller must not write its own.
*/
function handleUnrepresentable(schema, ctx, json, params, message) {
	const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
		zodSchema: schema,
		path: params.path,
		message
	}) : ctx.unrepresentable;
	if (result === "any") return false;
	if (result === void 0 || result === "throw") throw new Error(message);
	Object.assign(json, result);
	return true;
}
function processSchema(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	ctx.sharedDefsExtractedFor = void 0;
	ctx.sharedEmitDoneFor = void 0;
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			processSchema(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) assignProps(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
	return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
			};
		}
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + encodeJSONPointerSegment(defId)
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") extractToDef(entry);
		}
	}
	if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
function compactTypeUnion(schema) {
	const options = schema.anyOf;
	if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
	const types = [];
	for (const option of options) {
		if (!option || typeof option !== "object") return;
		compactTypeUnion(option);
		const keys = Object.keys(option);
		if (keys.length !== 1 || keys[0] !== "type") return;
		const type = option.type;
		for (const member of Array.isArray(type) ? type : [type]) {
			if (typeof member !== "string") return;
			if (!types.includes(member)) types.push(member);
		}
	}
	delete schema.anyOf;
	schema.type = types.length === 1 ? types[0] : types;
}
/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
* an annotation like `description` — makes a member unfoldable, so a constraint this does not
* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]);
const UNION_KEYS = ["oneOf", "anyOf"];
/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
function undeclaredConstraint(member) {
	const extra = member.additionalProperties;
	if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
	return Object.keys(extra).length ? extra : null;
}
/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
function foldObjects(members) {
	const objects = [];
	for (const member of members) {
		if (typeof member !== "object" || member.type !== "object") return null;
		for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
		objects.push(member);
	}
	const properties = {};
	const required = /* @__PURE__ */ new Set();
	for (const object of objects) {
		for (const key in object.properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
			const parts = [];
			for (const other of objects) {
				const part = other.properties?.[key] ?? undeclaredConstraint(other);
				if (part === null || part === void 0) continue;
				if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
			}
			assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
		}
		for (const key of object.required ?? []) required.add(key);
	}
	const folded = {
		type: "object",
		properties
	};
	if (required.size) folded.required = [...required];
	if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
	else {
		const constraints = [];
		for (const object of objects) {
			const constraint = undeclaredConstraint(object);
			if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
		}
		if (constraints.length === 1) folded.additionalProperties = constraints[0];
		else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
	}
	return folded;
}
/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
* closed object members reject each other's keys and the schema validates nothing. Zod's parser
* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
* into one object is the encoding that says so on every target.
*
* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
* keeps its reference and its own closedness rather than being inlined as a stale copy. */
function foldIntersection(json) {
	const allOf = json.allOf;
	if (!Array.isArray(allOf) || allOf.length < 2) return;
	for (const key of FOLDABLE_KEYS) if (key in json) return;
	const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
	let folded = null;
	if (!unions.length) folded = foldObjects(allOf);
	else {
		const union = unions[0];
		const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
		if (Object.keys(union).length !== 1) return;
		const rest = allOf.filter((m) => m !== union);
		const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
		if (branches.some((b) => !b)) return;
		folded = { [keyword]: branches };
	}
	if (!folded) return;
	delete json.allOf;
	assignProps(json, folded);
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else assignProps(schema, refSchema);
			assignProps(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
		for (const rewrite of ctx.deferred) rewrite();
		if (ctx.intersections.length) {
			const carriers = /* @__PURE__ */ new Map();
			for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
				const allOf = json?.allOf;
				if (!Array.isArray(allOf)) continue;
				const existing = carriers.get(allOf);
				if (existing) existing.push(json);
				else carriers.set(allOf, [json]);
			}
			for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
		}
	}
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			assignProp(defs, seen.defId, seen.def);
		}
	}
	if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/json-schema-processors.js
const narrowMin = (agg, key, value) => {
	if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
};
const narrowMax = (agg, key, value) => {
	if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
};
const narrowBoth = (agg, value) => {
	narrowMin(agg, "minimum", value);
	narrowMax(agg, "maximum", value);
};
const addDivisor = (agg, value) => {
	agg.multipleOf ?? (agg.multipleOf = []);
	if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
};
const addPattern = (agg, pattern) => {
	agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
	agg.patterns.add(pattern);
};
const intersectMime = (agg, mime) => {
	agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
const setFormat = (agg, format) => {
	agg.format = format;
	if (format.includes("int")) agg.isInt = true;
};
const minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
const maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
const formatContributor = (ranges) => (agg, def) => {
	setFormat(agg, def.format);
	const [minimum, maximum] = ranges[def.format];
	narrowMin(agg, "minimum", minimum);
	narrowMax(agg, "maximum", maximum);
};
const contributors = {
	greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
	less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
	multiple_of: (agg, def) => addDivisor(agg, def.value),
	number_format: formatContributor(NUMBER_FORMAT_RANGES),
	bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
	min_length: minContributor,
	max_length: maxContributor,
	length_equals: (agg, def) => narrowBoth(agg, def.length),
	min_size: minContributor,
	max_size: maxContributor,
	size_equals: (agg, def) => narrowBoth(agg, def.size),
	string_format: (agg, def) => {
		setFormat(agg, def.format);
		if (def.pattern) addPattern(agg, def.pattern);
		if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
		if (def.local || def.precision === -1) agg.laxFormat = true;
	},
	mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
	const agg = {};
	const def = schema._zod.def;
	const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
	for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
	const bag = schema._zod.bag;
	if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
	if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
	if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
	if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
	if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
	if (bag.format !== void 0) {
		agg.format ?? (agg.format = bag.format);
		if (bag.format.includes("int")) agg.isInt = true;
	}
	if (bag.mime) intersectMime(agg, bag.mime);
	for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
	return agg;
}
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const exactPatterns = /* @__PURE__ */ new Map([[base64Charset, base64], [base64urlCharset, base64url]]);
const exactPattern = (p) => exactPatterns.get(p) ?? p;
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time" || laxFormat) delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const patternList = [...patterns].map(exactPattern);
		if (patternList.length === 1) json.pattern = patternList[0].source;
		else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
	json.type = isInt ? "integer" : "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (multipleOf) {
		const divisors = /* @__PURE__ */ new Set();
		for (const divisor of multipleOf) if (Number.isFinite(divisor) && divisor !== 0) divisors.add(Math.abs(divisor));
		else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
		const [first, ...rest] = divisors;
		if (first !== void 0) json.multipleOf = first;
		if (rest.length) json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
	}
};
const booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
const undefinedProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.length === 0) {
		json.not = {};
		return;
	}
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	if (def.values.length === 0) {
		json.not = {};
		return;
	}
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof val === "bigint") {
		if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
		vals.push(Number(val));
	} else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = processSchema(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
function inputOptin(schema) {
	const def = schema._zod.def;
	if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
	if (def.type === "catch") return inputOptin(def.innerType);
	return schema._zod.optin;
}
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const shape = def.shape;
	if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
	json.type = "object";
	json.properties = {};
	for (const key in shape) assignProp(json.properties, key, processSchema(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	}));
	const requiredKeys = [];
	for (const key of Object.keys(shape)) {
		const field = def.shape[key];
		if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
	}
	if (requiredKeys.length > 0) json.required = requiredKeys;
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => processSchema(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = processSchema(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = processSchema(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
	ctx.intersections.push(allOf);
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
const UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
	let unrepresentable = false;
	const serialized = JSON.stringify(value, (_, val) => {
		if (typeof val !== "bigint") return val;
		unrepresentable = true;
		return null;
	});
	if (!unrepresentable) return JSON.parse(serialized);
	handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
	return UNREPRESENTABLE_DEFAULT;
}
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io !== "input") return;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	processSchema(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/errors.js
const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: false,
		get() {
			const value = make(this);
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
			return value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
		}
	});
}
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	const proto = Object.getPrototypeOf(inst);
	if (_installedErrorProtos.has(proto)) return;
	_installedErrorProtos.add(proto);
	_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
	_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
	_lazyMethod(proto, "addIssue", (self) => (issue) => {
		self.issues.push(issue);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	_lazyMethod(proto, "addIssues", (self) => (issues) => {
		self.issues.push(...issues);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	Object.defineProperty(proto, "isEmpty", {
		configurable: true,
		enumerable: false,
		get() {
			return this.issues.length === 0;
		}
	});
};
const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/parse.js
const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
	if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
	if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	_ensureDefaultLocale();
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	return inst;
}, {
	check(...chks) {
		const def = this.def;
		return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	},
	with(...chks) {
		return this.check(...chks);
	},
	clone(def, params) {
		return clone(this, def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	refine(check, params) {
		return this.check(refine(check, params));
	},
	superRefine(refinement, params) {
		return this.check(superRefine(refinement, params));
	},
	overwrite(fn) {
		return this.check(/* @__PURE__ */ _overwrite(fn));
	},
	optional() {
		return optional(this);
	},
	exactOptional() {
		return exactOptional(this);
	},
	nullable() {
		return nullable(this);
	},
	nullish() {
		return optional(nullable(this));
	},
	nonoptional(params) {
		return nonoptional(this, params);
	},
	array() {
		return array(this);
	},
	or(arg) {
		return union([this, arg]);
	},
	and(arg) {
		return intersection(this, arg);
	},
	transform(tx) {
		return pipe(this, transform(tx));
	},
	default(d) {
		return _default(this, d);
	},
	prefault(d) {
		return prefault(this, d);
	},
	catch(params) {
		return _catch(this, params);
	},
	pipe(target) {
		return pipe(this, target);
	},
	readonly() {
		return readonly(this);
	},
	describe(description) {
		const cl = this.clone();
		globalRegistry.add(cl, { description });
		return cl;
	},
	meta(...args) {
		if (args.length === 0) return globalRegistry.get(this);
		const cl = this.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	},
	get "~standard"() {
		return hide(this, "~standard", {
			...standardProps(this),
			jsonSchema: {
				input: createStandardJSONSchemaMethod(this, "input"),
				output: createStandardJSONSchemaMethod(this, "output")
			}
		});
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	},
	parse: function _parse(data, params) {
		return parse(this, data, params, { callee: _parse });
	},
	parseAsync: async function _parseAsync(data, params) {
		return await parseAsync(this, data, params, { callee: _parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	async safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(value) {
		own(this, "spa", value);
	},
	validate(data, params) {
		return validate(this, data, params);
	},
	validateAsync(data, params) {
		return validateAsync$1(this, data, params);
	},
	encode: function _encode(data, params) {
		return encode(this, data, params, { callee: _encode });
	},
	decode: function _decode(data, params) {
		return decode(this, data, params, { callee: _decode });
	},
	encodeAsync: async function _encodeAsync(data, params) {
		return await encodeAsync(this, data, params, { callee: _encodeAsync });
	},
	decodeAsync: async function _decodeAsync(data, params) {
		return await decodeAsync(this, data, params, { callee: _decodeAsync });
	},
	safeEncode(data, params) {
		return safeEncode(this, data, params);
	},
	safeDecode(data, params) {
		return safeDecode(this, data, params);
	},
	async safeEncodeAsync(data, params) {
		return safeEncodeAsync(this, data, params);
	},
	async safeDecodeAsync(data, params) {
		return safeDecodeAsync(this, data, params);
	},
	toJSONSchema(params) {
		return createToJSONSchemaMethod(this, {})(params);
	},
	get description() {
		return globalRegistry.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /*@__PURE__*/ derived({
	format: (inst) => aggregateChecks(inst).format ?? null,
	minLength: (inst) => aggregateChecks(inst).minimum ?? null,
	maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
	regex(...args) {
		return this.check(/* @__PURE__ */ _regex(...args));
	},
	includes(...args) {
		return this.check(/* @__PURE__ */ _includes(...args));
	},
	startsWith(...args) {
		return this.check(/* @__PURE__ */ _startsWith(...args));
	},
	endsWith(...args) {
		return this.check(/* @__PURE__ */ _endsWith(...args));
	},
	min(...args) {
		return this.check(/* @__PURE__ */ _minLength(...args));
	},
	max(...args) {
		return this.check(/* @__PURE__ */ _maxLength(...args));
	},
	length(...args) {
		return this.check(/* @__PURE__ */ _length(...args));
	},
	nonempty(...args) {
		return this.check(/* @__PURE__ */ _minLength(1, ...args));
	},
	lowercase(params) {
		return this.check(/* @__PURE__ */ _lowercase(params));
	},
	uppercase(params) {
		return this.check(/* @__PURE__ */ _uppercase(params));
	},
	trim() {
		return this.check(/* @__PURE__ */ _trim());
	},
	normalize(...args) {
		return this.check(/* @__PURE__ */ _normalize(...args));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ _toLowerCase());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ _toUpperCase());
	},
	slugify() {
		return this.check(/* @__PURE__ */ _slugify());
	}
}));
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
}, {
	email(params) {
		return this.check(/* @__PURE__ */ _email(ZodEmail, params));
	},
	url(params) {
		return this.check(/* @__PURE__ */ _url(ZodURL, params));
	},
	jwt(params) {
		return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	},
	emoji(params) {
		return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	},
	guid(params) {
		return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
	},
	uuid(params) {
		return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	},
	uuidv4(params) {
		return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	},
	uuidv6(params) {
		return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	},
	uuidv7(params) {
		return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	},
	nanoid(params) {
		return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	},
	cuid(params) {
		return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	},
	cuid2(params) {
		return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	},
	ulid(params) {
		return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
	},
	base64(params) {
		return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
	},
	base64url(params) {
		return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	},
	xid(params) {
		return this.check(/* @__PURE__ */ _xid(ZodXID, params));
	},
	ksuid(params) {
		return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	},
	ipv4(params) {
		return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	},
	ipv6(params) {
		return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	},
	cidrv4(params) {
		return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	},
	cidrv6(params) {
		return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	},
	e164(params) {
		return this.check(/* @__PURE__ */ _e164(ZodE164, params));
	},
	datetime(params) {
		return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
	},
	date(params) {
		return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
	},
	time(params) {
		return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
	},
	duration(params) {
		return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
	}
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.isFinite = true;
}, /*@__PURE__*/ derived({
	minValue: (inst) => {
		const { minimum, exclusiveMinimum } = aggregateChecks(inst);
		return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
	},
	maxValue: (inst) => {
		const { maximum, exclusiveMaximum } = aggregateChecks(inst);
		return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
	},
	isInt: (inst) => {
		const { isInt, multipleOf } = aggregateChecks(inst);
		return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
	},
	format: (inst) => aggregateChecks(inst).format ?? null
}, {
	gt(value, params) {
		return this.check(/* @__PURE__ */ _gt(value, params));
	},
	gte(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	min(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	lt(value, params) {
		return this.check(/* @__PURE__ */ _lt(value, params));
	},
	lte(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	max(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	int(params) {
		return this.check(int(params));
	},
	safe(params) {
		return this.check(int(params));
	},
	positive(params) {
		return this.check(/* @__PURE__ */ _gt(0, params));
	},
	nonnegative(params) {
		return this.check(/* @__PURE__ */ _gte(0, params));
	},
	negative(params) {
		return this.check(/* @__PURE__ */ _lt(0, params));
	},
	nonpositive(params) {
		return this.check(/* @__PURE__ */ _lte(0, params));
	},
	multipleOf(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	step(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	finite() {
		return this;
	}
}));
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
	$ZodUndefined.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
});
function _undefined(params) {
	return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
}, {
	min(n, params) {
		return this.check(/* @__PURE__ */ _minLength(n, params));
	},
	nonempty(params) {
		return this.check(/* @__PURE__ */ _minLength(1, params));
	},
	max(n, params) {
		return this.check(/* @__PURE__ */ _maxLength(n, params));
	},
	length(n, params) {
		return this.check(/* @__PURE__ */ _length(n, params));
	},
	unwrap() {
		return this.element;
	}
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
	keyof() {
		return _enum(Object.keys(this._zod.def.shape));
	},
	catchall(catchall) {
		return this.clone(mergeDefs(this._zod.def, { catchall }));
	},
	passthrough() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	loose() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	strict() {
		return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
	},
	strip() {
		return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
	},
	extend(incoming) {
		return extend(this, incoming);
	},
	safeExtend(incoming) {
		return safeExtend(this, incoming);
	},
	merge(other) {
		return merge(this, other);
	},
	pick(mask) {
		return pick(this, mask);
	},
	omit(mask) {
		return omit(this, mask);
	},
	partial(...args) {
		return partial(ZodOptional, this, args[0]);
	},
	exactPartial(...args) {
		return partial(ZodExactOptional, this, args[0], "exactPartial");
	},
	required(...args) {
		return required(ZodNonOptional, this, args[0]);
	}
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
function strictObject(shape, params) {
	return new ZodObject({
		type: "object",
		shape,
		catchall: never(),
		...normalizeParams(params)
	});
}
function looseObject(shape, params) {
	return new ZodObject({
		type: "object",
		shape,
		catchall: unknown(),
		...normalizeParams(params)
	});
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
	ZodUnion.init(inst, def);
	$ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
	return new ZodDiscriminatedUnion({
		type: "union",
		options,
		discriminator,
		...normalizeParams(params)
	});
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = [...inst._zod.values];
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
	});
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function custom(fn, _params) {
	return /* @__PURE__ */ _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
//#endregion
//#region src/utils/zod-parse.ts
/**
* Null-returning Zod parse helpers for plugin and runtime boundaries.
*
* Callers use these where invalid external payloads should be ignored or
* recovered from without constructing and catching validation errors.
*/
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
function safeParseWithSchema(schema, value) {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
function safeParseJsonWithSchema(schema, raw) {
	try {
		return safeParseWithSchema(schema, JSON.parse(raw));
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/update-managed-service-handoff-schema.ts
const text = string().min(1).max(4096);
const nativeProcessIdentityShape = {
	pid: number().int().positive(),
	startIdentity: text.max(128)
};
const processIdentitySchema = strictObject({
	...nativeProcessIdentityShape,
	startIdentitySource: literal("argv-sha256").nullable().optional()
}).refine(({ startIdentity, startIdentitySource }) => startIdentitySource === "argv-sha256" ? /^win32-argv-sha256:[a-f0-9]{64}$/.test(startIdentity) : !startIdentity.startsWith("win32-argv-sha256:"));
const managedHandoffBootSchema = union([
	strictObject({
		platform: _enum(["linux", "darwin"]),
		identity: string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
	}),
	strictObject({
		platform: literal("win32"),
		identity: string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)
	}),
	strictObject({
		platform: literal("freebsd"),
		identity: string().regex(/^[a-f0-9]{32}$/)
	})
]);
const nativeLifetimeSchema = strictObject({
	kind: literal("native"),
	unit: text,
	scope: text,
	placement: discriminatedUnion("kind", [strictObject({ kind: literal("pending") }), strictObject({
		kind: literal("attached"),
		invocation: string().regex(/^[a-f0-9]{32}$/i)
	})])
});
const cancellationProtocol = literal("original-cancellation-v1");
const updateAction = strictObject({
	kind: literal("update"),
	mutationProtocol: cancellationProtocol
}).extend({
	mutationProtocol: cancellationProtocol.optional(),
	custody: _enum(["reserved", "bound"]).optional()
});
const actionSchema = discriminatedUnion("kind", [updateAction, strictObject({
	kind: literal("triage"),
	phase: _enum([
		"reserved",
		"running",
		"closing",
		"closed",
		"uncertain"
	]),
	lifetime: discriminatedUnion("kind", [strictObject({
		kind: literal("foreground"),
		boot: managedHandoffBootSchema
	}), nativeLifetimeSchema])
}).refine((action) => action.phase !== "running" || action.lifetime.kind !== "native" || action.lifetime.placement.kind === "attached")]);
const sourcePath = text.refine(path.isAbsolute, "Native source path must be absolute");
const digest = string().regex(/^[a-f0-9]{64}$/);
const nativeBorrowerSourceSchema = strictObject({
	runId: text,
	transactionId: text,
	claimId: text,
	revision: number().int().nonnegative(),
	recordSha256: digest,
	serviceKey: sourcePath,
	configPaths: array(sourcePath).min(1).max(512),
	lifetimeId: text
});
const nativeBorrowerSchema = strictObject({
	id: string().uuid(),
	phase: _enum(["reserved", "admitted"]),
	source: nativeBorrowerSourceSchema
});
const commonPayload = {
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: actionSchema
};
const originalUpdateSchema = strictObject({
	version: literal(2),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction
});
const originalGenerationSchema = strictObject({
	key: text,
	owner: text,
	payload: string().min(1),
	updatedAt: number().int().nonnegative()
});
discriminatedUnion("version", [
	strictObject({
		version: literal(4),
		executor: processIdentitySchema,
		helper: processIdentitySchema,
		action: updateAction,
		cancellation: originalGenerationSchema
	}).refine((value) => {
		const original = safeParseJsonWithSchema(originalUpdateSchema, value.cancellation.payload);
		return original !== null && JSON.stringify(original.helper) === JSON.stringify(value.helper) && JSON.stringify(original.executor) === JSON.stringify(value.executor) && JSON.stringify(original.action) === JSON.stringify(value.action) && (JSON.stringify(value.helper) === JSON.stringify(value.executor) || original.action.mutationProtocol === "original-cancellation-v1");
	}),
	strictObject({
		version: literal(2),
		...commonPayload,
		mutationOriginal: originalGenerationSchema.optional()
	}).refine((value) => {
		if (!value.mutationOriginal) return true;
		const original = safeParseJsonWithSchema(originalUpdateSchema, value.mutationOriginal.payload);
		return original !== null && !value.mutationOriginal.key.includes("/.openclaw-update-child-") && original.action.mutationProtocol === "original-cancellation-v1";
	}),
	strictObject({
		version: literal(3),
		...commonPayload,
		action: strictObject({ kind: literal("update") }),
		nativeBorrower: nativeBorrowerSchema
	})
]);
strictObject({
	version: literal(1),
	...nativeProcessIdentityShape
});
//#endregion
//#region src/infra/update-managed-service-handoff-boot.ts
/** Bind the lease environment without caching boot identity or selecting an OS early. */
function createManagedHandoffBootIdentityReader(serviceManagerEnv) {
	return function bootIdentity() {
		let value;
		if (process.platform === "linux") value = fsSync.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
		else if ([
			"freebsd",
			"darwin",
			"win32"
		].includes(process.platform)) {
			const freebsd = process.platform === "freebsd";
			const windows = process.platform === "win32";
			const result = spawnSync(windows ? "powershell.exe" : freebsd ? "/sbin/sysctl" : "/usr/sbin/sysctl", windows ? [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime.ToUniversalTime().ToString('o')"
			] : freebsd ? ["-b", "kern.boot_id"] : ["-n", "kern.bootsessionuuid"], {
				env: serviceManagerEnv,
				...freebsd ? { maxBuffer: 16 } : {
					encoding: "utf8",
					windowsHide: true
				},
				timeout: windows ? 5e3 : 1e3,
				killSignal: "SIGKILL",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0) value = freebsd ? Buffer.isBuffer(result.stdout) && result.stdout.length === 16 ? result.stdout.toString("hex") : void 0 : result.stdout.toString().trim();
		}
		const boot = {
			platform: process.platform,
			identity: process.platform === "win32" ? value : value?.toLowerCase()
		};
		const parsed = managedHandoffBootSchema.safeParse(boot);
		if (!parsed.success) throw new Error("OS boot identity unavailable; run openclaw triage manually");
		return parsed.data;
	};
}
//#endregion
//#region src/infra/gateway-lock-payload.ts
const GATEWAY_OWNER_HEARTBEAT_MS = 15e3;
const GATEWAY_OWNER_HEARTBEAT_STALE_MS = 9e4;
const [uuidBoot, windowsBoot, freebsdBoot] = managedHandoffBootSchema.options;
const host = string().min(1);
const GatewayProcessNamespaceSchema = discriminatedUnion("platform", [
	uuidBoot.extend({
		host,
		platform: literal("linux"),
		pidNsInode: string().min(1)
	}),
	uuidBoot.extend({
		host,
		platform: literal("darwin")
	}),
	windowsBoot.extend({ host }),
	freebsdBoot.extend({ host })
]);
let processNamespace;
/** Cache OS subprocess failures too; only Linux's cheap /proc probes remain retryable. */
function readGatewayLockProcessNamespace() {
	if (processNamespace?.platform === process.platform && (processNamespace.value !== null || process.platform !== "linux")) return processNamespace.value;
	try {
		const boot = createManagedHandoffBootIdentityReader(process.env)();
		const value = GatewayProcessNamespaceSchema.parse({
			host: os.hostname(),
			...boot,
			...boot.platform === "linux" ? { pidNsInode: fsSync.statSync("/proc/self/ns/pid", { bigint: true }).ino.toString() } : {}
		});
		processNamespace = {
			platform: value.platform,
			value
		};
		return value;
	} catch {
		processNamespace = {
			platform: process.platform,
			value: null
		};
		return null;
	}
}
/** Diagnostic facts never grant ownership; callers still classify the recorded holder. */
function describeGatewayLockHolder(holder, lockPath, localState) {
	const namespace = GatewayProcessNamespaceSchema.safeParse(holder.processNamespace).data;
	let heartbeatAt = holder.heartbeatAt;
	if (lockPath) try {
		heartbeatAt = fsSync.statSync(lockPath).mtimeMs;
	} catch {}
	const ageMs = heartbeatAt === void 0 ? void 0 : Date.now() - heartbeatAt;
	const location = `${namespace?.host ?? holder.host ?? "unknown host"}${namespace?.platform === "linux" ? `/pid-ns ${namespace.pidNsInode}` : ""}`;
	const action = localState === "live" ? `The holder ${holder.pid} is alive on this host, stop it first` : localState === "unknown" ? "Stop the holder before retrying" : `wait ${Math.max(1, Math.floor((GATEWAY_OWNER_HEARTBEAT_STALE_MS - (ageMs ?? 0)) / 1e3) + 1)} s and retry`;
	return `holder ${holder.pid ?? "unknown"} at ${location}, last renewed ${ageMs === void 0 ? "at an unknown time" : `${Math.max(0, Math.floor(ageMs / 1e3))} s ago`}. ${action}.`;
}
var GatewayLockNamespaceError = class extends Error {
	constructor(holder, lockPath) {
		super(`cannot verify Gateway ownership from this process (different PID namespace); the owner heartbeat is fresh — run this command inside the Gateway container or with a shared PID namespace. If the previous Gateway stopped, wait up to 90 seconds after its last heartbeat. ${describeGatewayLockHolder(holder, lockPath)}`);
		this.name = "GatewayLockNamespaceError";
	}
};
/** Qualify PID evidence before any local process probe or same-PID authority shortcut. */
function classifyGatewayLockProcessNamespace(value, lockPath) {
	return classifyGatewayOwnerProcessNamespace(value, { readHeartbeatAt: () => lockPath ? fsSync.statSync(lockPath).mtimeMs : void 0 });
}
/** File locks and SQLite leases share one boot/namespace and heartbeat policy. */
function classifyGatewayOwnerProcessNamespace(value, options = {}) {
	const owner = GatewayProcessNamespaceSchema.safeParse(value).data;
	const ownerHost = owner?.host ?? options.ownerHost;
	const foreignHost = ownerHost !== void 0 && ownerHost !== os.hostname();
	if (!foreignHost && process.platform === "win32" && owner?.platform === "win32") return "same";
	if (value === void 0 && !foreignHost) return "same";
	const current = readGatewayLockProcessNamespace();
	if (owner && current) {
		if (owner.platform === current.platform && owner.host === current.host && owner.identity !== current.identity) return "dead";
		if (owner.platform === current.platform && owner.identity === current.identity && (owner.platform !== "linux" || current.platform === "linux" && owner.pidNsInode === current.pidNsInode)) return "same";
	} else if (process.platform !== "linux" && !foreignHost) return "same";
	try {
		const heartbeatAt = options.readHeartbeatAt?.();
		return heartbeatAt !== void 0 && Date.now() - heartbeatAt > 9e4 ? "dead" : "unknown";
	} catch {
		return "unknown";
	}
}
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
	/** A cold opener may wait for this transient owner, never enter while it is held. */
	stateOwnerKind: literal("schema").optional(),
	/** Present when Gateway cron writes use the dynamic-default ownership projection. */
	cronOwnerProjection: literal("dynamic-default-v1").optional(),
	createdAt: string(),
	startupPhase: literal("starting").optional(),
	configPath: string(),
	port: number().int().min(1).max(65535).optional(),
	role: _enum([
		"gateway",
		"agent-embedded",
		"skill-workshop-apply",
		"sqlite-maintenance"
	]).optional(),
	stateDir: string().optional(),
	startTime: number().optional(),
	processNamespace: GatewayProcessNamespaceSchema.nullable().optional()
});
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
}
//#endregion
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
//#endregion
//#region worker-heap-flag.mjs
const startupFlags = `${process.execArgv.join(" ")} ${process.env.NODE_OPTIONS ?? ""}`;
const heapFlag = /--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u;
const immutableFlags = /--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u;
if (isMainThread && !process.versions.bun && heapFlag.test(startupFlags)) {
	if (immutableFlags.test(startupFlags)) process.emitWarning("V8 startup flags prevent enforcing per-worker heap limits.");
	else setFlagsFromString("--max-old-space-size=0 --max-heap-size=0");
}
//#endregion
//#region src/infra/main-thread-stall.ts
const taskState = resolveGlobalSingleton(Symbol.for("openclaw.mainThreadTask"), () => ({}));
function runWithMainThreadTask(name, run) {
	const observer = taskState.observer;
	if (!observer) return run();
	const exit = observer.enter(name);
	try {
		return run();
	} finally {
		exit();
	}
}
//#endregion
//#region src/infra/worker-message-metrics.ts
const counters = resolveGlobalSingleton(Symbol.for("openclaw.workerMessageMetrics"), () => /* @__PURE__ */ new Map());
/** The main endpoint counts each crossing once, using byte lengths already known by its owner. */
function recordWorkerMessage(kind, direction, payloadBytes) {
	if (!isMainThread) return;
	let directions = counters.get(kind);
	if (!directions) {
		directions = {};
		counters.set(kind, directions);
	}
	const counter = directions[direction] ??= {
		kind,
		direction,
		messages: 0,
		payloadBytes: 0,
		unmeasuredMessages: 0
	};
	counter.messages++;
	if (payloadBytes === void 0) counter.unmeasuredMessages++;
	else counter.payloadBytes += payloadBytes;
}
function messageData(message) {
	return isRecord(message) && !types.isProxy(message) ? message : void 0;
}
function dataProperty(message, key) {
	return Object.getOwnPropertyDescriptor(message, key)?.value;
}
function messageBody(message) {
	const data = messageData(message);
	const type = data && dataProperty(data, "type");
	return data && (type === "post" || type === "message") ? dataProperty(data, "value") : message;
}
/** Known payload bytes only: no serialization, graph traversal, or envelope estimate. */
function workerMessagePayloadBytes(message) {
	if (!isMainThread) return;
	const body = messageBody(message);
	const data = messageData(body);
	const payload = data && (Object.getOwnPropertyDescriptor(data, "value") ?? Object.getOwnPropertyDescriptor(data, "input"));
	if (payload && !("value" in payload)) return;
	const value = payload ? payload.value : body;
	if (types.isProxy(value)) return;
	if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
		const preparation = data && dataProperty(data, "type") === "open" ? dataProperty(data, "preparation") : void 0;
		return value.byteLength + (ArrayBuffer.isView(preparation) ? preparation.byteLength : 0);
	}
	if (typeof value === "string") return value.length * 2;
	if (value === null || value === void 0) return 0;
}
function messageKind(message, fallback) {
	const body = messageData(messageBody(message));
	if (!body) return fallback;
	switch (dataProperty(body, "status")) {
		case "ok":
		case "failed": return "task_reply";
		case "request": return "task_request";
		case "notification": return "task_notification";
		case "consumed": return "task_consumed";
		case "memory": return "memory";
		case "ready": return "lifecycle";
	}
	if (typeof dataProperty(body, "taskId") === "number") return "task_input";
	if (typeof dataProperty(body, "actor") === "number") return "sqlite_request";
	if (typeof dataProperty(body, "id") === "number" && typeof dataProperty(body, "ok") === "boolean") return "sqlite_reply";
	if (typeof dataProperty(body, "operationId") === "number") switch (dataProperty(body, "type")) {
		case "prepare":
		case "reclaim":
		case "canonical-validation": return "sqlite_request";
		case "reclaimed":
		case "refused":
		case "checkpoint": return "sqlite_reply";
		case "admission":
		case "admission-request":
		case "admission-release": return "admission";
		case "commit-request": return "authority";
	}
	switch (dataProperty(body, "type")) {
		case "resource-owner":
		case "resource-message":
		case "resource-closed": return "resource";
		case "cpu":
		case "heap": return "memory";
		case "create":
		case "created":
		case "stop":
		case "stopped":
		case "close":
		case "closed":
		case "release":
		case "ref":
		case "execution-exit":
		case "error":
		case "messageerror":
		case "create-error":
		case "stop-error":
		case "request-error": return "lifecycle";
	}
	return dataProperty(body, "closeResource") === true ? "resource" : fallback;
}
/** Observe each native boundary once; null preserves a prepared unknown byte count. */
function observeWorkerMessage(message, direction, fallbackKind = "other", payloadBytes) {
	if (isMainThread) recordWorkerMessage(messageKind(message, fallbackKind), direction, payloadBytes === void 0 ? workerMessagePayloadBytes(message) : payloadBytes ?? void 0);
}
//#endregion
//#region src/infra/worker-cpu.ts
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?[jt]s$/u, ".js");
	return normalizeDiagnosticWorkerScript(name);
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		gcObserver: void 0,
		revision: 0,
		nextPoolId: 0,
		poolIds: /* @__PURE__ */ new WeakMap(),
		workers: /* @__PURE__ */ new Map(),
		lifecycle: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = runWithMainThreadTask(`worker:${workerScriptName(args[0], args[1]?.eval)}`, () => new Worker(...args));
	trackNativeWorkerForCpu(worker, args[0], args[1]?.eval);
	trackedWorkers.workers.get(worker).internalMessages = true;
	return worker;
}
/** Register a physical child only after its native lifetime owner confirms construction. */
function trackNativeWorkerForCpu(worker, filename, evalSource = false) {
	trackWorker(worker);
	const source = trackedWorkers.workers.get(worker);
	source.script = workerScriptName(filename, evalSource);
	if (source.script === "code-mode-node.worker.js" && source.workerSlot === void 0) {
		const occupied = new Set([...trackedWorkers.workers.values()].map((entry) => entry.workerSlot));
		for (let slot = 1; slot <= 64; slot++) if (!occupied.has(slot)) {
			source.workerSlot = slot;
			break;
		}
	}
	source.lifecycleMessages = source.script === "openclaw-state-lease-heartbeat.worker.js" || source.script === "gateway-state-owner-heartbeat.worker.js";
}
/** Pool identity follows its live Workers without retaining the pool itself. */
function attributeWorkerToPool(worker, pool) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	let poolId = trackedWorkers.poolIds.get(pool);
	if (poolId === void 0) {
		poolId = ++trackedWorkers.nextPoolId;
		trackedWorkers.poolIds.set(pool, poolId);
	}
	source.poolId = poolId;
}
function forgetWorker(worker) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	const counts = countWorkerStart(source);
	const reason = source.retirementReason ?? "exit";
	counts.retired.set(reason, (counts.retired.get(reason) ?? 0) + 1);
	source.memoryPort?.close();
	trackedWorkers.workers.delete(worker);
	trackedWorkers.revision++;
}
function countWorkerStart(source) {
	let counts = trackedWorkers.lifecycle.get(source.script);
	if (!counts) {
		counts = {
			started: 0,
			retired: /* @__PURE__ */ new Map()
		};
		trackedWorkers.lifecycle.set(source.script, counts);
	}
	if (!source.started) {
		source.started = true;
		counts.started++;
	}
	return counts;
}
/** Record the owner's reason now; only confirmed native exit increments retirement. */
function markWorkerRetirement(worker, reason) {
	const source = trackedWorkers.workers.get(worker);
	if (source) source.retirementReason ??= reason;
}
function canObserveWorkerMessages(worker) {
	if (!Object.isExtensible(worker)) return false;
	for (const method of ["postMessage", "emit"]) {
		let owner = worker;
		while (owner) {
			const descriptor = Object.getOwnPropertyDescriptor(owner, method);
			if (descriptor) {
				if (!descriptor.writable || typeof descriptor.value !== "function") return false;
				break;
			}
			owner = Reflect.getPrototypeOf(owner);
		}
		if (!owner) return false;
	}
	return true;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	if (isMainThread && worker instanceof Worker) recordWorkerMessage("lifecycle", "to_worker");
	if (isMainThread && worker instanceof Worker && canObserveWorkerMessages(worker)) {
		const nativePrototype = Object.getPrototypeOf(worker) === Worker.prototype;
		const postMessage = !nativePrototype || Object.hasOwn(worker, "postMessage") ? worker.postMessage : void 0;
		worker.postMessage = function(value, transferList) {
			const bytes = source.internalMessages ? workerMessagePayloadBytes(value) : void 0;
			(postMessage ?? Worker.prototype.postMessage).call(this, value, transferList);
			if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "to_worker", bytes);
			else if (source.internalMessages) observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
			else recordWorkerMessage("other", "to_worker");
		};
		const emit = !nativePrototype || Object.hasOwn(worker, "emit") ? worker.emit : void 0;
		worker.emit = function(event, ...args) {
			if (event === "message") {
				if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "from_worker", workerMessagePayloadBytes(args[0]));
				else if (source.internalMessages) observeWorkerMessage(args[0], "from_worker");
				else recordWorkerMessage("other", "from_worker");
			}
			return (emit ?? Worker.prototype.emit).call(this, event, ...args);
		};
	}
	let pending = false;
	const source = {
		script: "other",
		async cpuUsage() {
			if (pending) return;
			pending = true;
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			} finally {
				pending = false;
			}
		}
	};
	trackedWorkers.workers.set(worker, source);
	queueMicrotask(() => countWorkerStart(source));
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
/** The existing registry owns this channel until native exit, never the submitting task. */
function receiveWorkerMemoryPort(worker, message) {
	if (!isRecord(message) || message.status !== "memory" || !(message.port instanceof MessagePort)) return false;
	const port = message.port;
	const source = trackedWorkers.workers.get(worker);
	if (!source || source.memoryPort || worker.threadId === -1) {
		port.close();
		return true;
	}
	source.memoryPort = port;
	source.memoryPending = true;
	const close = () => {
		source.memoryPort = void 0;
		source.memoryPending = false;
		source.memoryUnavailable = true;
		port.close();
	};
	port.on("message", (record) => {
		recordWorkerMessage("memory", "from_worker", ("heapUsed" in record ? 32 + (record.heapSizeLimitBytes === void 0 ? 0 : 8) : 0) + (record.gc?.length ?? 0) * 8);
		if (record.gc) trackedWorkers.gcObserver?.(record.gc, source.script, source.workerSlot);
		if (!("heapUsed" in record)) return;
		delete record.gc;
		source.heap = {
			value: record,
			sampledAt: performance.now()
		};
		source.memoryPending = false;
		source.memoryUnavailable = false;
	});
	port.once("close", close);
	port.once("messageerror", close);
	port.unref();
	if (trackedWorkers.gcObserver) {
		port.postMessage({ gc: true });
		recordWorkerMessage("memory", "to_worker", 1);
	}
	return true;
}
//#endregion
//#region src/infra/stale-lock-file.ts
function readLockFileOwnerPayload(payload) {
	if (!payload) return null;
	return {
		pid: typeof payload.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : void 0,
		createdAt: typeof payload.createdAt === "string" ? payload.createdAt : void 0,
		starttime: typeof payload.starttime === "number" && Number.isInteger(payload.starttime) && payload.starttime >= 0 ? payload.starttime : void 0
	};
}
/** Capture only the bounded facts used by this exact stale decision. Never
* resample the owner after failure or copy arbitrary sidecar payload fields. */
function inspectStaleLockOwner(params) {
	const payload = readLockFileOwnerPayload(params.payload);
	if (!payload?.pid) return null;
	const observedStarttime = payload.starttime === void 0 ? null : (params.getProcessStartTime ?? getFileLockProcessStartTime)(payload.pid);
	const identity = {
		pid: payload.pid,
		recordedStarttime: payload.starttime ?? null,
		observedStarttime
	};
	const normalizedStored = process.platform === "darwin" && payload.starttime !== void 0 && payload.starttime > 1e10 ? Math.floor(payload.starttime / 1e6) : payload.starttime;
	if (observedStarttime !== null && observedStarttime !== normalizedStored) return {
		reason: "owner-starttime-changed",
		...identity
	};
	return (params.isPidDefinitelyDead ?? isPidDefinitelyDead)(payload.pid) ? {
		reason: "owner-process-exited",
		...identity
	} : null;
}
function isLockOwnerDefinitelyStale(params) {
	return inspectStaleLockOwner(params) !== null;
}
//#endregion
//#region src/infra/gateway-state-owner-record.ts
/** Admission and reclamation use the same namespace-qualified PID evidence. */
function isGatewayStateOwnerDefinitelyStale(value, lockPath) {
	const payload = isRecord(value) ? value : null;
	const namespace = classifyGatewayLockProcessNamespace(payload?.processNamespace, lockPath);
	if (namespace === "unknown") throw new GatewayLockNamespaceError(payload ?? {}, lockPath);
	return namespace === "dead" || isLockOwnerDefinitelyStale({ payload: payload ? {
		pid: payload.pid,
		starttime: payload.startTime
	} : null });
}
var StateDatabaseAccessError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "StateDatabaseAccessError";
	}
};
const GatewayStateOwnerContentionError = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwnerContentionError"), () => class StateOwnerContentionError extends Error {
	constructor(databasePath, cause, holderDetail, holder) {
		super(`OpenClaw state database is busy at ${databasePath}. ${holderDetail ? `${holderDetail} ` : ""}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`);
		this.databasePath = databasePath;
		this.cause = cause;
		this.holderDetail = holderDetail;
		this.holder = holder;
		this.name = "GatewayStateOwnerContentionError";
	}
});
/** A local holder exists, but the caller has no live lexical maintenance authority. */
const StateDatabaseMaintenanceScopeError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseMaintenanceScopeError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath) {
		super(`Internal state ownership error at ${databasePath}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`);
		this.databasePath = databasePath;
		this.name = "StateDatabaseMaintenanceScopeError";
	}
});
const StateDatabaseAdmissionPendingError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseAdmissionPendingError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** A live foreign process holds offline-maintenance custody of this database. */
const StateDatabaseOfflineMaintenanceError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseOfflineMaintenanceError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** Persisted ownership can identify a holder but cannot lend this process maintenance authority. */
function assertPersistedStateDatabaseAccessAllowed(params) {
	const { databasePath, ownerPath, assertMaintenance } = params;
	const unavailable = `OpenClaw state ownership at ${databasePath} could not be verified from ${ownerPath}; restart the Gateway.`;
	let raw;
	try {
		raw = fsSync.readFileSync(ownerPath, "utf8");
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		throw new StateDatabaseAccessError(unavailable, { cause: error });
	}
	const owner = parseGatewayLockPayload(raw);
	if (!owner) throw new StateDatabaseAdmissionPendingError(databasePath, unavailable);
	if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0) throw new StateDatabaseAccessError(unavailable);
	if (isGatewayStateOwnerDefinitelyStale(owner, ownerPath)) return;
	if (owner.pid === process.pid && !isMainThread) return;
	if (!isPidAlive(owner.pid)) throw new StateDatabaseAccessError(unavailable);
	const role = owner.role ?? "gateway";
	if (role === "gateway" || role === "agent-embedded") return;
	if (owner.pid === process.pid) {
		assertMaintenance();
		return;
	}
	const maintenancePending = `OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes. For update progress, run \`openclaw update status --json\`.`;
	if (owner.stateOwnerKind === "schema" && owner.role === "sqlite-maintenance") throw new StateDatabaseAdmissionPendingError(databasePath, maintenancePending);
	throw new StateDatabaseOfflineMaintenanceError(databasePath, maintenancePending);
}
function defaultPayload(databasePath) {
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	const startTime = getFileLockProcessStartTime(process.pid);
	return {
		pid: process.pid,
		ownerId: randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir,
		configPath: path.join(stateDir, "openclaw.json"),
		role: "sqlite-maintenance",
		processNamespace: readGatewayLockProcessNamespace(),
		...startTime === null ? {} : { startTime }
	};
}
//#endregion
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
function driveRetainedOperation(source, advance, onError) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			advance(completion, serviceInContext);
		} catch (error) {
			try {
				completion.reject(onError ? onError(error) : error);
			} catch (combined) {
				completion.reject(combined);
			}
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	return driveRetainedOperation(source, (completion) => {
		source.service();
		const outcome = source.read();
		if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Sequence operations while retaining the continuation's captured caller context. */
function flatMapRetainedOperation(source, next) {
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!child) {
			source.service();
			const outcome = source.read();
			if (outcome.status === "pending") return;
			if (outcome.status === "rejected") throw outcome.error;
			child = next(outcome.value);
			child.result.then(service, service);
		}
		child.service();
		const outcome = child.read();
		if (outcome.status === "fulfilled") completion.resolve(outcome.value);
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
/** Join the owner's real cleanup; that owner chooses how simultaneous failures combine. */
function finallyRetainedOperation(source, cleanup, combineErrors = (_source, cleanupError) => cleanupError) {
	let original;
	let child;
	return driveRetainedOperation(source, (completion, service) => {
		if (!original) {
			try {
				source.service();
				const outcome = source.read();
				if (outcome.status === "pending") return;
				original = outcome;
			} catch (error) {
				original = {
					status: "rejected",
					error
				};
			}
			child = cleanup(original);
			child.result.then(service, service);
		}
		if (!child) return;
		child.service();
		const outcome = child.read();
		if (outcome.status === "pending") return;
		if (outcome.status === "rejected") throw outcome.error;
		if (original.status === "rejected") completion.reject(original.error);
		else completion.resolve(original.value);
	}, (error) => original?.status === "rejected" ? combineErrors(original.error, error) : error);
}
//#endregion
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
/** Task admission carries the parent owner's current fences into every worker generation. */
function captureDeletedAgentDatabaseFences() {
	return [...readers.deleted];
}
//#endregion
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
	const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
	const envFlags = parseDiagnosticEnvFlags(env[DIAGNOSTICS_ENV]);
	if (envFlags.disablesAll) return [];
	return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
	const enabledFlags = resolveDiagnosticFlags(cfg, env);
	const target = normalizeLowercaseStringOrEmpty(flag);
	if (!target) return false;
	for (const enabled of enabledFlags) {
		if (enabled === "*" || enabled === "all" || enabled === target) return true;
		if (enabled.endsWith(".*") && target === enabled.slice(0, -2)) return true;
		if (enabled.endsWith("*") && target.startsWith(enabled.slice(0, -1))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/sqlite-worker-request-class.ts
const operations = [
	"admit",
	"audit.events.list",
	"audit.writer.process",
	"audit.writer.prune",
	"database.domain.bind",
	"database.domain.close",
	"database.domain.publish",
	"database.inspectIdle",
	"database.prepareWrite",
	"database.walMaintenance",
	"stateLease.acquire",
	"stateLease.release",
	"stateLease.renew",
	"stateLease.verify"
];
const families = [
	"acp",
	"acpSessions",
	"agentDatabaseDeletion",
	"agentDatabaseRegistry",
	"agentDatabases",
	"agentDeletionJournal",
	"agentProvenance",
	"apns",
	"audit",
	"authProfiles",
	"backup",
	"bootstrap",
	"capture",
	"channelIngress",
	"clawProvenance",
	"claws",
	"config",
	"conversation",
	"conversationBindings",
	"database",
	"deliveryQueue",
	"deviceAuth",
	"deviceIdentity",
	"devicePairing",
	"diagnostic",
	"doctor",
	"exec-approvals",
	"execApprovals",
	"generatedHtmlProvenance",
	"githubPublication",
	"githubRepository",
	"legacyMcpOAuth",
	"localWorkspace",
	"managedImages",
	"mcpOAuth",
	"mentions",
	"modelCatalog",
	"nativeHookRelay",
	"node",
	"nodeHost",
	"nodeWorker",
	"onboardingRecommendations",
	"operator",
	"operatorApprovals",
	"pairing",
	"placementJournals",
	"placementTools",
	"placementTranscript",
	"placementTurns",
	"pluginBlob",
	"pluginModelCatalogCredentials",
	"plugins",
	"preparedPoolPresence",
	"projects",
	"promotions",
	"repositoryWorkspaces",
	"restartSentinel",
	"sandboxRegistry",
	"secrets",
	"sessionDelivery",
	"sessionGroups",
	"sessionRepositoryWorkspaces",
	"sessionState",
	"sessionUpstream",
	"skillLibrary",
	"skillUploads",
	"skills",
	"stateLease",
	"subagents",
	"telemetry",
	"tts",
	"tui",
	"updateRuns",
	"usageCache",
	"userModelAccounts",
	"userPreferences",
	"userProfiles",
	"webPush",
	"workerEnvironments",
	"workerInference",
	"workerPlacements",
	"workers",
	"workspace",
	"workshop",
	"worktrees"
];
const sqliteWorkerRequestClasses = /* @__PURE__ */ new Set([...operations, ...families]);
function classifySqliteWorkerExecute(commandType) {
	if (sqliteWorkerRequestClasses.has(commandType)) return commandType;
	const separator = commandType.indexOf(".");
	const family = separator === -1 ? commandType : commandType.slice(0, separator);
	return sqliteWorkerRequestClasses.has(family) ? family : "execute";
}
//#endregion
//#region src/infra/worker-request-diagnostics.ts
const reservations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerReservationObservation"), () => new AsyncLocalStorage());
const detailedTiming = isDiagnosticFlagEnabled("sqlite.worker-timing");
const coreCommands = /* @__PURE__ */ new Set([
	"session.actor.read",
	"session.actor.acceptInput",
	"session.actor.adoptRun",
	"session.actor.appendToolResult",
	"session.actor.appendTranscriptEvent",
	"session.actor.completeTurn",
	"session.actor.deliveryPending",
	"session.actor.deliverySettled",
	"session.actor.patch",
	"session.entry.read",
	"session.entry.patch.prepare",
	"session.entry.patch.commit",
	"session.entry.replacements.prepare",
	"session.entry.replacements.commit",
	"session.lifecycle.project",
	"session.maintenance.metadata",
	"session.maintenance.prepare",
	"session.maintenance.release",
	"session.maintenance.finalize",
	"session.maintenance.size",
	"session.rowTranscript.backfill",
	"usageCache.writeRollup",
	"usageCache.prune",
	"trajectory.events.append",
	"trajectory.retention.begin",
	"trajectory.retention.delete",
	"session.pendingInputs.read",
	"session.pendingInputs.mutate",
	"session.turn.prepare",
	"session.turn.commit",
	"transcript.prepare",
	"transcript.commit"
]);
const projectionCommands = /* @__PURE__ */ new Map([
	["preflight", "transcript-projection.preflight"],
	["sweep", "transcript-projection.sweep"],
	["claim", "transcript-projection.claim"],
	["deleteChunk", "transcript-projection.deleteChunk"],
	["appendChunk", "transcript-projection.appendChunk"],
	["finalize", "transcript-projection.finalize"]
]);
const projectionModuleSuffixes = ["/config/sessions/session-transcript-projection-publication.worker.js", "/config/sessions/session-transcript-projection-publication.worker.ts"];
const requestPrefixes = [
	["pluginState.", "plugin_state"],
	["session.history.", "transcript_read"],
	["trajectory.", "transcripts"],
	["session.transcript.", "transcripts"],
	["transcripts.", "transcripts"],
	["session.", "sessions"],
	["cron.", "cron"]
];
function classifyWorkerRequest(commandType, commandInput) {
	if (typeof commandType !== "string") return "execute";
	if (coreCommands.has(commandType)) return commandType;
	if (commandType === "auth-profile-rows") return "auth_profiles";
	if (commandType === "database.domain.execute" || commandType === "database.domain.publish") {
		const publication = isRecord(commandInput) ? commandInput : void 0;
		const inner = publication && isRecord(publication.command) ? publication.command : void 0;
		const moduleUrl = publication?.moduleUrl;
		if (commandType === "database.domain.publish" && typeof moduleUrl === "string" && typeof inner?.type === "string" && projectionModuleSuffixes.some((suffix) => moduleUrl.endsWith(suffix))) {
			const projection = projectionCommands.get(inner.type);
			if (projection) return projection;
		}
		const label = inner ? classifyWorkerRequest(inner.type) : "execute";
		return label === "execute" ? "domain_execute" : label;
	}
	for (const [prefix, requestClass] of requestPrefixes) if (commandType.startsWith(prefix)) return requestClass;
	return classifySqliteWorkerExecute(commandType);
}
const queued = resolveGlobalSingleton(Symbol.for("openclaw.workerRequestQueueDepth"), () => /* @__PURE__ */ new Map());
const requestClasses = /* @__PURE__ */ new Set([
	...coreCommands,
	...projectionCommands.values(),
	...sqliteWorkerRequestClasses,
	...requestPrefixes.map(([, requestClass]) => requestClass),
	"task",
	"open",
	"close",
	"execute",
	"domain_execute",
	"auth_profiles"
]);
/** One observation follows a request across admission retries and cancellation. */
function trackWorkerRequest(kind, requestClass, queuedSignal) {
	const label = requestClasses.has(requestClass) ? requestClass : "other";
	const reservation = kind === "sqlite_writer" ? reservations.getStore() : void 0;
	const enqueuedAt = performance.now();
	const timing = kind === "sqlite_writer" && (detailedTiming || hasInternalDiagnosticEventInterest("worker.request")) ? { enqueued: enqueuedAt } : void 0;
	let startedAt;
	let completed = false;
	const emit = (phase, durations = {}) => {
		if (!hasInternalDiagnosticEventInterest("worker.request")) return;
		emitTrustedDiagnosticEvent({
			type: "worker.request",
			kind,
			requestClass: label,
			phase,
			queueDepth: queued.get(kind) ?? 0,
			...durations,
			...phase === "completed" && timing ? { timing } : {}
		});
	};
	const dequeue = () => queued.set(kind, (queued.get(kind) ?? 0) - 1);
	queued.set(kind, (queued.get(kind) ?? 0) + 1);
	emit("queued");
	const observation = {
		timing,
		...reservation ? { recordTransactions: (count) => {
			reservation.transactionCount = (reservation.transactionCount ?? 0) + count;
		} } : {},
		started: () => {
			if (completed || startedAt !== void 0) return;
			startedAt = performance.now();
			if (reservation) reservation.operations.add(reservation.operations.has(label) || reservation.operations.size < 8 ? label : "other");
			if (timing) timing.dispatched = startedAt;
			queuedSignal?.removeEventListener("abort", observation.completed);
			dequeue();
			emit("started", { queueWaitMs: startedAt - enqueuedAt });
		},
		completed: () => {
			if (completed) return;
			completed = true;
			queuedSignal?.removeEventListener("abort", observation.completed);
			if (startedAt === void 0) dequeue();
			emit("completed", startedAt === void 0 ? {} : { durationMs: performance.now() - startedAt });
		}
	};
	queuedSignal?.addEventListener("abort", observation.completed, { once: true });
	if (queuedSignal?.aborted) observation.completed();
	return observation;
}
//#endregion
//#region src/infra/worker-native-resource.ts
/** Binds the host's original cleanup port to the same surviving spawn-owner claim. */
function bindNativeWorkerResource(options) {
	const { broker, descriptor, connection } = options;
	let disposed = false;
	const lease = broker.captureNativeResource({
		moduleUrl: descriptor.moduleUrl,
		input: descriptor.input,
		ownerPort: Boolean(connection)
	}, {
		message(response) {
			if (response.type === "resource-owner") connection?.port.postMessage(response.value, []);
			else if (response.type === "resource-closed") options.closed();
		},
		failed: (error) => options.failed(error)
	});
	const forward = (value) => {
		if (disposed) return;
		try {
			const delivery = lease.ownerMessage(value);
			if (options.supervisorAvailable()) options.postOwnerMessage(value, delivery.sequence);
		} catch (error) {
			options.failed(toErrorObject(error, "Native resource owner delivery failed"));
		}
	};
	connection?.port.on("message", forward);
	const dispose = () => {
		if (disposed) return;
		disposed = true;
		connection?.port.off("message", forward);
		connection?.port.close();
		connection?.dispose();
	};
	return {
		attachment: lease.attachment,
		receive(response) {
			lease.receive(response);
		},
		service() {
			if (disposed || !connection) return;
			connection.service();
			for (;;) {
				const next = receiveMessageOnPort(connection.port);
				if (!next) break;
				forward(next.message);
			}
		},
		async closeAfterSupervisor() {
			try {
				await broker.sealNativeResources();
				await lease.close();
			} catch (error) {
				if (error instanceof BrokerNativeResourceCloseError && connection?.decodeCloseError) throw connection.decodeCloseError(error.payload);
				throw error;
			}
		},
		release() {
			lease.release();
			dispose();
		},
		abandonUnattached() {
			lease.abandonUnattached();
			dispose();
		}
	};
}
//#endregion
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
livePort.stack = void 0;
const portValidation = { get value() {
	throw livePort;
} };
function nativePortIsOpen(port) {
	if (process.versions.bun) {
		const referenced = port.hasRef();
		port.unref();
		port.ref();
		const open = port.hasRef();
		if (!referenced) port.unref();
		return open;
	}
	try {
		structuredClone(portValidation, { transfer: [port] });
	} catch (error) {
		if (error === livePort) return true;
		if (error instanceof DOMException && error.name === "DataCloneError") return false;
		throw error;
	}
	throw new Error("Native port validation did not abort serialization");
}
//#endregion
//#region src/infra/worker-native-task-port.ts
/** The task endpoint owns delivery only; its close never proves native execution stopped. */
var NativeWorkerTaskPort = class {
	constructor(port, callbacks) {
		this.port = port;
		this.callbacks = callbacks;
		this.pending = [];
		this.started = false;
		this.disposed = false;
		this.portClosed = false;
		this.receive = (value) => {
			observeWorkerMessage(value, "from_worker");
			this.pending.push({
				type: "message",
				value
			});
			this.drain();
		};
		this.receiveError = (error) => {
			this.pending.push({
				type: "messageerror",
				error
			});
			this.drain();
		};
		this.closed = () => {
			this.portClosed = true;
			this.drain();
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		};
		port.on("message", this.receive);
		port.on("messageerror", this.receiveError);
		port.on("close", this.closed);
		port.unref();
	}
	fail(error) {
		if (this.disposed || this.failure) return;
		this.failure = error;
		this.callbacks.unavailable();
	}
	start() {
		this.started = true;
	}
	/** Startup admission gates data even when the control owner has already failed. */
	drain() {
		if (this.disposed || !this.started) return;
		for (;;) {
			const buffered = this.pending.shift();
			if (buffered) {
				if (buffered.type === "message") this.callbacks.message(buffered.value);
				else this.callbacks.messageerror(buffered.error);
			} else {
				if (this.portClosed || this.failure) return;
				let next;
				try {
					next = runWithMainThreadTask("worker:message-decode", () => receiveMessageOnPort(this.port));
				} catch (error) {
					this.fail(toErrorObject(error, "Native worker task channel observation failed"));
					return;
				}
				if (!next) return;
				observeWorkerMessage(next.message, "from_worker");
				this.callbacks.message(next.message);
			}
			if (this.disposed) return;
		}
	}
	service() {
		this.drain();
		if (this.disposed || this.failure) return;
		if (this.portClosed) {
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
			return;
		}
		let open;
		try {
			open = nativePortIsOpen(this.port);
		} catch (error) {
			this.fail(toErrorObject(error, "Native worker task channel observation failed"));
			return;
		}
		if (!open) {
			this.portClosed = true;
			this.fail(/* @__PURE__ */ new Error("Native worker task channel closed"));
		}
	}
	assertAvailable() {
		if (this.failure) throw this.failure;
		if (this.disposed || this.portClosed) throw new Error("Native worker task channel is closed");
	}
	postMessage(value, transferList) {
		this.assertAvailable();
		const bytes = workerMessagePayloadBytes(value);
		this.port.postMessage(value, [...transferList]);
		observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
	}
	close() {
		if (this.disposed) return;
		this.disposed = true;
		this.pending.length = 0;
		this.port.off("message", this.receive);
		this.port.off("messageerror", this.receiveError);
		this.port.off("close", this.closed);
		this.port.close();
	}
};
//#endregion
//#region src/infra/worker-request-kind.ts
const standaloneKinds = {
	"catalog-page.worker.js": "catalog",
	"code-mode.worker.js": "codeMode",
	"disk-budget.worker.js": "diskBudget",
	"document-extractor.worker.js": "document",
	"manager-index.worker.js": "memoryIndex",
	"manager-search.worker.js": "memorySearch",
	"memory-index.worker.js": "memoryIndex",
	"memory-search.worker.js": "memorySearch",
	"run.worker.js": "teamReports",
	"session-history.worker.js": "sessionHistory"
};
const kinds = new Map([...Object.entries(runtimeProcessEntrypoints).map(([kind, entry]) => [basename(entry.distWorkerPath), kind]), ...Object.entries(standaloneKinds)]);
/** SDK callers may supply their own workers; never publish arbitrary paths as labels. */
function workerRequestKind(url) {
	return kinds.get(basename(url.pathname).replace(/\.(?:ts|mjs)$/, ".js")) ?? "extension";
}
//#endregion
//#region src/infra/worker-native-handle.ts
var NativeWorker = class extends EventEmitter {
	constructor(runtime, id, filename, evalSource, ownsNativeResource, resourceConnection, taskPort) {
		super();
		this.runtime = runtime;
		this.id = id;
		this.filename = filename;
		this.evalSource = evalSource;
		this.ownsNativeResource = ownsNativeResource;
		this.resourceConnection = resourceConnection;
		this.runInContext = AsyncLocalStorage.snapshot();
		this.threadId = 0;
		this.started = false;
		this.executionStopped = false;
		this.referenced = true;
		this.stopping = false;
		this.joined = false;
		this.servicingResource = false;
		this.resourceClosed = false;
		this.supervisorJoined = false;
		this.terminalObserved = false;
		this.taskPortLossReported = false;
		this.requestId = 0;
		this.stopCompletion = createRetainedOperation(() => this.service());
		this.cpuRequests = /* @__PURE__ */ new Map();
		this.heapRequests = /* @__PURE__ */ new Map();
		this.diagnosticName = `worker:${!evalSource && filename instanceof URL ? workerRequestKind(filename) : "other"}`;
		if (taskPort) this.taskPort = new NativeWorkerTaskPort(taskPort, {
			message: (value) => this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => this.emit("message", value))),
			messageerror: (error) => this.runInContext(() => this.emit("messageerror", error)),
			unavailable: () => this.observeTaskPortLoss()
		});
	}
	get needsReference() {
		return this.referenced || this.stopping || this.executionStopped && this.ownsNativeResource && !this.joined || this.cpuRequests.size > 0 || this.heapRequests.size > 0;
	}
	service() {
		this.runtime.service();
	}
	serviceTaskPort() {
		const taskPort = this.taskPort;
		if (!taskPort) return;
		runWithMainThreadTask(this.diagnosticName, () => taskPort.service());
		this.observeTaskPortLoss();
	}
	observeTaskPortLoss() {
		const failure = this.taskPort?.failure;
		if (!failure || !this.started || !this.referenced || this.taskPortLossReported || this.terminalObserved || this.stopping || this.joined || this.executionStopped || this.runtime.failure) return;
		this.taskPortLossReported = true;
		this.runInContext(() => this.emit("error", failure));
	}
	serviceResource() {
		if (!this.resourceBinding || this.servicingResource || this.joined) return;
		this.servicingResource = true;
		try {
			this.resourceBinding.service();
		} catch (error) {
			this.resourceFailed(error);
		} finally {
			this.servicingResource = false;
		}
	}
	attachResource(descriptor) {
		this.resourceBinding = bindNativeWorkerResource({
			broker: this.runtime.resourceBroker(),
			descriptor,
			connection: this.resourceConnection,
			supervisorAvailable: () => !this.runtime.failure,
			postOwnerMessage: (value, sequence) => this.runtime.post({
				type: "resource-owner",
				id: this.id,
				sequence,
				value
			}),
			closed: () => this.runInContext(() => {
				this.resourceClosed = true;
				if (this.supervisorJoined) this.finishJoined(void 0);
			}),
			failed: (error) => this.resourceFailed(error)
		});
		return {
			workerDataKey: descriptor.workerDataKey,
			attachment: this.resourceBinding.attachment
		};
	}
	abandonResource() {
		this.taskPort?.close();
		if (this.resourceBinding) this.resourceBinding.abandonUnattached();
		else this.resourceConnection?.dispose();
	}
	resourceFailed(error) {
		this.runInContext(() => {
			this.stopCompletion.reject(error);
			this.emit("error", toErrorObject(error, "Native resource observation failed"));
		});
	}
	recoverResource() {
		if (!this.resourceBinding || this.joined || this.resourceRecovery) return;
		const recovery = this.resourceBinding.closeAfterSupervisor();
		this.resourceRecovery = recovery;
		recovery.then(() => this.runInContext(() => {
			this.finishJoined(void 0);
		}), (error) => this.runInContext(() => {
			this.stopping = false;
			this.stopCompletion.reject(error);
		}));
	}
	postMessage(value, transferList = []) {
		if (this.joined || this.stopping || this.executionStopped) throw new Error("Native worker is closing");
		if (this.runtime.failure) throw this.runtime.failure;
		if (this.taskPort) {
			this.taskPort.postMessage(value, transferList);
			return;
		}
		this.runtime.post({
			type: "post",
			id: this.id,
			value,
			transferList: [...transferList]
		}, transferList);
	}
	ref() {
		if (this.runtime.failure) throw this.runtime.failure;
		this.taskPort?.assertAvailable();
		if (!this.referenced) {
			this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: true
			});
			this.referenced = true;
		}
		this.runtime.refreshReference();
		return this;
	}
	unref() {
		const wasReferenced = this.referenced;
		this.referenced = false;
		if (!this.joined) {
			if (this.runtime.failure) throw this.runtime.failure;
			if (wasReferenced) this.runtime.post({
				type: "ref",
				id: this.id,
				referenced: false
			});
		}
		this.runtime.refreshReference();
		return this;
	}
	stop() {
		if (this.joined) {
			if (this.stopCompletion.operation.read().status !== "fulfilled") {
				this.stopCompletion = createRetainedOperation(() => this.service());
				this.stopCompletion.resolve();
			}
			return this.stopCompletion.operation;
		}
		if (this.stopCompletion.operation.read().status === "rejected") this.stopCompletion = createRetainedOperation(() => this.service());
		if (this.supervisorJoined && this.resourceBinding) {
			this.stopCompletion.reject(new Error("Native resource cleanup is still retained after supervisor loss", { cause: this.runtime.failure }));
			this.recoverResource();
			return this.stopCompletion.operation;
		}
		if (!this.stopping) {
			this.stopping = true;
			try {
				this.runtime.post({
					type: "stop",
					id: this.id
				});
			} catch (error) {
				this.stopping = false;
				this.stopCompletion.reject(error);
			}
			this.runtime.refreshReference();
		}
		return this.stopCompletion.operation;
	}
	terminate() {
		return this.stop().result;
	}
	cpuUsage(previous) {
		return this.requestSample(this.cpuRequests, {
			type: "cpu",
			previous
		});
	}
	getHeapStatistics() {
		return this.requestSample(this.heapRequests, { type: "heap" });
	}
	requestSample(requests, request) {
		if (this.joined) return Promise.reject(/* @__PURE__ */ new Error("Native worker exited"));
		const pending = createRetainedOperation(() => this.service());
		const requestId = ++this.requestId;
		requests.set(requestId, pending);
		try {
			this.runtime.post({
				...request,
				id: this.id,
				requestId
			});
		} catch (error) {
			requests.delete(requestId);
			pending.reject(error);
		}
		this.runtime.refreshReference();
		return pending.operation.result;
	}
	rejectSamples(error) {
		for (const pending of [...this.cpuRequests.values(), ...this.heapRequests.values()]) pending.reject(error);
		this.cpuRequests.clear();
		this.heapRequests.clear();
	}
	ownerFailed(error) {
		this.runInContext(() => {
			this.taskPort?.close();
			this.stopping = false;
			this.rejectSamples(error);
			this.stopCompletion.reject(error);
			this.emit("error", error);
		});
	}
	ownerJoined(error) {
		this.runInContext(() => {
			this.stopping = false;
			this.supervisorJoined = true;
			this.rejectSamples(error);
			this.finishExecution(void 0);
			if (this.ownsNativeResource) {
				if (this.resourceClosed) {
					this.finishJoined(void 0);
					return;
				}
				this.stopCompletion.reject(new Error("Native resource cleanup outcome is unavailable after owner loss", { cause: error }));
				this.recoverResource();
				return;
			}
			this.finishJoined(void 0);
		});
	}
	finishJoined(code) {
		if (this.joined) return;
		this.joined = true;
		this.taskPort?.close();
		this.threadId = -1;
		this.stopping = false;
		this.referenced = false;
		this.rejectSamples(/* @__PURE__ */ new Error("Native worker exited"));
		this.stopCompletion.resolve();
		this.runtime.handles.delete(this.id);
		if (!this.runtime.failure) this.runtime.post({
			type: "release",
			id: this.id
		});
		this.runtime.refreshReference();
		if (this.resourceBinding) this.resourceBinding.release();
		else this.resourceConnection?.dispose();
		this.finishExecution(code);
		this.emit("exit", code);
	}
	finishExecution(code) {
		if (!this.executionStopped) {
			this.taskPort?.close();
			this.executionStopped = true;
			this.emit("execution-exit", code);
		}
	}
	receive(reply) {
		this.runInContext(() => runWithMainThreadTask(this.diagnosticName, () => {
			if (reply.type === "error" || reply.type === "messageerror" || reply.type === "create-error" || reply.type === "execution-exit" || reply.type === "stopped" || reply.type === "stop-error") {
				this.terminalObserved = true;
				this.taskPort?.drain();
			}
			this.receiveOwned(reply);
		}));
	}
	receiveOwned(reply) {
		if (reply.type === "created") {
			this.started = true;
			this.threadId = reply.threadId;
			trackNativeWorkerForCpu(this, this.filename, this.evalSource);
			this.taskPort?.start();
			this.emit("started");
			this.taskPort?.drain();
			this.observeTaskPortLoss();
		} else if (reply.type === "message") this.emit("message", reply.value);
		else if (reply.type === "resource-message") this.resourceBinding?.receive(reply.response);
		else if (reply.type === "error" || reply.type === "messageerror") this.emit(reply.type, toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker failed"));
		else if (reply.type === "create-error") {
			this.joined = true;
			this.threadId = -1;
			this.referenced = false;
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker creation failed");
			this.rejectSamples(error);
			this.stopCompletion.resolve();
			this.runtime.handles.delete(this.id);
			this.runtime.refreshReference();
			this.abandonResource();
			this.emit("error", error);
		} else if (reply.type === "stopped") this.finishJoined(reply.code);
		else if (reply.type === "execution-exit") this.finishExecution(reply.code);
		else if (reply.type === "stop-error") {
			const requestedStop = this.stopping;
			this.stopping = false;
			let error;
			try {
				if (reply.resourceError) {
					if (!this.resourceConnection?.decodeCloseError) throw new Error("Native resource cleanup error decoder is unavailable", { cause: reply.error });
					error = this.resourceConnection.decodeCloseError(reply.error);
				} else error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker stop failed");
			} catch (decodeError) {
				error = toErrorObject(decodeError, "Native resource cleanup error decoding failed");
			}
			this.stopCompletion.reject(error);
			if (!requestedStop) this.emit("error", error);
		} else if (reply.type === "cpu") {
			this.cpuRequests.get(reply.requestId)?.resolve(reply.value);
			this.cpuRequests.delete(reply.requestId);
		} else if (reply.type === "heap") {
			this.heapRequests.get(reply.requestId)?.resolve(reply.value);
			this.heapRequests.delete(reply.requestId);
		} else if (reply.type === "request-error") {
			const error = toErrorObject(decodeNativeWorkerFailure(reply.error), "Native worker observation failed");
			this.cpuRequests.get(reply.requestId)?.reject(error);
			this.heapRequests.get(reply.requestId)?.reject(error);
			this.cpuRequests.delete(reply.requestId);
			this.heapRequests.delete(reply.requestId);
		}
		this.runtime.refreshReference();
	}
};
//#endregion
//#region src/infra/worker-native-lifecycle.ts
const lifetime = resolveGlobalSingleton(Symbol.for("openclaw.nativeWorkerLifetimes"), () => ({
	nextId: 0,
	sources: /* @__PURE__ */ new WeakMap()
}), closeDefaultRetainedNativeWorkerSource);
/** Terminal process cleanup joins the existing unbound owner without starting another. */
async function closeDefaultRetainedNativeWorkerSource() {
	await lifetime.defaultSource?.close();
}
function forgetNativeSource(source) {
	if (source.runtimeGeneration) {
		if (lifetime.sources.get(source.runtimeGeneration) === source) lifetime.sources.delete(source.runtimeGeneration);
	} else if (lifetime.defaultSource === source) lifetime.defaultSource = void 0;
}
function nativeCleanupFailures(results) {
	return results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
}
function nativeRuntime(source) {
	if (source.closing) throw new Error("Native worker source is closing");
	const existing = source.runtime;
	if (existing) {
		if (existing.failure) throw existing.failure;
		return existing;
	}
	return runInDetachedAsyncContext(() => {
		const { port1, port2 } = new MessageChannel();
		const url = source.moduleUrl;
		let worker;
		try {
			worker = createCpuTrackedWorker(url, {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				env: SHARE_ENV,
				workerData: { port: port2 },
				transferList: [port2]
			});
		} catch (error) {
			port1.close();
			port2.close();
			throw error;
		}
		const handles = /* @__PURE__ */ new Map();
		const ownerJoined = createDeferredCore();
		ownerJoined.promise.catch(() => void 0);
		let terminating = false;
		const terminateOwner = () => {
			if (terminating) return;
			terminating = true;
			worker.ref();
			port1.ref();
			try {
				worker.terminate().catch(ownerJoined.reject);
			} catch (error) {
				ownerJoined.reject(error);
			}
		};
		const receive = (reply) => {
			observeWorkerMessage(reply, "from_worker", "lifecycle");
			handles.get(reply.id)?.receive(reply);
		};
		const runtime = {
			handles,
			service() {
				for (;;) {
					const next = runWithMainThreadTask("worker:control-decode", () => receiveMessageOnPort(port1));
					if (!next) break;
					receive(next.message);
				}
				const resourceHandles = [...handles.values()];
				for (const handle of resourceHandles) {
					handle.serviceTaskPort();
					handle.serviceResource();
				}
				if (runtime.failure) return;
				let channelOpen;
				try {
					channelOpen = nativePortIsOpen(port1);
				} catch (error) {
					fail(new Error("Native worker lifetime channel observation failed", { cause: error }));
					terminateOwner();
					return;
				}
				if (!channelOpen) {
					fail(/* @__PURE__ */ new Error("Native worker lifetime channel closed"));
					terminateOwner();
					return;
				}
				source.broker?.serviceNativeResources();
			},
			post(message, transfers = []) {
				if (runtime.failure) throw runtime.failure;
				const bytes = workerMessagePayloadBytes(message);
				port1.postMessage(message, [...transfers]);
				observeWorkerMessage(message, "to_worker", "lifecycle", bytes ?? null);
			},
			resourceBroker() {
				return source.broker ??= runInDetachedAsyncContext(() => createSpawnBrokerHost({
					nativeResources: true,
					workerUrl: source.brokerModuleUrl
				}));
			},
			refreshReference() {
				if ([...handles.values()].some((handle) => handle.needsReference)) {
					worker.ref();
					port1.ref();
				} else {
					worker.unref();
					port1.unref();
				}
			},
			close() {
				if (handles.size) return Promise.reject(/* @__PURE__ */ new Error("Native worker execution owners have not joined"));
				runtime.failure ??= /* @__PURE__ */ new Error("Native worker lifetime owner is closing");
				terminateOwner();
				return ownerJoined.promise;
			}
		};
		const fail = (error) => {
			if (runtime.failure) return;
			runtime.failure = toErrorObject(error, "Native worker lifetime owner failed");
			for (const handle of handles.values()) handle.ownerFailed(runtime.failure);
		};
		port1.on("message", receive);
		port1.on("messageerror", (error) => {
			try {
				fail(error);
			} finally {
				terminateOwner();
			}
		});
		worker.on("message", (message) => receiveWorkerMemoryPort(worker, message));
		worker.on("error", fail);
		worker.once("exit", () => {
			setImmediate(() => {
				const error = runtime.failure ?? /* @__PURE__ */ new Error("Native worker lifetime owner exited");
				runtime.failure = error;
				source.closing = true;
				for (const handle of handles.values()) handle.ownerJoined(error);
				port1.close();
				ownerJoined.resolve();
			});
		});
		source.runtime = runtime;
		runtime.refreshReference();
		return runtime;
	});
}
/** Capture before queues; explicit undefined preserves an intentionally unbound lifetime. */
function captureRetainedNativeWorkerSource(options) {
	const supervisor = resolveRuntimeProcessEntrypointUrl("workerNativeLifecycle");
	const captured = options === void 0 ? captureRuntimeWorkerSource(supervisor) : {
		moduleUrl: options.runtimeGeneration ? options.runtimeGeneration.resolve(supervisor) : supervisor,
		runtimeGeneration: options.runtimeGeneration
	};
	const existing = captured.runtimeGeneration ? lifetime.sources.get(captured.runtimeGeneration) : lifetime.defaultSource;
	if (existing) return existing;
	const source = {
		...captured,
		brokerModuleUrl: captured.runtimeGeneration ? captured.runtimeGeneration.resolve(resolveRuntimeProcessEntrypointUrl("spawnBroker")) : resolveRuntimeProcessEntrypointUrl("spawnBroker"),
		closing: false,
		get hasActiveWorkers() {
			return Boolean(source.runtime?.handles.size);
		},
		async retireIdleBroker() {
			await source.brokerClose;
			if (source.hasActiveWorkers) return false;
			const broker = source.broker;
			source.broker = void 0;
			await (source.brokerClose = broker?.close());
			source.brokerClose = void 0;
			return true;
		},
		close() {
			return closingOwners ??= Promise.resolve().then(async () => {
				const errors = nativeCleanupFailures(await Promise.allSettled([...owners.values()].map((close) => close())));
				if (errors.length) throw new AggregateError(errors, "Native worker execution owner cleanup failed");
				source.closing = true;
				await source.runtime?.close();
				await source.brokerClose;
				await source.broker?.close();
				forgetNativeSource(source);
				owners.clear();
			});
		},
		create(filename, workerOptions, resource, taskPorts) {
			try {
				return startNativeWorker(nativeRuntime(source), filename, workerOptions ?? {}, resource, taskPorts);
			} catch (error) {
				taskPorts?.host.close();
				taskPorts?.worker.close();
				throw error;
			}
		},
		captureResource(moduleUrl, workerDataKey, input, connect) {
			const inContext = AsyncLocalStorage.snapshot();
			return Object.freeze({
				moduleUrl: String(captured.runtimeGeneration?.resolve(moduleUrl) ?? moduleUrl),
				workerDataKey,
				input: input === void 0 ? void 0 : structuredClone(input),
				connect: connect ? () => inContext(() => {
					const connection = connect();
					const decode = connection.decodeCloseError?.bind(connection);
					return {
						port: connection.port,
						service: () => inContext(() => connection.service()),
						dispose: () => inContext(() => connection.dispose()),
						decodeCloseError: decode ? (payload) => inContext(() => decode(payload)) : void 0
					};
				}) : void 0
			});
		},
		retain(owner, closeOwner) {
			owners.set(owner, closeOwner);
			captured.runtimeGeneration?.retain(source, () => source.close());
		}
	};
	const owners = /* @__PURE__ */ new Map();
	let closingOwners;
	if (captured.runtimeGeneration) lifetime.sources.set(captured.runtimeGeneration, source);
	else lifetime.defaultSource = source;
	return source;
}
/** Existing execution owners retain their queues; this capability owns only physical Worker lifetime. */
function createRetainedNativeWorker(filename, options = {}, source, resource, taskPorts) {
	try {
		return (source ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 })).create(filename, options, resource, taskPorts);
	} catch (error) {
		taskPorts?.host.close();
		taskPorts?.worker.close();
		throw error;
	}
}
function startNativeWorker(runtime, filename, options, resource, taskPorts) {
	const id = ++lifetime.nextId;
	let resourceConnection;
	let handle;
	try {
		resourceConnection = resource?.connect?.();
		handle = new NativeWorker(runtime, id, filename, options.eval === true, resource !== void 0, resourceConnection, taskPorts?.host);
		const { env, transferList = [], ...captured } = options;
		runtime.handles.set(id, handle);
		const retainedResource = resource ? handle.attachResource(resource) : void 0;
		runtime.post({
			type: "create",
			id,
			filename: {
				kind: filename instanceof URL ? "url" : "path",
				value: String(filename)
			},
			environmentData: captureSqliteWorkerEnvironmentData(),
			options: {
				...captured,
				environment: { ...env === SHARE_ENV ? process.env : env ?? process.env },
				shareEnvironment: env === SHARE_ENV
			},
			transferList: [...transferList],
			resource: retainedResource,
			taskPort: taskPorts?.worker
		}, taskPorts ? [...transferList, taskPorts.worker] : transferList);
	} catch (error) {
		runtime.handles.delete(id);
		runtime.refreshReference();
		if (handle) handle.abandonResource();
		else {
			taskPorts?.host.close();
			resourceConnection?.dispose();
		}
		taskPorts?.worker.close();
		throw error;
	}
	runtime.refreshReference();
	return handle;
}
const DEFAULT_WORKER_PENDING_BYTES = 268435456;
/** Shared compute admission; database and generation workers keep their own ordering. */
function createWorkerComputeCapacity(limit) {
	if (!Number.isSafeInteger(limit) || limit < 1) throw new RangeError("compute capacity must be a positive safe integer");
	const active = /* @__PURE__ */ new Set();
	const waiting = /* @__PURE__ */ new Set();
	let pendingTasks = 0;
	let pendingBytes = 0;
	let draining = false;
	const requestCheckpoints = () => {
		let demand = waiting.size;
		if (demand) {
			for (const permit of active) if (permit.requestCheckpoint() && --demand === 0) break;
		}
	};
	const drain = () => {
		if (draining) return;
		draining = true;
		try {
			while (active.size < limit && waiting.size) {
				const next = waiting.values().next().value;
				waiting.delete(next);
				next();
			}
		} finally {
			draining = false;
		}
		requestCheckpoints();
	};
	return {
		getSnapshot: () => ({
			limit,
			active: active.size,
			waitingPools: waiting.size,
			pendingTasks,
			pendingBytes
		}),
		admit(bytes) {
			if (pendingTasks >= 128 || pendingBytes + bytes > 268435456) return false;
			pendingTasks++;
			pendingBytes += bytes;
			return true;
		},
		finish(bytes) {
			pendingTasks--;
			pendingBytes -= bytes;
		},
		acquire(resume, requestCheckpoint) {
			if (active.size >= limit || !draining && waiting.size) {
				waiting.add(resume);
				requestCheckpoints();
				return;
			}
			const permit = { requestCheckpoint };
			active.add(permit);
			return permit;
		},
		release(permit) {
			active.delete(permit);
			drain();
		},
		remove(resume) {
			waiting.delete(resume);
		},
		requestCheckpoints
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-context.ts
function captureWorkerTaskContext() {
	const context = new AsyncResource("OpenClaw.WorkerTask");
	return (operation) => context.runInAsyncScope(operation);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-error.ts
var WorkerTaskError = class extends Error {
	constructor(message, code, options) {
		super(message, options);
		this.code = code;
		this.name = "WorkerTaskError";
	}
};
function workerTaskTimeoutError(exchange, workerUrl) {
	let callback = exchange?.sent === false ? exchange.name : void 0;
	if (callback === "unknown") callback = workerUrl.protocol === "file:" ? workerUrl.pathname.split("/").at(-1)?.slice(0, 96) || "worker" : `${workerUrl.protocol} worker`;
	const error = new WorkerTaskError(callback ? `worker task timed out waiting for host callback ${callback}` : "worker task timed out", "timeout");
	if (callback) process.emitWarning(error.message, { code: "WORKER_HOST_CALLBACK_TIMEOUT" });
	return error;
}
function workerTaskUnavailableError(slot, message, cause) {
	const task = slot.task;
	const stage = slot.ready === false ? "startup" : task?.exchange ? "exchange" : "running";
	return new WorkerTaskError(message + (task?.diagnosticLabel ? ` [task=${task.diagnosticLabel} admittedInputBytes=${task.inputBytes} exchanges=${task.exchangeSequence} stage=${stage}]` : ""), "unavailable", { cause });
}
//#endregion
//#region packages/worker-runtime/src/worker-task-host.ts
/** Capture before callbacks so nested servicing advances a fresh set of owners. */
function serviceNativeWorkerPass(host, slots) {
	const workers = [];
	for (const slot of slots) if (slot.native) workers.push(slot.native);
	host.serviceNativeWorkers(workers);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-native-sections.ts
const CANCELLED = 1;
const SECTION = 2;
const nativeSectionKey = Symbol.for("openclaw.workerTaskNativeSection");
const nativeSectionStore = globalThis;
nativeSectionStore[nativeSectionKey] ??= new AsyncLocalStorage();
function createWorkerNativeSectionState() {
	return new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
}
function cancelWorkerNativeSections(state) {
	Atomics.or(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
function waitForWorkerNativeSections(state) {
	if (areWorkerNativeSectionsSettled(state)) return;
	return (async () => {
		for (;;) {
			const observed = Atomics.load(state, 0);
			if (observed < SECTION) return;
			await Atomics.waitAsync(state, 0, observed).value;
		}
	})();
}
/** Cancellation must close admission before this fact permits native termination. */
function areWorkerNativeSectionsSettled(state) {
	return Atomics.load(state, 0) < SECTION;
}
function releaseWorkerNativeSectionsOnExit(state) {
	Atomics.store(state, 0, CANCELLED);
	Atomics.notify(state, 0);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-bootstrap.ts
/** A failed bootstrap stops new construction until its generation is rotated. */
function createWorkerTaskPoolBootstrap(slots, queue, reject) {
	let failure;
	const admissionError = () => failure && ![...slots].some((slot) => slot.ready === true && !slot.retiring && !slot.retirementFailed) ? failure : void 0;
	const rejectQueued = () => {
		const error = admissionError();
		if (!error) return;
		const queued = queue.splice(0);
		for (const task of queued) reject(task, error);
	};
	return {
		error: () => failure,
		get admissionError() {
			return admissionError();
		},
		fail(error) {
			failure ??= error;
			rejectQueued();
		},
		rejectQueued,
		reset: () => {
			failure = void 0;
		}
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-owned.ts
function createWorkerHostExchange(task, request) {
	const name = isRecord(request) ? request.kind ?? request.type : request;
	return task.exchange = {
		id: ++task.exchangeSequence,
		name: typeof name === "string" && /^[a-zA-Z][a-zA-Z0-9._:-]{0,95}$/.test(name) ? name : "unknown",
		pressure: new AbortController(),
		sent: false,
		onConsumed: void 0
	};
}
function dispatchOwnedWorkerRequest(task, slot, value, exchange, owner) {
	const context = {
		signal: (task.controller ??= new AbortController()).signal,
		yieldSignal: exchange.pressure.signal
	};
	const assertCurrent = () => {
		if (task.done || slot.task !== task) throw owner.closedError();
	};
	if (task.options.onRequestSync) {
		try {
			assertCurrent();
			owner.accept(task.options.onRequestSync(value, context));
		} catch (error) {
			owner.reject(error);
		}
		return;
	}
	Promise.resolve().then(() => {
		assertCurrent();
		return task.options.onRequest(value, context);
	}).then(owner.accept).catch(owner.reject);
}
async function joinOwnedWorkerTasks(closures) {
	const errors = (await Promise.allSettled(closures)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "Worker task cleanup failed");
}
function joinOwnedWorkerTask(task, settlement, retire = false) {
	return startJoinOwnedWorkerTask(task, settlement, retire).result;
}
function startJoinOwnedWorkerTask(task, settlement, retire = false) {
	const closing = startCloseOwnedWorkerTask(task, settlement, retire);
	const observe = () => {
		const outcome = closing.read();
		if (outcome.status === "pending") return outcome;
		if (outcome.status === "rejected" && task.owner?.closing === closing) task.owner.closing = void 0;
		if (task.owner?.closed) {
			const slot = task.slot;
			task.slot = void 0;
			settlement.release(task, slot);
		}
		return outcome;
	};
	const result = closing.result.then(() => {
		observe();
	}, (error) => {
		observe();
		throw error;
	});
	result.catch(() => void 0);
	return {
		result,
		read: observe,
		service() {
			closing.service();
			observe();
		}
	};
}
function closeOwnedWorkerTask(task, settlement, retire = false) {
	return startCloseOwnedWorkerTask(task, settlement, retire).result;
}
function startCloseOwnedWorkerTask(task, settlement, retire = false) {
	const owner = task.owner;
	if (!owner || owner.closed) {
		if (owner?.closing) return owner.closing;
		const complete = createRetainedOperation(() => {});
		complete.resolve();
		return complete.operation;
	}
	owner.retire ||= retire;
	if (owner.closing) return owner.closing;
	let retirement;
	let observedPreparation;
	let advancing = false;
	const closing = createRetainedOperation(() => {
		retirement?.service();
		advance();
	});
	const advance = () => {
		if (advancing || closing.operation.read().status !== "pending") return;
		advancing = true;
		try {
			if (task.preparation) {
				if (observedPreparation !== task.preparation.promise) {
					observedPreparation = task.preparation.promise;
					observedPreparation.then(advance, closing.reject);
				}
				return;
			}
			const slot = task.slot;
			if (slot && owner.retire) {
				if (!retirement) {
					retirement = settlement.retire(slot);
					retirement.result.then(advance, advance);
				}
				const outcome = retirement.read();
				if (outcome.status === "pending") return;
				if (outcome.status === "rejected") throw outcome.error;
			}
			settlement.detach(task);
			try {
				owner.complete?.();
			} finally {
				owner.closed = true;
				owner.complete = void 0;
				task.input = void 0;
				task.options = {};
				task.abort = () => {};
			}
			closing.resolve();
		} catch (error) {
			closing.reject(error);
		} finally {
			advancing = false;
		}
	};
	owner.closing = closing.operation;
	if (!task.done) settlement.cancel(task);
	advance();
	return closing.operation;
}
function retainWorkerTask(task, settlement, service) {
	return {
		result: task.promise,
		read: () => task.read(),
		service,
		release: (closeOptions) => {
			const closing = startJoinOwnedWorkerTask(task, settlement, closeOptions?.retire === true);
			return {
				result: closing.result,
				read: () => closing.read(),
				service: () => {
					service();
					closing.service();
				}
			};
		}
	};
}
function prepareWorkerTaskInput(task, receive, reject, prepareResources) {
	const taskInput = task.input;
	delete task.input;
	const preparation = Promise.withResolvers();
	task.preparation = preparation;
	const finishPreparation = () => {
		preparation.resolve();
		if (task.preparation === preparation) task.preparation = void 0;
	};
	const failed = (error) => {
		finishPreparation();
		reject(error);
	};
	let prepared;
	try {
		prepared = typeof taskInput === "function" ? taskInput() : taskInput;
	} catch (error) {
		failed(error);
		return;
	}
	if (prepareResources) prepared = Promise.resolve(prepared).then(async (input) => {
		await prepareResources();
		return input;
	});
	const ready = (input) => {
		finishPreparation();
		receive(input);
	};
	if (isPromiseLike(prepared)) Promise.resolve(prepared).then(ready, failed);
	else ready(prepared);
}
function armWorkerTaskTimeout(task, timeoutMs, onTimeout) {
	clearTimeout(task.timer);
	const now = performance.now();
	task.deadline = Math.min(task.options.hostTimeout !== "owner" && task.options.timeoutMs !== void 0 ? task.deadline ?? task.enqueuedAt + resolveTimerTimeoutMs(task.options.timeoutMs, 6e4) : Infinity, now + resolveTimerTimeoutMs(timeoutMs, 6e4));
	task.timer = setTimeout(onTimeout, Math.max(0, task.deadline - now));
}
function expireWorkerTasks(queue, slots, expire) {
	const now = performance.now();
	const pending = [...queue, ...[...slots].flatMap((slot) => slot.task ? [slot.task] : [])];
	for (const task of pending) if (!task.done && task.deadline !== void 0 && now >= task.deadline) expire(task);
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-completion.ts
const taskDiagnostics = channel("openclaw.worker.task");
function joinWorkerTaskPreparationCleanups(completion, artifactCleanup) {
	return joinOwnedWorkerTasks([...[...completion.preparationCleanups].map(([task, cleanup]) => cleanup.finally(() => {
		if (completion.preparationCleanups.delete(task)) completion.releaseAdmission(task);
	})), artifactCleanup.then(() => void 0)]);
}
function notifyExecutionSettled(task) {
	try {
		if (!task.executionNotified) {
			task.executionNotified = true;
			task.options.onExecutionSettled?.({ retired: task.slot?.retired === true });
		}
	} catch (error) {
		return toErrorObject(error, "worker settlement receipt failed");
	}
}
function createWorkerTaskCompletion(task, completion, error, value) {
	const preparation = task.owner ? void 0 : task.preparation;
	let settlementError;
	const complete = () => {
		if (!task.owner && !preparation) completion.releaseAdmission(task);
		return completeWorkerTask(task, completion, error, value, settlementError);
	};
	if (!preparation) return complete;
	const cleanup = Promise.withResolvers();
	completion.preparationCleanups.set(task, cleanup.promise);
	cleanup.promise.catch(() => void 0);
	return () => {
		settlementError = task.runInContext(() => notifyExecutionSettled(task));
		if (error) task.reject(error);
		preparation.promise.then(() => {
			const failure = complete();
			if (failure) throw failure;
			completion.preparationCleanups.delete(task);
			completion.releaseAdmission(task);
			cleanup.resolve();
		}).catch(cleanup.reject);
	};
}
function completeWorkerTask(task, completion, error, value, settlementError) {
	return task.runInContext(() => {
		let completionError = error ?? settlementError;
		const cleanupErrors = settlementError ? [settlementError] : [];
		try {
			if (!task.inputConsumed) {
				task.inputConsumed = true;
				task.options.onInputConsumed?.();
			}
			const release = task.exchange?.onConsumed;
			task.exchange = void 0;
			release?.();
		} catch (releaseError) {
			const cleanupError = toErrorObject(releaseError, "worker input release failed");
			cleanupErrors.push(cleanupError);
			completionError ??= cleanupError;
		}
		const receiptError = notifyExecutionSettled(task);
		if (receiptError) {
			cleanupErrors.push(receiptError);
			completionError ??= receiptError;
		}
		const permit = task.computePermit;
		task.computePermit = void 0;
		if (permit) completion.releaseCompute(permit);
		if (taskDiagnostics.hasSubscribers) {
			const now = performance.now();
			taskDiagnostics.publish({
				...completion.diagnostics(),
				outcome: completionError ? "failed" : "ok",
				queueMs: (task.startedAt ?? now) - task.enqueuedAt,
				preparationMs: task.startedAt === void 0 ? 0 : (task.preparedAt ?? now) - task.startedAt,
				runMs: task.preparedAt === void 0 ? 0 : now - task.preparedAt,
				transferMs: task.transferMs,
				hostWaitMs: task.hostWaitMs
			});
		}
		const firstCleanupError = cleanupErrors[0];
		const cleanupError = cleanupErrors.length > 1 ? new AggregateError(cleanupErrors, "Worker task cleanup failed", { cause: firstCleanupError }) : firstCleanupError;
		if (task.owner) {
			if (cleanupError) throw cleanupError;
		} else if (completionError) task.reject(completionError);
		else task.resolve(value);
		return cleanupError;
	});
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-resources.ts
/** Each existing slot retains its cleanup receipt; no result Promise controls custody. */
function startCloseWorkerPoolResources(slots, resourceClosures, retire, key, options, observeReply) {
	const operations = [...slots].map((slot) => {
		if (slot.retiring) return slot.retiring;
		if (slot.native?.executionStopped) return retire(slot);
		const worker = slot.worker;
		if (!worker) {
			const complete = createRetainedOperation(() => {});
			complete.resolve();
			return complete.operation;
		}
		const closure = resourceClosures.get(worker) ?? { pending: 0 };
		closure.pending++;
		resourceClosures.set(worker, closure);
		worker.ref();
		return startCloseWorkerTaskResources(slot, worker, closure, key, options, retire, observeReply);
	});
	const completion = createRetainedOperation(() => {
		for (const operation of operations) operation.service();
		advance();
	});
	const advance = () => {
		const outcomes = operations.map((operation) => operation.read());
		if (outcomes.some((outcome) => outcome.status === "pending")) return;
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [outcome.error] : []);
		if (errors.length) completion.reject(new AggregateError(errors, "Worker resource cleanup failed"));
		else completion.resolve();
	};
	for (const operation of operations) operation.result.then(advance, advance);
	advance();
	return completion.operation;
}
/** Concurrent resource closes share one listener until their last real receipt. */
function observeResourceWorkerExit(worker, closures, finish) {
	let exit = closures.exit;
	if (!exit) {
		const waiters = /* @__PURE__ */ new Set();
		exit = {
			waiters,
			receive: () => {
				for (const waiter of waiters) waiter();
			}
		};
		closures.exit = exit;
		worker.once("exit", exit.receive);
	}
	exit.waiters.add(finish);
	return () => {
		exit.waiters.delete(finish);
		if (!exit.waiters.size) {
			worker.removeListener("exit", exit.receive);
			if (closures.exit === exit) closures.exit = void 0;
		}
	};
}
function startCloseWorkerTaskResources(slot, worker, closures, key, options, retire, observeReply) {
	const { port1, port2 } = new MessageChannel();
	const runInContext = AsyncLocalStorage.snapshot();
	let settled = false;
	let awaitingRetirement = false;
	let selectedRetirement;
	const completion = createRetainedOperation(() => {
		if (settled) return;
		slot.native?.service();
		if (slot.native?.executionStopped) {
			awaitingRetirement = true;
			selectedRetirement ??= slot.retiring ?? retire(slot);
		}
		for (;;) {
			const next = receiveMessageOnPort(port1);
			if (!next || settled) break;
			receive(next.message);
		}
		const retirement = selectedRetirement ?? slot.retiring;
		if (awaitingRetirement && retirement) {
			retirement.service();
			const stopped = retirement.read();
			if (stopped.status === "fulfilled") finish();
			else if (stopped.status === "rejected") finish(toErrorObject(stopped.error, "Worker resource cleanup retirement failed"));
		}
	});
	const finish = (error) => runInContext(() => {
		if (settled) return;
		settled = true;
		stopObservingExit();
		port1.close();
		port2.close();
		closures.pending--;
		if (!closures.pending && !slot.task && !slot.retiring) worker.unref();
		if (error) completion.reject(error);
		else completion.resolve();
	});
	const receive = (reply) => {
		observeReply?.();
		try {
			if (isRecord(reply) && reply.ok === true) {
				finish();
				return;
			}
			const error = isRecord(reply) && reply.detail !== void 0 && options?.decodeResourceError ? options.decodeResourceError(reply.detail) : new Error(isRecord(reply) && typeof reply.error === "string" ? reply.error : "Invalid worker resource cleanup receipt");
			finish(error);
		} catch (error) {
			finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded"));
		}
	};
	const stopObservingExit = observeResourceWorkerExit(worker, closures, () => finish());
	port1.once("message", receive);
	port1.once("messageerror", (error) => finish(toErrorObject(error, "Worker resource cleanup receipt could not be decoded")));
	port1.once("close", () => {
		if (settled) return;
		const retirement = slot.retiring;
		if (!retirement) {
			finish(/* @__PURE__ */ new Error("Worker resource cleanup closed without a receipt"));
			return;
		}
		awaitingRetirement = true;
		selectedRetirement = retirement;
		retirement.result.then(() => finish(), (error) => finish(toErrorObject(error, "Worker resource cleanup retirement failed")));
	});
	try {
		worker.postMessage({
			closeResource: true,
			key,
			resourcePort: port2
		}, [port2]);
	} catch (error) {
		finish(toErrorObject(error, "Worker resource cleanup could not be sent"));
	}
	return completion.operation;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-retirement.ts
const WORKER_WARM_WINDOW_MS = 3e5;
function createWorkerTaskPoolRetirement({ slots, options, runInContext, dispatch, onRotationComplete, serviceDeadlines, markWorkerRetirement, serviceHost }) {
	const artifactCleanups = /* @__PURE__ */ new Map();
	let lastIdleRetirementAt = -Infinity;
	let warmSlot;
	let rotation;
	let rotationFailed = false;
	const setTimeoutFn = setTimeout;
	const clearTimeoutFn = clearTimeout;
	const now = performance.now.bind(performance);
	const clearIdle = (slot) => clearTimeoutFn(slot.idleTimer);
	const isBurstSlot = (slot) => {
		if (options.burstIdleTimeoutMs !== void 0) {
			for (const available of slots) if (!available.retiring && !available.retirementFailed) return available !== slot;
		}
		return false;
	};
	function startRotate() {
		if (rotation) return rotation;
		const runRotation = AsyncLocalStorage.snapshot();
		let retirements;
		let artifacts;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			serviceNativeWorkerPass(serviceHost, rotationSlots);
			serviceDeadlines();
			for (const retiring of retirements ?? []) retiring.service();
			artifacts?.service();
			advance();
		});
		rotation = completion.operation;
		rotationFailed = false;
		const rotationSlots = [...slots];
		const tasks = rotationSlots.flatMap((slot) => slot.task ? [slot.task] : []);
		const advance = () => runRotation(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (tasks.some((task) => task.read().status === "pending")) return;
				if (!retirements) {
					retirements = rotationSlots.map((slot) => startRetire(slot, "rotation"));
					for (const retiring of retirements) retiring.result.then(advance, advance);
				}
				for (const retiring of retirements) {
					const stopped = retiring.read();
					if (stopped.status === "rejected") throw stopped.error;
					if (stopped.status === "pending") return;
				}
				if (!artifacts) {
					artifacts = startJoinArtifacts();
					artifacts.result.then(advance, advance);
				}
				const cleaned = artifacts.read();
				if (cleaned.status === "pending") return;
				if (cleaned.status === "rejected") throw cleaned.error;
				rotation = void 0;
				onRotationComplete();
				completion.resolve();
				dispatch();
			} catch (error) {
				rotation = void 0;
				rotationFailed = true;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		for (const task of tasks) task.promise.then(advance, advance);
		advance();
		return completion.operation;
	}
	function startRetire(slot, reason = "closed") {
		if (reason === "idle_timeout" && !isBurstSlot(slot)) lastIdleRetirementAt = now();
		else if (reason === "rotation") lastIdleRetirementAt = -Infinity;
		if (warmSlot === slot) warmSlot = void 0;
		if (slot.worker) markWorkerRetirement(slot.worker, reason);
		clearIdle(slot);
		cancelWorkerNativeSections(slot.nativeSections);
		if (slot.retiring) return slot.retiring;
		const runRetirement = AsyncLocalStorage.snapshot();
		let nativeStop;
		let observingSection = false;
		let advancing = false;
		const completion = createRetainedOperation(() => {
			nativeStop?.service();
			advance();
		});
		const advance = () => runRetirement(() => {
			if (advancing || completion.operation.read().status !== "pending") return;
			advancing = true;
			try {
				if (slot.creating) return;
				if (!areWorkerNativeSectionsSettled(slot.nativeSections)) {
					if (!observingSection) {
						observingSection = true;
						Promise.resolve(waitForWorkerNativeSections(slot.nativeSections)).then(advance, completion.reject);
					}
					return;
				}
				if (slot.worker && !nativeStop) {
					markWorkerRetirement(slot.worker, reason);
					if (slot.native) nativeStop = slot.native.stop();
					else {
						const stopped = createRetainedOperation(() => {});
						nativeStop = stopped.operation;
						Promise.resolve().then(() => slot.worker.terminate()).then(() => stopped.resolve(), stopped.reject);
					}
					nativeStop.result.then(advance, advance);
				}
				const stopped = nativeStop?.read();
				if (stopped?.status === "pending") return;
				if (stopped?.status === "rejected") throw stopped.error;
				slot.retired = true;
				const releaseResources = slot.releaseResources;
				if (releaseResources) runInContext(() => {
					const cleanup = (async () => {
						try {
							await releaseResources();
						} catch (error) {
							try {
								process.emitWarning(`Worker task resource release failed: ${String(error)}`);
							} catch {}
						}
					})();
					const settled = createRetainedOperation(() => {});
					artifactCleanups.set(cleanup, settled.operation);
					cleanup.then(() => {
						artifactCleanups.delete(cleanup);
						settled.resolve();
					}, settled.reject);
				});
				slot.worker?.removeAllListeners();
				slots.delete(slot);
				for (const complete of slot.completions ?? []) complete();
				slot.completions = void 0;
				dispatch();
				completion.resolve();
			} catch (error) {
				try {
					Promise.resolve(options.onRetirementFailure?.(error)).catch(() => void 0);
				} catch {}
				slot.retirementFailed = true;
				slot.retiring = void 0;
				completion.reject(error);
			} finally {
				advancing = false;
			}
		});
		slot.retiring = completion.operation;
		Promise.resolve().then(advance);
		return completion.operation;
	}
	function retire(slot, reason) {
		return startRetire(slot, reason).result;
	}
	function startJoinArtifacts() {
		const pending = [...artifactCleanups.values()];
		const joined = createRetainedOperation(() => {
			for (const operation of pending) operation.service();
			advance();
		});
		const advance = () => {
			const outcomes = pending.map((operation) => operation.read());
			const failure = outcomes.find((outcome) => outcome.status === "rejected");
			if (failure?.status === "rejected") joined.reject(failure.error);
			else if (outcomes.every((outcome) => outcome.status === "fulfilled")) joined.resolve();
		};
		for (const operation of pending) operation.result.then(advance, advance);
		advance();
		return joined.operation;
	}
	/** Join failed native retirements without interrupting healthy tasks. */
	async function retryFailedRetirements() {
		const outcomes = await Promise.allSettled([...slots].filter((slot) => slot.retirementFailed).map((slot) => retire(slot)));
		outcomes.push(...await Promise.allSettled(artifactCleanups.keys()));
		const errors = outcomes.flatMap((outcome) => outcome.status === "rejected" ? [toErrorObject(outcome.reason, "worker retirement retry failed")] : []);
		const firstError = errors[0];
		if (firstError) throw errors.length === 1 ? firstError : new AggregateError(errors, "Worker retirement retries failed", { cause: firstError });
	}
	function idle(slot, elapsedIdleMs = 0) {
		const burst = isBurstSlot(slot);
		const idleMs = (burst ? options.burstIdleTimeoutMs : options.idleTimeoutMs) ?? 6e4;
		if (idleMs <= 0) return;
		if (!burst && !warmSlot && now() - lastIdleRetirementAt < WORKER_WARM_WINDOW_MS) warmSlot = slot;
		const startedAt = burst ? now() : 0;
		const timeoutMs = warmSlot === slot ? Math.max(idleMs, WORKER_WARM_WINDOW_MS) : idleMs;
		slot.idleTimer = runInContext(() => setTimeoutFn(() => {
			if (burst && !isBurstSlot(slot)) {
				idle(slot, now() - startedAt);
				return;
			}
			retire(slot, "idle_timeout").catch(() => void 0);
		}, Math.max(0, timeoutMs - elapsedIdleMs)));
		slot.idleTimer.unref();
	}
	return {
		get dispatchAllowed() {
			return rotation === void 0 && !rotationFailed;
		},
		startRotate,
		retire,
		startRetire,
		service() {
			const current = [...slots];
			for (const slot of current) slot.retiring?.service();
			rotation?.service();
		},
		clearIdle,
		idle,
		retireIdle(resourceClosures) {
			for (const slot of slots) if (!slot.task && !slot.retiring && !slot.retirementFailed && slot.worker && !resourceClosures.get(slot.worker)?.pending) retire(slot, "memory_pressure").catch(() => void 0);
		},
		retryFailedRetirements,
		joinArtifacts: () => startJoinArtifacts().result
	};
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-worker.ts
function postWorkerTaskInput(worker, slot, task, input, transferList, taskContext) {
	const transferStartedAt = performance.now();
	worker.postMessage({
		input,
		taskId: task.id,
		interactive: Boolean(task.options.onRequest || task.options.onRequestSync || task.options.onNotification),
		nativeSections: slot.nativeSections.buffer,
		taskContext,
		sampleMemory: true
	}, transferList);
	task.transferMs += performance.now() - transferStartedAt;
}
function sendWorkerTaskInput(params) {
	const { slot, task, input } = params;
	if (task.done) return;
	task.diagnosticLabel = params.host.describeTask?.(params.workerUrl, input);
	task.preparedAt = performance.now();
	const bootstrapError = params.bootstrapError();
	if (bootstrapError && !slot.worker) {
		params.refuse(bootstrapError);
		return;
	}
	try {
		let worker = slot.worker;
		if (!worker) {
			slot.creating = true;
			try {
				worker = params.createWorker();
			} catch (error) {
				params.fail(error, true);
				return;
			} finally {
				slot.creating = false;
			}
		}
		const transferList = task.options.transferList?.(input);
		if (!task.done) {
			const context = params.host.captureTaskContext(worker);
			postWorkerTaskInput(worker, slot, task, input, [...transferList ?? [], ...params.host.taskContextTransferList?.(context) ?? []], context);
		}
	} catch (error) {
		params.fail(error);
	}
}
/** Physical construction and listeners share the pool's detached creation scope. */
function createWorkerTaskPoolWorker(params) {
	const { slot, options } = params;
	const worker = params.runInContext(() => {
		const prepared = options.prepareWorker?.();
		slot.releaseResources = prepared?.releaseResources;
		const temporaryDirectory = prepared?.temporaryDirectory;
		if (temporaryDirectory) {
			const cleanup = params.host.prepareResources();
			const releaseResources = slot.releaseResources;
			slot.releaseResources = async () => {
				try {
					await cleanup;
					await params.host.releaseTemporaryDirectory(temporaryDirectory);
				} finally {
					await releaseResources?.();
				}
			};
		}
		const workerUrl = options.workerUrl;
		const workerOptions = {
			...options.workerOptions,
			...prepared?.options
		};
		if (slot.retiring) throw params.unavailableError("worker creation closed during preparation");
		const bootstrapError = params.bootstrapError();
		if (bootstrapError) throw bootstrapError;
		if (params.host.requiresReady) slot.ready = false;
		const created = params.host.createWorker(workerUrl, workerOptions);
		slot.native = created.native;
		return created.worker;
	});
	let counted = false;
	const started = () => {
		if (counted) return;
		counted = true;
		params.onStarted(worker);
	};
	if (slot.native) {
		slot.native.on("started", started);
		slot.native.on("execution-exit", (code) => {
			releaseWorkerNativeSectionsOnExit(slot.nativeSections);
			if (!slot.retiring) params.onFailure(params.unavailableError(`worker exited with code ${code}`), true);
		});
	} else started();
	slot.worker = worker;
	worker.on("message", (message) => {
		if (params.host.receiveMessage(worker, message)) return;
		if (slot.ready === false) {
			if (isRecord(message) && message.status === "ready") slot.ready = true;
			else params.onFailure(params.unavailableError("worker task server did not become ready"), true);
			return;
		}
		const task = slot.task;
		if (task) task.runInContext(() => params.onMessage(message));
		else params.onMessage(message);
	});
	worker.on("error", (error) => params.onFailure(params.unavailableError(String(error), error), true));
	worker.on("messageerror", (error) => params.onFailure(params.unavailableError(String(error), error)));
	worker.once("exit", (code) => {
		releaseWorkerNativeSectionsOnExit(slot.nativeSections);
		const wasCounted = counted;
		counted = false;
		params.onExit(code, wasCounted);
	});
	return worker;
}
//#endregion
//#region packages/worker-runtime/src/worker-task-pool-core.ts
const runInWorkerPoolContext = AsyncLocalStorage.snapshot();
/** Bounded execution workers; each worker accepts one task at a time. */
var WorkerTaskPoolCore = class {
	constructor(options, host, publicDispatch, ownerOptions = {}) {
		this.options = options;
		this.host = host;
		this.publicDispatch = publicDispatch;
		this.ownerOptions = ownerOptions;
		this.slots = /* @__PURE__ */ new Set();
		this.ownedTasks = /* @__PURE__ */ new Set();
		this.resourceClosures = /* @__PURE__ */ new WeakMap();
		this.ownedSettlement = {
			cancel: (task) => this.cancel(task, new WorkerTaskError("worker task closed", "unavailable")),
			detach: (task) => {
				if (task.slot?.task === task) {
					task.slot.task = void 0;
					this.activeTasks--;
				}
			},
			retire: (slot) => this.retirement.startRetire(slot),
			release: (task, slot) => {
				if (!this.ownedTasks.delete(task)) return;
				this.releaseAdmission(task);
				task.runInContext = runInWorkerPoolContext;
				this.dispatch();
				if (slot && !task.owner?.retire && !slot.task && !slot.retiring) this.idle(slot);
			}
		};
		this.completion = {
			preparationCleanups: /* @__PURE__ */ new Map(),
			releaseAdmission: (task) => this.releaseAdmission(task),
			releaseCompute: (permit) => this.computeCapacity.release(permit),
			diagnostics: () => ({
				worker: this.options.workerUrl.pathname.split("/").at(-1),
				...this.publicDispatch?.getSnapshot() ?? this.getSnapshot(),
				pendingBytes: this.pendingBytes
			})
		};
		this.queue = [];
		this.bootstrap = createWorkerTaskPoolBootstrap(this.slots, this.queue, (task, error) => this.finish(task, error));
		this.pendingTasks = 0;
		this.pendingBytes = 0;
		this.workers = 0;
		this.workersCreated = 0;
		this.activeTasks = 0;
		this.resumeCompute = () => this.dispatch();
		this.nextTaskId = 0;
		this.retireIdleOnPressure = () => this.retirement.retireIdle(this.resourceClosures);
		this.expireTasks = () => expireWorkerTasks(this.queue, this.slots, (task) => this.timeout(task));
		this.retryFailedRetirements = () => this.retirement.retryFailedRetirements();
		this.observeTask = host.createTaskObserver?.(options.workerUrl);
		this.maxWorkers = host.maxWorkers ?? options.maxWorkers ?? availableParallelism();
		this.maxPendingTasks = options.maxPendingTasks ?? 128;
		this.maxPendingBytes = options.maxPendingBytes ?? 268435456;
		for (const [name, value] of Object.entries({
			maxWorkers: this.maxWorkers,
			maxPendingTasks: this.maxPendingTasks,
			maxPendingBytes: this.maxPendingBytes
		})) if (!Number.isSafeInteger(value) || value < 1) throw new RangeError(`${name} must be a positive safe integer`);
		this.computeCapacity = options.sharedCompute ? host.computeCapacity : void 0;
		this.retirement = createWorkerTaskPoolRetirement({
			slots: this.slots,
			options,
			runInContext: runInWorkerPoolContext,
			dispatch: () => this.dispatch(),
			onRotationComplete: this.bootstrap.reset,
			serviceDeadlines: this.expireTasks,
			markWorkerRetirement: (worker, reason) => host.workerRetiring(worker, reason),
			serviceHost: host
		});
		host.pools.register(this);
	}
	run(input, options) {
		if (this.closedError) return Promise.reject(this.closedError);
		const inputBytes = options.inputBytes ?? 0;
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) return Promise.reject(/* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
		return this.enqueue(input, options, false, inputBytes).promise;
	}
	runTask(input, options) {
		const task = this.enqueue(input, options, true);
		return {
			result: task.promise,
			close: (closeOptions) => joinOwnedWorkerTask(task, this.ownedSettlement, closeOptions?.retire === true)
		};
	}
	startTask(input, options) {
		if (!this.ownerOptions.retainedTransport) throw new WorkerTaskError("Retained tasks require their native lifetime transport", "unavailable");
		return retainWorkerTask(this.enqueue(input, options, true), this.ownedSettlement, () => this.service());
	}
	service() {
		serviceNativeWorkerPass(this.host, this.slots);
		this.expireTasks();
		this.retirement.service();
		const tasks = [...this.ownedTasks];
		for (const task of tasks) task.owner?.closing?.service();
		this.dispatch();
	}
	enqueue(input, options, owned = false, inputBytes = options.inputBytes ?? 0) {
		const completion = createRetainedOperation(() => this.service(), { observeRejection: this.ownerOptions.retainedTransport === true });
		const task = {
			promise: completion.operation.result,
			resolve: completion.resolve,
			reject: completion.reject,
			read: () => completion.operation.read(),
			id: ++this.nextTaskId,
			runInContext: captureWorkerTaskContext(),
			controller: void 0,
			inputConsumed: false,
			executionNotified: false,
			exchangeSequence: 0,
			input,
			options: { ...options },
			abort: () => this.cancel(task, toErrorObject(options.signal?.reason, "worker task aborted")),
			done: false,
			admitted: false,
			...owned ? { owner: {
				closed: false,
				retire: false
			} } : {},
			inputBytes,
			enqueuedAt: performance.now(),
			transferMs: 0,
			hostWaitMs: 0
		};
		if (owned) this.ownedTasks.add(task);
		const unavailable = this.closedError ?? this.bootstrap.admissionError;
		if (unavailable || !Number.isSafeInteger(inputBytes) || inputBytes < 0) {
			this.finish(task, unavailable ?? /* @__PURE__ */ new RangeError("inputBytes must be a nonnegative safe integer"));
			return task;
		}
		if (this.pendingTasks >= this.maxPendingTasks || this.pendingBytes + inputBytes > this.maxPendingBytes || this.computeCapacity && !this.computeCapacity.admit(inputBytes)) {
			this.finish(task, new WorkerTaskError("worker task capacity reached", "overloaded"));
			return task;
		}
		task.admitted = true;
		this.pendingTasks++;
		this.pendingBytes += inputBytes;
		task.observation = this.observeTask?.(task.options.diagnosticOperation);
		if (options.timeoutMs !== void 0) armWorkerTaskTimeout(task, options.timeoutMs, () => this.timeout(task));
		options.signal?.addEventListener("abort", task.abort, { once: true });
		this.queue.push(task);
		if (options.signal?.aborted) task.abort();
		else this.dispatch();
		return task;
	}
	get isClosed() {
		return this.closedError !== void 0;
	}
	getSnapshot() {
		return {
			maxWorkers: this.maxWorkers,
			workers: this.workers,
			workersCreated: this.workersCreated,
			activeTasks: this.activeTasks,
			pendingTasks: this.pendingTasks
		};
	}
	startCloseResources(key) {
		return startCloseWorkerPoolResources(this.slots, this.resourceClosures, (slot) => this.ownedSettlement.retire(slot), key, this.ownerOptions, this.host.observeResourceReply);
	}
	/** Pause dispatch, settle current work and join native exit before restarting the queue. */
	rotate() {
		return this.startRotate().result;
	}
	startRotate() {
		this.computeCapacity?.remove(this.resumeCompute);
		return this.retirement.startRotate();
	}
	close(error = new WorkerTaskError("worker task pool closed", "unavailable")) {
		this.closedError ??= error;
		channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		this.computeCapacity?.remove(this.resumeCompute);
		for (const task of this.queue.splice(0)) this.finish(task, this.closedError);
		for (const slot of this.slots) {
			if (slot.worker) this.host.workerRetiring(slot.worker, "closed");
			if (slot.task && !slot.task.owner) this.finish(slot.task, this.closedError, void 0, true);
		}
		const tasks = [...this.ownedTasks];
		const ownedSlots = new Set(tasks.flatMap((task) => task.slot?.task === task ? [task.slot] : []));
		const owned = tasks.map((task) => joinOwnedWorkerTask(task, this.ownedSettlement, true));
		const unowned = [...this.slots].filter((slot) => !ownedSlots.has(slot));
		const closures = [...owned, ...unowned.map((slot) => this.retirement.retire(slot))];
		return this.host.pools.close(this, closures, () => joinWorkerTaskPreparationCleanups(this.completion, this.retirement.joinArtifacts()));
	}
	dispatch() {
		if (!this.slots.size) channel("openclaw.memory.critical").unsubscribe(this.retireIdleOnPressure);
		if (!this.queue.length || this.closedError || !this.retirement.dispatchAllowed) this.computeCapacity?.remove(this.resumeCompute);
		while (!this.closedError && this.retirement.dispatchAllowed && this.queue.length) {
			let slot = [...this.slots].find((entry) => !entry.task && !entry.retiring && !entry.retirementFailed && (!this.bootstrap.error() || entry.worker));
			if (!slot) {
				const constructionBlocked = this.bootstrap.error();
				if (constructionBlocked) this.bootstrap.rejectQueued();
				if (constructionBlocked || this.slots.size >= this.maxWorkers) {
					let contenders = this.queue.length;
					for (const occupied of this.slots) if (occupied.task?.exchange && !occupied.task.exchange.sent && !occupied.task.exchange.pressure.signal.aborted && contenders-- > 0) occupied.task.exchange.pressure.abort();
					return;
				}
			}
			const nextTask = this.queue[0];
			if (this.computeCapacity) {
				const permit = this.computeCapacity.acquire(this.resumeCompute, () => {
					if (nextTask.exchange && !nextTask.exchange.sent && !nextTask.exchange.pressure.signal.aborted) {
						nextTask.runInContext(() => nextTask.exchange?.pressure.abort());
						return true;
					}
					return false;
				});
				if (!permit) return;
				nextTask.computePermit = permit;
			}
			if (!slot) {
				slot = { nativeSections: createWorkerNativeSectionState() };
				this.slots.add(slot);
			}
			this.retirement.clearIdle(slot);
			const task = this.queue.shift();
			slot.task = task;
			this.activeTasks++;
			task.slot = slot;
			task.startedAt = performance.now();
			task.observation?.started();
			task.runInContext(() => {
				try {
					slot.worker?.ref();
				} catch (error) {
					this.fail(slot, toErrorObject(error, "worker reference failed"));
					return;
				}
				prepareWorkerTaskInput(task, (input) => sendWorkerTaskInput({
					workerUrl: this.options.workerUrl,
					slot,
					task,
					input,
					host: this.host,
					bootstrapError: this.bootstrap.error,
					createWorker: () => this.createWorker(slot),
					fail: (error, nativeFailure) => this.fail(slot, workerTaskUnavailableError(slot, String(error), error), nativeFailure),
					refuse: (error) => this.finish(task, error, void 0, true)
				}), (error) => this.finish(task, toErrorObject(error, "worker task preparation failed")), !slot.worker && this.options.prepareWorker ? () => runInWorkerPoolContext(() => this.host.prepareResources()) : void 0);
			});
		}
	}
	createWorker(slot) {
		if ((this.options.idleTimeoutMs ?? 6e4) > 0) {
			const pressure = channel("openclaw.memory.critical");
			pressure.unsubscribe(this.retireIdleOnPressure);
			pressure.subscribe(this.retireIdleOnPressure);
		}
		return createWorkerTaskPoolWorker({
			slot,
			options: this.options,
			host: this.host,
			bootstrapError: this.bootstrap.error,
			runInContext: runInWorkerPoolContext,
			unavailableError: (message, cause) => workerTaskUnavailableError(slot, message, cause),
			onStarted: (worker) => {
				this.workers++;
				this.workersCreated++;
				this.host.workerStarted(worker, this);
			},
			onMessage: (message) => this.receive(slot, message),
			onFailure: (error, nativeFailure) => this.fail(slot, error, nativeFailure),
			onExit: (code, counted) => {
				if (counted) this.workers--;
				this.fail(slot, workerTaskUnavailableError(slot, `worker exited with code ${code}`), true);
			}
		});
	}
	receive(slot, message) {
		if (slot.retiring) return;
		const task = slot.task;
		if (task && isRecord(message) && (message.status === "request" || message.status === "consumed" || message.status === "notification")) {
			try {
				this.receiveExchange(slot, task, message);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker consumption callback failed"));
			}
			return;
		}
		if (!task || !isRecord(message) || (task.options.onRequest || task.options.onRequestSync || message.taskId !== void 0) && message.taskId !== task.id || message.status !== "ok" && message.status !== "failed") {
			this.fail(slot, new WorkerTaskError("invalid worker task response", "unavailable"));
			return;
		}
		const reply = message;
		const retainInput = Boolean(task.exchange || task.options.onInputConsumed && !task.inputConsumed);
		if (reply.status === "failed") {
			this.finish(task, new WorkerTaskError(reply.error, "failed"), void 0, retainInput);
			return;
		}
		try {
			this.options.validateResult?.(reply.value);
		} catch (error) {
			this.fail(slot, toErrorObject(error, "worker result validation failed"));
			return;
		}
		this.finish(task, void 0, reply.value, retainInput);
	}
	receiveExchange(slot, task, message) {
		if (message.taskId !== task.id) {
			this.fail(slot, new WorkerTaskError("stale worker exchange", "unavailable"));
			return;
		}
		if (message.status === "notification") {
			task.options.onNotification?.(message.value);
			return;
		}
		if (message.status === "consumed") {
			if (message.id === 0 && !task.inputConsumed) {
				task.inputConsumed = true;
				const release = task.options.onInputConsumed;
				task.options.onInputConsumed = void 0;
				release?.();
			} else if (task.exchange?.sent && message.id === task.exchange.id) {
				const release = task.exchange.onConsumed;
				task.exchange = void 0;
				release?.();
			} else this.fail(slot, new WorkerTaskError("invalid worker consumption receipt", "unavailable"));
			return;
		}
		if (!task.options.onRequest && !task.options.onRequestSync || task.exchange || !Number.isSafeInteger(message.id) || message.id !== task.exchangeSequence + 1) {
			this.fail(slot, new WorkerTaskError("invalid worker exchange", "unavailable"));
			return;
		}
		if (task.options.hostTimeout === "owner") {
			clearTimeout(task.timer);
			task.deadline = void 0;
		}
		const exchange = createWorkerHostExchange(task, message.value);
		task.hostWaitStartedAt = performance.now();
		this.dispatch();
		this.computeCapacity?.requestCheckpoints();
		const accept = (response) => {
			if (!task.done && task.deadline !== void 0 && performance.now() >= task.deadline) this.timeout(task);
			if (task.done || slot.task !== task || slot.retiring) {
				const release = () => {
					try {
						task.runInContext(() => response.onConsumed?.());
					} catch {}
				};
				if (this.slots.has(slot)) (slot.completions ??= []).push(release);
				else release();
				return;
			}
			this.finishHostWait(task);
			exchange.onConsumed = response.onConsumed;
			exchange.sent = true;
			armWorkerTaskTimeout(task, response.timeoutMs, () => this.timeout(task));
			try {
				slot.worker.postMessage({
					taskId: task.id,
					responseId: exchange.id,
					input: response.input
				}, response.transferList);
			} catch (error) {
				this.fail(slot, toErrorObject(error, "worker response delivery failed"));
			}
		};
		const reject = (error) => {
			if (!task.done && slot.task === task) this.fail(slot, toErrorObject(error, "worker host exchange failed"));
		};
		dispatchOwnedWorkerRequest(task, slot, message.value, exchange, {
			accept,
			reject,
			closedError: () => new WorkerTaskError("worker task closed before host dispatch", "unavailable")
		});
	}
	timeout(task) {
		if (task.done) return;
		this.cancel(task, workerTaskTimeoutError(task.exchange, this.options.workerUrl));
	}
	cancel(task, error) {
		if (task.done) return;
		if (task.slot) {
			if (task.slot.worker) this.host.workerRetiring(task.slot.worker, "cancelled");
			if (task.owner) this.finish(task, error, void 0, true);
			else this.fail(task.slot, error);
		} else {
			this.queue.splice(this.queue.indexOf(task), 1);
			this.finish(task, error);
		}
	}
	fail(slot, error, nativeFailure) {
		if (slot.retiring) return;
		if (nativeFailure && slot.ready === false) this.bootstrap.fail(error);
		if (slot.worker) this.host.workerRetiring(slot.worker, "failure");
		if (slot.task?.owner) {
			if (slot.task.done) {
				if (!slot.task.owner.retire) closeOwnedWorkerTask(slot.task, this.ownedSettlement, true).catch(() => void 0);
			} else this.finish(slot.task, error, void 0, true);
		} else if (this.options.restartOnError === false) (this.publicDispatch?.close(error) ?? this.close(error)).catch(() => void 0);
		else if (slot.task) this.finish(slot.task, error, void 0, true);
		else this.retirement.retire(slot).catch(() => void 0);
	}
	finishHostWait(task) {
		const startedAt = task.hostWaitStartedAt;
		if (startedAt !== void 0) {
			task.hostWaitStartedAt = void 0;
			task.hostWaitMs += performance.now() - startedAt;
		}
	}
	finish(task, error, value, retire = false) {
		if (task.done) return;
		this.finishHostWait(task);
		task.done = true;
		task.observation?.completed();
		task.observation = void 0;
		task.runInContext(() => task.controller?.abort(error));
		clearTimeout(task.timer);
		task.deadline = void 0;
		task.options.signal?.removeEventListener("abort", task.abort);
		const complete = createWorkerTaskCompletion(task, this.completion, error, value);
		if (task.owner) {
			task.owner.complete = complete;
			task.owner.retire ||= retire || Boolean(error && task.slot && task.preparedAt !== void 0);
			if (error) task.reject(error);
			else task.resolve(value);
			if (error || retire) closeOwnedWorkerTask(task, this.ownedSettlement).catch(() => void 0);
			return;
		}
		const slot = task.slot;
		if (slot) {
			slot.task = void 0;
			this.activeTasks--;
			if (retire) {
				(slot.completions ??= []).push(complete);
				this.retirement.retire(slot, "failure").catch((failure) => {
					task.reject(error ? new AggregateError([error, failure], `Worker retirement failed: ${toErrorObject(failure, "worker retirement failed").message}; task failed: ${error.message}`, { cause: failure }) : failure);
				});
				return;
			}
		}
		complete();
		this.dispatch();
		if (slot && !slot.task && !slot.retiring) this.idle(slot);
	}
	releaseAdmission(task) {
		if (task.admitted) {
			task.admitted = false;
			this.pendingTasks--;
			this.pendingBytes -= task.inputBytes;
			this.computeCapacity?.finish(task.inputBytes);
		}
	}
	idle(slot) {
		if (slot.worker && !this.resourceClosures.get(slot.worker)?.pending) slot.worker.unref();
		this.retirement.idle(slot);
	}
};
//#endregion
//#region src/infra/worker-pool-sizing.ts
function resolveWorkerComputeLimit() {
	return Math.max(1, availableParallelism() - 1);
}
/** Size once at pool creation; serial owners must never inherit host CPU fanout. */
function resolveWorkerPoolSize(kind) {
	return Math.min(kind === "reader" || kind === "file-reader" ? 2 : kind === "compute" ? 4 : 1, resolveWorkerComputeLimit());
}
function resolveStateReadWorkerCount() {
	return Math.max(2, resolveWorkerPoolSize("reader"));
}
function resolveSqliteBrokerWorkerCount() {
	return 2;
}
resolveWorkerPoolSize("reader");
//#endregion
//#region src/infra/worker-task-capacity.ts
/** All runtime chunks share the same host-owned computation budget. */
function getWorkerComputeCapacity() {
	return resolveGlobalSingleton(Symbol.for("openclaw.workerComputeCapacity"), () => createWorkerComputeCapacity(resolveWorkerComputeLimit()));
}
//#endregion
//#region src/shared/lazy-promise.ts
/** Returns the cached promise for a key, creating and storing it when absent. */
function getOrCreatePromise(cache, key, create, options = {}) {
	const cached = cache.get(key);
	if (cached) return cached;
	const created = create();
	cache.set(key, created);
	const evict = () => {
		if (cache.get(key) === created) cache.delete(key);
	};
	if (options.evictOnSettled === true) created.then(evict, evict);
	else if (options.cacheRejections === false) created.catch(evict);
	return created;
}
/**
* Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
*
* Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
*/
function createLazyPromiseLoader(load, options = {}) {
	let promise;
	const createPromise = () => {
		const loaded = Promise.resolve().then(load);
		if (options.cacheRejections !== true) loaded.catch(() => {
			if (promise === loaded) promise = void 0;
		});
		return loaded;
	};
	return {
		load() {
			promise ??= createPromise();
			return promise;
		},
		peek() {
			return promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
//#endregion
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
	const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
	return Object.assign(loader.load, {
		peek: loader.peek,
		clear: loader.clear
	});
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
	return createLazyRuntimeSurface(importer, (module) => module);
}
//#endregion
//#region src/infra/sqlite-worker-contract.ts
const processMonotonicClock = process.hrtime;
/** Monotonic nanoseconds for deadlines measured within the calling thread. */
function readSqliteWorkerMonotonicNs() {
	return processMonotonicClock.bigint();
}
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
const SqliteWorkerAdmissionTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerAdmissionTimeoutError"), () => class AdmissionTimeoutError extends Error {
	constructor() {
		super("SQLite host admission timed out; retry after transaction rollback");
		this.code = "admission-timeout";
		this.name = "SqliteWorkerAdmissionTimeoutError";
	}
});
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
//#endregion
//#region src/infra/sqlite-worker-database-admission-relay.ts
const REQUESTED$2 = 0;
const GRANTED$2 = 1;
const admissionUpstream = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionUpstream"), () => ({}));
function getSqliteDatabaseAdmissionUpstream() {
	return admissionUpstream.connection;
}
function exchangeDatabaseAdmissions(port, admissions, location, create) {
	const { port1, port2 } = new MessageChannel();
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const timing = currentSqliteOperationTiming();
	const startedAt = Date.now();
	try {
		port.postMessage({
			kind: "sqlite-database-admissions",
			admissions,
			location,
			create,
			port: port2,
			decision: decision.buffer
		}, [port2]);
		while (Atomics.load(decision, 0) === REQUESTED$2) Atomics.wait(decision, 0, REQUESTED$2);
		const outcome = Atomics.load(decision, 0);
		if (outcome === 4 && location && create === true) throw new StateDatabaseAdmissionPendingError(location, `OpenClaw state at ${location} is undergoing schema admission; retry when it finishes.`);
		if (outcome !== GRANTED$2) throw new SqliteWorkerError("SQLite admission facts exchange failed", "unavailable");
		const reply = readSqliteDatabaseAdmissions(receiveMessageOnPort(port1)?.message);
		if (!reply) throw new SqliteWorkerError("SQLite admission facts reply is unavailable", "unavailable");
		return reply;
	} finally {
		if (timing) timing.databaseAdmissionWaitMs += Date.now() - startedAt;
		port1.close();
		port2.close();
	}
}
//#endregion
//#region src/infra/sqlite-worker-operation-settlement.ts
function readNativeCommitReceipt(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence) || value.sequence < 1 || !Object.hasOwn(value, "facts")) return;
	return {
		version: 1,
		sequence: value.sequence,
		facts: value.facts
	};
}
const nativeCommitReceipts = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerNativeCommitReceipts"), () => /* @__PURE__ */ new WeakMap());
function deferSqliteWorkerNativeCommitReceipt(owner, database, facts, delivery) {
	const payloadBytes = serialize(facts).byteLength;
	if (payloadBytes > 33554432) throw new SqliteWorkerError("SQLite worker commit receipt exceeds the transport limit", "overloaded");
	const captured = structuredClone(facts);
	const anchor = sqlPublicationAnchor(database);
	const counts = owner.sourceReservations ? owner.pendingReceipts ??= /* @__PURE__ */ new Map() : void 0;
	const pending = (delta) => {
		if (!counts) return;
		const count = (counts.get(anchor) ?? 0) + delta;
		if (count === 0) counts.delete(anchor);
		else counts.set(anchor, count);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage: () => pending(1),
		rollback: () => pending(-1),
		commit() {
			pending(-1);
			const receipt = {
				version: 1,
				sequence: (nativeCommitReceipts.get(owner)?.receipt.sequence ?? 0) + 1,
				facts: captured
			};
			const retained = {
				receipt,
				payloadBytes,
				delivered: false
			};
			nativeCommitReceipts.set(owner, retained);
			owner.committed = { facts: captured };
			if (delivery === "commit") {
				owner.port.postMessage({
					kind: "native-commit",
					committed: receipt,
					payloadBytes
				}, []);
				retained.delivered = true;
			}
		}
	})) throw new Error("SQLite worker receipt requires a transaction publication owner");
}
const currentSqliteWorkerOperationAdmission = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
//#endregion
//#region src/state/openclaw-agent-execution-authority.ts
const OPEN = 0;
function readAgentDatabaseExecutionAuthority(authority) {
	return Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN && Atomics.load(authority.logical, 0) === OPEN && Atomics.load(authority.native, 0) === OPEN;
}
//#endregion
//#region src/infra/sqlite-worker-request-custody.ts
const ACTIVE = 1;
const DISPATCHED = 2;
const POST_ATTEMPTED = 4;
const CANCELED = 8;
const RETIRED = 16;
function active(state) {
	return (state & ACTIVE) !== 0 && (state & 24) === 0;
}
/** Exact buffers retain generations; request IDs never identify authority. */
function readSqliteWorkerRequestCustody(descriptor) {
	return Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0)) && Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0));
}
var SqliteWorkerSlotCustody = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
		Atomics.store(this.state, 0, 1);
	}
	createRequest() {
		return new SqliteWorkerRequestCustody(this.state);
	}
	retire() {
		Atomics.store(this.state, 0, 0);
	}
};
var SqliteWorkerRequestCustody = class {
	constructor(slot) {
		this.descriptor = {
			slot,
			request: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))
		};
	}
	activate() {
		if (Atomics.compareExchange(this.descriptor.request, 0, 0, ACTIVE) !== 0) throw new SqliteWorkerError("SQLite worker request custody was already used", "closed");
	}
	assertCurrent() {
		if (!readSqliteWorkerRequestCustody(this.descriptor)) throw new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	}
	get dispatched() {
		return (Atomics.load(this.descriptor.request, 0) & DISPATCHED) !== 0;
	}
	get postAttempted() {
		return (Atomics.load(this.descriptor.request, 0) & POST_ATTEMPTED) !== 0;
	}
	accept() {
		this.assertCurrent();
		Atomics.or(this.descriptor.request, 0, DISPATCHED);
	}
	post() {
		Atomics.or(this.descriptor.request, 0, POST_ATTEMPTED);
	}
	cancel() {
		if (!this.dispatched) Atomics.or(this.descriptor.request, 0, CANCELED);
	}
	retire() {
		Atomics.or(this.descriptor.request, 0, RETIRED);
	}
};
//#endregion
//#region src/infra/sqlite-writer-admission-client.ts
const REQUESTED$1 = 0;
const GRANTED$1 = 1;
const TIMED_OUT$1 = 3;
function assertRequestCustody(owner) {
	if (owner.requestCustody && !readSqliteWorkerRequestCustody(owner.requestCustody)) {
		const refusal = new SqliteWorkerError("SQLite worker request custody is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
	if (owner.executionAuthority && !readAgentDatabaseExecutionAuthority(owner.executionAuthority)) {
		const refusal = new SqliteWorkerError("SQLite execution authority is revoked", "closed");
		owner.refusal = refusal;
		throw refusal;
	}
}
/** Ask the live host owner for a native stage; preparation precedes writer-lock acquisition. */
function requestSqliteWorkerOperationAdmission(request, transferList = []) {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite operation requires its retained admission", "unavailable");
	if (scope.owner.sourceReservations) throw new SqliteWorkerError("SQLite source reservations prohibit host admission", "closed");
	assertRequestCustody(scope.owner);
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const startedAt = Date.now();
	const deadlineNs = request.deadlineMs === void 0 ? void 0 : readSqliteWorkerMonotonicNs() + BigInt(request.deadlineMs) * 1000000n;
	scope.port.postMessage({
		...request,
		decision: decision.buffer,
		ports: transferList.filter((value) => value instanceof MessagePort)
	}, transferList);
	while (Atomics.load(decision, 0) === REQUESTED$1) {
		const remainingMs = deadlineNs === void 0 ? void 0 : Number(deadlineNs - readSqliteWorkerMonotonicNs()) / 1e6;
		if (remainingMs !== void 0 && remainingMs <= 0) Atomics.compareExchange(decision, 0, REQUESTED$1, TIMED_OUT$1);
		else Atomics.wait(decision, 0, REQUESTED$1, remainingMs);
	}
	const timing = currentSqliteOperationTiming();
	if (timing) timing.hostAdmissionWaitMs += Date.now() - startedAt;
	const outcome = Atomics.load(decision, 0);
	if (outcome === 4 && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string") {
		const databasePath = request.facts.databasePath;
		throw new StateDatabaseAdmissionPendingError(databasePath, `OpenClaw state at ${databasePath} is undergoing schema admission; retry when it finishes.`);
	}
	if (outcome !== GRANTED$1) {
		const refusal = outcome === TIMED_OUT$1 ? new SqliteWorkerAdmissionTimeoutError() : new SqliteWorkerError("SQLite transaction admission was refused", "closed");
		scope.owner.refusal = refusal;
		throw refusal;
	}
	assertRequestCustody(scope.owner);
}
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
const TIMED_OUT = 3;
const commitObserverBindings = /* @__PURE__ */ new WeakMap();
const executionAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerExecutionAuthorities"), () => /* @__PURE__ */ new WeakMap());
function readSqliteWorkerExecutionAuthority(admission) {
	return executionAuthorities.get(admission);
}
/** The optional continuation runs under live host authority before releasing the native writer. */
const createSqliteWorkerOperationAdmission = (admit, attachment) => createOperationAdmission(admit, attachment);
/** Task lifetime channels relay a broker's creation grant without acquiring database authority. */
function createSqliteDatabaseAdmissionRelay(assertCurrent) {
	return createOperationAdmission(() => {
		throw new Error("Worker format facts do not grant database authority");
	}, void 0, assertCurrent);
}
function createOperationAdmission(admit, attachment, assertRelayCurrent) {
	const { port1, port2 } = new MessageChannel();
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const databaseAdmissionCursor = createSqliteDatabaseAdmissionCursor();
	const cleanupFailures = [];
	let closed = false;
	let started = false;
	let observeRequest;
	const commitObservers = [];
	let observingCommit = false;
	let failure;
	let committed;
	let nativeReceipt;
	let settlement;
	let databaseAuthority;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const recordFailure = (error, source) => {
		if (!failure || failure.source === "domain" && source !== "domain") failure = {
			error,
			source
		};
	};
	const refuse = (decision, error, source) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			recordFailure(error, source);
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const invalidProtocol = (kind, code = "outcome-unknown") => recordFailure(new SqliteWorkerError(`SQLite worker ${kind} is invalid`, code), "protocol");
	const installCommitted = (receipt) => {
		if (nativeReceipt && receipt.sequence <= nativeReceipt.sequence) return;
		nativeReceipt = receipt;
		const publication = { facts: receipt.facts };
		committed = publication;
		observingCommit = true;
		try {
			inOwnerContext(() => {
				for (const observer of commitObservers) observer(publication);
			});
		} catch (error) {
			recordFailure(Object.assign(new SqliteWorkerError("SQLite committed facts publication failed", "outcome-unknown"), { cause: error }), "protocol");
		} finally {
			observingCommit = false;
		}
	};
	const receive = (message) => {
		recordWorkerMessage(isRecord(message) && message.kind === "sqlite-database-admissions" ? "admission" : "authority", "from_worker", isRecord(message) && typeof message.payloadBytes === "number" ? message.payloadBytes : void 0);
		started = true;
		if (isRecord(message) && message.kind === "sqlite-database-admissions") {
			if (!(message.port instanceof MessagePort) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.location !== void 0 && typeof message.location !== "string" || message.create !== void 0 && typeof message.create !== "boolean" && message.create !== "admitted") {
				recordFailure(new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable"), "protocol");
				return;
			}
			const decision = new Int32Array(message.decision);
			let coldOpenPath;
			try {
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const assertRelayCreation = message.create === "admitted" ? assertRelayCurrent : void 0;
				if (message.create === "admitted" && !assertRelayCreation) throw new SqliteWorkerError("SQLite creation relay is not admitted", "closed");
				const admissions = readSqliteDatabaseAdmissions(message.admissions);
				if (!admissions) throw new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable");
				installSqliteDatabaseAdmissions(admissions);
				let location = message.location;
				let create = false;
				if (message.location && message.create && !prepareSqliteDatabaseAdmission(message.location)) {
					location = resolveIdentityPathViaExistingAncestorSync(message.location);
					const creationLocation = location;
					const authority = databaseAuthority;
					const assertCreate = authority?.assertCreate?.bind(authority);
					if (message.create === "admitted") create = true;
					else if (authority && assertCreate) {
						if (authority.coldOpenPath && resolveIdentityPathViaExistingAncestorSync(authority.coldOpenPath) === creationLocation) coldOpenPath = authority.coldOpenPath;
						inOwnerContext(() => {
							authority.assertRequest?.();
							authority.assertAccess();
							assertCreate(creationLocation);
						});
						coldOpenPath = void 0;
						create = true;
					}
				}
				if (create) assertRelayCreation?.();
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const upstream = getSqliteDatabaseAdmissionUpstream();
				if (upstream) {
					if (upstream.closed) throw new SqliteWorkerError("SQLite admission upstream is closed", "closed");
					installSqliteDatabaseAdmissions(exchangeDatabaseAdmissions(upstream.port, admissions, location, create ? "admitted" : void 0));
				} else if (location) try {
					if (create) prepareSqliteDatabaseAdmission(location, { create: true });
					retainSqliteDatabaseAdmissionLocation(location);
				} catch (error) {
					if (!isRecord(error) || error.code !== "ENOENT") throw error;
				}
				const scope = message.location === void 0 ? void 0 : {
					location: message.location,
					admissions
				};
				const reply = captureSqliteDatabaseAdmissions(databaseAdmissionCursor, scope);
				message.port.postMessage(reply, []);
				recordWorkerMessage("admission", "to_worker");
				Atomics.store(decision, 0, GRANTED);
			} catch (error) {
				if (error instanceof StateDatabaseAdmissionPendingError && error.databasePath === coldOpenPath) Atomics.store(decision, 0, 4);
				else {
					recordFailure(error, "protocol");
					Atomics.store(decision, 0, REFUSED);
				}
			} finally {
				message.port.close();
				Atomics.notify(decision, 0);
			}
			return;
		}
		if (isRecord(message) && message.kind === "native-commit") {
			const receipt = readNativeCommitReceipt(message.committed);
			if (!receipt) {
				invalidProtocol("commit receipt");
				return;
			}
			installCommitted(receipt);
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			const receipt = isRecord(value) ? readNativeCommitReceipt(value.committed) : void 0;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !receipt) {
				invalidProtocol("native settlement");
				return;
			}
			if (receipt) installCommitted(receipt);
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			invalidProtocol("admission request", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		const deadlineNs = typeof message.deadlineMs === "number" && Number.isFinite(message.deadlineMs) ? readSqliteWorkerMonotonicNs() + BigInt(Math.max(0, Math.ceil(message.deadlineMs))) * 1000000n : void 0;
		const expired = () => {
			if (deadlineNs !== void 0 && readSqliteWorkerMonotonicNs() >= deadlineNs) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT) === REQUESTED) Atomics.notify(decision, 0);
			}
			if (Atomics.load(decision, 0) !== TIMED_OUT) return false;
			if (Array.isArray(message.ports)) {
				for (const port of message.ports) if (port instanceof MessagePort) port.close();
			}
			return true;
		};
		if (expired()) return;
		decisions.add(decision);
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		try {
			inOwnerContext(() => observeRequest?.(request));
		} catch (error) {
			refuse(decision, error, "domain");
			return;
		}
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			return;
		}
		const grant = (beforeRelease) => {
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			try {
				inOwnerContext(() => databaseAuthority?.assertAccess());
			} catch (error) {
				refuse(decision, error, "authority");
				return false;
			}
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			beforeRelease?.();
			if (expired()) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		let source = "authority";
		try {
			inOwnerContext(() => {
				databaseAuthority?.assertRequest?.();
				databaseAuthority?.assertAccess();
			});
			if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance") {
				const authority = databaseAuthority;
				if (!authority || typeof request.facts.databasePath !== "string" || resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) !== authority.databasePath) throw new SqliteWorkerError("SQLite schema maintenance target differs from its admitted database", "closed");
				inOwnerContext(() => {
					authority.lease ??= authority.acquireSchema();
					authority.lease.assertCurrent();
					grant();
				});
			} else {
				source = "domain";
				inOwnerContext(admit, request, grant);
			}
		} catch (error) {
			if (error instanceof StateDatabaseAdmissionPendingError && databaseAuthority?.coldOpenPath === error.databasePath && !databaseAuthority.lease && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string" && resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) === databaseAuthority.databasePath) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, 4) === REQUESTED) Atomics.notify(decision, 0);
			} else refuse(decision, error, source);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"), "domain");
	};
	port1.on("message", receive).unref();
	const service = () => {
		if (observingCommit) return;
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	const admission = {
		port: port2,
		attachment: attachment === void 0 ? void 0 : { value: attachment },
		observeRequests(observer) {
			if (closed || observeRequest) throw new SqliteWorkerError("SQLite request observation is already bound or closed", "closed");
			observeRequest = observer;
		},
		bindDatabaseAuthority(authority) {
			if (closed || databaseAuthority) throw new SqliteWorkerError("SQLite database authority is already bound or closed", "closed");
			databaseAuthority = { ...authority };
		},
		get failure() {
			return failure?.error;
		},
		get failureSource() {
			return failure?.source;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure.error, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			port1.close();
			port2.close();
			if (databaseAuthority?.lease) try {
				databaseAuthority.lease.release();
				databaseAuthority.lease = void 0;
			} catch (error) {
				cleanupFailures.push(error);
			}
		}
	};
	commitObserverBindings.set(admission, (observer) => {
		if (closed || started) throw new SqliteWorkerError("SQLite commit observation is closed or started", "closed");
		commitObservers.push(observer);
	});
	return admission;
}
/** Record facts only after the real transaction commits, before native settlement is announced. */
function deferSqliteWorkerCommitReceipt(database, facts, delivery = "commit") {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active) throw new SqliteWorkerError("SQLite receipt requires its retained admission", "unavailable");
	deferSqliteWorkerNativeCommitReceipt(scope.owner, database, facts, delivery);
}
/** Schema work borrows live host authority through the same retained job port. */
function requestSqliteWorkerSchemaMaintenance(databasePath) {
	if (!currentSqliteWorkerOperationAdmission.getStore()) return false;
	requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: {
			kind: "schema-maintenance",
			databasePath
		}
	});
	return true;
}
//#endregion
//#region src/shared/store-writer-queue.ts
const MAX_WRITERS_PER_TURN = 4;
const WRITER_TURN_BUDGET_MS = 4;
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
const writerTurn = resolveGlobalSingleton(Symbol.for("openclaw.storeWriterTurn"), () => ({
	started: 0,
	startedAt: 0,
	reset: void 0,
	wait: void 0
}));
function claimStoreWriterTurn(immediate) {
	const now = performance$1.now();
	if (!writerTurn.reset) {
		writerTurn.started = 0;
		writerTurn.startedAt = now;
		writerTurn.reset = setImmediate$1().then(() => {
			writerTurn.reset = void 0;
		});
	}
	if (!immediate && (writerTurn.wait || writerTurn.started >= MAX_WRITERS_PER_TURN || now - writerTurn.startedAt >= WRITER_TURN_BUDGET_MS)) return writerTurn.wait ??= setImmediate$1().then(() => {
		writerTurn.wait = void 0;
	});
	writerTurn.started++;
}
function isActiveStoreWriter(queues, storePath, keys) {
	if (!queues.has(storePath)) return false;
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) {
			const heldKeys = active.keys;
			if (heldKeys && (!keys || [...keys].some((key) => !heldKeys.has(key)))) throw new Error("Cannot expand an active store writer's keys");
			return true;
		}
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn, timing, keys) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath,
		keys
	};
	if (timing) {
		timing.reentrant = false;
		timing.startedAt = performance$1.now();
	}
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		if (timing) timing.finishedAt = performance$1.now();
		writer.active = false;
	}
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue || queue.drainPromise) return;
	const drain = createDeferredCore();
	queue.drainPromise = drain.promise;
	const heldKeys = /* @__PURE__ */ new Set();
	let active = 0;
	let changed = createDeferredCore();
	queue.wake = () => changed.resolve();
	let first = true;
	try {
		while (queue.pending.length > 0 || active > 0) {
			const blocked = /* @__PURE__ */ new Set();
			let task;
			for (const pending of queue.pending) {
				const keys = pending.keys;
				if (!keys) {
					if (active === 0 && blocked.size === 0) task = pending;
					break;
				}
				if (![...keys].some((key) => heldKeys.has(key) || blocked.has(key))) {
					task = pending;
					break;
				}
				for (const key of keys) blocked.add(key);
			}
			if (!task) {
				await changed.promise;
				changed = createDeferredCore();
				continue;
			}
			let wait;
			while (wait = claimStoreWriterTurn(first)) await wait;
			first = false;
			const index = queue.pending.indexOf(task);
			if (index < 0) continue;
			queue.pending.splice(index, 1);
			if (!task.keys) {
				await task.fn().then(task.resolve, task.reject);
				continue;
			}
			const keys = task.keys;
			for (const key of keys) heldKeys.add(key);
			active++;
			const finish = () => {
				for (const key of keys) heldKeys.delete(key);
				active--;
				queue.wake?.();
			};
			task.fn().then((value) => {
				finish();
				task.resolve(value);
			}, (error) => {
				finish();
				task.reject(error);
			});
		}
	} finally {
		queue.drainPromise = null;
		queue.wake = void 0;
		queues.delete(storePath);
		drain.resolve();
	}
}
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	params.signal?.throwIfAborted();
	const keys = params.keys?.length ? new Set(params.keys) : void 0;
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath, keys)) {
		if (params.timing) {
			params.timing.reentrant = true;
			params.timing.startedAt = performance$1.now();
		}
		try {
			return await params.fn();
		} finally {
			if (params.timing) params.timing.finishedAt = performance$1.now();
		}
	}
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	let existingQueue = params.queues.get(params.storePath);
	if (!existingQueue) {
		existingQueue = {
			pending: [],
			drainPromise: null
		};
		params.queues.set(params.storePath, existingQueue);
	}
	const queue = existingQueue;
	let detach = () => {};
	const completion = new Promise((resolve, reject) => {
		detach = () => params.signal?.removeEventListener("abort", abort);
		const abort = () => {
			const index = queue.pending.indexOf(task);
			if (index !== -1) {
				queue.pending.splice(index, 1);
				task.reject(params.signal?.reason);
				queue.wake?.();
			}
		};
		const task = {
			keys,
			fn: async () => {
				detach();
				return await runInAsyncContext(runActiveStoreWriter, params.queues, params.storePath, params.fn, params.timing, keys);
			},
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		queue.wake?.();
		params.signal?.addEventListener("abort", abort, { once: true });
		runInDetachedAsyncContext(() => void drainStoreWriterQueue(params.queues, params.storePath));
	});
	if (params.signal) completion.then(detach, detach);
	return await completion;
}
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({ queues: /* @__PURE__ */ new Map() })).queues;
//#endregion
//#region src/infra/worker-task-pool-registry.ts
const livePools = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
const liveWorkerTaskPools = {
	register(pool) {
		livePools.add(pool);
		return pool;
	},
	async close(pool, closures, finish) {
		await joinOwnedWorkerTasks(closures);
		await finish();
		livePools.delete(pool);
	}
};
//#endregion
//#region src/infra/worker-task-host.ts
const diagnosticTaskKinds = /* @__PURE__ */ new Set([
	"prepare",
	"prepare-session",
	"transcript-stats",
	"session-entry",
	"session-entries",
	"session-cleanup",
	"session-memory-capture",
	"history-page",
	"historical-eviction-candidates",
	"usage-cost",
	"model-context",
	"context-messages",
	"transcript-search"
]);
const prepareResources = createLazyRuntimeModule(() => import("./temp-artifact-cleanup-DV13Twp3.mjs"));
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.workerTaskDatabaseAdmissionChannels"), () => /* @__PURE__ */ new Map());
function createWorkerTaskHost(owner = {}, workerClass) {
	const boundedHeap = workerClass && workerClass !== "writer" && workerClass !== "singleton";
	const source = owner.retainedTransport ? owner.nativeSource ?? captureRetainedNativeWorkerSource({ runtimeGeneration: void 0 }) : void 0;
	return {
		maxWorkers: workerClass ? resolveWorkerPoolSize(workerClass) : void 0,
		requiresReady: owner.retainedTransport,
		createWorker(url, options) {
			const workerOptions = {
				execArgv: resolveRuntimeWorkerThreadExecArgv(url),
				...options
			};
			if (boundedHeap) {
				const limits = workerOptions.resourceLimits;
				workerOptions.resourceLimits = {
					maxOldGenerationSizeMb: limits?.maxOldGenerationSizeMb ?? 512,
					maxYoungGenerationSizeMb: limits?.maxYoungGenerationSizeMb,
					codeRangeSizeMb: limits?.codeRangeSizeMb,
					stackSizeMb: limits?.stackSizeMb
				};
			}
			if (owner.retainedTransport) {
				const { port1, port2 } = new MessageChannel();
				const native = createRetainedNativeWorker(url, workerOptions, source, owner.nativeResource, {
					host: port1,
					worker: port2
				});
				return {
					worker: native,
					native
				};
			}
			return { worker: createCpuTrackedWorker(url, workerOptions) };
		},
		serviceNativeWorkers(workers) {
			for (const { owner: admission } of admissions.values()) admission.service();
			workers[0]?.service();
		},
		prepareResources,
		async releaseTemporaryDirectory(directory) {
			const { removeTemporaryArtifacts } = await prepareResources();
			await removeTemporaryArtifacts(directory, "Worker task");
		},
		captureTaskContext(worker) {
			let admission = admissions.get(worker);
			if (!admission) {
				admission = {
					owner: runInDetachedAsyncContext(() => createSqliteDatabaseAdmissionRelay(() => {
						if (admissions.get(worker)?.retiring !== false) throw new Error("SQLite creation relay's task worker is retiring");
					})),
					sent: false,
					retiring: false
				};
				admissions.set(worker, admission);
				const retained = admission;
				worker.once("exit", () => {
					retained.owner.finish();
					admissions.delete(worker);
				});
			}
			const context = {
				deletedAgentDatabaseFences: captureDeletedAgentDatabaseFences(),
				...!admission.sent ? { databaseAdmissionPort: admission.owner.port } : {}
			};
			admission.sent = true;
			return context;
		},
		taskContextTransferList(context) {
			const captured = context;
			return captured.databaseAdmissionPort ? [captured.databaseAdmissionPort] : [];
		},
		createTaskObserver(url) {
			const kind = workerRequestKind(url);
			return (operation) => trackWorkerRequest(kind, operation === void 0 ? "task" : classifyWorkerRequest(operation));
		},
		describeTask(url, input) {
			const kind = input !== null && typeof input === "object" ? Object.getOwnPropertyDescriptor(input, "kind")?.value : void 0;
			const operation = typeof kind === "string" && diagnosticTaskKinds.has(kind) ? kind : "task";
			return `${workerRequestKind(url)}.${operation}`;
		},
		receiveMessage: receiveWorkerMemoryPort,
		observeResourceReply: () => recordWorkerMessage("resource", "from_worker"),
		workerStarted(worker, pool) {
			if (owner.databaseAccess !== "read-only") trackSqliteDatabaseAdmissionWorker(worker);
			attributeWorkerToPool(worker, pool);
		},
		workerRetiring(worker, reason) {
			const admission = admissions.get(worker);
			if (admission) admission.retiring = true;
			markWorkerRetirement(worker, reason);
		},
		computeCapacity: getWorkerComputeCapacity(),
		pools: liveWorkerTaskPools
	};
}
//#endregion
//#region src/infra/worker-task-pool.ts
/** Existing SDK surface; task custody remains an internal capability. */
var WorkerTaskPool = class {
	constructor(options) {
		this.core = new WorkerTaskPoolCore(options, createWorkerTaskHost(void 0, options.workerClass), {
			close: (error) => this.close(error),
			getSnapshot: () => this.getSnapshot()
		});
	}
	run(input, options) {
		return this.core.run(input, options);
	}
	get isClosed() {
		return this.core.isClosed;
	}
	getSnapshot() {
		return this.core.getSnapshot();
	}
	retryFailedRetirements() {
		return this.core.retryFailedRetirements();
	}
	rotate() {
		return this.core.rotate();
	}
	close(error) {
		return this.core.close(error);
	}
};
/** Internal resource owners can retain task custody or use settled ordinary reads. */
function createOwnedWorkerTaskPool(options, ownerOptions) {
	const core = new WorkerTaskPoolCore(options, createWorkerTaskHost(ownerOptions, options.workerClass), void 0, ownerOptions);
	return {
		run: (input, taskOptions) => core.run(input, taskOptions),
		rotate: () => core.rotate(),
		runTask: (input, taskOptions) => core.runTask(input, taskOptions),
		startTask: (input, taskOptions) => core.startTask(input, taskOptions),
		closeResources: (key) => core.startCloseResources(key).result,
		startCloseResources: (key) => core.startCloseResources(key),
		startRotate: () => core.startRotate(),
		getSnapshot: () => core.getSnapshot(),
		close: (error) => core.close(error)
	};
}
//#endregion
export { strictObject as $, StateDatabaseAdmissionPendingError as A, GATEWAY_OWNER_HEARTBEAT_MS as B, matchesAgentDatabaseReadCandidatePath as C, flatMapRetainedOperation as D, finallyRetainedOperation as E, isGatewayStateOwnerDefinitelyStale as F, array as G, parseGatewayLockPayload as H, createCpuTrackedWorker as I, discriminatedUnion as J, boolean as K, recordWorkerMessage as L, StateDatabaseOfflineMaintenanceError as M, assertPersistedStateDatabaseAccessAllowed as N, mapRetainedOperation as O, defaultPayload as P, object as Q, runWithMainThreadTask as R, trackWorkerRequest as S, createRetainedOperation as T, _enum as U, describeGatewayLockHolder as V, _undefined as W, looseObject as X, literal as Y, number as Z, resolveStateReadWorkerCount as _, deferSqliteWorkerCommitReceipt as a, captureRetainedNativeWorkerSource as b, SqliteWorkerSlotCustody as c, SQLITE_WORKER_MAX_MESSAGE_BYTES as d, string as et, SqliteWorkerAdmissionTimeoutError as f, resolveSqliteBrokerWorkerCount as g, getOrCreatePromise as h, createSqliteWorkerOperationAdmission as i, StateDatabaseMaintenanceScopeError as j, GatewayStateOwnerContentionError as k, readSqliteWorkerRequestCustody as l, retainSqliteWorkerErrorCode as m, createOwnedWorkerTaskPool as n, unknown as nt, readSqliteWorkerExecutionAuthority as o, SqliteWorkerError as p, custom as q, runQueuedStoreWrite as r, requestSqliteWorkerSchemaMaintenance as s, WorkerTaskPool as t, union as tt, currentSqliteWorkerOperationAdmission as u, WorkerTaskError as v, registerAgentDatabaseReaderCloser as w, classifyWorkerRequest as x, DEFAULT_WORKER_PENDING_BYTES as y, captureRuntimeWorkerSource as z };
