import { t as ensureMatrixCryptoRuntime } from "./deps-L_1bUAGL.mjs";
import { r as noop, t as LogService } from "./logger-CuAzdD8Q.mjs";
import { a as isRepairableSecretStorageAccessError, i as trustMatrixOwnIdentity, n as isMatrixDeviceOwnerVerified, r as isMatrixDeviceVerifiedInCurrentClient } from "./sdk-DNW03GqJ.mjs";
import { persistIdbToDisk, resolveDefaultIdbSnapshotPath, restoreIdbFromDisk } from "./idb-persistence-C2TsCHY2.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { formatErrorMessage, toStringifiedError } from "openclaw/plugin-sdk/error-runtime";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { MatrixEventEvent } from "matrix-js-sdk/lib/matrix.js";
import { VerificationMethod } from "matrix-js-sdk/lib/types.js";
import "fake-indexeddb/auto";
import { IDBDatabase } from "fake-indexeddb";
import { CryptoEvent } from "matrix-js-sdk/lib/crypto-api/CryptoEvent.js";
import { DecryptionFailureCode } from "matrix-js-sdk/lib/crypto-api/index.js";
import { VerificationPhase, VerificationRequestEvent, VerifierEvent } from "matrix-js-sdk/lib/crypto-api/verification.js";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
//#region extensions/matrix/src/matrix/sdk/fake-indexeddb-prune.ts
const MATRIX_CRYPTO_DATABASE_SUFFIXES = ["::matrix-sdk-crypto", "::matrix-sdk-crypto-meta"];
const PRUNER_INSTALLED = Symbol.for("openclaw.matrix.fakeIndexedDbTransactionPruner");
function isMatrixCryptoDatabase(rawDatabase) {
	return MATRIX_CRYPTO_DATABASE_SUFFIXES.some((suffix) => rawDatabase.name.endsWith(suffix));
}
function pruneFinishedFakeIndexedDbTransactions(rawDatabase) {
	if (!isMatrixCryptoDatabase(rawDatabase)) return 0;
	const transactions = rawDatabase.transactions;
	const activeTransactions = transactions.filter((transaction) => transaction["_state"] !== "finished");
	const removed = transactions.length - activeTransactions.length;
	if (removed > 0) transactions.splice(0, transactions.length, ...activeTransactions);
	return removed;
}
function installFakeIndexedDbTransactionPruner() {
	const databasePrototype = IDBDatabase.prototype;
	if (databasePrototype[PRUNER_INSTALLED]) return;
	Object.defineProperty(databasePrototype, PRUNER_INSTALLED, {
		configurable: false,
		enumerable: false,
		value: true
	});
	const originalTransaction = Object.getOwnPropertyDescriptor(databasePrototype, "transaction")?.value;
	databasePrototype.transaction = function patchedMatrixFakeIndexedDbTransaction(...args) {
		const rawDatabase = this["_rawDatabase"];
		pruneFinishedFakeIndexedDbTransactions(rawDatabase);
		const transaction = originalTransaction.apply(this, args);
		if (isMatrixCryptoDatabase(rawDatabase)) {
			const prune = () => {
				pruneFinishedFakeIndexedDbTransactions(rawDatabase);
			};
			transaction.addEventListener("complete", prune);
			transaction.addEventListener("abort", prune);
		}
		return transaction;
	};
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-bootstrap.ts
const CROSS_SIGNING_PUBLICATION_WAIT_MS = 5e3;
var MatrixCryptoBootstrapper = class {
	constructor(deps) {
		this.deps = deps;
		this.verificationHandlerRegistered = false;
	}
	async bootstrap(crypto, options = {}) {
		const strict = options.strict === true;
		const forceReset = options.forceResetCrossSigning === true;
		if (forceReset && !await this.deps.canUnlockSecretStorage()) throw new Error("Forced cross-signing reset requires the active Matrix recovery key; supply it before retrying");
		this.registerVerificationRequestHandler(crypto);
		if (!forceReset) await this.bootstrapSecretStorage(crypto, {
			strict,
			allowSecretStorageRecreateWithoutRecoveryKey: options.allowSecretStorageRecreateWithoutRecoveryKey === true
		});
		const crossSigning = await this.bootstrapCrossSigning(crypto, {
			forceResetCrossSigning: forceReset,
			allowAutomaticCrossSigningReset: options.allowAutomaticCrossSigningReset !== false,
			allowSecretStorageRecreateWithoutRecoveryKey: forceReset ? false : options.allowSecretStorageRecreateWithoutRecoveryKey === true,
			strict
		});
		if (forceReset && (!crossSigning.ready || !crossSigning.published)) return {
			crossSigningReady: crossSigning.ready,
			crossSigningPublished: crossSigning.published,
			ownDeviceVerified: null
		};
		await this.bootstrapSecretStorage(crypto, {
			strict,
			allowSecretStorageRecreateWithoutRecoveryKey: options.allowSecretStorageRecreateWithoutRecoveryKey === true
		});
		const ownDeviceVerified = await this.ensureOwnDeviceTrust(crypto, { strict });
		return {
			crossSigningReady: crossSigning.ready,
			crossSigningPublished: crossSigning.published,
			ownDeviceVerified
		};
	}
	createSigningKeysUiAuthCallback(params) {
		return async (makeRequest) => {
			try {
				return await makeRequest(null);
			} catch {
				try {
					return await makeRequest({ type: "m.login.dummy" });
				} catch {
					if (!params.password?.trim()) throw new Error("Matrix cross-signing key upload requires UIA; provide matrix.password for m.login.password fallback");
					return await makeRequest({
						type: "m.login.password",
						identifier: {
							type: "m.id.user",
							user: params.userId
						},
						password: params.password
					});
				}
			}
		};
	}
	async bootstrapCrossSigning(crypto, options) {
		const userId = await this.deps.getUserId();
		const authUploadDeviceSigningKeys = this.createSigningKeysUiAuthCallback({
			userId,
			password: this.deps.getPassword?.()
		});
		const hasPublishedCrossSigningKeys = () => crypto.userHasCrossSigningKeys(userId, true).catch(() => false);
		const isCrossSigningReady = () => crypto.isCrossSigningReady().catch(() => false);
		const finalize = async () => {
			const ready = await isCrossSigningReady();
			const published = ready ? await waitForPublishedCrossSigningKeys() : await hasPublishedCrossSigningKeys();
			if (ready && published) {
				LogService.info("MatrixClientLite", "Cross-signing bootstrap complete");
				return {
					ready,
					published
				};
			}
			const message = "Cross-signing bootstrap finished but server keys are still not published";
			LogService.warn("MatrixClientLite", message);
			if (options.strict) throw new Error(message);
			return {
				ready,
				published
			};
		};
		const waitForPublishedCrossSigningKeys = async () => {
			const startedAt = Date.now();
			do {
				if (await hasPublishedCrossSigningKeys()) return true;
				await setTimeout$1(250);
			} while (Date.now() - startedAt < CROSS_SIGNING_PUBLICATION_WAIT_MS);
			return false;
		};
		if (options.forceResetCrossSigning) {
			try {
				await crypto.bootstrapCrossSigning({
					setupNewCrossSigning: true,
					authUploadDeviceSigningKeys
				});
				await trustMatrixOwnIdentity(crypto);
			} catch (err) {
				LogService.warn("MatrixClientLite", "Forced cross-signing reset failed:", err);
				if (options.strict) {
					if (isRepairableSecretStorageAccessError(err)) throw new Error("Forced cross-signing reset cannot access secret storage; restore the Matrix recovery key before retrying", { cause: err });
					throw toStringifiedError(err);
				}
				return {
					ready: false,
					published: false
				};
			}
			return await finalize();
		}
		try {
			await hasPublishedCrossSigningKeys();
			await crypto.bootstrapCrossSigning({ authUploadDeviceSigningKeys });
		} catch (err) {
			if (options.allowSecretStorageRecreateWithoutRecoveryKey && isRepairableSecretStorageAccessError(err)) {
				LogService.warn("MatrixClientLite", "Cross-signing bootstrap could not unlock secret storage; recreating secret storage during explicit bootstrap and retrying.");
				await this.deps.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, {
					allowSecretStorageRecreateWithoutRecoveryKey: true,
					forceNewSecretStorage: true
				});
				await crypto.bootstrapCrossSigning({ authUploadDeviceSigningKeys });
			} else if (!options.allowAutomaticCrossSigningReset) {
				LogService.warn("MatrixClientLite", "Initial cross-signing bootstrap failed and automatic reset is disabled:", err);
				return {
					ready: false,
					published: false
				};
			} else {
				LogService.warn("MatrixClientLite", "Initial cross-signing bootstrap failed, trying reset:", err);
				try {
					await crypto.bootstrapCrossSigning({
						setupNewCrossSigning: true,
						authUploadDeviceSigningKeys
					});
				} catch (resetErr) {
					LogService.warn("MatrixClientLite", "Failed to bootstrap cross-signing:", resetErr);
					if (options.strict) throw toStringifiedError(resetErr);
					return {
						ready: false,
						published: false
					};
				}
			}
		}
		const firstPassReady = await isCrossSigningReady();
		const firstPassPublished = await hasPublishedCrossSigningKeys();
		if (firstPassReady && firstPassPublished) {
			LogService.info("MatrixClientLite", "Cross-signing bootstrap complete");
			return {
				ready: true,
				published: true
			};
		}
		if (!options.allowAutomaticCrossSigningReset) return {
			ready: firstPassReady,
			published: firstPassPublished
		};
		try {
			await crypto.bootstrapCrossSigning({
				setupNewCrossSigning: true,
				authUploadDeviceSigningKeys
			});
			await trustMatrixOwnIdentity(crypto);
		} catch (err) {
			LogService.warn("MatrixClientLite", "Fallback cross-signing bootstrap failed:", err);
			if (options.strict) throw toStringifiedError(err);
			return {
				ready: false,
				published: false
			};
		}
		return await finalize();
	}
	async bootstrapSecretStorage(crypto, options) {
		try {
			await this.deps.recoveryKeyStore.bootstrapSecretStorageWithRecoveryKey(crypto, { allowSecretStorageRecreateWithoutRecoveryKey: options.allowSecretStorageRecreateWithoutRecoveryKey });
			LogService.info("MatrixClientLite", "Secret storage bootstrap complete");
		} catch (err) {
			LogService.warn("MatrixClientLite", "Failed to bootstrap secret storage:", err);
			if (options.strict) throw toStringifiedError(err);
		}
	}
	registerVerificationRequestHandler(crypto) {
		if (this.verificationHandlerRegistered) return;
		this.verificationHandlerRegistered = true;
		crypto.on(CryptoEvent.VerificationRequestReceived, (request) => {
			const verificationRequest = request;
			try {
				this.deps.verificationManager.trackVerificationRequest(verificationRequest);
			} catch (err) {
				LogService.warn("MatrixClientLite", `Failed to track verification request from ${verificationRequest.otherUserId}:`, err);
			}
		});
		this.deps.decryptBridge.bindCryptoRetrySignals(crypto);
		LogService.info("MatrixClientLite", "Verification request handler registered");
	}
	async ensureOwnDeviceTrust(crypto, options) {
		const deviceId = this.deps.getDeviceId()?.trim();
		if (!deviceId) return null;
		const userId = await this.deps.getUserId();
		const deviceStatus = await crypto.getDeviceVerificationStatus(userId, deviceId).catch(() => null);
		if (isMatrixDeviceOwnerVerified(deviceStatus)) return true;
		await crypto.setDeviceVerified(userId, deviceId, true);
		if (await crypto.isCrossSigningReady()) await crypto.crossSignDevice(deviceId);
		const refreshedStatus = await crypto.getDeviceVerificationStatus(userId, deviceId).catch(() => null);
		const verified = isMatrixDeviceOwnerVerified(refreshedStatus);
		if (!verified && options.strict) throw new Error(`Matrix own device ${deviceId} does not have full Matrix identity trust after bootstrap`);
		return verified;
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-facade.ts
const loadMatrixCryptoNodeRuntime = createLazyRuntimeModule(() => import("./crypto-node.runtime-6Aj_ltHQ.mjs"));
async function loadMatrixCryptoNodeBindings() {
	await ensureMatrixCryptoRuntime();
	return (await loadMatrixCryptoNodeRuntime()).loadMatrixCryptoNodeBindings();
}
function createMatrixCryptoFacade(deps) {
	const manager = deps.verificationManager;
	function withTrackedVerifications(run) {
		return async (...args) => {
			const crypto = deps.client.getCrypto();
			const userId = deps.client.getUserId();
			if (userId && crypto) for (const request of crypto.getVerificationRequestsToDeviceInProgress(userId)) manager.trackVerificationRequest(request);
			return await run(...args);
		};
	}
	return {
		isRoomEncrypted: deps.isRoomEncrypted,
		encryptMedia: async (buffer) => {
			const { Attachment } = await loadMatrixCryptoNodeBindings();
			const encrypted = Attachment.encrypt(new Uint8Array(buffer));
			const mediaInfoJson = encrypted.mediaEncryptionInfo;
			if (!mediaInfoJson) throw new Error("Matrix media encryption failed: missing media encryption info");
			const parsed = JSON.parse(mediaInfoJson);
			return {
				buffer: Buffer.from(encrypted.encryptedData),
				file: {
					key: parsed.key,
					iv: parsed.iv,
					hashes: parsed.hashes,
					v: parsed.v
				}
			};
		},
		decryptMedia: async (file, opts) => {
			const encrypted = await deps.downloadContent(file.url, opts);
			const { Attachment, EncryptedAttachment } = await loadMatrixCryptoNodeBindings();
			const metadata = {
				url: file.url,
				key: file.key,
				iv: file.iv,
				hashes: file.hashes,
				v: file.v
			};
			const attachment = new EncryptedAttachment(new Uint8Array(encrypted), JSON.stringify(metadata));
			const decrypted = Attachment.decrypt(attachment);
			return Buffer.from(decrypted);
		},
		getRecoveryKey: async () => {
			return deps.recoveryKeyStore.getRecoveryKeySummary();
		},
		listVerifications: withTrackedVerifications(manager.listVerifications.bind(manager)),
		ensureVerificationDmTracked: async ({ roomId, userId }) => {
			const request = deps.client.getCrypto()?.findVerificationRequestDMInProgress(roomId, userId);
			if (!request) return null;
			return deps.verificationManager.trackVerificationRequest(request);
		},
		requestVerification: async (params) => {
			return await deps.verificationManager.requestVerification(deps.client.getCrypto(), params);
		},
		acceptVerification: withTrackedVerifications(manager.acceptVerification.bind(manager)),
		cancelVerification: withTrackedVerifications(manager.cancelVerification.bind(manager)),
		startVerification: withTrackedVerifications(manager.startVerification.bind(manager)),
		generateVerificationQr: withTrackedVerifications(manager.generateVerificationQr.bind(manager)),
		scanVerificationQr: withTrackedVerifications(manager.scanVerificationQr.bind(manager)),
		confirmVerificationSas: withTrackedVerifications(manager.confirmVerificationSas.bind(manager)),
		mismatchVerificationSas: withTrackedVerifications(manager.mismatchVerificationSas.bind(manager)),
		confirmVerificationReciprocateQr: withTrackedVerifications(manager.confirmVerificationReciprocateQr.bind(manager)),
		getVerificationSas: withTrackedVerifications(manager.getVerificationSas.bind(manager))
	};
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/decrypt-bridge.ts
const MATRIX_DECRYPT_RETRY_BASE_DELAY_MS = 1500;
const MATRIX_DECRYPT_RETRY_MAX_DELAY_MS = 3e4;
const MATRIX_DECRYPT_RETRY_MAX_ATTEMPTS = 8;
const MATRIX_DECRYPT_DRAIN_TIMEOUT_MS = 5e3;
const MATRIX_DECRYPT_EXHAUSTED_RETRY_TTL_MS = 36e5;
const MATRIX_DECRYPT_EXHAUSTED_RETRY_MAX_ENTRIES = 512;
function resolveDecryptRetryKey(roomId, eventId) {
	if (!roomId || !eventId) return null;
	return `${roomId}|${eventId}`;
}
function shouldRetryDecryptionFailure(event) {
	if (!event.isDecryptionFailure()) return false;
	const reason = event.decryptionFailureReason;
	return reason === DecryptionFailureCode.MEGOLM_UNKNOWN_INBOUND_SESSION_ID || reason === DecryptionFailureCode.OLM_UNKNOWN_MESSAGE_INDEX || reason === DecryptionFailureCode.UNKNOWN_ERROR;
}
var MatrixDecryptBridge = class {
	constructor(deps) {
		this.deps = deps;
		this.trackedEncryptedEvents = /* @__PURE__ */ new WeakSet();
		this.pendingDecryptions = /* @__PURE__ */ new Set();
		this.decryptedMessageDedupe = /* @__PURE__ */ new Map();
		this.decryptRetries = /* @__PURE__ */ new Map();
		this.failedDecryptionsNotified = /* @__PURE__ */ new Set();
		this.exhaustedDecryptRetries = /* @__PURE__ */ new Map();
		this.cryptoRetrySignalsBound = false;
		this.quiescing = false;
		this.stopped = false;
	}
	shouldEmitUnencryptedMessage(roomId, eventId) {
		if (!eventId) return true;
		const key = `${roomId}|${eventId}`;
		if (this.decryptedMessageDedupe.get(key) === void 0) return true;
		this.decryptedMessageDedupe.delete(key);
		return false;
	}
	attachEncryptedEvent(event, roomId) {
		if (this.quiescing || this.stopped) return;
		if (this.trackedEncryptedEvents.has(event)) return;
		this.trackedEncryptedEvents.add(event);
		const sdkDecryption = event.getDecryptionPromise();
		if (sdkDecryption) this.trackDecryption(sdkDecryption);
		event.on(MatrixEventEvent.Decrypted, (decryptedEvent, err) => {
			this.handleEncryptedEventDecrypted({
				roomId,
				encryptedEvent: event,
				decryptedEvent,
				err
			});
		});
		if (shouldRetryDecryptionFailure(event)) {
			const eventId = this.deps.toRaw(event).event_id || event.getId() || "";
			this.scheduleDecryptRetry({
				event,
				roomId,
				eventId
			});
		}
	}
	retryPendingNow(reason, options) {
		if (this.quiescing || this.stopped) return;
		if (options?.includeExhausted) {
			this.pruneExhaustedDecryptRetries(Date.now());
			for (const [retryKey, state] of this.exhaustedDecryptRetries) {
				if (this.decryptRetries.has(retryKey)) continue;
				this.exhaustedDecryptRetries.delete(retryKey);
				this.decryptRetries.set(retryKey, {
					...state,
					attempts: 0,
					inFlight: false,
					timer: null
				});
			}
		}
		const pending = Array.from(this.decryptRetries.entries());
		if (pending.length === 0) return;
		LogService.debug("MatrixClientLite", `Retrying pending decryptions due to ${reason}`);
		this.startPendingRetries(pending);
	}
	bindCryptoRetrySignals(crypto) {
		if (!crypto || this.cryptoRetrySignalsBound) return;
		this.cryptoRetrySignalsBound = true;
		for (const [eventName, reason, includeExhausted] of [
			[
				CryptoEvent.KeyBackupDecryptionKeyCached,
				"crypto.keyBackupDecryptionKeyCached",
				true
			],
			[
				CryptoEvent.RehydrationCompleted,
				"dehydration.RehydrationCompleted",
				true
			],
			[
				CryptoEvent.DevicesUpdated,
				"crypto.devicesUpdated",
				false
			],
			[
				CryptoEvent.KeysChanged,
				"crossSigning.keysChanged",
				false
			]
		]) crypto.on(eventName, () => this.retryPendingNow(reason, { includeExhausted }));
	}
	stop() {
		this.quiescing = true;
		this.stopped = true;
		for (const retryKey of this.decryptRetries.keys()) this.clearDecryptRetry(retryKey);
		this.pendingDecryptions.clear();
		this.exhaustedDecryptRetries.clear();
	}
	async drainPendingDecryptions(_reason) {
		this.quiescing = true;
		this.startPendingRetries(Array.from(this.decryptRetries.entries()));
		await raceWithTimeout(Promise.allSettled(this.pendingDecryptions), MATRIX_DECRYPT_DRAIN_TIMEOUT_MS, () => {
			throw new Error(`Matrix decryption drain did not finish within ${MATRIX_DECRYPT_DRAIN_TIMEOUT_MS}ms`);
		}, { ref: false });
	}
	startPendingRetries(pending) {
		for (const [retryKey, state] of pending) {
			if (state.timer) {
				clearTimeout(state.timer);
				state.timer = null;
			}
			if (!state.inFlight) this.runDecryptRetry(retryKey).catch(noop);
		}
	}
	handleEncryptedEventDecrypted(params) {
		if (this.stopped) return;
		const decryptedRoomId = params.decryptedEvent.getRoomId() || params.roomId;
		const decryptedRaw = this.deps.toRaw(params.decryptedEvent);
		const retryEventId = decryptedRaw.event_id || params.encryptedEvent.getId() || "";
		const retryKey = resolveDecryptRetryKey(decryptedRoomId, retryEventId);
		if (params.err || params.decryptedEvent.isDecryptionFailure()) {
			this.emitFailedDecryptionOnce(retryKey, decryptedRoomId, decryptedRaw, params.err ?? /* @__PURE__ */ new Error("Matrix event failed to decrypt"));
			if (shouldRetryDecryptionFailure(params.decryptedEvent)) this.scheduleDecryptRetry({
				event: params.encryptedEvent,
				roomId: decryptedRoomId,
				eventId: retryEventId
			});
			else if (retryKey) this.clearDecryptRetry(retryKey);
			return;
		}
		if (retryKey) this.clearDecryptRetry(retryKey);
		this.rememberDecryptedMessage(decryptedRoomId, decryptedRaw.event_id);
		this.deps.emitDecryptedEvent(decryptedRoomId, decryptedRaw);
		this.deps.emitMessage(decryptedRoomId, decryptedRaw);
	}
	emitFailedDecryptionOnce(retryKey, roomId, event, error) {
		if (retryKey) {
			if (this.failedDecryptionsNotified.has(retryKey)) return;
			this.failedDecryptionsNotified.add(retryKey);
		}
		this.deps.emitFailedDecryption(roomId, event, error);
	}
	scheduleDecryptRetry(params) {
		if (this.quiescing || this.stopped) return;
		const retryKey = resolveDecryptRetryKey(params.roomId, params.eventId);
		if (!retryKey) return;
		const existing = this.decryptRetries.get(retryKey);
		if (this.exhaustedDecryptRetries.has(retryKey)) return;
		if (existing?.timer || existing?.inFlight) return;
		const attempts = (existing?.attempts ?? 0) + 1;
		if (attempts > MATRIX_DECRYPT_RETRY_MAX_ATTEMPTS) {
			const retry = this.decryptRetries.get(retryKey);
			if (retry?.timer) clearTimeout(retry.timer);
			this.decryptRetries.delete(retryKey);
			const exhaustedAt = Date.now();
			this.exhaustedDecryptRetries.set(retryKey, {
				event: params.event,
				roomId: params.roomId,
				eventId: params.eventId,
				attempts: attempts - 1,
				inFlight: false,
				timer: null,
				exhaustedAt
			});
			this.pruneExhaustedDecryptRetries(exhaustedAt);
			LogService.debug("MatrixClientLite", `Giving up decryption retry for ${params.eventId} in ${params.roomId} after ${attempts - 1} attempts`);
			return;
		}
		const delayMs = Math.min(MATRIX_DECRYPT_RETRY_BASE_DELAY_MS * 2 ** (attempts - 1), MATRIX_DECRYPT_RETRY_MAX_DELAY_MS);
		const next = {
			event: params.event,
			roomId: params.roomId,
			eventId: params.eventId,
			attempts,
			inFlight: false,
			timer: null
		};
		next.timer = setTimeout(() => {
			this.runDecryptRetry(retryKey).catch(noop);
		}, delayMs);
		this.decryptRetries.set(retryKey, next);
	}
	trackDecryption(pending) {
		this.pendingDecryptions.add(pending);
		const forget = () => this.pendingDecryptions.delete(pending);
		pending.then(forget, forget);
	}
	runDecryptRetry(retryKey) {
		const pending = this.attemptDecryptRetry(retryKey);
		this.trackDecryption(pending);
		return pending;
	}
	async attemptDecryptRetry(retryKey) {
		const state = this.decryptRetries.get(retryKey);
		if (!state || state.inFlight) return;
		state.inFlight = true;
		state.timer = null;
		const retryEvent = state.event;
		const retryCrypto = this.deps.client.getCrypto?.();
		const canAttemptDecryption = retryCrypto !== void 0 && retryCrypto !== null && typeof retryEvent.attemptDecryption === "function";
		if (!(canAttemptDecryption || typeof this.deps.client.decryptEventIfNeeded === "function")) {
			this.clearDecryptRetry(retryKey);
			return;
		}
		try {
			if (canAttemptDecryption) await retryEvent.attemptDecryption?.(retryCrypto, { isRetry: true });
			else await this.deps.client.decryptEventIfNeeded?.(state.event, { isRetry: true });
		} catch {} finally {
			state.inFlight = false;
		}
		if (this.decryptRetries.get(retryKey) !== state) return;
		if (this.stopped || this.quiescing && state.event.isDecryptionFailure()) {
			this.clearDecryptRetry(retryKey);
			return;
		}
		if (state.event.isDecryptionFailure()) {
			if (!shouldRetryDecryptionFailure(state.event)) {
				this.clearDecryptRetry(retryKey);
				return;
			}
			this.scheduleDecryptRetry(state);
			return;
		}
		this.clearDecryptRetry(retryKey);
		const raw = this.deps.toRaw(state.event);
		this.rememberDecryptedMessage(state.roomId, raw.event_id);
		this.deps.emitDecryptedEvent(state.roomId, raw);
		this.deps.emitMessage(state.roomId, raw);
	}
	clearDecryptRetry(retryKey) {
		const state = this.decryptRetries.get(retryKey);
		if (state?.timer) clearTimeout(state.timer);
		this.decryptRetries.delete(retryKey);
		this.exhaustedDecryptRetries.delete(retryKey);
		this.failedDecryptionsNotified.delete(retryKey);
	}
	pruneExhaustedDecryptRetries(now) {
		for (const [retryKey, state] of this.exhaustedDecryptRetries) if (now - state.exhaustedAt > MATRIX_DECRYPT_EXHAUSTED_RETRY_TTL_MS) this.exhaustedDecryptRetries.delete(retryKey);
		pruneMapToMaxSize(this.exhaustedDecryptRetries, MATRIX_DECRYPT_EXHAUSTED_RETRY_MAX_ENTRIES);
	}
	rememberDecryptedMessage(roomId, eventId) {
		if (!eventId) return;
		const now = Date.now();
		this.pruneDecryptedMessageDedupe(now);
		this.decryptedMessageDedupe.set(`${roomId}|${eventId}`, now);
	}
	pruneDecryptedMessageDedupe(now) {
		const ttlMs = 3e4;
		for (const [key, createdAt] of this.decryptedMessageDedupe) if (now - createdAt > ttlMs) this.decryptedMessageDedupe.delete(key);
		pruneMapToMaxSize(this.decryptedMessageDedupe, 2048);
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/verification-manager.ts
const MAX_TRACKED_VERIFICATION_SESSIONS = 256;
const TERMINAL_SESSION_RETENTION_MS = 864e5;
const SAS_AUTO_CONFIRM_DELAY_MS = 3e4;
var MatrixVerificationManager = class {
	constructor(opts = {}) {
		this.opts = opts;
		this.verificationSessions = /* @__PURE__ */ new Map();
		this.verificationSessionCounter = 0;
		this.trackedVerificationRequests = /* @__PURE__ */ new WeakSet();
		this.trackedVerificationVerifiers = /* @__PURE__ */ new WeakSet();
	}
	readRequestValue(reader, fallback) {
		try {
			return reader();
		} catch {
			return fallback;
		}
	}
	isSameLogicalVerificationRequest(left, right) {
		const transactionId = left.transactionId?.trim();
		const leftDeviceId = left.otherDeviceId;
		const rightDeviceId = right.otherDeviceId;
		return Boolean(transactionId) && transactionId === right.transactionId?.trim() && (left.roomId ?? "") === (right.roomId ?? "") && left.otherUserId === right.otherUserId && (!leftDeviceId || !rightDeviceId || leftDeviceId === rightDeviceId) && left.isSelfVerification === right.isSelfVerification && left.initiatedByMe === right.initiatedByMe;
	}
	pruneVerificationSessions(nowMs) {
		for (const [id, session] of this.verificationSessions) {
			const phase = this.readRequestValue(() => session.request.phase, -1);
			if ((phase === VerificationPhase.Done || phase === VerificationPhase.Cancelled) && nowMs - session.updatedAtMs > TERMINAL_SESSION_RETENTION_MS) this.verificationSessions.delete(id);
		}
		if (this.verificationSessions.size <= MAX_TRACKED_VERIFICATION_SESSIONS) return;
		const sortedByAge = Array.from(this.verificationSessions.entries()).toSorted((a, b) => a[1].updatedAtMs - b[1].updatedAtMs);
		const overflow = this.verificationSessions.size - MAX_TRACKED_VERIFICATION_SESSIONS;
		for (const [id] of sortedByAge.slice(0, overflow)) this.verificationSessions.delete(id);
	}
	emitVerificationSummary(session) {
		const summary = this.buildVerificationSummary(session);
		this.opts.onSummaryChanged?.(summary);
	}
	touchVerificationSession(session) {
		session.updatedAtMs = Date.now();
		this.emitVerificationSummary(session);
	}
	observeVerificationOperation(session, operation, onError) {
		return operation.then(() => this.touchVerificationSession(session)).catch((err) => {
			onError?.();
			session.error = formatErrorMessage(err);
			this.touchVerificationSession(session);
		});
	}
	clearSasAutoConfirmTimer(session) {
		if (!session.sasAutoConfirmTimer) return;
		clearTimeout(session.sasAutoConfirmTimer);
		session.sasAutoConfirmTimer = void 0;
	}
	buildVerificationSummary(session) {
		const request = session.request;
		const phase = this.readRequestValue(() => request.phase, VerificationPhase.Requested);
		const accepting = request.accepting;
		const declining = request.declining;
		const pending = this.readRequestValue(() => request.pending, false);
		const methods = this.readRequestValue(() => request.methods, []).slice();
		const sasCallbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
		if (sasCallbacks) session.sasCallbacks = sasCallbacks;
		const canAccept = phase < VerificationPhase.Ready && !accepting && !declining;
		return {
			id: session.id,
			transactionId: request.transactionId,
			roomId: request.roomId,
			otherUserId: request.otherUserId,
			otherDeviceId: request.otherDeviceId,
			isSelfVerification: request.isSelfVerification,
			initiatedByMe: request.initiatedByMe,
			phase,
			phaseName: VerificationPhase[phase]?.toLowerCase() ?? `unknown(${phase})`,
			pending,
			methods,
			chosenMethod: this.readRequestValue(() => request.chosenMethod ?? null, null),
			canAccept,
			hasSas: Boolean(sasCallbacks),
			sas: sasCallbacks ? {
				decimal: sasCallbacks.sas.decimal,
				emoji: sasCallbacks.sas.emoji
			} : void 0,
			hasReciprocateQr: Boolean(session.reciprocateQrCallbacks),
			completed: phase === VerificationPhase.Done,
			error: session.error,
			createdAt: new Date(session.createdAtMs).toISOString(),
			updatedAt: new Date(session.updatedAtMs).toISOString()
		};
	}
	findVerificationSession(id) {
		const direct = this.verificationSessions.get(id);
		if (direct) return direct;
		const transactionMatches = Array.from(this.verificationSessions.values()).filter((session) => {
			return session.request.transactionId?.trim() === id;
		});
		if (transactionMatches.length === 1) return expectDefined(transactionMatches[0], "single Matrix verification session");
		if (transactionMatches.length > 1) throw new Error(`Matrix verification request id is ambiguous for transaction ${id}; use the verification id instead`);
		throw new Error(`Matrix verification request not found: ${id}`);
	}
	ensureVerificationRequestTracked(session) {
		const requestObj = session.request;
		if (this.trackedVerificationRequests.has(requestObj)) return;
		this.trackedVerificationRequests.add(requestObj);
		session.request.on(VerificationRequestEvent.Change, () => {
			this.touchVerificationSession(session);
			this.maybeAutoAcceptInboundRequest(session);
			this.attachRequestVerifier(session);
			this.maybeAutoStartInboundSas(session);
		});
	}
	maybeAutoAcceptInboundRequest(session) {
		if (session.acceptRequested) return;
		const request = session.request;
		const isSelfVerification = request.isSelfVerification;
		const initiatedByMe = request.initiatedByMe;
		const phase = this.readRequestValue(() => request.phase, VerificationPhase.Requested);
		const accepting = request.accepting;
		const declining = request.declining;
		if (isSelfVerification || initiatedByMe) return;
		if (phase !== VerificationPhase.Requested || accepting || declining) return;
		session.acceptRequested = true;
		this.observeVerificationOperation(session, request.accept(), () => {
			session.acceptRequested = false;
		});
	}
	maybeAutoStartInboundSas(session) {
		if (session.activeVerifier || session.verifyStarted || session.startRequested) return;
		if (session.request.initiatedByMe) return;
		if (!session.request.isSelfVerification) return;
		const phase = this.readRequestValue(() => session.request.phase, VerificationPhase.Requested);
		if (phase < VerificationPhase.Ready || phase >= VerificationPhase.Cancelled) return;
		const methods = this.readRequestValue(() => session.request.methods, []);
		const chosenMethod = this.readRequestValue(() => session.request.chosenMethod, null);
		if (!(methods.includes(VerificationMethod.Sas) || chosenMethod === VerificationMethod.Sas)) return;
		session.startRequested = true;
		session.request.startVerification(VerificationMethod.Sas).then((verifier) => {
			this.attachVerifierToVerificationSession(session, verifier);
			this.touchVerificationSession(session);
		}).catch(() => {
			session.startRequested = false;
		});
	}
	attachRequestVerifier(session, request = session.request) {
		const verifier = this.readRequestValue(() => request.verifier, null);
		if (verifier) this.attachVerifierToVerificationSession(session, verifier);
	}
	attachVerifierToVerificationSession(session, verifier) {
		session.activeVerifier = verifier;
		this.touchVerificationSession(session);
		const maybeSas = verifier.getShowSasCallbacks();
		if (maybeSas) {
			session.sasCallbacks = maybeSas;
			this.maybeAutoConfirmSas(session);
		}
		const maybeReciprocateQr = verifier.getReciprocateQrCodeCallbacks();
		if (maybeReciprocateQr) session.reciprocateQrCallbacks = maybeReciprocateQr;
		const verifierObj = verifier;
		if (this.trackedVerificationVerifiers.has(verifierObj)) {
			this.ensureVerificationStarted(session);
			return;
		}
		this.trackedVerificationVerifiers.add(verifierObj);
		verifier.on(VerifierEvent.ShowSas, (sas) => {
			session.sasCallbacks = sas;
			this.touchVerificationSession(session);
			this.maybeAutoConfirmSas(session);
		});
		verifier.on(VerifierEvent.ShowReciprocateQr, (qr) => {
			session.reciprocateQrCallbacks = qr;
			this.touchVerificationSession(session);
		});
		verifier.on(VerifierEvent.Cancel, (err) => {
			this.clearSasAutoConfirmTimer(session);
			session.error = formatErrorMessage(err);
			this.touchVerificationSession(session);
		});
		this.ensureVerificationStarted(session);
	}
	maybeAutoConfirmSas(session) {
		if (session.sasAutoConfirmStarted || session.sasAutoConfirmTimer) return;
		if (session.request.initiatedByMe) return;
		const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
		if (!callbacks) return;
		session.sasCallbacks = callbacks;
		session.sasAutoConfirmTimer = setTimeout(() => {
			session.sasAutoConfirmTimer = void 0;
			if (this.readRequestValue(() => session.request.phase, VerificationPhase.Requested) >= VerificationPhase.Cancelled) return;
			session.sasAutoConfirmStarted = true;
			this.observeVerificationOperation(session, this.confirmSasForSession(session, callbacks));
		}, SAS_AUTO_CONFIRM_DELAY_MS);
	}
	async confirmSasForSession(session, callbacks) {
		await callbacks.confirm();
		await this.trustOwnDeviceAfterConfirmedSas(session);
	}
	ensureVerificationStarted(session) {
		if (!session.activeVerifier || session.verifyStarted) return;
		session.verifyStarted = true;
		session.verifyPromise = this.observeVerificationOperation(session, session.activeVerifier.verify());
	}
	async trustOwnDeviceAfterConfirmedSas(session) {
		if (!session.request.isSelfVerification) return;
		const deviceId = session.request.otherDeviceId?.trim();
		if (!deviceId || !this.opts.trustOwnDeviceAfterSas) return;
		await this.opts.trustOwnDeviceAfterSas(deviceId);
	}
	trackVerificationRequest(request) {
		this.pruneVerificationSessions(Date.now());
		const requestObj = request;
		for (const existing of this.verificationSessions.values()) if (existing.request === requestObj) {
			this.touchVerificationSession(existing);
			return this.buildVerificationSummary(existing);
		}
		if (request.transactionId?.trim()) {
			for (const existing of this.verificationSessions.values()) if (this.isSameLogicalVerificationRequest(existing.request, request)) {
				existing.request = request;
				this.ensureVerificationRequestTracked(existing);
				this.attachRequestVerifier(existing, request);
				this.touchVerificationSession(existing);
				return this.buildVerificationSummary(existing);
			}
		}
		const now = Date.now();
		const session = {
			id: `verification-${++this.verificationSessionCounter}`,
			request,
			createdAtMs: now,
			updatedAtMs: now,
			verifyStarted: false,
			startRequested: false,
			acceptRequested: false,
			sasAutoConfirmStarted: false
		};
		this.verificationSessions.set(session.id, session);
		this.ensureVerificationRequestTracked(session);
		this.maybeAutoAcceptInboundRequest(session);
		this.attachRequestVerifier(session, request);
		this.maybeAutoStartInboundSas(session);
		this.emitVerificationSummary(session);
		return this.buildVerificationSummary(session);
	}
	listVerifications() {
		this.pruneVerificationSessions(Date.now());
		return Array.from(this.verificationSessions.values()).map((session) => this.buildVerificationSummary(session)).toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	}
	async requestVerification(crypto, params) {
		if (!crypto) throw new Error("Matrix crypto is not available");
		let request;
		if (params.ownUser) request = await crypto.requestOwnUserVerification();
		else if (params.userId && params.deviceId) request = await crypto.requestDeviceVerification(params.userId, params.deviceId);
		else if (params.userId && params.roomId) request = await crypto.requestVerificationDM(params.userId, params.roomId);
		else throw new Error("Matrix verification request requires one of: ownUser, userId+deviceId, or userId+roomId");
		return this.trackVerificationRequest(request);
	}
	async acceptVerification(id) {
		const session = this.findVerificationSession(id);
		await session.request.accept();
		this.touchVerificationSession(session);
		return this.buildVerificationSummary(session);
	}
	async cancelVerification(id, params) {
		const session = this.findVerificationSession(id);
		await session.request.cancel(params);
		this.touchVerificationSession(session);
		return this.buildVerificationSummary(session);
	}
	async startVerification(id, method = "sas") {
		const session = this.findVerificationSession(id);
		if (method !== "sas") throw new Error("Matrix startVerification currently supports only SAS directly");
		const verifier = await session.request.startVerification(VerificationMethod.Sas);
		this.attachVerifierToVerificationSession(session, verifier);
		return this.buildVerificationSummary(session);
	}
	async generateVerificationQr(id) {
		const qr = await this.findVerificationSession(id).request.generateQRCode();
		if (!qr) throw new Error("Matrix verification QR data is not available yet");
		return { qrDataBase64: Buffer.from(qr).toString("base64") };
	}
	async scanVerificationQr(id, qrDataBase64) {
		const session = this.findVerificationSession(id);
		const trimmed = qrDataBase64.trim();
		if (!trimmed) throw new Error("Matrix verification QR payload is required");
		const qrBytes = Buffer.from(trimmed, "base64");
		if (qrBytes.length === 0) throw new Error("Matrix verification QR payload is invalid base64");
		const verifier = await session.request.scanQRCode(new Uint8ClampedArray(qrBytes));
		this.attachVerifierToVerificationSession(session, verifier);
		return this.buildVerificationSummary(session);
	}
	async confirmVerificationSas(id) {
		const session = this.findVerificationSession(id);
		const callbacks = this.requireSasCallbacks(session, "confirmation");
		this.clearSasAutoConfirmTimer(session);
		session.sasAutoConfirmStarted = true;
		await this.confirmSasForSession(session, callbacks);
		await session.verifyPromise;
		this.touchVerificationSession(session);
		return this.buildVerificationSummary(session);
	}
	mismatchVerificationSas(id) {
		const session = this.findVerificationSession(id);
		const callbacks = this.requireSasCallbacks(session, "mismatch");
		this.clearSasAutoConfirmTimer(session);
		callbacks.mismatch();
		this.touchVerificationSession(session);
		return this.buildVerificationSummary(session);
	}
	confirmVerificationReciprocateQr(id) {
		const session = this.findVerificationSession(id);
		const callbacks = session.reciprocateQrCallbacks ?? session.activeVerifier?.getReciprocateQrCodeCallbacks();
		if (!callbacks) throw new Error("Matrix reciprocate-QR confirmation is not available for this verification request");
		session.reciprocateQrCallbacks = callbacks;
		callbacks.confirm();
		this.touchVerificationSession(session);
		return this.buildVerificationSummary(session);
	}
	getVerificationSas(id) {
		const session = this.findVerificationSession(id);
		const callbacks = this.requireSasCallbacks(session, "data");
		return {
			decimal: callbacks.sas.decimal,
			emoji: callbacks.sas.emoji
		};
	}
	requireSasCallbacks(session, operation) {
		const callbacks = session.sasCallbacks ?? session.activeVerifier?.getShowSasCallbacks();
		if (!callbacks) throw new Error(`Matrix SAS ${operation} is not available for this verification request`);
		session.sasCallbacks = callbacks;
		return callbacks;
	}
};
//#endregion
//#region extensions/matrix/src/matrix/sdk/indexeddb-session.ts
const registry = resolveGlobalSingleton(Symbol.for("openclaw.matrix.sdkIndexedDbSessions"), () => ({ sessions: /* @__PURE__ */ new Map() }));
const sessions = registry.sessions;
function retiredError() {
	return new DOMException("Matrix crypto IndexedDB generation has retired", "InvalidStateError");
}
function trackTransaction(session, transaction) {
	let settle;
	const pending = new Promise((resolve) => {
		settle = resolve;
	});
	session.transactions.add(pending);
	const complete = () => {
		session.transactions.delete(pending);
		settle();
	};
	transaction.addEventListener("complete", complete, { once: true });
	transaction.addEventListener("abort", complete, { once: true });
}
function admitConnection(session, database) {
	if (session.connections.has(database)) return;
	session.connections.add(database);
	const transaction = database.transaction.bind(database);
	database.transaction = (...args) => {
		if (session.state !== "active") throw retiredError();
		const result = transaction(...args);
		trackTransaction(session, result);
		return result;
	};
}
function openForSession(factory, session, name, version) {
	if (session.state !== "active") throw retiredError();
	const request = factory.open(name, version);
	let settle;
	const pending = new Promise((resolve) => {
		settle = resolve;
	});
	session.pendingOpens.add(pending);
	const complete = () => {
		session.pendingOpens.delete(pending);
		settle();
	};
	request.addEventListener("upgradeneeded", () => {
		admitConnection(session, request.result);
		if (session.state !== "active") request.transaction?.abort();
		else if (request.transaction) trackTransaction(session, request.transaction);
	});
	request.addEventListener("success", () => {
		try {
			admitConnection(session, request.result);
			if (session.state !== "active") request.result.close();
		} catch (error) {
			session.failure = { error };
			session.state = "failed";
		} finally {
			complete();
		}
	}, { once: true });
	request.addEventListener("error", complete, { once: true });
	return request;
}
function installSdkFactory() {
	if (registry.factory) return;
	const factory = globalThis.indexedDB;
	registry.factory = new Proxy(factory, { get(target, key) {
		if (key === "open") return (name, version) => {
			const session = sessions.get(name);
			return session ? openForSession(target, session, name, version) : target.open(name, version);
		};
		const value = Reflect.get(target, key, target);
		return typeof value === "function" ? value.bind(target) : value;
	} });
	globalThis.indexedDB = registry.factory;
}
/** Own SDK connections through stop; the physical store lock owns publication. */
function beginMatrixSdkIndexedDbSession(databasePrefix = "matrix-js-sdk") {
	installSdkFactory();
	const names = [`${databasePrefix}::matrix-sdk-crypto`, `${databasePrefix}::matrix-sdk-crypto-meta`];
	if (names.some((name) => {
		const previous = sessions.get(name);
		return previous && previous.state !== "retired";
	})) throw new Error("Matrix SDK IndexedDB generation is still active or failed retirement");
	const session = {
		state: "active",
		connections: /* @__PURE__ */ new Set(),
		pendingOpens: /* @__PURE__ */ new Set(),
		transactions: /* @__PURE__ */ new Set()
	};
	for (const name of names) sessions.set(name, session);
	let retirement;
	return { retire: () => {
		retirement ??= (async () => {
			session.state = "retiring";
			try {
				for (const connection of session.connections) connection.close();
				await Promise.all(session.pendingOpens);
				for (const connection of session.connections) connection.close();
				await Promise.all(session.transactions);
				if (session.failure) throw session.failure.error;
				session.state = "retired";
				session.connections.clear();
			} catch (error) {
				session.state = "failed";
				throw error;
			}
		})();
		return retirement;
	} };
}
//#endregion
//#region extensions/matrix/src/matrix/sdk/crypto-runtime.ts
installFakeIndexedDbTransactionPruner();
//#endregion
export { MatrixCryptoBootstrapper, MatrixDecryptBridge, MatrixVerificationManager, beginMatrixSdkIndexedDbSession, createMatrixCryptoFacade, isMatrixDeviceOwnerVerified, isMatrixDeviceVerifiedInCurrentClient, persistIdbToDisk, resolveDefaultIdbSnapshotPath, restoreIdbFromDisk };
