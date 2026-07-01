import { i as __require, t as __commonJSMin } from "./chunk-CNf5ZN-e.js";
//#region node_modules/@protobufjs/aspromise/index.js
var require_aspromise = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = asPromise;
	/**
	* Callback as used by {@link util.asPromise}.
	* @typedef asPromiseCallback
	* @type {function}
	* @param {Error|null} error Error, if any
	* @param {...*} params Additional arguments
	* @returns {undefined}
	*/
	/**
	* Returns a promise from a node-style callback function.
	* @memberof util
	* @param {asPromiseCallback} fn Function to call
	* @param {*} ctx Function context
	* @param {...*} params Function arguments
	* @returns {Promise<*>} Promisified function
	*/
	function asPromise(fn, ctx) {
		var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
		while (index < arguments.length) params[offset++] = arguments[index++];
		return new Promise(function executor(resolve, reject) {
			params[offset] = function callback(err) {
				if (pending) {
					pending = false;
					if (err) reject(err);
					else {
						var params = new Array(arguments.length - 1), offset = 0;
						while (offset < params.length) params[offset++] = arguments[offset];
						resolve.apply(null, params);
					}
				}
			};
			try {
				fn.apply(ctx || null, params);
			} catch (err) {
				if (pending) {
					pending = false;
					reject(err);
				}
			}
		});
	}
}));
//#endregion
//#region node_modules/@protobufjs/base64/index.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* A minimal base64 implementation for number arrays.
	* @memberof util
	* @namespace
	*/
	var base64 = exports;
	/**
	* Calculates the byte length of a base64 encoded string.
	* @param {string} string Base64 encoded string
	* @returns {number} Byte length
	*/
	base64.length = function length(string) {
		var p = string.length;
		if (!p) return 0;
		var n = 0;
		while (--p % 4 > 1 && string.charAt(p) === "=") ++n;
		return Math.ceil(string.length * 3) / 4 - n;
	};
	var b64 = new Array(64);
	var s64 = new Array(123);
	for (var i = 0; i < 64;) s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
	/**
	* Encodes a buffer to a base64 encoded string.
	* @param {Uint8Array} buffer Source buffer
	* @param {number} start Source start
	* @param {number} end Source end
	* @returns {string} Base64 encoded string
	*/
	base64.encode = function encode(buffer, start, end) {
		var parts = null, chunk = [];
		var i = 0, j = 0, t;
		while (start < end) {
			var b = buffer[start++];
			switch (j) {
				case 0:
					chunk[i++] = b64[b >> 2];
					t = (b & 3) << 4;
					j = 1;
					break;
				case 1:
					chunk[i++] = b64[t | b >> 4];
					t = (b & 15) << 2;
					j = 2;
					break;
				case 2:
					chunk[i++] = b64[t | b >> 6];
					chunk[i++] = b64[b & 63];
					j = 0;
					break;
			}
			if (i > 8191) {
				(parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
				i = 0;
			}
		}
		if (j) {
			chunk[i++] = b64[t];
			chunk[i++] = 61;
			if (j === 1) chunk[i++] = 61;
		}
		if (parts) {
			if (i) parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
			return parts.join("");
		}
		return String.fromCharCode.apply(String, chunk.slice(0, i));
	};
	var invalidEncoding = "invalid encoding";
	/**
	* Decodes a base64 encoded string to a buffer.
	* @param {string} string Source string
	* @param {Uint8Array} buffer Destination buffer
	* @param {number} offset Destination offset
	* @returns {number} Number of bytes written
	* @throws {Error} If encoding is invalid
	*/
	base64.decode = function decode(string, buffer, offset) {
		var start = offset;
		var j = 0, t;
		for (var i = 0; i < string.length;) {
			var c = string.charCodeAt(i++);
			if (c === 61 && j > 1) break;
			if ((c = s64[c]) === void 0) throw Error(invalidEncoding);
			switch (j) {
				case 0:
					t = c;
					j = 1;
					break;
				case 1:
					buffer[offset++] = t << 2 | (c & 48) >> 4;
					t = c;
					j = 2;
					break;
				case 2:
					buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
					t = c;
					j = 3;
					break;
				case 3:
					buffer[offset++] = (t & 3) << 6 | c;
					j = 0;
					break;
			}
		}
		if (j === 1) throw Error(invalidEncoding);
		return offset - start;
	};
	/**
	* Tests if the specified string appears to be base64 encoded.
	* @param {string} string String to test
	* @returns {boolean} `true` if probably base64 encoded, otherwise false
	*/
	base64.test = function test(string) {
		return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
	};
}));
//#endregion
//#region node_modules/@protobufjs/eventemitter/index.js
var require_eventemitter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = EventEmitter;
	/**
	* Constructs a new event emitter instance.
	* @classdesc A minimal event emitter.
	* @memberof util
	* @constructor
	*/
	function EventEmitter() {
		/**
		* Registered listeners.
		* @type {Object.<string,*>}
		* @private
		*/
		this._listeners = Object.create(null);
	}
	/**
	* Event listener as used by {@link util.EventEmitter}.
	* @typedef EventEmitterListener
	* @type {function}
	* @param {...*} args Arguments
	* @returns {undefined}
	*/
	/**
	* Registers an event listener.
	* @param {string} evt Event name
	* @param {EventEmitterListener} fn Listener
	* @param {*} [ctx] Listener context
	* @returns {this} `this`
	*/
	EventEmitter.prototype.on = function on(evt, fn, ctx) {
		(this._listeners[evt] || (this._listeners[evt] = [])).push({
			fn,
			ctx: ctx || this
		});
		return this;
	};
	/**
	* Removes an event listener or any matching listeners if arguments are omitted.
	* @param {string} [evt] Event name. Removes all listeners if omitted.
	* @param {EventEmitterListener} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
	* @returns {this} `this`
	*/
	EventEmitter.prototype.off = function off(evt, fn) {
		if (evt === void 0) this._listeners = Object.create(null);
		else if (fn === void 0) this._listeners[evt] = [];
		else {
			var listeners = this._listeners[evt];
			if (!listeners) return this;
			for (var i = 0; i < listeners.length;) if (listeners[i].fn === fn) listeners.splice(i, 1);
			else ++i;
		}
		return this;
	};
	/**
	* Emits an event by calling its listeners with the specified arguments.
	* @param {string} evt Event name
	* @param {...*} args Arguments
	* @returns {this} `this`
	*/
	EventEmitter.prototype.emit = function emit(evt) {
		var listeners = this._listeners[evt];
		if (listeners) {
			var args = [], i = 1;
			for (; i < arguments.length;) args.push(arguments[i++]);
			for (i = 0; i < listeners.length;) listeners[i].fn.apply(listeners[i++].ctx, args);
		}
		return this;
	};
}));
//#endregion
//#region node_modules/@protobufjs/float/index.js
var require_float = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = factory(factory);
	/**
	* Reads / writes floats / doubles from / to buffers.
	* @name util.float
	* @namespace
	*/
	/**
	* Writes a 32 bit float to a buffer using little endian byte order.
	* @name util.float.writeFloatLE
	* @function
	* @param {number} val Value to write
	* @param {Uint8Array} buf Target buffer
	* @param {number} pos Target buffer offset
	* @returns {undefined}
	*/
	/**
	* Writes a 32 bit float to a buffer using big endian byte order.
	* @name util.float.writeFloatBE
	* @function
	* @param {number} val Value to write
	* @param {Uint8Array} buf Target buffer
	* @param {number} pos Target buffer offset
	* @returns {undefined}
	*/
	/**
	* Reads a 32 bit float from a buffer using little endian byte order.
	* @name util.float.readFloatLE
	* @function
	* @param {Uint8Array} buf Source buffer
	* @param {number} pos Source buffer offset
	* @returns {number} Value read
	*/
	/**
	* Reads a 32 bit float from a buffer using big endian byte order.
	* @name util.float.readFloatBE
	* @function
	* @param {Uint8Array} buf Source buffer
	* @param {number} pos Source buffer offset
	* @returns {number} Value read
	*/
	/**
	* Writes a 64 bit double to a buffer using little endian byte order.
	* @name util.float.writeDoubleLE
	* @function
	* @param {number} val Value to write
	* @param {Uint8Array} buf Target buffer
	* @param {number} pos Target buffer offset
	* @returns {undefined}
	*/
	/**
	* Writes a 64 bit double to a buffer using big endian byte order.
	* @name util.float.writeDoubleBE
	* @function
	* @param {number} val Value to write
	* @param {Uint8Array} buf Target buffer
	* @param {number} pos Target buffer offset
	* @returns {undefined}
	*/
	/**
	* Reads a 64 bit double from a buffer using little endian byte order.
	* @name util.float.readDoubleLE
	* @function
	* @param {Uint8Array} buf Source buffer
	* @param {number} pos Source buffer offset
	* @returns {number} Value read
	*/
	/**
	* Reads a 64 bit double from a buffer using big endian byte order.
	* @name util.float.readDoubleBE
	* @function
	* @param {Uint8Array} buf Source buffer
	* @param {number} pos Source buffer offset
	* @returns {number} Value read
	*/
	function factory(exports$4) {
		if (typeof Float32Array !== "undefined") (function() {
			var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
			function writeFloat_f32_cpy(val, buf, pos) {
				f32[0] = val;
				buf[pos] = f8b[0];
				buf[pos + 1] = f8b[1];
				buf[pos + 2] = f8b[2];
				buf[pos + 3] = f8b[3];
			}
			function writeFloat_f32_rev(val, buf, pos) {
				f32[0] = val;
				buf[pos] = f8b[3];
				buf[pos + 1] = f8b[2];
				buf[pos + 2] = f8b[1];
				buf[pos + 3] = f8b[0];
			}
			/* istanbul ignore next */
			exports$4.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
			/* istanbul ignore next */
			exports$4.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
			function readFloat_f32_cpy(buf, pos) {
				f8b[0] = buf[pos];
				f8b[1] = buf[pos + 1];
				f8b[2] = buf[pos + 2];
				f8b[3] = buf[pos + 3];
				return f32[0];
			}
			function readFloat_f32_rev(buf, pos) {
				f8b[3] = buf[pos];
				f8b[2] = buf[pos + 1];
				f8b[1] = buf[pos + 2];
				f8b[0] = buf[pos + 3];
				return f32[0];
			}
			/* istanbul ignore next */
			exports$4.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
			/* istanbul ignore next */
			exports$4.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
		})();
		else (function() {
			function writeFloat_ieee754(writeUint, val, buf, pos) {
				var sign = val < 0 ? 1 : 0;
				if (sign) val = -val;
				if (val === 0) writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos);
				else if (isNaN(val)) writeUint(2143289344, buf, pos);
				else if (val > 34028234663852886e22) writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
				else if (val < 11754943508222875e-54) writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
				else {
					var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
					writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
				}
			}
			exports$4.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
			exports$4.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
			function readFloat_ieee754(readUint, buf, pos) {
				var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
				return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
			}
			exports$4.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
			exports$4.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
		})();
		if (typeof Float64Array !== "undefined") (function() {
			var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
			function writeDouble_f64_cpy(val, buf, pos) {
				f64[0] = val;
				buf[pos] = f8b[0];
				buf[pos + 1] = f8b[1];
				buf[pos + 2] = f8b[2];
				buf[pos + 3] = f8b[3];
				buf[pos + 4] = f8b[4];
				buf[pos + 5] = f8b[5];
				buf[pos + 6] = f8b[6];
				buf[pos + 7] = f8b[7];
			}
			function writeDouble_f64_rev(val, buf, pos) {
				f64[0] = val;
				buf[pos] = f8b[7];
				buf[pos + 1] = f8b[6];
				buf[pos + 2] = f8b[5];
				buf[pos + 3] = f8b[4];
				buf[pos + 4] = f8b[3];
				buf[pos + 5] = f8b[2];
				buf[pos + 6] = f8b[1];
				buf[pos + 7] = f8b[0];
			}
			/* istanbul ignore next */
			exports$4.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
			/* istanbul ignore next */
			exports$4.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
			function readDouble_f64_cpy(buf, pos) {
				f8b[0] = buf[pos];
				f8b[1] = buf[pos + 1];
				f8b[2] = buf[pos + 2];
				f8b[3] = buf[pos + 3];
				f8b[4] = buf[pos + 4];
				f8b[5] = buf[pos + 5];
				f8b[6] = buf[pos + 6];
				f8b[7] = buf[pos + 7];
				return f64[0];
			}
			function readDouble_f64_rev(buf, pos) {
				f8b[7] = buf[pos];
				f8b[6] = buf[pos + 1];
				f8b[5] = buf[pos + 2];
				f8b[4] = buf[pos + 3];
				f8b[3] = buf[pos + 4];
				f8b[2] = buf[pos + 5];
				f8b[1] = buf[pos + 6];
				f8b[0] = buf[pos + 7];
				return f64[0];
			}
			/* istanbul ignore next */
			exports$4.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
			/* istanbul ignore next */
			exports$4.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
		})();
		else (function() {
			function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
				var sign = val < 0 ? 1 : 0;
				if (sign) val = -val;
				if (val === 0) {
					writeUint(0, buf, pos + off0);
					writeUint(1 / val > 0 ? 0 : 2147483648, buf, pos + off1);
				} else if (isNaN(val)) {
					writeUint(0, buf, pos + off0);
					writeUint(2146959360, buf, pos + off1);
				} else if (val > 17976931348623157e292) {
					writeUint(0, buf, pos + off0);
					writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
				} else {
					var mantissa;
					if (val < 22250738585072014e-324) {
						mantissa = val / 5e-324;
						writeUint(mantissa >>> 0, buf, pos + off0);
						writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
					} else {
						var exponent = Math.floor(Math.log(val) / Math.LN2);
						if (exponent === 1024) exponent = 1023;
						mantissa = val * Math.pow(2, -exponent);
						writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
						writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
					}
				}
			}
			exports$4.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
			exports$4.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
			function readDouble_ieee754(readUint, off0, off1, buf, pos) {
				var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
				var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
				return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
			}
			exports$4.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
			exports$4.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
		})();
		return exports$4;
	}
	function writeUintLE(val, buf, pos) {
		buf[pos] = val & 255;
		buf[pos + 1] = val >>> 8 & 255;
		buf[pos + 2] = val >>> 16 & 255;
		buf[pos + 3] = val >>> 24;
	}
	function writeUintBE(val, buf, pos) {
		buf[pos] = val >>> 24;
		buf[pos + 1] = val >>> 16 & 255;
		buf[pos + 2] = val >>> 8 & 255;
		buf[pos + 3] = val & 255;
	}
	function readUintLE(buf, pos) {
		return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
	}
	function readUintBE(buf, pos) {
		return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
	}
}));
//#endregion
//#region node_modules/@protobufjs/inquire/index.js
var require_inquire = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = inquire;
	/**
	* Requires a module only if available.
	* @memberof util
	* @param {string} moduleName Module to require
	* @returns {?Object} Required module if available and not empty, otherwise `null`
	* @deprecated Legacy optional require helper. Will be removed in a future release.
	*/
	function inquire(moduleName) {
		try {
			if (typeof __require !== "function") return null;
			var mod = __require(moduleName);
			if (mod && (mod.length || Object.keys(mod).length)) return mod;
			return null;
		} catch (err) {
			return null;
		}
	}
}));
//#endregion
//#region node_modules/@protobufjs/utf8/index.js
var require_utf8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* A minimal UTF8 implementation for number arrays.
	* @memberof util
	* @namespace
	*/
	var utf8 = exports, replacementChar = "�";
	/**
	* Calculates the UTF8 byte length of a string.
	* @param {string} string String
	* @returns {number} Byte length
	*/
	utf8.length = function utf8_length(string) {
		var len = 0, c = 0;
		for (var i = 0; i < string.length; ++i) {
			c = string.charCodeAt(i);
			if (c < 128) len += 1;
			else if (c < 2048) len += 2;
			else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
				++i;
				len += 4;
			} else len += 3;
		}
		return len;
	};
	/**
	* Reads UTF8 bytes as a string.
	* @param {Uint8Array} buffer Source buffer
	* @param {number} start Source start
	* @param {number} end Source end
	* @returns {string} String read
	*/
	utf8.read = function utf8_read(buffer, start, end) {
		if (end - start < 1) return "";
		var str = "";
		for (var i = start; i < end;) {
			var t = buffer[i++];
			if (t <= 127) str += String.fromCharCode(t);
			else if (t >= 192 && t < 224) {
				var c2 = (t & 31) << 6 | buffer[i++] & 63;
				str += c2 >= 128 ? String.fromCharCode(c2) : replacementChar;
			} else if (t >= 224 && t < 240) {
				var c3 = (t & 15) << 12 | (buffer[i++] & 63) << 6 | buffer[i++] & 63;
				str += c3 >= 2048 ? String.fromCharCode(c3) : replacementChar;
			} else if (t >= 240) {
				var t2 = (t & 7) << 18 | (buffer[i++] & 63) << 12 | (buffer[i++] & 63) << 6 | buffer[i++] & 63;
				if (t2 < 65536 || t2 > 1114111) str += replacementChar;
				else {
					t2 -= 65536;
					str += String.fromCharCode(55296 + (t2 >> 10));
					str += String.fromCharCode(56320 + (t2 & 1023));
				}
			}
		}
		return str;
	};
	/**
	* Writes a string as UTF8 bytes.
	* @param {string} string Source string
	* @param {Uint8Array} buffer Destination buffer
	* @param {number} offset Destination offset
	* @returns {number} Bytes written
	*/
	utf8.write = function utf8_write(string, buffer, offset) {
		var start = offset, c1, c2;
		for (var i = 0; i < string.length; ++i) {
			c1 = string.charCodeAt(i);
			if (c1 < 128) buffer[offset++] = c1;
			else if (c1 < 2048) {
				buffer[offset++] = c1 >> 6 | 192;
				buffer[offset++] = c1 & 63 | 128;
			} else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
				c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
				++i;
				buffer[offset++] = c1 >> 18 | 240;
				buffer[offset++] = c1 >> 12 & 63 | 128;
				buffer[offset++] = c1 >> 6 & 63 | 128;
				buffer[offset++] = c1 & 63 | 128;
			} else {
				buffer[offset++] = c1 >> 12 | 224;
				buffer[offset++] = c1 >> 6 & 63 | 128;
				buffer[offset++] = c1 & 63 | 128;
			}
		}
		return offset - start;
	};
}));
//#endregion
//#region node_modules/@protobufjs/pool/index.js
var require_pool = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = pool;
	/**
	* An allocator as used by {@link util.pool}.
	* @typedef PoolAllocator
	* @type {function}
	* @param {number} size Buffer size
	* @returns {Uint8Array} Buffer
	*/
	/**
	* A slicer as used by {@link util.pool}.
	* @typedef PoolSlicer
	* @type {function}
	* @param {number} start Start offset
	* @param {number} end End offset
	* @returns {Uint8Array} Buffer slice
	* @this {Uint8Array}
	*/
	/**
	* A general purpose buffer pool.
	* @memberof util
	* @function
	* @param {PoolAllocator} alloc Allocator
	* @param {PoolSlicer} slice Slicer
	* @param {number} [size=8192] Slab size
	* @returns {PoolAllocator} Pooled allocator
	*/
	function pool(alloc, slice, size) {
		var SIZE = size || 8192;
		var MAX = SIZE >>> 1;
		var slab = null;
		var offset = SIZE;
		return function pool_alloc(size) {
			if (size < 1 || size > MAX) return alloc(size);
			if (offset + size > SIZE) {
				slab = alloc(SIZE);
				offset = 0;
			}
			var buf = slice.call(slab, offset, offset += size);
			if (offset & 7) offset = (offset | 7) + 1;
			return buf;
		};
	}
}));
//#endregion
//#region node_modules/protobufjs/src/util/longbits.js
var require_longbits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = LongBits;
	var util = require_minimal();
	/**
	* Constructs new long bits.
	* @classdesc Helper class for working with the low and high bits of a 64 bit value.
	* @memberof util
	* @constructor
	* @param {number} lo Low 32 bits, unsigned
	* @param {number} hi High 32 bits, unsigned
	*/
	function LongBits(lo, hi) {
		/**
		* Low bits.
		* @type {number}
		*/
		this.lo = lo >>> 0;
		/**
		* High bits.
		* @type {number}
		*/
		this.hi = hi >>> 0;
	}
	/**
	* Zero bits.
	* @memberof util.LongBits
	* @type {util.LongBits}
	*/
	var zero = LongBits.zero = new LongBits(0, 0);
	zero.toNumber = function() {
		return 0;
	};
	zero.zzEncode = zero.zzDecode = function() {
		return this;
	};
	zero.length = function() {
		return 1;
	};
	/**
	* Zero hash.
	* @memberof util.LongBits
	* @type {string}
	*/
	var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
	/**
	* Constructs new long bits from the specified number.
	* @param {number} value Value
	* @returns {util.LongBits} Instance
	*/
	LongBits.fromNumber = function fromNumber(value) {
		if (value === 0) return zero;
		var sign = value < 0;
		if (sign) value = -value;
		var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
		if (sign) {
			hi = ~hi >>> 0;
			lo = ~lo >>> 0;
			if (++lo > 4294967295) {
				lo = 0;
				if (++hi > 4294967295) hi = 0;
			}
		}
		return new LongBits(lo, hi);
	};
	/**
	* Constructs new long bits from a number, long or string.
	* @param {Long|number|string} value Value
	* @returns {util.LongBits} Instance
	*/
	LongBits.from = function from(value) {
		if (typeof value === "number") return LongBits.fromNumber(value);
		if (util.isString(value))
 /* istanbul ignore else */
		if (util.Long) value = util.Long.fromString(value);
		else return LongBits.fromNumber(parseInt(value, 10));
		return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
	};
	/**
	* Converts this long bits to a possibly unsafe JavaScript number.
	* @param {boolean} [unsigned=false] Whether unsigned or not
	* @returns {number} Possibly unsafe number
	*/
	LongBits.prototype.toNumber = function toNumber(unsigned) {
		if (!unsigned && this.hi >>> 31) {
			var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
			if (!lo) hi = hi + 1 >>> 0;
			return -(lo + hi * 4294967296);
		}
		return this.lo + this.hi * 4294967296;
	};
	/**
	* Converts this long bits to a long.
	* @param {boolean} [unsigned=false] Whether unsigned or not
	* @returns {Long} Long
	*/
	LongBits.prototype.toLong = function toLong(unsigned) {
		return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : {
			low: this.lo | 0,
			high: this.hi | 0,
			unsigned: Boolean(unsigned)
		};
	};
	var charCodeAt = String.prototype.charCodeAt;
	/**
	* Constructs new long bits from the specified 8 characters long hash.
	* @param {string} hash Hash
	* @returns {util.LongBits} Bits
	*/
	LongBits.fromHash = function fromHash(hash) {
		if (hash === zeroHash) return zero;
		return new LongBits((charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0, (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0);
	};
	/**
	* Converts this long bits to a 8 characters long hash.
	* @returns {string} Hash
	*/
	LongBits.prototype.toHash = function toHash() {
		return String.fromCharCode(this.lo & 255, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, this.hi & 255, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24);
	};
	/**
	* Zig-zag encodes this long bits.
	* @returns {util.LongBits} `this`
	*/
	LongBits.prototype.zzEncode = function zzEncode() {
		var mask = this.hi >> 31;
		this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
		this.lo = (this.lo << 1 ^ mask) >>> 0;
		return this;
	};
	/**
	* Zig-zag decodes this long bits.
	* @returns {util.LongBits} `this`
	*/
	LongBits.prototype.zzDecode = function zzDecode() {
		var mask = -(this.lo & 1);
		this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
		this.hi = (this.hi >>> 1 ^ mask) >>> 0;
		return this;
	};
	/**
	* Calculates the length of this longbits when encoded as a varint.
	* @returns {number} Length
	*/
	LongBits.prototype.length = function length() {
		var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
		return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
	};
}));
//#endregion
//#region node_modules/long/umd/index.js
var require_umd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		function preferDefault(exports$1) {
			return exports$1.default || exports$1;
		}
		if (typeof define === "function" && define.amd) define([], function() {
			var exports$2 = {};
			factory(exports$2);
			return preferDefault(exports$2);
		});
		else if (typeof exports === "object") {
			factory(exports);
			if (typeof module === "object") module.exports = preferDefault(exports);
		} else (function() {
			var exports$3 = {};
			factory(exports$3);
			global.Long = preferDefault(exports$3);
		})();
	})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : exports, function(_exports) {
		"use strict";
		Object.defineProperty(_exports, "__esModule", { value: true });
		_exports.default = void 0;
		/**
		* @license
		* Copyright 2009 The Closure Library Authors
		* Copyright 2020 Daniel Wirtz / The long.js Authors.
		*
		* Licensed under the Apache License, Version 2.0 (the "License");
		* you may not use this file except in compliance with the License.
		* You may obtain a copy of the License at
		*
		*     http://www.apache.org/licenses/LICENSE-2.0
		*
		* Unless required by applicable law or agreed to in writing, software
		* distributed under the License is distributed on an "AS IS" BASIS,
		* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		* See the License for the specific language governing permissions and
		* limitations under the License.
		*
		* SPDX-License-Identifier: Apache-2.0
		*/
		var wasm = null;
		try {
			wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
				0,
				97,
				115,
				109,
				1,
				0,
				0,
				0,
				1,
				13,
				2,
				96,
				0,
				1,
				127,
				96,
				4,
				127,
				127,
				127,
				127,
				1,
				127,
				3,
				7,
				6,
				0,
				1,
				1,
				1,
				1,
				1,
				6,
				6,
				1,
				127,
				1,
				65,
				0,
				11,
				7,
				50,
				6,
				3,
				109,
				117,
				108,
				0,
				1,
				5,
				100,
				105,
				118,
				95,
				115,
				0,
				2,
				5,
				100,
				105,
				118,
				95,
				117,
				0,
				3,
				5,
				114,
				101,
				109,
				95,
				115,
				0,
				4,
				5,
				114,
				101,
				109,
				95,
				117,
				0,
				5,
				8,
				103,
				101,
				116,
				95,
				104,
				105,
				103,
				104,
				0,
				0,
				10,
				191,
				1,
				6,
				4,
				0,
				35,
				0,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				126,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				127,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				128,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				129,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11,
				36,
				1,
				1,
				126,
				32,
				0,
				173,
				32,
				1,
				173,
				66,
				32,
				134,
				132,
				32,
				2,
				173,
				32,
				3,
				173,
				66,
				32,
				134,
				132,
				130,
				34,
				4,
				66,
				32,
				135,
				167,
				36,
				0,
				32,
				4,
				167,
				11
			])), {}).exports;
		} catch {}
		/**
		* Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
		*  See the from* functions below for more convenient ways of constructing Longs.
		* @exports Long
		* @class A Long class for representing a 64 bit two's-complement integer value.
		* @param {number} low The low (signed) 32 bits of the long
		* @param {number} high The high (signed) 32 bits of the long
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @constructor
		*/
		function Long(low, high, unsigned) {
			/**
			* The low 32 bits as a signed value.
			* @type {number}
			*/
			this.low = low | 0;
			/**
			* The high 32 bits as a signed value.
			* @type {number}
			*/
			this.high = high | 0;
			/**
			* Whether unsigned or not.
			* @type {boolean}
			*/
			this.unsigned = !!unsigned;
		}
		/**
		* An indicator used to reliably determine if an object is a Long or not.
		* @type {boolean}
		* @const
		* @private
		*/
		Long.prototype.__isLong__;
		Object.defineProperty(Long.prototype, "__isLong__", { value: true });
		/**
		* @function
		* @param {*} obj Object
		* @returns {boolean}
		* @inner
		*/
		function isLong(obj) {
			return (obj && obj["__isLong__"]) === true;
		}
		/**
		* @function
		* @param {*} value number
		* @returns {number}
		* @inner
		*/
		function ctz32(value) {
			var c = Math.clz32(value & -value);
			return value ? 31 - c : c;
		}
		/**
		* Tests if the specified object is a Long.
		* @function
		* @param {*} obj Object
		* @returns {boolean}
		*/
		Long.isLong = isLong;
		/**
		* A cache of the Long representations of small integer values.
		* @type {!Object}
		* @inner
		*/
		var INT_CACHE = {};
		/**
		* A cache of the Long representations of small unsigned integer values.
		* @type {!Object}
		* @inner
		*/
		var UINT_CACHE = {};
		/**
		* @param {number} value
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromInt(value, unsigned) {
			var obj, cachedObj, cache;
			if (unsigned) {
				value >>>= 0;
				if (cache = 0 <= value && value < 256) {
					cachedObj = UINT_CACHE[value];
					if (cachedObj) return cachedObj;
				}
				obj = fromBits(value, 0, true);
				if (cache) UINT_CACHE[value] = obj;
				return obj;
			} else {
				value |= 0;
				if (cache = -128 <= value && value < 128) {
					cachedObj = INT_CACHE[value];
					if (cachedObj) return cachedObj;
				}
				obj = fromBits(value, value < 0 ? -1 : 0, false);
				if (cache) INT_CACHE[value] = obj;
				return obj;
			}
		}
		/**
		* Returns a Long representing the given 32 bit integer value.
		* @function
		* @param {number} value The 32 bit integer in question
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromInt = fromInt;
		/**
		* @param {number} value
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromNumber(value, unsigned) {
			if (isNaN(value)) return unsigned ? UZERO : ZERO;
			if (unsigned) {
				if (value < 0) return UZERO;
				if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
			} else {
				if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
				if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
			}
			if (value < 0) return fromNumber(-value, unsigned).neg();
			return fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
		}
		/**
		* Returns a Long representing the given value, provided that it is a finite number. Otherwise, zero is returned.
		* @function
		* @param {number} value The number in question
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromNumber = fromNumber;
		/**
		* @param {number} lowBits
		* @param {number} highBits
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromBits(lowBits, highBits, unsigned) {
			return new Long(lowBits, highBits, unsigned);
		}
		/**
		* Returns a Long representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
		*  assumed to use 32 bits.
		* @function
		* @param {number} lowBits The low 32 bits
		* @param {number} highBits The high 32 bits
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromBits = fromBits;
		/**
		* @function
		* @param {number} base
		* @param {number} exponent
		* @returns {number}
		* @inner
		*/
		var pow_dbl = Math.pow;
		/**
		* @param {string} str
		* @param {(boolean|number)=} unsigned
		* @param {number=} radix
		* @returns {!Long}
		* @inner
		*/
		function fromString(str, unsigned, radix) {
			if (str.length === 0) throw Error("empty string");
			if (typeof unsigned === "number") {
				radix = unsigned;
				unsigned = false;
			} else unsigned = !!unsigned;
			if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return unsigned ? UZERO : ZERO;
			radix = radix || 10;
			if (radix < 2 || 36 < radix) throw RangeError("radix");
			var p;
			if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
			else if (p === 0) return fromString(str.substring(1), unsigned, radix).neg();
			var radixToPower = fromNumber(pow_dbl(radix, 8));
			var result = ZERO;
			for (var i = 0; i < str.length; i += 8) {
				var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
				if (size < 8) {
					var power = fromNumber(pow_dbl(radix, size));
					result = result.mul(power).add(fromNumber(value));
				} else {
					result = result.mul(radixToPower);
					result = result.add(fromNumber(value));
				}
			}
			result.unsigned = unsigned;
			return result;
		}
		/**
		* Returns a Long representation of the given string, written using the specified radix.
		* @function
		* @param {string} str The textual representation of the Long
		* @param {(boolean|number)=} unsigned Whether unsigned or not, defaults to signed
		* @param {number=} radix The radix in which the text is written (2-36), defaults to 10
		* @returns {!Long} The corresponding Long value
		*/
		Long.fromString = fromString;
		/**
		* @function
		* @param {!Long|number|string|!{low: number, high: number, unsigned: boolean}} val
		* @param {boolean=} unsigned
		* @returns {!Long}
		* @inner
		*/
		function fromValue(val, unsigned) {
			if (typeof val === "number") return fromNumber(val, unsigned);
			if (typeof val === "string") return fromString(val, unsigned);
			return fromBits(val.low, val.high, typeof unsigned === "boolean" ? unsigned : val.unsigned);
		}
		/**
		* Converts the specified value to a Long using the appropriate from* function for its type.
		* @function
		* @param {!Long|number|bigint|string|!{low: number, high: number, unsigned: boolean}} val Value
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {!Long}
		*/
		Long.fromValue = fromValue;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_16_DBL = 65536;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_24_DBL = 1 << 24;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
		/**
		* @type {number}
		* @const
		* @inner
		*/
		var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
		/**
		* @type {!Long}
		* @const
		* @inner
		*/
		var TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);
		/**
		* @type {!Long}
		* @inner
		*/
		var ZERO = fromInt(0);
		/**
		* Signed zero.
		* @type {!Long}
		*/
		Long.ZERO = ZERO;
		/**
		* @type {!Long}
		* @inner
		*/
		var UZERO = fromInt(0, true);
		/**
		* Unsigned zero.
		* @type {!Long}
		*/
		Long.UZERO = UZERO;
		/**
		* @type {!Long}
		* @inner
		*/
		var ONE = fromInt(1);
		/**
		* Signed one.
		* @type {!Long}
		*/
		Long.ONE = ONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var UONE = fromInt(1, true);
		/**
		* Unsigned one.
		* @type {!Long}
		*/
		Long.UONE = UONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var NEG_ONE = fromInt(-1);
		/**
		* Signed negative one.
		* @type {!Long}
		*/
		Long.NEG_ONE = NEG_ONE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MAX_VALUE = fromBits(-1, 2147483647, false);
		/**
		* Maximum signed value.
		* @type {!Long}
		*/
		Long.MAX_VALUE = MAX_VALUE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MAX_UNSIGNED_VALUE = fromBits(-1, -1, true);
		/**
		* Maximum unsigned value.
		* @type {!Long}
		*/
		Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
		/**
		* @type {!Long}
		* @inner
		*/
		var MIN_VALUE = fromBits(0, -2147483648, false);
		/**
		* Minimum signed value.
		* @type {!Long}
		*/
		Long.MIN_VALUE = MIN_VALUE;
		/**
		* @alias Long.prototype
		* @inner
		*/
		var LongPrototype = Long.prototype;
		/**
		* Converts the Long to a 32 bit integer, assuming it is a 32 bit integer.
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.toInt = function toInt() {
			return this.unsigned ? this.low >>> 0 : this.low;
		};
		/**
		* Converts the Long to a the nearest floating-point representation of this value (double, 53 bit mantissa).
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.toNumber = function toNumber() {
			if (this.unsigned) return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
			return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
		};
		/**
		* Converts the Long to a string written in the specified radix.
		* @this {!Long}
		* @param {number=} radix Radix (2-36), defaults to 10
		* @returns {string}
		* @override
		* @throws {RangeError} If `radix` is out of range
		*/
		LongPrototype.toString = function toString(radix) {
			radix = radix || 10;
			if (radix < 2 || 36 < radix) throw RangeError("radix");
			if (this.isZero()) return "0";
			if (this.isNegative()) if (this.eq(MIN_VALUE)) {
				var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
				return div.toString(radix) + rem1.toInt().toString(radix);
			} else return "-" + this.neg().toString(radix);
			var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this;
			var result = "";
			while (true) {
				var remDiv = rem.div(radixToPower), digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
				rem = remDiv;
				if (rem.isZero()) return digits + result;
				else {
					while (digits.length < 6) digits = "0" + digits;
					result = "" + digits + result;
				}
			}
		};
		/**
		* Gets the high 32 bits as a signed integer.
		* @this {!Long}
		* @returns {number} Signed high bits
		*/
		LongPrototype.getHighBits = function getHighBits() {
			return this.high;
		};
		/**
		* Gets the high 32 bits as an unsigned integer.
		* @this {!Long}
		* @returns {number} Unsigned high bits
		*/
		LongPrototype.getHighBitsUnsigned = function getHighBitsUnsigned() {
			return this.high >>> 0;
		};
		/**
		* Gets the low 32 bits as a signed integer.
		* @this {!Long}
		* @returns {number} Signed low bits
		*/
		LongPrototype.getLowBits = function getLowBits() {
			return this.low;
		};
		/**
		* Gets the low 32 bits as an unsigned integer.
		* @this {!Long}
		* @returns {number} Unsigned low bits
		*/
		LongPrototype.getLowBitsUnsigned = function getLowBitsUnsigned() {
			return this.low >>> 0;
		};
		/**
		* Gets the number of bits needed to represent the absolute value of this Long.
		* @this {!Long}
		* @returns {number}
		*/
		LongPrototype.getNumBitsAbs = function getNumBitsAbs() {
			if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
			var val = this.high != 0 ? this.high : this.low;
			for (var bit = 31; bit > 0; bit--) if ((val & 1 << bit) != 0) break;
			return this.high != 0 ? bit + 33 : bit + 1;
		};
		/**
		* Tests if this Long can be safely represented as a JavaScript number.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isSafeInteger = function isSafeInteger() {
			var top11Bits = this.high >> 21;
			if (!top11Bits) return true;
			if (this.unsigned) return false;
			return top11Bits === -1 && !(this.low === 0 && this.high === -2097152);
		};
		/**
		* Tests if this Long's value equals zero.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isZero = function isZero() {
			return this.high === 0 && this.low === 0;
		};
		/**
		* Tests if this Long's value equals zero. This is an alias of {@link Long#isZero}.
		* @returns {boolean}
		*/
		LongPrototype.eqz = LongPrototype.isZero;
		/**
		* Tests if this Long's value is negative.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isNegative = function isNegative() {
			return !this.unsigned && this.high < 0;
		};
		/**
		* Tests if this Long's value is positive or zero.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isPositive = function isPositive() {
			return this.unsigned || this.high >= 0;
		};
		/**
		* Tests if this Long's value is odd.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isOdd = function isOdd() {
			return (this.low & 1) === 1;
		};
		/**
		* Tests if this Long's value is even.
		* @this {!Long}
		* @returns {boolean}
		*/
		LongPrototype.isEven = function isEven() {
			return (this.low & 1) === 0;
		};
		/**
		* Tests if this Long's value equals the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.equals = function equals(other) {
			if (!isLong(other)) other = fromValue(other);
			if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1) return false;
			return this.high === other.high && this.low === other.low;
		};
		/**
		* Tests if this Long's value equals the specified's. This is an alias of {@link Long#equals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.eq = LongPrototype.equals;
		/**
		* Tests if this Long's value differs from the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.notEquals = function notEquals(other) {
			return !this.eq(other);
		};
		/**
		* Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.neq = LongPrototype.notEquals;
		/**
		* Tests if this Long's value differs from the specified's. This is an alias of {@link Long#notEquals}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.ne = LongPrototype.notEquals;
		/**
		* Tests if this Long's value is less than the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lessThan = function lessThan(other) {
			return this.comp(other) < 0;
		};
		/**
		* Tests if this Long's value is less than the specified's. This is an alias of {@link Long#lessThan}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lt = LongPrototype.lessThan;
		/**
		* Tests if this Long's value is less than or equal the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lessThanOrEqual = function lessThanOrEqual(other) {
			return this.comp(other) <= 0;
		};
		/**
		* Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.lte = LongPrototype.lessThanOrEqual;
		/**
		* Tests if this Long's value is less than or equal the specified's. This is an alias of {@link Long#lessThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.le = LongPrototype.lessThanOrEqual;
		/**
		* Tests if this Long's value is greater than the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.greaterThan = function greaterThan(other) {
			return this.comp(other) > 0;
		};
		/**
		* Tests if this Long's value is greater than the specified's. This is an alias of {@link Long#greaterThan}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.gt = LongPrototype.greaterThan;
		/**
		* Tests if this Long's value is greater than or equal the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.greaterThanOrEqual = function greaterThanOrEqual(other) {
			return this.comp(other) >= 0;
		};
		/**
		* Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.gte = LongPrototype.greaterThanOrEqual;
		/**
		* Tests if this Long's value is greater than or equal the specified's. This is an alias of {@link Long#greaterThanOrEqual}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {boolean}
		*/
		LongPrototype.ge = LongPrototype.greaterThanOrEqual;
		/**
		* Compares this Long's value with the specified's.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other value
		* @returns {number} 0 if they are the same, 1 if the this is greater and -1
		*  if the given one is greater
		*/
		LongPrototype.compare = function compare(other) {
			if (!isLong(other)) other = fromValue(other);
			if (this.eq(other)) return 0;
			var thisNeg = this.isNegative(), otherNeg = other.isNegative();
			if (thisNeg && !otherNeg) return -1;
			if (!thisNeg && otherNeg) return 1;
			if (!this.unsigned) return this.sub(other).isNegative() ? -1 : 1;
			return other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1;
		};
		/**
		* Compares this Long's value with the specified's. This is an alias of {@link Long#compare}.
		* @function
		* @param {!Long|number|bigint|string} other Other value
		* @returns {number} 0 if they are the same, 1 if the this is greater and -1
		*  if the given one is greater
		*/
		LongPrototype.comp = LongPrototype.compare;
		/**
		* Negates this Long's value.
		* @this {!Long}
		* @returns {!Long} Negated Long
		*/
		LongPrototype.negate = function negate() {
			if (!this.unsigned && this.eq(MIN_VALUE)) return MIN_VALUE;
			return this.not().add(ONE);
		};
		/**
		* Negates this Long's value. This is an alias of {@link Long#negate}.
		* @function
		* @returns {!Long} Negated Long
		*/
		LongPrototype.neg = LongPrototype.negate;
		/**
		* Returns the sum of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} addend Addend
		* @returns {!Long} Sum
		*/
		LongPrototype.add = function add(addend) {
			if (!isLong(addend)) addend = fromValue(addend);
			var a48 = this.high >>> 16;
			var a32 = this.high & 65535;
			var a16 = this.low >>> 16;
			var a00 = this.low & 65535;
			var b48 = addend.high >>> 16;
			var b32 = addend.high & 65535;
			var b16 = addend.low >>> 16;
			var b00 = addend.low & 65535;
			var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 + b00;
			c16 += c00 >>> 16;
			c00 &= 65535;
			c16 += a16 + b16;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c32 += a32 + b32;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c48 += a48 + b48;
			c48 &= 65535;
			return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
		};
		/**
		* Returns the difference of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} subtrahend Subtrahend
		* @returns {!Long} Difference
		*/
		LongPrototype.subtract = function subtract(subtrahend) {
			if (!isLong(subtrahend)) subtrahend = fromValue(subtrahend);
			return this.add(subtrahend.neg());
		};
		/**
		* Returns the difference of this and the specified Long. This is an alias of {@link Long#subtract}.
		* @function
		* @param {!Long|number|bigint|string} subtrahend Subtrahend
		* @returns {!Long} Difference
		*/
		LongPrototype.sub = LongPrototype.subtract;
		/**
		* Returns the product of this and the specified Long.
		* @this {!Long}
		* @param {!Long|number|bigint|string} multiplier Multiplier
		* @returns {!Long} Product
		*/
		LongPrototype.multiply = function multiply(multiplier) {
			if (this.isZero()) return this;
			if (!isLong(multiplier)) multiplier = fromValue(multiplier);
			if (wasm) return fromBits(wasm["mul"](this.low, this.high, multiplier.low, multiplier.high), wasm["get_high"](), this.unsigned);
			if (multiplier.isZero()) return this.unsigned ? UZERO : ZERO;
			if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
			if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
			if (this.isNegative()) if (multiplier.isNegative()) return this.neg().mul(multiplier.neg());
			else return this.neg().mul(multiplier).neg();
			else if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
			if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
			var a48 = this.high >>> 16;
			var a32 = this.high & 65535;
			var a16 = this.low >>> 16;
			var a00 = this.low & 65535;
			var b48 = multiplier.high >>> 16;
			var b32 = multiplier.high & 65535;
			var b16 = multiplier.low >>> 16;
			var b00 = multiplier.low & 65535;
			var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
			c00 += a00 * b00;
			c16 += c00 >>> 16;
			c00 &= 65535;
			c16 += a16 * b00;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c16 += a00 * b16;
			c32 += c16 >>> 16;
			c16 &= 65535;
			c32 += a32 * b00;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c32 += a16 * b16;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c32 += a00 * b32;
			c48 += c32 >>> 16;
			c32 &= 65535;
			c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
			c48 &= 65535;
			return fromBits(c16 << 16 | c00, c48 << 16 | c32, this.unsigned);
		};
		/**
		* Returns the product of this and the specified Long. This is an alias of {@link Long#multiply}.
		* @function
		* @param {!Long|number|bigint|string} multiplier Multiplier
		* @returns {!Long} Product
		*/
		LongPrototype.mul = LongPrototype.multiply;
		/**
		* Returns this Long divided by the specified. The result is signed if this Long is signed or
		*  unsigned if this Long is unsigned.
		* @this {!Long}
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Quotient
		*/
		LongPrototype.divide = function divide(divisor) {
			if (!isLong(divisor)) divisor = fromValue(divisor);
			if (divisor.isZero()) throw Error("division by zero");
			if (wasm) {
				if (!this.unsigned && this.high === -2147483648 && divisor.low === -1 && divisor.high === -1) return this;
				return fromBits((this.unsigned ? wasm["div_u"] : wasm["div_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
			}
			if (this.isZero()) return this.unsigned ? UZERO : ZERO;
			var approx, rem, res;
			if (!this.unsigned) {
				if (this.eq(MIN_VALUE)) if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE;
				else if (divisor.eq(MIN_VALUE)) return ONE;
				else {
					approx = this.shr(1).div(divisor).shl(1);
					if (approx.eq(ZERO)) return divisor.isNegative() ? ONE : NEG_ONE;
					else {
						rem = this.sub(divisor.mul(approx));
						res = approx.add(rem.div(divisor));
						return res;
					}
				}
				else if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
				if (this.isNegative()) {
					if (divisor.isNegative()) return this.neg().div(divisor.neg());
					return this.neg().div(divisor).neg();
				} else if (divisor.isNegative()) return this.div(divisor.neg()).neg();
				res = ZERO;
			} else {
				if (!divisor.unsigned) divisor = divisor.toUnsigned();
				if (divisor.gt(this)) return UZERO;
				if (divisor.gt(this.shru(1))) return UONE;
				res = UZERO;
			}
			rem = this;
			while (rem.gte(divisor)) {
				approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
				var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor);
				while (approxRem.isNegative() || approxRem.gt(rem)) {
					approx -= delta;
					approxRes = fromNumber(approx, this.unsigned);
					approxRem = approxRes.mul(divisor);
				}
				if (approxRes.isZero()) approxRes = ONE;
				res = res.add(approxRes);
				rem = rem.sub(approxRem);
			}
			return res;
		};
		/**
		* Returns this Long divided by the specified. This is an alias of {@link Long#divide}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Quotient
		*/
		LongPrototype.div = LongPrototype.divide;
		/**
		* Returns this Long modulo the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.modulo = function modulo(divisor) {
			if (!isLong(divisor)) divisor = fromValue(divisor);
			if (wasm) return fromBits((this.unsigned ? wasm["rem_u"] : wasm["rem_s"])(this.low, this.high, divisor.low, divisor.high), wasm["get_high"](), this.unsigned);
			return this.sub(this.div(divisor).mul(divisor));
		};
		/**
		* Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.mod = LongPrototype.modulo;
		/**
		* Returns this Long modulo the specified. This is an alias of {@link Long#modulo}.
		* @function
		* @param {!Long|number|bigint|string} divisor Divisor
		* @returns {!Long} Remainder
		*/
		LongPrototype.rem = LongPrototype.modulo;
		/**
		* Returns the bitwise NOT of this Long.
		* @this {!Long}
		* @returns {!Long}
		*/
		LongPrototype.not = function not() {
			return fromBits(~this.low, ~this.high, this.unsigned);
		};
		/**
		* Returns count leading zeros of this Long.
		* @this {!Long}
		* @returns {!number}
		*/
		LongPrototype.countLeadingZeros = function countLeadingZeros() {
			return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
		};
		/**
		* Returns count leading zeros. This is an alias of {@link Long#countLeadingZeros}.
		* @function
		* @param {!Long}
		* @returns {!number}
		*/
		LongPrototype.clz = LongPrototype.countLeadingZeros;
		/**
		* Returns count trailing zeros of this Long.
		* @this {!Long}
		* @returns {!number}
		*/
		LongPrototype.countTrailingZeros = function countTrailingZeros() {
			return this.low ? ctz32(this.low) : ctz32(this.high) + 32;
		};
		/**
		* Returns count trailing zeros. This is an alias of {@link Long#countTrailingZeros}.
		* @function
		* @param {!Long}
		* @returns {!number}
		*/
		LongPrototype.ctz = LongPrototype.countTrailingZeros;
		/**
		* Returns the bitwise AND of this Long and the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.and = function and(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
		};
		/**
		* Returns the bitwise OR of this Long and the specified.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.or = function or(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
		};
		/**
		* Returns the bitwise XOR of this Long and the given one.
		* @this {!Long}
		* @param {!Long|number|bigint|string} other Other Long
		* @returns {!Long}
		*/
		LongPrototype.xor = function xor(other) {
			if (!isLong(other)) other = fromValue(other);
			return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
		};
		/**
		* Returns this Long with bits shifted to the left by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftLeft = function shiftLeft(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			else if (numBits < 32) return fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned);
			else return fromBits(0, this.low << numBits - 32, this.unsigned);
		};
		/**
		* Returns this Long with bits shifted to the left by the given amount. This is an alias of {@link Long#shiftLeft}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shl = LongPrototype.shiftLeft;
		/**
		* Returns this Long with bits arithmetically shifted to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftRight = function shiftRight(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			else if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned);
			else return fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
		};
		/**
		* Returns this Long with bits arithmetically shifted to the right by the given amount. This is an alias of {@link Long#shiftRight}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shr = LongPrototype.shiftRight;
		/**
		* Returns this Long with bits logically shifted to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shiftRightUnsigned = function shiftRightUnsigned(numBits) {
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits < 32) return fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned);
			if (numBits === 32) return fromBits(this.high, 0, this.unsigned);
			return fromBits(this.high >>> numBits - 32, 0, this.unsigned);
		};
		/**
		* Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shru = LongPrototype.shiftRightUnsigned;
		/**
		* Returns this Long with bits logically shifted to the right by the given amount. This is an alias of {@link Long#shiftRightUnsigned}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Shifted Long
		*/
		LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;
		/**
		* Returns this Long with bits rotated to the left by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotateLeft = function rotateLeft(numBits) {
			var b;
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
			if (numBits < 32) {
				b = 32 - numBits;
				return fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned);
			}
			numBits -= 32;
			b = 32 - numBits;
			return fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned);
		};
		/**
		* Returns this Long with bits rotated to the left by the given amount. This is an alias of {@link Long#rotateLeft}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotl = LongPrototype.rotateLeft;
		/**
		* Returns this Long with bits rotated to the right by the given amount.
		* @this {!Long}
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotateRight = function rotateRight(numBits) {
			var b;
			if (isLong(numBits)) numBits = numBits.toInt();
			if ((numBits &= 63) === 0) return this;
			if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
			if (numBits < 32) {
				b = 32 - numBits;
				return fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned);
			}
			numBits -= 32;
			b = 32 - numBits;
			return fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned);
		};
		/**
		* Returns this Long with bits rotated to the right by the given amount. This is an alias of {@link Long#rotateRight}.
		* @function
		* @param {number|!Long} numBits Number of bits
		* @returns {!Long} Rotated Long
		*/
		LongPrototype.rotr = LongPrototype.rotateRight;
		/**
		* Converts this Long to signed.
		* @this {!Long}
		* @returns {!Long} Signed long
		*/
		LongPrototype.toSigned = function toSigned() {
			if (!this.unsigned) return this;
			return fromBits(this.low, this.high, false);
		};
		/**
		* Converts this Long to unsigned.
		* @this {!Long}
		* @returns {!Long} Unsigned long
		*/
		LongPrototype.toUnsigned = function toUnsigned() {
			if (this.unsigned) return this;
			return fromBits(this.low, this.high, true);
		};
		/**
		* Converts this Long to its byte representation.
		* @param {boolean=} le Whether little or big endian, defaults to big endian
		* @this {!Long}
		* @returns {!Array.<number>} Byte representation
		*/
		LongPrototype.toBytes = function toBytes(le) {
			return le ? this.toBytesLE() : this.toBytesBE();
		};
		/**
		* Converts this Long to its little endian byte representation.
		* @this {!Long}
		* @returns {!Array.<number>} Little endian byte representation
		*/
		LongPrototype.toBytesLE = function toBytesLE() {
			var hi = this.high, lo = this.low;
			return [
				lo & 255,
				lo >>> 8 & 255,
				lo >>> 16 & 255,
				lo >>> 24,
				hi & 255,
				hi >>> 8 & 255,
				hi >>> 16 & 255,
				hi >>> 24
			];
		};
		/**
		* Converts this Long to its big endian byte representation.
		* @this {!Long}
		* @returns {!Array.<number>} Big endian byte representation
		*/
		LongPrototype.toBytesBE = function toBytesBE() {
			var hi = this.high, lo = this.low;
			return [
				hi >>> 24,
				hi >>> 16 & 255,
				hi >>> 8 & 255,
				hi & 255,
				lo >>> 24,
				lo >>> 16 & 255,
				lo >>> 8 & 255,
				lo & 255
			];
		};
		/**
		* Creates a Long from its byte representation.
		* @param {!Array.<number>} bytes Byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @param {boolean=} le Whether little or big endian, defaults to big endian
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytes = function fromBytes(bytes, unsigned, le) {
			return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
		};
		/**
		* Creates a Long from its little endian byte representation.
		* @param {!Array.<number>} bytes Little endian byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytesLE = function fromBytesLE(bytes, unsigned) {
			return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
		};
		/**
		* Creates a Long from its big endian byte representation.
		* @param {!Array.<number>} bytes Big endian byte representation
		* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
		* @returns {Long} The corresponding Long value
		*/
		Long.fromBytesBE = function fromBytesBE(bytes, unsigned) {
			return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
		};
		if (typeof BigInt === "function") {
			/**
			* Returns a Long representing the given big integer.
			* @function
			* @param {number} value The big integer value
			* @param {boolean=} unsigned Whether unsigned or not, defaults to signed
			* @returns {!Long} The corresponding Long value
			*/
			Long.fromBigInt = function fromBigInt(value, unsigned) {
				return fromBits(Number(BigInt.asIntN(32, value)), Number(BigInt.asIntN(32, value >> BigInt(32))), unsigned);
			};
			Long.fromValue = function fromValueWithBigInt(value, unsigned) {
				if (typeof value === "bigint") return Long.fromBigInt(value, unsigned);
				return fromValue(value, unsigned);
			};
			/**
			* Converts the Long to its big integer representation.
			* @this {!Long}
			* @returns {bigint}
			*/
			LongPrototype.toBigInt = function toBigInt() {
				var lowBigInt = BigInt(this.low >>> 0);
				return BigInt(this.unsigned ? this.high >>> 0 : this.high) << BigInt(32) | lowBigInt;
			};
		}
		_exports.default = Long;
	});
}));
//#endregion
//#region node_modules/protobufjs/src/util/minimal.js
var require_minimal = /* @__PURE__ */ __commonJSMin(((exports) => {
	var util = exports;
	util.asPromise = require_aspromise();
	util.base64 = require_base64();
	util.EventEmitter = require_eventemitter();
	util.float = require_float();
	util.inquire = require_inquire();
	util.utf8 = require_utf8();
	util.pool = require_pool();
	util.LongBits = require_longbits();
	/**
	* Tests if the specified key can affect object prototypes.
	* @memberof util
	* @param {string} key Key to test
	* @returns {boolean} `true` if the key is unsafe
	*/
	function isUnsafeProperty(key) {
		return key === "__proto__" || key === "prototype" || key === "constructor";
	}
	util.isUnsafeProperty = isUnsafeProperty;
	/**
	* Whether running within node or not.
	* @memberof util
	* @type {boolean}
	*/
	util.isNode = Boolean(typeof global !== "undefined" && global && global.process && global.process.versions && global.process.versions.node);
	/**
	* Global object reference.
	* @memberof util
	* @type {Object}
	*/
	util.global = util.isNode && global || typeof window !== "undefined" && window || typeof self !== "undefined" && self || exports;
	/**
	* An immuable empty array.
	* @memberof util
	* @type {Array.<*>}
	* @const
	*/
	util.emptyArray = Object.freeze ? Object.freeze([]) : 	/* istanbul ignore next */ [];
	/**
	* An immutable empty object.
	* @type {Object}
	* @const
	*/
	util.emptyObject = Object.freeze ? Object.freeze({}) : 	/* istanbul ignore next */ {};
	/**
	* Tests if the specified value is an integer.
	* @function
	* @param {*} value Value to test
	* @returns {boolean} `true` if the value is an integer
	*/
	util.isInteger = Number.isInteger || function isInteger(value) {
		return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
	};
	/**
	* Tests if the specified value is a string.
	* @param {*} value Value to test
	* @returns {boolean} `true` if the value is a string
	*/
	util.isString = function isString(value) {
		return typeof value === "string" || value instanceof String;
	};
	/**
	* Tests if the specified value is a non-null object.
	* @param {*} value Value to test
	* @returns {boolean} `true` if the value is a non-null object
	*/
	util.isObject = function isObject(value) {
		return value && typeof value === "object";
	};
	/**
	* Checks if a property on a message is considered to be present.
	* This is an alias of {@link util.isSet}.
	* @function
	* @param {Object} obj Plain object or message instance
	* @param {string} prop Property name
	* @returns {boolean} `true` if considered to be present, otherwise `false`
	*/
	util.isset = util.isSet = function isSet(obj, prop) {
		var value = obj[prop];
		if (value != null && Object.hasOwnProperty.call(obj, prop)) return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
		return false;
	};
	/**
	* Any compatible Buffer instance.
	* This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
	* @interface Buffer
	* @extends Uint8Array
	*/
	/**
	* Node's Buffer class if available.
	* @type {Constructor<Buffer>}
	*/
	util.Buffer = (function() {
		try {
			var Buffer = util.global.Buffer;
			return Buffer.prototype.utf8Write ? Buffer : 			/* istanbul ignore next */ null;
		} catch (e) {
			/* istanbul ignore next */
			return null;
		}
	})();
	util._Buffer_from = null;
	util._Buffer_allocUnsafe = null;
	/**
	* Creates a new buffer of whatever type supported by the environment.
	* @param {number|number[]} [sizeOrArray=0] Buffer size or number array
	* @returns {Uint8Array|Buffer} Buffer
	*/
	util.newBuffer = function newBuffer(sizeOrArray) {
		/* istanbul ignore next */
		return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
	};
	/**
	* Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
	* @type {Constructor<Uint8Array>}
	*/
	util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
	/**
	* Any compatible Long instance.
	* This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
	* @interface Long
	* @property {number} low Low bits
	* @property {number} high High bits
	* @property {boolean} unsigned Whether unsigned or not
	*/
	/**
	* Long.js's Long class if available.
	* @type {Constructor<Long>}
	*/
	util.Long = util.global.dcodeIO && util.global.dcodeIO.Long || util.global.Long || (function() {
		try {
			var Long = require_umd();
			return Long && Long.isLong ? Long : null;
		} catch (e) {
			/* istanbul ignore next */
			return null;
		}
	})();
	/**
	* Regular expression used to verify 2 bit (`bool`) map keys.
	* @type {RegExp}
	* @const
	*/
	util.key2Re = /^true|false|0|1$/;
	/**
	* Regular expression used to verify 32 bit (`int32` etc.) map keys.
	* @type {RegExp}
	* @const
	*/
	util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
	/**
	* Regular expression used to verify 64 bit (`int64` etc.) map keys.
	* @type {RegExp}
	* @const
	*/
	util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
	/**
	* Converts a number or long to an 8 characters long hash string.
	* @param {Long|number} value Value to convert
	* @returns {string} Hash
	*/
	util.longToHash = function longToHash(value) {
		return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
	};
	/**
	* Converts an 8 characters long hash string to a long or number.
	* @param {string} hash Hash
	* @param {boolean} [unsigned=false] Whether unsigned or not
	* @returns {Long|number} Original value
	*/
	util.longFromHash = function longFromHash(hash, unsigned) {
		var bits = util.LongBits.fromHash(hash);
		if (util.Long) return util.Long.fromBits(bits.lo, bits.hi, unsigned);
		return bits.toNumber(Boolean(unsigned));
	};
	/**
	* Merges the properties of the source object into the destination object.
	* @memberof util
	* @param {Object.<string,*>} dst Destination object
	* @param {...(Object.<string,*>|boolean)} src Source objects, optionally followed by an `ifNotSet` flag
	* @returns {Object.<string,*>} Destination object
	*/
	function merge(dst) {
		var ifNotSet = typeof arguments[arguments.length - 1] === "boolean", limit = ifNotSet ? arguments.length - 1 : arguments.length;
		ifNotSet = ifNotSet && arguments[arguments.length - 1];
		for (var a = 1; a < limit; ++a) {
			var src = arguments[a];
			if (!src) continue;
			for (var keys = Object.keys(src), i = 0; i < keys.length; ++i) if (!isUnsafeProperty(keys[i]) && (dst[keys[i]] === void 0 || !ifNotSet)) dst[keys[i]] = src[keys[i]];
		}
		return dst;
	}
	util.merge = merge;
	/**
	* Schema declaration nesting limit.
	* @memberof util
	* @type {number}
	*/
	util.nestingLimit = 32;
	/**
	* Recursion limit.
	* @memberof util
	* @type {number}
	*/
	util.recursionLimit = 100;
	/**
	* Makes a property safe for assignment as an own property.
	* @memberof util
	* @param {Object.<string,*>} obj Object
	* @param {string} key Property key
	* @returns {undefined}
	*/
	util.makeProp = function makeProp(obj, key) {
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			writable: true
		});
	};
	/**
	* Converts the first character of a string to lower case.
	* @param {string} str String to convert
	* @returns {string} Converted string
	*/
	util.lcFirst = function lcFirst(str) {
		return str.charAt(0).toLowerCase() + str.substring(1);
	};
	/**
	* Creates a custom error constructor.
	* @memberof util
	* @param {string} name Error name
	* @returns {Constructor<Error>} Custom error constructor
	*/
	function newError(name) {
		function CustomError(message, properties) {
			if (!(this instanceof CustomError)) return new CustomError(message, properties);
			Object.defineProperty(this, "message", { get: function() {
				return message;
			} });
			/* istanbul ignore next */
			if (Error.captureStackTrace) Error.captureStackTrace(this, CustomError);
			else Object.defineProperty(this, "stack", { value: (/* @__PURE__ */ new Error()).stack || "" });
			if (properties) merge(this, properties);
		}
		CustomError.prototype = Object.create(Error.prototype, {
			constructor: {
				value: CustomError,
				writable: true,
				enumerable: false,
				configurable: true
			},
			name: {
				get: function get() {
					return name;
				},
				set: void 0,
				enumerable: false,
				configurable: true
			},
			toString: {
				value: function value() {
					return this.name + ": " + this.message;
				},
				writable: true,
				enumerable: false,
				configurable: true
			}
		});
		return CustomError;
	}
	util.newError = newError;
	/**
	* Constructs a new protocol error.
	* @classdesc Error subclass indicating a protocol specifc error.
	* @memberof util
	* @extends Error
	* @template T extends Message<T>
	* @constructor
	* @param {string} message Error message
	* @param {Object.<string,*>} [properties] Additional properties
	* @example
	* try {
	*     MyMessage.decode(someBuffer); // throws if required fields are missing
	* } catch (e) {
	*     if (e instanceof ProtocolError && e.instance)
	*         console.log("decoded so far: " + JSON.stringify(e.instance));
	* }
	*/
	util.ProtocolError = newError("ProtocolError");
	/**
	* So far decoded message instance.
	* @name util.ProtocolError#instance
	* @type {Message<T>}
	*/
	/**
	* A OneOf getter as returned by {@link util.oneOfGetter}.
	* @typedef OneOfGetter
	* @type {function}
	* @returns {string|undefined} Set field name, if any
	*/
	/**
	* Builds a getter for a oneof's present field name.
	* @param {string[]} fieldNames Field names
	* @returns {OneOfGetter} Unbound getter
	*/
	util.oneOfGetter = function getOneOf(fieldNames) {
		var fieldMap = {};
		for (var i = 0; i < fieldNames.length; ++i) fieldMap[fieldNames[i]] = 1;
		/**
		* @returns {string|undefined} Set field name, if any
		* @this Object
		* @ignore
		*/
		return function() {
			for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i) if (fieldMap[keys[i]] === 1 && this[keys[i]] !== void 0 && this[keys[i]] !== null) return keys[i];
		};
	};
	/**
	* A OneOf setter as returned by {@link util.oneOfSetter}.
	* @typedef OneOfSetter
	* @type {function}
	* @param {string|undefined} value Field name
	* @returns {undefined}
	*/
	/**
	* Builds a setter for a oneof's present field name.
	* @param {string[]} fieldNames Field names
	* @returns {OneOfSetter} Unbound setter
	*/
	util.oneOfSetter = function setOneOf(fieldNames) {
		/**
		* @param {string} name Field name
		* @returns {undefined}
		* @this Object
		* @ignore
		*/
		return function(name) {
			for (var i = 0; i < fieldNames.length; ++i) if (fieldNames[i] !== name) delete this[fieldNames[i]];
		};
	};
	/**
	* Default conversion options used for {@link Message#toJSON} implementations.
	*
	* These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
	*
	* - Longs become strings
	* - Enums become string keys
	* - Bytes become base64 encoded strings
	* - (Sub-)Messages become plain objects
	* - Maps become plain objects with all string keys
	* - Repeated fields become arrays
	* - NaN and Infinity for float and double fields become strings
	*
	* @type {IConversionOptions}
	* @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
	*/
	util.toJSONOptions = {
		longs: String,
		enums: String,
		bytes: String,
		json: true
	};
	util._configure = function() {
		var Buffer = util.Buffer;
		/* istanbul ignore if */
		if (!Buffer) {
			util._Buffer_from = util._Buffer_allocUnsafe = null;
			return;
		}
		util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || function Buffer_from(value, encoding) {
			return new Buffer(value, encoding);
		};
		util._Buffer_allocUnsafe = Buffer.allocUnsafe || function Buffer_allocUnsafe(size) {
			return new Buffer(size);
		};
	};
}));
//#endregion
//#region node_modules/protobufjs/src/writer.js
var require_writer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Writer;
	var util = require_minimal();
	var BufferWriter;
	var LongBits = util.LongBits, base64 = util.base64, utf8 = util.utf8;
	/**
	* Constructs a new writer operation instance.
	* @classdesc Scheduled writer operation.
	* @constructor
	* @param {function(*, Uint8Array, number)} fn Function to call
	* @param {number} len Value byte length
	* @param {*} val Value to write
	* @ignore
	*/
	function Op(fn, len, val) {
		/**
		* Function to call.
		* @type {function(Uint8Array, number, *)}
		*/
		this.fn = fn;
		/**
		* Value byte length.
		* @type {number}
		*/
		this.len = len;
		/**
		* Next operation.
		* @type {Writer.Op|undefined}
		*/
		this.next = void 0;
		/**
		* Value to write.
		* @type {*}
		*/
		this.val = val;
	}
	/* istanbul ignore next */
	function noop() {}
	/**
	* Constructs a new writer state instance.
	* @classdesc Copied writer state.
	* @memberof Writer
	* @constructor
	* @param {Writer} writer Writer to copy state from
	* @ignore
	*/
	function State(writer) {
		/**
		* Current head.
		* @type {Writer.Op}
		*/
		this.head = writer.head;
		/**
		* Current tail.
		* @type {Writer.Op}
		*/
		this.tail = writer.tail;
		/**
		* Current buffer length.
		* @type {number}
		*/
		this.len = writer.len;
		/**
		* Next state.
		* @type {State|null}
		*/
		this.next = writer.states;
	}
	/**
	* Constructs a new writer instance.
	* @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
	* @constructor
	*/
	function Writer() {
		/**
		* Current length.
		* @type {number}
		*/
		this.len = 0;
		/**
		* Operations head.
		* @type {Object}
		*/
		this.head = new Op(noop, 0, 0);
		/**
		* Operations tail
		* @type {Object}
		*/
		this.tail = this.head;
		/**
		* Linked forked states.
		* @type {Object|null}
		*/
		this.states = null;
	}
	var create = function create() {
		return util.Buffer ? function create_buffer_setup() {
			return (Writer.create = function create_buffer() {
				return new BufferWriter();
			})();
		} : function create_array() {
			return new Writer();
		};
	};
	/**
	* Creates a new writer.
	* @function
	* @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
	*/
	Writer.create = create();
	/**
	* Allocates a buffer of the specified size.
	* @param {number} size Buffer size
	* @returns {Uint8Array} Buffer
	*/
	Writer.alloc = function alloc(size) {
		return new util.Array(size);
	};
	/* istanbul ignore else */
	if (util.Array !== Array) Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
	/**
	* Pushes a new operation to the queue.
	* @param {function(Uint8Array, number, *)} fn Function to call
	* @param {number} len Value byte length
	* @param {number} val Value to write
	* @returns {Writer} `this`
	* @private
	*/
	Writer.prototype._push = function push(fn, len, val) {
		this.tail = this.tail.next = new Op(fn, len, val);
		this.len += len;
		return this;
	};
	function writeByte(val, buf, pos) {
		buf[pos] = val & 255;
	}
	function writeVarint32(val, buf, pos) {
		while (val > 127) {
			buf[pos++] = val & 127 | 128;
			val >>>= 7;
		}
		buf[pos] = val;
	}
	/**
	* Constructs a new varint writer operation instance.
	* @classdesc Scheduled varint writer operation.
	* @extends Op
	* @constructor
	* @param {number} len Value byte length
	* @param {number} val Value to write
	* @ignore
	*/
	function VarintOp(len, val) {
		this.len = len;
		this.next = void 0;
		this.val = val;
	}
	VarintOp.prototype = Object.create(Op.prototype);
	VarintOp.prototype.fn = writeVarint32;
	/**
	* Writes an unsigned 32 bit value as a varint.
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.uint32 = function write_uint32(value) {
		this.len += (this.tail = this.tail.next = new VarintOp((value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5, value)).len;
		return this;
	};
	/**
	* Writes a signed 32 bit value as a varint.
	* @function
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.int32 = function write_int32(value) {
		return (value |= 0) < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
	};
	/**
	* Writes a 32 bit value as a varint, zig-zag encoded.
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.sint32 = function write_sint32(value) {
		return this.uint32((value << 1 ^ value >> 31) >>> 0);
	};
	function writeVarint64(val, buf, pos) {
		var lo = val.lo, hi = val.hi;
		while (hi) {
			buf[pos++] = lo & 127 | 128;
			lo = (lo >>> 7 | hi << 25) >>> 0;
			hi >>>= 7;
		}
		while (lo > 127) {
			buf[pos++] = lo & 127 | 128;
			lo = lo >>> 7;
		}
		buf[pos++] = lo;
	}
	/**
	* Writes an unsigned 64 bit value as a varint.
	* @param {Long|number|string} value Value to write
	* @returns {Writer} `this`
	* @throws {TypeError} If `value` is a string and no long library is present.
	*/
	Writer.prototype.uint64 = function write_uint64(value) {
		var bits = LongBits.from(value);
		return this._push(writeVarint64, bits.length(), bits);
	};
	/**
	* Writes a signed 64 bit value as a varint.
	* @function
	* @param {Long|number|string} value Value to write
	* @returns {Writer} `this`
	* @throws {TypeError} If `value` is a string and no long library is present.
	*/
	Writer.prototype.int64 = Writer.prototype.uint64;
	/**
	* Writes a signed 64 bit value as a varint, zig-zag encoded.
	* @param {Long|number|string} value Value to write
	* @returns {Writer} `this`
	* @throws {TypeError} If `value` is a string and no long library is present.
	*/
	Writer.prototype.sint64 = function write_sint64(value) {
		var bits = LongBits.from(value).zzEncode();
		return this._push(writeVarint64, bits.length(), bits);
	};
	/**
	* Writes a boolish value as a varint.
	* @param {boolean} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.bool = function write_bool(value) {
		return this._push(writeByte, 1, value ? 1 : 0);
	};
	function writeFixed32(val, buf, pos) {
		buf[pos] = val & 255;
		buf[pos + 1] = val >>> 8 & 255;
		buf[pos + 2] = val >>> 16 & 255;
		buf[pos + 3] = val >>> 24;
	}
	/**
	* Writes an unsigned 32 bit value as fixed 32 bits.
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.fixed32 = function write_fixed32(value) {
		return this._push(writeFixed32, 4, value >>> 0);
	};
	/**
	* Writes a signed 32 bit value as fixed 32 bits.
	* @function
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.sfixed32 = Writer.prototype.fixed32;
	/**
	* Writes an unsigned 64 bit value as fixed 64 bits.
	* @param {Long|number|string} value Value to write
	* @returns {Writer} `this`
	* @throws {TypeError} If `value` is a string and no long library is present.
	*/
	Writer.prototype.fixed64 = function write_fixed64(value) {
		var bits = LongBits.from(value);
		return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
	};
	/**
	* Writes a signed 64 bit value as fixed 64 bits.
	* @function
	* @param {Long|number|string} value Value to write
	* @returns {Writer} `this`
	* @throws {TypeError} If `value` is a string and no long library is present.
	*/
	Writer.prototype.sfixed64 = Writer.prototype.fixed64;
	/**
	* Writes a float (32 bit).
	* @function
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.float = function write_float(value) {
		return this._push(util.float.writeFloatLE, 4, value);
	};
	/**
	* Writes a double (64 bit float).
	* @function
	* @param {number} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.double = function write_double(value) {
		return this._push(util.float.writeDoubleLE, 8, value);
	};
	var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
		buf.set(val, pos);
	} : function writeBytes_for(val, buf, pos) {
		for (var i = 0; i < val.length; ++i) buf[pos + i] = val[i];
	};
	/**
	* Writes a sequence of bytes.
	* @param {Uint8Array|string} value Buffer or base64 encoded string to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.bytes = function write_bytes(value) {
		var len = value.length >>> 0;
		if (!len) return this._push(writeByte, 1, 0);
		if (util.isString(value)) {
			var buf = Writer.alloc(len = base64.length(value));
			base64.decode(value, buf, 0);
			value = buf;
		}
		return this.uint32(len)._push(writeBytes, len, value);
	};
	/**
	* Writes a string.
	* @param {string} value Value to write
	* @returns {Writer} `this`
	*/
	Writer.prototype.string = function write_string(value) {
		var len = utf8.length(value);
		return len ? this.uint32(len)._push(utf8.write, len, value) : this._push(writeByte, 1, 0);
	};
	/**
	* Forks this writer's state by pushing it to a stack.
	* Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
	* @returns {Writer} `this`
	*/
	Writer.prototype.fork = function fork() {
		this.states = new State(this);
		this.head = this.tail = new Op(noop, 0, 0);
		this.len = 0;
		return this;
	};
	/**
	* Resets this instance to the last state.
	* @returns {Writer} `this`
	*/
	Writer.prototype.reset = function reset() {
		if (this.states) {
			this.head = this.states.head;
			this.tail = this.states.tail;
			this.len = this.states.len;
			this.states = this.states.next;
		} else {
			this.head = this.tail = new Op(noop, 0, 0);
			this.len = 0;
		}
		return this;
	};
	/**
	* Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
	* @returns {Writer} `this`
	*/
	Writer.prototype.ldelim = function ldelim() {
		var head = this.head, tail = this.tail, len = this.len;
		this.reset().uint32(len);
		if (len) {
			this.tail.next = head.next;
			this.tail = tail;
			this.len += len;
		}
		return this;
	};
	/**
	* Finishes the write operation.
	* @returns {Uint8Array} Finished buffer
	*/
	Writer.prototype.finish = function finish() {
		var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
		while (head) {
			head.fn(head.val, buf, pos);
			pos += head.len;
			head = head.next;
		}
		return buf;
	};
	Writer._configure = function(BufferWriter_) {
		BufferWriter = BufferWriter_;
		Writer.create = create();
		BufferWriter._configure();
	};
}));
//#endregion
//#region node_modules/protobufjs/src/writer_buffer.js
var require_writer_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = BufferWriter;
	var Writer = require_writer();
	(BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
	var util = require_minimal();
	/**
	* Constructs a new buffer writer instance.
	* @classdesc Wire format writer using node buffers.
	* @extends Writer
	* @constructor
	*/
	function BufferWriter() {
		Writer.call(this);
	}
	BufferWriter._configure = function() {
		/**
		* Allocates a buffer of the specified size.
		* @function
		* @param {number} size Buffer size
		* @returns {Buffer} Buffer
		*/
		BufferWriter.alloc = util._Buffer_allocUnsafe;
		BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
			buf.set(val, pos);
		} : function writeBytesBuffer_copy(val, buf, pos) {
			if (val.copy) val.copy(buf, pos, 0, val.length);
			else for (var i = 0; i < val.length;) buf[pos++] = val[i++];
		};
	};
	/**
	* @override
	*/
	BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
		if (util.isString(value)) value = util._Buffer_from(value, "base64");
		var len = value.length >>> 0;
		this.uint32(len);
		if (len) this._push(BufferWriter.writeBytesBuffer, len, value);
		return this;
	};
	function writeStringBuffer(val, buf, pos) {
		if (val.length < 40) util.utf8.write(val, buf, pos);
		else if (buf.utf8Write) buf.utf8Write(val, pos);
		else buf.write(val, pos);
	}
	/**
	* @override
	*/
	BufferWriter.prototype.string = function write_string_buffer(value) {
		var len = util.Buffer.byteLength(value);
		this.uint32(len);
		if (len) this._push(writeStringBuffer, len, value);
		return this;
	};
	/**
	* Finishes the write operation.
	* @name BufferWriter#finish
	* @function
	* @returns {Buffer} Finished buffer
	*/
	BufferWriter._configure();
}));
//#endregion
//#region node_modules/protobufjs/src/reader.js
var require_reader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Reader;
	var util = require_minimal();
	var BufferReader;
	var LongBits = util.LongBits, utf8 = util.utf8;
	/* istanbul ignore next */
	function indexOutOfRange(reader, writeLength) {
		return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
	}
	/**
	* Constructs a new reader instance using the specified buffer.
	* @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
	* @constructor
	* @param {Uint8Array} buffer Buffer to read from
	*/
	function Reader(buffer) {
		/**
		* Read buffer.
		* @type {Uint8Array}
		*/
		this.buf = buffer;
		/**
		* Read buffer position.
		* @type {number}
		*/
		this.pos = 0;
		/**
		* Read buffer length.
		* @type {number}
		*/
		this.len = buffer.length;
	}
	var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
		if (buffer instanceof Uint8Array || Array.isArray(buffer)) return new Reader(buffer);
		throw Error("illegal buffer");
	} : function create_array(buffer) {
		if (Array.isArray(buffer)) return new Reader(buffer);
		throw Error("illegal buffer");
	};
	var create = function create() {
		return util.Buffer ? function create_buffer_setup(buffer) {
			return (Reader.create = function create_buffer(buffer) {
				return util.Buffer.isBuffer(buffer) ? new BufferReader(buffer) : create_array(buffer);
			})(buffer);
		} : create_array;
	};
	/**
	* Creates a new reader using the specified buffer.
	* @function
	* @param {Uint8Array|Buffer} buffer Buffer to read from
	* @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
	* @throws {Error} If `buffer` is not a valid buffer
	*/
	Reader.create = create();
	Reader.prototype._slice = util.Array.prototype.subarray || util.Array.prototype.slice;
	/**
	* Reads a varint as an unsigned 32 bit value.
	* @function
	* @returns {number} Value read
	*/
	Reader.prototype.uint32 = (function read_uint32_setup() {
		var value = 4294967295;
		return function read_uint32() {
			value = (this.buf[this.pos] & 127) >>> 0;
			if (this.buf[this.pos++] < 128) return value;
			value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
			if (this.buf[this.pos++] < 128) return value;
			value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
			if (this.buf[this.pos++] < 128) return value;
			value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
			if (this.buf[this.pos++] < 128) return value;
			value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
			if (this.buf[this.pos++] < 128) return value;
			/* istanbul ignore if */
			if ((this.pos += 5) > this.len) {
				this.pos = this.len;
				throw indexOutOfRange(this, 10);
			}
			return value;
		};
	})();
	/**
	* Reads a varint as a signed 32 bit value.
	* @returns {number} Value read
	*/
	Reader.prototype.int32 = function read_int32() {
		return this.uint32() | 0;
	};
	/**
	* Reads a zig-zag encoded varint as a signed 32 bit value.
	* @returns {number} Value read
	*/
	Reader.prototype.sint32 = function read_sint32() {
		var value = this.uint32();
		return value >>> 1 ^ -(value & 1) | 0;
	};
	function readLongVarint() {
		var bits = new LongBits(0, 0);
		var i = 0;
		if (this.len - this.pos > 4) {
			for (; i < 4; ++i) {
				bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
				if (this.buf[this.pos++] < 128) return bits;
			}
			bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
			i = 0;
		} else {
			for (; i < 3; ++i) {
				/* istanbul ignore if */
				if (this.pos >= this.len) throw indexOutOfRange(this);
				bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
				if (this.buf[this.pos++] < 128) return bits;
			}
			bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
			return bits;
		}
		if (this.len - this.pos > 4) for (; i < 5; ++i) {
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
		}
		else for (; i < 5; ++i) {
			/* istanbul ignore if */
			if (this.pos >= this.len) throw indexOutOfRange(this);
			bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
			if (this.buf[this.pos++] < 128) return bits;
		}
		/* istanbul ignore next */
		throw Error("invalid varint encoding");
	}
	/**
	* Reads a varint as a signed 64 bit value.
	* @name Reader#int64
	* @function
	* @returns {Long} Value read
	*/
	/**
	* Reads a varint as an unsigned 64 bit value.
	* @name Reader#uint64
	* @function
	* @returns {Long} Value read
	*/
	/**
	* Reads a zig-zag encoded varint as a signed 64 bit value.
	* @name Reader#sint64
	* @function
	* @returns {Long} Value read
	*/
	/**
	* Reads a varint as a boolean.
	* @returns {boolean} Value read
	*/
	Reader.prototype.bool = function read_bool() {
		return this.uint32() !== 0;
	};
	function readFixed32_end(buf, end) {
		return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
	}
	/**
	* Reads fixed 32 bits as an unsigned 32 bit integer.
	* @returns {number} Value read
	*/
	Reader.prototype.fixed32 = function read_fixed32() {
		/* istanbul ignore if */
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		return readFixed32_end(this.buf, this.pos += 4);
	};
	/**
	* Reads fixed 32 bits as a signed 32 bit integer.
	* @returns {number} Value read
	*/
	Reader.prototype.sfixed32 = function read_sfixed32() {
		/* istanbul ignore if */
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		return readFixed32_end(this.buf, this.pos += 4) | 0;
	};
	function readFixed64() {
		/* istanbul ignore if */
		if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
		return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
	}
	/**
	* Reads fixed 64 bits.
	* @name Reader#fixed64
	* @function
	* @returns {Long} Value read
	*/
	/**
	* Reads zig-zag encoded fixed 64 bits.
	* @name Reader#sfixed64
	* @function
	* @returns {Long} Value read
	*/
	/**
	* Reads a float (32 bit) as a number.
	* @function
	* @returns {number} Value read
	*/
	Reader.prototype.float = function read_float() {
		/* istanbul ignore if */
		if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
		var value = util.float.readFloatLE(this.buf, this.pos);
		this.pos += 4;
		return value;
	};
	/**
	* Reads a double (64 bit float) as a number.
	* @function
	* @returns {number} Value read
	*/
	Reader.prototype.double = function read_double() {
		/* istanbul ignore if */
		if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
		var value = util.float.readDoubleLE(this.buf, this.pos);
		this.pos += 8;
		return value;
	};
	/**
	* Reads a sequence of bytes preceeded by its length as a varint.
	* @returns {Uint8Array} Value read
	*/
	Reader.prototype.bytes = function read_bytes() {
		var length = this.uint32(), start = this.pos, end = this.pos + length;
		/* istanbul ignore if */
		if (end > this.len) throw indexOutOfRange(this, length);
		this.pos += length;
		if (Array.isArray(this.buf)) return this.buf.slice(start, end);
		if (start === end) {
			var nativeBuffer = util.Buffer;
			return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
		}
		return this._slice.call(this.buf, start, end);
	};
	/**
	* Reads a string preceeded by its byte length as a varint.
	* @returns {string} Value read
	*/
	Reader.prototype.string = function read_string() {
		var bytes = this.bytes();
		return utf8.read(bytes, 0, bytes.length);
	};
	/**
	* Skips the specified number of bytes if specified, otherwise skips a varint.
	* @param {number} [length] Length if known, otherwise a varint is assumed
	* @returns {Reader} `this`
	*/
	Reader.prototype.skip = function skip(length) {
		if (typeof length === "number") {
			/* istanbul ignore if */
			if (this.pos + length > this.len) throw indexOutOfRange(this, length);
			this.pos += length;
		} else do
			/* istanbul ignore if */
			if (this.pos >= this.len) throw indexOutOfRange(this);
		while (this.buf[this.pos++] & 128);
		return this;
	};
	/**
	* Recursion limit.
	* @type {number}
	*/
	Reader.recursionLimit = util.recursionLimit;
	/**
	* Skips the next element of the specified wire type.
	* @param {number} wireType Wire type received
	* @param {number} [depth] Depth of recursion to control nested calls; 0 if omitted
	* @returns {Reader} `this`
	*/
	Reader.prototype.skipType = function(wireType, depth) {
		if (depth === void 0) depth = 0;
		if (depth > Reader.recursionLimit) throw Error("maximum nesting depth exceeded");
		switch (wireType) {
			case 0:
				this.skip();
				break;
			case 1:
				this.skip(8);
				break;
			case 2:
				this.skip(this.uint32());
				break;
			case 3:
				while ((wireType = this.uint32() & 7) !== 4) this.skipType(wireType, depth + 1);
				break;
			case 5:
				this.skip(4);
				break;
			/* istanbul ignore next */
			default: throw Error("invalid wire type " + wireType + " at offset " + this.pos);
		}
		return this;
	};
	Reader._configure = function(BufferReader_) {
		BufferReader = BufferReader_;
		Reader.create = create();
		BufferReader._configure();
		var fn = util.Long ? "toLong" : 		/* istanbul ignore next */ "toNumber";
		util.merge(Reader.prototype, {
			int64: function read_int64() {
				return readLongVarint.call(this)[fn](false);
			},
			uint64: function read_uint64() {
				return readLongVarint.call(this)[fn](true);
			},
			sint64: function read_sint64() {
				return readLongVarint.call(this).zzDecode()[fn](false);
			},
			fixed64: function read_fixed64() {
				return readFixed64.call(this)[fn](true);
			},
			sfixed64: function read_sfixed64() {
				return readFixed64.call(this)[fn](false);
			}
		});
	};
}));
//#endregion
//#region node_modules/protobufjs/src/reader_buffer.js
var require_reader_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = BufferReader;
	var Reader = require_reader();
	(BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
	var util = require_minimal();
	/**
	* Constructs a new buffer reader instance.
	* @classdesc Wire format reader using node buffers.
	* @extends Reader
	* @constructor
	* @param {Buffer} buffer Buffer to read from
	*/
	function BufferReader(buffer) {
		Reader.call(this, buffer);
		/**
		* Read buffer.
		* @name BufferReader#buf
		* @type {Buffer}
		*/
	}
	BufferReader._configure = function() {
		/* istanbul ignore else */
		if (util.Buffer) BufferReader.prototype._slice = util.Buffer.prototype.slice;
	};
	/**
	* @override
	*/
	BufferReader.prototype.string = function read_string_buffer() {
		var len = this.uint32();
		return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
	};
	/**
	* Reads a sequence of bytes preceeded by its length as a varint.
	* @name BufferReader#bytes
	* @function
	* @returns {Buffer} Value read
	*/
	BufferReader._configure();
}));
//#endregion
//#region node_modules/protobufjs/src/rpc/service.js
var require_service = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Service;
	var util = require_minimal();
	(Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
	/**
	* A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
	*
	* Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
	* @typedef rpc.ServiceMethodCallback
	* @template TRes extends Message<TRes>
	* @type {function}
	* @param {Error|null} error Error, if any
	* @param {TRes} [response] Response message
	* @returns {undefined}
	*/
	/**
	* A service method part of a {@link rpc.Service} as created by {@link Service.create}.
	* @typedef rpc.ServiceMethod
	* @template TReq extends Message<TReq>
	* @template TRes extends Message<TRes>
	* @type {function}
	* @param {TReq|Properties<TReq>} request Request message or plain object
	* @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
	* @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
	*/
	/**
	* Constructs a new RPC service instance.
	* @classdesc An RPC service as returned by {@link Service#create}.
	* @exports rpc.Service
	* @extends util.EventEmitter
	* @constructor
	* @param {RPCImpl} rpcImpl RPC implementation
	* @param {boolean} [requestDelimited=false] Whether requests are length-delimited
	* @param {boolean} [responseDelimited=false] Whether responses are length-delimited
	*/
	function Service(rpcImpl, requestDelimited, responseDelimited) {
		if (typeof rpcImpl !== "function") throw TypeError("rpcImpl must be a function");
		util.EventEmitter.call(this);
		/**
		* RPC implementation. Becomes `null` once the service is ended.
		* @type {RPCImpl|null}
		*/
		this.rpcImpl = rpcImpl;
		/**
		* Whether requests are length-delimited.
		* @type {boolean}
		*/
		this.requestDelimited = Boolean(requestDelimited);
		/**
		* Whether responses are length-delimited.
		* @type {boolean}
		*/
		this.responseDelimited = Boolean(responseDelimited);
	}
	/**
	* Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
	* @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
	* @param {Constructor<TReq>} requestCtor Request constructor
	* @param {Constructor<TRes>} responseCtor Response constructor
	* @param {TReq|Properties<TReq>} request Request message or plain object
	* @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
	* @returns {undefined}
	* @template TReq extends Message<TReq>
	* @template TRes extends Message<TRes>
	*/
	Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
		if (!request) throw TypeError("request must be specified");
		var self = this;
		if (!callback) return util.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);
		if (!self.rpcImpl) {
			setTimeout(function() {
				callback(Error("already ended"));
			}, 0);
			return;
		}
		try {
			return self.rpcImpl(method, requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(), function rpcCallback(err, response) {
				if (err) {
					self.emit("error", err, method);
					return callback(err);
				}
				if (response === null) {
					self.end(true);
					return;
				}
				if (!(response instanceof responseCtor)) try {
					response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
				} catch (err) {
					self.emit("error", err, method);
					return callback(err);
				}
				self.emit("data", response, method);
				return callback(null, response);
			});
		} catch (err) {
			self.emit("error", err, method);
			setTimeout(function() {
				callback(err);
			}, 0);
			return;
		}
	};
	/**
	* Ends this service and emits the `end` event.
	* @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
	* @returns {rpc.Service} `this`
	*/
	Service.prototype.end = function end(endedByRPC) {
		if (this.rpcImpl) {
			if (!endedByRPC) this.rpcImpl(null, null, null);
			this.rpcImpl = null;
			this.emit("end").off();
		}
		return this;
	};
}));
//#endregion
//#region node_modules/protobufjs/src/rpc.js
var require_rpc = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Streaming RPC helpers.
	* @namespace
	*/
	var rpc = exports;
	/**
	* RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
	* @typedef RPCImpl
	* @type {function}
	* @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
	* @param {Uint8Array} requestData Request data
	* @param {RPCImplCallback} callback Callback function
	* @returns {undefined}
	* @example
	* function rpcImpl(method, requestData, callback) {
	*     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
	*         throw Error("no such method");
	*     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
	*         callback(err, responseData);
	*     });
	* }
	*/
	/**
	* Node-style callback as used by {@link RPCImpl}.
	* @typedef RPCImplCallback
	* @type {function}
	* @param {Error|null} error Error, if any, otherwise `null`
	* @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
	* @returns {undefined}
	*/
	rpc.Service = require_service();
}));
//#endregion
//#region node_modules/protobufjs/src/roots.js
var require_roots = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Object.create(null);
}));
/**
* Named roots.
* This is where pbjs stores generated structures (the option `-r, --root` specifies a name).
* Can also be used manually to make roots available across modules.
* @name roots
* @type {Object.<string,Root>}
* @example
* // pbjs -r myroot -o compiled.js ...
*
* // in another module:
* require("./compiled.js");
*
* // in any subsequent module:
* var root = protobuf.roots["myroot"];
*/
//#endregion
//#region node_modules/protobufjs/src/index-minimal.js
var require_index_minimal = /* @__PURE__ */ __commonJSMin(((exports) => {
	var protobuf = exports;
	/**
	* Build type, one of `"full"`, `"light"` or `"minimal"`.
	* @name build
	* @type {string}
	* @const
	*/
	protobuf.build = "minimal";
	protobuf.Writer = require_writer();
	protobuf.BufferWriter = require_writer_buffer();
	protobuf.Reader = require_reader();
	protobuf.BufferReader = require_reader_buffer();
	protobuf.util = require_minimal();
	protobuf.rpc = require_rpc();
	protobuf.roots = require_roots();
	protobuf.configure = configure;
	/* istanbul ignore next */
	/**
	* Reconfigures the library according to the environment.
	* @returns {undefined}
	*/
	function configure() {
		protobuf.util._configure();
		protobuf.Writer._configure(protobuf.BufferWriter);
		protobuf.Reader._configure(protobuf.BufferReader);
	}
	configure();
}));
//#endregion
export { require_writer as a, require_aspromise as c, require_reader as i, require_roots as n, require_minimal as o, require_rpc as r, require_umd as s, require_index_minimal as t };
