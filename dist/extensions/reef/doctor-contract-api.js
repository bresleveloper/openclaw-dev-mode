import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { i as defineStrayPluginEntryConfigMigration } from "../../runtime-doctor-migrations-_pMXigSc.mjs";
import { t as archiveLegacyStateSource } from "../../doctor-state-migration-fs-CfVap4xL.mjs";
import { a as parseReefRelayUrl, i as normalizeReefTarget, n as ReefChannelConfigSchema, p as parseVerdict } from "../../config-schema-CDfLULtN.mjs";
import { A as reefReplayStoreKey, B as parseReefSetupSession, D as REEF_REPLAY_MAX_ENTRIES, E as parseReefKeys, G as REEF_AUDIT_HEAD_NAMESPACE, J as REEF_AUDIT_MIGRATION_NAMESPACE, K as REEF_AUDIT_MAX_ENTRIES, M as REEF_REGISTRATION_NAMESPACE, N as REEF_REGISTRATION_SESSION_KEY, O as REEF_REPLAY_NAMESPACE, Q as reefAuditEntryKey, W as REEF_AUDIT_HEAD_KEY, X as REEF_AUDIT_STORE_MAX_ENTRIES, Y as REEF_AUDIT_NAMESPACE, Z as parseReefAuditHead, _ as REEF_KEYS_MIGRATION_KEY, b as REEF_REVIEWS_MAX_ENTRIES, d as REEF_DELIVERED_MAX_ENTRIES, f as REEF_DELIVERED_NAMESPACE, ft as verifyChain, g as REEF_KEYS_KEY, h as REEF_DURABLE_MIGRATION_NAMESPACE, j as REEF_REGISTRATION_IDENTITY_KEY, k as REEF_REPLAY_TTL_MS, m as REEF_DURABLE_MIGRATION_KEY, n as legacyReefFileExists, o as REEF_TRUST_STORE_MAX_ENTRIES, p as REEF_DELIVERED_TTL_MS, pt as verifyChainSegment, q as REEF_AUDIT_MIGRATION_KEY, r as resolveLegacyReefStateDir, s as REEF_TRUST_STORE_NAMESPACE, t as REEF_DURABLE_LEGACY_FILENAMES, u as resolveReefTrustStoreKey, v as REEF_KEYS_MIGRATION_NAMESPACE, x as REEF_REVIEWS_NAMESPACE, y as REEF_KEYS_NAMESPACE, z as parseReefIdentityBinding } from "../../doctor-state-paths-DpN9dGtt.mjs";
import { r as ReefPeerTrustSchema } from "../../friend-types-DKK2gCV4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/reef/src/doctor-durable-state.ts
const REEF_RUNTIME_LEGACY_FILENAMES = [
	"replay.jsonl",
	"reviews.json",
	"delivered.json"
];
async function readLegacyReefAudit(filePath) {
	const entries = (await fs.readFile(filePath, "utf8")).split("\n").filter((line) => line.length > 0).map((line) => JSON.parse(line));
	if (!verifyChain(entries)) throw new Error("invalid Reef audit chain");
	return entries;
}
async function readStoredReefAudit(store, headStore) {
	const headValue = await headStore.lookup(REEF_AUDIT_HEAD_KEY);
	if (!headValue) return [];
	const head = parseReefAuditHead(headValue);
	const reversed = [];
	let hash = head.hash;
	for (let seq = head.seq; seq > 0 && reversed.length < 3e4; seq--) {
		const record = await store.lookup(reefAuditEntryKey(hash));
		if (!record) break;
		if (record.entry.entryHash !== hash || record.entry.event.seq !== seq) throw new Error("invalid Reef audit chain state");
		reversed.push(record.entry);
		hash = record.entry.prevHash;
	}
	const expectedEntries = Math.min(head.seq, REEF_AUDIT_MAX_ENTRIES);
	if (reversed.length !== expectedEntries) throw new Error("Reef audit chain is shorter than its committed retention window");
	const entries = reversed.toReversed();
	const first = entries[0];
	if (!first || !verifyChainSegment(entries, {
		previousHash: first.prevHash,
		previousSeq: first.event.seq - 1,
		head: head.hash
	})) throw new Error("invalid Reef audit chain state");
	return entries;
}
function requireLegacyReplayString(record, field) {
	const value = record[field];
	if (typeof value !== "string" || value.length === 0) throw new Error(`invalid Reef replay ${field}`);
	return value;
}
function parseLegacySignedReceipt(value) {
	const id = requireLegacyReplayString(value, "id");
	const bodyHash = requireLegacyReplayString(value, "bodyHash");
	const auditHead = requireLegacyReplayString(value, "auditHead");
	const signature = requireLegacyReplayString(value, "signature");
	if (value.status !== "accepted" && value.status !== "rejected") throw new Error("invalid Reef replay receipt status");
	if (value.category !== void 0 && typeof value.category !== "string") throw new Error("invalid Reef replay receipt category");
	return {
		id,
		bodyHash,
		auditHead,
		status: value.status,
		signature,
		...value.category !== void 0 ? { category: value.category } : {}
	};
}
function parseLegacyReviewRequest(value) {
	const direction = value.direction;
	if (direction !== "inbound" && direction !== "outbound") throw new Error("invalid Reef review direction");
	return {
		id: requireLegacyReplayString(value, "id"),
		from: requireLegacyReplayString(value, "from"),
		to: requireLegacyReplayString(value, "to"),
		direction,
		bodyHash: requireLegacyReplayString(value, "bodyHash"),
		approvalDigest: requireLegacyReplayString(value, "approvalDigest"),
		verdict: parseVerdict(value.verdict)
	};
}
function parseLegacyReefReplayLine(value) {
	if (!isRecord(value)) throw new Error("invalid Reef replay record");
	const peer = requireLegacyReplayString(value, "peer");
	const id = requireLegacyReplayString(value, "id");
	if (value.op === "claim") return {
		op: "claim",
		peer,
		id,
		envelopeHash: requireLegacyReplayString(value, "envelopeHash")
	};
	if (value.op === "consume" || value.op === "release") return {
		op: value.op,
		peer,
		id
	};
	if (value.op !== "complete" || !isRecord(value.receipt)) throw new Error("invalid Reef replay operation");
	const receipt = parseLegacySignedReceipt(value.receipt);
	if (receipt.id !== id || !["accepted", "rejected"].includes(receipt.status)) throw new Error("invalid Reef replay receipt");
	const body = value.body;
	if (receipt.status === "accepted" && (!isRecord(body) || typeof body.enc !== "string") || receipt.status === "rejected" && body !== void 0) throw new Error("invalid Reef replay completion");
	return {
		op: "complete",
		peer,
		id,
		receipt,
		...isRecord(body) && typeof body.enc === "string" ? { body: { enc: body.enc } } : {}
	};
}
async function readLegacyReefReplay(filePath) {
	const raw = await fs.readFile(filePath, "utf8");
	const lines = raw.split("\n").filter((line) => line.length > 0);
	const records = /* @__PURE__ */ new Map();
	for (const [index, line] of lines.entries()) {
		let log;
		try {
			log = parseLegacyReefReplayLine(JSON.parse(line));
		} catch (error) {
			if (index === lines.length - 1 && !raw.endsWith("\n")) break;
			throw error;
		}
		const key = reefReplayStoreKey(log.peer, log.id);
		const existing = records.get(key);
		let next;
		if (log.op === "claim") {
			if (existing && existing.envelopeHash !== log.envelopeHash) throw new Error("conflicting Reef replay binding");
			next = {
				peer: log.peer,
				id: log.id,
				envelopeHash: log.envelopeHash,
				state: "available"
			};
		} else {
			if (!existing) throw new Error(`Reef replay ${log.op} lacks claim`);
			if (log.op === "complete") next = {
				...existing,
				state: "completed",
				receipt: log.receipt,
				...log.body ? { body: log.body } : {}
			};
			else if (log.op === "consume") next = {
				peer: existing.peer,
				id: existing.id,
				envelopeHash: existing.envelopeHash,
				state: "consumed"
			};
			else next = {
				...existing,
				state: "available"
			};
		}
		records.delete(key);
		records.set(key, next);
	}
	return [...records.values()];
}
async function readLegacyReefReviews(filePath) {
	const value = JSON.parse(await fs.readFile(filePath, "utf8"));
	if (!isRecord(value)) throw new Error("invalid Reef reviews file");
	const records = /* @__PURE__ */ new Map();
	for (const [digest, raw] of Object.entries(value)) {
		if (!isRecord(raw) || !isRecord(raw.review)) throw new Error(`invalid Reef review ${digest}`);
		const review = parseLegacyReviewRequest(raw.review);
		if (review.approvalDigest !== digest || raw.approved !== void 0 && typeof raw.approved !== "boolean") throw new Error(`invalid Reef review ${digest}`);
		records.set(digest, {
			review,
			...typeof raw.approved === "boolean" ? { approved: raw.approved } : {}
		});
	}
	return records;
}
async function readLegacyReefDelivered(filePath) {
	const value = JSON.parse(await fs.readFile(filePath, "utf8"));
	if (!Array.isArray(value) || value.some((id) => typeof id !== "string" || id.length === 0)) throw new Error("invalid Reef delivered file");
	return [...new Set(value)];
}
const reefAuditStateMigration = {
	id: "reef-audit-jsonl-to-plugin-state",
	label: "Reef audit trail",
	async detectLegacyState(params) {
		const filePath = path.join(resolveLegacyReefStateDir(params), "audit.jsonl");
		const migrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_AUDIT_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const sourceExists = await legacyReefFileExists(filePath);
		const pending = await migrationStore.lookup(REEF_AUDIT_MIGRATION_KEY);
		return sourceExists || pending ? { preview: [sourceExists ? "- Reef audit trail -> plugin state (audit)" : "- Verify Reef audit migration marker"] } : null;
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const filePath = path.join(resolveLegacyReefStateDir(params), "audit.jsonl");
		const migrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_AUDIT_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const durableMigrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const store = params.context.openPluginStateKeyedStore({
			namespace: REEF_AUDIT_NAMESPACE,
			maxEntries: REEF_AUDIT_STORE_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		});
		const headStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_AUDIT_HEAD_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		if (await legacyReefFileExists(filePath) || await migrationStore.lookup("audit-jsonl") || await durableMigrationStore.lookup("legacy-files")) await durableMigrationStore.register(REEF_DURABLE_MIGRATION_KEY, { pending: true });
		if (!await legacyReefFileExists(filePath)) {
			const pending = await migrationStore.lookup(REEF_AUDIT_MIGRATION_KEY);
			if (!pending) return {
				changes,
				warnings
			};
			try {
				const canonical = await readStoredReefAudit(store, headStore);
				if (pending.expectedEntries === void 0 ? canonical.length === 0 : canonical.length !== pending.expectedEntries) throw new Error("canonical audit trail does not match the verified import");
				await migrationStore.delete(REEF_AUDIT_MIGRATION_KEY);
				changes.push("Verified Reef audit trail; cleared completed migration marker");
			} catch (error) {
				warnings.push(`Reef audit migration is incomplete and audit.jsonl is missing: ${String(error)}; left migration blocker in place`);
			}
			return {
				changes,
				warnings
			};
		}
		await migrationStore.register(REEF_AUDIT_MIGRATION_KEY, { pending: true });
		let legacy;
		try {
			legacy = await readLegacyReefAudit(filePath);
		} catch (error) {
			if (error.code === "ENOENT") return {
				changes,
				warnings
			};
			warnings.push(`Failed importing Reef audit trail: ${String(error)}; left source in place`);
			return {
				changes,
				warnings
			};
		}
		let canonical;
		try {
			canonical = await readStoredReefAudit(store, headStore);
		} catch (error) {
			warnings.push(`Failed reading canonical Reef audit trail: ${String(error)}; left legacy source in place`);
			return {
				changes,
				warnings
			};
		}
		if (canonical.length > 0 && JSON.stringify(canonical) !== JSON.stringify(legacy.slice(-canonical.length))) {
			warnings.push("Kept existing Reef audit trail; left differing legacy source in place");
			return {
				changes,
				warnings
			};
		}
		const retained = legacy.slice(-REEF_AUDIT_MAX_ENTRIES);
		if (canonical.length === 0 && retained.length > 0) try {
			for (const [index, entry] of retained.entries()) {
				const key = reefAuditEntryKey(entry.entryHash);
				const nextHash = retained[index + 1]?.entryHash;
				const record = {
					kind: "entry",
					entry,
					...nextHash ? { nextHash } : {}
				};
				const existing = await store.lookup(key);
				if (existing && JSON.stringify(existing) !== JSON.stringify(record)) throw new Error(`conflicting audit entry ${entry.entryHash}`);
				await store.registerIfAbsent(key, record);
			}
			const last = retained.at(-1);
			const first = retained[0];
			if (!await headStore.registerIfAbsent("head", {
				kind: "head",
				hash: last.entryHash,
				seq: last.event.seq,
				oldestHash: first.entryHash
			})) throw new Error("audit head appeared during import");
		} catch (error) {
			warnings.push(`Failed importing Reef audit trail: ${String(error)}; left source in place`);
			return {
				changes,
				warnings
			};
		}
		const persisted = await readStoredReefAudit(store, headStore);
		if (JSON.stringify(persisted) !== JSON.stringify(retained)) {
			warnings.push("Failed verifying Reef audit trail after import; left source in place");
			return {
				changes,
				warnings
			};
		}
		changes.push(`Migrated ${legacy.length} Reef audit ${legacy.length === 1 ? "entry" : "entries"} -> plugin state`);
		await migrationStore.register(REEF_AUDIT_MIGRATION_KEY, {
			pending: true,
			expectedEntries: persisted.length
		});
		const warningCount = warnings.length;
		await archiveLegacyStateSource({
			filePath,
			label: "Reef audit trail",
			changes,
			warnings
		});
		if (persisted.length < legacy.length && warnings.length === warningCount) changes.push(`Retained the newest ${persisted.length} Reef audit entries in SQLite; preserved the complete ${legacy.length}-entry chain in the archived legacy source`);
		if (warnings.length === warningCount) await migrationStore.delete(REEF_AUDIT_MIGRATION_KEY);
		return {
			changes,
			warnings
		};
	}
};
const reefRuntimeStateMigration = {
	id: "reef-runtime-files-to-plugin-state",
	label: "Reef durable runtime state",
	async detectLegacyState(params) {
		const stateDir = resolveLegacyReefStateDir(params);
		const files = (await Promise.all(REEF_RUNTIME_LEGACY_FILENAMES.map(async (filename) => ({
			filename,
			exists: await legacyReefFileExists(path.join(stateDir, filename))
		})))).filter((entry) => entry.exists);
		const durableSourceExists = (await Promise.all(REEF_DURABLE_LEGACY_FILENAMES.map((filename) => legacyReefFileExists(path.join(stateDir, filename))))).some(Boolean);
		const durablePending = await params.context.openPluginStateKeyedStore({
			namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		}).lookup(REEF_DURABLE_MIGRATION_KEY);
		return files.length > 0 || durableSourceExists || durablePending ? { preview: [files.length > 0 ? `- Reef runtime state -> plugin state (${files.map((entry) => entry.filename).join(", ")})` : durableSourceExists ? "- Finalize Reef durable state migration barrier" : "- Verify Reef durable state migration barrier"] } : null;
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const stateDir = resolveLegacyReefStateDir(params);
		const durableMigrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const durablePending = await durableMigrationStore.lookup(REEF_DURABLE_MIGRATION_KEY);
		if ((await Promise.all(REEF_RUNTIME_LEGACY_FILENAMES.map((filename) => legacyReefFileExists(path.join(stateDir, filename))))).some(Boolean) || durablePending) await durableMigrationStore.register(REEF_DURABLE_MIGRATION_KEY, { pending: true });
		const replayPath = path.join(stateDir, "replay.jsonl");
		if (await legacyReefFileExists(replayPath)) try {
			const legacy = await readLegacyReefReplay(replayPath);
			const store = params.context.openPluginStateKeyedStore({
				namespace: REEF_REPLAY_NAMESPACE,
				maxEntries: REEF_REPLAY_MAX_ENTRIES,
				overflowPolicy: "reject-new",
				defaultTtlMs: REEF_REPLAY_TTL_MS
			});
			const canonicalEntries = await store.entries();
			const canonical = new Map(canonicalEntries.map((entry) => [entry.key, entry.value]));
			for (const record of legacy) {
				const key = reefReplayStoreKey(record.peer, record.id);
				const existing = canonical.get(key);
				if (existing && JSON.stringify(existing) !== JSON.stringify(record)) throw new Error(`canonical replay state ${key} differs`);
			}
			const missing = legacy.filter((record) => !canonical.has(reefReplayStoreKey(record.peer, record.id)));
			if (canonical.size + missing.length > 3e3) throw new Error(`${canonical.size + missing.length} replay bindings exceed plugin-state capacity`);
			for (const record of missing) await store.registerIfAbsent(reefReplayStoreKey(record.peer, record.id), record);
			for (const entry of canonicalEntries) if (JSON.stringify(await store.lookup(entry.key)) !== JSON.stringify(entry.value)) throw new Error(`canonical replay state ${entry.key} changed during import`);
			for (const record of missing) if (JSON.stringify(await store.lookup(reefReplayStoreKey(record.peer, record.id))) !== JSON.stringify(record)) throw new Error("persisted replay state differs");
			changes.push(`Migrated ${legacy.length} Reef replay bindings -> plugin state`);
			await archiveLegacyStateSource({
				filePath: replayPath,
				label: "Reef replay state",
				changes,
				warnings
			});
		} catch (error) {
			warnings.push(`Failed importing Reef replay state: ${String(error)}; left source in place`);
		}
		const reviewsPath = path.join(stateDir, "reviews.json");
		if (await legacyReefFileExists(reviewsPath)) try {
			const legacy = await readLegacyReefReviews(reviewsPath);
			const pending = [...legacy].filter(([, record]) => record.approved === void 0);
			if (pending.length > 2e3) throw new Error(`${pending.length} pending reviews exceed plugin-state capacity`);
			const completed = [...legacy].filter(([, record]) => record.approved !== void 0);
			const completedCapacity = REEF_REVIEWS_MAX_ENTRIES - pending.length;
			const retainedCompleted = completedCapacity > 0 ? completed.slice(-completedCapacity) : [];
			const retainedKeys = new Set([...pending, ...retainedCompleted].map(([digest]) => digest));
			const retained = new Map([...legacy].filter(([digest]) => retainedKeys.has(digest)));
			const store = params.context.openPluginStateKeyedStore({
				namespace: REEF_REVIEWS_NAMESPACE,
				maxEntries: REEF_REVIEWS_MAX_ENTRIES,
				overflowPolicy: "reject-new"
			});
			for (const [digest, record] of retained) {
				const existing = await store.lookup(digest);
				if (existing && JSON.stringify(existing) !== JSON.stringify(record)) throw new Error(`canonical review ${digest} differs`);
				if (!existing) await store.registerIfAbsent(digest, record);
			}
			for (const [digest, record] of retained) if (JSON.stringify(await store.lookup(digest)) !== JSON.stringify(record)) throw new Error(`persisted review ${digest} differs`);
			changes.push(`Migrated ${retained.size} of ${legacy.size} Reef reviews -> plugin state`);
			await archiveLegacyStateSource({
				filePath: reviewsPath,
				label: "Reef reviews",
				changes,
				warnings
			});
		} catch (error) {
			warnings.push(`Failed importing Reef reviews: ${String(error)}; left source in place`);
		}
		const deliveredPath = path.join(stateDir, "delivered.json");
		if (await legacyReefFileExists(deliveredPath)) try {
			const legacy = await readLegacyReefDelivered(deliveredPath);
			const store = params.context.openPluginStateKeyedStore({
				namespace: REEF_DELIVERED_NAMESPACE,
				maxEntries: REEF_DELIVERED_MAX_ENTRIES,
				overflowPolicy: "reject-new",
				defaultTtlMs: REEF_DELIVERED_TTL_MS
			});
			const canonicalEntries = await store.entries();
			const canonical = new Map(canonicalEntries.map((entry) => [entry.key, entry.value]));
			for (const id of legacy) {
				const existing = canonical.get(id);
				if (existing && existing.id !== id) throw new Error(`canonical delivered marker ${id} differs`);
			}
			const missing = legacy.filter((id) => !canonical.has(id));
			if (canonical.size + missing.length > 5e3) throw new Error(`${canonical.size + missing.length} delivered markers exceed plugin-state capacity`);
			for (const id of missing) await store.registerIfAbsent(id, { id });
			for (const entry of canonicalEntries) if (JSON.stringify(await store.lookup(entry.key)) !== JSON.stringify(entry.value)) throw new Error(`canonical delivered marker ${entry.key} changed during import`);
			for (const id of missing) if ((await store.lookup(id))?.id !== id) throw new Error(`persisted delivered marker ${id} differs`);
			changes.push(`Migrated ${legacy.length} Reef delivered markers -> plugin state`);
			await archiveLegacyStateSource({
				filePath: deliveredPath,
				label: "Reef delivered markers",
				changes,
				warnings
			});
		} catch (error) {
			warnings.push(`Failed importing Reef delivered markers: ${String(error)}; left source in place`);
		}
		const remainingSources = (await Promise.all(REEF_DURABLE_LEGACY_FILENAMES.map(async (filename) => ({
			filename,
			exists: await legacyReefFileExists(path.join(stateDir, filename))
		})))).filter((entry) => entry.exists);
		const identityMigrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_KEYS_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		const auditMigrationStore = params.context.openPluginStateKeyedStore({
			namespace: REEF_AUDIT_MIGRATION_NAMESPACE,
			maxEntries: 1,
			overflowPolicy: "reject-new"
		});
		if (remainingSources.length === 0 && !await identityMigrationStore.lookup("keys-json") && !await auditMigrationStore.lookup("audit-jsonl")) {
			if (await durableMigrationStore.delete("legacy-files")) changes.push("Verified all Reef durable state; cleared migration barrier");
		} else if (await durableMigrationStore.lookup("legacy-files")) warnings.push(`Reef durable state migration is incomplete; left migration blocker in place${remainingSources.length > 0 ? ` (${remainingSources.map((entry) => entry.filename).join(", ")})` : ""}`);
		return {
			changes,
			warnings
		};
	}
};
//#endregion
//#region extensions/reef/config-doctor-api.ts
function hasRetiredReefPolicyConfig(value) {
	return isRecord(value) && ["dmPolicy", "allowFrom"].some((key) => Object.hasOwn(value, key));
}
const reefStrayEntryConfigMigration = defineStrayPluginEntryConfigMigration({
	pluginId: "reef",
	channelId: "reef",
	validateMergedChannelConfig: (merged) => ReefChannelConfigSchema.safeParse(merged).success
});
const legacyConfigRules = [{
	path: ["channels", "reef"],
	message: "channels.reef dmPolicy/allowFrom are legacy; run \"openclaw doctor --fix\" to remove them. Peer trust is SQLite-backed.",
	match: hasRetiredReefPolicyConfig
}, reefStrayEntryConfigMigration.legacyConfigRule];
function normalizeCompatibilityConfig({ cfg }) {
	const reef = cfg.channels?.reef;
	let config = cfg;
	const changes = [];
	if (isRecord(reef) && hasRetiredReefPolicyConfig(reef)) {
		const next = structuredClone(cfg);
		const nextReef = next.channels?.reef;
		if (isRecord(nextReef)) {
			for (const key of ["dmPolicy", "allowFrom"]) if (Object.hasOwn(nextReef, key)) {
				delete nextReef[key];
				changes.push(`Removed retired Reef ${key} field.`);
			}
			config = next;
		}
	}
	const stray = reefStrayEntryConfigMigration.normalizeConfig({ cfg: config });
	return {
		config: stray.config,
		changes: [...changes, ...stray.changes]
	};
}
//#endregion
//#region extensions/reef/doctor-contract-api.ts
const RETIRED_REEF_CONFIG_KEYS = [
	"friends",
	"dmPolicy",
	"allowFrom"
];
const REEF_CONFIG_IMPORT_NAMESPACE = "peer-state-config-imports";
const LegacyReefFriendSchema = ReefPeerTrustSchema.omit({ approvedAt: true });
const ReefIdentityConfigSchema = ReefChannelConfigSchema.pick({
	handle: true,
	relayUrl: true
});
const REEF_LEGACY_REGISTRATION_SOURCES = [{
	filename: "identity.json",
	key: REEF_REGISTRATION_IDENTITY_KEY,
	parse: parseReefIdentityBinding,
	label: "Reef identity binding"
}, {
	filename: "setup-session.json",
	key: REEF_REGISTRATION_SESSION_KEY,
	parse: parseReefSetupSession,
	label: "Reef setup session"
}];
function configuredReefIdentityBinding(cfg) {
	const reef = cfg.channels?.reef;
	if (!isRecord(reef) || !Object.hasOwn(reef, "handle") || reef.handle === void 0) return { status: "absent" };
	const parsed = ReefIdentityConfigSchema.safeParse({
		handle: reef.handle,
		relayUrl: reef.relayUrl
	});
	if (!parsed.success || !parsed.data.handle) return { status: "invalid" };
	return {
		status: "valid",
		binding: {
			handle: parsed.data.handle,
			relayUrl: parseReefRelayUrl(parsed.data.relayUrl)
		}
	};
}
function inspectLegacyReefFriends(cfg) {
	const reef = cfg.channels?.reef;
	if (!isRecord(reef) || !Object.hasOwn(reef, "friends")) return null;
	const rawFriends = isRecord(reef.friends) ? reef.friends : null;
	const canonicalCandidate = { ...reef };
	for (const key of RETIRED_REEF_CONFIG_KEYS) delete canonicalCandidate[key];
	const parsedConfig = ReefChannelConfigSchema.safeParse(canonicalCandidate);
	const config = parsedConfig.success && parsedConfig.data.handle ? parsedConfig.data : null;
	const friends = /* @__PURE__ */ new Map();
	let rejected = rawFriends ? 0 : 1;
	for (const [peer, value] of Object.entries(rawFriends ?? {})) {
		const parsedFriend = LegacyReefFriendSchema.safeParse(value);
		if (normalizeReefTarget(peer) !== peer || !parsedFriend.success) {
			rejected++;
			continue;
		}
		friends.set(peer, parsedFriend.data);
	}
	return {
		config,
		friends,
		rejected,
		total: rawFriends ? Object.keys(rawFriends).length : 0
	};
}
const stateMigrations = [
	{
		id: "reef-keys-json-to-plugin-state",
		label: "Reef identity keys",
		async detectLegacyState(params) {
			const stateDir = resolveLegacyReefStateDir(params);
			const filePath = path.join(stateDir, "keys.json");
			const migrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_KEYS_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const durableMigrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const sourceExists = await legacyReefFileExists(filePath);
			const pending = await migrationStore.lookup(REEF_KEYS_MIGRATION_KEY);
			const durableSourceExists = (await Promise.all(REEF_DURABLE_LEGACY_FILENAMES.map((filename) => legacyReefFileExists(path.join(stateDir, filename))))).some(Boolean);
			const durablePending = await durableMigrationStore.lookup(REEF_DURABLE_MIGRATION_KEY);
			return sourceExists || pending || durableSourceExists || durablePending ? { preview: [sourceExists ? "- Reef identity keys -> plugin state (identity)" : pending ? "- Verify Reef identity-key migration marker" : "- Prepare Reef durable state migration barrier"] } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const stateDir = resolveLegacyReefStateDir(params);
			const filePath = path.join(stateDir, "keys.json");
			const migrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_KEYS_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const store = params.context.openPluginStateKeyedStore({
				namespace: REEF_KEYS_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const durableMigrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const durableSourceExists = (await Promise.all(REEF_DURABLE_LEGACY_FILENAMES.map((filename) => legacyReefFileExists(path.join(stateDir, filename))))).some(Boolean);
			const durablePending = await durableMigrationStore.lookup(REEF_DURABLE_MIGRATION_KEY);
			if (durableSourceExists || durablePending) await durableMigrationStore.register(REEF_DURABLE_MIGRATION_KEY, { pending: true });
			if (!await legacyReefFileExists(filePath)) {
				const pending = await migrationStore.lookup(REEF_KEYS_MIGRATION_KEY);
				if (!pending) return {
					changes,
					warnings
				};
				try {
					parseReefKeys(await store.lookup(REEF_KEYS_KEY));
					if (!pending?.identityBindingRequired) {
						await migrationStore.delete(REEF_KEYS_MIGRATION_KEY);
						changes.push("Verified Reef identity keys; cleared completed migration marker");
					}
				} catch {
					warnings.push("Reef identity key migration is incomplete and keys.json is missing; left migration blocker in place");
				}
				return {
					changes,
					warnings
				};
			}
			const existingMarker = await migrationStore.lookup(REEF_KEYS_MIGRATION_KEY);
			const configuredBinding = configuredReefIdentityBinding(params.config);
			const identityBindingRequired = existingMarker?.identityBindingRequired || await legacyReefFileExists(path.join(resolveLegacyReefStateDir(params), "identity.json")) || configuredBinding.status !== "absent";
			await migrationStore.register(REEF_KEYS_MIGRATION_KEY, {
				pending: true,
				identityBindingRequired
			});
			let keys;
			try {
				keys = parseReefKeys(JSON.parse(await fs.readFile(filePath, "utf8")));
			} catch (error) {
				if (error.code === "ENOENT") return {
					changes,
					warnings
				};
				warnings.push(`Failed importing Reef identity keys: ${String(error)}; left source in place`);
				return {
					changes,
					warnings
				};
			}
			const existing = await store.lookup(REEF_KEYS_KEY);
			if (existing && JSON.stringify(existing) !== JSON.stringify(keys)) {
				warnings.push("Kept existing Reef identity keys; left differing legacy source in place");
				return {
					changes,
					warnings
				};
			}
			if (!existing) try {
				await store.registerIfAbsent(REEF_KEYS_KEY, keys);
			} catch (error) {
				warnings.push(`Failed importing Reef identity keys: ${String(error)}; left source in place`);
				return {
					changes,
					warnings
				};
			}
			const persisted = await store.lookup(REEF_KEYS_KEY);
			try {
				if (JSON.stringify(parseReefKeys(persisted)) !== JSON.stringify(keys)) throw new Error("persisted value differs");
			} catch (error) {
				warnings.push(`Failed verifying Reef identity keys after import: ${String(error)}; left source in place`);
				return {
					changes,
					warnings
				};
			}
			changes.push("Migrated Reef identity keys -> plugin state");
			const warningCount = warnings.length;
			await archiveLegacyStateSource({
				filePath,
				label: "Reef identity keys",
				changes,
				warnings
			});
			if (warnings.length === warningCount && !identityBindingRequired) await migrationStore.delete(REEF_KEYS_MIGRATION_KEY);
			return {
				changes,
				warnings
			};
		}
	},
	{
		id: "reef-registration-json-to-plugin-state",
		label: "Reef registration state",
		async detectLegacyState(params) {
			const stateDir = resolveLegacyReefStateDir(params);
			const migrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_KEYS_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const files = (await Promise.all(REEF_LEGACY_REGISTRATION_SOURCES.map(async (source) => ({
				source,
				exists: await legacyReefFileExists(path.join(stateDir, source.filename))
			})))).filter((entry) => entry.exists);
			const pending = await migrationStore.lookup(REEF_KEYS_MIGRATION_KEY);
			const configuredBindingNeedsImport = configuredReefIdentityBinding(params.config).status !== "absent" && await legacyReefFileExists(path.join(stateDir, "keys.json"));
			return files.length > 0 || pending?.identityBindingRequired || configuredBindingNeedsImport ? { preview: [files.length > 0 ? `- Reef registration state -> plugin state (${files.map((entry) => entry.source.filename).join(", ")})` : configuredBindingNeedsImport ? "- Reef configured identity binding -> plugin state" : "- Verify Reef identity binding migration marker"] } : null;
		},
		async migrateLegacyState(params) {
			const changes = [];
			const warnings = [];
			const stateDir = resolveLegacyReefStateDir(params);
			const store = params.context.openPluginStateKeyedStore({
				namespace: REEF_REGISTRATION_NAMESPACE,
				maxEntries: 2,
				overflowPolicy: "reject-new"
			});
			const migrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_KEYS_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			const durableMigrationStore = params.context.openPluginStateKeyedStore({
				namespace: REEF_DURABLE_MIGRATION_NAMESPACE,
				maxEntries: 1,
				overflowPolicy: "reject-new"
			});
			if ((await Promise.all(REEF_LEGACY_REGISTRATION_SOURCES.map((source) => legacyReefFileExists(path.join(stateDir, source.filename))))).some(Boolean) || await migrationStore.lookup("keys-json") || await durableMigrationStore.lookup("legacy-files")) await durableMigrationStore.register(REEF_DURABLE_MIGRATION_KEY, { pending: true });
			for (const source of REEF_LEGACY_REGISTRATION_SOURCES) {
				const filePath = path.join(stateDir, source.filename);
				if (!await legacyReefFileExists(filePath)) continue;
				let legacy;
				try {
					legacy = source.parse(JSON.parse(await fs.readFile(filePath, "utf8")));
				} catch {}
				if (!legacy) {
					warnings.push(`Failed importing ${source.label}: invalid JSON; left source in place`);
					continue;
				}
				const existing = await store.lookup(source.key);
				const normalizedExisting = source.parse(existing);
				if (normalizedExisting && JSON.stringify(normalizedExisting) !== JSON.stringify(legacy)) {
					warnings.push(`Kept existing ${source.label}; left differing legacy source in place`);
					continue;
				}
				if (!normalizedExisting) try {
					await store.registerIfAbsent(source.key, legacy);
				} catch (error) {
					warnings.push(`Failed importing ${source.label}: ${String(error)}; left source in place`);
					continue;
				}
				const persisted = source.parse(await store.lookup(source.key));
				if (!persisted || JSON.stringify(persisted) !== JSON.stringify(legacy)) {
					warnings.push(`Failed verifying ${source.label}; left source in place`);
					continue;
				}
				changes.push(`Migrated ${source.label} -> plugin state`);
				await archiveLegacyStateSource({
					filePath,
					label: source.label,
					changes,
					warnings
				});
			}
			const configuredBindingResult = configuredReefIdentityBinding(params.config);
			const configuredBinding = configuredBindingResult.status === "valid" ? configuredBindingResult.binding : void 0;
			if (configuredBinding) {
				const existing = parseReefIdentityBinding(await store.lookup(REEF_REGISTRATION_IDENTITY_KEY));
				if (existing && JSON.stringify(existing) !== JSON.stringify(configuredBinding)) warnings.push("Kept existing Reef identity binding; configured handle or relay differs");
				else if (!existing) try {
					await store.registerIfAbsent(REEF_REGISTRATION_IDENTITY_KEY, configuredBinding);
					const persisted = parseReefIdentityBinding(await store.lookup(REEF_REGISTRATION_IDENTITY_KEY));
					if (JSON.stringify(persisted) !== JSON.stringify(configuredBinding)) throw new Error("persisted value differs");
					changes.push("Migrated Reef identity binding from config -> plugin state");
				} catch (error) {
					warnings.push(`Failed importing Reef identity binding from config: ${String(error)}`);
				}
			}
			if ((await migrationStore.lookup("keys-json"))?.identityBindingRequired) {
				const keysPath = path.join(stateDir, "keys.json");
				const identityPath = path.join(stateDir, "identity.json");
				try {
					parseReefKeys(await params.context.openPluginStateKeyedStore({
						namespace: REEF_KEYS_NAMESPACE,
						maxEntries: 1,
						overflowPolicy: "reject-new"
					}).lookup(REEF_KEYS_KEY));
					const binding = parseReefIdentityBinding(await store.lookup(REEF_REGISTRATION_IDENTITY_KEY));
					if (!binding) throw new Error("canonical identity binding is missing");
					if (configuredBindingResult.status === "invalid") throw new Error("configured handle or relay is invalid");
					if (configuredBinding && JSON.stringify(binding) !== JSON.stringify(configuredBinding)) throw new Error("configured handle or relay differs from canonical identity binding");
					if (await legacyReefFileExists(keysPath) || await legacyReefFileExists(identityPath)) throw new Error("legacy identity sources remain");
					await migrationStore.delete(REEF_KEYS_MIGRATION_KEY);
					changes.push("Verified Reef identity keys and binding; cleared migration marker");
				} catch (error) {
					warnings.push(`Reef identity migration is incomplete: ${String(error)}; left migration blocker in place`);
				}
			}
			return {
				changes,
				warnings
			};
		}
	},
	reefAuditStateMigration,
	reefRuntimeStateMigration,
	{
		id: "reef-config-trust-to-plugin-state",
		label: "Reef peer trust",
		async detectLegacyState({ config, context }) {
			const legacy = inspectLegacyReefFriends(config);
			const markerStore = context.openPluginStateKeyedStore({
				namespace: REEF_CONFIG_IMPORT_NAMESPACE,
				maxEntries: REEF_TRUST_STORE_MAX_ENTRIES,
				overflowPolicy: "reject-new"
			});
			const markedKeys = new Set((await markerStore.entries()).map((entry) => entry.key));
			const legacyConfig = legacy?.config;
			const count = legacyConfig ? [...legacy.friends.keys()].filter((peer) => !markedKeys.has(resolveReefTrustStoreKey(legacyConfig, peer))).length : legacy?.friends.size ?? 0;
			const rejected = legacy?.rejected ?? 0;
			return count > 0 || rejected > 0 ? { preview: [`- Reef peer trust: config -> plugin state (${count} peer(s), ${rejected} invalid)`] } : null;
		},
		async migrateLegacyState({ config, context }) {
			const legacy = inspectLegacyReefFriends(config);
			if (!legacy) return {
				changes: [],
				warnings: []
			};
			const warnings = [];
			if (legacy.rejected > 0) warnings.push(`Skipped ${legacy.rejected} invalid Reef peer trust row(s); left legacy friends config in place`);
			if (!legacy.config) {
				if (legacy.total > 0) warnings.push("Skipped Reef peer trust migration because channels.reef needs a valid handle and canonical config; left legacy friends config in place");
				return {
					changes: [],
					warnings
				};
			}
			const reefConfig = legacy.config;
			if (legacy.friends.size === 0) return {
				changes: [],
				warnings
			};
			const store = context.openPluginStateKeyedStore({
				namespace: REEF_TRUST_STORE_NAMESPACE,
				maxEntries: REEF_TRUST_STORE_MAX_ENTRIES,
				overflowPolicy: "reject-new"
			});
			const markerStore = context.openPluginStateKeyedStore({
				namespace: REEF_CONFIG_IMPORT_NAMESPACE,
				maxEntries: REEF_TRUST_STORE_MAX_ENTRIES,
				overflowPolicy: "reject-new"
			});
			const existingEntries = await store.entries();
			const existingKeys = new Set(existingEntries.map((entry) => entry.key));
			const markerEntries = await markerStore.entries();
			const markedKeys = new Set(markerEntries.map((entry) => entry.key));
			const pendingKeys = [...legacy.friends.keys()].map((peer) => resolveReefTrustStoreKey(reefConfig, peer)).filter((key) => !markedKeys.has(key));
			const missingTrust = pendingKeys.filter((key) => !existingKeys.has(key));
			const availableTrust = Math.max(0, REEF_TRUST_STORE_MAX_ENTRIES - existingEntries.length);
			const availableMarkers = Math.max(0, REEF_TRUST_STORE_MAX_ENTRIES - markerEntries.length);
			if (missingTrust.length > availableTrust || pendingKeys.length > availableMarkers) {
				warnings.push(`Skipped Reef peer trust migration because plugin state has room for ${availableTrust} of ${missingTrust.length} trust row(s) and ${availableMarkers} of ${pendingKeys.length} import marker(s); left legacy friends config in place`);
				return {
					changes: [],
					warnings
				};
			}
			let imported = 0;
			let alreadyPresent = 0;
			for (const [peer, trust] of legacy.friends) {
				const key = resolveReefTrustStoreKey(reefConfig, peer);
				if (markedKeys.has(key)) continue;
				if (await store.registerIfAbsent(key, {
					revision: 1,
					trust: {
						...trust,
						approvedAt: 0
					}
				})) imported++;
				else alreadyPresent++;
				await markerStore.registerIfAbsent(key, {
					version: 1,
					importedAt: Date.now()
				});
				markedKeys.add(key);
			}
			if (imported === 0 && alreadyPresent === 0) return {
				changes: [],
				warnings
			};
			return {
				changes: [`Migrated Reef peer trust -> plugin state (${imported} imported, ${alreadyPresent} already present)`],
				warnings
			};
		}
	}
];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
