import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { r as createDeviceAuthEntry } from "./device-auth-store.kernel-CYN-08F6.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/device-auth-store.ts
const legacyPresenceCache = /* @__PURE__ */ new Map();
function assertNoLegacyDeviceAuth(env) {
	const stateDir = resolveStateDir(env);
	let hasLegacy = legacyPresenceCache.get(stateDir);
	if (hasLegacy === void 0) {
		hasLegacy = fs.existsSync(path.join(stateDir, "identity", "device-auth.json"));
		legacyPresenceCache.set(stateDir, hasLegacy);
	}
	if (hasLegacy) throw new Error("Legacy device auth requires migration; stop the Gateway and run `openclaw doctor --fix`.");
}
/** Forget one process-local legacy-state probe after Doctor removes the source. */
function resetLegacyDeviceAuthPresenceCache(env) {
	legacyPresenceCache.delete(resolveStateDir(env));
}
function captureDeviceAuthOperation(params) {
	assertNoLegacyDeviceAuth(params.env);
	const context = captureOpenClawStateWorkerContext({ env: params.env });
	const { signal, assertCurrent } = params;
	const assertActive = () => {
		context.admission.assertCurrent();
		signal?.throwIfAborted();
		assertCurrent?.();
	};
	return {
		context,
		signal,
		assertActive
	};
}
async function executeDeviceAuth(captured, type, input, readOnly = false) {
	const { context, signal, assertActive } = captured;
	const mutation = type === "deviceAuth.store" || type === "deviceAuth.storeOrigin" || type === "deviceAuth.clear" || type === "deviceAuth.clearOrigin";
	const operation = (scope) => scope.execute({
		type,
		input
	}, { signal });
	const options = {
		assertCurrent: assertActive,
		...mutation ? { createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Device token mutation requires transaction admission");
				assertActive();
				grant();
			})
		}) } : {}
	};
	const result = await (readOnly ? runOpenClawStateWorkerOperation(context, operation, {
		...options,
		existingOnly: true
	}) : runOpenClawStateWorkerOperation(context, operation, options));
	if (!mutation) assertActive();
	return result;
}
/** Prepare the command runtime before connection work, without reading or caching token facts. */
async function prepareDeviceAuthStore(params) {
	await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.prepare", void 0, params.readOnly === true);
}
async function readDeviceAuth(params, readOnly) {
	const { deviceId, role, gatewayScope, onSnapshot } = params;
	const captured = captureDeviceAuthOperation(params);
	const observation = await (gatewayScope === void 0 ? executeDeviceAuth(captured, "deviceAuth.read", {
		deviceId,
		role,
		readOnly
	}, readOnly) : executeDeviceAuth(captured, "deviceAuth.readOrigin", {
		deviceId,
		role,
		gatewayScope,
		readOnly
	}, readOnly)) ?? {
		entry: null,
		expectedToken: null
	};
	captured.assertActive();
	onSnapshot?.(observation);
	return observation.entry;
}
function loadDeviceAuthToken(params) {
	return readDeviceAuth(params, false);
}
function loadDeviceAuthTokenReadOnly(params) {
	return readDeviceAuth(params, true);
}
async function loadDeviceAuthTokens(params) {
	const deviceId = params.deviceId;
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.list", { deviceId });
}
async function storeDeviceAuthToken(params) {
	const input = {
		deviceId: params.deviceId,
		...createDeviceAuthEntry(params),
		expectedToken: params.expectedToken
	};
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.store", input);
}
async function clearDeviceAuthToken(params) {
	const { deviceId, role, expectedToken, observedToken } = params;
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.clear", {
		deviceId,
		role,
		expectedToken,
		observedToken
	});
}
function loadOriginDeviceToken(params) {
	return readDeviceAuth(params, false);
}
function loadOriginDeviceTokenReadOnly(params) {
	return readDeviceAuth(params, true);
}
async function storeOriginDeviceToken(params) {
	const input = {
		gatewayScope: params.gatewayScope,
		deviceId: params.deviceId,
		...createDeviceAuthEntry(params),
		expectedToken: params.expectedToken
	};
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.storeOrigin", input);
}
async function clearOriginDeviceToken(params) {
	const { deviceId, role, gatewayScope, expectedToken, observedToken } = params;
	return await executeDeviceAuth(captureDeviceAuthOperation(params), "deviceAuth.clearOrigin", {
		deviceId,
		role,
		gatewayScope,
		expectedToken,
		observedToken
	});
}
//#endregion
export { loadDeviceAuthTokens as a, prepareDeviceAuthStore as c, storeOriginDeviceToken as d, loadDeviceAuthTokenReadOnly as i, resetLegacyDeviceAuthPresenceCache as l, clearOriginDeviceToken as n, loadOriginDeviceToken as o, loadDeviceAuthToken as r, loadOriginDeviceTokenReadOnly as s, clearDeviceAuthToken as t, storeDeviceAuthToken as u };
