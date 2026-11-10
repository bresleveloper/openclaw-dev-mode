import { t as __commonJSMin } from "./openclaw-state-read-rolldown-runtime-rQ84J-ij.mjs";
import { c as coerceErrorMessage, d as extractErrorCode, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { C as defaultPayload, F as resolveOpenClawStateDirForDatabasePath, G as getSqliteRuntimeCapabilities, K as isSqliteWalResetSafeVersion, M as resolveDatabasePath, O as describeGatewayLockHolder, S as assertPersistedStateDatabaseAccessAllowed, T as GATEWAY_OWNER_HEARTBEAT_MS, V as SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, W as ensureSqliteLibrarySelected, b as StateDatabaseMaintenanceScopeError, d as resolveRuntimeProcessEntrypointUrl, k as parseGatewayLockPayload, n as createCpuTrackedWorker, s as recordWorkerMessage, u as captureRuntimeWorkerSource, v as GatewayStateOwnerContentionError, w as isGatewayStateOwnerDefinitelyStale, y as StateDatabaseAdmissionPendingError } from "./openclaw-state-read-worker-cpu-DxXDPrAN.mjs";
import { J as throwSqliteLifecycleErrors, Ot as findChangedDatabasePaths, Pt as readDatabasePathIdentitySync, g as prepareSqliteDatabaseAdmission, kt as inspectDatabasePathIdentitySync, n as bindSqliteDatabaseAdmission, q as runWithSqliteCleanup } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import { a as registerSqliteReaderConnection } from "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { S as resolveGatewayLockDirForCanonicalStateDir, W as resolveIdentityPathViaExistingAncestorSync, t as createSubsystemLogger, x as resolveGatewayLockDir } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { n as sha256HexPrefixCore } from "./openclaw-state-read-node-crypto-D_-P4MKR.mjs";
import { C as admitPathInsideRoot, Ct as inspectFileIdentitySync, J as directoryComponentNotDirectoryError, W as inspectDirectoryIdentitySync, Z as hardlinkedPathNotAllowedError, d as resolveReadOpenFlags, dt as realpathSync$1, n as readFileDescriptorBoundedSync, rt as outsideWorkspaceError } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, c as normalizeWindowsPathForComparison, d as assertNoWindowsPathAlias, i as isNotFoundPathError, m as pathForWindowsFilesystem } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { I as sleepSync, L as recursiveMkdirPath, M as createSuppressedError, S as sidecarLockSnapshotMatches, U as assertExclusiveCreateLeaf, a as sidecarLockRetryDelay, c as validateSidecarLockCompromiseCheckIntervalMs, d as validateSidecarLockTimeoutMs, f as parseSidecarLockPayload, g as readSidecarLockSnapshotSync, h as readSidecarLockRawSnapshotSync, i as sidecarLockPayloadCreatedAtMs, l as validateSidecarLockRetryOptions, o as sidecarLockStale, p as parseSidecarLockSnapshot, r as isTransientLockFileDenial, s as sidecarLockTimeout, t as ensureSidecarLockCleanupRegistered, u as validateSidecarLockStaleMs, x as serializeSidecarLockPayload, y as removeSidecarLockIfUnchangedSync, z as assertSynchronousCallbackResult } from "./openclaw-state-read-sidecar-lock-registration-C-Pbqw8O.mjs";
import { D as assertRootIdentityCurrentSync, a as captureFileLockSyncRootAuthority, d as sameAbsolutePath, i as assertFileLockSyncRootResolvedPathCurrent, n as assertFileLockSyncRootMutationAllowed, o as invokeFileLockSyncRootMutationAuthority, r as assertFileLockSyncRootPathsCurrent, s as normalizeFileLockSyncTargetWithRoot, t as admitFileLockSyncRootPath } from "./openclaw-state-read-file-lock-sync-root-MLFwCZr0.mjs";
import { i as getFsSafeLockConfig } from "./openclaw-state-read-stale-lock-file-BZJVXTuc.mjs";
import { t as formatErrorMessage } from "./openclaw-state-read-errors-BV4NDRNo.mjs";
import { T as registerNodeSqliteDisposeCallback } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { t as runInDetachedAsyncContext } from "./openclaw-state-read-detached-async-context-BrFwufJ7.mjs";
import { D as probeSqliteIteratorBehavior, S as trackSqliteSchema } from "./openclaw-state-read-sqlite-error-diagnostics-B72btzpi.mjs";
import { i as isPidAlive } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { n as resolveRuntimeWorkerThreadExecArgv } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import { t as normalizeSqliteNonNegativeInteger } from "./openclaw-state-read-sqlite-busy-timeout-BW3lmGFD.mjs";
import { createRequire } from "node:module";
import fs, { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { MessageChannel, getEnvironmentData, isMainThread, setEnvironmentData } from "node:worker_threads";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || 
		/* istanbul ignore next */ 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	const isPrereleaseIdentifier = (prerelease, identifier) => {
		const identifiers = identifier.split(".");
		if (identifiers.length > prerelease.length) return false;
		for (let i = 0; i < identifiers.length; i++) if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) return false;
		return true;
	};
	module.exports = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) {
				if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
				else version = version.version;
			} else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (isPrereleaseIdentifier(this.prerelease, identifier)) {
							const prereleaseBase = this.prerelease[identifier.split(".").length];
							if (isNaN(prereleaseBase)) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = require_parse();
	const { safeRe: re, t } = require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		const minor = match[3] || "0";
		const patch = match[4] || "0";
		const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
		const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
		return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/truncate.js
var require_truncate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const truncate = (version, truncation, options) => {
		if (!constants.RELEASE_TYPES.includes(truncation)) return null;
		const clonedVersion = cloneInputVersion(version, options);
		return clonedVersion && doTruncation(clonedVersion, truncation);
	};
	const cloneInputVersion = (version, options) => {
		const versionStringToParse = version instanceof SemVer ? version.version : version;
		return parse(versionStringToParse, options);
	};
	const doTruncation = (version, truncation) => {
		if (isPrerelease(truncation)) return version.version;
		version.prerelease = [];
		switch (truncation) {
			case "major":
				version.minor = 0;
				version.patch = 0;
				break;
			case "minor": version.patch = 0;
		}
		return version.format();
	};
	const isPrerelease = (type) => {
		return type.startsWith("pre");
	};
	module.exports = truncate;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	module.exports = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) {
				if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
				else return new Range(range.raw, options);
			}
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			range = range.replace(BUILDSTRIPRE, "");
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const { safeRe: re, src, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) {
				if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			} else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") {
					if (m === "0") ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
					else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
				} else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			if (invalidXRangeOrder(M, m, p)) return comp;
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) {
				if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
				else ret = "*";
			} else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	module.exports = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) {
				if (comp.loose === !!options.loose) return comp;
				else comp = comp.value;
			}
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const Range = require_range();
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const gt = require_gt();
	const minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const Range = require_range();
	const satisfies = require_satisfies();
	const gt = require_gt();
	const lt = require_lt();
	const lte = require_lte();
	const gte = require_gte();
	const outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const satisfies = require_satisfies();
	const compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const satisfies = require_satisfies();
	const compare = require_compare();
	const subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	const minimumVersion = [new Comparator(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) {
			if (dom.length === 1 && dom[0].semver === ANY) return true;
			else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
			else sub = minimumVersion;
		}
		if (dom.length === 1 && dom[0].semver === ANY) {
			if (options.includePrerelease) return true;
			else dom = minimumVersion;
		}
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !c.test(gt.semver)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !c.test(lt.semver)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));
//#endregion
//#region node_modules/.pnpm/semver@7.8.5/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	module.exports = {
		parse: require_parse(),
		valid: require_valid$1(),
		clean: require_clean(),
		inc: require_inc(),
		diff: require_diff(),
		major: require_major(),
		minor: require_minor(),
		patch: require_patch(),
		prerelease: require_prerelease(),
		compare: require_compare(),
		rcompare: require_rcompare(),
		compareLoose: require_compare_loose(),
		compareBuild: require_compare_build(),
		sort: require_sort(),
		rsort: require_rsort(),
		gt: require_gt(),
		lt: require_lt(),
		eq: require_eq(),
		neq: require_neq(),
		gte: require_gte(),
		lte: require_lte(),
		cmp: require_cmp(),
		coerce: require_coerce(),
		truncate: require_truncate(),
		Comparator: require_comparator(),
		Range: require_range(),
		satisfies: require_satisfies(),
		toComparators: require_to_comparators(),
		maxSatisfying: require_max_satisfying(),
		minSatisfying: require_min_satisfying(),
		minVersion: require_min_version(),
		validRange: require_valid(),
		outside: require_outside(),
		gtr: require_gtr(),
		ltr: require_ltr(),
		intersects: require_intersects(),
		simplifyRange: require_simplify(),
		subset: require_subset(),
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));
//#endregion
//#region src/infra/semver.ts
var import_semver = require_semver();
function compareValidSemver(left, right) {
	const parsedLeft = (0, import_semver.parse)(left);
	const parsedRight = (0, import_semver.parse)(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
//#endregion
//#region src/infra/warning-filter.ts
const warningFilterKey = Symbol.for("openclaw.warning-filter");
function shouldIgnoreWarning(warning) {
	return Boolean(warning.code === "DEP0040" && warning.message?.includes("punycode") || warning.code === "DEP0060" && warning.message?.includes("util._extend") || warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature"));
}
function normalizeWarningArgs(args) {
	const warningArg = args[0];
	const secondArg = args[1];
	const thirdArg = args[2];
	let name;
	let code;
	let message;
	if (warningArg instanceof Error) {
		name = warningArg.name;
		message = warningArg.message;
		code = warningArg.code;
	} else if (typeof warningArg === "string") message = warningArg;
	if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
		const options = secondArg;
		if (typeof options.type === "string") name = options.type;
		if (typeof options.code === "string") code = options.code;
	} else {
		if (typeof secondArg === "string") name = secondArg;
		if (typeof thirdArg === "string") code = thirdArg;
	}
	return {
		name,
		code,
		message
	};
}
/** Installs the global process warning filter once for the current JS realm. */
function installProcessWarningFilter() {
	const state = resolveGlobalSingleton(warningFilterKey, () => ({ installed: false }));
	if (state.installed) return;
	const originalEmitWarning = process.emitWarning.bind(process);
	const wrappedEmitWarning = ((...args) => {
		if (shouldIgnoreWarning(normalizeWarningArgs(args))) return;
		if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
			const warning = args[0];
			const emitted = Object.assign(new Error(warning.message), {
				name: warning.name,
				code: warning.code
			});
			process.emit("warning", emitted);
			return;
		}
		Reflect.apply(originalEmitWarning, process, args);
	});
	process.emitWarning = wrappedEmitWarning;
	state.installed = true;
}
//#endregion
//#region src/infra/node-sqlite.ts
const require$1 = createRequire(import.meta.url);
let validatedSqliteModule;
let extensionLoadingSupported = false;
let jsonbSupported = false;
let bunSqliteNativeCleanupPending = false;
function resolveSqliteFilesystemPath(pathname) {
	if (process.platform !== "win32") return pathname;
	return path.toNamespacedPath(path.resolve(pathname));
}
function resolveNodeSqliteLocation(location) {
	if (location === "" || location === ":memory:" || location.startsWith("file:")) return location;
	return resolveSqliteFilesystemPath(location);
}
/** Preserve native Windows path prefixes before adding SQLite URI parameters. */
function resolveSqliteFileUriPath(pathname, platform) {
	if (platform === "win32") {
		const namespacedPath = path.win32.toNamespacedPath(path.win32.resolve(pathname));
		return `file:${encodeURIComponent(namespacedPath)}`;
	}
	return pathToFileURL(path.resolve(pathname)).href;
}
/** Open an existing writable database without SQLite's create-if-missing flag. */
function resolveExistingSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=rw`;
}
/** Build an immutable SQLite URI without losing the Windows long-path namespace. */
function resolveImmutableSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=ro&immutable=1`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.22.1+ or 26.12.1+ before retrying."}`);
}
function sqliteNativeRuntimeIdentity() {
	return {
		pid: process.pid,
		executable: process.execPath,
		nodeVersion: process.versions.node,
		bunVersion: process.versions.bun,
		library: ensureSqliteLibrarySelected()
	};
}
function parseSqliteNativeRuntimeAdmission(value) {
	if (!isRecord(value) || value.format !== 1 || typeof value.version !== "string" || typeof value.extensionLoadingSupported !== "boolean" || !isRecord(value.iteratorBehavior) || typeof value.iteratorBehavior.nextAfterDoneIsTerminal !== "boolean" || typeof value.iteratorBehavior.returnAfterDoneIsInert !== "boolean") return;
	const runtime = sqliteNativeRuntimeIdentity();
	if (!isDeepStrictEqual(value.runtime, runtime)) return;
	return {
		format: 1,
		runtime,
		version: value.version,
		extensionLoadingSupported: value.extensionLoadingSupported,
		iteratorBehavior: {
			nextAfterDoneIsTerminal: value.iteratorBehavior.nextAfterDoneIsTerminal,
			returnAfterDoneIsInert: value.iteratorBehavior.returnAfterDoneIsInert
		}
	};
}
function safeSqliteNativeRuntimeAdmission(value) {
	try {
		const admission = parseSqliteNativeRuntimeAdmission(value);
		return admission && isSqliteWalResetSafeVersion(admission.version) ? admission : void 0;
	} catch {
		return;
	}
}
/** Publish to later sibling workers; database authority remains with its existing owners. */
function installSqliteNativeRuntimeAdmission(value) {
	const admission = safeSqliteNativeRuntimeAdmission(value);
	if (admission) setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, admission);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule?.sqlite === sqlite) return validatedSqliteModule.iteratorBehavior;
	const inherited = isMainThread ? void 0 : parseSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY));
	if (inherited) {
		assertSqliteWalResetSafeVersion(inherited.version, process.versions.node);
		jsonbSupported = (compareValidSemver(inherited.version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = inherited.extensionLoadingSupported;
		validatedSqliteModule = {
			sqlite,
			iteratorBehavior: inherited.iteratorBehavior
		};
		return inherited.iteratorBehavior;
	}
	const database = new sqlite.DatabaseSync(":memory:");
	let version;
	let extensions;
	let iteratorBehavior;
	try {
		const statement = database.prepare("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted");
		const row = statement.get();
		version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		extensions = row?.omitted === 0;
		iteratorBehavior = probeSqliteIteratorBehavior(statement);
	} finally {
		database.close();
	}
	jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
	extensionLoadingSupported = extensions;
	validatedSqliteModule = {
		sqlite,
		iteratorBehavior
	};
	setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, {
		format: 1,
		runtime: sqliteNativeRuntimeIdentity(),
		version,
		extensionLoadingSupported: extensions,
		iteratorBehavior
	});
	return iteratorBehavior;
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		ensureSqliteLibrarySelected();
		const sqlite = require$1("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Whether the loaded SQLite library supports native extensions. */
function supportsNodeSqliteExtensionLoading() {
	requireNodeSqlite();
	return extensionLoadingSupported;
}
/** JSONB is absent from the supported SQLite 3.44 maintenance line. */
function supportsNodeSqliteJsonb() {
	requireNodeSqlite();
	return jsonbSupported;
}
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const identity = options?.open === false ? void 0 : prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
	const database = new sqlite.DatabaseSync(resolvedLocation, options ?? {});
	if (database.isOpen) try {
		bindSqliteDatabaseAdmission(database, identity);
	} catch (error) {
		database.close();
		throw error;
	}
	database.open = () => {
		const reopenedIdentity = prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
		sqlite.DatabaseSync.prototype.open.call(database);
		try {
			bindSqliteDatabaseAdmission(database, reopenedIdentity);
		} catch (error) {
			database.close();
			throw error;
		}
	};
	trackSqliteSchema(database, {
		DatabaseSync: sqlite.DatabaseSync,
		StatementSync: sqlite.StatementSync,
		iteratorBehavior: assertSafeSqliteRuntime(sqlite)
	}, options?.readOnly !== true);
	if (!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) registerNodeSqliteDisposeCallback(database, () => {
		bunSqliteNativeCleanupPending = true;
	});
	registerSqliteReaderConnection(database);
	return database;
}
//#endregion
//#region src/state/openclaw-state-maintenance-context.ts
const liveAuthorityReads = resolveGlobalSingleton(Symbol.for("openclaw.maintenanceLiveAuthorityReads"), () => /* @__PURE__ */ new WeakMap());
function allowsMaintenanceLiveAuthorityReads(scope, pathname) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(pathname);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (liveAuthorityReads.get(current)?.has(canonicalPath)) return true;
	return false;
}
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Background work retains command custody without borrowing its native execution path. */
function isOpenClawDatabaseMaintenanceWorkerAccess() {
	return maintenanceResources.current.getStore()?.workerAccess === true;
}
/** Delayed work acquires its own resources instead of inheriting the completed scope. */
function runOutsideOpenClawDatabaseMaintenanceScope(operation) {
	return maintenanceResources.current.exit(operation);
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
function getOpenClawDatabaseMaintenanceResourceScope(resource) {
	return maintenanceResources.claims.get(resource)?.scope;
}
function runMaintenance(scope, operation, workerAccess = isOpenClawDatabaseMaintenanceWorkerAccess()) {
	const accepted = {
		scope,
		active: true,
		workerAccess
	};
	try {
		const result = maintenanceResources.current.run(accepted, operation);
		if (result instanceof Promise) {
			const settled = () => {
				accepted.active = false;
			};
			result.then(settled, settled);
			scope.track(result);
		} else accepted.active = false;
		return result;
	} catch (error) {
		accepted.active = false;
		throw error;
	}
}
/** Retain one exact resource claim for finite commands while its maintenance scope drains. */
function captureOpenClawDatabaseMaintenanceResource(resource, expectedScope) {
	const claim = maintenanceResources.claims.get(resource);
	const assertCurrent = () => {
		expectedScope.assertOwnerCurrent();
		if (claim?.scope !== expectedScope || maintenanceResources.claims.get(resource) !== claim) throw new Error("Database maintenance resource owner changed");
	};
	assertCurrent();
	return {
		assertCurrent,
		async run(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation);
		},
		async runWorker(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation, true);
		}
	};
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.scope.assertAdmission();
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
function isStateDatabaseReadAdmissionInvalidatedError(error) {
	return extractErrorCode(error) === STATE_DATABASE_READ_ADMISSION_INVALIDATED;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const recordsByPath = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const proofFor = () => {
		const proof = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		new BigInt64Array(proof)[0] = -1n;
		return proof;
	};
	const generationFor = (identity) => {
		const revision = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		return { integrity: {
			identity,
			lifetime: {
				revision: new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT),
				epoch: 0n
			},
			revision,
			epoch: 0n,
			proof: proofFor()
		} };
	};
	const publishCreatedIdentity = (record, identity) => {
		Atomics.add(new BigInt64Array(record.generation.integrity.revision), 0, 1n);
		Atomics.add(new BigInt64Array(record.generation.integrity.lifetime.revision), 0, 1n);
		records.delete(record.identity.key);
		record.identity = identity;
		record.generation.integrity.identity = identity;
		records.set(identity.key, record);
	};
	const known = (pathname) => recordsByPath.get(pathname) ?? recordsByPath.get(resolveDatabasePath({ path: pathname }));
	const bindPath = (record, pathname) => {
		record.paths.add(pathname);
		if (!recordsByPath.has(pathname)) recordsByPath.set(pathname, record);
	};
	const overlaps = (left, right) => {
		if (left.identity.key === right.identity.key) return true;
		for (const pathname of left.paths) if (right.paths.has(pathname)) return true;
		return false;
	};
	const isSealed = (record) => {
		if (seals.size === 0) return false;
		for (const held of seals) if (held.record === void 0 || overlaps(held.record, record)) return true;
		return false;
	};
	const hasCloseCustody = (record) => isSealed(record) || attempts.has(record);
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || hasCloseCustody(record)) return record;
		for (const pathname of findChangedDatabasePaths(record.paths, identity)) {
			record.admissions.delete(pathname);
			record.paths.delete(pathname);
			if (recordsByPath.get(pathname) === record) recordsByPath.delete(pathname);
		}
		if (record.paths.size > 0) {
			if (!record.paths.has(record.identity.canonicalPath)) {
				record.identity = identity;
				record.generation.integrity.identity = identity;
			}
			return record;
		}
		invalidate(record);
		forget(record);
	};
	const resolve = (resolvedPath, preparedIdentity) => {
		const cached = recordsByPath.get(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) publishCreatedIdentity(record, identity);
		}
		if (!record) {
			record = {
				coordinationKey: identity.key,
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: generationFor(identity),
				admissions: /* @__PURE__ */ new Map()
			};
			records.set(identity.key, record);
		}
		bindPath(record, resolvedPath);
		bindPath(record, identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const cached = recordsByPath.get(resolvedPath);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(resolvedPath);
		return identity ? resolve(resolvedPath, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) {
			Atomics.store(new BigInt64Array(current.generation.integrity.revision), 0, -1n);
			Atomics.store(new BigInt64Array(current.generation.integrity.lifetime.revision), 0, -1n);
			current.generation = generationFor(current.identity);
			current.admissions.clear();
		}
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const release = (attempt) => {
		if (attempt.seal) {
			seals.delete(attempt.seal);
			attempt.seal = void 0;
		}
	};
	const forget = (record) => {
		if (!hasCloseCustody(record) && records.get(record.identity.key) === record) {
			records.delete(record.identity.key);
			for (const pathname of record.paths) if (recordsByPath.get(pathname) === record) {
				recordsByPath.delete(pathname);
				for (const replacement of records.values()) if (replacement.paths.has(pathname)) {
					recordsByPath.set(pathname, replacement);
					break;
				}
			}
		}
	};
	const captureRecord = (record, databasePath) => {
		const previous = record.admissions.get(databasePath);
		if (previous) return previous;
		const generation = record.generation;
		const admission = Object.freeze({
			databasePath,
			coordinationKey: record.coordinationKey,
			get identity() {
				return record.identity;
			},
			captureIntegrity() {
				admission.assertCurrent();
				const current = generation.integrity;
				const epoch = Atomics.load(new BigInt64Array(current.revision), 0);
				const lifetimeEpoch = Atomics.load(new BigInt64Array(current.lifetime.revision), 0);
				if (epoch !== current.epoch || lifetimeEpoch !== current.lifetime.epoch) generation.integrity = {
					...current,
					identity: record.identity,
					lifetime: {
						revision: current.lifetime.revision,
						epoch: lifetimeEpoch
					},
					epoch,
					proof: proofFor()
				};
				return generation.integrity;
			},
			assertCurrent() {
				assertOpen(record);
				if (records.get(record.identity.key) !== record || record.generation !== generation || record.admissions.get(databasePath) !== admission) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
			}
		});
		record.admissions.set(databasePath, admission);
		return admission;
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		integrity(pathname) {
			const record = resolveForNative(pathname);
			return record && !isSealed(record) ? captureRecord(record, resolveDatabasePath({ path: pathname })).captureIntegrity?.() : void 0;
		},
		publish(pathname) {
			const resolvedPath = resolveDatabasePath({ path: pathname });
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = recordsByPath.get(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					publishCreatedIdentity(previous, identity);
					record = previous;
				} else {
					const failed = attempts.get(previous);
					if (failed) {
						failed.superseded = true;
						failed.seal ??= seal(previous);
					} else invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			bindPath(record, resolvedPath);
			bindPath(record, identity.canonicalPath);
			return {
				identity,
				admission: captureRecord(record, resolvedPath)
			};
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const cached = recordsByPath.get(pathname);
			const retained = cached?.admissions.get(pathname);
			if (cached && retained && cached.identity.key.startsWith("file:")) {
				retained.assertCurrent();
				return retained;
			}
			const databasePath = resolveDatabasePath({ path: pathname });
			const record = resolve(databasePath);
			assertOpen(record);
			return captureRecord(record, databasePath);
		},
		holdExclusion(pathname) {
			const record = resolve(resolveDatabasePath({ path: pathname }));
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = { retained: /* @__PURE__ */ new Set() };
				attempts.set(record, attempt);
			}
			attempt.seal ??= seal(record);
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				if (errors.length && !current.superseded) release(current);
				throwSqliteLifecycleErrors(errors, "OpenClaw state resource drainage failed");
				const retired = await retireNative(record?.identity);
				attempts.delete(record);
				release(current);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						release(entry);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-contract.ts
const DOCTOR_OWNED_STATE_TABLES = ["agent_deletion_journal"];
const FIRST_USE_STATE_TABLES = [
	"user_profile_identities",
	"user_background_images",
	"local_workspace_projections",
	"update_runs",
	"session_repository_workspaces",
	"github_repository_publication_requests",
	"github_publication_session_lifecycles",
	"skill_library_entries",
	"skill_library_revisions",
	"skill_library_events",
	"skill_library_uploads",
	"github_personal_publication_requests",
	"cron_job_runtime_authorities",
	"cron_run_trigger_state_retirements",
	"execution_identity_contexts",
	"mcp_oauth_pending_authorizations",
	"node_worker_launch_containers",
	"node_worker_launch_boots",
	"node_worker_launch_cleanup",
	"node_worker_launch_process_scopes",
	"node_worker_launches",
	"node_worker_prepared_workspaces",
	"node_worker_turns",
	"operator_approval_execution_identities",
	"operator_approval_standing_grants",
	"operator_approval_standing_grant_generations",
	"web_push_approval_deliveries",
	"execution_decision_facts",
	"execution_owner_lifecycle_bindings",
	"outbound_message_execution_bindings",
	"outbound_message_progress"
];
const FIRST_USE_STATE_INDEXES = [
	"idx_user_profile_identities_profile_id",
	"idx_user_profile_identities_authorization",
	"idx_update_runs_created",
	"idx_update_runs_active",
	"idx_github_repository_publication_shared_request",
	"idx_github_repository_publication_personal_request",
	"idx_github_personal_publication_owner_session",
	"idx_github_personal_publication_pending",
	"idx_node_worker_launches_terminal_completed",
	"idx_node_worker_turns_terminal_completed",
	"idx_node_worker_turns_active_owner",
	"idx_operator_approval_standing_grants_binding",
	"idx_web_push_approval_deliveries_subscription",
	"execution_identity_contexts_run_created_idx",
	"execution_decision_facts_cursor_id_idx",
	"execution_decision_facts_context_occurred_idx",
	"execution_decision_facts_run_occurred_idx",
	"outbound_message_execution_bindings_execution_event_idx",
	"outbound_message_progress_occurred_idx",
	"outbound_message_progress_run_occurred_idx"
];
const LAZY_ADDITIVE_STATE_TABLES = [
	...FIRST_USE_STATE_TABLES,
	"agent_provenance",
	"cron_run_receipts",
	"config_revision_keys",
	"secret_store_entries",
	"projects",
	"worktree_templates",
	"user_preferences",
	"device_pair_setup_completions",
	"github_publication_requests",
	"device_pairing_join_codes",
	"skill_workshop_changes",
	"worker_environment_ssh_fallback_ports",
	"worker_session_placement_moves"
];
const LAZY_ADDITIVE_STATE_INDEXES = [
	...FIRST_USE_STATE_INDEXES,
	"cron_run_receipts_cursor_id_idx",
	"idx_cron_run_receipts_active_job",
	"idx_cron_run_receipts_job_history",
	"idx_github_publication_requests_pending",
	"secret_store_entries_live_idx",
	"skill_workshop_changes_cursor_id_idx",
	"idx_skill_workshop_changes_agent_time"
];
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
/** User-facing guide for schema refusals; lives here so error sites avoid import cycles. */
const OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-options.js
function captureRootSyncAcquireOptions(options) {
	const lockPath = options.lockPath;
	const staleMsInput = options.staleMs;
	const timeoutMsInput = options.timeoutMs;
	const retryInput = options.retry;
	const staleRecoveryInput = options.staleRecovery;
	const reentrantOwner = options.reentrantOwner;
	const payload = options.payload;
	const shouldReclaim = options.shouldReclaim;
	const shouldRemoveStaleLock = options.shouldRemoveStaleLock;
	const parsePayload = options.parsePayload;
	const onCompromised = options.onCompromised;
	const compromiseCheckIntervalMs = options.compromiseCheckIntervalMs;
	const retrySnapshot = retryInput === void 0 ? void 0 : Object.freeze({
		retries: retryInput.retries,
		factor: retryInput.factor,
		minTimeout: retryInput.minTimeout,
		maxTimeout: retryInput.maxTimeout,
		randomize: retryInput.randomize
	});
	const defaults = getFsSafeLockConfig();
	const defaultRetry = defaults.retry;
	const retry = retrySnapshot ?? Object.freeze({
		retries: defaultRetry?.retries,
		factor: defaultRetry?.factor,
		minTimeout: defaultRetry?.minTimeout,
		maxTimeout: defaultRetry?.maxTimeout,
		randomize: defaultRetry?.randomize
	});
	const timeoutMs = timeoutMsInput ?? defaults.timeoutMs;
	const staleMs = staleMsInput ?? defaults.staleMs ?? 3e4;
	const staleRecovery = staleRecoveryInput ?? defaults.staleRecovery;
	validateSidecarLockRetryOptions(retry);
	validateSidecarLockTimeoutMs(timeoutMs);
	validateSidecarLockStaleMs(staleMs);
	validateSidecarLockCompromiseCheckIntervalMs(compromiseCheckIntervalMs);
	return Object.freeze({
		compromiseCheckIntervalMs,
		lockPath,
		onCompromised,
		optionsReceiver: options,
		parsePayload,
		payload,
		reentrantOwner,
		retry,
		shouldReclaim,
		shouldRemoveStaleLock,
		staleMs,
		staleRecovery,
		timeoutMs
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-admission.js
const SYNC_HELD_LOCKS_KEY = Symbol.for("fsSafe.syncSidecarLocks");
const SYNC_ADMISSIONS_KEY = Symbol.for("fsSafe.syncSidecarLockAdmissions");
const SYNC_CLEANUP_REGISTERED_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupRegistered");
const SYNC_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupHandler");
const SYNC_CLEANUP_REGISTRATION_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupRegistration");
const ROOT_SYNC_HELD_LOCKS_KEY$1 = Symbol.for("fsSafe.syncRootSidecarLocks.v1");
function foreignSyncHeldLock(route, target) {
	return globalThis[route === "raw" ? ROOT_SYNC_HELD_LOCKS_KEY$1 : SYNC_HELD_LOCKS_KEY]?.get(target);
}
function getSyncHeldLocks() {
	const globalWithState = globalThis;
	if (!globalWithState[SYNC_HELD_LOCKS_KEY]) globalWithState[SYNC_HELD_LOCKS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[SYNC_HELD_LOCKS_KEY];
}
function getSyncLockAdmissions() {
	const globalWithState = globalThis;
	if (!globalWithState[SYNC_ADMISSIONS_KEY]) globalWithState[SYNC_ADMISSIONS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[SYNC_ADMISSIONS_KEY];
}
function defaultSyncShouldReclaim(snapshot, staleMs, nowMs) {
	const createdAtMs = sidecarLockPayloadCreatedAtMs(snapshot.payload);
	if (createdAtMs !== null) return nowMs - createdAtMs > staleMs;
	if (!snapshot.stat) return true;
	return nowMs - ("mtimeNs" in snapshot.stat ? Number(snapshot.stat.mtimeNs) / 1e6 : snapshot.stat.mtimeMs) > staleMs;
}
function syncReclaimGuardExists(reclaimGuardPath) {
	try {
		return fs.lstatSync(reclaimGuardPath, { throwIfNoEntry: false }) !== void 0;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function ensureSyncLockExitCleanupRegistered(cleanup, lockPath, normalizedTargetPath) {
	ensureSidecarLockCleanupRegistered({
		event: "exit",
		registered: SYNC_CLEANUP_REGISTERED_KEY,
		registering: SYNC_CLEANUP_REGISTRATION_KEY,
		handler: SYNC_CLEANUP_HANDLER_KEY,
		reentryError: () => sidecarLockTimeout(lockPath, normalizedTargetPath)
	}, cleanup, true);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-acquisition.js
/** Owns local arbitration and retry state, independently of filesystem authority. */
var SyncLockAcquisition = class {
	lockPath;
	normalizedTargetPath;
	retry;
	timeoutMs;
	#admissions = getSyncLockAdmissions();
	#token = {};
	#owns = false;
	#startedAt = performance.now();
	#attempt = 0;
	#transientDenials = 0;
	constructor(lockPath, normalizedTargetPath, retry, timeoutMs) {
		this.lockPath = lockPath;
		this.normalizedTargetPath = normalizedTargetPath;
		this.retry = retry;
		this.timeoutMs = timeoutMs;
	}
	get owns() {
		return this.#owns;
	}
	hasToken() {
		return this.#admissions.get(this.normalizedTargetPath) === this.#token;
	}
	assert() {
		if (!this.hasToken()) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
	}
	reserve() {
		if (this.#owns) return;
		if (this.#admissions.has(this.normalizedTargetPath)) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
		this.#admissions.set(this.normalizedTargetPath, this.#token);
		this.#owns = true;
	}
	release() {
		if (this.#owns && this.hasToken()) this.#admissions.delete(this.normalizedTargetPath);
		this.#owns = false;
	}
	run(callback) {
		this.assert();
		try {
			return callback();
		} finally {
			this.assert();
		}
	}
	waitForRetry() {
		this.release();
		const delay = sidecarLockRetryDelay(this.retry, this.timeoutMs, performance.now() - this.#startedAt, this.#attempt);
		if (delay === void 0) throw sidecarLockTimeout(this.lockPath, this.normalizedTargetPath);
		sleepSync(delay);
		this.#attempt += 1;
	}
	retryDenial(error) {
		if (!isTransientLockFileDenial(error, this.lockPath) || ++this.#transientDenials > 8) return false;
		try {
			this.waitForRetry();
		} catch (waitError) {
			if (waitError?.code === "file_lock_timeout") throw error;
			throw waitError;
		}
		return true;
	}
	monitor(held, handle, callback, interval, receiver, recordTimer) {
		if (!callback || (interval ?? 0) <= 0) return;
		const { lockPath, normalizedTargetPath } = this;
		const timer = setInterval(() => {
			let stillHeld;
			try {
				stillHeld = handle.verifyStillHeld();
			} catch {
				stillHeld = false;
			}
			if (!stillHeld && held.timer) {
				clearInterval(held.timer);
				held.timer = void 0;
				Reflect.apply(callback, receiver, [{
					lockPath,
					normalizedTargetPath
				}]);
			}
		}, interval);
		recordTimer?.(timer);
		held.timer = timer;
		timer.unref();
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-io.js
const MAX_SIDECAR_LOCK_PAYLOAD_BYTES = 1048576;
function observeDirectory(pathname, initial) {
	const stat = inspectDirectoryIdentitySync(pathname, void 0, initial);
	const realPath = realpathSync$1.native(pathForWindowsFilesystem(pathname));
	assertNoWindowsPathAlias(realPath, "filesystem", "sidecar lock parent uses a Windows filesystem namespace alias");
	if (!sameAbsolutePath(realPath, pathname)) throw new FsSafeError("path-mismatch", "sidecar lock parent changed during operation");
	return Object.freeze({
		identity: Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		}),
		path: pathname,
		realPath
	});
}
function assertDirectoryCurrent(receipt, initial) {
	inspectDirectoryIdentitySync(receipt.path, receipt.identity, initial);
	const currentReal = realpathSync$1.native(pathForWindowsFilesystem(receipt.path));
	assertNoWindowsPathAlias(currentReal, "filesystem", "sidecar lock parent uses a Windows filesystem namespace alias");
	if (currentReal !== receipt.realPath) throw new FsSafeError("path-mismatch", "sidecar lock parent changed during operation");
}
function assertRetainedParentCurrent(pathAuthority, parent) {
	const context = pathAuthority.authority.context;
	const sharedIdentity = parent.path === context.rootReal && parent.identity.dev === context.rootIdentity.dev && parent.identity.ino === context.rootIdentity.ino;
	let rootStat;
	assertRootIdentityCurrentSync(context, sharedIdentity ? (stat) => {
		rootStat = stat;
	} : void 0);
	assertDirectoryCurrent(parent, rootStat);
	assertRootIdentityCurrentSync(context);
}
function exactFileIdentity(stat) {
	return Object.freeze({
		dev: stat.dev,
		ino: stat.ino
	});
}
function assertRegularFile(stat, hardlinks) {
	if (stat.isSymbolicLink() || !stat.isFile()) throw new FsSafeError("not-file", "sidecar lock is not a regular file");
	if (hardlinks !== "allow" && stat.nlink > 1n) throw hardlinkedPathNotAllowedError();
}
function sameExactIdentity(left, right) {
	return left.dev === right.dev && left.ino === right.ino;
}
function assertFreshPathCurrent(pathAuthority) {
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
}
function missingAfterCurrentRead(pathAuthority, expectedReceipt) {
	if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, expectedReceipt.parent);
	else assertFreshPathCurrent(pathAuthority);
	return null;
}
function readFileLockSyncRootSnapshot(pathAuthority, options = {}) {
	const expectedReceipt = options.expectedReceipt;
	if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, expectedReceipt.parent);
	else assertFreshPathCurrent(pathAuthority);
	let before;
	try {
		before = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), expectedReceipt?.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || expectedReceipt && error instanceof FsSafeError && error.code === "path-mismatch") return missingAfterCurrentRead(pathAuthority, expectedReceipt);
		throw error;
	}
	assertRegularFile(before, pathAuthority.authority.hardlinks);
	const parent = expectedReceipt?.parent ?? observeDirectory(path.dirname(pathAuthority.path));
	let fd;
	let operationError;
	let operationFailed = false;
	try {
		try {
			fd = fs.openSync(pathForWindowsFilesystem(pathAuthority.path), resolveReadOpenFlags());
		} catch (error) {
			if (isNotFoundPathError(error)) return missingAfterCurrentRead(pathAuthority, expectedReceipt);
			options.onOpenFailure?.(error);
			throw error;
		}
		let opened;
		try {
			opened = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }), exactFileIdentity(before));
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "path-mismatch") {
				if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
				else {
					assertDirectoryCurrent(parent);
					assertFreshPathCurrent(pathAuthority);
				}
				return null;
			}
			throw error;
		}
		assertRegularFile(opened, pathAuthority.authority.hardlinks);
		const raw = readFileDescriptorBoundedSync(fd, MAX_SIDECAR_LOCK_PAYLOAD_BYTES).toString("utf8");
		let after;
		try {
			after = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), exactFileIdentity(opened));
		} catch (error) {
			if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") {
				if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
				else {
					assertDirectoryCurrent(parent);
					assertFreshPathCurrent(pathAuthority);
				}
				return null;
			}
			throw error;
		}
		assertRegularFile(after, pathAuthority.authority.hardlinks);
		const stat = fs.fstatSync(fd, { bigint: true });
		if (expectedReceipt) assertRetainedParentCurrent(pathAuthority, parent);
		else {
			assertDirectoryCurrent(parent);
			assertFreshPathCurrent(pathAuthority);
		}
		const snapshot = {
			raw,
			payload: null,
			stat
		};
		return Object.freeze({
			receipt: Object.freeze({
				identity: exactFileIdentity(opened),
				parent
			}),
			snapshot
		});
	} catch (error) {
		operationFailed = true;
		operationError = error;
		throw error;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch (closeError) {
			if (operationFailed) throw createSuppressedError(closeError, operationError, "sidecar snapshot admission and descriptor close both failed");
			throw closeError;
		}
	}
}
function fileLockSyncRootSnapshotStillCurrent(pathAuthority, observed) {
	const current = readFileLockSyncRootSnapshot(pathAuthority, { expectedReceipt: observed.receipt });
	return !!current && sameExactIdentity(current.receipt.identity, observed.receipt.identity) && sidecarLockSnapshotMatches(current.snapshot, observed.snapshot);
}
function fileReceiptCurrentAfterParentCheck(pathAuthority, receipt) {
	let current;
	try {
		current = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), receipt.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") return false;
		throw error;
	}
	assertRegularFile(current, pathAuthority.authority.hardlinks);
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
function fileLockSyncRootReceiptStillCurrent(pathAuthority, receipt) {
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return fileReceiptCurrentAfterParentCheck(pathAuthority, receipt);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-mutation.js
function ensureParent(pathAuthority) {
	const authority = pathAuthority.authority;
	const context = authority.context;
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	const targetParent = path.dirname(pathAuthority.path);
	const admitted = admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: targetParent,
		rootIdentity: context.rootIdentity
	});
	if (!admitted) throw outsideWorkspaceError();
	const relative = admitted.relativePath;
	let current = context.rootReal;
	let currentReceipt = observeDirectory(current);
	for (const segment of relative.split(path.sep).filter(Boolean)) {
		const next = path.join(current, segment);
		assertRootIdentityCurrentSync(context);
		assertDirectoryCurrent(currentReceipt);
		let missing = false;
		let existing;
		try {
			existing = fs.lstatSync(pathForWindowsFilesystem(next), { bigint: true });
			if (existing.isSymbolicLink() || !existing.isDirectory()) throw directoryComponentNotDirectoryError();
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			missing = true;
		}
		if (missing) {
			assertFileLockSyncRootMutationAllowed(next, authority.denyMutations);
			const mutationAuthorityInvoked = invokeFileLockSyncRootMutationAuthority(authority);
			if (mutationAuthorityInvoked) assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertDirectoryCurrent(currentReceipt);
			assertRootIdentityCurrentSync(context);
			if (mutationAuthorityInvoked) assertFileLockSyncRootMutationAllowed(next, authority.denyMutations);
			try {
				fs.mkdirSync(pathForWindowsFilesystem(next));
			} catch (error) {
				if (error.code !== "EEXIST") throw error;
			}
		}
		const nextReceipt = observeDirectory(next, existing);
		assertDirectoryCurrent(currentReceipt);
		current = nextReceipt.realPath;
		currentReceipt = nextReceipt;
	}
	assertRootIdentityCurrentSync(context);
	assertDirectoryCurrent(currentReceipt);
	return currentReceipt;
}
function createFileLockSyncRootFile(pathAuthority, options) {
	const parent = ensureParent(pathAuthority);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority)) {
		assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, parent);
	}
	const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
	let fd;
	let receipt;
	try {
		options.assertBeforeOpen();
		try {
			assertExclusiveCreateLeaf(pathForWindowsFilesystem(pathAuthority.path));
		} catch (error) {
			if (error.code === "EEXIST") options.onOpenFailure(error);
			throw error;
		}
		try {
			fd = fs.openSync(pathForWindowsFilesystem(pathAuthority.path), fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 384);
		} catch (error) {
			options.onOpenFailure(error);
			throw error;
		}
		const opened = inspectFileIdentitySync(() => fs.fstatSync(fd, { bigint: true }));
		assertRegularFile(opened, pathAuthority.authority.hardlinks);
		receipt = Object.freeze({
			identity: exactFileIdentity(opened),
			parent
		});
		if (!fileReceiptCurrentAfterParentCheck(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before admission");
		return {
			fd,
			receipt
		};
	} catch (error) {
		if (fd === void 0) throw error;
		const failedFd = fd;
		fd = void 0;
		try {
			fs.closeSync(failedFd);
			if (receipt && !removeFileLockSyncRootFile(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before cleanup");
		} catch (cleanupError) {
			throw createSuppressedError(error, cleanupError, "file lock create admission and cleanup both failed");
		}
		throw error;
	}
}
function refreshFileLockSyncRootFileReceipt(pathAuthority, receipt) {
	if (!fileReceiptCurrentAfterParentCheck(pathAuthority, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before admission");
	return receipt;
}
function removeFileLockSyncRootFile(pathAuthority, receipt, expected, assertBeforeRemove) {
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations);
	const matches = () => {
		if (!expected) return fileLockSyncRootReceiptStillCurrent(pathAuthority, receipt);
		const current = readFileLockSyncRootSnapshot(pathAuthority, { expectedReceipt: receipt });
		return !!current && sameExactIdentity(current.receipt.identity, receipt.identity) && sidecarLockSnapshotMatches(current.snapshot, expected);
	};
	if (!matches()) return false;
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority) && !matches()) return false;
	if (assertBeforeRemove?.() === false) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations);
	fs.unlinkSync(pathForWindowsFilesystem(pathAuthority.path));
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	let successorStat;
	try {
		successorStat = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }));
	} catch (error) {
		if (isNotFoundPathError(error)) return true;
		throw error;
	}
	assertRegularFile(successorStat, pathAuthority.authority.hardlinks);
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	if (!sameExactIdentity(exactFileIdentity(successorStat), receipt.identity)) return true;
	if (expected) {
		const successor = readFileLockSyncRootSnapshot(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, receipt.parent);
		if (successor) {
			if (!sameExactIdentity(successor.receipt.identity, receipt.identity) || !sidecarLockSnapshotMatches(successor.snapshot, expected)) return true;
		} else {
			let current;
			try {
				current = inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }));
			} catch (error) {
				if (isNotFoundPathError(error)) {
					assertRetainedParentCurrent(pathAuthority, receipt.parent);
					return true;
				}
				throw error;
			}
			assertRegularFile(current, pathAuthority.authority.hardlinks);
			assertRetainedParentCurrent(pathAuthority, receipt.parent);
			if (!sameExactIdentity(exactFileIdentity(current), receipt.identity)) return true;
		}
	}
	throw new FsSafeError("path-mismatch", "sidecar lock was replaced during removal");
}
function fileLockSyncRootGuardExists(pathAuthority) {
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
	let stat;
	try {
		stat = fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true });
	} catch (error) {
		if (isNotFoundPathError(error)) {
			assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertRootIdentityCurrentSync(pathAuthority.authority.context);
			return false;
		}
		throw error;
	}
	if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw directoryComponentNotDirectoryError();
	if (stat.isFile()) assertRegularFile(stat, pathAuthority.authority.hardlinks);
	const parent = observeDirectory(path.dirname(pathAuthority.path));
	if (stat.isFile()) assertRegularFile(inspectFileIdentitySync(() => fs.lstatSync(pathForWindowsFilesystem(pathAuthority.path), { bigint: true }), exactFileIdentity(stat)), pathAuthority.authority.hardlinks);
	else inspectDirectoryIdentitySync(pathAuthority.path, exactFileIdentity(stat));
	assertDirectoryCurrent(parent);
	assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
	assertRootIdentityCurrentSync(pathAuthority.authority.context);
	return true;
}
function createFileLockSyncRootDirectory(pathAuthority) {
	const parent = ensureParent(pathAuthority);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority)) {
		assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
		assertRetainedParentCurrent(pathAuthority, parent);
	}
	try {
		fs.mkdirSync(pathForWindowsFilesystem(pathAuthority.path));
	} catch (error) {
		if (error.code === "EEXIST") return null;
		throw error;
	}
	const stat = inspectDirectoryIdentitySync(pathAuthority.path);
	const receipt = Object.freeze({
		identity: exactFileIdentity(stat),
		parent
	});
	assertRetainedParentCurrent(pathAuthority, parent);
	inspectDirectoryIdentitySync(pathAuthority.path, receipt.identity);
	return receipt;
}
function removeFileLockSyncRootDirectory(pathAuthority, receipt) {
	if (!fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt)) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations, true);
	if (invokeFileLockSyncRootMutationAuthority(pathAuthority.authority) && !fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt)) return false;
	assertFileLockSyncRootMutationAllowed(pathAuthority.path, pathAuthority.authority.denyMutations, true);
	fs.rmdirSync(pathForWindowsFilesystem(pathAuthority.path));
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
function fileLockSyncRootDirectoryReceiptStillCurrent(pathAuthority, receipt) {
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	try {
		inspectDirectoryIdentitySync(pathAuthority.path, receipt.identity);
	} catch (error) {
		if (isNotFoundPathError(error) || error instanceof FsSafeError && error.code === "path-mismatch") return false;
		throw error;
	}
	assertRetainedParentCurrent(pathAuthority, receipt.parent);
	return true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-registration.js
const ROOT_SYNC_CLEANUP_REGISTERING_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistering.v1");
const ROOT_SYNC_CLEANUP_REGISTERED_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistered.v1");
const ROOT_SYNC_CLEANUP_FAILED_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupRegistrationFailed.v1");
const ROOT_SYNC_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupHandler.v1");
function unavailable(message) {
	return new FsSafeError("helper-unavailable", message);
}
function exactListenerCount(listener) {
	return process.listeners("exit").filter((candidate) => candidate === listener).length;
}
function ensureFileLockSyncRootExitCleanupRegistered(cleanupHandler) {
	const state = globalThis;
	if (state[ROOT_SYNC_CLEANUP_REGISTERED_KEY]) {
		if (typeof state[ROOT_SYNC_CLEANUP_HANDLER_KEY] === "function") return;
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
		throw unavailable("Root sidecar exit cleanup registration state is inconsistent");
	}
	if (state[ROOT_SYNC_CLEANUP_FAILED_KEY]) throw unavailable("Root sidecar exit cleanup registration previously failed");
	if (state[ROOT_SYNC_CLEANUP_REGISTERING_KEY]) throw unavailable("Root sidecar exit cleanup registration is already in progress");
	if (state[ROOT_SYNC_CLEANUP_HANDLER_KEY] !== void 0) {
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
		throw unavailable("Root sidecar exit cleanup handler exists without registration");
	}
	state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = true;
	let baselineCount;
	let registrationAttempted = false;
	let registrationStateAmbiguous = false;
	try {
		baselineCount = exactListenerCount(cleanupHandler);
		if (baselineCount !== 0) {
			registrationStateAmbiguous = true;
			throw unavailable("Root sidecar exit cleanup listener exists without registration");
		}
		registrationAttempted = true;
		process.on("exit", cleanupHandler);
		if (exactListenerCount(cleanupHandler) !== baselineCount + 1) throw unavailable("Root sidecar exit cleanup listener was not registered exactly once");
		state[ROOT_SYNC_CLEANUP_HANDLER_KEY] = cleanupHandler;
		state[ROOT_SYNC_CLEANUP_REGISTERED_KEY] = true;
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = false;
		state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = false;
	} catch (registrationError) {
		let rollbackFailed = false;
		let rollbackError;
		if (registrationAttempted && baselineCount !== void 0) try {
			let currentCount = exactListenerCount(cleanupHandler);
			while (currentCount > baselineCount) {
				process.removeListener("exit", cleanupHandler);
				const nextCount = exactListenerCount(cleanupHandler);
				if (nextCount >= currentCount) throw unavailable("Root sidecar exit cleanup listener rollback made no progress");
				currentCount = nextCount;
			}
			if (currentCount !== baselineCount) throw unavailable("Root sidecar exit cleanup listener rollback was ambiguous");
		} catch (error) {
			rollbackFailed = true;
			rollbackError = error;
		}
		state[ROOT_SYNC_CLEANUP_HANDLER_KEY] = void 0;
		state[ROOT_SYNC_CLEANUP_REGISTERED_KEY] = false;
		state[ROOT_SYNC_CLEANUP_REGISTERING_KEY] = false;
		if (registrationStateAmbiguous) {
			state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
			throw registrationError;
		}
		if (rollbackFailed) {
			state[ROOT_SYNC_CLEANUP_FAILED_KEY] = true;
			throw createSuppressedError(registrationError, rollbackError, "Root sidecar exit cleanup registration and rollback both failed");
		}
		state[ROOT_SYNC_CLEANUP_FAILED_KEY] = false;
		throw registrationError;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-held.js
const ROOT_SYNC_HELD_LOCKS_KEY = Symbol.for("fsSafe.syncRootSidecarLocks.v1");
const ROOT_SYNC_CLEANUP_ACTIVE_KEY = Symbol.for("fsSafe.syncRootSidecarLockCleanupActive.v1");
const MAX_CONTINUITY_CLEANUP_ATTEMPTS = 2;
const rootSyncHandleDispositions = /* @__PURE__ */ new WeakMap();
function readRootSyncHeldReleaseState(held) {
	return held.releaseState;
}
function readRootSidecarSnapshotSync(rootPath, parsePayload, onOpenFailure, expectedReceipt) {
	const rawSnapshot = readFileLockSyncRootSnapshot(rootPath, {
		expectedReceipt,
		onOpenFailure
	});
	if (!rawSnapshot) return null;
	let parsedPayload;
	try {
		parsedPayload = parseSidecarLockPayload(rawSnapshot.snapshot.raw, parsePayload);
	} catch (parseError) {
		if (parsePayload) try {
			if (!fileLockSyncRootSnapshotStillCurrent(rootPath, rawSnapshot)) throw new FsSafeError("path-mismatch", "sidecar changed during payload parsing");
		} catch (admissionError) {
			throw createSuppressedError(parseError, admissionError, "sidecar parser and post-callback admission both failed");
		}
		throw parseError;
	}
	if (parsePayload && !fileLockSyncRootSnapshotStillCurrent(rootPath, rawSnapshot)) return null;
	return {
		receipt: rawSnapshot.receipt,
		snapshot: {
			...rawSnapshot.snapshot,
			payload: parsedPayload
		}
	};
}
function getRootSyncHeldLocks() {
	const globalWithState = globalThis;
	if (!globalWithState[ROOT_SYNC_HELD_LOCKS_KEY]) globalWithState[ROOT_SYNC_HELD_LOCKS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[ROOT_SYNC_HELD_LOCKS_KEY];
}
function reactivateExactHeldLock(heldLocks, held, restoreConsumedReference) {
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return false;
	if (restoreConsumedReference) held.refCount += 1;
	held.releaseState = "active";
	held.revision += 1;
	return true;
}
function finishDeferredExitReleases(held) {
	const deferred = held.deferredExitReleases;
	if (!deferred) return;
	for (const disposition of deferred) disposition.released = true;
	deferred.clear();
	held.deferredExitReleases = void 0;
}
function restoreDeferredExitReleases(held) {
	const deferred = held.deferredExitReleases;
	if (!deferred) return 0;
	const restored = deferred.size;
	deferred.clear();
	held.deferredExitReleases = void 0;
	return restored;
}
function restoreExactHeldLockAfterExitCleanup(heldLocks, held) {
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return;
	held.refCount += restoreDeferredExitReleases(held);
	if (held.refCount <= 0) {
		held.releaseState = "released";
		held.revision += 1;
		heldLocks.delete(held.normalizedTargetPath);
		return;
	}
	held.releaseState = "active";
	held.revision += 1;
}
function releaseAllRootSyncHeldLocks() {
	const globalWithCleanup = globalThis;
	if (globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY]) return;
	globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY] = true;
	try {
		const heldLocks = globalThis[ROOT_SYNC_HELD_LOCKS_KEY];
		if (!heldLocks) return;
		getSyncLockAdmissions().clear();
		for (const [normalizedTargetPath, held] of heldLocks) {
			if (heldLocks.get(normalizedTargetPath) !== held || held.releaseState !== "active") continue;
			held.releaseState = "exit-cleaning";
			held.revision += 1;
			let cleanupRevision = held.revision;
			const timer = held.timer;
			const fd = held.fd;
			held.timer = void 0;
			held.fd = void 0;
			if (timer) clearInterval(timer);
			try {
				if (fd !== void 0) fs.closeSync(fd);
			} catch {}
			const entryIsContinuous = () => heldLocks.get(normalizedTargetPath) === held && held.releaseState === "exit-cleaning" && held.revision === cleanupRevision;
			const beginFreshCleanupAttempt = () => {
				held.releaseState = "exit-cleaning";
				held.revision += 1;
				cleanupRevision = held.revision;
			};
			if (!entryIsContinuous()) {
				if (heldLocks.get(normalizedTargetPath) === held && readRootSyncHeldReleaseState(held) !== "released" && held.refCount === 0) beginFreshCleanupAttempt();
				else {
					restoreExactHeldLockAfterExitCleanup(heldLocks, held);
					continue;
				}
			}
			let cleaned = false;
			for (let cleanupAttempt = 0; cleanupAttempt < MAX_CONTINUITY_CLEANUP_ATTEMPTS; cleanupAttempt += 1) {
				let continuityInterrupted = false;
				let removalFailed = false;
				let removed = false;
				try {
					removed = removeFileLockSyncRootFile(held.rootPath, held.rootReceipt, held.snapshot, () => {
						const current = entryIsContinuous();
						if (!current) continuityInterrupted = true;
						return current;
					});
				} catch {
					removalFailed = true;
				}
				if (!removalFailed && removed && !continuityInterrupted && entryIsContinuous()) {
					cleaned = true;
					break;
				}
				const continuousEntry = entryIsContinuous();
				if (heldLocks.get(normalizedTargetPath) === held && readRootSyncHeldReleaseState(held) !== "released" && (continuityInterrupted || !continuousEntry) && held.refCount === 0 && cleanupAttempt + 1 < MAX_CONTINUITY_CLEANUP_ATTEMPTS) {
					beginFreshCleanupAttempt();
					continue;
				}
				if (continuousEntry && held.refCount > 0) {
					cleaned = true;
					break;
				}
				restoreExactHeldLockAfterExitCleanup(heldLocks, held);
				break;
			}
			if (!cleaned) continue;
			finishDeferredExitReleases(held);
			held.releaseState = "released";
			held.revision += 1;
			if (heldLocks.get(normalizedTargetPath) === held) heldLocks.delete(normalizedTargetPath);
		}
	} finally {
		globalWithCleanup[ROOT_SYNC_CLEANUP_ACTIVE_KEY] = false;
	}
}
function ensureRootSyncExitCleanupRegistered() {
	ensureFileLockSyncRootExitCleanupRegistered(releaseAllRootSyncHeldLocks);
}
function verifyRootSyncHeldLock(held) {
	const rootPath = held.rootPath;
	const parsePayload = held.parsePayload;
	const rootReceipt = held.rootReceipt;
	const current = parsePayload ? readRootSidecarSnapshotSync(rootPath, parsePayload, void 0, rootReceipt) : readFileLockSyncRootSnapshot(rootPath, { expectedReceipt: rootReceipt });
	if (!current) return false;
	return current.receipt.identity.dev === held.rootReceipt.identity.dev && current.receipt.identity.ino === held.rootReceipt.identity.ino && sidecarLockSnapshotMatches(current.snapshot, held.snapshot);
}
function releaseRootSyncHeldLock(held, disposition) {
	const heldLocks = getRootSyncHeldLocks();
	if (heldLocks.get(held.normalizedTargetPath) !== held || held.releaseState === "released") return true;
	if (held.releaseState !== "active") {
		if (held.deferredExitReleases?.has(disposition)) return false;
		if (held.refCount <= 0) return false;
		if (!fileLockSyncRootReceiptStillCurrent(held.rootPath, held.rootReceipt)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before release");
		held.refCount -= 1;
		held.revision += 1;
		if (held.releaseState !== "exit-cleaning" || held.refCount > 0) return true;
		(held.deferredExitReleases ??= /* @__PURE__ */ new Set()).add(disposition);
		return false;
	}
	if (held.refCount > 1) {
		if (!fileLockSyncRootReceiptStillCurrent(held.rootPath, held.rootReceipt)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before release");
		held.refCount -= 1;
		held.revision += 1;
		return true;
	}
	if (held.refCount !== 1) return false;
	held.refCount = 0;
	held.releaseState = "releasing";
	held.revision += 1;
	let releaseRevision = held.revision;
	const entryIsContinuous = () => heldLocks.get(held.normalizedTargetPath) === held && held.releaseState === "releasing" && held.revision === releaseRevision && held.refCount === 0;
	const beginFreshReleaseAttempt = () => {
		held.releaseState = "releasing";
		held.revision += 1;
		releaseRevision = held.revision;
	};
	const fd = held.fd;
	held.fd = void 0;
	try {
		if (fd !== void 0) fs.closeSync(fd);
	} catch (error) {
		reactivateExactHeldLock(heldLocks, held, true);
		throw error;
	}
	if (!entryIsContinuous()) {
		if (heldLocks.get(held.normalizedTargetPath) !== held || readRootSyncHeldReleaseState(held) === "released") return true;
		if (held.refCount > 0) {
			reactivateExactHeldLock(heldLocks, held, false);
			return true;
		}
		beginFreshReleaseAttempt();
	}
	for (let releaseAttempt = 0; releaseAttempt < MAX_CONTINUITY_CLEANUP_ATTEMPTS; releaseAttempt += 1) {
		let continuityInterrupted = false;
		let removed;
		try {
			removed = removeFileLockSyncRootFile(held.rootPath, held.rootReceipt, held.snapshot, () => {
				const current = entryIsContinuous();
				if (!current) continuityInterrupted = true;
				return current;
			});
		} catch (error) {
			reactivateExactHeldLock(heldLocks, held, true);
			throw error;
		}
		if (!continuityInterrupted && entryIsContinuous()) {
			if (!removed) {
				reactivateExactHeldLock(heldLocks, held, true);
				throw new FsSafeError("path-mismatch", "owned sidecar lock changed before release");
			}
			const timer = held.timer;
			held.timer = void 0;
			held.releaseState = "released";
			held.revision += 1;
			if (heldLocks.get(held.normalizedTargetPath) === held) heldLocks.delete(held.normalizedTargetPath);
			if (timer) clearInterval(timer);
			return true;
		}
		if (heldLocks.get(held.normalizedTargetPath) !== held || readRootSyncHeldReleaseState(held) === "released") return true;
		if (held.refCount > 0) {
			reactivateExactHeldLock(heldLocks, held, false);
			return true;
		}
		if (held.refCount === 0 && releaseAttempt + 1 < MAX_CONTINUITY_CLEANUP_ATTEMPTS) {
			beginFreshReleaseAttempt();
			continue;
		}
		reactivateExactHeldLock(heldLocks, held, true);
		throw new FsSafeError("path-mismatch", "held sidecar release continuity changed repeatedly");
	}
	throw new FsSafeError("path-mismatch", "held sidecar release could not complete");
}
function createRootSyncHeldLockHandle(held) {
	const disposition = {
		held,
		released: false
	};
	let releaseInProgress = false;
	const release = () => {
		if (disposition.released || releaseInProgress) return;
		releaseInProgress = true;
		try {
			if (releaseRootSyncHeldLock(held, disposition)) disposition.released = true;
		} finally {
			releaseInProgress = false;
		}
	};
	const handle = {
		lockPath: held.lockPath,
		normalizedTargetPath: held.normalizedTargetPath,
		verifyStillHeld: () => verifyRootSyncHeldLock(held),
		release,
		[Symbol.dispose]: release
	};
	rootSyncHandleDispositions.set(handle, disposition);
	return handle;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root-acquire.js
var FileLockSyncRootArbitrationCollision = class extends FsSafeError {
	constructor() {
		super("path-mismatch", "file lock arbitration changed during local creation");
	}
};
function cleanupCreatedRootSyncLock(lockRootPath, fd, receipt, timer) {
	let timerCleanupFailed = false;
	let timerCleanupError;
	try {
		if (timer) clearInterval(timer);
	} catch (error) {
		timerCleanupFailed = true;
		timerCleanupError = error;
	}
	try {
		fs.closeSync(fd);
		if (!removeFileLockSyncRootFile(lockRootPath, receipt)) throw new FsSafeError("path-mismatch", "created sidecar lock changed before cleanup");
	} catch (fileCleanupError) {
		if (timerCleanupFailed) throw createSuppressedError(timerCleanupError, fileCleanupError, "unpublished lock timer and file cleanup both failed");
		throw fileCleanupError;
	}
	if (timerCleanupFailed) throw timerCleanupError;
}
function acquireFileLockSyncWithRoot(targetPath, inputOptions, lockRoot) {
	const authority = captureFileLockSyncRootAuthority(lockRoot);
	const options = captureRootSyncAcquireOptions(inputOptions);
	ensureRootSyncExitCleanupRegistered();
	assertNoWindowsPathAlias(targetPath);
	if (options.lockPath !== void 0) assertNoWindowsPathAlias(options.lockPath);
	const resolvedTargetPath = path.resolve(targetPath);
	const normalizedTargetPath = normalizeFileLockSyncTargetWithRoot(authority, resolvedTargetPath);
	const requestedLockPath = path.resolve(options.lockPath ?? `${normalizedTargetPath}.lock`);
	const lockRootPath = admitFileLockSyncRootPath(authority, requestedLockPath);
	const reclaimRootPath = admitFileLockSyncRootPath(authority, `${lockRootPath.path}.reclaim`);
	const guardedPaths = Object.freeze([lockRootPath, reclaimRootPath]);
	const lockPath = lockRootPath.path;
	const heldLocks = getRootSyncHeldLocks();
	const currentTargetHolder = () => heldLocks.get(normalizedTargetPath) ?? foreignSyncHeldLock("root", normalizedTargetPath);
	const tryReuseCurrentHeld = () => {
		const held = heldLocks.get(normalizedTargetPath);
		if (!(held && !foreignSyncHeldLock("root", normalizedTargetPath) && options.reentrantOwner !== void 0 && held.reentrantOwner !== void 0 && options.reentrantOwner === held.reentrantOwner && authority.adapter === held.rootAuthority.adapter && lockRootPath.relativePath === held.rootPath.relativePath && path.relative(lockRootPath.path, held.rootPath.path) === "" && held.releaseState !== "released")) return void 0;
		if (!verifyRootSyncHeldLock(held)) throw new FsSafeError("path-mismatch", "held sidecar lock changed before reentrant reuse");
		if (heldLocks.get(normalizedTargetPath) !== held || held.releaseState === "released" || foreignSyncHeldLock("root", normalizedTargetPath)) throw new FsSafeError("path-mismatch", "held sidecar lock changed during reentrant reuse");
		held.refCount += 1;
		held.revision += 1;
		return createRootSyncHeldLockHandle(held);
	};
	if (heldLocks.has(normalizedTargetPath) && !foreignSyncHeldLock("root", normalizedTargetPath)) {
		assertFileLockSyncRootPathsCurrent(guardedPaths);
		const initiallyReusable = tryReuseCurrentHeld();
		if (initiallyReusable) return initiallyReusable;
	}
	const acquisition = new SyncLockAcquisition(lockPath, normalizedTargetPath, options.retry, options.timeoutMs);
	let ownedReclaimGuard;
	let reclaimCleanupAttempted = false;
	const reuseCurrentHeld = () => ownedReclaimGuard ? void 0 : tryReuseCurrentHeld();
	const releaseReclaimGuard = () => {
		const receipt = ownedReclaimGuard;
		if (!receipt) return;
		reclaimCleanupAttempted = true;
		if (!removeFileLockSyncRootDirectory(reclaimRootPath, receipt)) throw new FsSafeError("path-mismatch", "owned sidecar reclaim guard changed before release");
		ownedReclaimGuard = void 0;
		reclaimCleanupAttempted = false;
	};
	const assertOwnedReclaimGuardCurrent = () => {
		const receipt = ownedReclaimGuard;
		if (!receipt || !fileLockSyncRootDirectoryReceiptStillCurrent(reclaimRootPath, receipt)) throw new FsSafeError("path-mismatch", "owned sidecar reclaim guard changed during acquisition");
	};
	try {
		while (true) {
			acquisition.reserve();
			acquisition.assert();
			assertFileLockSyncRootPathsCurrent(guardedPaths);
			acquisition.assert();
			if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
			if (!ownedReclaimGuard && fileLockSyncRootGuardExists(reclaimRootPath)) {
				acquisition.waitForRetry();
				continue;
			}
			if (currentTargetHolder() !== void 0) {
				const reused = reuseCurrentHeld();
				if (reused) return reused;
			}
			const payload = Reflect.apply(options.payload, options.optionsReceiver, []);
			acquisition.assert();
			const { raw, ownershipToken } = serializeSidecarLockPayload(payload);
			acquisition.assert();
			if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
			if (currentTargetHolder() !== void 0) {
				const reused = reuseCurrentHeld();
				if (reused) return reused;
				acquisition.waitForRetry();
				continue;
			}
			let fd;
			let rootReceipt;
			let unpublishedTimer;
			let lockFileCreateOpenFailure;
			try {
				const created = createFileLockSyncRootFile(lockRootPath, {
					assertBeforeOpen: () => {
						acquisition.assert();
						if (ownedReclaimGuard) assertOwnedReclaimGuardCurrent();
						if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
					},
					onOpenFailure: (error) => {
						lockFileCreateOpenFailure = { error };
					}
				});
				fd = created.fd;
				rootReceipt = created.receipt;
				fs.writeFileSync(fd, raw, "utf8");
				fs.fsyncSync(fd);
				const snapshot = {
					raw,
					payload,
					ownershipToken
				};
				if (ownedReclaimGuard) releaseReclaimGuard();
				rootReceipt = refreshFileLockSyncRootFileReceipt(lockRootPath, rootReceipt);
				const createdHeld = {
					fd,
					lockPath,
					normalizedTargetPath,
					parsePayload: options.parsePayload,
					refCount: 1,
					reentrantOwner: options.reentrantOwner,
					releaseState: "active",
					revision: 0,
					rootAuthority: authority,
					rootPath: lockRootPath,
					rootReceipt,
					snapshot
				};
				const returnedHandle = createRootSyncHeldLockHandle(createdHeld);
				acquisition.monitor(createdHeld, returnedHandle, options.onCompromised, options.compromiseCheckIntervalMs, options.optionsReceiver, (timer) => {
					unpublishedTimer = timer;
				});
				if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
				acquisition.assert();
				heldLocks.set(normalizedTargetPath, createdHeld);
				fd = void 0;
				unpublishedTimer = void 0;
				return returnedHandle;
			} catch (error) {
				if (fd !== void 0 && rootReceipt) {
					const cleanupFd = fd;
					const cleanupReceipt = rootReceipt;
					const cleanupTimer = unpublishedTimer;
					fd = void 0;
					rootReceipt = void 0;
					unpublishedTimer = void 0;
					try {
						cleanupCreatedRootSyncLock(lockRootPath, cleanupFd, cleanupReceipt, cleanupTimer);
					} catch (cleanupError) {
						throw createSuppressedError(error, cleanupError, "file lock acquisition and Root cleanup both failed");
					}
				}
				if (error instanceof FileLockSyncRootArbitrationCollision) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				const fromLockFileOpen = lockFileCreateOpenFailure !== void 0 && lockFileCreateOpenFailure.error === error;
				if (fromLockFileOpen && acquisition.retryDenial(error)) continue;
				if (!fromLockFileOpen || error.code !== "EEXIST") throw error;
				if (ownedReclaimGuard) {
					releaseReclaimGuard();
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				if (currentTargetHolder() !== void 0) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				let lockFileOpenDenied = false;
				let current;
				try {
					current = readRootSidecarSnapshotSync(lockRootPath, options.parsePayload, (openError) => {
						lockFileOpenDenied = isTransientLockFileDenial(openError, lockPath);
					});
				} catch (readError) {
					if (lockFileOpenDenied && acquisition.retryDenial(readError)) continue;
					throw readError;
				}
				if (currentTargetHolder() !== void 0) {
					const reused = reuseCurrentHeld();
					if (reused) return reused;
					acquisition.waitForRetry();
					continue;
				}
				acquisition.assert();
				if (!current) {
					acquisition.waitForRetry();
					continue;
				}
				const snapshot = current.snapshot;
				const nowMs = Date.now();
				let reclaim;
				if (options.shouldReclaim) {
					reclaim = Reflect.apply(options.shouldReclaim, options.optionsReceiver, [{
						lockPath,
						normalizedTargetPath,
						payload: snapshot.payload,
						staleMs: options.staleMs,
						nowMs,
						heldByThisProcess: false
					}]);
					assertSynchronousCallbackResult(reclaim, "shouldReclaim");
					acquisition.assert();
					if (!fileLockSyncRootSnapshotStillCurrent(lockRootPath, current)) throw new FsSafeError("path-mismatch", "sidecar changed during reclaim policy callback");
				} else reclaim = defaultSyncShouldReclaim(snapshot, options.staleMs, nowMs);
				if (reclaim) {
					if (options.staleRecovery === "remove-if-unchanged" && snapshot.raw !== void 0 && options.shouldRemoveStaleLock) {
						const guard = createFileLockSyncRootDirectory(reclaimRootPath);
						if (!guard) {
							acquisition.waitForRetry();
							continue;
						}
						ownedReclaimGuard = guard;
						reclaimCleanupAttempted = false;
						const approved = Reflect.apply(options.shouldRemoveStaleLock, options.optionsReceiver, [{
							lockPath,
							normalizedTargetPath,
							raw: snapshot.raw,
							payload: snapshot.payload
						}]);
						assertSynchronousCallbackResult(approved, "shouldRemoveStaleLock");
						acquisition.assert();
						assertOwnedReclaimGuardCurrent();
						if (approved) {
							if (!removeFileLockSyncRootFile(lockRootPath, current.receipt, snapshot, () => {
								acquisition.assert();
								assertOwnedReclaimGuardCurrent();
								if (currentTargetHolder() !== void 0) throw new FileLockSyncRootArbitrationCollision();
							})) throw new FsSafeError("path-mismatch", "stale sidecar changed before removal");
							continue;
						}
						if (!fileLockSyncRootSnapshotStillCurrent(lockRootPath, current)) throw new FsSafeError("path-mismatch", "sidecar changed during stale-removal policy callback");
						releaseReclaimGuard();
					}
					throw sidecarLockStale(lockPath, normalizedTargetPath);
				}
				acquisition.waitForRetry();
			}
		}
	} catch (error) {
		if (ownedReclaimGuard && !reclaimCleanupAttempted) try {
			releaseReclaimGuard();
		} catch (cleanupError) {
			throw createSuppressedError(error, cleanupError, "file lock acquisition and reclaim cleanup both failed");
		}
		throw error;
	} finally {
		acquisition.release();
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-stale-admission.js
/** Handle one exclusive-create conflict without surrendering canonical admission. */
function handleSyncStaleAdmission(acquisition, params) {
	const holderChanged = {};
	const assertUnheld = () => {
		acquisition.assert();
		if (params.currentHeld()) throw holderChanged;
	};
	const retryHolderChange = (error) => {
		if (error !== holderChanged) return false;
		acquisition.waitForRetry();
		return true;
	};
	let rawSnapshot;
	let lockFileOpenDenied = false;
	try {
		rawSnapshot = readSidecarLockRawSnapshotSync(acquisition.lockPath, {
			rejectNonFile: true,
			onOpenFailure: () => {
				lockFileOpenDenied = true;
				assertUnheld();
			}
		});
		assertUnheld();
	} catch (error) {
		if (retryHolderChange(error)) return;
		try {
			assertUnheld();
		} catch (boundaryError) {
			if (retryHolderChange(boundaryError)) return;
			throw boundaryError;
		}
		if (lockFileOpenDenied && acquisition.retryDenial(error)) return;
		throw error;
	}
	const stale = params.staleOptions;
	try {
		if (!stale.shouldReclaimObserved) {
			assertUnheld();
			stale.shouldReclaim = params.options.shouldReclaim;
			stale.shouldReclaimObserved = true;
			assertUnheld();
		}
		if (!stale.shouldRemoveObserved) {
			assertUnheld();
			stale.shouldRemove = params.options.shouldRemoveStaleLock;
			stale.shouldRemoveObserved = true;
			assertUnheld();
		}
	} catch (error) {
		if (retryHolderChange(error)) return;
		try {
			assertUnheld();
		} catch (boundaryError) {
			if (retryHolderChange(boundaryError)) return;
			throw boundaryError;
		}
		throw error;
	}
	const guardedParser = params.parsePayload && ((raw) => {
		assertUnheld();
		try {
			return Reflect.apply(params.parsePayload, void 0, [raw]);
		} finally {
			assertUnheld();
		}
	});
	let snapshot;
	try {
		snapshot = parseSidecarLockSnapshot(rawSnapshot, guardedParser);
		assertUnheld();
	} catch (error) {
		if (retryHolderChange(error)) return;
		throw error;
	}
	if (!snapshot) {
		acquisition.waitForRetry();
		return;
	}
	const nowMs = Date.now();
	let reclaim;
	try {
		assertUnheld();
		try {
			reclaim = stale.shouldReclaim ? Reflect.apply(stale.shouldReclaim, params.options, [{
				lockPath: acquisition.lockPath,
				normalizedTargetPath: acquisition.normalizedTargetPath,
				payload: snapshot.payload,
				staleMs: params.staleMs,
				nowMs,
				heldByThisProcess: false
			}]) : defaultSyncShouldReclaim(snapshot, params.staleMs, nowMs);
			assertSynchronousCallbackResult(reclaim, "shouldReclaim");
		} finally {
			assertUnheld();
		}
	} catch (error) {
		if (retryHolderChange(error)) return;
		throw error;
	}
	if (!reclaim) {
		acquisition.waitForRetry();
		return;
	}
	if (params.staleRecovery === "remove-if-unchanged" && snapshot.raw !== void 0 && stale.shouldRemove !== void 0) {
		let approved;
		try {
			assertUnheld();
			try {
				approved = Reflect.apply(stale.shouldRemove, params.options, [{
					lockPath: acquisition.lockPath,
					normalizedTargetPath: acquisition.normalizedTargetPath,
					raw: snapshot.raw,
					payload: snapshot.payload
				}]);
				assertSynchronousCallbackResult(approved, "shouldRemoveStaleLock");
			} finally {
				assertUnheld();
			}
		} catch (error) {
			if (retryHolderChange(error)) return;
			throw error;
		}
		if (!approved) throw sidecarLockStale(acquisition.lockPath, acquisition.normalizedTargetPath);
		try {
			fs.mkdirSync(params.reclaimGuardPath);
		} catch (error) {
			try {
				assertUnheld();
			} catch (boundaryError) {
				if (retryHolderChange(boundaryError)) return;
				throw boundaryError;
			}
			if (error.code === "EEXIST") {
				acquisition.waitForRetry();
				return;
			}
			throw error;
		}
		let holderInterrupted = false;
		try {
			assertUnheld();
			if (removeSidecarLockIfUnchangedSync(acquisition.lockPath, snapshot, assertUnheld)) return;
		} catch (error) {
			if (error === holderChanged) holderInterrupted = true;
			else throw error;
		} finally {
			try {
				fs.rmdirSync(params.reclaimGuardPath);
			} catch {}
		}
		if (holderInterrupted) {
			acquisition.waitForRetry();
			return;
		}
	}
	throw sidecarLockStale(acquisition.lockPath, acquisition.normalizedTargetPath);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync.js
function releaseAllSyncHeldLocks() {
	const heldLocks = getSyncHeldLocks();
	for (const [normalizedTargetPath, held] of heldLocks) {
		if (held.timer) {
			clearInterval(held.timer);
			held.timer = void 0;
		}
		try {
			if (held.fd !== void 0) fs.closeSync(held.fd);
		} catch {}
		try {
			removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
		} catch {}
		heldLocks.delete(normalizedTargetPath);
	}
	getSyncLockAdmissions().clear();
}
function verifySyncHeldLock(held) {
	const lockPath = held.lockPath;
	const parsePayload = held.parsePayload;
	const current = parsePayload ? readSidecarLockSnapshotSync(lockPath, parsePayload) : readSidecarLockRawSnapshotSync(lockPath);
	return !!current && sidecarLockSnapshotMatches(current, held.snapshot);
}
function releaseSyncHeldLock(held) {
	const heldLocks = getSyncHeldLocks();
	if (heldLocks.get(held.normalizedTargetPath) !== held) return false;
	if (held.refCount > 1) {
		held.refCount -= 1;
		return false;
	}
	if (held.timer) {
		clearInterval(held.timer);
		held.timer = void 0;
	}
	if (held.fd !== void 0) {
		const fd = held.fd;
		held.fd = void 0;
		fs.closeSync(fd);
	}
	removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
	heldLocks.delete(held.normalizedTargetPath);
	return true;
}
function createSyncHeldLockHandle(held) {
	let released = false;
	const release = () => {
		if (released) return;
		releaseSyncHeldLock(held);
		released = true;
	};
	return {
		lockPath: held.lockPath,
		normalizedTargetPath: held.normalizedTargetPath,
		verifyStillHeld: () => verifySyncHeldLock(held),
		release,
		[Symbol.dispose]: release
	};
}
function canonicalLockParentSync(parent) {
	return process.platform === "win32" ? realpathSync$1.native(parent) : realpathSync$1(parent);
}
function normalizeTargetPath(targetPath) {
	const resolved = path.resolve(targetPath);
	assertNoWindowsPathAlias(resolved);
	const directory = path.dirname(resolved);
	let parentExists = false;
	try {
		parentExists = fs.statSync(directory).isDirectory();
	} catch {}
	if (!parentExists) fs.mkdirSync(recursiveMkdirPath(directory), { recursive: true });
	let parent;
	try {
		parent = canonicalLockParentSync(path.dirname(resolved));
	} catch {
		return resolved;
	}
	assertNoWindowsPathAlias(parent);
	const normalized = path.join(parent, path.basename(resolved));
	assertNoWindowsPathAlias(normalized);
	return normalized;
}
function acquireFileLockSync(targetPath, options) {
	const lockRoot = options.lockRoot;
	if (lockRoot) return acquireFileLockSyncWithRoot(targetPath, options, lockRoot);
	const defaults = getFsSafeLockConfig();
	const retry = options.retry ?? defaults.retry ?? {};
	const timeoutMs = options.timeoutMs ?? defaults.timeoutMs;
	validateSidecarLockRetryOptions(retry);
	validateSidecarLockTimeoutMs(timeoutMs);
	const staleMs = options.staleMs ?? defaults.staleMs ?? 3e4;
	validateSidecarLockStaleMs(staleMs);
	const compromiseCheckIntervalMs = options.compromiseCheckIntervalMs;
	validateSidecarLockCompromiseCheckIntervalMs(compromiseCheckIntervalMs);
	const explicitLockPath = options.lockPath;
	assertNoWindowsPathAlias(targetPath);
	if (explicitLockPath !== void 0) assertNoWindowsPathAlias(explicitLockPath);
	const normalizedTargetPath = normalizeTargetPath(targetPath);
	const lockPath = path.resolve(explicitLockPath ?? `${normalizedTargetPath}.lock`);
	assertNoWindowsPathAlias(lockPath);
	const requestedReentrantOwner = options.reentrantOwner;
	const heldLocks = getSyncHeldLocks();
	const currentTargetHolder = () => heldLocks.get(normalizedTargetPath) ?? foreignSyncHeldLock("raw", normalizedTargetPath);
	const initiallyHeld = heldLocks.get(normalizedTargetPath);
	if (initiallyHeld && !foreignSyncHeldLock("raw", normalizedTargetPath) && requestedReentrantOwner !== void 0 && initiallyHeld.reentrantOwner !== void 0 && requestedReentrantOwner === initiallyHeld.reentrantOwner) {
		initiallyHeld.refCount += 1;
		return createSyncHeldLockHandle(initiallyHeld);
	}
	const acquisition = new SyncLockAcquisition(lockPath, normalizedTargetPath, retry, timeoutMs);
	let payloadCallback;
	let onCompromised = void 0;
	let onCompromisedObserved = false;
	let parsePayload = void 0;
	let parsePayloadObserved = false;
	let staleRecovery = void 0;
	let staleRecoveryObserved = false;
	const staleOptions = {};
	const reclaimGuardPath = `${lockPath}.reclaim`;
	try {
		while (true) {
			if (!acquisition.owns) {
				const held = heldLocks.get(normalizedTargetPath);
				if (held && !foreignSyncHeldLock("raw", normalizedTargetPath) && requestedReentrantOwner !== void 0 && held.reentrantOwner !== void 0 && requestedReentrantOwner === held.reentrantOwner) {
					held.refCount += 1;
					return createSyncHeldLockHandle(held);
				}
				acquisition.reserve();
			}
			const attemptHeld = currentTargetHolder();
			const holderWasReplaced = () => {
				const current = currentTargetHolder();
				return current !== void 0 && current !== attemptHeld;
			};
			if (!staleRecoveryObserved) {
				staleRecovery = acquisition.run(() => options.staleRecovery ?? defaults.staleRecovery);
				staleRecoveryObserved = true;
				if (holderWasReplaced()) {
					acquisition.waitForRetry();
					continue;
				}
			}
			const reclaimGuardExists = syncReclaimGuardExists(reclaimGuardPath);
			if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			if (reclaimGuardExists) {
				acquisition.waitForRetry();
				continue;
			}
			let fd;
			let createdHeld;
			let createdSnapshot;
			if (!payloadCallback) payloadCallback = acquisition.run(() => options.payload);
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			const payload = acquisition.run(() => Reflect.apply(payloadCallback, options, []));
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			const { raw, ownershipToken } = acquisition.run(() => serializeSidecarLockPayload(payload));
			if (holderWasReplaced()) {
				acquisition.waitForRetry();
				continue;
			}
			if (currentTargetHolder() !== void 0) {
				acquisition.waitForRetry();
				continue;
			}
			if (!onCompromisedObserved) {
				onCompromised = acquisition.run(() => options.onCompromised);
				onCompromisedObserved = true;
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
			}
			if (!parsePayloadObserved) {
				parsePayload = acquisition.run(() => options.parsePayload);
				parsePayloadObserved = true;
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
			}
			let lockFileCreateDenied = false;
			let exclusiveCreateConflict = false;
			try {
				const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
				try {
					assertExclusiveCreateLeaf(lockPath);
				} catch (error) {
					exclusiveCreateConflict = error.code === "EEXIST";
					throw error;
				}
				try {
					fd = fs.openSync(lockPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 384);
				} catch (error) {
					lockFileCreateDenied = isTransientLockFileDenial(error, lockPath);
					exclusiveCreateConflict = error.code === "EEXIST";
					throw error;
				}
				fs.writeFileSync(fd, raw, "utf8");
				fs.fsyncSync(fd);
				createdSnapshot = {
					raw,
					payload,
					stat: fs.fstatSync(fd, { bigint: true }),
					ownershipToken
				};
				createdHeld = {
					fd,
					lockPath,
					normalizedTargetPath,
					parsePayload,
					refCount: 1,
					reentrantOwner: requestedReentrantOwner,
					snapshot: createdSnapshot
				};
				const candidateHeld = createdHeld;
				ensureSyncLockExitCleanupRegistered(releaseAllSyncHeldLocks, lockPath, normalizedTargetPath);
				if (!acquisition.hasToken() || currentTargetHolder() !== void 0) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				const returnedHandle = createSyncHeldLockHandle(candidateHeld);
				acquisition.monitor(candidateHeld, returnedHandle, onCompromised, compromiseCheckIntervalMs, options);
				if (!acquisition.hasToken() || currentTargetHolder() !== void 0) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				heldLocks.set(normalizedTargetPath, candidateHeld);
				acquisition.release();
				fd = void 0;
				return returnedHandle;
			} catch (error) {
				if (createdHeld?.timer) {
					clearInterval(createdHeld.timer);
					createdHeld.timer = void 0;
				}
				if (createdHeld && heldLocks.get(normalizedTargetPath) === createdHeld) heldLocks.delete(normalizedTargetPath);
				if (fd !== void 0) {
					const failed = createdSnapshot ?? { payload: null };
					if (!failed.stat) try {
						failed.stat = fs.fstatSync(fd, { bigint: true });
					} catch {}
					const failedFd = fd;
					fd = void 0;
					if (createdHeld) createdHeld.fd = void 0;
					try {
						fs.closeSync(failedFd);
						if (failed.stat) removeSidecarLockIfUnchangedSync(lockPath, failed);
					} catch (cleanupError) {
						throw createSuppressedError(error, cleanupError, "file lock acquisition and cleanup both failed");
					}
				}
				if (lockFileCreateDenied) {
					if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
					if (currentTargetHolder() !== void 0) {
						acquisition.waitForRetry();
						continue;
					}
					if (acquisition.retryDenial(error)) continue;
					throw error;
				}
				if (!exclusiveCreateConflict) throw error;
				if (!acquisition.hasToken()) throw sidecarLockTimeout(lockPath, normalizedTargetPath);
				if (currentTargetHolder() !== void 0) {
					acquisition.waitForRetry();
					continue;
				}
				handleSyncStaleAdmission(acquisition, {
					currentHeld: currentTargetHolder,
					options,
					parsePayload,
					reclaimGuardPath,
					staleMs,
					staleOptions,
					staleRecovery
				});
				continue;
			}
		}
	} finally {
		acquisition.release();
	}
}
//#endregion
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code !== "EROFS" && code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || code === "EPERM" && filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/gateway-state-owner-directory.ts
function ensureOwnerDirectory(directory, created) {
	const firstCreated = fs.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	if (firstCreated && created) {
		const boundary = path.toNamespacedPath(firstCreated);
		const directories = [];
		for (let current = directory;;) {
			const { dev, ino } = fs.lstatSync(current, { bigint: true });
			directories.push({
				path: current,
				dev,
				ino
			});
			if (path.toNamespacedPath(current) === boundary) break;
			const parent = path.dirname(current);
			if (parent === current) throw new Error("Created state ownership directory is outside its expected ancestry");
			current = parent;
		}
		for (const entry of directories) {
			const previous = created.findIndex((candidate) => candidate.path === entry.path);
			if (previous < 0) created.push(entry);
			else created[previous] = entry;
		}
	}
	const observed = fs.lstatSync(directory);
	const uid = process.getuid?.();
	if (!observed.isDirectory() || uid !== void 0 && observed.uid !== uid) throw new Error("State ownership directory must be a user-owned real directory");
	if (process.platform !== "win32" && (observed.mode & 4095) !== 448) {
		applyPrivateModeSync(directory, 448);
		if ((fs.lstatSync(directory).mode & 63) !== 0) throw new Error("State ownership directory permissions are not private");
	}
}
function removeCreatedProjectionDirectories(directories) {
	let directory = directories[0];
	while (directory) {
		try {
			const observed = fs.lstatSync(directory.path, { bigint: true });
			if (observed.isDirectory() && observed.dev === directory.dev && observed.ino === directory.ino) fs.rmdirSync(directory.path);
		} catch (error) {
			const code = extractErrorCode(error);
			if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
		}
		directories.shift();
		directory = directories[0];
	}
}
/** In-process identity is independent of the on-disk lock spelling used by older versions. */
function resolveStateOwnerIdentity(databasePath) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(databasePath);
	return {
		canonicalPath,
		ownerPath: resolveCanonicalStateOwnerPath(canonicalPath),
		key: process.platform === "win32" ? normalizeWindowsPathForComparison(canonicalPath) : canonicalPath
	};
}
function resolveCanonicalStateOwnerPath(canonical) {
	const uid = process.getuid?.();
	const directory = process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks", uid === void 0 ? "openclaw-state-owners" : `openclaw-state-owners-${uid}`) : resolveGatewayLockDirForCanonicalStateDir(resolveOpenClawStateDirForDatabasePath(canonical));
	return path.join(resolveIdentityPathViaExistingAncestorSync(directory), `state.${sha256HexPrefixCore(canonical, 16)}.lock`);
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.runtime.ts
/** Verify the held inode and exact acquisition bytes before touching it. */
function renewGatewayStateOwnerLock(fd, lockPath, raw, stamp) {
	const held = fs.fstatSync(fd, { bigint: true });
	const current = fs.statSync(lockPath, { bigint: true });
	const bytes = Buffer.alloc(Buffer.byteLength(raw) + 1);
	const length = fs.readSync(fd, bytes, 0, bytes.length, 0);
	if (held.nlink === 0n || held.dev !== current.dev || held.ino !== current.ino || bytes.subarray(0, length).toString("utf8") !== raw) return false;
	fs.futimesSync(fd, stamp, stamp);
	return true;
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.ts
const now = Date.now.bind(Date);
/** Process and schema owners share one renewal worker and one failure deadline. */
function startGatewayStateOwnerHeartbeat(heldLocks, onLost) {
	const locks = {};
	for (const lock of heldLocks) {
		locks[lock.lockPath] = fs.readFileSync(lock.lockPath, "utf8");
		if (!lock.verifyStillHeld()) throw new Error("OpenClaw state ownership is no longer current");
	}
	const rootPath = Object.keys(locks)[0];
	if (!rootPath) throw new Error("Gateway state ownership requires a held lock");
	const rootIdentity = fs.statSync(rootPath, { bigint: true });
	const { moduleUrl: url, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("gatewayStateOwnerHeartbeat"));
	return runInDetachedAsyncContext(() => {
		const lastBeat = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
		Atomics.store(lastBeat, 0, BigInt(now()));
		const { port1, port2 } = new MessageChannel();
		const worker = createCpuTrackedWorker(url, {
			workerData: {
				clock: "epoch",
				locks,
				intervalMs: GATEWAY_OWNER_HEARTBEAT_MS,
				failureMs: 6e4,
				lastBeat: lastBeat.buffer,
				events: port2
			},
			transferList: [port2],
			execArgv: resolveRuntimeWorkerThreadExecArgv(url)
		});
		worker.unref();
		port1.on("message", () => recordWorkerMessage("lifecycle", "from_worker"));
		port1.unref();
		worker.on("error", (err) => onLost(/* @__PURE__ */ new Error(`${coerceErrorMessage(err)}; restart Gateway.`)));
		const inspect = () => {
			const renewedAt = Atomics.load(lastBeat, 0);
			const age = now() - Number(renewedAt);
			const remaining = age < 0 ? 0 : 6e4 - age;
			if (remaining <= 0) try {
				const renewalStartedAt = now();
				const stamp = new Date(renewalStartedAt);
				for (const lock of heldLocks) {
					if (!lock.verifyStillHeld()) {
						if (lock.lockPath !== rootPath) continue;
						throw new Error("owner lock was removed or replaced");
					}
					const fd = fs.openSync(lock.lockPath, "r+");
					try {
						const held = fs.fstatSync(fd, { bigint: true });
						if (lock.lockPath === rootPath && (held.dev !== rootIdentity.dev || held.ino !== rootIdentity.ino)) throw new Error("owner lock was removed or replaced");
						const raw = fs.readFileSync(fd, "utf8");
						if (!lock.verifyStillHeld() || !renewGatewayStateOwnerLock(fd, lock.lockPath, raw, stamp)) throw new Error("owner lock was removed or replaced");
					} finally {
						fs.closeSync(fd);
					}
				}
				Atomics.store(lastBeat, 0, BigInt(renewalStartedAt));
				return 6e4;
			} catch (error) {
				onLost(/* @__PURE__ */ new Error(`Gateway state ownership is no longer current at ${rootPath}: ${coerceErrorMessage(error)}; restart the Gateway.`));
			}
			return remaining;
		};
		let timer;
		const watch = () => {
			const remaining = inspect();
			if (remaining > 0) {
				timer = setTimeout(watch, remaining);
				timer.unref();
			}
		};
		watch();
		let termination;
		const stop = () => {
			if (termination) return;
			clearTimeout(timer);
			port1.close();
			worker.postMessage("stop", []);
			termination ??= worker.terminate();
		};
		runtimeGeneration?.retain(worker, async () => async () => {
			stop();
			await termination;
		});
		return {
			worker,
			paths: new Set(Object.keys(locks)),
			inspect,
			stop
		};
	});
}
//#endregion
//#region src/infra/gateway-state-owner.ts
function hasPhysicalOwnership(owner) {
	try {
		return verifyOwnerLock(owner, owner.locks.values().next().value);
	} catch (error) {
		if (owner.lost.signal.aborted) return false;
		throw error;
	}
}
function verifyOwnerLock(owner, lock) {
	owner.lost.signal.throwIfAborted();
	owner.heartbeat?.inspect();
	owner.lost.signal.throwIfAborted();
	if (!lock) return false;
	if (!lock.verifyStillHeld()) {
		loseOwner(owner, /* @__PURE__ */ new Error(`${lock.lockPath}: no longer current; lock removed/replaced; restart the Gateway.`));
		return false;
	}
	const projection = owner.getProjection?.();
	if (projection && owner.heartbeat && !owner.heartbeat.paths.has(projection.lockPath)) {
		const raw = fs.readFileSync(projection.lockPath, "utf8");
		if (!projection.verifyStillHeld()) return false;
		owner.heartbeat.worker.postMessage([projection.lockPath, raw], []);
		owner.heartbeat.paths.add(projection.lockPath);
	}
	return true;
}
const log = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log.error(error.message);
	owner.lost.abort(error);
}
const readOwnerPaths = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateReadOwnerPaths"), () => /* @__PURE__ */ new Map());
const owners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwners"), () => /* @__PURE__ */ new Map());
const schemaOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaOwners"), () => new AsyncLocalStorage());
/** The synchronous lexical owner is live authority, not the existence of its sidecar. */
function getStateDatabaseSchemaLease(databasePath) {
	const entry = schemaOwners.getStore()?.get(resolveStateOwnerIdentity(databasePath).key);
	if (entry && !entry.active) throw new Error("State schema maintenance scope is no longer current");
	entry?.lease.assertCurrent();
	return entry?.lease;
}
/** Retry cold admission only; the same budget covers opening and its first unentered write. */
function withStateDatabaseColdAdmission(params, open) {
	const budget = normalizeSqliteNonNegativeInteger(params.busyTimeoutMs, "busyTimeoutMs");
	const deadline = performance.now() + budget;
	const canonical = resolveIdentityPathViaExistingAncestorSync(params.databasePath);
	const remainingBusyTimeoutMs = () => Math.max(0, Math.ceil(deadline - performance.now()));
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	for (;;) try {
		assertStateDatabaseAccessAllowed(params.databasePath);
		return open(remainingBusyTimeoutMs);
	} catch (error) {
		if (!(error instanceof StateDatabaseAdmissionPendingError) || resolveIdentityPathViaExistingAncestorSync(error.databasePath) !== canonical || params.canRetry?.() === false) throw error;
		const remaining = deadline - performance.now();
		if (remaining <= 0) throw error;
		Atomics.wait(waiting, 0, 0, Math.min(10, remaining));
	}
}
function acquireOwnerFile(databasePath, pathname, payload, busyTimeoutMs = 0, createdDirectories) {
	const deadline = performance.now() + busyTimeoutMs;
	ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
	const observed = { holder: null };
	const parsePayload = (raw) => {
		if (raw !== observed.raw) {
			observed.holder = parseGatewayLockPayload(raw);
			observed.raw = raw;
		}
		return observed.holder;
	};
	const stale = ({ payload: value }) => isGatewayStateOwnerDefinitelyStale(value, pathname);
	if (busyTimeoutMs > 0) try {
		const previous = parsePayload(fs.readFileSync(pathname, "utf8"));
		if (previous && !stale({ payload: previous }) && (previous.pid === process.pid || (previous.role ?? "gateway") === "gateway" && isPidAlive(previous.pid))) throw new GatewayStateOwnerContentionError(databasePath);
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	for (let retriedMissingParent = false;;) try {
		return acquireFileLockSync(pathname, {
			lockPath: pathname,
			retry: busyTimeoutMs > 0 ? {
				factor: 1.25,
				minTimeout: 10,
				maxTimeout: 25,
				randomize: false
			} : { retries: 0 },
			timeoutMs: Math.max(0, Math.ceil(deadline - performance.now())),
			staleMs: Infinity,
			staleRecovery: "remove-if-unchanged",
			reentrantOwner: payload.ownerId,
			payload: () => payload,
			parsePayload,
			shouldReclaim: stale,
			shouldRemoveStaleLock: stale
		});
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" && !retriedMissingParent) {
			retriedMissingParent = true;
			ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
			continue;
		}
		if (code === "file_lock_timeout" || code === "file_lock_stale") {
			const { holder } = observed;
			const holderDetail = describeGatewayLockHolder(holder ?? {}, pathname, holder && isPidAlive(holder.pid) ? "live" : "unknown");
			throw new GatewayStateOwnerContentionError(databasePath, error, holderDetail);
		}
		throw error;
	}
}
function leaseForFile(pathname, lock, owner, projection) {
	let released = false;
	const holdsPhysicalLease = () => verifyOwnerLock(owner, lock) && (!projection || projection.verifyStillHeld());
	const lease = {
		path: pathname,
		assertCurrent() {
			if (released || !holdsPhysicalLease()) throw new Error("OpenClaw state ownership is no longer current");
		},
		assertDatabaseAccess(databasePath) {
			if (released || owners.get(owner.key) !== owner || resolveStateOwnerIdentity(databasePath).key !== owner.key || !holdsPhysicalLease()) throw new Error("OpenClaw state maintenance does not own this database");
		},
		run(operation) {
			lease.assertCurrent();
			readOwnerPaths.clear();
			const inherited = new Map(schemaOwners.getStore());
			const entry = {
				lease,
				active: true
			};
			inherited.set(owner.key, entry);
			try {
				return schemaOwners.run(inherited, operation);
			} finally {
				entry.active = false;
				readOwnerPaths.clear();
			}
		},
		release() {
			readOwnerPaths.clear();
			if (!released) {
				projection?.release();
				lock.release();
				released = true;
				owner.locks.delete(lock);
				if (projection) owner.locks.delete(projection);
				if (owner.locks.size === 0 && owners.get(owner.key) === owner) {
					owner.heartbeat?.stop();
					owner.accepting = false;
					owners.delete(owner.key);
				}
			}
			if (owner.locks.size === 0) removeCreatedProjectionDirectories(owner.projectionDirectories);
		}
	};
	return lease;
}
/** Accepted schema work retains the sidecar even when its process owner stops lending. */
function acquireStateDatabaseSchemaLease(databasePath, options = {}) {
	readOwnerPaths.clear();
	const identity = resolveStateOwnerIdentity(databasePath);
	let owner = owners.get(identity.key);
	const pathname = owner?.path ?? identity.ownerPath;
	if (owner && (!owner.accepting || !hasPhysicalOwnership(owner))) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	if (owner) assertStateDatabaseAccessAllowed(databasePath);
	const payload = owner?.payload ?? {
		...defaultPayload(databasePath),
		stateOwnerKind: "schema"
	};
	let lock;
	const projectionDirectories = [];
	try {
		lock = acquireOwnerFile(databasePath, pathname, payload, owner ? 0 : options.busyTimeoutMs ?? 5e3, projectionDirectories);
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) try {
			assertStateDatabaseAccessAllowed(databasePath);
		} catch (currentOwnerError) {
			if (currentOwnerError instanceof StateDatabaseAdmissionPendingError) throw currentOwnerError;
		}
		throw error;
	}
	const projectionPath = owner?.projectionPath ?? path.join(resolveGatewayLockDir(resolveOpenClawStateDirForDatabasePath(resolveIdentityPathViaExistingAncestorSync(databasePath))), "gateway.state.lock");
	let projection;
	try {
		projection = owner?.getProjection?.()?.retain() ?? acquireOwnerFile(databasePath, projectionPath, {
			...payload,
			role: payload.role === "gateway" ? "gateway" : "agent-embedded"
		}, 0, projectionDirectories);
	} catch (error) {
		return runWithSqliteCleanup({ release() {
			lock.release();
			removeCreatedProjectionDirectories(projectionDirectories);
		} }, "state schema projection admission", () => {
			throw error;
		});
	}
	if (owner) {
		owner.locks.add(lock);
		owner.locks.add(projection);
		owner.projectionDirectories.push(...projectionDirectories);
	} else {
		owner = {
			key: identity.key,
			path: pathname,
			kind: "schema",
			payload,
			projectionPath,
			locks: /* @__PURE__ */ new Set([lock, projection]),
			projectionDirectories,
			lost: new AbortController(),
			accepting: true
		};
		owners.set(owner.key, owner);
	}
	const lease = leaseForFile(pathname, lock, owner, projection);
	try {
		const heartbeat = owner.heartbeat ??= startGatewayStateOwnerHeartbeat(owner.locks, (error) => loseOwner(owner, error));
		const raw = fs.readFileSync(projection.lockPath, "utf8");
		lease.assertCurrent();
		heartbeat.worker.postMessage([projection.lockPath, raw], []);
		heartbeat.paths.add(projection.lockPath);
		return lease;
	} catch (error) {
		return runWithSqliteCleanup(lease, "state schema ownership verification", () => {
			throw error;
		});
	}
}
/** Capture registered process custody; a PID or copied lock payload grants no authority. */
function captureGatewayStateOwner(databasePath) {
	const key = resolveStateOwnerIdentity(databasePath).key;
	const owner = owners.get(key);
	if (!owner || owner.kind !== "process") return;
	const assertCurrent = () => {
		owner.lost.signal.throwIfAborted();
		if (owners.get(key) !== owner || !owner.accepting || resolveStateOwnerIdentity(databasePath).key !== key || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) throw new GatewayStateOwnerContentionError(databasePath);
		assertStateDatabaseAccessAllowed(databasePath);
	};
	assertCurrent();
	return {
		ownerId: owner.payload.ownerId,
		role: owner.payload.role ?? "gateway",
		assertCurrent,
		signal: owner.lost.signal
	};
}
/** Reads within an admission reuse process custody; the next admission verifies the lock. */
function assertStateDatabaseReadAllowed(databasePath, captured) {
	assertStateDatabaseReadAtOwnerPath(databasePath, captured);
}
function assertStateDatabaseReadAtOwnerPath(databasePath, captured, prepared) {
	if (owners.size === 0) {
		assertStateDatabaseAccessAtOwnerPath(databasePath, prepared ?? resolveStateOwnerIdentity(databasePath), captured);
		return;
	}
	const key = path.resolve(databasePath);
	if (readOwnerPaths.get(key)?.accepting) return;
	readOwnerPaths.delete(key);
	const identity = prepared ?? resolveStateOwnerIdentity(databasePath);
	const owner = owners.get(identity.key);
	const role = owner?.payload.role ?? "gateway";
	if (!owner || owner.kind !== "process" || !owner.accepting || role !== "gateway" && role !== "agent-embedded") {
		assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured);
		return;
	}
	if (!hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) {
		owner.lost.signal.throwIfAborted();
		throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
	}
	readOwnerPaths.set(key, owner);
}
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
function assertStateDatabaseAccessAllowed(databasePath, captured) {
	assertStateDatabaseAccessAtOwnerPath(databasePath, resolveStateOwnerIdentity(databasePath), captured);
}
/** Retained handles keep their admitted paths; reopening captures a fresh identity. */
function captureStateDatabaseAccess(databasePath) {
	const identity = resolveStateOwnerIdentity(databasePath);
	const { canonicalPath } = identity;
	return {
		canonicalPath,
		assertAccessAllowed(captured) {
			assertStateDatabaseAccessAtOwnerPath(canonicalPath, identity, captured);
		},
		assertReadAllowed(captured) {
			assertStateDatabaseReadAtOwnerPath(canonicalPath, captured, identity);
		}
	};
}
function assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured) {
	const assertMaintenance = () => {
		const schemaLease = captured ? captured.schemaLease : getStateDatabaseSchemaLease(databasePath);
		if (schemaLease) {
			schemaLease.assertDatabaseAccess(databasePath);
			return;
		}
		const scope = captured ? captured.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new StateDatabaseMaintenanceScopeError(databasePath);
		scope.assertDatabaseAccess(databasePath);
	};
	const local = owners.get(identity.key);
	if (local) {
		if (!hasPhysicalOwnership(local)) {
			local.lost.signal.throwIfAborted();
			throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
		}
		const role = local.payload.role ?? "gateway";
		if (!local.accepting || role !== "gateway" && role !== "agent-embedded") assertMaintenance();
		return;
	}
	assertPersistedStateDatabaseAccessAllowed({
		databasePath,
		ownerPath: identity.ownerPath,
		assertMaintenance
	});
}
//#endregion
export { requireNodeSqlite as A, isOpenClawDatabaseMaintenanceResourceOwned as C, bunSqliteNativeCleanupPending as D, runOutsideOpenClawDatabaseMaintenanceScope as E, supportsNodeSqliteJsonb as F, require_semver as I, resolveImmutableSqliteFileUri as M, resolveSqliteFilesystemPath as N, installSqliteNativeRuntimeAdmission as O, supportsNodeSqliteExtensionLoading as P, getOpenClawDatabaseMaintenanceScope as S, observeOpenClawDatabaseMaintenanceResource as T, createOpenClawStateDatabaseAsyncLifecycle as _, captureStateDatabaseAccess as a, captureOpenClawDatabaseMaintenanceResource as b, applyPrivateModeSync as c, FIRST_USE_STATE_TABLES as d, LAZY_ADDITIVE_STATE_INDEXES as f, StateDatabaseReadAdmissionInvalidatedError as g, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as h, captureGatewayStateOwner as i, resolveExistingSqliteFileUri as j, openNodeSqliteDatabase as k, DOCTOR_OWNED_STATE_TABLES as l, OPENCLAW_DATABASE_SCHEMA_DOCS_URL as m, assertStateDatabaseAccessAllowed as n, getStateDatabaseSchemaLease as o, LAZY_ADDITIVE_STATE_TABLES as p, assertStateDatabaseReadAllowed as r, withStateDatabaseColdAdmission as s, acquireStateDatabaseSchemaLease as t, FIRST_USE_STATE_INDEXES as u, isStateDatabaseReadAdmissionInvalidatedError as v, isOpenClawDatabaseMaintenanceWorkerAccess as w, getOpenClawDatabaseMaintenanceResourceScope as x, allowsMaintenanceLiveAuthorityReads as y };
