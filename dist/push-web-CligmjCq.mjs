import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { t as pathMayExistSync } from "./path-existence-O1bMV6vh.mjs";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-PQSbpEtY.mjs";
import { a as hashWebPushEndpoint, o as isValidWebPushEndpoint, r as WebPushSubscriptionBindingError, s as isValidWebPushKey } from "./push-web-store.records-CGk3CZmD.mjs";
import { serialize } from "node:v8";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
const loadNativeWebPushStore = createLazyRuntimeModule(() => import("./push-web-store.native-BV63XDA9.mjs"));
function context(stateDir) {
	const env = cloneEnvWithPlatformSemantics(process.env);
	if (stateDir) env.OPENCLAW_STATE_DIR = stateDir;
	return captureOpenClawStateWorkerContext({ env });
}
function executeWorkerWebPushMutation(type, input, captured, guard) {
	return runOpenClawStateWorkerOperation(captured, (scope) => scope.execute({
		type,
		input: {
			...input,
			requestProfiles: guard?.profiles
		}
	}), {
		assertCurrent: guard?.assertCurrent,
		createAdmission: () => ({
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
		})
	});
}
function withBoundWebPushSubscriptionByEndpoint(params, prepare) {
	const { stateDir, ...input } = params;
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, input, () => executeOpenClawStateWorker(captured, {
		type: "webPush.findBoundWebPushSubscriptionByEndpoint",
		input
	}), prepare);
}
function withBoundWebPushSubscriptions(stateDir, prepare) {
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, void 0, () => executeOpenClawStateWorker(captured, {
		type: "webPush.listBoundWebPushSubscriptions",
		input: void 0
	}), prepare);
}
function withWebPushSubscriptions(stateDir, prepare) {
	const captured = context(stateDir);
	return useWebPushStoreSnapshot(captured, void 0, () => executeOpenClawStateWorker(captured, {
		type: "webPush.listWebPushSubscriptions",
		input: void 0
	}), prepare);
}
async function setWebPushSubscriptionPreferences(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, async () => {
		if (guard?.family === "native-compatibility") return (await loadNativeWebPushStore()).setNativeWebPushSubscriptionPreferences({
			...input,
			assertCurrent: guard.assertCurrent
		}, captured);
		return executeWorkerWebPushMutation("webPush.setWebPushSubscriptionPreferences", input, captured, guard);
	});
}
function listWebPushSubscriptions(stateDir) {
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.listWebPushSubscriptions",
		input: void 0
	});
}
function hasBoundWebPushSubscriptions(stateDir) {
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.hasBoundWebPushSubscriptions",
		input: void 0
	});
}
function prepareWebPushApprovalDeliveries(params) {
	if (params.subscriptions.length === 0) return Promise.resolve([]);
	const { stateDir, ...input } = params;
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.prepareWebPushApprovalDeliveries",
		input
	});
}
function listWebPushApprovalDeliveryTargets(params) {
	const { stateDir, ...input } = params;
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.listWebPushApprovalDeliveryTargets",
		input
	});
}
function deleteWebPushApprovalDeliveryTargets(params) {
	if (params.subscriptionIds.length === 0) return Promise.resolve();
	const { stateDir, ...input } = params;
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.deleteWebPushApprovalDeliveryTargets",
		input
	});
}
function listTerminalWebPushApprovalDeliveryIds(params) {
	const { stateDir, ...input } = params;
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.listTerminalWebPushApprovalDeliveryIds",
		input
	});
}
async function upsertWebPushSubscription(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, async () => {
		if (guard?.family === "native-compatibility") return (await loadNativeWebPushStore()).upsertNativeWebPushSubscription({
			...input,
			assertCurrent: guard.assertCurrent
		}, captured);
		const result = await executeWorkerWebPushMutation("webPush.upsertWebPushSubscription", input, captured, guard);
		if (result.bindingError !== void 0) throw new WebPushSubscriptionBindingError(result.bindingError);
		return result.subscription;
	});
}
async function deleteBoundWebPushSubscription(params) {
	const { stateDir, guard, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, async () => {
		if (guard?.family === "native-compatibility") return (await loadNativeWebPushStore()).deleteNativeBoundWebPushSubscription({
			...input,
			assertCurrent: guard.assertCurrent
		}, captured);
		return executeWorkerWebPushMutation("webPush.deleteBoundWebPushSubscription", input, captured, guard);
	});
}
function deleteWebPushSubscriptionIfCurrent(params) {
	const { stateDir, ...input } = params;
	const captured = context(stateDir);
	return runWebPushStoreMutation(captured, input, () => executeOpenClawStateWorker(captured, {
		type: "webPush.deleteWebPushSubscriptionIfCurrent",
		input
	}));
}
async function readPersistedVapidKeyPair(stateDir) {
	return await runOpenClawStateWorkerOperation(context(stateDir), (scope) => scope.execute({
		type: "webPush.readPersistedVapidKeyPair",
		input: void 0
	}), { existingOnly: true }) ?? null;
}
function insertVapidKeyPairIfAbsent(params) {
	const { stateDir, ...input } = params;
	return executeOpenClawStateWorker(context(stateDir), {
		type: "webPush.insertVapidKeyPairIfAbsent",
		input
	});
}
//#endregion
//#region src/infra/push-web.ts
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
		const statusCode = typeof err === "object" && err !== null && "statusCode" in err ? err.statusCode : void 0;
		const message = typeof err === "object" && err !== null && "message" in err ? err.message : "unknown error";
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
	const mapped = await Promise.all(subscriptions.map((subscription) => sendPreparedWebPushNotification(webPush, subscription, params.payload, params.deliveryOptions).catch((reason) => ({
		ok: false,
		subscriptionId: subscription.subscriptionId,
		error: reason instanceof Error ? reason.message : "unknown error"
	}))));
	const expiredSubscriptions = mapped.flatMap((result, i) => !result.ok && (result.statusCode === 410 || result.statusCode === 404) ? [expectDefined(subscriptions[i], "push web sub")] : []);
	for (const subscription of expiredSubscriptions) try {
		assertLegacyWebPushMigrationComplete(params.baseDir);
		await deleteWebPushSubscriptionIfCurrent({
			endpointHash: hashWebPushEndpoint(subscription.endpoint),
			subscription,
			stateDir: params.baseDir
		});
	} catch {}
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
