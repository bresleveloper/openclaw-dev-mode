import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as extractErrorCode, l as readErrorName, s as formatErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { a as hashWebPushEndpoint, o as isValidWebPushEndpoint, r as WebPushSubscriptionBindingError, s as isValidWebPushKey } from "./push-web-store.records-Bum4pQI9.mjs";
import { t as boundWebPushSubscriptionsAdmission } from "./push-web-store.cache-BaRZ4qtJ.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-CP5xMNf9.mjs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { serialize } from "node:v8";
//#region src/infra/push-web-store.scope.ts
const MAX_WEB_PUSH_RETAINED_BYTES = 67108864;
const leases = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.webPushStoreLeases"));
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.webPushStoreAdmissions"), () => {
	const state = {
		count: 0,
		bytes: 0,
		pending: /* @__PURE__ */ new Set()
	};
	registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		await Promise.all([...state.pending].filter((operation) => !identity || operation.context.admission.identity.key === identity.key).map((operation) => operation.settled));
	} });
	return state;
});
async function runAdmittedScope(context, input, operation) {
	context.admission.assertCurrent();
	const bytes = serialize(input).byteLength;
	if (bytes > 33554432 || admissions.count >= 128 || admissions.bytes + bytes > MAX_WEB_PUSH_RETAINED_BYTES) throw new SqliteWorkerError("Web Push storage admission capacity reached", "overloaded");
	const { identity } = context.admission;
	const lease = expectDefined(leases.reserve([identity.key, `path:${identity.canonicalPath}`]), "Web Push storage identity lease");
	const settled = createDeferredCore();
	const pending = {
		context,
		settled: settled.promise
	};
	admissions.pending.add(pending);
	admissions.count += 1;
	admissions.bytes += bytes;
	let budgetHeld = true;
	const releaseBudget = () => {
		if (budgetHeld) {
			budgetHeld = false;
			admissions.count -= 1;
			admissions.bytes -= bytes;
		}
	};
	try {
		await lease.wait();
		context.admission.assertCurrent();
		return await operation(releaseBudget);
	} finally {
		releaseBudget();
		lease.release();
		admissions.pending.delete(pending);
		settled.resolve();
	}
}
function runScope(context, input, operation) {
	const run = () => runAdmittedScope(context, input, operation);
	const maintenance = context.maintenanceScope;
	return maintenance ? maintenance.run(() => maintenance.track(run())) : run();
}
/** Binding writers and snapshot consumers share one short admission interval. */
function runWebPushStoreMutation(context, input, operation) {
	return runScope(context, input, operation);
}
/** Finish policy preparation and start the effect before allowing the next binding mutation. */
async function useWebPushStoreSnapshot(context, input, read, prepare) {
	return (await runScope(context, input, async (releaseBudget) => {
		const prepared = prepare(await read(), () => context.admission.assertCurrent());
		const action = prepared instanceof Promise ? await prepared : prepared;
		context.admission.assertCurrent();
		releaseBudget();
		return { value: action?.start() };
	})).value;
}
//#endregion
//#region src/infra/push-web-store.ts
function context(stateDir) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	if (stateDir) env.OPENCLAW_STATE_DIR = stateDir;
	return captureOpenClawStateWorkerContext({ env });
}
function executeWebPushCommand(type, input, target) {
	const captured = target && typeof target === "object" ? target : context(target);
	return executeOpenClawStateWorker(captured, {
		type,
		input
	});
}
function executeWorkerWebPushMutation(type, input, captured, guard) {
	return runOpenClawStateWorkerOperation(captured, (scope) => scope.execute({
		type,
		input: {
			...input,
			requestProfiles: guard?.profiles
		}
	}), { createAdmission: () => ({
		nativeLocations: [captured.admission.databasePath],
		admission: createSqliteWorkerOperationAdmission((request, grant) => {
			if (request.stage !== "transaction") throw new Error("Web Push mutation requires transaction admission");
			captured.admission.assertCurrent();
			guard?.assertCurrent();
			if (guard) {
				const facts = request.facts;
				if (!isRecord(facts) || facts.profileId !== null && typeof facts.profileId !== "string" || typeof facts.bindingCurrent !== "boolean") throw new Error("Web Push mutation profile facts are invalid");
				guard.assertProfiles({
					profileId: facts.profileId,
					bindingCurrent: facts.bindingCurrent
				});
			}
			grant();
		})
	}) });
}
function withBoundWebPushSubscriptionByEndpoint(params, prepare) {
	const { stateDir, ...input } = params;
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, input, () => executeWebPushCommand("webPush.findBoundWebPushSubscriptionByEndpoint", input, captured), prepare);
}
function withBoundWebPushSubscriptions(stateDir, prepare) {
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, void 0, () => executeWebPushCommand("webPush.listBoundWebPushSubscriptions", void 0, captured), prepare);
}
function withWebPushSubscriptions(stateDir, prepare) {
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, void 0, () => executeWebPushCommand("webPush.listWebPushSubscriptions", void 0, captured), prepare);
}
function setWebPushSubscriptionPreferences(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, () => executeWorkerWebPushMutation("webPush.setWebPushSubscriptionPreferences", input, captured, guard));
}
function listWebPushSubscriptions(stateDir) {
	return executeWebPushCommand("webPush.listWebPushSubscriptions", void 0, stateDir);
}
function hasBoundWebPushSubscriptions(stateDir) {
	const captured = context(stateDir);
	captured.admission.assertCurrent();
	const admitted = getOrLoadSqliteDatabaseAdmissionForPath(captured.admission.databasePath, boundWebPushSubscriptionsAdmission, () => void 0);
	return admitted === void 0 ? executeWebPushCommand("webPush.hasBoundWebPushSubscriptions", void 0, captured) : Promise.resolve(admitted);
}
function prepareWebPushApprovalDeliveries(params) {
	if (params.subscriptions.length === 0) return Promise.resolve([]);
	const { stateDir, ...input } = params;
	return executeWebPushCommand("webPush.prepareWebPushApprovalDeliveries", input, stateDir);
}
function listWebPushApprovalDeliveryTargets(params) {
	const { stateDir, ...input } = params;
	return executeWebPushCommand("webPush.listWebPushApprovalDeliveryTargets", input, stateDir);
}
function deleteWebPushApprovalDeliveryTargets(params) {
	if (params.subscriptionIds.length === 0) return Promise.resolve();
	const { stateDir, ...input } = params;
	return executeWebPushCommand("webPush.deleteWebPushApprovalDeliveryTargets", input, stateDir);
}
function listTerminalWebPushApprovalDeliveryIds(params) {
	const { stateDir, ...input } = params;
	return executeWebPushCommand("webPush.listTerminalWebPushApprovalDeliveryIds", input, stateDir);
}
async function upsertWebPushSubscription(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, async () => {
		const result = await executeWorkerWebPushMutation("webPush.upsertWebPushSubscription", input, captured, guard);
		if (result.bindingError !== void 0) throw new WebPushSubscriptionBindingError(result.bindingError);
		return result.subscription;
	});
}
function deleteBoundWebPushSubscription(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, () => executeWorkerWebPushMutation("webPush.deleteBoundWebPushSubscription", input, captured, guard));
}
function deleteWebPushSubscriptionIfCurrent(params) {
	const { stateDir, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, () => executeWebPushCommand("webPush.deleteWebPushSubscriptionIfCurrent", input, captured));
}
async function readPersistedVapidKeyPair(stateDir) {
	return await runOpenClawStateWorkerOperation(context(stateDir), (scope) => scope.execute({
		type: "webPush.readPersistedVapidKeyPair",
		input: void 0
	}), { existingOnly: true }) ?? null;
}
function insertVapidKeyPairIfAbsent(params) {
	const { stateDir, ...input } = params;
	return executeWebPushCommand("webPush.insertVapidKeyPairIfAbsent", input, stateDir);
}
//#endregion
//#region src/infra/push-web.ts
const log = createSubsystemLogger("gateway/web-push");
const LEGACY_WEB_PUSH_PATHS = ["push/web-push-subscriptions.json", "push/vapid-keys.json"];
const loadWebPushRuntime = createLazyRuntimeModule(() => import("web-push").then((mod) => mod.default ?? mod));
function assertLegacyWebPushMigrationComplete(baseDir) {
	const stateDir = baseDir ?? resolveStateDir();
	if (LEGACY_WEB_PUSH_PATHS.find((relativePath) => {
		const sourcePath = path.join(stateDir, relativePath);
		return pathMayExistSync(sourcePath) || pathMayExistSync(`${sourcePath}.doctor-importing`);
	})) throw new Error(`legacy Web Push state requires migration; run \`openclaw doctor --fix\` before using Web Push`);
}
async function resolveVapidKeys(baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	const envPublic = normalizeOptionalString(process.env.OPENCLAW_VAPID_PUBLIC_KEY);
	const envPrivate = normalizeOptionalString(process.env.OPENCLAW_VAPID_PRIVATE_KEY);
	if (envPublic && envPrivate) return {
		publicKey: envPublic,
		privateKey: envPrivate,
		subject: resolveVapidSubjectFromEnv()
	};
	const existing = await readPersistedVapidKeyPair(baseDir);
	if (existing) return {
		...existing,
		subject: resolveVapidSubjectFromEnv()
	};
	const keys = (await loadWebPushRuntime()).generateVAPIDKeys();
	return {
		...await insertVapidKeyPairIfAbsent({
			candidate: {
				publicKey: keys.publicKey,
				privateKey: keys.privateKey,
				subject: resolveVapidSubjectFromEnv()
			},
			stateDir: baseDir
		}),
		subject: resolveVapidSubjectFromEnv()
	};
}
function resolveVapidSubjectFromEnv() {
	return normalizeOptionalString(process.env.OPENCLAW_VAPID_SUBJECT) ?? "https://openclaw.ai";
}
async function registerWebPushSubscription(params) {
	const { endpoint, keys, baseDir } = params;
	if (!isValidWebPushEndpoint(endpoint)) throw new Error("invalid push subscription endpoint: must be an HTTPS URL under 2048 chars");
	if (!isValidWebPushKey(keys.p256dh) || !isValidWebPushKey(keys.auth)) throw new Error("invalid push subscription keys: must be non-empty strings under 512 chars");
	assertLegacyWebPushMigrationComplete(baseDir);
	return upsertWebPushSubscription({
		endpointHash: hashWebPushEndpoint(endpoint),
		endpoint,
		keys: {
			p256dh: keys.p256dh,
			auth: keys.auth
		},
		binding: params.binding,
		guard: params.guard,
		candidateSubscriptionId: randomUUID(),
		nowMs: Date.now(),
		stateDir: baseDir
	});
}
async function clearBoundWebPushSubscription(params) {
	assertLegacyWebPushMigrationComplete(params.baseDir);
	return deleteBoundWebPushSubscription({
		...params,
		endpointHash: hashWebPushEndpoint(params.endpoint),
		stateDir: params.baseDir
	});
}
async function sendPreparedWebPushNotification(webPush, subscription, payload, deliveryOptions) {
	const pushSubscription = {
		endpoint: subscription.endpoint,
		keys: {
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth
		}
	};
	try {
		const result = await webPush.sendNotification(pushSubscription, JSON.stringify(payload), deliveryOptions);
		return {
			ok: true,
			subscriptionId: subscription.subscriptionId,
			statusCode: result.statusCode
		};
	} catch (err) {
		const failure = isRecord(err) ? err : void 0;
		const statusCode = typeof failure?.statusCode === "number" ? failure.statusCode : void 0;
		const message = formatErrorMessage(err);
		log.warn("Web Push delivery failed", {
			subscriptionId: subscription.subscriptionId,
			endpointHost: new URL(subscription.endpoint).host,
			statusCode,
			error: message,
			errorName: readErrorName(err),
			errorCode: extractErrorCode(err),
			responseBody: typeof failure?.body === "string" ? failure.body : void 0,
			retry: false,
			subscriptionAction: statusCode === 404 || statusCode === 410 ? "prune" : "retain"
		});
		return {
			ok: false,
			subscriptionId: subscription.subscriptionId,
			statusCode,
			error: message
		};
	}
}
async function sendPreparedWebPushNotifications(params) {
	const { subscriptions, webPush } = params;
	if (subscriptions.length === 0) return [];
	const mapped = await Promise.all(subscriptions.map((subscription) => sendPreparedWebPushNotification(webPush, subscription, params.payload, params.deliveryOptions)));
	const expiredSubscriptions = mapped.flatMap((result, i) => !result.ok && (result.statusCode === 410 || result.statusCode === 404) ? [expectDefined(subscriptions[i], "push web sub")] : []);
	for (const subscription of expiredSubscriptions) try {
		assertLegacyWebPushMigrationComplete(params.baseDir);
		await deleteWebPushSubscriptionIfCurrent({
			endpointHash: hashWebPushEndpoint(subscription.endpoint),
			subscription,
			stateDir: params.baseDir
		});
	} catch (error) {
		log.warn("Web Push expired subscription cleanup failed", {
			subscriptionId: subscription.subscriptionId,
			endpointHost: new URL(subscription.endpoint).host,
			error: formatErrorMessage(error),
			errorName: readErrorName(error),
			errorCode: extractErrorCode(error),
			retry: false
		});
	}
	return mapped;
}
/** Prepares transport state so callers can perform final authorization immediately before send. */
async function prepareWebPushNotificationSender(baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	const vapidKeys = await resolveVapidKeys(baseDir);
	const webPush = await loadWebPushRuntime();
	webPush.setVapidDetails(vapidKeys.subject, vapidKeys.publicKey, vapidKeys.privateKey);
	return (params) => sendPreparedWebPushNotifications({
		...params,
		webPush,
		baseDir
	});
}
async function broadcastWebPush(payload, baseDir) {
	assertLegacyWebPushMigrationComplete(baseDir);
	const subscriptions = await listWebPushSubscriptions(baseDir);
	if (subscriptions.length === 0) return [];
	const subscriptionIds = new Set(subscriptions.map((entry) => entry.subscriptionId));
	const send = await prepareWebPushNotificationSender(baseDir);
	return await withWebPushSubscriptions(baseDir, (current) => ({ start: () => send({
		subscriptions: current.filter((entry) => subscriptionIds.has(entry.subscriptionId)),
		payload
	}) })) ?? [];
}
//#endregion
export { resolveVapidKeys as a, listTerminalWebPushApprovalDeliveryIds as c, setWebPushSubscriptionPreferences as d, withBoundWebPushSubscriptionByEndpoint as f, registerWebPushSubscription as i, listWebPushApprovalDeliveryTargets as l, clearBoundWebPushSubscription as n, deleteWebPushApprovalDeliveryTargets as o, withBoundWebPushSubscriptions as p, prepareWebPushNotificationSender as r, hasBoundWebPushSubscriptions as s, broadcastWebPush as t, prepareWebPushApprovalDeliveries as u };
