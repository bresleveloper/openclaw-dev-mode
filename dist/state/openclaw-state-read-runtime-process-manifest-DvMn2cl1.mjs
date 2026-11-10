import { C as admitPathInsideRoot, Ct as inspectFileIdentitySync, Z as hardlinkedPathNotAllowedError, c as exactFileIdentity, d as resolveReadOpenFlags, dt as realpathSync$1, g as resolveRootPathSyncWithCanonicalRootObservation, lt as isUnsafeDeviceReadPath, s as readSymlinkResolution, u as numberStats } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { b as FsSafeError, d as assertNoWindowsPathAlias, m as pathForWindowsFilesystem } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-open.js
function isExpectedPathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function openPinnedFileSync(params) {
	const filePath = params.filePath;
	const resolvedPath = params.resolvedPath;
	const ioFs = params.ioFs ?? fs;
	const allowedType = params.allowedType ?? "file";
	const rejectPathSymlink = params.rejectPathSymlink === true;
	const statPolicy = {
		rejectHardlinks: params.rejectHardlinks,
		rejectLeafSymlinks: params.rejectLeafSymlinks,
		maxBytes: params.maxBytes
	};
	const openReadFlags = resolveReadOpenFlags({ constants: ioFs.constants });
	let fd = params.admittedFd ?? null;
	try {
		assertNoWindowsPathAlias(filePath, "filesystem", "file path uses a Windows filesystem namespace alias");
		if (resolvedPath !== void 0) assertNoWindowsPathAlias(resolvedPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(filePath)) return {
			ok: false,
			reason: "validation"
		};
		if (rejectPathSymlink) {
			if (ioFs.lstatSync(filePath).isSymbolicLink()) return {
				ok: false,
				reason: "validation"
			};
		}
		const realPath = resolvedPath ?? (ioFs === fs ? realpathSync$1(filePath) : ioFs.realpathSync(filePath));
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(realPath)) return {
			ok: false,
			reason: "validation"
		};
		const preOpenStat = inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		});
		fd ??= ioFs.openSync(realPath, openReadFlags);
		const identity = inspectFileIdentitySync(() => {
			const stat = ioFs.fstatSync(fd, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, preOpenStat);
		inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, identity);
		const admittedPath = params.finalAdmission?.({
			path: realPath,
			descriptorIdentity: identity
		}) ?? realPath;
		const openedStat = numberStats(identity);
		const opened = {
			ok: true,
			path: admittedPath,
			fd,
			stat: openedStat,
			identity
		};
		fd = null;
		return opened;
	} catch (error) {
		if (error instanceof FsSafeError) return {
			ok: false,
			reason: "validation",
			error
		};
		if (isExpectedPathError(error)) return {
			ok: false,
			reason: "path",
			error
		};
		return {
			ok: false,
			reason: "io",
			error
		};
	} finally {
		if (fd !== null) try {
			ioFs.closeSync(fd);
		} catch {}
	}
}
function assertAllowedStat(stat, allowedType, params) {
	if (stat.isSymbolicLink() && params.rejectLeafSymlinks) throw new FsSafeError("symlink", "symlink not allowed");
	if (stat.isSymbolicLink() || !(allowedType === "directory" ? stat.isDirectory() : stat.isFile())) throw new FsSafeError("not-file", "path does not have the required file type");
	if (params.rejectHardlinks && stat.isFile() && stat.nlink > 1n) throw new FsSafeError("hardlink", "path must not be hardlinked");
	if (params.maxBytes !== void 0 && stat.isFile() && stat.size > params.maxBytes) throw new FsSafeError("too-large", "file exceeds byte limit");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-file-final-admission.js
function rootIdentityMismatch(cause) {
	return new FsSafeError("path-mismatch", "canonical root directory identity changed or could not be verified", cause === void 0 ? {} : { cause });
}
function inspectCanonicalRoot(ioFs, rootPath, expected) {
	try {
		assertNoWindowsPathAlias(rootPath);
		const operationPath = ioFs === fs ? pathForWindowsFilesystem(rootPath) : rootPath;
		return inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(operationPath, { bigint: true });
			if (!stat.isDirectory() || stat.isSymbolicLink()) throw rootIdentityMismatch();
			return stat;
		}, expected);
	} catch (error) {
		if (expected && isExpectedPathError(error)) throw rootIdentityMismatch(error);
		throw error;
	}
}
function observeCanonicalRoot(ioFs, rootPath) {
	try {
		const stat = inspectCanonicalRoot(ioFs, rootPath);
		const identity = Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		});
		let observedPath = rootPath;
		if (process.platform === "win32" && ioFs === fs) {
			observedPath = realpathSync$1.native(pathForWindowsFilesystem(rootPath));
			if (observedPath !== rootPath) inspectCanonicalRoot(ioFs, observedPath, identity);
		}
		return {
			ok: true,
			path: observedPath,
			identity
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
function resolveConsumedPath(ioFs, filePath) {
	return ioFs === fs ? realpathSync$1.native(filePath) : ioFs.realpathSync(filePath);
}
function createRootFileFinalAdmission(ioFs, root, boundaryLabel, rejectHardlinks = true) {
	const inspectRoot = (candidateRootPath, expected) => {
		inspectCanonicalRoot(ioFs, candidateRootPath, expected);
	};
	return ({ path: consumedPath, descriptorIdentity }) => {
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		const canonicalPath = resolveConsumedPath(ioFs, consumedPath);
		assertNoWindowsPathAlias(canonicalPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
		const admitted = admitPathInsideRoot({
			rootPath: root.path,
			candidatePath: canonicalPath,
			rootIdentity: root.identity,
			inspectCandidateRoot: inspectRoot
		});
		if (!admitted) throw new FsSafeError("outside-workspace", `resolved path escapes ${boundaryLabel}`);
		try {
			const current = inspectFileIdentitySync(() => ioFs.lstatSync(admitted.path, { bigint: true }), descriptorIdentity);
			if (rejectHardlinks && current.isFile() && current.nlink > 1n) throw hardlinkedPathNotAllowedError();
		} catch (error) {
			if (isExpectedPathError(error)) throw new FsSafeError("path-mismatch", "canonical file identity changed or could not be verified", { cause: error });
			throw error;
		}
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		return admitted.path;
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-file.js
function canUseRootFileOpen(ioFs) {
	return typeof ioFs.openSync === "function" && typeof ioFs.closeSync === "function" && typeof ioFs.fstatSync === "function" && typeof ioFs.lstatSync === "function" && typeof ioFs.realpathSync === "function" && typeof ioFs.readFileSync === "function" && typeof ioFs.constants === "object" && ioFs.constants !== null;
}
function absoluteRootFilePath(filePath) {
	if (path.isAbsolute(filePath)) return filePath;
	const drive = path.parse(filePath).root;
	return `${drive ? path.resolve(drive) : process.cwd()}${path.sep}${filePath.slice(drive.length)}`;
}
function openRootFileSync(params) {
	const ioFs = params.ioFs ?? fs;
	const rawAbsolutePath = params.absolutePath;
	let resolved;
	try {
		const absolutePath = absoluteRootFilePath(rawAbsolutePath);
		assertNoWindowsPathAlias(absolutePath);
		const rootPath = params.rootPath;
		const rootRealPath = params.rootRealPath;
		const boundaryLabel = params.boundaryLabel;
		let rootObservation;
		resolved = mapResolvedRootPath(absolutePath, boundaryLabel, resolveRootPathSyncWithCanonicalRootObservation({
			absolutePath,
			rootPath,
			rootCanonicalPath: rootRealPath,
			boundaryLabel,
			...readSymlinkResolution(params.symlinks ?? (params.rejectSymlinks === false ? "follow-within-root" : "reject")),
			skipLexicalRootCheck: params.skipLexicalRootCheck
		}, (rootCanonicalPath) => {
			rootObservation = observeCanonicalRoot(ioFs, rootCanonicalPath);
		}), rootObservation);
	} catch (error) {
		resolved = toBoundaryValidationError(error);
	}
	return finalizeRootFileOpen({
		resolved,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs
	});
}
function finalizeRootFileOpen(params) {
	if ("ok" in params.resolved) return params.resolved;
	const resolved = params.resolved;
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const opened = openPinnedFileSync({
		filePath: resolved.absolutePath,
		resolvedPath: resolved.resolvedPath,
		rejectHardlinks,
		maxBytes: params.maxBytes,
		allowedType: params.allowedType,
		ioFs: params.ioFs,
		admittedFd: params.admittedFd,
		rejectLeafSymlinks: params.rejectLeafSymlinks,
		finalAdmission: createRootFileFinalAdmission(params.ioFs, resolved.rootObservation, resolved.boundaryLabel, rejectHardlinks)
	});
	if (!opened.ok) return opened;
	return {
		ok: true,
		path: opened.path,
		fd: opened.fd,
		stat: opened.stat,
		exactIdentity: exactFileIdentity(opened.identity),
		rootRealPath: resolved.rootRealPath
	};
}
function toBoundaryValidationError(error) {
	return {
		ok: false,
		reason: "validation",
		error
	};
}
function mapResolvedRootPath(absolutePath, boundaryLabel, resolved, rootObservation) {
	if (!rootObservation) return toBoundaryValidationError(new FsSafeError("path-mismatch", "canonical root identity was not observed"));
	if (!rootObservation.ok) return toRootObservationError(rootObservation.error);
	return {
		absolutePath,
		resolvedPath: resolved.canonicalPath,
		rootRealPath: rootObservation.path,
		boundaryLabel,
		rootObservation
	};
}
function toRootObservationError(error) {
	if (error instanceof FsSafeError) return toBoundaryValidationError(error);
	if (isExpectedPathError(error)) return {
		ok: false,
		reason: "path",
		error
	};
	return {
		ok: false,
		reason: "io",
		error
	};
}
//#endregion
//#region packages/retry/src/index.ts
const MAX_TIMER_TIMEOUT_MS = 2147e6;
function createAbortError(message, options) {
	const error = new Error(message, options);
	error.name = "AbortError";
	return error;
}
function racePromiseWithAbortSignal(operation, signal, createError = (abortedSignal) => createAbortError("Operation aborted", { cause: abortedSignal.reason })) {
	const run = () => {
		try {
			return typeof operation === "function" ? operation() : operation;
		} catch (error) {
			return Promise.reject(error);
		}
	};
	if (!signal) return run();
	const abortError = () => createError(signal);
	if (signal.aborted) {
		const aborted = Promise.reject(abortError());
		return typeof operation === "function" ? aborted : Promise.race([aborted, operation]);
	}
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
	});
	return Promise.race([run(), aborted]).finally(() => {
		signal.removeEventListener("abort", onAbort);
	});
}
/** Bounds observation without cancelling work; a factory starts only after the timer is armed. */
async function raceWithTimeout(operation, timeoutMs, onTimeout, options = {}) {
	let timer;
	let onAbort;
	try {
		const deadline = new Promise((resolve, reject) => {
			const settle = (result) => {
				try {
					resolve(result());
				} catch (error) {
					reject(error);
				}
			};
			timer = setTimeout(() => settle(onTimeout), timeoutMs);
			if (options.ref === false) timer.unref?.();
			const signal = options.signal;
			if (signal) {
				onAbort = () => settle(() => {
					if (options.onAbort) return options.onAbort(signal);
					throw createAbortError("Operation aborted", { cause: signal.reason });
				});
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		let source;
		try {
			source = typeof operation === "function" ? operation() : operation;
		} catch (error) {
			deadline.catch(() => {});
			throw error;
		}
		return await Promise.race([source, deadline]);
	} finally {
		clearTimeout(timer);
		if (onAbort) options.signal?.removeEventListener("abort", onAbort);
	}
}
function resolveSleepDelayMs(ms) {
	return Number.isFinite(ms) && ms > 0 ? Math.min(Math.max(Math.floor(ms), 1), MAX_TIMER_TIMEOUT_MS) : 0;
}
async function sleepWithAbort(ms, abortSignal, options = {}) {
	const delayMs = resolveSleepDelayMs(ms);
	if (delayMs === 0) return;
	await new Promise((resolve, reject) => {
		const cleanup = () => abortSignal?.removeEventListener("abort", onAbort);
		const timer = setTimeout(() => {
			cleanup();
			resolve();
		}, delayMs);
		const onAbort = () => {
			clearTimeout(timer);
			cleanup();
			reject(createAbortError("aborted", { cause: abortSignal?.reason ?? /* @__PURE__ */ new Error("aborted") }));
		};
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		if (options.ref === false) timer.unref?.();
	});
}
const DEFAULT_RETRY_CONFIG = {
	attempts: 3,
	minDelayMs: 300,
	maxDelayMs: 3e4,
	jitter: 0
};
const defaultSleep = async (ms) => {
	let remainingMs = ms;
	do {
		const delayMs = Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS);
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
		remainingMs -= delayMs;
	} while (remainingMs > 0);
};
function clampNumber(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(Math.max(value, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(clampNumber(value, fallback)));
}
function resolveRetryDelayMs(value) {
	return Math.min(Math.max(Math.round(value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	return typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : fallback;
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))),
		jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
	};
}
function applyJitter(delayMs, jitter, mode, random) {
	if (jitter === "full") {
		if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (.5 + random() * .5)));
		return Math.max(0, Math.ceil(delayMs * (1 + random())));
	}
	if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
	const fraction = random();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createRetryRunner(runtime = {}) {
	const runtimeSleep = runtime.sleep ?? defaultSleep;
	const runtimeRandom = runtime.random ?? Math.random;
	const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
	return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
		const attemptErrors = [];
		const numeric = typeof attemptsOrOptions === "number";
		const options = typeof attemptsOrOptions === "number" ? { attempts: attemptsOrOptions } : attemptsOrOptions;
		const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
		const maxAttempts = resolved.attempts;
		const minDelayMs = resolved.minDelayMs;
		const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
		const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0)));
		const random = options.random ?? runtimeRandom;
		const sleep = options.sleep ?? runtimeSleep;
		const shouldRetry = options.shouldRetry ?? (() => true);
		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
			return await fn();
		} catch (err) {
			attemptErrors.push(err);
			if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
			if (numeric) {
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** (attempt - 1)));
				continue;
			}
			const context = {
				attempt,
				maxAttempts,
				err,
				label: options.label
			};
			const retryAfterMs = options.retryAfterMs?.(err);
			const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
			const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
			const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
			const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
			const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
			let delay = Math.min(baseDelay, delayCap);
			const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
			const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
			delay = applyJitter(delay, resolved.jitter, wantsPositiveDraw ? "positive" : "symmetric", random);
			delay = Math.min(Math.max(delay, minDelayMs), delayCap);
			await options.onRetry?.({
				...context,
				delayMs: delay
			});
			if (delay > 0) await sleep(delay);
		}
		throw createFailure(attemptErrors);
	};
}
createRetryRunner();
//#endregion
//#region src/infra/runtime-process-manifest.ts
function createRuntimeProcessEntrypoints(currentModuleUrl) {
	function runtimeProcessEntrypoint(modulePath) {
		return {
			currentModuleUrl,
			sourceWorkerName: modulePath.startsWith("infra/") ? modulePath.slice(6) : `../${modulePath}`,
			distWorkerPath: `${modulePath}.js`
		};
	}
	return {
		sqliteHeaderProbe: runtimeProcessEntrypoint("infra/sqlite-header-probe.worker"),
		postgresBridge: runtimeProcessEntrypoint("infra/postgres-sync/bridge.worker"),
		secretEgressProxy: runtimeProcessEntrypoint("secrets/egress-proxy/proxy.worker"),
		codeModeNode: runtimeProcessEntrypoint("agents/code-mode-node.worker"),
		cronReadOnly: runtimeProcessEntrypoint("cron/store/read-only.worker"),
		stateRead: runtimeProcessEntrypoint("state/openclaw-state-read.worker"),
		workerNativeLifecycle: runtimeProcessEntrypoint("infra/worker-native-lifecycle.worker"),
		spawnBroker: runtimeProcessEntrypoint("process/spawn-broker/worker"),
		cronStreamMatcher: runtimeProcessEntrypoint("gateway/cron-stream-matcher.worker"),
		controlUiFile: runtimeProcessEntrypoint("gateway/control-ui-file.worker"),
		publicSessionCard: runtimeProcessEntrypoint("gateway/control-ui-public-session-card.worker"),
		nodeBootstrapArtifact: runtimeProcessEntrypoint("gateway/worker-environments/node-bootstrap-artifact.worker"),
		nativeHookRelayClient: runtimeProcessEntrypoint("agents/harness/native-hook-relay-client.worker"),
		computerHost: runtimeProcessEntrypoint("gateway/desktop/computer.worker"),
		imageProcessor: runtimeProcessEntrypoint("media/image-processor.worker"),
		fileToolPlanning: runtimeProcessEntrypoint("agents/sessions/tools/file-tool-planning.worker"),
		fileToolRead: runtimeProcessEntrypoint("agents/sessions/tools/read-file.worker"),
		attachmentProcessor: runtimeProcessEntrypoint("media/attachment-processor.worker"),
		gitOperations: runtimeProcessEntrypoint("infra/git-operation.worker"),
		gitPackCleanup: runtimeProcessEntrypoint("agents/worktrees/git-pack-cleanup.worker"),
		fsSafeCopy: runtimeProcessEntrypoint("infra/fs-safe-copy.worker"),
		sharedStateStore: runtimeProcessEntrypoint("state/openclaw-state.worker"),
		authProfileInlineUsage: runtimeProcessEntrypoint("agents/auth-profiles/inline-usage.worker"),
		pluginModelCatalogCredentials: runtimeProcessEntrypoint("agents/plugin-model-catalog.worker"),
		agentDatabaseExecution: runtimeProcessEntrypoint("state/openclaw-agent-execution.worker"),
		workspaceMemory: runtimeProcessEntrypoint("worker/memory-worker-entry"),
		localAgentAvatar: runtimeProcessEntrypoint("agents/identity-avatar-file.worker"),
		identityFile: runtimeProcessEntrypoint("agents/identity-file.worker"),
		workspaceSkills: runtimeProcessEntrypoint("worker/skills-worker-entry"),
		skillsDiscovery: runtimeProcessEntrypoint("skills/runtime/discovery.worker"),
		boardStore: runtimeProcessEntrypoint("boards/sqlite-board-store.worker"),
		progressCardStore: runtimeProcessEntrypoint("session-cards/progress-card-store.worker"),
		sessionSharingStore: runtimeProcessEntrypoint("config/sessions/session-sharing-store.worker"),
		sessionForkDomain: runtimeProcessEntrypoint("config/sessions/session-fork-domain.worker"),
		sessionGoalOperations: runtimeProcessEntrypoint("config/sessions/goals-operations.worker"),
		sessionLifecyclePlanningDomain: runtimeProcessEntrypoint("config/sessions/session-lifecycle-projection.worker"),
		sessionMessageRewriteDomain: runtimeProcessEntrypoint("config/sessions/session-message-rewrite.worker"),
		sessionDiskBudget: runtimeProcessEntrypoint("config/sessions/disk-budget.worker"),
		heartbeatOutcomeStore: runtimeProcessEntrypoint("infra/heartbeat-outcome-store.worker"),
		acpParentStreamStore: runtimeProcessEntrypoint("agents/subagents/spawn/acp-parent-stream-store.worker"),
		messageToolRunOutcomeStore: runtimeProcessEntrypoint("infra/message-tool-run-outcome-store.worker"),
		contextEngineTurnOutbox: runtimeProcessEntrypoint("agents/harness/context-engine-turn-outbox.worker"),
		sqliteStore: runtimeProcessEntrypoint("infra/sqlite-store.worker"),
		sqliteWriterAdmission: runtimeProcessEntrypoint("infra/sqlite-writer-admission.worker"),
		agentSchemaInspection: runtimeProcessEntrypoint("state/openclaw-agent-schema-inspection.worker"),
		stateMigrationSnapshot: runtimeProcessEntrypoint("infra/state-migrations.snapshot.worker"),
		githubExec: runtimeProcessEntrypoint("agents/github-exec-launcher"),
		sqliteReadOnly: runtimeProcessEntrypoint("infra/sqlite-readonly-location.worker"),
		sqliteSnapshotStaging: runtimeProcessEntrypoint("infra/sqlite-snapshot-staging.worker"),
		sqliteReadOnlyNativeResource: runtimeProcessEntrypoint("infra/sqlite-readonly-native-resource"),
		sqliteSourceRevision: runtimeProcessEntrypoint("infra/sqlite-source-revision.worker"),
		sqliteIntegrity: runtimeProcessEntrypoint("infra/sqlite-integrity.worker"),
		sqliteCloseProbe: runtimeProcessEntrypoint("infra/bun-sqlite-close-probe.worker"),
		preparedModelCatalog: runtimeProcessEntrypoint("agents/prepared-model-catalog.worker"),
		providerPromptState: runtimeProcessEntrypoint("agents/embedded-agent-runner/provider-prompt-state.worker"),
		updateRepair: runtimeProcessEntrypoint("infra/update-repair.worker"),
		immutableBuild: runtimeProcessEntrypoint("infra/update-immutable-build.worker"),
		updateMigratedFinalize: runtimeProcessEntrypoint("infra/update-migrated-finalize.worker"),
		updateCandidateState: runtimeProcessEntrypoint("infra/update-candidate-state.worker"),
		doctorLint: runtimeProcessEntrypoint("commands/doctor-lint.worker"),
		doctor: runtimeProcessEntrypoint("commands/doctor.worker"),
		databaseVerify: runtimeProcessEntrypoint("state/openclaw-database-verify.worker"),
		stateOwnership: runtimeProcessEntrypoint("state/openclaw-state-ownership.worker"),
		stateLeaseHeartbeat: runtimeProcessEntrypoint("state/openclaw-state-lease-heartbeat.worker"),
		gatewayStateOwnerHeartbeat: runtimeProcessEntrypoint("infra/gateway-state-owner-heartbeat.worker"),
		sessionTranscriptArchive: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-archive.worker"),
		sessionTranscript: runtimeProcessEntrypoint("config/sessions/session-transcript.worker"),
		workerTranscriptCommit: runtimeProcessEntrypoint("gateway/worker-environments/transcript-commit.worker"),
		sessionManagerMetadata: runtimeProcessEntrypoint("agents/sessions/session-manager-metadata.worker"),
		sessionTranscriptProjectionPublication: runtimeProcessEntrypoint("config/sessions/session-transcript-projection-publication.worker"),
		sessionTranscriptReports: runtimeProcessEntrypoint("config/sessions/session-accessor.sqlite-transcript-reports.worker"),
		sessionTranscriptReconcile: runtimeProcessEntrypoint("config/sessions/session-transcript-reconcile.worker"),
		tailscaleRouteOwner: runtimeProcessEntrypoint("infra/tailscale-route-owner.worker"),
		serviceChildRelay: runtimeProcessEntrypoint("process/supervisor/service-child-relay"),
		terminalPty: runtimeProcessEntrypoint("process/terminal-pty-worker"),
		serviceChildGroupAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-group-anchor"),
		serviceChildWindowsJobAnchor: runtimeProcessEntrypoint("process/supervisor/service-child-windows-job-anchor"),
		bunSqliteLibrary: runtimeProcessEntrypoint("infra/bun-sqlite-library")
	};
}
//#endregion
export { raceWithTimeout as a, canUseRootFileOpen as c, racePromiseWithAbortSignal as i, openRootFileSync as l, createAbortError as n, sleepWithAbort as o, createRetryRunner as r, toRetryError as s, createRuntimeProcessEntrypoints as t };
