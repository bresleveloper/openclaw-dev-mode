import { r as __require, t as __commonJSMin } from "./rolldown-runtime-DYf_mQCB.mjs";
import "./src-Ii137Gdc.mjs";
import { o as isRecord } from "./record-coerce-BgUo6bj4.mjs";
import { t as omitNullRequestHeaders } from "./request-headers-DJ4QrMC_.mjs";
import { a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { _ as isResponsesTerminalEventType, d as OpenAIResponsesWebSocketPreDispatchError, f as OpenAIResponsesWebSocketSafeRetryError, u as OpenAIResponsesWebSocketPostDispatchError, v as parseOpenAIResponsesWebSocketServerError } from "./openai-responses-contracts-BTBx9zkC.mjs";
import { getSessionResourceOwnerId, registerSessionResourceCleanup } from "./internal/session-resources.mjs";
import "./transport-utils-J6TkTVN5.mjs";
import { t as stableStringify } from "./stable-stringify-CGB-o900.mjs";
import "./src-CNWvILd1.mjs";
import { N as racePromiseWithAbortSignal, S as transportAbortError } from "./transport-stream-shared-DPUASGj0.mjs";
import { C as sha256Hex } from "./tool-schema-json-projection-Do42m3b7.mjs";
import { a as createResponsesSteering, o as omitAcceptedSteering } from "./openai-completions-transport-Dzqn0lMx.mjs";
import { Nt as recordResponsesContinuationState, Pt as resolveResponsesContinuationRequest, jt as responsesInputFingerprint } from "./openai-responses-shared-CZBZVeqY.mjs";
import { T as isOfficialOpenAIResponsesBaseUrl } from "./openai-responses-compaction-window-BwVpFH3V.mjs";
import { t as require_x509_transport_state } from "./x509-transport-state-CzZRpDUj.mjs";
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/tslib.js
var require_tslib = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.__setModuleDefault = exports.__createBinding = void 0;
	exports.__classPrivateFieldSet = __classPrivateFieldSet;
	exports.__classPrivateFieldGet = __classPrivateFieldGet;
	exports.__exportStar = __exportStar;
	exports.__importStar = __importStar;
	exports.__classPrivateFieldIn = __classPrivateFieldIn;
	exports.__importDefault = __importDefault;
	function __classPrivateFieldSet(receiver, state, value, kind, f) {
		if (kind === "m") throw new TypeError("Private method is not writable");
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
		return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
	}
	function __classPrivateFieldGet(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
	}
	var __createBinding = Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	};
	exports.__createBinding = __createBinding;
	function __exportStar(m, o) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
	}
	var __setModuleDefault = Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	};
	exports.__setModuleDefault = __setModuleDefault;
	var ownKeys = function(o) {
		ownKeys = Object.getOwnPropertyNames || function(o2) {
			var ar = [];
			for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
			return ar;
		};
		return ownKeys(o);
	};
	function __importStar(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
		}
		__setModuleDefault(result, mod);
		return result;
	}
	function __classPrivateFieldIn(state, receiver) {
		if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
		return typeof state === "function" ? receiver === state : state.has(receiver);
	}
	function __importDefault(mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const BINARY_TYPES = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	];
	const hasBlob = typeof Blob !== "undefined";
	if (hasBlob) BINARY_TYPES.push("blob");
	module.exports = {
		BINARY_TYPES,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { EMPTY_BUFFER } = require_constants();
	const FastBuffer = Buffer[Symbol.species];
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return new FastBuffer(target.buffer, target.byteOffset, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		for (let i = 0; i < buffer.length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.length === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = new FastBuffer(data);
		else if (ArrayBuffer.isView(data)) buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	module.exports = {
		concat,
		mask: _mask,
		toArrayBuffer,
		toBuffer,
		unmask: _unmask
	};
	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) try {
		const bufferUtil = __require("bufferutil");
		module.exports.mask = function(source, mask, output, offset, length) {
			if (length < 48) _mask(source, mask, output, offset, length);
			else bufferUtil.mask(source, mask, output, offset, length);
		};
		module.exports.unmask = function(buffer, mask) {
			if (buffer.length < 32) _unmask(buffer, mask);
			else bufferUtil.unmask(buffer, mask);
		};
	} catch (e) {}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const kDone = Symbol("kDone");
	const kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const zlib = __require("zlib");
	const bufferUtil = require_buffer_util();
	const Limiter = require_limiter();
	const { kStatusCode } = require_constants();
	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	const kPerMessageDeflate = Symbol("permessage-deflate");
	const kTotalLength = Symbol("total-length");
	const kCallback = Symbol("callback");
	const kBuffers = Symbol("buffers");
	const kError = Symbol("error");
	let zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [options.isServer=false] Create the instance in either
		*     server or client mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed if context takeover is disabled
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		*/
		constructor(options) {
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._maxPayload = this._options.maxPayload | 0;
			this._isServer = !!this._options.isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) {
				const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
				zlibLimiter = new Limiter(concurrency);
			}
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && (typeof params.client_max_window_bits === "number" ? opts.clientMaxWindowBits > params.client_max_window_bits : !params.client_max_window_bits)) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		if (this[kError]) {
			this[kCallback](this[kError]);
			return;
		}
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { isUtf8 } = __require("buffer");
	const { hasBlob } = require_constants();
	const tokenChars = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	/**
	* Determines whether a value is a `Blob`.
	*
	* @param {*} value The value to be tested
	* @return {Boolean} `true` if `value` is a `Blob`, else `false`
	* @private
	*/
	function isBlob(value) {
		return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
	}
	module.exports = {
		isBlob,
		isValidStatusCode,
		isValidUTF8: _isValidUTF8,
		tokenChars
	};
	if (isUtf8) module.exports.isValidUTF8 = function(buf) {
		return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		const isValidUTF8 = __require("utf-8-validate");
		module.exports.isValidUTF8 = function(buf) {
			return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
		};
	} catch (e) {}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { Writable } = __require("stream");
	const PerMessageDeflate = require_permessage_deflate();
	const { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	const { concat, toArrayBuffer, unmask } = require_buffer_util();
	const { isValidStatusCode, isValidUTF8 } = require_validation();
	const FastBuffer = Buffer[Symbol.species];
	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const DEFER_EVENT = 6;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {Object} [options] Options object
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {String} [options.binaryType=nodebuffer] The type for binary data
		* @param {Object} [options.extensions] An object containing the negotiated
		*     extensions
		* @param {Boolean} [options.isServer=false] Specifies whether to operate in
		*     client or server mode
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		*/
		constructor(options = {}) {
			super();
			this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
			this._binaryType = options.binaryType || BINARY_TYPES[0];
			this._extensions = options.extensions || {};
			this._isServer = !!options.isServer;
			this._maxBufferedChunks = options.maxBufferedChunks | 0;
			this._maxFragments = options.maxFragments | 0;
			this._maxPayload = options.maxPayload | 0;
			this._skipUTF8Validation = !!options.skipUTF8Validation;
			this[kWebSocket] = void 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._numFragments = 0;
			this._fragments = [];
			this._errored = false;
			this._loop = false;
			this._state = GET_INFO;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			if (this._maxBufferedChunks > 0 && this._buffers.length >= this._maxBufferedChunks) {
				cb(this.createError(RangeError, "Too many buffered chunks", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				return new FastBuffer(buf.buffer, buf.byteOffset, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						this.getInfo(cb);
						break;
					case GET_PAYLOAD_LENGTH_16:
						this.getPayloadLength16(cb);
						break;
					case GET_PAYLOAD_LENGTH_64:
						this.getPayloadLength64(cb);
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						this.getData(cb);
						break;
					case INFLATING:
					case DEFER_EVENT:
						this._loop = false;
						return;
				}
			while (this._loop);
			if (!this._errored) cb();
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getInfo(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				cb(this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3"));
				return;
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
				return;
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (!this._fragmented) {
					cb(this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					cb(this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN"));
					return;
				}
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
					cb(this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"));
					return;
				}
			} else {
				cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
				return;
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					cb(this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK"));
					return;
				}
			} else if (this._masked) {
				cb(this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK"));
				return;
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength16(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength64(cb) {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				cb(this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"));
				return;
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			this.haveLength(cb);
		}
		/**
		* Payload length has been read.
		*
		* @param {Function} cb Callback
		* @private
		*/
		haveLength(cb) {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					return;
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) unmask(data, this._mask);
			}
			if (this._opcode > 7) {
				this.controlMessage(data, cb);
				return;
			}
			if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
				cb(this.createError(RangeError, "Too many message fragments", false, 1008, "WS_ERR_TOO_MANY_BUFFERED_PARTS"));
				return;
			}
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			this.dataMessage(cb);
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
						cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
						return;
					}
					this._fragments.push(buf);
				}
				this.dataMessage(cb);
				if (this._state === GET_INFO) this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @param {Function} cb Callback
		* @private
		*/
		dataMessage(cb) {
			if (!this._fin) {
				this._state = GET_INFO;
				return;
			}
			const messageLength = this._messageLength;
			const fragments = this._fragments;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragmented = 0;
			this._numFragments = 0;
			this._fragments = [];
			if (this._opcode === 2) {
				let data;
				if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
				else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
				else if (this._binaryType === "blob") data = new Blob(fragments);
				else data = fragments;
				if (this._allowSynchronousEvents) {
					this.emit("message", data, true);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", data, true);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			} else {
				const buf = concat(fragments, messageLength);
				if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
					cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
					return;
				}
				if (this._state === INFLATING || this._allowSynchronousEvents) {
					this.emit("message", buf, false);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", buf, false);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			}
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data, cb) {
			if (this._opcode === 8) {
				if (data.length === 0) {
					this._loop = false;
					this.emit("conclude", 1005, EMPTY_BUFFER);
					this.end();
				} else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) {
						cb(this.createError(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE"));
						return;
					}
					const buf = new FastBuffer(data.buffer, data.byteOffset + 2, data.length - 2);
					if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
						cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
						return;
					}
					this._loop = false;
					this.emit("conclude", code, buf);
					this.end();
				}
				this._state = GET_INFO;
				return;
			}
			if (this._allowSynchronousEvents) {
				this.emit(this._opcode === 9 ? "ping" : "pong", data);
				this._state = GET_INFO;
			} else {
				this._state = DEFER_EVENT;
				setImmediate(() => {
					this.emit(this._opcode === 9 ? "ping" : "pong", data);
					this._state = GET_INFO;
					this.startLoop(cb);
				});
			}
		}
		/**
		* Builds an error object.
		*
		* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
		* @param {String} message The error message
		* @param {Boolean} prefix Specifies whether or not to add a default prefix to
		*     `message`
		* @param {Number} statusCode The status code
		* @param {String} errorCode The exposed error code
		* @return {(Error|RangeError)} The error
		* @private
		*/
		createError(ErrorCtor, message, prefix, statusCode, errorCode) {
			this._loop = false;
			this._errored = true;
			const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
			Error.captureStackTrace(err, this.createError);
			err.code = errorCode;
			err[kStatusCode] = statusCode;
			return err;
		}
	};
	module.exports = Receiver;
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { Duplex } = __require("stream");
	const { randomFillSync } = __require("crypto");
	const { types: { isUint8Array } } = __require("util");
	const PerMessageDeflate = require_permessage_deflate();
	const { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
	const { isBlob, isValidStatusCode } = require_validation();
	const { mask: applyMask, toBuffer } = require_buffer_util();
	const kByteLength = Symbol("kByteLength");
	const maskBuffer = Buffer.alloc(4);
	const RANDOM_POOL_SIZE = 8192;
	let randomPool;
	let randomPoolPointer = RANDOM_POOL_SIZE;
	const DEFAULT = 0;
	const DEFLATING = 1;
	const GET_BLOB_DATA = 2;
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {Duplex} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Function} [generateMask] The function used to generate the masking
		*     key
		*/
		constructor(socket, extensions, generateMask) {
			this._extensions = extensions || {};
			if (generateMask) {
				this._generateMask = generateMask;
				this._maskBuffer = Buffer.alloc(4);
			}
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._queue = [];
			this._state = DEFAULT;
			this.onerror = NOOP;
			this[kWebSocket] = void 0;
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {(Buffer|String)} data The data to frame
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {(Buffer|String)[]} The framed data
		* @public
		*/
		static frame(data, options) {
			let mask;
			let merge = false;
			let offset = 2;
			let skipMasking = false;
			if (options.mask) {
				mask = options.maskBuffer || maskBuffer;
				if (options.generateMask) options.generateMask(mask);
				else {
					if (randomPoolPointer === RANDOM_POOL_SIZE) {
						/* istanbul ignore else  */
						if (randomPool === void 0) randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
						randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
						randomPoolPointer = 0;
					}
					mask[0] = randomPool[randomPoolPointer++];
					mask[1] = randomPool[randomPoolPointer++];
					mask[2] = randomPool[randomPoolPointer++];
					mask[3] = randomPool[randomPoolPointer++];
				}
				skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
				offset = 6;
			}
			let dataLength;
			if (typeof data === "string") {
				if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) dataLength = options[kByteLength];
				else {
					data = Buffer.from(data);
					dataLength = data.length;
				}
			} else {
				dataLength = data.length;
				merge = options.mask && options.readOnly && !skipMasking;
			}
			let payloadLength = dataLength;
			if (dataLength >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (dataLength > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(dataLength, 2);
			else if (payloadLength === 127) {
				target[2] = target[3] = 0;
				target.writeUIntBE(dataLength, 4, 6);
			}
			if (!options.mask) return [target, data];
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (skipMasking) return [target, data];
			if (merge) {
				applyMask(data, mask, target, offset, dataLength);
				return [target];
			}
			applyMask(data, mask, data, 0, dataLength);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {(String|Buffer)} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || !data.length) {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				if (typeof data === "string") buf.write(data, 2);
				else if (isUint8Array(data)) buf.set(data, 2);
				else throw new TypeError("Second argument must be a string or a Uint8Array");
			}
			const options = {
				[kByteLength]: buf.length,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: false,
				rsv1: false
			};
			if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				buf,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(buf, options), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					false,
					options,
					cb
				]);
				else this.getBlobData(data, false, options, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					false,
					options,
					cb
				]);
				else this.getBlobData(data, false, options, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) rsv1 = byteLength >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			const opts = {
				[kByteLength]: byteLength,
				fin: options.fin,
				generateMask: this._generateMask,
				mask: options.mask,
				maskBuffer: this._maskBuffer,
				opcode,
				readOnly,
				rsv1
			};
			if (isBlob(data)) {
				if (this._state !== DEFAULT) this.enqueue([
					this.getBlobData,
					data,
					this._compress,
					opts,
					cb
				]);
				else this.getBlobData(data, this._compress, opts, cb);
			} else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.dispatch(data, this._compress, opts, cb);
		}
		/**
		* Gets the contents of a blob as binary data.
		*
		* @param {Blob} blob The blob
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     the data
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		getBlobData(blob, compress, options, cb) {
			this._bufferedBytes += options[kByteLength];
			this._state = GET_BLOB_DATA;
			blob.arrayBuffer().then((arrayBuffer) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while the blob was being read");
					process.nextTick(callCallbacks, this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				const data = toBuffer(arrayBuffer);
				if (!compress) {
					this._state = DEFAULT;
					this.sendFrame(Sender.frame(data, options), cb);
					this.dequeue();
				} else this.dispatch(data, compress, options, cb);
			}).catch((err) => {
				process.nextTick(onError, this, err, cb);
			});
		}
		/**
		* Dispatches a message.
		*
		* @param {(Buffer|String)} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += options[kByteLength];
			this._state = DEFLATING;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					callCallbacks(this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				this._state = DEFAULT;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (this._state === DEFAULT && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[3][kByteLength];
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[3][kByteLength];
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {(Buffer | String)[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
	/**
	* Calls queued callbacks with an error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error to call the callbacks with
	* @param {Function} [cb] The first callback
	* @private
	*/
	function callCallbacks(sender, err, cb) {
		if (typeof cb === "function") cb(err);
		for (let i = 0; i < sender._queue.length; i++) {
			const params = sender._queue[i];
			const callback = params[params.length - 1];
			if (typeof callback === "function") callback(err);
		}
	}
	/**
	* Handles a `Sender` error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error
	* @param {Function} [cb] The first pending callback
	* @private
	*/
	function onError(sender, err, cb) {
		callCallbacks(sender, err, cb);
		sender.onerror(err);
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { kForOnEventAttribute, kListener } = require_constants();
	const kCode = Symbol("kCode");
	const kData = Symbol("kData");
	const kError = Symbol("kError");
	const kMessage = Symbol("kMessage");
	const kReason = Symbol("kReason");
	const kTarget = Symbol("kTarget");
	const kType = Symbol("kType");
	const kWasClean = Symbol("kWasClean");
	/**
	* Class representing an event.
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @throws {TypeError} If the `type` argument is not specified
		*/
		constructor(type) {
			this[kTarget] = null;
			this[kType] = type;
		}
		/**
		* @type {*}
		*/
		get target() {
			return this[kTarget];
		}
		/**
		* @type {String}
		*/
		get type() {
			return this[kType];
		}
	};
	Object.defineProperty(Event.prototype, "target", { enumerable: true });
	Object.defineProperty(Event.prototype, "type", { enumerable: true });
	/**
	* Class representing a close event.
	*
	* @extends Event
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {Number} [options.code=0] The status code explaining why the
		*     connection was closed
		* @param {String} [options.reason=''] A human-readable string explaining why
		*     the connection was closed
		* @param {Boolean} [options.wasClean=false] Indicates whether or not the
		*     connection was cleanly closed
		*/
		constructor(type, options = {}) {
			super(type);
			this[kCode] = options.code === void 0 ? 0 : options.code;
			this[kReason] = options.reason === void 0 ? "" : options.reason;
			this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
		}
		/**
		* @type {Number}
		*/
		get code() {
			return this[kCode];
		}
		/**
		* @type {String}
		*/
		get reason() {
			return this[kReason];
		}
		/**
		* @type {Boolean}
		*/
		get wasClean() {
			return this[kWasClean];
		}
	};
	Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
	/**
	* Class representing an error event.
	*
	* @extends Event
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.error=null] The error that generated this event
		* @param {String} [options.message=''] The error message
		*/
		constructor(type, options = {}) {
			super(type);
			this[kError] = options.error === void 0 ? null : options.error;
			this[kMessage] = options.message === void 0 ? "" : options.message;
		}
		/**
		* @type {*}
		*/
		get error() {
			return this[kError];
		}
		/**
		* @type {String}
		*/
		get message() {
			return this[kMessage];
		}
	};
	Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
	/**
	* Class representing a message event.
	*
	* @extends Event
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.data=null] The message content
		*/
		constructor(type, options = {}) {
			super(type);
			this[kData] = options.data === void 0 ? null : options.data;
		}
		/**
		* @type {*}
		*/
		get data() {
			return this[kData];
		}
	};
	Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
	module.exports = {
		CloseEvent,
		ErrorEvent,
		Event,
		EventTarget: {
			/**
			* Register an event listener.
			*
			* @param {String} type A string representing the event type to listen for
			* @param {(Function|Object)} handler The listener to add
			* @param {Object} [options] An options object specifies characteristics about
			*     the event listener
			* @param {Boolean} [options.once=false] A `Boolean` indicating that the
			*     listener should be invoked at most once after being added. If `true`,
			*     the listener would be automatically removed when invoked.
			* @public
			*/
			addEventListener(type, handler, options = {}) {
				for (const listener of this.listeners(type)) if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) return;
				let wrapper;
				if (type === "message") wrapper = function onMessage(data, isBinary) {
					const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "close") wrapper = function onClose(code, message) {
					const event = new CloseEvent("close", {
						code,
						reason: message.toString(),
						wasClean: this._closeFrameReceived && this._closeFrameSent
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "error") wrapper = function onError(error) {
					const event = new ErrorEvent("error", {
						error,
						message: error.message
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "open") wrapper = function onOpen() {
					const event = new Event("open");
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else return;
				wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
				wrapper[kListener] = handler;
				if (options.once) this.once(type, wrapper);
				else this.on(type, wrapper);
			},
			/**
			* Remove an event listener.
			*
			* @param {String} type A string representing the event type to remove
			* @param {(Function|Object)} handler The listener to remove
			* @public
			*/
			removeEventListener(type, handler) {
				for (const listener of this.listeners(type)) if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
					this.removeListener(type, listener);
					break;
				}
			}
		},
		MessageEvent
	};
	/**
	* Call an event listener
	*
	* @param {(Function|Object)} listener The listener to call
	* @param {*} thisArg The value to use as `this`` when calling the listener
	* @param {Event} event The event to pass to the listener
	* @private
	*/
	function callListener(listener, thisArg, event) {
		if (typeof listener === "object" && listener.handleEvent) listener.handleEvent.call(listener, event);
		else listener.call(thisArg, event);
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { tokenChars } = require_validation();
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let code = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			code = header.charCodeAt(i);
			if (extensionName === void 0) {
				if (end === -1 && tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (i !== 0 && (code === 32 || code === 9)) {
					if (end === -1 && start !== -1) end = i;
				} else if (code === 59 || code === 44) {
					if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
					if (end === -1) end = i;
					const name = header.slice(start, end);
					if (code === 44) {
						push(offers, name, params);
						params = Object.create(null);
					} else extensionName = name;
					start = end = -1;
				} else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (paramName === void 0) {
				if (end === -1 && tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (code === 32 || code === 9) {
					if (end === -1 && start !== -1) end = i;
				} else if (code === 59 || code === 44) {
					if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
					if (end === -1) end = i;
					push(params, header.slice(start, end), true);
					if (code === 44) {
						push(offers, extensionName, params);
						params = Object.create(null);
						extensionName = void 0;
					}
					start = end = -1;
				} else if (code === 61 && start !== -1 && end === -1) {
					paramName = header.slice(start, i);
					start = end = -1;
				} else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) {
				if (tokenChars[code] === 1) {
					if (start === -1) start = i;
				} else if (code === 34 && start !== -1) {
					inQuotes = false;
					end = i;
				} else if (code === 92) isEscaping = true;
				else throw new SyntaxError(`Unexpected character at index ${i}`);
			} else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes || code === 32 || code === 9) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events");
	const https = __require("https");
	const http = __require("http");
	const net = __require("net");
	const tls = __require("tls");
	const { randomBytes, createHash } = __require("crypto");
	const { Duplex, Readable } = __require("stream");
	const { URL } = __require("url");
	const PerMessageDeflate = require_permessage_deflate();
	const Receiver = require_receiver();
	const Sender = require_sender();
	const { isBlob } = require_validation();
	const { BINARY_TYPES, CLOSE_TIMEOUT, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants();
	const { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
	const { format, parse } = require_extension();
	const { toBuffer } = require_buffer_util();
	const kAborted = Symbol("kAborted");
	const protocolVersions = [8, 13];
	const readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = EMPTY_BUFFER;
			this._closeTimer = null;
			this._errorEmitted = false;
			this._extensions = {};
			this._paused = false;
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (protocols === void 0) {
					if (!options || options.protocols === void 0) protocols = [];
					else if (Array.isArray(options.protocols)) protocols = options.protocols;
					else protocols = [options.protocols];
				} else if (!Array.isArray(protocols)) {
					if (typeof protocols === "object" && protocols !== null) {
						options = protocols;
						if (options.protocols === void 0) protocols = [];
						else if (Array.isArray(options.protocols)) protocols = options.protocols;
						else protocols = [options.protocols];
					} else protocols = [protocols];
				}
				initAsClient(this, address, protocols, options);
			} else {
				this._autoPong = options.autoPong;
				this._closeTimeout = options.closeTimeout;
				this._isServer = true;
			}
		}
		/**
		* For historical reasons, the custom "nodebuffer" type is used by the default
		* instead of "blob".
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Boolean}
		*/
		get isPaused() {
			return this._paused;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Object} options Options object
		* @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Number} [options.maxBufferedChunks=0] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=0] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=0] The maximum allowed message size
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @private
		*/
		setSocket(socket, head, options) {
			const receiver = new Receiver({
				allowSynchronousEvents: options.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxBufferedChunks: options.maxBufferedChunks,
				maxFragments: options.maxFragments,
				maxPayload: options.maxPayload,
				skipUTF8Validation: options.skipUTF8Validation
			});
			const sender = new Sender(socket, this._extensions, options.generateMask);
			this._receiver = receiver;
			this._sender = sender;
			this._socket = socket;
			receiver[kWebSocket] = this;
			sender[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			sender.onerror = senderOnError;
			if (socket.setTimeout) socket.setTimeout(0);
			if (socket.setNoDelay) socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {(String|Buffer)} [data] The reason why the connection is
		*     closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			this._readyState = WebSocket.CLOSING;
			setCloseTimer(this);
		}
		/**
		* Pause the socket.
		*
		* @public
		*/
		pause() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = true;
			this._socket.pause();
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Resume the socket.
		*
		* @public
		*/
		resume() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = false;
			if (!this._receiver._writableState.needDrain) this._socket.resume();
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) return listener[kListener];
				return null;
			},
			set(handler) {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) {
					this.removeListener(method, listener);
					break;
				}
				if (typeof handler !== "function") return;
				this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {Array} protocols The subprotocols
	* @param {Object} [options] Connection options
	* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	*     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	*     times in the same tick
	* @param {Boolean} [options.autoPong=true] Specifies whether or not to
	*     automatically send a pong in response to a ping
	* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	*     for the closing handshake to finish after `websocket.close()` is called
	* @param {Function} [options.finishRequest] A function which can be used to
	*     customize the headers of each http request before it is sent
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Function} [options.generateMask] The function used to generate the
	*     masking key
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	*     buffered data chunks
	* @param {Number} [options.maxFragments=16384] The maximum number of message
	*     fragments
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	*     not to skip UTF-8 validation for text and close messages
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			allowSynchronousEvents: true,
			autoPong: true,
			closeTimeout: CLOSE_TIMEOUT,
			protocolVersion: protocolVersions[1],
			maxBufferedChunks: 262144,
			maxFragments: 16384,
			maxPayload: 104857600,
			skipUTF8Validation: false,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			protocols: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		websocket._autoPong = opts.autoPong;
		websocket._closeTimeout = opts.closeTimeout;
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL) parsedUrl = address;
		else try {
			parsedUrl = new URL(address);
		} catch {
			throw new SyntaxError(`Invalid URL: ${address}`);
		}
		if (parsedUrl.protocol === "http:") parsedUrl.protocol = "ws:";
		else if (parsedUrl.protocol === "https:") parsedUrl.protocol = "wss:";
		websocket._url = parsedUrl.href;
		const isSecure = parsedUrl.protocol === "wss:";
		const isIpcUrl = parsedUrl.protocol === "ws+unix:";
		let invalidUrlMessage;
		if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) invalidUrlMessage = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"";
		else if (isIpcUrl && !parsedUrl.pathname) invalidUrlMessage = "The URL's pathname is empty";
		else if (parsedUrl.hash) invalidUrlMessage = "The URL contains a fragment identifier";
		if (invalidUrlMessage) {
			const err = new SyntaxError(invalidUrlMessage);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const request = isSecure ? https.request : http.request;
		const protocolSet = /* @__PURE__ */ new Set();
		let perMessageDeflate;
		opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			...opts.headers,
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket"
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate({
				...opts.perMessageDeflate,
				isServer: false,
				maxPayload: opts.maxPayload
			});
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols.length) {
			for (const protocol of protocols) {
				if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
				protocolSet.add(protocol);
			}
			opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
		}
		if (opts.origin) {
			if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
			else opts.headers.Origin = opts.origin;
		}
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isIpcUrl) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		let req;
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalIpc = isIpcUrl;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else if (websocket.listenerCount("redirect") === 0) {
				const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
			req = websocket._req = request(opts);
			if (websocket._redirects) websocket.emit("redirect", websocket.url, req);
		} else req = websocket._req = request(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req[kAborted]) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL(location, address);
				} catch (e) {
					emitErrorAndClose(websocket, /* @__PURE__ */ new SyntaxError(`Invalid URL: ${location}`));
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			let protError;
			if (serverProt !== void 0) {
				if (!protocolSet.size) protError = "Server sent a subprotocol but none was requested";
				else if (!protocolSet.has(serverProt)) protError = "Server sent an invalid subprotocol";
			} else if (protocolSet.size) protError = "Server sent no subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
					abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
					return;
				}
				try {
					perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
			}
			websocket.setSocket(socket, head, {
				allowSynchronousEvents: opts.allowSynchronousEvents,
				generateMask: opts.generateMask,
				maxBufferedChunks: opts.maxBufferedChunks,
				maxFragments: opts.maxFragments,
				maxPayload: opts.maxPayload,
				skipUTF8Validation: opts.skipUTF8Validation
			});
		});
		if (opts.finishRequest) opts.finishRequest(req, websocket);
		else req.end();
	}
	/**
	* Emit the `'error'` and `'close'` events.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket._errorEmitted = true;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream[kAborted] = true;
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			process.nextTick(emitErrorAndClose, websocket, err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = isBlob(data) ? data.size : toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) {
			const err = /* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
			process.nextTick(cb, err);
		}
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {Buffer} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		const websocket = this[kWebSocket];
		if (!websocket.isPaused) websocket._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {Buffer|ArrayBuffer|Buffer[])} data The message
	* @param {Boolean} isBinary Specifies whether the message is binary or not
	* @private
	*/
	function receiverOnMessage(data, isBinary) {
		this[kWebSocket].emit("message", data, isBinary);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The `Sender` error event handler.
	*
	* @param {Error} The error
	* @private
	*/
	function senderOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket.readyState === WebSocket.CLOSED) return;
		if (websocket.readyState === WebSocket.OPEN) {
			websocket._readyState = WebSocket.CLOSING;
			setCloseTimer(websocket);
		}
		this._socket.end();
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* Set a timer to destroy the underlying raw socket of a WebSocket.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @private
	*/
	function setCloseTimer(websocket) {
		websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
	}
	/**
	* The listener of the socket `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			const chunk = this.read(this._readableState.length);
			websocket._receiver.write(chunk);
		}
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the socket `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the socket `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the socket `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	require_websocket();
	const { Duplex } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let terminateOnDestroy = true;
		const duplex = new Duplex({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg, isBinary) {
			const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
			if (!duplex.push(data)) ws.pause();
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if (ws.isPaused) ws.resume();
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/subprotocol.js
var require_subprotocol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { tokenChars } = require_validation();
	/**
	* Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	*
	* @param {String} header The field value of the header
	* @return {Set} The subprotocol names
	* @public
	*/
	function parse(header) {
		const protocols = /* @__PURE__ */ new Set();
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const protocol = header.slice(start, end);
				if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
				protocols.add(protocol);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || end !== -1) throw new SyntaxError("Unexpected end of input");
		const protocol = header.slice(start, i);
		if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
		protocols.add(protocol);
		return protocols;
	}
	module.exports = { parse };
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const EventEmitter = __require("events");
	const http = __require("http");
	const { Duplex } = __require("stream");
	const { createHash } = __require("crypto");
	const extension = require_extension();
	const PerMessageDeflate = require_permessage_deflate();
	const subprotocol = require_subprotocol();
	const WebSocket = require_websocket();
	const { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Boolean} [options.autoPong=true] Specifies whether or not to
		*     automatically send a pong in response to a ping
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
		*     wait for the closing handshake to finish after `websocket.close()` is
		*     called
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxBufferedChunks=262144] The maximum number of
		*     buffered data chunks
		* @param {Number} [options.maxFragments=16384] The maximum number of message
		*     fragments
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
		*     class to use. It must be the `WebSocket` class or class that extends it
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				allowSynchronousEvents: true,
				autoPong: true,
				maxBufferedChunks: 262144,
				maxFragments: 16384,
				maxPayload: 104857600,
				skipUTF8Validation: false,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				closeTimeout: CLOSE_TIMEOUT,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http.createServer((req, res) => {
					const body = http.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) {
				this.clients = /* @__PURE__ */ new Set();
				this._shouldEmitClose = false;
			}
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Stop the server from accepting new connections and emit the `'close'` event
		* when all existing connections are closed.
		*
		* @param {Function} [cb] A one-time listener for the `'close'` event
		* @public
		*/
		close(cb) {
			if (this._state === CLOSED) {
				if (cb) this.once("close", () => {
					cb(/* @__PURE__ */ new Error("The server is not running"));
				});
				process.nextTick(emitClose, this);
				return;
			}
			if (cb) this.once("close", cb);
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.options.noServer || this.options.server) {
				if (this._server) {
					this._removeListeners();
					this._removeListeners = this._server = null;
				}
				if (this.clients) {
					if (!this.clients.size) process.nextTick(emitClose, this);
					else this._shouldEmitClose = true;
				} else process.nextTick(emitClose, this);
			} else {
				const server = this._server;
				this._removeListeners();
				this._removeListeners = this._server = null;
				server.close(() => {
					emitClose(this);
				});
			}
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"];
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			if (req.method !== "GET") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 405, "Invalid HTTP method");
				return;
			}
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Upgrade header");
				return;
			}
			if (key === void 0 || !keyRegex.test(key)) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Key header");
				return;
			}
			if (version !== 13 && version !== 8) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Version header", { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(req)) {
				abortHandshake(socket, 400);
				return;
			}
			const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
			let protocols = /* @__PURE__ */ new Set();
			if (secWebSocketProtocol !== void 0) try {
				protocols = subprotocol.parse(secWebSocketProtocol);
			} catch (err) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Sec-WebSocket-Protocol header");
				return;
			}
			const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
			const extensions = {};
			if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
				const perMessageDeflate = new PerMessageDeflate({
					...this.options.perMessageDeflate,
					isServer: true,
					maxPayload: this.options.maxPayload
				});
				try {
					const offers = extension.parse(secWebSocketExtensions);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
					return;
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {Object} extensions The accepted extensions
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Set} protocols The subprotocols
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new this.options.WebSocket(null, void 0, this.options);
			if (protocols.size) {
				const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxBufferedChunks: this.options.maxBufferedChunks,
				maxFragments: this.options.maxFragments,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			});
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => {
					this.clients.delete(ws);
					if (this._shouldEmitClose && !this.clients.size) process.nextTick(emitClose, this);
				});
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		message = message || http.STATUS_CODES[code];
		headers = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(message),
			...headers
		};
		socket.once("finish", socket.destroy);
		socket.end(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
	}
	/**
	* Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	* one listener for it, otherwise call `abortHandshake()`.
	*
	* @param {WebSocketServer} server The WebSocket server
	* @param {http.IncomingMessage} req The request object
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} message The HTTP response body
	* @param {Object} [headers] The HTTP response headers
	* @private
	*/
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
		if (server.listenerCount("wsClientError")) {
			const err = new Error(message);
			Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
			server.emit("wsClientError", err, socket, req);
		} else abortHandshake(socket, code, message, headers);
	}
}));
// node_modules/.pnpm/ws@8.22.0/node_modules/ws/index.js
var require_ws$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const createWebSocketStream = require_stream();
	const extension = require_extension();
	const PerMessageDeflate = require_permessage_deflate();
	const Receiver = require_receiver();
	const Sender = require_sender();
	const subprotocol = require_subprotocol();
	const WebSocket = require_websocket();
	const WebSocketServer = require_websocket_server();
	WebSocket.createWebSocketStream = createWebSocketStream;
	WebSocket.extension = extension;
	WebSocket.PerMessageDeflate = PerMessageDeflate;
	WebSocket.Receiver = Receiver;
	WebSocket.Sender = Sender;
	WebSocket.Server = WebSocketServer;
	WebSocket.subprotocol = subprotocol;
	WebSocket.WebSocket = WebSocket;
	WebSocket.WebSocketServer = WebSocketServer;
	module.exports = WebSocket;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/bytes.js
var require_bytes = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatBytes = concatBytes;
	exports.encodeUTF8 = encodeUTF8;
	exports.decodeUTF8 = decodeUTF8;
	/** Copies byte arrays into one contiguous `Uint8Array` while preserving their order. */
	function concatBytes(buffers) {
		let length = 0;
		for (const buffer of buffers) length += buffer.length;
		const output = new Uint8Array(length);
		let index = 0;
		for (const buffer of buffers) {
			output.set(buffer, index);
			index += buffer.length;
		}
		return output;
	}
	let encodeUTF8_;
	/** Encodes text as UTF-8 bytes, reusing the platform encoder after its first call. */
	function encodeUTF8(str) {
		let encoder;
		return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
	}
	let decodeUTF8_;
	/** Decodes UTF-8 bytes as text, reusing the platform decoder after its first call. */
	function decodeUTF8(bytes) {
		let decoder;
		return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.castToError = void 0;
	exports.isAbortError = isAbortError;
	function isAbortError(err) {
		return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
	}
	const castToError = (err) => {
		if (err instanceof Error) return err;
		if (typeof err === "object" && err !== null) {
			try {
				if (Object.prototype.toString.call(err) === "[object Error]") {
					const hasCause = "cause" in err;
					const error = new Error(err.message, hasCause ? { cause: err.cause } : {});
					if (err.stack) error.stack = err.stack;
					if (hasCause && !Object.prototype.hasOwnProperty.call(error, "cause")) error.cause = err.cause;
					if (err.name) error.name = err.name;
					return error;
				}
			} catch {}
			try {
				return new Error(JSON.stringify(err));
			} catch {}
		}
		return new Error(err);
	};
	exports.castToError = castToError;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/core/error.js
var require_error$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SubjectTokenProviderError = exports.OAuthError = exports.InvalidWebhookSignatureError = exports.ContentFilterFinishReasonError = exports.LengthFinishReasonError = exports.InternalServerError = exports.RateLimitError = exports.UnprocessableEntityError = exports.ConflictError = exports.NotFoundError = exports.PermissionDeniedError = exports.AuthenticationError = exports.BadRequestError = exports.APIConnectionTimeoutError = exports.APIConnectionError = exports.APIUserAbortError = exports.APIError = exports.OpenAIError = void 0;
	const errors_1 = require_errors();
	var OpenAIError = class extends Error {};
	exports.OpenAIError = OpenAIError;
	var APIError = class APIError extends OpenAIError {
		constructor(status, error, message, headers) {
			super(`${APIError.makeMessage(status, error, message)}`);
			this.status = status;
			this.headers = headers;
			this.requestID = headers?.get("x-request-id");
			this.error = error;
			const data = error;
			this.code = data?.["code"];
			this.param = data?.["param"];
			this.type = data?.["type"];
		}
		static makeMessage(status, error, message) {
			const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
			if (status && msg) return `${status} ${msg}`;
			if (status) return `${status} status code (no body)`;
			if (msg) return msg;
			return "(no status code or body)";
		}
		static generate(status, errorResponse, message, headers) {
			if (!status || !headers) return new APIConnectionError({
				message,
				cause: (0, errors_1.castToError)(errorResponse)
			});
			const error = errorResponse?.["error"];
			if (status === 400) return new BadRequestError(status, error, message, headers);
			if (status === 401) return new AuthenticationError(status, error, message, headers);
			if (status === 403) return new PermissionDeniedError(status, error, message, headers);
			if (status === 404) return new NotFoundError(status, error, message, headers);
			if (status === 409) return new ConflictError(status, error, message, headers);
			if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
			if (status === 429) return new RateLimitError(status, error, message, headers);
			if (status >= 500) return new InternalServerError(status, error, message, headers);
			return new APIError(status, error, message, headers);
		}
	};
	exports.APIError = APIError;
	var APIUserAbortError = class extends APIError {
		constructor({ message } = {}) {
			super(void 0, void 0, message || "Request was aborted.", void 0);
		}
	};
	exports.APIUserAbortError = APIUserAbortError;
	var APIConnectionError = class extends APIError {
		constructor({ message, cause }) {
			super(void 0, void 0, message || "Connection error.", void 0);
			if (cause) this.cause = cause;
		}
	};
	exports.APIConnectionError = APIConnectionError;
	var APIConnectionTimeoutError = class extends APIConnectionError {
		constructor({ message } = {}) {
			super({ message: message ?? "Request timed out." });
		}
	};
	exports.APIConnectionTimeoutError = APIConnectionTimeoutError;
	var BadRequestError = class extends APIError {};
	exports.BadRequestError = BadRequestError;
	var AuthenticationError = class extends APIError {};
	exports.AuthenticationError = AuthenticationError;
	var PermissionDeniedError = class extends APIError {};
	exports.PermissionDeniedError = PermissionDeniedError;
	var NotFoundError = class extends APIError {};
	exports.NotFoundError = NotFoundError;
	var ConflictError = class extends APIError {};
	exports.ConflictError = ConflictError;
	var UnprocessableEntityError = class extends APIError {};
	exports.UnprocessableEntityError = UnprocessableEntityError;
	var RateLimitError = class extends APIError {};
	exports.RateLimitError = RateLimitError;
	var InternalServerError = class extends APIError {};
	exports.InternalServerError = InternalServerError;
	var LengthFinishReasonError = class extends OpenAIError {
		constructor() {
			super(`Could not parse response content as the length limit was reached`);
		}
	};
	exports.LengthFinishReasonError = LengthFinishReasonError;
	var ContentFilterFinishReasonError = class extends OpenAIError {
		constructor() {
			super(`Could not parse response content as the request was rejected by the content filter`);
		}
	};
	exports.ContentFilterFinishReasonError = ContentFilterFinishReasonError;
	var InvalidWebhookSignatureError = class extends Error {
		constructor(message) {
			super(message);
		}
	};
	exports.InvalidWebhookSignatureError = InvalidWebhookSignatureError;
	/**
	* Error thrown by the API server during OAuth token exchange.
	* Can have status codes 400, 401, or 403.
	* Other status codes from OAuth endpoints are raised as normal APIError types.
	*/
	var OAuthError = class extends APIError {
		constructor(status, error, headers) {
			let finalMessage = "OAuth2 authentication error";
			let error_code = void 0;
			if (error && typeof error === "object") {
				const errorData = error;
				error_code = errorData["error"];
				const description = errorData["error_description"];
				if (description && typeof description === "string") finalMessage = description;
				else if (error_code) finalMessage = error_code;
			}
			super(status, error, finalMessage, headers);
			this.error_code = error_code;
		}
	};
	exports.OAuthError = OAuthError;
	var SubjectTokenProviderError = class extends OpenAIError {
		constructor(message, provider, cause) {
			super(message);
			this.provider = provider;
			this.cause = cause;
		}
	};
	exports.SubjectTokenProviderError = SubjectTokenProviderError;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws.js
var require_ws$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SendQueue = exports.webSocketHeaderRemovals = exports.WEBSOCKET_METADATA_HEADERS = void 0;
	exports.recordWebSocketError = recordWebSocketError;
	exports.getWebSocketError = getWebSocketError;
	exports.getMaxBufferedEvents = getMaxBufferedEvents;
	exports.snapshotWebSocketCredentials = snapshotWebSocketCredentials;
	exports.mergeWebSocketAuthHeaders = mergeWebSocketAuthHeaders;
	exports.buildWebSocketOptions = buildWebSocketOptions;
	exports.protectWebSocketOptionsFromCredentialRedirects = protectWebSocketOptionsFromCredentialRedirects;
	exports.flattenRawData = flattenRawData;
	exports.rawByteLength = rawByteLength;
	exports.isRecoverableClose = isRecoverableClose;
	const bytes_1 = require_bytes();
	const error_1 = require_error$1();
	const webSocketErrors = /* @__PURE__ */ new WeakMap();
	/** Records physical failure before transport callbacks notify public observers. @internal */
	function recordWebSocketError(socket, error) {
		webSocketErrors.set(socket, error);
	}
	/** Returns physical failure for this socket instance, never for a replacement. @internal */
	function getWebSocketError(socket) {
		return webSocketErrors.get(socket);
	}
	/** Snapshots and validates the iterator's limit before listeners are attached. */
	function getMaxBufferedEvents(options) {
		const limit = options?.maxBufferedEvents;
		if (limit !== void 0 && (!Number.isSafeInteger(limit) || limit <= 0)) throw new error_1.OpenAIError("maxBufferedEvents must be a positive safe integer");
		return limit;
	}
	const REDIRECT_SAFE_WEBSOCKET_HEADERS = /* @__PURE__ */ new Set([
		"connection",
		"host",
		"openai-beta",
		"origin",
		"sec-websocket-extensions",
		"sec-websocket-key",
		"sec-websocket-version",
		"upgrade",
		"user-agent",
		"x-access-level",
		"x-auth-metadata",
		"x-auth-tokenization",
		"x-authentication-metadata",
		"x-authentication-tokenization",
		"x-security-policy",
		"x-token-budget",
		"x-trace-id"
	]);
	const WEBSOCKET_METADATA_HEADER_NAMES = /* @__PURE__ */ new Set([
		"accept",
		"accept-encoding",
		"accept-language",
		"content-type",
		"x-request-id",
		"x-client-request-id",
		"x-correlation-id",
		"traceparent",
		"tracestate",
		"sentry-trace",
		"x-amzn-trace-id",
		"x-cloud-trace-context",
		"x-datadog-trace-id",
		"x-datadog-parent-id",
		"x-datadog-sampling-priority",
		"x-datadog-origin",
		"x-datadog-tags",
		"baggage",
		"b3"
	]);
	exports.WEBSOCKET_METADATA_HEADERS = { has: (name, values) => WEBSOCKET_METADATA_HEADER_NAMES.has(name) || name.startsWith("x-b3-") || name === "sec-websocket-protocol" && !values.some((value) => typeof value === "string" && value.split(",").some((protocol) => protocol.trim().startsWith("openai-insecure-api-key."))) };
	function isWebSocketCredentialHeader(name) {
		return !REDIRECT_SAFE_WEBSOCKET_HEADERS.has(name.toLowerCase().split("_").join("-"));
	}
	/**
	* Snapshots credential values in final socket options before validation and dispatch.
	* Reports potential caller authentication, excluding additional metadata when requested.
	* The server remains responsible for validating credentials. Noncredential headers are left intact.
	*/
	function snapshotWebSocketCredentials(options, metadataHeaders) {
		if (options.auth !== null && options.auth !== void 0) options.auth = String(options.auth);
		const credentials = /* @__PURE__ */ new Map();
		const headers = options.headers ?? {};
		for (const [name, value] of Object.entries(headers)) {
			const normalizedName = name.toLowerCase().split("_").join("-");
			if (!isWebSocketCredentialHeader(name) || normalizedName === "openai-organization" || normalizedName === "openai-project") continue;
			let snapshot = value;
			if (Array.isArray(value)) snapshot = value.map(String);
			else if (value !== null && value !== void 0) snapshot = String(value);
			headers[name] = snapshot;
			const values = Array.isArray(snapshot) ? snapshot : [snapshot];
			if (!metadataHeaders?.has(normalizedName, values)) credentials.set(name.toLowerCase(), values.some((item) => typeof item === "string" && item.trim().length > 0));
		}
		return [...credentials.values()].some(Boolean) || !credentials.has("authorization") && typeof options.auth === "string" && options.auth.trim().length > 0;
	}
	/** Merge transport authentication before explicit caller overrides and header removals. */
	function mergeWebSocketAuthHeaders(options, authHeaders, removedHeaders) {
		const headers = new Map(Object.entries(authHeaders).map(([name, value]) => [name.toLowerCase(), value]));
		for (const name of removedHeaders) headers.delete(name);
		for (const [name, value] of Object.entries(options.headers ?? {})) headers.set(name, value);
		return {
			...options,
			headers: Object.fromEntries(headers)
		};
	}
	/** Removal sink for one synchronous header-hook call, including legacy one-argument overrides. */
	exports.webSocketHeaderRemovals = /* @__PURE__ */ new WeakMap();
	const preparedWebSocketHeaders = /* @__PURE__ */ new WeakMap();
	/** Build a WebSocket handshake with explicit caller headers applied after the client defaults. */
	function buildWebSocketOptions(client, authHeaders, options, removedHeaders, usePreparedHeaders = false) {
		const previous = exports.webSocketHeaderRemovals.get(client);
		const prepared = usePreparedHeaders && options ? preparedWebSocketHeaders.get(options) : void 0;
		const context = {
			removedHeaders,
			baseHeaders: prepared?.baseHeaders
		};
		exports.webSocketHeaderRemovals.set(client, context);
		let headers;
		try {
			headers = new Map(Object.entries(client._buildWebSocketHeaders(authHeaders, removedHeaders)).map(([name, value]) => [name.toLowerCase(), value]));
		} finally {
			if (previous) exports.webSocketHeaderRemovals.set(client, previous);
			else exports.webSocketHeaderRemovals.delete(client);
		}
		const transportHeaders = /* @__PURE__ */ new Map();
		const currentHeaders = new Map(Object.entries(options?.headers ?? {}));
		const overrides = prepared ? [...prepared.transportHeaders].map(([name, removed]) => [name, removed ? null : currentHeaders.get(name)]) : currentHeaders;
		for (const [name, value] of overrides) {
			const normalizedName = name.toLowerCase();
			if (value === null) {
				headers.delete(normalizedName);
				removedHeaders?.add(normalizedName);
				transportHeaders.set(normalizedName, true);
			} else if (value !== void 0) {
				headers.set(normalizedName, value);
				removedHeaders?.delete(normalizedName);
				transportHeaders.set(normalizedName, false);
			}
		}
		const result = {
			...options,
			headers: Object.fromEntries(headers),
			followRedirects: false
		};
		preparedWebSocketHeaders.set(result, {
			baseHeaders: context.baseHeaders,
			transportHeaders
		});
		return result;
	}
	/** Prevents WebSocket redirects from forwarding caller or SDK credentials to another origin. */
	function protectWebSocketOptionsFromCredentialRedirects(options) {
		const hasSensitiveHeader = Object.keys(options.headers ?? {}).some(isWebSocketCredentialHeader);
		if (!options.auth && !hasSensitiveHeader) return options;
		return {
			...options,
			followRedirects: false
		};
	}
	function toUint8Array(view) {
		if (view instanceof Uint8Array) return view;
		return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
	}
	/**
	* Flatten `ArrayBufferView[]` fragments into a single `Uint8Array` so that
	* `ws.send()` transmits the correct bytes.
	*/
	function flattenRawData(data) {
		if (Array.isArray(data)) return (0, bytes_1.concatBytes)(data.map(toUint8Array));
		return data;
	}
	function snapshotRawData(data) {
		if (typeof data === "string") return data;
		if (Array.isArray(data)) return (0, bytes_1.concatBytes)(data.map(toUint8Array));
		if (ArrayBuffer.isView(data)) {
			const copy = new Uint8Array(data.byteLength);
			copy.set(toUint8Array(data));
			return copy;
		}
		return data.slice(0);
	}
	/** Counts wire bytes without allocating another payload-sized buffer. */
	function rawByteLength(data) {
		if (typeof data === "string") {
			let bytes = 0;
			for (let index = 0; index < data.length; index += 1) {
				const code = data.codePointAt(index);
				if (code < 128) bytes += 1;
				else if (code < 2048) bytes += 2;
				else if (code <= 65535) bytes += 3;
				else {
					bytes += 4;
					index += 1;
				}
			}
			return bytes;
		}
		if (Array.isArray(data)) return data.reduce((sum, buf) => sum + buf.byteLength, 0);
		if ("byteLength" in data) return data.byteLength;
		return 0;
	}
	/**
	* Buffers outgoing WebSocket messages while a connection is unavailable.
	*
	* JSON values are serialized immediately, and raw binary payloads are copied,
	* so later caller mutations cannot change queued messages. A single oversized
	* message is accepted when the queue is empty; further messages are rejected
	* whenever they would exceed the configured byte budget.
	*/
	var SendQueue = class {
		/** Creates a queue with a one-mebibyte default byte budget. */
		constructor(maxBytes = 1048576, allowOversizedFirstMessage = true) {
			this._queue = [];
			this._cursor = 0;
			this._flushing = false;
			this._bytes = 0;
			this.allowOversizedFirstMessage = allowOversizedFirstMessage;
			this._maxBytes = maxBytes;
		}
		/** New open-socket writes must queue behind an active flush. */
		get isFlushing() {
			return this._flushing;
		}
		get hasPending() {
			return this._queue.length > this._cursor;
		}
		/**
		* Serializes and snapshots a JSON message before queueing it.
		*
		* @returns `true` when accepted, including an oversized first message; `false`
		* when adding it to a nonempty queue would exceed the byte budget.
		*/
		enqueue(event) {
			const pending = this._queue;
			const data = JSON.stringify(event);
			if (data === void 0) throw new TypeError("WebSocket event could not be serialized as JSON");
			if (this._queue !== pending) throw new Error("WebSocket send queue was drained during serialization");
			const byteLength = (0, bytes_1.encodeUTF8)(data).byteLength;
			if (this._bytes + byteLength > this._maxBytes && (!this.allowOversizedFirstMessage || this._queue.length > this._cursor)) return false;
			this._queue.push({
				kind: "json",
				data,
				byteLength
			});
			this._bytes += byteLength;
			return true;
		}
		/**
		* Queues a raw string or a defensive copy of a binary WebSocket payload.
		* Fragmented typed-array payloads are flattened before storage.
		*
		* @returns `true` when accepted, including an oversized first frame; `false`
		* when adding it to a nonempty queue would exceed the byte budget.
		*/
		enqueueRaw(data) {
			const pending = this._queue;
			const snapshot = snapshotRawData(data);
			if (this._queue !== pending) throw new Error("WebSocket send queue was drained during raw snapshot");
			const byteLength = rawByteLength(snapshot);
			if (this._bytes + byteLength > this._maxBytes && (!this.allowOversizedFirstMessage || this._queue.length > this._cursor)) return false;
			this._queue.push({
				kind: "raw",
				data: snapshot,
				byteLength
			});
			this._bytes += byteLength;
			return true;
		}
		/**
		* Send every queued message via `send`. If `send` throws, the failing
		* message and all subsequent messages are re-queued and the error is
		* re-thrown so the caller can report it. Endpoints that cannot safely replay
		* an attempted write use `requeueFailed: false`. Never-attempted messages
		* remain queued, including messages enqueued during the failed send.
		*/
		flush(send, options) {
			if (this._flushing) return;
			this._flushing = true;
			const pending = this._queue;
			try {
				while (this._queue === pending && this._cursor < pending.length && (options?.canSend?.() ?? true)) {
					const entry = pending[this._cursor];
					pending[this._cursor++] = void 0;
					this._bytes -= entry.byteLength;
					try {
						send(entry.data);
					} catch (err) {
						if (this._queue === pending && options?.requeueFailed !== false) {
							pending[--this._cursor] = entry;
							this._bytes += entry.byteLength;
						}
						throw err;
					}
				}
			} finally {
				if (this._queue === pending) pending.splice(0, this._cursor);
				this._cursor = 0;
				this._flushing = false;
			}
		}
		/**
		* Drain the queue and return the unsent messages. JSON messages are
		* deserialized back to their original form. Resets byte tracking to zero.
		*/
		drain() {
			const unsent = this._queue.slice(this._cursor).map((item) => {
				const entry = item;
				if (entry.kind === "raw") return {
					type: "raw",
					data: entry.data
				};
				return {
					type: "message",
					message: JSON.parse(entry.data)
				};
			});
			this._queue = [];
			this._cursor = 0;
			this._flushing = false;
			this._bytes = 0;
			return unsent;
		}
	};
	exports.SendQueue = SendQueue;
	/**
	* Reports whether an RFC 6455 close code represents a recoverable interruption.
	*
	* Network failures, service restarts, temporary server errors, and TLS
	* handshake failures can be retried; normal closure, protocol violations,
	* invalid payloads, and unrecognized codes cannot.
	*/
	function isRecoverableClose(code) {
		switch (code) {
			case 1e3: return false;
			case 1001: return true;
			case 1002: return false;
			case 1003: return false;
			case 1005: return true;
			case 1006: return true;
			case 1007: return false;
			case 1008: return false;
			case 1009: return false;
			case 1010: return false;
			case 1011: return true;
			case 1012: return true;
			case 1013: return true;
			case 1015: return true;
			default: return false;
		}
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	/** @deprecated Import from ./core/error instead */
	require_tslib().__exportStar(require_error$1(), exports);
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/values.js
var require_values = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.safeJSON = exports.maybeCoerceBoolean = exports.maybeCoerceFloat = exports.maybeCoerceInteger = exports.coerceBoolean = exports.coerceFloat = exports.coerceInteger = exports.validatePositiveInteger = exports.ensurePresent = exports.isReadonlyArray = exports.isArray = exports.isAbsoluteURL = void 0;
	exports.maybeObj = maybeObj;
	exports.isEmptyObj = isEmptyObj;
	exports.hasOwn = hasOwn;
	exports.isObj = isObj;
	const error_1 = require_error$1();
	const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
	const isAbsoluteURL = (url) => {
		return startsWithSchemeRegexp.test(url);
	};
	exports.isAbsoluteURL = isAbsoluteURL;
	let isArray = (val) => (exports.isArray = Array.isArray, (0, exports.isArray)(val));
	exports.isArray = isArray;
	exports.isReadonlyArray = exports.isArray;
	/** Returns an object if the given value isn't an object, otherwise returns as-is */
	function maybeObj(x) {
		if (typeof x !== "object") return {};
		return x ?? {};
	}
	function isEmptyObj(obj) {
		if (!obj) return true;
		for (const _k in obj) return false;
		return true;
	}
	function hasOwn(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	}
	function isObj(obj) {
		return obj != null && typeof obj === "object" && !Array.isArray(obj);
	}
	const ensurePresent = (value) => {
		if (value == null) throw new error_1.OpenAIError(`Expected a value to be given but received ${value} instead.`);
		return value;
	};
	exports.ensurePresent = ensurePresent;
	const validatePositiveInteger = (name, n) => {
		if (typeof n !== "number" || !Number.isInteger(n)) throw new error_1.OpenAIError(`${name} must be an integer`);
		if (n < 0) throw new error_1.OpenAIError(`${name} must be a positive integer`);
		return n;
	};
	exports.validatePositiveInteger = validatePositiveInteger;
	const coerceInteger = (value) => {
		if (typeof value === "number") return Math.round(value);
		if (typeof value === "string") return parseInt(value, 10);
		throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
	};
	exports.coerceInteger = coerceInteger;
	const coerceFloat = (value) => {
		if (typeof value === "number") return value;
		if (typeof value === "string") return parseFloat(value);
		throw new error_1.OpenAIError(`Could not coerce ${value} (type: ${typeof value}) into a number`);
	};
	exports.coerceFloat = coerceFloat;
	const coerceBoolean = (value) => {
		if (typeof value === "boolean") return value;
		if (typeof value === "string") return value === "true";
		return Boolean(value);
	};
	exports.coerceBoolean = coerceBoolean;
	const maybeCoerceInteger = (value) => {
		if (value == null) return;
		return (0, exports.coerceInteger)(value);
	};
	exports.maybeCoerceInteger = maybeCoerceInteger;
	const maybeCoerceFloat = (value) => {
		if (value == null) return;
		return (0, exports.coerceFloat)(value);
	};
	exports.maybeCoerceFloat = maybeCoerceFloat;
	const maybeCoerceBoolean = (value) => {
		if (value == null) return;
		return (0, exports.coerceBoolean)(value);
	};
	exports.maybeCoerceBoolean = maybeCoerceBoolean;
	const safeJSON = (text) => {
		try {
			return JSON.parse(text);
		} catch (err) {
			return;
		}
	};
	exports.safeJSON = safeJSON;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toFloat32Array = exports.fromBase64 = exports.toBase64 = void 0;
	const error_1 = require_error$1();
	const bytes_1 = require_bytes();
	const toBase64 = (data) => {
		if (!data) return "";
		if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
		if (typeof data === "string") data = (0, bytes_1.encodeUTF8)(data);
		if (typeof btoa !== "undefined") return btoa(String.fromCharCode.apply(null, data));
		throw new error_1.OpenAIError("Cannot generate base64 string; Expected `Buffer` or `btoa` to be defined");
	};
	exports.toBase64 = toBase64;
	const fromBase64 = (str) => {
		if (typeof globalThis.Buffer !== "undefined") {
			const buf = globalThis.Buffer.from(str, "base64");
			return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
		}
		if (typeof atob !== "undefined") {
			const bstr = atob(str);
			const buf = new Uint8Array(bstr.length);
			for (let i = 0; i < bstr.length; i++) buf[i] = bstr.charCodeAt(i);
			return buf;
		}
		throw new error_1.OpenAIError("Cannot decode base64 string; Expected `Buffer` or `atob` to be defined");
	};
	exports.fromBase64 = fromBase64;
	/**
	* Converts a Base64 encoded string to a Float32Array.
	* @param base64Str - The Base64 encoded string.
	* @returns An Array of numbers interpreted as Float32 values.
	*/
	const toFloat32Array = (base64Str) => {
		if (typeof Buffer !== "undefined") {
			const buf = Buffer.from(base64Str, "base64");
			if (buf.length % Float32Array.BYTES_PER_ELEMENT !== 0) throw new RangeError("Invalid base64-encoded float32 array: byte length must be a multiple of 4");
			return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.length / Float32Array.BYTES_PER_ELEMENT));
		} else {
			const binaryStr = atob(base64Str);
			const len = binaryStr.length;
			const bytes = new Uint8Array(len);
			for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
			return Array.from(new Float32Array(bytes.buffer));
		}
	};
	exports.toFloat32Array = toFloat32Array;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readEnv = void 0;
	/**
	* Read an environment variable.
	*
	* Trims beginning and trailing whitespace.
	*
	* Will return undefined if the environment variable doesn't exist or cannot be accessed.
	*/
	const readEnv = (env) => {
		try {
			if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() || void 0;
			if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
		} catch {
			return;
		}
	};
	exports.readEnv = readEnv;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatRequestDetails = exports.parseLogLevel = void 0;
	exports.loggerFor = loggerFor;
	exports.isSensitiveQueryParameter = isSensitiveQueryParameter;
	exports.isSensitiveHeader = isSensitiveHeader;
	exports.redactURL = redactURL;
	const values_1 = require_values();
	const levelNumbers = {
		off: 0,
		error: 200,
		warn: 300,
		info: 400,
		debug: 500
	};
	const parseLogLevel = (maybeLevel, sourceName, client) => {
		if (!maybeLevel) return;
		if ((0, values_1.hasOwn)(levelNumbers, maybeLevel)) return maybeLevel;
		loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
	};
	exports.parseLogLevel = parseLogLevel;
	function noop() {}
	function makeLogFn(fnLevel, logger, logLevel) {
		if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
		else return logger[fnLevel].bind(logger);
	}
	const noopLogger = {
		error: noop,
		warn: noop,
		info: noop,
		debug: noop
	};
	let cachedLoggers = /* @__PURE__ */ new WeakMap();
	function loggerFor(client) {
		const logger = client.logger;
		const logLevel = client.logLevel ?? "off";
		if (!logger) return noopLogger;
		const cachedLogger = cachedLoggers.get(logger);
		if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
		const levelLogger = {
			error: makeLogFn("error", logger, logLevel),
			warn: makeLogFn("warn", logger, logLevel),
			info: makeLogFn("info", logger, logLevel),
			debug: makeLogFn("debug", logger, logLevel)
		};
		cachedLoggers.set(logger, [logLevel, levelLogger]);
		return levelLogger;
	}
	const sensitiveQueryNames = /* @__PURE__ */ new Set([
		"apikey",
		"accesstoken",
		"refreshtoken",
		"sessiontoken",
		"sessionid",
		"idtoken",
		"authtoken",
		"authorization",
		"token",
		"password",
		"clientsecret",
		"signingsecret",
		"sig",
		"signature",
		"xgoogsignature",
		"xgoogcredential",
		"xamzsecuritytoken",
		"xamzsignature",
		"xamzcredential"
	]);
	/** Recognizes credential-bearing query names across ordinary and provider authentication. */
	function isSensitiveQueryParameter(name) {
		const normalized = name.toLowerCase().replace(/[-_]/gu, "");
		return sensitiveQueryNames.has(normalized) || sensitiveQueryNames.has(normalized.replace(/^x/u, ""));
	}
	const sensitiveHeaderNames = /* @__PURE__ */ new Set([
		"authorization",
		"proxy-authorization",
		"api-key",
		"x-api-key",
		"x-amz-security-token",
		"cookie",
		"set-cookie",
		"x-session-token",
		"x-session-id",
		"x-auth-token",
		"x-id-token"
	]);
	/** Recognizes credential-bearing request headers across provider and workload authentication. */
	function isSensitiveHeader(name) {
		return sensitiveHeaderNames.has(name.toLowerCase().replace(/_/gu, "-")) || isSensitiveQueryParameter(name);
	}
	/** Removes credential-valued query parameters before a request URL reaches any logger. */
	function redactURL(value) {
		const url = new URL(value);
		url.username = "";
		url.password = "";
		url.hash = "";
		for (const name of url.searchParams.keys()) if (isSensitiveQueryParameter(name)) url.searchParams.set(name, "***");
		return url.href;
	}
	const formatRequestDetails = (details) => {
		if (details.options) {
			details.options = { ...details.options };
			delete details.options["headers"];
			if (details.options.path) {
				const path = details.options.path;
				const redacted = new URL(redactURL(new URL(path, "https://redacted.invalid").href));
				details.options.path = redacted.origin === "https://redacted.invalid" ? `${path.startsWith("/") ? "/" : ""}${redacted.pathname.slice(1)}${redacted.search}` : redacted.href;
			}
			if (details.options.query) details.options.query = Object.fromEntries(Object.entries(details.options.query).map(([name, value]) => [name, isSensitiveQueryParameter(name) ? "***" : value]));
		}
		if (details.url) details.url = redactURL(details.url);
		if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, isSensitiveHeader(name) ? "***" : value]));
		if ("retryOfRequestLogID" in details) {
			if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
			delete details.retryOfRequestLogID;
		}
		return details;
	};
	exports.formatRequestDetails = formatRequestDetails;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/uuid.js
var require_uuid = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.uuid4 = void 0;
	/**
	* https://stackoverflow.com/a/2117523
	*/
	let uuid4 = function() {
		const { crypto } = globalThis;
		if (crypto?.randomUUID) {
			exports.uuid4 = crypto.randomUUID.bind(crypto);
			return crypto.randomUUID();
		}
		const u8 = /* @__PURE__ */ new Uint8Array(1);
		const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
		return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
	};
	exports.uuid4 = uuid4;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/sleep.js
var require_sleep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sleep = void 0;
	const sleep = (ms, ...signals) => new Promise((resolve, reject) => {
		const activeSignals = [...new Set(signals.filter((signal) => signal != null))];
		let timeout;
		let settled = false;
		const cleanup = () => {
			for (const signal of activeSignals) try {
				signal.removeEventListener("abort", abort);
			} catch {}
		};
		const settle = (callback) => {
			if (settled) return;
			settled = true;
			if (timeout !== void 0) {
				clearTimeout(timeout);
				timeout = void 0;
			}
			cleanup();
			callback();
		};
		const abort = () => {
			settle(() => reject());
		};
		if (activeSignals.some((signal) => signal.aborted)) {
			abort();
			return;
		}
		timeout = setTimeout(() => {
			settle(resolve);
		}, ms);
		for (const signal of activeSignals) {
			if (settled) break;
			try {
				signal.addEventListener("abort", abort, { once: true });
			} catch (error) {
				settle(() => reject(error));
			}
		}
		if (activeSignals.some((signal) => signal.aborted)) abort();
	});
	exports.sleep = sleep;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/qs/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RFC3986 = exports.RFC1738 = exports.formatters = exports.default_formatter = exports.default_format = void 0;
	exports.default_format = "RFC3986";
	exports.default_formatter = String;
	exports.formatters = {
		RFC1738: (v) => String(v).replace(/%20/g, "+"),
		RFC3986: exports.default_formatter
	};
	exports.RFC1738 = "RFC1738";
	exports.RFC3986 = "RFC3986";
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/qs/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encode = exports.has = void 0;
	exports.merge = merge;
	exports.assign_single_source = assign_single_source;
	exports.decode = decode;
	exports.compact = compact;
	exports.is_regexp = is_regexp;
	exports.is_buffer = is_buffer;
	exports.combine = combine;
	exports.maybe_map = maybe_map;
	const formats_1 = require_formats();
	const values_1 = require_values();
	let cachedHas;
	const has = (obj, key) => {
		const resolvedHas = cachedHas ?? Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty);
		cachedHas = resolvedHas;
		return resolvedHas(obj, key);
	};
	exports.has = has;
	function isUnsafePropertyKey(key) {
		return key === "__proto__" || key === "constructor" || key === "prototype";
	}
	const maxAdoptedRecords = 1e4;
	function isIntrinsicFunctionPrototype(value, key, descriptor) {
		return typeof value === "function" && key === "prototype" && !descriptor.enumerable && !descriptor.configurable;
	}
	function isObjectLike(value) {
		return value !== null && (typeof value === "object" || typeof value === "function");
	}
	function rememberAdoption(state, target, key, value) {
		if (!isObjectLike(value)) return;
		if (state.adopted.length >= maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		state.adopted.push({
			target,
			key
		});
	}
	function sanitizeAdoptions(state) {
		if (state.adopted.length === 0) return;
		const records = /* @__PURE__ */ new WeakMap();
		const visited = [];
		const locations = [];
		let inspectedProperties = 0;
		function inspect(value) {
			const known = records.get(value);
			if (known) return known;
			if (visited.length >= maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
			const keys = Reflect.ownKeys(value);
			if (keys.length > maxAdoptedRecords - inspectedProperties) throw new Error("Adopted record traversal exceeds the supported safety limit.");
			inspectedProperties += keys.length;
			const descriptors = Object.create(null);
			for (const key of keys) {
				const descriptor = Object.getOwnPropertyDescriptor(value, key);
				if (descriptor) Reflect.set(descriptors, key, descriptor);
			}
			const prototype = Object.getPrototypeOf(value);
			const array = (0, values_1.isArray)(value);
			const extensible = Object.isExtensible(value);
			const ordinary = typeof value !== "function" && (array ? prototype === Array.prototype : prototype === Object.prototype || prototype === null);
			const record = {
				value,
				descriptors,
				keys,
				prototype,
				parents: /* @__PURE__ */ new Set(),
				ordinary,
				array,
				detached: ordinary && (extensible || !Object.isFrozen(value)),
				unsafe: false,
				extensible
			};
			records.set(value, record);
			visited.push(record);
			return record;
		}
		for (const { target, key } of state.adopted) {
			const descriptor = Object.getOwnPropertyDescriptor(target, key);
			if (descriptor && "value" in descriptor && isObjectLike(descriptor.value)) locations.push({
				target,
				key,
				descriptor,
				record: inspect(descriptor.value)
			});
		}
		const detached = [];
		for (const record of visited) {
			for (const key of record.keys) {
				const descriptor = record.descriptors[key];
				if (!descriptor) continue;
				if (isUnsafePropertyKey(key)) {
					if (record.ordinary) {
						record.detached = true;
						record.unsafe = true;
					} else if (!isIntrinsicFunctionPrototype(record.value, key, descriptor)) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
					continue;
				}
				if (!record.ordinary && !descriptor.enumerable) continue;
				if ("value" in descriptor && isObjectLike(descriptor.value)) inspect(descriptor.value).parents.add(record);
			}
			if (record.detached) detached.push(record);
		}
		for (let index = visited.length - 1; index >= 0; index -= 1) {
			const record = visited[index];
			if (record.ordinary) continue;
			for (const key of [
				"__proto__",
				"constructor",
				"prototype"
			]) {
				const descriptor = Object.getOwnPropertyDescriptor(record.value, key);
				if (descriptor && !isIntrinsicFunctionPrototype(record.value, key, descriptor)) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
			}
		}
		const unsafe = visited.filter((record) => record.unsafe);
		for (const record of unsafe) for (const parent of record.parents) {
			if (!parent.ordinary) throw new TypeError("Cannot safely sanitize an adopted callable or unsupported prototype.");
			if (!parent.unsafe) {
				parent.unsafe = true;
				unsafe.push(parent);
			}
		}
		for (const record of detached) for (const parent of record.parents) {
			if (!parent.ordinary) continue;
			if (!parent.detached) {
				parent.detached = true;
				detached.push(parent);
			}
		}
		const copies = /* @__PURE__ */ new WeakMap();
		for (const record of detached) copies.set(record.value, record.array ? [] : Object.create(record.prototype));
		for (const record of detached) {
			const copy = copies.get(record.value);
			for (const key of record.keys) {
				if (isUnsafePropertyKey(key)) continue;
				const descriptor = record.descriptors[key];
				if (!descriptor) continue;
				if ("value" in descriptor && isObjectLike(descriptor.value) && copies.has(descriptor.value)) descriptor.value = copies.get(descriptor.value);
				Object.defineProperty(copy, key, descriptor);
			}
		}
		for (const { target, key, descriptor, record } of locations) {
			const value = copies.get(record.value) ?? record.value;
			if (value !== descriptor.value) Object.defineProperty(copies.get(target) ?? target, key, {
				...descriptor,
				value
			});
		}
		for (const record of detached) if (!record.extensible) Object.preventExtensions(copies.get(record.value));
	}
	function readPreparedTarget(state, target, key) {
		const prepared = state.preparedTargets.get(target);
		if (prepared?.has(key)) {
			const value = prepared.get(key);
			prepared.delete(key);
			return value;
		}
		return target[key];
	}
	function previewTarget(state, target, key) {
		const descriptor = Object.getOwnPropertyDescriptor(target, key);
		if (descriptor && "value" in descriptor) return descriptor.value;
		const value = Reflect.get(target, key, target);
		let prepared = state.preparedTargets.get(target);
		if (!prepared) {
			prepared = /* @__PURE__ */ new Map();
			state.preparedTargets.set(target, prepared);
		}
		prepared.set(key, value);
		return value;
	}
	function prepareMergeSource(target, source, state, assign = false) {
		if (!source || typeof source !== "object" || !target || typeof target !== "object") return source;
		let preparedTargets = state.preparedSources.get(source);
		if (!preparedTargets) {
			preparedTargets = /* @__PURE__ */ new WeakMap();
			state.preparedSources.set(source, preparedTargets);
		}
		const existing = preparedTargets.get(target);
		if (existing) return existing;
		state.inspectedSources += 1;
		if (state.inspectedSources > maxAdoptedRecords) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		const sourceKeys = Reflect.ownKeys(source);
		if (sourceKeys.length > maxAdoptedRecords - state.inspectedSourceProperties) throw new Error("Adopted record traversal exceeds the supported safety limit.");
		state.inspectedSourceProperties += sourceKeys.length;
		const sourceIsArray = (0, values_1.isArray)(source);
		const prepared = sourceIsArray ? [] : Object.create(null);
		preparedTargets.set(target, prepared);
		if ((0, values_1.isArray)(target) && sourceIsArray && !assign) {
			const sourceLength = source.length;
			prepared.length = sourceLength;
			for (let index = 0; index < sourceLength; index += 1) {
				if (!(index in source)) continue;
				const value = source[index];
				if ((0, exports.has)(target, index)) {
					const targetValue = previewTarget(state, target, index);
					prepared[index] = targetValue && typeof targetValue === "object" && value && typeof value === "object" ? prepareMergeSource(targetValue, value, state) : value;
				} else prepared[index] = value;
			}
			return prepared;
		}
		const enumerableKeys = [];
		for (const key of sourceKeys) if (typeof key === "string" && Object.getOwnPropertyDescriptor(source, key)?.enumerable) enumerableKeys.push(key);
		for (const key of enumerableKeys) {
			if (isUnsafePropertyKey(key)) continue;
			const value = source[key];
			prepared[key] = !assign && (0, exports.has)(target, key) && value && typeof value === "object" ? prepareMergeSource(previewTarget(state, target, key), value, state) : value;
		}
		return prepared;
	}
	function prepareSource(target, source, state, assign = false) {
		const holder = { value: prepareMergeSource(target, source, state, assign) };
		rememberAdoption(state, holder, "value", holder.value);
		sanitizeAdoptions(state);
		return holder.value;
	}
	const hex_table = /* @__PURE__ */ (() => {
		const array = [];
		for (let i = 0; i < 256; ++i) array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
		return array;
	})();
	function compact_queue(queue) {
		while (queue.length > 1) {
			const item = queue.pop();
			if (!item) continue;
			const obj = item.obj[item.prop];
			if ((0, values_1.isArray)(obj)) {
				const compacted = [];
				for (const value of obj) if (value !== void 0) compacted.push(value);
				item.obj[item.prop] = compacted;
			}
		}
	}
	function array_to_object(source, options) {
		const obj = options && options.plainObjects ? Object.create(null) : {};
		for (let i = 0; i < source.length; ++i) if (source[i] !== void 0) obj[i] = source[i];
		return obj;
	}
	function mergeWithState(target, source, options, state) {
		if (!source) return target;
		if (typeof source !== "object") {
			if ((0, values_1.isArray)(target)) target.push(source);
			else if (target && typeof target === "object") {
				const propertyKey = typeof source === "string" || typeof source === "symbol" ? source : Reflect.ownKeys({ [source]: true })[0];
				if (!isUnsafePropertyKey(propertyKey) && (options && (options.plainObjects || options.allowPrototypes) || !(0, exports.has)(Object.prototype, propertyKey))) target[propertyKey] = true;
			} else return [target, source];
			return target;
		}
		if (!target || typeof target !== "object") return [target].concat(source);
		let mergeTarget = target;
		if ((0, values_1.isArray)(target) && !(0, values_1.isArray)(source)) mergeTarget = array_to_object(target, options);
		if ((0, values_1.isArray)(target) && (0, values_1.isArray)(source)) {
			const sourceLength = source.length;
			for (let i = 0; i < sourceLength; i += 1) if (i in source) {
				const item = source[i];
				if ((0, exports.has)(target, i)) {
					const targetItem = readPreparedTarget(state, target, i);
					if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
						const merged = mergeWithState(targetItem, item, options, state);
						target[i] = merged;
					} else {
						const adopted = item;
						target.push(adopted);
					}
				} else target[i] = item;
			}
			return target;
		}
		for (const key of Object.keys(source)) {
			if (isUnsafePropertyKey(key)) continue;
			const value = source[key];
			const adopted = (0, exports.has)(mergeTarget, key) ? mergeWithState(readPreparedTarget(state, mergeTarget, key), value, options, state) : value;
			mergeTarget[key] = adopted;
		}
		return mergeTarget;
	}
	function merge(target, source, options = {}) {
		const state = {
			adopted: [],
			preparedTargets: /* @__PURE__ */ new WeakMap(),
			preparedSources: /* @__PURE__ */ new WeakMap(),
			inspectedSources: 0,
			inspectedSourceProperties: 0
		};
		return mergeWithState(target, prepareSource(target, source, state), options, state);
	}
	function assign_single_source(target, source) {
		const prepared = prepareSource(target, source, {
			adopted: [],
			preparedTargets: /* @__PURE__ */ new WeakMap(),
			preparedSources: /* @__PURE__ */ new WeakMap(),
			inspectedSources: 0,
			inspectedSourceProperties: 0
		}, true);
		for (const key of Object.keys(prepared)) {
			if (isUnsafePropertyKey(key)) continue;
			target[key] = prepared[key];
		}
		return target;
	}
	function decode(str, _, charset) {
		const strWithoutPlus = str.replace(/\+/g, " ");
		if (charset === "iso-8859-1") return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
		try {
			return decodeURIComponent(strWithoutPlus);
		} catch {
			return strWithoutPlus;
		}
	}
	const limit = 1024;
	const encode = (str, _defaultEncoder, charset, _kind, format) => {
		if (str.length === 0) return str;
		let string = str;
		if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
		else if (typeof str !== "string") string = String(str);
		if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, ($0) => "%26%23" + Number.parseInt($0.slice(2), 16) + "%3B");
		let out = "";
		for (let j = 0; j < string.length;) {
			let segmentEnd = Math.min((Math.floor(j / limit) + 1) * limit, string.length);
			if (segmentEnd < string.length && string.codePointAt(segmentEnd - 1) > 65535) segmentEnd += 1;
			const segment = string.length >= limit ? string.slice(j, segmentEnd) : string;
			const arr = [];
			for (let i = 0; i < segment.length; ++i) {
				let c = segment.charCodeAt(i);
				if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats_1.RFC1738 && (c === 40 || c === 41)) {
					arr[arr.length] = segment.charAt(i);
					continue;
				}
				if (c < 128) {
					arr[arr.length] = hex_table[c];
					continue;
				}
				if (c < 2048) {
					arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
					continue;
				}
				if (c < 55296 || c >= 57344) {
					arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
					continue;
				}
				i += 1;
				c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
				arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
			}
			out += arr.join("");
			j = segmentEnd;
		}
		return out;
	};
	exports.encode = encode;
	function compact(value) {
		const queue = [{
			obj: { o: value },
			prop: "o"
		}];
		const refs = [];
		for (const item of queue) {
			const obj = item.obj[item.prop];
			const keys = Object.keys(obj);
			for (const key of keys) {
				const val = obj[key];
				if (typeof val === "object" && val !== null && !refs.includes(val)) {
					queue.push({
						obj,
						prop: key
					});
					refs.push(val);
				}
			}
		}
		compact_queue(queue);
		return value;
	}
	function is_regexp(obj) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	function is_buffer(obj) {
		if (!obj || typeof obj !== "object") return false;
		return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	}
	function combine(a, b) {
		return [].concat(a, b);
	}
	function maybe_map(val, fn) {
		if ((0, values_1.isArray)(val)) {
			const mapped = [];
			for (const item of val) mapped.push(fn(item));
			return mapped;
		}
		return fn(val);
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/qs/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringify = stringify;
	const utils_1 = require_utils$1();
	const formats_1 = require_formats();
	const values_1 = require_values();
	const array_prefix_generators = {
		brackets(prefix) {
			return String(prefix) + "[]";
		},
		comma: "comma",
		indices(prefix, key) {
			return String(prefix) + "[" + key + "]";
		},
		repeat(prefix) {
			return String(prefix);
		}
	};
	const push_to_array = function push_to_array(arr, value_or_array) {
		Array.prototype.push.apply(arr, (0, values_1.isArray)(value_or_array) ? value_or_array : [value_or_array]);
	};
	let toISOString;
	const defaults = {
		addQueryPrefix: false,
		allowDots: false,
		allowEmptyArrays: false,
		arrayFormat: "indices",
		charset: "utf-8",
		charsetSentinel: false,
		delimiter: "&",
		encode: true,
		encodeDotInKeys: false,
		encoder: utils_1.encode,
		encodeValuesOnly: false,
		format: formats_1.default_format,
		formatter: formats_1.default_formatter,
		/** @deprecated */
		indices: false,
		serializeDate(date) {
			return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
		},
		skipNulls: false,
		strictNullHandling: false
	};
	function is_non_nullish_primitive(v) {
		return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
	}
	const sentinel = {};
	function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
		let obj = object;
		let tmp_sc = sideChannel;
		let step = 0;
		let find_flag = false;
		while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
			const pos = tmp_sc.get(object);
			step += 1;
			if (pos !== void 0) {
				if (pos === step) throw new RangeError("Cyclic object value");
				else find_flag = true;
			}
			if (tmp_sc.get(sentinel) === void 0) step = 0;
		}
		if (typeof filter === "function") obj = filter(prefix, obj);
		else if (obj instanceof Date) obj = serializeDate?.(obj);
		else if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) obj = (0, utils_1.maybe_map)(obj, (value) => {
			if (value instanceof Date) return serializeDate?.(value);
			return value;
		});
		if (obj === null) {
			if (strictNullHandling) return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
			obj = "";
		}
		if (is_non_nullish_primitive(obj) || (0, utils_1.is_buffer)(obj)) {
			if (encoder) {
				const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
				return [formatter?.(key_value) + "=" + formatter?.(encoder(obj, defaults.encoder, charset, "value", format))];
			}
			return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
		}
		const values = [];
		if (obj === void 0) return values;
		let obj_keys;
		if (generateArrayPrefix === "comma" && (0, values_1.isArray)(obj)) {
			if (encodeValuesOnly && encoder) obj = (0, utils_1.maybe_map)(obj, encoder);
			obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
		} else if ((0, values_1.isArray)(filter)) obj_keys = filter;
		else {
			const keys = Object.keys(obj);
			if (sort) keys.sort(sort);
			obj_keys = keys;
		}
		const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
		const adjusted_prefix = commaRoundTrip && (0, values_1.isArray)(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
		if (allowEmptyArrays && (0, values_1.isArray)(obj) && obj.length === 0) return adjusted_prefix + "[]";
		for (const key of obj_keys) {
			const value = typeof key === "object" && key.value !== void 0 ? key.value : obj[key];
			if (skipNulls && value === null) continue;
			const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
			let key_prefix;
			if ((0, values_1.isArray)(obj)) key_prefix = typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix;
			else key_prefix = adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
			sideChannel.set(object, step);
			const valueSideChannel = new WeakMap([[sentinel, sideChannel]]);
			push_to_array(values, inner_stringify(value, key_prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && (0, values_1.isArray)(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
		}
		return values;
	}
	function normalize_stringify_options(opts = defaults) {
		if (opts.allowEmptyArrays !== void 0 && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (opts.encodeDotInKeys !== void 0 && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.encoder !== null && opts.encoder !== void 0 && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
		const charset = opts.charset || defaults.charset;
		if (opts.charset !== void 0 && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		let format = formats_1.default_format;
		if (opts.format !== void 0) {
			if (!(0, utils_1.has)(formats_1.formatters, opts.format)) throw new TypeError("Unknown format option provided.");
			format = opts.format;
		}
		const formatter = formats_1.formatters[format];
		let filter = defaults.filter;
		if (typeof opts.filter === "function" || (0, values_1.isArray)(opts.filter)) filter = opts.filter;
		let arrayFormat;
		if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) arrayFormat = opts.arrayFormat;
		else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
		else arrayFormat = defaults.arrayFormat;
		if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
		let allowDots;
		if (opts.allowDots === void 0) allowDots = !!opts.encodeDotInKeys === true ? true : defaults.allowDots;
		else allowDots = !!opts.allowDots;
		return {
			addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
			allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			arrayFormat,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			commaRoundTrip: !!opts.commaRoundTrip,
			delimiter: opts.delimiter === void 0 ? defaults.delimiter : opts.delimiter,
			encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
			encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
			encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
			encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
			filter,
			format,
			formatter,
			serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
			skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
			sort: typeof opts.sort === "function" ? opts.sort : null,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
		};
	}
	function stringify(object, opts = {}) {
		let obj = object;
		const options = normalize_stringify_options(opts);
		let obj_keys;
		let filter;
		if (typeof options.filter === "function") {
			filter = options.filter;
			obj = filter("", obj);
		} else if ((0, values_1.isArray)(options.filter)) {
			filter = options.filter;
			obj_keys = filter;
		}
		const keys = [];
		if (typeof obj !== "object" || obj === null) return "";
		const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
		const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
		if (!obj_keys) obj_keys = Object.keys(obj);
		if (options.sort) obj_keys.sort(options.sort);
		const sideChannel = /* @__PURE__ */ new WeakMap();
		for (const key of obj_keys) {
			if (options.skipNulls && obj[key] === null) continue;
			push_to_array(keys, inner_stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
		}
		const joined = keys.join(options.delimiter);
		let prefix = options.addQueryPrefix === true ? "?" : "";
		if (options.charsetSentinel) prefix += options.charset === "iso-8859-1" ? "utf8=%26%2310003%3B&" : "utf8=%E2%9C%93&";
		return joined.length > 0 ? prefix + joined : "";
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils/query.js
var require_query = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.stringifyQuery = stringifyQuery;
	const qs = require_tslib().__importStar(require_stringify());
	function stringifyQuery(query) {
		return qs.stringify(query, { arrayFormat: "brackets" });
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const tslib_1 = require_tslib();
	tslib_1.__exportStar(require_values(), exports);
	tslib_1.__exportStar(require_base64(), exports);
	tslib_1.__exportStar(require_env(), exports);
	tslib_1.__exportStar(require_log(), exports);
	tslib_1.__exportStar(require_uuid(), exports);
	tslib_1.__exportStar(require_sleep(), exports);
	tslib_1.__exportStar(require_query(), exports);
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/bedrock.js
var require_bedrock = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.brand_privateBedrockClient = void 0;
	exports.errorWithCause = errorWithCause;
	exports.normalizeOptionalString = normalizeOptionalString;
	exports.parseBedrockEndpointHostname = parseBedrockEndpointHostname;
	exports.resolveBedrockEndpoint = resolveBedrockEndpoint;
	exports.assertBedrockRequestOrigin = assertBedrockRequestOrigin;
	exports.assertBedrockWebSocketOrigin = assertBedrockWebSocketOrigin;
	exports.assertProviderOwnsAuthorization = assertProviderOwnsAuthorization;
	exports.assertValidBedrockBearerCredential = assertValidBedrockBearerCredential;
	exports.prepareBedrockAuth = prepareBedrockAuth;
	exports.resolveBedrockBearerAuth = resolveBedrockBearerAuth;
	const Errors = require_tslib().__importStar(require_error());
	const utils_1 = require_utils();
	/** Identifies legacy Bedrock clients without importing the client class into WebSocket modules. */
	exports.brand_privateBedrockClient = Symbol.for("openai.privateBedrockClient");
	/** Wraps a provider failure in an SDK error while preserving its original cause. */
	function errorWithCause(message, cause) {
		const error = new Errors.OpenAIError(message);
		error.cause = cause;
		return error;
	}
	/** Trims a configuration string, treating missing and whitespace-only values as absent. */
	function normalizeOptionalString(value) {
		return (typeof value === "string" ? value.trim() : void 0) || void 0;
	}
	function normalizeBaseURL(baseURL) {
		const url = new URL(baseURL);
		const responsesMatch = url.pathname.match(/\/responses(?:\/.*)?$/);
		if (responsesMatch?.index !== void 0) url.pathname = url.pathname.slice(0, responsesMatch.index) || "/";
		return url.toString().replace(/\/$/, "");
	}
	function resolveRuntimeDnsSuffixes(region) {
		if (region.startsWith("cn-")) return ["amazonaws.com.cn", "api.amazonwebservices.com.cn"];
		if (region.startsWith("eusc-")) return ["amazonaws.eu", "api.amazonwebservices.eu"];
		if (region.startsWith("us-iso-")) return ["c2s.ic.gov", "api.aws.ic.gov"];
		if (region.startsWith("us-isob-")) return ["sc2s.sgov.gov", "api.aws.scloud"];
		if (region.startsWith("eu-isoe-")) return ["cloud.adc-e.uk", "api.cloud-aws.adc-e.uk"];
		if (region.startsWith("us-isof-")) return ["csp.hci.ic.gov", "api.aws.hci.ic.gov"];
		return ["amazonaws.com", "api.aws"];
	}
	/** Identifies a canonical Amazon Bedrock hostname and its embedded AWS region. */
	function parseBedrockEndpointHostname(hostname) {
		const [service, region, ...suffixParts] = (hostname.endsWith(".") ? hostname.slice(0, -1) : hostname).toLowerCase().split(".");
		const suffix = suffixParts.join(".");
		if (service === "bedrock-mantle" && region && /^[a-z0-9-]+$/.test(region) && suffix === "api.aws") return {
			endpoint: "mantle",
			region
		};
		if ((service === "bedrock-runtime" || service === "bedrock-runtime-fips") && region) {
			const [standardSuffix, dualStackSuffix] = resolveRuntimeDnsSuffixes(region);
			if (suffix === standardSuffix || suffix === dualStackSuffix) return {
				endpoint: "runtime",
				region
			};
		}
	}
	/** Rejects insecure or mismatched canonical Amazon Bedrock endpoint overrides. */
	function validateCanonicalBedrockEndpoint(baseURL, endpoint, region) {
		const parsedBaseURL = new URL(baseURL);
		const canonicalEndpoint = parseBedrockEndpointHostname(parsedBaseURL.hostname);
		if (canonicalEndpoint && parsedBaseURL.protocol !== "https:") throw new Errors.OpenAIError("Canonical Amazon Bedrock endpoints require HTTPS.");
		if (canonicalEndpoint && canonicalEndpoint.endpoint !== endpoint) throw new Errors.OpenAIError(`The Bedrock ${canonicalEndpoint.endpoint} hostname does not match the selected \`${endpoint}\` endpoint. Set \`endpoint: '${canonicalEndpoint.endpoint}'\` to use this hostname.`);
		if (canonicalEndpoint && region && canonicalEndpoint.region !== region) throw new Errors.OpenAIError(`The Bedrock endpoint region \`${canonicalEndpoint.region}\` does not match the configured AWS region \`${region}\`.`);
	}
	function validateBedrockEndpointSelection(endpoint) {
		if (endpoint !== void 0 && endpoint !== "mantle" && endpoint !== "runtime") throw new Errors.OpenAIError("The Bedrock `endpoint` must be either `mantle` or `runtime`.");
	}
	/**
	* Resolves the Bedrock endpoint family, region, and API root from configuration.
	*
	* Region precedence is `region`, `AWS_REGION`, then `AWS_DEFAULT_REGION`.
	* Endpoint precedence is `baseURL`, `AWS_BEDROCK_BASE_URL`, then the regional
	* selected endpoint; an explicit `null` base URL skips the environment override.
	* Existing `/responses` suffixes and trailing slashes are removed. Canonical
	* AWS hostnames infer the endpoint family when none is selected explicitly.
	* Other configured URLs and derived endpoints default to Mantle.
	*
	* @throws {Errors.OpenAIError} If an option is invalid, a canonical hostname
	* conflicts with the endpoint family, or the default endpoint needs a region.
	*/
	function resolveBedrockEndpoint(options) {
		validateBedrockEndpointSelection(options.endpoint);
		if (options.region !== void 0 && !normalizeOptionalString(options.region)) throw new Errors.OpenAIError("The Bedrock AWS `region` must not be empty.");
		if (options.baseURL !== void 0 && options.baseURL !== null && !normalizeOptionalString(options.baseURL)) throw new Errors.OpenAIError("The Bedrock `baseURL` must not be empty.");
		const region = normalizeOptionalString(options.region) ?? normalizeOptionalString((0, utils_1.readEnv)("AWS_REGION")) ?? normalizeOptionalString((0, utils_1.readEnv)("AWS_DEFAULT_REGION"));
		if (region && !/^[a-z]{2,8}(?:-[a-z0-9]+)+-\d+$/.test(region)) throw new Errors.OpenAIError("The Bedrock AWS `region` is invalid. Use a standard AWS region such as `us-east-1`.");
		const configuredBaseURL = options.baseURL === void 0 ? normalizeOptionalString((0, utils_1.readEnv)("AWS_BEDROCK_BASE_URL")) : normalizeOptionalString(options.baseURL);
		if (configuredBaseURL) {
			const baseURL = normalizeBaseURL(configuredBaseURL);
			const endpoint = options.endpoint ?? parseBedrockEndpointHostname(new URL(baseURL).hostname)?.endpoint ?? "mantle";
			validateCanonicalBedrockEndpoint(baseURL, endpoint, region);
			return {
				endpoint,
				region,
				baseURL
			};
		}
		const endpoint = options.endpoint ?? "mantle";
		if (!region) throw new Errors.OpenAIError("Bedrock requires an AWS region. Pass `region` to `bedrock(...)`, or set `AWS_REGION` or `AWS_DEFAULT_REGION`.");
		return {
			endpoint,
			region,
			baseURL: `https://${endpoint === "runtime" ? `bedrock-runtime.${region}.${resolveRuntimeDnsSuffixes(region)[0]}` : `bedrock-mantle.${region}.api.aws`}/openai/v1`
		};
	}
	/**
	* Ensures Bedrock credentials are only attached to the configured endpoint origin.
	*
	* @throws {Errors.OpenAIError} If either URL is not HTTP(S) or the request targets a different origin.
	*/
	function assertBedrockRequestOrigin(baseURL, requestURL) {
		const expectedURL = new URL(baseURL);
		const request = new URL(requestURL);
		const expectedOrigin = expectedURL.origin;
		const requestOrigin = request.origin;
		if (expectedURL.protocol !== "http:" && expectedURL.protocol !== "https:" || request.protocol !== "http:" && request.protocol !== "https:" || requestOrigin !== expectedOrigin) throw new Errors.OpenAIError(`Bedrock request origin \`${requestOrigin}\` does not match the configured base URL origin \`${expectedOrigin}\`.`);
	}
	/** Validates a final WebSocket URL before a legacy Bedrock client resolves or attaches credentials. */
	function assertBedrockWebSocketOrigin(client, requestURL) {
		if (typeof client !== "object" || client === null || !(exports.brand_privateBedrockClient in client)) return;
		const normalizedRequestURL = new URL(requestURL);
		if (normalizedRequestURL.protocol === "wss:") normalizedRequestURL.protocol = "https:";
		else if (normalizedRequestURL.protocol === "ws:") normalizedRequestURL.protocol = "http:";
		assertBedrockRequestOrigin(client.baseURL, normalizedRequestURL.toString());
	}
	/**
	* Rejects caller-provided authorization headers that conflict with provider authentication.
	*
	* @throws {Errors.OpenAIError} If an `Authorization` header is already present.
	*/
	function assertProviderOwnsAuthorization(headers) {
		if (headers.has("authorization")) throw new Errors.OpenAIError("Bedrock provider authentication cannot be combined with a custom `Authorization` header.");
	}
	/** Rejects non-HTTP field bytes without retaining or exposing a bearer credential. */
	function assertValidBedrockBearerCredential(credential) {
		if (/^[\t ]|[\t ]$/.test(credential)) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
		for (const character of credential) {
			const value = character.codePointAt(0) ?? 0;
			if (value < 32 && value !== 9 || value === 127 || value > 255) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
		}
	}
	function createBedrockUserAbortError(signal) {
		const error = new Errors.APIUserAbortError();
		Object.defineProperty(error, "cause", {
			value: signal.reason,
			writable: true,
			configurable: true
		});
		return error;
	}
	function removeBedrockAbortListener(signal, listener) {
		try {
			signal.removeEventListener("abort", listener);
		} catch {}
	}
	function resolveAbortableBedrockAuth(operation, signals, failure) {
		return new Promise((resolve, reject) => {
			let settled = false;
			const listeners = [];
			const removeListeners = () => {
				while (listeners.length > 0) {
					const registered = listeners.pop();
					if (registered) removeBedrockAbortListener(registered.signal, registered.listener);
				}
			};
			failure.removeListeners = removeListeners;
			const settle = (result) => {
				if (settled) return;
				settled = true;
				if ("value" in result) resolve(result.value);
				else {
					removeListeners();
					reject(result.error);
				}
			};
			const rejectSignalFailure = (error) => {
				if (failure.error) return;
				failure.error = { value: error };
				settle({ error });
			};
			const registerAbortListener = (signal) => {
				const onAbort = () => {
					if (failure.error) return;
					try {
						rejectSignalFailure(createBedrockUserAbortError(signal));
					} catch (error) {
						rejectSignalFailure(error);
					}
				};
				try {
					if (signal.aborted) {
						onAbort();
						return false;
					}
					listeners.push({
						signal,
						listener: onAbort
					});
					signal.addEventListener("abort", onAbort, { once: true });
					if (settled) {
						removeBedrockAbortListener(signal, onAbort);
						return false;
					}
					if (signal.aborted) {
						onAbort();
						return false;
					}
				} catch (error) {
					if (settled) removeBedrockAbortListener(signal, onAbort);
					else rejectSignalFailure(error);
					return false;
				}
				return true;
			};
			for (const signal of signals) if (!registerAbortListener(signal)) return;
			let pending;
			try {
				pending = operation();
			} catch (error) {
				settle({ error });
				return;
			}
			const observeResult = async () => {
				try {
					settle({ value: await pending });
				} catch (error) {
					settle({ error });
				}
			};
			observeResult();
		});
	}
	/**
	* Resolves Bedrock authentication work with caller cancellation, then applies
	* its result synchronously after the final cancellation checks.
	*
	* @internal
	*/
	async function prepareBedrockAuth(request, context, operation) {
		const signals = [];
		for (const signal of [context.options.signal, request.signal]) if (signal != null && !signals.includes(signal)) signals.push(signal);
		const signalFailure = {};
		let value;
		try {
			try {
				value = signals.length > 0 ? await resolveAbortableBedrockAuth(operation.resolve, signals, signalFailure) : await operation.resolve();
			} catch (cause) {
				if (signalFailure.error && Object.is(cause, signalFailure.error.value)) throw cause;
				throw errorWithCause(operation.failureMessage, cause);
			}
			if (signalFailure.error) throw signalFailure.error.value;
			for (const signal of signals) if (signal.aborted) throw createBedrockUserAbortError(signal);
		} finally {
			signalFailure.removeListeners?.();
		}
		operation.apply(value);
	}
	var BedrockBearerAuth = class {
		constructor(tokenProvider) {
			this.tokenProvider = tokenProvider;
		}
		async prepareRequest(request, context) {
			const headers = new Headers(request.headers);
			assertProviderOwnsAuthorization(headers);
			await prepareBedrockAuth(request, context, {
				resolve: () => this.tokenProvider(),
				failureMessage: "Failed to resolve a bearer credential for Bedrock.",
				apply: (token) => {
					if (typeof token !== "string" || !token.trim()) throw new Errors.OpenAIError("The Bedrock bearer credential provider must return a non-empty string.");
					assertValidBedrockBearerCredential(token);
					try {
						headers.set("authorization", `Bearer ${token}`);
					} catch (error) {
						if (error instanceof TypeError) throw new TypeError("Bedrock bearer credential contains an invalid HTTP header value.");
						throw error;
					}
					request.redirect = "manual";
					request.headers = headers;
				}
			});
		}
	};
	/**
	* Resolves a bearer-authentication factory without calling token providers eagerly.
	*
	* Explicit `tokenProvider` and `apiKey` options are mutually exclusive. When
	* neither is set, `AWS_BEARER_TOKEN_BEDROCK` is used unless environment
	* credentials are disabled or `apiKey` is explicitly `null`.
	*
	* @throws {Errors.OpenAIError} If an explicit key is empty or multiple bearer
	* credential sources are configured.
	*/
	function resolveBedrockBearerAuth(options, { allowEnvironment = true } = {}) {
		if (options.apiKey !== void 0 && options.apiKey !== null && (typeof options.apiKey !== "string" || !options.apiKey.trim())) throw new Errors.OpenAIError("The Bedrock bearer credential must not be empty.");
		if (options.apiKey != null && options.tokenProvider) throw new Errors.OpenAIError("The `apiKey` and `tokenProvider` options are mutually exclusive. Configure only one.");
		if (options.tokenProvider) {
			const tokenProvider = options.tokenProvider;
			return {
				factory: () => new BedrockBearerAuth(tokenProvider),
				explicit: true
			};
		}
		if (options.apiKey != null) {
			const apiKey = options.apiKey;
			return {
				factory: () => new BedrockBearerAuth(async () => apiKey),
				explicit: true
			};
		}
		if (allowEnvironment && options.apiKey !== null && (0, utils_1.readEnv)("AWS_BEARER_TOKEN_BEDROCK")) return {
			explicit: false,
			factory: () => new BedrockBearerAuth(async () => {
				const token = (0, utils_1.readEnv)("AWS_BEARER_TOKEN_BEDROCK");
				if (!token) throw new Errors.OpenAIError("Could not find credentials for Bedrock. Set `AWS_BEARER_TOKEN_BEDROCK` or configure AWS credential authentication.");
				return token;
			})
		};
		return {
			factory: void 0,
			explicit: false
		};
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/realtime-credentials.js
var require_realtime_credentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.realtimeRoutingProtocols = realtimeRoutingProtocols;
	exports.setRealtimeAPIKeyCacheContext = setRealtimeAPIKeyCacheContext;
	exports.getDeferredRealtimeAPIKeyCache = getDeferredRealtimeAPIKeyCache;
	exports.validateCapturedAPIKey = validateCapturedAPIKey;
	exports.getRealtimeAPIKey = getRealtimeAPIKey;
	exports.resolveRealtimeAPIKey = resolveRealtimeAPIKey;
	const bedrock_1 = require_bedrock();
	const ws_1 = require_ws$1();
	/** Native Realtime accepts routing metadata through these two server-supported subprotocols. */
	function realtimeRoutingProtocols(client, apiKey) {
		const protocols = [];
		if ("_buildWebSocketHeaders" in client && typeof client._buildWebSocketHeaders === "function") {
			const { headers } = (0, ws_1.buildWebSocketOptions)(client, { Authorization: `Bearer ${apiKey}` }, null);
			for (const field of ["organization", "project"]) {
				const value = headers[`openai-${field}`];
				if (value !== void 0) protocols.push(`openai-${field}.${value}`);
			}
			return protocols;
		}
		if ("organization" in client && typeof client.organization === "string") protocols.push(`openai-organization.${client.organization}`);
		if ("project" in client && typeof client.project === "string") protocols.push(`openai-project.${client.project}`);
		return protocols;
	}
	const realtimeCacheContext = Symbol.for("openai.realtimeAPIKeyCacheContext");
	let cacheContext;
	/** Installs the Node transport's invocation context without loading Node in the base client. @internal */
	function setRealtimeAPIKeyCacheContext(context) {
		cacheContext = context;
	}
	/** Reserves a deferred commit when the base hook is entered for this invocation. @internal */
	function getDeferredRealtimeAPIKeyCache(client) {
		const deferred = client[realtimeCacheContext]?.getStore();
		return deferred?.client === client ? deferred : void 0;
	}
	/** Applies the Bedrock getter's validation when a captured credential does not enter the cache. @internal */
	function validateCapturedAPIKey(client, credential) {
		if (credential !== null && bedrock_1.brand_privateBedrockClient in client) (0, bedrock_1.assertValidBedrockBearerCredential)(credential);
		return credential;
	}
	/** Selects a captured credential without treating an explicit null as absent. @internal */
	function getRealtimeAPIKey(client, captured) {
		return captured === void 0 ? client?.apiKey : captured;
	}
	/**
	* Captures the key belonging to this request or factory invocation while retaining the
	* existing boolean credential-hook contract. Legacy overrides that do not
	* capture a key keep their shared-property behavior and remain responsible for
	* synchronizing concurrent credential updates.
	* @internal
	*/
	async function resolveRealtimeAPIKey(client, deferCache = false) {
		let apiKey;
		const current = {
			client,
			commit: () => apiKey === void 0 ? client.apiKey : apiKey
		};
		const capture = (resolved) => {
			apiKey = resolved;
		};
		const invoke = () => client._callApiKey(capture);
		const context = client[realtimeCacheContext] ?? cacheContext;
		if (deferCache && context && !client[realtimeCacheContext]) Object.defineProperty(client, realtimeCacheContext, { value: context });
		const isProvider = await (context ? context.run(deferCache ? current : void 0, invoke) : invoke());
		return {
			apiKey: apiKey === void 0 ? client.apiKey : apiKey,
			isProvider,
			commit: () => {
				const hookKey = current.providerKey !== void 0 && apiKey !== void 0 && apiKey !== current.providerKey ? validateCapturedAPIKey(client, apiKey) : void 0;
				const cached = current.commit();
				return hookKey === void 0 ? validateCapturedAPIKey(client, cached) : hookKey;
			}
		};
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VERSION = void 0;
	/** Version of the installed OpenAI SDK package. */
	exports.VERSION = "7.47.0";
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws-adapter-node.js
var require_ws_adapter_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NodeWebSocket = void 0;
	exports.buildRealtimeWebSocketHeaders = buildRealtimeWebSocketHeaders;
	exports.snapshotNodeWebSocketOptions = snapshotNodeWebSocketOptions;
	const node_async_hooks_1 = __require("node:async_hooks");
	const ws_1 = require_ws$1();
	const realtime_credentials_1 = require_realtime_credentials();
	const version_1 = require_version();
	(0, realtime_credentials_1.setRealtimeAPIKeyCacheContext)(new node_async_hooks_1.AsyncLocalStorage());
	/** Use the real client's header hook while retaining Realtime's structural partial-client contract. */
	function buildRealtimeWebSocketHeaders(client, authHeaders, options) {
		if ("_buildWebSocketHeaders" in client && typeof client._buildWebSocketHeaders === "function") return (0, ws_1.buildWebSocketOptions)(client, authHeaders, { headers: options?.headers }).headers;
		const headers = new Map(Object.entries({
			"User-Agent": `${client.constructor.name}/JS ${version_1.VERSION}`,
			...authHeaders
		}).map(([name, value]) => [name.toLowerCase(), value]));
		for (const [name, value] of Object.entries(options?.headers ?? {})) {
			const normalizedName = name.toLowerCase();
			if (value === null) headers.delete(normalizedName);
			else if (value !== void 0) headers.set(normalizedName, value);
		}
		return Object.fromEntries(headers);
	}
	function copyTLSMaterial(value) {
		return ArrayBuffer.isView(value) ? Buffer.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength)) : value;
	}
	/** Snapshot caller headers and TLS identity before an async reconnect credential refresh. */
	function snapshotNodeWebSocketOptions(options) {
		const captured = {
			...options,
			headers: Object.fromEntries(Object.entries(options?.headers ?? {}).map(([name, value]) => [name, Array.isArray(value) ? [...value] : value]))
		};
		const { ca, cert, crl, key, pfx } = captured;
		if (ca !== void 0) captured.ca = Array.isArray(ca) ? ca.map(copyTLSMaterial) : copyTLSMaterial(ca);
		if (cert !== void 0) captured.cert = Array.isArray(cert) ? cert.map(copyTLSMaterial) : copyTLSMaterial(cert);
		if (crl !== void 0) captured.crl = Array.isArray(crl) ? crl.map(copyTLSMaterial) : copyTLSMaterial(crl);
		if (key !== void 0) captured.key = Array.isArray(key) ? key.map((value) => typeof value === "string" || ArrayBuffer.isView(value) ? copyTLSMaterial(value) : {
			...value,
			pem: copyTLSMaterial(value.pem)
		}) : copyTLSMaterial(key);
		if (pfx !== void 0) captured.pfx = Array.isArray(pfx) ? pfx.map((value) => typeof value === "string" || ArrayBuffer.isView(value) ? copyTLSMaterial(value) : {
			...value,
			buf: copyTLSMaterial(value.buf)
		}) : copyTLSMaterial(pfx);
		if ("session" in captured && Buffer.isBuffer(captured.session)) captured.session = Buffer.from(captured.session);
		if ("ALPNProtocols" in captured) {
			if (Array.isArray(captured.ALPNProtocols)) captured.ALPNProtocols = [...captured.ALPNProtocols];
			else if (ArrayBuffer.isView(captured.ALPNProtocols)) {
				const { buffer, byteOffset, byteLength } = captured.ALPNProtocols;
				captured.ALPNProtocols = Buffer.from(new Uint8Array(buffer, byteOffset, byteLength));
			}
		}
		return captured;
	}
	exports.NodeWebSocket = class NodeWebSocket {
		/** Wraps an existing socket created by the optional `ws` package. */
		constructor(ws) {
			/** Maps `(event, originalListener)` to every wrapped registration in listener order. */
			this._listenerMap = /* @__PURE__ */ new Map();
			this._ws = ws;
			this._ws.on("redirect", (_url, request) => {
				try {
					if ((0, ws_1.protectWebSocketOptionsFromCredentialRedirects)({
						followRedirects: true,
						headers: request.getHeaders()
					}).followRedirects) return;
				} catch {}
				this._ws.terminate();
			});
		}
		/** The underlying `ws` socket; accessing it makes calling code Node.js-specific. */
		get platformSocket() {
			return this._ws;
		}
		/** Current numeric socket connection state, using standard WebSocket values. */
		get readyState() {
			return this._ws.readyState;
		}
		/** Sends a text or binary frame through the underlying `ws` connection. */
		send(data) {
			this._ws.send(data);
		}
		/** Initiates the socket's closing handshake with an optional code and reason. */
		close(code, reason) {
			this._ws.close(code, reason);
		}
		/** Forcibly closes the underlying transport. */
		terminate() {
			this._ws.terminate();
		}
		/** Registers a listener with normalized message payloads and close reasons. */
		on(event, listener) {
			const wrapped = NodeWebSocket._wrapListener(event, listener);
			this._registerListener(event, listener, wrapped);
		}
		/** Removes the platform listener associated with the original callback. */
		off(event, listener) {
			const [wrapped] = (this._listenerMap.get(event)?.get(listener))?.slice(-1) ?? [];
			if (!wrapped) return;
			this._removeListener(event, listener, wrapped);
		}
		/** Registers a listener that is removed before it handles its first event. */
		once(event, listener) {
			let fired = false;
			const wrapped = NodeWebSocket._wrapListener(event, (...args) => {
				if (fired) return;
				fired = true;
				this._removeListener(event, listener, wrapped);
				listener(...args);
			});
			this._registerListener(event, listener, wrapped);
		}
		_registerListener(event, listener, wrapped) {
			const byListener = this._listenersFor(event);
			const wrappedListeners = byListener.get(listener);
			if (wrappedListeners) wrappedListeners.push(wrapped);
			else byListener.set(listener, [wrapped]);
			this._ws.on(event, wrapped);
		}
		_removeListener(event, listener, wrapped) {
			const byListener = this._listenerMap.get(event);
			const wrappedListeners = byListener?.get(listener);
			if (!byListener || !wrappedListeners) return;
			const index = wrappedListeners.lastIndexOf(wrapped);
			if (index === -1) return;
			wrappedListeners.splice(index, 1);
			if (wrappedListeners.length === 0) byListener.delete(listener);
			if (byListener.size === 0) this._listenerMap.delete(event);
			this._ws.removeListener(event, wrapped);
		}
		_listenersFor(event) {
			let map = this._listenerMap.get(event);
			if (!map) {
				map = /* @__PURE__ */ new Map();
				this._listenerMap.set(event, map);
			}
			return map;
		}
		/**
		* Normalizes `ws` message payloads: text frames become strings,
		* binary frames stay as `Buffer`, and fragmented frames are merged.
		*/
		static _normalizeMessageData(data, isBinary) {
			if (!isBinary) {
				if (Array.isArray(data)) return Buffer.concat(data).toString();
				if (data instanceof ArrayBuffer) return Buffer.from(data).toString();
				return data.toString();
			}
			if (Array.isArray(data)) return Buffer.concat(data);
			if (data instanceof ArrayBuffer) return Buffer.from(data);
			return data;
		}
		static _wrapListener(event, listener) {
			switch (event) {
				case "message": return (data, isBinary) => {
					listener(NodeWebSocket._normalizeMessageData(data, isBinary), isBinary);
				};
				case "close": return (code, reason) => {
					listener(code, reason.toString());
				};
				default: return listener;
			}
		}
	};
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/core/EventEmitter.js
var require_EventEmitter = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _EventEmitter_instances;
	var _EventEmitter_listeners;
	var _EventEmitter_emittedListenerRegistrations;
	var _EventEmitter_pendingListenerCleanup;
	var _EventEmitter_listenerDispatchDepth;
	var _EventEmitter_onceForEmitted;
	var _EventEmitter_removeEmittedListener;
	var _EventEmitter_cleanupEmittedListeners;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InternalEventEmitter = exports.EventEmitter = void 0;
	const tslib_1 = require_tslib();
	/** Registers strongly typed event listeners and awaits individual emitted events. */
	var EventEmitter = class {
		constructor() {
			_EventEmitter_instances.add(this);
			_EventEmitter_listeners.set(this, Object.create(null));
			_EventEmitter_emittedListenerRegistrations.set(this, /* @__PURE__ */ new WeakMap());
			_EventEmitter_pendingListenerCleanup.set(this, /* @__PURE__ */ new Set());
			_EventEmitter_listenerDispatchDepth.set(this, 0);
		}
		/**
		* Adds the listener function to the end of the listeners array for the event.
		* No checks are made to see if the listener has already been added. Multiple calls passing
		* the same combination of event and listener will result in the listener being added, and
		* called, multiple times.
		* @returns this, so that calls can be chained
		*/
		on(event, listener) {
			var _a;
			((_a = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f"))[event] || (_a[event] = [])).push({ listener });
			return this;
		}
		/**
		* Removes the specified listener from the listener array for the event.
		* off() will remove, at most, one instance of a listener from the listener array. If any single
		* listener has been added multiple times to the listener array for the specified event, then
		* off() must be called multiple times to remove each instance.
		* @returns this, so that calls can be chained
		*/
		off(event, listener) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			if (!listeners) return this;
			const emittedRegistration = tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").get(listener);
			if (emittedRegistration?.event === event && !emittedRegistration.registration.removed && !emittedRegistration.registration.detached) {
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_removeEmittedListener).call(this, event, emittedRegistration.registration);
				return this;
			}
			const index = listeners.findIndex((registration) => !registration.removed && registration.listener === listener);
			if (index !== -1) listeners.splice(index, 1);
			return this;
		}
		/**
		* Adds a one-time listener function for the event. The next time the event is triggered,
		* this listener is removed and then invoked.
		* @returns this, so that calls can be chained
		*/
		once(event, listener) {
			var _a;
			((_a = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f"))[event] || (_a[event] = [])).push({
				listener,
				once: true
			});
			return this;
		}
		/**
		* This is similar to `.once()`, but returns a Promise that resolves the next time
		* the event is triggered, instead of calling a listener callback.
		* Events without arguments resolve to `undefined`, single-argument events resolve
		* to that argument, and events with multiple arguments resolve to an argument tuple.
		*
		* @returns A promise for the next event, or a rejection if an error occurs first.
		* Requesting the `error` event resolves with the emitted error instead.
		*
		* Example:
		*
		*   const message = await stream.emitted('message') // rejects if the stream errors
		*/
		emitted(event) {
			return new Promise((resolve, reject) => {
				const listeners = {
					onError: (error) => {
						this.off(event, listeners.onEvent);
						reject(error);
					},
					onEvent: (...values) => {
						if (event !== "error") this.off("error", listeners.onError);
						resolve(values.length > 1 ? values : values[0]);
					}
				};
				if (event !== "error") tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_onceForEmitted).call(this, "error", listeners.onError);
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_onceForEmitted).call(this, event, listeners.onEvent);
			});
		}
		_emit(event, ...args) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			if (listeners) {
				tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event] = listeners.filter((listener) => {
					if (listener.once) listener.detached = true;
					return !listener.once && !listener.removed;
				});
				let listenerThrew = false;
				let firstListenerError;
				tslib_1.__classPrivateFieldSet(this, _EventEmitter_listenerDispatchDepth, tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") + 1, "f");
				try {
					for (const registration of listeners) if (!registration.removed) try {
						const { listener } = registration;
						listener(...args);
					} catch (error) {
						if (!listenerThrew) {
							listenerThrew = true;
							firstListenerError = error;
						}
					}
				} finally {
					tslib_1.__classPrivateFieldSet(this, _EventEmitter_listenerDispatchDepth, tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") - 1, "f");
					if (tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") === 0) tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_cleanupEmittedListeners).call(this);
				}
				if (listenerThrew) throw firstListenerError;
			}
		}
		_hasListener(event) {
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
			return listeners && listeners.some((listener) => !listener.removed);
		}
	};
	exports.EventEmitter = EventEmitter;
	_EventEmitter_listeners = /* @__PURE__ */ new WeakMap(), _EventEmitter_emittedListenerRegistrations = /* @__PURE__ */ new WeakMap(), _EventEmitter_pendingListenerCleanup = /* @__PURE__ */ new WeakMap(), _EventEmitter_listenerDispatchDepth = /* @__PURE__ */ new WeakMap(), _EventEmitter_instances = /* @__PURE__ */ new WeakSet(), _EventEmitter_onceForEmitted = function _EventEmitter_onceForEmitted(event, listener) {
		const previousListeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
		const previousLength = previousListeners?.length ?? 0;
		this.once(event, listener);
		const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[event];
		const [registration] = listeners?.slice(-1) ?? [];
		if ((previousListeners === void 0 || listeners === previousListeners) && listeners?.length === previousLength + 1 && registration?.listener === listener && registration.once) tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").set(listener, {
			event,
			registration
		});
	}, _EventEmitter_removeEmittedListener = function _EventEmitter_removeEmittedListener(event, registration) {
		if (registration.removed) return;
		registration.removed = true;
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_emittedListenerRegistrations, "f").delete(registration.listener);
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f").add(event);
		if (tslib_1.__classPrivateFieldGet(this, _EventEmitter_listenerDispatchDepth, "f") === 0) tslib_1.__classPrivateFieldGet(this, _EventEmitter_instances, "m", _EventEmitter_cleanupEmittedListeners).call(this);
	}, _EventEmitter_cleanupEmittedListeners = function _EventEmitter_cleanupEmittedListeners() {
		for (const event of tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f")) {
			const eventType = event;
			const listeners = tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventType];
			if (listeners) tslib_1.__classPrivateFieldGet(this, _EventEmitter_listeners, "f")[eventType] = listeners.filter((listener) => !listener.removed);
		}
		tslib_1.__classPrivateFieldGet(this, _EventEmitter_pendingListenerCleanup, "f").clear();
	};
	/**
	* An EventEmitter variant that exposes `_emit()` publicly.
	*
	* The base {@link EventEmitter} keeps `_emit` protected so that consumers
	* can only listen, not dispatch. When you need a separate emitter instance
	* that your own code can emit on, without exposing emit on the
	* consumer-facing emitter, use this class.
	*/
	var InternalEventEmitter = class extends EventEmitter {
		/** Dispatches a named event to its currently registered listeners. */
		_emit(event, ...args) {
			super._emit(event, ...args);
		}
	};
	exports.InternalEventEmitter = InternalEventEmitter;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/headers.js
var require_headers = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmptyHeaders = exports.buildHeaders = void 0;
	const values_1 = require_values();
	const brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
	const httpTokenHeaderName = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
	function* iterateHeaders(headers) {
		if (!headers) return;
		if (brand_privateNullableHeaders in headers) {
			const { values, nulls } = headers;
			yield* values.entries();
			for (const name of nulls) yield [name, null];
			return;
		}
		let shouldClear = false;
		let iter;
		const iterator = Symbol.iterator in headers ? headers[Symbol.iterator] : void 0;
		if (typeof iterator === "function") iter = { [Symbol.iterator]: () => iterator.call(headers) };
		else {
			shouldClear = true;
			iter = Object.entries(headers ?? {});
		}
		for (let row of iter) {
			const name = row[0];
			if (typeof name !== "string") throw new TypeError("expected header name to be a string");
			const values = (0, values_1.isReadonlyArray)(row[1]) ? row[1] : [row[1]];
			let didClear = false;
			for (const value of values) {
				if (value === void 0) continue;
				if (shouldClear && !didClear) {
					didClear = true;
					yield [name, null];
				}
				yield [name, value];
			}
		}
	}
	const buildHeaders = (newHeaders) => {
		const targetHeaders = new Headers();
		const nullHeaders = /* @__PURE__ */ new Set();
		for (const headers of newHeaders) {
			const seenHeaders = /* @__PURE__ */ new Set();
			for (const [name, value] of iterateHeaders(headers)) {
				if (!httpTokenHeaderName.test(name)) throw new TypeError(`Header name must be a valid HTTP token ["${name}"]`);
				const lowerName = name.toLowerCase();
				if (!seenHeaders.has(lowerName)) {
					targetHeaders.delete(lowerName);
					seenHeaders.add(lowerName);
				}
				if (value === null) {
					targetHeaders.delete(lowerName);
					nullHeaders.add(lowerName);
				} else {
					targetHeaders.append(lowerName, value);
					nullHeaders.delete(lowerName);
				}
			}
		}
		return {
			[brand_privateNullableHeaders]: true,
			values: targetHeaders,
			nulls: nullHeaders
		};
	};
	exports.buildHeaders = buildHeaders;
	const isEmptyHeaders = (headers) => {
		for (const _ of iterateHeaders(headers)) return false;
		return true;
	};
	exports.isEmptyHeaders = isEmptyHeaders;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/shims.js
var require_shims = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* This module provides internal shims and utility functions for environments where certain Node.js or global types may not be available.
	*
	* These are used to ensure we can provide a consistent behaviour between different JavaScript environments and good error
	* messages in cases where an environment isn't fully supported.
	*/
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getDefaultFetch = getDefaultFetch;
	exports.makeReadableStream = makeReadableStream;
	exports.ReadableStreamFrom = ReadableStreamFrom;
	exports.ReadableStreamToAsyncIterable = ReadableStreamToAsyncIterable;
	exports.CancelReadableStream = CancelReadableStream;
	function getDefaultFetch() {
		if (typeof fetch !== "undefined") return fetch;
		throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
	}
	function makeReadableStream(...args) {
		const ReadableStream = globalThis.ReadableStream;
		if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
		return new ReadableStream(...args);
	}
	function ReadableStreamFrom(iterable, strategy) {
		let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
		return makeReadableStream({
			start() {},
			async pull(controller) {
				const { done, value } = await iter.next();
				if (done) controller.close();
				else controller.enqueue(value);
			},
			async cancel() {
				await iter.return?.();
			}
		}, strategy);
	}
	/**
	* Most browsers don't yet have async iterable support for ReadableStream,
	* and Node has a very different way of reading bytes from its "ReadableStream".
	*
	* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
	*/
	function ReadableStreamToAsyncIterable(stream) {
		if (stream[Symbol.asyncIterator]) return stream;
		const reader = stream.getReader();
		return {
			async next() {
				try {
					const result = await reader.read();
					if (result?.done) reader.releaseLock();
					return result;
				} catch (e) {
					reader.releaseLock();
					throw e;
				}
			},
			async return() {
				const cancelPromise = reader.cancel();
				reader.releaseLock();
				await cancelPromise;
				return {
					done: true,
					value: void 0
				};
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}
	/**
	* Cancels a ReadableStream we don't need to consume.
	* See https://undici.nodejs.org/#/?id=garbage-collection
	*/
	async function CancelReadableStream(stream) {
		if (stream === null || typeof stream !== "object") return;
		if (stream[Symbol.asyncIterator]) {
			await stream[Symbol.asyncIterator]().return?.();
			return;
		}
		const reader = stream.getReader();
		const cancelPromise = reader.cancel();
		reader.releaseLock();
		await cancelPromise;
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/auth/x509-api-origin.js
var require_x509_api_origin = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.X509_API_BASE_URL = void 0;
	exports.assertX509APIOrigin = assertX509APIOrigin;
	const error_1 = require_error$1();
	const log_1 = require_log();
	/** Sole API authority approved for OpenAI X.509 workload-identity federation. */
	exports.X509_API_BASE_URL = "https://mtls.api.openai.com/v1";
	/** Validates the enrolled API authority and rejects credential-bearing query parameters. */
	function assertX509APIOrigin(value) {
		let target;
		try {
			target = new URL(value);
		} catch {
			throw new error_1.OpenAIError("X.509 workload identity requires the approved global mTLS API origin.");
		}
		if (target.origin !== "https://mtls.api.openai.com" || target.username || target.password) throw new error_1.OpenAIError("X.509 workload identity requires the approved global mTLS API origin.");
		for (const name of target.searchParams.keys()) if ((0, log_1.isSensitiveQueryParameter)(name)) throw new error_1.OpenAIError("X.509 workload identity cannot send conflicting query authentication credentials.");
		return target;
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/auth/x509-transport-registry.js
var require_x509_transport_registry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.x509TransportBrand = void 0;
	exports.isRetryableX509TransportFailure = isRetryableX509TransportFailure;
	exports.resolveX509Transport = resolveX509Transport;
	const error_1 = require_error$1();
	const _x509_transport_state_1 = require_x509_transport_state();
	const transientX509TransportCodes = /* @__PURE__ */ new Set([
		"ECONNRESET",
		"ECONNREFUSED",
		"ENETUNREACH",
		"EHOSTUNREACH",
		"ENETDOWN",
		"EPIPE",
		"ETIMEDOUT",
		"EAI_AGAIN",
		"UND_ERR_CONNECT_TIMEOUT",
		"UND_ERR_HEADERS_TIMEOUT",
		"UND_ERR_BODY_TIMEOUT",
		"UND_ERR_SOCKET"
	]);
	/** Retries only known temporary failures when neither error layer reports a permanent code. */
	function isRetryableX509TransportFailure(failure) {
		const cause = typeof failure === "object" && failure !== null ? Object.getOwnPropertyDescriptor(failure, "cause")?.value : void 0;
		let retryable = false;
		for (const candidate of [failure, cause]) {
			const code = typeof candidate === "object" && candidate !== null ? Object.getOwnPropertyDescriptor(candidate, "code")?.value : void 0;
			if (typeof code === "string") {
				if (!transientX509TransportCodes.has(code)) return false;
				retryable = true;
			}
		}
		return retryable;
	}
	exports.x509TransportBrand = Symbol("X.509 transport capability");
	/** Resolves a previously registered opaque capability without importing an optional transport peer. */
	function resolveX509Transport(value) {
		if (!value || typeof value !== "object") throw new error_1.OpenAIError("X.509 workload identity requires an approved X.509 transport capability.");
		const registered = (0, _x509_transport_state_1.findRegisteredX509Transport)(value);
		if (!registered) throw new error_1.OpenAIError("X.509 workload identity requires an approved X.509 transport capability.");
		return registered;
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/auth/x509-workload-identity-auth.js
var require_x509_workload_identity_auth = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _X509WorkloadIdentityAuth_instances;
	var _a;
	var _X509WorkloadIdentityAuth_identityProviderId;
	var _X509WorkloadIdentityAuth_serviceAccountId;
	var _X509WorkloadIdentityAuth_configuredRefreshBufferMs;
	var _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds;
	var _X509WorkloadIdentityAuth_organization;
	var _X509WorkloadIdentityAuth_project;
	var _X509WorkloadIdentityAuth_transport;
	var _X509WorkloadIdentityAuth_refreshBufferMs;
	var _X509WorkloadIdentityAuth_cachedToken;
	var _X509WorkloadIdentityAuth_refresh;
	var _X509WorkloadIdentityAuth_tokenGeneration;
	var _X509WorkloadIdentityAuth_cancelRequestBody;
	var _X509WorkloadIdentityAuth_assignToken;
	var _X509WorkloadIdentityAuth_recoverRefreshFailure;
	var _X509WorkloadIdentityAuth_fallbackToken;
	var _X509WorkloadIdentityAuth_retireRefresh;
	var _X509WorkloadIdentityAuth_beginRefresh;
	var _X509WorkloadIdentityAuth_refreshToken;
	var _X509WorkloadIdentityAuth_preflight;
	var _X509WorkloadIdentityAuth_scope;
	var _X509WorkloadIdentityAuth_assertTenantHeaders;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.X509WorkloadIdentityAuth = void 0;
	exports.isX509WorkloadIdentity = isX509WorkloadIdentity;
	exports.assertX509WebSocketSupported = assertX509WebSocketSupported;
	exports.assertX509FetchOptions = assertX509FetchOptions;
	exports.assertX509RequestOptions = assertX509RequestOptions;
	exports.snapshotX509RequestOptions = snapshotX509RequestOptions;
	const tslib_1 = require_tslib();
	const error_1 = require_error$1();
	const headers_1 = require_headers();
	const shims_1 = require_shims();
	const log_1 = require_log();
	const values_1 = require_values();
	const x509_api_origin_1 = require_x509_api_origin();
	const x509_transport_registry_1 = require_x509_transport_registry();
	const _x509_transport_state_1 = require_x509_transport_state();
	const FORBIDDEN_TRANSPORT_OPTIONS = [
		"dispatcher",
		"agent",
		"client",
		"tls",
		"proxy"
	];
	const headerValue = (headers, name) => Headers.prototype.get.call(headers, name);
	const DEFAULT_REFRESH_BUFFER_MS = 12e5;
	const FAILED_REFRESH_COOLDOWN_MS = 1e3;
	const userAbortError = (signal) => {
		const error = new error_1.APIUserAbortError();
		Object.defineProperty(error, "cause", {
			value: signal.reason,
			writable: true,
			configurable: true
		});
		return error;
	};
	function assertSafeHeaders(headers) {
		for (const name of Headers.prototype.keys.call(headers)) {
			const canonical = name.toLowerCase().split("_").join("-");
			if (canonical !== "authorization" && (0, log_1.isSensitiveHeader)(canonical) || canonical === "host") throw new error_1.OpenAIError("X.509 workload identity cannot send conflicting authentication credentials.");
		}
	}
	function exchangeDeadline(timeout, callerSignal) {
		const deadline = new AbortController();
		const timer = timeout === void 0 ? void 0 : setTimeout(() => deadline.abort(new error_1.APIConnectionTimeoutError()), timeout);
		const timerHandle = timer;
		if (typeof timerHandle === "object" && timerHandle !== null && "unref" in timerHandle && typeof timerHandle.unref === "function") timerHandle.unref();
		const cancel = () => deadline.abort(callerSignal?.reason);
		callerSignal?.addEventListener("abort", cancel, { once: true });
		if (callerSignal?.aborted) cancel();
		return {
			signal: deadline.signal,
			dispose: () => {
				callerSignal?.removeEventListener("abort", cancel);
				if (timer) clearTimeout(timer);
			}
		};
	}
	function waitForRefresh(attempt, signal) {
		let abort;
		const canceled = new Promise((_resolve, reject) => {
			abort = () => reject(signal.reason);
			signal.addEventListener("abort", abort, { once: true });
			if (signal.aborted) abort();
		});
		return {
			result: Promise.race([attempt.promise, canceled]),
			dispose: () => {
				if (abort) signal.removeEventListener("abort", abort);
			}
		};
	}
	/** Distinguishes true certificate identities from extensible legacy subject-token identities. */
	function isX509WorkloadIdentity(identity) {
		if (!identity || typeof identity !== "object") return false;
		let providerOwner = identity;
		while (providerOwner !== null && providerOwner !== Object.prototype) {
			const provider = Object.getOwnPropertyDescriptor(providerOwner, "provider");
			if (provider) {
				if (!("value" in provider) || provider.value !== void 0) return false;
				break;
			}
			providerOwner = Object.getPrototypeOf(providerOwner);
		}
		let current = identity;
		while (current !== null && current !== Object.prototype) {
			const discriminator = Object.getOwnPropertyDescriptor(current, "type");
			if (discriminator) {
				if (!("value" in discriminator)) throw new error_1.OpenAIError("X.509 workload identity type must be a plain data property.");
				return discriminator.value === "x509";
			}
			current = Object.getPrototypeOf(current);
		}
		return false;
	}
	/** Rejects unsupported WebSocket authentication before any connection or credential side effect. */
	function assertX509WebSocketSupported(client) {
		if (!client || typeof client !== "object") return;
		if ((0, _x509_transport_state_1.isApprovedX509Client)(client)) throw new error_1.OpenAIError("X.509 workload identity does not support WebSocket connections.");
	}
	/** Prevents caller options from replacing the immutable transport selected at construction. */
	function assertX509FetchOptions(options) {
		if (!options) return;
		for (const name of FORBIDDEN_TRANSPORT_OPTIONS) if ((0, values_1.hasOwn)(options, name)) throw new error_1.OpenAIError("X.509 workload identity cannot override its approved transport capability.");
		const redirect = Object.getOwnPropertyDescriptor(options, "redirect")?.value;
		if (redirect !== void 0 && redirect !== "manual") throw new error_1.OpenAIError("X.509 workload identity requests require manual redirects.");
	}
	/** Rejects caller overrides while allowing the SDK-owned fields on the final RequestInit. */
	function assertX509RequestOptions(options) {
		assertX509FetchOptions(options);
		if (options && [
			"body",
			"headers",
			"method",
			"signal"
		].some((name) => (0, values_1.hasOwn)(options, name))) throw new error_1.OpenAIError("X.509 workload identity cannot override its request body, headers, method, or signal through fetch options.");
	}
	/** Validates and snapshots the exact caller options that will reach authenticated dispatch. */
	function snapshotX509RequestOptions(options) {
		assertX509RequestOptions(options);
		const snapshot = { ...options };
		assertX509RequestOptions(snapshot);
		return snapshot;
	}
	/** Bridges certificate authentication into existing OpenAI auth and fetch hooks without optional peers. */
	var X509WorkloadIdentityAuth = class {
		/** Captures one registered, immutable certificate identity and its enrolled selectors. */
		constructor(identity, transport, organization, project) {
			_X509WorkloadIdentityAuth_instances.add(this);
			_X509WorkloadIdentityAuth_identityProviderId.set(this, void 0);
			_X509WorkloadIdentityAuth_serviceAccountId.set(this, void 0);
			_X509WorkloadIdentityAuth_configuredRefreshBufferMs.set(this, void 0);
			_X509WorkloadIdentityAuth_configuredRefreshBufferSeconds.set(this, void 0);
			_X509WorkloadIdentityAuth_organization.set(this, void 0);
			_X509WorkloadIdentityAuth_project.set(this, void 0);
			_X509WorkloadIdentityAuth_transport.set(this, void 0);
			_X509WorkloadIdentityAuth_refreshBufferMs.set(this, void 0);
			_X509WorkloadIdentityAuth_cachedToken.set(this, void 0);
			_X509WorkloadIdentityAuth_refresh.set(this, void 0);
			_X509WorkloadIdentityAuth_tokenGeneration.set(this, 0);
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_transport, (0, x509_transport_registry_1.resolveX509Transport)(transport), "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_identityProviderId, identity.identityProviderId, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_serviceAccountId, identity.serviceAccountId, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, identity.refreshBufferMs, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, identity.refreshBufferSeconds, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_organization, organization, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_project, project, "f");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") !== void 0 && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") !== void 0) throw new error_1.OpenAIError("X.509 workload identity cannot combine refreshBufferSeconds and refreshBufferMs.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") !== void 0 && (!Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f")) || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") < 0)) throw new error_1.OpenAIError("X.509 workload identity requires a nonnegative integer refreshBufferMs.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") !== void 0 && (!Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f")) || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") < 0 || !Number.isSafeInteger(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") * 1e3))) throw new error_1.OpenAIError("X.509 workload identity requires a nonnegative integer refreshBufferSeconds.");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refreshBufferMs, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") === void 0 ? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") ?? DEFAULT_REFRESH_BUFFER_MS : tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") * 1e3, "f");
		}
		/** Reconstructs the immutable selectors captured before caller-owned identity mutation. */
		identitySnapshot() {
			return {
				type: "x509",
				identityProviderId: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f"),
				serviceAccountId: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f"),
				...tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") === void 0 ? {} : { refreshBufferMs: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferMs, "f") },
				...tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") === void 0 ? {} : { refreshBufferSeconds: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds, "f") }
			};
		}
		/** Preserves explicitly headerless requests without presenting a certificate to the issuer. */
		static shouldAuthenticate(options, defaultHeaders, requestHeaders = options.headers) {
			return !(0, headers_1.buildHeaders)([defaultHeaders, requestHeaders]).nulls.has("authorization");
		}
		/** Snapshots each caller-owned header layer once while preserving nulls and precedence. */
		snapshotHeaders(defaultHeaders, requestHeaders) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			scope.defaultHeaders ?? (scope.defaultHeaders = (0, headers_1.buildHeaders)([defaultHeaders]));
			scope.requestHeaders ?? (scope.requestHeaders = (0, headers_1.buildHeaders)([requestHeaders]));
			return this.headerSnapshots();
		}
		/** Returns the already rendered caller headers without touching mutable inputs again. */
		headerSnapshots() {
			const { defaultHeaders, requestHeaders } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!defaultHeaders || !requestHeaders) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted request headers.");
			return {
				defaultHeaders,
				requestHeaders
			};
		}
		/** Captures enrolled public tenant selectors once before certificate presentation. */
		snapshotTenant(organization, project) {
			if (organization !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || project !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			scope.tenant = {
				organization,
				project
			};
			return scope.tenant;
		}
		/** Returns the tenant selectors already approved for this logical request. */
		tenantSnapshot() {
			const { tenant } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!tenant) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted tenant selectors.");
			return tenant;
		}
		/** Validates and retains the exact destination that authenticated dispatch will use. */
		snapshotAPIURL(value) {
			(0, x509_api_origin_1.assertX509APIOrigin)(value);
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).apiURL = value;
		}
		/** Reads the already-approved destination without rerendering caller-owned request options. */
		requestAPIURL() {
			const { apiURL } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (apiURL === void 0) throw new error_1.OpenAIError("X.509 workload identity requires a snapshotted API destination.");
			return apiURL;
		}
		/** Captures the exact caller settings approved for authenticated dispatch. */
		snapshotRequest(signal, timeout, fetchOptions) {
			var _b;
			(_b = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this)).request ?? (_b.request = {
				signal,
				timeout,
				fetchOptions
			});
		}
		/** Returns immutable request settings without invoking caller-owned accessors again. */
		requestSnapshot() {
			const { request } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!request) throw new error_1.OpenAIError("X.509 workload identity requires snapshotted request settings.");
			return request;
		}
		/** Suspends an already-running network budget during retry-local asynchronous preparation. */
		beginRequestPreparation() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (scope.deadlineArmed && scope.preparationStartedAt === void 0) {
				scope.preparationStartedAt = performance.now();
				scope.preparationWallStartedAt = Date.now();
			}
		}
		/** Begins local request construction without charging protected hook latency to the network. */
		beginRequestPlanning() {
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).phase = "planning";
		}
		/** Arms one absolute network deadline only after all local request preparation completes. */
		beginRequestNetwork() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (!scope.deadlineArmed) {
				scope.wallStartedAt = Date.now();
				scope.monotonicStartedAt = performance.now();
				scope.deadlineArmed = true;
			} else if (scope.preparationStartedAt !== void 0) {
				scope.monotonicStartedAt += performance.now() - scope.preparationStartedAt;
				scope.wallStartedAt += Date.now() - (scope.preparationWallStartedAt ?? Date.now());
				delete scope.preparationStartedAt;
				delete scope.preparationWallStartedAt;
			}
		}
		/** Keeps certificate authentication outside overridable request construction. */
		isPlanningRequest() {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).phase === "planning";
		}
		/** Approves the final overridden destination and transport before minting a bearer. */
		authorizePlannedRequest(url, request, timeout, allowHookSignal = false) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const headers = Object.getOwnPropertyDescriptor(request, "headers");
			const body = Object.getOwnPropertyDescriptor(request, "body");
			const signal = Object.getOwnPropertyDescriptor(request, "signal");
			const redirect = Object.getOwnPropertyDescriptor(request, "redirect");
			if (scope.phase !== "planning" || !headers || !(headers.value instanceof Headers) || !body && "body" in request || [
				body,
				signal,
				redirect
			].some((descriptor) => descriptor && !("value" in descriptor))) throw new error_1.OpenAIError("X.509 workload identity requires an approved final request.");
			this.snapshotAPIURL(url);
			assertX509FetchOptions(request);
			try {
				assertSafeHeaders(headers.value);
			} catch {
				throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authentication credentials.");
			}
			if (headerValue(headers.value, "Authorization") !== null) throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authorization credentials.");
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_assertTenantHeaders).call(this, headers.value);
			if (!allowHookSignal && (signal?.value ?? void 0) !== (this.requestSnapshot().signal ?? void 0)) throw new error_1.OpenAIError("X.509 workload identity must preserve its approved request signal.");
			const approved = this.requestSnapshot();
			scope.request = {
				...approved,
				timeout: Math.min(approved.timeout, timeout)
			};
			scope.phase = "authorizing";
		}
		/** Owns only SDK-created iterator adapters until authenticated dispatch takes responsibility. */
		ownRequestBody(body, source) {
			if (body instanceof ReadableStream && body !== source) tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).materializedBody = body;
		}
		/** Recognizes every one-shot upload before issuer authentication or request replay. */
		static isStreamingRequestBody(body) {
			return globalThis.ReadableStream !== void 0 && body instanceof globalThis.ReadableStream || typeof body === "object" && body !== null && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function");
		}
		/** Retires abandoned upload adapters without masking or blocking their authentication failure. */
		retireRequestBody() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const body = scope.materializedBody;
			delete scope.materializedBody;
			if (body) tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_cancelRequestBody).call(_a, body);
		}
		/** Transfers the dispatched upload while retiring any SDK-owned body replaced by a hook. */
		releaseRequestBody(body) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			if (scope.materializedBody === body) delete scope.materializedBody;
			else this.retireRequestBody();
		}
		/** Retains caller-only cancellation separately from SDK-created deadline controllers. */
		setEffectiveSignal(signal) {
			if (signal) tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).effectiveSignal = signal;
			else delete tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this).effectiveSignal;
		}
		/** Uses protected-hook cancellation when an authenticated attempt enters retry backoff. */
		effectiveSignal() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			return scope.effectiveSignal ?? scope.request?.signal;
		}
		/** Establishes an independent scope even when concurrent requests share caller options. */
		runRequest(operation, requestOwner) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").run(async () => {
				const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
				if (!scope) throw new error_1.OpenAIError("X.509 workload identity requires an active certificate request scope.");
				scope.owner = this;
				scope.requestOwner = requestOwner;
				try {
					return await operation();
				} finally {
					this.retireRequestBody();
					this.releaseRequestCredentials();
					delete scope.requestOwner;
					delete scope.owner;
				}
			});
		}
		/** Reports whether a public request-building call already belongs to an active logical operation. */
		inRequest(requestOwner) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			return scope?.owner === this && scope.requestOwner === requestOwner && scope.phase !== "authorizing";
		}
		/** Shares a cache only when the complete, privately snapshotted credential identity matches. */
		matches(other) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_transport, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_identityProviderId, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_serviceAccountId, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_organization, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_project, "f") && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f") === tslib_1.__classPrivateFieldGet(other, _X509WorkloadIdentityAuth_refreshBufferMs, "f");
		}
		/** Binds deferred response parsing to the original logical request and its unchanged deadline. */
		continuation() {
			const { wallStartedAt, monotonicStartedAt, deadlineArmed, request, requestOwner, effectiveSignal } = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const scope = {
				wallStartedAt,
				monotonicStartedAt,
				owner: this,
				...deadlineArmed ? { deadlineArmed } : {},
				...request ? { request } : {},
				...effectiveSignal ? { effectiveSignal } : {},
				...requestOwner ? { requestOwner } : {}
			};
			return (operation) => tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").resume(scope, async () => {
				try {
					return await operation();
				} finally {
					this.releaseRequestCredentials();
					delete scope.requestOwner;
					delete scope.owner;
				}
			});
		}
		/** Removes dispatched bearer material before settled request promises can retain their scope. */
		releaseRequestCredentials() {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			delete scope.request;
			delete scope.phase;
			delete scope.deadlineArmed;
			delete scope.preparationStartedAt;
			delete scope.preparationWallStartedAt;
			delete scope.effectiveSignal;
			delete scope.materializedBody;
			delete scope.apiURL;
			delete scope.tenant;
			delete scope.token;
			delete scope.defaultHeaders;
			delete scope.requestHeaders;
			delete scope.tokenGeneration;
			delete scope.headers;
			delete scope.authorization;
		}
		/** Returns the original authentication start so response consumption shares its request deadline. */
		requestStartedAt(_options) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current()?.wallStartedAt;
		}
		/** Distinguishes issued workload credentials from independent admin or headerless requests. */
		usedWorkloadToken(_options) {
			return tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current()?.token !== void 0;
		}
		/** Returns the budget left after certificate authentication without starting another timeout. */
		remainingTimeout(_options, timeout) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (scope === void 0) return timeout;
			const remaining = timeout - (performance.now() - scope.monotonicStartedAt);
			if (remaining <= 0) throw new error_1.APIConnectionTimeoutError();
			return remaining;
		}
		/** Cancels active retry timers promptly without changing public caller-abort semantics. */
		async waitForRetry(duration, signal) {
			try {
				await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").sleep(duration, signal);
			} catch (error) {
				if (signal?.aborted) throw userAbortError(signal);
				throw error;
			}
		}
		/** Trusts only issuer or connection failures privately branded by the approved transport. */
		static isRetryableFailure(error) {
			return typeof error === "object" && error !== null && ((0, _x509_transport_state_1.isTransientX509ConnectionError)(error) || (0, _x509_transport_state_1.isRetryableX509IssuerError)(error));
		}
		/** Reads safe retry hints only from a privately branded, sanitized issuer response. */
		static retryHeaders(error) {
			if (!error || typeof error !== "object" || !(0, _x509_transport_state_1.isRetryableX509IssuerError)(error)) return;
			const headers = Object.getOwnPropertyDescriptor(error, "headers")?.value;
			return headers instanceof Headers ? headers : void 0;
		}
		/** Exchanges the exact certificate capability selected for the matching API dispatch. */
		async getToken(options, context) {
			const callerSignal = context ? context.signal : options?.signal;
			if (callerSignal?.aborted) throw userAbortError(callerSignal);
			if (options) assertX509RequestOptions(context ? context.fetchOptions : options.fetchOptions);
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_preflight).call(this, context);
			const scope = options ? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this) : void 0;
			const cached = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f");
			if (cached && performance.now() < cached.refreshAt && Date.now() < cached.wallRefreshAt) return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, cached);
			const { signal, dispose } = exchangeDeadline(context && options ? this.remainingTimeout(options, context.timeout) : context?.timeout, callerSignal);
			if (callerSignal?.aborted) {
				dispose();
				throw userAbortError(callerSignal);
			}
			const attempt = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") ?? tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_beginRefresh).call(this);
			attempt.waiters += 1;
			const waiter = waitForRefresh(attempt, signal);
			try {
				const exchanged = await waiter.result;
				const refreshed = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f");
				if (!refreshed || refreshed.accessToken !== exchanged.accessToken) throw new error_1.APIUserAbortError();
				return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, refreshed);
			} catch (error) {
				return await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_recoverRefreshFailure).call(this, error, attempt, cached, scope, options, context);
			} finally {
				waiter.dispose();
				dispose();
				attempt.waiters -= 1;
				tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_retireRefresh).call(this, attempt);
			}
		}
		/** Invalidates only the workload-token generation actually rejected by the current request. */
		invalidateToken() {
			const rejected = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (!rejected?.token || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f")?.accessToken !== rejected.token || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f").generation !== rejected.tokenGeneration) return;
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_cachedToken, void 0, "f");
			const refresh = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
			refresh?.controller.abort(new error_1.APIUserAbortError());
		}
		/** Binds the minted credential to the original headers before protected request hooks run. */
		bindRequest(options, request, adminAPIKey) {
			if (!(request.headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity requires the original workload authorization headers.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const { token } = scope;
			const security = options.__security ?? { bearerAuth: true };
			let approvedAuthorization = token ? `Bearer ${token}` : null;
			if (!token && security.adminAPIKeyAuth && adminAPIKey !== null && headerValue(request.headers, "Authorization") !== null) approvedAuthorization = new Headers({ Authorization: `Bearer ${adminAPIKey}` }).get("Authorization");
			scope.headers = request.headers;
			scope.authorization = approvedAuthorization;
			this.assertRequest(request);
		}
		/** Rebinds an equivalent protected-hook container without relaxing final dispatch identity checks. */
		adoptRequestHeaders(request) {
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_scope).call(this);
			const original = scope.headers;
			if (!(original instanceof Headers) || !(request.headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			scope.headers = request.headers;
			try {
				this.assertRequest(request);
			} catch (error) {
				scope.headers = original;
				throw error;
			}
		}
		/** Rejects request hooks that replace the selected bearer or its approved header identity. */
		assertRequest(request) {
			const { headers } = request;
			if (!(headers instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
			if (!scope || scope.headers !== headers || scope.authorization === void 0 || headerValue(headers, "Authorization") !== scope.authorization) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
			tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_assertTenantHeaders).call(this, headers);
			assertSafeHeaders(headers);
		}
		/** Returns a guarded final dispatcher while preserving all existing request hook object identities. */
		fetch() {
			return async (input, init = {}) => {
				const target = (0, x509_api_origin_1.assertX509APIOrigin)(typeof input === "string" || input instanceof URL ? input : input.url);
				assertX509FetchOptions(init);
				this.assertRequest(init);
				const approved = init.headers;
				if (!(approved instanceof Headers)) throw new error_1.OpenAIError("X.509 workload identity must preserve its issued workload authorization.");
				const headers = new Headers([...Headers.prototype.entries.call(approved)]);
				assertSafeHeaders(headers);
				init.headers = headers;
				init.redirect = "manual";
				return await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").dispatch(target, init);
			};
		}
	};
	exports.X509WorkloadIdentityAuth = X509WorkloadIdentityAuth;
	_a = X509WorkloadIdentityAuth, _X509WorkloadIdentityAuth_identityProviderId = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_serviceAccountId = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_configuredRefreshBufferMs = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_configuredRefreshBufferSeconds = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_organization = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_project = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_transport = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_refreshBufferMs = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_cachedToken = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_refresh = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_tokenGeneration = /* @__PURE__ */ new WeakMap(), _X509WorkloadIdentityAuth_instances = /* @__PURE__ */ new WeakSet(), _X509WorkloadIdentityAuth_cancelRequestBody = async function _X509WorkloadIdentityAuth_cancelRequestBody(body) {
		try {
			await (0, shims_1.CancelReadableStream)(body);
		} catch {}
	}, _X509WorkloadIdentityAuth_assignToken = function _X509WorkloadIdentityAuth_assignToken(scope, token) {
		if (scope) {
			scope.token = token.accessToken;
			scope.tokenGeneration = token.generation;
		}
		return token.accessToken;
	}, _X509WorkloadIdentityAuth_recoverRefreshFailure = async function _X509WorkloadIdentityAuth_recoverRefreshFailure(error, attempt, cached, scope, options, context) {
		const callerSignal = context ? context.signal : options?.signal;
		if (callerSignal?.aborted) throw userAbortError(callerSignal);
		if (attempt.controller.signal.aborted && attempt.generation !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f")) return await this.getToken(options, context);
		const fallback = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_fallbackToken).call(this, error, cached, scope);
		if (fallback !== void 0) return fallback;
		if (error && typeof error === "object" && !(error instanceof error_1.OAuthError)) {
			const oauth = (0, _x509_transport_state_1.findX509OAuthError)(error);
			if (oauth) throw new error_1.OAuthError(oauth.status, oauth.error, oauth.headers);
		}
		throw error;
	}, _X509WorkloadIdentityAuth_fallbackToken = function _X509WorkloadIdentityAuth_fallbackToken(error, cached, scope) {
		if (!cached || cached !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_cachedToken, "f") || performance.now() >= cached.expiresAt || Date.now() >= cached.wallExpiresAt || !_a.isRetryableFailure(error)) return;
		const headers = _a.retryHeaders(error);
		const milliseconds = headers?.get("retry-after-ms");
		let requested = milliseconds ? Number(milliseconds) : void 0;
		const retryAfter = headers?.get("retry-after");
		if (retryAfter && (requested === void 0 || Number.isNaN(requested))) {
			const seconds = Number(retryAfter);
			requested = Number.isNaN(seconds) ? Date.parse(retryAfter) - Date.now() : seconds * 1e3;
		}
		const cooldown = requested !== void 0 && Number.isFinite(requested) && requested >= 0 && requested <= 6e4 ? Math.max(FAILED_REFRESH_COOLDOWN_MS, requested) : FAILED_REFRESH_COOLDOWN_MS;
		cached.refreshAt = Math.min(cached.expiresAt, performance.now() + cooldown);
		cached.wallRefreshAt = Math.min(cached.wallExpiresAt, Date.now() + cooldown);
		return tslib_1.__classPrivateFieldGet(_a, _a, "m", _X509WorkloadIdentityAuth_assignToken).call(_a, scope, cached);
	}, _X509WorkloadIdentityAuth_retireRefresh = function _X509WorkloadIdentityAuth_retireRefresh(attempt) {
		if (attempt.waiters !== 0 || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") !== attempt) return;
		queueMicrotask(() => {
			if (attempt.waiters === 0 && tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f") === attempt) {
				tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
				tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
				attempt.controller.abort(new error_1.APIUserAbortError());
			}
		});
	}, _X509WorkloadIdentityAuth_beginRefresh = function _X509WorkloadIdentityAuth_beginRefresh() {
		const controller = new AbortController();
		const generation = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f");
		const attempt = {
			controller,
			generation,
			waiters: 0,
			promise: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_instances, "m", _X509WorkloadIdentityAuth_refreshToken).call(this, controller, generation)
		};
		tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, attempt, "f");
		return attempt;
	}, _X509WorkloadIdentityAuth_refreshToken = async function _X509WorkloadIdentityAuth_refreshToken(controller, generation) {
		const startedAt = performance.now();
		const wallStartedAt = Date.now();
		try {
			const token = await tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").exchange(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_identityProviderId, "f"), tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_serviceAccountId, "f"), controller.signal);
			const lifetime = token.expiresIn * 1e3;
			const expiresAt = startedAt + lifetime;
			const wallExpiresAt = wallStartedAt + lifetime;
			if (performance.now() >= expiresAt || Date.now() >= wallExpiresAt) throw new error_1.OpenAIError("X.509 workload identity token expired before its exchange completed.");
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") !== generation || controller.signal.aborted || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f")?.controller !== controller) throw new error_1.APIUserAbortError();
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_tokenGeneration, tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f") + 1, "f");
			tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_cachedToken, {
				accessToken: token.accessToken,
				generation: tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_tokenGeneration, "f"),
				expiresAt,
				refreshAt: expiresAt - Math.min(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f"), lifetime / 2),
				wallExpiresAt,
				wallRefreshAt: wallExpiresAt - Math.min(tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refreshBufferMs, "f"), lifetime / 2)
			}, "f");
			return token;
		} finally {
			if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_refresh, "f")?.controller === controller) tslib_1.__classPrivateFieldSet(this, _X509WorkloadIdentityAuth_refresh, void 0, "f");
		}
	}, _X509WorkloadIdentityAuth_preflight = function _X509WorkloadIdentityAuth_preflight(context) {
		if (!context) return;
		if (context.organization !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || context.project !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		(0, x509_api_origin_1.assertX509APIOrigin)(context.apiURL);
		const supplied = (0, headers_1.buildHeaders)([context.defaultHeaders, context.requestHeaders]);
		if (tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") !== null && supplied.nulls.has("openai-organization") || tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f") !== null && supplied.nulls.has("openai-project")) throw new error_1.OpenAIError("X.509 workload identity cannot omit its enrolled organization or project.");
		for (const name of supplied.values.keys()) {
			const canonical = name.toLowerCase().split("_").join("-");
			if ((canonical === "openai-organization" || canonical === "openai-project") && (name !== canonical || headerValue(supplied.values, name) !== (canonical === "openai-organization" ? context.organization : context.project))) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
			if ((0, log_1.isSensitiveHeader)(canonical) || canonical === "host") throw new error_1.OpenAIError("X.509 workload identity cannot use caller-supplied authentication credentials.");
		}
	}, _X509WorkloadIdentityAuth_scope = function _X509WorkloadIdentityAuth_scope() {
		const scope = tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_transport, "f").current();
		if (!scope || scope.owner !== this) throw new error_1.OpenAIError("X.509 workload identity requires an active certificate request scope.");
		return scope;
	}, _X509WorkloadIdentityAuth_assertTenantHeaders = function _X509WorkloadIdentityAuth_assertTenantHeaders(headers) {
		if (headerValue(headers, "OpenAI-Organization") !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_organization, "f") || headerValue(headers, "OpenAI-Project") !== tslib_1.__classPrivateFieldGet(this, _X509WorkloadIdentityAuth_project, "f")) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		for (const name of Headers.prototype.keys.call(headers)) {
			const canonical = name.toLowerCase().split("_").join("-");
			if ((canonical === "openai-organization" || canonical === "openai-project") && name !== canonical) throw new error_1.OpenAIError("X.509 workload identity cannot override its enrolled organization or project.");
		}
	};
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/resources/responses/internal-base.js
var require_internal_base = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesEmitter = exports.WebSocketError = void 0;
	exports.buildURL = buildURL;
	const EventEmitter_1 = require_EventEmitter();
	const error_1 = require_error$1();
	const x509_workload_identity_auth_1 = require_x509_workload_identity_auth();
	var WebSocketError = class extends error_1.OpenAIError {
		constructor(message, event) {
			super(message);
			Object.defineProperty(this, "error", {
				value: event ?? void 0,
				writable: true,
				configurable: true,
				enumerable: false
			});
		}
	};
	exports.WebSocketError = WebSocketError;
	var ResponsesEmitter = class extends EventEmitter_1.EventEmitter {
		_onError(event, message, cause) {
			message = safeWebSocketErrorMessage(event, message) ?? "unknown error";
			if (!this._hasListener("error")) {
				const error = new WebSocketError(message + `\n\nTo resolve these unhandled rejection errors you should bind an \`error\` callback, e.g. \`ws.on('error', (error) => ...)\` `, event);
				error.cause = cause;
				Promise.reject(error);
				return;
			}
			const error = new WebSocketError(message, event);
			error.cause = cause;
			this._emit("error", error);
		}
	};
	exports.ResponsesEmitter = ResponsesEmitter;
	function buildURL(client, parameters) {
		(0, x509_workload_identity_auth_1.assertX509WebSocketSupported)(client);
		const { ...query } = parameters;
		const url = new URL(client.buildURL("/responses", query, void 0));
		url.protocol = url.protocol === "http:" || url.protocol === "ws:" ? "ws:" : "wss:";
		return url;
	}
	function safeWebSocketErrorMessage(event, message) {
		if (typeof message === "string") return message;
		if (typeof event !== "object" || event === null) return void 0;
		try {
			const error = Object.getOwnPropertyDescriptor(event, "error")?.value;
			const nestedMessage = typeof error === "object" && error !== null ? Object.getOwnPropertyDescriptor(error, "message")?.value : void 0;
			const eventMessage = Object.getOwnPropertyDescriptor(event, "message")?.value;
			const candidate = typeof nestedMessage === "string" ? nestedMessage : eventMessage;
			return typeof candidate === "string" ? candidate : void 0;
		} catch {
			return;
		}
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws-adapter.js
var require_ws_adapter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadyState = void 0;
	/** Standard WebSocket readyState values (RFC 6455). */
	exports.ReadyState = {
		/** The connection has been created but is not ready to send messages. */
		CONNECTING: 0,
		/** The connection is established and ready to send messages. */
		OPEN: 1,
		/** The closing handshake has started but is not complete. */
		CLOSING: 2,
		/** The connection is closed or could not be established. */
		CLOSED: 3
	};
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws-connection.js
var require_ws_connection = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sendWebSocketEvent = sendWebSocketEvent;
	exports.sendRawWebSocketData = sendRawWebSocketData;
	exports.flushWebSocketSendQueue = flushWebSocketSendQueue;
	exports.waitForWebSocketOpen = waitForWebSocketOpen;
	const error_1 = require_error$1();
	const ws_adapter_1 = require_ws_adapter();
	const ws_1 = require_ws$1();
	/** Sends or queues an application event using the existing connection state. */
	function sendWebSocketEvent(owner, event, queue, isReconnecting, onError) {
		if (!owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
		if (isReconnecting() || owner.socket.readyState === ws_adapter_1.ReadyState.CONNECTING || owner.socket.readyState === ws_adapter_1.ReadyState.OPEN && queue.isFlushing) {
			let enqueued;
			try {
				enqueued = queue.enqueue(event);
			} catch (error) {
				onError("could not send data", error);
				return;
			}
			if (!enqueued) onError("send queue is full, message discarded");
			return;
		}
		if (owner.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
			onError("cannot send on a closed WebSocket");
			return;
		}
		try {
			owner.socket.send(JSON.stringify(event));
		} catch (error) {
			onError("could not send data", error);
		}
	}
	/** Sends or snapshots a raw frame using the same admission rules as application events. */
	function sendRawWebSocketData(owner, data, queue, isReconnecting, onError) {
		if (!owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
		if (isReconnecting() || owner.socket.readyState === ws_adapter_1.ReadyState.CONNECTING || owner.socket.readyState === ws_adapter_1.ReadyState.OPEN && queue.isFlushing) {
			let enqueued;
			try {
				enqueued = queue.enqueueRaw(data);
			} catch (error) {
				onError("could not send data", error);
				return;
			}
			if (!enqueued) onError("send queue is full, message discarded");
			return;
		}
		if (owner.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
			onError("cannot send on a closed WebSocket");
			return;
		}
		try {
			owner.socket.send((0, ws_1.flattenRawData)(data));
		} catch (error) {
			onError("could not send data", error);
		}
	}
	/** Flushes queued frames with the caller's existing failed-send policy. */
	function flushWebSocketSendQueue(owner, queue, onError, options) {
		if (!owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
		try {
			queue.flush((data) => owner.socket.send((0, ws_1.flattenRawData)(data)), {
				...options,
				canSend: () => owner.socket.readyState === ws_adapter_1.ReadyState.OPEN
			});
		} catch (error) {
			onError("could not send queued data", error);
			return false;
		}
		return true;
	}
	/** Resolves when the socket opens, or rejects if it errors or closes first. */
	function waitForWebSocketOpen(socket) {
		return new Promise((resolve, reject) => {
			const cleanup = () => {
				socket.off("open", onOpen);
				socket.off("error", onError);
				socket.off("close", onFail);
			};
			const onOpen = () => {
				cleanup();
				resolve();
			};
			const onError = (error) => {
				cleanup();
				reject(error);
			};
			const onFail = () => {
				cleanup();
				reject(/* @__PURE__ */ new Error("socket closed before open"));
			};
			socket.once("open", onOpen);
			socket.once("error", onError);
			socket.once("close", onFail);
		});
	}
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws-connection-controller.js
var require_ws_connection_controller = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebSocketConnection = void 0;
	const error_1 = require_error$1();
	const EventEmitter_1 = require_EventEmitter();
	const sleep_1 = require_sleep();
	const ws_adapter_1 = require_ws_adapter();
	const ws_1 = require_ws$1();
	const ws_connection_1 = require_ws_connection();
	/** Shared connection lifecycle; public fields and event listeners remain on the binding. */
	var WebSocketConnection = class {
		constructor(owner, hooks, options) {
			this._isReconnecting = false;
			this._intentionallyClosed = false;
			this._closeCode = 1e3;
			this._closeReason = "OK";
			this._lastCloseCode = 1006;
			this._lastCloseReason = "";
			this._internalEvents = new EventEmitter_1.InternalEventEmitter();
			this._retryCount = 0;
			this._permanentClosed = false;
			this._backoff = new AbortController();
			this._owner = owner;
			this._hooks = hooks;
			this._reconnectOptions = options?.reconnect ?? null;
			this._sendQueue = new ws_1.SendQueue(options?.maxQueueSize ?? (hooks.manualQueue ? 0 : void 0), !hooks.manualQueue);
		}
		/** Whether the logical connection has emitted its terminal close. */
		get isClosed() {
			return this._permanentClosed;
		}
		takePending() {
			return this._sendQueue.drain();
		}
		flushPending() {
			if (this._intentionallyClosed || this._permanentClosed || this._isReconnecting || this._owner.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
				this._hooks.onError("cannot flush before the WebSocket is open");
				return;
			}
			this._flushSendQueue(true);
		}
		_hasAutomaticBacklog() {
			return !this._hooks.manualQueue && !this._isReconnecting && this._sendQueue.hasPending && !this._sendQueue.isFlushing && this._owner.socket.readyState === ws_adapter_1.ReadyState.OPEN;
		}
		send(event) {
			if (this._permanentClosed || this._hooks.manualQueue && this._intentionallyClosed) {
				this._hooks.onError("cannot send on a closed WebSocket");
				return;
			}
			if (this._hooks.manualQueue) {
				if (this._isReconnecting) {
					let accepted;
					try {
						accepted = this._sendQueue.enqueue(event);
					} catch (error) {
						this._hooks.onError("could not send data", error);
						return;
					}
					if (!accepted) this._hooks.onError("send queue is full, message discarded");
					return;
				}
				if (this._owner.socket.readyState === ws_adapter_1.ReadyState.CONNECTING) {
					this._hooks.onError("cannot send before the WebSocket is open");
					return;
				}
			}
			const flushBacklog = this._hasAutomaticBacklog();
			(0, ws_connection_1.sendWebSocketEvent)(this._owner, event, this._sendQueue, () => this._isReconnecting || flushBacklog, (message, cause) => this._hooks.onError(message, cause));
			if (flushBacklog && this._hasAutomaticBacklog()) this._flushSendQueue();
		}
		sendRaw(data) {
			if (this._permanentClosed || this._hooks.manualQueue && this._intentionallyClosed) {
				this._hooks.onError("cannot send on a closed WebSocket");
				return;
			}
			if (this._hooks.manualQueue && !this._isReconnecting && this._owner.socket.readyState === ws_adapter_1.ReadyState.CONNECTING) {
				this._hooks.onError("cannot send before the WebSocket is open");
				return;
			}
			const flushBacklog = this._hasAutomaticBacklog();
			(0, ws_connection_1.sendRawWebSocketData)(this._owner, data, this._sendQueue, () => this._isReconnecting || flushBacklog, (message, cause) => this._hooks.onError(message, cause));
			if (flushBacklog && this._hasAutomaticBacklog()) this._flushSendQueue();
		}
		close(props) {
			if (!this._owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			this._intentionallyClosed = true;
			this._closeCode = props?.code ?? 1e3;
			this._closeReason = props?.reason ?? "OK";
			this._cancelRefresh?.();
			this._backoff.abort();
			try {
				this._owner.socket.close(this._closeCode, this._closeReason);
			} catch (error) {
				try {
					this._hooks.onError("could not close the connection", error);
				} finally {
					if (this._hooks.manualQueue) try {
						const { socket } = this._owner;
						if (socket.terminate) socket.terminate();
						else socket.close();
					} finally {
						this._emitPermanentClose(this._closeCode, this._closeReason);
					}
				}
			}
		}
		iterate(options) {
			if (!this._owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			const maxBufferedEvents = (0, ws_1.getMaxBufferedEvents)(options);
			const queue = [];
			const resolvers = [];
			let queueHead = 0;
			let resolverHead = 0;
			let done = false;
			let failure;
			let currentSocket = this._owner.socket;
			const wakeResolver = () => {
				if (resolverHead >= resolvers.length) return;
				const resolver = resolvers[resolverHead];
				resolvers[resolverHead] = void 0;
				resolverHead += 1;
				if (resolverHead >= 64 && resolverHead * 2 >= resolvers.length) {
					resolvers.splice(0, resolverHead);
					resolverHead = 0;
				}
				resolver?.();
			};
			const push = (msg) => {
				if (done) return;
				if (maxBufferedEvents !== void 0 && queue.length - queueHead >= maxBufferedEvents) {
					failure = this._hooks.createError(`WebSocket stream exceeded maxBufferedEvents (${maxBufferedEvents})`);
					done = true;
					queue.length = 0;
					queueHead = 0;
					cleanup();
					flushResolvers();
					return;
				}
				queue.push(msg);
				wakeResolver();
			};
			const onEvent = (event) => {
				if (this._hooks.isErrorEvent(event)) return;
				push({
					type: "message",
					message: event
				});
			};
			const onRaw = (data) => {
				push({
					type: "raw",
					data
				});
			};
			const onEmitterError = (err) => {
				push({
					type: "error",
					error: err
				});
			};
			const onOpen = () => {
				push({ type: "open" });
			};
			const onReconnecting = (evt) => {
				push({
					type: "reconnecting",
					reconnect: evt
				});
			};
			const onReconnected = () => {
				push({ type: "reconnected" });
			};
			const flushResolvers = () => {
				while (resolverHead < resolvers.length) {
					const resolver = resolvers[resolverHead];
					resolvers[resolverHead] = void 0;
					resolverHead += 1;
					resolver?.();
				}
				resolvers.length = 0;
				resolverHead = 0;
			};
			const onClose = (code, reason, unsent) => {
				push({
					type: "close",
					code,
					reason,
					unsent
				});
				done = true;
				flushResolvers();
				cleanup();
			};
			const onSocketSwap = (_oldSocket, newSocket) => {
				if (currentSocket === newSocket) return;
				currentSocket.off("open", onOpen);
				newSocket.on("open", onOpen);
				currentSocket = newSocket;
			};
			const cleanup = () => {
				this._hooks.unsubscribe(onEvent, onRaw, onEmitterError);
				currentSocket.off("open", onOpen);
				this._internalEvents.off("close", onClose);
				this._internalEvents.off("socketSwap", onSocketSwap);
				this._internalEvents.off("reconnecting", onReconnecting);
				this._internalEvents.off("reconnected", onReconnected);
			};
			this._hooks.subscribe(onEvent, onRaw, onEmitterError);
			this._owner.socket.on("open", onOpen);
			this._internalEvents.on("close", onClose);
			this._internalEvents.on("socketSwap", onSocketSwap);
			this._internalEvents.on("reconnecting", onReconnecting);
			this._internalEvents.on("reconnected", onReconnected);
			if (done) cleanup();
			if (this._isReconnecting) push({
				type: "reconnecting",
				reconnect: {
					attempt: 0,
					maxAttempts: 0,
					delay: 0,
					closeCode: 0,
					parameters: void 0
				}
			});
			else switch (this._owner.socket.readyState) {
				case ws_adapter_1.ReadyState.CONNECTING:
					push({ type: "connecting" });
					break;
				case ws_adapter_1.ReadyState.OPEN:
					push({ type: "open" });
					break;
				case ws_adapter_1.ReadyState.CLOSING:
					push({ type: "closing" });
					break;
				case ws_adapter_1.ReadyState.CLOSED:
					push({
						type: "close",
						code: this._lastCloseCode,
						reason: this._lastCloseReason,
						unsent: this._sendQueue.drain()
					});
					done = true;
					cleanup();
			}
			const tryResolve = (res, reject) => {
				if (failure) reject(failure);
				else if (queueHead < queue.length) {
					const queued = queue[queueHead];
					queue[queueHead] = void 0;
					queueHead += 1;
					if (queueHead >= 64 && queueHead * 2 >= queue.length) {
						queue.splice(0, queueHead);
						queueHead = 0;
					}
					res({
						value: queued,
						done: false
					});
				} else if (done) res({
					value: void 0,
					done: true
				});
				else return false;
				return true;
			};
			const next = () => new Promise((resolve, reject) => {
				if (tryResolve(resolve, reject)) return;
				resolvers.push(() => {
					tryResolve(resolve, reject);
				});
			});
			return {
				next,
				return: () => {
					done = true;
					queue.length = 0;
					queueHead = 0;
					cleanup();
					flushResolvers();
					return Promise.resolve({
						value: void 0,
						done: true
					});
				},
				[Symbol.asyncIterator]() {
					return this;
				}
			};
		}
		connect(createSocket = (url) => this._hooks.createSocket(url), url = this._hooks.buildURL()) {
			this._owner.url = url;
			const socket = createSocket(this._owner.url);
			socket.on("message", (data, isBinary) => {
				if (socket === this._owner.socket) this._hooks.onMessage(data, isBinary);
			});
			socket.on("error", (err) => {
				if (socket !== this._owner.socket) return;
				this._hooks.onSocketError?.(socket, err);
				if (this._isReconnecting) return;
				this._hooks.onError(err.message, err);
			});
			socket.on("open", () => {
				if (socket !== this._owner.socket) return;
				if (!this._isReconnecting) this._flushSendQueue();
			});
			socket.on("close", (code, reason) => {
				if (socket !== this._owner.socket) return;
				if (!this._intentionallyClosed && this._canReconnect(code)) this._reconnect(code);
				else if (!this._isReconnecting) this._emitPermanentClose(code, reason);
			});
			return socket;
		}
		_canReconnect(code) {
			if (this._intentionallyClosed || this._permanentClosed) return false;
			if (!this._reconnectOptions) return false;
			if (this._reconnectOptions.maxRetries === 0) return false;
			if (!this._reconnectOptions.onReconnecting) return false;
			return this._hooks.shouldReconnect?.(code) ?? (0, ws_1.isRecoverableClose)(code);
		}
		_reportReconnectFailure(message, cause) {
			this._hooks.onError(message, this._hooks.manualQueue ? cause : void 0);
		}
		_abortReconnect(closeCode, cause) {
			if (this._canReconnect(closeCode)) return false;
			this._isReconnecting = false;
			try {
				if (!this._intentionallyClosed && !this._permanentClosed) this._reportReconnectFailure(`WebSocket reconnect aborted: non-recoverable close code ${closeCode}`, cause);
			} finally {
				this._emitPermanentClose(this._intentionallyClosed ? this._closeCode : closeCode, this._intentionallyClosed ? this._closeReason : "reconnect aborted");
			}
			return true;
		}
		_notifyReconnecting(options, initialEvent) {
			let reconnectingEvent = initialEvent;
			const { closeCode } = initialEvent;
			let overrides;
			try {
				overrides = options.onReconnecting(reconnectingEvent);
			} catch (error) {
				this._isReconnecting = false;
				try {
					this._hooks.onError("onReconnecting callback threw", error);
				} finally {
					this._emitPermanentClose(closeCode, "onReconnecting callback threw");
				}
				return false;
			}
			if (overrides && "abort" in overrides && overrides.abort) {
				this._isReconnecting = false;
				this._emitPermanentClose(closeCode, "reconnect aborted by handler");
				return false;
			}
			if (overrides && "parameters" in overrides) {
				this._hooks.parameters = overrides.parameters;
				reconnectingEvent = {
					...reconnectingEvent,
					parameters: this._hooks.parameters
				};
			}
			try {
				this._hooks.emitReconnecting(reconnectingEvent);
			} catch (error) {
				if (this._hooks.manualQueue) {
					this._isReconnecting = false;
					try {
						this._hooks.onError("onReconnecting callback threw", error);
					} finally {
						this._emitPermanentClose(closeCode, "onReconnecting callback threw");
					}
					return false;
				}
				try {
					this._hooks.onError("onReconnecting callback threw", error);
				} catch (reportingError) {
					this._isReconnecting = false;
					try {
						this._emitPermanentClose(closeCode, "onReconnecting callback threw");
					} catch {}
					throw reportingError;
				}
			}
			this._internalEvents._emit("reconnecting", reconnectingEvent);
			return true;
		}
		_hasRetryBudget(attempt, maximum) {
			return attempt <= maximum && (!this._hooks.lifetimeRetries || this._retryCount < maximum);
		}
		_nextRetryAttempt(attempt) {
			this._retryCount += 1;
			return this._hooks.lifetimeRetries ? this._retryCount : attempt;
		}
		async _reconnect(initialCloseCode) {
			let closeCode = initialCloseCode;
			if (!this._owner.socket) throw new error_1.OpenAIError("Internal error: failed to initialize socket. Please report this issue.");
			if (this._isReconnecting || !this._reconnectOptions) return;
			this._isReconnecting = true;
			const maxRetries = this._reconnectOptions.maxRetries ?? 5;
			const initialDelay = this._reconnectOptions.initialDelay ?? 500;
			const maxDelay = this._reconnectOptions.maxDelay ?? 8e3;
			let lastError;
			for (let attempt = 1; this._hasRetryBudget(attempt, maxRetries); attempt += 1) {
				const reportedAttempt = this._nextRetryAttempt(attempt);
				if (this._abortReconnect(closeCode, lastError)) return;
				const baseDelay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
				const jitter = .75 + Math.random() * .25;
				const actualDelay = Math.round(baseDelay * jitter);
				const reconnectingEvent = {
					attempt: reportedAttempt,
					maxAttempts: maxRetries,
					delay: actualDelay,
					closeCode,
					parameters: this._hooks.parameters ? { ...this._hooks.parameters } : void 0
				};
				if (!this._notifyReconnecting(this._reconnectOptions, reconnectingEvent)) return;
				if (this._abortReconnect(closeCode, lastError)) return;
				try {
					await (0, sleep_1.sleep)(actualDelay, this._backoff.signal);
				} catch {
					this._abortReconnect(closeCode, lastError);
					return;
				}
				if (this._abortReconnect(closeCode, lastError)) return;
				let closeCodePromise;
				const oldSocket = this._owner.socket;
				try {
					if (this._hooks.prepareReconnectSocket) {
						const url = this._hooks.buildURL();
						const canceled = new Promise((resolve) => {
							this._cancelRefresh = () => resolve(void 0);
						});
						let createSocket;
						try {
							createSocket = await Promise.race([this._hooks.prepareReconnectSocket(), canceled]);
						} finally {
							this._cancelRefresh = void 0;
						}
						if (!this._canReconnect(closeCode)) {
							this._isReconnecting = false;
							this._emitPermanentClose(this._closeCode, this._closeReason);
							return;
						}
						this._owner.socket = this.connect(createSocket, url);
					} else this._owner.socket = this.connect();
					closeCodePromise = new Promise((resolve) => {
						this._owner.socket.once("close", resolve);
					});
					await (0, ws_connection_1.waitForWebSocketOpen)(this._owner.socket);
				} catch (error) {
					if (this._intentionallyClosed) {
						if (this._isReconnecting) {
							this._isReconnecting = false;
							this._emitPermanentClose(this._closeCode, this._closeReason);
						}
						return;
					}
					lastError = error;
					if (closeCodePromise) closeCode = await closeCodePromise;
					continue;
				}
				this._internalEvents._emit("socketSwap", oldSocket, this._owner.socket);
				let flushed;
				try {
					flushed = this._flushSendQueue();
				} catch (observerError) {
					try {
						this._owner.socket.close();
					} catch {}
					this._isReconnecting = false;
					try {
						this._emitPermanentClose(this._intentionallyClosed ? this._closeCode : closeCode, this._intentionallyClosed ? this._closeReason : "reconnect interrupted by error observer");
					} catch {}
					throw observerError;
				}
				if (this._owner.socket.readyState !== ws_adapter_1.ReadyState.OPEN) {
					closeCode = await closeCodePromise;
					if (this._abortReconnect(closeCode, lastError)) return;
					continue;
				}
				if (!flushed) {
					try {
						this._owner.socket.close();
					} catch {}
					continue;
				}
				this._isReconnecting = false;
				try {
					this._hooks.emitReconnected();
				} finally {
					this._internalEvents._emit("reconnected");
				}
				return;
			}
			this._isReconnecting = false;
			try {
				this._reportReconnectFailure(`WebSocket reconnect failed after ${maxRetries} attempts (close code: ${closeCode})`, lastError);
			} finally {
				this._emitPermanentClose(closeCode, `reconnect failed after ${maxRetries} attempts`);
			}
		}
		_flushSendQueue(explicit = false) {
			if (this._hooks.manualQueue && !explicit) return true;
			return (0, ws_connection_1.flushWebSocketSendQueue)(this._owner, this._sendQueue, (message, cause) => this._hooks.onError(message, cause), this._hooks.requeueFailed === void 0 ? void 0 : { requeueFailed: this._hooks.requeueFailed });
		}
		/**
		* Emits the public `close` event with unsent messages and the internal
		* `close` event used by the async iterator.
		*/
		_emitPermanentClose(code, reason) {
			if (this._permanentClosed) return;
			this._permanentClosed = true;
			this._lastCloseCode = code;
			this._lastCloseReason = reason;
			const unsent = this._sendQueue.drain();
			this._internalEvents._emit("close", code, reason, unsent);
			this._hooks.emitClose(code, reason, unsent);
		}
	};
	exports.WebSocketConnection = WebSocketConnection;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/resources/responses/ws-base.js
var require_ws_base = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _ResponsesWSBase_instances;
	var _ResponsesWSBase_connection;
	var _ResponsesWSBase_onMessage;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWSBase = void 0;
	exports.getWebSocketEventBytes = getWebSocketEventBytes;
	exports.getWebSocketEventPayload = getWebSocketEventPayload;
	const tslib_1 = require_tslib();
	const internal_base_1 = require_internal_base();
	const ws_connection_controller_1 = require_ws_connection_controller();
	const ws_1 = require_ws$1();
	const webSocketEventPayloads = /* @__PURE__ */ new WeakMap();
	const webSocketEventBytes = /* @__PURE__ */ new WeakMap();
	/** Uses immutable wire size, or JSON accounting for a custom emitter. @internal */
	function getWebSocketEventBytes(event) {
		return webSocketEventBytes.get(event) ?? (0, ws_1.rawByteLength)(JSON.stringify(event));
	}
	/** Original JSON, available only during synchronous event notification.
	* @internal
	*/
	function getWebSocketEventPayload(event) {
		return webSocketEventPayloads.get(event);
	}
	var ResponsesWSBase = class extends internal_base_1.ResponsesEmitter {
		constructor(client, options) {
			super();
			_ResponsesWSBase_instances.add(this);
			_ResponsesWSBase_connection.set(this, void 0);
			this._client = client;
			this._parameters = void 0;
			const owner = this;
			tslib_1.__classPrivateFieldSet(this, _ResponsesWSBase_connection, new ws_connection_controller_1.WebSocketConnection(this, {
				buildURL: () => (0, internal_base_1.buildURL)(this._client, this._parameters ?? {}),
				createSocket: (url) => this._createSocket(url, this._authHeaders()),
				get parameters() {
					return owner._parameters;
				},
				set parameters(parameters) {
					owner._parameters = parameters;
				},
				isErrorEvent: (event) => event.type === "error",
				onMessage: (data, isBinary) => tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_instances, "m", _ResponsesWSBase_onMessage).call(this, data, isBinary),
				onError: (message, cause) => this._onError(null, message, cause),
				createError: (message) => new internal_base_1.WebSocketError(message, null),
				subscribe: (onEvent, onRaw, onError) => {
					this.on("event", onEvent);
					this.on("raw", onRaw);
					this.on("error", onError);
				},
				unsubscribe: (onEvent, onRaw, onError) => {
					this.off("event", onEvent);
					this.off("raw", onRaw);
					this.off("error", onError);
				},
				emitReconnecting: (event) => this._emit("reconnecting", event),
				emitReconnected: () => this._emit("reconnected"),
				emitClose: (code, reason, unsent) => this._emit("close", code, reason, unsent),
				onSocketError: ws_1.recordWebSocketError,
				requeueFailed: false,
				prepareReconnectSocket: () => this._prepareReconnectSocket()
			}, options), "f");
		}
		/** Establishes the initial WebSocket connection. */
		_connectInitial() {
			this.url = (0, internal_base_1.buildURL)(this._client, {});
			this.socket = tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_connection, "f").connect();
		}
		send(event) {
			tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_connection, "f").send(event);
		}
		sendRaw(data) {
			tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_connection, "f").sendRaw(data);
		}
		close(props) {
			tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_connection, "f").close(props);
		}
		/**
		* Returns an async iterator over WebSocket lifecycle and message events,
		* providing an alternative to the event-based `.on()` API.
		* The iterator will exit if the socket closes but exiting the iterator
		* does not close the socket.
		*
		* Pass `maxBufferedEvents` to limit queued records for this iterator, including
		* lifecycle events. Overflow discards its backlog and rejects `next()` with a
		* WebSocketError; the shared socket and other iterators remain active.
		* Omitted means unlimited. This is an event-count limit, not a byte limit.
		*
		* @example
		* ```ts
		* for await (const event of client.stream()) {
		*   switch (event.type) {
		*     case 'message':
		*       console.log('received:', event.message);
		*       break;
		*     case 'error':
		*       console.error(event.error);
		*       break;
		*     case 'close':
		*       console.log('connection closed');
		*       break;
		*   }
		* }
		* ```
		*/
		stream(options) {
			return options === void 0 ? this[Symbol.asyncIterator]() : this[Symbol.asyncIterator](options);
		}
		[(_ResponsesWSBase_connection = /* @__PURE__ */ new WeakMap(), _ResponsesWSBase_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)](options) {
			return tslib_1.__classPrivateFieldGet(this, _ResponsesWSBase_connection, "f").iterate(options);
		}
		_prepareReconnectSocket() {
			const authHeaders = this._authHeaders();
			return Promise.resolve((url) => this._createSocket(url, authHeaders));
		}
		_authHeaders(apiKey = this._client.apiKey) {
			return typeof apiKey === "string" && apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
		}
	};
	exports.ResponsesWSBase = ResponsesWSBase;
	_ResponsesWSBase_onMessage = function _ResponsesWSBase_onMessage(data, isBinary) {
		if (isBinary) {
			this._emit("raw", data);
			return;
		}
		const text = typeof data === "string" ? data : String(data);
		let event;
		try {
			event = JSON.parse(text);
		} catch {
			this._emit("raw", data);
			return;
		}
		if (event === null || typeof event !== "object" || Array.isArray(event) || !Object.prototype.hasOwnProperty.call(event, "type") || typeof event.type !== "string") {
			this._onError(null, "received invalid WebSocket event: expected an object with an own string type", void 0);
			return;
		}
		const eventType = event.type;
		const errorEvent = event.type === "error" ? event : void 0;
		if ((eventType === "raw" || eventType === "close" || eventType === "event" || eventType === "reconnecting" || eventType === "reconnected" || eventType === "open" || eventType === "error") && eventType !== "error") {
			this._onError(null, "received reserved WebSocket event type", void 0);
			return;
		}
		webSocketEventBytes.set(event, (0, ws_1.rawByteLength)(data));
		webSocketEventPayloads.set(event, text);
		try {
			this._emit("event", event);
		} finally {
			webSocketEventPayloads.delete(event);
		}
		if (errorEvent) this._onError(errorEvent);
		else this._emit(eventType, event);
	};
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/ws-credentials.js
var require_ws_credentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WebSocketCredentials = void 0;
	const error_1 = require_error$1();
	const realtime_credentials_1 = require_realtime_credentials();
	const ws_1 = require_ws$1();
	/**
	* Keep caller credential admission distinct from the hook's final provider-key transform.
	* The latter reuses captured base headers so no caller getters are reread after the refresh.
	*/
	function buildCredentialedWebSocketOptions(client, authHeaders, options, prepared) {
		if (prepared) return prepared.apiKey === void 0 ? (0, ws_1.mergeWebSocketAuthHeaders)(prepared.options, authHeaders, prepared.removedHeaders) : (0, ws_1.buildWebSocketOptions)(client, authHeaders, prepared.options, prepared.removedHeaders, true);
		if (!client._hasApiKeyProvider()) return (0, ws_1.buildWebSocketOptions)(client, authHeaders, options);
		const removedHeaders = /* @__PURE__ */ new Set();
		const provided = (0, ws_1.buildWebSocketOptions)(client, {}, options, removedHeaders);
		return (0, ws_1.snapshotWebSocketCredentials)(provided, ws_1.WEBSOCKET_METADATA_HEADERS) ? provided : (0, ws_1.buildWebSocketOptions)(client, authHeaders, provided, removedHeaders, true);
	}
	/**
	* Classify reconnect credentials without treating the previous SDK key as a caller override.
	* Capture routing and caller options before any asynchronous key refresh.
	*/
	function prepareWebSocketReconnect(client, socketOptions, initialAuthUsedAPIKey) {
		const removedHeaders = /* @__PURE__ */ new Set();
		const options = (0, ws_1.buildWebSocketOptions)(client, {}, socketOptions, removedHeaders);
		let authentication;
		if ((0, ws_1.snapshotWebSocketCredentials)(options, ws_1.WEBSOCKET_METADATA_HEADERS)) authentication = "provided";
		else if (removedHeaders.has("authorization") || options.headers?.["authorization"] !== void 0 || !initialAuthUsedAPIKey) authentication = "cached";
		else authentication = "refresh";
		return {
			options,
			removedHeaders,
			authentication
		};
	}
	/** Per-connection credential snapshots shared by Node WebSocket bindings. */
	var WebSocketCredentials = class {
		constructor(connectionName) {
			this.initialAuthUsedAPIKey = false;
			this.connectionName = connectionName;
		}
		get preparedAPIKey() {
			return this.prepared?.apiKey;
		}
		trackInitialHeaders(client, headers, hasSocket) {
			if (!hasSocket() && client._hasApiKeyProvider()) this.initialAPIKey = headers["Authorization"]?.slice(7);
		}
		usesAPIKey(client, headers) {
			const apiKey = this.initialAPIKey ?? (client._hasApiKeyProvider() ? Object.getOwnPropertyDescriptor(client, "apiKey")?.value : void 0);
			if (!apiKey) return false;
			return (0, ws_1.snapshotWebSocketCredentials)({ headers: Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, value?.includes(apiKey) ? value : ""])) }, ws_1.WEBSOCKET_METADATA_HEADERS);
		}
		build(client, authHeaders, options, initialAuthUsedAPIKey) {
			if (initialAuthUsedAPIKey !== void 0) {
				this.initialAuthUsedAPIKey = initialAuthUsedAPIKey;
				this.initialAPIKey = void 0;
			}
			const socketOptions = buildCredentialedWebSocketOptions(client, authHeaders, options, this.prepared);
			if (client._hasApiKeyProvider() && !authHeaders["Authorization"] && !(0, ws_1.snapshotWebSocketCredentials)(socketOptions, ws_1.WEBSOCKET_METADATA_HEADERS)) throw new error_1.OpenAIError(`Cannot open a ${this.connectionName} WebSocket with an unresolved function-based apiKey. Resolve it before constructing the WebSocket or provide explicit WebSocket credentials.`);
			return socketOptions;
		}
		async prepare(client, socketOptions, authHeaders, createSocket) {
			const { options, removedHeaders, authentication } = prepareWebSocketReconnect(client, socketOptions, this.initialAuthUsedAPIKey);
			const createPreparedSocket = (url, headers, apiKey) => {
				const previous = this.prepared;
				this.prepared = {
					options,
					removedHeaders,
					apiKey
				};
				try {
					return createSocket(url, apiKey === void 0 ? headers : authHeaders(apiKey));
				} finally {
					this.prepared = previous;
				}
			};
			if (authentication !== "refresh") {
				const headers = authentication === "provided" ? {} : authHeaders();
				return (url) => createPreparedSocket(url, headers);
			}
			const { commit } = await (0, realtime_credentials_1.resolveRealtimeAPIKey)(client, true);
			return (url) => createPreparedSocket(url, {}, commit());
		}
	};
	exports.WebSocketCredentials = WebSocketCredentials;
}));
// node_modules/.pnpm/openai@7.47.0_@aws-sdk+cred_33daae30d1dc2f3ab4c7fe2f318efdad/node_modules/openai/internal/responses-ws-credentials.js
var require_responses_ws_credentials = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWebSocketCredentials = void 0;
	const ws_credentials_1 = require_ws_credentials();
	/** Preserves the stable and beta Responses credential helper's constructor. */
	var ResponsesWebSocketCredentials = class extends ws_credentials_1.WebSocketCredentials {
		constructor() {
			super("Responses");
		}
	};
	exports.ResponsesWebSocketCredentials = ResponsesWebSocketCredentials;
}));
// packages/ai/src/transports/openai-responses-websocket.ts
var import_ws = (/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ResponsesWS = void 0;
	const WS = require_tslib().__importStar(require_ws$2());
	const ws_adapter_node_1 = require_ws_adapter_node();
	const ws_base_1 = require_ws_base();
	const responses_ws_credentials_1 = require_responses_ws_credentials();
	var ResponsesWS = class extends ws_base_1.ResponsesWSBase {
		constructor(client, options) {
			if (!WS?.WebSocket) throw new Error("ResponsesWS from \"openai/resources/responses/ws\" requires the \"ws\" package but it could not be loaded.");
			const { reconnect, maxQueueSize, ...wsOptions } = options ?? {};
			super(client, {
				reconnect,
				maxQueueSize
			});
			this._credentials = new responses_ws_credentials_1.ResponsesWebSocketCredentials();
			this._wsOptions = wsOptions;
			this._connectInitial();
		}
		_authHeaders(apiKey) {
			const headers = super._authHeaders(apiKey === void 0 ? this._credentials.preparedAPIKey : apiKey);
			this._credentials.trackInitialHeaders(this._client, headers, () => !!this.socket);
			return headers;
		}
		/**
		* Whether credentials passed to the Node transport use the SDK key.
		* The SDK recognizes its key, including copies and additions in credential headers.
		* Override and return true if your socket hook signs or otherwise irreversibly transforms it.
		* Explicit caller options and header removals still take precedence on reconnect.
		*/
		_usesSDKAPIKey(authHeaders) {
			return this._credentials.usesAPIKey(this._client, authHeaders);
		}
		_createSocket(url, authHeaders) {
			const capturedAuthHeaders = { ...authHeaders };
			const socketOptions = {
				maxPayload: 0,
				perMessageDeflate: false,
				...this._credentials.build(this._client, capturedAuthHeaders, this._wsOptions, !this.socket ? this._usesSDKAPIKey(capturedAuthHeaders) : void 0)
			};
			socketOptions.maxPayload ?? (socketOptions.maxPayload = 0);
			socketOptions.perMessageDeflate ?? (socketOptions.perMessageDeflate = false);
			return new ws_adapter_node_1.NodeWebSocket(new WS.WebSocket(url, socketOptions));
		}
		async _prepareReconnectSocket() {
			if (!this._client._hasApiKeyProvider()) return super._prepareReconnectSocket();
			return this._credentials.prepare(this._client, (0, ws_adapter_node_1.snapshotNodeWebSocketOptions)(this._wsOptions), (...args) => this._authHeaders(...args), (url, headers) => this._createSocket(url, headers));
		}
	};
	exports.ResponsesWS = ResponsesWS;
})))();
const SESSION_WEBSOCKET_CACHE_TTL_MS = 3e5;
const SESSION_WEBSOCKET_MAX_AGE_MS = 33e5;
const WEBSOCKET_OPEN_STATE = 1;
const websocketSessionCache = /* @__PURE__ */ new Map();
const degradedWebSocketConnections = /* @__PURE__ */ new Map();
function closeWebSocketSilently(socket, reason = "done") {
	try {
		socket.close({
			code: 1e3,
			reason
		});
	} catch {}
}
function invalidateOwnedWebSocketSession(cacheKey, entry, reason = "done") {
	if (entry.idleTimer) {
		clearTimeout(entry.idleTimer);
		entry.idleTimer = void 0;
	}
	closeWebSocketSilently(entry.socket, reason);
	entry.steeringContinuation?.steering.close(/* @__PURE__ */ new Error("Responses steering connection closed"));
	entry.steeringContinuation?.iterator.return?.().catch(() => void 0);
	entry.steeringContinuation = void 0;
	if (websocketSessionCache.get(cacheKey) === entry) websocketSessionCache.delete(cacheKey);
}
function scheduleSessionWebSocketExpiry(cacheKey, entry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = entry.owner.runInDetachedAsyncContext(() => setTimeout(() => {
		if (entry.busy) return;
		invalidateOwnedWebSocketSession(cacheKey, entry, "idle_timeout");
	}, SESSION_WEBSOCKET_CACHE_TTL_MS));
	entry.idleTimer.unref?.();
}
function markDegradedWebSocketConnection(key, owner, sessionId, cooldownMs) {
	if (cooldownMs === void 0 || !Number.isFinite(cooldownMs) || cooldownMs <= 0) return;
	const entry = {
		sessionId,
		owner,
		retryAt: Date.now() + cooldownMs,
		expiryTimer: owner.runInDetachedAsyncContext(() => setTimeout(() => {
			if (degradedWebSocketConnections.get(key) === entry) degradedWebSocketConnections.delete(key);
		}, cooldownMs))
	};
	entry.expiryTimer.unref?.();
	degradedWebSocketConnections.set(key, entry);
}
function prepareWebSocketConnection(client, headers) {
	if (!isOfficialOpenAIResponsesBaseUrl(client.baseURL)) throw new Error("OpenAI Responses WebSocket requires the official API endpoint");
	if (typeof client.apiKey !== "string" || client.apiKey.length === 0) throw new Error("OpenAI Responses WebSocket requires an API key");
	const owner = getAiTransportHost();
	const resolvedApiKey = owner.resolveSecretSentinel(client.apiKey);
	const resolvedHeaders = { ...omitNullRequestHeaders(resolveAiTransportHeaderSentinels(headers)) };
	for (const key of Object.keys(resolvedHeaders)) {
		const normalizedKey = key.toLowerCase();
		if (normalizedKey === "authorization" || normalizedKey === "traceparent") delete resolvedHeaders[key];
	}
	if (!resolvedApiKey) throw new Error("OpenAI Responses WebSocket requires a resolved API key");
	return {
		client: client.withOptions({
			apiKey: resolvedApiKey,
			fetch: void 0,
			logger: void 0
		}),
		headers: resolvedHeaders,
		owner,
		ownerId: getSessionResourceOwnerId(owner),
		identity: sha256Hex(JSON.stringify([
			resolvedApiKey,
			client.baseURL,
			Object.entries(resolvedHeaders).toSorted(([a], [b]) => a.localeCompare(b))
		]))
	};
}
function createWebSocket(connection, onError) {
	const socket = connection.owner.runInDetachedAsyncContext(() => new import_ws.ResponsesWS(connection.client, {
		headers: connection.headers,
		maxQueueSize: 1
	}));
	socket.on("error", () => onError(socket));
	return socket;
}
function createTransientWebSocketLease(connection) {
	const socket = createWebSocket(connection, (failedSocket) => closeWebSocketSilently(failedSocket, "transport_error"));
	return {
		socket,
		iterator: socket.stream(),
		reusedConnection: false,
		release: () => closeWebSocketSilently(socket)
	};
}
function createCachedWebSocketLease(cacheKey, entry, reusedConnection) {
	entry.busy = true;
	const steeringContinuation = entry.steeringContinuation;
	entry.steeringContinuation = void 0;
	return {
		socket: entry.socket,
		iterator: steeringContinuation?.iterator ?? entry.socket.stream(),
		entry,
		reusedConnection,
		steeringContinuation,
		release: (options = {}) => {
			const { keep } = options;
			if (!keep || entry.socket.socket.readyState !== WEBSOCKET_OPEN_STATE) {
				invalidateOwnedWebSocketSession(cacheKey, entry);
				return;
			}
			entry.busy = false;
			scheduleSessionWebSocketExpiry(cacheKey, entry);
		}
	};
}
function acquireWebSocket(params, connection) {
	if (params.mode === "websocket" || !params.sessionId) return createTransientWebSocketLease(connection);
	const cacheKey = `${connection.ownerId}\0${params.sessionId}\0${connection.identity}`;
	const cached = websocketSessionCache.get(cacheKey);
	if (cached) {
		if (cached.idleTimer) {
			clearTimeout(cached.idleTimer);
			cached.idleTimer = void 0;
		}
		if (cached.busy) return createTransientWebSocketLease(connection);
		const expired = Date.now() - cached.createdAt >= SESSION_WEBSOCKET_MAX_AGE_MS;
		if (!expired && cached.socket.socket.readyState === WEBSOCKET_OPEN_STATE) return createCachedWebSocketLease(cacheKey, cached, true);
		invalidateOwnedWebSocketSession(cacheKey, cached, expired ? "connection_age_limit" : "done");
	}
	const entry = {
		socket: createWebSocket(connection, (failedSocket) => {
			const failedEntry = websocketSessionCache.get(cacheKey);
			if (failedEntry?.socket === failedSocket) invalidateOwnedWebSocketSession(cacheKey, failedEntry, "transport_error");
			else closeWebSocketSilently(failedSocket, "transport_error");
		}),
		sessionId: params.sessionId,
		owner: connection.owner,
		busy: true,
		createdAt: Date.now()
	};
	websocketSessionCache.set(cacheKey, entry);
	return createCachedWebSocketLease(cacheKey, entry, false);
}
function sanitizeWebSocketRequest(request) {
	const { stream: _stream, background: _background, ...websocketRequest } = request;
	return websocketRequest;
}
async function nextWebSocketMessage(iterator, signal) {
	if (signal?.aborted) throw transportAbortError(signal);
	return await racePromiseWithAbortSignal(iterator.next(), signal, transportAbortError);
}
function readServerEvent(message) {
	if (message.type === "message") return message.message;
	if (message.type === "error") throw parseOpenAIResponsesWebSocketServerError(message.error) ?? new Error("OpenAI Responses WebSocket transport failed", { cause: message.error });
	if (message.type === "close") throw new Error(`OpenAI Responses WebSocket closed before completion (code ${message.code})`);
}
function createOpenAIResponsesWebSocketStream(params) {
	const connection = prepareWebSocketConnection(params.client, params.headers);
	let fullRequest = sanitizeWebSocketRequest(params.request);
	const requestModel = typeof fullRequest.model === "string" ? fullRequest.model : "";
	const degradationKey = `${connection.ownerId}\0${params.sessionId ?? ""}\0${connection.identity}\0${requestModel}`;
	const degraded = degradedWebSocketConnections.get(degradationKey);
	if (degraded && degraded.retryAt > Date.now()) throw new OpenAIResponsesWebSocketPreDispatchError(/* @__PURE__ */ new Error("OpenAI Responses WebSocket is cooling down after a transport failure"));
	if (degraded) clearTimeout(degraded.expiryTimer);
	degradedWebSocketConnections.delete(degradationKey);
	const markDegraded = () => markDegradedWebSocketConnection(degradationKey, connection.owner, params.sessionId, params.degradeCooldownMs);
	let lease;
	try {
		lease = acquireWebSocket(params, connection);
	} catch (error) {
		markDegraded();
		throw new OpenAIResponsesWebSocketPreDispatchError(error);
	}
	let prepared;
	let previousContinuation;
	const resumedSteering = lease.steeringContinuation;
	const steeringMode = resumedSteering ? resumedSteering.requiresInput ? "required-input" : "automatic" : void 0;
	try {
		const continuation = previousContinuation = lease.entry?.continuation;
		if (continuation && lease.entry) {
			lease.entry.continuation = void 0;
			prepared = resolveResponsesContinuationRequest(continuation, fullRequest, steeringMode);
		} else {
			fullRequest = params.restoreRequest?.(fullRequest) ?? fullRequest;
			prepared = {
				request: fullRequest,
				continuationStatus: lease.entry ? "no_previous_response" : "socket_not_cached"
			};
		}
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw error;
	}
	let streamStarted = false;
	let terminalResponse;
	let terminalReceived = false;
	let released = false;
	let retainIterator = false;
	let deferredInput = false;
	let inputReplay;
	if (resumedSteering) try {
		if (prepared.continuationStatus !== "continued" || !prepared.request.previous_response_id) throw new Error("Responses steering continuation changed its request or history");
		const input = omitAcceptedSteering(prepared.request.input ?? [], resumedSteering.acceptedInput);
		if (!resumedSteering.requiresInput && (stableStringify(fullRequest.instructions) !== stableStringify(resumedSteering.instructions) || stableStringify(fullRequest.tools) !== stableStringify(resumedSteering.tools))) throw new Error("Responses automatic steering continuation cannot change instructions or tools");
		const baseline = prepared.fullRequest ?? fullRequest;
		const priorLength = (baseline.input?.length ?? 0) - (prepared.request.input?.length ?? 0);
		const fingerprints = input.map(responsesInputFingerprint);
		if (fingerprints.length > 0) inputReplay = {
			afterResponseId: prepared.request.previous_response_id,
			before: resumedSteering.requiresInput ? fingerprints : [],
			after: resumedSteering.requiresInput ? [] : fingerprints
		};
		const delivered = resumedSteering.requiresInput ? input : [];
		prepared.fullRequest = {
			...baseline,
			input: [
				...(baseline.input ?? []).slice(0, priorLength),
				...resumedSteering.acceptedInput,
				...delivered
			]
		};
		prepared.request = {
			...prepared.request,
			input: delivered
		};
		deferredInput = !resumedSteering.requiresInput && input.length > 0;
	} catch (error) {
		lease.iterator.return?.().catch(() => void 0);
		lease.release({ keep: false });
		throw new OpenAIResponsesWebSocketPostDispatchError(error);
	}
	const steering = lease.entry && params.onActiveResponse && params.steeringInput ? createResponsesSteering({
		onActiveResponse: params.onActiveResponse,
		toInput: params.steeringInput,
		send: (event) => lease.socket.sendRaw(JSON.stringify(event)),
		needsContinuation: deferredInput,
		assertActive: () => {
			if (released || terminalReceived || params.signal?.aborted) throw new Error("Responses steering is no longer active");
		}
	}) : void 0;
	const finish = ({ keep = true } = {}) => {
		if (released) return;
		released = true;
		if (keep && lease.entry && terminalResponse) lease.entry.continuation = recordResponsesContinuationState(previousContinuation, prepared.fullRequest ?? fullRequest, terminalResponse, previousContinuation?.lastResponseId === prepared.request.previous_response_id);
		lease.release({ keep });
	};
	return {
		stream: { async *[Symbol.asyncIterator]() {
			if (streamStarted) throw new Error("OpenAI Responses WebSocket stream can only be consumed once");
			streamStarted = true;
			const iterator = lease.iterator;
			let requestDispatched = false;
			try {
				if (params.signal?.aborted) throw transportAbortError(params.signal);
				if (resumedSteering) {
					requestDispatched = true;
					if (resumedSteering.requiresInput) lease.socket.send({
						...prepared.request,
						type: "response.create"
					});
				}
				for (;;) {
					const buffered = resumedSteering?.buffered.shift();
					const next = buffered ? {
						value: buffered,
						done: false
					} : await nextWebSocketMessage(iterator, params.signal);
					if (next.done) throw new Error("OpenAI Responses WebSocket closed before a terminal response event");
					if (next.value.type === "open") {
						if (!requestDispatched) {
							requestDispatched = true;
							lease.socket.send({
								...prepared.request,
								type: "response.create"
							});
						}
						continue;
					}
					const event = readServerEvent(next.value);
					if (!event) continue;
					if (isRecord(event) && typeof event.type === "string" && event.type.startsWith("response.steer.")) {
						if ((isRecord(event.steer) && event.steer.previous_response_id === steering?.responseId ? steering : resumedSteering?.steering ?? steering)?.handle(event)) continue;
					}
					steering?.handle(event);
					if (event.type === "response.completed") terminalResponse = event.response;
					terminalReceived = isResponsesTerminalEventType(event.type);
					if (terminalReceived) {
						steering?.seal();
						if (event.type === "response.failed") steering?.close(/* @__PURE__ */ new Error("Responses failed before steering could be applied"));
						const continuationBuffer = [];
						for (;;) {
							if (!steering?.pending) break;
							const acknowledgement = await nextWebSocketMessage(iterator, params.signal);
							if (acknowledgement.done) throw new Error("Responses closed before acknowledging steering");
							const acknowledgedEvent = readServerEvent(acknowledgement.value);
							if (!steering.handle(acknowledgedEvent)) continuationBuffer.push(acknowledgement.value);
						}
						const acceptedInput = steering?.acceptedInput ?? [];
						const isSteered = event.type === "response.incomplete" && isRecord(event.response.incomplete_details) && event.response.incomplete_details.reason === "steered";
						if (lease.entry && steering && acceptedInput.length > 0 && (event.type === "response.completed" || isSteered)) {
							if (event.type === "response.incomplete") terminalResponse = event.response;
							lease.entry.steeringContinuation = {
								iterator,
								buffered: continuationBuffer,
								acceptedInput,
								requiresInput: (terminalResponse?.output ?? []).some((item) => (item.type === "function_call" || item.type === "custom_tool_call") && !(isRecord(item) && item.async === true) || item.type === "mcp_approval_request"),
								steering,
								instructions: fullRequest.instructions,
								tools: fullRequest.tools
							};
							retainIterator = true;
							if (isSteered) {
								yield {
									...event,
									type: "response.completed",
									response: {
										...event.response,
										status: "completed",
										incomplete_details: null
									}
								};
								return;
							}
						}
					}
					yield event;
					if (terminalReceived) {
						degradedWebSocketConnections.delete(degradationKey);
						return;
					}
				}
			} catch (error) {
				const steeringDispatched = Boolean(steering?.pending || steering?.acceptedInput.length || resumedSteering);
				steering?.close(error instanceof Error ? error : /* @__PURE__ */ new Error("Responses steering failed"));
				if (lease.entry) lease.entry.continuation = void 0;
				const safeRetry = error instanceof OpenAIResponsesWebSocketSafeRetryError && !steeringDispatched;
				if (!params.callerSignal?.aborted && !safeRetry) markDegraded();
				if (!requestDispatched && !params.signal?.aborted) throw new OpenAIResponsesWebSocketPreDispatchError(error);
				if (!requestDispatched || params.callerSignal?.aborted || safeRetry) throw error;
				throw new OpenAIResponsesWebSocketPostDispatchError(error);
			} finally {
				steering?.seal();
				if (!retainIterator) {
					steering?.close(/* @__PURE__ */ new Error("Responses stream ended before steering was confirmed"));
					await iterator.return?.().catch(() => void 0);
				}
				if (!terminalReceived) finish({ keep: false });
			}
		} },
		request: prepared.request,
		fullRequest: prepared.fullRequest ?? fullRequest,
		reusedConnection: lease.reusedConnection,
		continuationStatus: prepared.continuationStatus,
		inputReplay,
		get hasActiveResponse() {
			return Boolean(steering?.responseId || resumedSteering);
		},
		finish
	};
}
function closeOpenAIResponsesWebSocketSessions(sessionId, owner) {
	for (const [cacheKey, entry] of websocketSessionCache) {
		if (owner && entry.owner !== owner || sessionId && entry.sessionId !== sessionId) continue;
		invalidateOwnedWebSocketSession(cacheKey, entry, "session_cleanup");
	}
	for (const [key, entry] of degradedWebSocketConnections) if ((!owner || entry.owner === owner) && (!sessionId || entry.sessionId === sessionId)) {
		clearTimeout(entry.expiryTimer);
		degradedWebSocketConnections.delete(key);
	}
}
registerSessionResourceCleanup(closeOpenAIResponsesWebSocketSessions);
export { createOpenAIResponsesWebSocketStream };
