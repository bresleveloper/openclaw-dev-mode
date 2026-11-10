import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createAsyncLock } from "./json-files-DYmSFHoN.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./async-lock-runtime-DndUFK6j.mjs";
import "./account-resolution-ROKoEhY7.mjs";
import { F as concatBytes, R as randomBytes$1, a as decodeUtf8, o as fromBase64, r as base64, s as fromBase64url, t as canonicalBytes } from "./canonical-C1hv0IfI.mjs";
import { a as REEF_AUDIT_MIGRATION_NAMESPACE, h as gcm, n as REEF_AUDIT_HEAD_NAMESPACE, o as REEF_AUDIT_NAMESPACE, r as REEF_AUDIT_MAX_ENTRIES } from "./audit-state-format-xKEkjxPg.mjs";
import { a as REEF_KEYS_MIGRATION_NAMESPACE, c as REEF_REVIEWS_NAMESPACE, f as REEF_REGISTRATION_NAMESPACE, n as REEF_DURABLE_MIGRATION_NAMESPACE, o as REEF_KEYS_NAMESPACE, s as REEF_REVIEWS_MAX_ENTRIES } from "./state-format-A6jMVTqv.mjs";
import { c as validateMessageBody, t as REEF_ENVELOPE_MAX_AGE_SECONDS } from "./envelope-DloG17gM.mjs";
import { a as reefPeerIdentity, i as matchesReefPeerIdentity, r as ReefPeerTrustSchema, t as ReefAutonomySchema } from "./friend-types-DKK2gCV4.mjs";
import { S as resolveReefIdentityScope, a as REEF_TRUST_STORE_OPTIONS, d as ReefRejectionNoticeStateSchema, f as createReefPairingApproval, n as REEF_DELIVERY_STORE_OPTIONS, o as ReefOutboundDeliveryBindingSchema, t as MESSAGE_ID_PATTERN, u as ReefPeerTrustChangedError, v as parseReefPairingApproval, x as requirePeer } from "./trust-store-format-Ci47SDUH.mjs";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
//#region extensions/reef/src/audit-state.ts
const auditOperationHandler = {
	moduleName: "audit-state-operation-api.js",
	exportName: "executeReefAuditOperation"
};
var ReefSqliteAuditStore = class {
	#operation;
	#config;
	constructor(runtime, auditKey, head, maxEntries = REEF_AUDIT_MAX_ENTRIES, authoritySignal) {
		if (auditKey.length !== 32) throw new Error("audit key must be 32 bytes");
		const migration = runtime.state.openKeyedStoreV2({
			namespace: REEF_AUDIT_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const entries = runtime.state.openKeyedStoreV2({
			namespace: REEF_AUDIT_NAMESPACE,
			maxEntries: maxEntries + 1,
			overflowPolicy: "reject-new"
		});
		this.operationState = {
			head,
			migration,
			entries,
			auditKey: auditKey.slice(),
			maxEntries
		};
		this.#config = {
			head: 0,
			migration: 1,
			entries: 2,
			auditKey: this.operationState.auditKey,
			maxEntries
		};
		this.#operation = head.createOperation([
			head,
			migration,
			entries
		], auditOperationHandler, { assertCurrent: () => authoritySignal?.throwIfAborted() });
	}
	async appendEvent(type, payload, ts = Math.floor(Date.now() / 1e3)) {
		const event = {
			type,
			payload: structuredClone(payload),
			ts
		};
		return (await this.#operation.execute({
			type: "append",
			input: {
				...this.#config,
				events: [event]
			}
		}, { writeStores: [this.#config.head, this.#config.entries] })).value[0];
	}
	async entries() {
		return (await this.#operation.execute({
			type: "entries",
			input: this.#config
		}, {
			writeStores: [],
			missingValue: []
		})).value;
	}
};
function getReefAuditOperationState(audit) {
	if (!(audit instanceof ReefSqliteAuditStore)) return;
	return {
		...audit.operationState,
		auditKey: audit.operationState.auditKey.slice()
	};
}
function openReefAuditStore(runtime, auditKey, maxEntries, authoritySignal) {
	return new ReefSqliteAuditStore(runtime, auditKey, runtime.state.openKeyedStoreV2({
		namespace: REEF_AUDIT_HEAD_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new"
	}), maxEntries, authoritySignal);
}
//#endregion
//#region extensions/reef/src/replay-store.ts
const REEF_REPLAY_NAMESPACE = "replay";
const REEF_REPLAY_MAX_ENTRIES = 3e3;
const REEF_REPLAY_TTL_MS = (REEF_ENVELOPE_MAX_AGE_SECONDS + 86400) * 1e3;
const REEF_REPLAY_CLAIM_LEASE_MS = 3e5;
function reefReplayStoreKey(peer, id) {
	return `binding:${createHash("sha256").update(JSON.stringify([peer, id])).digest("hex")}`;
}
function parseReplayRecord(value) {
	if (!value) return;
	if (typeof value.peer !== "string" || typeof value.id !== "string" || typeof value.envelopeHash !== "string" || ![
		"available",
		"in_flight",
		"completed",
		"consumed"
	].includes(value.state) || value.state === "in_flight" && (typeof value.claimOwner !== "string" || value.claimOwner.length === 0 || !Number.isSafeInteger(value.claimExpiresAt) || (value.claimExpiresAt ?? 0) <= 0)) throw new Error("invalid Reef replay state");
	return value;
}
function encryptReplayBody(body, key, rng) {
	validateMessageBody(body);
	const nonce = rng(12);
	if (nonce.length !== 12) throw new Error("replay body rng returned invalid nonce");
	return { enc: base64(concatBytes(nonce, gcm(key, nonce).encrypt(canonicalBytes(body)))) };
}
function decryptReplayBody(body, key) {
	const packed = fromBase64(body.enc);
	if (packed.length < 28) throw new Error("invalid encrypted replay body");
	const value = JSON.parse(decodeUtf8(gcm(key, packed.slice(0, 12)).decrypt(packed.slice(12))));
	validateMessageBody(value);
	return value;
}
function validateReplayCompletion(receipt, body) {
	if (receipt.status === "accepted" !== (body !== void 0)) throw new Error("accepted replay completion requires body; rejected completion forbids body");
}
function prepareReplayCompletion(receipt, body, key, rng) {
	const input = structuredClone({
		receipt,
		body
	});
	let prepared;
	return () => prepared ??= {
		receipt: input.receipt,
		...input.body ? { body: encryptReplayBody(input.body, key, rng) } : {}
	};
}
var ReefSqliteReplayStore = class {
	#bodyKey;
	#rng;
	#store;
	#claimOwners = /* @__PURE__ */ new Map();
	#enqueue = createAsyncLock();
	constructor(runtime, bodyKey, rng = randomBytes$1, maxEntries = REEF_REPLAY_MAX_ENTRIES) {
		if (bodyKey.length !== 32) throw new Error("replay body key must be 32 bytes");
		this.#bodyKey = bodyKey.slice();
		this.#rng = rng;
		const options = {
			namespace: REEF_REPLAY_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new",
			defaultTtlMs: REEF_REPLAY_TTL_MS
		};
		this.#store = runtime.state.openKeyedStoreV2(options);
	}
	#mutate(key, prepare) {
		const comparison = this.#store;
		return this.#enqueue(async () => {
			const mutation = prepare();
			let observation = await comparison.observe(key);
			for (;;) {
				const decision = mutation.decide(parseReplayRecord(observation.value));
				const result = await comparison.compareAndApply(key, observation.comparison, decision.value === void 0 ? {
					operation: "update",
					action: "keep"
				} : {
					operation: "update",
					action: "set",
					value: decision.value
				});
				if (result.status === "conflict") {
					observation = result.current;
					continue;
				}
				mutation.publish?.(decision.result);
				return decision.result;
			}
		});
	}
	async claim(peer, id, envelopeHash) {
		const key = reefReplayStoreKey(peer, id);
		return this.#mutate(key, () => {
			const owner = randomUUID();
			const claim = {
				claimOwner: owner,
				claimExpiresAt: Date.now() + REEF_REPLAY_CLAIM_LEASE_MS
			};
			return {
				decide: (existing) => {
					if (!existing) return {
						value: {
							peer,
							id,
							envelopeHash,
							state: "in_flight",
							...claim
						},
						result: "new"
					};
					if (existing.peer !== peer || existing.id !== id || existing.envelopeHash !== envelopeHash) return {
						value: existing,
						result: "mismatch"
					};
					if (existing.state === "completed" || existing.state === "consumed") return {
						value: existing,
						result: "duplicate"
					};
					if (existing.state === "in_flight" && (existing.claimExpiresAt ?? 0) > Date.now()) return {
						value: existing,
						result: "in_flight"
					};
					return {
						value: {
							...existing,
							state: "in_flight",
							...claim
						},
						result: "new"
					};
				},
				publish: (result) => {
					if (result === "new") this.#claimOwners.set(key, owner);
				}
			};
		});
	}
	async refresh(peer, id) {
		const key = reefReplayStoreKey(peer, id);
		const refresh = () => {
			const owner = this.#claimOwners.get(key);
			if (!owner) throw new Error("replay claim is not in flight");
			const claimExpiresAt = Date.now() + REEF_REPLAY_CLAIM_LEASE_MS;
			return {
				decide: (existing) => ({
					value: existing?.state === "in_flight" && existing.claimOwner === owner ? {
						...existing,
						claimExpiresAt
					} : existing,
					result: existing?.state === "in_flight" && existing.claimOwner === owner
				}),
				publish: (refreshed) => {
					if (!refreshed) {
						this.#claimOwners.delete(key);
						throw new Error("replay claim is not in flight");
					}
				}
			};
		};
		await this.#mutate(key, refresh);
	}
	async complete(peer, id, receipt, body) {
		if (receipt.id !== id) throw new Error("receipt id does not match replay claim");
		validateReplayCompletion(receipt, body);
		const completion = prepareReplayCompletion(receipt, body, this.#bodyKey, this.#rng);
		const key = reefReplayStoreKey(peer, id);
		await this.#mutate(key, () => {
			const owner = this.#claimOwners.get(key);
			return {
				decide: (existing) => {
					if (existing?.state !== "in_flight" || existing.claimOwner !== owner) return {
						value: existing,
						result: false
					};
					const { claimOwner: _claimOwner, claimExpiresAt: _claimExpiresAt, ...rest } = existing;
					return {
						value: {
							...rest,
							state: "completed",
							...completion()
						},
						result: true
					};
				},
				publish: (completed) => {
					if (!completed) throw new Error("replay claim is not in flight");
					this.#claimOwners.delete(key);
				}
			};
		});
	}
	async release(peer, id) {
		const key = reefReplayStoreKey(peer, id);
		await this.#mutate(key, () => {
			const owner = this.#claimOwners.get(key);
			return {
				decide: (existing) => ({
					value: existing?.state === "in_flight" && existing.claimOwner === owner ? {
						peer: existing.peer,
						id: existing.id,
						envelopeHash: existing.envelopeHash,
						state: "available"
					} : existing,
					result: void 0
				}),
				publish: () => {
					this.#claimOwners.delete(key);
				}
			};
		});
	}
	async completed(peer, id) {
		const read = (value) => {
			const existing = parseReplayRecord(value);
			if (existing?.peer !== peer || existing.id !== id || existing.state !== "completed" || !existing.receipt) return;
			return existing.body ? {
				receipt: structuredClone(existing.receipt),
				body: decryptReplayBody(existing.body, this.#bodyKey)
			} : { receipt: structuredClone(existing.receipt) };
		};
		const key = reefReplayStoreKey(peer, id);
		return this.#enqueue(async () => read(await this.#store.lookup(key)));
	}
};
//#endregion
//#region extensions/reef/src/state.ts
const REEF_DELIVERED_NAMESPACE = "delivered";
const REEF_DELIVERED_MAX_ENTRIES = 5e3;
const REEF_DELIVERED_TTL_MS = REEF_REPLAY_TTL_MS;
const REEF_INBOX_CURSOR_NAMESPACE = "inbox-cursor";
const REEF_INBOX_CURSOR_MAX_ENTRIES = 1;
const stateOperationHandler = {
	moduleName: "state-operation-api.js",
	exportName: "runReefStateOperation"
};
function openIdentityState(runtime, assertCurrent) {
	const stores = [
		runtime.state.openKeyedStoreV2({
			namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}),
		runtime.state.openKeyedStoreV2({
			namespace: REEF_KEYS_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}),
		runtime.state.openKeyedStoreV2({
			namespace: REEF_KEYS_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}),
		runtime.state.openKeyedStoreV2({
			namespace: REEF_REGISTRATION_NAMESPACE,
			maxEntries: 2,
			overflowPolicy: "reject-new"
		})
	];
	return stores[0].createOperation(stores, stateOperationHandler, assertCurrent ? { assertCurrent } : void 0);
}
async function generateAndStoreKeys(runtime, assertCurrent) {
	return (await openIdentityState(runtime, assertCurrent).execute({
		type: "identity.generate",
		input: void 0
	}, { writeStores: [2] })).value;
}
async function loadKeys(runtime, assertCurrent) {
	const receipt = await openIdentityState(runtime, assertCurrent).execute({
		type: "identity.load",
		input: void 0
	}, {
		writeStores: [],
		watchStores: [
			0,
			1,
			2
		],
		missingValue: void 0
	});
	receipt.assertCurrent();
	if (!receipt.value) throw Object.assign(/* @__PURE__ */ new Error("Reef keys are missing from plugin state"), { code: "ENOENT" });
	return receipt.value;
}
const reviewOperationStates = /* @__PURE__ */ new WeakMap();
function getReefReviewOperationState(reviews) {
	return reviewOperationStates.get(reviews);
}
var ReviewApprovalStore = class {
	#store;
	#maxEntries;
	constructor(runtime, maxEntries = REEF_REVIEWS_MAX_ENTRIES, authoritySignal) {
		this.authoritySignal = authoritySignal;
		this.#maxEntries = maxEntries;
		this.#store = runtime.state.openKeyedStoreV2({
			namespace: REEF_REVIEWS_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new"
		});
		reviewOperationStates.set(this, {
			store: this.#store,
			maxEntries
		});
	}
	#operation(assertOwnerCurrent) {
		return this.#store.createOperation([this.#store], stateOperationHandler, { assertCurrent: () => {
			this.authoritySignal?.throwIfAborted();
			assertOwnerCurrent?.();
		} });
	}
	async request(review) {
		const captured = structuredClone(review);
		return (await this.#operation().execute({
			type: "review.request",
			input: {
				review: captured,
				maxEntries: this.#maxEntries
			}
		}, { writeStores: [0] })).value;
	}
	async lookupDecision(approvalDigest) {
		const receipt = await this.#operation().execute({
			type: "review.lookup",
			input: { digest: approvalDigest }
		}, {
			writeStores: [],
			watchStores: [0],
			missingValue: "none"
		});
		receipt.assertCurrent();
		return receipt.value;
	}
	async decide(digest, approved, assertOwnerCurrent) {
		return (await this.#operation(assertOwnerCurrent).execute({
			type: "review.decide",
			input: {
				digest,
				approved
			}
		}, { writeStores: [0] })).value;
	}
	async list() {
		const receipt = await this.#operation().execute({
			type: "review.list",
			input: void 0
		}, {
			writeStores: [],
			watchStores: [0],
			missingValue: []
		});
		receipt.assertCurrent();
		return receipt.value;
	}
};
var ReefDeliveredStore = class {
	#delivered;
	constructor(runtime, maxEntries = REEF_DELIVERED_MAX_ENTRIES) {
		this.#delivered = runtime.state.openKeyedStoreV2({
			namespace: REEF_DELIVERED_NAMESPACE,
			maxEntries,
			overflowPolicy: "reject-new",
			defaultTtlMs: REEF_DELIVERED_TTL_MS
		});
	}
	async status(id) {
		return (await this.#delivered.lookup(id))?.id === id ? "delivered" : void 0;
	}
	async confirm(id) {
		if (!await this.#delivered.registerIfAbsent(id, { id }) && (await this.#delivered.lookup(id))?.id !== id) throw new Error("Failed persisting Reef delivered marker");
	}
};
/** Durable relay progress for the single Reef identity bound to this state DB. */
var ReefInboxCursorStore = class {
	#store;
	#binding;
	constructor(runtime, binding, authoritySignal) {
		this.authoritySignal = authoritySignal;
		this.#binding = { ...binding };
		const options = {
			namespace: REEF_INBOX_CURSOR_NAMESPACE,
			maxEntries: REEF_INBOX_CURSOR_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		};
		this.#store = runtime.state.openKeyedStoreV2(options);
	}
	#operation() {
		return this.#store.createOperation([this.#store], stateOperationHandler, { assertCurrent: () => this.authoritySignal?.throwIfAborted() });
	}
	async load() {
		this.authoritySignal?.throwIfAborted();
		const receipt = await this.#operation().execute({
			type: "cursor.load",
			input: this.#binding
		}, {
			writeStores: [],
			watchStores: [0],
			missingValue: 0
		});
		receipt.assertCurrent();
		return receipt.value;
	}
	async advance(cursor) {
		this.authoritySignal?.throwIfAborted();
		if (!Number.isSafeInteger(cursor) || cursor < 0) throw new Error("invalid Reef inbox cursor");
		await this.#operation().execute({
			type: "cursor.advance",
			input: {
				...this.#binding,
				cursor
			}
		}, { writeStores: [0] });
	}
};
async function openStores$1(runtime, keys, options = {}) {
	const { authoritySignal } = options;
	const assertCurrent = () => authoritySignal?.throwIfAborted();
	const state = openIdentityState(runtime, assertCurrent);
	const stores = {
		audit: openReefAuditStore(runtime, fromBase64url(keys.auditKey), options.auditMaxEntries, options.authoritySignal),
		replay: new ReefSqliteReplayStore(runtime, fromBase64url(keys.replayKey), randomBytes$1, options.replayMaxEntries),
		reviews: new ReviewApprovalStore(runtime, void 0, options.authoritySignal),
		delivered: new ReefDeliveredStore(runtime, options.deliveredMaxEntries)
	};
	(await state.execute({
		type: "identity.admit",
		input: void 0
	}, {
		writeStores: [],
		watchStores: [0, 1],
		missingValue: void 0
	})).assertCurrent();
	return stores;
}
//#endregion
//#region extensions/reef/src/trust-store-authority.ts
function validateReefPeerIdentity(current, peer, expected, autonomy) {
	if (!current || !matchesReefPeerIdentity(current, expected) || autonomy !== void 0 && current.autonomy !== autonomy) throw new ReefPeerTrustChangedError(peer);
	return current;
}
function createReefPeerAssertion(receipt, peer, current, expected, autonomy) {
	const captured = current ? { ...current } : void 0;
	const identity = { ...expected };
	return () => {
		receipt.assertCurrent();
		validateReefPeerIdentity(captured, peer, identity, autonomy);
	};
}
//#endregion
//#region extensions/reef/src/trust-store-delivery.ts
const recoveryStates = /* @__PURE__ */ new WeakMap();
function getReefRecoveryOperationState(recovery) {
	return recoveryStates.get(recovery);
}
async function readReefOutboundDelivery(operation, input, state) {
	const captured = { ...input };
	const capturedState = { ...state };
	const receipt = await operation.execute({
		type: "readDelivery",
		input: captured
	}, {
		writeStores: [],
		watchStores: [0],
		missingValue: void 0
	});
	receipt.assertCurrent();
	if (!receipt.value) return;
	const { delivery, trust } = receipt.value;
	const expected = ReefOutboundDeliveryBindingSchema.parse({
		bodyHash: delivery.bodyHash,
		textHash: delivery.textHash,
		recipient: delivery.recipient
	});
	let peerAssertion = createReefPeerAssertion(receipt, captured.peer, trust, expected.recipient);
	let pending = true;
	const settle = async (type, settlementInput) => {
		if (!pending) throw new Error("Reef delivery settlement was already consumed");
		pending = false;
		return (await operation.execute({
			type,
			input: settlementInput
		}, {
			writeStores: [1],
			watchStores: [0]
		})).value;
	};
	return {
		delivery,
		recovery: createReefRejectionRecovery(operation, captured, expected.recipient, receipt, capturedState, () => peerAssertion()),
		async currentPeer() {
			const current = await operation.execute({
				type: "snapshot",
				input: { key: captured.peerKey }
			}, {
				writeStores: [],
				watchStores: [0],
				missingValue: { revision: 0 }
			});
			current.assertCurrent();
			peerAssertion = createReefPeerAssertion(current, captured.peer, current.value.trust, expected.recipient);
			return current.value.trust;
		},
		assertCurrent: () => peerAssertion(),
		consume: () => settle("consumeDelivery", {
			...captured,
			expected
		}),
		discard: () => settle("discardDelivery", {
			...captured,
			expected
		}),
		reject: (category) => settle("rejectDelivery", {
			...captured,
			expected,
			category,
			rejectedAt: Date.now()
		})
	};
}
function createReefRejectionRecovery(operation, input, recipient, initialReceipt, operationState, initialAssertion) {
	const captured = { ...input };
	const expected = { ...recipient };
	let sourceReceipt = initialReceipt;
	let assertCurrent = initialAssertion ?? (() => initialReceipt.assertCurrent());
	const recovery = {
		assertCurrent: () => assertCurrent(),
		async loadState() {
			const receipt = await operation.execute({
				type: "snapshot",
				input: { key: captured.peerKey }
			}, {
				writeStores: [],
				watchStores: [0],
				missingValue: { revision: 0 }
			});
			receipt.assertCurrent();
			return receipt.value.rejectionNotice;
		},
		async reserve(state) {
			const notice = ReefRejectionNoticeStateSchema.parse(state);
			assertCurrent = () => {
				throw new Error("Reef rejection reservation did not settle");
			};
			const receipt = await operation.execute({
				type: "reserveRejection",
				input: {
					...captured,
					recipient: expected,
					notice
				}
			}, {
				writeStores: [1],
				watchStores: [0]
			});
			if (receipt.value.kind === "peer-changed") throw new Error(`Reef peer @${captured.peer} changed keys before rejection recovery`);
			if (receipt.value.kind === "unavailable") throw new Error(`Reef rejection ${captured.id} lost its durable delivery state`);
			sourceReceipt = receipt;
			assertCurrent = () => receipt.assertCurrent();
			return receipt.value;
		},
		async complete(state) {
			const notice = ReefRejectionNoticeStateSchema.parse(state);
			return (await operation.execute({
				type: "completeRejection",
				input: {
					...captured,
					notice
				}
			}, { writeStores: [0, 1] })).value;
		}
	};
	recoveryStates.set(recovery, {
		...operationState,
		get sourceReceipt() {
			return sourceReceipt;
		},
		assertCurrent: () => recovery.assertCurrent()
	});
	return recovery;
}
//#endregion
//#region extensions/reef/src/trust-store.ts
const operationHandler = {
	moduleName: "trust-state-operation-api.js",
	exportName: "runReefTrustStateOperation"
};
function openStores(openStore) {
	return {
		peers: openStore(REEF_TRUST_STORE_OPTIONS),
		deliveries: openStore(REEF_DELIVERY_STORE_OPTIONS)
	};
}
var ReefTrustStore = class {
	#prefix;
	constructor(stores, config, assertActive) {
		const identityScope = resolveReefIdentityScope(config);
		this.#prefix = `${identityScope}:`;
		this.operationState = {
			...stores,
			identityScope,
			assertCurrent: () => assertActive?.()
		};
	}
	#operation(assertOwnerCurrent) {
		const state = this.operationState;
		return state.peers.createOperation([state.peers, state.deliveries], operationHandler, { assertCurrent: () => {
			state.assertCurrent();
			assertOwnerCurrent?.();
		} });
	}
	async #read(type, input, missingValue, watchStores = [0]) {
		const receipt = await this.#operation().execute({
			type,
			input
		}, {
			writeStores: [],
			watchStores,
			missingValue
		});
		receipt.assertCurrent();
		return receipt;
	}
	async #write(type, input, writeStores, assertOwnerCurrent) {
		return (await this.#operation(assertOwnerCurrent).execute({
			type,
			input
		}, { writeStores })).value;
	}
	async snapshot(peer) {
		return (await this.#read("snapshot", { key: this.#key(peer) }, { revision: 0 })).value;
	}
	async get(peer) {
		return (await this.snapshot(peer)).trust;
	}
	async observePeer(peer) {
		const normalized = requirePeer(peer);
		const receipt = await this.#read("snapshot", { key: this.#key(normalized) }, { revision: 0 });
		const trust = receipt.value.trust;
		return trust ? {
			trust,
			assertCurrent: createReefPeerAssertion(receipt, normalized, trust, reefPeerIdentity(trust), trust.autonomy)
		} : void 0;
	}
	async list() {
		return (await this.#read("list", { prefix: this.#prefix }, [])).value;
	}
	async set(peer, trust) {
		await this.#write("set", {
			key: this.#key(peer),
			trust: ReefPeerTrustSchema.parse(trust)
		}, [0]);
	}
	remove(peer, assertOwnerCurrent) {
		return this.#write("remove", { key: this.#key(peer) }, [0], assertOwnerCurrent);
	}
	async beginRemoval(peer, assertOwnerCurrent) {
		const key = this.#key(peer);
		const state = this.operationState;
		let admitted = false;
		const operation = state.peers.createOperation([state.peers, state.deliveries], operationHandler, { assertCurrent: () => {
			if (!admitted) {
				state.assertCurrent();
				assertOwnerCurrent?.();
			}
		} });
		const revoke = () => operation.execute({
			type: "remove",
			input: { key }
		}, { writeStores: [0] });
		await revoke();
		admitted = true;
		let pending = true;
		return async () => {
			if (!pending) throw new Error("Reef removal settlement was already consumed");
			pending = false;
			await revoke();
		};
	}
	async setAutonomy(peer, autonomy, assertOwnerCurrent) {
		if (!await this.#write("setAutonomy", {
			key: this.#key(peer),
			autonomy: ReefAutonomySchema.parse(autonomy)
		}, [0], assertOwnerCurrent)) throw new Error(`Reef peer @${requirePeer(peer)} is not locally trusted`);
	}
	markSafetyNumberChanged(peer, expectedRevision) {
		return this.#write("markSafetyNumberChanged", {
			key: this.#key(peer),
			expectedRevision
		}, [0]);
	}
	commitPeerTrust(friend, options, approvedAt = Date.now()) {
		return this.#write("commitPeerTrust", {
			key: this.#key(friend.peer),
			friend: { ...friend },
			...options,
			approvedAt
		}, [0]);
	}
	createPairingApproval(friend, trustRevision) {
		return createReefPairingApproval(this.operationState.identityScope, friend, trustRevision);
	}
	parsePairingApproval(raw) {
		return parseReefPairingApproval(this.operationState.identityScope, raw);
	}
	async matchesPairingApproval(raw, friend) {
		const captured = { ...friend };
		return raw.trim() === this.createPairingApproval(captured, (await this.snapshot(captured.peer)).revision);
	}
	async beginRequest(peer, requestedAt = Date.now(), assertOwnerCurrent) {
		const requestId = randomUUID();
		const key = this.#key(peer);
		const state = this.operationState;
		let admitted = false;
		const operation = state.peers.createOperation([state.peers, state.deliveries], operationHandler, { assertCurrent: () => {
			if (!admitted) {
				state.assertCurrent();
				assertOwnerCurrent?.();
			}
		} });
		await operation.execute({
			type: "beginRequest",
			input: {
				key,
				requestId,
				requestedAt
			}
		}, { writeStores: [0] });
		admitted = true;
		let pending = true;
		const consume = async (run) => {
			if (!pending) throw new Error("Reef request settlement was already consumed");
			pending = false;
			return run();
		};
		return {
			requestId,
			status: () => consume(async () => (await operation.execute({
				type: "requestStatus",
				input: {
					key,
					requestId
				}
			}, {
				writeStores: [],
				missingValue: "revoked"
			})).value),
			remove: () => consume(async () => {
				await operation.execute({
					type: "removeRequest",
					input: {
						key,
						requestId
					}
				}, { writeStores: [0] });
			}),
			close: () => {
				pending = false;
			}
		};
	}
	async hasOutboundRequest(peer) {
		return Object.keys((await this.snapshot(peer)).outboundRequests ?? {}).length > 0;
	}
	removeOutboundRequest(peer, requestId) {
		return this.#write("removeRequest", {
			key: this.#key(peer),
			requestId
		}, [0]);
	}
	async overdueOutboundDeliveries(olderThanMs, now = Date.now()) {
		return (await this.#read("overdueDeliveries", {
			prefix: this.#prefix,
			olderThanMs,
			now
		}, [], [0, 1])).value;
	}
	markOutboundDeliveryOverdueNotified(peer, id) {
		return this.#write("markDeliveryOverdue", {
			...this.#delivery(peer, id),
			now: Date.now()
		}, [1]);
	}
	readOutboundDelivery(peer, id) {
		return readReefOutboundDelivery(this.#operation(), this.#delivery(peer, id), this.operationState);
	}
	async pendingOutboundRejections() {
		const operation = this.#operation();
		const receipt = await operation.execute({
			type: "pendingRejections",
			input: { prefix: this.#prefix }
		}, {
			writeStores: [],
			missingValue: [],
			watchStores: [0, 1]
		});
		receipt.assertCurrent();
		return receipt.value.map((entry) => Object.assign({}, entry, { recovery: createReefRejectionRecovery(operation, this.#delivery(entry.peer, entry.id), entry.recipient, receipt, this.operationState) }));
	}
	async rejectionNoticeState(peer) {
		return (await this.snapshot(peer)).rejectionNotice;
	}
	#key(peer) {
		return `${this.#prefix}${requirePeer(peer)}`;
	}
	#delivery(peer, id) {
		if (!MESSAGE_ID_PATTERN.test(id)) throw new Error(`Invalid Reef delivery id: ${id}`);
		const normalized = requirePeer(peer);
		const peerKey = this.#key(normalized);
		return {
			peer: normalized,
			peerKey,
			deliveryKey: `${peerKey}:${id}`,
			id
		};
	}
};
function getReefTrustOperationState(trust) {
	return trust.operationState;
}
function openReefTrustStore(runtime, config, assertCurrent) {
	return new ReefTrustStore(openStores(runtime.state.openKeyedStoreV2), config, assertCurrent);
}
//#endregion
//#region extensions/reef/src/doctor-state-paths.ts
const REEF_DURABLE_LEGACY_FILENAMES = [
	"keys.json",
	"identity.json",
	"setup-session.json",
	"audit.jsonl",
	"replay.jsonl",
	"reviews.json",
	"delivered.json"
];
function resolveLegacyReefStateDir(params) {
	const reef = params.config.channels?.reef;
	const configured = isRecord(reef) && typeof reef.stateDir === "string" ? reef.stateDir : null;
	const defaultDir = resolveDefaultLegacyReefStateDir(params.homeDir);
	const configuredDir = configured ? resolveUserPath(configured, params.env) : null;
	if (configuredDir) return configuredDir;
	const relativeToActiveState = path.relative(path.resolve(params.stateDir), defaultDir);
	return relativeToActiveState === "" || !relativeToActiveState.startsWith(`..${path.sep}`) && relativeToActiveState !== ".." && !path.isAbsolute(relativeToActiveState) ? defaultDir : path.join(params.stateDir, "data", "reef");
}
function resolveDefaultLegacyReefStateDir(homeDir = os.homedir()) {
	return path.join(homeDir, ".openclaw", "data", "reef");
}
const collectLegacyReefStateBackupResources = (params) => [{
	path: resolveLegacyReefStateDir(params),
	kind: "directory"
}];
async function legacyReefFileExists(filePath) {
	try {
		return (await fs.stat(filePath)).isFile();
	} catch {
		return false;
	}
}
async function listLegacyReefFiles(stateDir, filenames) {
	return (await Promise.all(filenames.map(async (filename) => ({
		filename,
		exists: await legacyReefFileExists(path.join(stateDir, filename))
	})))).filter((entry) => entry.exists).map((entry) => entry.filename);
}
//#endregion
export { REEF_REPLAY_MAX_ENTRIES as _, resolveLegacyReefStateDir as a, reefReplayStoreKey as b, getReefRecoveryOperationState as c, REEF_DELIVERED_TTL_MS as d, ReefInboxCursorStore as f, openStores$1 as g, loadKeys as h, listLegacyReefFiles as i, REEF_DELIVERED_MAX_ENTRIES as l, getReefReviewOperationState as m, collectLegacyReefStateBackupResources as n, getReefTrustOperationState as o, generateAndStoreKeys as p, legacyReefFileExists as r, openReefTrustStore as s, REEF_DURABLE_LEGACY_FILENAMES as t, REEF_DELIVERED_NAMESPACE as u, REEF_REPLAY_NAMESPACE as v, getReefAuditOperationState as x, REEF_REPLAY_TTL_MS as y };
