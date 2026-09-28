import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { E as writeMatrixRecoveryKeyStateForPathAsync, _ as readLegacyMatrixRecoveryKeyFile, f as migrateLegacyMatrixRecoveryKeyFilePathToStoreAsync, x as readMatrixRecoveryKeyStateForPathAsync } from "./storage-metadata-fHN6Df2m.mjs";
import { r as withoutMatrixSendCurrentness, t as captureMatrixSendCurrentness } from "./send-currentness-BrGXL7b8.mjs";
import { i as parseMxc, r as matrixEventToRaw } from "./event-helpers-CspuhE9k.mjs";
import { n as isMatrixNotFoundError, t as formatMatrixErrorReason } from "./errors-DKVS3_DO.mjs";
import { a as createMatrixStartupAbortError, i as awaitMatrixStartupWithAbort, s as throwIfMatrixStartupAborted } from "./client-ChrXpxos.mjs";
import { n as createMatrixGuardedFetch, t as MatrixAuthedHttpClient } from "./http-client-Bi6uKmzh.mjs";
import { n as resolveMatrixRoomKeyBackupReadinessError } from "./backup-health-Dm_YMVFT.mjs";
import { n as LogService, r as noop, t as ConsoleLogger } from "./logger-xBjiRIp1.mjs";
import { t as createMatrixJsSdkClientLogger } from "./logging-rgm8ep9H.mjs";
import { t as MATRIX_IDB_PERSIST_INTERVAL_MS } from "./idb-persistence-lock-B3fZXyF_.mjs";
import { a as isMatrixAccessTokenInvalidatedError, c as resolveMatrixLocalTimeoutMs, f as isMatrixReadySyncState, i as createMatrixExplicitBootstrapOptions, l as unresolvedMatrixDeviceVerificationStatus, n as MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS, o as resolveMatrixDiagnostic, p as isMatrixTerminalSyncState, r as MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS, s as resolveMatrixDiagnosticResult, t as MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS, u as unresolvedMatrixRoomKeyBackupStatus } from "./client-support-Bn9Bk0-H.mjs";
import { createRequire } from "node:module";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { normalizeNullableString, normalizeStringEntries, uniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import path from "node:path";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { AsyncLocalStorage } from "node:async_hooks";
import { KeyedAsyncQueue } from "openclaw/plugin-sdk/keyed-async-queue";
import { captureChannelReadAuthority } from "openclaw/plugin-sdk/fetch-runtime";
import { ClientEvent, EventType, Filter, MatrixError, MatrixEventEvent, MsgType, Preset, createClient } from "matrix-js-sdk/lib/matrix.js";
import { EventEmitter } from "node:events";
import { RoomEvent } from "matrix-js-sdk/lib/models/room.js";
import { VerificationMethod } from "matrix-js-sdk/lib/types.js";
import { SyncApi, SyncState } from "matrix-js-sdk/lib/sync.js";
import { decodeRecoveryKey } from "matrix-js-sdk/lib/crypto-api/recovery-key.js";
import { MatrixScheduler } from "matrix-js-sdk/lib/scheduler.js";
import { EventStatus } from "matrix-js-sdk/lib/models/event-status.js";
//#region extensions/matrix/src/matrix/sdk/client-device-info.ts
async function resolveMatrixCrossSigningPublicationStatus(params) {
	if (!params.userId) return {
		userId: null,
		masterKeyPublished: false,
		selfSigningKeyPublished: false,
		userSigningKeyPublished: false,
		published: false
	};
	try {
		const response = await params.query();
		const masterKeyPublished = Boolean(response.master_keys?.[params.userId]);
		const selfSigningKeyPublished = Boolean(response.self_signing_keys?.[params.userId]);
		const userSigningKeyPublished = Boolean(response.user_signing_keys?.[params.userId]);
		return {
			userId: params.userId,
			masterKeyPublished,
			selfSigningKeyPublished,
			userSigningKeyPublished,
			published: masterKeyPublished && selfSigningKeyPublished && userSigningKeyPublished
		};
	} catch {
		return {
			userId: params.userId,
			masterKeyPublished: false,
			selfSigningKeyPublished: false,
			userSigningKeyPublished: false,
			published: false
		};
	}
}
async function listMatrixOwnDevices(client) {
	const currentDeviceId = client.getDeviceId()?.trim() || null;
	const devices = await client.getDevices();
	return (Array.isArray(devices?.devices) ? devices.devices : []).map((device) => ({
		deviceId: device.device_id,
		displayName: device.display_name?.trim() || null,
		lastSeenIp: device.last_seen_ip?.trim() || null,
		lastSeenTs: typeof device.last_seen_ts === "number" && Number.isFinite(device.last_seen_ts) ? device.last_seen_ts : null,
		current: currentDeviceId !== null && device.device_id === currentDeviceId
	}));
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-event-bridge.ts
function registerMatrixClientBridge(params) {
	let initialSyncComplete = false;
	const joinTransitions = /* @__PURE__ */ new WeakSet();
	params.client.on(RoomEvent.MyMembership, (room, membership, previousMembership) => {
		if (!initialSyncComplete || membership !== "join" || previousMembership === "join") return;
		const event = room.currentState.getStateEvents("m.room.member", params.getSelfUserId());
		if (event) joinTransitions.add(event);
	});
	params.client.on(ClientEvent.Event, (event) => {
		const roomId = event.getRoomId();
		if (!roomId) return;
		const raw = matrixEventToRaw(event, { contentMode: "original" });
		const isEncryptedEvent = raw.type === "m.room.encrypted";
		params.emitter.emit("room.event", roomId, raw);
		if (isEncryptedEvent) params.emitter.emit("room.encrypted_event", roomId, raw);
		else if (params.decryptBridge.shouldEmitUnencryptedMessage(roomId, raw.event_id)) params.emitter.emit("room.message", roomId, raw);
		const stateKey = raw.state_key ?? "";
		const selfUserId = params.getSelfUserId();
		const membership = raw.type === "m.room.member" ? raw.content.membership : void 0;
		if (stateKey && selfUserId && stateKey === selfUserId) {
			if (membership === "invite") params.emitter.emit("room.invite", roomId, raw);
			else if (membership === "join") params.emitter.emit("room.join", roomId, {
				...raw,
				membershipProvenance: joinTransitions.delete(event) ? "transition" : initialSyncComplete ? "update" : "snapshot"
			});
		}
		if (isEncryptedEvent) params.decryptBridge.attachEncryptedEvent(event, roomId);
	});
	params.client.on(ClientEvent.Room, params.emitMembershipForRoom);
	params.client.on(ClientEvent.Sync, (state, prevState, data) => {
		initialSyncComplete ||= state === "PREPARED" || state === "SYNCING";
		const error = data && typeof data === "object" && "error" in data ? data.error : void 0;
		params.setCurrentSyncState(state, error);
		params.emitter.emit("sync.state", state, prevState, error);
	});
	params.client.on(ClientEvent.SyncUnexpectedError, (error) => {
		params.emitter.emit("sync.unexpected_error", error);
	});
}
function emitMatrixMembershipForRoom(params) {
	const roomId = params.room.roomId.trim();
	if (!roomId || !params.selfUserId) return;
	const membership = params.room.getMyMembership();
	const raw = {
		event_id: `$membership-${roomId}-${Date.now()}`,
		type: "m.room.member",
		sender: params.selfUserId,
		state_key: params.selfUserId,
		content: { membership },
		origin_server_ts: Date.now(),
		unsigned: { age: 0 },
		membershipProvenance: "snapshot"
	};
	if (membership === "invite") {
		params.emitter.emit("room.invite", roomId, raw);
		return;
	}
	if (membership === "join") params.emitter.emit("room.join", roomId, raw);
}
function refreshMatrixDmRoomIds(direct, dmRoomIds) {
	dmRoomIds.clear();
	if (!direct || typeof direct !== "object") return false;
	for (const value of Object.values(direct)) {
		if (!Array.isArray(value)) continue;
		for (const roomId of value) if (typeof roomId === "string" && roomId.trim()) dmRoomIds.add(roomId);
	}
	return true;
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-sync-quiesce.ts
const MATRIX_SYNC_QUIESCE_TIMEOUT_MS = 5e3;
const MATRIX_JS_SDK_SYNC_VERSION = "42.3.0";
const matrixJsSdkPackage = createRequire(import.meta.url)("matrix-js-sdk/package.json");
function requireMatrixClassicSyncInternals(syncApi) {
	return syncApi;
}
function assertMatrixJsSdkSyncVersion() {
	const version = matrixJsSdkPackage.version;
	if (version !== MATRIX_JS_SDK_SYNC_VERSION) throw new Error(`Matrix sync quiesce requires matrix-js-sdk ${MATRIX_JS_SDK_SYNC_VERSION}; found ${String(version)}`);
}
async function quiesceMatrixClientSync(params) {
	await params.syncStore?.freezeSyncCursorPersistence();
	try {
		assertMatrixJsSdkSyncVersion();
	} catch (error) {
		params.syncStore?.discardPendingSyncCursorPersistence();
		throw error;
	}
	const syncApi = params.client.syncApi;
	if (syncApi === void 0 && !params.started) return;
	if (!(syncApi instanceof SyncApi)) {
		params.syncStore?.discardPendingSyncCursorPersistence();
		throw new Error(syncApi === void 0 ? "Matrix sync quiesce requires the classic matrix-js-sdk SyncApi, but none is active" : "Matrix sync quiesce rejected a sliding or unknown matrix-js-sdk sync implementation");
	}
	const syncState = syncApi.getSyncState();
	if (syncState === SyncState.Stopped) {
		params.markStopped();
		return;
	}
	const disconnectedBeforeStop = syncState === SyncState.Error || syncState === SyncState.Reconnecting;
	const syncInternals = requireMatrixClassicSyncInternals(syncApi);
	const keepaliveResolvers = disconnectedBeforeStop ? syncInternals.connectionReturnedResolvers : void 0;
	await new Promise((resolve, reject) => {
		let settled = false;
		const settle = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.emitter.off("sync.state", onSyncState);
			if (error) reject(error);
			else {
				params.markStopped();
				resolve();
			}
		};
		const onSyncState = (state) => {
			if (state === "STOPPED") settle();
		};
		const timeout = setTimeout(() => {
			params.syncStore?.discardPendingSyncCursorPersistence();
			settle(/* @__PURE__ */ new Error(`Matrix classic sync did not reach STOPPED within 5000ms`));
		}, MATRIX_SYNC_QUIESCE_TIMEOUT_MS);
		timeout.unref?.();
		params.emitter.on("sync.state", onSyncState);
		try {
			syncApi.stop();
			if (keepaliveResolvers && syncInternals.connectionReturnedResolvers === keepaliveResolvers) {
				syncInternals.connectionReturnedResolvers = void 0;
				keepaliveResolvers.reject("SyncApi.stop() was called");
				settle();
			}
		} catch (error) {
			params.syncStore?.discardPendingSyncCursorPersistence();
			settle(error instanceof Error ? error : new Error(String(error)));
		}
	});
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-sync-ready.ts
async function waitForMatrixInitialSyncReady(params) {
	const timeoutMs = params.timeoutMs ?? 3e4;
	if (isMatrixReadySyncState(params.state)) return;
	if (isMatrixAccessTokenInvalidatedError(params.error)) throw params.error instanceof Error ? params.error : new Error("Matrix access token invalidated", { cause: params.error });
	if (isMatrixTerminalSyncState(params.state)) throw new Error(`Matrix sync entered ${params.state} during startup`);
	await new Promise((resolve, reject) => {
		let settled = false;
		let timeoutId;
		const abortSignal = params.abortSignal;
		const cleanup = () => {
			params.emitter.off("sync.state", onSyncState);
			params.emitter.off("sync.unexpected_error", onUnexpectedError);
			abortSignal?.removeEventListener("abort", onAbort);
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		const settleResolve = () => {
			if (settled) return;
			settled = true;
			cleanup();
			resolve();
		};
		const settleReject = (error) => {
			if (settled) return;
			settled = true;
			cleanup();
			reject(error);
		};
		const onSyncState = (state, _prevState, error) => {
			if (isMatrixReadySyncState(state)) {
				settleResolve();
				return;
			}
			if (isMatrixAccessTokenInvalidatedError(error)) {
				settleReject(error instanceof Error ? error : /* @__PURE__ */ new Error("Matrix access token invalidated"));
				return;
			}
			if (isMatrixTerminalSyncState(state)) settleReject(new Error(error instanceof Error && error.message ? error.message : `Matrix sync entered ${state} during startup`));
		};
		const onUnexpectedError = (error) => {
			settleReject(error);
		};
		const onAbort = () => {
			settleReject(createMatrixStartupAbortError());
		};
		params.emitter.on("sync.state", onSyncState);
		params.emitter.on("sync.unexpected_error", onUnexpectedError);
		if (abortSignal?.aborted) {
			onAbort();
			return;
		}
		abortSignal?.addEventListener("abort", onAbort, { once: true });
		timeoutId = setTimeout(() => {
			settleReject(/* @__PURE__ */ new Error(`Matrix client did not reach a ready sync state within ${timeoutMs}ms`));
		}, timeoutMs);
		timeoutId.unref?.();
	});
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/message-wire-dispatch.ts
function resolveMessageWireDispatch(resource, init) {
	if ((init?.method ?? (resource instanceof Request ? resource.method : "GET")).toUpperCase() !== "PUT") return null;
	const rawUrl = typeof resource === "string" ? resource : resource instanceof URL ? resource.href : resource.url;
	const segments = new URL(rawUrl).pathname.split("/").filter(Boolean);
	const roomsIndex = segments.lastIndexOf("rooms");
	if (roomsIndex < 0 || segments[roomsIndex + 2] !== "send" || segments.length !== roomsIndex + 5) return null;
	const eventType = decodeURIComponent(segments[roomsIndex + 3] ?? "");
	if (eventType !== "m.room.message" && eventType !== "m.room.encrypted") return null;
	return {
		roomId: decodeURIComponent(segments[roomsIndex + 1] ?? ""),
		eventType,
		transactionId: decodeURIComponent(segments[roomsIndex + 4] ?? ""),
		requestPath: new URL(rawUrl).pathname
	};
}
var MatrixMessageWireDispatchGuards = class {
	constructor() {
		this.guards = /* @__PURE__ */ new Map();
	}
	captureCurrentness(resource, init, fallback) {
		const dispatch = resolveMessageWireDispatch(resource, init);
		const entry = dispatch ? this.guards.get(dispatch.transactionId) : void 0;
		if (!entry) return fallback;
		const assertCurrent = entry.assertCurrent;
		return assertCurrent ? () => {
			try {
				assertCurrent();
			} catch (error) {
				entry.currentnessRejected = true;
				throw error;
			}
		} : void 0;
	}
	wasCurrentnessRejected(transactionId) {
		return transactionId !== void 0 && this.guards.get(transactionId)?.currentnessRejected === true;
	}
	beforeRequest(resource, init) {
		const dispatch = resolveMessageWireDispatch(resource, init);
		return dispatch ? Promise.resolve(this.guards.get(dispatch.transactionId)?.guard?.(dispatch)) : void 0;
	}
	async run(params) {
		if (!params.transactionId || !params.guard && !params.assertCurrent) return await params.run();
		if (this.guards.has(params.transactionId)) throw new Error(`Matrix transaction ${params.transactionId} already has a dispatch guard`);
		this.guards.set(params.transactionId, {
			guard: params.guard,
			assertCurrent: params.assertCurrent
		});
		try {
			return await params.run();
		} finally {
			this.guards.delete(params.transactionId);
		}
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/recovery-key-store.ts
function isRepairableSecretStorageAccessError(err) {
	const message = formatMatrixErrorReason(err);
	if (!message) return false;
	if (message.includes("getsecretstoragekey callback returned falsey")) return true;
	if (message.includes("decrypting secret") && message.includes("bad mac")) return true;
	return false;
}
var MatrixRecoveryKeyStore = class {
	constructor(recoveryKeyPath, stateRuntime) {
		this.secretStorageKeyCache = /* @__PURE__ */ new Map();
		this.stagedRecoveryKey = null;
		this.stagedRecoveryKeyUsed = false;
		this.stagedCacheKeyIds = /* @__PURE__ */ new Set();
		this.pendingPersistence = Promise.resolve();
		this.closed = false;
		this.recoveryKeyPath = recoveryKeyPath;
		this.storageRootDir = recoveryKeyPath ? path.dirname(recoveryKeyPath) : void 0;
		if (recoveryKeyPath) {
			this.stateRuntime = stateRuntime ?? getMatrixRuntime().state;
			const runtime = this.stateRuntime;
			this.enqueuePersistence(async () => {
				try {
					await migrateLegacyMatrixRecoveryKeyFilePathToStoreAsync(recoveryKeyPath, runtime);
				} catch (err) {
					this.legacyRecoveryKeyPathOnMigrationFailure = recoveryKeyPath;
					LogService.warn("MatrixClientLite", "Failed to migrate Matrix recovery key state:", err);
				}
			});
		}
	}
	enqueuePersistence(run) {
		if (this.closed) return Promise.reject(/* @__PURE__ */ new Error("Matrix recovery key store is closed"));
		const pending = this.pendingPersistence.then(run);
		this.pendingPersistence = pending.then(() => {}, () => {});
		return pending;
	}
	async afterPersistence(read) {
		for (;;) {
			const pending = this.pendingPersistence;
			await pending;
			if (pending === this.pendingPersistence) return read();
		}
	}
	async drainPendingPersistence() {
		await this.afterPersistence(() => {});
	}
	async close() {
		this.closed = true;
		await this.drainPendingPersistence();
	}
	buildCryptoCallbacks() {
		const getSecretStorageKey = ({ keys }) => this.afterPersistence(async () => {
			if (this.closed) return null;
			const requestedKeyIds = Object.keys(keys ?? {});
			if (requestedKeyIds.length === 0) return null;
			const staged = this.resolveStagedSecretStorageKey(requestedKeyIds);
			if (staged) return staged;
			for (const keyId of requestedKeyIds) {
				const cached = this.secretStorageKeyCache.get(keyId);
				if (cached) return [keyId, new Uint8Array(cached.key)];
			}
			const pending = this.pendingPersistence;
			const stored = await this.loadStoredRecoveryKey();
			if (this.closed) return null;
			if (pending !== this.pendingPersistence) return getSecretStorageKey({ keys });
			if (!stored?.privateKeyBase64) return null;
			const privateKey = new Uint8Array(Buffer.from(stored.privateKeyBase64, "base64"));
			if (privateKey.length === 0) return null;
			if (stored.keyId && requestedKeyIds.includes(stored.keyId)) {
				this.rememberSecretStorageKey(stored.keyId, privateKey, stored.keyInfo);
				return [stored.keyId, privateKey];
			}
			const firstRequestedKeyId = requestedKeyIds[0];
			if (!firstRequestedKeyId) return null;
			this.rememberSecretStorageKey(firstRequestedKeyId, privateKey, stored.keyInfo);
			return [firstRequestedKeyId, privateKey];
		});
		return {
			getSecretStorageKey,
			cacheSecretStorageKey: (keyId, keyInfo, key) => {
				if (this.closed) return;
				const privateKey = new Uint8Array(key);
				const normalizedKeyInfo = {
					passphrase: keyInfo?.passphrase,
					name: typeof keyInfo?.name === "string" ? keyInfo.name : void 0
				};
				this.rememberSecretStorageKey(keyId, privateKey, normalizedKeyInfo);
				this.saveRecoveryKeyToDisk({
					keyId,
					keyInfo: normalizedKeyInfo,
					privateKey
				}, true);
			}
		};
	}
	async getRecoveryKeySummary() {
		const stored = await this.afterPersistence(() => this.loadStoredRecoveryKey());
		if (!stored) return null;
		return {
			encodedPrivateKey: stored.encodedPrivateKey,
			keyId: stored.keyId,
			createdAt: stored.createdAt
		};
	}
	getSecretStorageKeyCandidate(keyId) {
		return this.afterPersistence(async () => {
			if (this.closed) return null;
			const normalizedKeyId = keyId.trim();
			if (!normalizedKeyId) return null;
			const staged = this.resolveStagedSecretStorageKey([normalizedKeyId]);
			if (staged) return staged[1];
			const pending = this.pendingPersistence;
			const stored = await this.loadStoredRecoveryKey();
			if (this.closed) return null;
			if (pending !== this.pendingPersistence) return this.getSecretStorageKeyCandidate(keyId);
			if (!stored?.privateKeyBase64) return null;
			const privateKey = new Uint8Array(Buffer.from(stored.privateKeyBase64, "base64"));
			if (privateKey.length === 0) return null;
			this.rememberSecretStorageKey(normalizedKeyId, privateKey, stored.keyInfo);
			return privateKey;
		});
	}
	resolveEncodedRecoveryKeyInput(params) {
		const encodedPrivateKey = params.encodedPrivateKey.trim();
		if (!encodedPrivateKey) throw new Error("Matrix recovery key is required");
		let privateKey;
		try {
			privateKey = decodeRecoveryKey(encodedPrivateKey);
		} catch (err) {
			throw new Error(`Invalid Matrix recovery key: ${formatErrorMessage(err)}`, { cause: err });
		}
		const keyId = typeof params.keyId === "string" && params.keyId.trim() ? params.keyId.trim() : null;
		return {
			encodedPrivateKey,
			privateKey,
			keyId,
			keyInfo: params.keyInfo
		};
	}
	stageEncodedRecoveryKey(params) {
		const prepared = this.resolveEncodedRecoveryKeyInput(params);
		return this.enqueuePersistence(async () => {
			const keyInfo = prepared.keyInfo ?? (await this.loadStoredRecoveryKey())?.keyInfo;
			this.clearStagedCache();
			this.stagedRecoveryKey = {
				version: 1,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				keyId: prepared.keyId,
				encodedPrivateKey: prepared.encodedPrivateKey,
				privateKeyBase64: Buffer.from(prepared.privateKey).toString("base64"),
				keyInfo
			};
		});
	}
	hasStagedRecoveryKeyBeenUsed() {
		return this.stagedRecoveryKeyUsed;
	}
	async commitStagedRecoveryKey(params) {
		await this.enqueuePersistence(async () => {
			if (!this.stagedRecoveryKey) return;
			const staged = this.stagedRecoveryKey;
			const privateKey = new Uint8Array(Buffer.from(staged.privateKeyBase64, "base64"));
			const keyId = typeof params?.keyId === "string" && params.keyId.trim() ? params.keyId.trim() : staged.keyId;
			await this.persistRecoveryKey({
				keyId,
				keyInfo: params?.keyInfo ?? staged.keyInfo,
				privateKey,
				encodedPrivateKey: staged.encodedPrivateKey
			});
			this.clearStagedRecoveryKeyTracking();
		});
		return this.getRecoveryKeySummary();
	}
	discardStagedRecoveryKey() {
		return this.enqueuePersistence(async () => this.clearStagedCache());
	}
	clearStagedCache() {
		for (const keyId of this.stagedCacheKeyIds) this.secretStorageKeyCache.delete(keyId);
		this.clearStagedRecoveryKeyTracking();
	}
	async bootstrapSecretStorageWithRecoveryKey(crypto, options = {}) {
		await this.drainPendingPersistence();
		let status = null;
		const getSecretStorageStatus = crypto.getSecretStorageStatus;
		if (typeof getSecretStorageStatus === "function") try {
			status = await getSecretStorageStatus.call(crypto);
		} catch (err) {
			LogService.warn("MatrixClientLite", "Failed to read secret storage status:", err);
		}
		const hasDefaultSecretStorageKey = Boolean(status?.defaultKeyId);
		const hasKnownInvalidSecrets = Object.values(status?.secretStorageKeyValidityMap ?? {}).some((valid) => !valid);
		let generatedRecoveryKey = false;
		const storedRecovery = await this.afterPersistence(() => this.loadStoredRecoveryKey());
		const stagedRecovery = this.stagedRecoveryKey;
		const sourceRecovery = options.forceNewRecoveryKey === true ? null : stagedRecovery ?? storedRecovery;
		let recoveryKey = sourceRecovery ? {
			keyInfo: sourceRecovery.keyInfo,
			privateKey: new Uint8Array(Buffer.from(sourceRecovery.privateKeyBase64, "base64")),
			encodedPrivateKey: sourceRecovery.encodedPrivateKey
		} : null;
		if (recoveryKey && status?.defaultKeyId) {
			const defaultKeyId = status.defaultKeyId;
			if (!stagedRecovery) {
				this.rememberSecretStorageKey(defaultKeyId, recoveryKey.privateKey, recoveryKey.keyInfo);
				if (storedRecovery && storedRecovery.keyId !== defaultKeyId) await this.saveRecoveryKeyToDisk({
					keyId: defaultKeyId,
					keyInfo: recoveryKey.keyInfo,
					privateKey: recoveryKey.privateKey,
					encodedPrivateKey: recoveryKey.encodedPrivateKey
				});
			}
		}
		const ensureRecoveryKey = async () => {
			if (recoveryKey) {
				if (stagedRecovery) this.stagedRecoveryKeyUsed = true;
				return recoveryKey;
			}
			if (typeof crypto.createRecoveryKeyFromPassphrase !== "function") throw new Error("Matrix crypto backend does not support recovery key generation (createRecoveryKeyFromPassphrase missing)");
			recoveryKey = await crypto.createRecoveryKeyFromPassphrase();
			await this.saveRecoveryKeyToDisk(recoveryKey);
			generatedRecoveryKey = true;
			return recoveryKey;
		};
		const shouldRecreateSecretStorage = options.forceNewSecretStorage === true || !hasDefaultSecretStorageKey || !recoveryKey && status?.ready === false || hasKnownInvalidSecrets;
		if (hasKnownInvalidSecrets) recoveryKey = null;
		const secretStorageOptions = { setupNewKeyBackup: options.setupNewKeyBackup === true };
		if (shouldRecreateSecretStorage) {
			secretStorageOptions.setupNewSecretStorage = true;
			secretStorageOptions.createSecretStorageKey = ensureRecoveryKey;
		}
		try {
			try {
				await crypto.bootstrapSecretStorage(secretStorageOptions);
			} finally {
				await this.drainPendingPersistence();
			}
		} catch (err) {
			if (!(options.allowSecretStorageRecreateWithoutRecoveryKey === true && hasDefaultSecretStorageKey && isRepairableSecretStorageAccessError(err))) throw err;
			recoveryKey = null;
			LogService.warn("MatrixClientLite", "Secret storage exists on the server but local recovery material cannot unlock it; recreating secret storage during explicit bootstrap.");
			try {
				await crypto.bootstrapSecretStorage({
					setupNewSecretStorage: true,
					setupNewKeyBackup: options.setupNewKeyBackup === true,
					createSecretStorageKey: ensureRecoveryKey
				});
			} finally {
				await this.drainPendingPersistence();
			}
		}
		if (generatedRecoveryKey && this.storageRootDir) LogService.warn("MatrixClientLite", "Generated Matrix recovery key and saved it to Matrix SQLite state. Keep the displayed recovery key secure.");
	}
	clearStagedRecoveryKeyTracking() {
		this.stagedRecoveryKey = null;
		this.stagedRecoveryKeyUsed = false;
		this.stagedCacheKeyIds.clear();
	}
	resolveStagedSecretStorageKey(requestedKeyIds) {
		const staged = this.stagedRecoveryKey;
		if (!staged?.privateKeyBase64) return null;
		const privateKey = new Uint8Array(Buffer.from(staged.privateKeyBase64, "base64"));
		if (privateKey.length === 0) return null;
		const keyId = staged.keyId && requestedKeyIds.includes(staged.keyId) ? staged.keyId : requestedKeyIds[0];
		if (!keyId) return null;
		this.rememberStagedSecretStorageKey(keyId, privateKey, staged.keyInfo);
		this.stagedCacheKeyIds.add(keyId);
		return [keyId, privateKey];
	}
	rememberStagedSecretStorageKey(keyId, key, keyInfo) {
		this.stagedRecoveryKeyUsed = true;
		this.rememberSecretStorageKey(keyId, key, keyInfo);
	}
	rememberSecretStorageKey(keyId, key, keyInfo) {
		if (!keyId.trim()) return;
		this.secretStorageKeyCache.set(keyId, {
			key: new Uint8Array(key),
			keyInfo
		});
	}
	async loadStoredRecoveryKey() {
		if (!this.recoveryKeyPath || !this.stateRuntime) return null;
		try {
			const stored = await readMatrixRecoveryKeyStateForPathAsync(this.recoveryKeyPath, this.stateRuntime);
			if (stored) return stored;
		} catch {}
		if (this.legacyRecoveryKeyPathOnMigrationFailure) return readLegacyMatrixRecoveryKeyFile(this.legacyRecoveryKeyPathOnMigrationFailure);
		return null;
	}
	saveRecoveryKeyToDisk(params, preserveEncodedPrivateKey = false) {
		return this.enqueuePersistence(() => this.persistRecoveryKey(params, preserveEncodedPrivateKey));
	}
	async persistRecoveryKey(params, preserveEncodedPrivateKey = false) {
		if (!this.recoveryKeyPath || !this.stateRuntime) return;
		try {
			const payload = {
				version: 1,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				keyId: typeof params.keyId === "string" ? params.keyId : null,
				encodedPrivateKey: params.encodedPrivateKey,
				privateKeyBase64: Buffer.from(params.privateKey).toString("base64"),
				keyInfo: params.keyInfo ? {
					passphrase: params.keyInfo.passphrase,
					name: params.keyInfo.name
				} : void 0
			};
			await writeMatrixRecoveryKeyStateForPathAsync({
				recoveryKeyPath: this.recoveryKeyPath,
				payload,
				stateRuntime: this.stateRuntime,
				preserveEncodedPrivateKey
			});
		} catch (err) {
			LogService.warn("MatrixClientLite", "Failed to persist recovery key:", err);
		}
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/send-scheduler.ts
/** Keep SDK FIFO/backoff while settling a caller's pre-request rejection only for its event. */
var MatrixSendScheduler = class extends MatrixScheduler {
	constructor(wasCurrentnessRejected) {
		super();
		this.wasCurrentnessRejected = wasCurrentnessRejected;
		this.queue = new MatrixScheduler();
	}
	setProcessFunction(processEvent) {
		this.queue.setProcessFunction(async (event) => {
			try {
				return {
					kind: "sent",
					result: await withoutMatrixSendCurrentness(() => processEvent(event))
				};
			} catch (error) {
				if (!this.wasCurrentnessRejected(event)) throw error;
				return {
					kind: "rejected",
					error
				};
			}
		});
	}
	queueEvent(event) {
		const queued = this.queue.queueEvent(event);
		return queued ? queued.then((outcome) => {
			if (outcome.kind === "rejected") throw outcome.error;
			return outcome.result;
		}) : null;
	}
	getQueueForEvent(event) {
		return this.queue.getQueueForEvent(event);
	}
	removeEventFromQueue(event) {
		return this.queue.removeEventFromQueue(event);
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-base.ts
const MATRIX_ENCRYPTED_STARTUP_TIMEOUT_MS = 6e4;
let loadedMatrixCryptoRuntime = null;
const loadMatrixCryptoRuntime = createLazyRuntimeModule(() => import("./crypto-runtime-D9qn_Pbj.mjs").then((runtime) => {
	loadedMatrixCryptoRuntime = runtime;
	return runtime;
}));
var MatrixClientBase = class {
	withClientCryptoWork(run, requestSignal) {
		this.assertClientActive();
		return withoutMatrixSendCurrentness(() => this.cryptoRequestOwner.run({
			callerAuthority: captureChannelReadAuthority(),
			requestSignal
		}, run));
	}
	constructor(homeserver, accessToken, opts = {}) {
		this.emitter = new EventEmitter();
		this.bridgeRegistered = false;
		this.started = false;
		this.cryptoBootstrapped = false;
		this.dmRoomIds = /* @__PURE__ */ new Set();
		this.cryptoInitialized = false;
		this.sendQueue = new KeyedAsyncQueue();
		this.syncQuiescePromise = null;
		this.stopPersistPromise = null;
		this.verificationSummaryListenerBound = false;
		this.currentSyncState = null;
		this.currentSyncError = void 0;
		this.transactionScopeId = null;
		this.transactionScopePromise = null;
		this.messageWireDispatchGuards = new MatrixMessageWireDispatchGuards();
		this.requestAbortController = new AbortController();
		this.cryptoRequestOwner = new AsyncLocalStorage();
		this.startupPromise = null;
		this.cryptoInitializationPromise = null;
		this.sdkStopped = false;
		this.stopDiscardPromise = null;
		this.idbPersistPromise = null;
		this.idbPersistAbortController = null;
		this.assertClientActive = () => {
			this.requestAbortController.signal.throwIfAborted();
		};
		this.captureRequestAuthority = () => {
			const readAuthority = captureChannelReadAuthority();
			const cryptoOwner = this.cryptoRequestOwner.getStore();
			return cryptoOwner && cryptoOwner.callerAuthority === readAuthority ? this.assertClientActive : readAuthority;
		};
		this.dms = {
			update: async () => {
				return await this.refreshDmCache();
			},
			isDm: (roomId) => this.dmRoomIds.has(roomId)
		};
		this.idbPersistTimer = null;
		this.transactionScopeHomeserver = homeserver;
		this.transactionScopeAccessTokenHash = createHash("sha256").update(accessToken).digest("hex");
		this.transactionScopeDeviceId = opts.deviceId?.trim() || null;
		this.httpClient = new MatrixAuthedHttpClient({
			homeserver,
			accessToken,
			ssrfPolicy: opts.ssrfPolicy,
			dispatcherPolicy: opts.dispatcherPolicy,
			captureRequestAuthority: this.captureRequestAuthority,
			captureSendCurrentness: () => captureMatrixSendCurrentness(this),
			signal: this.requestAbortController.signal
		});
		this.localTimeoutMs = resolveMatrixLocalTimeoutMs(opts.localTimeoutMs);
		this.initialSyncLimit = opts.initialSyncLimit;
		this.syncFilter = opts.syncFilter;
		this.encryptionEnabled = opts.encryption === true;
		const { password: loginPassword } = opts;
		this.password = loginPassword;
		this.syncStore = opts.syncStore;
		this.idbSnapshotPath = opts.idbSnapshotPath;
		this.cryptoDatabasePrefix = opts.cryptoDatabasePrefix;
		this.stateRuntime = opts.stateRuntime;
		this.selfUserId = opts.userId?.trim() || null;
		this.autoBootstrapCrypto = opts.autoBootstrapCrypto !== false;
		this.recoveryKeyStore = new MatrixRecoveryKeyStore(opts.recoveryKeyPath, opts.stateRuntime);
		const cryptoCallbacks = this.encryptionEnabled ? this.recoveryKeyStore.buildCryptoCallbacks() : void 0;
		const guardedFetch = createMatrixGuardedFetch({
			captureRequestSignal: () => this.cryptoRequestOwner.getStore()?.requestSignal,
			ssrfPolicy: opts.ssrfPolicy,
			dispatcherPolicy: opts.dispatcherPolicy,
			captureRequestAuthority: this.captureRequestAuthority,
			captureSendCurrentness: (resource, init) => this.messageWireDispatchGuards.captureCurrentness(resource, init, captureMatrixSendCurrentness(this)),
			signal: this.requestAbortController.signal,
			beforeRequest: async (resource, init) => {
				await this.recoveryKeyStore.drainPendingPersistence();
				await this.messageWireDispatchGuards.beforeRequest(resource, init);
			}
		});
		this.client = createClient({
			baseUrl: homeserver,
			accessToken,
			userId: opts.userId,
			deviceId: opts.deviceId,
			logger: createMatrixJsSdkClientLogger("MatrixClient"),
			localTimeoutMs: this.localTimeoutMs,
			fetchFn: guardedFetch,
			scheduler: new MatrixSendScheduler((event) => this.messageWireDispatchGuards.wasCurrentnessRejected(event.getTxnId())),
			store: this.syncStore,
			cryptoCallbacks,
			verificationMethods: [
				VerificationMethod.Sas,
				VerificationMethod.ShowQrCode,
				VerificationMethod.ScanQrCode,
				VerificationMethod.Reciprocate
			]
		});
		const decryptEventIfNeeded = this.client.decryptEventIfNeeded.bind(this.client);
		this.client.decryptEventIfNeeded = (event, options) => {
			this.captureRequestAuthority()?.();
			return this.withClientCryptoWork(() => decryptEventIfNeeded(event, options));
		};
	}
	on(eventName, listener) {
		this.emitter.on(eventName, listener);
		return this;
	}
	off(eventName, listener) {
		this.emitter.off(eventName, listener);
		return this;
	}
	async ensureCryptoSupportInitialized() {
		if (this.decryptBridge && (!this.encryptionEnabled || this.verificationManager && this.cryptoBootstrapper && this.crypto)) return;
		const runtime = await loadMatrixCryptoRuntime();
		this.decryptBridge ??= new runtime.MatrixDecryptBridge({
			client: this.client,
			toRaw: (event) => matrixEventToRaw(event, { contentMode: "original" }),
			emitDecryptedEvent: (roomId, event) => {
				this.emitter.emit("room.decrypted_event", roomId, event);
			},
			emitMessage: (roomId, event) => {
				this.emitter.emit("room.message", roomId, event);
			},
			emitFailedDecryption: (roomId, event, error) => {
				this.emitter.emit("room.failed_decryption", roomId, event, error);
			}
		});
		if (!this.encryptionEnabled) return;
		this.verificationManager ??= new runtime.MatrixVerificationManager({ trustOwnDeviceAfterSas: async (deviceId) => {
			const crypto = this.client.getCrypto();
			if (typeof crypto?.crossSignDevice !== "function") return;
			await crypto.crossSignDevice(deviceId);
		} });
		this.cryptoBootstrapper ??= new runtime.MatrixCryptoBootstrapper({
			getUserId: () => this.getUserId(),
			getPassword: () => this.password,
			canUnlockSecretStorage: async () => {
				const secretStorage = this.client.secretStorage;
				if (!secretStorage || typeof secretStorage.getDefaultKeyId !== "function" || typeof secretStorage.getKey !== "function" || typeof secretStorage.checkKey !== "function") return false;
				const defaultKeyId = await secretStorage.getDefaultKeyId();
				if (!defaultKeyId) return false;
				const keyTuple = await secretStorage.getKey(defaultKeyId);
				const key = await this.recoveryKeyStore.getSecretStorageKeyCandidate(defaultKeyId);
				if (!keyTuple || !key) return false;
				const keyInfo = keyTuple[1];
				if (!keyInfo.iv?.trim() || !keyInfo.mac?.trim()) return false;
				return await secretStorage.checkKey(key, keyInfo);
			},
			getDeviceId: () => this.client.getDeviceId(),
			verificationManager: this.verificationManager,
			recoveryKeyStore: this.recoveryKeyStore,
			decryptBridge: this.decryptBridge
		});
		if (!this.crypto) this.crypto = runtime.createMatrixCryptoFacade({
			client: this.client,
			verificationManager: this.verificationManager,
			recoveryKeyStore: this.recoveryKeyStore,
			isRoomEncrypted: async (roomId) => await this.getMessageWireEventType(roomId) === "m.room.encrypted",
			downloadContent: (mxcUrl, opts) => this.downloadContent(mxcUrl, opts)
		});
		if (!this.verificationSummaryListenerBound) {
			this.verificationSummaryListenerBound = true;
			this.verificationManager.onSummaryChanged((summary) => {
				this.emitter.emit("verification.summary", summary);
			});
		}
	}
	async start(opts = {}) {
		await this.startSyncSession({
			bootstrapCrypto: true,
			abortSignal: opts.abortSignal,
			readyTimeoutMs: opts.readyTimeoutMs
		});
	}
	async waitForInitialSyncReady(params = {}) {
		await waitForMatrixInitialSyncReady({
			...params,
			emitter: this.emitter,
			state: this.currentSyncState,
			error: this.currentSyncError
		});
	}
	async startSyncSession(opts) {
		if (this.started) return;
		if (this.sdkStopped) throw new Error("Matrix client has been fully stopped and cannot be restarted; acquire a new shared client generation");
		const assertCurrent = this.captureRequestAuthority();
		assertCurrent?.();
		this.assertClientActive();
		if (this.startupPromise) {
			await awaitMatrixStartupWithAbort(this.startupPromise, opts.abortSignal);
			return;
		}
		const deadline = new AbortController();
		const signal = AbortSignal.any([
			this.requestAbortController.signal,
			deadline.signal,
			...opts.abortSignal ? [opts.abortSignal] : []
		]);
		const timeout = this.encryptionEnabled ? setTimeout(() => deadline.abort(), opts.readyTimeoutMs ?? MATRIX_ENCRYPTED_STARTUP_TIMEOUT_MS) : void 0;
		timeout?.unref?.();
		const checkActive = () => {
			throwIfMatrixStartupAborted(signal);
			assertCurrent?.();
			this.assertClientActive();
		};
		const startup = (async () => {
			throwIfMatrixStartupAborted(signal);
			await this.ensureCryptoSupportInitialized();
			checkActive();
			throwIfMatrixStartupAborted(signal);
			this.registerBridge();
			await this.withClientCryptoWork(() => this.initializeCryptoIfNeeded(signal), signal);
			checkActive();
			throwIfMatrixStartupAborted(signal);
			await this.withClientCryptoWork(() => this.client.startClient({
				initialSyncLimit: this.initialSyncLimit,
				...this.syncFilter ? { filter: Filter.fromJson(this.selfUserId, "", this.syncFilter) } : {}
			}));
			await this.waitForInitialSyncReady({
				abortSignal: signal,
				timeoutMs: opts.readyTimeoutMs
			});
			checkActive();
			throwIfMatrixStartupAborted(signal);
			if (this.encryptionEnabled && this.cryptoInitialized) {
				const { reconcileJoinedRoomEncryption } = await import("./joined-room-encryption-BCtxQ3hR.mjs");
				checkActive();
				await this.withClientCryptoWork(() => reconcileJoinedRoomEncryption(this.client, signal, checkActive), signal);
				checkActive();
			}
			clearTimeout(timeout);
			if (opts.bootstrapCrypto && this.autoBootstrapCrypto) await this.bootstrapCryptoIfNeeded(signal);
			throwIfMatrixStartupAborted(signal);
			this.started = true;
			this.emitOutstandingInviteEvents();
			await this.refreshDmCache().catch(noop);
		})();
		this.startupPromise = startup;
		startup.finally(() => {
			clearTimeout(timeout);
			if (this.startupPromise === startup) this.startupPromise = null;
		}).catch(noop);
		await awaitMatrixStartupWithAbort(startup, signal);
	}
	async prepareForOneOff() {
		const assertCurrent = this.captureRequestAuthority();
		assertCurrent?.();
		this.assertClientActive();
		if (!this.encryptionEnabled) return;
		await this.ensureCryptoSupportInitialized();
		assertCurrent?.();
		await this.withClientCryptoWork(() => this.initializeCryptoIfNeeded());
		assertCurrent?.();
	}
	hasPersistedSyncState() {
		return this.syncStore?.hasSavedSyncFromCleanShutdown() === true;
	}
	async ensureStartedForCryptoControlPlane() {
		if (this.started) return;
		await this.startSyncSession({ bootstrapCrypto: false });
	}
	stopSdkClient() {
		if (this.sdkStopped) return;
		this.currentSyncState = null;
		this.currentSyncError = void 0;
		this.sdkStopped = true;
		this.client.stopClient();
		this.started = false;
	}
	async quiesceSync() {
		this.syncQuiescePromise ??= quiesceMatrixClientSync({
			client: this.client,
			emitter: this.emitter,
			markStopped: () => {
				this.started = false;
			},
			started: this.started,
			syncStore: this.syncStore
		});
		await this.syncQuiescePromise;
	}
	async drainPendingDecryptions(reason = "matrix client shutdown") {
		await this.withClientCryptoWork(() => this.decryptBridge?.drainPendingDecryptions(reason));
	}
	stop() {
		this.stopAndPersist().catch(() => this.stopWithoutPersist()).catch(noop);
	}
	async stopClientGeneration(persist) {
		try {
			if (persist) await this.quiesceSync();
			else {
				await this.quiesceSync().catch(noop);
				this.syncStore?.discardPendingSyncCursorPersistence();
			}
			this.requestAbortController.abort(/* @__PURE__ */ new Error("Matrix client generation is no longer active."));
			await this.startupPromise?.catch(noop);
			await this.cryptoInitializationPromise?.catch(noop);
			clearInterval(this.idbPersistTimer ?? void 0);
			this.idbPersistTimer = null;
			this.idbPersistAbortController?.abort();
			const activePeriodicPersist = this.idbPersistPromise;
			try {
				this.stopSdkClient();
				this.decryptBridge?.stop();
			} finally {
				this.cryptoRequestOwner.disable();
			}
			await Promise.all([this.recoveryKeyStore.close(), activePeriodicPersist]);
			if (persist) {
				await (loadedMatrixCryptoRuntime ?? await loadMatrixCryptoRuntime()).persistIdbToDisk({
					snapshotPath: this.idbSnapshotPath,
					databasePrefix: this.cryptoDatabasePrefix,
					strict: true,
					stateRuntime: this.stateRuntime
				});
				this.syncStore?.markCleanShutdown();
				await this.syncStore?.flush();
			}
		} finally {
			await this.recoveryKeyStore.close();
		}
	}
	async stopAndPersist() {
		this.stopPersistPromise ??= this.stopClientGeneration(true);
		await this.stopPersistPromise;
	}
	stopWithoutPersist() {
		if (!this.stopPersistPromise) this.stopPersistPromise = this.stopDiscardPromise = this.stopClientGeneration(false);
		return this.stopDiscardPromise ??= this.stopPersistPromise.catch(() => this.stopClientGeneration(false));
	}
	async bootstrapCryptoIfNeeded(abortSignal) {
		if (!this.encryptionEnabled || !this.cryptoInitialized || this.cryptoBootstrapped) return;
		throwIfMatrixStartupAborted(abortSignal);
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		if (!crypto) return;
		const cryptoBootstrapper = this.cryptoBootstrapper;
		if (!cryptoBootstrapper) return;
		const initial = await cryptoBootstrapper.bootstrap(crypto, MATRIX_INITIAL_CRYPTO_BOOTSTRAP_OPTIONS);
		throwIfMatrixStartupAborted(abortSignal);
		if (!initial.crossSigningPublished || initial.ownDeviceVerified === false) {
			if ((await this.getOwnDeviceVerificationStatus()).signedByOwner) LogService.warn("MatrixClientLite", "Cross-signing/bootstrap is incomplete for an already owner-signed device; skipping automatic reset and preserving the current identity. Restore the recovery key or run an explicit verification bootstrap if repair is needed.");
			else try {
				const repaired = await cryptoBootstrapper.bootstrap(crypto, MATRIX_AUTOMATIC_REPAIR_BOOTSTRAP_OPTIONS);
				throwIfMatrixStartupAborted(abortSignal);
				if (repaired.crossSigningPublished && repaired.ownDeviceVerified !== false) LogService.info("MatrixClientLite", "Cross-signing/bootstrap recovered after forced reset");
			} catch (err) {
				LogService.warn("MatrixClientLite", "Failed to recover cross-signing/bootstrap with forced reset:", err);
			}
		}
		this.cryptoBootstrapped = true;
	}
	async initializeCryptoIfNeeded(abortSignal) {
		if (!this.encryptionEnabled) return;
		if (this.cryptoInitializationPromise) {
			await this.cryptoInitializationPromise;
			throwIfMatrixStartupAborted(abortSignal);
			return;
		}
		if (this.cryptoInitialized) return;
		const initialization = this.initializeCrypto(abortSignal ? AbortSignal.any([abortSignal, this.requestAbortController.signal]) : this.requestAbortController.signal);
		this.cryptoInitializationPromise = initialization;
		try {
			await initialization;
		} finally {
			if (this.cryptoInitializationPromise === initialization) this.cryptoInitializationPromise = null;
		}
	}
	async initializeCrypto(abortSignal) {
		throwIfMatrixStartupAborted(abortSignal);
		const { persistIdbToDisk, restoreIdbFromDisk } = await loadMatrixCryptoRuntime();
		await restoreIdbFromDisk(this.idbSnapshotPath, this.stateRuntime);
		throwIfMatrixStartupAborted(abortSignal);
		try {
			await this.client.initRustCrypto({ cryptoDatabasePrefix: this.cryptoDatabasePrefix });
			this.cryptoInitialized = true;
			throwIfMatrixStartupAborted(abortSignal);
			await persistIdbToDisk({
				snapshotPath: this.idbSnapshotPath,
				databasePrefix: this.cryptoDatabasePrefix,
				abortSignal,
				stateRuntime: this.stateRuntime
			});
			throwIfMatrixStartupAborted(abortSignal);
			this.idbPersistTimer = setInterval(() => {
				if (this.idbPersistPromise) return;
				const abortController = new AbortController();
				this.idbPersistAbortController = abortController;
				this.idbPersistPromise = persistIdbToDisk({
					snapshotPath: this.idbSnapshotPath,
					databasePrefix: this.cryptoDatabasePrefix,
					abortSignal: abortController.signal,
					stateRuntime: this.stateRuntime
				}).catch(noop).finally(() => {
					this.idbPersistPromise = null;
					this.idbPersistAbortController = null;
				});
			}, MATRIX_IDB_PERSIST_INTERVAL_MS);
			this.idbPersistTimer.unref?.();
		} catch (err) {
			throwIfMatrixStartupAborted(abortSignal);
			LogService.warn("MatrixClientLite", "Failed to initialize rust crypto:", err);
		}
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-core.ts
function isUnsupportedAuthenticatedMediaEndpointError(err) {
	const statusCode = err?.statusCode;
	if (statusCode === 404 || statusCode === 405 || statusCode === 501) return true;
	const message = formatMatrixErrorReason(err);
	return message.includes("m_unrecognized") || message.includes("unrecognized request") || message.includes("method not allowed") || message.includes("not implemented");
}
var MatrixClientCore = class extends MatrixClientBase {
	async getUserId() {
		const fromClient = this.client.getUserId();
		if (fromClient) {
			this.selfUserId = fromClient;
			return fromClient;
		}
		if (this.selfUserId) return this.selfUserId;
		const resolved = (await this.doRequest("GET", "/_matrix/client/v3/account/whoami")).user_id?.trim();
		if (!resolved) throw new Error("Matrix whoami did not return user_id");
		this.selfUserId = resolved;
		return resolved;
	}
	async getJoinedRooms() {
		const joined = await this.doRequest("GET", "/_matrix/client/v3/joined_rooms");
		return Array.isArray(joined.joined_rooms) ? joined.joined_rooms : [];
	}
	async getTransactionScopeId() {
		captureMatrixSendCurrentness(this)?.();
		if (this.transactionScopeId) return this.transactionScopeId;
		const active = this.transactionScopePromise ?? withoutMatrixSendCurrentness(async () => {
			const configuredUserId = this.client.getUserId()?.trim() || this.selfUserId;
			const configuredDeviceId = this.transactionScopeDeviceId || this.client.getDeviceId()?.trim() || null;
			const whoami = await this.doRequest("GET", "/_matrix/client/v3/account/whoami");
			const userId = whoami.user_id?.trim() || null;
			const deviceId = whoami.device_id?.trim() || null;
			if (!userId) throw new Error("Matrix whoami did not return user_id");
			if (configuredUserId && configuredUserId !== userId) throw new Error("Matrix access token user does not match the configured userId");
			if (configuredDeviceId && deviceId && configuredDeviceId !== deviceId) throw new Error("Matrix access token device does not match the configured deviceId");
			this.selfUserId = userId;
			this.transactionScopeDeviceId = deviceId;
			return createHash("sha256").update(this.transactionScopeHomeserver).update("\0").update(userId).update("\0").update(deviceId ?? "").update("\0").update(this.transactionScopeAccessTokenHash).digest("hex");
		});
		this.transactionScopePromise = active;
		try {
			const resolved = await active;
			this.transactionScopeId = resolved;
			return resolved;
		} finally {
			if (this.transactionScopePromise === active) this.transactionScopePromise = null;
		}
	}
	async getJoinedRoomMembers(roomId) {
		const joined = (await this.client.getJoinedRoomMembers(roomId))?.joined;
		if (!joined || typeof joined !== "object") return [];
		return Object.keys(joined);
	}
	hasSyncedJoinedRoomMember(roomId, userId) {
		return this.client.getRoom(roomId)?.getMember(userId)?.membership === "join";
	}
	async getRoomStateEvent(roomId, eventType, stateKey = "") {
		return await this.client.getStateEvent(roomId, eventType, stateKey) ?? {};
	}
	async getAccountData(eventType) {
		return await this.client.getAccountDataFromServer(eventType) ?? void 0;
	}
	async setAccountData(eventType, content) {
		await this.client.setAccountData(eventType, content);
		await this.refreshDmCache().catch(noop);
	}
	async resolveRoom(aliasOrRoomId) {
		if (aliasOrRoomId.startsWith("!")) return aliasOrRoomId;
		if (!aliasOrRoomId.startsWith("#")) return aliasOrRoomId;
		try {
			return (await this.client.getRoomIdForAlias(aliasOrRoomId)).room_id ?? null;
		} catch {
			return null;
		}
	}
	async createDirectRoom(remoteUserId, opts = {}) {
		const initialState = opts.encrypted ? [{
			type: "m.room.encryption",
			state_key: "",
			content: { algorithm: "m.megolm.v1.aes-sha2" }
		}] : void 0;
		return (await this.client.createRoom({
			invite: [remoteUserId],
			is_direct: true,
			preset: Preset.TrustedPrivateChat,
			initial_state: initialState
		})).room_id;
	}
	async sendMessage(roomId, content, transactionId, beforeWireDispatch) {
		const assertCurrent = captureMatrixSendCurrentness(this);
		const wireTransactionId = transactionId ?? (beforeWireDispatch || assertCurrent ? this.client.makeTxnId() : void 0);
		return await this.runSerializedRoomSend(roomId, async () => {
			return await this.messageWireDispatchGuards.run({
				transactionId: wireTransactionId,
				guard: beforeWireDispatch,
				assertCurrent,
				run: async () => {
					if (wireTransactionId) {
						const room = this.client.getRoom(roomId);
						const existing = room?.getEventForTxnId?.(wireTransactionId);
						if (existing) {
							const existingId = existing.getId();
							if (existing.status === EventStatus.SENT && existingId && !existingId.startsWith("~")) return existingId;
							if (existing.status === EventStatus.NOT_SENT && room) {
								await this.prepareRoomForMessageSend(roomId, existing.getContent());
								return (await this.client.resendEvent(existing, room)).event_id;
							}
							throw new Error(`Matrix transaction ${wireTransactionId} is already active with status ${existing.status ?? "unknown"}`);
						}
					}
					await this.prepareRoomForMessageSend(roomId, content);
					return (await this.client.sendMessage(roomId, content, wireTransactionId)).event_id;
				}
			});
		});
	}
	async getMessageWireEventType(roomId) {
		if (this.client.getRoom(roomId)?.hasEncryptionStateEvent() === true) return "m.room.encrypted";
		const crypto = this.client.getCrypto();
		if (crypto && await crypto.isEncryptionEnabledInRoom(roomId)) return "m.room.encrypted";
		try {
			await this.getRoomStateEvent(roomId, "m.room.encryption", "");
			return "m.room.encrypted";
		} catch (error) {
			if (error instanceof MatrixError && error.httpStatus === 404 && error.errcode === "M_NOT_FOUND") return "m.room.message";
			throw error;
		}
	}
	async prepareRoomForMessageSend(roomId, content) {
		if (await this.getMessageWireEventType(roomId) === "m.room.message") return "m.room.message";
		const crypto = this.client.getCrypto();
		if (!crypto) throw new Error("Encrypted Matrix room: enable encryption before sending messages");
		const room = this.client.getRoom(roomId);
		if (!room || !room.hasEncryptionStateEvent() && !await crypto.isEncryptionEnabledInRoom(roomId)) throw new Error("Encrypted Matrix room is not ready: wait for room sync before sending");
		if (content && ((content.msgtype === MsgType.Image || content.msgtype === MsgType.Audio || content.msgtype === MsgType.Video || content.msgtype === MsgType.File) && typeof content.url === "string" || content.info && "thumbnail_url" in content.info && typeof content.info.thumbnail_url === "string")) throw new Error("Encrypted Matrix room contains unencrypted media; retry the send");
		return "m.room.encrypted";
	}
	async sendEvent(roomId, eventType, content) {
		return await this.runSerializedRoomSend(roomId, async () => {
			if (eventType === EventType.RoomMessageEncrypted.toString() || eventType === EventType.RoomRedaction.toString()) throw new Error(eventType === EventType.RoomRedaction.toString() ? "Matrix redaction wire events must use redactEvent" : "Matrix encrypted wire events must be generated by the SDK");
			if (eventType !== "m.reaction") await this.prepareRoomForMessageSend(roomId, content);
			return (await this.client.sendEvent(roomId, eventType, content)).event_id;
		});
	}
	async runSerializedRoomSend(roomId, task) {
		return await this.sendQueue.enqueue(roomId, task);
	}
	async sendStateEvent(roomId, eventType, stateKey, content) {
		return (await this.client.sendStateEvent(roomId, eventType, content, stateKey)).event_id;
	}
	async redactEvent(roomId, eventId, reason) {
		return (await this.client.redactEvent(roomId, eventId, void 0, reason?.trim() ? { reason } : void 0)).event_id;
	}
	async doRequest(method, endpoint, qs, body, opts) {
		return await this.httpClient.requestJson({
			method,
			endpoint,
			qs,
			body,
			timeoutMs: this.localTimeoutMs,
			allowAbsoluteEndpoint: opts?.allowAbsoluteEndpoint
		});
	}
	async getUserProfile(userId) {
		return await this.client.getProfileInfo(userId);
	}
	async setDisplayName(displayName) {
		await this.client.setDisplayName(displayName);
	}
	async setAvatarUrl(avatarUrl) {
		await this.client.setAvatarUrl(avatarUrl);
	}
	async joinRoom(roomId) {
		await this.client.joinRoom(roomId);
	}
	mxcToHttp(mxcUrl) {
		return this.client.mxcUrlToHttp(mxcUrl, void 0, void 0, void 0, true, false, true);
	}
	async downloadContent(mxcUrl, opts = {}) {
		const parsed = parseMxc(mxcUrl);
		if (!parsed) throw new Error(`Invalid Matrix content URI: ${mxcUrl}`);
		const encodedServer = encodeURIComponent(parsed.server);
		const encodedMediaId = encodeURIComponent(parsed.mediaId);
		const request = async (endpoint) => await this.httpClient.requestRaw({
			method: "GET",
			endpoint,
			qs: { allow_remote: opts.allowRemote ?? true },
			timeoutMs: this.localTimeoutMs,
			maxBytes: opts.maxBytes,
			readIdleTimeoutMs: opts.readIdleTimeoutMs
		});
		const authenticatedEndpoint = `/_matrix/client/v1/media/download/${encodedServer}/${encodedMediaId}`;
		try {
			return await request(authenticatedEndpoint);
		} catch (err) {
			if (!isUnsupportedAuthenticatedMediaEndpointError(err)) throw err;
		}
		return await request(`/_matrix/media/v3/download/${encodedServer}/${encodedMediaId}`);
	}
	async uploadContent(file, contentType, filename) {
		return (await this.client.uploadContent(new Uint8Array(file), {
			type: contentType || "application/octet-stream",
			name: filename,
			includeFilename: Boolean(filename)
		})).content_uri;
	}
	async getEvent(roomId, eventId) {
		const rawEvent = await this.client.fetchRoomEvent(roomId, eventId);
		if (rawEvent.type !== "m.room.encrypted") return rawEvent;
		const event = this.client.getEventMapper()(rawEvent);
		let decryptedEvent;
		const onDecrypted = (candidate) => {
			decryptedEvent = candidate;
		};
		event.once(MatrixEventEvent.Decrypted, onDecrypted);
		try {
			await this.client.decryptEventIfNeeded(event);
		} finally {
			event.off(MatrixEventEvent.Decrypted, onDecrypted);
		}
		return matrixEventToRaw(decryptedEvent ?? event);
	}
	async getRelations(roomId, eventId, relationType, eventType, opts = {}) {
		const result = await this.client.relations(roomId, eventId, relationType, eventType, opts);
		const events = result.originalEvent ? [result.originalEvent, ...result.events] : result.events;
		await Promise.all(events.map((event) => this.client.decryptEventIfNeeded(event)));
		return {
			originalEvent: result.originalEvent ? matrixEventToRaw(result.originalEvent) : null,
			events: result.events.map((event) => matrixEventToRaw(event)),
			nextBatch: result.nextBatch ?? null,
			prevBatch: result.prevBatch ?? null
		};
	}
	async hydrateEvents(roomId, events) {
		if (events.length === 0) return [];
		const mapper = this.client.getEventMapper();
		const mappedEvents = events.map((event) => mapper({
			room_id: roomId,
			...event
		}));
		await Promise.all(mappedEvents.map((event) => this.client.decryptEventIfNeeded(event)));
		return mappedEvents.map((event) => matrixEventToRaw(event));
	}
	async setTyping(roomId, typing, timeoutMs) {
		await this.client.sendTyping(roomId, typing, timeoutMs);
	}
	async sendReadReceipt(roomId, eventId) {
		await this.httpClient.requestJson({
			method: "POST",
			endpoint: `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/receipt/m.read/${encodeURIComponent(eventId)}`,
			body: {},
			timeoutMs: this.localTimeoutMs
		});
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/client-verification.ts
const normalizeNullableVerificationString = normalizeNullableString;
var MatrixClientVerification = class extends MatrixClientCore {
	async refreshOwnDeviceKeys() {
		await this.client.getCrypto()?.userHasCrossSigningKeys(await this.getUserId(), true);
	}
	async getRoomKeyBackupStatus() {
		if (!this.encryptionEnabled) return {
			serverVersion: null,
			activeVersion: null,
			trusted: null,
			matchesDecryptionKey: null,
			decryptionKeyCached: null,
			keyLoadAttempted: false,
			keyLoadError: null
		};
		const crypto = this.client.getCrypto();
		const serverVersionFallback = await this.resolveRoomKeyBackupVersion();
		if (!crypto) return {
			serverVersion: serverVersionFallback,
			activeVersion: null,
			trusted: null,
			matchesDecryptionKey: null,
			decryptionKeyCached: null,
			keyLoadAttempted: false,
			keyLoadError: null
		};
		let { activeVersion, decryptionKeyCached } = await this.resolveRoomKeyBackupLocalState(crypto);
		let { serverVersion, trusted, matchesDecryptionKey } = await this.resolveRoomKeyBackupTrustState(crypto, serverVersionFallback);
		const shouldLoadBackupKey = Boolean(serverVersion) && (decryptionKeyCached === false || matchesDecryptionKey === false);
		const shouldActivateBackup = Boolean(serverVersion) && !activeVersion;
		let keyLoadAttempted = false;
		let keyLoadError = null;
		if (serverVersion && (shouldLoadBackupKey || shouldActivateBackup)) {
			if (shouldLoadBackupKey) {
				if (typeof crypto.loadSessionBackupPrivateKeyFromSecretStorage === "function") {
					keyLoadAttempted = true;
					try {
						await crypto.loadSessionBackupPrivateKeyFromSecretStorage();
					} catch (err) {
						keyLoadError = formatErrorMessage(err);
					}
				} else keyLoadError = "Matrix crypto backend does not support loading backup keys from secret storage";
			}
			if (!keyLoadError) await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			({activeVersion, decryptionKeyCached} = await this.resolveRoomKeyBackupLocalState(crypto));
			({serverVersion, trusted, matchesDecryptionKey} = await this.resolveRoomKeyBackupTrustState(crypto, serverVersion));
		}
		return {
			serverVersion,
			activeVersion,
			trusted,
			matchesDecryptionKey,
			decryptionKeyCached,
			keyLoadAttempted,
			keyLoadError
		};
	}
	async getDeviceVerificationStatus(userId, deviceId) {
		const normalizedUserId = userId?.trim() || null;
		const normalizedDeviceId = deviceId?.trim() || null;
		if (!this.encryptionEnabled) return {
			encryptionEnabled: false,
			userId: normalizedUserId,
			deviceId: normalizedDeviceId,
			verified: false,
			localVerified: false,
			crossSigningVerified: false,
			signedByOwner: false
		};
		const crypto = this.client.getCrypto();
		let deviceStatus = null;
		if (crypto && normalizedUserId && normalizedDeviceId && typeof crypto.getDeviceVerificationStatus === "function") deviceStatus = await crypto.getDeviceVerificationStatus(normalizedUserId, normalizedDeviceId).catch(() => null);
		const { isMatrixDeviceVerifiedInCurrentClient } = await loadMatrixCryptoRuntime();
		return {
			encryptionEnabled: true,
			userId: normalizedUserId,
			deviceId: normalizedDeviceId,
			verified: isMatrixDeviceVerifiedInCurrentClient(deviceStatus),
			localVerified: deviceStatus?.localVerified === true,
			crossSigningVerified: deviceStatus?.crossSigningVerified === true,
			signedByOwner: deviceStatus?.signedByOwner === true
		};
	}
	async getOwnDeviceVerificationStatus() {
		const recoveryKey = await this.recoveryKeyStore.getRecoveryKeySummary();
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		const deviceId = this.client.getDeviceId()?.trim() || null;
		const diagnosticTimeoutMs = Math.min(this.localTimeoutMs, MATRIX_STATUS_DIAGNOSTIC_TIMEOUT_MS);
		const [backup, deviceVerification, ownDevices] = await Promise.all([
			resolveMatrixDiagnostic(this.getRoomKeyBackupStatus(), diagnosticTimeoutMs),
			resolveMatrixDiagnostic(this.getDeviceVerificationStatus(userId, deviceId), diagnosticTimeoutMs),
			resolveMatrixDiagnosticResult(this.listOwnDevices(), diagnosticTimeoutMs)
		]);
		const resolvedBackup = backup ?? unresolvedMatrixRoomKeyBackupStatus();
		const resolvedDeviceVerification = deviceVerification ?? unresolvedMatrixDeviceVerificationStatus({
			userId,
			deviceId
		});
		const serverDeviceKnown = deviceId ? ownDevices.value ? ownDevices.value.some((device) => device.deviceId === deviceId) : isMatrixAccessTokenInvalidatedError(ownDevices.error) ? false : null : null;
		return {
			...resolvedDeviceVerification,
			verified: resolvedDeviceVerification.crossSigningVerified,
			recoveryKeyStored: Boolean(recoveryKey),
			recoveryKeyCreatedAt: recoveryKey?.createdAt ?? null,
			recoveryKeyId: recoveryKey?.keyId ?? null,
			backupVersion: resolvedBackup.serverVersion,
			backup: resolvedBackup,
			serverDeviceKnown
		};
	}
	async getOwnDeviceIdentityVerificationStatus() {
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		const deviceId = this.client.getDeviceId()?.trim() || null;
		const deviceVerification = await this.getDeviceVerificationStatus(userId, deviceId);
		return {
			...deviceVerification,
			verified: deviceVerification.crossSigningVerified
		};
	}
	async trustOwnIdentityAfterSelfVerification() {
		if (!this.encryptionEnabled) return;
		await this.ensureStartedForCryptoControlPlane();
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		const ownIdentity = crypto && typeof crypto.getOwnIdentity === "function" ? await crypto.getOwnIdentity().catch(() => void 0) : void 0;
		if (!ownIdentity) return;
		try {
			if (typeof ownIdentity.isVerified === "function" && ownIdentity.isVerified()) return;
			if (typeof ownIdentity.verify !== "function") return;
			await ownIdentity.verify();
		} finally {
			ownIdentity.free?.();
		}
	}
	async resolveActiveRoomKeyBackupVersion(crypto) {
		if (typeof crypto.getActiveSessionBackupVersion !== "function") return null;
		const version = await crypto.getActiveSessionBackupVersion().catch(() => null);
		return normalizeNullableVerificationString(version);
	}
	async resolveCachedRoomKeyBackupDecryptionKey(crypto) {
		const read = Reflect.get(crypto, "getSessionBackupPrivateKey");
		if (typeof read !== "function") return null;
		const key = await read.call(crypto).catch(() => null);
		return key ? key.length > 0 : false;
	}
	async resolveRoomKeyBackupLocalState(crypto) {
		const [activeVersion, decryptionKeyCached] = await Promise.all([this.resolveActiveRoomKeyBackupVersion(crypto), this.resolveCachedRoomKeyBackupDecryptionKey(crypto)]);
		return {
			activeVersion,
			decryptionKeyCached
		};
	}
	async shouldForceSecretStorageRecreationForBackupReset(crypto) {
		if (await this.resolveCachedRoomKeyBackupDecryptionKey(crypto) !== false) return false;
		const loadSessionBackupPrivateKeyFromSecretStorage = crypto.loadSessionBackupPrivateKeyFromSecretStorage;
		if (typeof loadSessionBackupPrivateKeyFromSecretStorage !== "function") return false;
		try {
			await loadSessionBackupPrivateKeyFromSecretStorage.call(crypto);
			return false;
		} catch (err) {
			return isRepairableSecretStorageAccessError(err);
		}
	}
	async resolveRoomKeyBackupTrustState(crypto, fallbackVersion) {
		let serverVersion = fallbackVersion;
		let trusted = null;
		let matchesDecryptionKey = null;
		if (typeof crypto.getKeyBackupInfo === "function") {
			const info = await crypto.getKeyBackupInfo().catch(() => null);
			serverVersion = normalizeNullableVerificationString(info?.version) ?? serverVersion;
			if (info && typeof crypto.isKeyBackupTrusted === "function") {
				const trustInfo = await crypto.isKeyBackupTrusted(info).catch(() => null);
				trusted = typeof trustInfo?.trusted === "boolean" ? trustInfo.trusted : null;
				matchesDecryptionKey = typeof trustInfo?.matchesDecryptionKey === "boolean" ? trustInfo.matchesDecryptionKey : null;
			}
		}
		return {
			serverVersion,
			trusted,
			matchesDecryptionKey
		};
	}
	async resolveDefaultSecretStorageKeyId(crypto) {
		const getSecretStorageStatus = crypto?.getSecretStorageStatus;
		if (typeof getSecretStorageStatus !== "function") return;
		return (await getSecretStorageStatus.call(crypto).catch(() => null))?.defaultKeyId;
	}
	async resolveRoomKeyBackupVersion() {
		try {
			const response = await this.doRequest("GET", "/_matrix/client/v3/room_keys/version");
			return normalizeNullableVerificationString(response.version);
		} catch {
			return null;
		}
	}
	async enableTrustedRoomKeyBackupIfPossible(crypto) {
		if (typeof crypto.checkKeyBackupAndEnable !== "function") return;
		await crypto.checkKeyBackupAndEnable();
	}
	async ensureRoomKeyBackupEnabled(crypto) {
		if (await this.resolveRoomKeyBackupVersion()) return;
		LogService.info("MatrixClientLite", "No room key backup version found on server, creating one via secret storage bootstrap");
		await this.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, { setupNewKeyBackup: true });
		const createdVersion = await this.resolveRoomKeyBackupVersion();
		if (!createdVersion) throw new Error("Matrix room key backup is still missing after bootstrap");
		LogService.info("MatrixClientLite", `Room key backup enabled (version ${createdVersion})`);
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk.ts
var sdk_exports = /* @__PURE__ */ __exportAll({
	ConsoleLogger: () => ConsoleLogger,
	LogService: () => LogService,
	MatrixClient: () => MatrixClient
});
var MatrixClient = class extends MatrixClientVerification {
	async verifyWithRecoveryKey(rawRecoveryKey) {
		const fail = async (error, fields = {}) => {
			const status = await this.getOwnDeviceVerificationStatus();
			return {
				success: false,
				recoveryKeyAccepted: fields.recoveryKeyAccepted ?? false,
				backupUsable: fields.backupUsable ?? false,
				deviceOwnerVerified: fields.deviceOwnerVerified ?? status.verified,
				error,
				...status
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		await this.ensureCryptoSupportInitialized();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		const backupUsableBeforeStagedRecovery = resolveMatrixRoomKeyBackupReadinessError(await this.getRoomKeyBackupStatus(), { requireServerBackup: true }) === null;
		const trimmedRecoveryKey = rawRecoveryKey.trim();
		if (!trimmedRecoveryKey) return await fail("Matrix recovery key is required");
		let stagedKeyId;
		try {
			stagedKeyId = await this.resolveDefaultSecretStorageKeyId(crypto) ?? null;
			await this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: trimmedRecoveryKey,
				keyId: stagedKeyId
			});
		} catch (err) {
			return await fail(formatErrorMessage(err));
		}
		const storedRecoveryKeyMatches = (await this.recoveryKeyStore.getRecoveryKeySummary())?.encodedPrivateKey?.trim() === trimmedRecoveryKey;
		if (backupUsableBeforeStagedRecovery && storedRecoveryKeyMatches) {
			const status = await this.getOwnDeviceVerificationStatus();
			const backupUsable = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: true }) === null;
			const backupError = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: false });
			const recoveryKeyAccepted = backupUsable;
			if (!status.verified) {
				if (recoveryKeyAccepted) await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
				else await this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: false,
					error: "Matrix recovery key was applied, but this device still lacks full Matrix identity trust. The recovery key can unlock usable backup material only when 'Backup usable' is yes; full identity trust still requires Matrix cross-signing verification.",
					...status
				};
			}
			if (backupError) {
				await this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: true,
					error: backupError,
					...status
				};
			}
			await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
			return {
				success: true,
				recoveryKeyAccepted: true,
				backupUsable,
				deviceOwnerVerified: true,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
				...status
			};
		}
		try {
			const cryptoBootstrapper = this.cryptoBootstrapper;
			if (!cryptoBootstrapper) return await fail("Matrix crypto bootstrapper is not available");
			await cryptoBootstrapper.bootstrap(crypto, { allowAutomaticCrossSigningReset: false });
			await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			const status = await this.getOwnDeviceVerificationStatus();
			const backupError = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: false });
			const backupUsable = resolveMatrixRoomKeyBackupReadinessError(status.backup, { requireServerBackup: true }) === null;
			const stagedRecoveryKeyUsed = this.recoveryKeyStore.hasStagedRecoveryKeyBeenUsed();
			const secretStorageStatus = typeof crypto.getSecretStorageStatus === "function" ? await crypto.getSecretStorageStatus().catch(() => null) : null;
			const stagedRecoveryKeyConfirmedBySecretStorage = Boolean(stagedKeyId) && secretStorageStatus?.secretStorageKeyValidityMap?.[stagedKeyId ?? ""] === true;
			const stagedRecoveryKeyRejectedBySecretStorage = Boolean(stagedKeyId) && secretStorageStatus?.secretStorageKeyValidityMap?.[stagedKeyId ?? ""] === false;
			const stagedRecoveryKeyValidated = stagedRecoveryKeyUsed && (stagedRecoveryKeyConfirmedBySecretStorage || stagedRecoveryKeyUsed && !stagedRecoveryKeyRejectedBySecretStorage && !stagedRecoveryKeyConfirmedBySecretStorage && !backupUsableBeforeStagedRecovery && backupUsable) || storedRecoveryKeyMatches && backupUsable;
			const recoveryKeyAccepted = stagedRecoveryKeyValidated && (status.verified || backupUsable);
			if (!status.verified) {
				if (backupUsable && stagedRecoveryKeyValidated) await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
				else await this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: false,
					error: "Matrix recovery key was applied, but this device still lacks full Matrix identity trust. The recovery key can unlock usable backup material only when 'Backup usable' is yes; full identity trust still requires Matrix cross-signing verification.",
					...recoveryKeyAccepted ? await this.getOwnDeviceVerificationStatus() : status
				};
			}
			if (backupError) {
				await this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted,
					backupUsable,
					deviceOwnerVerified: true,
					error: backupError,
					...status
				};
			}
			if (!stagedRecoveryKeyValidated) {
				await this.recoveryKeyStore.discardStagedRecoveryKey();
				return {
					success: false,
					recoveryKeyAccepted: false,
					backupUsable,
					deviceOwnerVerified: true,
					error: "Matrix recovery key could not be verified against active Matrix backup material; existing backup may be usable from previously loaded recovery material.",
					...status
				};
			}
			await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: stagedKeyId });
			const committedStatus = await this.getOwnDeviceVerificationStatus();
			return {
				success: true,
				recoveryKeyAccepted: true,
				backupUsable,
				deviceOwnerVerified: true,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
				...committedStatus
			};
		} catch (err) {
			await this.recoveryKeyStore.discardStagedRecoveryKey();
			return await fail(formatErrorMessage(err));
		}
	}
	async restoreRoomKeyBackup(params = {}) {
		let loadedFromSecretStorage = false;
		const fail = async (error) => {
			const backup = await this.getRoomKeyBackupStatus();
			return {
				success: false,
				error,
				backupVersion: backup.serverVersion,
				imported: 0,
				total: 0,
				loadedFromSecretStorage,
				backup
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		try {
			const rawRecoveryKey = params.recoveryKey?.trim();
			if (rawRecoveryKey) await this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: rawRecoveryKey,
				keyId: await this.resolveDefaultSecretStorageKeyId(crypto)
			});
			const backup = await this.getRoomKeyBackupStatus();
			loadedFromSecretStorage = backup.keyLoadAttempted && !backup.keyLoadError;
			const backupError = resolveMatrixRoomKeyBackupReadinessError(backup, {
				allowUntrustedMatchingKey: true,
				requireServerBackup: true
			});
			if (backupError) {
				await this.recoveryKeyStore.discardStagedRecoveryKey();
				return await fail(backupError);
			}
			if (typeof crypto.restoreKeyBackup !== "function") {
				await this.recoveryKeyStore.discardStagedRecoveryKey();
				return await fail("Matrix crypto backend does not support full key backup restore");
			}
			const restore = await crypto.restoreKeyBackup();
			if (rawRecoveryKey) await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: await this.resolveDefaultSecretStorageKeyId(crypto) });
			const finalBackup = await this.getRoomKeyBackupStatus();
			return {
				success: true,
				backupVersion: backup.serverVersion,
				imported: typeof restore.imported === "number" ? restore.imported : 0,
				total: typeof restore.total === "number" ? restore.total : 0,
				loadedFromSecretStorage,
				restoredAt: (/* @__PURE__ */ new Date()).toISOString(),
				backup: finalBackup
			};
		} catch (err) {
			await this.recoveryKeyStore.discardStagedRecoveryKey();
			return await fail(formatErrorMessage(err));
		}
	}
	async resetRoomKeyBackup(options = {}) {
		let previousVersion = null;
		let deletedVersion = null;
		const fail = async (error) => {
			const backup = await this.getRoomKeyBackupStatus();
			return {
				success: false,
				error,
				previousVersion,
				deletedVersion,
				createdVersion: backup.serverVersion,
				backup
			};
		};
		if (!this.encryptionEnabled) return await fail("Matrix encryption is disabled for this client");
		await this.ensureStartedForCryptoControlPlane();
		const crypto = this.client.getCrypto();
		if (!crypto) return await fail("Matrix crypto is not available (start client with encryption enabled)");
		await this.recoveryKeyStore.drainPendingPersistence();
		previousVersion = await this.resolveRoomKeyBackupVersion();
		const forceNewSecretStorage = options.rotateRecoveryKey === true || await this.shouldForceSecretStorageRecreationForBackupReset(crypto);
		try {
			if (previousVersion) {
				try {
					await this.doRequest("DELETE", `/_matrix/client/v3/room_keys/version/${encodeURIComponent(previousVersion)}`);
				} catch (err) {
					if (!isMatrixNotFoundError(err)) throw err;
				}
				deletedVersion = previousVersion;
			}
			await this.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
				setupNewKeyBackup: true,
				forceNewSecretStorage,
				forceNewRecoveryKey: options.rotateRecoveryKey === true,
				allowSecretStorageRecreateWithoutRecoveryKey: true
			});
			await this.enableTrustedRoomKeyBackupIfPossible(crypto);
			const backup = await this.getRoomKeyBackupStatus();
			const createdVersion = backup.serverVersion;
			if (!createdVersion) return await fail("Matrix room key backup is still missing after reset.");
			if (backup.activeVersion !== createdVersion) return await fail("Matrix room key backup was recreated on the server but is not active on this device.");
			if (backup.decryptionKeyCached === false) return await fail("Matrix room key backup was recreated but its decryption key is not cached on this device.");
			if (backup.matchesDecryptionKey === false) return await fail("Matrix room key backup was recreated but this device does not have the matching backup decryption key.");
			if (backup.trusted === false) return await fail("Matrix room key backup was recreated but is not trusted on this device.");
			return {
				success: true,
				previousVersion,
				deletedVersion,
				createdVersion,
				resetAt: (/* @__PURE__ */ new Date()).toISOString(),
				backup
			};
		} catch (err) {
			return await fail(formatErrorMessage(err));
		}
	}
	async getOwnCrossSigningPublicationStatus() {
		const userId = this.client.getUserId() ?? this.selfUserId ?? null;
		return await resolveMatrixCrossSigningPublicationStatus({
			userId,
			query: async () => await this.doRequest("POST", "/_matrix/client/v3/keys/query", void 0, { device_keys: userId ? { [userId]: [] } : {} })
		});
	}
	async bootstrapOwnDeviceVerification(params) {
		const pendingVerifications = async () => this.crypto ? (await this.crypto.listVerifications()).length : 0;
		if (!this.encryptionEnabled) return {
			success: false,
			error: "Matrix encryption is disabled for this client",
			verification: await this.getOwnDeviceVerificationStatus(),
			crossSigning: await this.getOwnCrossSigningPublicationStatus(),
			pendingVerifications: await pendingVerifications(),
			cryptoBootstrap: null
		};
		let bootstrapError;
		let bootstrapSummary = null;
		let rawRecoveryKey;
		try {
			await this.ensureStartedForCryptoControlPlane();
			await this.ensureCryptoSupportInitialized();
			const crypto = this.client.getCrypto();
			if (!crypto) throw new Error("Matrix crypto is not available (start client with encryption enabled)");
			rawRecoveryKey = params?.recoveryKey?.trim();
			if (rawRecoveryKey) await this.recoveryKeyStore.stageEncodedRecoveryKey({
				encodedPrivateKey: rawRecoveryKey,
				keyId: await this.resolveDefaultSecretStorageKeyId(crypto)
			});
			const cryptoBootstrapper = this.cryptoBootstrapper;
			if (!cryptoBootstrapper) throw new Error("Matrix crypto bootstrapper is not available");
			bootstrapSummary = await cryptoBootstrapper.bootstrap(crypto, createMatrixExplicitBootstrapOptions({
				...params,
				allowAutomaticCrossSigningReset: rawRecoveryKey ? false : params?.allowAutomaticCrossSigningReset
			}));
			await this.ensureRoomKeyBackupEnabled(crypto);
		} catch (err) {
			await this.recoveryKeyStore.discardStagedRecoveryKey();
			bootstrapError = formatErrorMessage(err);
		}
		const verification = await this.getOwnDeviceVerificationStatus();
		const crossSigning = await this.getOwnCrossSigningPublicationStatus();
		const verificationError = verification.verified && crossSigning.published ? null : bootstrapError ?? "Matrix verification bootstrap did not produce a device verified by its owner with published cross-signing keys";
		const backupError = verificationError === null ? resolveMatrixRoomKeyBackupReadinessError(verification.backup, {
			allowUntrustedMatchingKey: Boolean(rawRecoveryKey),
			requireServerBackup: true
		}) : null;
		const success = verificationError === null && backupError === null;
		if (success) await this.recoveryKeyStore.commitStagedRecoveryKey({ keyId: await this.resolveDefaultSecretStorageKeyId(this.client.getCrypto()) });
		else await this.recoveryKeyStore.discardStagedRecoveryKey();
		return {
			success,
			error: success ? void 0 : backupError ?? verificationError ?? void 0,
			verification: success ? await this.getOwnDeviceVerificationStatus() : verification,
			crossSigning,
			pendingVerifications: await pendingVerifications(),
			cryptoBootstrap: bootstrapSummary
		};
	}
	async listOwnDevices() {
		return await listMatrixOwnDevices(this.client);
	}
	async deleteOwnDevices(deviceIds) {
		const uniqueDeviceIds = uniqueStrings(normalizeStringEntries(deviceIds));
		const currentDeviceId = this.client.getDeviceId()?.trim() || null;
		const protectedDeviceIds = uniqueDeviceIds.filter((deviceId) => deviceId === currentDeviceId);
		if (protectedDeviceIds.length > 0) throw new Error(`Refusing to delete the current Matrix device: ${protectedDeviceIds[0]}`);
		const deleteWithAuth = async (authData) => {
			await this.client.deleteMultipleDevices(uniqueDeviceIds, authData);
		};
		if (uniqueDeviceIds.length > 0) try {
			await deleteWithAuth();
		} catch (err) {
			const session = err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "session" in err.data && typeof err.data.session === "string" ? err.data.session : null;
			const userId = await this.getUserId().catch(() => this.selfUserId);
			if (!session || !userId || !this.password?.trim()) throw err;
			await deleteWithAuth({
				type: "m.login.password",
				session,
				identifier: {
					type: "m.id.user",
					user: userId
				},
				password: this.password
			});
		}
		return {
			currentDeviceId,
			deletedDeviceIds: uniqueDeviceIds,
			remainingDevices: await this.listOwnDevices()
		};
	}
	registerBridge() {
		const decryptBridge = this.decryptBridge;
		if (this.bridgeRegistered || !decryptBridge) return;
		this.bridgeRegistered = true;
		registerMatrixClientBridge({
			client: this.client,
			decryptBridge,
			emitter: this.emitter,
			emitMembershipForRoom: (room) => this.emitMembershipForRoom(room),
			getSelfUserId: () => this.client.getUserId() ?? this.selfUserId ?? "",
			setCurrentSyncState: (state, error) => {
				this.currentSyncState = state;
				this.currentSyncError = error;
			}
		});
	}
	emitMembershipForRoom(room) {
		emitMatrixMembershipForRoom({
			client: this.client,
			emitter: this.emitter,
			room,
			selfUserId: this.client.getUserId() ?? this.selfUserId ?? ""
		});
	}
	emitOutstandingInviteEvents() {
		for (const room of this.client.getRooms()) this.emitMembershipForRoom(room);
	}
	async refreshDmCache() {
		return refreshMatrixDmRoomIds(await this.getAccountData("m.direct"), this.dmRoomIds);
	}
};
//#endregion
export { ConsoleLogger, LogService, MatrixClient, isRepairableSecretStorageAccessError as n, sdk_exports as t };
