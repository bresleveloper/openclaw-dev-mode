import { n as __esmMin, o as __toCommonJS, r as __exportAll, t as __commonJSMin } from "./rolldown-runtime-Dr7-SnC6.mjs";
//#region node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = /* @__PURE__ */ __exportAll({
	__addDisposableResource: () => __addDisposableResource,
	__assign: () => __assign,
	__asyncDelegator: () => __asyncDelegator,
	__asyncGenerator: () => __asyncGenerator,
	__asyncValues: () => __asyncValues,
	__await: () => __await,
	__awaiter: () => __awaiter,
	__classPrivateFieldGet: () => __classPrivateFieldGet,
	__classPrivateFieldIn: () => __classPrivateFieldIn,
	__classPrivateFieldSet: () => __classPrivateFieldSet,
	__createBinding: () => __createBinding,
	__decorate: () => __decorate,
	__disposeResources: () => __disposeResources,
	__esDecorate: () => __esDecorate,
	__exportStar: () => __exportStar,
	__extends: () => __extends,
	__generator: () => __generator,
	__importDefault: () => __importDefault,
	__importStar: () => __importStar,
	__makeTemplateObject: () => __makeTemplateObject,
	__metadata: () => __metadata,
	__param: () => __param,
	__propKey: () => __propKey,
	__read: () => __read,
	__rest: () => __rest,
	__rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
	__runInitializers: () => __runInitializers,
	__setFunctionName: () => __setFunctionName,
	__spread: () => __spread,
	__spreadArray: () => __spreadArray,
	__spreadArrays: () => __spreadArrays,
	__values: () => __values,
	default: () => tslib_es6_default
});
function __extends(d, b) {
	if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
}
function __runInitializers(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
}
function __propKey(x) {
	return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
	if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
	return Object.defineProperty(f, "name", {
		configurable: true,
		value: prefix ? "".concat(prefix, " ", name) : name
	});
}
function __metadata(metadataKey, metadataValue) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
	return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (g && (g = 0, op[0] && (_ = 0)), _) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
function __exportStar(m, o) {
	for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
/** @deprecated */
function __spread() {
	for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	return ar;
}
/** @deprecated */
function __spreadArrays() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
}
function __spreadArray(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function awaitReturn(f) {
		return function(v) {
			return Promise.resolve(v).then(f, reject);
		};
	}
	function verb(n, f) {
		if (g[n]) {
			i[n] = function(v) {
				return new Promise(function(a, b) {
					q.push([
						n,
						v,
						a,
						b
					]) > 1 || resume(n, v);
				});
			};
			if (f) i[n] = f(i[n]);
		}
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
}
function __asyncDelegator(o) {
	var i = {}, p;
	return verb("next"), verb("throw", function(e) {
		throw e;
	}), verb("return"), i[Symbol.iterator] = function() {
		return this;
	}, i;
	function verb(n, f) {
		i[n] = o[n] ? function(v) {
			return (p = !p) ? {
				value: __await(o[n](v)),
				done: false
			} : f ? f(v) : v;
		} : f;
	}
}
function __asyncValues(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v) {
			resolve({
				value: v,
				done: d
			});
		}, reject);
	}
}
function __makeTemplateObject(cooked, raw) {
	if (Object.defineProperty) Object.defineProperty(cooked, "raw", { value: raw });
	else cooked.raw = raw;
	return cooked;
}
function __importStar(mod) {
	if (mod && mod.__esModule) return mod;
	var result = {};
	if (mod != null) {
		for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
	}
	__setModuleDefault(result, mod);
	return result;
}
function __importDefault(mod) {
	return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
	if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
	return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
}
function __disposeResources(env) {
	function fail(e) {
		env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
		env.hasError = true;
	}
	var r, s = 0;
	function next() {
		while (r = env.stack.pop()) try {
			if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
			if (r.dispose) {
				var result = r.dispose.call(r.value);
				if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
					fail(e);
					return next();
				});
			} else s |= 1;
		} catch (e) {
			fail(e);
		}
		if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
		if (env.hasError) throw env.error;
	}
	return next();
}
function __rewriteRelativeImportExtension(path, preserveJsx) {
	if (typeof path === "string" && /^\.\.?\//.test(path)) return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
		return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
	});
	return path;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esmMin((() => {
	extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	__assign = function() {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
	__createBinding = Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	__setModuleDefault = Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	};
	ownKeys = function(o) {
		ownKeys = Object.getOwnPropertyNames || function(o) {
			var ar = [];
			for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
			return ar;
		};
		return ownKeys(o);
	};
	_SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
		var e = new Error(message);
		return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
	};
	tslib_es6_default = {
		__extends,
		__assign,
		__rest,
		__decorate,
		__param,
		__esDecorate,
		__runInitializers,
		__propKey,
		__setFunctionName,
		__metadata,
		__awaiter,
		__generator,
		__createBinding,
		__exportStar,
		__values,
		__read,
		__spread,
		__spreadArrays,
		__spreadArray,
		__await,
		__asyncGenerator,
		__asyncDelegator,
		__asyncValues,
		__makeTemplateObject,
		__importStar,
		__importDefault,
		__classPrivateFieldGet,
		__classPrivateFieldSet,
		__classPrivateFieldIn,
		__addDisposableResource,
		__disposeResources,
		__rewriteRelativeImportExtension
	};
}));
//#endregion
//#region node_modules/.pnpm/pvtsutils@1.3.6/node_modules/pvtsutils/build/index.js
/*!
* MIT License
* 
* Copyright (c) 2017-2024 Peculiar Ventures, LLC
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/
var require_build$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const ARRAY_BUFFER_NAME = "[object ArrayBuffer]";
	var BufferSourceConverter = class BufferSourceConverter {
		static isArrayBuffer(data) {
			return Object.prototype.toString.call(data) === ARRAY_BUFFER_NAME;
		}
		static toArrayBuffer(data) {
			if (this.isArrayBuffer(data)) return data;
			if (data.byteLength === data.buffer.byteLength) return data.buffer;
			if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) return data.buffer;
			return this.toUint8Array(data.buffer).slice(data.byteOffset, data.byteOffset + data.byteLength).buffer;
		}
		static toUint8Array(data) {
			return this.toView(data, Uint8Array);
		}
		static toView(data, type) {
			if (data.constructor === type) return data;
			if (this.isArrayBuffer(data)) return new type(data);
			if (this.isArrayBufferView(data)) return new type(data.buffer, data.byteOffset, data.byteLength);
			throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
		}
		static isBufferSource(data) {
			return this.isArrayBufferView(data) || this.isArrayBuffer(data);
		}
		static isArrayBufferView(data) {
			return ArrayBuffer.isView(data) || data && this.isArrayBuffer(data.buffer);
		}
		static isEqual(a, b) {
			const aView = BufferSourceConverter.toUint8Array(a);
			const bView = BufferSourceConverter.toUint8Array(b);
			if (aView.length !== bView.byteLength) return false;
			for (let i = 0; i < aView.length; i++) if (aView[i] !== bView[i]) return false;
			return true;
		}
		static concat(...args) {
			let buffers;
			if (Array.isArray(args[0]) && !(args[1] instanceof Function)) buffers = args[0];
			else if (Array.isArray(args[0]) && args[1] instanceof Function) buffers = args[0];
			else if (args[args.length - 1] instanceof Function) buffers = args.slice(0, args.length - 1);
			else buffers = args;
			let size = 0;
			for (const buffer of buffers) size += buffer.byteLength;
			const res = new Uint8Array(size);
			let offset = 0;
			for (const buffer of buffers) {
				const view = this.toUint8Array(buffer);
				res.set(view, offset);
				offset += view.length;
			}
			if (args[args.length - 1] instanceof Function) return this.toView(res, args[args.length - 1]);
			return res.buffer;
		}
	};
	const STRING_TYPE = "string";
	const HEX_REGEX = /^[0-9a-f\s]+$/i;
	const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	const BASE64URL_REGEX = /^[a-zA-Z0-9-_]+$/;
	var Utf8Converter = class {
		static fromString(text) {
			const s = unescape(encodeURIComponent(text));
			const uintArray = new Uint8Array(s.length);
			for (let i = 0; i < s.length; i++) uintArray[i] = s.charCodeAt(i);
			return uintArray.buffer;
		}
		static toString(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let encodedString = "";
			for (let i = 0; i < buf.length; i++) encodedString += String.fromCharCode(buf[i]);
			return decodeURIComponent(escape(encodedString));
		}
	};
	var Utf16Converter = class {
		static toString(buffer, littleEndian = false) {
			const arrayBuffer = BufferSourceConverter.toArrayBuffer(buffer);
			const dataView = new DataView(arrayBuffer);
			let res = "";
			for (let i = 0; i < arrayBuffer.byteLength; i += 2) {
				const code = dataView.getUint16(i, littleEndian);
				res += String.fromCharCode(code);
			}
			return res;
		}
		static fromString(text, littleEndian = false) {
			const res = /* @__PURE__ */ new ArrayBuffer(text.length * 2);
			const dataView = new DataView(res);
			for (let i = 0; i < text.length; i++) dataView.setUint16(i * 2, text.charCodeAt(i), littleEndian);
			return res;
		}
	};
	var Convert = class Convert {
		static isHex(data) {
			return typeof data === STRING_TYPE && HEX_REGEX.test(data);
		}
		static isBase64(data) {
			return typeof data === STRING_TYPE && BASE64_REGEX.test(data);
		}
		static isBase64Url(data) {
			return typeof data === STRING_TYPE && BASE64URL_REGEX.test(data);
		}
		static ToString(buffer, enc = "utf8") {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			switch (enc.toLowerCase()) {
				case "utf8": return this.ToUtf8String(buf);
				case "binary": return this.ToBinary(buf);
				case "hex": return this.ToHex(buf);
				case "base64": return this.ToBase64(buf);
				case "base64url": return this.ToBase64Url(buf);
				case "utf16le": return Utf16Converter.toString(buf, true);
				case "utf16":
				case "utf16be": return Utf16Converter.toString(buf);
				default: throw new Error(`Unknown type of encoding '${enc}'`);
			}
		}
		static FromString(str, enc = "utf8") {
			if (!str) return /* @__PURE__ */ new ArrayBuffer(0);
			switch (enc.toLowerCase()) {
				case "utf8": return this.FromUtf8String(str);
				case "binary": return this.FromBinary(str);
				case "hex": return this.FromHex(str);
				case "base64": return this.FromBase64(str);
				case "base64url": return this.FromBase64Url(str);
				case "utf16le": return Utf16Converter.fromString(str, true);
				case "utf16":
				case "utf16be": return Utf16Converter.fromString(str);
				default: throw new Error(`Unknown type of encoding '${enc}'`);
			}
		}
		static ToBase64(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			if (typeof btoa !== "undefined") {
				const binary = this.ToString(buf, "binary");
				return btoa(binary);
			} else return Buffer.from(buf).toString("base64");
		}
		static FromBase64(base64) {
			const formatted = this.formatString(base64);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isBase64(formatted)) throw new TypeError("Argument 'base64Text' is not Base64 encoded");
			if (typeof atob !== "undefined") return this.FromBinary(atob(formatted));
			else return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
		}
		static FromBase64Url(base64url) {
			const formatted = this.formatString(base64url);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isBase64Url(formatted)) throw new TypeError("Argument 'base64url' is not Base64Url encoded");
			return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
		}
		static ToBase64Url(data) {
			return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
		}
		static FromUtf8String(text, encoding = Convert.DEFAULT_UTF8_ENCODING) {
			switch (encoding) {
				case "ascii": return this.FromBinary(text);
				case "utf8": return Utf8Converter.fromString(text);
				case "utf16":
				case "utf16be": return Utf16Converter.fromString(text);
				case "utf16le":
				case "usc2": return Utf16Converter.fromString(text, true);
				default: throw new Error(`Unknown type of encoding '${encoding}'`);
			}
		}
		static ToUtf8String(buffer, encoding = Convert.DEFAULT_UTF8_ENCODING) {
			switch (encoding) {
				case "ascii": return this.ToBinary(buffer);
				case "utf8": return Utf8Converter.toString(buffer);
				case "utf16":
				case "utf16be": return Utf16Converter.toString(buffer);
				case "utf16le":
				case "usc2": return Utf16Converter.toString(buffer, true);
				default: throw new Error(`Unknown type of encoding '${encoding}'`);
			}
		}
		static FromBinary(text) {
			const stringLength = text.length;
			const resultView = new Uint8Array(stringLength);
			for (let i = 0; i < stringLength; i++) resultView[i] = text.charCodeAt(i);
			return resultView.buffer;
		}
		static ToBinary(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let res = "";
			for (let i = 0; i < buf.length; i++) res += String.fromCharCode(buf[i]);
			return res;
		}
		static ToHex(buffer) {
			const buf = BufferSourceConverter.toUint8Array(buffer);
			let result = "";
			const len = buf.length;
			for (let i = 0; i < len; i++) {
				const byte = buf[i];
				if (byte < 16) result += "0";
				result += byte.toString(16);
			}
			return result;
		}
		static FromHex(hexString) {
			let formatted = this.formatString(hexString);
			if (!formatted) return /* @__PURE__ */ new ArrayBuffer(0);
			if (!Convert.isHex(formatted)) throw new TypeError("Argument 'hexString' is not HEX encoded");
			if (formatted.length % 2) formatted = `0${formatted}`;
			const res = new Uint8Array(formatted.length / 2);
			for (let i = 0; i < formatted.length; i = i + 2) {
				const c = formatted.slice(i, i + 2);
				res[i / 2] = parseInt(c, 16);
			}
			return res.buffer;
		}
		static ToUtf16String(buffer, littleEndian = false) {
			return Utf16Converter.toString(buffer, littleEndian);
		}
		static FromUtf16String(text, littleEndian = false) {
			return Utf16Converter.fromString(text, littleEndian);
		}
		static Base64Padding(base64) {
			const padCount = 4 - base64.length % 4;
			if (padCount < 4) for (let i = 0; i < padCount; i++) base64 += "=";
			return base64;
		}
		static formatString(data) {
			return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
		}
	};
	Convert.DEFAULT_UTF8_ENCODING = "utf8";
	function assign(target, ...sources) {
		const res = arguments[0];
		for (let i = 1; i < arguments.length; i++) {
			const obj = arguments[i];
			for (const prop in obj) res[prop] = obj[prop];
		}
		return res;
	}
	function combine(...buf) {
		const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
		const res = new Uint8Array(totalByteLength);
		let currentPos = 0;
		buf.map((item) => new Uint8Array(item)).forEach((arr) => {
			for (const item2 of arr) res[currentPos++] = item2;
		});
		return res.buffer;
	}
	function isEqual(bytes1, bytes2) {
		if (!(bytes1 && bytes2)) return false;
		if (bytes1.byteLength !== bytes2.byteLength) return false;
		const b1 = new Uint8Array(bytes1);
		const b2 = new Uint8Array(bytes2);
		for (let i = 0; i < bytes1.byteLength; i++) if (b1[i] !== b2[i]) return false;
		return true;
	}
	exports.BufferSourceConverter = BufferSourceConverter;
	exports.Convert = Convert;
	exports.assign = assign;
	exports.combine = combine;
	exports.isEqual = isEqual;
}));
//#endregion
//#region node_modules/.pnpm/pvutils@1.2.0/node_modules/pvutils/build/utils.js
/*!
Copyright (c) Peculiar Ventures, LLC
*/
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function getUTCDate(date) {
		return new Date(date.getTime() + date.getTimezoneOffset() * 6e4);
	}
	function getParametersValue(parameters, name, defaultValue) {
		var _a;
		if (parameters instanceof Object === false) return defaultValue;
		return (_a = parameters[name]) !== null && _a !== void 0 ? _a : defaultValue;
	}
	function bufferToHexCodes(inputBuffer, inputOffset = 0, inputLength = inputBuffer.byteLength - inputOffset, insertSpace = false) {
		let result = "";
		for (const item of new Uint8Array(inputBuffer, inputOffset, inputLength)) {
			const str = item.toString(16).toUpperCase();
			if (str.length === 1) result += "0";
			result += str;
			if (insertSpace) result += " ";
		}
		return result.trim();
	}
	function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
		if (!(inputBuffer instanceof ArrayBuffer)) {
			baseBlock.error = "Wrong parameter: inputBuffer must be \"ArrayBuffer\"";
			return false;
		}
		if (!inputBuffer.byteLength) {
			baseBlock.error = "Wrong parameter: inputBuffer has zero length";
			return false;
		}
		if (inputOffset < 0) {
			baseBlock.error = "Wrong parameter: inputOffset less than zero";
			return false;
		}
		if (inputLength < 0) {
			baseBlock.error = "Wrong parameter: inputLength less than zero";
			return false;
		}
		if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
			baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
			return false;
		}
		return true;
	}
	function utilFromBase(inputBuffer, inputBase) {
		let result = 0;
		if (inputBuffer.length === 1) return inputBuffer[0];
		for (let i = inputBuffer.length - 1; i >= 0; i--) result += inputBuffer[inputBuffer.length - 1 - i] * Math.pow(2, inputBase * i);
		return result;
	}
	function utilToBase(value, base, reserved = -1) {
		const internalReserved = reserved;
		let internalValue = value;
		let result = 0;
		let biggest = Math.pow(2, base);
		for (let i = 1; i < 8; i++) {
			if (value < biggest) {
				let retBuf;
				if (internalReserved < 0) {
					retBuf = new ArrayBuffer(i);
					result = i;
				} else {
					if (internalReserved < i) return /* @__PURE__ */ new ArrayBuffer(0);
					retBuf = new ArrayBuffer(internalReserved);
					result = internalReserved;
				}
				const retView = new Uint8Array(retBuf);
				for (let j = i - 1; j >= 0; j--) {
					const basis = Math.pow(2, j * base);
					retView[result - j - 1] = Math.floor(internalValue / basis);
					internalValue -= retView[result - j - 1] * basis;
				}
				return retBuf;
			}
			biggest *= Math.pow(2, base);
		}
		return /* @__PURE__ */ new ArrayBuffer(0);
	}
	function utilConcatBuf(...buffers) {
		let outputLength = 0;
		let prevLength = 0;
		for (const buffer of buffers) outputLength += buffer.byteLength;
		const retBuf = new ArrayBuffer(outputLength);
		const retView = new Uint8Array(retBuf);
		for (const buffer of buffers) {
			retView.set(new Uint8Array(buffer), prevLength);
			prevLength += buffer.byteLength;
		}
		return retBuf;
	}
	function utilConcatView(...views) {
		let outputLength = 0;
		let prevLength = 0;
		for (const view of views) outputLength += view.length;
		const retBuf = new ArrayBuffer(outputLength);
		const retView = new Uint8Array(retBuf);
		for (const view of views) {
			retView.set(view, prevLength);
			prevLength += view.length;
		}
		return retView;
	}
	function utilDecodeTC() {
		const buf = new Uint8Array(this.valueHex);
		if (this.valueHex.byteLength >= 2) {
			const condition1 = buf[0] === 255 && buf[1] & 128;
			const condition2 = buf[0] === 0 && (buf[1] & 128) === 0;
			if (condition1 || condition2) this.warnings.push("Needlessly long format");
		}
		const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
		const bigIntView = new Uint8Array(bigIntBuffer);
		for (let i = 0; i < this.valueHex.byteLength; i++) bigIntView[i] = 0;
		bigIntView[0] = buf[0] & 128;
		const bigInt = utilFromBase(bigIntView, 8);
		const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
		const smallIntView = new Uint8Array(smallIntBuffer);
		for (let j = 0; j < this.valueHex.byteLength; j++) smallIntView[j] = buf[j];
		smallIntView[0] &= 127;
		return utilFromBase(smallIntView, 8) - bigInt;
	}
	function utilEncodeTC(value) {
		const modValue = value < 0 ? value * -1 : value;
		let bigInt = 128;
		for (let i = 1; i < 8; i++) {
			if (modValue <= bigInt) {
				if (value < 0) {
					const retBuf = utilToBase(bigInt - modValue, 8, i);
					const retView = new Uint8Array(retBuf);
					retView[0] |= 128;
					return retBuf;
				}
				let retBuf = utilToBase(modValue, 8, i);
				let retView = new Uint8Array(retBuf);
				if (retView[0] & 128) {
					const tempBuf = retBuf.slice(0);
					const tempView = new Uint8Array(tempBuf);
					retBuf = new ArrayBuffer(retBuf.byteLength + 1);
					retView = new Uint8Array(retBuf);
					for (let k = 0; k < tempBuf.byteLength; k++) retView[k + 1] = tempView[k];
					retView[0] = 0;
				}
				return retBuf;
			}
			bigInt *= Math.pow(2, 8);
		}
		return /* @__PURE__ */ new ArrayBuffer(0);
	}
	function isEqualBuffer(inputBuffer1, inputBuffer2) {
		if (inputBuffer1.byteLength !== inputBuffer2.byteLength) return false;
		const view1 = new Uint8Array(inputBuffer1);
		const view2 = new Uint8Array(inputBuffer2);
		for (let i = 0; i < view1.length; i++) if (view1[i] !== view2[i]) return false;
		return true;
	}
	function padNumber(inputNumber, fullLength) {
		const str = inputNumber.toString(10);
		if (fullLength < str.length) return "";
		const dif = fullLength - str.length;
		const padding = Array.from({ length: dif });
		for (let i = 0; i < dif; i++) padding[i] = "0";
		return padding.join("").concat(str);
	}
	const base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	const base64UrlTemplate = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
	function toBase64(input, useUrlTemplate = false, skipPadding = false, skipLeadingZeros = false) {
		let i = 0;
		let flag1 = 0;
		let flag2 = 0;
		let output = "";
		const template = useUrlTemplate ? base64UrlTemplate : base64Template;
		if (skipLeadingZeros) {
			let nonZeroPosition = 0;
			for (let i = 0; i < input.length; i++) if (input.charCodeAt(i) !== 0) {
				nonZeroPosition = i;
				break;
			}
			input = input.slice(nonZeroPosition);
		}
		while (i < input.length) {
			const chr1 = input.charCodeAt(i++);
			if (i >= input.length) flag1 = 1;
			const chr2 = input.charCodeAt(i++);
			if (i >= input.length) flag2 = 1;
			const chr3 = input.charCodeAt(i++);
			const enc1 = chr1 >> 2;
			const enc2 = (chr1 & 3) << 4 | chr2 >> 4;
			let enc3 = (chr2 & 15) << 2 | chr3 >> 6;
			let enc4 = chr3 & 63;
			if (flag1 === 1) enc3 = enc4 = 64;
			else if (flag2 === 1) enc4 = 64;
			if (skipPadding) {
				if (enc3 === 64) output += `${template.charAt(enc1)}${template.charAt(enc2)}`;
				else if (enc4 === 64) output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}`;
				else output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
			} else output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
		}
		return output;
	}
	function fromBase64(input, useUrlTemplate = false, cutTailZeros = false) {
		const template = useUrlTemplate ? base64UrlTemplate : base64Template;
		function indexOf(toSearch) {
			for (let i = 0; i < 64; i++) if (template.charAt(i) === toSearch) return i;
			return 64;
		}
		function test(incoming) {
			return incoming === 64 ? 0 : incoming;
		}
		let i = 0;
		let output = "";
		while (i < input.length) {
			const enc1 = indexOf(input.charAt(i++));
			const enc2 = i >= input.length ? 0 : indexOf(input.charAt(i++));
			const enc3 = i >= input.length ? 0 : indexOf(input.charAt(i++));
			const enc4 = i >= input.length ? 0 : indexOf(input.charAt(i++));
			const chr1 = test(enc1) << 2 | test(enc2) >> 4;
			const chr2 = (test(enc2) & 15) << 4 | test(enc3) >> 2;
			const chr3 = (test(enc3) & 3) << 6 | test(enc4);
			output += String.fromCharCode(chr1);
			if (enc3 !== 64) output += String.fromCharCode(chr2);
			if (enc4 !== 64) output += String.fromCharCode(chr3);
		}
		if (cutTailZeros) {
			const outputLength = output.length;
			let nonZeroStart = -1;
			for (let i = outputLength - 1; i >= 0; i--) if (output.charCodeAt(i) !== 0) {
				nonZeroStart = i;
				break;
			}
			if (nonZeroStart !== -1) output = output.slice(0, nonZeroStart + 1);
			else output = "";
		}
		return output;
	}
	function arrayBufferToString(buffer) {
		let resultString = "";
		const view = new Uint8Array(buffer);
		for (const element of view) resultString += String.fromCharCode(element);
		return resultString;
	}
	function stringToArrayBuffer(str) {
		const stringLength = str.length;
		const resultBuffer = new ArrayBuffer(stringLength);
		const resultView = new Uint8Array(resultBuffer);
		for (let i = 0; i < stringLength; i++) resultView[i] = str.charCodeAt(i);
		return resultBuffer;
	}
	const log2 = Math.log(2);
	function nearestPowerOf2(length) {
		const base = Math.log(length) / log2;
		const floor = Math.floor(base);
		const round = Math.round(base);
		return floor === round ? floor : round;
	}
	function clearProps(object, propsArray) {
		for (const prop of propsArray) delete object[prop];
	}
	exports.arrayBufferToString = arrayBufferToString;
	exports.bufferToHexCodes = bufferToHexCodes;
	exports.checkBufferParams = checkBufferParams;
	exports.clearProps = clearProps;
	exports.fromBase64 = fromBase64;
	exports.getParametersValue = getParametersValue;
	exports.getUTCDate = getUTCDate;
	exports.isEqualBuffer = isEqualBuffer;
	exports.nearestPowerOf2 = nearestPowerOf2;
	exports.padNumber = padNumber;
	exports.stringToArrayBuffer = stringToArrayBuffer;
	exports.toBase64 = toBase64;
	exports.utilConcatBuf = utilConcatBuf;
	exports.utilConcatView = utilConcatView;
	exports.utilDecodeTC = utilDecodeTC;
	exports.utilEncodeTC = utilEncodeTC;
	exports.utilFromBase = utilFromBase;
	exports.utilToBase = utilToBase;
}));
//#endregion
//#region node_modules/.pnpm/asn1js@3.0.10/node_modules/asn1js/build/index.js
/*!
* Copyright (c) 2014, GMO GlobalSign
* Copyright (c) 2015-2022, Peculiar Ventures
* All rights reserved.
* 
* Author 2014-2019, Yury Strozhevsky
* 
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
* 
* * Redistributions of source code must retain the above copyright notice, this
*   list of conditions and the following disclaimer.
* 
* * Redistributions in binary form must reproduce the above copyright notice, this
*   list of conditions and the following disclaimer in the documentation and/or
*   other materials provided with the distribution.
* 
* * Neither the name of the copyright holder nor the names of its
*   contributors may be used to endorse or promote products derived from
*   this software without specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
*/
var require_build = /* @__PURE__ */ __commonJSMin(((exports) => {
	var pvtsutils = require_build$1();
	var pvutils = require_utils();
	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) Object.keys(e).forEach(function(k) {
			if (k !== "default") {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function() {
						return e[k];
					}
				});
			}
		});
		n.default = e;
		return Object.freeze(n);
	}
	var pvtsutils__namespace = /*#__PURE__*/ _interopNamespaceDefault(pvtsutils);
	var pvutils__namespace = /*#__PURE__*/ _interopNamespaceDefault(pvutils);
	function assertBigInt() {
		if (typeof BigInt === "undefined") throw new Error("BigInt is not defined. Your environment doesn't implement BigInt.");
	}
	function concat(buffers) {
		let outputLength = 0;
		let prevLength = 0;
		for (let i = 0; i < buffers.length; i++) {
			const buffer = buffers[i];
			outputLength += buffer.byteLength;
		}
		const retView = new Uint8Array(outputLength);
		for (let i = 0; i < buffers.length; i++) {
			const buffer = buffers[i];
			retView.set(new Uint8Array(buffer), prevLength);
			prevLength += buffer.byteLength;
		}
		return retView.buffer;
	}
	function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength) {
		if (!(inputBuffer instanceof Uint8Array)) {
			baseBlock.error = "Wrong parameter: inputBuffer must be 'Uint8Array'";
			return false;
		}
		if (!inputBuffer.byteLength) {
			baseBlock.error = "Wrong parameter: inputBuffer has zero length";
			return false;
		}
		if (inputOffset < 0) {
			baseBlock.error = "Wrong parameter: inputOffset less than zero";
			return false;
		}
		if (inputLength < 0) {
			baseBlock.error = "Wrong parameter: inputLength less than zero";
			return false;
		}
		if (inputBuffer.byteLength - inputOffset - inputLength < 0) {
			baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
			return false;
		}
		return true;
	}
	var ViewWriter = class {
		constructor() {
			this.items = [];
		}
		write(buf) {
			this.items.push(buf);
		}
		final() {
			return concat(this.items);
		}
	};
	const powers2 = [new Uint8Array([1])];
	const digitsString = "0123456789";
	const NAME = "name";
	const VALUE_HEX_VIEW = "valueHexView";
	const IS_HEX_ONLY = "isHexOnly";
	const ID_BLOCK = "idBlock";
	const TAG_CLASS = "tagClass";
	const TAG_NUMBER = "tagNumber";
	const IS_CONSTRUCTED = "isConstructed";
	const FROM_BER = "fromBER";
	const TO_BER = "toBER";
	const LOCAL = "local";
	const EMPTY_STRING = "";
	const EMPTY_BUFFER = /* @__PURE__ */ new ArrayBuffer(0);
	const EMPTY_VIEW = /* @__PURE__ */ new Uint8Array(0);
	const END_OF_CONTENT_NAME = "EndOfContent";
	const OCTET_STRING_NAME = "OCTET STRING";
	const BIT_STRING_NAME = "BIT STRING";
	function HexBlock(BaseClass) {
		var _a = class Some extends BaseClass {
			get valueHex() {
				return this.valueHexView.slice().buffer;
			}
			set valueHex(value) {
				this.valueHexView = new Uint8Array(value);
			}
			constructor(...args) {
				var _b;
				super(...args);
				const params = args[0] || {};
				this.isHexOnly = (_b = params.isHexOnly) !== null && _b !== void 0 ? _b : false;
				this.valueHexView = params.valueHex ? pvtsutils__namespace.BufferSourceConverter.toUint8Array(params.valueHex) : EMPTY_VIEW;
			}
			fromBER(inputBuffer, inputOffset, inputLength, _context) {
				const view = inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer;
				if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
				const endLength = inputOffset + inputLength;
				this.valueHexView = view.subarray(inputOffset, endLength);
				if (!this.valueHexView.length) {
					this.warnings.push("Zero buffer length");
					return inputOffset;
				}
				this.blockLength = inputLength;
				return endLength;
			}
			toBER(sizeOnly = false) {
				if (!this.isHexOnly) {
					this.error = "Flag 'isHexOnly' is not set, abort";
					return EMPTY_BUFFER;
				}
				if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
				return this.valueHexView.byteLength === this.valueHexView.buffer.byteLength ? this.valueHexView.buffer : this.valueHexView.slice().buffer;
			}
			toJSON() {
				return {
					...super.toJSON(),
					isHexOnly: this.isHexOnly,
					valueHex: pvtsutils__namespace.Convert.ToHex(this.valueHexView)
				};
			}
		};
		return _a.NAME = "hexBlock", _a;
	}
	var LocalBaseBlock = class {
		static blockName() {
			return this.NAME;
		}
		get valueBeforeDecode() {
			return this.valueBeforeDecodeView.slice().buffer;
		}
		set valueBeforeDecode(value) {
			this.valueBeforeDecodeView = new Uint8Array(value);
		}
		constructor({ blockLength = 0, error = EMPTY_STRING, warnings = [], valueBeforeDecode = EMPTY_VIEW } = {}) {
			this.blockLength = blockLength;
			this.error = error;
			this.warnings = warnings;
			this.valueBeforeDecodeView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(valueBeforeDecode);
		}
		toJSON() {
			return {
				blockName: this.constructor.NAME,
				blockLength: this.blockLength,
				error: this.error,
				warnings: this.warnings,
				valueBeforeDecode: pvtsutils__namespace.Convert.ToHex(this.valueBeforeDecodeView)
			};
		}
	};
	LocalBaseBlock.NAME = "baseBlock";
	var ValueBlock = class extends LocalBaseBlock {
		fromBER(_inputBuffer, _inputOffset, _inputLength, _context) {
			throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
		}
		toBER(_sizeOnly, _writer) {
			throw TypeError("User need to make a specific function in a class which extends 'ValueBlock'");
		}
	};
	ValueBlock.NAME = "valueBlock";
	var LocalIdentificationBlock = class extends HexBlock(LocalBaseBlock) {
		constructor({ idBlock = {} } = {}) {
			var _a, _b, _c, _d;
			super();
			if (idBlock) {
				this.isHexOnly = (_a = idBlock.isHexOnly) !== null && _a !== void 0 ? _a : false;
				this.valueHexView = idBlock.valueHex ? pvtsutils__namespace.BufferSourceConverter.toUint8Array(idBlock.valueHex) : EMPTY_VIEW;
				this.tagClass = (_b = idBlock.tagClass) !== null && _b !== void 0 ? _b : -1;
				this.tagNumber = (_c = idBlock.tagNumber) !== null && _c !== void 0 ? _c : -1;
				this.isConstructed = (_d = idBlock.isConstructed) !== null && _d !== void 0 ? _d : false;
			} else {
				this.tagClass = -1;
				this.tagNumber = -1;
				this.isConstructed = false;
			}
		}
		toBER(sizeOnly = false) {
			let firstOctet = 0;
			switch (this.tagClass) {
				case 1:
					firstOctet |= 0;
					break;
				case 2:
					firstOctet |= 64;
					break;
				case 3:
					firstOctet |= 128;
					break;
				case 4:
					firstOctet |= 192;
					break;
				default:
					this.error = "Unknown tag class";
					return EMPTY_BUFFER;
			}
			if (this.isConstructed) firstOctet |= 32;
			if (this.tagNumber < 31 && !this.isHexOnly) {
				const retView = /* @__PURE__ */ new Uint8Array(1);
				if (!sizeOnly) {
					let number = this.tagNumber;
					number &= 31;
					firstOctet |= number;
					retView[0] = firstOctet;
				}
				return retView.buffer;
			}
			if (!this.isHexOnly) {
				const encodedBuf = pvutils__namespace.utilToBase(this.tagNumber, 7);
				const encodedView = new Uint8Array(encodedBuf);
				const size = encodedBuf.byteLength;
				const retView = new Uint8Array(size + 1);
				retView[0] = firstOctet | 31;
				if (!sizeOnly) {
					for (let i = 0; i < size - 1; i++) retView[i + 1] = encodedView[i] | 128;
					retView[size] = encodedView[size - 1];
				}
				return retView.buffer;
			}
			const retView = new Uint8Array(this.valueHexView.byteLength + 1);
			retView[0] = firstOctet | 31;
			if (!sizeOnly) {
				const curView = this.valueHexView;
				for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 128;
				retView[this.valueHexView.byteLength] = curView[curView.length - 1];
			}
			return retView.buffer;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
			const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
			if (intBuffer.length === 0) {
				this.error = "Zero buffer length";
				return -1;
			}
			switch (intBuffer[0] & 192) {
				case 0:
					this.tagClass = 1;
					break;
				case 64:
					this.tagClass = 2;
					break;
				case 128:
					this.tagClass = 3;
					break;
				case 192:
					this.tagClass = 4;
					break;
				default:
					this.error = "Unknown tag class";
					return -1;
			}
			this.isConstructed = (intBuffer[0] & 32) === 32;
			this.isHexOnly = false;
			const tagNumberMask = intBuffer[0] & 31;
			if (tagNumberMask !== 31) {
				this.tagNumber = tagNumberMask;
				this.blockLength = 1;
			} else {
				let count = 0;
				while (true) {
					const tagByteIndex = count + 1;
					if (tagByteIndex >= intBuffer.length) {
						this.error = "End of input reached before message was fully decoded";
						return -1;
					}
					count++;
					if ((intBuffer[tagByteIndex] & 128) === 0) break;
				}
				this.blockLength = count + 1;
				const intTagNumberBuffer = this.valueHexView = new Uint8Array(count);
				for (let i = 0; i < count; i++) intTagNumberBuffer[i] = intBuffer[i + 1] & 127;
				if (this.blockLength <= 9) this.tagNumber = pvutils__namespace.utilFromBase(intTagNumberBuffer, 7);
				else {
					this.isHexOnly = true;
					this.warnings.push("Tag too long, represented as hex-coded");
				}
			}
			if (this.tagClass === 1 && this.isConstructed) switch (this.tagNumber) {
				case 1:
				case 2:
				case 5:
				case 6:
				case 9:
				case 13:
				case 14:
				case 23:
				case 24:
				case 31:
				case 32:
				case 33:
				case 34:
					this.error = "Constructed encoding used for primitive type";
					return -1;
			}
			return inputOffset + this.blockLength;
		}
		toJSON() {
			return {
				...super.toJSON(),
				tagClass: this.tagClass,
				tagNumber: this.tagNumber,
				isConstructed: this.isConstructed
			};
		}
	};
	LocalIdentificationBlock.NAME = "identificationBlock";
	var LocalLengthBlock = class extends LocalBaseBlock {
		constructor({ lenBlock = {} } = {}) {
			var _a, _b, _c;
			super();
			this.isIndefiniteForm = (_a = lenBlock.isIndefiniteForm) !== null && _a !== void 0 ? _a : false;
			this.longFormUsed = (_b = lenBlock.longFormUsed) !== null && _b !== void 0 ? _b : false;
			this.length = (_c = lenBlock.length) !== null && _c !== void 0 ? _c : 0;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const view = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
			const intBuffer = view.subarray(inputOffset, inputOffset + inputLength);
			if (intBuffer.length === 0) {
				this.error = "Zero buffer length";
				return -1;
			}
			if (intBuffer[0] === 255) {
				this.error = "Length block 0xFF is reserved by standard";
				return -1;
			}
			this.isIndefiniteForm = intBuffer[0] === 128;
			if (this.isIndefiniteForm) {
				this.blockLength = 1;
				return inputOffset + this.blockLength;
			}
			this.longFormUsed = !!(intBuffer[0] & 128);
			if (this.longFormUsed === false) {
				this.length = intBuffer[0];
				this.blockLength = 1;
				return inputOffset + this.blockLength;
			}
			const count = intBuffer[0] & 127;
			if (count > 8) {
				this.error = "Too big integer";
				return -1;
			}
			if (count + 1 > intBuffer.length) {
				this.error = "End of input reached before message was fully decoded";
				return -1;
			}
			const lenOffset = inputOffset + 1;
			const lengthBufferView = view.subarray(lenOffset, lenOffset + count);
			if (lengthBufferView[count - 1] === 0) this.warnings.push("Needlessly long encoded length");
			this.length = pvutils__namespace.utilFromBase(lengthBufferView, 8);
			if (this.longFormUsed && this.length <= 127) this.warnings.push("Unnecessary usage of long length form");
			this.blockLength = count + 1;
			return inputOffset + this.blockLength;
		}
		toBER(sizeOnly = false) {
			let retBuf;
			let retView;
			if (this.length > 127) this.longFormUsed = true;
			if (this.isIndefiniteForm) {
				retBuf = /* @__PURE__ */ new ArrayBuffer(1);
				if (sizeOnly === false) {
					retView = new Uint8Array(retBuf);
					retView[0] = 128;
				}
				return retBuf;
			}
			if (this.longFormUsed) {
				const encodedBuf = pvutils__namespace.utilToBase(this.length, 8);
				if (encodedBuf.byteLength > 127) {
					this.error = "Too big length";
					return EMPTY_BUFFER;
				}
				retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
				if (sizeOnly) return retBuf;
				const encodedView = new Uint8Array(encodedBuf);
				retView = new Uint8Array(retBuf);
				retView[0] = encodedBuf.byteLength | 128;
				for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];
				return retBuf;
			}
			retBuf = /* @__PURE__ */ new ArrayBuffer(1);
			if (sizeOnly === false) {
				retView = new Uint8Array(retBuf);
				retView[0] = this.length;
			}
			return retBuf;
		}
		toJSON() {
			return {
				...super.toJSON(),
				isIndefiniteForm: this.isIndefiniteForm,
				longFormUsed: this.longFormUsed,
				length: this.length
			};
		}
	};
	LocalLengthBlock.NAME = "lengthBlock";
	const typeStore = {};
	var BaseBlock = class extends LocalBaseBlock {
		constructor({ name = EMPTY_STRING, optional = false, primitiveSchema, ...parameters } = {}, valueBlockType) {
			super(parameters);
			this.name = name;
			this.optional = optional;
			if (primitiveSchema) this.primitiveSchema = primitiveSchema;
			this.idBlock = new LocalIdentificationBlock(parameters);
			this.lenBlock = new LocalLengthBlock(parameters);
			this.valueBlock = valueBlockType ? new valueBlockType(parameters) : new ValueBlock(parameters);
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length, context);
			if (resultOffset === -1) {
				this.error = this.valueBlock.error;
				return resultOffset;
			}
			if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
			if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
			if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
			return resultOffset;
		}
		toBER(sizeOnly, writer) {
			const _writer = writer || new ViewWriter();
			if (!writer) prepareIndefiniteForm(this);
			const idBlockBuf = this.idBlock.toBER(sizeOnly);
			_writer.write(idBlockBuf);
			if (this.lenBlock.isIndefiniteForm) {
				_writer.write(new Uint8Array([128]).buffer);
				this.valueBlock.toBER(sizeOnly, _writer);
				_writer.write(/* @__PURE__ */ new ArrayBuffer(2));
			} else {
				const valueBlockBuf = this.valueBlock.toBER(sizeOnly);
				this.lenBlock.length = valueBlockBuf.byteLength;
				const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
				_writer.write(lenBlockBuf);
				_writer.write(valueBlockBuf);
			}
			if (!writer) return _writer.final();
			return EMPTY_BUFFER;
		}
		toJSON() {
			const object = {
				...super.toJSON(),
				idBlock: this.idBlock.toJSON(),
				lenBlock: this.lenBlock.toJSON(),
				valueBlock: this.valueBlock.toJSON(),
				name: this.name,
				optional: this.optional
			};
			if (this.primitiveSchema) object.primitiveSchema = this.primitiveSchema.toJSON();
			return object;
		}
		toString(encoding = "ascii") {
			if (encoding === "ascii") return this.onAsciiEncoding();
			return pvtsutils__namespace.Convert.ToHex(this.toBER());
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${pvtsutils__namespace.Convert.ToHex(this.valueBlock.valueBeforeDecodeView)}`;
		}
		isEqual(other) {
			if (this === other) return true;
			if (!(other instanceof this.constructor)) return false;
			const thisRaw = this.toBER();
			const otherRaw = other.toBER();
			return pvutils__namespace.isEqualBuffer(thisRaw, otherRaw);
		}
	};
	BaseBlock.NAME = "BaseBlock";
	function prepareIndefiniteForm(baseBlock) {
		var _a;
		if (baseBlock instanceof typeStore.Constructed) {
			for (const value of baseBlock.valueBlock.value) if (prepareIndefiniteForm(value)) baseBlock.lenBlock.isIndefiniteForm = true;
		}
		return !!((_a = baseBlock.lenBlock) === null || _a === void 0 ? void 0 : _a.isIndefiniteForm);
	}
	var BaseStringBlock = class extends BaseBlock {
		getValue() {
			return this.valueBlock.value;
		}
		setValue(value) {
			this.valueBlock.value = value;
		}
		constructor({ value = EMPTY_STRING, ...parameters } = {}, stringValueBlockType) {
			super(parameters, stringValueBlockType);
			if (value) this.fromString(value);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length);
			if (resultOffset === -1) {
				this.error = this.valueBlock.error;
				return resultOffset;
			}
			this.fromBuffer(this.valueBlock.valueHexView);
			if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
			if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
			if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
			return resultOffset;
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : '${this.valueBlock.value}'`;
		}
	};
	BaseStringBlock.NAME = "BaseStringBlock";
	var LocalPrimitiveValueBlock = class extends HexBlock(ValueBlock) {
		constructor({ isHexOnly = true, ...parameters } = {}) {
			super(parameters);
			this.isHexOnly = isHexOnly;
		}
	};
	LocalPrimitiveValueBlock.NAME = "PrimitiveValueBlock";
	var _a$w;
	var Primitive = class extends BaseBlock {
		constructor(parameters = {}) {
			super(parameters, LocalPrimitiveValueBlock);
			this.idBlock.isConstructed = false;
		}
	};
	_a$w = Primitive;
	(() => {
		typeStore.Primitive = _a$w;
	})();
	Primitive.NAME = "PRIMITIVE";
	const DEFAULT_MAX_DEPTH = 100;
	const DEFAULT_MAX_NODES = 1e4;
	const DEFAULT_MAX_CONTENT_LENGTH = 16777216;
	const MAX_DEPTH_EXCEEDED_ERROR = "Maximum ASN.1 nesting depth exceeded";
	const MAX_NODES_EXCEEDED_ERROR = "Maximum ASN.1 node count exceeded";
	const MAX_CONTENT_LENGTH_EXCEEDED_ERROR = "Maximum ASN.1 content length exceeded";
	function createFromBerContext(options = {}) {
		var _a, _b, _c;
		return {
			depth: 0,
			maxDepth: (_a = options.maxDepth) !== null && _a !== void 0 ? _a : DEFAULT_MAX_DEPTH,
			nodesCount: 0,
			maxNodes: (_b = options.maxNodes) !== null && _b !== void 0 ? _b : DEFAULT_MAX_NODES,
			maxContentLength: (_c = options.maxContentLength) !== null && _c !== void 0 ? _c : DEFAULT_MAX_CONTENT_LENGTH
		};
	}
	function createErrorResult(error) {
		const result = new BaseBlock({}, ValueBlock);
		result.error = error;
		return {
			offset: -1,
			result
		};
	}
	function checkNodesLimit(context) {
		context.nodesCount += 1;
		if (context.nodesCount > context.maxNodes) return MAX_NODES_EXCEEDED_ERROR;
	}
	function checkContentLengthLimit(inputLength, context) {
		if (inputLength > context.maxContentLength) return MAX_CONTENT_LENGTH_EXCEEDED_ERROR;
	}
	function localFromBERWithChildContext(inputBuffer, inputOffset, inputLength, context) {
		const childDepth = context.depth + 1;
		if (childDepth > context.maxDepth) return createErrorResult(MAX_DEPTH_EXCEEDED_ERROR);
		context.depth = childDepth;
		try {
			return localFromBER(inputBuffer, inputOffset, inputLength, context);
		} finally {
			context.depth -= 1;
		}
	}
	function localChangeType(inputObject, newType) {
		if (inputObject instanceof newType) return inputObject;
		const newObject = new newType();
		newObject.idBlock = inputObject.idBlock;
		newObject.lenBlock = inputObject.lenBlock;
		newObject.warnings = inputObject.warnings;
		newObject.valueBeforeDecodeView = inputObject.valueBeforeDecodeView;
		return newObject;
	}
	function localFromBER(inputBuffer, inputOffset = 0, inputLength = inputBuffer.length, context = createFromBerContext()) {
		const incomingOffset = inputOffset;
		let returnObject = new BaseBlock({}, ValueBlock);
		const baseBlock = new LocalBaseBlock();
		if (!checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)) {
			returnObject.error = baseBlock.error;
			return {
				offset: -1,
				result: returnObject
			};
		}
		if (!inputBuffer.subarray(inputOffset, inputOffset + inputLength).length) {
			returnObject.error = "Zero buffer length";
			return {
				offset: -1,
				result: returnObject
			};
		}
		const nodesLimitError = checkNodesLimit(context);
		if (nodesLimitError) {
			returnObject.error = nodesLimitError;
			return {
				offset: -1,
				result: returnObject
			};
		}
		let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
		if (returnObject.idBlock.warnings.length) returnObject.warnings.concat(returnObject.idBlock.warnings);
		if (resultOffset === -1) {
			returnObject.error = returnObject.idBlock.error;
			return {
				offset: -1,
				result: returnObject
			};
		}
		inputOffset = resultOffset;
		inputLength -= returnObject.idBlock.blockLength;
		resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
		if (returnObject.lenBlock.warnings.length) returnObject.warnings.concat(returnObject.lenBlock.warnings);
		if (resultOffset === -1) {
			returnObject.error = returnObject.lenBlock.error;
			return {
				offset: -1,
				result: returnObject
			};
		}
		inputOffset = resultOffset;
		inputLength -= returnObject.lenBlock.blockLength;
		const valueLength = returnObject.lenBlock.isIndefiniteForm ? inputLength : returnObject.lenBlock.length;
		const contentLengthError = checkContentLengthLimit(valueLength, context);
		if (contentLengthError) {
			returnObject.error = contentLengthError;
			return {
				offset: -1,
				result: returnObject
			};
		}
		if (!returnObject.idBlock.isConstructed && returnObject.lenBlock.isIndefiniteForm) {
			returnObject.error = "Indefinite length form used for primitive encoding form";
			return {
				offset: -1,
				result: returnObject
			};
		}
		let newASN1Type = BaseBlock;
		switch (returnObject.idBlock.tagClass) {
			case 1:
				if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
					returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
					return {
						offset: -1,
						result: returnObject
					};
				}
				switch (returnObject.idBlock.tagNumber) {
					case 0:
						if (returnObject.idBlock.isConstructed && returnObject.lenBlock.length > 0) {
							returnObject.error = "Type [UNIVERSAL 0] is reserved";
							return {
								offset: -1,
								result: returnObject
							};
						}
						newASN1Type = typeStore.EndOfContent;
						break;
					case 1:
						newASN1Type = typeStore.Boolean;
						break;
					case 2:
						newASN1Type = typeStore.Integer;
						break;
					case 3:
						newASN1Type = typeStore.BitString;
						break;
					case 4:
						newASN1Type = typeStore.OctetString;
						break;
					case 5:
						newASN1Type = typeStore.Null;
						break;
					case 6:
						newASN1Type = typeStore.ObjectIdentifier;
						break;
					case 10:
						newASN1Type = typeStore.Enumerated;
						break;
					case 12:
						newASN1Type = typeStore.Utf8String;
						break;
					case 13:
						newASN1Type = typeStore.RelativeObjectIdentifier;
						break;
					case 14:
						newASN1Type = typeStore.TIME;
						break;
					case 15:
						returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
						return {
							offset: -1,
							result: returnObject
						};
					case 16:
						newASN1Type = typeStore.Sequence;
						break;
					case 17:
						newASN1Type = typeStore.Set;
						break;
					case 18:
						newASN1Type = typeStore.NumericString;
						break;
					case 19:
						newASN1Type = typeStore.PrintableString;
						break;
					case 20:
						newASN1Type = typeStore.TeletexString;
						break;
					case 21:
						newASN1Type = typeStore.VideotexString;
						break;
					case 22:
						newASN1Type = typeStore.IA5String;
						break;
					case 23:
						newASN1Type = typeStore.UTCTime;
						break;
					case 24:
						newASN1Type = typeStore.GeneralizedTime;
						break;
					case 25:
						newASN1Type = typeStore.GraphicString;
						break;
					case 26:
						newASN1Type = typeStore.VisibleString;
						break;
					case 27:
						newASN1Type = typeStore.GeneralString;
						break;
					case 28:
						newASN1Type = typeStore.UniversalString;
						break;
					case 29:
						newASN1Type = typeStore.CharacterString;
						break;
					case 30:
						newASN1Type = typeStore.BmpString;
						break;
					case 31:
						newASN1Type = typeStore.DATE;
						break;
					case 32:
						newASN1Type = typeStore.TimeOfDay;
						break;
					case 33:
						newASN1Type = typeStore.DateTime;
						break;
					case 34:
						newASN1Type = typeStore.Duration;
						break;
					default: {
						const newObject = returnObject.idBlock.isConstructed ? new typeStore.Constructed() : new typeStore.Primitive();
						newObject.idBlock = returnObject.idBlock;
						newObject.lenBlock = returnObject.lenBlock;
						newObject.warnings = returnObject.warnings;
						returnObject = newObject;
					}
				}
				break;
			default: newASN1Type = returnObject.idBlock.isConstructed ? typeStore.Constructed : typeStore.Primitive;
		}
		returnObject = localChangeType(returnObject, newASN1Type);
		resultOffset = returnObject.fromBER(inputBuffer, inputOffset, valueLength, context);
		returnObject.valueBeforeDecodeView = inputBuffer.subarray(incomingOffset, incomingOffset + returnObject.blockLength);
		return {
			offset: resultOffset,
			result: returnObject
		};
	}
	function fromBER(inputBuffer, options = {}) {
		if (!inputBuffer.byteLength) {
			const result = new BaseBlock({}, ValueBlock);
			result.error = "Input buffer has zero length";
			return {
				offset: -1,
				result
			};
		}
		return localFromBER(pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer).slice(), 0, inputBuffer.byteLength, createFromBerContext(options));
	}
	function checkLen(indefiniteLength, length) {
		if (indefiniteLength) return 1;
		return length;
	}
	var LocalConstructedValueBlock = class extends ValueBlock {
		constructor({ value = [], isIndefiniteForm = false, ...parameters } = {}) {
			super(parameters);
			this.value = value;
			this.isIndefiniteForm = isIndefiniteForm;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			const view = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
			if (!checkBufferParams(this, view, inputOffset, inputLength)) return -1;
			this.valueBeforeDecodeView = view.subarray(inputOffset, inputOffset + inputLength);
			if (this.valueBeforeDecodeView.length === 0) {
				this.warnings.push("Zero buffer length");
				return inputOffset;
			}
			let currentOffset = inputOffset;
			while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
				const returnObject = localFromBERWithChildContext(view, currentOffset, inputLength, parseContext);
				if (returnObject.offset === -1) {
					this.error = returnObject.result.error;
					this.warnings.concat(returnObject.result.warnings);
					return -1;
				}
				currentOffset = returnObject.offset;
				this.blockLength += returnObject.result.blockLength;
				inputLength -= returnObject.result.blockLength;
				this.value.push(returnObject.result);
				if (this.isIndefiniteForm && returnObject.result.constructor.NAME === END_OF_CONTENT_NAME) break;
			}
			if (this.isIndefiniteForm) {
				if (this.value[this.value.length - 1].constructor.NAME === END_OF_CONTENT_NAME) this.value.pop();
				else this.warnings.push("No EndOfContent block encoded");
			}
			return currentOffset;
		}
		toBER(sizeOnly, writer) {
			const _writer = writer || new ViewWriter();
			for (let i = 0; i < this.value.length; i++) this.value[i].toBER(sizeOnly, _writer);
			if (!writer) return _writer.final();
			return EMPTY_BUFFER;
		}
		toJSON() {
			const object = {
				...super.toJSON(),
				isIndefiniteForm: this.isIndefiniteForm,
				value: []
			};
			for (const value of this.value) object.value.push(value.toJSON());
			return object;
		}
	};
	LocalConstructedValueBlock.NAME = "ConstructedValueBlock";
	var _a$v;
	var Constructed = class extends BaseBlock {
		constructor(parameters = {}) {
			super(parameters, LocalConstructedValueBlock);
			this.idBlock.isConstructed = true;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
			const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm ? inputLength : this.lenBlock.length, context);
			if (resultOffset === -1) {
				this.error = this.valueBlock.error;
				return resultOffset;
			}
			if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
			if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
			if (!this.valueBlock.error.length) this.blockLength += this.valueBlock.blockLength;
			return resultOffset;
		}
		onAsciiEncoding() {
			const values = [];
			for (const value of this.valueBlock.value) values.push(value.toString("ascii").split("\n").map((o) => `  ${o}`).join("\n"));
			const blockName = this.idBlock.tagClass === 3 ? `[${this.idBlock.tagNumber}]` : this.constructor.NAME;
			return values.length ? `${blockName} :\n${values.join("\n")}` : `${blockName} :`;
		}
	};
	_a$v = Constructed;
	(() => {
		typeStore.Constructed = _a$v;
	})();
	Constructed.NAME = "CONSTRUCTED";
	var LocalEndOfContentValueBlock = class extends ValueBlock {
		fromBER(inputBuffer, inputOffset, _inputLength) {
			return inputOffset;
		}
		toBER(_sizeOnly) {
			return EMPTY_BUFFER;
		}
	};
	LocalEndOfContentValueBlock.override = "EndOfContentValueBlock";
	var _a$u;
	var EndOfContent = class extends BaseBlock {
		constructor(parameters = {}) {
			super(parameters, LocalEndOfContentValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 0;
		}
	};
	_a$u = EndOfContent;
	(() => {
		typeStore.EndOfContent = _a$u;
	})();
	EndOfContent.NAME = END_OF_CONTENT_NAME;
	var _a$t;
	var Null = class extends BaseBlock {
		constructor(parameters = {}) {
			super(parameters, ValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 5;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			if (this.lenBlock.length > 0) this.warnings.push("Non-zero length of value block for Null type");
			if (!this.idBlock.error.length) this.blockLength += this.idBlock.blockLength;
			if (!this.lenBlock.error.length) this.blockLength += this.lenBlock.blockLength;
			this.blockLength += inputLength;
			if (inputOffset + inputLength > inputBuffer.byteLength) {
				this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
				return -1;
			}
			return inputOffset + inputLength;
		}
		toBER(sizeOnly, writer) {
			const retBuf = /* @__PURE__ */ new ArrayBuffer(2);
			if (!sizeOnly) {
				const retView = new Uint8Array(retBuf);
				retView[0] = 5;
				retView[1] = 0;
			}
			if (writer) writer.write(retBuf);
			return retBuf;
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME}`;
		}
	};
	_a$t = Null;
	(() => {
		typeStore.Null = _a$t;
	})();
	Null.NAME = "NULL";
	var LocalBooleanValueBlock = class extends HexBlock(ValueBlock) {
		get value() {
			for (const octet of this.valueHexView) if (octet > 0) return true;
			return false;
		}
		set value(value) {
			this.valueHexView[0] = value ? 255 : 0;
		}
		constructor({ value, ...parameters } = {}) {
			super(parameters);
			if (parameters.valueHex) this.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(parameters.valueHex);
			else this.valueHexView = /* @__PURE__ */ new Uint8Array(1);
			if (value) this.value = value;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
			this.valueHexView = inputView.subarray(inputOffset, inputOffset + inputLength);
			if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
			this.isHexOnly = true;
			pvutils__namespace.utilDecodeTC.call(this);
			this.blockLength = inputLength;
			return inputOffset + inputLength;
		}
		toBER() {
			return this.valueHexView.slice();
		}
		toJSON() {
			return {
				...super.toJSON(),
				value: this.value
			};
		}
	};
	LocalBooleanValueBlock.NAME = "BooleanValueBlock";
	var _a$s;
	var Boolean = class extends BaseBlock {
		getValue() {
			return this.valueBlock.value;
		}
		setValue(value) {
			this.valueBlock.value = value;
		}
		constructor(parameters = {}) {
			super(parameters, LocalBooleanValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 1;
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${this.getValue}`;
		}
	};
	_a$s = Boolean;
	(() => {
		typeStore.Boolean = _a$s;
	})();
	Boolean.NAME = "BOOLEAN";
	var LocalOctetStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
		constructor({ isConstructed = false, ...parameters } = {}) {
			super(parameters);
			this.isConstructed = isConstructed;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			let resultOffset = 0;
			if (this.isConstructed) {
				this.isHexOnly = false;
				resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength, context);
				if (resultOffset === -1) return resultOffset;
				for (let i = 0; i < this.value.length; i++) {
					const currentBlockName = this.value[i].constructor.NAME;
					if (currentBlockName === END_OF_CONTENT_NAME) {
						if (this.isIndefiniteForm) break;
						else {
							this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
							return -1;
						}
					}
					if (currentBlockName !== OCTET_STRING_NAME) {
						this.error = "OCTET STRING may consists of OCTET STRINGs only";
						return -1;
					}
				}
			} else {
				this.isHexOnly = true;
				resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
				this.blockLength = inputLength;
			}
			return resultOffset;
		}
		toBER(sizeOnly, writer) {
			if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
			return sizeOnly ? new ArrayBuffer(this.valueHexView.byteLength) : this.valueHexView.slice().buffer;
		}
		toJSON() {
			return {
				...super.toJSON(),
				isConstructed: this.isConstructed
			};
		}
	};
	LocalOctetStringValueBlock.NAME = "OctetStringValueBlock";
	var _a$r;
	var OctetString = class extends BaseBlock {
		constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
			var _b, _c;
			(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
			super({
				idBlock: {
					isConstructed: parameters.isConstructed,
					...idBlock
				},
				lenBlock: {
					...lenBlock,
					isIndefiniteForm: !!parameters.isIndefiniteForm
				},
				...parameters
			}, LocalOctetStringValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 4;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			this.valueBlock.isConstructed = this.idBlock.isConstructed;
			this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
			if (inputLength === 0) {
				if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
				if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
				return inputOffset;
			}
			if (!this.valueBlock.isConstructed) {
				const buf = (inputBuffer instanceof ArrayBuffer ? new Uint8Array(inputBuffer) : inputBuffer).subarray(inputOffset, inputOffset + inputLength);
				try {
					if (buf.byteLength) {
						const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
						const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
						if (asn.offset !== -1 && asn.offset === inputLength) this.valueBlock.value = [asn.result];
					}
				} catch {}
			}
			return super.fromBER(inputBuffer, inputOffset, inputLength, context);
		}
		onAsciiEncoding() {
			if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
			return `${this.constructor.NAME} : ${pvtsutils__namespace.Convert.ToHex(this.valueBlock.valueHexView)}`;
		}
		getValue() {
			if (!this.idBlock.isConstructed) return this.valueBlock.valueHexView.slice().buffer;
			const array = [];
			for (const content of this.valueBlock.value) if (content instanceof _a$r) array.push(content.valueBlock.valueHexView);
			return pvtsutils__namespace.BufferSourceConverter.concat(array);
		}
	};
	_a$r = OctetString;
	(() => {
		typeStore.OctetString = _a$r;
	})();
	OctetString.NAME = OCTET_STRING_NAME;
	var LocalBitStringValueBlock = class extends HexBlock(LocalConstructedValueBlock) {
		constructor({ unusedBits = 0, isConstructed = false, ...parameters } = {}) {
			super(parameters);
			this.unusedBits = unusedBits;
			this.isConstructed = isConstructed;
			this.blockLength = this.valueHexView.byteLength;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			if (!inputLength) return inputOffset;
			let resultOffset = -1;
			if (this.isConstructed) {
				resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength, context);
				if (resultOffset === -1) return resultOffset;
				for (const value of this.value) {
					const currentBlockName = value.constructor.NAME;
					if (currentBlockName === END_OF_CONTENT_NAME) {
						if (this.isIndefiniteForm) break;
						else {
							this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
							return -1;
						}
					}
					if (currentBlockName !== BIT_STRING_NAME) {
						this.error = "BIT STRING may consists of BIT STRINGs only";
						return -1;
					}
					const valueBlock = value.valueBlock;
					if (this.unusedBits > 0 && valueBlock.unusedBits > 0) {
						this.error = "Using of \"unused bits\" inside constructive BIT STRING allowed for least one only";
						return -1;
					}
					this.unusedBits = valueBlock.unusedBits;
				}
				return resultOffset;
			}
			const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
			const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
			this.unusedBits = intBuffer[0];
			if (this.unusedBits > 7) {
				this.error = "Unused bits for BitString must be in range 0-7";
				return -1;
			}
			if (!this.unusedBits) {
				const buf = intBuffer.subarray(1);
				try {
					if (buf.byteLength) {
						const parseContext = context !== null && context !== void 0 ? context : createFromBerContext();
						const asn = localFromBERWithChildContext(buf, 0, buf.byteLength, parseContext);
						if (asn.offset !== -1 && asn.offset === inputLength - 1) this.value = [asn.result];
					}
				} catch {}
			}
			this.valueHexView = intBuffer.subarray(1);
			this.blockLength = intBuffer.length;
			return inputOffset + inputLength;
		}
		toBER(sizeOnly, writer) {
			if (this.isConstructed) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly, writer);
			if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength + 1);
			if (!this.valueHexView.byteLength) {
				const empty = /* @__PURE__ */ new Uint8Array(1);
				empty[0] = 0;
				return empty.buffer;
			}
			const retView = new Uint8Array(this.valueHexView.length + 1);
			retView[0] = this.unusedBits;
			retView.set(this.valueHexView, 1);
			return retView.buffer;
		}
		toJSON() {
			return {
				...super.toJSON(),
				unusedBits: this.unusedBits,
				isConstructed: this.isConstructed
			};
		}
	};
	LocalBitStringValueBlock.NAME = "BitStringValueBlock";
	var _a$q;
	var BitString = class extends BaseBlock {
		constructor({ idBlock = {}, lenBlock = {}, ...parameters } = {}) {
			var _b, _c;
			(_b = parameters.isConstructed) !== null && _b !== void 0 || (parameters.isConstructed = !!((_c = parameters.value) === null || _c === void 0 ? void 0 : _c.length));
			super({
				idBlock: {
					isConstructed: parameters.isConstructed,
					...idBlock
				},
				lenBlock: {
					...lenBlock,
					isIndefiniteForm: !!parameters.isIndefiniteForm
				},
				...parameters
			}, LocalBitStringValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 3;
		}
		fromBER(inputBuffer, inputOffset, inputLength, context) {
			this.valueBlock.isConstructed = this.idBlock.isConstructed;
			this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
			return super.fromBER(inputBuffer, inputOffset, inputLength, context);
		}
		onAsciiEncoding() {
			if (this.valueBlock.isConstructed || this.valueBlock.value && this.valueBlock.value.length) return Constructed.prototype.onAsciiEncoding.call(this);
			else {
				const bits = [];
				const valueHex = this.valueBlock.valueHexView;
				for (const byte of valueHex) bits.push(byte.toString(2).padStart(8, "0"));
				const bitsStr = bits.join("");
				return `${this.constructor.NAME} : ${bitsStr.substring(0, bitsStr.length - this.valueBlock.unusedBits)}`;
			}
		}
	};
	_a$q = BitString;
	(() => {
		typeStore.BitString = _a$q;
	})();
	BitString.NAME = BIT_STRING_NAME;
	var _a$p;
	function viewAdd(first, second) {
		const c = new Uint8Array([0]);
		const firstView = new Uint8Array(first);
		const secondView = new Uint8Array(second);
		let firstViewCopy = firstView.slice(0);
		const firstViewCopyLength = firstViewCopy.length - 1;
		const secondViewCopy = secondView.slice(0);
		const secondViewCopyLength = secondViewCopy.length - 1;
		let value = 0;
		const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
		let counter = 0;
		for (let i = max; i >= 0; i--, counter++) {
			switch (true) {
				case counter < secondViewCopy.length:
					value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
					break;
				default: value = firstViewCopy[firstViewCopyLength - counter] + c[0];
			}
			c[0] = value / 10;
			switch (true) {
				case counter >= firstViewCopy.length:
					firstViewCopy = pvutils__namespace.utilConcatView(new Uint8Array([value % 10]), firstViewCopy);
					break;
				default: firstViewCopy[firstViewCopyLength - counter] = value % 10;
			}
		}
		if (c[0] > 0) firstViewCopy = pvutils__namespace.utilConcatView(c, firstViewCopy);
		return firstViewCopy;
	}
	function power2(n) {
		if (n >= powers2.length) for (let p = powers2.length; p <= n; p++) {
			const c = new Uint8Array([0]);
			let digits = powers2[p - 1].slice(0);
			for (let i = digits.length - 1; i >= 0; i--) {
				const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
				c[0] = newValue[0] / 10;
				digits[i] = newValue[0] % 10;
			}
			if (c[0] > 0) digits = pvutils__namespace.utilConcatView(c, digits);
			powers2.push(digits);
		}
		return powers2[n];
	}
	function viewSub(first, second) {
		let b = 0;
		const firstView = new Uint8Array(first);
		const secondView = new Uint8Array(second);
		const firstViewCopy = firstView.slice(0);
		const firstViewCopyLength = firstViewCopy.length - 1;
		const secondViewCopy = secondView.slice(0);
		const secondViewCopyLength = secondViewCopy.length - 1;
		let value;
		let counter = 0;
		for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
			value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;
			switch (true) {
				case value < 0:
					b = 1;
					firstViewCopy[firstViewCopyLength - counter] = value + 10;
					break;
				default:
					b = 0;
					firstViewCopy[firstViewCopyLength - counter] = value;
			}
		}
		if (b > 0) for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
			value = firstViewCopy[firstViewCopyLength - counter] - b;
			if (value < 0) {
				b = 1;
				firstViewCopy[firstViewCopyLength - counter] = value + 10;
			} else {
				b = 0;
				firstViewCopy[firstViewCopyLength - counter] = value;
				break;
			}
		}
		return firstViewCopy.slice();
	}
	var LocalIntegerValueBlock = class extends HexBlock(ValueBlock) {
		setValueHex() {
			if (this.valueHexView.length >= 4) {
				this.warnings.push("Too big Integer for decoding, hex only");
				this.isHexOnly = true;
				this._valueDec = 0;
			} else {
				this.isHexOnly = false;
				if (this.valueHexView.length > 0) this._valueDec = pvutils__namespace.utilDecodeTC.call(this);
			}
		}
		constructor({ value, ...parameters } = {}) {
			super(parameters);
			this._valueDec = 0;
			if (parameters.valueHex) this.setValueHex();
			if (value !== void 0) this.valueDec = value;
		}
		set valueDec(v) {
			this._valueDec = v;
			this.isHexOnly = false;
			this.valueHexView = new Uint8Array(pvutils__namespace.utilEncodeTC(v));
		}
		get valueDec() {
			return this._valueDec;
		}
		fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
			const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
			if (offset === -1) return offset;
			const view = this.valueHexView;
			if (view[0] === 0 && (view[1] & 128) !== 0) this.valueHexView = view.subarray(1);
			else if (expectedLength !== 0) {
				if (view.length < expectedLength) {
					if (expectedLength - view.length > 1) expectedLength = view.length + 1;
					this.valueHexView = view.subarray(expectedLength - view.length);
				}
			}
			return offset;
		}
		toDER(sizeOnly = false) {
			const view = this.valueHexView;
			switch (true) {
				case (view[0] & 128) !== 0:
					{
						const updatedView = new Uint8Array(this.valueHexView.length + 1);
						updatedView[0] = 0;
						updatedView.set(view, 1);
						this.valueHexView = updatedView;
					}
					break;
				case view[0] === 0 && (view[1] & 128) === 0: this.valueHexView = this.valueHexView.subarray(1);
			}
			return this.toBER(sizeOnly);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
			if (resultOffset === -1) return resultOffset;
			this.setValueHex();
			return resultOffset;
		}
		toBER(sizeOnly) {
			return sizeOnly ? new ArrayBuffer(this.valueHexView.length) : this.valueHexView.slice().buffer;
		}
		toJSON() {
			return {
				...super.toJSON(),
				valueDec: this.valueDec
			};
		}
		toString() {
			const firstBit = this.valueHexView.length * 8 - 1;
			let digits = new Uint8Array(this.valueHexView.length * 8 / 3);
			let bitNumber = 0;
			let currentByte;
			const asn1View = this.valueHexView;
			let result = "";
			let flag = false;
			for (let byteNumber = asn1View.byteLength - 1; byteNumber >= 0; byteNumber--) {
				currentByte = asn1View[byteNumber];
				for (let i = 0; i < 8; i++) {
					if ((currentByte & 1) === 1) switch (bitNumber) {
						case firstBit:
							digits = viewSub(power2(bitNumber), digits);
							result = "-";
							break;
						default: digits = viewAdd(digits, power2(bitNumber));
					}
					bitNumber++;
					currentByte >>= 1;
				}
			}
			for (let i = 0; i < digits.length; i++) {
				if (digits[i]) flag = true;
				if (flag) result += digitsString.charAt(digits[i]);
			}
			if (flag === false) result += digitsString.charAt(0);
			return result;
		}
	};
	_a$p = LocalIntegerValueBlock;
	LocalIntegerValueBlock.NAME = "IntegerValueBlock";
	(() => {
		Object.defineProperty(_a$p.prototype, "valueHex", {
			set: function(v) {
				this.valueHexView = new Uint8Array(v);
				this.setValueHex();
			},
			get: function() {
				return this.valueHexView.slice().buffer;
			}
		});
	})();
	var _a$o;
	var Integer = class extends BaseBlock {
		constructor(parameters = {}) {
			super(parameters, LocalIntegerValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 2;
		}
		toBigInt() {
			assertBigInt();
			return BigInt(this.valueBlock.toString());
		}
		static fromBigInt(value) {
			assertBigInt();
			const bigIntValue = BigInt(value);
			const writer = new ViewWriter();
			const hex = bigIntValue.toString(16).replace(/^-/, "");
			const view = new Uint8Array(pvtsutils__namespace.Convert.FromHex(hex));
			if (bigIntValue < 0) {
				const first = new Uint8Array(view.length + (view[0] & 128 ? 1 : 0));
				first[0] |= 128;
				const secondInt = BigInt(`0x${pvtsutils__namespace.Convert.ToHex(first)}`) + bigIntValue;
				const second = pvtsutils__namespace.BufferSourceConverter.toUint8Array(pvtsutils__namespace.Convert.FromHex(secondInt.toString(16)));
				second[0] |= 128;
				writer.write(second);
			} else {
				if (view[0] & 128) writer.write(new Uint8Array([0]));
				writer.write(view);
			}
			return new _a$o({ valueHex: writer.final() });
		}
		convertToDER() {
			const integer = new _a$o({ valueHex: this.valueBlock.valueHexView });
			integer.valueBlock.toDER();
			return integer;
		}
		convertFromDER() {
			return new _a$o({ valueHex: this.valueBlock.valueHexView[0] === 0 ? this.valueBlock.valueHexView.subarray(1) : this.valueBlock.valueHexView });
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${this.valueBlock.toString()}`;
		}
	};
	_a$o = Integer;
	(() => {
		typeStore.Integer = _a$o;
	})();
	Integer.NAME = "INTEGER";
	var _a$n;
	var Enumerated = class extends Integer {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 10;
		}
	};
	_a$n = Enumerated;
	(() => {
		typeStore.Enumerated = _a$n;
	})();
	Enumerated.NAME = "ENUMERATED";
	var LocalSidValueBlock = class extends HexBlock(ValueBlock) {
		constructor({ valueDec = -1, isFirstSid = false, ...parameters } = {}) {
			super(parameters);
			this.valueDec = valueDec;
			this.isFirstSid = isFirstSid;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			if (!inputLength) return inputOffset;
			const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
			const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
			this.valueHexView = new Uint8Array(inputLength);
			for (let i = 0; i < inputLength; i++) {
				this.valueHexView[i] = intBuffer[i] & 127;
				this.blockLength++;
				if ((intBuffer[i] & 128) === 0) break;
			}
			const tempView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
			this.valueHexView = tempView;
			if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
				this.error = "End of input reached before message was fully decoded";
				return -1;
			}
			if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
			if (this.blockLength <= 8) this.valueDec = pvutils__namespace.utilFromBase(this.valueHexView, 7);
			else {
				this.isHexOnly = true;
				this.warnings.push("Too big SID for decoding, hex only");
			}
			return inputOffset + this.blockLength;
		}
		set valueBigInt(value) {
			assertBigInt();
			let bits = BigInt(value).toString(2);
			while (bits.length % 7) bits = "0" + bits;
			const bytes = new Uint8Array(bits.length / 7);
			for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(bits.slice(i * 7, i * 7 + 7), 2) + (i + 1 < bytes.length ? 128 : 0);
			this.fromBER(bytes.buffer, 0, bytes.length);
		}
		toBER(sizeOnly) {
			if (this.isHexOnly) {
				if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
				const curView = this.valueHexView;
				const retView = new Uint8Array(this.blockLength);
				for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
				retView[this.blockLength - 1] = curView[this.blockLength - 1];
				return retView.buffer;
			}
			const encodedBuf = pvutils__namespace.utilToBase(this.valueDec, 7);
			if (encodedBuf.byteLength === 0) {
				this.error = "Error during encoding SID value";
				return EMPTY_BUFFER;
			}
			const retView = new Uint8Array(encodedBuf.byteLength);
			if (!sizeOnly) {
				const encodedView = new Uint8Array(encodedBuf);
				const len = encodedBuf.byteLength - 1;
				for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
				retView[len] = encodedView[len];
			}
			return retView;
		}
		toString() {
			let result = "";
			if (this.isHexOnly) result = pvtsutils__namespace.Convert.ToHex(this.valueHexView);
			else if (this.isFirstSid) {
				let sidValue = this.valueDec;
				if (this.valueDec <= 39) result = "0.";
				else if (this.valueDec <= 79) {
					result = "1.";
					sidValue -= 40;
				} else {
					result = "2.";
					sidValue -= 80;
				}
				result += sidValue.toString();
			} else result = this.valueDec.toString();
			return result;
		}
		toJSON() {
			return {
				...super.toJSON(),
				valueDec: this.valueDec,
				isFirstSid: this.isFirstSid
			};
		}
	};
	LocalSidValueBlock.NAME = "sidBlock";
	var LocalObjectIdentifierValueBlock = class extends ValueBlock {
		constructor({ value = EMPTY_STRING, ...parameters } = {}) {
			super(parameters);
			this.value = [];
			if (value) this.fromString(value);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			let resultOffset = inputOffset;
			while (inputLength > 0) {
				const sidBlock = new LocalSidValueBlock();
				resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
				if (resultOffset === -1) {
					this.blockLength = 0;
					this.error = sidBlock.error;
					return resultOffset;
				}
				if (this.value.length === 0) sidBlock.isFirstSid = true;
				this.blockLength += sidBlock.blockLength;
				inputLength -= sidBlock.blockLength;
				this.value.push(sidBlock);
			}
			return resultOffset;
		}
		toBER(sizeOnly) {
			const retBuffers = [];
			for (let i = 0; i < this.value.length; i++) {
				const valueBuf = this.value[i].toBER(sizeOnly);
				if (valueBuf.byteLength === 0) {
					this.error = this.value[i].error;
					return EMPTY_BUFFER;
				}
				retBuffers.push(valueBuf);
			}
			return concat(retBuffers);
		}
		fromString(string) {
			this.value = [];
			let pos1 = 0;
			let pos2 = 0;
			let sid = "";
			let flag = false;
			do {
				pos2 = string.indexOf(".", pos1);
				if (pos2 === -1) sid = string.substring(pos1);
				else sid = string.substring(pos1, pos2);
				pos1 = pos2 + 1;
				if (flag) {
					const sidBlock = this.value[0];
					let plus = 0;
					switch (sidBlock.valueDec) {
						case 0: break;
						case 1:
							plus = 40;
							break;
						case 2:
							plus = 80;
							break;
						default:
							this.value = [];
							return;
					}
					const parsedSID = parseInt(sid, 10);
					if (isNaN(parsedSID)) return;
					sidBlock.valueDec = parsedSID + plus;
					flag = false;
				} else {
					const sidBlock = new LocalSidValueBlock();
					if (sid > Number.MAX_SAFE_INTEGER) {
						assertBigInt();
						sidBlock.valueBigInt = BigInt(sid);
					} else {
						sidBlock.valueDec = parseInt(sid, 10);
						if (isNaN(sidBlock.valueDec)) return;
					}
					if (!this.value.length) {
						sidBlock.isFirstSid = true;
						flag = true;
					}
					this.value.push(sidBlock);
				}
			} while (pos2 !== -1);
		}
		toString() {
			let result = "";
			let isHexOnly = false;
			for (let i = 0; i < this.value.length; i++) {
				isHexOnly = this.value[i].isHexOnly;
				let sidStr = this.value[i].toString();
				if (i !== 0) result = `${result}.`;
				if (isHexOnly) {
					sidStr = `{${sidStr}}`;
					if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;
					else result += sidStr;
				} else result += sidStr;
			}
			return result;
		}
		toJSON() {
			const object = {
				...super.toJSON(),
				value: this.toString(),
				sidArray: []
			};
			for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
			return object;
		}
	};
	LocalObjectIdentifierValueBlock.NAME = "ObjectIdentifierValueBlock";
	var _a$m;
	var ObjectIdentifier = class extends BaseBlock {
		getValue() {
			return this.valueBlock.toString();
		}
		setValue(value) {
			this.valueBlock.fromString(value);
		}
		constructor(parameters = {}) {
			super(parameters, LocalObjectIdentifierValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 6;
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
		}
		toJSON() {
			return {
				...super.toJSON(),
				value: this.getValue()
			};
		}
	};
	_a$m = ObjectIdentifier;
	(() => {
		typeStore.ObjectIdentifier = _a$m;
	})();
	ObjectIdentifier.NAME = "OBJECT IDENTIFIER";
	var LocalRelativeSidValueBlock = class extends HexBlock(LocalBaseBlock) {
		constructor({ valueDec = 0, ...parameters } = {}) {
			super(parameters);
			this.valueDec = valueDec;
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			if (inputLength === 0) return inputOffset;
			const inputView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			if (!checkBufferParams(this, inputView, inputOffset, inputLength)) return -1;
			const intBuffer = inputView.subarray(inputOffset, inputOffset + inputLength);
			this.valueHexView = new Uint8Array(inputLength);
			for (let i = 0; i < inputLength; i++) {
				this.valueHexView[i] = intBuffer[i] & 127;
				this.blockLength++;
				if ((intBuffer[i] & 128) === 0) break;
			}
			const tempView = new Uint8Array(this.blockLength);
			for (let i = 0; i < this.blockLength; i++) tempView[i] = this.valueHexView[i];
			this.valueHexView = tempView;
			if ((intBuffer[this.blockLength - 1] & 128) !== 0) {
				this.error = "End of input reached before message was fully decoded";
				return -1;
			}
			if (this.valueHexView[0] === 0) this.warnings.push("Needlessly long format of SID encoding");
			if (this.blockLength <= 8) this.valueDec = pvutils__namespace.utilFromBase(this.valueHexView, 7);
			else {
				this.isHexOnly = true;
				this.warnings.push("Too big SID for decoding, hex only");
			}
			return inputOffset + this.blockLength;
		}
		toBER(sizeOnly) {
			if (this.isHexOnly) {
				if (sizeOnly) return new ArrayBuffer(this.valueHexView.byteLength);
				const curView = this.valueHexView;
				const retView = new Uint8Array(this.blockLength);
				for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 128;
				retView[this.blockLength - 1] = curView[this.blockLength - 1];
				return retView.buffer;
			}
			const encodedBuf = pvutils__namespace.utilToBase(this.valueDec, 7);
			if (encodedBuf.byteLength === 0) {
				this.error = "Error during encoding SID value";
				return EMPTY_BUFFER;
			}
			const retView = new Uint8Array(encodedBuf.byteLength);
			if (!sizeOnly) {
				const encodedView = new Uint8Array(encodedBuf);
				const len = encodedBuf.byteLength - 1;
				for (let i = 0; i < len; i++) retView[i] = encodedView[i] | 128;
				retView[len] = encodedView[len];
			}
			return retView.buffer;
		}
		toString() {
			let result = "";
			if (this.isHexOnly) result = pvtsutils__namespace.Convert.ToHex(this.valueHexView);
			else result = this.valueDec.toString();
			return result;
		}
		toJSON() {
			return {
				...super.toJSON(),
				valueDec: this.valueDec
			};
		}
	};
	LocalRelativeSidValueBlock.NAME = "relativeSidBlock";
	var LocalRelativeObjectIdentifierValueBlock = class extends ValueBlock {
		constructor({ value = EMPTY_STRING, ...parameters } = {}) {
			super(parameters);
			this.value = [];
			if (value) this.fromString(value);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			let resultOffset = inputOffset;
			while (inputLength > 0) {
				const sidBlock = new LocalRelativeSidValueBlock();
				resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);
				if (resultOffset === -1) {
					this.blockLength = 0;
					this.error = sidBlock.error;
					return resultOffset;
				}
				this.blockLength += sidBlock.blockLength;
				inputLength -= sidBlock.blockLength;
				this.value.push(sidBlock);
			}
			return resultOffset;
		}
		toBER(sizeOnly, _writer) {
			const retBuffers = [];
			for (let i = 0; i < this.value.length; i++) {
				const valueBuf = this.value[i].toBER(sizeOnly);
				if (valueBuf.byteLength === 0) {
					this.error = this.value[i].error;
					return EMPTY_BUFFER;
				}
				retBuffers.push(valueBuf);
			}
			return concat(retBuffers);
		}
		fromString(string) {
			this.value = [];
			let pos1 = 0;
			let pos2 = 0;
			let sid = "";
			do {
				pos2 = string.indexOf(".", pos1);
				if (pos2 === -1) sid = string.substring(pos1);
				else sid = string.substring(pos1, pos2);
				pos1 = pos2 + 1;
				const sidBlock = new LocalRelativeSidValueBlock();
				sidBlock.valueDec = parseInt(sid, 10);
				if (isNaN(sidBlock.valueDec)) return true;
				this.value.push(sidBlock);
			} while (pos2 !== -1);
			return true;
		}
		toString() {
			let result = "";
			let isHexOnly = false;
			for (let i = 0; i < this.value.length; i++) {
				isHexOnly = this.value[i].isHexOnly;
				let sidStr = this.value[i].toString();
				if (i !== 0) result = `${result}.`;
				if (isHexOnly) {
					sidStr = `{${sidStr}}`;
					result += sidStr;
				} else result += sidStr;
			}
			return result;
		}
		toJSON() {
			const object = {
				...super.toJSON(),
				value: this.toString(),
				sidArray: []
			};
			for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());
			return object;
		}
	};
	LocalRelativeObjectIdentifierValueBlock.NAME = "RelativeObjectIdentifierValueBlock";
	var _a$l;
	var RelativeObjectIdentifier = class extends BaseBlock {
		getValue() {
			return this.valueBlock.toString();
		}
		setValue(value) {
			this.valueBlock.fromString(value);
		}
		constructor(parameters = {}) {
			super(parameters, LocalRelativeObjectIdentifierValueBlock);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 13;
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${this.valueBlock.toString() || "empty"}`;
		}
		toJSON() {
			return {
				...super.toJSON(),
				value: this.getValue()
			};
		}
	};
	_a$l = RelativeObjectIdentifier;
	(() => {
		typeStore.RelativeObjectIdentifier = _a$l;
	})();
	RelativeObjectIdentifier.NAME = "RelativeObjectIdentifier";
	var _a$k;
	var Sequence = class extends Constructed {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 16;
		}
	};
	_a$k = Sequence;
	(() => {
		typeStore.Sequence = _a$k;
	})();
	Sequence.NAME = "SEQUENCE";
	var _a$j;
	var Set = class extends Constructed {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 17;
		}
	};
	_a$j = Set;
	(() => {
		typeStore.Set = _a$j;
	})();
	Set.NAME = "SET";
	var LocalStringValueBlock = class extends HexBlock(ValueBlock) {
		constructor({ ...parameters } = {}) {
			super(parameters);
			this.isHexOnly = true;
			this.value = EMPTY_STRING;
		}
		toJSON() {
			return {
				...super.toJSON(),
				value: this.value
			};
		}
	};
	LocalStringValueBlock.NAME = "StringValueBlock";
	var LocalSimpleStringValueBlock = class extends LocalStringValueBlock {};
	LocalSimpleStringValueBlock.NAME = "SimpleStringValueBlock";
	var LocalSimpleStringBlock = class extends BaseStringBlock {
		constructor({ ...parameters } = {}) {
			super(parameters, LocalSimpleStringValueBlock);
		}
		fromBuffer(inputBuffer) {
			this.valueBlock.value = String.fromCharCode.apply(null, pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer));
		}
		fromString(inputString) {
			const strLen = inputString.length;
			const view = this.valueBlock.valueHexView = new Uint8Array(strLen);
			for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);
			this.valueBlock.value = inputString;
		}
	};
	LocalSimpleStringBlock.NAME = "SIMPLE STRING";
	var LocalUtf8StringValueBlock = class extends LocalSimpleStringBlock {
		fromBuffer(inputBuffer) {
			this.valueBlock.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
			try {
				this.valueBlock.value = pvtsutils__namespace.Convert.ToUtf8String(inputBuffer);
			} catch (ex) {
				this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
				this.valueBlock.value = pvtsutils__namespace.Convert.ToBinary(inputBuffer);
			}
		}
		fromString(inputString) {
			this.valueBlock.valueHexView = new Uint8Array(pvtsutils__namespace.Convert.FromUtf8String(inputString));
			this.valueBlock.value = inputString;
		}
	};
	LocalUtf8StringValueBlock.NAME = "Utf8StringValueBlock";
	var _a$i;
	var Utf8String = class extends LocalUtf8StringValueBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 12;
		}
	};
	_a$i = Utf8String;
	(() => {
		typeStore.Utf8String = _a$i;
	})();
	Utf8String.NAME = "UTF8String";
	var LocalBmpStringValueBlock = class extends LocalSimpleStringBlock {
		fromBuffer(inputBuffer) {
			this.valueBlock.value = pvtsutils__namespace.Convert.ToUtf16String(inputBuffer);
			this.valueBlock.valueHexView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer);
		}
		fromString(inputString) {
			this.valueBlock.value = inputString;
			this.valueBlock.valueHexView = new Uint8Array(pvtsutils__namespace.Convert.FromUtf16String(inputString));
		}
	};
	LocalBmpStringValueBlock.NAME = "BmpStringValueBlock";
	var _a$h;
	var BmpString = class extends LocalBmpStringValueBlock {
		constructor({ ...parameters } = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 30;
		}
	};
	_a$h = BmpString;
	(() => {
		typeStore.BmpString = _a$h;
	})();
	BmpString.NAME = "BMPString";
	var LocalUniversalStringValueBlock = class extends LocalSimpleStringBlock {
		fromBuffer(inputBuffer) {
			const copyBuffer = ArrayBuffer.isView(inputBuffer) ? inputBuffer.slice().buffer : inputBuffer.slice(0);
			const valueView = new Uint8Array(copyBuffer);
			for (let i = 0; i < valueView.length; i += 4) {
				valueView[i] = valueView[i + 3];
				valueView[i + 1] = valueView[i + 2];
				valueView[i + 2] = 0;
				valueView[i + 3] = 0;
			}
			this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
		}
		fromString(inputString) {
			const strLength = inputString.length;
			const valueHexView = this.valueBlock.valueHexView = new Uint8Array(strLength * 4);
			for (let i = 0; i < strLength; i++) {
				const codeBuf = pvutils__namespace.utilToBase(inputString.charCodeAt(i), 8);
				const codeView = new Uint8Array(codeBuf);
				if (codeView.length > 4) continue;
				const dif = 4 - codeView.length;
				for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
			}
			this.valueBlock.value = inputString;
		}
	};
	LocalUniversalStringValueBlock.NAME = "UniversalStringValueBlock";
	var _a$g;
	var UniversalString = class extends LocalUniversalStringValueBlock {
		constructor({ ...parameters } = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 28;
		}
	};
	_a$g = UniversalString;
	(() => {
		typeStore.UniversalString = _a$g;
	})();
	UniversalString.NAME = "UniversalString";
	var _a$f;
	var NumericString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 18;
		}
	};
	_a$f = NumericString;
	(() => {
		typeStore.NumericString = _a$f;
	})();
	NumericString.NAME = "NumericString";
	var _a$e;
	var PrintableString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 19;
		}
	};
	_a$e = PrintableString;
	(() => {
		typeStore.PrintableString = _a$e;
	})();
	PrintableString.NAME = "PrintableString";
	var _a$d;
	var TeletexString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 20;
		}
	};
	_a$d = TeletexString;
	(() => {
		typeStore.TeletexString = _a$d;
	})();
	TeletexString.NAME = "TeletexString";
	var _a$c;
	var VideotexString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 21;
		}
	};
	_a$c = VideotexString;
	(() => {
		typeStore.VideotexString = _a$c;
	})();
	VideotexString.NAME = "VideotexString";
	var _a$b;
	var IA5String = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 22;
		}
	};
	_a$b = IA5String;
	(() => {
		typeStore.IA5String = _a$b;
	})();
	IA5String.NAME = "IA5String";
	var _a$a;
	var GraphicString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 25;
		}
	};
	_a$a = GraphicString;
	(() => {
		typeStore.GraphicString = _a$a;
	})();
	GraphicString.NAME = "GraphicString";
	var _a$9;
	var VisibleString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 26;
		}
	};
	_a$9 = VisibleString;
	(() => {
		typeStore.VisibleString = _a$9;
	})();
	VisibleString.NAME = "VisibleString";
	var _a$8;
	var GeneralString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 27;
		}
	};
	_a$8 = GeneralString;
	(() => {
		typeStore.GeneralString = _a$8;
	})();
	GeneralString.NAME = "GeneralString";
	var _a$7;
	var CharacterString = class extends LocalSimpleStringBlock {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 29;
		}
	};
	_a$7 = CharacterString;
	(() => {
		typeStore.CharacterString = _a$7;
	})();
	CharacterString.NAME = "CharacterString";
	var _a$6;
	var UTCTime = class extends VisibleString {
		constructor({ value, valueDate, ...parameters } = {}) {
			super(parameters);
			this.year = 0;
			this.month = 0;
			this.day = 0;
			this.hour = 0;
			this.minute = 0;
			this.second = 0;
			if (value) {
				this.fromString(value);
				this.valueBlock.valueHexView = new Uint8Array(value.length);
				for (let i = 0; i < value.length; i++) this.valueBlock.valueHexView[i] = value.charCodeAt(i);
			}
			if (valueDate) {
				this.fromDate(valueDate);
				this.valueBlock.valueHexView = new Uint8Array(this.toBuffer());
			}
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 23;
		}
		fromBuffer(inputBuffer) {
			this.fromString(String.fromCharCode.apply(null, pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer)));
		}
		toBuffer() {
			const str = this.toString();
			const buffer = new ArrayBuffer(str.length);
			const view = new Uint8Array(buffer);
			for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);
			return buffer;
		}
		fromDate(inputDate) {
			this.year = inputDate.getUTCFullYear();
			this.month = inputDate.getUTCMonth() + 1;
			this.day = inputDate.getUTCDate();
			this.hour = inputDate.getUTCHours();
			this.minute = inputDate.getUTCMinutes();
			this.second = inputDate.getUTCSeconds();
		}
		toDate() {
			return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
		}
		fromString(inputString) {
			const parserArray = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/gi.exec(inputString);
			if (parserArray === null) {
				this.error = "Wrong input string for conversion";
				return;
			}
			const year = parseInt(parserArray[1], 10);
			if (year >= 50) this.year = 1900 + year;
			else this.year = 2e3 + year;
			this.month = parseInt(parserArray[2], 10);
			this.day = parseInt(parserArray[3], 10);
			this.hour = parseInt(parserArray[4], 10);
			this.minute = parseInt(parserArray[5], 10);
			this.second = parseInt(parserArray[6], 10);
		}
		toString(encoding = "iso") {
			if (encoding === "iso") {
				const outputArray = new Array(7);
				outputArray[0] = pvutils__namespace.padNumber(this.year < 2e3 ? this.year - 1900 : this.year - 2e3, 2);
				outputArray[1] = pvutils__namespace.padNumber(this.month, 2);
				outputArray[2] = pvutils__namespace.padNumber(this.day, 2);
				outputArray[3] = pvutils__namespace.padNumber(this.hour, 2);
				outputArray[4] = pvutils__namespace.padNumber(this.minute, 2);
				outputArray[5] = pvutils__namespace.padNumber(this.second, 2);
				outputArray[6] = "Z";
				return outputArray.join("");
			}
			return super.toString(encoding);
		}
		onAsciiEncoding() {
			return `${this.constructor.NAME} : ${this.toDate().toISOString()}`;
		}
		toJSON() {
			return {
				...super.toJSON(),
				year: this.year,
				month: this.month,
				day: this.day,
				hour: this.hour,
				minute: this.minute,
				second: this.second
			};
		}
	};
	_a$6 = UTCTime;
	(() => {
		typeStore.UTCTime = _a$6;
	})();
	UTCTime.NAME = "UTCTime";
	var _a$5;
	var GeneralizedTime = class extends UTCTime {
		constructor(parameters = {}) {
			var _b;
			super(parameters);
			(_b = this.millisecond) !== null && _b !== void 0 || (this.millisecond = 0);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 24;
		}
		fromDate(inputDate) {
			super.fromDate(inputDate);
			this.millisecond = inputDate.getUTCMilliseconds();
		}
		toDate() {
			const utcDate = Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond);
			return new Date(utcDate);
		}
		fromString(inputString) {
			let isUTC = false;
			let timeString = "";
			let dateTimeString = "";
			let fractionPart = 0;
			let parser;
			let hourDifference = 0;
			let minuteDifference = 0;
			if (inputString[inputString.length - 1] === "Z") {
				timeString = inputString.substring(0, inputString.length - 1);
				isUTC = true;
			} else {
				const number = new Number(inputString[inputString.length - 1]);
				if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
				timeString = inputString;
			}
			if (isUTC) {
				if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for conversion");
				if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for conversion");
			} else {
				let multiplier = 1;
				let differencePosition = timeString.indexOf("+");
				let differenceString = "";
				if (differencePosition === -1) {
					differencePosition = timeString.indexOf("-");
					multiplier = -1;
				}
				if (differencePosition !== -1) {
					differenceString = timeString.substring(differencePosition + 1);
					timeString = timeString.substring(0, differencePosition);
					if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for conversion");
					let number = parseInt(differenceString.substring(0, 2), 10);
					if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
					hourDifference = multiplier * number;
					if (differenceString.length === 4) {
						number = parseInt(differenceString.substring(2, 4), 10);
						if (isNaN(number.valueOf())) throw new Error("Wrong input string for conversion");
						minuteDifference = multiplier * number;
					}
				}
			}
			let fractionPointPosition = timeString.indexOf(".");
			if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(",");
			if (fractionPointPosition !== -1) {
				const fractionPartCheck = /* @__PURE__ */ new Number(`0${timeString.substring(fractionPointPosition)}`);
				if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for conversion");
				fractionPart = fractionPartCheck.valueOf();
				dateTimeString = timeString.substring(0, fractionPointPosition);
			} else dateTimeString = timeString;
			switch (true) {
				case dateTimeString.length === 8:
					parser = /(\d{4})(\d{2})(\d{2})/gi;
					if (fractionPointPosition !== -1) throw new Error("Wrong input string for conversion");
					break;
				case dateTimeString.length === 10:
					parser = /(\d{4})(\d{2})(\d{2})(\d{2})/gi;
					if (fractionPointPosition !== -1) {
						let fractionResult = 60 * fractionPart;
						this.minute = Math.floor(fractionResult);
						fractionResult = 60 * (fractionResult - this.minute);
						this.second = Math.floor(fractionResult);
						fractionResult = 1e3 * (fractionResult - this.second);
						this.millisecond = Math.floor(fractionResult);
					}
					break;
				case dateTimeString.length === 12:
					parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
					if (fractionPointPosition !== -1) {
						let fractionResult = 60 * fractionPart;
						this.second = Math.floor(fractionResult);
						fractionResult = 1e3 * (fractionResult - this.second);
						this.millisecond = Math.floor(fractionResult);
					}
					break;
				case dateTimeString.length === 14:
					parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/gi;
					if (fractionPointPosition !== -1) {
						const fractionResult = 1e3 * fractionPart;
						this.millisecond = Math.floor(fractionResult);
					}
					break;
				default: throw new Error("Wrong input string for conversion");
			}
			const parserArray = parser.exec(dateTimeString);
			if (parserArray === null) throw new Error("Wrong input string for conversion");
			for (let j = 1; j < parserArray.length; j++) switch (j) {
				case 1:
					this.year = parseInt(parserArray[j], 10);
					break;
				case 2:
					this.month = parseInt(parserArray[j], 10);
					break;
				case 3:
					this.day = parseInt(parserArray[j], 10);
					break;
				case 4:
					this.hour = parseInt(parserArray[j], 10) + hourDifference;
					break;
				case 5:
					this.minute = parseInt(parserArray[j], 10) + minuteDifference;
					break;
				case 6:
					this.second = parseInt(parserArray[j], 10);
					break;
				default: throw new Error("Wrong input string for conversion");
			}
			if (isUTC === false) {
				const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
				this.year = tempDate.getUTCFullYear();
				this.month = tempDate.getUTCMonth();
				this.day = tempDate.getUTCDay();
				this.hour = tempDate.getUTCHours();
				this.minute = tempDate.getUTCMinutes();
				this.second = tempDate.getUTCSeconds();
				this.millisecond = tempDate.getUTCMilliseconds();
			}
		}
		toString(encoding = "iso") {
			if (encoding === "iso") {
				const outputArray = [];
				outputArray.push(pvutils__namespace.padNumber(this.year, 4));
				outputArray.push(pvutils__namespace.padNumber(this.month, 2));
				outputArray.push(pvutils__namespace.padNumber(this.day, 2));
				outputArray.push(pvutils__namespace.padNumber(this.hour, 2));
				outputArray.push(pvutils__namespace.padNumber(this.minute, 2));
				outputArray.push(pvutils__namespace.padNumber(this.second, 2));
				if (this.millisecond !== 0) {
					outputArray.push(".");
					outputArray.push(pvutils__namespace.padNumber(this.millisecond, 3));
				}
				outputArray.push("Z");
				return outputArray.join("");
			}
			return super.toString(encoding);
		}
		toJSON() {
			return {
				...super.toJSON(),
				millisecond: this.millisecond
			};
		}
	};
	_a$5 = GeneralizedTime;
	(() => {
		typeStore.GeneralizedTime = _a$5;
	})();
	GeneralizedTime.NAME = "GeneralizedTime";
	var _a$4;
	var DATE = class extends Utf8String {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 31;
		}
	};
	_a$4 = DATE;
	(() => {
		typeStore.DATE = _a$4;
	})();
	DATE.NAME = "DATE";
	var _a$3;
	var TimeOfDay = class extends Utf8String {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 32;
		}
	};
	_a$3 = TimeOfDay;
	(() => {
		typeStore.TimeOfDay = _a$3;
	})();
	TimeOfDay.NAME = "TimeOfDay";
	var _a$2;
	var DateTime = class extends Utf8String {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 33;
		}
	};
	_a$2 = DateTime;
	(() => {
		typeStore.DateTime = _a$2;
	})();
	DateTime.NAME = "DateTime";
	var _a$1;
	var Duration = class extends Utf8String {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 34;
		}
	};
	_a$1 = Duration;
	(() => {
		typeStore.Duration = _a$1;
	})();
	Duration.NAME = "Duration";
	var _a;
	var TIME = class extends Utf8String {
		constructor(parameters = {}) {
			super(parameters);
			this.idBlock.tagClass = 1;
			this.idBlock.tagNumber = 14;
		}
	};
	_a = TIME;
	(() => {
		typeStore.TIME = _a;
	})();
	TIME.NAME = "TIME";
	var Any = class {
		constructor({ name = EMPTY_STRING, optional = false } = {}) {
			this.name = name;
			this.optional = optional;
		}
	};
	var Choice = class extends Any {
		constructor({ value = [], ...parameters } = {}) {
			super(parameters);
			this.value = value;
		}
	};
	var Repeated = class extends Any {
		constructor({ value = new Any(), local = false, ...parameters } = {}) {
			super(parameters);
			this.value = value;
			this.local = local;
		}
	};
	var RawData = class {
		get data() {
			return this.dataView.slice().buffer;
		}
		set data(value) {
			this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(value);
		}
		constructor({ data = EMPTY_VIEW } = {}) {
			this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(data);
		}
		fromBER(inputBuffer, inputOffset, inputLength) {
			const endLength = inputOffset + inputLength;
			this.dataView = pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer).subarray(inputOffset, endLength);
			return endLength;
		}
		toBER(_sizeOnly) {
			return this.dataView.slice().buffer;
		}
	};
	function compareSchema(root, inputData, inputSchema) {
		if (inputSchema instanceof Choice) {
			for (const element of inputSchema.value) if (compareSchema(root, inputData, element).verified) return {
				verified: true,
				result: root
			};
			{
				const _result = {
					verified: false,
					result: { error: "Wrong values for Choice type" }
				};
				if (inputSchema.hasOwnProperty(NAME)) _result.name = inputSchema.name;
				return _result;
			}
		}
		if (inputSchema instanceof Any) {
			if (inputSchema.hasOwnProperty(NAME)) root[inputSchema.name] = inputData;
			return {
				verified: true,
				result: root
			};
		}
		if (root instanceof Object === false) return {
			verified: false,
			result: { error: "Wrong root object" }
		};
		if (inputData instanceof Object === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 data" }
		};
		if (inputSchema instanceof Object === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (ID_BLOCK in inputSchema === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (FROM_BER in inputSchema.idBlock === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (TO_BER in inputSchema.idBlock === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		const encodedId = inputSchema.idBlock.toBER(false);
		if (encodedId.byteLength === 0) return {
			verified: false,
			result: { error: "Error encoding idBlock for ASN.1 schema" }
		};
		if (inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength) === -1) return {
			verified: false,
			result: { error: "Error decoding idBlock for ASN.1 schema" }
		};
		if (inputSchema.idBlock.hasOwnProperty(TAG_CLASS) === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) return {
			verified: false,
			result: root
		};
		if (inputSchema.idBlock.hasOwnProperty(TAG_NUMBER) === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) return {
			verified: false,
			result: root
		};
		if (inputSchema.idBlock.hasOwnProperty(IS_CONSTRUCTED) === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) return {
			verified: false,
			result: root
		};
		if (!(IS_HEX_ONLY in inputSchema.idBlock)) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema" }
		};
		if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) return {
			verified: false,
			result: root
		};
		if (inputSchema.idBlock.isHexOnly) {
			if (VALUE_HEX_VIEW in inputSchema.idBlock === false) return {
				verified: false,
				result: { error: "Wrong ASN.1 schema" }
			};
			const schemaView = inputSchema.idBlock.valueHexView;
			const asn1View = inputData.idBlock.valueHexView;
			if (schemaView.length !== asn1View.length) return {
				verified: false,
				result: root
			};
			for (let i = 0; i < schemaView.length; i++) if (schemaView[i] !== asn1View[1]) return {
				verified: false,
				result: root
			};
		}
		if (inputSchema.name) {
			inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
			if (inputSchema.name) root[inputSchema.name] = inputData;
		}
		if (inputSchema instanceof typeStore.Constructed) {
			let admission = 0;
			let result = {
				verified: false,
				result: { error: "Unknown error" }
			};
			let maxLength = inputSchema.valueBlock.value.length;
			if (maxLength > 0) {
				if (inputSchema.valueBlock.value[0] instanceof Repeated) maxLength = inputData.valueBlock.value.length;
			}
			if (maxLength === 0) return {
				verified: true,
				result: root
			};
			if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
				let _optional = true;
				for (let i = 0; i < inputSchema.valueBlock.value.length; i++) _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);
				if (_optional) return {
					verified: true,
					result: root
				};
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) delete root[inputSchema.name];
				}
				root.error = "Inconsistent object length";
				return {
					verified: false,
					result: root
				};
			}
			for (let i = 0; i < maxLength; i++) if (i - admission >= inputData.valueBlock.value.length) {
				if (inputSchema.valueBlock.value[i].optional === false) {
					const _result = {
						verified: false,
						result: root
					};
					root.error = "Inconsistent length between ASN.1 data and schema";
					if (inputSchema.name) {
						inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
						if (inputSchema.name) {
							delete root[inputSchema.name];
							_result.name = inputSchema.name;
						}
					}
					return _result;
				}
			} else if (inputSchema.valueBlock.value[0] instanceof Repeated) {
				result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);
				if (result.verified === false) {
					if (inputSchema.valueBlock.value[0].optional) admission++;
					else {
						if (inputSchema.name) {
							inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
							if (inputSchema.name) delete root[inputSchema.name];
						}
						return result;
					}
				}
				if (NAME in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
					let arrayRoot = {};
					if (LOCAL in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local) arrayRoot = inputData;
					else arrayRoot = root;
					if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined") arrayRoot[inputSchema.valueBlock.value[0].name] = [];
					arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
				}
			} else {
				result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);
				if (result.verified === false) {
					if (inputSchema.valueBlock.value[i].optional) admission++;
					else {
						if (inputSchema.name) {
							inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
							if (inputSchema.name) delete root[inputSchema.name];
						}
						return result;
					}
				}
			}
			if (result.verified === false) {
				const _result = {
					verified: false,
					result: root
				};
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) {
						delete root[inputSchema.name];
						_result.name = inputSchema.name;
					}
				}
				return _result;
			}
			return {
				verified: true,
				result: root
			};
		}
		if (inputSchema.primitiveSchema && VALUE_HEX_VIEW in inputData.valueBlock) {
			const asn1 = localFromBER(inputData.valueBlock.valueHexView);
			if (asn1.offset === -1) {
				const _result = {
					verified: false,
					result: asn1.result
				};
				if (inputSchema.name) {
					inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, EMPTY_STRING);
					if (inputSchema.name) {
						delete root[inputSchema.name];
						_result.name = inputSchema.name;
					}
				}
				return _result;
			}
			return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
		}
		return {
			verified: true,
			result: root
		};
	}
	function verifySchema(inputBuffer, inputSchema) {
		if (inputSchema instanceof Object === false) return {
			verified: false,
			result: { error: "Wrong ASN.1 schema type" }
		};
		const asn1 = localFromBER(pvtsutils__namespace.BufferSourceConverter.toUint8Array(inputBuffer));
		if (asn1.offset === -1) return {
			verified: false,
			result: asn1.result
		};
		return compareSchema(asn1.result, asn1.result, inputSchema);
	}
	exports.Any = Any;
	exports.BaseBlock = BaseBlock;
	exports.BaseStringBlock = BaseStringBlock;
	exports.BitString = BitString;
	exports.BmpString = BmpString;
	exports.Boolean = Boolean;
	exports.CharacterString = CharacterString;
	exports.Choice = Choice;
	exports.Constructed = Constructed;
	exports.DATE = DATE;
	exports.DEFAULT_MAX_CONTENT_LENGTH = DEFAULT_MAX_CONTENT_LENGTH;
	exports.DEFAULT_MAX_DEPTH = DEFAULT_MAX_DEPTH;
	exports.DEFAULT_MAX_NODES = DEFAULT_MAX_NODES;
	exports.DateTime = DateTime;
	exports.Duration = Duration;
	exports.EndOfContent = EndOfContent;
	exports.Enumerated = Enumerated;
	exports.GeneralString = GeneralString;
	exports.GeneralizedTime = GeneralizedTime;
	exports.GraphicString = GraphicString;
	exports.HexBlock = HexBlock;
	exports.IA5String = IA5String;
	exports.Integer = Integer;
	exports.Null = Null;
	exports.NumericString = NumericString;
	exports.ObjectIdentifier = ObjectIdentifier;
	exports.OctetString = OctetString;
	exports.Primitive = Primitive;
	exports.PrintableString = PrintableString;
	exports.RawData = RawData;
	exports.RelativeObjectIdentifier = RelativeObjectIdentifier;
	exports.Repeated = Repeated;
	exports.Sequence = Sequence;
	exports.Set = Set;
	exports.TIME = TIME;
	exports.TeletexString = TeletexString;
	exports.TimeOfDay = TimeOfDay;
	exports.UTCTime = UTCTime;
	exports.UniversalString = UniversalString;
	exports.Utf8String = Utf8String;
	exports.ValueBlock = ValueBlock;
	exports.VideotexString = VideotexString;
	exports.ViewWriter = ViewWriter;
	exports.VisibleString = VisibleString;
	exports.compareSchema = compareSchema;
	exports.fromBER = fromBER;
	exports.verifySchema = verifySchema;
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/bytes/buffer-source.js
var require_buffer_source = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isArrayBuffer = isArrayBuffer;
	exports.isSharedArrayBuffer = isSharedArrayBuffer;
	exports.isArrayBufferLike = isArrayBufferLike;
	exports.isArrayBufferView = isArrayBufferView;
	exports.isBufferSource = isBufferSource;
	exports.assertBufferSource = assertBufferSource;
	exports.toUint8Array = toUint8Array;
	exports.toUint8ArrayCopy = toUint8ArrayCopy;
	exports.toArrayBuffer = toArrayBuffer;
	exports.toArrayBufferLike = toArrayBufferLike;
	exports.toView = toView;
	exports.toViewCopy = toViewCopy;
	const ARRAY_BUFFER_TAG = "[object ArrayBuffer]";
	const SHARED_ARRAY_BUFFER_TAG = "[object SharedArrayBuffer]";
	function tagOf(value) {
		return Object.prototype.toString.call(value);
	}
	function isDataViewConstructor(type) {
		return type === DataView || type.prototype instanceof DataView;
	}
	function bytesPerElement(type) {
		if (isDataViewConstructor(type)) return 1;
		return type.BYTES_PER_ELEMENT ?? 1;
	}
	function isArrayBufferViewLike(value) {
		if (ArrayBuffer.isView(value)) return true;
		if (!value || typeof value !== "object") return false;
		const view = value;
		return typeof view.byteOffset === "number" && typeof view.byteLength === "number" && isArrayBufferLike(view.buffer);
	}
	function copyBytes(data) {
		const view = toUint8Array(data);
		const copy = new Uint8Array(view.byteLength);
		copy.set(view);
		return copy;
	}
	function isArrayBuffer(value) {
		return tagOf(value) === ARRAY_BUFFER_TAG;
	}
	function isSharedArrayBuffer(value) {
		return typeof SharedArrayBuffer !== "undefined" && tagOf(value) === SHARED_ARRAY_BUFFER_TAG;
	}
	function isArrayBufferLike(value) {
		return isArrayBuffer(value) || isSharedArrayBuffer(value);
	}
	function isArrayBufferView(value) {
		return isArrayBufferViewLike(value);
	}
	function isBufferSource(value) {
		return isArrayBufferLike(value) || isArrayBufferView(value);
	}
	function assertBufferSource(value) {
		if (!isBufferSource(value)) throw new TypeError("Expected ArrayBuffer, SharedArrayBuffer, or ArrayBufferView");
	}
	function toUint8Array(data) {
		assertBufferSource(data);
		if (isArrayBufferLike(data)) return new Uint8Array(data);
		return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	}
	function toUint8ArrayCopy(data) {
		return copyBytes(data);
	}
	function toArrayBuffer(data) {
		assertBufferSource(data);
		if (isArrayBuffer(data)) return data;
		const buffer = new ArrayBuffer(data.byteLength);
		new Uint8Array(buffer).set(toUint8Array(data));
		return buffer;
	}
	function toArrayBufferLike(data) {
		assertBufferSource(data);
		if (isArrayBufferLike(data)) return data;
		if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) return data.buffer;
		return copyBytes(data).buffer;
	}
	function toView(data, type) {
		assertBufferSource(data);
		if (ArrayBuffer.isView(data) && data.constructor === type) return data;
		const view = toUint8Array(data);
		const elementSize = bytesPerElement(type);
		if (view.byteOffset % elementSize !== 0 || view.byteLength % elementSize !== 0) throw new RangeError(`Cannot create ${type.name} over unaligned byte range`);
		if (isDataViewConstructor(type)) return new type(view.buffer, view.byteOffset, view.byteLength);
		return new type(view.buffer, view.byteOffset, view.byteLength / elementSize);
	}
	function toViewCopy(data, type) {
		return toView(toUint8ArrayCopy(data), type);
	}
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/bytes/concat.js
var require_concat = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatToUint8Array = concatToUint8Array;
	exports.concat = concat;
	const buffer_source_js_1 = require_buffer_source();
	function concatToUint8Array(buffers) {
		const views = [];
		let length = 0;
		for (const buffer of buffers) {
			const view = (0, buffer_source_js_1.toUint8Array)(buffer);
			views.push(view);
			length += view.byteLength;
		}
		const result = new Uint8Array(length);
		let offset = 0;
		for (const view of views) {
			result.set(view, offset);
			offset += view.byteLength;
		}
		return result;
	}
	function concat(first, second, ...rest) {
		let buffers;
		let type;
		if (typeof second === "function") {
			buffers = Array.from(first);
			type = second;
		} else if ((0, buffer_source_js_1.isBufferSource)(first)) buffers = [
			first,
			second,
			...rest
		].filter(buffer_source_js_1.isBufferSource);
		else {
			buffers = Array.from(first);
			if (second) buffers.push(second);
			buffers.push(...rest);
		}
		const bytes = concatToUint8Array(buffers);
		return type ? (0, buffer_source_js_1.toView)(bytes, type) : bytes.buffer;
	}
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/bytes/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.equal = equal;
	const buffer_source_js_1 = require_buffer_source();
	function equal(a, b, options = {}) {
		const left = (0, buffer_source_js_1.toUint8Array)(a);
		const right = (0, buffer_source_js_1.toUint8Array)(b);
		if (!options.constantTime && left.byteLength !== right.byteLength) return false;
		const length = Math.max(left.byteLength, right.byteLength);
		let diff = left.byteLength ^ right.byteLength;
		for (let i = 0; i < length; i++) diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
		return diff === 0;
	}
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/bytes/sequence.js
var require_sequence = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.indexOf = indexOf;
	exports.lastIndexOf = lastIndexOf;
	exports.includes = includes;
	exports.startsWith = startsWith;
	exports.endsWith = endsWith;
	exports.slice = slice;
	exports.tail = tail;
	exports.copy = copy;
	exports.compare = compare;
	const buffer_source_js_1 = require_buffer_source();
	function clampIndex(value, fallback, length) {
		const normalized = Number.isFinite(value) ? Math.trunc(value) : fallback;
		if (normalized <= 0) return 0;
		if (normalized >= length) return length;
		return normalized;
	}
	function normalizeForwardRange(length, options) {
		const start = clampIndex(options?.start, 0, length);
		const end = clampIndex(options?.end, length, length);
		return end >= start ? [start, end] : [start, start];
	}
	function normalizeReverseRange(length, options) {
		const start = clampIndex(options?.start, length, length);
		const end = clampIndex(options?.end, 0, length);
		return start >= end ? [end, start] : [start, start];
	}
	function normalizeSliceIndex(value, fallback, length) {
		const normalized = Number.isFinite(value) ? Math.trunc(value) : fallback;
		if (normalized < 0) return Math.max(length + normalized, 0);
		if (normalized > length) return length;
		return normalized;
	}
	function encodeAscii(text) {
		const bytes = new Uint8Array(text.length);
		for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 255;
		return bytes;
	}
	function encodeUtf8(text) {
		return new TextEncoder().encode(text);
	}
	function toPatternBytes(pattern, options) {
		if (typeof pattern === "string") return options?.encoding === "utf8" ? encodeUtf8(pattern) : encodeAscii(pattern);
		return (0, buffer_source_js_1.toUint8Array)(pattern);
	}
	function bytesEqualAt(data, pattern, offset) {
		for (let index = 0; index < pattern.byteLength; index++) if (data[offset + index] !== pattern[index]) return false;
		return true;
	}
	function indexOf(data, pattern, options) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const needle = toPatternBytes(pattern, options);
		const [start, end] = normalizeForwardRange(bytes.byteLength, options);
		if (needle.byteLength === 0) return start;
		const lastOffset = end - needle.byteLength;
		if (lastOffset < start) return -1;
		for (let offset = start; offset <= lastOffset; offset++) if (bytesEqualAt(bytes, needle, offset)) return offset;
		return -1;
	}
	function lastIndexOf(data, pattern, options) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const needle = toPatternBytes(pattern, options);
		const [end, start] = normalizeReverseRange(bytes.byteLength, options);
		if (needle.byteLength === 0) return start;
		const firstOffset = start - needle.byteLength;
		if (firstOffset < end) return -1;
		for (let offset = firstOffset; offset >= end; offset--) if (bytesEqualAt(bytes, needle, offset)) return offset;
		return -1;
	}
	function includes(data, pattern, options) {
		return indexOf(data, pattern, options) !== -1;
	}
	function startsWith(data, pattern, options) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const needle = toPatternBytes(pattern, options);
		if (needle.byteLength > bytes.byteLength) return false;
		return bytesEqualAt(bytes, needle, 0);
	}
	function endsWith(data, pattern, options) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const needle = toPatternBytes(pattern, options);
		if (needle.byteLength > bytes.byteLength) return false;
		return bytesEqualAt(bytes, needle, bytes.byteLength - needle.byteLength);
	}
	function slice(data, start, end) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const normalizedStart = normalizeSliceIndex(start, 0, bytes.byteLength);
		const normalizedEnd = normalizeSliceIndex(end, bytes.byteLength, bytes.byteLength);
		if (normalizedEnd <= normalizedStart) return bytes.subarray(normalizedStart, normalizedStart);
		return bytes.subarray(normalizedStart, normalizedEnd);
	}
	function tail(data, length) {
		const bytes = (0, buffer_source_js_1.toUint8Array)(data);
		const normalizedLength = Number.isFinite(length) ? Math.max(0, Math.trunc(length)) : 0;
		if (normalizedLength >= bytes.byteLength) return bytes;
		return bytes.subarray(bytes.byteLength - normalizedLength);
	}
	function copy(data) {
		return (0, buffer_source_js_1.toUint8ArrayCopy)(data);
	}
	function compare(a, b) {
		const left = (0, buffer_source_js_1.toUint8Array)(a);
		const right = (0, buffer_source_js_1.toUint8Array)(b);
		const limit = Math.min(left.byteLength, right.byteLength);
		for (let index = 0; index < limit; index++) {
			if (left[index] < right[index]) return -1;
			if (left[index] > right[index]) return 1;
		}
		if (left.byteLength < right.byteLength) return -1;
		if (left.byteLength > right.byteLength) return 1;
		return 0;
	}
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/bytes/index.js
var require_bytes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.tail = exports.startsWith = exports.slice = exports.lastIndexOf = exports.indexOf = exports.includes = exports.endsWith = exports.copy = exports.compare = exports.equal = exports.concatToUint8Array = exports.concat = exports.toViewCopy = exports.toView = exports.toUint8ArrayCopy = exports.toUint8Array = exports.toArrayBufferLike = exports.toArrayBuffer = exports.isSharedArrayBuffer = exports.isBufferSource = exports.isArrayBufferView = exports.isArrayBufferLike = exports.isArrayBuffer = exports.assertBufferSource = void 0;
	var buffer_source_js_1 = require_buffer_source();
	Object.defineProperty(exports, "assertBufferSource", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.assertBufferSource;
		}
	});
	Object.defineProperty(exports, "isArrayBuffer", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.isArrayBuffer;
		}
	});
	Object.defineProperty(exports, "isArrayBufferLike", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.isArrayBufferLike;
		}
	});
	Object.defineProperty(exports, "isArrayBufferView", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.isArrayBufferView;
		}
	});
	Object.defineProperty(exports, "isBufferSource", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.isBufferSource;
		}
	});
	Object.defineProperty(exports, "isSharedArrayBuffer", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.isSharedArrayBuffer;
		}
	});
	Object.defineProperty(exports, "toArrayBuffer", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toArrayBuffer;
		}
	});
	Object.defineProperty(exports, "toArrayBufferLike", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toArrayBufferLike;
		}
	});
	Object.defineProperty(exports, "toUint8Array", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toUint8Array;
		}
	});
	Object.defineProperty(exports, "toUint8ArrayCopy", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toUint8ArrayCopy;
		}
	});
	Object.defineProperty(exports, "toView", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toView;
		}
	});
	Object.defineProperty(exports, "toViewCopy", {
		enumerable: true,
		get: function() {
			return buffer_source_js_1.toViewCopy;
		}
	});
	var concat_js_1 = require_concat();
	Object.defineProperty(exports, "concat", {
		enumerable: true,
		get: function() {
			return concat_js_1.concat;
		}
	});
	Object.defineProperty(exports, "concatToUint8Array", {
		enumerable: true,
		get: function() {
			return concat_js_1.concatToUint8Array;
		}
	});
	var equal_js_1 = require_equal();
	Object.defineProperty(exports, "equal", {
		enumerable: true,
		get: function() {
			return equal_js_1.equal;
		}
	});
	var sequence_js_1 = require_sequence();
	Object.defineProperty(exports, "compare", {
		enumerable: true,
		get: function() {
			return sequence_js_1.compare;
		}
	});
	Object.defineProperty(exports, "copy", {
		enumerable: true,
		get: function() {
			return sequence_js_1.copy;
		}
	});
	Object.defineProperty(exports, "endsWith", {
		enumerable: true,
		get: function() {
			return sequence_js_1.endsWith;
		}
	});
	Object.defineProperty(exports, "includes", {
		enumerable: true,
		get: function() {
			return sequence_js_1.includes;
		}
	});
	Object.defineProperty(exports, "indexOf", {
		enumerable: true,
		get: function() {
			return sequence_js_1.indexOf;
		}
	});
	Object.defineProperty(exports, "lastIndexOf", {
		enumerable: true,
		get: function() {
			return sequence_js_1.lastIndexOf;
		}
	});
	Object.defineProperty(exports, "slice", {
		enumerable: true,
		get: function() {
			return sequence_js_1.slice;
		}
	});
	Object.defineProperty(exports, "startsWith", {
		enumerable: true,
		get: function() {
			return sequence_js_1.startsWith;
		}
	});
	Object.defineProperty(exports, "tail", {
		enumerable: true,
		get: function() {
			return sequence_js_1.tail;
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/binary.js
var require_binary = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.binary = void 0;
	exports.encode = encode;
	exports.decode = decode;
	exports.is = is;
	const index_js_1 = require_bytes();
	function encode(data) {
		const bytes = (0, index_js_1.toUint8Array)(data);
		let result = "";
		for (const byte of bytes) result += String.fromCharCode(byte);
		return result;
	}
	function decode(text) {
		const result = new Uint8Array(text.length);
		for (let i = 0; i < text.length; i++) result[i] = text.charCodeAt(i) & 255;
		return result;
	}
	function is(text) {
		return typeof text === "string";
	}
	exports.binary = {
		encode,
		decode,
		is
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/hex.js
var require_hex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hex = exports.formats = void 0;
	exports.normalize = normalize;
	exports.is = is;
	exports.encode = encode;
	exports.decode = decode;
	exports.parse = parse;
	exports.format = format;
	const index_js_1 = require_bytes();
	const HEX_CHARACTER_REGEX = /^[0-9a-f]$/i;
	const COMMON_SEPARATORS = [
		" ",
		"	",
		"\n",
		"\r",
		":",
		"-",
		"."
	];
	function resolveSeparators(options) {
		if (options.separators === "none") return [];
		if (!options.separators || options.separators === "common") return COMMON_SEPARATORS;
		return options.separators;
	}
	function validateSeparator(separator) {
		if (!separator) throw new TypeError("Hex separators must be non-empty strings");
	}
	function matchSeparator(text, index, separators) {
		for (const separator of separators) if (text.startsWith(separator, index)) return separator;
	}
	function detectCase(text) {
		const hasUpper = /[A-F]/.test(text);
		const hasLower = /[a-f]/.test(text);
		return hasUpper && !hasLower ? "upper" : "lower";
	}
	function detectLineSeparator(text) {
		const match = /\r\n|\n/.exec(text);
		if (!match) return;
		return match[0] === "\r\n" ? "\r\n" : "\n";
	}
	function compactForDetection(text) {
		return text.replace(/[^0-9a-f]/gi, "");
	}
	function detectGroup(text) {
		const segments = text.match(/[0-9A-Fa-f]+|[^0-9A-Fa-f]+/g) ?? [];
		if (segments.length < 3) return;
		const hexSegments = segments.filter((_, index) => index % 2 === 0);
		const separators = segments.filter((_, index) => index % 2 === 1);
		const separator = separators[0];
		if (!separator || separators.some((item) => item !== separator)) return;
		if (hexSegments.some((segment) => segment.length === 0 || segment.length % 2 !== 0)) return;
		const firstLength = hexSegments[0]?.length ?? 0;
		if (!firstLength) return;
		if (hexSegments.slice(0, -1).some((segment) => segment.length !== firstLength)) return;
		if ((hexSegments[hexSegments.length - 1]?.length ?? 0) > firstLength) return;
		return {
			size: firstLength / 2,
			separator
		};
	}
	function detectFormat(text) {
		const trimmed = text.trim();
		const prefix = /^0x/i.test(trimmed) ? "0x" : "";
		const body = prefix ? trimmed.slice(2) : trimmed;
		const lineSeparator = detectLineSeparator(body);
		const lines = body.split(/\r\n|\n/).filter((line) => line.length > 0);
		const group = detectGroup(lines[0]?.trim() ?? "");
		const format = {
			case: detectCase(trimmed),
			prefix
		};
		if (group) format.group = group;
		if (lineSeparator && lines.length > 1) {
			const firstLineBytes = compactForDetection(lines[0] ?? "").length / 2;
			if (firstLineBytes > 0 && lines.slice(0, -1).every((line) => compactForDetection(line).length / 2 === firstLineBytes)) format.line = {
				bytesPerLine: firstLineBytes,
				separator: lineSeparator
			};
		}
		return format;
	}
	function normalizeText(text, options) {
		const allowPrefix = options.allowPrefix ?? true;
		const separators = [...resolveSeparators(options)].sort((left, right) => right.length - left.length);
		for (const separator of separators) validateSeparator(separator);
		let working = text.trim();
		if (/^0x/i.test(working)) {
			if (!allowPrefix) throw new TypeError("Hexadecimal text must not include a 0x prefix");
			working = working.slice(2);
		}
		let normalized = "";
		let lastTokenWasSeparator = false;
		for (let index = 0; index < working.length;) {
			const character = working[index] ?? "";
			if (HEX_CHARACTER_REGEX.test(character)) {
				normalized += character;
				lastTokenWasSeparator = false;
				index += 1;
				continue;
			}
			const separator = matchSeparator(working, index, separators);
			if (!separator) throw new TypeError("Input is not valid hexadecimal text");
			if (options.strict && (lastTokenWasSeparator || normalized.length === 0)) throw new TypeError("Hexadecimal text contains misplaced separators");
			lastTokenWasSeparator = true;
			index += separator.length;
		}
		if (options.strict && lastTokenWasSeparator && normalized.length > 0) throw new TypeError("Hexadecimal text must not end with a separator");
		if (normalized.length % 2 !== 0) {
			if (!options.allowOddLength) throw new TypeError("Hexadecimal text must contain an even number of characters");
			normalized = `0${normalized}`;
		}
		return normalized.toLowerCase();
	}
	function groupPairs(pairs, group) {
		if (!group) return pairs.join("");
		if (!Number.isInteger(group.size) || group.size < 1) throw new RangeError("Hex group size must be a positive integer");
		const chunks = [];
		for (let index = 0; index < pairs.length; index += group.size) chunks.push(pairs.slice(index, index + group.size).join(""));
		return chunks.join(group.separator);
	}
	function normalize(text, options = {}) {
		return normalizeText(text, options);
	}
	function is(text, options = {}) {
		if (typeof text !== "string") return false;
		try {
			normalize(text, options);
			return true;
		} catch {
			return false;
		}
	}
	function encode(data, options = {}) {
		const bytes = (0, index_js_1.toUint8Array)(data);
		const casing = options.case ?? "lower";
		const pairs = Array.from(bytes, (byte) => {
			const text = byte.toString(16).padStart(2, "0");
			return casing === "upper" ? text.toUpperCase() : text;
		});
		let body = "";
		if (options.line) {
			const bytesPerLine = options.line.bytesPerLine;
			if (!Number.isInteger(bytesPerLine) || bytesPerLine < 1) throw new RangeError("Hex bytesPerLine must be a positive integer");
			const separator = options.line.separator ?? "\n";
			const lines = [];
			for (let index = 0; index < pairs.length; index += bytesPerLine) lines.push(groupPairs(pairs.slice(index, index + bytesPerLine), options.group));
			body = lines.join(separator);
		} else body = groupPairs(pairs, options.group);
		return `${options.prefix ?? ""}${body}`;
	}
	function decode(text, options = {}) {
		const normalized = normalize(text, options);
		const result = new Uint8Array(normalized.length / 2);
		for (let i = 0; i < normalized.length; i += 2) result[i / 2] = Number.parseInt(normalized.slice(i, i + 2), 16);
		return result;
	}
	function parse(text, options = {}) {
		const normalized = normalize(text, options);
		return {
			bytes: decode(normalized),
			format: detectFormat(text),
			normalized
		};
	}
	function format(data, value) {
		return encode(data, value);
	}
	exports.formats = {
		compact: Object.freeze({}),
		upper: Object.freeze({ case: "upper" }),
		colon: Object.freeze({ group: {
			size: 1,
			separator: ":"
		} }),
		colonUpper: Object.freeze({
			case: "upper",
			group: {
				size: 1,
				separator: ":"
			}
		}),
		groupsOf4: Object.freeze({ group: {
			size: 4,
			separator: " "
		} }),
		prefixed: Object.freeze({ prefix: "0x" })
	};
	exports.hex = {
		encode,
		decode,
		format,
		formats: exports.formats,
		is,
		normalize,
		parse
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/utf8.js
var require_utf8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.utf8 = void 0;
	exports.encode = encode;
	exports.decode = decode;
	const index_js_1 = require_bytes();
	function encode(text) {
		return new TextEncoder().encode(text);
	}
	function decode(data) {
		return new TextDecoder("utf-8", { fatal: false }).decode((0, index_js_1.toUint8Array)(data));
	}
	exports.utf8 = {
		encode,
		decode
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/utf16.js
var require_utf16 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.utf16 = void 0;
	exports.encode = encode;
	exports.decode = decode;
	const index_js_1 = require_bytes();
	function encode(text, options = {}) {
		const result = /* @__PURE__ */ new ArrayBuffer(text.length * 2);
		const view = new DataView(result);
		for (let i = 0; i < text.length; i++) view.setUint16(i * 2, text.charCodeAt(i), options.littleEndian ?? false);
		return new Uint8Array(result);
	}
	function decode(data, options = {}) {
		const buffer = (0, index_js_1.toArrayBuffer)(data);
		const view = new DataView(buffer);
		let result = "";
		for (let i = 0; i < buffer.byteLength; i += 2) result += String.fromCharCode(view.getUint16(i, options.littleEndian ?? false));
		return result;
	}
	exports.utf16 = {
		encode,
		decode
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.base64 = void 0;
	exports.normalize = normalize;
	exports.pad = pad;
	exports.is = is;
	exports.encode = encode;
	exports.decode = decode;
	const index_js_1 = require_bytes();
	const binary_js_1 = require_binary();
	const BASE64_REGEX = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
	function nodeBuffer() {
		return globalThis.Buffer;
	}
	function normalize(text) {
		return text.replace(/[\n\r\t ]/g, "");
	}
	function pad(text) {
		const remainder = text.length % 4;
		return remainder ? text + "=".repeat(4 - remainder) : text;
	}
	function is(text) {
		if (typeof text !== "string") return false;
		const normalized = normalize(text);
		return normalized === "" || BASE64_REGEX.test(normalized);
	}
	function encode(data, _options) {
		const bytes = (0, index_js_1.toUint8Array)(data);
		const buffer = nodeBuffer();
		if (buffer) return buffer.from(bytes).toString("base64");
		return btoa((0, binary_js_1.encode)(bytes));
	}
	function decode(text, _options) {
		const normalized = normalize(text);
		if (!is(normalized)) throw new TypeError("Input is not valid Base64 text");
		const buffer = nodeBuffer();
		if (buffer) return new Uint8Array(buffer.from(normalized, "base64"));
		return (0, binary_js_1.decode)(atob(normalized));
	}
	exports.base64 = {
		encode,
		decode,
		is,
		normalize,
		pad
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/base64url.js
var require_base64url = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.base64url = void 0;
	exports.normalize = normalize;
	exports.is = is;
	exports.encode = encode;
	exports.decode = decode;
	const base64_js_1 = require_base64();
	const BASE64URL_REGEX = /^[A-Za-z0-9_-]*$/;
	function normalize(text) {
		return text.replace(/[\n\r\t ]/g, "");
	}
	function is(text) {
		return typeof text === "string" && BASE64URL_REGEX.test(normalize(text));
	}
	function encode(data, _options) {
		return base64_js_1.base64.encode(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
	}
	function decode(text, _options) {
		const normalized = normalize(text);
		if (!is(normalized)) throw new TypeError("Input is not valid Base64Url text");
		return base64_js_1.base64.decode(base64_js_1.base64.pad(normalized.replace(/-/g, "+").replace(/_/g, "/")));
	}
	exports.base64url = {
		encode,
		decode,
		is,
		normalize
	};
}));
//#endregion
//#region node_modules/.pnpm/@peculiar+utils@2.0.3/node_modules/@peculiar/utils/build/cjs/encoding/index.js
var require_encoding = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.base64url = exports.base64 = exports.utf16 = exports.utf8 = exports.hex = exports.binary = void 0;
	const tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
	exports.binary = tslib_1.__importStar(require_binary());
	exports.hex = tslib_1.__importStar(require_hex());
	exports.utf8 = tslib_1.__importStar(require_utf8());
	exports.utf16 = tslib_1.__importStar(require_utf16());
	exports.base64 = tslib_1.__importStar(require_base64());
	exports.base64url = tslib_1.__importStar(require_base64url());
}));
//#endregion
export { require_build$1 as a, require_build as i, require_base64 as n, init_tslib_es6 as o, require_bytes as r, tslib_es6_exports as s, require_encoding as t };
