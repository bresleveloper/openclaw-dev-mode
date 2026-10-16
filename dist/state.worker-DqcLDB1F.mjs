import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { Dr as ZodError } from "./schemas-BOYIvvln.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { c as readDeferredPluginMigrations, d as recordDeferredPluginMigrationsInTransaction, s as readDeferredPluginMigrationCompletions, t as DeferredPluginMigrationConflictError } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { f as parseOfficialExternalPluginCatalogTimestamp, l as isOfficialExternalPluginCatalogRollback, n as HostedCatalogSignedFeedMonotonicityError, u as isOfficialExternalPluginCatalogSequence } from "./official-external-plugin-catalog-source-B7ojvzQW.mjs";
import { t as publishPluginSourceAdmissionInDatabase } from "./installed-plugin-index-store-write-5ACUs2E_.mjs";
import { n as assertOpenClawStateLeaseWorkerOwnedInTransaction } from "./openclaw-state-lease-worker-Bfyut3YB.mjs";
import { n as normalizeChannel } from "./conversation-binding-session-key-nprwoVeJ.mjs";
import { createHash } from "node:crypto";
//#region src/plugins/conversation-binding-state.kernel.ts
function readPluginBindingApprovalsInDatabase(db) {
	const approvalsDb = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, approvalsDb.selectFrom("plugin_binding_approvals").select([
		"plugin_root",
		"plugin_id",
		"plugin_name",
		"channel",
		"account_id",
		"approved_at"
	]).orderBy("plugin_root", "asc").orderBy("channel", "asc").orderBy("account_id", "asc")).rows.map((row) => ({
		pluginRoot: row.plugin_root,
		pluginId: row.plugin_id,
		pluginName: row.plugin_name ?? void 0,
		channel: normalizeChannel(row.channel),
		accountId: normalizeOptionalString(row.account_id) ?? "default",
		approvedAt: row.approved_at
	}));
}
function upsertPluginBindingApprovalInDatabase(db, entry) {
	const row = {
		plugin_root: entry.pluginRoot,
		channel: normalizeChannel(entry.channel),
		account_id: entry.accountId.trim() || "default",
		plugin_id: entry.pluginId,
		plugin_name: entry.pluginName ?? null,
		approved_at: entry.approvedAt
	};
	const approvalsDb = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, approvalsDb.insertInto("plugin_binding_approvals").values(row).onConflict((conflict) => conflict.columns([
		"plugin_root",
		"channel",
		"account_id"
	]).doUpdateSet({
		plugin_id: (eb) => eb.ref("excluded.plugin_id"),
		plugin_name: (eb) => eb.ref("excluded.plugin_name"),
		approved_at: (eb) => eb.ref("excluded.approved_at")
	})));
}
//#endregion
//#region src/plugins/official-external-plugin-catalog-snapshot-store.kernel.ts
/** Connection-bound hosted catalog snapshot SQL and monotonicity checks. */
function rowToTrustState(row) {
	if (row.trust_mode !== "signed" || !row.trust_key_id || row.trust_signature_count === null || row.trust_threshold === null || !row.trust_verified_at) return;
	return {
		mode: "signed",
		signedBy: row.trust_key_id,
		signatureCount: coerceRequiredSqliteNumber(row.trust_signature_count),
		threshold: coerceRequiredSqliteNumber(row.trust_threshold),
		verifiedAt: row.trust_verified_at
	};
}
function decodeBase64Payload(payload) {
	const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
	return Buffer.from(normalized, "base64").toString("utf8");
}
function readMonotonicStateFromBody(body) {
	try {
		const document = JSON.parse(body);
		if (!isRecord(document)) return;
		const payload = typeof document.payload === "string" ? decodeBase64Payload(document.payload) : body;
		const feed = typeof document.payload === "string" ? JSON.parse(payload) : document;
		if (!isRecord(feed) || !isOfficialExternalPluginCatalogSequence(feed.sequence)) return;
		if (typeof feed.generatedAt !== "string" || parseOfficialExternalPluginCatalogTimestamp(feed.generatedAt) === void 0) return {
			sequence: feed.sequence,
			payloadSha256: createHash("sha256").update(payload).digest("hex")
		};
		return {
			sequence: feed.sequence,
			generatedAt: feed.generatedAt,
			payloadSha256: createHash("sha256").update(payload).digest("hex")
		};
	} catch {
		return;
	}
}
function assertSignedSnapshotWriteIsMonotonic(params) {
	if (params.candidate?.mode !== "signed-feed" || params.current?.trust_mode !== "signed") return;
	const current = readMonotonicStateFromBody(params.current.body);
	if (!current) return;
	if (isOfficialExternalPluginCatalogRollback({
		candidate: params.candidate,
		current
	})) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed sequence is older than current snapshot");
	if (params.candidate.sequence !== current.sequence || current.generatedAt === void 0) return;
	const candidate = readMonotonicStateFromBody(params.candidateBody);
	if (candidate?.sequence === params.candidate.sequence && candidate.payloadSha256 !== current.payloadSha256) throw new HostedCatalogSignedFeedMonotonicityError("hosted catalog signed feed payload changed without a sequence increment");
}
function rowToSnapshot(row) {
	if (!row) return null;
	const metadata = {
		url: row.feed_url,
		status: coerceRequiredSqliteNumber(row.status),
		checksum: row.checksum,
		...row.etag ? { etag: row.etag } : {},
		...row.last_modified ? { lastModified: row.last_modified } : {}
	};
	const trust = rowToTrustState(row);
	const storedMonotonic = trust ? readMonotonicStateFromBody(row.body) : void 0;
	const monotonic = storedMonotonic ? {
		mode: "signed-feed",
		sequence: storedMonotonic.sequence,
		...storedMonotonic.generatedAt ? { generatedAt: storedMonotonic.generatedAt } : {}
	} : void 0;
	return {
		body: row.body,
		metadata,
		savedAt: row.saved_at,
		...trust ? { trust } : {},
		...monotonic ? { monotonic } : {}
	};
}
function readHostedCatalogSnapshotRow(db, url) {
	const stateDb = getNodeSqliteKysely(db);
	return executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("official_external_plugin_catalog_snapshots").select([
		"feed_url",
		"body",
		"status",
		"etag",
		"last_modified",
		"checksum",
		"saved_at",
		"trust_mode",
		"trust_key_id",
		"trust_signature_count",
		"trust_threshold",
		"trust_verified_at"
	]).where("feed_url", "=", url));
}
function readHostedCatalogSnapshotInDatabase(db, url) {
	return rowToSnapshot(readHostedCatalogSnapshotRow(db, url));
}
/** The caller owns the write transaction containing the reread and upsert. */
function writeHostedCatalogSnapshotInDatabase(db, snapshot, now) {
	const stateDb = getNodeSqliteKysely(db);
	assertSignedSnapshotWriteIsMonotonic({
		candidate: snapshot.monotonic,
		candidateBody: snapshot.body,
		current: readHostedCatalogSnapshotRow(db, snapshot.metadata.url)
	});
	const values = {
		body: snapshot.body,
		status: snapshot.metadata.status,
		etag: snapshot.metadata.etag ?? null,
		last_modified: snapshot.metadata.lastModified ?? null,
		checksum: snapshot.metadata.checksum,
		saved_at: snapshot.savedAt,
		updated_at_ms: now,
		trust_mode: snapshot.trust?.mode ?? null,
		trust_key_id: snapshot.trust?.signedBy ?? null,
		trust_signature_count: snapshot.trust?.signatureCount ?? null,
		trust_threshold: snapshot.trust?.threshold ?? null,
		trust_verified_at: snapshot.trust?.verifiedAt ?? null
	};
	executeSqliteQuerySync(db, stateDb.insertInto("official_external_plugin_catalog_snapshots").values({
		feed_url: snapshot.metadata.url,
		...values
	}).onConflict((conflict) => conflict.column("feed_url").doUpdateSet(values)));
}
//#endregion
//#region src/plugins/state.worker.ts
const pluginRuntimeOperations = {
	"plugins.conversationBindingApprovals.read": (_input, { open }) => readPluginBindingApprovalsInDatabase(open().db),
	"plugins.conversationBindingApprovals.upsert": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => upsertPluginBindingApprovalInDatabase(db, input), {
		database: open(),
		...stateOptions()
	}),
	"plugins.catalogSnapshot.read": (input, { open }) => readHostedCatalogSnapshotInDatabase(open().db, input.url),
	"plugins.catalogSnapshot.write": (input, { open, stateOptions }) => {
		const options = {
			database: open(),
			...stateOptions()
		};
		try {
			runOpenClawStateWriteTransaction(({ db }) => writeHostedCatalogSnapshotInDatabase(db, input.snapshot, input.now), options);
			return { ok: true };
		} catch (error) {
			if (error instanceof HostedCatalogSignedFeedMonotonicityError) return {
				ok: false,
				message: error.message
			};
			throw error;
		}
	},
	"plugins.metadata.sourceAdmission.publish": (input, { open, stateOptions }) => runOpenClawStateWriteTransaction(({ db }) => publishPluginSourceAdmissionInDatabase(db, input), {
		database: open(),
		...stateOptions()
	}),
	"plugins.deferredMigrations.record": (input, { open, stateOptions }) => {
		const options = {
			database: open(),
			...stateOptions()
		};
		try {
			return runOpenClawStateWriteTransaction(({ db }) => {
				assertOpenClawStateLeaseWorkerOwnedInTransaction(db, input.identity);
				const transitions = recordDeferredPluginMigrationsInTransaction(db, input);
				assertOpenClawStateLeaseWorkerOwnedInTransaction(db, input.identity, "write", "commit");
				return {
					kind: "recorded",
					transitions
				};
			}, options, { operationLabel: "state.plugin-migration-deferral" });
		} catch (error) {
			if (error instanceof DeferredPluginMigrationConflictError) return {
				kind: "conflict",
				pending: error.pending
			};
			if (error instanceof ZodError) return {
				kind: "invalid",
				issues: error.issues
			};
			throw error;
		}
	},
	"plugins.deferredMigrations.read": (input, { stateOptions }) => readDeferredPluginMigrations({
		...stateOptions(),
		artifactPreservingReadOnly: input.artifactPreservingReadOnly
	}),
	"plugins.deferredMigrations.completions.read": (_input, { stateOptions }) => readDeferredPluginMigrationCompletions(stateOptions())
};
//#endregion
export { pluginRuntimeOperations };
