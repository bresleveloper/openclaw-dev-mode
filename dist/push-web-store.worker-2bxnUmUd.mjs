import { b as publishSqliteDatabaseAdmission, c as getSqliteDatabaseAdmission, tt as parseSqliteTableDefinition } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { f as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-ensure-BdqUBvvX.mjs";
import { D as ensureUserProfilesSchema, h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-CBUpoSHj.mjs";
import { a as hashWebPushEndpoint, c as webPushSubscriptionFromRow, i as boundWebPushSubscriptionFromRow, l as webPushSubscriptionToRow, n as WEB_PUSH_VAPID_STATE_KEY, p as normalizeWebPushDevicePreferences, r as WebPushSubscriptionBindingError } from "./push-web-store.records-Bum4pQI9.mjs";
import { t as boundWebPushSubscriptionsAdmission } from "./push-web-store.cache-BaRZ4qtJ.mjs";
import { t as ensureWebPushSubscriptionBindingColumns } from "./push-web-store.schema-DDXiM9B-.mjs";
//#region src/infra/push-web-store.database.worker.ts
const WEB_PUSH_APPROVAL_RECOVERY_MAX_APPROVALS = 1024;
const webPushBindingSchemas = /* @__PURE__ */ new WeakSet();
const ensureWebPushApprovalDeliveryStateSchema = createOpenClawStateSchemaEnsurer({
	table: "web_push_approval_deliveries",
	indexes: ["idx_web_push_approval_deliveries_subscription"],
	endMarker: "  ON web_push_approval_deliveries(subscription_id, approval_id);\n",
	operationLabel: "web-push.approval-delivery.schema.ensure"
});
function webPushDatabaseOptions(database) {
	return {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	};
}
function ensureWebPushSubscriptionBindingSchema(database) {
	const schema = getAdmittedSqliteSchemaFacts(database.db);
	if (schema) {
		if (webPushBindingSchemas.has(schema)) return;
		const table = schema.tableSql.get("web_push_subscriptions");
		const columns = table ? parseSqliteTableDefinition(table, "web_push_subscriptions").columns : void 0;
		if (columns?.has("device_id") && columns.has("user_profile_id") && columns.has("preferences_json")) {
			webPushBindingSchemas.add(schema);
			return;
		}
	}
	runOpenClawStateWriteTransaction(({ db }) => ensureWebPushSubscriptionBindingColumns(db), webPushDatabaseOptions(database), { operationLabel: "web-push.subscription-binding.schema.ensure" });
	const installed = getAdmittedSqliteSchemaFacts(database.db);
	if (installed) webPushBindingSchemas.add(installed);
}
function ensureWebPushApprovalDeliverySchema(database) {
	ensureWebPushApprovalDeliveryStateSchema(webPushDatabaseOptions(database));
}
function runWebPushSubscriptionMutation(params, boundProfile, mutate) {
	ensureWebPushSubscriptionBindingSchema(params.database);
	const options = webPushDatabaseOptions(params.database);
	if (params.requestProfiles?.original || params.requestProfiles?.current) ensureUserProfilesSchema(options);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const profiles = params.requestProfiles;
		let facts;
		if (profiles) {
			const resolve = (reference) => reference ? selectResolvedUserProfileMetadataById(db, reference)?.id : void 0;
			const original = resolve(profiles.original);
			const current = profiles.current === profiles.original ? original : resolve(profiles.current);
			const bound = boundProfile === profiles.original ? original : boundProfile === profiles.current ? current : resolve(boundProfile);
			facts = {
				profileId: current ?? null,
				bindingCurrent: (!profiles.original || original !== void 0) && (!profiles.current || current !== void 0) && (!boundProfile || bound !== void 0) && original === current && bound === current
			};
		}
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts
		});
		return mutate(db);
	}, options);
}
function findBoundWebPushSubscriptionByEndpointInDatabase(params) {
	ensureWebPushSubscriptionBindingSchema(params.database);
	const database = params.database;
	const row = executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", hashWebPushEndpoint(params.endpoint)).where("endpoint", "=", params.endpoint));
	return row ? boundWebPushSubscriptionFromRow(row) : null;
}
function setWebPushSubscriptionPreferencesInDatabase(params) {
	return runWebPushSubscriptionMutation(params, params.expectedUserProfileId, (db) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("web_push_subscriptions").set({
			preferences_json: JSON.stringify(normalizeWebPushDevicePreferences(params.preferences)),
			updated_at_ms: Date.now()
		}).where("endpoint_hash", "=", hashWebPushEndpoint(params.endpoint)).where("endpoint", "=", params.endpoint).where("device_id", "=", params.expectedDeviceId).where("user_profile_id", params.expectedUserProfileId === null ? "is" : "=", params.expectedUserProfileId));
		return Number(result.numAffectedRows ?? 0) === 1;
	});
}
function listWebPushSubscriptionsInDatabase(database) {
	ensureWebPushSubscriptionBindingSchema(database);
	const stateDb = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, stateDb.selectFrom("web_push_subscriptions").select([
		"subscription_id",
		"endpoint",
		"p256dh",
		"auth",
		"created_at_ms",
		"updated_at_ms"
	]).orderBy("created_at_ms", "asc").orderBy("subscription_id", "asc")).rows.map(webPushSubscriptionFromRow);
}
function hasBoundWebPushSubscriptionsInDatabase(database) {
	ensureWebPushSubscriptionBindingSchema(database);
	const { db } = database;
	const admitted = getSqliteDatabaseAdmission(db, boundWebPushSubscriptionsAdmission);
	if (admitted !== void 0) return admitted;
	const hasBound = Boolean(executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("web_push_subscriptions").select("subscription_id").where("device_id", "is not", null).where("device_id", "!=", "").limit(1)));
	publishSqliteDatabaseAdmission(db, boundWebPushSubscriptionsAdmission, hasBound);
	return hasBound;
}
/** Lists only subscriptions reconciled by an authenticated browser device. */
function listBoundWebPushSubscriptionsInDatabase(database) {
	ensureWebPushSubscriptionBindingSchema(database);
	return executeSqliteQuerySync(database.db, getNodeSqliteKysely(database.db).selectFrom("web_push_subscriptions").selectAll().where("device_id", "is not", null).orderBy("created_at_ms", "asc").orderBy("subscription_id", "asc")).rows.flatMap((row) => {
		const subscription = boundWebPushSubscriptionFromRow(row);
		return subscription ? [subscription] : [];
	});
}
/**
* Record the subscriptions that may receive the request before network I/O.
* Definite failures are removed after send; retaining the crash-ambiguous set
* lets restart recovery replace any actionable notification that may exist.
*/
function prepareWebPushApprovalDeliveriesInDatabase(params) {
	const subscriptionsById = new Map(params.subscriptions.map((subscription) => [subscription.subscriptionId, subscription]));
	if (subscriptionsById.size === 0) return [];
	ensureWebPushApprovalDeliverySchema(params.database);
	const options = webPushDatabaseOptions(params.database);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		if (executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("operator_approvals").select("status").where("approval_id", "=", params.approvalId))?.status !== "pending") return [];
		const currentSubscriptions = executeSqliteQuerySync(db, stateDb.selectFrom("web_push_subscriptions").select([
			"subscription_id",
			"device_id",
			"user_profile_id"
		]).where("subscription_id", "in", [...subscriptionsById.keys()])).rows.flatMap((row) => {
			const prepared = subscriptionsById.get(row.subscription_id);
			return prepared?.deviceId === row.device_id && prepared.userProfileId === row.user_profile_id ? [prepared] : [];
		});
		if (currentSubscriptions.length === 0) return [];
		executeSqliteQuerySync(db, stateDb.insertInto("web_push_approval_deliveries").values(currentSubscriptions.map((subscription) => ({
			approval_id: params.approvalId,
			subscription_id: subscription.subscriptionId,
			device_id: subscription.deviceId,
			user_profile_id: subscription.userProfileId,
			prepared_at_ms: params.preparedAtMs
		}))).onConflict((conflict) => conflict.columns(["approval_id", "subscription_id"]).doUpdateSet({
			device_id: (eb) => eb.ref("excluded.device_id"),
			user_profile_id: (eb) => eb.ref("excluded.user_profile_id"),
			prepared_at_ms: params.preparedAtMs
		})));
		return currentSubscriptions.map((subscription) => subscription.subscriptionId);
	}, options);
}
/** Load current targets and discard rows whose original browser ownership no longer matches. */
function listWebPushApprovalDeliveryTargetsInDatabase(params) {
	ensureWebPushApprovalDeliverySchema(params.database);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const stateDb = getNodeSqliteKysely(db);
		const rows = executeSqliteQuerySync(db, stateDb.selectFrom("web_push_approval_deliveries").innerJoin("web_push_subscriptions", "web_push_subscriptions.subscription_id", "web_push_approval_deliveries.subscription_id").selectAll("web_push_subscriptions").select(["web_push_approval_deliveries.device_id as delivery_device_id", "web_push_approval_deliveries.user_profile_id as delivery_user_profile_id"]).where("web_push_approval_deliveries.approval_id", "=", params.approvalId).orderBy("web_push_subscriptions.created_at_ms", "asc").orderBy("web_push_subscriptions.subscription_id", "asc")).rows;
		const staleSubscriptionIds = new Set(rows.filter((row) => row.device_id !== row.delivery_device_id || row.user_profile_id !== row.delivery_user_profile_id).map((row) => row.subscription_id));
		if (staleSubscriptionIds.size > 0) executeSqliteQuerySync(db, stateDb.deleteFrom("web_push_approval_deliveries").where("approval_id", "=", params.approvalId).where("subscription_id", "in", [...staleSubscriptionIds]));
		return rows.flatMap((row) => {
			if (staleSubscriptionIds.has(row.subscription_id)) return [];
			const subscription = boundWebPushSubscriptionFromRow(row);
			return subscription ? [subscription] : [];
		});
	}, webPushDatabaseOptions(params.database));
}
/** Remove only targets whose terminal replacement was accepted. */
function deleteWebPushApprovalDeliveryTargetsInDatabase(params) {
	const subscriptionIds = [...new Set(params.subscriptionIds)];
	if (subscriptionIds.length === 0) return;
	ensureWebPushApprovalDeliverySchema(params.database);
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_approval_deliveries").where("approval_id", "=", params.approvalId).where("subscription_id", "in", subscriptionIds));
	}, webPushDatabaseOptions(params.database));
}
/** Page through a stable snapshot of terminal approvals that still need replacement. */
function listTerminalWebPushApprovalDeliveryIdsInDatabase(params) {
	ensureWebPushApprovalDeliverySchema(params.database);
	const database = params.database;
	const stateDb = getNodeSqliteKysely(database.db);
	const terminalApprovalQuery = () => stateDb.selectFrom("web_push_approval_deliveries").innerJoin("operator_approvals", "operator_approvals.approval_id", "web_push_approval_deliveries.approval_id").select("web_push_approval_deliveries.approval_id").distinct().where("operator_approvals.status", "!=", "pending");
	const throughApprovalId = params.throughApprovalId ?? executeSqliteQueryTakeFirstSync(database.db, terminalApprovalQuery().orderBy("web_push_approval_deliveries.approval_id", "desc").limit(1))?.approval_id;
	if (!throughApprovalId) return {
		approvalIds: [],
		nextAfterApprovalId: null,
		throughApprovalId: null
	};
	let pageQuery = terminalApprovalQuery().where("web_push_approval_deliveries.approval_id", "<=", throughApprovalId);
	if (params.afterApprovalId) pageQuery = pageQuery.where("web_push_approval_deliveries.approval_id", ">", params.afterApprovalId);
	const rows = executeSqliteQuerySync(database.db, pageQuery.orderBy("web_push_approval_deliveries.approval_id", "asc").limit(1025)).rows;
	const approvalIds = rows.slice(0, WEB_PUSH_APPROVAL_RECOVERY_MAX_APPROVALS).map((row) => row.approval_id);
	return {
		approvalIds,
		nextAfterApprovalId: rows.length > WEB_PUSH_APPROVAL_RECOVERY_MAX_APPROVALS ? approvalIds.at(-1) ?? null : null,
		throughApprovalId
	};
}
/** Reread the endpoint row inside the write transaction before creating or updating it. */
function upsertWebPushSubscriptionInDatabase(params) {
	return runWebPushSubscriptionMutation(params, params.binding?.userProfileId, (db) => {
		const stateDb = getNodeSqliteKysely(db);
		const existingRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", params.endpointHash));
		if (existingRow && existingRow.endpoint !== params.endpoint) throw new Error("web push endpoint hash collision");
		const subscription = {
			subscriptionId: existingRow?.subscription_id ?? params.candidateSubscriptionId,
			endpoint: params.endpoint,
			keys: { ...params.keys },
			createdAtMs: existingRow?.created_at_ms ?? params.nowMs,
			updatedAtMs: params.nowMs
		};
		const row = webPushSubscriptionToRow({
			endpointHash: params.endpointHash,
			subscription,
			binding: params.binding
		});
		const bindingChanged = Boolean(existingRow && (existingRow.device_id !== row.device_id || existingRow.user_profile_id !== row.user_profile_id));
		if (bindingChanged && existingRow && (existingRow.p256dh !== params.keys.p256dh || existingRow.auth !== params.keys.auth)) throw new WebPushSubscriptionBindingError("existing browser subscription keys required; reconnect from the owning browser");
		executeSqliteQuerySync(db, stateDb.insertInto("web_push_subscriptions").values(row).onConflict((conflict) => conflict.column("endpoint_hash").doUpdateSet({
			subscription_id: row.subscription_id,
			endpoint: row.endpoint,
			p256dh: row.p256dh,
			auth: row.auth,
			device_id: row.device_id,
			user_profile_id: row.user_profile_id,
			preferences_json: bindingChanged ? null : existingRow?.preferences_json ?? null,
			updated_at_ms: row.updated_at_ms
		})));
		publishSqliteDatabaseAdmission(db, boundWebPushSubscriptionsAdmission, row.device_id ? true : void 0);
		return subscription;
	});
}
function deleteBoundWebPushSubscriptionInDatabase(params) {
	return runWebPushSubscriptionMutation(params, params.expectedUserProfileId, (db) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_subscriptions").where("endpoint_hash", "=", params.endpointHash).where("endpoint", "=", params.endpoint).where("device_id", "=", params.expectedDeviceId).where("user_profile_id", params.expectedUserProfileId === null ? "is" : "=", params.expectedUserProfileId));
		const deleted = Number(result.numAffectedRows ?? 0) > 0;
		if (deleted) publishSqliteDatabaseAdmission(db, boundWebPushSubscriptionsAdmission, void 0);
		return deleted;
	});
}
/** Delete an expired send target only if no newer registration replaced it in flight. */
function deleteWebPushSubscriptionIfCurrentInDatabase(params) {
	const subscription = params.subscription;
	ensureWebPushSubscriptionBindingSchema(params.database);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_subscriptions").where("endpoint_hash", "=", params.endpointHash).where("subscription_id", "=", subscription.subscriptionId).where("endpoint", "=", subscription.endpoint).where("p256dh", "=", subscription.keys.p256dh).where("auth", "=", subscription.keys.auth).where("updated_at_ms", "=", subscription.updatedAtMs));
		const deleted = Number(result.numAffectedRows ?? 0) > 0;
		if (deleted) publishSqliteDatabaseAdmission(db, boundWebPushSubscriptionsAdmission, void 0);
		return deleted;
	}, webPushDatabaseOptions(params.database));
}
function readPersistedVapidKeyPairInDatabase(options) {
	return readConfigMachineState("webPush.vapidKeys", options) ?? null;
}
/** First committed keypair wins so concurrent gateway bootstraps share one signing identity. */
function insertVapidKeyPairIfAbsentInDatabase(params) {
	return updateConfigMachineState(WEB_PUSH_VAPID_STATE_KEY, (current) => current ?? params.candidate, webPushDatabaseOptions(params.database));
}
//#endregion
//#region src/infra/push-web-store.worker.ts
const webPushOperations = {
	"webPush.findBoundWebPushSubscriptionByEndpoint": (input, { open }) => findBoundWebPushSubscriptionByEndpointInDatabase({
		...input,
		database: open()
	}),
	"webPush.setWebPushSubscriptionPreferences": (input, { open }) => setWebPushSubscriptionPreferencesInDatabase({
		...input,
		database: open()
	}),
	"webPush.listWebPushSubscriptions": (_input, { open }) => listWebPushSubscriptionsInDatabase(open()),
	"webPush.hasBoundWebPushSubscriptions": (_input, { open }) => hasBoundWebPushSubscriptionsInDatabase(open()),
	"webPush.listBoundWebPushSubscriptions": (_input, { open }) => listBoundWebPushSubscriptionsInDatabase(open()),
	"webPush.prepareWebPushApprovalDeliveries": (input, { open }) => prepareWebPushApprovalDeliveriesInDatabase({
		...input,
		database: open()
	}),
	"webPush.listWebPushApprovalDeliveryTargets": (input, { open }) => listWebPushApprovalDeliveryTargetsInDatabase({
		...input,
		database: open()
	}),
	"webPush.deleteWebPushApprovalDeliveryTargets": (input, { open }) => deleteWebPushApprovalDeliveryTargetsInDatabase({
		...input,
		database: open()
	}),
	"webPush.listTerminalWebPushApprovalDeliveryIds": (input, { open }) => listTerminalWebPushApprovalDeliveryIdsInDatabase({
		...input,
		database: open()
	}),
	"webPush.upsertWebPushSubscription": (input, { open }) => {
		const database = open();
		try {
			return { subscription: upsertWebPushSubscriptionInDatabase({
				...input,
				database
			}) };
		} catch (error) {
			if (error instanceof WebPushSubscriptionBindingError) return { bindingError: error.message };
			throw error;
		}
	},
	"webPush.deleteBoundWebPushSubscription": (input, { open }) => deleteBoundWebPushSubscriptionInDatabase({
		...input,
		database: open()
	}),
	"webPush.deleteWebPushSubscriptionIfCurrent": (input, { open }) => deleteWebPushSubscriptionIfCurrentInDatabase({
		...input,
		database: open()
	}),
	"webPush.readPersistedVapidKeyPair": (_input, { stateOptions }) => readPersistedVapidKeyPairInDatabase(stateOptions()),
	"webPush.insertVapidKeyPairIfAbsent": (input, { open }) => insertVapidKeyPairIfAbsentInDatabase({
		...input,
		database: open()
	})
};
//#endregion
export { webPushOperations };
