import { a as __require, t as __commonJSMin } from "../../rolldown-runtime-Dr7-SnC6.mjs";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-BLBH-Gpf.mjs";
import { p as tempFile } from "../../fs-safe-advanced-CJC-NYf3.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import { t as _usingCtx } from "../../usingCtx-CoYZqMqE.mjs";
import { l as isPrivateOrLoopbackHost } from "../../net-DU4aWKLv.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { t as readByteStreamWithLimit } from "../../read-byte-stream-with-limit-CNew-qG0.mjs";
import "../../response-limit-runtime-Wtkm2X7a.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../file-access-runtime-CWjkXCju.mjs";
import "../../ssrf-runtime-Darh53Ay.mjs";
import "../../plugin-runtime-BivgNBzV.mjs";
import "../../state-paths-Bk2vDLZh.mjs";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import net from "node:net";
import { createHash } from "node:crypto";
import { gunzip } from "node:zlib";
//#region extensions/geolocation/src/config.ts
const DEFAULT_DATABASE_URL = "https://download.db-ip.com/free/dbip-city-lite-{yyyy}-{mm}.mmdb.gz";
const DEFAULT_ATTRIBUTION_TEXT = "IP Geolocation by DB-IP";
const DEFAULT_ATTRIBUTION_URL = "https://db-ip.com";
const DEFAULT_REFRESH_DAYS = 30;
function positiveRefreshDays(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : void 0;
}
function resolveGeolocationSettings(pluginConfig) {
	const config = asOptionalRecord(pluginConfig);
	const refreshDays = positiveRefreshDays(config?.refreshDays) ?? DEFAULT_REFRESH_DAYS;
	return {
		databaseUrl: normalizeOptionalString(config?.databaseUrl) ?? DEFAULT_DATABASE_URL,
		attribution: {
			text: normalizeOptionalString(config?.attributionText) ?? DEFAULT_ATTRIBUTION_TEXT,
			url: normalizeOptionalString(config?.attributionUrl) ?? DEFAULT_ATTRIBUTION_URL
		},
		refreshMs: refreshDays * 24 * 60 * 60 * 1e3
	};
}
/**
* Monthly builds appear a few days into the month, so the newest published
* release is either this month's or the previous one. Callers try in order.
*/
function expandDatabaseUrls(template, now) {
	const urls = [now, new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))].map((date) => template.replaceAll("{yyyy}", String(date.getUTCFullYear())).replaceAll("{mm}", String(date.getUTCMonth() + 1).padStart(2, "0")));
	return [...new Set(urls)];
}
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const legacyErrorMessage = `Maxmind v2 module has changed API.\n\
Upgrade instructions can be found here: \
https://github.com/runk/node-maxmind/wiki/Migration-guide\n\
If you want to use legacy library then explicitly install maxmind@1`;
	const assert = (condition, message) => {
		if (!condition) throw new Error(message);
	};
	exports.default = {
		assert,
		legacyErrorMessage
	};
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/decoder.js
var require_decoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils_1 = __importDefault(require_utils$1());
	utils_1.default.assert(typeof BigInt !== "undefined", "Apparently you are using old version of node. Please upgrade to node 10.4.x or above.");
	const MAX_INT_32 = 2147483647;
	var DataType;
	(function(DataType) {
		DataType[DataType["Extended"] = 0] = "Extended";
		DataType[DataType["Pointer"] = 1] = "Pointer";
		DataType[DataType["Utf8String"] = 2] = "Utf8String";
		DataType[DataType["Double"] = 3] = "Double";
		DataType[DataType["Bytes"] = 4] = "Bytes";
		DataType[DataType["Uint16"] = 5] = "Uint16";
		DataType[DataType["Uint32"] = 6] = "Uint32";
		DataType[DataType["Map"] = 7] = "Map";
		DataType[DataType["Int32"] = 8] = "Int32";
		DataType[DataType["Uint64"] = 9] = "Uint64";
		DataType[DataType["Uint128"] = 10] = "Uint128";
		DataType[DataType["Array"] = 11] = "Array";
		DataType[DataType["Container"] = 12] = "Container";
		DataType[DataType["EndMarker"] = 13] = "EndMarker";
		DataType[DataType["Boolean"] = 14] = "Boolean";
		DataType[DataType["Float"] = 15] = "Float";
	})(DataType || (DataType = {}));
	const pointerValueOffset = [
		0,
		2048,
		526336,
		0
	];
	const noCache = {
		get: () => void 0,
		set: () => void 0
	};
	const cursor = (value, offset) => ({
		value,
		offset
	});
	var Decoder = class {
		constructor(db, baseOffset = 0, cache = noCache) {
			this.telemetry = {};
			utils_1.default.assert(Boolean(db), "Database buffer is required");
			this.db = db;
			this.baseOffset = baseOffset;
			this.cache = cache;
		}
		decode(offset) {
			let tmp;
			const ctrlByte = this.db[offset++];
			let type = ctrlByte >> 5;
			if (type === DataType.Pointer) {
				tmp = this.decodePointer(ctrlByte, offset);
				return cursor(this.decodeFast(tmp.value).value, tmp.offset);
			}
			if (type === DataType.Extended) {
				tmp = this.db[offset] + 7;
				if (tmp < 8) throw new Error("Invalid Extended Type at offset " + offset + " val " + tmp);
				type = tmp;
				offset++;
			}
			const size = this.sizeFromCtrlByte(ctrlByte, offset);
			return this.decodeByType(type, size.offset, size.value);
		}
		decodeFast(offset) {
			const cached = this.cache.get(offset);
			if (cached) return cached;
			const result = this.decode(offset);
			this.cache.set(offset, result);
			return result;
		}
		decodeByType(type, offset, size) {
			const newOffset = offset + size;
			switch (type) {
				case DataType.Utf8String: return cursor(this.decodeString(offset, size), newOffset);
				case DataType.Map: return this.decodeMap(size, offset);
				case DataType.Uint32: return cursor(this.decodeUint(offset, size), newOffset);
				case DataType.Double: return cursor(this.decodeDouble(offset), newOffset);
				case DataType.Array: return this.decodeArray(size, offset);
				case DataType.Boolean: return cursor(this.decodeBoolean(size), offset);
				case DataType.Float: return cursor(this.decodeFloat(offset), newOffset);
				case DataType.Bytes: return cursor(this.decodeBytes(offset, size), newOffset);
				case DataType.Uint16: return cursor(this.decodeUint(offset, size), newOffset);
				case DataType.Int32: return cursor(this.decodeInt32(offset, size), newOffset);
				case DataType.Uint64: return cursor(this.decodeBigUint(offset, size), newOffset);
				case DataType.Uint128: return cursor(this.decodeBigUint(offset, size), newOffset);
			}
			throw new Error("Unknown type " + type + " at offset " + offset);
		}
		sizeFromCtrlByte(ctrlByte, offset) {
			const size = ctrlByte & 31;
			if (size < 29) return cursor(size, offset);
			if (size === 29) return cursor(29 + this.db[offset], offset + 1);
			if (size === 30) return cursor(285 + this.db.readUInt16BE(offset), offset + 2);
			return cursor(65821 + this.db.readUIntBE(offset, 3), offset + 3);
		}
		decodeBytes(offset, size) {
			return this.db.subarray(offset, offset + size);
		}
		decodePointer(ctrlByte, offset) {
			const pointerSize = ctrlByte >> 3 & 3;
			const pointer = this.baseOffset + pointerValueOffset[pointerSize];
			let packed = 0;
			if (pointerSize === 0) packed = (ctrlByte & 7) << 8 | this.db[offset];
			else if (pointerSize === 1) packed = (ctrlByte & 7) << 16 | this.db.readUInt16BE(offset);
			else if (pointerSize === 2) packed = (ctrlByte & 7) << 24 | this.db.readUIntBE(offset, 3);
			else packed = this.db.readUInt32BE(offset);
			offset += pointerSize + 1;
			return cursor(pointer + packed, offset);
		}
		decodeArray(size, offset) {
			let tmp;
			const array = new Array(size);
			for (let i = 0; i < size; i++) {
				tmp = this.decode(offset);
				offset = tmp.offset;
				array[i] = tmp.value;
			}
			return cursor(array, offset);
		}
		decodeBoolean(size) {
			return size !== 0;
		}
		decodeDouble(offset) {
			return this.db.readDoubleBE(offset);
		}
		decodeFloat(offset) {
			return this.db.readFloatBE(offset);
		}
		decodeMap(size, offset) {
			let tmp;
			let key;
			const map = {};
			for (let i = 0; i < size; i++) {
				tmp = this.decode(offset);
				key = tmp.value;
				tmp = this.decode(tmp.offset);
				offset = tmp.offset;
				map[key] = tmp.value;
			}
			return cursor(map, offset);
		}
		decodeInt32(offset, size) {
			if (size === 0) return 0;
			if (size < 4) return this.db.readUIntBE(offset, size);
			return this.db.readInt32BE(offset);
		}
		decodeUint(offset, size) {
			if (size === 0) return 0;
			if (size <= 4) return this.db.readUIntBE(offset, size);
			throw new Error(`Invalid size for unsigned integer: ${size}`);
		}
		decodeString(offset, size) {
			const newOffset = offset + size;
			return newOffset >= MAX_INT_32 ? this.db.subarray(offset, newOffset).toString("utf8") : this.db.toString("utf8", offset, newOffset);
		}
		decodeBigUint(offset, size) {
			if (size > 16) throw new Error(`Invalid size for big unsigned integer: ${size}`);
			let integer = 0n;
			for (let i = 0; i < size; i++) {
				integer <<= 8n;
				integer |= BigInt(this.db.readUInt8(offset + i));
			}
			return integer;
		}
	};
	exports.default = Decoder;
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/ip.js
var require_ip$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const v4Seg = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])";
	const v4Str = `(?:${v4Seg}\\.){3}${v4Seg}`;
	const IPv4Reg = new RegExp(`^${v4Str}$`);
	const v6Seg = "(?:[0-9a-fA-F]{1,4})";
	const IPv6Reg = new RegExp(`^(?:(?:${v6Seg}:){7}(?:${v6Seg}|:)|(?:${v6Seg}:){6}(?:${v4Str}|:${v6Seg}|:)|(?:${v6Seg}:){5}(?::${v4Str}|(?::${v6Seg}){1,2}|:)|(?:${v6Seg}:){4}(?:(?::${v6Seg}){0,1}:${v4Str}|(?::${v6Seg}){1,3}|:)|(?:${v6Seg}:){3}(?:(?::${v6Seg}){0,2}:${v4Str}|(?::${v6Seg}){1,4}|:)|(?:${v6Seg}:){2}(?:(?::${v6Seg}){0,3}:${v4Str}|(?::${v6Seg}){1,5}|:)|(?:${v6Seg}:){1}(?:(?::${v6Seg}){0,4}:${v4Str}|(?::${v6Seg}){1,6}|:)|(?::(?:(?::${v6Seg}){0,5}:${v4Str}|(?::${v6Seg}){1,7}|:)))(?:%[0-9a-zA-Z-.:]{1,})?\$`);
	const parseIPv4 = (input) => {
		const ip = input.split(".", 4);
		return [
			parseInt(ip[0]),
			parseInt(ip[1]),
			parseInt(ip[2]),
			parseInt(ip[3])
		];
	};
	const hex = (v) => {
		const h = parseInt(v, 10).toString(16);
		return h.length === 2 ? h : "0" + h;
	};
	const parseIPv6 = (input) => {
		const addr = [
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
			0
		];
		let i;
		let parsed;
		let chunk;
		const [left, right] = (input.indexOf(".") > -1 ? input.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, (match, a, b, c, d) => {
			return hex(a) + hex(b) + ":" + hex(c) + hex(d);
		}) : input).split("::", 2);
		if (left) {
			parsed = left.split(":");
			for (i = 0; i < parsed.length; i++) {
				chunk = parseInt(parsed[i], 16);
				addr[i * 2] = chunk >> 8;
				addr[i * 2 + 1] = chunk & 255;
			}
		}
		if (right) {
			parsed = right.split(":");
			const offset = 16 - parsed.length * 2;
			for (i = 0; i < parsed.length; i++) {
				chunk = parseInt(parsed[i], 16);
				addr[offset + i * 2] = chunk >> 8;
				addr[offset + (i * 2 + 1)] = chunk & 255;
			}
		}
		return addr;
	};
	const parse = (ip) => {
		return ip.indexOf(":") === -1 ? parseIPv4(ip) : parseIPv6(ip);
	};
	const bitAt = (rawAddress, idx) => {
		const bufIdx = idx >> 3;
		const bitIdx = 7 ^ idx & 7;
		return rawAddress[bufIdx] >>> bitIdx & 1;
	};
	const validate = (ip) => IPv4Reg.test(ip) || IPv6Reg.test(ip);
	exports.default = {
		bitAt,
		parse,
		validate
	};
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isLegacyFormat = exports.parseMetadata = void 0;
	const decoder_1 = __importDefault(require_decoder());
	const utils_1 = __importDefault(require_utils$1());
	const METADATA_START_MARKER = Buffer.from("ABCDEF4D61784D696E642E636F6D", "hex");
	const parseMetadata = (db) => {
		const offset = findStart(db);
		const metadata = new decoder_1.default(db, offset).decode(offset).value;
		if (!metadata) throw new Error((0, exports.isLegacyFormat)(db) ? utils_1.default.legacyErrorMessage : "Cannot parse binary database");
		utils_1.default.assert([
			24,
			28,
			32
		].indexOf(metadata.record_size) > -1, "Unsupported record size");
		return {
			binaryFormatMajorVersion: metadata.binary_format_major_version,
			binaryFormatMinorVersion: metadata.binary_format_minor_version,
			buildEpoch: /* @__PURE__ */ new Date(Number(metadata.build_epoch) * 1e3),
			databaseType: metadata.database_type,
			description: metadata.description,
			ipVersion: metadata.ip_version,
			languages: metadata.languages,
			nodeByteSize: metadata.record_size / 4,
			nodeCount: metadata.node_count,
			recordSize: metadata.record_size,
			searchTreeSize: metadata.node_count * metadata.record_size / 4,
			treeDepth: Math.pow(2, metadata.ip_version + 1)
		};
	};
	exports.parseMetadata = parseMetadata;
	const findStart = (db) => {
		let found = 0;
		let fsize = db.length - 1;
		const mlen = METADATA_START_MARKER.length - 1;
		while (found <= mlen && fsize-- > 0) found += db[fsize] === METADATA_START_MARKER[mlen - found] ? 1 : -found;
		return fsize + found;
	};
	const isLegacyFormat = (db) => {
		const structureInfoMaxSize = 20;
		for (let i = 0; i < structureInfoMaxSize; i++) {
			const delim = db.slice(db.length - 3 - i, db.length - i);
			if (delim[0] === 255 && delim[1] === 255 && delim[2] === 255) return true;
		}
		return false;
	};
	exports.isLegacyFormat = isLegacyFormat;
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/reader/walker.js
var require_walker = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const readNodeRight24 = (db) => (offset) => db.readUIntBE(offset + 3, 3);
	const readNodeLeft24 = (db) => (offset) => db.readUIntBE(offset, 3);
	const readNodeLeft28 = (db) => (offset) => (db[offset + 3] & 240) << 20 | db.readUIntBE(offset, 3);
	const readNodeRight28 = (db) => (offset) => (db[offset + 3] & 15) << 24 | db.readUIntBE(offset + 4, 3);
	const readNodeLeft32 = (db) => (offset) => db.readUInt32BE(offset);
	const readNodeRight32 = (db) => (offset) => db.readUInt32BE(offset + 4);
	exports.default = (db, recordSize) => {
		switch (recordSize) {
			case 24: return {
				left: readNodeLeft24(db),
				right: readNodeRight24(db)
			};
			case 28: return {
				left: readNodeLeft28(db),
				right: readNodeRight28(db)
			};
			case 32: return {
				left: readNodeLeft32(db),
				right: readNodeRight32(db)
			};
		}
		throw new Error("Unsupported record size");
	};
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/reader/response.js
var require_response = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));
//#endregion
//#region node_modules/.pnpm/mmdb-lib@3.0.3/node_modules/mmdb-lib/lib/index.js
var require_lib$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
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
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Reader = void 0;
	const decoder_1 = __importDefault(require_decoder());
	const ip_1 = __importDefault(require_ip$1());
	const metadata_1 = require_metadata();
	const walker_1 = __importDefault(require_walker());
	const DATA_SECTION_SEPARATOR_SIZE = 16;
	var Reader = class {
		constructor(db, opts = {}) {
			this.opts = opts;
			this.load(db);
		}
		load(db) {
			if (!Buffer.isBuffer(db)) throw new Error(`mmdb-lib expects an instance of Buffer, got: ${typeof db}`);
			this.db = db;
			this.metadata = (0, metadata_1.parseMetadata)(this.db);
			this.decoder = new decoder_1.default(this.db, this.metadata.searchTreeSize + DATA_SECTION_SEPARATOR_SIZE, this.opts.cache);
			this.walker = (0, walker_1.default)(this.db, this.metadata.recordSize);
			this.ipv4StartNodeNumber = this.ipv4Start();
		}
		get(ipAddress) {
			const [data] = this.getWithPrefixLength(ipAddress);
			return data;
		}
		getWithPrefixLength(ipAddress) {
			const [pointer, prefixLength] = this.findAddressInTree(ipAddress);
			return [pointer ? this.resolveDataPointer(pointer) : null, prefixLength];
		}
		findAddressInTree(ipAddress) {
			const rawAddress = ip_1.default.parse(ipAddress);
			const nodeCount = this.metadata.nodeCount;
			const bitLength = rawAddress.length * 8;
			let bit;
			let nodeNumber = 0;
			let offset;
			let depth = 0;
			if (rawAddress.length === 4) nodeNumber = this.ipv4StartNodeNumber;
			for (; depth < bitLength && nodeNumber < nodeCount; depth++) {
				bit = ip_1.default.bitAt(rawAddress, depth);
				offset = nodeNumber * this.metadata.nodeByteSize;
				nodeNumber = bit ? this.walker.right(offset) : this.walker.left(offset);
			}
			if (nodeNumber > nodeCount) return [nodeNumber, depth];
			return [null, depth];
		}
		resolveDataPointer(pointer) {
			const resolved = pointer - this.metadata.nodeCount + this.metadata.searchTreeSize;
			return this.decoder.decodeFast(resolved).value;
		}
		ipv4Start() {
			if (this.metadata.ipVersion === 4) return 0;
			const nodeCount = this.metadata.nodeCount;
			let pointer = 0;
			let i = 0;
			for (; i < 96 && pointer < nodeCount; i++) {
				const offset = pointer * this.metadata.nodeByteSize;
				pointer = this.walker.left(offset);
			}
			return pointer;
		}
	};
	exports.Reader = Reader;
	__exportStar(require_response(), exports);
}));
//#endregion
//#region node_modules/.pnpm/tiny-lru@13.0.0/node_modules/tiny-lru/dist/tiny-lru.cjs
/**
* tiny-lru
*
* @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
* @license BSD-3-Clause
* @version 13.0.0
*/
var require_tiny_lru = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* A high-performance Least Recently Used (LRU) cache implementation with optional TTL support.
	* Items are automatically evicted when the cache reaches its maximum size,
	* removing the least recently used items first. All core operations (get, set, delete) are O(1).
	*
	* @class LRU
	*/
	var LRU = class {
		#stats;
		#onEvict;
		/**
		* Creates a new LRU cache instance.
		* Note: Constructor does not validate parameters. Use lru() factory function for parameter validation.
		*
		* @constructor
		* @param {number} [max=0] - Maximum number of items to store. 0 means unlimited.
		* @param {number} [ttl=0] - Time to live in milliseconds. 0 means no expiration.
		* @param {boolean} [resetTTL=false] - Whether to reset TTL when updating existing items via set().
		*/
		constructor(max = 0, ttl = 0, resetTTL = false) {
			this.first = null;
			this.items = Object.create(null);
			this.last = null;
			this.max = max;
			this.resetTTL = resetTTL;
			this.size = 0;
			this.ttl = ttl;
			this.#stats = {
				hits: 0,
				misses: 0,
				sets: 0,
				deletes: 0,
				evictions: 0
			};
			this.#onEvict = null;
		}
		/**
		* Removes all items from the cache.
		*
		* @returns {LRU} The LRU instance for method chaining.
		*/
		clear() {
			for (let x = this.first; x !== null;) {
				const next = x.next;
				x.prev = null;
				x.next = null;
				x = next;
			}
			this.first = null;
			this.items = Object.create(null);
			this.last = null;
			this.size = 0;
			this.#stats.hits = 0;
			this.#stats.misses = 0;
			this.#stats.sets = 0;
			this.#stats.deletes = 0;
			this.#stats.evictions = 0;
			return this;
		}
		/**
		* Removes an item from the cache by key.
		*
		* @param {string} key - The key of the item to delete.
		* @returns {LRU} The LRU instance for method chaining.
		*/
		delete(key) {
			const item = this.items[key];
			if (item !== void 0) {
				delete this.items[key];
				this.size--;
				this.#stats.deletes++;
				this.#unlink(item);
				item.prev = null;
				item.next = null;
			}
			return this;
		}
		/**
		* Returns an array of [key, value] pairs for the specified keys.
		* When no keys provided, returns all entries in LRU order.
		* When keys provided, order matches the input array.
		*
		* @param {string[]} [keys=this.keys()] - Array of keys to get entries for. Defaults to all keys.
		* @returns {Array<Array<*>>} Array of [key, value] pairs.
		*/
		entries(keys) {
			if (keys === void 0) keys = this.keys();
			const result = Array.from({ length: keys.length });
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const item = this.items[key];
				result[i] = [key, item !== void 0 ? item.value : void 0];
			}
			return result;
		}
		/**
		* Removes the least recently used item from the cache.
		*
		* @returns {LRU} The LRU instance for method chaining.
		*/
		evict() {
			if (this.size === 0) return this;
			const item = this.first;
			delete this.items[item.key];
			this.#stats.evictions++;
			if (--this.size === 0) {
				this.first = null;
				this.last = null;
			} else this.#unlink(item);
			item.prev = null;
			item.next = null;
			if (this.#onEvict !== null) this.#onEvict({
				key: item.key,
				value: item.value,
				expiry: item.expiry
			});
			return this;
		}
		/**
		* Returns the expiration timestamp for a given key.
		*
		* @param {string} key - The key to check expiration for.
		* @returns {number|undefined} The expiration timestamp in milliseconds, or undefined if key doesn't exist.
		*/
		expiresAt(key) {
			const item = this.items[key];
			return item !== void 0 ? item.expiry : void 0;
		}
		/**
		* Checks if an item has expired.
		*
		* @param {Object} item - The cache item to check.
		* @returns {boolean} True if the item has expired, false otherwise.
		* @private
		*/
		#isExpired(item) {
			if (this.ttl === 0 || item.expiry === 0) return false;
			return item.expiry <= Date.now();
		}
		/**
		* Retrieves a value from the cache by key without updating LRU order.
		* Note: Does not perform TTL checks or remove expired items.
		*
		* @param {string} key - The key to retrieve.
		* @returns {*} The value associated with the key, or undefined if not found.
		*/
		peek(key) {
			const item = this.items[key];
			return item !== void 0 ? item.value : void 0;
		}
		/**
		* Retrieves a value from the cache by key. Updates the item's position to most recently used.
		*
		* @param {string} key - The key to retrieve.
		* @returns {*} The value associated with the key, or undefined if not found or expired.
		*/
		get(key) {
			const item = this.items[key];
			if (item !== void 0) {
				if (!this.#isExpired(item)) {
					this.moveToEnd(item);
					this.#stats.hits++;
					return item.value;
				}
				this.delete(key);
				this.#stats.misses++;
				return;
			}
			this.#stats.misses++;
		}
		/**
		* Checks if a key exists in the cache.
		*
		* @param {string} key - The key to check for.
		* @returns {boolean} True if the key exists and is not expired, false otherwise.
		*/
		has(key) {
			const item = this.items[key];
			return item !== void 0 && !this.#isExpired(item);
		}
		/**
		* Unlinks an item from the doubly-linked list.
		* Updates first/last pointers if needed.
		* Does NOT clear the item's prev/next pointers or delete from items map.
		*
		* @private
		*/
		#unlink(item) {
			if (item.prev !== null) item.prev.next = item.next;
			if (item.next !== null) item.next.prev = item.prev;
			if (this.first === item) this.first = item.next;
			if (this.last === item) this.last = item.prev;
		}
		/**
		* Efficiently moves an item to the end of the LRU list (most recently used position).
		* This is an internal optimization method that avoids the overhead of the full set() operation
		* when only LRU position needs to be updated.
		*
		* @param {Object} item - The cache item with prev/next pointers to reposition.
		* @private
		*/
		moveToEnd(item) {
			if (this.last === item) return;
			this.#unlink(item);
			item.prev = this.last;
			item.next = null;
			this.last.next = item;
			this.last = item;
		}
		/**
		* Returns an array of all keys in the cache, ordered from least to most recently used.
		*
		* @returns {string[]} Array of keys in LRU order.
		*/
		keys() {
			const result = Array.from({ length: this.size });
			let x = this.first;
			let i = 0;
			while (x !== null) {
				result[i++] = x.key;
				x = x.next;
			}
			return result;
		}
		/**
		* Sets a value in the cache and returns any evicted item.
		*
		* @param {string} key - The key to set.
		* @param {*} value - The value to store.
		* @returns {Object|null} The evicted item (if any) with shape {key, value, expiry}, or null.
		*/
		setWithEvicted(key, value) {
			let evicted = null;
			let item = this.items[key];
			if (item !== void 0) {
				item.value = value;
				if (this.resetTTL) item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;
				this.moveToEnd(item);
			} else {
				if (this.max > 0 && this.size === this.max) {
					evicted = {
						key: this.first.key,
						value: this.first.value,
						expiry: this.first.expiry
					};
					this.evict();
				}
				item = this.items[key] = {
					expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
					key,
					prev: this.last,
					next: null,
					value
				};
				if (++this.size === 1) this.first = item;
				else this.last.next = item;
				this.last = item;
			}
			this.#stats.sets++;
			return evicted;
		}
		/**
		* Sets a value in the cache. Updates the item's position to most recently used.
		*
		* @param {string} key - The key to set.
		* @param {*} value - The value to store.
		* @returns {LRU} The LRU instance for method chaining.
		*/
		set(key, value) {
			let item = this.items[key];
			if (item !== void 0) {
				item.value = value;
				if (this.resetTTL) item.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl;
				this.moveToEnd(item);
			} else {
				if (this.max > 0 && this.size === this.max) this.evict();
				item = this.items[key] = {
					expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
					key,
					prev: this.last,
					next: null,
					value
				};
				if (++this.size === 1) this.first = item;
				else this.last.next = item;
				this.last = item;
			}
			this.#stats.sets++;
			return this;
		}
		/**
		* Returns an array of all values in the cache for the specified keys.
		* When no keys provided, returns all values in LRU order.
		* When keys provided, order matches the input array.
		*
		* @param {string[]} [keys] - Array of keys to get values for. Defaults to all keys.
		* @returns {Array<*>} Array of values corresponding to the keys.
		*/
		values(keys) {
			if (keys === void 0) {
				const result = Array.from({ length: this.size });
				let i = 0;
				for (let x = this.first; x !== null; x = x.next) result[i++] = x.value;
				return result;
			}
			const result = Array.from({ length: keys.length });
			for (let i = 0; i < keys.length; i++) {
				const item = this.items[keys[i]];
				result[i] = item !== void 0 ? item.value : void 0;
			}
			return result;
		}
		/**
		* Iterate over cache items in LRU order (least to most recent).
		* Note: This method directly accesses items from the linked list without calling
		* get() or peek(), so it does not update LRU order or check TTL expiration during iteration.
		*
		* @param {function(*, any, LRU): void} callback - Function to call for each item. Signature: callback(value, key, cache)
		* @param {Object} [thisArg] - Value to use as `this` when executing callback.
		* @returns {LRU} The LRU instance for method chaining.
		*/
		forEach(callback, thisArg) {
			for (let x = this.first; x !== null; x = x.next) callback.call(thisArg, x.value, x.key, this);
			return this;
		}
		/**
		* Batch retrieve multiple items.
		*
		* @param {string[]} keys - Array of keys to retrieve.
		* @returns {Object} Object mapping keys to values (undefined for missing/expired keys).
		*/
		getMany(keys) {
			const result = Object.create(null);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				result[key] = this.get(key);
			}
			return result;
		}
		/**
		* Batch existence check - returns true if ALL keys exist.
		*
		* @param {string[]} keys - Array of keys to check.
		* @returns {boolean} True if all keys exist and are not expired.
		*/
		hasAll(keys) {
			for (let i = 0; i < keys.length; i++) if (!this.has(keys[i])) return false;
			return true;
		}
		/**
		* Batch existence check - returns true if ANY key exists.
		*
		* @param {string[]} keys - Array of keys to check.
		* @returns {boolean} True if any key exists and is not expired.
		*/
		hasAny(keys) {
			for (let i = 0; i < keys.length; i++) if (this.has(keys[i])) return true;
			return false;
		}
		/**
		* Remove expired items without affecting LRU order.
		* Unlike get(), this does not move items to the end.
		*
		* @returns {number} Number of expired items removed.
		*/
		cleanup() {
			if (this.ttl === 0 || this.size === 0) return 0;
			let removed = 0;
			for (let x = this.first; x !== null;) {
				const next = x.next;
				if (this.#isExpired(x)) {
					const key = x.key;
					if (this.items[key] !== void 0) {
						delete this.items[key];
						this.size--;
						removed++;
						this.#unlink(x);
						x.prev = null;
						x.next = null;
					}
				}
				x = next;
			}
			if (removed > 0) this.#rebuildList();
			return removed;
		}
		/**
		* Serialize cache to JSON-compatible format.
		*
		* @returns {Array<{key: any, value: *, expiry: number}>} Array of cache items.
		*/
		toJSON() {
			const result = [];
			for (let x = this.first; x !== null; x = x.next) result.push({
				key: x.key,
				value: x.value,
				expiry: x.expiry
			});
			return result;
		}
		/**
		* Get cache statistics.
		*
		* @returns {Object} Statistics object with hits, misses, sets, deletes, evictions counts.
		*/
		stats() {
			return { ...this.#stats };
		}
		/**
		* Register callback for evicted items.
		*
		* @param {function(Object): void} callback - Function called when item is evicted. Receives {key, value, expiry}.
		* @returns {LRU} The LRU instance for method chaining.
		*/
		onEvict(callback) {
			if (typeof callback !== "function") throw new TypeError("onEvict callback must be a function");
			this.#onEvict = callback;
			return this;
		}
		/**
		* Get counts of items by TTL status.
		*
		* @returns {Object} Object with valid, expired, and noTTL counts.
		*/
		sizeByTTL() {
			if (this.ttl === 0) return {
				valid: this.size,
				expired: 0,
				noTTL: this.size
			};
			const now = Date.now();
			let valid = 0;
			let expired = 0;
			let noTTL = 0;
			for (let x = this.first; x !== null; x = x.next) if (x.expiry === 0) {
				noTTL++;
				valid++;
			} else if (x.expiry > now) valid++;
			else expired++;
			return {
				valid,
				expired,
				noTTL
			};
		}
		/**
		* Get keys filtered by TTL status.
		*
		* @returns {Object} Object with valid, expired, and noTTL arrays of keys.
		*/
		keysByTTL() {
			if (this.ttl === 0) return {
				valid: this.keys(),
				expired: [],
				noTTL: this.keys()
			};
			const now = Date.now();
			const valid = [];
			const expired = [];
			const noTTL = [];
			for (let x = this.first; x !== null; x = x.next) if (x.expiry === 0) {
				valid.push(x.key);
				noTTL.push(x.key);
			} else if (x.expiry > now) valid.push(x.key);
			else expired.push(x.key);
			return {
				valid,
				expired,
				noTTL
			};
		}
		/**
		* Get values filtered by TTL status.
		*
		* @returns {Object} Object with valid, expired, and noTTL arrays of values.
		*/
		valuesByTTL() {
			const keysByTTL = this.keysByTTL();
			return {
				valid: this.values(keysByTTL.valid),
				expired: this.values(keysByTTL.expired),
				noTTL: this.values(keysByTTL.noTTL)
			};
		}
		/**
		* Rebuild the doubly-linked list after cleanup by deleting expired items.
		* This removes nodes that were deleted during cleanup.
		*
		* @private
		*/
		#rebuildList() {
			if (this.size === 0) {
				this.first = null;
				this.last = null;
				return;
			}
			const keys = this.keys();
			this.first = null;
			this.last = null;
			for (let i = 0; i < keys.length; i++) {
				const item = this.items[keys[i]];
				if (item !== null && item !== void 0) {
					if (this.first === null) {
						this.first = item;
						item.prev = null;
					} else {
						item.prev = this.last;
						this.last.next = item;
					}
					item.next = null;
					this.last = item;
				}
			}
		}
	};
	/**
	* Factory function to create a new LRU cache instance with parameter validation.
	*
	* @function lru
	* @param {number} [max=1000] - Maximum number of items to store. Must be >= 0. Use 0 for unlimited size.
	* @param {number} [ttl=0] - Time to live in milliseconds. Must be >= 0. Use 0 for no expiration.
	* @param {boolean} [resetTTL=false] - Whether to reset TTL when updating existing items via set().
	* @returns {LRU} A new LRU cache instance.
	* @throws {TypeError} When parameters are invalid (negative numbers or wrong types).
	*/
	function lru(max = 1e3, ttl = 0, resetTTL = false) {
		if (isNaN(max) || max < 0) throw new TypeError("Invalid max value");
		if (isNaN(ttl) || ttl < 0) throw new TypeError("Invalid ttl value");
		if (typeof resetTTL !== "boolean") throw new TypeError("Invalid resetTTL value");
		return new LRU(max, ttl, resetTTL);
	}
	exports.LRU = LRU;
	exports.lru = lru;
}));
//#endregion
//#region node_modules/.pnpm/maxmind@5.0.7/node_modules/maxmind/lib/fs.js
var require_fs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const fs_1 = __importDefault(__require("fs"));
	const util_1 = __importDefault(__require("util"));
	exports.default = {
		existsSync: fs_1.default.existsSync,
		readFile: util_1.default.promisify(fs_1.default.readFile),
		watchFile: fs_1.default.watchFile,
		createReadStream: fs_1.default.createReadStream,
		stat: util_1.default.promisify(fs_1.default.stat)
	};
}));
//#endregion
//#region node_modules/.pnpm/maxmind@5.0.7/node_modules/maxmind/lib/ip.js
var require_ip = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	const net_1 = __importDefault(__require("net"));
	const parseIPv4 = (input) => {
		const ip = input.split(".", 4);
		return [
			parseInt(ip[0]),
			parseInt(ip[1]),
			parseInt(ip[2]),
			parseInt(ip[3])
		];
	};
	const hex = (v) => {
		v = parseInt(v, 10).toString(16);
		return v.length === 2 ? v : "0" + v;
	};
	const parseIPv6 = (ip) => {
		const addr = [
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
			0
		];
		let i;
		let parsed;
		let chunk;
		if (ip.indexOf(".") > -1) ip = ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, (match, a, b, c, d) => {
			return hex(a) + hex(b) + ":" + hex(c) + hex(d);
		});
		const [left, right] = ip.split("::", 2);
		if (left) {
			parsed = left.split(":");
			for (i = 0; i < parsed.length; i++) {
				chunk = parseInt(parsed[i], 16);
				addr[i * 2] = chunk >> 8;
				addr[i * 2 + 1] = chunk & 255;
			}
		}
		if (right) {
			parsed = right.split(":");
			const offset = 16 - parsed.length * 2;
			for (i = 0; i < parsed.length; i++) {
				chunk = parseInt(parsed[i], 16);
				addr[offset + i * 2] = chunk >> 8;
				addr[offset + (i * 2 + 1)] = chunk & 255;
			}
		}
		return addr;
	};
	const parse = (ip) => {
		return ip.indexOf(":") === -1 ? parseIPv4(ip) : parseIPv6(ip);
	};
	const bitAt = (rawAddress, idx) => {
		const bufIdx = idx >> 3;
		const bitIdx = 7 ^ idx & 7;
		return rawAddress[bufIdx] >>> bitIdx & 1;
	};
	const validate = (ip) => {
		const version = net_1.default.isIP(ip);
		return version === 4 || version === 6;
	};
	exports.default = {
		bitAt,
		parse,
		validate
	};
}));
//#endregion
//#region node_modules/.pnpm/maxmind@5.0.7/node_modules/maxmind/lib/is-gzip.js
var require_is_gzip = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = (buf) => {
		if (!buf || buf.length < 3) return false;
		return buf[0] === 31 && buf[1] === 139 && buf[2] === 8;
	};
}));
//#endregion
//#region node_modules/.pnpm/maxmind@5.0.7/node_modules/maxmind/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const concat2 = (a, b) => {
		return a << 8 | b;
	};
	const concat3 = (a, b, c) => {
		return a << 16 | b << 8 | c;
	};
	const concat4 = (a, b, c, d) => {
		return a << 24 | b << 16 | c << 8 | d;
	};
	exports.default = {
		concat2,
		concat3,
		concat4,
		legacyErrorMessage: `Maxmind v2 module has changed API.\n\
Upgrade instructions can be found here: \
https://github.com/runk/node-maxmind/wiki/Migration-guide\n\
If you want to use legacy libary then explicitly install maxmind@1`
	};
}));
//#endregion
//#region extensions/geolocation/src/database-store.ts
/**
* Owns the on-disk MMDB copy: downloads it on first use, reuses it until it
* ages past the refresh window, and keeps one opened reader per process.
*/
var import_lib = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
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
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Reader = exports.validate = exports.init = exports.openSync = exports.open = void 0;
	const assert_1 = __importDefault(__require("assert"));
	const mmdb_lib_1 = require_lib$1();
	Object.defineProperty(exports, "Reader", {
		enumerable: true,
		get: function() {
			return mmdb_lib_1.Reader;
		}
	});
	const tiny_lru_1 = require_tiny_lru();
	const fs_1 = __importDefault(require_fs());
	const ip_1 = __importDefault(require_ip());
	const is_gzip_1 = __importDefault(require_is_gzip());
	const utils_1 = __importDefault(require_utils());
	const LARGE_FILE_THRESHOLD = 536870912;
	const STREAM_WATERMARK = 8388608;
	const readLargeFile = async (filepath, size) => new Promise((resolve, reject) => {
		let buffer = Buffer.allocUnsafe(size);
		let offset = 0;
		const stream = fs_1.default.createReadStream(filepath, { highWaterMark: STREAM_WATERMARK });
		stream.on("data", (chunk) => {
			if (Buffer.isBuffer(chunk)) {
				chunk.copy(buffer, offset);
				offset += chunk.length;
			} else {
				const bufferChunk = Buffer.from(chunk);
				bufferChunk.copy(buffer, offset);
				offset += bufferChunk.length;
			}
		});
		stream.on("end", () => {
			stream.close();
			resolve(buffer);
		});
		stream.on("error", (err) => {
			reject(err);
		});
	});
	const readFile = async (filepath) => {
		const fstat = await fs_1.default.stat(filepath);
		return fstat.size < LARGE_FILE_THRESHOLD ? fs_1.default.readFile(filepath) : readLargeFile(filepath, fstat.size);
	};
	const open = async (filepath, opts, cb) => {
		(0, assert_1.default)(!cb, utils_1.default.legacyErrorMessage);
		const database = await readFile(filepath);
		if ((0, is_gzip_1.default)(database)) throw new Error("Looks like you are passing in a file in gzip format, please use mmdb database instead.");
		const cache = (0, tiny_lru_1.lru)(opts?.cache?.max || 1e4);
		const reader = new mmdb_lib_1.Reader(database, { cache });
		if (opts && !!opts.watchForUpdates) {
			if (opts.watchForUpdatesHook && typeof opts.watchForUpdatesHook !== "function") throw new Error("opts.watchForUpdatesHook should be a function");
			const watcherOptions = { persistent: opts.watchForUpdatesNonPersistent !== true };
			fs_1.default.watchFile(filepath, watcherOptions, async () => {
				const waitExists = async () => {
					for (let i = 0; i < 3; i++) {
						if (fs_1.default.existsSync(filepath)) return true;
						await new Promise((a) => setTimeout(a, 500));
					}
					return false;
				};
				if (!await waitExists()) return;
				const updatedDatabase = await readFile(filepath);
				cache.clear();
				reader.load(updatedDatabase);
				if (opts.watchForUpdatesHook) opts.watchForUpdatesHook();
			});
		}
		return reader;
	};
	exports.open = open;
	const openSync = () => {
		throw new Error(utils_1.default.legacyErrorMessage);
	};
	exports.openSync = openSync;
	const init = () => {
		throw new Error(utils_1.default.legacyErrorMessage);
	};
	exports.init = init;
	exports.validate = ip_1.default.validate;
	__exportStar(require_lib$1(), exports);
	exports.default = {
		init: exports.init,
		open: exports.open,
		openSync: exports.openSync,
		validate: ip_1.default.validate
	};
})))();
const gunzipAsync = promisify(gunzip);
const MAX_COMPRESSED_BYTES = 268435456;
const MAX_DATABASE_BYTES = 536870912;
const DOWNLOAD_TIMEOUT_MS = 12e4;
function databasePath(stateDir, databaseUrl) {
	const digest = createHash("sha256").update(databaseUrl).digest("hex").slice(0, 12);
	return path.join(stateDir, "geolocation", `ip-city-${digest}.mmdb`);
}
async function readFileAge(file, now) {
	try {
		const stat = await fs.stat(file);
		return now.getTime() - stat.mtimeMs;
	} catch {
		return;
	}
}
async function downloadDatabase(deps, target) {
	const urls = expandDatabaseUrls(deps.settings.databaseUrl, deps.now());
	const failures = [];
	for (const url of urls) try {
		const response = await deps.fetchImpl(url, { signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS) });
		if (!response.ok) {
			failures.push(`${url} -> HTTP ${response.status}`);
			continue;
		}
		if (!response.body) throw new Error("response had no body");
		const raw = await readByteStreamWithLimit(response.body.values(), {
			maxBytes: MAX_COMPRESSED_BYTES,
			onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`response exceeded the ${maxBytes} byte cap`)
		});
		const body = url.endsWith(".gz") ? await gunzipAsync(raw, { maxOutputLength: MAX_DATABASE_BYTES }) : raw;
		const reader = new import_lib.Reader(body);
		try {
			try {
				var _usingCtx$1 = _usingCtx();
				await fs.mkdir(path.dirname(target), { recursive: true });
				const directory = await fs.realpath(path.dirname(target));
				const staged = _usingCtx$1.a(await tempFile({
					rootDir: directory,
					prefix: "ip-city",
					onCleanupError: (error) => {
						throw error;
					}
				}));
				await fs.writeFile(staged.path, body, { flag: "wx" });
				await fs.rename(staged.path, path.join(directory, path.basename(target)));
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				await _usingCtx$1.d();
			}
		} catch (err) {
			deps.logger?.warn(`geolocation: could not cache the downloaded database, serving it from memory: ${err instanceof Error ? err.message : String(err)}`);
		}
		deps.logger?.info(`geolocation: downloaded ${body.byteLength} bytes from ${url}`);
		return reader;
	} catch (err) {
		failures.push(`${url} -> ${err instanceof Error ? err.message : String(err)}`);
	}
	throw new Error(`geolocation database download failed: ${failures.join("; ")}`);
}
/**
* Returns a reader, downloading or refreshing the database as needed. A stale
* copy is preferred over failing: a refresh error must not take lookups down.
*/
function createGeolocationDatabaseStore(deps) {
	const target = databasePath(deps.stateDir, deps.settings.databaseUrl);
	let opened;
	let inFlight;
	const openFromDisk = async () => {
		const age = await readFileAge(target, deps.now());
		let downloaded;
		if (age === void 0) downloaded = await downloadDatabase(deps, target);
		else if (age > deps.settings.refreshMs) try {
			downloaded = await downloadDatabase(deps, target);
		} catch (err) {
			deps.logger?.warn(`geolocation: refresh failed, serving the cached database: ${err instanceof Error ? err.message : String(err)}`);
		}
		const reader = downloaded ?? new import_lib.Reader(await fs.readFile(target));
		opened = {
			reader,
			loadedAt: deps.now().getTime()
		};
		return { lookup: (ip) => reader.get(ip) };
	};
	return {
		async load() {
			const current = opened;
			if (current && deps.now().getTime() - current.loadedAt <= deps.settings.refreshMs) return { lookup: (ip) => current.reader.get(ip) };
			inFlight ??= openFromDisk().finally(() => {
				inFlight = void 0;
			});
			return await inFlight;
		},
		databaseFile: target
	};
}
//#endregion
//#region extensions/geolocation/src/lookup.ts
function englishName(names) {
	const value = names?.en?.trim();
	return value ? value : void 0;
}
/**
* Returns undefined when the database has no usable placement for the address,
* so callers can distinguish "not found" from an empty-but-present answer.
*/
function projectGeolocationRecord(record) {
	if (!record) return;
	const result = {
		...englishName(record.city?.names) ? { city: englishName(record.city?.names) } : {},
		...englishName(record.subdivisions?.[0]?.names) ? { region: englishName(record.subdivisions?.[0]?.names) } : {},
		...englishName(record.country?.names) ? { country: englishName(record.country?.names) } : {},
		...record.country?.iso_code ? { countryCode: record.country.iso_code } : {}
	};
	return Object.keys(result).length > 0 ? result : void 0;
}
//#endregion
//#region extensions/geolocation/src/lookup-route.ts
function sendJson(res, status, body) {
	const payload = JSON.stringify(body);
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"content-length": Buffer.byteLength(payload)
	});
	res.end(payload);
}
function createGeolocationLookupHandler(deps) {
	return async (req, res) => {
		const url = new URL(req.url ?? "/", "http://localhost");
		if (!url.pathname.endsWith("/lookup")) return false;
		const ip = url.searchParams.get("ip")?.trim() ?? "";
		if (!net.isIP(ip)) {
			sendJson(res, 400, { error: "ip must be a valid IPv4 or IPv6 address" });
			return true;
		}
		if (isPrivateOrLoopbackHost(ip)) {
			sendJson(res, 200, {
				found: false,
				attribution: deps.settings.attribution
			});
			return true;
		}
		await getPluginRuntimeGatewayRequestScope()?.revalidate?.();
		try {
			const location = projectGeolocationRecord((await deps.loadDatabase()).lookup(ip));
			sendJson(res, 200, {
				found: Boolean(location),
				...location,
				attribution: deps.settings.attribution
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			deps.logger?.warn(`geolocation: lookup unavailable: ${message}`);
			sendJson(res, 503, { error: "geolocation database unavailable" });
		}
		return true;
	};
}
//#endregion
//#region extensions/geolocation/index.ts
/**
* Geolocation plugin entry. It exposes one authenticated lookup route and keeps
* the database download lazy, so an install that nobody queries costs nothing.
*/
var geolocation_default = definePluginEntry({
	id: "geolocation",
	name: "Geolocation Plugin",
	description: "Bundled geolocation plugin",
	register(api) {
		const settings = resolveGeolocationSettings(api.pluginConfig);
		const store = createGeolocationDatabaseStore({
			stateDir: resolveStateDir(),
			settings,
			now: () => /* @__PURE__ */ new Date(),
			fetchImpl: fetch,
			logger: api.logger
		});
		api.registerHttpRoute({
			path: "/plugins/geolocation",
			auth: "gateway",
			match: "prefix",
			handler: createGeolocationLookupHandler({
				loadDatabase: () => store.load(),
				settings,
				logger: api.logger
			})
		});
	}
});
//#endregion
export { geolocation_default as default };
