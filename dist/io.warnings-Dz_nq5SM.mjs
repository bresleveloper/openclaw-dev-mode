import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as resolvePathViaExistingAncestorSync$1 } from "./boundary-path-CAv_plX7.mjs";
import { n as isErrno, r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { o as hashConfigIncludeRaw, p as isPathInside } from "./includes-BkzfmxST.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import { I as materializeModelPolicyAllowlist } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { i as hashConfigRaw, s as parseConfigJson5 } from "./io.read-helpers-Bvdjf9tk.mjs";
import { t as createDedupeCache } from "./dedupe-qhwfyIea.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import { i as unsetConfigValueAtPath, t as getConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-BVcPkqsj.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { n as createConfigWriteAuthorityGuard, t as composeConfigWriteAssertions } from "./write-authority-BBYsD_pp.mjs";
import { r as acquireFileLock, s as withFileLock } from "./file-lock-CkzOvhYo.mjs";
import "./file-lock-Cl3feKST.mjs";
import { p as getUpdateDoctorConfigWriteAuthority, v as recordUpdateDoctorConfigWriteRefusal } from "./update-doctor-result-yVslo54h.mjs";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-C2LEup70.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-6uPuICvJ.mjs";
import { realpathSync } from "node:fs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { replaceFileAtomicSync } from "@openclaw/fs-safe/atomic";
//#region src/config/io.state.ts
const CONFIG_IO_WARNING_CACHE_MAX_SIZE = 4096;
const loggedInvalidConfigs = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
const loggedConfigWarningFingerprints = /* @__PURE__ */ new Map();
const warnedFutureTouchedVersions = createDedupeCache({
	ttlMs: 0,
	maxSize: CONFIG_IO_WARNING_CACHE_MAX_SIZE
});
/** Retains a warning fingerprint as most-recently used while enforcing the shared bound. */
function setBoundedConfigIoWarningEntry(map, key, value) {
	map.delete(key);
	map.set(key, value);
	pruneMapToMaxSize(map, CONFIG_IO_WARNING_CACHE_MAX_SIZE);
}
//#endregion
//#region src/config/io.meta.ts
/** Metadata keys automatically stamped on config writes. */
const AUTO_MANAGED_CONFIG_META_PATHS = [
	["meta", "lastTouchedVersion"],
	[
		"meta",
		"migrations",
		"modelPolicyAllowlist"
	],
	[
		"meta",
		"migrations",
		"utilityModelSeparation"
	]
];
function hasWebhookMigrationProgress(previous, next) {
	const before = previous.meta?.migrations?.webhookListeners;
	const after = next.meta?.migrations?.webhookListeners;
	return before !== true && after !== void 0 && !isDeepStrictEqual(before, after);
}
/** Publish migration pins beside includes so the root marker and pins roll back together. */
function projectWebhookMigrationIncludeWrite(previous, next) {
	if (!hasWebhookMigrationProgress(previous, next)) return;
	const completed = next.meta?.migrations?.webhookListeners;
	const before = previous.meta?.migrations?.webhookListeners;
	const paths = Object.entries(completed === true ? {} : completed ?? {}).flatMap(([channelId, fields]) => typeof before === "object" && Object.hasOwn(before, channelId) ? [] : fields.filter((field) => {
		const value = getConfigValueAtPath(next, field);
		return field[0] === "channels" && field[1] === channelId && (field.length === 3 || field.length === 5 && field[2] === "accounts") && getConfigValueAtPath(previous, field) === void 0 && (field.at(-1) === "legacyWebhook" ? asNullableRecord(value) !== null : field.at(-1) === "enabled" && value === true);
	}));
	const config = cloneConfigWithResolutionFacts(next);
	for (const field of paths) unsetConfigValueAtPath(config, field, previous);
	return {
		config,
		paths
	};
}
function stampConfigWriteMetadata(cfg, version = VERSION, previousConfig, env = process.env) {
	const migrationStamped = previousConfig === void 0 ? cfg : materializeUtilityModelSeparation(materializeModelPolicyAllowlist(cfg, previousConfig).config, previousConfig).config;
	if (resolveUpdateRehearsalRoot(env)) {
		const { meta: beforeMeta, ...before } = cfg;
		const { meta: afterMeta, ...after } = migrationStamped;
		return !(beforeMeta?.migrations?.modelPolicyAllowlist && !afterMeta?.migrations?.modelPolicyAllowlist || beforeMeta?.migrations?.utilityModelSeparation && !afterMeta?.migrations?.utilityModelSeparation) && isDeepStrictEqual(before, after) ? cfg : migrationStamped;
	}
	return {
		...migrationStamped,
		meta: {
			...migrationStamped.meta,
			lastTouchedVersion: version
		}
	};
}
/** Persist machine-owned metadata only after the matching config file commit succeeds. */
function recordConfigWriteMetadata(now = (/* @__PURE__ */ new Date()).toISOString()) {
	writeConfigMachineState("config.lastTouchedAt", now);
}
//#endregion
//#region src/config/write-lock.ts
const CONFIG_MUTATION_LOCK_OPTIONS = {
	retries: {
		retries: 80,
		factor: 1.2,
		minTimeout: 25,
		maxTimeout: 250,
		randomize: true
	},
	stale: 3e4
};
const activeConfigMutationLocks = new AsyncLocalStorage();
const configMutationQueue = new KeyedAsyncQueue();
const queuedConfigMutations = /* @__PURE__ */ new Map();
function enqueueConfigMutation(pathname, run) {
	return configMutationQueue.enqueue(pathname, run, {
		onEnqueue: () => {
			queuedConfigMutations.set(pathname, (queuedConfigMutations.get(pathname) ?? 0) + 1);
		},
		onSettle: () => {
			const remaining = queuedConfigMutations.get(pathname) - 1;
			if (remaining === 0) queuedConfigMutations.delete(pathname);
			else queuedConfigMutations.set(pathname, remaining);
		}
	});
}
/** Capture the live source owner, not merely the fact that a lock was once held. */
function captureConfigWriteLockGuard(pathname) {
	const context = activeConfigMutationLocks.getStore();
	const guarded = [...new Set(context?.paths.values())].filter((scope) => scope.assertCurrent);
	if (!guarded.length) return;
	const target = context?.paths.get(path.resolve(pathname));
	return composeConfigWriteAssertions(() => {
		if (!target?.active || !target.assertCurrent) throw new Error("Config write has no live source ownership for this path.");
	}, ...guarded.flatMap((scope) => [() => {
		if (!scope.active) throw new Error("Config write source ownership has closed.");
	}, scope.assertCurrent]));
}
async function runConfigLockScope(configPaths, fn, assertCurrent, sourceOnly = false) {
	const scope = {
		active: true,
		accepting: true,
		pending: /* @__PURE__ */ new Set(),
		sourceOnly,
		assertCurrent
	};
	const paths = new Map(activeConfigMutationLocks.getStore()?.paths);
	for (const configPath of configPaths) paths.set(configPath, scope);
	const assertScopedCurrent = composeConfigWriteAssertions(() => {
		if (!scope.active) throw new Error("Config source ownership has closed.");
	}, assertCurrent);
	try {
		return await activeConfigMutationLocks.run({
			paths,
			current: scope
		}, async () => {
			let outcome;
			try {
				assertScopedCurrent();
				outcome = { value: await fn(assertScopedCurrent) };
			} catch (error) {
				outcome = { error };
			} finally {
				scope.accepting = false;
			}
			const failures = [];
			while (scope.pending.size > 0) for (const result of await Promise.allSettled(scope.pending)) if (result.status === "rejected") failures.push(result.reason);
			if (failures.length) throw new AggregateError("error" in outcome ? [outcome.error, ...failures] : failures, "Config write operation did not settle successfully.");
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
	} finally {
		scope.active = false;
	}
}
async function withConfigWriteLock(pathname, fn, env, assertCurrent) {
	if (activeConfigMutationLocks.getStore()?.current.sourceOnly) throw new Error("Config writes are not allowed inside a config source scope.");
	const configPath = path.resolve(pathname);
	assertConfigWriteAllowedInCurrentMode({
		configPath,
		env
	});
	const assertResourceUnborrowed = (targetPath) => createManagedHandoffLeaseStore().assertSourceUnborrowed(targetPath);
	assertResourceUnborrowed(configPath);
	const inherited = activeConfigMutationLocks.getStore();
	const guardedParent = [...inherited?.paths.entries() ?? []].find(([, scope]) => scope.assertCurrent);
	const parentGuard = guardedParent ? captureConfigWriteLockGuard(guardedParent[0]) : void 0;
	if (parentGuard && !inherited?.current.accepting) throw new Error("Config write source admission has closed.");
	const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
	const guard = assertCurrent || doctorAuthority ? composeConfigWriteAssertions(parentGuard, assertCurrent, doctorAuthority ? () => doctorAuthority.assertCurrent() : void 0) : captureConfigWriteLockGuard(configPath);
	guard?.();
	const inheritedScope = inherited?.paths.get(configPath);
	if (inheritedScope?.active) {
		const running = Promise.resolve().then(() => {
			assertResourceUnborrowed(configPath);
			captureConfigWriteLockGuard(configPath)?.();
			return guard ? runConfigLockScope([configPath], fn, guard) : fn();
		});
		inheritedScope.pending.add(running);
		try {
			return await running;
		} finally {
			inheritedScope.pending.delete(running);
		}
	}
	const configDir = path.dirname(configPath);
	await fs$1.mkdir(configDir, {
		recursive: true,
		mode: 448
	});
	return await enqueueConfigMutation(configPath, async () => {
		return await withFileLock(configPath, {
			...CONFIG_MUTATION_LOCK_OPTIONS,
			assertResourceUnborrowed
		}, () => runConfigLockScope([configPath], fn, guard));
	}).catch(async (error) => {
		recordUpdateDoctorConfigWriteRefusal({
			reason: "config-lock-refused",
			message: formatErrorMessage(error),
			keys: []
		});
		if (!await isPermissionErrorInDirectory(error, configDir)) throw error;
		throw new Error(`OpenClaw cannot write to the config directory ${configDir}. Fix its ownership or permissions, then try again. Underlying error: ${formatErrorMessage(error)}`, { cause: error });
	});
}
/** Hold all config sources without waiting for another lock while retaining a partial set. */
async function withConfigSourceLocks(paths, run, env, assertCurrent) {
	if (activeConfigMutationLocks.getStore()) throw new Error("Config source locks require an independent config scope.");
	const requested = [...new Set(paths.map((pathname) => path.resolve(pathname)))];
	if (requested.length === 0) throw new Error("Config source locks require at least one source path.");
	const assertions = requested.map((configPath) => {
		assertConfigWriteAllowedInCurrentMode({
			configPath,
			env
		});
		const doctorAuthority = getUpdateDoctorConfigWriteAuthority(configPath);
		return doctorAuthority ? () => doctorAuthority.assertCurrent() : void 0;
	});
	const callerGuard = composeConfigWriteAssertions(assertCurrent, ...assertions);
	const assertResourceUnborrowed = (targetPath) => {
		createManagedHandoffLeaseStore().assertSourceUnborrowed(targetPath);
	};
	callerGuard();
	requested.forEach(assertResourceUnborrowed);
	const parents = new Map(await Promise.all([...new Set(requested.map((configPath) => path.dirname(configPath)))].map(async (parent) => {
		callerGuard();
		await fs$1.mkdir(parent, {
			recursive: true,
			mode: 448
		});
		return [parent, await readDirectoryIdentity(await fs$1.realpath(parent))];
	})));
	const guard = composeConfigWriteAssertions(callerGuard, () => {
		for (const [parent, identity] of parents) assertDirectoryIdentitySync(realpathSync.native(parent), identity);
	});
	const filePaths = [...new Set(requested.map((configPath) => path.join(parents.get(path.dirname(configPath)).realPath, path.basename(configPath))))].toSorted();
	const queuePaths = [.../* @__PURE__ */ new Set([...requested, ...filePaths])].toSorted();
	const lockOptions = {
		...CONFIG_MUTATION_LOCK_OPTIONS,
		assertResourceUnborrowed
	};
	for (;;) {
		guard();
		let contended = queuePaths.find((pathname) => queuedConfigMutations.has(pathname));
		if (!contended) {
			const released = createDeferredCore();
			const reservations = queuePaths.map((pathname) => enqueueConfigMutation(pathname, () => released.promise));
			const locks = [];
			const heldLockPaths = /* @__PURE__ */ new Set();
			const failures = [];
			let outcome;
			try {
				for (const pathname of filePaths) {
					guard();
					let alreadyHeld = false;
					if (heldLockPaths.size > 0) {
						const sidecar = `${pathname}.lock`;
						try {
							alreadyHeld = (await fs$1.lstat(sidecar)).isFile() && heldLockPaths.has(await fs$1.realpath(sidecar));
						} catch (error) {
							if (!isMissingPathError(error)) throw error;
						}
					}
					guard();
					if (alreadyHeld) continue;
					let lock;
					try {
						lock = await acquireFileLock(pathname, {
							...lockOptions,
							retries: {
								retries: 0,
								factor: 1,
								minTimeout: 0,
								maxTimeout: 0
							}
						});
					} catch (error) {
						if (isErrno(error) && error.code === "file_lock_timeout") {
							contended = pathname;
							break;
						}
						throw error;
					}
					locks.push(lock);
					heldLockPaths.add(await fs$1.realpath(lock.lockPath));
					guard();
				}
				if (!contended) outcome = { value: await runConfigLockScope(queuePaths, run, guard, true) };
			} catch (error) {
				failures.push(error);
			} finally {
				for (const lock of locks.toReversed()) try {
					await lock.release();
				} catch (error) {
					failures.push(error);
				}
				released.resolve();
				await Promise.all(reservations);
			}
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Config source ownership did not settle successfully.");
			if (outcome) return outcome.value;
		}
		await enqueueConfigMutation(contended, () => withFileLock(contended, lockOptions, async () => guard()));
	}
}
function markActiveConfigMutationPath(configPath) {
	if (activeConfigMutationLocks.getStore()?.current.sourceOnly) throw new Error("Config writes are not allowed inside a config source scope.");
	captureConfigWriteLockGuard(configPath)?.();
	const scope = activeConfigMutationLocks.getStore();
	if (scope?.current.active) scope.paths.set(path.resolve(configPath), scope.current);
}
async function isPermissionErrorInDirectory(error, directory) {
	if (!isErrno(error) || error.code !== "EACCES" && error.code !== "EPERM" && error.code !== "EROFS") return false;
	const failedPath = error.path;
	if (typeof failedPath !== "string") return false;
	const failedDir = path.dirname(path.resolve(failedPath));
	if (failedDir === directory) return true;
	const canonicalDirectory = await fs$1.realpath(directory).catch(() => void 0);
	return canonicalDirectory !== void 0 && failedDir === canonicalDirectory;
}
//#endregion
//#region src/config/io.write-safety.ts
/** The captured path facts survive an update's delegated finalizer; they grant no write authority. */
function assertConfigFileWritePathSnapshot(snapshot, ioFs) {
	const conflict = () => new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
	for (const expected of snapshot.entries) {
		const stat = ioFs.lstatSync(expected.path, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (expected.kind === "missing-directory") {
			if (stat && !stat.isDirectory()) throw conflict();
			continue;
		}
		if (!stat || stat.dev.toString() !== expected.dev || stat.ino.toString() !== expected.ino || (expected.link === void 0 ? !stat.isDirectory() : !stat.isSymbolicLink() || ioFs.readlinkSync(expected.path) !== expected.link)) throw conflict();
	}
	if (ioFs.lstatSync(snapshot.targetPath, { throwIfNoEntry: false })?.isSymbolicLink()) throw conflict();
}
/** Pin path lookups without pinning the regular file this write will replace. */
function captureConfigFileWritePathProof(filePath, targetPath, ioFs) {
	const facts = /* @__PURE__ */ new Map();
	const visited = /* @__PURE__ */ new Set();
	const conflict = () => new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
	const remember = (entry, stat, link) => {
		if (!facts.has(entry)) facts.set(entry, stat ? {
			kind: "existing",
			dev: stat.dev,
			ino: stat.ino,
			link
		} : { kind: "missing-directory" });
	};
	const capture = (entry) => {
		if (visited.has(entry)) return;
		visited.add(entry);
		const parent = path.dirname(entry);
		if (parent === entry) return;
		capture(parent);
		let realParent;
		try {
			realParent = ioFs.realpathSync(parent);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			realParent = resolvePathViaExistingAncestorSync$1(parent);
		}
		remember(realParent, ioFs.lstatSync(realParent, {
			bigint: true,
			throwIfNoEntry: false
		}));
		const lookup = path.join(realParent, path.basename(entry));
		const stat = ioFs.lstatSync(lookup, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!stat) {
			if (!isPathInside(lookup, targetPath)) throw conflict();
			return;
		}
		if (stat.isSymbolicLink()) {
			const link = ioFs.readlinkSync(lookup);
			remember(lookup, stat, link);
			capture(path.isAbsolute(link) ? link : `${realParent}${path.sep}${link}`);
		}
	};
	if (path.normalize(resolvePathViaExistingAncestorSync$1(filePath)) !== targetPath) throw conflict();
	capture(filePath);
	capture(targetPath);
	const snapshot = {
		targetPath,
		entries: [...facts].map(([entry, fact]) => fact.kind === "missing-directory" ? {
			path: entry,
			kind: fact.kind
		} : {
			path: entry,
			kind: fact.kind,
			dev: fact.dev.toString(),
			ino: fact.ino.toString(),
			link: fact.link
		})
	};
	const assertCurrent = () => assertConfigFileWritePathSnapshot(snapshot, ioFs);
	assertCurrent();
	return {
		path: filePath,
		snapshot,
		assertCurrent
	};
}
function formatConfigPermissionHardeningWarning(params) {
	const detail = params.error instanceof Error ? params.error.message : String(params.error);
	return `Config permission hardening failed (${params.context}): ${params.configPath}: ${detail}`;
}
async function chmodConfigBestEffort(params) {
	try {
		await params.deps.fs.promises.chmod?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			...params,
			error
		}));
	}
}
function chmodConfigBestEffortSync(params) {
	try {
		params.deps.fs.chmodSync?.(params.configPath, 384);
	} catch (error) {
		params.deps.logger.warn(formatConfigPermissionHardeningWarning({
			...params,
			error
		}));
	}
}
/** Keep config conflicts and compensation policy outside the atomic file owner. */
function createConfigFileWriteGuard(configPath, fsModule, assertCurrent, publication) {
	const includePathProofs = new Map(Object.entries(publication?.includeGraph.targets ?? {}).map(([includePath, target]) => [includePath, publication?.targetPathProof?.path === includePath ? publication.targetPathProof : captureConfigFileWritePathProof(includePath, target, fsModule)]));
	let expectedSnapshot = publication?.snapshot;
	let publishedIdentity = publication?.publicationIdentity;
	const authority = createConfigWriteAuthorityGuard(assertCurrent);
	let refusal;
	const current = () => {
		if (refusal) throw refusal.error;
		authority();
	};
	const assertPublishedIdentity = () => {
		publication?.targetPathProof?.assertCurrent();
		if (publishedIdentity === void 0) return;
		const entry = fsModule.lstatSync(configPath, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (publishedIdentity === null ? entry !== void 0 : !entry || entry.dev !== publishedIdentity.dev || entry.ino !== publishedIdentity.ino || !entry.isFile() || entry.nlink !== 1n) throw new ConfigMutationConflictError("config publication identity changed", { retryable: false });
	};
	const assertBeforeMutation = () => {
		try {
			current();
			assertPublishedIdentity();
			if (expectedSnapshot) assertBaseSnapshotStillCurrent(expectedSnapshot, configPath, fsModule, publication?.includeGraph, includePathProofs);
		} catch (error) {
			refusal ??= { error };
			throw refusal.error;
		}
	};
	const onDestinationState = (state) => {
		publishedIdentity = state.state === "removed" ? null : {
			dev: state.dev,
			ino: state.ino
		};
		if (state.state === "published") {
			expectedSnapshot = void 0;
			publication?.onRootPublished?.();
		} else {
			expectedSnapshot = publication && {
				...publication.snapshot,
				exists: state.state === "writing",
				raw: null
			};
			publication?.onRootRemoved?.();
		}
	};
	const captureRollbackProof = (assertOwner) => {
		const assertRollbackOwner = () => {
			assertOwner();
			publication?.targetPathProof?.assertCurrent();
		};
		assertRollbackOwner();
		assertPublishedIdentity();
		if (publishedIdentity === void 0) throw new ConfigMutationConflictError("config write has no publication to roll back", { retryable: false });
		return {
			assertCurrent: assertRollbackOwner,
			publicationIdentity: publishedIdentity
		};
	};
	let stagedIdentity;
	return {
		fileSystem: {
			...fsModule,
			writeFileSync: new Proxy(fsModule.writeFileSync, { apply(target, thisArg, args) {
				const result = Reflect.apply(target, thisArg, args);
				if (typeof args[0] === "number") stagedIdentity = fsModule.fstatSync(args[0], { bigint: true });
				return result;
			} }),
			renameSync(source, destination) {
				fsModule.renameSync(source, destination);
				if (destination === configPath && stagedIdentity) onDestinationState({
					state: "published",
					path: configPath,
					...stagedIdentity
				});
			},
			...publication?.preserveDirectoryMode ? { fchmodSync: (fd, mode) => {
				if (!fsModule.fstatSync(fd).isDirectory()) fsModule.fchmodSync(fd, mode);
			} } : {}
		},
		assertCurrent: current,
		assertBeforeMutation,
		onDestinationState,
		assertPublishedIdentity,
		captureRollbackProof
	};
}
function assertBaseSnapshotStillCurrent(snapshot, configPath, ioFs, includeGraph, includePathProofs) {
	if (snapshot.path !== configPath) throw new ConfigMutationConflictError("config path changed since last load", { retryable: false });
	for (const [includePath, expectedHash] of Object.entries(includeGraph?.hashes ?? {})) try {
		const expectedTarget = includeGraph?.targets[includePath];
		if (!expectedTarget) throw new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
		const pathProof = includePathProofs?.get(includePath);
		pathProof?.assertCurrent();
		if (!pathProof && path.normalize(ioFs.realpathSync(includePath)) !== expectedTarget) throw new ConfigMutationConflictError("included config target changed since last load", { retryable: false });
		if (expectedTarget === configPath) continue;
		if (hashConfigIncludeRaw(ioFs.readFileSync(expectedTarget, "utf-8")) !== expectedHash) throw new ConfigMutationConflictError("included config changed since last load");
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		throw new ConfigMutationConflictError("included config disappeared since last load");
	}
	if (snapshot.readError) return;
	const expectedHash = snapshot.raw === null ? null : hashConfigRaw(snapshot.raw);
	let currentRaw = null;
	let currentExists = true;
	try {
		currentRaw = ioFs.readFileSync(configPath, "utf-8");
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
		currentExists = false;
	}
	const currentHash = currentExists ? hashConfigRaw(currentRaw) : null;
	if (currentExists !== snapshot.exists || currentExists && expectedHash !== null && currentHash !== expectedHash) throw new ConfigMutationConflictError("config changed since last load");
}
async function tightenStateDirPermissionsIfNeeded(params) {
	const assertCurrent = captureConfigWriteLockGuard(params.configPath);
	if (process.platform === "win32") return;
	const stateDir = resolveStateDir(params.env, params.homedir);
	const configDir = path.dirname(params.configPath);
	if (path.resolve(configDir) !== path.resolve(stateDir)) return;
	try {
		if (((await params.fsModule.promises.stat(configDir)).mode & 63) !== 0) {
			assertCurrent?.();
			params.assertConfigPathForWrite?.();
			await params.fsModule.promises.chmod(configDir, 448);
		}
	} catch {
		assertCurrent?.();
		params.assertConfigPathForWrite?.();
	}
}
async function rollbackConfigFileWriteIfUnchanged(params) {
	const assertCurrent = params.assertCurrent;
	assertCurrent?.();
	let currentRaw = null;
	try {
		currentRaw = await params.fsModule.promises.readFile(params.configPath, "utf-8");
	} catch (error) {
		assertCurrent?.();
		if (error?.code !== "ENOENT") throw error;
	}
	assertCurrent?.();
	if (hashConfigRaw(currentRaw) !== params.committedHash) return false;
	const previousRaw = params.previousSnapshot.exists ? params.previousSnapshot.raw : void 0;
	if (params.previousSnapshot.exists && typeof previousRaw !== "string") return false;
	let mutated = false;
	const guard = createConfigFileWriteGuard(params.configPath, params.fsModule, assertCurrent, {
		publicationIdentity: params.publicationIdentity,
		snapshot: {
			...params.previousSnapshot,
			exists: currentRaw !== null,
			raw: currentRaw
		},
		includeGraph: {
			hashes: {},
			targets: {}
		},
		preserveDirectoryMode: params.preserveDirectoryMode,
		onRootPublished: () => {
			mutated = true;
		},
		onRootRemoved: () => {
			mutated = true;
		}
	});
	const publish = () => {
		if (typeof previousRaw === "string") {
			replaceFileAtomicSync({
				filePath: params.configPath,
				content: previousRaw,
				dirMode: 448,
				mode: 384,
				copyFallbackOnPermissionError: true,
				syncTempFile: params.durable,
				syncParentDir: params.durable,
				destinationHardlinks: params.destinationHardlinks,
				throwOnCleanupError: true,
				fileSystem: guard.fileSystem,
				assertBeforeMutation: guard.assertBeforeMutation,
				onDestinationState: guard.onDestinationState
			});
			return;
		}
		guard.assertBeforeMutation();
		params.fsModule.rmSync(params.configPath, { force: true });
		mutated = true;
	};
	if (params.withPublication) params.withPublication(publish, () => mutated);
	else publish();
	return true;
}
function normalizeStatNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function normalizeStatId(value) {
	if (typeof value === "bigint") return value.toString();
	return typeof value === "number" && Number.isFinite(value) ? String(value) : null;
}
function resolveConfigStatMetadata(stat) {
	return {
		dev: normalizeStatId(stat?.dev ?? null),
		ino: normalizeStatId(stat?.ino ?? null),
		mode: normalizeStatNumber(stat ? stat.mode & 511 : null),
		nlink: normalizeStatNumber(stat?.nlink ?? null),
		uid: normalizeStatNumber(stat?.uid ?? null),
		gid: normalizeStatNumber(stat?.gid ?? null)
	};
}
function resolveConfigWriteSuspiciousReasons(params) {
	const reasons = [];
	if (!params.existsBefore) return reasons;
	if (params.unreadableBefore) reasons.push("unreadable-config-before-write");
	if (typeof params.sizeBaselineBytes === "number" && typeof params.nextBytes === "number" && params.sizeBaselineBytes >= 512 && params.nextBytes < Math.floor(params.sizeBaselineBytes * .5)) reasons.push(`size-drop:${params.sizeBaselineBytes}->${params.nextBytes}`);
	if (!params.hasMetaBefore) reasons.push("missing-meta-before-write");
	if (params.gatewayModeBefore && !params.gatewayModeAfter) reasons.push("gateway-mode-removed");
	return reasons;
}
function resolveConfigWriteBlockingReasons(suspicious, options = {}) {
	return suspicious.filter((reason) => reason === "unreadable-config-before-write" || reason.startsWith("size-drop:") && options.allowConfigSizeDrop !== true || reason === "gateway-mode-removed");
}
function formatConfigArtifactTimestamp(ts) {
	return ts.replaceAll(":", "-").replaceAll(".", "-");
}
function resolveConfigSizeBaselineBytes(params) {
	if (params.raw === null) return null;
	const rawBytes = Buffer.byteLength(params.raw, "utf-8");
	const parsed = parseConfigJson5(params.raw, params.json5);
	if (!parsed.ok || !isRecord(parsed.parsed)) return rawBytes;
	const canonical = JSON.stringify(stampConfigWriteMetadata(parsed.parsed, params.lastTouchedVersionOverride, void 0, params.env), null, 2).trimEnd().concat("\n");
	return Buffer.byteLength(canonical, "utf-8");
}
//#endregion
//#region src/config/json5-comments.ts
function hasJSON5Comments(raw) {
	let quote;
	for (let index = 0; index < raw.length; index += 1) {
		const char = raw[index];
		if (quote) {
			if (char === "\\") index += 1;
			else if (char === quote) quote = void 0;
			continue;
		}
		if (char === "\"" || char === "'") {
			quote = char;
			continue;
		}
		if (char === "/" && (raw[index + 1] === "/" || raw[index + 1] === "*")) return true;
	}
	return false;
}
function warnIfJSON5CommentsWillBeStripped(params) {
	if (params.skipOutputLogs || typeof params.raw !== "string" || !hasJSON5Comments(params.raw)) return;
	(params.warn ?? console.warn)(`Config write will strip JSON5 comments from ${params.filePath}.`);
}
//#endregion
//#region src/config/io.warnings.ts
function logConfigWarningsOnce(params) {
	if (params.warnings.length === 0) {
		loggedConfigWarningFingerprints.delete(params.configPath);
		return;
	}
	const details = params.warnings.map((warning) => `${sanitizeTerminalText(warning.path || "<root>")}: ${sanitizeTerminalText(warning.message)}`).join("; ");
	const fingerprint = hashConfigRaw(details);
	const repeated = loggedConfigWarningFingerprints.get(params.configPath) === fingerprint;
	setBoundedConfigIoWarningEntry(loggedConfigWarningFingerprints, params.configPath, fingerprint);
	if (!repeated) params.logger.warn(`Config warnings: ${details}`);
}
function warnIfConfigFromFuture(cfg, logger) {
	const touched = cfg.meta?.lastTouchedVersion;
	if (!touched || !shouldWarnOnTouchedVersion(VERSION, touched)) return;
	if (warnedFutureTouchedVersions.check(touched)) return;
	logger.warn([
		`Your OpenClaw config was written by version ${touched}, but this command is running ${VERSION}.`,
		"Check: `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
		"If unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install."
	].join("\n"));
}
//#endregion
export { projectWebhookMigrationIncludeWrite as C, loggedInvalidConfigs as D, loggedConfigWarningFingerprints as E, setBoundedConfigIoWarningEntry as O, hasWebhookMigrationProgress as S, stampConfigWriteMetadata as T, captureConfigWriteLockGuard as _, assertConfigFileWritePathSnapshot as a, withConfigWriteLock as b, chmodConfigBestEffortSync as c, resolveConfigSizeBaselineBytes as d, resolveConfigStatMetadata as f, tightenStateDirPermissionsIfNeeded as g, rollbackConfigFileWriteIfUnchanged as h, assertBaseSnapshotStillCurrent as i, createConfigFileWriteGuard as l, resolveConfigWriteSuspiciousReasons as m, warnIfConfigFromFuture as n, captureConfigFileWritePathProof as o, resolveConfigWriteBlockingReasons as p, warnIfJSON5CommentsWillBeStripped as r, chmodConfigBestEffort as s, logConfigWarningsOnce as t, formatConfigArtifactTimestamp as u, markActiveConfigMutationPath as v, recordConfigWriteMetadata as w, AUTO_MANAGED_CONFIG_META_PATHS as x, withConfigSourceLocks as y };
