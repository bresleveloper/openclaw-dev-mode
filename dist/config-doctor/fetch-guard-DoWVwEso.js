import { c as isVerbose, i as defaultRuntime, l as __commonJSMin, o as getLogger, r as writeRootConsoleLine, t as createSubsystemLogger, u as __toESM } from "./subsystem-CxjajkOx.js";
import { c as isRecord, i as normalizeOptionalString, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { S as normalizeUniqueStringEntries, g as resolveGlobalSingleton } from "./runtime-doctor-migrations-8XPPImoy.js";
import { c as redactSensitiveUrlLikeString, h as truncateUtf16Safe } from "./redact-V5IywZh1.js";
import "./src-CkqqhWE1.js";
import { i as toErrorObject, t as formatErrorMessage } from "./errors-Dp0Hj51M.js";
import { l as expectDefined } from "./types.secrets-CBNculTH.js";
import { t as cancelUnreadResponseBody } from "./http-body-ELLYEXTX.js";
import { n as createDeferredCore, t as isPromiseLike } from "./promise-like-ByIJ_1fR.js";
import { n as normalizeHeadersInitForFetch, r as normalizeRequestInitHeadersForFetch } from "./fetch-headers-DD03wtQj.js";
import { createRequire } from "node:module";
import "node:fs/promises";
import * as net$1 from "node:net";
import net from "node:net";
import { AsyncLocalStorage } from "node:async_hooks";
import { readFileSync } from "node:fs";
import chalk, { Chalk } from "chalk";
import { EventEmitter } from "node:events";
import { lookup } from "node:dns";
import { lookup as lookup$1 } from "node:dns/promises";
import "@openclaw/proxyline/dispatcher-brand";
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
theme.error;
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
function logDebug(message) {
	getLogger().debug(message);
	if (isVerbose()) console.log(theme.muted(message));
}
//#endregion
//#region packages/gateway-client/src/timeouts.ts
/** Maximum delay Node timers can represent without overflow warnings. */
const MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
/** Clamps arbitrary timer delays to Node's safe range and an optional floor. */
function resolveSafeTimeoutDelayMs(delayMs, opts) {
	const rawMinMs = opts?.minMs ?? 1;
	const minMs = Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1));
	return Math.min(MAX_SAFE_TIMEOUT_DELAY_MS, Math.max(minMs, Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs));
}
//#endregion
//#region src/utils/fetch-timeout.ts
const log = createSubsystemLogger("fetch-timeout");
const LOG_URL_MAX_CHARS = 500;
const URL_SECRET_SUFFIX_PATTERN = /[?#]/;
function sanitizeTimeoutLogUrl(rawUrl) {
	const trimmed = rawUrl?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		parsed.username = "";
		parsed.password = "";
		parsed.search = "";
		parsed.hash = "";
		const value = redactSensitiveUrlLikeString(parsed.toString());
		return value.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(value, LOG_URL_MAX_CHARS)}...` : value;
	} catch {
		const withoutQueryOrHash = trimmed.split(URL_SECRET_SUFFIX_PATTERN, 1)[0] ?? "";
		const cleaned = redactSensitiveUrlLikeString(withoutQueryOrHash.replace(/[\r\n\u2028\u2029]+/g, " ").replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim());
		if (!cleaned) return;
		return cleaned.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(cleaned, LOG_URL_MAX_CHARS)}...` : cleaned;
	}
}
function abortDueToTimeout(controller, timeoutMs, startedAtMs, operation, url, combinedSignal) {
	if (combinedSignal?.aborted ?? controller.signal.aborted) return;
	const sanitizedUrl = sanitizeTimeoutLogUrl(url);
	const elapsedMs = Math.max(0, Date.now() - startedAtMs);
	const delayMs = Math.max(0, elapsedMs - timeoutMs);
	const eventLoopDelayHint = delayMs >= Math.max(1e3, timeoutMs * .5) ? `timer delayed ${delayMs}ms, likely event-loop starvation` : null;
	const consoleMessage = [
		`fetch timeout after ${timeoutMs}ms`,
		`(elapsed ${elapsedMs}ms)`,
		eventLoopDelayHint,
		operation ? `operation=${operation}` : null,
		sanitizedUrl ? `url=${sanitizedUrl}` : null
	].filter((part) => Boolean(part)).join(" ");
	log.warn("fetch timeout reached; aborting operation", {
		timeoutMs,
		elapsedMs,
		...eventLoopDelayHint ? {
			timerDelayMs: delayMs,
			eventLoopDelayHint
		} : {},
		consoleMessage,
		...operation ? { operation } : {},
		...sanitizedUrl ? { url: sanitizedUrl } : {}
	});
	const error = /* @__PURE__ */ new Error("request timed out");
	error.name = "TimeoutError";
	controller.abort(error);
}
/**
* Builds an abort signal that combines an optional parent signal with a timeout.
* Callers must run `cleanup`; `refresh` restarts only the internal timeout timer.
*/
function buildTimeoutAbortSignal(params) {
	const { timeoutMs, signal: parentSignal } = params;
	if (!timeoutMs && !parentSignal) return {
		signal: void 0,
		cleanup: () => {},
		refresh: () => {}
	};
	if (!timeoutMs) return {
		signal: parentSignal,
		cleanup: () => {},
		refresh: () => {}
	};
	const controller = new AbortController();
	const signal = parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal;
	const normalizedTimeoutMs = resolveSafeTimeoutDelayMs(timeoutMs);
	let active = true;
	let timeoutId;
	const scheduleTimeout = () => {
		timeoutId = setTimeout(abortDueToTimeout, normalizedTimeoutMs, controller, normalizedTimeoutMs, Date.now(), params.operation, params.url, signal);
	};
	scheduleTimeout();
	return {
		signal,
		refresh: () => {
			if (!active || signal.aborted) return;
			if (timeoutId) clearTimeout(timeoutId);
			scheduleTimeout();
		},
		cleanup: () => {
			active = false;
			if (timeoutId) clearTimeout(timeoutId);
		}
	};
}
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
//#region src/infra/net/hostname.ts
/** Normalize a hostname for policy comparisons. */
function normalizeHostname(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
	if (normalized.startsWith("[") && normalized.endsWith("]")) return normalized.slice(1, -1);
	return normalized;
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
//#endregion
//#region src/infra/net/ssrf.ts
const DISPATCHER_CLOSE_TIMEOUT_MS = 100;
var SsrFBlockedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SsrFBlockedError";
	}
};
function normalizePolicyHostnames(values) {
	return normalizeUniqueStringEntries(values?.map((value) => normalizeHostname(value)));
}
function normalizeSsrFPolicyOrigin(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		parsed.hostname = parsed.hostname.replace(/\.+$/, "");
		return parsed.origin.toLowerCase();
	} catch {
		return;
	}
}
function normalizeSsrFPolicyOrigins(values) {
	if (!values || values.length === 0) return [];
	return Array.from(new Set(values.map((value) => normalizeSsrFPolicyOrigin(value)).filter((value) => Boolean(value)))).toSorted();
}
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"localhost.localdomain",
	"metadata.google.internal"
]);
function normalizeHostnameSet(values) {
	return new Set(normalizePolicyHostnames(values));
}
function normalizeHostnameAllowlist(values) {
	return normalizePolicyHostnames(values).filter((value) => value !== "*" && value !== "*.");
}
function isPrivateNetworkAllowedByPolicy(policy) {
	return policy?.dangerouslyAllowPrivateNetwork === true || policy?.allowPrivateNetwork === true;
}
function shouldSkipPrivateNetworkChecks(hostname, policy) {
	return isPrivateNetworkAllowedByPolicy(policy) || normalizeHostnameSet(policy?.allowedHostnames).has(hostname);
}
function resolveSsrFPolicyForUrl(url, policy) {
	if (!policy?.allowedOrigins?.length) return policy;
	const requestOrigin = normalizeSsrFPolicyOrigin(url.toString());
	if (!requestOrigin || !normalizeSsrFPolicyOrigins(policy.allowedOrigins).includes(requestOrigin)) return policy;
	return {
		...policy,
		allowedHostnames: Array.from(/* @__PURE__ */ new Set([...policy.allowedHostnames ?? [], normalizeHostname(url.hostname)]))
	};
}
function resolveIpv4SpecialUseBlockOptions(policy) {
	return { allowRfc2544BenchmarkRange: policy?.allowRfc2544BenchmarkRange === true };
}
function resolveIpv6SpecialUseBlockOptions(policy) {
	return { allowUniqueLocalRange: policy?.allowIpv6UniqueLocalRange === true };
}
function isHostnameAllowedByPattern(hostname, pattern) {
	if (pattern.startsWith("*.")) {
		const suffix = pattern.slice(2);
		if (!suffix || hostname === suffix) return false;
		return hostname.endsWith(`.${suffix}`);
	}
	return hostname === pattern;
}
function matchesHostnameAllowlist(hostname, allowlist) {
	if (allowlist.length === 0) return true;
	return allowlist.some((pattern) => isHostnameAllowedByPattern(hostname, pattern));
}
function looksLikeUnsupportedIpv4Literal(address) {
	const parts = address.split(".");
	if (parts.length === 0 || parts.length > 4) return false;
	if (parts.some((part) => part.length === 0)) return true;
	return parts.every((part) => /^[0-9]+$/.test(part) || /^0x/i.test(part));
}
function isPrivateIpAddress(address, policy) {
	const normalized = normalizeHostname(address);
	if (!normalized) return false;
	const blockOptions = resolveIpv4SpecialUseBlockOptions(policy);
	const ipv6BlockOptions = resolveIpv6SpecialUseBlockOptions(policy);
	const strictIp = parseCanonicalIpAddress(normalized);
	if (strictIp) {
		if (isIpv4Address(strictIp)) return isBlockedSpecialUseIpv4Address(strictIp, blockOptions);
		if (isBlockedSpecialUseIpv6Address(strictIp, ipv6BlockOptions)) return true;
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
		return embeddedIpv4 ? isBlockedSpecialUseIpv4Address(embeddedIpv4, blockOptions) : false;
	}
	if (normalized.includes(":") && !parseLooseIpAddress(normalized)) return true;
	if (!isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized)) return true;
	if (looksLikeUnsupportedIpv4Literal(normalized)) return true;
	return false;
}
function isBlockedHostnameNormalized(normalized) {
	if (BLOCKED_HOSTNAMES.has(normalized)) return true;
	return normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized.endsWith(".internal");
}
function isBlockedHostnameOrIp(hostname, policy) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) return false;
	return isBlockedHostnameNormalized(normalized) || isPrivateIpAddress(normalized, policy);
}
const BLOCKED_HOST_OR_IP_MESSAGE = "Blocked hostname or private/internal/special-use IP address";
const BLOCKED_RESOLVED_IP_MESSAGE = "Blocked: resolves to private/internal/special-use IP address";
function assertAllowedHostOrIpOrThrow(hostnameOrIp, policy) {
	if (isBlockedHostnameOrIp(hostnameOrIp, policy)) throw new SsrFBlockedError(BLOCKED_HOST_OR_IP_MESSAGE);
}
function resolveHostnamePolicyChecks(hostname, policy) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) throw new Error("Invalid hostname");
	if (normalizeHostnameAllowlist(policy?.blockedHostnames).some((pattern) => isHostnameAllowedByPattern(normalized, pattern))) throw new SsrFBlockedError(`Domain policy: Blocked hostname (configured blocklist): ${hostname}. Try a URL on a different domain or ask the operator to review blockedHostnames.`);
	const hostnameAllowlist = normalizeHostnameAllowlist(policy?.hostnameAllowlist);
	if (!matchesHostnameAllowlist(normalized, hostnameAllowlist)) throw new SsrFBlockedError(`Domain policy: Blocked hostname (not in allowlist): ${hostname}. Permitted hostname patterns: ${hostnameAllowlist.join(", ")}. Try a URL on a permitted domain.`);
	const skipPrivateNetworkChecks = shouldSkipPrivateNetworkChecks(normalized, policy);
	if (!skipPrivateNetworkChecks) assertAllowedHostOrIpOrThrow(normalized, policy);
	return {
		normalized,
		skipPrivateNetworkChecks
	};
}
function assertAllowedResolvedAddressesOrThrow(results, policy) {
	for (const entry of results) if (isBlockedHostnameOrIp(entry.address, policy)) throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
}
function isLoopbackIpAddressIncludingEmbeddedIpv4(address) {
	if (isLoopbackIpAddress(address)) return true;
	const parsed = parseCanonicalIpAddress(address);
	if (!parsed || isIpv4Address(parsed)) return false;
	return extractEmbeddedIpv4FromIpv6(parsed)?.range() === "loopback";
}
function isBlockedTrustedResolvedIpv6Address(address) {
	const parsed = parseCanonicalIpAddress(address);
	if (!parsed || isIpv4Address(parsed)) return false;
	const range = parsed.range();
	if (range !== "unicast" && range !== "rfc6052") return false;
	return isBlockedSpecialUseIpv6Address(parsed);
}
function isExplicitLoopbackHostname(hostname) {
	return hostname === "localhost" || hostname === "localhost.localdomain" || hostname.endsWith(".localhost") || isLoopbackIpAddressIncludingEmbeddedIpv4(hostname);
}
function assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, hostname) {
	const isLoopbackAllowed = isExplicitLoopbackHostname(hostname);
	for (const entry of results) if (isUnspecifiedIpAddress(entry.address) || !isLoopbackAllowed && isLoopbackIpAddressIncludingEmbeddedIpv4(entry.address) || isBlockedTrustedResolvedIpv6Address(entry.address) || isLinkLocalIpAddress(entry.address) || isCloudMetadataIpAddress(entry.address)) throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
}
function normalizeLookupResults(results) {
	if (Array.isArray(results)) return results;
	return [results];
}
function createPinnedLookup(params) {
	const normalizedHost = normalizeHostname(params.hostname);
	if (params.addresses.length === 0) throw new Error(`Pinned lookup requires at least one address for ${params.hostname}`);
	const fallback = params.fallback ?? lookup;
	const records = params.addresses.map((address) => ({
		address,
		family: address.includes(":") ? 6 : 4
	}));
	const ipv4Records = records.filter((entry) => entry.family === 4);
	const automaticRecords = ipv4Records.length > 0 ? ipv4Records : records;
	let index = 0;
	return ((host, options, callback) => {
		const cb = typeof options === "function" ? options : callback;
		if (!cb) return;
		const normalized = normalizeHostname(host);
		if (!normalized || normalized !== normalizedHost) {
			if (typeof options === "function" || options === void 0) return fallback(host, cb);
			if (typeof options === "number") return fallback(host, options, cb);
			return fallback(host, options, cb);
		}
		const opts = typeof options === "object" && options !== null ? options : {};
		const requestedFamily = typeof options === "number" ? options : typeof opts.family === "number" ? opts.family : 0;
		const candidates = requestedFamily === 4 || requestedFamily === 6 ? records.filter((entry) => entry.family === requestedFamily) : automaticRecords;
		const usable = candidates.length > 0 ? candidates : automaticRecords;
		if (opts.all) {
			process.nextTick(() => {
				cb(null, usable);
			});
			return;
		}
		const chosen = expectDefined(usable[index % usable.length], "usable entry at index % usable.length");
		index += 1;
		process.nextTick(() => {
			cb(null, chosen.address, chosen.family);
		});
	});
}
function dedupeAndPreferIpv4(results) {
	const seen = /* @__PURE__ */ new Set();
	const ipv4 = [];
	const otherFamilies = [];
	for (const entry of results) {
		if (seen.has(entry.address)) continue;
		seen.add(entry.address);
		if (entry.family === 4) {
			ipv4.push(entry.address);
			continue;
		}
		otherFamilies.push(entry.address);
	}
	return [...ipv4, ...otherFamilies];
}
async function resolvePinnedHostnameWithPolicy(hostname, params = {}) {
	params.signal?.throwIfAborted();
	const { normalized, skipPrivateNetworkChecks } = resolveHostnamePolicyChecks(hostname, params.policy);
	const lookupFn = params.lookupFn ?? lookup$1;
	const results = normalizeLookupResults(await runAbortablePreflight(() => lookupFn(normalized, { all: true }), params.signal));
	params.signal?.throwIfAborted();
	if (results.length === 0) throw new Error(`Unable to resolve hostname: ${hostname}`);
	if (!skipPrivateNetworkChecks) assertAllowedResolvedAddressesOrThrow(results, params.policy);
	else if (!isPrivateNetworkAllowedByPolicy(params.policy)) assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, normalized);
	const addresses = dedupeAndPreferIpv4(results);
	if (addresses.length === 0) throw new Error(`Unable to resolve hostname: ${hostname}`);
	return {
		hostname: normalized,
		addresses,
		lookup: createPinnedLookup({
			hostname: normalized,
			addresses
		})
	};
}
async function runAbortablePreflight(run, signal) {
	if (!signal) return await run();
	signal.throwIfAborted();
	const aborted = createDeferredCore();
	const onAbort = () => aborted.reject(signal.reason);
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([aborted.promise, run()]);
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
}
function assertHostnameAllowedWithPolicy(hostname, policy) {
	return resolveHostnamePolicyChecks(hostname, policy).normalized;
}
function withPinnedLookup(lookup, connect) {
	return connect ? {
		...connect,
		lookup
	} : { lookup };
}
function resolvePinnedDispatcherLookup(pinned, override, policy) {
	if (!override) return pinned.lookup;
	const normalizedOverrideHost = normalizeHostname(override.hostname);
	if (!normalizedOverrideHost || normalizedOverrideHost !== pinned.hostname) throw new Error(`Pinned dispatcher override hostname mismatch: expected ${pinned.hostname}, got ${override.hostname}`);
	const records = override.addresses.map((address) => ({
		address,
		family: address.includes(":") ? 6 : 4
	}));
	if (!shouldSkipPrivateNetworkChecks(pinned.hostname, policy)) assertAllowedResolvedAddressesOrThrow(records, policy);
	else if (!isPrivateNetworkAllowedByPolicy(policy)) assertAllowedTrustedHostnameResolvedAddressesOrThrow(records, pinned.hostname);
	return createPinnedLookup({
		hostname: pinned.hostname,
		addresses: [...override.addresses],
		fallback: pinned.lookup
	});
}
function createPinnedDispatcher(pinned, policy, ssrfPolicy, timeoutMs) {
	const lookup = resolvePinnedDispatcherLookup(pinned, policy?.pinnedHostname, ssrfPolicy);
	if (!policy || policy.mode === "direct") return createHttp1Agent({ connect: withPinnedLookup(lookup, policy?.connect) }, timeoutMs);
	if (policy.mode === "env-proxy") return createHttp1EnvHttpProxyAgent({
		connect: withPinnedLookup(lookup, policy.connect),
		...policy.proxyTls ? { proxyTls: { ...policy.proxyTls } } : {}
	}, timeoutMs);
	const proxyUrl = policy.proxyUrl.trim();
	const requestTls = withPinnedLookup(lookup, policy.proxyTls);
	if (!requestTls) return createHttp1ProxyAgent({ uri: proxyUrl }, timeoutMs);
	return createHttp1ProxyAgent({
		uri: proxyUrl,
		requestTls
	}, timeoutMs);
}
function destroyDispatcher(candidate) {
	try {
		candidate.destroy?.();
	} catch {}
}
async function waitForDispatcherClose(candidate) {
	const close = candidate.close;
	if (typeof close !== "function") {
		destroyDispatcher(candidate);
		return;
	}
	let timeout;
	try {
		await Promise.race([Promise.resolve(close.call(candidate)), new Promise((resolve) => {
			timeout = setTimeout(() => {
				timeout = void 0;
				destroyDispatcher(candidate);
				resolve();
			}, DISPATCHER_CLOSE_TIMEOUT_MS);
			timeout.unref?.();
		})]);
	} catch (err) {
		destroyDispatcher(candidate);
		throw err;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
async function closeDispatcher(dispatcher) {
	if (!dispatcher) return;
	const candidate = dispatcher;
	try {
		await waitForDispatcherClose(candidate);
	} catch {}
}
//#endregion
//#region src/infra/net/configured-local-origin-bypass.ts
function resolveHttpOrigin(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		parsed.hostname = parsed.hostname.replace(/\.+$/, "");
		return parsed.origin.toLowerCase();
	} catch {
		return;
	}
}
function isLoopbackManagedProxyBypassHost(hostname) {
	const normalized = hostname.trim().toLowerCase().replace(/\.+$/, "").replace(/^\[(.*)\]$/, "$1");
	return normalized === "localhost" || isLoopbackIpAddress(normalized);
}
function isExactConfiguredLocalOriginBypass(params) {
	if (params.managedProxyBypass?.kind !== "configured-local-origin") return false;
	const baseOrigin = resolveHttpOrigin(params.managedProxyBypass.baseUrl);
	if (!baseOrigin) return false;
	let baseHostname;
	try {
		baseHostname = new URL(params.managedProxyBypass.baseUrl.trim()).hostname;
	} catch {
		return false;
	}
	if (!isLoopbackManagedProxyBypassHost(baseHostname)) return false;
	return resolveHttpOrigin(params.url.toString()) === baseOrigin;
}
function isPinnedLoopbackTarget(addresses) {
	return addresses.length > 0 && addresses.every((address) => isLoopbackIpAddress(address));
}
/** Return whether proving a configured local-origin bypass requires target DNS. */
function shouldResolveConfiguredLocalOriginManagedProxyBypass(params) {
	return isExactConfiguredLocalOriginBypass(params);
}
/** Return whether a configured local provider origin may bypass the managed proxy. */
function shouldUseConfiguredLocalOriginManagedProxyBypass(params) {
	if (!isExactConfiguredLocalOriginBypass(params)) return false;
	const loopbackMode = getActiveManagedProxyLoopbackMode();
	if (loopbackMode === "proxy") return false;
	if (loopbackMode === "block" && isLoopbackManagedProxyBypassHost(params.url.hostname)) throw new SsrFBlockedError("proxy: configured local provider loopback connections are blocked by proxy.loopbackMode");
	return isPinnedLoopbackTarget(params.resolvedAddresses);
}
//#endregion
//#region src/infra/net/fetch-request-authority.ts
const requestAuthority = resolveGlobalSingleton(Symbol.for("openclaw.guardedFetchRequestAuthority"), () => new AsyncLocalStorage());
/** Capture before transport preparation so redirects retain the original caller. */
function captureGuardedFetchRequestAuthority() {
	return requestAuthority.getStore();
}
//#endregion
//#region src/infra/net/guarded-body-stream.ts
/**
* Shared body-stream cleanup for guarded fetch consumers (`fetchWithSsrFGuard`
* callers that re-wrap streaming responses).
*/
const guardedBodyCleanupRegistry = new FinalizationRegistry((held) => {
	held.finalize().catch(() => void 0);
});
const guardedBodyAbortOwners = /* @__PURE__ */ new WeakMap();
function wrapBodyStream(params, errorSource) {
	let reader;
	let finalized = false;
	let abortAttached = false;
	let detachAbort = () => {};
	const cleanupRegistrationToken = {};
	const finalize = async (cancelReader = async () => {
		await reader?.cancel().catch(() => void 0);
	}) => {
		if (finalized) return;
		finalized = true;
		detachAbort();
		guardedBodyCleanupRegistry.unregister(cleanupRegistrationToken);
		const [cancellation, readerRelease, cleanup] = await Promise.allSettled([
			cancelReader(),
			(async () => reader?.releaseLock())(),
			(async () => await params.cleanup())()
		]);
		if (cleanup.status === "rejected" && errorSource === "release") throw cleanup.reason;
		if (readerRelease.status === "rejected") throw readerRelease.reason;
		if (cancellation.status === "rejected" && errorSource === "cancellation") throw cancellation.reason;
	};
	const wrappedBody = new ReadableStream({
		start() {
			reader = params.body.getReader();
		},
		async pull(controller) {
			const signal = params.signal;
			if (signal && !abortAttached) {
				abortAttached = true;
				const owner = { abort: () => {
					if (finalized) return;
					const reason = signal.reason ?? new DOMException("This operation was aborted", "AbortError");
					const cleanup = finalize(async () => await reader?.cancel(reason));
					controller.error(reason);
					cleanup.catch(() => void 0);
				} };
				guardedBodyAbortOwners.set(wrappedBody, owner);
				const ownerRef = new WeakRef(owner);
				const abort = () => ownerRef.deref()?.abort();
				if (signal.aborted) abort();
				else {
					signal.addEventListener("abort", abort, { once: true });
					detachAbort = () => signal.removeEventListener("abort", abort);
				}
			}
			if (finalized) return;
			try {
				const chunk = await reader?.read();
				if (!chunk || chunk.done) {
					controller.close();
					await finalize();
					return;
				}
				params.refreshTimeout?.();
				controller.enqueue(chunk.value);
			} catch (error) {
				if (finalized) return;
				if (errorSource === "release") await finalize();
				controller.error(error);
				await finalize();
			}
		},
		async cancel(reason) {
			await finalize(async () => await reader?.cancel(reason));
		}
	}, params.signal ? { highWaterMark: 0 } : void 0);
	guardedBodyCleanupRegistry.register(wrappedBody, { finalize }, cleanupRegistrationToken);
	return wrappedBody;
}
/** Preserves post-header request cancellation around runtime fetch body streams. */
function responseWithAbortSignal(response, signal) {
	if (!response.body || !signal) return response;
	const wrapped = new Response(wrapBodyStream({
		body: response.body,
		cleanup: () => {},
		signal
	}, "cancellation"), {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
	const applyMetadata = (target) => {
		Object.defineProperties(target, {
			headers: { value: response.headers },
			url: { value: response.url },
			redirected: { value: response.redirected },
			type: { value: response.type },
			clone: {
				configurable: true,
				value: () => applyMetadata(Response.prototype.clone.call(target)),
				writable: true
			}
		});
		return target;
	};
	return applyMetadata(wrapped);
}
AsyncLocalStorage.snapshot();
//#endregion
//#region src/infra/net/redirect-headers.ts
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = /* @__PURE__ */ new Set([
	"accept",
	"accept-encoding",
	"accept-language",
	"cache-control",
	"content-language",
	"content-type",
	"if-match",
	"if-modified-since",
	"if-none-match",
	"if-unmodified-since",
	"pragma",
	"range",
	"user-agent"
]);
/**
* Keeps only headers that are safe to replay after a redirect crosses origins.
* Authorization/cookie-like metadata must be dropped before the follow-up fetch.
*/
function retainSafeHeadersForCrossOriginRedirect$1(headers) {
	if (!headers) return headers;
	const incoming = new Headers(normalizeHeadersInitForFetch(headers));
	const safeHeaders = {};
	for (const [key, value] of incoming.entries()) if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(normalizeLowercaseStringOrEmpty(key))) safeHeaders[key] = value;
	return safeHeaders;
}
//#endregion
//#region src/infra/net/form-data.ts
function isFormDataLike(value) {
	return typeof value === "object" && value !== null && typeof value.entries === "function" && value[Symbol.toStringTag] === "FormData";
}
//#endregion
//#region src/infra/net/runtime-fetch.ts
function normalizeRuntimeFormData(body, RuntimeFormData) {
	if (!isFormDataLike(body) || typeof RuntimeFormData !== "function") return body;
	if (body instanceof RuntimeFormData) return body;
	const next = new RuntimeFormData();
	for (const [key, value] of body.entries()) {
		const namedValue = value;
		const fileName = typeof namedValue.name === "string" && namedValue.name.trim() ? namedValue.name : void 0;
		if (fileName) next.append(key, value, fileName);
		else next.append(key, value);
	}
	return next;
}
function normalizeRuntimeRequestInit(init, RuntimeFormData) {
	if (!init) return init;
	const normalizedHeaders = normalizeHeadersInitForFetch(init.headers);
	const initWithNormalizedHeaders = normalizedHeaders === init.headers ? init : {
		...init,
		headers: normalizedHeaders
	};
	if (!init.body) return initWithNormalizedHeaders;
	const body = normalizeRuntimeFormData(init.body, RuntimeFormData);
	if (body === init.body) return initWithNormalizedHeaders;
	const headers = new Headers(normalizedHeaders);
	headers.delete("content-length");
	headers.delete("content-type");
	return {
		...initWithNormalizedHeaders,
		headers,
		body
	};
}
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
function isMockedFetch(fetchImpl) {
	if (typeof fetchImpl !== "function") return false;
	return typeof fetchImpl.mock === "object";
}
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
async function fetchWithRuntimeDispatcher(input, init) {
	return await fetchWithPreparedRuntimeDispatcher(loadUndiciRuntimeDeps(), input, init);
}
/** Uses one prepared Undici snapshot so reusable fetch wrappers stay stable. */
function fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, init) {
	const runtimeFetch = runtimeDeps.fetch;
	return runtimeFetch(input, normalizeRuntimeRequestInit(init, runtimeDeps.FormData));
}
Object.freeze({ allowH2: false });
/**
* Module-level bridge so `resolveDispatcherTimeoutMs` in fetch-guard.ts
* can read the global dispatcher timeout without relying on Undici's
* non-public `.options` field.
*/
let globalUndiciStreamTimeoutMs;
//#endregion
//#region src/infra/net/fetch-guard.ts
function resolveDispatcherTimeoutMs(fromParams) {
	return fromParams !== void 0 ? fromParams : globalUndiciStreamTimeoutMs;
}
const GUARDED_FETCH_MODE = {
	STRICT: "strict",
	TRUSTED_ENV_PROXY: "trusted_env_proxy",
	TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy"
};
var GuardedFetchRedirectError = class extends Error {
	constructor(params) {
		super(`Too many redirects (limit: ${params.maxRedirects})`);
		this.name = "GuardedFetchRedirectError";
		this.status = params.status;
		this.maxRedirects = params.maxRedirects;
	}
};
const DEFAULT_MAX_REDIRECTS = 3;
const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
function getRedirectVisitKey(url, init) {
	return `${init?.method?.toUpperCase() ?? "GET"} ${url}`;
}
function isTruthyEnvValue(value) {
	return value === "1" || value === "true" || value === "yes" || value === "on";
}
function resolveGuardedFetchMode(params) {
	if (params.mode) return params.mode;
	if (params.proxy === "env" && params.dangerouslyAllowEnvProxyWithoutPinnedDns === true) return GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY;
	return GUARDED_FETCH_MODE.STRICT;
}
function isManagedProxyActive() {
	return process.env["OPENCLAW_PROXY_ACTIVE"] === "1";
}
function assertExplicitProxySupportsPinnedDns(url, dispatcherPolicy, pinDns) {
	if (pinDns !== false && dispatcherPolicy?.mode === "explicit-proxy" && url.protocol !== "https:") throw new Error("Explicit proxy SSRF pinning requires HTTPS targets; plain HTTP targets are not supported");
}
function createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs) {
	if (!dispatcherPolicy) return null;
	if (dispatcherPolicy.mode === "direct") return createHttp1Agent(dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : void 0, timeoutMs);
	if (dispatcherPolicy.mode === "env-proxy") return createHttp1EnvHttpProxyAgent({
		...dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : {},
		...dispatcherPolicy.proxyTls ? { proxyTls: { ...dispatcherPolicy.proxyTls } } : {}
	}, timeoutMs);
	const proxyUrl = dispatcherPolicy.proxyUrl.trim();
	const requestTls = dispatcherPolicy.proxyTls;
	return createHttp1ProxyAgent({
		uri: proxyUrl,
		...requestTls ? { requestTls: { ...requestTls } } : {}
	}, timeoutMs);
}
async function assertExplicitProxyAllowed(dispatcherPolicy, lookupFn, policy, signal, trustedProxy) {
	if (!dispatcherPolicy || dispatcherPolicy.mode !== "explicit-proxy") return;
	let parsedProxyUrl;
	try {
		parsedProxyUrl = new URL(dispatcherPolicy.proxyUrl);
	} catch {
		throw new Error("Invalid explicit proxy URL");
	}
	const trustedSocks = trustedProxy && ["socks:", "socks5:"].includes(parsedProxyUrl.protocol);
	if (!["http:", "https:"].includes(parsedProxyUrl.protocol) && !trustedSocks) throw new Error("Explicit proxy URL must use http or https");
	const proxyPolicy = policy || dispatcherPolicy.allowPrivateProxy === true ? {
		...policy,
		hostnameAllowlist: void 0,
		...dispatcherPolicy.allowPrivateProxy === true ? { allowPrivateNetwork: true } : {}
	} : void 0;
	await resolvePinnedHostnameWithPolicy(parsedProxyUrl.hostname, {
		lookupFn,
		policy: proxyPolicy,
		signal
	});
}
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function isAmbientGlobalFetch(params) {
	return typeof params.fetchImpl === "function" && typeof params.globalFetch === "function" && params.fetchImpl === params.globalFetch;
}
async function prepareGuardedFetchCapture(params, fetchImpl) {
	if (params.capture === false || !isTruthyEnvValue(process.env[OPENCLAW_DEBUG_PROXY_ENABLED])) return { fetchImpl };
	const { prepareHttpCapture, resolveDebugProxyFetchTransport } = await import("./runtime-DpoxgwZu.js");
	return {
		fetchImpl: resolveDebugProxyFetchTransport(fetchImpl),
		capture: prepareHttpCapture()
	};
}
function retainSafeHeadersForCrossOriginRedirect(init) {
	if (!init?.headers) return init;
	return {
		...init,
		headers: retainSafeHeadersForCrossOriginRedirect$1(init.headers)
	};
}
function resolveRetainedAuthorizationForRedirect(params) {
	const init = params.init;
	if (!init?.headers || !params.hostnameAllowlist?.length) return;
	if (params.nextUrl.protocol !== "https:") return;
	if (!params.hostnameAllowlist.includes("*") && !matchesHostnameAllowlist(params.nextUrl.hostname, params.hostnameAllowlist)) return;
	const normalizedInit = normalizeRequestInitHeadersForFetch(init);
	if (!normalizedInit?.headers) return;
	return new Headers(normalizedInit.headers).get("authorization") ?? void 0;
}
function restoreRedirectAuthorization(params) {
	if (!params.authorization) return params.init;
	const headers = new Headers(params.init?.headers);
	headers.set("Authorization", params.authorization);
	return {
		...params.init,
		headers
	};
}
function dropBodyHeaders(headers) {
	if (!headers) return headers;
	const nextHeaders = new Headers(normalizeHeadersInitForFetch(headers));
	nextHeaders.delete("content-encoding");
	nextHeaders.delete("content-language");
	nextHeaders.delete("content-length");
	nextHeaders.delete("content-location");
	nextHeaders.delete("content-type");
	nextHeaders.delete("transfer-encoding");
	return nextHeaders;
}
function rewriteRedirectInitForMethod(params) {
	const { init, status } = params;
	if (!init) return init;
	const currentMethod = init.method?.toUpperCase() ?? "GET";
	if (!(status === 303 ? currentMethod !== "GET" && currentMethod !== "HEAD" : (status === 301 || status === 302) && currentMethod === "POST")) return init;
	return {
		...init,
		method: "GET",
		body: void 0,
		headers: dropBodyHeaders(init.headers)
	};
}
function rewriteRedirectInitForCrossOrigin(params) {
	const { init, allowUnsafeReplay } = params;
	if (!init || allowUnsafeReplay) return init;
	const currentMethod = init.method?.toUpperCase() ?? "GET";
	if (currentMethod === "GET" || currentMethod === "HEAD") return init;
	return {
		...init,
		body: void 0,
		headers: dropBodyHeaders(init.headers)
	};
}
async function fetchWithSsrFGuard(params) {
	const { managedProxyBypass: _ignoredManagedProxyBypass, ...publicParams } = params;
	return await fetchWithSsrFGuardInternal(publicParams);
}
async function fetchWithSsrFGuardInternal(params) {
	const assertCurrent = captureGuardedFetchRequestAuthority();
	const globalFetch = globalThis.fetch;
	const defaultFetch = params.fetchImpl ?? globalFetch;
	if (!defaultFetch) throw new Error("fetch is not available");
	const isUsingMockedFetch = isMockedFetch(defaultFetch);
	const supportsDispatcherInit = params.fetchImpl !== void 0 && !isAmbientGlobalFetch({
		fetchImpl: params.fetchImpl,
		globalFetch
	}) || isUsingMockedFetch;
	const captureAdmission = await prepareGuardedFetchCapture(params, defaultFetch);
	const maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects) ? Math.max(0, Math.floor(params.maxRedirects)) : DEFAULT_MAX_REDIRECTS;
	const mode = resolveGuardedFetchMode(params);
	const { signal, cleanup, refresh } = buildTimeoutAbortSignal({
		timeoutMs: params.timeoutMs,
		signal: params.signal ?? params.init?.signal ?? void 0,
		operation: "fetchWithSsrFGuard",
		url: params.url
	});
	let finished = false;
	const finishRequest = async (releaseDispatcher) => {
		if (finished) return;
		finished = true;
		cleanup();
		await releaseDispatcher?.();
	};
	let currentUrl = params.url;
	let currentInit = normalizeRequestInitHeadersForFetch(params.init ? { ...params.init } : void 0);
	const visited = /* @__PURE__ */ new Set([getRedirectVisitKey(currentUrl, currentInit)]);
	let redirectCount = 0;
	while (true) {
		let parsedUrl;
		try {
			parsedUrl = new URL(currentUrl);
		} catch {
			await finishRequest();
			throw new Error("Invalid URL: must be http or https");
		}
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			await finishRequest();
			throw new Error("Invalid URL: must be http or https");
		}
		if (params.requireHttps === true && parsedUrl.protocol !== "https:") {
			await finishRequest();
			throw new Error("URL must use https");
		}
		let dispatcher = null;
		let dispatcherLease;
		let response;
		const requestController = new AbortController();
		const releaseDispatcher = async () => {
			requestController.abort();
			await cancelUnreadResponseBody(response);
			await (dispatcherLease ? dispatcherLease.release() : closeDispatcher(dispatcher));
		};
		const policyForUrl = resolveSsrFPolicyForUrl(parsedUrl, params.policy);
		const dispatcherPolicy = params.resolveDispatcherPolicy?.(parsedUrl) ?? params.dispatcherPolicy;
		const resolvePinnedHostname = async () => await resolvePinnedHostnameWithPolicy(parsedUrl.hostname, {
			lookupFn: params.lookupFn,
			policy: policyForUrl,
			signal
		});
		try {
			const usesTrustedExplicitProxyMode = mode === GUARDED_FETCH_MODE.TRUSTED_EXPLICIT_PROXY && dispatcherPolicy?.mode === "explicit-proxy";
			assertExplicitProxySupportsPinnedDns(parsedUrl, dispatcherPolicy, usesTrustedExplicitProxyMode ? false : params.pinDns);
			await assertExplicitProxyAllowed(dispatcherPolicy, params.lookupFn, params.policy, signal, usesTrustedExplicitProxyMode);
			const isStrictManagedProxyActive = mode === GUARDED_FETCH_MODE.STRICT && isManagedProxyActive();
			const shouldCheckManagedProxyBypass = isStrictManagedProxyActive && shouldResolveConfiguredLocalOriginManagedProxyBypass({
				url: parsedUrl,
				managedProxyBypass: params.managedProxyBypass
			});
			const canUseManagedProxy = isStrictManagedProxyActive && (shouldUseEnvHttpProxyForUrl(parsedUrl.toString()) || shouldCheckManagedProxyBypass);
			const canUseTrustedEnvProxy = (mode === GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY || params.useEnvProxyForEligibleUrls === true && !canUseManagedProxy) && !dispatcherPolicy && shouldUseEnvHttpProxyForUrl(parsedUrl.toString());
			const canUseMockedFetchWithoutDns = isUsingMockedFetch && params.lookupFn === void 0 && !canUseTrustedEnvProxy && !canUseManagedProxy && !usesTrustedExplicitProxyMode && params.pinDns !== false;
			const timeoutMs = resolveDispatcherTimeoutMs(params.timeoutMs);
			if (canUseTrustedEnvProxy || canUseManagedProxy || params.pinDns === false) assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
			if (canUseTrustedEnvProxy) dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
			else if (canUseManagedProxy) {
				if (shouldCheckManagedProxyBypass) {
					const pinned = await resolvePinnedHostname();
					dispatcher = shouldUseConfiguredLocalOriginManagedProxyBypass({
						url: parsedUrl,
						managedProxyBypass: params.managedProxyBypass,
						resolvedAddresses: pinned.addresses
					}) ? createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs) : createHttp1EnvHttpProxyAgent({
						noProxy: "",
						...dispatcherPolicy?.mode === "direct" && dispatcherPolicy.connect ? { requestTls: { ...dispatcherPolicy.connect } } : {}
					}, timeoutMs);
				} else dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
			} else if (usesTrustedExplicitProxyMode) {
				assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
				dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
			} else if (canUseMockedFetchWithoutDns) assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
			else if (params.pinDns === false) {
				await resolvePinnedHostname();
				dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
			} else {
				const pinned = await resolvePinnedHostname();
				if (params.dispatcherPool && mode === GUARDED_FETCH_MODE.STRICT && dispatcherPolicy === void 0) {
					const familyConnect = resolveUndiciAutoSelectFamilyConnectOptions();
					const key = JSON.stringify({
						origin: parsedUrl.origin,
						addresses: [...pinned.addresses].toSorted(),
						timeoutMs: timeoutMs ?? null,
						familyConnect: familyConnect ?? null,
						policy: policyForUrl ?? null
					});
					dispatcherLease = params.dispatcherPool.acquire({
						key,
						groupKey: parsedUrl.origin,
						createDispatcher: () => createPinnedDispatcher(pinned, familyConnect ? {
							mode: "direct",
							connect: familyConnect
						} : void 0, policyForUrl, timeoutMs)
					});
					dispatcher = dispatcherLease ? dispatcherLease.dispatcher : createPinnedDispatcher(pinned, void 0, policyForUrl, timeoutMs);
				} else dispatcher = createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs);
			}
			const init = {
				...currentInit ? { ...currentInit } : {},
				redirect: "manual",
				...dispatcher ? { dispatcher } : {},
				signal: signal ? AbortSignal.any([signal, requestController.signal]) : requestController.signal
			};
			const shouldUseRuntimeFetch = Boolean(dispatcher) && !supportsDispatcherInit;
			const beforeRequestResult = params.beforeRequest?.();
			if (isPromiseLike(beforeRequestResult)) {
				Promise.resolve(beforeRequestResult).catch(() => void 0);
				throw new TypeError("beforeRequest must be synchronous.");
			}
			assertCurrent?.();
			const captureParams = {
				url: parsedUrl.toString(),
				method: currentInit?.method ?? "GET",
				signal: process.versions.bun ? init.signal ?? void 0 : void 0,
				requestHeaders: currentInit?.headers,
				requestBody: currentInit?.body ?? null,
				transport: "http",
				flowId: params.capture === false ? void 0 : params.capture?.flowId,
				meta: {
					captureOrigin: "guarded-fetch",
					...params.auditContext ? { auditContext: params.auditContext } : {},
					...params.capture === false ? {} : params.capture?.meta,
					...params.capture && params.capture.sensitiveRequestHeaderNames ? { sensitiveRequestHeaderNames: params.capture.sensitiveRequestHeaderNames } : {}
				}
			};
			try {
				response = shouldUseRuntimeFetch ? await fetchWithRuntimeDispatcher(parsedUrl.toString(), init) : await captureAdmission.fetchImpl(parsedUrl.toString(), init);
			} catch (error) {
				captureAdmission.capture?.({
					...captureParams,
					error
				});
				throw error;
			}
			captureAdmission.capture?.({
				...captureParams,
				response
			});
			if (isRedirectStatus(response.status)) {
				redirectCount += 1;
				if (redirectCount > maxRedirects) throw new GuardedFetchRedirectError({
					status: response.status,
					maxRedirects
				});
				const location = response.headers.get("location");
				if (!location) throw new Error(`Redirect missing location header (${response.status})`);
				const nextParsedUrl = new URL(location, parsedUrl);
				const nextUrl = nextParsedUrl.toString();
				const retainedAuthorization = resolveRetainedAuthorizationForRedirect({
					init: currentInit,
					nextUrl: nextParsedUrl,
					hostnameAllowlist: params.retainAuthorizationRedirectHostnameAllowlist
				});
				currentInit = rewriteRedirectInitForMethod({
					init: currentInit,
					status: response.status
				});
				if (nextParsedUrl.origin !== parsedUrl.origin) {
					currentInit = rewriteRedirectInitForCrossOrigin({
						init: currentInit,
						allowUnsafeReplay: params.allowCrossOriginUnsafeRedirectReplay === true
					});
					currentInit = retainSafeHeadersForCrossOriginRedirect(currentInit);
					currentInit = restoreRedirectAuthorization({
						init: currentInit,
						authorization: retainedAuthorization
					});
				}
				const nextVisitKey = getRedirectVisitKey(nextUrl, currentInit);
				if (visited.has(nextVisitKey)) throw new Error("Redirect loop detected");
				visited.add(nextVisitKey);
				await releaseDispatcher();
				currentUrl = nextUrl;
				continue;
			}
			return {
				response: process.versions.bun && !(response instanceof Response) ? responseWithAbortSignal(response, init.signal ?? void 0) : response,
				finalUrl: currentUrl,
				release: async () => finishRequest(releaseDispatcher),
				refreshTimeout: refresh,
				dispatcherReused: dispatcherLease?.reused
			};
		} catch (err) {
			if (err instanceof SsrFBlockedError) logWarn(`security: blocked URL fetch (${params.auditContext ?? "url-fetch"}) targetOrigin=${parsedUrl.origin} reason=${err.message}`);
			await finishRequest(releaseDispatcher);
			throw err;
		}
	}
}
//#endregion
export { fetchWithSsrFGuard };
