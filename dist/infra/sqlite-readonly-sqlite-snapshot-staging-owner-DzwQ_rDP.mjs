import { $ as expectDefined, D as shortenHomePath, F as tryProcessCwd, Q as resolveTimerTimeoutMs, W as sliceUtf16Safe, a as areDiagnosticsEnabledForProcess, at as toErrorObject, gt as normalizeLowercaseStringOrEmpty, pt as resolveGlobalSingleton, t as createSubsystemLogger, wt as isRecord, y as resolveStateDir } from "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { C as trackWorkerRequest, D as registerAgentDatabaseReaderCloser, E as matchesAgentDatabaseReadCandidatePath, S as classifyWorkerRequest, b as DEFAULT_WORKER_PENDING_BYTES, k as BrokerChild, t as createOwnedWorkerTaskPool, x as captureRetainedNativeWorkerSource } from "./sqlite-readonly-worker-task-pool-CUbFmrb9.mjs";
import { Gt as sameFileIdentityForCleanup, Lt as inspectFileIdentitySync, P as formatErrorDetail, R as assertDirectoryIdentitySync, S as absolutePathWithRawSegments, St as pathForWindowsFilesystem, Tt as realpathSync$1, Vt as FsSafeError, ct as assertNoNulPathInput, dt as isPathInside, lt as hasNodeErrorCode, q as inspectDirectoryIdentitySync, r as racePromiseWithAbortSignal, wt as resolvePathPreservingWindowsRoot, yt as isWindowsReservedDeviceName } from "./sqlite-readonly-runtime-process-manifest-B1faCUt1.mjs";
import { Cn as OpenClawStateOwnershipError, En as createSqliteLifecycleAggregateError, Ht as createDeferredCore, Lt as VERSION, Sn as OpenClawStateExternalOwnershipError, Tn as SqliteCoordinatorError, U as getSqliteRuntimeCapabilities, Ut as runInDetachedAsyncContext, wn as OpenClawStateOwnershipMetadataError } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { i as SQLITE_READONLY_CHILD_ARG } from "./sqlite-readonly-runtime-binary-aVOs5Y3K.mjs";
import { C as isSqliteLockError, E as markSqliteNativeOpenFailure, w as isSqliteNativeOpenFailure } from "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { A as resolveRuntimeProcessEntrypointUrl, An as finallyRetainedOperation, D as recordWorkerMessage, Dt as SqliteSchemaVersionError, En as sealRetainedSnapshotTempDirectory, H as getOpenClawDatabaseMaintenanceScope, Hn as resolveSafeNodeCompileCacheDirectory, Ln as captureSqliteAuthSchema, Mn as mapRetainedOperation, Mt as StartupMaintenanceRequiredError, Nn as createSqliteAuthTransferReceiver, On as startRemoveTempDirectory, Pn as createSqliteOperationTransferReceiver, Tn as retainSnapshotWork, a as isSqliteSnapshotStagingMode, et as resolveOpenClawStateSqlitePath, i as isSqliteReadOnlyWorkerResult, j as resolveRuntimeWorkerArgv, jn as flatMapRetainedOperation, k as captureRuntimeWorkerSource, kn as createRetainedOperation, n as SQLITE_READONLY_WORKER_MAX_BUFFER, o as readSqliteReadOnlyWorkerValue, r as createSqliteReadOnlyWorkerError, s as sqliteReadOnlyWorkerRequestArgs, t as SQLITE_READONLY_STDERR_TAIL_CHARS, v as GatewayStateOwnerContentionError, vn as SqliteSnapshotCleanupError, xn as registerRetainedSnapshotTempDirectory, zn as isArtifactPreservingStateRead } from "./sqlite-readonly-location.worker.js";
import path from "node:path";
import { serialize } from "node:v8";
import { randomInt } from "node:crypto";
import fs, { realpathSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { MessageChannel, receiveMessageOnPort, threadId } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { execFile, spawn, spawnSync } from "node:child_process";
import { performance as performance$1 } from "node:perf_hooks";
import { Socket } from "node:net";
//#region packages/normalization-core/src/format.ts
const BYTE_SIZE_UNITS = [
	"byte",
	"kilo",
	"mega",
	"giga",
	"tera"
];
const BYTE_SIZE_STYLES = {
	iec: {
		base: 1024,
		labels: [
			"B",
			"KiB",
			"MiB",
			"GiB",
			"TiB"
		]
	},
	"legacy-binary": {
		base: 1024,
		labels: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		]
	}
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-prefix.js
function rawRoot(absolutePath) {
	if (path.sep === "\\" && /^\\\\[?.]\\UNC\\/i.test(absolutePath)) {
		const shareRoot = path.parse(`\\\\${absolutePath.slice(8)}`).root;
		return absolutePath.slice(0, shareRoot.length + 6);
	}
	return path.parse(absolutePath).root;
}
function resolutionError(code, absolutePath) {
	return Object.assign(/* @__PURE__ */ new Error(`${code}: ${code === "ELOOP" ? "too many symbolic links" : "not a directory"}, resolvePathPrefix ${formatErrorDetail(absolutePath)}`), {
		code,
		syscall: "resolvePathPrefix",
		path: absolutePath
	});
}
const SHIFT_QUEUE_COMPONENT_LIMIT = 32;
function resolvePathPrefixSync(input) {
	assertNoNulPathInput(input);
	const absolutePath = absolutePathWithRawSegments(input);
	let resolved = rawRoot(absolutePath);
	let remaining = absolutePath.slice(resolved.length).split(path.sep);
	let shiftQueue = remaining.length <= SHIFT_QUEUE_COMPONENT_LIMIT;
	let nextSegment = 0;
	let remainingCount = remaining.length;
	const visitedStates = /* @__PURE__ */ new Set();
	let symlinkHops = 0;
	while (remainingCount > 0) {
		const segment = shiftQueue ? remaining.shift() : remaining[nextSegment++];
		remainingCount--;
		if (segment === "") continue;
		if (segment === "." || segment === "..") {
			const atRoot = resolved === rawRoot(resolved);
			const lookup = segment === ".." && atRoot ? "." : segment;
			const operationBase = pathForWindowsFilesystem(resolved);
			fs.lstatSync(`${operationBase}${operationBase.endsWith(path.sep) ? "" : path.sep}${lookup}`, { bigint: true });
			if (segment === ".." && !atRoot) resolved = path.dirname(resolved);
			continue;
		}
		const candidate = path.join(resolved, segment);
		let stat;
		try {
			stat = fs.lstatSync(candidate, { bigint: true });
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
			return {
				absolutePath,
				existingPath: realpathSync$1.native(pathForWindowsFilesystem(resolved)),
				unresolvedSegments: shiftQueue ? [segment, ...remaining] : remaining.slice(nextSegment - 1)
			};
		}
		if (!stat.isSymbolicLink()) {
			if (!stat.isDirectory() && remainingCount > 0) throw resolutionError("ENOTDIR", absolutePath);
			resolved = candidate;
			continue;
		}
		const pendingSuffix = shiftQueue ? remaining : remaining.slice(nextSegment);
		const state = JSON.stringify([
			String(stat.dev),
			String(stat.ino),
			candidate,
			pendingSuffix
		]);
		if (symlinkHops >= 64 || visitedStates.has(state)) throw resolutionError("ELOOP", absolutePath);
		visitedStates.add(state);
		symlinkHops++;
		const target = fs.readlinkSync(candidate);
		const rawTarget = path.sep === "\\" ? target.replaceAll("/", "\\") : target;
		let targetSegments;
		if (path.isAbsolute(rawTarget)) {
			const targetRoot = rawRoot(rawTarget);
			resolved = path.sep === "\\" && targetRoot === "\\" ? rawRoot(resolved) : targetRoot;
			targetSegments = rawTarget.slice(targetRoot.length).split(path.sep);
		} else targetSegments = rawTarget.split(path.sep);
		if (targetSegments.length + pendingSuffix.length <= SHIFT_QUEUE_COMPONENT_LIMIT) {
			remaining = pendingSuffix;
			remaining.unshift(...targetSegments);
		} else remaining = targetSegments.concat(pendingSuffix);
		remainingCount = remaining.length;
		shiftQueue = remainingCount <= SHIFT_QUEUE_COMPONENT_LIMIT;
		nextSegment = 0;
	}
	return {
		absolutePath,
		existingPath: realpathSync$1.native(pathForWindowsFilesystem(resolved)),
		unresolvedSegments: []
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-suffix-aliases.js
const MAX_SUFFIX_LENGTH = 8192;
const MAX_PATH_LENGTH = 32768;
const MAX_SUFFIX_DEPTH = 32;
const MAX_MKDIR_ATTEMPTS = 128;
const MAX_CREATED_DIRECTORIES = 64;
const MAX_FORWARD_OBSERVATIONS = 4096;
const MAX_SCALED_FORWARD_OBSERVATIONS = 32768;
const PROBE_NAME_LENGTH = 6;
const PROBE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const PROBE_FIRST_ALPHABET = "bdefghijkmoqrstuvwxyz";
function unavailable() {
	throw new Error("path suffix probe resources or cleanup authority are unavailable");
}
function assertMutationPath(value) {
	if (value.length > MAX_PATH_LENGTH) unavailable();
}
function suffixSegments(value, maxDepth) {
	if (typeof value !== "string") throw new TypeError("suffix must be a string");
	if (value.length > MAX_SUFFIX_LENGTH) throw new RangeError("suffix exceeds 8192 code units");
	if (value.includes("\0") || path.isAbsolute(value)) throw new TypeError("suffix must be a relative path without NUL bytes");
	const windows = process.platform === "win32";
	const segments = (windows ? value.replaceAll("/", "\\") : value).split(path.sep);
	if (segments.length > maxDepth) throw new RangeError(`suffix exceeds ${maxDepth} components`);
	if (segments.some((segment) => !segment || segment === "." || segment === ".." || windows && (segment.includes(":") || /^[ .]+$/u.test(segment) || isWindowsReservedDeviceName(segment)))) throw new TypeError("suffix must contain ordinary relative path components");
	return segments;
}
function areAsciiCaseVariants(left, right) {
	const fold = (value) => value.replace(/[A-Z]/gu, (letter) => String.fromCharCode(letter.charCodeAt(0) + 32));
	return fold(left) === fold(right);
}
function forbiddenNames(leftNfc, rightNfc) {
	const lower = /* @__PURE__ */ new Set([leftNfc.toLowerCase(), rightNfc.toLowerCase()]);
	const upper = /* @__PURE__ */ new Set([leftNfc.toUpperCase(), rightNfc.toUpperCase()]);
	return (candidate) => {
		const normalized = candidate.normalize("NFC");
		return lower.has(normalized.toLowerCase()) || upper.has(normalized.toUpperCase());
	};
}
function* normalizationProbePairs(left, right, forbidden, availableNameLength) {
	const seen = /* @__PURE__ */ new Set();
	const replaceAscii = (value, replacements) => value.replace(/[A-Za-z]/gu, (character) => {
		const lower = character.toLowerCase();
		const replacement = replacements.get(lower);
		return replacement ? character === lower ? replacement : replacement.toUpperCase() : character;
	});
	const mutableAscii = [...new Set(`${left}${right}`.toLowerCase().match(/[a-z]/gu) ?? [])].filter((source) => {
		const replacements = /* @__PURE__ */ new Map([[source, source === "z" ? "y" : "z"]]);
		return areAsciiCaseVariants(replaceAscii(left, replacements).normalize("NFC"), replaceAscii(right, replacements).normalize("NFC"));
	});
	for (let attempt = 0; attempt < 24 && mutableAscii.length > 0; attempt++) {
		const replacements = new Map(mutableAscii.map((source) => [source, String.fromCharCode("a".charCodeAt(0) + randomInt(26))]));
		const first = replaceAscii(left, replacements);
		const second = replaceAscii(right, replacements);
		if (first.length > availableNameLength || second.length > availableNameLength || !areAsciiCaseVariants(first.normalize("NFC"), second.normalize("NFC")) || isWindowsReservedDeviceName(first) || isWindowsReservedDeviceName(second) || forbidden(first) || forbidden(second)) continue;
		const key = `${first}\0${second}`;
		if (!seen.has(key)) {
			seen.add(key);
			yield [first, second];
		}
	}
}
function createPrivateProbeName(nameLength) {
	let name = "";
	for (let index = 0; index < nameLength; index++) {
		const alphabet = index === 0 ? PROBE_FIRST_ALPHABET : PROBE_ALPHABET;
		name += alphabet[randomInt(alphabet.length)];
	}
	return name;
}
function* asciiCaseProbePairs(nameLength, forbidden) {
	for (const first of privateProbeNames(nameLength, forbidden)) yield [first, `${first[0].toUpperCase()}${first.slice(1)}`];
}
function* privateProbeNames(nameLength, forbidden) {
	let count = 0;
	for (let attempt = 0; attempt < 96 && count < 24; attempt++) {
		const name = createPrivateProbeName(nameLength);
		if (!forbidden(name)) {
			count++;
			yield name;
		}
	}
}
function* prependPair(first, remaining) {
	yield first;
	yield* remaining;
}
var ProbeDirectories = class {
	requestedDirectory;
	root;
	created = [];
	cleanupComplete = true;
	observations = 0;
	mkdirAttempts = 0;
	creations = 0;
	maxObservations;
	maxMkdirAttempts;
	maxCreations;
	constructor(requestedDirectory, depth) {
		this.requestedDirectory = requestedDirectory;
		const scale = Math.max(1, depth / MAX_SUFFIX_DEPTH);
		this.maxObservations = Math.min(MAX_SCALED_FORWARD_OBSERVATIONS, MAX_FORWARD_OBSERVATIONS * scale * scale);
		this.maxMkdirAttempts = MAX_MKDIR_ATTEMPTS * scale;
		this.maxCreations = MAX_CREATED_DIRECTORIES * scale;
		this.observe(1);
		const canonical = realpathSync$1.native(pathForWindowsFilesystem(requestedDirectory));
		assertMutationPath(canonical);
		this.observe(2);
		this.root = {
			path: canonical,
			identity: inspectDirectoryIdentitySync(canonical)
		};
		this.assert(this.root);
	}
	reserveObservations(units) {
		if (units > this.maxObservations - this.observations) unavailable();
	}
	observe(units, cleanup = false) {
		if (cleanup) return;
		this.reserveObservations(units);
		this.observations += units;
	}
	assert(directory, cleanup = false) {
		this.observe(1, cleanup);
		if (realpathSync$1.native(pathForWindowsFilesystem(this.requestedDirectory)) !== this.root.path) throw new FsSafeError("path-mismatch", "probe directory changed");
		for (let current = directory; current; current = current.parent) {
			this.observe(2, cleanup);
			assertDirectoryIdentitySync(current.path, current.identity);
		}
	}
	create(parent, name) {
		if (this.mkdirAttempts >= this.maxMkdirAttempts || this.creations >= this.maxCreations) unavailable();
		const probePath = path.join(parent.path, name);
		assertMutationPath(probePath);
		this.assert(parent);
		this.reserveObservations(2);
		this.mkdirAttempts++;
		try {
			fs.mkdirSync(probePath);
		} catch (error) {
			if (hasNodeErrorCode(error, "EEXIST")) return void 0;
			throw error;
		}
		this.creations++;
		this.observe(2);
		const created = {
			path: probePath,
			identity: inspectDirectoryIdentitySync(probePath),
			parent
		};
		this.created.push(created);
		this.assert(created);
		return created;
	}
	remove(created, cleanup = false) {
		try {
			this.assert(created, cleanup);
			assertMutationPath(created.path);
			fs.rmdirSync(created.path);
			return true;
		} catch {
			return false;
		}
	}
	probe(parent, pairs) {
		for (const [first, alternate] of pairs) {
			const alternatePath = path.join(parent.path, alternate);
			assertMutationPath(alternatePath);
			const created = this.create(parent, first);
			if (!created) continue;
			let alias;
			this.observe(2);
			try {
				alias = inspectFileIdentitySync(() => fs.lstatSync(alternatePath, { bigint: true }));
			} catch (error) {
				if (!hasNodeErrorCode(error, "ENOENT")) throw error;
			}
			this.assert(created);
			if (!alias) return {
				aliases: false,
				directory: created
			};
			if (alias.isDirectory() && !alias.isSymbolicLink() && sameFileIdentityForCleanup(created.identity, alias)) return {
				aliases: true,
				directory: created
			};
			if (!this.remove(created)) {
				this.cleanupComplete = false;
				unavailable();
			}
			this.created.splice(this.created.indexOf(created), 1);
		}
	}
	neutral(parent, nameLength, forbidden) {
		for (const name of privateProbeNames(nameLength, forbidden)) {
			const created = this.create(parent, name);
			if (created) return created;
		}
	}
	cleanup() {
		for (let index = this.created.length - 1; index >= 0; index--) if (!this.remove(this.created[index], true)) this.cleanupComplete = false;
		try {
			this.assert(this.root, true);
		} catch {
			this.cleanupComplete = false;
		}
		return this.cleanupComplete;
	}
};
function observeSuffixes(getOwner, leftSegments, rightSegments, shouldProbeCaseVariants) {
	let maxProbePathLength;
	let probeParent;
	for (let index = 0; index < leftSegments.length; index++) {
		const left = leftSegments[index];
		const right = rightSegments[index];
		const normalizedLeft = left.normalize("NFC");
		const normalizedRight = right.normalize("NFC");
		const asciiCaseVariants = areAsciiCaseVariants(normalizedLeft, normalizedRight);
		if (normalizedLeft !== normalizedRight && !asciiCaseVariants && !shouldProbeCaseVariants(normalizedLeft, normalizedRight)) return false;
		const needsNormalization = left !== normalizedLeft || right !== normalizedRight;
		if (normalizedLeft === normalizedRight && !needsNormalization && index === leftSegments.length - 1) continue;
		const owner = getOwner();
		probeParent ??= owner.root;
		maxProbePathLength ??= Math.max(path.join(owner.root.path, leftSegments.join(path.sep)).length, path.join(owner.root.path, rightSegments.join(path.sep)).length);
		const availableNameLength = maxProbePathLength - probeParent.path.length - (probeParent.path.endsWith(path.sep) ? 0 : 1);
		const nameLength = Math.max(1, Math.min(PROBE_NAME_LENGTH, left.length, right.length));
		const forbidden = forbiddenNames(normalizedLeft, normalizedRight);
		let next;
		if (normalizedLeft !== normalizedRight) {
			let caseParent = probeParent;
			let pairs;
			if (asciiCaseVariants) pairs = asciiCaseProbePairs(nameLength, forbidden);
			else {
				const neutral = owner.neutral(probeParent, nameLength, forbidden);
				if (!neutral) return void 0;
				caseParent = neutral;
				pairs = [[left, right]];
			}
			const observed = owner.probe(caseParent, pairs);
			if (!observed) return void 0;
			if (!observed.aliases) return false;
			next = observed.directory;
		}
		if (needsNormalization) {
			const generated = normalizationProbePairs(left, right, forbidden, availableNameLength);
			const first = generated.next();
			let pairs;
			let normalizationParent = probeParent;
			if (first.done) {
				const neutral = owner.neutral(probeParent, nameLength, forbidden);
				if (!neutral) return void 0;
				normalizationParent = neutral;
				pairs = [[left, right]];
			} else pairs = prependPair(first.value, generated);
			const observed = owner.probe(normalizationParent, pairs);
			if (!observed) return void 0;
			if (!observed.aliases) return false;
			next ??= observed.directory;
		}
		if (index < leftSegments.length - 1) {
			next ??= owner.neutral(probeParent, nameLength, forbidden);
			if (!next) return void 0;
			probeParent = next;
		}
	}
	return true;
}
/** Observe bounded missing suffix aliases; the caller owns caching and ambiguity policy. */
function probePathSuffixAliasesSync(options) {
	const requestedDirectory = options.directory;
	if (typeof requestedDirectory !== "string") throw new TypeError("directory must be a string");
	if (requestedDirectory.length > MAX_PATH_LENGTH) throw new RangeError("directory exceeds 32768 code units");
	if (requestedDirectory.includes("\0")) throw new TypeError("directory must be a path without NUL bytes");
	const directory = resolvePathPreservingWindowsRoot(requestedDirectory);
	if (directory.length > MAX_PATH_LENGTH) throw new RangeError("resolved directory exceeds 32768 code units");
	const requestedMaxDepth = options.maxDepth;
	const maxDepth = requestedMaxDepth === void 0 ? MAX_SUFFIX_DEPTH : requestedMaxDepth;
	if (!Number.isSafeInteger(maxDepth) || maxDepth < 0) throw new RangeError("maxDepth must be a non-negative safe integer");
	const leftInput = options.left;
	const rightInput = options.right;
	const predicate = options.shouldProbeCaseVariants;
	const left = suffixSegments(leftInput, maxDepth);
	const right = suffixSegments(rightInput, maxDepth);
	if (left.length !== right.length) throw new TypeError("suffixes must have the same component count");
	if (predicate !== void 0 && typeof predicate !== "function") throw new TypeError("shouldProbeCaseVariants must be a function");
	if (leftInput === rightInput) return true;
	let callbackFailure;
	const shouldProbe = (first, second) => {
		if (!predicate) return true;
		try {
			const result = predicate(first, second);
			if (typeof result !== "boolean") {
				Promise.resolve(result).catch(() => void 0);
				throw new TypeError("shouldProbeCaseVariants must return a boolean synchronously");
			}
			return result;
		} catch (error) {
			callbackFailure = { error };
			throw error;
		}
	};
	let owner;
	let observed;
	let cleaned = true;
	try {
		observed = observeSuffixes(() => owner ??= new ProbeDirectories(directory, left.length), left, right, shouldProbe);
		owner?.assert(owner.root);
	} catch {
		observed = void 0;
		if (callbackFailure) throw callbackFailure.error;
	} finally {
		if (owner) cleaned = owner.cleanup();
	}
	return cleaned ? observed : void 0;
}
//#endregion
//#region packages/normalization-core/src/result.ts
/** Create a successful {@link Result}. */
function ok(value) {
	return {
		ok: true,
		value
	};
}
/** Create a failed {@link Result}. */
function err(error) {
	return {
		ok: false,
		error
	};
}
//#endregion
//#region packages/normalization-core/src/agent-id.ts
const DEFAULT_AGENT_ID = "main";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
function normalizeAgentId(value) {
	const result = normalizeAgentIdStrict(value);
	return result.ok ? result.value : DEFAULT_AGENT_ID;
}
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
function normalizeAgentIdStrict(value) {
	const trimmed = (value ?? "").trim();
	const normalized = trimmed.toLowerCase();
	if (VALID_ID_RE.test(trimmed)) return ok(normalized);
	const agentId = normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
	return agentId ? ok(agentId) : err("unrepresentable");
}
/** Returns whether a value is already a canonical agent-id input. */
function isValidAgentId(value) {
	const trimmed = (value ?? "").trim();
	return Boolean(trimmed) && VALID_ID_RE.test(trimmed);
}
//#endregion
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
const agentSqlitePaths = /* @__PURE__ */ new Map();
const agentSqlitePathKeys = agentSqlitePaths.keys();
function resolveOpenClawAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	if (options.path != null) return path.resolve(options.path);
	const stateDir = resolveStateDir(options.env ?? process.env);
	const cacheKey = `${agentId}:${stateDir}`;
	const cached = agentSqlitePaths.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolved = path.resolve(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
	agentSqlitePaths.set(cacheKey, resolved);
	if (agentSqlitePaths.size > 256) {
		const oldest = agentSqlitePathKeys.next();
		if (!oldest.done) agentSqlitePaths.delete(oldest.value);
	}
	return resolved;
}
/** Resolve the lexical sentinel path used by an agent's memory session owner. */
function resolveIncognitoOpenClawAgentSqlitePath(options) {
	return path.join(path.dirname(resolveOpenClawAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
/** Identify the reserved incognito sentinel without touching its filesystem path. */
function isIncognitoOpenClawAgentSqlitePath(pathname, options) {
	const resolved = path.resolve(pathname);
	return path.basename(resolved) === "incognito-openclaw-agent.sqlite" && resolved === resolveIncognitoOpenClawAgentSqlitePath(options);
}
const missingSuffixAliasCache = /* @__PURE__ */ new Map();
function shouldProbeUnicodeCaseVariants(left, right) {
	const hasNonAscii = (value) => value.split("").some((character) => character.charCodeAt(0) > 127);
	if (!hasNonAscii(left) && !hasNonAscii(right)) return false;
	const lowercaseEquivalent = left.toLowerCase() === right.toLowerCase();
	return left.toUpperCase() === right.toUpperCase() || lowercaseEquivalent && Array.from(left).length === Array.from(right).length;
}
function areMissingSuffixAliases(params) {
	if (params.left === params.right) return true;
	const leftSegments = params.left.split(path.sep);
	const rightSegments = params.right.split(path.sep);
	if (leftSegments.length !== rightSegments.length || [...leftSegments, ...rightSegments].some((segment) => !segment || segment === "." || segment === "..")) return false;
	const suffixPair = [params.left, params.right].toSorted();
	const cacheKey = JSON.stringify([
		params.parentDevice.toString(),
		params.parentInode.toString(),
		params.parentRealPath,
		...suffixPair
	]);
	const cached = missingSuffixAliasCache.get(cacheKey);
	if (cached !== void 0) return cached;
	let aliases;
	let cause;
	try {
		aliases = probePathSuffixAliasesSync({
			directory: params.parentRealPath,
			left: params.left,
			right: params.right,
			maxDepth: leftSegments.length,
			shouldProbeCaseVariants: shouldProbeUnicodeCaseVariants
		});
	} catch (error) {
		cause = error;
	}
	if (aliases === void 0) throw new Error(`Cannot determine whether database paths alias under ${JSON.stringify(params.parentRealPath)}: ${JSON.stringify(params.left)} and ${JSON.stringify(params.right)}. Check directory access and retry.`, { cause });
	missingSuffixAliasCache.set(cacheKey, aliases);
	return aliases;
}
function anchorDatabasePathWithoutNormalizing(pathname) {
	const platformPath = path.sep === "\\" ? pathname.replaceAll("/", "\\") : pathname;
	if (path.isAbsolute(platformPath)) return platformPath;
	if (path.sep === "\\") {
		const driveRelative = /^([A-Za-z]:)(.*)$/u.exec(platformPath);
		if (driveRelative) {
			const driveBase = path.resolve(`${driveRelative[1]}.`);
			return driveRelative[2] ? `${driveBase}${driveBase.endsWith(path.sep) ? "" : path.sep}${driveRelative[2]}` : driveBase;
		}
	}
	const cwd = process.cwd();
	return `${cwd}${cwd.endsWith(path.sep) ? "" : path.sep}${platformPath}`;
}
function resolveAgentDatabasePathIdentity(pathname) {
	const lexicalPath = anchorDatabasePathWithoutNormalizing(pathname);
	try {
		const realPath = realpathSync.native(lexicalPath);
		const stat = statSync(realPath, { bigint: true });
		return {
			lexicalPath,
			realPath,
			device: stat.dev,
			inode: stat.ino
		};
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		const rootPath = path.parse(lexicalPath).root;
		const observed = resolvePathPrefixSync(rootPath + lexicalPath.slice(rootPath.length).split(path.sep).filter(Boolean).join(path.sep));
		const parentRealPath = observed.existingPath;
		const parentStat = statSync(parentRealPath, { bigint: true });
		return {
			lexicalPath,
			parentDevice: parentStat.dev,
			parentInode: parentStat.ino,
			parentRealPath,
			unresolvedSuffix: observed.unresolvedSegments.join(path.sep)
		};
	}
}
function areSameAgentDatabasePathIdentities(leftIdentity, rightIdentity) {
	if (leftIdentity.lexicalPath === rightIdentity.lexicalPath) return true;
	if ("realPath" in leftIdentity) return "realPath" in rightIdentity && (leftIdentity.realPath === rightIdentity.realPath || leftIdentity.device === rightIdentity.device && leftIdentity.inode === rightIdentity.inode);
	return !("realPath" in rightIdentity) && leftIdentity.parentDevice === rightIdentity.parentDevice && leftIdentity.parentInode === rightIdentity.parentInode && areMissingSuffixAliases({
		left: leftIdentity.unresolvedSuffix,
		right: rightIdentity.unresolvedSuffix,
		parentDevice: leftIdentity.parentDevice,
		parentInode: leftIdentity.parentInode,
		parentRealPath: leftIdentity.parentRealPath
	});
}
/** Create a synchronous-operation matcher that prepares each exact locator once. */
function createOpenClawAgentDatabasePathMatcher() {
	const identities = /* @__PURE__ */ new Map();
	const resolveIdentity = (pathname) => {
		const lexicalPath = anchorDatabasePathWithoutNormalizing(pathname);
		const cached = identities.get(lexicalPath);
		if (cached) return cached;
		const identity = resolveAgentDatabasePathIdentity(lexicalPath);
		identities.set(lexicalPath, identity);
		return identity;
	};
	return Object.assign((left, right) => areSameAgentDatabasePathIdentities(resolveIdentity(left), resolveIdentity(right)), {
		createIndex() {
			const keys = /* @__PURE__ */ new Map();
			const groups = [];
			const fileGroups = /* @__PURE__ */ new Map();
			const realPathGroups = /* @__PURE__ */ new Map();
			const missingParentGroups = /* @__PURE__ */ new Map();
			return (pathname) => {
				const identity = resolveIdentity(pathname);
				const cached = keys.get(identity.lexicalPath);
				if (cached !== void 0) return cached;
				let group;
				if ("realPath" in identity) {
					const fileKey = `${identity.device}:${identity.inode}`;
					const fileGroup = fileGroups.get(fileKey);
					const realPathGroup = realPathGroups.get(identity.realPath);
					group = fileGroup === void 0 ? realPathGroup : realPathGroup === void 0 ? fileGroup : Math.min(fileGroup, realPathGroup);
					if (group === void 0) {
						group = groups.push(identity) - 1;
						fileGroups.set(fileKey, group);
						realPathGroups.set(identity.realPath, group);
					}
				} else {
					const parentKey = `${identity.parentDevice}:${identity.parentInode}`;
					const candidates = missingParentGroups.get(parentKey) ?? [];
					group = candidates.find((index) => areSameAgentDatabasePathIdentities(groups[index], identity));
					if (group === void 0) {
						group = groups.push(identity) - 1;
						candidates.push(group);
						missingParentGroups.set(parentKey, candidates);
					}
				}
				const key = groups[group].lexicalPath;
				keys.set(identity.lexicalPath, key);
				return key;
			};
		},
		isCurrent() {
			for (const previous of identities.values()) {
				const current = resolveAgentDatabasePathIdentity(previous.lexicalPath);
				if (!isDeepStrictEqual(previous, current)) return false;
			}
			return true;
		}
	});
}
/** Compare two database locators by canonical filesystem identity when available. */
function isSameOpenClawAgentDatabasePath(left, right) {
	return areSameAgentDatabasePathIdentities(resolveAgentDatabasePathIdentity(left), resolveAgentDatabasePathIdentity(right));
}
function canonicalPathForRegistryBoundary(pathname) {
	const identity = resolveAgentDatabasePathIdentity(pathname);
	if ("realPath" in identity) return identity.realPath;
	const unresolvedSegments = identity.unresolvedSuffix.split(path.sep);
	return unresolvedSegments.includes("..") ? identity.parentRealPath : path.join(identity.parentRealPath, ...unresolvedSegments);
}
/** Named import artifacts are offline archives, not durable runtime discovery state. */
function isPersistentOpenClawAgentDatabasePath(pathname, env = process.env) {
	const lexicalCandidate = path.resolve(pathname);
	const lexicalImportsDir = path.join(path.resolve(resolveStateDir(env)), "imports");
	if (isPathInside(lexicalImportsDir, lexicalCandidate)) return false;
	const candidate = canonicalPathForRegistryBoundary(pathname);
	const stateDir = canonicalPathForRegistryBoundary(resolveStateDir(env));
	const importsDir = canonicalPathForRegistryBoundary(path.join(stateDir, "imports"));
	return !isPathInside(importsDir, candidate);
}
var OpenClawStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `OpenClaw state database schema migration required (${kind}) at ${pathname}; run openclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "OpenClawStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeOpenClawStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
//#region src/bootstrap/node-compiler-args.ts
const COMPILER_FLAGS = /* @__PURE__ */ new Set([
	"--no-maglev",
	"--maglev",
	"--no-concurrent-sparkplug",
	"--concurrent-sparkplug"
]);
/** Forward explicit compiler policy into OpenClaw-owned Node workers. */
function resolveForwardedNodeCompilerArgs(execArgv = process.execArgv) {
	return execArgv.filter((arg) => COMPILER_FLAGS.has(arg.replaceAll("_", "-")));
}
//#endregion
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
function getSpawnBroker() {
	return context.getStore();
}
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = env.NODE_COMPILE_CACHE ?? compileCacheOwner().baseDirectory;
	if (directory && !resolveSafeNodeCompileCacheDirectory(directory)) {
		const disabled = {
			...env,
			NODE_DISABLE_COMPILE_CACHE: "1"
		};
		delete disabled.NODE_COMPILE_CACHE;
		return disabled;
	}
	if (env.NODE_COMPILE_CACHE !== void 0) return env;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
/** Reuse child imports until the lifecycle owner closes; reads reacquire source admission. */
function createSqliteReadOnlyWorkerScope(options) {
	const scope = {
		active: true,
		busy: false,
		controller: new AbortController(),
		pending: /* @__PURE__ */ new Set(),
		deadlineOwnedByCaller: options?.deadlineOwnedByCaller ?? false
	};
	const abort = () => scope.controller.abort(options?.signal.reason);
	options?.signal.addEventListener("abort", abort, { once: true });
	if (options?.signal.aborted) abort();
	let closing;
	return {
		run(operation) {
			return readOnlyWorkerScope.run(scope, operation);
		},
		close() {
			closing ??= (async () => {
				options?.signal.removeEventListener("abort", abort);
				scope.active = false;
				scope.controller.abort(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
				await Promise.allSettled(scope.pending);
				const failures = (await Promise.allSettled([scope.worker?.close(), scope.releaseReadWorker?.()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "SQLite read-only worker scope cleanup failed");
			})();
			return closing;
		}
	};
}
//#endregion
//#region src/infra/shell-inline-command.ts
const POSIX_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	"-lc",
	"-c",
	"--command",
	"--commands",
	"--cmdline"
]);
[...POSIX_INLINE_COMMAND_FLAGS];
function expandPowerShellSwitchPrefixForms(match, smallestMatch) {
	const forms = [];
	for (let length = smallestMatch.length; length <= match.length; length += 1) {
		const prefix = match.slice(0, length);
		forms.push(`-${prefix}`, `--${prefix}`, `/${prefix}`);
	}
	return forms;
}
function expandPowerShellSwitchForms(names) {
	return names.flatMap((name) => {
		const normalized = normalizeLowercaseStringOrEmpty(name);
		return [
			`-${normalized}`,
			`--${normalized}`,
			`/${normalized}`
		];
	});
}
const POWERSHELL_COMMAND_FLAGS = [
	...expandPowerShellSwitchPrefixForms("command", "c"),
	...expandPowerShellSwitchPrefixForms("commandwithargs", "cwa"),
	...expandPowerShellSwitchForms(["cwa"])
];
const POWERSHELL_FILE_FLAGS = expandPowerShellSwitchPrefixForms("file", "f");
const POWERSHELL_INLINE_FILE_FLAGS = new Set(POWERSHELL_FILE_FLAGS);
new Set(expandPowerShellSwitchPrefixForms("noprofile", "nop"));
[
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchForms(["ea"]),
	...expandPowerShellSwitchPrefixForms("interactive", "i"),
	...expandPowerShellSwitchPrefixForms("login", "l"),
	...expandPowerShellSwitchPrefixForms("namedpipeservermode", "nam"),
	...expandPowerShellSwitchPrefixForms("noexit", "noe"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchForms(["pscf"]),
	...expandPowerShellSwitchPrefixForms("servermode", "s"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("socketservermode", "so"),
	...expandPowerShellSwitchPrefixForms("sshservermode", "ssh"),
	...expandPowerShellSwitchPrefixForms("v2socketservermode", "v2so")
];
const POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS = /* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms("encodedcommand", "e"), ...expandPowerShellSwitchPrefixForms("ec", "e")]);
const POWERSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	...POWERSHELL_COMMAND_FLAGS,
	...POWERSHELL_FILE_FLAGS,
	...POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS
]);
const POWERSHELL_INLINE_REST_COMMAND_FLAGS = new Set(POWERSHELL_COMMAND_FLAGS);
const POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchPrefixForms("executionpolicy", "ex"),
	...expandPowerShellSwitchPrefixForms("inputformat", "inp"),
	...expandPowerShellSwitchPrefixForms("outputformat", "o"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("token", "to"),
	...expandPowerShellSwitchPrefixForms("utctimestamp", "utc"),
	...expandPowerShellSwitchPrefixForms("version", "v"),
	...expandPowerShellSwitchPrefixForms("windowstyle", "w"),
	...expandPowerShellSwitchPrefixForms("workingdirectory", "w"),
	...expandPowerShellSwitchForms([
		"ea",
		"ep",
		"if",
		"of",
		"pscf",
		"wd"
	])
]);
const POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"-O",
	"-o",
	"+O",
	"+o"
]);
function countSeparateValueOptionChars(token) {
	let count = 0;
	for (let index = 1; index < token.length; index += 1) {
		const char = token[index];
		if (char === "o" || char === "O") count += 1;
	}
	return count;
}
function parseCombinedCommandFlag(token) {
	if (token.length < 2 || token[0] !== "-" || token[1] === "-") return null;
	const optionChars = token.slice(1);
	const commandFlagIndex = optionChars.indexOf("c");
	if (commandFlagIndex === -1 || optionChars.includes("-")) return null;
	const suffix = optionChars.slice(commandFlagIndex + 1);
	if (suffix && !/^[A-Za-z]+$/.test(suffix)) return {
		attachedCommand: suffix,
		separateValueCount: 0
	};
	return {
		attachedCommand: null,
		separateValueCount: countSeparateValueOptionChars(token)
	};
}
function combinedSeparateValueOptionCount(token) {
	if (token.length < 2 || token[0] !== "-" && token[0] !== "+" || token[1] === "-" || token.slice(1).includes("-")) return 0;
	return countSeparateValueOptionChars(token);
}
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
function advancePosixInlineOptionScan(token) {
	const combinedValueCount = combinedSeparateValueOptionCount(token);
	if (combinedValueCount > 0) return 1 + combinedValueCount;
	if (POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token)) return 2;
	return 1;
}
function isPowerShellOptionToken(token) {
	return token.startsWith("-") || /^\/[A-Za-z][A-Za-z0-9]*$/.test(token);
}
/** Find the inline command payload for a shell wrapper argv. */
function resolveInlineCommandMatch(argv, flags, options = {}) {
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower === "--") break;
		const comparableToken = options.allowCombinedC ? token : lower;
		const exact = flags.has(comparableToken);
		const combined = !exact && options.allowCombinedC ? parseCombinedCommandFlag(token) : null;
		if (exact || combined) {
			if (combined && combined.attachedCommand !== null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const commandIndex = i + 1 + (combined?.separateValueCount ?? 0);
			const valueTokenIndex = !combined && commandIndex >= argv.length ? null : commandIndex;
			const command = exact && options.restValueFlags?.has(comparableToken) ? argv.slice(i + 1).map((arg) => arg.trim()).join(" ").trim() : argv[commandIndex]?.trim();
			return {
				command: command ? command : null,
				valueTokenIndex
			};
		}
		if (options.valueOptions?.has(lower)) {
			i += 2;
			continue;
		}
		const isOptionToken = options.isOptionToken?.(token) ?? (token.startsWith("-") || token.startsWith("+"));
		if (options.stopAtFirstNonOption && !isOptionToken) break;
		if (options.allowCombinedC && !token.startsWith("-") && !token.startsWith("+")) break;
		i += options.allowCombinedC ? advancePosixInlineOptionScan(token) : 1;
	}
	return {
		command: null,
		valueTokenIndex: null
	};
}
/** Find the PowerShell inline command payload and value token index. */
function resolvePowerShellInlineCommandMatch(argv) {
	return resolveInlineCommandMatch(argv, POWERSHELL_INLINE_COMMAND_FLAGS, {
		isOptionToken: isPowerShellOptionToken,
		restValueFlags: POWERSHELL_INLINE_REST_COMMAND_FLAGS,
		stopAtFirstNonOption: true,
		valueOptions: POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES
	});
}
/** Return true when a PowerShell flag treats the next token as script file text. */
function isPowerShellInlineFileCommandFlag(token) {
	return POWERSHELL_INLINE_FILE_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
//#endregion
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
const OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT = [
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
/** Diagnostics attribute the final command without changing the wrapper's execution policy. */
function resolveOomScoreWrappedCommand(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && (args[1] === OOM_SCORE_WRAP_SCRIPT || args[1] === OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT) && args[2] ? args[2] : void 0;
}
//#endregion
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
const childOperation = resolveGlobalSingleton(Symbol.for("openclaw.childSpawnOperation"), () => new AsyncLocalStorage());
function unscopedProcessOperation(family, name, args) {
	if (args[0] === "--version" || args[0] === "-v" && (family === "node" || family === "bun" || name === "gh")) return "unscoped.version";
	if (family === "powershell" || family === "pwsh") {
		const argv = [name, ...args];
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(argv);
		return command !== null && valueTokenIndex !== null && !isPowerShellInlineFileCommandFlag(argv[valueTokenIndex - 1] ?? "") ? "unscoped.shell-command" : "unscoped.shell";
	}
	if (/^(sh|bash|zsh)$/.test(family)) return resolveInlineCommandMatch([name, ...args], POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "cmd") return args.some((arg) => /^-[a-z]*c$/.test(arg) || /^\/(?:c|k)$/i.test(arg)) ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "node" || family === "bun") return "unscoped.runtime";
	if (family === "other" && /^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(name)) return `unscoped.${name}`;
	return "unscoped.command";
}
function unscopedGitOperation(args) {
	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if ([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) i += 2;
		else if (/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(arg)) i++;
		else if ([
			"--no-pager",
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--literal-pathspecs",
			"--bare"
		].includes(arg)) i++;
		else break;
	}
	const command = args[i] ?? "";
	return /^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(command) ? `unscoped.${command}` : command === "--version" || command === "version" ? "unscoped.version" : "unscoped.other";
}
/** Capture attribution before native preparation; record only after a successful launch. */
function prepareChildProcessSpawnRecorder(command, args = [], sqliteOperation) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const wrappedCommand = resolveOomScoreWrappedCommand(command, args);
	const commandArgs = wrappedCommand ? args.slice(3) : args;
	const name = path.win32.basename(wrappedCommand ?? command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? childOperation.getStore() ?? unscopedGitOperation(commandArgs) : sqliteOperation ?? childOperation.getStore() ?? unscopedProcessOperation(family, name, commandArgs);
	const key = `${family}:${operation}`;
	return () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	};
}
/** Count admitted local and broker launches, excluding failed spawn attempts. */
function recordChildProcessSpawn(command, child, sqliteOperation, args = []) {
	const record = prepareChildProcessSpawnRecorder(command, args, sqliteOperation);
	if (record) child.once("spawn", record);
}
//#endregion
//#region src/state/agent-creation-claim.ts
const creationClaim = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaim"), () => new AsyncLocalStorage());
const creationResources = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaimResources"), () => /* @__PURE__ */ new Map());
function getActiveAgentCreationClaim(agentId, statePath) {
	const scope = creationClaim.getStore();
	if (!scope || scope.kind !== "host" || !scope.isActive() || scope.agentId !== normalizeAgentId(agentId) || scope.statePath !== path.resolve(statePath)) return;
	return scope;
}
/** The identity the live creation scope may admit beneath its own completed deletion record. */
function resolveAgentCreationClaimAgentId(claimAgentId, statePath) {
	const scope = creationClaim.getStore();
	if (scope && scope.kind === "worker" && scope.agentId === normalizeAgentId(claimAgentId) && scope.statePath === path.resolve(statePath)) {
		scope.assertCurrent();
		return scope.agentId;
	}
	return getActiveAgentCreationClaim(claimAgentId, statePath)?.agentId;
}
/** The transport carries identity; the retained host scope remains the authority. */
function captureAgentCreationClaim(options) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	return {
		witness: {
			agentId: scope.agentId,
			statePath: scope.statePath
		},
		assertCurrent() {
			if (!scope.isActive() || creationClaim.getStore() !== scope) throw new Error("Agent database belongs to an active agent creation claim.");
		}
	};
}
/** Hold pending native custody until publication hands it to the handle, or disposal succeeds. */
function reserveAgentCreationClaimAdmission(admission, options, close) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	creationResources.set(admission, scope);
	scope.registerClose(async () => {
		if (creationResources.get(admission) !== scope) return;
		await close();
		creationResources.delete(admission);
	});
	return () => {
		creationResources.delete(admission);
	};
}
/** Tag a freshly opened handle as owned by the live creation scope for its identity. */
function registerAgentCreationClaimHandle(database, options) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (scope) creationResources.set(database, scope);
	return scope;
}
/** Refuse a creation-owned handle to every caller outside that same live scope. */
function assertAgentCreationClaimAccess(database, options) {
	assertAgentCreationClaimCurrent(options);
	const owner = creationResources.get(database);
	if (!owner) return;
	if (owner !== getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent database belongs to an active agent creation claim.");
}
/** A retained admission must stop before resuming native work after settlement. */
function assertAgentCreationClaimCurrent(options) {
	const scope = creationClaim.getStore();
	if (scope && scope.kind === "host" && !scope.isActive() && scope.agentId === normalizeAgentId(options.agentId) && scope.statePath === path.resolve(resolveOpenClawStateSqlitePath(options.env ?? process.env))) throw new Error("Agent creation claim is no longer active.");
}
/** A different spelling or state root must not borrow a creation-owned physical store. */
function assertAgentCreationClaimAliases(options) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of creationResources.keys()) if (isSameOpenClawAgentDatabasePath(owned.path, pathname)) assertAgentCreationClaimAccess(owned, options);
}
/** Release the tag once the native owner has closed the handle. */
function releaseAgentCreationClaimHandle(database) {
	creationResources.delete(database);
}
//#endregion
//#region src/state/agent-database-admission-error.ts
/** A database owner refused new work; an admitted command's failure is never classified here. */
const AgentDatabaseExecutionAdmissionClosedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionAdmissionClosedError"), () => class AdmissionClosedError extends Error {});
/** A receipt lost its publication race; fresh admission can obtain current proof. */
const AgentDatabaseSchemaAdmissionChangedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionChangedError"), () => class SchemaAdmissionChangedError extends Error {
	constructor() {
		super("Agent schema admission changed before publication; retry the operation");
	}
});
const AgentDatabaseSchemaAdmissionInvalidError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionInvalidError"), () => class SchemaAdmissionInvalidError extends Error {
	constructor() {
		super("Invalid agent schema admission receipt");
	}
});
//#endregion
//#region src/state/agent-deletion-cleanup.ts
const databaseCleanup = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanup"), () => new AsyncLocalStorage());
const cleanupHandles = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupHandles"), () => /* @__PURE__ */ new Map());
const cleanupExecutions = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupExecutions"), () => /* @__PURE__ */ new Map());
function getAgentDeletionDatabaseCleanup(params) {
	const scope = databaseCleanup.getStore();
	if (!scope) return;
	const pathname = resolveOpenClawAgentSqlitePath(params);
	if (scope.agentId !== normalizeAgentId(params.agentId) || scope.path !== pathname && scope.canonicalPath !== pathname) return;
	const statePath = params.statePath ?? resolveOpenClawStateSqlitePath(params.env ?? process.env);
	if (scope.statePath !== path.resolve(statePath)) throw new Error("Agent deletion database cleanup belongs to another state database.");
	return scope;
}
/** Resource registration captures only the cleanup scope that admitted this target. */
function captureAgentDeletionResourceOwner(matches) {
	const scope = databaseCleanup.getStore();
	if (!scope?.ownsDatabase || !matches(scope) && (!scope.canonicalPath || !matches({
		agentId: scope.agentId,
		path: scope.canonicalPath
	}))) return;
	scope.assertCurrentHost();
	return scope;
}
function assertAgentDeletionDatabaseCleanupAccess(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	const owner = cleanupHandles.get(database);
	if (owner && owner !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
	scope?.assertCurrent();
}
function assertAgentDeletionCleanupAliases(options, isSamePath) {
	const pathname = resolveOpenClawAgentSqlitePath(options);
	for (const owned of cleanupHandles.keys()) if (isSamePath(owned.path, pathname)) assertAgentDeletionDatabaseCleanupAccess(owned, options);
	for (const scope of cleanupExecutions.values()) if (isSamePath(scope.path, pathname) && getAgentDeletionDatabaseCleanup(options) !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
}
function assertAgentDeletionExecutionCleanupAccess(execution, options) {
	const owner = cleanupExecutions.get(execution);
	const scope = getAgentDeletionDatabaseCleanup(options);
	if (owner && owner !== scope) throw new Error("Agent database belongs to an active deletion cleanup.");
	scope?.assertCurrentHost();
}
/** Only a newly created executor belongs to cleanup; borrowing never transfers ownership. */
function registerAgentDeletionExecutionCleanup(execution, options, close) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	if (!scope?.worker || !scope.ownsDatabase) return;
	scope.assertCurrentHost();
	if (cleanupExecutions.get(execution) === scope) return;
	cleanupExecutions.set(execution, scope);
	scope.registerClose(async () => {
		await close();
		cleanupExecutions.delete(execution);
	});
}
function registerAgentDeletionDatabaseCleanup(database, options) {
	const scope = getAgentDeletionDatabaseCleanup(options);
	scope?.assertCurrent();
	if (!scope?.ownsDatabase || scope.workerOwned) return;
	cleanupHandles.set(database, scope);
	return scope;
}
/** Release the tag only after the native owner has closed and released its lease. */
function releaseAgentDeletionDatabaseCleanup(database) {
	cleanupHandles.delete(database);
}
//#endregion
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Map()
}));
registerAgentDatabaseReaderCloser(async (candidates, retainedPaths) => {
	const errors = (await Promise.allSettled([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => !retainedPaths?.has(path.resolve(resource.path)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.path))).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Agent database resource cleanup failed");
});
function matchesAgentDatabaseClose(selection, resource) {
	return (selection.path === void 0 || selection.path === resource.path || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.path)) && (selection.rootPath === void 0 || isPathInside(selection.rootPath, resource.path) || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.rootPath)) && (selection.agentId === void 0 || resource.ownership === "unresolved" || selection.agentId === resource.agentId);
}
/** Register before admitting a Worker; revocation is synchronous, native drainage is joined. */
function registerOpenClawAgentDatabaseAsyncResource(resource, creationOptions) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId)
	}, creationOptions);
}
/** Native readers close synchronously, so successful retirement leaves no asynchronous barrier. */
function registerOpenClawAgentDatabaseSyncResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "known",
		agentId: normalizeAgentId(resource.agentId),
		close: async () => resource.close(),
		closeSync: resource.close
	});
}
/** Retain discovery until the known owner is registered, then release this candidate. */
function registerOpenClawAgentDatabaseReadCandidateResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "unresolved"
	});
}
function registerAgentDatabaseResource(resource, creationOptions) {
	const owned = {
		...resource,
		path: path.resolve(resource.path)
	};
	owned.cleanupOwner = captureAgentDeletionResourceOwner((target) => matchesAgentDatabaseClose(target, owned));
	assertAgentDatabaseResourceAdmission(owned);
	const releaseCreation = creationOptions && owned.ownership === "known" ? reserveAgentCreationClaimAdmission(owned, creationOptions, () => closeAgentDatabaseResource(owned)) : void 0;
	const unregister = () => {
		resources.active.delete(owned);
		releaseCreation?.();
	};
	getOpenClawDatabaseMaintenanceScope()?.own(unregister, "agent-resources", () => closeAgentDatabaseResource(owned));
	resources.active.add(owned);
	return unregister;
}
/** Fresh native opens and resource registrations share the same close custody. */
function assertAgentDatabaseResourceAdmission(owned) {
	if ([...resources.selections.keys()].some((selection) => matchesAgentDatabaseClose(selection, owned)) || [...resources.closing.keys()].some((closing) => (closing.path === owned.path || closing.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(closing, owned.path) || owned.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(owned, closing.path)) && (closing.ownership === "unresolved" || owned.ownership === "unresolved" || closing.agentId === owned.agentId))) throw new AgentDatabaseExecutionAdmissionClosedError(`Agent database resources are closing: ${owned.path}`);
}
function closeAgentDatabaseResource(resource, onCloseError) {
	if (resource.ownership === "known" && resource.closeSync) {
		resources.closing.set(resource, void 0);
		try {
			resource.revoke();
			resource.closeSync();
			resources.active.delete(resource);
			resources.closing.delete(resource);
			return Promise.resolve();
		} catch (error) {
			if (onCloseError) onCloseError(resource.path, error);
			const failed = Promise.reject(toErrorObject(error, "Agent database cleanup failed"));
			failed.catch(() => {});
			return failed;
		}
	}
	let operation = resources.closing.get(resource);
	if (!operation) {
		operation = Promise.resolve().then(() => resource.close());
		resources.closing.set(resource, operation);
		operation.then(() => {
			resources.active.delete(resource);
			resources.closing.delete(resource);
		}, () => {
			resources.closing.set(resource, void 0);
		}).catch(() => {});
	}
	if (onCloseError) operation.catch((error) => onCloseError(resource.path, error)).catch(() => {});
	resource.revoke();
	return operation;
}
function revokeAgentDatabaseResources(selection, onCloseError) {
	const closing = /* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()]);
	const pending = [];
	for (const resource of closing) {
		if (!matchesAgentDatabaseClose(selection, resource)) continue;
		pending.push(closeAgentDatabaseResource(resource, onCloseError));
	}
	return pending;
}
async function drainAgentDatabaseResources(selection, closeNative, cleanupOwner) {
	return withAgentDatabaseCloseFence(selection, async () => {
		const selected = [.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => matchesAgentDatabaseClose(selection, resource) && (!cleanupOwner || resource.cleanupOwner === cleanupOwner));
		const nativeOwners = selected.filter((resource) => resource.retireAfterResources);
		for (const resource of nativeOwners) {
			if (!resources.closing.has(resource)) resources.closing.set(resource, void 0);
			resource.revoke();
		}
		const errors = (await Promise.allSettled(selected.filter((resource) => !resource.retireAfterResources).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length > 0) throw new AggregateError(errors, "Agent database resource drainage failed");
		const nativeErrors = (await Promise.allSettled(nativeOwners.map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (nativeErrors.length > 0) throw new AggregateError(nativeErrors, "Agent database native retirement failed");
		return closeNative();
	});
}
/** Keep the complete selection fenced while its physical databases retire independently. */
async function withAgentDatabaseCloseFence(selection, close) {
	const ownedSelection = { ...selection };
	const completion = createDeferredCore();
	completion.promise.catch(() => {});
	resources.selections.set(ownedSelection, completion.promise);
	try {
		const result = await close([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => matchesAgentDatabaseClose(ownedSelection, resource)).map((resource) => resource.path));
		completion.resolve();
		return result;
	} catch (error) {
		completion.reject(error);
		throw error;
	} finally {
		resources.selections.delete(ownedSelection);
	}
}
//#endregion
//#region src/infra/sqlite-readonly-worker-session.ts
function isSameSqliteReadOnlyWorkerLaunch(captured, requested) {
	const keys = Object.keys(requested.env);
	return captured.runtimeGeneration === requested.runtimeGeneration && captured.transport.kind === requested.transport.kind && (captured.transport.kind === "native" || requested.transport.kind === "broker" && captured.transport.owner === requested.transport.owner) && requested.cwd === captured.cwd && keys.length === Object.keys(captured.env).length && keys.every((key) => requested.env[key] === captured.env[key]);
}
function createSqliteReadOnlyWorkerSession(host) {
	const env = { ...host.env };
	const cwd = host.cwd;
	const executable = process.execPath;
	const transport = host.transport.kind === "broker" ? {
		kind: "broker",
		owner: host.transport.owner
	} : { kind: "native" };
	const capturedLaunch = {
		env,
		cwd,
		transport,
		runtimeGeneration: host.runtimeGeneration
	};
	const argv = [...host.argv];
	const spawnOptions = {
		env,
		...transport.kind === "native" && cwd === tryProcessCwd() ? {} : { cwd },
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		],
		windowsHide: true
	};
	const child = transport.kind === "broker" ? transport.owner.spawn(executable, argv, spawnOptions) : spawn(executable, argv, spawnOptions);
	recordChildProcessSpawn(executable, child, host.pooledRead ? `sqlite.scoped-read.${transport.kind}` : `sqlite.session.${transport.kind}`);
	const setIdle = (idle) => {
		if (transport.kind !== "native") return;
		const method = idle ? "unref" : "ref";
		child[method]();
		child.channel?.[method]?.();
		for (const stream of [child.stdout, child.stderr]) if (stream instanceof Socket) stream[method]();
	};
	let retired = false;
	let sequence = 0;
	let pendingOperation;
	let stderr = "";
	let outputBytes = 0;
	let pending;
	const { promise: closeSignal, resolve: resolveClosed } = createDeferredCore();
	const authReaderResources = /* @__PURE__ */ new Map();
	const closed = closeSignal.then(async () => {
		if (transport.kind === "broker" && child instanceof BrokerChild && !child.notStarted && child.exitCode === null && child.signalCode === null) await transport.owner.waitForCleanup();
		for (const unregister of authReaderResources.values()) unregister();
		authReaderResources.clear();
	});
	const retire = (error) => {
		setIdle(false);
		retired = true;
		if (pending && error !== void 0) pending.failure ??= error;
		child.kill("SIGKILL");
	};
	const sendMessage = (message) => child.send(message, (error) => {
		if (error) retire(error);
	});
	const releasePending = (request) => {
		pending = void 0;
		pendingOperation = void 0;
		request.cleanup();
		if (host.pooledRead) {
			for (const unregister of authReaderResources.values()) unregister();
			authReaderResources.clear();
		}
		return request;
	};
	if (host.retainLifetime !== false) retainSnapshotWork(closed, () => retire(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
	let spawned = false;
	let nativeClosed = false;
	child.once("spawn", () => {
		spawned = true;
	});
	child.on("error", (error) => retire(spawned ? error : Object.assign(new Error([[
		"EACCES",
		"ENOENT",
		"EPERM"
	].includes(error.code ?? "") ? `SQLite read-only worker runtime binary not executable: ${executable} (${error.code}, cwd ${cwd}). Check runtime execute permissions and access to the working directory` : `SQLite read-only worker failed to start (executable ${executable}, cwd ${cwd})`, error.message].join(": "), { cause: error }), { code: error.code })));
	child.once("close", (code, signal) => {
		nativeClosed = true;
		retired = true;
		if (pending) {
			const request = releasePending(pending);
			request.reject(request.failure ?? createSqliteReadOnlyWorkerError(`exited with ${signal ? `signal ${signal}` : `code ${code}`}`, stderr));
		}
		resolveClosed();
	});
	const captureOutput = (data, isStderr) => {
		outputBytes += data.length;
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -SQLITE_READONLY_STDERR_TAIL_CHARS);
		if (outputBytes > 1048576) retire(createSqliteReadOnlyWorkerError("exceeded its output buffer", stderr));
	};
	const attachOutput = () => {
		child.stdout?.on("data", (data) => captureOutput(data, false));
		child.stderr?.on("data", (data) => captureOutput(data, true));
	};
	const ready = child instanceof BrokerChild ? child.ready().then(attachOutput).catch(retire) : void 0;
	if (!ready) attachOutput();
	child.on("message", (message) => {
		if (retired) return;
		if (!pending || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || message.id !== pending.id || !("result" in message)) {
			retire(createSqliteReadOnlyWorkerError("returned an unexpected response", stderr));
			return;
		}
		try {
			let value;
			if (pending.transfer && !(typeof message.result === "object" && message.result !== null && "ok" in message.result && message.result.ok === false)) {
				const reply = pending.transfer.accept(message.result);
				if ("request" in reply) {
					sendMessage({
						id: pending.id,
						transfer: reply.request
					});
					return;
				}
				value = reply.value;
			} else value = readSqliteReadOnlyWorkerValue({
				kind: "launched",
				stdout: JSON.stringify(message.result),
				stderr,
				status: 0
			}, pending.mode);
			releasePending(pending).resolve(value);
		} catch (error) {
			if (pending && host.retainOnOperationError && isSqliteSnapshotStagingMode(pending.mode) && isSqliteReadOnlyWorkerResult(message.result) && !message.result.ok) {
				releasePending(pending).reject(error);
				return;
			}
			retire(error);
		}
	});
	const session = {
		closed,
		isRetired() {
			return retired;
		},
		get notStarted() {
			return child instanceof BrokerChild ? child.notStarted : nativeClosed && !spawned;
		},
		createNativeReplacement() {
			return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
				...host,
				env,
				cwd,
				argv,
				transport: { kind: "native" }
			}));
		},
		compatible(launch) {
			return !retired && isSameSqliteReadOnlyWorkerLaunch(capturedLaunch, launch);
		},
		run(pathname, options) {
			if (retired) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker is closed"));
			if (options.mode === "auth-profile-rows" && options.source === "canonical" && !options.artifactPreserving) {
				const databasePath = path.resolve(pathname);
				if (!authReaderResources.has(databasePath)) authReaderResources.set(databasePath, registerOpenClawAgentDatabaseReadCandidateResource({
					path: databasePath,
					revoke: () => retire(/* @__PURE__ */ new Error("Auth profile reader owner was revoked")),
					close: () => session.close()
				}));
			}
			return pendingOperation = new Promise((resolve, reject) => {
				const { timeoutMs, size } = host.readBudget(pathname);
				stderr = "";
				outputBytes = 0;
				const abort = () => retire(options.signal?.reason);
				const timer = host.deadlineOwnedByCaller() ? void 0 : setTimeout(() => retire(host.timeoutError(pathname, timeoutMs, size)), timeoutMs);
				const id = ++sequence;
				pending = {
					id,
					mode: options.mode,
					...options.mode === "auth-profile-rows" ? { transfer: createSqliteAuthTransferReceiver() } : options.mode === "operation" ? { transfer: createSqliteOperationTransferReceiver(options.command.type) } : {},
					resolve,
					reject,
					cleanup: () => {
						clearTimeout(timer);
						options.signal?.removeEventListener("abort", abort);
					}
				};
				options.signal?.addEventListener("abort", abort, { once: true });
				if (options.signal?.aborted) {
					abort();
					return;
				}
				const send = () => {
					if (retired) return;
					try {
						const request = {
							id,
							args: host.requestArgs(pathname, options),
							...options.mode === "auth-profile-rows" || options.mode === "operation" ? { [options.mode === "operation" ? "operation" : "auth"]: {
								expectedIdentity: options.expectedIdentity,
								artifactPreserving: options.artifactPreserving,
								...options.mode === "operation" ? { command: serialize(options.command).toString("base64") } : {
									retainReader: !host.pooledRead && options.source === "canonical" && !options.artifactPreserving,
									schema: options.source === "canonical" && !options.artifactPreserving ? captureSqliteAuthSchema(pathname, options.expectedIdentity) : void 0
								}
							} } : {}
						};
						if (options.mode === "operation" && Buffer.byteLength(JSON.stringify(request)) > 1048576) throw new Error("SQLite read-only operation exceeded its request buffer");
						sendMessage(request);
					} catch (error) {
						retire(error);
					}
				};
				if (ready) ready.then(send);
				else send();
			});
		},
		setIdle,
		async close() {
			session.setIdle(false);
			if (retired) {
				await closed;
				return;
			}
			retired = true;
			const timer = setTimeout(() => retire(), host.closeTimeoutMs);
			try {
				sendMessage("close");
			} catch (error) {
				retire(error);
			}
			try {
				await closed;
			} finally {
				clearTimeout(timer);
			}
		}
	};
	host.runtimeGeneration?.retain(session, async () => {
		await pendingOperation?.catch(() => void 0);
		return () => session.close();
	});
	return session;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-pool.ts
const log$1 = createSubsystemLogger("state/sqlite");
function trackSqliteRead(options) {
	return trackWorkerRequest("sqlite_read", classifyWorkerRequest(options.mode === "operation" ? options.command.type : options.mode), options.signal);
}
function createSqliteReadOnlyWorkerPool(createSession) {
	const scopedReadWorkers = [];
	const SCOPED_READ_WORKER_LIMIT = 4;
	const SCOPED_READ_WORKER_IDLE_MS = 6e4;
	const statefulReadWorkers = /* @__PURE__ */ new WeakMap();
	const readWorkerReleaseWaiters = /* @__PURE__ */ new Set();
	const closingBrokers = /* @__PURE__ */ new WeakSet();
	const assertBrokerOpen = (launch) => {
		if (launch.transport.kind === "broker" && closingBrokers.has(launch.transport.owner)) throw new Error("SQLite read-only worker broker is closing");
	};
	async function closeSlot(slot) {
		const worker = slot.session;
		try {
			await worker?.close();
			slot.session = void 0;
		} catch (error) {
			slot.quarantined = { error };
			for (const released of readWorkerReleaseWaiters) released();
			throw error;
		}
	}
	async function selectScopedReadWorker(options, launch) {
		assertBrokerOpen(launch);
		const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
		const scope = readOnlyWorkerScope.getStore();
		if (stateful) {
			if (!scope?.active) throw new Error("Database page-cache warm requires an active read-only worker scope");
			const retained = statefulReadWorkers.get(scope);
			if (retained) {
				if (!isSameSqliteReadOnlyWorkerLaunch(retained.launch, launch)) throw new Error("Database page-cache warm worker launch changed during its scope");
				return retained;
			}
			if (options.command.type === "pageCache.step") throw new Error("Database page-cache warm is no longer active");
		}
		for (;;) {
			assertBrokerOpen(launch);
			options.signal?.throwIfAborted();
			const available = scopedReadWorkers.filter((candidate) => !candidate.leased && !candidate.quarantined);
			let slot = available.find((candidate) => isSameSqliteReadOnlyWorkerLaunch(candidate.launch, launch));
			if (!slot && scopedReadWorkers.length < SCOPED_READ_WORKER_LIMIT) {
				slot = {
					launch,
					tail: Promise.resolve(),
					queued: 0
				};
				scopedReadWorkers.push(slot);
			}
			slot ??= available.find((candidate) => candidate.queued === 0 && !candidate.session);
			slot ??= available.reduce((best, candidate) => !best || candidate.queued < best.queued ? candidate : best, void 0);
			if (slot) {
				if (stateful && scope) {
					const retained = slot;
					const lease = { started: false };
					retained.leased = lease;
					statefulReadWorkers.set(scope, retained);
					scope.releaseReadWorker = async () => {
						try {
							if (lease.started) {
								await retained.tail;
								await closeSlot(retained);
							}
						} finally {
							retained.leased = void 0;
							statefulReadWorkers.delete(scope);
							scope.releaseReadWorker = void 0;
							if (!retained.quarantined && retained.queued === 0 && retained.session && !retained.session.isRetired()) {
								retained.session.setIdle(true);
								armScopedReadWorkerIdle(retained);
							}
							for (const released of readWorkerReleaseWaiters) released();
						}
					};
				}
				return slot;
			}
			if (scopedReadWorkers.every((candidate) => candidate.quarantined)) throw new AggregateError(scopedReadWorkers.map((candidate) => candidate.quarantined?.error), "SQLite read-only worker capacity is held by unconfirmed cleanup");
			let released;
			const availableWorker = runInDetachedAsyncContext(() => new Promise((resolve) => {
				released = resolve;
			}));
			readWorkerReleaseWaiters.add(released);
			try {
				await racePromiseWithAbortSignal(availableWorker, options.signal, (signal) => signal.reason);
			} finally {
				readWorkerReleaseWaiters.delete(released);
			}
		}
	}
	function retireIdleSlot(slot) {
		clearTimeout(slot.idle);
		const closing = runInDetachedAsyncContext(() => closeSlot(slot));
		slot.tail = closing.catch(() => {
			log$1.warn("Idle SQLite read-only worker cleanup failed");
		});
		return closing;
	}
	function armScopedReadWorkerIdle(slot) {
		if (slot.launch.transport.kind === "broker" && closingBrokers.has(slot.launch.transport.owner)) {
			retireIdleSlot(slot);
			return;
		}
		slot.idle = runInDetachedAsyncContext(() => setTimeout(() => {
			retireIdleSlot(slot);
		}, SCOPED_READ_WORKER_IDLE_MS));
		slot.idle.unref();
	}
	return {
		run: async function runSqliteScopedReadWorker(pathname, options, launch, observation = trackSqliteRead(options)) {
			const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
			let selected;
			try {
				selected = await selectScopedReadWorker(options, launch);
				assertBrokerOpen(launch);
			} catch (error) {
				observation.completed();
				throw error;
			}
			clearTimeout(selected.idle);
			selected.queued++;
			const previous = selected.tail;
			const operation = runInDetachedAsyncContext(() => racePromiseWithAbortSignal(previous, options.signal, (signal) => signal.reason)).then(async () => {
				options.signal?.throwIfAborted();
				if (selected.quarantined) throw selected.quarantined.error;
				observation.started();
				if (selected.leased && options.mode === "operation" && options.command.type === "pageCache.begin") selected.leased.started = true;
				if (!isSameSqliteReadOnlyWorkerLaunch(selected.launch, launch) || selected.session?.isRetired()) await closeSlot(selected);
				options.signal?.throwIfAborted();
				selected.launch = launch;
				const worker = selected.session ??= createSession({
					...launch,
					pooledRead: true
				});
				worker.setIdle(false);
				try {
					const value = await worker.run(pathname, options);
					options.signal?.throwIfAborted();
					if (!stateful && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) await closeSlot(selected);
					return value;
				} catch (error) {
					try {
						await closeSlot(selected);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite read and child cleanup failed", error);
					}
					throw error;
				}
			}).finally(() => {
				observation.completed();
				selected.queued--;
				if (!selected.leased && !selected.quarantined && selected.queued === 0 && selected.session && !selected.session.isRetired()) {
					selected.session?.setIdle(true);
					armScopedReadWorkerIdle(selected);
				}
			});
			selected.tail = runInDetachedAsyncContext(() => Promise.allSettled([previous, operation]).then(() => {}));
			return operation;
		},
		async closeBroker(broker) {
			closingBrokers.add(broker);
			const failures = (await Promise.allSettled(scopedReadWorkers.filter((slot) => slot.launch.transport.kind === "broker" && slot.launch.transport.owner === broker && slot.session && slot.queued === 0 && !slot.leased && !slot.quarantined).map(retireIdleSlot))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (failures.length) throw new AggregateError(failures, "SQLite read-only broker worker cleanup failed");
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fs.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fs.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
async function withSqliteReadOnlyWorkerScope(operation, options) {
	if (!options && readOnlyWorkerScope.getStore()?.active) return operation();
	const scope = createSqliteReadOnlyWorkerScope(options);
	try {
		return await scope.run(operation);
	} finally {
		await scope.close();
	}
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function resolveSqliteInspectionSignal(signal) {
	const scope = readOnlyWorkerScope.getStore();
	return scope ? signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal : signal;
}
/** Bind a one-shot inspection to the active scope's cancellation and close join. */
function runScopedSqliteInspection(signal, inspect) {
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return inspect(signal);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const operation = inspect(signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal);
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl(options.mode === "content-version" || options.mode === "file-generation" ? "sqliteSourceRevision" : "sqliteReadOnly"));
	return {
		runtimeGeneration,
		argv: [
			...resolveForwardedNodeCompilerArgs(),
			...resolveRuntimeWorkerArgv(moduleUrl),
			SQLITE_READONLY_CHILD_ARG,
			...sqliteReadOnlyWorkerRequestArgs(pathname, options)
		]
	};
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === void 0 ? void 0 : getSpawnBroker();
	return {
		runtimeGeneration: captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnly")).runtimeGeneration,
		env: {
			...resolveNodeCompileCacheEnv(env),
			OPENCLAW_STATE_DIR: resolveStateDir(env)
		},
		cwd: tryProcessCwd() ?? tmpdir(),
		transport: broker ? {
			kind: "broker",
			owner: broker
		} : { kind: "native" }
	};
}
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("sqliteReadOnly");
	return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
		...launch,
		argv: [
			...resolveRuntimeWorkerArgv(launch.runtimeGeneration?.resolve(workerUrl) ?? workerUrl),
			SQLITE_READONLY_CHILD_ARG,
			"session"
		],
		requestArgs: sqliteReadOnlyWorkerRequestArgs,
		readBudget: (pathname) => readSqliteInspectionBudget("read-only snapshot", pathname),
		deadlineOwnedByCaller: launch.retainLifetime === false ? () => false : isSqliteInspectionDeadlineOwnedByCaller,
		timeoutError: (pathname, timeoutMs, size) => sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size),
		closeTimeoutMs: SQLITE_INSPECTION_TIMEOUT_MS
	}));
}
/** Reuse a caller-owned native session without creating a canonical-read broker. */
async function runScopedSqliteReadOnlyOperation(worker, pathname, command, options) {
	const capturedCommand = structuredClone(command);
	const result = await worker.run(pathname, {
		...options,
		mode: "operation",
		command: capturedCommand
	});
	return readOperationResult(capturedCommand.type, result);
}
function readOperationResult(type, result) {
	if (typeof result !== "object" || !("operation" in result) || result.operation !== type) throw new Error("SQLite read-only worker returned a different operation");
	return result.value;
}
function runSqliteReadOnlyWorker(pathname, inputOptions) {
	const options = (inputOptions.mode === "auth-profile-rows" || inputOptions.mode === "operation") && isArtifactPreservingStateRead("agent", pathname) ? {
		...inputOptions,
		artifactPreserving: true
	} : inputOptions;
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	return runScopedSqliteInspection(options.signal, (signal) => {
		const scope = readOnlyWorkerScope.getStore();
		if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
		const scopedOptions = {
			...options,
			signal
		};
		const useScopedWorker = options.mode === "sync" && !scope.busy;
		if (useScopedWorker) scope.busy = true;
		if (scopedOptions.mode === "auth-profile-rows" || scopedOptions.mode === "operation") {
			const launch = captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source);
			return sqliteReadOnlyWorkerPool.run(pathname, scopedOptions, launch);
		}
		return (async () => {
			if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
			try {
				const launch = captureSqliteReadOnlyWorkerLaunch();
				if (!scope.worker?.compatible(launch)) {
					await scope.worker?.close();
					scopedOptions.signal?.throwIfAborted();
					scope.worker = createScopedSqliteReadOnlyWorker(launch);
				}
				return await scope.worker.run(pathname, scopedOptions);
			} finally {
				scope.busy = false;
			}
		})();
	});
}
const sqliteReadOnlyWorkerPool = createSqliteReadOnlyWorkerPool(createScopedSqliteReadOnlyWorker);
function runSqliteReadOnlyWorkerOnce(pathname, options, launch) {
	if (options.mode === "auth-profile-rows" || options.mode === "operation") return sqliteReadOnlyWorkerPool.run(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
	const reclaim = options.mode === "reclaim";
	const { argv, runtimeGeneration } = sqliteReadOnlyWorkerArgv(pathname, options);
	return runOneShotSqliteInspection({
		pathname,
		operation: reclaim ? "reclamation" : "read-only snapshot",
		argv,
		runtimeGeneration,
		signal: options.signal,
		deadlineOwnedByCaller: !reclaim && (launch?.deadlineOwnedByCaller ?? isSqliteInspectionDeadlineOwnedByCaller()),
		deadlineStopsOwner: reclaim,
		env: launch?.env,
		cwd: launch?.cwd,
		stoppedFailure: "snapshot owner stopped",
		...reclaim ? { interrupt: (child) => child.stdin?.end() } : {},
		read: (output, deadlineReached) => {
			if (reclaim) {
				const warnings = readSqliteReadOnlyWorkerValue(output, "reclaim");
				if (deadlineReached) {
					const { timeoutMs, size } = readSqliteInspectionBudget("reclamation", pathname);
					warnings.push(sqliteInspectionTimeoutError("reclamation", pathname, timeoutMs, size).message);
				}
				return warnings;
			}
			options.signal?.throwIfAborted();
			return readSqliteReadOnlyWorkerValue(output, options.mode);
		}
	});
}
function runOneShotSqliteInspection(params) {
	const { timeoutMs, size } = readSqliteInspectionBudget(params.operation, params.pathname);
	return new Promise((resolve, reject) => {
		let output = {
			kind: "launched",
			stderr: "",
			stdout: "",
			status: null
		};
		let stopped = false;
		let deadlineReached = false;
		const child = execFile(process.execPath, params.argv, {
			encoding: "utf8",
			windowsHide: true,
			env: params.env ?? resolveNodeCompileCacheEnv(),
			cwd: params.cwd,
			maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
			timeout: params.deadlineStopsOwner || params.deadlineOwnedByCaller ? void 0 : timeoutMs,
			killSignal: "SIGKILL"
		}, (error, stdout, stderr) => {
			const timedOut = error?.killed && error.signal === "SIGKILL" && error.code == null;
			if (timedOut) deadlineReached = true;
			output = {
				kind: "launched",
				status: child.exitCode,
				failure: error ? stopped ? params.stoppedFailure : timedOut ? sqliteInspectionTimeoutError(params.operation, params.pathname, timeoutMs, size).message : `exited unsuccessfully: ${error.message}` : void 0,
				stderr,
				stdout,
				cause: error ?? void 0
			};
		});
		const interrupt = () => {
			if (params.interrupt) params.interrupt(child);
			else child.kill("SIGKILL");
		};
		const abort = () => {
			if (!stopped) {
				stopped = true;
				interrupt();
			}
		};
		const timer = params.deadlineStopsOwner ? setTimeout(() => {
			deadlineReached = true;
			stopped = true;
			interrupt();
		}, timeoutMs) : void 0;
		const closed = retainSnapshotWork(new Promise((resolveClosed) => {
			child.once("close", () => resolveClosed());
		}), abort);
		params.runtimeGeneration?.retain(child, async () => {
			await closed;
		});
		params.signal?.addEventListener("abort", abort, { once: true });
		if (params.signal?.aborted) abort();
		child.once("close", () => {
			clearTimeout(timer);
			params.signal?.removeEventListener("abort", abort);
			try {
				resolve(params.read(output, deadlineReached));
			} catch (workerError) {
				reject(workerError instanceof Error ? workerError : new Error(String(workerError)));
			}
		});
	});
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot, mode = "sync") {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const started = log.isEnabled("trace") ? performance$1.now() : void 0;
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode,
		stagingRoot
	}).argv, {
		encoding: "utf8",
		windowsHide: true,
		stdio: "pipe",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	if (started !== void 0) log.trace(`SQLite read-only snapshot child durationMs=${performance$1.now() - started}`);
	const output = result.error ? {
		kind: "launch-failed",
		error: new Error(hasNodeErrorCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `SQLite read-only worker failed to start for ${pathname}: ${result.error.message}`, { cause: result.error })
	} : {
		kind: "launched",
		stdout: result.stdout,
		stderr: result.stderr,
		status: result.status,
		failure: result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`
	};
	return readSqliteReadOnlyWorkerValue(output, mode);
}
//#endregion
//#region src/state/openclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "OpenClawQuarantineReadCleanupError";
const OpenClawQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("openclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "OpenClaw quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/openclaw-state-db-failure.ts
const failurePaths = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseFailurePaths"), () => /* @__PURE__ */ new WeakMap());
/** Preserve the terminal admission owner's path through worker error transport. */
function markOpenClawStateDatabaseFailure(error, pathname) {
	failurePaths.set(error, pathname);
}
function readOpenClawStateDatabaseFailurePath(error) {
	return failurePaths.get(error);
}
/** Cleanup aggregates must retain the original refusal without attributing unrelated errors. */
function findOpenClawStateDatabaseFailure(error, pathname) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const current of pending) {
		if (!(current instanceof Error) || seen.has(current)) continue;
		seen.add(current);
		if (failurePaths.get(current) === pathname) return current;
		pending.push(current.cause);
		if (current instanceof AggregateError) pending.push(...current.errors);
	}
}
//#endregion
//#region src/agents/agent-create-error.ts
var DuplicateAgentError = class extends Error {};
//#endregion
//#region src/agents/auth-profiles/store-unreadable-error.ts
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(databasePath) {
		super(`Auth profile store ${shortenHomePath(databasePath)} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.databasePath = databasePath;
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
//#endregion
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
//#endregion
//#region src/agents/workspace-state-identity.ts
const WORKSPACE_ALIAS_REPOINTED_ERROR_CODE = "WORKSPACE_ALIAS_REPOINTED";
var WorkspaceAliasRepointedError = class extends Error {
	constructor(params) {
		super(`workspace path alias points to a different current target: ${params.aliasPath} now resolves to ${params.currentWorkspacePath}, but its stored workspace state belongs to ${params.storedWorkspacePath}. Run \`openclaw doctor --fix\` and confirm the move, or use \`openclaw doctor --fix --force\`.`);
		this.code = WORKSPACE_ALIAS_REPOINTED_ERROR_CODE;
		this.name = "WorkspaceAliasRepointedError";
		this.aliasPath = params.aliasPath;
		this.storedWorkspacePath = params.storedWorkspacePath;
		this.currentWorkspacePath = params.currentWorkspacePath;
	}
};
//#endregion
//#region src/agents/worktrees/errors.ts
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message, blockedByRun) {
		super(message);
		this.kind = kind;
		this.blockedByRun = blockedByRun;
		this.name = "WorktreeRemovalContentionError";
	}
};
var WorktreeRemovalLockError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalLockError";
	}
};
var SessionWorktreeSourceChangedError = class extends Error {};
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
//#endregion
//#region src/config/sessions/goals-operations.types.ts
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
//#endregion
//#region src/config/sessions/session-canonical-key-error.ts
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run openclaw doctor --fix`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
//#endregion
//#region src/config/sessions/session-mutation-conflict-error.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.operationLabel = operationLabel;
		this.name = "SqliteSessionMutationConflictError";
	}
};
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
//#endregion
//#region src/config/sessions/session-transcript-read-fence-error.ts
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
//#endregion
//#region src/config/sessions/session-transcript-writer-claim-error.ts
function isRedactedIdentifier(value) {
	return typeof value === "string" && /^(?:-|sha256:[0-9a-f]{12})$/.test(value);
}
/** Transport only the refusal owner's redacted identifiers, never incidental cause fields. */
function parseTranscriptAppendRefusal(value) {
	if (!isRecord(value) || !isRedactedIdentifier(value.agentIdHash) || !isRedactedIdentifier(value.expectedSessionIdHash) || !isRedactedIdentifier(value.sessionKeyHash)) return;
	const identity = {
		agentIdHash: value.agentIdHash,
		expectedSessionIdHash: value.expectedSessionIdHash,
		sessionKeyHash: value.sessionKeyHash
	};
	if (value.code === "session-entry-missing") return {
		...identity,
		code: value.code
	};
	if (value.code === "session-rebound" && isRedactedIdentifier(value.actualSessionIdHash)) return {
		...identity,
		code: value.code,
		actualSessionIdHash: value.actualSessionIdHash
	};
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(cause) {
		super("session writer claim changed before transcript persistence", { cause });
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
//#endregion
//#region src/gateway/model-account-connect-errors.ts
var ModelAccountConnectAuthorityError = class extends Error {
	constructor() {
		super("This account action requires a current authorized connection; reconnect and try again.");
	}
};
//#endregion
//#region src/gateway/worker-environments/session-attachment.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
	constructor(sessionId, environmentId) {
		super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
		this.sessionId = sessionId;
		this.environmentId = environmentId;
	}
};
//#endregion
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-state-error-cause.ts
function capturePluginStateErrorCause(value, encodeCanonical, seen = /* @__PURE__ */ new Set()) {
	if (value === void 0) return;
	const canonical = encodeCanonical?.(value);
	if (canonical) return { canonical };
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return {
		name: "Error",
		message: String(value)
	};
	if (typeof value !== "object") return {
		name: "Error",
		message: "Unknown SQLite error cause"
	};
	if (seen.has(value) || seen.size >= 8) return {
		name: "Error",
		message: "Additional SQLite error cause omitted"
	};
	seen.add(value);
	const name = "name" in value && typeof value.name === "string" ? value.name : "Error";
	const message = "message" in value && typeof value.message === "string" ? value.message : name;
	const code = "code" in value ? value.code : void 0;
	const errcode = "errcode" in value ? value.errcode : void 0;
	const errno = "errno" in value ? value.errno : void 0;
	return {
		name,
		message,
		...typeof code === "string" || typeof code === "number" ? { errorCode: code } : {},
		...typeof errcode === "number" ? { errcode } : {},
		...typeof errno === "number" ? { errno } : {},
		..."cause" in value ? { cause: capturePluginStateErrorCause(value.cause, encodeCanonical, seen) } : {},
		...value instanceof AggregateError ? { errors: value.errors.slice(0, 8).map((error) => capturePluginStateErrorCause(error, encodeCanonical, seen)) } : {}
	};
}
//#endregion
//#region src/plugin-state/plugin-state-error.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		this.owner = options.owner ?? {
			pid: process.pid,
			threadId,
			version: VERSION
		};
		if (options.path) this.path = options.path;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			operation: this.operation,
			path: this.path,
			owner: this.owner,
			cause: capturePluginStateErrorCause(this.cause)
		};
	}
};
//#endregion
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
//#endregion
//#region src/sessions/model-selection-error.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
/** Retains the caller-visible refusal across the database worker boundary. */
var ModelSelectionLockedError = class extends Error {
	constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
		super(message);
		this.name = "ModelSelectionLockedError";
	}
};
//#endregion
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/skills/skill-library-error.ts
var SkillLibraryError = class extends Error {
	constructor(code, message, currentRevision, options) {
		super(message, options);
		this.code = code;
		this.currentRevision = currentRevision;
		this.name = "SkillLibraryError";
	}
};
//#endregion
//#region src/state/openclaw-agent-db-migration-required.ts
var OpenClawAgentDatabaseMediaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(pathname, schemaVersion) {
		super("agent-media", `OpenClaw agent database ${pathname} uses schema version ${schemaVersion}; run openclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.name = "OpenClawAgentDatabaseMediaMigrationRequiredError";
	}
};
//#endregion
//#region src/state/openclaw-state-lease-error.ts
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
//#endregion
//#region src/state/session-metadata-unavailable-error.ts
var SessionMetadataUnavailableError = class extends Error {
	constructor(reason, options, missingTables = []) {
		super(`Session metadata unavailable (${[reason, ...missingTables].join(": ")}); retry after the agent store is ready.`, options);
		this.reason = reason;
		this.missingTables = missingTables;
		this.name = "SessionMetadataUnavailableError";
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
const MESSAGE_ONLY_ERRORS = {
	"worktree-source-changed": SessionWorktreeSourceChangedError,
	"model-account-authority": ModelAccountConnectAuthorityError,
	"duplicate-agent": DuplicateAgentError,
	"model-selection-locked": ModelSelectionLockedError,
	"session-canonical-key-migration": SessionCanonicalKeyMigrationRequiredError,
	"session-pending-input-custody": SessionPendingInputCustodyError,
	"session-transcript-read-fence": SessionTranscriptReadFenceError,
	"skill-upload-request": SkillUploadRequestError,
	coordinator: SqliteCoordinatorError,
	ownership: OpenClawStateOwnershipError,
	"newer-schema": SqliteSchemaVersionError,
	"range-error": RangeError,
	"syntax-error": SyntaxError,
	"type-error": TypeError
};
function isMessageOnlyErrorIdentity(node) {
	return typeof node.type === "string" && Object.hasOwn(MESSAGE_ONLY_ERRORS, node.type);
}
function identifyError(error) {
	if (error instanceof AuthProfileStoreUnreadableError) return {
		type: "auth-profile-store-unreadable",
		databasePath: error.databasePath
	};
	if (error instanceof SessionWorktreeLifecycleError && error.reason === "owner-mismatch") return { type: "session-worktree-owner-mismatch" };
	if (error instanceof WorktreeRemovalContentionError) return {
		type: "worktree-removal-contention",
		kind: error.kind,
		...error.blockedByRun ? { blockedByRun: {
			worktreeId: error.blockedByRun.worktreeId,
			pid: error.blockedByRun.pid
		} } : {}
	};
	if (error instanceof WorktreeRemovalLockError) return {
		type: "worktree-removal-lock",
		kind: error.kind
	};
	if (error instanceof PluginStateStoreError) return {
		type: "plugin-state",
		stateCode: error.code,
		operation: error.operation,
		path: error.path,
		owner: {
			pid: error.owner.pid,
			threadId: error.owner.threadId,
			version: error.owner.version
		}
	};
	if (error instanceof SkillLibraryError) return {
		type: "skill-library",
		libraryCode: error.code,
		...error.currentRevision === void 0 ? {} : { currentRevision: error.currentRevision }
	};
	if (error instanceof SecretStoreValidationError) return {
		type: "secret-store-validation",
		secretCode: error.code
	};
	if (error instanceof WorkerSessionAlreadyAttachedError) return {
		type: "worker-session-already-attached",
		sessionId: error.sessionId,
		environmentId: error.environmentId
	};
	if (error instanceof PluginBlobStoreError) return {
		type: "plugin-blob",
		blobCode: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path }
	};
	if (error instanceof WorkspaceAliasRepointedError) return {
		type: "workspace-alias-repointed",
		aliasPath: error.aliasPath,
		storedWorkspacePath: error.storedWorkspacePath,
		currentWorkspacePath: error.currentWorkspacePath
	};
	if (error instanceof McpOAuthStoreCorruptionError) return { type: "mcp-oauth-corruption" };
	if (error instanceof SessionGoalOperationError) return {
		type: "session-goal-operation",
		goalCode: error.code
	};
	if (error instanceof SessionEntryLifecycleUpsertConflictError) return {
		type: "session-lifecycle-upsert-conflict",
		sessionKey: error.sessionKey
	};
	if (error instanceof SessionTranscriptWriterClaimReboundError) {
		const refusal = parseTranscriptAppendRefusal(error.cause);
		return {
			type: "session-transcript-writer-claim-rebound",
			...refusal ? { refusal } : {}
		};
	}
	if (error instanceof SqliteSessionMutationConflictError) return {
		type: "session-mutation-conflict",
		operationLabel: error.operationLabel
	};
	if (error instanceof SqliteTranscriptMutationConflictError) return {
		type: "session-transcript-mutation-conflict",
		sessionId: error.sessionId
	};
	if (error instanceof SessionMetadataUnavailableError) return {
		type: "session-metadata",
		reason: error.reason,
		missingTables: [...error.missingTables]
	};
	if (error instanceof GatewayStateOwnerContentionError) return {
		type: "state-owner-contention",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateLeaseError) return {
		type: "state-lease",
		leaseCode: error.code
	};
	if (error instanceof OpenClawStateOwnershipMetadataError) return {
		type: "ownership-metadata",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateExternalOwnershipError) return {
		type: "external-ownership",
		databasePath: error.databasePath,
		managerId: error.managerId
	};
	if (error instanceof OpenClawStateDatabaseSchemaMigrationRequiredError) return {
		type: "state-migration",
		kind: error.kind,
		pathname: error.pathname
	};
	if (error instanceof OpenClawAgentDatabaseMediaMigrationRequiredError) return {
		type: "agent-media-migration",
		pathname: error.pathname,
		schemaVersion: error.schemaVersion
	};
	for (const [type, ErrorType] of Object.entries(MESSAGE_ONLY_ERRORS)) if (error instanceof ErrorType) return { type };
	if (error instanceof StartupMaintenanceRequiredError) return {
		type: "maintenance",
		kind: error.kind
	};
	return { type: error instanceof AggregateError ? "aggregate" : "error" };
}
function unreachableErrorNode(node) {
	throw new Error(`Unexpected shared-state worker error node: ${String(node)}`);
}
function createError(node) {
	if (isMessageOnlyErrorIdentity(node)) {
		const ErrorType = MESSAGE_ONLY_ERRORS[node.type];
		return new ErrorType(node.message);
	}
	switch (node.type) {
		case "session-worktree-owner-mismatch": return new SessionWorktreeLifecycleError(node.message, "owner-mismatch");
		case "worktree-removal-contention": return new WorktreeRemovalContentionError(node.kind, node.message, node.blockedByRun);
		case "worktree-removal-lock": return new WorktreeRemovalLockError(node.kind, node.message);
		case "plugin-state": return new PluginStateStoreError(node.message, {
			code: node.stateCode,
			operation: node.operation,
			path: node.path,
			owner: node.owner
		});
		case "skill-library": return new SkillLibraryError(node.libraryCode, node.message, node.currentRevision);
		case "secret-store-validation": return new SecretStoreValidationError(node.secretCode, node.message);
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-goal-operation": return new SessionGoalOperationError(node.goalCode, node.message);
		case "session-lifecycle-upsert-conflict": return new SessionEntryLifecycleUpsertConflictError(node.sessionKey);
		case "session-mutation-conflict": return new SqliteSessionMutationConflictError(node.operationLabel);
		case "session-transcript-mutation-conflict": return new SqliteTranscriptMutationConflictError(node.sessionId);
		case "session-transcript-writer-claim-rebound": return new SessionTranscriptWriterClaimReboundError(node.refusal);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "auth-profile-store-unreadable": return new AuthProfileStoreUnreadableError(node.databasePath);
		case "state-owner-contention": return new GatewayStateOwnerContentionError(node.databasePath);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "plugin-blob": return new PluginBlobStoreError(node.message, {
			code: node.blobCode,
			operation: node.operation,
			...node.path === void 0 ? {} : { path: node.path }
		});
		case "state-lease": return new OpenClawStateLeaseError(node.message, { code: node.leaseCode });
		case "maintenance": return new StartupMaintenanceRequiredError(node.kind, node.message);
		case "state-migration": return new OpenClawStateDatabaseSchemaMigrationRequiredError(node.kind, node.pathname);
		case "agent-media-migration": return new OpenClawAgentDatabaseMediaMigrationRequiredError(node.pathname, node.schemaVersion);
	}
	return unreachableErrorNode(node);
}
//#endregion
//#region src/state/openclaw-state-worker-error.ts
function isScalar(value) {
	return value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isNativeErrorCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
}
function encodeOpenClawStateWorkerError(error, options = {}) {
	if (!(error instanceof Error)) return;
	const nodes = [];
	const errors = [];
	const references = /* @__PURE__ */ new Map();
	let canonical = false;
	const encodeValue = (value) => {
		if (!(value instanceof Error)) return isScalar(value) ? { value } : { undefined: true };
		const known = references.get(value);
		if (known !== void 0) return { ref: known };
		const ref = errors.length;
		references.set(value, ref);
		errors.push(value);
		return { ref };
	};
	try {
		encodeValue(error);
		for (const current of errors) {
			const { name, message } = current;
			if (typeof name !== "string" || typeof message !== "string") return;
			const identity = identifyError(current);
			if (Object.entries(identity).some(([key, value]) => {
				return (key === "owner" || key === "blockedByRun" || key === "refusal" ? Object.values(value) : key === "missingTables" && Array.isArray(value) ? value : [value]).some((field) => field !== void 0 && !isScalar(field));
			})) return;
			const nativeOpen = isSqliteNativeOpenFailure(current);
			const stateDatabasePath = readOpenClawStateDatabaseFailurePath(current);
			const errcode = "errcode" in current ? current.errcode : void 0;
			canonical ||= stateDatabasePath !== void 0 || nativeOpen || isNativeErrorCode(errcode) || isSqliteLockError(current) || current instanceof OpenClawQuarantineReadCleanupError || identity.type !== "error" && identity.type !== "aggregate";
			const code = "code" in current ? current.code : void 0;
			const errno = "errno" in current ? current.errno : void 0;
			nodes.push({
				...identity,
				name,
				message,
				...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {},
				...isNativeErrorCode(errcode) ? { errcode } : {},
				...typeof errno === "number" && Number.isInteger(errno) ? { errno } : {},
				...nativeOpen ? { nativeOpen: true } : {},
				...stateDatabasePath === void 0 ? {} : { stateDatabasePath },
				..."cause" in current && !(identity.type === "session-transcript-writer-claim-rebound" && identity.refusal) ? { cause: encodeValue(current.cause) } : {},
				...current instanceof AggregateError ? { errors: current.errors.map(encodeValue) } : {}
			});
		}
		return canonical || options.includeOrdinary === true ? {
			version: 1,
			root: 0,
			nodes
		} : void 0;
	} catch {
		return;
	}
}
function decodeErrorGraph(value, options) {
	try {
		if (value.version !== 1) return;
		const nodes = value.nodes;
		if (options.includeOrdinary !== true && !nodes.some((node) => node.stateDatabasePath !== void 0 || node.nativeOpen === true || isNativeErrorCode(node.errcode) || isSqliteLockError(node) || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate")) return;
		const errors = nodes.map(createError);
		const decodeValue = (entry) => "ref" in entry ? errors[entry.ref] : "value" in entry ? entry.value : void 0;
		for (const [index, node] of nodes.entries()) {
			const error = errors[index];
			error.name = node.name;
			error.message = node.message;
			if (node.nativeOpen) markSqliteNativeOpenFailure(error);
			if (node.stateDatabasePath !== void 0) markOpenClawStateDatabaseFailure(error, node.stateDatabasePath);
			for (const [key, propertyValue] of Object.entries({
				...node.code !== void 0 ? { code: node.code } : {},
				...node.errcode !== void 0 ? { errcode: node.errcode } : {},
				...node.errno !== void 0 ? { errno: node.errno } : {},
				...node.cause ? { cause: decodeValue(node.cause) } : {}
			})) Object.defineProperty(error, key, {
				value: propertyValue,
				configurable: true,
				writable: true
			});
			if (error instanceof AggregateError) error.errors = (node.errors ?? []).map(decodeValue);
		}
		return {
			errors,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloads = resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerErrorPayloads"), () => /* @__PURE__ */ new WeakMap());
/** Keep the closed wire graph until the receiving caller hydrates it. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	if (payload) retainedPayloads.set(error, payload);
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const replacements = /* @__PURE__ */ new Map();
	const pending = [{
		error: value,
		finish: false
	}];
	const replace = (child) => child instanceof Error ? replacements.get(child) ?? child : child;
	while (pending.length > 0) {
		const entry = pending.pop();
		const { error } = entry;
		if (!entry.finish) {
			if (replacements.has(error)) continue;
			replacements.set(error, error);
			const payload = retainedPayloads.get(error);
			const graph = payload === void 0 ? void 0 : decodeErrorGraph(payload, options);
			if (graph) {
				replacements.set(error, graph.errors[graph.root]);
				continue;
			}
			pending.push({
				error,
				finish: true
			});
			if (error.cause instanceof Error) pending.push({
				error: error.cause,
				finish: false
			});
			if (error instanceof AggregateError) {
				for (const child of error.errors) if (child instanceof Error) pending.push({
					error: child,
					finish: false
				});
			}
			continue;
		}
		const cause = replace(error.cause);
		const originalErrors = error instanceof AggregateError ? error.errors : void 0;
		const errors = originalErrors?.map(replace);
		if (cause === error.cause && (!errors || errors.every((child, index) => child === originalErrors?.[index]))) continue;
		const replacement = error instanceof AggregateError ? new AggregateError([], error.message) : new Error(error.message);
		Object.setPrototypeOf(replacement, Object.getPrototypeOf(error));
		const descriptors = Object.getOwnPropertyDescriptors(error);
		if ("cause" in error) descriptors.cause = {
			configurable: true,
			writable: true,
			...descriptors.cause,
			value: cause
		};
		if (errors) descriptors.errors = {
			configurable: true,
			writable: true,
			...descriptors.errors,
			value: errors
		};
		Object.defineProperties(replacement, descriptors);
		replacements.set(error, replacement);
	}
	return replacements.get(value);
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.client.ts
/** Host-port framing; the staging owner alone admits readers and retires directories. */
function createSqliteReadOnlyNativeResourceConnection(callbacks) {
	const { port1, port2 } = new MessageChannel();
	const owner = { disposed: false };
	const receive = (request) => {
		let reply;
		try {
			callbacks.receive(request, owner);
			reply = {
				id: request.id,
				ok: true
			};
		} catch (error) {
			const encoded = encodeOpenClawStateWorkerError(error, { includeOrdinary: true });
			if (!encoded) throw error;
			reply = {
				id: request.id,
				ok: false,
				error: encoded
			};
		}
		port1.postMessage(reply);
	};
	const fail = (error) => {
		callbacks.onFailure(error);
		port1.close();
	};
	const onMessage = (value) => {
		try {
			receive(value);
		} catch (error) {
			fail(error);
		}
	};
	port1.on("message", onMessage);
	port1.on("messageerror", fail);
	return {
		port: port2,
		service() {
			if (owner.disposed) return;
			for (;;) {
				const next = receiveMessageOnPort(port1);
				if (!next) return;
				try {
					receive(next.message);
				} catch (error) {
					fail(error);
					throw error;
				}
			}
		},
		decodeCloseError(payload) {
			const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
			retainOpenClawStateWorkerErrorPayload(remote, payload);
			const error = hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
			return error instanceof AggregateError ? error : new SqliteSnapshotCleanupError(error.message, { cause: error });
		},
		dispose() {
			owner.disposed = true;
			callbacks.onDispose(owner);
			port1.removeAllListeners();
			port1.close();
			port2.close();
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-native-resource.types.ts
const SQLITE_NATIVE_RESOURCE_PORT = "sqliteSnapshotNativeResource";
//#endregion
//#region src/infra/sqlite-snapshot-staging-error.ts
function decodeSqliteSnapshotStagingError(payload) {
	const remote = /* @__PURE__ */ new Error("SQLite snapshot staging failed");
	retainOpenClawStateWorkerErrorPayload(remote, payload);
	return hydrateOpenClawStateWorkerError(remote, { includeOrdinary: true });
}
//#endregion
//#region src/infra/sqlite-snapshot-staging-owner.ts
function completed() {
	const retained = createRetainedOperation(() => {});
	retained.resolve(void 0);
	return retained.operation;
}
/** The existing staging owner retains its child; this transport only moves its event loop. */
function createStagingOwner(workerUrl, nativeSource) {
	const nativeResource = nativeSource.captureResource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnlyNativeResource"), SQLITE_NATIVE_RESOURCE_PORT, void 0, connectNativeResource);
	const pool = createOwnedWorkerTaskPool({
		workerUrl,
		workerClass: "writer",
		idleTimeoutMs: 0,
		maxPendingTasks: 128,
		maxPendingBytes: DEFAULT_WORKER_PENDING_BYTES
	}, {
		retainedTransport: true,
		nativeSource,
		nativeResource,
		databaseAccess: "read-only",
		decodeResourceError: (payload) => decodeSqliteSnapshotStagingError(payload)
	});
	const directories = /* @__PURE__ */ new Map();
	const preparations = /* @__PURE__ */ new Map();
	let preparationSequence = 0;
	const activeRequests = /* @__PURE__ */ new Set();
	let servicingRequests = false;
	let requests = 0;
	let admissionClosed = false;
	let idleClose;
	let unavailable;
	function connectNativeResource() {
		return createSqliteReadOnlyNativeResourceConnection({
			receive(value) {
				const directory = value.directory;
				if (value.type === "allocated") {
					const preparation = preparations.get(value.preparationId);
					if (!preparation) throw new SqliteSnapshotCleanupError("SQLite snapshot preparation custody is unavailable");
					preparation.directories.add(directory);
					retainDirectory(directory, value.preparationId);
				} else if (value.type === "retire") {
					if (!directories.has(directory)) throw new SqliteSnapshotCleanupError("SQLite snapshot native custody is unavailable");
					sealRetainedSnapshotTempDirectory(directory, { requireRequested: true });
				}
			},
			onFailure(error) {
				unavailable ??= { error };
			},
			onDispose() {}
		});
	}
	const serviceRequests = () => {
		if (servicingRequests) return;
		servicingRequests = true;
		try {
			for (const request of activeRequests) request.service();
			for (const preparation of Array.from(preparations.values())) preparation.serviceClose();
		} finally {
			servicingRequests = false;
		}
	};
	const closeWhenIdle = () => {
		if (idleClose?.read().status === "pending") return idleClose;
		if (requests > 0 || directories.size > 0) return completed();
		return idleClose = mapRetainedOperation(flatMapRetainedOperation(pool.startCloseResources(), () => requests > 0 || directories.size > 0 ? completed() : pool.startRotate()), () => {
			unavailable = void 0;
		});
	};
	const retainDirectory = (directory, preparationId) => {
		const existing = directories.get(directory);
		if (existing) return existing;
		let pending;
		const startRetire = () => {
			if (pending && pending.read().status !== "rejected") return pending;
			try {
				sealRetainedSnapshotTempDirectory(directory);
			} catch (error) {
				const refused = createRetainedOperation(() => {});
				refused.reject(error);
				return refused.operation;
			}
			return pending = flatMapRetainedOperation(pool.startCloseResources(directory), () => {
				directories.delete(directory);
				if (preparationId !== void 0) {
					const preparation = preparations.get(preparationId);
					preparation?.directories.delete(directory);
					preparation?.releaseIfComplete();
				}
				return closeWhenIdle();
			});
		};
		const owned = {
			directory,
			startRetire
		};
		directories.set(directory, owned);
		registerRetainedSnapshotTempDirectory(directory, startRetire);
		return owned;
	};
	const start = (command, signal) => {
		if (admissionClosed) throw new Error("SQLite snapshot staging owner is closing");
		const preparationId = ++preparationSequence;
		const inputBytes = Buffer.byteLength(JSON.stringify({
			...command,
			preparationId
		}));
		const cancellation = command.type === "prepare" ? new MessageChannel() : void 0;
		const abort = () => {
			if (cancellation) {
				cancellation.port1.postMessage({ type: "abort" });
				recordWorkerMessage("resource", "to_worker");
			}
		};
		const input = command.type === "prepare" && cancellation ? {
			...command,
			preparationId,
			abortPort: cancellation.port2
		} : {
			...command,
			preparationId
		};
		requests++;
		let pendingClose;
		const preparation = {
			directories: /* @__PURE__ */ new Set(),
			abort() {
				if (task.read().status === "pending") abort();
			},
			startClose,
			serviceClose: () => pendingClose?.service(),
			releaseIfComplete() {
				if (request?.read().status !== "pending" && preparation.directories.size === 0) preparations.delete(preparationId);
			}
		};
		preparations.set(preparationId, preparation);
		let task;
		try {
			task = pool.startTask(() => {
				if (unavailable !== void 0) throw unavailable.error;
				signal?.throwIfAborted();
				signal?.addEventListener("abort", abort, { once: true });
				return input;
			}, {
				inputBytes,
				transferList: () => cancellation ? [cancellation.port2] : []
			});
		} catch (error) {
			const refused = createRetainedOperation(() => {});
			refused.reject(error);
			task = {
				...refused.operation,
				release: completed
			};
		}
		let release;
		const result = mapRetainedOperation(task, (reply) => {
			if (reply.type === "failed") {
				const error = decodeSqliteSnapshotStagingError(reply.error);
				throw reply.cleanupFailure && !(error instanceof AggregateError) ? new SqliteSnapshotCleanupError(String(error), { cause: error }) : error;
			}
			return reply;
		});
		const request = finallyRetainedOperation(result, () => release = finallyRetainedOperation(task.release(), () => {
			signal?.removeEventListener("abort", abort);
			cancellation?.port1.close();
			cancellation?.port2.close();
			requests--;
			return closeWhenIdle();
		}), (error, cleanupError) => createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot staging failed", error));
		function startClose() {
			if (pendingClose?.read().status === "pending") return pendingClose;
			let removals;
			let servicing = false;
			const closing = createRetainedOperation(() => {
				if (servicing || closing.operation.read().status !== "pending") return;
				servicing = true;
				try {
					serviceRequests();
					request.service();
					if (request.read().status === "pending") return;
					removals ??= [...preparation.directories].map((directory) => {
						const removal = startRemoveTempDirectory(directory);
						removal.result.then(() => closing.operation.service(), () => closing.operation.service());
						return [directory, removal];
					});
					for (const [directory, removal] of removals) {
						removal.service();
						const outcome = removal.read();
						if (outcome.status === "pending") return;
						if (outcome.status === "rejected") throw outcome.error;
						if (!outcome.value) throw new SqliteSnapshotCleanupError(`SQLite staging preparation cleanup failed: ${directory}`);
					}
					const released = release?.read();
					if (released?.status === "rejected") throw released.error;
					preparation.releaseIfComplete();
					closing.resolve(void 0);
				} catch (error) {
					closing.reject(error);
				} finally {
					servicing = false;
				}
			});
			pendingClose = closing.operation;
			request.result.then(() => closing.operation.service(), () => closing.operation.service());
			closing.operation.service();
			return closing.operation;
		}
		const finish = () => {
			activeRequests.delete(request);
			preparation.releaseIfComplete();
		};
		request.result.then(finish, finish);
		if (request.read().status === "pending") activeRequests.add(request);
		else finish();
		return {
			...request,
			service: serviceRequests,
			startClose
		};
	};
	const owner = {
		start,
		retainDirectory
	};
	nativeSource.retain(owner, async () => {
		admissionClosed = true;
		for (const preparation of preparations.values()) preparation.abort();
		await Promise.allSettled([...activeRequests].map((request) => request.result));
		const closures = Array.from(preparations.values()).map((preparation) => preparation.startClose());
		const failures = (await Promise.allSettled(closures.map((close) => close.result))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
		if (failures.length) throw createSqliteLifecycleAggregateError(failures, "SQLite snapshot generation cleanup failed", failures[0]);
		await closeWhenIdle().result;
		await pool.close();
	});
	return owner;
}
function captureSqliteSnapshotStagingOwner() {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteSnapshotStaging"));
	const nativeSource = captureRetainedNativeWorkerSource({ runtimeGeneration });
	const owners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotStagingOwner"), () => /* @__PURE__ */ new WeakMap());
	let owner = owners.get(nativeSource);
	if (!owner) {
		owner = runInDetachedAsyncContext(() => createStagingOwner(moduleUrl, nativeSource));
		owners.set(nativeSource, owner);
	}
	return owner;
}
//#endregion
export { isValidAgentId as $, registerAgentDeletionExecutionCleanup as A, releaseAgentCreationClaimHandle as B, registerOpenClawAgentDatabaseSyncResource as C, assertAgentDeletionExecutionCleanupAccess as D, assertAgentDeletionDatabaseCleanupAccess as E, assertAgentCreationClaimAccess as F, normalizeOpenClawStateSchemaReadError as G, resolveAgentCreationClaimAgentId as H, assertAgentCreationClaimAliases as I, isIncognitoOpenClawAgentSqlitePath as J, INCOGNITO_AGENT_SQLITE_BASENAME as K, assertAgentCreationClaimCurrent as L, AgentDatabaseExecutionAdmissionClosedError as M, AgentDatabaseSchemaAdmissionChangedError as N, getAgentDeletionDatabaseCleanup as O, AgentDatabaseSchemaAdmissionInvalidError as P, resolveOpenClawAgentSqlitePath as Q, captureAgentCreationClaim as R, registerOpenClawAgentDatabaseAsyncResource as S, assertAgentDeletionCleanupAliases as T, resolveNodeCompileCacheEnv as U, reserveAgentCreationClaimAdmission as V, OpenClawStateDatabaseSchemaMigrationRequiredError as W, isSameOpenClawAgentDatabasePath as X, isPersistentOpenClawAgentDatabasePath as Y, resolveIncognitoOpenClawAgentSqlitePath as Z, sqliteInspectionTimeoutError as _, OpenClawAgentDatabaseMediaMigrationRequiredError as a, drainAgentDatabaseResources as b, OpenClawQuarantineReadCleanupError as c, isSqliteInspectionDeadlineOwnedByCaller as d, normalizeAgentId as et, readSqliteInspectionBudget as f, runSqliteReadOnlyWorkerSync as g, runSqliteReadOnlyWorker as h, SessionMetadataUnavailableError as i, releaseAgentDeletionDatabaseCleanup as j, registerAgentDeletionDatabaseCleanup as k, captureSqliteReadOnlyWorkerLaunch as l, runScopedSqliteReadOnlyOperation as m, hydrateOpenClawStateWorkerError as n, findOpenClawStateDatabaseFailure as o, resolveSqliteInspectionSignal as p, createOpenClawAgentDatabasePathMatcher as q, retainOpenClawStateWorkerErrorPayload as r, markOpenClawStateDatabaseFailure as s, captureSqliteSnapshotStagingOwner as t, normalizeAgentIdStrict as tt, createScopedSqliteReadOnlyWorker as u, withSqliteReadOnlyWorkerScope as v, revokeAgentDatabaseResources as w, matchesAgentDatabaseClose as x, assertAgentDatabaseResourceAdmission as y, registerAgentCreationClaimHandle as z };
