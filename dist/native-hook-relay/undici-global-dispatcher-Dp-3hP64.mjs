import { o as toErrorObject, t as formatErrorMessage } from "./errors-Cy4ii9Fo.mjs";
import { F as normalizeLowercaseStringOrEmpty, P as isRecord, R as normalizeOptionalString } from "./utils-C25eiuh1.mjs";
import { tt as expectDefined } from "./redact-0yyk4gHy.mjs";
import { a as getLogger, d as isVerbose, l as defaultRuntime, r as writeRootConsoleLine, t as createSubsystemLogger } from "./subsystem-DA9--fnw.mjs";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import "node:fs/promises";
import chalk, { Chalk } from "chalk";
import { EventEmitter } from "node:events";
import * as net$1 from "node:net";
import net from "node:net";
import { isProxylineDispatcher } from "@openclaw/proxyline/dispatcher-brand";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region packages/net-policy/src/ip.ts
var import_ipaddr = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root) {
		"use strict";
		const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
		const ipv4Regexes = {
			fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
			threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
			twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
			longValue: new RegExp(`^${ipv4Part}$`, "i")
		};
		const octalRegex = new RegExp(`^0[0-7]+$`, "i");
		const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
		const zoneIndex = "%[0-9a-z]{1,}";
		const ipv6Part = "(?:[0-9a-f]+::?)+";
		const ipv6Regexes = {
			zoneIndex: new RegExp(zoneIndex, "i"),
			"native": new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
			deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`, "i"),
			transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`, "i")
		};
		function expandIPv6(string, parts) {
			if (string.indexOf("::") !== string.lastIndexOf("::")) return null;
			let colonCount = 0;
			let lastColon = -1;
			let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
			let replacement, replacementCount;
			if (zoneId) {
				zoneId = zoneId.substring(1);
				string = string.replace(/%.+$/, "");
			}
			while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) colonCount++;
			if (string.substr(0, 2) === "::") colonCount--;
			if (string.substr(-2, 2) === "::") colonCount--;
			if (colonCount >= parts) return null;
			replacementCount = parts - colonCount;
			replacement = ":";
			while (replacementCount--) replacement += "0:";
			string = string.replace("::", replacement);
			if (string[0] === ":") string = string.slice(1);
			if (string[string.length - 1] === ":") string = string.slice(0, -1);
			parts = (function() {
				const ref = string.split(":");
				const results = [];
				for (let i = 0; i < ref.length; i++) results.push(ref[i].length > 4 ? NaN : parseInt(ref[i], 16));
				return results;
			})();
			return {
				parts,
				zoneId
			};
		}
		function matchCIDR(first, second, partSize, cidrBits) {
			if (first.length !== second.length) throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
			let part = 0;
			let shift;
			while (cidrBits > 0) {
				shift = partSize - cidrBits;
				if (shift < 0) shift = 0;
				if (first[part] >> shift !== second[part] >> shift) return false;
				cidrBits -= partSize;
				part += 1;
			}
			return true;
		}
		function parseIntAuto(string) {
			if (hexRegex.test(string)) return parseInt(string, 16);
			if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
				if (octalRegex.test(string)) return parseInt(string, 8);
				throw new Error(`ipaddr: cannot parse ${string} as octal`);
			}
			return parseInt(string, 10);
		}
		function padPart(part, length) {
			while (part.length < length) part = `0${part}`;
			return part;
		}
		const ipaddr = {};
		ipaddr.IPv4 = (function() {
			function IPv4(octets) {
				if (octets.length !== 4) throw new Error("ipaddr: ipv4 octet count should be 4");
				let i, octet;
				for (i = 0; i < octets.length; i++) {
					octet = octets[i];
					if (!(0 <= octet && octet <= 255)) throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
				}
				this.octets = octets;
			}
			IPv4.prototype.SpecialRanges = {
				unspecified: [[new IPv4([
					0,
					0,
					0,
					0
				]), 8]],
				broadcast: [[new IPv4([
					255,
					255,
					255,
					255
				]), 32]],
				multicast: [[new IPv4([
					224,
					0,
					0,
					0
				]), 4]],
				linkLocal: [[new IPv4([
					169,
					254,
					0,
					0
				]), 16]],
				loopback: [[new IPv4([
					127,
					0,
					0,
					0
				]), 8]],
				carrierGradeNat: [[new IPv4([
					100,
					64,
					0,
					0
				]), 10]],
				"private": [
					[new IPv4([
						10,
						0,
						0,
						0
					]), 8],
					[new IPv4([
						172,
						16,
						0,
						0
					]), 12],
					[new IPv4([
						192,
						168,
						0,
						0
					]), 16]
				],
				reserved: [
					[new IPv4([
						192,
						0,
						0,
						0
					]), 24],
					[new IPv4([
						192,
						0,
						2,
						0
					]), 24],
					[new IPv4([
						192,
						88,
						99,
						0
					]), 24],
					[new IPv4([
						198,
						18,
						0,
						0
					]), 15],
					[new IPv4([
						198,
						51,
						100,
						0
					]), 24],
					[new IPv4([
						203,
						0,
						113,
						0
					]), 24],
					[new IPv4([
						240,
						0,
						0,
						0
					]), 4]
				],
				as112: [[new IPv4([
					192,
					175,
					48,
					0
				]), 24], [new IPv4([
					192,
					31,
					196,
					0
				]), 24]],
				amt: [[new IPv4([
					192,
					52,
					193,
					0
				]), 24]]
			};
			IPv4.prototype.kind = function() {
				return "ipv4";
			};
			IPv4.prototype.match = function(other, cidrRange) {
				let ref;
				if (cidrRange === void 0) {
					ref = other;
					other = ref[0];
					cidrRange = ref[1];
				}
				if (other.kind() !== "ipv4") throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
				return matchCIDR(this.octets, other.octets, 8, cidrRange);
			};
			IPv4.prototype.prefixLengthFromSubnetMask = function() {
				let cidr = 0;
				let stop = false;
				const zerotable = {
					0: 8,
					128: 7,
					192: 6,
					224: 5,
					240: 4,
					248: 3,
					252: 2,
					254: 1,
					255: 0
				};
				let i, octet, zeros;
				for (i = 3; i >= 0; i -= 1) {
					octet = this.octets[i];
					if (octet in zerotable) {
						zeros = zerotable[octet];
						if (stop && zeros !== 0) return null;
						if (zeros !== 8) stop = true;
						cidr += zeros;
					} else return null;
				}
				return 32 - cidr;
			};
			IPv4.prototype.range = function() {
				return ipaddr.subnetMatch(this, this.SpecialRanges);
			};
			IPv4.prototype.toByteArray = function() {
				return this.octets.slice(0);
			};
			IPv4.prototype.toIPv4MappedAddress = function() {
				return ipaddr.IPv6.parse(`::ffff:${this.toString()}`);
			};
			IPv4.prototype.toNormalizedString = function() {
				return this.toString();
			};
			IPv4.prototype.toString = function() {
				return this.octets.join(".");
			};
			return IPv4;
		})();
		ipaddr.IPv4.broadcastAddressFromCIDR = function(string) {
			try {
				const cidr = this.parseCIDR(string);
				const ipInterfaceOctets = cidr[0].toByteArray();
				const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				const octets = [];
				let i = 0;
				while (i < 4) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv4.isIPv4 = function(string) {
			return this.parser(string) !== null;
		};
		ipaddr.IPv4.isValid = function(string) {
			try {
				new this(this.parser(string));
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv4.isValidCIDR = function(string) {
			try {
				this.parseCIDR(string);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv4.isValidFourPartDecimal = function(string) {
			if (ipaddr.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) return true;
			else return false;
		};
		ipaddr.IPv4.isValidCIDRFourPartDecimal = function(string) {
			const match = string.match(/^(.+)\/(\d+)$/);
			if (!ipaddr.IPv4.isValidCIDR(string) || !match) return false;
			return ipaddr.IPv4.isValidFourPartDecimal(match[1]);
		};
		ipaddr.IPv4.networkAddressFromCIDR = function(string) {
			let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
			try {
				cidr = this.parseCIDR(string);
				ipInterfaceOctets = cidr[0].toByteArray();
				subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				octets = [];
				i = 0;
				while (i < 4) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv4.parse = function(string) {
			const parts = this.parser(string);
			if (parts === null) throw new Error("ipaddr: string is not formatted like an IPv4 Address");
			return new this(parts);
		};
		ipaddr.IPv4.parseCIDR = function(string) {
			let match;
			if (match = string.match(/^(.+)\/(\d+)$/)) {
				const maskLength = parseInt(match[2]);
				if (maskLength >= 0 && maskLength <= 32) {
					const parsed = [this.parse(match[1]), maskLength];
					Object.defineProperty(parsed, "toString", { value: function() {
						return this.join("/");
					} });
					return parsed;
				}
			}
			throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
		};
		ipaddr.IPv4.parser = function(string) {
			let match, part, value;
			if (match = string.match(ipv4Regexes.fourOctet)) return (function() {
				const ref = match.slice(1, 6);
				const results = [];
				for (let i = 0; i < ref.length; i++) {
					part = ref[i];
					results.push(parseIntAuto(part));
				}
				return results;
			})();
			else if (match = string.match(ipv4Regexes.longValue)) {
				value = parseIntAuto(match[1]);
				if (value > 4294967295 || value < 0) throw new Error("ipaddr: address outside defined range");
				return (function() {
					const results = [];
					let shift = 0;
					for (; shift <= 24; shift += 8) results.push(value >> shift & 255);
					return results;
				})().reverse();
			} else if (match = string.match(ipv4Regexes.twoOctet)) return (function() {
				const ref = match.slice(1, 4);
				const results = [];
				value = parseIntAuto(ref[1]);
				if (value > 16777215 || value < 0) throw new Error("ipaddr: address outside defined range");
				results.push(parseIntAuto(ref[0]));
				results.push(value >> 16 & 255);
				results.push(value >> 8 & 255);
				results.push(value & 255);
				return results;
			})();
			else if (match = string.match(ipv4Regexes.threeOctet)) return (function() {
				const ref = match.slice(1, 5);
				const results = [];
				value = parseIntAuto(ref[2]);
				if (value > 65535 || value < 0) throw new Error("ipaddr: address outside defined range");
				results.push(parseIntAuto(ref[0]));
				results.push(parseIntAuto(ref[1]));
				results.push(value >> 8 & 255);
				results.push(value & 255);
				return results;
			})();
			else return null;
		};
		ipaddr.IPv4.subnetMaskFromPrefixLength = function(prefix) {
			prefix = parseInt(prefix);
			if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error("ipaddr: invalid IPv4 prefix length");
			const octets = [
				0,
				0,
				0,
				0
			];
			let j = 0;
			const filledOctetCount = Math.floor(prefix / 8);
			while (j < filledOctetCount) {
				octets[j] = 255;
				j++;
			}
			if (filledOctetCount < 4) octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
			return new this(octets);
		};
		ipaddr.IPv6 = (function() {
			function IPv6(parts, zoneId) {
				let i, part;
				if (parts.length === 16) {
					this.parts = [];
					for (i = 0; i <= 14; i += 2) this.parts.push(parts[i] << 8 | parts[i + 1]);
				} else if (parts.length === 8) this.parts = parts;
				else throw new Error("ipaddr: ipv6 part count should be 8 or 16");
				for (i = 0; i < this.parts.length; i++) {
					part = this.parts[i];
					if (!(0 <= part && part <= 65535)) throw new Error("ipaddr: ipv6 part should fit in 16 bits");
				}
				if (zoneId) this.zoneId = zoneId;
			}
			IPv6.prototype.SpecialRanges = {
				unspecified: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 128],
				linkLocal: [new IPv6([
					65152,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				multicast: [new IPv6([
					65280,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 8],
				loopback: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					0,
					0,
					1
				]), 128],
				uniqueLocal: [new IPv6([
					64512,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 7],
				ipv4Mapped: [new IPv6([
					0,
					0,
					0,
					0,
					0,
					65535,
					0,
					0
				]), 96],
				deprecatedSiteLocal: [new IPv6([
					65216,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 10],
				discard: [new IPv6([
					256,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 64],
				rfc6145: [new IPv6([
					0,
					0,
					0,
					0,
					65535,
					0,
					0,
					0
				]), 96],
				rfc6052: [[new IPv6([
					100,
					65435,
					0,
					0,
					0,
					0,
					0,
					0
				]), 96], [new IPv6([
					100,
					65435,
					1,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				"6to4": [new IPv6([
					8194,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				teredo: [new IPv6([
					8193,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				benchmarking: [new IPv6([
					8193,
					2,
					0,
					0,
					0,
					0,
					0,
					0
				]), 48],
				amt: [new IPv6([
					8193,
					3,
					0,
					0,
					0,
					0,
					0,
					0
				]), 32],
				as112v6: [[new IPv6([
					8193,
					4,
					274,
					0,
					0,
					0,
					0,
					0
				]), 48], [new IPv6([
					9760,
					79,
					32768,
					0,
					0,
					0,
					0,
					0
				]), 48]],
				deprecatedOrchid: [new IPv6([
					8193,
					16,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				orchid2: [new IPv6([
					8193,
					32,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				droneRemoteIdProtocolEntityTags: [new IPv6([
					8193,
					48,
					0,
					0,
					0,
					0,
					0,
					0
				]), 28],
				segmentRouting: [new IPv6([
					24320,
					0,
					0,
					0,
					0,
					0,
					0,
					0
				]), 16],
				reserved: [
					[new IPv6([
						8193,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 23],
					[new IPv6([
						8193,
						3512,
						0,
						0,
						0,
						0,
						0,
						0
					]), 32],
					[new IPv6([
						16383,
						0,
						0,
						0,
						0,
						0,
						0,
						0
					]), 20]
				]
			};
			IPv6.prototype.isIPv4MappedAddress = function() {
				return this.range() === "ipv4Mapped";
			};
			IPv6.prototype.kind = function() {
				return "ipv6";
			};
			IPv6.prototype.match = function(other, cidrRange) {
				let ref;
				if (cidrRange === void 0) {
					ref = other;
					other = ref[0];
					cidrRange = ref[1];
				}
				if (other.kind() !== "ipv6") throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
				return matchCIDR(this.parts, other.parts, 16, cidrRange);
			};
			IPv6.prototype.prefixLengthFromSubnetMask = function() {
				let cidr = 0;
				let stop = false;
				const zerotable = {
					0: 16,
					32768: 15,
					49152: 14,
					57344: 13,
					61440: 12,
					63488: 11,
					64512: 10,
					65024: 9,
					65280: 8,
					65408: 7,
					65472: 6,
					65504: 5,
					65520: 4,
					65528: 3,
					65532: 2,
					65534: 1,
					65535: 0
				};
				let part, zeros;
				for (let i = 7; i >= 0; i -= 1) {
					part = this.parts[i];
					if (part in zerotable) {
						zeros = zerotable[part];
						if (stop && zeros !== 0) return null;
						if (zeros !== 16) stop = true;
						cidr += zeros;
					} else return null;
				}
				return 128 - cidr;
			};
			IPv6.prototype.range = function() {
				return ipaddr.subnetMatch(this, this.SpecialRanges);
			};
			IPv6.prototype.toByteArray = function() {
				let part;
				const bytes = [];
				const ref = this.parts;
				for (let i = 0; i < ref.length; i++) {
					part = ref[i];
					bytes.push(part >> 8);
					bytes.push(part & 255);
				}
				return bytes;
			};
			IPv6.prototype.toFixedLengthString = function() {
				const addr = (function() {
					const results = [];
					for (let i = 0; i < this.parts.length; i++) results.push(padPart(this.parts[i].toString(16), 4));
					return results;
				}).call(this).join(":");
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				return addr + suffix;
			};
			IPv6.prototype.toIPv4Address = function() {
				if (!this.isIPv4MappedAddress()) throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
				const ref = this.parts.slice(-2);
				const high = ref[0];
				const low = ref[1];
				return new ipaddr.IPv4([
					high >> 8,
					high & 255,
					low >> 8,
					low & 255
				]);
			};
			IPv6.prototype.toNormalizedString = function() {
				const addr = (function() {
					const results = [];
					for (let i = 0; i < this.parts.length; i++) results.push(this.parts[i].toString(16));
					return results;
				}).call(this).join(":");
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				return addr + suffix;
			};
			IPv6.prototype.toRFC5952String = function() {
				const regex = /((^|:)(0(:|$)){2,})/g;
				let suffix = "";
				if (this.zoneId) suffix = `%${this.zoneId}`;
				const normalized = this.toNormalizedString();
				const string = normalized.slice(0, normalized.length - suffix.length);
				let bestMatchIndex = 0;
				let bestMatchLength = -1;
				let bestMatchGroups = -1;
				let match;
				while (match = regex.exec(string)) {
					const groups = (match[0].match(/0/g) || []).length;
					if (groups > bestMatchGroups) {
						bestMatchGroups = groups;
						bestMatchIndex = match.index;
						bestMatchLength = match[0].length;
					}
				}
				if (bestMatchLength < 0) return string + suffix;
				return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}${suffix}`;
			};
			IPv6.prototype.toString = function() {
				return this.toRFC5952String();
			};
			return IPv6;
		})();
		ipaddr.IPv6.broadcastAddressFromCIDR = function(string) {
			try {
				const cidr = this.parseCIDR(string);
				const ipInterfaceOctets = cidr[0].toByteArray();
				const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				const octets = [];
				let i = 0;
				while (i < 16) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv6.isIPv6 = function(string) {
			return this.parser(string) !== null;
		};
		ipaddr.IPv6.isValid = function(string) {
			if (typeof string === "string" && string.indexOf(":") === -1) return false;
			try {
				const addr = this.parser(string);
				new this(addr.parts, addr.zoneId);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv6.isValidCIDR = function(string) {
			if (typeof string === "string" && string.indexOf(":") === -1) return false;
			try {
				this.parseCIDR(string);
				return true;
			} catch {
				return false;
			}
		};
		ipaddr.IPv6.networkAddressFromCIDR = function(string) {
			let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
			try {
				cidr = this.parseCIDR(string);
				ipInterfaceOctets = cidr[0].toByteArray();
				subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
				octets = [];
				i = 0;
				while (i < 16) {
					octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
					i++;
				}
				return new this(octets);
			} catch (e) {
				throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
			}
		};
		ipaddr.IPv6.parse = function(string) {
			const addr = this.parser(string);
			if (addr === null) throw new Error("ipaddr: string is not formatted like an IPv6 Address");
			return new this(addr.parts, addr.zoneId);
		};
		ipaddr.IPv6.parseCIDR = function(string) {
			let maskLength, match, parsed;
			if (match = string.match(/^(.+)\/(\d+)$/)) {
				maskLength = parseInt(match[2]);
				if (maskLength >= 0 && maskLength <= 128) {
					parsed = [this.parse(match[1]), maskLength];
					Object.defineProperty(parsed, "toString", { value: function() {
						return this.join("/");
					} });
					return parsed;
				}
			}
			throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
		};
		ipaddr.IPv6.parser = function(string) {
			let addr, i, match, octet, octets, zoneId;
			if (match = string.match(ipv6Regexes.deprecatedTransitional)) return this.parser(`::ffff:${match[1]}`);
			if (ipv6Regexes.native.test(string)) return expandIPv6(string, 8);
			if (match = string.match(ipv6Regexes.transitional)) {
				zoneId = match[6] || "";
				addr = match[1];
				if (!match[1].endsWith("::")) addr = addr.slice(0, -1);
				addr = expandIPv6(addr + zoneId, 6);
				if (addr && addr.parts) {
					octets = [
						parseInt(match[2]),
						parseInt(match[3]),
						parseInt(match[4]),
						parseInt(match[5])
					];
					for (i = 0; i < octets.length; i++) {
						octet = octets[i];
						if (!(0 <= octet && octet <= 255)) return null;
					}
					addr.parts.push(octets[0] << 8 | octets[1]);
					addr.parts.push(octets[2] << 8 | octets[3]);
					return {
						parts: addr.parts,
						zoneId: addr.zoneId
					};
				}
			}
			return null;
		};
		ipaddr.IPv6.subnetMaskFromPrefixLength = function(prefix) {
			prefix = parseInt(prefix);
			if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) throw new Error("ipaddr: invalid IPv6 prefix length");
			const octets = [
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
			let j = 0;
			const filledOctetCount = Math.floor(prefix / 8);
			while (j < filledOctetCount) {
				octets[j] = 255;
				j++;
			}
			if (filledOctetCount < 16) octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
			return new this(octets);
		};
		ipaddr.fromByteArray = function(bytes) {
			const length = bytes.length;
			if (length === 4) return new ipaddr.IPv4(bytes);
			else if (length === 16) return new ipaddr.IPv6(bytes);
			else throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
		};
		ipaddr.isValid = function(string) {
			return ipaddr.IPv6.isValid(string) || ipaddr.IPv4.isValid(string);
		};
		ipaddr.isValidCIDR = function(string) {
			return ipaddr.IPv6.isValidCIDR(string) || ipaddr.IPv4.isValidCIDR(string);
		};
		ipaddr.parse = function(string) {
			if (ipaddr.IPv6.isValid(string)) return ipaddr.IPv6.parse(string);
			else if (ipaddr.IPv4.isValid(string)) return ipaddr.IPv4.parse(string);
			else throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
		};
		ipaddr.parseCIDR = function(string) {
			try {
				return ipaddr.IPv6.parseCIDR(string);
			} catch {
				try {
					return ipaddr.IPv4.parseCIDR(string);
				} catch (e) {
					throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format", { cause: e });
				}
			}
		};
		ipaddr.process = function(string) {
			const addr = this.parse(string);
			if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) return addr.toIPv4Address();
			else return addr;
		};
		ipaddr.subnetMatch = function(address, rangeList, defaultName) {
			let i, rangeName, rangeSubnets, subnet;
			if (defaultName === void 0 || defaultName === null) defaultName = "unicast";
			for (rangeName in rangeList) if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
				rangeSubnets = rangeList[rangeName];
				if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) rangeSubnets = [rangeSubnets];
				for (i = 0; i < rangeSubnets.length; i++) {
					subnet = rangeSubnets[i];
					if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) return rangeName;
				}
			}
			return defaultName;
		};
		if (typeof module !== "undefined" && module.exports) module.exports = ipaddr;
		else root.ipaddr = ipaddr;
	})(exports);
})))(), 1);
function expectIpv6Hextets(parts) {
	const [a, b, c, d, e, f, g, h] = parts;
	if (a === void 0 || b === void 0 || c === void 0 || d === void 0 || e === void 0 || f === void 0 || g === void 0 || h === void 0) throw new Error("expected IPv6 address to expose 8 hextets");
	return [
		a,
		b,
		c,
		d,
		e,
		f,
		g,
		h
	];
}
const BLOCKED_IPV4_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
	"unspecified",
	"broadcast",
	"multicast",
	"linkLocal",
	"loopback",
	"carrierGradeNat",
	"private",
	"reserved"
]);
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const BLOCKED_IPV6_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
	"unspecified",
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"multicast",
	"reserved",
	"benchmarking",
	"discard",
	"orchid2"
]);
const RFC2544_BENCHMARK_PREFIX = [import_ipaddr.default.IPv4.parse("198.18.0.0"), 15];
const CLOUD_METADATA_IP_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200", "fd00:ec2::254"]);
function stripIpv6Brackets(value) {
	if (value.startsWith("[") && value.endsWith("]")) return value.slice(1, -1);
	return value;
}
function isNumericIpv4LiteralPart(value) {
	return /^[0-9]+$/.test(value) || /^0x[0-9a-f]+$/i.test(value);
}
/** Type guard for parsed IPv4 addresses. */
function isIpv4Address(address) {
	return address.kind() === "ipv4";
}
/** Type guard for parsed IPv6 addresses. */
function isIpv6Address(address) {
	return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
	if (!isIpv6Address(address)) return address;
	if (!address.isIPv4MappedAddress()) return address;
	return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	return stripIpv6Brackets(trimmed);
}
/** Parses canonical IPv4/IPv6 literals, rejecting legacy IPv4 shorthand forms. */
function parseCanonicalIpAddress(raw) {
	const normalized = normalizeIpParseInput(raw);
	if (!normalized) return;
	return import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized) || import_ipaddr.default.IPv6.isValid(normalized) ? import_ipaddr.default.parse(normalized) : void 0;
}
/** Parses canonical IP literals plus legacy IPv4 forms needed for SSRF checks. */
function parseLooseIpAddress(raw) {
	const normalized = normalizeIpParseInput(raw);
	if (!normalized) return;
	return import_ipaddr.default.isValid(normalized) ? import_ipaddr.default.parse(normalized) : void 0;
}
/** Normalizes canonical IP literals and maps IPv4-mapped IPv6 addresses to IPv4 text. */
function normalizeIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return;
	const normalized = normalizeIpv4MappedAddress(parsed);
	return normalizeLowercaseStringOrEmpty(normalized.toString());
}
/** True only for canonical four-part dotted-decimal IPv4 literals. */
function isCanonicalDottedDecimalIPv4(raw) {
	const normalized = normalizeIpParseInput(raw);
	return normalized !== void 0 && import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized);
}
/** Detects legacy numeric IPv4 forms that canonical parsing deliberately rejects. */
function isLegacyIpv4Literal(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return false;
	const normalized = stripIpv6Brackets(trimmed);
	if (!normalized || normalized.includes(":")) return false;
	if (isCanonicalDottedDecimalIPv4(normalized)) return false;
	const parts = normalized.split(".");
	if (parts.length === 0 || parts.length > 4) return false;
	if (parts.some((part) => part.length === 0)) return false;
	if (!parts.every((part) => isNumericIpv4LiteralPart(part))) return false;
	return true;
}
/** True when a canonical IP literal is loopback, including IPv4-mapped IPv6. */
function isLoopbackIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return false;
	return normalizeIpv4MappedAddress(parsed).range() === "loopback";
}
/** True for link-local IPs, including legacy and embedded-IPv4 forms. */
function isLinkLocalIpAddress(raw) {
	const parsed = parseLooseIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv4Address(normalized)) return normalized.range() === "linkLocal";
	if (extractEmbeddedIpv4FromIpv6(normalized)?.range() === "linkLocal") return true;
	return normalized.range() === "linkLocal";
}
/** True for unspecified IPs, including IPv4 embedded in IPv6 transition forms. */
function isUnspecifiedIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed || parsed.range() === "loopback") return false;
	return (isIpv6Address(parsed) ? extractEmbeddedIpv4FromIpv6(parsed) ?? parsed : parsed).range() === "unspecified";
}
/** True for cloud metadata IP literals, including mapped and embedded forms. */
function isCloudMetadataIpAddress(raw) {
	const parsed = parseLooseIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv6Address(normalized)) {
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
		if (embeddedIpv4 && CLOUD_METADATA_IP_ADDRESSES.has(embeddedIpv4.toString())) return true;
	}
	return CLOUD_METADATA_IP_ADDRESSES.has(normalized.toString());
}
/** True for canonical private, loopback, link-local, or blocked special-use IPs. */
function isPrivateOrLoopbackIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv4Address(normalized)) return PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(normalized.range());
	if (isBlockedSpecialUseIpv6Address(normalized)) return true;
	const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
	return embeddedIpv4 ? PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(embeddedIpv4.range()) : false;
}
/** True for RFC 8215 local-use NAT64 IPv6 literals (`64:ff9b:1::/48`). */
function isRfc8215LocalUseNat64Ipv6Address(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	return Boolean(parsed && isIpv6Address(parsed) && isRfc8215Nat64LocalUseAddress(parsed));
}
/** Applies the SSRF block policy for parsed IPv6 special-use ranges. */
function isBlockedSpecialUseIpv6Address(address, options = {}) {
	const range = address.range();
	if (isRfc8215Nat64LocalUseAddress(address)) return true;
	if (isCloudMetadataIpAddress(address.toString())) return true;
	if (range === "uniqueLocal" && options.allowUniqueLocalRange === true) return false;
	if (BLOCKED_IPV6_SPECIAL_USE_RANGES.has(range)) return true;
	const [firstPart] = expectIpv6Hextets(address.parts);
	return (firstPart & 65472) === 65216;
}
/** Applies the SSRF block policy for parsed IPv4 special-use ranges. */
function isBlockedSpecialUseIpv4Address(address, options = {}) {
	const inRfc2544BenchmarkRange = address.match(RFC2544_BENCHMARK_PREFIX);
	if (inRfc2544BenchmarkRange && options.allowRfc2544BenchmarkRange === true) return false;
	return BLOCKED_IPV4_SPECIAL_USE_RANGES.has(address.range()) || inRfc2544BenchmarkRange;
}
function decodeIpv4FromHextets(high, low) {
	const octets = [
		high >>> 8 & 255,
		high & 255,
		low >>> 8 & 255,
		low & 255
	];
	return import_ipaddr.default.IPv4.parse(octets.join("."));
}
function isRfc8215Nat64LocalUsePrefix(parts) {
	return parts[0] === 100 && parts[1] === 65435 && parts[2] === 1;
}
function isRfc8215Nat64LocalUseAddress(address) {
	return isRfc8215Nat64LocalUsePrefix(expectIpv6Hextets(address.parts));
}
/** Extracts the embedded IPv4 address from mapped and transition IPv6 prefixes. */
function extractEmbeddedIpv4FromIpv6(address) {
	const parts = expectIpv6Hextets(address.parts);
	switch (address.range()) {
		case "ipv4Mapped": return address.toIPv4Address();
		case "rfc6145": return decodeIpv4FromHextets(parts[6], parts[7]);
		case "rfc6052":
			if (isRfc8215Nat64LocalUseAddress(address)) return;
			return decodeIpv4FromHextets(parts[6], parts[7]);
		case "6to4": return decodeIpv4FromHextets(parts[1], parts[2]);
		case "teredo": return decodeIpv4FromHextets(parts[6] ^ 65535, parts[7] ^ 65535);
	}
	const isIpv4Compatible = parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0 && parts[4] === 0 && parts[5] === 0;
	const isIsatap = (parts[4] & 64767) === 0 && parts[5] === 24318;
	if (isIpv4Compatible || isIsatap) return decodeIpv4FromHextets(parts[6], parts[7]);
}
//#endregion
//#region packages/terminal-core/src/palette.ts
const LOBSTER_PALETTE = {
	accent: "#FF5A2D",
	accentBright: "#FF7A3D",
	accentDim: "#D14A22",
	info: "#FF8A5B",
	success: "#2FBF71",
	warn: "#FFB020",
	error: "#E23D2D",
	muted: "#8B7F77"
};
//#endregion
//#region packages/terminal-core/src/theme.ts
const hasForceColor = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0";
const baseChalk = process.env.NO_COLOR && !hasForceColor ? new Chalk({ level: 0 }) : chalk;
const hex = (value) => baseChalk.hex(value);
/** Shared terminal theme color functions. */
const theme = {
	accent: hex(LOBSTER_PALETTE.accent),
	accentBright: hex(LOBSTER_PALETTE.accentBright),
	accentDim: hex(LOBSTER_PALETTE.accentDim),
	info: hex(LOBSTER_PALETTE.info),
	success: hex(LOBSTER_PALETTE.success),
	warn: hex(LOBSTER_PALETTE.warn),
	error: hex(LOBSTER_PALETTE.error),
	muted: hex(LOBSTER_PALETTE.muted),
	heading: baseChalk.bold.hex(LOBSTER_PALETTE.accent),
	command: hex(LOBSTER_PALETTE.accentBright),
	option: hex(LOBSTER_PALETTE.warn)
};
//#endregion
//#region src/logger.ts
const subsystemPrefixRe = /^([a-z][a-z0-9-]{1,20}):\s+(.*)$/i;
function splitSubsystem(message) {
	const match = message.match(subsystemPrefixRe);
	if (!match) return null;
	const subsystem = match.at(1);
	const rest = match.at(2);
	if (subsystem === void 0 || rest === void 0) return null;
	return {
		subsystem,
		rest
	};
}
function logWithSubsystem(params) {
	const parsed = params.runtime === defaultRuntime ? splitSubsystem(params.message) : null;
	if (parsed) {
		expectDefined(createSubsystemLogger(parsed.subsystem)[params.subsystemMethod], "subsystem logger method")(parsed.rest);
		return;
	}
	const formatted = params.runtimeFormatter(params.message);
	if (params.runtime !== defaultRuntime || !writeRootConsoleLine(params.runtimeMethod, formatted)) params.runtime[params.runtimeMethod](formatted);
	getLogger()[params.loggerMethod](params.message);
}
theme.info;
const warn = theme.warn;
const danger = theme.error;
function logWarn(message, runtime = defaultRuntime) {
	logWithSubsystem({
		message,
		runtime,
		runtimeMethod: "log",
		runtimeFormatter: warn,
		loggerMethod: "warn",
		subsystemMethod: "warn"
	});
}
function logError(message, runtime = defaultRuntime) {
	logWithSubsystem({
		message,
		runtime,
		runtimeMethod: "error",
		runtimeFormatter: danger,
		loggerMethod: "error",
		subsystemMethod: "error"
	});
}
function logDebug(message) {
	getLogger().debug(message);
	if (isVerbose()) console.log(theme.muted(message));
}
//#endregion
//#region src/infra/net/proxy-env.ts
function normalizeProxyEnvValue(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
}
/**
* Match undici EnvHttpProxyAgent semantics for env-based HTTP/S proxy selection:
* - lower-case vars take precedence over upper-case
* - HTTPS requests prefer https_proxy/HTTPS_PROXY, then fall back to http_proxy/HTTP_PROXY
* - ALL_PROXY is ignored by EnvHttpProxyAgent
*/
function resolveEnvHttpProxyUrl(protocol, env = process.env) {
	const lowerHttpProxy = normalizeProxyEnvValue(env.http_proxy);
	const lowerHttpsProxy = normalizeProxyEnvValue(env.https_proxy);
	const httpProxy = lowerHttpProxy !== void 0 ? lowerHttpProxy : normalizeProxyEnvValue(env.HTTP_PROXY);
	const httpsProxy = lowerHttpsProxy !== void 0 ? lowerHttpsProxy : normalizeProxyEnvValue(env.HTTPS_PROXY);
	if (protocol === "https") return httpsProxy ?? httpProxy ?? void 0;
	return httpProxy ?? void 0;
}
/** Return whether EnvHttpProxyAgent-style HTTP/S proxy resolution finds a proxy URL. */
function hasEnvHttpProxyConfigured(protocol = "https", env = process.env) {
	return resolveEnvHttpProxyUrl(protocol, env) !== void 0;
}
function resolveEnvAllProxyUrl(env) {
	const lowerAllProxy = normalizeProxyEnvValue(env.all_proxy);
	return (lowerAllProxy !== void 0 ? lowerAllProxy : normalizeProxyEnvValue(env.ALL_PROXY)) ?? void 0;
}
/**
* Build explicit options for undici's EnvHttpProxyAgent.
*
* EnvHttpProxyAgent does not read ALL_PROXY itself, but it accepts explicit
* HTTP/HTTPS proxy overrides. Keep this helper separate from the
* HTTP(S)-only URL helpers so SSRF trusted-env proxy gates do not widen.
*/
function resolveEnvHttpProxyAgentOptions(env = process.env) {
	const allProxy = resolveEnvAllProxyUrl(env);
	const httpProxy = resolveEnvHttpProxyUrl("http", env) ?? allProxy;
	const httpsProxy = resolveEnvHttpProxyUrl("https", env) ?? httpProxy;
	const options = {
		...httpProxy ? { httpProxy } : {},
		...httpsProxy ? { httpsProxy } : {}
	};
	return options.httpProxy || options.httpsProxy ? options : void 0;
}
/** Return whether a target URL should use configured HTTP/S env proxy variables. */
function shouldUseEnvHttpProxyForUrl(targetUrl, env = process.env) {
	let parsed;
	let protocol;
	try {
		parsed = new URL(targetUrl);
		if (parsed.protocol === "http:") protocol = "http";
		else if (parsed.protocol === "https:") protocol = "https";
		else return false;
	} catch {
		return false;
	}
	return hasEnvHttpProxyConfigured(protocol, env) && !matchesNoProxy(parsed, env);
}
/**
* Check whether a target URL should bypass the HTTP proxy per NO_PROXY env var.
*
* Mirrors undici EnvHttpProxyAgent semantics
* (`undici/lib/dispatcher/env-http-proxy-agent.js`):
* - Entries separated by commas OR whitespace (undici splits on `/[,\s]/`)
* - Case-insensitive
* - A single trailing DNS dot is ignored in both hosts and entries
* - Lower-case `no_proxy` shadows upper-case `NO_PROXY`, including blank values
* - Empty or missing → no bypass
* - Bare `*` value → bypass everything
* - Exact hostname match
* - Leading-dot match (`.example.com` matches `foo.example.com`)
* - Leading `*.` wildcard match (`*.example.com` matches `foo.example.com`);
*   undici normalizes via `.replace(/^\*?\./, '')`, so the bare domain also
*   matches (kept in sync with that behavior)
* - Subdomain suffix match (`openai.com` matches `api.openai.com`)
* - Optional `:port` suffix; when present, must match target port
* - IPv6 literals in bracketed (`[::1]`) or bare (`::1`) form
* - OpenClaw extension: IPv4 CIDR and octet-wildcard entries
*   (`100.64.0.0/10`, `100.64.*`) bypass the trusted env proxy mode before
*   undici's EnvHttpProxyAgent is selected.
*
* Undici does not export its matcher, so this is a targeted reimplementation
* kept in sync with the upstream file above. Paired with
* `hasEnvHttpProxyConfigured` this gates the trusted-env-proxy auto-upgrade
* in provider HTTP helpers; see openclaw#64974 review thread on NO_PROXY
* SSRF bypass.
*/
function matchesNoProxy(targetUrl, env = process.env) {
	const raw = env.no_proxy ?? env.NO_PROXY ?? "";
	if (!raw) return false;
	let parsed;
	try {
		parsed = targetUrl instanceof URL ? targetUrl : new URL(targetUrl);
	} catch {
		return false;
	}
	const targetHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/^(.+)\.$/, "$1");
	if (!targetHost) return false;
	if (raw === "*") return true;
	const targetIpv4 = parseIpv4Address(targetHost);
	const targetPort = parsed.port !== "" ? parsed.port : parsed.protocol === "https:" ? "443" : parsed.protocol === "http:" ? "80" : "";
	for (const rawEntry of raw.split(/[,\s]/)) {
		const entry = rawEntry.trim().toLowerCase();
		if (!entry) continue;
		let entryHost;
		let entryPort;
		if (entry.startsWith("[")) {
			const m = entry.match(/^\[([^\]]+)\](?::(\d+))?$/);
			if (!m) continue;
			entryHost = expectDefined(m[1], "m capture group 1");
			entryPort = m[2];
		} else {
			const firstColonIdx = entry.indexOf(":");
			const lastColonIdx = entry.lastIndexOf(":");
			if (firstColonIdx > -1 && firstColonIdx === lastColonIdx && /^\d+$/.test(entry.slice(lastColonIdx + 1))) {
				entryHost = entry.slice(0, lastColonIdx);
				entryPort = entry.slice(lastColonIdx + 1);
			} else entryHost = entry;
		}
		if (entryPort && entryPort !== targetPort) continue;
		const normalizedEntry = entryHost.replace(/^\*?\./, "").replace(/^(.+)\.$/, "$1");
		if (!normalizedEntry || normalizedEntry === "*") continue;
		if (matchesIpv4NoProxyPattern(targetIpv4, normalizedEntry)) return true;
		if (targetHost === normalizedEntry) return true;
		if (targetHost.endsWith("." + normalizedEntry)) return true;
	}
	return false;
}
function parseIpv4Address(host) {
	const parts = host.split(".");
	if (parts.length !== 4) return;
	let value = 0;
	for (const part of parts) {
		if (!/^\d{1,3}$/.test(part)) return;
		const octet = Number(part);
		if (!Number.isInteger(octet) || octet < 0 || octet > 255) return;
		value = value << 8 | octet;
	}
	return value >>> 0;
}
function matchesIpv4NoProxyPattern(target, entryHost) {
	if (target === void 0) return false;
	const cidrMatch = entryHost.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
	if (cidrMatch) {
		const network = parseIpv4Address(expectDefined(cidrMatch[1], "cidr match capture group 1"));
		const prefixLength = Number(cidrMatch[2]);
		if (network === void 0 || prefixLength < 0 || prefixLength > 32) return false;
		const mask = prefixLength === 0 ? 0 : 4294967295 << 32 - prefixLength >>> 0;
		return (target & mask) === (network & mask);
	}
	if (!entryHost.includes("*")) return false;
	const patternParts = entryHost.split(".");
	if (patternParts.length > 4 || patternParts.length === 0) return false;
	for (const [index, part] of patternParts.entries()) {
		if (part === "*") {
			if (index === patternParts.length - 1) return true;
			continue;
		}
		if (!/^\d{1,3}$/.test(part) || Number(part) !== (target >>> (3 - index) * 8 & 255)) return false;
	}
	return patternParts.length === 4;
}
function parseActiveManagedProxyLoopbackMode(value) {
	if (value === "gateway-only" || value === "proxy" || value === "block") return value;
}
function readInheritedActiveManagedProxyLoopbackMode() {
	if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
	return parseActiveManagedProxyLoopbackMode(process.env["OPENCLAW_PROXY_LOOPBACK_MODE"]) ?? "gateway-only";
}
/** Returns local loopback policy from in-process state or inherited proxy env. */
function getActiveManagedProxyLoopbackMode() {
	return readInheritedActiveManagedProxyLoopbackMode();
}
//#endregion
//#region src/infra/net/proxy/proxy-tls.ts
function normalizeOptionalPath(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : void 0;
}
function isHttpsProxyUrl(value) {
	if (!value) return false;
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}
/** Resolves the configured managed proxy CA file, with env/CLI override first. */
function resolveManagedProxyCaFile(params) {
	return normalizeOptionalPath(params.caFileOverride) ?? normalizeOptionalPath(params.config?.tls?.caFile);
}
/** Returns a CA file only for HTTPS proxy URLs; HTTP proxies do not need TLS trust. */
function resolveManagedProxyCaFileForUrl(params) {
	if (!isHttpsProxyUrl(params.proxyUrl)) return;
	return resolveManagedProxyCaFile({
		config: params.config,
		caFileOverride: params.caFileOverride
	});
}
/** Loads managed proxy TLS options synchronously for inherited child-process routing. */
function loadManagedProxyTlsOptionsSync(caFile) {
	if (!caFile) return;
	try {
		return { ca: readFileSync(caFile, "utf8") };
	} catch (err) {
		throw new Error(`proxy CA file could not be read (${caFile}): ${formatErrorMessage(err)}`, { cause: err });
	}
}
//#endregion
//#region src/infra/net/proxy/active-managed-proxy-tls.ts
const MANAGED_PROXY_ENV_PREFIX = ["OPENCLAW", "PROXY"].join("_");
const MANAGED_PROXY_ACTIVE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_ACTIVE`;
const MANAGED_PROXY_CA_FILE_ENV_KEY = `${MANAGED_PROXY_ENV_PREFIX}_CA_FILE`;
function normalizeProxyUrl(value) {
	if (!value) return;
	try {
		return new URL(value).href;
	} catch {
		return;
	}
}
function resolveManagedProxyUrl(env = process.env) {
	if (env[MANAGED_PROXY_ACTIVE_ENV_KEY] !== "1") return;
	return normalizeProxyUrl(resolveEnvHttpProxyUrl("https", env));
}
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
function resolveActiveManagedProxyTlsOptions(params) {
	const env = params?.env ?? process.env;
	const managedProxyUrl = resolveManagedProxyUrl(env);
	const targetProxyUrl = normalizeProxyUrl(params?.proxyUrl ?? resolveEnvHttpProxyUrl("https", env));
	if (!managedProxyUrl || targetProxyUrl !== managedProxyUrl) return;
	const proxyCaFile = resolveManagedProxyCaFileForUrl({
		proxyUrl: managedProxyUrl,
		caFileOverride: env[MANAGED_PROXY_CA_FILE_ENV_KEY]
	});
	try {
		return loadManagedProxyTlsOptionsSync(proxyCaFile);
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.ts
function readProxyTlsRecord(options) {
	if (!options || !("proxyTls" in options)) return;
	return isRecord(options.proxyTls) ? options.proxyTls : void 0;
}
function readProxyUrlFromOptions(options) {
	if (!options) return;
	if ("uri" in options) {
		const uri = options.uri;
		return uri instanceof URL ? uri.href : typeof uri === "string" ? uri : void 0;
	}
	if ("httpsProxy" in options || "httpProxy" in options) {
		const httpsProxy = Reflect.get(options, "httpsProxy");
		const httpProxy = Reflect.get(options, "httpProxy");
		return typeof httpsProxy === "string" ? httpsProxy : typeof httpProxy === "string" ? httpProxy : void 0;
	}
}
function addActiveManagedProxyTlsOptions(options, params) {
	const proxyTls = resolveActiveManagedProxyTlsOptions({
		proxyUrl: readProxyUrlFromOptions(options),
		env: params?.env
	});
	if (!proxyTls) return options;
	const existingProxyTls = readProxyTlsRecord(options);
	return {
		...options,
		proxyTls: {
			...proxyTls,
			...existingProxyTls
		}
	};
}
//#endregion
//#region src/infra/wsl.ts
/** Detects WSL from environment variables without touching the filesystem. */
function isWSLEnv(env = process.env) {
	if (env.WSL_INTEROP || env.WSL_DISTRO_NAME || env.WSLENV) return true;
	return false;
}
/**
* Synchronously detects WSL from env vars first, then `/proc/version`.
*/
function isWSLSync() {
	if (process.platform !== "linux") return false;
	if (isWSLEnv()) return true;
	try {
		const release = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return release.includes("microsoft") || release.includes("wsl");
	} catch {
		return false;
	}
}
/**
* Synchronously detects WSL2 from kernel-version markers after WSL detection.
*/
function isWSL2Sync() {
	if (!isWSLSync()) return false;
	try {
		const version = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return version.includes("wsl2") || version.includes("microsoft-standard");
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/net/undici-family-policy.ts
const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
/** Resolves the process default autoSelectFamily policy, with WSL2 forced to IPv4. */
function resolveUndiciAutoSelectFamily() {
	if (typeof net$1.getDefaultAutoSelectFamily !== "function") return;
	try {
		const systemDefault = net$1.getDefaultAutoSelectFamily();
		if (systemDefault && isWSL2Sync()) return false;
		return systemDefault;
	} catch {
		return;
	}
}
/** Converts an autoSelectFamily decision into the undici connect option shape. */
function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily) {
	if (autoSelectFamily === void 0) return;
	return {
		autoSelectFamily,
		autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
	};
}
/** Returns shared undici connect options for dispatchers that do not override them. */
function resolveUndiciAutoSelectFamilyConnectOptions() {
	return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}
//#endregion
//#region src/infra/net/undici-error-diagnostics.ts
const observedDispatcherValues = /* @__PURE__ */ new WeakSet();
function logUndiciDispatcherError(error) {
	logDebug(`undici: internal dispatcher error: ${formatErrorMessage(error)}`);
}
function observeDispatcherValue(value) {
	if (typeof value !== "object" && typeof value !== "function" || value === null) return;
	if (observedDispatcherValues.has(value)) return;
	observedDispatcherValues.add(value);
	if (value instanceof EventEmitter) {
		EventEmitter.prototype.on.call(value, "error", logUndiciDispatcherError);
		EventEmitter.prototype.on.call(value, "connect", (_origin, targets) => {
			observeDispatcherValue(targets);
		});
		for (const key of Reflect.ownKeys(value)) {
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			if (descriptor && "value" in descriptor) observeDispatcherValue(descriptor.value);
		}
		return;
	}
	if (Array.isArray(value) || value instanceof Set) {
		for (const entry of value) observeDispatcherValue(entry);
		return;
	}
	if (value instanceof Map) for (const entry of value.values()) observeDispatcherValue(entry);
}
function withUndiciErrorDiagnostics(dispatcher) {
	observeDispatcherValue(dispatcher);
	return dispatcher;
}
//#endregion
//#region src/infra/net/undici-dispatcher-options.ts
const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
const requireUndici = createRequire(import.meta.url);
let undiciModule;
const HTTP1_ONLY_DISPATCHER_OPTIONS$1 = Object.freeze({ allowH2: false });
function loadUndiciModule(requiredExports) {
	const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
	if (isRecord(override) && requiredExports.every((key) => typeof override[key] === "function")) return override;
	return undiciModule ??= requireUndici("undici/index.js");
}
function createHttp1ProxyClient(origin, poolOptions) {
	const connect = isRecord(poolOptions) ? poolOptions.connect : void 0;
	return createUndiciPool(origin, {
		...poolOptions,
		...typeof connect === "function" ? { connect: (params, callback) => {
			const { servername, ...withoutServername } = params;
			return connect(servername && net.isIP(servername.replace(/^\[|\]$/g, "")) ? withoutServername : params, callback);
		} } : {}
	});
}
/** Prepare proxy transport without transferring direct-origin TLS or DNS policy. */
function buildProxyConnectOptions(options, timeoutMs) {
	const connect = {
		...resolveUndiciAutoSelectFamilyConnectOptions(),
		...typeof options.connect === "object" ? options.connect : {}
	};
	const timeout = normalizedTimeout(timeoutMs);
	return {
		autoSelectFamily: connect.autoSelectFamily,
		autoSelectFamilyAttemptTimeout: connect.autoSelectFamilyAttemptTimeout,
		family: "family" in connect ? connect.family : void 0,
		keepAlive: connect.keepAlive,
		keepAliveInitialDelay: connect.keepAliveInitialDelay,
		timeout: options.connectTimeout,
		...options.proxyTls,
		...timeout !== void 0 ? { timeout } : {},
		...HTTP1_ONLY_DISPATCHER_OPTIONS$1
	};
}
function createUndiciClient(origin, options) {
	const { Client } = loadUndiciModule(["Client"]);
	return withUndiciErrorDiagnostics(new Client(origin, options));
}
function createUndiciPool(origin, options) {
	const { Pool } = loadUndiciModule(["Pool"]);
	return withUndiciErrorDiagnostics(new Pool(origin, {
		...options,
		factory: createUndiciClient
	}));
}
function createUndiciOriginDispatcher(origin, options) {
	return options.connections === 1 ? createUndiciClient(origin, options) : createUndiciPool(origin, options);
}
function normalizedTimeout(timeoutMs) {
	return timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function buildHttp1AgentOptions(options = {}, timeoutMs) {
	const timeout = normalizedTimeout(timeoutMs);
	return {
		factory: createUndiciOriginDispatcher,
		...options,
		...HTTP1_ONLY_DISPATCHER_OPTIONS$1,
		connect: typeof options.connect === "function" ? options.connect : {
			...resolveUndiciAutoSelectFamilyConnectOptions(),
			...options.connect,
			...timeout !== void 0 ? { timeout } : {}
		},
		...timeout !== void 0 ? {
			bodyTimeout: timeout,
			headersTimeout: timeout
		} : {}
	};
}
function buildHttp1ProxyAgentOptions(options, timeoutMs, managedTlsEnv) {
	const normalized = typeof options === "string" || options instanceof URL ? { uri: options.toString() } : options;
	const { clientFactory = createHttp1ProxyClient } = normalized;
	const managed = addActiveManagedProxyTlsOptions(normalized, { env: managedTlsEnv });
	return {
		proxyTunnel: true,
		...managed,
		...buildHttp1AgentOptions(managed, timeoutMs),
		clientFactory
	};
}
//#endregion
//#region src/infra/net/undici-runtime.ts
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
function loadUndiciRuntimeDeps() {
	return loadUndiciModule([
		"Agent",
		"EnvHttpProxyAgent",
		"ProxyAgent",
		"fetch"
	]);
}
/** Loads only the undici global-dispatcher API used by startup proxy setup. */
function loadUndiciGlobalDispatcherDeps() {
	return loadUndiciModule(["getGlobalDispatcher", "setGlobalDispatcher"]);
}
/** Creates a direct undici Agent with OpenClaw's HTTP/1-only dispatcher policy. */
function createHttp1Agent(options, timeoutMs) {
	const { Agent } = loadUndiciRuntimeDeps();
	return withUndiciErrorDiagnostics(new Agent(buildHttp1AgentOptions(options, timeoutMs)));
}
function isSocksProxy(uri) {
	return uri !== void 0 && ["socks:", "socks5:"].includes(URL.parse(uri)?.protocol ?? "");
}
function createSocksProxyAgent(options, timeoutMs) {
	const { Agent, Socks5ProxyAgent, buildConnector, errors } = loadUndiciModule([
		"Agent",
		"Socks5ProxyAgent",
		"buildConnector"
	]);
	if (typeof options.clientFactory !== "function") throw new errors.InvalidArgumentError("Proxy opts.clientFactory must be a function.");
	if (options.auth && options.token) throw new errors.InvalidArgumentError("opts.auth cannot be used in combination with opts.token");
	const connect = buildConnector(buildProxyConnectOptions(options, timeoutMs));
	class SocksProxyAgent extends Agent {}
	const agent = withUndiciErrorDiagnostics(new SocksProxyAgent({
		...options,
		factory: () => withUndiciErrorDiagnostics(new Socks5ProxyAgent(options.uri, {
			...options,
			connect
		}))
	}));
	const defaults = {
		connections: options.connections,
		pipelining: options.pipelining,
		bodyTimeout: options.bodyTimeout,
		headersTimeout: options.headersTimeout
	};
	return agent.compose((dispatch) => (request, handler) => {
		const headers = request.headers;
		const names = Array.isArray(headers) ? headers.filter((_, index) => index % 2 === 0) : [];
		if (!Array.isArray(headers)) for (const name in headers) names.push(name);
		if (names.some((name) => typeof name === "string" && name.toLowerCase() === "proxy-authorization")) throw new errors.InvalidArgumentError("Proxy-Authorization should be sent in ProxyAgent constructor");
		return dispatch({
			...defaults,
			...request
		}, handler);
	});
}
function completeProxyLifecycle(start, callback) {
	if (callback !== void 0 && typeof callback !== "function") {
		const { errors } = loadUndiciModule([]);
		throw new errors.InvalidArgumentError("invalid callback");
	}
	const completion = start().then(() => void 0);
	if (callback) completion.then(() => callback(null, null), (error) => callback(toErrorObject(error, "Proxy shutdown failed"), null));
	else return completion;
}
/** Creates an env dispatcher with per-hop connectors and the existing dynamic bypass policy. */
function createHttp1EnvHttpProxyAgent(options, timeoutMs, managedTlsEnv) {
	const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
	const httpProxy = options?.httpProxy ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
	const httpsProxy = (options?.httpsProxy ?? process.env.https_proxy ?? process.env.HTTPS_PROXY) || httpProxy;
	const proxies = /* @__PURE__ */ new Map();
	for (const uri of [httpProxy, httpsProxy]) if (uri && !proxies.has(uri)) proxies.set(uri, createHttp1ProxyAgent({
		...options,
		uri
	}, timeoutMs, managedTlsEnv));
	const dispatcher = withUndiciErrorDiagnostics(new EnvHttpProxyAgent({
		...buildHttp1AgentOptions(options, timeoutMs),
		httpProxy: "",
		httpsProxy: "",
		noProxy: "*"
	}));
	if (proxies.size === 0) return dispatcher;
	const owned = [dispatcher, ...proxies.values()];
	const isDestroyed = () => owned.every((agent) => Reflect.get(agent, "destroyed") === true);
	let closing;
	return new Proxy(dispatcher, { get(target, property, receiver) {
		if (property === "destroyed") return isDestroyed();
		if (property === "dispatch") return (request, handler) => {
			const origin = request?.origin ? URL.parse(String(request.origin)) : null;
			const uri = origin?.protocol === "https:" ? httpsProxy : httpProxy;
			const proxy = uri && proxies.get(uri);
			const bypassEnv = options?.noProxy === void 0 ? process.env : { no_proxy: options.noProxy };
			return proxy && origin && !matchesNoProxy(origin, bypassEnv) ? proxy.dispatch(request, handler) : target.dispatch(request, handler);
		};
		if (property === "close") return (callback) => completeProxyLifecycle(() => isDestroyed() ? target.close() : closing ??= Promise.all(owned.map((agent) => agent.close())).finally(() => {
			closing = void 0;
		}), callback);
		if (property === "destroy") return (error, callback) => completeProxyLifecycle(() => Promise.all(owned.map((agent) => agent.destroy(typeof error === "function" ? null : error ?? null))), typeof error === "function" ? error : callback);
		return Reflect.get(target, property, receiver);
	} });
}
/** Creates a fixed proxy dispatcher without using TLS options for plain TCP policy. */
function createHttp1ProxyAgent(options, timeoutMs, managedTlsEnv) {
	const prepared = buildHttp1ProxyAgentOptions(options, timeoutMs, managedTlsEnv);
	if (isSocksProxy(prepared.uri)) return createSocksProxyAgent(prepared, timeoutMs);
	const { ProxyAgent } = loadUndiciRuntimeDeps();
	return withUndiciErrorDiagnostics(new ProxyAgent({
		...prepared,
		proxyTls: buildProxyConnectOptions(prepared, timeoutMs)
	}));
}
Object.freeze({ allowH2: false });
/**
* Module-level bridge so `resolveDispatcherTimeoutMs` in fetch-guard.ts
* can read the global dispatcher timeout without relying on Undici's
* non-public `.options` field.
*/
let globalUndiciStreamTimeoutMs;
let lastAppliedProxyBootstrapKey = null;
const timedProxylineManagedDispatchers = /* @__PURE__ */ new WeakMap();
function isTimedProxylineManagedDispatcher(dispatcher) {
	return typeof dispatcher === "object" && dispatcher !== null ? timedProxylineManagedDispatchers.has(dispatcher) : false;
}
function resolveDispatcherKind(dispatcher) {
	const ctorName = dispatcher?.constructor?.name;
	if (typeof ctorName !== "string" || ctorName.length === 0) return "unsupported";
	if (ctorName.includes("EnvHttpProxyAgent")) return "env-proxy";
	if (isTimedProxylineManagedDispatcher(dispatcher) || isProxylineDispatcher(dispatcher)) return "proxyline-managed";
	if (ctorName.includes("ProxyAgent")) return "unsupported";
	if (ctorName.includes("Agent")) return "agent";
	return "unsupported";
}
function resolveEnvProxyBootstrapKey(options) {
	const proxyTls = [.../* @__PURE__ */ new Set([options.httpProxy, options.httpsProxy])].map((proxyUrl) => proxyUrl ? resolveActiveManagedProxyTlsOptions({ proxyUrl }) : void 0);
	return JSON.stringify([
		options.httpProxy,
		options.httpsProxy,
		proxyTls
	]);
}
function resolveCurrentDispatcherInfo(runtime) {
	let dispatcher;
	try {
		dispatcher = runtime.getGlobalDispatcher();
	} catch {
		return null;
	}
	const currentKind = resolveDispatcherKind(dispatcher);
	if (currentKind === "unsupported") return null;
	return {
		kind: currentKind,
		dispatcher
	};
}
/**
* Re-evaluate proxy env changes for root undici imports. Installs
* EnvHttpProxyAgent when proxy env is present, and restores a direct Agent
* after proxy env is cleared.
*/
function forceResetGlobalDispatcher(opts) {
	const proxyOptions = resolveEnvHttpProxyAgentOptions();
	if (!proxyOptions) {
		if (lastAppliedProxyBootstrapKey === null) return;
		lastAppliedProxyBootstrapKey = null;
		try {
			const { setGlobalDispatcher } = loadUndiciGlobalDispatcherDeps();
			setGlobalDispatcher(createHttp1Agent());
		} catch {}
		return;
	}
	try {
		const runtime = loadUndiciGlobalDispatcherDeps();
		const { setGlobalDispatcher } = runtime;
		if (opts?.preserveProxylineManaged) {
			if (resolveCurrentDispatcherInfo(runtime)?.kind === "proxyline-managed") {
				lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
				return;
			}
		}
		setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
		lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
	} catch {}
}
//#endregion
export { isLoopbackIpAddress as C, normalizeIpAddress as D, isUnspecifiedIpAddress as E, parseCanonicalIpAddress as O, isLinkLocalIpAddress as S, isRfc8215LocalUseNat64Ipv6Address as T, isBlockedSpecialUseIpv6Address as _, createHttp1ProxyAgent as a, isIpv4Address as b, loadManagedProxyTlsOptionsSync as c, shouldUseEnvHttpProxyForUrl as d, logDebug as f, isBlockedSpecialUseIpv4Address as g, extractEmbeddedIpv4FromIpv6 as h, createHttp1EnvHttpProxyAgent as i, parseLooseIpAddress as k, resolveManagedProxyCaFileForUrl as l, logWarn as m, globalUndiciStreamTimeoutMs as n, loadUndiciRuntimeDeps as o, logError as p, createHttp1Agent as r, resolveUndiciAutoSelectFamilyConnectOptions as s, forceResetGlobalDispatcher as t, getActiveManagedProxyLoopbackMode as u, isCanonicalDottedDecimalIPv4 as v, isPrivateOrLoopbackIpAddress as w, isLegacyIpv4Literal as x, isCloudMetadataIpAddress as y };
